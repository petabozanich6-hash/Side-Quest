-- Year 3, Week 1, Lesson 1: Reading with expression.
-- Replaces the coming-soon placeholder data on seed-s2-eng-y3-w01-l1.
-- json_patch merges these fields into the existing data and removes keys set to null.
-- Written to match the fields rendered by frontend/src/pages/LessonDetail.jsx.
-- All text is original. No external links, videos or images are used.
-- If a 0013 migration already exists, rename this file to the next free number before applying.
UPDATE lessons
SET data = json_patch(data, '{
  "coming_soon": null,
  "source_note": null,
  "duration_minutes": 45,
  "child_mission": "Become a Voice Detective. Learn how pauses, pitch, volume, pace and stress show the meaning of a text, then use them to read aloud so a listener understands and feels it.",
  "learning_intention": "We are learning to read aloud with expression so that our voice shows what the text means.",
  "success_criteria": [
    "I can explain what expressive reading is.",
    "I can pause at punctuation and group words into meaningful phrases.",
    "I can change my pitch, volume and pace to match the meaning or feeling.",
    "I can stress the important words in a sentence.",
    "I can explain why I made a reading choice.",
    "I can reread a passage and make it better."
  ],
  "materials": [
    "This lesson, with everything you need inside it",
    "A quiet spot where you can read aloud",
    "A pencil and paper for marking pauses",
    "Optional: a parent or sibling to listen"
  ],
  "teach_steps": [
    {
      "icon": "🎤",
      "title": "What is expressive reading?",
      "explain": "When you read aloud, you have two jobs. The first job is to say every word correctly. The second job is to make the meaning clear to a listener.\n\nExpressive reading is when your voice shows the meaning of the text. You do this with five voice tools: pauses, pitch, volume, pace and stress. A robot can say every word correctly. A good reader also helps the listener understand and feel what is happening. Expression also helps you understand the text yourself, because you have to think about what it means before you can show it.",
      "example": "Flat reading: The dog ran home. It was raining.\nExpressive reading: The dog ran home, quick and eager. Pause. It was raining, slower and softer, as if the dog was a little worried.",
      "notice": "Your pet says: Listen to your own voice. Does it sound like you are telling someone something, or just saying words?",
      "check": {
        "question": "What is the main job of expression when you read aloud?",
        "options": ["To make the reading as loud as possible", "To show the meaning of the text with your voice", "To read as fast as you can"],
        "correct_index": 1,
        "explanation": "Expression helps the listener understand the meaning. Loud or fast reading is not the same thing."
      }
    },
    {
      "icon": "⏸️",
      "title": "Punctuation tells your voice what to do",
      "explain": "Punctuation marks are signals for a reader.\n\nA full stop means stop and take a short pause, and your voice falls. A comma means a very short pause, and your voice stays up a little because the sentence is not finished. A question mark means your voice rises at the end. An exclamation mark means a stronger voice with feeling. Three dots, called an ellipsis, mean your voice trails off or waits. Speech marks mean someone is talking, so you change to a speaking voice.",
      "example": "Read this line aloud: Slowly, carefully, Mia opened the door. Was anyone there? Nobody. She stepped inside!\nPause briefly at each comma. Let your voice rise at the question. Make the last sentence stronger.",
      "notice": "Common mistake: running straight through a full stop as if it was not there. Count one small beat in your head at every full stop.",
      "check": {
        "question": "What should your voice usually do at the end of a question?",
        "options": ["Rise a little", "Drop to a whisper", "Stay exactly the same"],
        "correct_index": 0,
        "explanation": "A rising voice tells the listener that a question has been asked."
      }
    },
    {
      "icon": "🧩",
      "title": "Phrasing: reading in word groups",
      "explain": "Good readers do not read one word at a time. They group words that belong together into phrases, the way we speak. A phrase is a small group of words that carries one piece of meaning.\n\nTo find phrases, look for punctuation first, then look for who or what, what they did, and where or when. Put a small slash between the groups, then read each group smoothly.",
      "example": "Word by word: The / tired / puppy / curled / up / in / the / warm / sun.\nIn phrases: The tired puppy / curled up / in the warm sun.",
      "notice": "Common mistake: stopping in the middle of a phrase, such as after the word the. Your pause should come between phrases, not inside them.",
      "check": {
        "question": "Which is the best way to group this sentence: The tired puppy curled up in the sun?",
        "options": ["The / tired / puppy / curled / up / in / the / sun", "The tired puppy / curled up / in the sun", "The tired / puppy curled / up in / the sun"],
        "correct_index": 1,
        "explanation": "The groups tell who (the tired puppy), what they did (curled up) and where (in the sun)."
      }
    },
    {
      "icon": "📈",
      "title": "Pitch and intonation",
      "explain": "Pitch is how high or low your voice sounds. Intonation is how your pitch moves up and down as you speak.\n\nQuestions usually rise at the end. Statements usually fall at the end. Surprise and excitement often use a higher pitch. Sadness, worry and seriousness often use a lower pitch. Pitch should come from the meaning of the text, so ask yourself what the writer wants the listener to feel.",
      "example": "Say the word really three ways. Really? (surprised, rising). Really. (flat, a fact). Really! (excited, bright and high). The word is the same, but the meaning changes with your pitch.",
      "notice": "Your pet says: Which feeling is hiding in this sentence? Let your pitch show it.",
      "check": {
        "question": "Which feeling usually fits a lower, slower voice?",
        "options": ["Sadness", "Surprise", "Excitement"],
        "correct_index": 0,
        "explanation": "Sadness and worry are usually shown with a lower, slower voice."
      }
    },
    {
      "icon": "🔊",
      "title": "Volume and pace",
      "explain": "Volume is how loud or soft you are. Pace is how fast or slow you read.\n\nUse a soft voice for secrets, fear or quiet moments, and a stronger voice for shouting or excitement. Use a slower pace for important or sad moments, and a quicker pace for action. Always stay clear and comfortable. Shouting every sentence is not expression, because the voice has no change in it.",
      "example": "Whispered: Shh, someone is coming. Shouted: Look out behind you! The first is soft and a little slow. The second is loud and quick.",
      "notice": "Common mistake: reading everything at the same volume and speed. Change at least one thing when the meaning changes.",
      "check": {
        "question": "A character whispers a secret. What should your volume be?",
        "options": ["Very loud", "Soft but clear", "Silent"],
        "correct_index": 1,
        "explanation": "A whisper is soft, but the listener must still be able to hear and understand it."
      }
    },
    {
      "icon": "⭐",
      "title": "Stress: which word matters most?",
      "explain": "Stress means saying one word a little stronger, longer or higher than the others. The stressed word is usually the most important word for the meaning.\n\nWhen you move the stress to a different word, the meaning changes. Ask yourself which word the listener most needs to notice.",
      "example": "I did not take your pencil. Stress I: someone else did. Stress not: I definitely did not. Stress your: I took someone elses pencil.",
      "notice": "Your pet says: Try the sentence three times, with a different word stressed each time. What changes?",
      "check": {
        "question": "Which word would you stress to show that it was Sam and not someone else who took the ball: Sam took the ball?",
        "options": ["took", "Sam", "ball"],
        "correct_index": 1,
        "explanation": "Stressing Sam tells the listener it was Sam, not anyone else."
      }
    },
    {
      "icon": "🎭",
      "title": "Character and feeling",
      "explain": "You can show how a character feels by mixing the voice tools. Think about how a real person sounds when they feel that way.\n\nAn angry character may use short, sharp words, a lower pitch and a stronger volume. A nervous character may speak softly and a little quickly with small pauses. A joyful character may use a bright, higher voice and a lively pace. You can show feelings without silly voices.",
      "example": "Nervous: I, um, I think I left it at home. Read it softly with small pauses at the commas.",
      "notice": "Common mistake: using a funny voice instead of showing the feeling. The feeling should sound natural.",
      "check": {
        "question": "How could you read a nervous character?",
        "options": ["Soft and a little quick, with small pauses", "Very loud and slow", "Exactly the same as every other line"],
        "correct_index": 0,
        "explanation": "Soft, quick speech with pauses sounds nervous. A flat voice shows no feeling."
      }
    },
    {
      "icon": "🔁",
      "title": "Natural expression and rereading",
      "explain": "Good expression sounds natural. It matches the text, it helps the listener, and it is never shouting or overacting.\n\nThe best readers reread. Read once to get the words right. Read again to think about the meaning and mark pauses and stress. Read a third time to perform it smoothly. Change only one or two things each time, then listen to how it sounds.",
      "example": "First read: all the words are right but the voice is flat. Second read: pauses and stress added. Third read: the listener can hear the feeling.",
      "notice": "Your pet says: Your second reading is always allowed to be better than your first. That is how readers grow.",
      "check": {
        "question": "What is the best way to improve your expression?",
        "options": ["Shout every sentence", "Reread and change one thing at a time", "Read faster each time"],
        "correct_index": 1,
        "explanation": "Rereading with one or two changes lets you hear what works."
      }
    }
  ],
  "explicit_teaching": "Parent: This lesson teaches prosody, which is the part of reading fluency that sounds like speech. Fluent reading has three parts: accuracy, a comfortable pace and expression. Speed alone is not the goal.\n\nTeach one voice tool at a time. Model each one first by reading the example aloud yourself, then ask your child to copy it. Praise the choice, not the performance. For example, say: I could hear you pause at the comma, which made the sentence clear.\n\nKeep it natural. If your child starts to shout or use silly voices, bring them back to the meaning: what is this character feeling, and how would a real person sound? Reluctant readers do best reading a short line three times rather than a long passage once.\n\nAvoid pressure. This is not acting. A calm, clear, natural voice that matches the meaning is the target. Allow your child to read to a pet or soft toy if they feel shy.",
  "worked_example": "Example 1: Slowly, carefully, Mia opened the door.\nPunctuation: two commas and a full stop. Pauses: tiny pause after Slowly, tiny pause after carefully. Important words: slowly, carefully. Feeling: cautious. Voice: lower and slow, soft volume. Model: say Slowly and carefully in a stretched, quiet way. Common mistake: racing through the commas.\n\nExample 2: Where are you going? asked Dad.\nPunctuation: a question mark. Pause: after going. Important word: going. Feeling: curious. Voice: rising pitch at the end of the question, then a steady voice for asked Dad. Common mistake: ending the question with a falling voice.\n\nExample 3: Watch out! The branch is falling!\nPunctuation: two exclamation marks. Pauses: short pause after out. Important words: Watch out, falling. Feeling: alarm. Voice: stronger volume, quicker pace, higher pitch. Common mistake: shouting the whole sentence at one level.\n\nExample 4: The house was quiet. Nothing moved. Nothing made a sound.\nPunctuation: three short sentences. Pauses: a clear beat after each full stop. Important words: quiet, nothing. Feeling: tension. Voice: soft, slow, with the long pauses doing the work. Common mistake: reading all three as one fast line.\n\nExample 5: I did not say you were wrong.\nStress changes meaning: stress I (someone else said it), stress not (I definitely did not), stress wrong (I said something else about you). Common mistake: stressing every word equally.\n\nExample 6: Sam was nervous. Then he smiled. I did it, he whispered, I really did it!\nFeeling changes from nervous to joyful. Voice: start soft and slow, brighten at smiled, then whisper the first part of the speech and let the last words rise with joy. Common mistake: keeping the same voice for the whole passage.",
  "guided_practice": "Part A: Pause marks. Copy this sentence and draw a small slash where you would pause: When the bell rang, the children ran outside and played in the sun. Hint 1: look for the comma. Hint 2: look for who, what they did, and where. Answer: When the bell rang, / the children ran outside / and played in the sun.\n\nPart B: Phrase groups. Put slashes in: The brown dog barked at the postie. Hint: who, did what, to whom. Answer: The brown dog / barked / at the postie.\n\nPart C: Important word. Which word is the most important in: Please be very quiet, the baby is sleeping. Hint: which word would a listener most need to notice. Answer: quiet (or sleeping). Explain why.\n\nPart D: Question voice. Read aloud: Is that really a dragon? Does your voice rise at the end? Write rise or fall. Answer: rise.\n\nPart E: Match feeling to voice. Draw lines or write the pairs: excited, scared, sad, angry. Voices: soft and shaky, slow and low, quick and bright, sharp and strong. Answer: excited with quick and bright, scared with soft and shaky, sad with slow and low, angry with sharp and strong.\n\nPart F: Compare readings. Read this twice: The storm is coming. First flat, then with a slower pace and lower pitch. Write which sounds more expressive and why. Answer: the second, because the voice shows the danger.\n\nPart G: Dialogue line. Read aloud twice, once happy and once sad: I found my kitten. Write one thing you changed.\n\nPart H: Speed decisions. In: The car sped past, then stopped. Silence. Where would you speed up and where would you slow down? Answer: quicker for sped past, slower for stopped and silence.\n\nParent prompt for every part: What is the text telling your voice to do? Pet hint for every part: Read it once, then try it again with one change.",
  "independent_task": "Read each passage aloud twice. Mark pauses and the important words before the second reading.\n\n1. Short sentences: The sun came up. Birds began to sing. The day had begun.\n2. Dialogue: Can we stay a bit longer? asked Lily. Just five minutes, said Mum. Please!\n3. A paragraph: The old boat rocked gently on the water. Gulls cried overhead. Then, without warning, the sky turned dark.\n4. Changing feeling: Ben stared at the envelope. His hands were shaking. He opened it slowly. Yes! he shouted. I got in!\n5. Phrasing challenge: After the long walk through the dusty paddock, the tired children sat under the big gum tree.\n\nThen answer these:\n6. Which punctuation mark made you pause the longest?\n7. Which word did you stress in passage 2, and why?\n8. Which voice tool did you use in passage 3: pitch, volume or pace?\n9. How did your voice change between the first and last lines of passage 4?\n10. In passage 1, where did you pause?\n11. Write one place where a comma helped your phrasing.\n12. Name one place you slowed down and say why.\n13. Name one place you sped up and say why.\n14. What was your second reading better at than your first?\n15. Choose one sentence from any passage and mark it with slashes and one star on the most important word.",
  "response_prompt": "Write one or two sentences about which voice tool helped you most today and how you used it.",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "What is expressive reading?",
      "options": ["Reading as quickly as possible", "Reading only the hard words", "Using your voice to show the meaning of a text"],
      "correct_index": 2,
      "explanation": "Expressive reading uses pauses, pitch, volume, pace and stress to show the meaning."
    },
    {
      "type": "multiple_choice",
      "question": "What does a comma usually tell your voice to do?",
      "options": ["Make a very short pause", "Stop completely and take a breath", "Read louder"],
      "correct_index": 0,
      "explanation": "A comma means a short pause. A full stop is a longer pause."
    },
    {
      "type": "multiple_choice",
      "question": "Which is the best voice for the question Are you coming with us?",
      "options": ["A voice that falls at the end", "A voice that rises at the end", "A whisper all the way through"],
      "correct_index": 1,
      "explanation": "Questions usually rise at the end."
    },
    {
      "type": "multiple_choice",
      "question": "In I want the blue one, not the red one, which word should you stress to show the colour matters?",
      "options": ["want", "blue", "one"],
      "correct_index": 1,
      "explanation": "The colour is the important idea, so blue is stressed."
    },
    {
      "type": "multiple_choice",
      "question": "What does an exclamation mark usually tell you to do?",
      "options": ["Pause for a long time", "Whisper", "Use a stronger voice that shows feeling"],
      "correct_index": 2,
      "explanation": "An exclamation mark shows strong feeling such as surprise, joy or alarm."
    },
    {
      "type": "multiple_choice",
      "question": "Which phrasing is best for After lunch we walked to the park?",
      "options": ["After / lunch / we / walked / to / the / park", "After lunch / we walked / to the park", "After lunch we / walked to / the park"],
      "correct_index": 1,
      "explanation": "The groups carry when, who and what they did, and where."
    },
    {
      "type": "multiple_choice",
      "question": "Which voice best fits a character who has just won a prize?",
      "options": ["Slow, low and soft", "A flat voice with no change", "Quick, bright and higher"],
      "correct_index": 2,
      "explanation": "Excitement is shown with a brighter, quicker, higher voice."
    },
    {
      "type": "multiple_choice",
      "question": "A reader plans to shout every sentence to sound exciting. What is the best fix?",
      "options": ["Change volume and pace to match the meaning of each sentence", "Shout even louder", "Read in a whisper instead"],
      "correct_index": 0,
      "explanation": "Expression changes with the meaning. Shouting everything has no change."
    },
    {
      "type": "short_answer",
      "question": "Read the sentence: I did not take your pencil. Explain how the meaning changes if you stress the word I, and then if you stress the word your.",
      "sample_answer": "Stressing I suggests someone else took the pencil. Stressing your suggests I took a different pencil, but not yours.",
      "marking_guide": "Full marks for explaining both stresses. Partial marks for explaining one. Look for the idea that moving the stress changes the meaning, not only the sound."
    },
    {
      "type": "short_answer",
      "question": "Read this aloud: Wait! Is that a snake? whispered Mia. Describe how you would read it, naming at least two voice tools such as pause, pitch, volume, pace or stress.",
      "sample_answer": "I would say Wait with a strong, quick voice, then pause. For Is that a snake I would let my pitch rise at the end, and I would stress snake. For whispered Mia I would use a soft, lower voice.",
      "marking_guide": "Full marks for at least two voice tools matched to the text with a reason. Partial marks for one tool or no reason."
    }
  ],
  "parent_notes": "Model first, then listen. Read each example aloud yourself before your child tries it. Give feedback on one voice tool at a time and praise the choice, for example: I could hear you slow down when the character was sad. Do not mark speed. If your child is a reluctant reader, use shorter passages and let them read to a pet or soft toy. For a confident reader, try the extension. If your child starts to overact or shout, return to the question: what is the character feeling and how would a real person sound? Use the pet hints as prompts to think, not as answers, and reduce them as your child grows more confident.",
  "evidence_instructions": "Listen to your child read one of the independent passages twice. Note which voice tools they used, and whether the second reading improved on the first. Keep the typed or written answers from the independent task and the quiz as evidence.",
  "offline_alternative": "Printable options: (1) Voice Toolbox checklist: pauses, pitch, volume, pace, stress, with a tick box for each. (2) Pause-marking sheet: copy the passages from the independent task with space above each line for slashes and stars. (3) Feelings and voices matching sheet from Guided practice Part E. (4) Reflection sheet: What did I do better the second time? (5) Optional parent observation sheet with the six success criteria and a tick for each. Draw or write these on plain paper if you cannot print.",
  "extension": "Choose a short page from a book you are reading. Mark pauses with slashes and stress with a star. Read it aloud three times, changing one thing each time, then explain which version was best and why."
}')
WHERE seed_key = 's2-eng-y3-w01-l1';
