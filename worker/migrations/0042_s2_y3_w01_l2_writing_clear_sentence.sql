-- Year 3, Week 1, Lesson 2: Writing a clear sentence.
-- Replaces the coming-soon placeholder data on seed-s2-eng-y3-w01-l2.
-- json_patch merges these fields into the existing data and removes keys set to null.
-- Same fields and style as the built Lesson 1 migration (0013_s2_y3_w01_l1_reading_expression.sql).
-- All text is original. No external links, videos or images are used.
-- Outcome code EN2-CWT-01 is the writing outcome used by the other Stage 2 writing lesson: check it against the NESA English K-6 syllabus.
UPDATE lessons
SET data = json_patch(data, '{
  "coming_soon": null,
  "source_note": null,
  "duration_minutes": 45,
  "outcome_codes": ["EN2-CWT-01"],
  "child_mission": "Become a Sentence Builder. Learn what a sentence needs, then write clear sentences that start with a capital letter, make complete sense and end with the right punctuation.",
  "learning_intention": "We are learning to write clear sentences that make complete sense.",
  "success_criteria": [
    "I can explain what a sentence is.",
    "I can find who or what the sentence is about and what they did.",
    "I can start a sentence with a capital letter and end it with a full stop, question mark or exclamation mark.",
    "I can fix a fragment so it is a complete sentence.",
    "I can fix a run-on sentence by splitting it or joining it clearly.",
    "I can add detail that tells when, where or how.",
    "I can read my sentence aloud and check that it makes sense."
  ],
  "materials": [
    "This lesson, with everything you need inside it",
    "A pencil and paper or an exercise book",
    "A quiet spot to read your sentences aloud",
    "Optional: a parent or sibling to listen to your sentences"
  ],
  "teach_steps": [
    {
      "icon": "✏️",
      "title": "What is a sentence?",
      "explain": "A sentence is a group of words that tells one complete idea. When you read a sentence, you should not be left asking, what happened? or who?\n\nA clear sentence has three things. It tells us who or what the sentence is about. It tells us what they did or what they are like. And it makes complete sense on its own. A sentence also starts with a capital letter and ends with a full stop, a question mark or an exclamation mark.",
      "example": "The girl kicked the ball.\nThis is a sentence. Who? The girl. What did she do? Kicked the ball. It starts with a capital letter and ends with a full stop.",
      "notice": "Your pet says: Read it aloud. Does it feel finished, or are you waiting for more words?",
      "check": {
        "question": "What does a sentence need?",
        "options": ["A picture and a title", "Who or what it is about and what they did, so it makes complete sense", "Three long words"],
        "correct_index": 1,
        "explanation": "A sentence tells one complete idea. It needs someone or something and what they did or what they are like."
      }
    },
    {
      "icon": "🔎",
      "title": "Who or what? Doing what?",
      "explain": "To check a sentence, ask two questions. The first is: who or what is this about? The answer is the naming part. The second is: what did they do, or what are they like? The answer is the doing part. Verbs are doing words such as run, jump, laugh, eat and sleep. Some verbs tell us about being, such as is, are and was.\n\nIf you can answer both questions, you probably have a sentence. If one answer is missing, the sentence is not finished.",
      "example": "My brother baked a cake.\nWho? My brother. Did what? Baked a cake.\n\nThe puppy is tiny.\nWho? The puppy. What is it like? Tiny.",
      "notice": "Common mistake: writing a long group of describing words and forgetting the doing word. The big brown fluffy dog is not finished.",
      "check": {
        "question": "In the sentence The birds sang loudly, what is the doing word?",
        "options": ["The", "sang", "loudly"],
        "correct_index": 1,
        "explanation": "Sang tells us what the birds did. It is the verb."
      }
    },
    {
      "icon": "🔤",
      "title": "Capital letters and end marks",
      "explain": "Every sentence begins with a capital letter. This tells the reader a new idea is starting. Names of people and places also have capital letters, and so does the word I.\n\nEvery sentence ends with an end mark. A full stop ends a statement. A question mark ends a question. An exclamation mark ends a sentence that shows strong feeling, such as surprise or alarm. Choose the end mark that matches what you mean.",
      "example": "We went to the beach.\nDid you bring a towel?\nWatch out for the wave!\nThree sentences. Each starts with a capital letter. Each ends with a different end mark.",
      "notice": "Your pet says: Check the first letter and the last mark every time. Those two are the easiest to forget.",
      "check": {
        "question": "Which end mark belongs at the end of: Where is my hat",
        "options": ["A full stop", "A question mark", "A comma"],
        "correct_index": 1,
        "explanation": "The sentence asks something, so it ends with a question mark."
      }
    },
    {
      "icon": "🧩",
      "title": "Fixing fragments",
      "explain": "A fragment is a group of words that is missing something. It might be missing who or what, or it might be missing what they did. It does not make complete sense on its own.\n\nTo fix a fragment, ask what is missing and add it. Then check that the sentence is complete. Fragments are sometimes used by writers on purpose, but in your own clear sentences you should write the full idea.",
      "example": "Fragment: Ran down the hill.\nWho ran? Nothing tells us. Fixed: The boy ran down the hill.\n\nFragment: The big brown dog.\nWhat did it do? Nothing tells us. Fixed: The big brown dog barked at the postie.",
      "notice": "Common mistake: thinking a long group of words must be a sentence. Long does not mean complete.",
      "check": {
        "question": "Which one is a complete sentence?",
        "options": ["Ran down the hill.", "The girl ran down the hill.", "The girl down the hill."],
        "correct_index": 1,
        "explanation": "The girl ran down the hill. tells who and what she did, so it is complete."
      }
    },
    {
      "icon": "🚂",
      "title": "Fixing run-on sentences",
      "explain": "A run-on sentence squashes two or more ideas together with no clear break. The reader does not know where one idea ends and the next begins.\n\nYou can fix a run-on in two ways. You can split it into separate sentences with capital letters and end marks. Or you can join the ideas with a joining word such as and, but, so or because, and a comma if it helps. Read it aloud to hear where you naturally stop.",
      "example": "Run-on: The dog barked the cat ran away the boy laughed.\nFix 1 (split): The dog barked. The cat ran away. The boy laughed.\nFix 2 (join): The dog barked, and the cat ran away. The boy laughed.",
      "notice": "Your pet says: When you take a breath while reading aloud, that is often where a sentence ends.",
      "check": {
        "question": "Which is the best fix for: The rain stopped we went outside",
        "options": ["The rain stopped, so we went outside.", "The rain stopped we went outside.", "The rain stopped we, went outside."],
        "correct_index": 0,
        "explanation": "The joining word so, with a comma, shows how the two ideas are connected."
      }
    },
    {
      "icon": "🌈",
      "title": "Adding clear detail",
      "explain": "A short sentence is fine, but detail helps the reader see what you mean. You can add detail by answering when, where, how or what kind.\n\nStart with a simple sentence and add one piece of detail at a time. Make sure each new word helps the reader. Too many describing words can make a sentence messy, so read it back to check that it is still clear.",
      "example": "Start: The dog ran.\nWhere? The dog ran across the park.\nWhen? After lunch, the dog ran across the park.\nWhat kind? After lunch, the brown dog ran across the park.",
      "notice": "Common mistake: adding so many words that the main idea gets lost. Add detail one piece at a time.",
      "check": {
        "question": "Which sentence has the most useful detail?",
        "options": ["The dog ran.", "The brown dog ran across the park after lunch.", "The dog ran ran ran."],
        "correct_index": 1,
        "explanation": "It tells what kind of dog, where it ran and when, and it is still clear."
      }
    },
    {
      "icon": "👂",
      "title": "Check it: read it aloud",
      "explain": "Good writers check their sentences. Read each sentence aloud, slowly, then use a three-point check. First, capital letter at the start and an end mark at the finish. Second, who or what and what they did. Third, does it make complete sense on its own?\n\nIf the answer to any check is no, fix it, then read it again. Fixing your own work is part of writing, not a mistake.",
      "example": "Draft: after school we played\nCheck 1: no capital letter, no end mark. Check 2: who is we, what did we do: played. Check 3: played what, where? Improved: After school, we played cricket in the yard.",
      "notice": "Your pet says: Your first draft does not have to be perfect. Checking is how writers get better.",
      "check": {
        "question": "What is the best last step when you write a sentence?",
        "options": ["Read it aloud and check it", "Make it as long as possible", "Never look at it again"],
        "correct_index": 0,
        "explanation": "Reading aloud helps you hear what is missing or unclear."
      }
    }
  ],
  "explicit_teaching": "Parent: This lesson teaches the basic building block of writing, the complete sentence. At this age, children often write fragments or run-ons because they write the way they speak. The goal is not fancy sentences. It is sentences that are clear, complete and correctly marked.\n\nTeach with a simple routine: who or what, did what, makes sense, capital letter, end mark. Model it on one sentence first, then let your child try. Keep the language simple. Use the words sentence, fragment and run-on, but do not worry if they only remember sentence and complete.\n\nCorrect gently. Ask a question rather than telling: Who ran? or Where did the sentence stop? Praise one thing they did well before you point out one thing to fix.\n\nIf your child finds writing hard, let them say the sentence first, then write it. If they are confident, ask for detail: when, where, how.",
  "worked_example": "Example 1: The girl kicked the ball.\nWho? The girl. Did what? Kicked the ball. Capital letter and full stop: yes. Result: a complete sentence.\n\nExample 2: Ran across the road.\nWho ran? Missing. Fix: The cat ran across the road. Common mistake: starting with a doing word and forgetting who did it.\n\nExample 3: The big green frog.\nDid what? Missing. Fix: The big green frog jumped into the pond. Common mistake: only describing the thing.\n\nExample 4: We went to the park we played on the swings.\nTwo ideas run together. Fix 1: We went to the park. We played on the swings. Fix 2: We went to the park, and we played on the swings.\n\nExample 5: Did you see that\nIt asks something, so it needs a question mark. Fix: Did you see that? Common mistake: using a full stop for a question.\n\nExample 6: Draft: the dog ran. Improved: After lunch, the brown dog ran across the park.\nDetail added one piece at a time: when (after lunch), what kind (brown), where (across the park). Capital letters and end mark checked.",
  "guided_practice": "Part A: Who and what. Write who or what and what they did: The baby laughed at the funny face. Hint: ask the two questions. Answer: Who: the baby. Did what: laughed at the funny face.\n\nPart B: End marks. Add the correct end mark: Where did you put the keys. Answer: Where did you put the keys?\n\nPart C: Fix the fragment. Make this a sentence: Jumped over the log. Answer: any complete sentence with a who, such as The rabbit jumped over the log.\n\nPart D: Fix the fragment. Make this a sentence: The tall old tree. Answer: any complete sentence with an action, such as The tall old tree fell in the storm.\n\nPart E: Fix the run-on by splitting it: The sun came out the children ran to the pool. Answer: The sun came out. The children ran to the pool.\n\nPart F: Fix the run-on by joining it with so, and or but: It was raining we stayed inside. Answer: It was raining, so we stayed inside.\n\nPart G: Add detail. Start with: The bird sang. Add where, when and what kind. Answer: any clear sentence such as In the morning, the little bird sang in the gum tree.\n\nPart H: Check it. Fix this draft with the three-point check: my sister likes pizza. Answer: My sister likes pizza. (capital letter and end mark are the fixes; the sentence is already complete).\n\nParent prompt for every part: Who or what is it about, and what did they do? Pet hint for every part: Read it aloud and listen for what is missing.",
  "independent_task": "Part 1: Sort. For each, write sentence or not a sentence.\n1. The cat sat on the mat.\n2. Under the old bridge.\n3. My mum made dinner.\n4. Laughed and laughed.\n5. The tiny kitten purred.\n\nPart 2: Fix. Rewrite each as a complete sentence with a capital letter and an end mark.\n6. ran to the shops\n7. the happy children\n8. is the bus coming\n9. we saw a big whale it jumped out of the water\n10. in the morning\n\nPart 3: Add detail. Make each sentence better by adding when, where or how.\n11. The boy ran.\n12. The dog slept.\n13. A bird flew.\n\nPart 4: Write your own.\n14. Write three clear sentences about your favourite place. Use a different end mark in at least one sentence.\n15. Read your three sentences aloud. Use the three-point check on each one, then fix anything you find and tick when it is done.",
  "response_prompt": "Write one or two sentences about which part of making a clear sentence was easiest for you today, and which part you want to practise more.",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "What is a sentence?",
      "options": ["A group of words that tells one complete idea", "Any group of words", "A single letter"],
      "correct_index": 0,
      "explanation": "A sentence tells one complete idea and makes sense on its own."
    },
    {
      "type": "multiple_choice",
      "question": "How should a sentence start and end?",
      "options": ["With a small letter and no end mark", "With a capital letter and an end mark", "With a comma and a capital letter"],
      "correct_index": 1,
      "explanation": "A sentence begins with a capital letter and ends with a full stop, question mark or exclamation mark."
    },
    {
      "type": "multiple_choice",
      "question": "Which one is a complete sentence?",
      "options": ["Ran across the field.", "The big brown horse.", "The horse ran across the field."],
      "correct_index": 2,
      "explanation": "It tells who (the horse) and what it did (ran across the field)."
    },
    {
      "type": "multiple_choice",
      "question": "The big brown dog. Why is this a fragment?",
      "options": ["It does not say what the dog did", "It is too short", "It has a capital letter"],
      "correct_index": 0,
      "explanation": "It only describes the dog. There is no doing word telling what the dog did."
    },
    {
      "type": "multiple_choice",
      "question": "Which is the best fix for: The dog barked the cat ran away",
      "options": ["The dog barked, and the cat ran away.", "The dog barked the cat ran away.", "The dog, barked the cat ran away."],
      "correct_index": 0,
      "explanation": "The joining word and, with a comma, separates the two ideas clearly."
    },
    {
      "type": "multiple_choice",
      "question": "Which end mark should be at the end of: What time does the movie start",
      "options": ["A full stop", "An exclamation mark", "A question mark"],
      "correct_index": 2,
      "explanation": "The sentence asks something, so it needs a question mark."
    },
    {
      "type": "multiple_choice",
      "question": "Which sentence has the most useful detail?",
      "options": ["The girl sang.", "The girl sang sang sang.", "The shy girl sang a song at the concert."],
      "correct_index": 2,
      "explanation": "It tells what kind of girl, what she sang and where, and it is still clear."
    },
    {
      "type": "multiple_choice",
      "question": "What is the best way to check a sentence you wrote?",
      "options": ["Read it aloud and use the three-point check", "Hand it in without looking", "Make it longer"],
      "correct_index": 0,
      "explanation": "Reading aloud and checking the capital letter, end mark and meaning helps you find mistakes."
    },
    {
      "type": "short_answer",
      "question": "Rewrite this fragment as a complete sentence and explain what you added: Jumped into the pool.",
      "sample_answer": "The boy jumped into the pool. I added who jumped, the boy, so the sentence tells who and what they did.",
      "marking_guide": "Full marks for a complete sentence with a who or what and a correct capital letter and end mark, plus an explanation of what was added. Partial marks for a complete sentence with no explanation."
    },
    {
      "type": "short_answer",
      "question": "Fix this run-on in two different ways: We got home we had dinner we watched a movie.",
      "sample_answer": "We got home. We had dinner. We watched a movie. Or: We got home, and we had dinner. Then we watched a movie.",
      "marking_guide": "Full marks for two different correct fixes, such as splitting and joining, with capital letters and end marks. Partial marks for one correct fix."
    }
  ],
  "parent_notes": "Keep the lesson calm and short. Ask your child to say each sentence aloud before writing it. If they write a fragment or run-on, ask a question instead of correcting it: Who ran? or Where did your sentence stop? Praise one thing first, such as a good capital letter, then fix one thing at a time. If your child finds handwriting tiring, let them speak the sentence and you write it, then they copy it. For a confident writer, use the detail questions and try the extension. Use the pet hints as prompts to think, not as answers, and use them less as your child grows more confident.",
  "evidence_instructions": "Keep the three sentences from independent task 14 and the notes from your three-point check. A parent can also read the sentences aloud and tick whether each one starts with a capital letter, ends with an end mark, and makes complete sense.",
  "offline_alternative": "Printable options: (1) Sentence check card: capital letter, who or what, did what, end mark, with a tick for each. (2) Sorting sheet from independent Part 1 with columns for sentence and not a sentence. (3) Fix-it sheet with the fragments and run-ons from Parts 2 and 3. (4) Detail ladder: a simple sentence at the bottom and boxes for when, where and how above it. (5) Optional parent observation sheet with the seven success criteria and a tick for each. Draw or write these on plain paper if you cannot print.",
  "extension": "Write a short paragraph of five clear sentences about something that happened this week. Use at least one question and one exclamation. Then swap with someone, and see if they can find where each sentence starts and ends."
}')
WHERE seed_key = 's2-eng-y3-w01-l2';
