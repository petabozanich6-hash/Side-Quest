-- Approved Lesson Standard v2. Year 3 English Week 1 Lessons 2–4.
-- One UPDATE per lesson; preserve row IDs and assignments.
-- Lesson 1 remains the approved gold in 0044; 0045 is Stage 3.

UPDATE lessons
SET title = 'Year 3: Build a clear sentence',
    data = json_patch(data, '{
  "seed_key": "s2-eng-y3-w01-l2",
  "title": "Year 3: Build a clear sentence",
  "stage": "S2",
  "learning_area": "English",
  "year_level": "Year 3",
  "week": 1,
  "lesson_number": 2,
  "duration_minutes": 60,
  "child_mission": "Become a Sentence Builder! Turn an idea into clear words, then check that your reader knows what you mean.",
  "learning_intention": "We are learning to write clear statements with a complete idea, a capital letter and suitable ending punctuation.",
  "success_criteria": [
    "I can say a complete idea before writing it.",
    "I can show who or what my statement is about.",
    "I can start with a capital and finish with a full stop.",
    "I can add a useful detail and reread my sentence."
  ],
  "materials": [
    "Everything you need to read is included in this lesson",
    "Optional: paper and a pencil"
  ],
  "outcome_codes": [
    "EN2-CWT-01"
  ],
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
      "title": "Say one complete idea",
      "explain": "**What does a sentence do?**\nA sentence helps a reader follow an idea. In this lesson we practise statements: sentences that give information. Say your idea aloud before writing. This helps you notice whether a piece is missing.\n\n**Give the reader enough information.**\nFor these statements, tell who or what you mean and what happens or what it is like. “The bag is wet” describes the bag. “Ava carried the bag” tells an action. Both give a complete idea.\n\n**Compare a piece with a thought.**\n“The wet bag” names something, but leaves the reader asking what about it. “The wet bag dripped” finishes the thought. A fragment is an unfinished piece of a sentence.\n\nDo not worry about writing a long sentence. First make one short idea clear. Other kinds of sentences can work differently; today we are building these information statements.",
      "example": "I DO:\nIdea piece: The red kite.\nI ask, “What about the kite?” I add what happened: “The red kite fell.” Now the reader can follow the event.\n\nAnother complete idea: “The kite is torn.” This describes it instead of telling an action.\n\nYOU TRY:\n“Ben opened...” What is missing? Say a possible ending before reading on.\n\nCHECK:\n“Ben opened the gate” tells us what he opened. “Ben opened” leaves this particular intended action unfinished. Choose an ending that makes sense, rather than adding an unrelated word.",
      "notice": "Say the whole idea once. If it leaves an important question unanswered, add the missing information before checking the letters.",
      "check": {
        "question": "Which statement gives a complete idea?",
        "options": [
          "The blue bag",
          "Ava carried the bag",
          "Beside the bag",
          "The very wet"
        ],
        "correct_index": 1,
        "explanation": "Ava carried the bag tells who acted and what she carried. The other choices are pieces that do not give a complete statement."
      }
    },
    {
      "icon": "📖",
      "title": "Show who or what, then what happens",
      "explain": "**Find the two useful parts.**\nIn “Ben held the string”, Ben tells us who. Held the string tells us what he did. You can use those two questions to build an action statement.\n\n**A statement can describe too.**\n“The string is long” tells what the statement is about and what it is like. Not every sentence describes a movement. Words such as is can connect something with its description.\n\n**Keep your words together.**\nChoose words that make sense as one idea. “The string carried Ben” has the same words as another sentence, but changes who does what. Read for meaning, not just whether you used a set of words.\n\n**Try a simple frame.**\n“Who or what? ____.” “What happens or what is it like? ____.” Join your answers and say the whole statement. Use the frame as help, not as extra words to copy into every sentence.",
      "example": "I DO:\nWho? Ava.\nWhat happened? Picked up the kite.\nStatement: “Ava picked up the kite.”\n\nWhat? The kite.\nWhat is it like? Torn.\nStatement: “The kite is torn.” I need is to make this description read as a complete statement.\n\nYOU TRY:\nUse Ben and held the gate to build one statement. Then describe the gate as open.\n\nCHECK:\n“Ben held the gate.” “The gate is open.” These are different ideas: one tells an action and the other describes something.",
      "notice": "Do not choose words only because they fit in a box. Say the finished idea and check who is doing the action.",
      "check": {
        "question": "In “Ben held the string”, which words tell what Ben did?",
        "options": [
          "Ben",
          "The name Ben",
          "Held the string",
          "String only"
        ],
        "correct_index": 2,
        "explanation": "Held the string tells the action and its object. Ben identifies who; string alone names a thing without the action."
      },
      "visual": [
        {
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 224\"><rect width=\"420\" height=\"224\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Ava | picked up the kite.</text><text x=\"16\" y=\"80\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Who? | What happened?</text><text x=\"16\" y=\"126\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">The kite | is torn.</text><text x=\"16\" y=\"172\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">What? | What is it like?</text></svg>",
          "alt": "Two statement patterns: Ava picked up the kite tells who and what happened; the kite is torn tells what and what it is like.",
          "caption": "Use the questions to check meaning."
        }
      ]
    },
    {
      "icon": "📖",
      "title": "Mark the beginning and ending",
      "explain": "**Help the reader see the sentence.**\nStart a sentence with a capital letter. Finish these information statements with a full stop. A full stop marks where the idea ends, not where you happen to reach the edge of the page.\n\n**Names also have capitals.**\nIn “Ben helped Ava”, both names begin with capitals even when a name is not the first word. Ordinary words in the middle do not need capitals simply because they matter.\n\n**Choose an ending for the job.**\nA question mark ends a question, such as “Where is the kite?” An exclamation mark can show strong feeling. For our ordinary statements, use a full stop.\n\n**Check meaning as well as marks.**\nAdding a capital and full stop to “The blue bag” does not supply its missing idea. Make the thought complete first, then mark its beginning and ending.",
      "example": "I DO:\nDraft: ava held the gate\nI change ava to Ava and add a full stop: “Ava held the gate.”\n\nCOMPARE:\n“The blue bag.” has marks but still does not tell us what about the bag in this task.\n“The blue bag dripped.” has both a complete thought and the marks.\n\nYOU TRY:\nFix “ben helped ava” as an information statement.\n\nCHECK:\n“Ben helped Ava.” Both names have capitals and the complete statement ends with a full stop. No capital is needed on helped.",
      "notice": "Do not use punctuation to hide a missing thought. A sentence check needs both clear meaning and correct marks.",
      "check": {
        "question": "Which version has suitable capitals and a full stop?",
        "options": [
          "ben helped Ava.",
          "Ben helped ava",
          "Ben Helped Ava",
          "Ben helped Ava."
        ],
        "correct_index": 3,
        "explanation": "Ben and Ava are names with capitals, helped stays lower case and the statement ends with a full stop."
      },
      "visual_before": [
        {
          "episode": {
            "title": "A thought needs more than marks",
            "transcript": "Pip: I wrote: the red kite. I added a capital and a full stop. Is the idea finished?\nJuno: Ask what about the kite. Add what happens or what it is like.\nPip: Now I can say: The red kite is torn. The reader gets a whole idea.\nJuno: Pause and try. Finish an idea first, then check its beginning and ending.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "I wrote: the red kite. I added a capital and a full stop. Is the idea finished?"
                  },
                  {
                    "who": "juno",
                    "text": "Ask what about the kite. Add what happens or what it is like."
                  },
                  {
                    "who": "pip",
                    "text": "Now I can say: The red kite is torn. The reader gets a whole idea."
                  },
                  {
                    "who": "juno",
                    "text": "Pause and try. Finish an idea first, then check its beginning and ending.",
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
      "title": "Add one helpful detail and reread",
      "explain": "**A useful detail answers a question.**\nOnce your statement is clear, you can add where, when or how. “Ava carried the kite” becomes “Ava carried the kite to the bench.” The added words tell where she carried it.\n\n**Keep one idea easy to follow.**\nYou do not have to squeeze every event into one sentence. “Ava carried the kite Ben shut the gate” joins two complete statements without showing their boundary. For now, split them into two sentences.\n\n**Reread your own writing.**\nRead aloud or quietly. Ask: Does it make sense? Are words missing? Did I start with a capital? Did I finish the statement? Change one problem, then read again.\n\n**Choose detail, not just length.**\nA longer sentence is useful when the added words help a reader picture or understand the idea. Leave out unrelated information.",
      "example": "I DO:\nFirst statement: “Ben held the gate.”\nUseful detail: “Ben held the gate for Ava.” This explains who benefited.\n\nCOMMON MISTAKE:\n“Ben held the gate Ava carried the kite.” I can hear two thoughts. I fix the boundary: “Ben held the gate. Ava carried the kite.”\n\nYOU TRY:\nAdd a where detail to “Ava put the kite down.” Then read your sentence once to check it.\n\nCHECK:\nOne possible sentence is “Ava put the kite down on the bench.” Other sensible places are fine. Keep the original action and make the added detail useful.",
      "notice": "If you can hear two separate ideas, try a full stop between them. Add one useful detail at a time.",
      "check": {
        "question": "Which detail tells where in “Ava placed the kite on the bench”?",
        "options": [
          "On the bench",
          "Ava",
          "Placed",
          "The name Ava"
        ],
        "correct_index": 0,
        "explanation": "On the bench tells the place where Ava put the kite. The other words identify the person or action."
      }
    }
  ],
  "worked_example": "I DO: Build and check three statements.\n1. Idea: Ava and a kite. I decide what happened: “Ava carried the kite.”\n2. Add a useful where detail: “Ava carried the kite to the bench.”\n3. A second idea: “Ben held the gate for her.”\n4. A description: “The kite was wet.”\n\nMY FINISHED MINI-PASSAGE\nAva carried the kite to the bench. Ben held the gate for her. The kite was wet.\n\nWHY IT WORKS\nEach statement gives a complete idea. Names begin with capitals. Each sentence has an end mark. To the bench helps the reader picture the place. For her is clear here because Ava has already been named.\n\nCOMMON MISTAKE AND FIX\n“The wet kite.” is a piece. I make it a statement: “The kite was wet.” A capital and full stop alone cannot add the missing information.\n\nREREAD\nI check the words, marks and meaning before calling the passage finished.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 224\"><rect width=\"420\" height=\"224\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Idea → say it → write it</text><text x=\"16\" y=\"80\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Check: clear thought</text><text x=\"16\" y=\"126\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Check: capital + end mark</text><text x=\"16\" y=\"172\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Reread: useful detail</text></svg>",
      "alt": "A writing method: say an idea, write it, check the complete thought and sentence marks, then reread the detail.",
      "caption": "Check meaning before decorating the sentence."
    }
  ],
  "guided_practice": "WE DO: Build two statements about a paper boat.\n1. Who or what? Mila. What happened? Made a paper boat. Say the joined idea before comparing: “Mila made a paper boat.”\n2. Add a where detail from your own idea. One possibility: “Mila made a paper boat at the table.”\n3. Describe the boat as small. Try before comparing: “The boat is small.” The word is connects the boat with its description.\n4. Fix “mila put the boat down” as a statement. Compare: “Mila put the boat down.” Check the name and full stop.\n5. Reread both of your own sentences. If words are missing, fix the idea before adding more detail.\nYou can practise orally first. Your sensible details do not need to match the suggestions.",
  "independent_task": "YOU DO: Write a clear mini-passage (about 20 minutes).\nChoose a fictional kite, paper boat or garden task.\n1. Say a statement about someone doing something. Write it in the big box or on paper.\n2. Write a second statement that describes an object or gives another clear action.\n3. Add one useful where, when or how detail to one statement.\n4. Write a third statement to finish the small event.\n5. Read all three. Check complete ideas, names and sentence capitals, full stops, and word order. Improve one sentence.\n6. Submit the three sentences and explain your improvement. If you used paper, type the passage or a short summary plus the sentence you improved. No photo is required.\nUse “My first sentence said ____. I changed it to ____ because ____.” to explain your edit.",
  "response_prompt": "Which check helped you improve a sentence, and how?",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "What should these information statements give a reader?",
      "options": [
        "A list of unrelated words",
        "A complete idea",
        "Only a capital letter",
        "Only an end mark"
      ],
      "correct_index": 1,
      "explanation": "A statement should communicate a complete idea; marks help readers follow it but do not supply missing meaning."
    },
    {
      "type": "multiple_choice",
      "question": "Which statement describes something clearly?",
      "options": [
        "The very wet",
        "Beside the kite",
        "The kite is wet",
        "Wet the"
      ],
      "correct_index": 2,
      "explanation": "The kite is wet names the thing and tells what it is like. The other choices are unfinished pieces in this task."
    },
    {
      "type": "multiple_choice",
      "question": "In “Mila made a boat”, who did the action?",
      "options": [
        "Mila",
        "Made a boat",
        "Boat only",
        "A full stop"
      ],
      "correct_index": 0,
      "explanation": "Mila identifies who made the boat. Made a boat tells her action."
    },
    {
      "type": "multiple_choice",
      "question": "Which version correctly marks this statement?",
      "options": [
        "mila made a boat.",
        "Mila Made a boat",
        "Mila made a boat",
        "Mila made a boat."
      ],
      "correct_index": 3,
      "explanation": "The sentence starts with a capital on the name, has sensible lower-case words and ends with a full stop."
    },
    {
      "type": "multiple_choice",
      "question": "Which mark ends an ordinary information statement in this lesson?",
      "options": [
        "A question mark every time",
        "A full stop",
        "A comma only",
        "No mark"
      ],
      "correct_index": 1,
      "explanation": "A full stop marks the end of the ordinary statements we are practising."
    },
    {
      "type": "multiple_choice",
      "question": "Why does “The blue bag.” still need work as a statement here?",
      "options": [
        "It is too short to exist",
        "Blue cannot describe a bag",
        "It does not tell what about the bag",
        "Every sentence needs ten words"
      ],
      "correct_index": 2,
      "explanation": "It names the bag but leaves the intended thought unfinished. Length alone is not the problem."
    },
    {
      "type": "multiple_choice",
      "question": "Which added words tell where in “Ben waited beside the bench”?",
      "options": [
        "Beside the bench",
        "Ben",
        "Waited",
        "The letter B"
      ],
      "correct_index": 0,
      "explanation": "Beside the bench gives the place. Ben names who and waited gives the action."
    },
    {
      "type": "multiple_choice",
      "question": "What is a clear repair for “Ava carried the kite Ben opened the gate”?",
      "options": [
        "Delete both names",
        "Add an unrelated colour",
        "Put a capital on every word",
        "Use a full stop between the two complete thoughts"
      ],
      "correct_index": 3,
      "explanation": "A sentence boundary separates the two complete statements so the reader can follow each idea."
    },
    {
      "type": "short_answer",
      "question": "Finish “The paper boat...” as a complete information statement.",
      "sample_answer": "The paper boat floated in the puddle.",
      "marking_guide": "Accept a sensible complete statement describing the boat or an action, with suitable marks.",
      "explanation": "A useful completion tells what happened or what the boat is like."
    },
    {
      "type": "short_answer",
      "question": "Explain one check you used to improve your writing.",
      "sample_answer": "I read my sentence aloud and noticed a missing action. I added floated so the idea was complete.",
      "marking_guide": "Accept a specific meaning, word-order or punctuation check with its helpful change.",
      "explanation": "An explanation names the check and how it improves the sentence."
    }
  ],
  "parent_notes": "Parent: Teaches complete information statements, action/description patterns, sentence marks and useful detail. This is one contribution to the listed Stage 2 outcomes, not complete coverage. Codes were checked against the NESA English K–10 (2022) outcomes page. All practice text is original.\n\nParent: Look for complete ideas and one explained improvement. Do not demand a particular length or treat all short utterances as incomplete; the lesson limits its pattern to the statements being practised. Let the child attempt the small practice before comparing its feedback. The lesson supplies the teaching; your role is reviewing evidence and helping with access if required.\n\nParent: The quiz has eight automatically scored choices and two written answers. The unchanged 90% threshold requires 8/8 choices. Written answers accompany the submission for manual review. Model for question 9: The paper boat floated in the puddle. Model for question 10: I read my sentence aloud and noticed a missing action. I added floated so the idea was complete.\n\nParent: Model task: Mila made a paper boat at the table. The boat was small. She placed it in a puddle. Other coherent original mini-passages are fine. Focus on the taught sentence checks, not a whole narrative assessment.",
  "evidence_instructions": "Keep the three statements, one before-and-after edit, reflection and written quiz answers. Review meaning and marks separately.",
  "offline_alternative": "Say and write three statements on paper, add one useful detail and check them with the method. Later type the passage or summary and complete the quiz.",
  "extension": "Describe the same small event in two different clear statements. Explain how the detail changes what the reader notices.",
  "stage_hints": {
    "accept": [
      "Read the mission and notice that you will begin by saying an idea.",
      "Choose a simple person and object you can picture; the lesson will help you connect them.",
      "Start with the first teaching step. You can practise orally before using the text box."
    ],
    "teach0": [
      "Look back at a named thing and a complete thought.",
      "Ask what about the person or object needs to be told.",
      "Say the whole idea. Add an action or description if an important part is missing."
    ],
    "teach1": [
      "Look back at who or what and the second part of the statement.",
      "Separate the person from what happens before joining the words.",
      "Use the two questions to test your idea, then reread the word order."
    ],
    "teach2": [
      "Look back at meaning checks and sentence-mark checks.",
      "Find the name or first word, then locate the end of the complete idea.",
      "Check the beginning and ending separately, keeping ordinary middle words lower case when appropriate."
    ],
    "teach3": [
      "Look back at the useful-detail questions.",
      "Ask whether the new words tell a place, time or manner.",
      "Read the original action and added words together. Keep the detail only if it helps the reader."
    ],
    "learn": [
      "Read the finished mini-passage and then the steps that built it.",
      "Check one complete thought before moving to the next sentence.",
      "Point to a useful detail and explain what it adds to the idea."
    ],
    "guided": [
      "Try the first person-and-action statement before comparing its suggestion.",
      "Say the idea aloud, then add one sensible place detail.",
      "Use “Mila ____” as a beginning and finish the action in your own words."
    ],
    "write": [
      "Choose one small fictional event and say its first idea.",
      "Begin “My character ____.” Add the action before writing the next statement.",
      "A partial opening shape is “At the table, ____ made ____.” Fill the gaps with your own idea and check it."
    ],
    "quiz": [
      "Return to the step about complete ideas, word order, marks or detail.",
      "Ask what each option tells the reader and whether an important part is missing.",
      "For a written completion, give a whole idea; for an explanation, name your check and what you changed."
    ],
    "submit": [
      "Check that your three statements and reflection are ready.",
      "Include the sentence you improved and both written answers.",
      "If you wrote on paper, type a concise summary and the improved sentence. Keep the paper for review."
    ]
  }
}'),
    updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
