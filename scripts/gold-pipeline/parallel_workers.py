#!/usr/bin/env python3
"""Worker-isolated Gold v2 pipeline state and safe reconciliation.

Each worker owns a subdirectory under lesson-pipeline/workers/<id>/ with its
own checkpoint, lock, authored inbox and artifacts. Shared inventory and
manifest are copied from the hub (never reset). Reconciliation merges worker
progress into the hub without inventing human/NESA/browser/release gates.
"""
from __future__ import annotations

import argparse
import collections
import fnmatch
import json
import os
import re
import shutil
from pathlib import Path

import pipeline as p

WORKER_ID_RE = re.compile(r'^[a-z][a-z0-9_-]{0,47}$')
HUMAN_GATES = ['educationally_reviewed', 'nesa_verified', 'browser_verified', 'fully_approved']
PARTITIONS_NAME = 'partitions.json'


def assert_worker_id(worker_id: str) -> str:
    if not WORKER_ID_RE.match(worker_id or ''):
        raise RuntimeError('Worker id must be lowercase alphanumeric/underscore/hyphen, starting with a letter')
    return worker_id


def worker_state(hub: Path, worker_id: str) -> Path:
    return Path(hub) / 'workers' / assert_worker_id(worker_id)


def load_partitions(hub: Path) -> dict:
    path = Path(hub) / PARTITIONS_NAME
    if not path.exists():
        return {'schema': 1, 'workers': {}}
    data = json.loads(path.read_text())
    if data.get('schema') != 1:
        raise RuntimeError('Unsupported partitions schema')
    data.setdefault('workers', {})
    return data


def save_partitions(hub: Path, data: dict) -> None:
    p.atomic_json(Path(hub) / PARTITIONS_NAME, data)


def seed_matches(seed_key: str, patterns: list[str]) -> bool:
    for pattern in patterns:
        if '*' in pattern or '?' in pattern:
            if fnmatch.fnmatchcase(seed_key, pattern):
                return True
        elif seed_key == pattern:
            return True
    return False


def partition_owner(partitions: dict, seed_key: str) -> str | None:
    owners = []
    for worker_id, meta in partitions.get('workers', {}).items():
        if seed_matches(seed_key, meta.get('seed_patterns') or []):
            owners.append(worker_id)
    if len(owners) > 1:
        raise RuntimeError(f'Seed {seed_key} matches multiple partitions: {owners}')
    return owners[0] if owners else None


def init_worker(hub: Path, worker_id: str, seed_patterns: list[str], label: str | None = None,
                force: bool = False) -> dict:
    hub = Path(hub)
    worker_id = assert_worker_id(worker_id)
    if not seed_patterns:
        raise RuntimeError('Worker requires at least one seed_pattern (prefix* or exact key)')
    if not (hub / 'manifest.json').exists() or not (hub / 'inventory.jsonl').exists():
        raise RuntimeError('Hub lesson-pipeline must already contain manifest.json and inventory.jsonl')
    if (hub / 'checkpoint.json').exists() is False:
        raise RuntimeError('Hub checkpoint.json missing; refuse to init worker over empty hub')

    state = worker_state(hub, worker_id)
    if state.exists() and not force:
        if (state / 'checkpoint.json').exists():
            raise RuntimeError(f'Worker {worker_id} already initialised; refuse overwrite')
    state.mkdir(parents=True, exist_ok=True)
    (state / 'authored').mkdir(exist_ok=True)
    (state / 'artifacts').mkdir(exist_ok=True)

    # Copy shared queue authority; never rewrite hub inventory/manifest.
    shutil.copy2(hub / 'manifest.json', state / 'manifest.json')
    inventory_dest = state / 'inventory.jsonl'
    if inventory_dest.exists() or inventory_dest.is_symlink():
        inventory_dest.unlink()
    try:
        os.link(hub / 'inventory.jsonl', inventory_dest)
    except OSError:
        shutil.copy2(hub / 'inventory.jsonl', inventory_dest)
    if not (state / 'checkpoint.json').exists():
        manifest = json.loads((state / 'manifest.json').read_text())
        checkpoint = {'schema': 1, 'manifest_sha256': p.digest(manifest), 'generation': 0,
                      'lessons': {}, 'history': [],
                      'worker': {'id': worker_id, 'hub': str(hub.resolve())}}
        p.atomic_json(state / 'checkpoint.json', checkpoint)

    meta = {
        'id': worker_id,
        'label': label or worker_id,
        'seed_patterns': list(seed_patterns),
        'state': str(state.relative_to(hub)) if state.is_relative_to(hub) else str(state),
        'created_at': p.now(),
    }
    partitions = load_partitions(hub)
    # Exclusive ownership: reject overlapping patterns with other workers.
    for other_id, other in partitions.get('workers', {}).items():
        if other_id == worker_id:
            continue
        for pattern in seed_patterns:
            for existing in other.get('seed_patterns') or []:
                if patterns_overlap(pattern, existing):
                    raise RuntimeError(
                        f'Partition overlap: {worker_id} {pattern!r} overlaps {other_id} {existing!r}')
    partitions['workers'][worker_id] = meta
    partitions['updated_at'] = p.now()
    save_partitions(hub, partitions)
    p.atomic_json(state / 'worker.json', meta)
    return {'worker': worker_id, 'state': str(state), 'seed_patterns': seed_patterns}


