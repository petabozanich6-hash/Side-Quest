#!/usr/bin/env python3
"""Repair quiz/teach-check assessments in authored Written Core bundles.

SAFE USE (owner coordination):
  Operate on an explicit --authored-dir path (copy, offline inventory, or worktree),
  never on another agent's live working tree unless that agent has paused and
  handed off the path.

Preserves teaching content, visuals, identity and curriculum fields. Rebuilds only
assessment surfaces that fail the Gold assessment-quality gate.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

from assessment_quiz import BANNED_STEM, ELLIPSIS, FILLER_OPTION, build_skill_quiz, shuffle_teach_check
from pipeline import atomic_json

HERE = Path(__file__).resolve().parent
DEFAULT_ROOT = HERE.parents[1]
LIVE_AUTHORED_HINTS = (
    str(Path('/Users/petab/Side-Quest/lesson-pipeline/authored')),
    str(Path('/workspace/Side-Quest/lesson-pipeline/authored')),
)


def detect_subject(lesson: dict) -> str:
    area = (lesson.get('learning_area') or lesson.get('subject') or '').lower()
    seed = lesson.get('seed_key') or ''
    code = ''
    m = re.match(r's[24]-([a-z]+)-', seed)
    if m:
        code = m.group(1)
    if 'math' in area or code == 'mat':
        return 'mathematics'
    if 'science' in area or code == 'sci':
        return 'science'
    if 'hsie' in area or code == 'hsie':
        return 'hsie'
    if 'pdhpe' in area or code == 'pdhpe':
        return 'pdhpe'
    if 'creative' in area or 'arts' in area or code == 'arts':
        return 'arts'
    if 'english' in area or code == 'eng':
        return 'english'
    return 'english'


def quiz_is_weak(lesson: dict) -> bool:
    mc = [q for q in lesson.get('quiz') or [] if q.get('type') == 'multiple_choice']
    sa = [q for q in lesson.get('quiz') or [] if q.get('type') == 'short_answer']
    if len(mc) < 8 or len(sa) < 2:
        return True
    if any(BANNED_STEM.search(q.get('question') or '') for q in mc):
        return True
    if any(ELLIPSIS.search(o or '') for q in mc for o in (q.get('options') or [])):
        return True
    if any(FILLER_OPTION.search(o or '') for q in mc for o in (q.get('options') or [])):
        return True
    from collections import Counter
    counts = Counter(q.get('correct_index', 0) for q in mc)
    if max(counts.values()) > max(3, len(mc) // 2):
        return True
    if len(counts) < 2:
        return True
    if any(re.match(r'^Require (new|a real|independently)\b', q.get('marking_guide') or '') for q in sa):
        return True
    study = re.compile(
        r'practising |shows understanding|shows transfer|independent use of|feedback comment',
        re.I,
    )
    if sum(1 for q in mc if study.search(q.get('question') or '')) > 1:
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
    criteria = lesson.get('success_criteria') or []
    vocab = []
    for line in criteria[:4]:
        m = re.search(r'I can (?:use|identify|practise|notice|round|solve|describe) ([^.]+)', line or '', re.I)
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
    teach_meta = any(
        BANNED_STEM.search((s.get('check') or {}).get('question') or '')
        for s in lesson.get('teach_steps') or []
    )
    if not quiz_is_weak(lesson) and not teach_meta:
        return False
    subject = detect_subject(lesson)
    fields = extract_fields(bundle)
    distractors = [
        'A claim that names no evidence from the lesson material.',
        'A method that skips the key step taught in this lesson.',
        'A label that sounds complete but does not match the asked quantity or idea.',
        'An answer that mixes two different ideas from the lesson.',
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
            f'Which choice best applies this lesson idea about {fields["vocab"][0]} with clear evidence?',
            correct, wrongs,
            (check.get('explanation') or correct) + ' Apply the lesson idea with evidence.',
            lesson['seed_key'], i)
    bundle['lesson'] = lesson
    return True


def _resolve_paths(authored_dir: Path, seeds: list[str], glob_pat: str) -> list[Path]:
    if seeds:
        return [authored_dir / f'{s}.json' for s in seeds]
    return sorted(authored_dir.glob(glob_pat))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--authored-dir', type=Path, default=None,
                        help='Directory of authored JSON bundles (required for bulk repair).')
    parser.add_argument('--seed', action='append', default=[])
    parser.add_argument('--glob', default='*.json', help='Glob under authored-dir when not using --seed.')
    parser.add_argument('--limit', type=int, default=0)
    parser.add_argument('--all-weak', action='store_true',
                        help='Repair every weak quiz under authored-dir.')
    parser.add_argument('--dry-run', action='store_true')
    parser.add_argument('--allow-live-authored', action='store_true',
                        help='Permit writing into a known live authoring authored/ path.')
    args = parser.parse_args()

    authored = (args.authored_dir or (DEFAULT_ROOT / 'lesson-pipeline' / 'authored')).resolve()
    if not authored.is_dir():
        print(json.dumps({'error': f'authored dir missing: {authored}'}), file=sys.stderr)
        sys.exit(2)

    authored_s = str(authored)
    if any(authored_s == hint or authored_s.startswith(hint + '/') for hint in LIVE_AUTHORED_HINTS):
        if not args.allow_live_authored:
            print(json.dumps({
                'error': 'Refusing to modify a live authoring authored/ path. '
                         'Copy offline, use another worktree, or pass --allow-live-authored after handoff.',
                'authored_dir': authored_s,
            }, indent=2), file=sys.stderr)
            sys.exit(3)

    paths = _resolve_paths(authored, args.seed, args.glob)
    repaired, skipped, missing, would = [], [], [], []
    for path in paths:
        if not path.exists():
            missing.append(path.name)
            continue
        bundle = json.loads(path.read_text())
        lesson = bundle.get('lesson') or {}
        if not args.seed and not args.all_weak and not quiz_is_weak(lesson):
            skipped.append(path.stem)
            continue
        if not quiz_is_weak(lesson) and not any(
            BANNED_STEM.search((s.get('check') or {}).get('question') or '')
            for s in lesson.get('teach_steps') or []
        ):
            skipped.append(path.stem)
            continue
        if args.dry_run:
            would.append(path.stem)
            if args.limit and len(would) >= args.limit:
                break
            continue
        if repair_bundle(bundle):
            atomic_json(path, bundle)
            repaired.append(path.stem)
        else:
            skipped.append(path.stem)
        if args.limit and len(repaired) >= args.limit:
            break
    print(json.dumps({
        'authored_dir': authored_s,
        'dry_run': args.dry_run,
        'repaired': len(repaired),
        'would_repair': len(would),
        'skipped': len(skipped),
        'missing': missing,
        'sample_repaired': (would or repaired)[:12],
    }, indent=2))


if __name__ == '__main__':
    main()
