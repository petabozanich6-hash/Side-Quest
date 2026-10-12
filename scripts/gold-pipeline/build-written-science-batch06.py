#!/usr/bin/env python3
"""Year 3 Science Written Core batch 06: food/agriculture + investigation start w31-l1 through w36-l2 (12)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

SCI, PQU, DDT, DAT = 'ST2-SCI-01', 'ST2-PQU-01', 'ST2-DDT-01', 'ST2-DAT-01'

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, subject='science', vocab=vocab,
                principle=principle, model=model, guided=guided, feedback=feedback,
                misconception=misconception, independent=independent)

LESSONS = [
L('s2-sci-y3-w31-l1',SCI,['food','farm','source','plant/animal'],
  'Food comes from plants and animals (and fungi in some foods). Tracing a meal back to farms, gardens or oceans shows its sources.',
  'Bread ← wheat plants. Cheese ← milk ← cows/goats. Apple ← apple tree. Fish ← ocean/river catch or farmed fish.',
  'Trace: hamburger bun; lettuce; beef patty. Plant or animal source?',
  'Bun plant (wheat); lettuce plant; patty animal (cattle) — note some patties are plant-based if labelled.',
  'Thinking food “comes from the supermarket” stops one step too soon for science.',
  'Choose a real meal. Map each item to plant/animal/other source. Draw a simple farm-to-plate arrow for three items.'),
L('s2-sci-y3-w31-l2',SCI,['farm','Australia','produce','climate'],
  'Australian farms produce foods suited to climate and land: wheat belts, cattle stations, orchards, market gardens and more — with regional differences.',
  'Hot dry inland areas may suit certain livestock; cooler regions suit some fruits. Irrigation and seasons affect what grows when.',
  'Why might tropical bananas grow better in warm north Queensland than in alpine areas?',
  'Bananas need warmer conditions; alpine areas are too cold.',
  'Assuming every Australian farm grows the same foods ignores climate diversity.',
  'Research (books/approved sites/adult help) three Australian farm products and their regions. Present a mini map or table with climate notes.'),
L('s2-sci-y3-w32-l1',SCI,['seed','germinate','grow','needs'],
  'Seeds can germinate (start growing) when they have suitable water, warmth and air; then seedlings need light and nutrients to keep growing.',
  'Bean on wet cotton: seed coat softens, root emerges, then shoot. Dry cotton → little/no germination. Label seed, root, shoot.',
  'Predict wet vs dry cotton for ten beans after 5 days. What will you count?',
  'More germination on wet; count sprouted vs not.',
  'Planting seeds too deep in lightless soaked mud without air can hinder germination.',
  'Set up a germination tray (adult help). Daily diary for seven days with sketches. Conclude which condition helped using counts.'),
L('s2-sci-y3-w32-l2',PQU,['fair test','seed','variable','water'],
  'A fair test of what seeds need changes only one variable (for example water) while keeping seed type, warmth and light alike.',
  'Same bean type, same warmth, same dish type: Group A moist, Group B dry. Measure: number germinated after 5 days.',
  'Unfair version: different seed types and different water. Fix it.',
  'Use the same seed type; change only water (or only light in a different test).',
  'Changing water and temperature together hides which factor mattered.',
  'Plan and run a fair seed-needs test. List constants, the one change and the measure. Conclude with numerical evidence.'),
L('s2-sci-y3-w33-l1',SCI,['growth','measure','time','record'],
  'Plant growth over time is tracked with regular measurements (height, leaf count) recorded in a table or simple graph.',
  'Day 0: 0 cm shoot. Day 3: 2 cm. Day 7: 5 cm. Same plant, same ruler method, same time of day if possible.',
  'Why measure from soil line to tip each time rather than guessing “bigger”?',
  'Numbers let you compare days fairly and spot growth rate.',
  'Watering some days with a flood and others not without notes confuses growth causes.',
  'Measure one plant for two weeks (or use class data). Table + line sketch graph. Write two sentences about the growth pattern.'),
L('s2-sci-y3-w33-l2',SCI,['garden','care','water','weed'],
  'Caring for a class garden includes watering wisely, weeding gently, observing pests and recording jobs so plants stay healthy.',
  'Roster: Mon water if dry; Wed weed; Fri measure. Overwatering can harm as much as drought. Wash hands after soil work.',
  'Write three care jobs and one safety/hygiene rule for a garden session.',
  'e.g. water, weed, harvest check; wash hands / tools put away.',
  'Pulling unknown plants roughly can destroy wanted seedlings.',
  'Create a two-week garden care plan with roles. Complete at least three real care actions with a signed log (adult). Note one plant health observation.'),
L('s2-sci-y3-w34-l1',SCI,['farm to table','transport','process','steps'],
  'Farm-to-table traces steps from growing/raising food through processing, transport, shops and cooking to the plate.',
  'Milk: cow → milking → tanker → factory (pasteurise) → bottles → shop → fridge → glass. Each step needs people and energy.',
  'Order: wheat harvested; bread baked; flour milled; sandwich eaten; loaf transported to shop.',
  'Harvested → milled → baked → transported → eaten (typical).',
  'Skipping processing steps for foods that need them (raw flour as bread) is inaccurate.',
  'Pick two foods. Flowchart farm-to-table for each (at least five steps). Mark where processing happens.'),
L('s2-sci-y3-w34-l2',SCI,['hygiene','safe','prepare','clean'],
  'Preparing a healthy food item safely means clean hands/surfaces, adult knife rules, separating raw meats if used and choosing mostly everyday healthy ingredients.',
  'Fruit kebabs: wash fruit, clean board, adult cuts, kids assemble with blunt skewers if allowed. No licking shared utensils.',
  'List four safety/hygiene steps before making a yoghurt-and-fruit cup.',
  'Wash hands; clean bench; wash fruit; use clean spoons; refrigerate if not eating soon.',
  'Tasting from the mixing spoon used by everyone spreads germs.',
  'With an adult, prepare one simple healthy snack. Write the recipe steps and tick hygiene/safety checks you used. Photo optional.'),
L('s2-sci-y3-w35-l1',SCI,['waste','leftover','compost','plan'],
  'Reducing food waste means planning portions, storing leftovers safely, composting scraps where possible and eating food before it spoils.',
  'Cook only what you need; store leftovers in sealed containers in the fridge; compost fruit peels if you have a system; freeze bread nearing stale.',
  'Sort help/hurt waste: buying huge bags you cannot finish; packing uneaten lunch home; composting peels.',
  'Hurt; help; help.',
  'Throwing edible leftovers “because we have more” still wastes resources used to grow the food.',
  'Do a three-day personal or class food-waste tally (types, not digging bins unsafely). Propose three reduce actions and try two. Report what changed.'),
L('s2-sci-y3-w35-l2',SCI,['review','food','seed','garden'],
  'Food and agriculture review connects sources, Australian farms, germination tests, growth records, garden care, farm-to-table and waste reduction.',
  'Review path: source → farm region → fair seed test → growth measure → farm-to-table → less waste.',
  'Mini: plant source food; fair-test constant; one hygiene step; one waste-reduce action.',
  'e.g. apple; same seed type; wash hands; pack leftovers.',
  'Review without farm-to-table steps is incomplete.',
  'Complete a 12-item food unit review. Include one flowchart. List two next goals.'),
L('s2-sci-y3-w36-l1',PQU,['question','scientific','testable','wonder'],
  'Working scientifically starts with questions that can be investigated with observations or fair tests — not only yes/no opinions.',
  'Testable: Which paper towel absorbs more water drops in 30 seconds? Weak: Which colour is the prettiest towel?',
  'Rewrite: “Are magnets cool?” into a testable question about magnet strength or materials.',
  'e.g. Which material does this magnet attract from the furthest distance?',
  'Questions about beauty alone are not scientific tests.',
  'Write eight questions; star the testable ones; improve three weak ones. Choose one starred question for the next planning lesson.'),
L('s2-sci-y3-w36-l2',PQU,['fair test','plan','variable','method'],
  'Planning a fair test states the question, what you will change, what you will keep the same, what you will measure and how you will stay safe.',
  'Plan template: Question / Change / Same / Measure / Safety / Prediction. Example filled for paper towel absorbency.',
  'Fill the template for: Does ramp height change how far a car travels?',
  'Change height; same car/release; measure distance; safety for cars/ramps; prediction linked to height.',
  'A plan without a measure cannot show results clearly.',
  'Complete a full fair-test plan for your chosen question. Get an adult safety OK. Prepare a blank results table for next lesson.'),
]

VISUALS = {
 's2-sci-y3-w31-l1': [pair_visual('Plant foods','wheat apple lettuce','Animal foods','milk meat eggs','Food sources.','Supermarket is not the origin.'),
  pair_visual('Meal map','item → source','Arrows','farm to plate','Tracing a meal.','Three items mapped.')],
 's2-sci-y3-w31-l2': [pair_visual('Climate','shapes what grows','Region','product match','Australian farms.','Not every farm grows the same.'),
  pair_visual('Bananas','warm north','Alpine','too cold for bananas','Climate example.','Table three products.')],
 's2-sci-y3-w32-l1': [pair_visual('Germinate','seed starts growing','Needs','water warmth air','Germination idea.','Then light for seedlings.'),
  pair_visual('Wet cotton','more sprouts','Dry cotton','few/none','Condition evidence.','Daily diary sketches.')],
 's2-sci-y3-w32-l2': [pair_visual('Fair seed test','one change only','Same','seed type warmth','Fair germination test.','Measure sprout counts.'),
  pair_visual('Unfair','different seeds + water','Fix','same seeds','Repairing unfair plans.','Conclude with numbers.')],
 's2-sci-y3-w33-l1': [pair_visual('Measure','height / leaves','Same method','each day','Growth over time.','Numbers beat “bigger”.'),
  pair_visual('Table','day vs height','Graph','line sketch','Growth display.','Two pattern sentences.')],
 's2-sci-y3-w33-l2': [pair_visual('Care jobs','water weed observe','Hygiene','wash hands','Garden care.','Gentle weeding.'),
  pair_visual('Roster','roles across days','Log','signed actions','Care planning.','Note plant health.')],
 's2-sci-y3-w34-l1': [pair_visual('Farm','grow / raise','Process','factory steps','Farm-to-table chain.','People at each step.'),
  pair_visual('Transport','to shops','Plate','cook and eat','Later chain steps.','Five+ steps per food.')],
 's2-sci-y3-w34-l2': [pair_visual('Clean hands','clean board','Adult','knife jobs','Safe food prep.','No shared licking spoons.'),
  pair_visual('Healthy snack','fruit / yoghurt idea','Ticks','hygiene checks','Prep checklist.','Adult with you.')],
 's2-sci-y3-w35-l1': [pair_visual('Reduce waste','plan portions','Store','safe leftovers','Food waste actions.','Compost scraps if you can.'),
  pair_visual('Tally','three-day types','Actions','try two changes','Waste investigation.','Resources grew that food.')],
 's2-sci-y3-w35-l2': [pair_visual('Review path','source → farm → seed test','Then','growth → plate → waste','Food unit review.','Include a flowchart.'),
  pair_visual('Mini','plant food; same seeds','Hygiene','wash hands','Compact food review.','List next goals.')],
 's2-sci-y3-w36-l1': [pair_visual('Testable','can observe/measure','Weak','only opinion/pretty','Scientific questions.','Star testable ones.'),
  pair_visual('Rewrite','cool magnets?','Better','attract from how far?','Improving questions.','Choose one for planning.')],
 's2-sci-y3-w36-l2': [pair_visual('Plan','change / same / measure','Safety','adult OK','Fair-test plan parts.','Blank results table ready.'),
  pair_visual('Ramp example','change height','Measure','distance','Filled plan idea.','No measure → unclear results.')],
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