def patterns_overlap(a: str, b: str) -> bool:
    """Conservative overlap check for exclusive partitions (fnmatch patterns)."""
    if a == b:
        return True
    samples = []
    for pattern in (a, b):
        if pattern.endswith('*') and '*' not in pattern[:-1]:
            samples.append(pattern[:-1] + 'w01-l1')
        elif '*-y3-*' in pattern:
            samples.extend(['s2-eng-y3-w01-l1', 's2-mat-y3-w01-l1'])
        elif '*-y4-*' in pattern:
            samples.extend(['s2-eng-y4-w01-l1', 's2-mat-y4-w01-l1'])
        elif '*-y7-*' in pattern:
            samples.append('s4-eng-y7-w01-l1')
        elif '*-y8-*' in pattern:
            samples.append('s4-eng-y8-w01-l1')
        else:
            samples.append(pattern.replace('*', 'x'))
    for sample in samples:
        if seed_matches(sample, [a]) and seed_matches(sample, [b]):
            return True
    # Prefix nesting: s4-hsie-y7-* vs s4-hsie-y7-w25-*
    if a.endswith('*') and '*' not in a[:-1] and b.endswith('*') and '*' not in b[:-1]:
        return a[:-1].startswith(b[:-1]) or b[:-1].startswith(a[:-1])
    return False


def enforce_partition(hub: Path, worker_id: str, seeds: list[str] | None, inbox: Path) -> None:
    partitions = load_partitions(hub)
    meta = partitions.get('workers', {}).get(worker_id)
    if not meta:
        raise RuntimeError(f'Worker {worker_id} is not registered in {PARTITIONS_NAME}')
    patterns = meta.get('seed_patterns') or []
    candidates = list(seeds or [])
    if not candidates:
        candidates = [path.stem for path in Path(inbox).glob('*.json')]
    for seed in candidates:
        owner = partition_owner(partitions, seed)
        if owner != worker_id:
            raise RuntimeError(
                f'Seed {seed} is not owned by worker {worker_id} (owner={owner or "none"})')
        if not seed_matches(seed, patterns):
            raise RuntimeError(f'Seed {seed} outside worker patterns {patterns}')


def strip_unattested_human_gates(entry: dict) -> dict:
    """Never promote human gates during reconcile without attestation files."""
    out = json.loads(json.dumps(entry))
    gates = out.setdefault('gates', {})
    reviews = out.get('reviews') or {}
    for gate in HUMAN_GATES:
        relative = reviews.get(gate)
        if gates.get(gate) and not relative:
            gates[gate] = False
        if gate == 'fully_approved' and not all(gates.get(g) for g in p.GATES):
            gates['fully_approved'] = False
    if out.get('phase') == 'fully_approved' and not gates.get('fully_approved'):
        out['phase'] = 'awaiting_review'
    return out


