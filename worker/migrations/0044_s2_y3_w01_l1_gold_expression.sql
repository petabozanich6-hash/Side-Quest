-- Standard v2 gold lesson. One UPDATE; preserves row IDs, assignments and ownership.
-- Migration 0043 is reserved by PR #95. Requires the frontend changes in this PR.
-- Complete arrays supplied; obsolete lesson fields removed via JSON merge-patch nulls.
UPDATE lessons
SET title = 'Reading with expression: The Voice Detective',
    data = json_patch(data, '{
  "title": "Reading with expression: The Voice Detective",
  "seed_key": "s2-eng-y3-w01-l1",
  "stage": "Stage 2",
  "learning_area": "English",
  "year_level": 3,
  "week": 1,
  "lesson_number": 1,
  "child_mission": "Become a Voice Detective! Use clues in a short story to choose how your voice sounds, then read it twice to make the meaning clearer.",
  "learning_intention": "We are learning to read aloud with expression so a listener can follow the meaning and feelings.",
  "success_criteria": [
    "I can use the words to decide how a character feels.",
    "I can pause and keep meaningful groups of words together.",
    "I can change my pace, volume or pitch to match the meaning.",
    "I can stress an important word without shouting.",
    "I can reread a passage and explain one improvement."
  ],
  "materials": [
    "Nothing special for the typed task",
    "Optional: paper and a pencil for marking the passage"
  ],
  "duration_minutes": 55,
  "outcome_codes": [
    "EN2-REFLU-01"
  ],
  "review_status": "unreviewed",
  "pass": 1,
  "pass_mark": 0.9,
  "teach_steps": [
    {
      "icon": "🔎",
      "title": "Find the meaning first",
      "explain": "Reading with **expression** means using your voice to show what the words mean. First, read the whole sentence quietly. Look for clues about what happens and how someone feels.\n\nRead the words accurately before changing your voice. If a word stops you, slow down, work through its sounds and reread the sentence. You can practise one line at a time.",
      "example": "“My kite is stuck,” said Ava sadly.\n\nThe word sadly tells me Ava feels unhappy. I read her words in a gentle, disappointed voice. I still say each word clearly.",
      "notice": "A common mistake is choosing an excited voice just because the story has a kite. Use the actual words as clues.",
      "check": {
        "question": "“I missed the bus,” said Sam sadly. Which reading fits the clue sadly?",
        "options": [
          "A cheering voice",
          "A gentle, disappointed voice",
          "A laughing voice",
          "A loud, excited voice"
        ],
        "correct_index": 1,
        "explanation": "Sadly tells us Sam feels unhappy. A gentle, disappointed voice matches that clue; cheering, laughing and excitement do not."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Find the feeling: a voice clue",
            "transcript": "Pip: The line says: My kite is stuck, said Ava sadly. Should I sound excited?\nJuno: Look at sadly. Ava feels disappointed. Let the clue guide your voice.\nPip: I will try a gentle voice and keep every word clear.\nJuno: Pause here. Say the line with a voice that fits the feeling.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "The line says: My kite is stuck, said Ava sadly. Should I sound excited?"
                  },
                  {
                    "who": "juno",
                    "text": "Look at sadly. Ava feels disappointed. Let the clue guide your voice."
                  },
                  {
                    "who": "pip",
                    "text": "I will try a gentle voice and keep every word clear."
                  },
                  {
                    "who": "juno",
                    "text": "Pause here. Say the line with a voice that fits the feeling.",
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
      "icon": "⏸️",
      "title": "Pause without breaking the meaning",
      "explain": "A **pause** is a brief stop in your voice. A full stop usually marks the end of a thought, so pause before the next sentence. A comma can suggest a smaller pause. Use the meaning too.\n\nKeep words that belong together in a **phrase**, or meaningful group. Do not stop after every word. In our practice marks, / means a small pause and // means a sentence-end pause. These marks help you practise; they are not new punctuation.",
      "example": "After lunch, / Ava looked up. // Her kite was caught in a tree. //\n\nI keep After lunch together. I pause briefly after the comma and a little longer after each full stop. I keep caught in a tree together.",
      "notice": "A common mistake is reading “Her / kite / was / caught”. Join the words into a thought instead. A pause is brief, not a long wait.",
      "check": {
        "question": "Which marked reading keeps words together and pauses at the sentence end?",
        "options": [
          "The / kite / fell.",
          "The kite / fell / .",
          "The kite fell. //",
          "The // kite fell."
        ],
        "correct_index": 2,
        "explanation": "The kite fell is one short thought. Reading it together and pausing after the full stop keeps the meaning clear. The other choices break that thought apart."
      },
      "visual": [
        {
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 220\"><rect width=\"420\" height=\"220\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">After lunch, / Ava looked up. //</text><text x=\"16\" y=\"80\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">Keep each group together.</text><text x=\"16\" y=\"126\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">/ small pause</text><text x=\"16\" y=\"172\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">// sentence-end pause</text></svg>",
          "alt": "A marked sentence: After lunch, small pause, Ava looked up, sentence-end pause. Each group is read together.",
          "caption": "Use the meaning and punctuation to choose brief pauses."
        }
      ]
    },
    {
      "icon": "🎚️",
      "title": "Choose a voice that fits",
      "explain": "**Pace** is how fast you read. **Volume** is how loud or quiet your voice is. **Pitch** is how high or low it sounds. Change one tool at a time and notice what it does.\n\nA careful moment can use a slower pace. A whispered line can use a quieter volume, still clear enough to hear. A question can use a questioning voice. Your pitch may rise on some questions, but not every question ends the same way. Choose from the meaning, not just the punctuation.",
      "example": "“Is it slipping?” Ava asked.\n\nI try a questioning voice because Ava wants to know.\n\n“Wait,” whispered Ben.\n\nI make Ben’s line quieter because whispered is my clue. I do not rush or mumble.",
      "notice": "An exclamation mark shows strong feeling, but it does not always mean shout. Choose a comfortable voice that fits the words.",
      "check": {
        "question": "“Stay here,” whispered Jo. Which volume fits the word whispered?",
        "options": [
          "Quieter, but still clear",
          "As loud as you can",
          "Louder on every word",
          "Too quiet to hear any words"
        ],
        "correct_index": 0,
        "explanation": "Whispered suggests a quieter voice. Keeping it clear lets a listener understand. Shouting does not fit the clue, and a voice nobody can hear loses the meaning."
      },
      "visual": [
        {
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 220\"><rect width=\"420\" height=\"220\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">Pace = fast or slow</text><text x=\"16\" y=\"80\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">Volume = loud or quiet</text><text x=\"16\" y=\"126\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">Pitch = high or low</text><text x=\"16\" y=\"172\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">Choose from the words.</text></svg>",
          "alt": "Three voice tools: pace means fast or slow; volume means loud or quiet; pitch means high or low.",
          "caption": "Change one voice tool at a time."
        }
      ]
    },
    {
      "icon": "⭐",
      "title": "Stress a word, then reread",
      "explain": "**Stress** means giving an important word a little extra emphasis. You might say it slightly more firmly or slowly. Stress is not the same as shouting.\n\nRead a line once. Then ask, “Did my voice show the meaning?” Choose one change and reread. Keep the words accurate. If a voice choice hides a word, make the word clearer.",
      "example": "The kite is safe NOW.\n\nI stress now because the kite was in trouble before but is safe at this moment. The capitals only show my practice emphasis.\n\nFirst try: I rush and swallow the word safe.\nSecond try: I slow down and say safe clearly. The listener can follow the change.",
      "notice": "Do not stress every word. Choose one that matters, then reread to check whether it helps.",
      "check": {
        "question": "What is a useful way to improve a rushed first reading?",
        "options": [
          "Add words that are not there",
          "Shout every word",
          "Skip the difficult words",
          "Slow down and read the same words clearly"
        ],
        "correct_index": 3,
        "explanation": "Slowing down and keeping the same words helps the listener understand accurately. Adding or skipping words changes the text, and shouting does not fix rushed reading."
      },
      "visual_before": [
        {
          "episode": {
            "title": "One change makes it clearer",
            "transcript": "Pip: My first reading was rushed. The listener missed a word.\nJuno: Choose one change. Try a slower pace, keeping all the words.\nPip: I will reread carefully. I can stress one important word without shouting.\nJuno: Pause here. Read a short line twice. What became clearer?",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "My first reading was rushed. The listener missed a word."
                  },
                  {
                    "who": "juno",
                    "text": "Choose one change. Try a slower pace, keeping all the words."
                  },
                  {
                    "who": "pip",
                    "text": "I will reread carefully. I can stress one important word without shouting."
                  },
                  {
                    "who": "juno",
                    "text": "Pause here. Read a short line twice. What became clearer?",
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
  "worked_example": "MODEL STORY: A kite rescue\nAfter lunch, Ava looked up. “My kite is stuck,” she said sadly.\nBen held the branch steady. “Pull gently,” he whispered.\nAva tugged the string. The kite slipped free.\n“It is safe now!” Ava cheered.\n\nMY READING PLAN\n1. Meaning: Ava is disappointed at first, then relieved and excited. Sadly and cheered are clues.\n2. Pauses: After lunch, / Ava looked up. // I keep each phrase together and pause at the sentence ends. I do not stop after every word.\n3. Voice: I use a gentle voice for Ava’s first line. I read Ben’s whispered line quietly but clearly. Ava’s last line sounds pleased, without shouting.\n4. Stress and reread: I give now a little extra emphasis because the kite is safe at this moment. I reread, keeping all the words clear.\n\nCOMMON MISTAKE AND FIX\nMy first try rushed “The kite slipped free” and made free hard to hear. I slowed down and reread the same sentence. The words were clearer. Expression helps meaning; it should not hide the words.\n\nNow read the unmarked story aloud. Then try my plan. You can make another sensible choice if the story gives you a reason.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 266\"><rect width=\"420\" height=\"266\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">Read → Choose → Try → Reread</text><text x=\"16\" y=\"80\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">1. Find a clue in the words.</text><text x=\"16\" y=\"126\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">2. Choose one voice tool.</text><text x=\"16\" y=\"172\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">3. Say every word clearly.</text><text x=\"16\" y=\"218\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">4. Make one improvement.</text></svg>",
      "alt": "A reading method: read, choose, try and reread. Find a clue, choose a voice tool, say every word clearly and make one improvement.",
      "caption": "Use this method for the whole story."
    }
  ],
  "interactive_activities": [
    {
      "type": "flip_cards",
      "title": "Keep your voice tools handy",
      "cards": [
        {
          "front": "Expression",
          "back": "Using your voice to show the meaning and feelings in the words."
        },
        {
          "front": "Pause and phrase",
          "back": "Stop briefly where meaning and punctuation suggest. Keep a meaningful group of words together."
        },
        {
          "front": "Pace, volume and pitch",
          "back": "Pace: fast or slow. Volume: loud or quiet. Pitch: high or low."
        },
        {
          "front": "Stress and reread",
          "back": "Give one important word extra emphasis. Read again and improve one thing."
        }
      ]
    }
  ],
  "guided_practice": "Try this line with help from the lesson:\n“Wait,” whispered Ben. “The string is caught.”\n\n1. Find the clue. Whispered tells you about Ben’s voice. Say what it suggests before you read.\n2. Try the first line. Keep the word Wait clear. Pause at the end of that spoken sentence.\n3. Read the second sentence as one thought. Try emphasising string, because that is the thing that is caught.\n4. Read both lines again. Ask yourself whether every word was clear. Change only one thing if it was rushed or too quiet.\n\nYou can say your thinking aloud or jot it on paper. There is more than one sensible reading. Use the words to explain your choice.\n\nNeed a starting sentence? “The clue I noticed is ____. I will change my ____ because ____.”",
  "independent_task": "Your Voice Detective task (about 20 minutes)\n\nRead this original story:\nAt the park, Mila held her paper boat. “Will it float?” she asked.\nShe set it in a puddle. The boat tipped.\n“Wait,” she whispered. Mila watched carefully.\nThe boat stayed upright. “It is floating now!” she cheered.\n\n1. Read the story quietly. Work through any unfamiliar word, then reread its sentence. Upright means standing up rather than lying on its side.\n2. Choose two brief pause places. On paper, mark / or //. In the text box, copy the two short phrases or sentences and add the marks. Keep meaningful word groups together.\n3. Choose two voice changes. For each, write or say the clue, the voice tool and your reason. Use “I will change my ____ because the words ____ show ____.”\n4. Choose one word to stress. Write the word and why it matters here.\n5. Read the whole story aloud twice. After the first try, choose one improvement. Make that change in the second reading. You can practise alone; a recording is optional.\n6. In the big text box, type your pause choices, two voice choices, stress choice and one improvement. If you worked on paper, type a short summary of those choices and keep the paper for a grown-up to review. You do not need an upload to finish.\n\nBefore moving on, check: I kept the story’s words accurate; I used clues to explain my choices; I kept phrases together; I made one improvement. Answer the reflection question in the smaller box.",
  "response_prompt": "Which change in your second reading helped the meaning, and how?",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "What does reading with expression do?",
      "options": [
        "It uses the voice to show meaning and feeling",
        "It changes the story’s words",
        "It makes every line as loud as possible",
        "It makes every sentence sound the same"
      ],
      "correct_index": 0,
      "explanation": "Expression uses the voice to show the meaning and feelings already in the text. It keeps the words accurate instead of changing them."
    },
    {
      "type": "multiple_choice",
      "question": "“I lost my boat,” said Mila sadly. Which word gives the clearest clue about her feeling?",
      "options": [
        "boat",
        "said",
        "sadly",
        "my"
      ],
      "correct_index": 2,
      "explanation": "Sadly directly tells us how Mila feels. Boat names the object, said tells us she spoke, and my tells us it belongs to her."
    },
    {
      "type": "multiple_choice",
      "question": "Where would a sentence-end pause fit in “The boat tipped. Mila watched.”?",
      "options": [
        "Between The and boat",
        "After the first full stop",
        "Between Mila and watched",
        "After every word"
      ],
      "correct_index": 1,
      "explanation": "The first full stop ends a thought. A pause there separates the two sentences without breaking their word groups."
    },
    {
      "type": "multiple_choice",
      "question": "Which words are best kept together as one phrase in “At the park, Mila waited.”?",
      "options": [
        "park, Mila",
        "At / the / park",
        "the park, Mila",
        "At the park"
      ],
      "correct_index": 3,
      "explanation": "At the park is a meaningful group that tells us where. Keeping those words together helps the listener follow the sentence."
    },
    {
      "type": "multiple_choice",
      "question": "What does pace mean when you read aloud?",
      "options": [
        "How loud your voice is",
        "Which word you stress",
        "How fast or slow you read",
        "How high or low your voice is"
      ],
      "correct_index": 2,
      "explanation": "Pace is reading speed. Volume describes loudness, pitch describes how high or low the voice sounds, and stress is emphasis on a word."
    },
    {
      "type": "multiple_choice",
      "question": "“Be careful,” whispered Mila. Which voice choice fits the clue?",
      "options": [
        "A quieter voice that stays clear",
        "Shouting each word",
        "A cheering voice",
        "A voice too quiet for the words to be heard"
      ],
      "correct_index": 0,
      "explanation": "Whispered suggests a quieter voice. Keeping the words clear protects the meaning; shouting or cheering would not match the clue."
    },
    {
      "type": "multiple_choice",
      "question": "Why might you stress now in “It is floating now!”?",
      "options": [
        "To show that every word matters equally",
        "To change floating into sinking",
        "To replace the full stop",
        "To emphasise that it is floating at this moment"
      ],
      "correct_index": 3,
      "explanation": "Now points to this moment. Emphasising it can show the change from the boat tipping earlier to floating at this moment."
    },
    {
      "type": "multiple_choice",
      "question": "Your first reading was rushed and a word was unclear. What should you try next?",
      "options": [
        "Skip that word",
        "Reread more slowly and keep the word clear",
        "Add a new sentence",
        "Read every word more loudly"
      ],
      "correct_index": 1,
      "explanation": "Rereading more slowly gives you time to say the unclear word accurately. Skipping or adding words changes the text, and loudness alone does not fix rushing."
    },
    {
      "type": "short_answer",
      "question": "“Wait,” whispered Mila. Name one voice tool you would change and explain the clue that helped you choose.",
      "sample_answer": "I would lower my volume because whispered tells me Mila is speaking quietly. I would keep the word clear.",
      "marking_guide": "Accept a quieter volume linked to whispered, or another sensible tool with a text-based reason. Look for a named tool and an explanation.",
      "explanation": "A useful explanation links a voice choice to a clue in the words rather than choosing at random."
    },
    {
      "type": "short_answer",
      "question": "What did you improve when you reread the boat story? Explain how it helped a listener.",
      "sample_answer": "I slowed my pace so I could say upright clearly. That helped a listener understand that the boat was standing up.",
      "marking_guide": "Accept a specific change to clarity, pauses, phrasing, pace, volume, pitch or stress with a sensible explanation of its effect. There is no single required voice.",
      "explanation": "A useful reflection names a change and explains how it made the meaning or words clearer."
    }
  ],
  "parent_notes": "Parent: This lesson teaches reading expression through meaning clues, pauses and phrasing, pace, volume, pitch, emphasis and rereading. EN2-REFLU-01 was checked against the NESA English K–10 (2022) outcomes page. It is one lesson contributing to the outcome, not evidence that the whole outcome has been achieved. All stories and episodes are original.\n\nParent: The lesson guides the child without requiring you to teach the topic. Look for accurate words, meaningful grouping and a reason for voice choices. There is no single correct performance. Do not require a dramatic voice, a particular accent, a whisper or a recording. A child may explain intended expression in writing or use their usual communication support; note what was actually demonstrated.\n\nParent: If decoding is the barrier, help with that word or use a shorter line and let the child reread. Do not supply the check or quiz answers. Encourage one small change at a time. Keep volume comfortable and never ask the child to shout. The provided cartoons have readable transcripts, so audio is optional.\n\nParent: The quest check has eight automatically scored multiple-choice questions and two written responses. At the approved 90% threshold, eight out of eight scored questions are needed. Written responses are included with the submission for your review and do not receive automatic marks. Retries are available after feedback. Model answer for question 9: “I would lower my volume because whispered tells me Mila is speaking quietly. I would keep the word clear.” Accept other justified choices.\n\nParent: Model answer for question 10: “I slowed my pace so I could say upright clearly. That helped a listener understand that the boat was standing up.” Accept a specific change and its effect. Model reflection: “My second reading had a pause after The boat tipped, so the listener could follow the next thought.” These are examples, not scripts to memorise.\n\nParent: A possible main-task response: “At the park, / Mila held her paper boat. // I used a questioning voice for Will it float because Mila wants to know. I lowered my volume for Wait because whispered is the clue. I stressed now because the boat is floating at this moment. On my second reading I kept stayed upright together rather than stopping between the words.” Other pause marks and choices are valid when they fit the words. Review the oral reading or the explanation separately; a correct quiz alone does not establish expressive reading.",
  "evidence_instructions": "Keep the typed reading plan, reflection, both written quiz answers and any paper marks. If possible, briefly observe the two readings and note one improvement in clarity or expression. A recording is optional. If oral reading was not observed, record that the evidence shows planning and explanation only.",
  "offline_alternative": "Use the printed boat story or copy it onto paper before turning off the screen. Mark two pauses, write two voice choices with reasons and choose a word to emphasise. Read the story aloud twice and write one improvement. Keep the page for review. Later, type a short summary and complete the quest check on the site.",
  "extension": "Read “It is floating now!” twice, stressing a different word each time. Explain how the emphasis changes what a listener notices, while the story’s words stay the same.",
  "printable_resource": {
    "title": "My Voice Detective reading sheet",
    "instructions": "Mark two pauses with / or //. Then write your voice choices. Read the story twice and note one improvement.",
    "passage": "At the park, Mila held her paper boat. “Will it float?” she asked.\nShe set it in a puddle. The boat tipped.\n“Wait,” she whispered. Mila watched carefully.\nThe boat stayed upright. “It is floating now!” she cheered.",
    "prompts": [
      "My first voice tool, clue and reason:",
      "My second voice tool, clue and reason:",
      "My word to stress and why:",
      "One change in my second reading and how it helped:"
    ]
  },
  "stage_hints": {
    "accept": [
      "Read your mission and the five things you will learn. You can practise in small parts.",
      "You will first learn four voice skills, then try a short story. Find a comfortable place to read aloud.",
      "Start by choosing the typed task or paper and pencil. Accept the quest when you are ready to look for a clue in the first line."
    ],
    "teach0": [
      "Look back at the sentence and the word that tells you about the speaker’s feeling.",
      "Ask yourself what happened and whether the speaker sounds pleased, worried or disappointed.",
      "Try saying a practice line two different ways. Decide which feeling matches the clue in the words, then return to the question."
    ],
    "teach1": [
      "Look back at the slash marks in the example. Notice where each thought finishes.",
      "Read the short sentence as one thought before testing where a pause belongs.",
      "Use your finger to follow a word group. Say it together, then make a brief stop when punctuation and meaning finish the thought."
    ],
    "teach2": [
      "Look back at the three voice tools. Which one describes loudness?",
      "Find the speaking clue in the line. Decide whether it suggests changing speed, loudness or how high your voice sounds.",
      "Say a practice line at two comfortable loudness levels. Keep the words clear and compare each version with the clue in the question."
    ],
    "teach3": [
      "Look back at the first and second tries. What went wrong with the unclear word?",
      "Separate the problem from the voice tool. Ask whether the words need more time, more loudness or different emphasis.",
      "Try the practice phrase “beside the bench” twice. Give each word enough time and listen for clarity before choosing a method for the question."
    ],
    "learn": [
      "Read the model story once before looking at the reading plan.",
      "Follow the plan one part at a time: find a feeling clue, choose pauses, choose a voice, then reread.",
      "Try just Ava’s opening line. Explain which word guided your voice, then flip one tool card to remind yourself of its meaning."
    ],
    "guided": [
      "Look back at the four instructions beside Ben’s line.",
      "Begin with the speaking clue, then practise only the first spoken sentence.",
      "Use the starter “The clue I noticed is ____. I will change my ____ because ____.” Fill one gap, try the line, then move to the next gap."
    ],
    "write": [
      "Read the boat story quietly before writing your choices. Look back at the model’s reading plan.",
      "Begin with one sentence and one clue. Use “I will change my ____ because the words ____ show ____.”",
      "Start your response with “In the opening question, I noticed ____.” Fill that gap with a clue you found, then choose a voice tool. Leave the other choices for your next small step."
    ],
    "quiz": [
      "Return to the teaching step for the skill in the question: meaning, pauses, voice tools or rereading.",
      "Read the whole line, name the skill being tested, then compare each option with the rule you learned.",
      "For a voice-choice question, find a clue before comparing options. For a written answer, name your tool and explain its link to the words. Keep the answer in your own words."
    ],
    "submit": [
      "Your plan and quiz work are ready for review. Look back once to check your reading choices are included.",
      "Check that the big box has your pause, voice and stress choices, and that you answered the reflection and both written quiz questions.",
      "If you worked on paper, type a short summary and keep the page. Choose the help checkbox if you need support, then send your work for a grown-up to review."
    ]
  },
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
  "reflection_prompts": null,
  "reflection_prompt": null
}'),
    updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
WHERE seed_key = 's2-eng-y3-w01-l1';
