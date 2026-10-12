#!/usr/bin/env python3
"""Individually authored Written Core for existing Year 3 English Week 1 Lesson 2.

No animations or moving components: Stage 2/4 written content is Phase 1.
Writes a reviewable D1 JSON bundle; never touches remote D1 or live lessons.
"""
from pathlib import Path
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from episode_support import room_episode

SEED = 's2-eng-y3-w01-l2'

def mc(q, opts, ix, reason):
    return dict(type='multiple_choice', question=q, options=opts, correct_index=ix, explanation=reason)

def build():
    db = reconstruct()
    try:
        row = db.execute('SELECT * FROM lessons WHERE seed_key=?', (SEED,)).fetchone()
        if row is None:
            raise RuntimeError('Existing curriculum record missing')
        base = baseline_data(row)
    finally:
        db.close()
    l = {k: v for k,v in base.items() if k in ('seed_key','stage','learning_area','year_level',
         'week','week_in_unit','lesson_number','lesson_role','subject','unit_title','unit_number')}
    l.update(title=base['title'], child_mission='Build clear, complete sentences that tell a reader who did what, and improve them with precise details.',
        learning_intention='Learn to recognise a complete thought, organise the subject and verb, and improve sentence meaning without making it confusing.',
        success_criteria=['I can tell a complete sentence from a fragment.','I can identify who or what a sentence is about and what happens.',
          'I can revise a sentence by choosing details that help a reader.','I can explain how punctuation and word order affect meaning.'],
        duration_minutes=55, materials=['Paper or the typing area','Pencil for optional handwritten draft'],
        outcome_codes=['EN2-CWT-01'], source_note='Proposed Stage 2 composing-written-text alignment; confirm the specific NESA content points against the original Coming Soon mapping before approval.',
        review_status='unreviewed', **{'pass':1,'pass_mark':0.9})
    steps=[]; teaching=[]
    def step(title, rule, why, explanation, model, mistake, fix, prompt, feedback, check):
        teaching.append(dict(rule=rule,why=why,model=model,misconception=mistake,fix=fix,guided_attempt=prompt,feedback=feedback))
        steps.append(dict(title=title,icon='✏️',
            explain=rule+'\n\n'+why+'\n\n'+explanation,
            example='WATCH MY THINKING\n'+model+'\n\nYOUR SMALL TRY\n'+prompt+'\n\nCOMPARE AFTER TRYING\n'+feedback,
            notice=mistake+' '+fix,check=check))
    step('A sentence tells a complete thought',
      'A complete sentence tells the reader something that makes sense on its own.',
      'A reader should not have to guess what action happened or who the sentence refers to.',
      'Compare "The noisy cockatoo" with "The noisy cockatoo landed on the fence." The first gives us a subject but stops before saying what happened. It sounds as if someone is waiting for the rest. The second supplies an action and can stand alone. A sentence can be short: "Rain fell." It does not need several describing words. Say it aloud and ask whether it makes a complete thought.',
      'I read "Across the muddy oval." I can imagine a place, but I still do not know what happened there. I add a subject and action: "Mia raced across the muddy oval." Now the reader knows who acted and what Mia did.',
      'A common mistake is treating every capitalised group of words as a complete sentence.',
      'Read for meaning and supply a missing action or subject before you worry about its length.',
      'Improve "Behind the old shed." into a complete sentence with a named character and action.',
      'One possible sentence is "A blue lizard hid behind the old shed." Other complete thoughts also work when the subject and action are clear.',
      mc('Which group expresses a complete thought?',['Beside the library.','The shiny bicycle.','After the bell rang.','The students entered the library.'],3,
        'The students entered the library names who acted and what happened. The other options leave a reader waiting for information.'))
    step('Find the subject and what it does',
      'In a simple statement, the subject identifies who or what; the verb explains an action or a state.',
      'Recognising these parts makes it easier to find missing meaning and repair awkward word order.',
      'In "The tiny crab scuttled under a rock", "the tiny crab" is who the sentence is about, while "scuttled" tells its action. Some verbs describe states, such as "is", "seems" or "belongs". A sentence can have more than one word in its subject. Ask two questions: Who or what? What happened or is true? Do not decide that the longest word must be the verb.',
      'For "Our neighbour planted sunflowers", I underline "our neighbour" as the subject and "planted" as the verb. I check that "planted" really tells what the neighbour did; "sunflowers" tells what was planted.',
      'A common mistake is calling a describing word, such as "neighbour", the action.',
      'Look for what someone actually does, then check the sentence by asking who carried it out.',
      'In "Two magpies guarded the nest", identify the subject and the verb before comparing.',
      'The subject is "Two magpies"; the action verb is "guarded". "Nest" is what they guarded, not what performed the action.',
      mc('What is the action verb in "The wet puppy shook its fur"?',['puppy','wet','shook','fur'],2,
        '"Shook" describes what the puppy did. "Wet" describes the puppy, while "fur" names a thing.'))
    step('Add details that help rather than crowd',
      'Choose a specific verb or a useful describing detail to make a clear sentence more informative.',
      'Specific details help the reader imagine exactly what is happening without turning one sentence into a confusing list.',
      'Start with "The bird moved." That is complete but vague. "The kookaburra swooped towards the branch" gives a particular animal and action. Adding "quickly, suddenly, rapidly" all together repeats the same idea rather than sharpening it. A good revision changes one piece at a time and then tests whether the complete sentence remains easy to read. Not every sentence needs an adjective.',
      'I change "A person went somewhere" into "The ranger hurried along the bush track." "Ranger" names the subject more precisely, "hurried" improves the verb and "along the bush track" gives a useful place.',
      'A common mistake is adding many adjectives instead of choosing one precise word.',
      'Replace a vague noun or verb first; include a describing phrase only when it helps a reader understand.',
      'Improve "The animal went away" with a specific animal and a stronger action verb.',
      '"The wallaby bounded into the scrub" is one possible answer. Notice how "bounded" tells the reader more than "went"; a shorter clear sentence is better than repeated decoration.',
      mc('Which revision is most specific and still clear?',['The thing did stuff.','The dog moved.','The terrier dashed through the gate.','The fast speedy quick dog ran fast quickly.'],2,
        '"The terrier dashed through the gate" identifies the animal, gives a precise action and adds a useful location without repetition.'))
    step('Punctuate, read back and revise',
      'A statement usually begins with a capital letter and ends with a full stop; reread it to check meaning.',
      'Punctuation and careful rereading help a reader see where a complete thought begins and ends.',
      'Look at "we spotted three dolphins they swam beside the boat". It contains two separate thoughts, but the reader is given no clear boundary. Write "We spotted three dolphins. They swam beside the boat." Check capital letters and full stops after separating the thoughts. If the ideas belong together you may join them with a suitable word, but do not use a comma alone to hold two complete sentences together. Read slowly, pause where the thought ends, and ask whether any word is missing.',
      'I review "my brother found a feather it had bright blue edges". I separate two complete thoughts: "My brother found a feather. It had bright blue edges." Each sentence has a subject and verb, and each begins and ends correctly.',
      'A common mistake is adding a full stop without checking whether the words before it make sense on their own.',
      'First locate each complete thought; then capitalise its beginning and mark its end.',
      'Rewrite "the lantern flickered we looked for fresh batteries" as two complete sentences.',
      '"The lantern flickered. We looked for fresh batteries." Both thoughts are complete, properly capitalised and separated.',
      mc('Which version separates two complete thoughts correctly?',['The cat stretched it yawned.','The cat stretched. It yawned.','The cat. Stretched it yawned.','The cat stretched, it yawned.'],1,
        'A full stop separates the two complete thoughts. Each sentence has a subject and verb and starts with a capital letter.'))
    steps[0]['visual_before']=[room_episode('Is a place phrase a complete sentence?', [
        ('pip','The words say behind the old shed. That has a capital letter. Is it finished?'),
        ('juno','Ask who did what. Behind the old shed names a place, but nothing happens yet.'),
        ('pip','I will add a subject and an action: A blue lizard hid behind the old shed.'),
        ('juno','Now a reader knows who acted and what happened. Pause here. Repair a place phrase of your own.', True),
    ])]
    l['teach_steps']=steps
    l['worked_example']=('I DO: Repair and improve "near the pond the duck". First I ask, "Who or what?" — the duck. '
      'Then I ask, "What happened?" — missing. I supply a precise verb: "The duck paddled near the pond." '
      'Now I check that the capital T begins the sentence and the full stop finishes it. '
      'I could make the location clearer: "The duck paddled through the reeds at the pond." '
      'The subject remains the duck; the action remains paddled. I stop when the detail improves meaning.')
    l['guided_practice']=('WE DO — try before comparing:\n1. Repair "At the edge of the playground." '
      'Name what is missing, then write a full thought. Compare: "Three children waited at the edge of the playground." '
      'A place alone cannot say what happened.\n2. Improve "The animal ran." by choosing a precise animal and action. '
      'Compare: "The dingo sprinted across the sand." The subject and action have become more informative.\n'
      '3. Correct "the gate creaked the wind grew stronger". Compare: "The gate creaked. The wind grew stronger." '
      'Check both capitals and both full stops. If yours differs, explain how you separated complete thoughts.')
    l['independent_task']=('YOU DO — produce four new pieces of evidence.\n1. Repair the fragment "Under the fallen gum tree." '
      'Include a subject, a verb and punctuation. Explain what was missing.\n'
      '2. Write one simple complete sentence about an object in your home, then replace one vague noun or verb '
      'with a precise word. Explain the change.\n3. Identify subject and verb in "The curious echidna searched beneath the log." '
      'Then write a fresh sentence with a different subject and action.\n'
      '4. Rewrite "a storm rolled in our game stopped" into two correctly punctuated complete sentences. '
      'Explain where the first thought ends. These are your own answers, not copied models.')
    l['response_prompt']='Type four labelled independent answers. Include the original and revised sentence for task 2, and an explanation for task 4.'
    q=[
      mc('Which is a complete sentence?',['In the deep water.','The large silver fish.','The fish darted away.','Along the river bank.'],2,'The fish darted away names a subject and what it did, so it stands alone as a statement.'),
      mc('What is missing from "Before the noisy parade"?',['A longer adjective','A full action or main thought','A number','A question mark'],1,'The phrase establishes when, but it does not tell what happened during or after that time.'),
      mc('Choose the subject in "The young gardener watered roses".',['watered','roses','young','The young gardener'],3,'The young gardener names who performed the action; watered is the action word.'),
      mc('Find the action verb: "A possum climbed the fence".',['fence','A','climbed','possum'],2,'Climbed tells the action performed by the possum; the fence is where it climbed.'),
      mc('Which sentence uses a more precise verb?',['The girl went along the path.','The girl moved somewhere.','The girl hurried along the path.','The girl was there.'],2,'Hurried tells us how she moved and gives a clearer picture than the general verbs went or moved.'),
      mc('Which revision avoids unnecessary repetition?',['The bright shiny glowing lamp shone brightly.','The lantern glowed beside the tent.','The shiny bright lantern was very shiny.','The lamp lamp shone.'],1,'The lantern glowed beside the tent is specific and readable, with no repeated description of brightness.'),
      mc('Which needs a capital letter at the beginning?',['The tide rose.','Rain fell.','birds called.','The sand cooled.'],2,'A complete written statement starts with a capital letter, so birds should become Birds.'),
      mc('Which fixes "we ate lunch the bell rang" correctly?',['We ate lunch. The bell rang.','We ate lunch the. Bell rang.','we ate lunch, the bell rang.','We ate lunch the bell. Rang.'],0,'The two complete statements each need a capital letter and a full stop; the first ends after lunch.')
    ]
    q += [
      dict(type='short_answer',question='Rewrite "beside the creek the turtle" as a complete sentence, then name its subject and action verb.',
           sample_answer='The turtle rested beside the creek. Subject: the turtle. Verb: rested.',
           marking_guide='Accept any complete grammatical sentence retaining the creek context. Require correctly labelled subject and main verb plus sentence punctuation.',
           explanation='A phrase naming a location and subject still needs a verb to express a complete thought.'),
      dict(type='short_answer',question='Improve "The creature moved." into a vivid but clear sentence and explain two choices you made.',
           sample_answer='The wombat shuffled into its burrow. I named a particular animal and chose shuffled to show its movement.',
           marking_guide='Accept plausible original revisions with a clear subject, precise action and two relevant explanations. Do not award full credit for strings of repetitive adjectives.',
           explanation='Precision comes from identifying an exact noun and useful verb, not from adding many interchangeable describing words.')
    ]
    # Static, subject-specific teaching diagrams; no animation or video.
    visual1=dict(svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 660 130"><rect x="8" y="10" width="305" height="105" rx="14" fill="#fff2e8" stroke="#b87445"/><rect x="345" y="10" width="305" height="105" rx="14" fill="#e8f5ed" stroke="#297a61"/><g font-size="19" fill="#263948"><text x="24" y="44">Fragment</text><text x="24" y="83">Behind the shed.</text><text x="361" y="44">Complete thought</text><text x="361" y="83">A lizard hid behind the shed.</text></g></svg>',
      alt='Compare incomplete place phrase Behind the shed with the complete sentence A lizard hid behind the shed.',
      caption='A location alone is incomplete; the second sentence names a subject and action.')
    visual2=dict(svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 660 160"><rect x="12" y="36" width="300" height="79" rx="12" fill="#e9f2fb" stroke="#316994"/><rect x="345" y="36" width="300" height="79" rx="12" fill="#e8f5ed" stroke="#297a61"/><g font-size="19" fill="#263948"><text x="33" y="27">Subject: who or what?</text><text x="367" y="27">Verb: what happened?</text><text x="42" y="80">Two magpies</text><text x="375" y="80">guarded the nest.</text></g><path d="M311 75H343" stroke="#263948" stroke-width="3"/></svg>',
      alt='Sentence split into subject Two magpies and predicate guarded the nest with action verb guarded.',
      caption='The subject tells who or what; the verb guarded identifies the action.')
    l['worked_visuals']=[visual1, visual2]
    steps[0]['visual']=[visual1]
    steps[1]['visual']=[visual2]
    l['quiz']=q
    l['parent_notes']=('Parent: Independent examples are not a single required wording. Task 1: "A beetle hid under the fallen gum tree." '
      'It needed a subject and action. Task 2: accept a meaningful original sentence followed by a genuine precision revision. '
      'Task 3: subject "The curious echidna"; verb "searched", followed by a fresh grammatical sentence. '
      'Task 4: "A storm rolled in. Our game stopped." Capitalisation and sentence boundaries matter.\n\n'
      'Parent: Written model 1: The turtle rested beside the creek. Subject: the turtle. Verb: rested.\n\n'
      'Parent: Written model 2: The wombat shuffled into its burrow. I named a particular animal and chose shuffled to show its movement.\n\n'
      'Parent: Look for independent meaningful sentences, correct identification of subject/verb and justified revisions. '
      'Do not assess vocabulary sophistication alone; accept oral explanation recorded by the parent if writing limits demonstration. '
      'Keep sample answers out of the child role.')
    l['evidence_instructions']='Save the four independent sentences and their explanations, plus two written quiz answers. Parent may record an oral reasoning explanation where appropriate.'
    l['offline_alternative']='Read the teaching aloud together, rewrite each prompt on paper and underline subjects and verbs. Keep the page as evidence and type a brief summary later.'
    l['extension']='Write a three-sentence description of an unusual animal encounter. Use one vivid verb in each sentence, then explain why each sentence stands alone.'
    l['stage_hints']={
      'accept':['Look for complete statements in ordinary writing.','Ask what a reader knows and still needs to know.','You will repair fragments, choose precise words and punctuate clear thoughts.'],
      'teach0':['Say the words aloud and notice whether they feel unfinished.','Ask who did what before adding a full stop.','"Behind the shed" needs someone doing something, such as "A lizard hid behind the shed."'],
      'teach1':['Identify who or what the statement focuses on.','Find the verb that says what that subject does.','In "Two magpies guarded the nest", "Two magpies" is the subject and "guarded" is the verb.'],
      'teach2':['Choose one word that makes the idea more exact.','Swap a vague verb like went for an accurate action.','"The wallaby bounded into the scrub" communicates more precisely than "The animal went away."'],
      'teach3':['Read each thought slowly and listen for a natural stop.','Check every new sentence has its own subject, action, capital and full stop.','"The lantern flickered. We looked for batteries." separates two complete thoughts.'],
      'learn':['Study the unfinished duck phrase before the repair.','Notice how the writer adds the missing action before extra detail.','In the full example the duck paddles; the location can be refined later.'],
      'guided':['Try rewriting each prompt before reading the comparison.','Ask whether you are repairing a fragment, improving precision or dividing thoughts.','For the final guided prompt, the first statement ends after creaked.'],
      'write':['Use four separately numbered answers so your evidence is clear.','Show a before-and-after revision and explain your change.','For task 3 identify "The curious echidna" and the verb "searched" before inventing a new sentence.'],
      'quiz':['Find the subject and action before you pick an option.','Eliminate options that stop after a place or time phrase.','The strongest revision usually has a precise verb without repeated synonyms.'],
      'submit':['Check that all four independent tasks are present.','Read each sentence to catch missing capitals, verbs or full stops.','Make sure your two written quiz responses include both the revision and reasoning requested.']
    }
    for key in ('resources','word_challenges','sort_activity','suspense_builder','planner_fields','planner_title',
                'planner_intro','spelling','spelling_focus','hoard_words','follow_up_challenges',
                'printable_resource','interactive_activities','explicit_teaching'):
        l[key]=None
    l['coming_soon']=None
    return dict(architecture='d1-worker',lesson=l,
      curriculum=[dict(code='EN2-CWT-01',source='https://curriculum.nsw.edu.au/learning-areas/english/english-k-10-2022/outcomes',
        verification_status='pending',lesson_evidence='Compose, identify and revise grammatically complete sentences using specific subjects, precise verbs and punctuation.',
        scope_limit='One sentence construction lesson is a contribution to composition, not evidence of the complete syllabus outcome.')],
      requirements=dict(teaching=teaching,practice=dict(model_inputs=['The duck paddled','The duck paddled through'],
         guided_inputs=['Three children waited','The dingo sprinted','The gate creaked'],
         independent_inputs=['Under the fallen gum tree','object in your home','The curious echidna','a storm rolled in']),
       visuals=[dict(alt=visual1['alt'],teaches='Contrast a place fragment with a full subject-action sentence'),dict(alt=visual2['alt'],teaches='Locate the subject and action verb in a sentence')],review_questions=['Confirm actual Coming Soon NESA code and content point.',
         'Check every answer independently for grammatical accuracy.',
         'Review Year 3 vocabulary and the amount of direct instruction.',
         'Verify that child API does not expose parent answers.',
         'Ensure written progress saves across reloads.',
         'Check the assessment genuinely requires independently composed text.']))

if __name__=='__main__':
    obj=build()
    target=ROOT/'lesson-pipeline/authored'/f'{SEED}.json'
    atomic_json(target,obj)
    print('Written Core authoring bundle:',target)
