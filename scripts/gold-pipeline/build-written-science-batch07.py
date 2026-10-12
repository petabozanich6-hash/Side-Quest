#!/usr/bin/env python3
"""Year 3 Science Written Core batch 07: investigation project close w37-l1 through w40-l2 (8)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

SCI, PQU, DAT, DDT = 'ST2-SCI-01', 'ST2-PQU-01', 'ST2-DAT-01', 'ST2-DDT-01'

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, subject='science', vocab=vocab,
                principle=principle, model=model, guided=guided, feedback=feedback,
                misconception=misconception, independent=independent)

LESSONS = [
L('s2-sci-y3-w37-l1',DAT,['data','record','table','repeat'],
  'Collecting and recording investigation data means measuring carefully, repeating when planned and writing results in a clear table as you go.',
  'Absorbency test: Trial1 towelA 12 drops; Trial2 11 drops. Table columns: material | trial | drops | notes. Do not rely on memory later.',
  'Why do two or three trials help more than one trial?',
  'Repeats show whether a result was a fluke and give a fairer typical value.',
  'Changing the measure mid-way (drops then “looks wet”) breaks the data set.',
  'Run your planned fair test. Complete the results table with all trials. Note any odd result and whether you repeated it.'),
L('s2-sci-y3-w37-l2',DAT,['analyse','pattern','conclude','evidence'],
  'Analysing results means looking for patterns, comparing averages or totals and writing a conclusion that answers the question with evidence — and naming limits.',
  'Towel A averaged 12 drops; Towel B averaged 7 → A more absorbent in this test. Limit: only two brands, classroom temperature.',
  'Write a conclusion stem: “I found ___ because the data showed ___. One limit was ___.”',
  'Filled with actual numbers and a real limit from the method.',
  'A conclusion that ignores the data or overclaims for all brands worldwide is weak.',
  'Analyse your results: calculate simple totals/averages if appropriate, write a conclusion with numbers and two limits. Sketch a bar display of the main comparison.'),
L('s2-sci-y3-w38-l1',DDT,['brief','brainstorm','criteria','choose'],
  'A design brief for the project states the user need and criteria. Brainstorming lists many ideas before choosing one that fits constraints.',
  'Brief: keep desk cables tidy. Ideas: clips, box, tape spine, 3D-printed hook (if available). Choose clips from scrap card — meets cheap/fast constraints.',
  'Brainstorm five ideas for: stop worksheets blowing off an outdoor table. Star two that fit “scrap only”.',
  'Ideas vary; stars must respect scrap-only.',
  'Falling in love with the first idea without checking criteria wastes redesign time later.',
  'Write brief + criteria + constraints. Brainstorm at least eight ideas. Choose one with a written property/reason match to criteria.'),
L('s2-sci-y3-w38-l2',DDT,['make','test','improve','solution'],
  'Making and testing a solution follows the brief: build a prototype, test against criteria, improve once with evidence, retest.',
  'Cable tidy prototype: test — cables still slip → add wider flap → retest success on criteria “holds three cables”.',
  'List your success criteria and how you will measure pass/fail in the test.',
  'Measurable checks e.g. holds n items for t minutes without falling.',
  'Declaring success without a test against criteria is incomplete.',
  'Build, test, improve and retest your solution. Record criteria results before and after the improvement. Photo/sketch the final prototype.'),
L('s2-sci-y3-w39-l1',DDT,['presentation','slides','rehearse','visual'],
  'Preparing a presentation organises need, method/design, results and next steps into a short rehearsed talk with clear visuals.',
  'Storyboard: 1 need 2 method/design 3 results graph 4 improvement 5 thank you. Rehearse timing to about two minutes.',
  'What visual best shows absorbency results — a photo of towels or a bar graph of drop counts? Why?',
  'Bar graph shows numbers for comparison; photo can support but not replace counts.',
  'Reading a wall of tiny text is a weak Year 3 presentation choice.',
  'Build a 5-card storyboard or slide plan. Rehearse aloud twice. Note one timing or clarity fix after rehearsal.'),
L('s2-sci-y3-w39-l2',DDT,['present','audience','questions','evidence'],
  'Presenting the project means speaking clearly to the audience, showing evidence and answering questions honestly about limits.',
  'Speak to the back of the room; point to the graph when saying numbers; if asked “Would it work outside?”, answer with your limit (only tested indoors).',
  'Practice answer: “What would you change next?” using your real improvement idea.',
  'Name a specific next change linked to a test result.',
  'Pretending there were no problems when the data shows them reduces trust.',
  'Deliver your presentation to a real audience (class/family). Collect two audience questions and write your answers. Self-score clarity 1–5 with a reason.'),
L('s2-sci-y3-w40-l1',DAT,['reflection','skill','evidence','growth'],
  'Year 3 science and technology reflection names skills grown (observing, fair testing, designing, coding/safety) with evidence from artefacts.',
  'Strength: “I can plan a fair test — my seed table kept one variable.” Goal: “Measure twice before recording to cut mistakes.”',
  'Write one strength with artefact evidence and one goal with a practise plan.',
  'Strength quotes work; goal is specific and doable.',
  'Vague “I liked science” without skill evidence is a thin reflection.',
  'Write a full reflection: three skills with evidence, two goals, favourite investigation moment, one thank-you. Attach or point to an artefact.'),
L('s2-sci-y3-w40-l2',SCI,['celebrate','share','gratitude','next'],
  'Celebration shares learning highlights and thanks helpers, then sets one next curiosity to investigate — joy with evidence, not only scores.',
  'Share board: favourite graph, proud prototype photo, kind thank-you to a partner who helped debug. Next curiosity: “How do worms help soil?”',
  'Write a celebration caption for one artefact and one next question you still wonder about.',
  'Caption names what it shows; question is investigable later.',
  'Celebration that mocks others’ results breaks the learning community.',
  'Host a mini showcase (table or screen). Present one artefact caption, one thank-you and one next question. Parent/teacher sign-off on the next question optional.'),
]

VISUALS = {
 's2-sci-y3-w37-l1': [pair_visual('Table','material | trial | measure','As you go','write results live','Recording investigation data.','Repeats reduce flukes.'),
  pair_visual('Trials','1 and 2','Notes','odd results','Trial columns.','Do not change the measure mid-way.')],
 's2-sci-y3-w37-l2': [pair_visual('Pattern','compare totals/averages','Conclusion','answers the question','Analysing results.','Quote numbers.'),
  pair_visual('Limit','sample or method bound','Display','bar comparison','Honest scope.','Avoid worldwide overclaims.')],
 's2-sci-y3-w38-l1': [pair_visual('Brief','need + criteria','Brainstorm','many ideas first','Design project start.','Check constraints before choosing.'),
  pair_visual('Choose','fits scrap/time','Reason','property match','Selecting an idea.','First idea is not automatic.')],
 's2-sci-y3-w38-l2': [pair_visual('Make','prototype','Test','against criteria','Build–test cycle.','Measurable pass/fail.'),
  pair_visual('Improve','one change','Retest','before/after','Evidence-based improve.','Photo the final version.')],
 's2-sci-y3-w39-l1': [pair_visual('Storyboard','need → method → results','Visual','graph over tiny text','Presentation prep.','Rehearse for timing.'),
  pair_visual('Card 4','improvement','Card 5','thank you','Storyboard end.','Two rehearsals.')],
 's2-sci-y3-w39-l2': [pair_visual('Speak','clear + point to evidence','Questions','answer with limits','Live presentation.','Honesty builds trust.'),
  pair_visual('Audience','two questions','Self-score','clarity 1–5','After the talk.','Link next change to data.')],
 's2-sci-y3-w40-l1': [pair_visual('Skill','named with artefact','Goal','practise plan','Reflection structure.','Evidence over vague liking.'),
  pair_visual('Three skills','two goals','Thanks','one helper','Full reflection page.','Point to an artefact.')],
 's2-sci-y3-w40-l2': [pair_visual('Share','artefact highlight','Thanks','partner/helper','Celebration focus.','Kindness required.'),
  pair_visual('Next','curiosity question','Showcase','caption + thanks','Closing showcase.','Keep joy with evidence.')],
}

def create():
    assert len(LESSONS) == 8
    db = reconstruct()
    try:
        for u in LESSONS:
            row = db.execute('SELECT * FROM lessons WHERE seed_key=?', (u['seed_key'],)).fetchone()
            if row is None:
                raise ValueError(u['seed_key'])
            base = baseline_data(row)
            # w40-l2 uses SCI in L() - need to fix - I used SCI in the call but didn't import alias in L for last - I used SCI as code variable wrongly
            bundle = build_from_spec(base, u, VISUALS[u['seed_key']], subject='science')
            atomic_json(ROOT / 'lesson-pipeline/authored' / f"{u['seed_key']}.json", bundle)
            print('Written Core science bundle:', u['seed_key'])
    finally:
        db.close()

if __name__ == '__main__':
    create()
