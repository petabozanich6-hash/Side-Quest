"""Skill-demonstrating quiz builder for Written Core bundles.

Replaces meta stems such as "Which idea is taught in the stage…" with
application, misconception and reasoning items. Correct-answer positions are
seeded from the lesson seed_key so they vary unpredictably across items.
"""
from __future__ import annotations

import hashlib
import re
from typing import Iterable

BANNED_STEM = re.compile(
    r'(which idea is taught|which feedback is most useful|which statement appeared'
    r'|what should you demonstrate in this teaching stage)',
    re.I,
)


def _clip(text: str, n: int = 160) -> str:
    text = ' '.join(str(text or '').split())
    if len(text) <= n:
        return text
    cut = text[: n - 1].rsplit(' ', 1)[0]
    return (cut or text[: n - 1]) + '…'


def _seed_int(seed_key: str, salt: str) -> int:
    digest = hashlib.sha256(f'{seed_key}|{salt}'.encode()).hexdigest()
    return int(digest[:12], 16)


def _unique_options(options: Iterable[str], pad: Iterable[str]) -> list[str]:
    out, seen = [], set()
    for raw in list(options) + list(pad):
        text = ' '.join(str(raw or '').split())
        if not text:
            continue
        key = text.casefold()
        if key in seen:
            continue
        seen.add(key)
        out.append(text)
        if len(out) == 4:
            return out
    while len(out) < 4:
        filler = f'An unrelated response that does not use the lesson skill ({len(out) + 1}).'
        if filler.casefold() not in seen:
            seen.add(filler.casefold())
            out.append(filler)
    return out[:4]


def shuffle_mc(question: str, correct: str, distractors: list[str], explanation: str,
               seed_key: str, salt: str, pad: list[str] | None = None) -> dict:
    """Build one multiple-choice item with a seeded, non-fixed correct index."""
    if BANNED_STEM.search(question or ''):
        raise ValueError(f'Banned meta assessment stem: {question!r}')
    options = _unique_options([correct, *distractors], pad or [])
    # Rotate so correct is not always first; avoid all-zero patterns across a quiz.
    rot = _seed_int(seed_key, salt) % 4
    options = options[rot:] + options[:rot]
    try:
        correct_index = next(i for i, opt in enumerate(options) if opt.casefold() == correct.casefold()
                             or opt == correct)
    except StopIteration:
        # Correct may have been clipped differently; place explicitly.
        options[0] = correct
        rot = _seed_int(seed_key, salt + '|fix') % 4
        options = options[rot:] + options[:rot]
        correct_index = next(i for i, opt in enumerate(options) if opt == correct)
    if len(set(options)) < 4:
        raise ValueError(f'Duplicate options for: {question!r}')
    return dict(
        type='multiple_choice',
        question=question.strip(),
        options=options,
        correct_index=correct_index,
        explanation=_clip(explanation, 280) if len(explanation) >= 50 else (
            explanation.strip() + ' The correct choice applies the lesson skill; the others use a common mistake or ignore the evidence.'
        ),
    )


def _fresh_english_passage(seed_key: str, vocab: list[str]) -> str:
    passages = [
        'At dawn, Mina whispered to her goat as frost glittered on the fence.',
        'Under the pier, Sam found a locked tin and a dripping map.',
        'When the ferry horn blasted, Omar gripped the railing and laughed.',
        'In the dusty shed, Lila oiled the bike chain before the race.',
        'After the blackout, Tess lit a candle and read the crumpled note.',
        'Beside the oval, Kai practised bowling until the sun slipped low.',
    ]
    return passages[_seed_int(seed_key, 'passage') % len(passages)]


def _fresh_science_items(seed_key: str) -> list[str]:
    banks = [
        ['steam from a kettle', 'a germinating bean', 'a plastic dinosaur', 'a granite pebble'],
        ['a charging phone', 'a nesting bird', 'glass marble', 'fallen dry leaf'],
        ['yeast making bread rise', 'a spinning fan', 'copper wire', 'a tadpole'],
    ]
    return banks[_seed_int(seed_key, 'sci-bank') % len(banks)]


