"""Shared helpers for Year 7 Stage 4 HSIE (History/Geography/Inquiry) Written Core."""
from pathlib import Path

from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

# Catalogue codes from worker/src/data/nsw-outcomes.ts only — do not invent HT4-*/GE4-*.
HT1, HT2, GE1 = 'HT4-1', 'HT4-2', 'GE4-1'
HIST_SOURCE = 'https://curriculum.nsw.edu.au/learning-areas/hsie/history-7-10-2012/outcomes'
GEOG_SOURCE = 'https://curriculum.nsw.edu.au/learning-areas/hsie/geography-7-10-2015/outcomes'
FN_SCOPE = (
    'Local First Nations protocols and Community verification remain pending human review. '
    'Do not invent Country names, Dreaming stories, sacred knowledge or unverified cultural claims.'
)


def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, vocab=vocab, principle=principle, model=model,
                guided=guided, feedback=feedback, misconception=misconception,
                independent=independent, subject='hsie')


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
            spec = dict(u, code=codes[0], subject='hsie')
            bundle = build_from_spec(base, spec, visuals[u['seed_key']], subject='hsie')
            source = GEOG_SOURCE if str(codes[0]).startswith('GE') else HIST_SOURCE
            scope = (
                f'Proposed Stage 4 NESA HSIE alignment using catalogue outcome code {codes[0]}; '
                f'content-point mapping remains pending. {FN_SCOPE}'
            )
            if len(codes) > 1:
                bundle['lesson']['outcome_codes'] = list(codes)
                bundle['curriculum'] = [dict(
                    code=c,
                    source=GEOG_SOURCE if str(c).startswith('GE') else HIST_SOURCE,
                    verification_status='pending',
                    lesson_evidence=u['principle'],
                    scope_limit='Partial contribution; confirm content points. ' + FN_SCOPE,
                ) for c in codes]
            elif not base.get('outcome_codes'):
                bundle['lesson']['outcome_codes'] = [u['code']]
                bundle['curriculum'] = [dict(
                    code=u['code'], source=source, verification_status='pending',
                    lesson_evidence=u['principle'], scope_limit=scope)]
            atomic_json(out / f"{u['seed_key']}.json", bundle)
            print('Written Core Y7 HSIE bundle:', u['seed_key'])
    finally:
        db.close()


__all__ = ['L', 'pair_visual', 'write_batch', 'HT1', 'HT2', 'GE1', 'FN_SCOPE']
