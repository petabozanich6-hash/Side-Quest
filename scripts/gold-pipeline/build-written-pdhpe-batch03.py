#!/usr/bin/env python3
"""Year 3 PDHPE Written Core batch 03: healthy food, friendships and respect w13-l1 through w18-l2 (12)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

MSP, IHW, RRS1 = 'PH2-MSP-01', 'PH2-IHW-01', 'PH2-RRS-01'

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, subject='pdhpe', vocab=vocab,
                principle=principle, model=model, guided=guided, feedback=feedback,
                misconception=misconception, independent=independent)

LESSONS = [
L('s2-pdhpe-y3-w13-l1', IHW, ['everyday foods', 'sometimes foods', 'balance', 'nutrients'],
  "Everyday foods come from the five food groups and give the body the nutrients it needs for growth and energy. Sometimes foods, such as chips, lollies, soft drink and cake, are often high in added sugar, salt or saturated fat and low in nutrients, so they are eaten less often and in small amounts. Celebrations and treats are part of life; the aim is balance, not guilt.",
  "Example. Everyday: wholegrain crackers with cheese, carrot sticks, a banana, water. Sometimes: a birthday cupcake, a packet of chips. Tia enjoys the cupcake at her party and chooses fruit and water at snack time, so her week stays balanced.",
  "Sort these foods into everyday or sometimes: apple slices, lollies, plain popcorn, sausage roll, milk. Give a reason for the sausage roll.",
  "Everyday: apple slices, plain popcorn, milk. Sometimes: lollies and sausage roll (pastry and processed meat have a lot of saturated fat and salt). Plain popcorn without added butter or sugar is a grain food.",
  "Believing sometimes foods are never allowed. All foods can fit in a healthy pattern, but sometimes foods are eaten less often and in smaller amounts.",
  "Make a two-column chart with five everyday and five sometimes foods that your family eats. Write the reason for each choice (nutrients, sugar, salt or fat) and give two ideas for a healthy party food. Do not judge anyone's food choices."),
L('s2-pdhpe-y3-w13-l2', IHW, ['a healthy snack', 'criteria', 'allergy-safe', 'cost'],
  "A healthy snack gives energy between meals and comes from the five food groups, such as fruit, vegetables with hummus, yoghurt, cheese and crackers, or plain popcorn. A good snack is easy to prepare, safe for everyone including people with allergies, and affordable. To design a snack, compare options with a short list of criteria: food groups, sugar and salt, cost and safety.",
  "Example snack plan: apple slices with plain yoghurt dip. Food groups: fruit and milk (yes). Added sugar: low. Salt: low. Cost: cheap. Allergies: nut-free. Score: 5 out of 5. Rejected: a packet of lollies (no food group, high sugar).",
  "Compare two snacks using the criteria: (A) carrot sticks and hummus, (B) a chocolate bar. Which is better for an everyday snack, and why?",
  "A is better: it gives vegetables and legumes, is low in sugar and gives fibre. B is a sometimes food with high added sugar and fat and few nutrients. Compare with criteria, not only taste.",
  "Believing a snack is healthy because the packet says 'healthy' or 'natural'. Read the food groups and the ingredient list, because some labelled snacks are high in sugar.",
  "Design a healthy snack for a class of 24 with an allergy-safe plan. Write the ingredients by group, a score using four criteria, a cost estimate and two safety steps for handling food. Prepare it only with an adult and wash hands first."),
L('s2-pdhpe-y3-w14-l1', IHW, ['water', 'hydration', 'thirst signs', 'a water plan'],
  "Water helps the body control its temperature, move nutrients around and stay alert. We lose water when we sweat, breathe and go to the toilet, so we need to drink through the day, especially when it is hot or we are active. Signs we may need a drink include thirst, a dry mouth, a headache or tiredness. Water is the best everyday drink; sugary drinks are sometimes drinks.",
  "Example: Kai plays for 30 minutes on a hot day. He feels thirsty and a little tired. He sips water from his bottle before, during breaks and after. His plan: a full bottle at school, a refill at lunch and a glass with dinner. He chooses water instead of soft drink with his lunch.",
  "Maya has a headache and a dry mouth after running in the sun. What could these signs mean and what should she do first?",
  "A dry mouth and headache can be signs she needs water. She should rest in the shade, sip water slowly and tell an adult. If she feels very unwell, dizzy or confused, an adult must help straight away.",
  "Thinking you only need a drink when you feel thirsty and that sports drinks are best. Sip water regularly, especially in heat; thirst can start after the body is already low on water.",
  "Keep a one-day water diary: write when you drank water, how much (in cups) and how you felt. If possible compare a calm day with a very active or hot day. Write three reminders for when to drink water."),
L('s2-pdhpe-y3-w14-l2', IHW, ['an active challenge', 'a water break', 'a thirst rating', 'resting safely'],
  "An active water challenge links movement with hydration: do short bursts of activity, take water breaks and see how the body changes. Plan breaks before you feel very thirsty, drink slowly, stop if you feel dizzy or unwell and rest in the shade on hot days. A challenge can be against yourself, such as keeping your own drink diary for a week, rather than against other people.",
  "Example challenge: four rounds of 2 minutes of activity (star jumps, jogging on the spot, hopping, marching), each followed by a 1 minute water break. Zoe rates her thirst from 1 to 5: 2 before, 4 after round 3, then 1 after drinking. She learns to drink before her thirst reaches a 4.",
  "A challenge has the rule 'no water breaks until you have finished'. Rewrite the rule to make it safe and say why.",
  "Rewrite: 'Take a water break after every round, and anyone can stop to rest or drink at any time.' Water breaks protect the body, and the choice to stop keeps the challenge safe and inclusive.",
  "Believing the best athletes ignore thirst. Drinking regularly and resting are part of safe, healthy performance.",
  "Plan and do a safe 15-minute active challenge for yourself or your family with at least three water breaks. Record thirst ratings from 1 to 5 before and after each round and write two conclusions. Adjust the activity for hot weather or any health need."),
L('s2-pdhpe-y3-w15-l1', IHW, ['food safety', 'hand washing', 'cross-contamination', 'use-by dates'],
  "Food safety stops germs from making people sick. Wash hands with soap and running water for at least 20 seconds before touching food, after using the toilet and after touching raw meat. Keep raw meat away from ready-to-eat food, keep cold food cold, cook food until it is hot all the way through and read use-by dates. Wash fruit and vegetables and use clean boards and utensils. Never share food with someone who has an allergy.",
  "Example: Sam makes a chicken salad sandwich with an adult. Steps: wash hands for 20 seconds; use one board for raw chicken and a different board for vegetables; cook the chicken until it is hot all the way through; wash the board and knife in hot soapy water; put leftovers in the fridge within two hours.",
  "Rina uses the same knife to cut raw chicken and then tomatoes. What is the problem and what should she do instead?",
  "Raw chicken can carry germs that spread to the tomatoes, which are eaten raw. She should use a separate knife and board, or wash them in hot soapy water between jobs, and wash her hands.",
  "Thinking food is safe if it smells fine. Germs that cause illness often cannot be smelled or seen, so use safe steps and read dates.",
  "Create a food safety poster for your kitchen with five rules, the hand washing steps and one use-by reminder. Time a 20-second hand wash (sing a song) and record how long it took. Use the poster with an adult at home."),
L('s2-pdhpe-y3-w15-l2', IHW, ['a showcase', 'a balanced meal', 'reasons', 'respect for differences'],
  "A healthy food showcase brings together the five food groups, balanced plates, everyday and sometimes foods, water and food safety. Choose a clear way to present, such as a poster, a recipe card or a short talk, and use real examples with reasons. Be respectful of different foods, cultures, budgets and allergies when talking about meals.",
  "Example: Leo's recipe card 'Rainbow wraps'. Food groups: grain (wrap), protein (chicken), vegetables (carrot, lettuce, capsicum), milk (cheese). Safety: wash hands and use separate boards. Drink: water. Sometimes food: a small cookie on Fridays. He gives a reason for each choice.",
  "Write two sentences for a showcase saying why a mixed lunch is healthier than a lunch of chips and soft drink. Name food groups in your reasons.",
  "Sample: 'A mixed lunch with a sandwich, salad, fruit and water uses four food groups, which give different nutrients. Chips and soft drink mostly give salt, fat and sugar and no variety.' The reasons name groups and nutrients.",
  "Believing a healthy diet means giving up the foods you love. A healthy diet is about balance and variety, with enjoyment included.",
  "Make a showcase about healthy eating for a younger child. Include the five groups, a balanced plate, one sometimes food rule, why water matters and two food safety steps. Present it to a family member and collect two stars and a wish."),
L('s2-pdhpe-y3-w16-l1', RRS1, ['a good friend', 'kindness', 'honesty', 'respect'],
  "A good friend is kind, honest, reliable and respectful. Good friends listen, share, include others, say sorry and help each other. Friendships can change, and people can have many types of friends. Respectful friends accept 'no' and do not pressure, threaten or leave people out. Anyone who makes you feel unsafe is not acting like a good friend, and you can tell a trusted adult.",
  "Example: Ari lists friend qualities with real examples. Kind: shared his pencil. Honest: said my drawing needed a title but liked the colours. Reliable: turned up to help at recess. Respectful: accepted 'no' when I wanted to play alone. Each quality has an example.",
  "A friend says, 'If you don't give me your snack, I won't be your friend.' Is this respectful? Use two friendship qualities in your answer.",
  "Not respectful: it pressures and threatens. A respectful friend accepts a 'no', which shows respect and kindness. You can say 'No thanks' and tell a trusted adult if it keeps happening.",
  "Thinking friends must always agree and do everything together. Friends can disagree, have different interests and still be kind and respectful.",
  "Write a description of a made-up good friend with five qualities and a real-life style example for each. Add two signs that a friendship is not respectful and name one trusted adult you could tell."),
L('s2-pdhpe-y3-w16-l2', RRS1, ['a role play', 'an I statement', 'saying no kindly', 'an invitation'],
  "Role plays let us practise friendship skills such as joining in, saying 'no' kindly, apologising and including someone who is alone. An 'I statement' tells how you feel and what you would like: 'I feel left out when... I would like...'. Use made-up characters, respectful body language and swap roles so you understand each side. Anyone may pass.",
  "Example script: Dani sees Lee alone. Dani: 'Hi Lee, we are playing handball. Would you like to join?' Lee: 'Yes please.' Skills used: friendly voice, clear invitation, accepting. If Lee says 'No thanks', Dani says 'Okay, maybe next time.'",
  "Write a three-line script in which someone kindly says 'no' to a game they do not want to play and the other person responds respectfully.",
  "Script: 'Thanks for asking, but I would like to read today.' 'That's okay. See you later!' The no is kind and clear, and the reply accepts it.",
  "Thinking that saying no is rude. A kind, clear no is respectful, and a respectful friend accepts it.",
  "Write and perform three friendship role plays with a family member: inviting someone to join, saying no kindly, and apologising after accidentally hurting someone's feelings. Include an 'I' statement in each and swap roles. Note what each role felt like."),
L('s2-pdhpe-y3-w17-l1', RRS1, ['respectful words', 'tone of voice', 'body language', 'disagreeing politely'],
  "Respectful communication uses words, tone and body language that show you value the other person. It includes listening without interrupting, using polite words, taking turns, asking questions and disagreeing without put-downs. Tone and body language can change the meaning of words, so a calm voice, eye contact if comfortable and an open posture help. Respect also means accepting different ways of communicating, including signing, writing or a quiet style.",
  "Example: two students disagree about a game. Respectful: 'I see it differently. Can I tell you my idea?' Tone: calm. Body: facing the person. Disrespectful: rolling eyes and saying 'that's a dumb idea'. The same disagreement is handled with respect when words, tone and body language all match.",
  "Rewrite 'That's a stupid idea!' so that it disagrees respectfully. Add the tone and body language you would use.",
  "Rewrite: 'I'm not sure that will work, could we try this instead?' Tone: calm. Body: face the speaker. A respectful disagreement keeps the idea and removes the insult.",
  "Believing words are the only thing that matters. Tone of voice and body language also send messages.",
  "Collect three examples of respectful and three of disrespectful communication from a story, a show or your day (without naming real people). For each, name the words, tone and body language and rewrite the disrespectful ones respectfully."),
L('s2-pdhpe-y3-w17-l2', RRS1, ['active listening', 'clear speaking', 'taking turns', 'repeating the main idea'],
  "Active listening means looking at the speaker, keeping still, not interrupting and then showing you understood by saying back the main idea. Clear speaking uses a steady pace, an audible voice and one idea at a time. Games such as 'Describe and draw' or 'Repeat the message' build both skills. Everyone has a right to speak and a right to be listened to.",
  "Example 'Describe and draw': Partner A describes a simple picture ('a big sun in the top corner, two clouds below it') while Partner B draws without seeing it. They compare and talk about which words were clear. B uses an active listening sentence: 'You said the sun is top right, is that right?'",
  "Write one active listening sentence you could say after a friend tells you about their weekend.",
  "Sample: 'It sounds like you enjoyed the beach and building a sandcastle. Did the waves wash it away?' It repeats the main idea and asks a question about it.",
  "Thinking listening is just being quiet. Active listening includes looking, thinking and showing that you understood.",
  "Play 'Describe and draw' or 'Repeat the message' with a family member. Record what was easy, what was tricky and two tips for clearer speaking and better listening. Swap roles and repeat."),
L('s2-pdhpe-y3-w18-l1', RRS1, ['including others', 'belonging', 'adapting a game', 'inviting kindly'],
  "Including others means making sure everyone has a chance to take part, feel welcome and belong. We can invite people to join, change games so everyone can play, say names correctly and respect cultural differences and different abilities. Leaving someone out on purpose can make them feel lonely. If you see someone left out, you can invite them, ask what they would like, or tell a trusted adult.",
  "Example: at lunch Ben sees a new student alone. He walks over, says 'Hi, I'm Ben. Would you like to play with us?' and tells the group the new student's name. When the student says they would rather watch today, Ben says 'That's fine, you can join any time.'",
  "A game needs fast running and one player cannot run quickly. Write two ways to change the game so all players can take part.",
  "Ideas: use walking or hopping, give different jobs such as scorer or goalkeeper, or let teams choose how to move. Changing the game to include everyone is better than leaving someone out.",
  "Thinking that including someone means forcing them to join. Invite kindly, and respect their choice if they say 'not now'.",
  "Plan an inclusion week at school: write five actions you could do to welcome others (inviting, learning names, adapting games). For each, say who benefits and how you would respond if someone says 'no thanks'."),
L('s2-pdhpe-y3-w18-l2', RRS1, ['a cooperative game', 'a shared goal', 'roles', 'problem solving together'],
  "Cooperative games have a shared goal that needs everyone's help, such as passing a hoop around a circle without letting go or keeping a balloon in the air together. They build teamwork, communication and respect. Safe cooperative play includes agreeing on rules, using soft equipment and stopping if someone is uncomfortable. Success is measured as a team, not against each other.",
  "Example game 'Hoop pass': a circle of six passes a hoop around by stepping through it while holding hands. Goal: finish in under one minute. Roles: encourager, timekeeper and safety watcher. Players who prefer not to hold hands hold a scarf between them.",
  "A cooperative game ends in tears because one player kept making the team lose. Write a kind way for the team to respond and one change to the plan.",
  "Response: 'Everyone has trouble sometimes, let's try again more slowly.' Change: add a practice round or lower the goal. Cooperative games succeed when the team solves problems together without blame.",
  "Thinking cooperative games are not real games because nobody wins. A shared goal can be just as exciting and teaches skills for working together.",
  "Invent a cooperative game for three or more players with a shared goal, rules, two safety rules, three roles and a plan for including someone who prefers not to touch others. Play it and record the team result and one change."),
]

VISUALS = {
 's2-pdhpe-y3-w13-l1': [pair_visual('Everyday','fruit, vegetables, milk','Sometimes','lollies, chips, cake','Everyday and sometimes foods.','Balance over the week.'),
  pair_visual('Party','cupcake is fine','Snack time','fruit and water','Balance across a day.','No food is bad.')],
 's2-pdhpe-y3-w13-l2': [pair_visual('Hummus','vegetables and legumes','Chocolate','sugar and fat','Comparing two snacks.','Compare with criteria.'),
  pair_visual('Criteria','groups, sugar, cost, safety','Score','5 out of 5','A snack score table.','Score every snack.')],
 's2-pdhpe-y3-w14-l1': [pair_visual('Signs','thirst, dry mouth, headache','Action','rest, sip water, tell adult','Thirst signs and actions.','Sip water early.'),
  pair_visual('Plan','bottle, refill, dinner glass','Best drink','water','A daily water plan.','Water first.')],
 's2-pdhpe-y3-w14-l2': [pair_visual('Round','2 minutes of activity','Break','1 minute of water','Activity and water breaks.','Drink every round.'),
  pair_visual('Thirst','2 before, 4 after','Drink','back to 1','Thirst ratings.','Drink before 4.')],
 's2-pdhpe-y3-w15-l1': [pair_visual('Wash','soap, water, 20 seconds','Boards','raw and ready foods apart','Hand washing and separate boards.','Wash and separate.'),
  pair_visual('Hot through','cook chicken fully','Fridge','within two hours','Cooking and storing food safely.','Keep cold food cold.')],
 's2-pdhpe-y3-w15-l2': [pair_visual('Wrap','grain, protein, vegetables, milk','Drink','water','A balanced wrap.','Four groups in one meal.'),
  pair_visual('Respect','different foods and budgets','Allergy','plan for safe foods','Respect for food differences.','Respect every table.')],
 's2-pdhpe-y3-w16-l1': [pair_visual('Qualities','kind, honest, reliable','Respect','accepts no','Good friend qualities.','Name an example.'),
  pair_visual('Pressure','give me your snack or else','Respect','a no is accepted','Pressure and respect.','Tell an adult if unsure.')],
 's2-pdhpe-y3-w16-l2': [pair_visual('Invite','Would you like to join?','Reply','Yes please, or no thanks','An invitation and a reply.','Accept every answer.'),
  pair_visual('I statement','I feel left out when','Wish','I would like to join','An I statement.','Say feeling and wish.')],
 's2-pdhpe-y3-w17-l1': [pair_visual('Respectful','I see it differently','Put-down','that is a dumb idea','Respectful and put-down words.','Remove the insult.'),
  pair_visual('Tone','calm','Body','face the speaker','Tone and body language.','All three match.')],
 's2-pdhpe-y3-w17-l2': [pair_visual('Look','eyes on speaker','Repeat','you said the sun is top right','Active listening steps.','Say the main idea back.'),
  pair_visual('Speak','steady pace, one idea','Turns','one voice at a time','Clear speaking.','Take turns to speak.')],
 's2-pdhpe-y3-w18-l1': [pair_visual('Invite','Hi, I am Ben','Choice','you can join any time','Inviting and respecting choice.','Invite, never force.'),
  pair_visual('Left out','nobody asks','Included','roles for everyone','Left out and included.','Change the game.')],
 's2-pdhpe-y3-w18-l2': [pair_visual('Shared goal','pass the hoop around','Roles','encourager, timekeeper, safety','A cooperative game.','One goal for the team.'),
  pair_visual('Blame','you lost it for us','Team','let us go slower','Blame and teamwork.','Solve it together.')],
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
