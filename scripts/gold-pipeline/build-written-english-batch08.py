#!/usr/bin/env python3
"""Year 3 English Written Core batch 08: w23-l2 through w26-l1 (12 lessons)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, vocab=vocab, principle=principle, model=model,
                guided=guided, feedback=feedback, misconception=misconception, independent=independent)

LESSONS = [
L('s2-eng-y3-w23-l2','EN2-CWT-01',['summary','plot','order','concise'],
  'A plot summary retells the important events in order without copying every detail or adding new inventions.',
  '"A child waits in fog for a ferry light, calls out, then boards when the light appears." Key events only, in sequence.',
  'Summarise in two sentences: hat blows to fence; careful climb; hat recovered; smile.',
  'Keep order and drop tiny extras: The hat blew to the fence. After a careful climb it was recovered.',
  'A summary is not a full rewrite of every sentence.',
  'Write two plot summaries (60–80 words each) for different stories or chapters. Check order, remove unnecessary detail and keep the problem and outcome.'),
L('s2-eng-y3-w23-l3','EN2-VOCAB-01',['cohesion','pronoun','connective','flow'],
  'Paragraph cohesion means sentences stick together using pronouns, repeated key words and connectives so the reader can follow.',
  '"Maya reached the jetty. She waited because the fog was thick. Then a light appeared." She and Then link the ideas.',
  'Improve cohesion: "Sam packed. Sam forgot water. Sam went back."',
  'Sam packed but forgot water, so he went back. (pronoun + connectives)',
  'Repeating the full noun every time can sound clunky; unclear pronouns can confuse who is acting.',
  'Rewrite three choppy paragraphs to improve cohesion with pronouns and connectives. Label two cohesive devices in each rewrite.'),
L('s2-eng-y3-w23-l4','EN2-OLC-01',['discussion circle','turn','build on','evidence'],
  'A book discussion circle gives each speaker a turn to share ideas and build on others using text evidence.',
  'Speaker A: "The fog made me nervous." Speaker B: "I agree, especially when it says hands shook." Turns stay respectful and linked.',
  'Write one comment that builds on: "The character seems patient."',
  'Build-on: "Yes — waiting for the light instead of leaving shows patience, especially when..."',
  'Talking over others or ignoring the book breaks the circle purpose.',
  'Run a four-turn discussion circle on a shared page. Each turn must include either a new idea or a build-on with evidence. Record one strong evidence link.'),
L('s2-eng-y3-w24-l1','EN2-RECOM-01',['theme','message','evidence','not moral sticker'],
  'Theme is the bigger idea a story explores; readers support it with events and language, not only a sticker-like moral.',
  'If a character keeps waiting for a friend in hard weather, a theme might be loyalty or perseverance, backed by those actions.',
  'Suggest a theme and one evidence event for a story where a child returns a lost purse before shopping.',
  'Theme: honesty/doing the right thing. Evidence: returned the purse first.',
  'Theme is not the same as the topic (e.g. "fog" is topic; "courage in uncertainty" may be theme).',
  'For two stories, state topic vs theme, give two evidence points each and explain why one theme fits better than a shallow slogan.'),
L('s2-eng-y3-w24-l2','EN2-CWT-01',['theme paragraph','claim','evidence','explain'],
  'A theme paragraph states a theme claim, gives story evidence and explains how the evidence supports the idea.',
  '"One theme is perseverance. The child waits through fog and keeps calling. This shows they do not give up when the goal is delayed."',
  'Draft a three-sentence theme paragraph for honesty using the purse-return event.',
  'Claim honesty; evidence returning the purse; explain that the choice puts right action before shopping.',
  'Listing plot alone without naming a theme leaves the paragraph unfinished.',
  'Write two theme paragraphs (90–110 words) on different stories. Each needs claim, two evidence points and explanation. Underline the theme claim.'),
L('s2-eng-y3-w24-l3','EN2-VOCAB-01',['direct speech','indirect speech','quotation marks','report'],
  'Direct speech shows exact words in quotation marks; indirect speech reports the meaning without quoting every word.',
  'Direct: Maya said, "I will wait." Indirect: Maya said that she would wait.',
  'Convert to indirect: Kai shouted, "The hat is on the fence!"',
  'Kai shouted that the hat was on the fence.',
  'Indirect speech still needs a clear reporting verb and accurate meaning.',
  'Write five direct speech sentences with correct punctuation and convert each to indirect speech. Explain one tense or pronoun change you needed.'),
L('s2-eng-y3-w24-l4','EN2-OLC-01',['readers theatre','role','expression','script'],
  'Readers theatre performs a script with expressive voices and clear roles while readers keep eyes on the text.',
  'Narrator reads setting lines steadily; Character lines use a worried tone on "fog"; cues show who speaks next.',
  'Assign narrator and character for: "Fog wrapped the jetty. \'I will wait,\' whispered Maya." Mark who reads each part.',
  'Narrator: Fog wrapped the jetty. Maya: I will wait.',
  'Memorising is not required; expression and accurate turn-taking are.',
  'Prepare a short readers-theatre script (8–12 lines) from a chapter moment. Rehearse with roles, perform once and note one expression choice that helped meaning.'),
L('s2-eng-y3-w25-l1','EN2-RECOM-01',['craft','word choice','structure','effect'],
  'Author\'s craft means noticing how word choice, structure and techniques create effects for the reader.',
  'Short sentences after "The light blinked" can create tension. Soft alliteration in "white hush" can calm the mood.',
  'Name one craft choice and its effect in: "Crash. Silence. Then footsteps."',
  'Craft: very short sentences / abrupt rhythm. Effect: shock, suspense, sudden focus.',
  'Craft talk needs effect, not only naming a technique.',
  'Annotate a page for three craft choices (word choice, sentence length or figurative language). For each, write the effect on the reader.'),
L('s2-eng-y3-w25-l2','EN2-CWT-01',['review','opinion','summary','recommend'],
  'A book review briefly summarises without spoiling, gives a reasoned opinion and may recommend who would enjoy the book.',
  '"This adventure is for readers who like quiet courage. The fog ferry scene kept me reading because the waiting felt real. I recommend it to fans of gentle mysteries."',
  'Write a two-sentence review opinion with one reason for a book you know.',
  'Opinion + because-reason; avoid emptying into "It was good" alone.',
  'A review is more than a full plot dump.',
  'Write a book review (130–160 words) with title/author if known, short spoiler-safe summary, reasoned opinion, one craft note and a recommendation for a type of reader.'),
L('s2-eng-y3-w25-l3','EN2-VOCAB-01',['review','precise word','figurative','cohesion'],
  'Language review consolidates precise vocabulary, figurative choices and cohesive devices practised across recent units.',
  'Replace vague "nice" with precise "patient"; keep a simile that earns its place; link sentences with because/then only when they help flow.',
  'Improve: "The story was nice and stuff happened then it ended."',
  'Need precise opinion words, a clear event reference and cohesive links — e.g. name a scene and its effect.',
  'Revision should improve clarity, not only make writing longer.',
  'Revise a weak paragraph of your own or a provided weak model: upgrade five vague words, fix one figurative misuse and improve cohesion in three places. List the changes.'),
L('s2-eng-y3-w25-l4','EN2-OLC-01',['portfolio','select','reflect','goal'],
  'A portfolio checkpoint means selecting strong work, explaining why it shows growth and setting a clear next goal.',
  '"I chose my theme paragraph because my evidence improved. Next I will pause more when presenting speeches." Selection, reason, goal.',
  'Name one piece to keep and one next goal for handwriting or speaking.',
  'Keep reason must link to a skill; goal should be specific and doable.',
  'Keeping everything without reflection is not a checkpoint.',
  'Select three pieces (reading response, writing, speaking/handwriting). For each, write why it shows progress and one next goal. Share one reflection aloud.'),
L('s2-eng-y3-w26-l1','EN2-RECOM-01',['procedure','steps','imperative','order'],
  'Procedures teach how to do something using a goal, materials and ordered steps, often with imperative verbs.',
  '"Goal: Make lemon drink. Materials: lemon, water, cup. Steps: 1. Wash lemon. 2. Squeeze juice. 3. Add water. 4. Stir." Clear order and commands.',
  'Order these steps: stir; add water; squeeze lemon; wash lemon.',
  'Wash lemon → squeeze → add water → stir.',
  'Missing materials or scrambled steps make a procedure hard to follow.',
  'Read two short procedures. For each, list goal, materials, imperative verbs and one unclear step to fix. Rewrite one procedure with clearer order.'),
]

VISUALS = {
 's2-eng-y3-w23-l2': [pair_visual('Key events','wait; call; board','Dropped detail','every tiny description','Concise plot summary keeping essentials.','Summaries keep order without full copying.'),
  pair_visual('Problem→outcome','hat on fence → recovered','Not summary','invented new ending','Accurate outcome contrasted with invention.','Do not add events the text never had.')],
 's2-eng-y3-w23-l3': [pair_visual('Pronoun link','Maya ... She waited','Connective','Then a light appeared','Pronoun and connective holding a paragraph together.','Cohesion helps sentences stick.'),
  pair_visual('Choppy','Sam packed. Sam forgot.','Smoother','packed but forgot, so he went back','Repeated name fixed with pronoun and connectives.','Balance clear reference with flow.')],
 's2-eng-y3-w23-l4': [pair_visual('Turn A','fog made me nervous','Build-on B','agree + hands shook quote','Discussion circle building with evidence.','Link to the previous speaker and the text.'),
  pair_visual('Respect','one voice at a time','Break','talking over / ignoring book','Fair turns contrasted with broken circle habits.','Evidence keeps talk on the book.')],
 's2-eng-y3-w24-l1': [pair_visual('Theme','perseverance / loyalty','Evidence','waits in hard weather','Theme supported by character action.','Theme is bigger than a single topic word.'),
  pair_visual('Topic','fog','Theme','courage in uncertainty','Topic contrasted with a deeper theme idea.','Avoid sticker morals without evidence.')],
 's2-eng-y3-w24-l2': [pair_visual('Claim','theme is perseverance','Evidence','waits; keeps calling','Theme claim backed by two story actions.','Show how the evidence supports the idea.'),
  pair_visual('Link','does not give up when delayed','Incomplete','plot list only','Theme link contrasted with bare plot listing.','Name the theme, then prove it.')],
 's2-eng-y3-w24-l3': [pair_visual('Direct','"I will wait."','Indirect','said that she would wait','Direct quote converted to reported speech.','Quotation marks mark exact words.'),
  pair_visual('Convert','hat is on the fence','Reported','hat was on the fence','Tense adjustment in indirect speech.','Keep the meaning accurate.')],
 's2-eng-y3-w24-l4': [pair_visual('Narrator','Fog wrapped the jetty','Character','I will wait','Readers-theatre roles split across lines.','Expression shows meaning while reading.'),
  pair_visual('Cue','who speaks next','Not required','full memorising','Script cues contrasted with unnecessary memorising.','Eyes can stay on the text.')],
 's2-eng-y3-w25-l1': [pair_visual('Craft','short sentences: Crash. Silence.','Effect','shock / suspense','Sentence-length craft creating tension.','Name the choice and the effect.'),
  pair_visual('Word choice','white hush','Effect','calmer mood','Soft wording shaping atmosphere.','Craft talk needs more than a technique label.')],
 's2-eng-y3-w25-l2': [pair_visual('Summary','spoiler-safe gist','Opinion','quiet courage felt real','Review mix of summary and reasoned opinion.','Avoid dumping the whole plot.'),
  pair_visual('Recommend','gentle-mystery fans','Weak','It was good','Reader recommendation contrasted with empty praise.','Say who might enjoy it and why.')],
 's2-eng-y3-w25-l3': [pair_visual('Vague','nice; stuff happened','Precise','patient; name a scene','Vague review language upgraded for clarity.','Revision targets precision.'),
  pair_visual('Cohesion fix','because / then used with purpose','Revising','not merely longer','Purposeful links contrasted with padding.','Clearer beats longer.')],
 's2-eng-y3-w25-l4': [pair_visual('Select','theme paragraph kept','Why','evidence improved','Portfolio piece chosen with a growth reason.','Selection needs reflection.'),
  pair_visual('Next goal','pause more in speeches','Not checkpoint','keep everything, no goals','Specific goal contrasted with unreflective saving.','Name the next skill step.')],
 's2-eng-y3-w26-l1': [pair_visual('Goal','make lemon drink','Steps','wash → squeeze → water → stir','Procedure goal with ordered imperative steps.','Order makes procedures usable.'),
  pair_visual('Imperatives','Wash; Squeeze; Stir','Problem','scrambled steps / missing materials','Clear commands contrasted with a broken procedure.','Materials and sequence both matter.')],
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
