#!/usr/bin/env python3
"""Re-inventory S2/S4 remainders and provision up to 8 exclusive Y8 Tech shard workers."""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'scripts/gold-pipeline'))
from generate_topic_batch import remaining_seeds  # noqa: E402
from parallel_workers import init_worker, load_partitions, save_partitions  # noqa: E402
import pipeline as p  # noqa: E402

HUB = ROOT / 'lesson-pipeline'
REPO = Path('/Users/petab/Side-Quest')
WORKTREES = REPO / '.worktrees'

# Contiguous week shards covering remaining s4-tech-y8 (verified at runtime).
SHARDS = [
    ('builder-tech-01', list(range(5, 10)), 'S4 Y8 Tech w05–w09'),
    ('builder-tech-02', list(range(10, 15)), 'S4 Y8 Tech w10–w14'),
    ('builder-tech-03', list(range(15, 19)), 'S4 Y8 Tech w15–w18'),
    ('builder-tech-04', list(range(19, 23)), 'S4 Y8 Tech w19–w22'),
    ('builder-tech-05', list(range(23, 27)), 'S4 Y8 Tech w23–w26'),
    ('builder-tech-06', list(range(27, 31)), 'S4 Y8 Tech w27–w30'),
    ('builder-tech-07', list(range(31, 36)), 'S4 Y8 Tech w31–w35'),
    ('builder-tech-08', list(range(36, 41)), 'S4 Y8 Tech w36–w40'),
]


def week_patterns(weeks: list[int]) -> list[str]:
    return [f's4-tech-y8-w{w:02d}-*' for w in weeks]


def git(*args, check=True):
    return subprocess.run(['git', '-C', str(REPO), *args], text=True, capture_output=True, check=check)


def ensure_branch_worktree(worker_id: str, branch: str, worktree: Path):
    # Branch from current parallel-workers HEAD tip on hub.
    hub_head = subprocess.run(
        ['git', '-C', str(ROOT), 'rev-parse', 'HEAD'],
        text=True, capture_output=True, check=True,
    ).stdout.strip()
    # Create branch if missing
    show = git('show-ref', '--verify', f'refs/heads/{branch}', check=False)
    if show.returncode != 0:
        git('branch', branch, hub_head)
    if worktree.exists():
        return {'worker': worker_id, 'branch': branch, 'worktree': str(worktree), 'status': 'exists'}
    WORKTREES.mkdir(parents=True, exist_ok=True)
    add = git('worktree', 'add', str(worktree), branch, check=False)
    if add.returncode != 0:
        return {
            'worker': worker_id, 'branch': branch, 'worktree': str(worktree),
            'status': 'worktree_failed', 'stderr': add.stderr.strip(),
        }
    return {'worker': worker_id, 'branch': branch, 'worktree': str(worktree), 'status': 'created'}


def main():
    left = remaining_seeds('s4-tech-y8-', HUB)
    report = {
        'inventory': {
            's4_tech_y8_remain': len(left),
            'next': left[:3],
            'note': 'Suggested Eng/Mat/Sci/HSIE Y7/Y8 slots are 0 remaining; reassigned to Tech shards.',
        },
        'workers': [],
        'worktrees': [],
    }

    parts = load_partitions(HUB)
    # Idle completed partitions — keep exclusive ownership, no tech overlap.
    idle = {
        'builder-y3': {
            'seed_patterns': ['s2-*-y3-*'],
            'label': 'S2 Y3 idle/repair',
            'blockers': ['Y3 Written Core complete except protected s2-eng-y3-w01-l1 — idle/repair only'],
            'branch': 'feature/gold-v2-builder-y3',
            'worktree': '.worktrees/builder-y3',
        },
        'builder-y4': {
            'seed_patterns': ['s2-*-y4-*'],
            'label': 'S2 Y4 idle/repair',
            'blockers': ['Y4 complete 640/640 — repairs only'],
            'branch': 'feature/gold-v2-builder-y4',
            'worktree': '.worktrees/builder-y4',
        },
        'builder-y7-hsie': {
            'seed_patterns': ['s4-hsie-y7-*', 's4-pdhpe-y7-*', 's4-tech-y7-*', 's4-mat-y8-*'],
            'label': 'S4 Y7 + Y8 Maths complete — idle',
            'blockers': ['Partition complete — idle until new Stage 4 inventory'],
            'branch': 'feature/gold-v2-builder-y7',
            'worktree': '.worktrees/builder-y7',
        },
        'builder-y8-eng': {
            # Tech ownership moved to builder-tech-*; keep completed Y8 subjects exclusive.
            'seed_patterns': [
                's4-eng-y8-*', 's4-sci-y8-*', 's4-hsie-y8-*', 's4-pdhpe-y8-*',
            ],
            'label': 'S4 Y8 Eng/Sci/HSIE/PDHPE complete — idle',
            'blockers': ['Partition complete — idle; Tech shards own remaining Y8 Tech'],
            'branch': 'feature/gold-v2-builder-y8',
            'worktree': '.worktrees/builder-y8',
        },
    }
    for wid, meta_update in idle.items():
        meta = parts.get('workers', {}).get(wid) or {'id': wid, 'created_at': p.now()}
        meta.update(meta_update)
        meta['id'] = wid
        meta['state'] = f'workers/{wid}'
        parts['workers'][wid] = meta
        state = HUB / 'workers' / wid
        state.mkdir(parents=True, exist_ok=True)
        (state / 'authored').mkdir(exist_ok=True)
        (state / 'artifacts').mkdir(exist_ok=True)
        p.atomic_json(state / 'worker.json', meta)

    # Drop any prior tech shard workers before re-init (clean exclusive map).
    for wid in list(parts.get('workers', {})):
        if wid.startswith('builder-tech-'):
            del parts['workers'][wid]
    parts['updated_at'] = p.now()
    save_partitions(HUB, parts)

    for wid, weeks, label in SHARDS:
        patterns = week_patterns(weeks)
        # Remove stale worker state checkpoint only when force-init
        state = HUB / 'workers' / wid
        if (state / 'checkpoint.json').exists():
            # Keep checkpoint history; force re-register patterns
            pass
        result = init_worker(HUB, wid, patterns, label=label, force=True)
        branch = f'feature/gold-v2-{wid}'
        wt = WORKTREES / wid
        wt_info = ensure_branch_worktree(wid, branch, wt)
        # register meta
        parts = load_partitions(HUB)
        meta = parts['workers'][wid]
        meta['branch'] = branch
        meta['worktree'] = f'.worktrees/{wid}'
        meta['label'] = label
        parts['workers'][wid] = meta
        parts['updated_at'] = p.now()
        save_partitions(HUB, parts)
        p.atomic_json(HUB / 'workers' / wid / 'worker.json', meta)
        report['workers'].append(result)
        report['worktrees'].append(wt_info)

    report['partitions'] = load_partitions(HUB)
    print(json.dumps({
        'inventory': report['inventory'],
        'workers': report['workers'],
        'worktrees': report['worktrees'],
        'active_patterns': {
            wid: report['partitions']['workers'][wid]['seed_patterns']
            for wid, _, _ in SHARDS
        },
    }, indent=2))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
