#!/usr/bin/env python3
"""Parallel-worker pilot: Y7 HSIE w25 (2 lessons) into worker inbox."""
import argparse
from pathlib import Path

from hsie_y7_support import L, pair_visual, write_batch, GE1

LESSONS = [
L('s4-hsie-y7-w25-l1', GE1, ['liveability inquiry', 'criteria', 'evidence', 'recommendation'],
  'A liveability inquiry selects clear criteria (such as access to services, green space, transport and safety), gathers published place evidence, and ends with a justified recommendation. Year 7 work must locate the place, use at least two sources or data sets, and state what the evidence cannot prove. Do not invent Country names, Dreaming stories or unverified cultural claims.',
  'Example: Criterion “weekday public transport access”. Evidence: a published timetable density map for the suburb plus a fieldwork count of bus stops along one corridor. Claim: the corridor is moderately liveable for students without cars because stops are frequent before 9 am, but evening frequency is weaker. Limit: the count covers one street only.',
  'Choose one liveability criterion for a named Australian suburb or town you are studying. Write the criterion, one map/data observation and one evidenced claim with a limit.',
  'Strong answer: criterion is measurable; claim cites the source/data; limit of evidence is explicit; no invented cultural detail.',
  'Listing opinions (“it feels nice”) without criteria, or treating one photo as proof of whole-suburb liveability.',
  'Independently complete a mini liveability inquiry: name the place, list four criteria, use two published sources or class data sets, score or rank with reasons, write a five-sentence recommendation and one skill goal. Mark Community verification needs if First Nations content arises.'),
L('s4-hsie-y7-w25-l2', GE1, ['unit review', 'showcase', 'criteria', 'reflection'],
  'A geography unit review and showcase revisits liveability skills: criteria, evidence, comparison and recommendation. Students select strongest work, explain the method, and identify one skill to improve. Showcase language stays evidence-based rather than decorative.',
  'Example showcase card: “Skill: comparing two neighbourhoods on transport and parks. Evidence I used: map overlays and a services table. What I would improve: stating the scale limit sooner.” The card names method and next step.',
  'Write a three-part showcase note for this unit: best skill shown, evidence type used, and one improvement.',
  'Strong answer: names a geography skill, points to evidence type, and gives a specific improvement (not “try harder”).',
  'Rewriting the whole unit as a story with no criteria or sources.',
  'Independently build a short showcase portfolio page: one map or table excerpt (described), one paragraph explaining criteria→evidence→claim, and a reflection with one measurable skill goal for the next inquiry.'),
]

VISUALS = {
 's4-hsie-y7-w25-l1': [pair_visual('Criterion', 'transport access', 'Evidence', 'timetable + stop count',
    'Liveability criterion linked to published evidence.', 'State the limit of the count.'),
  pair_visual('Claim', 'moderate liveability', 'Limit', 'one corridor only',
    'Claim with an evidence limit.', 'Do not generalise from one street.')],
 's4-hsie-y7-w25-l2': [pair_visual('Showcase', 'skill + evidence', 'Improve', 'state scale sooner',
    'Unit showcase card structure.', 'Method over decoration.'),
  pair_visual('Review path', 'criteria → evidence', 'Then', 'claim → reflect',
    'Unit review sequence.', 'Keep geography vocabulary.')],
}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--out-dir', type=Path, required=True)
    args = parser.parse_args()
    write_batch(LESSONS, VISUALS, expected_count=2, out_dir=args.out_dir)


if __name__ == '__main__':
    main()
