"""Year 7 Technology Mandatory Written Core helpers (catalogue TM4-1)."""
from pathlib import Path

from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

TECH_SOURCE = 'https://curriculum.nsw.edu.au/learning-areas/tas/technology-mandatory-7-8-2019/outcomes'
TM1 = 'TM4-1'


def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, vocab=vocab, principle=principle, model=model,
                guided=guided, feedback=feedback, misconception=misconception,
                independent=independent, subject='technology')


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
            spec = dict(u, code=codes[0], subject='technology')
            bundle = build_from_spec(base, spec, visuals[u['seed_key']], subject='technology')
            scope = ('Proposed Stage 4 NESA Technology Mandatory alignment using catalogue TM4-*; '
                     'content-point mapping remains pending. Follow classroom safety protocols.')
            if len(codes) > 1:
                bundle['lesson']['outcome_codes'] = list(codes)
                bundle['curriculum'] = [dict(
                    code=c, source=TECH_SOURCE, verification_status='pending',
                    lesson_evidence=u['principle'],
                    scope_limit='Partial contribution; confirm content points.') for c in codes]
            elif not base.get('outcome_codes'):
                bundle['lesson']['outcome_codes'] = [u['code']]
                bundle['curriculum'] = [dict(
                    code=u['code'], source=TECH_SOURCE, verification_status='pending',
                    lesson_evidence=u['principle'], scope_limit=scope)]
            atomic_json(out / f"{u['seed_key']}.json", bundle)
            print('Written Core Y7 Technology bundle:', u['seed_key'])
    finally:
        db.close()


__all__ = ['L', 'pair_visual', 'write_batch', 'TM1', 'TECH_SOURCE']
