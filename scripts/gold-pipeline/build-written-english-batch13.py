#!/usr/bin/env python3
"""Year 3 English Written Core batch 13: w38-l2 through w40-l4 (11 lessons) — finish Y3 English."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, vocab=vocab, principle=principle, model=model,
                guided=guided, feedback=feedback, misconception=misconception, independent=independent)

LESSONS = [
L('s2-eng-y3-w38-l2','EN2-CWT-02',['draft','introduction','body','conclusion'],
  'Drafting the research report means writing a full introduction, body sections from notes and a conclusion that answers the question.',
  'Introduction names the question. Body sections teach facts in order. Conclusion answers how bees find flowers in one clear wrap-up.',
  'Write a two-sentence introduction for a report on changing shadow lengths.',
  'Name the question and why it matters; do not dump every fact yet.',
  'A conclusion that adds brand-new unrelated facts confuses readers.',
  'Draft your full report (220–280 words) with introduction, at least three body sections and a conclusion that answers the research question. Keep a working Sources list.'),
L('s2-eng-y3-w38-l3','EN2-VOCAB-01',['edit','grammar','punctuation','capital'],
  'Editing for grammar and punctuation means hunting sentence boundaries, capitals, commas in lists/speech and subject–verb agreement before publishing.',
  'Fix: "bees dances in the dark they shares direction" → "Bees dance in the dark. They share direction."',
  'Edit: "shadows is long at sunrise, and short at noon"',
  'Shadows are long at sunrise and short at noon.',
  'Spellcheck alone will not catch every grammar issue.',
  'Edit your report draft with a checklist: capitals, end marks, agreement, list commas and speech marks if used. Record ten edits you made.'),
L('s2-eng-y3-w38-l4','EN2-HANDW-01',['final copy','legible','margin','spacing'],
  'Handwriting a final copy needs readable letters, steady spacing, clear margins and careful transfer of the edited words.',
  'I leave a margin, copy one sentence at a time from the edited draft and keep headings neat on their own lines.',
  'Copy two edited sentences with careful spacing; mark the margin.',
  'Margin consistent; letters readable; no skipped words from the draft.',
  'Speed copying that reintroduces old errors wastes the edit.',
  'Handwrite a final copy of at least one full report page (or the whole short report). Compare to the edited draft and list any copy errors to fix.'),
L('s2-eng-y3-w39-l1','EN2-RECOM-01',['digital','slides','heading','overload'],
  'Creating a digital presentation means choosing a few clear slides with headings and key facts — not dumping the whole report on one screen.',
  'Slide 1: research question. Slide 2: three key facts. Slide 3: diagram/photo with caption. Slide 4: Sources. Large text, limited bullets.',
  'Trim this overloaded slide to three bullets: ten tiny facts about bees covering every detail from the report.',
  'Keep only the three most important audience facts; move the rest to speaking notes.',
  'Tiny text walls are hard for an audience to read.',
  'Build a 4–6 slide presentation for your report with question, key facts, one visual and sources. Use short bullets and speaker notes separately.'),
L('s2-eng-y3-w39-l2','EN2-CWT-02',['publish','layout','heading','sources'],
  'Publishing the report presents the final written text with clear headings, polished layout and a visible Sources section.',
  'Title page or bold title, section headings, final paragraphs, diagram/caption if used and Sources at the end.',
  'List five publish-ready features your report should show.',
  'Title, headings, edited sentences, sources, neat layout/diagram as planned.',
  'Publishing unfinished drafts confuses your audience.',
  'Publish your final report (print or neat digital document) with title, headings, body, conclusion and Sources. Complete a publish checklist with a parent signature line.'),
L('s2-eng-y3-w39-l3','EN2-VOCAB-01',['grammar','spelling','homophone','final'],
  'Final grammar review catches lingering spelling, homophones and agreement errors that slipped through earlier edits.',
  'Homophones: their/there/they\'re; its/it\'s. Agreement: bees dance, not bees dances. Final pass before the presentation.',
  'Choose correctly: "The bees shared (there/their) directions."',
  'their',
  'A final pass still matters even after publishing the written copy.',
  'Run a final twelve-item mini-test on homophones, agreement and technical spellings from your topic. Fix any errors still hiding in slides or report.'),
L('s2-eng-y3-w39-l4','EN2-OLC-01',['present','research','credit','audience'],
  'Presenting the research project means speaking clearly from cue cards or slides, crediting sources and answering a simple audience question.',
  'I state my question, share three facts with a slide visual, say "According to..." for one source and invite one question at the end.',
  'Plan an opener, three fact cues and a closing thanks for a 90-second talk.',
  'Structure should be easy for listeners to track; credit at least one source aloud.',
  'Ignoring audience questions after inviting them is poor presenting manners.',
  'Present your research in 90–120 seconds to a parent or peer. Credit two sources, use your slides/visual and write the audience question plus your answer.'),
L('s2-eng-y3-w40-l1','EN2-RECOM-01',['reflection','growth','favourite','strategy'],
  'End-of-year reading reflection names growth, favourite texts and strategies that helped comprehension across the year.',
  '"I got better at finding evidence. My favourite unit was explanations because flow charts helped me. Next year I will pause longer on new technical words."',
  'Write one growth statement and one next-year reading goal.',
  'Growth should name a skill; goal should be specific.',
  'Saying only "I liked everything" is too vague for reflection.',
  'Write a reading reflection (120–150 words) covering growth, a favourite text/unit, one strategy that helped and one goal for next year.'),
L('s2-eng-y3-w40-l2','EN2-CWT-02',['portfolio','select','why','goal'],
  'Portfolio selection means choosing pieces that show progress and explaining why each piece matters, plus a forward goal.',
  'Selected: theme paragraph (better evidence), bee report (sources listed), speech cue cards (clearer pace). Goal: stronger conclusions.',
  'Name two pieces to keep and one sentence why for each.',
  'Why must link to a skill improvement, not only "I like it".',
  'A pile without reasons is not a portfolio reflection.',
  'Select four pieces across reading, writing and speaking/handwriting. Write a why for each and one overall goal. Share one selection aloud.'),
L('s2-eng-y3-w40-l3','EN2-VOCAB-01',['spelling','language','check','year words'],
  'A language and spelling check consolidates high-value words from the year: technical terms, connectives and commonly misspelt words.',
  'List examples from the year: because, therefore, evaporation, their/there, persuasion, procedure. Self-test, then correct.',
  'Correct: "becos the shadows was long"',
  'because the shadows were long',
  'Skipping the self-test hides which words still need practice.',
  'Build a personal year list of twenty words. Self-test, mark misses and rewrite each missed word in a new sentence twice.'),
L('s2-eng-y3-w40-l4','EN2-OLC-01',['celebrate','share','thanks','highlight'],
  'Reflection and celebration means sharing a highlight kindly, thanking helpers and recognising learning without boasting unkindly.',
  '"My highlight was teaching my family about the waggle dance. Thank you to Dad for the interview. I am proud I credited my sources."',
  'Write one highlight and one thank-you for a learning helper.',
  'Keep tone warm and specific.',
  'Celebration can be quiet and sincere; it does not need to put others down.',
  'Prepare a 45–60 second celebration share: one highlight, one skill proud of, one thank-you and one hope for next year. Deliver it to your family or class circle.'),
]

VISUALS = {
 's2-eng-y3-w38-l2': [pair_visual('Introduction','names the question','Body','facts in section order','Report draft flow from intro into body sections.','Conclusion should answer the question.'),
  pair_visual('Conclusion','wraps the how/why answer','Weak end','brand-new unrelated facts','Matching conclusion contrasted with stray facts.','Draft from organised notes.')],
 's2-eng-y3-w38-l3': [pair_visual('Fix','Bees dance. They share direction.','Errors','dances; shares; run-on','Grammar edits for agreement and sentence boundaries.','Hunt capitals, end marks and agreement.'),
  pair_visual('Shadows edit','are long at sunrise','Checklist','capitals; commas; speech','Edited agreement with a visible checklist.','Spellcheck is not the only edit.')],
 's2-eng-y3-w38-l4': [pair_visual('Margin','clear left edge','Copy habit','one sentence at a time','Final-copy handwriting with margin and careful transfer.','Do not reintroduce old errors.'),
  pair_visual('Headings','own neat lines','Risk','speed copy skips words','Neat headings contrasted with rushed skipping.','Compare final copy to the edited draft.')],
 's2-eng-y3-w39-l1': [pair_visual('Slides','question; 3 facts; visual; sources','Overload','ten tiny facts on one screen','Lean slide deck contrasted with text overload.','Keep bullets short for the audience.'),
  pair_visual('Speaker notes','extra detail off-slide','Audience text','large and limited','Details moved to notes so slides stay readable.','Screens are not the full report.')],
 's2-eng-y3-w39-l2': [pair_visual('Publish pieces','title; headings; body; sources','Caption','diagram labelled if used','Published report parts in clean layout.','Sources must be visible.'),
  pair_visual('Checklist','edited; headed; sourced','Not ready','unfinished draft shared','Publish-ready checklist contrasted with an unfinished draft.','Polish before sharing.')],
 's2-eng-y3-w39-l3': [pair_visual('Homophones','their / there / they\'re','Agreement','bees dance','Final-pass targets for homophones and agreement.','Catch errors that earlier edits missed.'),
  pair_visual('Choose','their directions','Still needed','final pass after publish','Correct homophone with a last-pass reminder.','Slides need the final pass too.')],
 's2-eng-y3-w39-l4': [pair_visual('Talk map','question; 3 facts; credit; invite question','Credit aloud','According to...','Research presentation map with spoken credit.','Invite and answer one audience question.'),
  pair_visual('Timing','90–120 seconds','Manners','answer after inviting questions','Timed talk with respectful Q&A manners.','Structure helps listeners track.')],
 's2-eng-y3-w40-l1': [pair_visual('Growth','better at finding evidence','Favourite','explanations + flow charts','Reading reflection naming growth and a favourite unit.','Goals should be specific.'),
  pair_visual('Next year','pause on technical words','Vague','I liked everything','Specific goal contrasted with vague liking.','Name strategies that helped.')],
 's2-eng-y3-w40-l2': [pair_visual('Select','theme paragraph; bee report; cue cards','Why','evidence; sources; pace','Portfolio pieces chosen with skill-based reasons.','Why must name improvement.'),
  pair_visual('Goal','stronger conclusions','Not portfolio','pile with no reasons','Forward goal contrasted with an unexplained pile.','Selection plus reflection.')],
 's2-eng-y3-w40-l3': [pair_visual('Year words','because; evaporation; persuasion','Homophones','their/there','High-value year word bank for a spelling.','Self-test reveals what still needs practice.'),
  pair_visual('Fix','because the shadows were long','Miss','becos ... was','Corrected year words contrasted with old misses.','Rewrite misses in new sentences.')],
 's2-eng-y3-w40-l4': [pair_visual('Highlight','taught family the waggle dance','Thanks','Dad for the interview','Celebration share with highlight and thanks.','Be warm and specific.'),
  pair_visual('Proud','credited sources','Hope','next year skill','Pride and hope without putting others down.','Celebration can be quiet and sincere.')],
}


def create():
    assert len(LESSONS) == 11
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
