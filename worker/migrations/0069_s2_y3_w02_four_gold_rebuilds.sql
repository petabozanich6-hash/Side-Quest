-- Standard v2 Gold-depth corrections, Year 3 English W2 L2-L4 and Maths W2 L1.

-- s2-eng-y3-w02-l2
UPDATE lessons SET title='The Story Mountain: Plan Before You Write', data=json_patch(data,'{
  "seed_key": "s2-eng-y3-w02-l2",
  "title": "The Story Mountain: Plan Before You Write",
  "stage": "Stage 2",
  "learning_area": "English",
  "year_level": 3,
  "week": 2,
  "lesson_number": 2,
  "duration_minutes": 60,
  "child_mission": "Become a story planning detective: learn the method, check original stories or numbers, then explain an independent challenge.",
  "learning_intention": "We are learning to apply story planning with clear reasons and accurate evidence.",
  "success_criteria": [
    "I can explain the idea using an original example.",
    "I can follow a model and identify why each step works.",
    "I can answer guided practice with feedback.",
    "I can complete an independent example using the lesson method.",
    "I can check my answer and explain one correction."
  ],
  "materials": [
    "All original teaching and examples are inside this lesson.",
    "Optional paper and pencil for drawing or annotating."
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
  "interactive_activities": [
    {
      "type": "flip_cards",
      "title": "story planning concept cards",
      "cards": [
        {
          "front": "Give a reader a clear beginning",
          "back": "A story''s **orientation** introduces a character, a place and a starting situation. It does not need to tell every detail. The reader should understand whose journey to follow and where it begins."
        },
        {
          "front": "Create a problem that matters",
          "back": "The **complication** is a change that stops a character''s plan. It should be connected to the beginning. A tiny event can be a real problem if it matters to the character."
        },
        {
          "front": "Build rising action through choices",
          "back": "In the middle, the character **tries things** to deal with the complication. Each action leads towards the high point. A story mountain is a planning tool, not a rule that every story must follow exactly."
        },
        {
          "front": "Choose a turning point and resolution",
          "back": "The **turning point** is when the problem changes decisively; the **resolution** tells the reader what happens because of that change. Keep the ending connected to the problem rather than adding a random surprise."
        }
      ]
    }
  ],
  "printable_resource": {
    "title": "story planning learning sheet",
    "instructions": "Work through the original example, answer the guided questions, and complete the independent challenge.",
    "passage": "On Monday, Noor enters the school garden to collect seeds. A sudden storm washes away the labels. Noor sorts plants by their leaves, asks the gardener for help, and makes new labels before the class visits.",
    "prompts": [
      "Identify the central idea and supporting details.",
      "Explain the method with one worked example.",
      "Complete the independent challenge.",
      "Record one correction or further question."
    ]
  },
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "🔎",
      "title": "Give a reader a clear beginning",
      "explain": "**Learn the concept.** A story''s **orientation** introduces a character, a place and a starting situation. It does not need to tell every detail. The reader should understand whose journey to follow and where it begins.\n\n**Our shared example:** On Monday, Noor enters the school garden to collect seeds. A sudden storm washes away the labels. Noor sorts plants by their leaves, asks the gardener for help, and makes new labels before the class visits.\n\n**Notice:** Focus on the exact words, events or quantities rather than an unsupported guess.",
      "example": "**WATCH MY THINKING**\nI write: ''On Monday, Noor carried seed packets into the school garden.'' Now I know who (Noor), where (garden) and when (Monday). I can save the storm for later.\n\n**TRY A NEW CASE**\n**Plan an original story: The Vanishing Sketchbook.** Your character is Jules, who brings a sketchbook to a weekend art fair. The book disappears from a table before judging. Create a five-stage story mountain: orientation (who, where, goal); complication (what goes wrong); at least two rising actions; decisive turning point; resolution. Decide how Jules discovers what happened without assuming a thief. Write a title and one sentence for each stage, then explain why the resolution follows from the problem.\n\n**CHECK YOUR THINKING**\nReread the teaching point. Explain why the example uses this rule and identify a common mistake.",
      "notice": "A story''s **orientation** introduces a character, a place and a starting situation. It does not need to tell every detail. The reader should understand whose journey to follow and where it begins. Compare your conclusion with the original evidence.",
      "check": {
        "question": "Which opening tells us a character and place?",
        "options": [
          "Noor entered the school garden.",
          "The seeds were found.",
          "Suddenly!",
          "Everything finished."
        ],
        "correct_index": 0,
        "explanation": "I write: ''On Monday, Noor carried seed packets into the school garden.'' Now I know who (Noor), where (garden) and when (Monday). I can save the storm for later."
      },
      "visual_before": [
        {
          "episode": {
            "title": "A story planning clue",
            "transcript": "Pip: Noor has a seed plan. Should the storm go at the very beginning?\nJuno: First give the reader Noor''s goal and place. Then a storm changes the plan.\nPip: The washed-away labels cause the problem, so Noor must choose what to do.\nJuno: Exactly. Pause and name one helpful action she could try.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "Noor has a seed plan. Should the storm go at the very beginning?",
                    "pause_after": false
                  },
                  {
                    "who": "juno",
                    "text": "First give the reader Noor''s goal and place. Then a storm changes the plan.",
                    "pause_after": false
                  },
                  {
                    "who": "pip",
                    "text": "The washed-away labels cause the problem, so Noor must choose what to do.",
                    "pause_after": false
                  },
                  {
                    "who": "juno",
                    "text": "Exactly. Pause and name one helpful action she could try.",
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
      "icon": "🧠",
      "title": "Create a problem that matters",
      "explain": "**Learn the concept.** The **complication** is a change that stops a character''s plan. It should be connected to the beginning. A tiny event can be a real problem if it matters to the character.\n\n**Our shared example:** On Monday, Noor enters the school garden to collect seeds. A sudden storm washes away the labels. Noor sorts plants by their leaves, asks the gardener for help, and makes new labels before the class visits.\n\n**Notice:** Focus on the exact words, events or quantities rather than an unsupported guess.",
      "example": "**WATCH MY THINKING**\nNoor planned to deliver labelled seeds, but the rain removes the labels. I write the complication as ''The storm washed the names away.'' This affects her actual task.\n\n**TRY A NEW CASE**\n**Plan an original story: The Vanishing Sketchbook.** Your character is Jules, who brings a sketchbook to a weekend art fair. The book disappears from a table before judging. Create a five-stage story mountain: orientation (who, where, goal); complication (what goes wrong); at least two rising actions; decisive turning point; resolution. Decide how Jules discovers what happened without assuming a thief. Write a title and one sentence for each stage, then explain why the resolution follows from the problem.\n\n**CHECK YOUR THINKING**\nReread the teaching point. Explain why the example uses this rule and identify a common mistake.",
      "notice": "The **complication** is a change that stops a character''s plan. It should be connected to the beginning. A tiny event can be a real problem if it matters to the character. Compare your conclusion with the original evidence.",
      "check": {
        "question": "What is Noor''s main complication?",
        "options": [
          "A teacher rings a bell.",
          "The labels wash away.",
          "She carries a bag.",
          "Monday arrives."
        ],
        "correct_index": 1,
        "explanation": "Noor planned to deliver labelled seeds, but the rain removes the labels. I write the complication as ''The storm washed the names away.'' This affects her actual task."
      }
    },
    {
      "icon": "✏️",
      "title": "Build rising action through choices",
      "explain": "**Learn the concept.** In the middle, the character **tries things** to deal with the complication. Each action leads towards the high point. A story mountain is a planning tool, not a rule that every story must follow exactly.\n\n**Our shared example:** On Monday, Noor enters the school garden to collect seeds. A sudden storm washes away the labels. Noor sorts plants by their leaves, asks the gardener for help, and makes new labels before the class visits.\n\n**Notice:** Focus on the exact words, events or quantities rather than an unsupported guess.",
      "example": "**WATCH MY THINKING**\nNoor looks at leaf shapes, compares packets and calls the gardener. These are rising actions because each is an attempt to solve the labelling problem. I place them on the uphill side.\n\n**TRY A NEW CASE**\n**Plan an original story: The Vanishing Sketchbook.** Your character is Jules, who brings a sketchbook to a weekend art fair. The book disappears from a table before judging. Create a five-stage story mountain: orientation (who, where, goal); complication (what goes wrong); at least two rising actions; decisive turning point; resolution. Decide how Jules discovers what happened without assuming a thief. Write a title and one sentence for each stage, then explain why the resolution follows from the problem.\n\n**CHECK YOUR THINKING**\nReread the teaching point. Explain why the example uses this rule and identify a common mistake.",
      "notice": "In the middle, the character **tries things** to deal with the complication. Each action leads towards the high point. A story mountain is a planning tool, not a rule that every story must follow exactly. Compare your conclusion with the original evidence.",
      "check": {
        "question": "Which event belongs on the uphill part?",
        "options": [
          "Noor asks the gardener for help.",
          "The class visits after everything is fixed.",
          "The story title appears.",
          "Monday is named."
        ],
        "correct_index": 0,
        "explanation": "Noor looks at leaf shapes, compares packets and calls the gardener. These are rising actions because each is an attempt to solve the labelling problem. I place them on the uphill side."
      }
    },
    {
      "icon": "✅",
      "title": "Choose a turning point and resolution",
      "explain": "**Learn the concept.** The **turning point** is when the problem changes decisively; the **resolution** tells the reader what happens because of that change. Keep the ending connected to the problem rather than adding a random surprise.\n\n**Our shared example:** On Monday, Noor enters the school garden to collect seeds. A sudden storm washes away the labels. Noor sorts plants by their leaves, asks the gardener for help, and makes new labels before the class visits.\n\n**Notice:** Focus on the exact words, events or quantities rather than an unsupported guess.",
      "example": "**WATCH MY THINKING**\nThe gardener identifies the plants and Noor writes new labels: that is the turning point. When the class arrives, every plant is labelled: that is the resolution.\n\n**TRY A NEW CASE**\n**Plan an original story: The Vanishing Sketchbook.** Your character is Jules, who brings a sketchbook to a weekend art fair. The book disappears from a table before judging. Create a five-stage story mountain: orientation (who, where, goal); complication (what goes wrong); at least two rising actions; decisive turning point; resolution. Decide how Jules discovers what happened without assuming a thief. Write a title and one sentence for each stage, then explain why the resolution follows from the problem.\n\n**CHECK YOUR THINKING**\nReread the teaching point. Explain why the example uses this rule and identify a common mistake.",
      "notice": "The **turning point** is when the problem changes decisively; the **resolution** tells the reader what happens because of that change. Keep the ending connected to the problem rather than adding a random surprise. Compare your conclusion with the original evidence.",
      "check": {
        "question": "Which is a connected resolution?",
        "options": [
          "A spaceship lands for no reason.",
          "Noor labels the plants before the visit.",
          "The seeds turn into bicycles.",
          "Nothing connects to the storm."
        ],
        "correct_index": 1,
        "explanation": "The gardener identifies the plants and Noor writes new labels: that is the turning point. When the class arrives, every plant is labelled: that is the resolution."
      }
    }
  ],
  "worked_example": "## Follow the complete example\n\nOn Monday, Noor enters the school garden to collect seeds. A sudden storm washes away the labels. Noor sorts plants by their leaves, asks the gardener for help, and makes new labels before the class visits.\n\n**Step 1.** I write: ''On Monday, Noor carried seed packets into the school garden.'' Now I know who (Noor), where (garden) and when (Monday). I can save the storm for later.\n\n**Step 2.** Noor planned to deliver labelled seeds, but the rain removes the labels. I write the complication as ''The storm washed the names away.'' This affects her actual task.\n\n**Step 3.** Noor looks at leaf shapes, compares packets and calls the gardener. These are rising actions because each is an attempt to solve the labelling problem. I place them on the uphill side.\n\n**Step 4.** The gardener identifies the plants and Noor writes new labels: that is the turning point. When the class arrives, every plant is labelled: that is the resolution.\n\n**Self-check:** Explain which detail matters for your conclusion, and which alternative would be a misconception.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 620 220\"><rect width=\"620\" height=\"220\" rx=\"12\" fill=\"#f5f8f5\"/><text x=\"18\" y=\"34\" font-family=\"Arial\" font-size=\"21\" fill=\"#203f33\">STORY PLANNING</text><rect x=\"16\" y=\"66\" width=\"111\" height=\"112\" rx=\"8\" fill=\"#d9ebdf\"/><text x=\"24\" y=\"120\" font-family=\"Arial\" font-size=\"12\" fill=\"#18382b\">BEGINNING</text><rect x=\"137\" y=\"66\" width=\"111\" height=\"112\" rx=\"8\" fill=\"#e6ecf8\"/><text x=\"145\" y=\"120\" font-family=\"Arial\" font-size=\"12\" fill=\"#18382b\">PROBLEM</text><rect x=\"258\" y=\"66\" width=\"111\" height=\"112\" rx=\"8\" fill=\"#d9ebdf\"/><text x=\"266\" y=\"120\" font-family=\"Arial\" font-size=\"12\" fill=\"#18382b\">ACTIONS</text><rect x=\"379\" y=\"66\" width=\"111\" height=\"112\" rx=\"8\" fill=\"#e6ecf8\"/><text x=\"387\" y=\"120\" font-family=\"Arial\" font-size=\"12\" fill=\"#18382b\">TURN</text><rect x=\"500\" y=\"66\" width=\"111\" height=\"112\" rx=\"8\" fill=\"#d9ebdf\"/><text x=\"508\" y=\"120\" font-family=\"Arial\" font-size=\"12\" fill=\"#18382b\">ENDING</text></svg>",
      "alt": "Five labelled stages of story planning: BEGINNING, PROBLEM, ACTIONS, TURN, ENDING.",
      "caption": "Use the story planning process as a reminder while working through the task."
    }
  ],
  "guided_practice": "**Second original story to practise:** Iris wants to show a model lighthouse at the town fair. On the way, a wheel breaks off its trolley. Iris checks the box, borrows tape from the organiser and fastens the wheel. The lighthouse reaches the display before the visitors arrive.\n\n1. Write an orientation sentence naming Iris, the fair and her plan.\n2. Mark the complication in the story. Which object breaks, and why does that matter?\n3. Place two actions on the rising side of your mountain.\n4. Circle the turning point, then give a one-sentence resolution.\n\n**Feedback:** Orientation: Iris transports a lighthouse model to the fair. Problem: the trolley wheel breaks. Rising action: checks supplies; asks for tape. Turning point: fastens the wheel. Resolution: lighthouse reaches its display. *Do not* call the town fair itself the complication; a setting is not a problem.",
  "independent_task": "**Plan an original story: The Vanishing Sketchbook.** Your character is Jules, who brings a sketchbook to a weekend art fair. The book disappears from a table before judging. Create a five-stage story mountain: orientation (who, where, goal); complication (what goes wrong); at least two rising actions; decisive turning point; resolution. Decide how Jules discovers what happened without assuming a thief. Write a title and one sentence for each stage, then explain why the resolution follows from the problem.",
  "response_prompt": "Complete the original story planning task in your own words. Include reasoning and one improvement.",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "Which detail is an orientation?",
      "options": [
        "Jules arrived at the weekend art fair.",
        "The book was returned.",
        "A clue solved the case.",
        "Judging ended."
      ],
      "correct_index": 0,
      "explanation": "An opening identifies Jules and the fair."
    },
    {
      "type": "multiple_choice",
      "question": "What starts the complication?",
      "options": [
        "A new pencil is sharpened.",
        "The sketchbook is missing.",
        "Jules makes a new friend.",
        "The fair opens."
      ],
      "correct_index": 1,
      "explanation": "The missing book interrupts the plan."
    },
    {
      "type": "multiple_choice",
      "question": "Which action belongs in rising action?",
      "options": [
        "Jules asks staff whether they moved the book.",
        "The fair has a roof.",
        "A judge announces a winner.",
        "Everyone goes home."
      ],
      "correct_index": 0,
      "explanation": "Asking staff is an attempt to solve the disappearance."
    },
    {
      "type": "multiple_choice",
      "question": "What is a plausible turning point?",
      "options": [
        "Jules discovers the book at the judging desk.",
        "Jules arrives at the fair.",
        "It is the weekend.",
        "The weather is warm."
      ],
      "correct_index": 0,
      "explanation": "Finding the book decisively changes the problem."
    },
    {
      "type": "multiple_choice",
      "question": "Which ending resolves the original problem?",
      "options": [
        "The fair moves to a new town.",
        "The book is returned before judging.",
        "A dog learns to dance.",
        "Someone paints the sky."
      ],
      "correct_index": 1,
      "explanation": "Returning it connects to the disappearance."
    },
    {
      "type": "multiple_choice",
      "question": "Why shouldn''t Jules accuse a thief immediately?",
      "options": [
        "The book is colourful.",
        "There is no evidence of theft.",
        "The fair is outdoors.",
        "Art fairs never have judges."
      ],
      "correct_index": 1,
      "explanation": "A missing object alone does not prove theft."
    },
    {
      "type": "multiple_choice",
      "question": "Which sequence is correctly ordered?",
      "options": [
        "Book found → arrives → book missing.",
        "Arrives → book missing → searches → finds it.",
        "Goes home → finds it → looks.",
        "Judging → book missing → arrival."
      ],
      "correct_index": 1,
      "explanation": "Beginning, problem, attempts, turning point is a logical order."
    },
    {
      "type": "multiple_choice",
      "question": "Which plan has a connected middle?",
      "options": [
        "Jules searches for the sketchbook and asks a helper.",
        "A dragon flies across a different country.",
        "Every character vanishes.",
        "The art fair becomes a spaceship."
      ],
      "correct_index": 0,
      "explanation": "Related actions build toward resolving the established complication."
    },
    {
      "type": "short_answer",
      "question": "Complete the core story planning challenge with evidence and a clear explanation.",
      "sample_answer": "Jules arrives at the art fair to show a sketchbook. It goes missing before judging. Jules checks the display and asks a steward. The steward explains it was moved to keep it dry. Jules collects it and presents the work on time.",
      "marking_guide": "Check all requested parts, accuracy, and a reason based on the original source or worked method.",
      "explanation": "A full response uses concrete relevant evidence, not only a named concept."
    },
    {
      "type": "short_answer",
      "question": "Explain an error to avoid or a meaningful improvement in your story planning work.",
      "sample_answer": "My rising actions lead to the resolution because checking the display and asking the steward reveal where the missing book went. The story never shows that anyone stole it.",
      "marking_guide": "Require a correct topic-specific explanation that distinguishes evidence from guessing.",
      "explanation": "Checking the actual examples improves accuracy."
    }
  ],
  "parent_notes": "Parent: **What to observe.** Ask the learner to explain the topic using the original example without reading the model word for word. Ask one probing question before supplying a correction.\n\nParent: **Written quiz model 1.** Jules arrives at the art fair to show a sketchbook. It goes missing before judging. Jules checks the display and asks a steward. The steward explains it was moved to keep it dry. Jules collects it and presents the work on time.\n\nParent: **Written quiz model 2.** My rising actions lead to the resolution because checking the display and asking the steward reveal where the missing book went. The story never shows that anyone stole it.\n\nParent: **Evidence and marking.** Collect the independent work and any revision. The eight machine-scored MCQs require eight correct for the 90% threshold; inspect the two written responses yourself. Verify syllabus outcome codes separately before approval.",
  "evidence_instructions": "Save the guided practice, completed story planning task, specific improvement, and two written quiz answers.",
  "offline_alternative": "Work from the printed original example and instructions on paper. Explain answers orally to a parent if needed; keep brief notes as evidence.",
  "extension": "Construct a different example that tests a tricky point in story planning; explain how you would check it.",
  "stage_hints": {
    "accept": [
      "Read the mission about story planning. You will learn before being assessed.",
      "First study the original example, then practise with feedback.",
      "Use paper or typing; focus on explaining each choice clearly."
    ],
    "teach0": [
      "Look for the feature described in the first teaching step.",
      "Find the exact word, number or action in the example that supports it.",
      "Say how the detail demonstrates the first concept; check it against the model."
    ],
    "teach1": [
      "Revisit the second teaching idea for story planning.",
      "Use the model to identify what changed from the first step.",
      "Explain the second step using an original piece of evidence."
    ],
    "teach2": [
      "Find the practice task that uses the third teaching point.",
      "Work through the example slowly and record each decision.",
      "Check whether each action follows from the given facts rather than an assumption."
    ],
    "teach3": [
      "Review the last principle and identify what it checks.",
      "Test your answer against the original example, not just a guess.",
      "Revise one inaccurate detail and explain the effect of that revision."
    ],
    "learn": [
      "Use the visual diagram as a reminder of the story planning sequence.",
      "Reread the model before checking the next case.",
      "Describe why the demonstrated method works in your own words."
    ],
    "guided": [
      "Break the practice into its numbered questions.",
      "Compare each attempt with the provided feedback; mark one correction.",
      "Try the same method on the next question without looking at the answer first."
    ],
    "write": [
      "Read every part of the story planning challenge before writing.",
      "Write the working or evidence beside the answer.",
      "Finish with an explanation of a real revision or error to avoid."
    ],
    "quiz": [
      "Each question tests a detail of story planning; reread the example if needed.",
      "Cross out options inconsistent with the story, rule or calculation.",
      "For written answers, provide your own working and compare it with the teaching."
    ],
    "submit": [
      "Check that every part of the independent task is complete.",
      "Check your evidence or working rather than just counting answers.",
      "Save your work and one meaningful correction before submission."
    ]
  }
}'),updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE seed_key='s2-eng-y3-w02-l2';

