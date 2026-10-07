# Stage 2 Year 3 Mathematics quests. Same structure as the Cartographer quest in lesson_library.py.
# Not yet registered in LESSON_LIBRARY; merge these into that list and bump LESSON_LIBRARY_VERSION.

S2Y3_MATHS_LESSONS = [
    {
        "seed_key": "s2-y3-maths-place-value-vault-01",
        "library": True,
        "stage": "S2",
        "year_level": "Year 3",
        "learning_area": "Mathematics",
        "subject": "Representing numbers: place value, zero and tenths",
        "title": "The Vault of Numbers",
        "child_mission": "🔐 A treasure vault only opens for someone who can read, build and compare big numbers. Crack each lock by understanding place value, then design a vault code of your own.",
        "duration_minutes": 60,
        "pass_mark": 0.9,
        "outcome_codes": ["MA2-RN-01", "MA2-RN-02", "MAO-WM-01"],
        "outcome_notes": {
            "MA2-RN-01": "Primary outcome. Reads, writes, builds and compares four-digit numbers using place value, including zero as a placeholder (teach steps 1-4; quiz questions 1-7).",
            "MA2-RN-02": "Introduces tenths as parts of one whole and places them on a number line (teach step 5; quiz questions 8-9). Wider decimal work continues in Year 4.",
            "MAO-WM-01": "Working mathematically: explains and justifies reasoning when comparing numbers and designing the vault code (response prompt and evidence task)."
        },
        "learning_intention": "We are learning to read, write, build and compare four-digit numbers using place value, and to understand tenths as parts of a whole.",
        "success_criteria": [
            "I can say the value of each digit in a four-digit number.",
            "I can use zero as a placeholder and write numbers like four thousand and six.",
            "I can write a number in expanded form.",
            "I can compare and order four-digit numbers and explain how I know.",
            "I can explain that one tenth is one of ten equal parts of a whole.",
            "I can score 90% or more on the Quest check."
        ],
        "key_vocabulary": ["digit", "place value", "ones", "tens", "hundreds", "thousands", "placeholder", "expanded form", "tenth"],
        "materials": ["Paper and pencil", "Place value cards or 10 sheets of paper cut into digit cards 0 to 9", "A ruler", "Optional: base-ten blocks or coins"],
        "prior_knowledge": "Child can read and write three-digit numbers and knows that ten tens make one hundred.",
        "explicit_teaching": "Our number system uses ten digits, 0 to 9. The position of a digit decides its value. This is PLACE VALUE. In 3,658 the digit 3 is in the thousands place, so it is worth 3,000. The 6 is worth 600, the 5 is worth 50 and the 8 is worth 8.\n\nZero is a PLACEHOLDER. It holds a place so the other digits stay in the right positions. 4,036 has no hundreds, so a zero holds the hundreds place.\n\nWe can break a number into parts in EXPANDED FORM: 6,274 = 6,000 + 200 + 70 + 4. To compare numbers, start at the left with the biggest place. The first place where the digits differ decides which number is larger.\n\nOne whole can be split into ten equal parts. Each part is one TENTH, written 0.1. So 2.3 means 2 wholes and 3 tenths.",
        "teach_steps": [
            {
                "icon": "🔢",
                "title": "Four places, four values",
                "explain": "A four-digit number has four places: THOUSANDS, HUNDREDS, TENS and ONES, reading from the left.\n\nEach digit is worth its digit times its place. The same digit is worth different amounts in different places. A 5 in the tens place is worth 50, but a 5 in the hundreds place is worth 500.",
                "example": "3,658 = 3 thousands + 6 hundreds + 5 tens + 8 ones.",
                "notice": "Read from the left. Each place is ten times bigger than the place to its right.",
                "check": {
                    "question": "In 2,574, how many hundreds are there?",
                    "options": ["2", "5", "7", "4"],
                    "correct_index": 1,
                    "explanation": "The hundreds place is the third from the right, and it holds the digit 5."
                }
            },
            {
                "icon": "0️⃣",
                "title": "Zero holds the place",
                "explain": "Sometimes a place is empty. We write a ZERO so the other digits stay where they belong.\n\nWithout zero, 4,036 would look like 436, which is a different number. The zero says: there are no hundreds here.",
                "example": "Four thousand and thirty-six is written 4,036. There are 4 thousands, 0 hundreds, 3 tens and 6 ones.",
                "notice": "The word 'and' often shows where a place is skipped. Say the number, then write it place by place.",
                "check": {
                    "question": "Which is five thousand and nine?",
                    "options": ["5,009", "5,090", "5,900"],
                    "correct_index": 0,
                    "explanation": "5 thousands, 0 hundreds, 0 tens and 9 ones makes 5,009."
                }
            },
            {
                "icon": "🧩",
                "title": "Taking numbers apart",
                "explain": "EXPANDED FORM breaks a number into the value of each digit and adds them.\n\nIt shows exactly what each digit is worth. You can also put a number together from its parts.",
                "example": "6,274 = 6,000 + 200 + 70 + 4.",
                "notice": "Each part is the digit followed by the zeros that fill the places to its right.",
                "check": {
                    "question": "What number is 3,000 + 400 + 5?",
                    "options": ["3,450", "3,405", "3,045"],
                    "correct_index": 1,
                    "explanation": "3 thousands, 4 hundreds, 0 tens and 5 ones is 3,405."
                }
            },
            {
                "icon": "⚖️",
                "title": "Which is bigger?",
                "explain": "To compare, start at the LEFT, with the biggest place. If the digits match, move one place right. The first place where they differ decides.\n\nMore digits means a bigger number, but if both have four digits, compare thousands first, then hundreds, then tens, then ones.",
                "example": "5,431 and 5,413. Thousands: 5 and 5, same. Hundreds: 4 and 4, same. Tens: 3 and 1, so 5,431 is larger.",
                "notice": "Use the signs > (greater than) and < (less than): 5,431 > 5,413.",
                "check": {
                    "question": "Which is larger?",
                    "options": ["5,431", "5,413"],
                    "correct_index": 0,
                    "explanation": "The thousands and hundreds match. In the tens place, 3 is more than 1."
                }
            },
            {
                "icon": "🍰",
                "title": "Parts smaller than one",
                "explain": "Not every amount is a whole number. Split ONE whole into 10 equal parts and each part is one TENTH, written 0.1.\n\nThe dot is the decimal point. Digits to its right are parts of a whole. 2.3 means 2 wholes and 3 tenths. On a number line, 0.1 sits one small step after 0.",
                "example": "A ruler 1 decimetre long has 10 equal parts. 3 of them is 0.3 of the whole. A 2.3 m rope is 2 whole metres and 3 tenths of a metre.",
                "notice": "0.5 is five tenths, which is half of one whole.",
                "check": {
                    "question": "0.5 is the same as how many tenths?",
                    "options": ["5 tenths", "50 tenths", "5 ones"],
                    "correct_index": 0,
                    "explanation": "The 5 sits in the tenths place, so 0.5 is five tenths."
                }
            }
        ],
        "worked_example": "The vault code is 7,305. READ IT: seven thousand, three hundred and five. PLACE VALUES: 7 thousands, 3 hundreds, 0 tens (the zero is a placeholder), 5 ones. EXPANDED: 7,000 + 300 + 5. COMPARE it with 7,350: thousands and hundreds match, then the tens differ (0 and 5), so 7,350 is larger and 7,305 < 7,350. TENTHS: a dial reads 7.3, which is 7 wholes and 3 tenths.",
        "guided_practice": "Take the number 4,082. Write its value in each place, write it in expanded form, then write a number that is 10 more and a number that is 1,000 less. Explain in a sentence what the zero is doing.",
        "independent_task": "Design your own vault. Write a four-digit vault code that contains a zero. Show the code in words, in expanded form and in a place value chart. Then write two decoy codes that are close to it and put all three in order from smallest to largest, explaining how you decided. Finish by writing a dial reading with tenths, such as 3.4, and explaining what each digit means.",
        "response_prompt": "How did you decide which number was larger, and what does the zero in your vault code do?",
        "self_check": "Did I put each digit in the right place? Did I use zero as a placeholder? Is my expanded form correct? Did I compare from the left? Did I explain my thinking?",
        "accessibility_notes": "Allow digit cards or a place value chart to be used throughout. A number can be said aloud instead of written. Reduce the task to one decoy code if needed. Base-ten blocks or coins can model each place.",
        "interactive_activities": [
            {
                "type": "flip_cards",
                "title": "Quest Codex: key terms",
                "cards": [
                    {"front": "🔢 Digit", "back": "One of the ten symbols 0 to 9 used to write numbers."},
                    {"front": "📍 Place value", "back": "The value of a digit depends on its position in the number."},
                    {"front": "0️⃣ Placeholder", "back": "A zero that holds a place so other digits stay in the correct positions."},
                    {"front": "🧩 Expanded form", "back": "A number written as the value of each digit added together, like 6,000 + 200 + 70 + 4."},
                    {"front": "⚖️ Compare", "back": "Start at the left. The first place where digits differ decides which number is larger."},
                    {"front": "🍰 Tenth", "back": "One of ten equal parts of a whole, written 0.1."}
                ]
            }
        ],
        "sort_activity": {
            "title": "Place finder",
            "instructions": "Each card shows the digit 4 in a number. Tap the place where the 4 sits, then press Check.",
            "buckets": ["Ones", "Tens", "Hundreds", "Thousands"],
            "items": [
                {"text": "The 4 in 3,004", "answer": 0},
                {"text": "The 4 in 1,340", "answer": 1},
                {"text": "The 4 in 6,402", "answer": 2},
                {"text": "The 4 in 4,205", "answer": 3},
                {"text": "The 4 in 8,974", "answer": 0},
                {"text": "The 4 in 2,041", "answer": 1},
                {"text": "The 4 in 5,421", "answer": 2},
                {"text": "The 4 in 4,999", "answer": 3}
            ]
        },
        "word_challenges": [
            {"question": "In 6,305 the zero is a ___ that keeps the other digits in place.", "options": ["placeholder", "tenth", "thousand"], "correct_index": 0, "explanation": "A zero that holds an empty place is a placeholder."},
            {"question": "6,000 + 200 + 70 + 4 is the ___ form of 6,274.", "options": ["expanded", "rounded", "decimal"], "correct_index": 0, "explanation": "Expanded form shows the value of every digit."},
            {"question": "One of ten equal parts of a whole is a ___.", "options": ["hundred", "tenth", "digit"], "correct_index": 1, "explanation": "A tenth is one of ten equal parts, written 0.1."},
            {"question": "The value of a digit depends on its position. This is called ___ value.", "options": ["place", "number", "total"], "correct_index": 0, "explanation": "Place value means a digit's worth depends on where it is."}
        ],
        "planner_fields": [
            {"key": "code", "label": "🔐 My vault code", "hint": "Write a four-digit number with at least one zero."},
            {"key": "words", "label": "🗣️ In words", "hint": "Write your code in words."},
            {"key": "expanded", "label": "🧩 Expanded form", "hint": "Write your code as the value of each digit added together."},
            {"key": "decoys", "label": "🎭 Two decoy codes", "hint": "Write two close codes, then order all three smallest to largest."}
        ],
        "steps": [
            {"title": "📜 Step 1: Accept the quest", "detail": "Read your mission and accept the quest.", "duration_minutes": 5},
            {"title": "📖 Step 2: Learn the locks", "detail": "Five short lessons: places, zero, expanded form, comparing and tenths. Each has an example and a quick try.", "duration_minutes": 15},
            {"title": "🔍 Step 3: Practise", "detail": "Flip the key-term cards, find the places in the sorter, and answer the word challenges. Do a printable worksheet if you wish.", "duration_minutes": 10},
            {"title": "🗝️ Step 4: Plan your vault", "detail": "Fill in your planner: your code, in words, expanded form and two decoys.", "duration_minutes": 5},
            {"title": "✍️ Step 5: Build the vault", "detail": "Complete the independent task on paper.", "duration_minutes": 15},
            {"title": "🛡️ Step 6: Clear the Quest check", "detail": "Answer the 10-question Quest check. You need 9 out of 10 to pass.", "duration_minutes": 5},
            {"title": "🏆 Step 7: Hand it in", "detail": "Check your work, explain your thinking to a family member and submit your evidence.", "duration_minutes": 5}
        ],
        "resources": [
            {
                "type": "article",
                "title": "BBC Bitesize: place value (search results)",
                "url": "https://www.bbc.co.uk/bitesize/search?q=place+value",
                "prompt": "Choose a short place value video or activity for ages 7 to 9."
            },
            {
                "type": "worksheet",
                "title": "Twinkl Australia: place value Year 3 worksheets (search results)",
                "url": "https://www.twinkl.com.au/search?q=place+value+year+3",
                "prompt": "Choose a printable place value worksheet. Log in to your Twinkl account to download."
            },
            {
                "type": "worksheet",
                "title": "Twinkl Australia: tenths and decimals Year 3 (search results)",
                "url": "https://www.twinkl.com.au/search?q=tenths+decimals+year+3",
                "prompt": "Choose a printable tenths worksheet. Log in to your Twinkl account to download."
            }
        ],
        "quiz": [
            {"question": "What is the value of the 7 in 4,732?", "type": "multiple_choice", "options": ["7", "70", "700", "7,000"], "correct_index": 2, "explanation": "The 7 is in the hundreds place, so it is worth 700."},
            {"question": "Which number is four thousand and six?", "type": "multiple_choice", "options": ["4,600", "4,060", "4,006", "406"], "correct_index": 2, "explanation": "4 thousands, 0 hundreds, 0 tens and 6 ones is 4,006."},
            {"question": "Which is 5,208 in expanded form?", "type": "multiple_choice", "options": ["5,000 + 200 + 8", "500 + 20 + 8", "5,000 + 20 + 8", "5,000 + 2,000 + 8"], "correct_index": 0, "explanation": "5 thousands, 2 hundreds, 0 tens and 8 ones."},
            {"question": "Which number is the largest?", "type": "multiple_choice", "options": ["3,982", "3,892", "3,928", "3,289"], "correct_index": 0, "explanation": "All have 3 thousands. The hundreds digit 9 is the biggest in 3,982 and 3,928, and 8 in the tens beats 2."},
            {"question": "What digit is in the tens place of 6,305?", "type": "multiple_choice", "options": ["3", "0", "6", "5"], "correct_index": 1, "explanation": "The tens place holds a zero, which is a placeholder."},
            {"question": "What is 1,000 more than 4,562?", "type": "multiple_choice", "options": ["4,662", "5,562", "14,562", "4,572"], "correct_index": 1, "explanation": "Adding 1,000 changes only the thousands digit, from 4 to 5."},
            {"question": "What is 10 less than 7,000?", "type": "multiple_choice", "options": ["6,999", "6,900", "6,990", "7,010"], "correct_index": 2, "explanation": "7,000 minus 10 is 6,990."},
            {"question": "In 5.3, what does the 3 stand for?", "type": "multiple_choice", "options": ["3 ones", "3 tens", "3 tenths", "3 hundredths"], "correct_index": 2, "explanation": "The first digit after the decimal point is the tenths place."},
            {"question": "Which is the greatest?", "type": "multiple_choice", "options": ["0.07", "0.7", "0.17", "0.01"], "correct_index": 1, "explanation": "0.7 is seven tenths, which is 0.70 and larger than 0.17."},
            {"question": "Which list is in order from smallest to largest?", "type": "multiple_choice", "options": ["2,909, 2,099, 2,090", "2,090, 2,099, 2,909", "2,099, 2,090, 2,909", "2,090, 2,909, 2,099"], "correct_index": 1, "explanation": "Compare hundreds first: 2,090 and 2,099 have 0 hundreds and 2,909 has 9. Then 2,090 is smaller than 2,099."}
        ],
        "reflection_prompts": ["Which lock was hardest to crack, and what helped?", "Where in real life do you see numbers with thousands or tenths?"],
        "evidence_instructions": "Upload a photo of your vault page showing your code in words, in expanded form and in a place value chart, plus your three codes in order with your explanation, and your tenths dial reading.",
        "parent_notes": "Five mini lessons (places, zero as placeholder, expanded form, comparing, tenths) each give an explanation, an example and a quick check. The child then flips key-term cards, sorts digits by place, answers word challenges, uses an optional printable worksheet, plans and builds a vault code, and clears a 10-question Quest check (90%, so 9 out of 10, with retries). What to look for in the work: correct place for each digit, zero used as a placeholder, accurate expanded form, comparing from the left, and an explanation in the child's own words. Outcomes: MA2-RN-01 and MA2-RN-02 (introductory tenths only), plus MAO-WM-01. Verify the outcome wording on curriculum.nsw.edu.au.",
        "source_note": "Outcome codes checked against published NESA code lists. Parent to verify the exact wording of each outcome on the NSW Curriculum website.",
        "offline_alternative": "Use paper digit cards and a hand-drawn place value chart. Do the printable worksheet instead of the on-screen activities.",
        "extension": "Write a five-digit vault code and explain what changes in the chart. Then find the number that is 1 tenth more than 3.9.",
        "follow_up_challenges": [
            {"title": "The Rival Safe", "description": "Make a second code that is larger than your first by exactly 100 and explain which digit changed.", "type": "create", "difficulty": "medium", "evidence_type": "photo"},
            {"title": "Number Detective", "description": "Find five numbers with thousands in a newspaper, catalogue or website. Write each in words and expanded form.", "type": "investigation", "difficulty": "medium", "evidence_type": "photo"},
            {"title": "Explain it aloud", "description": "Teach a family member why a zero matters in 4,006 compared with 46.", "type": "speak", "difficulty": "stretch", "evidence_type": "audio"}
        ]
    }
]