WHERE seed_key = 's2-eng-y3-w01-l2';

UPDATE lessons
SET title = 'Year 3: Spell with sounds and syllables',
    data = json_patch(data, '{
  "seed_key": "s2-eng-y3-w01-l3",
  "title": "Year 3: Spell with sounds and syllables",
  "stage": "S2",
  "learning_area": "English",
  "year_level": "Year 3",
  "week": 1,
  "lesson_number": 3,
  "duration_minutes": 60,
  "child_mission": "Become a Word Investigator! Listen to words, notice their letter patterns and use a checking routine to improve your spelling.",
  "learning_intention": "We are learning to combine sounds, syllables and remembered letter patterns when spelling taught words.",
  "success_criteria": [
    "I can listen for sounds without assuming one letter per sound.",
    "I can split a spoken word into syllable beats.",
    "I can use the model to check a tricky letter pattern.",
    "I can find a difference and practise the corrected word."
  ],
  "materials": [
    "Everything you need to read is included in this lesson",
    "Optional: paper and a pencil"
  ],
  "outcome_codes": [
    "EN2-SPELL-01"
  ],
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
    "focus": "Sounds, syllables and patterns",
    "teaching": "Use the models below for your practice. Say each word normally, listen to its parts, then tap its syllables. Study the listed written detail before covering and writing. Compare each attempt with the model. The hyphens in parts show practice chunks; write the actual word without them.",
    "words": [
      {
        "word": "ship",
        "parts": "sh / i / p; one syllable",
        "tip": "Sh is a two-letter group for one starting sound."
      },
      {
        "word": "sunset",
        "parts": "sun-set; two syllables",
        "tip": "Join sun and set in this order."
      },
      {
        "word": "rabbit",
        "parts": "rab-bit; two syllables",
        "tip": "Remember two b letters in the middle."
      },
      {
        "word": "fantastic",
        "parts": "fan-tas-tic; three syllables",
        "tip": "Keep the t in the middle part tas."
      },
      {
        "word": "window",
        "parts": "win-dow; two syllables",
        "tip": "Check the written ow ending against the model."
      }
    ],
    "check": [
      {
        "question": "Which reminder matches the taught word ship?",
        "options": [
          "It starts with two separate words",
          "It needs three b letters",
          "Its first sound is written sh",
          "Every letter is a syllable"
        ],
        "correct_index": 2,
        "explanation": "The starting sh sound is written with the two-letter group sh in ship. The other reminders do not fit the taught word."
      }
    ]
  },
  "spelling_focus": null,
  "hoard_words": [
    "ship",
    "sunset",
    "rabbit",
    "fantastic",
    "window"
  ],
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
      "title": "Listen for sound parts",
      "explain": "**Sounds and letters are different.**\nWhen you say a word, you hear sounds. When you write it, you choose letters to represent them. A word does not always have one letter for each sound.\n\n**Say, stretch and listen.**\nSay ship normally. Now say its parts slowly: sh, i, p. Sh is one sound written with two letters. The word has four letters, but these three sound parts.\n\nA digraph is two letters representing one sound. In this example, sh is the digraph. Keep it together when matching the heard sound to letters.\n\n**Do not add sounds accidentally.**\nSome sounds can stretch; others are brief. Keep the final p short rather than adding an extra uh. Then join the parts and say ship normally again.\n\nListening helps you start a spelling. You also need letter-pattern knowledge, because a sound can sometimes be written in different ways. Use the model when you are unsure.",
      "example": "I DO:\nWord: ship.\nI hear sh / i / p. I choose sh, i and p, then join them: ship.\n\nCOMPARE:\nSaying s and h separately does not match the starting sound in ship. The letters work as one group here.\n\nYOU TRY:\nSay shop slowly. What letter group represents its first sound? Try before reading on.\n\nCHECK:\nShop begins with sh too. Its middle sound differs from ship, so check the whole word rather than copying the last example automatically.",
      "notice": "Listening does not reveal every spelling by itself. Use sounds as clues and check the written pattern.",
      "check": {
        "question": "In ship, which letters work together for one starting sound?",
        "options": [
          "s and p",
          "h and i",
          "s and h",
          "i and p"
        ],
        "correct_index": 2,
        "explanation": "S and h together represent the starting sh sound in ship. The other groups do not represent that first sound."
      }
    },
    {
      "icon": "📖",
      "title": "Listen for syllable beats",
      "explain": "**A syllable is a spoken beat.**\nSyllables help you handle a longer word in smaller parts. Say sunset naturally, then clap its two beats: sun-set. You are counting spoken beats, not letters.\n\n**Hear before you split.**\nSay the whole word first. Tap once for each beat as you repeat it. Keep the sounds inside each beat together. Fantastic has three beats: fan-tas-tic.\n\n**Use beats for a spelling plan.**\nWrite one part, then the next, then read the joined word. The split is a practice aid; do not leave hyphens in an ordinary spelling answer unless the actual word requires them.\n\n**Beats do not settle every letter.**\nRabbit has two beats. The spoken beats help you organise the word, but the model also tells you that its written spelling has two b letters. Listening and checking work together.",
      "example": "I DO:\nSunset: I say sun-set, tap twice and write sun + set. I join the parts as sunset.\nFantastic: I say fan-tas-tic and tap three times. I keep each part in order.\n\nCOMMON MISTAKE:\nCounting every letter gives a different number from counting beats. Sunset has six letters and two syllables.\n\nYOU TRY:\nSay window naturally, then tap its beats. Check before reading on.\n\nCHECK:\nWin-dow has two beats. The split helps you remember the order of the written parts; it is not six separate spoken beats.",
      "notice": "Count what you hear when speaking naturally. A row of letters is not a row of syllable beats.",
      "check": {
        "question": "How many spoken syllable beats are in fan-tas-tic?",
        "options": [
          "One",
          "Three",
          "Six",
          "Nine"
        ],
        "correct_index": 1,
        "explanation": "Fan, tas and tic are three spoken beats. Counting letters would answer a different question."
      },
      "visual": [
        {
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 178\"><rect width=\"420\" height=\"178\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">sun-set: 2 spoken beats</text><text x=\"16\" y=\"80\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">fan-tas-tic: 3 spoken beats</text><text x=\"16\" y=\"126\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Beats are not letter counts.</text></svg>",
          "alt": "Sunset has two spoken syllable beats; fantastic has three. Syllables are not counted by letters.",
          "caption": "Speak the whole word before tapping its beats."
        }
      ]
    },
    {
      "icon": "📖",
      "title": "Notice the written pattern",
      "explain": "**Some spellings need a closer look.**\nAfter listening and splitting, compare your idea with the correct model. Find the part you might miss, rather than staring at the whole word without a plan.\n\n**Use this word''s evidence.**\nRabbit is written rab-bit: two b letters meet in the middle. Write both. Do not assume that every two-syllable word needs a double letter. Window has two syllables without that doubled b pattern.\n\nShip begins with sh, a two-letter group for one sound. Sunset joins the written parts sun and set. Fantastic keeps fan, tas and tic in order.\n\n**Say a useful reminder.**\n“Rabbit needs two b letters.” “Ship starts with sh.” A reminder should name the particular tricky part.\n\n**Check rather than guess.**\nIf you are uncertain, look at the model again. Learning a spelling includes noticing and remembering its written pattern, not only sounding it out.",
      "example": "I DO:\nMy attempt: rabit.\nModel: rabbit.\nI compare from the beginning. R and a match. At the middle I notice the model has two b letters. I say, “Rabbit needs two b letters,” and rewrite it.\n\nYOU TRY:\nCompare sip with the model ship. Which written part changes? Think first.\n\nCHECK:\nShip includes h after s to make sh. Sip is another real word, but it does not spell the intended word ship. A spelling check needs to keep the intended meaning too.",
      "notice": "A word can look familiar and still be the wrong word. Compare your spelling with the intended word, including its tricky part.",
      "check": {
        "question": "What needs fixing when rabit is compared with rabbit?",
        "options": [
          "The model needs three r letters",
          "The final t should disappear",
          "The a should become a whole sentence",
          "The attempt needs another b in the middle"
        ],
        "correct_index": 3,
        "explanation": "Rabbit is written with two b letters. Rabit has only one, so adding the missing b repairs the taught spelling."
      }
    },
    {
      "icon": "📖",
      "title": "Use look, cover, write and check",
      "explain": "**Practise with a method.**\nLook closely at a model and say the word. Identify its sounds, syllable parts and one written detail you want to remember.\n\nCover the model with your hand or look away. Write the word from memory. Then uncover and compare from the beginning. Check letter order as well as whether all the letters are present.\n\n**Learn from a difference.**\nIf your attempt differs, mark the first place that needs attention. Look at the correct part, say a reminder and rewrite the whole word correctly. Cover and try again.\n\n**Use the word in meaning.**\nOnce you have checked the spelling, use it in a short sentence. Reread to make sure it is the word you meant.\n\n**Practice is not a race.**\nCopying the same mistake many times will not fix it. A careful comparison and corrected attempt are more useful than rushing a long list.",
      "example": "I DO:\nModel: fantastic.\nI say fan-tas-tic and notice the order of the three parts. I cover it and write fantasic.\nChecking shows I missed the t in tas. I look at that part, say the reminder and rewrite fantastic. Then I cover and try again.\n\nYOU TRY:\nUse the routine with sunset. Check the letters before writing a sentence with it.\n\nCHECK:\nYou need the joined spelling sunset, with sun before set. A possible sentence is “We watched the sunset.” Your original sentence can be different if sunset fits its meaning.",
      "notice": "Keep the corrected version visible for your comparison, then cover it for the next memory try. Do not practise an unchecked mistake.",
      "check": {
        "question": "After a spelling attempt differs from the model, what should you do?",
        "options": [
          "Notice the difference, study it and try the corrected word",
          "Repeat the unchecked attempt ten times",
          "Remove random letters",
          "Ignore the intended word"
        ],
        "correct_index": 0,
        "explanation": "Finding and studying the difference lets you practise the correct pattern. Repeating an unchecked mistake does not repair it."
      },
      "visual_before": [
        {
          "episode": {
            "title": "A spelling mistake can teach you",
            "transcript": "Pip: I wrote a word from memory, but it does not match the model. Should I keep copying my attempt?\nJuno: Find the first difference. Look at that part and practise the corrected whole word.\nPip: I can use a sound clue, a syllable part and a reminder about the letters.\nJuno: Pause and try. Check one taught word carefully before your next memory attempt.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "I wrote a word from memory, but it does not match the model. Should I keep copying my attempt?"
                  },
                  {
                    "who": "juno",
                    "text": "Find the first difference. Look at that part and practise the corrected whole word."
                  },
                  {
                    "who": "pip",
                    "text": "I can use a sound clue, a syllable part and a reminder about the letters."
                  },
                  {
                    "who": "juno",
                    "text": "Pause and try. Check one taught word carefully before your next memory attempt.",
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
  "worked_example": "I DO: Spell rabbit with a complete routine.\nListen: I say rabbit normally and hear its parts.\nBeats: I tap rab-bit, two spoken beats.\nPattern: I look at the model rabbit and notice two b letters.\nCover: I hide the model and write rabit.\nCheck: Comparing from the beginning shows one b is missing.\nRepair: I say “two b letters in rabbit”, write rabbit and try from memory again.\nUse: “The rabbit rested beside the box.” I check the spelling in the sentence too.\n\nWHY THE METHOD WORKS\nSounds and beats give me a starting plan. The written model supplies the exact letter pattern. My correction focuses on a particular difference.\n\nCOMMON MISTAKE AND FIX\nCounting the letters in rabbit does not count its syllables. I speak the word to count beats and use the model to check letters. These are different jobs.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 178\"><rect width=\"420\" height=\"178\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Listen → split → notice</text><text x=\"16\" y=\"80\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Look → cover → write → check</text><text x=\"16\" y=\"126\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Find a difference and repair.</text></svg>",
      "alt": "A spelling routine listens, splits and notices, then looks, covers, writes and checks before repairing a difference.",
      "caption": "Check a taught model rather than guessing the missing part."
    }
  ],
  "guided_practice": "WE DO: Compare two attempts.\n1. Intended word: ship. Attempt: sip. Say both if you can. Find the difference before reading the suggestion: ship needs h after s for its sh group.\n2. Intended word: fantastic. Attempt: fantasic. Say fan-tas-tic and compare the parts. Suggestion: the middle tas needs t.\n3. Try rabbit with look, cover, write and check. Give yourself the reminder about its middle letters before covering.\n4. Write one original sentence with a corrected word. Reread so both the spelling and meaning fit.\nIf you make a different mistake, compare your own attempt rather than copying these errors. The goal is to identify and repair the actual difference.",
  "independent_task": "YOU DO: Word Investigator record (about 20 minutes).\nUse the five taught words: ship, sunset, rabbit, fantastic and window.\n1. Say each word naturally. Tap its syllables and write the count beside the word.\n2. Choose three words and write a reminder for each: a sound group, chunk order or tricky written part.\n3. Use look, cover, write and check with all five words. Keep your first attempt and corrected version if they differ. If an attempt matches, record that it matched.\n4. Write two original sentences using two of the checked words.\n5. In the big box, record your syllable counts, three reminders, one check result and your sentences. You can work on paper first and type a summary. A photo is optional.\nDo not invent a mistake if you spelled every word correctly. Explain which reminder helped instead.",
  "response_prompt": "Which spelling clue or check helped you most, and why?",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "Why can letters and sound parts have different counts?",
      "options": [
        "A letter always makes two sounds",
        "Two letters can represent one sound",
        "Sounds cannot be heard",
        "Words have no written forms"
      ],
      "correct_index": 1,
      "explanation": "A group such as sh can represent one sound, so a sound count need not match the letter count."
    },
    {
      "type": "multiple_choice",
      "question": "Which starting group is in ship?",
      "options": [
        "ow",
        "bb",
        "sh",
        "tas"
      ],
      "correct_index": 2,
      "explanation": "Sh is the taught two-letter group representing the starting sound in ship."
    },
    {
      "type": "multiple_choice",
      "question": "How many spoken syllable beats are in sun-set?",
      "options": [
        "Two",
        "Six",
        "One for each letter",
        "Seven"
      ],
      "correct_index": 0,
      "explanation": "Sun and set form two spoken beats, regardless of the number of written letters."
    },
    {
      "type": "multiple_choice",
      "question": "How many spoken beats are in fan-tas-tic?",
      "options": [
        "One",
        "Four",
        "Nine",
        "Three"
      ],
      "correct_index": 3,
      "explanation": "Fan, tas and tic make three spoken syllable beats."
    },
    {
      "type": "multiple_choice",
      "question": "Which spelling matches the taught model?",
      "options": [
        "rabit",
        "rabbit",
        "rabbbit",
        "rabitt"
      ],
      "correct_index": 1,
      "explanation": "The model rabbit has two b letters and one final t. The alternatives change that taught pattern."
    },
    {
      "type": "multiple_choice",
      "question": "What do the hyphens in fan-tas-tic show here?",
      "options": [
        "Punctuation to copy into every word",
        "Separate sentences",
        "Practice syllable parts",
        "Three unrelated words"
      ],
      "correct_index": 2,
      "explanation": "The hyphens mark practice chunks. The actual taught spelling is fantastic without those practice hyphens."
    },
    {
      "type": "multiple_choice",
      "question": "What should a check compare?",
      "options": [
        "Your attempt with the correct intended word",
        "Only whether the page has colours",
        "Only how fast you wrote",
        "Two unchecked guesses"
      ],
      "correct_index": 0,
      "explanation": "Comparing with the correct intended word reveals differences in letters and order."
    },
    {
      "type": "multiple_choice",
      "question": "What is useful after finding a missing letter?",
      "options": [
        "Ignore the difference",
        "Copy the mistake repeatedly",
        "Change the meaning at random",
        "Study the correct part and practise the whole corrected word"
      ],
      "correct_index": 3,
      "explanation": "Focused study followed by a corrected attempt practises the pattern that was missing."
    },
    {
      "type": "short_answer",
      "question": "Explain one useful reminder for rabbit.",
      "sample_answer": "Rabbit has two spoken beats, rab-bit, and I must remember two b letters in its written middle.",
      "marking_guide": "Accept a correct taught beat or letter-pattern reminder. Look for a specific clue rather than only “remember it”.",
      "explanation": "A useful reminder names a taught part of the word."
    },
    {
      "type": "short_answer",
      "question": "Explain how you used a model to check one spelling attempt.",
      "sample_answer": "I compared my attempt rabit with rabbit, noticed the missing b and practised the corrected word.",
      "marking_guide": "Accept an actual comparison or a matching result with a useful explanation. A mistake is not required.",
      "explanation": "A clear explanation shows what was compared and what the learner noticed."
    }
  ],
  "parent_notes": "Parent: Teaches sound/letter distinction, syllable grouping, particular taught patterns and a spelling-check routine. This is one contribution to the listed Stage 2 outcomes, not complete coverage. Codes were checked against the NESA English K–10 (2022) outcomes page. All practice text is original.\n\nParent: Check spoken beat counts separately from written spelling. The models teach these particular words; do not generalise doubled letters to every two-syllable word. Let the child attempt the small practice before comparing its feedback. The lesson supplies the teaching; your role is reviewing evidence and helping with access if required.\n\nParent: The quiz has eight automatically scored choices and two written answers. The unchanged 90% threshold requires 8/8 choices. Written answers accompany the submission for manual review. Model for question 9: Rabbit has two spoken beats, rab-bit, and I must remember two b letters in its written middle. Model for question 10: I compared my attempt rabit with rabbit, noticed the missing b and practised the corrected word.\n\nParent: Expected counts: ship 1, sunset 2, rabbit 2, fantastic 3, window 2. Accept a matching first attempt as success; do not require an error. Review the child’s chosen reminders and sentences as well as quiz performance.",
  "evidence_instructions": "Keep beat counts, three reminders, a first/check result, corrected versions where needed, original sentences, reflection and written quiz answers.",
  "offline_alternative": "Copy the five models onto paper. Use another sheet to cover them, practise and compare. Write your reminders and sentences, then type a summary and complete the quiz later.",
  "extension": "Find one other familiar word with sh. Explain which letters make that sound, then check its full spelling using a reliable model you already have.",
  "stage_hints": {
    "accept": [
      "Read the mission and notice that listening and written checking have different jobs.",
      "Begin with the first taught word; you do not need to guess all five spellings yet.",
      "Keep a small space for a first attempt and a checked version. The models are included."
    ],
    "teach0": [
      "Look back at how a sound can use a letter group.",
      "Say the whole word, then listen to its beginning without separating every letter.",
      "Compare the heard start with the written model. Keep a two-letter sound group together where the example shows one."
    ],
    "teach1": [
      "Look back at speaking naturally before counting beats.",
      "Tap once per spoken chunk rather than once per letter.",
      "Repeat the whole word and then its chunks. Use the chunking to plan the order."
    ],
    "teach2": [
      "Look back at comparing an attempt from its beginning.",
      "Find the first place where your letters differ from the model.",
      "Name that particular difference, then practise the correct whole word. Do not invent a rule for every word."
    ],
    "teach3": [
      "Look back at what happens after uncovering the model.",
      "Compare the order and presence of letters before your next attempt.",
      "Say a reminder about the part you noticed, look away and try the correct whole word again."
    ],
    "learn": [
      "Read each job in the complete routine before copying the final word.",
      "Notice which part is heard and which part must be checked in writing.",
      "Explain one comparison result in your own words before moving to another word."
    ],
    "spelling": [
      "Look at a base model and its listed written detail.",
      "Speak the word, tap its chunks and notice the part you want to remember.",
      "Cover only after studying the model, then uncover for a letter-by-letter comparison."
    ],
    "guided": [
      "Compare the first attempt with its intended word before reading the suggestion.",
      "Check from the beginning and locate a missing or changed group.",
      "Use “My attempt ____ differs at ____.” Then write the correct whole word."
    ],
    "write": [
      "Start with the five models and one spoken beat count.",
      "Use “For this word, I notice ____.” Add a reminder you can actually use.",
      "A record can begin “I said ____ in parts. My first attempt ____.” Finish with your own check result."
    ],
    "quiz": [
      "Return to sounds, beats, written patterns or the checking routine as needed.",
      "Identify whether the question is asking about speech or letters before comparing options.",
      "For a written response, name a particular clue or comparison and explain how it helped."
    ],
    "submit": [
      "Check that your practice record and sentences are ready.",
      "Include the reflection and both written answers; a correct first attempt is allowed.",
      "If you used paper, type a short record of your counts, reminders and check result, and keep the page."
    ]
  }
}'),
    updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
