-- Standard v2: Stage 2 Year 4 English Week 1. Original complete lessons.
-- Paid plan: full teaching quality; preserve seed identities.

-- s2-eng-y4-w01-l1
UPDATE lessons SET title='Year 4: Follow a story through time', data=json_patch(data, '{
  "seed_key": "s2-eng-y4-w01-l1",
  "title": "Year 4: Follow a story through time",
  "stage": "S2",
  "learning_area": "English",
  "year_level": "Year 4",
  "week": 1,
  "lesson_number": 1,
  "duration_minutes": 60,
  "child_mission": "Become a Story Tracker! Follow Nia’s envelope mission and discover how a storyteller can change the order without changing the events.",
  "learning_intention": "We are learning to follow story events, recognise a flashback and explain how an opening affects a reader.",
  "success_criteria": [
    "I can identify a character’s goal and obstacle.",
    "I can put events in the order they happened.",
    "I can recognise a signalled flashback.",
    "I can explain an opening using a detail from the text."
  ],
  "materials": [
    "Everything you need to read is included in this lesson",
    "Optional: paper and a pencil"
  ],
  "outcome_codes": [],
  "review_status": "unreviewed",
  "pass": 1,
  "pass_mark": 0.9,
  "coming_soon": null,
  "source_note": null,
  "explicit_teaching": null,
  "resources": null,
  "sort_activity": null,
  "word_challenges": null,
  "suspense_builder": null,
  "planner_fields": null,
  "planner_title": null,
  "planner_intro": null,
  "spelling": null,
  "spelling_focus": null,
  "hoard_words": null,
  "follow_up_challenges": null,
  "steps": null,
  "visual_plan": null,
  "interactive_activities": null,
  "printable_resource": null,
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "📖",
      "title": "Track the goal, obstacle and response",
      "explain": "**A narrative tells connected events.**\nA character often wants something: this is a goal. An obstacle gets in the way. The character’s response leads to a consequence, or what happens next. The ending tells the outcome. These questions help you follow many stories, although not every story uses exactly the same pattern.\n\n**Read for actions and reasons.**\nRead the whole story below once. Then ask: What does Nia want? What gets in her way? What does she do about it? Notice how the events connect rather than only collecting objects mentioned in the text.\n\n**Check the ending against the goal.**\nNia wants to return an invitation before her brother leaves. Giving him the envelope answers that goal. The courtyard gate is a place in the story; naming it alone would not explain the outcome.\n\nUse the text as evidence. If a feeling or reason is not stated, use the actions to make a careful suggestion instead of treating a guess as a fact.",
      "example": "READ THE COMPLETE ORIGINAL STORY\nTHE BLUE ENVELOPE\nNia stood outside the library meeting room with a blue envelope. The doors would close for the reading club in five minutes. She wanted to return the invitation before her brother left without it.\nEarlier that morning, Nia had found the envelope under their kitchen table. Her brother had put it there while searching for a pencil. She had noticed his name and decided to bring it to the library.\nNow she checked the meeting-room door. A notice said the club had moved to the courtyard. Nia followed the signs past the shelves. She found her brother beside the courtyard gate and handed him the envelope. He read the invitation, then held the gate while they went in together.\n\nI DO:\nNia’s goal is returning the invitation in time. The empty meeting-room location creates a problem, so she reads the notice and follows the signs. Her response leads to finding her brother.\n\nYOU TRY:\nWhich action shows that Nia deals with the changed location? Find the words before reading on.\n\nCHECK:\nShe follows the signs past the shelves. That action connects the notice to reaching the courtyard; it is more useful evidence than simply naming the envelope.",
      "notice": "A story map records what changes and why. A list of objects does not show those connections.",
      "check": {
        "question": "Which note explains Nia’s response to the changed location?",
        "options": [
          "She has a blue envelope",
          "She follows the signs to the courtyard",
          "The library has shelves",
          "The invitation has a name"
        ],
        "correct_index": 1,
        "explanation": "Following the signs is the action she takes after learning the meeting has moved. The other notes name details without explaining her response."
      }
    },
    {
      "icon": "📖",
      "title": "Separate event order from telling order",
      "explain": "**Two orders can be different.**\nEvent order is the order things happened in the story world. Telling order is the order the writer presents them. A story can begin later, then explain an earlier event.\n\n**Use a timeline to rebuild event order.**\nFind the earliest event. Ask what must happen before the next one: Nia must find the envelope before she can carry it to the library. The club notice comes before following the signs. Number the events in that order.\n\n**Time words are clues.**\nEarlier that morning takes us back before the opening outside the room. Now brings us to the opening’s time again. The paragraph’s place on the page does not prove that its event happened after the previous paragraph.\n\nIf you are unsure, reread the transition and use the character’s actions to check. Do not reorder events merely to match the order you first read them.",
      "example": "I DO:\nTelling order: at the meeting room → kitchen memory → courtyard search.\nEvent order: find envelope in kitchen → bring it to library → read notice → find brother.\nThe kitchen event is told second but happened first.\n\nYOU TRY:\nWhich comes first in event order: carrying the envelope or finding it? Explain how you know.\n\nCHECK:\nFinding comes first because Nia needs the envelope before she can bring it. You used a connection between actions, as well as the time clue.",
      "notice": "Keep two labels: happened and told. This avoids confusing the first paragraph with the earliest event.",
      "check": {
        "question": "Which event happened earliest, even though it is told later?",
        "options": [
          "Nia hands over the envelope",
          "The brother holds the courtyard gate",
          "Nia finds the envelope under the kitchen table",
          "Nia reads the library notice"
        ],
        "correct_index": 2,
        "explanation": "The morning kitchen event happened before the library visit. Earlier that morning signals that move back in time."
      },
      "visual": [
        {
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 224\"><rect width=\"420\" height=\"224\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">EVENT ORDER</text><text x=\"16\" y=\"80\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Find → bring → read → find</text><text x=\"16\" y=\"126\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">TELLING ORDER</text><text x=\"16\" y=\"172\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Library → kitchen → library</text></svg>",
          "alt": "Event order moves from finding the envelope to bringing it, reading the notice and finding the brother. Telling order starts at the library, goes back to the kitchen and returns.",
          "caption": "Label the two orders before numbering."
        }
      ]
    },
    {
      "icon": "📖",
      "title": "Spot a flashback and return",
      "explain": "**A flashback shows an earlier event.**\nWhen a story moves back from its current moment to something earlier, that part is a flashback. Here it explains how Nia got the envelope. It adds information the opening has not yet supplied.\n\n**Look for the move and the return.**\nMark the words Earlier that morning. Then find Now. Those signals help a reader know when the story leaves the library moment and when it returns. A memory can be longer in other stories; this one is one paragraph.\n\n**A flashback still belongs to the story.**\nIt is not a new ending or a random extra event. The kitchen action explains why the invitation matters and why Nia is carrying it. The writer connects the earlier event to the present goal.\n\n**Check meaning, not just one word.**\nAn ordinary sentence containing yesterday is not always a full flashback. Ask whether the telling actually moves to an earlier event and then follows that event. Use the whole passage.",
      "example": "I DO:\nOpening moment: Nia at the library room.\nMove back: “Earlier that morning...” begins the kitchen event.\nReturn: “Now she checked...” takes us back to the library action.\nThe earlier paragraph explains the envelope’s purpose.\n\nYOU TRY:\nFind the return signal. Say what action follows it.\n\nCHECK:\nNow signals the return; checking the meeting-room door follows. Naming both the signal and action shows you followed the transition.",
      "notice": "A flashback changes the telling order. It does not change which event happened first in the story world.",
      "check": {
        "question": "What is the main job of the kitchen flashback here?",
        "options": [
          "To invent a second unrelated story",
          "To remove the library ending",
          "To prove all stories need a memory",
          "To explain how Nia found the invitation she is carrying"
        ],
        "correct_index": 3,
        "explanation": "The earlier event supplies the background needed to understand her library goal. A flashback is a choice, not a rule for every story."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Two orders, one envelope",
            "transcript": "Pip: The story starts at the library. Did the kitchen event happen later just because I read it second?\nJuno: Check Earlier that morning. It moves back to when Nia found the envelope. That happened before she carried it.\nPip: So I need one order for the events and another for the telling. Now signals the return to the library.\nJuno: Pause here. Trace the discovery, journey and search in event order. Then notice the question created by the library opening.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "The story starts at the library. Did the kitchen event happen later just because I read it second?"
                  },
                  {
                    "who": "juno",
                    "text": "Check Earlier that morning. It moves back to when Nia found the envelope. That happened before she carried it."
                  },
                  {
                    "who": "pip",
                    "text": "So I need one order for the events and another for the telling. Now signals the return to the library."
                  },
                  {
                    "who": "juno",
                    "text": "Pause here. Trace the discovery, journey and search in event order. Then notice the question created by the library opening.",
                    "pause_after": true
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    {
      "icon": "📖",
      "title": "Compare two openings with evidence",
      "explain": "**A writer chooses where to begin.**\nThe time-order version below begins with the discovery. It helps the reader follow the events from their start. The flashback version begins near the club’s closing time; the reader first meets a goal with time pressure.\n\n**Explain an effect carefully.**\nUse three parts: the choice, a detail and what it may make a reader notice or wonder. “It is exciting” is too vague by itself. The five-minute detail explains why the library opening can create urgency.\n\n**There is more than one useful structure.**\nOne opening is not automatically better. A chronological opening may be clearer for one purpose; a later opening may create a question before explaining background. Compare the effects instead of declaring that every story must use a flashback.\n\nReread both endings too. These versions keep the same main events and outcome. Changing the telling order does not require inventing a new event.",
      "example": "READ THE TIME-ORDER VERSION\nTHE BLUE ENVELOPE: TIME ORDER\nThat morning, Nia found a blue envelope under the kitchen table. Her brother had left his invitation there while searching for a pencil. She decided to bring it to the library.\nLater, Nia stood outside the meeting room. The reading-club doors would close in five minutes. She wanted to return the invitation before her brother left without it. A notice said the club had moved to the courtyard.\nNia followed the signs past the shelves. She found her brother beside the courtyard gate and handed him the envelope. He read the invitation, then held the gate while they went in together.\n\nI DO:\nThe flashback version begins at the meeting room. The detail “five minutes” may make a reader wonder whether Nia will find her brother in time. The time-order version explains the envelope’s discovery first, so the reader has that background before the library visit.\n\nYOU TRY:\nExplain what the time-order opening helps the reader understand first.\n\nCHECK:\nIt explains how Nia found the invitation and why she brings it. An answer using that discovery is more precise than saying the opening is simply good.",
      "notice": "Support an effect with a specific detail. Use may when describing a possible reader response.",
      "check": {
        "question": "Which explanation links an opening detail to its effect?",
        "options": [
          "The five-minute deadline may make a reader wonder whether Nia will arrive in time",
          "The story is good because it is good",
          "Every narrative must begin at a library",
          "A flashback always changes the ending"
        ],
        "correct_index": 0,
        "explanation": "The deadline is evidence for a possible feeling of urgency. The other choices repeat a judgement or make an unsupported rule."
      }
    }
  ],
  "worked_example": "I DO: Build a complete reading response using the original story.\nTHE BLUE ENVELOPE\nNia stood outside the library meeting room with a blue envelope. The doors would close for the reading club in five minutes. She wanted to return the invitation before her brother left without it.\nEarlier that morning, Nia had found the envelope under their kitchen table. Her brother had put it there while searching for a pencil. She had noticed his name and decided to bring it to the library.\nNow she checked the meeting-room door. A notice said the club had moved to the courtyard. Nia followed the signs past the shelves. She found her brother beside the courtyard gate and handed him the envelope. He read the invitation, then held the gate while they went in together.\n\nMY EVENT MAP\nGoal: return the invitation before her brother leaves.\nObstacle: the meeting has moved from the expected room.\nResponse: read the notice and follow the signs.\nOutcome: hand over the envelope and enter with her brother.\n\nMY TIMELINE\n1. Nia finds the envelope in the kitchen.\n2. She brings it to the library.\n3. She reads the changed-location notice.\n4. She finds her brother and gives him the envelope.\n\nMY STRUCTURE EXPLANATION\nThe writer begins at the library, then uses a flashback beginning Earlier that morning to explain the invitation. Now returns to the library. The opening’s five-minute deadline may make a reader wonder whether Nia will complete her goal in time. The chronological version gives the discovery first, so the reader knows the background sooner.\n\nCOMMON MISTAKE AND FIX\n“Nia found the envelope after arriving at the library because that paragraph is second.” I fix this by checking Earlier that morning and rebuilding event order. Paragraph order and event order are different here.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 178\"><rect width=\"420\" height=\"178\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Choice: begin at the library</text><text x=\"16\" y=\"80\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Detail: five minutes remain</text><text x=\"16\" y=\"126\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Effect: will she arrive in time?</text></svg>",
      "alt": "A structure explanation identifies the opening choice, uses the five-minute detail and suggests a possible reader question.",
      "caption": "Choice → detail → possible effect."
    }
  ],
  "guided_practice": "WE DO: Prepare a reading response with help.\n1. Reread the story’s opening and ending. Say the goal, then check: returning the invitation in time.\n2. Write four event notes. Put them in happened order before comparing the model timeline above.\n3. Underline the move-back and return signals. Explain where each takes the reader.\n4. Complete “The earlier paragraph explains ____.” Try first. A useful completion names how she found the invitation, rather than only repeating kitchen.\n5. Compare openings. Begin “The library opening may make a reader wonder ____ because ____.” Use a detail to fill the reason.\n6. Check that your explanation describes the writing’s effect without inventing an event. Your wording can differ from the model.",
  "independent_task": "YOU DO: Story Tracker response (about 20 minutes).\nUse the two complete envelope versions in this lesson; you need no outside text.\n1. Write a goal, obstacle, response and outcome map for Nia.\n2. Make a numbered four-event timeline in the order events happened.\n3. Identify the flashback’s starting words and the return signal. Explain what background the earlier event provides.\n4. Write three or four sentences comparing the openings. Include one specific detail and a possible effect on a reader.\n5. Reread: have you confused happened order with told order? Improve one note or explanation and say why.\nYou can work on paper or in the big box. For paper work, type a summary including the timeline and your comparison. Check: accurate events; clear time signals; evidence for an effect; one explained improvement.",
  "response_prompt": "Which time clue or story detail most helped you understand the writer’s structure?",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "What is a character’s goal?",
      "options": [
        "The colour of every object",
        "What the character wants to achieve",
        "The number of paragraphs",
        "The reader’s name"
      ],
      "correct_index": 1,
      "explanation": "A goal is what a character wants to achieve; it helps explain their actions."
    },
    {
      "type": "multiple_choice",
      "question": "What creates Nia’s location problem?",
      "options": [
        "The envelope changes colour",
        "She has no name",
        "The club has moved to the courtyard",
        "The kitchen table disappears"
      ],
      "correct_index": 2,
      "explanation": "The notice says the club has moved, so the expected meeting room is not the correct place."
    },
    {
      "type": "multiple_choice",
      "question": "Which event happens first in the story world?",
      "options": [
        "Finding the envelope in the kitchen",
        "Reading the library notice",
        "Giving the invitation to her brother",
        "Entering through the courtyard gate"
      ],
      "correct_index": 0,
      "explanation": "The morning discovery happens before the library visit even though the flashback tells it later."
    },
    {
      "type": "multiple_choice",
      "question": "What does telling order describe?",
      "options": [
        "Only the time on a clock",
        "How many people read a book",
        "The order of alphabet letters",
        "The order the writer presents events"
      ],
      "correct_index": 3,
      "explanation": "Telling order is presentation order; it can differ from when events happened."
    },
    {
      "type": "multiple_choice",
      "question": "Which phrase signals the move to an earlier event?",
      "options": [
        "Beside the gate",
        "Earlier that morning",
        "Blue envelope",
        "Reading club"
      ],
      "correct_index": 1,
      "explanation": "Earlier that morning signals a move back before the library opening."
    },
    {
      "type": "multiple_choice",
      "question": "What does Now signal after the kitchen paragraph?",
      "options": [
        "A new unrelated narrator",
        "The end of every possible story",
        "A return to the library moment",
        "A change in the envelope’s colour"
      ],
      "correct_index": 2,
      "explanation": "Now returns the telling from the earlier kitchen event to the current library action."
    },
    {
      "type": "multiple_choice",
      "question": "What does the flashback explain?",
      "options": [
        "How Nia found the invitation",
        "Why every library closes forever",
        "An invented future race",
        "A different outcome"
      ],
      "correct_index": 0,
      "explanation": "The kitchen event explains the invitation’s discovery and purpose."
    },
    {
      "type": "multiple_choice",
      "question": "Which comparison is supported by the texts?",
      "options": [
        "Both versions have different main outcomes",
        "A flashback is required in every story",
        "The chronological version hides the discovery until last",
        "One gives background first; the other begins with a deadline"
      ],
      "correct_index": 3,
      "explanation": "The time-order version begins with discovery; the flashback version begins at the library with five minutes remaining."
    },
    {
      "type": "short_answer",
      "question": "Explain how the opening’s five-minute detail may affect a reader.",
      "sample_answer": "The deadline may make a reader wonder whether Nia will find her brother before he leaves.",
      "marking_guide": "Accept a possible urgency or reader-question effect linked to the five-minute deadline.",
      "explanation": "The time pressure supports a possible reader question rather than a vague judgement."
    },
    {
      "type": "short_answer",
      "question": "Explain why the kitchen paragraph is a flashback.",
      "sample_answer": "It tells an earlier morning event after the library opening, and Now returns to the library moment.",
      "marking_guide": "Accept the move back to an earlier event, supported by a time clue or the return.",
      "explanation": "A flashback changes telling order by showing an event before the current moment."
    }
  ],
  "parent_notes": "Parent: Teaches narrative event connections, event versus telling order, a signalled flashback and evidence-based comparison. These lessons follow the repository’s Year 4 narrative sequence. Exact outcome codes are empty pending verified mapping; this is not a claim of full syllabus coverage. All texts are original.\n\nParent: Look for accurate timelines and a detail supporting a possible reader effect; do not require the learner to prefer one version. The lesson supplies teaching, models and feedback. Support access and review the evidence; do not teach the steps for the child.\n\nParent: Eight multiple-choice answers are scored. The unchanged 90% threshold requires 8/8. Two written responses are reviewed manually. Model for question 9: The deadline may make a reader wonder whether Nia will find her brother before he leaves. Model for question 10: It tells an earlier morning event after the library opening, and Now returns to the library moment.\n\nParent: The worked example is a complete task model. Accept other precise comparisons. Statements about reader response should be supported possibilities, not universal claims.",
  "evidence_instructions": "Keep the event map, numbered timeline, flashback explanation, opening comparison, revision, reflection and written quiz responses.",
  "offline_alternative": "Print or copy both original versions. Mark the time clues, make the timeline and compare openings on paper. Later type a summary and complete the quiz.",
  "extension": "Rewrite the first two sentences to begin at the courtyard gate, then explain what background your reader would need next.",
  "stage_hints": {
    "accept": [
      "Read Nia’s mission and the goal about following story time.",
      "You will compare two tellings of the envelope events before making your own timeline.",
      "Begin with Nia’s goal; later the time clues will help you separate happened order from told order."
    ],
    "teach0": [
      "Reread what Nia wants before naming the obstacle.",
      "Separate the problem from the action she takes about it.",
      "Use goal → obstacle → response → outcome to organise the events."
    ],
    "teach1": [
      "Look at the difference between happened and told.",
      "Find the earliest event using the morning clue.",
      "Ask what Nia must do before she can carry the envelope; use that connection to start the timeline."
    ],
    "teach2": [
      "Find the paragraph that leaves the library moment.",
      "Mark a move-back clue and a return clue separately.",
      "Explain where the reader goes in each paragraph before naming the structure."
    ],
    "teach3": [
      "Reread the opening sentence and deadline.",
      "Choose one detail that could create a question for a reader.",
      "Link the writer’s opening choice to a detail and a possible reader response."
    ],
    "learn": [
      "Compare the event map with the actual actions.",
      "Check the timeline against the morning paragraph.",
      "Use the model’s labels to find a place where told order differs from happened order."
    ],
    "guided": [
      "Start with the opening goal and ending outcome.",
      "Make four brief event notes before writing the comparison.",
      "Fill one gap in “This opening may make a reader wonder ____ because ____.”"
    ],
    "write": [
      "Start with the character’s goal and a four-event list.",
      "Begin the comparison “This version starts when ____.”",
      "A partial opening is “The writer begins at ____. The detail ____ may make a reader ____.” Supply your own evidence."
    ],
    "quiz": [
      "Return to the steps about time order and evidence.",
      "Check whether the question asks when an event happened or when it is told.",
      "For an effect, find a specific detail before choosing or writing the explanation."
    ],
    "submit": [
      "Check your event map, timeline and opening comparison.",
      "Include the time-clue explanation and one improvement with its reason.",
      "Send your Story Tracker response and reflection; a typed summary can record paper work."
    ]
  }
}'), updated_at=datetime('now') WHERE seed_key='s2-eng-y4-w01-l1';

