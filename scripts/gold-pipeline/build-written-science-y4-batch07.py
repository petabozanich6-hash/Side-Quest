#!/usr/bin/env python3
"""Year 4 Science Written Core batch 07: w37-l1 through w40-l2 (8). STEM project close."""
from science_y4_support import L, pair_visual, write_batch

DDT, PQU = 'ST2-DDT-02', 'ST2-PQU-01'

LESSONS = [
L('s2-sci-y4-w37-l1', DDT, ['brainstorm', 'sketch', 'idea', 'select'],
  'Brainstorming and sketching generates many possible solutions, then selects a promising idea using criteria and constraints.',
  'Crazy-8 sketches: eight quick ideas in eight minutes. Score against criteria (stable, cheap, safe). Circle the top idea to prototype.',
  'Why sketch more than one idea before building?',
  'Compare options against criteria; avoid locking into the first thought.',
  'Falling in love with the first sketch without scoring criteria wastes better fits.',
  'Produce eight quick sketches for your problem. Score three against criteria. Explain why the winner advances.'),
L('s2-sci-y4-w37-l2', DDT, ['prototype', 'build', 'material', 'rough'],
  'A prototype is a rough working model built to test ideas quickly, not a perfect final product on the first try.',
  'Cardboard and tape beat waiting for ideal parts. Label what each part is meant to do. Expect messiness; aim for testable function.',
  'List three prototype rules that keep builds safe and quick.',
  'e.g. reused materials; no sharp tools without adult; label parts; stop when testable — any three.',
  'Decorating before the mechanism works delays learning from tests.',
  'Build a first prototype meeting safety rules. Photo/draw it with part labels and one known weakness.'),
L('s2-sci-y4-w38-l1', PQU, ['test', 'data', 'trial', 'record'],
  'Testing collects data against success criteria across multiple trials so results are not a one-off fluke.',
  'Trial table: trial #, measure, pass/fail notes. Three trials minimum. Same method each time unless you log a change.',
  'Why run more than one trial before claiming success?',
  'One lucky trial can mislead; repeats show reliability.',
  'Changing the method silently between trials corrupts the data set.',
  'Run at least three formal trials. Complete a data table linked to criteria. Highlight passes/fails.'),
L('s2-sci-y4-w38-l2', DDT, ['improve', 'iterate', 'evidence', 'version'],
  'Improving the design uses test evidence to change one feature, rebuild a version and retest — iteration with notes.',
  'Fail: bag still tips. Evidence: tip angle. Change: wider base only. Retest. Version log: v1, v2 with dates.',
  'Write an improvement note: evidence → change → expected effect.',
  'Any note tying measured fail to a single change and predicted better result.',
  'Random restyling without evidence is not iteration.',
  'Complete two evidenced iterations after baseline tests. Version log + final criteria check.'),
L('s2-sci-y4-w39-l1', DDT, ['presentation', 'rehearse', 'visual', 'script'],
  'Preparing a presentation organises the story: problem, research, design, tests, improvements and next steps with clear visuals.',
  'Slide/card order matches the design cycle. Script 2–3 minutes. Rehearse once with a timer. Visuals show diagram + data, not only photos of smiling builders.',
  'List the six section headings you will present in order.',
  'Problem; research/plan; design; test data; improve; next steps (wording may vary).',
  'Only showing the final toy without the problem leaves the audience lost.',
  'Build presentation cards/slides and rehearse once. Peer times you and checks all sections appear.'),
L('s2-sci-y4-w39-l2', DDT, ['present', 'audience', 'question', 'reflect'],
  'Presenting the STEM project means speaking clearly to the audience, demoing safely and answering questions with evidence.',
  'Face listeners; demo behind a safety line; answer “How do you know?” with trial data. Thank the audience.',
  'Practice answering: “What would you change with more time?” using your version log.',
  'Name a specific next iteration tied to a measured weakness.',
  'Guessing answers not in your data weakens trust.',
  'Deliver the presentation. Collect two audience questions and write evidence-based answers afterward.'),
L('s2-sci-y4-w40-l1', PQU, ['reflect', 'skill', 'strand', 'growth'],
  'Stage 2 science and technology reflection names skills grown across living systems, Earth, physical sciences, materials, design and digital work.',
  'Sentence frames: I can now…; I used to think… now I know…; Evidence from… Keep claims tied to real tasks this year.',
  'Write one growth statement for science inquiry and one for design/digital, each with evidence.',
  'Any two honest evidenced statements.',
  'Vague “I got better at science” without examples is weak reflection.',
  'Complete a reflection matrix across six topic areas with a strength and a next step for each.'),
L('s2-sci-y4-w40-l2', PQU, ['celebrate', 'share', 'goal', 'thanks'],
  'Celebration recognises strategies, teamwork and curiosity — not only polished products — and sets a forward goal.',
  'Share one strategy that helped (fair test, debug diary, labelled diagram). Thank a partner. Set one holiday/next-term practice goal.',
  'Name one strategy worth celebrating and one specific next goal.',
  'Any strategy + actionable goal pair.',
  'Only ranking who “won” STEM ignores learning processes.',
  'Write a celebration card: strategy, evidence, thanks, next goal. Share orally in a circle if possible.'),
]

