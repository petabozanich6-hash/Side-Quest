#!/usr/bin/env python3
"""Year 3 Science Written Core batch 01: living things + materials start w01-l1 through w06-l2 (12)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

SCI, PQU = 'ST2-SCI-01', 'ST2-PQU-01'

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, subject='science', vocab=vocab,
                principle=principle, model=model, guided=guided, feedback=feedback,
                misconception=misconception, independent=independent)

LESSONS = [
L('s2-sci-y3-w01-l1',SCI,['living','non-living','observe','feature'],
  'Living things typically move (themselves or parts), grow, need food/energy and water, sense surroundings and reproduce. Non-living things do not do all of these.',
  'A worm moves, grows, eats and can reproduce → living. A rock does not grow or reproduce → non-living. A wooden chair was once living material but is not a living thing now.',
  'Sort: leaf on a tree; fallen dry leaf; bicycle; frog. Which are living things right now?',
  'Leaf on tree and frog are living; dry leaf and bicycle are non-living (leaf was part of a living plant).',
  'Thinking anything that moves is living (cars) or anything green is living (plastic plant) mixes up features.',
  'Observe eight local items. Record living/non-living with two features as evidence for each. Write one borderline case and how you decided.'),
L('s2-sci-y3-w01-l2',SCI,['observe','habitat','record','senses'],
  'Outdoor observation of living things uses careful looking/listening, safety rules and recorded evidence (sketches, labels, counts) rather than guessing.',
  'In a garden: ant trail on path; bird in tree; weeds in soil. Record where seen, what it was doing, and one feature (legs, wings, leaves).',
  'Plan a 10-minute yard or park observation: what will you look for? How will you record without disturbing animals?',
  'Look for plants/insects/birds; use a table (what / where / doing); watch quietly; do not touch unknown animals.',
  'Chasing or collecting without permission harms animals and ruins calm observation.',
  'Complete a supervised outdoor observation of at least six living things. Use a table. Sketch two. Write two safety rules you followed.'),
L('s2-sci-y3-w02-l1',SCI,['classify','plant','animal','group'],
  'Classification groups living things by shared features (for Year 3: plants vs animals; then simpler subgroups like insects vs birds).',
  'Plants typically make their own food and stay rooted; animals typically move to find food. Ants and beetles both have six legs → insects group.',
  'Sort: rose bush; sparrow; spider; grass. First into plant/animal, then note one finer feature for the animals.',
  'Rose and grass = plants; sparrow and spider = animals; sparrow has feathers/wings; spider has eight legs (not an insect).',
  'Putting spiders with insects because both are “creepy” ignores the leg-count feature scientists use.',
  'Classify sixteen picture or word cards into plant/animal, then make two animal subgroups with a written feature rule for each subgroup.'),
L('s2-sci-y3-w02-l2',SCI,['key','yes/no','feature','branch'],
  'A simple classification key asks yes/no feature questions that split groups until each living thing is identified.',
  'Key start: Does it have legs? Yes → How many? Six → insect path. No legs → plant or worm path. Each question must use an observable feature.',
  'Build two questions to separate: ant, sparrow, rose. What first question works?',
  'e.g. “Does it have wings?” or “Is it a plant?” — then a second question for the remaining pair.',
  'Questions about “cute” or “scary” are not scientific key features.',
  'Make a yes/no key for six local living things. Test it with a partner. Fix any question that does not split the group cleanly.'),
L('s2-sci-y3-w03-l1',SCI,['adaptation','feature','survive','environment'],
  'Adaptations are features that help a living thing survive in its environment (body parts or behaviours).',
  'A duck’s webbed feet help swimming. A cactus stores water in dry places. Nocturnal animals feed at night when it is cooler or safer.',
  'Match feature→help: thick fur; long beak for nectar; sharp claws for climbing. Invent one feature for a desert animal and say how it helps.',
  'Fur→warmth; beak→reach flowers; claws→grip. Desert idea must link to heat/water/food.',
  'Calling every pretty colour an adaptation without saying how it helps is incomplete.',
  'For eight animals, record one adaptation and how it helps survival. Design a labelled “invented animal” for a named habitat with three justified features.'),
L('s2-sci-y3-w03-l2',SCI,['habitat','shelter','food','water'],
  'A habitat is where a living thing finds the food, water, shelter and space it needs. Different habitats suit different features.',
  'Pond habitat: frogs need water for breeding; reeds for shelter. Desert habitat: sparse plants, animals active at cooler times.',
  'For a local bird, list habitat needs: food, water, shelter, space. What would happen if shelter trees were removed?',
  'Needs depend on species; removing shelter can force animals to leave or struggle.',
  'Thinking habitat means only “a pretty place” ignores food and water needs.',
  'Choose three living things. Complete a habitat needs table. Write one sentence about how a change in the habitat could affect each.'),
L('s2-sci-y3-w04-l1',SCI,['root','stem','leaf','flower'],
  'Plant parts have jobs: roots take up water and anchor; stems support and transport; leaves capture light for food-making; flowers help reproduction.',
  'Pull (gently, permitted plant): roots below soil; stem upright; leaves along stem; flower/bud at tip. Label a diagram with jobs, not only names.',
  'Name the part: soaks up water; makes food using light; holds the plant up; makes seeds after pollination.',
  'Roots; leaves; stem; flower/fruit stage.',
  'Calling leaves “decoration” misses their food-making job.',
  'Dissect or observe a safe whole plant (or clear photo). Label roots, stem, leaves, flower. Write the job of each part in your own words.'),
L('s2-sci-y3-w04-l2',SCI,['water','light','soil','needs'],
  'Plants typically need water, light, air and nutrients (often from soil) to grow. Missing one need can slow or stop healthy growth.',
  'A seedling in a dark cupboard may grow tall and pale searching for light. A dry pot wilts. Fair comparisons change one need at a time.',
  'Predict: plant A no water; plant B no light; plant C normal care for one week. What differences might you see?',
  'A wilts; B pale/spindly; C greener/healthier — if other conditions match.',
  'Giving opinions without linking to a plant need is not a scientific prediction.',
  'Plan or run a simple needs comparison (with adult help). Record daily observations for five days. Conclude which need was missing using evidence.'),
L('s2-sci-y3-w05-l1',SCI,['investigation','local','evidence','report'],
  'A local living-thing investigation asks a clear question, gathers safe observations and reports evidence-based findings.',
  'Question: Which insects visit our flowering bush in 15 minutes? Method: sit quietly, tally types, sketch two. Finding: “We tallied 11 visits; bees most common (6).”',
  'Write a question about one living thing near you and list three observation steps.',
  'Question must be answerable by looking/counting; steps must be safe and specific.',
  'A question like “Which animal is best?” cannot be answered with fair evidence.',
  'Complete a mini investigation (question, method, results table, two sketches, conclusion with numbers). Include one thing you would improve next time.'),
L('s2-sci-y3-w05-l2',SCI,['review','living','habitat','classify'],
  'Unit review connects living/non-living features, classification, adaptations, habitats and plant parts/needs with evidence language.',
  'Review path: living features → classify with a key → adaptation in a habitat → plant part jobs → local investigation finding.',
  'Mini: living or not for mushroom discussion (living); adaptation for webbed feet; job of roots.',
  'Living; swimming help; take up water/anchor.',
  'Review labels without evidence sentences are weaker.',
  'Complete a 12-item living-things review. For four items write a one-sentence evidence reason. List two next science goals.'),
L('s2-sci-y3-w06-l1',SCI,['material','property','observe','compare'],
  'Materials are what objects are made from. Properties describe how materials behave (hard/soft, flexible/rigid, rough/smooth, transparent/opaque).',
  'A metal spoon is hard and rigid. A rubber band is flexible. Baking paper is flexible and can be opaque. Name the material and at least two properties.',
  'Compare a wooden block and a foam sponge: material names and two properties each.',
  'Wood: hard/rigid (typical); foam: soft/flexible/squishy — accept accurate observed properties.',
  'Naming the object (“cup”) instead of the material (“plastic”) skips the science focus.',
  'Test ten classroom objects. Record object, material guess and three properties each. Sort into two property groups and name the sorting rule.'),
L('s2-sci-y3-w06-l2',SCI,['hard','soft','flexible','rigid'],
  'Hard/soft and flexible/rigid are property pairs tested by gentle presses, bends and scratches only on safe scrap materials with adult rules.',
  'Press thumbnail gently: soft foam dents; hard tile does not. Bend test: pipe cleaner bends (flexible); craft stick resists (rigid) until it snaps — stop before breaking valuables.',
  'Classify: tea towel; ceramic plate; wire; eraser — hard/soft and flexible/rigid.',
  'Towel soft/flexible; plate hard/rigid; wire hard/flexible; eraser soft/flexible (typical).',
  'Bending until things break or scratching furniture is unsafe and not required.',
  'Build a property test table for twelve scrap materials. Use only allowed tests. Write one material that is hard yet flexible and name your evidence.'),
]

VISUALS = {
 's2-sci-y3-w01-l1': [pair_visual('Living','grows, needs energy, reproduces','Non-living','rock / chair','Living vs non-living features.','Use several features, not one.'),
  pair_visual('Worm','living evidence','Plastic plant','non-living look-alike','Feature evidence beats appearance.','Green colour alone is not enough.')],
 's2-sci-y3-w01-l2': [pair_visual('Observe','look and listen quietly','Record','table + sketch','Outdoor observation habits.','Do not disturb animals.'),
  pair_visual('What','ant / bird / weed','Where','path / tree / soil','Recording place and action.','Safety rules stay on.'),
 ],
 's2-sci-y3-w02-l1': [pair_visual('Plant','rooted; makes food','Animal','moves to find food','Plant vs animal grouping.','Use shared features.'),
  pair_visual('Insect','six legs','Spider','eight legs','Finer animal subgroups.','Creepy ≠ insect.')],
 's2-sci-y3-w02-l2': [pair_visual('Key','yes/no feature question','Split','into smaller groups','Classification key structure.','Questions must be observable.'),
  pair_visual('Example','has legs? → how many?','End','named living thing','Branching to an identity.','Cute/scary are not features.')],
 's2-sci-y3-w03-l1': [pair_visual('Adaptation','feature that helps survival','Example','webbed feet → swim','Adaptation meaning.','Link feature to how it helps.'),
  pair_visual('Desert','store water / night activity','Habitat link','feature fits place','Features match environments.','Pretty alone is incomplete.')],
 's2-sci-y3-w03-l2': [pair_visual('Habitat','food water shelter space','Pond','frog needs water + reeds','Habitat needs set.','Pretty place ≠ full habitat.'),
  pair_visual('Change','trees removed','Effect','shelter lost','Habitat change impacts.','Needs table for three species.')],
 's2-sci-y3-w04-l1': [pair_visual('Roots','water + anchor','Leaves','light → food','Plant part jobs.','Names plus jobs.'),
  pair_visual('Stem','support + transport','Flower','reproduction','More plant part jobs.','Leaves are not decoration.')],
 's2-sci-y3-w04-l2': [pair_visual('Needs','water light air nutrients','Missing one','growth suffers','Plant needs overview.','Change one need at a time.'),
  pair_visual('Dark','pale spindly','Dry','wilts','Needs comparison evidence.','Link prediction to a need.')],
 's2-sci-y3-w05-l1': [pair_visual('Question','answerable by observing','Method','tally + sketch','Local investigation plan.','Avoid “which is best?”.'),
  pair_visual('Finding','numbers in conclusion','Improve','next method tweak','Evidence-based report.','Quiet watching helps counts.')],
 's2-sci-y3-w05-l2': [pair_visual('Review path','living → classify → adapt','Then','habitat → plant → investigate','Unit review sequence.','Evidence sentences for four items.'),
  pair_visual('Mini','living; webbed feet; roots','Jobs','swim; take up water','Compact living-things review.','List next goals.')],
 's2-sci-y3-w06-l1': [pair_visual('Material','what it is made from','Property','how it behaves','Materials vs properties.','Name material, not only object.'),
  pair_visual('Metal','hard rigid','Rubber','flexible','Property examples.','Sort by a clear rule.')],
 's2-sci-y3-w06-l2': [pair_visual('Hard / soft','press test','Flexible / rigid','bend test','Safe property tests.','Stop before breaking valuables.'),
  pair_visual('Wire','hard yet flexible','Tile','hard and rigid','Mixed property pairs.','Only scrap materials allowed.')],
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