-- s2-eng-y4-w01-l2
UPDATE lessons SET title='Year 4: Build suspense with a fair clue', data=json_patch(data, '{
  "seed_key": "s2-eng-y4-w01-l2",
  "title": "Year 4: Build suspense with a fair clue",
  "stage": "S2",
  "learning_area": "English",
  "year_level": "Year 4",
  "week": 1,
  "lesson_number": 2,
  "duration_minutes": 60,
  "child_mission": "Become a Suspense Writer! Give your reader a question, a useful clue and a satisfying answer in a short original story.",
  "learning_intention": "We are learning to build gentle suspense through a character’s goal, selective details, pacing and a connected reveal.",
  "success_criteria": [
    "I can give my character a clear goal.",
    "I can create a question and plant a useful clue.",
    "I can choose detail and pace for a reason.",
    "I can reveal an answer that connects to the clue.",
    "I can revise one part and explain its effect."
  ],
  "materials": [
    "Everything you need to read is included in this lesson",
    "Optional: paper and a pencil"
  ],
  "outcome_codes": [],
  "review_status": "unreviewed",
  "pass": 1,
  "pass_mark": 0.9,
  "coming_soon": null,
  "source_note": null,
  "explicit_teaching": null,
  "resources": null,
  "sort_activity": null,
  "word_challenges": null,
  "suspense_builder": null,
  "planner_fields": [
    {
      "key": "goal",
      "label": "Character, goal and reader question",
      "hint": "Who wants what, and why does the answer matter?"
    },
    {
      "key": "clue",
      "label": "Clue and search action",
      "hint": "What useful detail appears before the answer? What happens next?"
    },
    {
      "key": "reveal",
      "label": "Reveal and outcome",
      "hint": "Explain the clue and show what happens to the original goal."
    }
  ],
  "planner_title": "Plan the question and its answer",
  "planner_intro": "Use brief notes. Your reveal should explain your clue, and the outcome should connect to the character’s goal.",
  "spelling": null,
  "spelling_focus": null,
  "hoard_words": null,
  "follow_up_challenges": null,
  "steps": null,
  "visual_plan": null,
  "interactive_activities": null,
  "printable_resource": null,
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "📖",
      "title": "Give the reader a reason to wonder",
      "explain": "**Suspense is waiting to find out.**\nA reader may feel suspense when an important question has not yet been answered. It does not have to be frightening. Will a character find a missing item before the game begins? What is making a soft sound inside a box? A gentle question can hold attention.\n\n**Give the character a goal first.**\nReaders need to know why the answer matters. If Lena wants to find her missing exhibition label, an unexplained rustle near her display has a purpose. Without that goal, a noise can feel like a random detail.\n\n**Give enough information to follow.**\nName the character and situation. Show the obstacle or uncertainty. Hold back the answer for a short time, rather than withholding every useful fact. “Someone did something somewhere” leaves a reader confused, not usefully curious.\n\n**Use a question to plan.**\nYou do not need to write a question mark in the story. Decide what you want the reader to wonder, then let the action create that question.",
      "example": "I DO:\nGoal: Lena needs her display label before visitors arrive.\nUncertainty: it is missing, and something rustles behind the display board.\nReader question: Could the sound help her find the label?\nOpening: “Lena checked the empty space beside her model. The visitors would arrive soon. Behind the board, paper rustled.”\n\nYOU TRY:\nGive a character a goal involving a missing map. What could make the answer matter?\n\nCHECK:\nOne possibility is finding the map before a treasure-hunt game starts. A goal plus a reason gives the uncertainty a purpose; your event can be different.",
      "notice": "Suspense needs a question the reader can understand. Mystery is not the same as leaving out all context.",
      "check": {
        "question": "Which plan gives a reader a clear reason to wonder?",
        "options": [
          "A random noise with no character or situation",
          "A list of colours only",
          "Lena needs her missing label before visitors arrive",
          "Someone does something in an unnamed place"
        ],
        "correct_index": 2,
        "explanation": "The goal and approaching visitors explain why finding the label matters. The other plans provide too little connected context."
      }
    },
    {
      "icon": "📖",
      "title": "Plant a clue before the answer",
      "explain": "**A clue is a useful detail.**\nIn this story, a clue points towards the later answer. A blue corner showing under the board can connect to the missing blue label. The reader may not know the answer yet, but the reveal should make the clue’s purpose clear.\n\n**Select details instead of adding everything.**\nA detail such as a paper rustle matters if the missing label has slipped behind the board. The colour of every chair may not help. Choose a few details that guide attention towards the question.\n\n**Keep the clue fair.**\nIf the answer is a label caught behind the board, show something connected before revealing it. A sudden helicopter arriving with an unrelated replacement changes the problem instead of paying off the clue.\n\n**Clues are not proof yet.**\nThe reader can suspect an answer and still wait to see. Use a visible corner, a repeated sound or a trail that fits the original situation. Keep the story safe and believable within the world you create.",
      "example": "I DO:\nMissing item: blue paper label.\nClue: “A blue corner flickered below the board.”\nLater answer: the label has slipped into the gap and moves in the draught.\nThe clue and answer connect through colour, place and movement.\n\nYOU TRY:\nIf a missing red ribbon is caught under a chair, choose a clue a character could notice before seeing the whole ribbon.\n\nCHECK:\n“A red strip showed beside one chair leg” is a useful possibility. It points towards the ribbon without immediately showing everything.",
      "notice": "A clue should connect to the answer. Decoration can make a scene vivid, but does not automatically help solve the story’s question.",
      "check": {
        "question": "Which clue connects fairly to a blue paper label behind a board?",
        "options": [
          "A new planet appears",
          "A random bicycle wins a race",
          "Every chair has a different colour",
          "A blue paper corner shows below the board"
        ],
        "correct_index": 3,
        "explanation": "The visible blue paper corner connects to the missing label and its location. The other details do not point to that answer."
      },
      "visual": [
        {
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 224\"><rect width=\"420\" height=\"224\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Goal: find missing label</text><text x=\"16\" y=\"80\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Clue: blue corner below board</text><text x=\"16\" y=\"126\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Action: crouch and reach</text><text x=\"16\" y=\"172\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Reveal: paper in the gap</text></svg>",
          "alt": "A connected suspense chain links the missing label goal to a blue-corner clue, search action and reveal.",
          "caption": "Make each detail serve the story’s question."
        }
      ]
    },
    {
      "icon": "📖",
      "title": "Control the pace of discovery",
      "explain": "**Pacing is how quickly events seem to unfold.**\nYou can spend several sentences on a small action or move quickly over an unimportant journey. Slowing the important discovery can give the reader time to wonder. It should still move the story forward.\n\n**Show a purposeful sequence.**\n“Lena bent down. The corner moved again. She reached towards the gap.” Each action gets closer to the answer. Compare “Lena looked for ages and ages”: it says the wait is long but gives little action to follow.\n\n**Sentence length is one choice.**\nA short sentence can draw attention to a moment: “The paper moved.” Longer sentences can connect actions and details. Do not make every sentence short or add exclamation marks everywhere. Choose what helps this particular moment.\n\n**Read it aloud to check.**\nIf the discovery races past, add one meaningful observation or action before the reveal. If it drags, remove repeated waiting that teaches the reader nothing new.",
      "example": "I DO:\nRushed: “Lena saw paper and got the label.”\nRevised: “Lena crouched beside the board. A blue corner moved in the draught. She reached into the narrow gap.”\nI slow the discovery with connected actions. The reader follows what she notices before the answer.\n\nYOU TRY:\nAdd one purposeful action between noticing a red strip and lifting the chair.\n\nCHECK:\nThe character might bend down to look closely. That brings the character nearer to the clue. Repeating “she waited” three times would not add the same information.",
      "notice": "Short sentences are a tool, not a rule. Slow the important moment with meaningful actions rather than repeated filler.",
      "check": {
        "question": "Which change slows discovery while moving the story forward?",
        "options": [
          "Show the character crouching to examine the clue",
          "Repeat an unrelated colour ten times",
          "Remove the character’s goal",
          "Add exclamation marks to every word"
        ],
        "correct_index": 0,
        "explanation": "Examining the clue is an action that advances the search while giving the reader time to follow it. The other changes do not control a connected discovery."
      },
      "visual_before": [
        {
          "episode": {
            "title": "A clue earns its place",
            "transcript": "Pip: My character loses a label. Then I say she finds it. The search goes past very quickly.\nJuno: Choose a useful clue first. What could she notice before the whole label is visible?\nPip: A blue corner under the board. Then she can crouch and check the narrow gap.\nJuno: Those actions slow the discovery while getting closer to the answer. At the end, explain why the paper moved and finish the display goal.\nPip: Pause and plan a clue, one search action and a reveal that fits. They should belong to the same event.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "My character loses a label. Then I say she finds it. The search goes past very quickly."
                  },
                  {
                    "who": "juno",
                    "text": "Choose a useful clue first. What could she notice before the whole label is visible?"
                  },
                  {
                    "who": "pip",
                    "text": "A blue corner under the board. Then she can crouch and check the narrow gap."
                  },
                  {
                    "who": "juno",
                    "text": "Those actions slow the discovery while getting closer to the answer. At the end, explain why the paper moved and finish the display goal."
                  },
                  {
                    "who": "pip",
                    "text": "Pause and plan a clue, one search action and a reveal that fits. They should belong to the same event.",
                    "pause_after": true
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    {
      "icon": "📖",
      "title": "Reveal, resolve and revise",
      "explain": "**A reveal answers the question.**\nShow what caused the clues. Here the rustle comes from the paper label moving in a draught. Let the character discover the answer through an action, rather than jumping to an unrelated explanation.\n\n**A resolution shows what happens after.**\nFinding the label answers where it was. Placing it beside the model also completes Lena’s goal. Both parts help the ending feel connected to the beginning.\n\n**Reread backwards for fairness.**\nStart with the reveal and check whether an earlier clue fits it. Then check the goal: does the ending address what the character wanted? Repair a missing connection before polishing individual words.\n\n**Explain a revision.**\nAn edit should have a purpose. “I added the blue corner because it points towards the label” explains a useful change. Making a story longer alone does not show improved suspense.",
      "example": "I DO:\nReveal: “Lena pulled out the label. The fan had blown it behind the board.”\nResolution: “She placed it beside the model as the first visitors arrived.”\nThe paper rustle and blue corner now have an explanation, and the goal is met.\n\nCOMMON MISTAKE:\nThe ending introduces a new missing item without answering the first question. I fix it by resolving the label search before starting anything else.\n\nYOU TRY:\nWrite one outcome sentence after a character retrieves a ribbon needed for the game.\n\nCHECK:\nAn outcome can show the ribbon ready when the game starts. It connects the discovery to the original goal.",
      "notice": "Answer the question you raised. A connected reveal can still surprise the reader without contradicting earlier facts.",
      "check": {
        "question": "What should the ending of this label story do?",
        "options": [
          "Ignore the label forever",
          "Explain the clue and show the label ready for the display",
          "Replace the story with an unrelated adventure",
          "Claim every question needs a frightening answer"
        ],
        "correct_index": 1,
        "explanation": "The reveal explains the clue and the resolution completes the original display goal. Suspense can have a gentle answer."
      }
    }
  ],
  "worked_example": "I DO: Plan and write a complete gentle suspense story.\nPLAN\nGoal: Lena needs her label for the exhibition.\nClues: paper rustle; blue corner below the board.\nSearch: crouch, look closely, reach into the gap.\nReveal: the fan blew the label behind the board.\nResolution: the label is displayed before visitors arrive.\n\nTHE RUSTLE\nLena checked the empty space beside her model. The visitors would arrive soon, but her blue label was missing. She searched the table and looked under her chair. Behind the display board, paper rustled.\nShe stopped. A blue corner flickered below the board. Lena crouched and looked into the narrow gap. The corner moved again. She reached carefully and drew out the folded label.\nThe fan on the windowsill had blown it behind the board. Lena smoothed the paper and placed it beside her model as the first visitors arrived.\n\nWHY IT WORKS\nThe goal makes the search matter. The rustle and blue corner point towards the reveal. Connected observations slow the important discovery. The final sentence completes the goal.\n\nCOMMON MISTAKE AND FIX\nDraft: “A noise happened. A person gave her a new label.” The noise has no purpose. Fix: make the label cause the rustle and let Lena follow the clue. Now the reveal rewards the reader’s attention.\n\nREVISION NOTE\nI added the visible blue corner so the answer has evidence before the reveal.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 224\"><rect width=\"420\" height=\"224\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Question → clue → search</text><text x=\"16\" y=\"80\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Reveal: explain the clue</text><text x=\"16\" y=\"126\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Outcome: finish the goal</text><text x=\"16\" y=\"172\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Revise: check connections</text></svg>",
      "alt": "Suspense writing begins with a question, clue and search, then explains the clue and finishes the goal before checking connections.",
      "caption": "The answer should fit the earlier detail."
    }
  ],
  "guided_practice": "WE DO: Plan a missing-ribbon story.\n1. Choose a character and purpose for the ribbon. Try first. Example: Sam needs it to mark the treasure-hunt finish.\n2. Choose a safe place it could slip. Example: under a chair.\n3. Plant one clue before the answer. Try a visible colour or movement; compare with “A red strip showed beside the chair leg.”\n4. Add a search action. Example: Sam bends down to look, then lifts the chair carefully.\n5. Write the reveal and an outcome that completes the game goal.\n6. Read the short sequence. Remove an unrelated detail or add a missing connection. Explain why your edit helps.\nYour character, object and wording can differ. Keep the question, clue and answer connected.",
  "independent_task": "YOU DO: Write an original gentle suspense story (about 20–25 minutes).\n1. Plan a missing everyday item: a map, ribbon, card or label. Give your fictional character a goal and a reason it matters.\n2. Use the three planner boxes or paper notes to connect question, clue, search and reveal.\n3. Write an opening that introduces the character and situation. Let the reader understand the question.\n4. Write the search. Include one fair clue and one meaningful action that gives the reader time to follow the discovery.\n5. Reveal the answer and finish the original goal. Aim for three short paragraphs; clarity matters more than counting words.\n6. Reread for connections. Improve one clue, action or ending and explain the change below the story.\nYou can write on paper or in the big box. If using paper, type the story or a clear summary with the clue, reveal and revision. Check: clear goal; fair clue; purposeful pace; connected reveal; outcome; explained revision.",
  "response_prompt": "Which detail or action builds your story’s suspense, and how does the ending connect to it?",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "What does gentle suspense give a reader?",
      "options": [
        "Every answer before the opening",
        "Only confusing missing information",
        "A reason to wait for an important answer",
        "A rule that all stories must frighten"
      ],
      "correct_index": 2,
      "explanation": "Suspense involves waiting for an answer that matters; it can be gentle and clear."
    },
    {
      "type": "multiple_choice",
      "question": "Why give Lena a goal?",
      "options": [
        "It removes the need for an ending",
        "It makes every object a clue",
        "It changes the spelling rules",
        "It explains why finding the label matters"
      ],
      "correct_index": 3,
      "explanation": "The display goal gives the search a purpose for the character and reader."
    },
    {
      "type": "multiple_choice",
      "question": "What makes a fair clue useful?",
      "options": [
        "It connects to the later answer",
        "It is always the longest sentence",
        "It is unrelated to the question",
        "It replaces the character"
      ],
      "correct_index": 0,
      "explanation": "A fair clue provides a detail whose purpose becomes clear at the reveal."
    },
    {
      "type": "multiple_choice",
      "question": "Which detail points towards a blue label behind a board?",
      "options": [
        "A distant unrelated bicycle",
        "A blue paper corner below the board",
        "A new character with no connection",
        "A list of all chair colours"
      ],
      "correct_index": 1,
      "explanation": "The colour, paper and place connect the detail to the missing label."
    },
    {
      "type": "multiple_choice",
      "question": "What is pacing in this writing lesson?",
      "options": [
        "Choosing a font size only",
        "Counting every letter",
        "How quickly events seem to unfold",
        "Removing all actions"
      ],
      "correct_index": 2,
      "explanation": "Pacing concerns the speed of the unfolding events, influenced by selected actions and detail."
    },
    {
      "type": "multiple_choice",
      "question": "Which is a purposeful way to slow a discovery?",
      "options": [
        "Repeat waiting without new information",
        "Describe an unrelated event",
        "Use only exclamation marks",
        "Show a close look at the clue before reaching"
      ],
      "correct_index": 3,
      "explanation": "A close look adds a connected observation before the reveal rather than filler."
    },
    {
      "type": "multiple_choice",
      "question": "Why use a short sentence at one important moment?",
      "options": [
        "It can draw attention to that moment",
        "It proves all other sentences are wrong",
        "It removes the need for a goal",
        "It automatically explains every clue"
      ],
      "correct_index": 0,
      "explanation": "A short sentence can focus attention, but it is one choice rather than a universal rule."
    },
    {
      "type": "multiple_choice",
      "question": "Which ending completes the model’s goal?",
      "options": [
        "Lena forgets the display permanently",
        "She places the recovered label beside her model",
        "An unrelated story starts",
        "The blue corner is never explained"
      ],
      "correct_index": 1,
      "explanation": "Placing the label beside the model completes the exhibition goal after the discovery."
    },
    {
      "type": "short_answer",
      "question": "Write a clue for a missing red ribbon under a chair.",
      "sample_answer": "A red strip showed beside one chair leg.",
      "marking_guide": "Accept a plausible connected detail before the entire ribbon is revealed.",
      "explanation": "A clue points towards the ribbon without having to reveal everything at once."
    },
    {
      "type": "short_answer",
      "question": "Explain a revision that would make a suspense story more connected.",
      "sample_answer": "I added a paper rustle before the reveal because the missing label was moving in the draught.",
      "marking_guide": "Accept a specific clue, action or outcome revision with its purpose.",
      "explanation": "The edit should strengthen the link between question, clue and answer, not only lengthen the story."
    }
  ],
  "parent_notes": "Parent: Teaches gentle suspense, purposeful goals, fair clues, pacing, reveal, resolution and revision. These lessons follow the repository’s Year 4 narrative sequence. Exact outcome codes are empty pending verified mapping; this is not a claim of full syllabus coverage. All texts are original.\n\nParent: Look for a connected sequence rather than frightening content or a fixed word count. Accept an everyday safe scenario. The lesson supplies teaching, models and feedback. Support access and review the evidence; do not teach the steps for the child.\n\nParent: Eight multiple-choice answers are scored. The unchanged 90% threshold requires 8/8. Two written responses are reviewed manually. Model for question 9: A red strip showed beside one chair leg. Model for question 10: I added a paper rustle before the reveal because the missing label was moving in the draught.\n\nParent: The complete Rustle model shows the taught method. Review the child’s clue and answer together. A short clear story with an explained improvement can demonstrate more than a long disconnected one.",
  "evidence_instructions": "Keep the three planning notes, complete story or detailed paper-work summary, revision explanation, reflection and quiz responses.",
  "offline_alternative": "Make three planning boxes on paper, write the story and mark one revision. Later type the story or detailed summary and complete the quiz.",
  "extension": "Rewrite only the discovery paragraph to change its pace. Compare what the reader notices in each version.",
  "stage_hints": {
    "accept": [
      "Read the mission about a question, clue and satisfying answer.",
      "You will practise a gentle missing-item story before planning your own.",
      "Start by deciding why the item matters; the lesson will help you connect a clue to its reveal."
    ],
    "teach0": [
      "Look back at the difference between curiosity and confusion.",
      "Name what the character wants before choosing a mystery detail.",
      "Plan a reader question tied to a goal, such as finding an item before an event starts."
    ],
    "teach1": [
      "Reread the clue and reveal together.",
      "Choose a detail connected by colour, place, sound or movement.",
      "Show part of the missing item before showing the whole answer."
    ],
    "teach2": [
      "Look at the rushed and revised discovery.",
      "Add one observation or action that gets closer to the clue.",
      "Try a noticing sentence followed by a careful search action; leave out repeated filler."
    ],
    "teach3": [
      "Look back at how the model explains the earlier rustle.",
      "Check the reveal first, then whether the original goal is finished.",
      "Use the earlier clue to plan the discovery, followed by one outcome action."
    ],
    "learn": [
      "Read the plan before the complete story.",
      "Match the clue and search action to the later explanation.",
      "Trace question → clue → reveal → outcome and look for a missing link."
    ],
    "guided": [
      "Start with a reason the ribbon matters.",
      "Pick one place and one visible detail before the search action.",
      "Use “Beside ____, the character noticed ____.” Keep the later reveal connected."
    ],
    "plan": [
      "Begin with just the character and goal box.",
      "Ask why the item is needed before planning its hiding place.",
      "Write one goal note, then one clue note and an answer that explains that clue."
    ],
    "write": [
      "Choose the missing item and why your character needs it.",
      "Begin “____ checked ____. The ____ was missing.”",
      "A partial opening is “The game would begin soon. ____ looked beside ____.” Continue with your own goal and fair clue."
    ],
    "quiz": [
      "Return to the step about goal, clue, pace or reveal.",
      "Ask whether each choice connects to the story’s question.",
      "For written answers, give one useful detail and explain its connection to the later answer."
    ],
    "submit": [
      "Check that your story includes the clue and its connected reveal.",
      "Include your plan and explained revision as well as the story.",
      "Send the suspense story and reflection; a paper-work summary should name the clue, reveal and improvement."
    ]
  }
}'), updated_at=datetime('now') WHERE seed_key='s2-eng-y4-w01-l2';

