"""Stage 2 Maths, Week 1 (four 60-minute lessons). LEAN CORE.
Teaching steps, worked example, practice, quiz and answer key only.
Sorters, word challenges, flip cards, planner, extras and videos are added in later passes.
Outcome codes: MA2-RWN-01 (place value), MA2-AR-01 (addition and subtraction)."""
from lesson_library_s2_english_w1_w2 import build, _q, _step

PASS = "I can score 90% or more on the Quest check."


def _lean(lesson, answer_key):
    lesson["learning_area"] = "Mathematics"
    lesson["reflection_prompts"] = []
    lesson["interactive_activities"] = []
    lesson["sort_activity"] = None
    lesson["word_challenges"] = []
    lesson["follow_up_challenges"] = []
    lesson["resources"] = []
    lesson["accessibility_notes"] = "Use real objects, coins or drawings whenever an idea feels abstract. Read questions aloud. Split the lesson into two sittings if needed."
    lesson["steps"] = [
        {"title": "Step 1: Accept the quest", "detail": "Read your mission and the learning goals.", "duration_minutes": 5},
        {"title": "Step 2: Learn the map", "detail": "Work through six short lessons. Each has an explanation, an example and a quick check.", "duration_minutes": 20},
        {"title": "Step 3: Study the worked example", "detail": "Read how the problems are solved, step by step.", "duration_minutes": 5},
        {"title": "Step 4: Apply it", "detail": "Complete the guided practice, then the independent task.", "duration_minutes": 20},
        {"title": "Step 5: Quest check", "detail": "Answer the 10-question check. You need 9 out of 10.", "duration_minutes": 5},
        {"title": "Step 6: Hand it in", "detail": "Check your work against the success criteria and submit your evidence.", "duration_minutes": 5},
    ]
    lesson["parent_notes"] = ("Practice lesson only. Quiz scores are formative; competency is decided by the fortnightly mini exam. "
                              "Every idea is built from the ground up, so go slowly and let him use real objects or drawings.\n\nAnswer key for the guided practice:\n"
                              + answer_key + "\n\nVerify the outcome mapping against the NESA Mathematics K-10 syllabus.")
    lesson["source_note"] = "Outcome codes from the NSW Mathematics K-10 Syllabus (NESA 2022), Stage 2. Parent to verify alignment on curriculum.nsw.edu.au."
    lesson["offline_alternative"] = "Complete all tasks on paper with real objects such as bundles of sticks or coins. Read the questions aloud."
    return lesson


def _lesson(key, title, mission, subject, codes, notes, intention, criteria, vocab, materials, prior, teaching,
            steps, worked, guided, independent, selfcheck, quiz, evidence, extension, mistakes, answer_key):
    base = build(key, title, mission, subject, codes, notes, intention, criteria, vocab, materials, prior, teaching,
                 steps, worked, guided, independent,
                 "Write your answers in your notebook and say them aloud to a listener.",
                 selfcheck, quiz, evidence, extension, [], [], None, [], [], mistakes, [], answer_key)
    return _lean(base, answer_key)


