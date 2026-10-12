#!/usr/bin/env python3
"""Offline lesson rebuild queue. No network, runtime AI, remote D1 or release writes."""
import argparse
import collections
import contextlib
import fcntl
import hashlib
import json
import os
from pathlib import Path
import re
import sqlite3
import subprocess
import tempfile
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[2]
DEFAULT_STATE = ROOT / 'lesson-pipeline'
EXPECTED_COUNT = 19202
PROTECTED = {'s2-eng-y3-w01-l1'}
REFERENCE = 'worker/migrations/0044_s2_y3_w01_l1_gold_expression.sql'
GATES = ['drafted', 'automated_validation_passed', 'educationally_reviewed',
         'nesa_verified', 'browser_verified', 'fully_approved']


def encoded(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()


def digest(value):
    return hashlib.sha256(encoded(value)).hexdigest()


def file_hash(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def validator_hashes(root=ROOT):
    return {name: file_hash(root / name) for name in [
        'scripts/validate-lessons.mjs', 'scripts/audit-y3-d1-quality.mjs',
        'scripts/gold-pipeline/validate.mjs', 'scripts/gold-pipeline/pipeline.py']}


def now():
    return datetime.now(timezone.utc).isoformat()


def atomic_json(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, name = tempfile.mkstemp(prefix='.checkpoint-', suffix='.tmp', dir=path.parent)
    try:
        with os.fdopen(fd, 'w') as out:
            json.dump(value, out, ensure_ascii=False, sort_keys=True, indent=2)
            out.write('\n')
            out.flush()
            os.fsync(out.fileno())
        os.replace(name, path)
        directory = os.open(path.parent, os.O_DIRECTORY)
        try:
            os.fsync(directory)
        finally:
            os.close(directory)
    finally:
        if os.path.exists(name):
            os.unlink(name)


@contextlib.contextmanager
def locked(state):
    state.mkdir(parents=True, exist_ok=True)
    with (state / '.pipeline.lock').open('a') as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            raise RuntimeError('Another batch owns the checkpoint; retry after it finishes')
        yield


def migration_sources(root=ROOT):
    return {str(p.relative_to(root)): file_hash(p)
            for p in sorted((root / 'worker/migrations').glob('*.sql'))}


def reconstruct(root=ROOT):
    db = sqlite3.connect(':memory:')
    db.row_factory = sqlite3.Row
    for p in sorted((root / 'worker/migrations').glob('*.sql')):
        db.executescript(p.read_text())
    return db


def canonical_stage(stage):
    return {'Early Stage 1': 'ES1', 'Stage 1': 'S1', 'Stage 2': 'S2',
            'Stage 3': 'S3', 'Stage 4': 'S4', 'Stage 5': 'S5', 'Stage 6': 'S6'}.get(stage, stage)


def baseline_data(row):
    # Column metadata overrides JSON in the actual Worker lessonOut path.
    return {**json.loads(row['data']), 'seed_key': row['seed_key'],
            'title': row['title'], 'stage': row['stage'], 'learning_area': row['learning_area']}


def records(db):
    rows = []
    for row in db.execute('SELECT * FROM lessons ORDER BY seed_key'):
        data = baseline_data(row)
        stage = canonical_stage(row['stage'])
        rows.append({'seed_key': row['seed_key'], 'architecture': 'd1-worker',
                     'stage': stage, 'year_level': str(data.get('year_level', '')),
                     'learning_area': row['learning_area'], 'title': row['title'],
                     'priority': 1 if stage in {'S2', 'S4'} else 2,
                     'week': data.get('week'), 'lesson_number': data.get('lesson_number'),
                     'source_sha256': digest(data), 'protected': row['seed_key'] in PROTECTED})
    if len(rows) != EXPECTED_COUNT or len({r['seed_key'] for r in rows}) != EXPECTED_COUNT:
        raise RuntimeError(f'Inventory mismatch: expected {EXPECTED_COUNT} unique rows, got {len(rows)}')
    return rows


def initialise(state, root=ROOT):
    if (state / 'manifest.json').exists() or (state / 'checkpoint.json').exists():
        raise RuntimeError('State already exists; never overwrite checkpoints with init')
    db = reconstruct(root)
    try:
        rows = records(db)
    finally:
        db.close()
    csv_keys = set()
    import csv
    for p in (root / 'docs/inventory').glob('*.csv'):
        if p.name != 'SUMMARY.csv':
            with p.open() as f:
                csv_keys.update(r['seed_key'] for r in csv.DictReader(f))
    if csv_keys != {r['seed_key'] for r in rows}:
        raise RuntimeError('Migration inventory differs from committed curriculum CSVs')
    inventory = state / 'inventory.jsonl'
    inventory.write_bytes(b''.join(encoded(r) + b'\n' for r in rows))
    manifest = {'schema': 1, 'count': len(rows), 'inventory_sha256': file_hash(inventory),
                'migrations': migration_sources(root), 'protected': sorted(PROTECTED),
                'benchmarks': {
                    'd1-worker': {'reference': REFERENCE, 'sha256': file_hash(root / REFERENCE),
                                  'review': 'docs/GOLD_Y3_ENGLISH_W01_L1_REVIEW.md',
                                  'renderer': 'frontend/src/pages/child/ChildLesson.jsx'},
                    'python-library': {'reference': 'backend/lesson_library_s2_english_w09_l1.py',
                                       'status': 'unavailable_in_checkout',
                                       'policy': 'docs/LESSON_BUILD_HANDOFF.md'},
                    'markdown-bank': {'status': 'no_approved_gold_v2_adapter',
                                      'source': 'lesson-bank/tools/build_bank.py'}},
                'stage_counts': dict(collections.Counter(r['stage'] for r in rows))}
    atomic_json(state / 'manifest.json', manifest)
    checkpoint = {'schema': 1, 'manifest_sha256': digest(manifest), 'generation': 0,
                  'lessons': {}, 'history': []}
    atomic_json(state / 'checkpoint.json', checkpoint)
    return {'count': len(rows), 'stage_counts': manifest['stage_counts']}


def load(state, root=ROOT):
    manifest = json.loads((state / 'manifest.json').read_text())
    cp = json.loads((state / 'checkpoint.json').read_text())
    if manifest['schema'] != 1 or cp['schema'] != 1:
        raise RuntimeError('Unsupported checkpoint schema')
    if digest(manifest) != cp['manifest_sha256']:
        raise RuntimeError('Checkpoint/manifest mismatch')
    if file_hash(state / 'inventory.jsonl') != manifest['inventory_sha256']:
        raise RuntimeError('Inventory changed; reconcile rather than resetting progress')
    if migration_sources(root) != manifest['migrations']:
        raise RuntimeError('Source migrations drifted; explicitly reconcile inventory before resuming')
    if file_hash(root / REFERENCE) != manifest['benchmarks']['d1-worker']['sha256']:
        raise RuntimeError('Approved reference changed')
    rows = [json.loads(line) for line in (state / 'inventory.jsonl').read_text().splitlines()]
    if len(rows) != EXPECTED_COUNT or len({r['seed_key'] for r in rows}) != EXPECTED_COUNT:
        raise RuntimeError('Incomplete or duplicate queue')
    keys = {r['seed_key'] for r in rows}
    if not set(cp['lessons']).issubset(keys):
        raise RuntimeError('Unknown checkpoint lesson')
    for key, entry in cp['lessons'].items():
        if key in PROTECTED:
            raise RuntimeError('Protected benchmark must not enter rebuild state')
        if entry['phase'] != 'in_progress':
            verify_artifacts(state, entry)
        gates = entry.get('gates', {})
        if any(gates.get(g) for g in GATES[1:]) and not gates.get('drafted'):
            raise RuntimeError('Review/validation without a draft')
        if any(gates.get(g) for g in GATES[2:]) and not gates.get('automated_validation_passed'):
            raise RuntimeError('Review without automated validation')
        for gate in GATES[2:]:
            if gates.get(gate):
                relative = entry.get('reviews', {}).get(gate)
                if not relative or relative not in entry['artifacts']:
                    raise RuntimeError('Review gate has no persisted human attestation')
                review = json.loads(artifact_path(state, relative).read_text())
                if review.get('content_sha256') != entry.get('content_sha256') or review.get('gate') != gate or review.get('reviewer_type') != 'human' or review.get('decision') != 'pass':
                    raise RuntimeError('Invalid review attestation')
        if gates.get('fully_approved') and not all(gates.get(g) for g in GATES):
            raise RuntimeError('Approval without all required evidence')
    return rows, cp


def artifact_path(state, relative):
    p = (state / relative).resolve()
    if not p.is_relative_to(state.resolve()):
        raise RuntimeError('Artifact escapes state directory')
    return p


def verify_artifacts(state, entry):
    for relative, expected in entry.get('artifacts', {}).items():
        if file_hash(artifact_path(state, relative)) != expected:
            raise RuntimeError(f'Artifact changed after validation: {relative}')


def save(state, cp, event):
    cp['generation'] += 1
    cp['history'].append({'generation': cp['generation'], 'at': now(), **event})
    atomic_json(state / 'checkpoint.json', cp)


def merge_patch(target, patch):
    if not isinstance(patch, dict):
        return patch
    result = dict(target) if isinstance(target, dict) else {}
    for key, value in patch.items():
        if value is None:
            result.pop(key, None)
        else:
            result[key] = merge_patch(result.get(key), value)
    return result


def sql_for(lesson):
    def quoted(text):
        return "'" + text.replace("'", "''") + "'"
    # Never accepts arbitrary SQL or changes identities, ownership, sequence or timestamps.
    return ('-- Standard v2 draft; local review artifact only. Not a numbered migration.\n'
            f'UPDATE lessons SET title={quoted(lesson["title"])}, '
            f'data=json_patch(data,{quoted(encoded(lesson).decode())}) '
            f'WHERE seed_key={quoted(lesson["seed_key"])} AND family_id IS NULL;\n')


def simulate(db, sql, key, patch):
    before = {r['seed_key']: dict(r) for r in db.execute('SELECT * FROM lessons')}
    if key not in before or before[key]['family_id'] is not None:
        raise RuntimeError('Target is absent or privately owned')
    other_tables = {}
    for name in ['assignments', 'submissions']:
        other_tables[name] = [tuple(r) for r in db.execute(f'SELECT * FROM {name}')]
    # Reconstruct once per batch, simulate inside a savepoint, always roll back.
    db.execute('SAVEPOINT pilot')
    try:
        # execute, not executescript: the generated artifact is exactly one UPDATE.
        statement = sql.split('\n', 1)[1].strip()
        cursor = db.execute(statement)
        if cursor.rowcount != 1:
            raise RuntimeError('SQL must target exactly one row')
        after = {r['seed_key']: dict(r) for r in db.execute('SELECT * FROM lessons')}
        changed = [k for k in before if before[k] != after[k]]
        if changed != [key]:
            raise RuntimeError(f'Unexpected writes: {changed}')
        for col, value in before[key].items():
            if col not in {'title', 'data'} and after[key][col] != value:
                raise RuntimeError(f'Metadata changed: {col}')
        if json.loads(after[key]['data']) != merge_patch(json.loads(before[key]['data']), patch):
            raise RuntimeError('SQLite and expected JSON merge differ')
        db.execute(statement)
        again = {r['seed_key']: dict(r) for r in db.execute('SELECT * FROM lessons')}
        if again != after:
            raise RuntimeError('SQL is not idempotent')
        for name, snapshot in other_tables.items():
            if [tuple(r) for r in db.execute(f'SELECT * FROM {name}')] != snapshot:
                raise RuntimeError('Assignments/submissions changed')
        return {'target_rows': 1, 'changed_rows': 1, 'neighbours_unchanged': len(before)-1,
                'identity_and_metadata_preserved': True, 'idempotent': True,
                'assignments_preserved': True, 'largest_statement_bytes': len(statement.encode())}
    finally:
        db.execute('ROLLBACK TO pilot')
        db.execute('RELEASE pilot')


def sequence(row):
    year = re.search(r'\d+', row['year_level'])
    return (row['priority'], int(year[0]) if year else 0, row['stage'],
            row['learning_area'], int(row['week'] or 0), int(row['lesson_number'] or 0), row['seed_key'])


def run_batch(state, inbox, limit=1, seeds=None, root=ROOT):
    # Per-lesson checkpointing makes larger runs recoverable; keep a hard
    # upper bound so one invocation cannot monopolise a writer lock forever.
    if not 1 <= limit <= 16:
        raise RuntimeError('Batches are bounded to 1–16 lessons')
    rows, cp = load(state, root)
    by_key = {r['seed_key']: r for r in rows}
    for key in seeds or []:
        if key not in by_key or key in PROTECTED:
            raise RuntimeError('Unknown/protected selected lesson')
    results = []
    validators = validator_hashes(root)
    db = None
    try:
        for row in sorted(rows, key=sequence):
            key = row['seed_key']
            if row['protected'] or (seeds and key not in seeds):
                continue
            candidate = inbox / f'{key}.json'
            if candidate.is_symlink():
                raise RuntimeError('Authored input must be a regular file, not a symlink')
            previous = cp['lessons'].get(key)
            # Checkpoints with a complete attempt are skipped until input changes.
            input_bytes = candidate.read_bytes() if candidate.exists() else None
            input_hash = hashlib.sha256(input_bytes).hexdigest() if input_bytes is not None else None
            if previous and previous['phase'] != 'in_progress' and previous.get('input_sha256') == input_hash and previous.get('validator_sha256') == validators:
                continue
            # Missing content stays queued; never manufacture 19,202 generic drafts.
            if not candidate.exists():
                if previous and previous['phase'] == 'in_progress':
                    raise RuntimeError(f'Recovery input missing for {key}')
                continue
            if db is None:
                db = reconstruct(root)
            current = db.execute('SELECT * FROM lessons WHERE seed_key=?', (key,)).fetchone()
            baseline = baseline_data(current)
            if digest(baseline) != row['source_sha256']:
                raise RuntimeError('Lesson source drifted')
            gates = {g: False for g in GATES}
            entry = {'phase': 'in_progress', 'input_sha256': input_hash,
                     'source_sha256': row['source_sha256'], 'gates': gates,
                     'validator_sha256': validators,
                     'attempts': (previous or {}).get('attempts', 0)+1}
            cp['lessons'][key] = entry
            save(state, cp, {'event': 'claimed', 'seed_key': key})
            attempt = state / 'artifacts' / key / f'{input_hash}-{digest(validators)[:12]}'
            attempt.mkdir(parents=True, exist_ok=True)
            bundle_path = attempt / 'bundle.json'
            baseline_path = attempt / 'baseline.json'
            sql_path = attempt / 'draft.sql'
            report_path = attempt / 'validation.json'
            bundle_path.write_bytes(input_bytes)
            atomic_json(baseline_path, baseline)
            try:
                bundle = json.loads(bundle_path.read_text())
                lesson = bundle['lesson']
                if lesson['seed_key'] != key:
                    raise RuntimeError('Candidate identity does not match queue')
                sql = sql_for(lesson)
                sql_path.write_text(sql)
                gates['drafted'] = True
                validation = subprocess.run(['node', str(root / 'scripts/gold-pipeline/validate.mjs'),
                                             str(bundle_path), str(baseline_path), str(sql_path)],
                                            cwd=root, capture_output=True, text=True, timeout=60)
                if validation.returncode:
                    raise RuntimeError(validation.stderr.strip() or validation.stdout.strip())
                report = json.loads(validation.stdout)
                report['sqlite'] = simulate(db, sql, key, lesson)
                report['content_sha256'] = digest(bundle)
                report['validator_sha256'] = validators
                gates['automated_validation_passed'] = True
                entry['phase'] = 'awaiting_review'
                entry['content_sha256'] = digest(bundle)
                entry['review_blockers'] = ['Independent educational review', 'Authoritative NESA verification',
                                            'Rendered browser and role-separation verification', 'Owner release approval']
            except (KeyError, ValueError, AssertionError, RuntimeError, subprocess.TimeoutExpired) as error:
                report = {'passed': False, 'error': str(error)}
                entry['phase'] = 'validation_failed'
                entry['error'] = str(error)
            atomic_json(report_path, report)
            entry['artifacts'] = {str(p.relative_to(state)): file_hash(p) for p in attempt.iterdir() if p.is_file()}
            save(state, cp, {'event': entry['phase'], 'seed_key': key})
            results.append({'seed_key': key, 'phase': entry['phase'], 'gates': gates})
            if len(results) == limit:
                break
    finally:
        if db is not None:
            db.close()
    return {'processed': results, 'message': 'No eligible new authored inputs' if not results else 'Checkpoint saved'}


def status(state, root=ROOT):
    rows, cp = load(state, root)
    validators = validator_hashes(root)
    counts = {g: sum(bool(e['gates'][g]) and (g == 'drafted' or e.get('validator_sha256') == validators)
                     for e in cp['lessons'].values()) for g in GATES}
    return {'inventory': len(rows), 'protected_reference': sum(r['protected'] for r in rows),
            'queued': sum(not r['protected'] and r['seed_key'] not in cp['lessons'] for r in rows),
            'phases': dict(collections.Counter(e['phase'] for e in cp['lessons'].values())),
            'gates': counts, 'generation': cp['generation'],
            'requires_revalidation': sum(e.get('validator_sha256') != validators for e in cp['lessons'].values()),
            'note': 'Protected reference is preserved, not counted as a pipeline completion'}


def record_review(state, review_file, root=ROOT):
    _, cp = load(state, root)
    review = json.loads(review_file.read_text())
    key, gate = review['seed_key'], review['gate']
    if key in PROTECTED or gate not in GATES[2:]:
        raise RuntimeError('Only manual review gates can be attested')
    entry = cp['lessons'][key]
    if not entry['gates']['automated_validation_passed']:
        raise RuntimeError('Automated validation must pass before review')
    if entry.get('validator_sha256') != validator_hashes(root):
        raise RuntimeError('Validator changed; rerun before recording review')
    if review['content_sha256'] != entry['content_sha256']:
        raise RuntimeError('Review belongs to a different content revision')
    for field in ['reviewer', 'reviewed_at', 'evidence', 'decision']:
        if not review.get(field):
            raise RuntimeError(f'Missing review {field}')
    if review['decision'] != 'pass' or review.get('reviewer_type') != 'human':
        raise RuntimeError('Requires explicit human pass attestation, not automated approval')
    evidence = review['evidence']
    if not isinstance(evidence, dict) or not evidence:
        raise RuntimeError('Evidence file/hash mapping required')
    for relative, expected in evidence.items():
        if file_hash(artifact_path(state, relative)) != expected:
            raise RuntimeError('Review evidence missing or mismatched')
    if gate == 'nesa_verified':
        bundle_path = next(p for p in entry['artifacts'] if p.endswith('/bundle.json'))
        codes = json.loads(artifact_path(state, bundle_path).read_text())['lesson']['outcome_codes']
        if set(review.get('outcomes', {})) != set(codes):
            raise RuntimeError('NESA attestation must cover every proposed outcome')
        for outcome in review['outcomes'].values():
            if not all(outcome.get(k) for k in ['official_wording', 'lesson_mapping', 'syllabus_version', 'source']):
                raise RuntimeError('NESA wording, mapping, version and official source required')
            if not outcome['source'].startswith('https://curriculum.nsw.edu.au/'):
                raise RuntimeError('Official NESA source required')
    if gate == 'fully_approved' and not all(entry['gates'][g] for g in GATES[:-1]):
        raise RuntimeError('All educational, NESA and browser gates required before approval')
    path = state / 'reviews' / key / f'{gate}-{digest(review)}.json'
    atomic_json(path, review)
    entry['artifacts'].update(evidence)
    entry['artifacts'][str(path.relative_to(state))] = file_hash(path)
    entry.setdefault('reviews', {})[gate] = str(path.relative_to(state))
    entry['gates'][gate] = True
    entry['phase'] = 'fully_approved' if entry['gates']['fully_approved'] else 'awaiting_review'
    save(state, cp, {'event': 'human_attestation', 'seed_key': key, 'gate': gate, 'reviewer': review['reviewer']})
    return {'seed_key': key, 'gate': gate, 'recorded': True}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--state', type=Path, default=DEFAULT_STATE)
    sub = parser.add_subparsers(dest='command', required=True)
    sub.add_parser('init')
    sub.add_parser('status')
    run = sub.add_parser('run')
    run.add_argument('--inbox', type=Path, default=DEFAULT_STATE / 'authored')
    run.add_argument('--limit', type=int, default=1)
    run.add_argument('--seed', action='append')
    review = sub.add_parser('record-review')
    review.add_argument('file', type=Path)
    args = parser.parse_args()
    try:
        with locked(args.state):
            if args.command == 'init':
                result = initialise(args.state)
            elif args.command == 'run':
                result = run_batch(args.state, args.inbox, args.limit, args.seed)
            elif args.command == 'record-review':
                result = record_review(args.state, args.file)
            else:
                result = status(args.state)
        print(json.dumps(result, indent=2))
        if args.command == 'run' and any(r['phase'] == 'validation_failed' for r in result['processed']):
            return 1
        return 0
    except (RuntimeError, ValueError, KeyError, OSError) as error:
        print(json.dumps({'error': str(error)}))
        return 1


if __name__ == '__main__':
    raise SystemExit(main())
