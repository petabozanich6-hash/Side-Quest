#!/usr/bin/env python3
"""Year 3 Mathematics Written Core batch 12: 3D, angles, position, data start w34-l2 through w37-l1 (12)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

DS3, GM3, GM1, DATA = 'MA2-3DS-01', 'MA2-GM-03', 'MA2-GM-01', 'MA2-DATA-01'

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, subject='mathematics', vocab=vocab,
                principle=principle, model=model, guided=guided, feedback=feedback,
                misconception=misconception, independent=independent)

LESSONS = [
L('s2-mat-y3-w34-l2',DS3,['face','edge','vertex','count'],
  'Faces are flat surfaces, edges are where faces meet, and vertices are corners where edges meet. Count carefully on polyhedra.',
  'Cube: 6 faces, 12 edges, 8 vertices. Square pyramid: 5 faces (4 triangles + square), 8 edges, 5 vertices. Euler idea for later: F+V−E often equals 2 for simple polyhedra — optional stretch.',
  'Count F, E, V for a triangular prism (two triangles + three rectangles).',
  '5 faces, 9 edges, 6 vertices.',
  'Counting only the faces you can see in a drawing undercounts hidden faces.',
  'For ten 3D objects (models or clear drawings), record faces, edges and vertices. Mark hidden faces on five drawings. Write one tip for complete counts.'),
L('s2-mat-y3-w34-l3',DS3,['net','fold','cube','prism'],
  'A net is a flat arrangement of faces that can fold into a 3D object without overlaps. Cube nets use six squares in allowed arrangements.',
  'A row of six squares cannot fold into a cube (it wraps with gaps/overlaps). A cross of five squares with one attached to the side can work as a cube net.',
  'Decide which of two given nets could fold to a cube (teacher/book diagrams). Sketch one valid cube net of your own.',
  'Valid nets fold to six faces meeting correctly; invalid ones leave overlaps or missing faces.',
  'Any arrangement of six squares is not automatically a cube net.',
  'Sort eight nets into possible/impossible for a cube. Draw two different valid cube nets and one rectangular-prism net. Cut and fold one if materials allow.'),
L('s2-mat-y3-w34-l4',DS3,['fluency','name','faces','edges'],
  '3D fluency names objects quickly and recalls face/edge/vertex facts for common solids.',
  'Set: name cone; edges of cube; faces of square pyramid.',
  'Name/count: cylinder features; vertices of cube; faces of triangular pyramid (tetrahedron) if shown.',
  'Cylinder: 2 circles + curve; 8 vertices; 4 faces for tetrahedron.',
  'Mixing up edge and vertex vocabulary swaps counts.',
  'Complete an eighteen-item 3D naming fluency set. Re-work misses by touching or tracing each face on a model.'),
L('s2-mat-y3-w35-l1',GM3,['right angle','acute','obtuse','compare'],
  'A right angle is a square corner. Angles smaller than a right angle are acute; angles larger than a right angle (but less than straight) are often called obtuse in simple classroom language.',
  'Paper-corner tester: if the angle matches, it is right; if there is space inside the tester, the angle is larger; if the angle fits inside with room, it is smaller.',
  'Label three drawn angles as right, smaller than right, or larger than right using a square corner.',
  'Match labels to the tester results.',
  'Judging by eye alone without a right-angle tester leads to inconsistent labels.',
  'Classify sixteen angles with a paper corner. Draw four of each type (right / smaller / larger). Write the tester rule in your own words.'),
L('s2-mat-y3-w35-l2',GM3,['turn','quarter turn','half turn','angle'],
  'Turns make angles: a quarter turn is a right angle; a half turn is a straight angle; a full turn brings you back to the start facing.',
  'Facing north, a quarter turn right faces east (90° idea without requiring degree measure yet). Two quarter turns make a half turn.',
  'From facing the door, describe facing after one quarter turn left; after a half turn.',
  'Facing depends on start; half turn faces opposite.',
  'Calling every turn a right angle ignores half and full turns.',
  'Act out twelve turn instructions (quarter/half/three-quarter/full, left/right). Record start facing, instruction and end facing for eight of them. Link each quarter turn to a right angle.'),
L('s2-mat-y3-w35-l3',GM3,['angle hunt','environment','right angle','record'],
  'Angles appear in the environment: book corners, window frames, clock hands, open doors. An angle hunt records and classifies them.',
  'Example log: desk corner — right; open laptop — larger than right; pizza slice tip — smaller than right.',
  'Find and sketch three right angles and three non-right angles in the room. Label each.',
  'Labels must match the tester, not just the sketch beauty.',
  'Photographing without classifying leaves the hunt incomplete.',
  'Complete an angle hunt of at least twelve finds. Tally right / smaller / larger. Write two sentences about where right angles were most common.'),
L('s2-mat-y3-w35-l4',GM3,['fluency','right angle','turn','classify'],
  'Angle fluency classifies angles quickly and links quarter turns to right angles.',
  'Set: label angle; quarter turn = ?; larger or smaller than right for a wide door opening.',
  'Classify three angles; name the turn for two right angles in a row; spot the right angles in a rectangle.',
  'Labels per tester; half turn; four right angles in a rectangle.',
  'Rushing without the paper corner reintroduces eye-only errors.',
  'Complete an eighteen-item angle fluency set. Re-work misses with the corner tester shown beside the answer.'),
L('s2-mat-y3-w36-l1',GM1,['grid','row','column','cell'],
  'Grid references locate a cell where a column letter (or number) meets a row number — like a simple map coordinate.',
  'If columns are A–E and rows 1–5, the library at B3 means column B, row 3. Always state the order used (letter then number).',
  'On a 4×4 grid, place a tree at C2 and a well at A4. What is at C2?',
  'The tree (if placed correctly).',
  'Swapping row and column (reading 2C as if it were C2) sends you to the wrong cell.',
  'Label a grid A–F and 1–6. Place eight landmarks. Answer twelve “what is at / where is” questions. Write the column-then-row rule once at the top.'),
L('s2-mat-y3-w36-l2',GM1,['direction','left','right','forward'],
  'Directions use turns and steps: forward, left, right, and sometimes north/south/east/west when a compass rose is shown.',
  'From the gate: forward 2, turn right, forward 1 reaches the fountain. Keep facing direction updated after each turn.',
  'Follow: start facing up the page, forward 3, quarter turn left, forward 2. Mark the end cell on a grid.',
  'End position depends on start cell; path must match each instruction in order.',
  'Turning without updating facing makes the next “forward” go the wrong way.',
  'Write and follow eight direction sequences on a grid (partner can test four). Include at least three turns in each of four sequences.'),
L('s2-mat-y3-w36-l3',GM1,['map','legend','grid','route'],
  'A treasure map needs a grid, a legend (symbols), a start point and clear directions or coordinates to the treasure.',
  'Legend example: △ tree, □ rock, ★ treasure. Route: start A1 → B1 → B3 → D3 (treasure). Directions must match the grid.',
  'Design a 5×5 map with four landmarks and treasure. Write coordinates for treasure and a 4-step route from start.',
  'Map must be readable by someone else using only your legend and instructions.',
  'Decorations that hide the grid references make the map unusable for maths.',
  'Create a treasure map with legend, grid references and two different routes to the same treasure. Swap with a partner to test clarity.'),
L('s2-mat-y3-w36-l4',GM1,['review','shape','angle','position'],
  'Shapes/objects/angles/position review connects 2D/3D properties, symmetry, angle types, grids and directions.',
  'Review path: name a polygon → count F/E/V on a cube → classify an angle → locate B4 → follow a short path.',
  'Mini: lines of symmetry of a square; edges of a cube; right or not for a book corner; cell of a drawn hut.',
  '4; 12; right; cell per your grid.',
  'Review answers without diagrams hide swap errors in coordinates.',
  'Complete a 14-item unit review across shapes, 3D, angles and maps. Show grid working for position items. List two next goals.'),
L('s2-mat-y3-w37-l1',DATA,['data','collect','record','category'],
  'Collecting data means choosing a clear question, listing categories or values, and recording each response once without double-counting.',
  'Question: Favourite playground game? Categories: soccer, tip, handball, other. Tally each classmate once. Total tallies should match the class size.',
  'Plan: question about favourite fruit (4 options). How will you record? How will you know everyone answered once?',
  'Use a tally table; one mark per person; check total equals number surveyed.',
  'Changing categories halfway through makes the data inconsistent.',
  'Design and run a mini survey (at least 12 responses, 3–5 categories). Record raw responses. Write the question, categories and one fairness rule you used.'),
]

VISUALS = {
 's2-mat-y3-w34-l2': [pair_visual('Cube','6F 12E 8V','Pyramid','5F 8E 5V','Faces, edges and vertices counts.','Count hidden faces too.'),
  pair_visual('Triangular prism','5F 9E 6V','Tip','mark each edge','Polyhedron counting practice.','Touch edges on a model.')],
 's2-mat-y3-w34-l3': [pair_visual('Net','flat faces ready to fold','Cube','six squares allowed ways','Net idea for a cube.','Not every six-square layout works.'),
  pair_visual('Valid','cross-style net','Invalid','long row of six','Possible vs impossible cube nets.','Fold to test when you can.')],
 's2-mat-y3-w34-l4': [pair_visual('Fluency','name object','Recall','F/E/V facts','3D naming fluency.','Trace faces on misses.'),
  pair_visual('Cone','point + curve + circle','Cube edges','12','Quick 3D facts.','Edge ≠ vertex.')],
 's2-mat-y3-w35-l1': [pair_visual('Right','matches paper corner','Smaller','fits inside corner','Classifying angles with a tester.','Do not judge by eye alone.'),
  pair_visual('Larger','corner fits inside angle','Labels','right / smaller / larger','Angle comparison language.','Tester beside each label.')],
 's2-mat-y3-w35-l2': [pair_visual('Quarter turn','right angle','Half turn','straight opposite','Turns linked to angles.','Update facing after each turn.'),
  pair_visual('Start','facing north','Quarter right','facing east','Turn instruction example.','Full turn returns to start.')],
 's2-mat-y3-w35-l3': [pair_visual('Hunt','desk, door, clock','Log','sketch + label','Angle hunt recording.','Classify every find.'),
  pair_visual('Tally','right / smaller / larger','Finding','where right angles cluster','Summarising the hunt.','Twelve finds minimum.')],
 's2-mat-y3-w35-l4': [pair_visual('Fluency','classify + turns','Tool','paper corner','Angle fluency checklist.','Retest misses with the corner.'),
  pair_visual('Rectangle','4 right angles','Two quarters','half turn','Links between angles and turns.','Rushing causes eye-only errors.')],
 's2-mat-y3-w36-l1': [pair_visual('Column','letter','Row','number','Grid reference structure.','State letter-then-number order.'),
  pair_visual('B3','column B row 3','Swap error','2B ≠ B2','Reading a grid cell.','Keep order consistent.')],
 's2-mat-y3-w36-l2': [pair_visual('Forward','steps in facing direction','Turn','left or right','Direction sequence parts.','Facing updates after turns.'),
  pair_visual('Path','forward 2, right, forward 1','End','marked cell','Following grid directions.','Order of instructions matters.')],
 's2-mat-y3-w36-l3': [pair_visual('Legend','symbol meanings','Grid','coordinates','Treasure map essentials.','Keep grid readable.'),
  pair_visual('Route','A1→B1→B3→D3','Treasure','★ at end','Two routes can share an end.','Partner must decode it.')],
 's2-mat-y3-w36-l4': [pair_visual('Review path','2D → 3D → angle','Then','grid → directions','Unit review sequence.','Diagrams for coordinates.'),
  pair_visual('Mini','square symmetry; cube edges','Cell','hut on grid','Compact mixed review.','List next goals.')],
 's2-mat-y3-w37-l1': [pair_visual('Question','clear categories','Record','one tally each','Data collection plan.','Totals match survey size.'),
  pair_visual('Fairness','categories fixed','Avoid','double counting','Consistent data rules.','Do not change categories mid-way.')],
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
