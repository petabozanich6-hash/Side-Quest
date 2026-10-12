-- Gold Standard v2 depth rebuild: Y3 English W3 L2-L4 and Maths W3 L1.

-- s2-eng-y3-w03-l2
UPDATE lessons SET title='Story Builders: Orientation and Complication',data=json_patch(data,'{
  "seed_key": "s2-eng-y3-w03-l2",
  "title": "Story Builders: Orientation and Complication",
  "stage": "Stage 2",
  "learning_area": "English",
  "year_level": 3,
  "week": 3,
  "lesson_number": 2,
  "duration_minutes": 60,
  "child_mission": "Explore story builders: orientation and complication through original stories or numbers, guided practice and an independent mission.",
  "learning_intention": "We are learning to explain and apply story builders: orientation and complication with evidence or working.",
  "success_criteria": [
    "I can explain the central idea in my own words.",
    "I can follow a model and say why its steps work.",
    "I can complete guided practice and correct a mistake.",
    "I can solve the new independent challenge.",
    "I can give a reason for my final answer."
  ],
  "materials": [
    "All original reading and calculations are included.",
    "Optional paper and pencil for annotation."
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
      "title": "Recall the four key ideas",
      "cards": [
        {
          "front": "Introduce the orientation",
          "back": "An **orientation** gives the reader a starting point: who is involved, where they are, when the scene happens and sometimes what the character wants. Not every opening includes every detail, but readers need enough information to follow what comes next."
        },
        {
          "front": "Recognise the complication",
          "back": "A **complication** is the problem that interrupts a character''s goal. The problem should matter to the character, even if it looks small to somebody else. A change in weather may be part of the problem, but ask what the change actually causes."
        },
        {
          "front": "Show how the problem changes the action",
          "back": "A connected story has **cause and effect**: one event gives the character a reason to do something next. Use *because*, *so* or *as a result* when it helps make that link clear."
        },
        {
          "front": "Check that the orientation and complication fit together",
          "back": "A convincing opening sets up a goal or expectation; the complication challenges it. You can revise either part to make the connection stronger. Do not solve the entire story before the reader has understood what went wrong."
        }
      ]
    }
  ],
  "printable_resource": {
    "title": "Story Builders: Orientation and Complication",
    "instructions": "Read the scenario and finish the guided and independent tasks before using the supplied feedback.",
    "passage": "On Saturday morning, Priya brought her handmade kite to the grassy oval. She wanted to show her grandad how high it could fly. Just as she began, a strong gust tore the kite''s paper sail.",
    "prompts": [
      "What is the important information?",
      "What method applies?",
      "What is my independent answer?",
      "How did I check or correct it?"
    ]
  },
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "🔎",
      "title": "Introduce the orientation",
      "explain": "**Understand:** An **orientation** gives the reader a starting point: who is involved, where they are, when the scene happens and sometimes what the character wants. Not every opening includes every detail, but readers need enough information to follow what comes next.\n\n**Our original situation:** On Saturday morning, Priya brought her handmade kite to the grassy oval. She wanted to show her grandad how high it could fly. Just as she began, a strong gust tore the kite''s paper sail.\n\n**Why this matters:** Good answers connect a specific part of the story or calculation to the rule, rather than simply naming a term.",
      "example": "**WATCH MY THINKING**\nI circle *Priya* (who), *grassy oval* (where), *Saturday morning* (when) and *show her grandad* (goal). I write an opening sentence with those clues instead of describing an unrelated character.\n\n**TRY THE NEXT STEP**\n**Write a new story opening:** Your character is Niko, visiting a community exhibition on a Sunday afternoon to display a model bridge. Just before judging, one of the bridge supports bends. Write an orientation of 3–4 sentences and a complication of 2–3 sentences. Then write two possible next actions caused by the problem. Label where, when, who, goal and complication in your own writing. Explain why the complication matters.\n\n**CHECK:** Compare your choice with the explanation. If your answer differs, identify which text clue, time word or number place you missed.",
      "notice": "An **orientation** gives the reader a starting point: who is involved, where they are, when the scene happens and sometimes what the character wants. Not every opening includes every detail, but readers need enough information to follow what comes next. Use the example to test your understanding.",
      "check": {
        "question": "Which is an orientation detail?",
        "options": [
          "The bridge breaks later.",
          "On Sunday afternoon at the exhibition.",
          "Niko repairs the model.",
          "The prize is announced."
        ],
        "correct_index": 1,
        "explanation": "On Sunday afternoon at the exhibition. — I circle *Priya* (who), *grassy oval* (where), *Saturday morning* (when) and *show her grandad* (goal). I write an opening sentence with those clues instead of describing an unrelated character."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Learning clue: Story Builders: Orientation and Complication",
            "transcript": "Pip: Priya arrives at the oval with a kite. Is that already the problem?\nJuno: Not yet. That opening tells us who, where and what she wants to do.\nPip: Oh, the torn sail interrupts her plan!\nJuno: Exactly. Pause and explain why the torn sail matters to Priya''s goal.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "Priya arrives at the oval with a kite. Is that already the problem?"
                  },
                  {
                    "who": "juno",
                    "text": "Not yet. That opening tells us who, where and what she wants to do."
                  },
                  {
                    "who": "pip",
                    "text": "Oh, the torn sail interrupts her plan!"
                  },
                  {
                    "who": "juno",
                    "text": "Exactly. Pause and explain why the torn sail matters to Priya''s goal.",
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
      "icon": "📘",
      "title": "Recognise the complication",
      "explain": "**Understand:** A **complication** is the problem that interrupts a character''s goal. The problem should matter to the character, even if it looks small to somebody else. A change in weather may be part of the problem, but ask what the change actually causes.\n\n**Our original situation:** On Saturday morning, Priya brought her handmade kite to the grassy oval. She wanted to show her grandad how high it could fly. Just as she began, a strong gust tore the kite''s paper sail.\n\n**Why this matters:** Good answers connect a specific part of the story or calculation to the rule, rather than simply naming a term.",
      "example": "**WATCH MY THINKING**\nPriya wants to fly her kite for her grandad. The sail tears when a gust blows. The tear stops the kite from flying properly: *the torn sail* is the important complication, not simply the fact that Saturday arrived.\n\n**TRY THE NEXT STEP**\n**Write a new story opening:** Your character is Niko, visiting a community exhibition on a Sunday afternoon to display a model bridge. Just before judging, one of the bridge supports bends. Write an orientation of 3–4 sentences and a complication of 2–3 sentences. Then write two possible next actions caused by the problem. Label where, when, who, goal and complication in your own writing. Explain why the complication matters.\n\n**CHECK:** Compare your choice with the explanation. If your answer differs, identify which text clue, time word or number place you missed.",
      "notice": "A **complication** is the problem that interrupts a character''s goal. The problem should matter to the character, even if it looks small to somebody else. A change in weather may be part of the problem, but ask what the change actually causes. Use the example to test your understanding.",
      "check": {
        "question": "What is Niko''s goal?",
        "options": [
          "To display a model bridge.",
          "To travel to another country.",
          "To buy a dog.",
          "To cross a real river."
        ],
        "correct_index": 0,
        "explanation": "To display a model bridge. — Priya wants to fly her kite for her grandad. The sail tears when a gust blows. The tear stops the kite from flying properly: *the torn sail* is the important complication, not simply the fact that Saturday arrived."
      }
    },
    {
      "icon": "✏️",
      "title": "Show how the problem changes the action",
      "explain": "**Understand:** A connected story has **cause and effect**: one event gives the character a reason to do something next. Use *because*, *so* or *as a result* when it helps make that link clear.\n\n**Our original situation:** On Saturday morning, Priya brought her handmade kite to the grassy oval. She wanted to show her grandad how high it could fly. Just as she began, a strong gust tore the kite''s paper sail.\n\n**Why this matters:** Good answers connect a specific part of the story or calculation to the rule, rather than simply naming a term.",
      "example": "**WATCH MY THINKING**\nI write: ''Because the sail tore, Priya searched her backpack for tape.'' Her search belongs in the rising action; it follows from the complication. ''A dog barked in a distant street'' might be true in a story, but it does not yet advance this problem.\n\n**TRY THE NEXT STEP**\n**Write a new story opening:** Your character is Niko, visiting a community exhibition on a Sunday afternoon to display a model bridge. Just before judging, one of the bridge supports bends. Write an orientation of 3–4 sentences and a complication of 2–3 sentences. Then write two possible next actions caused by the problem. Label where, when, who, goal and complication in your own writing. Explain why the complication matters.\n\n**CHECK:** Compare your choice with the explanation. If your answer differs, identify which text clue, time word or number place you missed.",
      "notice": "A connected story has **cause and effect**: one event gives the character a reason to do something next. Use *because*, *so* or *as a result* when it helps make that link clear. Use the example to test your understanding.",
      "check": {
        "question": "Which is the complication?",
        "options": [
          "It is Sunday.",
          "The event has judges.",
          "One support bends before judging.",
          "The exhibition has tables."
        ],
        "correct_index": 2,
        "explanation": "One support bends before judging. — I write: ''Because the sail tore, Priya searched her backpack for tape.'' Her search belongs in the rising action; it follows from the complication. ''A dog barked in a distant street'' might be true in a story, but it does not yet advance this problem."
      }
    },
    {
      "icon": "✅",
      "title": "Check that the orientation and complication fit together",
      "explain": "**Understand:** A convincing opening sets up a goal or expectation; the complication challenges it. You can revise either part to make the connection stronger. Do not solve the entire story before the reader has understood what went wrong.\n\n**Our original situation:** On Saturday morning, Priya brought her handmade kite to the grassy oval. She wanted to show her grandad how high it could fly. Just as she began, a strong gust tore the kite''s paper sail.\n\n**Why this matters:** Good answers connect a specific part of the story or calculation to the rule, rather than simply naming a term.",
      "example": "**WATCH MY THINKING**\nCompare: ''Priya wanted to show her grandad a kite'' and ''The kite sail tore.'' These fit. A sudden missing submarine would not connect unless the story introduced one. I check my plan by asking: *Why does this problem matter to this character?*\n\n**TRY THE NEXT STEP**\n**Write a new story opening:** Your character is Niko, visiting a community exhibition on a Sunday afternoon to display a model bridge. Just before judging, one of the bridge supports bends. Write an orientation of 3–4 sentences and a complication of 2–3 sentences. Then write two possible next actions caused by the problem. Label where, when, who, goal and complication in your own writing. Explain why the complication matters.\n\n**CHECK:** Compare your choice with the explanation. If your answer differs, identify which text clue, time word or number place you missed.",
      "notice": "A convincing opening sets up a goal or expectation; the complication challenges it. You can revise either part to make the connection stronger. Do not solve the entire story before the reader has understood what went wrong. Use the example to test your understanding.",
      "check": {
        "question": "Why does the bent support matter?",
        "options": [
          "It makes the bridge model difficult to display as planned.",
          "It changes the day of the week.",
          "It means Niko cannot read.",
          "It proves another entrant cheated."
        ],
        "correct_index": 0,
        "explanation": "It makes the bridge model difficult to display as planned. — Compare: ''Priya wanted to show her grandad a kite'' and ''The kite sail tore.'' These fit. A sudden missing submarine would not connect unless the story introduced one. I check my plan by asking: *Why does this problem matter to this character?*"
      }
    }
  ],
  "worked_example": "## Work through the example\n\nOn Saturday morning, Priya brought her handmade kite to the grassy oval. She wanted to show her grandad how high it could fly. Just as she began, a strong gust tore the kite''s paper sail.\n\n**1. Introduce the orientation.** I circle *Priya* (who), *grassy oval* (where), *Saturday morning* (when) and *show her grandad* (goal). I write an opening sentence with those clues instead of describing an unrelated character.\n\n**2. Recognise the complication.** Priya wants to fly her kite for her grandad. The sail tears when a gust blows. The tear stops the kite from flying properly: *the torn sail* is the important complication, not simply the fact that Saturday arrived.\n\n**3. Show how the problem changes the action.** I write: ''Because the sail tore, Priya searched her backpack for tape.'' Her search belongs in the rising action; it follows from the complication. ''A dog barked in a distant street'' might be true in a story, but it does not yet advance this problem.\n\n**4. Check that the orientation and complication fit together.** Compare: ''Priya wanted to show her grandad a kite'' and ''The kite sail tore.'' These fit. A sudden missing submarine would not connect unless the story introduced one. I check my plan by asking: *Why does this problem matter to this character?*\n\n**Review:** Explain how the examples connect to the rules and what error you would avoid.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 580 215\"><rect width=\"580\" height=\"215\" rx=\"12\" fill=\"#f4f8f6\"/><text x=\"18\" y=\"36\" font-family=\"Arial\" font-size=\"20\" fill=\"#1d4031\">Story beginning and problem</text><rect x=\"18\" y=\"76\" width=\"128\" height=\"95\" rx=\"9\" fill=\"#dbeee3\"/><text x=\"32\" y=\"129\" font-family=\"Arial\" font-size=\"19\" fill=\"#233f35\">Find</text><rect x=\"159\" y=\"76\" width=\"128\" height=\"95\" rx=\"9\" fill=\"#e5eafb\"/><text x=\"173\" y=\"129\" font-family=\"Arial\" font-size=\"19\" fill=\"#233f35\">Model</text><rect x=\"300\" y=\"76\" width=\"128\" height=\"95\" rx=\"9\" fill=\"#dbeee3\"/><text x=\"314\" y=\"129\" font-family=\"Arial\" font-size=\"19\" fill=\"#233f35\">Try</text><rect x=\"441\" y=\"76\" width=\"128\" height=\"95\" rx=\"9\" fill=\"#e5eafb\"/><text x=\"455\" y=\"129\" font-family=\"Arial\" font-size=\"19\" fill=\"#233f35\">Check</text></svg>",
      "alt": "A four-part learning sequence for Story Builders: Orientation and Complication: find, model, try and check.",
      "caption": "Use the teaching stages to follow and verify your work."
    }
  ],
  "guided_practice": "**Practice story:** ''After school, Tomas carried a model boat to the creek with his sister. He hoped to watch it float. When he placed it in the water, a crack in the hull let water pour inside.''\n\n1. List the character, place, time and goal.\n2. Name the complication in one sentence.\n3. Write a **because–so** link explaining what Tomas might try next.\n4. Explain why ''Tomas wore blue socks'' would not be the central complication.\n\n**Feedback:** Tomas is the main character; creek is place; after school is time; testing the boat is the goal. A cracked hull lets in water, stopping it from floating. He might take it out *because* water enters, *so* he can repair the crack. Sock colour is not connected to the goal.",
  "independent_task": "**Write a new story opening:** Your character is Niko, visiting a community exhibition on a Sunday afternoon to display a model bridge. Just before judging, one of the bridge supports bends. Write an orientation of 3–4 sentences and a complication of 2–3 sentences. Then write two possible next actions caused by the problem. Label where, when, who, goal and complication in your own writing. Explain why the complication matters.",
  "response_prompt": "Complete the story builders: orientation and complication mission. Show evidence or working and explain one improvement.",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "Which is an orientation detail?",
      "options": [
        "The bridge breaks later.",
        "On Sunday afternoon at the exhibition.",
        "Niko repairs the model.",
        "The prize is announced."
      ],
      "correct_index": 1,
      "explanation": "On Sunday afternoon at the exhibition. is the correct result. Check against the source example or number-place reasoning in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "What is Niko''s goal?",
      "options": [
        "To display a model bridge.",
        "To travel to another country.",
        "To buy a dog.",
        "To cross a real river."
      ],
      "correct_index": 0,
      "explanation": "To display a model bridge. is the correct result. Check against the source example or number-place reasoning in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "Which is the complication?",
      "options": [
        "It is Sunday.",
        "The event has judges.",
        "One support bends before judging.",
        "The exhibition has tables."
      ],
      "correct_index": 2,
      "explanation": "One support bends before judging. is the correct result. Check against the source example or number-place reasoning in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "Why does the bent support matter?",
      "options": [
        "It makes the bridge model difficult to display as planned.",
        "It changes the day of the week.",
        "It means Niko cannot read.",
        "It proves another entrant cheated."
      ],
      "correct_index": 0,
      "explanation": "It makes the bridge model difficult to display as planned. is the correct result. Check against the source example or number-place reasoning in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "Which event follows logically?",
      "options": [
        "Niko checks the bent joint.",
        "Niko sails a boat at sea.",
        "The school closes forever.",
        "The exhibition becomes a zoo."
      ],
      "correct_index": 0,
      "explanation": "Niko checks the bent joint. is the correct result. Check against the source example or number-place reasoning in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "Which sentence makes cause and effect clear?",
      "options": [
        "The support bent, so Niko looked for a way to strengthen it.",
        "The support bent and elephants are big.",
        "Niko liked blue because Sunday.",
        "The support was a table."
      ],
      "correct_index": 0,
      "explanation": "The support bent, so Niko looked for a way to strengthen it. is the correct result. Check against the source example or number-place reasoning in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "Which fact is NOT supplied?",
      "options": [
        "The exhibition is on Sunday.",
        "Niko wants to display a model.",
        "The support bends.",
        "Another child deliberately damaged the bridge."
      ],
      "correct_index": 3,
      "explanation": "Another child deliberately damaged the bridge. is the correct result. Check against the source example or number-place reasoning in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "Which opening sets up a suitable complication?",
      "options": [
        "Niko prepared a bridge model for judging, but a support bent.",
        "The model was repaired before it broke.",
        "A different character sailed into space.",
        "The judges vanished with no prior context."
      ],
      "correct_index": 0,
      "explanation": "Niko prepared a bridge model for judging, but a support bent. is the correct result. Check against the source example or number-place reasoning in the lesson."
    },
    {
      "type": "short_answer",
      "question": "Complete the main story builders: orientation and complication challenge with supporting detail or working.",
      "sample_answer": "Orientation: On Sunday afternoon, Niko arrived at the community exhibition with a model bridge. Niko hoped to show the judges how it supported weight. Complication: Just before judging, one support bent and the model tipped to one side. Niko worried the bridge would no longer meet the display challenge.",
      "marking_guide": "Check the task''s specific requested facts, stages or calculations and supporting reasoning.",
      "explanation": "A complete answer makes the steps visible."
    },
    {
      "type": "short_answer",
      "question": "Explain a meaningful revision or check for story builders: orientation and complication.",
      "sample_answer": "The complication matters because Niko''s goal is to present a working bridge. Niko could inspect the joint, then ask an organiser for permitted repair materials. I did not claim sabotage, because nothing in the prompt supports it.",
      "marking_guide": "Accept evidence-based correction, with specific reasons rather than generic praise.",
      "explanation": "A check should improve correctness."
    }
  ],
  "parent_notes": "Parent: Ask the learner to explain the method and to identify which detail or place value supports the result. Do not provide the answer before the independent attempt.\n\nParent: **Model answer 1:** Orientation: On Sunday afternoon, Niko arrived at the community exhibition with a model bridge. Niko hoped to show the judges how it supported weight. Complication: Just before judging, one support bent and the model tipped to one side. Niko worried the bridge would no longer meet the display challenge.\n\nParent: **Model answer 2:** The complication matters because Niko''s goal is to present a working bridge. Niko could inspect the joint, then ask an organiser for permitted repair materials. I did not claim sabotage, because nothing in the prompt supports it.\n\nParent: Check both written responses and save the actual student evidence. Eight multiple choice items require eight correct under a 90% threshold; outcome codes need separate verification.",
  "evidence_instructions": "Save the guided story builders: orientation and complication exercises, independent task, corrected detail and two written quiz responses.",
  "offline_alternative": "Read the original text from paper, annotate or calculate by hand, and show a parent the answers or a photograph of the work.",
  "extension": "Make an original contrasting example that challenges a rule from story builders: orientation and complication and show how to solve it.",
  "stage_hints": {
    "accept": [
      "Review the task for Story Builders: Orientation and Complication.",
      "Return to the original situation and find the exact evidence or number that matters for story builders: orientation and complication.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ],
    "teach0": [
      "Review the task for Introduce the orientation.",
      "Return to the original situation and find the exact evidence or number that matters for introduce the orientation.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ],
    "teach1": [
      "Review the task for Recognise the complication.",
      "Return to the original situation and find the exact evidence or number that matters for recognise the complication.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ],
    "teach2": [
      "Review the task for Show how the problem changes the action.",
      "Return to the original situation and find the exact evidence or number that matters for show how the problem changes the action.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ],
    "teach3": [
      "Review the task for Check that the orientation and complication fit together.",
      "Return to the original situation and find the exact evidence or number that matters for check that the orientation and complication fit together.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ],
    "learn": [
      "Review the task for Story Builders: Orientation and Complication.",
      "Return to the original situation and find the exact evidence or number that matters for story builders: orientation and complication.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ],
    "guided": [
      "Review the task for Story Builders: Orientation and Complication.",
      "Return to the original situation and find the exact evidence or number that matters for story builders: orientation and complication.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ],
    "write": [
      "Review the task for Story Builders: Orientation and Complication.",
      "Return to the original situation and find the exact evidence or number that matters for story builders: orientation and complication.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ],
    "quiz": [
      "Review the task for Story Builders: Orientation and Complication.",
      "Return to the original situation and find the exact evidence or number that matters for story builders: orientation and complication.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ],
    "submit": [
      "Review the task for Story Builders: Orientation and Complication.",
      "Return to the original situation and find the exact evidence or number that matters for story builders: orientation and complication.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ]
  }
}'),updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE seed_key='s2-eng-y3-w03-l2';

-- s2-eng-y3-w03-l3
UPDATE lessons SET title='Time Travellers: Verb Tense and Adverbs',data=json_patch(data,'{
  "seed_key": "s2-eng-y3-w03-l3",
  "title": "Time Travellers: Verb Tense and Adverbs",
  "stage": "Stage 2",
  "learning_area": "English",
  "year_level": 3,
  "week": 3,
  "lesson_number": 3,
  "duration_minutes": 60,
  "child_mission": "Explore time travellers: verb tense and adverbs through original stories or numbers, guided practice and an independent mission.",
  "learning_intention": "We are learning to explain and apply time travellers: verb tense and adverbs with evidence or working.",
  "success_criteria": [
    "I can explain the central idea in my own words.",
    "I can follow a model and say why its steps work.",
    "I can complete guided practice and correct a mistake.",
    "I can solve the new independent challenge.",
    "I can give a reason for my final answer."
  ],
  "materials": [
    "All original reading and calculations are included.",
    "Optional paper and pencil for annotation."
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
      "title": "Recall the four key ideas",
      "cards": [
        {
          "front": "Locate verbs and their time",
          "back": "A **verb** expresses an action or state. **Tense** helps a reader understand when the action happens. In a simple sentence, *walked* shows past time; *walks* can describe present habits; *will walk* can express future time."
        },
        {
          "front": "Keep tense consistent when retelling",
          "back": "A story usually keeps its chosen time frame unless the writer deliberately changes it. Check the time expressions *yesterday*, *today* and *tomorrow* before selecting the verb forms. Some past-tense verbs are irregular: *go → went*, not *goed*."
        },
        {
          "front": "Use adverbs precisely",
          "back": "An **adverb** can describe how, when, where or how often an action happens. Many end in *-ly*, but not all do: *soon*, *often* and *fast* can work as adverbs. A word ending in *-ly* is not automatically an adverb in every sentence."
        },
        {
          "front": "Revise the sentence without clutter",
          "back": "Choose an adverb only when it makes the meaning clearer. A stronger verb can sometimes replace a vague verb plus an adverb: ''walked slowly'' might become ''trudged'' depending on meaning. Keep tense and time clues accurate as you revise."
        }
      ]
    }
  ],
  "printable_resource": {
    "title": "Time Travellers: Verb Tense and Adverbs",
    "instructions": "Read the scenario and finish the guided and independent tasks before using the supplied feedback.",
    "passage": "Yesterday, Ash walked to the park and quietly watched birds. Today Ash watches from the bench. Tomorrow Ash will watch again.",
    "prompts": [
      "What is the important information?",
      "What method applies?",
      "What is my independent answer?",
      "How did I check or correct it?"
    ]
  },
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "🔎",
      "title": "Locate verbs and their time",
      "explain": "**Understand:** A **verb** expresses an action or state. **Tense** helps a reader understand when the action happens. In a simple sentence, *walked* shows past time; *walks* can describe present habits; *will walk* can express future time.\n\n**Our original situation:** Yesterday, Ash walked to the park and quietly watched birds. Today Ash watches from the bench. Tomorrow Ash will watch again.\n\n**Why this matters:** Good answers connect a specific part of the story or calculation to the rule, rather than simply naming a term.",
      "example": "**WATCH MY THINKING**\nI underline the actions in ''Yesterday Ash walked to the park.'' *Walked* is past tense. I confirm that *yesterday* agrees with it. If the sentence said ''Yesterday Ash will walk'', the time clues would clash.\n\n**TRY THE NEXT STEP**\n**Edit a time-travel diary.** Original text: ''Yesterday Zara walk to the pond. She see a duck and quietly take a photo. Today she watched the picture and smiles. Tomorrow she visited again.'' Rewrite it so each verb matches yesterday, today or tomorrow. Underline two adverbs (you may add sensible ones), label what they tell us, and explain two of your corrections. Include the irregular past forms of see and take.\n\n**CHECK:** Compare your choice with the explanation. If your answer differs, identify which text clue, time word or number place you missed.",
      "notice": "A **verb** expresses an action or state. **Tense** helps a reader understand when the action happens. In a simple sentence, *walked* shows past time; *walks* can describe present habits; *will walk* can express future time. Use the example to test your understanding.",
      "check": {
        "question": "Which verb is past tense?",
        "options": [
          "walk",
          "walked",
          "will walk",
          "walking now"
        ],
        "correct_index": 1,
        "explanation": "walked — I underline the actions in ''Yesterday Ash walked to the park.'' *Walked* is past tense. I confirm that *yesterday* agrees with it. If the sentence said ''Yesterday Ash will walk'', the time clues would clash."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Learning clue: Time Travellers: Verb Tense and Adverbs",
            "transcript": "Pip: Yesterday Ash walks to the park. That sounds strange.\nJuno: Yesterday usually needs a past-tense verb. Try walked.\nPip: Ash walked quietly. Quietly tells me how the action happened.\nJuno: Good. Pause and change ''Tomorrow Ash walked'' to future tense.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "Yesterday Ash walks to the park. That sounds strange."
                  },
                  {
                    "who": "juno",
                    "text": "Yesterday usually needs a past-tense verb. Try walked."
                  },
                  {
                    "who": "pip",
                    "text": "Ash walked quietly. Quietly tells me how the action happened."
                  },
                  {
                    "who": "juno",
                    "text": "Good. Pause and change ''Tomorrow Ash walked'' to future tense.",
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
      "icon": "📘",
      "title": "Keep tense consistent when retelling",
      "explain": "**Understand:** A story usually keeps its chosen time frame unless the writer deliberately changes it. Check the time expressions *yesterday*, *today* and *tomorrow* before selecting the verb forms. Some past-tense verbs are irregular: *go → went*, not *goed*.\n\n**Our original situation:** Yesterday, Ash walked to the park and quietly watched birds. Today Ash watches from the bench. Tomorrow Ash will watch again.\n\n**Why this matters:** Good answers connect a specific part of the story or calculation to the rule, rather than simply naming a term.",
      "example": "**WATCH MY THINKING**\nI revise ''Yesterday Mia walks to the shop and buys bread'' to ''Yesterday Mia **walked** to the shop and **bought** bread.'' Both verbs now agree with yesterday. I don''t change ''bought'' to ''buyed''.\n\n**TRY THE NEXT STEP**\n**Edit a time-travel diary.** Original text: ''Yesterday Zara walk to the pond. She see a duck and quietly take a photo. Today she watched the picture and smiles. Tomorrow she visited again.'' Rewrite it so each verb matches yesterday, today or tomorrow. Underline two adverbs (you may add sensible ones), label what they tell us, and explain two of your corrections. Include the irregular past forms of see and take.\n\n**CHECK:** Compare your choice with the explanation. If your answer differs, identify which text clue, time word or number place you missed.",
      "notice": "A story usually keeps its chosen time frame unless the writer deliberately changes it. Check the time expressions *yesterday*, *today* and *tomorrow* before selecting the verb forms. Some past-tense verbs are irregular: *go → went*, not *goed*. Use the example to test your understanding.",
      "check": {
        "question": "Complete: Yesterday Zara ___ to the pond.",
        "options": [
          "walk",
          "will walk",
          "walked",
          "walks"
        ],
        "correct_index": 2,
        "explanation": "walked — I revise ''Yesterday Mia walks to the shop and buys bread'' to ''Yesterday Mia **walked** to the shop and **bought** bread.'' Both verbs now agree with yesterday. I don''t change ''bought'' to ''buyed''."
      }
    },
    {
      "icon": "✏️",
      "title": "Use adverbs precisely",
      "explain": "**Understand:** An **adverb** can describe how, when, where or how often an action happens. Many end in *-ly*, but not all do: *soon*, *often* and *fast* can work as adverbs. A word ending in *-ly* is not automatically an adverb in every sentence.\n\n**Our original situation:** Yesterday, Ash walked to the park and quietly watched birds. Today Ash watches from the bench. Tomorrow Ash will watch again.\n\n**Why this matters:** Good answers connect a specific part of the story or calculation to the rule, rather than simply naming a term.",
      "example": "**WATCH MY THINKING**\nCompare ''The bird flew'' with ''The bird flew **swiftly**.'' Swiftly tells us how it flew. In ''Soon the bird flew away'', *soon* tells when. I ask which word the adverb modifies.\n\n**TRY THE NEXT STEP**\n**Edit a time-travel diary.** Original text: ''Yesterday Zara walk to the pond. She see a duck and quietly take a photo. Today she watched the picture and smiles. Tomorrow she visited again.'' Rewrite it so each verb matches yesterday, today or tomorrow. Underline two adverbs (you may add sensible ones), label what they tell us, and explain two of your corrections. Include the irregular past forms of see and take.\n\n**CHECK:** Compare your choice with the explanation. If your answer differs, identify which text clue, time word or number place you missed.",
      "notice": "An **adverb** can describe how, when, where or how often an action happens. Many end in *-ly*, but not all do: *soon*, *often* and *fast* can work as adverbs. A word ending in *-ly* is not automatically an adverb in every sentence. Use the example to test your understanding.",
      "check": {
        "question": "What is the past form of see?",
        "options": [
          "seed",
          "seeing",
          "saw",
          "sees"
        ],
        "correct_index": 2,
        "explanation": "saw — Compare ''The bird flew'' with ''The bird flew **swiftly**.'' Swiftly tells us how it flew. In ''Soon the bird flew away'', *soon* tells when. I ask which word the adverb modifies."
      }
    },
    {
      "icon": "✅",
      "title": "Revise the sentence without clutter",
      "explain": "**Understand:** Choose an adverb only when it makes the meaning clearer. A stronger verb can sometimes replace a vague verb plus an adverb: ''walked slowly'' might become ''trudged'' depending on meaning. Keep tense and time clues accurate as you revise.\n\n**Our original situation:** Yesterday, Ash walked to the park and quietly watched birds. Today Ash watches from the bench. Tomorrow Ash will watch again.\n\n**Why this matters:** Good answers connect a specific part of the story or calculation to the rule, rather than simply naming a term.",
      "example": "**WATCH MY THINKING**\nI improve ''Yesterday the cat moves quietly'' to ''Yesterday the cat **crept** under the chair.'' *Crept* clearly shows a quiet action and is past tense. I check that I have not invented an impossible event.\n\n**TRY THE NEXT STEP**\n**Edit a time-travel diary.** Original text: ''Yesterday Zara walk to the pond. She see a duck and quietly take a photo. Today she watched the picture and smiles. Tomorrow she visited again.'' Rewrite it so each verb matches yesterday, today or tomorrow. Underline two adverbs (you may add sensible ones), label what they tell us, and explain two of your corrections. Include the irregular past forms of see and take.\n\n**CHECK:** Compare your choice with the explanation. If your answer differs, identify which text clue, time word or number place you missed.",
      "notice": "Choose an adverb only when it makes the meaning clearer. A stronger verb can sometimes replace a vague verb plus an adverb: ''walked slowly'' might become ''trudged'' depending on meaning. Keep tense and time clues accurate as you revise. Use the example to test your understanding.",
      "check": {
        "question": "What is the past form of take?",
        "options": [
          "taked",
          "taken tomorrow",
          "took",
          "takes"
        ],
        "correct_index": 2,
        "explanation": "took — I improve ''Yesterday the cat moves quietly'' to ''Yesterday the cat **crept** under the chair.'' *Crept* clearly shows a quiet action and is past tense. I check that I have not invented an impossible event."
      }
    }
  ],
  "worked_example": "## Work through the example\n\nYesterday, Ash walked to the park and quietly watched birds. Today Ash watches from the bench. Tomorrow Ash will watch again.\n\n**1. Locate verbs and their time.** I underline the actions in ''Yesterday Ash walked to the park.'' *Walked* is past tense. I confirm that *yesterday* agrees with it. If the sentence said ''Yesterday Ash will walk'', the time clues would clash.\n\n**2. Keep tense consistent when retelling.** I revise ''Yesterday Mia walks to the shop and buys bread'' to ''Yesterday Mia **walked** to the shop and **bought** bread.'' Both verbs now agree with yesterday. I don''t change ''bought'' to ''buyed''.\n\n**3. Use adverbs precisely.** Compare ''The bird flew'' with ''The bird flew **swiftly**.'' Swiftly tells us how it flew. In ''Soon the bird flew away'', *soon* tells when. I ask which word the adverb modifies.\n\n**4. Revise the sentence without clutter.** I improve ''Yesterday the cat moves quietly'' to ''Yesterday the cat **crept** under the chair.'' *Crept* clearly shows a quiet action and is past tense. I check that I have not invented an impossible event.\n\n**Review:** Explain how the examples connect to the rules and what error you would avoid.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 580 215\"><rect width=\"580\" height=\"215\" rx=\"12\" fill=\"#f4f8f6\"/><text x=\"18\" y=\"36\" font-family=\"Arial\" font-size=\"20\" fill=\"#1d4031\">Verb tense and adverbs</text><rect x=\"18\" y=\"76\" width=\"128\" height=\"95\" rx=\"9\" fill=\"#dbeee3\"/><text x=\"32\" y=\"129\" font-family=\"Arial\" font-size=\"19\" fill=\"#233f35\">Find</text><rect x=\"159\" y=\"76\" width=\"128\" height=\"95\" rx=\"9\" fill=\"#e5eafb\"/><text x=\"173\" y=\"129\" font-family=\"Arial\" font-size=\"19\" fill=\"#233f35\">Model</text><rect x=\"300\" y=\"76\" width=\"128\" height=\"95\" rx=\"9\" fill=\"#dbeee3\"/><text x=\"314\" y=\"129\" font-family=\"Arial\" font-size=\"19\" fill=\"#233f35\">Try</text><rect x=\"441\" y=\"76\" width=\"128\" height=\"95\" rx=\"9\" fill=\"#e5eafb\"/><text x=\"455\" y=\"129\" font-family=\"Arial\" font-size=\"19\" fill=\"#233f35\">Check</text></svg>",
      "alt": "A four-part learning sequence for Time Travellers: Verb Tense and Adverbs: find, model, try and check.",
      "caption": "Use the teaching stages to follow and verify your work."
    }
  ],
  "guided_practice": "**Try these:**\n1. ''Yesterday Leila (go/goes/went) home.'' Select **went**, an irregular past-tense form.\n2. ''Tomorrow the birds (sang/will sing) in the morning.'' Select **will sing** for a planned future event.\n3. ''The drummer tapped softly.'' Which word tells *how*? **Softly**.\n4. Rewrite ''Yesterday Finn runs quickly to the gate'' using consistent tense: **Yesterday Finn ran quickly to the gate.**\n\n**Now check:** In ''She often reads outdoors'', *often* is an adverb of frequency; it doesn''t end in -ly.",
  "independent_task": "**Edit a time-travel diary.** Original text: ''Yesterday Zara walk to the pond. She see a duck and quietly take a photo. Today she watched the picture and smiles. Tomorrow she visited again.'' Rewrite it so each verb matches yesterday, today or tomorrow. Underline two adverbs (you may add sensible ones), label what they tell us, and explain two of your corrections. Include the irregular past forms of see and take.",
  "response_prompt": "Complete the time travellers: verb tense and adverbs mission. Show evidence or working and explain one improvement.",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "Which verb is past tense?",
      "options": [
        "walk",
        "walked",
        "will walk",
        "walking now"
      ],
      "correct_index": 1,
      "explanation": "walked is the correct result. Check against the source example or number-place reasoning in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "Complete: Yesterday Zara ___ to the pond.",
      "options": [
        "walk",
        "will walk",
        "walked",
        "walks"
      ],
      "correct_index": 2,
      "explanation": "walked is the correct result. Check against the source example or number-place reasoning in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "What is the past form of see?",
      "options": [
        "seed",
        "seeing",
        "saw",
        "sees"
      ],
      "correct_index": 2,
      "explanation": "saw is the correct result. Check against the source example or number-place reasoning in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "What is the past form of take?",
      "options": [
        "taked",
        "taken tomorrow",
        "took",
        "takes"
      ],
      "correct_index": 2,
      "explanation": "took is the correct result. Check against the source example or number-place reasoning in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "Which word tells how the duck moved: ''The duck paddled slowly''?",
      "options": [
        "duck",
        "paddled",
        "slowly",
        "the"
      ],
      "correct_index": 2,
      "explanation": "slowly is the correct result. Check against the source example or number-place reasoning in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "Which is future tense?",
      "options": [
        "She will visit tomorrow.",
        "She visits yesterday.",
        "She visited now.",
        "She had walked yesterday."
      ],
      "correct_index": 0,
      "explanation": "She will visit tomorrow. is the correct result. Check against the source example or number-place reasoning in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "Which sentence keeps past tense?",
      "options": [
        "Yesterday Ash walk and sings.",
        "Yesterday Ash walked and sang.",
        "Yesterday Ash walks and sang.",
        "Yesterday Ash will walk and sang."
      ],
      "correct_index": 1,
      "explanation": "Yesterday Ash walked and sang. is the correct result. Check against the source example or number-place reasoning in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "Which word can be an adverb without -ly?",
      "options": [
        "often",
        "chair",
        "green",
        "duck"
      ],
      "correct_index": 0,
      "explanation": "often is the correct result. Check against the source example or number-place reasoning in the lesson."
    },
    {
      "type": "short_answer",
      "question": "Complete the main time travellers: verb tense and adverbs challenge with supporting detail or working.",
      "sample_answer": "Yesterday Zara walked to the pond. She saw a duck and quietly took a photo. Today she looks at the picture and smiles. Tomorrow she will visit again. I corrected walk→walked, see→saw, take→took, watched→looks and visited→will visit to match the times.",
      "marking_guide": "Check the task''s specific requested facts, stages or calculations and supporting reasoning.",
      "explanation": "A complete answer makes the steps visible."
    },
    {
      "type": "short_answer",
      "question": "Explain a meaningful revision or check for time travellers: verb tense and adverbs.",
      "sample_answer": "Quietly describes how Zara took the photo. I could add ''carefully'' to ''She carefully looks at the picture''; carefully describes how she looks. Saw and took are irregular past-tense forms, not seed and taked.",
      "marking_guide": "Accept evidence-based correction, with specific reasons rather than generic praise.",
      "explanation": "A check should improve correctness."
    }
  ],
  "parent_notes": "Parent: Ask the learner to explain the method and to identify which detail or place value supports the result. Do not provide the answer before the independent attempt.\n\nParent: **Model answer 1:** Yesterday Zara walked to the pond. She saw a duck and quietly took a photo. Today she looks at the picture and smiles. Tomorrow she will visit again. I corrected walk→walked, see→saw, take→took, watched→looks and visited→will visit to match the times.\n\nParent: **Model answer 2:** Quietly describes how Zara took the photo. I could add ''carefully'' to ''She carefully looks at the picture''; carefully describes how she looks. Saw and took are irregular past-tense forms, not seed and taked.\n\nParent: Check both written responses and save the actual student evidence. Eight multiple choice items require eight correct under a 90% threshold; outcome codes need separate verification.",
  "evidence_instructions": "Save the guided time travellers: verb tense and adverbs exercises, independent task, corrected detail and two written quiz responses.",
  "offline_alternative": "Read the original text from paper, annotate or calculate by hand, and show a parent the answers or a photograph of the work.",
  "extension": "Make an original contrasting example that challenges a rule from time travellers: verb tense and adverbs and show how to solve it.",
  "stage_hints": {
    "accept": [
      "Review the task for Time Travellers: Verb Tense and Adverbs.",
      "Return to the original situation and find the exact evidence or number that matters for time travellers: verb tense and adverbs.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ],
    "teach0": [
      "Review the task for Locate verbs and their time.",
      "Return to the original situation and find the exact evidence or number that matters for locate verbs and their time.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ],
    "teach1": [
      "Review the task for Keep tense consistent when retelling.",
      "Return to the original situation and find the exact evidence or number that matters for keep tense consistent when retelling.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ],
    "teach2": [
      "Review the task for Use adverbs precisely.",
      "Return to the original situation and find the exact evidence or number that matters for use adverbs precisely.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ],
    "teach3": [
      "Review the task for Revise the sentence without clutter.",
      "Return to the original situation and find the exact evidence or number that matters for revise the sentence without clutter.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ],
    "learn": [
      "Review the task for Time Travellers: Verb Tense and Adverbs.",
      "Return to the original situation and find the exact evidence or number that matters for time travellers: verb tense and adverbs.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ],
    "guided": [
      "Review the task for Time Travellers: Verb Tense and Adverbs.",
      "Return to the original situation and find the exact evidence or number that matters for time travellers: verb tense and adverbs.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ],
    "write": [
      "Review the task for Time Travellers: Verb Tense and Adverbs.",
      "Return to the original situation and find the exact evidence or number that matters for time travellers: verb tense and adverbs.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ],
    "quiz": [
      "Review the task for Time Travellers: Verb Tense and Adverbs.",
      "Return to the original situation and find the exact evidence or number that matters for time travellers: verb tense and adverbs.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ],
    "submit": [
      "Review the task for Time Travellers: Verb Tense and Adverbs.",
      "Return to the original situation and find the exact evidence or number that matters for time travellers: verb tense and adverbs.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ]
  }
}'),updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE seed_key='s2-eng-y3-w03-l3';

-- s2-eng-y3-w03-l4
UPDATE lessons SET title='Readers'' Theatre: Bring Dialogue to Life',data=json_patch(data,'{
  "seed_key": "s2-eng-y3-w03-l4",
  "title": "Readers'' Theatre: Bring Dialogue to Life",
  "stage": "Stage 2",
  "learning_area": "English",
  "year_level": 3,
  "week": 3,
  "lesson_number": 4,
  "duration_minutes": 60,
  "child_mission": "Explore readers'' theatre: bring dialogue to life through original stories or numbers, guided practice and an independent mission.",
  "learning_intention": "We are learning to explain and apply readers'' theatre: bring dialogue to life with evidence or working.",
  "success_criteria": [
    "I can explain the central idea in my own words.",
    "I can follow a model and say why its steps work.",
    "I can complete guided practice and correct a mistake.",
    "I can solve the new independent challenge.",
    "I can give a reason for my final answer."
  ],
  "materials": [
    "All original reading and calculations are included.",
    "Optional paper and pencil for annotation."
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
      "title": "Recall the four key ideas",
      "cards": [
        {
          "front": "Identify each speaker and their words",
          "back": "**Dialogue** is what characters say. Quotation marks show spoken words; speech tags such as *whispers Kit* identify a speaker and sometimes give a delivery clue. The narrator''s words are not necessarily spoken by a character."
        },
        {
          "front": "Match voice to meaning and punctuation",
          "back": "A question mark can signal a questioning tone; an exclamation mark may suggest strong feeling, but the surrounding text matters. Choose pitch, volume and pace based on character clues rather than automatically shouting."
        },
        {
          "front": "Share roles and pause for turns",
          "back": "A readers'' theatre script separates speaker lines and narration so a group can read without confusion. Mark brief pauses between speakers and use a cue to know when to begin. One reader can perform multiple roles if working alone."
        },
        {
          "front": "Rehearse and revise expression",
          "back": "A rehearsal is a safe practice, not a test of acting talent. Read once for accuracy, once for expression, then explain one improvement supported by a text clue. Typed annotations or quiet reading may replace a public performance."
        }
      ]
    }
  ],
  "printable_resource": {
    "title": "Readers'' Theatre: Bring Dialogue to Life",
    "instructions": "Read the scenario and finish the guided and independent tasks before using the supplied feedback.",
    "passage": "At the museum, a door creaks. ''Did you hear that?'' whispers Kit. ''It is only the old floor,'' replies Jo, smiling.",
    "prompts": [
      "What is the important information?",
      "What method applies?",
      "What is my independent answer?",
      "How did I check or correct it?"
    ]
  },
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "🔎",
      "title": "Identify each speaker and their words",
      "explain": "**Understand:** **Dialogue** is what characters say. Quotation marks show spoken words; speech tags such as *whispers Kit* identify a speaker and sometimes give a delivery clue. The narrator''s words are not necessarily spoken by a character.\n\n**Our original situation:** At the museum, a door creaks. ''Did you hear that?'' whispers Kit. ''It is only the old floor,'' replies Jo, smiling.\n\n**Why this matters:** Good answers connect a specific part of the story or calculation to the rule, rather than simply naming a term.",
      "example": "**WATCH MY THINKING**\nI find the words inside quotation marks: ''Did you hear that?'' Kit says them. The word *whispers* tells how Kit speaks. Jo''s words appear in the second pair of quotation marks.\n\n**TRY THE NEXT STEP**\n**Museum Mystery mini-script.** Original scene: ''A curtain lifts as the room fills with wind. “The display is moving!” calls Mina. “Close the window carefully,” says Oz. Mina walks across the room, pulls it shut, and laughs with relief.'' Turn this into a readers'' theatre script with NARRATOR, MINA and OZ. Include stage directions for three pauses or voice choices. Practise twice or annotate a quiet/written performance. Explain what changed between the first and second version and which words justified the choices.\n\n**CHECK:** Compare your choice with the explanation. If your answer differs, identify which text clue, time word or number place you missed.",
      "notice": "**Dialogue** is what characters say. Quotation marks show spoken words; speech tags such as *whispers Kit* identify a speaker and sometimes give a delivery clue. The narrator''s words are not necessarily spoken by a character. Use the example to test your understanding.",
      "check": {
        "question": "Who says ''The display is moving!''?",
        "options": [
          "Oz",
          "The narrator",
          "Mina",
          "A visitor"
        ],
        "correct_index": 2,
        "explanation": "Mina — I find the words inside quotation marks: ''Did you hear that?'' Kit says them. The word *whispers* tells how Kit speaks. Jo''s words appear in the second pair of quotation marks."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Learning clue: Readers'' Theatre: Bring Dialogue to Life",
            "transcript": "Pip: Kit says ''Did you hear that?'' Should I shout it?\nJuno: The narrator says Kit whispers. Keep it quiet and questioning.\nPip: Jo is smiling, so a calm reply fits.\nJuno: Pause and practise the two voices without changing the words.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "Kit says ''Did you hear that?'' Should I shout it?"
                  },
                  {
                    "who": "juno",
                    "text": "The narrator says Kit whispers. Keep it quiet and questioning."
                  },
                  {
                    "who": "pip",
                    "text": "Jo is smiling, so a calm reply fits."
                  },
                  {
                    "who": "juno",
                    "text": "Pause and practise the two voices without changing the words.",
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
      "icon": "📘",
      "title": "Match voice to meaning and punctuation",
      "explain": "**Understand:** A question mark can signal a questioning tone; an exclamation mark may suggest strong feeling, but the surrounding text matters. Choose pitch, volume and pace based on character clues rather than automatically shouting.\n\n**Our original situation:** At the museum, a door creaks. ''Did you hear that?'' whispers Kit. ''It is only the old floor,'' replies Jo, smiling.\n\n**Why this matters:** Good answers connect a specific part of the story or calculation to the rule, rather than simply naming a term.",
      "example": "**WATCH MY THINKING**\nKit whispers a question, so I use a quiet voice with a questioning shape. Jo replies with a smile, so a calm, reassuring voice fits. I still pronounce every word clearly.\n\n**TRY THE NEXT STEP**\n**Museum Mystery mini-script.** Original scene: ''A curtain lifts as the room fills with wind. “The display is moving!” calls Mina. “Close the window carefully,” says Oz. Mina walks across the room, pulls it shut, and laughs with relief.'' Turn this into a readers'' theatre script with NARRATOR, MINA and OZ. Include stage directions for three pauses or voice choices. Practise twice or annotate a quiet/written performance. Explain what changed between the first and second version and which words justified the choices.\n\n**CHECK:** Compare your choice with the explanation. If your answer differs, identify which text clue, time word or number place you missed.",
      "notice": "A question mark can signal a questioning tone; an exclamation mark may suggest strong feeling, but the surrounding text matters. Choose pitch, volume and pace based on character clues rather than automatically shouting. Use the example to test your understanding.",
      "check": {
        "question": "Which line does Oz speak?",
        "options": [
          "Close the window carefully.",
          "The display is moving!",
          "The room fills with wind.",
          "Mina laughs with relief."
        ],
        "correct_index": 0,
        "explanation": "Close the window carefully. — Kit whispers a question, so I use a quiet voice with a questioning shape. Jo replies with a smile, so a calm, reassuring voice fits. I still pronounce every word clearly."
      }
    },
    {
      "icon": "✏️",
      "title": "Share roles and pause for turns",
      "explain": "**Understand:** A readers'' theatre script separates speaker lines and narration so a group can read without confusion. Mark brief pauses between speakers and use a cue to know when to begin. One reader can perform multiple roles if working alone.\n\n**Our original situation:** At the museum, a door creaks. ''Did you hear that?'' whispers Kit. ''It is only the old floor,'' replies Jo, smiling.\n\n**Why this matters:** Good answers connect a specific part of the story or calculation to the rule, rather than simply naming a term.",
      "example": "**WATCH MY THINKING**\nI label NARRATOR, KIT and JO. Narrator reads ''At the museum, a door creaks''; Kit reads the question; Jo reads the reply. I pause after Kit''s question to allow Jo''s response.\n\n**TRY THE NEXT STEP**\n**Museum Mystery mini-script.** Original scene: ''A curtain lifts as the room fills with wind. “The display is moving!” calls Mina. “Close the window carefully,” says Oz. Mina walks across the room, pulls it shut, and laughs with relief.'' Turn this into a readers'' theatre script with NARRATOR, MINA and OZ. Include stage directions for three pauses or voice choices. Practise twice or annotate a quiet/written performance. Explain what changed between the first and second version and which words justified the choices.\n\n**CHECK:** Compare your choice with the explanation. If your answer differs, identify which text clue, time word or number place you missed.",
      "notice": "A readers'' theatre script separates speaker lines and narration so a group can read without confusion. Mark brief pauses between speakers and use a cue to know when to begin. One reader can perform multiple roles if working alone. Use the example to test your understanding.",
      "check": {
        "question": "Which is a useful cue for Mina''s first line?",
        "options": [
          "Very slow and sleepy",
          "Urgent but clear",
          "Silent throughout",
          "Unrelated laughter"
        ],
        "correct_index": 1,
        "explanation": "Urgent but clear — I label NARRATOR, KIT and JO. Narrator reads ''At the museum, a door creaks''; Kit reads the question; Jo reads the reply. I pause after Kit''s question to allow Jo''s response."
      }
    },
    {
      "icon": "✅",
      "title": "Rehearse and revise expression",
      "explain": "**Understand:** A rehearsal is a safe practice, not a test of acting talent. Read once for accuracy, once for expression, then explain one improvement supported by a text clue. Typed annotations or quiet reading may replace a public performance.\n\n**Our original situation:** At the museum, a door creaks. ''Did you hear that?'' whispers Kit. ''It is only the old floor,'' replies Jo, smiling.\n\n**Why this matters:** Good answers connect a specific part of the story or calculation to the rule, rather than simply naming a term.",
      "example": "**WATCH MY THINKING**\nOn the first reading I spoke Jo''s line too loudly. I try again with a calm voice because *smiling* suggests reassurance. I leave Kit''s words questioning rather than sounding certain.\n\n**TRY THE NEXT STEP**\n**Museum Mystery mini-script.** Original scene: ''A curtain lifts as the room fills with wind. “The display is moving!” calls Mina. “Close the window carefully,” says Oz. Mina walks across the room, pulls it shut, and laughs with relief.'' Turn this into a readers'' theatre script with NARRATOR, MINA and OZ. Include stage directions for three pauses or voice choices. Practise twice or annotate a quiet/written performance. Explain what changed between the first and second version and which words justified the choices.\n\n**CHECK:** Compare your choice with the explanation. If your answer differs, identify which text clue, time word or number place you missed.",
      "notice": "A rehearsal is a safe practice, not a test of acting talent. Read once for accuracy, once for expression, then explain one improvement supported by a text clue. Typed annotations or quiet reading may replace a public performance. Use the example to test your understanding.",
      "check": {
        "question": "What does the narrator say?",
        "options": [
          "Only the characters'' words",
          "Actions outside spoken dialogue",
          "Every character''s lines at once",
          "Nothing about the room"
        ],
        "correct_index": 1,
        "explanation": "Actions outside spoken dialogue — On the first reading I spoke Jo''s line too loudly. I try again with a calm voice because *smiling* suggests reassurance. I leave Kit''s words questioning rather than sounding certain."
      }
    }
  ],
  "worked_example": "## Work through the example\n\nAt the museum, a door creaks. ''Did you hear that?'' whispers Kit. ''It is only the old floor,'' replies Jo, smiling.\n\n**1. Identify each speaker and their words.** I find the words inside quotation marks: ''Did you hear that?'' Kit says them. The word *whispers* tells how Kit speaks. Jo''s words appear in the second pair of quotation marks.\n\n**2. Match voice to meaning and punctuation.** Kit whispers a question, so I use a quiet voice with a questioning shape. Jo replies with a smile, so a calm, reassuring voice fits. I still pronounce every word clearly.\n\n**3. Share roles and pause for turns.** I label NARRATOR, KIT and JO. Narrator reads ''At the museum, a door creaks''; Kit reads the question; Jo reads the reply. I pause after Kit''s question to allow Jo''s response.\n\n**4. Rehearse and revise expression.** On the first reading I spoke Jo''s line too loudly. I try again with a calm voice because *smiling* suggests reassurance. I leave Kit''s words questioning rather than sounding certain.\n\n**Review:** Explain how the examples connect to the rules and what error you would avoid.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 580 215\"><rect width=\"580\" height=\"215\" rx=\"12\" fill=\"#f4f8f6\"/><text x=\"18\" y=\"36\" font-family=\"Arial\" font-size=\"20\" fill=\"#1d4031\">Dialogue and expression</text><rect x=\"18\" y=\"76\" width=\"128\" height=\"95\" rx=\"9\" fill=\"#dbeee3\"/><text x=\"32\" y=\"129\" font-family=\"Arial\" font-size=\"19\" fill=\"#233f35\">Find</text><rect x=\"159\" y=\"76\" width=\"128\" height=\"95\" rx=\"9\" fill=\"#e5eafb\"/><text x=\"173\" y=\"129\" font-family=\"Arial\" font-size=\"19\" fill=\"#233f35\">Model</text><rect x=\"300\" y=\"76\" width=\"128\" height=\"95\" rx=\"9\" fill=\"#dbeee3\"/><text x=\"314\" y=\"129\" font-family=\"Arial\" font-size=\"19\" fill=\"#233f35\">Try</text><rect x=\"441\" y=\"76\" width=\"128\" height=\"95\" rx=\"9\" fill=\"#e5eafb\"/><text x=\"455\" y=\"129\" font-family=\"Arial\" font-size=\"19\" fill=\"#233f35\">Check</text></svg>",
      "alt": "A four-part learning sequence for Readers'' Theatre: Bring Dialogue to Life: find, model, try and check.",
      "caption": "Use the teaching stages to follow and verify your work."
    }
  ],
  "guided_practice": "**New script:**\nNARRATOR: The torch flickers in the hallway.\nELLA (nervously): ''I think the batteries are fading.''\nSAM (calmly): ''We can use the light near the door.''\n\n1. Underline the words Ella speaks and circle the nervous clue.\n2. Decide how Sam''s line should sound and justify your choice.\n3. Mark a pause between the two speakers.\n4. Read or annotate twice, changing one delivery decision.\n\n**Feedback:** Ella says ''I think the batteries are fading'' and *nervously* is the clue. Sam is calm and offers a solution; a steady reassuring voice fits. The pause follows Ella''s statement. If reading aloud is not possible, write ''gentle/uncertain'' by Ella and ''calm/steady'' by Sam and explain why.",
  "independent_task": "**Museum Mystery mini-script.** Original scene: ''A curtain lifts as the room fills with wind. “The display is moving!” calls Mina. “Close the window carefully,” says Oz. Mina walks across the room, pulls it shut, and laughs with relief.'' Turn this into a readers'' theatre script with NARRATOR, MINA and OZ. Include stage directions for three pauses or voice choices. Practise twice or annotate a quiet/written performance. Explain what changed between the first and second version and which words justified the choices.",
  "response_prompt": "Complete the readers'' theatre: bring dialogue to life mission. Show evidence or working and explain one improvement.",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "Who says ''The display is moving!''?",
      "options": [
        "Oz",
        "The narrator",
        "Mina",
        "A visitor"
      ],
      "correct_index": 2,
      "explanation": "Mina is the correct result. Check against the source example or number-place reasoning in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "Which line does Oz speak?",
      "options": [
        "Close the window carefully.",
        "The display is moving!",
        "The room fills with wind.",
        "Mina laughs with relief."
      ],
      "correct_index": 0,
      "explanation": "Close the window carefully. is the correct result. Check against the source example or number-place reasoning in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "Which is a useful cue for Mina''s first line?",
      "options": [
        "Very slow and sleepy",
        "Urgent but clear",
        "Silent throughout",
        "Unrelated laughter"
      ],
      "correct_index": 1,
      "explanation": "Urgent but clear is the correct result. Check against the source example or number-place reasoning in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "What does the narrator say?",
      "options": [
        "Only the characters'' words",
        "Actions outside spoken dialogue",
        "Every character''s lines at once",
        "Nothing about the room"
      ],
      "correct_index": 1,
      "explanation": "Actions outside spoken dialogue is the correct result. Check against the source example or number-place reasoning in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "Which punctuation ends Mina''s first line?",
      "options": [
        "Comma only",
        "Question mark",
        "Exclamation mark",
        "Semicolon"
      ],
      "correct_index": 2,
      "explanation": "Exclamation mark is the correct result. Check against the source example or number-place reasoning in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "Which speaker should say ''Close the window carefully''?",
      "options": [
        "Narrator",
        "Mina",
        "Oz",
        "An unnamed person"
      ],
      "correct_index": 2,
      "explanation": "Oz is the correct result. Check against the source example or number-place reasoning in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "Why can Mina laugh with relief at the end?",
      "options": [
        "Because the moving display problem is addressed",
        "Because the window was never open",
        "Because Oz left the museum",
        "Because the story names a birthday"
      ],
      "correct_index": 0,
      "explanation": "Because the moving display problem is addressed is the correct result. Check against the source example or number-place reasoning in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "What makes a second reading better?",
      "options": [
        "Changing the actual story words",
        "Making all voices identical",
        "Using text clues to adjust pauses and expression",
        "Reading faster without checking"
      ],
      "correct_index": 2,
      "explanation": "Using text clues to adjust pauses and expression is the correct result. Check against the source example or number-place reasoning in the lesson."
    },
    {
      "type": "short_answer",
      "question": "Complete the main readers'' theatre: bring dialogue to life challenge with supporting detail or working.",
      "sample_answer": "NARRATOR: A curtain lifts as wind fills the room. MINA (urgently): ''The display is moving!'' [pause] OZ (steadily): ''Close the window carefully.'' [pause] NARRATOR: Mina crosses the room and pulls the window shut. [pause] She laughs with relief.",
      "marking_guide": "Check the task''s specific requested facts, stages or calculations and supporting reasoning.",
      "explanation": "A complete answer makes the steps visible."
    },
    {
      "type": "short_answer",
      "question": "Explain a meaningful revision or check for readers'' theatre: bring dialogue to life.",
      "sample_answer": "I changed Mina''s first line to an urgent but clear voice because she calls out when the display moves. Oz sounds calm when giving instructions. I paused after Mina''s warning so the listener knows Oz is responding.",
      "marking_guide": "Accept evidence-based correction, with specific reasons rather than generic praise.",
      "explanation": "A check should improve correctness."
    }
  ],
  "parent_notes": "Parent: Ask the learner to explain the method and to identify which detail or place value supports the result. Do not provide the answer before the independent attempt.\n\nParent: **Model answer 1:** NARRATOR: A curtain lifts as wind fills the room. MINA (urgently): ''The display is moving!'' [pause] OZ (steadily): ''Close the window carefully.'' [pause] NARRATOR: Mina crosses the room and pulls the window shut. [pause] She laughs with relief.\n\nParent: **Model answer 2:** I changed Mina''s first line to an urgent but clear voice because she calls out when the display moves. Oz sounds calm when giving instructions. I paused after Mina''s warning so the listener knows Oz is responding.\n\nParent: Check both written responses and save the actual student evidence. Eight multiple choice items require eight correct under a 90% threshold; outcome codes need separate verification.",
  "evidence_instructions": "Save the guided readers'' theatre: bring dialogue to life exercises, independent task, corrected detail and two written quiz responses.",
  "offline_alternative": "Read the original text from paper, annotate or calculate by hand, and show a parent the answers or a photograph of the work.",
  "extension": "Make an original contrasting example that challenges a rule from readers'' theatre: bring dialogue to life and show how to solve it.",
  "stage_hints": {
    "accept": [
      "Review the task for Readers'' Theatre: Bring Dialogue to Life.",
      "Return to the original situation and find the exact evidence or number that matters for readers'' theatre: bring dialogue to life.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ],
    "teach0": [
      "Review the task for Identify each speaker and their words.",
      "Return to the original situation and find the exact evidence or number that matters for identify each speaker and their words.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ],
    "teach1": [
      "Review the task for Match voice to meaning and punctuation.",
      "Return to the original situation and find the exact evidence or number that matters for match voice to meaning and punctuation.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ],
    "teach2": [
      "Review the task for Share roles and pause for turns.",
      "Return to the original situation and find the exact evidence or number that matters for share roles and pause for turns.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ],
    "teach3": [
      "Review the task for Rehearse and revise expression.",
      "Return to the original situation and find the exact evidence or number that matters for rehearse and revise expression.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ],
    "learn": [
      "Review the task for Readers'' Theatre: Bring Dialogue to Life.",
      "Return to the original situation and find the exact evidence or number that matters for readers'' theatre: bring dialogue to life.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ],
    "guided": [
      "Review the task for Readers'' Theatre: Bring Dialogue to Life.",
      "Return to the original situation and find the exact evidence or number that matters for readers'' theatre: bring dialogue to life.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ],
    "write": [
      "Review the task for Readers'' Theatre: Bring Dialogue to Life.",
      "Return to the original situation and find the exact evidence or number that matters for readers'' theatre: bring dialogue to life.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ],
    "quiz": [
      "Review the task for Readers'' Theatre: Bring Dialogue to Life.",
      "Return to the original situation and find the exact evidence or number that matters for readers'' theatre: bring dialogue to life.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ],
    "submit": [
      "Review the task for Readers'' Theatre: Bring Dialogue to Life.",
      "Return to the original situation and find the exact evidence or number that matters for readers'' theatre: bring dialogue to life.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ]
  }
}'),updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE seed_key='s2-eng-y3-w03-l4';

-- s2-mat-y3-w03-l1
UPDATE lessons SET title='Number Names: Read and Write Large Numbers',data=json_patch(data,'{
  "seed_key": "s2-mat-y3-w03-l1",
  "title": "Number Names: Read and Write Large Numbers",
  "stage": "Stage 2",
  "learning_area": "Mathematics",
  "year_level": 3,
  "week": 3,
  "lesson_number": 1,
  "duration_minutes": 60,
  "child_mission": "Explore number names: read and write large numbers through original stories or numbers, guided practice and an independent mission.",
  "learning_intention": "We are learning to explain and apply number names: read and write large numbers with evidence or working.",
  "success_criteria": [
    "I can explain the central idea in my own words.",
    "I can follow a model and say why its steps work.",
    "I can complete guided practice and correct a mistake.",
    "I can solve the new independent challenge.",
    "I can give a reason for my final answer."
  ],
  "materials": [
    "All original reading and calculations are included.",
    "Optional paper and pencil for annotation."
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
      "title": "Recall the four key ideas",
      "cards": [
        {
          "front": "Read a number by place-value groups",
          "back": "For a four-digit number, start with **thousands**, then read the hundreds, tens and ones. Zeros can hold an empty place without being spoken as a separate number. Use the digits'' positions to understand the amount."
        },
        {
          "front": "Write number words from digits",
          "back": "Break the number into its place-value parts before writing. A compound number such as forty-two has a hyphen in standard English spelling. Spelling number names carefully avoids ambiguity."
        },
        {
          "front": "Turn number words into numerals",
          "back": "Listen for thousands, hundreds, tens and ones. Build a place-value chart, inserting zeros where a place is empty. Do not simply write the digits in the order you hear the words."
        },
        {
          "front": "Compare similar names and check",
          "back": "Two numbers can contain the same digits in different positions. Say each one aloud, expand it and compare the highest place where they differ. A digit''s value depends on where it sits."
        }
      ]
    }
  ],
  "printable_resource": {
    "title": "Number Names: Read and Write Large Numbers",
    "instructions": "Read the scenario and finish the guided and independent tasks before using the supplied feedback.",
    "passage": "A wildlife rescue has counted 6,042 visitors and later records 6,420 donations. The numbers use the same digits but mean different quantities.",
    "prompts": [
      "What is the important information?",
      "What method applies?",
      "What is my independent answer?",
      "How did I check or correct it?"
    ]
  },
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "🔎",
      "title": "Read a number by place-value groups",
      "explain": "**Understand:** For a four-digit number, start with **thousands**, then read the hundreds, tens and ones. Zeros can hold an empty place without being spoken as a separate number. Use the digits'' positions to understand the amount.\n\n**Our original situation:** A wildlife rescue has counted 6,042 visitors and later records 6,420 donations. The numbers use the same digits but mean different quantities.\n\n**Why this matters:** Good answers connect a specific part of the story or calculation to the rule, rather than simply naming a term.",
      "example": "**WATCH MY THINKING**\nIn 6,042 the 6 means six thousand, the 0 means no hundreds, the 4 means four tens and the 2 means two ones. I say **six thousand and forty-two**; I do not say sixty-four thousand two.\n\n**TRY THE NEXT STEP**\n**Wildlife number archive:** Convert these to numerals: ''four thousand and seventy-two'', ''eight thousand five hundred and nine'', and ''six thousand six hundred and sixty''. Convert 7,305, 9,014 and 5,480 into words. Expand 8,509 and compare it with 8,590, showing which digit place decides the order. Explain why 8,509 cannot be written as 859.\n\n**CHECK:** Compare your choice with the explanation. If your answer differs, identify which text clue, time word or number place you missed.",
      "notice": "For a four-digit number, start with **thousands**, then read the hundreds, tens and ones. Zeros can hold an empty place without being spoken as a separate number. Use the digits'' positions to understand the amount. Use the example to test your understanding.",
      "check": {
        "question": "''Four thousand and seventy-two'' is?",
        "options": [
          "472",
          "4,072",
          "4,720",
          "4,702"
        ],
        "correct_index": 1,
        "explanation": "4,072 — In 6,042 the 6 means six thousand, the 0 means no hundreds, the 4 means four tens and the 2 means two ones. I say **six thousand and forty-two**; I do not say sixty-four thousand two."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Learning clue: Number Names: Read and Write Large Numbers",
            "transcript": "Pip: Six thousand and forty-two. Shall I write 642?\nJuno: That loses the thousands. Make four columns first.\nPip: Six thousands, zero hundreds, four tens, two ones: 6,042.\nJuno: Great. Pause and read 6,420 aloud to compare. Explain your choice using one detail from the example, rather than guessing.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "Six thousand and forty-two. Shall I write 642?"
                  },
                  {
                    "who": "juno",
                    "text": "That loses the thousands. Make four columns first."
                  },
                  {
                    "who": "pip",
                    "text": "Six thousands, zero hundreds, four tens, two ones: 6,042."
                  },
                  {
                    "who": "juno",
                    "text": "Great. Pause and read 6,420 aloud to compare. Explain your choice using one detail from the example, rather than guessing.",
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
      "icon": "📘",
      "title": "Write number words from digits",
      "explain": "**Understand:** Break the number into its place-value parts before writing. A compound number such as forty-two has a hyphen in standard English spelling. Spelling number names carefully avoids ambiguity.\n\n**Our original situation:** A wildlife rescue has counted 6,042 visitors and later records 6,420 donations. The numbers use the same digits but mean different quantities.\n\n**Why this matters:** Good answers connect a specific part of the story or calculation to the rule, rather than simply naming a term.",
      "example": "**WATCH MY THINKING**\n6,420=6,000+400+20. I write **six thousand four hundred and twenty**. The last zero says there are no extra ones.\n\n**TRY THE NEXT STEP**\n**Wildlife number archive:** Convert these to numerals: ''four thousand and seventy-two'', ''eight thousand five hundred and nine'', and ''six thousand six hundred and sixty''. Convert 7,305, 9,014 and 5,480 into words. Expand 8,509 and compare it with 8,590, showing which digit place decides the order. Explain why 8,509 cannot be written as 859.\n\n**CHECK:** Compare your choice with the explanation. If your answer differs, identify which text clue, time word or number place you missed.",
      "notice": "Break the number into its place-value parts before writing. A compound number such as forty-two has a hyphen in standard English spelling. Spelling number names carefully avoids ambiguity. Use the example to test your understanding.",
      "check": {
        "question": "''Eight thousand five hundred and nine'' is?",
        "options": [
          "8,590",
          "8,509",
          "8,059",
          "8509 tens"
        ],
        "correct_index": 1,
        "explanation": "8,509 — 6,420=6,000+400+20. I write **six thousand four hundred and twenty**. The last zero says there are no extra ones."
      }
    },
    {
      "icon": "✏️",
      "title": "Turn number words into numerals",
      "explain": "**Understand:** Listen for thousands, hundreds, tens and ones. Build a place-value chart, inserting zeros where a place is empty. Do not simply write the digits in the order you hear the words.\n\n**Our original situation:** A wildlife rescue has counted 6,042 visitors and later records 6,420 donations. The numbers use the same digits but mean different quantities.\n\n**Why this matters:** Good answers connect a specific part of the story or calculation to the rule, rather than simply naming a term.",
      "example": "**WATCH MY THINKING**\n**Seven thousand and fifty-six** becomes 7 thousands, 0 hundreds, 5 tens, 6 ones: **7,056**. Writing 756 loses the thousands place.\n\n**TRY THE NEXT STEP**\n**Wildlife number archive:** Convert these to numerals: ''four thousand and seventy-two'', ''eight thousand five hundred and nine'', and ''six thousand six hundred and sixty''. Convert 7,305, 9,014 and 5,480 into words. Expand 8,509 and compare it with 8,590, showing which digit place decides the order. Explain why 8,509 cannot be written as 859.\n\n**CHECK:** Compare your choice with the explanation. If your answer differs, identify which text clue, time word or number place you missed.",
      "notice": "Listen for thousands, hundreds, tens and ones. Build a place-value chart, inserting zeros where a place is empty. Do not simply write the digits in the order you hear the words. Use the example to test your understanding.",
      "check": {
        "question": "''Six thousand six hundred and sixty'' is?",
        "options": [
          "6,066",
          "6,606",
          "6,660",
          "6,600"
        ],
        "correct_index": 2,
        "explanation": "6,660 — **Seven thousand and fifty-six** becomes 7 thousands, 0 hundreds, 5 tens, 6 ones: **7,056**. Writing 756 loses the thousands place."
      }
    },
    {
      "icon": "✅",
      "title": "Compare similar names and check",
      "explain": "**Understand:** Two numbers can contain the same digits in different positions. Say each one aloud, expand it and compare the highest place where they differ. A digit''s value depends on where it sits.\n\n**Our original situation:** A wildlife rescue has counted 6,042 visitors and later records 6,420 donations. The numbers use the same digits but mean different quantities.\n\n**Why this matters:** Good answers connect a specific part of the story or calculation to the rule, rather than simply naming a term.",
      "example": "**WATCH MY THINKING**\n6,042 is six thousand and forty-two; 6,420 is six thousand four hundred and twenty. The hundreds place differs: 0 against 4, so 6,420 is larger by 378.\n\n**TRY THE NEXT STEP**\n**Wildlife number archive:** Convert these to numerals: ''four thousand and seventy-two'', ''eight thousand five hundred and nine'', and ''six thousand six hundred and sixty''. Convert 7,305, 9,014 and 5,480 into words. Expand 8,509 and compare it with 8,590, showing which digit place decides the order. Explain why 8,509 cannot be written as 859.\n\n**CHECK:** Compare your choice with the explanation. If your answer differs, identify which text clue, time word or number place you missed.",
      "notice": "Two numbers can contain the same digits in different positions. Say each one aloud, expand it and compare the highest place where they differ. A digit''s value depends on where it sits. Use the example to test your understanding.",
      "check": {
        "question": "What is 9,014 in words?",
        "options": [
          "Nine thousand and fourteen",
          "Nine hundred and fourteen",
          "Nine thousand and forty",
          "Nine thousand one hundred and four"
        ],
        "correct_index": 0,
        "explanation": "Nine thousand and fourteen — 6,042 is six thousand and forty-two; 6,420 is six thousand four hundred and twenty. The hundreds place differs: 0 against 4, so 6,420 is larger by 378."
      }
    }
  ],
  "worked_example": "## Work through the example\n\nA wildlife rescue has counted 6,042 visitors and later records 6,420 donations. The numbers use the same digits but mean different quantities.\n\n**1. Read a number by place-value groups.** In 6,042 the 6 means six thousand, the 0 means no hundreds, the 4 means four tens and the 2 means two ones. I say **six thousand and forty-two**; I do not say sixty-four thousand two.\n\n**2. Write number words from digits.** 6,420=6,000+400+20. I write **six thousand four hundred and twenty**. The last zero says there are no extra ones.\n\n**3. Turn number words into numerals.** **Seven thousand and fifty-six** becomes 7 thousands, 0 hundreds, 5 tens, 6 ones: **7,056**. Writing 756 loses the thousands place.\n\n**4. Compare similar names and check.** 6,042 is six thousand and forty-two; 6,420 is six thousand four hundred and twenty. The hundreds place differs: 0 against 4, so 6,420 is larger by 378.\n\n**Review:** Explain how the examples connect to the rules and what error you would avoid.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 580 215\"><rect width=\"580\" height=\"215\" rx=\"12\" fill=\"#f4f8f6\"/><text x=\"18\" y=\"36\" font-family=\"Arial\" font-size=\"20\" fill=\"#1d4031\">Digits into number words</text><rect x=\"18\" y=\"76\" width=\"128\" height=\"95\" rx=\"9\" fill=\"#dbeee3\"/><text x=\"32\" y=\"129\" font-family=\"Arial\" font-size=\"19\" fill=\"#233f35\">Find</text><rect x=\"159\" y=\"76\" width=\"128\" height=\"95\" rx=\"9\" fill=\"#e5eafb\"/><text x=\"173\" y=\"129\" font-family=\"Arial\" font-size=\"19\" fill=\"#233f35\">Model</text><rect x=\"300\" y=\"76\" width=\"128\" height=\"95\" rx=\"9\" fill=\"#dbeee3\"/><text x=\"314\" y=\"129\" font-family=\"Arial\" font-size=\"19\" fill=\"#233f35\">Try</text><rect x=\"441\" y=\"76\" width=\"128\" height=\"95\" rx=\"9\" fill=\"#e5eafb\"/><text x=\"455\" y=\"129\" font-family=\"Arial\" font-size=\"19\" fill=\"#233f35\">Check</text></svg>",
      "alt": "A four-part learning sequence for Number Names: Read and Write Large Numbers: find, model, try and check.",
      "caption": "Use the teaching stages to follow and verify your work."
    }
  ],
  "guided_practice": "**Practice the four places:**\n1. Read 5,018: **five thousand and eighteen** (zero hundreds and one ten).\n2. Write ''eight thousand three hundred and six'': **8,306**.\n3. Expand 7,090: **7,000+90**, read **seven thousand and ninety**.\n4. Compare 5,018 and 5,180: **5,180 is larger**, because it has one hundred rather than zero hundreds.\n\n**Try before checking:** ''nine thousand and forty-five'' = **9,045**. ''Six thousand six hundred and six'' = **6,606**. Re-read any confusing zero with the place-value chart.",
  "independent_task": "**Wildlife number archive:** Convert these to numerals: ''four thousand and seventy-two'', ''eight thousand five hundred and nine'', and ''six thousand six hundred and sixty''. Convert 7,305, 9,014 and 5,480 into words. Expand 8,509 and compare it with 8,590, showing which digit place decides the order. Explain why 8,509 cannot be written as 859.",
  "response_prompt": "Complete the number names: read and write large numbers mission. Show evidence or working and explain one improvement.",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "''Four thousand and seventy-two'' is?",
      "options": [
        "472",
        "4,072",
        "4,720",
        "4,702"
      ],
      "correct_index": 1,
      "explanation": "4,072 is the correct result. Check against the source example or number-place reasoning in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "''Eight thousand five hundred and nine'' is?",
      "options": [
        "8,590",
        "8,509",
        "8,059",
        "8509 tens"
      ],
      "correct_index": 1,
      "explanation": "8,509 is the correct result. Check against the source example or number-place reasoning in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "''Six thousand six hundred and sixty'' is?",
      "options": [
        "6,066",
        "6,606",
        "6,660",
        "6,600"
      ],
      "correct_index": 2,
      "explanation": "6,660 is the correct result. Check against the source example or number-place reasoning in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "What is 9,014 in words?",
      "options": [
        "Nine thousand and fourteen",
        "Nine hundred and fourteen",
        "Nine thousand and forty",
        "Nine thousand one hundred and four"
      ],
      "correct_index": 0,
      "explanation": "Nine thousand and fourteen is the correct result. Check against the source example or number-place reasoning in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "What does 5 represent in 8,509?",
      "options": [
        "Five ones",
        "Five tens",
        "Five hundreds",
        "Five thousands"
      ],
      "correct_index": 2,
      "explanation": "Five hundreds is the correct result. Check against the source example or number-place reasoning in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "Which numeral means seven thousand three hundred and five?",
      "options": [
        "7,035",
        "7,350",
        "7,305",
        "7305 tens"
      ],
      "correct_index": 2,
      "explanation": "7,305 is the correct result. Check against the source example or number-place reasoning in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "Which is larger?",
      "options": [
        "8,509",
        "8,590",
        "They are equal",
        "Both are below 8,000"
      ],
      "correct_index": 1,
      "explanation": "8,590 is the correct result. Check against the source example or number-place reasoning in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "What is the expanded form of 8,509?",
      "options": [
        "8,000+500+9",
        "8,000+50+9",
        "800+500+9",
        "8,000+500+90"
      ],
      "correct_index": 0,
      "explanation": "8,000+500+9 is the correct result. Check against the source example or number-place reasoning in the lesson."
    },
    {
      "type": "short_answer",
      "question": "Complete the main number names: read and write large numbers challenge with supporting detail or working.",
      "sample_answer": "Four thousand and seventy-two = 4,072; eight thousand five hundred and nine = 8,509; six thousand six hundred and sixty = 6,660. 7,305 is seven thousand three hundred and five; 9,014 is nine thousand and fourteen; 5,480 is five thousand four hundred and eighty.",
      "marking_guide": "Check the task''s specific requested facts, stages or calculations and supporting reasoning.",
      "explanation": "A complete answer makes the steps visible."
    },
    {
      "type": "short_answer",
      "question": "Explain a meaningful revision or check for number names: read and write large numbers.",
      "sample_answer": "8,509 = 8,000+500+9. It is smaller than 8,590, because 8,590 has nine tens while 8,509 has zero tens. 859 is incorrect because it puts eight in hundreds rather than thousands.",
      "marking_guide": "Accept evidence-based correction, with specific reasons rather than generic praise.",
      "explanation": "A check should improve correctness."
    }
  ],
  "parent_notes": "Parent: Ask the learner to explain the method and to identify which detail or place value supports the result. Do not provide the answer before the independent attempt.\n\nParent: **Model answer 1:** Four thousand and seventy-two = 4,072; eight thousand five hundred and nine = 8,509; six thousand six hundred and sixty = 6,660. 7,305 is seven thousand three hundred and five; 9,014 is nine thousand and fourteen; 5,480 is five thousand four hundred and eighty.\n\nParent: **Model answer 2:** 8,509 = 8,000+500+9. It is smaller than 8,590, because 8,590 has nine tens while 8,509 has zero tens. 859 is incorrect because it puts eight in hundreds rather than thousands.\n\nParent: Check both written responses and save the actual student evidence. Eight multiple choice items require eight correct under a 90% threshold; outcome codes need separate verification.",
  "evidence_instructions": "Save the guided number names: read and write large numbers exercises, independent task, corrected detail and two written quiz responses.",
  "offline_alternative": "Read the original text from paper, annotate or calculate by hand, and show a parent the answers or a photograph of the work.",
  "extension": "Make an original contrasting example that challenges a rule from number names: read and write large numbers and show how to solve it.",
  "stage_hints": {
    "accept": [
      "Review the task for Number Names: Read and Write Large Numbers.",
      "Return to the original situation and find the exact evidence or number that matters for number names: read and write large numbers.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ],
    "teach0": [
      "Review the task for Read a number by place-value groups.",
      "Return to the original situation and find the exact evidence or number that matters for read a number by place-value groups.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ],
    "teach1": [
      "Review the task for Write number words from digits.",
      "Return to the original situation and find the exact evidence or number that matters for write number words from digits.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ],
    "teach2": [
      "Review the task for Turn number words into numerals.",
      "Return to the original situation and find the exact evidence or number that matters for turn number words into numerals.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ],
    "teach3": [
      "Review the task for Compare similar names and check.",
      "Return to the original situation and find the exact evidence or number that matters for compare similar names and check.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ],
    "learn": [
      "Review the task for Number Names: Read and Write Large Numbers.",
      "Return to the original situation and find the exact evidence or number that matters for number names: read and write large numbers.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ],
    "guided": [
      "Review the task for Number Names: Read and Write Large Numbers.",
      "Return to the original situation and find the exact evidence or number that matters for number names: read and write large numbers.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ],
    "write": [
      "Review the task for Number Names: Read and Write Large Numbers.",
      "Return to the original situation and find the exact evidence or number that matters for number names: read and write large numbers.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ],
    "quiz": [
      "Review the task for Number Names: Read and Write Large Numbers.",
      "Return to the original situation and find the exact evidence or number that matters for number names: read and write large numbers.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ],
    "submit": [
      "Review the task for Number Names: Read and Write Large Numbers.",
      "Return to the original situation and find the exact evidence or number that matters for number names: read and write large numbers.",
      "Explain why your chosen detail supports the answer; then compare with the worked model and correct a specific step."
    ]
  }
}'),updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE seed_key='s2-mat-y3-w03-l1';
