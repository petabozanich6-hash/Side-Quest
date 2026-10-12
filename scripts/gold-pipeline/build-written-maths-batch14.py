#!/usr/bin/env python3
"""Year 3 Mathematics Written Core batch 14: investigation close + skills check w40-l2 through w40-l4 (3)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

DATA1, DATA2, CHAN = 'MA2-DATA-01', 'MA2-DATA-02', 'MA2-CHAN-01'

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, subject='mathematics', vocab=vocab,
                principle=principle, model=model, guided=guided, feedback=feedback,
                misconception=misconception, independent=independent)

LESSONS = [
L('s2-mat-y3-w40-l2',DATA1,['carry out','record','present','conclusion'],
  'Carry out the investigation by following the plan, recording every trial or response, then present results with a graph and a conclusion that quotes the data.',
  'Follow the vowel plan: tally A E I O U on one page → column graph → conclusion: “E appeared most with 42 tallies; U least with 9.” Mention sample (one page) so you do not overclaim.',
  'Using your plan, list the first three actions you will take today and the graph you will draw.',
  'Actions match the plan order; graph type matches the data type chosen in planning.',
  'Changing the question halfway through makes the presentation answer a different investigation.',
  'Carry out your planned investigation. Submit: raw tallies/table, one graph with labels/key, three findings with numbers, and one limitation (sample size or question wording).'),
L('s2-mat-y3-w40-l3',DATA2,['skills check','mixed','working','accuracy'],
  'A Year 3 skills check samples number, measurement, space and data/chance ideas from the year — show working and units, not only final answers.',
  'Example mix: 406−189 with regrouping; perimeter of 6×4; read 3:25; locate C2; chance word for rolling a 7 on a die (impossible); frequency from a tally.',
  'Warm-up trio: 7×8; area of 3×5 rectangle; label AM/PM for 7:00 dinner.',
  '56; 15 square units; PM.',
  'Skipping working on multi-step items loses marks even when the final guess is lucky.',
  'Complete a 16-item Year 3 skills check across number, measurement, shape/position and data/chance. Show working. Star two items to revise next.'),
L('s2-mat-y3-w40-l4',CHAN,['reflection','goal','growth','celebrate'],
  'Reflection names specific maths strengths, one strategy that helped, and a clear next goal — celebration is about growth evidence, not only scores.',
  'Strength example: “I can read timetables using row and column.” Goal: “Practise elapsed time across the hour with a time line three times this week.”',
  'Write one strength from data/chance or time this term and one goal with a practise plan.',
  'Strength quotes a skill; goal is specific and doable.',
  'Vague goals like “be better at maths” do not guide practise.',
  'Write a reflection page: three strengths with examples, two goals with practise plans, one favourite investigation moment, and a thank-you note to a helper (optional). Celebrate with a parent signature on the goals.'),
]

VISUALS = {
 's2-mat-y3-w40-l2': [pair_visual('Carry out','follow the plan','Record','every trial/response','Investigation action stage.','Do not change the question mid-way.'),
  pair_visual('Present','graph + numbers','Limitation','sample size noted','Presentation with honest scope.','Quote data in findings.')],
 's2-mat-y3-w40-l3': [pair_visual('Mix','number · measure · space','Also','data / chance','Year 3 skills check spread.','Show working and units.'),
  pair_visual('Warm-up','7×8; 3×5 area; PM dinner','Revise','star two misses','Skills-check habits.','Lucky guesses without working are weak.')],
 's2-mat-y3-w40-l4': [pair_visual('Strength','named skill + example','Goal','specific practise plan','Reflection structure.','Vague goals do not guide practise.'),
  pair_visual('Celebrate','growth evidence','Helper','optional thanks','Closing celebration focus.','Evidence over scores alone.')],
}

def create():
    assert len(LESSONS) == 3
    db = reconstruct()
    try:
        for u in LESSONS:
            row = db.execute('SELECT * FROM lessons WHERE seed_key=?', (u['seed_key'],)).fetchone()
            if row is None:
                raise ValueError(u['seed_key'])
            base = baseline_data(row)
            bundle = build_from_spec(base, u, VISUALS[u['seed_key']], subject='mathematics')
            atomic_json(ROOT / 'lesson-pipeline/authored' / f"{u['seed_key']}.json", bundle)
            print('Written Core maths bundle:', u['seed_key'])
    finally:
        db.close()

if __name__ == '__main__':
    create()
