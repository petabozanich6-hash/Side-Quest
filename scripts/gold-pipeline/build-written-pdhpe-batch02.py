#!/usr/bin/env python3
"""Year 3 PDHPE Written Core batch 02: movement skills and healthy food w07-l1 through w12-l2 (12)."""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from written_bundle import build_from_spec, pair_visual

MSP, IHW = 'PH2-MSP-01', 'PH2-IHW-01'

def L(seed, code, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(seed_key=seed, code=code, subject='pdhpe', vocab=vocab,
                principle=principle, model=model, guided=guided, feedback=feedback,
                misconception=misconception, independent=independent)

LESSONS = [
L('s2-pdhpe-y3-w07-l1', MSP, ['throwing', 'catching', 'follow through', 'soft hands'],
  "Throwing and catching are fundamental movement skills. For an overarm throw stand side-on to the target, look at the target, step forward with the foot opposite the throwing arm, bring the arm back, release and follow through across the body. To catch, keep your eyes on the ball, hold your hands ready in front, catch with your fingers and let your elbows give so the ball is cushioned. Use a soft ball and make sure nobody is in the throwing path.",
  "Example cues. THROW: 'side-on, step, arm back, throw, follow through'. CATCH: 'eyes on the ball, hands ready, catch and give'. Hamid throws a soft ball at a mark on the wall 2 metres away, steps with the foot opposite his throwing arm and follows through towards the target.",
  "Ella catches by trapping the ball against her chest and often drops it. Suggest two cues that would help her and say why.",
  "Cues: 'eyes on the ball with hands ready' and 'let your elbows give as it lands in your hands'. Hands cushion better than the chest, and giving slows the ball. Hands shaped like a basket make a bigger target.",
  "Thinking a harder throw is a better throw. An accurate, controlled throw with a follow through is easier to catch and safer for everyone.",
  "Using a soft ball (or a rolled-up pair of socks) and a wall target, practise 10 throws and 10 catches at two different distances. Record how many hit the target or were caught, choose one cue to improve and retest. Make sure nobody is in the throwing path."),
L('s2-pdhpe-y3-w07-l2', MSP, ['a throwing game', 'fair rules', 'including everyone', 'adjusting a game'],
  "Throwing and catching games turn skills into play with rules, scoring and teamwork. Good games use soft balls, clear space and rules such as throwing below shoulder height and never at someone's head. Fair games give everyone turns and can be adjusted, for example with a larger or lighter ball, a shorter distance or a seated option, so all players can join in. The goal is to take part and improve, not to show off.",
  "Example game 'Round the circle': five players pass a soft ball around a circle, calling the receiver's name first. Rules: soft throws below the shoulder; pass to someone who has not had the ball yet; goal: 10 passes without a drop. Adaptation: Lily, who uses a wheelchair, catches a larger, lighter ball at the distance she chooses.",
  "A game has a rule that only the best catchers get the ball. Rewrite the rule so the game is fair and say why.",
  "Rewrite: 'Everyone must receive the ball once before anyone receives it twice.' Fair play means every player has turns, so everyone can improve and feels included.",
  "Believing games are only fun if you win. Fun comes from taking part, improving and playing fairly; scores are for the game, not for judging people.",
  "Invent a throwing and catching game for three players using a soft ball and a target. Write the rules, the scoring, two safety rules and two ways to adjust the game for different abilities. Play two rounds and record how well the rules worked."),
L('s2-pdhpe-y3-w08-l1', MSP, ['striking', 'bouncing', 'eyes on the ball', 'control'],
  "Striking and bouncing are fundamental movement skills. To strike a ball or balloon, stand side-on, keep your eyes on the object, swing level and follow through. To bounce a ball, use your fingertips (not a flat palm), push the ball down to about waist height, keep it slightly to the side of your body and lift your head so you can see what is around you. More force does not give more control; steady timing does.",
  "Example cues. STRIKE: 'side-on, eyes on the ball, swing level, follow through'. BOUNCE: 'fingertips, push to waist height, ball beside you, head up'. Noah bounces a ball and counts 8 bounces before it escapes, then bounces again with his eyes up and reaches 14.",
  "Chloe bounces the ball with a flat, stiff hand and the ball bounces too high and rolls away. Write two cues that would help and say why.",
  "Cues: 'use your fingertips, not your palm' and 'push the ball down to waist height'. Fingertips give control and a lower, steady bounce, so the ball stays close.",
  "Thinking that hitting or bouncing harder gives more control. More force sends the ball farther away; control comes from technique and timing.",
  "Using a bouncing ball and a soft object to strike (a balloon works well indoors), practise 20 bounces with each hand and 10 gentle strikes. Record your best streak for each, choose one cue and retest. Use a clear space away from breakable things."),
L('s2-pdhpe-y3-w08-l2', MSP, ['a striking game', 'a bouncing game', 'safe distance', 'taking turns'],
  "Striking and bouncing games combine skills with rules, scoring and safe equipment. Balloon volleyball, bounce-and-catch relays and target striking are examples. Fair play includes agreeing on the rules before starting, taking turns, keeping safe distances from bats or racquets and encouraging everyone. Rules can be changed so that every player can join in.",
  "Example game 'Balloon volley': two teams of two keep a balloon above a line of chairs using open hands. Rules: score one point when the balloon lands on the other side; strike with hands only; no running into others. Change for inclusion: players may play seated, or hit the balloon twice.",
  "A bounce relay lets players carry the ball in their arms to be faster. Which rule keeps the skill practice meaningful and which keeps it safe?",
  "Meaningful rule: the ball must bounce at least once every second step. Safe rule: walk or jog, keep lanes separate and wait until the person ahead has finished. The rules protect both the skill and the players.",
  "Thinking that bending the rules a little is fine if nobody notices. Fair play means following the rules even when no one is watching, because it keeps the game fair and safe.",
  "Design a striking or bouncing game for two or three players. Write the rules, how to score, two safety rules and a change for a player who cannot stand for long. Play it and note which rule you changed and why."),
L('s2-pdhpe-y3-w09-l1', MSP, ['kicking', 'trapping', 'a pass', 'balance'],
  "Kicking and trapping are fundamental movement skills. To pass with the inside of the foot, look at the ball, plant your standing foot beside it, swing your kicking leg and follow through towards your target. To trap, put your foot out to meet the ball and let it give on contact so the ball stops close to you. Accurate, controlled passes are more useful than very hard kicks. Keep kicks gentle near people and objects.",
  "Example cues. KICK: 'eyes on the ball, plant foot beside it, swing, follow through'. TRAP: 'foot out, ball arrives, cushion and stop'. Isla passes with the inside of her foot to a partner 3 metres away, and the partner traps it with the inside of the foot.",
  "Max kicks the ball with his toes and it flies off sideways. Write two cues for a more accurate pass and say why.",
  "Cues: 'plant your standing foot beside the ball' and 'use the inside of your foot and follow through towards your partner'. A wide, flat contact surface gives control, and the follow through points the ball.",
  "Believing a hard kick is better than a pass. In most games an accurate pass that a teammate can control is more useful than a very hard kick.",
  "With a soft ball (or rolled-up socks if indoors), practise 10 passes and traps against a wall or with a partner at 3 metres, then at 5 metres. Record how many you controlled, choose one cue and retest. Keep the kicks gentle near people and objects."),
L('s2-pdhpe-y3-w09-l2', MSP, ['a kicking game', 'passing', 'roles', 'teamwork'],
  "Kicking games let us use passing and trapping with a purpose. Triangle passing, target goals and keep-the-ball-moving challenges improve accuracy and teamwork. Safe games use soft balls, space between groups and rules such as kicking below knee height. Everyone should have a role they can do, such as passing, retrieving, counting or scoring.",
  "Example game 'Triangle pass': three players stand 4 metres apart and pass in order, trapping before each pass. Goal: 12 passes in a row. Rule: below knee height. Inclusion: a player who prefers not to kick rolls the ball by hand and calls the count.",
  "In a goal-kicking game, one player always takes the shots while the others just wait. Suggest a rule that keeps everyone active and explain why.",
  "Rule: 'Everyone must touch the ball before a shot', or rotate the shooter after each goal. This keeps all players involved, develops passing and shows fair play.",
  "Thinking the best player should take all the kicks so the team wins. Teams improve and enjoy the game when everyone gets turns.",
  "Create a kicking and trapping game for three players with rules, a scoring idea, two safety rules and two roles for players with different abilities. Play two rounds, record your score and decide one rule to change."),
L('s2-pdhpe-y3-w10-l1', MSP, ['a mini game', 'combining skills', 'a boundary', 'changing a rule'],
  "A mini game combines skills such as running, throwing, catching, bouncing and kicking, and adds rules, space and a purpose. Good mini games have a clear goal, simple rules, a safe boundary, fair teams and a way for everyone to take part. After playing, players review what worked and change a rule to improve the game.",
  "Example mini game 'Collect and deliver': in a marked 10 metre square, players run to get a soft ball, bounce it twice, pass to a partner who catches it and places it in a hoop. Rules: walk when carrying the ball; wait your turn; 1 point per delivery. After round 1 they widen the hoop to make scoring more even.",
  "A mini game ends with arguments about who scored. Add one rule or role that makes scoring fair.",
  "Add a scorekeeper who counts out loud, or agree that a goal counts only when the ball is in the hoop. Clear scoring rules prevent arguments and keep the game fair.",
  "Believing a mini game is only about winning. A good game is safe, fair and fun for all players, and winning is just one part.",
  "Plan and play a mini game that combines at least three skills from this unit. Write the goal, rules, boundary, scoring and safety rules, then play two rounds. Record one change you made after round one and whether it helped."),
L('s2-pdhpe-y3-w10-l2', MSP, ['a showcase', 'cue words', 'evidence of progress', 'a next goal'],
  "A movement showcase shows technique and understanding. Use cue words to describe what you do, such as 'bend knees, land softly', and show a skill while saying why the cues help. Reviewing the unit means naming skills you improved with evidence such as recorded scores, and setting one next goal. Audience members cheer kindly and offer two stars and a wish.",
  "Example showcase: Zara demonstrates a catch while saying 'eyes on the ball, hands ready, give'. Evidence: her recording sheet shows 4 out of 10 in Week 7 and 8 out of 10 in Week 9. Next goal: catch from 5 metres. Audience feedback. Star: steady eyes. Wish: step forward when throwing.",
  "Write two cue words for a skill from this unit and one piece of evidence that shows improvement.",
  "Sample: cues 'side-on, step, follow through' and evidence 'my wall target hits went from 3 to 7 out of 10'. Evidence uses numbers or clear observations, and cues describe the technique.",
  "Thinking only the best performers can have a showcase. Everyone can show progress against their own starting point.",
  "Plan a two-minute showcase of three movement skills from this unit. For each, write two cues, show or describe the skill and give one piece of evidence of improvement. Share it with a family member and record two stars and a wish."),
L('s2-pdhpe-y3-w11-l1', IHW, ['the five food groups', 'variety', 'nutrients', 'a food group'],
  "The Australian Guide to Healthy Eating sorts foods into five groups: vegetables and legumes or beans; fruit; grain (cereal) foods such as bread, rice and pasta, mostly wholegrain; lean meat, poultry, fish, eggs, tofu, nuts, seeds and legumes; and milk, yoghurt, cheese or alternatives. Each group gives the body different nutrients, so eating a variety from all five groups supports growth, energy and health.",
  "Example: a lunch of a wholegrain sandwich with chicken and salad, an apple and a small tub of yoghurt. Grain: bread. Lean meat group: chicken. Vegetables: salad. Fruit: apple. Milk group: yoghurt. All five groups appear, so the lunch has variety.",
  "Sort these foods into groups: carrots, brown rice, scrambled eggs, banana, cheese. Name the group for each.",
  "Carrots: vegetables. Brown rice: grain foods. Eggs: lean meat, eggs, tofu, nuts and legumes group. Banana: fruit. Cheese: milk, yoghurt and cheese group. Each food goes in the group that matches the nutrients it gives.",
  "Thinking one 'superfood' can replace the other groups. Bodies need variety from all five groups, because different foods give different nutrients.",
  "List everything you ate yesterday and sort it into the five groups. Mark any group that was missing and suggest two foods you could add tomorrow. Families eat different foods for cultural, religious, medical or allergy reasons, so choose foods that suit yours and share only what you like."),
L('s2-pdhpe-y3-w11-l2', IHW, ['mixed foods', 'ingredients', 'a label', 'sometimes foods'],
  "Sorting foods needs careful thinking because many foods are mixed, such as pizza, a stir-fry or a sandwich. To sort a mixed meal, look at each ingredient and put it in its own group. Packaged foods have ingredient lists that help. Foods that do not fit any of the five groups, such as lollies or cakes, are 'sometimes foods', which are eaten less often and in small amounts.",
  "Example: a chicken and vegetable stir-fry with rice. Chicken: lean meat group. Broccoli and carrot: vegetables. Rice: grain foods. Soy sauce is only a flavouring. The meal has three groups; adding fruit afterwards makes four.",
  "Sort the parts of a cheese and tomato toastie: bread, cheese, tomato and butter. Which groups does it include?",
  "Bread: grain foods. Cheese: milk, yoghurt and cheese group. Tomato: vegetables. Butter: a small amount of added fat, not one of the five groups. The toastie has three groups.",
  "Believing a mixed food belongs to only one group. Mixed meals may include several groups, so each ingredient is sorted separately.",
  "Choose three mixed meals your family eats. List the ingredients, sort each into a group, and say which groups are present and which are missing. Suggest one change that would add a missing group."),
L('s2-pdhpe-y3-w12-l1', IHW, ['a balanced plate', 'portions', 'fullness signals', 'half and quarter'],
  "A balanced plate is a simple guide for a meal: about half the plate vegetables or salad, a quarter grain foods and a quarter protein foods such as lean meat, fish, eggs or legumes, with fruit and a milk food at other times of the day. Portion sizes depend on age, growth and activity. Listening to fullness signals is part of healthy eating, and we talk about foods by their groups rather than calling people or foods 'bad'.",
  "Example dinner plate: half filled with steamed broccoli and carrot, a quarter with brown rice and a quarter with baked fish. Fruit and yoghurt come later for dessert. Mina eats slowly, listens to her body and stops when she is comfortably full.",
  "Describe how Jack could improve a dinner plate that has mostly pasta and a little sauce, using the balanced plate guide.",
  "Improvement: halve the pasta, add a large serve of vegetables (in the sauce or as salad) and add a protein food such as lean mince, beans or chicken. The plate then has three groups in better balance.",
  "Thinking everyone needs the same portion size. Needs change with age, size, growth and activity, and bodies tell us when they are full.",
  "Draw a balanced dinner plate using real foods your family eats and label each group. Write one change that would make it better balanced and say why, using the words 'half', 'quarter' and 'variety'."),
L('s2-pdhpe-y3-w12-l2', IHW, ['a meal plan', 'a shopping list', 'allergies and needs', 'safe preparation'],
  "Planning a healthy meal means choosing foods from several groups and thinking about cost, time, allergies and what the family enjoys. Steps: decide the meal, list the foods by group, see what you already have, write a shopping list and note safe preparation steps. Adults help with sharp tools and hot items, and anyone with an allergy or medical need follows their own advice.",
  "Example plan for a build-your-own wrap dinner for four. Grain: wholemeal wraps. Protein: shredded chicken and beans. Vegetables: lettuce, tomato and grated carrot. Milk group: grated cheese. Fruit: sliced mango afterwards. Shopping list: wraps, lettuce. Safety: an adult cooks the chicken and uses the knife; children wash the vegetables.",
  "A family has a small shopping budget and one person with a nut allergy. Plan a protein food for the meal that avoids nuts.",
  "Options: eggs, chicken, baked beans or fish. Always read labels for hidden nuts and follow medical advice. A good plan solves the problems (budget and allergy) while keeping variety.",
  "Thinking a healthy meal is always expensive or hard to make. Simple foods such as beans, eggs, seasonal vegetables and oats can be affordable and healthy.",
  "Plan one dinner for your household that includes at least four food groups. Write the menu by group, a shopping list, two safety steps for preparation and one way to adjust for anyone's food needs or allergies. Cook only with an adult."),
]

VISUALS = {
 's2-pdhpe-y3-w07-l1': [pair_visual('Throw','side-on, step, follow through','Catch','eyes on ball, hands give','Throwing and catching cues.','Cues build skill.'),
  pair_visual('Soft hands','elbows give','Stiff hands','ball bounces away','Soft and stiff catching.','Let the hands give.')],
 's2-pdhpe-y3-w07-l2': [pair_visual('Unfair rule','only the best catch','Fair rule','everyone gets a turn','An unfair and a fair rule.','Share the turns.'),
  pair_visual('Larger ball','lighter and easier to catch','Seated','play from a chair','Ways to adjust a game.','Adjust so all can play.')],
 's2-pdhpe-y3-w08-l1': [pair_visual('Strike','side-on, swing level','Bounce','fingertips, waist height','Striking and bouncing cues.','Control beats force.'),
  pair_visual('Fingertips','steady low bounce','Flat palm','ball runs away','Fingertips and flat palm.','Use fingertips.')],
 's2-pdhpe-y3-w08-l2': [pair_visual('Balloon volley','two teams, hands only','Rule','one point per landing','A striking game plan.','Agree rules first.'),
  pair_visual('Safe','keep lanes apart','Fair','take turns','Safety and fairness rules.','Rules protect players.')],
 's2-pdhpe-y3-w09-l1': [pair_visual('Kick','plant foot beside ball','Trap','foot out, cushion, stop','Kicking and trapping cues.','Flat foot, soft stop.'),
  pair_visual('Inside foot','accurate pass','Toes','ball flies sideways','Inside foot and toe kicks.','Use the inside foot.')],
 's2-pdhpe-y3-w09-l2': [pair_visual('Triangle','4 metres apart, pass in order','Goal','12 passes in a row','A triangle passing game.','Pass in turn.'),
  pair_visual('Roles','pass, count, retrieve, score','Rotate','change shooter each goal','Roles for everyone.','Everyone has a role.')],
 's2-pdhpe-y3-w10-l1': [pair_visual('Skills','run, bounce, pass, catch','Rules','walk with ball, wait','A mini game with three skills.','Skills plus rules.'),
  pair_visual('Round 1','arguments about score','Round 2','scorekeeper counts aloud','Changing a rule after play.','Improve one rule.')],
 's2-pdhpe-y3-w10-l2': [pair_visual('Cue words','side-on, step, follow','Evidence','3 of 10 up to 7 of 10','Cue words and evidence of progress.','Show numbers.'),
  pair_visual('Star','steady eyes','Wish','step forward','Audience stars and a wish.','Be specific and kind.')],
 's2-pdhpe-y3-w11-l1': [pair_visual('Group 1','vegetables and legumes','Group 2','fruit','Two of the five food groups.','Each group has a job.'),
  pair_visual('Group 3','grain foods','Group 4 and 5','protein foods, milk foods','The other food groups.','Variety from all five.')],
 's2-pdhpe-y3-w11-l2': [pair_visual('Toastie','bread, cheese, tomato','Groups','grain, milk, vegetables','Sorting a mixed food.','Sort each ingredient.'),
  pair_visual('Sometimes','lollies, cakes','Everyday','fruit, vegetables, grains','Sometimes and everyday foods.','Eat sometimes foods less.')],
 's2-pdhpe-y3-w12-l1': [pair_visual('Half','vegetables and salad','Quarters','grains and protein','A balanced plate.','Half veg, then quarters.'),
  pair_visual('Mostly pasta','one group','Better','three groups','Unbalanced and balanced plates.','Add vegetables and protein.')],
 's2-pdhpe-y3-w12-l2': [pair_visual('List','foods by group','Shop','what we need to buy','From menu to shopping list.','List by group.'),
  pair_visual('Allergy','read labels','Safety','adult uses the knife','Allergy and cooking safety.','Safety comes first.')],
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
