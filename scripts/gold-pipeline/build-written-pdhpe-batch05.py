#!/usr/bin/env python3
"""Year 3 PDHPE Written Core batch 05: games close and staying safe w25-l1 through w30-l2 (12)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

MSP, IHW, RRS2 = 'PH2-MSP-01', 'PH2-IHW-01', 'PH2-RRS-02'

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, subject='pdhpe', vocab=vocab,
                principle=principle, model=model, guided=guided, feedback=feedback,
                misconception=misconception, independent=independent)

LESSONS = [
L('s2-pdhpe-y3-w25-l1', MSP, ['playing together', 'agreed rules', 'a reflection', 'taking part'],
  "Playing games together combines skills, rules and respect. Players agree on the rules, take turns, help each other, solve problems fairly and celebrate effort. Good players include everyone and keep safe. After playing, a short reflection asks: Was it safe? Was it fair? Did everyone take part? Then the group changes one thing to improve next time.",
  "Example: four children play a rotating target-throwing game. Before starting they agree three rules: soft throws, wait for your turn and cheer for every go. Afterwards they reflect. Safe: yes. Fair: one player missed a turn, so they add a turn list. Included: all four played.",
  "After a game one player says they hardly got a turn. Write two reflection questions and one change to the rules.",
  "Questions: 'Did everyone get a turn?' and 'How can we make turns fair?' Change: use a list or count-off so every player has an equal turn. Reflection leads to a change that fixes the problem.",
  "Thinking reflection is only about who won. Reflection is about safety, fairness and inclusion as well.",
  "Play a game with family and record a reflection table with safe, fair and included ratings from 1 to 5 and evidence for each. Write one change you would make next time."),
L('s2-pdhpe-y3-w25-l2', MSP, ['a showcase', 'fair play', 'strategy', 'evaluation'],
  "A games and sports showcase shows learning about rules and fair play, teamwork and roles, using space and strategy, and evaluating and designing games. Present a clear example such as a game plan, a demonstration or a poster. Use cue words and reasons, and show safe and inclusive practice.",
  "Example: Jin presents a game plan poster for 'Space Raiders' with the rules, roles (captain, defender), a strategy (spread out, pass and move) and an evaluation (fairness 3 out of 5, then 4 after a rule change). He demonstrates pass and move and says why it works.",
  "Write two sentences linking a game rule to fair play, with a reason.",
  "Sample: 'The rule that everyone must touch the ball before a shot keeps the game fair because every player gets turns. It also helps the team practise passing.' It links rule, fair play and a reason.",
  "Thinking a showcase has to show your best skill. It shows what you understand, including your reasons and improvement.",
  "Make a games and sports showcase with five parts: a fair play rule, a team role plan, a space strategy, a game evaluation and your own game design. Present it to family and collect two stars and a wish."),
L('s2-pdhpe-y3-w26-l1', IHW, ['road safety', 'stop look listen think', 'a crossing', 'holding hands'],
  "Roads are dangerous because vehicles are heavy and can be hard to stop. Safe pedestrians cross at pedestrian crossings or traffic lights with an adult and use Stop, Look, Listen, Think: stop at the kerb, look for vehicles in both directions, listen for engines and think about whether it is safe. Hold an adult's hand in car parks and driveways, walk and do not run, and never play on a road. Wear a properly fitted helmet when riding a bike or scooter.",
  "Example: Nina and her dad reach a crossing. Stop at the kerb. Look right, left and right again. Listen for engines. Think: the walk signal is green and the cars have stopped. They hold hands and walk across without running, looking again as they cross. In the car park she holds his hand because cars reverse.",
  "A ball rolls onto the road. Write what you should do and why.",
  "Do not run after it. Stop, tell an adult and let them decide whether it is safe to get it, or leave it. A ball can be replaced; you cannot. Roads are not for play.",
  "Thinking that if one car stops you can cross without looking. Make sure every driver has seen you and stopped, and keep looking as you cross.",
  "With an adult, plan a safe walking route from your front door to a local place, marking where to cross and which signals to use. Write the Stop, Look, Listen, Think steps and three other safety rules for your route."),
L('s2-pdhpe-y3-w26-l2', IHW, ['a role play', 'a chalk crossing', 'pedestrian and driver', 'swapping roles'],
  "Role plays let us practise safe crossing without any danger. Use chalk or tape for a pretend road and crossing, and play pedestrian, driver or adult. Say the steps aloud: stop, look, listen, think, walk. Practising steps again and again builds safe habits. Role plays happen away from real roads, and everyone follows the rules.",
  "Example: on a chalk crossing in the backyard, Dev is the pedestrian, Anna is the driver with a cardboard car and Mum is the adult. Dev says aloud, 'Stop. Look right, left, right. Listen. Think: the car has stopped, so I will walk.' They swap roles so Dev sees what a driver can see.",
  "In a role play, the pedestrian steps off the kerb while looking at a phone. What is the problem and what should they do instead?",
  "Looking at a phone means they cannot see or hear vehicles. They should put the phone away, stop at the kerb and use stop, look, listen, think. Pedestrians need all their senses.",
  "Thinking you only need to look in one direction. Vehicles can come from both directions, so look right, left and right again.",
  "Set up a pretend road with chalk or masking tape and role play three crossing situations (a zebra crossing, traffic lights and a driveway). Use cards with each step. Record what the pedestrian and the driver need to do in each, and swap roles."),
L('s2-pdhpe-y3-w27-l1', IHW, ['water safety', 'the red and yellow flags', 'the five Ss', 'sunscreen'],
  "Water can be fun but it can be dangerous. Always swim with an adult watching, swim between the red and yellow flags at the beach, never swim alone and ask an adult before going near water. In the sun use the five Ss: slip on a shirt, slop on SPF 30 or higher broad-spectrum sunscreen, slap on a broad-brimmed hat, seek shade and slide on sunglasses. Reapply sunscreen every two hours and after swimming. In Australia, UV rays can burn skin quickly even on cool or cloudy days.",
  "Example: Lee and her family go to the beach. They find the red and yellow flags and swim between them with an adult watching. Sun safety: a long-sleeve rash shirt, sunscreen on all uncovered skin (reapplied every two hours and after swimming), a hat, shade under the umbrella in the middle of the day and sunglasses.",
  "A cloudy day at the beach looks cool, so a friend says they do not need sun protection. Write one sentence correcting them and name two of the five Ss they should still use.",
  "UV rays can pass through cloud and cause sunburn even when it is cool. They should still slip on a shirt and slap on a hat, and they can also use sunscreen and shade.",
  "Believing you cannot burn on cloudy or cool days. UV is not the same as heat, so protection is still needed when the UV index is 3 or above.",
  "Make a beach and sun safety poster with the five Ss and four water safety rules. Add a list of what to pack and a sentence for each rule saying why it matters. Teach the rules to someone younger."),
L('s2-pdhpe-y3-w27-l2', IHW, ['reach or throw', 'floating on your back', 'asking for help', 'qualified instructors'],
  "We can practise water safety skills on land with no water involved. Skills include 'Reach, throw, don't go' (reach with a stick or throw something that floats instead of going in), floating on your back on a mat, waving and calling for help, and knowing what the flags mean. Real swimming and rescue skills are taught by qualified instructors, so land practice is only a start.",
  "Example land practice. 1 'Reach, throw, don't go': Ethan stays on the grass and throws a rope or floating cushion to a friend pretending to need help, while calling an adult. 2 Float on a mat: lie on the back with arms and legs out and breathe slowly. 3 Wave one arm and shout for help.",
  "A toy floats away from the edge of a pool and a child wants to jump in to fetch it. Write what the child should do.",
  "Do not go in. Ask an adult for help. If a person is in trouble, call out for help and use reach or throw while staying on land. Toys can be replaced; people cannot.",
  "Believing that a good swimmer can safely go in to rescue someone. Even strong swimmers can get into trouble; reaching or throwing and calling for help is safer.",
  "With an adult, practise the three land skills (reach or throw an object, float on a mat, wave and call for help) and write the steps. Record what you would say to an adult or lifeguard and when you would call 000. Real water practice is only with a qualified instructor."),
L('s2-pdhpe-y3-w28-l1', RRS2, ['body warning signs', 'safe or unsafe', 'saying no', 'telling a trusted adult'],
  "Our bodies give us early warning signs when something feels unsafe, such as a fast heartbeat, a tight tummy, sweaty hands or wanting to run away. A situation can be safe, unsafe or unsure. If it is unsafe or unsure we can say 'No' or 'Stop', go to a safe place and tell a trusted adult, and keep telling until someone listens. Our bodies belong to us, and nobody should hurt us or ask us to keep a secret that makes us feel worried or unsafe.",
  "Example: a stranger offers Sam a lift home. Early warning signs: his tummy feels tight and he feels nervous. Situation: unsafe. Action: say 'No thanks', walk to a safe place such as the shop or a teacher and tell a trusted adult. A safe situation: a family member collects him at the usual place.",
  "An older child says, 'Don't tell anyone, it's our secret,' about something that made you worried. Is this safe, unsafe or unsure, and what should you do?",
  "Unsafe or unsure: a secret that makes you worried should be told. Say 'No', go to a safe place and tell a trusted adult. A happy surprise that will soon be shared is different from a secret that worries you.",
  "Thinking you will get in trouble for telling. Trusted adults want to know, and telling keeps people safe.",
  "Make a three-column chart (safe, unsafe, unsure) with two made-up situations for each, a body clue for each and an action. Add a list of your trusted adults. Share only what you feel comfortable sharing."),
L('s2-pdhpe-y3-w28-l2', RRS2, ['a safety network', 'a trusted person', 'keep telling', 'emergency help'],
  "A safety network is a group of trusted people who can help when you feel unsafe or worried. Choose people you can reach in different places and at different times, such as family members, a teacher, a school counsellor or a neighbour, and write them on the fingers of one hand. If an adult does not listen, tell another until someone helps. Kids Helpline (1800 55 1800) offers free, private counselling for young people, and in an emergency call 000.",
  "Example: Priya's safety hand. Thumb: Mum, at home. Pointer: Aunty Lena next door. Middle: Ms Carter at school. Ring: the school counsellor. Little finger: Kids Helpline on 1800 55 1800. When she felt worried on the way home she told Ms Carter, who helped straight away.",
  "You feel unsafe at a friend's house and want to go home. Who could you contact and how?",
  "Ask to use the phone, or message a safe adult such as a parent, and say, 'I want to come home.' If it is an emergency, call 000. Having a plan for different places means there is always a way to get help.",
  "Thinking you must only tell one person. If one adult does not help, keep telling until someone does.",
  "Draw your safety hand with five trusted people or services and write where and when you could contact each. Practise saying 'I feel unsafe, can you help me?' to a family member. Include 000 and Kids Helpline."),
L('s2-pdhpe-y3-w29-l1', RRS2, ['personal information', 'asking permission', 'online kindness', 'a trusted adult'],
  "Online we stay safe by protecting personal information (full name, address, school, passwords and photos), using only age-appropriate sites with an adult's permission, and telling a trusted adult if something upsets or worries us. We are kind online by thinking before we post: is it kind, true and necessary? We never share someone else's photo without permission. A stranger online is still a stranger, so never chat privately or meet someone you only know online.",
  "Example: Ari wants to join an online game. First he asks his parent for permission. His username is 'BlueKangaroo' (no real name) and he keeps his password private. When a stranger asks 'Where do you live?' he does not answer, leaves the chat and tells his parent. Before posting a comment he asks: Is it kind? Is it true?",
  "A message says, 'I'm a kid too, what's your address so I can send you a prize?' Write what you should do and why.",
  "Do not reply or share your address. Show a trusted adult straight away and block or report the message with them. Strangers can pretend to be someone else, and a real prize never needs your address from a child.",
  "Thinking online friends are the same as real friends because they are nice. People can pretend online, so never share personal details or meet without a trusted adult.",
  "Create a family online safety agreement with six rules covering permission, personal information, kindness, telling an adult and screen time. Add one unkind comment rewritten kindly. Sign it with a family member."),
L('s2-pdhpe-y3-w29-l2', RRS2, ['an online scenario', 'block and report', 'stop and think', 'it is not your fault'],
  "Scenarios are made-up situations where we practise choices. For each online scenario: stop, think about whether it is safe, kind and suitable, decide what to do (leave, block or report) and tell a trusted adult. Common scenarios include pop-ups, unknown friend requests, unkind messages, requests for photos and strangers asking for personal details. It is never your fault if someone sends something that upsets you.",
  "Example scenario: a pop-up says 'You won a free phone! Click here.' Stop: it looks too good to be true. Think: it might be a trick. Act: do not click, close it. Tell: an adult helps remove the pop-up and checks the device.",
  "Someone you do not know sends a friend request in a game and asks for a photo of you. Write the three steps you take.",
  "Do not send a photo and do not accept. Block or report the request with a trusted adult. Tell them what happened, because they can help keep you safe.",
  "Believing that if something upsetting happens online it is your fault. It is not your fault, and telling a trusted adult is always a good idea.",
  "Write three online scenarios (an unkind message, a request for personal information and a surprising pop-up). For each, write what you would do using the steps stop, think, act and tell. Practise telling an adult about one scenario."),
L('s2-pdhpe-y3-w30-l1', IHW, ['a hazard', 'an emergency plan', 'calling 000', 'a meeting place'],
  "Safety at home and school includes simple habits: keep walkways clear, walk inside, use equipment properly, keep medicines and cleaning products out of reach, ask an adult before using hot or sharp things, know the fire exit and the emergency number (000) and follow school rules in the playground and classroom. Knowing what to do in an emergency, such as staying low in smoke and meeting at a safe place, helps people stay calm.",
  "Example: a home safety plan. Spot hazards: a bag in the hallway (move it), a hot kettle (ask an adult), medicines on a low shelf (tell an adult to move them). Emergency plan: test the smoke alarm, meet at the letterbox, call 000 and say 'fire' and the address. At school: walk in the corridor and carry scissors with the points down.",
  "Write three hazards you might see in a kitchen and what you should do about each.",
  "Hazards: a hot pan handle sticking out, a wet floor and a sharp knife. Actions: tell an adult to turn the handle in, wipe the floor or put up a wet-floor sign, and ask an adult to put the knife away. Spotting hazards early prevents injuries.",
  "Thinking small hazards do not matter. Many injuries happen from small hazards like wet floors or bags in walkways.",
  "With an adult, walk through your home or classroom and list five hazards, one action for each and who is responsible. Draw an escape plan with a meeting place and write a 000 call script: which service, the address and what happened."),
L('s2-pdhpe-y3-w30-l2', IHW, ['a showcase', 'safety checklist', 'safety network', 'a reason'],
  "A safety showcase brings together road safety, water and sun safety, spotting safe and unsafe situations, safety networks, online safety and safety at home and school. Present with checklists, role plays or posters and give reasons. Respect everyone's experiences: share only what is comfortable and never ask others to tell personal stories.",
  "Example: Hana presents a 'Safety Hand' poster and a checklist. Road: stop, look, listen, think. Water: flags and an adult. Sun: five Ss. Online: no personal information. Help: five trusted people. She ends with 'If I feel unsafe, I say No, go and tell.'",
  "Write one sentence saying why having several people in your safety network is better than having one.",
  "Sample: 'If one person is not available or does not listen, I can tell another, so I always have a way to get help.' It gives a reason that links to the idea of keep telling.",
  "Believing that safety rules are only for little kids. People of all ages use safety rules to look after themselves and others.",
  "Create a safety showcase for a younger child covering road, water, sun, online and help-seeking safety with one checklist and one role play. Present it to a family member, collect two stars and a wish and add one improvement."),
]

VISUALS = {
 's2-pdhpe-y3-w25-l1': [pair_visual('Agree','soft throws, wait, cheer','Reflect','safe, fair, included','Rules before and a reflection after.','Agree, play, reflect.'),
  pair_visual('Problem','one player missed turns','Change','add a turn list','A reflection leads to a change.','Fix what you found.')],
 's2-pdhpe-y3-w25-l2': [pair_visual('Rule','everyone touches the ball','Reason','fair turns and passing','A rule linked to fair play.','Give the reason.'),
  pair_visual('Plan','rules, roles, strategy','Review','fairness 3 up to 4','Parts of a games showcase.','Show the evidence.')],
 's2-pdhpe-y3-w26-l1': [pair_visual('Stop','at the kerb','Look','right, left, right','Stop and look at a crossing.','Look both ways.'),
  pair_visual('Listen','for engines','Think','is it safe to go','Listen and think at a crossing.','Walk, do not run.')],
 's2-pdhpe-y3-w26-l2': [pair_visual('Pedestrian','says each step aloud','Driver','cardboard car stops','A chalk crossing role play.','Practise on chalk roads.'),
  pair_visual('Phone','eyes down, ears busy','Safe','phone away, senses ready','Phone and senses at a crossing.','Use every sense.')],
 's2-pdhpe-y3-w27-l1': [pair_visual('Flags','swim between red and yellow','Adult','watching at all times','Beach water safety.','Never swim alone.'),
  pair_visual('Slip slop slap','shirt, sunscreen, hat','Seek slide','shade and sunglasses','The five Ss.','Cloud does not stop UV.')],
 's2-pdhpe-y3-w27-l2': [pair_visual('Reach','stick or rope from land','Throw','floating cushion','Reach or throw from land.','Do not go in.'),
  pair_visual('Float','on back, slow breaths','Wave','call for help','Floating and signalling.','Float, wave, call.')],
 's2-pdhpe-y3-w28-l1': [pair_visual('Body signs','tight tummy, fast heart','Action','say no, tell an adult','Warning signs and action.','Listen to your body.'),
  pair_visual('Safe','family at usual place','Unsafe','stranger offers a lift','Safe and unsafe situations.','Unsafe means no, go, tell.')],
 's2-pdhpe-y3-w28-l2': [pair_visual('Hand','five trusted people','Number','Kids Helpline 1800 55 1800','A safety hand.','Five people to tell.'),
  pair_visual('Emergency','call 000','Keep telling','until someone helps','Emergency help.','Keep telling.')],
 's2-pdhpe-y3-w29-l1': [pair_visual('Keep private','real name, address, school','Share','nickname only','Personal information online.','Protect your details.'),
  pair_visual('Think first','is it kind and true','Ask','permission from an adult','Thinking before posting.','Kind, true, necessary.')],
 's2-pdhpe-y3-w29-l2': [pair_visual('Pop-up','free phone, click here','Act','close it, tell an adult','A pop-up scenario.','Too good is a trick.'),
  pair_visual('Request','a photo from a stranger','Response','block, report, tell','A request scenario.','It is not your fault.')],
 's2-pdhpe-y3-w30-l1': [pair_visual('Hazards','bag, hot pan, wet floor','Action','move it, tell an adult','Home hazards and actions.','Spot hazards early.'),
  pair_visual('Plan','meet at the letterbox','Call','000, fire, address','An emergency plan.','Know the plan.')],
 's2-pdhpe-y3-w30-l2': [pair_visual('Topics','road, water, sun, online','Help','five trusted people','A safety showcase.','Cover every topic.'),
  pair_visual('Poster','Safety Hand','Ending','say no, go, tell','A closing message.','End with an action.')],
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
