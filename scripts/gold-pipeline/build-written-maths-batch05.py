#!/usr/bin/env python3
"""Year 3 Mathematics Written Core batch 05: fractions w13-l2 through w16-l1 (12 lessons)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

PF = 'MA2-PF-01'

def L(seed, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=PF, subject='mathematics', vocab=vocab,
                principle=principle, model=model, guided=guided, feedback=feedback,
                misconception=misconception, independent=independent)

LESSONS = [
L('s2-mat-y3-w13-l2',['third','fifth','unit fraction','equal parts'],
  'Unit fractions such as 1/3 and 1/5 name one equal part of a whole divided into that many equal parts.',
  'A whole split into 3 equal parts → each part is one third (1/3). Into 5 equal parts → each is one fifth (1/5). The denominator tells how many equal parts.',
  'Name the unit fraction for wholes split into 3, 5 and 6 equal parts. Which unit fraction is smallest if wholes are the same size?',
  '1/3; 1/5; 1/6. Smallest is 1/6 because more equal parts make each part smaller.',
  'Labelling unequal pieces as thirds or fifths is incorrect.',
  'Draw same-sized wholes for thirds, fifths and sixths. Shade and label 1/3, 1/5 and 1/6. Order them and write why the order works.'),
L('s2-mat-y3-w13-l3',['collection','share','fraction of','equal groups'],
  'A fraction of a collection means sharing the set into equal groups and taking the named number of those groups.',
  '1/4 of 12 counters: share into 4 equal groups of 3; one group is 3, so 1/4 of 12 is 3. 3/4 of 12 is 9.',
  'Find 1/3 of 15 and 2/5 of 20. Show the equal groups.',
  '1/3 of 15 = 5; 2/5 of 20 = 8.',
  'Taking a random handful without equal shares is not a fraction of a collection.',
  'Solve ten fraction-of-a-collection problems (unit and non-unit). Draw equal groups for five of them and write a sentence answer for each.'),
L('s2-mat-y3-w13-l4',['name','numerator','denominator','shade'],
  'Fluency in naming fractions means reading numerator (parts counted) and denominator (equal parts in the whole) and matching shaded diagrams.',
  'A circle in 8 equal parts with 3 shaded is 3/8. Numerator 3, denominator 8.',
  'Name: (a) 5 equal parts, 2 shaded (b) 6 equal parts, 5 shaded.',
  '2/5; 5/6.',
  'Swapping numerator and denominator names the wrong fraction.',
  'Create a 16-card matching set: diagrams ↔ fraction names (halves to eighths, thirds, fifths). Self-quiz and list any swaps you almost made.'),
L('s2-mat-y3-w14-l1',['number line','partition','position','unit'],
  'Fractions on a number line sit at equal interval marks between 0 and 1 (or beyond for improper later). Position matches equal partitions of the segment.',
  'On 0 to 1 divided into 4 equal intervals, marks are 0, 1/4, 2/4, 3/4, 1. 3/4 is three jumps of one quarter from 0.',
  'Place 1/3 and 2/3 on a 0–1 line partitioned into thirds. Which is closer to 1?',
  'Marks at one-third and two-thirds; 2/3 is closer to 1.',
  'Placing 1/3 near 3 because the numerator is 1 and denominator 3 ignores equal spacing.',
  'Draw four 0–1 number lines (halves, thirds, quarters, fifths). Place at least two fractions on each and write one comparison using the lines.'),
L('s2-mat-y3-w14-l2',['compare','unit fraction','same whole','denominator'],
  'For unit fractions of the same whole, the larger denominator means a smaller part. Compare by thinking about equal-part size.',
  '1/2 > 1/5 on the same whole because halves are larger pieces than fifths. 1/8 < 1/3 for the same reason.',
  'Order least to greatest: 1/2, 1/8, 1/3 (same wholes).',
  '1/8; 1/3; 1/2.',
  'Comparing numerators only (thinking 1/8 > 1/3 because 8>3) reverses the truth for unit fractions.',
  'Compare twelve pairs of unit fractions with diagrams or number lines. Write <, > or = and a one-line reason naming part size.'),
L('s2-mat-y3-w14-l3',['equivalent','same amount','model','rename'],
  'Equivalent fractions name the same amount of the same whole using different equal-part sizes (for example 1/2 = 2/4 = 4/8).',
  'A bar shaded 1/2 matches a bar of the same length shaded 2/4 or 4/8. The shaded length is the same; the partitions differ.',
  'Show with a model that 1/3 = 2/6. Shade both.',
  'A thirds bar with one third shaded matches a sixths bar with two sixths shaded on the same length.',
  'Changing only the denominator without matching shaded amount does not create an equivalent fraction.',
  'Build eight equivalent pairs using area or length models (include halves/quarters/eighths and thirds/sixths). Write the equality and a sentence about equal shaded amounts.'),
L('s2-mat-y3-w14-l4',['compare','equivalent','fluency','reason'],
  'Fraction comparison fluency uses same-whole diagrams, number lines and equivalence to decide order accurately.',
  'Compare 2/4 and 1/2 (equivalent), then 3/8 and 1/2 (3/8 < 1/2). Reasons name models or benchmarks.',
  'Compare: 3/6 vs 1/2; 2/5 vs 1/2; 3/4 vs 5/8.',
  'Equal; less; greater — with brief reasons.',
  'Comparing across different-sized wholes without adjusting invalidates the comparison.',
  'Complete a 15-item compare/equivalent fluency set. Require a reason or tiny sketch for every answer. Re-work misses.'),
L('s2-mat-y3-w15-l1',['add','subtract','same denominator','numerator'],
  'Adding or subtracting fractions with the same denominator means joining or removing equal-sized parts; the denominator stays the same while numerators combine.',
  '2/5 + 1/5 = 3/5. 3/4 − 1/4 = 2/4 (which equals 1/2). Denominator 5 (or 4) names the part size.',
  'Compute 3/8 + 2/8 and 5/6 − 1/6. Simplify if you know an equivalent.',
  '5/8; 4/6 (=2/3 if recognised).',
  'Adding denominators (2/5+1/5=3/10) invents a new part size incorrectly.',
  'Solve twelve +/− problems with common denominators. Show a bar or number-line sketch for four of them. Simplify two answers using equivalence.'),
L('s2-mat-y3-w15-l2',['word problem','fraction','of','join'],
  'Fraction word problems may ask for a fraction of a collection or for joining/removing equal parts of the same whole.',
  '"Mia ate 2/8 of a pizza and later 3/8 of the same pizza" → 5/8 eaten. "1/3 of 12 apples" → 4 apples.',
  'Solve: (a) 1/4 of 16 stickers (b) 3/5 + 1/5 of a ribbon (same whole).',
  '(a) 4 stickers (b) 4/5 of the ribbon.',
  'Mixing collection problems with part-of-whole addition without noticing the structure causes wrong operations.',
  'Solve eight fraction word problems (four of-a-collection, four same-denominator +/−). Label the structure and show working.'),
L('s2-mat-y3-w15-l3',['real life','measure','share','fair'],
  'Fractions appear in real life when sharing fairly, reading measures or describing parts of recipes and time.',
  'Sharing a sandwich in half, pouring about 1/4 cup, or saying "we are 3/4 of the way through the lesson" all use equal-part ideas.',
  'Give one real-life example each for 1/2, 1/4 and 1/3 and say what the whole is.',
  'Examples must name the whole (pizza, cup, journey) and the equal-part meaning.',
  'Calling any small piece "a fraction" without equal parts is too vague.',
  'Collect or invent nine real-life fraction situations. For each, name the whole, the fraction and whether it is a share, a measure or a part of a length/time. Sketch three.'),
L('s2-mat-y3-w15-l4',['fluency','name','compare','compute'],
  'Fraction fluency mixes naming, comparing, equivalence and same-denominator +/− with diagrams when unsure.',
  'Set: name a shaded 3/5; compare 1/6 and 1/3; compute 2/7+3/7. Use a quick sketch if memory blanks.',
  'Do: shade/name 4/8; compare 2/4 and 1/2; compute 5/6−2/6.',
  '4/8 (or 1/2); equal; 3/6 (or 1/2).',
  'Skipping the same-whole condition when comparing leads to false orders.',
  'Complete an eighteen-item mixed fraction fluency sheet. Re-work misses with a diagram and a written reason.'),
L('s2-mat-y3-w16-l1',['mixed practice','unit','review','reason'],
  'Mixed fraction practice revisits equal parts, collections, number lines, comparison, equivalence and same-denominator operations in one set.',
  'A mixed set might ask: shade 2/3; find 1/5 of 20; place 3/4; compare 1/8 and 1/2; add 1/6+2/6 — each with a short reason.',
  'Quick mix: 1/4 of 24; place 2/5 on a fifths line; 3/8+2/8; order 1/2, 1/5, 1/10.',
  '6; mark at two-fifths; 5/8; order 1/10, 1/5, 1/2.',
  'Answering without naming the whole or the part size leaves the reasoning incomplete.',
  'Complete a 16-item mixed fraction practice covering all unit skills. Attach a diagram or reason to every item. List two strengths and two next goals.'),
]

VISUALS = {
 's2-mat-y3-w13-l2': [pair_visual('1/3','3 equal parts','1/5','5 equal parts','Unit fractions from equal partitions.','Denominator counts equal parts in the whole.'),
  pair_visual('Order','1/6 < 1/5 < 1/3','Same wholes','more parts → smaller piece','Unit fractions ordered by part size.','Unequal pieces are not unit fractions.')],
 's2-mat-y3-w13-l3': [pair_visual('1/4 of 12','4 groups of 3','Take one','3 counters','Fraction of a collection via equal groups.','Share equally before taking parts.'),
  pair_visual('2/5 of 20','5 groups of 4','Take two','8 counters','Non-unit fraction of a set.','Random handfuls are not fair shares.')],
 's2-mat-y3-w13-l4': [pair_visual('Shaded','3 of 8 parts','Name','3/8','Diagram matched to fraction name.','Numerator counts shaded equal parts.'),
  pair_visual('2/5','2 shaded of 5','5/6','5 shaded of 6','Named fractions from equal-part diagrams.','Do not swap numerator and denominator.')],
 's2-mat-y3-w14-l1': [pair_visual('0 to 1','four equal jumps','Marks','1/4; 2/4; 3/4; 1','Fraction marks on a partitioned number line.','Equal intervals place the fractions.'),
  pair_visual('Thirds','1/3 and 2/3','Near 1','2/3 closer','Thirds placed between 0 and 1.','Numerator alone does not set the position.')],
 's2-mat-y3-w14-l2': [pair_visual('Larger part','1/2','Smaller part','1/5','Unit fraction comparison on the same whole.','Larger denominator → smaller unit part.'),
  pair_visual('Order','1/8; 1/3; 1/2','Trap','thinking 1/8 > 1/3','Correct unit order contrasted with digit-size trap.','Compare part size, not digit size.')],
 's2-mat-y3-w14-l3': [pair_visual('1/2','same shaded length','2/4','same whole bar','Equivalent fractions with matching shaded length.','Same amount, different partitions.'),
  pair_visual('1/3','one third shaded','2/6','two sixths shaded','Thirds and sixths showing equivalence.','Denominators alone do not prove equivalence.')],
 's2-mat-y3-w14-l4': [pair_visual('Equal','2/4 and 1/2','Less','3/8 < 1/2','Comparison using equivalence and benchmarks.','Keep wholes the same size.'),
  pair_visual('Fluency','compare + equivalent','Reason','sketch or benchmark','Fluency items that still need reasons.','Different wholes invalidate a comparison.')],
 's2-mat-y3-w15-l1': [pair_visual('Add','2/5 + 1/5 = 3/5','Denominator','stays 5','Same-denominator addition of equal parts.','Join numerators; keep the part size.'),
  pair_visual('Subtract','3/4 − 1/4 = 2/4','Error','adding denominators','Correct subtraction contrasted with denominator-add error.','Part size does not change when joining like parts.')],
 's2-mat-y3-w15-l2': [pair_visual('Of a set','1/4 of 16 = 4','Of a whole','2/8 + 3/8 = 5/8','Collection fraction contrasted with part-of-whole join.','Structure chooses the method.'),
  pair_visual('Ribbon','3/5 + 1/5','Result','4/5','Same-whole fraction addition in a story.','Name the whole in the answer.')],
 's2-mat-y3-w15-l3': [pair_visual('Share','half a sandwich','Measure','about 1/4 cup','Real-life fraction uses naming the whole.','Equal parts make the fraction meaningful.'),
  pair_visual('Time/length','3/4 of the lesson','Whole named','the lesson','Part of a journey or lesson as a fraction.','Vague pieces without equal parts are not enough.')],
 's2-mat-y3-w15-l4': [pair_visual('Name','3/5 shaded','Compute','2/7 + 3/7','Mixed fluency naming and computing.','Sketch when unsure.'),
  pair_visual('Compare','2/4 and 1/2','Same whole','required','Comparison fluency with equivalence.','Re-work misses with diagrams.')],
 's2-mat-y3-w16-l1': [pair_visual('Mixed set','shade; of; place; compare; add','Reason','attached to each item','Mixed fraction practice covering the unit.','Name the whole and the part size.'),
  pair_visual('Quick mix','1/4 of 24; 3/8+2/8','Order','1/10; 1/5; 1/2','Compact mixed items with ordered unit fractions.','List strengths and next goals.')],
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
