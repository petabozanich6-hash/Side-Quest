"""Shared helpers for Year 7 Stage 4 PDHPE Written Core builders."""
from pathlib import Path

from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

# Catalogue codes from worker/src/data/nsw-outcomes.ts — do not invent PD4-* codes.
PDHPE_SOURCE = 'https://curriculum.nsw.edu.au/learning-areas/pdhpe/pdhpe-7-10-2018/outcomes'
PD1 = 'PD4-1'


def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, vocab=vocab, principle=principle, model=model,
                guided=guided, feedback=feedback, misconception=misconception, independent=independent,
                subject='pdhpe')


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
            codes = list(base.get('outcome_codes') or [])
            if not codes:
                codes = [u['code']]
            spec = dict(u, code=codes[0], subject='pdhpe')
            bundle = build_from_spec(base, spec, visuals[u['seed_key']], subject='pdhpe')
            scope = ('Proposed Stage 4 NESA PDHPE alignment using catalogue outcome codes (PD4-*); '
                     'content-point mapping and independent NESA verification remain pending.')
            if len(codes) > 1:
                bundle['lesson']['outcome_codes'] = list(codes)
                bundle['curriculum'] = [dict(
                    code=c, source=PDHPE_SOURCE, verification_status='pending',
                    lesson_evidence=u['principle'],
                    scope_limit='Partial contribution; confirm content points for each listed code.') for c in codes]
            elif not base.get('outcome_codes'):
                bundle['lesson']['outcome_codes'] = [u['code']]
                bundle['curriculum'] = [dict(
                    code=u['code'], source=PDHPE_SOURCE, verification_status='pending',
                    lesson_evidence=u['principle'], scope_limit=scope)]
            atomic_json(out / f"{u['seed_key']}.json", bundle)
            print('Written Core Y7 PDHPE bundle:', u['seed_key'])
    finally:
        db.close()


__all__ = ['L', 'pair_visual', 'write_batch', 'PD1', 'PDHPE_SOURCE']
