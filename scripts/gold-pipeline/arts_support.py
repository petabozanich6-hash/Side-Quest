"""Shared helpers for Year 3 Creative Arts Written Core builders (batches 01-07)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

VIS, MUS, DRA, DAN = 'CA2-VIS-01', 'CA2-MUS-01', 'CA2-DRA-01', 'CA2-DAN-01'


def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, subject='arts', vocab=vocab,
                principle=principle, model=model, guided=guided, feedback=feedback,
                misconception=misconception, independent=independent)


def pv(lt, lx, rt, rx, alt, cap):
    return pair_visual(lt, lx, rt, rx, alt, cap)


def create(lessons, visuals, expected):
    assert len(lessons) == expected, (len(lessons), expected)
    assert {u['seed_key'] for u in lessons} == set(visuals), 'visual/lesson key mismatch'
    db = reconstruct()
    try:
        for u in lessons:
            row = db.execute('SELECT * FROM lessons WHERE seed_key=?', (u['seed_key'],)).fetchone()
            if row is None:
                raise ValueError(u['seed_key'])
            base = baseline_data(row)
            bundle = build_from_spec(base, u, visuals[u['seed_key']], subject='arts')
            atomic_json(ROOT / 'lesson-pipeline/authored' / f"{u['seed_key']}.json", bundle)
            print('Written Core arts bundle:', u['seed_key'])
    finally:
        db.close()
