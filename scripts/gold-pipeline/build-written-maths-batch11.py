#!/usr/bin/env python3
"""Year 3 Mathematics Written Core batch 11: time problems + 2D start w31-l2 through w34-l1 (12)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

NSM2, DS2, DS3 = 'MA2-NSM-02', 'MA2-2DS-01', 'MA2-3DS-01'

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, subject='mathematics', vocab=vocab,
                principle=principle, model=model, guided=guided, feedback=feedback,
                misconception=misconception, independent=independent)

LESSONS = [
L('s2-mat-y3-w31-l2',NSM2,['start','finish','duration','missing'],
  'Time problems give two of start, finish and duration; find the missing quantity using clock skills and careful hour rollover.',
  'Start 2:40, duration 50 minutes → finish 3:30. Finish 11:15, start 10:35 → duration 40 minutes.',
  'Find the missing piece: start 8:05, finish 8:50; duration 1 hour 20 minutes ending at 4:00 — what start?',
  '45 minutes; start 2:40.',
  'Mixing AM/PM mid-problem can shift answers by 12 hours in real contexts.',
  'Solve fourteen start/finish/duration problems. Mark which quantity was missing. Include two that cross noon.'),
L('s2-mat-y3-w31-l3',NSM2,['schedule','sequence','enough time','plan'],
  'Planning a schedule orders events by start time and duration, then tests whether there is enough time before the next commitment.',
  'A film starts at 4:20 and lasts 95 minutes → ends about 5:55. If you must leave at 5:45, you do not have enough time to stay to the end.',
  'Lesson 40 minutes from 9:10. What end time? Is there enough time before a 10:00 break?',
  'Ends 9:50; yes, 10 minutes spare before 10:00.',
  'Adding durations without watching for hour rollover underestimates the end time.',
  'Build one half-day schedule with five events (start + duration). Solve twelve enough-time / order questions about your schedule or a given one.'),
L('s2-mat-y3-w31-l4',NSM2,['timetable','fluency','duration','earlier'],
  'Timetable fluency finds cells quickly, compares which service is earlier and calculates short travel durations.',
  'Set: find Wed library open time; duration Town Hall 8:15 → Central 8:32; which bus leaves earlier 7:40 or 7:55?',
  'From a simple two-column timetable: duration between stops; earliest arrival; latest departure before 9:00.',
  'Answers depend on the table; method is row×column then subtract times carefully.',
  'Reading the wrong row (mixing places) gives the wrong time every time.',
  'Complete an eighteen-item timetable fluency set across two tables. Highlight row and column for six answers.'),
L('s2-mat-y3-w32-l1',NSM2,['investigation','diary','duration','evidence'],
  'Investigate time in daily life by collecting real start/finish times, calculating durations and presenting evidence clearly.',
  'Sample: breakfast 7:10–7:25 (15 min); travel 8:05–8:40 (35 min). A simple table of activity | start | finish | duration supports claims.',
  'List three of your activities with estimated durations. Which takes longest? How did you decide?',
  'Compare estimated minutes; longest has the greatest duration.',
  'Guessing durations without any clock evidence makes the investigation weak.',
  'Keep a one-day time diary (at least eight activities). Calculate durations. Write three findings with clock evidence and one question for further investigation.'),
L('s2-mat-y3-w32-l2',NSM2,['compare','duration','longer','shorter'],
  'Compare durations by converting to the same unit (usually minutes) or by placing intervals on a shared time line.',
  '40 minutes is longer than half an hour (30 minutes). 1 hour 10 minutes = 70 minutes > 65 minutes.',
  'Order shortest to longest: 45 min; 1 hour; 50 min. Compare 2 h and 150 min.',
  '45, 50, 60 minutes; 2 h = 120 min so 150 min is longer.',
  'Comparing 1:20 and 80 minutes as if the colon were a decimal often fails.',
  'Compare twelve duration pairs (convert first). Order five mixed durations. Draw one shared time line for three overlapping events.'),
L('s2-mat-y3-w32-l3',NSM2,['time','measurement','mixed','convert'],
  'Time and measurement problems mix clocks with length, mass or capacity — keep attributes separate and convert within each attribute.',
  'A 2.5 kg bag and a 45-minute bake are different attributes; do not add them. A recipe may need 500 mL water and 20 minutes stirring — solve each part with its own unit.',
  'A loaf needs 35 minutes in an oven from 4:50. When is it done? The dough mass is 800 g — how many kg?',
  'Done at 5:25; 0.8 kg.',
  'Adding minutes to grams creates a nonsense total.',
  'Solve ten mixed time-and-measurement problems. Label the attribute for each calculation. Show conversions beside answers.'),
L('s2-mat-y3-w32-l4',NSM2,['review','clock','elapsed','timetable'],
  'Time unit review connects analog/digital reading, AM/PM, conversions, calendars, elapsed time, timetables and short schedules.',
  'Review path: read a clock → convert minutes/hours → elapsed → calendar day → timetable cell → enough-time decision.',
  'Mini: digital for half past 6; 120 minutes in hours; elapsed 1:50→2:25; AM/PM for evening bedtime 8:30.',
  '6:30; 2 hours; 35 minutes; PM.',
  'Review without drawing or time lines hides counting errors.',
  'Complete a 14-item time review. Show working for elapsed and conversions. List two time skills to practise next.'),
L('s2-mat-y3-w33-l1',DS2,['side','vertex','polygon','closed'],
  '2D shapes are flat. A polygon is a closed shape with straight sides. Count sides and vertices; simple polygons have equal counts of each.',
  'A triangle has 3 sides and 3 vertices. A pentagon has 5 sides and 5 vertices. Circles are not polygons because they have no straight sides.',
  'Name and count: square; hexagon. Is a heart shape a polygon? Why/why not?',
  '4 sides/vertices; 6 sides/vertices; no — curved edges.',
  'Calling any closed shape a polygon including curves is incorrect.',
  'Sort eighteen shapes into polygon/not polygon. For ten polygons record name (if known), sides and vertices. Draw three irregular polygons.'),
L('s2-mat-y3-w33-l2',DS2,['side','corner','angle','right angle'],
  'Sides meet at corners (vertices). An angle is the turn between two sides. A right angle is a square corner; other angles can be smaller or larger than a right angle.',
  'A square has four right angles. A triangle can have one right angle (right-angled triangle). Compare angles to a corner of paper as a right-angle tester.',
  'How many right angles in a rectangle? Mark angles in a right-angled triangle as right / smaller / larger than right.',
  '4 right angles; one right, two acute (smaller than right) typically.',
  'Calling every sharp-looking corner a right angle without testing is inaccurate.',
  'On twelve shapes, count sides and corners, then label each angle as right, smaller than right, or larger than right using a paper corner tester.'),
L('s2-mat-y3-w33-l3',DS2,['line of symmetry','mirror','fold','reflect'],
  'A line of symmetry is a fold or mirror line that splits a shape into two matching halves that map onto each other.',
  'A square has 4 lines of symmetry. An isosceles triangle can have 1. A scalene triangle typically has 0.',
  'How many lines of symmetry: rectangle that is not a square; equilateral triangle; block capital H?',
  '2; 3; 2 (typical block H).',
  'Drawing a line that cuts area in half but does not match reflected sides is not a true symmetry line.',
  'Find and draw all lines of symmetry for twelve shapes/letters. For four shapes that have none, write why a proposed line fails the mirror test.'),
L('s2-mat-y3-w33-l4',DS2,['fluency','name','polygon','sides'],
  'Shape fluency quickly names common 2D shapes, counts sides/vertices and spots regular vs irregular examples.',
  'Set: name octagon; count vertices of hexagon; regular or not for a stretched diamond.',
  'Name/count: 7-sided polygon; vertices of pentagon; is a square regular — yes/no.',
  'Heptagon or 7-gon; 5; yes regular.',
  'Miscounting a vertex because two sides look almost straight happens — mark each corner.',
  'Complete an eighteen-item naming-shapes fluency mix. Re-work misses by marking sides and vertices on the diagram.'),
L('s2-mat-y3-w34-l1',DS3,['face','edge','vertex','solid'],
  '3D objects take up space. Name common objects (cube, sphere, cylinder, cone, square pyramid, rectangular prism) and begin listing faces, edges and vertices.',
  'A cube has 6 square faces, 12 edges and 8 vertices. A sphere has a curved surface and no edges or vertices. A cylinder has 2 circular faces and a curved surface.',
  'Name the object and give faces: cereal box (rectangular prism); dice (cube); ball (sphere).',
  'Rectangular prism — 6 faces; cube — 6 faces; sphere — 0 flat faces (curved surface).',
  'Calling every box a cube ignores rectangular prisms that are not cubes.',
  'Sort fifteen real or pictured objects into 3D names. For eight polyhedra record faces, edges and vertices. Write one property that separates cube from rectangular prism.'),
]

VISUALS = {
 's2-mat-y3-w31-l2': [pair_visual('Start + duration','finish','Finish − start','duration','Missing piece in time problems.','Two known → find one.'),
  pair_visual('Example','2:40 + 50','Finish','3:30','Duration word-problem model.','AM/PM stay consistent.')],
 's2-mat-y3-w31-l3': [pair_visual('Film','4:20 + 95 min','End','about 5:55','Planning with start and duration.','Watch hour rollover.'),
  pair_visual('Lesson','9:10 + 40 min','Ends','9:50','Enough-time check before a break.','Spare minutes matter.')],
 's2-mat-y3-w31-l4': [pair_visual('Timetable','row × column','Fluency','earlier / duration','Timetable fluency actions.','Highlight row and column.'),
  pair_visual('Travel','8:15 to 8:32','Duration','17 minutes','Duration from two timetable times.','Wrong row gives wrong time.')],
 's2-mat-y3-w32-l1': [pair_visual('Diary','activity | start | finish','Duration','finish − start','Time investigation table.','Use clock evidence.'),
  pair_visual('Finding','longest activity','Evidence','compared minutes','Claim supported by durations.','Estimates alone are weak.')],
 's2-mat-y3-w32-l2': [pair_visual('Same unit','convert to minutes','Then','compare','Comparing durations fairly.','Colon is not a decimal.'),
  pair_visual('Order','45; 50; 60 min','Longer','150 min > 2 h','Ordering mixed durations.','Shared time lines help.')],
 's2-mat-y3-w32-l3': [pair_visual('Time part','35 min from 4:50','Mass part','800 g = 0.8 kg','Mixed attributes kept separate.','Do not add minutes to grams.'),
  pair_visual('Done','5:25','Also','capacity/length if given','Time-and-measurement split working.','Convert within each attribute.')],
 's2-mat-y3-w32-l4': [pair_visual('Review path','clock → convert → elapsed','Then','calendar → timetable','Time topic review path.','Show working on elapsed.'),
  pair_visual('Mini','6:30; 2 h; 35 min','PM','evening 8:30','Compact time review.','List next practise goals.')],
 's2-mat-y3-w33-l1': [pair_visual('Polygon','closed straight sides','Not polygon','circle / curves','Polygon definition contrast.','Sides = vertices for simple polygons.'),
  pair_visual('Triangle','3 and 3','Pentagon','5 and 5','Side and vertex counts.','Mark every corner.')],
 's2-mat-y3-w33-l2': [pair_visual('Corner','vertex where sides meet','Right angle','square corner','Sides, corners and angles.','Test with a paper corner.'),
  pair_visual('Rectangle','4 right angles','Right triangle','one right angle','Angle labels on familiar shapes.','Sharp-looking ≠ always right.')],
 's2-mat-y3-w33-l3': [pair_visual('Mirror line','matching halves','Square','4 lines','Lines of symmetry idea.','Half area alone is not enough.'),
  pair_visual('Equilateral','3 lines','Scalene','0 lines','Symmetry counts by triangle type.','Test with a mirror.')],
 's2-mat-y3-w33-l4': [pair_visual('Fluency','name; count; regular?','Mark','each side and vertex','Polygon fluency checklist.','Miscounts hide at flat-looking corners.'),
  pair_visual('Octagon','8','Hexagon vertices','6','Quick polygon facts.','Re-mark on misses.')],
 's2-mat-y3-w34-l1': [pair_visual('Cube','6 faces, 12 edges, 8 vertices','Sphere','curved; no edges','3D object properties contrast.','Cube ≠ every box.'),
  pair_visual('Cylinder','2 circles + curve','Prism','box faces','Common 3D names and surfaces.','List faces, edges, vertices.')],
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
