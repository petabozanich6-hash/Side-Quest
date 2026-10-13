#!/usr/bin/env python3
"""Generate a coherent Written Core batch from inventory titles into a worker inbox."""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

from pipeline import reconstruct, baseline_data
from written_bundle import pair_visual


def topic_of(title: str) -> str:
    text = title or ''
    if ':' in text:
        text = text.split(':', 1)[1]
    text = re.sub(r'^Year \d+,\s*Week \d+,\s*Lesson \d+:\s*', '', text, flags=re.I)
    return ' '.join(text.split()).strip() or 'the lesson focus'


def vocab_for(topic: str, subject: str) -> list[str]:
    words = [w.lower() for w in re.findall(r"[A-Za-z']+", topic) if len(w) > 3][:3]
    defaults = {
        'pdhpe': 'safety', 'english': 'evidence', 'technology': 'criteria',
        'mathematics': 'method', 'science': 'evidence', 'hsie': 'source',
    }
    while len(words) < 3:
        words.append(defaults[subject])
    extras = {
        'pdhpe': 'respect', 'english': 'audience', 'technology': 'evaluate',
        'mathematics': 'accuracy', 'science': 'fair test', 'hsie': 'perspective',
    }
    return words[:3] + [extras[subject]]


def build_spec(seed: str, topic: str, subject: str, code: str) -> dict:
    t = topic[0].lower() + topic[1:] if topic else 'this focus'
    if subject == 'pdhpe':
        principle = (
            f'Stage 4 PDHPE develops skill and judgement for {t}. Students name cues, safety rules or '
            f'strategies, practise them in realistic scenarios, and explain why the healthier or fairer '
            f'choice works. Catalogue alignment uses {code}. Keep content school-appropriate and inclusive.'
        )
        model = (
            f'Example for {topic}: name the situation, identify one body cue or safety rule, choose a '
            f'safe/respectful action, and say how it helps self or others. Weak: “just try harder” with no cue.'
        )
        guided = (
            f'For {t}, write: situation → cue/rule → chosen action → reason it is safer, healthier or fairer.'
        )
        feedback = (
            'Strong answer: cue or rule is specific; action is realistic; reason links to health, safety or respect.'
        )
        misconception = (
            f'Treating {t} as only winning/looking cool, or ignoring safety and inclusion.'
        )
        independent = (
            f'Independently complete a substantial task on {t}: practise or plan the skill, record evidence '
            f'(notes/photo of setup/reflection), include one safety or inclusion check, and write a five-sentence '
            f'reflection with one next goal.'
        )
    elif subject == 'english':
        principle = (
            f'Stage 4 English develops reading and writing craft for {t}. Students make text-bound claims, '
            f'use precise evidence, and explain effects on an audience. Catalogue alignment uses {code}. '
            f'Keep interpretations cautious and school-appropriate.'
        )
        model = (
            f'Example for {topic}: claim about meaning or craft, short evidence (quote/paraphrase), '
            f'explanation of effect. Weak: plot summary with no analysis.'
        )
        guided = (
            f'For {t}, write claim–evidence–explanation in 4–6 sentences, or produce the required craft piece '
            f'with one annotated technique.'
        )
        feedback = (
            'Strong answer: claim is arguable, evidence is precise, explanation links technique to effect.'
        )
        misconception = (
            f'Treating {t} as personal taste only, or inventing details not in the text.'
        )
        independent = (
            f'Independently complete a substantial task on {t}: produce an extended response or crafted piece '
            f'(150–400 words as appropriate), embed evidence where relevant, and add a short craft reflection.'
        )
    elif subject == 'mathematics':
        principle = (
            f'Stage 4 Mathematics develops fluent reasoning for {t}. Students choose a valid method, show '
            f'working, and check reasonableness. Catalogue alignment uses {code}. Prefer exact reasoning over '
            f'guessing.'
        )
        model = (
            f'Example for {topic}: state the values, show the method step by step, and check the result. '
            f'Weak: an answer with no working.'
        )
        guided = (
            f'For {t}, solve a guided problem with visible working and a one-sentence reason for the method.'
        )
        feedback = (
            'Strong answer: method named, working complete, result checked for reasonableness.'
        )
        misconception = (
            f'Skipping working for {t}, or mixing units/places without checking.'
        )
        independent = (
            f'Independently complete a substantial task on {t}: solve several new items with working, include '
            f'one deliberate error-analysis, and write a short reflection on a method choice.'
        )
    elif subject == 'science':
        principle = (
            f'Stage 4 Science develops evidence-based thinking for {t}. Students ask testable questions, '
            f'record observations, and link claims to data. Catalogue alignment uses {code}.'
        )
        model = (
            f'Example for {topic}: state the question/variable, describe evidence, and make a cautious claim. '
            f'Weak: a claim with no observation.'
        )
        guided = (
            f'For {t}, write question → evidence → claim, naming what was observed or measured.'
        )
        feedback = (
            'Strong answer: evidence is specific; claim does not overreach the data.'
        )
        misconception = (
            f'Treating {t} as a guess, or changing multiple variables at once without noting it.'
        )
        independent = (
            f'Independently complete a substantial task on {t}: plan or analyse an investigation, record '
            f'evidence, and write a five-sentence evaluation of the claim’s limits.'
        )
    elif subject == 'hsie':
        principle = (
            f'Stage 4 HSIE develops historical/geographic inquiry for {t}. Students locate in time/place, '
            f'use published sources, weigh perspectives and state evidence limits. Catalogue alignment uses {code}. '
            f'Do not invent Country names, Dreaming stories or unverified cultural claims.'
        )
        model = (
            f'Example for {topic}: locate the topic, cite a source/detail, and state one limit of the evidence.'
        )
        guided = (
            f'For {t}, write a located description, one sourced observation and one evidenced explanation.'
        )
        feedback = (
            'Strong answer: place/time clear; claim linked to source; limits stated; no invented cultural detail.'
        )
        misconception = (
            f'Treating myths as literal fact without labelling belief, or ignoring scale and perspective for {t}.'
        )
        independent = (
            f'Independently complete a substantial task on {t}: use at least two published sources or data sets, '
            f'show analysis, note uncertainties, and write a five-sentence reflection with one skill goal.'
        )
    else:  # technology
        principle = (
            f'Stage 4 Technology Mandatory develops design and practical judgement for {t}. Students identify '
            f'needs, generate ideas against criteria, work safely, test, and evaluate improvements. Catalogue '
            f'alignment uses {code}. Follow classroom safety rules for tools, food and digital work.'
        )
        model = (
            f'Example for {topic}: state the need/problem, list success criteria, propose one idea, and note '
            f'one safety or sustainability check. Weak: jumping to make without criteria.'
        )
        guided = (
            f'For {t}, complete: need → criteria → idea/sketch or plan → safety check → one evaluation note.'
        )
        feedback = (
            'Strong answer: criteria clear; idea matches need; safety/sustainability considered; evaluation honest.'
        )
        misconception = (
            f'Skipping criteria and safety for {t}, or calling a first attempt finished without testing.'
        )
        independent = (
            f'Independently complete a substantial task on {t}: document the design/practical process with '
            f'criteria, evidence of making or planning, a test/result, and a five-sentence evaluation with one '
            f'improvement.'
        )
    return dict(
        seed_key=seed, code=code, vocab=vocab_for(topic, subject),
        principle=principle, model=model, guided=guided, feedback=feedback,
        misconception=misconception, independent=independent, subject=subject,
    )


