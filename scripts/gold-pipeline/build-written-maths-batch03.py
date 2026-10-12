#!/usr/bin/env python3
"""Year 3 Mathematics Written Core batch 03: w07-l2 through w10-l1 (12 lessons)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

AR = 'MA2-AR-01'
# Multiplication/division Stage 2 catalogue code — pending content-point review (not invented; from nsw-outcomes.ts)
MR = 'MA2-MR-01'

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, subject='mathematics', vocab=vocab,
                principle=principle, model=model, guided=guided, feedback=feedback,
                misconception=misconception, independent=independent)

LESSONS = [
L('s2-mat-y3-w07-l2',AR,['written','regroup','minuend','difference'],
  'Written subtraction with regrouping aligns places and trades one ten for ten ones (and one hundred for ten tens) when a digit is too small.',
  '740 − 356: ones need regrouping through the zero tens — carefully trade from the hundreds so ones become 10, then continue. Difference 384 with clear regroup marks.',
  'Subtract 803 − 467 in columns. Show every regroup.',
  'Difference 336. Working must show how zero tens are handled when regrouping from hundreds.',
  'Taking the smaller top digit from the bottom digit (digit swap) avoids regrouping illegally.',
  'Complete six written subtractions with regrouping (at least three with a zero in the minuend). Estimate two of them first and compare to the exact difference.'),
L('s2-mat-y3-w07-l3',AR,['word problem','operation','bar model','reason'],
  'Addition and subtraction word problems need a chosen operation, a model (bar or place working) and a reason that matches the story.',
  'A library has 428 books and gets 175 more. That is addition: 428+175=603. The bar grows. If 90 are borrowed from 603, subtract to find what remains.',
  'Choose + or − and solve: "Sam had 520 stickers and gave 185 to friends. How many are left?"',
  'Subtraction: 520−185=335 left.',
  'Picking an operation from a keyword alone without reading the whole story can choose the wrong action.',
  'Solve eight word problems (four + and four −, mixed 2- and 3-digit). For each: underline the question, choose operation, show working and write one reason sentence.'),
L('s2-mat-y3-w07-l4',AR,['fluency','algorithm','estimate','accuracy'],
  'Fluency with written methods means accurate column algorithms, sensible estimates and add-back or reverse checks.',
  'Set: 456+378; 903−527. Estimate each, compute with regrouping, then reverse-check one subtraction by addition.',
  'Compute and reverse-check: 684−259.',
  'Difference 425; check 425+259=684.',
  'Fluency without checks lets the same regrouping error repeat.',
  'Complete a ten-item written +/− fluency mix. Estimate five items. Reverse-check every subtraction. Re-work misses with regroup marks visible.'),
L('s2-mat-y3-w08-l1',AR,['estimate','round','sum','difference'],
  'Estimating sums and differences uses rounding to tens or hundreds before calculating, then compares the exact answer to the estimate.',
  'Estimate 387+214 → 400+200=600. Exact 601 is very close. Estimate 812−379 → 800−400=400; exact 433 is reasonable.',
  'Estimate then compute: 468+329 and 905−478.',
  'Estimates about 800 and 400 (depending on rounding choice); exact 797 and 427 — discuss closeness.',
  'Rounding both numbers in directions that always inflate the estimate without naming the choice hides error size.',
  'For eight calculations, write a rounded estimate, the exact answer and close/far with a reason. Use tens for four items and hundreds for four.'),
L('s2-mat-y3-w08-l2',AR,['inverse','confirm','add back','undo'],
  'Addition and subtraction are inverse operations. You can confirm a subtraction by adding the difference to the subtrahend, and confirm an addition by subtracting one addend.',
  'If 903−527=376, then 376+527 should equal 903. If not, the difference needs reworking.',
  'Confirm whether 640−285=355 is correct using the inverse.',
  '355+285=640, so the difference is confirmed. If the sum were wrong, recompute the subtraction.',
  'Using the inverse with the same mistaken digits can falsely "confirm" an error — recompute places if needed.',
  'Solve six +/− calculations. Confirm each with the inverse operation. For any mismatch, show the corrected working and say which place was wrong.'),
L('s2-mat-y3-w08-l3',AR,['multi-step','order','hidden question','plan'],
  'Multi-step problems need a plan: find a hidden middle question, solve step 1, then use that answer in step 2.',
  'A team scores 128, then 95, then gives away 40 points in a practice adjust. Step 1: 128+95=223. Step 2: 223−40=183.',
  'Plan steps for: "Maya has 260 beads, buys 145 more, then uses 90. How many are left?"',
  'Step 1 add 260+145=405; step 2 subtract 405−90=315 left.',
  'Doing both operations in one muddled line without a middle total often mis-orders the story.',
  'Solve six multi-step +/− problems. For each, write the hidden middle question, both steps of working and the final sentence answer.'),
L('s2-mat-y3-w08-l4',AR,['review','estimate','inverse','word problem'],
  'Unit review connects written +/−, estimating, inverse checks and word/multi-step problems.',
  'Review path: estimate 574+269 → compute → inverse check a related subtraction → solve a two-step story using the sum.',
  'Mini review: estimate 820−365; compute; inverse check; write one word problem that matches your exact difference.',
  'Estimate near 500; exact 455; check 455+365=820; word problem must fit 455 as the answer.',
  'Review that only lists answers without estimates or checks misses the unit goals.',
  'Complete a 12-item unit review set: 4 written calculations with estimates, 4 inverse checks, 4 word/multi-step items. List two next practice goals.'),
L('s2-mat-y3-w09-l1',MR,['equal groups','array','rows','columns'],
  'Equal groups and arrays show the same total: rows and columns organise equal groups so the total can be counted by groups or by multiplying later.',
  '3 rows of 5 counters is an array of 15. It is also 3 equal groups of 5 (or 5 equal groups of 3 if rotated).',
  'Draw or describe an array for 4 groups of 6. How many rows and columns if each group is a row?',
  '4 rows of 6 (4×6) totaling 24. Columns would be 6 if each row has 6.',
  'Unequal groups are not arrays of equal rows; they cannot use the same multiplication fact yet.',
  'Build or draw six arrays (different factors). For each, write equal-groups language, row×column and the total. Include one non-example that is not equal groups and say why.'),
L('s2-mat-y3-w09-l2',MR,['repeated addition','multiplication','factor','product'],
  'Multiplication can mean repeated addition of equal groups: 4×6 means 6+6+6+6 (or 4+4+4+4+4+4 depending on which factor is the group size).',
  '5×3 = 3+3+3+3+3 = 15. The factors 5 and 3 tell how many groups and how many in each group.',
  'Write 7×4 as repeated addition two ways (groups of 4, and groups of 7) and find the product.',
  '4+4+4+4+4+4+4=28 and 7+7+7+7=28. Product 28.',
  'Adding unequal numbers is not a multiplication interpretation of equal groups.',
  'For eight multiplication expressions, write repeated addition, sketch equal groups and state the product. Then write two story sentences that match two of the expressions.'),
L('s2-mat-y3-w09-l3',MR,['facts','twos','fives','tens'],
  'Multiplication facts for 2, 5 and 10 connect to doubling, five-counts and place-value tens, so they can be built as well as remembered.',
  '8×5: count 5,10,15,20,25,30,35,40 or use 8×10=80 then half → 40. 6×10=60 because six tens.',
  'Find 9×2, 7×5 and 4×10 with a strategy named for each.',
  '18 (double 9); 35 (five-counts or 7×10/2); 40 (four tens).',
  'Guessing table answers with no link to equal groups weakens later problem solving.',
  'Create a facts grid for ×2, ×5 and ×10 (0–10). Highlight five facts you used strategies for and write the strategy beside each. Self-quiz twelve facts.'),
L('s2-mat-y3-w09-l4',MR,['fluency','tables','strategy','accuracy'],
  'Times-table fluency for known facts uses strategy backup when memory blanks, with accuracy before speed.',
  'Set: 6×2; 8×5; 9×10. If 8×5 blanks, rebuild with five-counts or half of 8×10.',
  'Solve and name backup strategy if needed: 7×2; 6×5; 3×10.',
  '14; 30; 30 — doubles / fives / tens.',
  'Speed that produces wrong products is not fluency.',
  'Complete an eighteen-item ×2/5/10 fluency set. Re-work misses with a named strategy and equal-groups sketch.'),
L('s2-mat-y3-w10-l1',MR,['threes','fours','strategy','array'],
  'Facts for 3 and 4 can be built from known 2s (double then add a group) or from arrays and skip-counting.',
  '7×4: double 7×2=14, then double again 28. Or 7×3=21 then add one more 7 → 28 for 7×4.',
  'Find 6×3 and 8×4 using a build-from-known-facts strategy.',
  '18 (e.g. 6×2+6); 32 (e.g. double 8×2 twice, or 8×2=16 then double).',
  'Treating ×3 and ×4 as unrelated to ×2 makes blanks harder to rebuild.',
  'Build a ×3 and ×4 facts list to 10. For six facts write a build strategy from ×2 or skip-counting. Self-quiz ten mixed 3/4 facts.'),
]

VISUALS = {
 's2-mat-y3-w07-l2': [pair_visual('Regroup','trade 1 ten for 10 ones','Zero tens','trade from hundreds carefully','Written subtraction regrouping through zero tens.','Show every regroup mark.'),
  pair_visual('Difference','740 − 356 = 384','Illegal','swapping digits to avoid regrouping','Correct regrouped difference contrasted with digit swap.','Places stay aligned top to bottom.')],
 's2-mat-y3-w07-l3': [pair_visual('Story','428 books + 175 more','Operation','addition — bar grows','Word problem matched to an addition action.','The story decides the operation.'),
  pair_visual('Left','520 − 185','Reason','stickers given away','Subtraction story with a clear leftover question.','Read the whole story before choosing + or −.')],
 's2-mat-y3-w07-l4': [pair_visual('Estimate','then written method','Reverse','difference + subtrahend','Fluency path with estimate and reverse confirm path.','Accuracy needs visible regroup marks.'),
  pair_visual('Example','684 − 259 = 425','Confirm','425 + 259 = 684','Subtraction confirmed by addition.','Re-work misses, do not only mark them wrong.')],
 's2-mat-y3-w08-l1': [pair_visual('Round','387+214 → 400+200','Exact','601 — close to 600','Rounded estimate beside an exact sum.','Name whether you rounded to tens or hundreds.'),
  pair_visual('Difference estimate','812−379 → about 400','Exact','433 — reasonable','Estimate used to judge a difference.','Close/far needs a short reason.')],
 's2-mat-y3-w08-l2': [pair_visual('Inverse','376 + 527 = 903','Means','903 − 527 was 376','Inverse addition confirming a subtraction.','Inverses undo each other.'),
  pair_visual('Mismatch','recompute places','Do not','trust the same wrong digits twice','Failed inverse sending you back to regrouping.','Confirm, then correct if needed.')],
 's2-mat-y3-w08-l3': [pair_visual('Step 1','128 + 95 = 223','Step 2','223 − 40 = 183','Two-step plan with a middle total.','Write the hidden middle question.'),
  pair_visual('Beads','260 + 145 → 405','Then','405 − 90 left','Multi-step bead story in order.','Do not mash both operations into one unclear line.')],
 's2-mat-y3-w08-l4': [pair_visual('Review path','estimate → compute → inverse','Then','two-step story','Unit skills linked in a review path.','Keep estimates and confirms beside answers.'),
  pair_visual('Make a story','answer must fit 455','Goals','two next practice skills','Word problem invented to match a computed difference.','Review targets reasons, not bare answers.')],
 's2-mat-y3-w09-l1': [pair_visual('Array','3 rows of 5','Total','15','Equal-groups array with rows and columns.','Rows and columns organise equal groups.'),
  pair_visual('Equal groups','4 groups of 6','Non-example','unequal group sizes','Equal groups contrasted with unequal piles.','Arrays need equal rows.')],
 's2-mat-y3-w09-l2': [pair_visual('5×3','3+3+3+3+3','Product','15','Repeated addition matching a multiplication.','Factors tell groups and group size.'),
  pair_visual('7×4','four 7s or seven 4s','Same product','28','Two repeated-addition views of one product.','Unequal addends are not this structure.')],
 's2-mat-y3-w09-l3': [pair_visual('×5','five-counts or half of ×10','×10','count tens','Strategies for five and ten facts.','Build facts, do not only guess.'),
  pair_visual('×2','doubles','Example','9×2=18','Twos facts as doubles.','Link each fact to equal groups.')],
 's2-mat-y3-w09-l4': [pair_visual('Fluency set','×2; ×5; ×10','Backup','rebuild with a strategy','Times-table fluency with strategy backup.','Accuracy before speed.'),
  pair_visual('Miss','sketch equal groups','Then','named strategy rewrite','Missed fact rebuilt with groups and strategy.','Blank memory is a cue to rebuild.')],
 's2-mat-y3-w10-l1': [pair_visual('7×4','double 7×2 → 14 → 28','Or','7×3=21 +7','Fours built from twos or threes.','Known facts help build new ones.'),
  pair_visual('6×3','6×2 +6 =18','8×4','double 8×2 twice','Threes and fours with build strategies.','Skip-counting arrays also work.')],
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
