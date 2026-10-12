-- Standard v2 depth revisions for four additional Year 3 lessons.

-- s2-mat-y3-w02-l2
UPDATE lessons SET title='Number Line Expedition: Skip Counting',data=json_patch(data,'{
  "seed_key": "s2-mat-y3-w02-l2",
  "title": "Number Line Expedition: Skip Counting",
  "stage": "Stage 2",
  "learning_area": "Mathematics",
  "year_level": 3,
  "week": 2,
  "lesson_number": 2,
  "duration_minutes": 60,
  "child_mission": "Become a number line expedition: skip counting explorer: learn from models, practise and solve the independent challenge.",
  "learning_intention": "We are learning to understand and apply number line expedition: skip counting accurately.",
  "success_criteria": [
    "I can explain the central idea with an example.",
    "I can follow a worked model and justify its steps.",
    "I can practise and check feedback before proceeding.",
    "I can solve the independent task using evidence or working.",
    "I can make one accurate correction."
  ],
  "materials": [
    "All story or number examples are provided.",
    "Optional pencil and paper for diagrams."
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
      "title": "Review the four methods",
      "cards": [
        {
          "front": "Step 1: Notice",
          "back": "A number line has equally spaced marks for equal changes. Here each gap represents five, not one."
        },
        {
          "front": "Step 2: Model",
          "back": "Skip counting adds the same interval at every jump: 120 plus three jumps of five is 135."
        },
        {
          "front": "Step 3: Practise",
          "back": "Counting left subtracts the interval: from 155, three jumps of ten to the left end at 125."
        },
        {
          "front": "Step 4: Check",
          "back": "Comparing routes needs the same number of jumps: three jumps of ten from 120 reach 150, not 135."
        }
      ]
    }
  ],
  "printable_resource": {
    "title": "Number Line Expedition: Skip Counting",
    "instructions": "Read the original situation, attempt the guided exercise, then complete and check the independent task.",
    "passage": "A trail has numbered stops: 120, 125, 130, 135, 140. Another trail begins at 120 and goes up by tens.",
    "prompts": [
      "What do I know?",
      "What is the method?",
      "How do I check my answer?",
      "What did I improve?"
    ]
  },
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "🔎",
      "title": "Notice: Number Line Expedition: Skip Counting",
      "explain": "**What this means:** A number line has equally spaced marks for equal changes. Here each gap represents five, not one.\n\n**Original situation:** A trail has numbered stops: 120, 125, 130, 135, 140. Another trail begins at 120 and goes up by tens.\n\nFocus on a number, action or phrase that supports the taught concept. A correct result needs evidence, not just a guess.",
      "example": "**WATCH MY THINKING**\nRead labels 120,125,130. Both differences are five, so the next is 135. Never guess a gap without checking two marks.\n\n**YOU TRY**\nUse that method in this challenge: Route Pine starts at 175 and goes forward six jumps of 5. Route River starts at 175 and goes forward six jumps of 10. Write all six landing numbers for both, mark the equal interval, and show a backwards route with four jumps of 10 from 260. Compare the ending numbers and explain the difference.\n\n**CHECK**\nExplain what you calculated or inferred and compare with the rule above.",
      "notice": "Avoid inventing a fact or skipping a step. A number line has equally spaced marks for equal changes. Here each gap represents five, not one.",
      "check": {
        "question": "What comes next after 120,125,130?",
        "options": [
          "131",
          "135",
          "140",
          "145"
        ],
        "correct_index": 1,
        "explanation": "Each step is five."
      },
      "visual_before": [
        {
          "episode": {
            "title": "A clue for Number Line Expedition: Skip Counting",
            "transcript": "Pip: The stops read 120,125,130. Are the gaps one?\nJuno: Look at the labels. Each equal jump changes the number by five.\nPip: Three jumps from 120 go to 135!\nJuno: Now pause and imagine the same three jumps of ten.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "The stops read 120,125,130. Are the gaps one?"
                  },
                  {
                    "who": "juno",
                    "text": "Look at the labels. Each equal jump changes the number by five."
                  },
                  {
                    "who": "pip",
                    "text": "Three jumps from 120 go to 135!"
                  },
                  {
                    "who": "juno",
                    "text": "Now pause and imagine the same three jumps of ten.",
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
      "title": "Model: Number Line Expedition: Skip Counting",
      "explain": "**What this means:** Skip counting adds the same interval at every jump: 120 plus three jumps of five is 135.\n\n**Original situation:** A trail has numbered stops: 120, 125, 130, 135, 140. Another trail begins at 120 and goes up by tens.\n\nFocus on a number, action or phrase that supports the taught concept. A correct result needs evidence, not just a guess.",
      "example": "**WATCH MY THINKING**\nDraw arrows 120→125→130→135. Three arrows mean three additions of five: 120+15=135.\n\n**YOU TRY**\nUse that method in this challenge: Route Pine starts at 175 and goes forward six jumps of 5. Route River starts at 175 and goes forward six jumps of 10. Write all six landing numbers for both, mark the equal interval, and show a backwards route with four jumps of 10 from 260. Compare the ending numbers and explain the difference.\n\n**CHECK**\nExplain what you calculated or inferred and compare with the rule above.",
      "notice": "Avoid inventing a fact or skipping a step. Skip counting adds the same interval at every jump: 120 plus three jumps of five is 135.",
      "check": {
        "question": "Which explanation best matches teaching point 2 about number line expedition: skip counting?",
        "options": [
          "Skip counting adds the same interval at every jump: 120 plus three jumps of five is 135.",
          "A random guess without checking",
          "An unrelated observation",
          "Ignoring the example"
        ],
        "correct_index": 0,
        "explanation": "Draw arrows 120→125→130→135. Three arrows mean three additions of five: 120+15=135."
      }
    },
    {
      "icon": "✍️",
      "title": "Practise: Number Line Expedition: Skip Counting",
      "explain": "**What this means:** Counting left subtracts the interval: from 155, three jumps of ten to the left end at 125.\n\n**Original situation:** A trail has numbered stops: 120, 125, 130, 135, 140. Another trail begins at 120 and goes up by tens.\n\nFocus on a number, action or phrase that supports the taught concept. A correct result needs evidence, not just a guess.",
      "example": "**WATCH MY THINKING**\nStart 155→145→135→125. Moving left means subtracting ten each time.\n\n**YOU TRY**\nUse that method in this challenge: Route Pine starts at 175 and goes forward six jumps of 5. Route River starts at 175 and goes forward six jumps of 10. Write all six landing numbers for both, mark the equal interval, and show a backwards route with four jumps of 10 from 260. Compare the ending numbers and explain the difference.\n\n**CHECK**\nExplain what you calculated or inferred and compare with the rule above.",
      "notice": "Avoid inventing a fact or skipping a step. Counting left subtracts the interval: from 155, three jumps of ten to the left end at 125.",
      "check": {
        "question": "Which explanation best matches teaching point 3 about number line expedition: skip counting?",
        "options": [
          "Counting left subtracts the interval: from 155, three jumps of ten to the left end at 125.",
          "A random guess without checking",
          "An unrelated observation",
          "Ignoring the example"
        ],
        "correct_index": 0,
        "explanation": "Start 155→145→135→125. Moving left means subtracting ten each time."
      }
    },
    {
      "icon": "✅",
      "title": "Check: Number Line Expedition: Skip Counting",
      "explain": "**What this means:** Comparing routes needs the same number of jumps: three jumps of ten from 120 reach 150, not 135.\n\n**Original situation:** A trail has numbered stops: 120, 125, 130, 135, 140. Another trail begins at 120 and goes up by tens.\n\nFocus on a number, action or phrase that supports the taught concept. A correct result needs evidence, not just a guess.",
      "example": "**WATCH MY THINKING**\nRoute A: 120+3×5=135; route B: 120+3×10=150. The second ends 15 higher.\n\n**YOU TRY**\nUse that method in this challenge: Route Pine starts at 175 and goes forward six jumps of 5. Route River starts at 175 and goes forward six jumps of 10. Write all six landing numbers for both, mark the equal interval, and show a backwards route with four jumps of 10 from 260. Compare the ending numbers and explain the difference.\n\n**CHECK**\nExplain what you calculated or inferred and compare with the rule above.",
      "notice": "Avoid inventing a fact or skipping a step. Comparing routes needs the same number of jumps: three jumps of ten from 120 reach 150, not 135.",
      "check": {
        "question": "Which explanation best matches teaching point 4 about number line expedition: skip counting?",
        "options": [
          "Comparing routes needs the same number of jumps: three jumps of ten from 120 reach 150, not 135.",
          "A random guess without checking",
          "An unrelated observation",
          "Ignoring the example"
        ],
        "correct_index": 0,
        "explanation": "Route A: 120+3×5=135; route B: 120+3×10=150. The second ends 15 higher."
      }
    }
  ],
  "worked_example": "## Teacher works through the whole example\n\nA trail has numbered stops: 120, 125, 130, 135, 140. Another trail begins at 120 and goes up by tens.\n\n**Step 1:** Read labels 120,125,130. Both differences are five, so the next is 135. Never guess a gap without checking two marks.\n\n**Step 2:** Draw arrows 120→125→130→135. Three arrows mean three additions of five: 120+15=135.\n\n**Step 3:** Start 155→145→135→125. Moving left means subtracting ten each time.\n\n**Step 4:** Route A: 120+3×5=135; route B: 120+3×10=150. The second ends 15 higher.\n\n**Before you continue:** Identify which step was hardest and explain how to check it.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 560 200\"><rect width=\"560\" height=\"200\" rx=\"10\" fill=\"#f5f8f5\"/><text x=\"18\" y=\"32\" font-family=\"Arial\" font-size=\"20\" fill=\"#244133\">Number Line Expedition: Skip</text><rect x=\"15\" y=\"65\" width=\"127\" height=\"92\" rx=\"9\" fill=\"#e0f0e8\"/><text x=\"24\" y=\"111\" font-family=\"Arial\" font-size=\"17\" fill=\"#243831\">Notice</text><rect x=\"153\" y=\"65\" width=\"127\" height=\"92\" rx=\"9\" fill=\"#e5eefa\"/><text x=\"162\" y=\"111\" font-family=\"Arial\" font-size=\"17\" fill=\"#243831\">Model</text><rect x=\"291\" y=\"65\" width=\"127\" height=\"92\" rx=\"9\" fill=\"#e0f0e8\"/><text x=\"300\" y=\"111\" font-family=\"Arial\" font-size=\"17\" fill=\"#243831\">Practise</text><rect x=\"429\" y=\"65\" width=\"127\" height=\"92\" rx=\"9\" fill=\"#e5eefa\"/><text x=\"438\" y=\"111\" font-family=\"Arial\" font-size=\"17\" fill=\"#243831\">Check</text></svg>",
      "alt": "Four-stage method for Number Line Expedition: Skip Counting: Notice, Model, Practise, Check.",
      "caption": "Follow each stage and explain why your answer is correct."
    }
  ],
  "guided_practice": "Try 245,250,__,260,__ (answers 255,265). Try 360,350,__,330 (answer 340; counting backwards by ten). Try five jumps of two from 90: 92,94,96,98,100. Explain why five jumps of ten from 90 would reach 140 instead.",
  "independent_task": "Route Pine starts at 175 and goes forward six jumps of 5. Route River starts at 175 and goes forward six jumps of 10. Write all six landing numbers for both, mark the equal interval, and show a backwards route with four jumps of 10 from 260. Compare the ending numbers and explain the difference.",
  "response_prompt": "Complete the number line expedition: skip counting challenge. Include the relevant working or evidence and a correction.",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "What follows 175,180,185?",
      "options": [
        "186",
        "190",
        "195",
        "200"
      ],
      "correct_index": 1,
      "explanation": "190 follows the taught example and method. A number line has equally spaced marks for equal changes. Here each gap represents five, not one."
    },
    {
      "type": "multiple_choice",
      "question": "What is the interval 230,240,250?",
      "options": [
        "5",
        "10",
        "15",
        "20"
      ],
      "correct_index": 1,
      "explanation": "10 follows the taught example and method. A number line has equally spaced marks for equal changes. Here each gap represents five, not one."
    },
    {
      "type": "multiple_choice",
      "question": "Two jumps of ten after 175?",
      "options": [
        "185",
        "190",
        "195",
        "200"
      ],
      "correct_index": 2,
      "explanation": "195 follows the taught example and method. A number line has equally spaced marks for equal changes. Here each gap represents five, not one."
    },
    {
      "type": "multiple_choice",
      "question": "Four jumps of five after 175?",
      "options": [
        "190",
        "195",
        "200",
        "205"
      ],
      "correct_index": 1,
      "explanation": "195 follows the taught example and method. A number line has equally spaced marks for equal changes. Here each gap represents five, not one."
    },
    {
      "type": "multiple_choice",
      "question": "What fills 480,470,__,450?",
      "options": [
        "460",
        "465",
        "455",
        "440"
      ],
      "correct_index": 0,
      "explanation": "460 follows the taught example and method. A number line has equally spaced marks for equal changes. Here each gap represents five, not one."
    },
    {
      "type": "multiple_choice",
      "question": "Five jumps of two after 96?",
      "options": [
        "100",
        "104",
        "106",
        "108"
      ],
      "correct_index": 2,
      "explanation": "106 follows the taught example and method. A number line has equally spaced marks for equal changes. Here each gap represents five, not one."
    },
    {
      "type": "multiple_choice",
      "question": "Which route goes further in six jumps?",
      "options": [
        "Five-step route",
        "Ten-step route",
        "Both same",
        "Neither moves"
      ],
      "correct_index": 1,
      "explanation": "Ten-step route follows the taught example and method. A number line has equally spaced marks for equal changes. Here each gap represents five, not one."
    },
    {
      "type": "multiple_choice",
      "question": "Four backward jumps of ten from 260?",
      "options": [
        "220",
        "230",
        "240",
        "250"
      ],
      "correct_index": 0,
      "explanation": "220 follows the taught example and method. A number line has equally spaced marks for equal changes. Here each gap represents five, not one."
    },
    {
      "type": "short_answer",
      "question": "Complete the number line expedition: skip counting independent task and explain the result.",
      "sample_answer": "Pine: 180,185,190,195,200,205. River: 185,195,205,215,225,235. Backward: 250,240,230,220.",
      "marking_guide": "Check all requested steps, accurate facts or computations, and clear supporting explanation.",
      "explanation": "Answers must be supported by the original data or text."
    },
    {
      "type": "short_answer",
      "question": "Explain one important checking method or misconception for number line expedition: skip counting.",
      "sample_answer": "River ends at 235; Pine at 205. River is 30 greater because six jumps of ten cover 60, while six jumps of five cover 30.",
      "marking_guide": "Accept specific, mathematically or textually accurate reasoning.",
      "explanation": "A meaningful check uses the taught concept."
    }
  ],
  "parent_notes": "Parent: Ask the child to explain two answers and show the source clue or arithmetic. Do not replace their independent attempt.\n\nParent: **Model written answer 1:** Pine: 180,185,190,195,200,205. River: 185,195,205,215,225,235. Backward: 250,240,230,220.\n\nParent: **Model written answer 2:** River ends at 235; Pine at 205. River is 30 greater because six jumps of ten cover 60, while six jumps of five cover 30.\n\nParent: Save actual evidence, check both written responses and assess independently. NESA mapping awaits verification; eight scored choices need 8/8 at the current 90% threshold.",
  "evidence_instructions": "Keep your number line expedition: skip counting task, guided attempt, one corrected error and both written assessments.",
  "offline_alternative": "Read or copy the examples onto paper, work through the steps with a pencil, and keep a photograph or notes of the independent answer.",
  "extension": "Make another number line expedition: skip counting problem with a new starting value or event. Solve it and show a check.",
  "stage_hints": {
    "accept": [
      "Read the instruction for accept in this number line expedition: skip counting mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ],
    "teach0": [
      "Read the instruction for teach0 in this number line expedition: skip counting mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ],
    "teach1": [
      "Read the instruction for teach1 in this number line expedition: skip counting mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ],
    "teach2": [
      "Read the instruction for teach2 in this number line expedition: skip counting mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ],
    "teach3": [
      "Read the instruction for teach3 in this number line expedition: skip counting mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ],
    "learn": [
      "Read the instruction for learn in this number line expedition: skip counting mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ],
    "guided": [
      "Read the instruction for guided in this number line expedition: skip counting mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ],
    "write": [
      "Read the instruction for write in this number line expedition: skip counting mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ],
    "quiz": [
      "Read the instruction for quiz in this number line expedition: skip counting mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ],
    "submit": [
      "Read the instruction for submit in this number line expedition: skip counting mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ]
  }
}'),updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE seed_key='s2-mat-y3-w02-l2';

-- s2-mat-y3-w02-l3
UPDATE lessons SET title='Pattern Lab: Find the Rule',data=json_patch(data,'{
  "seed_key": "s2-mat-y3-w02-l3",
  "title": "Pattern Lab: Find the Rule",
  "stage": "Stage 2",
  "learning_area": "Mathematics",
  "year_level": 3,
  "week": 2,
  "lesson_number": 3,
  "duration_minutes": 60,
  "child_mission": "Become a pattern lab: find the rule explorer: learn from models, practise and solve the independent challenge.",
  "learning_intention": "We are learning to understand and apply pattern lab: find the rule accurately.",
  "success_criteria": [
    "I can explain the central idea with an example.",
    "I can follow a worked model and justify its steps.",
    "I can practise and check feedback before proceeding.",
    "I can solve the independent task using evidence or working.",
    "I can make one accurate correction."
  ],
  "materials": [
    "All story or number examples are provided.",
    "Optional pencil and paper for diagrams."
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
      "title": "Review the four methods",
      "cards": [
        {
          "front": "Step 1: Notice",
          "back": "An additive pattern follows a rule such as adding seven at each step. Check the difference between adjacent values."
        },
        {
          "front": "Step 2: Model",
          "back": "Verify the rule on every gap: 12,16,20,24 has +4 between all adjacent numbers."
        },
        {
          "front": "Step 3: Practise",
          "back": "A decreasing pattern subtracts the same amount: 90,80,70,60 subtracts ten."
        },
        {
          "front": "Step 4: Check",
          "back": "Explain a pattern with its operation, step size, evidence and new values. A guess from only one pair is weak."
        }
      ]
    }
  ],
  "printable_resource": {
    "title": "Pattern Lab: Find the Rule",
    "instructions": "Read the original situation, attempt the guided exercise, then complete and check the independent task.",
    "passage": "A display flashes 14, 21, 28, 35, __. Another display shows 90, 80, 70, __.",
    "prompts": [
      "What do I know?",
      "What is the method?",
      "How do I check my answer?",
      "What did I improve?"
    ]
  },
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "🔎",
      "title": "Notice: Pattern Lab: Find the Rule",
      "explain": "**What this means:** An additive pattern follows a rule such as adding seven at each step. Check the difference between adjacent values.\n\n**Original situation:** A display flashes 14, 21, 28, 35, __. Another display shows 90, 80, 70, __.\n\nFocus on a number, action or phrase that supports the taught concept. A correct result needs evidence, not just a guess.",
      "example": "**WATCH MY THINKING**\n21−14=7, 28−21=7, 35−28=7; the next is 35+7=42.\n\n**YOU TRY**\nUse that method in this challenge: Decode Panel A: 18,24,30,__,__,48. Panel B: 95,85,75,__,__,45. Panel C: __,56,63,70,__. Fill all gaps, name the rule and show two subtraction checks for each. Identify one wrong guess and explain why it fails.\n\n**CHECK**\nExplain what you calculated or inferred and compare with the rule above.",
      "notice": "Avoid inventing a fact or skipping a step. An additive pattern follows a rule such as adding seven at each step. Check the difference between adjacent values.",
      "check": {
        "question": "Which number follows 14,21,28,35?",
        "options": [
          "36",
          "40",
          "42",
          "49"
        ],
        "correct_index": 2,
        "explanation": "The repeated change is plus seven."
      },
      "visual_before": [
        {
          "episode": {
            "title": "A clue for Pattern Lab: Find the Rule",
            "transcript": "Pip: I see 14,21,28,35. Maybe we double each time?\nJuno: Subtract neighbours. Each difference is seven.\nPip: So the next term must be 42.\nJuno: Pause and test the same rule across every gap.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "I see 14,21,28,35. Maybe we double each time?"
                  },
                  {
                    "who": "juno",
                    "text": "Subtract neighbours. Each difference is seven."
                  },
                  {
                    "who": "pip",
                    "text": "So the next term must be 42."
                  },
                  {
                    "who": "juno",
                    "text": "Pause and test the same rule across every gap.",
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
      "title": "Model: Pattern Lab: Find the Rule",
      "explain": "**What this means:** Verify the rule on every gap: 12,16,20,24 has +4 between all adjacent numbers.\n\n**Original situation:** A display flashes 14, 21, 28, 35, __. Another display shows 90, 80, 70, __.\n\nFocus on a number, action or phrase that supports the taught concept. A correct result needs evidence, not just a guess.",
      "example": "**WATCH MY THINKING**\n12→16,16→20 and 20→24 are all +4. A +8 hypothesis fails at the very first pair.\n\n**YOU TRY**\nUse that method in this challenge: Decode Panel A: 18,24,30,__,__,48. Panel B: 95,85,75,__,__,45. Panel C: __,56,63,70,__. Fill all gaps, name the rule and show two subtraction checks for each. Identify one wrong guess and explain why it fails.\n\n**CHECK**\nExplain what you calculated or inferred and compare with the rule above.",
      "notice": "Avoid inventing a fact or skipping a step. Verify the rule on every gap: 12,16,20,24 has +4 between all adjacent numbers.",
      "check": {
        "question": "Which explanation best matches teaching point 2 about pattern lab: find the rule?",
        "options": [
          "Verify the rule on every gap: 12,16,20,24 has +4 between all adjacent numbers.",
          "A random guess without checking",
          "An unrelated observation",
          "Ignoring the example"
        ],
        "correct_index": 0,
        "explanation": "12→16,16→20 and 20→24 are all +4. A +8 hypothesis fails at the very first pair."
      }
    },
    {
      "icon": "✍️",
      "title": "Practise: Pattern Lab: Find the Rule",
      "explain": "**What this means:** A decreasing pattern subtracts the same amount: 90,80,70,60 subtracts ten.\n\n**Original situation:** A display flashes 14, 21, 28, 35, __. Another display shows 90, 80, 70, __.\n\nFocus on a number, action or phrase that supports the taught concept. A correct result needs evidence, not just a guess.",
      "example": "**WATCH MY THINKING**\n90→80→70→60→50. Each step is ten lower; moving backwards from 90 gives 100.\n\n**YOU TRY**\nUse that method in this challenge: Decode Panel A: 18,24,30,__,__,48. Panel B: 95,85,75,__,__,45. Panel C: __,56,63,70,__. Fill all gaps, name the rule and show two subtraction checks for each. Identify one wrong guess and explain why it fails.\n\n**CHECK**\nExplain what you calculated or inferred and compare with the rule above.",
      "notice": "Avoid inventing a fact or skipping a step. A decreasing pattern subtracts the same amount: 90,80,70,60 subtracts ten.",
      "check": {
        "question": "Which explanation best matches teaching point 3 about pattern lab: find the rule?",
        "options": [
          "A decreasing pattern subtracts the same amount: 90,80,70,60 subtracts ten.",
          "A random guess without checking",
          "An unrelated observation",
          "Ignoring the example"
        ],
        "correct_index": 0,
        "explanation": "90→80→70→60→50. Each step is ten lower; moving backwards from 90 gives 100."
      }
    },
    {
      "icon": "✅",
      "title": "Check: Pattern Lab: Find the Rule",
      "explain": "**What this means:** Explain a pattern with its operation, step size, evidence and new values. A guess from only one pair is weak.\n\n**Original situation:** A display flashes 14, 21, 28, 35, __. Another display shows 90, 80, 70, __.\n\nFocus on a number, action or phrase that supports the taught concept. A correct result needs evidence, not just a guess.",
      "example": "**WATCH MY THINKING**\n5,10,15,20 is add five. State two checked gaps, then extend to 25 and 30.\n\n**YOU TRY**\nUse that method in this challenge: Decode Panel A: 18,24,30,__,__,48. Panel B: 95,85,75,__,__,45. Panel C: __,56,63,70,__. Fill all gaps, name the rule and show two subtraction checks for each. Identify one wrong guess and explain why it fails.\n\n**CHECK**\nExplain what you calculated or inferred and compare with the rule above.",
      "notice": "Avoid inventing a fact or skipping a step. Explain a pattern with its operation, step size, evidence and new values. A guess from only one pair is weak.",
      "check": {
        "question": "Which explanation best matches teaching point 4 about pattern lab: find the rule?",
        "options": [
          "Explain a pattern with its operation, step size, evidence and new values. A guess from only one pair is weak.",
          "A random guess without checking",
          "An unrelated observation",
          "Ignoring the example"
        ],
        "correct_index": 0,
        "explanation": "5,10,15,20 is add five. State two checked gaps, then extend to 25 and 30."
      }
    }
  ],
  "worked_example": "## Teacher works through the whole example\n\nA display flashes 14, 21, 28, 35, __. Another display shows 90, 80, 70, __.\n\n**Step 1:** 21−14=7, 28−21=7, 35−28=7; the next is 35+7=42.\n\n**Step 2:** 12→16,16→20 and 20→24 are all +4. A +8 hypothesis fails at the very first pair.\n\n**Step 3:** 90→80→70→60→50. Each step is ten lower; moving backwards from 90 gives 100.\n\n**Step 4:** 5,10,15,20 is add five. State two checked gaps, then extend to 25 and 30.\n\n**Before you continue:** Identify which step was hardest and explain how to check it.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 560 200\"><rect width=\"560\" height=\"200\" rx=\"10\" fill=\"#f5f8f5\"/><text x=\"18\" y=\"32\" font-family=\"Arial\" font-size=\"20\" fill=\"#244133\">Pattern Lab: Find the Rule</text><rect x=\"15\" y=\"65\" width=\"127\" height=\"92\" rx=\"9\" fill=\"#e0f0e8\"/><text x=\"24\" y=\"111\" font-family=\"Arial\" font-size=\"17\" fill=\"#243831\">Notice</text><rect x=\"153\" y=\"65\" width=\"127\" height=\"92\" rx=\"9\" fill=\"#e5eefa\"/><text x=\"162\" y=\"111\" font-family=\"Arial\" font-size=\"17\" fill=\"#243831\">Model</text><rect x=\"291\" y=\"65\" width=\"127\" height=\"92\" rx=\"9\" fill=\"#e0f0e8\"/><text x=\"300\" y=\"111\" font-family=\"Arial\" font-size=\"17\" fill=\"#243831\">Practise</text><rect x=\"429\" y=\"65\" width=\"127\" height=\"92\" rx=\"9\" fill=\"#e5eefa\"/><text x=\"438\" y=\"111\" font-family=\"Arial\" font-size=\"17\" fill=\"#243831\">Check</text></svg>",
      "alt": "Four-stage method for Pattern Lab: Find the Rule: Notice, Model, Practise, Check.",
      "caption": "Follow each stage and explain why your answer is correct."
    }
  ],
  "guided_practice": "Fill 33,39,45,__,__ (51,57); 104,96,88,__,__ (80,72); and __,28,35,42 (21). Find the error in ''2,5,8,12 follows +3'': the last difference is four, so replace 12 with 11.",
  "independent_task": "Decode Panel A: 18,24,30,__,__,48. Panel B: 95,85,75,__,__,45. Panel C: __,56,63,70,__. Fill all gaps, name the rule and show two subtraction checks for each. Identify one wrong guess and explain why it fails.",
  "response_prompt": "Complete the pattern lab: find the rule challenge. Include the relevant working or evidence and a correction.",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "Next number in 18,24,30?",
      "options": [
        "34",
        "35",
        "36",
        "38"
      ],
      "correct_index": 2,
      "explanation": "36 follows the taught example and method. An additive pattern follows a rule such as adding seven at each step. Check the difference between adjacent values."
    },
    {
      "type": "multiple_choice",
      "question": "Rule for 95,85,75?",
      "options": [
        "Add ten",
        "Subtract ten",
        "Subtract five",
        "Double"
      ],
      "correct_index": 1,
      "explanation": "Subtract ten follows the taught example and method. An additive pattern follows a rule such as adding seven at each step. Check the difference between adjacent values."
    },
    {
      "type": "multiple_choice",
      "question": "Before 56 in __,56,63,70?",
      "options": [
        "49",
        "50",
        "54",
        "42"
      ],
      "correct_index": 0,
      "explanation": "49 follows the taught example and method. An additive pattern follows a rule such as adding seven at each step. Check the difference between adjacent values."
    },
    {
      "type": "multiple_choice",
      "question": "Next in 22,29,36?",
      "options": [
        "42",
        "43",
        "44",
        "45"
      ],
      "correct_index": 1,
      "explanation": "43 follows the taught example and method. An additive pattern follows a rule such as adding seven at each step. Check the difference between adjacent values."
    },
    {
      "type": "multiple_choice",
      "question": "Next in 102,98,94?",
      "options": [
        "92",
        "88",
        "90",
        "86"
      ],
      "correct_index": 2,
      "explanation": "90 follows the taught example and method. An additive pattern follows a rule such as adding seven at each step. Check the difference between adjacent values."
    },
    {
      "type": "multiple_choice",
      "question": "Which increases by six?",
      "options": [
        "7,12,17",
        "8,14,20",
        "10,20,30",
        "21,24,29"
      ],
      "correct_index": 1,
      "explanation": "8,14,20 follows the taught example and method. An additive pattern follows a rule such as adding seven at each step. Check the difference between adjacent values."
    },
    {
      "type": "multiple_choice",
      "question": "Why isn''t 2,5,8,12 a +3 pattern?",
      "options": [
        "First gap four",
        "Last gap four",
        "Second gap two",
        "All gaps three"
      ],
      "correct_index": 1,
      "explanation": "Last gap four follows the taught example and method. An additive pattern follows a rule such as adding seven at each step. Check the difference between adjacent values."
    },
    {
      "type": "multiple_choice",
      "question": "Sixth value in 3,8,13,18,...?",
      "options": [
        "23",
        "25",
        "26",
        "28"
      ],
      "correct_index": 3,
      "explanation": "28 follows the taught example and method. An additive pattern follows a rule such as adding seven at each step. Check the difference between adjacent values."
    },
    {
      "type": "short_answer",
      "question": "Complete the pattern lab: find the rule independent task and explain the result.",
      "sample_answer": "A: 18,24,30,36,42,48 (+6). B: 95,85,75,65,55,45 (−10). C: 49,56,63,70,77 (+7).",
      "marking_guide": "Check all requested steps, accurate facts or computations, and clear supporting explanation.",
      "explanation": "Answers must be supported by the original data or text."
    },
    {
      "type": "short_answer",
      "question": "Explain one important checking method or misconception for pattern lab: find the rule.",
      "sample_answer": "The proposed rule add five fails Panel A because 18+5=23, but the given second number is 24. I checked all differences before deciding.",
      "marking_guide": "Accept specific, mathematically or textually accurate reasoning.",
      "explanation": "A meaningful check uses the taught concept."
    }
  ],
  "parent_notes": "Parent: Ask the child to explain two answers and show the source clue or arithmetic. Do not replace their independent attempt.\n\nParent: **Model written answer 1:** A: 18,24,30,36,42,48 (+6). B: 95,85,75,65,55,45 (−10). C: 49,56,63,70,77 (+7).\n\nParent: **Model written answer 2:** The proposed rule add five fails Panel A because 18+5=23, but the given second number is 24. I checked all differences before deciding.\n\nParent: Save actual evidence, check both written responses and assess independently. NESA mapping awaits verification; eight scored choices need 8/8 at the current 90% threshold.",
  "evidence_instructions": "Keep your pattern lab: find the rule task, guided attempt, one corrected error and both written assessments.",
  "offline_alternative": "Read or copy the examples onto paper, work through the steps with a pencil, and keep a photograph or notes of the independent answer.",
  "extension": "Make another pattern lab: find the rule problem with a new starting value or event. Solve it and show a check.",
  "stage_hints": {
    "accept": [
      "Read the instruction for accept in this pattern lab: find the rule mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ],
    "teach0": [
      "Read the instruction for teach0 in this pattern lab: find the rule mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ],
    "teach1": [
      "Read the instruction for teach1 in this pattern lab: find the rule mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ],
    "teach2": [
      "Read the instruction for teach2 in this pattern lab: find the rule mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ],
    "teach3": [
      "Read the instruction for teach3 in this pattern lab: find the rule mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ],
    "learn": [
      "Read the instruction for learn in this pattern lab: find the rule mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ],
    "guided": [
      "Read the instruction for guided in this pattern lab: find the rule mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ],
    "write": [
      "Read the instruction for write in this pattern lab: find the rule mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ],
    "quiz": [
      "Read the instruction for quiz in this pattern lab: find the rule mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ],
    "submit": [
      "Read the instruction for submit in this pattern lab: find the rule mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ]
  }
}'),updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE seed_key='s2-mat-y3-w02-l3';

-- s2-mat-y3-w02-l4
UPDATE lessons SET title='Place-Value Mission: Read, Build and Check',data=json_patch(data,'{
  "seed_key": "s2-mat-y3-w02-l4",
  "title": "Place-Value Mission: Read, Build and Check",
  "stage": "Stage 2",
  "learning_area": "Mathematics",
  "year_level": 3,
  "week": 2,
  "lesson_number": 4,
  "duration_minutes": 60,
  "child_mission": "Become a place-value mission: read, build and check explorer: learn from models, practise and solve the independent challenge.",
  "learning_intention": "We are learning to understand and apply place-value mission: read, build and check accurately.",
  "success_criteria": [
    "I can explain the central idea with an example.",
    "I can follow a worked model and justify its steps.",
    "I can practise and check feedback before proceeding.",
    "I can solve the independent task using evidence or working.",
    "I can make one accurate correction."
  ],
  "materials": [
    "All story or number examples are provided.",
    "Optional pencil and paper for diagrams."
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
      "title": "Review the four methods",
      "cards": [
        {
          "front": "Step 1: Notice",
          "back": "The digits of a four-digit number have thousands, hundreds, tens and ones positions. Zero holds a place."
        },
        {
          "front": "Step 2: Model",
          "back": "Expanded form adds digit values: 4,360=4,000+300+60."
        },
        {
          "front": "Step 3: Practise",
          "back": "Compare numbers starting from the thousands; continue at the first place where digits differ."
        },
        {
          "front": "Step 4: Check",
          "back": "Rounding is approximate and digit swaps change value: 4,306 to nearest hundred is 4,300."
        }
      ]
    }
  ],
  "printable_resource": {
    "title": "Place-Value Mission: Read, Build and Check",
    "instructions": "Read the original situation, attempt the guided exercise, then complete and check the independent task.",
    "passage": "A museum machine prints 4,306, 4,360 and 4,063. A volunteer must sort and explain them.",
    "prompts": [
      "What do I know?",
      "What is the method?",
      "How do I check my answer?",
      "What did I improve?"
    ]
  },
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "🔎",
      "title": "Notice: Place-Value Mission: Read, Build and Check",
      "explain": "**What this means:** The digits of a four-digit number have thousands, hundreds, tens and ones positions. Zero holds a place.\n\n**Original situation:** A museum machine prints 4,306, 4,360 and 4,063. A volunteer must sort and explain them.\n\nFocus on a number, action or phrase that supports the taught concept. A correct result needs evidence, not just a guess.",
      "example": "**WATCH MY THINKING**\nFor 4,306, the 3 represents 300, the 0 represents zero tens and the 6 represents six ones.\n\n**YOU TRY**\nUse that method in this challenge: Museum audit: sort 7,045, 7,405, 7,450 and 7,054 ascending. Expand 7,045 and 7,405. Round 7,054 to nearest ten and nearest hundred. Explain why the two numbers containing 7,4,0,5 do not have the same value; check the difference.\n\n**CHECK**\nExplain what you calculated or inferred and compare with the rule above.",
      "notice": "Avoid inventing a fact or skipping a step. The digits of a four-digit number have thousands, hundreds, tens and ones positions. Zero holds a place.",
      "check": {
        "question": "What does the 3 mean in 4,306?",
        "options": [
          "3",
          "30",
          "300",
          "3000"
        ],
        "correct_index": 2,
        "explanation": "The 3 is in the hundreds position."
      },
      "visual_before": [
        {
          "episode": {
            "title": "A clue for Place-Value Mission: Read, Build and Check",
            "transcript": "Pip: Four thousand three hundred six and four thousand three hundred sixty have the same digits.\nJuno: But the positions change the values. Compare tens and ones carefully.\nPip: In 4,360 the six means sixty, not six!\nJuno: Correct. Pause and explain which number is larger.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "Four thousand three hundred six and four thousand three hundred sixty have the same digits."
                  },
                  {
                    "who": "juno",
                    "text": "But the positions change the values. Compare tens and ones carefully."
                  },
                  {
                    "who": "pip",
                    "text": "In 4,360 the six means sixty, not six!"
                  },
                  {
                    "who": "juno",
                    "text": "Correct. Pause and explain which number is larger.",
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
      "title": "Model: Place-Value Mission: Read, Build and Check",
      "explain": "**What this means:** Expanded form adds digit values: 4,360=4,000+300+60.\n\n**Original situation:** A museum machine prints 4,306, 4,360 and 4,063. A volunteer must sort and explain them.\n\nFocus on a number, action or phrase that supports the taught concept. A correct result needs evidence, not just a guess.",
      "example": "**WATCH MY THINKING**\nBuild 4,360 from 4,000+300+60. Another true partition is 4,300+60.\n\n**YOU TRY**\nUse that method in this challenge: Museum audit: sort 7,045, 7,405, 7,450 and 7,054 ascending. Expand 7,045 and 7,405. Round 7,054 to nearest ten and nearest hundred. Explain why the two numbers containing 7,4,0,5 do not have the same value; check the difference.\n\n**CHECK**\nExplain what you calculated or inferred and compare with the rule above.",
      "notice": "Avoid inventing a fact or skipping a step. Expanded form adds digit values: 4,360=4,000+300+60.",
      "check": {
        "question": "Which explanation best matches teaching point 2 about place-value mission: read, build and check?",
        "options": [
          "Expanded form adds digit values: 4,360=4,000+300+60.",
          "A random guess without checking",
          "An unrelated observation",
          "Ignoring the example"
        ],
        "correct_index": 0,
        "explanation": "Build 4,360 from 4,000+300+60. Another true partition is 4,300+60."
      }
    },
    {
      "icon": "✍️",
      "title": "Practise: Place-Value Mission: Read, Build and Check",
      "explain": "**What this means:** Compare numbers starting from the thousands; continue at the first place where digits differ.\n\n**Original situation:** A museum machine prints 4,306, 4,360 and 4,063. A volunteer must sort and explain them.\n\nFocus on a number, action or phrase that supports the taught concept. A correct result needs evidence, not just a guess.",
      "example": "**WATCH MY THINKING**\nIn 4,360 and 4,306, thousands and hundreds are equal but six tens is greater than zero tens.\n\n**YOU TRY**\nUse that method in this challenge: Museum audit: sort 7,045, 7,405, 7,450 and 7,054 ascending. Expand 7,045 and 7,405. Round 7,054 to nearest ten and nearest hundred. Explain why the two numbers containing 7,4,0,5 do not have the same value; check the difference.\n\n**CHECK**\nExplain what you calculated or inferred and compare with the rule above.",
      "notice": "Avoid inventing a fact or skipping a step. Compare numbers starting from the thousands; continue at the first place where digits differ.",
      "check": {
        "question": "Which explanation best matches teaching point 3 about place-value mission: read, build and check?",
        "options": [
          "Compare numbers starting from the thousands; continue at the first place where digits differ.",
          "A random guess without checking",
          "An unrelated observation",
          "Ignoring the example"
        ],
        "correct_index": 0,
        "explanation": "In 4,360 and 4,306, thousands and hundreds are equal but six tens is greater than zero tens."
      }
    },
    {
      "icon": "✅",
      "title": "Check: Place-Value Mission: Read, Build and Check",
      "explain": "**What this means:** Rounding is approximate and digit swaps change value: 4,306 to nearest hundred is 4,300.\n\n**Original situation:** A museum machine prints 4,306, 4,360 and 4,063. A volunteer must sort and explain them.\n\nFocus on a number, action or phrase that supports the taught concept. A correct result needs evidence, not just a guess.",
      "example": "**WATCH MY THINKING**\n4,306 lies between 4,300 and 4,400, only six from 4,300. Its nearest ten is 4,310.\n\n**YOU TRY**\nUse that method in this challenge: Museum audit: sort 7,045, 7,405, 7,450 and 7,054 ascending. Expand 7,045 and 7,405. Round 7,054 to nearest ten and nearest hundred. Explain why the two numbers containing 7,4,0,5 do not have the same value; check the difference.\n\n**CHECK**\nExplain what you calculated or inferred and compare with the rule above.",
      "notice": "Avoid inventing a fact or skipping a step. Rounding is approximate and digit swaps change value: 4,306 to nearest hundred is 4,300.",
      "check": {
        "question": "Which explanation best matches teaching point 4 about place-value mission: read, build and check?",
        "options": [
          "Rounding is approximate and digit swaps change value: 4,306 to nearest hundred is 4,300.",
          "A random guess without checking",
          "An unrelated observation",
          "Ignoring the example"
        ],
        "correct_index": 0,
        "explanation": "4,306 lies between 4,300 and 4,400, only six from 4,300. Its nearest ten is 4,310."
      }
    }
  ],
  "worked_example": "## Teacher works through the whole example\n\nA museum machine prints 4,306, 4,360 and 4,063. A volunteer must sort and explain them.\n\n**Step 1:** For 4,306, the 3 represents 300, the 0 represents zero tens and the 6 represents six ones.\n\n**Step 2:** Build 4,360 from 4,000+300+60. Another true partition is 4,300+60.\n\n**Step 3:** In 4,360 and 4,306, thousands and hundreds are equal but six tens is greater than zero tens.\n\n**Step 4:** 4,306 lies between 4,300 and 4,400, only six from 4,300. Its nearest ten is 4,310.\n\n**Before you continue:** Identify which step was hardest and explain how to check it.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 560 200\"><rect width=\"560\" height=\"200\" rx=\"10\" fill=\"#f5f8f5\"/><text x=\"18\" y=\"32\" font-family=\"Arial\" font-size=\"20\" fill=\"#244133\">Place-Value Mission: Read, B</text><rect x=\"15\" y=\"65\" width=\"127\" height=\"92\" rx=\"9\" fill=\"#e0f0e8\"/><text x=\"24\" y=\"111\" font-family=\"Arial\" font-size=\"17\" fill=\"#243831\">Notice</text><rect x=\"153\" y=\"65\" width=\"127\" height=\"92\" rx=\"9\" fill=\"#e5eefa\"/><text x=\"162\" y=\"111\" font-family=\"Arial\" font-size=\"17\" fill=\"#243831\">Model</text><rect x=\"291\" y=\"65\" width=\"127\" height=\"92\" rx=\"9\" fill=\"#e0f0e8\"/><text x=\"300\" y=\"111\" font-family=\"Arial\" font-size=\"17\" fill=\"#243831\">Practise</text><rect x=\"429\" y=\"65\" width=\"127\" height=\"92\" rx=\"9\" fill=\"#e5eefa\"/><text x=\"438\" y=\"111\" font-family=\"Arial\" font-size=\"17\" fill=\"#243831\">Check</text></svg>",
      "alt": "Four-stage method for Place-Value Mission: Read, Build and Check: Notice, Model, Practise, Check.",
      "caption": "Follow each stage and explain why your answer is correct."
    }
  ],
  "guided_practice": "Build 5,042: 5,000+40+2. Compare 5,042 and 5,402: 5,402 has four hundreds rather than four tens, so it is greater. Round 5,042: nearest ten 5,040, nearest hundred 5,000. Expand 6,205: 6,000+200+5.",
  "independent_task": "Museum audit: sort 7,045, 7,405, 7,450 and 7,054 ascending. Expand 7,045 and 7,405. Round 7,054 to nearest ten and nearest hundred. Explain why the two numbers containing 7,4,0,5 do not have the same value; check the difference.",
  "response_prompt": "Complete the place-value mission: read, build and check challenge. Include the relevant working or evidence and a correction.",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "Value of 4 in 7,405?",
      "options": [
        "4",
        "40",
        "400",
        "4000"
      ],
      "correct_index": 2,
      "explanation": "400 follows the taught example and method. The digits of a four-digit number have thousands, hundreds, tens and ones positions. Zero holds a place."
    },
    {
      "type": "multiple_choice",
      "question": "Smallest number?",
      "options": [
        "7,450",
        "7,405",
        "7,054",
        "7,045"
      ],
      "correct_index": 3,
      "explanation": "7,045 follows the taught example and method. The digits of a four-digit number have thousands, hundreds, tens and ones positions. Zero holds a place."
    },
    {
      "type": "multiple_choice",
      "question": "Expanded 7,045?",
      "options": [
        "7000+400+5",
        "7000+40+5",
        "700+40+5",
        "7000+4+50"
      ],
      "correct_index": 1,
      "explanation": "7000+40+5 follows the taught example and method. The digits of a four-digit number have thousands, hundreds, tens and ones positions. Zero holds a place."
    },
    {
      "type": "multiple_choice",
      "question": "Seven thousands, four hundreds, five ones?",
      "options": [
        "7,045",
        "7,405",
        "7,450",
        "7,054"
      ],
      "correct_index": 1,
      "explanation": "7,405 follows the taught example and method. The digits of a four-digit number have thousands, hundreds, tens and ones positions. Zero holds a place."
    },
    {
      "type": "multiple_choice",
      "question": "7,054 to nearest ten?",
      "options": [
        "7,050",
        "7,060",
        "7,000",
        "7,100"
      ],
      "correct_index": 0,
      "explanation": "7,050 follows the taught example and method. The digits of a four-digit number have thousands, hundreds, tens and ones positions. Zero holds a place."
    },
    {
      "type": "multiple_choice",
      "question": "7,054 to nearest hundred?",
      "options": [
        "7,000",
        "7,050",
        "7,100",
        "7,200"
      ],
      "correct_index": 2,
      "explanation": "7,100 follows the taught example and method. The digits of a four-digit number have thousands, hundreds, tens and ones positions. Zero holds a place."
    },
    {
      "type": "multiple_choice",
      "question": "Which statement is true?",
      "options": [
        "7,405 less than 7,045",
        "They are equal",
        "7,405 greater than 7,045",
        "They differ by ten"
      ],
      "correct_index": 2,
      "explanation": "7,405 greater than 7,045 follows the taught example and method. The digits of a four-digit number have thousands, hundreds, tens and ones positions. Zero holds a place."
    },
    {
      "type": "multiple_choice",
      "question": "Expanded 6,205?",
      "options": [
        "6000+20+5",
        "6000+200+5",
        "600+200+5",
        "6000+2050"
      ],
      "correct_index": 1,
      "explanation": "6000+200+5 follows the taught example and method. The digits of a four-digit number have thousands, hundreds, tens and ones positions. Zero holds a place."
    },
    {
      "type": "short_answer",
      "question": "Complete the place-value mission: read, build and check independent task and explain the result.",
      "sample_answer": "Ascending: 7,045; 7,054; 7,405; 7,450. Expanded: 7,000+40+5 and 7,000+400+5. 7,054 rounds to 7,050 to the nearest ten and 7,100 to the nearest hundred.",
      "marking_guide": "Check all requested steps, accurate facts or computations, and clear supporting explanation.",
      "explanation": "Answers must be supported by the original data or text."
    },
    {
      "type": "short_answer",
      "question": "Explain one important checking method or misconception for place-value mission: read, build and check.",
      "sample_answer": "The 4 represents four hundreds in 7,405 but only four tens in 7,045. The numbers differ by 360; subtraction confirms 7,405−7,045=360.",
      "marking_guide": "Accept specific, mathematically or textually accurate reasoning.",
      "explanation": "A meaningful check uses the taught concept."
    }
  ],
  "parent_notes": "Parent: Ask the child to explain two answers and show the source clue or arithmetic. Do not replace their independent attempt.\n\nParent: **Model written answer 1:** Ascending: 7,045; 7,054; 7,405; 7,450. Expanded: 7,000+40+5 and 7,000+400+5. 7,054 rounds to 7,050 to the nearest ten and 7,100 to the nearest hundred.\n\nParent: **Model written answer 2:** The 4 represents four hundreds in 7,405 but only four tens in 7,045. The numbers differ by 360; subtraction confirms 7,405−7,045=360.\n\nParent: Save actual evidence, check both written responses and assess independently. NESA mapping awaits verification; eight scored choices need 8/8 at the current 90% threshold.",
  "evidence_instructions": "Keep your place-value mission: read, build and check task, guided attempt, one corrected error and both written assessments.",
  "offline_alternative": "Read or copy the examples onto paper, work through the steps with a pencil, and keep a photograph or notes of the independent answer.",
  "extension": "Make another place-value mission: read, build and check problem with a new starting value or event. Solve it and show a check.",
  "stage_hints": {
    "accept": [
      "Read the instruction for accept in this place-value mission: read, build and check mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ],
    "teach0": [
      "Read the instruction for teach0 in this place-value mission: read, build and check mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ],
    "teach1": [
      "Read the instruction for teach1 in this place-value mission: read, build and check mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ],
    "teach2": [
      "Read the instruction for teach2 in this place-value mission: read, build and check mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ],
    "teach3": [
      "Read the instruction for teach3 in this place-value mission: read, build and check mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ],
    "learn": [
      "Read the instruction for learn in this place-value mission: read, build and check mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ],
    "guided": [
      "Read the instruction for guided in this place-value mission: read, build and check mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ],
    "write": [
      "Read the instruction for write in this place-value mission: read, build and check mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ],
    "quiz": [
      "Read the instruction for quiz in this place-value mission: read, build and check mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ],
    "submit": [
      "Read the instruction for submit in this place-value mission: read, build and check mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ]
  }
}'),updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE seed_key='s2-mat-y3-w02-l4';

-- s2-eng-y3-w03-l1
UPDATE lessons SET title='Clue Hunters: Predict and Question',data=json_patch(data,'{
  "seed_key": "s2-eng-y3-w03-l1",
  "title": "Clue Hunters: Predict and Question",
  "stage": "Stage 2",
  "learning_area": "English",
  "year_level": 3,
  "week": 3,
  "lesson_number": 1,
  "duration_minutes": 60,
  "child_mission": "Become a clue hunters: predict and question explorer: learn from models, practise and solve the independent challenge.",
  "learning_intention": "We are learning to understand and apply clue hunters: predict and question accurately.",
  "success_criteria": [
    "I can explain the central idea with an example.",
    "I can follow a worked model and justify its steps.",
    "I can practise and check feedback before proceeding.",
    "I can solve the independent task using evidence or working.",
    "I can make one accurate correction."
  ],
  "materials": [
    "All story or number examples are provided.",
    "Optional pencil and paper for diagrams."
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
      "title": "Review the four methods",
      "cards": [
        {
          "front": "Step 1: Notice",
          "back": "A prediction is a **possible future event supported by textual clues**, not a random guess or something already stated."
        },
        {
          "front": "Step 2: Model",
          "back": "Use ''I predict __ because the text says __'' to connect evidence and an idea."
        },
        {
          "front": "Step 3: Practise",
          "back": "Ask focused questions such as ''Who left the footprints?'' rather than unrelated questions."
        },
        {
          "front": "Step 4: Check",
          "back": "New text may confirm, change or overturn a prediction. Revise rather than insisting the first idea was correct."
        }
      ]
    }
  ],
  "printable_resource": {
    "title": "Clue Hunters: Predict and Question",
    "instructions": "Read the original situation, attempt the guided exercise, then complete and check the independent task.",
    "passage": "After rain, Eli finds an open greenhouse door, an upside-down plant tray and muddy footprints leading toward a shed.",
    "prompts": [
      "What do I know?",
      "What is the method?",
      "How do I check my answer?",
      "What did I improve?"
    ]
  },
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "🔎",
      "title": "Notice: Clue Hunters: Predict and Question",
      "explain": "**What this means:** A prediction is a **possible future event supported by textual clues**, not a random guess or something already stated.\n\n**Original situation:** After rain, Eli finds an open greenhouse door, an upside-down plant tray and muddy footprints leading toward a shed.\n\nFocus on a number, action or phrase that supports the taught concept. A correct result needs evidence, not just a guess.",
      "example": "**WATCH MY THINKING**\nI notice prints leading to the shed, so I predict Eli may inspect the shed. The prints do not prove theft.\n\n**YOU TRY**\nUse that method in this challenge: Read: ''At the library, Suri noticed a wet umbrella beside an open cupboard. Paper scraps led towards the return desk. A librarian sorted delivery boxes.'' Write two predictions with different clues and two relevant questions. Separate a directly stated fact from an inference. Then reveal: ''The librarian explained that a delivery box split open and they brought the umbrella out of the rain.'' Revise both predictions.\n\n**CHECK**\nExplain what you calculated or inferred and compare with the rule above.",
      "notice": "Avoid inventing a fact or skipping a step. A prediction is a **possible future event supported by textual clues**, not a random guess or something already stated.",
      "check": {
        "question": "Which is a prediction supported by Eli''s clues?",
        "options": [
          "Aliens moved the plants.",
          "Eli might inspect the shed.",
          "The gardener definitely stole them.",
          "A volcano erupted."
        ],
        "correct_index": 1,
        "explanation": "Footprints lead to the shed, which supports investigating it."
      },
      "visual_before": [
        {
          "episode": {
            "title": "A clue for Clue Hunters: Predict and Question",
            "transcript": "Pip: There are muddy prints. That proves someone stole a plant!\nJuno: Wait. Prints are a clue, but they don''t prove theft.\nPip: I predict Eli may check the shed because the prints lead there.\nJuno: Great. Pause and ask a question the next paragraph might answer.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "There are muddy prints. That proves someone stole a plant!"
                  },
                  {
                    "who": "juno",
                    "text": "Wait. Prints are a clue, but they don''t prove theft."
                  },
                  {
                    "who": "pip",
                    "text": "I predict Eli may check the shed because the prints lead there."
                  },
                  {
                    "who": "juno",
                    "text": "Great. Pause and ask a question the next paragraph might answer.",
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
      "title": "Model: Clue Hunters: Predict and Question",
      "explain": "**What this means:** Use ''I predict __ because the text says __'' to connect evidence and an idea.\n\n**Original situation:** After rain, Eli finds an open greenhouse door, an upside-down plant tray and muddy footprints leading toward a shed.\n\nFocus on a number, action or phrase that supports the taught concept. A correct result needs evidence, not just a guess.",
      "example": "**WATCH MY THINKING**\nI predict someone may be near the shed because prints lead towards it. My reason names a precise detail.\n\n**YOU TRY**\nUse that method in this challenge: Read: ''At the library, Suri noticed a wet umbrella beside an open cupboard. Paper scraps led towards the return desk. A librarian sorted delivery boxes.'' Write two predictions with different clues and two relevant questions. Separate a directly stated fact from an inference. Then reveal: ''The librarian explained that a delivery box split open and they brought the umbrella out of the rain.'' Revise both predictions.\n\n**CHECK**\nExplain what you calculated or inferred and compare with the rule above.",
      "notice": "Avoid inventing a fact or skipping a step. Use ''I predict __ because the text says __'' to connect evidence and an idea.",
      "check": {
        "question": "Which explanation best matches teaching point 2 about clue hunters: predict and question?",
        "options": [
          "Use ''I predict __ because the text says __'' to connect evidence and an idea.",
          "A random guess without checking",
          "An unrelated observation",
          "Ignoring the example"
        ],
        "correct_index": 0,
        "explanation": "I predict someone may be near the shed because prints lead towards it. My reason names a precise detail."
      }
    },
    {
      "icon": "✍️",
      "title": "Practise: Clue Hunters: Predict and Question",
      "explain": "**What this means:** Ask focused questions such as ''Who left the footprints?'' rather than unrelated questions.\n\n**Original situation:** After rain, Eli finds an open greenhouse door, an upside-down plant tray and muddy footprints leading toward a shed.\n\nFocus on a number, action or phrase that supports the taught concept. A correct result needs evidence, not just a guess.",
      "example": "**WATCH MY THINKING**\nI ask: Did wind open the door? Who moved the tray? I look for answers in the next paragraph.\n\n**YOU TRY**\nUse that method in this challenge: Read: ''At the library, Suri noticed a wet umbrella beside an open cupboard. Paper scraps led towards the return desk. A librarian sorted delivery boxes.'' Write two predictions with different clues and two relevant questions. Separate a directly stated fact from an inference. Then reveal: ''The librarian explained that a delivery box split open and they brought the umbrella out of the rain.'' Revise both predictions.\n\n**CHECK**\nExplain what you calculated or inferred and compare with the rule above.",
      "notice": "Avoid inventing a fact or skipping a step. Ask focused questions such as ''Who left the footprints?'' rather than unrelated questions.",
      "check": {
        "question": "Which explanation best matches teaching point 3 about clue hunters: predict and question?",
        "options": [
          "Ask focused questions such as ''Who left the footprints?'' rather than unrelated questions.",
          "A random guess without checking",
          "An unrelated observation",
          "Ignoring the example"
        ],
        "correct_index": 0,
        "explanation": "I ask: Did wind open the door? Who moved the tray? I look for answers in the next paragraph."
      }
    },
    {
      "icon": "✅",
      "title": "Check: Clue Hunters: Predict and Question",
      "explain": "**What this means:** New text may confirm, change or overturn a prediction. Revise rather than insisting the first idea was correct.\n\n**Original situation:** After rain, Eli finds an open greenhouse door, an upside-down plant tray and muddy footprints leading toward a shed.\n\nFocus on a number, action or phrase that supports the taught concept. A correct result needs evidence, not just a guess.",
      "example": "**WATCH MY THINKING**\nLater the gardener explains the storm blew the door open. I revise my guess of an intruder; wind is now supported.\n\n**YOU TRY**\nUse that method in this challenge: Read: ''At the library, Suri noticed a wet umbrella beside an open cupboard. Paper scraps led towards the return desk. A librarian sorted delivery boxes.'' Write two predictions with different clues and two relevant questions. Separate a directly stated fact from an inference. Then reveal: ''The librarian explained that a delivery box split open and they brought the umbrella out of the rain.'' Revise both predictions.\n\n**CHECK**\nExplain what you calculated or inferred and compare with the rule above.",
      "notice": "Avoid inventing a fact or skipping a step. New text may confirm, change or overturn a prediction. Revise rather than insisting the first idea was correct.",
      "check": {
        "question": "Which explanation best matches teaching point 4 about clue hunters: predict and question?",
        "options": [
          "New text may confirm, change or overturn a prediction. Revise rather than insisting the first idea was correct.",
          "A random guess without checking",
          "An unrelated observation",
          "Ignoring the example"
        ],
        "correct_index": 0,
        "explanation": "Later the gardener explains the storm blew the door open. I revise my guess of an intruder; wind is now supported."
      }
    }
  ],
  "worked_example": "## Teacher works through the whole example\n\nAfter rain, Eli finds an open greenhouse door, an upside-down plant tray and muddy footprints leading toward a shed.\n\n**Step 1:** I notice prints leading to the shed, so I predict Eli may inspect the shed. The prints do not prove theft.\n\n**Step 2:** I predict someone may be near the shed because prints lead towards it. My reason names a precise detail.\n\n**Step 3:** I ask: Did wind open the door? Who moved the tray? I look for answers in the next paragraph.\n\n**Step 4:** Later the gardener explains the storm blew the door open. I revise my guess of an intruder; wind is now supported.\n\n**Before you continue:** Identify which step was hardest and explain how to check it.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 560 200\"><rect width=\"560\" height=\"200\" rx=\"10\" fill=\"#f5f8f5\"/><text x=\"18\" y=\"32\" font-family=\"Arial\" font-size=\"20\" fill=\"#244133\">Clue Hunters: Predict and Qu</text><rect x=\"15\" y=\"65\" width=\"127\" height=\"92\" rx=\"9\" fill=\"#e0f0e8\"/><text x=\"24\" y=\"111\" font-family=\"Arial\" font-size=\"17\" fill=\"#243831\">Notice</text><rect x=\"153\" y=\"65\" width=\"127\" height=\"92\" rx=\"9\" fill=\"#e5eefa\"/><text x=\"162\" y=\"111\" font-family=\"Arial\" font-size=\"17\" fill=\"#243831\">Model</text><rect x=\"291\" y=\"65\" width=\"127\" height=\"92\" rx=\"9\" fill=\"#e0f0e8\"/><text x=\"300\" y=\"111\" font-family=\"Arial\" font-size=\"17\" fill=\"#243831\">Practise</text><rect x=\"429\" y=\"65\" width=\"127\" height=\"92\" rx=\"9\" fill=\"#e5eefa\"/><text x=\"438\" y=\"111\" font-family=\"Arial\" font-size=\"17\" fill=\"#243831\">Check</text></svg>",
      "alt": "Four-stage method for Clue Hunters: Predict and Question: Notice, Model, Practise, Check.",
      "caption": "Follow each stage and explain why your answer is correct."
    }
  ],
  "guided_practice": "Read: ''Mina heard tapping in the music room. A window was open and a paper fluttered by the piano.'' Name one fact, one evidence-based prediction and a question. Now read: ''A breeze pushed the paper against the piano lid.'' The tapping was likely the paper, not an unseen visitor. Revise your prediction.",
  "independent_task": "Read: ''At the library, Suri noticed a wet umbrella beside an open cupboard. Paper scraps led towards the return desk. A librarian sorted delivery boxes.'' Write two predictions with different clues and two relevant questions. Separate a directly stated fact from an inference. Then reveal: ''The librarian explained that a delivery box split open and they brought the umbrella out of the rain.'' Revise both predictions.",
  "response_prompt": "Complete the clue hunters: predict and question challenge. Include the relevant working or evidence and a correction.",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "Which fact is stated?",
      "options": [
        "A thief entered.",
        "The umbrella was wet.",
        "The library flooded.",
        "Suri lost a bag."
      ],
      "correct_index": 1,
      "explanation": "The umbrella was wet. follows the taught example and method. A prediction is a **possible future event supported by textual clues**, not a random guess or something already stated."
    },
    {
      "type": "multiple_choice",
      "question": "Which early prediction is supported?",
      "options": [
        "Delivery may explain scraps.",
        "Aliens came.",
        "A book talks.",
        "Suri is lying."
      ],
      "correct_index": 0,
      "explanation": "Delivery may explain scraps. follows the taught example and method. A prediction is a **possible future event supported by textual clues**, not a random guess or something already stated."
    },
    {
      "type": "multiple_choice",
      "question": "Which question follows a clue?",
      "options": [
        "Why are scraps by the desk?",
        "How many planets?",
        "Who won football?",
        "Why is the sea salty?"
      ],
      "correct_index": 0,
      "explanation": "Why are scraps by the desk? follows the taught example and method. A prediction is a **possible future event supported by textual clues**, not a random guess or something already stated."
    },
    {
      "type": "multiple_choice",
      "question": "What does ''ajar'' mean?",
      "options": [
        "Locked",
        "Slightly open",
        "Painted",
        "Very heavy"
      ],
      "correct_index": 1,
      "explanation": "Slightly open follows the taught example and method. A prediction is a **possible future event supported by textual clues**, not a random guess or something already stated."
    },
    {
      "type": "multiple_choice",
      "question": "Which is an inference?",
      "options": [
        "Cupboard was open.",
        "Umbrella was wet.",
        "Someone might have come from rain.",
        "Boxes were sorted."
      ],
      "correct_index": 2,
      "explanation": "Someone might have come from rain. follows the taught example and method. A prediction is a **possible future event supported by textual clues**, not a random guess or something already stated."
    },
    {
      "type": "multiple_choice",
      "question": "What caused the scraps?",
      "options": [
        "Split delivery box.",
        "A stolen book.",
        "A wild animal.",
        "Fallen roof."
      ],
      "correct_index": 0,
      "explanation": "Split delivery box. follows the taught example and method. A prediction is a **possible future event supported by textual clues**, not a random guess or something already stated."
    },
    {
      "type": "multiple_choice",
      "question": "Why was the umbrella wet?",
      "options": [
        "It came in from rain.",
        "The cupboard leaked.",
        "Suri soaked it.",
        "A book spilled."
      ],
      "correct_index": 0,
      "explanation": "It came in from rain. follows the taught example and method. A prediction is a **possible future event supported by textual clues**, not a random guess or something already stated."
    },
    {
      "type": "multiple_choice",
      "question": "What should happen to a theft prediction?",
      "options": [
        "Treat it as fact.",
        "Revise with new evidence.",
        "Repeat it forever.",
        "Accuse the librarian."
      ],
      "correct_index": 1,
      "explanation": "Revise with new evidence. follows the taught example and method. A prediction is a **possible future event supported by textual clues**, not a random guess or something already stated."
    },
    {
      "type": "short_answer",
      "question": "Complete the clue hunters: predict and question independent task and explain the result.",
      "sample_answer": "My first prediction is that a delivery caused the scraps because the librarian was sorting boxes. My second is that someone entered from the rain because the umbrella is wet. Both are possibilities, not facts.",
      "marking_guide": "Check all requested steps, accurate facts or computations, and clear supporting explanation.",
      "explanation": "Answers must be supported by the original data or text."
    },
    {
      "type": "short_answer",
      "question": "Explain one important checking method or misconception for clue hunters: predict and question.",
      "sample_answer": "I ask why there are scraps and why the umbrella is wet. After reading the ending, I revise my prediction: a box split and the librarian brought the umbrella inside. The passage does not support a thief.",
      "marking_guide": "Accept specific, mathematically or textually accurate reasoning.",
      "explanation": "A meaningful check uses the taught concept."
    }
  ],
  "parent_notes": "Parent: Ask the child to explain two answers and show the source clue or arithmetic. Do not replace their independent attempt.\n\nParent: **Model written answer 1:** My first prediction is that a delivery caused the scraps because the librarian was sorting boxes. My second is that someone entered from the rain because the umbrella is wet. Both are possibilities, not facts.\n\nParent: **Model written answer 2:** I ask why there are scraps and why the umbrella is wet. After reading the ending, I revise my prediction: a box split and the librarian brought the umbrella inside. The passage does not support a thief.\n\nParent: Save actual evidence, check both written responses and assess independently. NESA mapping awaits verification; eight scored choices need 8/8 at the current 90% threshold.",
  "evidence_instructions": "Keep your clue hunters: predict and question task, guided attempt, one corrected error and both written assessments.",
  "offline_alternative": "Read or copy the examples onto paper, work through the steps with a pencil, and keep a photograph or notes of the independent answer.",
  "extension": "Make another clue hunters: predict and question problem with a new starting value or event. Solve it and show a check.",
  "stage_hints": {
    "accept": [
      "Read the instruction for accept in this clue hunters: predict and question mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ],
    "teach0": [
      "Read the instruction for teach0 in this clue hunters: predict and question mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ],
    "teach1": [
      "Read the instruction for teach1 in this clue hunters: predict and question mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ],
    "teach2": [
      "Read the instruction for teach2 in this clue hunters: predict and question mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ],
    "teach3": [
      "Read the instruction for teach3 in this clue hunters: predict and question mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ],
    "learn": [
      "Read the instruction for learn in this clue hunters: predict and question mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ],
    "guided": [
      "Read the instruction for guided in this clue hunters: predict and question mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ],
    "write": [
      "Read the instruction for write in this clue hunters: predict and question mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ],
    "quiz": [
      "Read the instruction for quiz in this clue hunters: predict and question mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ],
    "submit": [
      "Read the instruction for submit in this clue hunters: predict and question mission.",
      "Reread the original situation and choose a particular clue, number or action to use.",
      "Write the relevant working or quoted evidence and test your answer against the lesson model."
    ]
  }
}'),updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE seed_key='s2-eng-y3-w03-l1';
