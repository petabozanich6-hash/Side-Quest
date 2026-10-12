#!/usr/bin/env python3
"""Individually written Stage 2 English Written Core, Week 1 Lesson 3.

Focus: syllable segmentation, phoneme/grapheme matching, spelling checks.
Multimedia is reserved for Phase 2. Never modifies live D1.
"""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json

SEED = 's2-eng-y3-w01-l3'

def mc(question, options, correct_index, explanation):
    return dict(type='multiple_choice', question=question, options=options,
                correct_index=correct_index, explanation=explanation)

def build():
    db = reconstruct()
    try:
        row = db.execute('SELECT * FROM lessons WHERE seed_key=?', (SEED,)).fetchone()
        if row is None:
            raise RuntimeError('Existing English lesson was not found')
        base = baseline_data(row)
    finally:
        db.close()
    l = {k:v for k,v in base.items() if k in ('seed_key','stage','year_level','week',
         'week_in_unit','lesson_number','lesson_role','subject','unit_title','unit_number','learning_area')}
    l.update(title=base['title'],
       child_mission='Hear the parts in longer words, choose letters for sounds, and check your spelling using a repeatable method.',
       learning_intention='Learn to break words into spoken syllables, identify their sounds, connect sounds with letter patterns and proofread a short sentence.',
       success_criteria=['I can clap the beats in a word and separate its syllables.',
          'I can say sounds slowly and choose a plausible letter pattern for each.',
          'I can explain a tricky spelling choice instead of guessing.',
          'I can reread and correct spelling in my own sentence.'],
       duration_minutes=55,materials=['Paper or typing space','Optional pencil for sound boxes'],
       outcome_codes=['EN2-SPELL-01'],
       source_note='Proposed Stage 2 spelling outcome. Preserve and verify the existing card mapping against current NESA content points before acceptance.',
       review_status='unreviewed',**{'pass':1,'pass_mark':0.9})
    evidence=[]; steps=[]
    def teach(title, rule, why, explanation, model, misconception, fix, attempt, feedback, check, visual=None):
        evidence.append(dict(rule=rule,why=why,model=model,misconception=misconception,
                             fix=fix,guided_attempt=attempt,feedback=feedback))
        st=dict(icon='🔤',title=title,explain=rule+'\n\n'+why+'\n\n'+explanation,
                example='WATCH MY THINKING\n'+model+'\n\nYOUR SMALL TRY\n'+attempt+'\n\nCOMPARE AFTER TRYING\n'+feedback,
                notice=misconception+' '+fix,check=check)
        if visual: st['visual']=[visual]
        steps.append(st)
    syllables=dict(
      svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 145"><rect x="12" y="33" width="172" height="71" rx="10" fill="#e4f4ed" stroke="#246e5b" stroke-width="2"/><rect x="214" y="33" width="172" height="71" rx="10" fill="#e4f4ed" stroke="#246e5b" stroke-width="2"/><rect x="416" y="33" width="172" height="71" rx="10" fill="#e4f4ed" stroke="#246e5b" stroke-width="2"/><g font-size="26" fill="#243544" text-anchor="middle"><text x="98" y="78">um</text><text x="300" y="78">brel</text><text x="502" y="78">la</text></g><text x="300" y="133" text-anchor="middle" font-size="20" fill="#243544">umbrella = um / brel / la (three spoken beats)</text></svg>',
      alt='Umbrella divided into the three spoken syllables um, brel and la in three labelled boxes.',
      caption='A syllable is one spoken beat; a syllable can contain several letters.')
    graphemes=dict(
      svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 610 150"><g stroke="#316994" stroke-width="2" fill="#eaf3fc"><rect x="16" y="24" width="180" height="70" rx="12"/><rect x="214" y="24" width="180" height="70" rx="12"/><rect x="412" y="24" width="180" height="70" rx="12"/></g><g font-size="26" text-anchor="middle" fill="#22374c"><text x="106" y="68">sh</text><text x="304" y="68">ee</text><text x="502" y="68">p</text></g><text x="305" y="126" font-size="19" text-anchor="middle" fill="#22374c">sheep: /sh/ + /ee/ + /p/</text></svg>',
      alt='Sheep split into three grapheme units sh, ee and p; some sounds require two letters.',
      caption='Two letters can work together for one sound, as sh and ee do in sheep.')
    teach('Hear syllables before you write',
      'A syllable is one spoken beat in a word; pronounce the whole word naturally and then clap its beats.',
      'Breaking a long word into manageable spoken parts makes it easier to remember and spell.',
      'Say "umbrella" normally. Then slow it down: um-brel-la. You can clap three times. The number of letters does not determine the number of beats: "elephant" has three spoken beats, el-e-phant, even though it has eight letters. Some words change slightly depending on accent; listen for the spoken vowel-centred beats in your own careful pronunciation. Writing the syllables on paper can help you keep track of the word without skipping a part.',
      'For "fantastic" I say fan-tas-tic: three beats. I write fan | tas | tic before joining fantastic. I do not clap once for every letter; I listen for natural parts.',
      'A common mistake is treating each letter as its own syllable.',
      'Speak the complete word aloud and tap its beats, then write one box per beat rather than per letter.',
      'Say "banana" slowly and list its spoken syllables before comparing.',
      'ba-na-na has three syllables. If you got six, you counted the letters instead of its beats.',
      mc('Which gives the spoken beats in "banana"?',['ban-ana','b-a-n-a-n-a','ba-na-na','bana-naa'],2,
         'Banana has three spoken syllables: ba, na and na. Counting individual letters does not show spoken beats.'),syllables)
    teach('Hear sounds inside each syllable',
      'A phoneme is a speech sound; a grapheme is the letter or letter group we use to represent it.',
      'Listening for individual sounds helps you avoid losing consonants or choosing letters merely by visual guessing.',
      'Say "sheep" slowly. You can hear /sh/, a long /ee/ vowel and /p/. It has five letters but only three sound units in this analysis, because sh and ee work as pairs. In "ship", sh still represents one sound but the vowel is short and spelled with i. Listen to the sound first, then look for the likely letters. Use a word you know with the same sound to support the spelling choice.',
      'I stretch "shop": /sh/ /o/ /p/. I write the letters sh | o | p, then read the complete word to check it says "shop". I do not split the s and h into separate sounds.',
      'A common mistake is assuming every spoken sound must be written with exactly one letter.',
      'Notice common multi-letter graphemes such as sh, ch, th, ai and ee; the sound and number of letters are not always equal.',
      'In "chat", which letters work together for its starting sound?',
      'The letters ch work together for the /ch/ sound. The rest of the word gives /a/ and /t/.',
      mc('Which two letters work together for one starting sound in "ship"?',['si','ip','sh','hi'],2,
         'The letters sh are one grapheme representing the /sh/ sound. The following i and p represent different sounds.'),graphemes)
    teach('Choose a spelling pattern, then check meaning',
      'When several letter patterns could spell a sound, compare familiar words and use meaning or a reference to choose.',
      'English uses more than one grapheme for some sounds, so sounding out is a starting strategy, not a guarantee.',
      'The long /ay/ sound appears in "rain" (ai), "day" (ay) and "cake" (a-e). A useful pattern is often ai inside a syllable and ay at the end, but English has exceptions. When you write "play", think of familiar words "day" and "stay". When you write "train", think of "rain". If a word still seems uncertain, check it in a reliable dictionary or spelling list instead of pretending there is a rule with no exceptions.',
      'To spell "paint", I hear /p/ /ay/ /n/ /t/. I remember "rain" has ai for the /ay/ sound here, so I write p-ai-n-t, then reread the whole word and check it against my known pattern.',
      'A common mistake is using a useful spelling pattern as though it has no exceptions.',
      'Treat analogies as clues, then confirm unfamiliar words with an approved word list or dictionary.',
      'Which spelling pattern completes "tr__n" when the word means a railway vehicle?',
      'The word is "train" and uses ai, like "rain". "Trayn" is a reasonable sound guess but not the conventional spelling.',
      mc('Which spelling is conventional for a vehicle travelling on rails?',['trayn','traen','train','trane'],2,
         'Train is conventionally written with ai. Comparing it with the familiar spelling rain helps remember the pattern.'))
    teach('Proofread your writing one word at a time',
      'Check your sentence by reading slowly, finding any word that looks or sounds uncertain and checking its syllables or graphemes.',
      'Proofreading can catch missed sounds and spelling errors that disappear when you read quickly for meaning.',
      'Look at "The cheld held a yelow umbrela." Read each word slowly. "Child" contains i rather than e; "yellow" has ll; "umbrella" ends with double l before a. Saying um-brel-la helps remember all three parts, but the double letter still needs visual memory or a checked reference. Finally reread the corrected whole sentence with its capital and full stop.',
      'I mark cheld, yelow and umbrela as uncertain. I check each spelling carefully and rewrite: "The child held a yellow umbrella." I compare every corrected word with the original before deciding that I am finished.',
      'A common mistake is checking only the first and last sounds of a word and overlooking middle sounds or doubled letters.',
      'Point to each sound group, reread the entire spelling and check uncertain words rather than guessing confidently.',
      'Proofread "The brite moon shone over the gardin." Identify the two uncertain spellings.',
      'The conventional spellings are "bright" and "garden". Bright has igh for its long vowel sound; garden has e rather than i in the last syllable.',
      mc('Which sentence is conventionally spelled?',['The yelow boat sailed.','The yellow boat sailed.','The yelloe boat sailed.','The yello boat sailed.'],1,
         'Yellow is spelled with double l and ow. Reading the complete word, not only the first sound, catches the mistake.'))
    l['teach_steps']=steps
    l['worked_visuals']=[syllables,graphemes]
    l['worked_example']=('I DO: Spell "sunshine" by listening and checking. First say it naturally: sun-shine (two syllables). '
        'The first part has /s/ /u/ /n/ and is written sun. The second begins with /sh/, written sh, '
        'and has a long /i/ vowel represented by i-e around the n: shine. Join sun + shine to make sunshine. '
        'Reread the whole word; check that sh stays together and the final e is not forgotten. '
        'Write "The sunshine warmed the path" as a complete sentence to check the word in context.')
    l['guided_practice']=('WE DO — try each first.\n1. Clap and segment "computer". Compare: com-pu-ter, three spoken beats. '
        'Different accents may make syllable boundaries feel slightly different, but the word is commonly three syllables.\n'
        '2. Identify graphemes in "chop". Compare: ch | o | p. The first two letters work together for /ch/.\n'
        '3. Choose the conventional spelling "play" or "plai" in "We ___ after lunch". Compare: play, '
        'with ay at the end, as in day and stay.\n4. Proofread "A sheep sleped in the feeld". '
        'Compare: "A sheep slept in the field." Check both uncertain words against familiar spellings.')
    l['independent_task']=('YOU DO — do not copy guided words.\n'
        '1. Segment "butterfly" into spoken syllables and explain how many beats you hear.\n'
        '2. Identify sound-to-letter groups in "brush"; explain why the starting br uses two sounds but final sh is one grapheme for one sound.\n'
        '3. Complete and explain the /ay/ spelling in "We waited for the r__n to stop" and in "It was a sunny d__".\n'
        '4. Proofread "The rabit hopd beside the trea". Write the complete corrected sentence, '
        'circle or list each word changed and explain how you checked one tricky spelling.')
    l['response_prompt']='Write four numbered answers, including syllable divisions, grapheme explanation, both /ay/ spellings and a corrected sentence with reasons.'
    l['quiz']=[
      mc('How many spoken syllables are commonly heard in "elephant"?',['1','2','3','8'],2,'Elephant is commonly pronounced el-e-phant, giving three spoken beats rather than one for each letter.'),
      mc('Which divides "tomato" into its common spoken beats?',['to-ma-to','tom-at-o-o','t-o-m-a-t-o','toma-toe'],0,'Tomato commonly has three syllables: to-ma-to. The boundaries are about pronunciation, not letter count.'),
      mc('Which grapheme represents the initial sound in "chair"?',['c','ch','ha','ai'],1,'The letters ch work together for the /ch/ sound at the start of chair.'),
      mc('How many sound groups are /sh/ /i/ /p/ in "ship"?',['2','3','4','5'],1,'Ship is conventionally analysed into three phonemes: /sh/, /i/ and /p/, even though it has four letters.'),
      mc('Which is the conventional spelling?',['trayne','train','trayn','traine'],1,'Train uses ai for the long /ay/ sound, as in rain, and the word ends with n.'),
      mc('Which word ends in the common ay spelling?',['pla i','plai','play','plei'],2,'Play ends with ay for the long /ay/ sound; the other options do not use its conventional spelling.'),
      mc('Which spelling correctly names the colour?',['yello','yelow','yellow','yelloe'],2,'Yellow contains double l and ends with ow. Sounding the word is helpful, but its letter pattern must also be learned.'),
      mc('Which sentence contains no obvious spelling errors?',['The rabit ran.','The rabbit ran.','The rabbet ran.','The rabet ran.'],1,'Rabbit is conventionally spelled with double b and it, so the second sentence is the correctly spelled one.') ,
      dict(type='short_answer',question='Separate "caterpillar" into commonly spoken syllables and describe how clapping helps you spell long words.',
           sample_answer='cat-er-pil-lar is commonly spoken in four beats. Clapping one beat at a time helps me avoid leaving out a part.',
           marking_guide='Accept a plausible spoken segmentation with four syllables, recognising pronunciation variation; require a clear explanation of segmentation for spelling.',
           explanation='Syllables divide a word into manageable spoken beats, though boundaries and pronunciation can vary by accent.'),
      dict(type='short_answer',question='Correct "The chiken sat on the brench" and explain the spelling of one corrected word.',
           sample_answer='The chicken sat on the branch. Chicken uses ch for the /ch/ sound; branch also has ch at the end.',
           marking_guide='Require both conventional spellings chicken and branch, and a reasonable sound-letter or spelling-pattern explanation.',
           explanation='A proofreading explanation identifies the changed letter groups, rather than supplying an unexplained replacement.')
    ]
    l['parent_notes']=('Parent only — independent answers: 1. but-ter-fly has three spoken syllables. '
       '2. brush can be heard as /b/ /r/ /u/ /sh/: br contains two consonant sounds; sh represents one sound with two letters. '
       '3. rain uses ai; day uses ay. 4. "The rabbit hopped beside the tree." '
       'Rabbit has double b, hopped has double p before ed in this spelling, and tree has ee for its long vowel sound. '
       'Written quiz: see the sample answers and marking guides, which must be removed from child-facing API responses. '
       'Observe whether the learner segments aloud, checks spelling against known patterns and can explain corrections rather than guessing.')
    l['evidence_instructions']='Collect independent word breakdowns, a corrected sentence and explanations, plus two written spelling responses. Parent may record an oral segmentation as evidence.'
    l['offline_alternative']='Use claps or taps to hear syllables, draw boxes for graphemes, and write a proofreading passage by hand. Save the paper page or describe it in the typing area.'
    l['extension']='Find four words from your current book with different long-vowel spelling patterns. Sort them, check each spelling and explain any unexpected pattern.'
    l['stage_hints']={
     'accept':['Think about hearing words in smaller parts.','Listen for beats and smaller sound units before spelling.','You will use syllables, graphemes, familiar patterns and proofreading.'],
     'teach0':['Say the whole word normally first.','Tap each spoken beat, not each letter.','Banana separates into ba-na-na, three beats.'],
     'teach1':['Look for letters that work together for a sound.','Stretch the word and identify each sound before writing.','In sheep, sh and ee are each two-letter graphemes for one sound.'],
     'teach2':['Some vowels have more than one spelling choice.','Compare your word with known examples like rain and day.','Train resembles rain and is conventionally spelled with ai.'],
     'teach3':['Read slowly and stop at uncertain words.','Check the middle of the word as well as its beginning.','Yellow needs two ls, while umbrella also needs double l.'],
     'learn':['Split the model word into natural spoken parts.','Work through sun and shine as separate chunks.','Sunshine joins sun and shine; preserve sh and the final silent e.'],
     'guided':['Try the word before reading its correction.','Mark syllables, digraphs or spelling patterns, depending on the prompt.','For chop, the first grapheme is ch, not c alone.'],
     'write':['Complete the four independent tasks in order.','Explain both the letter pattern and the reason for a correction.','For brush, /b/ and /r/ are separate sounds but final sh is one grapheme.'],
     'quiz':['Listen carefully before choosing letters.','Notice when two letters work together for a single sound.','Ship has three sounds even though its spelling has four letters.'],
     'submit':['Check every labelled response is present.','Read back each corrected word within its whole sentence.','Keep syllable separators and explanations so your parent can see your strategy.']
    }
    for key in ('resources','word_challenges','sort_activity','suspense_builder','planner_fields',
       'planner_title','planner_intro','spelling','spelling_focus','hoard_words','follow_up_challenges',
       'printable_resource','interactive_activities','explicit_teaching'):
        l[key]=None
    return dict(architecture='d1-worker',lesson=l,
      curriculum=[dict(code='EN2-SPELL-01',
          source='https://curriculum.nsw.edu.au/learning-areas/english/english-k-10-2022/outcomes',
          verification_status='pending',
          lesson_evidence='Students segment spoken multisyllabic words, match sounds and graphemes, apply common spelling patterns and proofread.',
          scope_limit='These word-level activities are partial evidence of spelling strategies; confirm original NESA mapping and content points.')],
      requirements=dict(teaching=evidence,
       practice=dict(model_inputs=['sunshine'],guided_inputs=['computer','chop','play','sheep slept'],
        independent_inputs=['butterfly','brush','rain','rabbit hopped']),
       visuals=[dict(alt=syllables['alt'],teaches='Three spoken syllables of umbrella shown in beat boxes'),
         dict(alt=graphemes['alt'],teaches='Three grapheme groups within sheep mapped to sounds')],
       review_questions=['Compare existing Coming Soon card against proposed spelling outcome.',
         'Verify pronunciations and syllable segmentation for NSW English accents.',
         'Review accuracy of all phoneme/grapheme divisions and conventional spellings.',
         'Check independent practice has fresh words distinct from examples.',
         'Verify parent answers cannot be read by child role.',
         'Check accessibility of the static word models.']))

if __name__=='__main__':
    bundle=build()
    dest=ROOT/'lesson-pipeline/authored'/f'{SEED}.json'
    atomic_json(dest,bundle)
    print('Written Core authored:',dest)