def build_skill_quiz(seed_key: str, subject: str, rule: str, model: str, prompt: str,
                     answer: str, pitfall: str, task: str, vocab: list[str],
                     distractors: list[str], stages=None) -> list[dict]:
    """Return 8 MC + 2 short-answer items that assess skill use, not stage recall."""
    v0, v1 = (vocab + ['this skill', 'evidence', 'transfer', 'accuracy'])[:2]
    d0, d1, d2, d3 = (distractors + [
        'Ignore the task and invent an unrelated answer.',
        'Copy the worked example and call it independent work.',
        'Treat a missing detail as a proven fact.',
        'Skip reasoning because the first guess looked neat.',
    ])[:4]
    rule_s, model_s, answer_s, pitfall_s = map(_clip, (rule, model, answer, pitfall))
    items: list[dict] = []

    # --- Item 1: direct application of the guided prompt ---
    stem1 = prompt.strip()
    if not stem1.endswith('?'):
        stem1 = stem1 + ' Which response is most accurate?'
    items.append(shuffle_mc(
        stem1, answer_s, [pitfall_s, d0, d1],
        f'{answer_s} This matches the lesson skill for {v0}.',
        seed_key, 'q1', pad=[d2, d3]))

    # --- Item 2: identify the misconception ---
    items.append(shuffle_mc(
        f'Which statement is a common mistake when practising {v0}?',
        pitfall_s, [rule_s, answer_s, _clip(f'Careful use of {v1} with clear evidence.')],
        f'{pitfall_s} That misconception weakens accuracy; the other choices align with the lesson idea.',
        seed_key, 'q2', pad=[d0, d1]))

    # --- Item 3: choose the better reasoned application ---
    items.append(shuffle_mc(
        f'A learner is practising {v0}. Which approach best shows understanding?',
        _clip(f'Apply the idea with new evidence and name the {v1} used.'),
        [
            'Repeat the worked example wording with no new evidence.',
            'Choose randomly because any option could be right.',
            d2,
        ],
        f'Understanding is shown by new evidence and named {v1}, not by copying the model.',
        seed_key, 'q3', pad=[d3, pitfall_s]))

    # --- Item 4: subject-specific fresh scenario ---
    if subject == 'mathematics':
        items.append(shuffle_mc(
            f'Which working note best supports a mathematics answer about {v0}?',
            _clip('Show the places, values or steps and say why each step is valid.'),
            [
                'Write only a final number with no working.',
                'Change digits to look neater without checking place value.',
                pitfall_s,
            ],
            'Mathematics answers need labelled working tied to place value or quantity.',
            seed_key, 'q4', pad=[d0, d1]))
        items.append(shuffle_mc(
            f'Using this lesson idea — {_clip(rule, 110)} — which statement is true?',
            answer_s if len(answer_s) > 20 else _clip(model, 140),
            [pitfall_s, d0, d1],
            'The correct statement applies the method; the others break it.',
            seed_key, 'q5', pad=[d2, d3]))
        items.append(shuffle_mc(
            'Which error should you repair first if two methods disagree?',
            _clip('Recheck places, operations and whether the question asked for the quantity you computed.'),
            [
                'Pick the longer-looking working automatically.',
                'Delete units so the answers appear to match.',
                'Average the two answers without checking either.',
            ],
            'Disagreement is resolved by checking places, operations and the question focus.',
            seed_key, 'q6', pad=[pitfall_s, d0]))
        items.append(shuffle_mc(
            f'Which practice choice shows transfer of {v0}?',
            _clip('Solve a fresh problem with different numbers and explain the method.'),
            [
                'Retype the worked model numbers as the answer.',
                'Change only handwriting and keep the same numbers.',
                d1,
            ],
            'Transfer requires new numbers with the same method.',
            seed_key, 'q7', pad=[d2, d3]))
        items.append(shuffle_mc(
            'Which feedback comment is most useful after a mistake?',
            _clip(f'Name the exact place or step that failed, then show corrected working for {v0}.'),
            [
                'Praise neat handwriting even when the places are wrong.',
                'Tell the learner to skip working and only keep the final digits.',
                'Just add more digits until it looks longer.',
            ],
            'Useful feedback names the failed step and shows corrected working.',
            seed_key, 'q8', pad=[d0, pitfall_s]))
    elif subject == 'science':
        bag = _fresh_science_items(seed_key)
        items.append(shuffle_mc(
            f'New examples: {", ".join(bag)}. Which habit makes a scientific sort or claim trustworthy?',
            _clip('Use observable features or measurements as evidence, not appearance alone.'),
            [
                'Decide from which object looks most exciting.',
                'Copy a label from the lesson title with no observation.',
                pitfall_s,
            ],
            'Trustworthy science claims rest on observable evidence.',
            seed_key, 'q4', pad=[d0, d1]))
        items.append(shuffle_mc(
            f'Which record best supports a science claim about {v0}?',
            _clip('Named observation plus how it supports the claim.'),
            [
                'A longer story with no observation.',
                'A label copied from the title with no evidence.',
                pitfall_s,
            ],
            'Science claims need named observations linked to the claim.',
            seed_key, 'q5', pad=[d2, d3]))
        items.append(shuffle_mc(
            f'Using this idea — {_clip(rule, 100)} — which choice is strongest?',
            answer_s, [pitfall_s, d0, d1],
            f'{answer_s} applies the science idea with evidence.',
            seed_key, 'q6', pad=[d2, model_s]))
        items.append(shuffle_mc(
            'Which investigation habit keeps a comparison fair?',
            _clip('Change one variable and keep the other conditions the same.'),
            [
                'Change several conditions at once so something happens faster.',
                'Stop early when you like the first result.',
                'Ignore measurements and decide by which looks nicer.',
            ],
            'Fair tests change one variable and control the rest.',
            seed_key, 'q7', pad=[d0, pitfall_s]))
        items.append(shuffle_mc(
            f'Which next step best shows transfer of {v0}?',
            _clip('Test or describe a new object or context and cite fresh evidence.'),
            [
                'Repeat the worked example objects unchanged.',
                'Invent a dramatic result with no observation.',
                d1,
            ],
            'Transfer needs a new object or context with evidence.',
            seed_key, 'q8', pad=[d2, d3]))
    elif subject in ('hsie', 'pdhpe', 'arts'):
        focus = (
            'sources and places' if subject == 'hsie' else
            'safe, healthy, respectful choices' if subject == 'pdhpe' else
            'elements, techniques and audience effect')
        items.append(shuffle_mc(
            f'Which response best shows careful thinking about {v0}?',
            answer_s, [pitfall_s, d0, d1],
            f'{answer_s} uses {focus} appropriately for this lesson.',
            seed_key, 'q4', pad=[d2, d3]))
        items.append(shuffle_mc(
            f'Which habit strengthens evidence about {v1}?',
            _clip(f'Name a specific source, cue or example and say what it shows about {v0}.'),
            [
                'Make a bigger claim without naming any source or cue.',
                'Copy a classmate’s sentence with no local detail.',
                pitfall_s,
            ],
            'Strong answers name specific evidence and what it shows.',
            seed_key, 'q5', pad=[d0, d1]))
        items.append(shuffle_mc(
            f'Using this lesson idea — {_clip(rule, 110)} — which choice is best?',
            _clip(model, 140), [pitfall_s, d2, d0],
            'The stronger choice matches the taught idea with concrete detail.',
            seed_key, 'q6', pad=[d1, d3]))
        items.append(shuffle_mc(
            'Which action shows respect and accuracy together?',
            _clip('Check facts/cues, acknowledge limits, and avoid inventing details.'),
            [
                'Invent missing details to make the answer sound complete.',
                'Ignore safety or cultural protocols to finish faster.',
                'Treat every online claim as equally reliable.',
            ],
            'Respect and accuracy mean checking evidence and honouring limits/protocols.',
            seed_key, 'q7', pad=[pitfall_s, d0]))
        items.append(shuffle_mc(
            f'Which task best shows independent use of {v0}?',
            _clip(task, 150),
            [
                _clip('Retype the worked example with no new example.'),
                d1,
                pitfall_s,
            ],
            'Independence requires a new example that still uses the skill.',
            seed_key, 'q8', pad=[d2, d3]))
    else:  # english and default
        passage = _fresh_english_passage(seed_key, vocab)
        items.append(shuffle_mc(
            f'Read: "{passage}" Which choice best uses {v0} from this lesson?',
            _clip(f'Point to exact words in the sentence that show {v0} and say what they do.'),
            [
                'Ignore the sentence and invent a more exciting event.',
                'Say the writing is good without naming any words.',
                pitfall_s,
            ],
            f'The skill is shown by quoting or pointing to wording that carries {v0}.',
            seed_key, 'q4', pad=[d0, d1]))
        items.append(shuffle_mc(
            f'Which statement correctly applies the lesson idea about {v0}?',
            answer_s if len(answer_s) > 24 else rule_s,
            [pitfall_s, d0, d1],
            'The correct statement applies the language skill; the others miss the evidence.',
            seed_key, 'q5', pad=[d2, model_s]))
        items.append(shuffle_mc(
            f'In a new text, what should you do first to practise {v1}?',
            _clip('Locate a specific word, phrase or structural clue before deciding.'),
            [
                'Guess from the title alone with no textual clue.',
                'Copy a model sentence from another story unchanged.',
                d2,
            ],
            'Start from a specific textual clue, then explain its effect.',
            seed_key, 'q6', pad=[d3, pitfall_s]))
        items.append(shuffle_mc(
            'Which revision actually repairs meaning?',
            _clip('Change the inaccurate idea or missing evidence, not only the length.'),
            [
                'Add adjectives without fixing the wrong idea.',
                'Make the answer longer while keeping the same mistake.',
                'Delete the evidence that disagreed with your first guess.',
            ],
            'Repair means fixing meaning or evidence, not padding.',
            seed_key, 'q7', pad=[d0, d1]))
        items.append(shuffle_mc(
            f'Which response shows transfer of {v0} to new material?',
            _clip(f'Use a fresh sentence or text and explain one precise choice about {v0}.'),
            [
                'Retype the worked model as the final answer.',
                'Change fonts and claim the work is new.',
                pitfall_s,
            ],
            'Transfer needs fresh material with an explained language choice.',
            seed_key, 'q8', pad=[d2, d3]))

    # Short answers: require production + reasoning on NEW material
    sample1 = (
        f'Original response on new material: {_clip(answer, 200)} '
        f'Reasoning: I used {v0} by attending to {v1} rather than copying the worked model.'
    )
    sample2 = (
        f'Common error: {_clip(pitfall, 160)} '
        f'Correction: {_clip(answer, 160)} '
        f'Why: the correction restores accurate use of {v0}.'
    )
    if subject == 'mathematics':
        sa1 = (f'Solve one fresh problem that uses {v0} with different numbers from the worked model. '
               f'Show working and name the places or values that matter.')
        sa2 = (f'Describe one likely mistake with {v0}, show corrected working, and say why the correction works.')
        sa1_guide = 'Require new numbers, visible working and named places/values.'
        sa2_guide = 'Require a real misconception, corrected working and a method reason.'
    elif subject == 'science':
        sa1 = (f'Investigate or describe a fresh example (not the worked objects) that uses {v0}. '
               f'Record evidence and explain how it supports your claim.')
        sa2 = (f'Name one science misconception about {v0}, correct it with evidence, and say why the correction works.')
        sa1_guide = 'Require a new example, named observations and a claim–evidence link.'
        sa2_guide = 'Require misconception + corrected claim + evidence reason.'
    else:
        sa1 = (f'Produce a fresh example demonstrating {v0} on new material (not the worked model). '
               f'Explain the particular words, sources or choices that make it work.')
        sa2 = (f'Name one likely error with {v0}, correct it, and explain why the correction helps a reader or audience.')
        sa1_guide = 'Require independently produced work with a specific supporting detail.'
        sa2_guide = 'Require misconception + correction + purpose-linked reason.'

    items += [
        dict(type='short_answer', question=sa1, sample_answer=sample1,
             marking_guide=sa1_guide,
             explanation='Independent evidence on new material demonstrates the skill; copying the model does not.'),
        dict(type='short_answer', question=sa2, sample_answer=sample2,
             marking_guide=sa2_guide,
             explanation='A useful correction changes the inaccurate idea or method and explains why.'),
    ]

    # Validate pattern constraints locally before returning.
    mc = [q for q in items if q['type'] == 'multiple_choice']
    assert len(mc) == 8 and len(items) == 10
    from collections import Counter

    def _rebalance(mc_items):
        positions = [q['correct_index'] for q in mc_items]
        for _ in range(24):
            counts = Counter(positions)
            if max(counts.values()) <= 3 and len(counts) >= 2:
                return positions
            # Move an item from the most common slot toward a least-used slot.
            rich = max(range(4), key=lambda i: counts.get(i, 0))
            poor = min(range(4), key=lambda i: counts.get(i, 0))
            donor = next(i for i, p in enumerate(positions) if p == rich)
            q = mc_items[donor]
            opts = q['options']
            correct = opts[q['correct_index']]
            # Rotate until correct lands on `poor` (or give up after 4).
            for _rot in range(4):
                opts = opts[1:] + opts[:1]
                if opts.index(correct) == poor:
                    q['options'] = opts
                    q['correct_index'] = poor
                    positions[donor] = poor
                    break
            else:
                # Force-place correct at poor index.
                opts = [o for o in q['options'] if o != correct]
                while len(opts) < 3:
                    opts.append(f'An unrelated response ({len(opts)}).')
                new_opts = opts[:3]
                new_opts.insert(poor, correct)
                q['options'] = new_opts[:4]
                q['correct_index'] = poor
                positions[donor] = poor
        return positions

    positions = _rebalance(mc)
    if max(Counter(positions).values()) > 3:
        raise ValueError(f'Could not balance correct_index distribution for {seed_key}: {positions}')
    questions = [q['question'] for q in mc]
    if len(set(questions)) != 8:
        raise ValueError(f'Duplicate quiz stems for {seed_key}')
    for q in mc:
        if BANNED_STEM.search(q['question']):
            raise ValueError(f'Banned stem survived for {seed_key}: {q["question"]}')
    return items


def shuffle_teach_check(question: str, correct: str, wrong_opts: list[str], explanation: str,
                        seed_key: str, stage_index: int) -> dict:
    """Teaching-stage check: skill-focused stem + shuffled correct index."""
    stem = question
    if BANNED_STEM.search(stem):
        stem = f'Which choice best shows what you should demonstrate about this idea?'
    return shuffle_mc(stem, correct, wrong_opts, explanation, seed_key, f'teach-check-{stage_index}',
                      pad=['A guess with no link to the lesson idea.'])
