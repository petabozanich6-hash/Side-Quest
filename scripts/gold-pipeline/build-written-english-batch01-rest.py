#!/usr/bin/env python3
"""Stage 2 Year 3 English Written Core: ten individually specified lessons.
These are distinct hand-authored subject lessons, not generic topic summaries.
Phase 2 videos, animation and interactive work are deliberately excluded.
"""
from pipeline import ROOT, reconstruct, baseline_data, atomic_json
from episode_support import room_episode
import json

def topic(code, mission, outcome, stages, independent, parent, vocab):
    return dict(code=code, mission=mission, outcome=outcome, stages=stages,
                independent=independent, parent=parent, vocab=vocab)

# Each teaching stage: (heading, concept, worked model, pupil attempt, correction, error trap).
UNITS = [
topic('s2-eng-y3-w01-l4','Tell an original story aloud and make readable notes that help a listener follow it.','EN2-OLC-01',[
('Tell events in an order that makes sense','A listener needs to know what happened first, next and at the end. Temporal words signal changes, but events must also connect logically.','I tell a short story about losing my hat: First I put it on near the oval. Next the wind carried it over the fence. Then the groundskeeper returned it. Finally I thanked her. Each event leads naturally to the next.','Put these events in sensible order: We dried the dog; the dog jumped in a puddle; we went home.','The dog jumped in a puddle. We went home. We dried the dog. Drying follows getting wet.','Do not assume saying finally makes an event a logical ending.'),
('Give your listener a clear character and place','An orientation tells listeners who is involved and where events occur. Without it, later pronouns and actions are confusing.','Instead of starting "It went missing", I begin "On Saturday, Zara left her red kite beside the beach path." Now a listener can picture Zara, the kite and the location.','Improve the opening "He ran away" by naming the character, place and reason for moving.','One option: "At the school oval, Ben ran towards the gate to catch his rolling ball." It answers who, where and why.','A listener cannot see the picture in your head; introduce new people and places.'),
('Choose the most useful notes','Speaking notes should be short prompts, not every word of the speech. Key nouns and verbs help you remember without reading a script.','For my hat story, I write four lines: oval—hat; wind—fence; groundskeeper—returns; thank you. I can tell the complete sentences aloud from these cues.','Shorten "Then the gardener found the missing bucket beside the tree" into three or four note words.','"gardener / bucket / beside tree" preserves the important detail; full grammar is not required in notes.','Do not copy whole paragraphs into note cards, because you may read rather than tell.'),
('Speak, listen and improve one detail','A practice retell lets you check if events make sense aloud. Use pauses and an audible voice; invite a listener to say which part was unclear.','I tell the hat story, pause after the wind blows, and ask "Could you tell where the hat went?" If the listener asks which fence, I add "the fence beside the tennis court".','Read these notes aloud as a two-sentence story: rain—path / sister—umbrella. Add a pause between events.','"Rain soaked the path. My sister opened her umbrella." Pause naturally after the first complete thought.','Speaking quickly does not make a story clear; rehearse meaning and pace.')],
'Plan a real or invented four-event story about an unexpected visitor. Make four brief cue lines (not full sentences), tell the story in four or five complete spoken sentences, then record which cue helped most and one improvement you made after rehearsing. Write or record the final version.',
'Check notes are genuinely brief, events connect, who and where are introduced, and the recorded or transcribed retelling is understandable; reward oral fluency separately from spelling.',
['orientation','event','cue words','listener']),
topic('s2-eng-y3-w02-l1','Recognise how characters, settings and connected events create a complete narrative.','EN2-RECOM-01',[
('Meet the character','A character is a person, animal or imagined being who takes part in a story. Look for what a character wants and does, not only a name.','In "Aria searched for her missing compass", Aria is the character and recovering the compass is her goal. Her decision to search starts the action.','In "The koala waited for rain", name the character and one likely goal.','The koala is the character; it may need water or cooler weather. The goal is an inference, not a fact unless the text says so.','A narrator and a character are not automatically the same person.'),
('Build a setting from clues','Setting means where and when a story takes place. Details such as heat, shadows and signs help readers picture the scene.','"Before sunrise, the jetty was slippery with sea spray" tells time (before sunrise) and place (the jetty). Both influence what characters can safely do.','Find a place and time clue in "At midnight, lanterns glowed outside the campsite".','At midnight is the time; outside the campsite locates the scene. The lanterns contribute atmosphere.','A mood word alone does not reliably establish a physical setting.'),
('Follow the plot as cause and effect','A plot is not just a list of actions: usually one event creates a problem or changes what a character does next.','Mika loses the library book (problem), searches the bus (response), and finds it with the driver (resolution). The search happens because of the loss.','Explain why this event follows the first: "A storm snapped the tent rope. Dad grabbed the spare rope."','Dad acts because the storm damaged the rope; the second event responds to the problem.','If events could be shuffled with no effect, explain what links them.'),
('Explain the three elements together','Character, setting and plot work together: what a character wants in a particular place helps create the events. Cite evidence from the text.','"At the rocky beach, Eli chased his escaping bucket and caught it before the tide." Character: Eli. Setting: rocky beach and rising tide. Plot: bucket escapes, Eli chases and retrieves it.','Identify character, setting and connected events: "At the fair, Anya dropped her ticket but found it under a bench."','Anya is the character; the fair is the setting; she loses then finds her ticket. The loss causes the search.','Do not invent a missing ending and present it as a stated event.')],
'Read this original text: "At the town garden, Noor planted a sunflower seed. A curious crow uncovered it. Noor placed smooth stones around the pot, and the seed stayed safe." Identify the character, place, problem, response and ending; quote one phrase as evidence for each. Write a new four-sentence story where the setting changes what the character must do.',
'Model identification: Noor; town garden; crow uncovered seed; stones around pot; seed remained safe. New story must have own character, clear setting and linked beginning/problem/action/end.',
['character','setting','plot','evidence']),
topic('s2-eng-y3-w02-l2','Plan a story using the rise and fall of a story mountain before drafting.','EN2-CWT-01',[
('Begin on the mountain foothill','The orientation introduces a character and setting before a major difficulty happens. A reader needs a reason to care what changes.','Opening: "After school, Tali checked her vegetable patch behind the house." We know who is present and where; no problem is required yet.','Add a setting to the opening "Jai opened the box."','Example: "On the kitchen floor, Jai opened the old wooden box." The setting is now clear.','Beginning with five mysterious problems at once can confuse your reader.'),
('Climb when a problem appears','The complication is a problem, challenge or unexpected event that changes the character\'s ordinary plan. Make it specific.','In the garden story, Tali finds tiny footprints among damaged seedlings. The footprint clue starts a problem: who or what is visiting?','Invent one problem that could interrupt a picnic beside a creek.','A rising creek might wash away the picnic basket; a sudden change creates an action the character must take.','"Then something happened" does not tell a reader what actually changed.'),
('Reach the peak with an important choice','The climax is often the most tense or important choice. It should grow from the problem rather than arrive randomly.','Tali waits at dusk, sees a wallaby nibbling leaves and chooses to build a safe barrier instead of frightening it. Her discovery leads to a decision.','What could your picnic character do when the basket floats towards a low bridge?','They could call an adult and safely reach the basket using a long branch from dry ground; avoid risky entry into water.','A climax is not necessarily a loud or dangerous event; it can be a meaningful decision.'),
('Come down to a satisfying ending','Resolution shows what changed and how the main difficulty was addressed. Connect it to the original problem.','Tali protects the garden with netting that does not trap wildlife. Her seedlings recover, and she leaves space for the wallaby to travel.','Write an ending to a story where a friend misplaces the class library key.','Example: A classmate spots the key near the bookshelf, returns it and the class agrees on a safe hook.','Avoid an unrelated miracle solution that ignores the characters\' earlier actions.')],
'Make a five-stop mountain plan for a lost invitation: orientation, complication, rising action, important choice and resolution. Write 1–2 original sentences at each stop, then explain how the climax follows the problem and how the ending solves it.',
'Check five connected stages and original text. A mountain is a planning model, not a demand for physical mountains in the story.',
['orientation','complication','climax','resolution']),
topic('s2-eng-y3-w02-l3','Choose nouns, verbs and adjectives to make sentences precise and readable.','EN2-CWT-01',[
('Name people, places and things with nouns','A noun names a person, place, object or idea. Some nouns are common (river), while names of particular people or places are proper nouns (Murray River).','"The mechanic repaired a bicycle." Mechanic and bicycle name things; repaired tells the action.','Find two nouns in "A pelican balanced on the post".','Pelican and post are nouns. Balanced is an action verb.','A word is not a noun just because it appears early in a sentence.'),
('Show actions and states with verbs','Verbs help a sentence tell what happens or what something is like. Choose a strong verb when it adds meaning.','"The puppy moved" is vague; "The puppy scampered" suggests quick, playful steps. "The puppy was tired" uses was to tell a state.','Swap "went" for a more specific verb in "The cyclist went downhill".','"The cyclist coasted downhill" explains the manner of movement more precisely.','Do not assume every verb describes visible movement; is and seems can also be verbs.'),
('Describe useful properties with adjectives','An adjective adds information about a noun. Choose details readers need rather than filling every sentence with colour words.','"The slippery path" warns about a surface. In "The slippery, narrow path twisted uphill", both adjectives help picture the danger and shape.','Add one helpful adjective to "The lantern hung above the door".','"The cracked lantern hung above the door" gives condition. Many other precise choices are possible.','Adding four similar adjectives can weaken rather than strengthen a sentence.'),
('Combine all three without confusing the reader','Find the main noun and verb first, then choose whether a descriptive word adds valuable detail. Read the revision aloud.','Draft: "The bird flew." Revision: "The startled rosella darted between branches." Nouns: rosella, branches. Verb: darted. Adjective: startled.','Improve "The car moved on the road" with one precise noun, verb and adjective.','Example: "The rusty ute rattled along the gravel road." Ute and road are nouns; rattled is verb; rusty and gravel specify details.','Do not mistake an adverb describing a verb for an adjective describing a noun.')],
'Analyse the nouns, main verb and adjectives in "The determined ranger carried a heavy bag along the dusty track." Then revise three sentences of your own about a beach, a library and a storm. Label one noun, verb and adjective in each revised sentence and explain the improvement.',
'Require accurate word classifications; determined, heavy and dusty modify nouns; carried is action. Different correct descriptive revisions accepted.',
['noun','verb','adjective','precise']),
topic('s2-eng-y3-w02-l4','Retell a story aloud using essential events, connecting words and a clear voice.','EN2-OLC-01',[
('Listen for the important events','A retell keeps the main character, problem, important actions and outcome. It does not need every decorative detail.','Original: "Luca carried a bag of apples. A handle broke on the bridge. Luca gathered the apples with a friend and tied the bag." Retell: "Luca dropped apples when his bag broke, then fixed it with help."','Which matters more: the colour of Luca\'s shoes or the broken bag? Explain.','The broken bag creates the problem and leads to the actions; the shoe colour does not explain the plot.','Retelling is not copying every sentence word-for-word.'),
('Put the events in logical sequence','Use first, next, then and finally only when they match what happened. A wrong order changes meaning.','First the handle breaks. Next apples scatter. Then Luca and a friend collect them. Finally they repair the bag. If the repair came first, it would not explain the problem.','Order: "The map was found; Priya looked under the bed; Priya lost the map."','Priya lost the map; looked under the bed; found it. The search responds to the loss.','Do not begin a retell with the resolution and leave the listener wondering why.'),
('Speak in your own words','Paraphrasing shows understanding. Keep the same meaning while changing how you explain it.','Text: "The frightened kitten squeezed beneath the veranda." My retell: "The scared kitten hid under the veranda." The same event remains true.','Retell "The children hurried towards shelter when rain started" in your own words.','Example: "When it began raining, the children rushed somewhere dry." The meaning remains.','Do not add details the original never gave, such as naming a stranger who did not appear.'),
('Use expression and check listener understanding','Adjust pace, volume and emphasis to show the important parts; then ask the listener whether your retell made sense.','I slow down at "the bag broke", pause, then say what Luca did. I ask "What was Luca\'s problem?" If the listener cannot answer, I include the missing detail.','Retell the apple story in three sentences and choose where to pause for a listener.','Pause after introducing the broken handle and before the solution. State the problem and outcome clearly.','A loud voice is not automatically clear; pace and meaningful pauses help comprehension.')],
'Read this passage twice: "In the afternoon, Ruby found a wet notebook on the bus seat. She dried it at home and recognised a name on the cover. The next morning, she returned it to its owner at school." Write four cue words, give a spoken retell of three to five sentences, then explain which detail you left out and why.',
'Check the retell keeps Ruby, wet notebook, response and return. Record oral performance where possible; spelling in notes is not the oral-language target.',
['retell','sequence','paraphrase','expression']),
topic('s2-eng-y3-w03-l1','Make predictions from evidence and ask questions that deepen understanding.','EN2-RECOM-01',[
('Predict, do not simply guess','A prediction is a reasonable idea about what might happen next based on clues and what you already know. Explain the clue.','Text: "Clouds darkened and Mara packed her picnic blanket." Prediction: Mara expects rain. Evidence: dark clouds and packing. I may be wrong, but I have a reason.','Predict what happens after "The dog scratched at the back door and whined".','Perhaps it wants to go outside. Scratching at the door and whining are clues; this is not certain.','A wild guess with no textual reason is not a supported prediction.'),
('Ask questions while reading','Questions about who, why, how and what might happen help us monitor meaning. Some answers appear directly; others need inference.','Reading "Sam left the gate open", I ask "Who noticed?" and "Could an animal escape?" The first may be answered later; the second is a possibility worth checking.','Ask one question after "Leah stared at the empty nest".','"Where did the birds go?" or "How does Leah feel?" are useful questions because the text raises uncertainty.','An interesting question is not necessarily answered by the available text.'),
('Update a prediction with new evidence','A good reader changes a prediction when new details make it less likely. Revising is thoughtful, not failure.','At first I predict a storm because the sky is dark. Then the story says a bushfire is spreading smoke. I update: dark sky came from smoke, not rain.','Your prediction is a lost dog. New line: "Its owner whistled and it came running." Update your idea.','The dog may not be lost; it recognises its owner and responds to the whistle.','Do not cling to your first prediction after contrary evidence appears.'),
('Distinguish fact, clue and possibility','A fact is stated; a clue is a detail we use; a prediction is what may occur. Keep them separate when explaining.','"The torch flickered" is a stated fact. It may be low on batteries is an inference or prediction. "It will certainly stop" goes beyond what is known.','Identify fact and prediction: "The path was wet, so I think someone used the hose."','Fact: path was wet. Prediction/inference: someone used the hose; rain or another cause is also possible.','Do not claim that your idea happened simply because it is plausible.')],
'Read: "The library lights flickered. Ella heard a click from the corridor. She shut her book and walked towards the desk." Write two predictions with different clues, three useful questions and an updated prediction after adding your own plausible next sentence. Label facts versus possible explanations.',
'Reward evidence-linked predictions and willingness to revise. Many imaginative answers are acceptable but details claimed as facts must appear in the passage.',
['prediction','question','clue','revise']),
topic('s2-eng-y3-w03-l2','Write a clear story orientation and complication that belong together.','EN2-CWT-01',[
('Start with the situation before the problem','An orientation introduces who, where and often when. It creates an ordinary situation that can later change.','"Before breakfast, Asha arranged shells on the veranda." The reader knows the character, location and time. There is not yet a problem.','Extend "Milan waited" to include a meaningful place and time.','"After school, Milan waited at the bus stop" establishes time and place without introducing a complication.','Opening with pronouns without names can hide important information.'),
('Show a complication rather than announce one','A complication upsets an expectation or gives the character something to solve. Show the concrete event.','"A sudden gust scattered Asha\'s shells into the garden." The disruption grows from what she was doing. "Then there was a problem" would hide it.','Add a problem that belongs after "At the bakery, Niko carried a tray of buns".','Example: "The tray tipped when the shop door swung open." The action creates a concrete difficulty.','An unrelated dragon appearing without context can make the problem feel disconnected.'),
('Connect cause and effect','The complication should matter to the character introduced in the orientation. Connect it through what the character wants or is doing.','Asha wanted to sort her shells. The gust scatters them. She must recover and sort them again; the complication interrupts her goal.','Explain the cause-and-effect connection between a spilled paint pot and an artist\'s interrupted picture.','The spill damages the artwork or materials, so the artist needs to repair the damage before finishing.','Do not add events that happen near the character but change nothing about their goal.'),
('Leave a meaningful question for the next paragraph','An effective opening makes a reader wonder how the character will respond, without giving away the entire resolution.','"Asha spotted one special shell caught on the top branch. How could she reach it safely?" Now the story can continue with an attempt to solve the challenge.','Write an opening about a misplaced invitation, stopping just before the character decides what to do.','Example: "Jules checked the empty drawer. The invitation had vanished, and the party began in an hour." The response can come next.','Do not solve the problem immediately if the task is to practise orientation and complication only.')],
'Write an original narrative opening of two paragraphs, five to eight sentences total: introduce a child arriving somewhere unfamiliar, then introduce a practical problem connected to that place. Underline the orientation clues; circle the sentence where the complication begins; explain how the problem changes the character\'s plan.',
'Look for a concrete character, setting and caused problem. Do not demand a complete ending because this lesson assesses the opening.',
['orientation','complication','cause','hook']),
topic('s2-eng-y3-w03-l3','Use past and present tense consistently and choose adverbs that clarify actions.','EN2-CWT-01',[
('Locate the time of the action','Verb tense helps a reader know whether something happens now or happened earlier. Regular past verbs often end in -ed, but many are irregular.','"The possum climbs" describes what it does now or regularly. "The possum climbed" tells a past event. "The possum went" is past although it does not end in ed.','Change "The girl jumps over the puddle" to past tense.','"The girl jumped over the puddle" moves the action to the past.','Not every past-tense verb ends in ed; write went, not goed.'),
('Keep the time consistent across a paragraph','When telling past events, choose past tense for the main actions unless there is a clear reason for a time shift.','Draft: "Mira opened the gate and sees a fox." Both actions happened in the story\'s past, so I revise: "Mira opened the gate and saw a fox."','Repair "Yesterday we walk to the creek and found smooth stones".','"Yesterday we walked to the creek and found smooth stones." The two main verbs are past tense.','Do not change only one verb and leave others in the wrong time.'),
('Adverbs can explain how, when or where','An adverb often gives more information about a verb. Many end in -ly, but not all do; some words work differently in different sentences.','"The cyclist pedalled carefully" explains how. "Soon the cyclist rested" explains when. "The cyclist rode outside" tells where. An adverb need not end in ly.','What is the adverb in "The children waited patiently"? What does it explain?','Patiently tells how the children waited; it adds to the meaning of the verb waited.','Not every word ending ly is an adverb, and not every adverb ends in ly.'),
('Revise for accurate meaning, not adjective clutter','Choose one useful adverb when it adds information. Check tense before polishing description.','"She loudly shouted" repeats the loud idea, but "She whispered urgently" clarifies a quiet action with a strong reason. I check the past tense whispered before adding urgently.','Improve "The driver stopped" to show that stopping was cautious and happened yesterday.','"Yesterday the driver stopped carefully" is clear; slowly or safely could fit another context.','Avoid an adverb that contradicts or simply repeats the verb.')],
'Correct the tense in "Yesterday Ben runs to the jetty and finds a lost glove." Then write four connected past-tense sentences about helping at a garden. Include two useful adverbs, underline every main verb and explain one adverb choice. Revise any accidental switches to present tense.',
'Expected correction: "Yesterday Ben ran to the jetty and found a lost glove." Accept varied garden narrative if the main sequence stays in past tense and adverbs make sense.',
['tense','past','present','adverb']),
topic('s2-eng-y3-w03-l4','Read a short readers-theatre script aloud using character voice, punctuation and turn-taking.','EN2-OLC-01',[
('Read the script as a conversation','A readers-theatre script names each speaker so actors know when their lines begin. The characters do not need to memorise words.','MIA: "Where is the map?" LEO: "I put it on the desk." The labels identify the speakers. The words in quotation marks are what each actor says aloud.','In "ZOE: I found it! MAX: Where?", who asks the question?','Max asks "Where?" because the speaker label MAX precedes the question.','Do not read speaker labels aloud as if they are part of the dialogue unless introducing a character.'),
('Let punctuation guide expression','A question mark often signals an asking voice; an exclamation mark adds urgency or excitement. Meaning determines how strongly to read them.','"Is the door open?" is curious. "The door is open!" may sound surprised or excited. I practise both and avoid shouting every exclamation.','Try reading "You found it?" as disbelief, then as a happy question.','Both versions ask a question. Voice and context reveal whether the speaker is doubtful or delighted.','Punctuation helps, but not every question must end with a rising pitch.'),
('Use pace, pauses and character clues','Read the whole line to understand the feeling; then change speed or volume to reflect a shy, worried or confident character.','Script: "AVA (whispering): I think the dog is asleep." I use a quiet voice, pause after think and avoid yelling the last word.','Read "FINN (out of breath): Wait for me!" showing the stage direction.','A breathy, slightly hurried delivery suits someone running to catch up; the words must still be understandable.','Acting quickly at the cost of understandable words defeats the purpose of oral reading.'),
('Listen and respond on your turn','Good performance needs active listening. Pause to allow the previous line to finish; do not overlap unless the script requests it.','MIA: "Look by the window." (pause) LEO: "There it is!" Leo starts after Mia finishes. I can rehearse with a partner or voice each role separately.','Explain when the second speaker should begin after "SAM: Can you help? TAY: Of course."','Tay responds after Sam finishes the question, with a natural conversational pause.','Reading your own lines clearly is only half the performance; you must also attend to others.')],
'Perform this original script with a partner or record both voices: "RUBY (worried): The seedling has wilted! / NOAH (calmly): Let us check the soil. / RUBY: It feels dry. / NOAH: Then we can water it gently. / RUBY (relieved): I hope it recovers!" Mark three expression choices, practise twice and note one improvement in pace or clarity.',
'Check accurate speaker turns, expression matched to dialogue and stage directions, understandable oral delivery, and a specific self-review. A solo two-voice recording is acceptable.',
['script','dialogue','expression','turn']),
topic('s2-eng-y3-w04-l1','Infer unstated meaning by combining textual clues with careful reasoning.','EN2-RECOM-01',[
('Separate what the text says from what you infer','A statement gives a fact directly; an inference is a reasonable conclusion based on clues. State both, so a reader can see your reasoning.','Text: "Nia wiped her muddy shoes before entering." Fact: shoes were muddy and she wiped them. Inference: she wanted to avoid making the floor dirty. The text does not directly state that reason.','Infer why "Ari reached for a jumper when the wind grew sharp".','Ari likely felt cold or expected to feel cold. Clues: sharp wind and reaching for a jumper.','Do not call an inferred feeling a stated fact when the text never names it.'),
('Gather more than one useful clue','Good inferences become stronger when several clues point towards the same idea; one clue may have different explanations.','"The empty lunchbox rattled. Jax looked at the clock and sighed." I infer Jax is hungry or disappointed. An empty box, clock-check and sigh together support the idea.','What might "Suri checked the road twice and kept holding her envelope" suggest?','She may be anxious about delivering something or waiting for someone. Both behaviours suggest concern, but the text is not specific.','Do not turn one vague clue into a certain explanation.'),
('Explain the bridge between evidence and conclusion','A strong answer follows: I infer __ because the text says __ and I know __. That final step is reasoning, not an invented quote.','"The grass glittered white at dawn." I infer frost is possible because white glitter on early morning grass often comes from ice crystals in cold weather. But it could be another source; I need more context.','Complete: "I think the shop is closing because the sign says CLOSED and the worker turns the lights off."','Conclusion: shop is closing or closed. Evidence: sign and lights, not a guess about the worker\'s mood.','Avoid quoting a clue that does not actually support the conclusion.'),
('Revise or limit an inference when evidence is weak','Two explanations can fit one clue. Look for confirming details and admit what you cannot tell yet.','"The puppy hid under a chair." It may be frightened, tired or playing. If the next line mentions thunder, fear becomes a stronger inference.','A child smiles at a note. Name two possible feelings and what extra clue would help decide.','Pride or amusement are plausible; reading the note or seeing the child\'s next action would help.','A confident answer is not automatically accurate when details are missing.')],
'Read: "The hall was silent. Theo clutched a folded paper, glanced at the stage and took a long breath. When his name was called, he stood up." Write three inferences about Theo or the situation, quote a specific clue for each, explain which inference is strongest and suggest one new detail that could change your interpretation.',
'Accept cautious supported inferences (nervous, excited, preparing to speak or receive an award), but do not treat an unstated event as confirmed. Require a quotation or exact clue each time.',
['fact','inference','evidence','interpretation'])
]

