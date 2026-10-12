#!/usr/bin/env python3
"""Repair quiz/teach-check assessments in authored Written Core bundles in place.

Preserves teaching content, visuals, identity and curriculum fields. Rebuilds only
assessment surfaces that failed the Gold assessment-quality gate.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

from assessment_quiz import build_skill_quiz, shuffle_teach_check
from pipeline import ROOT, atomic_json

AUTHORED = ROOT / 'lesson-pipeline' / 'authored'
BANNED = re.compile(
    r'which idea is taught|which feedback is most useful|which statement appeared'
    r'|what should you demonstrate in this teaching stage',
    re.I,
)


def detect_subject(lesson: dict) -> str:
    area = (lesson.get('learning_area') or lesson.get('subject') or '').lower()
    seed = lesson.get('seed_key') or ''
    if 'math' in area or seed.startswith('s2-mat-'):
        return 'mathematics'
    if 'science' in area or seed.startswith('s2-sci-'):
        return 'science'
    if 'hsie' in area or seed.startswith('s2-hsie-'):
        return 'hsie'
    if 'pdhpe' in area or seed.startswith('s2-pdhpe-'):
        return 'pdhpe'
    if 'creative' in area or 'arts' in area or seed.startswith('s2-arts-'):
        return 'arts'
    return 'english'


def quiz_is_weak(lesson: dict) -> bool:
    mc = [q for q in lesson.get('quiz') or [] if q.get('type') == 'multiple_choice']
    if len(mc) < 8:
        return True
    if any(BANNED.search(q.get('question') or '') for q in mc):
        return True
    from collections import Counter
    counts = Counter(q.get('correct_index', 0) for q in mc)
    if max(counts.values()) > max(3, len(mc) // 2):
        return True
    if len(counts) < 2:
        return True
    return False


def extract_fields(bundle: dict) -> dict:
    lesson = bundle['lesson']
    req = bundle.get('requirements') or {}
    teaching = req.get('teaching') or []
    practice = req.get('practice') or {}
    rule = lesson.get('learning_intention') or lesson.get('child_mission') or ''
    model = (teaching[0].get('model') if teaching else '') or ''
    prompt = (practice.get('guided_inputs') or [''])[0]
    answer = (teaching[0].get('feedback') if teaching else '') or ''
    pitfall = (teaching[0].get('misconception') if teaching else '') or ''
    task = (practice.get('independent_inputs') or [''])[0]
    # Prefer vocab-like success criteria fragments when present.
    criteria = lesson.get('success_criteria') or []
    vocab = []
    for line in criteria[:4]:
        m = re.search(r'I can (?:use|identify|practise|notice) ([^.]+)', line or '', re.I)
        vocab.append((m.group(1).split(' with')[0].strip() if m else 'this skill')[:40])
    while len(vocab) < 4:
        vocab.append('this skill')
    if not model and lesson.get('worked_example'):
        model = lesson['worked_example'].split('\n')[1] if '\n' in lesson['worked_example'] else lesson['worked_example']
    if not prompt and lesson.get('guided_practice'):
        g = lesson['guided_practice']
        prompt = g.split('FEEDBACK')[0].replace('PRACTISE BEFORE READING THE FEEDBACK', '').strip()
    if not answer and 'FEEDBACK' in (lesson.get('guided_practice') or ''):
        answer = lesson['guided_practice'].split('FEEDBACK', 1)[1].split('WATCH FOR')[0].strip()
    if not pitfall and 'WATCH FOR' in (lesson.get('guided_practice') or ''):
        pitfall = lesson['guided_practice'].split('WATCH FOR', 1)[1].strip()
    if not task:
        task = (lesson.get('independent_task') or '')[:240]
    return dict(rule=rule, model=model, prompt=prompt, answer=answer, pitfall=pitfall, task=task, vocab=vocab)


def repair_bundle(bundle: dict) -> bool:
    lesson = bundle['lesson']
    if not quiz_is_weak(lesson) and not any(
        BANNED.search((s.get('check') or {}).get('question') or '') for s in lesson.get('teach_steps') or []
    ):
        return False
    subject = detect_subject(lesson)
    fields = extract_fields(bundle)
    distractors = [
        'Ignore the task and invent an unrelated answer.',
        'Copy the worked example and call it independent work.',
        'Treat a missing detail as a proven fact.',
        'Skip reasoning because the first guess looked neat.',
    ]
    quiz = build_skill_quiz(
        lesson['seed_key'], subject, fields['rule'], fields['model'], fields['prompt'],
        fields['answer'], fields['pitfall'], fields['task'], fields['vocab'], distractors)
    lesson['quiz'] = quiz
    sa = [q for q in quiz if q['type'] == 'short_answer']
    lesson['parent_notes'] = (
        'Parent: Marking guidance for the independent task: ' + fields['task'][:220] +
        ' Accept equivalent original responses that show the same skill.\n\n'
        'Parent: Written model 1: ' + sa[0]['sample_answer'] + '\n\n'
        'Parent: Written model 2: ' + sa[1]['sample_answer'] + '\n\n'
        'Parent: Likely misconception: ' + fields['pitfall'] +
        ' Keep sample answers out of the child role.\n\n'
        'Parent: Short-answer focus 1: ' + sa[0]['question'] + '\n\n'
        'Parent: Short-answer focus 2: ' + sa[1]['question'] + '\n\n'
        'Parent: Marking notes: ' + sa[0]['marking_guide'] + ' / ' + sa[1]['marking_guide'] + '.'
    )
    for i, step in enumerate(lesson.get('teach_steps') or []):
        check = step.get('check') or {}
        opts = check.get('options') or []
        correct = opts[check.get('correct_index', 0)] if opts else fields['rule']
        wrongs = [o for j, o in enumerate(opts) if j != check.get('correct_index', 0)] or distractors[:3]
        step['check'] = shuffle_teach_check(
            f'Which choice best shows accurate use of this idea about {fields["vocab"][0]}?',
            correct, wrongs,
            (check.get('explanation') or correct) + ' Apply the lesson idea with evidence.',
            lesson['seed_key'], i)
    bundle['lesson'] = lesson
    return True


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--seed', action='append', default=[])
    parser.add_argument('--limit', type=int, default=0)
    parser.add_argument('--all-weak', action='store_true')
    args = parser.parse_args()
    paths = []
    if args.seed:
        paths = [AUTHORED / f'{s}.json' for s in args.seed]
    else:
        paths = sorted(AUTHORED.glob('s2-*-y3-*.json'))
    repaired, skipped, missing = [], [], []
    for path in paths:
        if not path.exists():
            missing.append(path.name)
            continue
        bundle = json.loads(path.read_text())
        if not args.seed and not args.all_weak and not quiz_is_weak(bundle['lesson']):
            skipped.append(path.stem)
            continue
        if repair_bundle(bundle):
            atomic_json(path, bundle)
            repaired.append(path.stem)
        else:
            skipped.append(path.stem)
        if args.limit and len(repaired) >= args.limit:
            break
    print(json.dumps({
        'repaired': len(repaired),
        'skipped': len(skipped),
        'missing': missing,
        'sample_repaired': repaired[:12],
    }, indent=2))


if __name__ == '__main__':
    main()
