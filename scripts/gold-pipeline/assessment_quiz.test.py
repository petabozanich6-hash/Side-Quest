#!/usr/bin/env python3
"""Regression tests for assessment quality builder."""
from collections import Counter
from assessment_quiz import BANNED_STEM, ELLIPSIS, FILLER_OPTION, build_skill_quiz


def _build(subject, seed=None):
    return build_skill_quiz(
        seed or f's2-test-{subject}-y3-w01-l1',
        subject,
        'Learners practise the central idea with evidence tied to the lesson focus.',
        'Worked model shows a clear correct application with named evidence.',
        'Apply the skill to this new prompt with values 24 and 6: what is the best response?',
        'The accurate response names evidence and uses the method for 24 and 6.',
        'A common mistake is guessing without evidence or skipping the key step.',
        'Independent task using different inputs from the model, such as 35 and 5.',
        ['skill focus', 'evidence', 'transfer', 'accuracy'],
        [
            'A claim that names no evidence from the lesson material.',
            'A method that skips the key step taught in this lesson.',
            'A label that sounds complete but does not match the asked quantity.',
            'An answer that mixes two different ideas from the lesson.',
        ],
    )


def test_subject(subject, seed=None):
    quiz = _build(subject, seed=seed)
    mc = [q for q in quiz if q['type'] == 'multiple_choice']
    sa = [q for q in quiz if q['type'] == 'short_answer']
    assert len(mc) == 8 and len(quiz) == 10
    assert all(not BANNED_STEM.search(q['question']) for q in mc)
    counts = Counter(q['correct_index'] for q in mc)
    assert max(counts.values()) <= 3, counts
    assert len(counts) >= 2
    assert len({q['question'] for q in mc}) == 8
    for q in mc:
        assert len(set(o.casefold() for o in q['options'])) == 4
        assert not any(FILLER_OPTION.search(o) for o in q['options'])
        assert not any(ELLIPSIS.search(o) for o in q['options'])
        assert len(q['explanation']) >= 50
        corr = q['options'][q['correct_index']].casefold()
        expl = q['explanation'].casefold()
        assert not (corr and len(corr) > 24 and expl.startswith(corr) and len(expl) < len(corr) + 40)
    for q in sa:
        assert q.get('sample_answer') and q.get('marking_guide')
        assert not q['marking_guide'].startswith('Require new')
        assert not q['marking_guide'].startswith('Require a real')
        assert not q['marking_guide'].startswith('Require independently')
    # Must test lesson content words, not only study behaviour.
    blob = ' '.join(q['question'] for q in mc).casefold()
    assert 'skill focus' in blob or '24' in blob or 'evidence' in blob


def test_stage4_more_demanding():
    quiz = _build('mathematics', seed='s4-mat-y7-w01-l1')
    mc = [q for q in quiz if q['type'] == 'multiple_choice']
    assert any('multi-step' in q['question'].casefold() or 'reasonableness' in q['question'].casefold()
               for q in mc)


def test_banned_stem_rejected():
    try:
        from assessment_quiz import shuffle_mc
        shuffle_mc(
            'A learner is practising fractions. Which approach best shows understanding?',
            'Use equal parts.',
            ['Guess', 'Skip working', 'Invent digits'],
            'Equal parts matter because they keep the fraction value fair.',
            's2-mat-y3-w01-l1', 'x')
        raise AssertionError('expected banned stem to raise')
    except ValueError as exc:
        assert 'Banned' in str(exc)


if __name__ == '__main__':
    for subject in ('english', 'mathematics', 'science', 'hsie', 'pdhpe', 'arts'):
        test_subject(subject)
        print('ok', subject)
    test_stage4_more_demanding()
    print('ok stage4')
    test_banned_stem_rejected()
    print('ok banned-stem')
    print('assessment_quiz tests passed')
