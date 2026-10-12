#!/usr/bin/env python3
"""Year 3 PDHPE Written Core batch 01: feelings and wellbeing, movement skills w01-l1 through w06-l2 (12)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

MSP, IHW, SMI, RRS1, RRS2 = 'PH2-MSP-01', 'PH2-IHW-01', 'PH2-SMI-01', 'PH2-RRS-01', 'PH2-RRS-02'

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, subject='pdhpe', vocab=vocab,
                principle=principle, model=model, guided=guided, feedback=feedback,
                misconception=misconception, independent=independent)

LESSONS = [
L('s2-pdhpe-y3-w01-l1', IHW, ['a feeling word', 'a body clue', 'strength of feeling', 'a situation clue'],
  "Feelings are the emotions we notice in our body and thoughts, such as happy, worried, frustrated or proud. Naming a feeling precisely, and saying how strong it is from 1 to 5, helps us understand it and tell other people. Body clues (a fast heartbeat, tight shoulders, a hot face) and the situation both give clues to the feeling. All feelings are normal; what we do next is the choice.",
  "Example: Mia's team lost a game. Body clues: tight stomach and hot face. Situation clue: she really wanted to win. Feeling word: 'disappointed', strength 3 out of 5. She says, 'I feel disappointed, about a 3, because we lost.' The word 'furious' would not match her clues.",
  "Ravi hears his name called for a school award. His heart beats fast, he smiles and his hands shake a little. Choose a feeling word, give it a strength from 1 to 5, and name one body clue and one situation clue.",
  "Strong answer: 'Excited and a little nervous, about 4, because my heart beat fast and my name was called in front of everyone.' Mixed feelings are normal, and the number shows how big the feeling is.",
  "Believing there are good feelings and bad feelings, or that you must hide uncomfortable ones, makes feelings harder to understand. Every feeling gives information; only actions can be unkind or unsafe.",
  "Think of three different times this week (a happy one, a tricky one and an ordinary one). For each, write a precise feeling word, a strength from 1 to 5, one body clue and one situation clue. Share only what you are comfortable sharing."),
L('s2-pdhpe-y3-w01-l2', IHW, ['acting a feeling', 'a clue', 'empathy', 'a role play'],
  "Showing a feeling with face, body and voice helps others read it, and reading other people's feelings builds empathy. In charades and role play we use facial expression, posture and gestures, and we never touch or push anyone. After each guess, say the clues that led you to the feeling word. Choose roles you are comfortable with; anyone may pass or only describe the feeling.",
  "Example: Sam acts 'nervous' by hunching his shoulders, wringing his hands and glancing around. The guesser says 'worried?' and Sam says 'close, nervous before a performance'. Clues named: hunched shoulders and wringing hands. The situation stays kind: waiting for a turn on stage.",
  "Act out or describe 'proud' without using words. Which face, posture and gesture would a guesser see? Then name a situation that could cause it.",
  "Clues: chest lifted, head high, a wide smile, maybe a thumbs up. Situation: finishing a hard puzzle or learning to ride a bike. Naming the clues helps the guesser and shows that feelings appear in more than the face.",
  "Thinking that role play means making fun of someone's feelings. Acting a feeling is to understand it; mocking or exaggerating to get a laugh hurts people and is not charades.",
  "Play charades with a family member using six feelings (lonely, embarrassed, curious, grateful, frustrated and calm). Record the clues you used for each and one thing the guesser got right. Any player may pass."),
L('s2-pdhpe-y3-w02-l1', SMI, ['a calm-down strategy', 'a toolkit', 'a feeling number', 'a trusted person'],
  "Calm is a steady, relaxed feeling in body and mind. Different people find different things calming: a quiet place, slow breathing, gentle movement, talking to someone they trust or drawing. A calm-down toolkit lists strategies that work for you so you can choose one quickly when a feeling gets big. Strategies must be safe and must not hurt anyone or damage things.",
  "Example: Zoe makes a toolkit with four ideas: sit in the reading corner, breathe in for four and out for four, squeeze a soft cushion, and talk to her teacher. Before a spelling test she feels 4 out of 5 worried, picks breathing, and afterwards rates her worry a 2.",
  "Leo feels angry (4 out of 5) after his block tower falls down. Choose two strategies from different types (body, thinking, people or place), then say which he should use first and why.",
  "Strong answer: first breathing or stepping away for a moment (body), then asking a friend to help rebuild (people). Reason: calming the body first makes it easier to think. Strategies that hurt things or people, like throwing blocks, do not count.",
  "Believing one calming strategy works for everybody. What calms one person (loud music) may upset another, so each person tests ideas and chooses their own.",
  "Make your own calm-down toolkit with five strategies from at least three types. For each, write when you would use it and which feeling strength (1 to 5) it suits. Test two strategies over the week and record how your feeling number changed."),
L('s2-pdhpe-y3-w02-l2', SMI, ['belly breathing', 'a gentle stretch', 'slow and steady', 'stopping safely'],
  "Slow breathing and gentle stretching tell the body it is safe to relax. In belly breathing you breathe in slowly through the nose while the belly rises, then out slowly through the mouth, repeated several times. A gentle stretch is held without bouncing and stopped if anything hurts. Do these in a clear space and only at your own comfortable level; sitting versions are just as good.",
  "Example: five-finger breathing. Hold one hand up and trace it with a finger of the other hand. Breathe in slowly as you slide up a finger and out slowly as you slide down. After one hand, do three slow backwards shoulder rolls. Feeling rating before: 4 out of 5 frustrated. After: 2.",
  "A friend breathes in fast and loudly when upset. Write the steps you would tell them for belly breathing and for one safe stretch, including when to stop.",
  "Steps: sit comfortably with a hand on the belly, breathe in slowly through the nose so the belly rises, out slowly through the mouth, repeat five times. Stretch: reach up tall and hold without bouncing. Stop if it hurts or you feel dizzy, then sit and breathe normally.",
  "Thinking a stretch should hurt to work, or that breathing fast and deep is calming. Calming breaths are slow and gentle, and stretches should feel comfortable, never painful.",
  "Teach one breathing strategy and one gentle stretch to a family member. Write the steps in numbered order, record their feeling number before and after, and add one adjustment for someone who cannot do the stretch standing up."),
L('s2-pdhpe-y3-w03-l1', SMI, ['a growth mindset', 'yet', 'a strategy', 'a small goal'],
  "A growth mindset is the belief that skills grow with practice, effort, good strategies and help. Fixed-mindset thinking says 'I can't do it', while growth-mindset thinking says 'I can't do it yet'. A mistake gives information about what to change. Setting a small goal, changing the strategy and asking for feedback are ways to try again.",
  "Example: Priya cannot catch a ball yet. Fixed thought: 'I'm just bad at catching.' Growth thought: 'I can't catch yet; I'll watch the ball and use soft hands.' Goal: 3 catches out of 10 by Friday. A week later she gets 5 out of 10, so her strategy helped.",
  "Ben says, 'I'm hopeless at handwriting.' Rewrite his thought using the word 'yet', then suggest one strategy and one small goal.",
  "Reworded: 'I'm not good at neat handwriting yet.' Strategy: slow down, sit tall and practise one letter shape for five minutes each day. Goal: write one neat line by Friday. A good goal is small, specific and measurable.",
  "Believing a growth mindset just means trying harder with the same method. Effort helps most when you also change your strategy, use feedback and ask for help.",
  "Choose a skill you cannot do yet (juggling scarves, a multiplication fact or a drawing). Write a fixed thought, a growth rewrite, two strategies and a goal with a date. Practise on three days and record your progress."),
L('s2-pdhpe-y3-w03-l2', SMI, ['persisting', 'encouragement', 'changing the plan', 'a safe challenge'],
  "In challenge games a team works on a task that is hard at first, such as passing a beanbag around a circle without dropping it. Persisting together means encouraging teammates, changing the plan after a mistake and celebrating improvement. Kind encouragement names a specific effort, like 'good recovery'. Games must be safe, with soft equipment and enough space, and everyone chooses their own level.",
  "Example: a group of four keeps a beanbag moving by passing with open hands and counting passes. Round 1: 3 passes. They change the plan to 'call the name before passing' and reach 7. A teammate says, 'Nice recovery, Kai!' Their goal is to beat their own score, not other groups.",
  "A team drops the beanbag three times in a row and one player says, 'This is pointless.' Write a kind response and one change to the plan.",
  "Response: 'We got 4 passes that time, let's call names first.' Change: pass more slowly, throw softer or stand closer. Naming what improved and changing one part of the plan keeps everyone included.",
  "Thinking persisting means keeping going with an unsafe or unfair game. Persisting means working at the challenge in a safe, kind way; teams stop and change the rules if someone is unsafe or left out.",
  "Invent a challenge game for 2 to 4 players using soft equipment (rolled-up socks or a cushion). Write the goal, the safety rules, an easy and a hard version and three encouraging sentences. Play it and record the team's best score in each round."),
L('s2-pdhpe-y3-w04-l1', SMI, ['asking for help', 'a trusted helper', 'a clear request', 'an adult straight away'],
  "Asking for help is a smart, strong choice, not a weakness. Different problems need different helpers: a teacher for schoolwork, a family member for home problems, a doctor or nurse for health, and a trusted adult straight away if anyone feels unsafe. A clear help request says who you are asking, what the problem is and what kind of help you need. If the first helper cannot help, ask another.",
  "Example: Ana does not understand a maths question. Helper: her teacher. Request: 'Mr Lee, can you show me the first step of question 4? I get stuck at the division.' She names the problem and the help she needs. If Mr Lee is busy, she asks a classmate or waits and asks again.",
  "Tom's new shoes hurt his feet during sport and he feels shy about telling anyone. Who could he ask, and what would he say?",
  "He could ask the sport teacher or a trusted adult: 'My shoes are hurting my feet, can I sit out and rest?' Pain is a body signal that deserves attention. The request names who, the problem and the help.",
  "Thinking that asking for help means you have failed or will bother people. Everyone needs help sometimes, and trusted adults want to know.",
  "List six problems (schoolwork, the playground, feeling sad, a lost item, feeling unwell and something online that upset you). For each, choose a helper and write one clear help sentence. Mark which problems need an adult straight away."),
L('s2-pdhpe-y3-w04-l2', SMI, ['a role play', 'a polite opener', 'a calm voice', 'saying thanks'],
  "Role playing lets us practise asking for help before we need it. A good help request uses a calm voice, eye contact if that is comfortable, the helper's name, a short description of the problem and a thank-you. Listening to the answer and asking another question if you still do not understand is part of the skill. Role plays use made-up situations, and anyone may pass.",
  "Example script: Jade: 'Excuse me, Ms Rowe, I can't find my lunch box and I'm hungry.' Ms Rowe: 'Let's look in the classroom together.' Jade: 'Thank you.' Skills used: polite opener, name, problem, calm voice and thanks.",
  "Role play or write a three-line script in which a student cannot open a heavy door while carrying books. Ask for help and then thank the helper.",
  "Script: 'Excuse me, could you hold the door please? My arms are full.' Helper: 'Sure.' 'Thank you!' It has a polite opener, the need and thanks, and keeps the request short.",
  "Believing that waiting silently will make others guess what you need. Adults and friends cannot read minds; clear words help.",
  "Write and perform with a family member three role plays: asking for schoolwork help, finding a lost item, and telling an adult that something at the park felt unsafe. Include each part of a help request and note how your helper responded."),
L('s2-pdhpe-y3-w05-l1', IHW, ['wellbeing', 'evidence', 'a strength', 'a next step'],
  "Wellbeing is how well we are doing in body, mind and relationships. Many things influence it: sleep, food, movement, friends, feelings and time to play. Reflecting means looking back at the unit, naming strategies that worked and setting a next step. A good reflection uses evidence such as a feelings diary or toolkit results, not just 'it was good'.",
  "Example: Omar's reflection: 'My feelings diary shows I was worried 4 times, mostly before tests. Breathing helped each time. Strength: naming feelings. Next step: ask for help earlier.' His evidence is diary entries from Weeks 1 and 2.",
  "Write a reflection sentence that names one strategy from this unit, the evidence that it worked (or did not) and a next step.",
  "Sample: 'Breathing worked because my feeling dropped from a 4 to a 2 in my diary. Next I will try stretching before tests.' It names the strategy, gives evidence and sets a next step.",
  "Thinking wellbeing means feeling happy all the time. Wellbeing includes handling hard feelings well, and everyone has ups and downs.",
  "Create a one-page wellbeing reflection using your unit work (feeling words, toolkit, growth mindset goal and help list). Include three strengths, one strategy to keep using, one to improve, and a next step with a date."),
L('s2-pdhpe-y3-w05-l2', IHW, ['a showcase', 'key ideas', 'an audience', 'two stars and a wish'],
  "A unit showcase shares the most important learning with an audience in a clear, respectful way. Choose evidence that shows several ideas: naming feelings, calming strategies, growth mindset and asking for help. Present with a title, three key points and one example for each. Audience members listen kindly and give feedback as two stars (things that worked) and a wish (one idea to improve).",
  "Example: a poster called 'Handling big feelings' has four boxes: 1 name it (word and strength), 2 calm it (breathing steps), 3 try again (use 'yet'), 4 ask for help (who and what to say). The talk lasts two minutes and uses one example from the student's own diary.",
  "Plan a 30-second spoken summary of one idea from this unit. Write your first sentence and one piece of evidence.",
  "Sample: 'Today I will show how breathing helps me feel calm. My diary shows my worry went from 4 to 2 after five-finger breathing.' It starts with the main idea and gives evidence.",
  "Believing a showcase means performing everything you know. A clear showcase picks the key ideas and the best evidence instead of reading all your notes.",
  "Make a showcase (poster, booklet or talk) covering all four unit ideas, with one example each and a short list of safe helpers. Share it with a family member, collect two stars and a wish, and write one change you would make."),
L('s2-pdhpe-y3-w06-l1', MSP, ['running technique', 'jumping', 'a soft landing', 'a safe space'],
  "Running, jumping and landing are fundamental movement skills. Good running has bent arms swinging opposite to the legs, eyes forward and landing on the balls of the feet. For a safe jump, swing the arms, push off with both feet and land softly with bent knees, feet about shoulder-width apart and arms forward for balance. Warm up first, choose a clear, flat space and stop if anything hurts.",
  "Example cues. RUN: 'bend arms, pump arms, look ahead'. JUMP: 'knees bend, arms swing, push'. LAND: 'soft knees, feet apart, arms forward, hold still for two seconds'. Sasha jumps a chalk line, measures 90 cm and lands steadily with bent knees.",
  "Mei jumps over a line, lands with straight legs and falls backwards. Write two cues that would fix her landing and say why they protect her body.",
  "Cues: 'bend your knees' and 'land with feet apart and arms forward'. Bent knees absorb the force like springs, and wide feet and forward arms keep balance. Stiff, straight legs send the impact into the knees and back.",
  "Thinking the farthest jump is the best jump. A strong jump has good technique and a balanced landing; distance improves with practice.",
  "Set up a safe, clear space with a start line. Practise ten standing jumps and a short run using your own cue words. Use a recording sheet to rate your technique (arms, knees, landing) from 1 to 3 and set one goal. Skip jumping if you have any pain."),
L('s2-pdhpe-y3-w06-l2', MSP, ['a circuit', 'a station', 'a signal', 'your own level'],
  "A movement circuit is a set of stations, each practising a skill for a short time before rotating, such as jogging on the spot, skipping, hopping, balancing and jumping. Circuits work best with a clear signal to start and stop, a rotation direction, enough space between stations and an easier or harder option for each person. Rest and water breaks keep the body safe.",
  "Example circuit with 5 stations, 40 seconds each and 20 seconds to rotate: 1 jog on the spot, 2 skipping, 3 hop on each foot, 4 balance on one foot, 5 jump to a cone. Each station has an easier choice (march) and a harder one (high knees). Signal: a clap. Water break after station 5.",
  "A circuit has a crowded station where two people bump into each other. Suggest two changes that make the circuit safer and fairer.",
  "Add more space or markers, allow only two people per station and use one rotation direction with a clear stop signal. These changes prevent collisions and give every person a turn.",
  "Believing the fastest person at a circuit has done it best. Success is working safely with good technique at your own level.",
  "Design a six-station circuit for your household with timing, a rotation direction, one safety rule and an easier and a harder choice at every station. Try it, record your effort from 1 to 5 at each station and suggest one improvement."),
]

VISUALS = {
 's2-pdhpe-y3-w01-l1': [pair_visual('Body clue','fast heart, tight stomach','Feeling word','nervous, strength 4 of 5','Body clues beside a precise feeling word.','Clues point to a feeling.'),
  pair_visual('Vague','bad','Precise','disappointed, 3 of 5','A vague and a precise feeling word.','Precise words help others.')],
 's2-pdhpe-y3-w01-l2': [pair_visual('Face','eyebrows up, eyes wide','Body','shoulders hunched','Face and body clues in charades.','Use clues, not words.'),
  pair_visual('Kind play','pass if you like','Unkind','mocking a feeling','Kind and unkind role play.','Act feelings with respect.')],
 's2-pdhpe-y3-w02-l1': [pair_visual('Body','breathe, stretch, cushion','People','teacher, friend, family','Calm-down strategy types.','Choose from different types.'),
  pair_visual('Before','worried 4 of 5','After','worried 2 of 5','A feeling number before and after calming.','Rate the feeling.')],
 's2-pdhpe-y3-w02-l2': [pair_visual('In','belly rises, slow nose breath','Out','slow breath through mouth','Slow belly breathing in and out.','Slow and steady.'),
  pair_visual('Stretch','hold, no bouncing','Stop','if it hurts or you are dizzy','Gentle stretch rules.','Stop if it hurts.')],
 's2-pdhpe-y3-w03-l1': [pair_visual('Fixed','I cannot do it','Growth','I cannot do it yet','Fixed and growth thoughts.','Add the word yet.'),
  pair_visual('Goal','3 catches by Friday','Result','5 catches after a week','A small goal and a result.','Small goals show progress.')],
 's2-pdhpe-y3-w03-l2': [pair_visual('Plan 1','3 passes, dropped it','Plan 2','call names, 7 passes','Changing the plan to improve.','Change one thing.'),
  pair_visual('Kind words','good recovery, Kai','Unkind','this is pointless','Encouraging and discouraging words.','Name the effort.')],
 's2-pdhpe-y3-w04-l1': [pair_visual('Problem','shoes hurt in sport','Helper','sport teacher','A problem matched to a helper.','Match problem to helper.'),
  pair_visual('Request','who, problem, help needed','Unsafe','tell an adult at once','Help requests and urgent help.','Unsafe means tell now.')],
 's2-pdhpe-y3-w04-l2': [pair_visual('Open','Excuse me, Ms Rowe','Ask','I cannot find my lunch box','A help request script.','Name and ask clearly.'),
  pair_visual('Close','Thank you','Listen','ask again if unsure','Listening and thanking.','Thank and listen.')],
 's2-pdhpe-y3-w05-l1': [pair_visual('Evidence','diary: worry 4 down to 2','Next step','ask for help earlier','Evidence and a next step.','Use evidence.'),
  pair_visual('Influences','sleep, food, friends, play','Wellbeing','body, mind, relationships','Things that influence wellbeing.','Many things matter.')],
 's2-pdhpe-y3-w05-l2': [pair_visual('Poster','four boxes, one example each','Talk','two minutes','A unit showcase plan.','Pick the key ideas.'),
  pair_visual('Star','clear voice','Wish','look up more','Two stars and a wish.','Be specific.')],
 's2-pdhpe-y3-w06-l1': [pair_visual('Run','bent arms, eyes ahead','Land','soft knees, arms forward','Running and landing cues.','Cues keep you balanced.'),
  pair_visual('Soft','bent knees absorb force','Stiff','straight legs jar the body','Soft and stiff landings.','Bend the knees.')],
 's2-pdhpe-y3-w06-l2': [pair_visual('Stations','jog, skip, hop, balance, jump','Signal','clap to start and rotate','A five-station circuit.','Rotate on a signal.'),
  pair_visual('Easier','march','Harder','high knees','Choices at a station.','Choose your level.')],
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