def prefer_entry(hub_entry: dict | None, worker_entry: dict, seed: str) -> tuple[dict, str]:
    worker_entry = strip_unattested_human_gates(worker_entry)
    if hub_entry is None:
        return worker_entry, 'adopt_worker'
    hub_entry = strip_unattested_human_gates(hub_entry)
    hub_pass = bool((hub_entry.get('gates') or {}).get('automated_validation_passed'))
    worker_pass = bool((worker_entry.get('gates') or {}).get('automated_validation_passed'))
    same_input = hub_entry.get('input_sha256') == worker_entry.get('input_sha256')

    if hub_pass and worker_pass:
        if same_input:
            return hub_entry, 'keep_hub_identical'
        raise RuntimeError(
            f'Conflict on {seed}: both validated with different authored content '
            f'(hub_input={hub_entry.get("input_sha256")}, '
            f'worker_input={worker_entry.get("input_sha256")})')
    if hub_pass and not worker_pass:
        return hub_entry, 'keep_hub_validated'
    if worker_pass and not hub_pass:
        return worker_entry, 'adopt_worker_validated'
    # Neither validated: keep richer attempt / hub default.
    if hub_entry.get('phase') == 'in_progress' and worker_entry.get('phase') != 'in_progress':
        return worker_entry, 'adopt_worker_finished_attempt'
    if worker_entry.get('attempts', 0) > hub_entry.get('attempts', 0):
        return worker_entry, 'adopt_worker_more_attempts'
    return hub_entry, 'keep_hub_default'


def copy_artifacts(src_state: Path, dest_state: Path, entry: dict) -> dict:
    """Copy artifact files referenced by entry into dest; rewrite relative paths if needed."""
    artifacts = {}
    for relative, digest in (entry.get('artifacts') or {}).items():
        src = p.artifact_path(src_state, relative)
        dest = dest_state / relative
        dest.parent.mkdir(parents=True, exist_ok=True)
        if dest.exists():
            if p.file_hash(dest) != digest:
                # Keep historical sibling rather than overwrite.
                alt = dest.with_name(dest.name + f'.from-worker-{digest[:12]}')
                if not alt.exists():
                    shutil.copy2(src, alt)
                artifacts[str(alt.relative_to(dest_state))] = digest
                continue
            artifacts[relative] = digest
            continue
        shutil.copy2(src, dest)
        if p.file_hash(dest) != digest:
            raise RuntimeError(f'Artifact copy digest mismatch: {relative}')
        artifacts[relative] = digest
    out = dict(entry)
    out['artifacts'] = artifacts
    return out


def copy_authored(src_inbox: Path, dest_inbox: Path, seed: str) -> str:
    src = src_inbox / f'{seed}.json'
    dest_inbox.mkdir(parents=True, exist_ok=True)
    dest = dest_inbox / f'{seed}.json'
    if not src.exists():
        return 'authored_missing_on_worker'
    if dest.exists():
        if p.file_hash(dest) == p.file_hash(src):
            return 'authored_identical'
        raise RuntimeError(f'Authored conflict for {seed}: hub and worker files differ')
    shutil.copy2(src, dest)
    return 'authored_copied'


