-- Standard v2 substantive corrections: Year 3 English W4 L2-4, Mathematics W4 L1.

-- s2-eng-y3-w04-l2
UPDATE lessons SET title='Show, Don''t Tell: Make Feelings Visible',data=json_patch(data,'{
  "seed_key": "s2-eng-y3-w04-l2",
  "title": "Show, Don''t Tell: Make Feelings Visible",
  "stage": "Stage 2",
  "learning_area": "English",
  "year_level": 3,
  "week": 4,
  "lesson_number": 2,
  "duration_minutes": 60,
  "child_mission": "Explore show, don''t tell: make feelings visible using the original example, supported practice and independent challenge.",
  "learning_intention": "We are learning to understand and apply show, don''t tell: make feelings visible with accurate explanations.",
  "success_criteria": [
    "I can explain the concept in my own words.",
    "I can follow the worked example and say why it works.",
    "I can complete guided practice and use feedback.",
    "I can complete a new independent challenge.",
    "I can check and explain one improvement."
  ],
  "materials": [
    "All original texts and examples provided.",
    "Optional paper and pencil or appropriate accessibility alternative."
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
      "title": "Four teaching ideas",
      "cards": [
        {
          "front": "Telling names an emotion; showing gives clues",
          "back": "Writers may **tell** a feeling directly or **show** it through actions, thoughts, dialogue and sensory details. Showing asks the reader to infer emotion. Neither method is always wrong: short telling can be useful."
        },
        {
          "front": "Choose an action connected to the moment",
          "back": "A strong showing detail fits the character and setting. Avoid random exaggerated gestures that don''t help a reader picture what is happening."
        },
        {
          "front": "Use dialogue and senses purposefully",
          "back": "A few precise words of dialogue or sound can make a scene vivid. Balance details so the reader can still tell what is happening."
        },
        {
          "front": "Revise without overloading the paragraph",
          "back": "Compare the effect before and after a revision. Cut details that don''t strengthen the intended meaning; keep the main event understandable."
        }
      ]
    }
  ],
  "printable_resource": {
    "title": "Show, Don''t Tell: Make Feelings Visible",
    "instructions": "Read the original example, try the guided practice, and complete the challenge before reviewing the models.",
    "passage": "Telling: ''Jade was nervous before the race.'' Showing: ''Jade twisted her shoelace twice and looked towards the starting line.''",
    "prompts": [
      "What does this concept mean?",
      "Show an accurate example.",
      "Complete the independent work.",
      "Explain what you improved."
    ]
  },
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "🔎",
      "title": "Telling names an emotion; showing gives clues",
      "explain": "**Learn the idea:** Writers may **tell** a feeling directly or **show** it through actions, thoughts, dialogue and sensory details. Showing asks the reader to infer emotion. Neither method is always wrong: short telling can be useful.\n\n**Original example:** Telling: ''Jade was nervous before the race.'' Showing: ''Jade twisted her shoelace twice and looked towards the starting line.''\n\n**Why this matters:** Carefully identify the particular detail, word or number that supports the idea.",
      "example": "**WATCH MY THINKING**\n''Jade felt nervous'' tells us. ''Jade''s fingers trembled while she tied her shoes'' shows a physical clue. The clue suggests nervousness, but the writer doesn''t need to name it.\n\n**PRACTISE THIS**\n**Original practice:** ''Mila was disappointed when the rain cancelled her picnic.'' First, name the emotion: disappointed. Next, replace the label with two observable details. Try: ''Mila folded the picnic blanket without speaking. She watched droplets run down the window.'' Explain which clue suggests disappointment. **Check:** folding away the blanket and watching the rain fit the cancelled event; shouting with joy would suggest a different feeling. Then transform ''Finn was delighted with the drawing'' into two showing sentences of your own.\n\n**CHECK**\nFind one correct example from the guidance and explain why it works.",
      "notice": "Writers may **tell** a feeling directly or **show** it through actions, thoughts, dialogue and sensory details. Showing asks the reader to infer emotion. Neither method is always wrong: short telling can be useful. Compare your own explanation with the example.",
      "check": {
        "question": "Which sentence shows rather than tells nervousness?",
        "options": [
          "Kai was nervous.",
          "Kai''s hands shook as the doors opened.",
          "Nervousness is a feeling.",
          "It was a nervous day."
        ],
        "correct_index": 1,
        "explanation": "Kai''s hands shook as the doors opened. — ''Jade felt nervous'' tells us. ''Jade''s fingers trembled while she tied her shoes'' shows a physical clue. The clue suggests nervousness, but the writer doesn''t need to name it."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Learning clue: Show, Don''t Tell: Make Feelings Visible",
            "transcript": "Pip: Jade was nervous. That tells me the feeling, but can I picture it?\nJuno: Show a small action that fits a race, such as checking a shoelace twice.\nPip: Her hands shake and she looks at the starting line.\nJuno: Pause and invent one line of dialogue that shows the same feeling.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "Jade was nervous. That tells me the feeling, but can I picture it?"
                  },
                  {
                    "who": "juno",
                    "text": "Show a small action that fits a race, such as checking a shoelace twice."
                  },
                  {
                    "who": "pip",
                    "text": "Her hands shake and she looks at the starting line."
                  },
                  {
                    "who": "juno",
                    "text": "Pause and invent one line of dialogue that shows the same feeling.",
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
      "title": "Choose an action connected to the moment",
      "explain": "**Learn the idea:** A strong showing detail fits the character and setting. Avoid random exaggerated gestures that don''t help a reader picture what is happening.\n\n**Original example:** Telling: ''Jade was nervous before the race.'' Showing: ''Jade twisted her shoelace twice and looked towards the starting line.''\n\n**Why this matters:** Carefully identify the particular detail, word or number that supports the idea.",
      "example": "**WATCH MY THINKING**\nFor a child awaiting a race, I write: ''Jade glanced at the starter, then checked the knot again.'' These actions fit the moment; a dancing elephant would distract.\n\n**PRACTISE THIS**\n**Original practice:** ''Mila was disappointed when the rain cancelled her picnic.'' First, name the emotion: disappointed. Next, replace the label with two observable details. Try: ''Mila folded the picnic blanket without speaking. She watched droplets run down the window.'' Explain which clue suggests disappointment. **Check:** folding away the blanket and watching the rain fit the cancelled event; shouting with joy would suggest a different feeling. Then transform ''Finn was delighted with the drawing'' into two showing sentences of your own.\n\n**CHECK**\nFind one correct example from the guidance and explain why it works.",
      "notice": "A strong showing detail fits the character and setting. Avoid random exaggerated gestures that don''t help a reader picture what is happening. Compare your own explanation with the example.",
      "check": {
        "question": "Which detail suggests excitement?",
        "options": [
          "Lee jumped and grinned at the announcement.",
          "Lee slept peacefully.",
          "Lee stared at a blank wall.",
          "Lee counted the tiles without reacting."
        ],
        "correct_index": 0,
        "explanation": "Lee jumped and grinned at the announcement. — For a child awaiting a race, I write: ''Jade glanced at the starter, then checked the knot again.'' These actions fit the moment; a dancing elephant would distract."
      }
    },
    {
      "icon": "✍️",
      "title": "Use dialogue and senses purposefully",
      "explain": "**Learn the idea:** A few precise words of dialogue or sound can make a scene vivid. Balance details so the reader can still tell what is happening.\n\n**Original example:** Telling: ''Jade was nervous before the race.'' Showing: ''Jade twisted her shoelace twice and looked towards the starting line.''\n\n**Why this matters:** Carefully identify the particular detail, word or number that supports the idea.",
      "example": "**WATCH MY THINKING**\n''Is it time yet?'' Jade asked, her voice thin. A whistle sounded across the oval. I use dialogue plus a sound detail to build tension.\n\n**PRACTISE THIS**\n**Original practice:** ''Mila was disappointed when the rain cancelled her picnic.'' First, name the emotion: disappointed. Next, replace the label with two observable details. Try: ''Mila folded the picnic blanket without speaking. She watched droplets run down the window.'' Explain which clue suggests disappointment. **Check:** folding away the blanket and watching the rain fit the cancelled event; shouting with joy would suggest a different feeling. Then transform ''Finn was delighted with the drawing'' into two showing sentences of your own.\n\n**CHECK**\nFind one correct example from the guidance and explain why it works.",
      "notice": "A few precise words of dialogue or sound can make a scene vivid. Balance details so the reader can still tell what is happening. Compare your own explanation with the example.",
      "check": {
        "question": "Which is direct telling?",
        "options": [
          "Her voice wobbled.",
          "He held his breath.",
          "Rina felt angry.",
          "He slammed the drawer."
        ],
        "correct_index": 2,
        "explanation": "Rina felt angry. — ''Is it time yet?'' Jade asked, her voice thin. A whistle sounded across the oval. I use dialogue plus a sound detail to build tension."
      }
    },
    {
      "icon": "✅",
      "title": "Revise without overloading the paragraph",
      "explain": "**Learn the idea:** Compare the effect before and after a revision. Cut details that don''t strengthen the intended meaning; keep the main event understandable.\n\n**Original example:** Telling: ''Jade was nervous before the race.'' Showing: ''Jade twisted her shoelace twice and looked towards the starting line.''\n\n**Why this matters:** Carefully identify the particular detail, word or number that supports the idea.",
      "example": "**WATCH MY THINKING**\nBefore: ''Leo was excited.'' After: ''Leo bounced on his toes and whispered, \"They''re opening the gates!\"'' The action and dialogue make excitement visible.\n\n**PRACTISE THIS**\n**Original practice:** ''Mila was disappointed when the rain cancelled her picnic.'' First, name the emotion: disappointed. Next, replace the label with two observable details. Try: ''Mila folded the picnic blanket without speaking. She watched droplets run down the window.'' Explain which clue suggests disappointment. **Check:** folding away the blanket and watching the rain fit the cancelled event; shouting with joy would suggest a different feeling. Then transform ''Finn was delighted with the drawing'' into two showing sentences of your own.\n\n**CHECK**\nFind one correct example from the guidance and explain why it works.",
      "notice": "Compare the effect before and after a revision. Cut details that don''t strengthen the intended meaning; keep the main event understandable. Compare your own explanation with the example.",
      "check": {
        "question": "Which detail fits disappointment after a cancelled trip?",
        "options": [
          "Putting away a packed bag with a sigh",
          "Running onto a sunny beach",
          "Celebrating a surprise prize",
          "Laughing about a joke"
        ],
        "correct_index": 0,
        "explanation": "Putting away a packed bag with a sigh — Before: ''Leo was excited.'' After: ''Leo bounced on his toes and whispered, \"They''re opening the gates!\"'' The action and dialogue make excitement visible."
      }
    }
  ],
  "worked_example": "## Watch the model\n\nTelling: ''Jade was nervous before the race.'' Showing: ''Jade twisted her shoelace twice and looked towards the starting line.''\n\n**1. Telling names an emotion; showing gives clues:** ''Jade felt nervous'' tells us. ''Jade''s fingers trembled while she tied her shoes'' shows a physical clue. The clue suggests nervousness, but the writer doesn''t need to name it.\n\n**2. Choose an action connected to the moment:** For a child awaiting a race, I write: ''Jade glanced at the starter, then checked the knot again.'' These actions fit the moment; a dancing elephant would distract.\n\n**3. Use dialogue and senses purposefully:** ''Is it time yet?'' Jade asked, her voice thin. A whistle sounded across the oval. I use dialogue plus a sound detail to build tension.\n\n**4. Revise without overloading the paragraph:** Before: ''Leo was excited.'' After: ''Leo bounced on his toes and whispered, \"They''re opening the gates!\"'' The action and dialogue make excitement visible.\n\n**Try:** Explain one decision without reading the model. Then identify a mistake this approach avoids.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 560 220\"><rect width=\"560\" height=\"220\" rx=\"12\" fill=\"#f2f8f6\"/><text x=\"18\" y=\"32\" font-family=\"Arial\" font-size=\"19\" fill=\"#203f35\">Show feelings with clues</text><rect x=\"12\" y=\"67\" width=\"129\" height=\"108\" rx=\"9\" fill=\"#e0eee4\"/><text x=\"21\" y=\"125\" font-family=\"Arial\" font-size=\"16\" fill=\"#193a2c\">LEARN</text><rect x=\"151\" y=\"67\" width=\"129\" height=\"108\" rx=\"9\" fill=\"#e8edf8\"/><text x=\"160\" y=\"125\" font-family=\"Arial\" font-size=\"16\" fill=\"#193a2c\">MODEL</text><rect x=\"290\" y=\"67\" width=\"129\" height=\"108\" rx=\"9\" fill=\"#e0eee4\"/><text x=\"299\" y=\"125\" font-family=\"Arial\" font-size=\"16\" fill=\"#193a2c\">PRACTISE</text><rect x=\"429\" y=\"67\" width=\"129\" height=\"108\" rx=\"9\" fill=\"#e8edf8\"/><text x=\"438\" y=\"125\" font-family=\"Arial\" font-size=\"16\" fill=\"#193a2c\">CHECK</text></svg>",
      "alt": "A four-part show, don''t tell: make feelings visible learning process: learn, model, practise, check.",
      "caption": "Use the model and practice to check your independent response."
    }
  ],
  "guided_practice": "**Original practice:** ''Mila was disappointed when the rain cancelled her picnic.'' First, name the emotion: disappointed. Next, replace the label with two observable details. Try: ''Mila folded the picnic blanket without speaking. She watched droplets run down the window.'' Explain which clue suggests disappointment. **Check:** folding away the blanket and watching the rain fit the cancelled event; shouting with joy would suggest a different feeling. Then transform ''Finn was delighted with the drawing'' into two showing sentences of your own.",
  "independent_task": "**Write a scene:** A student named Amara opens an envelope containing the result of an art competition. Choose whether Amara feels worried, relieved or thrilled. Write 5–7 sentences with at least two actions, one short dialogue line and one sensory detail that show the feeling **without naming the emotion**. Underline three clues, identify what each suggests and revise one sentence to make its meaning clearer.",
  "response_prompt": "Complete the show, don''t tell: make feelings visible independent challenge with evidence and one improvement.",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "Which sentence shows rather than tells nervousness?",
      "options": [
        "Kai was nervous.",
        "Kai''s hands shook as the doors opened.",
        "Nervousness is a feeling.",
        "It was a nervous day."
      ],
      "correct_index": 1,
      "explanation": "Kai''s hands shook as the doors opened. — check this using the specific text or method taught in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "Which detail suggests excitement?",
      "options": [
        "Lee jumped and grinned at the announcement.",
        "Lee slept peacefully.",
        "Lee stared at a blank wall.",
        "Lee counted the tiles without reacting."
      ],
      "correct_index": 0,
      "explanation": "Lee jumped and grinned at the announcement. — check this using the specific text or method taught in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "Which is direct telling?",
      "options": [
        "Her voice wobbled.",
        "He held his breath.",
        "Rina felt angry.",
        "He slammed the drawer."
      ],
      "correct_index": 2,
      "explanation": "Rina felt angry. — check this using the specific text or method taught in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "Which detail fits disappointment after a cancelled trip?",
      "options": [
        "Putting away a packed bag with a sigh",
        "Running onto a sunny beach",
        "Celebrating a surprise prize",
        "Laughing about a joke"
      ],
      "correct_index": 0,
      "explanation": "Putting away a packed bag with a sigh — check this using the specific text or method taught in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "Which line uses dialogue as a clue?",
      "options": [
        "The sky was blue.",
        "''Did I make it?'' whispered Amara.",
        "The table was wooden.",
        "The envelope was white."
      ],
      "correct_index": 1,
      "explanation": "''Did I make it?'' whispered Amara. — check this using the specific text or method taught in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "Which revision shows relief?",
      "options": [
        "Amara was relieved.",
        "Amara exhaled and loosened her grip on the envelope.",
        "She felt an emotion.",
        "The competition took place."
      ],
      "correct_index": 1,
      "explanation": "Amara exhaled and loosened her grip on the envelope. — check this using the specific text or method taught in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "Why include a sound detail?",
      "options": [
        "To help the reader imagine a moment",
        "To replace all characters",
        "To prove every emotion",
        "To make the plot disappear"
      ],
      "correct_index": 0,
      "explanation": "To help the reader imagine a moment — check this using the specific text or method taught in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "Which writing choice is most precise?",
      "options": [
        "Add twenty unrelated adjectives.",
        "Select two details tied to the event.",
        "Repeat happy five times.",
        "Describe a different story."
      ],
      "correct_index": 1,
      "explanation": "Select two details tied to the event. — check this using the specific text or method taught in the lesson."
    },
    {
      "type": "short_answer",
      "question": "Complete the independent show, don''t tell: make feelings visible task with examples or working.",
      "sample_answer": "Amara held the envelope by one corner. The paper made a crisp scratching sound as she opened it. ''Please,'' she whispered. Her eyes raced over the first line. She let out the breath she had been holding, and a wide grin spread across her face. ''I did it!'' she called.",
      "marking_guide": "Check the full task instructions, accurate relevant content and supporting explanations.",
      "explanation": "Show the work rather than only the conclusion."
    },
    {
      "type": "short_answer",
      "question": "Explain a topic-specific revision or correction in your show, don''t tell: make feelings visible work.",
      "sample_answer": "My clues are the held breath, released breath and grin. They suggest worry changing into relief and excitement. I revised ''Amara smiled'' to ''a wide grin spread across her face'' to make the response more vivid.",
      "marking_guide": "Look for a genuine explanation of a correct change, with evidence.",
      "explanation": "A meaningful correction is supported by the learning."
    }
  ],
  "parent_notes": "Parent: Ask the learner to explain their original example before sharing the model. Allow accessible methods and check the actual independent evidence.\n\nParent: **Written response model 1.** Amara held the envelope by one corner. The paper made a crisp scratching sound as she opened it. ''Please,'' she whispered. Her eyes raced over the first line. She let out the breath she had been holding, and a wide grin spread across her face. ''I did it!'' she called.\n\nParent: **Written response model 2.** My clues are the held breath, released breath and grin. They suggest worry changing into relief and excitement. I revised ''Amara smiled'' to ''a wide grin spread across her face'' to make the response more vivid.\n\nParent: Review independent work and written questions. The eight multiple-choice questions need 8/8 for the existing 90 percent threshold. NESA code verification is outstanding.",
  "evidence_instructions": "Save the guided show, don''t tell: make feelings visible tasks, the original independent response, one improvement and both written quiz answers.",
  "offline_alternative": "Work with the original examples on paper or using an appropriate accessible format; save a photograph, notes or typed response.",
  "extension": "Invent a more challenging example of show, don''t tell: make feelings visible and explain how the technique still applies.",
  "stage_hints": {
    "accept": [
      "Read the instructions for Show, Don''t Tell: Make Feelings Visible.",
      "Return to the original example and look for a relevant word, event or number linked to show, don''t tell: make feelings visible.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ],
    "teach0": [
      "Read the instructions for Telling names an emotion; showing gives clues.",
      "Return to the original example and look for a relevant word, event or number linked to telling names an emotion; showing gives clues.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ],
    "teach1": [
      "Read the instructions for Choose an action connected to the moment.",
      "Return to the original example and look for a relevant word, event or number linked to choose an action connected to the moment.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ],
    "teach2": [
      "Read the instructions for Use dialogue and senses purposefully.",
      "Return to the original example and look for a relevant word, event or number linked to use dialogue and senses purposefully.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ],
    "teach3": [
      "Read the instructions for Revise without overloading the paragraph.",
      "Return to the original example and look for a relevant word, event or number linked to revise without overloading the paragraph.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ],
    "learn": [
      "Read the instructions for Show, Don''t Tell: Make Feelings Visible.",
      "Return to the original example and look for a relevant word, event or number linked to show, don''t tell: make feelings visible.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ],
    "guided": [
      "Read the instructions for Show, Don''t Tell: Make Feelings Visible.",
      "Return to the original example and look for a relevant word, event or number linked to show, don''t tell: make feelings visible.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ],
    "write": [
      "Read the instructions for Show, Don''t Tell: Make Feelings Visible.",
      "Return to the original example and look for a relevant word, event or number linked to show, don''t tell: make feelings visible.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ],
    "quiz": [
      "Read the instructions for Show, Don''t Tell: Make Feelings Visible.",
      "Return to the original example and look for a relevant word, event or number linked to show, don''t tell: make feelings visible.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ],
    "submit": [
      "Read the instructions for Show, Don''t Tell: Make Feelings Visible.",
      "Return to the original example and look for a relevant word, event or number linked to show, don''t tell: make feelings visible.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ]
  }
}'),updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE seed_key='s2-eng-y3-w04-l2';

-- s2-eng-y3-w04-l3
UPDATE lessons SET title='Sentence Bridges: Conjunctions and Complex Sentences',data=json_patch(data,'{
  "seed_key": "s2-eng-y3-w04-l3",
  "title": "Sentence Bridges: Conjunctions and Complex Sentences",
  "stage": "Stage 2",
  "learning_area": "English",
  "year_level": 3,
  "week": 4,
  "lesson_number": 3,
  "duration_minutes": 60,
  "child_mission": "Explore sentence bridges: conjunctions and complex sentences using the original example, supported practice and independent challenge.",
  "learning_intention": "We are learning to understand and apply sentence bridges: conjunctions and complex sentences with accurate explanations.",
  "success_criteria": [
    "I can explain the concept in my own words.",
    "I can follow the worked example and say why it works.",
    "I can complete guided practice and use feedback.",
    "I can complete a new independent challenge.",
    "I can check and explain one improvement."
  ],
  "materials": [
    "All original texts and examples provided.",
    "Optional paper and pencil or appropriate accessibility alternative."
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
      "title": "Four teaching ideas",
      "cards": [
        {
          "front": "Join two ideas with a reason",
          "back": "A **conjunction** joins words or groups of words. **Because** introduces a reason; **when** introduces a time relationship; **although** shows contrast. Choose a word that matches the meaning."
        },
        {
          "front": "Identify an independent clause",
          "back": "A **main (independent) clause** can stand as a complete sentence: ''The children went inside.'' It has a subject and a verb and expresses a complete idea."
        },
        {
          "front": "Add a dependent clause",
          "back": "A dependent clause adds information but does not usually work as a complete sentence on its own. Join it to a main clause to build a complex sentence."
        },
        {
          "front": "Punctuate and check meaning",
          "back": "A dependent clause at the start commonly takes a comma before the main clause: ''Although it rained, we walked.'' With the main clause first, a comma is often unnecessary: ''We walked although it rained.''"
        }
      ]
    }
  ],
  "printable_resource": {
    "title": "Sentence Bridges: Conjunctions and Complex Sentences",
    "instructions": "Read the original example, try the guided practice, and complete the challenge before reviewing the models.",
    "passage": "''The children went inside because rain began.'' The main clause tells what happened; the because-clause explains why.",
    "prompts": [
      "What does this concept mean?",
      "Show an accurate example.",
      "Complete the independent work.",
      "Explain what you improved."
    ]
  },
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "🔎",
      "title": "Join two ideas with a reason",
      "explain": "**Learn the idea:** A **conjunction** joins words or groups of words. **Because** introduces a reason; **when** introduces a time relationship; **although** shows contrast. Choose a word that matches the meaning.\n\n**Original example:** ''The children went inside because rain began.'' The main clause tells what happened; the because-clause explains why.\n\n**Why this matters:** Carefully identify the particular detail, word or number that supports the idea.",
      "example": "**WATCH MY THINKING**\n''I put on a jacket because the wind was cold'' explains why. Swapping because for although changes the relationship and may make the meaning confusing.\n\n**PRACTISE THIS**\n**Combine and explain:**\n1. ''The gate closed. The wind grew strong.'' Use because: **The gate closed because the wind grew strong.**\n2. ''The bell rang. Our class lined up.'' Use when: **When the bell rang, our class lined up.**\n3. ''The puzzle was difficult. Priya finished it.'' Use although: **Although the puzzle was difficult, Priya finished it.**\n4. Identify the main clause in example 3: **Priya finished it.**\n\n**Watch out:** ''Because the wind grew strong.'' is a dependent-clause fragment when it stands alone.\n\n**CHECK**\nFind one correct example from the guidance and explain why it works.",
      "notice": "A **conjunction** joins words or groups of words. **Because** introduces a reason; **when** introduces a time relationship; **although** shows contrast. Choose a word that matches the meaning. Compare your own explanation with the example.",
      "check": {
        "question": "Which word introduces a reason?",
        "options": [
          "because",
          "although",
          "when",
          "or"
        ],
        "correct_index": 0,
        "explanation": "because — ''I put on a jacket because the wind was cold'' explains why. Swapping because for although changes the relationship and may make the meaning confusing."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Learning clue: Sentence Bridges: Conjunctions and Complex Sentences",
            "transcript": "Pip: ''Because it rained.'' Is that a full sentence?\nJuno: It needs a main clause to tell what happened. Try ''We went inside because it rained.''\nPip: And ''When the bell rang, we lined up'' tells when we acted.\nJuno: Exactly. Pause and say which words form the main clause.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "''Because it rained.'' Is that a full sentence?"
                  },
                  {
                    "who": "juno",
                    "text": "It needs a main clause to tell what happened. Try ''We went inside because it rained.''"
                  },
                  {
                    "who": "pip",
                    "text": "And ''When the bell rang, we lined up'' tells when we acted."
                  },
                  {
                    "who": "juno",
                    "text": "Exactly. Pause and say which words form the main clause.",
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
      "title": "Identify an independent clause",
      "explain": "**Learn the idea:** A **main (independent) clause** can stand as a complete sentence: ''The children went inside.'' It has a subject and a verb and expresses a complete idea.\n\n**Original example:** ''The children went inside because rain began.'' The main clause tells what happened; the because-clause explains why.\n\n**Why this matters:** Carefully identify the particular detail, word or number that supports the idea.",
      "example": "**WATCH MY THINKING**\nI separate ''The children went inside'' from ''because rain began''. The first part makes sense alone; the second leaves a reader waiting for what happened.\n\n**PRACTISE THIS**\n**Combine and explain:**\n1. ''The gate closed. The wind grew strong.'' Use because: **The gate closed because the wind grew strong.**\n2. ''The bell rang. Our class lined up.'' Use when: **When the bell rang, our class lined up.**\n3. ''The puzzle was difficult. Priya finished it.'' Use although: **Although the puzzle was difficult, Priya finished it.**\n4. Identify the main clause in example 3: **Priya finished it.**\n\n**Watch out:** ''Because the wind grew strong.'' is a dependent-clause fragment when it stands alone.\n\n**CHECK**\nFind one correct example from the guidance and explain why it works.",
      "notice": "A **main (independent) clause** can stand as a complete sentence: ''The children went inside.'' It has a subject and a verb and expresses a complete idea. Compare your own explanation with the example.",
      "check": {
        "question": "Which can stand alone as a sentence?",
        "options": [
          "Because the dog barked",
          "When the bell rang",
          "The class lined up",
          "Although it rained"
        ],
        "correct_index": 2,
        "explanation": "The class lined up — I separate ''The children went inside'' from ''because rain began''. The first part makes sense alone; the second leaves a reader waiting for what happened."
      }
    },
    {
      "icon": "✍️",
      "title": "Add a dependent clause",
      "explain": "**Learn the idea:** A dependent clause adds information but does not usually work as a complete sentence on its own. Join it to a main clause to build a complex sentence.\n\n**Original example:** ''The children went inside because rain began.'' The main clause tells what happened; the because-clause explains why.\n\n**Why this matters:** Carefully identify the particular detail, word or number that supports the idea.",
      "example": "**WATCH MY THINKING**\n''When the bell rang'' is incomplete by itself. ''When the bell rang, the children packed their bags'' supplies a complete main clause and a time relationship.\n\n**PRACTISE THIS**\n**Combine and explain:**\n1. ''The gate closed. The wind grew strong.'' Use because: **The gate closed because the wind grew strong.**\n2. ''The bell rang. Our class lined up.'' Use when: **When the bell rang, our class lined up.**\n3. ''The puzzle was difficult. Priya finished it.'' Use although: **Although the puzzle was difficult, Priya finished it.**\n4. Identify the main clause in example 3: **Priya finished it.**\n\n**Watch out:** ''Because the wind grew strong.'' is a dependent-clause fragment when it stands alone.\n\n**CHECK**\nFind one correct example from the guidance and explain why it works.",
      "notice": "A dependent clause adds information but does not usually work as a complete sentence on its own. Join it to a main clause to build a complex sentence. Compare your own explanation with the example.",
      "check": {
        "question": "Which sentence shows contrast?",
        "options": [
          "Although it rained, we played.",
          "We went in because it rained.",
          "When it rained, we stopped.",
          "We saw rain and clouds."
        ],
        "correct_index": 0,
        "explanation": "Although it rained, we played. — ''When the bell rang'' is incomplete by itself. ''When the bell rang, the children packed their bags'' supplies a complete main clause and a time relationship."
      }
    },
    {
      "icon": "✅",
      "title": "Punctuate and check meaning",
      "explain": "**Learn the idea:** A dependent clause at the start commonly takes a comma before the main clause: ''Although it rained, we walked.'' With the main clause first, a comma is often unnecessary: ''We walked although it rained.''\n\n**Original example:** ''The children went inside because rain began.'' The main clause tells what happened; the because-clause explains why.\n\n**Why this matters:** Carefully identify the particular detail, word or number that supports the idea.",
      "example": "**WATCH MY THINKING**\nI compare ''Because I was tired, I went to bed'' and ''I went to bed because I was tired.'' Both express the same reason. I check the sentence contains a complete main clause.\n\n**PRACTISE THIS**\n**Combine and explain:**\n1. ''The gate closed. The wind grew strong.'' Use because: **The gate closed because the wind grew strong.**\n2. ''The bell rang. Our class lined up.'' Use when: **When the bell rang, our class lined up.**\n3. ''The puzzle was difficult. Priya finished it.'' Use although: **Although the puzzle was difficult, Priya finished it.**\n4. Identify the main clause in example 3: **Priya finished it.**\n\n**Watch out:** ''Because the wind grew strong.'' is a dependent-clause fragment when it stands alone.\n\n**CHECK**\nFind one correct example from the guidance and explain why it works.",
      "notice": "A dependent clause at the start commonly takes a comma before the main clause: ''Although it rained, we walked.'' With the main clause first, a comma is often unnecessary: ''We walked although it rained.'' Compare your own explanation with the example.",
      "check": {
        "question": "Which is a dependent clause?",
        "options": [
          "I went inside",
          "The dog barked",
          "because the wind rose",
          "The team cheered"
        ],
        "correct_index": 2,
        "explanation": "because the wind rose — I compare ''Because I was tired, I went to bed'' and ''I went to bed because I was tired.'' Both express the same reason. I check the sentence contains a complete main clause."
      }
    }
  ],
  "worked_example": "## Watch the model\n\n''The children went inside because rain began.'' The main clause tells what happened; the because-clause explains why.\n\n**1. Join two ideas with a reason:** ''I put on a jacket because the wind was cold'' explains why. Swapping because for although changes the relationship and may make the meaning confusing.\n\n**2. Identify an independent clause:** I separate ''The children went inside'' from ''because rain began''. The first part makes sense alone; the second leaves a reader waiting for what happened.\n\n**3. Add a dependent clause:** ''When the bell rang'' is incomplete by itself. ''When the bell rang, the children packed their bags'' supplies a complete main clause and a time relationship.\n\n**4. Punctuate and check meaning:** I compare ''Because I was tired, I went to bed'' and ''I went to bed because I was tired.'' Both express the same reason. I check the sentence contains a complete main clause.\n\n**Try:** Explain one decision without reading the model. Then identify a mistake this approach avoids.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 560 220\"><rect width=\"560\" height=\"220\" rx=\"12\" fill=\"#f2f8f6\"/><text x=\"18\" y=\"32\" font-family=\"Arial\" font-size=\"19\" fill=\"#203f35\">Build a complex sentence</text><rect x=\"12\" y=\"67\" width=\"129\" height=\"108\" rx=\"9\" fill=\"#e0eee4\"/><text x=\"21\" y=\"125\" font-family=\"Arial\" font-size=\"16\" fill=\"#193a2c\">LEARN</text><rect x=\"151\" y=\"67\" width=\"129\" height=\"108\" rx=\"9\" fill=\"#e8edf8\"/><text x=\"160\" y=\"125\" font-family=\"Arial\" font-size=\"16\" fill=\"#193a2c\">MODEL</text><rect x=\"290\" y=\"67\" width=\"129\" height=\"108\" rx=\"9\" fill=\"#e0eee4\"/><text x=\"299\" y=\"125\" font-family=\"Arial\" font-size=\"16\" fill=\"#193a2c\">PRACTISE</text><rect x=\"429\" y=\"67\" width=\"129\" height=\"108\" rx=\"9\" fill=\"#e8edf8\"/><text x=\"438\" y=\"125\" font-family=\"Arial\" font-size=\"16\" fill=\"#193a2c\">CHECK</text></svg>",
      "alt": "A four-part sentence bridges: conjunctions and complex sentences learning process: learn, model, practise, check.",
      "caption": "Use the model and practice to check your independent response."
    }
  ],
  "guided_practice": "**Combine and explain:**\n1. ''The gate closed. The wind grew strong.'' Use because: **The gate closed because the wind grew strong.**\n2. ''The bell rang. Our class lined up.'' Use when: **When the bell rang, our class lined up.**\n3. ''The puzzle was difficult. Priya finished it.'' Use although: **Although the puzzle was difficult, Priya finished it.**\n4. Identify the main clause in example 3: **Priya finished it.**\n\n**Watch out:** ''Because the wind grew strong.'' is a dependent-clause fragment when it stands alone.",
  "independent_task": "**Repair the school newspaper:** Combine these ideas into four complex sentences, using because, when and although at least once: (A) The sports carnival paused / heavy rain began. (B) Theo reached the finish line / the crowd cheered. (C) The task looked difficult / Sam completed it. (D) The lights went out / we used torches. Underline one main clause and circle a dependent clause in each sentence. Explain why two of your conjunction choices fit the meaning. Correct the fragment ''Although the race was long.''",
  "response_prompt": "Complete the sentence bridges: conjunctions and complex sentences independent challenge with evidence and one improvement.",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "Which word introduces a reason?",
      "options": [
        "because",
        "although",
        "when",
        "or"
      ],
      "correct_index": 0,
      "explanation": "because — check this using the specific text or method taught in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "Which can stand alone as a sentence?",
      "options": [
        "Because the dog barked",
        "When the bell rang",
        "The class lined up",
        "Although it rained"
      ],
      "correct_index": 2,
      "explanation": "The class lined up — check this using the specific text or method taught in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "Which sentence shows contrast?",
      "options": [
        "Although it rained, we played.",
        "We went in because it rained.",
        "When it rained, we stopped.",
        "We saw rain and clouds."
      ],
      "correct_index": 0,
      "explanation": "Although it rained, we played. — check this using the specific text or method taught in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "Which is a dependent clause?",
      "options": [
        "I went inside",
        "The dog barked",
        "because the wind rose",
        "The team cheered"
      ],
      "correct_index": 2,
      "explanation": "because the wind rose — check this using the specific text or method taught in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "Which is punctuated well?",
      "options": [
        "When the bell rang, we lined up.",
        "When, the bell rang we lined up.",
        "When the bell rang we, lined up.",
        "When the, bell rang we lined up."
      ],
      "correct_index": 0,
      "explanation": "When the bell rang, we lined up. — check this using the specific text or method taught in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "Which explains a time relationship?",
      "options": [
        "I smiled because I won.",
        "I smiled although I lost.",
        "When I heard the news, I smiled.",
        "I smiled and laughed."
      ],
      "correct_index": 2,
      "explanation": "When I heard the news, I smiled. — check this using the specific text or method taught in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "How can ''Because it was late'' become complete?",
      "options": [
        "Because it was late.",
        "Because it was late, we went home.",
        "Because, it was late.",
        "Because it was."
      ],
      "correct_index": 1,
      "explanation": "Because it was late, we went home. — check this using the specific text or method taught in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "Which identifies the main clause in ''Although it was cold, Mia swam''?",
      "options": [
        "Although it was cold",
        "it was cold",
        "Mia swam",
        "Although"
      ],
      "correct_index": 2,
      "explanation": "Mia swam — check this using the specific text or method taught in the lesson."
    },
    {
      "type": "short_answer",
      "question": "Complete the independent sentence bridges: conjunctions and complex sentences task with examples or working.",
      "sample_answer": "The carnival paused because heavy rain began. When Theo reached the finish line, the crowd cheered. Although the task looked difficult, Sam completed it. Because the lights went out, we used torches.",
      "marking_guide": "Check the full task instructions, accurate relevant content and supporting explanations.",
      "explanation": "Show the work rather than only the conclusion."
    },
    {
      "type": "short_answer",
      "question": "Explain a topic-specific revision or correction in your sentence bridges: conjunctions and complex sentences work.",
      "sample_answer": "''Although the race was long'' needs a main clause: ''Although the race was long, the runners finished.'' I used although for unexpected contrast and because to show a reason. In ''When Theo reached the finish line, the crowd cheered,'' the main clause is ''the crowd cheered''.",
      "marking_guide": "Look for a genuine explanation of a correct change, with evidence.",
      "explanation": "A meaningful correction is supported by the learning."
    }
  ],
  "parent_notes": "Parent: Ask the learner to explain their original example before sharing the model. Allow accessible methods and check the actual independent evidence.\n\nParent: **Written response model 1.** The carnival paused because heavy rain began. When Theo reached the finish line, the crowd cheered. Although the task looked difficult, Sam completed it. Because the lights went out, we used torches.\n\nParent: **Written response model 2.** ''Although the race was long'' needs a main clause: ''Although the race was long, the runners finished.'' I used although for unexpected contrast and because to show a reason. In ''When Theo reached the finish line, the crowd cheered,'' the main clause is ''the crowd cheered''.\n\nParent: Review independent work and written questions. The eight multiple-choice questions need 8/8 for the existing 90 percent threshold. NESA code verification is outstanding.",
  "evidence_instructions": "Save the guided sentence bridges: conjunctions and complex sentences tasks, the original independent response, one improvement and both written quiz answers.",
  "offline_alternative": "Work with the original examples on paper or using an appropriate accessible format; save a photograph, notes or typed response.",
  "extension": "Invent a more challenging example of sentence bridges: conjunctions and complex sentences and explain how the technique still applies.",
  "stage_hints": {
    "accept": [
      "Read the instructions for Sentence Bridges: Conjunctions and Complex Sentences.",
      "Return to the original example and look for a relevant word, event or number linked to sentence bridges: conjunctions and complex sentences.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ],
    "teach0": [
      "Read the instructions for Join two ideas with a reason.",
      "Return to the original example and look for a relevant word, event or number linked to join two ideas with a reason.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ],
    "teach1": [
      "Read the instructions for Identify an independent clause.",
      "Return to the original example and look for a relevant word, event or number linked to identify an independent clause.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ],
    "teach2": [
      "Read the instructions for Add a dependent clause.",
      "Return to the original example and look for a relevant word, event or number linked to add a dependent clause.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ],
    "teach3": [
      "Read the instructions for Punctuate and check meaning.",
      "Return to the original example and look for a relevant word, event or number linked to punctuate and check meaning.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ],
    "learn": [
      "Read the instructions for Sentence Bridges: Conjunctions and Complex Sentences.",
      "Return to the original example and look for a relevant word, event or number linked to sentence bridges: conjunctions and complex sentences.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ],
    "guided": [
      "Read the instructions for Sentence Bridges: Conjunctions and Complex Sentences.",
      "Return to the original example and look for a relevant word, event or number linked to sentence bridges: conjunctions and complex sentences.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ],
    "write": [
      "Read the instructions for Sentence Bridges: Conjunctions and Complex Sentences.",
      "Return to the original example and look for a relevant word, event or number linked to sentence bridges: conjunctions and complex sentences.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ],
    "quiz": [
      "Read the instructions for Sentence Bridges: Conjunctions and Complex Sentences.",
      "Return to the original example and look for a relevant word, event or number linked to sentence bridges: conjunctions and complex sentences.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ],
    "submit": [
      "Read the instructions for Sentence Bridges: Conjunctions and Complex Sentences.",
      "Return to the original example and look for a relevant word, event or number linked to sentence bridges: conjunctions and complex sentences.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ]
  }
}'),updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE seed_key='s2-eng-y3-w04-l3';

-- s2-eng-y3-w04-l4
UPDATE lessons SET title='Handwriting Workshop: Speed Without Losing Clarity',data=json_patch(data,'{
  "seed_key": "s2-eng-y3-w04-l4",
  "title": "Handwriting Workshop: Speed Without Losing Clarity",
  "stage": "Stage 2",
  "learning_area": "English",
  "year_level": 3,
  "week": 4,
  "lesson_number": 4,
  "duration_minutes": 60,
  "child_mission": "Explore handwriting workshop: speed without losing clarity using the original example, supported practice and independent challenge.",
  "learning_intention": "We are learning to understand and apply handwriting workshop: speed without losing clarity with accurate explanations.",
  "success_criteria": [
    "I can explain the concept in my own words.",
    "I can follow the worked example and say why it works.",
    "I can complete guided practice and use feedback.",
    "I can complete a new independent challenge.",
    "I can check and explain one improvement."
  ],
  "materials": [
    "All original texts and examples provided.",
    "Optional paper and pencil or appropriate accessibility alternative."
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
      "title": "Four teaching ideas",
      "cards": [
        {
          "front": "Choose a comfortable and legible writing position",
          "back": "Readable handwriting starts with comfortable posture, useful paper position and a relaxed grip. A child may use an adapted grip or different tools. The aim is clear communication, not a single compulsory hand position."
        },
        {
          "front": "Keep letters and spaces distinguishable",
          "back": "Clear letter shapes and word spaces help another person read. Some letters rise above the body of a line, some descend below it and some have similar forms. Slow down to correct confusing pairs."
        },
        {
          "front": "Use appropriate joins where taught",
          "back": "Joined handwriting can make writing flow, but every join must remain easy to read. Joins should be practised deliberately rather than made by rushing. Print or type alternatives are valid when appropriate."
        },
        {
          "front": "Increase fluency with short meaningful practice",
          "back": "Fluency means writing smoothly while keeping meaning and letter clarity. Practise a short sentence twice, then check errors, spacing and fatigue rather than chasing a speed score."
        }
      ]
    }
  ],
  "printable_resource": {
    "title": "Handwriting Workshop: Speed Without Losing Clarity",
    "instructions": "Read the original example, try the guided practice, and complete the challenge before reviewing the models.",
    "passage": "A learner writes a four-sentence note for a community noticeboard. The first attempt is quick but several letters are hard to distinguish.",
    "prompts": [
      "What does this concept mean?",
      "Show an accurate example.",
      "Complete the independent work.",
      "Explain what you improved."
    ]
  },
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "🔎",
      "title": "Choose a comfortable and legible writing position",
      "explain": "**Learn the idea:** Readable handwriting starts with comfortable posture, useful paper position and a relaxed grip. A child may use an adapted grip or different tools. The aim is clear communication, not a single compulsory hand position.\n\n**Original example:** A learner writes a four-sentence note for a community noticeboard. The first attempt is quick but several letters are hard to distinguish.\n\n**Why this matters:** Carefully identify the particular detail, word or number that supports the idea.",
      "example": "**WATCH MY THINKING**\nI place the page where my writing hand can move freely. I write ''market'' slowly once, checking that every letter can be recognised, then repeat at a comfortable pace.\n\n**PRACTISE THIS**\n**Short practice:** Write or type ''The garden club meets beside the library.'' Once, focus on letter shapes and spacing; on the second copy, aim for a smoother rhythm without sacrificing readability. Circle one letter pair you find difficult and practise it three times. Ask a parent to read your sentence without hints. **Check:** If they misread a word, clarify its letter shape or spacing; speed is not the only goal. Record a short observation about comfort or fatigue.\n\n**CHECK**\nFind one correct example from the guidance and explain why it works.",
      "notice": "Readable handwriting starts with comfortable posture, useful paper position and a relaxed grip. A child may use an adapted grip or different tools. The aim is clear communication, not a single compulsory hand position. Compare your own explanation with the example.",
      "check": {
        "question": "What is the main goal of handwriting fluency?",
        "options": [
          "Write as fast as possible no matter what",
          "Write smoothly while remaining readable",
          "Never lift the pencil",
          "Only use capital letters"
        ],
        "correct_index": 1,
        "explanation": "Write smoothly while remaining readable — I place the page where my writing hand can move freely. I write ''market'' slowly once, checking that every letter can be recognised, then repeat at a comfortable pace."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Learning clue: Handwriting Workshop: Speed Without Losing Clarity",
            "transcript": "Pip: If I write faster, am I automatically better?\nJuno: Only if the reader can still understand every word and your hand feels comfortable.\nPip: I''ll check spaces and letter shapes before trying a smoother pace.\nJuno: Good. Pause and choose one part of your writing to improve.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "If I write faster, am I automatically better?"
                  },
                  {
                    "who": "juno",
                    "text": "Only if the reader can still understand every word and your hand feels comfortable."
                  },
                  {
                    "who": "pip",
                    "text": "I''ll check spaces and letter shapes before trying a smoother pace."
                  },
                  {
                    "who": "juno",
                    "text": "Good. Pause and choose one part of your writing to improve.",
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
      "title": "Keep letters and spaces distinguishable",
      "explain": "**Learn the idea:** Clear letter shapes and word spaces help another person read. Some letters rise above the body of a line, some descend below it and some have similar forms. Slow down to correct confusing pairs.\n\n**Original example:** A learner writes a four-sentence note for a community noticeboard. The first attempt is quick but several letters are hard to distinguish.\n\n**Why this matters:** Carefully identify the particular detail, word or number that supports the idea.",
      "example": "**WATCH MY THINKING**\nIn ''The little kitten sat'', I check the spaces between words and distinguish i, l and t. The reader should not need to guess where one word ends.\n\n**PRACTISE THIS**\n**Short practice:** Write or type ''The garden club meets beside the library.'' Once, focus on letter shapes and spacing; on the second copy, aim for a smoother rhythm without sacrificing readability. Circle one letter pair you find difficult and practise it three times. Ask a parent to read your sentence without hints. **Check:** If they misread a word, clarify its letter shape or spacing; speed is not the only goal. Record a short observation about comfort or fatigue.\n\n**CHECK**\nFind one correct example from the guidance and explain why it works.",
      "notice": "Clear letter shapes and word spaces help another person read. Some letters rise above the body of a line, some descend below it and some have similar forms. Slow down to correct confusing pairs. Compare your own explanation with the example.",
      "check": {
        "question": "Which supports readability?",
        "options": [
          "Clear spaces between words",
          "Letters overlapping at random",
          "Removing punctuation",
          "Writing on top of earlier lines"
        ],
        "correct_index": 0,
        "explanation": "Clear spaces between words — In ''The little kitten sat'', I check the spaces between words and distinguish i, l and t. The reader should not need to guess where one word ends."
      }
    },
    {
      "icon": "✍️",
      "title": "Use appropriate joins where taught",
      "explain": "**Learn the idea:** Joined handwriting can make writing flow, but every join must remain easy to read. Joins should be practised deliberately rather than made by rushing. Print or type alternatives are valid when appropriate.\n\n**Original example:** A learner writes a four-sentence note for a community noticeboard. The first attempt is quick but several letters are hard to distinguish.\n\n**Why this matters:** Carefully identify the particular detail, word or number that supports the idea.",
      "example": "**WATCH MY THINKING**\nI practise a familiar join in ''in'' and ''an'' where this fits the child''s taught handwriting style. Then I compare whether the letters remain recognisable.\n\n**PRACTISE THIS**\n**Short practice:** Write or type ''The garden club meets beside the library.'' Once, focus on letter shapes and spacing; on the second copy, aim for a smoother rhythm without sacrificing readability. Circle one letter pair you find difficult and practise it three times. Ask a parent to read your sentence without hints. **Check:** If they misread a word, clarify its letter shape or spacing; speed is not the only goal. Record a short observation about comfort or fatigue.\n\n**CHECK**\nFind one correct example from the guidance and explain why it works.",
      "notice": "Joined handwriting can make writing flow, but every join must remain easy to read. Joins should be practised deliberately rather than made by rushing. Print or type alternatives are valid when appropriate. Compare your own explanation with the example.",
      "check": {
        "question": "If writing becomes uncomfortable, what should you do?",
        "options": [
          "Push through pain",
          "Change to a comfortable method or take a break",
          "Grip harder",
          "Stop communicating entirely"
        ],
        "correct_index": 1,
        "explanation": "Change to a comfortable method or take a break — I practise a familiar join in ''in'' and ''an'' where this fits the child''s taught handwriting style. Then I compare whether the letters remain recognisable."
      }
    },
    {
      "icon": "✅",
      "title": "Increase fluency with short meaningful practice",
      "explain": "**Learn the idea:** Fluency means writing smoothly while keeping meaning and letter clarity. Practise a short sentence twice, then check errors, spacing and fatigue rather than chasing a speed score.\n\n**Original example:** A learner writes a four-sentence note for a community noticeboard. The first attempt is quick but several letters are hard to distinguish.\n\n**Why this matters:** Carefully identify the particular detail, word or number that supports the idea.",
      "example": "**WATCH MY THINKING**\nI copy ''Please bring a reusable bottle.'' twice. On the second attempt I keep the words readable and reduce unnecessary stops. I review one improvement: spaces, formation or comfort.\n\n**PRACTISE THIS**\n**Short practice:** Write or type ''The garden club meets beside the library.'' Once, focus on letter shapes and spacing; on the second copy, aim for a smoother rhythm without sacrificing readability. Circle one letter pair you find difficult and practise it three times. Ask a parent to read your sentence without hints. **Check:** If they misread a word, clarify its letter shape or spacing; speed is not the only goal. Record a short observation about comfort or fatigue.\n\n**CHECK**\nFind one correct example from the guidance and explain why it works.",
      "notice": "Fluency means writing smoothly while keeping meaning and letter clarity. Practise a short sentence twice, then check errors, spacing and fatigue rather than chasing a speed score. Compare your own explanation with the example.",
      "check": {
        "question": "Which is a useful revision?",
        "options": [
          "Make confusing letters clearer",
          "Hide the title",
          "Remove all spaces",
          "Write much smaller regardless of clarity"
        ],
        "correct_index": 0,
        "explanation": "Make confusing letters clearer — I copy ''Please bring a reusable bottle.'' twice. On the second attempt I keep the words readable and reduce unnecessary stops. I review one improvement: spaces, formation or comfort."
      }
    }
  ],
  "worked_example": "## Watch the model\n\nA learner writes a four-sentence note for a community noticeboard. The first attempt is quick but several letters are hard to distinguish.\n\n**1. Choose a comfortable and legible writing position:** I place the page where my writing hand can move freely. I write ''market'' slowly once, checking that every letter can be recognised, then repeat at a comfortable pace.\n\n**2. Keep letters and spaces distinguishable:** In ''The little kitten sat'', I check the spaces between words and distinguish i, l and t. The reader should not need to guess where one word ends.\n\n**3. Use appropriate joins where taught:** I practise a familiar join in ''in'' and ''an'' where this fits the child''s taught handwriting style. Then I compare whether the letters remain recognisable.\n\n**4. Increase fluency with short meaningful practice:** I copy ''Please bring a reusable bottle.'' twice. On the second attempt I keep the words readable and reduce unnecessary stops. I review one improvement: spaces, formation or comfort.\n\n**Try:** Explain one decision without reading the model. Then identify a mistake this approach avoids.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 560 220\"><rect width=\"560\" height=\"220\" rx=\"12\" fill=\"#f2f8f6\"/><text x=\"18\" y=\"32\" font-family=\"Arial\" font-size=\"19\" fill=\"#203f35\">Make handwriting readable</text><rect x=\"12\" y=\"67\" width=\"129\" height=\"108\" rx=\"9\" fill=\"#e0eee4\"/><text x=\"21\" y=\"125\" font-family=\"Arial\" font-size=\"16\" fill=\"#193a2c\">LEARN</text><rect x=\"151\" y=\"67\" width=\"129\" height=\"108\" rx=\"9\" fill=\"#e8edf8\"/><text x=\"160\" y=\"125\" font-family=\"Arial\" font-size=\"16\" fill=\"#193a2c\">MODEL</text><rect x=\"290\" y=\"67\" width=\"129\" height=\"108\" rx=\"9\" fill=\"#e0eee4\"/><text x=\"299\" y=\"125\" font-family=\"Arial\" font-size=\"16\" fill=\"#193a2c\">PRACTISE</text><rect x=\"429\" y=\"67\" width=\"129\" height=\"108\" rx=\"9\" fill=\"#e8edf8\"/><text x=\"438\" y=\"125\" font-family=\"Arial\" font-size=\"16\" fill=\"#193a2c\">CHECK</text></svg>",
      "alt": "A four-part handwriting workshop: speed without losing clarity learning process: learn, model, practise, check.",
      "caption": "Use the model and practice to check your independent response."
    }
  ],
  "guided_practice": "**Short practice:** Write or type ''The garden club meets beside the library.'' Once, focus on letter shapes and spacing; on the second copy, aim for a smoother rhythm without sacrificing readability. Circle one letter pair you find difficult and practise it three times. Ask a parent to read your sentence without hints. **Check:** If they misread a word, clarify its letter shape or spacing; speed is not the only goal. Record a short observation about comfort or fatigue.",
  "independent_task": "**Community announcement:** Create a neat 4–5 sentence notice inviting families to a neighbourhood book swap. Write a first version on paper if comfortable, identify two areas to improve, and make a second version. Include a title, date or time placeholder and a friendly instruction. Compare clarity, consistency and ease of reading. If handwriting is inaccessible, use typed text and evaluate layout, spacing and readability instead. Record one specific improvement.",
  "response_prompt": "Complete the handwriting workshop: speed without losing clarity independent challenge with evidence and one improvement.",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "What is the main goal of handwriting fluency?",
      "options": [
        "Write as fast as possible no matter what",
        "Write smoothly while remaining readable",
        "Never lift the pencil",
        "Only use capital letters"
      ],
      "correct_index": 1,
      "explanation": "Write smoothly while remaining readable — check this using the specific text or method taught in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "Which supports readability?",
      "options": [
        "Clear spaces between words",
        "Letters overlapping at random",
        "Removing punctuation",
        "Writing on top of earlier lines"
      ],
      "correct_index": 0,
      "explanation": "Clear spaces between words — check this using the specific text or method taught in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "If writing becomes uncomfortable, what should you do?",
      "options": [
        "Push through pain",
        "Change to a comfortable method or take a break",
        "Grip harder",
        "Stop communicating entirely"
      ],
      "correct_index": 1,
      "explanation": "Change to a comfortable method or take a break — check this using the specific text or method taught in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "Which is a useful revision?",
      "options": [
        "Make confusing letters clearer",
        "Hide the title",
        "Remove all spaces",
        "Write much smaller regardless of clarity"
      ],
      "correct_index": 0,
      "explanation": "Make confusing letters clearer — check this using the specific text or method taught in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "What matters when joining letters?",
      "options": [
        "The join must remain legible",
        "Every letter must connect",
        "The writer must never pause",
        "The writing must look identical for everyone"
      ],
      "correct_index": 0,
      "explanation": "The join must remain legible — check this using the specific text or method taught in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "How can a learner check a handwritten notice?",
      "options": [
        "Ask someone to read it without hints",
        "Only count the letters",
        "Always race a timer",
        "Cover difficult words"
      ],
      "correct_index": 0,
      "explanation": "Ask someone to read it without hints — check this using the specific text or method taught in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "Which is a suitable accessibility alternative?",
      "options": [
        "Typed notice with clear spacing",
        "No way to complete the activity",
        "Compulsory fast writing",
        "Only writing with a broken pencil"
      ],
      "correct_index": 0,
      "explanation": "Typed notice with clear spacing — check this using the specific text or method taught in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "Which sentence best describes a useful reflection?",
      "options": [
        "I improved the spacing between two words.",
        "I did something.",
        "My page has ink.",
        "I used a pencil."
      ],
      "correct_index": 0,
      "explanation": "I improved the spacing between two words. — check this using the specific text or method taught in the lesson."
    },
    {
      "type": "short_answer",
      "question": "Complete the independent handwriting workshop: speed without losing clarity task with examples or working.",
      "sample_answer": "Book Swap Day: Families are welcome to bring a book they have finished. Visit the community room on [date] at [time]. Place your book on the shared table. Choose a different book to take home. Please help us keep the shelves tidy.",
      "marking_guide": "Check the full task instructions, accurate relevant content and supporting explanations.",
      "explanation": "Show the work rather than only the conclusion."
    },
    {
      "type": "short_answer",
      "question": "Explain a topic-specific revision or correction in your handwriting workshop: speed without losing clarity work.",
      "sample_answer": "My first copy had crowded spaces after the title and an unclear lowercase r. On the second copy I separated the words more clearly and adjusted the letter shape. My parent could read the notice without prompting.",
      "marking_guide": "Look for a genuine explanation of a correct change, with evidence.",
      "explanation": "A meaningful correction is supported by the learning."
    }
  ],
  "parent_notes": "Parent: Ask the learner to explain their original example before sharing the model. Allow accessible methods and check the actual independent evidence.\n\nParent: **Written response model 1.** Book Swap Day: Families are welcome to bring a book they have finished. Visit the community room on [date] at [time]. Place your book on the shared table. Choose a different book to take home. Please help us keep the shelves tidy.\n\nParent: **Written response model 2.** My first copy had crowded spaces after the title and an unclear lowercase r. On the second copy I separated the words more clearly and adjusted the letter shape. My parent could read the notice without prompting.\n\nParent: Review independent work and written questions. The eight multiple-choice questions need 8/8 for the existing 90 percent threshold. NESA code verification is outstanding.",
  "evidence_instructions": "Save the guided handwriting workshop: speed without losing clarity tasks, the original independent response, one improvement and both written quiz answers.",
  "offline_alternative": "Work with the original examples on paper or using an appropriate accessible format; save a photograph, notes or typed response.",
  "extension": "Invent a more challenging example of handwriting workshop: speed without losing clarity and explain how the technique still applies.",
  "stage_hints": {
    "accept": [
      "Read the instructions for Handwriting Workshop: Speed Without Losing Clarity.",
      "Return to the original example and look for a relevant word, event or number linked to handwriting workshop: speed without losing clarity.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ],
    "teach0": [
      "Read the instructions for Choose a comfortable and legible writing position.",
      "Return to the original example and look for a relevant word, event or number linked to choose a comfortable and legible writing position.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ],
    "teach1": [
      "Read the instructions for Keep letters and spaces distinguishable.",
      "Return to the original example and look for a relevant word, event or number linked to keep letters and spaces distinguishable.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ],
    "teach2": [
      "Read the instructions for Use appropriate joins where taught.",
      "Return to the original example and look for a relevant word, event or number linked to use appropriate joins where taught.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ],
    "teach3": [
      "Read the instructions for Increase fluency with short meaningful practice.",
      "Return to the original example and look for a relevant word, event or number linked to increase fluency with short meaningful practice.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ],
    "learn": [
      "Read the instructions for Handwriting Workshop: Speed Without Losing Clarity.",
      "Return to the original example and look for a relevant word, event or number linked to handwriting workshop: speed without losing clarity.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ],
    "guided": [
      "Read the instructions for Handwriting Workshop: Speed Without Losing Clarity.",
      "Return to the original example and look for a relevant word, event or number linked to handwriting workshop: speed without losing clarity.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ],
    "write": [
      "Read the instructions for Handwriting Workshop: Speed Without Losing Clarity.",
      "Return to the original example and look for a relevant word, event or number linked to handwriting workshop: speed without losing clarity.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ],
    "quiz": [
      "Read the instructions for Handwriting Workshop: Speed Without Losing Clarity.",
      "Return to the original example and look for a relevant word, event or number linked to handwriting workshop: speed without losing clarity.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ],
    "submit": [
      "Read the instructions for Handwriting Workshop: Speed Without Losing Clarity.",
      "Return to the original example and look for a relevant word, event or number linked to handwriting workshop: speed without losing clarity.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ]
  }
}'),updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE seed_key='s2-eng-y3-w04-l4';

-- s2-mat-y3-w04-l1
UPDATE lessons SET title='Numbers in the Real World: Estimate, Read, Compare',data=json_patch(data,'{
  "seed_key": "s2-mat-y3-w04-l1",
  "title": "Numbers in the Real World: Estimate, Read, Compare",
  "stage": "Stage 2",
  "learning_area": "Mathematics",
  "year_level": 3,
  "week": 4,
  "lesson_number": 1,
  "duration_minutes": 60,
  "child_mission": "Explore numbers in the real world: estimate, read, compare using the original example, supported practice and independent challenge.",
  "learning_intention": "We are learning to understand and apply numbers in the real world: estimate, read, compare with accurate explanations.",
  "success_criteria": [
    "I can explain the concept in my own words.",
    "I can follow the worked example and say why it works.",
    "I can complete guided practice and use feedback.",
    "I can complete a new independent challenge.",
    "I can check and explain one improvement."
  ],
  "materials": [
    "All original texts and examples provided.",
    "Optional paper and pencil or appropriate accessibility alternative."
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
      "title": "Four teaching ideas",
      "cards": [
        {
          "front": "Read numbers in their place-value positions",
          "back": "A four-digit count is made from thousands, hundreds, tens and ones. A zero holds an empty place. Reading the places accurately is the first step before comparing counts."
        },
        {
          "front": "Compare two real counts",
          "back": "Compare from the largest place. Both counts start with two thousands, but Sunday has six hundreds while Saturday has four. This decides which is greater before examining tens or ones."
        },
        {
          "front": "Choose an appropriate rounding scale",
          "back": "Rounding is helpful for quick communication, but the choice of nearest ten or hundred changes the estimate. Identify the scale and use *about* for approximate figures."
        },
        {
          "front": "Check a claim against exact data",
          "back": "Estimates should be sensible and never presented as exact counts. A true comparison has to match the original numbers; rounding can hide small differences."
        }
      ]
    }
  ],
  "printable_resource": {
    "title": "Numbers in the Real World: Estimate, Read, Compare",
    "instructions": "Read the original example, try the guided practice, and complete the challenge before reviewing the models.",
    "passage": "A local community event records 2,475 visitors on Saturday and 2,608 on Sunday. Organisers want to compare totals and share a sensible estimate.",
    "prompts": [
      "What does this concept mean?",
      "Show an accurate example.",
      "Complete the independent work.",
      "Explain what you improved."
    ]
  },
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "🔎",
      "title": "Read numbers in their place-value positions",
      "explain": "**Learn the idea:** A four-digit count is made from thousands, hundreds, tens and ones. A zero holds an empty place. Reading the places accurately is the first step before comparing counts.\n\n**Original example:** A local community event records 2,475 visitors on Saturday and 2,608 on Sunday. Organisers want to compare totals and share a sensible estimate.\n\n**Why this matters:** Carefully identify the particular detail, word or number that supports the idea.",
      "example": "**WATCH MY THINKING**\n2,475 has two thousands, four hundreds, seven tens and five ones. It is two thousand four hundred and seventy-five. For 2,608 the hundreds digit is six and the tens digit is zero.\n\n**PRACTISE THIS**\n**Food drive:** A group collected 1,849 cans on Monday and 1,925 on Tuesday. Read both numbers, decide which is greater and calculate the difference (**76**). Round each to nearest hundred (**1,800** and **1,900**). Discuss why this broad estimate hides some of the exact change. **Try:** 3,460 people and 3,509 people. The larger is **3,509**, difference **49**, nearest hundreds **3,500** and **3,500**, so rounded counts alone cannot prove they were equal.\n\n**CHECK**\nFind one correct example from the guidance and explain why it works.",
      "notice": "A four-digit count is made from thousands, hundreds, tens and ones. A zero holds an empty place. Reading the places accurately is the first step before comparing counts. Compare your own explanation with the example.",
      "check": {
        "question": "Which is larger?",
        "options": [
          "3,285",
          "3,642",
          "They are equal",
          "Both less than 3,000"
        ],
        "correct_index": 1,
        "explanation": "3,642 — 2,475 has two thousands, four hundreds, seven tens and five ones. It is two thousand four hundred and seventy-five. For 2,608 the hundreds digit is six and the tens digit is zero."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Learning clue: Numbers in the Real World: Estimate, Read, Compare",
            "transcript": "Pip: The event recorded 2,475 visitors on Saturday and 2,608 on Sunday.\nJuno: Compare thousands first, then hundreds. Which number is greater?\nPip: Sunday is greater. I can calculate the exact difference before I round.\nJuno: Good. Pause and choose a useful estimate for a quick announcement.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "The event recorded 2,475 visitors on Saturday and 2,608 on Sunday."
                  },
                  {
                    "who": "juno",
                    "text": "Compare thousands first, then hundreds. Which number is greater?"
                  },
                  {
                    "who": "pip",
                    "text": "Sunday is greater. I can calculate the exact difference before I round."
                  },
                  {
                    "who": "juno",
                    "text": "Good. Pause and choose a useful estimate for a quick announcement.",
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
      "title": "Compare two real counts",
      "explain": "**Learn the idea:** Compare from the largest place. Both counts start with two thousands, but Sunday has six hundreds while Saturday has four. This decides which is greater before examining tens or ones.\n\n**Original example:** A local community event records 2,475 visitors on Saturday and 2,608 on Sunday. Organisers want to compare totals and share a sensible estimate.\n\n**Why this matters:** Carefully identify the particular detail, word or number that supports the idea.",
      "example": "**WATCH MY THINKING**\n2,608 is larger than 2,475. I can check the difference by subtracting: 2,608−2,475=133. I report *133 more visitors* rather than claiming one day was twice as busy.\n\n**PRACTISE THIS**\n**Food drive:** A group collected 1,849 cans on Monday and 1,925 on Tuesday. Read both numbers, decide which is greater and calculate the difference (**76**). Round each to nearest hundred (**1,800** and **1,900**). Discuss why this broad estimate hides some of the exact change. **Try:** 3,460 people and 3,509 people. The larger is **3,509**, difference **49**, nearest hundreds **3,500** and **3,500**, so rounded counts alone cannot prove they were equal.\n\n**CHECK**\nFind one correct example from the guidance and explain why it works.",
      "notice": "Compare from the largest place. Both counts start with two thousands, but Sunday has six hundreds while Saturday has four. This decides which is greater before examining tens or ones. Compare your own explanation with the example.",
      "check": {
        "question": "What is the difference 3,642−3,285?",
        "options": [
          "257",
          "357",
          "457",
          "367"
        ],
        "correct_index": 1,
        "explanation": "357 — 2,608 is larger than 2,475. I can check the difference by subtracting: 2,608−2,475=133. I report *133 more visitors* rather than claiming one day was twice as busy."
      }
    },
    {
      "icon": "✍️",
      "title": "Choose an appropriate rounding scale",
      "explain": "**Learn the idea:** Rounding is helpful for quick communication, but the choice of nearest ten or hundred changes the estimate. Identify the scale and use *about* for approximate figures.\n\n**Original example:** A local community event records 2,475 visitors on Saturday and 2,608 on Sunday. Organisers want to compare totals and share a sensible estimate.\n\n**Why this matters:** Carefully identify the particular detail, word or number that supports the idea.",
      "example": "**WATCH MY THINKING**\n2,475 rounds to 2,480 to nearest ten and 2,500 to nearest hundred. 2,608 rounds to 2,610 to nearest ten and 2,600 to nearest hundred.\n\n**PRACTISE THIS**\n**Food drive:** A group collected 1,849 cans on Monday and 1,925 on Tuesday. Read both numbers, decide which is greater and calculate the difference (**76**). Round each to nearest hundred (**1,800** and **1,900**). Discuss why this broad estimate hides some of the exact change. **Try:** 3,460 people and 3,509 people. The larger is **3,509**, difference **49**, nearest hundreds **3,500** and **3,500**, so rounded counts alone cannot prove they were equal.\n\n**CHECK**\nFind one correct example from the guidance and explain why it works.",
      "notice": "Rounding is helpful for quick communication, but the choice of nearest ten or hundred changes the estimate. Identify the scale and use *about* for approximate figures. Compare your own explanation with the example.",
      "check": {
        "question": "What is 3,285 to nearest ten?",
        "options": [
          "3,280",
          "3,290",
          "3,300",
          "3,200"
        ],
        "correct_index": 1,
        "explanation": "3,290 — 2,475 rounds to 2,480 to nearest ten and 2,500 to nearest hundred. 2,608 rounds to 2,610 to nearest ten and 2,600 to nearest hundred."
      }
    },
    {
      "icon": "✅",
      "title": "Check a claim against exact data",
      "explain": "**Learn the idea:** Estimates should be sensible and never presented as exact counts. A true comparison has to match the original numbers; rounding can hide small differences.\n\n**Original example:** A local community event records 2,475 visitors on Saturday and 2,608 on Sunday. Organisers want to compare totals and share a sensible estimate.\n\n**Why this matters:** Carefully identify the particular detail, word or number that supports the idea.",
      "example": "**WATCH MY THINKING**\n''About 2,500 came on Saturday'' is a reasonable nearest-hundred estimate. ''Exactly 2,500 attended Saturday'' is wrong. I check exact totals before making a claim about the difference.\n\n**PRACTISE THIS**\n**Food drive:** A group collected 1,849 cans on Monday and 1,925 on Tuesday. Read both numbers, decide which is greater and calculate the difference (**76**). Round each to nearest hundred (**1,800** and **1,900**). Discuss why this broad estimate hides some of the exact change. **Try:** 3,460 people and 3,509 people. The larger is **3,509**, difference **49**, nearest hundreds **3,500** and **3,500**, so rounded counts alone cannot prove they were equal.\n\n**CHECK**\nFind one correct example from the guidance and explain why it works.",
      "notice": "Estimates should be sensible and never presented as exact counts. A true comparison has to match the original numbers; rounding can hide small differences. Compare your own explanation with the example.",
      "check": {
        "question": "What is 3,642 to nearest ten?",
        "options": [
          "3,640",
          "3,650",
          "3,600",
          "3,700"
        ],
        "correct_index": 0,
        "explanation": "3,640 — ''About 2,500 came on Saturday'' is a reasonable nearest-hundred estimate. ''Exactly 2,500 attended Saturday'' is wrong. I check exact totals before making a claim about the difference."
      }
    }
  ],
  "worked_example": "## Watch the model\n\nA local community event records 2,475 visitors on Saturday and 2,608 on Sunday. Organisers want to compare totals and share a sensible estimate.\n\n**1. Read numbers in their place-value positions:** 2,475 has two thousands, four hundreds, seven tens and five ones. It is two thousand four hundred and seventy-five. For 2,608 the hundreds digit is six and the tens digit is zero.\n\n**2. Compare two real counts:** 2,608 is larger than 2,475. I can check the difference by subtracting: 2,608−2,475=133. I report *133 more visitors* rather than claiming one day was twice as busy.\n\n**3. Choose an appropriate rounding scale:** 2,475 rounds to 2,480 to nearest ten and 2,500 to nearest hundred. 2,608 rounds to 2,610 to nearest ten and 2,600 to nearest hundred.\n\n**4. Check a claim against exact data:** ''About 2,500 came on Saturday'' is a reasonable nearest-hundred estimate. ''Exactly 2,500 attended Saturday'' is wrong. I check exact totals before making a claim about the difference.\n\n**Try:** Explain one decision without reading the model. Then identify a mistake this approach avoids.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 560 220\"><rect width=\"560\" height=\"220\" rx=\"12\" fill=\"#f2f8f6\"/><text x=\"18\" y=\"32\" font-family=\"Arial\" font-size=\"19\" fill=\"#203f35\">Compare exact and rounded counts</text><rect x=\"12\" y=\"67\" width=\"129\" height=\"108\" rx=\"9\" fill=\"#e0eee4\"/><text x=\"21\" y=\"125\" font-family=\"Arial\" font-size=\"16\" fill=\"#193a2c\">LEARN</text><rect x=\"151\" y=\"67\" width=\"129\" height=\"108\" rx=\"9\" fill=\"#e8edf8\"/><text x=\"160\" y=\"125\" font-family=\"Arial\" font-size=\"16\" fill=\"#193a2c\">MODEL</text><rect x=\"290\" y=\"67\" width=\"129\" height=\"108\" rx=\"9\" fill=\"#e0eee4\"/><text x=\"299\" y=\"125\" font-family=\"Arial\" font-size=\"16\" fill=\"#193a2c\">PRACTISE</text><rect x=\"429\" y=\"67\" width=\"129\" height=\"108\" rx=\"9\" fill=\"#e8edf8\"/><text x=\"438\" y=\"125\" font-family=\"Arial\" font-size=\"16\" fill=\"#193a2c\">CHECK</text></svg>",
      "alt": "A four-part numbers in the real world: estimate, read, compare learning process: learn, model, practise, check.",
      "caption": "Use the model and practice to check your independent response."
    }
  ],
  "guided_practice": "**Food drive:** A group collected 1,849 cans on Monday and 1,925 on Tuesday. Read both numbers, decide which is greater and calculate the difference (**76**). Round each to nearest hundred (**1,800** and **1,900**). Discuss why this broad estimate hides some of the exact change. **Try:** 3,460 people and 3,509 people. The larger is **3,509**, difference **49**, nearest hundreds **3,500** and **3,500**, so rounded counts alone cannot prove they were equal.",
  "independent_task": "**Community data desk:** A garden fair counted 3,285 visitors on Friday and 3,642 on Saturday. (1) Write both counts in words and expanded form. (2) Compare them and find the exact difference with working. (3) Round each to nearest ten and hundred. (4) Write two accurate announcements: one exact and one approximate. (5) Explain how rounding can change what listeners notice about attendance.",
  "response_prompt": "Complete the numbers in the real world: estimate, read, compare independent challenge with evidence and one improvement.",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "Which is larger?",
      "options": [
        "3,285",
        "3,642",
        "They are equal",
        "Both less than 3,000"
      ],
      "correct_index": 1,
      "explanation": "3,642 — check this using the specific text or method taught in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "What is the difference 3,642−3,285?",
      "options": [
        "257",
        "357",
        "457",
        "367"
      ],
      "correct_index": 1,
      "explanation": "357 — check this using the specific text or method taught in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "What is 3,285 to nearest ten?",
      "options": [
        "3,280",
        "3,290",
        "3,300",
        "3,200"
      ],
      "correct_index": 1,
      "explanation": "3,290 — check this using the specific text or method taught in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "What is 3,642 to nearest ten?",
      "options": [
        "3,640",
        "3,650",
        "3,600",
        "3,700"
      ],
      "correct_index": 0,
      "explanation": "3,640 — check this using the specific text or method taught in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "What is 3,285 to nearest hundred?",
      "options": [
        "3,200",
        "3,280",
        "3,300",
        "3,400"
      ],
      "correct_index": 2,
      "explanation": "3,300 — check this using the specific text or method taught in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "What is 3,642 to nearest hundred?",
      "options": [
        "3,600",
        "3,700",
        "3,640",
        "3,650"
      ],
      "correct_index": 0,
      "explanation": "3,600 — check this using the specific text or method taught in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "What is 3,642 expanded?",
      "options": [
        "3,000+600+40+2",
        "3,000+60+400+2",
        "300+600+40+2",
        "3,000+600+4+2"
      ],
      "correct_index": 0,
      "explanation": "3,000+600+40+2 — check this using the specific text or method taught in the lesson."
    },
    {
      "type": "multiple_choice",
      "question": "Which is a truthful approximate statement?",
      "options": [
        "Exactly 3,600 people came Saturday",
        "About 3,600 people came Saturday",
        "Both days had identical totals",
        "Friday had more than Saturday"
      ],
      "correct_index": 1,
      "explanation": "About 3,600 people came Saturday — check this using the specific text or method taught in the lesson."
    },
    {
      "type": "short_answer",
      "question": "Complete the independent numbers in the real world: estimate, read, compare task with examples or working.",
      "sample_answer": "Friday: 3,285 = 3,000+200+80+5, three thousand two hundred and eighty-five. Saturday: 3,642 = 3,000+600+40+2, three thousand six hundred and forty-two. Saturday exceeds Friday by 357. To nearest ten: 3,290 and 3,640. To nearest hundred: 3,300 and 3,600.",
      "marking_guide": "Check the full task instructions, accurate relevant content and supporting explanations.",
      "explanation": "Show the work rather than only the conclusion."
    },
    {
      "type": "short_answer",
      "question": "Explain a topic-specific revision or correction in your numbers in the real world: estimate, read, compare work.",
      "sample_answer": "Exact: ''Saturday had 357 more visitors than Friday.'' Approximate: ''About 3,600 visitors came on Saturday, to the nearest hundred.'' Estimates communicate scale, but can hide smaller differences or exact totals.",
      "marking_guide": "Look for a genuine explanation of a correct change, with evidence.",
      "explanation": "A meaningful correction is supported by the learning."
    }
  ],
  "parent_notes": "Parent: Ask the learner to explain their original example before sharing the model. Allow accessible methods and check the actual independent evidence.\n\nParent: **Written response model 1.** Friday: 3,285 = 3,000+200+80+5, three thousand two hundred and eighty-five. Saturday: 3,642 = 3,000+600+40+2, three thousand six hundred and forty-two. Saturday exceeds Friday by 357. To nearest ten: 3,290 and 3,640. To nearest hundred: 3,300 and 3,600.\n\nParent: **Written response model 2.** Exact: ''Saturday had 357 more visitors than Friday.'' Approximate: ''About 3,600 visitors came on Saturday, to the nearest hundred.'' Estimates communicate scale, but can hide smaller differences or exact totals.\n\nParent: Review independent work and written questions. The eight multiple-choice questions need 8/8 for the existing 90 percent threshold. NESA code verification is outstanding.",
  "evidence_instructions": "Save the guided numbers in the real world: estimate, read, compare tasks, the original independent response, one improvement and both written quiz answers.",
  "offline_alternative": "Work with the original examples on paper or using an appropriate accessible format; save a photograph, notes or typed response.",
  "extension": "Invent a more challenging example of numbers in the real world: estimate, read, compare and explain how the technique still applies.",
  "stage_hints": {
    "accept": [
      "Read the instructions for Numbers in the Real World: Estimate, Read, Compare.",
      "Return to the original example and look for a relevant word, event or number linked to numbers in the real world: estimate, read, compare.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ],
    "teach0": [
      "Read the instructions for Read numbers in their place-value positions.",
      "Return to the original example and look for a relevant word, event or number linked to read numbers in their place-value positions.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ],
    "teach1": [
      "Read the instructions for Compare two real counts.",
      "Return to the original example and look for a relevant word, event or number linked to compare two real counts.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ],
    "teach2": [
      "Read the instructions for Choose an appropriate rounding scale.",
      "Return to the original example and look for a relevant word, event or number linked to choose an appropriate rounding scale.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ],
    "teach3": [
      "Read the instructions for Check a claim against exact data.",
      "Return to the original example and look for a relevant word, event or number linked to check a claim against exact data.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ],
    "learn": [
      "Read the instructions for Numbers in the Real World: Estimate, Read, Compare.",
      "Return to the original example and look for a relevant word, event or number linked to numbers in the real world: estimate, read, compare.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ],
    "guided": [
      "Read the instructions for Numbers in the Real World: Estimate, Read, Compare.",
      "Return to the original example and look for a relevant word, event or number linked to numbers in the real world: estimate, read, compare.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ],
    "write": [
      "Read the instructions for Numbers in the Real World: Estimate, Read, Compare.",
      "Return to the original example and look for a relevant word, event or number linked to numbers in the real world: estimate, read, compare.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ],
    "quiz": [
      "Read the instructions for Numbers in the Real World: Estimate, Read, Compare.",
      "Return to the original example and look for a relevant word, event or number linked to numbers in the real world: estimate, read, compare.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ],
    "submit": [
      "Read the instructions for Numbers in the Real World: Estimate, Read, Compare.",
      "Return to the original example and look for a relevant word, event or number linked to numbers in the real world: estimate, read, compare.",
      "Write an answer that shows the particular evidence or working, then make one justified correction."
    ]
  }
}'),updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE seed_key='s2-mat-y3-w04-l1';
