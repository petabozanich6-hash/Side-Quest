#!/usr/bin/env python3
"""Year 3 Mathematics Written Core batch 01: place-value foundations (12 lessons)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

CODE = 'MA2-RN-01'  # wording verified in lesson-pipeline/sources/nesa-ma2-rn-01.json; content points pending

def L(seed, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=CODE, subject='mathematics', vocab=vocab,
                principle=principle, model=model, guided=guided, feedback=feedback,
                misconception=misconception, independent=independent)

LESSONS = [
L('s2-mat-y3-w01-l1',['whole number','place','ones','tens'],
  'Whole numbers count complete units. We read them by naming place groups from ones upward, not by treating every digit as ones.',
  '4,518 has 8 ones, 1 ten, 5 hundreds and 4 thousands. The digit 5 means 500 because it sits in the hundreds place.',
  'How many tens make one hundred? How many hundreds make one thousand?',
  'Ten tens make one hundred. Ten hundreds make one thousand.',
  'Reading 4,518 as "four, five, one, eight ones" ignores place value.',
  'For 3,706 and 2,540: name each digit\'s place and value. Then count forward by ones from 3,698 to 3,705, writing the numbers. Explain one regrouping you used.'),
L('s2-mat-y3-w01-l2',['place value','partition','expand','zero'],
  'Place value and zero let us partition a number into place amounts. Zero holds an empty place so other digits keep their true values.',
  '3,706 = 3,000 + 700 + 6. The zero in the tens place means no tens, not that the 7 is tens.',
  'Partition 2,045 into thousands, hundreds, tens and ones. Say what the zero means.',
  '2,045 = 2,000 + 40 + 5 (0 hundreds). Zero shows there are no hundreds.',
  'Dropping a zero (writing 245 for 2,045) changes the number\'s value.',
  'Partition 5,080, 4,203 and 1,070. For each, write an expanded form and one sentence about the role of zero. Then rebuild each number from its parts.'),
L('s2-mat-y3-w01-l3',['compare','order','greater','less'],
  'To compare and order whole numbers, align places from the largest place and compare digit by digit until they differ.',
  'Compare 4,318 and 4,281: thousands equal, hundreds 3 > 2, so 4,318 > 4,281.',
  'Order from least to greatest: 3,905; 3,950; 3,059.',
  '3,059; 3,905; 3,950 — compare thousands first, then hundreds, then tens.',
  'Comparing from the ones place first often gives the wrong order for multi-digit numbers.',
  'Order 2,706; 2,670; 2,760; 2,067 from least to greatest. Write a comparison sentence for each neighbouring pair using < or > and name the deciding place.'),
L('s2-mat-y3-w01-l4',['fluency','reason','regroup','count'],
  'Whole-number fluency means reading, counting and partitioning with reasons, including regrouping ten of one place as one of the next.',
  'Counting from 2,996 to 3,001: 2,997; 2,998; 2,999; 3,000; 3,001. Crossing 3,000 regroups nine hundreds and nine tens and nine ones into the next thousand.',
  'Count on by ones from 1,997 to 2,003 and mark where regrouping to the next thousand happens.',
  'Sequence includes 1,998; 1,999; 2,000; 2,001; 2,002; 2,003. Regrouping is visible at 2,000.',
  'Skipping 2,000 or writing 1,1000 shows a regrouping misunderstanding.',
  'Complete three fluency sets: (1) count back by ones across a thousand (2) partition two 4-digit numbers two different ways (3) compare three numbers with reasons. Show working for each.'),
L('s2-mat-y3-w02-l2',['number line','skip count','interval','position'],
  'Number lines show position. Skip counting moves in equal intervals; the jump size must match the marks.',
  'On a line marked in tens from 340 to 400, skip-counting by tens lands on 350, 360, 370... Equal jumps of 10.',
  'A line is marked 200, 220, 240, 260. What is the interval? What comes after 260?',
  'Interval 20; next mark 280.',
  'Assuming every number line jumps by ones when marks are tens causes wrong positions.',
  'Draw or describe two number lines: one with interval 5 from 480 to 520, one with interval 100 from 1,000 to 1,500. Place 505 and 1,300 and explain how you found each position.'),
L('s2-mat-y3-w02-l3',['pattern','sequence','rule','term'],
  'Number patterns follow a rule. Find the rule by looking at how terms change, then use it to continue or find a missing term.',
  'Sequence 405, 415, 425, 435 increases by 10 each time. The next term is 445.',
  'Find the rule and the missing term: 1,200; 1,500; ___; 2,100.',
  'Rule: add 300. Missing term 1,800.',
  'Looking only at the first digit and ignoring the add/subtract rule leads to false terms.',
  'For four sequences (two increasing, two decreasing), state the rule, fill one missing term and write the next two terms. Use different intervals such as 5, 10, 50 and 100.'),
L('s2-mat-y3-w02-l4',['place value','digit value','zero','reason'],
  'A quick place-value check asks: what is each digit worth, and does zero hold a place? Reasons must name places, not only say "because".',
  'In 6,040 the 4 is 40 (4 tens), not 4. The zero in ones means no ones.',
  'What is the value of the digit 7 in 7,205 and in 2,705?',
  '7,000 in 7,205; 700 in 2,705 — same digit, different places.',
  'Saying both sevens are worth seven ignores place.',
  'Create six quick-check items for a partner: three "value of the digit" and three "fix the zero error" (e.g. 405 vs 450). Provide an answer key with place reasons.'),
L('s2-mat-y3-w03-l1',['words','numerals','thousands','hyphen'],
  'Reading and writing large numbers in words follows place groups: thousands, then the remaining hundreds/tens/ones, with conventional word forms.',
  '3,045 is three thousand and forty-five (Australian school wording may use "and" before the tens/ones part). 3,405 is three thousand four hundred and five.',
  'Write in numerals: four thousand and sixty-two. Write in words: 2,508.',
  '4,062; two thousand five hundred and eight.',
  'Writing 4,062 as four thousand six hundred two swaps tens and hundreds words.',
  'Convert eight numbers both ways (words↔numerals) between 1,000 and 9,999, including zeros in different places. Mark hyphens in compound tens words such as forty-five.'),
L('s2-mat-y3-w03-l2',['partition','standard','non-standard','regroup'],
  'Numbers can be partitioned in standard place form and in non-standard ways that still equal the same total after regrouping.',
  'Standard: 1,320 = 1,000 + 300 + 20. Non-standard: 1,320 = 13 hundreds + 2 tens, because 13 hundreds = 1,300.',
  'Show 2,040 as standard expanded form and as tens only (how many tens?).',
  '2,000+40; 204 tens (because 2,040÷10=204).',
  'Non-standard partitions are wrong only if they do not equal the original number.',
  'For 3,060; 1,405; 2,700 write (a) standard expanded form (b) one non-standard partition (c) a short proof they are equal using regrouping.'),
L('s2-mat-y3-w03-l3',['problem','place value','reason','model'],
  'Place-value problem solving uses digit values and regrouping to answer real questions about quantity, not digit tricks alone.',
  'A school has 2,450 pencils. A box holds 100. How many full boxes? 24 full boxes with 50 left over, because 24 hundreds make 2,400.',
  'There are 3,060 stickers in packs of 10. How many packs? Show place reasoning.',
  '306 packs — 3,060 ones = 306 tens.',
  'Dividing digits separately (3, 0, 6) without place meaning gives nonsense pack counts.',
  'Solve four place-value word problems with new numbers (boxes of 10 and 100, leftover ones, comparing collections). Show working and a one-sentence reason for each.'),
L('s2-mat-y3-w03-l4',['fluency','count','partition','compare'],
  'Fluency practice mixes counting, partitioning and comparing so place-value skills stay connected under mild time pressure without rushing sense-making.',
  'Set: partition 4,080; compare 4,080 and 4,800; count on by tens from 4,080 five times → 4,090; 4,100; 4,110; 4,120; 4,130.',
  'Complete: partition 2,905; compare with 2,950; count back by hundreds from 2,905 three times.',
  '2,905=2,000+900+5; 2,905<2,950; 2,805; 2,705; 2,605.',
  'Speed that drops reasons is not fluency; accuracy with reasons comes first.',
  'Complete a mixed fluency sheet of nine items (3 count, 3 partition, 3 compare) with numbers you have not used today. Self-mark with place reasons.'),
L('s2-mat-y3-w04-l1',['real world','estimate','exact','context'],
  'Numbers in the real world appear on signs, scores and measures. Decide when an exact count is needed and when a place-value estimate is enough.',
  'A crowd sign says 2,500. That is likely a rounded or planned figure, not a guarantee every person was counted. For ordering chairs we may need a more exact count.',
  'A packet label shows 1,000 mL. Is that an exact measure for the recipe needing 1,000 mL, or only a rough idea? Why?',
  'Treat it as the stated exact pack size for the recipe unless measuring shows otherwise; labels claim a specific amount.',
  'Assuming every displayed number is approximate (or every one is exact) without context causes poor decisions.',
  'Find or invent six real-world numbers (scores, prices in whole dollars, distances in whole km, crowd signs). For each, say exact or estimate, name the places you notice and one decision the number supports.'),
]

VISUALS = {
 's2-mat-y3-w01-l1': [pair_visual('Number','4,518','Places','4 thousands; 5 hundreds; 1 ten; 8 ones','Place chart for four thousand five hundred eighteen.','A digit\'s column gives its value.'),
  pair_visual('Ten tens','one hundred','Ten hundreds','one thousand','Equal grouping into the next place.','Places grow by tens of the place to the right.')],
 's2-mat-y3-w01-l2': [pair_visual('Expanded','3,000 + 700 + 6','Zero role','no tens in 3,706','Expanded form with a zero holding tens.','Zero keeps other digits in the correct places.'),
  pair_visual('Keep zero','2,045','Dropped zero','245 — different value','Zero preserved contrasted with a dropped zero.','Dropping zero changes the number.')],
 's2-mat-y3-w01-l3': [pair_visual('Compare','4,318 vs 4,281','Decide at','hundreds: 3 > 2','Place-by-place comparison from the left.','Start at the largest place.'),
  pair_visual('Order','3,059; 3,905; 3,950','Wrong start','comparing ones first','Least-to-greatest order with deciding places.','Ones-first comparison mis-orders large numbers.')],
 's2-mat-y3-w01-l4': [pair_visual('Across thousand','2,999 → 3,000 → 3,001','Regroup','all lower places roll over','Counting across a thousand with regrouping.','Name the regroup, not only the next numeral.'),
  pair_visual('Fluency set','count; partition; compare','Not fluency','speed with no reasons','Connected fluency tasks with reasons.','Accuracy with reasons comes first.')],
 's2-mat-y3-w02-l2': [pair_visual('Interval','tens from 340 to 400','Equal jumps','+10 each mark','Number line with equal ten intervals.','Jump size must match the marks.'),
  pair_visual('Marks','200; 220; 240; 260','Next','280','Interval of twenty continued one more mark.','Read the interval before placing a number.')],
 's2-mat-y3-w02-l3': [pair_visual('Rule','add 10','Next term','445 after 435','Increasing pattern with a clear add rule.','Find how terms change, then continue.'),
  pair_visual('Missing','1,200; 1,500; ___; 2,100','Fill','1,800 (add 300)','Missing term found from a constant difference.','The rule must fit every step shown.')],
 's2-mat-y3-w02-l4': [pair_visual('Digit 4 in 6,040','value 40','Not','value 4','Same digit shape, place gives value forty.','Ask what the digit is worth in its place.'),
  pair_visual('7 in 7,205','7,000','7 in 2,705','700','Digit seven in thousands vs hundreds.','Place changes the value of the same digit.')],
 's2-mat-y3-w03-l1': [pair_visual('Numeral','3,045','Words','three thousand and forty-five','Numeral matched to conventional word form.','Place groups guide the words.'),
  pair_visual('4,062 words','four thousand and sixty-two','Swap error','six hundred in the tens place words','Correct words contrasted with swapped hundreds/tens.','Zeros still need correct place words.')],
 's2-mat-y3-w03-l2': [pair_visual('Standard','1,000 + 300 + 20','Non-standard','13 hundreds + 2 tens','Standard and non-standard partitions of 1,320.','Both must equal the same total.'),
  pair_visual('2,040 as tens','204 tens','Proof','2,040 ÷ 10 = 204','Whole number rewritten as a count of tens.','Regrouping keeps the value equal.')],
 's2-mat-y3-w03-l3': [pair_visual('2,450 pencils','boxes of 100','Full boxes','24 with 50 left','Place-value division into hundreds boxes.','Use hundreds and leftovers, not digit tricks.'),
  pair_visual('3,060 stickers','packs of 10','Packs','306','Ones regrouped as tens for pack counts.','Place meaning drives the operation.')],
 's2-mat-y3-w03-l4': [pair_visual('Mixed set','partition; compare; count on','Example','4,080 vs 4,800','Fluency mix linking three place-value skills.','Keep reasons beside answers.'),
  pair_visual('Count back','2,905 → 2,805 → 2,705','By hundreds','equal hundred jumps','Counting back by hundreds on a fluent path.','Interval stays constant.')],
 's2-mat-y3-w04-l1': [pair_visual('Crowd sign','2,500','Likely','rounded or planned figure','Real-world number that may be an estimate.','Ask whether exactness is required.'),
  pair_visual('Label','1,000 mL pack','Use','treat as stated amount for a recipe','Pack label used as a stated measure.','Context decides exact versus estimate.')],
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
