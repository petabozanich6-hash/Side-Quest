#!/usr/bin/env python3
"""Year 3 English Written Core batch 10: w29-l2 through w32-l1 (12 lessons)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, vocab=vocab, principle=principle, model=model,
                guided=guided, feedback=feedback, misconception=misconception, independent=independent)

LESSONS = [
L('s2-eng-y3-w29-l2','EN2-CWT-02',['search','keywords','notes','own words'],
  'Searching and note-making use keywords, skim headings and record useful facts in your own words with the source named.',
  'Keywords for shadows: sun, angle, length. Note: "Longer shadows when sun is lower (class science page)." Source written beside the note.',
  'Write three keywords and two short notes in your own words for researching how plants need water.',
  'Keywords might be plant, water, roots. Notes should not copy a whole paragraph.',
  'Copying a webpage word-for-word is not useful note-making.',
  'Research one simple how/why question using two sources. Make a keyword list, six notes in your own words and a source line for each note. Do not paste full paragraphs.'),
L('s2-eng-y3-w29-l3','EN2-VOCAB-01',['reliable','unreliable','author','purpose'],
  'Reliable sources usually show who wrote them, why they were written and whether facts can be checked; unreliable sources hide those clues or push wild claims.',
  'A museum page naming authors and dates is steadier for facts than an anonymous post claiming "plants never need water".',
  'Sort: (1) school library ebook with author page (2) joke meme about science. Which is more reliable for homework and why?',
  'Library ebook is more reliable because authorship and purpose are clearer; meme is for humour, not evidence.',
  'Popular does not equal reliable.',
  'Evaluate four sources with a checklist: author, date, purpose, evidence, possible bias. Rank them for a school explanation task and justify the top and bottom choices.'),
L('s2-eng-y3-w29-l4','EN2-OLC-01',['digital citizenship','credit','kind','present'],
  'Digital citizenship means using online information fairly: credit sources, avoid copying, and present findings kindly and clearly.',
  '"According to our class science page..." credits the source while presenting. We do not paste someone else\'s paragraph as if it were ours.',
  'Rewrite a presentation opener so it credits a source instead of pretending the words are original.',
  'Use a phrase such as According to... / My notes from... before sharing a fact.',
  'Credit is part of honesty, not only a school rule.',
  'Prepare a one-minute presentation of research notes that credits two sources aloud. Include one slide or card with source names. Write a short reflection on fair use.'),
L('s2-eng-y3-w30-l1','EN2-RECOM-01',['compare','clarity','diagram','audience'],
  'Comparing two explanations means judging which is clearer for the audience by looking at order, language and helpful diagrams.',
  'Explanation A uses First/Next/Then and a labelled flow chart. Explanation B jumps stages and has no diagram. A is clearer for Year 3 readers.',
  'Compare openings: "How rain forms" with stages vs a joke list with no order. Which helps learning and why?',
  'The staged how-text helps learning; the joke list may entertain but does not teach the process.',
  'Longer is not automatically clearer.',
  'Compare two explanation texts on the same topic. Score order, technical words with meanings, diagram usefulness and audience fit. Decide which you would publish and why.'),
L('s2-eng-y3-w30-l2','EN2-CWT-02',['publish','edit','layout','caption'],
  'Publishing an explanation means editing for accuracy and order, then presenting clean layout with headings, diagram and caption.',
  'Final page: title How seeds grow, short introduction, numbered stages, labelled diagram with caption "Figure 1: Seed growth stages."',
  'List three publish checks before sharing an explanation page.',
  'Checks: stages in order; words defined; diagram labelled/captioned; spelling of key terms.',
  'Publishing is more than neat handwriting; the teaching sequence must work.',
  'Edit and publish one explanation (150–180 words) with heading, ordered stages, glossary of three terms and a captioned diagram. Complete a publish checklist.'),
L('s2-eng-y3-w30-l3','EN2-VOCAB-01',['review','spelling','technical','connective'],
  'Language and spelling review consolidates technical words, causal connectives and accurate spelling of high-value terms from explanation writing.',
  'Practise evaporation, condensation, because, therefore. A misspelt technical word can hide meaning in a published explanation.',
  'Correct: "evapration hapens becos the sun is hot."',
  'evaporation happens because the sun is hot.',
  'Guessing spellings of key terms is risky at publish time.',
  'Make a personal list of twelve review words (eight technical, four connectives). Write each in a sentence and self-test spelling twice. Fix any errors in a published draft.'),
L('s2-eng-y3-w30-l4','EN2-OLC-01',['present','audience','visual','voice'],
  'Presenting to an audience means speaking an explanation clearly, using a visual aid and watching whether listeners can follow.',
  'I point to Stage 2 on my poster when I say condensation, speak slower on new words and ask one check-in question at the end.',
  'Plan a 45-second presentation cue card: title, three stage words, one gesture to a diagram.',
  'Cards should support eye contact, not a mumbled full-script read.',
  'Turning your back to the audience while reading the poster weakens the talk.',
  'Present a short explanation to a parent or peer with a diagram. Credit one source, point to two diagram parts and write audience feedback plus one improvement.'),
L('s2-eng-y3-w31-l1','EN2-RECOM-01',['protocol','respect','permission','Country'],
  'When learning about Dreaming stories, students follow cultural protocols: listen respectfully, use approved classroom sources and never invent or alter sacred stories.',
  'A respectful approach names the Aboriginal or Torres Strait Islander source used in class (as provided by the teacher/parent) and remembers that some knowledge is shared only with permission.',
  'List three respectful behaviours for listening to a story shared through an approved classroom resource.',
  'Behaviours: listen quietly; do not invent details; acknowledge the source community when the resource names it; ask before retelling beyond class.',
  'Making up a "Dreaming-style" story is not respectful learning.',
  'Using only approved resources available at home/school, complete a respect checklist: source named, protocols followed, what must not be changed and one question to ask an adult before any retell.'),
L('s2-eng-y3-w31-l2','EN2-CWT-01',['retell','respect','source','accurate'],
  'Retelling with respect means using approved sources, keeping important meanings accurate and acknowledging where the story came from.',
  '"This retell follows our class text from [source named in materials]. I kept the order of events and did not add new sacred details." Acknowledgement plus accuracy.',
  'Write two sentences that acknowledge a source and promise not to invent details.',
  'Acknowledgement names the approved text/source; promise avoids invented sacred content.',
  'Changing a cultural story "to make it funnier" can be disrespectful and inaccurate.',
  'From an approved classroom or published children\'s source only, write a short respectful retell (100–120 words) with a source line. Add a note listing one detail you refused to invent.'),
L('s2-eng-y3-w31-l3','EN2-VOCAB-01',['verb type','doing','sensing','relating','tense'],
  'Verbs can show doing, sensing or relating; tense shows when. Choosing fitting verb types and steady tense keeps storytelling clear.',
  'Doing: ran. Sensing: wondered. Relating: was. Past tense: The hero was brave and wondered what waited ahead.',
  'Label verb types: whispered; felt; seemed.',
  'whispered = doing/saying; felt = sensing; seemed = relating.',
  'Mixing past and present without a reason can blur the story timeline.',
  'Sort fifteen verbs into doing, sensing and relating. Rewrite a short paragraph twice (past and present) keeping verb type variety without tense drift.'),
L('s2-eng-y3-w31-l4','EN2-OLC-01',['oral storytelling','listen','voice','respect'],
  'Listening to oral storytelling means attending to voice, pace and meaning, then responding respectfully about what you heard.',
  'The storyteller slowed before a turning point and softened their voice. Listeners waited until the end before commenting.',
  'Note one voice choice and one respectful listener behaviour during a short storytelling clip or read-aloud.',
  'Voice choice might be pace or volume; listener behaviour includes waiting turns and not mocking.',
  'Interrupting to guess the ending can break the story\'s gift to listeners.',
  'Listen to an approved oral storytelling performance or read-aloud. Record three delivery features and two respectful response comments. Share one comment aloud.'),
L('s2-eng-y3-w32-l1','EN2-RECOM-01',['myth','hero','quest','ancient'],
  'Greek myths are traditional stories from ancient Greece that often include gods, heroes and quests; readers notice story patterns and what cultures valued.',
  'In many hero myths, a challenge appears, helpers guide the hero and a difficult task tests courage. We read published children\'s versions, not invented "new myths" about real sacred traditions of others.',
  'Name a common myth pattern part in a published children\'s Greek myth you know (challenge, helper or task).',
  'Answers should refer to a known published version\'s pattern, not invented plot claims presented as ancient fact.',
  'Myths are cultural stories; treat published versions as stories to study, not as modern instructions.',
  'Using a published children\'s Greek myth, complete a pattern chart: setting, challenge, helper, task, outcome. Quote one line that shows a hero quality and note the book source.'),
]

VISUALS = {
 's2-eng-y3-w29-l2': [pair_visual('Keywords','sun; angle; length','Own-words note','longer shadows when sun lower','Keywords feeding a short paraphrased note.','Notes should not copy whole paragraphs.'),
  pair_visual('Source line','class science page','Problem','pasted webpage paragraph','Named source contrasted with pasted copying.','Keyword search supports honest notes.')],
 's2-eng-y3-w29-l3': [pair_visual('More reliable','museum page; named authors','Less reliable','anonymous wild claim','Reliability clues contrasted with hidden authorship.','Ask who wrote it and why.'),
  pair_visual('Homework fit','library ebook','Not for evidence','joke meme','Purpose-fit source contrasted with humour meme.','Popular is not the same as reliable.')],
 's2-eng-y3-w29-l4': [pair_visual('Credit aloud','According to our class page','Unfair','pasted paragraph as mine','Spoken credit contrasted with copied ownership.','Credit is part of honesty online.'),
  pair_visual('Present card','source names listed','Kind tone','clear; fair; no mockery','Source card supporting a fair presentation.','Present findings clearly and kindly.')],
 's2-eng-y3-w30-l1': [pair_visual('Clearer','First/Next/Then + flow chart','Less clear','jumped stages; no diagram','Ordered explanation with diagram vs a jumble.','Compare order, language and visuals.'),
  pair_visual('Audience fit','Year 3 how-text','Entertainment only','joke list with no process','Teaching text contrasted with a joke list.','Longer is not automatically clearer.')],
 's2-eng-y3-w30-l2': [pair_visual('Publish pieces','title; stages; diagram','Caption','Figure 1: Seed growth stages','Published explanation layout with caption.','Editing and layout both matter.'),
  pair_visual('Checks','order; definitions; labels','Not enough','neat writing alone','Publish checklist contrasted with neatness-only.','The teaching sequence must work.')],
 's2-eng-y3-w30-l3': [pair_visual('Technical spellings','evaporation; condensation','Connectives','because; therefore','High-value words for explanation review.','Accurate spelling protects meaning.'),
  pair_visual('Fix','evaporation happens because','Error','evapration ... becos','Corrected spellings contrasted with risky guesses.','Self-test before publishing.')],
 's2-eng-y3-w30-l4': [pair_visual('Point','Stage 2 condensation on poster','Voice','slower on new words','Presentation gesture linked to a diagram stage.','Visuals help listeners follow.'),
  pair_visual('Cue card','title; three stages; gesture','Problem','back turned to audience','Cue card support contrasted with facing away.','Watch whether listeners can follow.')],
 's2-eng-y3-w31-l1': [pair_visual('Protocols','listen; approved source; permission','Not respectful','invented sacred-style story','Respect protocols contrasted with invented content.','Use approved sources only.'),
  pair_visual('Acknowledge','name source community when given','Ask first','before retelling beyond class','Acknowledgement and permission habits for sharing.','Some knowledge is shared only with permission.')],
 's2-eng-y3-w31-l2': [pair_visual('Source line','follows our class text from...','Accuracy','keep event order; no invented details','Respectful retell with source and accuracy.','Acknowledgement belongs with the retell.'),
  pair_visual('Refuse','do not invent sacred details','Disrespect risk','change story to make it funnier','Refusing invention contrasted with careless changing.','Accuracy is part of respect.')],
 's2-eng-y3-w31-l3': [pair_visual('Doing','ran','Sensing','wondered','Doing and sensing verbs for storytelling.','Verb types shape what readers track.'),
  pair_visual('Relating','was / seemed','Steady tense','past held across the paragraph','Relating verb with steady past tense.','Avoid unplanned tense drift.')],
 's2-eng-y3-w31-l4': [pair_visual('Voice choice','slower before turning point','Listener','wait until the end','Storyteller pace with respectful listening.','Attend to voice, pace and meaning.'),
  pair_visual('Respect','no mocking comments','Break','interrupt to guess ending','Respectful response contrasted with interruption.','Respond after the story\'s gift is given.')],
 's2-eng-y3-w32-l1': [pair_visual('Pattern','challenge; helper; task','Source','published children\'s version','Myth pattern chart using a published source.','Study patterns in approved published versions.'),
  pair_visual('Hero quality','courage shown in a hard task','Note','story to study, not modern rule book','Hero quality evidence with a careful reading stance.','Treat myths as cultural stories for study.')],
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
