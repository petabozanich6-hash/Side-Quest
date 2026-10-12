#!/usr/bin/env python3
"""Year 3 English Written Core batch 11: w32-l2 through w35-l1 (12 lessons)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, vocab=vocab, principle=principle, model=model,
                guided=guided, feedback=feedback, misconception=misconception, independent=independent)

LESSONS = [
L('s2-eng-y3-w32-l2','EN2-CWT-01',['plan','hero','challenge','quest'],
  'Planning a classroom myth-style story means mapping hero, challenge, helper and outcome before drafting, using original ideas rather than copying sacred stories.',
  'Hero: Lea the map-maker. Challenge: a bridge washed away. Helper: a river bird with a warning. Outcome: Lea finds a higher ford.',
  'Fill a four-box plan for an original quest about a lost lantern.',
  'Boxes: hero, challenge, helper/tool, outcome — all invented classroom fiction, not copied sacred narratives.',
  'A plan without a challenge will produce a flat quest.',
  'Create two original myth-pattern plans (not retells of sacred or copyrighted plots). Include hero, setting, challenge, helper, task and outcome. Choose one plan to draft later.'),
L('s2-eng-y3-w32-l3','EN2-VOCAB-01',['noun','pronoun','agreement','singular/plural'],
  'Pronouns must agree with the nouns they replace in number and clarity so readers know who is acting.',
  '"The heroes raised their shields." Heroes is plural, so their fits. "The hero raised their shields" needs care: either one hero/his or her shield, or rewrite for clarity.',
  'Fix agreement: "Maya and Kai packed her bag for the quest."',
  'Maya and Kai packed their bags. (plural)',
  'A pronoun with no clear noun leaves readers guessing.',
  'Correct eight agreement errors in mixed sentences. Rewrite a short quest paragraph so every pronoun clearly matches its noun.'),
L('s2-eng-y3-w32-l4','EN2-OLC-01',['dramatic','retell','gesture','voice'],
  'Dramatic retelling uses voice, gesture and clear event order to bring a story moment to listeners.',
  'For the washed-away bridge, I widen my eyes on the flood line, slow my voice on "the planks were gone," then straighten as Lea chooses the higher ford.',
  'Choose one gesture and one voice change for a hero spotting a helper bird.',
  'Gesture might be a hand-shade look; voice might lift on the discovery.',
  'Acting wildly without keeping the plot order confuses the retell.',
  'Dramatically retell a 45–60 second moment from an original or approved published story. Keep event order, use two voice choices and one gesture, then note audience feedback.'),
L('s2-eng-y3-w33-l1','EN2-RECOM-01',['folktale','pattern','culture','published'],
  'Folktales from around the world often share patterns such as tricksters, journeys or rewards; readers study published versions and respect cultural sources named in the book.',
  'A published folktale may show a clever smaller character outwitting a bully. We note the country/culture named by the author or collector and avoid inventing "traditional" claims we cannot source.',
  'From a published folktale you know, name one pattern (trick, journey, reward) and the source book if possible.',
  'Answer should cite a real published children\'s version available to the student, not an invented tradition.',
  'Assuming every culture shares the same moral sticker erases difference.',
  'Compare two published folktales from different places (classroom/library). Chart pattern, setting clues, problem and ending. Record each book\'s title and any culture/source note in the book.'),
L('s2-eng-y3-w33-l2','EN2-CWT-01',['folktale','original','pattern','ending'],
  'Writing a folktale-style story for class means creating an original tale that uses familiar patterns while inventing your own characters and setting.',
  '"In a cliffside village, tiny Pip outwits a greedy goat by offering three riddles." Original characters with a trickster pattern.',
  'Plan an original trickster moment in three sentences (problem, trick, result).',
  'Keep it classroom-original; do not copy a published plot beat-for-beat.',
  'Copying a traditional tale and changing one name is not strong original writing.',
  'Write an original folktale-style story (160–200 words) with clear problem, pattern feature and ending. Add a one-line note: "Original classroom tale — not a traditional sacred story."'),
L('s2-eng-y3-w33-l3','EN2-VOCAB-01',['direct speech','comma','capital','end marks'],
  'Direct speech review consolidates quotation marks, capitals, commas/reporting clauses and end marks.',
  'Correct: Lea said, "The ford is higher up." The comma sits before the quote; the quoted sentence starts with a capital.',
  'Punctuate: the bird warned run to the ridge',
  'The bird warned, "Run to the ridge!"',
  'Missing commas or end marks inside/outside quotes are common errors to hunt.',
  'Punctuate ten direct speech sentences (including interrupted quotes). Rewrite a dialogue of six lines from your folktale with accurate speech punctuation.'),
L('s2-eng-y3-w33-l4','EN2-OLC-01',['readers theatre','roles','cue','expression'],
  'Readers theatre turns a tale into shared reading roles with cues, expression and steady pacing.',
  'Narrator reads setting; Pip speaks riddle lines with a light quick voice; Goat answers in a grumpy slower voice. Cues show turns.',
  'Assign roles for: Narrator: Wind shook the ridge. Pip: "One more riddle!"',
  'Narrator vs Pip clearly split; expression matches character.',
  'Overlapping voices without cues muddle the performance.',
  'Script 10–14 lines of readers theatre from an original or approved tale. Rehearse roles, perform once and record one cue or expression that improved clarity.'),
L('s2-eng-y3-w34-l1','EN2-RECOM-01',['legend','heroic deed','place','structure'],
  'Legends often link a remarkable deed to a place or community memory; readers track setting, deed, challenge and how the story explains a name or landmark in published versions.',
  'A published legend might tell how a lookout rock got its name after a watcher warned the town. Structure: place, threat, deed, remembered name.',
  'Order these legend parts: remembered name; threat; place introduced; heroic deed.',
  'Place → threat → deed → remembered name (typical teaching order).',
  'Not every exciting story is a legend; look for the place/memory link in the version you read.',
  'Read a published children\'s legend. Map place, threat, deed and memory/name link. Quote one sentence that ties the deed to the place.'),
L('s2-eng-y3-w34-l2','EN2-CWT-01',['legend','deed','landmark','original'],
  'Writing a legend-style classroom story invents a deed that could explain a local place name or landmark, while staying clearly fictional school writing.',
  '"Why the Oval Gum stands alone: Sam rang the storm bell in time, and the town left the old gum as a thank-you marker." Deed linked to a place.',
  'Invent a one-sentence place-name link for "Broken Jetty Bend" using an original helper character.',
  'Sentence should connect a deed to why the bend has that name — fictional classroom legend style.',
  'Do not claim your classroom legend is true history unless you are recounting a verified local historical source.',
  'Write an original legend-style tale (160–200 words) explaining a made-up or local place nickname. Include place, threat, deed and memory link. Label it classroom fiction.'),
L('s2-eng-y3-w34-l3','EN2-VOCAB-01',['sentence variety','short','compound','complex'],
  'Sentence variety mixes short sentences for impact with compound and complex sentences for detail so writing does not sound flat.',
  'Short: "The bell rang." Compound: "The bell rang, and doors flew open." Complex: "When the bell rang, doors flew open."',
  'Rewrite a flat string: "Sam ran. Sam shouted. Sam saved the boats." using variety.',
  'Example: Sam ran. He shouted as he reached the jetty, and the fishers hauled the boats clear.',
  'Only long sentences can tire readers as much as only short ones.',
  'Revise a paragraph to include at least two short, two compound and two complex sentences. Label each type in the margin.'),
L('s2-eng-y3-w34-l4','EN2-OLC-01',['peer feedback','kind','specific','useful'],
  'Peer feedback should be kind, specific and useful — naming what worked and one clear improvement without unkind jokes.',
  '"Your place link was clear when you named the oval gum. Next, slow down on the storm sentence so we catch the threat." Kind + specific + useful.',
  'Rewrite unkind "This is boring" into useful feedback on a legend ending.',
  'Useful: "I lost the memory link at the end — can you name the place again in the last line?"',
  'Vague praise alone does not help a writer improve.',
  'Swap stories with a peer or parent. Give two strengths and one improvement using the kind/specific/useful pattern. Write the feedback you received and one change you will make.'),
L('s2-eng-y3-w35-l1','EN2-RECOM-01',['compare','myth','legend','criteria'],
  'Comparing myths and legends uses criteria such as gods/supernatural elements, place-memory links, hero type and purpose of the tale in published versions.',
  'A children\'s Greek myth may centre gods and a quest test; a local legend-style tale may explain a landmark name with a human deed. Criteria help us sort similarities and differences.',
  'Using criteria, sort: (1) goddess sets a labour for a hero (2) watcher names Lookout Rock after a warning.',
  '(1) more myth-like in classroom terms; (2) more legend-like with place memory — based on pattern teaching, not rigid ancient definitions.',
  'Some stories blend features; criteria still help comparison.',
  'Compare one published myth and one published legend (or legend-style tale). Complete a criteria chart: supernatural elements, place link, hero type, purpose. Write a 80-word comparison paragraph with evidence.'),
]

VISUALS = {
 's2-eng-y3-w32-l2': [pair_visual('Hero','Lea the map-maker','Challenge','bridge washed away','Original quest plan with hero and challenge.','Map the quest before drafting.'),
  pair_visual('Helper','river bird warning','Outcome','higher ford found','Helper and outcome completing the plan boxes.','Classroom fiction — not copied sacred plots.')],
 's2-eng-y3-w32-l3': [pair_visual('Plural fit','heroes → their shields','Unclear','pronoun with no noun','Agreement that matches number and clarity.','Pronouns must point to clear nouns.'),
  pair_visual('Fix','Maya and Kai packed their bags','Error','packed her bag','Plural agreement fix for two characters.','Match singular and plural carefully.')],
 's2-eng-y3-w32-l4': [pair_visual('Voice','slow on planks were gone','Gesture','eyes widen at flood line','Dramatic voice and gesture on a key moment.','Keep plot order while performing.'),
  pair_visual('Discovery','voice lifts; hand-shade look','Problem','wild acting, lost sequence','Controlled discovery contrasted with chaotic acting.','Expression serves the events.')],
 's2-eng-y3-w33-l1': [pair_visual('Pattern','trickster outwits bully','Source note','culture named in the book','Folktale pattern with a published source note.','Study published versions respectfully.'),
  pair_visual('Compare chart','pattern; setting; problem; ending','Avoid','invented traditional claims','Comparison chart grounded in named books.','Do not invent unsourced traditions.')],
 's2-eng-y3-w33-l2': [pair_visual('Original','Pip; greedy goat; three riddles','Pattern','trickster','Original classroom tale using a familiar pattern.','Invent characters; do not copy plots.'),
  pair_visual('Label','Original classroom tale','Not enough','rename one character in a copied tale','Honesty label contrasted with thin renaming.','Original writing needs new events.')],
 's2-eng-y3-w33-l3': [pair_visual('Speech marks','"The ford is higher up."','Reporting comma','Lea said,','Direct speech punctuation with comma and capital.','Quoted sentences need end marks too.'),
  pair_visual('Urgent quote','"Run to the ridge!"','Common miss','missing comma before quote','Excited quote with complete punctuation.','Hunt missing commas and capitals.')],
 's2-eng-y3-w33-l4': [pair_visual('Narrator','Wind shook the ridge','Character','Pip: One more riddle!','Readers-theatre roles split cleanly.','Cues keep turns clear.'),
  pair_visual('Expression','Pip light/quick; Goat grumpy/slow','Problem','overlapping voices','Character voices contrasted with muddy overlap.','Expression matches the role.')],
 's2-eng-y3-w34-l1': [pair_visual('Place','lookout rock','Deed','watcher warned the town','Legend structure linking deed to place.','Track how the place is remembered.'),
  pair_visual('Order','place → threat → deed → name','Memory link','rock keeps the name','Ordered legend parts ending in a memory link.','Look for the place/memory connection.')],
 's2-eng-y3-w34-l2': [pair_visual('Landmark','Oval Gum stands alone','Deed','storm bell rung in time','Classroom legend linking deed to landmark.','Deed should justify the place nickname.'),
  pair_visual('Fiction label','classroom legend-style tale','Caution','do not claim unverified history','Fiction label contrasted with false history claims.','Invented legends stay labelled as fiction.')],
 's2-eng-y3-w34-l3': [pair_visual('Short','The bell rang.','Compound','bell rang, and doors flew open','Short and compound sentences side by side.','Variety keeps writing alive.'),
  pair_visual('Complex','When the bell rang, doors flew open','Flat','Sam ran. Sam shouted. Sam saved.','Complex sentence contrasted with flat chops.','Mix lengths with purpose.')],
 's2-eng-y3-w34-l4': [pair_visual('Kind + specific','place link clear: oval gum','Useful next','slow on the storm sentence','Feedback that is kind, specific and useful.','Name what worked and one improvement.'),
  pair_visual('Rewrite','name the place again in the last line','Unhelpful','This is boring','Useful ending note contrasted with unkind vagueness.','Help the writer see a next step.')],
 's2-eng-y3-w35-l1': [pair_visual('Myth-like','gods; quest test','Legend-like','landmark named after a deed','Criteria sorting myth-like and legend-like features.','Use criteria, not guesswork.'),
  pair_visual('Chart','supernatural; place link; hero; purpose','Blend note','some tales share features','Comparison chart allowing blended features.','Evidence belongs in the comparison paragraph.')],
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
