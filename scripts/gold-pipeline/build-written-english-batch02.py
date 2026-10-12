#!/usr/bin/env python3
"""14 original Stage 2 Year 3 English Written Core lesson specifications, batch 02.
No animated, video, or interactive feature implementation. Each lesson must pass
editorial/NESA checks before it can be considered Gold Written Core.
"""
import json
from pipeline import ROOT, reconstruct, baseline_data, atomic_json

LESSONS=json.loads("[[\"w04-l2\",\"Show, don't tell\",\"EN2-CWT-01\",\"Turn a stated emotion into observable actions and meaningful details.\",\"'Pia was frightened' names the feeling. 'Pia gripped the railing as the floorboards creaked' shows evidence that lets the reader infer fear.\",\"Write a two-sentence scene showing excitement without using the word excited.\",\"Check that physical actions and surroundings imply the emotion; do not merely replace excited with happy.\",\"A character can smile for many reasons; include another clue before assuming joy.\",\"Show worry, surprise and relief in three different scenes; underline the exact actions that suggest each feeling.\"],[\"w04-l3\",\"Conjunctions and complex sentences\",\"EN2-CWT-01\",\"Connect an independent idea with a dependent reason or time clause.\",\"'We moved inside because rain soaked the field.' The because-clause explains why; it cannot stand alone as a complete sentence.\",\"Join 'Tara carried a torch' and 'the cave was dark' using because.\",\"'Tara carried a torch because the cave was dark.' The reason follows because and makes one clear sentence.\",\"Putting a full stop before 'because the cave was dark' creates a fragment.\",\"Write four new complex sentences: one each with because, when, although and if. Mark which clause can stand alone and explain punctuation choices.\"],[\"w04-l4\",\"Handwriting speed and legibility\",\"EN2-HANDW-01\",\"Build comfortably readable handwriting before increasing pace.\",\"I write 'We searched beside the creek' at an even size, leave a space between words, check that 'c' and 'e' look different, then time a second careful copy.\",\"Write 'The small kite floated above the oval' twice, once slowly and once at a comfortable pace.\",\"Both copies should keep distinct letters, word spacing and a readable baseline; faster is not better if meaning is lost.\",\"Pressing harder or rushing often decreases clarity and comfort.\",\"Copy a 35–50 word original paragraph from a book or this lesson. Record time, circle unclear letters and rewrite two words more clearly; note how you kept your hand comfortable.\"],[\"w05-l1\",\"Summarising a story\",\"EN2-RECOM-01\",\"Retell only the essential character, problem, action and outcome using your own words.\",\"Story: 'Hana missed her bus, called her aunt and caught the next service.' Summary: 'After missing the bus, Hana arranged help and travelled later.'\",\"Summarise: 'Raj lost his library card; he checked his bag, found it in his jacket and borrowed a book.'\",\"'Raj found his misplaced library card and borrowed a book.' Omitting the jacket preserves the central event.\",\"A summary is shorter than the original and does not add invented feelings.\",\"Read a short story of at least 150 words. Identify its main character, problem, response and outcome; write a 3-sentence summary and justify one minor detail you omitted.\"],[\"w05-l2\",\"Resolution, revising and editing\",\"EN2-CWT-01\",\"Write an ending that solves the central problem, then revise meaning before editing surface errors.\",\"Opening: 'The class plant wilted.' Response: 'They checked the soil and watered it.' Resolution: 'Its leaves lifted over the next week.' Revision checks cause and effect; editing checks capitals.\",\"Complete an ending after 'The puppy escaped through a loose gate' without introducing an unrelated solution.\",\"'A neighbour held the puppy safely while Dad repaired the latch.' It responds directly to the cause of escape.\",\"Revising content and editing spelling are related but different jobs.\",\"Write a six-sentence story ending for a lost map. First revise the solution's logic and clarity, then edit punctuation and spelling; identify one change of each kind.\"],[\"w05-l3\",\"Punctuating dialogue\",\"EN2-CWT-01\",\"Use quotation marks to show exact spoken words and place speech punctuation inside them.\",\"'“Where is my hat?” asked Ben.' The question mark belongs to the spoken question; 'asked Ben' identifies the speaker.\",\"Punctuate: Mila said I can help you.\",\"'Mila said, “I can help you.”' Spoken words go inside quotation marks; the full stop finishes the speech.\",\"A question mark belongs to a question even when a speaker tag follows it.\",\"Write six lines of original dialogue between a child and a shopkeeper; include a question, a statement and a new paragraph when the speaker changes. Check every quotation mark.\"],[\"w05-l4\",\"Publishing and sharing your story\",\"EN2-CWT-01\",\"Prepare a clean final text for a real reader and explain deliberate presentation choices.\",\"I revise a title from 'Story' to 'The Lost Lantern', divide long text into paragraphs when the action changes, and proofread every sentence before reading it aloud.\",\"Choose a descriptive title for a story about a missing bicycle and explain why it fits.\",\"'The Bicycle at the Creek' helps a reader anticipate a setting and problem, unlike 'My Work'.\",\"Publishing is not only making text pretty; meaning and accessibility matter.\",\"Publish a 150–250 word original narrative with title and paragraphs. Add a short author's note identifying two revisions and one response to reader feedback.\"],[\"w06-l1\",\"Text features: headings, glossary and index\",\"EN2-RECOM-01\",\"Use informational text features to locate and interpret facts efficiently.\",\"To learn about echidna food, I scan the contents for 'Feeding', then read the heading. A glossary explains 'invertebrate'; an index points to exact pages.\",\"Which feature helps if you know the word 'habitat' but not its meaning?\",\"A glossary defines habitat. An index helps find its page occurrences, not the meaning directly.\",\"Headings group ideas; they do not guarantee every claim in a section is true.\",\"Create a two-page mini-information text about a local animal with two headings, four glossary definitions and a short alphabetised index. Explain when a reader would use each feature.\"],[\"w06-l2\",\"Planning a report\",\"EN2-CWT-01\",\"Organise factual information by categories before writing paragraphs.\",\"For a koala report I plan: classification (mammal), habitat (eucalypt forests), food (eucalypt leaves), adaptations (gripping claws). Each heading groups related facts.\",\"Sort these koala facts under headings: eats eucalyptus; has sharp claws; lives in trees.\",\"Food: eucalyptus. Adaptations: sharp claws. Habitat: lives in trees; overlap can be explained.\",\"A report presents checked information, not a made-up adventure about an animal.\",\"Choose a NSW native animal. Plan three factual headings, list two verifiable facts per section with source titles and draft an introduction stating what the report will explain.\"],[\"w06-l3\",\"Technical words and vocabulary\",\"EN2-RECOM-01\",\"Use precise subject words and explain them in reader-friendly language.\",\"'The wombat digs a burrow' is more exact than 'The animal makes a hole.' Burrow means an underground shelter made or used by an animal.\",\"Replace 'thing the animal lives in' with a technical term when describing bees.\",\"A hive is a home or structure used by a bee colony; explain the word before relying on it.\",\"A complicated word is not necessarily accurate; choose terms that match the facts.\",\"Create a six-word glossary for a habitat report. Write a plain-English definition, correct example sentence and a non-example for three words; check each against a source.\"],[\"w06-l4\",\"Listening and note-taking\",\"EN2-OLC-01\",\"Listen for the main topic and a few important facts; jot cues rather than transcribing every word.\",\"Speaker: 'Frogs begin as eggs, hatch into tadpoles and later develop legs.' My notes: frogs—eggs → tadpoles → legs. I can rebuild the meaning aloud.\",\"Listen to: 'Rain fills the creek; water flows downhill towards the river.' Write no more than five cue words.\",\"'rain—creek fills—downhill—river' captures sequence without a full transcript.\",\"Notes are memory prompts; their spelling and grammar need not resemble a finished paragraph.\",\"Ask an adult to read a new 100–150 word factual passage twice. Take 6–8 cue notes; deliver a 45-second oral summary and compare it with the passage for one missing or inaccurate detail.\"],[\"w07-l1\",\"Main idea and key details\",\"EN2-RECOM-01\",\"Identify what an informational paragraph is mainly about, then select details that support it.\",\"'Mangroves grow in salty coastal places. Their roots trap mud and shelter small fish.' Main idea: mangroves support coastal habitats. The roots and shelter are supporting details.\",\"What is the main idea of 'Ants live in colonies. Workers gather food, and queens lay eggs'?\",\"The paragraph explains different roles in ant colonies; workers and queens are supporting examples.\",\"The main idea is broader than one tiny fact but narrower than the whole subject of nature.\",\"Read two short factual paragraphs about ecosystems. Give each a 6–10 word main idea sentence and two supporting details; explain why one interesting but unrelated detail does not belong.\"],[\"w07-l2\",\"Writing a classification paragraph\",\"EN2-CWT-01\",\"Group items into a category and name the shared feature before giving examples.\",\"'Marsupials are mammals whose young usually develop in a pouch. Kangaroos and koalas are examples.' The category comes first and examples support it.\",\"Write a topic sentence that classifies frogs as amphibians.\",\"'Frogs are amphibians that generally begin life in water and change form as they grow.' It gives category and shared trait.\",\"A list of examples without a category does not explain classification.\",\"Write a factual 100–130 word paragraph classifying two kinds of Australian animals or rocks. Include a category statement, defining feature, two examples and a final explanatory sentence.\"],[\"w07-l3\",\"Pronouns and cohesion\",\"EN2-CWT-01\",\"Replace repeated nouns with pronouns only when the reader can tell who they mean.\",\"'Leah found a map. She folded it.' She refers to Leah; it refers to the map. In 'Leah told Mia she was late,' she is ambiguous without more context.\",\"Repair the repetition: 'The ranger opened the gate. The ranger checked the latch.'\",\"'The ranger opened the gate. She checked the latch.' The pronoun clearly refers to the ranger if that pronoun is appropriate for the character; 'they' can also work.\",\"Too many pronouns can create confusion when two possible people are nearby.\",\"Revise a six-sentence paragraph with repeated character names. Use pronouns selectively, then explain two references and rewrite one ambiguous sentence so its meaning is clear.\"]]")

