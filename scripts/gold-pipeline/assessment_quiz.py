"""Skill-demonstrating quiz builder for Written Core bundles.

Builds subject-specific items that test the knowledge/skill taught in the lesson,
not meta study-behaviour recall. Correct-answer positions are seeded from the
lesson seed_key so they vary across items.
"""
from __future__ import annotations

import hashlib
import re
from collections import Counter
from typing import Iterable

# Narrow historical bans (still enforced). Broader study-behaviour templates are
# also rejected so regenerated quizzes cannot reintroduce them.
BANNED_STEM = re.compile(
    r'(which idea is taught|which feedback is most useful|which statement appeared'
    r'|what should you demonstrate in this teaching stage'
    r'|a learner is practising'
    r'|which approach best shows understanding'
    r'|which practice choice shows transfer'
    r'|which response shows transfer'
    r'|which next step best shows transfer'
    r'|which task best shows independent use'
    r'|which habit strengthens evidence'
    r'|which action shows respect and accuracy'
    r'|which revision actually repairs'
    r'|which feedback comment is most useful'
    r'|which working note best supports a mathematics'
    r'|which investigation habit keeps a comparison fair)',
    re.I,
)

FILLER_OPTION = re.compile(
    r'(any answer is equally supported|there is no need to compare'
    r'|unrelated response that does not use the lesson skill'
    r'|ignore the task and invent'
    r'|copy the worked example and call it'
    r'|copy the model numbers and call'
    r'|copy the model word-for-word'
    r'|skip reasoning because'
    r'|choose randomly because any option'
    r'|treat a missing detail as a proven fact'
    r'|treat a missing detail as a stated fact)',
    re.I,
)

ELLIPSIS = re.compile(r'…|\.\.\.$')


def _seed_int(seed_key: str, salt: str) -> int:
    digest = hashlib.sha256(f'{seed_key}|{salt}'.encode()).hexdigest()
    return int(digest[:12], 16)


def _clean(text: str) -> str:
    return ' '.join(str(text or '').split()).strip()


def _first_sentence(text: str, n: int = 140) -> str:
    """Return a complete short phrase without ellipsis truncation markers."""
    text = _clean(text)
    if not text:
        return ''
    # Prefer a natural sentence end inside the budget.
    for sep in ('. ', '! ', '? ', '; '):
        idx = text.find(sep)
        if 24 <= idx + 1 <= n:
            return text[: idx + 1].strip()
    if len(text) <= n:
        return text
    cut = text[:n].rsplit(' ', 1)[0].rstrip('.,;:')
    return cut or text[:n]


def _strip_strong_prefix(text: str) -> str:
    text = _clean(text)
    text = re.sub(r'^(strong answer:\s*|model answer:\s*|correct:\s*)', '', text, flags=re.I)
    # Drop wrapping quotes often used in builder samples.
    if len(text) >= 2 and text[0] in "\"'" and text[-1] in "\"'":
        text = text[1:-1].strip()
    return text


def _option(text: str, n: int = 120) -> str:
    return _first_sentence(_strip_strong_prefix(text), n)


def _explain(correct: str, why: str, distractor_why: str) -> str:
    base = _clean(why)
    if len(base) < 40:
        base = f'{_option(correct, 80)} is correct because {base}'.strip()
    tail = _clean(distractor_why)
    if tail and tail.casefold() not in base.casefold():
        text = f'{base} {tail}'
    else:
        text = base
    if len(text) < 50:
        text += ' The other options use a common misconception or leave out needed evidence.'
    # Avoid circular explanations that only restate the correct option.
    corr = _option(correct, 60).casefold()
    if corr and len(corr) > 24 and text.casefold().startswith(corr) and len(text) < len(corr) + 45:
        text = f'{why} Unlike the distractors, this choice applies the taught method with the right evidence.'
    return _first_sentence(text, 280) if len(text) > 280 else text


