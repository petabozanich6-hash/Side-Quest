#!/usr/bin/env python3
"""Year 3 English Written Core batch 05: w14-l2 through w17-l1 (12 lessons)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, vocab=vocab, principle=principle, model=model,
                guided=guided, feedback=feedback, misconception=misconception, independent=independent)

LESSONS = [
L('s2-eng-y3-w14-l2','EN2-CWT-01',['ballad','stanza','story poem','chorus'],
  'A ballad tells a story in short stanzas, often with a repeating line or chorus and a clear sequence of events.',
  '"The ferry left at dawn. The fog hid the bay. Oh, wait for the light, wait for the day." Events move forward and a line repeats.',
  'Plan three story beats for a ballad about a lost hat, then write one four-line stanza including a repeating line.',
  'Beats could be: hat blows away; child searches; hat is found. A repeating line such as "Come back, red hat" can act as a chorus.',
  'A ballad needs events in order; rhyme alone does not make a story poem.',
  'Write a 12–16 line ballad (three or four stanzas) about a small adventure. Include a repeating line, keep events in order, and explain one choice that helps the story move.'),
L('s2-eng-y3-w14-l3','EN2-VOCAB-01',['synonym','antonym','thesaurus','precise word'],
  'Synonyms are words with similar meanings; antonyms are opposites. A thesaurus helps you choose a more precise word for your purpose.',
  'Happy and glad are near synonyms. Happy and sad are antonyms. For a quiet classroom I might replace noisy with murmuring after checking a thesaurus.',
  'Give two synonyms and one antonym for cold, then choose the best synonym for "a friendly welcome".',
  'Cold synonyms: chilly, freezing. Antonym: hot/warm. Friendly welcome might use warm rather than boiling.',
  'Thesaurus suggestions are not automatically the best fit; meaning and tone still matter.',
  'Create a mini thesaurus page for six words from a poem or story: two synonyms and one antonym each. Rewrite three sentences using a more precise synonym and explain one choice.'),
L('s2-eng-y3-w14-l4','EN2-OLC-01',['choral reading','together','cue','clarity'],
  'Choral reading means a group speaks a text together with agreed cues for pace, volume and shared starts.',
  'We decide to begin together after a silent count of three, soften on the quiet line, and keep the last word clear so it does not trail away.',
  'Mark two cue points in a four-line poem for a group start and a softer middle line.',
  'A raised hand or count can start the group; a pencil mark can show where voices become quieter.',
  'Shouting together is not the same as clear choral reading.',
  'Prepare a short poem for choral reading with two other people or a parent. Agree on cues, rehearse twice, perform, and write what improved clarity.'),
L('s2-eng-y3-w15-l1','EN2-RECOM-01',['compare','similar','different','evidence'],
  'Comparing two poems means identifying what is similar and different in topic, language and feeling, using evidence from both texts.',
  'Poem A is about rain with soft s sounds; Poem B is about rain with crashing onomatopoeia. Both share rain; their sound choices create different moods.',
  'Compare openings: "Soft rain tapped the roof" and "Rain smashed the tin." Name one similarity and one difference.',
  'Similarity: both are about rain on a roof/tin. Difference: tapped feels gentle; smashed feels violent.',
  'Listing every line from one poem without referring to the other is not a comparison.',
  'Read two short poems on a related topic. Complete a chart: topic, mood, one language feature each, one similarity, one difference. Quote evidence for each point.'),
L('s2-eng-y3-w15-l2','EN2-CWT-01',['response','quotation','opinion','reason'],
  'A poem response states a personal view supported by quotations and explanations of how the language works.',
  '"I felt calm because the poet wrote \'white hush\' and \'soft frost\', which create a quiet winter picture." Opinion plus quoted words and effect.',
  'Respond to "The lantern flickered like a shy star" with one feeling and one quotation-based reason.',
  'Feeling: gentle wonder. Reason: shy star makes the light seem small and careful.',
  'A response that only says "It was good" without text evidence is incomplete.',
  'Write a 100–140 word response to a poem you have read. Include a clear opinion, two quotations and an explanation of effect for each quotation.'),
L('s2-eng-y3-w15-l3','EN2-VOCAB-01',['figurative','simile','metaphor','alliteration'],
  'Review figurative language by naming the technique, locating an example and explaining its effect on meaning or mood.',
  'In "The wind was a wild broom", broom is a metaphor sweeping the yard clean of leaves. Effect: the wind seems powerful and busy.',
  'Label the technique and effect in "Busy bees buzzed" and "The lake was like glass".',
  'Busy bees buzzed: alliteration (and possible onomatopoeia). Lake like glass: simile for stillness/shininess.',
  'Naming a technique without explaining its effect shows only part of the skill.',
  'Find or write eight examples covering simile, metaphor, alliteration and onomatopoeia (two each). Label each and explain the effect of four examples.'),
L('s2-eng-y3-w15-l4','EN2-HANDW-01',['anthology','joined letters','title page','legibility'],
  'An anthology gathers chosen poems with clear titles; handwriting for labels and title pages should be legible, with developing joins where appropriate.',
  'I copy my favourite poem carefully, write a neat title, and join letters in words such as rain and poem without losing readability.',
  'Write a title page line "My Rain Poems" twice: once printed, once with careful joins on suitable letters.',
  'Both should be readable; joins should not tangle letters into unreadable shapes.',
  'Speed of joining matters less than whether a reader can still recognise each word.',
  'Assemble a mini anthology of three poems (own or copied with permission). Include a handwritten title page, contents list and one carefully joined caption under a drawing. Self-assess legibility.'),
L('s2-eng-y3-w16-l1','EN2-RECOM-01',['everyday persuasion','purpose','technique','audience'],
  'Everyday texts such as notices, packaging and posts can persuade. Identify audience, purpose and techniques before accepting the message.',
  'A canteen notice "Buy fruit first — fuel for learning!" aims at students, uses a slogan and links fruit to energy.',
  'For a library poster "Silent readers finish more quests", name audience, purpose and one technique.',
  'Audience: students using the library. Purpose: encourage quiet reading. Technique: linking silence to a reward idea (quests).',
  'Everyday persuasion can be useful or misleading; purpose recognition comes first.',
  'Collect three everyday persuasive texts. For each, record audience, purpose, two techniques and one question a careful reader should ask.'),
L('s2-eng-y3-w16-l2','EN2-CWT-03',['opinion','reason','example','order'],
  'Order a persuasive paragraph so the opinion comes early, reasons and examples follow, and the ending restates the request.',
  '"We should keep the class garden. Herbs flavour cooking. Bees visit the flowers. Please vote to continue watering rosters." Opinion, reasons, request.',
  'Reorder: "Please vote yes. Herbs flavour cooking. We should keep the class garden. Bees visit."',
  'Opinion first: We should keep the class garden. Then reasons. End with Please vote yes.',
  'Putting the request first without reasons can weaken the argument.',
  'Write two persuasive paragraphs on different topics (90–110 words each) with opinion, two reasons with examples and a closing request. Label each part.'),
L('s2-eng-y3-w16-l3','EN2-VOCAB-01',['should','must','might','modality'],
  'Modality shows how strong a statement is: must is strong obligation, should is recommendation, might is possibility.',
  '"Students must leave bags in the locker zone" is a strong rule. "Students should wear hats in summer" recommends. "It might rain after lunch" shows possibility.',
  'Choose should, must or might for: a fire drill instruction; a suggestion to bring a spare pencil; a weather guess.',
  'Must for fire drill; should for spare pencil; might for weather.',
  'Using must for a mild preference makes the claim sound harsher than intended.',
  'Write nine sentences (three each for should, must, might) about school life. Explain why the strength of the modal fits each situation for three of them.'),
L('s2-eng-y3-w16-l4','EN2-OLC-01',['debate','affirm','reason','respect'],
  'A simple debate has a clear topic, speakers who affirm or oppose, reasons with examples, and respectful listening.',
  'Topic: "School days should start later." Affirm reason: more sleep helps concentration. Oppose reason: later finishes reduce daylight sport time. Speakers take turns without interrupting.',
  'Give one affirm and one oppose reason for "Students should have a weekly outdoor learning afternoon."',
  'Affirm: outdoor learning supports health and attention. Oppose: wet weather and planning time can make it hard every week.',
  'Winning is not the only goal; clear reasons and fair turn-taking matter.',
  'Hold a short structured debate (two speakers each side or roles with a parent). Prepare two reasons each, speak for up to 45 seconds per turn, and write one fair point you heard from the other side.'),
L('s2-eng-y3-w17-l1','EN2-RECOM-01',['argument','claim','support','evaluate'],
  'Reading an argument means finding the claim, the supporting reasons and deciding whether the support is relevant and enough.',
  'Claim: "The oval needs shade sails." Support: "Students wait in full sun for sport." The support is relevant because it links heat to the request.',
  'Find the claim and one support in: "Our class should borrow more science kits. Hands-on kits help us remember investigations."',
  'Claim: borrow more science kits. Support: kits help memory of investigations.',
  'A story detail that does not connect to the claim is not useful support.',
  'Read two short argument paragraphs. For each, identify claim, two supports and one weak or missing support. Explain which argument is stronger and why.'),
]

VISUALS = {
 's2-eng-y3-w14-l2': [pair_visual('Stanza events','ferry left; fog hid bay','Chorus','wait for the light','Ballad events with a repeating chorus line.','Story beats move forward while a line returns.'),
  pair_visual('Order','lost; search; found','Not enough','rhyme without events','Ordered hat adventure contrasted with rhyme-only lines.','A ballad needs a sequence of events.')],
 's2-eng-y3-w14-l3': [pair_visual('Synonyms','happy / glad','Antonyms','happy / sad','Near synonyms contrasted with antonyms.','Choose words by meaning and tone.'),
  pair_visual('Thesaurus','murmuring for quiet noise','Still decide','best fit for purpose','Thesaurus suggestion used only if tone fits.','A list of options still needs a careful choice.')],
 's2-eng-y3-w14-l4': [pair_visual('Group cue','count of three','Softer line','quiet middle words','Choral start cue and softer middle line.','Agreed cues keep voices together.'),
  pair_visual('Unclear','shouting over others','Clear','shared pace; final word held','Shouting contrasted with clear shared pacing.','Clarity matters more than volume.')],
 's2-eng-y3-w15-l1': [pair_visual('Shared topic','rain','Different mood','soft vs crashing sounds','Two rain poems with different sound moods.','Compare both similarity and difference.'),
  pair_visual('Evidence A','tapped the roof','Evidence B','smashed the tin','Quoted openings supporting a comparison.','Use words from both poems.')],
 's2-eng-y3-w15-l2': [pair_visual('Opinion','I felt calm','Quotation','white hush','Opinion supported by a quoted phrase.','Quotations must connect to the feeling.'),
  pair_visual('Effect','quiet winter picture','Incomplete','It was good','Effect statement contrasted with empty praise.','Explain how the language works.')],
 's2-eng-y3-w15-l3': [pair_visual('Metaphor','wind was a wild broom','Effect','powerful and busy','Metaphor with a clear effect on mood.','Name technique and effect together.'),
  pair_visual('Simile','lake like glass','Alliteration','busy bees buzzed','Simile and alliteration examples for review.','Different techniques create different effects.')],
 's2-eng-y3-w15-l4': [pair_visual('Title page','My Rain Poems','Contents','three chosen poems','Anthology title page and contents list.','Gather poems with clear organisation.'),
  pair_visual('Joined sample','rain; poem','Readable','letters still distinct','Joined handwriting that stays readable.','Joins must not hide letter shapes.')],
 's2-eng-y3-w16-l1': [pair_visual('Everyday text','canteen fruit notice','Technique','slogan + benefit link','Everyday persuasive canteen notice.','Find audience, purpose and technique.'),
  pair_visual('Poster','Silent readers finish quests','Reader question','Is the reward real?','Library poster with a careful reader question.','Purpose recognition comes before trust.')],
 's2-eng-y3-w16-l2': [pair_visual('Opinion first','keep the class garden','Then reasons','herbs; bees','Opinion placed before supporting reasons.','Order strengthens a persuasive paragraph.'),
  pair_visual('Close','vote to continue','Weak order','request with no reasons','Closing request contrasted with unsupported ask.','Reasons should appear before the final push.')],
 's2-eng-y3-w16-l3': [pair_visual('must','fire drill rule','should','wear hats in summer','Strong must contrasted with recommended should.','Match modal strength to the situation.'),
  pair_visual('might','rain after lunch','Too strong','must for a guess','Possibility might contrasted with unfair must.','Guesses need weaker modality.')],
 's2-eng-y3-w16-l4': [pair_visual('Affirm','later start; more sleep','Oppose','later finish; less daylight sport','Debate reasons on both sides of a topic.','Each side needs clear reasons.'),
  pair_visual('Turn-taking','no interrupting','Fair note','point heard from other side','Respectful turn-taking in a short debate.','Listen for a fair opposing point.')],
 's2-eng-y3-w17-l1': [pair_visual('Claim','oval needs shade sails','Support','wait in full sun','Argument claim with a relevant support.','Support must connect to the claim.'),
  pair_visual('Stronger','relevant heat reason','Weaker','unrelated story detail','Relevant support contrasted with unrelated detail.','Evaluate whether reasons are enough.')],
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