def esc(t):
    return (t.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;').replace('"','&quot;'))

def pair_visual(left_title, left_text, right_title, right_text, alt, caption):
    svg=(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 660 150">'
         f'<rect x="10" y="12" width="310" height="126" rx="14" fill="#fff4ea" stroke="#b87445"/>'
         f'<rect x="340" y="12" width="310" height="126" rx="14" fill="#e8f5ed" stroke="#297a61"/>'
         f'<g font-size="16" fill="#263948">'
         f'<text x="28" y="42">{esc(left_title)}</text>'
         f'<text x="28" y="78">{esc(left_text[:42])}</text>'
         f'<text x="358" y="42">{esc(right_title)}</text>'
         f'<text x="358" y="78">{esc(right_text[:42])}</text>'
         f'</g></svg>')
    return dict(svg=svg, alt=alt, caption=caption)

VISUALS = {
  's2-eng-y3-w01-l4': [
    pair_visual('First','hat on near the oval','Next','wind carries it over the fence',
      'Story events ordered as hat on oval then wind carrying it over the fence.',
      'Events follow a cause: the hat must be worn before the wind can take it.'),
    pair_visual('Cue notes','oval — hat','Spoken sentence','I put my hat on near the oval.',
      'Brief cue notes oval and hat beside the full spoken sentence they prompt.',
      'Notes stay short so the speaker tells the story instead of reading a script.')
  ],
  's2-eng-y3-w02-l1': [
    pair_visual('Character + goal','Aria searches for a compass','Setting clues','before sunrise on a jetty',
      'Character Aria searching for a compass contrasted with jetty setting clues before sunrise.',
      'A character wants something; setting tells where and when that wanting happens.'),
    pair_visual('Problem','library book is lost','Response','search the bus then find it',
      'Plot linked as a lost library book causing a search of the bus and a recovery.',
      'Plot is cause and effect, not a shuffled list of actions.')
  ],
  's2-eng-y3-w02-l2': [
    pair_visual('Orientation','Tali checks her vegetable patch','Complication','tiny footprints among seedlings',
      'Story mountain start with Tali in the garden then footprints among seedlings.',
      'The ordinary situation is established before a specific problem appears.'),
    pair_visual('Important choice','build a safe barrier','Resolution','netting that still lets wildlife pass',
      'Climax choice of a safe barrier leading to a resolution that protects plants and wildlife.',
      'The ending should grow from the character choice, not from an unrelated miracle.')
  ],
  's2-eng-y3-w02-l3': [
    pair_visual('Nouns','mechanic, bicycle','Verb','repaired',
      'Sentence parts labelled: nouns mechanic and bicycle with verb repaired.',
      'Nouns name people or things; the verb tells the action.'),
    pair_visual('Vague draft','The bird flew.','Precise revision','The startled rosella darted between branches.',
      'Vague sentence The bird flew beside a precise revision naming a startled rosella.',
      'Choose a specific noun and verb, then add an adjective only if it helps.')
  ],
  's2-eng-y3-w02-l4': [
    pair_visual('Keep this','bag handle breaks on the bridge','Leave this','colour of Luca shoes',
      'Essential retell event of a broken bag contrasted with an unimportant shoe colour.',
      'A retell keeps the problem and outcome, not every decorative detail.'),
    pair_visual('Original wording','squeezed beneath the veranda','Own words','hid under the veranda',
      'Paraphrase of a kitten hiding under the veranda using different wording with the same meaning.',
      'Paraphrase changes the words while keeping the same event true.')
  ],
  's2-eng-y3-w03-l1': [
    pair_visual('Clue','Clouds darkened','Supported prediction','Mara packed because rain may come',
      'Dark clouds used as a clue for the prediction that Mara packed for rain.',
      'A prediction needs a clue from the text, not a wild guess.'),
    pair_visual('First idea','dark sky means storm','Updated idea','smoke from a bushfire',
      'A first storm prediction revised when smoke from a bushfire explains the dark sky.',
      'New evidence can change a prediction; revising is thoughtful, not failure.')
  ],
  's2-eng-y3-w03-l2': [
    pair_visual('Orientation','Before breakfast, Asha arranged shells','Complication','A gust scattered the shells',
      'Asha arranging shells on the veranda before a gust scatters them.',
      'Show the ordinary situation first, then a concrete event that interrupts it.'),
    pair_visual('Connected problem','shells were her goal','Reader question','How can she reach the top branch safely?',
      'Complication connected to Asha wanting the shells and a hanging question about reaching a branch.',
      'The problem should matter to the character and leave a question for the next paragraph.')
  ],
  's2-eng-y3-w03-l3': [
    pair_visual('Present','The possum climbs','Past','The possum climbed',
      'Present tense climbs beside past tense climbed for the same possum action.',
      'Tense tells whether the action happens now or already happened.'),
    pair_visual('Mixed draft','opened the gate and sees a fox','Consistent past','opened the gate and saw a fox',
      'Inconsistent sees corrected to saw so both actions stay in the past.',
      'Keep the main verbs in the same time unless there is a clear reason to shift.')
  ],
  's2-eng-y3-w03-l4': [
    pair_visual('Speaker label','MIA:','Spoken words','Where is the map?',
      'Readers-theatre line with speaker label MIA and the spoken question Where is the map.',
      'Read the spoken words, not the speaker label, unless you are introducing a character.'),
    pair_visual('Question mark','Is the door open?','Exclamation','The door is open!',
      'The same door idea punctuated as a curious question and as a surprised exclamation.',
      'Punctuation guides voice: a question often asks; an exclamation adds urgency.')
  ],
  's2-eng-y3-w04-l1': [
    pair_visual('Stated fact','Nia wiped her muddy shoes','Inference','She did not want a dirty floor',
      'Stated fact of wiping muddy shoes beside the inference that Nia wanted a clean floor.',
      'An inference is a reasoned conclusion; the text did not name the reason.'),
    pair_visual('Several clues','empty lunchbox, clock, sigh','Stronger idea','Jax may be hungry',
      'Empty lunchbox, clock glance and sigh supporting the idea that Jax may be hungry.',
      'Several clues pointing the same way make an inference stronger.')
  ],
}

# Original per-topic practice uses each unique authored scenario. The program simply
# wraps individually written content into the established lesson structure.
def make_spec(row,unit):
    base=baseline_data(row)
    l={k:v for k,v in base.items() if k in ('seed_key','stage','learning_area','year_level','week',
      'week_in_unit','lesson_number','lesson_role','subject','unit_title','unit_number')}
    criteria=[f'I can use {unit["vocab"][0]} with a specific example from this lesson.',
              f'I can identify {unit["vocab"][1]} and point to the words or events that support it.',
              f'I can practise {unit["vocab"][2]} independently on a new prompt.',
              f'I can notice {unit["vocab"][3]} needs and correct a likely mistake.']
    l.update(title=base['title'],child_mission=unit['mission'],
      learning_intention=unit['mission'],success_criteria=criteria,
      duration_minutes=55,materials=['Paper or typing area','Pencil for optional evidence'],outcome_codes=[unit['outcome']],
      source_note='Proposed Stage 2 NESA alignment; compare the existing Coming Soon card and official syllabus content points before marking verified.',
      review_status='unreviewed',**{'pass':1,'pass_mark':0.9},coming_soon=None)
    teach=[]; evidence=[]; visuals=[]
    for i,(title,idea,model,try_it,feedback,trap) in enumerate(unit['stages']):
        rationale=('This matters because a reader or listener can only understand your ideas when you notice how the language works, '
          'test your understanding on specific examples and explain the evidence for your choice. '
          'Keep the meaning of the original text rather than changing facts to make an answer sound impressive.')
        explanation=(idea+' '+rationale+' Read the model closely: which particular word, event or detail changes the meaning? '
          'Try explaining the same decision to someone else without repeating the model sentence. '
          'Then compare your new attempt with the feedback and revise anything that does not fit the actual evidence.')
        check=dict(type='multiple_choice',question=f'Which is the strongest next step when learning to {title.lower()}?',
          options=[f'Use the example and explain the clue or language choice before trying {unit["vocab"][i]} independently.',
             'Copy every sentence exactly without explaining it.',
             'Add a made-up event and describe it as a fact.',
             'Ignore the task and choose an unrelated detail.'],correct_index=0,
          explanation='The best approach uses the specific concept, evidence and reasoning before practising independently; copying or inventing unsupported facts does not show understanding.')
        teach.append(dict(title=title,icon='📖',explain=idea+'\n\n'+explanation,
          example='WATCH MY THINKING\n'+model+'\n\nYOUR SMALL TRY\n'+try_it+'\n\nCOMPARE AND CORRECT\n'+feedback,
          notice='WATCH OUT\n'+trap+' Re-read the prompt and correct the misunderstanding before moving on.',check=check))
        evidence.append(dict(rule=idea,why=rationale,model=model,misconception=trap,
          fix='Re-read the prompt and correct the misunderstanding before moving on.',
          guided_attempt=try_it,feedback=feedback))
    visuals=list(VISUALS[unit['code']])
    teach[0]['visual']=[visuals[0]]
    teach[1]['visual']=[visuals[1]]
    model=unit['stages'][0][2]
    teach[0]['visual_before']=[room_episode('Talk through the first model', [
        ('pip','I read the first example, but I am not sure which detail matters most.'),
        ('juno','Name the exact words or events that carry the meaning before you copy a conclusion.'),
        ('pip','So I should try the small prompt myself, then compare it with the feedback.'),
        ('juno','Pause here. Use this model: '+model[:120]+' Then write your own attempt.', True),
    ])]
    l['teach_steps']=teach
    l['worked_visuals']=visuals
    l['worked_example']='I DO — '+unit['stages'][0][2]+'\n\nNow look for the exact evidence in the words or actions. '+unit['stages'][1][2]
    l['guided_practice']='WE DO — attempt each prompt before comparing to the feedback.\n'+ '\n'.join(
      f'{i+1}. {st[3]}\nCOMPARE: {st[4]}' for i,st in enumerate(unit['stages']))
    l['independent_task']='YOU DO — complete the following substantial original task, not a copied model.\n'+unit['independent']
    l['response_prompt']='Submit your original independent work and your brief explanation of the key choices you made.'
    # Questions reference each individually authored concept and example, not a repeated generic quiz.
    q=[]
    distractors=[
      'Ignore the words and invent a more exciting event.',
      'Copy the model word-for-word and call that independent work.',
      'Treat a missing detail as a stated fact.',
      'Skip the prompt because the first idea sounded good.']
    for i,st in enumerate(unit['stages']):
        q.append(dict(type='multiple_choice',
           question=f'Which idea is taught in the stage "{st[0]}"?',
           options=[st[1],st[5],distractors[i % 4],distractors[(i+1) % 4]],
           correct_index=0,explanation=st[1]+' The other choices either name a known misunderstanding or avoid explaining the actual strategy.'))
    for i,st in enumerate(unit['stages']):
        q.append(dict(type='multiple_choice',
          question=f'After trying "{st[3][:80]}", which feedback is most useful?',
          options=[st[4],st[5],'Any answer is equally supported.','There is no need to compare your attempt.'],
          correct_index=0,explanation=st[4]+' This explanation uses the original evidence or language point, rather than treating a misconception as the correct response.'))
    sample1='Original demonstration: '+unit['stages'][0][2]
    sample2='Common error: '+unit['stages'][2][5]+' Correction: '+unit['stages'][2][4]
    q += [dict(type='short_answer',question=f'Use your own example to demonstrate {unit["vocab"][0]} and explain the evidence supporting your choice.',
         sample_answer=sample1,marking_guide='Require an original relevant example, accurate terminology and an explanation grounded in the example.',
         explanation='Meaningful understanding is shown when a learner transfers the method to new text or speech and explains their evidence.'),
       dict(type='short_answer',question=f'Identify and correct a common mistake relating to {unit["vocab"][2]} in this lesson.',
         sample_answer=sample2,
         marking_guide='Require a genuine relevant error, accurate correction and a reason that refers to the target concept.',
         explanation='Explaining a correction helps the learner distinguish an effective strategy from a plausible-sounding but inaccurate approach.')]
    l['quiz']=q
    l['parent_notes']=('Parent: Marking guidance: '+unit['parent']+' Accept plausible original solutions where the text supports them; require the learner to explain at least one independent choice.\n\n'
      'Parent: Written model 1: '+sample1+'\n\n'
      'Parent: Written model 2: '+sample2+'\n\n'
      'Parent: Assess comprehension and language rather than penalising speech or motor difficulties unrelated to the objective. Keep written models out of the child role.')
    l['evidence_instructions']='Keep the independent response and two written check responses; record oral retelling or performance where required by the task.'
    l['offline_alternative']='Use paper to copy only the original independent prompt; have the child respond in writing or orally as required. Save a photograph or brief parent observation for the learning record.'
    l['extension']='Create a new example using a completely different character or setting, show the same skill, then explain to another person how you checked its accuracy.'
    keys=['accept','teach0','teach1','teach2','teach3','learn','guided','write','quiz','submit']
    descriptions=[
      ('Today you will practise '+unit['vocab'][0]+'.','Read the mission before you start writing or speaking.','Your goal is: '+unit['mission']),
      *[(f'Focus on {st[0].lower()}.','Hold this teaching point: '+st[1][:120], 'Worked comparison: '+st[4][:120]) for st in unit['stages']],
      ('Study the first worked demonstration carefully.','Name the exact words or events that make it work.','Demonstration: '+unit['stages'][0][2][:140]),
      ('Attempt each guided prompt without looking ahead.','Compare your attempt with the supplied specific feedback.','Guided comparison: '+unit['stages'][1][4][:140]),
      ('Use the independent instructions, not the model words.','Give an original response and the reason behind it.','Independent reminder: '+unit['independent'][:160]),
      ('Read the whole question and eliminate misconceptions.','Prefer the option that quotes or uses actual evidence.','Likely trap: '+unit['stages'][2][5][:140]),
      ('Include your own response and a short reason.','Proofread names, sequence and punctuation before sending.','Success looks like: '+unit['mission'])]
    l['stage_hints']={k:list(v) for k,v in zip(keys,descriptions)}
    for key in ('resources','word_challenges','sort_activity','suspense_builder','planner_fields',
      'planner_title','planner_intro','spelling','spelling_focus','hoard_words','follow_up_challenges',
      'printable_resource','interactive_activities','explicit_teaching'):
        l[key]=None
    l['coming_soon']=None
    return dict(architecture='d1-worker',lesson=l,
      curriculum=[dict(code=unit['outcome'],
         source='https://curriculum.nsw.edu.au/learning-areas/english/english-k-10-2022/outcomes',
         verification_status='pending',lesson_evidence=unit['mission'],
         scope_limit='Individual Written Core lesson contributes partial evidence; independently verify syllabus content-point alignment.')],
      requirements=dict(teaching=evidence,
        practice=dict(model_inputs=[unit['stages'][0][2]],guided_inputs=[unit['stages'][1][3]],
          independent_inputs=[unit['independent']]),
        visuals=[dict(alt=v['alt'],teaches=v['caption']) for v in visuals],
        review_questions=['Verify original Coming Soon outcome and syllabus content point against NESA English K–10 2022.',
         'Educationally review worked example, independent prompts and all 10 quiz answers.',
         'Verify Stage 2 age suitability and child/parent API answer privacy.',
         'Verify written learner progress saved and restored.',
         'Confirm diagrams teach this lesson idea rather than a generic process.']))

def build_all():
    db=reconstruct()
    try:
        for unit in UNITS:
            row=db.execute('SELECT * FROM lessons WHERE seed_key=?',(unit['code'],)).fetchone()
            if row is None: raise RuntimeError('Missing curriculum seed: '+unit['code'])
            bundle=make_spec(row,unit)
            target=ROOT/'lesson-pipeline/authored'/f'{unit["code"]}.json'
            atomic_json(target,bundle)
            print('Written Core bundle:',target)
    finally:
        db.close()

if __name__=='__main__': build_all()