def _unique_options(options: Iterable[str], pad: Iterable[str]) -> list[str]:
    out, seen = [], set()
    for raw in list(options) + list(pad):
        text = _option(raw)
        if not text or FILLER_OPTION.search(text) or ELLIPSIS.search(text):
            continue
        key = text.casefold()
        if key in seen:
            continue
        seen.add(key)
        out.append(text)
        if len(out) == 4:
            return out
    # Subject-plausible structural pads (still content-neutral, never unreadable fillers).
    for extra in pad:
        text = _option(extra)
        if not text:
            continue
        key = text.casefold()
        if key in seen:
            continue
        seen.add(key)
        out.append(text)
        if len(out) == 4:
            return out
    fallbacks = [
        'A claim that names no evidence from the lesson material.',
        'A method that skips the key step taught in this lesson.',
        'A label that sounds complete but does not match the asked quantity or idea.',
        'An answer that mixes two different ideas from the lesson.',
    ]
    for fb in fallbacks:
        if fb.casefold() not in seen:
            seen.add(fb.casefold())
            out.append(fb)
        if len(out) == 4:
            return out
    while len(out) < 4:
        out.append(f'A different incorrect method ({len(out) + 1}).')
    return out[:4]


def shuffle_mc(question: str, correct: str, distractors: list[str], explanation: str,
               seed_key: str, salt: str, pad: list[str] | None = None) -> dict:
    """Build one multiple-choice item with a seeded, non-fixed correct index."""
    stem = _clean(question)
    if BANNED_STEM.search(stem or ''):
        raise ValueError(f'Banned meta assessment stem: {question!r}')
    correct_opt = _option(correct)
    if not correct_opt:
        raise ValueError(f'Empty correct option for: {question!r}')
    options = _unique_options([correct_opt, *distractors], pad or [])
    rot = _seed_int(seed_key, salt) % 4
    options = options[rot:] + options[:rot]
    try:
        correct_index = next(
            i for i, opt in enumerate(options)
            if opt.casefold() == correct_opt.casefold() or opt == correct_opt
        )
    except StopIteration:
        options[0] = correct_opt
        rot = _seed_int(seed_key, salt + '|fix') % 4
        options = options[rot:] + options[:rot]
        correct_index = next(i for i, opt in enumerate(options) if opt == correct_opt)
    if len(set(o.casefold() for o in options)) < 4:
        raise ValueError(f'Duplicate options for: {question!r}')
    if any(ELLIPSIS.search(o) for o in options):
        raise ValueError(f'Truncated option text for: {question!r}')
    if any(FILLER_OPTION.search(o) for o in options):
        raise ValueError(f'Filler distractor for: {question!r}')
    return dict(
        type='multiple_choice',
        question=stem if stem.endswith('?') else f'{stem}?',
        options=options,
        correct_index=correct_index,
        explanation=_explain(correct_opt, explanation, 'The other choices miss a key step or use a common mistake.'),
    )


def _fresh_english_passage(seed_key: str) -> str:
    passages = [
        'At dawn, Mina whispered to her goat as frost glittered on the fence.',
        'Under the pier, Sam found a locked tin and a dripping map.',
        'When the ferry horn blasted, Omar gripped the railing and laughed.',
        'In the dusty shed, Lila oiled the bike chain before the race.',
        'After the blackout, Tess lit a candle and read the crumpled note.',
        'Beside the oval, Kai practised bowling until the sun slipped low.',
    ]
    return passages[_seed_int(seed_key, 'passage') % len(passages)]


def _fresh_science_bag(seed_key: str) -> list[str]:
    banks = [
        ['steam from a kettle', 'a germinating bean', 'a plastic dinosaur', 'a granite pebble'],
        ['a charging phone', 'a nesting bird', 'a glass marble', 'a fallen dry leaf'],
        ['yeast making bread rise', 'a spinning fan', 'copper wire', 'a tadpole'],
    ]
    return banks[_seed_int(seed_key, 'sci-bank') % len(banks)]


def _nums(text: str) -> list[str]:
    return re.findall(r'-?\d[\d,]*(?:\.\d+)?', text or '')


def _year_band(seed_key: str) -> str:
    m = re.search(r'-y(\d+)-', seed_key or '')
    if not m:
        return 'stage2'
    year = int(m.group(1))
    return 'stage4' if year >= 7 else 'stage2'