def visuals_for(seed: str, topic: str, subject: str):
    short = topic[:34]
    if subject == 'pdhpe':
        return [
            pair_visual('Cue/rule', short, 'Action', 'safer choice', f'{topic}.', 'Name why it helps.'),
            pair_visual('Unsafe', 'ignore rule', 'Better', 'include + check', 'Choice contrast.', 'Stay inclusive.'),
        ]
    if subject == 'english':
        return [
            pair_visual('Claim', short, 'Evidence', 'quote/detail', f'{topic}.', 'Explain effect.'),
            pair_visual('Weak', 'summary only', 'Strong', 'CEE paragraph', 'Analysis craft.', 'Stay text-bound.'),
        ]
    if subject == 'mathematics':
        return [
            pair_visual('Values', short, 'Method', 'shown working', f'{topic}.', 'Check reasonableness.'),
            pair_visual('Weak', 'no working', 'Strong', 'steps + check', 'Accurate method.', 'Name the skill.'),
        ]
    if subject == 'science':
        return [
            pair_visual('Question', short, 'Evidence', 'observation', f'{topic}.', 'Claim matches data.'),
            pair_visual('Weak', 'guess only', 'Strong', 'evidence link', 'Fair thinking.', 'Note limits.'),
        ]
    if subject == 'hsie':
        return [
            pair_visual('Locate', short, 'Source', 'published detail', f'{topic}.', 'State limits.'),
            pair_visual('Perspective', 'whose view', 'Limit', 'unknowns', 'Fair claims.', 'No invented culture.'),
        ]
    return [
        pair_visual('Need', short, 'Criteria', 'success checks', f'{topic}.', 'Plan before make.'),
        pair_visual('Test', 'result noted', 'Improve', 'next change', 'Evaluate cycle.', 'Safety first.'),
    ]


