"""Stage 4 Mathematics, Week 2 Lesson 5: Fortnightly mini exam, weeks 1 and 2 (Integers).
All written work is typed inside the lesson. Replaces the placeholder with seed_key s4-maths-w02-l5.
Plan slot: lesson 5 of an even-numbered week is a 45 minute mini exam (see lesson_library_s4_plan.py).
The exam covers W1 L1 to W2 L4 (topics 1 to 9 of the Integers unit). Pass mark stays at 90 percent from the plan.
No video is attached. Outcome codes MA4-INT-C-01 and MAO-WM-01 are from the draft mapping and should be re-checked against NESA.
To check: that build_s4 gives this lesson the 45 minute duration for the fifth slot, as the placeholder had.
"""
from lesson_library_s4_builder import build_s4, _q, _step, _sort, _wc

LESSON = build_s4(
    "s4-maths-w02-l5",
    "Week 2, Lesson 5: Fortnightly Mini Exam, Weeks 1 and 2 (Integers)",
    "Show what you know about integers. This mini exam covers comparing, adding and subtracting positive and negative numbers, patterns and rules, and mixed problems from the last two weeks.",
    "Integers",
    ["MA4-INT-C-01", "MAO-WM-01"],
    {
        "MA4-INT-C-01": "Primary. Compares, orders, adds and subtracts integers, including subtracting negatives, applies rules and patterns, and solves multi-step problems.",
        "MAO-WM-01": "Working mathematically: selects strategies, checks answers a second way, explains reasoning and corrects errors under timed conditions.",
    },
    "We are showing what we have learned about integers in Weeks 1 and 2, and finding which ideas need more practice.",
    ["I can compare and order integers.", "I can add integers with the same and different signs.", "I can use zero pairs and chips to explain an answer.", "I can subtract positive and negative integers.", "I can use patterns and rules to continue sequences and complete function machines.", "I can solve mixed addition and subtraction problems and check them.", "I can explain my thinking and spot a mistake."],
    ["integer", "zero pair", "opposite", "sequence", "rule", "running total", "inverse", "estimate"],
    ["This lesson (everything you need is inside it)", "Paper and pencil for working out", "A printed number line from -30 to 30 (optional)", "A timer for 45 minutes (optional)"],
    "You have completed Week 1 and Week 2 Lessons 1 to 4 on integers: comparing, adding, subtracting, zero pairs, patterns and mixed problems.",
    (
        "How the mini exam works. This is a 45 minute check on Weeks 1 and 2. Work on your own, without looking back at earlier lessons. The pass mark is 90 percent, so take your time and check each answer. If you do not pass, you can try again after reviewing the steps below.\n\n"
        "What is in it. Part 1 is a quick revision guide with five steps and a check question for each. Part 2 is the exam itself: 13 multiple choice questions (the quiz), then a short answer section and a problem solving section. Type your answers into the boxes.\n\n"
        "Exam strategies. Read each question twice. Write your working on paper, one line at a time. For every answer, decide whether the sign (positive, negative or zero) makes sense before you submit. If you are unsure, check with a second method such as the number line, chips or working backwards.\n\n"
        "Quick reminders. Negative numbers are to the left of zero on the number line and the larger number is always to the right. Opposites make zero. a + (-b) = a - b. a - (-b) = a + b. a - b = a + (-b). a - a = 0 and 0 - a = -a. In a long string, rewrite everything as additions, group the positives and negatives, then combine."
    ),
    [
        _step("1", "Comparing and ordering", "On the number line, numbers increase from left to right. Any negative number is less than any positive number, and a negative with a larger size is smaller.\n\nThis is the base for everything else in the unit.", "-10 < -7 < -2 < 0 < 3, so the order from least to greatest is -10, -7, -2, 0, 3.", "Further left means smaller.", ("Which is the smallest: -3, -8, 2 or -1?", ["-3", "-8", "2", "-1"], 1, "-8 is the furthest to the left.")),
        _step("2", "Adding integers", "For the same signs, add the sizes and keep the sign. For different signs, subtract the sizes and take the sign of the larger one.\n\nChips and zero pairs show why: opposites cancel.", "-4 + (-7) = -11. 6 + (-9) = -3. 12 + (-12) = 0.", "Same signs add up. Different signs cancel.", ("What is 6 + (-9)?", ["15", "3", "-3", "-15"], 2, "The larger size is 9 and it is negative, and 9 - 6 = 3, so the answer is -3.")),
        _step("3", "Subtracting integers", "Subtracting a positive moves left. Subtracting a negative is the same as adding a positive, so it moves right.\n\na - b is also the move from b to a on the number line.", "9 - 15 = -6. -11 - (-4) = -11 + 4 = -7. 6 - (-9) = 15.", "Subtract a negative: add the positive.", ("What is 6 - (-9)?", ["-3", "3", "15", "-15"], 2, "6 - (-9) = 6 + 9 = 15.")),
        _step("4", "Patterns and rules", "A sequence follows a rule such as add 5 or subtract 6. Find the rule from the change between terms, then continue it.\n\nA function machine applies its rule to every input.", "-14, -9, -4 has the rule add 5, so the next terms are 1 and 6. 15, 9, 3 has the rule subtract 6, so the next terms are -3 and -9.", "Same change each step.", ("The sequence 15, 9, 3 follows the rule subtract 6. What is the next term?", ["-3", "-9", "9", "-6"], 0, "3 - 6 = -3.")),
        _step("5", "Mixed problems", "Use a running total, or rewrite as additions and group positives and negatives. Work out brackets first.\n\nCheck by working backwards from the answer.", "8 - 11 + (-3) - (-6) = 8 + (-11) + (-3) + 6. Positives 14, negatives -14, so the answer is 0.", "Rewrite, group, combine, check.", ("What is 8 - 11 + (-3) - (-6)?", ["0", "-12", "12", "-6"], 0, "Positives 8 + 6 = 14, negatives -11 + (-3) = -14, so the total is 0.")),
    ],
    (
        "How to answer a longer exam question. Read this model answer for a mountain weather station. The temperature starts at -6 degrees at dawn. The sun adds 11 degrees, cloud takes off 9 degrees, a cold front adding -4 degrees passes and is taken away, and a storm takes off 13 degrees.\n\n"
        "Step 1, write one calculation. -6 + 11 - 9 - (-4) - 13.\n\n"
        "Step 2, running total. -6 + 11 = 5. 5 - 9 = -4. -4 - (-4) = 0. 0 - 13 = -13.\n\n"
        "Step 3, check by grouping. Rewrite as -6 + 11 + (-9) + 4 + (-13). Positives 11 + 4 = 15, negatives -6 + (-9) + (-13) = -28. 15 + (-28) = -13. It agrees.\n\n"
        "Step 4, check the sign. The negatives (28) are larger than the positives (15), so the answer must be negative, which it is.\n\n"
        "Step 5, answer in a sentence. The temperature at the end of the day is -13 degrees.\n\n"
        "Good work, {{name}}. In the exam, use the same pattern: write the calculation, solve it, check it, then answer in a sentence."
    ),
    (
        "Part 2, Section B (short answers). Type your answers in the practice boxes. B1: put -7, 3, -2, 0, -10 in order from least to greatest. B2: work out -8 + 5, 6 + (-9), -4 + (-7) and 12 + (-12). B3: use chips and zero pairs to explain 3 - 7. Say how many zero pairs you add and what is left. B4: work out 9 - 15, -5 - 8, -11 - (-4), 6 - (-9) and 0 - (-12). B5: rewrite 8 - 11 + (-3) - (-6) as additions, group the positives and negatives, and find the answer. B6: find the missing number in each. ? + (-6) = -2, 5 - ? = 11, -7 - ? = -10. B7: continue each pattern by two terms and state the rule: -14, -9, -4 and 15, 9, 3. B8: use the number line to work out -3 - (-8) as the move from one number to another. State where you start, where you end and which way you move. B9: a student writes -6 - (-2) = -8. Explain the mistake and give the correct answer. B10: work out 12 - (5 - 9)."
    ),
    (
        "Part 2, Section C (problem solving): Mountain Weather Station. At dawn the temperature is -6 degrees. The sun adds 11 degrees, then cloud takes off 9 degrees. A cold front that was lowering the temperature by 4 degrees then passes, so that 4 degree drop is taken away. Finally a storm takes off 13 degrees. Type your answers in the boxes.\n\n"
        "C(a) Write the whole day as one calculation and find the final temperature.\n"
        "C(b) Check your answer by working backwards from the final temperature.\n"
        "C(c) What was the highest temperature of the day, what was the lowest, and what is the difference between them?\n"
        "C(d) What change after the storm would bring the temperature back to exactly 0 degrees? Write it as an addition.\n"
        "C(e) Explain, using the number line or chips, why taking away a drop of 4 degrees makes the temperature go up. Write two or three sentences."
    ),
    "Type your answers in the practice boxes. Show your working for every question and write full sentences for the explanation questions.",
    "Did I check the sign of each answer, use a second method on the longer questions, show my working, and explain my reasoning in sentences?",
    [
        _q("Which list is in order from least to greatest?", ["-8, -3, -1, 2", "-1, -3, -8, 2", "2, -1, -3, -8", "-3, -8, -1, 2"], 0, "The least is -8, then -3, then -1, then 2."),
        _q("What is -6 + 9?", ["3", "-3", "15", "-15"], 0, "The larger size is 9 and it is positive, and 9 - 6 = 3."),
        _q("What is -7 + (-5)?", ["-12", "-2", "12", "2"], 0, "Same signs: add the sizes and keep the negative sign."),
        _q("What is 8 + (-13)?", ["5", "-5", "21", "-21"], 1, "The larger size is 13 and it is negative, and 13 - 8 = 5."),
        _q("Which pair of chips makes a zero pair?", ["Two positive chips", "One positive and one negative chip", "Two negative chips", "Three negative chips"], 1, "One positive and one negative chip cancel to zero."),
        _q("What is 5 - 9?", ["4", "-4", "14", "-14"], 1, "5 - 9 = -4."),
        _q("What is -4 - 6?", ["-10", "10", "2", "-2"], 0, "Subtracting 6 moves 6 left from -4."),
        _q("What is -3 - (-8)?", ["-11", "11", "5", "-5"], 2, "-3 - (-8) = -3 + 8 = 5."),
        _q("What is 0 - (-7)?", ["-7", "0", "14", "7"], 3, "0 + 7 = 7."),
        _q("A temperature starts at -5 degrees, rises 12 degrees and then falls 9 degrees. What is it now?", ["2", "-26", "-2", "26"], 2, "-5 + 12 - 9 = -2. Well done, {{name}}."),
        _q("What is -9 + 14 - (-6) - 20?", ["9", "-9", "29", "-29"], 1, "-9 + 14 = 5, 5 + 6 = 11, 11 - 20 = -9."),
        _q("A sequence starts at 12 and has the rule subtract 7. What is the fourth term?", ["-2", "5", "-9", "-16"], 2, "The terms are 12, 5, -2, -9."),
        _q("Which of these is NOT equal to 6 - (-4)?", ["6 + 4", "10", "6 + (-4)", "4 + 6"], 2, "6 - (-4) = 10, but 6 + (-4) = 2."),
    ],
    "Type your answers in the practice boxes and submit them. Include full sentences for B9, C(c), C(d) and C(e).",
    "Extension: write your own mini exam question. Make up a three-step story about money, temperature or scores that includes subtracting a negative. Write the calculation, solve it, check it by working backwards, and write a mark scheme saying how many marks each part is worth and why.",
    [("integer", "A whole number that can be positive, negative or zero"), ("zero pair", "One positive chip and one negative chip together, with a total value of zero"), ("opposite", "The number the same distance from zero on the other side, such as 6 and -6"), ("sequence", "A list of numbers that follows a rule"), ("rule", "A statement of what is done to get each term or output"), ("running total", "The total so far, updated after each step"), ("inverse", "The operation that undoes another"), ("estimate", "To find an approximate answer")],
    [],
    _sort("What sign is the answer?", "Work out each one, then sort it by whether the answer is positive, negative or zero.", ["Positive", "Negative", "Zero"], [("-5 + 2", 1), ("4 + (-4)", 2), ("-3 - (-7)", 0), ("6 - 9", 1), ("-2 - (-2)", 2), ("0 - 8", 1), ("9 + (-3)", 0), ("-10 + 15", 0)]),
    [
        _wc("Which is smaller: -9 or -2?", ["-9", "-2", "They are equal"], 0, "-9 is further left on the number line."),
        _wc("What is -4 + (-4)?", ["0", "-8", "8"], 1, "Same signs: add the sizes, keep the sign."),
        _wc("What is 7 + (-10)?", ["3", "17", "-3"], 2, "10 - 7 = 3 and the larger size is negative."),
        _wc("What is 10 - 14?", ["-4", "4", "24"], 0, "10 - 14 = -4."),
        _wc("What is -6 - (-6)?", ["-12", "0", "12"], 1, "A number minus itself is zero."),
        _wc("What is -2 - 5?", ["3", "-7", "7"], 1, "Subtracting 5 moves 5 left from -2."),
        _wc("What is 5 - (-5)?", ["0", "-10", "10"], 2, "5 + 5 = 10."),
        _wc("What is -1 + 6 - 8?", ["3", "-3", "-15"], 1, "-1 + 6 = 5, then 5 - 8 = -3."),
    ],
    [
        {"key": "b1", "label": "B1: order", "hint": "-7, 3, -2, 0, -10 from least to greatest."},
        {"key": "b2", "label": "B2: adding", "hint": "-8 + 5, 6 + (-9), -4 + (-7), 12 + (-12)."},
        {"key": "b3", "label": "B3: chips and zero pairs", "hint": "Explain 3 - 7 with chips. How many zero pairs? What is left?"},
        {"key": "b4", "label": "B4: subtracting", "hint": "9 - 15, -5 - 8, -11 - (-4), 6 - (-9), 0 - (-12)."},
        {"key": "b5", "label": "B5: rewrite and group", "hint": "8 - 11 + (-3) - (-6) as additions, group, combine."},
        {"key": "b6", "label": "B6: missing numbers", "hint": "? + (-6) = -2, 5 - ? = 11, -7 - ? = -10."},
        {"key": "b7", "label": "B7: patterns", "hint": "Next two terms and the rule for -14, -9, -4 and for 15, 9, 3."},
        {"key": "b8", "label": "B8: number line", "hint": "-3 - (-8): start, end, direction, answer."},
        {"key": "b9", "label": "B9: spot the error", "hint": "-6 - (-2) = -8. What went wrong? Correct answer?"},
        {"key": "b10", "label": "B10: brackets", "hint": "12 - (5 - 9)."},
        {"key": "c1", "label": "C(a): the whole day", "hint": "One calculation, then the final temperature."},
        {"key": "c2", "label": "C(b): backwards check", "hint": "Start from the final temperature and undo each step."},
        {"key": "c3", "label": "C(c): highest, lowest, difference", "hint": "Find the highest and lowest temperatures, then subtract."},
        {"key": "c4", "label": "C(d): back to zero", "hint": "What addition brings the final temperature to 0?"},
        {"key": "c5", "label": "C(e): explain", "hint": "Two or three sentences about taking away a drop of 4 degrees."},
    ],
    ["Treating subtracting a negative as subtracting a positive", "Thinking -8 is greater than -3 because 8 is greater than 3", "Giving the wrong sign when adding integers with different signs", "Losing a negative sign when rewriting a subtraction as an addition", "Ignoring brackets or working them out last", "Not checking the sign or using a second method"],
    ["Make a one-page summary of the five steps with one example each before you start.", "Use real chips or coins in two colours to check any answer you are unsure of.", "Practise with the timer on for 45 minutes and then mark your own work."],
    "Quiz answers: -8, -3, -1, 2; 3; -12; -5; one positive chip and one negative chip; -4; -10; 5; 7; -2; -9; 12, 5, -2, -9 (fourth term -9); 6 + (-4). Section B: B1: -10, -7, -2, 0, 3. B2: -3, -3, -11, 0. B3: start with 3 positive chips and add 4 zero pairs to get 7 positive and 4 negative chips; take away 7 positive chips and 4 negative chips are left, so 3 - 7 = -4. B4: -6, -13, -7, 15, 12. B5: 8 + (-11) + (-3) + 6; positives 14, negatives -14, answer 0. B6: 4 (since 4 + (-6) = -2); -6 (since 5 - (-6) = 11); 3 (since -7 - 3 = -10). B7: -14, -9, -4, 1, 6 with the rule add 5; 15, 9, 3, -3, -9 with the rule subtract 6. B8: start at -8, end at -3, move 5 steps right, so -3 - (-8) = 5. B9: the student treated subtracting -2 as subtracting 2; the correct answer is -6 + 2 = -4. B10: 12 - (5 - 9) = 12 - (-4) = 16. Section C: C(a): -6 + 11 - 9 - (-4) - 13 = -13, so the temperature is -13 degrees. C(b): -13 + 13 = 0, 0 - 4 = -4 (undo subtracting -4 by subtracting 4), -4 + 9 = 5, 5 - 11 = -6, which is the starting temperature. C(c): the highest was 5 degrees, the lowest was -13 degrees and the difference is 5 - (-13) = 18 degrees. C(d): add 13, since -13 + 13 = 0. C(e): the drop of 4 degrees is a negative change, and taking away a negative is the same as adding 4, which moves 4 steps right on the number line; with chips it means removing 4 negative chips (adding zero pairs if needed), which leaves the total higher. Pass mark is 90 percent.",
)
