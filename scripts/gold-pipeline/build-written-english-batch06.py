#!/usr/bin/env python3
"""Year 3 English Written Core batch 06: w17-l2 through w20-l1 (12 lessons)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, vocab=vocab, principle=principle, model=model,
                guided=guided, feedback=feedback, misconception=misconception, independent=independent)

LESSONS = [
L('s2-eng-y3-w17-l2','EN2-CWT-03',['position','statement','reason','audience'],
  'A position statement clearly says what you want and why, matching language to the audience.',
  '"Our class should keep Friday reading clubs because quiet reading improves concentration and enjoyment." Position plus reason for teachers and students.',
  'Write a one-sentence position for longer lunch play, then add one reason suited to a principal audience.',
  'Position: lunch play should be longer. Reason for a principal: more movement helps afternoon learning focus.',
  'A wish without a reason is not yet a position statement for persuasion.',
  'Write three position statements on different school topics (two sentences each). Vary the audience once (peer vs adult) and explain one language change you made.'),
L('s2-eng-y3-w17-l3','EN2-VOCAB-01',['because','therefore','so','connective'],
  'Reason connectives such as because, so and therefore link a claim to its support and help readers follow the logic.',
  '"We need shade sails because students wait in the sun; therefore the council should fund covers." Because explains; therefore shows a result.',
  'Join these ideas with a suitable connective: "Kits help memory. We should borrow more kits."',
  'Kits help memory, so / therefore we should borrow more kits. Or: We should borrow more kits because kits help memory.',
  'Stacking many connectives in one sentence can confuse rather than clarify.',
  'Rewrite six short argument pairs using because, so or therefore appropriately. Label which word shows reason and which shows result for three examples.'),
L('s2-eng-y3-w17-l4','EN2-OLC-01',['speech','listen','main point','note'],
  'Listening to a speech means tracking the speaker\'s main point, key reasons and delivery choices that help the audience.',
  'The speaker said recycling bins should be nearer classrooms, gave two reasons about time and litter, and slowed on the final request.',
  'While a parent reads a 30-second opinion, jot the main point and one reason.',
  'Main point should be the ask or claim; one reason should match a supporting idea you heard.',
  'Writing every word is less useful than capturing the claim and supports.',
  'Listen to two short speeches (live or recorded). For each, note main point, two reasons and one delivery choice (pace, volume or gesture). Compare which speech was clearer.'),
L('s2-eng-y3-w18-l1','EN2-RECOM-01',['bias','audience','point of view','fair'],
  'Bias appears when a text favours one side by leaving out facts, using loaded words or speaking only to one audience\'s interests.',
  'A shop flyer saying "Everyone needs this wonder snack" uses exaggeration and ignores cost. The audience is shoppers; the bias sells the product.',
  'Spot possible bias in: "Only lazy students dislike early starts." Name the loaded word and missing view.',
  'Loaded: lazy. Missing: students who need sleep for health or focus.',
  'Having an opinion is not always unfair bias; hiding other reasonable views can be.',
  'Analyse three short persuasive texts for audience, point of view, one biased word or omission and one fairer question a reader could ask.'),
L('s2-eng-y3-w18-l2','EN2-CWT-03',['evidence','example','paragraph','support'],
  'Argument paragraphs need a claim, evidence or examples that support it, and a linking sentence that shows why the evidence matters.',
  '"We should plant more trees. Last summer the unshaded seats were empty by noon. Shade would keep the courtyard usable." Claim, observation evidence, link.',
  'Add one evidence sentence after: "Our class needs a second water cooler."',
  'Evidence might note queues, empty bottles or heat days — something observable that supports the need.',
  'Repeating the claim is not evidence.',
  'Write two argument paragraphs (100–120 words) with claim, two pieces of evidence and a linking sentence. Underline the evidence.'),
L('s2-eng-y3-w18-l3','EN2-VOCAB-01',['emotive','neutral','tone','effect'],
  'Emotive language stirs feelings; writers choose it for effect, and readers should notice when tone is pushing them.',
  '"Starving children" is more emotive than "hungry children". Both can describe need; the first presses urgency and pity more strongly.',
  'Rewrite "The cruel timetable ruins mornings" as a more neutral sentence with the same basic idea.',
  'Neutral option: "The early timetable makes mornings difficult for some students."',
  'Emotive words are not always wrong; readers still need to notice their effect.',
  'Create a two-column list of eight pairs (emotive vs neutral). Write two short persuasive sentences using emotive language and two calmer versions; explain the tone change.'),
L('s2-eng-y3-w18-l4','EN2-OLC-01',['rebuttal','respond','respect','counter'],
  'A rebuttal calmly responds to another side\'s reason with a counter-reason or clarification, without personal insults.',
  'Other side: "Later starts mean less sport light." Rebuttal: "Sport can move to morning PE twice a week so daylight still supports activity."',
  'Rebut: "Longer lunches waste learning time." Give one respectful counter-reason.',
  'Counter: short outdoor breaks can improve afternoon focus, so learning time can become more effective.',
  'Calling the other speaker silly is not a rebuttal.',
  'Prepare rebuttals for three opposing reasons on a school topic. Practise saying each in under 20 seconds. Write the fairest opposing reason and your best rebuttal.'),
L('s2-eng-y3-w19-l1','EN2-RECOM-01',['advertisement','poster','slogan','visual'],
  'Advertisements and posters persuade with slogans, images, layout and selective facts aimed at a target audience.',
  'A sports-club poster uses bright balls, the slogan "Join the fun squad!" and a free-trial date to attract families.',
  'For a library poster with a giant book and "Read your way to adventure", name audience, slogan job and one visual choice.',
  'Audience: students/families. Slogan: invites reading as adventure. Visual: giant book draws the eye to reading.',
  'Pretty design alone does not prove the offer is good; evaluate the claim.',
  'Compare two ads or posters. Record audience, slogan, two techniques and one fact that is missing. Decide which is more trustworthy and why.'),
L('s2-eng-y3-w19-l2','EN2-CWT-03',['persuasive letter','greeting','request','close'],
  'A persuasive letter greets the reader, states the request, gives reasons and closes politely.',
  '"Dear Principal, Please approve shade sails for the oval. Students wait in full sun before sport. Kind regards, Sam Lee." Request, reason, polite close.',
  'Draft a greeting, one-sentence request and polite close for a letter about a classroom plant shelf.',
  'Greeting: Dear Ms ... Request: Please approve a plant shelf. Close: Kind regards, ...',
  'Jumping straight to complaints without a clear request weakens the letter.',
  'Write a full persuasive letter (120–160 words) to a real school role about a fair request. Include greeting, request, two reasons, closing. Label each part.'),
L('s2-eng-y3-w19-l3','EN2-VOCAB-01',['formal','informal','convention','register'],
  'Formal letters use conventional greetings, clearer complete sentences and respectful vocabulary instead of slang.',
  'Informal: "Hey, can we get coolers ASAP?" Formal: "Dear Principal, Could the school install an additional water cooler near Room 3?"',
  'Rewrite "That rule is dumb — fix it" as a formal sentence suitable for a letter.',
  'Formal: "I respectfully request a review of this rule because it causes problems for students who..."',
  'Formal does not mean unfriendly; it means clear and respectful for the audience.',
  'Convert five informal messages into formal letter sentences. Write one short formal paragraph requesting a fair change and list three conventions you used.'),
L('s2-eng-y3-w19-l4','EN2-HANDW-01',['formal letter','layout','legibility','margin'],
  'Handwriting a formal letter needs readable letters, sensible line spacing, clear margins and a neat layout for greeting, body and close.',
  'I leave a left margin, write Dear Principal on its own line, keep body lines evenly spaced and place Kind regards above my name.',
  'Copy a three-line letter greeting and close with careful spacing; mark where the margin sits.',
  'Margin should be consistent; greeting and close should be easy to find.',
  'Tiny cramped writing can hide a good request.',
  'Handwrite a short formal letter (greeting, two body sentences, close, name). Photograph or keep the page. Self-assess margin, spacing and legibility with three ticks or fixes.'),
L('s2-eng-y3-w20-l1','EN2-RECOM-01',['evaluate','strong','weak','criteria'],
  'Evaluating arguments means judging whether claims are clear and whether reasons and evidence are relevant, enough and fair.',
  'Strong: clear claim plus two relevant school examples. Weak: claim plus an insult and no facts. Criteria: clarity, relevance, fairness.',
  'Rate this as strong or weak and say why: "Buy our juice — everyone cool drinks it."',
  'Weak for school-style argument evaluation: bandwagon claim, no evidence about health or need.',
  'Longer writing is not automatically stronger; quality of support matters.',
  'Evaluate three short arguments using a checklist: clear claim, relevant support, fairness, enough detail. Rank them and justify the top and bottom choices.'),
]

VISUALS = {
 's2-eng-y3-w17-l2': [pair_visual('Position','keep Friday reading clubs','Reason','improves concentration','Position statement with a clear supporting reason.','Say what you want and why.'),
  pair_visual('Peer wording','let\'s keep clubs','Adult wording','please approve continued clubs','Audience-matched language for the same request.','Match words to the reader.')],
 's2-eng-y3-w17-l3': [pair_visual('because','explains a reason','therefore','shows a result','Reason and result connectives contrasted.','Choose the connective that matches the link.'),
  pair_visual('Clear join','kits help memory, so borrow more','Overloaded','because so therefore all at once','One clear connective contrasted with stacked connectives.','One well-chosen link is enough.')],
 's2-eng-y3-w17-l4': [pair_visual('Main point','bins nearer classrooms','Reasons','time; litter','Speech claim with two supporting reasons.','Track claim and supports while listening.'),
  pair_visual('Delivery','slowed on final request','Note style','claim + reasons, not every word','Useful listening notes contrasted with word-for-word copying.','Capture the structure of the speech.')],
 's2-eng-y3-w18-l1': [pair_visual('Loaded word','lazy students','Missing view','need for sleep','Biased wording with a missing perspective.','Notice what a text leaves out.'),
  pair_visual('Flyer bias','wonder snack for everyone','Fair question','What does it cost?','Exaggerated flyer with a careful reader question.','Bias often hides limits or other views.')],
 's2-eng-y3-w18-l2': [pair_visual('Claim','plant more trees','Evidence','unshaded seats empty by noon','Claim supported by an observable example.','Evidence must connect to the claim.'),
  pair_visual('Link','shade keeps courtyard usable','Not evidence','repeating the claim only','Linking sentence contrasted with bare repetition.','Show why the evidence matters.')],
 's2-eng-y3-w18-l3': [pair_visual('Emotive','starving children','Neutral','hungry children','Emotive wording contrasted with a calmer label.','Tone changes how readers feel.'),
  pair_visual('Pushy','cruel timetable ruins mornings','Calmer','early timetable makes mornings difficult','Strong emotive claim rewritten more neutrally.','Readers should notice when tone pushes them.')],
 's2-eng-y3-w18-l4': [pair_visual('Opposing reason','later starts; less sport light','Rebuttal','move PE to morning twice a week','Respectful rebuttal offering a practical counter.','Answer the reason, not the person.'),
  pair_visual('Respect','calm counter-reason','Not rebuttal','calling someone silly','Fair rebuttal contrasted with a personal insult.','Stay on the idea.')],
 's2-eng-y3-w19-l1': [pair_visual('Slogan','Join the fun squad!','Visual','bright balls; free-trial date','Poster slogan and visual attracting families.','Ads combine words and images for a target audience.'),
  pair_visual('Technique','giant book image','Missing fact','cost or time required','Eye-catching visual with a missing practical fact.','Evaluate the claim beyond the design.')],
 's2-eng-y3-w19-l2': [pair_visual('Greeting','Dear Principal','Request','approve shade sails','Letter opening with a clear request.','State the ask early.'),
  pair_visual('Reason','wait in full sun','Close','Kind regards','Supporting reason and polite closing line.','Reasons and manners both matter.')],
 's2-eng-y3-w19-l3': [pair_visual('Informal','Hey, coolers ASAP','Formal','Dear Principal, additional cooler','Informal message rewritten in formal register.','Formal letters use conventions and respect.'),
  pair_visual('Convention','complete sentences','Avoid','slang insults','Formal conventions contrasted with slang.','Clear and respectful still allows firm requests.')],
 's2-eng-y3-w19-l4': [pair_visual('Layout','margin; greeting line','Body','even spacing','Handwritten letter layout with margin and spacing.','Layout helps the reader find each part.'),
  pair_visual('Close block','Kind regards; name','Problem','cramped tiny letters','Neat close contrasted with cramped writing.','Legibility carries the request.')],
 's2-eng-y3-w20-l1': [pair_visual('Strong','clear claim + relevant examples','Weak','insult + no facts','Strong and weak arguments side by side.','Judge clarity, relevance and fairness.'),
  pair_visual('Bandwagon','everyone cool drinks it','Better support','health or need evidence','Weak bandwagon claim needing real support.','Length alone does not make an argument strong.')],
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