-- s2-eng-y4-w01-l3
UPDATE lessons SET title='Year 4: Add a precise detail and check the ending', data=json_patch(data, '{
  "seed_key": "s2-eng-y4-w01-l3",
  "title": "Year 4: Add a precise detail and check the ending",
  "stage": "S2",
  "learning_area": "English",
  "year_level": "Year 4",
  "week": 1,
  "lesson_number": 3,
  "duration_minutes": 60,
  "child_mission": "Become a Sentence Editor! Help a reader identify a person or object, then check what happens when a word gains a suffix.",
  "learning_intention": "We are learning to use identifying relative clauses and apply taught y-to-i and consonant-doubling spelling patterns.",
  "success_criteria": [
    "I can identify the noun a detail describes.",
    "I can use who, which or that in a taught relative-clause pattern.",
    "I can apply the taught y-to-i pattern and its -ing exception.",
    "I can check the taught one-syllable doubling pattern.",
    "I can explain an editing decision."
  ],
  "materials": [
    "Everything you need to read is included in this lesson",
    "Optional: paper and a pencil"
  ],
  "outcome_codes": [],
  "review_status": "unreviewed",
  "pass": 1,
  "pass_mark": 0.9,
  "coming_soon": null,
  "source_note": null,
  "explicit_teaching": null,
  "resources": null,
  "sort_activity": null,
  "word_challenges": null,
  "suspense_builder": null,
  "planner_fields": null,
  "planner_title": null,
  "planner_intro": null,
  "spelling": {
    "focus": "Base word plus suffix",
    "teaching": "Say the base word and ending separately. Explain the matching check, then look, cover, write and compare with the model. Repair a difference and try again. Practice parts show word building; omit plus signs in the finished word.",
    "words": [
      {
        "word": "cried",
        "parts": "cry + ed → cried",
        "tip": "Consonant r before y; change y to i before the taught -ed ending."
      },
      {
        "word": "crying",
        "parts": "cry + ing → crying",
        "tip": "Keep y before -ing."
      },
      {
        "word": "happier",
        "parts": "happy + er → happier",
        "tip": "Consonant p before y; change y to i before -er."
      },
      {
        "word": "played",
        "parts": "play + ed → played",
        "tip": "Vowel a before y; keep y."
      },
      {
        "word": "hopping",
        "parts": "hop + ing → hopping",
        "tip": "One-syllable short-vowel base with final single p; double p before -ing."
      },
      {
        "word": "stopped",
        "parts": "stop + ed → stopped",
        "tip": "Double final p before -ed in this taught pattern."
      },
      {
        "word": "jumping",
        "parts": "jump + ing → jumping",
        "tip": "Base ends in mp; do not add another p."
      }
    ],
    "check": [
      {
        "question": "Which reminder fits the taught word played?",
        "options": [
          "Always change every y",
          "Double the final y",
          "The vowel before y means y stays here",
          "Remove all ending letters"
        ],
        "correct_index": 2,
        "explanation": "Play has a before y, so the taught consonant-before-y change does not apply; played keeps y."
      }
    ]
  },
  "spelling_focus": null,
  "hoard_words": null,
  "follow_up_challenges": null,
  "steps": null,
  "visual_plan": null,
  "interactive_activities": null,
  "printable_resource": null,
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "📖",
      "title": "Identify the noun and the detail",
      "explain": "**A noun names a person, place, thing or idea.**\nIn “The child held a label”, child and label are nouns. A detail can help the reader know which child or which label you mean. First locate the noun, then ask what information belongs to it.\n\n**A clause has a verb and a subject.**\nThe subject tells who or what the clause is about; the verb tells an action or state. In “the child carried the board”, the child is the subject and carried is the verb. A clause can be part of a longer sentence.\n\n**A relative clause describes a noun.**\nIn “the child who carried the board”, who carried the board is a relative clause. It identifies the child through an action. The word who stands for the child, and carried is the verb inside that clause.\n\nRead the whole sentence: “The child who carried the board found a space.” Found is the main action; carried belongs inside the describing clause. Our examples identify which person or object we mean, so we do not put commas around those identifying clauses. Other relative-clause patterns can use commas; today keep to these models.",
      "example": "I DO:\n“The child who carried the board found a space.”\nNoun being described: child.\nRelative clause: who carried the board.\nMain action: found a space.\nI remove the describing part briefly to check the main sentence: “The child found a space.” The detail identifies which child.\n\nYOU TRY:\nIn “The label that lay under the chair was blue”, what noun does that lay under the chair describe?\n\nCHECK:\nIt describes label. Lay tells the position in that clause; was blue is the main description of the label.",
      "notice": "Find the noun being described. Do not mistake every word after it for one long relative clause.",
      "check": {
        "question": "In “The child who carried the board found a space”, what noun does who carried the board describe?",
        "options": [
          "Space",
          "Found",
          "Board only",
          "Child"
        ],
        "correct_index": 3,
        "explanation": "The relative clause identifies the child. The main action found a space follows that clause."
      }
    },
    {
      "icon": "📖",
      "title": "Join two ideas without repeating the noun",
      "explain": "**Use a relative word to connect.**\nWho refers to a person in these models. Which or that can refer to a thing. That can also refer to a person, but we will practise who for people and which or that for objects. These are useful patterns, not a claim that each word has only one use.\n\n**Keep the detail beside its noun.**\nStart with “The child found a space” and “The child carried the board”. Combine them as “The child who carried the board found a space”. The detail immediately follows child, so its target is clear.\n\n**Do not repeat the subject inside.**\n“The child who she carried the board” repeats the person through who and she. In our subject-relative pattern, who already stands for the child. Keep “who carried the board”. Other clause patterns can work differently.\n\n**Reread the full sentence.**\nCheck the identifying detail and the main idea. It should tell which person or object, then still finish the main sentence. A phrase such as “the child who carried the board” needs a main statement for this task.",
      "example": "I DO:\nMain idea: The box sat on the table.\nDetail: The box held the cards.\nJoined: “The box that held the cards sat on the table.”\nThat held the cards identifies the box. Sat on the table finishes the main statement.\n\nYOU TRY:\nJoin “The girl found the ribbon” and “The girl made the map” using who.\n\nCHECK:\n“The girl who made the map found the ribbon.” Who replaces the repeated girl in the detail. Do not add she after who in this pattern.",
      "notice": "Put the describing clause next to the intended noun, and preserve the main statement.",
      "check": {
        "question": "Which joined sentence follows the taught pattern?",
        "options": [
          "The box that held the cards sat on the table.",
          "The box that it held the cards sat on the table.",
          "The box that held the cards",
          "The box the cards that table."
        ],
        "correct_index": 0,
        "explanation": "That held the cards identifies the box without repeating it as it, and sat on the table completes the main idea."
      },
      "visual": [
        {
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 224\"><rect width=\"420\" height=\"224\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">The child | found a space.</text><text x=\"16\" y=\"80\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Detail: who carried the board</text><text x=\"16\" y=\"126\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">The child who carried the board</text><text x=\"16\" y=\"172\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">found a space.</text></svg>",
          "alt": "The main statement is the child found a space. The relative clause who carried the board sits after child and before the main action.",
          "caption": "Identify the noun, add its detail, finish the main idea."
        }
      ]
    },
    {
      "icon": "📖",
      "title": "Change final y carefully when adding a suffix",
      "explain": "**A suffix is an ending added to a word.**\nFor example, -ed can mark a past action and -er can compare. Look at the base word first, then the ending. Spelling changes depend on both; do not change a letter simply because you notice y. Happier means more happy.\n\n**Know the letter labels.**\nA, e, i, o and u are common vowel letters. R and p are consonant letters. Y can work differently in different words; for this spelling check, look at the letter immediately before it.\n\n**Practise a consonant before y.**\nIn cry, the r before y is a consonant letter. Before the taught -ed ending, change y to i: cry + ed becomes cried. In happy, the p before y is a consonant; happy + er becomes happier. Add the whole ending after the change.\n\n**Keep y before -ing.**\nCry + ing becomes crying, not criing. This is an important exception to the change practised above. Look at the suffix before deciding.\n\n**Keep y after a vowel in these examples.**\nPlay has the vowel letter a before y. Play + ed becomes played. The change-to-i pattern does not apply. These models cover the words used here; some other spellings have exceptions and should be checked against a reliable model.",
      "example": "I DO:\ncry + ed: consonant r before y; change y to i; add ed → cried.\nhappy + er: consonant p before y; change y to i; add er → happier.\ncry + ing: the -ing exception; keep y → crying.\nplay + ed: vowel a before y; keep y → played.\n\nYOU TRY:\nExplain why cry + ing keeps y, then write the complete word without a plus sign.\n\nCHECK:\nThe suffix is -ing, so keep the base word’s y: crying. The plus sign is a practice label, not part of the finished spelling.",
      "notice": "Check the letter before y and the suffix. “Always change y” would make crying and played incorrect.",
      "check": {
        "question": "Why does cry + ing keep y in the taught pattern?",
        "options": [
          "All suffixes change y to i",
          "The ending is -ing, which keeps y here",
          "Cry has no consonants",
          "Plus signs belong in the finished word"
        ],
        "correct_index": 1,
        "explanation": "The -ing exception keeps y in crying. The consonant-before-y change practised with -ed does not apply to this ending."
      }
    },
    {
      "icon": "📖",
      "title": "Double a final consonant when the pattern fits",
      "explain": "**Hear the spoken parts first.**\nA syllable is a spoken beat. Hop has one beat; happy has two. Say each word normally and tap its beats. We practise one-beat base words for this doubling rule.\n\n**Listen to the vowel sound.**\nThe o in hop has a short vowel sound. Compare it with the o in hope, which sounds like the letter name. Short describes the sound here, not the number of letters in the whole word. Listen to the models hop, stop and rub before checking their written endings.\n\n**Look at the base word’s ending.**\nFor the one-syllable words taught here, a short vowel followed by one final consonant often needs that consonant doubled before a vowel-starting suffix such as -ing or -ed. Hop has a short vowel, one vowel letter o and a single final consonant p. Hop + ing becomes hopping.\n\n**Work through the checks.**\nSay the base word: one syllable? Check a short vowel and one final consonant. Check that the suffix starts with a vowel. Stop + ed becomes stopped. Rub + ing becomes rubbing. We are not learning the rules for every longer word today.\n\n**Compare a word that does not fit.**\nJump ends with two consonant letters, m and p. Jump + ing becomes jumping, with no extra p. Play does not fit the short-vowel single-final-consonant pattern; played keeps its base spelling. Do not double w, x or y using this rule.\n\n**Read and compare the result.**\nSay hopping, then check the two p letters against the model. Notice that hoping is a different word from the base hope. Doubling can preserve the intended base word and meaning.",
      "example": "I DO:\nhop + ing → hopping: one syllable, short o, final single p, vowel-starting suffix.\nstop + ed → stopped: one syllable, short o, final single p, vowel-starting suffix.\njump + ing → jumping: two consonant letters at the end; no extra p.\n\nYOU TRY:\nUse the checks for rub + ing. Write the result and explain the doubled letter.\n\nCHECK:\nRubbing has two b letters. Rub fits our one-syllable short-vowel single-final-consonant pattern, and -ing starts with a vowel.",
      "notice": "Check the whole pattern. The fact that a word is short does not mean its last letter must always be doubled.",
      "check": {
        "question": "Why does jump + ing become jumping without another p?",
        "options": [
          "Every -ing word loses p",
          "The word has no vowel",
          "The base ends with two consonant letters, m and p",
          "All short words have the same ending"
        ],
        "correct_index": 2,
        "explanation": "Jump does not have just one consonant letter after its vowel; its ending mp does not fit the taught doubling pattern."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Check the base and the ending",
            "transcript": "Pip: I see y in cry. Should I change it whenever I add an ending?\nJuno: Check which ending. Cry plus ed becomes cried, but cry plus ing keeps y in crying.\nPip: For hop plus ing, I check the short vowel and single final consonant. I need two p letters in hopping.\nJuno: Compare jump. It ends in m and p, so jumping needs no extra p. Pause and use the checks before choosing a spelling.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "I see y in cry. Should I change it whenever I add an ending?"
                  },
                  {
                    "who": "juno",
                    "text": "Check which ending. Cry plus ed becomes cried, but cry plus ing keeps y in crying."
                  },
                  {
                    "who": "pip",
                    "text": "For hop plus ing, I check the short vowel and single final consonant. I need two p letters in hopping."
                  },
                  {
                    "who": "juno",
                    "text": "Compare jump. It ends in m and p, so jumping needs no extra p. Pause and use the checks before choosing a spelling.",
                    "pause_after": true
                  }
                ]
              }
            ]
          }
        }
      ]
    }
  ],
  "worked_example": "I DO: Edit a short scene using the taught patterns.\nDRAFT\nThe child found the ribbon. The child made the map. She was hop-ing beside the chair. She was happy-er because the game could begin.\n\nMY EDITS\n1. Identify the child: combine the two statements as “The child who made the map found the ribbon.” Who made the map follows child and does not repeat she inside it.\n2. Hop + ing fits the taught doubling pattern: hopping.\n3. Happy + er has consonant p before y, so change y to i and add er: happier.\n4. Read the finished scene for meaning and marks.\n\nFINISHED SCENE\nThe child who made the map found the ribbon. She was hopping beside the chair. She felt happier because the game could begin.\n\nWHY IT WORKS\nThe relative clause identifies the child; the main action still finishes the sentence. The two suffix decisions use different checks, not one general instruction to change every ending.\n\nCOMMON MISTAKE AND FIX\n“The child who she made the map” repeats the subject. Remove she: who already refers to the child in this pattern.\n“Criing” applies the y-to-i idea before -ing. Keep y instead: crying.\n\nCHECK ROUTINE\nFind the target noun → check the clause → find base and suffix → choose the matching pattern → compare with a model → reread the whole scene.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 224\"><rect width=\"420\" height=\"224\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">cry + ed → cried</text><text x=\"16\" y=\"80\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">cry + ing → crying</text><text x=\"16\" y=\"126\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">hop + ing → hopping</text><text x=\"16\" y=\"172\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">jump + ing → jumping</text></svg>",
      "alt": "Four comparisons show y changing before ed in cried, staying before ing in crying, and p doubling in hopping but not jumping.",
      "caption": "Different endings need different checks."
    }
  ],
  "guided_practice": "WE DO: Edit one sentence and two endings.\n1. Start with “The box was blue” and “The box held the cards”. Say which noun repeats: box.\n2. Use that to attach the detail. Try before comparing: “The box that held the cards was blue.” Find held inside the clause and was in the main statement.\n3. Check “The box that it held the cards”. Explain what repeats, then remove it for our subject-relative pattern.\n4. Build cry + ed. Check the letter before y and the suffix. Compare with cried.\n5. Build stop + ed. Say the one-syllable base, check its short vowel and single final consonant, then compare with stopped.\n6. Cover both models and write the words again. If your attempt differs, circle the exact difference, repair it and try once more. A correct first attempt is fine.\nSay what you checked; knowing the method matters as well as remembering a spelling.",
  "independent_task": "YOU DO: Sentence and suffix editor (about 20 minutes).\n1. Join “The girl carried the sign” and “The girl found the ribbon” using who. Put the detail beside girl and keep a complete main statement.\n2. Join “The box held the cards” and “The box sat on the shelf” using which or that. Reread both joined sentences.\n3. Write these finished words: cry + ed; cry + ing; happy + er; play + ed; hop + ing; stop + ed; jump + ing. Use the taught checks and then compare with the spelling models.\n4. Choose two of your words and use each in a complete sentence. They can describe a fictional game or display.\n5. Explain one clause decision and one spelling decision. Use “I put the detail after ____ because ____” and “I checked ____ before adding ____.”\n6. Reread and improve one part if needed. If your first attempt was correct, explain the check that confirmed it.\nWork on paper or in the big box. A typed record is enough; upload is optional. Check: two complete joined statements; accurate suffix words; two sensible example sentences; explained decisions.",
  "response_prompt": "Which check helped you avoid a repeated subject or a spelling change that did not fit?",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "What does a relative clause do in our examples?",
      "options": [
        "Replaces all main statements",
        "Lists unrelated objects",
        "Removes every verb",
        "Describes and identifies a noun"
      ],
      "correct_index": 3,
      "explanation": "The taught relative clauses identify which person or object the sentence means."
    },
    {
      "type": "multiple_choice",
      "question": "Which word refers to a person in the taught pattern?",
      "options": [
        "Who",
        "Under",
        "Very",
        "Quickly"
      ],
      "correct_index": 0,
      "explanation": "Who can stand for the person in a clause such as who made the map."
    },
    {
      "type": "multiple_choice",
      "question": "Which sentence avoids repeating the subject inside the taught clause?",
      "options": [
        "The girl who she made the map found the ribbon.",
        "The girl who made the map found the ribbon.",
        "The girl who she she",
        "The girl who made the map"
      ],
      "correct_index": 1,
      "explanation": "Who already refers to the girl in the describing clause; found the ribbon completes the main statement."
    },
    {
      "type": "multiple_choice",
      "question": "Where should the relative clause go in these models?",
      "options": [
        "After an unrelated noun",
        "Before every sentence title",
        "Beside the noun it describes",
        "Only after the full stop"
      ],
      "correct_index": 2,
      "explanation": "Placing the clause next to its noun makes the intended description clear."
    },
    {
      "type": "multiple_choice",
      "question": "Which is cry + ed?",
      "options": [
        "Cryed",
        "Criing",
        "Cryyed",
        "Cried"
      ],
      "correct_index": 3,
      "explanation": "The taught consonant-before-y pattern changes y to i before -ed, giving cried."
    },
    {
      "type": "multiple_choice",
      "question": "Which is cry + ing?",
      "options": [
        "Crying",
        "Criing",
        "Crieding",
        "Cryying"
      ],
      "correct_index": 0,
      "explanation": "Keep y before -ing: crying."
    },
    {
      "type": "multiple_choice",
      "question": "Which spelling follows the taught hop + ing pattern?",
      "options": [
        "Hoping",
        "Hopping",
        "Hoppping",
        "Hoppng"
      ],
      "correct_index": 1,
      "explanation": "Hop has a short vowel and final single p; doubling p before -ing gives hopping."
    },
    {
      "type": "multiple_choice",
      "question": "Why does played keep y?",
      "options": [
        "Every y must always stay",
        "The suffix has no letters",
        "Play has a vowel letter before y",
        "The word has three syllables"
      ],
      "correct_index": 2,
      "explanation": "The consonant-before-y change does not apply because a is before y in play."
    },
    {
      "type": "short_answer",
      "question": "Join “The child found the label” and “The child carried the board” using who.",
      "sample_answer": "The child who carried the board found the label.",
      "marking_guide": "Accept this identifying relative clause beside child, with no repeated she or he, and a complete main statement.",
      "explanation": "Who carried the board identifies the child while found the label remains the main action."
    },
    {
      "type": "short_answer",
      "question": "Explain the spelling of stop + ed.",
      "sample_answer": "Stop is a one-syllable short-vowel word with a single final consonant, so I double p before -ed: stopped.",
      "marking_guide": "Accept the taught pattern and doubled p, with stopped correctly written.",
      "explanation": "The base and vowel-starting ending fit the taught doubling pattern."
    }
  ],
  "parent_notes": "Parent: Teaches noun targets, subject-relative identifying clauses and two deliberately limited suffix patterns. These lessons follow the repository’s Year 4 narrative sequence. Exact outcome codes are empty pending verified mapping; this is not a claim of full syllabus coverage. All texts are original.\n\nParent: Look for complete main statements and the clause beside its noun. These examples are identifying clauses without commas; non-identifying commas and object-relative clauses are outside this lesson. Spelling rules are limited to the given models, not all English words. The lesson supplies teaching, models and feedback. Support access and review the evidence; do not teach the steps for the child.\n\nParent: Eight multiple-choice answers are scored. The unchanged 90% threshold requires 8/8. Two written responses are reviewed manually. Model for question 9: The child who carried the board found the label. Model for question 10: Stop is a one-syllable short-vowel word with a single final consonant, so I double p before -ed: stopped.\n\nParent: Task models: The girl who found the ribbon carried the sign. The box that sat on the shelf held the cards. Reversing which given idea is main is also acceptable. Words: cried, crying, happier, played, hopping, stopped, jumping. Accept any sensible sentences and explanations of the applicable checks.",
  "evidence_instructions": "Keep both joined sentences, seven suffix words, two example sentences, clause/spelling explanations, reflection and written quiz answers.",
  "offline_alternative": "Copy the sentence pairs and spelling models on paper. Join, explain, cover and write, then check the finished words. Later type your evidence summary and complete the quiz.",
  "extension": "Write two sentences about different boxes, then use an identifying relative clause to make clear which box you mean.",
  "stage_hints": {
    "accept": [
      "Look at the two jobs: identify a noun and check a suffix.",
      "You will learn the clause pattern before practising the word endings separately.",
      "Begin with the noun a detail describes; keep the spelling models for the later steps."
    ],
    "teach0": [
      "Look for the noun beside the describing words.",
      "Find the action inside the detail and the main action separately.",
      "Temporarily remove the describing clause to locate the main statement, then put it back beside its noun."
    ],
    "teach1": [
      "Look back at the repeated noun in the sentence pair.",
      "Replace that repeated subject with a suitable relative word.",
      "Put the detail after its noun and reread the main statement; do not repeat another subject in this pattern."
    ],
    "teach2": [
      "Look at the base word and suffix as separate parts.",
      "Check the letter before y, then whether the suffix is -ing.",
      "Choose the matching taught pattern before writing the whole word without a plus sign."
    ],
    "teach3": [
      "Look at the ending of the base word before adding letters.",
      "Check one syllable, short vowel, single final consonant and a vowel-starting suffix.",
      "Compare a base ending in one consonant with one ending in two; apply only the pattern that fits."
    ],
    "learn": [
      "Read each edit and its reason separately.",
      "Match the relative-clause edit to a noun and the suffix edit to its base.",
      "Use the model’s checking order to explain one decision rather than copying the whole passage."
    ],
    "spelling": [
      "Say the base and ending before covering a model.",
      "Notice the letter before y or the final consonant pattern.",
      "Write once, compare the exact letters, repair a difference and try again."
    ],
    "guided": [
      "Start by finding the repeated noun in the two statements.",
      "Complete the main idea after attaching the describing clause.",
      "Check one suffix at a time, naming the pattern before comparing with the model."
    ],
    "write": [
      "Start with just the first sentence pair and its repeated noun.",
      "Use the frame “The girl who ____ ____.” Keep a main action at the end.",
      "A partial opening is “The girl who ____ carried ____.” Fill the detail from your sentence pair, then check the other tasks."
    ],
    "quiz": [
      "Return to the relative-clause or suffix step the question concerns.",
      "For a clause, find its noun and main action; for spelling, identify base and ending.",
      "Apply the matching taught check instead of choosing by word length or changing every y."
    ],
    "submit": [
      "Check both joined sentences and all seven suffix words.",
      "Include the example sentences and your clause and spelling explanations.",
      "Send your editing record and reflection; describe any paper work in a typed summary."
    ]
  }
}'), updated_at=datetime('now') WHERE seed_key='s2-eng-y4-w01-l3';

