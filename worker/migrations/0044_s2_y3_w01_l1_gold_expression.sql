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
  "duration_minutes": 60,
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
      "explain": "**What is expression?**\nImagine someone says, “You found it!” Those words could sound pleased or surprised. Expression is the way your voice helps a listener understand the meaning and feeling. You keep the writer’s words, but choose how to say them.\n\n**First understand, then read aloud.**\nRead a whole sentence quietly. Ask, “What happened? How might the speaker feel?” Look for a clue in the words. Sadly, whispered and cheered are clues about a speaker. The events can help too: finding something lost might bring relief.\n\n**Who is speaking?**\nQuotation marks, “ ”, surround a character’s spoken words. The narrator is the storyteller. The narrator’s words outside the quotation marks can tell you who spoke and how. In “I found it,” said Ava happily, Ava says I found it. Happily is the clue about her feeling. You do not say “quotation mark” aloud.\n\n**Keep the words accurate.**\nRead all the words, including the part outside the quotation marks. If a word stops you, look for a part you recognise, work through its sounds and read the sentence again. Practise one sentence before reading a whole story. A clear reading matters more than a dramatic voice.",
      "example": "WATCH MY THINKING\n“My kite is stuck,” said Ava sadly.\n\n1. I find Ava’s spoken words: My kite is stuck.\n2. I read the rest. Sadly tells me Ava feels unhappy.\n3. I choose a gentle, disappointed voice for her spoken words. I say the other words clearly in my usual reading voice.\n4. I reread the whole sentence. I check that I said every word.\n\nCOMPARE TWO VERSIONS\nTry Ava’s spoken words as if you are cheering. Then try them as if something you wanted has gone wrong. Which version fits sadly? The disappointed version fits the clue; cheering would suggest she is pleased.\n\nTRY A NEW LINE\n“We found it!” said Ben happily.\nRead the whole line quietly. Find the feeling clue, then say Ben’s words with a voice that fits. Think of your answer before reading on.\n\nCHECK YOUR THINKING\nHappily suggests Ben is pleased. A pleased voice fits his spoken words. You do not need to shout. If your voice stays quite gentle, you can still show pleasure.",
      "notice": "Do not choose a feeling just because a kite appears in the story. Use sadly as your clue. You can explain a voice choice with “The word ____ tells me ____, so I will sound ____.”",
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
      "explain": "**Why do we pause?**\nListeners cannot see where a written sentence finishes. A pause gives them a moment to follow the thought before the next one begins. A pause is a brief stop, not a long wait.\n\n**Find the sentence ending.**\nA full stop, question mark or exclamation mark ends a sentence. Pause after that sentence, including when it is inside quotation marks. A comma can suggest a smaller pause. Read for meaning too; do not make every comma a long stop.\n\n**Keep a phrase together.**\nA phrase is a meaningful group of words. In After lunch, Ava looked up, After lunch tells us when and Ava looked up tells us what happened. Keeping each group together makes the thought easier to follow. Reading one word, stopping, then reading another can make it sound like a list.\n\n**Mark your practice reading.**\nUse / for a small pause and // for a sentence-end pause. Read the words between marks together. The slashes are your practice notes, not part of the story. Do not say “slash” aloud.\n\nStart with one sentence. Find its ending, find words that belong together, then read it aloud. Notice whether the pause helps the listener follow the meaning.",
      "example": "WATCH MY THINKING\nAfter lunch, Ava looked up. Her kite was caught in a tree.\n\n1. I find two full stops. Each finishes a thought.\n2. After lunch tells me when. I keep those words together and put a small pause after the comma.\n3. Ava looked up is the next thought. I keep those words together, then pause at its full stop.\n4. I read the second sentence smoothly. I keep in a tree together because it tells me where the kite was caught.\n\nMY MARKED READING\nAfter lunch, / Ava looked up. // Her kite was caught in a tree. //\n\nTRY AND COMPARE\nRead “Her / kite / was / caught” with a stop at every slash. Then read “Her kite was caught” smoothly. The smoother version joins the words into a thought rather than a list.\n\nYOUR SMALL TRY\nBeside the bench, Ben waited. Ava waved.\nSay where you would pause. Try it before reading the suggestion below.\n\nONE SENSIBLE READING\nBeside the bench, / Ben waited. // Ava waved. //\nBeside the bench stays together because it tells us where. Each sentence-end pause separates one thought from the next.",
      "notice": "Do not stop between every word, and do not rush straight through a sentence ending. The goal is a clear thought. Practice marks help you decide where to pause; they do not change the original punctuation.",
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
      "explain": "**Your three voice tools**\nPace means how fast or slow you read. Volume means how loud or quiet your voice is. Pitch means how high or low your voice sounds. These are different tools. Speaking louder does not automatically mean speaking faster or higher.\n\n**Try pace first.**\nSay “Take one careful step” quickly, then at a slower, steady pace. Notice how the slower version gives each word more time. Slow down for a careful moment or an unfamiliar word. An excited line may be a little faster, but keep every word clear.\n\n**Try volume next.**\nSay “Come this way” at your usual speaking volume, then a little quieter. Keep the words audible. Whispered is a clue to a quieter voice. An excited voice can have more energy without being a shout.\n\n**Try pitch last.**\nSay “Oh” with a slightly higher voice, then a slightly lower one. That change is pitch, not loudness. Use a comfortable voice. Try “Is it slipping?” with a questioning sound. Your pitch may rise, but not every question needs a rising ending.\n\n**Let the text choose the tool.**\nFind a clue, choose one change, then try it. Keep the other tools steady while you practise. If the words become unclear, adjust your reading.",
      "example": "WATCH MY THINKING\nBen checked the branch carefully. “Pull gently,” he whispered.\n\nFor the first sentence, carefully tells me this is a careful moment. I choose a steady pace rather than rushing.\n\nFor Ben’s spoken words, whispered is the clue. I lower my volume while keeping Pull gently clear. I do not make those words faster just because I made them quieter.\n\nTRY A QUESTION\n“Can you see it?” Ava asked.\nSay it first as if you are telling someone a fact. Then try a questioning sound, perhaps lifting your pitch a little near the end. The second version can help a listener hear that Ava wants an answer. Your natural questioning voice may sound different; it should still fit the meaning.\n\nYOUR SMALL TRY\n“We did it!” Ben cheered.\nFind the clue and try a voice choice before reading on.\n\nCHECK YOUR THINKING\nCheered suggests a pleased, energetic voice. You could use more energy or a slightly quicker pace, keeping the words clear. An exclamation mark shows strong feeling; you do not have to shout.",
      "notice": "Before reading, finish this thought: “The clue is ____. I will change my pace, volume or pitch by ____.” Change one tool at first so you can hear what it does. Quieter words still need to be clear.",
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
      "explain": "**What is word stress?**\nStress means giving a word a little extra emphasis so a listener notices it. You can say it slightly more firmly or give it a little more time. You do not need a louder voice for the whole sentence.\n\n**Choose what matters here.**\nAsk, “What should my listener notice?” In The kite is safe now, safe tells us the danger has passed; now points to this moment. Either word can matter, depending on what you want to show. Choose one and explain your reason.\n\n**Hear the difference.**\nTry “I found the kite” with extra emphasis on I. That draws attention to who found it. Try it again with extra emphasis on kite. That draws attention to what was found. The words stay the same, but the listener notices a different part.\n\n**Reread with a purpose.**\nRead once, then check three things: Did I say every word accurately? Did my pauses keep the thoughts clear? Did my voice fit a clue? Choose one thing to improve and read again. You are practising, so the first attempt does not need to be perfect.\n\nIf you cannot decide what to change, start with clarity. Slow a rushed line and say each word clearly. Then choose a voice change.",
      "example": "WATCH MY THINKING\nThe kite is safe now.\n\nFIRST, I CHOOSE EMPHASIS\nThe kite is SAFE now.\nI stress safe because I want the listener to notice that the kite is out of trouble.\n\nThe kite is safe NOW.\nI stress now because I want the listener to notice that the situation has changed. The capitals show my practice emphasis; I do not need to rewrite the story in capitals.\n\nTHEN, I IMPROVE A READING\nFirst try: I rush and make safe unclear.\nI notice the problem: a listener might miss the most important part.\nMy one change: I give the sentence more time.\nSecond try: I keep all the same words and say safe clearly.\n\nYOUR SMALL TRY\nBen found the string.\nRead it once, stressing Ben. Read it again, stressing string. What does each version draw attention to? Think before reading on.\n\nCHECK YOUR THINKING\nStressing Ben draws attention to who found it. Stressing string draws attention to what he found. Choose a reason for your emphasis; do not emphasise every word equally.",
      "notice": "Rereading means making a useful change, not just repeating the line faster. Say “My first try ____. In my second try I will ____ so the listener can ____.” Keep the story’s words the same.",
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
  "worked_example": "I DO: WATCH ME PREPARE A WHOLE READING\n\nMODEL STORY: A kite rescue\nAfter lunch, Ava looked up. “My kite is stuck,” she said sadly.\nBen held the branch steady. “Pull gently,” he whispered.\nAva tugged the string. The kite slipped free.\n“It is safe now!” Ava cheered.\n\n1. UNDERSTAND THE STORY\nFirst I read quietly. Ava’s kite is caught, Ben helps, and the kite comes free. Ava feels disappointed at first and pleased at the end. I know this from sadly and cheered, not from guessing about her name or the picture.\n\n2. MARK THE THOUGHTS\nAfter lunch, / Ava looked up. // “My kite is stuck,” / she said sadly. //\nBen held the branch steady. // “Pull gently,” / he whispered. //\nAva tugged the string. // The kite slipped free. //\n“It is safe now!” // Ava cheered. //\n\nI keep After lunch together because it tells me when. I pause briefly before moving from Ava’s words to the part telling me how she spoke. I pause at each sentence ending. These marks are one possible practice plan, not the only sensible reading.\n\n3. CHOOSE MY VOICE\nI read the narrator’s words clearly in my usual voice. For My kite is stuck, I use a disappointed voice because the clue is sadly. For Pull gently, I use a quieter volume because Ben whispered. For It is safe now, I sound pleased because Ava cheered. I keep each change comfortable enough for every word to be clear.\n\n4. CHOOSE ONE WORD TO STRESS\nI give now a little more emphasis in Ava’s last line. I want the listener to notice that the kite was in trouble earlier but is safe at this moment. Another reader might stress safe to highlight the danger being over. Both choices can be explained from the story.\n\n5. FIND A MISTAKE AND FIX IT\nMy first try rushed The kite slipped free. The word free was hard to hear. I chose a slower pace for that sentence, kept the words together and reread. The listener could understand that the kite came loose. I did not add new words or shout to fix the problem.\n\nNOW TRY MY METHOD\nRead the original, unmarked story aloud. Use one part of my plan at a time. Then reread, changing one thing you noticed. Your own voice choices can be different if the words give you a reason.",
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
  "guided_practice": "WE DO: BUILD A READING TOGETHER\nWork through one part at a time. The lesson will give you a suggestion after each try. Say your thinking aloud or jot a few words on paper. You do not need a grown-up to tell you the rule.\n\nOUR PRACTICE TEXT\nBeside the bench, Ben held the string. “Will it come free?” Ava asked.\n“Pull gently,” he whispered. Ava waited carefully.\n\n1. UNDERSTAND BEFORE YOU PERFORM\nRead quietly. Who holds the string? Who asks a question? Try answering before reading on.\nCheck: Ben holds the string and Ava asks whether it will come free. The words inside the quotation marks are their spoken words. Read the narrator’s words too.\n\n2. FIND ONE PAUSE\nRead the first sentence. Keep the words telling us where together. Decide where a brief pause would help.\nOne sensible reading: Beside the bench, / Ben held the string. //\nBeside the bench tells us where. The sentence-end pause gives the listener time before Ava’s question. Try that marked reading aloud.\n\n3. CHOOSE ONE VOICE TOOL\nFind the clue about Ben’s voice. Choose pace, volume or pitch and explain why. Use “The clue is ____, so I will change my ____ by ____.”\nCheck: whispered suggests a quieter volume. Try Pull gently quietly, then check that both words are clear. You do not have to make a real whisper. Use your usual clear voice for he whispered.\n\n4. TRY THE QUESTION\nAva wants an answer. Say Will it come free with a questioning sound. You might lift your pitch a little. Compare it with a flat telling voice and decide which better shows she is asking.\n\n5. CHOOSE EMPHASIS AND REREAD\nChoose one word you want a listener to notice. Free could draw attention to what Ava hopes will happen. Gently could draw attention to how Ben wants the string pulled. Say your own reason.\nRead the whole practice text aloud twice. Between readings, choose one change: a clearer word, a better pause or a voice choice that fits a clue.\n\nFINISH THIS THOUGHT\n“In my first reading, ____. I changed ____ in my second reading because ____.”\nIf you can name the clue and explain your change, you are ready to try a new story with less help.",
  "independent_task": "YOU DO: Your Voice Detective task (about 20 minutes)\n\nRead this original story:\nAt the park, Mila held her paper boat. “Will it float?” she asked.\nShe set it in a puddle. The boat tipped.\n“Wait,” she whispered. Mila watched carefully.\nThe boat stayed upright. “It is floating now!” she cheered.\n\n1. Read the story quietly. Work through any unfamiliar word, then reread its sentence. Upright means standing up rather than lying on its side.\n2. Choose two brief pause places. On paper, mark / or //. In the text box, copy the two short phrases or sentences and add the marks. Keep meaningful word groups together.\n3. Choose two voice changes. For each, write or say the clue, the voice tool and your reason. Use “I will change my ____ because the words ____ show ____.”\n4. Choose one word to stress. Write the word and why it matters here.\n5. Read the whole story aloud twice. After the first try, choose one improvement. Make that change in the second reading. You can practise alone; a recording is optional.\n6. In the big text box, type your choices under these four labels:\nPauses: ____\nVoice choices and clues: ____\nWord to stress and reason: ____\nMy second-reading improvement: ____\n\nIf you worked on paper, type a short summary of those choices and keep the paper for a grown-up to review. You do not need an upload to finish.\n\nBefore moving on, check: I kept the story’s words accurate; I used clues to explain my choices; I kept phrases together; I made one improvement. Answer the reflection question in the smaller box.",
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
  "parent_notes": "Parent: This lesson teaches reading expression through meaning clues, pauses and phrasing, pace, volume, pitch, emphasis and rereading. EN2-REFLU-01 was checked against the NESA English K–10 (2022) outcomes page. It is one lesson contributing to the outcome, not evidence that the whole outcome has been achieved. All stories and episodes are original.\n\nParent: Each teaching step now includes an explanation, a modelled thought process, a contrasting or new practice line and feedback before the scored check. The complete model and guided practice gradually remove that help. The lesson guides the child without requiring you to teach the topic. Look for accurate words, meaningful grouping and a reason for voice choices. There is no single correct performance. Do not require a dramatic voice, a particular accent, a whisper or a recording. A child may explain intended expression in writing or use their usual communication support; note what was actually demonstrated.\n\nParent: If decoding is the barrier, help with that word or use a shorter line and let the child reread. Do not supply the check or quiz answers. Encourage one small change at a time. Keep volume comfortable and never ask the child to shout. The provided cartoons have readable transcripts, so audio is optional.\n\nParent: The quest check has eight automatically scored multiple-choice questions and two written responses. At the approved 90% threshold, eight out of eight scored questions are needed. Written responses are included with the submission for your review and do not receive automatic marks. Retries are available after feedback. Model answer for question 9: “I would lower my volume because whispered tells me Mila is speaking quietly. I would keep the word clear.” Accept other justified choices.\n\nParent: Model answer for question 10: “I slowed my pace so I could say upright clearly. That helped a listener understand that the boat was standing up.” Accept a specific change and its effect. Model reflection: “My second reading had a pause after The boat tipped, so the listener could follow the next thought.” These are examples, not scripts to memorise.\n\nParent: A possible main-task response: “At the park, / Mila held her paper boat. // I used a questioning voice for Will it float because Mila wants to know. I lowered my volume for Wait because whispered is the clue. I stressed now because the boat is floating at this moment. On my second reading I kept stayed upright together rather than stopping between the words.” Other pause marks and choices are valid when they fit the words. Review the oral reading or the explanation separately; a correct quiz alone does not establish expressive reading.\n\nParent: Guided-practice suggestions are shown to the child after each small attempt so they can compare their own thinking. Accept alternative pauses or voice choices that preserve the words and fit a clue. The time estimate is now 60 minutes, including oral practice and the 20-minute task. If the child needs a slower reading pace, use the saved quest progress to take a break and resume rather than cutting out the teaching.",
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
      "Look back at the two versions of the same sentence. Notice what the stressed word makes a listener pay attention to.",
      "Separate the problem from the voice tool. Ask whether the words need more time, more loudness or different emphasis.",
      "Try the practice phrase “beside the bench” twice. Give each word enough time and listen for clarity before choosing a method for the question."
    ],
    "learn": [
      "Read the model story once before looking at the reading plan.",
      "Follow the whole model one part at a time: understand the events, mark the thoughts, choose a voice, choose emphasis and reread.",
      "Try just Ava’s opening line. Explain which word guided your voice, then flip one tool card to remind yourself of its meaning."
    ],
    "guided": [
      "Look back at the practice text and take just the first numbered try. You can compare your thinking with the suggestion after it.",
      "Start by finding who holds the string and who asks a question. Then move to one pause, before choosing a voice tool.",
      "Use “The clue is ____, so I will change my ____ by ____.” Fill the clue gap from the text, name a tool, then try only that line aloud."
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
