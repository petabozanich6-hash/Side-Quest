-- Stage 2 Year 3 substantive Gold-depth corrections: English W5 L2-4, Maths W5 L1.

-- s2-eng-y3-w05-l2
UPDATE lessons SET title='Story Repair Shop: Resolve, Revise and Edit',data=json_patch(data,'{
  "seed_key": "s2-eng-y3-w05-l2",
  "title": "Story Repair Shop: Resolve, Revise and Edit",
  "stage": "Stage 2",
  "learning_area": "English",
  "year_level": 3,
  "week": 5,
  "lesson_number": 2,
  "duration_minutes": 60,
  "child_mission": "Become a story repair shop: resolve, revise and edit detective: understand a model, practise, then solve an original task.",
  "learning_intention": "We are learning to use story repair shop: resolve, revise and edit with clear evidence or working.",
  "success_criteria": [
    "I can explain the concept in my own words.",
    "I can follow a complete worked example.",
    "I can answer guided questions and use the feedback.",
    "I can complete the original independent task.",
    "I can check and explain a meaningful improvement."
  ],
  "materials": [
    "All original example texts and teaching are provided.",
    "Optional pencil, paper and twenty counters for the maths lesson."
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
      "title": "Recall the teaching concepts",
      "cards": [
        {
          "front": "Understand a resolution",
          "back": "A **resolution** shows what happens to the central problem by the story''s ending. It must relate to the complication instead of suddenly changing the subject."
        },
        {
          "front": "Revise ideas and sequence",
          "back": "**Revising** improves meaning, details, order or logic. Read the whole story and ask whether each action follows from the previous event."
        },
        {
          "front": "Edit sentences accurately",
          "back": "**Editing** checks spelling, punctuation, capitals and grammar after you are happy with the story''s meaning."
        },
        {
          "front": "Proofread and evaluate",
          "back": "Read slowly to check that characters'' names, tense, and dialogue punctuation stay clear. A final check must consider **both** story logic and sentence correctness."
        }
      ]
    }
  ],
  "printable_resource": {
    "title": "Story Repair Shop: Resolve, Revise and Edit",
    "instructions": "Read the scenario, work through the teaching and guided practice, then complete the independent challenge.",
    "passage": "On Thursday, Tahlia''s model windmill stopped spinning before the science display. She noticed a bent blade, replaced it with cardboard and tested the windmill again. The blades turned.",
    "prompts": [
      "What is the main concept?",
      "Show one relevant worked step.",
      "Complete your own answer.",
      "What did you change and why?"
    ]
  },
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "🔎",
      "title": "Understand a resolution",
      "explain": "**Learn:** A **resolution** shows what happens to the central problem by the story''s ending. It must relate to the complication instead of suddenly changing the subject.\n\n**Original situation:** On Thursday, Tahlia''s model windmill stopped spinning before the science display. She noticed a bent blade, replaced it with cardboard and tested the windmill again. The blades turned.\n\n**Focus:** Find a specific piece of evidence, verb form, punctuation mark or calculation that connects to this teaching point.",
      "example": "**WATCH MY THINKING**\nProblem: the windmill stops. Resolution: Tahlia replaces the bent blade and the windmill spins again. A surprise trip to the moon would not resolve the windmill problem.\n\n**TRY A NEW EXAMPLE**\n**Fix this micro-story:** ''Rami''s kite string snapped the kite floated away. Rami ran to the fence. The kite was there he tied on a new string and flew it again.'' (1) Name the problem; (2) state the resolution; (3) rewrite with capitals and punctuation; (4) add one precise action. **Model:** ''Rami''s kite string snapped, and the kite drifted to the fence. Rami caught the kite, tied on a new string and flew it again.'' Problem: snapped string. Resolution: recovered kite and replacement string.\n\n**CHECK YOUR ANSWER**\nCompare your answer with the worked reasoning. If it differs, name the exact correction.",
      "notice": "A **resolution** shows what happens to the central problem by the story''s ending. It must relate to the complication instead of suddenly changing the subject.",
      "check": {
        "question": "What is the original garden story''s remaining problem?",
        "options": [
          "The pots are broken.",
          "The day is Monday.",
          "Zara has a friend.",
          "The seedlings are green."
        ],
        "correct_index": 0,
        "explanation": "The pots are broken.. Problem: the windmill stops. Resolution: Tahlia replaces the bent blade and the windmill spins again. A surprise trip to the moon would not resolve the windmill problem."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Learning Story Repair Shop: Resolve, Revise and Edit",
            "transcript": "Pip: The windmill stopped, but the story ends with a picnic. Is that a resolution?\nJuno: Not to the windmill problem. An ending should connect to what went wrong.\nPip: Tahlia replaces the bent blade, then tests it. That''s connected.\nJuno: Exactly. Pause and name one edit you would check after revising the ending.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "The windmill stopped, but the story ends with a picnic. Is that a resolution?"
                  },
                  {
                    "who": "juno",
                    "text": "Not to the windmill problem. An ending should connect to what went wrong."
                  },
                  {
                    "who": "pip",
                    "text": "Tahlia replaces the bent blade, then tests it. That''s connected."
                  },
                  {
                    "who": "juno",
                    "text": "Exactly. Pause and name one edit you would check after revising the ending.",
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
      "icon": "📚",
      "title": "Revise ideas and sequence",
      "explain": "**Learn:** **Revising** improves meaning, details, order or logic. Read the whole story and ask whether each action follows from the previous event.\n\n**Original situation:** On Thursday, Tahlia''s model windmill stopped spinning before the science display. She noticed a bent blade, replaced it with cardboard and tested the windmill again. The blades turned.\n\n**Focus:** Find a specific piece of evidence, verb form, punctuation mark or calculation that connects to this teaching point.",
      "example": "**WATCH MY THINKING**\nOriginal: ''Tahlia fixed it. It worked.'' Revised: ''She spotted the bent blade, replaced it and tested the windmill. The blades spun smoothly.'' The new version explains how it works.\n\n**TRY A NEW EXAMPLE**\n**Fix this micro-story:** ''Rami''s kite string snapped the kite floated away. Rami ran to the fence. The kite was there he tied on a new string and flew it again.'' (1) Name the problem; (2) state the resolution; (3) rewrite with capitals and punctuation; (4) add one precise action. **Model:** ''Rami''s kite string snapped, and the kite drifted to the fence. Rami caught the kite, tied on a new string and flew it again.'' Problem: snapped string. Resolution: recovered kite and replacement string.\n\n**CHECK YOUR ANSWER**\nCompare your answer with the worked reasoning. If it differs, name the exact correction.",
      "notice": "**Revising** improves meaning, details, order or logic. Read the whole story and ask whether each action follows from the previous event.",
      "check": {
        "question": "Which ending resolves the broken pots?",
        "options": [
          "Zara and Jo transfer seedlings into safe new pots.",
          "A bird lands elsewhere.",
          "The wind becomes purple.",
          "Zara forgets the seedlings."
        ],
        "correct_index": 0,
        "explanation": "Zara and Jo transfer seedlings into safe new pots.. Original: ''Tahlia fixed it. It worked.'' Revised: ''She spotted the bent blade, replaced it and tested the windmill. The blades spun smoothly.'' The new version explains how it works."
      }
    },
    {
      "icon": "✏️",
      "title": "Edit sentences accurately",
      "explain": "**Learn:** **Editing** checks spelling, punctuation, capitals and grammar after you are happy with the story''s meaning.\n\n**Original situation:** On Thursday, Tahlia''s model windmill stopped spinning before the science display. She noticed a bent blade, replaced it with cardboard and tested the windmill again. The blades turned.\n\n**Focus:** Find a specific piece of evidence, verb form, punctuation mark or calculation that connects to this teaching point.",
      "example": "**WATCH MY THINKING**\nI change ''tahlia fixed the blade it turned'' to ''Tahlia fixed the blade. It turned.'' I use a capital for the name and full stops between complete ideas.\n\n**TRY A NEW EXAMPLE**\n**Fix this micro-story:** ''Rami''s kite string snapped the kite floated away. Rami ran to the fence. The kite was there he tied on a new string and flew it again.'' (1) Name the problem; (2) state the resolution; (3) rewrite with capitals and punctuation; (4) add one precise action. **Model:** ''Rami''s kite string snapped, and the kite drifted to the fence. Rami caught the kite, tied on a new string and flew it again.'' Problem: snapped string. Resolution: recovered kite and replacement string.\n\n**CHECK YOUR ANSWER**\nCompare your answer with the worked reasoning. If it differs, name the exact correction.",
      "notice": "**Editing** checks spelling, punctuation, capitals and grammar after you are happy with the story''s meaning.",
      "check": {
        "question": "Which change is an edit?",
        "options": [
          "Adding a clearer solution",
          "Correcting ''zara'' to ''Zara''",
          "Changing the plot order",
          "Explaining why Jo helps"
        ],
        "correct_index": 1,
        "explanation": "Correcting ''zara'' to ''Zara''. I change ''tahlia fixed the blade it turned'' to ''Tahlia fixed the blade. It turned.'' I use a capital for the name and full stops between complete ideas."
      }
    },
    {
      "icon": "✅",
      "title": "Proofread and evaluate",
      "explain": "**Learn:** Read slowly to check that characters'' names, tense, and dialogue punctuation stay clear. A final check must consider **both** story logic and sentence correctness.\n\n**Original situation:** On Thursday, Tahlia''s model windmill stopped spinning before the science display. She noticed a bent blade, replaced it with cardboard and tested the windmill again. The blades turned.\n\n**Focus:** Find a specific piece of evidence, verb form, punctuation mark or calculation that connects to this teaching point.",
      "example": "**WATCH MY THINKING**\nI check that ''stopped'' and ''replaced'' stay in past tense and that the resolution answers the original problem. Then I reread for capitals and stops.\n\n**TRY A NEW EXAMPLE**\n**Fix this micro-story:** ''Rami''s kite string snapped the kite floated away. Rami ran to the fence. The kite was there he tied on a new string and flew it again.'' (1) Name the problem; (2) state the resolution; (3) rewrite with capitals and punctuation; (4) add one precise action. **Model:** ''Rami''s kite string snapped, and the kite drifted to the fence. Rami caught the kite, tied on a new string and flew it again.'' Problem: snapped string. Resolution: recovered kite and replacement string.\n\n**CHECK YOUR ANSWER**\nCompare your answer with the worked reasoning. If it differs, name the exact correction.",
      "notice": "Read slowly to check that characters'' names, tense, and dialogue punctuation stay clear. A final check must consider **both** story logic and sentence correctness.",
      "check": {
        "question": "Which change is a revision?",
        "options": [
          "Capitalising Monday",
          "Adding a full stop",
          "Explaining how the seedlings get replacement pots",
          "Correcting a spelling error"
        ],
        "correct_index": 2,
        "explanation": "Explaining how the seedlings get replacement pots. I check that ''stopped'' and ''replaced'' stay in past tense and that the resolution answers the original problem. Then I reread for capitals and stops."
      }
    }
  ],
  "worked_example": "## Complete teacher model\n\nOn Thursday, Tahlia''s model windmill stopped spinning before the science display. She noticed a bent blade, replaced it with cardboard and tested the windmill again. The blades turned.\n\n**1. Understand a resolution:** Problem: the windmill stops. Resolution: Tahlia replaces the bent blade and the windmill spins again. A surprise trip to the moon would not resolve the windmill problem.\n\n**2. Revise ideas and sequence:** Original: ''Tahlia fixed it. It worked.'' Revised: ''She spotted the bent blade, replaced it and tested the windmill. The blades spun smoothly.'' The new version explains how it works.\n\n**3. Edit sentences accurately:** I change ''tahlia fixed the blade it turned'' to ''Tahlia fixed the blade. It turned.'' I use a capital for the name and full stops between complete ideas.\n\n**4. Proofread and evaluate:** I check that ''stopped'' and ''replaced'' stay in past tense and that the resolution answers the original problem. Then I reread for capitals and stops.\n\n**Self-check:** Tell someone which part of the model changes the answer and which mistake it avoids.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 560 210\"><rect width=\"560\" height=\"210\" rx=\"12\" fill=\"#f3f8f6\"/><text x=\"18\" y=\"35\" font-family=\"Arial\" font-size=\"19\" fill=\"#163e31\">Solve, revise and edit</text><rect x=\"12\" y=\"70\" width=\"129\" height=\"104\" rx=\"9\" fill=\"#dfede4\"/><text x=\"22\" y=\"127\" font-family=\"Arial\" font-size=\"17\" fill=\"#1c4031\">LEARN</text><rect x=\"151\" y=\"70\" width=\"129\" height=\"104\" rx=\"9\" fill=\"#e6ecfa\"/><text x=\"161\" y=\"127\" font-family=\"Arial\" font-size=\"17\" fill=\"#1c4031\">MODEL</text><rect x=\"290\" y=\"70\" width=\"129\" height=\"104\" rx=\"9\" fill=\"#dfede4\"/><text x=\"300\" y=\"127\" font-family=\"Arial\" font-size=\"17\" fill=\"#1c4031\">TRY</text><rect x=\"429\" y=\"70\" width=\"129\" height=\"104\" rx=\"9\" fill=\"#e6ecfa\"/><text x=\"439\" y=\"127\" font-family=\"Arial\" font-size=\"17\" fill=\"#1c4031\">CHECK</text></svg>",
      "alt": "Four-step instructional reminder for Story Repair Shop: Resolve, Revise and Edit: learn, model, try, check.",
      "caption": "Use each step to support and check your independent work."
    }
  ],
  "guided_practice": "**Fix this micro-story:** ''Rami''s kite string snapped the kite floated away. Rami ran to the fence. The kite was there he tied on a new string and flew it again.'' (1) Name the problem; (2) state the resolution; (3) rewrite with capitals and punctuation; (4) add one precise action. **Model:** ''Rami''s kite string snapped, and the kite drifted to the fence. Rami caught the kite, tied on a new string and flew it again.'' Problem: snapped string. Resolution: recovered kite and replacement string.",
  "independent_task": "**Edit the garden story:** ''on monday zara put seedlings on the shelf a strong wind knocked two pots down. zara look for them. her friend jo helps. they put the plants back but the pots were still broken.'' Rewrite this as a coherent 5–7 sentence story with correct capitals, punctuation and consistent past tense. Give it a genuine resolution for the broken pots, not only the moved seedlings. Show two edits and one revision, explaining the difference.",
  "response_prompt": "Complete the story repair shop: resolve, revise and edit task in your own work. Include evidence or calculations and one explained correction.",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "What is the original garden story''s remaining problem?",
      "options": [
        "The pots are broken.",
        "The day is Monday.",
        "Zara has a friend.",
        "The seedlings are green."
      ],
      "correct_index": 0,
      "explanation": "The pots are broken.. This matches the lesson text or the worked arithmetic."
    },
    {
      "type": "multiple_choice",
      "question": "Which ending resolves the broken pots?",
      "options": [
        "Zara and Jo transfer seedlings into safe new pots.",
        "A bird lands elsewhere.",
        "The wind becomes purple.",
        "Zara forgets the seedlings."
      ],
      "correct_index": 0,
      "explanation": "Zara and Jo transfer seedlings into safe new pots.. This matches the lesson text or the worked arithmetic."
    },
    {
      "type": "multiple_choice",
      "question": "Which change is an edit?",
      "options": [
        "Adding a clearer solution",
        "Correcting ''zara'' to ''Zara''",
        "Changing the plot order",
        "Explaining why Jo helps"
      ],
      "correct_index": 1,
      "explanation": "Correcting ''zara'' to ''Zara''. This matches the lesson text or the worked arithmetic."
    },
    {
      "type": "multiple_choice",
      "question": "Which change is a revision?",
      "options": [
        "Capitalising Monday",
        "Adding a full stop",
        "Explaining how the seedlings get replacement pots",
        "Correcting a spelling error"
      ],
      "correct_index": 2,
      "explanation": "Explaining how the seedlings get replacement pots. This matches the lesson text or the worked arithmetic."
    },
    {
      "type": "multiple_choice",
      "question": "Which sentence uses consistent past tense?",
      "options": [
        "Zara looked and Jo helped.",
        "Zara look and Jo helped.",
        "Zara will look and Jo helped.",
        "Zara looks and Jo helps yesterday."
      ],
      "correct_index": 0,
      "explanation": "Zara looked and Jo helped.. This matches the lesson text or the worked arithmetic."
    },
    {
      "type": "multiple_choice",
      "question": "What punctuation separates two complete sentences?",
      "options": [
        "A full stop",
        "A random apostrophe",
        "No punctuation",
        "A slash in every sentence"
      ],
      "correct_index": 0,
      "explanation": "A full stop. This matches the lesson text or the worked arithmetic."
    },
    {
      "type": "multiple_choice",
      "question": "Why isn''t ''They put plants back'' enough?",
      "options": [
        "It does not resolve the broken containers.",
        "It is too many words.",
        "The story needs a dragon.",
        "The plants never existed."
      ],
      "correct_index": 0,
      "explanation": "It does not resolve the broken containers.. This matches the lesson text or the worked arithmetic."
    },
    {
      "type": "multiple_choice",
      "question": "Which is a useful final check?",
      "options": [
        "Check plot resolution and sentence accuracy.",
        "Only count letters.",
        "Add unrelated events.",
        "Ignore the original problem."
      ],
      "correct_index": 0,
      "explanation": "Check plot resolution and sentence accuracy.. This matches the lesson text or the worked arithmetic."
    },
    {
      "type": "short_answer",
      "question": "Complete the original story repair shop: resolve, revise and edit independent challenge.",
      "sample_answer": "On Monday, Zara placed seedlings on a shelf. A strong wind knocked over two pots. Zara searched for the seedlings, and Jo helped her gather them. They found two spare pots and carefully replanted the seedlings. By the end, the plants stood safely on the shelf again.",
      "marking_guide": "Require an accurate response to the full prompt, not just copied definitions. Check relevant workings or story evidence.",
      "explanation": "A complete answer explains the result."
    },
    {
      "type": "short_answer",
      "question": "Explain a relevant correction or checking strategy in story repair shop: resolve, revise and edit.",
      "sample_answer": "I edited capitals in ''On Monday'' and Zara, and added missing full stops. I revised the ending by introducing safe replacement pots, which solves the problem of the broken containers. Revising improves the story; editing corrects mechanics.",
      "marking_guide": "Look for a specific correction, justification and accurate use of the taught method.",
      "explanation": "An effective improvement must be connected to the original task."
    }
  ],
  "parent_notes": "Parent: Have the learner demonstrate one original example before showing the model. Support age-appropriate reading without supplying the independent answer.\n\nParent: **Written response model one.** On Monday, Zara placed seedlings on a shelf. A strong wind knocked over two pots. Zara searched for the seedlings, and Jo helped her gather them. They found two spare pots and carefully replanted the seedlings. By the end, the plants stood safely on the shelf again.\n\nParent: **Written response model two.** I edited capitals in ''On Monday'' and Zara, and added missing full stops. I revised the ending by introducing safe replacement pots, which solves the problem of the broken containers. Revising improves the story; editing corrects mechanics.\n\nParent: Check the student''s actual independent evidence and both written items. The eight multiple-choice questions require 8/8 at the existing 90% threshold. NESA alignment is not yet verified.",
  "evidence_instructions": "Save the guided work, independent story repair shop: resolve, revise and edit response, one correction and two written quiz answers.",
  "offline_alternative": "Read and complete the original teaching and challenge using paper, a pencil or a suitable accessible approach; keep evidence.",
  "extension": "Invent a contrasting story repair shop: resolve, revise and edit case and show the new worked solution.",
  "stage_hints": {
    "accept": [
      "Read the instruction for Story Repair Shop: Resolve, Revise and Edit.",
      "Find a concrete detail in the original story or number model connected to story repair shop: resolve, revise and edit.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ],
    "teach0": [
      "Read the instruction for Understand a resolution.",
      "Find a concrete detail in the original story or number model connected to understand a resolution.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ],
    "teach1": [
      "Read the instruction for Revise ideas and sequence.",
      "Find a concrete detail in the original story or number model connected to revise ideas and sequence.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ],
    "teach2": [
      "Read the instruction for Edit sentences accurately.",
      "Find a concrete detail in the original story or number model connected to edit sentences accurately.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ],
    "teach3": [
      "Read the instruction for Proofread and evaluate.",
      "Find a concrete detail in the original story or number model connected to proofread and evaluate.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ],
    "learn": [
      "Read the instruction for Story Repair Shop: Resolve, Revise and Edit.",
      "Find a concrete detail in the original story or number model connected to story repair shop: resolve, revise and edit.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ],
    "guided": [
      "Read the instruction for Story Repair Shop: Resolve, Revise and Edit.",
      "Find a concrete detail in the original story or number model connected to story repair shop: resolve, revise and edit.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ],
    "write": [
      "Read the instruction for Story Repair Shop: Resolve, Revise and Edit.",
      "Find a concrete detail in the original story or number model connected to story repair shop: resolve, revise and edit.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ],
    "quiz": [
      "Read the instruction for Story Repair Shop: Resolve, Revise and Edit.",
      "Find a concrete detail in the original story or number model connected to story repair shop: resolve, revise and edit.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ],
    "submit": [
      "Read the instruction for Story Repair Shop: Resolve, Revise and Edit.",
      "Find a concrete detail in the original story or number model connected to story repair shop: resolve, revise and edit.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ]
  }
}'),updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE seed_key='s2-eng-y3-w05-l2';

-- s2-eng-y3-w05-l3
UPDATE lessons SET title='Speech Marks: Punctuate Dialogue',data=json_patch(data,'{
  "seed_key": "s2-eng-y3-w05-l3",
  "title": "Speech Marks: Punctuate Dialogue",
  "stage": "Stage 2",
  "learning_area": "English",
  "year_level": 3,
  "week": 5,
  "lesson_number": 3,
  "duration_minutes": 60,
  "child_mission": "Become a speech marks: punctuate dialogue detective: understand a model, practise, then solve an original task.",
  "learning_intention": "We are learning to use speech marks: punctuate dialogue with clear evidence or working.",
  "success_criteria": [
    "I can explain the concept in my own words.",
    "I can follow a complete worked example.",
    "I can answer guided questions and use the feedback.",
    "I can complete the original independent task.",
    "I can check and explain a meaningful improvement."
  ],
  "materials": [
    "All original example texts and teaching are provided.",
    "Optional pencil, paper and twenty counters for the maths lesson."
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
      "title": "Recall the teaching concepts",
      "cards": [
        {
          "front": "Find spoken words and speech marks",
          "back": "Quotation marks show the exact words spoken by a character. The speaker tag identifies who spoke. In Australian school writing, single or double quotation marks may be used consistently; follow your taught classroom convention."
        },
        {
          "front": "Place capitals and end punctuation",
          "back": "In direct speech, the first spoken word begins with a capital. A question takes a question mark and excited speech can take an exclamation mark. Put punctuation within the closing quotation mark."
        },
        {
          "front": "Add the speaker tag clearly",
          "back": "Use commas where a speaker tag introduces or follows dialogue. For a statement followed by ''said Mira'', a comma often replaces the full stop inside the closing mark."
        },
        {
          "front": "Start a new line for a new speaker",
          "back": "Readers need to know when the speaker changes. In story dialogue, begin a new paragraph for a new speaker and keep the punctuation consistent."
        }
      ]
    }
  ],
  "printable_resource": {
    "title": "Speech Marks: Punctuate Dialogue",
    "instructions": "Read the scenario, work through the teaching and guided practice, then complete the independent challenge.",
    "passage": "Mira said, ''I found the map.'' Then Kai asked, ''Where was it?'' Mira replied, ''Under the table!''",
    "prompts": [
      "What is the main concept?",
      "Show one relevant worked step.",
      "Complete your own answer.",
      "What did you change and why?"
    ]
  },
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "🔎",
      "title": "Find spoken words and speech marks",
      "explain": "**Learn:** Quotation marks show the exact words spoken by a character. The speaker tag identifies who spoke. In Australian school writing, single or double quotation marks may be used consistently; follow your taught classroom convention.\n\n**Original situation:** Mira said, ''I found the map.'' Then Kai asked, ''Where was it?'' Mira replied, ''Under the table!''\n\n**Focus:** Find a specific piece of evidence, verb form, punctuation mark or calculation that connects to this teaching point.",
      "example": "**WATCH MY THINKING**\nIn Mira said, ''I found the map.'', the spoken words are ''I found the map.'' The words Mira said are narration, not part of her direct speech.\n\n**TRY A NEW EXAMPLE**\n**Repair these lines:**\n1. lina said i lost my keys → **Lina said, ''I lost my keys.''**\n2. where are they asked sam → **''Where are they?'' asked Sam.**\n3. i saw them here said lina → **''I saw them here,'' said Lina.**\n4. Separate Lina''s and Sam''s turns into paragraphs. Explain why the question mark stays inside the quotation marks. Note: choose single quotes for this practice and stay consistent.\n\n**CHECK YOUR ANSWER**\nCompare your answer with the worked reasoning. If it differs, name the exact correction.",
      "notice": "Quotation marks show the exact words spoken by a character. The speaker tag identifies who spoke. In Australian school writing, single or double quotation marks may be used consistently; follow your taught classroom convention.",
      "check": {
        "question": "Which shows Mira''s words?",
        "options": [
          "Mira said",
          "''I found the map.''",
          "Then Kai asked",
          "Mira replied"
        ],
        "correct_index": 1,
        "explanation": "''I found the map.''. In Mira said, ''I found the map.'', the spoken words are ''I found the map.'' The words Mira said are narration, not part of her direct speech."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Learning Speech Marks: Punctuate Dialogue",
            "transcript": "Pip: Mira said I found the map. How will anyone know which words she spoke?\nJuno: Put quotation marks around her exact words and keep the opening capital.\nPip: Kai asks a question, so his speech needs a question mark.\nJuno: Right. Pause and add the marks to ''Where was it?'' before continuing.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "Mira said I found the map. How will anyone know which words she spoke?"
                  },
                  {
                    "who": "juno",
                    "text": "Put quotation marks around her exact words and keep the opening capital."
                  },
                  {
                    "who": "pip",
                    "text": "Kai asks a question, so his speech needs a question mark."
                  },
                  {
                    "who": "juno",
                    "text": "Right. Pause and add the marks to ''Where was it?'' before continuing.",
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
      "icon": "📚",
      "title": "Place capitals and end punctuation",
      "explain": "**Learn:** In direct speech, the first spoken word begins with a capital. A question takes a question mark and excited speech can take an exclamation mark. Put punctuation within the closing quotation mark.\n\n**Original situation:** Mira said, ''I found the map.'' Then Kai asked, ''Where was it?'' Mira replied, ''Under the table!''\n\n**Focus:** Find a specific piece of evidence, verb form, punctuation mark or calculation that connects to this teaching point.",
      "example": "**WATCH MY THINKING**\nI write: Kai asked, ''Where was it?'' not Kai asked, ''where was it''. The question mark belongs with Kai''s words.\n\n**TRY A NEW EXAMPLE**\n**Repair these lines:**\n1. lina said i lost my keys → **Lina said, ''I lost my keys.''**\n2. where are they asked sam → **''Where are they?'' asked Sam.**\n3. i saw them here said lina → **''I saw them here,'' said Lina.**\n4. Separate Lina''s and Sam''s turns into paragraphs. Explain why the question mark stays inside the quotation marks. Note: choose single quotes for this practice and stay consistent.\n\n**CHECK YOUR ANSWER**\nCompare your answer with the worked reasoning. If it differs, name the exact correction.",
      "notice": "In direct speech, the first spoken word begins with a capital. A question takes a question mark and excited speech can take an exclamation mark. Put punctuation within the closing quotation mark.",
      "check": {
        "question": "Which is a correctly punctuated question?",
        "options": [
          "''Where was it?'' asked Kai.",
          "''where was it'' asked Kai",
          "Where was it asked Kai.",
          "''Where was it''. asked Kai"
        ],
        "correct_index": 0,
        "explanation": "''Where was it?'' asked Kai.. I write: Kai asked, ''Where was it?'' not Kai asked, ''where was it''. The question mark belongs with Kai''s words."
      }
    },
    {
      "icon": "✏️",
      "title": "Add the speaker tag clearly",
      "explain": "**Learn:** Use commas where a speaker tag introduces or follows dialogue. For a statement followed by ''said Mira'', a comma often replaces the full stop inside the closing mark.\n\n**Original situation:** Mira said, ''I found the map.'' Then Kai asked, ''Where was it?'' Mira replied, ''Under the table!''\n\n**Focus:** Find a specific piece of evidence, verb form, punctuation mark or calculation that connects to this teaching point.",
      "example": "**WATCH MY THINKING**\nTwo patterns: Mira said, ''I found it.'' OR ''I found it,'' said Mira. Both are correct. In the second, the spoken statement has a comma before the closing quotation mark.\n\n**TRY A NEW EXAMPLE**\n**Repair these lines:**\n1. lina said i lost my keys → **Lina said, ''I lost my keys.''**\n2. where are they asked sam → **''Where are they?'' asked Sam.**\n3. i saw them here said lina → **''I saw them here,'' said Lina.**\n4. Separate Lina''s and Sam''s turns into paragraphs. Explain why the question mark stays inside the quotation marks. Note: choose single quotes for this practice and stay consistent.\n\n**CHECK YOUR ANSWER**\nCompare your answer with the worked reasoning. If it differs, name the exact correction.",
      "notice": "Use commas where a speaker tag introduces or follows dialogue. For a statement followed by ''said Mira'', a comma often replaces the full stop inside the closing mark.",
      "check": {
        "question": "Which uses a speaker tag after a statement correctly?",
        "options": [
          "''I found it.'' said Mira.",
          "''I found it,'' said Mira.",
          "''i found it,'' said Mira.",
          "I found it, said Mira."
        ],
        "correct_index": 1,
        "explanation": "''I found it,'' said Mira.. Two patterns: Mira said, ''I found it.'' OR ''I found it,'' said Mira. Both are correct. In the second, the spoken statement has a comma before the closing quotation mark."
      }
    },
    {
      "icon": "✅",
      "title": "Start a new line for a new speaker",
      "explain": "**Learn:** Readers need to know when the speaker changes. In story dialogue, begin a new paragraph for a new speaker and keep the punctuation consistent.\n\n**Original situation:** Mira said, ''I found the map.'' Then Kai asked, ''Where was it?'' Mira replied, ''Under the table!''\n\n**Focus:** Find a specific piece of evidence, verb form, punctuation mark or calculation that connects to this teaching point.",
      "example": "**WATCH MY THINKING**\nI put Mira''s statement on one line and Kai''s question on the next. The new paragraph indicates a new voice without repeating ''then'' unnecessarily.\n\n**TRY A NEW EXAMPLE**\n**Repair these lines:**\n1. lina said i lost my keys → **Lina said, ''I lost my keys.''**\n2. where are they asked sam → **''Where are they?'' asked Sam.**\n3. i saw them here said lina → **''I saw them here,'' said Lina.**\n4. Separate Lina''s and Sam''s turns into paragraphs. Explain why the question mark stays inside the quotation marks. Note: choose single quotes for this practice and stay consistent.\n\n**CHECK YOUR ANSWER**\nCompare your answer with the worked reasoning. If it differs, name the exact correction.",
      "notice": "Readers need to know when the speaker changes. In story dialogue, begin a new paragraph for a new speaker and keep the punctuation consistent.",
      "check": {
        "question": "Which starts direct speech with a capital?",
        "options": [
          "Mira said, ''i found it.''",
          "Mira said, ''I found it.''",
          "mira said, ''I found it.''",
          "Mira said ''i found it''"
        ],
        "correct_index": 1,
        "explanation": "Mira said, ''I found it.''. I put Mira''s statement on one line and Kai''s question on the next. The new paragraph indicates a new voice without repeating ''then'' unnecessarily."
      }
    }
  ],
  "worked_example": "## Complete teacher model\n\nMira said, ''I found the map.'' Then Kai asked, ''Where was it?'' Mira replied, ''Under the table!''\n\n**1. Find spoken words and speech marks:** In Mira said, ''I found the map.'', the spoken words are ''I found the map.'' The words Mira said are narration, not part of her direct speech.\n\n**2. Place capitals and end punctuation:** I write: Kai asked, ''Where was it?'' not Kai asked, ''where was it''. The question mark belongs with Kai''s words.\n\n**3. Add the speaker tag clearly:** Two patterns: Mira said, ''I found it.'' OR ''I found it,'' said Mira. Both are correct. In the second, the spoken statement has a comma before the closing quotation mark.\n\n**4. Start a new line for a new speaker:** I put Mira''s statement on one line and Kai''s question on the next. The new paragraph indicates a new voice without repeating ''then'' unnecessarily.\n\n**Self-check:** Tell someone which part of the model changes the answer and which mistake it avoids.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 560 210\"><rect width=\"560\" height=\"210\" rx=\"12\" fill=\"#f3f8f6\"/><text x=\"18\" y=\"35\" font-family=\"Arial\" font-size=\"19\" fill=\"#163e31\">Punctuate spoken words</text><rect x=\"12\" y=\"70\" width=\"129\" height=\"104\" rx=\"9\" fill=\"#dfede4\"/><text x=\"22\" y=\"127\" font-family=\"Arial\" font-size=\"17\" fill=\"#1c4031\">LEARN</text><rect x=\"151\" y=\"70\" width=\"129\" height=\"104\" rx=\"9\" fill=\"#e6ecfa\"/><text x=\"161\" y=\"127\" font-family=\"Arial\" font-size=\"17\" fill=\"#1c4031\">MODEL</text><rect x=\"290\" y=\"70\" width=\"129\" height=\"104\" rx=\"9\" fill=\"#dfede4\"/><text x=\"300\" y=\"127\" font-family=\"Arial\" font-size=\"17\" fill=\"#1c4031\">TRY</text><rect x=\"429\" y=\"70\" width=\"129\" height=\"104\" rx=\"9\" fill=\"#e6ecfa\"/><text x=\"439\" y=\"127\" font-family=\"Arial\" font-size=\"17\" fill=\"#1c4031\">CHECK</text></svg>",
      "alt": "Four-step instructional reminder for Speech Marks: Punctuate Dialogue: learn, model, try, check.",
      "caption": "Use each step to support and check your independent work."
    }
  ],
  "guided_practice": "**Repair these lines:**\n1. lina said i lost my keys → **Lina said, ''I lost my keys.''**\n2. where are they asked sam → **''Where are they?'' asked Sam.**\n3. i saw them here said lina → **''I saw them here,'' said Lina.**\n4. Separate Lina''s and Sam''s turns into paragraphs. Explain why the question mark stays inside the quotation marks. Note: choose single quotes for this practice and stay consistent.",
  "independent_task": "**Repair and extend this dialogue:** ''mina said i hear a noise. what noise asked jo. it is the clock said mina. lets check it said jo''. Rewrite as four correctly punctuated speaker turns, with a new paragraph when the speaker changes. Include a question mark, capitals, speech marks and the speaker tags. Then add one original sentence of narration and explain two punctuation decisions.",
  "response_prompt": "Complete the speech marks: punctuate dialogue task in your own work. Include evidence or calculations and one explained correction.",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "Which shows Mira''s words?",
      "options": [
        "Mira said",
        "''I found the map.''",
        "Then Kai asked",
        "Mira replied"
      ],
      "correct_index": 1,
      "explanation": "''I found the map.''. This matches the lesson text or the worked arithmetic."
    },
    {
      "type": "multiple_choice",
      "question": "Which is a correctly punctuated question?",
      "options": [
        "''Where was it?'' asked Kai.",
        "''where was it'' asked Kai",
        "Where was it asked Kai.",
        "''Where was it''. asked Kai"
      ],
      "correct_index": 0,
      "explanation": "''Where was it?'' asked Kai.. This matches the lesson text or the worked arithmetic."
    },
    {
      "type": "multiple_choice",
      "question": "Which uses a speaker tag after a statement correctly?",
      "options": [
        "''I found it.'' said Mira.",
        "''I found it,'' said Mira.",
        "''i found it,'' said Mira.",
        "I found it, said Mira."
      ],
      "correct_index": 1,
      "explanation": "''I found it,'' said Mira.. This matches the lesson text or the worked arithmetic."
    },
    {
      "type": "multiple_choice",
      "question": "Which starts direct speech with a capital?",
      "options": [
        "Mira said, ''i found it.''",
        "Mira said, ''I found it.''",
        "mira said, ''I found it.''",
        "Mira said ''i found it''"
      ],
      "correct_index": 1,
      "explanation": "Mira said, ''I found it.''. This matches the lesson text or the worked arithmetic."
    },
    {
      "type": "multiple_choice",
      "question": "Where does the question mark go?",
      "options": [
        "Inside the closing quotation mark",
        "Only after the character''s name",
        "Never in direct speech",
        "Before the opening quote"
      ],
      "correct_index": 0,
      "explanation": "Inside the closing quotation mark. This matches the lesson text or the worked arithmetic."
    },
    {
      "type": "multiple_choice",
      "question": "What should happen when a different character speaks?",
      "options": [
        "Start a new paragraph or line",
        "Remove all quotation marks",
        "Keep every speaker on one line",
        "Use a number instead of a name"
      ],
      "correct_index": 0,
      "explanation": "Start a new paragraph or line. This matches the lesson text or the worked arithmetic."
    },
    {
      "type": "multiple_choice",
      "question": "Which has a correct introductory speaker tag?",
      "options": [
        "Mira said, ''Look here.''",
        "Mira said ''look here''.",
        "Mira, said, look here.",
        "Mira said Look here"
      ],
      "correct_index": 0,
      "explanation": "Mira said, ''Look here.''. This matches the lesson text or the worked arithmetic."
    },
    {
      "type": "multiple_choice",
      "question": "Which sentence is an exclamation?",
      "options": [
        "''Did you find it?''",
        "''I found it!''",
        "''I found it,'' said Mira.",
        "''It was under the table.''"
      ],
      "correct_index": 1,
      "explanation": "''I found it!''. This matches the lesson text or the worked arithmetic."
    },
    {
      "type": "short_answer",
      "question": "Complete the original speech marks: punctuate dialogue independent challenge.",
      "sample_answer": "Mina said, ''I hear a noise.''\n\n''What noise?'' asked Jo.\n\n''It is the clock,'' said Mina.\n\n''Let''s check it,'' said Jo.\n\nThe two friends followed the ticking sound across the room.",
      "marking_guide": "Require an accurate response to the full prompt, not just copied definitions. Check relevant workings or story evidence.",
      "explanation": "A complete answer explains the result."
    },
    {
      "type": "short_answer",
      "question": "Explain a relevant correction or checking strategy in speech marks: punctuate dialogue.",
      "sample_answer": "I put a capital at the start of each spoken sentence and a question mark inside ''What noise?'' because Jo asks a question. I used a comma in ''It is the clock,'' said Mina because the tag follows a statement. New paragraphs show who speaks next.",
      "marking_guide": "Look for a specific correction, justification and accurate use of the taught method.",
      "explanation": "An effective improvement must be connected to the original task."
    }
  ],
  "parent_notes": "Parent: Have the learner demonstrate one original example before showing the model. Support age-appropriate reading without supplying the independent answer.\n\nParent: **Written response model one.** Mina said, ''I hear a noise.''\n\n''What noise?'' asked Jo.\n\n''It is the clock,'' said Mina.\n\n''Let''s check it,'' said Jo.\n\nThe two friends followed the ticking sound across the room.\n\nParent: **Written response model two.** I put a capital at the start of each spoken sentence and a question mark inside ''What noise?'' because Jo asks a question. I used a comma in ''It is the clock,'' said Mina because the tag follows a statement. New paragraphs show who speaks next.\n\nParent: Check the student''s actual independent evidence and both written items. The eight multiple-choice questions require 8/8 at the existing 90% threshold. NESA alignment is not yet verified.",
  "evidence_instructions": "Save the guided work, independent speech marks: punctuate dialogue response, one correction and two written quiz answers.",
  "offline_alternative": "Read and complete the original teaching and challenge using paper, a pencil or a suitable accessible approach; keep evidence.",
  "extension": "Invent a contrasting speech marks: punctuate dialogue case and show the new worked solution.",
  "stage_hints": {
    "accept": [
      "Read the instruction for Speech Marks: Punctuate Dialogue.",
      "Find a concrete detail in the original story or number model connected to speech marks: punctuate dialogue.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ],
    "teach0": [
      "Read the instruction for Find spoken words and speech marks.",
      "Find a concrete detail in the original story or number model connected to find spoken words and speech marks.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ],
    "teach1": [
      "Read the instruction for Place capitals and end punctuation.",
      "Find a concrete detail in the original story or number model connected to place capitals and end punctuation.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ],
    "teach2": [
      "Read the instruction for Add the speaker tag clearly.",
      "Find a concrete detail in the original story or number model connected to add the speaker tag clearly.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ],
    "teach3": [
      "Read the instruction for Start a new line for a new speaker.",
      "Find a concrete detail in the original story or number model connected to start a new line for a new speaker.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ],
    "learn": [
      "Read the instruction for Speech Marks: Punctuate Dialogue.",
      "Find a concrete detail in the original story or number model connected to speech marks: punctuate dialogue.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ],
    "guided": [
      "Read the instruction for Speech Marks: Punctuate Dialogue.",
      "Find a concrete detail in the original story or number model connected to speech marks: punctuate dialogue.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ],
    "write": [
      "Read the instruction for Speech Marks: Punctuate Dialogue.",
      "Find a concrete detail in the original story or number model connected to speech marks: punctuate dialogue.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ],
    "quiz": [
      "Read the instruction for Speech Marks: Punctuate Dialogue.",
      "Find a concrete detail in the original story or number model connected to speech marks: punctuate dialogue.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ],
    "submit": [
      "Read the instruction for Speech Marks: Punctuate Dialogue.",
      "Find a concrete detail in the original story or number model connected to speech marks: punctuate dialogue.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ]
  }
}'),updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE seed_key='s2-eng-y3-w05-l3';

-- s2-eng-y3-w05-l4
UPDATE lessons SET title='Publish Your Story: From Draft to Reader',data=json_patch(data,'{
  "seed_key": "s2-eng-y3-w05-l4",
  "title": "Publish Your Story: From Draft to Reader",
  "stage": "Stage 2",
  "learning_area": "English",
  "year_level": 3,
  "week": 5,
  "lesson_number": 4,
  "duration_minutes": 60,
  "child_mission": "Become a publish your story: from draft to reader detective: understand a model, practise, then solve an original task.",
  "learning_intention": "We are learning to use publish your story: from draft to reader with clear evidence or working.",
  "success_criteria": [
    "I can explain the concept in my own words.",
    "I can follow a complete worked example.",
    "I can answer guided questions and use the feedback.",
    "I can complete the original independent task.",
    "I can check and explain a meaningful improvement."
  ],
  "materials": [
    "All original example texts and teaching are provided.",
    "Optional pencil, paper and twenty counters for the maths lesson."
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
      "title": "Recall the teaching concepts",
      "cards": [
        {
          "front": "Choose a reader and purpose",
          "back": "Publishing means preparing finished writing for an audience. Your reader needs a clear title and a story that is easy to follow. The final copy should preserve the writer''s original ideas."
        },
        {
          "front": "Check the story''s structure",
          "back": "Before making writing look attractive, check the orientation, complication, connected actions and resolution. A beautiful page does not fix a missing ending."
        },
        {
          "front": "Edit words, sentences and layout",
          "back": "Proofread names, punctuation, tense, paragraph breaks and spelling. Use a readable layout with sensible spaces, and images only when they help understanding."
        },
        {
          "front": "Share and reflect safely",
          "back": "Sharing can be reading to a parent, showing a printed copy or using an accessible digital version. A reflection names a genuine change and the reason it helped the reader."
        }
      ]
    }
  ],
  "printable_resource": {
    "title": "Publish Your Story: From Draft to Reader",
    "instructions": "Read the scenario, work through the teaching and guided practice, then complete the independent challenge.",
    "passage": "A learner has drafted a mystery about a missing community garden key. The character searches for clues, finds the key under a pot, and returns it to the caretaker.",
    "prompts": [
      "What is the main concept?",
      "Show one relevant worked step.",
      "Complete your own answer.",
      "What did you change and why?"
    ]
  },
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "🔎",
      "title": "Choose a reader and purpose",
      "explain": "**Learn:** Publishing means preparing finished writing for an audience. Your reader needs a clear title and a story that is easy to follow. The final copy should preserve the writer''s original ideas.\n\n**Original situation:** A learner has drafted a mystery about a missing community garden key. The character searches for clues, finds the key under a pot, and returns it to the caretaker.\n\n**Focus:** Find a specific piece of evidence, verb form, punctuation mark or calculation that connects to this teaching point.",
      "example": "**WATCH MY THINKING**\nI choose a title, ''The Key Beneath the Pot''. I decide my audience is another Year 3 student, so the mystery clues should be clear without complicated explanations.\n\n**TRY A NEW EXAMPLE**\n**Publisher''s desk:** Draft: ''maya went to the park she lost her hat. she look all over. She find it by a bench. The wind blowed it there.''\n\n1. Give the story a helpful title.\n2. Fix capitals, full stops and past-tense verbs.\n3. Identify the problem and resolution.\n4. Ask whether the reader can understand how the hat reached the bench.\n\n**Possible revised version:** ''The Windy Hat. Maya went to the park and lost her hat. She looked by the swings and found it beside a bench. The wind had blown it there.'' The title and corrected verbs help the reader.\n\n**CHECK YOUR ANSWER**\nCompare your answer with the worked reasoning. If it differs, name the exact correction.",
      "notice": "Publishing means preparing finished writing for an audience. Your reader needs a clear title and a story that is easy to follow. The final copy should preserve the writer''s original ideas.",
      "check": {
        "question": "What is the purpose of a title?",
        "options": [
          "Help a reader anticipate the story",
          "Replace all story events",
          "Prove a character is good",
          "Make punctuation unnecessary"
        ],
        "correct_index": 0,
        "explanation": "Help a reader anticipate the story. I choose a title, ''The Key Beneath the Pot''. I decide my audience is another Year 3 student, so the mystery clues should be clear without complicated explanations."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Learning Publish Your Story: From Draft to Reader",
            "transcript": "Pip: My story has a beautiful title. Can I publish it with no ending?\nJuno: A clear ending matters more than decoration. Check the problem and resolution.\nPip: Then I can correct spelling and paragraph breaks before sharing.\nJuno: Exactly. Pause and name one revision and one edit you might make.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "My story has a beautiful title. Can I publish it with no ending?"
                  },
                  {
                    "who": "juno",
                    "text": "A clear ending matters more than decoration. Check the problem and resolution."
                  },
                  {
                    "who": "pip",
                    "text": "Then I can correct spelling and paragraph breaks before sharing."
                  },
                  {
                    "who": "juno",
                    "text": "Exactly. Pause and name one revision and one edit you might make.",
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
      "icon": "📚",
      "title": "Check the story''s structure",
      "explain": "**Learn:** Before making writing look attractive, check the orientation, complication, connected actions and resolution. A beautiful page does not fix a missing ending.\n\n**Original situation:** A learner has drafted a mystery about a missing community garden key. The character searches for clues, finds the key under a pot, and returns it to the caretaker.\n\n**Focus:** Find a specific piece of evidence, verb form, punctuation mark or calculation that connects to this teaching point.",
      "example": "**WATCH MY THINKING**\nI map my story: character visits garden → key is missing → clues near the pots → key is found and returned. The resolution answers the key problem.\n\n**TRY A NEW EXAMPLE**\n**Publisher''s desk:** Draft: ''maya went to the park she lost her hat. she look all over. She find it by a bench. The wind blowed it there.''\n\n1. Give the story a helpful title.\n2. Fix capitals, full stops and past-tense verbs.\n3. Identify the problem and resolution.\n4. Ask whether the reader can understand how the hat reached the bench.\n\n**Possible revised version:** ''The Windy Hat. Maya went to the park and lost her hat. She looked by the swings and found it beside a bench. The wind had blown it there.'' The title and corrected verbs help the reader.\n\n**CHECK YOUR ANSWER**\nCompare your answer with the worked reasoning. If it differs, name the exact correction.",
      "notice": "Before making writing look attractive, check the orientation, complication, connected actions and resolution. A beautiful page does not fix a missing ending.",
      "check": {
        "question": "Which comes before visual decoration?",
        "options": [
          "Check story structure and clarity",
          "Add twenty fonts",
          "Remove the ending",
          "Hide the paragraphs"
        ],
        "correct_index": 0,
        "explanation": "Check story structure and clarity. I map my story: character visits garden → key is missing → clues near the pots → key is found and returned. The resolution answers the key problem."
      }
    },
    {
      "icon": "✏️",
      "title": "Edit words, sentences and layout",
      "explain": "**Learn:** Proofread names, punctuation, tense, paragraph breaks and spelling. Use a readable layout with sensible spaces, and images only when they help understanding.\n\n**Original situation:** A learner has drafted a mystery about a missing community garden key. The character searches for clues, finds the key under a pot, and returns it to the caretaker.\n\n**Focus:** Find a specific piece of evidence, verb form, punctuation mark or calculation that connects to this teaching point.",
      "example": "**WATCH MY THINKING**\nI correct ''the gardner finded the key'' to ''the gardener found the key''. I use a new paragraph when a new speaker talks. I leave space around the title.\n\n**TRY A NEW EXAMPLE**\n**Publisher''s desk:** Draft: ''maya went to the park she lost her hat. she look all over. She find it by a bench. The wind blowed it there.''\n\n1. Give the story a helpful title.\n2. Fix capitals, full stops and past-tense verbs.\n3. Identify the problem and resolution.\n4. Ask whether the reader can understand how the hat reached the bench.\n\n**Possible revised version:** ''The Windy Hat. Maya went to the park and lost her hat. She looked by the swings and found it beside a bench. The wind had blown it there.'' The title and corrected verbs help the reader.\n\n**CHECK YOUR ANSWER**\nCompare your answer with the worked reasoning. If it differs, name the exact correction.",
      "notice": "Proofread names, punctuation, tense, paragraph breaks and spelling. Use a readable layout with sensible spaces, and images only when they help understanding.",
      "check": {
        "question": "Which is a correction of ''finded''?",
        "options": [
          "finds yesterday",
          "found",
          "finded again",
          "finding tomorrow"
        ],
        "correct_index": 1,
        "explanation": "found. I correct ''the gardner finded the key'' to ''the gardener found the key''. I use a new paragraph when a new speaker talks. I leave space around the title."
      }
    },
    {
      "icon": "✅",
      "title": "Share and reflect safely",
      "explain": "**Learn:** Sharing can be reading to a parent, showing a printed copy or using an accessible digital version. A reflection names a genuine change and the reason it helped the reader.\n\n**Original situation:** A learner has drafted a mystery about a missing community garden key. The character searches for clues, finds the key under a pot, and returns it to the caretaker.\n\n**Focus:** Find a specific piece of evidence, verb form, punctuation mark or calculation that connects to this teaching point.",
      "example": "**WATCH MY THINKING**\nI read the finished story to my parent and ask whether the ending makes sense. I note: ''I added how the key was returned so the ending solved the mystery.''\n\n**TRY A NEW EXAMPLE**\n**Publisher''s desk:** Draft: ''maya went to the park she lost her hat. she look all over. She find it by a bench. The wind blowed it there.''\n\n1. Give the story a helpful title.\n2. Fix capitals, full stops and past-tense verbs.\n3. Identify the problem and resolution.\n4. Ask whether the reader can understand how the hat reached the bench.\n\n**Possible revised version:** ''The Windy Hat. Maya went to the park and lost her hat. She looked by the swings and found it beside a bench. The wind had blown it there.'' The title and corrected verbs help the reader.\n\n**CHECK YOUR ANSWER**\nCompare your answer with the worked reasoning. If it differs, name the exact correction.",
      "notice": "Sharing can be reading to a parent, showing a printed copy or using an accessible digital version. A reflection names a genuine change and the reason it helped the reader.",
      "check": {
        "question": "What is the story''s complication?",
        "options": [
          "The key goes missing",
          "The key is returned",
          "The title is printed",
          "The reader finishes"
        ],
        "correct_index": 0,
        "explanation": "The key goes missing. I read the finished story to my parent and ask whether the ending makes sense. I note: ''I added how the key was returned so the ending solved the mystery.''"
      }
    }
  ],
  "worked_example": "## Complete teacher model\n\nA learner has drafted a mystery about a missing community garden key. The character searches for clues, finds the key under a pot, and returns it to the caretaker.\n\n**1. Choose a reader and purpose:** I choose a title, ''The Key Beneath the Pot''. I decide my audience is another Year 3 student, so the mystery clues should be clear without complicated explanations.\n\n**2. Check the story''s structure:** I map my story: character visits garden → key is missing → clues near the pots → key is found and returned. The resolution answers the key problem.\n\n**3. Edit words, sentences and layout:** I correct ''the gardner finded the key'' to ''the gardener found the key''. I use a new paragraph when a new speaker talks. I leave space around the title.\n\n**4. Share and reflect safely:** I read the finished story to my parent and ask whether the ending makes sense. I note: ''I added how the key was returned so the ending solved the mystery.''\n\n**Self-check:** Tell someone which part of the model changes the answer and which mistake it avoids.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 560 210\"><rect width=\"560\" height=\"210\" rx=\"12\" fill=\"#f3f8f6\"/><text x=\"18\" y=\"35\" font-family=\"Arial\" font-size=\"19\" fill=\"#163e31\">Prepare to publish</text><rect x=\"12\" y=\"70\" width=\"129\" height=\"104\" rx=\"9\" fill=\"#dfede4\"/><text x=\"22\" y=\"127\" font-family=\"Arial\" font-size=\"17\" fill=\"#1c4031\">LEARN</text><rect x=\"151\" y=\"70\" width=\"129\" height=\"104\" rx=\"9\" fill=\"#e6ecfa\"/><text x=\"161\" y=\"127\" font-family=\"Arial\" font-size=\"17\" fill=\"#1c4031\">MODEL</text><rect x=\"290\" y=\"70\" width=\"129\" height=\"104\" rx=\"9\" fill=\"#dfede4\"/><text x=\"300\" y=\"127\" font-family=\"Arial\" font-size=\"17\" fill=\"#1c4031\">TRY</text><rect x=\"429\" y=\"70\" width=\"129\" height=\"104\" rx=\"9\" fill=\"#e6ecfa\"/><text x=\"439\" y=\"127\" font-family=\"Arial\" font-size=\"17\" fill=\"#1c4031\">CHECK</text></svg>",
      "alt": "Four-step instructional reminder for Publish Your Story: From Draft to Reader: learn, model, try, check.",
      "caption": "Use each step to support and check your independent work."
    }
  ],
  "guided_practice": "**Publisher''s desk:** Draft: ''maya went to the park she lost her hat. she look all over. She find it by a bench. The wind blowed it there.''\n\n1. Give the story a helpful title.\n2. Fix capitals, full stops and past-tense verbs.\n3. Identify the problem and resolution.\n4. Ask whether the reader can understand how the hat reached the bench.\n\n**Possible revised version:** ''The Windy Hat. Maya went to the park and lost her hat. She looked by the swings and found it beside a bench. The wind had blown it there.'' The title and corrected verbs help the reader.",
  "independent_task": "**Publish an original mini-story:** Create a complete story of 130–200 words about a child who must find a missing exhibition ticket before a community event. Include orientation, complication, at least two meaningful actions, and a connected resolution. Add a title, revise one plot detail, correct at least three mechanical issues during editing, and present a legible final copy. Finish with a 3-sentence author''s note naming your reader, one revision and one edit. A typed or handwritten submission is acceptable.",
  "response_prompt": "Complete the publish your story: from draft to reader task in your own work. Include evidence or calculations and one explained correction.",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "What is the purpose of a title?",
      "options": [
        "Help a reader anticipate the story",
        "Replace all story events",
        "Prove a character is good",
        "Make punctuation unnecessary"
      ],
      "correct_index": 0,
      "explanation": "Help a reader anticipate the story. This matches the lesson text or the worked arithmetic."
    },
    {
      "type": "multiple_choice",
      "question": "Which comes before visual decoration?",
      "options": [
        "Check story structure and clarity",
        "Add twenty fonts",
        "Remove the ending",
        "Hide the paragraphs"
      ],
      "correct_index": 0,
      "explanation": "Check story structure and clarity. This matches the lesson text or the worked arithmetic."
    },
    {
      "type": "multiple_choice",
      "question": "Which is a correction of ''finded''?",
      "options": [
        "finds yesterday",
        "found",
        "finded again",
        "finding tomorrow"
      ],
      "correct_index": 1,
      "explanation": "found. This matches the lesson text or the worked arithmetic."
    },
    {
      "type": "multiple_choice",
      "question": "What is the story''s complication?",
      "options": [
        "The key goes missing",
        "The key is returned",
        "The title is printed",
        "The reader finishes"
      ],
      "correct_index": 0,
      "explanation": "The key goes missing. This matches the lesson text or the worked arithmetic."
    },
    {
      "type": "multiple_choice",
      "question": "Which event resolves the problem?",
      "options": [
        "The key is found and returned",
        "The sun rises on a different day",
        "A dog barks elsewhere",
        "Someone changes their shoes"
      ],
      "correct_index": 0,
      "explanation": "The key is found and returned. This matches the lesson text or the worked arithmetic."
    },
    {
      "type": "multiple_choice",
      "question": "Which is an editing task?",
      "options": [
        "Correct a misspelt word",
        "Invent a new ending",
        "Add a missing clue",
        "Change the main character''s goal"
      ],
      "correct_index": 0,
      "explanation": "Correct a misspelt word. This matches the lesson text or the worked arithmetic."
    },
    {
      "type": "multiple_choice",
      "question": "Which is a revision task?",
      "options": [
        "Add an action to explain how the key was found",
        "Fix a capital",
        "Add a full stop",
        "Correct a spelling mistake"
      ],
      "correct_index": 0,
      "explanation": "Add an action to explain how the key was found. This matches the lesson text or the worked arithmetic."
    },
    {
      "type": "multiple_choice",
      "question": "What does an author''s note explain?",
      "options": [
        "An intended reader and a meaningful writing choice",
        "Only the paper colour",
        "A new unrelated story",
        "Why no proofreading was done"
      ],
      "correct_index": 0,
      "explanation": "An intended reader and a meaningful writing choice. This matches the lesson text or the worked arithmetic."
    },
    {
      "type": "short_answer",
      "question": "Complete the original publish your story: from draft to reader independent challenge.",
      "sample_answer": "Title: The Last Ticket. Ari arrived at the exhibition with a ticket safely in a pocket. When it was time to enter, the ticket had slipped out. Ari checked the entry path, asked a volunteer and found it beside the noticeboard. The volunteer explained that the wind had blown it there. Ari thanked the helper and entered the exhibition on time. A longer final draft would develop the actions to the requested 130–200 words.",
      "marking_guide": "Require an accurate response to the full prompt, not just copied definitions. Check relevant workings or story evidence.",
      "explanation": "A complete answer explains the result."
    },
    {
      "type": "short_answer",
      "question": "Explain a relevant correction or checking strategy in publish your story: from draft to reader.",
      "sample_answer": "My intended reader is another Year 3 student. I revised the plot to show Ari searching along the entry path and speaking to the volunteer, so the solution makes sense. I edited a missing capital and two full stops. The finished copy is easy to read.",
      "marking_guide": "Look for a specific correction, justification and accurate use of the taught method.",
      "explanation": "An effective improvement must be connected to the original task."
    }
  ],
  "parent_notes": "Parent: Have the learner demonstrate one original example before showing the model. Support age-appropriate reading without supplying the independent answer.\n\nParent: **Written response model one.** Title: The Last Ticket. Ari arrived at the exhibition with a ticket safely in a pocket. When it was time to enter, the ticket had slipped out. Ari checked the entry path, asked a volunteer and found it beside the noticeboard. The volunteer explained that the wind had blown it there. Ari thanked the helper and entered the exhibition on time. A longer final draft would develop the actions to the requested 130–200 words.\n\nParent: **Written response model two.** My intended reader is another Year 3 student. I revised the plot to show Ari searching along the entry path and speaking to the volunteer, so the solution makes sense. I edited a missing capital and two full stops. The finished copy is easy to read.\n\nParent: Check the student''s actual independent evidence and both written items. The eight multiple-choice questions require 8/8 at the existing 90% threshold. NESA alignment is not yet verified.",
  "evidence_instructions": "Save the guided work, independent publish your story: from draft to reader response, one correction and two written quiz answers.",
  "offline_alternative": "Read and complete the original teaching and challenge using paper, a pencil or a suitable accessible approach; keep evidence.",
  "extension": "Invent a contrasting publish your story: from draft to reader case and show the new worked solution.",
  "stage_hints": {
    "accept": [
      "Read the instruction for Publish Your Story: From Draft to Reader.",
      "Find a concrete detail in the original story or number model connected to publish your story: from draft to reader.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ],
    "teach0": [
      "Read the instruction for Choose a reader and purpose.",
      "Find a concrete detail in the original story or number model connected to choose a reader and purpose.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ],
    "teach1": [
      "Read the instruction for Check the story''s structure.",
      "Find a concrete detail in the original story or number model connected to check the story''s structure.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ],
    "teach2": [
      "Read the instruction for Edit words, sentences and layout.",
      "Find a concrete detail in the original story or number model connected to edit words, sentences and layout.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ],
    "teach3": [
      "Read the instruction for Share and reflect safely.",
      "Find a concrete detail in the original story or number model connected to share and reflect safely.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ],
    "learn": [
      "Read the instruction for Publish Your Story: From Draft to Reader.",
      "Find a concrete detail in the original story or number model connected to publish your story: from draft to reader.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ],
    "guided": [
      "Read the instruction for Publish Your Story: From Draft to Reader.",
      "Find a concrete detail in the original story or number model connected to publish your story: from draft to reader.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ],
    "write": [
      "Read the instruction for Publish Your Story: From Draft to Reader.",
      "Find a concrete detail in the original story or number model connected to publish your story: from draft to reader.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ],
    "quiz": [
      "Read the instruction for Publish Your Story: From Draft to Reader.",
      "Find a concrete detail in the original story or number model connected to publish your story: from draft to reader.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ],
    "submit": [
      "Read the instruction for Publish Your Story: From Draft to Reader.",
      "Find a concrete detail in the original story or number model connected to publish your story: from draft to reader.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ]
  }
}'),updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE seed_key='s2-eng-y3-w05-l4';

-- s2-mat-y3-w05-l1
UPDATE lessons SET title='Number Bonds: Build Addition Facts to 20',data=json_patch(data,'{
  "seed_key": "s2-mat-y3-w05-l1",
  "title": "Number Bonds: Build Addition Facts to 20",
  "stage": "Stage 2",
  "learning_area": "Mathematics",
  "year_level": 3,
  "week": 5,
  "lesson_number": 1,
  "duration_minutes": 60,
  "child_mission": "Become a number bonds: build addition facts to 20 detective: understand a model, practise, then solve an original task.",
  "learning_intention": "We are learning to use number bonds: build addition facts to 20 with clear evidence or working.",
  "success_criteria": [
    "I can explain the concept in my own words.",
    "I can follow a complete worked example.",
    "I can answer guided questions and use the feedback.",
    "I can complete the original independent task.",
    "I can check and explain a meaningful improvement."
  ],
  "materials": [
    "All original example texts and teaching are provided.",
    "Optional pencil, paper and twenty counters for the maths lesson."
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
      "title": "Recall the teaching concepts",
      "cards": [
        {
          "front": "Understand an addition bond",
          "back": "A **number bond** describes two parts that make a whole. For a total of 20, 13 and 7 are a bond because 13+7=20."
        },
        {
          "front": "Find the missing part with subtraction",
          "back": "If you know the whole and one part, subtract to find the other. Check by adding the parts together."
        },
        {
          "front": "Bridge through ten",
          "back": "For sums that cross ten, split one addend to make a ten first. This can make mental addition easier."
        },
        {
          "front": "Use fact families and check",
          "back": "An addition fact can connect to a subtraction fact. Explain which three numbers make the fact family and how the inverse checks your answer."
        }
      ]
    }
  ],
  "printable_resource": {
    "title": "Number Bonds: Build Addition Facts to 20",
    "instructions": "Read the scenario, work through the teaching and guided practice, then complete the independent challenge.",
    "passage": "There are 13 blue counters and 7 green counters on a desk. Together they make 20 counters.",
    "prompts": [
      "What is the main concept?",
      "Show one relevant worked step.",
      "Complete your own answer.",
      "What did you change and why?"
    ]
  },
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "🔎",
      "title": "Understand an addition bond",
      "explain": "**Learn:** A **number bond** describes two parts that make a whole. For a total of 20, 13 and 7 are a bond because 13+7=20.\n\n**Original situation:** There are 13 blue counters and 7 green counters on a desk. Together they make 20 counters.\n\n**Focus:** Find a specific piece of evidence, verb form, punctuation mark or calculation that connects to this teaching point.",
      "example": "**WATCH MY THINKING**\nI draw twenty spots, mark thirteen blue and seven green. I count 13+7=20, then swap the groups: 7+13=20. The whole is unchanged.\n\n**TRY A NEW EXAMPLE**\n**Practise bonds:** 12+__=20 → 8; 6+__=20 → 14; 20−17=__ → 3. **Try bridging ten:** 9+6 = 9+1+5=15. **Fact family:** 14+6=20, 6+14=20, 20−14=6, 20−6=14. **Spot the mistake:** ''15+6=20'' is wrong: 15+6=21; the complement of 15 to 20 is 5.\n\n**CHECK YOUR ANSWER**\nCompare your answer with the worked reasoning. If it differs, name the exact correction.",
      "notice": "A **number bond** describes two parts that make a whole. For a total of 20, 13 and 7 are a bond because 13+7=20.",
      "check": {
        "question": "13+__=20",
        "options": [
          "6",
          "7",
          "8",
          "9"
        ],
        "correct_index": 1,
        "explanation": "7. I draw twenty spots, mark thirteen blue and seven green. I count 13+7=20, then swap the groups: 7+13=20. The whole is unchanged."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Learning Number Bonds: Build Addition Facts to 20",
            "transcript": "Pip: I have thirteen blue counters and seven green. Do they make twenty?\nJuno: Check by adding. Thirteen plus seven is twenty, so they form a bond.\nPip: If I know twenty and thirteen, subtraction finds the missing seven.\nJuno: Exactly. Pause and think of another pair of numbers that totals twenty.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "I have thirteen blue counters and seven green. Do they make twenty?"
                  },
                  {
                    "who": "juno",
                    "text": "Check by adding. Thirteen plus seven is twenty, so they form a bond."
                  },
                  {
                    "who": "pip",
                    "text": "If I know twenty and thirteen, subtraction finds the missing seven."
                  },
                  {
                    "who": "juno",
                    "text": "Exactly. Pause and think of another pair of numbers that totals twenty.",
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
      "icon": "📚",
      "title": "Find the missing part with subtraction",
      "explain": "**Learn:** If you know the whole and one part, subtract to find the other. Check by adding the parts together.\n\n**Original situation:** There are 13 blue counters and 7 green counters on a desk. Together they make 20 counters.\n\n**Focus:** Find a specific piece of evidence, verb form, punctuation mark or calculation that connects to this teaching point.",
      "example": "**WATCH MY THINKING**\n20−13=7, so the missing bond for 13 is 7. I check 13+7=20. A guess of 8 would make 21 and fail.\n\n**TRY A NEW EXAMPLE**\n**Practise bonds:** 12+__=20 → 8; 6+__=20 → 14; 20−17=__ → 3. **Try bridging ten:** 9+6 = 9+1+5=15. **Fact family:** 14+6=20, 6+14=20, 20−14=6, 20−6=14. **Spot the mistake:** ''15+6=20'' is wrong: 15+6=21; the complement of 15 to 20 is 5.\n\n**CHECK YOUR ANSWER**\nCompare your answer with the worked reasoning. If it differs, name the exact correction.",
      "notice": "If you know the whole and one part, subtract to find the other. Check by adding the parts together.",
      "check": {
        "question": "20−14=?",
        "options": [
          "4",
          "5",
          "6",
          "7"
        ],
        "correct_index": 2,
        "explanation": "6. 20−13=7, so the missing bond for 13 is 7. I check 13+7=20. A guess of 8 would make 21 and fail."
      }
    },
    {
      "icon": "✏️",
      "title": "Bridge through ten",
      "explain": "**Learn:** For sums that cross ten, split one addend to make a ten first. This can make mental addition easier.\n\n**Original situation:** There are 13 blue counters and 7 green counters on a desk. Together they make 20 counters.\n\n**Focus:** Find a specific piece of evidence, verb form, punctuation mark or calculation that connects to this teaching point.",
      "example": "**WATCH MY THINKING**\n8+7: split seven into two and five. Then 8+2=10, and 10+5=15. The total remains 15 because 2+5=7.\n\n**TRY A NEW EXAMPLE**\n**Practise bonds:** 12+__=20 → 8; 6+__=20 → 14; 20−17=__ → 3. **Try bridging ten:** 9+6 = 9+1+5=15. **Fact family:** 14+6=20, 6+14=20, 20−14=6, 20−6=14. **Spot the mistake:** ''15+6=20'' is wrong: 15+6=21; the complement of 15 to 20 is 5.\n\n**CHECK YOUR ANSWER**\nCompare your answer with the worked reasoning. If it differs, name the exact correction.",
      "notice": "For sums that cross ten, split one addend to make a ten first. This can make mental addition easier.",
      "check": {
        "question": "9+6=?",
        "options": [
          "14",
          "15",
          "16",
          "17"
        ],
        "correct_index": 1,
        "explanation": "15. 8+7: split seven into two and five. Then 8+2=10, and 10+5=15. The total remains 15 because 2+5=7."
      }
    },
    {
      "icon": "✅",
      "title": "Use fact families and check",
      "explain": "**Learn:** An addition fact can connect to a subtraction fact. Explain which three numbers make the fact family and how the inverse checks your answer.\n\n**Original situation:** There are 13 blue counters and 7 green counters on a desk. Together they make 20 counters.\n\n**Focus:** Find a specific piece of evidence, verb form, punctuation mark or calculation that connects to this teaching point.",
      "example": "**WATCH MY THINKING**\nFor 9+11=20, I also know 11+9=20, 20−9=11 and 20−11=9. I test every equation with counters or mental calculation.\n\n**TRY A NEW EXAMPLE**\n**Practise bonds:** 12+__=20 → 8; 6+__=20 → 14; 20−17=__ → 3. **Try bridging ten:** 9+6 = 9+1+5=15. **Fact family:** 14+6=20, 6+14=20, 20−14=6, 20−6=14. **Spot the mistake:** ''15+6=20'' is wrong: 15+6=21; the complement of 15 to 20 is 5.\n\n**CHECK YOUR ANSWER**\nCompare your answer with the worked reasoning. If it differs, name the exact correction.",
      "notice": "An addition fact can connect to a subtraction fact. Explain which three numbers make the fact family and how the inverse checks your answer.",
      "check": {
        "question": "8+9=?",
        "options": [
          "15",
          "16",
          "17",
          "18"
        ],
        "correct_index": 2,
        "explanation": "17. For 9+11=20, I also know 11+9=20, 20−9=11 and 20−11=9. I test every equation with counters or mental calculation."
      }
    }
  ],
  "worked_example": "## Complete teacher model\n\nThere are 13 blue counters and 7 green counters on a desk. Together they make 20 counters.\n\n**1. Understand an addition bond:** I draw twenty spots, mark thirteen blue and seven green. I count 13+7=20, then swap the groups: 7+13=20. The whole is unchanged.\n\n**2. Find the missing part with subtraction:** 20−13=7, so the missing bond for 13 is 7. I check 13+7=20. A guess of 8 would make 21 and fail.\n\n**3. Bridge through ten:** 8+7: split seven into two and five. Then 8+2=10, and 10+5=15. The total remains 15 because 2+5=7.\n\n**4. Use fact families and check:** For 9+11=20, I also know 11+9=20, 20−9=11 and 20−11=9. I test every equation with counters or mental calculation.\n\n**Self-check:** Tell someone which part of the model changes the answer and which mistake it avoids.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 560 210\"><rect width=\"560\" height=\"210\" rx=\"12\" fill=\"#f3f8f6\"/><text x=\"18\" y=\"35\" font-family=\"Arial\" font-size=\"19\" fill=\"#163e31\">Number bonds make twenty</text><rect x=\"12\" y=\"70\" width=\"129\" height=\"104\" rx=\"9\" fill=\"#dfede4\"/><text x=\"22\" y=\"127\" font-family=\"Arial\" font-size=\"17\" fill=\"#1c4031\">LEARN</text><rect x=\"151\" y=\"70\" width=\"129\" height=\"104\" rx=\"9\" fill=\"#e6ecfa\"/><text x=\"161\" y=\"127\" font-family=\"Arial\" font-size=\"17\" fill=\"#1c4031\">MODEL</text><rect x=\"290\" y=\"70\" width=\"129\" height=\"104\" rx=\"9\" fill=\"#dfede4\"/><text x=\"300\" y=\"127\" font-family=\"Arial\" font-size=\"17\" fill=\"#1c4031\">TRY</text><rect x=\"429\" y=\"70\" width=\"129\" height=\"104\" rx=\"9\" fill=\"#e6ecfa\"/><text x=\"439\" y=\"127\" font-family=\"Arial\" font-size=\"17\" fill=\"#1c4031\">CHECK</text></svg>",
      "alt": "Four-step instructional reminder for Number Bonds: Build Addition Facts to 20: learn, model, try, check.",
      "caption": "Use each step to support and check your independent work."
    }
  ],
  "guided_practice": "**Practise bonds:** 12+__=20 → 8; 6+__=20 → 14; 20−17=__ → 3. **Try bridging ten:** 9+6 = 9+1+5=15. **Fact family:** 14+6=20, 6+14=20, 20−14=6, 20−6=14. **Spot the mistake:** ''15+6=20'' is wrong: 15+6=21; the complement of 15 to 20 is 5.",
  "independent_task": "**Counter mission:** Make a complete table of missing bonds for 11, 12, 13, 14, 15, 16, 17, 18 and 19 to reach 20. Show two of those bonds with a diagram or written number line. Solve 8+9 and 7+6 by bridging through ten, showing the split. Write the four equations in the fact family for 12, 8 and 20. Explain how subtraction checks one addition fact.",
  "response_prompt": "Complete the number bonds: build addition facts to 20 task in your own work. Include evidence or calculations and one explained correction.",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "13+__=20",
      "options": [
        "6",
        "7",
        "8",
        "9"
      ],
      "correct_index": 1,
      "explanation": "7. This matches the lesson text or the worked arithmetic."
    },
    {
      "type": "multiple_choice",
      "question": "20−14=?",
      "options": [
        "4",
        "5",
        "6",
        "7"
      ],
      "correct_index": 2,
      "explanation": "6. This matches the lesson text or the worked arithmetic."
    },
    {
      "type": "multiple_choice",
      "question": "9+6=?",
      "options": [
        "14",
        "15",
        "16",
        "17"
      ],
      "correct_index": 1,
      "explanation": "15. This matches the lesson text or the worked arithmetic."
    },
    {
      "type": "multiple_choice",
      "question": "8+9=?",
      "options": [
        "15",
        "16",
        "17",
        "18"
      ],
      "correct_index": 2,
      "explanation": "17. This matches the lesson text or the worked arithmetic."
    },
    {
      "type": "multiple_choice",
      "question": "What completes 17+__=20?",
      "options": [
        "2",
        "3",
        "4",
        "5"
      ],
      "correct_index": 1,
      "explanation": "3. This matches the lesson text or the worked arithmetic."
    },
    {
      "type": "multiple_choice",
      "question": "Which is a number bond to 20?",
      "options": [
        "15+6",
        "12+8",
        "9+10",
        "13+8"
      ],
      "correct_index": 1,
      "explanation": "12+8. This matches the lesson text or the worked arithmetic."
    },
    {
      "type": "multiple_choice",
      "question": "Which checks 11+9=20?",
      "options": [
        "20−11=9",
        "20−11=8",
        "11−9=20",
        "20+9=11"
      ],
      "correct_index": 0,
      "explanation": "20−11=9. This matches the lesson text or the worked arithmetic."
    },
    {
      "type": "multiple_choice",
      "question": "How can 7+6 bridge ten?",
      "options": [
        "7+3+3",
        "7+4+2",
        "7+6+10",
        "7+1+5"
      ],
      "correct_index": 0,
      "explanation": "7+3+3. This matches the lesson text or the worked arithmetic."
    },
    {
      "type": "short_answer",
      "question": "Complete the original number bonds: build addition facts to 20 independent challenge.",
      "sample_answer": "Complements to twenty: 11→9, 12→8, 13→7, 14→6, 15→5, 16→4, 17→3, 18→2, 19→1. 8+9=8+2+7=17; 7+6=7+3+3=13. Fact family: 12+8=20, 8+12=20, 20−12=8, 20−8=12.",
      "marking_guide": "Require an accurate response to the full prompt, not just copied definitions. Check relevant workings or story evidence.",
      "explanation": "A complete answer explains the result."
    },
    {
      "type": "short_answer",
      "question": "Explain a relevant correction or checking strategy in number bonds: build addition facts to 20.",
      "sample_answer": "I check 12+8=20 by subtracting 12 from the whole: 20−12=8. For 8+9 I split nine into two and seven so the first step makes ten; the total is seventeen.",
      "marking_guide": "Look for a specific correction, justification and accurate use of the taught method.",
      "explanation": "An effective improvement must be connected to the original task."
    }
  ],
  "parent_notes": "Parent: Have the learner demonstrate one original example before showing the model. Support age-appropriate reading without supplying the independent answer.\n\nParent: **Written response model one.** Complements to twenty: 11→9, 12→8, 13→7, 14→6, 15→5, 16→4, 17→3, 18→2, 19→1. 8+9=8+2+7=17; 7+6=7+3+3=13. Fact family: 12+8=20, 8+12=20, 20−12=8, 20−8=12.\n\nParent: **Written response model two.** I check 12+8=20 by subtracting 12 from the whole: 20−12=8. For 8+9 I split nine into two and seven so the first step makes ten; the total is seventeen.\n\nParent: Check the student''s actual independent evidence and both written items. The eight multiple-choice questions require 8/8 at the existing 90% threshold. NESA alignment is not yet verified.",
  "evidence_instructions": "Save the guided work, independent number bonds: build addition facts to 20 response, one correction and two written quiz answers.",
  "offline_alternative": "Read and complete the original teaching and challenge using paper, a pencil or a suitable accessible approach; keep evidence.",
  "extension": "Invent a contrasting number bonds: build addition facts to 20 case and show the new worked solution.",
  "stage_hints": {
    "accept": [
      "Read the instruction for Number Bonds: Build Addition Facts to 20.",
      "Find a concrete detail in the original story or number model connected to number bonds: build addition facts to 20.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ],
    "teach0": [
      "Read the instruction for Understand an addition bond.",
      "Find a concrete detail in the original story or number model connected to understand an addition bond.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ],
    "teach1": [
      "Read the instruction for Find the missing part with subtraction.",
      "Find a concrete detail in the original story or number model connected to find the missing part with subtraction.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ],
    "teach2": [
      "Read the instruction for Bridge through ten.",
      "Find a concrete detail in the original story or number model connected to bridge through ten.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ],
    "teach3": [
      "Read the instruction for Use fact families and check.",
      "Find a concrete detail in the original story or number model connected to use fact families and check.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ],
    "learn": [
      "Read the instruction for Number Bonds: Build Addition Facts to 20.",
      "Find a concrete detail in the original story or number model connected to number bonds: build addition facts to 20.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ],
    "guided": [
      "Read the instruction for Number Bonds: Build Addition Facts to 20.",
      "Find a concrete detail in the original story or number model connected to number bonds: build addition facts to 20.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ],
    "write": [
      "Read the instruction for Number Bonds: Build Addition Facts to 20.",
      "Find a concrete detail in the original story or number model connected to number bonds: build addition facts to 20.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ],
    "quiz": [
      "Read the instruction for Number Bonds: Build Addition Facts to 20.",
      "Find a concrete detail in the original story or number model connected to number bonds: build addition facts to 20.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ],
    "submit": [
      "Read the instruction for Number Bonds: Build Addition Facts to 20.",
      "Find a concrete detail in the original story or number model connected to number bonds: build addition facts to 20.",
      "Explain why that detail supports your answer and compare it with the worked model before making a correction."
    ]
  }
}'),updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE seed_key='s2-mat-y3-w05-l1';