-- s2-eng-y3-w02-l3
UPDATE lessons SET title='Word Workshop: Nouns, Verbs and Adjectives', data=json_patch(data,'{
  "seed_key": "s2-eng-y3-w02-l3",
  "title": "Word Workshop: Nouns, Verbs and Adjectives",
  "stage": "Stage 2",
  "learning_area": "English",
  "year_level": 3,
  "week": 2,
  "lesson_number": 3,
  "duration_minutes": 60,
  "child_mission": "Become a word classes detective: learn the method, check original stories or numbers, then explain an independent challenge.",
  "learning_intention": "We are learning to apply word classes with clear reasons and accurate evidence.",
  "success_criteria": [
    "I can explain the idea using an original example.",
    "I can follow a model and identify why each step works.",
    "I can answer guided practice with feedback.",
    "I can complete an independent example using the lesson method.",
    "I can check my answer and explain one correction."
  ],
  "materials": [
    "All original teaching and examples are inside this lesson.",
    "Optional paper and pencil for drawing or annotating."
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
  "interactive_activities": [
    {
      "type": "flip_cards",
      "title": "word classes concept cards",
      "cards": [
        {
          "front": "Find who or what: nouns",
          "back": "A **noun** names a person, place, animal, thing or idea. In ''The fox leapt over a log'', *fox* and *log* are nouns. A word''s job matters: *run* can be an action verb in ''I run'' but a noun in ''a long run''."
        },
        {
          "front": "Spot what happens: verbs",
          "back": "A **verb** tells an action, occurrence or state. *Leapt* and *crawled* show actions. Some verbs describe being, as in ''The fox **is** alert''. Do not mistake a vivid action for an adjective."
        },
        {
          "front": "Notice descriptions: adjectives",
          "back": "An **adjective** gives information about a noun. *Curious* describes the fox, *fallen* describes the log, and *bright* describes the beetle. A description should match the noun it modifies."
        },
        {
          "front": "Revise sentences with purposeful choices",
          "back": "A sentence often becomes clearer when you keep a precise noun, choose a strong verb and add a useful adjective. Adding ten adjectives is not automatically better. Test your sentence by removing each descriptor and deciding if it helps."
        }
      ]
    }
  ],
  "printable_resource": {
    "title": "word classes learning sheet",
    "instructions": "Work through the original example, answer the guided questions, and complete the independent challenge.",
    "passage": "The curious fox leapt over a fallen log. A bright beetle crawled beneath the leaves.",
    "prompts": [
      "Identify the central idea and supporting details.",
      "Explain the method with one worked example.",
      "Complete the independent challenge.",
      "Record one correction or further question."
    ]
  },
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "🔎",
      "title": "Find who or what: nouns",
      "explain": "**Learn the concept.** A **noun** names a person, place, animal, thing or idea. In ''The fox leapt over a log'', *fox* and *log* are nouns. A word''s job matters: *run* can be an action verb in ''I run'' but a noun in ''a long run''.\n\n**Our shared example:** The curious fox leapt over a fallen log. A bright beetle crawled beneath the leaves.\n\n**Notice:** Focus on the exact words, events or quantities rather than an unsupported guess.",
      "example": "**WATCH MY THINKING**\nI ask ''Who or what appears?'' In our sentence: fox, log, beetle and leaves. These are nouns even if they are not all living things.\n\n**TRY A NEW CASE**\n**Sentence laboratory:** Rewrite ''The animal went near the place'' as two interesting, clear sentences about an animal in a garden. For each sentence identify at least two nouns, one verb and one adjective. Then improve one weak verb and explain why the replacement paints a clearer picture. Finally classify all the underlined words in: ''The **silver** fish **darted** around the **rock**.''\n\n**CHECK YOUR THINKING**\nReread the teaching point. Explain why the example uses this rule and identify a common mistake.",
      "notice": "A **noun** names a person, place, animal, thing or idea. In ''The fox leapt over a log'', *fox* and *log* are nouns. A word''s job matters: *run* can be an action verb in ''I run'' but a noun in ''a long run''. Compare your conclusion with the original evidence.",
      "check": {
        "question": "Which word is a noun in ''The fox leapt''?",
        "options": [
          "The",
          "fox",
          "leapt",
          "quickly"
        ],
        "correct_index": 1,
        "explanation": "I ask ''Who or what appears?'' In our sentence: fox, log, beetle and leaves. These are nouns even if they are not all living things."
      },
      "visual_before": [
        {
          "episode": {
            "title": "A word classes clue",
            "transcript": "Pip: The curious fox leapt. I think curious is the action!\nJuno: Curious describes the fox. The fox''s action is leapt.\nPip: So fox is the noun, leapt the verb, and curious the adjective.\nJuno: Exactly. Pause and identify the describing word in bright beetle.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "The curious fox leapt. I think curious is the action!",
                    "pause_after": false
                  },
                  {
                    "who": "juno",
                    "text": "Curious describes the fox. The fox''s action is leapt.",
                    "pause_after": false
                  },
                  {
                    "who": "pip",
                    "text": "So fox is the noun, leapt the verb, and curious the adjective.",
                    "pause_after": false
                  },
                  {
                    "who": "juno",
                    "text": "Exactly. Pause and identify the describing word in bright beetle.",
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
      "icon": "🧠",
      "title": "Spot what happens: verbs",
      "explain": "**Learn the concept.** A **verb** tells an action, occurrence or state. *Leapt* and *crawled* show actions. Some verbs describe being, as in ''The fox **is** alert''. Do not mistake a vivid action for an adjective.\n\n**Our shared example:** The curious fox leapt over a fallen log. A bright beetle crawled beneath the leaves.\n\n**Notice:** Focus on the exact words, events or quantities rather than an unsupported guess.",
      "example": "**WATCH MY THINKING**\nI ask ''What did the fox do?'' It *leapt*. What did the beetle do? It *crawled*. These are the doing words.\n\n**TRY A NEW CASE**\n**Sentence laboratory:** Rewrite ''The animal went near the place'' as two interesting, clear sentences about an animal in a garden. For each sentence identify at least two nouns, one verb and one adjective. Then improve one weak verb and explain why the replacement paints a clearer picture. Finally classify all the underlined words in: ''The **silver** fish **darted** around the **rock**.''\n\n**CHECK YOUR THINKING**\nReread the teaching point. Explain why the example uses this rule and identify a common mistake.",
      "notice": "A **verb** tells an action, occurrence or state. *Leapt* and *crawled* show actions. Some verbs describe being, as in ''The fox **is** alert''. Do not mistake a vivid action for an adjective. Compare your conclusion with the original evidence.",
      "check": {
        "question": "Which word is a verb?",
        "options": [
          "bright",
          "beetle",
          "crawled",
          "leaves"
        ],
        "correct_index": 2,
        "explanation": "I ask ''What did the fox do?'' It *leapt*. What did the beetle do? It *crawled*. These are the doing words."
      }
    },
    {
      "icon": "✏️",
      "title": "Notice descriptions: adjectives",
      "explain": "**Learn the concept.** An **adjective** gives information about a noun. *Curious* describes the fox, *fallen* describes the log, and *bright* describes the beetle. A description should match the noun it modifies.\n\n**Our shared example:** The curious fox leapt over a fallen log. A bright beetle crawled beneath the leaves.\n\n**Notice:** Focus on the exact words, events or quantities rather than an unsupported guess.",
      "example": "**WATCH MY THINKING**\nI draw an arrow from *curious* to *fox*. If I remove curious, the fox still exists in the sentence; we simply lose information about it.\n\n**TRY A NEW CASE**\n**Sentence laboratory:** Rewrite ''The animal went near the place'' as two interesting, clear sentences about an animal in a garden. For each sentence identify at least two nouns, one verb and one adjective. Then improve one weak verb and explain why the replacement paints a clearer picture. Finally classify all the underlined words in: ''The **silver** fish **darted** around the **rock**.''\n\n**CHECK YOUR THINKING**\nReread the teaching point. Explain why the example uses this rule and identify a common mistake.",
      "notice": "An **adjective** gives information about a noun. *Curious* describes the fox, *fallen* describes the log, and *bright* describes the beetle. A description should match the noun it modifies. Compare your conclusion with the original evidence.",
      "check": {
        "question": "Which adjective describes the beetle?",
        "options": [
          "bright",
          "crawled",
          "beneath",
          "the"
        ],
        "correct_index": 0,
        "explanation": "I draw an arrow from *curious* to *fox*. If I remove curious, the fox still exists in the sentence; we simply lose information about it."
      }
    },
    {
      "icon": "✅",
      "title": "Revise sentences with purposeful choices",
      "explain": "**Learn the concept.** A sentence often becomes clearer when you keep a precise noun, choose a strong verb and add a useful adjective. Adding ten adjectives is not automatically better. Test your sentence by removing each descriptor and deciding if it helps.\n\n**Our shared example:** The curious fox leapt over a fallen log. A bright beetle crawled beneath the leaves.\n\n**Notice:** Focus on the exact words, events or quantities rather than an unsupported guess.",
      "example": "**WATCH MY THINKING**\nPlain: ''The bird went to the branch.'' Revised: ''The spotted bird **fluttered** to the narrow branch.'' Nouns: bird, branch. Verb: fluttered. Adjectives: spotted, narrow. I can explain what each adds.\n\n**TRY A NEW CASE**\n**Sentence laboratory:** Rewrite ''The animal went near the place'' as two interesting, clear sentences about an animal in a garden. For each sentence identify at least two nouns, one verb and one adjective. Then improve one weak verb and explain why the replacement paints a clearer picture. Finally classify all the underlined words in: ''The **silver** fish **darted** around the **rock**.''\n\n**CHECK YOUR THINKING**\nReread the teaching point. Explain why the example uses this rule and identify a common mistake.",
      "notice": "A sentence often becomes clearer when you keep a precise noun, choose a strong verb and add a useful adjective. Adding ten adjectives is not automatically better. Test your sentence by removing each descriptor and deciding if it helps. Compare your conclusion with the original evidence.",
      "check": {
        "question": "Which is a more precise verb than ''went'' for a bird?",
        "options": [
          "very",
          "fluttered",
          "colourful",
          "branch"
        ],
        "correct_index": 1,
        "explanation": "Plain: ''The bird went to the branch.'' Revised: ''The spotted bird **fluttered** to the narrow branch.'' Nouns: bird, branch. Verb: fluttered. Adjectives: spotted, narrow. I can explain what each adds."
      }
    }
  ],
  "worked_example": "## Follow the complete example\n\nThe curious fox leapt over a fallen log. A bright beetle crawled beneath the leaves.\n\n**Step 1.** I ask ''Who or what appears?'' In our sentence: fox, log, beetle and leaves. These are nouns even if they are not all living things.\n\n**Step 2.** I ask ''What did the fox do?'' It *leapt*. What did the beetle do? It *crawled*. These are the doing words.\n\n**Step 3.** I draw an arrow from *curious* to *fox*. If I remove curious, the fox still exists in the sentence; we simply lose information about it.\n\n**Step 4.** Plain: ''The bird went to the branch.'' Revised: ''The spotted bird **fluttered** to the narrow branch.'' Nouns: bird, branch. Verb: fluttered. Adjectives: spotted, narrow. I can explain what each adds.\n\n**Self-check:** Explain which detail matters for your conclusion, and which alternative would be a misconception.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 620 220\"><rect width=\"620\" height=\"220\" rx=\"12\" fill=\"#f5f8f5\"/><text x=\"18\" y=\"34\" font-family=\"Arial\" font-size=\"21\" fill=\"#203f33\">WORD CLASSES</text><rect x=\"16\" y=\"66\" width=\"111\" height=\"112\" rx=\"8\" fill=\"#d9ebdf\"/><text x=\"24\" y=\"120\" font-family=\"Arial\" font-size=\"12\" fill=\"#18382b\">NOUN</text><rect x=\"137\" y=\"66\" width=\"111\" height=\"112\" rx=\"8\" fill=\"#e6ecf8\"/><text x=\"145\" y=\"120\" font-family=\"Arial\" font-size=\"12\" fill=\"#18382b\">VERB</text><rect x=\"258\" y=\"66\" width=\"111\" height=\"112\" rx=\"8\" fill=\"#d9ebdf\"/><text x=\"266\" y=\"120\" font-family=\"Arial\" font-size=\"12\" fill=\"#18382b\">ADJECTIVE</text><rect x=\"379\" y=\"66\" width=\"111\" height=\"112\" rx=\"8\" fill=\"#e6ecf8\"/><text x=\"387\" y=\"120\" font-family=\"Arial\" font-size=\"12\" fill=\"#18382b\">BUILD</text><rect x=\"500\" y=\"66\" width=\"111\" height=\"112\" rx=\"8\" fill=\"#d9ebdf\"/><text x=\"508\" y=\"120\" font-family=\"Arial\" font-size=\"12\" fill=\"#18382b\">CHECK</text></svg>",
      "alt": "Five labelled stages of word classes: NOUN, VERB, ADJECTIVE, BUILD, CHECK.",
      "caption": "Use the word classes process as a reminder while working through the task."
    }
  ],
  "guided_practice": "**Try this new text:** ''The sleepy dog chased a noisy truck. The frightened cat hid under the porch.''\n\n1. Write four nouns you see.\n2. Underline the three actions *chased*, *hid* and one more verb you make in a new sentence.\n3. Match sleepy, noisy and frightened to the correct nouns.\n4. Improve ''The animal moved'' with one precise noun, one action verb and one meaningful adjective.\n\n**Feedback:** Nouns include dog, truck, cat and porch. *Chased* and *hid* are the passage''s verbs; your third verb will come from your new sentence. Sleepy→dog, noisy→truck, frightened→cat. A possible revision is ''The startled rabbit darted behind the hedge.'' Rabbit and hedge are nouns; darted is the verb; startled describes rabbit.",
  "independent_task": "**Sentence laboratory:** Rewrite ''The animal went near the place'' as two interesting, clear sentences about an animal in a garden. For each sentence identify at least two nouns, one verb and one adjective. Then improve one weak verb and explain why the replacement paints a clearer picture. Finally classify all the underlined words in: ''The **silver** fish **darted** around the **rock**.''",
  "response_prompt": "Complete the original word classes task in your own words. Include reasoning and one improvement.",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "In ''A robin sang beside the fence'', which is a noun?",
      "options": [
        "sang",
        "beside",
        "robin",
        "a"
      ],
      "correct_index": 2,
      "explanation": "Robin names a bird."
    },
    {
      "type": "multiple_choice",
      "question": "Which word is a verb in ''The lizard scurried away''?",
      "options": [
        "lizard",
        "scurried",
        "the",
        "away"
      ],
      "correct_index": 1,
      "explanation": "Scurried describes the action."
    },
    {
      "type": "multiple_choice",
      "question": "Which word describes a noun in ''The golden leaf fell''?",
      "options": [
        "fell",
        "leaf",
        "the",
        "golden"
      ],
      "correct_index": 3,
      "explanation": "Golden describes leaf."
    },
    {
      "type": "multiple_choice",
      "question": "Which pair contains only nouns?",
      "options": [
        "jump, green",
        "tree, river",
        "quiet, quick",
        "ran, curled"
      ],
      "correct_index": 1,
      "explanation": "Tree and river name things or places."
    },
    {
      "type": "multiple_choice",
      "question": "Which is a strong action verb for a mouse?",
      "options": [
        "tiny",
        "the",
        "scurried",
        "brown"
      ],
      "correct_index": 2,
      "explanation": "Scurried shows how the mouse moved."
    },
    {
      "type": "multiple_choice",
      "question": "In ''The old gate creaked'', what does old describe?",
      "options": [
        "gate",
        "creaked",
        "the",
        "nothing"
      ],
      "correct_index": 0,
      "explanation": "Old describes gate."
    },
    {
      "type": "multiple_choice",
      "question": "Which revised sentence contains noun, verb and adjective?",
      "options": [
        "Softly and quickly.",
        "The striped cat pounced.",
        "Very very bright.",
        "Near the house."
      ],
      "correct_index": 1,
      "explanation": "Cat is a noun, pounced a verb and striped an adjective."
    },
    {
      "type": "multiple_choice",
      "question": "What is the verb in ''The beetle is tiny''?",
      "options": [
        "beetle",
        "tiny",
        "the",
        "is"
      ],
      "correct_index": 3,
      "explanation": "Is is a state-of-being verb."
    },
    {
      "type": "short_answer",
      "question": "Complete the core word classes challenge with evidence and a clear explanation.",
      "sample_answer": "Sentence 1: The spotted possum scrambled up a tree. Nouns: possum, tree. Verb: scrambled. Adjective: spotted. Sentence 2: A curious kookaburra perched on the branch. Nouns: kookaburra, branch. Verb: perched. Adjective: curious.",
      "marking_guide": "Check all requested parts, accuracy, and a reason based on the original source or worked method.",
      "explanation": "A full response uses concrete relevant evidence, not only a named concept."
    },
    {
      "type": "short_answer",
      "question": "Explain an error to avoid or a meaningful improvement in your word classes work.",
      "sample_answer": "In ''The silver fish darted around the rock,'' silver is an adjective, darted is a verb and rock is a noun. I changed went to scrambled because it shows the possum climbed quickly.",
      "marking_guide": "Require a correct topic-specific explanation that distinguishes evidence from guessing.",
      "explanation": "Checking the actual examples improves accuracy."
    }
  ],
  "parent_notes": "Parent: **What to observe.** Ask the learner to explain the topic using the original example without reading the model word for word. Ask one probing question before supplying a correction.\n\nParent: **Written quiz model 1.** Sentence 1: The spotted possum scrambled up a tree. Nouns: possum, tree. Verb: scrambled. Adjective: spotted. Sentence 2: A curious kookaburra perched on the branch. Nouns: kookaburra, branch. Verb: perched. Adjective: curious.\n\nParent: **Written quiz model 2.** In ''The silver fish darted around the rock,'' silver is an adjective, darted is a verb and rock is a noun. I changed went to scrambled because it shows the possum climbed quickly.\n\nParent: **Evidence and marking.** Collect the independent work and any revision. The eight machine-scored MCQs require eight correct for the 90% threshold; inspect the two written responses yourself. Verify syllabus outcome codes separately before approval.",
  "evidence_instructions": "Save the guided practice, completed word classes task, specific improvement, and two written quiz answers.",
  "offline_alternative": "Work from the printed original example and instructions on paper. Explain answers orally to a parent if needed; keep brief notes as evidence.",
  "extension": "Construct a different example that tests a tricky point in word classes; explain how you would check it.",
  "stage_hints": {
    "accept": [
      "Read the mission about word classes. You will learn before being assessed.",
      "First study the original example, then practise with feedback.",
      "Use paper or typing; focus on explaining each choice clearly."
    ],
    "teach0": [
      "Look for the feature described in the first teaching step.",
      "Find the exact word, number or action in the example that supports it.",
      "Say how the detail demonstrates the first concept; check it against the model."
    ],
    "teach1": [
      "Revisit the second teaching idea for word classes.",
      "Use the model to identify what changed from the first step.",
      "Explain the second step using an original piece of evidence."
    ],
    "teach2": [
      "Find the practice task that uses the third teaching point.",
      "Work through the example slowly and record each decision.",
      "Check whether each action follows from the given facts rather than an assumption."
    ],
    "teach3": [
      "Review the last principle and identify what it checks.",
      "Test your answer against the original example, not just a guess.",
      "Revise one inaccurate detail and explain the effect of that revision."
    ],
    "learn": [
      "Use the visual diagram as a reminder of the word classes sequence.",
      "Reread the model before checking the next case.",
      "Describe why the demonstrated method works in your own words."
    ],
    "guided": [
      "Break the practice into its numbered questions.",
      "Compare each attempt with the provided feedback; mark one correction.",
      "Try the same method on the next question without looking at the answer first."
    ],
    "write": [
      "Read every part of the word classes challenge before writing.",
      "Write the working or evidence beside the answer.",
      "Finish with an explanation of a real revision or error to avoid."
    ],
    "quiz": [
      "Each question tests a detail of word classes; reread the example if needed.",
      "Cross out options inconsistent with the story, rule or calculation.",
      "For written answers, provide your own working and compare it with the teaching."
    ],
    "submit": [
      "Check that every part of the independent task is complete.",
      "Check your evidence or working rather than just counting answers.",
      "Save your work and one meaningful correction before submission."
    ]
  }
}'),updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE seed_key='s2-eng-y3-w02-l3';

