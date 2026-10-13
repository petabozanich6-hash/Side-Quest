"""Tests for worker-isolated checkpoints and safe hub reconciliation."""
import json
import shutil
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import pipeline as p
import parallel_workers as pw


def _entry(input_sha, content_sha=None, passed=True, attempts=1, phase=None):
    gates = {g: False for g in p.GATES}
    gates['drafted'] = True
    gates['automated_validation_passed'] = passed
    content_sha = content_sha or input_sha
    artifacts = {
        f'artifacts/demo/{input_sha[:8]}/bundle.json': input_sha,
        f'artifacts/demo/{input_sha[:8]}/validation.json': content_sha,
    }
    return {
        'phase': phase or ('awaiting_review' if passed else 'validation_failed'),
        'input_sha256': input_sha,
        'content_sha256': content_sha,
        'source_sha256': 'source',
        'gates': gates,
        'validator_sha256': p.validator_hashes(),
        'attempts': attempts,
        'artifacts': artifacts,
        'review_blockers': ['Independent educational review'],
    }


class ParallelWorkerTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.base_temp = tempfile.TemporaryDirectory()
        cls.base = Path(cls.base_temp.name) / 'hub'
        cls.base.mkdir()
        p.initialise(cls.base)

    @classmethod
    def tearDownClass(cls):
        cls.base_temp.cleanup()

    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.hub = Path(self.temp.name) / 'hub'
        shutil.copytree(self.base, self.hub)

    def tearDown(self):
        self.temp.cleanup()

    def _write_artifact_tree(self, state: Path, entry: dict):
        for relative, digest in entry['artifacts'].items():
            path = state / relative
            path.parent.mkdir(parents=True, exist_ok=True)
            # Store digest text so file_hash matches after we rewrite hashes below.
            path.write_text(relative + digest)
            entry['artifacts'][relative] = p.file_hash(path)

    def test_init_worker_copies_queue_without_touching_hub_checkpoint(self):
        hub_before = p.file_hash(self.hub / 'checkpoint.json')
        result = pw.init_worker(self.hub, 'builder-y7', ['s4-hsie-y7-*'], label='Y7 HSIE')
        self.assertEqual(result['worker'], 'builder-y7')
        state = pw.worker_state(self.hub, 'builder-y7')
        self.assertTrue((state / 'checkpoint.json').exists())
        self.assertTrue((state / 'authored').is_dir())
        self.assertEqual(p.file_hash(self.hub / 'checkpoint.json'), hub_before)
        partitions = pw.load_partitions(self.hub)
        self.assertIn('builder-y7', partitions['workers'])

    def test_partition_overlap_rejected(self):
        pw.init_worker(self.hub, 'builder-y7', ['s4-hsie-y7-*'])
        with self.assertRaises(RuntimeError):
            pw.init_worker(self.hub, 'builder-y7b', ['s4-hsie-y7-w25-*'])

    def test_reconcile_merges_independent_batches(self):
        pw.init_worker(self.hub, 'builder-a', ['s4-hsie-y7-*'])
        pw.init_worker(self.hub, 'builder-b', ['s4-eng-y8-*'])
        a = pw.worker_state(self.hub, 'builder-a')
        b = pw.worker_state(self.hub, 'builder-b')
        seed_a, seed_b = 's4-hsie-y7-w25-l1', 's4-eng-y8-w01-l1'
        entry_a = _entry('a' * 64)
        entry_b = _entry('b' * 64)
        self._write_artifact_tree(a, entry_a)
        self._write_artifact_tree(b, entry_b)
        # Point artifacts keys at real hashed files.
        for state, seed, entry in ((a, seed_a, entry_a), (b, seed_b, entry_b)):
            (state / 'authored').mkdir(exist_ok=True)
            authored = {'lesson': {'seed_key': seed}}
            p.atomic_json(state / 'authored' / f'{seed}.json', authored)
            entry['input_sha256'] = p.file_hash(state / 'authored' / f'{seed}.json')
            cp = json.loads((state / 'checkpoint.json').read_text())
            cp['lessons'][seed] = entry
            p.atomic_json(state / 'checkpoint.json', cp)

        hub_count_before = len(json.loads((self.hub / 'checkpoint.json').read_text())['lessons'])
        report = pw.reconcile(self.hub)
        self.assertEqual(len(report['merged']), 2)
        hub_cp = json.loads((self.hub / 'checkpoint.json').read_text())
        self.assertEqual(len(hub_cp['lessons']), hub_count_before + 2)
        self.assertIn(seed_a, hub_cp['lessons'])
        self.assertIn(seed_b, hub_cp['lessons'])
        self.assertTrue((self.hub / 'authored' / f'{seed_a}.json').exists())
        self.assertTrue((self.hub / 'authored' / f'{seed_b}.json').exists())
        # Human gates must remain false.
        for seed in (seed_a, seed_b):
            gates = hub_cp['lessons'][seed]['gates']
            for gate in pw.HUMAN_GATES:
                self.assertFalse(gates.get(gate))

    def test_reconcile_conflict_on_different_validated_content(self):
        pw.init_worker(self.hub, 'builder-a', ['s4-hsie-y7-*'])
        seed = 's4-hsie-y7-w25-l1'
        hub_entry = _entry('c' * 64)
        worker_entry = _entry('d' * 64)
        self._write_artifact_tree(self.hub, hub_entry)
        a = pw.worker_state(self.hub, 'builder-a')
        self._write_artifact_tree(a, worker_entry)
        hub_cp = json.loads((self.hub / 'checkpoint.json').read_text())
        hub_cp['lessons'][seed] = hub_entry
        p.atomic_json(self.hub / 'checkpoint.json', hub_cp)
        wcp = json.loads((a / 'checkpoint.json').read_text())
        wcp['lessons'][seed] = worker_entry
        p.atomic_json(a / 'checkpoint.json', wcp)
        with self.assertRaises(RuntimeError):
            pw.reconcile(self.hub)

    def test_enforce_partition_blocks_foreign_seed(self):
        pw.init_worker(self.hub, 'builder-a', ['s4-hsie-y7-*'])
        state = pw.worker_state(self.hub, 'builder-a')
        inbox = state / 'authored'
        p.atomic_json(inbox / 's4-eng-y8-w01-l1.json', {'lesson': {'seed_key': 's4-eng-y8-w01-l1'}})
        with self.assertRaises(RuntimeError):
            pw.enforce_partition(self.hub, 'builder-a', ['s4-eng-y8-w01-l1'], inbox)

    def test_worker_locks_are_independent(self):
        pw.init_worker(self.hub, 'builder-a', ['s4-hsie-y7-*'])
        pw.init_worker(self.hub, 'builder-b', ['s4-eng-y8-*'])
        a = pw.worker_state(self.hub, 'builder-a')
        b = pw.worker_state(self.hub, 'builder-b')
        with p.locked(a):
            # Holding A must not block B status/load.
            rows, cp = p.load(b)
            self.assertEqual(len(rows), p.EXPECTED_COUNT)
            self.assertEqual(cp['lessons'], {})

    def test_dashboard_reports_quality_flag(self):
        pw.init_worker(self.hub, 'builder-a', ['s4-hsie-y7-*'], label='Y7')
        with patch.object(pw.p, 'ROOT', p.ROOT):
            dash = pw.dashboard(self.hub, root=p.ROOT)
        self.assertTrue(dash['quality_hardening_adopted'])
        self.assertEqual(dash['builders'][0]['worker'], 'builder-a')


if __name__ == '__main__':
    unittest.main()
