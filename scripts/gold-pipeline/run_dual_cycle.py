#!/usr/bin/env python3
"""One concurrent dual-worker author/validate cycle + hub reconcile."""
from __future__ import annotations

import concurrent.futures
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'scripts/gold-pipeline'))
from generate_topic_batch import remaining_seeds  # noqa: E402

HUB = ROOT / 'lesson-pipeline'
GEN = ROOT / 'scripts/gold-pipeline/generate_topic_batch.py'
PW = ROOT / 'scripts/gold-pipeline/parallel_workers.py'

# Worker A (builder-y7-hsie): finished Y7; owns Y8 Mathematics next.
# Worker B (builder-y8-eng): finished Y8 English; owns remaining Y8 subjects.
WORKER_A = ('builder-y7-hsie', [
    ('mathematics', 's4-mat-y8-', 'MA4-ARI-C-01'),
])
WORKER_B = ('builder-y8-eng', [
    ('science', 's4-sci-y8-', 'SC4-WS-01'),
    ('hsie', 's4-hsie-y8-', 'HT4-1'),
    ('pdhpe', 's4-pdhpe-y8-', 'PD4-1'),
    ('technology', 's4-tech-y8-', 'TM4-1'),
    ('english', 's4-eng-y8-', 'EN4-URA-01'),  # repairs / leftovers
])


def run(cmd):
    print('+', ' '.join(str(c) for c in cmd), flush=True)
    return subprocess.run(cmd, cwd=ROOT, text=True, capture_output=True)


def pick_stream(streams):
    for subject, prefix, code in streams:
        left = remaining_seeds(prefix, HUB)
        if left:
            return subject, prefix, code, left
    return None, None, None, []


def generate(subject, prefix, out, limit=12, code=None):
    cmd = [sys.executable, str(GEN), '--hub', str(HUB), '--subject', subject,
           '--prefix', prefix, '--limit', str(limit), '--out-dir', str(out)]
    if code:
        cmd.extend(['--code', code])
    proc = run(cmd)
    print(proc.stdout)
    if proc.returncode:
        print(proc.stderr)
        raise SystemExit(proc.returncode)
    start = proc.stdout.rfind('{')
    return json.loads(proc.stdout[start:]).get('seeds') or []


def validate(worker, seeds):
    if not seeds:
        return {'processed': []}
    cmd = [sys.executable, str(PW), '--hub', str(HUB), 'run', '--worker', worker,
           '--limit', str(min(16, max(1, len(seeds))))]
    for seed in seeds:
        cmd.extend(['--seed', seed])
    proc = run(cmd)
    print(proc.stdout)
    if proc.returncode:
        print(proc.stderr)
    return json.loads(proc.stdout)


def main():
    # Ensure exclusive ownership matches this cycle plan.
    parts = json.loads((HUB / 'partitions.json').read_text())
    parts['workers']['builder-y7-hsie']['seed_patterns'] = [
        's4-hsie-y7-*', 's4-pdhpe-y7-*', 's4-tech-y7-*', 's4-mat-y8-*']
    parts['workers']['builder-y7-hsie']['label'] = 'S4 Y7 done + Y8 Maths'
    parts['workers']['builder-y8-eng']['seed_patterns'] = [
        's4-eng-y8-*', 's4-sci-y8-*', 's4-hsie-y8-*', 's4-pdhpe-y8-*', 's4-tech-y8-*']
    parts['workers']['builder-y8-eng']['label'] = 'S4 Y8 Eng done + Sci/HSIE/PDHPE/Tech'
    (HUB / 'partitions.json').write_text(json.dumps(parts, indent=2, sort_keys=True) + '\n')

    a_worker, a_streams = WORKER_A
    b_worker, b_streams = WORKER_B
    a_subject, a_prefix, a_code, _ = pick_stream(a_streams)
    b_subject, b_prefix, b_code, _ = pick_stream(b_streams)
    print(json.dumps({
        'A': {'worker': a_worker, 'subject': a_subject, 'prefix': a_prefix,
              'remain': len(remaining_seeds(a_prefix, HUB)) if a_prefix else 0},
        'B': {'worker': b_worker, 'subject': b_subject, 'prefix': b_prefix,
              'remain': len(remaining_seeds(b_prefix, HUB)) if b_prefix else 0},
    }))

    a_out = HUB / f'workers/{a_worker}/authored'
    b_out = HUB / f'workers/{b_worker}/authored'
    a_seeds = generate(a_subject, a_prefix, a_out, 12, a_code) if a_subject else []
    b_seeds = generate(b_subject, b_prefix, b_out, 12, b_code) if b_subject else []

    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as ex:
        fa = ex.submit(validate, a_worker, a_seeds) if a_seeds else None
        fb = ex.submit(validate, b_worker, b_seeds) if b_seeds else None
        ra = fa.result() if fa else {'processed': []}
        rb = fb.result() if fb else {'processed': []}

    fails = [p['seed_key'] for payload in (ra, rb) for p in payload.get('processed', [])
             if p.get('phase') == 'validation_failed']
    if fails:
        print(json.dumps({'validation_failed': fails}))
        return 1

    rec = run([sys.executable, str(PW), '--hub', str(HUB), 'reconcile',
               '--worker', a_worker, '--worker', b_worker])
    print(rec.stdout)
    if rec.returncode:
        print(rec.stderr)
        return rec.returncode
    summary = json.loads(rec.stdout)
    print(json.dumps({
        'a_seeds': a_seeds, 'b_seeds': b_seeds,
        'merged': len(summary.get('merged') or []),
        'hub_lesson_count': summary.get('hub_lesson_count'),
        'conflicts': summary.get('conflicts'),
    }, indent=2))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