M1 = _lesson(
    "s2-math-w01-l1-place-value-to-1000", "Place Value Builders: Ones, Tens and Hundreds",
    "The Number Vault only opens for a builder who understands where every digit lives. Build numbers up to 999, read them, write them and put them in order.",
    "Number: place value to 1000", ["MA2-RWN-01"],
    {"MA2-RWN-01": "Primary. Builds, reads, writes, partitions, compares and orders three-digit numbers and explains zero as a place holder."},
    "We are learning how the place of a digit gives it its value in numbers up to 1000.",
    ["I can say the value of each digit in a three-digit number.", "I can build a number with hundreds, tens and ones.", "I can write a number in expanded form.", "I can explain what zero does in 305.", "I can compare and order three-digit numbers using < and >."],
    ["digit", "place value", "ones", "tens", "hundreds", "expanded form", "partition", "place holder"],
    ["Paper or notebook", "Pencil", "Bundles of 10 sticks or coins (optional)"],
    "Child can count to 100 and knows that ten ones make one ten.",
    "Every number is built from just ten digits: 0 to 9. So how can we make a number as big as 742? The secret is that a digit's value depends on its PLACE. The 7 in 742 is worth 700, because it sits in the hundreds place. This idea is called PLACE VALUE, and adding, subtracting, multiplying and dividing all depend on it.\n\nIn this lesson you start with the ones and tens you already know and build up to hundreds. You will make numbers, take them apart, say what each digit is worth, learn why zero matters, and put numbers in order.",
    [
        _step("1", "Digits and ones", "A DIGIT is a single symbol used to write numbers. There are ten: 0 to 9. The ONES place is the last digit on the right. Six single counters is 6 ones.\n\nWe can keep only 9 ones in the ones place. When we get a tenth one, we swap the ten ones for one new thing in the next place along. That swap is the next step.",
              "The number 8 is 8 ones. The number 25 has a 5 in the ones place, so 5 ones.", "The ones place is always the right-hand digit.",
              ("In the number 63, which digit is in the ones place?", ["6", "3", "63"], 1, "The right-hand digit is the ones digit.")),
        _step("2", "Tens: bundling ten ones", "Counting single objects is slow, so we bundle. Ten ones tied together make one TEN. The TENS place is the second digit from the right. In 47 there are 4 tens and 7 ones, so the 4 is worth 40 and 40 + 7 = 47.\n\nThink of a pencil case. If 10 pencils fit in a box, then 3 full boxes and 5 loose pencils is 35 pencils. The 3 counts boxes (tens) and the 5 counts loose ones.",
              "58 = 5 tens and 8 ones = 50 + 8. The 5 is worth 50.", "The same digit is worth different amounts in different places. In 55, the left 5 is worth 50 and the right 5 is worth 5.",
              ("What is the value of the 3 in 36?", ["3", "30", "300"], 1, "It is in the tens place, so it is 3 tens = 30.")),
        _step("3", "Hundreds: bundling ten tens", "Ten tens make one HUNDRED, like ten boxes of ten pencils packed in one carton of 100. The HUNDREDS place is the third digit from the right. In 342 there are 3 hundreds, 4 tens and 2 ones: 300 + 40 + 2.\n\nEach place is worth ten times the place to its right. The biggest three-digit number is 999. One more makes 1000.",
              "574 = 5 hundreds + 7 tens + 4 ones = 500 + 70 + 4.", "Ten ones make a ten. Ten tens make a hundred. Ten hundreds make a thousand.",
              ("How many tens are in one hundred?", ["1", "10", "100"], 1, "Ten tens make a hundred.")),
        _step("4", "Reading, writing and expanded form", "To READ a three-digit number say the hundreds, then 'and', then the tens and ones. 435 is 'four hundred and thirty-five'. To write from words, work in reverse: 'six hundred and eight' is 608.\n\nEXPANDED FORM writes a number as the sum of its place values: 435 = 400 + 30 + 5. Splitting a number like this is called PARTITIONING. To go back, write each part's digit in its own place: 700 + 20 + 9 = 729.",
              "Six hundred and twelve = 600 + 10 + 2 = 612. 281 = 200 + 80 + 1.", "Say it, write it and split it. All three describe the same number.",
              ("What is 300 + 40 + 6?", ["346", "364", "3 046"], 0, "3 hundreds, 4 tens, 6 ones is 346.")),
        _step("5", "Zero: the place holder", "Zero holds a place open so the other digits stay in the right places. Compare 35 and 305. 35 is 3 tens and 5 ones. 305 is 3 hundreds, no tens and 5 ones. Leave the zero out and 305 becomes 35, which is much smaller.\n\nZero can also sit at the end: 450 is 4 hundreds, 5 tens and 0 ones, so the 5 stays in the tens place and is worth 50.",
              "609 = 600 + 0 + 9. 570 = 500 + 70 + 0. 800 = 8 hundreds, 0 tens, 0 ones.", "Never leave a zero out when you write a number. It changes the value of every digit to its left.",
              ("What does the 0 mean in 407?", ["There are no tens", "There are no ones", "The number is small"], 0, "The zero is in the tens place, so there are 0 tens.")),
        _step("6", "Comparing and ordering", "To compare two numbers, look at the places from the LEFT. The biggest place decides first. If the hundreds match, look at the tens. If those match too, look at the ones. The symbol > means 'is greater than' and < means 'is less than'. The open mouth faces the bigger number.\n\n542 > 524 because the hundreds match (5), then 4 tens is more than 2 tens. Ascending order goes smallest to largest. Descending goes largest to smallest. 10 more than 347 is 357, and 100 less than 347 is 247.",
              "Order 316, 361 and 136: 136 has the smallest hundreds, so it is first. 316 and 361 both have 3 hundreds, and 1 ten < 6 tens. Order: 136, 316, 361.", "Start from the left. The first place that is different decides the answer.",
              ("Which is greater?", ["598", "589", "They are equal"], 0, "The hundreds match, and 9 tens is more than 8 tens.")),
    ],
    "Number 538. Hundreds: 5, worth 500. Tens: 3, worth 30. Ones: 8, worth 8. Expanded form: 500 + 30 + 8. In words: five hundred and thirty-eight. Compare with 583: hundreds match, 3 tens < 8 tens, so 538 < 583. 10 more than 538 is 548. 100 less is 438. Number 706: the zero means no tens, so it is 700 + 6, not 76.",
    "Work in your notebook. Part A: write the value of the 7 in 372, the 3 in 372, the 2 in 372, and the 9 in 905. Part B: write the number for 6 hundreds, 2 tens, 9 ones; for 4 hundreds, 0 tens, 7 ones; and for 3 hundreds and 9 tens. Part C: write 483, 750 and 206 in expanded form. Part D: put <, > or = in 459 __ 495; 612 __ 621; 300 + 20 + 5 __ 325. Part E: put 807, 780, 870 and 708 in ascending order. Part F: write 10 more and 100 less than 624.",
    "Stage 1 (make): use paper, coins, bundles or drawings to build three numbers: one with a zero in the tens place, one with a zero in the ones place and one with no zeros.\nStage 2 (record): write each in digits, words and expanded form, and say the value of each digit.\nStage 3 (compare): write two three-digit numbers of your own, compare them with < or >, and explain which place decided it.\nStage 4 (order): write five three-digit numbers of your own and order them smallest to largest, then largest to smallest.",
    "Did I build three numbers? Did I write each in digits, words and expanded form? Did I include a zero? Did I compare two numbers and name the deciding place? Did I order five numbers both ways?",
    [
        _q("What is the value of the 7 in 472?", ["7", "70", "700"], 1, "The 7 is in the tens place."),
        _q("What number is 3 hundreds, 4 tens and 6 ones?", ["346", "364", "643"], 0, "Hundreds first, then tens, then ones."),
        _q("How many tens make one hundred?", ["1", "10", "100"], 1, "Ten tens make a hundred."),
        _q("What is 400 + 60 + 2?", ["426", "462", "4 062"], 1, "4 hundreds, 6 tens, 2 ones."),
        _q("What does the zero in 305 show?", ["There are no tens", "There are no hundreds", "There are no ones"], 0, "The zero holds the tens place."),
        _q("Which number is greater?", ["598", "589", "They are equal"], 0, "Hundreds match, and 9 tens is more than 8 tens."),
        _q("Which list is in ascending order?", ["245, 254, 425", "425, 254, 245", "254, 245, 425"], 0, "Ascending means smallest to largest."),
        _q("What is 100 more than 347?", ["357", "447", "348"], 1, "Add 1 to the hundreds digit."),
        _q("What is 10 less than 520?", ["510", "420", "519"], 0, "Take 1 from the tens digit."),
        _q("Which number is eight hundred and six?", ["860", "806", "8 006"], 1, "8 hundreds, 0 tens, 6 ones."),
    ],
    "Upload a photo of your three built numbers (digits, words and expanded form), your comparison and your two ordered lists.",
    "Make the biggest and smallest three-digit numbers you can using the digits 2, 7 and 5 once each, and explain how you chose.",
    ["Reading the digit as its face value (saying the 7 in 472 is 7 instead of 70).", "Leaving out the zero place holder (writing 35 for three hundred and five).", "Comparing from the right instead of the left.", "Mixing up < and >."],
    "Part A: 70; 300; 2; 900. Part B: 629; 407; 390. Part C: 400 + 80 + 3; 700 + 50; 200 + 6. Part D: 459 < 495; 612 < 621; 300 + 20 + 5 = 325. Part E: 708, 780, 807, 870. Part F: 10 more than 624 is 634; 100 less is 524.",
)

