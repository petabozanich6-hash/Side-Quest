#!/usr/bin/env python3
"""Year 7 Food Technology batch 02: nutrition and health (12 lessons)."""
import sys
from pathlib import Path

ROOT = Path('/Users/petab/Side-Quest/.worktrees/parallel-workers')
sys.path.insert(0, str(ROOT / 'scripts/gold-pipeline'))
from elective_batch import write_elective_batch
from written_bundle import pair_visual

CODE = 'FT5-NUT-01'
SUBJECT = 'technology'
SOURCE = 'https://curriculum.nsw.edu.au/learning-areas/tas/food-technology-7-10-2025/outcomes'
NOTE = (
    'Proposed Year 7 alignment. Food Technology 7–10 (2025) Stage 4 may adjust Stage 5 '
    'outcomes (FT4-ADJ-01). Content-point mapping pending. Not NESA verified. Not medical advice. '
    'Practical cooking optional and adult-supervised.'
)
OUT = ROOT / 'lesson-pipeline/workers/builder-s4-food/authored'


def spec(seed, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(
        seed_key=seed, code=CODE, subject=SUBJECT, vocab=vocab,
        principle=principle, model=model, guided=guided, feedback=feedback,
        misconception=misconception, independent=independent,
    )


def visuals(left, right, alt, caption, left2, right2, alt2, caption2):
    return [
        pair_visual(left[0], left[1], right[0], right[1], alt, caption),
        pair_visual(left2[0], left2[1], right2[0], right2[1], alt2, caption2),
    ]


LESSONS = [
    spec(
        's5-food-technology-y9-w11-l1',
        ['nutrient', 'energy', 'function', 'food group'],
        'Nutrients are substances in food that the body uses for energy, growth, and repair. '
        'Energy nutrients (mainly carbohydrates and fats) fuel activity; protein supports growth and repair; '
        'vitamins and minerals support many body functions in smaller amounts. '
        'Food groups help you build variety rather than relying on one food for everything.',
        'A grain sandwich supplies carbohydrate for energy; cheese or egg adds protein for repair; salad adds vitamins. '
        'Together they cover more functions than a single packet snack that is mostly one nutrient type.',
        'Match: carbohydrate → energy for play; protein → growth/repair; vitamin-rich vegetables → supporting functions. Which lunch better covers all three: fruit + yoghurt + bread, or only lollies?',
        'Fruit + yoghurt + bread covers carbohydrate, protein, and micronutrients better than lollies alone.',
        'Thinking one “superfood” replaces a balanced mix. Variety across the day matters more than one trendy item.',
        'Design a simple lunch with one energy food, one protein food, and one vitamin-rich food. Label each role in a short sentence. Not medical advice.',
    ),
    spec(
        's5-food-technology-y9-w11-l2',
        ['Australian Guide', 'serve', 'variety', 'everyday'],
        'National healthy eating guidance groups foods and suggests relative amounts for everyday eating. '
        'Classroom work uses the idea of variety and “mostly everyday foods,” not exact medical meal plans. '
        'Occasional foods can fit sometimes; they should not crowd out everyday foods at every meal.',
        'A day with vegetables, fruit, grains, and a protein food shows variety. '
        'A day of only chips and soft drink shows occasional foods crowding out everyday foods.',
        'Which pattern better matches everyday variety: porridge + fruit + milk, or three sugary drinks and no fruit?',
        'Porridge, fruit, and milk include grains, fruit, and a dairy/protein-style food — closer to everyday variety.',
        'Treating “occasional” as “every afternoon because it is small.” Frequency still matters.',
        'List four everyday foods and two occasional foods for a teen day. Star the everyday list and explain one reason variety matters.',
    ),
    spec(
        's5-food-technology-y9-w12-l1',
        ['carbohydrate', 'fibre', 'wholegrain', 'fuel'],
        'Carbohydrates are a main fuel source. Fibre (in many plant foods and wholegrains) supports digestive health and helps meals feel satisfying. '
        'Wholegrain choices usually keep more fibre than heavily refined versions of the same food.',
        'Wholegrain toast with banana provides carbohydrate fuel plus fibre. '
        'A large serve of soft drink provides carbohydrate energy with little fibre, so it fuels quickly but does not build the same satisfying meal pattern.',
        'Which option likely includes more fibre with its carbohydrate: brown rice with vegetables, or a large lemonade only?',
        'Brown rice with vegetables includes fibre from grains and plants; lemonade is mostly sugar water without fibre.',
        'Assuming all carbohydrates are “bad.” The body needs fuel; the pattern and fibre matter.',
        'Compare two carbohydrate foods: name which is more wholegrain/fibre-rich and give one reason for an active school afternoon.',
    ),
    spec(
        's5-food-technology-y9-w12-l2',
        ['protein', 'repair', 'sources', 'plant'],
        'Protein supports growth and repair. Sources include eggs, dairy, meat, fish, beans, lentils, tofu, and nuts/seeds (school allergy rules apply). '
        'Plant proteins can be part of healthy patterns; variety still matters.',
        'After sport, a bean quesadilla or yoghurt with fruit supplies protein for repair plus other nutrients. '
        'Relying only on a protein powder drink skips the fibre and micronutrients whole foods can add — and needs adult guidance.',
        'Name two protein sources suitable for a school lunchbox (allergy-safe in general terms) and the shared job they do.',
        'Examples: yoghurt and egg; beans and cheese. Shared job: growth/repair support as protein foods.',
        'Believing only meat counts as protein. Many plant and dairy foods also provide protein.',
        'Plan a protein-including snack for after sport using everyday foods. Note one allergy/safety check you would confirm with an adult.',
    ),
    spec(
        's5-food-technology-y9-w13-l1',
        ['fat', 'unsaturated', 'saturated', 'small amounts'],
        'Fats supply energy and help absorb some vitamins. Guidance usually prefers mostly unsaturated sources from foods like avocado, nuts, seeds, and oily fish, '
        'while keeping large amounts of saturated fat and deep-fried patterns less frequent. '
        'This is food technology literacy, not a personal medical prescription.',
        'Avocado on wholegrain toast uses a food fat with other nutrients. '
        'Eating only deep-fried snacks every day is a pattern that piles saturated/trans-style cooking fats without much variety.',
        'Which pattern better matches “mostly everyday fats from foods”: nuts in a trail mix a few times a week, or deep-fried food at every meal?',
        'Nuts in a mixed snack a few times a week fit an everyday pattern better than deep-fried food at every meal.',
        'Trying to remove all fat from the diet. Some fat is useful; the pattern and amount matter.',
        'Give one everyday fat-containing food and one “less often” fried example. Write one sentence on pattern, not perfection.',
    ),
    spec(
        's5-food-technology-y9-w13-l2',
        ['hydration', 'water', 'thirst', 'activity'],
        'Water is the everyday drink for hydration. Thirst, heat, and activity increase fluid needs. '
        'Sugary drinks add energy without the same hydration-first habit. '
        'Sports drinks are not required for ordinary school sport for most students — adults advise for special cases.',
        'On a warm PE day, carrying a water bottle and drinking across the afternoon supports concentration better than waiting until a headache arrives. '
        'A large soft drink may feel cold but is not the same hydration habit as water.',
        'Choose the better everyday hydration plan for a school day: water bottle refilled, or only soft drink at lunch?',
        'A refilled water bottle is the everyday hydration plan; soft drink alone is not.',
        'Waiting for extreme thirst before drinking anything. Regular sips prevent the crash.',
        'Write a hydration plan for a hot sports carnival day with timing (before / during / after) using water. One sentence on why soft drink is not the main plan.',
    ),
    spec(
        's5-food-technology-y9-w14-l1',
        ['label', 'per serve', 'per 100 g', 'compare'],
        'Nutrition information panels show average values per serve and often per 100 g. '
        'Per 100 g comparisons are fairer when pack serves differ. '
        'Labels support choices; they do not replace allergy checks or medical advice.',
        'Cereal A lists 10 g sugar per 100 g; Cereal B lists 25 g sugar per 100 g. '
        'For a lower-sugar everyday breakfast pattern, A compares better on that measure even if B’s “per serve” looks small because the serve size is tiny.',
        'Why can per 100 g be fairer than per serve when comparing two muesli bars?',
        'Serve sizes can differ; per 100 g uses the same amount of food for both products.',
        'Picking the pack with the biggest front-of-pack health claim without reading the panel.',
        'Using two fictional panels, compare sugar per 100 g and choose the lower one for an everyday snack, with one sentence of working.',
    ),
    spec(
        's5-food-technology-y9-w14-l2',
        ['ingredient list', 'order', 'first ingredients', 'additive'],
        'Ingredients are listed from largest to smallest by weight. '
        'If sugar or salt appears near the front, that food is built heavily from those ingredients. '
        'Additives have roles (colour, preserve); names alone are not a scare story — context and amount matter.',
        'A yoghurt listing “milk, strawberry, sugar…” is mostly dairy. '
        'A drink listing “water, sugar, flavour…” is mostly sweetened water. The order teaches the recipe story.',
        'Ingredient list starts: oil, flour, sugar, cocoa. Which ingredient is present in the greatest amount?',
        'Oil — first position means largest by weight.',
        'Assuming any additive makes food unsafe. Many are regulated; the whole pattern of eating still matters.',
        'Find (or invent) two short ingredient lists. Circle the first ingredient of each and explain what that tells you.',
    ),
    spec(
        's5-food-technology-y9-w15-l1',
        ['breakfast', 'concentration', 'timing', 'balance'],
        'Breakfast after the overnight fast helps many students concentrate. '
        'A balanced breakfast includes a carbohydrate food plus protein or dairy and preferably fruit/vegetables. '
        'Skipping often leads to mid-morning low energy and unplanned snacks.',
        'Oats with milk and fruit covers fuel + protein/dairy + micronutrients. '
        'Only an energy drink provides a jolt without the same staying power or nutrient mix.',
        'Which breakfast better supports a test morning: yoghurt and banana on toast, or no food until recess lollies?',
        'Yoghurt and banana on toast provides a steadier start than skipping until lollies.',
        'Believing breakfast must be hot and complicated. Simple cold options can still be balanced.',
        'Design two different balanced breakfasts that need no cooking. Label fuel and protein/dairy in each.',
    ),
    spec(
        's5-food-technology-y9-w15-l2',
        ['lunch', 'school day', 'food safety', 'prep'],
        'School lunches need food-safety sense: keep cold foods cold, wash fruit, and avoid leaving meat/dairy warm for hours. '
        'A balanced lunchbox mirrors everyday variety in smaller form. '
        'Adults help with prep rules for your kitchen and school policy.',
        'Rice and beans with cut vegetables in a cool pack stay safer and more balanced than a mayonnaise sandwich left in a hot bag all day. '
        'An ice brick supports the cold chain for dairy or leftovers.',
        'Name two lunchbox food-safety habits and one balanced food combo for a school day.',
        'Habits: keep cold foods chilled; wash produce. Combo example: wholegrain wrap + protein filling + fruit.',
        'Assuming “if it smells fine it is safe” after hours in heat. Many unsafe foods do not smell obvious.',
        'Plan a lunchbox with one safety step (cooling/washing) and three food items covering everyday variety. Note adult supervision for prep.',
    ),
    spec(
        's5-food-technology-y9-w16-l1',
        ['advertising', 'health halo', 'persuasion', 'evidence'],
        'Food ads use colour, characters, and health halos (“natural,” “energy”) to persuade. '
        'Critical viewers check the label and the everyday pattern, not only the slogan. '
        'Marketing literacy is part of food technology, not cynicism for its own sake.',
        'A cereal box shouts “source of vitamins” while sugar is high per 100 g. '
        'The halo is the vitamin claim; the panel evidence may still show it is an occasional-style cereal for everyday breakfast.',
        'What should you check when an ad says “healthy energy” for a sugary drink?',
        'Check the nutrition panel and ingredient order — and whether water would meet the hydration need better.',
        'Trusting cartoon characters as nutrition experts. Characters sell; panels inform.',
        'Rewrite a pushy snack ad into a factual two-line label summary (sugar per 100 g + first ingredient). Invent fair numbers.',
    ),
    spec(
        's5-food-technology-y9-w16-l2',
        ['personal goal', 'small change', 'review', 'support'],
        'Nutrition goals for teens work best as small, specific changes (add fruit to lunch, drink water at recess) with adult/school support. '
        'Review after a week: what worked, what blocked you. '
        'Goals are not punishments and must respect culture, budget, and medical needs.',
        'Goal: carry water every day for one week. Review: five days succeeded; two days forgot bottle — next step is packing it beside the keys. '
        'Evidence beats a vague “eat better” promise.',
        'Why is “never eat sugar again starting tomorrow” usually weaker than “swap one soft drink for water at lunch four days this week”?',
        'Tiny specific swaps are measurable and sustainable; absolute bans often collapse and ignore balance.',
        'Setting a goal that ignores allergy, culture, or budget. Real plans fit real households.',
        'Write one specific one-week food or drink goal, one support you need from an adult, and one review question for Friday.',
    ),
]

VISUALS = {seed: visuals(
    ('Idea', 'A'), ('Compare', 'B'),
    'Two food choices side by side for the lesson idea.',
    'Compare using the taught nutrition idea.',
    ('Check', 'label/habit'), ('Decide', 'everyday pattern'),
    'Use evidence from labels or habits before deciding.',
    'Not medical advice — classroom food literacy.',
) for seed in [
    's5-food-technology-y9-w11-l1', 's5-food-technology-y9-w11-l2',
    's5-food-technology-y9-w12-l1', 's5-food-technology-y9-w12-l2',
    's5-food-technology-y9-w13-l1', 's5-food-technology-y9-w13-l2',
    's5-food-technology-y9-w14-l1', 's5-food-technology-y9-w14-l2',
    's5-food-technology-y9-w15-l1', 's5-food-technology-y9-w15-l2',
    's5-food-technology-y9-w16-l1', 's5-food-technology-y9-w16-l2',
]}

# Replace with more specific captions for key lessons
VISUALS['s5-food-technology-y9-w11-l1'] = visuals(
    ('Fuel', 'grains'), ('Repair', 'protein food'),
    'Energy food beside protein food in one lunch.',
    'Different nutrients do different jobs.',
    ('Vitamins', 'veg/fruit'), ('Not only', 'one snack'),
    'Add plant colour for micronutrients.',
    'Variety beats a single snack type.',
)
VISUALS['s5-food-technology-y9-w14-l1'] = visuals(
    ('Per 100 g', 'compare'), ('Per serve', 'may differ'),
    'Per 100 g aligns the amount of food compared.',
    'Fair comparisons use the same base amount.',
    ('Sugar', '10 g vs 25 g'), ('Choose', 'lower for everyday'),
    'Panel numbers guide the everyday choice.',
    'Labels inform — they are not medical orders.',
)


if __name__ == '__main__':
    written = write_elective_batch(
        LESSONS, VISUALS, subject=SUBJECT, source_url=SOURCE, source_note=NOTE, out_dir=OUT,
    )
    print({'wrote': len(written), 'seeds': written})
