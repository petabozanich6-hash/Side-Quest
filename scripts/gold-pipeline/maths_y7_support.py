"""Shared helpers for Year 7 Stage 4 Mathematics Written Core builders."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

MATHS_SOURCE = 'https://curriculum.nsw.edu.au/learning-areas/mathematics/mathematics-k-10-2022/outcomes'
# Catalogue codes from worker/src/data/nsw-outcomes.ts only — do not invent MA4-* spellings.
ARI = 'MA4-ARI-C-01'
FRC = 'MA4-FRC-C-01'
RAT = 'MA4-RAT-C-01'
ALG = 'MA4-ALG-C-01'
EQL = 'MA4-EQL-C-01'
LEN = 'MA4-LEN-C-01'
ARE = 'MA4-ARE-C-01'
DAT = 'MA4-DAT-C-01'
PRO = 'MA4-PRO-C-01'


def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, vocab=vocab, principle=principle, model=model,
                guided=guided, feedback=feedback, misconception=misconception,
                independent=independent, subject='mathematics')


def write_batch(lessons, visuals, expected_count=None):
    if expected_count is not None:
        assert len(lessons) == expected_count, f'expected {expected_count}, got {len(lessons)}'
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
            spec = dict(u, code=codes[0], subject='mathematics')
            bundle = build_from_spec(base, spec, visuals[u['seed_key']], subject='mathematics')
            scope = ('Proposed Stage 4 NESA Mathematics alignment using catalogue outcome codes (MA4-*-C-01); '
                     'content-point mapping and independent NESA verification remain pending.')
            if len(codes) > 1:
                bundle['lesson']['outcome_codes'] = list(codes)
                bundle['curriculum'] = [dict(
                    code=c, source=MATHS_SOURCE, verification_status='pending',
                    lesson_evidence=u['principle'],
                    scope_limit='Partial contribution; confirm content points for each listed code.') for c in codes]
            elif not base.get('outcome_codes'):
                bundle['lesson']['outcome_codes'] = [u['code']]
                bundle['curriculum'] = [dict(
                    code=u['code'], source=MATHS_SOURCE, verification_status='pending',
                    lesson_evidence=u['principle'], scope_limit=scope)]
            atomic_json(ROOT / 'lesson-pipeline/authored' / f"{u['seed_key']}.json", bundle)
            print('Written Core Y7 Mathematics bundle:', u['seed_key'])
    finally:
        db.close()


__all__ = ['L', 'pair_visual', 'write_batch', 'ARI', 'FRC', 'RAT', 'ALG', 'EQL', 'LEN', 'ARE', 'DAT', 'PRO']
