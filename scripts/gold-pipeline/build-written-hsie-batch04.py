#!/usr/bin/env python3
"""Year 3 HSIE Written Core batch 04: environment action, then rules, laws and fairness, w19-l1 through w24-l2 (12)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

HIS, ACH, GEO = 'HS2-HIS-01', 'HS2-ACH-01', 'HS2-GEO-01'

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, subject='hsie', vocab=vocab,
                principle=principle, model=model, guided=guided, feedback=feedback,
                misconception=misconception, independent=independent)

LESSONS = [
L('s2-hsie-y3-w19-l1',GEO,['environment','cause','effect','care'],
  'People affect the environment through what they do, such as dropping litter, clearing bush or wasting water. Caring for the environment starts with finding the cause of a problem, seeing its effects on living things and then choosing an action that fits the cause.',
  'Example: litter dropped near a creek is washed into the water. Effect: animals can be harmed and the water becomes dirty. Actions that fit the cause: more bins, a clean-up with adult supervision and a sign asking people to take litter home.',
  'Put in order: animals are harmed; litter is dropped; litter washes into the creek. Then name one action that fixes the cause.',
  'Litter is dropped, litter washes into the creek, animals are harmed. An action that fits the cause is more bins or a sign at the park entrance.',
  'Choosing an action that does not match the cause, such as painting a fence to fix litter, will not solve the problem.',
  'Choose a local environmental problem. Draw a cause and effect chain with at least three links, name two living things affected and propose one safe action with a reason. Use an adult supervised photo or observation as evidence.'),
L('s2-hsie-y3-w19-l2',GEO,['action','goal','plan','permission'],
  'Taking action in a community means choosing a clear goal, getting permission, deciding who to contact and what steps to follow, and collecting evidence about the result. Safe actions include writing to a council, planting with adult help and running a poster campaign.',
  'Example plan: Goal: fewer plastic bottles at the school oval. Steps: ask the principal, count bottles in bins for one week, make posters, ask the canteen about reusable bottles, count again. Evidence: before and after counts.',
  'Rewrite this goal to make it clear and measurable: "Make the park better".',
  'For example: "Reduce litter at Station Park by counting items before and after a poster campaign over two weeks."',
  'A goal like "make things better" gives no way to tell whether the action worked.',
  'Plan a community action for a real local issue. Include goal, permission, three steps, who you will ask, how you will measure change and one safety rule. Write a short letter to the person who can say yes.'),
L('s2-hsie-y3-w20-l1',GEO,['connected','supply','transport','interdependence'],
  'People and places are connected through the things they share and trade, such as food, goods, jobs and ideas. A product passes through many places and people before it reaches us, so places depend on each other.',
  'Example: wheat grows on a farm, is trucked to a mill, becomes flour, is baked into bread at a bakery and is sold in a shop. Many people in different places each do one step. If a flood closes a road, the next step is delayed.',
  'Bananas grown in Queensland can reach shops in other states. Write three steps in the chain from farm to your home.',
  'For example: grown and picked on a farm; packed and trucked to a market; delivered to a shop and bought. Name the places and people at each step.',
  'Believing food comes from the shop skips the farmers, truck drivers and workers who connect distant places.',
  'Trace one school lunch item back to where it was grown or made. Draw a chain with at least four links and name one person and one place for each link. Write what could go wrong if one link is cut.'),
L('s2-hsie-y3-w20-l2',GEO,['review','people','environment','showcase'],
  'The people and environments review brings together weather and climate, recording local weather, how climate affects living, resources and wise use, caring for the environment, taking action and how people and places are connected.',
  'Example showcase: a one-page poster with a week of recorded weather, a climate-and-home comparison, a resource-saving plan and a chain showing how a food product reaches us, with sources named.',
  'Match each piece of evidence to the idea it shows: weather record; stilt house; litter chain; bread chain.',
  'Weather record: measuring weather; stilt house: climate and homes; litter chain: cause and effect; bread chain: connected places.',
  'A poster with facts but no data, source or action shows information but not geographic thinking.',
  'Assemble a showcase of your people and environments work. Practise a one-minute talk and list two questions you could investigate next.'),
L('s2-hsie-y3-w21-l1',GEO,['rule','law','safe','fair'],
  'Rules and laws help people live together safely and fairly. A rule is made by a group such as a family or school. A law is made by a government and applies to everyone in that place. Each rule or law has a purpose, and some protect other people as well as ourselves.',
  'Example: "Stop at a red light" is a law that keeps people safe. "Walk on the verandahs" is a school rule that prevents collisions. "Take turns on the swing" is a rule that is fair to everyone.',
  'Match each rule to its purpose: wear a bike helmet; put your hand up in class; line up for the canteen.',
  'Helmet: safety; hand up: everyone can be heard; line up: fairness for those who arrived first.',
  'Believing rules exist only to stop people having fun ignores their purposes of safety, fairness and order.',
  'List six rules from home, school and the community. For each write the purpose and who it protects. Choose one rule and describe what could happen if it did not exist.'),
L('s2-hsie-y3-w21-l2',GEO,['home','school','community','consequence'],
  'Rules differ between home, school and the community because each place has different needs and different people who make and enforce them. Some rules are similar everywhere, such as keeping others safe. Consequences should match the rule that was broken.',
  'Example table: Home: bedtime set by carers; consequence is a calm talk and an earlier night. School: walk in corridors set by the school; consequence is a reminder or loss of play time. Community: wear a bike helmet is a law; consequence can be a fine for adults.',
  'Sort into home, school or community: homework time; walk in corridors; dogs on a lead in the park.',
  'Home: homework time. School: walk in corridors. Community: dogs on a lead in the park.',
  'Thinking a rule is the same everywhere ignores that places have different needs and different rule makers.',
  'Compare rules in three places you belong to. Write one rule from each, who sets it, why and a fair consequence. Find one rule that appears in all three with different wording.'),
L('s2-hsie-y3-w22-l1',GEO,['fairness','rights','equal','needs'],
  'Fairness means treating people justly, which is not always the same as treating everyone exactly the same. Rights are things every child is entitled to, such as being safe, learning, being heard and playing. The United Nations Convention on the Rights of the Child lists these rights.',
  'Example: giving everyone the same shoe size is not fair, because feet are different sizes. Fair means each person gets shoes that fit. The right to learn means every child has access to school, and the right to be heard means adults listen to children\'s views.',
  'Is it fair if everyone in the class is given the same pair of glasses? Why or why not?',
  'No. People need different glasses to see well. Fairness means each person gets what meets their needs.',
  'Thinking fair always means exactly the same ignores that people have different needs.',
  'Choose three children\'s rights. For each write a situation that shows the right being met, who helps provide it and one example where fair does not mean the same.'),
L('s2-hsie-y3-w22-l2',GEO,['responsibility','right','school','charter'],
  'Every right has a matching responsibility. The right to learn comes with a responsibility to let others learn, and the right to feel safe comes with a responsibility to be kind. A class charter lists rights with matching responsibilities that everyone agrees to follow.',
  'Example charter lines: Right: I can learn without being interrupted. Responsibility: I wait for my turn and keep my voice quiet during work time. Right: I can play safely. Responsibility: I follow the playground rules and include others.',
  'Match each right to its responsibility: to be listened to; to use shared equipment; to be safe.',
  'Listen to others when they speak; take care of shared equipment and return it; follow safety rules and tell an adult about danger.',
  'Thinking rights are only about what I receive ignores the responsibilities that protect other people\'s rights.',
  'Write a class charter with four rights and matching responsibilities. For each say how a student can show it in the classroom or playground, and how a teacher can see it.'),
L('s2-hsie-y3-w23-l1',GEO,['council','state','federal','government'],
  'Different people make rules in different places. Carers make rules at home, and the principal and teachers make rules at school. Local councils make local laws, state governments make state laws and the federal government makes laws for the whole country. Police enforce laws and courts decide when a law has been broken.',
  'Example: dogs must be on a lead in a park is a local council law. Speed limits on roads are set by the state government. Passports are a federal matter. A court hears a case when someone is said to have broken the law.',
  'Which level of government is most likely to make each: parking rules in the town centre; school starting age in the state; the rules for passports?',
  'Local council: parking in the town centre; state government: school starting age; federal government: passports.',
  'Believing one person or group makes all rules ignores that home, school and three levels of government each have roles.',
  'Find one rule or service from each level of government using a reliable source such as a council website. Record who makes it and why. Draw a diagram showing who makes rules at home, at school and in government.'),
L('s2-hsie-y3-w23-l2',GEO,['vote','majority','propose','review'],
  'A fair way to make or change a class rule is to discuss it, propose a clear wording, vote, accept the majority and then review how it is working. A majority is more than half the votes.',
  'Example: a class of 25 votes on a quiet signal. 18 vote yes and 7 vote no, which is a majority, so they try it for two weeks and then review. The class also listens to the 7 people who voted no to see whether the rule can be improved.',
  'In a vote, 12 say yes and 9 say no. How many votes in total, and is it a majority?',
  '21 votes in total. 12 is more than half of 21, which is 10.5, so it is a majority.',
  'Treating the loudest voice as the decision, or ignoring people who voted no, is not a fair rule-making process.',
  'Propose a change to a rule at home or in your class. Write the rule, the reason, ask at least ten people to vote, record the tally, state the decision and plan a review date. Say how you listened to the minority.'),
L('s2-hsie-y3-w24-l1',GEO,['law','court','police','consequence'],
  'Laws are made by parliaments and apply to everyone. When a law is broken police may investigate, and a court decides what happened and what consequence is fair. Consequences should fit the law that was broken, and everyone should be treated equally.',
  'Example: a driver who is caught speeding gets a fine. For a more serious case, a court with a magistrate or judge listens to both sides and decides. The person is allowed to have a lawyer. Parliament makes the laws, police enforce them and courts decide.',
  'Match each to its job: parliament; police; court.',
  'Parliament makes laws; police enforce laws and keep people safe; courts decide whether a law was broken and what consequence is fair.',
  'Thinking the police make the laws mixes up making laws with enforcing them.',
  'Draw a flow chart showing a law being made, broken, investigated and decided. Write two sentences on why it matters that everyone is treated equally under the law.'),
L('s2-hsie-y3-w24-l2',GEO,['conflict','listen','solution','fair'],
  'Conflicts can be resolved fairly by stopping and calming down, taking turns to say what happened and how you feel, listening without interrupting, thinking of solutions together and choosing one both people can accept. Ask an adult if anyone is unsafe or if you cannot agree.',
  'Example: two students want the same ball. One says, "I feel upset when the ball is taken without asking, and I would like us to take turns." The other listens, then suggests ten minutes each. They agree and tell the teacher.',
  'Rewrite "You always cheat!" as an I-statement that says what happened, how you feel and what you want.',
  'For example: "I felt upset when the game rules changed in the middle, and I would like us to agree on the rules before we start."',
  'Blaming with "you always" statements makes the other person defend themselves instead of listening.',
  'Write a short script showing four steps of fair conflict resolution, two possible solutions and the agreement chosen. Practise it with a family member.'),
]

VISUALS = {
 's2-hsie-y3-w19-l1': [pair_visual('Litter dropped','washes into the creek','Effect','animals harmed, dirty water','Cause and effect chain for litter.','Actions must match the cause.'),
  pair_visual('Fix the cause','more bins, take litter home','Not the cause','painting a fence','Matching action to cause.','Choose a safe, supervised action.')],
 's2-hsie-y3-w19-l2': [pair_visual('Goal','fewer bottles on the oval','Measure','count before and after','A measurable community goal.','Permission first.'),
  pair_visual('Steps','ask, count, poster, count again','Vague','make the park better','A planned steps list beside a vague goal.','Say how you will measure change.')],
 's2-hsie-y3-w20-l1': [pair_visual('Wheat','farm, mill, bakery, shop','Chain','many people and places','A connected chain for bread.','Every link has a person and place.'),
  pair_visual('Bananas','Queensland farms','Shops','other states','Food moving between places.','If one link breaks, the chain stops.')],
 's2-hsie-y3-w20-l2': [pair_visual('Weather','measured each day','Home','climate and houses','Evidence from the unit.','Name the source.'),
  pair_visual('Resource','wise use plan','Chain','how food is connected','More evidence from the unit.','Use data in the talk.')],
 's2-hsie-y3-w21-l1': [pair_visual('Rule','made by a group','Law','made by government','Rules and laws compared.','Both have a purpose.'),
  pair_visual('Helmet','safety','Line up','fairness','Purposes of rules.','Who does it protect?')],
 's2-hsie-y3-w21-l2': [pair_visual('Home','bedtime set by carers','School','walk in corridors','Rules at home and school.','Different makers, different needs.'),
  pair_visual('Community','dogs on a lead','Consequence','fits the rule broken','Community rules and fair consequences.','Match the consequence to the rule.')],
 's2-hsie-y3-w22-l1': [pair_visual('Same shoes?','everyone gets size 5','Fair','shoes that fit each person','Equal and fair are different.','Fair meets different needs.'),
  pair_visual('Rights','safe, school, heard, play','Convention','United Nations list','Children\'s rights.','Rights belong to every child.')],
 's2-hsie-y3-w22-l2': [pair_visual('Right','to study','Responsibility','let others study','A right with its responsibility.','Every right has a partner.'),
  pair_visual('Right','to be safe','Responsibility','be kind and follow rules','Safety right and responsibility.','Show it in daily actions.')],
 's2-hsie-y3-w23-l1': [pair_visual('Local council','dogs on a lead','State','speed limits','Levels of government and laws.','Match the rule to the level.'),
  pair_visual('Federal','passports','Courts','decide if a law is broken','Federal laws and the role of courts.','Making, enforcing and deciding are different jobs.')],
 's2-hsie-y3-w23-l2': [pair_visual('Vote','18 yes, 7 no','Majority','more than half','A class vote tally.','Majority means more than half.'),
  pair_visual('Review','after two weeks','Listen','to the 7 who said no','Reviewing a rule after a vote.','Listen to the minority.')],
 's2-hsie-y3-w24-l1': [pair_visual('Parliament','makes laws','Police','enforce laws','Making and enforcing laws.','Different jobs in a fair system.'),
  pair_visual('Court','hears both sides','Consequence','fits the law broken','The role of a court.','Everyone is treated equally.')],
 's2-hsie-y3-w24-l2': [pair_visual('You always cheat','blames','I-statement','what, how I feel, what I want','Blame and an I-statement.','Start with I feel and I would like.'),
  pair_visual('Solutions','take turns, ten minutes each','Adult help','if unsafe or stuck','Solutions and when to ask for help.','Agree together.')],
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
            bundle = build_from_spec(base, u, VISUALS[u['seed_key']], subject='hsie')
            atomic_json(ROOT / 'lesson-pipeline/authored' / f"{u['seed_key']}.json", bundle)
            print('Written Core hsie bundle:', u['seed_key'])
    finally:
        db.close()

if __name__ == '__main__':
    create()
