#!/usr/bin/env python3
"""Year 3 Science Written Core batch 05: sky finish + digital tech w25-l1 through w30-l2 (12)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

SCI, DDT2 = 'ST2-SCI-01', 'ST2-DDT-02'

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, subject='science', vocab=vocab,
                principle=principle, model=model, guided=guided, feedback=feedback,
                misconception=misconception, independent=independent)

LESSONS = [
L('s2-sci-y3-w25-l1',SCI,['stars','planet','night sky','observe'],
  'The night sky shows stars (distant suns appearing as points) and sometimes planets that look like steady bright points. Observation needs safe dark sites and no telescope required for basics.',
  'Stars twinkle more than planets often appear to. Constellations are patterns people imagine — useful maps, not physical strings. Never stare at the Sun.',
  'Safe rules: observe at night with an adult; never look at the Sun with eyes or devices; use red light if needed for diaries.',
  'Adult supervision; no Sun staring; optional dim light for recording.',
  'Pointing lasers at sky/aircraft is unsafe and not part of this lesson.',
  'With an adult, observe the night sky (or use class planetarium images). Sketch five bright objects. Label any known patterns cautiously. List three safety rules.'),
L('s2-sci-y3-w25-l2',SCI,['review','day','shadow','Moon'],
  'Earth/Sun/Moon unit review connects day/night, shadows, seasons, Moon phases and safe sky looking.',
  'Review path: Earth spin → shadows → seasons → Moon phases → night sky safety.',
  'Mini: cause of night; when shadows short; phase after crescent toward full; Sun-looking rule.',
  'Earth facing away; near midday; quarter/gibbous toward full; never stare at Sun.',
  'Review without model language is weaker.',
  'Complete a 12-item Earth/Sun/Moon review. Include one labelled day/night sketch. List two next goals.'),
L('s2-sci-y3-w26-l1',DDT2,['computer','data','input','output'],
  'A computer is a device that takes inputs, follows instructions and produces outputs. Data is information (numbers, words, images) computers store and use.',
  'Keyboard input → tablet processes → screen output. A step counter stores step-count data. Photos are image data.',
  'Sort: typing a name; speakers playing sound; stored high score — input, output or data stored?',
  'Input; output; stored data (also an output when shown).',
  'Thinking computers “know” things without data/programs anthropomorphises them.',
  'List five devices. For each name one input, one output and one kind of data it might store. Write a kid-friendly definition of data.'),
L('s2-sci-y3-w26-l2',DDT2,['collect','store','organise','table'],
  'Collecting and storing data means gathering facts carefully and organising them so they can be found again (tables, folders, labelled files).',
  'Class plant heights: table with name | height_cm | date. Saving the table with a clear filename beats a random photo of messy scrap paper.',
  'Improve this store: one photo of mixed numbers with no labels. What would you add?',
  'Columns/labels, units, date and a clear file/page title.',
  'Storing without labels makes the data hard to reuse later.',
  'Collect one small data set (at least 10 items). Store it in a labelled table (paper or digital). Write why your labels help a future reader.'),
L('s2-sci-y3-w27-l1',DDT2,['algorithm','sequence','step','order'],
  'An algorithm is a clear sequence of steps to complete a task. Order matters; missing steps cause failure.',
  'Brushing teeth algorithm: wet brush → paste → brush surfaces → rinse. Skipping paste changes the result. Instructions must be precise for a robot or person to follow.',
  'Write three steps to make a cheese sandwich. What happens if step order swaps bread and cheese wrongly?',
  'Steps must be in workable order; wrong order can make an impossible or messy sandwich.',
  'Vague steps like “make it nice” cannot be followed reliably.',
  'Write an algorithm of 6–10 steps for a daily task. Have a partner follow it exactly. Fix any unclear steps they stumble on.'),
L('s2-sci-y3-w27-l2',DDT2,['algorithm','test','debug','precise'],
  'Writing and testing algorithms means running the steps, finding where they fail and repairing the wording or order (early debugging).',
  'Algorithm to draw a square for a partner: forward → turn right 90° → repeat. If partner turns left, the path fails — repair the turn direction.',
  'Partner ends facing wrong way after “turn”. What precise word would you add?',
  'Specify left/right and how far (e.g. quarter turn).',
  'Blaming the partner without fixing the algorithm misses the point of testing instructions.',
  'Write, test and repair two algorithms (one everyday, one drawing/grid path). Show before/after wording for one repaired step.'),
L('s2-sci-y3-w28-l1',DDT2,['block coding','program','sprite','event'],
  'Block coding snaps instruction blocks into a program a sprite (character) can run. Events like “when clicked” start the script.',
  'When green flag clicked → move 10 steps → say “Hello”. Blocks must connect in order. Wrong block type (looks vs motion) changes the result.',
  'Describe what happens: when clicked → turn 90 → move 20. Where does the sprite end relative to start (conceptually)?',
  'Turned then moved forward in the new facing — exact place depends on start facing.',
  'Stacking disconnected blocks that never run is not a working program.',
  'In a block tool (or paper block cards), build a 4-block script with an event. Run/test it. Screenshot or sketch the blocks and describe the outcome.'),
L('s2-sci-y3-w28-l2',DDT2,['loop','repeat','pattern','efficient'],
  'Loops repeat a set of blocks without rewriting them. A repeat-4 around “move + turn 90°” draws a square efficiently.',
  'Without loop: move turn move turn move turn move turn. With loop: repeat 4 times (move turn). Same result, shorter program.',
  'Which is better for 20 identical steps — copy-paste 20 times or a repeat-20 loop? Why?',
  'Loop — shorter, easier to change the count in one place.',
  'Infinite loops that never stop can freeze a simple project — use a count when learning.',
  'Build a looped pattern (square, hexagon idea, or dance repeat). Show the loop block and say how many repeats. Change the count and record the new result.'),
L('s2-sci-y3-w29-l1',DDT2,['debug','error','fix','test'],
  'Debugging finds and fixes errors in algorithms or programs by comparing expected vs actual results, then changing one thing at a time.',
  'Expected: sprite reaches star. Actual: stops short. Hypothesis: move steps too small → increase steps → retest. Read error messages if shown.',
  'Program turns left but you needed right. What is the bug type — wrong value or wrong instruction?',
  'Wrong instruction/direction block (or wrong parameter).',
  'Changing five blocks at once makes it hard to know which fix worked.',
  'Debug two broken paper or digital scripts (teacher-provided or self-broken). Write expected, actual, fix and retest result for each.'),
L('s2-sci-y3-w29-l2',DDT2,['game','goal','controls','test'],
  'Coding a simple game needs a goal, controls (events), win/lose conditions and lots of testing with friends as players.',
  'Goal: catch three stars. Controls: arrow keys move. Win: score 3. Test if stars are too fast — adjust speed block.',
  'List goal, one control and one win condition for a tiny catcher game.',
  'e.g. catch fruit; left/right keys; catch 5 to win.',
  'A game with no way to win or lose is unfinished for this lesson’s purpose.',
  'Design and build a minimal game (digital or board-with-algorithm cards). Playtest with a partner twice. Record one bug fixed after playtest.'),
L('s2-sci-y3-w30-l1',DDT2,['online safety','personal','permission','trust'],
  'Staying safe online means protecting personal information, asking trusted adults before sharing and being kind in digital spaces.',
  'Do not share full name, address, school or passwords publicly. Ask before posting photos of others. Stop and tell an adult if something feels wrong.',
  'Sort safe/unsafe: using a class code; telling a stranger your address in chat; asking a parent before a new app.',
  'Safe; unsafe; safe.',
  'Thinking “everyone online is a friend” is unsafe.',
  'Make an online-safety charter with eight rules. Role-play two scenarios (what to do). Sign with a parent/teacher that you discussed them.'),
L('s2-sci-y3-w30-l2',DDT2,['review','data','algorithm','loop'],
  'Digital technologies review connects data, algorithms, block coding, loops, debugging and online safety.',
  'Review path: data definition → algorithm steps → loop efficiency → debug habit → safety rule.',
  'Mini: example of data; why order matters; loop vs copy; one personal-info rule.',
  'e.g. scores; wrong order fails task; loop shorter; do not share address.',
  'Review without safety is incomplete for this unit.',
  'Complete a 12-item digital tech review. Include one mini algorithm you improve. List two next goals.'),
]

VISUALS = {
 's2-sci-y3-w25-l1': [pair_visual('Stars','distant suns as points','Safety','never stare at Sun','Night sky basics.','Adult with you at night.'),
  pair_visual('Sketch','five bright objects','Patterns','optional names','Observation record.','No lasers at sky/aircraft.')],
 's2-sci-y3-w25-l2': [pair_visual('Review path','spin → shadows → seasons','Then','Moon → sky safety','Earth/Sun/Moon review.','Keep model language.'),
  pair_visual('Mini','night cause; short shadow','Sun rule','never stare','Compact sky review.','List next goals.')],
 's2-sci-y3-w26-l1': [pair_visual('Input','keyboard / sensor','Output','screen / sound','Computer parts idea.','Computers use data + instructions.'),
  pair_visual('Data','numbers words images','Store','memory / files','What data can be.','Devices do not “just know”.')],
 's2-sci-y3-w26-l2': [pair_visual('Collect','careful facts','Store','labelled table','Data storage habits.','Labels help future readers.'),
  pair_visual('Columns','name | value | date','Filename','clear title','Organised storage.','Unlabelled photos are weak.')],
 's2-sci-y3-w27-l1': [pair_visual('Algorithm','ordered steps','Precise','words a follower can use','Algorithm meaning.','Order matters.'),
  pair_visual('Vague','“make it nice”','Better','exact actions','Precision in steps.','Partner must follow exactly.')],
 's2-sci-y3-w27-l2': [pair_visual('Test','run the steps','Fail point','where it breaks','Testing algorithms.','Repair wording or order.'),
  pair_visual('Before','unclear turn','After','turn right 90°','Debugging instructions.','Blame the algorithm, then fix.')],
 's2-sci-y3-w28-l1': [pair_visual('Event','when clicked / flag','Blocks','snapped in order','Block coding start.','Disconnected blocks never run.'),
  pair_visual('Sprite','follows the script','Outcome','described after run','Program result.','Sketch or screenshot blocks.')],
 's2-sci-y3-w28-l2': [pair_visual('Loop','repeat a bundle','Square','repeat 4 move+turn','Loop efficiency.','Change count in one place.'),
  pair_visual('Without loop','many copied blocks','With loop','shorter program','Loop versus copy.','Use counted repeats while learning.')],
 's2-sci-y3-w29-l1': [pair_visual('Expected','what should happen','Actual','what did happen','Debug comparison.','Change one thing at a time.'),
  pair_visual('Fix','adjust block/value','Retest','confirm the result','Debug cycle.','Write expected/actual/fix.')],
 's2-sci-y3-w29-l2': [pair_visual('Goal','what to achieve','Controls','events/keys','Simple game parts.','Include win/lose.'),
  pair_visual('Playtest','partner plays','Bug fix','after feedback','Game testing.','Record one fixed bug.')],
 's2-sci-y3-w30-l1': [pair_visual('Protect','personal information','Ask','trusted adult','Online safety habits.','Strangers are not automatic friends.'),
  pair_visual('Share care','photos need permission','Stop','tell an adult if wrong','More safety habits.','Eight-rule charter.')],
 's2-sci-y3-w30-l2': [pair_visual('Review path','data → algorithm → loop','Then','debug → safety','Digital tech review.','Include a safety item.'),
  pair_visual('Mini','data example; order','Loop','beats copy-paste','Compact digital review.','List next goals.')],
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
            bundle = build_from_spec(base, u, VISUALS[u['seed_key']], subject='science')
            atomic_json(ROOT / 'lesson-pipeline/authored' / f"{u['seed_key']}.json", bundle)
            print('Written Core science bundle:', u['seed_key'])
    finally:
        db.close()

if __name__ == '__main__':
    create()
