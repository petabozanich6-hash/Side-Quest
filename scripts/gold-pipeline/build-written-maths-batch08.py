#!/usr/bin/env python3
"""Year 3 Mathematics Written Core batch 08: length/perimeter w22-l2 through w25-l1 (12)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

GM = 'MA2-GM-01'

def L(seed, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=GM, subject='mathematics', vocab=vocab,
                principle=principle, model=model, guided=guided, feedback=feedback,
                misconception=misconception, independent=independent)

LESSONS = [
L('s2-mat-y3-w22-l2',['convert','metre','centimetre','equivalent'],
  'Converting between metres and centimetres uses 1 m = 100 cm. Multiply metres by 100 to get centimetres; group hundreds of centimetres into metres.',
  '3 m = 300 cm. 450 cm = 4 m 50 cm. 2 m 25 cm = 225 cm.',
  'Convert: 5 m; 780 cm; 1 m 8 cm to centimetres only.',
  '500 cm; 7 m 80 cm; 108 cm.',
  'Treating 1 m as 10 cm (confusing with mm↔cm) breaks conversions.',
  'Complete sixteen conversions both ways (m↔cm), including mixed metres-and-centimetres. Self-mark with the 100 rule written at the top.'),
L('s2-mat-y3-w22-l3',['length problem','add','difference','unit'],
  'Length problems combine measures using addition, subtraction or comparison while keeping units consistent.',
  'A ribbon 120 cm and another 85 cm total 205 cm = 2 m 5 cm. Difference 120−85=35 cm.',
  'A path is 3 m long and extended by 150 cm. New length in metres and centimetres?',
  '3 m + 1 m 50 cm = 4 m 50 cm (convert 150 cm first).',
  'Adding 3 + 150 without converting units invents a nonsense length.',
  'Solve eight length word problems (totals, differences, comparisons). Convert to one unit before calculating. Write a sentence answer with units.'),
L('s2-mat-y3-w22-l4',['fluency','convert','compare','cm/m'],
  'Length conversion fluency means quick, accurate m↔cm work and same-unit comparisons.',
  'Set: 6 m=__cm; 905 cm=__m__cm; longer of 2 m 40 cm and 250 cm?',
  'Convert and compare: 4 m; 330 cm; 1 m 90 cm vs 180 cm.',
  '400 cm; 3 m 30 cm; 1 m 90 cm is longer (190>180).',
  'Skipping the unit label after converting leads to mix-ups later.',
  'Complete an eighteen-item conversion/compare fluency set. Re-work misses showing the ×100 or ÷100 step.'),
L('s2-mat-y3-w23-l1',['perimeter','around','boundary','distance'],
  'Perimeter is the distance around the outside of a shape — the total length of its boundary.',
  'Walk around a rectangular book cover: length + width + length + width. That total distance is the perimeter.',
  'Which describes perimeter: (a) space inside a shape (b) distance around a shape? Give a playground example.',
  '(b). Example: fencing around an oval measures perimeter.',
  'Calling the space inside "perimeter" confuses it with area.',
  'Write a kid definition of perimeter with two real-life examples and one non-example (area). Measure the perimeter of a book cover with string or a ruler.'),
L('s2-mat-y3-w23-l2',['perimeter','add sides','rectangle','polygon'],
  'Find perimeter by adding the lengths of all outer sides. For a rectangle, opposite sides are equal so P=2×(length+width) also works.',
  'Rectangle 6 cm by 4 cm: 6+4+6+4=20 cm, or 2×(6+4)=20 cm. Triangle sides 5, 6, 7 → perimeter 18.',
  'Find perimeter: square side 9 cm; rectangle 12 cm by 5 cm.',
  '36 cm; 34 cm.',
  'Adding only length and width once for a rectangle undercounts the boundary.',
  'Find perimeters of ten polygons (include rectangles, squares, triangles, irregular). Show side addition. Mark two where a shortcut formula applies.'),
L('s2-mat-y3-w23-l3',['perimeter problem','missing side','fence','border'],
  'Perimeter problems may ask for total fencing, a missing side length, or whether a border length is enough.',
  'A rectangular garden 8 m by 3 m needs P=2×(8+3)=22 m of fencing. If a rectangle has perimeter 30 m and three sides 10 m, 7 m and 10 m, the missing side is 3 m.',
  'A rectangle has perimeter 26 cm and length 8 cm. Find the width.',
  '2×(8+w)=26 → 8+w=13 → w=5 cm.',
  'Using area thinking (length×width) when the story asks for fencing solves the wrong quantity.',
  'Solve eight perimeter word problems (fencing, borders, missing sides). Draw a sketch for each and label known sides.'),
L('s2-mat-y3-w23-l4',['fluency','perimeter','sides','unit'],
  'Perimeter fluency adds side lengths accurately and includes units in every answer.',
  'Set: square 7 cm; rectangle 9 cm×6 cm; irregular 3+5+4+6 cm.',
  'Find P: square 11 cm; rectangle 15 cm by 4 cm; triangle 8+9+10.',
  '44 cm; 38 cm; 27 cm.',
  'Omitting units or skipping a side produces incomplete perimeters.',
  'Complete a sixteen-item perimeter fluency set. Circle any item where you used a rectangle shortcut and show why it matches side addition.'),
L('s2-mat-y3-w24-l1',['measure around','string','curve','estimate'],
  'Measuring around objects (including curved ones) can use string then a ruler, or a tape, with careful zero alignment.',
  'Wrap string around a bottle lid, mark the meeting point, straighten along a ruler to read the perimeter-like loop length.',
  'Estimate then measure around a jar lid or cup base with string. Record both.',
  'Answers vary; difference between estimate and measure should be noted.',
  'Stretching the string while measuring lengthens the reading unfairly.',
  'Measure around six objects (at least two curved). Record estimate, measure and method. Write one tip for accurate string measuring.'),
L('s2-mat-y3-w24-l2',['investigation','grounds','plan','record'],
  'A length investigation of school/home grounds plans what to measure, chooses units, records results and compares findings.',
  'Plan: measure path width in cm, garden length in m, step distance roughly in m. Record in a table and compare which is longest.',
  'Design measures for: a doorway height; a table length; a short outdoor path. Choose units.',
  'Height/path often m or cm; table often cm; justify each choice.',
  'Measuring without a recording plan loses which number belongs to which place.',
  'Complete a grounds/home length investigation: at least five measures, unit choices, a results table and three comparison sentences. Note one measurement challenge.'),
L('s2-mat-y3-w24-l3',['real life','measure','problem','unit'],
  'Real-life measurement problems use length to decide fit, materials needed or comparisons in everyday contexts.',
  'Will a 90 cm shelf fit a 1.2 m space? Yes, with 30 cm spare. Ribbon needed for a 40 cm gift wrap loop ≈ perimeter of the face.',
  'A poster is 60 cm wide; the wall gap is 0.5 m. Does it fit? Show conversion.',
  '0.5 m = 50 cm; 60>50 so it does not fit.',
  'Mixing m and cm in one calculation without converting causes wrong fit decisions.',
  'Solve eight real-life length problems (fit, materials, compare). Convert units as needed and write decision sentences.'),
L('s2-mat-y3-w24-l4',['review','convert','perimeter','measure'],
  'Length unit review connects unit choice, conversion, measuring skills, perimeter and real-life decisions.',
  'Review path: choose unit → convert 350 cm → measure a side → find rectangle perimeter → decide if fencing is enough.',
  'Mini review: convert 2 m 40 cm; P of 10 cm×7 cm rectangle; fit 180 cm into 2 m space?',
  '240 cm; P=34 cm; yes (20 cm spare).',
  'Review answers without units are incomplete for this unit.',
  'Complete a 12-item length unit review. Show working and units. List two next goals.'),
L('s2-mat-y3-w25-l1',['area','cover','square units','inside'],
  'Area is the amount of surface a shape covers, measured in square units — not the distance around (perimeter).',
  'Cover a rectangle with 1 cm squares: 3 rows of 4 squares → area 12 square centimetres. Perimeter would be the walk around outside.',
  'Which is area: (a) fencing around a garden (b) grass covering the garden? Estimate area of a book cover in square sticky notes.',
  '(b). Estimate equals how many notes cover the cover without big gaps.',
  'Counting only around the edge when asked for area confuses perimeter with area.',
  'Write a definition of area with two examples and one perimeter non-example. Cover three rectangles with square grids (draw or tiles) and record areas in square units.'),
]

VISUALS = {
 's2-mat-y3-w22-l2': [pair_visual('1 m','100 cm','3 m','300 cm','Metres converted to centimetres.','Multiply metres by 100.'),
  pair_visual('450 cm','4 m 50 cm','225 cm','2 m 25 cm','Centimetres grouped into metres.','Do not use 10 instead of 100.')],
 's2-mat-y3-w22-l3': [pair_visual('Total','120 cm + 85 cm','Result','205 cm = 2 m 5 cm','Length total with unit conversion.','Convert before adding different unit forms.'),
  pair_visual('Extend','3 m + 150 cm','New','4 m 50 cm','Path extension problem with consistent units.','3+150 without converting is invalid.')],
 's2-mat-y3-w22-l4': [pair_visual('Fluency','6 m = 600 cm','905 cm','9 m 5 cm','Conversion fluency items.','Keep unit labels after converting.'),
  pair_visual('Compare','2 m 40 cm vs 250 cm','Longer','250 cm','Same-unit length comparison.','Show ×100 or ÷100 on misses.')],
 's2-mat-y3-w23-l1': [pair_visual('Perimeter','distance around','Not','space inside','Perimeter defined against area confusion.','Boundary length is perimeter.'),
  pair_visual('Example','fence around oval','Measure','walk the outside','Real-life perimeter example.','Inside covering is area, not perimeter.')],
 's2-mat-y3-w23-l2': [pair_visual('Rectangle','6+4+6+4','Or','2×(6+4)=20','Perimeter of a rectangle two ways.','Add every outer side.'),
  pair_visual('Triangle','5+6+7=18','Square','4×9=36','Perimeters of other polygons.','Skipping a side undercounts.')],
 's2-mat-y3-w23-l3': [pair_visual('Fence','8 m by 3 m','P','22 m','Fencing story using perimeter.','Fencing asks for distance around.'),
  pair_visual('Missing width','P=26; length 8','Width','5 cm','Missing side from perimeter.','Area formulas answer a different question.')],
 's2-mat-y3-w23-l4': [pair_visual('Fluency','square; rectangle; irregular','Units','cm on every answer','Perimeter fluency with units required.','Name when a shortcut matches side addition.'),
  pair_visual('Irregular','3+5+4+6','P','18 cm','Irregular polygon perimeter by side sums.','Do not omit a side.')],
 's2-mat-y3-w24-l1': [pair_visual('String','wrap around lid','Then','straighten on ruler','Measuring around a curved object.','Do not stretch the string.'),
  pair_visual('Estimate','first','Measure','second','Estimate-then-measure for loops.','Record both values.')],
 's2-mat-y3-w24-l2': [pair_visual('Plan','what to measure','Units','cm or m chosen','Investigation plan for grounds lengths.','A table keeps results organised.'),
  pair_visual('Compare','which is longest','Challenge','note one difficulty','Comparison sentences from recorded measures.','Plan before measuring.')],
 's2-mat-y3-w24-l3': [pair_visual('Fit','90 cm shelf in 1.2 m','Spare','30 cm','Real-life fit decision with conversion.','Convert before deciding.'),
  pair_visual('Poster','60 cm wide','Gap','0.5 m = 50 cm — no fit','Fit problem where the poster is too wide.','Mixed units without converting mislead.')],
 's2-mat-y3-w24-l4': [pair_visual('Review path','unit → convert → measure','Then','perimeter → decide','Length unit review path.','Units belong on every answer.'),
  pair_visual('Mini','2 m 40 cm; P 10×7','Fit','180 cm in 2 m? yes','Compact review items for the length unit.','List next goals.')],
 's2-mat-y3-w25-l1': [pair_visual('Area','square units covering','Not','distance around','Area as covering contrasted with perimeter.','Count square units inside.'),
  pair_visual('Grid','3 rows of 4','Area','12 square cm','Rectangle area from a square grid.','Edge walking alone is not area.')],
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
