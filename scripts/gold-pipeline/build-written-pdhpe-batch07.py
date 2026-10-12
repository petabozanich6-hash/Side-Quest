#!/usr/bin/env python3
"""Year 3 PDHPE Written Core batch 07: healthy habits and year close w37-l1 through w40-l2 (8)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

MSP, IHW, SMI = 'PH2-MSP-01', 'PH2-IHW-01', 'PH2-SMI-01'

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, subject='pdhpe', vocab=vocab,
                principle=principle, model=model, guided=guided, feedback=feedback,
                misconception=misconception, independent=independent)

LESSONS = [
L('s2-pdhpe-y3-w37-l1', MSP, ['daily activity', 'moderate and vigorous', '60 minutes', 'an activity log'],
  "The Australian 24-Hour Movement Guidelines recommend at least 60 minutes of moderate to vigorous physical activity every day for children aged 5 to 13, plus several hours of light activity, and no more than 2 hours of recreational screen time. Moderate activity makes you breathe harder, like brisk walking; vigorous activity makes you puff, like running. Activity can be split into short bursts and done in many ways, including play, sport, walking to school and dancing.",
  "Example: Aiden's day. Walk to school: 15 minutes (moderate). Playground tag: 20 minutes (vigorous). PE: 20 minutes (moderate to vigorous). Bike ride after school: 15 minutes. Total: 70 minutes. He rates effort: walking 3 out of 5, tag 5 out of 5. He keeps recreational screen time to 1 hour.",
  "Layla did 25 minutes of active play at lunch, 15 minutes of walking and 10 minutes of dancing. Add the minutes and say whether she reached 60.",
  "25 + 15 + 10 = 50 minutes. She is 10 minutes short, so she could add a short bike ride or a game after school. Activity can be split into smaller bursts that add up.",
  "Thinking activity only counts if it is organised sport. Walking, playing, dancing and helping with chores can all count.",
  "Keep a one-day activity log with each activity, the minutes and the effort level (moderate or vigorous). Add the total and compare it with 60 minutes. Plan two new ways to add activity that suit your family and space, including an indoor option for wet days."),
L('s2-pdhpe-y3-w37-l2', MSP, ['a fitness circuit', 'warm-up and cool-down', 'your own results', 'stopping if unwell'],
  "A fitness challenge circuit builds strength, stamina and flexibility using stations such as step-ups, wall push-ups, chair squats, skipping and stretching. Warm up first, work at your own pace for 30 to 40 seconds per station, rest briefly and cool down with gentle stretches. Challenge yourself, not others, by comparing with your own earlier results. Stop if you feel pain or dizziness and keep water close.",
  "Example circuit. 1 Step-ups on a low step. 2 Wall push-ups. 3 Chair squats (sit down to a chair and stand up). 4 Skipping. 5 Balance on one foot. 30 seconds each, 15 seconds rest. Warm-up: march on the spot for 2 minutes. Cool-down: gentle arm and leg stretches. Sara records 12 chair squats, then 15 the next week.",
  "A circuit has no warm-up and no water break. Write one change for each and say why.",
  "Add 2 minutes of marching and arm circles first to prepare the muscles, and a water break after each round to replace fluid. Warm-ups help prevent injury and water breaks keep the body safe.",
  "Believing you should push through pain. Stop if anything hurts or you feel unwell; feeling puffed from effort is different from pain.",
  "Design a five-station fitness circuit using household items, with a warm-up, a cool-down, timings and easier and harder choices. Do it with family, record your counts at each station, repeat in a week and compare with your own results. Stop if you feel unwell."),
L('s2-pdhpe-y3-w38-l1', IHW, ['a healthy habit', 'a cue', 'an action', 'a reward'],
  "Healthy habits are things we do regularly that keep our bodies and minds well. At home they include eating a variety of foods, drinking water, being active, sleeping well, washing hands, limiting screen time and spending time with family. A habit is built by repeating a small action at the same time or place, with a cue (a reminder) and a reward. Small steps work better than big changes.",
  "Example: Tom builds a habit of drinking water after school. Cue: he puts his water bottle next to his school bag. Action: drink a glass when he gets home. Reward: a tick on a chart. After two weeks he has ticked 12 of 14 days. He then adds a second habit, stretching before bed.",
  "Pick a habit you would like to build, then write a cue, an action and a reward.",
  "Sample: Cue: brush teeth after dinner. Action: two minutes of brushing. Reward: a sticker on a chart. A good habit plan has a clear cue and a small action that is easy to repeat.",
  "Thinking a habit forms in one day. Habits are built by repeating small actions over time.",
  "Choose two healthy habits to build for two weeks. Write a cue, an action and a reward for each, and track them on a chart. After two weeks, write what helped, what was hard and one change."),
L('s2-pdhpe-y3-w38-l2', IHW, ['a habits plan', 'a SMART goal', 'tracking', 'reviewing a plan'],
  "A healthy habits plan brings several habits together using the SMART idea: Specific (what exactly), Measurable (how often or how long), Achievable (realistic), Relevant (it matters to you) and Time-bound (by when). A plan can cover food, water, activity, sleep and screen time. Plans are reviewed and changed, and families can help each other.",
  "Example four-week plan. Food: add one vegetable at dinner on 5 nights. Water: refill the bottle at lunch every school day. Activity: a 20-minute walk 4 times a week. Sleep: lights out at 8:30 on school nights. Review: tick a chart each week. Family help: Dad walks with me.",
  "Rewrite 'I will be healthier' as a SMART goal about drinking water.",
  "Sample: 'I will drink 6 cups of water each school day for the next two weeks, tracked on a chart.' It is specific, measurable, achievable and time-bound.",
  "Believing a plan has to be perfect on day one. Plans are reviewed and changed when something is not working.",
  "Make a four-week healthy habits plan with one SMART goal each for food, water, activity and sleep. Add a tracking chart, one way your family can help and one review date. Do not compare your plan with other people's."),
L('s2-pdhpe-y3-w39-l1', IHW, ['hygiene', 'germs', 'hand washing', 'cough and sneeze etiquette'],
  "Hygiene means keeping ourselves and our surroundings clean so germs do not spread. Key habits: wash hands with soap and water for 20 seconds, cover coughs and sneezes with a tissue or your elbow, shower or bathe regularly, wear clean clothes and do not share towels, cups or hairbrushes. Staying home when sick protects other people.",
  "Example: when to wash hands. Before eating, after the toilet, after coughing or sneezing, after playing outside and after touching animals. Mei coughs into her elbow, puts a used tissue in the bin and washes her hands with soap for 20 seconds. She stays home when she is sick so germs do not spread.",
  "A student sneezes into their hands and then touches a door handle. What is the problem and what should they do?",
  "Germs from the sneeze are now on the handle and can spread. They should sneeze into a tissue or elbow, then wash their hands with soap and water for 20 seconds.",
  "Thinking hand sanitiser is always better than soap. Washing with soap and water is best when hands are dirty; sanitiser helps when soap and water are not available.",
  "Create a hygiene poster showing five times to wash hands, the hand-washing steps and cough and sneeze etiquette. Time a 20-second wash and record it. Ask a family member to follow the steps and note any step they missed."),
L('s2-pdhpe-y3-w39-l2', IHW, ['tooth brushing', 'hand care', 'skin care', 'telling an adult'],
  "Looking after teeth, hands and skin keeps us healthy. Teeth: brush for two minutes twice a day with fluoride toothpaste, spit out the toothpaste without rinsing, limit sugary food and drinks and visit the dentist. Hands: wash, dry and keep nails short and clean. Skin: protect it from the sun, keep it clean, cover cuts with a clean plaster and tell an adult if a cut or rash looks sore or red.",
  "Example daily care routine. Morning: brush teeth for 2 minutes (a timer helps) and put sunscreen on uncovered skin. Afternoon: wash hands before snacks. Night: brush teeth, spit and do not rinse, then look at hands and nails. When Ben gets a scrape he rinses it, tells an adult and covers it with a clean plaster.",
  "Write a two-minute tooth-brushing plan that covers all the teeth, with the parts of the mouth in order.",
  "Sample: 30 seconds for each of four areas (top outside, top inside, bottom outside, bottom inside), including the chewing surfaces, then a gentle brush of the tongue. Spit but do not rinse so the fluoride stays on the teeth.",
  "Thinking you only need to brush when your teeth feel dirty. Brushing twice a day removes the sticky plaque that causes holes in teeth.",
  "Make a one-week care chart for teeth, hands and skin with morning, afternoon and night tasks. Tick it each day, time two tooth-brushing sessions and write what you would do if you had a small cut and who you would tell."),
L('s2-pdhpe-y3-w40-l1', SMI, ['reflection', 'a strength', 'a challenge', 'a next goal'],
  "Reflecting on the year means looking back at what you learned in feelings and wellbeing, movement skills, healthy food, friendships, games, safety, gymnastics and dance, and healthy habits. Choose evidence such as scores, charts, plans and earlier reflections. Name strengths, challenges and next goals using specific examples. Everyone's journey is different, and progress is measured against your own starting point.",
  "Example: Zoe's reflection. 'My strength was balance: I improved from 3 to 5 seconds (Week 31). Something I learned about friendships: using I statements helped solve a disagreement (Week 19). A challenge: remembering to drink water. My next goal: drink six cups on school days.'",
  "Choose one unit and write a strength, a challenge and a next goal using one piece of evidence.",
  "Sample: 'Strength: I used the stop, look, listen, think steps in my Week 26 role play. Challenge: remembering to use them every time. Goal: practise at each crossing this month.' It names evidence and a goal.",
  "Thinking reflection means saying everything went well. Honest reflection includes challenges and goals.",
  "Choose four pieces of PDHPE work from different units. For each, write the skill it shows, one strength and one next goal. Pick your proudest piece and give a reason. Share only what you are comfortable sharing."),
L('s2-pdhpe-y3-w40-l2', SMI, ['celebration', 'thanking others', 'inclusion', 'goals for next year'],
  "A good end to the year celebrates what you have achieved in a respectful and inclusive way, thanks the people who helped and sets goals for next year. Celebrations can be small, such as a card or a game. Everyone's effort counts, and a celebration should never leave someone out or compare people's bodies or abilities.",
  "Example celebration plan: a PDHPE party with a cooperative game, healthy snacks (fruit and wholegrain crackers) and water, and thank-you cards for the people who helped (teacher, family, coach). Goal for next year: try a new sport. Everyone gets a certificate for a personal strength, such as 'kind communicator' or 'steady balancer'.",
  "Write a thank-you sentence to one person who helped you in PDHPE this year and name what they did.",
  "Sample: 'Thank you, Mr Lee, for showing me how to land softly. It helped me jump safely.' It names the person, the action and the effect.",
  "Thinking celebration is only for winners. Celebrations honour effort, progress, kindness and teamwork as well as skill.",
  "Plan a small, inclusive year-end celebration with one cooperative game, healthy snacks and water, two thank-you notes and a goal for next year. Write how you will include everyone and share it with family."),
]

VISUALS = {
 's2-pdhpe-y3-w37-l1': [pair_visual('Moderate','brisk walk, breathe harder','Vigorous','running, puffing','Moderate and vigorous activity.','Both count.'),
  pair_visual('Total','25 + 15 + 10 = 50','Goal','60 minutes a day','Adding minutes of activity.','Add the bursts up.')],
 's2-pdhpe-y3-w37-l2': [pair_visual('Stations','step-ups, squats, skipping','Time','30 seconds, 15 rest','A fitness circuit.','Rotate and rest.'),
  pair_visual('Warm-up','march, arm circles','Cool-down','gentle stretches','Warm-up and cool-down.','Start and end gently.')],
 's2-pdhpe-y3-w38-l1': [pair_visual('Cue','bottle by the school bag','Action','drink a glass','A habit cue and action.','A cue starts a habit.'),
  pair_visual('Reward','tick on a chart','Progress','12 of 14 days','A reward and progress.','Track your habit.')],
 's2-pdhpe-y3-w38-l2': [pair_visual('Vague','be healthier','SMART','6 cups for 2 weeks','A vague and a SMART goal.','Make goals measurable.'),
  pair_visual('Plan','food, water, activity, sleep','Review','tick a chart weekly','A habits plan.','Review and adjust.')],
 's2-pdhpe-y3-w39-l1': [pair_visual('Sneeze','tissue or elbow','Wash','soap, water, 20 seconds','Covering and washing.','Cover, then wash.'),
  pair_visual('When','before eating, after toilet','Sick','stay home','When to wash and stay home.','Wash at key times.')],
 's2-pdhpe-y3-w39-l2': [pair_visual('Teeth','2 minutes, twice a day','Spit','do not rinse','Tooth brushing.','Spit, do not rinse.'),
  pair_visual('Skin','sunscreen, clean plaster','Tell','an adult if red or sore','Skin and hand care.','Tell an adult.')],
 's2-pdhpe-y3-w40-l1': [pair_visual('Strength','balance, 3 up to 5 seconds','Challenge','remember water','A strength and a challenge.','Use evidence.'),
  pair_visual('Goal','six cups on school days','Proud','one piece and a reason','A next goal.','Set a clear goal.')],
 's2-pdhpe-y3-w40-l2': [pair_visual('Thank','Mr Lee, soft landings','Effect','jumped safely','A thank-you with the effect.','Name the help.'),
  pair_visual('Inclusive','game for everyone','Snacks','fruit, crackers, water','A year-end celebration.','Include everyone.')],
}

def create():
    assert len(LESSONS) == 8
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