def _vocab_pair(vocab: list[str]) -> tuple[str, str]:
    cleaned = [_option(v, 40) or 'this skill' for v in (vocab or [])]
    while len(cleaned) < 2:
        cleaned.append('this skill')
    return cleaned[0], cleaned[1]


def _rebalance(mc_items: list[dict]) -> list[int]:
    positions = [q['correct_index'] for q in mc_items]
    for _ in range(24):
        counts = Counter(positions)
        if max(counts.values()) <= 3 and len(counts) >= 2:
            return positions
        rich = max(range(4), key=lambda i: counts.get(i, 0))
        poor = min(range(4), key=lambda i: counts.get(i, 0))
        donor = next(i for i, p in enumerate(positions) if p == rich)
        q = mc_items[donor]
        opts = q['options']
        correct = opts[q['correct_index']]
        for _rot in range(4):
            opts = opts[1:] + opts[:1]
            if opts.index(correct) == poor:
                q['options'] = opts
                q['correct_index'] = poor
                positions[donor] = poor
                break
        else:
            opts = [o for o in q['options'] if o != correct]
            while len(opts) < 3:
                opts.append(f'A different incorrect method ({len(opts)}).')
            new_opts = opts[:3]
            new_opts.insert(poor, correct)
            q['options'] = new_opts[:4]
            q['correct_index'] = poor
            positions[donor] = poor
    return positions


def _maths_items(seed_key: str, v0: str, rule: str, model: str, answer: str, pitfall: str,
                 prompt: str, task: str, band: str) -> list[dict]:
    nums = _nums(prompt) or _nums(model) or _nums(task) or ['24', '6']
    a, b = nums[0], nums[1] if len(nums) > 1 else '10'
    items = []
    items.append(shuffle_mc(
        f'Which working best supports a correct answer for this lesson on {v0}?',
        'Show each place, value or step and say why that step is valid.',
        [
            'Write only a final number with no working.',
            'Change digits to look neater without checking place value.',
            _option(pitfall) or 'Skip the operation that the question asked for.',
        ],
        'Mathematics answers need labelled working tied to place value, quantity or the asked operation.',
        seed_key, 'q4'))
    items.append(shuffle_mc(
        f'Using the method for {v0}, which statement is true?',
        _option(answer) or _option(model) or f'The method for {v0} must match the asked quantity.',
        [
            _option(pitfall) or f'Treat {v0} as optional decoration on the answer.',
            f'Read {a} from left to right as ones only, ignoring place value.',
            f'Ignore units and treat {a} and {b} as interchangeable.',
        ],
        f'The correct statement applies the taught {v0} method; the others break place value, units or the asked quantity.',
        seed_key, 'q5'))
    items.append(shuffle_mc(
        f'If two methods disagree on a {v0} problem with numbers such as {a} and {b}, what should you check first?',
        'Recheck places, operations and whether the question asked for the quantity you computed.',
        [
            'Pick the longer-looking working automatically.',
            'Delete units so the answers appear to match.',
            'Average the two answers without checking either.',
        ],
        'Disagreement is resolved by checking places, operations and the question focus, not by blending answers.',
        seed_key, 'q6'))
    fresh_prompt = (
        f'Solve a fresh {v0} problem that uses different numbers from the worked model and explain one key step.'
        if band == 'stage2' else
        f'Solve a multi-step {v0} problem with different values from the model, justify each step, and check reasonableness.'
    )
    items.append(shuffle_mc(
        fresh_prompt,
        f'Use the same {v0} method on new numbers and name the places or values that matter.',
        [
            f'Retype the worked model numbers {a} and {b} as the answer.',
            'Change only handwriting and keep the same numbers.',
            _option(pitfall) or 'Skip checking whether the answer fits the question.',
        ],
        'Transfer requires new numbers with the same mathematical method and a named reason.',
        seed_key, 'q7'))
    items.append(shuffle_mc(
        f'Which error is the lesson warning against for {v0}?',
        _option(pitfall) or f'Guessing a total for {v0} without checking places or operations.',
        [
            _option(rule) or f'Name the method for {v0} before computing.',
            _option(answer) or f'State the quantity asked for in the {v0} problem.',
            f'Label units when comparing {a} with {b}.',
        ],
        'Recognising the warned misconception protects accuracy on new problems.',
        seed_key, 'q8'))
    return items


