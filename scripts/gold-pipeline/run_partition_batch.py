#!/usr/bin/env python3
"""Write selected lessons from an existing batch module into a worker inbox."""
import argparse
import importlib.util
from pathlib import Path

from hsie_y7_support import write_batch as write_hsie
from english_y7_support import write_batch as write_eng
from pdhpe_y7_support import write_batch as write_pdhpe


def load_module(path: Path):
    spec = importlib.util.spec_from_file_location(path.stem, path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--module', type=Path, required=True)
    p.add_argument('--out-dir', type=Path, required=True)
    p.add_argument('--seed', action='append', help='Only these seeds (default: all in module)')
    p.add_argument('--subject', choices=['hsie', 'english', 'pdhpe'], required=True)
    args = p.parse_args()
    mod = load_module(args.module.resolve())
    lessons = list(mod.LESSONS)
    visuals = dict(mod.VISUALS)
    if args.seed:
        want = set(args.seed)
        lessons = [u for u in lessons if u['seed_key'] in want]
        visuals = {k: v for k, v in visuals.items() if k in want}
    if not lessons:
        raise SystemExit('No lessons selected')
    writers = {'hsie': write_hsie, 'english': write_eng, 'pdhpe': write_pdhpe}
    writer = writers[args.subject]
    kwargs = dict(out_dir=args.out_dir)
    if args.subject == 'english':
        kwargs['label'] = 'Y8 English'
    writer(lessons, visuals, expected_count=len(lessons), **kwargs)
    print(f'Wrote {len(lessons)} bundles -> {args.out_dir}')


if __name__ == '__main__':
    main()