WHERE seed_key = 's2-eng-y3-w01-l3';

UPDATE lessons
SET title = 'Year 3: Tell a story and prepare readable notes',
    data = json_patch(data, '{
  "seed_key": "s2-eng-y3-w01-l4",
  "title": "Year 3: Tell a story and prepare readable notes",
  "stage": "S2",
  "learning_area": "English",
  "year_level": "Year 3",
  "week": 1,
  "lesson_number": 4,
  "duration_minutes": 60,
  "child_mission": "Become a Story Teller! Practise a short story so a listener can follow it, then make a clear note card to help you remember.",
  "learning_intention": "We are learning to retell a short story in order and prepare readable handwriting cues.",
  "success_criteria": [
    "I can include a beginning, important middle events and an ending.",
    "I can use a few notes to retell rather than copy every word.",
    "I can improve a pause or pace in my second telling.",
    "I can practise a simple letter join and check my note card is readable."
  ],
  "materials": [
    "This lesson contains the story and models",
    "Paper and a pencil for handwriting practice",
    "A text box is available if handwriting is not accessible today"
  ],
  "outcome_codes": [
    "EN2-OLC-01",
    "EN2-HANDW-01"
  ],
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
      "title": "Find the beginning, middle and ending",
      "explain": "**A listener needs the important events.**\nA retelling tells a story again in your own words. Keep what happens accurate. You can shorten the wording without changing the events.\n\n**Begin with someone and a situation.**\nWho is the story about? Where are they and what are they doing? Choose details that help the listener follow what happens next.\n\n**Keep the middle connected.**\nTell the important event or problem and what someone does about it. Do not list every object while leaving out the action.\n\n**Tell how the event ends.**\nThe ending shows what happens after the important action. A listener should not be left asking whether the main event was finished.\n\nTry three short notes: beginning, middle, ending. These help with our short practice story. They are not a rule that every story must have exactly three sentences.",
      "example": "I DO:\nShort story: “Ava made a kite at the table. Its string came loose. She tied it again and put the kite beside her bag.”\nBeginning: Ava makes a kite.\nMiddle: the string comes loose, so she repairs it.\nEnding: she puts the repaired kite away.\n\nCOMPARE:\n“There is a table and a bag” names things but leaves out what happens.\n\nYOU TRY:\n“Ben made a paper boat. A fold opened. He pressed it back and placed the boat on a tray.”\nSay three event notes before checking.\n\nCHECK:\nKeep making the boat, fixing the opened fold and placing it on the tray. Your words can differ if the events stay accurate.",
      "notice": "Select events that help a listener follow the action. Do not invent a new ending to fill a gap.",
      "check": {
        "question": "What belongs in a useful retelling of Ben’s boat story?",
        "options": [
          "Only the colour of every object",
          "An invented journey to another country",
          "A list of all letters in boat",
          "The opened fold and what Ben does to fix it"
        ],
        "correct_index": 3,
        "explanation": "The opened fold and its repair explain the important middle event. Unrelated lists or invented events do not preserve the story."
      }
    },
    {
      "icon": "📖",
      "title": "Use notes to speak in your own words",
      "explain": "**A note is a reminder.**\nA short note helps you remember an event. It does not need to contain every word you will say. You turn the note into a complete spoken idea.\n\n**Introduce the person first.**\nSay who you mean before using he, she or they. A listener who has not read the story needs that information.\n\n**Link the order.**\nFirst, next, then and finally can help a listener follow the sequence. Choose the important actions rather than putting a link before every word.\n\n**Check against the story.**\nRead a section, look away and explain it. Look back to check the event. It is fine to keep names or an important word, but you do not have to memorise the whole text.\n\nYour notes should help you explain; they should not replace the explanation with a list of vague words.",
      "example": "I DO:\nNote: loose string.\nSpoken idea: “Next, Ava noticed that the kite’s string had come loose.”\nThe note reminds me; my sentence tells the listener what happened.\n\nCOMMON MISTAKE:\n“She did it, then that happened” does not name the person or event. I fix it by saying Ava and the loose string.\n\nYOU TRY:\nUse the note pressed the fold to tell Ben’s action in a complete spoken sentence.\n\nCHECK:\n“Ben pressed the opened fold back into place” explains the note. Another accurate sentence is fine. Do not add a different repair that the story never mentions.",
      "notice": "Notes can be short, but your spoken ideas still need enough information for a listener.",
      "check": {
        "question": "What is the job of a short note?",
        "options": [
          "To replace all speaking with one unclear word",
          "To remind you of an event you will explain",
          "To change the original story",
          "To list every letter on the page"
        ],
        "correct_index": 1,
        "explanation": "A note prompts an event; you explain that event in a spoken sentence. It should not change the story or remove needed information."
      }
    },
    {
      "icon": "📖",
      "title": "Practise a clear telling twice",
      "explain": "**Help the listener hear the ideas.**\nPace is how fast you speak. Volume is how loud or quiet your voice is. Speak comfortably and keep the words clear. You do not need a performance voice.\n\n**Pause between thoughts.**\nA brief pause lets a listener follow one event before the next. Do not stop between every word or rush all the events together.\n\n**Practise one part first.**\nSay the beginning and one middle event. Notice whether you lose a word, speak too quickly or miss the important action.\n\n**Make one improvement.**\nTell the story once. Choose one change, such as a slower middle event or a clearer ending. Tell it again using that change.\n\nYou can practise alone. A listener or recording can help if available, but is not required. Explain what your change helps a listener understand.",
      "example": "I DO:\nFirst try: I rush the part about the string, and the repair is unclear.\nMy change: I give that event more time and pause before the ending.\nSecond try: “The string came loose. [brief pause] Ava tied it again. [brief pause] She put the kite away.” I do not say the bracketed notes aloud.\n\nYOU TRY:\nTell Ben’s opened-fold event twice. In the second version, keep each word clear and choose one helpful pause.\n\nCHECK:\nThe pause should separate understandable thoughts, not turn each word into a separate event. You can explain your improvement without sounding exactly like someone else.",
      "notice": "Making the voice louder does not automatically fix rushed words. Start with clarity and a pace you can manage.",
      "check": {
        "question": "Your middle event was rushed. Which change is useful?",
        "options": [
          "Delete the event entirely",
          "Shout every word",
          "Give the event more time and keep the words clear",
          "Invent a different problem"
        ],
        "correct_index": 2,
        "explanation": "A steadier pace helps the listener follow the same important event. Deleting, shouting or inventing does not repair the rushed explanation."
      },
      "visual_before": [
        {
          "episode": {
            "title": "A second telling has a purpose",
            "transcript": "Pip: I remembered the story, but I rushed the part where the character fixed the problem.\nJuno: Try that event again at a steadier pace. Keep the action clear for your listener.\nPip: I can use a short note and a brief pause before the next event.\nJuno: Pause and try. Tell one event twice and explain what you improved.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "I remembered the story, but I rushed the part where the character fixed the problem."
                  },
                  {
                    "who": "juno",
                    "text": "Try that event again at a steadier pace. Keep the action clear for your listener."
                  },
                  {
                    "who": "pip",
                    "text": "I can use a short note and a brief pause before the next event."
                  },
                  {
                    "who": "juno",
                    "text": "Pause and try. Tell one event twice and explain what you improved.",
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
      "title": "Write and test a readable note card",
      "explain": "**Write notes you can use.**\nGive each event its own line. Leave enough space between words to read them at a glance. Use letter shapes and sizes you can recognise consistently.\n\n**Try one simple join.**\nOur drawing models a practice join in the lower-case word in. Start at the entry point, move into i, bring its downstroke to the writing line, then continue into the entry and arch of n. Add the i dot after the connected strokes. Follow the drawing slowly on paper.\n\nYou lift the pencil to add the dot; joining letters does not mean keeping the pencil down for the whole word. Leave a space before the next word. Do not force letters together if the join makes them unreadable.\n\n**Practise, then apply.**\nTry in three times, checking the shapes and connection. Use it in a short note such as in the garden. If you already use another taught joining style, keep that style and focus on clear letters.\n\nTest the card by looking up, glancing back and explaining one event. If a note is too cramped or vague, revise it. A typed alternative can support your telling, but shows different evidence from handwriting.",
      "example": "I DO:\nMy three event notes:\nGarden: paper boat\nOpened fold: pressed back\nEnding: boat on tray\n\nI keep each event on its own line. I practise the small in join separately, then write in the garden clearly below the notes.\n\nCOMMON MISTAKE:\nOne crowded line of tiny letters is hard to use. Fix: separate the notes and leave clear word spaces.\n\nYOU TRY:\nWrite in slowly using the model. Then write one short event note and read it back after looking away.\n\nCHECK:\nCan you identify both letters and the space between words? If the join hides a letter, slow down or use your familiar taught form. Your readable note matters more than extra decoration.",
      "notice": "This drawing is a simple practice model, not a complete handwriting alphabet. Keep a familiar taught style when you have one and check the result for readability.",
      "check": {
        "question": "What is a useful handwriting check for a note card?",
        "options": [
          "Clear letter shapes, word spaces and readable size",
          "Only the amount of decoration",
          "Whether every word is crowded together",
          "Whether the page has no blank space"
        ],
        "correct_index": 0,
        "explanation": "Letter clarity, spacing and size help you read a note at a glance. Decoration or crowding does not establish readability."
      },
      "visual": [
        {
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 240\"><rect width=\"420\" height=\"240\" rx=\"12\" fill=\"#fff\"/><text x=\"20\" y=\"28\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Practice join: in</text><line x1=\"25\" y1=\"100\" x2=\"295\" y2=\"100\" stroke=\"#777\" stroke-dasharray=\"6 5\"/><line x1=\"25\" y1=\"150\" x2=\"295\" y2=\"150\" stroke=\"#18382b\"/><text x=\"302\" y=\"106\" font-family=\"Arial,sans-serif\" font-size=\"18\" fill=\"#18382b\">midline</text><text x=\"302\" y=\"156\" font-family=\"Arial,sans-serif\" font-size=\"18\" fill=\"#18382b\">baseline</text><path d=\"M60 150 Q78 145 95 100 L95 145 Q95 157 110 150 L135 100 L135 150 C135 118 141 98 156 100 C169 102 170 118 170 141 Q170 159 185 150 L205 130\" fill=\"none\" stroke=\"#18382b\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><circle cx=\"95\" cy=\"78\" r=\"4\" fill=\"#18382b\"/><circle cx=\"60\" cy=\"150\" r=\"5\" fill=\"#18382b\"/><text x=\"30\" y=\"191\" font-family=\"Arial,sans-serif\" font-size=\"18\" fill=\"#18382b\">Start at the dot; add the i dot last.</text><text x=\"30\" y=\"222\" font-family=\"Arial,sans-serif\" font-size=\"18\" fill=\"#18382b\">Keep a space before the next word.</text></svg>",
          "alt": "A simple continuous practice stroke connects lower-case i and n between a midline and baseline. The i dot is added separately. Start and line guides are labelled.",
          "caption": "Follow slowly; use your familiar taught form if it differs."
        }
      ]
    }
  ],
  "worked_example": "I DO: Read the original short story.\nTHE PAPER BOAT\nMila sat in the garden with a paper boat. She wanted to keep it ready for an afternoon game.\nWhen she lifted it, one fold opened. Mila pressed the fold back carefully and checked the shape.\nShe put the boat on a tray beside the door. Now she could find it when the game began.\n\nMY EVENT NOTES\nBeginning: Mila in garden, boat ready\nMiddle: fold opens, Mila presses it back\nEnding: boat on tray for game\n\nMY RETELLING\n“Mila had a paper boat in the garden. A fold opened when she lifted it, so she pressed it back carefully. Finally, she put it on a tray where she could find it for her game.”\n\nWHY IT WORKS\nI name Mila and the situation, explain the problem and repair, then tell the outcome. I keep the events but choose my own wording. My short notes prompt full spoken ideas.\n\nCOMMON MISTAKE AND FIX\n“A boat was there, then it was there again” loses the middle event. I add the opened fold and Mila’s action. In rehearsal I give that repair enough time to be clear.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 178\"><rect width=\"420\" height=\"178\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Beginning: person + situation</text><text x=\"16\" y=\"80\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Middle: event + response</text><text x=\"16\" y=\"126\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Ending: what happens after</text></svg>",
      "alt": "A short retelling includes the person and situation, an important event and response, and the outcome.",
      "caption": "Use notes to remember, then speak complete ideas."
    }
  ],
  "guided_practice": "WE DO: Build a telling from the paper-boat story.\n1. Say who is in the story and what she has. Compare after your try: Mila has a paper boat in the garden.\n2. Name the important middle event and response. Compare: a fold opens and Mila presses it back.\n3. Say where the boat ends up and why that matters. Compare: it is on a tray so she can find it for the game.\n4. Write three short notes and speak the connected telling from them. Look back at the original to check accuracy.\n5. Practise your in join slowly three times, then write in the garden with clear spaces. Use your familiar taught join if different.\n6. Tell the story again and choose one useful pace or pause improvement. Explain the change rather than just saying it was better.",
  "independent_task": "YOU DO: Story telling and note-card task (about 20 minutes).\nUse the original paper-boat story included above.\n1. Prepare three short event notes: beginning, middle and ending. Keep one note per line.\n2. On paper, practise the in join three times and write in the garden. Check clear shapes and spaces. If handwriting is not accessible, type the notes and tell a grown-up that no handwriting sample was produced.\n3. Retell the story in your own words using the notes. You can practise alone; a listener or recording is optional.\n4. Choose a clearer word, steadier pace or helpful thought pause. Retell it again with that improvement.\n5. In the big box, submit your three notes, retelling wording or summary, and improvement with its reason. Keep any handwritten page for review; an upload is not required.\nCheck: important events accurate; person introduced; ending included; notes readable; one improvement explained.",
  "response_prompt": "Which note or delivery change helped your second telling, and how?",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "What does a retelling do?",
      "options": [
        "Changes every event into a different story",
        "Tells important events again in your own words",
        "Lists every object but no actions",
        "Copies only the title"
      ],
      "correct_index": 1,
      "explanation": "A retelling keeps important events and meaning while using your own wording."
    },
    {
      "type": "multiple_choice",
      "question": "What helps an unfamiliar listener at the beginning?",
      "options": [
        "An unexplained she",
        "Only the last event",
        "Who the story is about and the situation",
        "A list of all punctuation"
      ],
      "correct_index": 2,
      "explanation": "Introducing the person and situation gives the listener a starting point for later events."
    },
    {
      "type": "multiple_choice",
      "question": "Which middle event belongs in the paper-boat retelling?",
      "options": [
        "The fold opens and Mila presses it back",
        "Mila travels overseas in the boat",
        "The tray turns into a kite",
        "A new person wins an invented race"
      ],
      "correct_index": 0,
      "explanation": "The opened fold and repair are stated in the original. The other choices invent events."
    },
    {
      "type": "multiple_choice",
      "question": "Why include the boat being put on a tray?",
      "options": [
        "It means the middle can disappear",
        "Every story must include a tray",
        "It lists a colour",
        "It explains where the boat ends up ready for the game"
      ],
      "correct_index": 3,
      "explanation": "This detail gives the event an outcome and shows why the placement matters."
    },
    {
      "type": "multiple_choice",
      "question": "What is a note card for?",
      "options": [
        "Replacing all explanation with vague words",
        "Prompting the events you will explain",
        "Changing the names randomly",
        "Counting every letter"
      ],
      "correct_index": 1,
      "explanation": "Short meaningful notes prompt full spoken ideas; they do not replace the explanation."
    },
    {
      "type": "multiple_choice",
      "question": "Which change helps a rushed repair event?",
      "options": [
        "Make every word louder",
        "Remove the repair",
        "Give it more time and keep the words clear",
        "Add a new problem"
      ],
      "correct_index": 2,
      "explanation": "A steadier pace improves clarity without changing the original event."
    },
    {
      "type": "multiple_choice",
      "question": "Why leave spaces between written words?",
      "options": [
        "So the separate words can be recognised easily",
        "So all letters become one shape",
        "So the story needs no ending",
        "So decoration replaces meaning"
      ],
      "correct_index": 0,
      "explanation": "Word spaces help the reader identify separate words and use the note at a glance."
    },
    {
      "type": "multiple_choice",
      "question": "When practising the modelled in join, which step is appropriate?",
      "options": [
        "Never lift to add any dot",
        "Join the next word without a space",
        "Hide the i letter completely",
        "Add the i dot after the connected strokes"
      ],
      "correct_index": 3,
      "explanation": "The connected main strokes can be followed before lifting to add the i dot. Word spaces and clear letters still matter."
    },
    {
      "type": "short_answer",
      "question": "Retell the paper-boat problem and response in one or two sentences.",
      "sample_answer": "A fold opened in Mila’s paper boat. She pressed the fold back carefully.",
      "marking_guide": "Accept accurate original wording for the problem and response, without invented events.",
      "explanation": "A useful retelling preserves the event and explains the response."
    },
    {
      "type": "short_answer",
      "question": "Explain one delivery or note-card improvement you made.",
      "sample_answer": "I slowed the part about the opened fold so a listener could follow Mila’s repair.",
      "marking_guide": "Accept a specific improvement to pace, pause, clarity or readable notes with a purpose.",
      "explanation": "An explanation names the change and how it helps."
    }
  ],
  "parent_notes": "Parent: Teaches short retelling, cue notes, rehearsal and a simple joined-letter practice linked to readable notes. This is one contribution to the listed Stage 2 outcomes, not complete coverage. Codes were checked against the NESA English K–10 (2022) outcomes page. All practice text is original.\n\nParent: Observe oral clarity only if you hear a telling. Review handwriting only if a handwritten sample exists. The simple in diagram is an illustrative practice model, not a mandated full alphabet; preserve a child’s existing taught style. Let the child attempt the small practice before comparing its feedback. The lesson supplies the teaching; your role is reviewing evidence and helping with access if required.\n\nParent: The quiz has eight automatically scored choices and two written answers. The unchanged 90% threshold requires 8/8 choices. Written answers accompany the submission for manual review. Model for question 9: A fold opened in Mila’s paper boat. She pressed the fold back carefully. Model for question 10: I slowed the part about the opened fold so a listener could follow Mila’s repair.\n\nParent: A written retelling can evidence planning, but is not by itself evidence of oral performance. A typed card does not demonstrate joined handwriting. Check both areas separately and record any access support. No particular accent, dramatic voice, recording or photo is required.",
  "evidence_instructions": "Keep event notes, written retelling or summary, reflection and quiz responses. Where available, observe the two tellings and keep the handwritten join practice separately.",
  "offline_alternative": "Copy the short story before switching off the screen. Write three cues and practise the join on paper. Retell twice, record one improvement and later type a summary and complete the quiz.",
  "extension": "Retell the same events in fewer words without losing the opened-fold problem and response. Explain what you safely left out.",
  "stage_hints": {
    "accept": [
      "Read the mission and notice the telling and note-card parts.",
      "Begin with the first story; your notes can grow after the examples.",
      "Choose paper for handwriting practice if accessible. You can still use typed notes to plan your telling."
    ],
    "teach0": [
      "Look back at important events rather than lists of things.",
      "Find what happens to the object and what the person does next.",
      "Use a beginning, middle and ending note to check that the main action stays understandable."
    ],
    "teach1": [
      "Look back at a note becoming a full spoken idea.",
      "Name the person before using a pronoun the listener cannot identify.",
      "Use your note to explain what happened, then check the original story for accuracy."
    ],
    "teach2": [
      "Look back at a pace or pause improvement.",
      "Choose one rushed event and say it carefully by itself.",
      "Tell that short event twice and compare whether the action is easier to follow."
    ],
    "teach3": [
      "Look at the line guides and start point in the drawing.",
      "Follow the main strokes slowly and check that both letters remain recognisable.",
      "Practise one join, then test a short note for clear letters and word spaces."
    ],
    "learn": [
      "Read the original story before the model telling.",
      "Match each short note to an important event in the original.",
      "Use one note to speak a complete idea, keeping the event the same."
    ],
    "guided": [
      "Start with Mila’s situation before the middle event.",
      "Make three short notes before trying the connected telling.",
      "Use “At the beginning, ____.” Fill that gap, then move to what changes in the middle."
    ],
    "write": [
      "Prepare the three event notes before your full rehearsal.",
      "Begin “This story is about ____.” Introduce the person before the event.",
      "A partial opening shape is “In the garden, ____ had ____.” Complete it from the story and continue in your own words."
    ],
    "quiz": [
      "Return to the step about events, cues, delivery or handwriting.",
      "Check whether a choice preserves the story or helps a listener follow it.",
      "For a written answer, name the actual event or improvement and explain its purpose."
    ],
    "submit": [
      "Check your notes, summary and reflection are ready.",
      "Include the two written answers and keep any handwritten sample separately.",
      "Say whether your telling was practised alone or observed, then send the planning evidence for review."
    ]
  }
}'),
    updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
WHERE seed_key = 's2-eng-y3-w01-l4';