-- s2-eng-y4-w01-l4
UPDATE lessons SET title='Year 4: Tell a story your listener can follow', data=json_patch(data, '{
  "seed_key": "s2-eng-y4-w01-l4",
  "title": "Year 4: Tell a story your listener can follow",
  "stage": "S2",
  "learning_area": "English",
  "year_level": "Year 4",
  "week": 1,
  "lesson_number": 4,
  "duration_minutes": 60,
  "child_mission": "Become a Storyteller! Turn a short story into clear cue notes, rehearse it and make one purposeful improvement to your telling.",
  "learning_intention": "We are learning to select connected events, tell them clearly from cue notes and explain a rehearsal improvement.",
  "success_criteria": [
    "I can introduce a character, place and goal.",
    "I can keep the important events connected.",
    "I can use cue notes instead of reading every word.",
    "I can choose a helpful pace, pause or emphasis.",
    "I can explain an improvement and describe my evidence honestly."
  ],
  "materials": [
    "Everything you need to read is included in this lesson",
    "Optional: paper and a pencil"
  ],
  "outcome_codes": [],
  "review_status": "unreviewed",
  "pass": 1,
  "pass_mark": 0.9,
  "coming_soon": null,
  "source_note": null,
  "explicit_teaching": null,
  "resources": null,
  "sort_activity": null,
  "word_challenges": null,
  "suspense_builder": null,
  "planner_fields": null,
  "planner_title": null,
  "planner_intro": null,
  "spelling": null,
  "spelling_focus": null,
  "hoard_words": null,
  "follow_up_challenges": null,
  "steps": null,
  "visual_plan": null,
  "interactive_activities": null,
  "printable_resource": {
    "title": "The Windy Sign: storytelling cue sheet",
    "instructions": "Read the original story, then write a few reminder words in each box. Use them for two tellings away from the screen. Note one change and label solo or observed practice.",
    "passage": "THE WINDY SIGN\nEli was preparing a treasure-hunt game in the courtyard. He wanted everyone to find the finish beside the garden bed. He wrote FINISH on a card and placed it on a chair.\nBefore the game began, a gust blew the card face down. Eli could still see the chair, but the players would not know what it marked. He tried standing the card up again. It fell a second time.\nEli looked at the materials on the table. He folded a cardboard stand, slid the card into it and placed a book across the stand’s base. When the next gust came, the word stayed visible. Eli checked the route, then called the players to begin. At the finish, they followed the sign and found the final clue.",
    "prompts": [
      "Beginning: person, place and goal",
      "Problem: what fails, and why",
      "Response: what the character tries next",
      "Outcome: what happens to the goal",
      "Rehearsal: my change, reason and evidence type"
    ]
  },
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "📖",
      "title": "Choose the events your listener needs",
      "explain": "**Storytelling helps someone follow an event.**\nA listener cannot always look back at a page. Introduce the person, situation and goal, then explain the problem, response and outcome. These parts give your telling a route.\n\n**Read and understand before preparing.**\nRead the complete original story below. Eli wants a visible finish sign for his game. The wind makes the first arrangement fail. His stand and book change the result. Notice the cause-and-response connection, not only the order of objects.\n\n**Keep important events; reduce small details.**\nYou do not have to memorise every sentence. A retelling keeps the story’s meaning in your own words. You can shorten a description while preserving the problem and solution. Do not remove the failed first attempt if it explains why Eli tries a different approach.\n\n**Introduce before using pronouns.**\nStart with Eli rather than an unexplained he. After the listener knows who he is, he can refer to him clearly. If another person enters, make references clear again.",
      "example": "READ THE COMPLETE ORIGINAL STORY\nTHE WINDY SIGN\nEli was preparing a treasure-hunt game in the courtyard. He wanted everyone to find the finish beside the garden bed. He wrote FINISH on a card and placed it on a chair.\nBefore the game began, a gust blew the card face down. Eli could still see the chair, but the players would not know what it marked. He tried standing the card up again. It fell a second time.\nEli looked at the materials on the table. He folded a cardboard stand, slid the card into it and placed a book across the stand’s base. When the next gust came, the word stayed visible. Eli checked the route, then called the players to begin. At the finish, they followed the sign and found the final clue.\n\nI DO:\nBeginning: Eli prepares a game and needs a visible finish sign.\nProblem: wind blows the card face down; standing it up again fails.\nResponse: he makes a stand and weights its base.\nOutcome: the sign stays visible and the players find the finish.\n\nYOU TRY:\nWhich event explains why simply standing the card up is not enough?\n\nCHECK:\nIt falls a second time. Keeping that failed attempt helps a listener understand why Eli changes his plan.",
      "notice": "An object list is not a telling. Include what happens and why the character responds.",
      "check": {
        "question": "Which note preserves the story’s main problem?",
        "options": [
          "Wind makes the finish card fall face down",
          "A list of all colours",
          "Only the word courtyard",
          "An invented broken bicycle"
        ],
        "correct_index": 0,
        "explanation": "The fallen card explains why the players would not recognise the finish and why Eli needs another arrangement."
      }
    },
    {
      "icon": "📖",
      "title": "Turn event notes into spoken ideas",
      "explain": "**A cue is a reminder.**\nCue notes use a few useful words to prompt a fuller idea. “Wind: card falls twice” can remind you to explain the failed arrangement. “Card” alone may be too vague; a full paragraph may tempt you to read every word.\n\n**Use one event per line or box.**\nPut the beginning first, then the problem, response and outcome. Leave enough space to find each note at a glance. You can use paper, the printable cue sheet or your usual accessible note format.\n\n**Practise the look-and-tell routine.**\nGlance at one cue, then explain that event in a complete idea. Look back for the next cue when needed. You can choose different wording each time if the meaning stays accurate. Looking at a note is useful, not a failure.\n\n**Connect events for the listener.**\nWords such as but, so and finally can show the relationship between events. Use them where they help; do not add finally before the problem just because it sounds like a storytelling word.",
      "example": "I DO:\nCue: “Wind: card falls twice.”\nSpoken idea: “The wind blew the sign face down. Eli stood it up, but it fell again.”\nCue: “Stand + book.”\nSpoken idea: “So Eli made a cardboard stand and put a book across its base.”\nThe notes prompt the meaning rather than every exact word.\n\nYOU TRY:\nTurn “End: visible sign, players finish” into one or two spoken sentences.\n\nCHECK:\nOne possibility: “The sign stayed visible in the wind. The players followed it to the finish.” Keep the outcome even if your words differ.",
      "notice": "A cue should be short enough to scan and specific enough to remind you of the event.",
      "check": {
        "question": "What is the job of a cue note?",
        "options": [
          "To replace every story event with one vague word",
          "To remind you of an event you will explain",
          "To require memorising the original punctuation",
          "To change the outcome randomly"
        ],
        "correct_index": 1,
        "explanation": "A cue prompts a fuller spoken idea. It supports memory without requiring a full written script."
      },
      "visual": [
        {
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 224\"><rect width=\"420\" height=\"224\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">CUE: wind, card falls twice</text><text x=\"16\" y=\"80\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">TELL: explain the failed attempt</text><text x=\"16\" y=\"126\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">CUE: stand + book</text><text x=\"16\" y=\"172\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">TELL: explain how it helps</text></svg>",
          "alt": "Two cues prompt complete explanations: wind and two falls explain failure; stand and book explain the response.",
          "caption": "Glance → explain → next cue."
        }
      ]
    },
    {
      "icon": "📖",
      "title": "Choose delivery that supports meaning",
      "explain": "**Delivery is how you communicate the telling.**\nPace is your speed. A pause is a brief stop. Emphasis makes a chosen word or phrase stand out. Use these choices to help a listener follow an important event, not to show off an acting voice.\n\n**Keep related words together.**\nSay “the finish sign” as a connected group. A pause between every word breaks the thought apart. A brief pause after explaining the second failure can give the listener time before the new solution.\n\n**Give the response enough time.**\nIf you rush “stand and book”, the listener may miss how the solution works. Slow that event a little and clearly say the book weights the base. Speaking loudly does not replace explaining the action.\n\n**Try a choice, then compare.**\nTell one part twice. First use your ordinary delivery; then change one pace, pause or emphasis choice. Ask whether the event becomes easier to understand. Keep the change if it helps. No special accent, dramatic voice or recording is required.",
      "example": "I DO:\nI say: “It fell again. [brief pause] So Eli tried a different plan.”\nThe pause marks the move from repeated failure to a new response. I keep “tried a different plan” connected.\nI give “a book across the base” a steady pace so the listener understands how the stand stays put.\n\nYOU TRY:\nTell the response event twice. On the second attempt, slow only the explanation of the book’s place.\n\nCHECK:\nCould you hear the connection between the book and the stand? If not, clarify the words before adding more emphasis. Volume alone will not supply the missing relationship.",
      "notice": "Make one purposeful change at a time. You can communicate clearly in your own voice and with your usual support.",
      "check": {
        "question": "Which delivery choice supports understanding the solution?",
        "options": [
          "Shout every word without explaining",
          "Pause inside every small word group",
          "Give the stand-and-book explanation a steady pace",
          "Invent a louder unrelated event"
        ],
        "correct_index": 2,
        "explanation": "A steady explanation helps the listener follow how the materials solve the problem. The other changes disrupt or replace the meaning."
      },
      "visual_before": [
        {
          "episode": {
            "title": "A note becomes a telling",
            "transcript": "Pip: My cue says stand and book. If I say only those words, will the listener understand the solution?\nJuno: Explain the action: Eli makes a stand and puts a book across its base. The cue reminds you; it is not the whole telling.\nPip: I can slow that explanation and keep the important word groups connected.\nJuno: Then rehearse the story again. Check both event accuracy and delivery. If you practise alone, describe it as solo practice.\nPip: Pause and turn one short cue into a full idea. Try it twice and explain one useful change.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "My cue says stand and book. If I say only those words, will the listener understand the solution?"
                  },
                  {
                    "who": "juno",
                    "text": "Explain the action: Eli makes a stand and puts a book across its base. The cue reminds you; it is not the whole telling."
                  },
                  {
                    "who": "pip",
                    "text": "I can slow that explanation and keep the important word groups connected."
                  },
                  {
                    "who": "juno",
                    "text": "Then rehearse the story again. Check both event accuracy and delivery. If you practise alone, describe it as solo practice."
                  },
                  {
                    "who": "pip",
                    "text": "Pause and turn one short cue into a full idea. Try it twice and explain one useful change.",
                    "pause_after": true
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    {
      "icon": "📖",
      "title": "Rehearse, review and improve honestly",
      "explain": "**Rehearsal is practice with a purpose.**\nTell the whole story once from your cues. Notice a specific problem: perhaps you skipped the second fall, used an unclear pronoun or rushed the solution. Pick one thing to improve rather than trying to judge everything at once.\n\n**Review meaning and delivery separately.**\nAsk: Did I keep the main events accurate? Then ask: Were the words clear and the important event easy to follow? A fluent telling can still miss a key event, and an accurate plan does not guarantee clear delivery.\n\n**Try again and explain the change.**\n“I added the failed second attempt so the different solution makes sense” describes a content improvement. “I slowed the solution so the book’s position was clear” describes a delivery improvement. Give a reason, not only “it was better”.\n\n**Describe what was actually produced.**\nYou can practise independently without a listener or recording. A written cue plan demonstrates preparation. An observed or recorded telling can demonstrate actual delivery. If no one heard it, label your evidence as solo practice and describe what you noticed yourself. Use your usual communication method if speaking is inaccessible.",
      "example": "I DO:\nFirst attempt: I jump from “the sign fell” to “players began”. The solution disappears.\nRevision: I add the stand-and-book cue and explain the action.\nSecond attempt: I slow that explanation and keep “across the base” together.\nReflection: “I restored the solution event and gave it more time so the ending made sense.”\n\nYOU TRY:\nChoose one part of your own practice to improve. Tell it again, then describe the difference.\n\nCHECK:\nName an actual event or delivery choice and its purpose. If your first attempt was clear, describe the check that confirmed it instead of inventing an error.",
      "notice": "Written preparation and observed speaking show different skills. Keep the evidence description accurate.",
      "check": {
        "question": "Which reflection explains a purposeful improvement?",
        "options": [
          "It was better because it was better",
          "My notes prove a performance nobody heard",
          "I changed every event without checking",
          "I restored the solution event so the outcome made sense"
        ],
        "correct_index": 3,
        "explanation": "The reflection names the change and explains how it helps the listener follow the story. The other statements lack reasoning or misdescribe evidence."
      }
    }
  ],
  "worked_example": "I DO: Prepare and rehearse a complete telling.\nTHE WINDY SIGN\nEli was preparing a treasure-hunt game in the courtyard. He wanted everyone to find the finish beside the garden bed. He wrote FINISH on a card and placed it on a chair.\nBefore the game began, a gust blew the card face down. Eli could still see the chair, but the players would not know what it marked. He tried standing the card up again. It fell a second time.\nEli looked at the materials on the table. He folded a cardboard stand, slid the card into it and placed a book across the stand’s base. When the next gust came, the word stayed visible. Eli checked the route, then called the players to begin. At the finish, they followed the sign and found the final clue.\n\nMY FOUR CUES\nEli: finish sign for game\nWind: card falls twice\nResponse: stand + book across base\nOutcome: sign visible, players finish\n\nMY CONNECTED TELLING\n“Eli was preparing a treasure hunt and needed a visible finish sign. The wind blew the card face down. He stood it up, but it fell again. So Eli made a cardboard stand and put a book across its base. This time the sign stayed visible. The players followed it to the finish and found the last clue.”\n\nMY DELIVERY PLAN\nI introduce Eli before using he. I pause briefly after the second fall, then give the new solution enough time. I keep a book across its base connected so the listener hears how it helps.\n\nCOMMON MISTAKE AND FIX\n“Eli had a card and a chair and a book” lists objects but loses the response. I replace the list with what he does and how the sign stays visible.\n\nMY REHEARSAL NOTE\nOn my first solo practice I skipped the second fall. I added it back so the reason for changing plans was clear. I would need an actual observed or recorded telling to claim evidence of delivery beyond my own report.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 224\"><rect width=\"420\" height=\"224\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Accuracy: keep connected events</text><text x=\"16\" y=\"80\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Delivery: support the meaning</text><text x=\"16\" y=\"126\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Rehearse: change one thing</text><text x=\"16\" y=\"172\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Evidence: say what you produced</text></svg>",
      "alt": "A rehearsal checklist separates accurate story events from delivery, improves one thing and labels the evidence honestly.",
      "caption": "Preparation and performance are reviewed separately."
    }
  ],
  "guided_practice": "WE DO: Build and practise one connected telling.\n1. Write the first cue: Eli, game, visible finish. Say an opening that introduces all three ideas; compare with the model only after your try.\n2. Write a problem cue that includes both falls. Explain why the repeated failure matters.\n3. Write a response cue. Turn stand + book into a complete idea describing where the book goes.\n4. Add an outcome cue and explain the sign’s effect on the players.\n5. Tell from the four cues. Choose one pace or pause change and try the relevant event again.\n6. Explain the change using “I changed ____ so a listener could ____.” Check event accuracy against the original story.\nPractising alone is fine. A partner, recording or uploaded file is optional.",
  "independent_task": "YOU DO: Storytelling and rehearsal record (about 20–25 minutes).\nUse The Windy Sign, included above.\n1. Read the complete story. Prepare four short cue notes: beginning, problem, response, outcome. The printable is optional; ordinary paper or typed notes work too.\n2. Plan one pace, pause or emphasis choice that supports meaning. Explain its purpose in a short note.\n3. Tell the story from the cues in your own words. Keep the important events and use your usual communication support. A listener or recording is optional.\n4. Check accuracy and clarity. Choose one useful change and tell it again. If a written communication format is your usual method, practise communicating the connected story in that format and label it.\n5. In the big box include your four cues, retelling wording or summary, and the change with its reason. State whether practice was solo, observed, recorded or in a written format.\n6. Keep any paper cue sheet for review; an upload is not required.\nCheck: introduced character and goal; accurate problem and response; connected outcome; helpful cue notes; purposeful delivery plan; explained improvement; honest evidence label.",
  "response_prompt": "What did your second practice make clearer, and what evidence do you have of that change?",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "Why introduce Eli before saying he?",
      "options": [
        "Every sentence must use a name",
        "The listener needs to know who the pronoun means",
        "It removes the story’s goal",
        "It changes the wind"
      ],
      "correct_index": 1,
      "explanation": "Introducing the character gives the listener a clear reference for the later pronoun."
    },
    {
      "type": "multiple_choice",
      "question": "Why keep the second fall in a retelling?",
      "options": [
        "It is an unrelated decoration",
        "It changes the sign into a map",
        "It explains why Eli tries a different arrangement",
        "Every story must repeat an action twice"
      ],
      "correct_index": 2,
      "explanation": "The repeated failure explains the choice to use a stand and book; it is a connected event here."
    },
    {
      "type": "multiple_choice",
      "question": "Which cue best prompts the response?",
      "options": [
        "Stand + book across base",
        "Only blue",
        "Every punctuation mark",
        "An unrelated race"
      ],
      "correct_index": 0,
      "explanation": "The cue points to the materials and action used to stabilise the sign."
    },
    {
      "type": "multiple_choice",
      "question": "How should you use a cue?",
      "options": [
        "Say only its letters",
        "Replace the story’s ending",
        "Never look at it again",
        "Glance at it and explain the event in a full idea"
      ],
      "correct_index": 3,
      "explanation": "The cue supports memory; the spoken explanation provides the event and meaning."
    },
    {
      "type": "multiple_choice",
      "question": "What does pace describe?",
      "options": [
        "Only the number of characters",
        "How quickly you communicate the telling",
        "The colour of the notes",
        "An invented outcome"
      ],
      "correct_index": 1,
      "explanation": "Pace is delivery speed, which can affect whether the listener follows the event."
    },
    {
      "type": "multiple_choice",
      "question": "Which pause choice helps here?",
      "options": [
        "Stop between every word",
        "Pause only inside a person’s name",
        "Briefly mark the move from repeated failure to a new plan",
        "Never pause for any reason"
      ],
      "correct_index": 2,
      "explanation": "The pause can mark an important transition while keeping related words together."
    },
    {
      "type": "multiple_choice",
      "question": "Which check concerns story accuracy?",
      "options": [
        "Whether the solution event was included correctly",
        "Whether every word was loud",
        "Whether the paper was coloured",
        "Whether all cues were decorated"
      ],
      "correct_index": 0,
      "explanation": "Including the original solution accurately checks meaning, separately from delivery choices."
    },
    {
      "type": "multiple_choice",
      "question": "What does a written cue plan show by itself?",
      "options": [
        "A performance heard by a real listener",
        "Proof of recorded audio",
        "Every audience reaction",
        "Preparation and intended choices"
      ],
      "correct_index": 3,
      "explanation": "A cue plan records preparation; observed or recorded delivery needs separate evidence."
    },
    {
      "type": "short_answer",
      "question": "Turn the cue “stand + book across base” into a connected story event.",
      "sample_answer": "Eli made a cardboard stand and placed a book across its base so the sign stayed visible.",
      "marking_guide": "Accept an accurate explanation of the stand, weighted base and purpose.",
      "explanation": "The cue becomes a full explanation of how the response addresses the wind problem."
    },
    {
      "type": "short_answer",
      "question": "Explain one purposeful rehearsal improvement.",
      "sample_answer": "I slowed the stand-and-book explanation so a listener could follow how the sign stayed up.",
      "marking_guide": "Accept an actual specific accuracy or delivery improvement with a reason, without requiring identical wording.",
      "explanation": "The explanation identifies what changed and how it supports understanding."
    }
  ],
  "parent_notes": "Parent: Teaches connected oral retelling, cue notes, purposeful delivery, rehearsal and accurate evidence descriptions. These lessons follow the repository’s Year 4 narrative sequence. Exact outcome codes are empty pending verified mapping; this is not a claim of full syllabus coverage. All texts are original.\n\nParent: Assess actual oral clarity only if heard or recorded. Typed plans show preparation, not observed speaking. Accept the child’s usual communication supports and label the evidence produced. The lesson supplies teaching, models and feedback. Support access and review the evidence; do not teach the steps for the child.\n\nParent: Eight multiple-choice answers are scored. The unchanged 90% threshold requires 8/8. Two written responses are reviewed manually. Model for question 9: Eli made a cardboard stand and placed a book across its base so the sign stayed visible. Model for question 10: I slowed the stand-and-book explanation so a listener could follow how the sign stayed up.\n\nParent: The complete model preserves the second failure, response and outcome. No partner, accent, acting style, upload or recording is required. A listener can give optional feedback, but the solo route supplies self-checks. Do not claim actual listening to another person from solo practice.",
  "evidence_instructions": "Keep four cues, delivery plan, retelling wording or summary, rehearsal explanation, evidence-type label, reflection and written quiz responses.",
  "offline_alternative": "Use the optional cue sheet or copy the story on paper. Prepare notes and practise two tellings away from the screen, then type a summary and complete the quiz later.",
  "extension": "Retell the same events with a different opening, then explain what background a listener needs to follow the new order.",
  "stage_hints": {
    "accept": [
      "Read the goal about cues and a clearer second telling.",
      "The whole Windy Sign story is included; you can rehearse independently.",
      "Begin by following Eli’s goal and response, then turn the events into short cue notes."
    ],
    "teach0": [
      "Reread the goal and the failed first arrangement.",
      "Choose actions that explain why the character changes plans.",
      "Make a person-and-goal note, then problem, response and outcome notes."
    ],
    "teach1": [
      "Look back at a cue becoming a complete idea.",
      "Choose a few words naming the event and its important action.",
      "Glance at one note, explain that event, then move to the next note."
    ],
    "teach2": [
      "Look at the pause and steady-pace example.",
      "Choose one important event and keep its related words together.",
      "Try that event twice, changing one delivery choice to help the meaning."
    ],
    "teach3": [
      "Look back at the separate accuracy and delivery checks.",
      "Name one skipped event, unclear reference or rushed explanation.",
      "Try a repair, then explain what changed and why; label the evidence you actually made."
    ],
    "learn": [
      "Read the original story before the model telling.",
      "Match the four cues to the corresponding events.",
      "Check whether the model preserves the reason for the changed plan, not just the objects."
    ],
    "guided": [
      "Begin by introducing the person and game goal.",
      "Prepare the problem and response cues on separate lines.",
      "Use “The first plan did not work because ____.” Then explain what the character tries next."
    ],
    "write": [
      "Prepare the four cue notes before rehearsing.",
      "Begin “Eli was preparing ____ and needed ____.”",
      "A partial opening is “In the courtyard, Eli wanted ____.” Complete the goal from the story, then continue in your own words."
    ],
    "quiz": [
      "Return to event selection, cues, delivery or evidence as needed.",
      "Check whether a choice concerns accurate content or how it is communicated.",
      "For a written explanation, name the actual action or improvement and give its purpose."
    ],
    "submit": [
      "Check the four cues and your rehearsal explanation.",
      "Include the delivery plan and label solo, observed, recorded or written practice accurately.",
      "Send the storytelling record and reflection; keep a paper cue sheet for later review if you used one."
    ]
  }
}'), updated_at=datetime('now') WHERE seed_key='s2-eng-y4-w01-l4';
