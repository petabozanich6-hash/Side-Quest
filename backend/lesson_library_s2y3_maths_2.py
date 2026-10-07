# Stage 2 Year 3 Maths lessons 2 and 3 for Ollie. Same structure as the Cartographer quest.
# Not yet registered in LESSON_LIBRARY. Merge with lesson_library_s2y3_maths.py and bump LESSON_LIBRARY_VERSION.
# Parent preference: lessons must NOT contain reflection prompts, so strip_reflection() clears them.
# Resource links marked 'search' are search pages, not specific items. Pick a specific item before use.

MINI_LESSONS = "https://iview.abc.net.au/show/mini-lessons-maths"


def strip_reflection(lessons):
    for ls in lessons:
        ls["reflection_prompts"] = []
    return lessons


def _common(**kw):
    base = {
        "library": True,
        "stage": "S2",
        "year_level": "Year 3",
        "learning_area": "Mathematics",
        "pass_mark": 0.9,
        "reflection_prompts": [],
        "accessibility_notes": "Allow counters, a number line or a hundreds chart throughout. Answers can be spoken instead of written. Reduce the independent task to two problems if needed. Replay any video as often as needed.",
        "source_note": "Outcome codes checked against published NESA code lists. Parent to verify the exact outcome wording on curriculum.nsw.edu.au.",
    }
    base.update(kw)
    return base


