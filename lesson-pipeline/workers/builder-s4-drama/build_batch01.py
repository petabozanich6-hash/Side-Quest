#!/usr/bin/env python3
"""Year 7 Drama Written Core: twelve improvisation lessons that progress.

Catalogue titles stay "Improvisation and acting skills". Identity fields come
from the baseline. Scenes are original. Outcome DR4-MAK-01 is proposed only.
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
    'Proposed Stage 4 alignment to Drama 7–10 (2023) outcome DR4-MAK-01. '
    'Content-point mapping pending. Not NESA verified. Scenes are original. '
    'Physical work is optional, consented, and adult-supervised.'
)
OUT_DIR = ROOT / 'lesson-pipeline' / 'workers' / 'builder-s4-drama' / 'authored'

LESSONS = [
    dict(
        seed_key='s5-drama-y9-w01-l1',
        code=CODE,
        subject='arts',
        vocab=['offer', 'fiction', 'accepting', 'blocking'],
        principle=(
            "Improvisation means making up a scene together by accepting an offer and staying inside the fiction. "
            "An offer is any new fact a partner gives you, such as a place, a problem, or a feeling. "
            "Accepting means you treat that fact as true in the story, even if you did not plan it. "
            "The fiction is the pretend world you both agree to keep alive, so you answer as the character rather than stepping out to say you do not know the plot. "
            "There is no published play to memorise in this lesson. The original fiction is a school library where Sam has lost a borrowed book called the blue nature guide. "
            "When the librarian says the guide was due yesterday, Sam's job is to accept that fact and add one small detail that could really happen in the library. "
            "Writing the lines is the work. Acting them out is optional, and only with an adult nearby."
        ),
        model=(
            "Sam accepts the overdue guide by saying the bag hooks by the hall are the next place to look. "
            "Librarian: 'The blue nature guide was due yesterday, and the returns trolley is empty.' "
            "Sam: 'I had it in my bag at lunch, so I will check the bag hooks by the hall.' "
            "That reply treats the due date and the empty trolley as true, and it gives the scene a new place to go. "
            "A second offer shows the same skill. Librarian: 'The loan card is still in the drawer.' "
            "Sam: 'Then the guide did not come back, and I will read the card to see the date I borrowed it.' "
            "Both times Sam stays in the library fiction instead of saying, 'This is only pretend.'"
        ),
        guided=(
            "In the lost-book fiction your partner says, 'I saw the blue nature guide on the art-room windowsill after lunch.' "
            "Which next line accepts that offer and keeps Sam inside the library story?"
        ),
        feedback=(
            "Sam should ask the art teacher whether the guide is still beside the clay sink. "
            "That line treats the windowsill as a true fact and keeps both players inside the library story. "
            "It also gives a next action, so the partner can offer something new. "
            "Saying 'I never had a library book' would cancel the offer, and saying 'I do not know the plot' would step out of the fiction."
        ),
        misconception=(
            "Blocking the offer by denying the lost book, or stepping out to say the plot is unknown, stops the scene. "
            "A block such as 'No, I never borrowed a guide' leaves your partner with nothing true to build on. "
            "Accepting does not mean Sam caused the problem. It means Sam agrees the problem exists inside the story, then helps the story continue."
        ),
        independent=(
            "Write two in-role lines that accept a new offer about a missing sports-shed key and an unlocked shed door. "
            "Partner: 'The shed key is gone and the door is standing open.' "
            "Line one accepts that fact as the student on duty. Line two adds one new detail that keeps the fiction going. "
            "Then name the offer you accepted in one sentence. Use this shed scene, not the library book. "
            "Writing is the evidence. Performing is optional and needs an adult nearby."
        ),
    ),
    dict(
        seed_key='s5-drama-y9-w01-l2',
        code=CODE,
        subject='arts',
        vocab=['extending', 'blocking', 'new detail', 'denial'],
        principle=(
            "Extending an offer means you accept the fact and add a detail your partner can use, often called Yes, and. "
            "Yes is the accept. And is the new detail that keeps the fiction moving. "
            "Blocking is a denial, a joke that cancels the fact, or a shrug that gives nothing back. "
            "In the library fiction, if the librarian says the blue nature guide was due yesterday, a block is 'No it was not.' "
            "A Yes, and is 'Yes, and I wrote the date on my hand, which washed off at the bubblers.' "
            "The new detail must be safe and school-appropriate. You do not have to accept an offer that is unkind or unsafe; stop and choose a new offer with the adult. "
            "For ordinary story facts, extending is how the scene grows."
        ),
        model=(
            "Sam extends the due date by adding that the reminder washed off at the bubblers. "
            "Offer: 'The blue nature guide was due yesterday.' "
            "Block: 'No, your calendar is wrong, so nothing is missing.' The scene stops. "
            "Yes, and: 'Yes, and the date was written on my hand until I rinsed it at the bubblers, so I forgot the trolley.' "
            "The partner can now offer the bubblers, the wet sleeve, or a friend who was there. "
            "A second pair: Offer: 'Your class already returned their guides.' "
            "Block: 'We do not have a class.' "
            "Yes, and: 'Yes, and mine was the last one because I was finishing the bird page.'"
        ),
        guided=(
            "The librarian says, 'I am already phoning your home about the blue nature guide.' "
            "Which reply is a Yes, and that extends this offer instead of blocking it?"
        ),
        feedback=(
            "Yes, and Dad is on the late shift, so the phone will reach the neighbour who has our spare key. "
            "The phone call stays true, and the neighbour is a new detail the partner can play next. "
            "A block such as 'You cannot phone anyone' erases the offer and leaves no next fact. "
            "Extending is not the same as agreeing Sam is in trouble forever. Sam can still want to fix the problem."
        ),
        misconception=(
            "A quick denial can sound clever and still kill the scene because the partner has no fact left to use. "
            "Laughing 'No, that is wrong' gets attention and ends the story. "
            "Yes, and does not mean you agree to every idea. If an offer is unsafe or unkind, pause the game. "
            "For a safe library fact, add something playable instead of cancelling it."
        ),
        independent=(
            "Write one blocking line and one Yes, and line for a canteen that has run out of the lunch special. "
            "Offer: 'The pumpkin soup is finished and the last roll has just gone.' "
            "Label which line blocks and which line extends, and say what new detail the partner could use next. "
            "Do not reuse the library book or the bubblers. Writing is the evidence."
        ),
    ),
    dict(
        seed_key='s5-drama-y9-w02-l1',
        code=CODE,
        subject='arts',
        vocab=['status', 'posture', 'decision', 'stereotype'],
        principle=(
            "Status is the control a character takes in this moment, shown by posture and by who decides. "
            "High status can look like a tall still body, a steady gaze, and choosing what happens next. "
            "Low status can look like a smaller shape, a wait before speaking, and letting the other person decide. "
            "Status is not a stereotype. It is not gender, height, accent, job, age, or being loud. "
            "The librarian can play low status, and Sam can play high status, in the same lost-book conversation. "
            "Neither version needs rudeness. High status can be calm, and low status can be thoughtful. "
            "You show status with the body and the decision, then you can describe it in writing if you are not performing."
        ),
        model=(
            "Sam plays high status by standing tall and deciding to search the trolley without being told. "
            "High-status Sam places the bag on the counter, stands evenly on both feet, and says, 'I will check the trolley, then the drawer.' "
            "Sam makes the plan. The librarian follows. "
            "Low-status Sam keeps the bag on the floor, rounds the shoulders, waits, and asks, 'Where should I look first?' "
            "The librarian makes the plan. "
            "A second swap keeps the same words and changes only the decision: the librarian asks Sam which aisle to open, so the librarian is playing low status even though this is the librarian's room."
        ),
        guided=(
            "Sam and the librarian are at the returns desk talking about the missing blue nature guide. "
            "Which choice shows Sam in low status through posture and who decides, without using a stereotype?"
        ),
        feedback=(
            "Sam hunches, keeps both hands close, and waits for the librarian to choose the next step. "
            "The small posture and the waiting decision show low status in this moment. "
            "It does not say Sam is younger, quieter by nature, or less important than an adult. "
            "High status would be the opposite choice: Sam stands tall and names the next search without waiting to be told."
        ),
        misconception=(
            "Believing high status belongs to the adult or the loudest voice mixes a stereotype with a choice. "
            "A shout does not raise status if the character still waits to be told what to do. "
            "A quiet voice does not lower status if the character calmly decides the next action. "
            "Repair the mistake by naming the posture and the person who decides, not the job title."
        ),
        independent=(
            "Describe a high-status and a low-status posture for two students with a missing bib, without stereotypes. "
            "State who makes the decision in each version. Do not use age, job, gender, or body size as the reason. "
            "The scene is the gym doorway, not the library. Writing the two versions is the evidence."
        ),
    ),
    dict(
        seed_key='s5-drama-y9-w02-l2',
        code=CODE,
        subject='arts',
        vocab=['objective', 'action', 'want', 'clarity'],
        principle=(
            "An objective is what a character wants from the other person right now, and the audience should see it in an action. "
            "Sam may want the librarian to start a new search before the bus leaves. "
            "That want becomes visible if Sam steps closer to the trolley, points to the empty shelf, or slides the loan card across the desk. "
            "Announcing 'My objective is help' to the audience tells the secret without playing it. "
            "The partner needs something they can respond to, such as a look at the clock or a card held out and waiting. "
            "One scene can hold two objectives: Sam wants more time, and the librarian wants the room ready to close. "
            "Write the want in your notebook, then write the action that shows it. You do not have to perform."
        ),
        model=(
            "Sam shows the wish for help before the bell by pointing at the empty trolley and holding out the loan card. "
            "Notebook want: get the librarian to reopen the search before the bus. "
            "Played action: Sam steps in, taps the empty trolley once, and holds the card where the librarian must see it. "
            "Sam does not say, 'I want help.' "
            "A second objective uses a different action. The librarian wants the room cleared, so the librarian closes the drawer and rests a hand on the light switch without making a speech about closing time."
        ),
        guided=(
            "Sam's objective is to leave the library with a new due date before the bus. "
            "Which action shows that want to the librarian without announcing it to the audience?"
        ),
        feedback=(
            "Sam slides the loan card across the desk and looks at the clock above the door. "
            "The card asks for a new date, and the look at the clock shows the time pressure. "
            "The librarian can respond by stamping the card or by refusing. "
            "A weaker choice is to face the audience and say, 'My objective is a new due date,' because nobody inside the scene was shown the want."
        ),
        misconception=(
            "Announcing the objective out loud to the audience names the want and forgets to play an action. "
            "The sentence 'I am trying to get help' can sit in a notebook. It should not replace the point, the card, or the glance. "
            "Clarity comes from what the partner can see or hear inside the fiction, not from a label stuck on the scene."
        ),
        independent=(
            "Show a character who wants the only free computer before the bus by listing three visible actions and no announcement. "
            "Write the want as a notebook line, then three actions another person could see in a computer room. "
            "Do not use the library trolley or the loan card. Mark one action you would cut if it only labels the want."
        ),
    ),
    dict(
        seed_key='s5-drama-y9-w03-l1',
        code=CODE,
        subject='arts',
        vocab=['circumstance', 'setting', 'relationship', 'swap'],
        principle=(
            "Given circumstances are the where, when, and who that actors treat as true before a scene starts. "
            "Where might be the quiet library. When might be two minutes before the bus. Who might be Sam and the librarian who knows Sam's name. "
            "Those three facts change how the same objective is played. A lunchtime queue makes the search faster and more public than an empty after-school library. "
            "Change only one circumstance at a time so you can see what actually shifted. "
            "If you change the joke or the costume but keep the same place, time, and people, the circumstances have not changed. "
            "Write the three facts, circle the one you will swap, and rewrite the first line so the swap can be heard."
        ),
        model=(
            "Moving the lost book from a quiet after-school library to a lunch queue changes the pace. "
            "First version: where is the library desk, when is two minutes before the bus, who is Sam and the librarian. Sam speaks in a full sentence and waits for an answer. "
            "Swap only the when: it is now the first minute of lunch, with a queue. Sam's line becomes, 'Guide, blue, yesterday, can I look now?' "
            "The want is still to find the book. The shorter line comes from the new time. "
            "A second swap changes only who: Sam's younger cousin is waiting and needs to understand. Sam uses a simpler line and points to the trolley so the cousin can follow."
        ),
        guided=(
            "The lost-book scene is a quiet library just before the bus, with Sam and the librarian. "
            "Which single swap of circumstance would most change how the first line is played?"
        ),
        feedback=(
            "Move the same missing book and the same two people into a noisy corridor during a passing period. "
            "Where has changed, so the line gets shorter and the voices stay public. When and who can stay the same, which proves the place did the work. "
            "Changing only a punchline, while the corridor never appears, does not change the circumstances."
        ),
        misconception=(
            "Changing a joke or a costume while where, when, and who stay the same is not a new circumstance. "
            "The audience may notice the costume, but the scene's pressure stays the same if the place, time, and relationship do not move. "
            "Repair it by naming which one fact you swapped and showing the new first line that fact creates."
        ),
        independent=(
            "For a borrowed calculator, write where, when, and who, then change one fact and rewrite the first line. "
            "Start in a quiet maths storeroom after class, with two students who both need the calculator tonight. "
            "Circle the one fact you swap. Do not reuse the library or the blue nature guide. Explain in one sentence how the new line shows the swap."
        ),
    ),
    dict(
        seed_key='s5-drama-y9-w03-l2',
        code=CODE,
        subject='arts',
        vocab=['subtext', 'dialogue', 'intention', 'literal'],
        principle=(
            "Dialogue is the words the characters actually say, and subtext is the want sitting underneath those words. "
            "People in a library often speak politely while wanting something they do not announce. "
            "If the librarian says 'The trolley is empty,' the dialogue is that sentence. The subtext may be 'Please stop searching and head for the bus.' "
            "Subtext is not a second speech you perform to the audience, and it is not automatically the opposite of the line. "
            "You find it by asking what the character wants from the other person right now. "
            "A four-line scene is enough to practise: write the spoken line, then a short bracket for the want under it. "
            "The scene in this lesson is original. You are not copying a published play."
        ),
        model=(
            "The librarian's subtext is a wish to close the search, while the spoken words stay polite and ordinary. "
            "Librarian: 'The trolley is empty.' (Want: Sam should see that the easy search is finished.) "
            "Sam: 'I can check the window aisle.' (Want: more time, offered as helpful work.) "
            "Librarian: 'The bell is in one minute.' (Want: Sam leaves before the room must close.) "
            "Sam: 'I only need that aisle.' (Want: a smaller search the librarian might still allow.) "
            "A second reading of the same four lines shows Sam's subtext clearly: none of Sam's lines say 'Let me stay,' but each one tries to keep the search alive."
        ),
        guided=(
            "Read this original four-line scene. Librarian: 'The trolley is empty.' Sam: 'I can check the window aisle.' "
            "Librarian: 'The bell is in one minute.' Sam: 'I only need that aisle.' "
            "Which statement best names the librarian's subtext?"
        ),
        feedback=(
            "The librarian wants Sam to stop searching and leave before the bell. "
            "The spoken lines mention an empty trolley and a bell, not a command to get out. "
            "The want underneath is still clear because both lines push the search toward an ending. "
            "A literal reading that says the librarian is only sharing a fact about furniture misses the intention."
        ),
        misconception=(
            "Treating subtext as a speech to the audience, or as the opposite of every line, misses the want underneath. "
            "You do not add, 'What I really mean is leave.' You let the bell line do that work. "
            "Subtext can match the line's direction. 'The bell is in one minute' and the wish to close are partners, not opposites."
        ),
        independent=(
            "Write a new four-line scene about one shared calculator, with each character's subtext in brackets under the line. "
            "Use two students and no library. The spoken words should stay ordinary, and the brackets should name what each person wants from the other. "
            "After the four lines, write one sentence explaining a want that is never said out loud."
        ),
    ),
    dict(
        seed_key='s5-drama-y9-w04-l1',
        code=CODE,
        subject='arts',
        vocab=['freeze', 'relationship', 'caption', 'objective'],
        principle=(
            "A freeze frame is a still picture that shows the relationship between the characters in one moment. "
            "The audience should be able to tell who wants something and who is holding it back before anyone speaks. "
            "Space, level, and eye line do that work. Sam low at the shelf and the librarian standing with the stamp held back shows asking and withholding. "
            "A caption under the freeze must name the objective, not only the place. "
            "'Sam wants the trolley opened again' is a caption. 'This is the library' is only a label. "
            "You can draw stick figures or describe the pose in sentences. Building the freeze with your body is optional, agreed first, and done with an adult nearby. "
            "No one has to be lifted, grabbed, or put in a pose that feels unsafe."
        ),
        model=(
            "Sam kneels at the low shelf while the librarian holds the date stamp back, and the caption names both objectives. "
            "Pose: Sam is low, one hand toward the empty trolley, eyes up. The librarian is standing, stamp paused, eyes on the clock. "
            "There is a clear gap between them. Nobody is touching. "
            "Caption: 'Sam wants one more minute of searching; the librarian wants the room empty for the bus.' "
            "A second freeze, after the guide is found, changes the relationship: both stand at the same level, the stamp comes forward, and the caption says Sam wants the new date and the librarian wants the card finished."
        ),
        guided=(
            "Sam kneels at the low shelf while the librarian holds the date stamp away from the card. "
            "Which caption names the objectives in this freeze, rather than only the place?"
        ),
        feedback=(
            "Sam wants the trolley opened again, and the librarian wants the room cleared before the bus. "
            "The caption names both wants, so a viewer knows the relationship and not just the furniture. "
            "The kneeling and the withheld stamp already show who is asking and who is delaying. "
            "A caption that only says 'In the library' could fit any pose and does not name an objective."
        ),
        misconception=(
            "A caption that only names the place, such as the library, hides the relationship and the objective. "
            "A funny face with no decision in it has the same problem. The still picture needs a want. "
            "Repair the caption by naming what one character wants from the other in this exact moment."
        ),
        independent=(
            "Describe a freeze of two teammates and a ball on the sideline, and write a caption that names one player's objective. "
            "Include levels, eye line, and the space between them. Do not use the library or the stamp. "
            "The caption must say what someone wants, not only where they are. "
            "Acting the freeze is optional, with agreement and an adult nearby. The written pose and caption are the evidence."
        ),
    ),
    dict(
        seed_key='s5-drama-y9-w04-l2',
        code=CODE,
        subject='arts',
        vocab=['entrance', 'exit', 'power', 'timing'],
        principle=(
            "An entrance or an exit changes the power in a scene when it changes who makes the next decision. "
            "Power here means who the other characters wait for, not who is a better person and not who can shout the loudest. "
            "If Sam and Jo are quietly deciding who will confess the lost guide, they hold the decision together. "
            "When the librarian stops in the doorway, both look across and wait. The entrance has moved the power. "
            "When the librarian leaves, the decision returns to Sam and Jo. The exit moves it back. "
            "A walk-on that nobody reacts to does not change power. Timing matters: the scene needs a beat where people actually re-aim the decision. "
            "You can show this in a written three-beat plan. Performing the entrance is optional and adult-supervised, with no surprise grabbing."
        ),
        model=(
            "The librarian's entrance in the doorway moves the decision from Sam and Jo to the adult standing at the threshold. "
            "Beat one: Sam and Jo face each other and decide who will speak. They hold the power. "
            "Beat two: the librarian enters, stops in the doorway, and does not sit. Both students turn and wait. The librarian now holds the next decision. "
            "Beat three: the librarian exits with the loan cards. Sam and Jo must choose again, so the power returns. "
            "A second entrance uses Jo, not the librarian. Jo arrives holding the blue nature guide. Sam and the librarian both turn to Jo because Jo now has the object everyone wants."
        ),
        guided=(
            "Sam and Jo are deciding who will tell the librarian about the lost blue nature guide. "
            "Which entrance changes who holds the power in the scene?"
        ),
        feedback=(
            "The librarian steps into the doorway and both students stop and look across for the next decision. "
            "The entrance changes power because the decision leaves the pair and waits on the person in the door. "
            "Jo wandering through while eating an apple, with nobody turning, is only a crossing. "
            "Power shifts when the people already in the scene have to aim their next choice at the newcomer."
        ),
        misconception=(
            "Walking on, waving, and leaving the same person in charge does not count as an entrance that changes power. "
            "Arriving with a louder voice has the same problem if everyone keeps deciding exactly as before. "
            "Repair it by writing who decided before the entrance and who decides after it. If those names do not change, the power did not move."
        ),
        independent=(
            "Plan a music-room entrance and exit that each change who decides, and label the decision after both. "
            "Two students have lost the folder of song pages. A third person enters, then someone leaves. "
            "For each beat, name who holds the decision and why the arrival or leaving moved it. Do not use the library doorway. "
            "The written three-beat plan is the evidence. Acting it needs an adult nearby and agreed space."
        ),
    ),
    dict(
        seed_key='s5-drama-y9-w05-l1',
        code=CODE,
        subject='arts',
        vocab=['consistency', 'role', 'exchange', 'contradiction'],
        principle=(
            "Sustaining a role means you stay the same person for a short improvised exchange, even when a new offer arrives. "
            "If Sam is worried and polite, Sam stays worried and polite for several lines, including when the news is good. "
            "Consistency is not a frozen mood. A character can feel relief if the scene gives a reason, but the way they speak and decide should still match the role you chose. "
            "A sudden silly voice, a new age, or a joke personality breaks the fiction because the audience can no longer tell who you are. "
            "Before the exchange, write three anchors: how this person stands or sits, how long their sentences are, and what they will not do. "
            "Then write four lines that obey those anchors. You may perform them only if a partner agrees and an adult is nearby."
        ),
        model=(
            "Worried, polite Sam keeps short careful sentences even after hearing that the blue nature guide is in lost property. "
            "Anchors: hands still, sentences under eight words, no jokes about the librarian. "
            "Librarian: 'Your guide is in the lost-property box.' "
            "Sam: 'Thank you. Which box is it?' "
            "Librarian: 'The blue tub by the window.' "
            "Sam: 'I will check that tub now.' "
            "The good news does not turn Sam into a comedian. "
            "A contrasting break shows the mistake: 'Sweet, I am the detective now' throws away the polite role in one line."
        ),
        guided=(
            "Sam's role is a worried, polite student who uses short careful sentences, and the librarian says the guide is in lost property. "
            "Which pair of lines keeps that role consistent?"
        ),
        feedback=(
            "Sam says thank you, asks which box, and stays quiet and careful for both lines. "
            "The words stay short, the manner stays polite, and the new fact about lost property is accepted without a new personality. "
            "A line such as 'Move, I run this library now' contradicts the role even if it is funny. "
            "Consistency lets the partner trust who they are talking to for the whole exchange."
        ),
        misconception=(
            "Swapping to a silly voice halfway through breaks a role that was chosen as careful and polite. "
            "The audience has to restart who Sam is, and the partner loses the offer they were building. "
            "You can let the feeling shift from worry toward relief if the words and manners still belong to the same person."
        ),
        independent=(
            "Write four lines for a careful lab monitor, and mark one line you would refuse because it breaks the role. "
            "The offer from the partner is that a beaker was left on the side bench, not in the library. "
            "Keep the monitor consistent for the lines you accept. Label the refused line and say which anchor it breaks. "
            "Writing the exchange is the evidence."
        ),
    ),
    dict(
        seed_key='s5-drama-y9-w05-l2',
        code=CODE,
        subject='arts',
        vocab=['projection', 'intention', 'consent', 'safety'],
        principle=(
            "Audience awareness means viewers can see and hear the intention without shouting or unagreed touching. "
            "Projecting is sending a clear speaking voice to the back of the room, with feet planted and the important words easy to catch. "
            "Shouting adds volume and often loses the want, because everything sounds like an alarm. "
            "Face slightly outward so a viewer can see both faces, and leave space between bodies. "
            "Consent means you agree the space and any contact before you start. Passing the loan card can be a mime with a gap between hands. "
            "You do not grab an arm, pull a sleeve, or move someone into a pose. If someone says stop, the scene stops. "
            "An adult stays nearby for any physical try. The written plan of voice, facing, and space is enough evidence on its own."
        ),
        model=(
            "Sam plants both feet, aims a clear speaking voice to the back row, and keeps every hand inside Sam's own space. "
            "Intention: the librarian, and anyone watching, must hear the title of the blue nature guide. "
            "Sam asks, 'Can we stand a step apart for this beat?' and waits for yes. "
            "Then Sam says the title once, at speaking level, while looking along the space between them so a viewer sees both people. "
            "The card is offered with a gap, not placed into the librarian's hand. "
            "A weaker version shouts the title and catches the librarian's sleeve. It may be loud, but it is not agreed and it buries the intention under noise."
        ),
        guided=(
            "Sam needs the librarian and a viewer at the back to hear the book title during the lost-guide scene. "
            "Which choice projects that intention safely and without touching?"
        ),
        feedback=(
            "Sam plants both feet, uses a clear speaking voice, and keeps both hands in Sam's own space. "
            "The title is easy to hear because the voice is aimed, not because it is a shout. "
            "A step of space, agreed first, lets a viewer see both faces. "
            "Grabbing a sleeve or yelling the title fails consent or buries the intention, even if the words are correct."
        ),
        misconception=(
            "Shouting so the back row hears, or touching a partner without asking, is not clear or consented acting. "
            "Volume without intention just startles people. Touch without agreement is not a drama skill in this lesson. "
            "Repair both by using a speaking voice, an open body, and a gap between hands unless you have a clear yes."
        ),
        independent=(
            "Plan three lines at the school gate about a forgotten note, with voice, space, and the no-touch rule. "
            "For each line, say what the character wants the other person to understand, how it will be heard without shouting, and where the hands stay. "
            "State that contact needs a yes and that an adult is nearby if anyone performs. Do not use the library card. "
            "The written plan is the required evidence."
        ),
    ),
    dict(
        seed_key='s5-drama-y9-w06-l1',
        code=CODE,
        subject='arts',
        vocab=['feedback', 'choice', 'effect', 'kindness'],
        principle=(
            "Appreciating a peer scene means you name one acting choice and the effect it had on you as the audience. "
            "A choice might be a pause, a still body, a short sentence, an entrance that waited in the doorway, or a voice that stayed at speaking level. "
            "The effect is what that choice made you understand, such as nervousness, urgency, or care. "
            "Kind feedback talks about the work, not about the person's body, clothes, or worth. "
            "'When you paused before the title, I believed Sam was nervous, because the librarian had to wait' is useful. "
            "'That was good' is kind but too vague to help. 'You are bad at drama' is neither kind nor specific. "
            "Give one notice, not a list of faults. The peer should be able to repeat the choice on purpose next time."
        ),
        model=(
            "Naming the pause before the book title, and the wait it caused, is specific and kind feedback on the library scene. "
            "Peer choice: Sam stops for a full breath before saying 'blue nature guide,' and the librarian does not speak over the gap. "
            "Feedback: 'When you paused before the title, I believed Sam was nervous, because the librarian had to wait with you.' "
            "That names the choice (the pause) and the effect (nervousness, shown by the wait). "
            "A second note on a different choice stays just as exact: 'Your still hands made the apology feel serious, because nothing fidgeted the moment away.'"
        ),
        guided=(
            "A peer stood completely still while the other student searched the trolley for the blue nature guide, and did not add a joke. "
            "Which audience note is kind and specific about that acting choice?"
        ),
        feedback=(
            "Your stillness made the search feel serious, because you did not fidget or break the moment with a joke. "
            "The choice is the still body. The effect is that the search felt serious to the audience. "
            "The note talks about the work, so the actor can choose stillness again on purpose. "
            "'That was really good' does not say what to keep, and a comment about someone's face or clothes is not about the acting."
        ),
        misconception=(
            "Saying only that a scene was good, or that a person is bad at drama, never names a choice or its effect. "
            "Empty praise feels kind and leaves the actor with nothing to repeat. A put-down feels honest and teaches nothing about the scene. "
            "Repair both by pointing to one thing the actor did and one thing you understood because of it."
        ),
        independent=(
            "Name one acting choice in the late-arrival scene and the effect that choice has on the audience, in two kind sentences. "
            "Scene, original and not the library: Jo enters late to a rehearsal, stops in the doorway, and sits on the floor at the edge rather than in the spare chair. "
            "The other student keeps reading aloud and does not look up until the last line. "
            "Sentence one names a choice. Sentence two names its effect. Do not score anyone, and do not comment on bodies, clothes, or worth."
        ),
    ),
    dict(
        seed_key='s5-drama-y9-w06-l2',
        code=CODE,
        subject='arts',
        vocab=['planning', 'scene plan', 'drafting', 'supervision'],
        principle=(
            "A written scene plan is the evidence for this lesson, pulling the unit's skills into one original fiction. "
            "The plan names where, when, and who; the opening offer you will accept; each character's objective; one status choice shown by posture or by who decides; one spoken line and its subtext; and an entrance or exit that changes who decides. "
            "It also names the consent rule: no touching without agreement, voices at speaking level, and an adult nearby if anyone performs. "
            "Performance is optional. A blank page is not evidence, even if the scene was tried in the lounge. "
            "The plan also repairs one misconception from this unit, such as thinking status belongs to the adult, or thinking a block is clever. "
            "Write the old mistake, the corrected idea, and a one-line example that could happen inside your new scene. "
            "Do not copy a published play. Invent the fiction yourself."
        ),
        model=(
            "A useful plan sets the lost-property room just before home time and accepts that the jumper is not in the box. "
            "Where: lost-property room. When: five minutes before home time. Who: Sam and the office helper. "
            "Offer accepted: 'Your jumper is not in the box.' "
            "Objectives: Sam wants a next place to look; the helper wants the room locked on time. "
            "Status: the helper plays low status by asking Sam which place to try next, shown by waiting with the keys still. "
            "Line and subtext: Helper: 'The box is the only one I checked.' (Want: Sam should know the search was small.) "
            "Exit: the helper leaves with the keys, so Sam must decide the next place alone. "
            "Consent: no touching, speaking voices, adult in the room if performed. "
            "Misconception repair: high status is not the adult. In this plan the helper can play low status by letting Sam decide."
        ),
        guided=(
            "A classmate's plan says only that two people will be funny in a shop. "
            "Which missing pieces must be added so this is a real improvised scene plan?"
        ),
        feedback=(
            "Add the opening offer, each character's objective, one circumstance, and the consent rule before anyone performs. "
            "Funny is not yet a fiction. The plan needs a fact to accept, a want for each person, a where or when or who, and a clear no-touch agreement. "
            "Status, subtext, and an entrance can follow, but those four pieces stop the plan being a blank joke. "
            "Acting the shop scene without writing them does not replace the plan."
        ),
        misconception=(
            "Leaving the page blank because the scene was acted in the lounge treats the performance as the only evidence. "
            "This lesson asks for the written plan, including the repaired misconception. "
            "A performance can happen afterwards, only with a consenting partner and an adult supervising, and it is still optional. "
            "The page is what you submit."
        ),
        independent=(
            "Write a full scene plan for a new fiction, not the library or lost property, and repair one misconception. "
            "Include where, when, and who; the opening offer; each objective; one status choice shown by posture or decision; one line of dialogue with subtext; an entrance or exit that changes who decides; and the consent and safety rule. "
            "Then name one old mistake from this unit, the corrected idea, and a one-line example inside your new scene. "
            "Do not copy the jumper plan. If you perform, everyone agrees and an adult supervises. The writing is the required evidence."
        ),
    ),
]

VISUALS = {
    's5-drama-y9-w01-l1': [
        pair_visual(
            'Offer', 'Guide was due yesterday',
            'Accept', 'I will check the bag hooks',
            'An offer that the nature guide is overdue, beside a line that accepts it inside the library fiction.',
            'Accept the new fact and stay in the story.',
        ),
        pair_visual(
            'In the fiction', 'Answer as Sam',
            'Stepping out', 'I do not know the plot',
            'Staying inside the library fiction contrasted with stepping out of the story.',
            'Answer as the character, not as yourself.',
        ),
    ],
    's5-drama-y9-w01-l2': [
        pair_visual(
            'Yes, and', 'Date washed off at bubblers',
            'Blocking', 'No, it was not due',
            'A Yes, and extension of the due date beside a blocking denial.',
            'Add a new detail instead of cancelling the offer.',
        ),
        pair_visual(
            'New detail', 'Partner can use the bubblers',
            'Dead end', 'No fact left to play',
            'A playable new detail contrasted with a block that leaves nothing for the partner.',
            'Extending gives your partner something to use.',
        ),
    ],
    's5-drama-y9-w02-l1': [
        pair_visual(
            'High status', 'Stands tall and decides',
            'Low status', 'Waits to be told',
            'High status shown by an upright decision, beside low status shown by waiting.',
            'Status is posture and who decides, not a stereotype.',
        ),
        pair_visual(
            'Not the job', 'Librarian can wait',
            'This moment', 'Body and decision',
            'The librarian playing low status, so the job does not set the status.',
            'The same person can play high or low status.',
        ),
    ],
    's5-drama-y9-w02-l2': [
        pair_visual(
            'Objective', 'Help before the bus',
            'Action', 'Holds out the loan card',
            'Sam\'s want beside the card held out so the librarian can see it.',
            'The audience reads the want from what you do.',
        ),
        pair_visual(
            'Played want', 'Look at the clock',
            'Announcement', 'My objective is help',
            'A visible clock glance contrasted with announcing the objective to the audience.',
            'Do the want; do not label it from outside the scene.',
        ),
    ],
    's5-drama-y9-w03-l1': [
        pair_visual(
            'Where when who', 'Library, bus due, two people',
            'Swap the when', 'Lunch queue, same book',
            'Given circumstances listed beside one changed time for the same missing book.',
            'Changing one circumstance changes how the scene is played.',
        ),
        pair_visual(
            'One swap', 'Quiet desk to corridor',
            'Same want', 'Find the book, shorter line',
            'The place changes while the missing book stays, so the first line changes pace.',
            'Keep two circumstances and change only one.',
        ),
    ],
    's5-drama-y9-w03-l2': [
        pair_visual(
            'Dialogue', 'The trolley is empty',
            'Subtext', 'Please stop searching now',
            'A polite spoken line beside the librarian\'s want to end the search.',
            'The words and the want under them are different.',
        ),
        pair_visual(
            'Four lines', 'Ordinary polite words',
            'Underneath', 'Time versus more searching',
            'A four-line scene of ordinary words with competing wants underneath.',
            'Subtext is the objective sitting under the line.',
        ),
    ],
    's5-drama-y9-w04-l1': [
        pair_visual(
            'Freeze', 'Kneeling, stamp held back',
            'Relationship', 'Asking and withholding',
            'A freeze pose with Sam low and the stamp held back, showing the relationship.',
            'The still picture shows who wants what.',
        ),
        pair_visual(
            'Caption', 'Wants the trolley reopened',
            'Weak caption', 'This is the library',
            'A caption that names the objective beside a caption that only names the place.',
            'The caption should name what the character wants.',
        ),
    ],
    's5-drama-y9-w04-l2': [
        pair_visual(
            'Before entrance', 'Sam and Jo decide',
            'Librarian enters', 'Both look to the door',
            'The decision sitting with two students, then shifting when the librarian enters.',
            'An entrance can change who the scene waits for.',
        ),
        pair_visual(
            'Exit', 'Librarian leaves',
            'Power returns', 'Students choose again',
            'An exit that hands the decision back to the people left in the scene.',
            'Who leaves changes who holds the decision.',
        ),
    ],
    's5-drama-y9-w05-l1': [
        pair_visual(
            'Consistent role', 'Polite and careful lines',
            'Break', 'Sudden joke voice',
            'A polite role held across the exchange, beside a sudden joke that breaks it.',
            'Stay the same person unless the scene gives a reason.',
        ),
        pair_visual(
            'New offer', 'Guide is in the box',
            'Same person', 'Short careful thanks',
            'Good news arrives and the careful student still answers in short polite lines.',
            'A new fact does not swap your personality.',
        ),
    ],
    's5-drama-y9-w05-l2': [
        pair_visual(
            'Project', 'Clear voice to the back',
            'Shouting', 'Volume without the want',
            'A clear speaking voice aimed to the back, contrasted with shouting.',
            'Be heard by aiming the intention, not by yelling.',
        ),
        pair_visual(
            'Consent', 'Ask, then leave a gap',
            'No touch', 'Hands stay in own space',
            'Agreeing the space first, with hands kept in your own space.',
            'Do not touch a partner without agreement.',
        ),
    ],
    's5-drama-y9-w06-l1': [
        pair_visual(
            'Specific note', 'The pause showed nerves',
            'Vague note', 'That was really good',
            'Feedback that names a pause and its effect, beside praise that names nothing.',
            'Name one choice and the effect it had.',
        ),
        pair_visual(
            'About the work', 'Stillness made it serious',
            'About the person', 'You are bad at drama',
            'A note about an acting choice contrasted with a comment about the person.',
            'Talk about the choice, kindly and precisely.',
        ),
    ],
    's5-drama-y9-w06-l2': [
        pair_visual(
            'Written plan', 'Offer, want, who, where',
            'Optional acting', 'Adult supervises',
            'A written scene plan as the required evidence, with acting marked optional.',
            'The plan is the evidence; performing is optional.',
        ),
        pair_visual(
            'Old mistake', 'Status means the adult',
            'Repaired idea', 'Helper can let Sam decide',
            'A status misconception beside a repaired example inside the scene plan.',
            'Name the old mistake and the corrected idea.',
        ),
    ],
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
