"""Stage 4 Science Written Core helpers (catalogue SC4-* codes)."""
from pathlib import Path

from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

SCI_SOURCE = 'https://curriculum.nsw.edu.au/learning-areas/science/science-7-10-2018/outcomes'


def write_batch(lessons, visuals, expected_count=None, out_dir=None):
    if expected_count is not None:
        assert len(lessons) == expected_count, f'expected {expected_count}, got {len(lessons)}'
    out = Path(out_dir) if out_dir else (ROOT / 'lesson-pipeline/authored')
    out.mkdir(parents=True, exist_ok=True)
    db = reconstruct()
    try:
        for u in lessons:
            row = db.execute('SELECT * FROM lessons WHERE seed_key=?', (u['seed_key'],)).fetchone()
            if row is None:
                raise ValueError(u['seed_key'])
            base = baseline_data(row)
            codes = list(base.get('outcome_codes') or []) or [u['code']]
            spec = dict(u, code=codes[0], subject='science')
            bundle = build_from_spec(base, spec, visuals[u['seed_key']], subject='science')
            scope = ('Proposed Stage 4 NESA Science alignment using catalogue SC4-* codes; '
                     'content-point mapping remains pending.')
            if not base.get('outcome_codes'):
                bundle['lesson']['outcome_codes'] = [u['code']]
                bundle['curriculum'] = [dict(
                    code=u['code'], source=SCI_SOURCE, verification_status='pending',
                    lesson_evidence=u['principle'], scope_limit=scope)]
            atomic_json(out / f"{u['seed_key']}.json", bundle)
            print('Written Core Stage 4 Science bundle:', u['seed_key'])
    finally:
        db.close()


__all__ = ['write_batch', 'pair_visual', 'SCI_SOURCE']
