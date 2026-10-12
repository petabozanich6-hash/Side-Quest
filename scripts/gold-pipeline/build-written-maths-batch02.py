#!/usr/bin/env python3
"""Year 3 Mathematics Written Core batch 02: estimate/review + addition/subtraction (12 lessons)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

RN, AR = 'MA2-RN-01', 'MA2-AR-01'  # RN wording verified in sources/; AR from repo catalogue — both pending content-point review

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, subject='mathematics', vocab=vocab,
                principle=principle, model=model, guided=guided, feedback=feedback,
                misconception=misconception, independent=independent)

LESSONS = [
L('s2-mat-y3-w04-l2',RN,['estimate','benchmark','confirm','reasonable'],
  'Estimating uses nearby benchmarks (tens or hundreds). Checking asks whether an exact answer is close to a sensible estimate.',
  'Estimate 387 + 210 by thinking 400 + 200 = 600. An exact answer near 600 is reasonable; 97 would not be.',
  'Estimate 1,980 − 390 using hundreds benchmarks. What range seems reasonable?',
  'About 2,000 − 400 = 1,600 (or 1,980 − 400 = 1,580). Answers near that range are reasonable.',
  'Calling any guess an estimate without naming a benchmark is not a mathematical estimate.',
  'For six calculations (three + and three −), write a benchmark estimate, compute or be given an exact answer and say reasonable or not with a one-sentence reason.'),
L('s2-mat-y3-w04-l3',RN,['thousand','bundle','ten hundreds','investigate'],
  'A mini investigation of one thousand builds ten hundreds (or 100 tens / 1,000 ones) so students feel the size of 1,000.',
  'Ten grids of 100 make 1,000. One thousand is also 100 groups of 10. Same quantity, different bundles.',
  'How many hundreds equal one thousand? How many tens equal one thousand?',
  '10 hundreds; 100 tens.',
  'Thinking a thousand is only "a big number" without relating bundles leaves the size vague.',
  'Investigate with drawings or objects: show 1,000 as (a) 10 hundreds (b) 100 tens (c) 20 groups of 50. Record each model and one sentence comparing them.'),
L('s2-mat-y3-w04-l4',RN,['review','place value','compare','partition'],
  'Unit review connects reading, partitioning, comparing and estimating so place-value ideas work together.',
  'Review chain: partition 4,070 → compare with 4,700 → estimate 4,070 + 800 ≈ 4,900 → exact 4,870 near the estimate.',
  'Quick review: value of 6 in 6,308; order 2,085 and 2,805; estimate 2,990 + 20.',
  '6,000; 2,085 < 2,805; about 3,010 (or 3,000).',
  'Reviewing only final answers without place reasons misses the unit focus.',
  'Complete a 12-item unit check-in mixing partition, compare, number-line placement and estimate-vs-exact. Self-mark with place reasons and list two skills to practise next.'),
L('s2-mat-y3-w05-l1',AR,['bond','make ten','fact','part-part-whole'],
  'Addition facts and bonds to 20 are part–part–whole relationships you can recall or rebuild quickly (including make-ten).',
  '8 + 7: 8 + 2 = 10, then 5 more → 15. Or know 8 + 7 = 15 as a fact family with 15 − 8 = 7.',
  'Show two ways to total 14 using bonds, including one make-ten path.',
  'Examples: 9+5 (9+1=10, +4); 6+8; 10+4; 7+7.',
  'Counting from one every time when a known bond exists wastes fluency time.',
  'List all bonds to 10 and eight bonds to 20. For five of them write a make-ten path. Then time a gentle self-quiz of twelve facts and record misses to relearn.'),
L('s2-mat-y3-w05-l2',AR,['mental','jump','split','compensate'],
  'Mental addition strategies include jumping on a number line, splitting into place values and compensating (add too much, then adjust).',
  '46 + 29: compensate — 46 + 30 = 76, then subtract 1 → 75. Or split — 40+20 and 6+9 → 60+15 = 75.',
  'Add 58 + 17 mentally two different ways and show both.',
  'Jump: 58+10=68+7=75. Split: 50+10 and 8+7 → 60+15=75. (Other valid strategies OK.)',
  'Writing a formal algorithm is fine later, but this lesson targets mental strategies you can say aloud.',
  'Solve eight mental additions (two-digit + two-digit). For each, name the strategy (jump, split or compensate) and write the mini-steps. Use at least two of each strategy.'),
L('s2-mat-y3-w05-l3',AR,['column','place','regroup','sum'],
  'Adding two- and three-digit numbers aligns places and regroups ten ones as one ten (and ten tens as one hundred) when needed.',
  '278 + 146: ones 8+6=14 → write 4, carry 1 ten; tens 7+4+1=12 → write 2, carry 1 hundred; hundreds 2+1+1=4. Sum 424.',
  'Add 365 + 278 with place columns. Show any regrouping.',
  'Ones 13 → 3 carry 1; tens 6+7+1=14 → 4 carry 1; hundreds 3+2+1=6; sum 643.',
  'Adding digits without aligning places (365+278 as 3+2, 6+7, 5+8 separately into a scramble) breaks place value.',
  'Compute six additions (mix of 2-digit and 3-digit, at least four needing regrouping). Show columns and carries. Estimate one answer first and compare.'),
L('s2-mat-y3-w05-l4',AR,['fluency','facts','strategy','accuracy'],
  'Addition fluency mixes known facts and chosen mental strategies with accuracy before speed.',
  'Set: 9+6; 40+35; 27+18 (compensate or split). Reasons stay attached even in a short timed round.',
  'Solve and name strategy: 8+7; 56+30; 49+26.',
  '15 (fact/make-ten); 86 (jump/place); 75 (compensate 49+30−1 or split).',
  'Racing so fast that regrouping errors appear is not the fluency goal.',
  'Complete a 15-item mixed addition fluency set. Mark accuracy first, then note time. Re-work every miss with a named strategy.'),
L('s2-mat-y3-w06-l1',AR,['subtraction','add back','fact family','difference'],
  'Subtraction facts link to addition: if 8+7=15, then 15−8=7 and 15−7=8. Difference asks how many more or left.',
  'Fact family for 6, 9, 15: 6+9=15; 9+6=15; 15−6=9; 15−9=6.',
  'Write the fact family for 8, 5 and 13.',
  '8+5=13; 5+8=13; 13−8=5; 13−5=8.',
  'Treating subtraction as unrelated to addition makes missing facts harder to rebuild.',
  'Build eight fact families (numbers within 20). For four of them write a word sentence using "difference" or "how many left".'),
L('s2-mat-y3-w06-l2',AR,['mental','count back','jump','compensate'],
  'Mental subtraction strategies include counting/jumping back, subtracting place parts and compensating (subtract too much, then add back).',
  '83 − 29: compensate — 83 − 30 = 53, then add 1 → 54. Or jump: 83 − 20 = 63 − 9 = 54.',
  'Subtract 74 − 18 mentally two ways.',
  'Jump: 74−10=64−8=56. Compensate: 74−20=54+2=56.',
  'Counting back by ones from 74 eighteen times is possible but not an efficient mental strategy here.',
  'Solve eight mental subtractions. Label jump, place-split or compensate for each and write the mini-steps. Include at least two of each.'),
L('s2-mat-y3-w06-l3',AR,['column','regroup','borrow','difference'],
  'Written subtraction aligns places and regroups when a digit is too small: one ten becomes ten ones (and similarly across hundreds).',
  '523 − 178: ones 3<8 so regroup — tens become 1, ones 13; 13−8=5. Tens 1<7 so regroup from hundreds — hundreds 4, tens 11; 11−7=4. Hundreds 4−1=3. Difference 345.',
  'Subtract 604 − 268 showing regrouping. Watch the zero carefully.',
  'Ones: regroup through the tens/hundreds as needed → difference 336. (Working must show how zero tens are handled.)',
  'Subtracting the smaller digit from the larger regardless of place (top/bottom swap) is a common error.',
  'Compute six 3-digit subtractions with regrouping, including at least two with a zero in the minuend. Show regroup marks and estimate one answer first.'),
L('s2-mat-y3-w06-l4',AR,['fluency','subtraction','link','accuracy'],
  'Subtraction fluency uses fact links and mental or written methods with accuracy emphasised over rush.',
  'Set: 14−6; 90−40; 63−28. Each answer can be checked by adding back.',
  'Solve and add-back check: 15−9; 80−35; 72−47.',
  '6 (check 6+9=15); 45 (45+35=80); 25 (25+47=72).',
  'Skipping the add-back check hides consistent regrouping mistakes.',
  'Complete a 15-item mixed subtraction fluency set. Add-back check every miss and rewrite the corrected working.'),
L('s2-mat-y3-w07-l1',AR,['written','regroup','algorithm','sum'],
  'Written addition with regrouping is a reliable algorithm: align places, add from ones, record regrouped tens/hundreds clearly.',
  '456 + 378: ones 14 → 4 carry 1; tens 5+7+1=13 → 3 carry 1; hundreds 4+3+1=8; sum 834. Same total as a mental split check: 400+300+50+70+6+8.',
  'Add 589 + 274 in columns with regrouping, then estimate to sense-check.',
  'Sum 863; estimate about 600+300=900 or 590+270=860 — close to 863.',
  'Carrying a digit without reducing the place you regrouped from double-counts value.',
  'Complete five written additions needing regrouping and two that do not. For each, write a quick estimate beside the exact sum and comment close/not close.'),
]

VISUALS = {
 's2-mat-y3-w04-l2': [pair_visual('Estimate','387+210 → about 600','Reasonable?','exact near 600 fits','Benchmark estimate used to judge a sum.','Name the benchmarks you used.'),
  pair_visual('Not an estimate','random guess, no benchmark','Better','2,000 − 400 for 1,980 − 390','Benchmark estimate contrasted with a bare guess.','Estimates need nearby round numbers.')],
 's2-mat-y3-w04-l3': [pair_visual('1,000','10 hundreds','Also','100 tens','One thousand shown as different equal bundles.','Same quantity, different grouping.'),
  pair_visual('Also','20 groups of 50','Feel the size','draw or build the bundles','Another bundle picture for one thousand.','Investigation makes 1,000 tangible.')],
 's2-mat-y3-w04-l4': [pair_visual('Review chain','partition → compare → estimate','Example','4,070 vs 4,700','Unit skills linked in one review chain.','Reasons stay with every answer.'),
  pair_visual('Quick items','value; order; estimate','Focus','place reasons, not bare digits','Mixed review items for the place-value unit.','List skills still needing practice.')],
 's2-mat-y3-w05-l1': [pair_visual('Make ten','8+2=10, then +5','Total','15','Make-ten path for eight plus seven.','Bonds can be rebuilt, not only memorised.'),
  pair_visual('Fact family','8+7=15; 15−8=7','Part–part–whole','parts 8 and 7, whole 15','Addition fact linked inside a fact family.','Known bonds free working memory.')],
 's2-mat-y3-w05-l2': [pair_visual('Compensate','46+30=76, then −1','Split','40+20 and 6+9','Two mental strategies for forty-six plus twenty-nine.','Say the strategy aloud.'),
  pair_visual('Jump','58+10=68+7','Same sum','75','Number-line jump strategy for fifty-eight plus seventeen.','Different paths can share one total.')],
 's2-mat-y3-w05-l3': [pair_visual('Ones','8+6=14 → write 4 carry 1','Tens','7+4+1=12 → write 2 carry 1','Column addition with regrouping shown.','Align places before adding.'),
  pair_visual('Sum','278+146=424','Error','digits added without place alignment','Correct regrouped sum contrasted with misaligned digits.','Regroup ten ones as one ten.')],
 's2-mat-y3-w05-l4': [pair_visual('Facts','9+6','Place jump','40+35','Fluency mix of facts and place jumps.','Accuracy before speed.'),
  pair_visual('Strategy name','compensate / split / jump','Miss work','re-solve with a named strategy','Named strategies beside fluency items.','Re-work misses, do not only mark wrong.')],
 's2-mat-y3-w06-l1': [pair_visual('Family','6+9=15; 15−6=9','Link','subtraction undoes addition','Fact family linking addition and subtraction.','Use addition to rebuild a subtraction fact.'),
  pair_visual('Difference','how many more / left','Parts','8 and 5, whole 13','Difference language inside a fact family.','Subtraction is not a separate mystery system.')],
 's2-mat-y3-w06-l2': [pair_visual('Compensate','83−30=53, then +1','Jump','83−20=63−9','Two mental paths for eighty-three minus twenty-nine.','Adjust after a friendly jump.'),
  pair_visual('Efficient','place jumps or compensate','Slow path','back by ones eighteen times','Efficient mental methods contrasted with ones counting.','Choose a strategy you can say aloud.')],
 's2-mat-y3-w06-l3': [pair_visual('Regroup ones','13−8 when ones too small','Then tens','regroup from hundreds if needed','Written subtraction regrouping across places.','Never swap digits top-to-bottom to avoid regrouping.'),
  pair_visual('Zero case','604 − 268','Watch','zero tens need careful regroup','Subtraction through zero in the minuend.','Show every regroup mark.')],
 's2-mat-y3-w06-l4': [pair_visual('Solve','14−6; 90−40; 63−28','Add-back','use addition to confirm','Fluency items with add-back confirmation.','Add-back reveals regrouping mistakes.'),
  pair_visual('Miss','rewrite corrected working','Goal','accuracy with links to addition','Corrected miss contrasted with ignored errors.','Fluency still needs reasons.')],
 's2-mat-y3-w07-l1': [pair_visual('Algorithm','ones → tens → hundreds','Carry','record regrouped tens clearly','Written addition algorithm with clear carries.','Estimate beside the exact sum.'),
  pair_visual('Estimate first','589+274 ≈ 860','Exact','863 — close','Estimate used to judge a written sum.','Carries must not double-count value.')],
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
            # Avoid banned visual word "check" leaking via vocab into unrelated fields; keep teaching text.
            bundle = build_from_spec(base, u, VISUALS[u['seed_key']], subject='mathematics')
            atomic_json(ROOT / 'lesson-pipeline/authored' / f"{u['seed_key']}.json", bundle)
            print('Written Core maths bundle:', u['seed_key'])
    finally:
        db.close()

if __name__ == '__main__':
    create()
