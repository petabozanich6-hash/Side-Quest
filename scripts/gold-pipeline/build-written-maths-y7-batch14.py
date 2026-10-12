#!/usr/bin/env python3
"""Year 7 Mathematics Written Core batch 14: w40 (4). Catalogue MA4-* codes only."""
from maths_y7_support import L, pair_visual, write_batch

LESSONS = [
L('s4-mat-y7-w40-l1', 'MA4-ARI-C-01', ['year 7 review', 'strategy', 'check', 'reasonableness'],
  'Year 7 students develop year 7 review with explicit methods, worked numerical examples and reasonableness checks. Represent the situation, choose an appropriate procedure, calculate carefully and verify with an inverse, estimate or diagram. Catalogue alignment uses MA4-ARI-C-01; detailed content-point mapping remains pending.',
  'Example for Year 7 review: evaluate (−3)+7=4 and check by 4+(−7) returning −3, or use a number-line jump. Communicate each step.',
  'Compute two related integer/index items connected to year 7 review and show a check for each.',
  'Strong answer: correct values with a verification step; weak answers omit checks or mishandle signs/brackets.',
  'Skipping verification or misreading notation (especially negatives and indices).',
  'Independently complete a substantial practice set on year 7 review: at least eight varied items (including one multi-step or contextual item), show methods, check three answers, and write a five-sentence reflection naming one strategy and one error to watch.'),
L('s4-mat-y7-w40-l2', 'MA4-ARI-C-01', ['portfolio reflection', 'strategy', 'check', 'reasonableness'],
  'Year 7 students develop portfolio reflection with explicit methods, worked numerical examples and reasonableness checks. Represent the situation, choose an appropriate procedure, calculate carefully and verify with an inverse, estimate or diagram. Catalogue alignment uses MA4-ARI-C-01; detailed content-point mapping remains pending.',
  'Example for Portfolio reflection: evaluate (−3)+7=4 and check by 4+(−7) returning −3, or use a number-line jump. Communicate each step.',
  'Compute two related integer/index items connected to portfolio reflection and show a check for each.',
  'Strong answer: correct values with a verification step; weak answers omit checks or mishandle signs/brackets.',
  'Skipping verification or misreading notation (especially negatives and indices).',
  'Independently complete a substantial practice set on portfolio reflection: at least eight varied items (including one multi-step or contextual item), show methods, check three answers, and write a five-sentence reflection naming one strategy and one error to watch.'),
L('s4-mat-y7-w40-l3', 'MA4-RAT-C-01', ['year 7 assessment preparation', 'strategy', 'check', 'reasonableness'],
  'Year 7 students develop year 7 assessment preparation with explicit methods, worked numerical examples and reasonableness checks. Represent the situation, choose an appropriate procedure, calculate carefully and verify with an inverse, estimate or diagram. Catalogue alignment uses MA4-RAT-C-01; detailed content-point mapping remains pending.',
  'Example for Year 7 assessment preparation: ratio 2:3 for 10 parts → 4 and 6; or rate $15 per hour for 3 h = $45; or a distance-time segment with constant speed.',
  'Solve two ratio/rate/financial/graph items tied to year 7 assessment preparation with units labelled.',
  'Strong answer: units consistent; equivalent ratios or rates calculated correctly.',
  'Comparing rates with mismatched units or graphing without scale.',
  'Independently complete a substantial practice set on year 7 assessment preparation: at least eight varied items (including one multi-step or contextual item), show methods, check three answers, and write a five-sentence reflection naming one strategy and one error to watch.'),
L('s4-mat-y7-w40-l4', 'MA4-RAT-C-01', ['reflection and celebration', 'strategy', 'check', 'reasonableness'],
  'Year 7 students develop reflection and celebration with explicit methods, worked numerical examples and reasonableness checks. Represent the situation, choose an appropriate procedure, calculate carefully and verify with an inverse, estimate or diagram. Catalogue alignment uses MA4-RAT-C-01; detailed content-point mapping remains pending.',
  'Example for Reflection and celebration: ratio 2:3 for 10 parts → 4 and 6; or rate $15 per hour for 3 h = $45; or a distance-time segment with constant speed.',
  'Solve two ratio/rate/financial/graph items tied to reflection and celebration with units labelled.',
  'Strong answer: units consistent; equivalent ratios or rates calculated correctly.',
  'Comparing rates with mismatched units or graphing without scale.',
  'Independently complete a substantial practice set on reflection and celebration: at least eight varied items (including one multi-step or contextual item), show methods, check three answers, and write a five-sentence reflection naming one strategy and one error to watch.'),
]

VISUALS = {
 's4-mat-y7-w40-l1': [pair_visual('Represent','diagram/expression','Calculate','careful steps','Year 7 review.','Then check.'),
  pair_visual('Check','inverse/estimate','Explain','why reasonable','Reasonableness.','Units matter.')],
 's4-mat-y7-w40-l2': [pair_visual('Represent','diagram/expression','Calculate','careful steps','Portfolio reflection.','Then check.'),
  pair_visual('Check','inverse/estimate','Explain','why reasonable','Reasonableness.','Units matter.')],
 's4-mat-y7-w40-l3': [pair_visual('Represent','diagram/expression','Calculate','careful steps','Year 7 assessment preparation.','Then check.'),
  pair_visual('Check','inverse/estimate','Explain','why reasonable','Reasonableness.','Units matter.')],
 's4-mat-y7-w40-l4': [pair_visual('Represent','diagram/expression','Calculate','careful steps','Reflection and celebration.','Then check.'),
  pair_visual('Check','inverse/estimate','Explain','why reasonable','Reasonableness.','Units matter.')],
}

def create():
    write_batch(LESSONS, VISUALS, expected_count=4)

if __name__ == '__main__':
    create()