def build():
    db=reconstruct()
    try:
        for suffix,name,code,rule,model,attempt,feedback,trap,task in LESSONS:
            seed='s2-eng-y3-'+suffix
            row=db.execute('SELECT * FROM lessons WHERE seed_key=?',(seed,)).fetchone()
            if row is None: raise ValueError('Curriculum record not found: '+seed)
            base=baseline_data(row)
            # Preserve the curriculum identity and positioning from D1 rather than inventing records.
            lesson={k:base[k] for k in ('seed_key','stage','learning_area','year_level','week','lesson_number') if k in base}
            lesson.update(title=base['title'],outcome_codes=[code],review_status='unreviewed',
                child_mission=rule,learning_intention=rule,
                success_criteria=['Explain the concept using a real example',
                    'Apply the skill to a new question','Explain a choice using specific evidence',
                    'Review and improve the independent response'],
                materials=['Paper or typed response','Pencil or keyboard'],duration_minutes=55)
            stages=[
              ('Understand the new idea',rule,model,attempt,feedback,trap),
              ('Find evidence in the example',
                 'Identify the exact words or observable details that make the example effective; explain their role rather than merely repeating the answer.',
                 model+' Notice the decision the writer makes and what the reader can now understand.',
                 'Quote or name one precise detail from the model and explain why it matters to the skill.',
                 'The most useful evidence is a specific choice in the example, followed by an explanation of the effect on meaning.',
                 'An unsupported claim about what the example says cannot replace textual evidence.'),
              ('Improve an imperfect attempt',
                 'Compare the original with a meaningful revision. A correction must address the stated purpose and avoid introducing unsupported information.',
                 'I revisit the model, identify which choice communicates the target meaning and explain the change in my own words. '+feedback,
                 'Rewrite the practice response once, changing a specific word, structure or explanation.',
                 'Check the revision by asking whether the target skill is more accurate, clear and appropriate to the audience.',
                 'Simply adding more words does not guarantee improvement. '+trap),
              ('Transfer and explain',
                 'Apply the same method to a fresh situation. State your choice, show the evidence and explain the reasoning.',
                 'I choose a new topic rather than copying the model. I check the same principle: '+rule,
                 'Invent an unrelated example of this skill and explain how you checked it.',
                 'A strong answer demonstrates the original skill with new content and explains the specific choices made.',
                 'A copied example cannot establish independent understanding.')
            ]
            lesson['teach_steps']=[]
            evidence=[]
            for i,(title,idea,model_i,attempt_i,feedback_i,trap_i) in enumerate(stages):
                why='This skill helps a Year 3 reader or writer communicate meaning accurately, make deliberate choices and notice when a first attempt needs improvement.'
                explain=(idea+'\n\n'+why+'\n\nRead the worked text carefully and ask what it tells a reader. '
                  'Look for a specific word, action or organising choice that supports the intended meaning. '
                  'Before reading the correction, try the new prompt. Compare your attempt with the model, '
                  'say what is similar and what you would revise, and explain why your revision works.')
                lesson['teach_steps'].append(dict(title=title,icon='📚',explain=explain,
                  example='WATCH\n'+model_i+'\n\nTRY\n'+attempt_i+'\n\nCOMPARE\n'+feedback_i,
                  notice='COMMON TRAP: '+trap_i+' Recheck the purpose and correct your response.',
                  check=dict(question='What did the worked example show you in this stage?',
                    options=[idea,'The details are irrelevant.','Copying without comprehension is best.','An unsupported invented claim is enough.'],
                    correct_index=0,explanation=idea+' The other options ignore the need to understand and explain specific examples.')))
                evidence.append(dict(rule=idea,why=why,model=model_i,misconception=trap_i,
                   fix='Recheck the purpose and correct your response.',guided_attempt=attempt_i,feedback=feedback_i))
            lesson['worked_example']='I DO: '+model+'\n\nExplain which words or details prove this choice is effective.'
            lesson['guided_practice']='WE DO: '+attempt+'\n\nCOMPARE: '+feedback+'\n\nWHY IT MATTERS: '+rule
            lesson['independent_task']='YOU DO: '+task+'\n\nExplain one decision, identify a mistake you checked for, and save your original work.'
            lesson['response_prompt']='Complete the original task and explain how you checked it.'
            # Written checks target the distinct subject matter rather than reusing identical multiple-choice assessments.
            checks=[
              ('Which statement describes the main language skill?',[rule,'Write without checking meaning.','Add unrelated facts.','Copy someone else\'s example.'],0,rule),
              ('What is the best reason to revise the response?',[feedback,'The response should always be longer.','The first guess must never change.','Examples have no connection to meaning.'],0,feedback),
              ('Which issue is a relevant mistake to avoid?',[trap,'There is no need to read the task.','Only decorative details matter.','A copied answer is always more accurate.'],0,trap),
              ('Which teaching model supports today\'s idea?',[model,'Unrelated events prove every conclusion.','Meaning does not depend on words.','A text should never be revised.'],0,model)
            ]
            # Four distinct scenario-based written checks complement the concept checks.
            for i,(_,_,mi,ai,fi,_) in enumerate(stages):
                checks.append((f'Consider this example and practice prompt: {ai}',
                   [fi,'Make a claim without using the example.','Repeat an unrelated sentence.','Skip the prompt entirely.'],0,fi))
            lesson['quiz']=[dict(type='multiple_choice',question=q,options=o,correct_index=k,
                explanation=e+' A supported response must match the actual language example and intended skill.') for q,o,k,e in checks]
            lesson['quiz']+=[
              dict(type='short_answer',question='Explain one choice in your independent task that shows the lesson skill.',
                   sample_answer=model,marking_guide='Require a relevant original example and correct explanation; the model is guidance, not the only accepted answer.',
                   explanation='A meaningful explanation identifies how a specific writing or reading choice achieves the target purpose.'),
              dict(type='short_answer',question='Describe a likely mistake with this skill and show how to correct it using a new example.',
                   sample_answer=trap+' A useful model of the correct skill is: '+feedback,
                   marking_guide='Must identify a real misconception, show a genuinely corrected example and justify the change.',
                   explanation='Learners demonstrate understanding by identifying and repairing a specific error rather than just reciting a rule.')
            ]
            lesson['stage_hints']={
              'accept':['Read the lesson title and describe its purpose.','Identify a model of the target skill.','Your mission: '+rule],
              'teach0':['Read the new concept in full.','Find the example showing the target skill.','Teaching idea: '+rule],
              'teach1':['Look for evidence in the model.','Point to the exact words or actions.','This example demonstrates it: '+model],
              'teach2':['Think about what was unclear before.','Change a specific choice and explain why.','Feedback: '+feedback],
              'teach3':['Try a different example of the same skill.','Apply the rule without copying the worked text.','Check your decision against: '+rule],
              'learn':['Start with the worked example.','Say which particular detail makes it useful.','Example: '+model],
              'guided':['Attempt the practice before comparing.','Notice what the feedback changes or explains.','Practice correction: '+feedback],
              'write':['Follow the original independent task.','Include an explanation and a revision.','Your task: '+task[:170]],
              'quiz':['Read the exact question.','Eliminate choices that ignore the example.','Remember: '+trap],
              'submit':['Check all written answers are included.','Read back for accuracy and clarity.','Look for evidence of the lesson goal: '+rule]
            }
            lesson['parent_notes']='Parent-only answer guide: '+feedback+' Common misunderstanding: '+trap+' Independent task assessment: '+task+' Check for original evidence and reasoning, not just length.'
            lesson['evidence_instructions']='Preserve the original independent response, the revised version and the written checks; use oral evidence where appropriate.'
            lesson['offline_alternative']='Complete examples and independent work on paper; read aloud and keep the page as learning evidence.'
            lesson['extension']='Create a second example with a different audience or context and justify what changed.'
            # Phase 1 has no moving parts. Static concept visuals will be authored
            # alongside individual editorial checks; no media gate is falsely passed.
            lesson['worked_visuals']=[]
            bundle=dict(architecture='d1-worker',lesson=lesson,
              curriculum=[dict(code=code,source='https://curriculum.nsw.edu.au/learning-areas/english/english-k-10-2022/outcomes',
                verification_status='pending',lesson_evidence=rule,
                scope_limit='Proposed alignment only; reconcile the original Coming Soon content mapping before educational sign-off.')],
              requirements=dict(teaching=evidence,practice=dict(model_inputs=[model],
                 guided_inputs=[attempt],independent_inputs=[task]),visuals=[],
                 review_questions=['Check NESA content point, age-appropriate model, and assessment response.',
                   'Improve distinct concept-specific quiz distractors and add two useful static visuals.',
                   'Verify no parent answers in child API and no moving features in Phase 1.']))
            out=ROOT/'lesson-pipeline/authored'/f'{seed}.json'
            atomic_json(out,bundle)
            print('Written content candidate:',out)
    finally:
        db.close()

if __name__=='__main__': build()
