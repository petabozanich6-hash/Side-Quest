"""Shared helpers for Year 4 Science Written Core builders."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

SCI_SOURCE = 'https://curriculum.nsw.edu.au/learning-areas/science/science-and-technology-k-6-2024/outcomes'


def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, vocab=vocab, principle=principle, model=model,
                guided=guided, feedback=feedback, misconception=misconception, independent=independent,
                subject='science')


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
            spec = dict(u, code=codes[0], subject='science')
            bundle = build_from_spec(base, spec, visuals[u['seed_key']], subject='science')
            if len(codes) > 1:
                bundle['lesson']['outcome_codes'] = list(codes)
                bundle['curriculum'] = [dict(
                    code=c, source=SCI_SOURCE, verification_status='pending',
                    lesson_evidence=u['principle'],
                    scope_limit='Partial contribution; confirm content points for each listed code.') for c in codes]
            elif not base.get('outcome_codes'):
                scope = ('Proposed Stage 2 NESA Science and Technology alignment using catalogue outcome codes; '
                         'content-point mapping remains pending.')
                bundle['lesson']['outcome_codes'] = [u['code']]
                bundle['curriculum'] = [dict(
                    code=u['code'], source=SCI_SOURCE, verification_status='pending',
                    lesson_evidence=u['principle'], scope_limit=scope)]
            atomic_json(ROOT / 'lesson-pipeline/authored' / f"{u['seed_key']}.json", bundle)
            print('Written Core Y4 Science bundle:', u['seed_key'])
    finally:
        db.close()


__all__ = ['L', 'pair_visual', 'write_batch']
