#!/usr/bin/env python3
"""Regression tests for assessment quality builder."""
from collections import Counter
from assessment_quiz import build_skill_quiz, BANNED_STEM


def test_subject(subject):
    quiz = build_skill_quiz(
        f's2-test-{subject}', subject,
        'Learners practise the central idea with evidence.',
        'Worked model shows a clear correct application.',
        'Apply the skill to this new prompt: what is the best response?',
        'The accurate response names evidence and uses the method.',
        'A common mistake is guessing without evidence.',
        'Independent task using different inputs from the model.',
        ['skill focus', 'evidence', 'transfer', 'accuracy'],
        ['Ignore the task.', 'Copy the model.', 'Skip reasoning.', 'Invent details.'],
    )
    mc = [q for q in quiz if q['type'] == 'multiple_choice']
    assert len(mc) == 8 and len(quiz) == 10
    assert all(not BANNED_STEM.search(q['question']) for q in mc)
    counts = Counter(q['correct_index'] for q in mc)
    assert max(counts.values()) <= 3, counts
    assert len(counts) >= 2
    assert len({q['question'] for q in mc}) == 8
    for q in mc:
        assert len(set(q['options'])) == 4
        assert not any('any answer is equally supported' in o.lower() for o in q['options'])


if __name__ == '__main__':
    for subject in ('english', 'mathematics', 'science', 'hsie', 'pdhpe'):
        test_subject(subject)
        print('ok', subject)
    print('assessment_quiz tests passed')