def _science_items(seed_key: str, v0: str, rule: str, answer: str, pitfall: str, band: str) -> list[dict]:
    bag = _fresh_science_bag(seed_key)
    items = []
    items.append(shuffle_mc(
        f'New examples: {", ".join(bag)}. Which claim about {v0} is most trustworthy?',
        'Use observable features or measurements as evidence, not appearance alone.',
        [
            'Decide from which object looks most exciting.',
            'Copy a label from the lesson title with no observation.',
            _option(pitfall) or 'Treat every object as living without a testable feature.',
        ],
        'Trustworthy science claims rest on observable evidence linked to the claim.',
        seed_key, 'q4'))
    items.append(shuffle_mc(
        f'Which record best supports a science claim about {v0}?',
        'A named observation plus how it supports the claim.',
        [
            'A longer story with no observation.',
            'A label copied from the title with no evidence.',
            _option(pitfall) or 'A dramatic guess with no measurement.',
        ],
        'Science claims need named observations linked to the claim.',
        seed_key, 'q5'))
    items.append(shuffle_mc(
        f'Using this science idea — {_first_sentence(rule, 100)} — which choice is strongest?',
        _option(answer) or f'A claim about {v0} backed by a named observation.',
        [
            _option(pitfall) or f'A claim about {v0} with no observation.',
            'Change several conditions at once so something happens faster.',
            'Ignore measurements and decide by which looks nicer.',
        ],
        f'The strongest choice applies the taught idea about {v0} with evidence.',
        seed_key, 'q6'))
    fair = (
        'Change one variable and keep the other conditions the same.'
        if band == 'stage2' else
        'Identify the independent variable, control the rest, and record repeatable measurements.'
    )
    items.append(shuffle_mc(
        f'Which investigation design best tests an idea about {v0}?',
        fair,
        [
            'Change several conditions at once so something happens faster.',
            'Stop early when you like the first result.',
            'Ignore measurements and decide by which looks nicer.',
        ],
        'Fair tests change one variable, control the rest, and use recorded evidence.',
        seed_key, 'q7'))
    items.append(shuffle_mc(
        f'Which prediction about {v0} can be checked with evidence?',
        f'If the observed feature changes, the claim about {v0} should change with it.',
        [
            'Any exciting story about the object must be true.',
            _option(pitfall) or 'A title label is enough evidence for any claim.',
            'Results that disagree with the first guess should be discarded.',
        ],
        'Scientific predictions stay open to new observations rather than protecting a first guess.',
        seed_key, 'q8'))
    return items


def _english_items(seed_key: str, v0: str, v1: str, rule: str, answer: str, pitfall: str,
                   band: str) -> list[dict]:
    passage = _fresh_english_passage(seed_key)
    items = []
    items.append(shuffle_mc(
        f'Read: "{passage}" Which choice best uses {v0} from this lesson?',
        f'Point to exact words in the sentence that show {v0} and say what they do.',
        [
            'Ignore the sentence and invent a more exciting event.',
            'Say the writing is good without naming any words.',
            _option(pitfall) or f'Treat {v0} as optional decoration.',
        ],
        f'The skill is shown by quoting or pointing to wording that carries {v0}.',
        seed_key, 'q4'))
    items.append(shuffle_mc(
        f'Which statement correctly applies the lesson idea about {v0}?',
        _option(answer) if len(_option(answer) or '') > 24 else _option(rule),
        [
            _option(pitfall) or f'Guess {v0} from the title alone.',
            'Copy a model sentence from another story unchanged.',
            f'Name {v1} without linking it to any words in the text.',
        ],
        'The correct statement applies the language skill with textual evidence.',
        seed_key, 'q5'))
    first_move = (
        'Locate a specific word, phrase or structural clue before deciding.'
        if band == 'stage2' else
        'Locate precise textual evidence, then explain how language choices shape meaning or effect.'
    )
    items.append(shuffle_mc(
        f'In a new text, what should you do first to analyse {v1}?',
        first_move,
        [
            'Guess from the title alone with no textual clue.',
            'Copy a model sentence from another story unchanged.',
            'Lengthen the answer with adjectives while keeping the same idea.',
        ],
        'Start from a specific textual clue, then explain its effect.',
        seed_key, 'q6'))
    items.append(shuffle_mc(
        f'Which revision actually improves meaning for {v0}?',
        'Change the inaccurate idea or missing evidence, not only the length.',
        [
            'Add adjectives without fixing the wrong idea.',
            'Make the answer longer while keeping the same mistake.',
            'Delete the evidence that disagreed with your first guess.',
        ],
        'Repair means fixing meaning or evidence, not padding.',
        seed_key, 'q7'))
    items.append(shuffle_mc(
        f'Which response shows accurate use of {v0} on fresh material?',
        f'Use a fresh sentence or text and explain one precise choice about {v0}.',
        [
            'Retype the worked model as the final answer.',
            'Change fonts and claim the work is new.',
            _option(pitfall) or f'Ignore wording that carries {v0}.',
        ],
        'Accurate transfer needs fresh material with an explained language choice.',
        seed_key, 'q8'))
    return items