-- s2-eng-y3-w02-l4
UPDATE lessons SET title='Retell It Clearly: The Story Guide', data=json_patch(data,'{
  "seed_key": "s2-eng-y3-w02-l4",
  "title": "Retell It Clearly: The Story Guide",
  "stage": "Stage 2",
  "learning_area": "English",
  "year_level": 3,
  "week": 2,
  "lesson_number": 4,
  "duration_minutes": 60,
  "child_mission": "Become a oral retelling detective: learn the method, check original stories or numbers, then explain an independent challenge.",
  "learning_intention": "We are learning to apply oral retelling with clear reasons and accurate evidence.",
  "success_criteria": [
    "I can explain the idea using an original example.",
    "I can follow a model and identify why each step works.",
    "I can answer guided practice with feedback.",
    "I can complete an independent example using the lesson method.",
    "I can check my answer and explain one correction."
  ],
  "materials": [
    "All original teaching and examples are inside this lesson.",
    "Optional paper and pencil for drawing or annotating."
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
  "interactive_activities": [
    {
      "type": "flip_cards",
      "title": "oral retelling concept cards",
      "cards": [
        {
          "front": "Understand the whole story first",
          "back": "A **retelling** communicates the important events of a story in your own words. It is not memorising every sentence. Read or listen once for the whole meaning, then identify the main person and situation."
        },
        {
          "front": "Retell in beginning-middle-end order",
          "back": "A listener needs connected events in the order they happened. Start by naming the character and setting; then explain the problem and response; finish with the result. Avoid jumping to the ending first."
        },
        {
          "front": "Use linking words and accurate details",
          "back": "Words such as **first**, **then**, **because** and **finally** help a listener follow causes and order. Keep details that matter; do not invent motives or actions. Say *the wind snapped the string*, not *someone cut it*."
        },
        {
          "front": "Speak clearly, then check and improve",
          "back": "An oral retelling uses a comfortable pace, audible words and a short pause between important events. If speaking aloud isn''t suitable, a typed or signed retelling still demonstrates sequence and understanding. Check accuracy against the source."
        }
      ]
    }
  ],
  "printable_resource": {
    "title": "oral retelling learning sheet",
    "instructions": "Work through the original example, answer the guided questions, and complete the independent challenge.",
    "passage": "After breakfast, Ravi carried a kite to the oval. A gust snapped its string. Ravi caught the kite by the fence, tied a stronger knot and flew it again.",
    "prompts": [
      "Identify the central idea and supporting details.",
      "Explain the method with one worked example.",
      "Complete the independent challenge.",
      "Record one correction or further question."
    ]
  },
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "🔎",
      "title": "Understand the whole story first",
      "explain": "**Learn the concept.** A **retelling** communicates the important events of a story in your own words. It is not memorising every sentence. Read or listen once for the whole meaning, then identify the main person and situation.\n\n**Our shared example:** After breakfast, Ravi carried a kite to the oval. A gust snapped its string. Ravi caught the kite by the fence, tied a stronger knot and flew it again.\n\n**Notice:** Focus on the exact words, events or quantities rather than an unsupported guess.",
      "example": "**WATCH MY THINKING**\nI read Ravi''s story all the way through. I know Ravi is the character, the oval is the place and the broken kite string is the problem. Now I can plan what to say.\n\n**TRY A NEW CASE**\n**The Clocktower Message:** ''Before lunch, Lila visited the old clocktower with her brother Max. A note for the museum guide blew out of her pocket. Lila chased it across the square, but it landed under a bench. Max held the bench-side branch aside while Lila reached the note. They gave it to the guide before the tour began.'' Prepare a three-to-five sentence retelling in your own words. Use two order words, include the important problem and solution, and avoid adding an event not stated. Practise aloud or submit a written or signed alternative. Explain one improvement after checking the original.\n\n**CHECK YOUR THINKING**\nReread the teaching point. Explain why the example uses this rule and identify a common mistake.",
      "notice": "A **retelling** communicates the important events of a story in your own words. It is not memorising every sentence. Read or listen once for the whole meaning, then identify the main person and situation. Compare your conclusion with the original evidence.",
      "check": {
        "question": "What happens first in Ravi''s story?",
        "options": [
          "The kite flies again.",
          "Ravi takes the kite to the oval.",
          "The string snaps.",
          "The knot is tied."
        ],
        "correct_index": 1,
        "explanation": "I read Ravi''s story all the way through. I know Ravi is the character, the oval is the place and the broken kite string is the problem. Now I can plan what to say."
      },
      "visual_before": [
        {
          "episode": {
            "title": "A oral retelling clue",
            "transcript": "Pip: Ravi flew his kite again! I will start my retelling with that.\nJuno: That is the ending. First introduce Ravi and where he went.\nPip: Then the string broke, he caught the kite and tied a new knot.\nJuno: Good. Pause and try a three-sentence retelling in order.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "Ravi flew his kite again! I will start my retelling with that.",
                    "pause_after": false
                  },
                  {
                    "who": "juno",
                    "text": "That is the ending. First introduce Ravi and where he went.",
                    "pause_after": false
                  },
                  {
                    "who": "pip",
                    "text": "Then the string broke, he caught the kite and tied a new knot.",
                    "pause_after": false
                  },
                  {
                    "who": "juno",
                    "text": "Good. Pause and try a three-sentence retelling in order.",
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
      "icon": "🧠",
      "title": "Retell in beginning-middle-end order",
      "explain": "**Learn the concept.** A listener needs connected events in the order they happened. Start by naming the character and setting; then explain the problem and response; finish with the result. Avoid jumping to the ending first.\n\n**Our shared example:** After breakfast, Ravi carried a kite to the oval. A gust snapped its string. Ravi caught the kite by the fence, tied a stronger knot and flew it again.\n\n**Notice:** Focus on the exact words, events or quantities rather than an unsupported guess.",
      "example": "**WATCH MY THINKING**\nI say: ''After breakfast, Ravi took a kite to the oval. The string broke, so he caught it and tied a stronger knot. Then he flew it again.'' This keeps the plot without copying every word.\n\n**TRY A NEW CASE**\n**The Clocktower Message:** ''Before lunch, Lila visited the old clocktower with her brother Max. A note for the museum guide blew out of her pocket. Lila chased it across the square, but it landed under a bench. Max held the bench-side branch aside while Lila reached the note. They gave it to the guide before the tour began.'' Prepare a three-to-five sentence retelling in your own words. Use two order words, include the important problem and solution, and avoid adding an event not stated. Practise aloud or submit a written or signed alternative. Explain one improvement after checking the original.\n\n**CHECK YOUR THINKING**\nReread the teaching point. Explain why the example uses this rule and identify a common mistake.",
      "notice": "A listener needs connected events in the order they happened. Start by naming the character and setting; then explain the problem and response; finish with the result. Avoid jumping to the ending first. Compare your conclusion with the original evidence.",
      "check": {
        "question": "Which event follows the string snapping?",
        "options": [
          "Ravi catches the kite near the fence.",
          "He has breakfast the next day.",
          "The story begins again.",
          "The oval disappears."
        ],
        "correct_index": 0,
        "explanation": "I say: ''After breakfast, Ravi took a kite to the oval. The string broke, so he caught it and tied a stronger knot. Then he flew it again.'' This keeps the plot without copying every word."
      }
    },
    {
      "icon": "✏️",
      "title": "Use linking words and accurate details",
      "explain": "**Learn the concept.** Words such as **first**, **then**, **because** and **finally** help a listener follow causes and order. Keep details that matter; do not invent motives or actions. Say *the wind snapped the string*, not *someone cut it*.\n\n**Our shared example:** After breakfast, Ravi carried a kite to the oval. A gust snapped its string. Ravi caught the kite by the fence, tied a stronger knot and flew it again.\n\n**Notice:** Focus on the exact words, events or quantities rather than an unsupported guess.",
      "example": "**WATCH MY THINKING**\nI join ideas: ''The string snapped **because** of a gust. **Then** Ravi caught the kite. **Finally** he flew it again.'' I can explain which word shows cause and which shows sequence.\n\n**TRY A NEW CASE**\n**The Clocktower Message:** ''Before lunch, Lila visited the old clocktower with her brother Max. A note for the museum guide blew out of her pocket. Lila chased it across the square, but it landed under a bench. Max held the bench-side branch aside while Lila reached the note. They gave it to the guide before the tour began.'' Prepare a three-to-five sentence retelling in your own words. Use two order words, include the important problem and solution, and avoid adding an event not stated. Practise aloud or submit a written or signed alternative. Explain one improvement after checking the original.\n\n**CHECK YOUR THINKING**\nReread the teaching point. Explain why the example uses this rule and identify a common mistake.",
      "notice": "Words such as **first**, **then**, **because** and **finally** help a listener follow causes and order. Keep details that matter; do not invent motives or actions. Say *the wind snapped the string*, not *someone cut it*. Compare your conclusion with the original evidence.",
      "check": {
        "question": "Which word best introduces the last event?",
        "options": [
          "Before",
          "Under",
          "Finally",
          "Unless"
        ],
        "correct_index": 2,
        "explanation": "I join ideas: ''The string snapped **because** of a gust. **Then** Ravi caught the kite. **Finally** he flew it again.'' I can explain which word shows cause and which shows sequence."
      }
    },
    {
      "icon": "✅",
      "title": "Speak clearly, then check and improve",
      "explain": "**Learn the concept.** An oral retelling uses a comfortable pace, audible words and a short pause between important events. If speaking aloud isn''t suitable, a typed or signed retelling still demonstrates sequence and understanding. Check accuracy against the source.\n\n**Our shared example:** After breakfast, Ravi carried a kite to the oval. A gust snapped its string. Ravi caught the kite by the fence, tied a stronger knot and flew it again.\n\n**Notice:** Focus on the exact words, events or quantities rather than an unsupported guess.",
      "example": "**WATCH MY THINKING**\nI practise my retelling, compare it with the story, notice I missed *the stronger knot*, and add it. I don''t need to perform dramatically; the goal is that someone can follow the events.\n\n**TRY A NEW CASE**\n**The Clocktower Message:** ''Before lunch, Lila visited the old clocktower with her brother Max. A note for the museum guide blew out of her pocket. Lila chased it across the square, but it landed under a bench. Max held the bench-side branch aside while Lila reached the note. They gave it to the guide before the tour began.'' Prepare a three-to-five sentence retelling in your own words. Use two order words, include the important problem and solution, and avoid adding an event not stated. Practise aloud or submit a written or signed alternative. Explain one improvement after checking the original.\n\n**CHECK YOUR THINKING**\nReread the teaching point. Explain why the example uses this rule and identify a common mistake.",
      "notice": "An oral retelling uses a comfortable pace, audible words and a short pause between important events. If speaking aloud isn''t suitable, a typed or signed retelling still demonstrates sequence and understanding. Check accuracy against the source. Compare your conclusion with the original evidence.",
      "check": {
        "question": "Which improvement makes Ravi''s retelling more accurate?",
        "options": [
          "Add an invented thunderstorm.",
          "Mention the stronger knot.",
          "Change Ravi to Mia.",
          "Say someone stole the kite."
        ],
        "correct_index": 1,
        "explanation": "I practise my retelling, compare it with the story, notice I missed *the stronger knot*, and add it. I don''t need to perform dramatically; the goal is that someone can follow the events."
      }
    }
  ],
  "worked_example": "## Follow the complete example\n\nAfter breakfast, Ravi carried a kite to the oval. A gust snapped its string. Ravi caught the kite by the fence, tied a stronger knot and flew it again.\n\n**Step 1.** I read Ravi''s story all the way through. I know Ravi is the character, the oval is the place and the broken kite string is the problem. Now I can plan what to say.\n\n**Step 2.** I say: ''After breakfast, Ravi took a kite to the oval. The string broke, so he caught it and tied a stronger knot. Then he flew it again.'' This keeps the plot without copying every word.\n\n**Step 3.** I join ideas: ''The string snapped **because** of a gust. **Then** Ravi caught the kite. **Finally** he flew it again.'' I can explain which word shows cause and which shows sequence.\n\n**Step 4.** I practise my retelling, compare it with the story, notice I missed *the stronger knot*, and add it. I don''t need to perform dramatically; the goal is that someone can follow the events.\n\n**Self-check:** Explain which detail matters for your conclusion, and which alternative would be a misconception.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 620 220\"><rect width=\"620\" height=\"220\" rx=\"12\" fill=\"#f5f8f5\"/><text x=\"18\" y=\"34\" font-family=\"Arial\" font-size=\"21\" fill=\"#203f33\">ORAL RETELLING</text><rect x=\"16\" y=\"66\" width=\"111\" height=\"112\" rx=\"8\" fill=\"#d9ebdf\"/><text x=\"24\" y=\"120\" font-family=\"Arial\" font-size=\"12\" fill=\"#18382b\">CHARACTER</text><rect x=\"137\" y=\"66\" width=\"111\" height=\"112\" rx=\"8\" fill=\"#e6ecf8\"/><text x=\"145\" y=\"120\" font-family=\"Arial\" font-size=\"12\" fill=\"#18382b\">SETTING</text><rect x=\"258\" y=\"66\" width=\"111\" height=\"112\" rx=\"8\" fill=\"#d9ebdf\"/><text x=\"266\" y=\"120\" font-family=\"Arial\" font-size=\"12\" fill=\"#18382b\">PROBLEM</text><rect x=\"379\" y=\"66\" width=\"111\" height=\"112\" rx=\"8\" fill=\"#e6ecf8\"/><text x=\"387\" y=\"120\" font-family=\"Arial\" font-size=\"12\" fill=\"#18382b\">ACTION</text><rect x=\"500\" y=\"66\" width=\"111\" height=\"112\" rx=\"8\" fill=\"#d9ebdf\"/><text x=\"508\" y=\"120\" font-family=\"Arial\" font-size=\"12\" fill=\"#18382b\">ENDING</text></svg>",
      "alt": "Five labelled stages of oral retelling: CHARACTER, SETTING, PROBLEM, ACTION, ENDING.",
      "caption": "Use the oral retelling process as a reminder while working through the task."
    }
  ],
  "guided_practice": "**New story:** ''In the morning, Nia packed a library book into her bag. On the bus, she noticed the zip was open and the book had slipped onto the seat. The driver kept it safe until the next stop. Nia thanked the driver and put the book in a zipped pocket.''\n\n1. Name the main character, time and setting.\n2. Write beginning, middle and ending as three short bullet-point notes.\n3. Rehearse a three-sentence retelling using *first*, *then* and *finally*.\n4. Compare your retelling with the original. Did the driver keep the book or did Nia find it on the road?\n\n**Feedback:** Nia; morning; bus. Beginning: Nia packs her book. Middle: she notices it slipped out and the driver protects it. Ending: she thanks the driver and puts it away securely. *No theft occurred* and the book was on the seat, not the road.",
  "independent_task": "**The Clocktower Message:** ''Before lunch, Lila visited the old clocktower with her brother Max. A note for the museum guide blew out of her pocket. Lila chased it across the square, but it landed under a bench. Max held the bench-side branch aside while Lila reached the note. They gave it to the guide before the tour began.'' Prepare a three-to-five sentence retelling in your own words. Use two order words, include the important problem and solution, and avoid adding an event not stated. Practise aloud or submit a written or signed alternative. Explain one improvement after checking the original.",
  "response_prompt": "Complete the original oral retelling task in your own words. Include reasoning and one improvement.",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "Who is the main character in The Clocktower Message?",
      "options": [
        "The bench",
        "Lila",
        "The guidebook",
        "The clock"
      ],
      "correct_index": 1,
      "explanation": "Lila acts to recover and deliver the note."
    },
    {
      "type": "multiple_choice",
      "question": "Where does the story take place?",
      "options": [
        "A seaside cave",
        "An airport",
        "A clocktower and nearby square",
        "A school hall"
      ],
      "correct_index": 2,
      "explanation": "The story takes place around the clocktower and square."
    },
    {
      "type": "multiple_choice",
      "question": "When does the story begin?",
      "options": [
        "After midnight",
        "Before lunch",
        "Next summer",
        "At sunrise"
      ],
      "correct_index": 1,
      "explanation": "The first words are Before lunch."
    },
    {
      "type": "multiple_choice",
      "question": "What causes the main problem?",
      "options": [
        "The note blows out of Lila''s pocket.",
        "Max forgets the tour.",
        "The guide disappears.",
        "The clock stops."
      ],
      "correct_index": 0,
      "explanation": "Wind blows the note out of Lila''s pocket."
    },
    {
      "type": "multiple_choice",
      "question": "What happens after the note lands under a bench?",
      "options": [
        "Lila goes home.",
        "The guide starts a new tour.",
        "Max moves the clock.",
        "Max moves a branch so Lila can reach it."
      ],
      "correct_index": 3,
      "explanation": "Max helps by holding the branch aside."
    },
    {
      "type": "multiple_choice",
      "question": "Which ending is accurate?",
      "options": [
        "The note is lost forever.",
        "They give the note to the guide before the tour.",
        "A stranger takes the note.",
        "The clocktower closes."
      ],
      "correct_index": 1,
      "explanation": "The narrator states that the note reaches the guide before the tour."
    },
    {
      "type": "multiple_choice",
      "question": "Which detail would be invented?",
      "options": [
        "Lila chased the note.",
        "The note was under a bench.",
        "A thief deliberately hid the note.",
        "Max helped Lila."
      ],
      "correct_index": 2,
      "explanation": "Nothing in the story supports a thief."
    },
    {
      "type": "multiple_choice",
      "question": "Which connective shows that events happened in order?",
      "options": [
        "Finally",
        "Although",
        "Because of",
        "Unless"
      ],
      "correct_index": 0,
      "explanation": "Finally signals the last stage of a retelling."
    },
    {
      "type": "short_answer",
      "question": "Complete the core oral retelling challenge with evidence and a clear explanation.",
      "sample_answer": "Before lunch Lila and Max went to the clocktower. Then the note blew from Lila''s pocket and landed under a bench. Max held a branch aside while Lila got it back. Finally, they delivered the note to the museum guide before the tour.",
      "marking_guide": "Check all requested parts, accuracy, and a reason based on the original source or worked method.",
      "explanation": "A full response uses concrete relevant evidence, not only a named concept."
    },
    {
      "type": "short_answer",
      "question": "Explain an error to avoid or a meaningful improvement in your oral retelling work.",
      "sample_answer": "I first forgot Max''s help. I added that he moved the branch so the listener can understand how Lila reached the note. I did not add a thief, because the wind blew it away.",
      "marking_guide": "Require a correct topic-specific explanation that distinguishes evidence from guessing.",
      "explanation": "Checking the actual examples improves accuracy."
    }
  ],
  "parent_notes": "Parent: **What to observe.** Ask the learner to explain the topic using the original example without reading the model word for word. Ask one probing question before supplying a correction.\n\nParent: **Written quiz model 1.** Before lunch Lila and Max went to the clocktower. Then the note blew from Lila''s pocket and landed under a bench. Max held a branch aside while Lila got it back. Finally, they delivered the note to the museum guide before the tour.\n\nParent: **Written quiz model 2.** I first forgot Max''s help. I added that he moved the branch so the listener can understand how Lila reached the note. I did not add a thief, because the wind blew it away.\n\nParent: **Evidence and marking.** Collect the independent work and any revision. The eight machine-scored MCQs require eight correct for the 90% threshold; inspect the two written responses yourself. Verify syllabus outcome codes separately before approval.",
  "evidence_instructions": "Save the guided practice, completed oral retelling task, specific improvement, and two written quiz answers.",
  "offline_alternative": "Work from the printed original example and instructions on paper. Explain answers orally to a parent if needed; keep brief notes as evidence.",
  "extension": "Construct a different example that tests a tricky point in oral retelling; explain how you would check it.",
  "stage_hints": {
    "accept": [
      "Read the mission about oral retelling. You will learn before being assessed.",
      "First study the original example, then practise with feedback.",
      "Use paper or typing; focus on explaining each choice clearly."
    ],
    "teach0": [
      "Look for the feature described in the first teaching step.",
      "Find the exact word, number or action in the example that supports it.",
      "Say how the detail demonstrates the first concept; check it against the model."
    ],
    "teach1": [
      "Revisit the second teaching idea for oral retelling.",
      "Use the model to identify what changed from the first step.",
      "Explain the second step using an original piece of evidence."
    ],
    "teach2": [
      "Find the practice task that uses the third teaching point.",
      "Work through the example slowly and record each decision.",
      "Check whether each action follows from the given facts rather than an assumption."
    ],
    "teach3": [
      "Review the last principle and identify what it checks.",
      "Test your answer against the original example, not just a guess.",
      "Revise one inaccurate detail and explain the effect of that revision."
    ],
    "learn": [
      "Use the visual diagram as a reminder of the oral retelling sequence.",
      "Reread the model before checking the next case.",
      "Describe why the demonstrated method works in your own words."
    ],
    "guided": [
      "Break the practice into its numbered questions.",
      "Compare each attempt with the provided feedback; mark one correction.",
      "Try the same method on the next question without looking at the answer first."
    ],
    "write": [
      "Read every part of the oral retelling challenge before writing.",
      "Write the working or evidence beside the answer.",
      "Finish with an explanation of a real revision or error to avoid."
    ],
    "quiz": [
      "Each question tests a detail of oral retelling; reread the example if needed.",
      "Cross out options inconsistent with the story, rule or calculation.",
      "For written answers, provide your own working and compare it with the teaching."
    ],
    "submit": [
      "Check that every part of the independent task is complete.",
      "Check your evidence or working rather than just counting answers.",
      "Save your work and one meaningful correction before submission."
    ]
  }
}'),updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE seed_key='s2-eng-y3-w02-l4';