def reconcile(hub: Path, worker_ids: list[str] | None = None, dry_run: bool = False) -> dict:
    hub = Path(hub)
    partitions = load_partitions(hub)
    selected = worker_ids or sorted(partitions.get('workers', {}))
    if not selected:
        raise RuntimeError('No workers registered to reconcile')

    with p.locked(hub):
        _, hub_cp = p.load(hub)
        report = {'dry_run': dry_run, 'workers': {}, 'merged': [], 'skipped': [], 'conflicts': []}
        hub_lessons = hub_cp['lessons']
        pending_events = []

        for worker_id in selected:
            state = worker_state(hub, worker_id)
            if not (state / 'checkpoint.json').exists():
                raise RuntimeError(f'Worker {worker_id} has no checkpoint')
            with p.locked(state):
                _, worker_cp = p.load(state)
                worker_report = {'adopted': 0, 'kept_hub': 0, 'seeds': []}
                inbox = state / 'authored'
                for seed, worker_entry in sorted(worker_cp['lessons'].items()):
                    owner = partition_owner(partitions, seed)
                    if owner and owner != worker_id:
                        raise RuntimeError(
                            f'Worker {worker_id} checkpoint contains foreign seed {seed} (owner={owner})')
                    try:
                        chosen, reason = prefer_entry(hub_lessons.get(seed), worker_entry, seed)
                    except RuntimeError as error:
                        report['conflicts'].append(str(error))
                        continue
                    if reason.startswith('keep_'):
                        worker_report['kept_hub'] += 1
                        report['skipped'].append({'seed_key': seed, 'reason': reason, 'worker': worker_id})
                        continue
                    if dry_run:
                        worker_report['adopted'] += 1
                        worker_report['seeds'].append(seed)
                        report['merged'].append({'seed_key': seed, 'reason': reason, 'worker': worker_id})
                        continue
                    merged = copy_artifacts(state, hub, chosen)
                    authored_status = copy_authored(inbox, hub / 'authored', seed)
                    hub_lessons[seed] = merged
                    worker_report['adopted'] += 1
                    worker_report['seeds'].append(seed)
                    report['merged'].append({
                        'seed_key': seed, 'reason': reason, 'worker': worker_id,
                        'authored': authored_status,
                    })
                    pending_events.append({
                        'event': 'reconcile_adopt', 'seed_key': seed,
                        'worker': worker_id, 'reason': reason,
                    })
                report['workers'][worker_id] = worker_report

        if report['conflicts']:
            raise RuntimeError('Reconcile aborted: ' + '; '.join(report['conflicts']))

        if not dry_run and pending_events:
            for event in pending_events:
                p.save(hub, hub_cp, event)
            # Touch partitions updated stamp.
            partitions['last_reconcile_at'] = p.now()
            partitions['last_reconcile'] = {
                'workers': selected,
                'merged_count': len(report['merged']),
                'skipped_count': len(report['skipped']),
            }
            save_partitions(hub, partitions)
        report['hub_generation'] = hub_cp['generation']
        report['hub_lesson_count'] = len(hub_cp['lessons'])
        return report


def dashboard(hub: Path, root: Path = p.ROOT) -> dict:
    hub = Path(hub)
    partitions = load_partitions(hub)
    rows = [json.loads(line) for line in (hub / 'inventory.jsonl').read_text().splitlines() if line.strip()]
    by_key = {r['seed_key']: r for r in rows}
    hub_cp = json.loads((hub / 'checkpoint.json').read_text()) if (hub / 'checkpoint.json').exists() else {'lessons': {}}
    hub_validated = {
        sk for sk, entry in hub_cp.get('lessons', {}).items()
        if (entry.get('gates') or {}).get('automated_validation_passed')
    }
    builders = []
    for worker_id, meta in sorted(partitions.get('workers', {}).items()):
        state = worker_state(hub, worker_id)
        patterns = meta.get('seed_patterns') or []
        owned = [sk for sk in by_key if seed_matches(sk, patterns) and sk not in p.PROTECTED]
        authored_dir = state / 'authored' if state.exists() else hub / 'authored'
        authored = {path.stem for path in authored_dir.glob('*.json')} if authored_dir.exists() else set()
        worker_validated = set()
        current = None
        phase_counts = {}
        if (state / 'checkpoint.json').exists():
            wcp = json.loads((state / 'checkpoint.json').read_text())
            phase_counts = dict(collections.Counter(
                e.get('phase') for e in wcp.get('lessons', {}).values()))
            for sk, entry in wcp.get('lessons', {}).items():
                if (entry.get('gates') or {}).get('automated_validation_passed'):
                    worker_validated.add(sk)
            hist = wcp.get('history') or []
            if hist:
                current = hist[-1].get('seed_key')
        owned_authored = sorted(sk for sk in owned if sk in authored)
        owned_validated = sorted(sk for sk in owned if sk in worker_validated or sk in hub_validated)
        remaining = sorted(sk for sk in owned if sk not in hub_validated and sk not in worker_validated)
        builders.append({
            'worker': worker_id,
            'label': meta.get('label') or worker_id,
            'seed_patterns': patterns,
            'branch_hint': meta.get('branch'),
            'worktree_hint': meta.get('worktree'),
            'state': str(state) if state.exists() else None,
            'owned': len(owned),
            'authored': len(owned_authored),
            'auto_validated_worker_or_hub': len(owned_validated),
            'remaining': len(remaining),
            'next_seed': remaining[0] if remaining else None,
            'current_lesson': current,
            'phases': phase_counts,
            'blockers': meta.get('blockers') or (
                ['Human educational/NESA/browser/release gates remain at 0'] if owned_validated else
                ['No auto-validated lessons in partition yet']),
        })

    # Hub-level summary (includes lessons not yet assigned to a worker).
    hub_gates = {g: 0 for g in p.GATES}
    for entry in hub_cp.get('lessons', {}).values():
        for g in p.GATES:
            if (entry.get('gates') or {}).get(g):
                hub_gates[g] += 1

    return {
        'phase': 'PHASE_1_WRITTEN_CORE',
        'hub': str(hub.resolve()),
        'hub_auto_validated': hub_gates['automated_validation_passed'],
        'hub_human_gates': {g: hub_gates[g] for g in HUMAN_GATES},
        'quality_hardening_adopted': (
            (root / 'docs/GOLD_V2_ASSESSMENT_QUALITY.md').exists()
            and 'BANNED_STEM' in (root / 'scripts/gold-pipeline/assessment_quiz.py').read_text()
        ),
        'builders': builders,
        'partitions_updated_at': partitions.get('updated_at'),
        'last_reconcile': partitions.get('last_reconcile'),
        'note': 'Human gates are never advanced by reconcile; auto-validated ≠ release approved.',
    }


