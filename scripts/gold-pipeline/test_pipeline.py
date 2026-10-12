"""Local integration/failure tests for the durable rebuild queue."""
import copy
import fcntl
import importlib.util
import json
from pathlib import Path
import shutil
import tempfile
import unittest
from unittest.mock import patch
import pipeline as p

spec = importlib.util.spec_from_file_location('pilot', Path(__file__).with_name('build-pilot.py'))
pilot = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pilot)


class PipelineTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.base_temp = tempfile.TemporaryDirectory()
        cls.base = Path(cls.base_temp.name) / 'state'
        cls.base.mkdir()
        p.initialise(cls.base)
        cls.bundle = pilot.build()

    @classmethod
    def tearDownClass(cls):
        cls.base_temp.cleanup()

    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.state = Path(self.temp.name) / 'state'
        shutil.copytree(self.base, self.state)
        self.inbox = Path(self.temp.name) / 'inbox'
        self.inbox.mkdir()
        self.candidate = self.inbox / f'{pilot.SEED}.json'
        p.atomic_json(self.candidate, self.bundle)

    def tearDown(self):
        self.temp.cleanup()

    def run_pilot(self):
        return p.run_batch(self.state, self.inbox, seeds=[pilot.SEED])

    def cp(self):
        return json.loads((self.state / 'checkpoint.json').read_text())

    def test_complete_inventory_and_current_stage_priority(self):
        rows, _ = p.load(self.state)
        self.assertEqual(len(rows), 19202)
        self.assertEqual(sum(r['stage']=='S2' for r in rows), 1282)
        self.assertEqual(sum(r['stage']=='S4' for r in rows), 3620)
        moved = [r for r in rows if r['seed_key'].startswith('s5-') and r['stage']=='S4']
        self.assertTrue(moved)
        self.assertTrue(all(r['priority']==1 for r in moved))

    def test_real_pilot_validates_without_self_approval(self):
        result = self.run_pilot()['processed'][0]
        self.assertEqual(result['phase'], 'awaiting_review')
        self.assertTrue(result['gates']['automated_validation_passed'])
        self.assertFalse(any(result['gates'][g] for g in p.GATES[2:]))
        entry = self.cp()['lessons'][pilot.SEED]
        report = json.loads(p.artifact_path(self.state, next(x for x in entry['artifacts'] if x.endswith('validation.json'))).read_text())
        self.assertEqual(report['sqlite']['neighbours_unchanged'], 19201)
        self.assertTrue(report['sqlite']['idempotent'])
        self.assertLess(report['sqlite']['largest_statement_bytes'], 95000)

    def test_resume_is_noop_and_retains_checkpoint_bytes(self):
        self.run_pilot()
        before = (self.state / 'checkpoint.json').read_bytes()
        self.assertEqual(self.run_pilot()['processed'], [])
        self.assertEqual((self.state / 'checkpoint.json').read_bytes(), before)

    def test_interruption_after_claim_recovers(self):
        # Kill-equivalent exception before a validation receipt is written.
        with patch.object(p.subprocess, 'run', side_effect=KeyboardInterrupt):
            with self.assertRaises(KeyboardInterrupt):
                self.run_pilot()
        self.assertEqual(self.cp()['lessons'][pilot.SEED]['phase'], 'in_progress')
        self.assertEqual(self.run_pilot()['processed'][0]['phase'], 'awaiting_review')
        self.assertEqual(self.cp()['lessons'][pilot.SEED]['attempts'], 2)

    def test_changed_invalid_input_revokes_prior_gates(self):
        self.run_pilot()
        bad = copy.deepcopy(self.bundle)
        bad['lesson']['outcome_codes'] = []
        p.atomic_json(self.candidate, bad)
        result = self.run_pilot()['processed'][0]
        self.assertEqual(result['phase'], 'validation_failed')
        self.assertTrue(result['gates']['drafted'])
        self.assertFalse(result['gates']['automated_validation_passed'])
        self.assertFalse(result['gates']['fully_approved'])

    def test_failed_input_skipped_until_repaired(self):
        bad = copy.deepcopy(self.bundle)
        bad['lesson']['teach_steps'][0]['explain'] = 'Too shallow.'
        p.atomic_json(self.candidate, bad)
        self.assertEqual(self.run_pilot()['processed'][0]['phase'], 'validation_failed')
        self.assertEqual(self.run_pilot()['processed'], [])
        p.atomic_json(self.candidate, self.bundle)
        self.assertEqual(self.run_pilot()['processed'][0]['phase'], 'awaiting_review')

    def test_missing_authored_content_stays_queued(self):
        self.candidate.unlink()
        self.assertEqual(p.run_batch(self.state, self.inbox)['processed'], [])
        self.assertEqual(p.status(self.state)['queued'], 19201)

    def test_protected_reference_cannot_be_selected(self):
        with self.assertRaisesRegex(RuntimeError, 'protected'):
            p.run_batch(self.state, self.inbox, seeds=['s2-eng-y3-w01-l1'])

    def test_unknown_selected_key_rejected(self):
        with self.assertRaisesRegex(RuntimeError, 'Unknown'):
            p.run_batch(self.state, self.inbox, seeds=['made-up'])

    def test_candidate_identity_mismatch_fails(self):
        bad = copy.deepcopy(self.bundle)
        bad['lesson']['seed_key'] = 's2-eng-y3-w01-l1'
        p.atomic_json(self.candidate, bad)
        self.assertEqual(self.run_pilot()['processed'][0]['phase'], 'validation_failed')

    def test_inventory_tampering_blocks_resume(self):
        with (self.state / 'inventory.jsonl').open('a') as f:
            f.write('{}\n')
        with self.assertRaisesRegex(RuntimeError, 'Inventory changed'):
            self.run_pilot()

    def test_migration_drift_blocks_resume(self):
        with patch.object(p, 'migration_sources', return_value={}):
            with self.assertRaisesRegex(RuntimeError, 'migrations drifted'):
                self.run_pilot()

    def test_artifact_tampering_blocks_resume(self):
        self.run_pilot()
        path = next((self.state / 'artifacts').rglob('draft.sql'))
        path.write_text(path.read_text()+'-- tampered\n')
        with self.assertRaisesRegex(RuntimeError, 'Artifact changed'):
            self.run_pilot()

    def test_validator_change_revalidates_instead_of_skipping(self):
        self.run_pilot()
        changed = {**p.validator_hashes(), 'test-validator-revision': 'different'}
        with patch.object(p, 'validator_hashes', return_value=changed):
            self.assertEqual(self.run_pilot()['processed'][0]['phase'], 'awaiting_review')
        self.assertEqual(self.cp()['lessons'][pilot.SEED]['attempts'], 2)

    def test_stale_validation_is_not_counted_as_passed(self):
        self.run_pilot()
        with patch.object(p, 'validator_hashes', return_value={}):
            result = p.status(self.state)
        self.assertEqual(result['gates']['automated_validation_passed'], 0)
        self.assertEqual(result['requires_revalidation'], 1)

    def test_manually_toggled_gate_without_attestation_is_rejected(self):
        self.run_pilot()
        cp = self.cp()
        cp['lessons'][pilot.SEED]['gates']['educationally_reviewed'] = True
        p.atomic_json(self.state / 'checkpoint.json', cp)
        with self.assertRaisesRegex(RuntimeError, 'human attestation'):
            p.status(self.state)

    def test_init_cannot_reset_existing_checkpoint(self):
        with self.assertRaisesRegex(RuntimeError, 'already exists'):
            p.initialise(self.state)

    def test_batch_limit_enforced(self):
        for limit in [0, 6, 1000]:
            with self.assertRaisesRegex(RuntimeError, 'bounded'):
                p.run_batch(self.state, self.inbox, limit=limit)

    def test_lock_excludes_concurrent_writer(self):
        with p.locked(self.state):
            with self.assertRaisesRegex(RuntimeError, 'Another batch'):
                with p.locked(self.state):
                    pass

    def test_atomic_save_preserves_old_file_on_failure(self):
        path = self.state / 'checkpoint.json'
        before = path.read_bytes()
        with patch.object(p.os, 'replace', side_effect=OSError('disk failure')):
            with self.assertRaises(OSError):
                p.atomic_json(path, {'corrupt': True})
        self.assertEqual(path.read_bytes(), before)

    def review(self, gate, **changes):
        self.run_pilot()
        entry = self.cp()['lessons'][pilot.SEED]
        review = {'seed_key':pilot.SEED, 'gate':gate, 'content_sha256':entry['content_sha256'],
                  'reviewer':'Test human attestation fixture', 'reviewer_type':'human',
                  'reviewed_at':'2026-10-12', 'decision':'pass',
                  'evidence':{next(k for k in entry['artifacts'] if k.endswith('/bundle.json')):
                              next(v for k,v in entry['artifacts'].items() if k.endswith('/bundle.json'))},
                  **changes}
        path = self.state / 'test-attestation.json'
        p.atomic_json(path, review)
        return path

    def test_approval_requires_all_gates(self):
        path = self.review('fully_approved')
        with self.assertRaisesRegex(RuntimeError, 'All educational'):
            p.record_review(self.state, path)

    def test_nesa_requires_exact_official_mapping(self):
        path = self.review('nesa_verified')
        with self.assertRaisesRegex(RuntimeError, 'every proposed outcome'):
            p.record_review(self.state, path)

    def test_review_bound_to_content_revision(self):
        path = self.review('educationally_reviewed', content_sha256='wrong')
        with self.assertRaisesRegex(RuntimeError, 'different content revision'):
            p.record_review(self.state, path)

    def test_automated_agent_cannot_self_signoff(self):
        path = self.review('educationally_reviewed', reviewer_type='automated')
        with self.assertRaisesRegex(RuntimeError, 'human pass'):
            p.record_review(self.state, path)

    def test_human_review_does_not_imply_nesa_or_approval(self):
        path = self.review('educationally_reviewed')
        p.record_review(self.state, path)
        gates = self.cp()['lessons'][pilot.SEED]['gates']
        self.assertTrue(gates['educationally_reviewed'])
        self.assertFalse(gates['nesa_verified'])
        self.assertFalse(gates['fully_approved'])

    def test_sql_simulation_preserves_existing_assignment_and_owner_metadata(self):
        db = p.reconstruct()
        try:
            row = db.execute('SELECT id FROM lessons WHERE seed_key=?', (pilot.SEED,)).fetchone()
            db.execute("INSERT INTO assignments(id,family_id,student_id,lesson_id,created_at) VALUES('sentinel','f','s',?,'old')", (row['id'],))
            db.commit()
            report = p.simulate(db, p.sql_for(self.bundle['lesson']), pilot.SEED, self.bundle['lesson'])
            self.assertTrue(report['assignments_preserved'])
            self.assertEqual(db.execute("SELECT lesson_id FROM assignments WHERE id='sentinel'").fetchone()[0], row['id'])
        finally:
            db.close()


if __name__ == '__main__':
    unittest.main(verbosity=2)