LESSON_ADD_SUB = _common(
    seed_key="s2-y3-maths-add-subtract-bridge-02",
    subject="Addition and subtraction: strategies, missing numbers and checking",
    title="The Bridge Builder",
    child_mission="🌉 A river needs a bridge, and every plank counts. Use clever add and subtract strategies to work out how many planks you need, and check that your answer is right.",
    duration_minutes=75,
    outcome_codes=["MA2-AR-01", "MA2-AR-02", "MAO-WM-01"],
    cross_outcome_codes=["ST2-DDT-01"],
    outcome_notes={
        "MA2-AR-01": "Primary. Adds and subtracts two- to four-digit numbers using partitioning, jump strategy on a number line, compensation and counting up (steps 1-4, quiz 1-4, 7, 9, 10).",
        "MA2-AR-02": "Uses the inverse operation to check answers and find missing numbers, and works with fact families (step 5, quiz 5-6).",
        "MAO-WM-01": "Working mathematically: chooses a strategy, shows working and checks reasonableness by estimating (quiz 8, independent task, rubric).",
        "ST2-DDT-01 (candidate)": "Planning materials for a bridge connects to the design process in Science and Technology. Verify the official wording before recording it as covered.",
    },
    learning_intention="We are learning to add and subtract larger numbers using strategies, to find missing numbers, and to check answers using the opposite operation.",
    success_criteria=[
        "I can add by partitioning into hundreds, tens and ones.",
        "I can use jumps on a number line to add and subtract.",
        "I can add or subtract a number close to a hundred by rounding and adjusting.",
        "I can find a difference by counting up.",
        "I can find a missing number and check my answer using the opposite operation.",
        "I can score 90% or more on the Quest check.",
    ],
    key_vocabulary=["add", "subtract", "partition", "jump strategy", "compensate", "difference", "inverse", "fact family", "estimate", "missing number"],
    materials=["Paper and pencil", "Number line from 0 to 1,000 (draw an empty one)", "Counters or coins", "Hundreds chart (optional)", "Device"],
    prior_knowledge="Child can add and subtract two-digit numbers and knows place value to 1,000.",
    common_misconceptions=[
        {"misconception": "The child subtracts the smaller digit from the larger in each column, so 502 - 298 becomes 316.", "fix": "Use counting up or a number line. Ask whether the answer is reasonable by estimating 500 - 300."},
        {"misconception": "The child forgets to adjust after rounding: 364 + 99 = 464.", "fix": "Say it aloud: I added 1 too many, so I take 1 away. Show it with counters."},
        {"misconception": "The child thinks the two sides of an equals sign must read as 'work out the answer' only.", "fix": "Use a balance picture. 340 + 180 = 520 and 520 = 340 + 180 mean the same thing."},
    ],
    explicit_teaching="There are many ways to add and subtract. Good mathematicians choose a strategy that suits the numbers. PARTITION means split numbers into hundreds, tens and ones, add each part, then put them back together. The JUMP strategy uses a number line: start at the first number and jump by hundreds, then tens, then ones. COMPENSATION means rounding to a friendly number and adjusting. For example, to add 99, add 100 and take away 1. To find a DIFFERENCE, count up from the smaller number to the larger. Addition and subtraction are INVERSE operations because they undo each other. We can use that to check answers and to find missing numbers. A FACT FAMILY shows how three numbers connect: 340 + 180 = 520, 180 + 340 = 520, 520 - 180 = 340, 520 - 340 = 180.",
    teach_steps=[
        {
            "icon": "🧱", "title": "Partition and add",
            "explain": "Split each number into hundreds, tens and ones. Add the hundreds, then the tens, then the ones. Then add your three answers.\n\nTry it: 316 + 253. Use a place value chart if you like.",
            "example": "245 + 132: 200 + 100 = 300, 40 + 30 = 70, 5 + 2 = 7. 300 + 70 + 7 = 377.",
            "notice": "Start with the biggest place so you know roughly how big the answer will be.",
            "check": {"question": "What is 316 + 253?", "options": ["569", "579", "469"], "correct_index": 0, "explanation": "300 + 200 = 500, 10 + 50 = 60 and 6 + 3 = 9. 500 + 60 + 9 = 569."},
        },
        {
            "icon": "🐸", "title": "Jump along the line",
            "explain": "Draw an empty number line. Start at the biggest number and jump: hundreds first, then tens, then ones. Write where you land after each jump.\n\nTry it: 347 + 120.",
            "example": "458 + 135: 458 + 100 = 558, 558 + 30 = 588, 588 + 5 = 593.",
            "notice": "You can also jump backwards to subtract. Always write each landing number.",
            "check": {"question": "What is 347 + 120?", "options": ["457", "467", "477"], "correct_index": 1, "explanation": "347 + 100 = 447, then 447 + 20 = 467."},
        },
        {
            "icon": "🎯", "title": "Round and adjust",
            "explain": "Numbers close to a hundred are friendly. To add 99, add 100 and take 1 away. To add 98, add 100 and take 2 away.\n\nTry it: 527 + 98.",
            "example": "364 + 99 = 364 + 100 - 1 = 463.",
            "notice": "You added too much, so you take the extra away.",
            "check": {"question": "What is 527 + 98?", "options": ["625", "635", "615"], "correct_index": 0, "explanation": "527 + 100 = 627, then take away 2 to get 625."},
        },
        {
            "icon": "🔍", "title": "Counting up to find the difference",
            "explain": "Subtraction asks how far apart two numbers are. Start at the smaller number and count up to the bigger one in friendly jumps. Add your jumps.\n\nTry it: 600 - 395.",
            "example": "502 - 298: 298 to 300 is 2, 300 to 500 is 200, 500 to 502 is 2. 2 + 200 + 2 = 204.",
            "notice": "Jump to the next hundred first, then jump in hundreds.",
            "check": {"question": "What is 600 - 395?", "options": ["205", "215", "195"], "correct_index": 0, "explanation": "395 to 400 is 5, then 400 to 600 is 200. 5 + 200 = 205."},
        },
        {
            "icon": "🔄", "title": "Opposites and missing numbers",
            "explain": "Add and subtract undo each other. If you know 340 + 180 = 520 then you also know 520 - 180 = 340. To find a missing number, use the opposite operation. To check an answer, use the opposite operation too.\n\nTry it: 340 + \u25a1 = 520.",
            "example": "340 + \u25a1 = 520. Think 520 - 340 = 180, so the missing number is 180. Check: 340 + 180 = 520.",
            "notice": "A fact family has three numbers and four sentences.",
            "check": {"question": "\u25a1 - 150 = 230. What is the missing number?", "options": ["380", "80", "280"], "correct_index": 0, "explanation": "Use the opposite operation: 230 + 150 = 380."},
        },
    ],
    worked_example="The bridge needs 1,250 planks and you have 678. How many more do you need? DIFFERENCE by counting up: 678 to 700 is 22, 700 to 1,000 is 300, 1,000 to 1,250 is 250. 22 + 300 + 250 = 572. CHECK with the opposite operation: 572 + 678 = 1,250. ESTIMATE: 1,250 - 700 is about 550, so 572 is reasonable.",
    guided_practice="The bridge needs 900 ropes and you have 465. Find how many more you need by counting up, then check by adding. Write your jumps on a number line.",
    practice_questions=[
        {"q": "456 + 223", "a": "679"},
        {"q": "705 - 382", "a": "323"},
        {"q": "245 + 99", "a": "344"},
        {"q": "1,000 - 357", "a": "643"},
        {"q": "528 + \u25a1 = 700", "a": "172"},
        {"q": "Check 321 + 458 = 779 using the opposite operation.", "a": "779 - 458 = 321, so the answer is right."},
    ],
    hands_on_activity="Build a bridge on the floor using 20 pieces of paper or blocks as planks. Roll two dice twice to make two three-digit numbers (for example 3, 4, 5 then 2, 1, 6). Add the numbers using a strategy, then find how many more planks you would need to reach 1,000.",
    independent_task="Plan three bridges. Bridge A needs 825 planks and you have 463. Bridge B needs 1,000 planks and you have 358. Bridge C needs 640 planks and you have 99 fewer than 640 in stock. For each one, choose a strategy, show the working on a number line or by partitioning, and check using the opposite operation. Then write a number sentence with a missing number for one of the bridges.",
    cross_curricular={"title": "Design link", "note": "Ask what material the bridge could be made from and why. This connects to the Science and Technology design process (candidate ST2-DDT-01). Verify outcome wording before recording."},
    response_prompt="Show your working for each bridge and circle the strategy you used.",
    self_check="Did I show every jump or part? Did I check using the opposite operation? Does my answer make sense when I estimate?",
    rubric={"title": "What to look for", "levels": [
        {"level": "Getting started", "descriptor": "Uses one strategy with support. Makes errors with regrouping or forgets to adjust. Needs prompting to check."},
        {"level": "Secure", "descriptor": "Chooses a suitable strategy, shows working on a line or in parts, finds the missing number and checks using the opposite operation."},
        {"level": "Strong", "descriptor": "Explains why a strategy suits the numbers, uses estimating to judge answers and writes their own missing-number sentence correctly."},
    ]},
    interactive_activities=[{"type": "flip_cards", "title": "Quest Codex: key terms", "cards": [
        {"front": "🧱 Partition", "back": "Split a number into hundreds, tens and ones to make adding easier."},
        {"front": "🐸 Jump strategy", "back": "Move along an empty number line in jumps of hundreds, tens and ones."},
        {"front": "🎯 Compensate", "back": "Round to a friendly number, then adjust. 99 is 100 minus 1."},
        {"front": "📏 Difference", "back": "How far apart two numbers are. Count up from the smaller to the larger."},
        {"front": "🔄 Inverse", "back": "The opposite operation. Add and subtract undo each other."},
        {"front": "👨\u200d👩\u200d👧 Fact family", "back": "Three numbers linked by two additions and two subtractions."},
        {"front": "🔮 Estimate", "back": "A quick, close guess made by rounding. Use it to check an answer makes sense."},
        {"front": "\u2753 Missing number", "back": "The unknown in a number sentence. Use the opposite operation to find it."},
    ]}],
    sort_activity={"title": "Estimate and sort", "instructions": "Estimate the answer, then sort each sum into the right group.", "buckets": ["Less than 500", "500 to 800", "More than 800"], "items": [
        {"text": "250 + 150", "answer": 0}, {"text": "320 + 280", "answer": 1}, {"text": "450 + 450", "answer": 2}, {"text": "700 - 300", "answer": 0},
        {"text": "999 - 250", "answer": 1}, {"text": "1,000 - 100", "answer": 2}, {"text": "612 - 12", "answer": 1}, {"text": "305 + 200", "answer": 1},
    ]},
    word_challenges=[
        {"question": "Adding 99 is the same as adding 100 and taking away ___.", "options": ["1", "9", "10"], "correct_index": 0, "explanation": "99 is one less than 100."},
        {"question": "The opposite of adding is ___.", "options": ["subtracting", "estimating", "partitioning"], "correct_index": 0, "explanation": "Adding and subtracting are inverse operations."},
        {"question": "How far apart two numbers are is called the ___.", "options": ["difference", "total", "digit"], "correct_index": 0, "explanation": "The difference is the gap between the two numbers."},
        {"question": "A close guess made by rounding is an ___.", "options": ["estimate", "answer", "inverse"], "correct_index": 0, "explanation": "An estimate helps check if an answer is sensible."},
    ],
    planner_fields=[
        {"key": "bridgeA", "label": "🌉 Bridge A plan", "hint": "Write the number sentence and the strategy you will use."},
        {"key": "bridgeB", "label": "🌉 Bridge B plan", "hint": "Write the number sentence and the strategy you will use."},
        {"key": "bridgeC", "label": "🌉 Bridge C plan", "hint": "Write the number sentence and the strategy you will use."},
        {"key": "missing", "label": "\u2753 My missing number sentence", "hint": "Write a sentence with a box and solve it."},
    ],
    steps=[
        {"title": "📜 Step 1: Accept the quest", "detail": "Read your mission and accept the quest.", "duration_minutes": 5},
        {"title": "🎬 Step 2: Watch and warm up", "detail": "Watch an ABC Mini Lessons Maths episode on adding or subtracting, then play the dice bridge game.", "duration_minutes": 15},
        {"title": "📖 Step 3: Learn the strategies", "detail": "Five short lessons: partition, jump, round and adjust, count up, and opposites. Each has an example and a quick try.", "duration_minutes": 15},
        {"title": "🔍 Step 4: Practise", "detail": "Flip the key-term cards, sort sums by estimate, answer word challenges and complete the practice questions.", "duration_minutes": 10},
        {"title": "🗝️ Step 5: Plan and build your bridges", "detail": "Fill in your planner, then complete the independent task on paper.", "duration_minutes": 20},
        {"title": "🛡️ Step 6: Clear the Quest check", "detail": "Answer the 10-question Quest check. You need 9 out of 10 to pass.", "duration_minutes": 5},
        {"title": "🏆 Step 7: Hand it in", "detail": "Check your work and submit your evidence.", "duration_minutes": 5},
    ],
    resources=[
        {"type": "video", "title": "ABC Mini Lessons: Maths (series page; choose an addition or subtraction episode for Years 3-4)", "url": MINI_LESSONS, "prompt": "Pick an episode on adding or subtracting. Pause and try each example first."},
        {"type": "worksheet", "title": "Twinkl Australia: addition and subtraction Year 3 (search)", "url": "https://www.twinkl.com.au/search?q=addition+subtraction+year+3", "prompt": "Choose a printable worksheet. Log in to your Twinkl account to download."},
        {"type": "worksheet", "title": "Twinkl Australia: missing number sentences Year 3 (search)", "url": "https://www.twinkl.com.au/search?q=missing+number+addition+subtraction+year+3", "prompt": "Choose a printable missing-number worksheet."},
    ],
    quiz=[
        {"question": "What is 234 + 125?", "type": "multiple_choice", "options": ["349", "359", "369", "259"], "correct_index": 1, "explanation": "200 + 100 = 300, 30 + 20 = 50 and 4 + 5 = 9. Total 359."},
        {"question": "What is 648 + 99?", "type": "multiple_choice", "options": ["737", "747", "757", "749"], "correct_index": 1, "explanation": "648 + 100 = 748, then take away 1 to get 747."},
        {"question": "What is 502 - 198?", "type": "multiple_choice", "options": ["304", "314", "394", "404"], "correct_index": 0, "explanation": "502 - 200 = 302, then add 2 back to get 304."},
        {"question": "What is 1,000 - 456?", "type": "multiple_choice", "options": ["544", "554", "644", "556"], "correct_index": 0, "explanation": "456 to 500 is 44, and 500 to 1,000 is 500. 44 + 500 = 544."},
        {"question": "250 + \u25a1 = 600. What is the missing number?", "type": "multiple_choice", "options": ["250", "350", "450", "850"], "correct_index": 1, "explanation": "600 - 250 = 350."},
        {"question": "Which is in the same fact family as 120 + 80 = 200?", "type": "multiple_choice", "options": ["200 - 80 = 120", "200 + 80 = 120", "120 - 80 = 200", "80 - 120 = 200"], "correct_index": 0, "explanation": "A fact family uses the same three numbers, with the total as the starting number when subtracting."},
        {"question": "A bridge needs 800 planks and you have 425. How many more do you need?", "type": "multiple_choice", "options": ["375", "385", "425", "475"], "correct_index": 0, "explanation": "425 to 500 is 75, and 500 to 800 is 300. 75 + 300 = 375."},
        {"question": "Which is the best estimate for 398 + 202?", "type": "multiple_choice", "options": ["500", "600", "700", "800"], "correct_index": 1, "explanation": "398 is about 400 and 202 is about 200. 400 + 200 = 600."},
        {"question": "Sam says 756 - 298 = 558. What is the correct answer?", "type": "multiple_choice", "options": ["458", "448", "558", "468"], "correct_index": 0, "explanation": "756 - 300 = 456, then add 2 back to get 458."},
        {"question": "What is 2,350 + 1,400?", "type": "multiple_choice", "options": ["3,650", "3,750", "3,850", "3,450"], "correct_index": 1, "explanation": "2,000 + 1,000 = 3,000, 300 + 400 = 700 and 50. Total 3,750."},
    ],
    evidence_instructions="Upload a photo of your work for all three bridges showing the strategy, the working and the check, plus your own missing-number sentence.",
    parent_notes="Seven steps, about 75 minutes. Teaches four strategies (partition, jump, round and adjust, count up) then the inverse operation for checking and missing numbers. Look for: a strategy chosen to suit the numbers, working shown, an estimate to judge reasonableness, and an opposite-operation check. Outcomes: MA2-AR-01, MA2-AR-02, MAO-WM-01. Candidate cross-over ST2-DDT-01 only if the child discusses bridge design; verify wording first. Video resource is a series page: choose one episode.",
    offline_alternative="Use paper number lines and counters. Do a printed worksheet instead of the on-screen activities.",
    extension="Work with four-digit numbers such as 2,450 + 1,799. Create your own bridge problem for someone else to solve.",
    follow_up_challenges=[
        {"title": "Shop Till You Drop", "description": "Use a catalogue to add three prices that total less than $1,000 and find the change.", "type": "investigation", "difficulty": "medium", "evidence_type": "photo"},
        {"title": "Bridge Designer", "description": "Draw a bridge and label how many pieces each part needs. Add up all the pieces.", "type": "create", "difficulty": "medium", "evidence_type": "photo"},
    ],
)


