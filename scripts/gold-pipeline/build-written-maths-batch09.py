#!/usr/bin/env python3
"""Year 3 Mathematics Written Core batch 09: area/capacity/mass w25-l2 through w28-l1 (12)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

GM = 'MA2-GM-01'

def L(seed, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=GM, subject='mathematics', vocab=vocab,
                principle=principle, model=model, guided=guided, feedback=feedback,
                misconception=misconception, independent=independent)

LESSONS = [
L('s2-mat-y3-w25-l2',['square unit','grid','count','cover'],
  'Measure area by covering a shape with equal square units and counting how many squares are needed (full squares; discuss half squares carefully).',
  'A shape covering 14 full centimetre squares has area 14 cm². Incomplete edge squares can be combined (two halves ≈ one) when appropriate.',
  'Count the area of a rectangle drawn on grid paper as 5 by 3 squares. What is the area?',
  '15 square units (5×3).',
  'Counting only the squares around the border undercounts area.',
  'Find areas of eight grid shapes (rectangles and irregular). Record counts and note any half-square combinations. Draw two of your own shapes with a target area.'),
L('s2-mat-y3-w25-l3',['compare','area','same unit','larger'],
  'Compare areas using the same square unit. A shape with more square units has greater area when units match.',
  'Shape A covers 12 cm²; Shape B covers 9 cm² → A has greater area. Comparing sticky-note covers only works if notes are the same size.',
  'Compare: 8 square tiles vs 11 square tiles (same size). Order three grid areas 6, 10, 7.',
  '11>8; order 6, 7, 10.',
  'Comparing areas measured with different-sized units without converting is unfair.',
  'Compare ten pairs of areas (grids or tile counts). For two pairs, redesign so a taller shape has smaller area than a wider one.'),
L('s2-mat-y3-w25-l4',['fluency','area','count','unit'],
  'Area fluency counts square units accurately and always states the unit (for example square centimetres).',
  'Set: 4×6 rectangle on cm grid; irregular covering 11 squares; compare 10 cm² and 12 cm².',
  'Find areas: 3×8 grid rectangle; L-shape of 10 squares; which is larger 9 cm² or 1×8 rectangle?',
  '24; 10; 9 cm² > 8 cm².',
  'Omitting "square" from the unit confuses area with length.',
  'Complete a sixteen-item area fluency set. Re-work misses by recounting on a sketched grid.'),
L('s2-mat-y3-w26-l1',['array','rows','columns','multiply'],
  'The area of a rectangle equals rows×columns of unit squares — an array — which matches length×width when sides are measured in the same unit.',
  'A 4 cm by 7 cm rectangle holds 4 rows of 7 centimetre squares → area 28 cm². Array language matches multiplication facts.',
  'Find area: 5 cm by 6 cm rectangle; 3 cm by 9 cm rectangle using arrays.',
  '30 cm²; 27 cm².',
  'Adding length and width (perimeter thinking) when asked for area gives the wrong quantity.',
  'Find areas of ten rectangles using arrays or length×width. Draw the array for four of them. Write one sentence linking arrays to multiplication.'),
L('s2-mat-y3-w26-l2',['area problem','cover','missing side','tiling'],
  'Area problems ask how much covering is needed, how many tiles fit, or what missing side makes a given area.',
  'A patio 3 m by 4 m needs area 12 m² of tiles. If area is 24 cm² and width 4 cm, length=6 cm because 4×6=24.',
  'A rectangle area is 36 cm² and length 9 cm. Find the width. How many 1 cm² tiles cover it?',
  'Width 4 cm; 36 tiles.',
  'Using perimeter when the story is about covering solves the wrong problem.',
  'Solve eight area word problems (tiling, covering, missing side). Sketch each rectangle and show the multiplication.'),
L('s2-mat-y3-w26-l3',['area','perimeter','different','same shape'],
  'Area and perimeter are different: shapes can share a perimeter but differ in area, or share an area but differ in perimeter.',
  'A 1×6 rectangle and a 2×3 rectangle both have area 6 but perimeters 14 and 10. Fence length (perimeter) does not fix the covering (area).',
  'Find P and A for 2×8 and 4×4 rectangles. What stays the same?',
  '2×8: P=20, A=16. 4×4: P=16, A=16. Areas equal; perimeters differ.',
  'Thinking a longer fence always means more area is false.',
  'Create six rectangles. Record P and A for each. Find one pair with equal area different P, and one pair with equal P different A (if possible) or explain why not.'),
L('s2-mat-y3-w26-l4',['fluency','area','perimeter','distinguish'],
  'Fluency with area and perimeter means choosing the correct idea for the question and computing accurately with units.',
  'Set: P of 5×3; A of 5×3; which question needs fencing vs grass covering?',
  'For 6×4: find P and A; label fencing vs covering.',
  'P=20; A=24; fencing→P; covering→A.',
  'Swapping P and A formulas is a common rush error.',
  'Complete an eighteen-item mixed A/P fluency set. Circle whether each item asks for around or covering before computing.'),
L('s2-mat-y3-w27-l1',['millilitre','litre','capacity','unit'],
  'Capacity is how much liquid a container can hold. 1000 millilitres equal 1 litre. Choose mL for small amounts and L for larger.',
  'A medicine cup might be 20 mL. A juice bottle might be 2 L = 2000 mL. A 500 mL bottle is half a litre.',
  'Choose mL or L: teaspoon; bathtub; school drink bottle. Convert 3 L to mL.',
  'mL; L; mL (or L if large bottle). 3 L = 3000 mL.',
  'Using litres for a medicine dose is the wrong scale.',
  'Sort twelve capacities into mL/L. Convert eight measures between mL and L. Write why unit choice matters for one example.'),
L('s2-mat-y3-w27-l2',['measure','capacity','scale','estimate'],
  'Measuring capacity uses marked jugs or cylinders: read the scale at eye level at the liquid surface (meniscus idea simplified as the line).',
  'If water sits at the 250 mL mark, capacity poured is 250 mL (for that pour). Estimate a cup then measure to compare.',
  'A jug shows marks every 100 mL. Water is halfway between 200 and 300. About how many mL?',
  'About 250 mL.',
  'Reading the scale from above or below eye level shifts the reading.',
  'Estimate and measure six pours with a measuring jug (or marked bottle). Record estimate, measure and difference. Write one accurate-reading tip.'),
L('s2-mat-y3-w27-l3',['volume','cubes','fill','layer'],
  'Volume with cubes counts how many unit cubes fill a space — layers of arrays. Capacity (liquid) and volume (cubes) both describe "how much fills" in related ways.',
  'A box holding 2 layers of 3×4 cubes has volume 24 cubic units. Count layer by layer to avoid missing cubes.',
  'Find volume: 3 layers of 2×5 cubes; a 2×2×2 cube.',
  '30 cubic units; 8 cubic units.',
  'Counting only the cubes you can see on the outside undercounts hidden cubes.',
  'Build or draw eight cube constructions. Record volume by layers. Include one hollow-looking drawing and explain how to count hidden cubes.'),
L('s2-mat-y3-w27-l4',['fluency','capacity','volume','convert'],
  'Capacity and volume fluency converts mL↔L and counts cube volumes with clear cubic or millilitre units.',
  'Set: 2 L=__mL; volume of 4×3×2 cubes; which unit for a teaspoon?',
  'Convert 1500 mL; volume 3×3×3; compare 500 mL and 0.5 L.',
  '1 L 500 mL; 27 cubic units; equal.',
  'Mixing mL with cubic centimetres without context can confuse different measures.',
  'Complete a sixteen-item capacity/volume fluency set. Re-work misses with unit labels rewritten.'),
L('s2-mat-y3-w28-l1',['gram','kilogram','mass','heavier'],
  'Mass is how heavy an object is. 1000 grams equal 1 kilogram. Use g for light objects and kg for heavier ones.',
  'An apple might be about 150 g. A school bag might be about 4 kg = 4000 g. 500 g is half a kilogram.',
  'Choose g or kg: feather; child; bag of rice. Convert 2 kg to grams.',
  'g; kg; kg (or g for small bag). 2 kg = 2000 g.',
  'Using kilograms for a paperclip is the wrong scale.',
  'Sort twelve masses into g/kg. Convert eight measures between g and kg. Estimate three classroom objects then check on a scale if available.'),
]

VISUALS = {
 's2-mat-y3-w25-l2': [pair_visual('Cover','equal square units','Count','14 full squares','Area measured by covering with squares.','Count the squares that cover the shape.'),
  pair_visual('Array','5 by 3','Area','15 square units','Rectangle area from a grid array.','Border-only counting undercounts.')],
 's2-mat-y3-w25-l3': [pair_visual('More squares','12 cm²','Fewer','9 cm²','Area comparison with the same square unit.','Same unit size is required.'),
  pair_visual('Order','6; 7; 10','Unfair','different tile sizes','Ordered areas with matching units.','Different units need converting first.')],
 's2-mat-y3-w25-l4': [pair_visual('Fluency','4×6 grid','Unit','square centimetres','Area fluency with square units named.','Say square units, not only a number.'),
  pair_visual('L-shape','10 squares','Compare','9 cm² vs 8 cm²','Irregular and rectangle areas compared.','Recount on a sketch when unsure.')],
 's2-mat-y3-w26-l1': [pair_visual('Rows×columns','4×7','Area','28 cm²','Rectangle area from an array.','Matches length×width in the same unit.'),
  pair_visual('Also','5×6=30','Link','multiplication facts','Array area linked to multiplication.','Adding sides is perimeter, not area.')],
 's2-mat-y3-w26-l2': [pair_visual('Patio','3 m by 4 m','Tiles','12 m²','Covering problem using area.','Covering asks for area.'),
  pair_visual('Missing side','A=36; length 9','Width','4 cm','Missing width from area.','Sketch before multiplying.')],
 's2-mat-y3-w26-l3': [pair_visual('Same area','1×6 and 2×3 both 6','Different P','14 vs 10','Equal area with different perimeters.','Area and perimeter are not the same.'),
  pair_visual('Same A','4×4 and compare','Different P','possible','Rectangle pairs distinguishing A and P.','Longer fence does not always mean more area.')],
 's2-mat-y3-w26-l4': [pair_visual('Around','perimeter','Covering','area','Question type decides A or P.','Circle around vs covering first.'),
  pair_visual('6×4','P=20; A=24','Units','required','Mixed A/P fluency for one rectangle.','Do not swap the formulas.')],
 's2-mat-y3-w27-l1': [pair_visual('mL','small amounts','L','larger containers','Capacity units millilitres and litres.','1000 mL = 1 L.'),
  pair_visual('Convert','2 L = 2000 mL','Half litre','500 mL','Litre–millilitre conversions.','Match the unit to the container.')],
 's2-mat-y3-w27-l2': [pair_visual('Scale','read at eye level','Mark','250 mL line','Measuring jug reading at the liquid line.','Eye level improves accuracy.'),
  pair_visual('Estimate','first','Measure','second','Estimate-then-measure for capacity.','Halfway between marks is a midpoint estimate.')],
 's2-mat-y3-w27-l3': [pair_visual('Layers','2 layers of 3×4','Volume','24 cubes','Volume counted by cube layers.','Count hidden cubes, not only faces.'),
  pair_visual('2×2×2','8 cubes','3×2×5','30 cubes','Cube volumes from dimensions.','Outside-only counting undercounts.')],
 's2-mat-y3-w27-l4': [pair_visual('Convert','2 L → 2000 mL','Volume','4×3×2 cubes','Capacity and volume fluency pair.','Keep unit labels clear.'),
  pair_visual('Equal','500 mL and 0.5 L','Teaspoon','use mL','Equivalence and unit choice items.','Rewrite misses with units.')],
 's2-mat-y3-w28-l1': [pair_visual('g','light objects','kg','heavier objects','Mass units grams and kilograms.','1000 g = 1 kg.'),
  pair_visual('Convert','2 kg = 2000 g','Half kg','500 g','Kilogram–gram conversions.','Match the unit to the object.')],
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
