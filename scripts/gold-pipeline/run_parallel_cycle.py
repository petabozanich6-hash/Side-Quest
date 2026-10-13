#!/usr/bin/env python3
"""N-way concurrent author/validate cycle + hub reconcile (quality gates unchanged)."""
from __future__ import annotations

import argparse
import concurrent.futures
import json
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'scripts/gold-pipeline'))
from generate_topic_batch import remaining_matching  # noqa: E402
from parallel_workers import load_partitions  # noqa: E402

HUB = ROOT / 'lesson-pipeline'
GEN = ROOT / 'scripts/gold-pipeline/generate_topic_batch.py'
PW = ROOT / 'scripts/gold-pipeline/parallel_workers.py'

# Active unfinished partitions after S2/Y7/Y8 inventory (re-verified at runtime).
# Idle repair workers (y3/y4/completed subjects) are excluded from the active set.
DEFAULT_ACTIVE = [
    'builder-tech-01',
    'builder-tech-02',
    'builder-tech-03',
    'builder-tech-04',
    'builder-tech-05',
    'builder-tech-06',
    'builder-tech-07',
    'builder-tech-08',
]


def run(cmd):
    print('+', ' '.join(str(c) for c in cmd), flush=True)
    return subprocess.run(cmd, cwd=ROOT, text=True, capture_output=True)


def generate_for(worker_id: str, patterns: list[str], limit: int, subject: str, code: str):
    out = HUB / f'workers/{worker_id}/authored'
    left = remaining_matching(patterns, HUB)[:limit]
    if not left:
        return []
    cmd = [sys.executable, str(GEN), '--hub', str(HUB), '--subject', subject,
           '--out-dir', str(out), '--limit', str(limit), '--code', code]
    for pat in patterns:
        cmd.extend(['--pattern', pat])
    proc = run(cmd)
    print(proc.stdout)
    if proc.returncode:
        print(proc.stderr)
        raise SystemExit(proc.returncode)
    start = proc.stdout.rfind('{')
    return json.loads(proc.stdout[start:]).get('seeds') or []


def validate(worker_id: str, seeds: list[str]):
    if not seeds:
        return {'processed': [], 'worker': worker_id}
    cmd = [sys.executable, str(PW), '--hub', str(HUB), 'run', '--worker', worker_id,
           '--limit', str(min(16, max(1, len(seeds))))]
    for seed in seeds:
        cmd.extend(['--seed', seed])
    proc = run(cmd)
    print(proc.stdout)
    if proc.returncode:
        print(proc.stderr)
    payload = json.loads(proc.stdout)
    payload['worker'] = worker_id
    return payload


def active_workers(requested: list[str] | None, concurrency: int) -> list[tuple[str, list[str]]]:
    parts = load_partitions(HUB)
    chosen = []
    for wid in (requested or DEFAULT_ACTIVE):
        meta = parts.get('workers', {}).get(wid)
        if not meta:
            continue
        patterns = meta.get('seed_patterns') or []
        left = remaining_matching(patterns, HUB)
        if not left:
            continue
        chosen.append((wid, patterns, left))
        if len(chosen) >= concurrency:
            break
    return [(w, p) for w, p, _ in chosen]


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--concurrency', type=int, default=8)
    ap.add_argument('--limit', type=int, default=12, help='Max lessons per worker this cycle')
    ap.add_argument('--subject', default='technology')
    ap.add_argument('--code', default='TM4-1')
    ap.add_argument('--worker', action='append', default=None)
    args = ap.parse_args(argv)

    started = time.perf_counter()
    slots = active_workers(args.worker, args.concurrency)
    plan = {
        'concurrency_requested': args.concurrency,
        'concurrency_active': len(slots),
        'workers': [
            {'worker': w, 'patterns': pats, 'remain': len(remaining_matching(pats, HUB))}
            for w, pats in slots
        ],
    }
    print(json.dumps(plan, indent=2), flush=True)
    if not slots:
        print(json.dumps({'merged': 0, 'note': 'no_active_remaining'}))
        return 0

    seeded = {}
    for worker_id, patterns in slots:
        seeded[worker_id] = generate_for(
            worker_id, patterns, args.limit, args.subject, args.code)

    results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=max(1, len(slots))) as ex:
        futs = [ex.submit(validate, wid, seeded.get(wid) or []) for wid, _ in slots]
        for fut in concurrent.futures.as_completed(futs):
            results.append(fut.result())

    fails = [p['seed_key'] for payload in results for p in payload.get('processed', [])
             if p.get('phase') == 'validation_failed']
    if fails:
        print(json.dumps({'validation_failed': fails}))
        return 1

    worker_ids = [w for w, _ in slots]
    rec_cmd = [sys.executable, str(PW), '--hub', str(HUB), 'reconcile']
    for wid in worker_ids:
        rec_cmd.extend(['--worker', wid])
    rec = run(rec_cmd)
    print(rec.stdout)
    if rec.returncode:
        print(rec.stderr)
        return rec.returncode
    summary = json.loads(rec.stdout)
    elapsed = time.perf_counter() - started
    merged = summary.get('merged_count')
    if merged is None:
        # reconcile report shape uses merged list sometimes
        merged = len(summary.get('merged') or [])
        if not merged and isinstance(summary.get('merged'), list):
            merged = len(summary['merged'])
    # Prefer explicit counts from printed dual-cycle style
    out = {
        'concurrency_active': len(slots),
        'workers': worker_ids,
        'seeds_per_worker': {w: seeded.get(w) or [] for w in worker_ids},
        'merged_count': summary.get('merged_count', merged),
        'conflicts': summary.get('conflicts') or [],
        'hub_lesson_count': summary.get('hub_lesson_count'),
        'hub_generation': summary.get('hub_generation'),
        'elapsed_sec': round(elapsed, 3),
        'lessons_per_min': round((sum(len(seeded.get(w) or []) for w in worker_ids) / elapsed) * 60, 2)
        if elapsed else 0,
    }
    print(json.dumps(out, indent=2))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