M2 = _lesson(
    "s2-math-w01-l2-place-value-to-10000", "Bigger Numbers: Thousands and Tens of Thousands",
    "The Number Vault has a second door, and it needs thousands. Grow your place value skills to four- and five-digit numbers.",
    "Number: place value to tens of thousands", ["MA2-RWN-01"],
    {"MA2-RWN-01": "Primary. Extends place value to thousands and tens of thousands: reads, writes, partitions, orders, and adds or subtracts 1, 10, 100 and 1000."},
    "We are learning how place value works for numbers up to tens of thousands.",
    ["I can say the value of each digit in a four- or five-digit number.", "I can read and write big numbers using spaces.", "I can write big numbers in expanded form.", "I can explain what zero does in a big number.", "I can order big numbers and find 1, 10, 100 and 1000 more or less."],
    ["thousands", "ten thousands", "digit", "place value", "expanded form", "ascending", "descending"],
    ["Paper or notebook", "Pencil", "Place value chart drawn on paper"],
    "Child can build and read three-digit numbers and knows ten tens make a hundred.",
    "Last lesson ended with 999. One more makes 1000. Ten hundreds make one THOUSAND, and ten thousands make one TEN THOUSAND. The pattern is the same as before: each place is worth ten times the place to its right.\n\nThe places from the right are ones, tens, hundreds, thousands and ten thousands. Big numbers are written with a small space after the thousands digit so they are easy to read, like 4 205 and 36 120.",
    [
        _step("1", "One thousand", "1000 is ten hundreds. It is written with four digits. The THOUSANDS place is the fourth digit from the right. In 3 482 there are 3 thousands, 4 hundreds, 8 tens and 2 ones.\n\nThink of 1000 as ten bundles of one hundred, or a thousand-dollar bundle made of ten hundred-dollar notes.",
              "3 482 = 3 000 + 400 + 80 + 2. The 3 is worth 3 000.", "The thousands digit is the first digit of a four-digit number.",
              ("What is the value of the 4 in 4 205?", ["40", "400", "4 000"], 2, "It is in the thousands place.")),
        _step("2", "Ten thousands", "Ten thousands make ten thousand, a five-digit number. The TEN THOUSANDS place is the fifth digit from the right. In 36 120 there are 3 ten thousands, 6 thousands, 1 hundred, 2 tens and 0 ones.\n\nSo the 3 is worth 30 000 and the 6 is worth 6 000.",
              "36 120 = 30 000 + 6 000 + 100 + 20.", "Count the places from the right: ones, tens, hundreds, thousands, ten thousands.",
              ("What is the value of the 6 in 36 120?", ["600", "6 000", "60 000"], 1, "It is in the thousands place.")),
        _step("3", "Reading and writing big numbers", "To read a big number, say the thousands part, then the rest. 5 308 is 'five thousand, three hundred and eight'. 23 405 is 'twenty-three thousand, four hundred and five'.\n\nWhen you write from words, write the thousands part first, then leave a space, then write the hundreds, tens and ones as three digits. If there are no tens, put a 0 there: 'five thousand, three hundred and eight' has no tens, so it is 5 308.",
              "Seven thousand and sixty = 7 060. Twelve thousand, five hundred = 12 500.", "The last three digits always make a full 'hundreds, tens, ones' group.",
              ("Which number is five thousand, three hundred and eight?", ["5 038", "5 308", "5 380"], 1, "5 thousands, 3 hundreds, 0 tens, 8 ones.")),
        _step("4", "Expanded form for big numbers", "Expanded form adds the value of each digit. 6 480 = 6 000 + 400 + 80. 23 405 = 20 000 + 3 000 + 400 + 5.\n\nTo build a number from expanded form, write each part in its own place and put a 0 wherever a place is missing. 20 000 + 3 000 + 400 + 5 has no tens, so the tens place is 0: 23 405.",
              "9 070 = 9 000 + 70. 40 506 = 40 000 + 500 + 6.", "A missing part in expanded form means a zero in that place.",
              ("What is 20 000 + 3 000 + 400 + 5?", ["23 045", "23 405", "2 345"], 1, "Write each digit in its place with a 0 for the tens.")),
        _step("5", "Zero in big numbers", "Zero is a place holder in big numbers too. In 40 500 the zero between the 4 and the 5 holds the thousands place, so there are no thousands. The zeros at the end hold the tens and ones.\n\nCompare 4 050 and 4 500. They use the same digits but 4 500 is 450 more, because the 5 is worth 500 in one and 50 in the other.",
              "4 050 = 4 000 + 50. 4 500 = 4 000 + 500.", "Each zero shows an empty place. Count the places carefully.",
              ("In 40 500, what does the zero between the 4 and the 5 show?", ["There are no thousands", "There are no hundreds", "The number is small"], 0, "That zero is in the thousands place.")),
        _step("6", "Ordering and 1, 10, 100, 1000 more or less", "To compare big numbers, count the digits first. A five-digit number is always bigger than a four-digit number. If the lengths match, compare from the left, one place at a time.\n\nTo find 1 000 more or less, change only the thousands digit. 1 000 more than 6 480 is 7 480. 10 less than 4 000 is 3 990 (the thousands and hundreds change because you cross a boundary).",
              "Order 9 909, 9 099 and 9 990: all have 9 thousands. Compare hundreds: 0, 9, 9. Then tens: 9 vs 9 tie, so look at ones. The order is 9 099, 9 909, 9 990.", "More digits means a bigger number. If digits are equal, start from the left.",
              ("Which is greater?", ["9 099", "9 909", "They are equal"], 1, "9 909 has 9 hundreds, 9 099 has 0 hundreds.")),
    ],
    "Number 47 306. Ten thousands: 4, worth 40 000. Thousands: 7, worth 7 000. Hundreds: 3, worth 300. Tens: 0, worth 0. Ones: 6, worth 6. Expanded form: 40 000 + 7 000 + 300 + 6. In words: forty-seven thousand, three hundred and six. 1 000 more is 48 306. 10 less is 47 296. Compare with 47 360: the hundreds match (3), tens 0 < 6, so 47 306 < 47 360.",
    "Work in your notebook. Part A: write the value of the 8 in 8 245; the 2 in 8 245; the 4 in 42 600; and the 5 in 15 070. Part B: write the number for 6 thousands, 0 hundreds, 5 tens, 9 ones; and for 3 ten thousands, 2 thousands, 7 ones. Part C: write 7 405, 30 062 and 9 800 in expanded form. Part D: put <, > or = in 5 432 __ 5 342; 12 500 __ 9 999; 4 000 + 300 + 20 __ 4 320. Part E: order 3 059, 3 509, 3 095 and 3 950 from smallest to largest. Part F: write 1 000 more, 100 less and 10 more than 6 480.",
    "Stage 1 (make): draw a place value chart to ten thousands and write three numbers on it: a four-digit number, a five-digit number and a number with at least one zero.\nStage 2 (record): write each in words and expanded form and say the value of each digit.\nStage 3 (compare): compare two of your numbers with < or > and name the deciding place.\nStage 4 (order): write five big numbers of your own and order them smallest to largest and largest to smallest.",
    "Did I make three numbers on a chart? Did I write each in words and expanded form? Did I include a zero? Did I compare two numbers and name the deciding place? Did I order five numbers both ways?",
    [
        _q("What is the value of the 4 in 4 205?", ["40", "400", "4 000"], 2, "It is in the thousands place."),
        _q("What is the value of the 6 in 36 120?", ["600", "6 000", "60 000"], 1, "It is in the thousands place."),
        _q("What number is 5 thousands, 3 hundreds, 0 tens and 8 ones?", ["5 038", "5 308", "5 380"], 1, "Write the digits in place order."),
        _q("How many hundreds make one thousand?", ["10", "100", "1"], 0, "Ten hundreds make a thousand."),
        _q("What is 20 000 + 3 000 + 400 + 5?", ["23 045", "23 405", "2 345"], 1, "There are no tens, so a 0 holds the tens place."),
        _q("What is 1 000 more than 6 480?", ["6 580", "7 480", "16 480"], 1, "Add 1 to the thousands digit."),
        _q("What is 10 less than 4 000?", ["3 990", "3 900", "3 999"], 0, "4 000 - 10 = 3 990."),
        _q("Which number is greater?", ["9 099", "9 909", "They are equal"], 1, "Compare the hundreds: 9 is more than 0."),
        _q("Which list is in ascending order?", ["1 205, 1 502, 2 105", "2 105, 1 502, 1 205", "1 502, 1 205, 2 105"], 0, "Ascending means smallest to largest."),
        _q("In 40 500, what does the zero between the 4 and the 5 show?", ["There are no thousands", "There are no hundreds", "The number is small"], 0, "That zero is in the thousands place."),
    ],
    "Upload a photo of your place value chart with three numbers, their words and expanded forms, your comparison and your two ordered lists.",
    "Use the digits 4, 0, 7, 2 and 9 once each to make the biggest and smallest five-digit numbers you can, and explain how you chose.",
    ["Writing 5 038 for five thousand, three hundred and eight (leaving the zero in the wrong place).", "Forgetting that a five-digit number is always bigger than a four-digit number.", "Changing the wrong digit when adding 1 000 or 100.", "Reading 4 050 and 4 500 as the same size."],
    "Part A: 8 000; 200; 2 000... check: the 4 in 42 600 is 2 thousands? NO. See worked answers: the 8 in 8 245 is 8 000; the 2 in 8 245 is 200; the 4 in 42 600 is 2... write down 4 ten thousands is wrong: 42 600 has 4 ten thousands, so the 4 is worth 40 000; the 5 in 15 070 is 5 000. Part B: 6 059; 32 007. Part C: 7 000 + 400 + 5; 30 000 + 60 + 2; 9 000 + 800. Part D: 5 432 > 5 342; 12 500 > 9 999; 4 000 + 300 + 20 = 4 320. Part E: 3 059, 3 095, 3 509, 3 950. Part F: 7 480; 6 380; 6 490.",
)

