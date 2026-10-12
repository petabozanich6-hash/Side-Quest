#!/usr/bin/env python3
"""Year 3 English Written Core batch 09: w26-l2 through w29-l1 (12 lessons)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, vocab=vocab, principle=principle, model=model,
                guided=guided, feedback=feedback, misconception=misconception, independent=independent)

LESSONS = [
L('s2-eng-y3-w26-l2','EN2-CWT-02',['procedure','goal','materials','steps'],
  'Writing a procedure means stating the goal, listing materials and giving numbered steps with clear command verbs.',
  '"Goal: Fold a paper boat. Materials: A4 paper. Steps: 1. Fold in half. 2. Fold corners to the centre. 3. Fold up the bottom edges."',
  'Write a goal, two materials and three steps for making a cheese sandwich.',
  'Goal: Make a cheese sandwich. Materials: bread, cheese. Steps start with verbs such as Place, Add, Press.',
  'Story sentences like "I felt hungry" do not belong in procedure steps.',
  'Write a complete procedure (goal, materials, 5–7 steps) for a safe classroom or kitchen task. Number steps and begin each with an imperative verb.'),
L('s2-eng-y3-w26-l3','EN2-VOCAB-01',['imperative','command','verb','tone'],
  'Imperative verbs give commands or instructions and usually appear at the start of procedure steps.',
  'Stir, Measure, Place and Wait are imperatives. "You should stir" is softer advice, not a sharp command form.',
  'Rewrite as imperatives: "The water needs to be poured" and "You can mix the flour."',
  'Pour the water. Mix the flour.',
  'Questions are not imperative steps.',
  'Create a bank of 15 imperative verbs for cooking, craft and sport. Rewrite five weak steps as strong imperatives and say how the tone becomes clearer.'),
L('s2-eng-y3-w26-l4','EN2-OLC-01',['demonstrate','aloud','gesture','sequence'],
  'Demonstrating a procedure aloud means speaking the steps in order while showing actions at a pace listeners can follow.',
  '"First I fold the paper in half — like this — then I crease the edge firmly." Words match the visible action.',
  'Say the first two steps of washing hands while miming them; keep order clear.',
  'Wet hands, then soap — spoken in that order with matching gestures.',
  'Racing ahead of the actions confuses the audience.',
  'Demonstrate a 4–6 step procedure aloud to a parent or peer. Match gestures to words, pause between steps and write one clarity improvement afterward.'),
L('s2-eng-y3-w27-l1','EN2-RECOM-01',['cause','effect','because','result'],
  'Cause-and-effect reading finds what makes something happen and what results from it in an explanation text.',
  '"Because the sun heats the puddle, the water evaporates." Cause: sun heats. Effect: water evaporates.',
  'Mark cause and effect: "The soil dried out, so the seedlings wilted."',
  'Cause: soil dried out. Effect: seedlings wilted.',
  'Two events next to each other are not always cause and effect.',
  'Read two short explanation paragraphs. For each, list two cause–effect pairs and one sentence that only describes without causing. Quote the signal words you used.'),
L('s2-eng-y3-w27-l2','EN2-CWT-02',['explanation','plan','stages','how/why'],
  'Planning an explanation means deciding the question (how/why), the stages in order and the key cause–effect links before writing.',
  'Question: How does a seed grow? Stages: water absorbed → seed swells → root emerges → shoot grows toward light.',
  'Plan three stages for: Why does a shadow change length during the day?',
  'Stages might include sun position changes → light angle changes → shadow length changes.',
  'A plan that jumps randomly will produce a confusing explanation.',
  'Plan two explanations on different topics using question, materials/facts needed, ordered stages and one cause–effect link per stage. Do not write the full text yet.'),
L('s2-eng-y3-w27-l3','EN2-VOCAB-01',['because','so','therefore','as a result'],
  'Causal connectives such as because, so, therefore and as a result signal why something happens or what follows.',
  '"The wax melted because the candle burned; as a result the flame sank lower." Because shows reason; as a result shows outcome.',
  'Join with a causal connective: "Clouds blocked the sun. The playground cooled."',
  'The playground cooled because clouds blocked the sun. / Clouds blocked the sun, so the playground cooled.',
  'Using therefore for a mere time sequence can mislead readers.',
  'Write eight cause–effect sentences using because, so, therefore or as a result (two each). Label reason vs result for four of them.'),
L('s2-eng-y3-w27-l4','EN2-OLC-01',['oral explanation','order','signal words','audience'],
  'An oral explanation walks listeners through stages in order, using signal words so the how/why is easy to follow.',
  '"First the seed takes in water. Next it swells. Then the root grows down. Finally the shoot grows up." Signal words mark the sequence.',
  'Speak a 20-second how-explanation for making toast using First/Next/Then.',
  'Keep three clear stages; avoid skipping the heating step.',
  'Speaking facts out of order makes the process hard to picture.',
  'Give a 45–60 second oral explanation of a simple process. Use at least three signal words, face the audience and write the stage list you followed.'),
L('s2-eng-y3-w28-l1','EN2-RECOM-01',['diagram','flow chart','arrow','label'],
  'Diagrams and flow charts show stages visually; arrows and labels help readers track the order of a process.',
  'A water-cycle flow chart might show evaporation → condensation → precipitation with arrows and short labels under each stage.',
  'For a three-box flow chart of brushing teeth, write the three labels in order.',
  'Wet brush → Brush teeth → Rinse mouth (or similar accurate order).',
  'Pictures without labels or arrows can leave the sequence unclear.',
  'Read one diagram and one flow chart. List labels, arrow meanings and one missing label you would add. Sketch a three-stage flow chart for a familiar process.'),
L('s2-eng-y3-w28-l2','EN2-CWT-02',['explanation','diagram','refer','caption'],
  'An explanation with a diagram uses the writing to teach the process and refers readers to labelled parts or stages in the visual.',
  '"Water evaporates from the puddle (see Stage 1). The vapour cools and forms droplets (Stage 2)." Text and diagram work together.',
  'Write two sentences that refer a reader to Box A (seed in soil) and Box B (shoot appears) in a growth diagram.',
  'Sentences should teach the link and point to the boxes, not ignore the diagram.',
  'A pretty diagram that the writing never mentions is only half finished.',
  'Write a short explanation (120–150 words) with a simple labelled diagram or flow chart. Include two clear references from the text to the diagram and a caption.'),
L('s2-eng-y3-w28-l3','EN2-VOCAB-01',['technical','everyday','precise','definition'],
  'Technical language names parts and processes precisely; good explanations introduce terms and may give a short everyday meaning.',
  '"Evaporation means liquid water changing into vapour." The technical word is defined so readers can use it later.',
  'Give an everyday meaning for condensation and use it in one sentence about a cold glass.',
  'Condensation: vapour turning into liquid. Sentence: Drops formed on the cold glass by condensation.',
  'Sprinkling difficult words without meanings can block understanding.',
  'Build a glossary of eight technical words from science/how-to texts. Write a kid-friendly definition and one sentence using each word correctly for five of them.'),
L('s2-eng-y3-w28-l4','EN2-HANDW-01',['label','diagram','legible','line'],
  'Handwriting on labelled diagrams must stay legible, with labels placed clearly and leader lines that point to the correct parts.',
  'I write root and shoot in clear letters, draw short lines to each part and keep labels off the drawing\'s busy areas.',
  'Handwrite three labels for a cup diagram: rim, handle, base — with neat lines.',
  'Each label should be readable and clearly connected to the right part.',
  'Tiny squeezed labels can make an accurate diagram unusable.',
  'Draw a simple diagram of a familiar object or process stage. Add at least five handwritten labels with leader lines. Self-assess legibility and placement.'),
L('s2-eng-y3-w29-l1','EN2-RECOM-01',['website','heading','link','reliability'],
  'Reading websites means using headings, menus and links carefully and asking whether the information looks reliable and suited to the purpose.',
  'A page titled "How seeds grow" with clear headings and a known education publisher is more trustworthy for homework than an unsigned pop-up tip.',
  'List two navigation features and one reliability question for a class research page about shadows.',
  'Features: headings/menu/links. Reliability: Who wrote this? When was it updated?',
  'Bright pages are not automatically trustworthy.',
  'Compare two digital texts on the same topic. Record headings used, two links followed, author/about clues and which source you would trust more for school work and why.'),
]

VISUALS = {
 's2-eng-y3-w26-l2': [pair_visual('Goal','Fold a paper boat','Steps','Fold; crease; fold edges','Procedure goal with numbered folding steps.','Goal, materials and steps belong together.'),
  pair_visual('Imperative start','Place; Add; Press','Not a step','I felt hungry','Command steps contrasted with story feeling.','Steps tell the reader what to do.')],
 's2-eng-y3-w26-l3': [pair_visual('Imperatives','Stir; Measure; Place','Softer line','You should stir','Sharp command verbs contrasted with softer advice.','Procedures often lead with imperatives.'),
  pair_visual('Rewrite','Pour the water','Weak form','The water needs to be poured','Passive wording rewritten as a command.','Start the step with the verb.')],
 's2-eng-y3-w26-l4': [pair_visual('Match','words + folding gesture','Order','First fold; then crease','Spoken steps matched to visible actions.','Voice and gesture should stay aligned.'),
  pair_visual('Clear pace','pause between steps','Problem','racing ahead of actions','Paused demonstration contrasted with rushing.','Listeners need time to follow.')],
 's2-eng-y3-w27-l1': [pair_visual('Cause','sun heats puddle','Effect','water evaporates','Cause paired with its effect in an explanation.','Find what makes the result happen.'),
  pair_visual('Signal','so / because','Not always causal','two events merely side by side','Causal signals contrasted with unrelated neighbours.','Neighbour events need a real link.')],
 's2-eng-y3-w27-l2': [pair_visual('Question','How does a seed grow?','Stages','water; swell; root; shoot','Explanation plan with ordered growth stages.','Plan stages before full sentences.'),
  pair_visual('Shadow plan','sun position → angle → length','Random jump','stages out of order','Ordered shadow stages contrasted with a jumble.','Order keeps the how/why clear.')],
 's2-eng-y3-w27-l3': [pair_visual('because','shows a reason','as a result','shows an outcome','Reason and outcome connectives side by side.','Pick the connective that matches the link.'),
  pair_visual('Join','clouds blocked sun, so playground cooled','Mislead','therefore used for mere time order','True causal join contrasted with fake result wording.','Causal words need real causes.')],
 's2-eng-y3-w27-l4': [pair_visual('Signals','First; Next; Then; Finally','Stages','water; swell; root; shoot','Oral explanation signal words marking stages.','Signal words guide listeners through order.'),
  pair_visual('Toast talk','First bread; Next heat; Then ready','Problem','facts spoken out of order','Ordered toast stages contrasted with scrambled talk.','Keep the process sequence intact.')],
 's2-eng-y3-w28-l1': [pair_visual('Flow boxes','evaporation → condensation → rain','Labels','short stage names under arrows','Flow chart with arrows and stage labels.','Arrows show the reading path.'),
  pair_visual('Teeth chart','Wet brush → Brush → Rinse','Unclear','pictures with no labels','Labelled sequence contrasted with unlabelled pictures.','Labels make the diagram readable.')],
 's2-eng-y3-w28-l2': [pair_visual('Text link','see Stage 1','Diagram','evaporation box','Writing that points readers to a diagram stage.','Text and diagram should work together.'),
  pair_visual('Growth refs','Box A seed; Box B shoot','Half done','diagram never mentioned','Clear box references contrasted with an unused diagram.','Refer to the parts you drew.')],
 's2-eng-y3-w28-l3': [pair_visual('Technical','evaporation','Everyday meaning','liquid becoming vapour','Technical term with a kid-friendly meaning.','Define words readers must use later.'),
  pair_visual('Condensation','drops on a cold glass','Problem','hard words with no meanings','Defined term in context contrasted with undefined jargon.','Precision needs support.')],
 's2-eng-y3-w28-l4': [pair_visual('Labels','rim; handle; base','Leader lines','short lines to each part','Handwritten labels with clear leader lines.','Legibility matters on diagrams too.'),
  pair_visual('Placement','labels off busy areas','Problem','tiny squeezed writing','Clear placement contrasted with cramped labels.','Readers must find each part quickly.')],
 's2-eng-y3-w29-l1': [pair_visual('Trusted clues','clear headings; known publisher','Doubt','unsigned pop-up tip','Reliable page clues contrasted with a weak pop-up.','Ask who wrote the page and why.'),
  pair_visual('Navigation','menu; headings; links','Question','When was it updated?','Website navigation features plus a reliability question.','Bright design is not proof of truth.')],
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
            codes = base.get('outcome_codes') or []
            if codes:
                u = dict(u, code=codes[0])
            bundle = build_from_spec(base, u, VISUALS[u['seed_key']])
            if len(codes) > 1:
                bundle['lesson']['outcome_codes'] = list(codes)
                bundle['curriculum'] = [dict(
                    code=c, source='https://curriculum.nsw.edu.au/learning-areas/english/english-k-10-2022/outcomes',
                    verification_status='pending', lesson_evidence=u['principle'],
                    scope_limit='Partial contribution; confirm content points for each listed code.') for c in codes]
            atomic_json(ROOT / 'lesson-pipeline/authored' / f"{u['seed_key']}.json", bundle)
            print('Written Core bundle:', u['seed_key'])
    finally:
        db.close()

if __name__ == '__main__':
    create()