VISUALS = {
 's2-sci-y4-w37-l1': [pair_visual('Many sketches', 'then score', 'Criteria', 'pick winner', 'Brainstorm and select.', 'Not first-idea lock-in.'),
  pair_visual('Crazy-8', 'score three', 'Risk', 'love first sketch', 'Winner advances.', 'Eight sketches.')],
 's2-sci-y4-w37-l2': [pair_visual('Rough model', 'testable soon', 'Label parts', 'known weakness', 'Prototyping.', 'Function before decoration.'),
  pair_visual('Safe build', 'photo + labels', 'Risk', 'decorate first', 'Weakness noted.', 'v1 prototype.')],
 's2-sci-y4-w38-l1': [pair_visual('Trials', 'same method', 'Data', 'vs criteria', 'Testing with data.', 'Repeats beat one-offs.'),
  pair_visual('Three+ trials', 'pass/fail', 'Risk', 'silent method change', 'Linked table.', 'Highlighted results.')],
 's2-sci-y4-w38-l2': [pair_visual('Evidence', 'one change', 'Retest', 'version log', 'Iterative improve.', 'Evidence before restyle.'),
  pair_visual('Two iterations', 'final check', 'Risk', 'random restyle', 'v-log complete.', 'Criteria met notes.')],
 's2-sci-y4-w39-l1': [pair_visual('Story order', 'problem→improve', 'Visuals', 'diagram + data', 'Presentation prep.', 'Rehearse with timer.'),
  pair_visual('Six sections', 'peer timed', 'Risk', 'final toy only', 'All sections present.', 'Cards/slides ready.')],
 's2-sci-y4-w39-l2': [pair_visual('Clear talk', 'safe demo', 'Answer', 'with data', 'Presenting STEM.', 'Evidence for questions.'),
  pair_visual('Deliver', 'two Q written', 'Risk', 'guess without data', 'Post-answers.', 'Live presentation.')],
 's2-sci-y4-w40-l1': [pair_visual('Growth', 'with evidence', 'Across strands', 'living→digital', 'Year reflection.', 'Examples required.'),
  pair_visual('Matrix', 'strength + next', 'Risk', 'vague better at science', 'Six areas filled.', 'Inquiry + design notes.')],
 's2-sci-y4-w40-l2': [pair_visual('Celebrate', 'strategy', 'Next goal', 'actionable', 'Celebration close.', 'Process over trophies.'),
  pair_visual('Card', 'thanks + goal', 'Risk', 'only who won', 'Shared orally.', 'Celebration card.')],
}


def create():
    write_batch(LESSONS, VISUALS, expected_count=8)


if __name__ == '__main__':
    create()
