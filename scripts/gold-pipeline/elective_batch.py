"""Assemble Stage 4 elective Written Core bundles into a worker inbox.

Uses the shared assembler and assessment-quality quiz builder. Outcome codes
must be supplied from a published NESA page. Verification stays pending.
"""
from pathlib import Path

from pipeline import reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec


def write_elective_batch(lessons, visuals, *, subject, source_url, source_note, out_dir):
    if not source_url.startswith('https://curriculum.nsw.edu.au/'):
        raise ValueError('Curriculum source must be an official curriculum.nsw.edu.au URL')
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    db = reconstruct()
    written = []
    try:
        for spec in lessons:
            seed = spec['seed_key']
            row = db.execute('SELECT * FROM lessons WHERE seed_key=?', (seed,)).fetchone()
            if row is None:
                raise ValueError(seed)
            base = baseline_data(row)
            catalogue_codes = [c for c in (base.get('outcome_codes') or []) if c]
            code = catalogue_codes[0] if catalogue_codes else spec['code']
            if not code:
                raise ValueError(f'{seed}: no outcome code; refuse to invent one')
            spec = dict(spec, code=code, subject=subject)
            bundle = build_from_spec(base, spec, visuals[seed], subject=subject)
            bundle['lesson']['outcome_codes'] = catalogue_codes or [code]
            bundle['lesson']['source_note'] = source_note
            bundle['lesson']['review_status'] = 'unreviewed'
            evidence = spec['principle']
            bundle['curriculum'] = [dict(
                code=c,
                source=source_url,
                verification_status='pending',
                lesson_evidence=evidence,
                scope_limit=(
                    'Single Stage 4 lesson: partial contribution only. '
                    'Content-point mapping is pending human review. '
                    'This authoring pass does not certify NESA alignment.'
                ),
            ) for c in bundle['lesson']['outcome_codes']]
            atomic_json(out / f'{seed}.json', bundle)
            written.append(seed)
            print('Wrote', seed)
    finally:
        db.close()
    return written
