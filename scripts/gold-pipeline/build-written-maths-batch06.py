#!/usr/bin/env python3
"""Year 3 Mathematics Written Core batch 06: w16-l2 through w19-l1 (12 lessons)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

PF = 'MA2-PF-01'
# Pattern/algebra and money codes from repository catalogue — content-point review pending
AR = 'MA2-AR-01'
RN = 'MA2-RN-01'

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, subject='mathematics', vocab=vocab,
                principle=principle, model=model, guided=guided, feedback=feedback,
                misconception=misconception, independent=independent)

LESSONS = [
L('s2-mat-y3-w16-l2',PF,['shape','set','shade','equal parts'],
  'Fractions of shapes and sets both need equal parts: shade equal regions of a shape, or take equal groups from a set.',
  'Shade 3/4 of a rectangle split into 4 equal parts. For a set: 3/4 of 8 counters is 6 after sharing into 4 groups of 2.',
  'Show 2/3 of a shape and 2/3 of 12 counters.',
  'Shape: 2 of 3 equal regions shaded. Set: 12÷3=4, take 2 groups → 8.',
  'Shading unequal regions that merely look like "most of" the shape is not a named fraction.',
  'Complete eight tasks: four shape-shading and four set fractions (unit and non-unit). Label each and write one sentence comparing a shape example with a set example.'),
L('s2-mat-y3-w16-l3',PF,['share','fair','remainder','investigate'],
  'Sharing fairly means making equal shares. Sometimes a remainder means some items cannot make another full equal share without cutting.',
  'Share 14 stickers among 4 people: each gets 3, with 2 left (14÷4 = 3 r2). Fair whole shares stop at 3 each unless items can be split further.',
  'Investigate: share 20 counters among 3, then among 5. Record equal share and leftover each time.',
  'Among 3: 6 each r2. Among 5: 4 each r0.',
  'Giving some people more "to finish the pile" without agreement breaks fairness.',
  'Run four sharing investigations with different totals and group sizes. Record quotient, remainder and a fair-share sentence. Design one investigation where cutting the remainder into fractional shares would be needed.'),
L('s2-mat-y3-w16-l4',PF,['review','compare','of','equivalent'],
  'Fraction unit review connects equal parts, collections, number lines, comparison, equivalence and same-denominator operations.',
  'Review path: shade 2/5 → 1/4 of 16 → place 3/4 → compare 1/3 and 1/6 → add 2/7+3/7.',
  'Mini review: 3/8 of a shape; 2/5 of 20; compare 2/4 and 1/2; 5/6−1/6.',
  'Three-eighths shaded; 8; equal; 4/6 (or 2/3).',
  'Review answers without naming the whole miss the unit focus.',
  'Complete a 12-item fraction unit review. Attach a diagram or reason to each. List two strengths and two next goals.'),
L('s2-mat-y3-w17-l1',AR,['repeating','growing','term','rule'],
  'Repeating patterns cycle the same block; growing patterns change by a rule each term (for example add 2 shapes each time).',
  'Repeating: red-blue-red-blue. Growing: 1 square, then 3, then 5 (add 2 squares each term).',
  'Classify and continue one more term: (a) ▲●▲●▲ (b) 2, 4, 6, 8 sticks in a growing ladder.',
  '(a) repeating — next ● (b) growing — next 10 sticks if +2 each time.',
  'Calling every pattern repeating when terms grow by a rule misclassifies growing patterns.',
  'Create three repeating and three growing patterns (shapes or numbers). State the unit/rule, write the next two terms and swap with a partner to continue theirs.'),
L('s2-mat-y3-w17-l2',AR,['number pattern','rule','missing term','position'],
  'Number patterns follow a rule. Find how terms change, then use the rule for missing or later terms.',
  'Pattern 15, 25, 35, 45 adds 10. The 6th term is 65 if counting from 15 as term 1.',
  'Find the rule and missing term: 120, 110, __, 90.',
  'Subtract 10; missing 100.',
  'Using only the first digit and ignoring the constant difference invents false terms.',
  'For eight number patterns (mix +/− and ×2-style growth where appropriate), state the rule, fill one missing term and give the next two terms.'),
L('s2-mat-y3-w17-l3',AR,['equals','balance','same value','number sentence'],
  'The equals sign means both sides have the same value, not "write the answer after this". Number sentences can be true or false.',
  '7+5=12 is true because both sides equal 12. 8+4=10+3 is also true (both 12). 9+2=12 is false.',
  'Mark true or false and fix false ones: (a) 6+7=13 (b) 15−4=10+2 (c) 9+5=12.',
  '(a) true (b) true (11=11) (c) false — e.g. 9+5=14 or 9+3=12.',
  'Thinking equals only means "the box on the right" blocks understanding of balance.',
  'Write twelve number sentences: six true, six false. For each false sentence write a true repair. Include four with operations on both sides.'),
L('s2-mat-y3-w17-l4',AR,['missing number','inverse','fluency','balance'],
  'Finding missing numbers uses inverse operations and the balance meaning of equals.',
  '□+8=20 → □=12 because 20−8=12. 9×□=36 → □=4 because 36÷9=4.',
  'Find □: (a) □−15=40 (b) 6×□=42 (c) 25=□+9.',
  '(a) 55 (b) 7 (c) 16.',
  'Guessing without using the inverse often fails on larger values.',
  'Solve eighteen missing-number sentences (mix +/−/×/÷). Show the inverse step for each. Self-mark and rewrite misses.'),
L('s2-mat-y3-w18-l1',AR,['balance','both sides','equals','true'],
  'Balancing number sentences means adjusting values so both sides remain equal, like a pan balance.',
  'If 10+4=8+□, then □=6 because left is 14 so right must be 14. Adding the same amount to both sides keeps balance.',
  'Balance: 12+9=15+□ and 20−□=8+5.',
  '□=6; □=7 (because 20−7=13 and 8+5=13).',
  'Changing only one side without keeping equality tips the balance.',
  'Solve ten balance sentences with operations on both sides. For four of them draw a simple balance sketch labelling both sides.'),
L('s2-mat-y3-w18-l2',AR,['unknown','inverse','represent','solve'],
  'Unknown numbers can be shown with a box or letter. Solve by using inverse operations or related facts while keeping equality.',
  'n+17=45 → n=28. Or 8×n=56 → n=7. Check by substituting back.',
  'Find n and check: (a) n−23=41 (b) 9×n=72.',
  '(a) n=64 check 64−23=41 (b) n=8 check 9×8=72.',
  'Leaving the check out allows arithmetic slips to pass unnoticed.',
  'Solve twelve unknown-number problems. Substitute to check each. Write two word stories that match two of your equations.'),
L('s2-mat-y3-w18-l3',AR,['table','input','output','rule'],
  'Patterns in tables show an input–output rule. Find the rule from pairs, then complete missing outputs or inputs.',
  'Input 3→11, 4→14, 5→17 suggests ×3 then +2 (or +8,+10,+12 growing). Test: 6→20 fits ×3+2.',
  'Complete: in 2,4,6 → out 9,15,21. What is the rule? What is out for 8?',
  'Rule ×3 then +3 (or ×3+3); out for 8 is 27.',
  'Fitting a rule to two pairs without testing a third can invent a false rule.',
  'Build four input–output tables with clear rules. Leave blanks for a partner. Solve four partner tables and write each rule in words.'),
L('s2-mat-y3-w18-l4',AR,['pattern','fluency','rule','continue'],
  'Pattern fluency means quickly stating rules, continuing terms and filling tables with accuracy.',
  'Set: continue 40, 55, 70, __; rule for table in 1,2,3 out 6,11,16; missing number in 12+□=12+9−4.',
  'Do: rule and next two for 5,10,20,40; missing out when in=7 if rule is ×2+1.',
  'Growing ×2; next 80,160. Out=15 for in=7.',
  'Speed that skips testing the rule creates wrong continuations.',
  'Complete a 16-item pattern fluency mix (repeating, growing, tables, balance). Re-work misses with the rule written out.'),
L('s2-mat-y3-w19-l1',RN,['coin','note','dollar','cent'],
  'Australian coins and notes have dollar or cent values. Count money by grouping same values and converting 100 cents to 1 dollar.',
  'Three $1 coins and two 50c coins total $3 + $1 = $4 (because 50c+50c=$1). A $5 note and a $2 coin total $7.',
  'Total: two $2 coins, one $1, three 20c. Write dollars and cents.',
  '$2+$2+$1+60c = $5.60.',
  'Adding coin counts without using their values (counting "five coins" as $5) ignores denominations.',
  'Make eight money collections with coins/notes (draw or list). Find each total in dollars and cents. Include at least two that require regrouping cents into dollars.'),
]

VISUALS = {
 's2-mat-y3-w16-l2': [pair_visual('Shape','3/4 of equal regions','Set','3/4 of 8 = 6','Fraction of a shape beside a fraction of a set.','Equal parts required in both cases.'),
  pair_visual('2/3 shape','2 of 3 regions','2/3 of 12','8 counters','Same fraction, two representations.','Unequal regions do not name the fraction.')],
 's2-mat-y3-w16-l3': [pair_visual('Share 14','4 people → 3 each','Leftover','2 stickers','Fair whole shares with a remainder.','Fairness means equal shares.'),
  pair_visual('20 among 5','4 each, none left','20 among 3','6 each, r2','Investigation outcomes for different group sizes.','Remainders need a clear fair-share sentence.')],
 's2-mat-y3-w16-l4': [pair_visual('Review path','shade → of → place','Then','compare → add','Fraction unit skills linked in one path.','Name the whole every time.'),
  pair_visual('Mini set','3/8; 2/5 of 20','Equal','2/4 and 1/2','Compact review items for the fraction unit.','List strengths and next goals.')],
 's2-mat-y3-w17-l1': [pair_visual('Repeating','red-blue-red-blue','Growing','1, 3, 5 squares (+2)','Repeating cycle contrasted with growing rule.','Name whether the block repeats or grows.'),
  pair_visual('Continue','▲●▲●▲ → ●','Ladder','2,4,6,8 → 10','Next terms for each pattern type.','Growing is not the same as repeating.')],
 's2-mat-y3-w17-l2': [pair_visual('Rule','add 10','Terms','15, 25, 35, 45','Number pattern with a constant difference.','Find how terms change first.'),
  pair_visual('Missing','120, 110, __, 90','Fill','100 (subtract 10)','Missing term from a subtract-ten rule.','Test the rule on every step shown.')],
 's2-mat-y3-w17-l3': [pair_visual('Equals','same value both sides','True','8+4 = 10+2','Balance meaning of the equals sign.','Equals does not only mean "answer on the right".'),
  pair_visual('False','9+5 = 12','Repair','9+5 = 14','False sentence repaired to keep equality.','Both sides must match.')],
 's2-mat-y3-w17-l4': [pair_visual('Missing','□+8=20','Inverse','20−8=12','Missing addend found with subtraction.','Use the inverse to find unknowns.'),
  pair_visual('Also','6×□=42','□','7','Missing factor from a multiplication.','Guessing without inverse is unreliable.')],
 's2-mat-y3-w18-l1': [pair_visual('Balance','10+4 = 8+□','□','6','Pan-balance view of a number sentence.','Both sides must stay equal.'),
  pair_visual('Also','20−□ = 8+5','□','7','Unknown found while keeping both sides equal.','Changing one side alone tips the balance.')],
 's2-mat-y3-w18-l2': [pair_visual('Unknown','n+17=45','n','28','Letter unknown solved with an inverse.','Substitute back to confirm.'),
  pair_visual('Check','9×n=72 → n=8','Story','match the equation','Checked solution ready for a word story.','The check catches arithmetic slips.')],
 's2-mat-y3-w18-l3': [pair_visual('Table','in 3,4,5','Out','11,14,17','Input–output pairs revealing a rule.','Test the rule on a new input.'),
  pair_visual('Rule','×3 then +2','in 6','out 20','Rule applied to complete a table.','Two pairs alone can invent a false rule.')],
 's2-mat-y3-w18-l4': [pair_visual('Continue','40, 55, 70','Next','85 (+15)','Fluency continuation of a growing pattern.','Write the rule before racing ahead.'),
  pair_visual('Table fluency','×2+1 for in=7','Out','15','Quick table item with a named rule.','Re-work misses with the rule written out.')],
 's2-mat-y3-w19-l1': [pair_visual('Coins','three $1; two 50c','Total','$4','Australian coins combined to a dollar total.','Use values, not only coin counts.'),
  pair_visual('Mix','two $2; one $1; three 20c','Total','$5.60','Notes and coins with cents regrouped.','100 cents make 1 dollar.')],
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
