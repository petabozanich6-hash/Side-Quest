#!/usr/bin/env python3
"""Year 3 PDHPE Written Core batch 06: gymnastics and dance, sleep and rest w31-l1 through w36-l2 (12)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

MSP, IHW, SMI = 'PH2-MSP-01', 'PH2-IHW-01', 'PH2-SMI-01'

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, subject='pdhpe', vocab=vocab,
                principle=principle, model=model, guided=guided, feedback=feedback,
                misconception=misconception, independent=independent)

LESSONS = [
L('s2-pdhpe-y3-w31-l1', MSP, ['balance', 'base of support', 'weight transfer', 'a still spot'],
  "Balance is controlling the body's position over its base of support. A wide base (feet apart, more body parts touching the floor), a low centre of mass, tight tummy muscles and eyes fixed on a still spot all help balance. Weight transfer is moving body weight from one body part to another, such as from both feet to one foot. Use a mat or soft grass in a clear space, hold balances only as long as feels comfortable and stop if anything hurts.",
  "Example: Rosa holds a one-foot balance for 5 seconds. Cues: wide base first (feet apart), eyes on a spot on the wall, tight tummy, arms out. To make it harder she lifts one foot and keeps her arms wide. Weight transfer: rock from both feet to the right foot, hold, then back, slowly.",
  "Tariq wobbles when he lifts one foot and looks at his feet. Write two cues to help him balance and say why they work.",
  "Cues: 'eyes on a still spot' and 'tight tummy, arms out'. A still point helps the brain steady the body, and tight muscles and wide arms stop the body swaying.",
  "Thinking balance is only about strong legs. Balance uses the eyes, the tummy muscles and a good base of support.",
  "On a mat or soft grass, practise four balances: two feet, one foot, a three-point balance (two feet and one hand) and a stork stand. Hold each for 5 seconds, record how long you held each and choose one cue to improve. Give an easier option for each, such as holding a wall."),
L('s2-pdhpe-y3-w31-l2', MSP, ['body parts', 'level and shape', 'a still hold', 'a smooth exit'],
  "We can balance on different body parts, at different levels and in different shapes, such as wide, narrow, curled or stretched. Changing the base of support, the shape and the level makes a balance easier or harder. The aim is to hold a balance still for 3 to 5 seconds and then move out of it smoothly. Partners can make matching or contrasting balances while standing apart, without leaning on each other.",
  "Example: Kim makes a 'low and wide' balance (on hands and feet), then changes to a 'high and narrow' balance (tiptoe, arms up). She holds each for 5 seconds. The narrow balance wobbles more because the base is smaller. Partner task: one partner makes a wide balance and the other makes a narrow one.",
  "Which balance is easier to hold: standing on both feet, or standing on tiptoe on one foot? Give a reason using the words 'base of support'.",
  "Standing on both feet is easier because the base of support is bigger. One foot on tiptoe has a very small base, so tiny movements make you wobble.",
  "Believing a balance is only good if it is hard. A good balance is still, controlled and safe at a level that suits you.",
  "Create six different balances using different body parts, levels and shapes, and draw each with a label. Hold each for 5 seconds, order them from easiest to hardest and say why using 'base of support'."),
L('s2-pdhpe-y3-w32-l1', MSP, ['log roll', 'egg roll', 'soft landing', 'low jumps'],
  "Safe rolling starts with simple, low-risk rolls on a mat, such as a log roll (body straight, rolling sideways) and an egg roll (curled up and rocking). Tuck rolls and forward rolls are taught by a teacher or coach with mats and supervision. For safe jumping and landing, bend the knees, land on the balls of the feet, keep feet about shoulder-width apart, arms forward and chest up. Never jump from high places. Stop if you feel pain or dizziness or someone is in the way.",
  "Example on a mat. Log roll: lie straight with arms overhead and roll sideways, keeping the body in a line. Egg roll: curl into a ball and rock gently from side to side. Jump and land: bend the knees, jump up, land on the balls of the feet with knees bent and arms forward, then hold for 2 seconds. Safety: a clear space, a mat and an adult nearby.",
  "A child jumps off a high step and lands with straight legs. Write what the problem is and a safer way.",
  "Straight legs and a high drop send a lot of force into the joints. Jump only from a low, flat place, bend the knees on landing and land on the balls of the feet with arms forward.",
  "Thinking a big jump from a high place is better. A good landing is soft and controlled, and height increases risk.",
  "On a mat or soft grass with an adult nearby, practise a log roll, an egg roll and five low jumps with soft landings. Record a technique score from 1 to 3 for each (shape, control, landing). Use cue words and stop if anything hurts."),
L('s2-pdhpe-y3-w32-l2', MSP, ['a sequence', 'a link', 'a held finish', 'an easier option'],
  "A gymnastics sequence is a series of movements joined together with smooth links. A good sequence has a clear start shape, a middle (a balance, a roll or a jump) and a held finish pose. Changing level, speed and direction makes it interesting. Perform it on a mat with controlled movements and practise until it feels smooth. Offer easier options, such as walking instead of jumping.",
  "Example four-part sequence. 1 Start: tall stretch, hold 2 seconds. 2 Balance: stork stand on one foot for 3 seconds. 3 Travel: two low jumps with soft landings. 4 Finish: egg roll, then rise to a tall pose. Links: slow and smooth. Marking: start shape, balance, landing and finish all held.",
  "Add a link and a finish to this sequence: a balance on one foot, then a low jump. Describe each.",
  "Link: step smoothly from the balance into the jump with bent knees. Finish: land softly and hold a tall pose for 2 seconds. A clear finish shows control.",
  "Thinking a sequence is just a list of tricks. Smooth links and held shapes make a sequence.",
  "Compose a four-part gymnastics sequence with a start, a balance, a travel and a finish. Write cue words for each, practise five times, record a control score from 1 to 3 for each part and perform it for family. Give an easier option for each part."),
L('s2-pdhpe-y3-w33-l1', MSP, ['the beat', 'tempo', 'counting beats', 'moving in time'],
  "The beat is the steady pulse in music, like a heartbeat. We can find the beat by clapping, tapping or stepping along. Tempo is how fast or slow the beat is. Moving to a beat means stepping, clapping or moving in time with it. Counting 1, 2, 3, 4 helps. Dance in a clear space, listen carefully and move safely around others.",
  "Example: listen to a song and find the beat by clapping on every beat: 1 2 3 4. Then step to the beat: step, step, step, step. Change the tempo: with a slower song take slow steps, with a faster song take quick steps. Kofi counts '1, 2, 3, 4' out loud and moves his arms on count 4.",
  "A song has 4 beats in each group. Describe a simple movement pattern that uses all four beats and changes on beat 4.",
  "Pattern: step, step, step, clap on beat 4. Counting aloud helps keep time. Changing on beat 4 marks the end of each group.",
  "Thinking the beat is the words of the song. The beat is the steady pulse underneath, which stays the same while the words change.",
  "Choose two songs with different tempos. Clap the beat of each, count the beats in a group and make a four-beat movement pattern for each. Record how the pattern changes with tempo and teach one to a family member."),
L('s2-pdhpe-y3-w33-l2', MSP, ['rhythm', 'slow and quick', 'dance steps', 'a pattern'],
  "Rhythm is a pattern of long and short sounds or movements over the beat. We can show rhythm with claps, steps or dance moves, such as slow, slow, quick-quick. Dance steps such as step-touch, marching and skipping can be combined into patterns. Keep time with the beat, repeat patterns so they become smooth and leave space between dancers.",
  "Example: a rhythm pattern 'slow, slow, quick-quick, slow' using steps. Slow step right, slow step left, quick-quick step-touch, slow step back. Repeat the pattern four times over a steady beat. Meg says the rhythm words aloud to help her feet.",
  "Write a rhythm pattern using the words 'slow' and 'quick' and say what step you would use for each.",
  "Sample: 'quick-quick, slow, slow': two quick steps on the spot, then two big slow steps forward. A rhythm pattern uses long and short movements over a steady beat.",
  "Thinking beat and rhythm are the same. The beat is steady; the rhythm is the pattern of long and short sounds that happens on top of it.",
  "Create a rhythm pattern with at least four steps using slow and quick words and write it as a chart. Perform it over a steady beat five times, then change one step. Record which version flowed better and why."),
L('s2-pdhpe-y3-w34-l1', MSP, ['a theme', 'beginning, middle and end', 'levels and speed', 'linking movements'],
  "A movement sequence has a clear beginning, middle and end. Ideas can come from a theme such as weather, animals or machines. Choose movements, link them smoothly and use levels (high, middle, low), speed (fast, slow) and direction (forwards, backwards, sideways). Practise so the sequence can be repeated. Use a clear space and never push or pull others.",
  "Example theme 'Thunderstorm'. Beginning: stand still and curl up small (the calm before). Middle: shake hands high like rain, fast steps for wind, then a big jump for thunder with a soft landing. End: slowly drift to the floor and be still. The dancer uses levels (high, low) and speeds (fast, slow).",
  "Choose a theme (such as 'Robot') and write a beginning, middle and end that uses one level change and one speed change.",
  "Sample: Beginning: stand still with arms by your sides. Middle: stiff, fast arm movements at a high level, then slow marching at a low level. End: power down by slowly crouching. The sequence includes level and speed changes.",
  "Believing a sequence needs lots of complicated movements. A few clear, well-linked movements are better.",
  "Create a sequence of 6 to 8 movements on your own theme with a clear beginning, middle and end. Write the movements, levels, speeds and directions in a chart. Practise five times and perform it for family, then ask for two stars and a wish."),
L('s2-pdhpe-y3-w34-l2', MSP, ['a group dance', 'unison and canon', 'a formation', 'sharing ideas fairly'],
  "A group dance joins individual ideas into one piece. Groups choose a theme, share ideas fairly and use formations such as lines, circles and scattered shapes. Dancers can move in unison (together), in canon (one after another) or mirror each other. To compose, try ideas, keep what works and rehearse. Everyone's ideas count, and each dancer has a role.",
  "Example: a group of four composes 'Waves'. Each dancer offers one movement. Formation: a line. Unison: all rise on tiptoe and sink down. Canon: dancers do 'wave arms' one after another. Mirroring: partners face each other. Roles: the leader of each section changes.",
  "A group disagrees about which movements to use. Write two fair ways to decide and one way to include everyone's ideas.",
  "Ways: take turns to choose a section, or vote and use the idea with the most votes first, then use another idea in the next section. Include everyone by giving each dancer one movement to teach the group.",
  "Believing the group dance belongs to the most confident dancer. Group dances work when everyone's ideas and abilities are used.",
  "Compose a 30-second group dance for 3 or more people with a theme, a formation, a unison section, a canon section and a mirror section. Write the plan, rehearse and record how decisions were shared. Give a seated or smaller-movement option for each section."),
L('s2-pdhpe-y3-w35-l1', MSP, ['performing', 'an audience', 'a held pose', 'kind feedback'],
  "Sharing movement work means performing for an audience and responding respectfully. Performers prepare, begin with a still shape, move with focus and finish with a held pose. Audience members watch quietly, clap kindly and give feedback as two stars and a wish. Performers may choose not to be watched closely: they can perform for one person or share their plan instead.",
  "Example: Lola performs her sequence for her family. She starts with a still pose, counts to herself, performs and holds the finish for 3 seconds. Feedback. Star: smooth links. Star: big, clear shapes. Wish: look at the audience more. She writes one change to make next time.",
  "Write one star and one wish for a dancer who moved smoothly but looked at the floor the whole time.",
  "Star: smooth, controlled movements. Wish: lift your head and look at the audience. Feedback names a specific strength and one idea to improve.",
  "Believing audience feedback means judging the dancer. Feedback helps performers improve and should always be kind and specific.",
  "Rehearse and share your sequence or dance with an audience. Record two stars and a wish, make one change and perform again. Write a short reflection on how you felt before and after, and what helped."),
L('s2-pdhpe-y3-w35-l2', MSP, ['a showcase', 'cue words', 'evidence of improvement', 'a goal'],
  "A gymnastics and dance showcase brings together balance, safe rolling and landing, sequences, beat and rhythm, and composing. Show a short performance and describe the cue words and choices you used. Reflect on your improvement with evidence and set a goal. Audience members give two stars and a wish.",
  "Example: Ravi shows a four-part gymnastics sequence and a 16-beat dance. He says, 'I held my balance for 5 seconds because I looked at a still spot. My dance follows the beat and uses slow and quick steps.' Evidence: his balance time went from 3 to 5 seconds. Goal: add a mirror section.",
  "Write two sentences about your improvement in movement, using one piece of evidence.",
  "Sample: 'My balance improved because I looked at a still spot. I held it for 5 seconds instead of 3.' Evidence is a number or a clear observation.",
  "Thinking a showcase is about being perfect. It is about showing what you know and how you have improved.",
  "Present a showcase of your best gymnastics sequence and dance with cue words, evidence of improvement and one goal. Share it with family, collect two stars and a wish and write one change."),
L('s2-pdhpe-y3-w36-l1', IHW, ['sleep', 'rest', 'a bedtime routine', 'hours of sleep'],
  "Sleep gives the body and brain time to repair, grow and learn. The Australian 24-Hour Movement Guidelines recommend about 9 to 11 hours of good-quality sleep for children aged 5 to 13. Good sleep habits include a regular bedtime and wake-up time, a calm routine, a dark, quiet room and no screens for the hour before bed. Not enough sleep can make us grumpy, forgetful and tired.",
  "Example: Amir's routine. Dinner at 6:00, bath at 7:00, quiet reading at 7:30, lights out at 8:00 pm, wake-up at 6:30 am. Total sleep: 10.5 hours. No tablet after 7:00. In the morning he feels alert and ready to learn.",
  "Maya goes to bed at 9:30 pm and wakes at 6:30 am. How many hours of sleep is that, and is it within 9 to 11 hours?",
  "9:30 pm to 6:30 am is 9 hours. That is within 9 to 11 hours, at the lower end. A slightly earlier bedtime might help if she feels tired.",
  "Thinking you can catch up on lost sleep whenever you like. Regular sleep each night works best for growth, mood and learning.",
  "Plan a bedtime routine with times from dinner to wake-up. Calculate the total sleep hours and compare with 9 to 11 hours. Add three calming activities and one reason for no screens before bed. Keep a sleep diary for three nights."),
L('s2-pdhpe-y3-w36-l2', SMI, ['relaxation', 'mindfulness', 'a body scan', 'a calm rating'],
  "Relaxation helps the body and mind slow down. Mindfulness means paying attention to the present moment on purpose, such as noticing your breathing, sounds or how your body feels. Simple activities include a body scan (relaxing one part at a time), mindful listening (hearing as many sounds as you can) and mindful walking. These can help us feel calm and focused. If an activity feels uncomfortable, you can stop or open your eyes.",
  "Example 'Five senses stop': stop and notice five things you can see, four you can touch, three you can hear, two you can smell and one you can taste. After one minute, Jo rates her calm from 1 (not calm) to 5 (very calm): 2 before and 4 after. Body scan: tighten and release toes, legs, tummy, hands and face.",
  "Write the steps of a one-minute mindful listening activity and when it could help.",
  "Steps: sit quietly, close or soften your eyes, listen for sounds near and far for one minute, then name them. It can help before a test or after a busy playtime.",
  "Thinking mindfulness means emptying your mind. It means noticing what is happening and gently bringing attention back.",
  "Do three relaxation or mindfulness activities (a body scan, mindful listening, five senses stop) over the week. Record your calm rating before and after each and which you prefer. Teach one to a family member."),
]

VISUALS = {
 's2-pdhpe-y3-w31-l1': [pair_visual('Wide base','feet apart, still spot','Small base','one foot, eyes down','Wide and small bases.','A wider base steadies you.'),
  pair_visual('Cues','tight tummy, arms out','Time','hold for 5 seconds','Balance cues and holding time.','Hold still and breathe.')],
 's2-pdhpe-y3-w31-l2': [pair_visual('Low and wide','hands and feet','High and narrow','tiptoe, arms up','Low and high balances.','Change level and shape.'),
  pair_visual('Easy','two feet','Hard','tiptoe on one foot','Easier and harder balances.','A smaller base wobbles more.')],
 's2-pdhpe-y3-w32-l1': [pair_visual('Log roll','body straight, sideways','Egg roll','curled up, rock','Two safe mat rolls.','Start with low-risk rolls.'),
  pair_visual('Soft landing','bent knees, arms forward','Hard landing','straight legs','Soft and hard landings.','Bend the knees.')],
 's2-pdhpe-y3-w32-l2': [pair_visual('Four parts','start, balance, travel, finish','Link','smooth step between parts','A four-part sequence.','Link each part.'),
  pair_visual('Held finish','tall pose for 2 seconds','Easier','walk, not jump','Finish and easier option.','Hold the finish.')],
 's2-pdhpe-y3-w33-l1': [pair_visual('Beat','1 2 3 4 steady pulse','Tempo','fast or slow beat','Beat and tempo.','The beat stays steady.'),
  pair_visual('Pattern','step, step, step, clap','Count','say 1 2 3 4 aloud','A four-beat pattern.','Count aloud.')],
 's2-pdhpe-y3-w33-l2': [pair_visual('Rhythm','slow, slow, quick-quick','Beat','steady underneath','Rhythm over a beat.','Rhythm sits on the beat.'),
  pair_visual('Steps','step-touch, march, skip','Space','leave room between dancers','Dance steps and space.','Keep a safe gap.')],
 's2-pdhpe-y3-w34-l1': [pair_visual('Theme','Thunderstorm','Parts','begin, middle, end','A themed sequence.','Three clear parts.'),
  pair_visual('Level','high, middle, low','Speed','fast, slow','Levels and speeds.','Vary level and speed.')],
 's2-pdhpe-y3-w34-l2': [pair_visual('Unison','all together','Canon','one after another','Unison and canon.','Same move, different time.'),
  pair_visual('Share','each dancer offers one move','Vote','take turns to choose','Sharing ideas fairly.','Every idea counts.')],
 's2-pdhpe-y3-w35-l1': [pair_visual('Start','still pose','Finish','held pose, 3 seconds','Start and finish a performance.','Begin and end still.'),
  pair_visual('Star','smooth links','Wish','look at the audience','A star and a wish.','Be kind and specific.')],
 's2-pdhpe-y3-w35-l2': [pair_visual('Cue words','still spot, tight tummy','Evidence','3 seconds up to 5','Cues and evidence.','Show a number.'),
  pair_visual('Goal','add a mirror section','Share','family audience','A goal and sharing.','Set a next goal.')],
 's2-pdhpe-y3-w36-l1': [pair_visual('Routine','dinner, bath, read, lights out','Hours','8:00 pm to 6:30 am','A bedtime routine.','Same time each night.'),
  pair_visual('Goal','9 to 11 hours','Screens','off one hour before bed','Sleep hours and screens.','Calm down before bed.')],
 's2-pdhpe-y3-w36-l2': [pair_visual('Body scan','toes, legs, tummy, hands','Listening','sounds near and far','Two calming activities.','Slow down your body.'),
  pair_visual('Before','calm 2 of 5','After','calm 4 of 5','A calm rating.','Rate your calm.')],
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
            bundle = build_from_spec(base, u, VISUALS[u['seed_key']], subject='pdhpe')
            atomic_json(ROOT / 'lesson-pipeline/authored' / f"{u['seed_key']}.json", bundle)
            print('Written Core pdhpe bundle:', u['seed_key'])
    finally:
        db.close()

if __name__ == '__main__':
    create()