M3 = _lesson(
    "s2-math-w01-l3-addition-strategies", "Addition Strategies: Smart Ways to Add",
    "The Vault's keypad needs quick, clever adding. Learn four strategies, then choose the best one for each sum and check your answer.",
    "Number: addition strategies", ["MA2-AR-01"],
    {"MA2-AR-01": "Primary. Uses place value partitioning, jump and compensation strategies, regrouping and estimation to add two- and three-digit numbers."},
    "We are learning to choose an addition strategy that fits the numbers and to check that our answer is sensible.",
    ["I can add by partitioning into tens and ones.", "I can add on a number line using jumps.", "I can use near-ten (compensation) and near-double strategies.", "I can add three-digit numbers and regroup.", "I can estimate to check my answer."],
    ["add", "total", "partition", "regroup", "compensate", "estimate", "near double"],
    ["Paper or notebook", "Pencil", "Bundles or coins (optional)"],
    "Child knows place value to 1000 and basic addition facts to 20.",
    "Adding means putting groups together to find the TOTAL. There is no single best way to add. A good mathematician picks the strategy that makes the numbers easiest. For 46 + 37 you might split into tens and ones. For 49 + 26 you might use 50 instead of 49.\n\nWhichever strategy you use, you should also check that your answer is sensible by estimating. Adding in any order gives the same total: 18 + 27 = 27 + 18.",
    [
        _step("1", "Adding means combining", "Add means to combine two or more amounts. The answer is called the total or sum. The order of the numbers does not change the total, so 18 + 27 = 27 + 18. It is often easier to start with the bigger number and add on the smaller one.\n\nBefore you start, ask: are the numbers close to a ten? Are they near doubles? Can I split them easily? The answers to those questions pick your strategy.",
              "8 + 25: start with 25 and count on 8 to make 33.", "Start with the bigger number.",
              ("Which gives the same total as 18 + 27?", ["27 + 18", "18 - 27", "27 - 18"], 0, "Adding in either order gives the same total.")),
        _step("2", "Partitioning by place value", "Split each number into tens and ones, add the tens, add the ones, then combine. 46 + 37: tens 40 + 30 = 70; ones 6 + 7 = 13; total 70 + 13 = 83.\n\nThis strategy works for any two-digit sum. For three-digit numbers, split into hundreds, tens and ones as well.",
              "34 + 25: 30 + 20 = 50, 4 + 5 = 9, total 59. 258 + 135: 200 + 100 = 300, 50 + 30 = 80, 8 + 5 = 13, total 393.", "Add the biggest places first, then the smaller ones.",
              ("What is 34 + 25 using partitioning?", ["49", "59", "69"], 1, "30 + 20 = 50 and 4 + 5 = 9, so 59.")),
        _step("3", "Jump strategy on a number line", "Start at the bigger number and jump forward by the other number, in tens first and then ones. 67 + 25: start at 67, jump 20 to 87, then jump 5 to 92.\n\nYou can also jump to the next ten to make it easier: 67 + 3 = 70, then add the 22 left to reach 92.",
              "46 + 37: 46 + 30 = 76, then 76 + 7 = 83.", "Jump the tens first, then the ones.",
              ("What is 67 + 25?", ["82", "92", "91"], 1, "67 + 20 = 87, then 87 + 5 = 92.")),
        _step("4", "Near-ten (compensation) strategy", "When a number is just below a ten, add the ten and then take away the extra. 49 + 26: add 50 instead (50 + 26 = 76), then subtract the 1 you added too much: 75.\n\nThis works for 9s and 8s. 59 + 34: 60 + 34 = 94, minus 1 = 93.",
              "49 + 26 = 50 + 26 - 1 = 75. 38 + 45 = 40 + 45 - 2 = 83.", "Round up to the nearest ten, then fix the difference.",
              ("What is 49 + 26?", ["75", "65", "85"], 0, "50 + 26 = 76, minus 1 is 75.")),
        _step("5", "Near doubles and regrouping", "A double adds a number to itself: 35 + 35 = 70. If the numbers are one apart, it is a near double: 35 + 36 = 70 + 1 = 71.\n\nWhen ones add to more than 9, you regroup: ten ones become one new ten. 124 + 168: ones 4 + 8 = 12, so write 2 and regroup 1 ten. Tens 2 + 6 + 1 = 9. Hundreds 1 + 1 = 2. Total 292.",
              "36 + 37 = double 36 + 1 = 73. 124 + 168 = 292.", "Look for doubles and numbers that cross a ten.",
              ("What is 35 + 36?", ["70", "71", "81"], 1, "Double 35 is 70, plus 1 is 71.")),
        _step("6", "Estimate to check", "Before or after you add, round each number to the nearest ten or hundred and add the rounded numbers. This gives an estimate that tells you roughly how big the answer should be. 298 + 403 is about 300 + 400 = 700.\n\nIf your answer is far from the estimate, you made a mistake. Close is good: the exact answer 701 is very near 700.",
              "67 + 25 is about 70 + 30 = 100. The exact answer 92 is close, so it is sensible.", "Estimating catches big mistakes quickly.",
              ("Which estimate fits 298 + 403?", ["200 + 300", "300 + 400", "300 + 500"], 1, "Round to 300 and 400.")),
    ],
    "Problem: 258 + 135. Estimate: 260 + 140 is about 400. Partition: hundreds 200 + 100 = 300; tens 50 + 30 = 80; ones 8 + 5 = 13. Total 300 + 80 + 13 = 393. Check with jumps: 258 + 100 = 358, + 30 = 388, + 5 = 393. The estimate 400 is close to 393, so the answer is sensible. Problem: 49 + 26. Near-ten strategy: 50 + 26 = 76, minus 1 = 75.",
    "Work in your notebook. Part A (partition): 46 + 37, 52 + 29, 134 + 252. Part B (jump): 58 + 24, 76 + 18. Part C (near-ten): 49 + 33, 59 + 28, 38 + 45. Part D (near doubles): 25 + 26, 40 + 41. Part E (regroup): 124 + 168, 275 + 149. Part F: for each of 298 + 403 and 187 + 212, write an estimate first, then the exact answer.",
    "Stage 1 (choose): write six addition problems of your own, two with two-digit numbers, two near a ten and two with three digits.\nStage 2 (solve): solve each using the best strategy and write which strategy you used and why.\nStage 3 (check): estimate each one and say whether your answer is sensible.\nStage 4 (explain): pick one problem and solve it two different ways to show you get the same answer.",
    "Did I write six problems? Did I name a strategy for each? Did I estimate every answer? Did I solve one problem two ways?",
    [
        _q("What is 46 + 37?", ["73", "83", "93"], 1, "40 + 30 = 70 and 6 + 7 = 13, so 83."),
        _q("What is 49 + 26?", ["75", "65", "85"], 0, "50 + 26 = 76, minus 1 is 75."),
        _q("What is 34 + 25 using partitioning?", ["49", "59", "69"], 1, "30 + 20 = 50 and 4 + 5 = 9."),
        _q("What is 258 + 135?", ["383", "393", "493"], 1, "300 + 80 + 13 = 393."),
        _q("What is 35 + 36?", ["70", "71", "81"], 1, "Double 35 is 70, plus 1."),
        _q("Which estimate fits 298 + 403?", ["200 + 300", "300 + 400", "300 + 500"], 1, "Round to 300 and 400."),
        _q("What is a quick way to add 59?", ["Add 60 then subtract 1", "Add 50 then add 1", "Subtract 60"], 0, "59 is one less than 60."),
        _q("What is 67 + 25?", ["82", "92", "91"], 1, "67 + 20 = 87, then + 5 = 92."),
        _q("Which gives the same total as 18 + 27?", ["27 + 18", "18 - 27", "27 - 18"], 0, "Adding in either order gives the same total."),
        _q("What is 124 + 168?", ["282", "292", "392"], 1, "Ones 12, tens 9, hundreds 2: 292."),
    ],
    "Upload a photo of your six problems, the strategy and estimate for each, and the problem you solved two ways.",
    "Solve 387 + 456 using two different strategies and explain which was easier and why.",
    ["Forgetting to regroup when the ones add to more than 9.", "Adding the tens but forgetting the extra ten that was regrouped.", "Using the near-ten strategy and forgetting to subtract the extra.", "Skipping the estimate check."],
    "Part A: 83; 81; 386. Part B: 82; 94. Part C: 82; 87; 83. Part D: 51; 81. Part E: 292; 424. Part F: about 700, exact 701; about 400, exact 399.",
)

