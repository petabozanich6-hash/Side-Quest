#!/usr/bin/env python3
"""Year 7 Food Technology batch 01: food safety and hygiene (12 lessons)."""
import sys
from pathlib import Path

ROOT = Path('/Users/petab/Side-Quest/.worktrees/parallel-workers')
sys.path.insert(0, str(ROOT / 'scripts/gold-pipeline'))
from elective_batch import write_elective_batch
from written_bundle import pair_visual

CODE = 'FT5-SAF-01'
SUBJECT = 'technology'
SOURCE = 'https://curriculum.nsw.edu.au/learning-areas/tas/food-technology-7-10-2025/outcomes'
NOTE = (
    'Proposed Year 7 alignment. Food Technology 7–10 (2025) says Stage 4 teachers may '
    'adjust Stage 5 outcomes (FT4-ADJ-01). This lesson uses FT5-SAF-01 as a pending proposal. '
    'The 2019 syllabus remains in teach-out. Not NESA verified. Practical cooking is optional '
    'and adult-supervised.'
)
OUT = ROOT / 'lesson-pipeline/workers/builder-s4-food/authored'


def spec(seed, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(
        seed_key=seed, code=CODE, subject=SUBJECT, vocab=vocab,
        principle=principle, model=model, guided=guided, feedback=feedback,
        misconception=misconception, independent=independent,
    )


def visuals(seed, left, right, alt, caption, left2, right2, alt2, caption2):
    return [
        pair_visual(left[0], left[1], right[0], right[1], alt, caption),
        pair_visual(left2[0], left2[1], right2[0], right2[1], alt2, caption2),
    ]


LESSONS = [
    spec(
        's5-food-technology-y9-w01-l1',
        ['hazard', 'contamination', 'illness', 'control'],
        'Food safety is the set of habits that keep harmful microbes from reaching the food someone eats. '
        'A hazard is anything that could make food unsafe, such as dirty hands, a raw-meat drip, or food left warm for hours. '
        'A control is the action that reduces that hazard. Year 7 students start by naming the hazard before they choose the control, '
        'because a tidy bench is not the same thing as a safe process.',
        'Hazard: raw chicken juice on a board that will next hold salad. Control: wash the board with hot soapy water, or use a separate board, before the salad touches it. '
        'The hazard is the juice, not the fact that chicken is a normal food.',
        'A student sneezes over a plate of cut fruit, then says the fruit is fine because it looks clean. Name the hazard and one control.',
        'Hazard: droplets from the sneeze can land on ready-to-eat fruit. Control: throw that fruit away or compost it, wash hands, and cut a fresh piece. Looking clean does not remove contamination.',
        'Thinking food is safe whenever it still looks and smells normal. Many unsafe changes cannot be seen.',
        'Walk through one meal at home on paper. List two hazards and one control for each. Cooking the meal is optional and needs an adult.',
    ),
    spec(
        's5-food-technology-y9-w01-l2',
        ['handwashing', 'soap', 'seconds', 'ready-to-eat'],
        'Hands move microbes from people, phones, toilets and raw food onto anything they touch next. '
        'Washing with soap and water for about 20 seconds, including thumbs and between fingers, then drying on a clean towel, removes most of that load. '
        'Wash after the toilet, after blowing your nose, after touching raw meat or eggs, and before you handle food that will not be cooked again.',
        'Sequence: wet hands, soap, scrub 20 seconds (palms, backs, thumbs, nails), rinse, dry on a clean towel. '
        'A student who rinses for three seconds without soap has not completed the control.',
        'List the handwashing moments in this order of jobs: crack eggs, then butter toast, then answer the door, then slice a tomato for the same plate.',
        'Wash before starting, again after the eggs and before the toast or tomato, and again if the door handle is dirty or you touched your face. Ready-to-eat toast and tomato need clean hands.',
        'Using only hand sanitiser after raw meat, or a two-second rinse, and calling that a wash. Soap, time and drying matter.',
        'Write a six-step handwashing card for a younger child, including two moments when they must wash. Do not copy the egg example.',
    ),
    spec(
        's5-food-technology-y9-w02-l1',
        ['hygiene', 'hair', 'illness', 'cover'],
        'Personal hygiene keeps hair, dirty clothes, uncovered cuts and illness away from food. '
        'Tie hair back, wear clean clothes or an apron, and cover a cut with a clean waterproof dressing. '
        'If you are vomiting or have diarrhoea, you stay out of food preparation until you have recovered. That is protection for other people, not a punishment.',
        'A student with a loose fringe and an uncovered cut on the thumb wants to knead dough. Safer choice: tie the hair, wash hands, cover the cut, then knead. If they had vomited that morning, they do not knead; someone else does.',
        'Choose the safer setup: (a) cooking while sick with a stomach bug because the soup will boil, or (b) asking an adult to cook and staying away from the food.',
        'Choice (b). Boiling the soup later does not undo handling while infectious, and other ready-to-eat foods in the kitchen are still at risk.',
        'Believing that any illness is fine if the food will be cooked. The cook can contaminate benches, taps and food that is not cooked.',
        'Design a short hygiene checklist with four items for a home cook. Include one rule about illness. Use different examples from the dough scene.',
    ),
    spec(
        's5-food-technology-y9-w02-l2',
        ['equipment', 'detergent', 'drying', 'cloth'],
        'Clean equipment means washed, rinsed and dried, not just wiped with a damp cloth that has already wiped the floor. '
        'Detergent lifts grease and food. Rinsing removes the detergent. Air drying or a clean dry towel finishes the job so microbes are not wiped back on. '
        'Keep a separate cloth for the floor. A bench cloth that falls on the floor goes into the wash.',
        'Dirty knife with peanut butter: wash in hot soapy water, rinse, dry with a clean towel, then use it for apple slices. '
        'Wiping the knife on a tea towel that already wiped the bench is not the same control.',
        'A sponge smells sour and is used for dishes and the floor. What is the problem, and what should replace that habit?',
        'One sour sponge spreads dirt from the floor onto dishes. Use a washed dish cloth for dishes only, wash or replace it often, and use a different cloth for the floor.',
        'Rinsing a plate under cold water with no detergent and calling it clean because no crumbs are visible.',
        'Write the wash–rinse–dry steps for a chopping board and a measuring cup. Say what you would do if the only towel is already wet and dirty.',
    ),
    spec(
        's5-food-technology-y9-w03-l1',
        ['cross-contamination', 'raw', 'ready-to-eat', 'separate'],
        'Cross-contamination is the movement of microbes from a raw food, especially raw meat, chicken or eggs, onto food that will be eaten without further cooking. '
        'The usual path is a shared board, knife, plate or drip. The control is separation: different boards, or a full wash between jobs, and raw food stored so it cannot drip downward.',
        'Job order on one board: salad first, then raw chicken, then wash the board before anything else. '
        'The unsafe order is chicken first and salad second with no wash. The salad is ready-to-eat, so it cannot “cook away” the chicken juice.',
        'Raw mince is on the top fridge shelf above a bowl of cut watermelon. Explain the cross-contamination path and the fix.',
        'Juice can drip onto the watermelon. Move the mince to a covered container on the bottom shelf and keep the fruit above raw meat.',
        'Thinking a quick wipe with a dry paper towel between raw chicken and salad is enough. Washing with detergent is the control.',
        'Plan a two-board kitchen for a meal of grilled sausages and a garden salad. Say which board touches which food and what happens to the sausage tongs.',
    ),
    spec(
        's5-food-technology-y9-w03-l2',
        ['danger zone', 'temperature', 'time', 'chill'],
        'The temperature danger zone used in Australian food-safety teaching is about 5°C to 60°C. In that range many bacteria can multiply if food stays there long enough. '
        'Cold food belongs in the fridge, at or below 5°C. Hot food is kept hot, at or above 60°C, or cooled quickly and refrigerated. '
        'Time matters as well as temperature: a rice dish left on a warm bench all afternoon is a different risk from the same dish served straight away.',
        'Cooked rice at 1:00 pm is still on the stove, lukewarm, at 5:00 pm. It has spent hours in the danger zone. The safe decision is to discard it, not to reheat it and hope. '
        'A contrast: rice packed into the fridge within an hour in a shallow container spends little time in that range.',
        'A meat pie sits in a school bag from 8 am until 1 pm. Is “it was wrapped” a control for the danger zone? What should happen to the pie?',
        'Wrapping does not keep the pie cold or hot. It likely sat in the danger zone for hours. Do not eat it. Next time use an ice brick in an insulated bag or choose a shelf-stable lunch.',
        'Believing that reheating always makes danger-zone food safe. Some toxins are not destroyed by a later boil, and the time already passed still counts.',
        'Sort these four foods into “serve now or chill” versus “time in the danger zone is already too long”: soup just off the stove; soup on the bench for four hours; yoghurt from the fridge; a sandwich in the sun for three hours. Explain one choice.',
    ),
    spec(
        's5-food-technology-y9-w04-l1',
        ['fridge', 'drip', 'covered', 'shelf'],
        'Fridge storage is a drip-control system. Ready-to-eat food, such as leftovers in a closed container, fruit and dairy, sits above raw meat. '
        'Raw meat and chicken go on the bottom shelf in a covered tray so juice cannot fall onto food that will not be cooked. '
        'The fridge should be cold enough that food is at or below 5°C. Overpacking blocks airflow, so a very full fridge may have warm spots.',
        'Bottom shelf: covered tray of raw chicken. Middle: closed container of last night’s pasta. Door: sauce, not milk, if the door is warmer. Milk stays on a colder inner shelf. '
        'The pasta is never placed under the chicken.',
        'Draw or describe a four-shelf fridge holding raw sausages, a cream cake, apples and an open tin of leftover beans. Where does each go, and what must be covered?',
        'Sausages on the bottom in a covered container. Cake and apples above them. Beans moved into a closed container, not stored in the open tin, and placed with ready-to-eat food above the sausages.',
        'Putting raw chicken on the top shelf “so you remember it”. Memory is not a drip control.',
        'Audit a described fridge that has raw mince above strawberries. Write the corrected shelf order and one sentence on why the strawberries were at risk.',
    ),
    spec(
        's5-food-technology-y9-w04-l2',
        ['thawing', 'fridge', 'bench', 'plan'],
        'Thawing on the kitchen bench lets the outside of the food enter the danger zone while the centre is still frozen. '
        'The usual safe method is to thaw in the fridge on a covered tray on the bottom shelf, which takes time, so the plan starts the day before. '
        'Thawing in the microwave is possible if the food is cooked immediately afterwards. Never refreeze food that was fully thawed on the bench.',
        'Frozen chicken for Tuesday dinner: move it to a covered tray on the bottom fridge shelf on Monday. On Tuesday it is thawed and cold, then cooked. '
        'Leaving it on the sink from morning until evening is the unsafe plan.',
        'It is 4 pm and the chicken is still frozen. Dinner is at 6 pm. Which option fits the rule: bench thaw until 6, or a quick defrost followed by immediate cooking?',
        'A quick defrost method followed by cooking straight away. A two-hour bench thaw still warms the outside. If neither can be done safely, choose a different dinner.',
        'Rinsing frozen chicken under hot water on the bench and calling that safer. Splashing spreads raw juices.',
        'Write a thawing plan for frozen mince needed on Friday night. Include the day you start, the shelf, the cover, and what you will do if you forget until Friday afternoon.',
    ),
    spec(
        's5-food-technology-y9-w05-l1',
        ['hot holding', 'cooling', 'leftovers', 'shallow'],
        'Hot food is kept steaming hot if it will be served soon, or it is cooled quickly and refrigerated. '
        'Large deep pots cool slowly in the centre, so leftovers go into shallow containers, uncovered until the steam drops, then covered in the fridge. '
        'This is general kitchen guidance, not a promise that every dish is safe. When in doubt, throw it out.',
        'A pot of stew is still hot at 6 pm. Half is eaten. The rest is ladled into two shallow containers, cooled on the bench only until it stops steaming, then covered and refrigerated by about 7 pm. '
        'Leaving the whole pot out until morning fails the time rule.',
        'Leftover pasta fills one deep plastic tub and sits out “so the fridge is not warmed”. What is the better cooling method?',
        'Split the pasta into shallow containers so the middle cools faster, then refrigerate once it is no longer steaming. Protecting the fridge does not justify an all-night bench stay.',
        'Putting a boiling pot straight into the fridge with the lid on and assuming the centre cools at once. The centre can stay warm for a long time.',
        'Describe how you would cool a large pot of soup for tomorrow’s lunch. Name the container shape and the latest idea of “soon” you are using. Use this soup, not the stew example.',
    ),
    spec(
        's5-food-technology-y9-w05-l2',
        ['allergen', 'label', 'milk', 'cross-contact'],
        'An allergen is a food that can trigger a harmful reaction in some people. Common ones include milk, egg, peanut, tree nuts, fish, shellfish, soy, sesame and wheat. '
        'A label list is the evidence. “May contain milk” is different from milk in the ingredient list, and neither phrase means the food is safe for every allergy. '
        'Cross-contact is traces left by a shared knife or toaster. A student with a milk allergy needs a clean knife, not the one just used for butter.',
        'A muesli bar ingredient list includes skim milk powder. For a student who must avoid milk, this bar is not suitable, even if the front of the pack says “fruit”. '
        'The front claim is advertising. The ingredient list is the check.',
        'A biscuit pack says “baked in a factory that handles peanuts” and the ingredients do not list peanut. What can you say, and what can you not promise?',
        'You can say peanut is not an ingredient but the factory warning means traces are possible. You cannot promise it is safe for someone with a peanut allergy. A parent or the person’s own plan decides.',
        'Tasting a tiny bit to “test” someone else’s allergy. Never test an allergy with food. Reading the label is the task.',
        'Invent a yoghurt-topped muffin label with three ingredients, one of them milk. Write the sentence a Year 7 student should say to a classmate who avoids milk. Then name one cross-contact risk if the same knife spreads the yoghurt.',
    ),
    spec(
        's5-food-technology-y9-w06-l1',
        ['plan', 'hazard', 'control', 'sequence'],
        'A food safety plan lists the steps of a job, the hazard at each step, and the control. '
        'For a sandwich, the steps are wash hands, clean the board, assemble, cover, and chill if it will wait. '
        'The plan is written before making, so controls are ready. An adult supervises any real knife or heat.',
        'Step: spread mayonnaise. Hazard: dirty knife from raw sausage earlier. Control: wash the knife first. '
        'Step: sandwich waits until lunch. Hazard: danger zone in a warm room. Control: fridge or an ice brick. '
        'The plan names both hazards. It does not say “be careful” without an action.',
        'Add one missing control to this plan: wash hands; put lettuce on a board that just held raw chicken; cut the sandwich; leave it on the bench until 1 pm.',
        'Wash or change the board before the lettuce, and refrigerate the sandwich or pack it with an ice brick. Both controls are needed. One of them is not optional.',
        'Writing “be hygienic” as the only control. A plan names the action, the tool and the moment.',
        'Write a five-step safety plan for cheese and tomato on toast. For two steps, name a hazard and a control. Do not reuse the chicken-board example.',
    ),
    spec(
        's5-food-technology-y9-w06-l2',
        ['audit', 'priority', 'evidence', 'revision'],
        'A kitchen audit looks for evidence of hazards, then ranks what to fix first. Ready-to-eat food under raw meat, no soap at the sink, and a stew left out overnight are not equal. '
        'The overnight stew is discarded. The shelf order is changed before the next shop. Soap is replaced before the next wash. '
        'The audit records what you saw, not a general slogan.',
        'Seen: raw chicken uncovered above cut oranges; soap bottle empty; rice pot on the stove from yesterday. '
        'First: discard the rice. Second: move or discard anything the chicken dripped on, then rewash the area and store raw meat below. Third: refill soap before any washing. '
        'The order follows harm, not how easy the job looks.',
        'A different kitchen: a dirty floor, a clean fridge with milk in the door that is still cold, and a sandwich made after handling raw eggs with unwashed hands. Which issue do you fix in the food itself, and why is the floor not first?',
        'The sandwich is unsafe and should not be eaten; wash hands and remake it. A dirty floor matters for cleaning, but it is not in the food. Cold milk in the door is a lower priority if it is still cold.',
        'Cleaning the visible floor first and serving the risky sandwich because the plate looks neat. Evidence of contamination beats appearance.',
        'Audit this new scene in writing: thawed prawns on the top shelf above a custard, one shared towel for hands and the floor, and hot soup being cooled in a deep pot with the lid on. Give an order of actions and one revised cooling method.',
    ),
]

VISUALS = {
    's5-food-technology-y9-w01-l1': visuals(
        's5-food-technology-y9-w01-l1',
        ('Hazard', 'chicken juice on board'), ('Control', 'wash before salad'),
        'Chicken juice on a board is the hazard; washing before salad is the control.',
        'Name the hazard, then the action that stops it.',
        ('Looks fine', 'no smell change'), ('Still unsafe', 'microbes unseen'),
        'Food can be unsafe even when it looks and smells normal.',
        'Appearance is not the safety test.',
    ),
    's5-food-technology-y9-w01-l2': visuals(
        's5-food-technology-y9-w01-l2',
        ('Weak wash', 'quick rinse'), ('Full wash', 'soap, 20 seconds, dry'),
        'A quick rinse compared with soap, twenty seconds and drying.',
        'Time, soap and drying belong in the wash.',
        ('Before', 'raw egg on hands'), ('After', 'wash, then toast'),
        'Wash after raw egg before touching toast.',
        'Ready-to-eat food needs clean hands.',
    ),
    's5-food-technology-y9-w02-l1': visuals(
        's5-food-technology-y9-w02-l1',
        ('Unsafe setup', 'loose hair, open cut'), ('Safer setup', 'tied hair, dressing'),
        'Tie hair and cover a cut before kneading dough.',
        'Personal hygiene is a set of visible controls.',
        ('Ill today', 'vomiting'), ('Stay away', 'someone else cooks'),
        'A person who is vomiting does not prepare food.',
        'Cooking later does not cancel illness while handling.',
    ),
    's5-food-technology-y9-w02-l2': visuals(
        's5-food-technology-y9-w02-l2',
        ('Not clean', 'floor cloth on plate'), ('Clean', 'wash, rinse, dry'),
        'A floor cloth must not wipe plates; wash, rinse and dry instead.',
        'Separate cloths for floor and dishes.',
        ('Knife', 'peanut butter left'), ('Next use', 'washed, then apple'),
        'Wash the knife before it touches apple.',
        'A wipe on a used towel is not a wash.',
    ),
    's5-food-technology-y9-w03-l1': visuals(
        's5-food-technology-y9-w03-l1',
        ('Unsafe order', 'chicken then salad'), ('Safer order', 'salad then chicken'),
        'Prepare salad before raw chicken, or wash the board between them.',
        'Ready-to-eat food must not follow raw meat on a dirty board.',
        ('Top shelf', 'raw mince drips'), ('Fix', 'mince below, covered'),
        'Store raw mince below ready-to-eat food and keep it covered.',
        'Drip path is cross-contamination.',
    ),
    's5-food-technology-y9-w03-l2': visuals(
        's5-food-technology-y9-w03-l2',
        ('Danger zone', 'about 5°C to 60°C'), ('Safe place', 'fridge or steaming hot'),
        'The danger zone is about 5°C to 60°C; cold or hot food leaves that range.',
        'Temperature and time both count.',
        ('Rice 4 hours warm', 'discard'), ('Rice chilled fast', 'shallow, fridge'),
        'Rice left warm for hours is discarded; quickly chilled rice is the contrast.',
        'Reheating is not a repair for a long warm hold.',
    ),
    's5-food-technology-y9-w04-l1': visuals(
        's5-food-technology-y9-w04-l1',
        ('Bottom shelf', 'raw meat, covered'), ('Above', 'ready-to-eat food'),
        'Raw meat stays covered on the bottom shelf, below ready-to-eat food.',
        'Shelf order stops drips.',
        ('Open tin', 'beans in the tin'), ('Better', 'closed container'),
        'Move leftovers out of an open tin into a closed container.',
        'Covered storage is part of the fridge system.',
    ),
    's5-food-technology-y9-w04-l2': visuals(
        's5-food-technology-y9-w04-l2',
        ('Unsafe thaw', 'all day on the bench'), ('Safer thaw', 'fridge, day before'),
        'Thaw chicken in the fridge the day before, not on the bench all day.',
        'Plan the thaw so the outside does not sit warm.',
        ('Forgot', 'still frozen at 4 pm'), ('Then', 'defrost and cook now'),
        'If time is short, defrost and cook immediately rather than bench-thawing.',
        'Hot-water rinsing spreads raw juices.',
    ),
    's5-food-technology-y9-w05-l1': visuals(
        's5-food-technology-y9-w05-l1',
        ('Deep pot', 'centre stays warm'), ('Shallow tubs', 'cool, then fridge'),
        'Split leftovers into shallow containers so the centre cools.',
        'Cooling speed is a safety step.',
        ('Serve soon', 'steaming hot'), ('Or', 'fridge the same evening'),
        'Keep food hot for service or refrigerate it the same evening.',
        'An overnight bench stay fails the time rule.',
    ),
    's5-food-technology-y9-w05-l2': visuals(
        's5-food-technology-y9-w05-l2',
        ('Front words', 'fruit bar'), ('Ingredient list', 'skim milk powder'),
        'The ingredient list, not the front slogan, shows the milk.',
        'Read the list before offering the food.',
        ('Shared knife', 'butter then salad'), ('Allergy control', 'clean knife'),
        'A buttered knife can leave milk traces on the next food.',
        'Cross-contact is a trace, not a visible chunk.',
    ),
    's5-food-technology-y9-w06-l1': visuals(
        's5-food-technology-y9-w06-l1',
        ('Step', 'spread mayonnaise'), ('Control', 'clean knife first'),
        'Before spreading, the knife has to be clean.',
        'A plan pairs each step with an action.',
        ('Wait until lunch', 'warm bench'), ('Control', 'fridge or ice brick'),
        'A sandwich that waits needs the fridge or an ice brick.',
        '“Be careful” is not a control.',
    ),
    's5-food-technology-y9-w06-l2': visuals(
        's5-food-technology-y9-w06-l2',
        ('First', 'discard overnight rice'), ('Then', 'fix drip and soap'),
        'Discard food that sat out overnight before rearranging the fridge.',
        'Rank hazards by harm to the eater.',
        ('Neat plate', 'unsafe sandwich'), ('Evidence', 'raw egg on hands'),
        'A neat plate does not fix a sandwich made with unwashed hands after raw egg.',
        'Audit what you can show, not how tidy the room looks.',
    ),
}


if __name__ == '__main__':
    written = write_elective_batch(
        LESSONS, VISUALS, subject=SUBJECT, source_url=SOURCE, source_note=NOTE, out_dir=OUT,
    )
    print({'wrote': len(written), 'seeds': written})