LESSON_MULT_DIV = _common(
    seed_key="s2-y3-maths-multiply-divide-market-03",
    subject="Multiplication and division: equal groups, arrays, facts and fact families",
    title="The Market Stall",
    child_mission="🍎 The market opens at dawn and you run the stall. Use equal groups, arrays and sharing to pack crates, fill baskets and serve every customer.",
    duration_minutes=75,
    outcome_codes=["MA2-MR-01", "MA2-MR-02", "MAO-WM-01"],
    cross_outcome_codes=[],
    outcome_notes={
        "MA2-MR-01": "Primary. Understands multiplication as equal groups and arrays, and builds facts for the 2, 3, 4, 5 and 10 times tables (steps 1-3, quiz 1-5).",
        "MA2-MR-02": "Understands division as sharing and grouping, uses fact families and solves word problems (steps 4-5, quiz 6-10).",
        "MAO-WM-01": "Working mathematically: chooses multiplication or division, draws an array or groups, explains the choice (sort activity, independent task, rubric).",
    },
    learning_intention="We are learning to use equal groups and arrays to multiply, to share and group to divide, and to use fact families to solve problems.",
    success_criteria=[
        "I can write a multiplication sentence for equal groups and arrays.",
        "I can use skip counting and patterns to work out 2, 3, 4, 5 and 10 times tables.",
        "I can show division as sharing equally and as making equal groups.",
        "I can write a fact family and use it to solve a missing number.",
        "I can decide whether to multiply or divide in a word problem and explain why.",
        "I can score 90% or more on the Quest check.",
    ],
    key_vocabulary=["equal groups", "array", "row", "column", "multiply", "divide", "share", "product", "fact family", "skip count"],
    materials=["Counters or dried beans (30)", "Paper and pencil", "Square grid paper", "Hundreds chart (optional)", "Device"],
    prior_knowledge="Child can skip count by 2s, 5s and 10s and understands equal groups from earlier years.",
    common_misconceptions=[
        {"misconception": "The child adds the numbers: 4 groups of 5 becomes 9.", "fix": "Build 4 groups of 5 counters, then count all. Write 5 + 5 + 5 + 5 = 20 and then 4 x 5 = 20."},
        {"misconception": "The child thinks 24 divided by 6 is 144.", "fix": "Ask: how many groups of 6 fit into 24? Build the groups with counters."},
        {"misconception": "The child thinks 3 x 7 and 7 x 3 are different amounts.", "fix": "Build a 3 by 7 array, then turn it so it is 7 by 3. The total stays 21."},
    ],
    explicit_teaching="MULTIPLICATION is a quick way to count EQUAL GROUPS. 4 groups of 5 is written 4 x 5 = 20. An ARRAY puts objects in rows and columns. 3 rows of 7 is 3 x 7 = 21, and turning the array shows 7 x 3 = 21. DIVISION is the opposite of multiplication. It can mean SHARING equally (20 shared among 4 is 5 each) or GROUPING (20 in groups of 4 makes 5 groups). A FACT FAMILY shows how multiplication and division connect: 3 x 8 = 24, 8 x 3 = 24, 24 / 3 = 8, 24 / 8 = 3. Patterns help: the 10 times table ends in 0, the 5 times table ends in 0 or 5, and the 4 times table is a double of a double.",
    teach_steps=[
        {
            "icon": "🛍️", "title": "Equal groups",
            "explain": "Equal groups mean every group has the same number. Count the groups, count how many are in each group, then multiply.\n\nTry it: 6 plates with 3 biscuits on each.",
            "example": "4 bags with 5 apples in each: 5 + 5 + 5 + 5 = 20, so 4 x 5 = 20.",
            "notice": "The first number is how many groups. The second is how many in each group.",
            "check": {"question": "There are 6 groups of 3. How many altogether?", "options": ["9", "18", "12"], "correct_index": 1, "explanation": "3 + 3 + 3 + 3 + 3 + 3 = 18, so 6 x 3 = 18."},
        },
        {
            "icon": "🧩", "title": "Arrays",
            "explain": "An array has rows and columns, like eggs in a carton. Multiply the rows by the number in each row.\n\nTry it: build 5 rows of 4 with counters, then turn it.",
            "example": "3 rows of 7 is 3 x 7 = 21. Turn it to get 7 rows of 3, so 7 x 3 = 21.",
            "notice": "Changing the order does not change the total.",
            "check": {"question": "An array has 5 rows of 4. How many are there?", "options": ["9", "20", "24"], "correct_index": 1, "explanation": "5 x 4 = 20."},
        },
        {
            "icon": "🔢", "title": "Facts and patterns",
            "explain": "Use skip counting and patterns. For the 10s, add a zero. For the 5s, count by 5 and check the last digit. For the 4s, double and double again.\n\nTry it: 8 x 4.",
            "example": "8 x 4: double 8 is 16, double 16 is 32. So 8 x 4 = 32.",
            "notice": "Practise a few facts every day. Speed comes from patterns, not from guessing.",
            "check": {"question": "What is 7 x 4?", "options": ["24", "28", "32"], "correct_index": 1, "explanation": "Double 7 is 14, and double 14 is 28."},
        },
        {
            "icon": "🧺", "title": "Sharing and grouping",
            "explain": "Division splits a total into equal parts. Sharing asks: how many in each group? Grouping asks: how many groups?\n\nTry it: share 18 counters between 3 baskets.",
            "example": "20 apples shared among 4 baskets is 5 each (20 / 4 = 5). 20 apples put in groups of 4 makes 5 groups.",
            "notice": "Think of the multiplication fact that fits: 4 x 5 = 20, so 20 / 4 = 5.",
            "check": {"question": "What is 18 / 3?", "options": ["5", "6", "7"], "correct_index": 1, "explanation": "3 x 6 = 18, so 18 / 3 = 6."},
        },
        {
            "icon": "🔄", "title": "Fact families and problems",
            "explain": "Three numbers make a fact family with two multiplications and two divisions. Use a fact family to find a missing number.\n\nTry it: \u25a1 x 6 = 42.",
            "example": "3 x 8 = 24, 8 x 3 = 24, 24 / 3 = 8 and 24 / 8 = 3.",
            "notice": "For a word problem ask: do I know the total, or do I know the group size?",
            "check": {"question": "Which belongs to the fact family of 6 x 4 = 24?", "options": ["24 / 4 = 6", "24 / 6 = 6", "6 / 24 = 4"], "correct_index": 0, "explanation": "24 divided by 4 is 6, using the same three numbers."},
        },
    ],
    worked_example="You have 6 crates with 8 apples in each. HOW MANY APPLES? 6 x 8 = 48 (double 6 x 4 = 24). You then share the 48 apples equally among 6 baskets. 48 / 6 = 8 (because 6 x 8 = 48). CHECK: 6 baskets x 8 apples = 48.",
    guided_practice="A stall has 5 boxes with 6 oranges in each. How many oranges? Then 30 oranges are shared equally among 5 families. How many does each family get? Draw an array for each.",
    practice_questions=[
        {"q": "7 x 5", "a": "35"},
        {"q": "9 x 10", "a": "90"},
        {"q": "6 x 4", "a": "24"},
        {"q": "24 / 3", "a": "8"},
        {"q": "40 / 5", "a": "8"},
        {"q": "There are 5 packs of 6 stickers. How many stickers?", "a": "30"},
    ],
    hands_on_activity="Market game. Use 30 counters as stock. Roll a die to decide how many bags to fill, and another die for how many in each bag. Write the multiplication sentence and check by counting. Then take all the counters and share them equally among 2, 3 or 5 customers and write the division sentence.",
    independent_task="Run your market stall for three customers. Customer 1 buys 4 bags of 6 plums. Customer 2 wants 36 grapes shared equally among 4 baskets. Customer 3 orders 8 boxes of 5 eggs. For each one, decide whether to multiply or divide, draw an array or groups, and write the number sentence with its fact family. Then write your own market problem for someone else to solve.",
    cross_curricular={"title": "Link idea", "note": "Costing a market stall (price per item) links to later money work in Maths. No other outcome link recorded for this lesson."},
    response_prompt="Show your array or groups for each customer and write the fact family.",
    self_check="Did I choose multiply or divide for the right reason? Did I draw or build the problem? Did I check by using the fact family?",
    rubric={"title": "What to look for", "levels": [
        {"level": "Getting started", "descriptor": "Uses counters or drawing to find answers with support. Mixes up multiply and divide in problems."},
        {"level": "Secure", "descriptor": "Writes correct sentences for groups and arrays, uses known facts for the 2, 3, 4, 5 and 10 tables, and completes fact families."},
        {"level": "Strong", "descriptor": "Explains which operation fits each problem, writes accurate problems of their own and checks with the inverse."},
    ]},
    interactive_activities=[{"type": "flip_cards", "title": "Quest Codex: key terms", "cards": [
        {"front": "🛍️ Equal groups", "back": "Groups that all have the same number in them."},
        {"front": "🧩 Array", "back": "Objects arranged in equal rows and columns."},
        {"front": "\u2716\ufe0f Multiply", "back": "Find the total of equal groups. 4 groups of 5 is 4 x 5 = 20."},
        {"front": "\u2797 Divide", "back": "Split a total into equal parts by sharing or grouping."},
        {"front": "🧺 Share", "back": "Divide a total equally so each group has the same amount."},
        {"front": "📊 Product", "back": "The answer to a multiplication."},
        {"front": "👨\u200d👩\u200d👧 Fact family", "back": "Two multiplications and two divisions made from the same three numbers."},
        {"front": "🦘 Skip count", "back": "Count in equal jumps, like 5, 10, 15, 20."},
    ]}],
    sort_activity={"title": "Which operation?", "instructions": "Read each market problem. Sort it by whether you multiply or divide.", "buckets": ["Multiply to find the total", "Divide to share or group"], "items": [
        {"text": "3 bags with 4 oranges each. How many in all?", "answer": 0}, {"text": "12 oranges shared among 3 kids.", "answer": 1},
        {"text": "5 rows of 6 chairs. How many chairs?", "answer": 0}, {"text": "20 pens put into 4 equal packs.", "answer": 1},
        {"text": "8 plates with 2 biscuits each.", "answer": 0}, {"text": "18 cards shared between 2 players.", "answer": 1},
        {"text": "4 boxes of 10 cupcakes.", "answer": 0}, {"text": "30 apples put into bags of 5.", "answer": 1},
    ]},
    word_challenges=[
        {"question": "Objects in equal rows and columns make an ___.", "options": ["array", "estimate", "inverse"], "correct_index": 0, "explanation": "That arrangement is called an array."},
        {"question": "The answer to a multiplication is the ___.", "options": ["product", "fact", "difference"], "correct_index": 0, "explanation": "The product is the result of multiplying."},
        {"question": "Splitting a total equally is ___.", "options": ["division", "addition", "estimating"], "correct_index": 0, "explanation": "Division splits a total into equal parts."},
        {"question": "Counting 5, 10, 15, 20 is ___ counting.", "options": ["skip", "jump", "fact"], "correct_index": 0, "explanation": "Counting in equal jumps is skip counting."},
    ],
    planner_fields=[
        {"key": "c1", "label": "🧺 Customer 1", "hint": "Multiply or divide? Write the number sentence."},
        {"key": "c2", "label": "🧺 Customer 2", "hint": "Multiply or divide? Write the number sentence."},
        {"key": "c3", "label": "🧺 Customer 3", "hint": "Multiply or divide? Write the number sentence."},
        {"key": "mine", "label": "📝 My own market problem", "hint": "Write a problem and its fact family."},
    ],
    steps=[
        {"title": "📜 Step 1: Accept the quest", "detail": "Read your mission and accept the quest.", "duration_minutes": 5},
        {"title": "🎬 Step 2: Watch and warm up", "detail": "Watch an ABC Mini Lessons Maths episode on multiplication or division, then play the market game.", "duration_minutes": 15},
        {"title": "📖 Step 3: Learn the skills", "detail": "Five short lessons: groups, arrays, facts, sharing and fact families.", "duration_minutes": 15},
        {"title": "🔍 Step 4: Practise", "detail": "Flip the key-term cards, sort the market problems, answer word challenges and do the practice questions.", "duration_minutes": 10},
        {"title": "🗝️ Step 5: Plan and run the stall", "detail": "Fill in your planner, then complete the independent task on paper.", "duration_minutes": 20},
        {"title": "🛡️ Step 6: Clear the Quest check", "detail": "Answer the 10-question Quest check. You need 9 out of 10 to pass.", "duration_minutes": 5},
        {"title": "🏆 Step 7: Hand it in", "detail": "Check your work and submit your evidence.", "duration_minutes": 5},
    ],
    resources=[
        {"type": "video", "title": "ABC Mini Lessons: Maths (series page; choose a multiplication or division episode for Years 3-4)", "url": MINI_LESSONS, "prompt": "Pick an episode on multiplication or division. Pause and try each example first."},
        {"type": "worksheet", "title": "Twinkl Australia: multiplication arrays Year 3 (search)", "url": "https://www.twinkl.com.au/search?q=multiplication+arrays+year+3", "prompt": "Choose a printable worksheet. Log in to your Twinkl account to download."},
        {"type": "worksheet", "title": "Twinkl Australia: division sharing Year 3 (search)", "url": "https://www.twinkl.com.au/search?q=division+sharing+grouping+year+3", "prompt": "Choose a printable division worksheet."},
    ],
    quiz=[
        {"question": "What is 4 x 6?", "type": "multiple_choice", "options": ["20", "24", "28", "10"], "correct_index": 1, "explanation": "4 groups of 6 is 24."},
        {"question": "What is 7 x 5?", "type": "multiple_choice", "options": ["30", "35", "40", "12"], "correct_index": 1, "explanation": "Count by 5s seven times: 35."},
        {"question": "What is 8 x 10?", "type": "multiple_choice", "options": ["18", "80", "800", "88"], "correct_index": 1, "explanation": "8 tens is 80."},
        {"question": "What is 9 x 3?", "type": "multiple_choice", "options": ["27", "12", "24", "36"], "correct_index": 0, "explanation": "Count by 3s nine times: 27."},
        {"question": "What is 7 x 4?", "type": "multiple_choice", "options": ["21", "24", "28", "32"], "correct_index": 2, "explanation": "Double 7 is 14. Double 14 is 28."},
        {"question": "What is 32 / 4?", "type": "multiple_choice", "options": ["6", "7", "8", "9"], "correct_index": 2, "explanation": "4 x 8 = 32, so 32 / 4 = 8."},
        {"question": "What is 45 / 5?", "type": "multiple_choice", "options": ["8", "9", "10", "40"], "correct_index": 1, "explanation": "5 x 9 = 45, so 45 / 5 = 9."},
        {"question": "\u25a1 x 6 = 42. What is the missing number?", "type": "multiple_choice", "options": ["6", "7", "8", "9"], "correct_index": 1, "explanation": "42 / 6 = 7, so 7 x 6 = 42."},
        {"question": "There are 6 boxes with 8 eggs in each. How many eggs altogether?", "type": "multiple_choice", "options": ["42", "46", "48", "56"], "correct_index": 2, "explanation": "6 x 8 = 48."},
        {"question": "30 stickers are shared equally among 5 children. How many does each child get?", "type": "multiple_choice", "options": ["5", "6", "7", "25"], "correct_index": 1, "explanation": "30 / 5 = 6 because 5 x 6 = 30."},
    ],
    evidence_instructions="Upload a photo of your work for all three customers showing the array or groups, the number sentence and the fact family, plus your own market problem.",
    parent_notes="Seven steps, about 75 minutes. Builds multiplication from equal groups and arrays, uses patterns for the 2, 3, 4, 5 and 10 times tables, introduces division as sharing and grouping, and links them in fact families. Look for: correct choice of multiply or divide, a drawing or array, the correct number sentence and a fact family. Outcomes: MA2-MR-01, MA2-MR-02, MAO-WM-01. No cross-curricular outcome recorded. Video resource is a series page: choose one episode.",
    offline_alternative="Use real objects such as beans or buttons and a printed worksheet instead of on-screen activities.",
    extension="Use the 6, 7, 8 and 9 times tables, or write a two-step market problem that uses both multiplication and division.",
    follow_up_challenges=[
        {"title": "Pack the pantry", "description": "Find five items at home that come in equal groups (eggs, cans) and write a multiplication and a division sentence for each.", "type": "investigation", "difficulty": "medium", "evidence_type": "photo"},
        {"title": "Array artist", "description": "Make an array picture with stamps, stickers or drawn dots for 6 x 7. Show the turned array too.", "type": "create", "difficulty": "medium", "evidence_type": "photo"},
    ],
)

S2Y3_MATHS_LESSONS_2 = [LESSON_ADD_SUB, LESSON_MULT_DIV]