M4 = _lesson(
    "s2-math-w01-l4-subtraction-strategies", "Subtraction Strategies: Take Away and Find the Difference",
    "The Vault's second keypad needs you to take away and find the difference. Learn four strategies and prove each answer with the inverse operation.",
    "Number: subtraction strategies", ["MA2-AR-01"],
    {"MA2-AR-01": "Primary. Uses partitioning, counting up, jump strategies, estimation and the inverse operation to subtract two- and three-digit numbers."},
    "We are learning to subtract using strategies and to check our answers by adding.",
    ["I can explain subtraction as take away and as difference.", "I can subtract by partitioning and by jumping back.", "I can find a difference by counting up.", "I can subtract three-digit numbers.", "I can check a subtraction using addition (the inverse)."],
    ["subtract", "difference", "inverse operation", "fact family", "count up", "estimate"],
    ["Paper or notebook", "Pencil", "Bundles or coins (optional)"],
    "Child can add two- and three-digit numbers with a strategy.",
    "Subtraction answers two kinds of question. TAKE AWAY: you have 85 and use 32, how many are left? DIFFERENCE: one tower is 52 blocks and another is 71 blocks, how much taller is the second? Both are solved with subtraction.\n\nAddition and subtraction are INVERSE operations: one undoes the other. Because 24 + 48 = 72, we know 72 - 48 = 24. This gives a powerful way to check every subtraction answer.",
    [
        _step("1", "Take away and difference", "Take away means removing a part from a whole. 85 - 32: start with 85 and remove 32. Difference means comparing two amounts to see how far apart they are. The difference between 52 and 71 is how many more 71 is than 52.\n\nYou can find a difference by subtracting (71 - 52) or by counting up from the smaller number to the bigger one.",
              "Take away: 85 - 32 = 53. Difference: 71 - 52 = 19.", "Both situations use subtraction.",
              ("What is 85 - 32?", ["43", "53", "63"], 1, "80 - 30 = 50 and 5 - 2 = 3.")),
        _step("2", "Partitioning for subtraction", "When no ones need regrouping, split both numbers by place value and subtract each part. 85 - 32: 80 - 30 = 50, 5 - 2 = 3, so 53.\n\nThis works only when each digit in the first number is bigger than the matching digit in the second. When it isn't, use another strategy.",
              "96 - 41: 90 - 40 = 50, 6 - 1 = 5, so 55.", "Check that you can take each part away without going below zero.",
              ("What is 96 - 41?", ["45", "55", "65"], 1, "90 - 40 = 50 and 6 - 1 = 5.")),
        _step("3", "Jumping back", "Start at the first number and jump back by the second number, in tens first and then ones. 72 - 48: 72 - 40 = 32, then 32 - 8 = 24. You can also jump back 50 and then forward 2: 72 - 50 = 22, + 2 = 24.\n\nWhen a ones digit is too small, jump back to the next ten first. 72 - 48: 72 - 2 = 70, 70 - 6 = 64... check: better to use jumps of 40 and 8.",
              "100 - 37: 100 - 30 = 70, 70 - 7 = 63.", "Take away the tens first, then the ones.",
              ("What is 72 - 48?", ["24", "34", "26"], 0, "72 - 40 = 32, then 32 - 8 = 24.")),
        _step("4", "Counting up to find a difference", "Start at the smaller number and count up to the bigger number, adding the jumps. 52 to 71: 52 + 8 = 60, 60 + 10 = 70, 70 + 1 = 71. The jumps are 8 + 10 + 1 = 19, so the difference is 19.\n\nCounting up works well when the numbers are close, such as 98 and 103 or 497 and 520.",
              "From 38 to 61: 38 + 2 = 40, + 20 = 60, + 1 = 61. Difference is 2 + 20 + 1 = 23.", "Count up to the next ten, then the tens, then the ones.",
              ("What is the difference between 52 and 71?", ["18", "19", "21"], 1, "8 + 10 + 1 = 19.")),
        _step("5", "Three-digit subtraction", "Subtract the hundreds, then the tens, then the ones, using jumps. 543 - 218: 543 - 200 = 343, 343 - 10 = 333, 333 - 8 = 325.\n\nTo subtract from a number like 400, think of 400 - 156 as 400 - 100 = 300, 300 - 50 = 250, 250 - 6 = 244.",
              "543 - 218 = 325. 400 - 156 = 244.", "Take away the biggest part first.",
              ("What is 543 - 218?", ["335", "325", "425"], 1, "543 - 200 = 343, - 10 = 333, - 8 = 325.")),
        _step("6", "Inverse check and estimating", "Addition and subtraction undo each other. A fact family shows the link: 7 + 8 = 15, 8 + 7 = 15, 15 - 8 = 7, 15 - 7 = 8. To check a subtraction, add the answer back to the number you took away. If 72 - 48 = 24, then 24 + 48 should equal 72.\n\nAlso estimate first: 602 - 297 is about 600 - 300 = 300. The exact answer 305 is close, so it is sensible.",
              "Check 543 - 218 = 325: 325 + 218 = 543. Correct.", "Always add back to prove your subtraction.",
              ("Which fact is in the same family as 7 + 8 = 15?", ["15 - 8 = 7", "8 - 15 = 7", "15 + 8 = 7"], 0, "Subtraction undoes addition.")),
    ],
    "Problem: 543 - 218. Estimate: 540 - 220 is about 320. Jumps: 543 - 200 = 343, 343 - 10 = 333, 333 - 8 = 325. Check by adding: 325 + 218 = 543. The estimate 320 is close to 325. Problem: difference between 52 and 71. Count up: 52 + 8 = 60, 60 + 11 = 71. Difference 8 + 11 = 19. Check: 52 + 19 = 71.",
    "Work in your notebook. Part A (partition): 85 - 32, 96 - 41, 478 - 253. Part B (jump back): 72 - 48, 100 - 37, 91 - 56. Part C (count up): the difference between 38 and 61, 497 and 520, 52 and 71. Part D (three digits): 543 - 218, 400 - 156. Part E: check two of your answers by adding. Part F: estimate 602 - 297, then find the exact answer.",
    "Stage 1 (choose): write six subtraction problems of your own: two take-away, two difference and two with three-digit numbers.\nStage 2 (solve): solve each with a strategy and write which strategy you used and why.\nStage 3 (check): check every answer by adding back, and write the addition.\nStage 4 (explain): write a fact family for one of your problems.",
    "Did I write six problems? Did I name a strategy for each? Did I check every answer by adding? Did I write a fact family?",
    [
        _q("What is 85 - 32?", ["43", "53", "63"], 1, "80 - 30 = 50 and 5 - 2 = 3."),
        _q("What is 72 - 48?", ["24", "34", "26"], 0, "72 - 40 = 32, then 32 - 8 = 24."),
        _q("How can you check 72 - 48 = 24?", ["24 + 48", "72 + 48", "48 - 24"], 0, "Add the answer back to the number you took away."),
        _q("What is 100 - 37?", ["73", "63", "67"], 1, "100 - 30 = 70 and 70 - 7 = 63."),
        _q("What is 543 - 218?", ["335", "325", "425"], 1, "543 - 200 = 343, - 10 = 333, - 8 = 325."),
        _q("What is the difference between 52 and 71?", ["18", "19", "21"], 1, "52 + 19 = 71."),
        _q("Which fact is in the same family as 7 + 8 = 15?", ["15 - 8 = 7", "8 - 15 = 7", "15 + 8 = 7"], 0, "Subtraction undoes addition."),
        _q("Which is the best estimate for 602 - 297?", ["600 - 300", "700 - 200", "600 - 200"], 0, "Round 602 to 600 and 297 to 300."),
        _q("What does subtraction help you find?", ["What is left, or the difference", "Only the total", "Only a product"], 0, "Take away and difference both use subtraction."),
        _q("What is 400 - 156?", ["254", "244", "344"], 1, "400 - 100 = 300, - 50 = 250, - 6 = 244."),
    ],
    "Upload a photo of your six problems, the strategy for each, your adding-back checks and your fact family.",
    "Find the difference between 1 002 and 897 by counting up, and explain why counting up was easier than taking away.",
    ["Subtracting the smaller digit from the bigger in each place instead of regrouping.", "Forgetting to add back to check.", "Mixing up which number is taken away.", "Counting up but forgetting a jump when adding the total."],
    "Part A: 53; 55; 225. Part B: 24; 63; 35. Part C: 23; 23; 19. Part D: 325; 244. Part E: any correct adding-back check. Part F: about 300, exact 305.",
)

WEEK_1 = [M1, M2, M3, M4]