def validated_set(hub: Path) -> set[str]:
    cp = json.loads((hub / 'checkpoint.json').read_text())
    return {
        sk for sk, entry in cp.get('lessons', {}).items()
        if (entry.get('gates') or {}).get('automated_validation_passed')
    }


def remaining_seeds(prefix: str, hub: Path) -> list[str]:
    validated = validated_set(hub)
    db = reconstruct()
    try:
        rows = db.execute(
            'SELECT seed_key FROM lessons WHERE seed_key LIKE ? ORDER BY seed_key',
            (prefix + '%',),
        ).fetchall()
        return [r[0] for r in rows if r[0] not in validated]
    finally:
        db.close()


def remaining_matching(patterns: list[str], hub: Path) -> list[str]:
    """Return unvalidated seeds matching any fnmatch-style partition pattern."""
    from parallel_workers import seed_matches  # local package sibling

    validated = validated_set(hub)
    db = reconstruct()
    try:
        rows = db.execute('SELECT seed_key FROM lessons ORDER BY seed_key').fetchall()
        return [r[0] for r in rows if r[0] not in validated and seed_matches(r[0], patterns)]
    finally:
        db.close()


def write_seeds(seeds: list[str], subject: str, out_dir: Path, code: str):
    if subject == 'pdhpe':
        from pdhpe_y7_support import write_batch
        kwargs = {}
    elif subject == 'english':
        from english_y8_support import write_batch
        kwargs = {'label': 'Y8 English'}
    elif subject == 'mathematics':
        from stage4_maths_support import write_batch
        kwargs = {}
    elif subject == 'science':
        from stage4_science_support import write_batch
        kwargs = {}
    elif subject == 'hsie':
        from hsie_y7_support import write_batch
        kwargs = {}
    else:
        from tech_y7_support import write_batch
        kwargs = {}

    db = reconstruct()
    lessons = []
    visuals = {}
    try:
        for seed in seeds:
            row = db.execute('SELECT * FROM lessons WHERE seed_key=?', (seed,)).fetchone()
            if row is None:
                raise ValueError(seed)
            base = baseline_data(row)
            topic = topic_of(base.get('title') or seed)
            local_code = code
            if subject == 'hsie':
                area = str(row['learning_area'] or '').lower()
                local_code = 'GE4-1' if 'geograph' in area else 'HT4-1'
            lessons.append(build_spec(seed, topic, subject, local_code))
            visuals[seed] = visuals_for(seed, topic, subject)
    finally:
        db.close()

    write_batch(lessons, visuals, out_dir=out_dir, expected_count=len(lessons), **kwargs)
    return [u['seed_key'] for u in lessons]


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--hub', type=Path, default=Path('lesson-pipeline'))
    p.add_argument('--out-dir', type=Path, required=True)
    p.add_argument('--subject', choices=['pdhpe', 'english', 'technology', 'mathematics', 'science', 'hsie'],
                   required=True)
    p.add_argument('--prefix', default=None,
                   help='Seed prefix (LIKE prefix%%). Optional when --seed or --pattern is set.')
    p.add_argument('--pattern', action='append', default=[],
                   help='fnmatch ownership pattern; may be repeated')
    p.add_argument('--seed', action='append', default=[],
                   help='Exact seed_key to author; may be repeated')
    p.add_argument('--limit', type=int, default=12)
    p.add_argument('--code', default=None)
    args = p.parse_args()
    code = args.code or {
        'pdhpe': 'PD4-1',
        'english': 'EN4-URA-01',
        'technology': 'TM4-1',
        'mathematics': 'MA4-ARI-C-01',
        'science': 'SC4-WS-01',
        'hsie': 'HT4-1',
    }[args.subject]
    if args.seed:
        validated = validated_set(args.hub)
        seeds = [s for s in args.seed if s not in validated][: args.limit]
    elif args.pattern:
        seeds = remaining_matching(args.pattern, args.hub)[: args.limit]
    elif args.prefix:
        seeds = remaining_seeds(args.prefix, args.hub)[: args.limit]
    else:
        raise SystemExit('Provide --prefix, --pattern, and/or --seed')
    if not seeds:
        print(json.dumps({'wrote': 0, 'seeds': []}))
        return 0
    written = write_seeds(seeds, args.subject, args.out_dir, code)
    print(json.dumps({'wrote': len(written), 'seeds': written}, indent=2))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