-- s2-mat-y3-w02-l1
UPDATE lessons SET title='Rounding Detectives: Nearest Ten and Hundred', data=json_patch(data,'{
  "seed_key": "s2-mat-y3-w02-l1",
  "title": "Rounding Detectives: Nearest Ten and Hundred",
  "stage": "Stage 2",
  "learning_area": "Mathematics",
  "year_level": 3,
  "week": 2,
  "lesson_number": 1,
  "duration_minutes": 60,
  "child_mission": "Become a rounding to tens and hundreds detective: learn the method, check original stories or numbers, then explain an independent challenge.",
  "learning_intention": "We are learning to apply rounding to tens and hundreds with clear reasons and accurate evidence.",
  "success_criteria": [
    "I can explain the idea using an original example.",
    "I can follow a model and identify why each step works.",
    "I can answer guided practice with feedback.",
    "I can complete an independent example using the lesson method.",
    "I can check my answer and explain one correction."
  ],
  "materials": [
    "All original teaching and examples are inside this lesson.",
    "Optional paper and pencil for drawing or annotating."
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
  "interactive_activities": [
    {
      "type": "flip_cards",
      "title": "rounding to tens and hundreds concept cards",
      "cards": [
        {
          "front": "Locate the tens around a number",
          "back": "Rounding replaces a number with a nearby multiple of ten or a hundred. It gives an **approximation**, not an exact count. For 347, the nearest tens are 340 and 350."
        },
        {
          "front": "Use the halfway rule for tens",
          "back": "When the ones digit is 0–4, round down to the previous ten; 5–9, round up to the next ten. A number ending in five is exactly halfway between tens, and our classroom convention rounds it **up**."
        },
        {
          "front": "Round to the nearest hundred",
          "back": "Find the hundreds on either side, then judge the last two digits. 00–49 rounds to the lower hundred; 50–99 rounds to the higher hundred under the same tie rule."
        },
        {
          "front": "Check the purpose and reasonableness",
          "back": "A rounded result is useful when an exact figure would add unnecessary detail. You must label it **about** or **approximately**. Rounding to tens and rounding to hundreds can yield different, valid approximations."
        }
      ]
    }
  ],
  "printable_resource": {
    "title": "rounding to tens and hundreds learning sheet",
    "instructions": "Work through the original example, answer the guided questions, and complete the independent challenge.",
    "passage": "A school counts 347 visitors at the fete. A quick announcement says about 350 visitors, while a larger estimate says about 300.",
    "prompts": [
      "Identify the central idea and supporting details.",
      "Explain the method with one worked example.",
      "Complete the independent challenge.",
      "Record one correction or further question."
    ]
  },
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "🔎",
      "title": "Locate the tens around a number",
      "explain": "**Learn the concept.** Rounding replaces a number with a nearby multiple of ten or a hundred. It gives an **approximation**, not an exact count. For 347, the nearest tens are 340 and 350.\n\n**Our shared example:** A school counts 347 visitors at the fete. A quick announcement says about 350 visitors, while a larger estimate says about 300.\n\n**Notice:** Focus on the exact words, events or quantities rather than an unsupported guess.",
      "example": "**WATCH MY THINKING**\nI write 340 < 347 < 350. I compare distances: 347 is 7 away from 340 but only 3 away from 350. Therefore 347 rounds to **350** to the nearest ten.\n\n**TRY A NEW CASE**\n**Fete number board:** The organiser records 247 cupcakes, 365 raffle tickets and 582 visitors. For each count, give the nearest ten AND the nearest hundred. Show the two surrounding multiples for at least two calculations, explain why 365 becomes 370 to the nearest ten and 400 to the nearest hundred, then write two accurate announcements using the word *about*.\n\n**CHECK YOUR THINKING**\nReread the teaching point. Explain why the example uses this rule and identify a common mistake.",
      "notice": "Rounding replaces a number with a nearby multiple of ten or a hundred. It gives an **approximation**, not an exact count. For 347, the nearest tens are 340 and 350. Compare your conclusion with the original evidence.",
      "check": {
        "question": "Which two tens surround 347?",
        "options": [
          "300 and 400",
          "340 and 350",
          "347 and 350",
          "345 and 355"
        ],
        "correct_index": 1,
        "explanation": "I write 340 < 347 < 350. I compare distances: 347 is 7 away from 340 but only 3 away from 350. Therefore 347 rounds to **350** to the nearest ten."
      },
      "visual_before": [
        {
          "episode": {
            "title": "A rounding to tens and hundreds clue",
            "transcript": "Pip: There were 347 people. Can I tell everyone exactly 350?\nJuno: Not exactly. Rounding is an estimate. Find the tens around 347.\nPip: Three hundred forty and three hundred fifty. It is closer to 350!\nJuno: Good. Pause and round 347 to the nearest hundred as well.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "There were 347 people. Can I tell everyone exactly 350?",
                    "pause_after": false
                  },
                  {
                    "who": "juno",
                    "text": "Not exactly. Rounding is an estimate. Find the tens around 347.",
                    "pause_after": false
                  },
                  {
                    "who": "pip",
                    "text": "Three hundred forty and three hundred fifty. It is closer to 350!",
                    "pause_after": false
                  },
                  {
                    "who": "juno",
                    "text": "Good. Pause and round 347 to the nearest hundred as well.",
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
      "icon": "🧠",
      "title": "Use the halfway rule for tens",
      "explain": "**Learn the concept.** When the ones digit is 0–4, round down to the previous ten; 5–9, round up to the next ten. A number ending in five is exactly halfway between tens, and our classroom convention rounds it **up**.\n\n**Our shared example:** A school counts 347 visitors at the fete. A quick announcement says about 350 visitors, while a larger estimate says about 300.\n\n**Notice:** Focus on the exact words, events or quantities rather than an unsupported guess.",
      "example": "**WATCH MY THINKING**\n345 is between 340 and 350 and five from each. Under the usual half-up rule it becomes 350. For 342, the ones digit 2 means 340 is closer.\n\n**TRY A NEW CASE**\n**Fete number board:** The organiser records 247 cupcakes, 365 raffle tickets and 582 visitors. For each count, give the nearest ten AND the nearest hundred. Show the two surrounding multiples for at least two calculations, explain why 365 becomes 370 to the nearest ten and 400 to the nearest hundred, then write two accurate announcements using the word *about*.\n\n**CHECK YOUR THINKING**\nReread the teaching point. Explain why the example uses this rule and identify a common mistake.",
      "notice": "When the ones digit is 0–4, round down to the previous ten; 5–9, round up to the next ten. A number ending in five is exactly halfway between tens, and our classroom convention rounds it **up**. Compare your conclusion with the original evidence.",
      "check": {
        "question": "What is 265 rounded to the nearest ten?",
        "options": [
          "260",
          "270",
          "300",
          "250"
        ],
        "correct_index": 1,
        "explanation": "345 is between 340 and 350 and five from each. Under the usual half-up rule it becomes 350. For 342, the ones digit 2 means 340 is closer."
      }
    },
    {
      "icon": "✏️",
      "title": "Round to the nearest hundred",
      "explain": "**Learn the concept.** Find the hundreds on either side, then judge the last two digits. 00–49 rounds to the lower hundred; 50–99 rounds to the higher hundred under the same tie rule.\n\n**Our shared example:** A school counts 347 visitors at the fete. A quick announcement says about 350 visitors, while a larger estimate says about 300.\n\n**Notice:** Focus on the exact words, events or quantities rather than an unsupported guess.",
      "example": "**WATCH MY THINKING**\n347 sits between 300 and 400. It is 47 from 300 and 53 from 400, so nearest hundred is **300**. For 368, 400 is closer, so round to 400.\n\n**TRY A NEW CASE**\n**Fete number board:** The organiser records 247 cupcakes, 365 raffle tickets and 582 visitors. For each count, give the nearest ten AND the nearest hundred. Show the two surrounding multiples for at least two calculations, explain why 365 becomes 370 to the nearest ten and 400 to the nearest hundred, then write two accurate announcements using the word *about*.\n\n**CHECK YOUR THINKING**\nReread the teaching point. Explain why the example uses this rule and identify a common mistake.",
      "notice": "Find the hundreds on either side, then judge the last two digits. 00–49 rounds to the lower hundred; 50–99 rounds to the higher hundred under the same tie rule. Compare your conclusion with the original evidence.",
      "check": {
        "question": "What is 368 rounded to the nearest hundred?",
        "options": [
          "300",
          "360",
          "400",
          "370"
        ],
        "correct_index": 2,
        "explanation": "347 sits between 300 and 400. It is 47 from 300 and 53 from 400, so nearest hundred is **300**. For 368, 400 is closer, so round to 400."
      }
    },
    {
      "icon": "✅",
      "title": "Check the purpose and reasonableness",
      "explain": "**Learn the concept.** A rounded result is useful when an exact figure would add unnecessary detail. You must label it **about** or **approximately**. Rounding to tens and rounding to hundreds can yield different, valid approximations.\n\n**Our shared example:** A school counts 347 visitors at the fete. A quick announcement says about 350 visitors, while a larger estimate says about 300.\n\n**Notice:** Focus on the exact words, events or quantities rather than an unsupported guess.",
      "example": "**WATCH MY THINKING**\nAt the fete the exact count is 347. ''About 350'' (nearest ten) and ''about 300'' (nearest hundred) are both correct with their stated precision. Saying ''Exactly 300 visited'' would be false.\n\n**TRY A NEW CASE**\n**Fete number board:** The organiser records 247 cupcakes, 365 raffle tickets and 582 visitors. For each count, give the nearest ten AND the nearest hundred. Show the two surrounding multiples for at least two calculations, explain why 365 becomes 370 to the nearest ten and 400 to the nearest hundred, then write two accurate announcements using the word *about*.\n\n**CHECK YOUR THINKING**\nReread the teaching point. Explain why the example uses this rule and identify a common mistake.",
      "notice": "A rounded result is useful when an exact figure would add unnecessary detail. You must label it **about** or **approximately**. Rounding to tens and rounding to hundreds can yield different, valid approximations. Compare your conclusion with the original evidence.",
      "check": {
        "question": "Which statement correctly reports 347 rounded to tens?",
        "options": [
          "Exactly 350 people attended.",
          "About 350 people attended.",
          "Only 300 people attended.",
          "347 is the same as 300."
        ],
        "correct_index": 1,
        "explanation": "At the fete the exact count is 347. ''About 350'' (nearest ten) and ''about 300'' (nearest hundred) are both correct with their stated precision. Saying ''Exactly 300 visited'' would be false."
      }
    }
  ],
  "worked_example": "## Follow the complete example\n\nA school counts 347 visitors at the fete. A quick announcement says about 350 visitors, while a larger estimate says about 300.\n\n**Step 1.** I write 340 < 347 < 350. I compare distances: 347 is 7 away from 340 but only 3 away from 350. Therefore 347 rounds to **350** to the nearest ten.\n\n**Step 2.** 345 is between 340 and 350 and five from each. Under the usual half-up rule it becomes 350. For 342, the ones digit 2 means 340 is closer.\n\n**Step 3.** 347 sits between 300 and 400. It is 47 from 300 and 53 from 400, so nearest hundred is **300**. For 368, 400 is closer, so round to 400.\n\n**Step 4.** At the fete the exact count is 347. ''About 350'' (nearest ten) and ''about 300'' (nearest hundred) are both correct with their stated precision. Saying ''Exactly 300 visited'' would be false.\n\n**Self-check:** Explain which detail matters for your conclusion, and which alternative would be a misconception.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 620 220\"><rect width=\"620\" height=\"220\" rx=\"12\" fill=\"#f5f8f5\"/><text x=\"18\" y=\"34\" font-family=\"Arial\" font-size=\"21\" fill=\"#203f33\">ROUNDING TO TENS AND HUNDREDS</text><rect x=\"16\" y=\"66\" width=\"111\" height=\"112\" rx=\"8\" fill=\"#d9ebdf\"/><text x=\"24\" y=\"120\" font-family=\"Arial\" font-size=\"12\" fill=\"#18382b\">NUMBER</text><rect x=\"137\" y=\"66\" width=\"111\" height=\"112\" rx=\"8\" fill=\"#e6ecf8\"/><text x=\"145\" y=\"120\" font-family=\"Arial\" font-size=\"12\" fill=\"#18382b\">LOWER</text><rect x=\"258\" y=\"66\" width=\"111\" height=\"112\" rx=\"8\" fill=\"#d9ebdf\"/><text x=\"266\" y=\"120\" font-family=\"Arial\" font-size=\"12\" fill=\"#18382b\">MIDPOINT</text><rect x=\"379\" y=\"66\" width=\"111\" height=\"112\" rx=\"8\" fill=\"#e6ecf8\"/><text x=\"387\" y=\"120\" font-family=\"Arial\" font-size=\"12\" fill=\"#18382b\">HIGHER</text><rect x=\"500\" y=\"66\" width=\"111\" height=\"112\" rx=\"8\" fill=\"#d9ebdf\"/><text x=\"508\" y=\"120\" font-family=\"Arial\" font-size=\"12\" fill=\"#18382b\">ROUND</text></svg>",
      "alt": "Five labelled stages of rounding to tens and hundreds: NUMBER, LOWER, MIDPOINT, HIGHER, ROUND.",
      "caption": "Use the rounding to tens and hundreds process as a reminder while working through the task."
    }
  ],
  "guided_practice": "**Let''s round four new numbers.**\n\n1. 182 to the nearest ten: identify 180 and 190. Distances are 2 and 8, so the answer is **180**.\n2. 185 to the nearest ten: midpoint between 180 and 190; by the half-up rule the answer is **190**.\n3. 649 to the nearest hundred: nearest hundreds are 600 and 700; distance 49 to 600 and 51 to 700, so **600**.\n4. 650 to the nearest hundred: halfway; by the half-up rule **700**.\n\n**Now try independently before checking:** 274 to nearest ten (**270**); 278 to nearest ten (**280**); 951 to nearest hundred (**1000**).\n\n**Common trap:** Do not round a number first to a ten and then again to a hundred if asked to round directly to a hundred; look at the original number.",
  "independent_task": "**Fete number board:** The organiser records 247 cupcakes, 365 raffle tickets and 582 visitors. For each count, give the nearest ten AND the nearest hundred. Show the two surrounding multiples for at least two calculations, explain why 365 becomes 370 to the nearest ten and 400 to the nearest hundred, then write two accurate announcements using the word *about*.",
  "response_prompt": "Complete the original rounding to tens and hundreds task in your own words. Include reasoning and one improvement.",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "What is 247 rounded to the nearest ten?",
      "options": [
        "240",
        "250",
        "200",
        "300"
      ],
      "correct_index": 1,
      "explanation": "247 is three away from 250 and seven from 240."
    },
    {
      "type": "multiple_choice",
      "question": "What is 247 rounded to the nearest hundred?",
      "options": [
        "200",
        "250",
        "300",
        "240"
      ],
      "correct_index": 0,
      "explanation": "247 is 47 away from 200 and 53 from 300."
    },
    {
      "type": "multiple_choice",
      "question": "What is 365 rounded to the nearest ten?",
      "options": [
        "360",
        "400",
        "370",
        "300"
      ],
      "correct_index": 2,
      "explanation": "The ones digit is five, so 365 rounds up to 370."
    },
    {
      "type": "multiple_choice",
      "question": "What is 365 rounded to the nearest hundred?",
      "options": [
        "300",
        "370",
        "360",
        "400"
      ],
      "correct_index": 3,
      "explanation": "365 is closer to 400 than 300."
    },
    {
      "type": "multiple_choice",
      "question": "What is 582 rounded to the nearest ten?",
      "options": [
        "590",
        "580",
        "500",
        "600"
      ],
      "correct_index": 1,
      "explanation": "582 is two from 580 and eight from 590."
    },
    {
      "type": "multiple_choice",
      "question": "What is 582 rounded to the nearest hundred?",
      "options": [
        "500",
        "580",
        "600",
        "590"
      ],
      "correct_index": 2,
      "explanation": "582 is 18 from 600 and 82 from 500."
    },
    {
      "type": "multiple_choice",
      "question": "What is 450 rounded to the nearest hundred under the half-up rule?",
      "options": [
        "400",
        "450",
        "500",
        "460"
      ],
      "correct_index": 2,
      "explanation": "450 is halfway and rounds up to 500 under the stated convention."
    },
    {
      "type": "multiple_choice",
      "question": "Which announcement is a correct nearest-hundred estimate of 582 visitors?",
      "options": [
        "Exactly 600 visitors",
        "About 600 visitors",
        "About 580 visitors to the nearest hundred",
        "Only 500 visitors"
      ],
      "correct_index": 1,
      "explanation": "The nearest hundred is 600 and it should be described as approximate."
    },
    {
      "type": "short_answer",
      "question": "Complete the core rounding to tens and hundreds challenge with evidence and a clear explanation.",
      "sample_answer": "247 rounds to 250 (nearest ten) and 200 (nearest hundred); 365 rounds to 370 and 400; 582 rounds to 580 and 600. For 247, the neighbouring tens are 240 and 250 and the hundreds are 200 and 300.",
      "marking_guide": "Check all requested parts, accuracy, and a reason based on the original source or worked method.",
      "explanation": "A full response uses concrete relevant evidence, not only a named concept."
    },
    {
      "type": "short_answer",
      "question": "Explain an error to avoid or a meaningful improvement in your rounding to tens and hundreds work.",
      "sample_answer": "365 lies halfway between 360 and 370? No: it lies halfway between these tens, so under the half-up rule it becomes 370. It is 35 from 400 and 65 from 300, so to the nearest hundred it becomes 400. We could say ''About 600 visitors came'' and ''About 250 cupcakes were sold'', identifying the chosen rounding precision.",
      "marking_guide": "Require a correct topic-specific explanation that distinguishes evidence from guessing.",
      "explanation": "Checking the actual examples improves accuracy."
    }
  ],
  "parent_notes": "Parent: **What to observe.** Ask the learner to explain the topic using the original example without reading the model word for word. Ask one probing question before supplying a correction.\n\nParent: **Written quiz model 1.** 247 rounds to 250 (nearest ten) and 200 (nearest hundred); 365 rounds to 370 and 400; 582 rounds to 580 and 600. For 247, the neighbouring tens are 240 and 250 and the hundreds are 200 and 300.\n\nParent: **Written quiz model 2.** 365 lies halfway between 360 and 370? No: it lies halfway between these tens, so under the half-up rule it becomes 370. It is 35 from 400 and 65 from 300, so to the nearest hundred it becomes 400. We could say ''About 600 visitors came'' and ''About 250 cupcakes were sold'', identifying the chosen rounding precision.\n\nParent: **Evidence and marking.** Collect the independent work and any revision. The eight machine-scored MCQs require eight correct for the 90% threshold; inspect the two written responses yourself. Verify syllabus outcome codes separately before approval.",
  "evidence_instructions": "Save the guided practice, completed rounding to tens and hundreds task, specific improvement, and two written quiz answers.",
  "offline_alternative": "Work from the printed original example and instructions on paper. Explain answers orally to a parent if needed; keep brief notes as evidence.",
  "extension": "Construct a different example that tests a tricky point in rounding to tens and hundreds; explain how you would check it.",
  "stage_hints": {
    "accept": [
      "Read the mission about rounding to tens and hundreds. You will learn before being assessed.",
      "First study the original example, then practise with feedback.",
      "Use paper or typing; focus on explaining each choice clearly."
    ],
    "teach0": [
      "Look for the feature described in the first teaching step.",
      "Find the exact word, number or action in the example that supports it.",
      "Say how the detail demonstrates the first concept; check it against the model."
    ],
    "teach1": [
      "Revisit the second teaching idea for rounding to tens and hundreds.",
      "Use the model to identify what changed from the first step.",
      "Explain the second step using an original piece of evidence."
    ],
    "teach2": [
      "Find the practice task that uses the third teaching point.",
      "Work through the example slowly and record each decision.",
      "Check whether each action follows from the given facts rather than an assumption."
    ],
    "teach3": [
      "Review the last principle and identify what it checks.",
      "Test your answer against the original example, not just a guess.",
      "Revise one inaccurate detail and explain the effect of that revision."
    ],
    "learn": [
      "Use the visual diagram as a reminder of the rounding to tens and hundreds sequence.",
      "Reread the model before checking the next case.",
      "Describe why the demonstrated method works in your own words."
    ],
    "guided": [
      "Break the practice into its numbered questions.",
      "Compare each attempt with the provided feedback; mark one correction.",
      "Try the same method on the next question without looking at the answer first."
    ],
    "write": [
      "Read every part of the rounding to tens and hundreds challenge before writing.",
      "Write the working or evidence beside the answer.",
      "Finish with an explanation of a real revision or error to avoid."
    ],
    "quiz": [
      "Each question tests a detail of rounding to tens and hundreds; reread the example if needed.",
      "Cross out options inconsistent with the story, rule or calculation.",
      "For written answers, provide your own working and compare it with the teaching."
    ],
    "submit": [
      "Check that every part of the independent task is complete.",
      "Check your evidence or working rather than just counting answers.",
      "Save your work and one meaningful correction before submission."
    ]
  }
}'),updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE seed_key='s2-mat-y3-w02-l1';
