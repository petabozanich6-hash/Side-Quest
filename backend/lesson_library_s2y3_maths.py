# Stage 2 Year 3 Mathematics quests. Same structure as the Cartographer quest in lesson_library.py.
# Not yet registered in LESSON_LIBRARY; merge into that list and bump LESSON_LIBRARY_VERSION.
# Cross-over outcomes marked 'candidate' are my suggested fits; verify wording on curriculum.nsw.edu.au.

S2Y3_MATHS_LESSONS = [
    {
        "seed_key": "s2-y3-maths-place-value-vault-01",
        "library": True,
        "stage": "S2",
        "year_level": "Year 3",
        "learning_area": "Mathematics",
        "subject": "Representing numbers: place value, zero and tenths (with history and geography links)",
        "title": "The Vault of Numbers",
        "child_mission": "🔐 A treasure vault only opens for someone who can read, build and compare big numbers. Crack each lock, then use your skills on real numbers from Australia's past and from your own town.",
        "duration_minutes": 90,
        "duration_note": "Best split over two sittings: Part A (steps 1 to 6) about 50 minutes, Part B (cross-curricular investigation, steps 7 to 9) about 40 minutes.",
        "pass_mark": 0.9,
        "outcome_codes": ["MA2-RN-01", "MA2-RN-02", "MAO-WM-01"],
        "cross_outcome_codes": ["HS2-HIS-01", "HS2-GEO-01", "EN2-OLC-01"],
        "outcome_notes": {
            "MA2-RN-01": "Primary. Reads, writes, builds, partitions and compares four-digit numbers using place value, including zero as a placeholder (teach steps 1-4, quiz 1-7, timeline task).",
            "MA2-RN-02": "Introduces tenths as one of ten equal parts and places them on a number line (teach step 5, quiz 8-9). Wider decimal work continues in Year 4.",
            "MAO-WM-01": "Working mathematically: explains and justifies reasoning when comparing numbers, designing codes and checking a timeline (response prompt, evidence task, rubric).",
            "HS2-HIS-01 (candidate)": "Years and dates are numbers. The child orders real Australian events on a timeline and uses a source to find the year. Check the official outcome wording before recording this as covered.",
            "HS2-GEO-01 (candidate)": "The child collects a real population figure for their own place from an official source and reads it with place value. Check the official outcome wording before recording this as covered.",
            "EN2-OLC-01 (candidate)": "The child explains their reasoning aloud to a family member using mathematical vocabulary."
        },
        "learning_intention": "We are learning to read, write, build and compare four-digit numbers using place value, to understand tenths as parts of a whole, and to use these skills on real numbers from history and geography.",
        "success_criteria": [
            "I can say the value of each digit in a four-digit number.",
            "I can use zero as a placeholder and write numbers like four thousand and six.",
            "I can write a number in expanded form and partition it in more than one way (for example 1,250 is 1 thousand and 2 hundreds and 5 tens, or 12 hundreds and 5 tens).",
            "I can compare and order four-digit numbers and explain how I know.",
            "I can explain that one tenth is one of ten equal parts of a whole and show tenths on a number line.",
            "I can use years and populations as numbers to order events and places.",
            "I can score 90% or more on the Quest check."
        ],
        "key_vocabulary": ["digit", "place value", "ones", "tens", "hundreds", "thousands", "placeholder", "expanded form", "partition", "compare", "order", "tenth", "decimal point", "timeline", "population"],
        "materials": ["Paper and pencil", "Digit cards 0 to 9 (cut from paper, make two sets)", "Place value chart (draw four columns: Th, H, T, O)", "A ruler marked in centimetres and millimetres", "Optional: base-ten blocks, or coins and notes", "Device for the ABC Education video and the ABS QuickStats search"],
        "prior_knowledge": "Child can read and write three-digit numbers and knows that ten tens make one hundred.",
        "common_misconceptions": [
            {"misconception": "The child writes four thousand and six as 40006 or 4006 read as 'four hundred and six'.", "fix": "Build the number on the place value chart one column at a time, then read it back. Show that the zero holds the hundreds and tens places."},
            {"misconception": "The child thinks 0.7 is smaller than 0.17 because 7 is smaller than 17.", "fix": "Show both on a number line from 0 to 1 divided into tenths and hundredths, or use a ruler: 0.7 is seven tenths of the way along."},
            {"misconception": "The child compares numbers by adding their digits.", "fix": "Show that 1,900 and 1,090 have the same digit total but different values. Always compare from the left, one place at a time."},
            {"misconception": "The child reads the digit as its face value (the 7 in 4,732 is 'seven').", "fix": "Ask: how many hundreds is that? Say it as '7 hundreds, worth 700'."}
        ],
        "explicit_teaching": "Our number system uses ten digits, 0 to 9. The position of a digit decides its value. This is PLACE VALUE. In 3,658 the digit 3 is in the thousands place, so it is worth 3,000. The 6 is worth 600, the 5 is worth 50 and the 8 is worth 8.\n\nEach place is ten times the size of the place to its right: 10 ones make a ten, 10 tens make a hundred, 10 hundreds make a thousand.\n\nZero is a PLACEHOLDER. It holds a place so the other digits stay in the right positions. 4,036 has no hundreds, so a zero holds the hundreds place.\n\nWe can break a number into parts in EXPANDED FORM: 6,274 = 6,000 + 200 + 70 + 4. We can also PARTITION it in other ways: 6,274 = 5,000 + 1,200 + 74. To compare numbers, start at the left with the biggest place. The first place where the digits differ decides which number is larger.\n\nOne whole can be split into ten equal parts. Each part is one TENTH, written 0.1. So 2.3 means 2 wholes and 3 tenths.",
        "teach_steps": [
            {
                "icon": "🔢",
                "title": "Four places, four values",
                "explain": "A four-digit number has four places: THOUSANDS, HUNDREDS, TENS and ONES, reading from the left.\n\nEach digit is worth the digit times its place. The same digit is worth different amounts in different places. A 5 in the tens place is worth 50, but a 5 in the hundreds place is worth 500.\n\nTry it: lay out digit cards 3, 6, 5, 8 in a chart, then say the number.",
                "example": "3,658 = 3 thousands + 6 hundreds + 5 tens + 8 ones. Say it: three thousand, six hundred and fifty-eight.",
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
                "explain": "Sometimes a place is empty. We write a ZERO so the other digits stay where they belong.\n\nWithout zero, 4,036 would look like 436, which is a different number. The zero says: there are no hundreds here.\n\nTry it: build 4,036 with digit cards, then take away the zero card and read what is left.",
                "example": "Four thousand and thirty-six is written 4,036. There are 4 thousands, 0 hundreds, 3 tens and 6 ones.",
                "notice": "When you say a number and skip a place (no 'hundred' in the words), a zero holds that place.",
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
                "explain": "EXPANDED FORM breaks a number into the value of each digit and adds them. PARTITIONING is breaking a number into parts in any helpful way.\n\nThere is more than one way to partition. 1,250 can be 1,000 + 200 + 50, or 12 hundreds + 5 tens, or 1,000 + 250.\n\nTry it: partition 3,405 in two different ways.",
                "example": "6,274 = 6,000 + 200 + 70 + 4. Also 6,274 = 5,000 + 1,200 + 74.",
                "notice": "Each part in expanded form is the digit followed by the zeros that fill the places to its right.",
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
                "explain": "To compare, start at the LEFT, with the biggest place. If the digits match, move one place right. The first place where they differ decides.\n\nTo ORDER three or more numbers, compare them in pairs, or sort them by the thousands digit first, then the hundreds, then the tens.\n\nTry it: put 4,309, 4,390 and 4,039 in order from smallest to largest.",
                "example": "5,431 and 5,413. Thousands: 5 and 5, same. Hundreds: 4 and 4, same. Tens: 3 and 1, so 5,431 is larger. We write 5,431 > 5,413.",
                "notice": "Use the signs > (greater than) and < (less than). The open side faces the bigger number.",
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
                "explain": "Not every amount is a whole number. Split ONE whole into 10 equal parts and each part is one TENTH, written 0.1.\n\nThe dot is the decimal point. Digits to its right are parts of a whole. 2.3 means 2 wholes and 3 tenths. On a number line from 2 to 3, there are ten steps and 2.3 sits three steps after 2.\n\nTry it: use a ruler. One centimetre is split into 10 millimetres, so 3 mm is 0.3 of a centimetre.",
                "example": "A 2.3 m rope is 2 whole metres and 3 tenths of a metre (30 cm).",
                "notice": "0.5 is five tenths, which is half of one whole.",
                "check": {
                    "question": "0.5 is the same as how many tenths?",
                    "options": ["5 tenths", "50 tenths", "5 ones"],
                    "correct_index": 0,
                    "explanation": "The 5 sits in the tenths place, so 0.5 is five tenths."
                }
            }
        ],
        "worked_example": "The vault code is 7,305. READ IT: seven thousand, three hundred and five. PLACE VALUES: 7 thousands, 3 hundreds, 0 tens (the zero is a placeholder), 5 ones. EXPANDED: 7,000 + 300 + 5. PARTITION another way: 6,000 + 1,305. COMPARE it with 7,350: thousands and hundreds match, then the tens differ (0 and 5), so 7,350 is larger and 7,305 < 7,350. TENTHS: a dial reads 7.3, which is 7 wholes and 3 tenths.",
        "guided_practice": "Take the number 4,082. Write its value in each place, write it in expanded form, then write a number that is 10 more and a number that is 1,000 less. Explain in a sentence what the zero is doing.",
        "practice_questions": [
            {"q": "Write 2,907 in words.", "a": "Two thousand, nine hundred and seven."},
            {"q": "Write 8,000 + 600 + 3 as a number.", "a": "8,603"},
            {"q": "Partition 5,460 in two different ways.", "a": "For example 5,000 + 400 + 60, or 4,000 + 1,460, or 54 hundreds + 6 tens."},
            {"q": "Put these in order from largest to smallest: 6,120, 6,021, 6,210.", "a": "6,210, 6,120, 6,021"},
            {"q": "What number is 100 more than 3,950?", "a": "4,050 (the hundreds roll over to the thousands)."},
            {"q": "Mark 0.4 and 0.9 on a number line from 0 to 1. Which is closer to 1?", "a": "0.9 is closer to 1."}
        ],
        "hands_on_activity": "Digit card game for two. Each player shuffles ten digit cards 0 to 9 and turns over four to build the largest four-digit number they can. Players compare numbers and say why one is larger. Play 5 rounds. Then play again to make the smallest number, noticing where the zero goes.",
        "independent_task": "Design your own vault. Write a four-digit vault code that contains a zero. Show the code in words, in expanded form and in a place value chart. Write two decoy codes that are close to it, then put all three in order from smallest to largest and explain how you decided. Finish with a dial reading with tenths, such as 3.4, and explain what each digit means.",
        "cross_curricular": {
            "title": "Part B: Numbers from Australia's past and your own place",
            "hsie_link": "Years are numbers, so place value lets us order events on a timeline. Populations are numbers too, so place value helps us read and compare places. This links to HSIE Stage 2 History (HS2-HIS-01) and Geography (HS2-GEO-01), both candidate fits to be checked against the official outcome wording.",
            "timeline_task": {
                "title": "Timeline Vault",
                "instructions": "Write each year in words and in expanded form, then order the events from earliest to latest. Add the year of one more event you find yourself from a book or a trusted website.",
                "events": [
                    {"event": "The First Fleet arrived at Sydney Cove", "year": 1788},
                    {"event": "Australia's colonies joined to form the Commonwealth (Federation)", "year": 1901},
                    {"event": "Sydney Harbour Bridge opened", "year": 1932},
                    {"event": "Sydney Opera House officially opened", "year": 1973}
                ],
                "questions": [
                    "Which event happened first and how do you know?",
                    "Which digit decides the order when comparing 1,901 and 1,932?",
                    "What is the year that is 100 years after 1788? (1,888)",
                    "Choose any event and write its year as thousands + hundreds + tens + ones."
                ],
                "note": "Verify each year on a reliable source such as the National Museum of Australia or the Sydney Harbour Bridge and Opera House official sites before treating the dates as correct."
            },
            "population_task": {
                "title": "Population Vault",
                "instructions": "Use the Australian Bureau of Statistics QuickStats search to find the population of your suburb or town from the most recent Census. Write the number in words and expanded form. Then find a second nearby place and compare the two, saying which is larger and by how many thousands, rounded to the nearest thousand.",
                "url": "https://www.abs.gov.au/census/find-census-data/quickstats",
                "note": "Populations may be five or six digits. Extend the place value chart with ten thousands and hundred thousands if needed."
            },
            "maps_link": "Optional extension for later lessons: use grid references on a map of your town. This leads into MA2-GM-01 and HS2-GEO-01 together."
        },
        "response_prompt": "How did you decide which number was larger, and what does the zero in your vault code do? Explain it aloud to a family member using the words digit, place value and placeholder.",
        "self_check": "Did I put each digit in the right place? Did I use zero as a placeholder? Is my expanded form correct? Did I compare from the left? Did I check my timeline years against a source? Did I explain my thinking?",
        "accessibility_notes": "Allow digit cards or a place value chart to be used throughout. A number can be said aloud instead of written. Reduce the task to one decoy code and two timeline events if needed. Base-ten blocks or coins can model each place. For extension, use five-digit numbers and tenths and hundredths.",
        "rubric": {
            "title": "What to look for in the evidence",
            "levels": [
                {"level": "Getting started", "descriptor": "Writes the vault code but misplaces some digits or leaves out the zero placeholder. Needs prompting to compare numbers."},
                {"level": "Secure", "descriptor": "Writes the code correctly in words, expanded form and a place value chart. Orders three numbers and explains by comparing from the left. Describes tenths correctly."},
                {"level": "Strong", "descriptor": "Partitions numbers in more than one way, explains reasoning using vocabulary, orders timeline years accurately and checks the dates against a source."}
            ]
        },
        "interactive_activities": [
            {
                "type": "flip_cards",
                "title": "Quest Codex: key terms",
                "cards": [
                    {"front": "🔢 Digit", "back": "One of the ten symbols 0 to 9 used to write numbers."},
                    {"front": "📍 Place value", "back": "The value of a digit depends on its position in the number."},
                    {"front": "0️⃣ Placeholder", "back": "A zero that holds a place so other digits stay in the correct positions."},
                    {"front": "🧩 Expanded form", "back": "A number written as the value of each digit added together, like 6,000 + 200 + 70 + 4."},
                    {"front": "✂️ Partition", "back": "Break a number into parts in a helpful way. There is more than one way."},
                    {"front": "⚖️ Compare", "back": "Start at the left. The first place where digits differ decides which number is larger."},
                    {"front": "🍰 Tenth", "back": "One of ten equal parts of a whole, written 0.1."},
                    {"front": "🕰️ Timeline", "back": "A line that puts events in order by their year."}
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
            {"question": "The value of a digit depends on its position. This is called ___ value.", "options": ["place", "number", "total"], "correct_index": 0, "explanation": "Place value means a digit's worth depends on where it is."},
            {"question": "A line that puts events in order by year is a ___.", "options": ["graph", "timeline", "map"], "correct_index": 1, "explanation": "A timeline orders events by when they happened."}
        ],
        "planner_fields": [
            {"key": "code", "label": "🔐 My vault code", "hint": "Write a four-digit number with at least one zero."},
            {"key": "words", "label": "🗣️ In words", "hint": "Write your code in words."},
            {"key": "expanded", "label": "🧩 Expanded form", "hint": "Write your code as the value of each digit added together."},
            {"key": "decoys", "label": "🎭 Two decoy codes", "hint": "Write two close codes, then order all three smallest to largest."},
            {"key": "timeline", "label": "🕰️ Timeline year I found", "hint": "Write one extra event and its year, and where you found it."},
            {"key": "population", "label": "🏙️ My place's population", "hint": "Write the number, the place and where you found it."}
        ],
        "steps": [
            {"title": "📜 Step 1: Accept the quest", "detail": "Read your mission and accept the quest.", "duration_minutes": 5},
            {"title": "🎬 Step 2: Watch and warm up", "detail": "Watch the ABC Education place value video, then play the digit card game with a family member.", "duration_minutes": 15},
            {"title": "📖 Step 3: Learn the locks", "detail": "Five short lessons: places, zero, expanded form and partitioning, comparing, and tenths. Each has an example and a quick try.", "duration_minutes": 15},
            {"title": "🔍 Step 4: Practise", "detail": "Flip the key-term cards, find the places in the sorter, answer the word challenges, and do the practice questions. A printable worksheet is optional.", "duration_minutes": 10},
            {"title": "🗝️ Step 5: Plan and build your vault", "detail": "Fill in your planner, then complete the independent task on paper.", "duration_minutes": 15},
            {"title": "🛡️ Step 6: Clear the Quest check", "detail": "Answer the 10-question Quest check. You need 9 out of 10 to pass.", "duration_minutes": 5},
            {"title": "🕰️ Step 7: Timeline Vault", "detail": "Order four real Australian events by year and add one you find yourself.", "duration_minutes": 15},
            {"title": "🏙️ Step 8: Population Vault", "detail": "Find your place's population on ABS QuickStats and compare it with a nearby place.", "duration_minutes": 15},
            {"title": "🏆 Step 9: Explain and hand it in", "detail": "Explain your thinking aloud to a family member, check your work and submit your evidence.", "duration_minutes": 10}
        ],
        "resources": [
            {
                "type": "video",
                "title": "ABC Education: Place Value (topic page)",
                "url": "https://www.abc.net.au/education/topic-place-value/102224030",
                "prompt": "Watch an animated place value episode. Pause and say each number aloud."
            },
            {
                "type": "video",
                "title": "Maths Years 3-4 with Ms Kirszman: Our place value system (ABC Education)",
                "url": "https://www.abc.net.au/education/maths-years-3-4-with-ms-kirszman-our-place-value/13576914",
                "prompt": "Follow along with your own place value chart. Pay attention to how periods group the digits."
            },
            {
                "type": "video",
                "title": "ABC Mini Lessons Maths: Our Place Value (ABC iview, Years 3-4)",
                "url": "https://iview.abc.net.au/show/mini-lessons-maths/series/1/video/ED2003V012S00",
                "prompt": "Watch for renaming numbers and standard and non-standard partitioning."
            },
            {
                "type": "data",
                "title": "ABS Census QuickStats (find your place's population)",
                "url": "https://www.abs.gov.au/census/find-census-data/quickstats",
                "prompt": "Search your suburb or town. A parent should help with the search."
            },
            {
                "type": "article",
                "title": "HSIE K-6 curriculum resources (NSW Department of Education)",
                "url": "https://education.nsw.gov.au/teaching-and-learning/curriculum/hsie/hsie-curriculum-resources-k-12/hsie-k-6-curriculum-resources",
                "prompt": "For parents: browse the Stage 2 units for further history and geography links to build on this lesson."
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
            },
            {
                "type": "worksheet",
                "title": "Twinkl Australia: timeline activities Year 3 (search results)",
                "url": "https://www.twinkl.com.au/search?q=timeline+activity+year+3+history",
                "prompt": "Choose a printable timeline template. Log in to your Twinkl account to download."
            }
        ],
        "quiz": [
            {"question": "What is the value of the 7 in 4,732?", "type": "multiple_choice", "options": ["7", "70", "700", "7,000"], "correct_index": 2, "explanation": "The 7 is in the hundreds place, so it is worth 700."},
            {"question": "Which number is four thousand and six?", "type": "multiple_choice", "options": ["4,600", "4,060", "4,006", "406"], "correct_index": 2, "explanation": "4 thousands, 0 hundreds, 0 tens and 6 ones is 4,006."},
            {"question": "Which is 5,208 in expanded form?", "type": "multiple_choice", "options": ["5,000 + 200 + 8", "500 + 20 + 8", "5,000 + 20 + 8", "5,000 + 2,000 + 8"], "correct_index": 0, "explanation": "5 thousands, 2 hundreds, 0 tens and 8 ones."},
            {"question": "Which number is the largest?", "type": "multiple_choice", "options": ["3,982", "3,892", "3,928", "3,289"], "correct_index": 0, "explanation": "All have 3 thousands. 3,982 has the biggest digits in the hundreds and tens places."},
            {"question": "What digit is in the tens place of 6,305?", "type": "multiple_choice", "options": ["3", "0", "6", "5"], "correct_index": 1, "explanation": "The tens place holds a zero, which is a placeholder."},
            {"question": "What is 1,000 more than 4,562?", "type": "multiple_choice", "options": ["4,662", "5,562", "14,562", "4,572"], "correct_index": 1, "explanation": "Adding 1,000 changes only the thousands digit, from 4 to 5."},
            {"question": "Which event happened first? The Harbour Bridge opened in 1932 and the Opera House opened in 1973.", "type": "multiple_choice", "options": ["The Opera House", "The Harbour Bridge", "They happened in the same year", "You cannot tell"], "correct_index": 1, "explanation": "Compare thousands (1 and 1), then hundreds (9 and 9), then tens (3 and 7). 1,932 is smaller, so it happened first."},
            {"question": "In 5.3, what does the 3 stand for?", "type": "multiple_choice", "options": ["3 ones", "3 tens", "3 tenths", "3 hundredths"], "correct_index": 2, "explanation": "The first digit after the decimal point is the tenths place."},
            {"question": "Which is the greatest?", "type": "multiple_choice", "options": ["0.07", "0.7", "0.17", "0.01"], "correct_index": 1, "explanation": "0.7 is seven tenths, which is 0.70 and larger than 0.17."},
            {"question": "Which list is in order from smallest to largest?", "type": "multiple_choice", "options": ["2,909, 2,099, 2,090", "2,090, 2,099, 2,909", "2,099, 2,090, 2,909", "2,090, 2,909, 2,099"], "correct_index": 1, "explanation": "Compare hundreds first: 2,090 and 2,099 have 0 hundreds and 2,909 has 9. Then 2,090 is smaller than 2,099."}
        ],
        "reflection_prompts": ["Which lock was hardest to crack, and what helped?", "Where in real life do you see numbers with thousands or tenths?", "What did you learn about your place or about Australia's past from the numbers?"],
        "evidence_instructions": "Upload a photo of: (1) your vault page showing the code in words, expanded form and a place value chart, plus your three codes in order and your tenths dial reading; (2) your timeline with each year in words and your own added event, with the source you used; (3) your population numbers for two places, written in words and compared.",
        "parent_notes": "Nine steps over two sittings. Part A: watch the ABC Education video, play the digit card game, then five mini lessons (places, zero as placeholder, expanded form and partitioning, comparing, tenths) with checks, flip cards, a digit sorter, word challenges, practice questions, a vault-code build and a 10-question Quest check (90%, retries allowed). Part B uses the same skills on real numbers: a timeline of four Australian events plus one the child finds, and the population of the child's own place from ABS QuickStats. What to look for: correct place for each digit, zero used as a placeholder, accurate expanded form and partitioning, comparing from the left, and an explanation in the child's own words (use the rubric). Outcomes: MA2-RN-01, MA2-RN-02 (introductory tenths only), MAO-WM-01. Candidate cross-over outcomes HS2-HIS-01, HS2-GEO-01 and EN2-OLC-01: check the official wording on curriculum.nsw.edu.au before recording them. Check the timeline years against a reliable source.",
        "source_note": "Maths outcome codes checked against published NESA code lists. HSIE K-6 (2024) Stage 2 codes are HS2-ACH-01, HS2-GEO-01 and HS2-HIS-01; the cross-over fit is my suggestion and the exact wording should be verified on the NSW Curriculum website.",
        "offline_alternative": "Use paper digit cards and a hand-drawn place value chart. Do the printable worksheet instead of the on-screen activities. Use an atlas or local council booklet for the population figure if the ABS site is not available.",
        "extension": "Write a five-digit vault code and explain what changes in the chart. Find the number that is 1 tenth more than 3.9. Extend the timeline with five more events and work out how many years apart two events were.",
        "follow_up_challenges": [
            {"title": "The Rival Safe", "description": "Make a second code that is larger than your first by exactly 100 and explain which digit changed.", "type": "create", "difficulty": "medium", "evidence_type": "photo"},
            {"title": "Number Detective", "description": "Find five numbers with thousands in a newspaper, catalogue or website. Write each in words and expanded form.", "type": "investigation", "difficulty": "medium", "evidence_type": "photo"},
            {"title": "Family timeline", "description": "Build a timeline of five years from your own family's history and order them. Explain how you compared the years.", "type": "create", "difficulty": "medium", "evidence_type": "photo"},
            {"title": "Explain it aloud", "description": "Teach a family member why a zero matters in 4,006 compared with 46.", "type": "speak", "difficulty": "stretch", "evidence_type": "audio"}
        ]
    }
]
