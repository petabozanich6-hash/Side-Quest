#!/usr/bin/env python3
"""Year 7 Drama Written Core: twelve playbuilding lessons that progress.

Catalogue titles stay "Playbuilding". Identity fields come from the baseline.
The continuing fiction is an original lost house key. No published play is used.
Outcome DR4-MAK-01 is proposed only. Written plans are valid evidence.
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / 'scripts' / 'gold-pipeline'))

from elective_batch import write_elective_batch
from written_bundle import pair_visual

CODE = 'DR4-MAK-01'
SOURCE_URL = 'https://curriculum.nsw.edu.au/learning-areas/creative-arts/drama-7-10-2023/outcomes'
SOURCE_NOTE = (
    'Proposed Stage 4 Drama 7-10 (2023) alignment to DR4-MAK-01. '
    'Content-point mapping pending. Not NESA verified.'
)
OUT_DIR = ROOT / 'lesson-pipeline' / 'workers' / 'builder-s4-drama' / 'authored'

# Original classroom fiction used across the unit. Riley needs the spare house
# key to let a younger sibling in after school. Alex is the friend. The office
# shutter is down. The key's hiding place is taught only when tension begins.


def spec(seed, vocab, principle, model, guided, feedback, misconception, independent):
    return dict(
        seed_key=seed,
        code=CODE,
        subject='arts',
        vocab=vocab,
        principle=principle,
        model=model,
        guided=guided,
        feedback=feedback,
        misconception=misconception,
        independent=independent,
    )


def visuals(left, right, alt, caption, left2, right2, alt2, caption2):
    return [
        pair_visual(left[0], left[1], right[0], right[1], alt, caption),
        pair_visual(left2[0], left2[1], right2[0], right2[1], alt2, caption2),
    ]


LESSONS = [
    spec(
        's5-drama-y9-w11-l1',
        ['stimulus', 'audience knowledge', 'given fact', 'mystery'],
        (
            "Audience knowledge is only the facts watchers already have. "
            "A stimulus is the starting idea you agree to build from, and this unit's stimulus is original: a lost house key. "
            "Riley was carrying the spare key so a younger sibling could get inside after school. "
            "After the last bell the key is not in Riley's hand. Alex, a friend, is there too. "
            "A given fact belongs on the opening list when the audience can already tell it, such as the school gate, the missing key, and the sibling who is waiting. "
            "A mystery is a fact you are saving. Where the key is must stay off the list, because the makers know more than the audience. "
            "Write the list in two columns: already known, and still hidden. "
            "That page is the evidence. Performing the moment is optional, needs everyone's consent, and needs an adult nearby."
        ),
        (
            "Riley's list names the school gate, the missing spare key, and a waiting sibling. "
            "Already known: they are at school after the bell; the spare house key is not in Riley's hand; someone at home needs that key today. "
            "Still hidden: the place the key fell, and whether the office can help. "
            "A second pass checks the list. 'Riley looks worried' can stay, because the face can show it. "
            "'The key is under a bench' cannot stay, because nothing on stage has shown that yet. "
            "The audience meets the problem. They do not receive the answer."
        ),
        (
            "After the last bell, the group is listing audience knowledge for the lost house key. "
            "Which item must stay off that opening list?"
        ),
        (
            "Keep the school, the missing key, and the sibling, and leave the hiding place off. "
            "The gate, the empty hand, and the reason today matters are given facts the audience can already use. "
            "Naming the hiding place would hand them the mystery before the scene has earned it. "
            "If a fact needs a later action to be seen, it belongs in the hidden column."
        ),
        (
            "Writers often add the hiding place because the makers already know it. "
            "The audience did not see you plan the scene. They only know what the opening shows or tells. "
            "Repair the list by moving any unshown location into the mystery column. "
            "Knowing the answer yourself is not the same as the audience knowing it."
        ),
        (
            "List what an audience already knows about a forgotten permission slip. "
            "The slip was due at the office before home time, and it is not in the student's folder. "
            "Write three given facts and one mystery that must stay off the opening list. "
            "Do not reuse the house key. A written list is the evidence. Acting is optional, with consent and an adult nearby."
        ),
    ),
    spec(
        's5-drama-y9-w11-l2',
        ['story beat', 'obstacle', 'decision', 'sequence'],
        (
            "A story beat is one action that pushes the key scene forward. "
            "This lesson adds sequence to the audience-knowledge list from last time. "
            "Three beats are enough: find, obstacle, decision. "
            "Here, find means discovering the key is missing, not getting it back. "
            "The obstacle is the problem that blocks an easy fix. The office shutter is down, so a replacement key is unavailable. "
            "The decision is the choice made because of that obstacle: Riley will search the art room, where the bag was at lunch. "
            "Order matters. The find creates the need, the obstacle removes the easy path, and the decision answers it. "
            "Write the three beats in that order. Performing them is optional, with consent and an adult nearby."
        ),
        (
            "The beats are the empty pocket, the closed office, and the choice to search. "
            "Find: Riley pats the zip pocket and shows Alex an empty hand. "
            "Obstacle: Alex points at the office shutter, which is already down. "
            "Decision: Riley says the bag was in the art room at lunch and turns that way. "
            "A swapped order shows why sequence matters. If they choose the art room before anyone has seen the empty pocket, the audience has no problem yet. "
            "The key itself is still not found. That recovery belongs to a later lesson."
        ),
        (
            "Riley has an empty pocket and the office shutter is down. "
            "Which order of beats is find, then obstacle, then decision?"
        ),
        (
            "Discover the loss, meet the closed office, then choose the art-room search. "
            "The empty pocket is the find. The shutter is the obstacle. Turning toward the art room is the decision. "
            "Choosing the art room first would decide before the audience knows what is wrong. "
            "Finding the key in beat one would also skip the obstacle, and this lesson stops before the key returns."
        ),
        (
            "Deciding where to go before any obstacle leaves nothing to decide. "
            "A decision needs a reason. The closed office is that reason. "
            "Another mix-up is treating find as 'the key is back in the hand'. "
            "In this sequence, find means the loss is discovered. Put the beats back in order: loss, block, choice."
        ),
        (
            "Write find, obstacle, and decision beats for a missing sports bib. "
            "The bib is not in the gym bag, the spare tub is locked, and the student must choose a next place to look. "
            "Label the three beats in order. Do not use the house key or the art room. "
            "The writing is the evidence. Acting the beats is optional, with consent and an adult nearby."
        ),
    ),
    spec(
        's5-drama-y9-w12-l1',
        ['role', 'want', 'contrast', 'objective'],
        (
            "Two roles need two different wants or the scene has no pull. "
            "You already have three beats. This lesson puts a person inside each beat. "
            "A role is the person being played. A want, or objective, is what that person is trying to get right now. "
            "Riley wants to search the art room before the sibling reaches the gate. "
            "Alex wants to leave for the bus stop now and phone from there. "
            "Contrast is the gap between those wants. Both can be reasonable. Neither has to be unkind. "
            "If both only want to search, the lines can stay polite and the scene still will not move. "
            "Write each role's want in one sentence, then one action that shows it. "
            "A written pair of wants is the evidence. Playing them is optional, with consent and an adult nearby."
        ),
        (
            "Riley wants to search the art room, and Alex wants to leave for the bus. "
            "Riley keeps a hand on the empty pocket and steps toward the art-room door. "
            "Alex taps a watch and angles the body toward the front gate. "
            "The same words can carry either want, so the action has to show it. "
            "A weak pair gives both the line 'We should look'. Nothing pushes back. "
            "A useful pair lets Riley ask for two more minutes and lets Alex ask to walk to the gate instead."
        ),
        (
            "Riley and Alex are still at school with the spare house key missing. "
            "Which pair of wants gives the two roles a real contrast?"
        ),
        (
            "Keep Riley on the search and Alex on leaving, so the wants stay different. "
            "Riley's objective is the art-room search before the sibling arrives. Alex's objective is the bus stop now. "
            "Both wants can be fair. The scene works because they cannot both happen first. "
            "Two copies of 'let us search together' remove the contrast."
        ),
        (
            "If both friends only want to search, there is no disagreement to play. "
            "Matching wants can sound cooperative and still leave the actors with nothing to negotiate. "
            "A want is not a personality label such as bossy or lazy. "
            "Repair it by writing what each person is trying to get in this minute, and make those aims pull apart."
        ),
        (
            "Give two roles opposite wants about a calculator due back before music. "
            "One student wants to return it to the owner in the next room. The other wants to finish the last question first. "
            "Name each role and each want, plus one action that shows each want. "
            "Do not reuse Riley, Alex, or the house key. Writing is the evidence. Acting needs consent and an adult nearby."
        ),
    ),
    spec(
        's5-drama-y9-w12-l2',
        ['beginning', 'middle', 'ending', 'duration'],
        (
            "Beginning, middle, and end fit one minute when each part is an action. "
            "Duration here means the played action stays under sixty seconds, not that someone talks for sixty seconds. "
            "Use the beats and the two wants you already planned. "
            "Beginning: Riley checks the zip pocket and shows the empty hand. That is the find. "
            "Middle: Alex points to the closed office shutter and asks to leave. That is the obstacle meeting Riley's want. "
            "Ending: Riley turns toward the art room and Alex has to follow or refuse. That is the decision. "
            "Cut any story about the morning. The audience already has the given facts. "
            "Time the actions by reading them aloud once, or by counting a slow sixty in your head while you read. "
            "The written three-part plan is the evidence. Performing it is optional, with consent and an adult nearby."
        ),
        (
            "The minute is a pocket check, one argument, and a turn toward the art room. "
            "Beginning, about fifteen seconds: pocket open, empty hand shown to Alex. "
            "Middle, about twenty-five seconds: Alex indicates the shutter and steps toward the gate; Riley shakes the head once. "
            "Ending, about fifteen seconds: Riley turns to the art-room door and holds the door frame, waiting. "
            "A version that fails the duration is a speech beginning 'This morning my parent said...' which uses the minute and changes nothing. "
            "The key is still not back. The minute ends on the choice to search."
        ),
        (
            "The group must show the empty pocket, the closed office, and the turn to the art room in under a minute. "
            "Which three-part plan stays inside that duration?"
        ),
        (
            "Check the pocket, argue once, then turn toward the art room inside a minute. "
            "Each part is an action the audience can see, and together they stay under sixty seconds. "
            "A retelling of the whole day is a speech, not a beginning, middle, and end. "
            "Stop the scene on the decision. Do not add the key's return yet."
        ),
        (
            "A long story about the morning can use a minute and still change nothing. "
            "Duration is not 'we talked until the timer rang'. It is three actions with a start and a finish. "
            "If the ending is still the empty pocket, the middle and the end have collapsed. "
            "Repair it by cutting background talk and leaving one visible action in each part."
        ),
        (
            "Plan a one-minute jacket return with a clear beginning, middle, and end. "
            "A borrowed jacket must go back to the hall hook before the bell. "
            "Write one action for the beginning, one for the middle, and one for the ending, and mark that the actions fit under a minute. "
            "Do not use the house key. The written plan is the evidence. Performing needs consent and an adult nearby."
        ),
    ),
    spec(
        's5-drama-y9-w13-l1',
        ['tension', 'withhold', 'reveal', 'middle beat'],
        (
            "Tension holds when the key's location stays hidden until the middle. "
            "Withhold means you delay a fact the audience wants. The reveal is the moment you finally show it. "
            "In the one-minute scene, the audience knows the key is missing and that Riley has chosen to search. "
            "They do not yet know where it is. Keep the opening on the empty pocket only. "
            "In the middle beat, Alex sees the key ring under the front edge of the paint bench and points, but does not pick it up yet. "
            "That is early enough to change the scene and late enough that the audience had to wait. "
            "Showing the ring in the first second spends the mystery. Hiding it until the very last second can feel like a trick. "
            "The middle is the agreed place for this reveal. "
            "Write when the audience first sees the ring. Playing it is optional, with consent and an adult nearby."
        ),
        (
            "The opening shows an empty pocket, and the key ring appears under the bench later. "
            "Beginning: empty zip pocket, no ring in sight, art-room door only just reached. "
            "Middle: Alex kneels, points to the front lip of the paint bench, and the ring is visible to the audience for the first time. "
            "The scene does not start with a caption that says where the key is. "
            "A second check: if a classmate walks in during the opening, they should not be able to point to the key yet. "
            "After the middle point, they should."
        ),
        (
            "The lost-key scene opens on Riley's empty pocket at the art-room door. "
            "When should the audience first see the key ring under the bench?"
        ),
        (
            "Show the empty pocket first, and keep the bench reveal for the middle beat. "
            "The opening withholds the location. The middle shows the ring at the front edge of the paint bench when Alex points. "
            "The beginning is too soon, and a last-second surprise is later than this scene needs. "
            "The audience should want the location before they receive it."
        ),
        (
            "Placing the key in view at the start spends the mystery before it can build. "
            "If the ring is already on the bench in the opening picture, there is nothing to withhold. "
            "Tension is not the same as shouting or rushing. It is the wait you control. "
            "Repair the scene by clearing the key from the opening and letting the point in the middle be the first sight of it."
        ),
        (
            "Hide a library card's location until the middle of a different short scene. "
            "The card is missing from a wallet at the loans desk. Do not show where it is in the opening. "
            "Write the opening action, the middle reveal, and the reason for waiting. "
            "Do not use the house key or the paint bench. Writing is the evidence. Performing needs consent and an adult nearby."
        ),
    ),
    spec(
        's5-drama-y9-w13-l2',
        ['dialogue', 'plan change', 'small talk', 'next action'],
        (
            "Dialogue should change the plan, not fill time with small talk. "
            "A line earns its place when the next action is different because it was said. "
            "Before the useful line, Riley's plan is to wait at the office shutter in case it opens. "
            "Alex says, 'The shutter is locked from inside, so waiting will not get us a second key.' "
            "That plan change sends Riley to the art room instead. "
            "Small talk such as 'How was your day?' can be kind and still leave both people standing at the shutter. "
            "You do not need a long speech. One sentence that closes one path and opens another is enough. "
            "Write the old plan, the line, and the new plan. "
            "The script is the evidence. Speaking it aloud is optional, with consent and an adult nearby."
        ),
        (
            "Alex says the office shutter is down, so Riley stops waiting and searches. "
            "Old plan: stand at the office until someone opens it. "
            "Line: Alex: 'The shutter is bolted. The art room is the only place left from lunch.' "
            "New plan: Riley leaves the office and goes to the art-room door. "
            "A small-talk version keeps the old plan. Alex: 'Did you have a good day?' Riley: 'It was fine.' They are still waiting. "
            "The stronger line does not insult anyone. It removes the office as a choice."
        ),
        (
            "Riley is waiting for the office shutter to open so they can ask for another house key. "
            "Which line of dialogue changes that plan?"
        ),
        (
            "The shutter line switches the plan from waiting to searching the art room. "
            "Alex's news that the shutter is bolted means waiting cannot work, so the next action has to move. "
            "A question about the day does not close the office path. "
            "After a useful line, you should be able to point to a new action."
        ),
        (
            "Polite chat about the day can sound busy and still leave the plan unchanged. "
            "Small talk is not wrong in life. In this short scene it uses time without changing what anyone does. "
            "A line also fails if it only repeats the want: 'I want to leave' is already known if Alex is stepping toward the gate. "
            "Repair the dialogue by naming a fact that shuts one path and forces a different next action."
        ),
        (
            "Write two lines about a locked music cupboard where the second line changes the search. "
            "The first plan is to wait for the teacher. The second line must make the students look somewhere else. "
            "Label the old plan, the line, and the new plan. "
            "Do not use the house key or the office shutter. The writing is the evidence. Speaking the lines needs consent and an adult nearby."
        ),
    ),
    spec(
        's5-drama-y9-w14-l1',
        ['freeze frame', 'storyboard', 'caption', 'still image'],
        (
            "Three freeze frames storyboard the scene only if each still is a new moment. "
            "A freeze frame is a still image, like a photograph the actors hold. A storyboard is those stills in order, each with a caption. "
            "The caption says what the audience learns, not only where the people are. "
            "Frame one, beginning: Riley holds the zip pocket open toward the watchers. Caption: the spare key is already gone. "
            "Frame two, middle: Alex points at the front edge of the paint bench, where the ring can be seen. Caption: the location is revealed. "
            "Frame three, ending: Riley holds the ring up and faces the gate. Caption: they have decided to go. "
            "Three copies of the same standing pose do not make a story. "
            "Draw or describe the three stills and write a caption under each. "
            "The storyboard page is the evidence. Making the freezes with bodies is optional, needs consent, and needs an adult nearby. No one has to be lifted or touched."
        ),
        (
            "The stills show an empty pocket, a point under the bench, then the key held up. "
            "Caption one: 'The pocket is empty, so the key is still lost.' "
            "Caption two: 'Alex points, and the ring is visible under the bench for the first time.' "
            "Caption three: 'Riley has the ring and turns toward the gate.' "
            "A weak storyboard uses the caption 'They are in the art room' three times. The place never changes, and neither does the story. "
            "Each caption should answer: what is different now?"
        ),
        (
            "The group is storyboarding the lost-key scene in three freeze frames. "
            "Which set of captions shows three different moments?"
        ),
        (
            "Use an empty pocket, a pointing hand, and the raised key as three different stills. "
            "The captions move from loss, to the middle reveal under the bench, to the decision to head for the gate. "
            "Repeating 'They stand in the art room' describes a place, not a change. "
            "A storyboard fails when the audience could swap the frames and not notice."
        ),
        (
            "Repeating one standing pose three times does not show a change in the story. "
            "A tidy picture can still be the same moment copied. "
            "The caption 'This is the scene' also fails, because it does not say what the audience learns. "
            "Repair the board by making each still add one new fact: missing, found in the middle, then a choice to leave."
        ),
        (
            "Caption three different freeze frames for a wet raincoat left on a chair. "
            "Show a beginning, a middle, and an end, and write what the audience learns under each still. "
            "Do not draw the house key or the paint bench. "
            "The captions are the evidence. Posing the frames is optional, with consent, no touching, and an adult nearby."
        ),
    ),
    spec(
        's5-drama-y9-w14-l2',
        ['transition', 'turn', 'blackout', 'count'],
        (
            "A transition is a turn or a blackout counted to three between freezes. "
            "You have three stills. This lesson is how the audience gets from one to the next. "
            "A turn is a visible change of direction that links two pictures. Riley turns from the gate toward the art-room door, and that turn joins the empty pocket to the search. "
            "A blackout is not a dark room and not a power cut. It is a count of three: say or write 'one, two, three', then show the next freeze. "
            "Anyone who prefers not to close their eyes can look down at the page instead. "
            "Use the turn between frame one and frame two, and the counted blackout between frame two and frame three, when the ring moves from the bench into Riley's hand. "
            "Jumping with no link makes the new picture look like a mistake. "
            "Write both transitions beside the storyboard. Trying them is optional, with consent and an adult nearby."
        ),
        (
            "Riley turns to the art-room door, then a count of three lands them at the bench. "
            "Between the empty pocket and the point: Riley turns to the art-room door so the audience sees the search begin. "
            "Between the point and the raised key: the group counts one, two, three, then Riley is holding the ring. "
            "The count covers the pickup so hands do not have to mime a grab the audience might misread. "
            "A missing transition looks like this: the pocket picture vanishes and the raised key is suddenly there, with no turn and no count. "
            "Write the link even if you never leave your chair."
        ),
        (
            "Two freeze frames of the key scene need a join: the empty pocket, then the bench. "
            "Which pair of transitions links the frames clearly?"
        ),
        (
            "Turn toward the door, then count one, two, three before the bench freeze. "
            "The turn shows the move into the art room. The count of three is the blackout that resets the picture. "
            "Neither link needs a dark room, a touch, or a jump the audience cannot follow. "
            "If you only cut, the audience cannot tell whether the story moved or the picture just changed."
        ),
        (
            "Snapping to the next freeze with no turn and no count looks like a mistake. "
            "The audience may think an actor forgot the pose. "
            "A blackout is also not 'we turned the real lights off'. For this lesson the blackout is the spoken or written count of three. "
            "Repair a jump by adding either a turn the audience can see or the count, and name which one you used."
        ),
        (
            "Plan a turn and a counted blackout between frames of packing a chess set. "
            "Frame A is the full board. Frame B is a hand on the king. Frame C is the closed box. "
            "Say which join is the turn and which join is the count of three. "
            "Do not use the house key. Writing the transitions is the evidence. Trying them needs consent and an adult nearby."
        ),
    ),
    spec(
        's5-drama-y9-w15-l1',
        ['rehearsal note', 'unclear moment', 'fix', 'clarity'],
        (
            "A rehearsal note names one unclear moment and one concrete fix. "
            "Clarity means a watcher who was not in the planning group can tell what just happened. "
            "In the middle freeze, both actors stare at the floor. The audience cannot tell who has seen the key ring. "
            "The note names that moment, then gives the fix: Alex points at the ring on the front edge of the bench, and Riley's eyes follow the point, then both hold still. "
            "The fix changes an action. It does not say 'be better' or 'do it with more energy'. "
            "One moment is enough. A list of ten complaints hides the repair. "
            "Write the moment in one sentence and the fix in one sentence. "
            "The note is the evidence. Rehearsing the fix is optional, with consent and an adult nearby."
        ),
        (
            "Both stare at the floor, so Alex points at the ring and Riley's eyes follow. "
            "Unclear moment: in the middle still, both faces aim at the floor, so the reveal has no owner. "
            "Fix: Alex's hand points to the ring, Riley looks along that line, and the freeze starts again. "
            "The audience can now see who found it and who understands. "
            "A useless note says only 'Make the middle clearer'. Nobody knows what to change. "
            "A useful note could be tried or simply written on the storyboard."
        ),
        (
            "In the middle freeze both people stare at the floor, and watchers cannot tell who has seen the key. "
            "Which rehearsal note names that moment and a real fix?"
        ),
        (
            "Name the floor stare, then fix it with a point and eyes that follow the hand. "
            "The unclear moment is the shared look at the floor. The fix gives the discovery to Alex's point and shows Riley receiving it. "
            "'Make it clearer' names no moment and no action. "
            "'Act harder' also fails, because effort is not a picture the audience can read."
        ),
        (
            "A note that only says to make it clearer does not tell anyone what to change. "
            "Vague praise such as 'the middle is fine' also skips the repair when something is hard to read. "
            "A fix that says 'turn up the feeling' still does not show who sees the key. "
            "Repair the note by pointing at one moment and one visible change, such as a point and a look that follows it."
        ),
        (
            "Note one unclear hall-pass hand-off and the exact action that would fix it. "
            "Two students pass a hall pass, but a watcher cannot tell who ends up holding it. "
            "Write the unclear moment and one fix the audience could see. "
            "Do not use the house key. The note is the evidence. Trying the fix needs consent and an adult nearby."
        ),
    ),
    spec(
        's5-drama-y9-w15-l2',
        ['sightline', 'audience position', 'visibility', 'staging'],
        (
            "Sightlines decide where the audience sits and what they must be able to see. "
            "Audience position is the row or cluster of seats. Visibility means each important object can be seen from those seats. "
            "Staging is where you place people and objects for those seats, not how fancy the room looks. "
            "For the key scene, sit the audience in one row along the front of the space. "
            "From there they must see three things: the open empty pocket, Alex's pointing hand, and the key ring once it is revealed at the front edge of the bench. "
            "If the bench blocks the ring, move the ring to the front lip, or move the row, until the ring is in view. "
            "Do not seat people behind the bench or behind an actor's back. "
            "Draw a simple bird's-eye plan: seats, pocket, hand, ring. "
            "The plan is the evidence. Rearranging a room is optional, with an adult, and must leave exits clear."
        ),
        (
            "A front row can see the empty pocket, the pointing hand, and the key ring. "
            "Seats: one row facing the art-room side of the space. "
            "Riley's pocket opens toward that row, not toward the back wall. "
            "The bench sits side-on, with the ring on the front edge so the row sees it when Alex points. "
            "A blocked version puts the row behind the bench. The actors can see the ring, and the audience sees only wood. "
            "If you cannot move furniture, write the plan and mark the three must-see items anyway."
        ),
        (
            "The audience will watch the lost-key scene from a single row of seats. "
            "Which seating and object plan lets them see what matters?"
        ),
        (
            "Seat them in a front row that sees the pocket, the point, and the key. "
            "The pocket opens toward that row, and the ring sits on the front edge of the bench rather than behind it. "
            "A row behind the bench, or a pocket opened into an actor's chest, hides the story. "
            "The actors knowing where the key is does not help if the seats cannot see it."
        ),
        (
            "A seat behind the bench hides the key even when the actors think it is shown. "
            "Visibility is judged from the audience seats, not from the performer's eyes. "
            "Standing further apart does not fix a ring that is on the far side of the bench. "
            "Repair the staging by moving the seats or the ring until the three must-see items are in the sightline."
        ),
        (
            "Place the audience for a dropped timetable and name two things they must see. "
            "The timetable falls in a corridor. Decide where the row sits, and name two story details that row must be able to see. "
            "Do not use the house key or the paint bench. "
            "The written seating plan is the evidence. Moving furniture needs an adult and must keep exits clear."
        ),
    ),
    spec(
        's5-drama-y9-w16-l1',
        ['peer feedback', 'acting choice', 'suggestion', 'kindness'],
        (
            "Kind feedback names one acting choice and one specific change. "
            "Peer feedback is for the work, spoken or written so the person can use it. "
            "Kindness here is precise, not vague praise and not a comment about someone's body, clothes, voice type, or worth. "
            "An acting choice is a decision the audience could see, such as a pause, a point, or which way a pocket opens. "
            "A suggestion is the next change, also visible. "
            "Useful note: 'The pause before you opened the pocket made the key feel important. Next time, open the pocket toward the front row so we can see it is empty.' "
            "That keeps one choice and asks for one change. "
            "'You were great' and 'You are bad at drama' both fail, because neither says what to repeat or repair. "
            "Write exactly those two parts. Watching a live try is optional; you can respond to a written storyboard. Any shared work needs consent and an adult nearby."
        ),
        (
            "The pause before the pocket shows worry, and the pocket should face the front row. "
            "Choice to keep: Riley waits a breath before opening the zip pocket, so the loss feels serious. "
            "Change to try: angle the open pocket to the front row, because last time the lining faced the floor and the empty look was missed. "
            "The note does not mention height, clothes, or whether someone is 'a natural'. "
            "A second example, still kind: 'Alex's point at the bench told me who had found the ring. Hold the point until the freeze, because it dropped too soon.'"
        ),
        (
            "A classmate paused before opening the empty pocket, but the pocket faced the floor. "
            "Which peer note is kind and specific?"
        ),
        (
            "Keep the pause that showed worry, and open the pocket toward the front row. "
            "The pause is the acting choice worth repeating. The pocket's direction is the suggested change. "
            "The note talks about the work. It does not score the person. "
            "'That was amazing' keeps nothing particular, and 'You can't act' suggests nothing they can try."
        ),
        (
            "Saying someone was great, or bad at drama, names no choice to keep or change. "
            "General praise feels kind and still gives the actor no next step. "
            "A comment about a person's body, clothes, or worth is not feedback on the scene. "
            "Repair the note by keeping one visible choice and asking for one visible change."
        ),
        (
            "Write one kind note about waiting at a closed canteen shutter: one choice, one change. "
            "The student stops, looks at the shutter, and then speaks to a friend while still facing away from the row. "
            "Name one acting choice to keep and one suggested change. Do not comment on bodies, clothes, or worth. "
            "Do not use the house key. The written note is the evidence."
        ),
    ),
    spec(
        's5-drama-y9-w16-l2',
        ['playbuilding plan', 'new stimulus', 'beats', 'tension choice'],
        (
            "A playbuilding plan records beats, different wants, and one tension choice. "
            "This is the transfer lesson. The house-key work stays as the model. The new stimulus is a late bus, not a rename of the key. "
            "A complete plan names the stimulus, three beats in order, two roles with different wants, and one tension choice about what you withhold. "
            "It can also note a transition or a sightline, but those four parts are the minimum. "
            "The key plan below shows the shape. Your own page must be the bus. "
            "Performance stays optional. The written plan is the evidence, including a consent line: no touching, and an adult nearby if anyone tries it."
        ),
        (
            "The key plan has three beats, two opposing wants, and a location saved for the middle. "
            "Stimulus: lost spare house key after the bell. "
            "Beats: empty pocket, office shutter down, turn toward the art room. "
            "Roles: Riley wants to search; Alex wants the bus stop. "
            "Tension choice: withhold the ring under the bench until the middle. "
            "That plan is finished for the key. It is not the task you will write. "
            "Notice that every part is a decision, not a hope that the scene will be funny."
        ),
        (
            "A classmate's late-bus note says only that two people will be funny at the stop. "
            "Which parts must be added before this counts as a playbuilding plan?"
        ),
        (
            "Add beats, two different wants, and one withheld fact such as the bus arrival. "
            "Funny is not yet a stimulus plan. The page needs three ordered beats, two roles pulling different ways, and one tension choice. "
            "Withholding when the bus appears is one possible tension choice. Another is withholding why it is late, until the middle. "
            "Copying the art-room key story onto a bus stop does not count as those parts."
        ),
        (
            "Renaming the house-key scene as a late bus does not create a new stimulus. "
            "A new stimulus needs its own place, problem, and people. "
            "Leaving the page blank because the group 'already improvised' also fails this lesson. "
            "Repair the plan by writing the bus problem in beats, wants, and one deliberate withhold."
        ),
        (
            "Plan a late-bus scene with three beats, two different wants, and one tension choice. "
            "The stimulus is a bus that has not come. Invent the place and the two people yourself. "
            "Include ordered beats, each role's want, and exactly one fact you will withhold until the middle. "
            "Do not move the house key, the art room, or the paint bench into this plan. "
            "Add a consent line. The writing is the required evidence. Any try needs agreement and an adult nearby."
        ),
    ),
]

VISUALS = {
    's5-drama-y9-w11-l1': visuals(
        ('Already known', 'Gate, missing key, sibling'),
        ('Still hidden', 'Where the key is'),
        'A two-column list of facts the audience already has beside the hiding place kept as a mystery.',
        'Audience knowledge lists given facts and leaves the mystery off.',
        ('Stimulus', 'A lost spare house key'),
        ('Not the answer', 'Do not reveal the spot'),
        'The lost-key stimulus contrasted with saving the hiding place for later.',
        'The stimulus starts the story; it does not give the location away.',
    ),
    's5-drama-y9-w11-l2': visuals(
        ('Find', 'Empty pocket at the gate'),
        ('Obstacle', 'Office shutter is down'),
        'The find beat of an empty pocket beside the obstacle of a closed office shutter.',
        'Find the loss first, then meet the obstacle.',
        ('Decision', 'Search the art room'),
        ('Too early', 'Choose before the loss'),
        'The decision to search the art room contrasted with choosing before the key is known to be missing.',
        'The decision comes after the obstacle, not before the problem.',
    ),
    's5-drama-y9-w12-l1': visuals(
        ('Riley wants', 'Search the art room'),
        ('Alex wants', 'Leave for the bus'),
        'Riley wanting to search beside Alex wanting to leave for the bus.',
        'Two roles need two different wants.',
        ('Useful contrast', 'Search versus leaving'),
        ('Same want', 'Both only want to look'),
        'A contrast of wants beside both characters wanting the same search.',
        'Matching wants leave the scene with nothing to negotiate.',
    ),
    's5-drama-y9-w12-l2': visuals(
        ('Beginning', 'Show the empty pocket'),
        ('Middle', 'Point at the shutter'),
        'The beginning pocket check beside the middle gesture toward the closed office.',
        'Each part of the minute is one visible action.',
        ('Ending', 'Turn to the art room'),
        ('Too long', 'A speech about morning'),
        'The ending turn toward the art room contrasted with a speech that changes nothing.',
        'Keep the whole action under one minute.',
    ),
    's5-drama-y9-w13-l1': visuals(
        ('Opening', 'Empty pocket only'),
        ('Middle reveal', 'Ring at the bench edge'),
        'The opening withholding the key beside the middle reveal at the front of the bench.',
        'Withhold the location until the middle beat.',
        ('Tension', 'Audience must wait'),
        ('Spent early', 'Ring visible at once'),
        'Waiting for the location contrasted with showing the key ring in the first moment.',
        'Showing the key at the start removes the tension.',
    ),
    's5-drama-y9-w13-l2': visuals(
        ('Old plan', 'Wait at the office'),
        ('New plan', 'Go to the art room'),
        'Waiting at the office contrasted with leaving to search after a line of dialogue.',
        'Dialogue should change the next action.',
        ('Useful line', 'The shutter is bolted'),
        ('Small talk', 'How was your day?'),
        'A line that closes the office path beside small talk that leaves the plan the same.',
        'Small talk does not change what happens next.',
    ),
    's5-drama-y9-w14-l1': visuals(
        ('Frame one', 'Pocket open and empty'),
        ('Frame two', 'Point under the bench'),
        'The first freeze of an empty pocket beside the middle freeze that points to the key.',
        'Each freeze frame must be a new story moment.',
        ('Frame three', 'Key held toward gate'),
        ('Same pose', 'Three identical stands'),
        'The final freeze with the key raised beside three copies of one standing pose.',
        'A storyboard changes; it does not repeat one picture.',
    ),
    's5-drama-y9-w14-l2': visuals(
        ('Turn', 'Face the art-room door'),
        ('Blackout', 'Count one, two, three'),
        'A turn toward the art room beside a blackout shown as a count of three.',
        'Link freezes with a turn or a counted blackout.',
        ('Clear join', 'Audience sees the change'),
        ('A jump', 'Next pose just appears'),
        'A readable transition contrasted with a jump that has no turn and no count.',
        'A jump with no link looks like a mistake.',
    ),
    's5-drama-y9-w15-l1': visuals(
        ('Unclear', 'Both stare at the floor'),
        ('Fix', 'Point, then eyes follow'),
        'An unclear floor stare beside a fix where a point leads the other actor\'s eyes.',
        'A rehearsal note names the moment and the fix.',
        ('Useful note', 'One moment, one action'),
        ('Vague note', 'Just make it clearer'),
        'A specific repair contrasted with a note that says only to make it clearer.',
        'Name what is unclear and what to change.',
    ),
    's5-drama-y9-w15-l2': visuals(
        ('Front row', 'Sees pocket, hand, ring'),
        ('Behind bench', 'Ring hidden by wood'),
        'A front-row sightline that sees the key contrasted with seats behind the bench.',
        'Place the audience where the story objects stay visible.',
        ('Must see', 'Empty pocket and the ring'),
        ('Actors only', 'They see it, row does not'),
        'The objects the audience must see beside a staging that only the actors can see.',
        'Judge visibility from the seats, not from the actors.',
    ),
    's5-drama-y9-w16-l1': visuals(
        ('Choice to keep', 'The pause showed worry'),
        ('Change to try', 'Open pocket to the row'),
        'Feedback that keeps a pause beside a suggestion to open the pocket toward the audience.',
        'Name one acting choice and one specific change.',
        ('About the work', 'The point landed late'),
        ('About the person', 'You are bad at drama'),
        'A note about a late point contrasted with a comment about the person.',
        'Stay kind, and talk about the choice.',
    ),
    's5-drama-y9-w16-l2': visuals(
        ('Key model', 'Beats, wants, withhold'),
        ('New stimulus', 'A bus that has not come'),
        'The finished house-key plan shape beside a new late-bus stimulus.',
        'Transfer the plan shape to a new stimulus.',
        ('Plan needs', 'Beats, wants, tension'),
        ('Not enough', 'Two people will be funny'),
        'A complete playbuilding plan contrasted with a note that only promises comedy.',
        'Funny is not yet beats, roles, and a tension choice.',
    ),
}


def main():
    written = write_elective_batch(
        LESSONS,
        VISUALS,
        subject='arts',
        source_url=SOURCE_URL,
        source_note=SOURCE_NOTE,
        out_dir=OUT_DIR,
    )
    print(f'Wrote {len(written)} lessons to {OUT_DIR}')
    return written


if __name__ == '__main__':
    main()
