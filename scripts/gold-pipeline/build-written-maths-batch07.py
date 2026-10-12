#!/usr/bin/env python3
"""Year 3 Mathematics Written Core batch 07: money w19-l2..w20-l4 + length w21-l1..w22-l1 (12)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

RN, GM = 'MA2-RN-01', 'MA2-GM-01'

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, subject='mathematics', vocab=vocab,
                principle=principle, model=model, guided=guided, feedback=feedback,
                misconception=misconception, independent=independent)

LESSONS = [
L('s2-mat-y3-w19-l2',RN,['total','compare','dollar','cent'],
  'Counting and comparing money means finding each total in dollars and cents, then deciding which amount is greater using place value of dollars then cents.',
  '$4.80 vs $5.05: dollars 4 < 5, so $5.05 is greater. Totals: five 20c coins = $1.00.',
  'Compare and order: $3.50; $3.05; $4.00. Total two $1 and seven 10c.',
  'Order: $3.05; $3.50; $4.00. Total $1+$1+$0.70=$2.70.',
  'Comparing only the cent digits (80>05) while ignoring dollars gives the wrong order.',
  'Make ten money amounts (list coins/notes). Find each total, then order five of them from least to greatest with a comparison reason for each neighbouring pair.'),
L('s2-mat-y3-w19-l3',RN,['change','pay','subtract','count on'],
  'Giving change is the difference between the amount paid and the price. Count on from the price to the tender, or subtract.',
  'Item $3.20, pay with $5. Change: count on 80c to $4, then $1 to $5 → $1.80. Or $5.00−$3.20=$1.80.',
  'Find change: price $2.45, paid $5; price $6.10, paid $10.',
  '$2.55; $3.90.',
  'Subtracting dollars only and forgetting cents underpays or overpays change.',
  'Solve ten change problems (prices under $20). Show count-on or subtraction working. For two items, list a possible set of coins/notes that make the change.'),
L('s2-mat-y3-w19-l4',RN,['fluency','total','change','compare'],
  'Money fluency mixes totalling coins, comparing amounts and finding change with accurate dollars-and-cents notation.',
  'Set: total three $2 and four 50c; compare $7.40 and $7.04; change from $10 for a $6.25 item.',
  'Do: total; compare $2.90 and $3.05; change for $4.50 paid with $5.',
  'Totals depend on coins given; $2.90<$3.05; change $0.50.',
  'Writing $5.5 instead of $5.50 can hide place mistakes in later work.',
  'Complete an eighteen-item money fluency mix. Rewrite every miss with $ and c places labelled.'),
L('s2-mat-y3-w20-l1',RN,['word problem','buy','change','budget'],
  'Money word problems combine totalling, comparing and change. Read what is asked: total cost, change, or whether there is enough.',
  'Two books at $4.50 each cost $9.00. Paying with $10 leaves $1.00 change. If you have $8, you do not have enough.',
  'Solve: 3 snacks at $1.25 each; pay with $5. Total? Change? Enough if you only have $3.50?',
  'Total $3.75; change $1.25; $3.50 is not enough.',
  'Answering change when the question asked for total (or the reverse) misses the question.',
  'Solve eight money word problems. Underline the question words, show working and write a sentence answer. Invent two new shop problems for a partner.'),
L('s2-mat-y3-w20-l2',RN,['round','nearest dollar','estimate','cent'],
  'Rounding money to the nearest dollar uses the 50-cent midpoint: 50c or more rounds up; less than 50c rounds down (for nearest dollar).',
  '$3.49 → nearest dollar $3. $3.50 → $4. $7.80 → $8. Estimates help decide if you have enough before exact change.',
  'Round to the nearest dollar: $2.40; $2.50; $9.99. Estimate $2.40+$2.50.',
  '$2; $3; $10. Estimate about $5 (exact $4.90).',
  'Always rounding up "to be safe" is not the nearest-dollar rule, though it can be a separate budgeting choice.',
  'Round twelve amounts to the nearest dollar. For four pairs, estimate the sum with rounded values then compute exact totals and comment close/far.'),
L('s2-mat-y3-w20-l3',RN,['budget','price','plan','shop'],
  'Planning a class shop means listing items, prices, a budget and deciding what can be bought without going over the total.',
  'Budget $20. Items: pencils $3, stickers $4.50, erasers $2. Choosing pencils+stickers+erasers = $9.50 — within budget with $10.50 left.',
  'With $15, can you buy two $4 items and one $6.50 item? Show working.',
  'Two×$4=$8; +$6.50=$14.50 — yes, $0.50 left.',
  'Adding prices without converting cents can mis-total the cart.',
  'Plan a class shop: choose a budget, list six priced items, make three different purchase combinations under budget and one that goes over. Show totals and leftover.'),
L('s2-mat-y3-w20-l4',RN,['review','change','round','budget'],
  'Money unit review connects totalling, comparing, change, rounding and budget decisions.',
  'Review path: total coins → compare two amounts → find change → round to nearest dollar → decide if a cart fits a budget.',
  'Mini review: total; change from $10 for $7.35; round $7.35; enough for another $2.50 item from leftover?',
  'Change $2.65; rounds to $7; leftover after $7.35 from $10 is $2.65 so $2.50 fits.',
  'Review that only lists dollars without cents hides place errors.',
  'Complete a 12-item money unit review. Show working for every item. List two skills to practise next.'),
L('s2-mat-y3-w21-l1',GM,['centimetre','metre','unit','length'],
  'Length can be measured in centimetres and metres. 100 centimetres equal 1 metre. Choose the unit that fits the object.',
  'A pencil might be about 15 cm. A classroom wall might be about 8 m. 250 cm = 2 m 50 cm = 2.5 m.',
  'Which unit fits better: length of a book; length of a sports oval? Convert 300 cm to metres.',
  'Book: cm; oval: m. 300 cm = 3 m.',
  'Measuring a playground in centimetres only is possible but inefficient.',
  'Measure or estimate eight classroom objects: choose cm or m, record the measure and convert three centimetre measures into metres and centimetres.'),
L('s2-mat-y3-w21-l2',GM,['ruler','tape','zero','align'],
  'Measuring with a ruler or tape means aligning the zero mark with one end and reading the scale at the other end without gaps or overlaps.',
  'Place zero at the end of a ribbon. If the other end meets 18, the length is 18 cm. Starting at 1 by mistake makes the reading 1 cm too short.',
  'A pencil starts at 0 and ends at 14.5 on a centimetre ruler. What length? What error if someone started at 1?',
  '14.5 cm; starting at 1 would under-read by about 1 cm.',
  'Measuring from the metal tip end if zero is not there, or leaving a gap, changes the length.',
  'Measure six objects with a ruler or tape. Photograph or sketch the alignment for two. Write one common measuring error and how to avoid it.'),
L('s2-mat-y3-w21-l3',GM,['estimate','compare','benchmark','measure'],
  'Estimating length uses benchmarks (for example a 30 cm ruler). Comparing lengths can use direct comparison or measured values in the same unit.',
  'Estimate a desk edge near 1 m using arm span or metre stick, then measure. Compare two ribbons by lining up ends or by both measures in cm.',
  'Estimate then measure: your book length; a table width. Which estimate was closer?',
  'Answers vary; record estimate, measure and difference for each.',
  'Comparing a centimetre measure with a metre measure without converting mis-orders lengths.',
  'Estimate and then measure eight lengths. Record estimate, measure, difference and same-unit comparisons for three pairs.'),
L('s2-mat-y3-w21-l4',GM,['fluency','convert','cm','m'],
  'Length fluency mixes choosing units, converting between cm and m and reading simple scale values accurately.',
  'Set: 2 m = __ cm; 450 cm = __ m __ cm; which is longer, 180 cm or 1 m 90 cm?',
  'Convert: 3 m; 125 cm; compare 2 m and 250 cm.',
  '300 cm; 1 m 25 cm; 2 m < 250 cm (250 cm = 2 m 50 cm).',
  'Forgetting that 100 cm = 1 m causes conversion errors.',
  'Complete a 16-item length fluency set (convert, compare, choose unit). Re-work misses with a unit diagram.'),
L('s2-mat-y3-w22-l1',GM,['millimetre','kilometre','scale','unit'],
  'Millimetres measure short lengths (10 mm = 1 cm). Kilometres measure long distances (1000 m = 1 km). Match the unit to the size.',
  'A tiny seed gap might be 3 mm. A road trip might be 12 km. 25 mm = 2 cm 5 mm. 3000 m = 3 km.',
  'Choose mm, cm, m or km: thickness of a coin; length of a pencil; length of a classroom; distance between towns. Convert 40 mm to cm.',
  'mm; cm; m; km. 40 mm = 4 cm.',
  'Using kilometres for a pencil length is the wrong scale.',
  'Sort twelve everyday lengths into mm/cm/m/km. Convert six measures between mm↔cm and m↔km. Write one sentence about why unit choice matters.'),
]

VISUALS = {
 's2-mat-y3-w19-l2': [pair_visual('Compare','$4.80 vs $5.05','Decide at','dollars first','Money comparison using dollars then cents.','Do not compare cents alone.'),
  pair_visual('Total','two $1 + seven 10c','Amount','$2.70','Coin collection totalled in dollars and cents.','Use values, not only how many coins.')],
 's2-mat-y3-w19-l3': [pair_visual('Price','$3.20','Paid','$5','Change situation from price to tender.','Change is the difference.'),
  pair_visual('Count on','80c to $4; $1 to $5','Change','$1.80','Count-on path for giving change.','Keep cents accurate in every step.')],
 's2-mat-y3-w19-l4': [pair_visual('Fluency','total; compare; change','Notation','$7.40 not $7.4 alone','Money fluency with clear dollar-cent notation.','Label dollar and cent places on misses.'),
  pair_visual('Compare','$7.40 vs $7.04','Change','$10 − $6.25','Comparison and change items side by side.','Accuracy before speed.')],
 's2-mat-y3-w20-l1': [pair_visual('Total','2 × $4.50 = $9','Change','$10 → $1 left','Shop story with total and change.','Underline what the question asks.'),
  pair_visual('Enough?','have $8; need $9','Decision','not enough','Budget decision from a total cost.','Total and change are different questions.')],
 's2-mat-y3-w20-l2': [pair_visual('Nearest dollar','$3.49 → $3','Midpoint','$3.50 → $4','Rounding money to the nearest dollar.','50c or more rounds up.'),
  pair_visual('Estimate','$2.40+$2.50 ≈ $5','Exact','$4.90 — close','Rounded estimate beside an exact sum.','Nearest-dollar is not the same as always rounding up.')],
 's2-mat-y3-w20-l3': [pair_visual('Budget','$20','Cart','$3 + $4.50 + $2','Class shop plan under a budget.','Stay under the total.'),
  pair_visual('Combo','two $4 + $6.50','Total','$14.50 from $15','Purchase combination with leftover.','Regroup cents when adding prices.')],
 's2-mat-y3-w20-l4': [pair_visual('Review path','total → compare → change','Then','round → budget','Money unit skills linked in one path.','Keep cents visible throughout.'),
  pair_visual('Mini','change from $10 for $7.35','Leftover','enough for $2.50?','Review item linking change and a next buy.','List next practice goals.')],
 's2-mat-y3-w21-l1': [pair_visual('cm','pencil about 15 cm','m','wall about 8 m','Choosing centimetres or metres for length.','100 cm = 1 m.'),
  pair_visual('Convert','250 cm','Also','2 m 50 cm','Centimetres rewritten in metres.','Match the unit to the object size.')],
 's2-mat-y3-w21-l2': [pair_visual('Align','zero at one end','Read','mark at the other end','Ruler measurement with zero alignment.','Gaps and overlaps change the length.'),
  pair_visual('Error','starting at 1','Result','reading too short','Common ruler error contrasted with zero start.','Know where zero is on the tool.')],
 's2-mat-y3-w21-l3': [pair_visual('Estimate','about 1 m desk edge','Then','measure and compare','Estimate-then-measure path for length.','Use benchmarks like a metre stick.'),
  pair_visual('Compare','same unit','Convert first','if units differ','Fair length comparison in one unit.','cm vs m without converting mis-orders.')],
 's2-mat-y3-w21-l4': [pair_visual('Convert','2 m = 200 cm','450 cm','4 m 50 cm','Length conversion fluency items.','Remember 100 cm = 1 m.'),
  pair_visual('Compare','180 cm vs 1 m 90 cm','Longer','1 m 90 cm (190 cm)','Same-unit comparison of two lengths.','Rewrite misses with a unit diagram.')],
 's2-mat-y3-w22-l1': [pair_visual('mm','10 mm = 1 cm','km','1000 m = 1 km','Millimetres and kilometres on a scale of size.','Match unit to the length.'),
  pair_visual('Choose','coin thickness → mm','Towns','distance → km','Everyday lengths sorted by unit.','Wrong scale makes numbers hard to use.')],
}


def create():
    assert len(LESSONS) == 12
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
