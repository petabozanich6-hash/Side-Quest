#!/usr/bin/env python3
"""Year 3 English Written Core batch 12: w35-l2 through w38-l1 (12 lessons)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, vocab=vocab, principle=principle, model=model,
                guided=guided, feedback=feedback, misconception=misconception, independent=independent)

LESSONS = [
L('s2-eng-y3-w35-l2','EN2-CWT-01',['compare','contrast','both','whereas'],
  'A compare-and-contrast paragraph states how two texts are alike and different using linking words such as both, whereas and however.',
  '"Both tales have clever heroes. The myth includes gods, whereas the legend links a deed to Lookout Rock." Similarity then difference.',
  'Write two sentences: one similarity and one difference about a myth and a legend you studied.',
  'Use both/whereas or similar links; name a concrete feature for each.',
  'Listing only differences leaves the compare half unfinished.',
  'Write a compare-and-contrast paragraph (110–130 words) on a myth and a legend. Include two similarities, two differences and clear linking words. Underline the links.'),
L('s2-eng-y3-w35-l3','EN2-VOCAB-01',['review','agreement','speech','variety'],
  'Language review consolidates pronoun agreement, direct speech punctuation and sentence variety from recent narrative units.',
  'Fix together: agreement (their/they), speech commas and a mix of short and complex sentences in one short retell.',
  'Improve: "kai said the rock is ours they was brave"',
  'Kai said, "The rock is ours." They were brave. (agreement + speech punctuation)',
  'Review works best with real sentences from your own drafts.',
  'Create a twelve-item review: four agreement fixes, four speech punctuation fixes and four sentence-variety rewrites. Apply three fixes to your latest story draft.'),
L('s2-eng-y3-w35-l4','EN2-OLC-01',['present','legend','visual','pace'],
  'Presenting a legend means telling the place, threat, deed and memory link clearly, with steady pace and a simple visual if helpful.',
  'I show a sketch of Lookout Rock, name the threat, act the warning deed briefly, then end on why the rock keeps its name.',
  'Order a 40-second legend talk: memory name, deed, place, threat — into a sensible speaking order.',
  'Place → threat → deed → memory name works for listeners.',
  'Rushing the memory link can leave the legend without its point.',
  'Present an original or published legend-style tale in 60–90 seconds. Include place, threat, deed and memory link. Use one visual and write one pacing note afterward.'),
L('s2-eng-y3-w36-l1','EN2-RECOM-01',['topic','interest','focus','researchable'],
  'Choosing a research topic means picking something interesting, narrow enough to manage and possible to research with available sources.',
  '"How honeybees find flowers" is more researchable for Year 3 than "everything about insects". Interest + focus + sources.',
  'Sort: (1) dinosaurs (2) How do kangaroo joeys grow in the pouch? Which is a better focused topic and why?',
  'Focused question (2) is better for a short report; (1) is too broad without narrowing.',
  'A topic with no available kid-friendly sources will stall the project.',
  'List five interesting topics, narrow each to a how/why question, rate sources you can actually find and choose one research question for the unit.'),
L('s2-eng-y3-w36-l2','EN2-CWT-02',['plan','sections','heading','report'],
  'Planning a research report means deciding headings/sections that answer the research question in a sensible order.',
  'Question: How do honeybees find flowers? Sections: Introduction; Bee senses; The waggle dance; Conclusion.',
  'Plan four section headings for: Why do shadows change length?',
  'Possible: Introduction; Sun position; Shadow length; Conclusion — or similar logical order.',
  'Random headings that ignore the question waste drafting time.',
  'Write a report plan for your chosen question: title, four to five headings, two facts you hope to find under each and a sources-to-seek list.'),
L('s2-eng-y3-w36-l3','EN2-VOCAB-01',['question','open','closed','research'],
  'Good research questions are open enough to need investigation but clear enough to answer with facts; closed yes/no questions are often too thin.',
  'Thin: "Are bees cool?" Stronger: "How do honeybees communicate the direction of flowers?"',
  'Rewrite "Do shadows exist?" as a stronger research question.',
  'Example: Why do shadows change length during the day?',
  'Questions that already contain the full answer are not research questions.',
  'Write ten research questions on two topics. Label each open or closed. Keep your three strongest open questions and justify why they are researchable.'),
L('s2-eng-y3-w36-l4','EN2-OLC-01',['oral practice','cue cards','timing','eye contact'],
  'Oral presentation practice uses cue cards, timing and eye contact so a research talk is clear before the final share.',
  'Cards show section headings only. I practise a 60-second run, look up between points and time myself twice.',
  'Make three cue-card lines for a bee research opener.',
  'Lines might be: question; why it matters; first section name — keywords, not a full essay.',
  'Reading a full page in a monotone is practice that still needs fixing.',
  'Practise a 60–90 second research talk twice with cue cards. Record time, one eye-contact win and one wording fix for next rehearsal.'),
L('s2-eng-y3-w37-l1','EN2-RECOM-01',['skim','scan','heading','relevant'],
  'Reading to find information uses skimming for gist and scanning for keywords under headings that match the research question.',
  'For "waggle dance", I scan the heading Bee communication, then read only the paragraph that names direction and distance.',
  'Which heading is most relevant for shadow length: Animal habitats or Sun and light?',
  'Sun and light — closer to the question.',
  'Reading every word of an unrelated chapter wastes research time.',
  'Using two information texts, skim headings, scan for three keywords from your question and record four relevant facts with page/heading locations.'),
L('s2-eng-y3-w37-l2','EN2-CWT-02',['notes','own words','draft','section'],
  'Note-making and drafting turn source facts into your own words under the planned section headings.',
  'Note: "Bees use a figure-eight dance to share flower direction (science page)." Draft sentence under Bee communication: Honeybees share flower direction with a figure-eight dance.',
  'Turn this note into a draft sentence: "joeys drink milk in pouch — zoo booklet".',
  'In the pouch, joeys drink milk (zoo booklet). Own words + idea kept.',
  'Drafting straight from a copied sentence risks plagiarism.',
  'Make eight own-word notes from at least two sources, then draft two report sections (80–100 words each) under your headings. Keep source tags beside notes.'),
L('s2-eng-y3-w37-l3','EN2-VOCAB-01',['cite','source','author','title'],
  'Citing sources means naming where facts came from using simple Year 3 conventions such as title, author or organisation and type of text.',
  '"According to the Australian Museum kids page on bees..." or a Sources list: Bee dance facts — Australian Museum kids page.',
  'Write a source line for a library book called Shadows by A. Lee.',
  'Lee, A. Shadows (library book) — or similar clear title/author/type.',
  'Inventing a source name is dishonest.',
  'Create a Sources list for four real materials you used or would use. Practise two in-text According to... sentences and one end list in a consistent format.'),
L('s2-eng-y3-w37-l4','EN2-OLC-01',['interview','question','listen','record'],
  'Interviewing an expert (or knowledgeable adult) means preparing clear questions, listening carefully and recording answers accurately.',
  'Question: "How do you keep notes when you research animals?" I listen without interrupting, then write the key points in my notebook.',
  'Write three interview questions for a gardener about how plants take up water.',
  'Questions should be open and polite; avoid yes/no-only unless follow-ups are planned.',
  'Talking more than the expert defeats the interview.',
  'Prepare five interview questions, conduct a short interview with a willing adult expert/parent, record answers in notes and thank them. Write three facts learned.'),
L('s2-eng-y3-w38-l1','EN2-RECOM-01',['organise','group','heading','order'],
  'Organising ideas means grouping notes under headings and ordering sections so the report answers the question without repeats.',
  'Notes about wings and notes about dancing go under different headings. Introduction comes first; conclusion last.',
  'Sort into two headings — Food / Shelter: eats nectar; lives in hive; drinks water; beeswax comb home.',
  'Food: eats nectar; drinks water. Shelter: lives in hive; beeswax comb home.',
  'Leaving duplicate facts in every section clutters the report.',
  'Reorganise your research notes under final headings. Cut duplicates, number section order and write a one-sentence job for each section.'),
]

VISUALS = {
 's2-eng-y3-w35-l2': [pair_visual('Both','clever heroes','Whereas','gods vs place-name deed','Similarity and difference in one paragraph plan.','Use linking words for compare and contrast.'),
  pair_visual('Links','both; whereas; however','Incomplete','differences only','Linking words contrasted with one-sided listing.','Include likenesses and differences.')],
 's2-eng-y3-w35-l3': [pair_visual('Agreement','they were brave','Speech','Kai said, "..."','Agreement and speech punctuation reviewed together.','Fix real sentences from drafts.'),
  pair_visual('Variety','short + complex mix','Weak string','flat repeated chops','Sentence variety contrasted with flat chops.','Review skills in combination.')],
 's2-eng-y3-w35-l4': [pair_visual('Order','place → threat → deed → name','Visual','sketch of Lookout Rock','Legend talk order with a simple visual.','End on the memory link.'),
  pair_visual('Pace','steady on the deed','Risk','rushed memory link','Steady pacing contrasted with a rushed ending.','Listeners need the place link.')],
 's2-eng-y3-w36-l1': [pair_visual('Focused','How honeybees find flowers','Too broad','everything about insects','Focused research question vs a huge topic.','Interest must meet a manageable focus.'),
  pair_visual('Researchable','kid-friendly sources exist','Stall risk','no sources available','Source availability as a topic test.','Choose questions you can actually investigate.')],
 's2-eng-y3-w36-l2': [pair_visual('Question','How do honeybees find flowers?','Sections','Intro; senses; dance; conclusion','Report plan headed from the research question.','Headings should answer the question.'),
  pair_visual('Shadow plan','Intro; sun position; length; conclusion','Random','headings that ignore the question','Logical section order contrasted with random labels.','Plan before drafting.')],
 's2-eng-y3-w36-l3': [pair_visual('Stronger','How do bees share flower direction?','Thin','Are bees cool?','Open research question contrasted with a thin closed one.','Open questions need investigation.'),
  pair_visual('Rewrite','Why do shadows change length?','Not research','question that already holds the full answer','Rewritten question ready for investigation.','Keep questions clear and researchable.')],
 's2-eng-y3-w36-l4': [pair_visual('Cue cards','section headings only','Timing','60-second practice run','Cue cards supporting a timed rehearsal.','Practise before the final share.'),
  pair_visual('Eye contact','look up between points','Problem','full-page monotone read','Eye contact contrasted with monotone page reading.','Keywords beat a script wall.')],
 's2-eng-y3-w37-l1': [pair_visual('Skim','headings for gist','Scan','keyword: waggle dance','Skim and scan working on an information page.','Match headings to the research question.'),
  pair_visual('Relevant','Sun and light','Less relevant','Animal habitats','Heading relevance for a shadow question.','Skip unrelated chapters.')],
 's2-eng-y3-w37-l2': [pair_visual('Note','figure-eight dance; science page','Draft','Honeybees share direction...','Own-word note expanded into a draft sentence.','Keep source tags beside notes.'),
  pair_visual('Own words','joeys drink milk in the pouch','Risk','copied sentence pasted into draft','Paraphrase contrasted with copied drafting.','Draft from notes, not from paste.')],
 's2-eng-y3-w37-l3': [pair_visual('In-text','According to the museum kids page','End list','title; organisation; type','Simple Year 3 source citation forms.','Name where facts came from.'),
  pair_visual('Book line','Lee, A. Shadows (library book)','Dishonest','invented source name','Clear book citation contrasted with a fake source.','Only list materials you really used.')],
 's2-eng-y3-w37-l4': [pair_visual('Prepare','clear open questions','Listen','notes without interrupting','Interview flow: question then listening notes.','The expert should talk more than you.'),
  pair_visual('Record','key points in notebook','Thank','polite close after answers','Accurate notes and thanks after an interview.','Record answers faithfully.')],
 's2-eng-y3-w38-l1': [pair_visual('Group','Food vs Shelter notes','Order','Introduction → body → conclusion','Notes grouped under headings in report order.','Cut duplicates across sections.'),
  pair_visual('Section job','one-sentence purpose each','Clutter','same fact repeated everywhere','Clear section jobs contrasted with duplicate clutter.','Every section should earn its place.')],
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
