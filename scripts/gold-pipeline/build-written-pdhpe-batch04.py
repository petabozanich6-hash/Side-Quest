#!/usr/bin/env python3
"""Year 3 PDHPE Written Core batch 04: friendships, games and sports w19-l1 through w24-l2 (12)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

MSP, IHW, SMI, RRS1 = 'PH2-MSP-01', 'PH2-IHW-01', 'PH2-SMI-01', 'PH2-RRS-01'

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, subject='pdhpe', vocab=vocab,
                principle=principle, model=model, guided=guided, feedback=feedback,
                misconception=misconception, independent=independent)

LESSONS = [
L('s2-pdhpe-y3-w19-l1', RRS1, ['a disagreement', 'calming down', 'an I statement', 'a fair solution'],
  "Disagreements are normal when people have different ideas. A fair way to solve one is: stop and calm down, say what happened using an 'I' statement, listen to the other person, think of options together and choose one that is fair to everyone. If the problem is too big, or someone is unsafe or being hurt, ask a trusted adult for help. Hurting people or things never solves a disagreement.",
  "Example: two children both want the last turn on the swing. Step 1: calm down with a slow breath. Step 2: 'I feel upset because I wanted a turn.' Step 3: listen ('I only had one go'). Step 4: options (take turns, 10 swings each, ask a teacher). Step 5: choose 10 swings each, then swap. They say thank you.",
  "Two friends disagree about who owns a drawing they made together. Write the first two steps of a fair solution, using an 'I' statement.",
  "Step 1: stop and breathe. Step 2: 'I feel worried because I put a lot of work into the drawing and I would like us to decide together.' This begins calmly and shares the problem without blame.",
  "Thinking that the loudest person, or the winner of an argument, has solved it. A good solution is one that both people can accept.",
  "Write a five-step disagreement plan as a flowchart and use it on two made-up problems (a game rule and a shared item). For each, write a fair solution and name when an adult must help."),
L('s2-pdhpe-y3-w19-l2', RRS1, ['conflict role play', 'a stop signal', 'swapping roles', 'a calm tone'],
  "Conflict role plays let us practise calm words and fair solutions in made-up situations. Players stay in role for a short time, use a respectful tone and then step out to talk about what worked. Stay safe by using pretend situations, no touching and an agreed 'stop' signal. Swapping roles helps us understand the other person's feelings.",
  "Example: A says, 'You've had the ball for ages and I feel left out. Can we take turns?' B says, 'Okay, I'll pass it to you after five throws.' They step out and talk: the 'I' statement and calm tone worked, and the number made the offer clear. Stop signal: a raised hand.",
  "In a role play someone says, 'You always ruin games!' Rewrite it as an 'I' statement and add a request.",
  "Rewrite: 'I felt upset when the game stopped and I would like us to start again.' It names the feeling and the event, has no 'always' or put-down, and asks for something clear.",
  "Thinking conflict role plays should be loud or rude to look real. Practise respectful words so they become easy to use in real life.",
  "Write and perform three conflict role plays with a family member (sharing equipment, a rule disagreement and a misunderstanding). Use an 'I' statement and a calm tone in each, agree a stop signal, swap roles and write what you would change."),
L('s2-pdhpe-y3-w20-l1', RRS1, ['kindness', 'community', 'a safe act', 'asking first'],
  "Kindness is thinking about other people's needs and acting to help. Acts of kindness in a community include helping a neighbour, welcoming a newcomer, thanking workers, tidying shared spaces and sharing time or food with people in need. Kind actions work best when they are safe, respect the other person's wishes and do not expect anything back. Small acts can make a big difference.",
  "Example: Kia writes a kindness plan. Thank the bus driver (safe: say it while getting off). Collect litter in the park with an adult (safe: wear gloves). Draw cards for an aged care home (safe: an adult delivers them). Effect: three people feel appreciated. She asks 'Would you like help?' before carrying a neighbour's bags.",
  "Write one safe act of kindness for a lonely neighbour and one way to ask first so you respect their wishes.",
  "Act: draw a card and have an adult deliver it. Asking: 'Would you like a card, or a visit, from me?' Respecting wishes makes the kindness welcome, and an adult keeps it safe.",
  "Thinking kindness has to cost money or be big. Words, time and small actions are kind too.",
  "Plan a one-week kindness project for your community with five actions (home, school, neighbourhood). For each, name who it helps, how it is safe and who would help you. Do at least two and record how people responded."),
L('s2-pdhpe-y3-w20-l2', RRS1, ['a showcase', 'linking ideas', 'an example', 'two stars and a wish'],
  "A friendship showcase brings together what makes a good friend, respectful communication, including others, solving disagreements and community kindness. Choose a format (poster, comic strip, role play performance or talk) and include a real-style example and a reason for each idea. Audience members listen respectfully and give two stars and a wish.",
  "Example: a four-panel comic called 'The new student'. Panel 1: an invitation to join. Panel 2: a respectful disagreement about a game ('I see it differently'). Panel 3: calm steps that solve it. Panel 4: kindness, a thank-you note. Each panel has a one-sentence reason.",
  "Write one sentence that links two unit ideas, such as including others and respectful communication.",
  "Sample: 'When I include someone with a friendly invitation, my respectful words show that they matter.' The sentence links two ideas and gives the connection.",
  "Thinking a showcase only needs pictures. Reasons and examples show that you understand the ideas.",
  "Create a showcase about friendship and respect with five parts: good friend qualities, respectful words and tone, including others, a disagreement solution and a kindness act. Present it to a family member and write two stars and a wish."),
L('s2-pdhpe-y3-w21-l1', MSP, ['rules', 'fair play', 'sportsmanship', 'honesty'],
  "Rules make games safe and fair. Fair play means following the rules, taking turns, including others and being honest. Sportsmanship means showing respect when winning or losing: saying 'good game', accepting referee decisions, shaking hands where that is comfortable and encouraging teammates. Everyone, including referees and opponents, deserves respect.",
  "Example: in a game, Maya notices her foot touched the line when she served and says, 'That was a fault, your serve.' After losing 5 to 8 she says, 'Good game, well played.' Unsportsmanlike would be arguing with the referee or taunting the other team.",
  "A player steps out of bounds before scoring, but the referee did not see it. What is the fair play choice, and what would a good sport say to the other team after losing?",
  "Fair play: tell the referee so the point is not counted. After losing, a good sport says, 'Good game' and may shake hands. Honest play matters more than winning.",
  "Believing winning is the only goal of sport. Fair play, effort and respect matter at least as much as the score.",
  "Write a Sports Code of Conduct with six rules for players, spectators and officials. For each rule, write a good example and a poor example. Add how a good sport responds to a loss and to a win."),
L('s2-pdhpe-y3-w21-l2', MSP, ['an invasion game', 'a modified game', 'small teams', 'no contact'],
  "Invasion games, such as netball-style, soccer-style or basketball-style games, have teams trying to move a ball into a goal area. Modified games use smaller teams, softer balls, simpler rules and smaller spaces so every player gets more touches and stays safe. Common modifications: no contact, no tackling, a set number of passes before a shot and goalkeepers who rotate.",
  "Example game 'Four-pass goal': teams of 3 on a 10 by 15 metre area. Rules: no contact, no running with the ball, a goal counts only after 4 passes and every player must touch the ball. Bibs mark the teams. After round 1 they add a rule that defenders stay an arm's length away.",
  "In a modified invasion game, one team keeps scoring. Suggest two changes to the rules or teams that keep the game fair and fun.",
  "Mix the teams so abilities are balanced, add a rule that every player must pass before shooting, or change scoring so goals after many passes score more. Modifying rules protects fairness and keeps all players involved.",
  "Thinking modified games are 'baby' games. Modifying rules improves skills and safety, and teams at every level practise with small-sided games.",
  "Plan a modified invasion game for 6 players using a soft ball. Write the area size, team sizes, scoring, three safety rules and two modifications. Play it and record the score for two rounds and one rule you changed."),
L('s2-pdhpe-y3-w22-l1', MSP, ['teamwork', 'team roles', 'communication calls', 'rotating roles'],
  "Teams work best when each person has a role and everyone communicates. Roles can include attacker, defender, goalkeeper, captain, scorer or encourager. Good teammates use clear calls such as names, 'Pass!' and 'Mine!', encourage each other, share the ball and accept decisions fairly. Roles can rotate so everyone can try them.",
  "Example: a team of four has a captain who organises positions, two attackers who pass often, one defender who calls 'Mine!' and an encourager who gives praise. They rotate roles each round. Result: more passes, fewer arguments, and each player scores a point.",
  "A team keeps losing the ball because everyone chases it. Suggest two roles or rules that could help.",
  "Give some players set positions (defender and attacker) and add a rule that only two players chase the ball. Calling 'Mine!' avoids collisions. Clear roles share the work and help communication.",
  "Believing the best player should do everything. Passing and using every role makes the whole team stronger.",
  "Plan a team of four with four roles, three communication calls and a rotation rule. Draw a diagram of positions. Use the plan in a game with family and record what worked and what to change."),
L('s2-pdhpe-y3-w22-l2', MSP, ['passing and moving', 'open space', 'keeping the ball', 'calling for the ball'],
  "Passing and moving is a team strategy: after you pass, move into an open space so you can receive the ball again. This keeps the ball moving, makes defenders move and helps the team keep possession. Use clear communication ('Here!') and pass to open teammates, not just to friends. Keep the game safe with no contact, soft balls and enough space.",
  "Example: in a 3 versus 1 passing game, Eli passes to Ava and then runs into an empty space on the left. Ava passes back to Eli in the space, and they keep the ball for 8 passes. The defender cannot intercept because the ball keeps moving to open players.",
  "A player passes the ball and then stands still. Describe what the player should do next and why.",
  "They should move into an open space and call 'Here!' so they are available for the next pass. Moving after passing keeps the ball moving and gives teammates more options.",
  "Thinking the person who passes has finished their job. Moving to a new space keeps them part of the play.",
  "Set up a small passing game for 3 or 4 players (3 versus 1 works well). Practise 'pass and move' for 3 rounds. Record the longest run of passes and describe where players moved to get open."),
L('s2-pdhpe-y3-w23-l1', MSP, ['strategy', 'using space', 'spreading out', 'closing gaps'],
  "Strategy is a plan to help a team succeed. In games, using space means moving into open areas, spreading out to make room for passes and closing gaps when defending. Strategies are decided before the game and changed during it based on what is happening. A good strategy is fair, uses everyone and follows the rules.",
  "Example: a team of three plays against another team of three. Strategy: spread out in a triangle to give passing options, move to empty space after passing and close the gap between defenders when the other team has the ball. After round 1 they see the left side is empty and move a player there.",
  "A team bunches together near the goal. Suggest a strategy that uses space better and say why it works.",
  "Spread out so passes can go to open teammates and defenders have more ground to cover. Bunching means one defender can mark everybody. Spreading uses the whole space.",
  "Believing the ball should always go to the player closest to the goal. Passing to open space or to a free teammate often works better.",
  "Draw a game space and plan two strategies for attack and two for defence. Play a mini game with family, use each strategy, record what happened in a table and choose the strongest."),
L('s2-pdhpe-y3-w23-l2', MSP, ['finding space', 'defending', 'goal side', 'safe defending'],
  "In invasion games, players without the ball find space by moving away from defenders and calling for the ball. Defenders stay between the attacker and the goal, face the ball, keep an arm's length away and watch where the ball will go. Defending does not mean pushing, grabbing or tackling. All contact rules must be followed.",
  "Example: Mia, without the ball, runs into an empty space and calls 'Here!'. Ben defends by standing between Mia and the goal, an arm's length away, knees bent, eyes on the ball. When Mia gets the ball, Ben stays goal side. No contact is used.",
  "A defender runs at the attacker and grabs their bib. What is the problem, and what should the defender do instead?",
  "Grabbing is unsafe and against the rules. The defender should stay an arm's length away, keep between the attacker and the goal and block the pass with their body position.",
  "Thinking the best defender is the roughest one. Safe defending uses position and teamwork, not force.",
  "Play a 2 versus 2 or 3 versus 3 no-contact game with family. Practise finding space and defending using the cues. Record two times you found space and two times you defended well, and one rule you would add for safety."),
L('s2-pdhpe-y3-w24-l1', MSP, ['evaluating a game', 'criteria', 'evidence', 'changing one rule'],
  "Evaluating a game means judging how well it works using criteria such as safety, fairness, fun and skill practice. Collect evidence (scores, observations, player comments), find strengths and problems and then change one rule at a time to improve it. After the change, play again to see whether it worked.",
  "Example: evaluating 'Four-pass goal'. Safety: 4 out of 5 (some bumping). Fairness: 3 (one team stronger). Fun: 5. Skill practice: 4. Evidence: the score was 6 to 1. Change: mix the teams. Replay: 4 to 3 and both teams enjoyed it. The change improved fairness.",
  "A game's evaluation shows low fairness because the same player always scores. Suggest one rule change and the evidence you would collect to test it.",
  "Rule: everyone must pass to a new player before a shot. Evidence: count how many different players score in the next round and ask the players whether it felt fairer.",
  "Believing that changing many rules at once will make a game better. Change one thing at a time so you can tell what worked.",
  "Evaluate a game you play using the four criteria with scores from 1 to 5 and evidence. Change one rule, replay and record the new scores. Write a sentence about whether your change helped."),
L('s2-pdhpe-y3-w24-l2', MSP, ['designing a game', 'a game goal', 'scoring', 'adjustments'],
  "Designing a new game uses what we know about skills, rules, safety, fairness and inclusion. A game design needs a name, a goal, equipment, space, rules, a scoring system, safety rules and a way to adjust the game for different abilities. Test the game, ask for feedback and revise.",
  "Example design 'Space Raiders': 2 teams of 3, soft balls, a 12 by 12 metre area with 4 hoops. Goal: bounce-pass the ball into a hoop. Rules: no contact, three steps with the ball, every player touches the ball. Scoring: 1 point per hoop. Safety: bibs and no running into hoops. Adjustment: hoops can be moved closer.",
  "Write two rules and one adjustment for a new game that uses throwing and catching so that everyone can join in.",
  "Rules: pass before you shoot; no throwing at people. Adjustment: use a lighter ball or shorter distances. These make the game safe, fair and inclusive.",
  "Thinking a good game has the most complicated rules. Simple, clear rules usually work best.",
  "Design and write the rules for a new game for 4 to 6 players. Include a name, goal, equipment, space, rules, scoring, safety rules and two adjustments. Play it with family and write down one change after testing."),
]

VISUALS = {
 's2-pdhpe-y3-w19-l1': [pair_visual('Calm','stop and breathe','Say it','I feel upset because','First steps in solving a disagreement.','Calm first, then speak.'),
  pair_visual('Options','take turns, 10 swings each','Adult help','if someone is unsafe','Options and when to ask an adult.','Pick a fair option.')],
 's2-pdhpe-y3-w19-l2': [pair_visual('Blame','you always ruin games','I statement','I felt upset when','Blame and an I statement.','Name the feeling.'),
  pair_visual('Stop signal','raised hand','Swap','play the other role','Role play safety.','Agree a stop signal.')],
 's2-pdhpe-y3-w20-l1': [pair_visual('Ask first','Would you like a card?','Safe','an adult delivers it','Kindness that is safe.','Ask before helping.'),
  pair_visual('Small acts','thank the bus driver','Shared space','pick up litter with gloves','Community kindness acts.','Small acts count.')],
 's2-pdhpe-y3-w20-l2': [pair_visual('Comic','four panels, four ideas','Reasons','one sentence for each','A friendship showcase comic.','Give reasons.'),
  pair_visual('Link','include and respect','Star','clear voice','Linking ideas and feedback.','Link two ideas.')],
 's2-pdhpe-y3-w21-l1': [pair_visual('Fair play','I stepped out, your serve','Good sport','good game','Fair play and good sportsmanship.','Be honest.'),
  pair_visual('Unsporting','taunting the other team','Respect','accept the referee','Unsporting and respectful acts.','Respect everyone.')],
 's2-pdhpe-y3-w21-l2': [pair_visual('Small area','10 by 15 metres','Teams of 3','every player touches ball','A modified invasion game.','More touches for all.'),
  pair_visual('No contact','arm length away','Four passes','before a goal','Modified game rules.','Rules keep it safe.')],
 's2-pdhpe-y3-w22-l1': [pair_visual('Roles','captain, attacker, defender','Calls','Mine, Pass, Here','Team roles and calls.','Everyone has a role.'),
  pair_visual('Everyone chases','collisions','Set positions','space and passes','Chasing and positions.','Spread the work.')],
 's2-pdhpe-y3-w22-l2': [pair_visual('Pass','give the ball','Move','run to open space','Pass and move.','Move after passing.'),
  pair_visual('Standing','easy to defend','Moving','ball stays moving','Standing and moving.','Keep the ball moving.')],
 's2-pdhpe-y3-w23-l1': [pair_visual('Bunched','one defender covers all','Spread out','passes have room','Bunching and spreading.','Use the whole space.'),
  pair_visual('Attack','triangle, move after pass','Defence','close the gaps','Attack and defence strategy.','Plan both ends.')],
 's2-pdhpe-y3-w23-l2': [pair_visual('Find space','move away and call Here','Defend','between attacker and goal','Finding space and defending.','Stay goal side.'),
  pair_visual('Grabbing','unsafe, against rules','Position','arm length, eyes on ball','Unsafe and safe defending.','Use position, not force.')],
 's2-pdhpe-y3-w24-l1': [pair_visual('Criteria','safety, fairness, fun, skill','Evidence','scores and comments','Game evaluation criteria.','Use evidence.'),
  pair_visual('Before','fairness 3 out of 5','After','fairness 4 out of 5','A rule change and results.','Change one rule.')],
 's2-pdhpe-y3-w24-l2': [pair_visual('Design','name, goal, rules, scoring','Safety','no contact, bibs','Parts of a game design.','Include every part.'),
  pair_visual('Adjust','closer hoops','Include','lighter ball','Adjusting a game for all.','Adjust so all can play.')],
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
