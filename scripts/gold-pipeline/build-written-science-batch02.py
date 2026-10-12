#!/usr/bin/env python3
"""Year 3 Science Written Core batch 02: materials finish + structures start w07-l1 through w12-l2 (12)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

SCI, PQU, DDT = 'ST2-SCI-01', 'ST2-PQU-01', 'ST2-DDT-01'

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, subject='science', vocab=vocab,
                principle=principle, model=model, guided=guided, feedback=feedback,
                misconception=misconception, independent=independent)

LESSONS = [
L('s2-sci-y3-w07-l1',SCI,['natural','processed','made','origin'],
  'Natural materials come from Earth or living things with little change (wood, cotton, stone). Made/processed materials are changed by people (plastic, glass, paper, metal alloys).',
  'Cotton on a plant is natural; a cotton T-shirt is processed. Sand is natural; glass made from sand is processed. Plastic is made from resources changed in factories.',
  'Sort: wool fleece; plastic bottle; clay brick; steel nail. Natural vs made/processed.',
  'Fleece natural; bottle made; brick processed from clay; nail made/processed metal.',
  'Calling everything in a shop “natural” because it came from somewhere once erases processing.',
  'Sort twenty materials into natural / processed-or-made. For six items write the likely origin and one change people made.'),
L('s2-sci-y3-w07-l2',SCI,['sort','property','group','rule'],
  'Sorting materials by properties uses a clear rule (for example waterproof vs absorbent) so every item has a place.',
  'Rule: floats or sinks in water. Cork floats; coin sinks. Another rule: transparent / opaque. Clear cup vs wooden block.',
  'Make two groups for: foil, tissue, rubber glove, ceramic mug using “flexible vs rigid”. Where does each go?',
  'Foil and glove flexible; mug rigid; tissue flexible (tears) — accept reasoned placements.',
  'Sorting by colour when the question asks for strength mixes property types.',
  'Create three different property sorts for the same twelve materials. Write the rule above each sort. Photograph or sketch one finished sort.'),
L('s2-sci-y3-w08-l1',SCI,['waterproof','absorbent','test','observe'],
  'Waterproof materials keep water out; absorbent materials soak water in. Test with drops on scrap samples and record what happens.',
  'Drop on plastic lid: bead sits → waterproof. Drop on paper towel: spreads and soaks → absorbent. Fabric may be in between.',
  'Predict and test (adult help): sandwich bag; kitchen sponge; cardboard. Waterproof, absorbent, or mixed?',
  'Bag waterproof; sponge absorbent; cardboard partly absorbent then softens.',
  'Pouring cups of water on furniture is unsafe and unnecessary for the test.',
  'Test eight scrap materials with three drops each. Record prediction, result and waterproof/absorbent/mixed. Name the best material for a rain hat and why.'),
L('s2-sci-y3-w08-l2',PQU,['fair test','variable','same','compare'],
  'A fair test changes only one variable at a time and keeps other conditions the same so comparisons are meaningful.',
  'Question: Which material is most waterproof? Same drop size, same time, different materials only. Measuring: how far the wet patch spreads after 30 seconds.',
  'Spot the unfair part: testing plastic with 1 drop and cloth with a cup of water. How do you fix it?',
  'Use the same amount of water and same time for every material.',
  'Changing material and water amount together makes the winner unclear.',
  'Plan and run a fair waterproof test for three materials. List what you kept the same, what you changed and how you measured. Conclude with evidence.'),
L('s2-sci-y3-w09-l1',SCI,['purpose','choose','property','fit'],
  'Choosing materials for a purpose means matching needed properties to the job (umbrella needs waterproof; towel needs absorbent).',
  'Window: transparent + rigid (glass). Raincoat: waterproof + flexible. Cutting board: hard + not easily absorbent.',
  'Choose materials for: lunch box; bandage; garden stake. Name two needed properties each.',
  'Lunch box rigid/waterproof; bandage soft/absorbent/flexible; stake rigid/weather-resistant — accept reasoned matches.',
  'Choosing only by favourite colour ignores the job the object must do.',
  'For six products, list purpose, two needed properties and a suitable material. Redesign one poor choice and say which property improves.'),
L('s2-sci-y3-w09-l2',DDT,['design','brief','material','reason'],
  'A design brief states the job, users and constraints. Material choices must be justified with properties, not only looks.',
  'Brief: carry wet paintbrushes without leaking. Constraint: reuse scrap. Choice: plastic tub (waterproof, rigid) with cardboard divider (separates brushes).',
  'Brief: keep a snack cool for 1 hour in a bag. Suggest materials and reasons.',
  'Insulating wrap + waterproof outer; reasons link to keeping cool and dry.',
  'Decorating first and picking materials last often fails the brief.',
  'Write a brief for a useful classroom object. Sketch labelled materials with property reasons. Build a simple prototype from scrap if allowed and note one improvement.'),
L('s2-sci-y3-w10-l1',SCI,['recycle','reuse','reduce','waste'],
  'Reduce means use less; reuse means use again; recycle means process into new materials. Each action manages waste differently.',
  'Reuse a jar for pencils. Recycle clean paper into new paper at a facility. Reduce by taking a refillable bottle instead of many single-use bottles.',
  'Label reduce/reuse/recycle: washing a yoghurt tub for craft; putting bottles in the yellow bin; packing a smaller lunch with less wrap.',
  'Reuse; recycle; reduce.',
  'Putting dirty or wrong items in recycling can spoil a whole batch — cleaning and sorting matter.',
  'Audit home or class rubbish ideas (no digging in bins unsafely): list five reduce, five reuse, five recycle actions. Make a poster with one tip for correct recycling.'),
L('s2-sci-y3-w10-l2',SCI,['review','material','property','fair test'],
  'Materials unit review connects properties, natural/made, waterproof tests, fair testing, purpose matching and reduce/reuse/recycle.',
  'Review path: name properties → natural vs made → fair waterproof test → choose for purpose → waste action.',
  'Mini: flexible example; fair-test same condition; material for raincoat; reuse example.',
  'e.g. rubber band; same water amount; waterproof fabric/plastic; jar for storage.',
  'Review without naming properties is incomplete.',
  'Complete a 12-item materials review. Include one fair-test plan outline. List two next goals.'),
L('s2-sci-y3-w11-l1',DDT,['structure','support','load','parts'],
  'A structure is something built to support a load or enclose space — bridges, buildings, chairs, nests. Parts work together for strength and stability.',
  'A chair: legs support seat load; braces stop wobble. A bird nest: woven twigs create a bowl shape that holds eggs.',
  'Name structure vs not: bookshelf; pile of loose leaves; bridge; handful of sand. Why?',
  'Bookshelf and bridge are structures; loose leaves/sand are not organised to support a designed load (nest can be a natural structure).',
  'Calling any pile a structure ignores how parts are arranged to support.',
  'Photograph or sketch five structures. Label parts that support load. Write one sentence on how parts work together for each of three structures.'),
L('s2-sci-y3-w11-l2',DDT,['natural','built','compare','purpose'],
  'Natural structures (termite mounds, spider webs, honeycomb) and built structures (houses, towers) both solve support and shelter problems with different materials.',
  'Honeycomb hexagons pack strongly with little wax. Built brick wall uses stacked units and mortar. Both enclose space.',
  'Compare a tree and a wooden pole building: materials, who/what made it, purpose.',
  'Tree grows/natural support and habitat; pole building is human-built for shelter — purposes may overlap (shade/shelter).',
  'Thinking natural structures are “not real engineering” ignores how effective their shapes are.',
  'Make a Venn diagram: natural structures / both / built structures with six examples. Write two shared purposes across the diagram.'),
L('s2-sci-y3-w12-l1',DDT,['triangle','arch','strength','shape'],
  'Some shapes are stronger for their material use: triangles brace frames; arches spread force downward and outward along a curve.',
  'A square frame alone can skew into a diamond; add a diagonal → triangles → much stiffer. A cardboard arch can hold more than a flat card span of the same piece.',
  'Predict: which holds more books — flat card bridge or card folded into a triangular prism tube? Why?',
  'Triangular/tube forms usually stronger because sides brace; flat card bends easily.',
  'Assuming thicker always beats smarter shape misses why engineers use triangles.',
  'Build paper/straw models of square vs triangulated frame (adult help for scissors). Test gently with coins. Record which held more and why using shape language.'),
L('s2-sci-y3-w12-l2',PQU,['test','strength','measure','fair'],
  'Testing shape strength needs a fair method: same materials amount where possible, same span, same way of adding load, and a clear measure (coins until collapse).',
  'Test: two bridges, same card length, same gap between books. Add 5-cent coins one at a time in the centre until sag fails. Record counts.',
  'What must stay the same when comparing arch vs flat span? What is the one change?',
  'Same span, same card type/size, same load place; change = shape only.',
  'Pushing harder on the shape you dislike makes the test unfair.',
  'Run a fair strength test of two shapes. Table: shape, coins held, observation. Conclude which was stronger with evidence and one improvement to the method.'),
]

VISUALS = {
 's2-sci-y3-w07-l1': [pair_visual('Natural','little change from Earth/life','Made','changed by people','Natural vs made materials.','Processing changes the material.'),
  pair_visual('Cotton plant','natural fibre','T-shirt','processed fabric','Origin versus product.','Shop item ≠ always natural.')],
 's2-sci-y3-w07-l2': [pair_visual('Sort rule','one clear property','Every item','has a place','Property sorting.','Colour ≠ strength rule.'),
  pair_visual('Float / sink','cork vs coin','Flexible / rigid','glove vs mug','Example sort rules.','Write the rule above the groups.')],
 's2-sci-y3-w08-l1': [pair_visual('Waterproof','water beads on top','Absorbent','water soaks in','Waterproof vs absorbent.','Drops on scrap samples only.'),
  pair_visual('Plastic lid','waterproof','Paper towel','absorbent','Drop-test evidence.','Do not soak furniture.')],
 's2-sci-y3-w08-l2': [pair_visual('Fair test','change one variable','Keep same','drop size and time','Fair-test idea.','Same water for every material.'),
  pair_visual('Unfair','1 drop vs a cup','Fix','equal amounts','Spotting unfair comparisons.','Measure the wet patch.')],
 's2-sci-y3-w09-l1': [pair_visual('Purpose','job of the object','Properties','needed for the job','Matching materials to purpose.','Colour alone is not enough.'),
  pair_visual('Raincoat','waterproof + flexible','Window','transparent + rigid','Purpose–property pairs.','Redesign weak choices.')],
 's2-sci-y3-w09-l2': [pair_visual('Brief','job + users + limits','Materials','justified by properties','Design brief structure.','Looks come after function.'),
  pair_visual('Prototype','scrap build','Improve','one change next','Brief to prototype path.','Label property reasons.')],
 's2-sci-y3-w10-l1': [pair_visual('Reduce','use less','Reuse','use again','Waste action meanings.','Recycle needs clean sorting.'),
  pair_visual('Recycle','process into new','Example','clean bottle in bin','Three R actions.','Dirty items can spoil recycling.')],
 's2-sci-y3-w10-l2': [pair_visual('Review path','properties → natural/made','Then','fair test → purpose → waste','Materials unit review.','Name properties in answers.'),
  pair_visual('Mini','flexible; same water; raincoat','Reuse','jar storage','Compact materials review.','List next goals.')],
 's2-sci-y3-w11-l1': [pair_visual('Structure','parts support a load','Chair','legs + seat + braces','What counts as a structure.','Arrangement matters.'),
  pair_visual('Nest','woven bowl','Bridge','span + supports','Natural and built examples.','Label load-bearing parts.')],
 's2-sci-y3-w11-l2': [pair_visual('Natural','honeycomb / web','Built','house / tower','Natural vs built structures.','Both solve support problems.'),
  pair_visual('Shared','shelter / strength','Venn','natural · both · built','Comparing structure types.','Shapes can be highly effective.')],
 's2-sci-y3-w12-l1': [pair_visual('Triangle','braces a frame','Arch','spreads force along curve','Strong shapes.','Shape can beat thickness.'),
  pair_visual('Square alone','can skew','+ diagonal','triangles stiffen','Frame bracing idea.','Test with gentle coin loads.')],
 's2-sci-y3-w12-l2': [pair_visual('Fair strength test','same span and card','Change','shape only','Strength test controls.','Add coins the same way.'),
  pair_visual('Measure','coins until fail','Record','counts + observation','Evidence from strength tests.','Do not push unfairly.')],
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