def run_worker(hub: Path, worker_id: str, limit: int = 1, seeds: list[str] | None = None,
               inbox: Path | None = None) -> dict:
    state = worker_state(hub, worker_id)
    inbox = Path(inbox) if inbox else state / 'authored'
    enforce_partition(hub, worker_id, seeds, inbox)
    with p.locked(state):
        return p.run_batch(state, inbox, limit=limit, seeds=seeds)


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--hub', type=Path, default=p.DEFAULT_STATE)
    sub = parser.add_subparsers(dest='command', required=True)

    init_p = sub.add_parser('init-worker', help='Create isolated worker state under hub/workers/<id>')
    init_p.add_argument('--worker', required=True)
    init_p.add_argument('--pattern', action='append', required=True,
                        help='Seed ownership pattern, e.g. s4-hsie-y7-*')
    init_p.add_argument('--label')
    init_p.add_argument('--force', action='store_true')

    run_p = sub.add_parser('run', help='Run pipeline inside a worker state with partition checks')
    run_p.add_argument('--worker', required=True)
    run_p.add_argument('--limit', type=int, default=1)
    run_p.add_argument('--seed', action='append')
    run_p.add_argument('--inbox', type=Path)

    rec = sub.add_parser('reconcile', help='Merge worker checkpoints into the hub safely')
    rec.add_argument('--worker', action='append', help='Limit to these workers (default: all)')
    rec.add_argument('--dry-run', action='store_true')

    sub.add_parser('dashboard', help='Partition progress dashboard JSON')

    reg = sub.add_parser('register-meta', help='Attach branch/worktree hints for dashboard')
    reg.add_argument('--worker', required=True)
    reg.add_argument('--branch')
    reg.add_argument('--worktree')
    reg.add_argument('--blocker', action='append')

    args = parser.parse_args(argv)
    try:
        if args.command == 'init-worker':
            result = init_worker(args.hub, args.worker, args.pattern, args.label, args.force)
        elif args.command == 'run':
            result = run_worker(args.hub, args.worker, args.limit, args.seed, args.inbox)
        elif args.command == 'reconcile':
            result = reconcile(args.hub, args.worker, args.dry_run)
        elif args.command == 'dashboard':
            result = dashboard(args.hub)
        elif args.command == 'register-meta':
            partitions = load_partitions(args.hub)
            meta = partitions.get('workers', {}).get(args.worker)
            if not meta:
                raise RuntimeError('Unknown worker')
            if args.branch:
                meta['branch'] = args.branch
            if args.worktree:
                meta['worktree'] = args.worktree
            if args.blocker is not None:
                meta['blockers'] = args.blocker
            partitions['workers'][args.worker] = meta
            partitions['updated_at'] = p.now()
            save_partitions(args.hub, partitions)
            result = meta
        else:
            raise RuntimeError('Unknown command')
        print(json.dumps(result, indent=2))
        if args.command == 'run' and any(r.get('phase') == 'validation_failed'
                                         for r in result.get('processed', [])):
            return 1
        return 0
    except (RuntimeError, ValueError, KeyError, OSError) as error:
        print(json.dumps({'error': str(error)}))
        return 1


if __name__ == '__main__':
    raise SystemExit(main())
