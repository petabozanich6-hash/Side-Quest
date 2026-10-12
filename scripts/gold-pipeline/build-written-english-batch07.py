#!/usr/bin/env python3
"""Year 3 English Written Core batch 07: w20-l2 through w23-l1 (12 lessons)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, vocab=vocab, principle=principle, model=model,
                guided=guided, feedback=feedback, misconception=misconception, independent=independent)

LESSONS = [
L('s2-eng-y3-w20-l2','EN2-CWT-03',['exposition','introduction','body','conclusion'],
  'A final exposition introduces a clear position, develops reasons with evidence in the body and concludes by restating the request.',
  '"School gardens should stay. Herbs flavour cooking. Bees visit flowers. Keep the watering roster." Introduction, body reasons, conclusion.',
  'Outline intro, two body points and a conclusion for "Our class needs more library borrowing time."',
  'Intro states the need; body might cover unfinished books and research projects; conclusion restates the request politely.',
  'New unrelated ideas in the conclusion weaken the exposition.',
  'Write a complete exposition (150–180 words) on a school improvement topic. Label introduction, body reasons with evidence and conclusion. Check that the ending matches the opening position.'),
L('s2-eng-y3-w20-l3','EN2-VOCAB-01',['clause','subject','verb','complex'],
  'A clause has a subject and a verb. Simple sentences use one clause; complex sentences join clauses to show relationships such as reason or time.',
  '"Students waited" is one clause. "Students waited because the bus was late" joins a main clause to a reason clause.',
  'Mark the subject and verb in "The lantern flickered" and join it to "the wind rose" with a time or reason word.',
  'Subject: The lantern; verb: flickered. Join: The lantern flickered when/as/because the wind rose — choose the meaning you want.',
  'A group of words without a verb is not a clause.',
  'Identify subject and verb in eight sentences. Rewrite four as complex sentences using because, when or if. Explain how one join changes the relationship.'),
L('s2-eng-y3-w20-l4','EN2-OLC-01',['speech','pace','eye contact','structure'],
  'Presenting a speech means delivering a clear structure with controlled pace, audible voice and audience awareness.',
  'I open with my position, give two reasons, pause before the final request and look up from my cards between points.',
  'Plan a 45-second speech card: opening line, two reason words, closing request.',
  'Cards should cue structure without forcing a full script read in a monotone.',
  'Rushing every word makes even good reasons hard to follow.',
  'Present a 45–60 second persuasive speech to a parent or peer. Use cue cards, include position and two reasons, and write one delivery improvement after feedback.'),
L('s2-eng-y3-w21-l1','EN2-RECOM-01',['setting','prediction','clue','atmosphere'],
  'Setting details about place and time help readers predict what might happen next and feel the story\'s atmosphere.',
  '"Fog wrapped the jetty at dusk" suggests limited sight and possible caution. A reader might predict a slow approach or a surprise in the mist.',
  'From "Sun glared on empty bleachers at noon", make one prediction and name the clue.',
  'Prediction: few people will sit there / someone may seek shade. Clue: glare, empty, noon heat.',
  'Predictions should use text clues, not only wishful guesses.',
  'Read or invent three story openings rich in setting. For each, list place/time clues, atmosphere words and one justified prediction.'),
L('s2-eng-y3-w21-l2','EN2-CWT-01',['diary','in role','first person','feeling'],
  'A diary entry in role uses first person, the character\'s feelings and details from the story world as if you are that character.',
  '"Dear Diary, Today the fog hid the ferry and my hands shook on the rope. I whispered that I would wait for the light." First person, feeling, setting detail.',
  'Write three diary lines as a character who lost a hat on a windy oval.',
  'Use I/my, name the windy oval and include a feeling such as worry or determination.',
  'Retelling the plot in third person is not a diary in role.',
  'Write a diary entry (120–150 words) as a story character after a key event. Include first person, two feelings and three story-world details. Stay in role throughout.'),
L('s2-eng-y3-w21-l3','EN2-VOCAB-01',['verb group','tense','past','present'],
  'Verb groups show what is happening and when. Keeping tense consistent helps readers track time in a narrative.',
  '"She was running toward the gate" uses a past progressive verb group. Switching suddenly to "she shouts" without a reason can confuse the timeline.',
  'Correct the tense drift: "Maya opened the door and sees the note."',
  'Maya opened the door and saw the note. (Both past.)',
  'Present tense can be used for vivid storytelling, but it should stay consistent unless a flashback is signalled.',
  'Underline verb groups in a short paragraph. Rewrite one past-tense paragraph and one present-tense version of the same event. Fix three tense drifts in mixed sentences.'),
L('s2-eng-y3-w21-l4','EN2-OLC-01',['read-aloud','discussion','turn','evidence'],
  'Read-aloud and discussion combine expressive reading with talk that uses evidence from the text.',
  'After reading the fog jetty paragraph aloud with a slower pace on "dusk", we discussed whether the character felt fear, quoting "hands shook".',
  'Prepare one discussion question about a character\'s feeling that requires a quotation to answer.',
  'Strong question: What shows the character is unsure? Expected answer uses a quoted clue.',
  'Yes/no questions with no text link give thin discussion.',
  'Read a short passage aloud, then lead a three-turn discussion with a parent or peer using two evidence-based questions. Record the best quotation used.'),
L('s2-eng-y3-w22-l1','EN2-RECOM-01',['trait','evidence','action','dialogue'],
  'Character traits are qualities we infer from actions, dialogue and reactions, always backed by evidence.',
  'When Sam shares the last apple without being asked, readers can infer kindness. Evidence: the sharing action, not only the word kind in narration.',
  'Name a trait and evidence for: "Lina returned the lost purse before checking the shops."',
  'Trait: honest/responsible. Evidence: returned the purse first.',
  'Listing appearance alone does not prove a character trait.',
  'For two characters, record three traits each with quoted or paraphrased evidence from actions or dialogue. Explain one trait that changes after an event.'),
L('s2-eng-y3-w22-l2','EN2-CWT-01',['description','trait','show','detail'],
  'A character description shows traits through specific details, actions and carefully chosen words rather than only labelling.',
  '"Jax\'s pockets bulged with spare pencils he offered before anyone asked" shows helpfulness more clearly than "Jax was nice".',
  'Replace "Mina was brave" with two showing sentences set at a stormy jetty.',
  'Showing might include stepping onto the wet boards first or speaking calmly to a younger child.',
  'A long list of adjectives without actions still tells more than it shows.',
  'Write a 120–150 word character description for an original or known character. Include appearance sparingly, two shown traits and one short spoken line. Avoid empty labels.'),
L('s2-eng-y3-w22-l3','EN2-VOCAB-01',['adverbial','time','place','when/where'],
  'Adverbials of time and place tell when and where actions happen, helping readers track the scene.',
  '"Before dawn, Maya waited at the jetty" uses a time adverbial (Before dawn) and a place adverbial (at the jetty).',
  'Add a time and a place adverbial to "Sam practised the speech."',
  'Example: After lunch, Sam practised the speech in the quiet library corner.',
  'Too many adverbials can clutter a sentence; choose the ones that matter.',
  'Write ten sentences: five with clear time adverbials and five with place adverbials. Expand three into sentences that use both without becoming confusing.'),
L('s2-eng-y3-w22-l4','EN2-OLC-01',['hot seat','interview','in role','question'],
  'Hot-seat interviewing means one person answers in role as a character while others ask focused questions about motives and feelings.',
  'Question: "Why did you wait on the jetty?" In-role answer: "I promised I would wait for the light, even though my hands shook."',
  'Write two hot-seat questions that ask for a reason, not only a yes/no fact.',
  'Useful: Why...? How did you feel when...? What made you choose...?',
  'Guessing answers out of role breaks the interview.',
  'Run a hot-seat round: prepare five questions, answer three in role (or swap with a parent). Write the strongest question and the best in-role answer.'),
L('s2-eng-y3-w23-l1','EN2-RECOM-01',['plot','problem','attempt','outcome'],
  'Plot is the sequence of events; the problem is the difficulty the character faces, followed by attempts and an outcome.',
  'Problem: the ferry is hidden by fog. Attempt: the child waits and calls. Outcome: the light appears and boarding begins.',
  'Name problem and one attempt in: "The hat blew onto the oval fence; Kai climbed carefully and reached."',
  'Problem: hat on the fence. Attempt: climbed carefully and reached.',
  'Listing random events without a problem does not explain plot clearly.',
  'Map two short stories or story openings into problem, two attempts and outcome. Explain which attempt best moves toward solving the problem.'),
]

VISUALS = {
 's2-eng-y3-w20-l2': [pair_visual('Introduction','gardens should stay','Body','herbs; bees','Exposition opening and body reasons.','Build from position to support.'),
  pair_visual('Conclusion','keep watering roster','Weak end','brand-new unrelated idea','Matching conclusion contrasted with a stray ending.','The ending should echo the opening position.')],
 's2-eng-y3-w20-l3': [pair_visual('One clause','Students waited','Complex','waited because the bus was late','Simple clause expanded with a reason clause.','A clause needs a subject and a verb.'),
  pair_visual('Subject/verb','lantern / flickered','Join','when the wind rose','Subject–verb marked, then joined for time.','Joins show relationships between ideas.')],
 's2-eng-y3-w20-l4': [pair_visual('Structure','position; two reasons; request','Pace','pause before final ask','Speech structure with a deliberate pause.','Structure and pace help the audience.'),
  pair_visual('Cue cards','key words only','Problem','rushed monotone script','Cue cards contrasted with rushing a full script.','Look up between points.')],
 's2-eng-y3-w21-l1': [pair_visual('Setting clue','fog; jetty; dusk','Prediction','slow approach or surprise','Setting details feeding a justified prediction.','Use clues, not wishful guesses.'),
  pair_visual('Heat clue','sun; empty bleachers; noon','Prediction','seek shade / few sitters','Noon glare supporting a heat-based prediction.','Atmosphere words guide expectations.')],
 's2-eng-y3-w21-l2': [pair_visual('First person','I; my hands shook','Story detail','fog hid the ferry','Diary in role with feeling and setting.','Stay inside the character\'s voice.'),
  pair_visual('In role','Dear Diary...','Not diary','third-person plot retell','First-person diary contrasted with third-person retell.','Feelings belong in the entry.')],
 's2-eng-y3-w21-l3': [pair_visual('Past group','was running','Drift','suddenly shouts','Consistent past contrasted with tense drift.','Keep time signals consistent.'),
  pair_visual('Fix','opened ... saw','Same event','present-tense vivid version','Corrected past pair and an intentional present rewrite.','Choose a tense and hold it.')],
 's2-eng-y3-w21-l4': [pair_visual('Read-aloud','slower pace on dusk','Discussion','quote: hands shook','Expressive reading feeding evidence talk.','Discussion should use the text.'),
  pair_visual('Strong question','What shows uncertainty?','Thin question','yes/no with no quote needed','Evidence question contrasted with a thin yes/no.','Ask for proof from the passage.')],
 's2-eng-y3-w22-l1': [pair_visual('Action evidence','shares last apple','Trait','kindness','Trait inferred from a generous action.','Base traits on evidence.'),
  pair_visual('Dialogue/action','returned purse first','Not enough','hair colour only','Honest action contrasted with appearance-only notes.','Appearance alone rarely proves a trait.')],
 's2-eng-y3-w22-l2': [pair_visual('Show','pockets of spare pencils','Tell','Jax was nice','Showing detail contrasted with an empty label.','Show traits through actions.'),
  pair_visual('Brave shown','steps onto wet boards first','Spoken line','short character speech','Shown bravery plus a short spoken line.','Mix detail, action and voice.')],
 's2-eng-y3-w22-l3': [pair_visual('Time','Before dawn','Place','at the jetty','Time and place adverbials in one sentence.','Adverbials answer when and where.'),
  pair_visual('Expanded','After lunch ... in the library','Clutter','too many adverbials stacked','Clear expansion contrasted with cluttered stacking.','Choose the adverbials that matter.')],
 's2-eng-y3-w22-l4': [pair_visual('Question','Why did you wait?','In-role answer','I promised ... hands shook','Hot-seat reason question with in-role reply.','Questions should invite motives and feelings.'),
  pair_visual('Useful stems','Why / How / What made','Break','answering out of role','Focused stems contrasted with breaking role.','Stay in character for answers.')],
 's2-eng-y3-w23-l1': [pair_visual('Problem','ferry hidden by fog','Attempt','wait and call','Plot problem with a clear attempt.','Plot needs a difficulty to solve.'),
  pair_visual('Outcome','light appears; boarding','Weak map','random events, no problem','Outcome linked to problem contrasted with random events.','Attempts should move toward the outcome.')],
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
