#!/usr/bin/env python3
"""Year 3 Mathematics Written Core batch 04: w10-l2 through w13-l1 (12 lessons)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

MR, PF = 'MA2-MR-01', 'MA2-PF-01'

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, subject='mathematics', vocab=vocab,
                principle=principle, model=model, guided=guided, feedback=feedback,
                misconception=misconception, independent=independent)

LESSONS = [
L('s2-mat-y3-w10-l2',MR,['mental','double','near facts','place'],
  'Mental multiplication strategies use doubling, near facts and place (×10) to find products without writing a full algorithm.',
  '6×8: double 6×4=24 → 48. 7×5: half of 7×10=70 → 35. 4×20: 4×2 tens = 8 tens = 80.',
  'Find 8×6, 9×5 and 3×40 mentally with a named strategy each.',
  '48 (double 8×3 or 8×6 fact); 45 (half of 9×10); 120 (3×4 tens).',
  'Defaulting to slow skip-counting for every fact when a shorter mental path exists is inefficient.',
  'Solve twelve mental multiplications. Label double, near-fact, fives/tens or place strategy for each. Include at least three of each type you know.'),
L('s2-mat-y3-w10-l3',MR,['word problem','equal groups','array','product'],
  'Multiplication word problems describe equal groups or arrays; the factors match groups×size (or rows×columns).',
  '4 bags with 6 apples each → 4×6=24 apples. An array of 5 rows of 3 seats → 5×3=15 seats.',
  'Write a multiplication and solve: "Three shelves hold 8 books each. How many books?"',
  '3×8=24 books.',
  'Adding the numbers in the story without equal groups (3+8) answers a different question.',
  'Solve eight multiplication word problems (groups and arrays). For each, write the expression, a quick sketch and a sentence answer. Invent two new problems for a partner.'),
L('s2-mat-y3-w10-l4',MR,['fluency','facts','strategy','accuracy'],
  'Multiplication fluency mixes known tables with mental strategies, prioritising correct products and clear reasons.',
  'Set: 7×4; 8×5; 6×3; 9×10. Rebuild any blank with doubling, fives or tens.',
  'Solve: 8×4; 7×5; 6×10; 9×3 — name a backup if memory blanks.',
  '32; 35; 60; 27 — with strategies as needed.',
  'Racing into wrong products is not fluency.',
  'Complete a 20-item mixed multiplication fluency set (2,3,4,5,10 and some doubles). Re-work misses with strategy notes.'),
L('s2-mat-y3-w11-l1',MR,['sharing','grouping','division','equal'],
  'Division can mean sharing into equal groups or grouping by a given size. Both ask how many in each group or how many groups.',
  'Share 12 counters into 3 equal groups → 4 each (12÷3=4). Group 12 into groups of 4 → 3 groups (12÷4=3).',
  'Show sharing and grouping for 20÷5.',
  'Sharing: 5 equal groups of 4. Grouping: groups of 5 make 4 groups.',
  'Unequal shares are not the division structure taught here.',
  'For six division expressions, draw sharing and grouping diagrams, write both sentences and the quotient. Include one story for sharing and one for grouping.'),
L('s2-mat-y3-w11-l2',MR,['fact family','inverse','quotient','product'],
  'Division facts link to multiplication: if 4×6=24, then 24÷6=4 and 24÷4=6. Fact families hold the same three numbers.',
  'Family for 3, 7, 21: 3×7=21; 7×3=21; 21÷3=7; 21÷7=3.',
  'Write the fact family for 5, 8 and 40.',
  '5×8=40; 8×5=40; 40÷5=8; 40÷8=5.',
  'Treating division as unrelated to multiplication makes missing facts harder to rebuild.',
  'Build ten multiplication/division fact families. For four of them write a division word sentence using sharing or grouping language.'),
L('s2-mat-y3-w11-l3',MR,['remainder','whole groups','left over','context'],
  'Some divisions leave a remainder: after making as many equal whole groups as possible, leftover ones that do not make another full group.',
  '17÷5 = 3 remainder 2 because 5×3=15 and 2 are left. In a story about full cars of 5, only 3 cars fill; 2 wait.',
  'Write quotient and remainder for 26÷4 and say what the remainder means for full teams of 4.',
  '6 r2 — six full teams, 2 students without a full team.',
  'Writing a fraction answer is a later skill; this lesson records whole-group quotient and remainder.',
  'Solve eight division-with-remainder items. For each, write × check (quotient×divisor + remainder = dividend) and one context sentence about leftovers.'),
L('s2-mat-y3-w11-l4',MR,['fluency','division','link','remainder'],
  'Division fluency uses multiplication links and clear remainder recording when needed.',
  'Set: 36÷6; 45÷5; 23÷4. Rebuild using × facts; record 5 r3 for 23÷4.',
  'Solve: 28÷7; 40÷5; 19÷3 with × checks.',
  '4 (4×7=28); 8 (8×5=40); 6 r1 (6×3+1=19).',
  'Leaving remainders off when leftovers exist understates the result.',
  'Complete an eighteen-item division fluency mix (facts and remainders). ×-check every miss and rewrite.'),
L('s2-mat-y3-w12-l1',MR,['word problem','multiply','divide','choose'],
  'Multiplication and division word problems require choosing the operation from the story structure: equal groups total (×) versus sharing/grouping (÷).',
  'Equal groups unknown total → multiply. Known total shared into equal groups → divide. "8 packs of 6" is ×; "48 shared among 6" is ÷.',
  'Choose × or ÷: (a) 7 rows of 4 chairs (b) 35 stickers shared among 5 children.',
  '(a) 7×4=28 (b) 35÷5=7.',
  'Keyword hunting without structure reading often picks the wrong operation.',
  'Solve ten mixed ×/÷ word problems. For each, name structure (groups/array/sharing/grouping), write the expression and a sentence answer. Include two remainder stories.'),
L('s2-mat-y3-w12-l2',MR,['fact family','triangle','related','four facts'],
  'Fact families organise related × and ÷ facts for the same three numbers so any missing fact can be rebuilt from the others.',
  'Numbers 6, 9, 54 sit in a family triangle: 6×9=54; 9×6=54; 54÷6=9; 54÷9=6.',
  'Complete the family for 4, 8, __.',
  'Product 32; facts 4×8=32; 8×4=32; 32÷4=8; 32÷8=4.',
  'Mixing a fourth unrelated number into the family breaks the relationships.',
  'Create twelve fact-family triangles (including some with a missing factor or product). Fill all four facts and star three you want to memorise next.'),
L('s2-mat-y3-w12-l3',MR,['array','rows','columns','problem'],
  'Arrays solve both multiplication and division problems: missing total uses rows×columns; missing rows or columns uses division of the total.',
  'An array of 4 rows and 7 columns has 28. If 28 seats make 4 equal rows, each row has 28÷4=7.',
  'An orchard has 36 trees in 6 equal rows. How many in each row? Draw an array sketch.',
  '36÷6=6 per row (6×6 array).',
  'Drawing unequal rows means the array model no longer matches equal-groups multiplication/division.',
  'Solve eight array problems (four × and four ÷). Sketch each array, write the expression and explain whether you found a total or a missing dimension.'),
L('s2-mat-y3-w12-l4',MR,['review','multiply','divide','remainder'],
  'Unit review connects equal groups, arrays, ×/÷ facts, remainders and word problems.',
  'Review path: array for 5×6 → related ÷ facts → remainder item 29÷5 → word problem choosing × or ÷.',
  'Mini review: draw 3×8; write family; solve 26÷4; invent one × and one ÷ story.',
  'Array 24; family on 3,8,24; 6 r2; stories must match structures.',
  'Review answers without diagrams or fact links miss the unit focus.',
  'Complete a 12-item unit review mix (arrays, families, remainders, mixed word problems). List two skills to practise next.'),
L('s2-mat-y3-w13-l1',PF,['half','quarter','eighth','equal parts'],
  'Halves, quarters and eighths are equal parts of a whole. More equal parts make each part smaller.',
  'A sandwich cut into 2 equal parts → halves. Into 4 equal parts → quarters. Into 8 equal parts → eighths. One half equals two quarters equals four eighths of the same whole.',
  'Shade 1/2, 1/4 and 1/8 of identical rectangles and order the shaded amounts from least to greatest.',
  '1/8 < 1/4 < 1/2 when wholes are the same size.',
  'Unequal cuts are not halves/quarters/eighths even if there are 2, 4 or 8 pieces.',
  'Draw three same-sized wholes. Partition into halves, quarters and eighths. Shade and label 1/2, 3/4 and 5/8. Write two equivalence sentences using the same whole.'),
]

VISUALS = {
 's2-mat-y3-w10-l2': [pair_visual('Double','6×4=24 → 6×8=48','Tens','4×20 = 8 tens = 80','Mental paths using doubling and place.','Name the strategy you used.'),
  pair_visual('Fives','half of ×10','Example','7×5 from 7×10','Fives built from tens facts.','Short mental paths beat slow counting every time.')],
 's2-mat-y3-w10-l3': [pair_visual('Groups','4 bags of 6','Product','24','Equal-groups story matched to multiplication.','Factors match groups and group size.'),
  pair_visual('Array','5 rows of 3','Not','3+8 for shelves of 8','Array story contrasted with a wrong addition.','Structure decides the expression.')],
 's2-mat-y3-w10-l4': [pair_visual('Fluency','mixed table facts','Backup','double / fives / tens','Multiplication fluency with strategy backup.','Accuracy before speed.'),
  pair_visual('Miss','rebuild with a strategy','Then','correct product','Missed fact rebuilt, not skipped.','Reasons stay with the products.')],
 's2-mat-y3-w11-l1': [pair_visual('Sharing','12 into 3 groups → 4 each','Grouping','12 into groups of 4 → 3 groups','Sharing and grouping views of division.','Both use equal groups.'),
  pair_visual('20÷5','five groups of 4','Or','four groups of 5','Two diagrams for the same division.','Unequal shares break the structure.')],
 's2-mat-y3-w11-l2': [pair_visual('Family','3×7=21; 21÷3=7','Link','division undoes multiplication','Fact family linking × and ÷.','Rebuild a blank from the other facts.'),
  pair_visual('5, 8, 40','four related facts','Same three numbers','held together','Family for five, eight and forty.','Do not mix in an unrelated fourth number.')],
 's2-mat-y3-w11-l3': [pair_visual('17÷5','3 r2','Because','5×3=15, leftover 2','Quotient and remainder with a × proof.','Remainders are leftovers after whole groups.'),
  pair_visual('Context','full teams of 4','Leftover','students waiting','Remainder meaning in a teams story.','Record whole groups and leftovers.')],
 's2-mat-y3-w11-l4': [pair_visual('Facts','36÷6; 45÷5','Remainder','23÷4 = 5 r3','Division fluency mixing facts and remainders.','×-checks catch errors.'),
  pair_visual('Confirm','quotient×divisor + r','Miss','rewrite with leftover shown','Confirmation identity for division with remainder.','Do not drop remainders.')],
 's2-mat-y3-w12-l1': [pair_visual('Multiply','8 packs of 6','Divide','48 shared among 6','Story structures for × versus ÷.','Read structure, not only keywords.'),
  pair_visual('Rows','7×4 chairs','Share','35÷5 stickers','Array total contrasted with equal sharing.','Name the structure before the expression.')],
 's2-mat-y3-w12-l2': [pair_visual('Triangle','6, 9, 54','Four facts','× and ÷ both ways','Fact-family triangle for related facts.','Any missing fact can be rebuilt.'),
  pair_visual('Fill','4, 8, 32','Star','facts to memorise next','Completed family with memory targets.','Keep the three numbers consistent.')],
 's2-mat-y3-w12-l3': [pair_visual('Total','4×7 array = 28','Missing size','28÷4 = 7 per row','Array used for × and ÷ questions.','Equal rows keep the array valid.'),
  pair_visual('Orchard','36 trees / 6 rows','Each row','6 trees','Division finding a missing array dimension.','Sketch before computing.')],
 's2-mat-y3-w12-l4': [pair_visual('Review path','array → family → remainder','Then','choose × or ÷ story','Unit review linking representations.','Diagrams and fact links matter.'),
  pair_visual('Mini set','3×8 family; 26÷4','Goals','two next skills','Compact review items for the ×/÷ unit.','List what to practise next.')],
 's2-mat-y3-w13-l1': [pair_visual('Half','2 equal parts','Quarter','4 equal parts','Equal-part fractions of the same whole.','More equal parts make each part smaller.'),
  pair_visual('Eighth','8 equal parts','Order','1/8 < 1/4 < 1/2','Eighths compared with quarters and halves.','Unequal cuts are not these fractions.')],
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
