#!/usr/bin/env python3
"""Year 4 Mathematics Written Core batch 14: w40-l1 through w40-l4 (4). Year close."""
from maths_y4_support import L, pair_visual, write_batch

RN = 'MA2-RN-01'  # integrated review; catalogue codes already on seeds when present

LESSONS = [
L('s2-mat-y4-w40-l1', RN, ['investigate', 'plan', 'question', 'method'],
  'A Year 4 maths investigation begins with a clear question, chosen measures or numbers, a method and a plan to record results.',
  'Example questions: How does perimeter change if area stays 24? Which class travel mode is most common? Plan: tools, table, graph or calculations, check.',
  'Write an investigation question and a four-step method (data/numbers → record → calculate/display → conclude).',
  'Any coherent Year 4 maths question with four workable steps.',
  'Starting without a question produces random calculations that do not answer anything.',
  'Finalise one investigation plan with question, materials, recording sheet and success criteria. Get a peer or parent check on clarity.'),
L('s2-mat-y4-w40-l2', RN, ['carry out', 'record', 'present', 'conclude'],
  'Carrying out the investigation means following the plan, recording accurately, presenting results and stating a conclusion tied to evidence.',
  'Record in a table; calculate or graph; present with a title and units; conclude only what the results show. Note any surprises or limits.',
  'List three must-haves in a presentation of results and one sentence stem for a fair conclusion.',
  'Examples: clear title, labelled units/scale, organised table/graph; “The data show that… because…”.',
  'Changing the method mid-way without noting it makes results hard to trust.',
  'Complete your investigation: records, display and a short presentation script (oral or written) with a fair conclusion and one limitation.'),
L('s2-mat-y4-w40-l3', RN, ['skills check', 'mixed', 'strategy', 'accuracy'],
  'A Stage 2 skills check samples number, measurement, space and data/chance skills with strategy and accuracy equally valued.',
  'Mixed set idea: place value; ×/÷; fraction/decimal; perimeter/area; timetable; angle type; graph read. Show working and units.',
  'Name four different maths strands/skills you expect on a Stage 2 check and one check habit for each.',
  'Any four distinct skills (e.g. operations, fractions, measurement, data) with habits like estimate, label units, read keys, inverse check.',
  'Rushing for answers without working hides which skill needs practice.',
  'Complete a thirty-item mixed Stage 2 skills check. Tally errors by strand and write a short practice plan.'),
L('s2-mat-y4-w40-l4', RN, ['reflect', 'goal', 'growth', 'celebrate'],
  'Reflection names strengths, sticky points and next goals so learning continues; celebration recognises strategies, not only scores.',
  'Sentence frames: I got better at…; I still mix up…; Next I will practise… with… Evidence from the skills check or investigation.',
  'Write one strength, one sticky point and one specific next goal with a practice action.',
  'Any honest triad linked to Year 4 maths evidence.',
  'Only saying “I’m bad at maths” without a next action blocks improvement.',
  'Write a one-page Year 4 maths reflection (strengths, evidence, goals) and share one celebrated strategy with a partner or family member.'),
]

VISUALS = {
 's2-mat-y4-w40-l1': [pair_visual('Question first', 'then method', 'Record plan', 'check criteria', 'Investigation planning.', 'No question → random work.'),
  pair_visual('Four steps', 'data→record→show→conclude', 'Risk', 'start calculating first', 'Planned inquiry vs random calc.', 'One full plan.')],
 's2-mat-y4-w40-l2': [pair_visual('Follow plan', 'accurate records', 'Present', 'fair conclusion', 'Carry out and present.', 'Note method changes.'),
  pair_visual('Title + units', 'evidence sentence', 'Risk', 'mid-way silent change', 'Trusted results vs silent edits.', 'Full presentation.')],
 's2-mat-y4-w40-l3': [pair_visual('Mixed strands', 'number→measure→space→data', 'Habit', 'working + units', 'Stage 2 skills check.', 'Tally to guide practice.'),
  pair_visual('Thirty items', 'practice plan', 'Risk', 'rush no working', 'Shown working vs hidden gaps.', 'Skills check + plan.')],
 's2-mat-y4-w40-l4': [pair_visual('Strength', 'sticky point', 'Next goal', 'practice action', 'Reflection and celebration.', 'Goals beat labels.'),
  pair_visual('Evidence', 'from check/invest', 'Risk', 'I’m bad at maths only', 'Actionable reflect vs dead end.', 'One-page reflection.')],
}


def create():
    write_batch(LESSONS, VISUALS, expected_count=4)


if __name__ == '__main__':
    create()
