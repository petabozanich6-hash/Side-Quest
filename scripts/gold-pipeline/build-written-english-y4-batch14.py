#!/usr/bin/env python3
"""Year 4 English Written Core batch 14: w40-l1 through w40-l4 (4 lessons) — finish Y4 English."""
from english_y4_support import L, pair_visual, write_batch

LESSONS = [
L('s2-eng-y4-w40-l1', 'EN2-RECOM-01', ['reflection', 'reading', 'strategy', 'growth'],
  'Stage 2 reading reflection means naming strategies that helped (predict, evidence, compare) with examples from texts you actually read this year.',
  'Strategy: checking event vs telling order helped in flashback stories. Example: the envelope kitchen paragraph. Next goal: compare themes across two novels.',
  'Name one reading strategy and one text example you could cite in a reflection.',
  'Strategy + specific text moment; avoid vague "I read better."',
  'A reflection with no examples is only a slogan.',
  'Write a 120–150 word reading reflection with two strategies, two text examples and one next goal.'),
L('s2-eng-y4-w40-l2', 'EN2-CWT-02', ['portfolio', 'select', 'reflect', 'growth'],
  'Portfolio selection means choosing pieces that show growth, explaining what improved and setting a writing goal for next year.',
  'I select my discussion text because both sides improved and my research report because sources are listed. Goal: stronger conclusions.',
  'Justify two portfolio choices in two sentences each: what improved?',
  'Name the skill growth, not only neat handwriting.',
  'Choosing only the longest piece without growth talk is weak selection.',
  'Select three portfolio pieces, write a growth comment for each and one Year 5 writing goal. Keep the pieces as evidence.'),
L('s2-eng-y4-w40-l3', 'EN2-SPELL-01', ['spelling', 'language', 'checklist', 'accuracy'],
  'A Stage 2 language and spelling check consolidates high-frequency words, tense, punctuation and modality habits from the year.',
  'Checklist pass on a mixed paragraph: capitals; there/their; past tense; might not will; speech marks. Fix six errors honestly.',
  'Fix: "Yesterday we seen there friends and we will prove everyone forever"',
  'saw; their; soften will/forever; check sense.',
  'Skipping the checklist because the page looks neat leaves hidden errors.',
  'Complete an eighteen-item Stage 2 language/spelling check. Apply eight fixes to a portfolio piece and list your top three recurring errors.'),
L('s2-eng-y4-w40-l4', 'EN2-OLC-01', ['reflection', 'celebrate', 'speak', 'gratitude'],
  'Reflection and celebration means speaking briefly about learning highlights, thanking helpers and listening respectfully to classmates’ reflections.',
  'I share one reading win, one writing win and thank a peer who gave useful feedback. I listen without interrupting others’ turns.',
  'Plan a 45-second celebration talk: two wins + one thanks.',
  'Specific wins and a named thanks; keep kind.',
  'Boasting by putting others down is not celebration.',
  'Deliver a 45–60 second reflection/celebration talk. Note one classmate win you appreciated while listening.'),
]

VISUALS = {
 's2-eng-y4-w40-l1': [pair_visual('Strategy', 'event vs telling order', 'Example', 'envelope flashback', 'Reading reflection with strategy evidence.', 'Goals need examples.'),
  pair_visual('Next goal', 'compare themes', 'Weak', 'I read better', 'Specific goal contrasted with vague slogan.', 'Cite real texts.')],
 's2-eng-y4-w40-l2': [pair_visual('Select', 'discussion + research', 'Growth', 'both sides; sources listed', 'Portfolio selection with growth comments.', 'Name the skill that improved.'),
  pair_visual('Year 5 goal', 'stronger conclusions', 'Weak pick', 'longest only', 'Goal-setting contrasted with length-only picks.', 'Keep the pieces.')],
 's2-eng-y4-w40-l3': [pair_visual('Checklist', 'caps; tense; modality; speech', 'Fix', 'seen → saw; there/their', 'Stage 2 language and spelling check.', 'Fix hidden errors honestly.'),
  pair_visual('Track', 'top three recurring errors', 'Apply', 'eight fixes in portfolio', 'Error tracking on a real piece.', 'Do not skip because it looks neat.')],
 's2-eng-y4-w40-l4': [pair_visual('Share', 'reading win + writing win', 'Thanks', 'named peer feedback', 'Celebration talk structure.', 'Listen to others’ turns.'),
  pair_visual('Kind', 'appreciate a classmate win', 'Not celebration', 'put others down', 'Grateful reflection vs put-downs.', 'Keep the talk 45–60 seconds.')],
}


def create():
    write_batch(LESSONS, VISUALS, expected_count=4)


if __name__ == '__main__':
    create()
