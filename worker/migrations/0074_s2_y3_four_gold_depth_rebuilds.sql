-- Standard v2 Year 3 correction batch: Maths W4 L2–4 and English W5 L1.

-- s2-mat-y3-w04-l2
UPDATE lessons SET title='Estimate First, Check Twice',data=json_patch(data,'{
  "seed_key": "s2-mat-y3-w04-l2",
  "title": "Estimate First, Check Twice",
  "stage": "Stage 2",
  "learning_area": "Mathematics",
  "year_level": 3,
  "week": 4,
  "lesson_number": 2,
  "duration_minutes": 60,
  "child_mission": "Investigate estimate first, check twice, practise the process and complete an original challenge.",
  "learning_intention": "We are learning to use estimate first, check twice with correct evidence and explanations.",
  "success_criteria": [
    "I can explain the main concept clearly.",
    "I can follow the worked model and explain its steps.",
    "I can complete guided practice and check feedback.",
    "I can answer a new independent challenge.",
    "I can explain one correction using evidence."
  ],
  "materials": [
    "All original examples and text are provided.",
    "Optional pencil and paper for checking."
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
      "title": "Important learning concepts",
      "cards": [
        {
          "front": "What is an estimate?",
          "back": "An estimate is an approximate answer used to decide whether an exact result is sensible. It is not a random guess. Rounding numbers to tens or hundreds is one useful strategy."
        },
        {
          "front": "Choose how accurately to round",
          "back": "Rounding to the nearest ten usually gives a closer estimate than rounding to the nearest hundred, but may take a little more work. Describe the precision chosen."
        },
        {
          "front": "Calculate the exact result",
          "back": "After estimating, add the original numbers. Partition into hundreds, tens and ones or use a written calculation, then compare the result with the estimate."
        },
        {
          "front": "Spot an unreasonable answer",
          "back": "A check catches errors in calculation, units or rounding. If the exact answer is far from both estimates, revisit your working."
        }
      ]
    }
  ],
  "printable_resource": {
    "title": "Estimate First, Check Twice",
    "instructions": "Read the example, attempt the guided questions, then complete the independent challenge and check your thinking.",
    "passage": "A school fair expects 487 visitors in the morning and 316 in the afternoon. A volunteer guesses the total will be about 800.",
    "prompts": [
      "What do I already know?",
      "What method or evidence will I use?",
      "What is my answer?",
      "How did I check it?"
    ]
  },
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "🔎",
      "title": "What is an estimate?",
      "explain": "**Understand the idea.** An estimate is an approximate answer used to decide whether an exact result is sensible. It is not a random guess. Rounding numbers to tens or hundreds is one useful strategy.\n\n**Original example:** A school fair expects 487 visitors in the morning and 316 in the afternoon. A volunteer guesses the total will be about 800.\n\n**Why it matters:** Focus on a particular number, step or event to justify your thinking.",
      "example": "**WATCH MY THINKING**\n487≈500 and 316≈300 to the nearest hundred. I estimate about 800 visitors, so an exact result near 800 would be reasonable.\n\n**PRACTISE WITH SUPPORT**\n**Try 1:** Estimate 264+518 to the nearest hundred: 300+500=800; exact 782, a difference of 18. **Try 2:** Estimate 741−283: 700−300=400; exact 458. **Try 3:** Which is a better nearest-ten estimate for 397+205? 400+210=610; exact 602. Discuss how estimation detects an impossible answer, not just whether estimates equal exact totals.\n\n**CHECK:** Compare the worked explanation with the principle, and name the correction if a value or detail differs.",
      "notice": "An estimate is an approximate answer used to decide whether an exact result is sensible. It is not a random guess. Rounding numbers to tens or hundreds is one useful strategy.",
      "check": {
        "question": "Nearest hundred to 487?",
        "options": [
          "400",
          "480",
          "500",
          "490"
        ],
        "correct_index": 2,
        "explanation": "500. 487≈500 and 316≈300 to the nearest hundred. I estimate about 800 visitors, so an exact result near 800 would be reasonable."
      },
      "visual_before": [
        {
          "episode": {
            "title": "A clue for Estimate First, Check Twice",
            "transcript": "Pip: I added 487 and 316 and got 1,803. That seems big!\nJuno: Estimate first. About five hundred plus three hundred makes about eight hundred.\nPip: So 1,803 is unlikely. The exact total is 803.\nJuno: Yes. Pause and explain how the estimate helped you find the error.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "I added 487 and 316 and got 1,803. That seems big!"
                  },
                  {
                    "who": "juno",
                    "text": "Estimate first. About five hundred plus three hundred makes about eight hundred."
                  },
                  {
                    "who": "pip",
                    "text": "So 1,803 is unlikely. The exact total is 803."
                  },
                  {
                    "who": "juno",
                    "text": "Yes. Pause and explain how the estimate helped you find the error.",
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
      "title": "Choose how accurately to round",
      "explain": "**Understand the idea.** Rounding to the nearest ten usually gives a closer estimate than rounding to the nearest hundred, but may take a little more work. Describe the precision chosen.\n\n**Original example:** A school fair expects 487 visitors in the morning and 316 in the afternoon. A volunteer guesses the total will be about 800.\n\n**Why it matters:** Focus on a particular number, step or event to justify your thinking.",
      "example": "**WATCH MY THINKING**\n487≈490 and 316≈320 to the nearest ten. The estimated sum is 810. Both estimates are reasonable because they use different levels of precision.\n\n**PRACTISE WITH SUPPORT**\n**Try 1:** Estimate 264+518 to the nearest hundred: 300+500=800; exact 782, a difference of 18. **Try 2:** Estimate 741−283: 700−300=400; exact 458. **Try 3:** Which is a better nearest-ten estimate for 397+205? 400+210=610; exact 602. Discuss how estimation detects an impossible answer, not just whether estimates equal exact totals.\n\n**CHECK:** Compare the worked explanation with the principle, and name the correction if a value or detail differs.",
      "notice": "Rounding to the nearest ten usually gives a closer estimate than rounding to the nearest hundred, but may take a little more work. Describe the precision chosen.",
      "check": {
        "question": "Nearest hundred to 316?",
        "options": [
          "300",
          "310",
          "320",
          "400"
        ],
        "correct_index": 0,
        "explanation": "300. 487≈490 and 316≈320 to the nearest ten. The estimated sum is 810. Both estimates are reasonable because they use different levels of precision."
      }
    },
    {
      "icon": "✏️",
      "title": "Calculate the exact result",
      "explain": "**Understand the idea.** After estimating, add the original numbers. Partition into hundreds, tens and ones or use a written calculation, then compare the result with the estimate.\n\n**Original example:** A school fair expects 487 visitors in the morning and 316 in the afternoon. A volunteer guesses the total will be about 800.\n\n**Why it matters:** Focus on a particular number, step or event to justify your thinking.",
      "example": "**WATCH MY THINKING**\n487+316 = (400+300)+(80+10)+(7+6) = 700+90+13 = 803. The estimate 800 was close: only three less.\n\n**PRACTISE WITH SUPPORT**\n**Try 1:** Estimate 264+518 to the nearest hundred: 300+500=800; exact 782, a difference of 18. **Try 2:** Estimate 741−283: 700−300=400; exact 458. **Try 3:** Which is a better nearest-ten estimate for 397+205? 400+210=610; exact 602. Discuss how estimation detects an impossible answer, not just whether estimates equal exact totals.\n\n**CHECK:** Compare the worked explanation with the principle, and name the correction if a value or detail differs.",
      "notice": "After estimating, add the original numbers. Partition into hundreds, tens and ones or use a written calculation, then compare the result with the estimate.",
      "check": {
        "question": "487+316 exactly?",
        "options": [
          "793",
          "803",
          "813",
          "903"
        ],
        "correct_index": 1,
        "explanation": "803. 487+316 = (400+300)+(80+10)+(7+6) = 700+90+13 = 803. The estimate 800 was close: only three less."
      }
    },
    {
      "icon": "✅",
      "title": "Spot an unreasonable answer",
      "explain": "**Understand the idea.** A check catches errors in calculation, units or rounding. If the exact answer is far from both estimates, revisit your working.\n\n**Original example:** A school fair expects 487 visitors in the morning and 316 in the afternoon. A volunteer guesses the total will be about 800.\n\n**Why it matters:** Focus on a particular number, step or event to justify your thinking.",
      "example": "**WATCH MY THINKING**\nIf somebody calculated 487+316 as 1,803, I''d question it: two numbers below 500 and 400 cannot sum to over 1,800. Recalculate the hundreds, tens and ones.\n\n**PRACTISE WITH SUPPORT**\n**Try 1:** Estimate 264+518 to the nearest hundred: 300+500=800; exact 782, a difference of 18. **Try 2:** Estimate 741−283: 700−300=400; exact 458. **Try 3:** Which is a better nearest-ten estimate for 397+205? 400+210=610; exact 602. Discuss how estimation detects an impossible answer, not just whether estimates equal exact totals.\n\n**CHECK:** Compare the worked explanation with the principle, and name the correction if a value or detail differs.",
      "notice": "A check catches errors in calculation, units or rounding. If the exact answer is far from both estimates, revisit your working.",
      "check": {
        "question": "487+316 to nearest-hundred estimates?",
        "options": [
          "500+300=800",
          "400+300=700",
          "490+310=800",
          "500+400=900"
        ],
        "correct_index": 0,
        "explanation": "500+300=800. If somebody calculated 487+316 as 1,803, I''d question it: two numbers below 500 and 400 cannot sum to over 1,800. Recalculate the hundreds, tens and ones."
      }
    }
  ],
  "worked_example": "## Original teacher model\n\nA school fair expects 487 visitors in the morning and 316 in the afternoon. A volunteer guesses the total will be about 800.\n\n**1. What is an estimate?:** 487≈500 and 316≈300 to the nearest hundred. I estimate about 800 visitors, so an exact result near 800 would be reasonable.\n\n**2. Choose how accurately to round:** 487≈490 and 316≈320 to the nearest ten. The estimated sum is 810. Both estimates are reasonable because they use different levels of precision.\n\n**3. Calculate the exact result:** 487+316 = (400+300)+(80+10)+(7+6) = 700+90+13 = 803. The estimate 800 was close: only three less.\n\n**4. Spot an unreasonable answer:** If somebody calculated 487+316 as 1,803, I''d question it: two numbers below 500 and 400 cannot sum to over 1,800. Recalculate the hundreds, tens and ones.\n\n**Check:** Explain the most important evidence or calculation without looking at the model.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 560 215\"><rect width=\"560\" height=\"215\" rx=\"10\" fill=\"#f4f8f5\"/><text x=\"18\" y=\"33\" font-family=\"Arial\" font-size=\"20\" fill=\"#183b2c\">Estimate and check</text><rect x=\"14\" y=\"70\" width=\"127\" height=\"105\" rx=\"9\" fill=\"#dceee5\"/><text x=\"22\" y=\"123\" font-family=\"Arial\" font-size=\"16\" fill=\"#203e32\">NOTICE</text><rect x=\"154\" y=\"70\" width=\"127\" height=\"105\" rx=\"9\" fill=\"#e6ecfa\"/><text x=\"162\" y=\"123\" font-family=\"Arial\" font-size=\"16\" fill=\"#203e32\">MODEL</text><rect x=\"294\" y=\"70\" width=\"127\" height=\"105\" rx=\"9\" fill=\"#dceee5\"/><text x=\"302\" y=\"123\" font-family=\"Arial\" font-size=\"16\" fill=\"#203e32\">TRY</text><rect x=\"434\" y=\"70\" width=\"127\" height=\"105\" rx=\"9\" fill=\"#e6ecfa\"/><text x=\"442\" y=\"123\" font-family=\"Arial\" font-size=\"16\" fill=\"#203e32\">CHECK</text></svg>",
      "alt": "Four stages for Estimate First, Check Twice: notice, model, try and check.",
      "caption": "Apply each stage and verify the conclusion."
    }
  ],
  "guided_practice": "**Try 1:** Estimate 264+518 to the nearest hundred: 300+500=800; exact 782, a difference of 18. **Try 2:** Estimate 741−283: 700−300=400; exact 458. **Try 3:** Which is a better nearest-ten estimate for 397+205? 400+210=610; exact 602. Discuss how estimation detects an impossible answer, not just whether estimates equal exact totals.",
  "independent_task": "**Fair supply check.** An organiser orders 376 paper cups and 429 napkins, and a second organiser orders 583 paper plates and 218 forks. For each pair: estimate the sum to nearest hundred; calculate the exact sum using place-value partitioning; explain whether the estimate is close. Correct the false claim that 583+218=1,801. End with one practical reason estimation is useful.",
  "response_prompt": "Write your estimate first, check twice task with steps and one check.",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "Nearest hundred to 487?",
      "options": [
        "400",
        "480",
        "500",
        "490"
      ],
      "correct_index": 2,
      "explanation": "500. Check against the lesson''s original example and calculations or reading evidence."
    },
    {
      "type": "multiple_choice",
      "question": "Nearest hundred to 316?",
      "options": [
        "300",
        "310",
        "320",
        "400"
      ],
      "correct_index": 0,
      "explanation": "300. Check against the lesson''s original example and calculations or reading evidence."
    },
    {
      "type": "multiple_choice",
      "question": "487+316 exactly?",
      "options": [
        "793",
        "803",
        "813",
        "903"
      ],
      "correct_index": 1,
      "explanation": "803. Check against the lesson''s original example and calculations or reading evidence."
    },
    {
      "type": "multiple_choice",
      "question": "487+316 to nearest-hundred estimates?",
      "options": [
        "500+300=800",
        "400+300=700",
        "490+310=800",
        "500+400=900"
      ],
      "correct_index": 0,
      "explanation": "500+300=800. Check against the lesson''s original example and calculations or reading evidence."
    },
    {
      "type": "multiple_choice",
      "question": "Exact total of 376+429?",
      "options": [
        "705",
        "795",
        "805",
        "815"
      ],
      "correct_index": 2,
      "explanation": "805. Check against the lesson''s original example and calculations or reading evidence."
    },
    {
      "type": "multiple_choice",
      "question": "Exact total of 583+218?",
      "options": [
        "801",
        "1,801",
        "791",
        "811"
      ],
      "correct_index": 0,
      "explanation": "801. Check against the lesson''s original example and calculations or reading evidence."
    },
    {
      "type": "multiple_choice",
      "question": "Nearest-hundred estimate for 583+218?",
      "options": [
        "500+200=700",
        "600+200=800",
        "600+300=900",
        "580+220=800"
      ],
      "correct_index": 1,
      "explanation": "600+200=800. Check against the lesson''s original example and calculations or reading evidence."
    },
    {
      "type": "multiple_choice",
      "question": "Why question 1,801 for 583+218?",
      "options": [
        "It is far above the reasonable estimate",
        "Because every sum must end in zero",
        "Because 583 is odd",
        "Because rounding is exact"
      ],
      "correct_index": 0,
      "explanation": "It is far above the reasonable estimate. Check against the lesson''s original example and calculations or reading evidence."
    },
    {
      "type": "short_answer",
      "question": "Complete the estimate first, check twice independent task with accurate work.",
      "sample_answer": "376≈400 and 429≈400, so about 800; exact 376+429=805. 583≈600 and 218≈200, so about 800; exact 583+218=801.",
      "marking_guide": "Check accuracy, coverage of the requested parts and evidence or computations.",
      "explanation": "The response must show the method and results."
    },
    {
      "type": "short_answer",
      "question": "Explain how to check or improve an answer in estimate first, check twice.",
      "sample_answer": "583+218=801, not 1,801. Adding 500+200=700, 80+10=90, and 3+8=11 gives 801. Both sums are close to the rounded estimate.",
      "marking_guide": "Accept a specific correct check supported by the original facts or numbers.",
      "explanation": "Use appropriate evidence to detect errors."
    }
  ],
  "parent_notes": "Parent: Ask the learner to explain and independently complete the topic challenge. Use the original example to check understanding without supplying the answer too early.\n\nParent: **Written answer 1.** 376≈400 and 429≈400, so about 800; exact 376+429=805. 583≈600 and 218≈200, so about 800; exact 583+218=801.\n\nParent: **Written answer 2.** 583+218=801, not 1,801. Adding 500+200=700, 80+10=90, and 3+8=11 gives 801. Both sums are close to the rounded estimate.\n\nParent: Collect the guided and independent evidence. The eight machine-scored questions require 8/8 for the existing 90 percent threshold. Manually review the written answers and verify NESA mapping before approval.",
  "evidence_instructions": "Keep the estimate first, check twice guided practice, independent challenge, correction and two written quiz answers.",
  "offline_alternative": "Read the examples on paper, practise with a pencil and retain a photograph or clear notes for the parent to review.",
  "extension": "Invent and solve a more challenging estimate first, check twice example and explain how you checked it.",
  "stage_hints": {
    "accept": [
      "Read the instructions about Estimate First, Check Twice.",
      "Find a relevant detail in the original example that supports estimate first, check twice.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ],
    "teach0": [
      "Read the instructions about What is an estimate?.",
      "Find a relevant detail in the original example that supports what is an estimate?.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ],
    "teach1": [
      "Read the instructions about Choose how accurately to round.",
      "Find a relevant detail in the original example that supports choose how accurately to round.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ],
    "teach2": [
      "Read the instructions about Calculate the exact result.",
      "Find a relevant detail in the original example that supports calculate the exact result.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ],
    "teach3": [
      "Read the instructions about Spot an unreasonable answer.",
      "Find a relevant detail in the original example that supports spot an unreasonable answer.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ],
    "learn": [
      "Read the instructions about Estimate First, Check Twice.",
      "Find a relevant detail in the original example that supports estimate first, check twice.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ],
    "guided": [
      "Read the instructions about Estimate First, Check Twice.",
      "Find a relevant detail in the original example that supports estimate first, check twice.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ],
    "write": [
      "Read the instructions about Estimate First, Check Twice.",
      "Find a relevant detail in the original example that supports estimate first, check twice.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ],
    "quiz": [
      "Read the instructions about Estimate First, Check Twice.",
      "Find a relevant detail in the original example that supports estimate first, check twice.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ],
    "submit": [
      "Read the instructions about Estimate First, Check Twice.",
      "Find a relevant detail in the original example that supports estimate first, check twice.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ]
  }
}'),updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE seed_key='s2-mat-y3-w04-l2';

-- s2-mat-y3-w04-l3
UPDATE lessons SET title='A Thousand Ways to See One Thousand',data=json_patch(data,'{
  "seed_key": "s2-mat-y3-w04-l3",
  "title": "A Thousand Ways to See One Thousand",
  "stage": "Stage 2",
  "learning_area": "Mathematics",
  "year_level": 3,
  "week": 4,
  "lesson_number": 3,
  "duration_minutes": 60,
  "child_mission": "Investigate a thousand ways to see one thousand, practise the process and complete an original challenge.",
  "learning_intention": "We are learning to use a thousand ways to see one thousand with correct evidence and explanations.",
  "success_criteria": [
    "I can explain the main concept clearly.",
    "I can follow the worked model and explain its steps.",
    "I can complete guided practice and check feedback.",
    "I can answer a new independent challenge.",
    "I can explain one correction using evidence."
  ],
  "materials": [
    "All original examples and text are provided.",
    "Optional pencil and paper for checking."
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
      "title": "Important learning concepts",
      "cards": [
        {
          "front": "Know the value of a thousand",
          "back": "A thousand is ten hundreds, one hundred tens or one thousand ones. The units must stay consistent when you exchange groups."
        },
        {
          "front": "Regroup thousands using place value",
          "back": "Regrouping exchanges groups without changing how many items there are. One hundred is ten tens; one thousand is ten hundreds."
        },
        {
          "front": "Use arrays and equal groups",
          "back": "Multiplication can describe repeated equal groups. Use groups you can check by division and decide whether the proposed number of groups is practical."
        },
        {
          "front": "Check the total and catch extra zeros",
          "back": "A label of ''one thousand'' needs a representation that adds or multiplies to 1,000, not 100 or 10,000. Look closely at place value."
        }
      ]
    }
  ],
  "printable_resource": {
    "title": "A Thousand Ways to See One Thousand",
    "instructions": "Read the example, attempt the guided questions, then complete the independent challenge and check your thinking.",
    "passage": "A community centre receives 1,000 stickers in packets of 100, 10 and single stickers. The organiser wants different ways to show the same total.",
    "prompts": [
      "What do I already know?",
      "What method or evidence will I use?",
      "What is my answer?",
      "How did I check it?"
    ]
  },
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "🔎",
      "title": "Know the value of a thousand",
      "explain": "**Understand the idea.** A thousand is ten hundreds, one hundred tens or one thousand ones. The units must stay consistent when you exchange groups.\n\n**Original example:** A community centre receives 1,000 stickers in packets of 100, 10 and single stickers. The organiser wants different ways to show the same total.\n\n**Why it matters:** Focus on a particular number, step or event to justify your thinking.",
      "example": "**WATCH MY THINKING**\nTen packets of 100 contain 10×100=1,000 stickers. One hundred packets of 10 also contain 1,000.\n\n**PRACTISE WITH SUPPORT**\n**Let''s build 1,000:** 5 groups of 200 = 1,000; 20 groups of 50 = 1,000; 4 groups of 250 = 1,000. **Spot the error:** 20 bags of 5 is only 100, not 1,000. **Your turn:** Would 8 packets of 125 work? Yes: 8×125=1,000. Explain one method without multiplying in your head: double 125 to 250, again to 500, again to 1,000.\n\n**CHECK:** Compare the worked explanation with the principle, and name the correction if a value or detail differs.",
      "notice": "A thousand is ten hundreds, one hundred tens or one thousand ones. The units must stay consistent when you exchange groups.",
      "check": {
        "question": "How many hundreds make 1,000?",
        "options": [
          "5",
          "10",
          "20",
          "100"
        ],
        "correct_index": 1,
        "explanation": "10. Ten packets of 100 contain 10×100=1,000 stickers. One hundred packets of 10 also contain 1,000."
      },
      "visual_before": [
        {
          "episode": {
            "title": "A clue for A Thousand Ways to See One Thousand",
            "transcript": "Pip: I have ten packets of ten stickers. That''s a thousand, right?\nJuno: Count the groups carefully. Ten tens make a hundred, not a thousand.\nPip: A hundred packets of ten would give one thousand.\nJuno: Exactly. Pause and think of another way to make the same total.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "I have ten packets of ten stickers. That''s a thousand, right?"
                  },
                  {
                    "who": "juno",
                    "text": "Count the groups carefully. Ten tens make a hundred, not a thousand."
                  },
                  {
                    "who": "pip",
                    "text": "A hundred packets of ten would give one thousand."
                  },
                  {
                    "who": "juno",
                    "text": "Exactly. Pause and think of another way to make the same total.",
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
      "title": "Regroup thousands using place value",
      "explain": "**Understand the idea.** Regrouping exchanges groups without changing how many items there are. One hundred is ten tens; one thousand is ten hundreds.\n\n**Original example:** A community centre receives 1,000 stickers in packets of 100, 10 and single stickers. The organiser wants different ways to show the same total.\n\n**Why it matters:** Focus on a particular number, step or event to justify your thinking.",
      "example": "**WATCH MY THINKING**\nI draw a thousand as 10 boxes of 100. Replacing one box of 100 with 10 smaller groups of 10 gives 9 hundreds and 10 tens, which still totals 1,000.\n\n**PRACTISE WITH SUPPORT**\n**Let''s build 1,000:** 5 groups of 200 = 1,000; 20 groups of 50 = 1,000; 4 groups of 250 = 1,000. **Spot the error:** 20 bags of 5 is only 100, not 1,000. **Your turn:** Would 8 packets of 125 work? Yes: 8×125=1,000. Explain one method without multiplying in your head: double 125 to 250, again to 500, again to 1,000.\n\n**CHECK:** Compare the worked explanation with the principle, and name the correction if a value or detail differs.",
      "notice": "Regrouping exchanges groups without changing how many items there are. One hundred is ten tens; one thousand is ten hundreds.",
      "check": {
        "question": "How many tens make 1,000?",
        "options": [
          "10",
          "20",
          "100",
          "1,000"
        ],
        "correct_index": 2,
        "explanation": "100. I draw a thousand as 10 boxes of 100. Replacing one box of 100 with 10 smaller groups of 10 gives 9 hundreds and 10 tens, which still totals 1,000."
      }
    },
    {
      "icon": "✏️",
      "title": "Use arrays and equal groups",
      "explain": "**Understand the idea.** Multiplication can describe repeated equal groups. Use groups you can check by division and decide whether the proposed number of groups is practical.\n\n**Original example:** A community centre receives 1,000 stickers in packets of 100, 10 and single stickers. The organiser wants different ways to show the same total.\n\n**Why it matters:** Focus on a particular number, step or event to justify your thinking.",
      "example": "**WATCH MY THINKING**\n25 packets of 40 = 25×4 tens =100 tens=1,000. A hundred rows of ten counters is another representation.\n\n**PRACTISE WITH SUPPORT**\n**Let''s build 1,000:** 5 groups of 200 = 1,000; 20 groups of 50 = 1,000; 4 groups of 250 = 1,000. **Spot the error:** 20 bags of 5 is only 100, not 1,000. **Your turn:** Would 8 packets of 125 work? Yes: 8×125=1,000. Explain one method without multiplying in your head: double 125 to 250, again to 500, again to 1,000.\n\n**CHECK:** Compare the worked explanation with the principle, and name the correction if a value or detail differs.",
      "notice": "Multiplication can describe repeated equal groups. Use groups you can check by division and decide whether the proposed number of groups is practical.",
      "check": {
        "question": "What is 20×50?",
        "options": [
          "100",
          "500",
          "1,000",
          "10,000"
        ],
        "correct_index": 2,
        "explanation": "1,000. 25 packets of 40 = 25×4 tens =100 tens=1,000. A hundred rows of ten counters is another representation."
      }
    },
    {
      "icon": "✅",
      "title": "Check the total and catch extra zeros",
      "explain": "**Understand the idea.** A label of ''one thousand'' needs a representation that adds or multiplies to 1,000, not 100 or 10,000. Look closely at place value.\n\n**Original example:** A community centre receives 1,000 stickers in packets of 100, 10 and single stickers. The organiser wants different ways to show the same total.\n\n**Why it matters:** Focus on a particular number, step or event to justify your thinking.",
      "example": "**WATCH MY THINKING**\nIncorrect: 10 packets of 10 make only 100. Correct: 100 packets of 10 make 1,000. I check with repeated addition or multiplication.\n\n**PRACTISE WITH SUPPORT**\n**Let''s build 1,000:** 5 groups of 200 = 1,000; 20 groups of 50 = 1,000; 4 groups of 250 = 1,000. **Spot the error:** 20 bags of 5 is only 100, not 1,000. **Your turn:** Would 8 packets of 125 work? Yes: 8×125=1,000. Explain one method without multiplying in your head: double 125 to 250, again to 500, again to 1,000.\n\n**CHECK:** Compare the worked explanation with the principle, and name the correction if a value or detail differs.",
      "notice": "A label of ''one thousand'' needs a representation that adds or multiplies to 1,000, not 100 or 10,000. Look closely at place value.",
      "check": {
        "question": "Which equals 1,000?",
        "options": [
          "8×125",
          "8×100",
          "4×200",
          "25×20"
        ],
        "correct_index": 0,
        "explanation": "8×125. Incorrect: 10 packets of 10 make only 100. Correct: 100 packets of 10 make 1,000. I check with repeated addition or multiplication."
      }
    }
  ],
  "worked_example": "## Original teacher model\n\nA community centre receives 1,000 stickers in packets of 100, 10 and single stickers. The organiser wants different ways to show the same total.\n\n**1. Know the value of a thousand:** Ten packets of 100 contain 10×100=1,000 stickers. One hundred packets of 10 also contain 1,000.\n\n**2. Regroup thousands using place value:** I draw a thousand as 10 boxes of 100. Replacing one box of 100 with 10 smaller groups of 10 gives 9 hundreds and 10 tens, which still totals 1,000.\n\n**3. Use arrays and equal groups:** 25 packets of 40 = 25×4 tens =100 tens=1,000. A hundred rows of ten counters is another representation.\n\n**4. Check the total and catch extra zeros:** Incorrect: 10 packets of 10 make only 100. Correct: 100 packets of 10 make 1,000. I check with repeated addition or multiplication.\n\n**Check:** Explain the most important evidence or calculation without looking at the model.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 560 215\"><rect width=\"560\" height=\"215\" rx=\"10\" fill=\"#f4f8f5\"/><text x=\"18\" y=\"33\" font-family=\"Arial\" font-size=\"20\" fill=\"#183b2c\">Build one thousand</text><rect x=\"14\" y=\"70\" width=\"127\" height=\"105\" rx=\"9\" fill=\"#dceee5\"/><text x=\"22\" y=\"123\" font-family=\"Arial\" font-size=\"16\" fill=\"#203e32\">NOTICE</text><rect x=\"154\" y=\"70\" width=\"127\" height=\"105\" rx=\"9\" fill=\"#e6ecfa\"/><text x=\"162\" y=\"123\" font-family=\"Arial\" font-size=\"16\" fill=\"#203e32\">MODEL</text><rect x=\"294\" y=\"70\" width=\"127\" height=\"105\" rx=\"9\" fill=\"#dceee5\"/><text x=\"302\" y=\"123\" font-family=\"Arial\" font-size=\"16\" fill=\"#203e32\">TRY</text><rect x=\"434\" y=\"70\" width=\"127\" height=\"105\" rx=\"9\" fill=\"#e6ecfa\"/><text x=\"442\" y=\"123\" font-family=\"Arial\" font-size=\"16\" fill=\"#203e32\">CHECK</text></svg>",
      "alt": "Four stages for A Thousand Ways to See One Thousand: notice, model, try and check.",
      "caption": "Apply each stage and verify the conclusion."
    }
  ],
  "guided_practice": "**Let''s build 1,000:** 5 groups of 200 = 1,000; 20 groups of 50 = 1,000; 4 groups of 250 = 1,000. **Spot the error:** 20 bags of 5 is only 100, not 1,000. **Your turn:** Would 8 packets of 125 work? Yes: 8×125=1,000. Explain one method without multiplying in your head: double 125 to 250, again to 500, again to 1,000.",
  "independent_task": "**Sticker packing investigation:** A shop needs exactly 1,000 stickers. Design FOUR packaging plans: one using hundreds, one using tens, one using twenty packets, and one using a mixed plan with 6 hundreds and the remainder in tens. Give packet size and packet count or group labels. Prove every plan totals 1,000. Draw a diagram of one plan and explain why 20 packets of 5 do not work.",
  "response_prompt": "Write your a thousand ways to see one thousand task with steps and one check.",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "How many hundreds make 1,000?",
      "options": [
        "5",
        "10",
        "20",
        "100"
      ],
      "correct_index": 1,
      "explanation": "10. Check against the lesson''s original example and calculations or reading evidence."
    },
    {
      "type": "multiple_choice",
      "question": "How many tens make 1,000?",
      "options": [
        "10",
        "20",
        "100",
        "1,000"
      ],
      "correct_index": 2,
      "explanation": "100. Check against the lesson''s original example and calculations or reading evidence."
    },
    {
      "type": "multiple_choice",
      "question": "What is 20×50?",
      "options": [
        "100",
        "500",
        "1,000",
        "10,000"
      ],
      "correct_index": 2,
      "explanation": "1,000. Check against the lesson''s original example and calculations or reading evidence."
    },
    {
      "type": "multiple_choice",
      "question": "Which equals 1,000?",
      "options": [
        "8×125",
        "8×100",
        "4×200",
        "25×20"
      ],
      "correct_index": 0,
      "explanation": "8×125. Check against the lesson''s original example and calculations or reading evidence."
    },
    {
      "type": "multiple_choice",
      "question": "Six hundreds plus how many tens makes 1,000?",
      "options": [
        "4",
        "40",
        "400",
        "60"
      ],
      "correct_index": 1,
      "explanation": "40. Check against the lesson''s original example and calculations or reading evidence."
    },
    {
      "type": "multiple_choice",
      "question": "What is 10 groups of 10?",
      "options": [
        "10",
        "100",
        "1,000",
        "10,000"
      ],
      "correct_index": 1,
      "explanation": "100. Check against the lesson''s original example and calculations or reading evidence."
    },
    {
      "type": "multiple_choice",
      "question": "What is 25×40?",
      "options": [
        "100",
        "400",
        "1,000",
        "1,250"
      ],
      "correct_index": 2,
      "explanation": "1,000. Check against the lesson''s original example and calculations or reading evidence."
    },
    {
      "type": "multiple_choice",
      "question": "Which representation is NOT 1,000?",
      "options": [
        "4×250",
        "5×200",
        "20×5",
        "100×10"
      ],
      "correct_index": 2,
      "explanation": "20×5. Check against the lesson''s original example and calculations or reading evidence."
    },
    {
      "type": "short_answer",
      "question": "Complete the a thousand ways to see one thousand independent task with accurate work.",
      "sample_answer": "10×100=1,000; 100×10=1,000; 20×50=1,000; 6×100+40×10=600+400=1,000. The mixed plan uses 6 hundreds and 40 tens.",
      "marking_guide": "Check accuracy, coverage of the requested parts and evidence or computations.",
      "explanation": "The response must show the method and results."
    },
    {
      "type": "short_answer",
      "question": "Explain how to check or improve an answer in a thousand ways to see one thousand.",
      "sample_answer": "Twenty packets of five give 20×5=100 stickers, not 1,000. To use twenty equal packets, each must hold 50 stickers; 20×50=1,000. I check both the product and units.",
      "marking_guide": "Accept a specific correct check supported by the original facts or numbers.",
      "explanation": "Use appropriate evidence to detect errors."
    }
  ],
  "parent_notes": "Parent: Ask the learner to explain and independently complete the topic challenge. Use the original example to check understanding without supplying the answer too early.\n\nParent: **Written answer 1.** 10×100=1,000; 100×10=1,000; 20×50=1,000; 6×100+40×10=600+400=1,000. The mixed plan uses 6 hundreds and 40 tens.\n\nParent: **Written answer 2.** Twenty packets of five give 20×5=100 stickers, not 1,000. To use twenty equal packets, each must hold 50 stickers; 20×50=1,000. I check both the product and units.\n\nParent: Collect the guided and independent evidence. The eight machine-scored questions require 8/8 for the existing 90 percent threshold. Manually review the written answers and verify NESA mapping before approval.",
  "evidence_instructions": "Keep the a thousand ways to see one thousand guided practice, independent challenge, correction and two written quiz answers.",
  "offline_alternative": "Read the examples on paper, practise with a pencil and retain a photograph or clear notes for the parent to review.",
  "extension": "Invent and solve a more challenging a thousand ways to see one thousand example and explain how you checked it.",
  "stage_hints": {
    "accept": [
      "Read the instructions about A Thousand Ways to See One Thousand.",
      "Find a relevant detail in the original example that supports a thousand ways to see one thousand.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ],
    "teach0": [
      "Read the instructions about Know the value of a thousand.",
      "Find a relevant detail in the original example that supports know the value of a thousand.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ],
    "teach1": [
      "Read the instructions about Regroup thousands using place value.",
      "Find a relevant detail in the original example that supports regroup thousands using place value.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ],
    "teach2": [
      "Read the instructions about Use arrays and equal groups.",
      "Find a relevant detail in the original example that supports use arrays and equal groups.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ],
    "teach3": [
      "Read the instructions about Check the total and catch extra zeros.",
      "Find a relevant detail in the original example that supports check the total and catch extra zeros.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ],
    "learn": [
      "Read the instructions about A Thousand Ways to See One Thousand.",
      "Find a relevant detail in the original example that supports a thousand ways to see one thousand.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ],
    "guided": [
      "Read the instructions about A Thousand Ways to See One Thousand.",
      "Find a relevant detail in the original example that supports a thousand ways to see one thousand.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ],
    "write": [
      "Read the instructions about A Thousand Ways to See One Thousand.",
      "Find a relevant detail in the original example that supports a thousand ways to see one thousand.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ],
    "quiz": [
      "Read the instructions about A Thousand Ways to See One Thousand.",
      "Find a relevant detail in the original example that supports a thousand ways to see one thousand.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ],
    "submit": [
      "Read the instructions about A Thousand Ways to See One Thousand.",
      "Find a relevant detail in the original example that supports a thousand ways to see one thousand.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ]
  }
}'),updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE seed_key='s2-mat-y3-w04-l3';

-- s2-mat-y3-w04-l4
UPDATE lessons SET title='Place-Value Review: Prove Your Answers',data=json_patch(data,'{
  "seed_key": "s2-mat-y3-w04-l4",
  "title": "Place-Value Review: Prove Your Answers",
  "stage": "Stage 2",
  "learning_area": "Mathematics",
  "year_level": 3,
  "week": 4,
  "lesson_number": 4,
  "duration_minutes": 60,
  "child_mission": "Investigate place-value review: prove your answers, practise the process and complete an original challenge.",
  "learning_intention": "We are learning to use place-value review: prove your answers with correct evidence and explanations.",
  "success_criteria": [
    "I can explain the main concept clearly.",
    "I can follow the worked model and explain its steps.",
    "I can complete guided practice and check feedback.",
    "I can answer a new independent challenge.",
    "I can explain one correction using evidence."
  ],
  "materials": [
    "All original examples and text are provided.",
    "Optional pencil and paper for checking."
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
      "title": "Important learning concepts",
      "cards": [
        {
          "front": "Read and expand accurately",
          "back": "Read thousands, hundreds, tens and ones in order. Zeros keep a place. Expanded form gives a way to check the numeral."
        },
        {
          "front": "Sort numbers by place value",
          "back": "Begin comparisons at the greatest place value and move right until digits differ. Place-value reasoning is stronger than guessing from number length."
        },
        {
          "front": "Round and check against benchmarks",
          "back": "For nearest ten, examine the ones digit. For nearest hundred, compare the last two digits to 50 and use the stated half-up convention."
        },
        {
          "front": "Explain a correction rather than guess",
          "back": "When checking, use a second representation: expanded form, number line or comparison of distances. Identify the exact place where an error was made."
        }
      ]
    }
  ],
  "printable_resource": {
    "title": "Place-Value Review: Prove Your Answers",
    "instructions": "Read the example, attempt the guided questions, then complete the independent challenge and check your thinking.",
    "passage": "A museum''s visitor chart shows 3,506, 3,560, 3,650 and 3,605. A visitor must read, compare, round and check the records.",
    "prompts": [
      "What do I already know?",
      "What method or evidence will I use?",
      "What is my answer?",
      "How did I check it?"
    ]
  },
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "🔎",
      "title": "Read and expand accurately",
      "explain": "**Understand the idea.** Read thousands, hundreds, tens and ones in order. Zeros keep a place. Expanded form gives a way to check the numeral.\n\n**Original example:** A museum''s visitor chart shows 3,506, 3,560, 3,650 and 3,605. A visitor must read, compare, round and check the records.\n\n**Why it matters:** Focus on a particular number, step or event to justify your thinking.",
      "example": "**WATCH MY THINKING**\n3,506 is three thousand five hundred and six: 3,000+500+6. It is not 3,056, where the 5 means fifty.\n\n**PRACTISE WITH SUPPORT**\n**Mini-review:** (A) Write 4,072 in words: four thousand and seventy-two. (B) Expand 5,308: 5,000+300+8. (C) Compare 5,083 and 5,380: the latter is greater because it has three hundreds, not zero. (D) Round 5,350 to nearest hundred: 5,400 by the half-up rule. **Challenge:** What if you rounded 5,083 to the nearest ten? It becomes 5,080, not 5,100.\n\n**CHECK:** Compare the worked explanation with the principle, and name the correction if a value or detail differs.",
      "notice": "Read thousands, hundreds, tens and ones in order. Zeros keep a place. Expanded form gives a way to check the numeral.",
      "check": {
        "question": "Expanded 6,304?",
        "options": [
          "6,000+300+4",
          "6,000+30+4",
          "600+300+4",
          "6,000+300+40"
        ],
        "correct_index": 0,
        "explanation": "6,000+300+4. 3,506 is three thousand five hundred and six: 3,000+500+6. It is not 3,056, where the 5 means fifty."
      },
      "visual_before": [
        {
          "episode": {
            "title": "A clue for Place-Value Review: Prove Your Answers",
            "transcript": "Pip: In 3,605, does the six stand for sixty?\nJuno: Look at the positions: thousands, hundreds, tens, ones.\nPip: It means six hundreds. The zero means no tens.\nJuno: Good. Pause and read 3,506 aloud, then compare them. Explain which words or numbers support your answer before continuing.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "In 3,605, does the six stand for sixty?"
                  },
                  {
                    "who": "juno",
                    "text": "Look at the positions: thousands, hundreds, tens, ones."
                  },
                  {
                    "who": "pip",
                    "text": "It means six hundreds. The zero means no tens."
                  },
                  {
                    "who": "juno",
                    "text": "Good. Pause and read 3,506 aloud, then compare them. Explain which words or numbers support your answer before continuing.",
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
      "title": "Sort numbers by place value",
      "explain": "**Understand the idea.** Begin comparisons at the greatest place value and move right until digits differ. Place-value reasoning is stronger than guessing from number length.\n\n**Original example:** A museum''s visitor chart shows 3,506, 3,560, 3,650 and 3,605. A visitor must read, compare, round and check the records.\n\n**Why it matters:** Focus on a particular number, step or event to justify your thinking.",
      "example": "**WATCH MY THINKING**\nAll four have three thousands. Compare hundreds: 3,650 and 3,605 have six hundreds, so they are larger than 3,560 and 3,506. Within each pair compare tens: 3,506<3,560<3,605<3,650.\n\n**PRACTISE WITH SUPPORT**\n**Mini-review:** (A) Write 4,072 in words: four thousand and seventy-two. (B) Expand 5,308: 5,000+300+8. (C) Compare 5,083 and 5,380: the latter is greater because it has three hundreds, not zero. (D) Round 5,350 to nearest hundred: 5,400 by the half-up rule. **Challenge:** What if you rounded 5,083 to the nearest ten? It becomes 5,080, not 5,100.\n\n**CHECK:** Compare the worked explanation with the principle, and name the correction if a value or detail differs.",
      "notice": "Begin comparisons at the greatest place value and move right until digits differ. Place-value reasoning is stronger than guessing from number length.",
      "check": {
        "question": "Smallest of the four audit numbers?",
        "options": [
          "6,034",
          "6,304",
          "6,340",
          "6,403"
        ],
        "correct_index": 0,
        "explanation": "6,034. All four have three thousands. Compare hundreds: 3,650 and 3,605 have six hundreds, so they are larger than 3,560 and 3,506. Within each pair compare tens: 3,506<3,560<3,605<3,650."
      }
    },
    {
      "icon": "✏️",
      "title": "Round and check against benchmarks",
      "explain": "**Understand the idea.** For nearest ten, examine the ones digit. For nearest hundred, compare the last two digits to 50 and use the stated half-up convention.\n\n**Original example:** A museum''s visitor chart shows 3,506, 3,560, 3,650 and 3,605. A visitor must read, compare, round and check the records.\n\n**Why it matters:** Focus on a particular number, step or event to justify your thinking.",
      "example": "**WATCH MY THINKING**\n3,506→3,510 to nearest ten and 3,500 to nearest hundred. 3,650 is midway between 3,600 and 3,700, so it rounds to 3,700 to nearest hundred.\n\n**PRACTISE WITH SUPPORT**\n**Mini-review:** (A) Write 4,072 in words: four thousand and seventy-two. (B) Expand 5,308: 5,000+300+8. (C) Compare 5,083 and 5,380: the latter is greater because it has three hundreds, not zero. (D) Round 5,350 to nearest hundred: 5,400 by the half-up rule. **Challenge:** What if you rounded 5,083 to the nearest ten? It becomes 5,080, not 5,100.\n\n**CHECK:** Compare the worked explanation with the principle, and name the correction if a value or detail differs.",
      "notice": "For nearest ten, examine the ones digit. For nearest hundred, compare the last two digits to 50 and use the stated half-up convention.",
      "check": {
        "question": "Largest of the four audit numbers?",
        "options": [
          "6,034",
          "6,304",
          "6,340",
          "6,403"
        ],
        "correct_index": 3,
        "explanation": "6,403. 3,506→3,510 to nearest ten and 3,500 to nearest hundred. 3,650 is midway between 3,600 and 3,700, so it rounds to 3,700 to nearest hundred."
      }
    },
    {
      "icon": "✅",
      "title": "Explain a correction rather than guess",
      "explain": "**Understand the idea.** When checking, use a second representation: expanded form, number line or comparison of distances. Identify the exact place where an error was made.\n\n**Original example:** A museum''s visitor chart shows 3,506, 3,560, 3,650 and 3,605. A visitor must read, compare, round and check the records.\n\n**Why it matters:** Focus on a particular number, step or event to justify your thinking.",
      "example": "**WATCH MY THINKING**\nIf a classmate says 3,605 has six tens, I show that the 6 is in the hundreds place and the 0 is in tens. Then I verify with 3,000+600+5.\n\n**PRACTISE WITH SUPPORT**\n**Mini-review:** (A) Write 4,072 in words: four thousand and seventy-two. (B) Expand 5,308: 5,000+300+8. (C) Compare 5,083 and 5,380: the latter is greater because it has three hundreds, not zero. (D) Round 5,350 to nearest hundred: 5,400 by the half-up rule. **Challenge:** What if you rounded 5,083 to the nearest ten? It becomes 5,080, not 5,100.\n\n**CHECK:** Compare the worked explanation with the principle, and name the correction if a value or detail differs.",
      "notice": "When checking, use a second representation: expanded form, number line or comparison of distances. Identify the exact place where an error was made.",
      "check": {
        "question": "6,304 to nearest ten?",
        "options": [
          "6,300",
          "6,310",
          "6,400",
          "6,000"
        ],
        "correct_index": 0,
        "explanation": "6,300. If a classmate says 3,605 has six tens, I show that the 6 is in the hundreds place and the 0 is in tens. Then I verify with 3,000+600+5."
      }
    }
  ],
  "worked_example": "## Original teacher model\n\nA museum''s visitor chart shows 3,506, 3,560, 3,650 and 3,605. A visitor must read, compare, round and check the records.\n\n**1. Read and expand accurately:** 3,506 is three thousand five hundred and six: 3,000+500+6. It is not 3,056, where the 5 means fifty.\n\n**2. Sort numbers by place value:** All four have three thousands. Compare hundreds: 3,650 and 3,605 have six hundreds, so they are larger than 3,560 and 3,506. Within each pair compare tens: 3,506<3,560<3,605<3,650.\n\n**3. Round and check against benchmarks:** 3,506→3,510 to nearest ten and 3,500 to nearest hundred. 3,650 is midway between 3,600 and 3,700, so it rounds to 3,700 to nearest hundred.\n\n**4. Explain a correction rather than guess:** If a classmate says 3,605 has six tens, I show that the 6 is in the hundreds place and the 0 is in tens. Then I verify with 3,000+600+5.\n\n**Check:** Explain the most important evidence or calculation without looking at the model.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 560 215\"><rect width=\"560\" height=\"215\" rx=\"10\" fill=\"#f4f8f5\"/><text x=\"18\" y=\"33\" font-family=\"Arial\" font-size=\"20\" fill=\"#183b2c\">Review place value</text><rect x=\"14\" y=\"70\" width=\"127\" height=\"105\" rx=\"9\" fill=\"#dceee5\"/><text x=\"22\" y=\"123\" font-family=\"Arial\" font-size=\"16\" fill=\"#203e32\">NOTICE</text><rect x=\"154\" y=\"70\" width=\"127\" height=\"105\" rx=\"9\" fill=\"#e6ecfa\"/><text x=\"162\" y=\"123\" font-family=\"Arial\" font-size=\"16\" fill=\"#203e32\">MODEL</text><rect x=\"294\" y=\"70\" width=\"127\" height=\"105\" rx=\"9\" fill=\"#dceee5\"/><text x=\"302\" y=\"123\" font-family=\"Arial\" font-size=\"16\" fill=\"#203e32\">TRY</text><rect x=\"434\" y=\"70\" width=\"127\" height=\"105\" rx=\"9\" fill=\"#e6ecfa\"/><text x=\"442\" y=\"123\" font-family=\"Arial\" font-size=\"16\" fill=\"#203e32\">CHECK</text></svg>",
      "alt": "Four stages for Place-Value Review: Prove Your Answers: notice, model, try and check.",
      "caption": "Apply each stage and verify the conclusion."
    }
  ],
  "guided_practice": "**Mini-review:** (A) Write 4,072 in words: four thousand and seventy-two. (B) Expand 5,308: 5,000+300+8. (C) Compare 5,083 and 5,380: the latter is greater because it has three hundreds, not zero. (D) Round 5,350 to nearest hundred: 5,400 by the half-up rule. **Challenge:** What if you rounded 5,083 to the nearest ten? It becomes 5,080, not 5,100.",
  "independent_task": "**Museum audit:** (1) Write 6,304 in words and expanded form. (2) Put 6,034, 6,340, 6,403 and 6,304 in ascending order. (3) Round 6,304 and 6,350 to nearest ten and hundred. (4) Explain why 6,403 is greater than 6,340. (5) Correct this false statement: ''6,304 rounds to 6,400 to nearest hundred.'' Include a concrete check.",
  "response_prompt": "Write your place-value review: prove your answers task with steps and one check.",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "Expanded 6,304?",
      "options": [
        "6,000+300+4",
        "6,000+30+4",
        "600+300+4",
        "6,000+300+40"
      ],
      "correct_index": 0,
      "explanation": "6,000+300+4. Check against the lesson''s original example and calculations or reading evidence."
    },
    {
      "type": "multiple_choice",
      "question": "Smallest of the four audit numbers?",
      "options": [
        "6,034",
        "6,304",
        "6,340",
        "6,403"
      ],
      "correct_index": 0,
      "explanation": "6,034. Check against the lesson''s original example and calculations or reading evidence."
    },
    {
      "type": "multiple_choice",
      "question": "Largest of the four audit numbers?",
      "options": [
        "6,034",
        "6,304",
        "6,340",
        "6,403"
      ],
      "correct_index": 3,
      "explanation": "6,403. Check against the lesson''s original example and calculations or reading evidence."
    },
    {
      "type": "multiple_choice",
      "question": "6,304 to nearest ten?",
      "options": [
        "6,300",
        "6,310",
        "6,400",
        "6,000"
      ],
      "correct_index": 0,
      "explanation": "6,300. Check against the lesson''s original example and calculations or reading evidence."
    },
    {
      "type": "multiple_choice",
      "question": "6,304 to nearest hundred?",
      "options": [
        "6,300",
        "6,400",
        "6,310",
        "6,000"
      ],
      "correct_index": 0,
      "explanation": "6,300. Check against the lesson''s original example and calculations or reading evidence."
    },
    {
      "type": "multiple_choice",
      "question": "6,350 to nearest hundred, half-up?",
      "options": [
        "6,300",
        "6,350",
        "6,400",
        "6,500"
      ],
      "correct_index": 2,
      "explanation": "6,400. Check against the lesson''s original example and calculations or reading evidence."
    },
    {
      "type": "multiple_choice",
      "question": "Which is bigger?",
      "options": [
        "6,340",
        "6,403",
        "Both are equal",
        "Both less than 6,000"
      ],
      "correct_index": 1,
      "explanation": "6,403. Check against the lesson''s original example and calculations or reading evidence."
    },
    {
      "type": "multiple_choice",
      "question": "What value does the 4 have in 6,403?",
      "options": [
        "4",
        "40",
        "400",
        "4,000"
      ],
      "correct_index": 2,
      "explanation": "400. Check against the lesson''s original example and calculations or reading evidence."
    },
    {
      "type": "short_answer",
      "question": "Complete the place-value review: prove your answers independent task with accurate work.",
      "sample_answer": "6,304 = 6,000+300+4: six thousand three hundred and four. Ascending: 6,034; 6,304; 6,340; 6,403. 6,304→6,300 to nearest ten and hundred. 6,350→6,350 nearest ten and 6,400 nearest hundred.",
      "marking_guide": "Check accuracy, coverage of the requested parts and evidence or computations.",
      "explanation": "The response must show the method and results."
    },
    {
      "type": "short_answer",
      "question": "Explain how to check or improve an answer in place-value review: prove your answers.",
      "sample_answer": "6,403 is larger than 6,340 because 4 hundreds are greater than 3 hundreds. The claim that 6,304 rounds to 6,400 is wrong: 6,304 is 4 above 6,300 but 96 below 6,400, so nearest hundred is 6,300.",
      "marking_guide": "Accept a specific correct check supported by the original facts or numbers.",
      "explanation": "Use appropriate evidence to detect errors."
    }
  ],
  "parent_notes": "Parent: Ask the learner to explain and independently complete the topic challenge. Use the original example to check understanding without supplying the answer too early.\n\nParent: **Written answer 1.** 6,304 = 6,000+300+4: six thousand three hundred and four. Ascending: 6,034; 6,304; 6,340; 6,403. 6,304→6,300 to nearest ten and hundred. 6,350→6,350 nearest ten and 6,400 nearest hundred.\n\nParent: **Written answer 2.** 6,403 is larger than 6,340 because 4 hundreds are greater than 3 hundreds. The claim that 6,304 rounds to 6,400 is wrong: 6,304 is 4 above 6,300 but 96 below 6,400, so nearest hundred is 6,300.\n\nParent: Collect the guided and independent evidence. The eight machine-scored questions require 8/8 for the existing 90 percent threshold. Manually review the written answers and verify NESA mapping before approval.",
  "evidence_instructions": "Keep the place-value review: prove your answers guided practice, independent challenge, correction and two written quiz answers.",
  "offline_alternative": "Read the examples on paper, practise with a pencil and retain a photograph or clear notes for the parent to review.",
  "extension": "Invent and solve a more challenging place-value review: prove your answers example and explain how you checked it.",
  "stage_hints": {
    "accept": [
      "Read the instructions about Place-Value Review: Prove Your Answers.",
      "Find a relevant detail in the original example that supports place-value review: prove your answers.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ],
    "teach0": [
      "Read the instructions about Read and expand accurately.",
      "Find a relevant detail in the original example that supports read and expand accurately.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ],
    "teach1": [
      "Read the instructions about Sort numbers by place value.",
      "Find a relevant detail in the original example that supports sort numbers by place value.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ],
    "teach2": [
      "Read the instructions about Round and check against benchmarks.",
      "Find a relevant detail in the original example that supports round and check against benchmarks.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ],
    "teach3": [
      "Read the instructions about Explain a correction rather than guess.",
      "Find a relevant detail in the original example that supports explain a correction rather than guess.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ],
    "learn": [
      "Read the instructions about Place-Value Review: Prove Your Answers.",
      "Find a relevant detail in the original example that supports place-value review: prove your answers.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ],
    "guided": [
      "Read the instructions about Place-Value Review: Prove Your Answers.",
      "Find a relevant detail in the original example that supports place-value review: prove your answers.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ],
    "write": [
      "Read the instructions about Place-Value Review: Prove Your Answers.",
      "Find a relevant detail in the original example that supports place-value review: prove your answers.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ],
    "quiz": [
      "Read the instructions about Place-Value Review: Prove Your Answers.",
      "Find a relevant detail in the original example that supports place-value review: prove your answers.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ],
    "submit": [
      "Read the instructions about Place-Value Review: Prove Your Answers.",
      "Find a relevant detail in the original example that supports place-value review: prove your answers.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ]
  }
}'),updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE seed_key='s2-mat-y3-w04-l4';

-- s2-eng-y3-w05-l1
UPDATE lessons SET title='The Short Version: Summarise a Story',data=json_patch(data,'{
  "seed_key": "s2-eng-y3-w05-l1",
  "title": "The Short Version: Summarise a Story",
  "stage": "Stage 2",
  "learning_area": "English",
  "year_level": 3,
  "week": 5,
  "lesson_number": 1,
  "duration_minutes": 60,
  "child_mission": "Investigate the short version: summarise a story, practise the process and complete an original challenge.",
  "learning_intention": "We are learning to use the short version: summarise a story with correct evidence and explanations.",
  "success_criteria": [
    "I can explain the main concept clearly.",
    "I can follow the worked model and explain its steps.",
    "I can complete guided practice and check feedback.",
    "I can answer a new independent challenge.",
    "I can explain one correction using evidence."
  ],
  "materials": [
    "All original examples and text are provided.",
    "Optional pencil and paper for checking."
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
      "title": "Important learning concepts",
      "cards": [
        {
          "front": "Find the central character and problem",
          "back": "A **summary** is a shorter retelling of the most important information. It names the main character and central problem without including every small detail."
        },
        {
          "front": "Pick events that change the outcome",
          "back": "A summary includes the important steps between the problem and the resolution. Small descriptions may make a full story interesting, but are often unnecessary in a short summary."
        },
        {
          "front": "Use your own words and logical order",
          "back": "A summary normally uses fewer words than the original and preserves event order. Do not copy every sentence or add events that aren''t stated."
        },
        {
          "front": "Check for accuracy and concision",
          "back": "Read the original and your summary side by side. Ask: Did I mention the key problem and resolution? Did I add an unsupported claim or over-explain a small detail?"
        }
      ]
    }
  ],
  "printable_resource": {
    "title": "The Short Version: Summarise a Story",
    "instructions": "Read the example, attempt the guided questions, then complete the independent challenge and check your thinking.",
    "passage": "After breakfast, Sana carried a model boat to the creek. A sudden gust blew the sail away. Sana spotted it caught in low branches, used a long stick to lift it free, and reattached it. The boat floated across the creek.",
    "prompts": [
      "What do I already know?",
      "What method or evidence will I use?",
      "What is my answer?",
      "How did I check it?"
    ]
  },
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "🔎",
      "title": "Find the central character and problem",
      "explain": "**Understand the idea.** A **summary** is a shorter retelling of the most important information. It names the main character and central problem without including every small detail.\n\n**Original example:** After breakfast, Sana carried a model boat to the creek. A sudden gust blew the sail away. Sana spotted it caught in low branches, used a long stick to lift it free, and reattached it. The boat floated across the creek.\n\n**Why it matters:** Focus on a particular number, step or event to justify your thinking.",
      "example": "**WATCH MY THINKING**\nI name Sana as the main character and the missing sail as the problem. The exact breakfast time is not needed to understand what went wrong.\n\n**PRACTISE WITH SUPPORT**\n**Guided story:** ''On the way to the market, Eli dropped a bag of apples. Two rolled beneath a bench. Eli found them, wiped them clean with a cloth and put them back in the bag. The stallholder helped carry the bag to the table.'' First identify character (Eli), problem (apples dropped), important actions (retrieved apples, returned them) and result (bag reaches stall). **Model summary:** ''Eli dropped some apples on the way to the market. After gathering them, Eli and the stallholder carried the bag to the stall.'' Explain why the bench''s colour would be unnecessary.\n\n**CHECK:** Compare the worked explanation with the principle, and name the correction if a value or detail differs.",
      "notice": "A **summary** is a shorter retelling of the most important information. It names the main character and central problem without including every small detail.",
      "check": {
        "question": "Who is the main character of the library story?",
        "options": [
          "The librarian",
          "Anika",
          "A tourist",
          "The poster"
        ],
        "correct_index": 1,
        "explanation": "Anika. I name Sana as the main character and the missing sail as the problem. The exact breakfast time is not needed to understand what went wrong."
      },
      "visual_before": [
        {
          "episode": {
            "title": "A clue for The Short Version: Summarise a Story",
            "transcript": "Pip: Sana went to the creek after breakfast with a model boat. Should my summary include every detail?\nJuno: Keep the central problem and how Sana solved it. Small details can be left out.\nPip: The sail blew away, Sana found it and reattached it.\nJuno: Good. Pause and add how the story ended in one short sentence.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "Sana went to the creek after breakfast with a model boat. Should my summary include every detail?"
                  },
                  {
                    "who": "juno",
                    "text": "Keep the central problem and how Sana solved it. Small details can be left out."
                  },
                  {
                    "who": "pip",
                    "text": "The sail blew away, Sana found it and reattached it."
                  },
                  {
                    "who": "juno",
                    "text": "Good. Pause and add how the story ended in one short sentence.",
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
      "title": "Pick events that change the outcome",
      "explain": "**Understand the idea.** A summary includes the important steps between the problem and the resolution. Small descriptions may make a full story interesting, but are often unnecessary in a short summary.\n\n**Original example:** After breakfast, Sana carried a model boat to the creek. A sudden gust blew the sail away. Sana spotted it caught in low branches, used a long stick to lift it free, and reattached it. The boat floated across the creek.\n\n**Why it matters:** Focus on a particular number, step or event to justify your thinking.",
      "example": "**WATCH MY THINKING**\nI keep that Sana found the sail in branches and retrieved it with a stick. I can leave out the exact shape of the branches because it does not change the outcome.\n\n**PRACTISE WITH SUPPORT**\n**Guided story:** ''On the way to the market, Eli dropped a bag of apples. Two rolled beneath a bench. Eli found them, wiped them clean with a cloth and put them back in the bag. The stallholder helped carry the bag to the table.'' First identify character (Eli), problem (apples dropped), important actions (retrieved apples, returned them) and result (bag reaches stall). **Model summary:** ''Eli dropped some apples on the way to the market. After gathering them, Eli and the stallholder carried the bag to the stall.'' Explain why the bench''s colour would be unnecessary.\n\n**CHECK:** Compare the worked explanation with the principle, and name the correction if a value or detail differs.",
      "notice": "A summary includes the important steps between the problem and the resolution. Small descriptions may make a full story interesting, but are often unnecessary in a short summary.",
      "check": {
        "question": "What is the central problem?",
        "options": [
          "The library closes.",
          "The poster slips behind a shelf when its tape tears.",
          "The club moves to a new city.",
          "Anika forgets how to read."
        ],
        "correct_index": 1,
        "explanation": "The poster slips behind a shelf when its tape tears.. I keep that Sana found the sail in branches and retrieved it with a stick. I can leave out the exact shape of the branches because it does not change the outcome."
      }
    },
    {
      "icon": "✏️",
      "title": "Use your own words and logical order",
      "explain": "**Understand the idea.** A summary normally uses fewer words than the original and preserves event order. Do not copy every sentence or add events that aren''t stated.\n\n**Original example:** After breakfast, Sana carried a model boat to the creek. A sudden gust blew the sail away. Sana spotted it caught in low branches, used a long stick to lift it free, and reattached it. The boat floated across the creek.\n\n**Why it matters:** Focus on a particular number, step or event to justify your thinking.",
      "example": "**WATCH MY THINKING**\nI write: ''Sana''s model-boat sail blew away. She found it in a tree, retrieved it and attached it again.'' This uses my own wording and keeps cause and effect.\n\n**PRACTISE WITH SUPPORT**\n**Guided story:** ''On the way to the market, Eli dropped a bag of apples. Two rolled beneath a bench. Eli found them, wiped them clean with a cloth and put them back in the bag. The stallholder helped carry the bag to the table.'' First identify character (Eli), problem (apples dropped), important actions (retrieved apples, returned them) and result (bag reaches stall). **Model summary:** ''Eli dropped some apples on the way to the market. After gathering them, Eli and the stallholder carried the bag to the stall.'' Explain why the bench''s colour would be unnecessary.\n\n**CHECK:** Compare the worked explanation with the principle, and name the correction if a value or detail differs.",
      "notice": "A summary normally uses fewer words than the original and preserves event order. Do not copy every sentence or add events that aren''t stated.",
      "check": {
        "question": "Which event is important in a summary?",
        "options": [
          "The trolley is moved so Anika can reach the poster.",
          "The poster has four corners.",
          "The building has a floor.",
          "The day has an afternoon."
        ],
        "correct_index": 0,
        "explanation": "The trolley is moved so Anika can reach the poster.. I write: ''Sana''s model-boat sail blew away. She found it in a tree, retrieved it and attached it again.'' This uses my own wording and keeps cause and effect."
      }
    },
    {
      "icon": "✅",
      "title": "Check for accuracy and concision",
      "explain": "**Understand the idea.** Read the original and your summary side by side. Ask: Did I mention the key problem and resolution? Did I add an unsupported claim or over-explain a small detail?\n\n**Original example:** After breakfast, Sana carried a model boat to the creek. A sudden gust blew the sail away. Sana spotted it caught in low branches, used a long stick to lift it free, and reattached it. The boat floated across the creek.\n\n**Why it matters:** Focus on a particular number, step or event to justify your thinking.",
      "example": "**WATCH MY THINKING**\nI add that the boat floated again because this closes the problem. I do not say someone stole the sail; the story says the wind blew it away.\n\n**PRACTISE WITH SUPPORT**\n**Guided story:** ''On the way to the market, Eli dropped a bag of apples. Two rolled beneath a bench. Eli found them, wiped them clean with a cloth and put them back in the bag. The stallholder helped carry the bag to the table.'' First identify character (Eli), problem (apples dropped), important actions (retrieved apples, returned them) and result (bag reaches stall). **Model summary:** ''Eli dropped some apples on the way to the market. After gathering them, Eli and the stallholder carried the bag to the stall.'' Explain why the bench''s colour would be unnecessary.\n\n**CHECK:** Compare the worked explanation with the principle, and name the correction if a value or detail differs.",
      "notice": "Read the original and your summary side by side. Ask: Did I mention the key problem and resolution? Did I add an unsupported claim or over-explain a small detail?",
      "check": {
        "question": "Which is an unnecessary detail for a short summary?",
        "options": [
          "Anika loses access to the poster.",
          "She gets help retrieving it.",
          "The story occurs on Tuesday afternoon.",
          "She displays it successfully."
        ],
        "correct_index": 2,
        "explanation": "The story occurs on Tuesday afternoon.. I add that the boat floated again because this closes the problem. I do not say someone stole the sail; the story says the wind blew it away."
      }
    }
  ],
  "worked_example": "## Original teacher model\n\nAfter breakfast, Sana carried a model boat to the creek. A sudden gust blew the sail away. Sana spotted it caught in low branches, used a long stick to lift it free, and reattached it. The boat floated across the creek.\n\n**1. Find the central character and problem:** I name Sana as the main character and the missing sail as the problem. The exact breakfast time is not needed to understand what went wrong.\n\n**2. Pick events that change the outcome:** I keep that Sana found the sail in branches and retrieved it with a stick. I can leave out the exact shape of the branches because it does not change the outcome.\n\n**3. Use your own words and logical order:** I write: ''Sana''s model-boat sail blew away. She found it in a tree, retrieved it and attached it again.'' This uses my own wording and keeps cause and effect.\n\n**4. Check for accuracy and concision:** I add that the boat floated again because this closes the problem. I do not say someone stole the sail; the story says the wind blew it away.\n\n**Check:** Explain the most important evidence or calculation without looking at the model.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 560 215\"><rect width=\"560\" height=\"215\" rx=\"10\" fill=\"#f4f8f5\"/><text x=\"18\" y=\"33\" font-family=\"Arial\" font-size=\"20\" fill=\"#183b2c\">Summarise a story</text><rect x=\"14\" y=\"70\" width=\"127\" height=\"105\" rx=\"9\" fill=\"#dceee5\"/><text x=\"22\" y=\"123\" font-family=\"Arial\" font-size=\"16\" fill=\"#203e32\">NOTICE</text><rect x=\"154\" y=\"70\" width=\"127\" height=\"105\" rx=\"9\" fill=\"#e6ecfa\"/><text x=\"162\" y=\"123\" font-family=\"Arial\" font-size=\"16\" fill=\"#203e32\">MODEL</text><rect x=\"294\" y=\"70\" width=\"127\" height=\"105\" rx=\"9\" fill=\"#dceee5\"/><text x=\"302\" y=\"123\" font-family=\"Arial\" font-size=\"16\" fill=\"#203e32\">TRY</text><rect x=\"434\" y=\"70\" width=\"127\" height=\"105\" rx=\"9\" fill=\"#e6ecfa\"/><text x=\"442\" y=\"123\" font-family=\"Arial\" font-size=\"16\" fill=\"#203e32\">CHECK</text></svg>",
      "alt": "Four stages for The Short Version: Summarise a Story: notice, model, try and check.",
      "caption": "Apply each stage and verify the conclusion."
    }
  ],
  "guided_practice": "**Guided story:** ''On the way to the market, Eli dropped a bag of apples. Two rolled beneath a bench. Eli found them, wiped them clean with a cloth and put them back in the bag. The stallholder helped carry the bag to the table.'' First identify character (Eli), problem (apples dropped), important actions (retrieved apples, returned them) and result (bag reaches stall). **Model summary:** ''Eli dropped some apples on the way to the market. After gathering them, Eli and the stallholder carried the bag to the stall.'' Explain why the bench''s colour would be unnecessary.",
  "independent_task": "**Independent story summary:** Read: ''On Tuesday afternoon, Anika arrived at the community library with a poster for the reading club. While she unpacked, the poster''s tape tore and it slipped behind a shelf. Anika asked the librarian for help, and together they moved a small trolley aside so she could reach it. She attached fresh tape and displayed the poster by the entrance before the club began.'' Write a 2–3 sentence summary in your own words including Anika, the problem, important action and result. Underline the main event and cross out one unnecessary detail from your planning notes. Explain why you omitted it.",
  "response_prompt": "Write your the short version: summarise a story task with steps and one check.",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "Who is the main character of the library story?",
      "options": [
        "The librarian",
        "Anika",
        "A tourist",
        "The poster"
      ],
      "correct_index": 1,
      "explanation": "Anika. Check against the lesson''s original example and calculations or reading evidence."
    },
    {
      "type": "multiple_choice",
      "question": "What is the central problem?",
      "options": [
        "The library closes.",
        "The poster slips behind a shelf when its tape tears.",
        "The club moves to a new city.",
        "Anika forgets how to read."
      ],
      "correct_index": 1,
      "explanation": "The poster slips behind a shelf when its tape tears.. Check against the lesson''s original example and calculations or reading evidence."
    },
    {
      "type": "multiple_choice",
      "question": "Which event is important in a summary?",
      "options": [
        "The trolley is moved so Anika can reach the poster.",
        "The poster has four corners.",
        "The building has a floor.",
        "The day has an afternoon."
      ],
      "correct_index": 0,
      "explanation": "The trolley is moved so Anika can reach the poster.. Check against the lesson''s original example and calculations or reading evidence."
    },
    {
      "type": "multiple_choice",
      "question": "Which is an unnecessary detail for a short summary?",
      "options": [
        "Anika loses access to the poster.",
        "She gets help retrieving it.",
        "The story occurs on Tuesday afternoon.",
        "She displays it successfully."
      ],
      "correct_index": 2,
      "explanation": "The story occurs on Tuesday afternoon.. Check against the lesson''s original example and calculations or reading evidence."
    },
    {
      "type": "multiple_choice",
      "question": "Which ending resolves the problem?",
      "options": [
        "The poster is displayed by the entrance.",
        "The tape tears again forever.",
        "Anika goes to an unrelated shop.",
        "The club is cancelled without reason."
      ],
      "correct_index": 0,
      "explanation": "The poster is displayed by the entrance.. Check against the lesson''s original example and calculations or reading evidence."
    },
    {
      "type": "multiple_choice",
      "question": "What does ''in your own words'' mean?",
      "options": [
        "Copy the text exactly.",
        "Keep meaning but choose your own phrasing.",
        "Add an invented villain.",
        "Change the ending."
      ],
      "correct_index": 1,
      "explanation": "Keep meaning but choose your own phrasing.. Check against the lesson''s original example and calculations or reading evidence."
    },
    {
      "type": "multiple_choice",
      "question": "Which is the strongest short summary?",
      "options": [
        "Anika''s poster slipped behind a shelf, so she and the librarian retrieved and displayed it.",
        "A poster had tape and a day happened.",
        "The librarian stole the poster.",
        "Anika read every book in the library."
      ],
      "correct_index": 0,
      "explanation": "Anika''s poster slipped behind a shelf, so she and the librarian retrieved and displayed it.. Check against the lesson''s original example and calculations or reading evidence."
    },
    {
      "type": "multiple_choice",
      "question": "What must a summary avoid?",
      "options": [
        "The central problem",
        "Important events",
        "Unsupported invented details",
        "A sensible ending"
      ],
      "correct_index": 2,
      "explanation": "Unsupported invented details. Check against the lesson''s original example and calculations or reading evidence."
    },
    {
      "type": "short_answer",
      "question": "Complete the the short version: summarise a story independent task with accurate work.",
      "sample_answer": "Anika''s poster slipped behind a shelf when its tape tore. She and the librarian moved a trolley, retrieved the poster and displayed it with fresh tape before the reading club began.",
      "marking_guide": "Check accuracy, coverage of the requested parts and evidence or computations.",
      "explanation": "The response must show the method and results."
    },
    {
      "type": "short_answer",
      "question": "Explain how to check or improve an answer in the short version: summarise a story.",
      "sample_answer": "I kept the poster problem and how Anika solved it, because those events connect. I left out Tuesday afternoon because it does not explain why the poster fell or how Anika fixed it. I did not invent a thief.",
      "marking_guide": "Accept a specific correct check supported by the original facts or numbers.",
      "explanation": "Use appropriate evidence to detect errors."
    }
  ],
  "parent_notes": "Parent: Ask the learner to explain and independently complete the topic challenge. Use the original example to check understanding without supplying the answer too early.\n\nParent: **Written answer 1.** Anika''s poster slipped behind a shelf when its tape tore. She and the librarian moved a trolley, retrieved the poster and displayed it with fresh tape before the reading club began.\n\nParent: **Written answer 2.** I kept the poster problem and how Anika solved it, because those events connect. I left out Tuesday afternoon because it does not explain why the poster fell or how Anika fixed it. I did not invent a thief.\n\nParent: Collect the guided and independent evidence. The eight machine-scored questions require 8/8 for the existing 90 percent threshold. Manually review the written answers and verify NESA mapping before approval.",
  "evidence_instructions": "Keep the the short version: summarise a story guided practice, independent challenge, correction and two written quiz answers.",
  "offline_alternative": "Read the examples on paper, practise with a pencil and retain a photograph or clear notes for the parent to review.",
  "extension": "Invent and solve a more challenging the short version: summarise a story example and explain how you checked it.",
  "stage_hints": {
    "accept": [
      "Read the instructions about The Short Version: Summarise a Story.",
      "Find a relevant detail in the original example that supports the short version: summarise a story.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ],
    "teach0": [
      "Read the instructions about Find the central character and problem.",
      "Find a relevant detail in the original example that supports find the central character and problem.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ],
    "teach1": [
      "Read the instructions about Pick events that change the outcome.",
      "Find a relevant detail in the original example that supports pick events that change the outcome.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ],
    "teach2": [
      "Read the instructions about Use your own words and logical order.",
      "Find a relevant detail in the original example that supports use your own words and logical order.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ],
    "teach3": [
      "Read the instructions about Check for accuracy and concision.",
      "Find a relevant detail in the original example that supports check for accuracy and concision.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ],
    "learn": [
      "Read the instructions about The Short Version: Summarise a Story.",
      "Find a relevant detail in the original example that supports the short version: summarise a story.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ],
    "guided": [
      "Read the instructions about The Short Version: Summarise a Story.",
      "Find a relevant detail in the original example that supports the short version: summarise a story.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ],
    "write": [
      "Read the instructions about The Short Version: Summarise a Story.",
      "Find a relevant detail in the original example that supports the short version: summarise a story.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ],
    "quiz": [
      "Read the instructions about The Short Version: Summarise a Story.",
      "Find a relevant detail in the original example that supports the short version: summarise a story.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ],
    "submit": [
      "Read the instructions about The Short Version: Summarise a Story.",
      "Find a relevant detail in the original example that supports the short version: summarise a story.",
      "Explain how your evidence or working leads to a specific answer and check one likely error."
    ]
  }
}'),updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE seed_key='s2-eng-y3-w05-l1';
