-- Standard v2 depth rebuild: Maths Y3 W3 L2–L4 and English Y3 W4 L1.

-- s2-mat-y3-w03-l2
UPDATE lessons SET title='Number Architects: Partition in More Than One Way',data=json_patch(data,'{
  "seed_key": "s2-mat-y3-w03-l2",
  "title": "Number Architects: Partition in More Than One Way",
  "stage": "Stage 2",
  "learning_area": "Mathematics",
  "year_level": 3,
  "week": 3,
  "lesson_number": 2,
  "duration_minutes": 60,
  "child_mission": "Investigate number architects: partition in more than one way through a worked example, practice and an original challenge.",
  "learning_intention": "We are learning to understand and apply number architects: partition in more than one way accurately.",
  "success_criteria": [
    "I can explain the new concept in my own words.",
    "I can follow and check a demonstrated example.",
    "I can practise with feedback.",
    "I can finish an original independent task.",
    "I can correct or clarify an answer using evidence."
  ],
  "materials": [
    "All original stories, data and examples are included.",
    "Optional paper and pencil for calculations or annotations."
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
      "title": "Four concepts to remember",
      "cards": [
        {
          "front": "Start with the value of each digit",
          "back": "The position of a digit determines its value. In 3,462, three is in the thousands position, four in hundreds, six in tens and two in ones."
        },
        {
          "front": "Regroup without changing the total",
          "back": "Ten tens make one hundred; ten hundreds make one thousand. We can exchange one hundred for ten tens or one thousand for ten hundreds and preserve the amount."
        },
        {
          "front": "Make several valid partitions",
          "back": "Partitioning is splitting a number into addends. An expanded place-value partition is useful, but not the only valid partition. Every part must add to the original total."
        },
        {
          "front": "Catch an exchange mistake",
          "back": "An exchange changes the grouping but not the value. If you exchange one hundred for ten tens, subtract 100 from the hundreds part and add 100 to the tens part."
        }
      ]
    }
  ],
  "printable_resource": {
    "title": "Number Architects: Partition in More Than One Way",
    "instructions": "Read the situation, complete guided practice before looking at feedback, and solve the independent task.",
    "passage": "The library orders 3,462 stickers. A volunteer counts 3 thousands, 4 hundreds, 6 tens and 2 ones.",
    "prompts": [
      "Which details matter?",
      "Show the method or relevant evidence.",
      "Complete the new problem.",
      "Explain one check or correction."
    ]
  },
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "🔎",
      "title": "Start with the value of each digit",
      "explain": "**Learn:** The position of a digit determines its value. In 3,462, three is in the thousands position, four in hundreds, six in tens and two in ones.\n\n**Read the original situation:** The library orders 3,462 stickers. A volunteer counts 3 thousands, 4 hundreds, 6 tens and 2 ones.\n\n**Connect the evidence:** Find a particular number, word or event that demonstrates the idea.",
      "example": "**WATCH MY THINKING**\nI expand 3,462 as 3,000 + 400 + 60 + 2. Adding the parts gives 3,462, so the representation checks out.\n\n**YOUR TURN**\nPartition the school library''s 6,352 books in FOUR different ways: expanded thousands/hundreds/tens/ones, one exchange involving a hundred, one split into two numbers, and one original grouping. Show addition checks for every partition. Identify and correct this mistake: 6,000+200+150+2 = 6,352 after exchanging one hundred.\n\n**CHECK YOUR THINKING**\nUse the taught method to verify a step. If it fails, explain where the reasoning went wrong.",
      "notice": "The position of a digit determines its value. In 3,462, three is in the thousands position, four in hundreds, six in tens and two in ones.",
      "check": {
        "question": "What is the expanded form of 6,352?",
        "options": [
          "6,000+300+50+2",
          "6,000+30+500+2",
          "600+300+50+2",
          "6,000+300+5+2"
        ],
        "correct_index": 0,
        "explanation": "6,000+300+50+2. I expand 3,462 as 3,000 + 400 + 60 + 2. Adding the parts gives 3,462, so the representation checks out."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Number Architects: Partition in More Than One Way",
            "transcript": "Pip: I have 3,462 stickers. Can I split them into different groups?\nJuno: Yes. Try exchanging one hundred for ten tens. The total must stay the same.\nPip: So 3,000 plus 300 plus 160 plus 2 still makes 3,462.\nJuno: Exactly. Pause and check the addition before you move on.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "I have 3,462 stickers. Can I split them into different groups?"
                  },
                  {
                    "who": "juno",
                    "text": "Yes. Try exchanging one hundred for ten tens. The total must stay the same."
                  },
                  {
                    "who": "pip",
                    "text": "So 3,000 plus 300 plus 160 plus 2 still makes 3,462."
                  },
                  {
                    "who": "juno",
                    "text": "Exactly. Pause and check the addition before you move on.",
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
      "title": "Regroup without changing the total",
      "explain": "**Learn:** Ten tens make one hundred; ten hundreds make one thousand. We can exchange one hundred for ten tens or one thousand for ten hundreds and preserve the amount.\n\n**Read the original situation:** The library orders 3,462 stickers. A volunteer counts 3 thousands, 4 hundreds, 6 tens and 2 ones.\n\n**Connect the evidence:** Find a particular number, word or event that demonstrates the idea.",
      "example": "**WATCH MY THINKING**\nI exchange one of four hundreds into ten tens: 3,462 = 3,000 + 300 + 160 + 2. Check 3,000+300+160+2=3,462.\n\n**YOUR TURN**\nPartition the school library''s 6,352 books in FOUR different ways: expanded thousands/hundreds/tens/ones, one exchange involving a hundred, one split into two numbers, and one original grouping. Show addition checks for every partition. Identify and correct this mistake: 6,000+200+150+2 = 6,352 after exchanging one hundred.\n\n**CHECK YOUR THINKING**\nUse the taught method to verify a step. If it fails, explain where the reasoning went wrong.",
      "notice": "Ten tens make one hundred; ten hundreds make one thousand. We can exchange one hundred for ten tens or one thousand for ten hundreds and preserve the amount.",
      "check": {
        "question": "Which is another valid split of 6,352?",
        "options": [
          "6,200+152",
          "6,200+125",
          "6,000+252",
          "6,350+20"
        ],
        "correct_index": 0,
        "explanation": "6,200+152. I exchange one of four hundreds into ten tens: 3,462 = 3,000 + 300 + 160 + 2. Check 3,000+300+160+2=3,462."
      }
    },
    {
      "icon": "✍️",
      "title": "Make several valid partitions",
      "explain": "**Learn:** Partitioning is splitting a number into addends. An expanded place-value partition is useful, but not the only valid partition. Every part must add to the original total.\n\n**Read the original situation:** The library orders 3,462 stickers. A volunteer counts 3 thousands, 4 hundreds, 6 tens and 2 ones.\n\n**Connect the evidence:** Find a particular number, word or event that demonstrates the idea.",
      "example": "**WATCH MY THINKING**\nFor 3,462, I can use 3,400+62 or 3,000+462. Both make 3,462. I verify by addition, not by whether the parts look alike.\n\n**YOUR TURN**\nPartition the school library''s 6,352 books in FOUR different ways: expanded thousands/hundreds/tens/ones, one exchange involving a hundred, one split into two numbers, and one original grouping. Show addition checks for every partition. Identify and correct this mistake: 6,000+200+150+2 = 6,352 after exchanging one hundred.\n\n**CHECK YOUR THINKING**\nUse the taught method to verify a step. If it fails, explain where the reasoning went wrong.",
      "notice": "Partitioning is splitting a number into addends. An expanded place-value partition is useful, but not the only valid partition. Every part must add to the original total.",
      "check": {
        "question": "After exchanging one hundred, which expression equals 6,352?",
        "options": [
          "6,000+200+150+2",
          "6,000+300+150+2",
          "6,000+200+50+2",
          "6,000+400+150+2"
        ],
        "correct_index": 0,
        "explanation": "6,000+200+150+2. For 3,462, I can use 3,400+62 or 3,000+462. Both make 3,462. I verify by addition, not by whether the parts look alike."
      }
    },
    {
      "icon": "✅",
      "title": "Catch an exchange mistake",
      "explain": "**Learn:** An exchange changes the grouping but not the value. If you exchange one hundred for ten tens, subtract 100 from the hundreds part and add 100 to the tens part.\n\n**Read the original situation:** The library orders 3,462 stickers. A volunteer counts 3 thousands, 4 hundreds, 6 tens and 2 ones.\n\n**Connect the evidence:** Find a particular number, word or event that demonstrates the idea.",
      "example": "**WATCH MY THINKING**\nWrong: 3,000+400+160+2=3,562, a hundred too high. Correct: 3,000+300+160+2=3,462.\n\n**YOUR TURN**\nPartition the school library''s 6,352 books in FOUR different ways: expanded thousands/hundreds/tens/ones, one exchange involving a hundred, one split into two numbers, and one original grouping. Show addition checks for every partition. Identify and correct this mistake: 6,000+200+150+2 = 6,352 after exchanging one hundred.\n\n**CHECK YOUR THINKING**\nUse the taught method to verify a step. If it fails, explain where the reasoning went wrong.",
      "notice": "An exchange changes the grouping but not the value. If you exchange one hundred for ten tens, subtract 100 from the hundreds part and add 100 to the tens part.",
      "check": {
        "question": "How many tens equal one hundred?",
        "options": [
          "1",
          "5",
          "10",
          "100"
        ],
        "correct_index": 2,
        "explanation": "10. Wrong: 3,000+400+160+2=3,562, a hundred too high. Correct: 3,000+300+160+2=3,462."
      }
    }
  ],
  "worked_example": "## Full teacher model\n\nThe library orders 3,462 stickers. A volunteer counts 3 thousands, 4 hundreds, 6 tens and 2 ones.\n\n**1. Start with the value of each digit:** I expand 3,462 as 3,000 + 400 + 60 + 2. Adding the parts gives 3,462, so the representation checks out.\n\n**2. Regroup without changing the total:** I exchange one of four hundreds into ten tens: 3,462 = 3,000 + 300 + 160 + 2. Check 3,000+300+160+2=3,462.\n\n**3. Make several valid partitions:** For 3,462, I can use 3,400+62 or 3,000+462. Both make 3,462. I verify by addition, not by whether the parts look alike.\n\n**4. Catch an exchange mistake:** Wrong: 3,000+400+160+2=3,562, a hundred too high. Correct: 3,000+300+160+2=3,462.\n\n**Now try:** Explain the method without copying the model, then check each detail against the original numbers or text.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 580 210\"><rect width=\"580\" height=\"210\" rx=\"12\" fill=\"#f4f8f6\"/><text x=\"16\" y=\"35\" font-family=\"Arial\" font-size=\"20\" fill=\"#244334\">Place value problem solving</text><rect x=\"14\" y=\"76\" width=\"131\" height=\"100\" rx=\"10\" fill=\"#dceee6\"/><text x=\"27\" y=\"133\" font-family=\"Arial\" font-size=\"17\" fill=\"#263f36\">READ</text><rect x=\"157\" y=\"76\" width=\"131\" height=\"100\" rx=\"10\" fill=\"#e6ecfb\"/><text x=\"170\" y=\"133\" font-family=\"Arial\" font-size=\"17\" fill=\"#263f36\">MODEL</text><rect x=\"300\" y=\"76\" width=\"131\" height=\"100\" rx=\"10\" fill=\"#dceee6\"/><text x=\"313\" y=\"133\" font-family=\"Arial\" font-size=\"17\" fill=\"#263f36\">TRY</text><rect x=\"443\" y=\"76\" width=\"131\" height=\"100\" rx=\"10\" fill=\"#e6ecfb\"/><text x=\"456\" y=\"133\" font-family=\"Arial\" font-size=\"17\" fill=\"#263f36\">CHECK</text></svg>",
      "alt": "Four labelled teaching steps for Number Architects: Partition in More Than One Way: read, model, try, check.",
      "caption": "Use each part of the teaching method and check your explanation."
    }
  ],
  "guided_practice": "Work with 5,274. First expand it: 5,000+200+70+4. Next exchange a hundred for ten tens: 5,000+100+170+4. Then make a different two-part split: 5,200+74. **Check:** 5,000+100+170+4=5,274 and 5,200+74=5,274. Try 4,608 as 4,000+600+8 and 4,500+108. Remember the zero tens place.",
  "independent_task": "Partition the school library''s 6,352 books in FOUR different ways: expanded thousands/hundreds/tens/ones, one exchange involving a hundred, one split into two numbers, and one original grouping. Show addition checks for every partition. Identify and correct this mistake: 6,000+200+150+2 = 6,352 after exchanging one hundred.",
  "response_prompt": "Finish the number architects: partition in more than one way task with steps, evidence and a justified correction.",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "What is the expanded form of 6,352?",
      "options": [
        "6,000+300+50+2",
        "6,000+30+500+2",
        "600+300+50+2",
        "6,000+300+5+2"
      ],
      "correct_index": 0,
      "explanation": "6,000+300+50+2. Check the original worked examples and reasoning."
    },
    {
      "type": "multiple_choice",
      "question": "Which is another valid split of 6,352?",
      "options": [
        "6,200+152",
        "6,200+125",
        "6,000+252",
        "6,350+20"
      ],
      "correct_index": 0,
      "explanation": "6,200+152. Check the original worked examples and reasoning."
    },
    {
      "type": "multiple_choice",
      "question": "After exchanging one hundred, which expression equals 6,352?",
      "options": [
        "6,000+200+150+2",
        "6,000+300+150+2",
        "6,000+200+50+2",
        "6,000+400+150+2"
      ],
      "correct_index": 0,
      "explanation": "6,000+200+150+2. Check the original worked examples and reasoning."
    },
    {
      "type": "multiple_choice",
      "question": "How many tens equal one hundred?",
      "options": [
        "1",
        "5",
        "10",
        "100"
      ],
      "correct_index": 2,
      "explanation": "10. Check the original worked examples and reasoning."
    },
    {
      "type": "multiple_choice",
      "question": "Which equals 4,608?",
      "options": [
        "4,500+108",
        "4,500+18",
        "4,000+6080",
        "4,600+80"
      ],
      "correct_index": 0,
      "explanation": "4,500+108. Check the original worked examples and reasoning."
    },
    {
      "type": "multiple_choice",
      "question": "What does the digit 5 mean in 6,352?",
      "options": [
        "Five ones",
        "Five tens",
        "Five hundreds",
        "Five thousands"
      ],
      "correct_index": 1,
      "explanation": "Five tens. Check the original worked examples and reasoning."
    },
    {
      "type": "multiple_choice",
      "question": "Which expression is 100 too large for 6,352?",
      "options": [
        "6,000+200+150+2",
        "6,000+300+150+2",
        "6,200+152",
        "6,000+352"
      ],
      "correct_index": 1,
      "explanation": "6,000+300+150+2. Check the original worked examples and reasoning."
    },
    {
      "type": "multiple_choice",
      "question": "What is essential when regrouping?",
      "options": [
        "The total remains unchanged",
        "Every digit stays in the same position",
        "The number becomes larger",
        "Each partition uses four addends"
      ],
      "correct_index": 0,
      "explanation": "The total remains unchanged. Check the original worked examples and reasoning."
    },
    {
      "type": "short_answer",
      "question": "Complete the original independent challenge for number architects: partition in more than one way.",
      "sample_answer": "6,352 = 6,000+300+50+2 = 6,000+200+150+2 = 6,300+52 = 6,000+352. Every expression adds to 6,352.",
      "marking_guide": "Require the specific values or observations requested, with accurate methods or textual evidence.",
      "explanation": "A complete answer shows its thinking."
    },
    {
      "type": "short_answer",
      "question": "Explain one check, alternative or misconception relevant to this topic.",
      "sample_answer": "The example 6,000+200+150+2 is correct, not a mistake: it totals 6,352. To show a genuine error I compare 6,000+300+150+2=6,452, which is 100 too high. An exchange must subtract a hundred before adding ten tens.",
      "marking_guide": "Require a topic-specific check and reasoning that distinguishes correct and incorrect conclusions.",
      "explanation": "The answer should explain how the conclusion was verified."
    }
  ],
  "parent_notes": "Parent: **Teaching check.** Ask the child to demonstrate one key example unaided and explain what information matters.\n\nParent: **Written model one.** 6,352 = 6,000+300+50+2 = 6,000+200+150+2 = 6,300+52 = 6,000+352. Every expression adds to 6,352.\n\nParent: **Written model two.** The example 6,000+200+150+2 is correct, not a mistake: it totals 6,352. To show a genuine error I compare 6,000+300+150+2=6,452, which is 100 too high. An exchange must subtract a hundred before adding ten tens.\n\nParent: **Evidence.** Keep the child''s actual work and check both written responses. NESA outcomes require verification; eight scored questions need 8/8 for the established 90 percent threshold.",
  "evidence_instructions": "Save the number architects: partition in more than one way independent work, guided practice, one correction and two written quiz responses.",
  "offline_alternative": "Use paper for the teaching, worked examples and original challenge, then show a parent the evidence or type it later.",
  "extension": "Invent a contrasting number architects: partition in more than one way challenge, solve it, and explain a common wrong answer.",
  "stage_hints": {
    "accept": [
      "Read the Number Architects: Partition in More Than One Way instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to number architects: partition in more than one way.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ],
    "teach0": [
      "Read the Start with the value of each digit instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to start with the value of each digit.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ],
    "teach1": [
      "Read the Regroup without changing the total instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to regroup without changing the total.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ],
    "teach2": [
      "Read the Make several valid partitions instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to make several valid partitions.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ],
    "teach3": [
      "Read the Catch an exchange mistake instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to catch an exchange mistake.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ],
    "learn": [
      "Read the Number Architects: Partition in More Than One Way instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to number architects: partition in more than one way.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ],
    "guided": [
      "Read the Number Architects: Partition in More Than One Way instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to number architects: partition in more than one way.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ],
    "write": [
      "Read the Number Architects: Partition in More Than One Way instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to number architects: partition in more than one way.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ],
    "quiz": [
      "Read the Number Architects: Partition in More Than One Way instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to number architects: partition in more than one way.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ],
    "submit": [
      "Read the Number Architects: Partition in More Than One Way instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to number architects: partition in more than one way.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ]
  }
}'),updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE seed_key='s2-mat-y3-w03-l2';

-- s2-mat-y3-w03-l3
UPDATE lessons SET title='Place-Value Detectives: Solve the Missing Digit',data=json_patch(data,'{
  "seed_key": "s2-mat-y3-w03-l3",
  "title": "Place-Value Detectives: Solve the Missing Digit",
  "stage": "Stage 2",
  "learning_area": "Mathematics",
  "year_level": 3,
  "week": 3,
  "lesson_number": 3,
  "duration_minutes": 60,
  "child_mission": "Investigate place-value detectives: solve the missing digit through a worked example, practice and an original challenge.",
  "learning_intention": "We are learning to understand and apply place-value detectives: solve the missing digit accurately.",
  "success_criteria": [
    "I can explain the new concept in my own words.",
    "I can follow and check a demonstrated example.",
    "I can practise with feedback.",
    "I can finish an original independent task.",
    "I can correct or clarify an answer using evidence."
  ],
  "materials": [
    "All original stories, data and examples are included.",
    "Optional paper and pencil for calculations or annotations."
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
      "title": "Four concepts to remember",
      "cards": [
        {
          "front": "Understand the positions",
          "back": "The digits in a four-digit number tell thousands, hundreds, tens and ones. The box in 4,□72 is the hundreds digit. This means it changes the total by hundreds, not tens."
        },
        {
          "front": "Use both boundaries",
          "back": "A number satisfying two inequalities must meet each condition. 4,□72 must be above 4,572 **and** below 4,772."
        },
        {
          "front": "Check an answer with expanded form",
          "back": "Writing a candidate in expanded form can uncover digit-placement errors. For 4,672 the 6 is worth 600 and the 7 is worth 70."
        },
        {
          "front": "Explain uniqueness and common mistakes",
          "back": "A missing-digit problem may have one, several or no valid choices. Check the wording carefully: greater than is not the same as greater than or equal to."
        }
      ]
    }
  ],
  "printable_resource": {
    "title": "Place-Value Detectives: Solve the Missing Digit",
    "instructions": "Read the situation, complete guided practice before looking at feedback, and solve the independent task.",
    "passage": "A school fundraiser records 4,□72 dollars. The amount is greater than 4,572 but less than 4,772.",
    "prompts": [
      "Which details matter?",
      "Show the method or relevant evidence.",
      "Complete the new problem.",
      "Explain one check or correction."
    ]
  },
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "🔎",
      "title": "Understand the positions",
      "explain": "**Learn:** The digits in a four-digit number tell thousands, hundreds, tens and ones. The box in 4,□72 is the hundreds digit. This means it changes the total by hundreds, not tens.\n\n**Read the original situation:** A school fundraiser records 4,□72 dollars. The amount is greater than 4,572 but less than 4,772.\n\n**Connect the evidence:** Find a particular number, word or event that demonstrates the idea.",
      "example": "**WATCH MY THINKING**\nI compare 4,□72 with 4,572. The thousands match and the tens and ones match, so the hundreds digit must be greater than five.\n\n**YOUR TURN**\nSolve four clues for a museum code. (A) 6,□45 is greater than 6,345 and less than 6,545. (B) 8,3□2 is at least 8,342 and below 8,372. (C) Write every number from the digits 4, 0, 7, 2 used once each that is greater than 4,700 and less than 4,800. (D) Explain the difference between < and ≤ using one of your answers. Show place-value comparisons and checks.\n\n**CHECK YOUR THINKING**\nUse the taught method to verify a step. If it fails, explain where the reasoning went wrong.",
      "notice": "The digits in a four-digit number tell thousands, hundreds, tens and ones. The box in 4,□72 is the hundreds digit. This means it changes the total by hundreds, not tens.",
      "check": {
        "question": "What digit solves 4,□72 strictly between 4,572 and 4,772?",
        "options": [
          "5",
          "6",
          "7",
          "8"
        ],
        "correct_index": 1,
        "explanation": "6. I compare 4,□72 with 4,572. The thousands match and the tens and ones match, so the hundreds digit must be greater than five."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Place-Value Detectives: Solve the Missing Digit",
            "transcript": "Pip: The code is 4, blank, 7, 2. Can any digit fit?\nJuno: Check both boundaries, not just one. The hundreds place is missing.\nPip: Six gives 4,672, between the two limits.\nJuno: Good. Pause and see why five and seven don''t work.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "The code is 4, blank, 7, 2. Can any digit fit?"
                  },
                  {
                    "who": "juno",
                    "text": "Check both boundaries, not just one. The hundreds place is missing."
                  },
                  {
                    "who": "pip",
                    "text": "Six gives 4,672, between the two limits."
                  },
                  {
                    "who": "juno",
                    "text": "Good. Pause and see why five and seven don''t work.",
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
      "title": "Use both boundaries",
      "explain": "**Learn:** A number satisfying two inequalities must meet each condition. 4,□72 must be above 4,572 **and** below 4,772.\n\n**Read the original situation:** A school fundraiser records 4,□72 dollars. The amount is greater than 4,572 but less than 4,772.\n\n**Connect the evidence:** Find a particular number, word or event that demonstrates the idea.",
      "example": "**WATCH MY THINKING**\nTrying six gives 4,672. It is 100 more than 4,572 and 100 less than 4,772. Seven would give 4,772, which is not *less* than the upper bound.\n\n**YOUR TURN**\nSolve four clues for a museum code. (A) 6,□45 is greater than 6,345 and less than 6,545. (B) 8,3□2 is at least 8,342 and below 8,372. (C) Write every number from the digits 4, 0, 7, 2 used once each that is greater than 4,700 and less than 4,800. (D) Explain the difference between < and ≤ using one of your answers. Show place-value comparisons and checks.\n\n**CHECK YOUR THINKING**\nUse the taught method to verify a step. If it fails, explain where the reasoning went wrong.",
      "notice": "A number satisfying two inequalities must meet each condition. 4,□72 must be above 4,572 **and** below 4,772.",
      "check": {
        "question": "Which digit can fill 5,□38 between 5,238 and 5,538?",
        "options": [
          "2",
          "4",
          "5",
          "6"
        ],
        "correct_index": 1,
        "explanation": "4. Trying six gives 4,672. It is 100 more than 4,572 and 100 less than 4,772. Seven would give 4,772, which is not *less* than the upper bound."
      }
    },
    {
      "icon": "✍️",
      "title": "Check an answer with expanded form",
      "explain": "**Learn:** Writing a candidate in expanded form can uncover digit-placement errors. For 4,672 the 6 is worth 600 and the 7 is worth 70.\n\n**Read the original situation:** A school fundraiser records 4,□72 dollars. The amount is greater than 4,572 but less than 4,772.\n\n**Connect the evidence:** Find a particular number, word or event that demonstrates the idea.",
      "example": "**WATCH MY THINKING**\nMy number is 4,000+600+70+2=4,672. It falls strictly between 4,572 and 4,772, so six works.\n\n**YOUR TURN**\nSolve four clues for a museum code. (A) 6,□45 is greater than 6,345 and less than 6,545. (B) 8,3□2 is at least 8,342 and below 8,372. (C) Write every number from the digits 4, 0, 7, 2 used once each that is greater than 4,700 and less than 4,800. (D) Explain the difference between < and ≤ using one of your answers. Show place-value comparisons and checks.\n\n**CHECK YOUR THINKING**\nUse the taught method to verify a step. If it fails, explain where the reasoning went wrong.",
      "notice": "Writing a candidate in expanded form can uncover digit-placement errors. For 4,672 the 6 is worth 600 and the 7 is worth 70.",
      "check": {
        "question": "What is the value of 6 in 4,672?",
        "options": [
          "6",
          "60",
          "600",
          "6,000"
        ],
        "correct_index": 2,
        "explanation": "600. My number is 4,000+600+70+2=4,672. It falls strictly between 4,572 and 4,772, so six works."
      }
    },
    {
      "icon": "✅",
      "title": "Explain uniqueness and common mistakes",
      "explain": "**Learn:** A missing-digit problem may have one, several or no valid choices. Check the wording carefully: greater than is not the same as greater than or equal to.\n\n**Read the original situation:** A school fundraiser records 4,□72 dollars. The amount is greater than 4,572 but less than 4,772.\n\n**Connect the evidence:** Find a particular number, word or event that demonstrates the idea.",
      "example": "**WATCH MY THINKING**\nOnly digit 6 works here. Digit 5 equals the lower boundary, and digit 7 equals the upper boundary; both fail the strict inequalities.\n\n**YOUR TURN**\nSolve four clues for a museum code. (A) 6,□45 is greater than 6,345 and less than 6,545. (B) 8,3□2 is at least 8,342 and below 8,372. (C) Write every number from the digits 4, 0, 7, 2 used once each that is greater than 4,700 and less than 4,800. (D) Explain the difference between < and ≤ using one of your answers. Show place-value comparisons and checks.\n\n**CHECK YOUR THINKING**\nUse the taught method to verify a step. If it fails, explain where the reasoning went wrong.",
      "notice": "A missing-digit problem may have one, several or no valid choices. Check the wording carefully: greater than is not the same as greater than or equal to.",
      "check": {
        "question": "Which number equals the upper boundary 4,772?",
        "options": [
          "4,672",
          "4,772",
          "4,572",
          "4,872"
        ],
        "correct_index": 1,
        "explanation": "4,772. Only digit 6 works here. Digit 5 equals the lower boundary, and digit 7 equals the upper boundary; both fail the strict inequalities."
      }
    }
  ],
  "worked_example": "## Full teacher model\n\nA school fundraiser records 4,□72 dollars. The amount is greater than 4,572 but less than 4,772.\n\n**1. Understand the positions:** I compare 4,□72 with 4,572. The thousands match and the tens and ones match, so the hundreds digit must be greater than five.\n\n**2. Use both boundaries:** Trying six gives 4,672. It is 100 more than 4,572 and 100 less than 4,772. Seven would give 4,772, which is not *less* than the upper bound.\n\n**3. Check an answer with expanded form:** My number is 4,000+600+70+2=4,672. It falls strictly between 4,572 and 4,772, so six works.\n\n**4. Explain uniqueness and common mistakes:** Only digit 6 works here. Digit 5 equals the lower boundary, and digit 7 equals the upper boundary; both fail the strict inequalities.\n\n**Now try:** Explain the method without copying the model, then check each detail against the original numbers or text.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 580 210\"><rect width=\"580\" height=\"210\" rx=\"12\" fill=\"#f4f8f6\"/><text x=\"16\" y=\"35\" font-family=\"Arial\" font-size=\"20\" fill=\"#244334\">Place value problem solving</text><rect x=\"14\" y=\"76\" width=\"131\" height=\"100\" rx=\"10\" fill=\"#dceee6\"/><text x=\"27\" y=\"133\" font-family=\"Arial\" font-size=\"17\" fill=\"#263f36\">READ</text><rect x=\"157\" y=\"76\" width=\"131\" height=\"100\" rx=\"10\" fill=\"#e6ecfb\"/><text x=\"170\" y=\"133\" font-family=\"Arial\" font-size=\"17\" fill=\"#263f36\">MODEL</text><rect x=\"300\" y=\"76\" width=\"131\" height=\"100\" rx=\"10\" fill=\"#dceee6\"/><text x=\"313\" y=\"133\" font-family=\"Arial\" font-size=\"17\" fill=\"#263f36\">TRY</text><rect x=\"443\" y=\"76\" width=\"131\" height=\"100\" rx=\"10\" fill=\"#e6ecfb\"/><text x=\"456\" y=\"133\" font-family=\"Arial\" font-size=\"17\" fill=\"#263f36\">CHECK</text></svg>",
      "alt": "Four labelled teaching steps for Place-Value Detectives: Solve the Missing Digit: read, model, try, check.",
      "caption": "Use each part of the teaching method and check your explanation."
    }
  ],
  "guided_practice": "**Practice:** Fill 5,□38 so the number is greater than 5,238 and less than 5,538. Possible hundreds digits are **3 and 4**: 5,338 and 5,438. Check the endpoints: 5,238 equals the lower limit and 5,538 equals the upper one.\n\n**Next:** A museum has 7,2□4 visitors. The total is between 7,234 and 7,274, without including endpoints. Tens digits 4, 5 or 6 work: 7,244, 7,254, 7,264. **Why not 3 or 7?** They make the endpoints.",
  "independent_task": "Solve four clues for a museum code. (A) 6,□45 is greater than 6,345 and less than 6,545. (B) 8,3□2 is at least 8,342 and below 8,372. (C) Write every number from the digits 4, 0, 7, 2 used once each that is greater than 4,700 and less than 4,800. (D) Explain the difference between < and ≤ using one of your answers. Show place-value comparisons and checks.",
  "response_prompt": "Finish the place-value detectives: solve the missing digit task with steps, evidence and a justified correction.",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "What digit solves 4,□72 strictly between 4,572 and 4,772?",
      "options": [
        "5",
        "6",
        "7",
        "8"
      ],
      "correct_index": 1,
      "explanation": "6. Check the original worked examples and reasoning."
    },
    {
      "type": "multiple_choice",
      "question": "Which digit can fill 5,□38 between 5,238 and 5,538?",
      "options": [
        "2",
        "4",
        "5",
        "6"
      ],
      "correct_index": 1,
      "explanation": "4. Check the original worked examples and reasoning."
    },
    {
      "type": "multiple_choice",
      "question": "What is the value of 6 in 4,672?",
      "options": [
        "6",
        "60",
        "600",
        "6,000"
      ],
      "correct_index": 2,
      "explanation": "600. Check the original worked examples and reasoning."
    },
    {
      "type": "multiple_choice",
      "question": "Which number equals the upper boundary 4,772?",
      "options": [
        "4,672",
        "4,772",
        "4,572",
        "4,872"
      ],
      "correct_index": 1,
      "explanation": "4,772. Check the original worked examples and reasoning."
    },
    {
      "type": "multiple_choice",
      "question": "Which does ''greater than 4,572'' mean?",
      "options": [
        "Equal to 4,572 is allowed",
        "The number must exceed 4,572",
        "The number must be below 4,572",
        "Every digit is larger"
      ],
      "correct_index": 1,
      "explanation": "The number must exceed 4,572. Check the original worked examples and reasoning."
    },
    {
      "type": "multiple_choice",
      "question": "Which satisfies 8,3□2 at least 8,342 and below 8,372?",
      "options": [
        "8,332",
        "8,342",
        "8,372",
        "8,382"
      ],
      "correct_index": 1,
      "explanation": "8,342. Check the original worked examples and reasoning."
    },
    {
      "type": "multiple_choice",
      "question": "Which uses digits 4,0,7,2 once and lies between 4,700 and 4,800?",
      "options": [
        "4,720",
        "4,702",
        "4,270",
        "4,072"
      ],
      "correct_index": 0,
      "explanation": "4,720. Check the original worked examples and reasoning."
    },
    {
      "type": "multiple_choice",
      "question": "What is correct for 7,254?",
      "options": [
        "The 5 means 500",
        "The 2 means 200",
        "The 5 means 50",
        "The 4 means 40"
      ],
      "correct_index": 2,
      "explanation": "The 5 means 50. Check the original worked examples and reasoning."
    },
    {
      "type": "short_answer",
      "question": "Complete the original independent challenge for place-value detectives: solve the missing digit.",
      "sample_answer": "A: hundreds digit 4 gives 6,445, the only value strictly between 6,345 and 6,545. B: tens digits 4, 5 or 6 give 8,342, 8,352 and 8,362. C: 4,702 and 4,720 are both between 4,700 and 4,800 and use the four digits once.",
      "marking_guide": "Require the specific values or observations requested, with accurate methods or textual evidence.",
      "explanation": "A complete answer shows its thinking."
    },
    {
      "type": "short_answer",
      "question": "Explain one check, alternative or misconception relevant to this topic.",
      "sample_answer": "The symbol < means strictly less than; ≤ allows equality. For B, 8,342 is allowed because the clue says at least 8,342. For A, 6,345 cannot be accepted because it equals the lower boundary.",
      "marking_guide": "Require a topic-specific check and reasoning that distinguishes correct and incorrect conclusions.",
      "explanation": "The answer should explain how the conclusion was verified."
    }
  ],
  "parent_notes": "Parent: **Teaching check.** Ask the child to demonstrate one key example unaided and explain what information matters.\n\nParent: **Written model one.** A: hundreds digit 4 gives 6,445, the only value strictly between 6,345 and 6,545. B: tens digits 4, 5 or 6 give 8,342, 8,352 and 8,362. C: 4,702 and 4,720 are both between 4,700 and 4,800 and use the four digits once.\n\nParent: **Written model two.** The symbol < means strictly less than; ≤ allows equality. For B, 8,342 is allowed because the clue says at least 8,342. For A, 6,345 cannot be accepted because it equals the lower boundary.\n\nParent: **Evidence.** Keep the child''s actual work and check both written responses. NESA outcomes require verification; eight scored questions need 8/8 for the established 90 percent threshold.",
  "evidence_instructions": "Save the place-value detectives: solve the missing digit independent work, guided practice, one correction and two written quiz responses.",
  "offline_alternative": "Use paper for the teaching, worked examples and original challenge, then show a parent the evidence or type it later.",
  "extension": "Invent a contrasting place-value detectives: solve the missing digit challenge, solve it, and explain a common wrong answer.",
  "stage_hints": {
    "accept": [
      "Read the Place-Value Detectives: Solve the Missing Digit instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to place-value detectives: solve the missing digit.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ],
    "teach0": [
      "Read the Understand the positions instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to understand the positions.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ],
    "teach1": [
      "Read the Use both boundaries instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to use both boundaries.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ],
    "teach2": [
      "Read the Check an answer with expanded form instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to check an answer with expanded form.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ],
    "teach3": [
      "Read the Explain uniqueness and common mistakes instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to explain uniqueness and common mistakes.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ],
    "learn": [
      "Read the Place-Value Detectives: Solve the Missing Digit instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to place-value detectives: solve the missing digit.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ],
    "guided": [
      "Read the Place-Value Detectives: Solve the Missing Digit instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to place-value detectives: solve the missing digit.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ],
    "write": [
      "Read the Place-Value Detectives: Solve the Missing Digit instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to place-value detectives: solve the missing digit.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ],
    "quiz": [
      "Read the Place-Value Detectives: Solve the Missing Digit instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to place-value detectives: solve the missing digit.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ],
    "submit": [
      "Read the Place-Value Detectives: Solve the Missing Digit instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to place-value detectives: solve the missing digit.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ]
  }
}'),updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE seed_key='s2-mat-y3-w03-l3';

-- s2-mat-y3-w03-l4
UPDATE lessons SET title='Place-Value Challenge: Fluency and Accuracy',data=json_patch(data,'{
  "seed_key": "s2-mat-y3-w03-l4",
  "title": "Place-Value Challenge: Fluency and Accuracy",
  "stage": "Stage 2",
  "learning_area": "Mathematics",
  "year_level": 3,
  "week": 3,
  "lesson_number": 4,
  "duration_minutes": 60,
  "child_mission": "Investigate place-value challenge: fluency and accuracy through a worked example, practice and an original challenge.",
  "learning_intention": "We are learning to understand and apply place-value challenge: fluency and accuracy accurately.",
  "success_criteria": [
    "I can explain the new concept in my own words.",
    "I can follow and check a demonstrated example.",
    "I can practise with feedback.",
    "I can finish an original independent task.",
    "I can correct or clarify an answer using evidence."
  ],
  "materials": [
    "All original stories, data and examples are included.",
    "Optional paper and pencil for calculations or annotations."
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
      "title": "Four concepts to remember",
      "cards": [
        {
          "front": "Read large numbers precisely",
          "back": "Separate thousands, hundreds, tens and ones when reading. A zero means an empty position, not a missing digit."
        },
        {
          "front": "Compare from the greatest place",
          "back": "Start at thousands; if equal, compare hundreds, then tens and ones. Don''t judge numbers by which digit looks largest."
        },
        {
          "front": "Round to nearest tens and hundreds",
          "back": "For tens, examine the ones digit. For hundreds, examine the tens digit and the whole last-two-digit value. Use the ordinary half-up convention at a midpoint."
        },
        {
          "front": "Check with a second representation",
          "back": "Expanded form and number-line benchmarks help spot ordering or rounding mistakes. A correct explanation connects the place value with the chosen result."
        }
      ]
    }
  ],
  "printable_resource": {
    "title": "Place-Value Challenge: Fluency and Accuracy",
    "instructions": "Read the situation, complete guided practice before looking at feedback, and solve the independent task.",
    "passage": "A scoreboard records 2,408, 2,480, 2,840 and 2,804 points.",
    "prompts": [
      "Which details matter?",
      "Show the method or relevant evidence.",
      "Complete the new problem.",
      "Explain one check or correction."
    ]
  },
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "🔎",
      "title": "Read large numbers precisely",
      "explain": "**Learn:** Separate thousands, hundreds, tens and ones when reading. A zero means an empty position, not a missing digit.\n\n**Read the original situation:** A scoreboard records 2,408, 2,480, 2,840 and 2,804 points.\n\n**Connect the evidence:** Find a particular number, word or event that demonstrates the idea.",
      "example": "**WATCH MY THINKING**\n2,408 is two thousand four hundred and eight. It has zero tens, so calling it two thousand forty-eight would be incorrect.\n\n**YOUR TURN**\nComplete the number challenge: (1) Write 5,309 in words and expanded form. (2) Sort 5,039, 5,309, 5,390 and 5,093 ascending. (3) Round 5,309, 5,350 and 5,395 to the nearest ten and nearest hundred. (4) Explain and correct this claim: ''5,309 rounds to 5,400 to nearest hundred''. Use a number-line benchmark or place-value rule as evidence.\n\n**CHECK YOUR THINKING**\nUse the taught method to verify a step. If it fails, explain where the reasoning went wrong.",
      "notice": "Separate thousands, hundreds, tens and ones when reading. A zero means an empty position, not a missing digit.",
      "check": {
        "question": "Which is smallest?",
        "options": [
          "5,039",
          "5,093",
          "5,309",
          "5,390"
        ],
        "correct_index": 0,
        "explanation": "5,039. 2,408 is two thousand four hundred and eight. It has zero tens, so calling it two thousand forty-eight would be incorrect."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Place-Value Challenge: Fluency and Accuracy",
            "transcript": "Pip: I see 2,804 and 2,840. They look nearly the same!\nJuno: Compare place values from the left until they differ.\nPip: At the tens place, four tens beat zero tens.\nJuno: Exactly. Pause and say which number is greater. Explain your thinking using a relevant clue or calculation before continuing.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "I see 2,804 and 2,840. They look nearly the same!"
                  },
                  {
                    "who": "juno",
                    "text": "Compare place values from the left until they differ."
                  },
                  {
                    "who": "pip",
                    "text": "At the tens place, four tens beat zero tens."
                  },
                  {
                    "who": "juno",
                    "text": "Exactly. Pause and say which number is greater. Explain your thinking using a relevant clue or calculation before continuing.",
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
      "title": "Compare from the greatest place",
      "explain": "**Learn:** Start at thousands; if equal, compare hundreds, then tens and ones. Don''t judge numbers by which digit looks largest.\n\n**Read the original situation:** A scoreboard records 2,408, 2,480, 2,840 and 2,804 points.\n\n**Connect the evidence:** Find a particular number, word or event that demonstrates the idea.",
      "example": "**WATCH MY THINKING**\n2,840 is greater than 2,804 because their thousands and hundreds match, but four tens are greater than zero tens.\n\n**YOUR TURN**\nComplete the number challenge: (1) Write 5,309 in words and expanded form. (2) Sort 5,039, 5,309, 5,390 and 5,093 ascending. (3) Round 5,309, 5,350 and 5,395 to the nearest ten and nearest hundred. (4) Explain and correct this claim: ''5,309 rounds to 5,400 to nearest hundred''. Use a number-line benchmark or place-value rule as evidence.\n\n**CHECK YOUR THINKING**\nUse the taught method to verify a step. If it fails, explain where the reasoning went wrong.",
      "notice": "Start at thousands; if equal, compare hundreds, then tens and ones. Don''t judge numbers by which digit looks largest.",
      "check": {
        "question": "What is 5,309 expanded?",
        "options": [
          "5,000+300+9",
          "5,000+30+9",
          "500+300+9",
          "5,000+300+90"
        ],
        "correct_index": 0,
        "explanation": "5,000+300+9. 2,840 is greater than 2,804 because their thousands and hundreds match, but four tens are greater than zero tens."
      }
    },
    {
      "icon": "✍️",
      "title": "Round to nearest tens and hundreds",
      "explain": "**Learn:** For tens, examine the ones digit. For hundreds, examine the tens digit and the whole last-two-digit value. Use the ordinary half-up convention at a midpoint.\n\n**Read the original situation:** A scoreboard records 2,408, 2,480, 2,840 and 2,804 points.\n\n**Connect the evidence:** Find a particular number, word or event that demonstrates the idea.",
      "example": "**WATCH MY THINKING**\n2,408 rounds to 2,410 to nearest ten and 2,400 to nearest hundred. 2,480 rounds to 2,500 to nearest hundred.\n\n**YOUR TURN**\nComplete the number challenge: (1) Write 5,309 in words and expanded form. (2) Sort 5,039, 5,309, 5,390 and 5,093 ascending. (3) Round 5,309, 5,350 and 5,395 to the nearest ten and nearest hundred. (4) Explain and correct this claim: ''5,309 rounds to 5,400 to nearest hundred''. Use a number-line benchmark or place-value rule as evidence.\n\n**CHECK YOUR THINKING**\nUse the taught method to verify a step. If it fails, explain where the reasoning went wrong.",
      "notice": "For tens, examine the ones digit. For hundreds, examine the tens digit and the whole last-two-digit value. Use the ordinary half-up convention at a midpoint.",
      "check": {
        "question": "Nearest ten to 5,309?",
        "options": [
          "5,300",
          "5,310",
          "5,390",
          "5,400"
        ],
        "correct_index": 1,
        "explanation": "5,310. 2,408 rounds to 2,410 to nearest ten and 2,400 to nearest hundred. 2,480 rounds to 2,500 to nearest hundred."
      }
    },
    {
      "icon": "✅",
      "title": "Check with a second representation",
      "explain": "**Learn:** Expanded form and number-line benchmarks help spot ordering or rounding mistakes. A correct explanation connects the place value with the chosen result.\n\n**Read the original situation:** A scoreboard records 2,408, 2,480, 2,840 and 2,804 points.\n\n**Connect the evidence:** Find a particular number, word or event that demonstrates the idea.",
      "example": "**WATCH MY THINKING**\n2,804 = 2,000+800+4. It is 4 from 2,800, so it rounds to 2,800 to nearest hundred.\n\n**YOUR TURN**\nComplete the number challenge: (1) Write 5,309 in words and expanded form. (2) Sort 5,039, 5,309, 5,390 and 5,093 ascending. (3) Round 5,309, 5,350 and 5,395 to the nearest ten and nearest hundred. (4) Explain and correct this claim: ''5,309 rounds to 5,400 to nearest hundred''. Use a number-line benchmark or place-value rule as evidence.\n\n**CHECK YOUR THINKING**\nUse the taught method to verify a step. If it fails, explain where the reasoning went wrong.",
      "notice": "Expanded form and number-line benchmarks help spot ordering or rounding mistakes. A correct explanation connects the place value with the chosen result.",
      "check": {
        "question": "Nearest hundred to 5,309?",
        "options": [
          "5,300",
          "5,310",
          "5,400",
          "5,000"
        ],
        "correct_index": 0,
        "explanation": "5,300. 2,804 = 2,000+800+4. It is 4 from 2,800, so it rounds to 2,800 to nearest hundred."
      }
    }
  ],
  "worked_example": "## Full teacher model\n\nA scoreboard records 2,408, 2,480, 2,840 and 2,804 points.\n\n**1. Read large numbers precisely:** 2,408 is two thousand four hundred and eight. It has zero tens, so calling it two thousand forty-eight would be incorrect.\n\n**2. Compare from the greatest place:** 2,840 is greater than 2,804 because their thousands and hundreds match, but four tens are greater than zero tens.\n\n**3. Round to nearest tens and hundreds:** 2,408 rounds to 2,410 to nearest ten and 2,400 to nearest hundred. 2,480 rounds to 2,500 to nearest hundred.\n\n**4. Check with a second representation:** 2,804 = 2,000+800+4. It is 4 from 2,800, so it rounds to 2,800 to nearest hundred.\n\n**Now try:** Explain the method without copying the model, then check each detail against the original numbers or text.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 580 210\"><rect width=\"580\" height=\"210\" rx=\"12\" fill=\"#f4f8f6\"/><text x=\"16\" y=\"35\" font-family=\"Arial\" font-size=\"20\" fill=\"#244334\">Place value problem solving</text><rect x=\"14\" y=\"76\" width=\"131\" height=\"100\" rx=\"10\" fill=\"#dceee6\"/><text x=\"27\" y=\"133\" font-family=\"Arial\" font-size=\"17\" fill=\"#263f36\">READ</text><rect x=\"157\" y=\"76\" width=\"131\" height=\"100\" rx=\"10\" fill=\"#e6ecfb\"/><text x=\"170\" y=\"133\" font-family=\"Arial\" font-size=\"17\" fill=\"#263f36\">MODEL</text><rect x=\"300\" y=\"76\" width=\"131\" height=\"100\" rx=\"10\" fill=\"#dceee6\"/><text x=\"313\" y=\"133\" font-family=\"Arial\" font-size=\"17\" fill=\"#263f36\">TRY</text><rect x=\"443\" y=\"76\" width=\"131\" height=\"100\" rx=\"10\" fill=\"#e6ecfb\"/><text x=\"456\" y=\"133\" font-family=\"Arial\" font-size=\"17\" fill=\"#263f36\">CHECK</text></svg>",
      "alt": "Four labelled teaching steps for Place-Value Challenge: Fluency and Accuracy: read, model, try, check.",
      "caption": "Use each part of the teaching method and check your explanation."
    }
  ],
  "guided_practice": "Put 3,047; 3,470; 3,407 and 3,074 in ascending order. **Check:** 3,047 < 3,074 < 3,407 < 3,470. Expand 3,407 as 3,000+400+7. Round 3,074 to tens (**3,070**) and hundreds (**3,100**). Notice rounding to different places gives different results.",
  "independent_task": "Complete the number challenge: (1) Write 5,309 in words and expanded form. (2) Sort 5,039, 5,309, 5,390 and 5,093 ascending. (3) Round 5,309, 5,350 and 5,395 to the nearest ten and nearest hundred. (4) Explain and correct this claim: ''5,309 rounds to 5,400 to nearest hundred''. Use a number-line benchmark or place-value rule as evidence.",
  "response_prompt": "Finish the place-value challenge: fluency and accuracy task with steps, evidence and a justified correction.",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "Which is smallest?",
      "options": [
        "5,039",
        "5,093",
        "5,309",
        "5,390"
      ],
      "correct_index": 0,
      "explanation": "5,039. Check the original worked examples and reasoning."
    },
    {
      "type": "multiple_choice",
      "question": "What is 5,309 expanded?",
      "options": [
        "5,000+300+9",
        "5,000+30+9",
        "500+300+9",
        "5,000+300+90"
      ],
      "correct_index": 0,
      "explanation": "5,000+300+9. Check the original worked examples and reasoning."
    },
    {
      "type": "multiple_choice",
      "question": "Nearest ten to 5,309?",
      "options": [
        "5,300",
        "5,310",
        "5,390",
        "5,400"
      ],
      "correct_index": 1,
      "explanation": "5,310. Check the original worked examples and reasoning."
    },
    {
      "type": "multiple_choice",
      "question": "Nearest hundred to 5,309?",
      "options": [
        "5,300",
        "5,310",
        "5,400",
        "5,000"
      ],
      "correct_index": 0,
      "explanation": "5,300. Check the original worked examples and reasoning."
    },
    {
      "type": "multiple_choice",
      "question": "Nearest hundred to 5,350 under half-up?",
      "options": [
        "5,300",
        "5,350",
        "5,400",
        "5,500"
      ],
      "correct_index": 2,
      "explanation": "5,400. Check the original worked examples and reasoning."
    },
    {
      "type": "multiple_choice",
      "question": "Nearest ten to 5,395 under half-up?",
      "options": [
        "5,390",
        "5,400",
        "5,300",
        "5,500"
      ],
      "correct_index": 1,
      "explanation": "5,400. Check the original worked examples and reasoning."
    },
    {
      "type": "multiple_choice",
      "question": "Which is greater?",
      "options": [
        "5,093",
        "5,309",
        "They are equal",
        "Both are less than 5,000"
      ],
      "correct_index": 1,
      "explanation": "5,309. Check the original worked examples and reasoning."
    },
    {
      "type": "multiple_choice",
      "question": "Which word form describes 5,309?",
      "options": [
        "Five thousand and thirty-nine",
        "Five thousand three hundred and nine",
        "Five hundred and thirty-nine",
        "Five thousand three hundred and ninety"
      ],
      "correct_index": 1,
      "explanation": "Five thousand three hundred and nine. Check the original worked examples and reasoning."
    },
    {
      "type": "short_answer",
      "question": "Complete the original independent challenge for place-value challenge: fluency and accuracy.",
      "sample_answer": "5,309 is five thousand three hundred and nine, or 5,000+300+9. Ascending order: 5,039; 5,093; 5,309; 5,390. Nearest tens: 5,309→5,310; 5,350→5,350; 5,395→5,400. Nearest hundreds: 5,309→5,300; 5,350→5,400; 5,395→5,400.",
      "marking_guide": "Require the specific values or observations requested, with accurate methods or textual evidence.",
      "explanation": "A complete answer shows its thinking."
    },
    {
      "type": "short_answer",
      "question": "Explain one check, alternative or misconception relevant to this topic.",
      "sample_answer": "The claim ''5,309 rounds to 5,400 to nearest hundred'' is incorrect. 5,309 is nine away from 5,300 and ninety-one away from 5,400. The nearest hundred is 5,300. I checked by comparing distances to the benchmarks.",
      "marking_guide": "Require a topic-specific check and reasoning that distinguishes correct and incorrect conclusions.",
      "explanation": "The answer should explain how the conclusion was verified."
    }
  ],
  "parent_notes": "Parent: **Teaching check.** Ask the child to demonstrate one key example unaided and explain what information matters.\n\nParent: **Written model one.** 5,309 is five thousand three hundred and nine, or 5,000+300+9. Ascending order: 5,039; 5,093; 5,309; 5,390. Nearest tens: 5,309→5,310; 5,350→5,350; 5,395→5,400. Nearest hundreds: 5,309→5,300; 5,350→5,400; 5,395→5,400.\n\nParent: **Written model two.** The claim ''5,309 rounds to 5,400 to nearest hundred'' is incorrect. 5,309 is nine away from 5,300 and ninety-one away from 5,400. The nearest hundred is 5,300. I checked by comparing distances to the benchmarks.\n\nParent: **Evidence.** Keep the child''s actual work and check both written responses. NESA outcomes require verification; eight scored questions need 8/8 for the established 90 percent threshold.",
  "evidence_instructions": "Save the place-value challenge: fluency and accuracy independent work, guided practice, one correction and two written quiz responses.",
  "offline_alternative": "Use paper for the teaching, worked examples and original challenge, then show a parent the evidence or type it later.",
  "extension": "Invent a contrasting place-value challenge: fluency and accuracy challenge, solve it, and explain a common wrong answer.",
  "stage_hints": {
    "accept": [
      "Read the Place-Value Challenge: Fluency and Accuracy instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to place-value challenge: fluency and accuracy.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ],
    "teach0": [
      "Read the Read large numbers precisely instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to read large numbers precisely.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ],
    "teach1": [
      "Read the Compare from the greatest place instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to compare from the greatest place.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ],
    "teach2": [
      "Read the Round to nearest tens and hundreds instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to round to nearest tens and hundreds.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ],
    "teach3": [
      "Read the Check with a second representation instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to check with a second representation.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ],
    "learn": [
      "Read the Place-Value Challenge: Fluency and Accuracy instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to place-value challenge: fluency and accuracy.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ],
    "guided": [
      "Read the Place-Value Challenge: Fluency and Accuracy instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to place-value challenge: fluency and accuracy.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ],
    "write": [
      "Read the Place-Value Challenge: Fluency and Accuracy instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to place-value challenge: fluency and accuracy.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ],
    "quiz": [
      "Read the Place-Value Challenge: Fluency and Accuracy instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to place-value challenge: fluency and accuracy.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ],
    "submit": [
      "Read the Place-Value Challenge: Fluency and Accuracy instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to place-value challenge: fluency and accuracy.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ]
  }
}'),updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE seed_key='s2-mat-y3-w03-l4';

-- s2-eng-y3-w04-l1
UPDATE lessons SET title='Evidence Detective: Make an Inference',data=json_patch(data,'{
  "seed_key": "s2-eng-y3-w04-l1",
  "title": "Evidence Detective: Make an Inference",
  "stage": "Stage 2",
  "learning_area": "English",
  "year_level": 3,
  "week": 4,
  "lesson_number": 1,
  "duration_minutes": 60,
  "child_mission": "Investigate evidence detective: make an inference through a worked example, practice and an original challenge.",
  "learning_intention": "We are learning to understand and apply evidence detective: make an inference accurately.",
  "success_criteria": [
    "I can explain the new concept in my own words.",
    "I can follow and check a demonstrated example.",
    "I can practise with feedback.",
    "I can finish an original independent task.",
    "I can correct or clarify an answer using evidence."
  ],
  "materials": [
    "All original stories, data and examples are included.",
    "Optional paper and pencil for calculations or annotations."
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
      "title": "Four concepts to remember",
      "cards": [
        {
          "front": "Identify a stated clue",
          "back": "A **fact stated by the text** is different from an inference. We can directly observe that the coat is dripping, the boots are muddy and the ball is dry."
        },
        {
          "front": "Combine clues with what you know",
          "back": "An **inference** is a reasonable idea supported by clues and background knowledge. A dripping coat and muddy boots may suggest someone was outside in wet conditions, but they do not prove exactly what happened."
        },
        {
          "front": "Explain more than one possibility",
          "back": "Good readers consider an alternative when the clues do not settle the question. An inference is stronger when you can explain both the clue and the reasoning linking it to an idea."
        },
        {
          "front": "Update an inference with new evidence",
          "back": "A later sentence may support one inference or overturn it. Compare the new information with the first idea rather than pretending your first guess was a fact."
        }
      ]
    }
  ],
  "printable_resource": {
    "title": "Evidence Detective: Make an Inference",
    "instructions": "Read the situation, complete guided practice before looking at feedback, and solve the independent task.",
    "passage": "Outside the classroom, a dripping raincoat hangs above muddy boots. On a nearby shelf sits a dry football.",
    "prompts": [
      "Which details matter?",
      "Show the method or relevant evidence.",
      "Complete the new problem.",
      "Explain one check or correction."
    ]
  },
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "🔎",
      "title": "Identify a stated clue",
      "explain": "**Learn:** A **fact stated by the text** is different from an inference. We can directly observe that the coat is dripping, the boots are muddy and the ball is dry.\n\n**Read the original situation:** Outside the classroom, a dripping raincoat hangs above muddy boots. On a nearby shelf sits a dry football.\n\n**Connect the evidence:** Find a particular number, word or event that demonstrates the idea.",
      "example": "**WATCH MY THINKING**\nI write under ''What the text says'': *The raincoat drips water.* I do not write ''It rained all morning'', because the sentence doesn''t state that.\n\n**YOUR TURN**\n**The Quiet Library:** ''The reading corner''s cushions are scattered. Three picture books lie open on the floor. A small sign says STORY TIME — 10:00 AM. The clock now reads 10:25 AM.'' Write two directly stated facts, two plausible inferences and a clue-based explanation for each. Identify one inference you cannot confirm. Then reveal: ''The librarian says the children''s story session finished ten minutes ago.'' Revise one inference to reflect that new evidence.\n\n**CHECK YOUR THINKING**\nUse the taught method to verify a step. If it fails, explain where the reasoning went wrong.",
      "notice": "A **fact stated by the text** is different from an inference. We can directly observe that the coat is dripping, the boots are muddy and the ball is dry.",
      "check": {
        "question": "Which is stated in the library scene?",
        "options": [
          "The children were noisy.",
          "Three books lie open.",
          "A child broke a shelf.",
          "Nobody attended."
        ],
        "correct_index": 1,
        "explanation": "Three books lie open.. I write under ''What the text says'': *The raincoat drips water.* I do not write ''It rained all morning'', because the sentence doesn''t state that."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Evidence Detective: Make an Inference",
            "transcript": "Pip: The raincoat is wet, so a huge storm definitely happened!\nJuno: The coat being wet is a clue, but the storm is only one possible explanation.\nPip: I can say someone may have been in wet conditions, because the coat drips.\nJuno: Exactly. Pause and name another way a coat might become wet.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "The raincoat is wet, so a huge storm definitely happened!"
                  },
                  {
                    "who": "juno",
                    "text": "The coat being wet is a clue, but the storm is only one possible explanation."
                  },
                  {
                    "who": "pip",
                    "text": "I can say someone may have been in wet conditions, because the coat drips."
                  },
                  {
                    "who": "juno",
                    "text": "Exactly. Pause and name another way a coat might become wet.",
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
      "title": "Combine clues with what you know",
      "explain": "**Learn:** An **inference** is a reasonable idea supported by clues and background knowledge. A dripping coat and muddy boots may suggest someone was outside in wet conditions, but they do not prove exactly what happened.\n\n**Read the original situation:** Outside the classroom, a dripping raincoat hangs above muddy boots. On a nearby shelf sits a dry football.\n\n**Connect the evidence:** Find a particular number, word or event that demonstrates the idea.",
      "example": "**WATCH MY THINKING**\nI infer someone may have walked in wet or muddy conditions. My evidence is the dripping coat and muddy boots. I use *may* because someone could have washed the coat or boots.\n\n**YOUR TURN**\n**The Quiet Library:** ''The reading corner''s cushions are scattered. Three picture books lie open on the floor. A small sign says STORY TIME — 10:00 AM. The clock now reads 10:25 AM.'' Write two directly stated facts, two plausible inferences and a clue-based explanation for each. Identify one inference you cannot confirm. Then reveal: ''The librarian says the children''s story session finished ten minutes ago.'' Revise one inference to reflect that new evidence.\n\n**CHECK YOUR THINKING**\nUse the taught method to verify a step. If it fails, explain where the reasoning went wrong.",
      "notice": "An **inference** is a reasonable idea supported by clues and background knowledge. A dripping coat and muddy boots may suggest someone was outside in wet conditions, but they do not prove exactly what happened.",
      "check": {
        "question": "Which is a reasonable inference?",
        "options": [
          "A reading activity may have happened recently.",
          "A storm destroyed the library.",
          "The library is closing forever.",
          "A thief took the cushions."
        ],
        "correct_index": 0,
        "explanation": "A reading activity may have happened recently.. I infer someone may have walked in wet or muddy conditions. My evidence is the dripping coat and muddy boots. I use *may* because someone could have washed the coat or boots."
      }
    },
    {
      "icon": "✍️",
      "title": "Explain more than one possibility",
      "explain": "**Learn:** Good readers consider an alternative when the clues do not settle the question. An inference is stronger when you can explain both the clue and the reasoning linking it to an idea.\n\n**Read the original situation:** Outside the classroom, a dripping raincoat hangs above muddy boots. On a nearby shelf sits a dry football.\n\n**Connect the evidence:** Find a particular number, word or event that demonstrates the idea.",
      "example": "**WATCH MY THINKING**\nThe wet clothing might suggest rain, but it could also have been sprayed with water. I cannot say ''A storm definitely happened'' without another clue.\n\n**YOUR TURN**\n**The Quiet Library:** ''The reading corner''s cushions are scattered. Three picture books lie open on the floor. A small sign says STORY TIME — 10:00 AM. The clock now reads 10:25 AM.'' Write two directly stated facts, two plausible inferences and a clue-based explanation for each. Identify one inference you cannot confirm. Then reveal: ''The librarian says the children''s story session finished ten minutes ago.'' Revise one inference to reflect that new evidence.\n\n**CHECK YOUR THINKING**\nUse the taught method to verify a step. If it fails, explain where the reasoning went wrong.",
      "notice": "Good readers consider an alternative when the clues do not settle the question. An inference is stronger when you can explain both the clue and the reasoning linking it to an idea.",
      "check": {
        "question": "Which detail supports a recent activity?",
        "options": [
          "The cushions are scattered and books open.",
          "A clock has hands.",
          "Libraries have roofs.",
          "The street has trees."
        ],
        "correct_index": 0,
        "explanation": "The cushions are scattered and books open.. The wet clothing might suggest rain, but it could also have been sprayed with water. I cannot say ''A storm definitely happened'' without another clue."
      }
    },
    {
      "icon": "✅",
      "title": "Update an inference with new evidence",
      "explain": "**Learn:** A later sentence may support one inference or overturn it. Compare the new information with the first idea rather than pretending your first guess was a fact.\n\n**Read the original situation:** Outside the classroom, a dripping raincoat hangs above muddy boots. On a nearby shelf sits a dry football.\n\n**Connect the evidence:** Find a particular number, word or event that demonstrates the idea.",
      "example": "**WATCH MY THINKING**\nNew line: *The groundskeeper had just hosed down the pathway.* That supports a way the coat could have become wet without rain. I revise my earlier inference to mention water from the hose as a possibility.\n\n**YOUR TURN**\n**The Quiet Library:** ''The reading corner''s cushions are scattered. Three picture books lie open on the floor. A small sign says STORY TIME — 10:00 AM. The clock now reads 10:25 AM.'' Write two directly stated facts, two plausible inferences and a clue-based explanation for each. Identify one inference you cannot confirm. Then reveal: ''The librarian says the children''s story session finished ten minutes ago.'' Revise one inference to reflect that new evidence.\n\n**CHECK YOUR THINKING**\nUse the taught method to verify a step. If it fails, explain where the reasoning went wrong.",
      "notice": "A later sentence may support one inference or overturn it. Compare the new information with the first idea rather than pretending your first guess was a fact.",
      "check": {
        "question": "What does the clock state?",
        "options": [
          "It reads 10:25 AM.",
          "Story time has just begun.",
          "Someone is late.",
          "The children went home."
        ],
        "correct_index": 0,
        "explanation": "It reads 10:25 AM.. New line: *The groundskeeper had just hosed down the pathway.* That supports a way the coat could have become wet without rain. I revise my earlier inference to mention water from the hose as a possibility."
      }
    }
  ],
  "worked_example": "## Full teacher model\n\nOutside the classroom, a dripping raincoat hangs above muddy boots. On a nearby shelf sits a dry football.\n\n**1. Identify a stated clue:** I write under ''What the text says'': *The raincoat drips water.* I do not write ''It rained all morning'', because the sentence doesn''t state that.\n\n**2. Combine clues with what you know:** I infer someone may have walked in wet or muddy conditions. My evidence is the dripping coat and muddy boots. I use *may* because someone could have washed the coat or boots.\n\n**3. Explain more than one possibility:** The wet clothing might suggest rain, but it could also have been sprayed with water. I cannot say ''A storm definitely happened'' without another clue.\n\n**4. Update an inference with new evidence:** New line: *The groundskeeper had just hosed down the pathway.* That supports a way the coat could have become wet without rain. I revise my earlier inference to mention water from the hose as a possibility.\n\n**Now try:** Explain the method without copying the model, then check each detail against the original numbers or text.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 580 210\"><rect width=\"580\" height=\"210\" rx=\"12\" fill=\"#f4f8f6\"/><text x=\"16\" y=\"35\" font-family=\"Arial\" font-size=\"20\" fill=\"#244334\">Evidence before inference</text><rect x=\"14\" y=\"76\" width=\"131\" height=\"100\" rx=\"10\" fill=\"#dceee6\"/><text x=\"27\" y=\"133\" font-family=\"Arial\" font-size=\"17\" fill=\"#263f36\">READ</text><rect x=\"157\" y=\"76\" width=\"131\" height=\"100\" rx=\"10\" fill=\"#e6ecfb\"/><text x=\"170\" y=\"133\" font-family=\"Arial\" font-size=\"17\" fill=\"#263f36\">MODEL</text><rect x=\"300\" y=\"76\" width=\"131\" height=\"100\" rx=\"10\" fill=\"#dceee6\"/><text x=\"313\" y=\"133\" font-family=\"Arial\" font-size=\"17\" fill=\"#263f36\">TRY</text><rect x=\"443\" y=\"76\" width=\"131\" height=\"100\" rx=\"10\" fill=\"#e6ecfb\"/><text x=\"456\" y=\"133\" font-family=\"Arial\" font-size=\"17\" fill=\"#263f36\">CHECK</text></svg>",
      "alt": "Four labelled teaching steps for Evidence Detective: Make an Inference: read, model, try, check.",
      "caption": "Use each part of the teaching method and check your explanation."
    }
  ],
  "guided_practice": "**New scene:** The kitchen counter is dusted with flour, an empty mixing bowl rests by the sink, and warm bread sits on a cooling rack.\n\n1. Name two *stated* details.\n2. Make an inference about what someone did.\n3. Connect each clue to your inference.\n4. Give one alternative explanation for flour on the counter.\n\n**Check:** Stated: there is flour and warm bread. Possible inference: someone recently baked bread; those details support it. Alternative: flour could have spilled while cooking something else. The passage does not name the cook.",
  "independent_task": "**The Quiet Library:** ''The reading corner''s cushions are scattered. Three picture books lie open on the floor. A small sign says STORY TIME — 10:00 AM. The clock now reads 10:25 AM.'' Write two directly stated facts, two plausible inferences and a clue-based explanation for each. Identify one inference you cannot confirm. Then reveal: ''The librarian says the children''s story session finished ten minutes ago.'' Revise one inference to reflect that new evidence.",
  "response_prompt": "Finish the evidence detective: make an inference task with steps, evidence and a justified correction.",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "Which is stated in the library scene?",
      "options": [
        "The children were noisy.",
        "Three books lie open.",
        "A child broke a shelf.",
        "Nobody attended."
      ],
      "correct_index": 1,
      "explanation": "Three books lie open.. Check the original worked examples and reasoning."
    },
    {
      "type": "multiple_choice",
      "question": "Which is a reasonable inference?",
      "options": [
        "A reading activity may have happened recently.",
        "A storm destroyed the library.",
        "The library is closing forever.",
        "A thief took the cushions."
      ],
      "correct_index": 0,
      "explanation": "A reading activity may have happened recently.. Check the original worked examples and reasoning."
    },
    {
      "type": "multiple_choice",
      "question": "Which detail supports a recent activity?",
      "options": [
        "The cushions are scattered and books open.",
        "A clock has hands.",
        "Libraries have roofs.",
        "The street has trees."
      ],
      "correct_index": 0,
      "explanation": "The cushions are scattered and books open.. Check the original worked examples and reasoning."
    },
    {
      "type": "multiple_choice",
      "question": "What does the clock state?",
      "options": [
        "It reads 10:25 AM.",
        "Story time has just begun.",
        "Someone is late.",
        "The children went home."
      ],
      "correct_index": 0,
      "explanation": "It reads 10:25 AM.. Check the original worked examples and reasoning."
    },
    {
      "type": "multiple_choice",
      "question": "Which cannot be concluded from the first paragraph?",
      "options": [
        "Books are on the floor.",
        "Story time is on the sign.",
        "The session certainly had 20 children.",
        "The clock reads 10:25."
      ],
      "correct_index": 2,
      "explanation": "The session certainly had 20 children.. Check the original worked examples and reasoning."
    },
    {
      "type": "multiple_choice",
      "question": "What is an inference?",
      "options": [
        "A supported idea beyond what is directly stated.",
        "A word copied from the passage.",
        "An unrelated guess.",
        "Always a proven fact."
      ],
      "correct_index": 0,
      "explanation": "A supported idea beyond what is directly stated.. Check the original worked examples and reasoning."
    },
    {
      "type": "multiple_choice",
      "question": "What does the librarian''s new information confirm?",
      "options": [
        "A session ended ten minutes ago.",
        "No story was read.",
        "A window broke.",
        "The room was empty all day."
      ],
      "correct_index": 0,
      "explanation": "A session ended ten minutes ago.. Check the original worked examples and reasoning."
    },
    {
      "type": "multiple_choice",
      "question": "What should a reader do when new evidence appears?",
      "options": [
        "Ignore it.",
        "Repeat an unsupported claim.",
        "Revise the earlier idea.",
        "Invent more facts."
      ],
      "correct_index": 2,
      "explanation": "Revise the earlier idea.. Check the original worked examples and reasoning."
    },
    {
      "type": "short_answer",
      "question": "Complete the original independent challenge for evidence detective: make an inference.",
      "sample_answer": "Facts: three picture books lie open on the floor and the clock says 10:25 AM. Inference 1: story time may have happened, supported by the sign and the open books. Inference 2: readers may have used the cushions, supported by their scattered positions. Neither tells me the number of children.",
      "marking_guide": "Require the specific values or observations requested, with accurate methods or textual evidence.",
      "explanation": "A complete answer shows its thinking."
    },
    {
      "type": "short_answer",
      "question": "Explain one check, alternative or misconception relevant to this topic.",
      "sample_answer": "Before the librarian speaks, I cannot prove story time happened or know how many attended. After hearing that it ended ten minutes ago, I can say it did happen and finished around 10:15 AM; I still cannot tell how many children were there.",
      "marking_guide": "Require a topic-specific check and reasoning that distinguishes correct and incorrect conclusions.",
      "explanation": "The answer should explain how the conclusion was verified."
    }
  ],
  "parent_notes": "Parent: **Teaching check.** Ask the child to demonstrate one key example unaided and explain what information matters.\n\nParent: **Written model one.** Facts: three picture books lie open on the floor and the clock says 10:25 AM. Inference 1: story time may have happened, supported by the sign and the open books. Inference 2: readers may have used the cushions, supported by their scattered positions. Neither tells me the number of children.\n\nParent: **Written model two.** Before the librarian speaks, I cannot prove story time happened or know how many attended. After hearing that it ended ten minutes ago, I can say it did happen and finished around 10:15 AM; I still cannot tell how many children were there.\n\nParent: **Evidence.** Keep the child''s actual work and check both written responses. NESA outcomes require verification; eight scored questions need 8/8 for the established 90 percent threshold.",
  "evidence_instructions": "Save the evidence detective: make an inference independent work, guided practice, one correction and two written quiz responses.",
  "offline_alternative": "Use paper for the teaching, worked examples and original challenge, then show a parent the evidence or type it later.",
  "extension": "Invent a contrasting evidence detective: make an inference challenge, solve it, and explain a common wrong answer.",
  "stage_hints": {
    "accept": [
      "Read the Evidence Detective: Make an Inference instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to evidence detective: make an inference.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ],
    "teach0": [
      "Read the Identify a stated clue instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to identify a stated clue.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ],
    "teach1": [
      "Read the Combine clues with what you know instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to combine clues with what you know.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ],
    "teach2": [
      "Read the Explain more than one possibility instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to explain more than one possibility.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ],
    "teach3": [
      "Read the Update an inference with new evidence instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to update an inference with new evidence.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ],
    "learn": [
      "Read the Evidence Detective: Make an Inference instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to evidence detective: make an inference.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ],
    "guided": [
      "Read the Evidence Detective: Make an Inference instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to evidence detective: make an inference.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ],
    "write": [
      "Read the Evidence Detective: Make an Inference instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to evidence detective: make an inference.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ],
    "quiz": [
      "Read the Evidence Detective: Make an Inference instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to evidence detective: make an inference.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ],
    "submit": [
      "Read the Evidence Detective: Make an Inference instruction and decide what it asks you to do.",
      "Go back to the original example, locate the specific number or clue relevant to evidence detective: make an inference.",
      "Show the working or quoted evidence, then explain why it supports the answer. Check one potential mistake."
    ]
  }
}'),updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE seed_key='s2-eng-y3-w04-l1';