def build_skill_quiz(seed_key: str, subject: str, rule: str, model: str, prompt: str,
                     answer: str, pitfall: str, task: str, vocab: list[str],
                     distractors: list[str], stages=None) -> list[dict]:
    """Return 8 MC + 2 short-answer items that assess skill use on lesson content."""
    del stages  # reserved for future stage-aware item banks
    v0, v1 = _vocab_pair(vocab)
    band = _year_band(seed_key)
    rule_s = _first_sentence(rule, 160)
    answer_s = _option(answer) or _option(model) or f'Apply {v0} with clear evidence.'
    pitfall_s = _option(pitfall) or f'Guess about {v0} without using the taught method.'
    # Convert caller distractors into short non-filler pads when usable.
    pad = [_option(d) for d in (distractors or []) if _option(d) and not FILLER_OPTION.search(d or '')]
    pad = [p for p in pad if p]
    items: list[dict] = []

    # Item 1: direct application of the guided prompt (content-bearing).
    stem1 = _clean(prompt) or f'Which response correctly applies {v0}?'
    if not stem1.endswith('?'):
        stem1 = stem1 + ' Which response is most accurate?'
    items.append(shuffle_mc(
        stem1, answer_s, [pitfall_s, *pad[:2]],
        f'This matches the taught method for {v0}.',
        seed_key, 'q1', pad=pad[2:] + [f'A response that never uses {v0}.', f'A response that confuses {v0} with {v1}.']))

    # Item 2: identify the misconception (content, not study meta).
    items.append(shuffle_mc(
        f'Which statement is a common mistake when working with {v0}?',
        pitfall_s,
        [rule_s or f'Use {v0} with clear evidence.', answer_s, f'Careful use of {v1} with clear evidence.'],
        f'This is the misconception to avoid for {v0}; the other choices align with the lesson method.',
        seed_key, 'q2', pad=pad))

    # Item 3: choose the better reasoned application with CONTENT, not "shows understanding".
    items.append(shuffle_mc(
        f'Which response best applies {v0} with new evidence?',
        f'Apply {v0} to new material and name the {v1} used.',
        [
            'Repeat the worked example wording with no new evidence.',
            pitfall_s,
            f'Name {v1} only, without linking it to {v0}.',
        ],
        f'Understanding is shown by new evidence and a named {v1}, not by copying the model.',
        seed_key, 'q3', pad=pad))

    subject = (subject or 'english').lower()
    if subject == 'mathematics':
        items.extend(_maths_items(seed_key, v0, rule, model, answer, pitfall, prompt, task, band))
    elif subject == 'science':
        items.extend(_science_items(seed_key, v0, rule, answer, pitfall, band))
    elif subject in ('hsie', 'pdhpe', 'arts', 'technology'):
        # Inline humanities/tech items with stems that avoid banned study-meta phrasing.
        if subject == 'hsie':
            focus = 'sources, places or historical/geographic evidence'
            correct_habit = f'Name a specific source or place detail and say what it shows about {v0}.'
            wrongs = [
                'Make a bigger claim without naming any source or place detail.',
                'Copy a classmate’s sentence with no local detail.',
                pitfall_s,
            ]
            respect = 'Check facts, acknowledge limits of the evidence, and avoid inventing details.'
        elif subject == 'pdhpe':
            focus = 'safe, healthy or respectful choices'
            correct_habit = f'Name a body cue, safety rule or wellbeing strategy and say how it helps with {v0}.'
            wrongs = [
                'Choose the fastest option even when it ignores safety.',
                'Use a put-down and call it honesty.',
                pitfall_s,
            ]
            respect = 'Check safety and fairness, include others, and explain the healthier choice.'
        elif subject == 'technology':
            focus = 'design criteria, safe making steps or test evidence'
            correct_habit = f'Name a criterion, safety step or test result and say how it improves {v0}.'
            wrongs = [
                'Start making with no criteria or safety check.',
                'Call the first attempt finished without testing.',
                pitfall_s,
            ]
            respect = 'Check criteria and safety, record a test result, and note one honest improvement.'
        else:
            focus = 'elements, techniques and audience effect'
            correct_habit = f'Name a specific element or technique and say what effect it creates for {v0}.'
            wrongs = [
                'Say it looks nice with no element or technique named.',
                'Copy another artwork’s sacred design without permission or guidance.',
                pitfall_s,
            ]
            respect = 'Name the artistic choice, its effect, and keep cultural protocols respectful.'
        stem4 = (
            f'Which response best uses {focus} for {v0}?'
            if band == 'stage2' else
            f'Which response best evaluates {focus} when analysing {v0}?'
        )
        items.append(shuffle_mc(
            stem4, answer_s, wrongs,
            f'The stronger choice uses {focus} appropriately for this lesson on {v0}.',
            seed_key, 'q4', pad=pad))
        items.append(shuffle_mc(
            f'Which evidence move best supports a claim about {v0}?',
            correct_habit, wrongs,
            'Strong answers name specific evidence and what it shows.',
            seed_key, 'q5', pad=pad))
        items.append(shuffle_mc(
            f'Using this lesson idea — {_first_sentence(rule, 100)} — which choice is best?',
            _option(model) or answer_s, [pitfall_s, wrongs[0], wrongs[1]],
            'The stronger choice matches the taught idea with concrete detail.',
            seed_key, 'q6', pad=pad))
        items.append(shuffle_mc(
            f'Which action keeps {focus} accurate for {v0}?',
            respect,
            [
                'Invent missing details to make the answer sound complete.',
                'Ignore safety or cultural protocols to finish faster.',
                'Treat every claim as equally reliable without checking a source or cue.',
            ],
            'Accuracy means checking evidence and honouring limits or protocols.',
            seed_key, 'q7', pad=pad))
        items.append(shuffle_mc(
            f'Which independent response best applies {v0} to new material?',
            _option(task) or f'Create a new example of {v0} and explain one precise choice.',
            [
                'Retype the worked example with no new example.',
                pitfall_s,
                f'Name {v1} only, with no linked example.',
            ],
            'Independence requires a new example that still uses the taught skill.',
            seed_key, 'q8', pad=pad))
    else:
        items.extend(_english_items(seed_key, v0, v1, rule, answer, pitfall, band))

    # Short answers: require production + reasoning on NEW material
    if subject == 'mathematics':
        sa1 = (f'Solve one fresh problem that uses {v0} with different numbers from the worked model. '
               f'Show working and name the places or values that matter.')
        sa2 = (f'Describe one likely mistake with {v0}, show corrected working, and say why the correction works.')
        sa1_guide = (f'Accept any mathematically valid solution that uses new numbers, shows working for {v0}, '
                     f'and names places/values. Reject copied model numbers.')
        sa2_guide = (f'Accept a named misconception about {v0}, corrected working, and a method reason. '
                     f'Reject vague “I was wrong” with no repair.')
        sample1 = (f'Sample: new numbers solved with visible working for {v0}; key places/values named. '
                   f'Do not award marks for retyping the model.')
        sample2 = (f'Sample misconception: {_first_sentence(pitfall, 120)}. '
                   f'Correction uses {_first_sentence(answer, 120)}. Why: restores accurate {v0}.')
    elif subject == 'science':
        sa1 = (f'Investigate or describe a fresh example (not the worked objects) that uses {v0}. '
               f'Record evidence and explain how it supports your claim.')
        sa2 = (f'Name one science misconception about {v0}, correct it with evidence, and say why the correction works.')
        sa1_guide = (f'Accept a new example with named observations and a claim–evidence link about {v0}. '
                     f'Reject title-only labels with no observation.')
        sa2_guide = (f'Accept a misconception plus corrected claim and evidence reason for {v0}. '
                     f'Reject wording changes that leave the same error.')
        sample1 = f'Sample: new object/context, two named observations, claim about {v0} linked to that evidence.'
        sample2 = (f'Sample misconception: {_first_sentence(pitfall, 120)}. '
                   f'Correction: {_first_sentence(answer, 120)} with evidence.')
    else:
        sa1 = (f'Produce a fresh example demonstrating {v0} on new material (not the worked model). '
               f'Explain the particular words, sources or choices that make it work.')
        sa2 = (f'Name one likely error with {v0}, correct it, and explain why the correction helps a reader or audience.')
        sa1_guide = (f'Accept original work about {v0} with a specific supporting detail. '
                     f'Reject copied model wording with no new material.')
        sa2_guide = (f'Accept a misconception, a correction, and a purpose-linked reason for {v0}. '
                     f'Reject corrections that do not change the inaccurate idea.')
        sample1 = (f'Sample: original example using {v0} on new material; names a specific word, source or choice '
                   f'and explains its effect.')
        sample2 = (f'Sample error: {_first_sentence(pitfall, 120)}. '
                   f'Correction: {_first_sentence(answer, 120)}. Why it helps the audience is stated.')

    items += [
        dict(type='short_answer', question=sa1, sample_answer=sample1,
             marking_guide=sa1_guide,
             explanation='Independent evidence on new material demonstrates the skill; copying the model does not.'),
        dict(type='short_answer', question=sa2, sample_answer=sample2,
             marking_guide=sa2_guide,
             explanation='A useful correction changes the inaccurate idea or method and explains why.'),
    ]

    mc = [q for q in items if q['type'] == 'multiple_choice']
    assert len(mc) == 8 and len(items) == 10
    positions = _rebalance(mc)
    if max(Counter(positions).values()) > 3:
        raise ValueError(f'Could not balance correct_index distribution for {seed_key}: {positions}')
    questions = [q['question'] for q in mc]
    if len(set(questions)) != 8:
        raise ValueError(f'Duplicate quiz stems for {seed_key}')
    for q in mc:
        if BANNED_STEM.search(q['question']):
            raise ValueError(f'Banned stem survived for {seed_key}: {q["question"]}')
        if any(ELLIPSIS.search(o) for o in q['options']):
            raise ValueError(f'Truncated option survived for {seed_key}')
        if any(FILLER_OPTION.search(o) for o in q['options']):
            raise ValueError(f'Filler option survived for {seed_key}')
        # Explanation must not be a near-copy of the correct option alone.
        corr = q['options'][q['correct_index']].casefold()
        expl = (q.get('explanation') or '').casefold()
        if corr and len(corr) > 24 and expl.startswith(corr) and len(expl) < len(corr) + 40:
            raise ValueError(f'Circular explanation for {seed_key}: {q["question"]}')
    return items


def shuffle_teach_check(question: str, correct: str, wrong_opts: list[str], explanation: str,
                        seed_key: str, stage_index: int) -> dict:
    """Teaching-stage check: skill-focused stem + shuffled correct index."""
    stem = _clean(question)
    if BANNED_STEM.search(stem):
        stem = 'Which choice best applies this lesson idea with clear evidence?'
    return shuffle_mc(
        stem, correct, wrong_opts, explanation, seed_key, f'teach-check-{stage_index}',
        pad=['A guess with no link to the lesson idea.', 'A label that skips the taught evidence.'])
