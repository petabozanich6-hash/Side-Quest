"""Stage 4 Mathematics, Week 2 Lesson 4: Integers, Mixed addition and subtraction problems.
All written work is typed inside the lesson. Replaces the placeholder with seed_key s4-maths-w02-l4.
No video is attached: none has been found and tested for this topic yet. Add one in the video and link run.
Outcome codes MA4-INT-C-01 and MAO-WM-01 are from the draft mapping and should be re-checked against NESA.
Builds on W2 L1 to L3. Next in the plan is W2 L5, the fortnightly mini exam (Weeks 1 and 2).
"""
from lesson_library_s4_builder import build_s4, _q, _step, _sort, _wc

LESSON = build_s4(
    "s4-maths-w02-l4",
    "Week 2, Lesson 4: Mixed Addition and Subtraction Problems",
    "Real problems rarely stop at one step. Learn to handle a whole string of additions and subtractions of integers, using a running total, rewriting as additions, grouping positives and negatives, and checking by working backwards.",
    "Integers",
    ["MA4-INT-C-01", "MAO-WM-01"],
    {
        "MA4-INT-C-01": "Primary. Solves multi-step problems that mix addition and subtraction of positive and negative integers, including subtracting negatives and brackets, using several strategies and checking results.",
        "MAO-WM-01": "Working mathematically: chooses an efficient strategy, checks a result by a second method including working backwards, and explains and corrects errors.",
    },
    "We are learning to solve problems that mix addition and subtraction of integers and to check our answers by a second method.",
    ["I can work from left to right using a running total.", "I can rewrite every subtraction as adding the opposite.", "I can group the positives and the negatives and then combine them.", "I can work out brackets first.", "I can use the sign and size of the totals to decide the sign of the answer.", "I can solve multi-step word problems with integers.", "I can check an answer by working backwards."],
    ["integer", "running total", "opposite", "brackets", "group", "positive", "negative", "inverse", "estimate"],
    ["This lesson (everything you need is inside it)", "Paper and pencil", "A printed number line from -30 to 30 (optional)"],
    "You can add and subtract integers, you know that subtracting a negative is the same as adding a positive, and you can continue integer patterns (Week 1 and Week 2 Lessons 1 to 3).",
    (
        "Why this matters. Scores, bank balances and temperatures change many times, not just once. If you can handle a whole string of additions and subtractions with confidence, you can handle most integer problems you will meet. This lesson gives you three reliable strategies and a way to check each answer.\n\n"
        "Strategy 1, running total. Work from left to right and keep a running total. 5 - 8 + 6: 5 - 8 = -3, then -3 + 6 = 3. Write the total after each step so that you do not lose track.\n\n"
        "Strategy 2, rewrite as additions. Turn every subtraction into adding the opposite. 5 - 8 - (-3) + (-2) becomes 5 + (-8) + 3 + (-2). Now everything is an addition, and the order does not matter.\n\n"
        "Strategy 3, group positives and negatives. After rewriting, add all the positive terms together and all the negative terms together, then combine the two totals. 5 + (-8) + 3 + (-2): positives 5 + 3 = 8, negatives -8 + (-2) = -10, so 8 + (-10) = -2.\n\n"
        "Brackets first. Work out anything inside brackets before the rest. 10 - (4 - 9): inside the brackets 4 - 9 = -5, so 10 - (-5) = 15.\n\n"
        "The sign of the answer. After grouping, compare the two totals. If the positives are larger in size, the answer is positive. If the negatives are larger in size, the answer is negative. If they are the same size, the answer is zero.\n\n"
        "Checking by working backwards. Start from the answer and undo each step in reverse order. Undo adding by subtracting and undo subtracting by adding. If you arrive back at the starting number, the answer is right. You can also check with a second strategy."
    ),
    [
        _step("1", "Running total", "Work from left to right. Write down the total after every step.\n\nThis is the most direct method and works for any string.", "5 - 8 + 6: 5 - 8 = -3, then -3 + 6 = 3.", "One step at a time, keep the total.", ("What is 4 - 9 + 7?", ["2", "-2", "12", "-12"], 0, "4 - 9 = -5, then -5 + 7 = 2.")),
        _step("2", "Rewrite as additions", "Turn every subtraction into adding the opposite. Subtracting a positive becomes adding a negative, and subtracting a negative becomes adding a positive.\n\nThe whole string is then a sum.", "5 - 8 - (-3) + (-2) = 5 + (-8) + 3 + (-2).", "Subtract means add the opposite.", ("-6 - (-4) is the same as -6 + what?", ["-4", "4", "6", "-10"], 1, "Subtracting -4 is the same as adding 4.")),
        _step("3", "Group positives and negatives", "Once everything is an addition, add the positive terms together and the negative terms together. Then combine the two totals.\n\nThis is fast and helps you avoid mistakes.", "5 + (-8) + 3 + (-2): positives 5 + 3 = 8, negatives -8 + (-2) = -10, so 8 + (-10) = -2.", "Positives together, negatives together.", ("What is 7 - 12 + 9 - 3?", ["1", "-1", "31", "-31"], 0, "Positives 7 + 9 = 16, negatives -12 + (-3) = -15, and 16 + (-15) = 1.")),
        _step("4", "Brackets first", "Work out what is inside brackets before anything else. Then continue with the rest of the string.\n\nSubtracting a bracket that has a negative answer is subtracting a negative.", "10 - (4 - 9) = 10 - (-5) = 15.", "Brackets first.", ("What is 8 - (3 - 10)?", ["1", "15", "-15", "21"], 1, "3 - 10 = -7, then 8 - (-7) = 15.")),
        _step("5", "Sign and size", "After you group, compare the totals. The sign of the answer is the sign of the group that is larger in size.\n\nThis lets you predict the sign before you calculate and spot mistakes.", "-15 + 8 - (-3) + 2 = -15 + 8 + 3 + 2. Positives total 13, negatives total -15. The negatives are larger, so the answer is -2.", "Which group is bigger?", ("What is -15 + 8 - (-3) + 2?", ["-2", "2", "-28", "28"], 0, "Positives 8 + 3 + 2 = 13, negatives -15, and 13 + (-15) = -2.")),
        _step("6", "Multi-step word problems", "In a story, each event is one step. Gains and credits are additions. Losses and payments are subtractions.\n\nWrite the whole string, then choose a strategy and calculate.", "You have $20. You spend $35, receive $12 and pay $9. 20 - 35 + 12 - 9 = -12, so you owe $12.", "Write the string, then solve it.", ("You start with $15, pay $22, are given $10 and pay $6. What is your balance?", ["-$3", "$3", "$53", "-$53"], 0, "15 - 22 + 10 - 6 = -3, so you owe $3.")),
        _step("7", "Check by working backwards", "Start from your answer and undo each step in reverse order. Undo an addition by subtracting and undo a subtraction by adding.\n\nYou can also use this to find a missing starting number.", "-3 - (-8) + 2 - 10 = -3. Undo: -3 + 10 = 7, 7 - 2 = 5, 5 - 8 = -3. The start was -3, so it matches.", "Undo the steps in reverse.", ("You start with a number, add 6 and subtract 9 and get 4. What was the start?", ["7", "19", "1", "-7"], 0, "Undo: 4 + 9 = 13, then 13 - 6 = 7.")),
    ],
    (
        "Scenario: In a quiz game, a team's score starts at 10. The rounds go: +25, -30, then a penalty of -15 is taken away, then +8, then -40. As a calculation: 10 + 25 - 30 - (-15) + 8 - 40.\n\n"
        "Step 1, running total. 10 + 25 = 35. 35 - 30 = 5. 5 - (-15) = 20. 20 + 8 = 28. 28 - 40 = -12. The final score is -12.\n\n"
        "Step 2, rewrite as additions. 10 + 25 + (-30) + 15 + 8 + (-40).\n\n"
        "Step 3, group. The positive terms are 10 + 25 + 15 + 8 = 58. The negative terms are -30 + (-40) = -70. Then 58 + (-70) = -12. It agrees with the running total.\n\n"
        "Step 4, check the sign. The negatives (70) are larger than the positives (58), so the answer must be negative, which it is.\n\n"
        "Step 5, check by working backwards. Start from -12. Undo -40 by adding 40, which gives 28. Undo +8 by subtracting 8, which gives 20. Undo subtracting -15 by subtracting 15, which gives 5. Undo -30 by adding 30, which gives 35. Undo +25 by subtracting 25, which gives 10. That is the starting score, so the answer is correct.\n\n"
        "Step 6, interpret. The team finished 12 points below zero.\n\n"
        "Reasoning check. Well done, {{name}}. Three strategies and a backwards check all agreed on the same answer."
    ),
    (
        "Work through these on paper or in the practice boxes. Part A (running total): work out 6 - 10 + 7, -4 + 9 - 8, 12 - 15 - 6, -7 - 3 + 14 and 20 - 35 + 8 - 3. Part B (rewrite and group): work out 8 - 12 - (-5) + 3, -6 - (-9) + (-4) - 7, 15 - (-8) - 20 + (-3), -10 + 4 - (-12) - 9 and -2 - (-2) - 2 - (-2). Part C (brackets first): work out 9 - (4 - 12), (-5 + 8) - (6 - 10) and 14 - (7 - 3 + 2). Part D (missing numbers by working backwards): find the number that goes in the gap. ? + 8 - 15 = -2, 10 - ? + 4 = 1, ? - (-7) + 3 = 0. Part E (spot the error): each of these has a mistake. Say what went wrong and give the correct answer: 5 - 9 + 3 = 5 - 12 = -7; -8 + 6 - (-2) = -8 + 6 - 2 = -4; 7 - (3 - 8) = 7 - 3 - 8 = -4. Part F (real problems): a bank balance starts at $50, you pay $80, deposit $35 and have a $20 fee taken away; the temperature starts at -4 degrees, rises 9, falls 13, falls 5 and rises 7. Write each as a calculation and answer in a sentence. Part G (write a story): write a short story to match 12 - 20 + 9 - 5 and work out the answer."
    ),
    (
        "Mission: Arcade Tournament Ledger. Three players each play five rounds. Each round either adds points, subtracts points, or removes a penalty (subtracts a negative). Kai starts at 0 and has +30, -45, then a penalty of -20 removed, +12, -50. Mia starts at -10 and has a penalty of -35 removed, -20, +15, a penalty of -5 removed, -40. Leo starts at 25 and has -40, +18, a penalty of -12 removed, -30, +22. Type your answers in the boxes.\n\n"
        "(a) Write Kai's whole calculation and find his final score using a running total.\n"
        "(b) Write Mia's whole calculation, rewrite it as additions, group the positives and negatives and find her final score.\n"
        "(c) Find Leo's final score, then check it by working backwards.\n"
        "(d) Rank the three players from highest to lowest, and find how many points Leo is ahead of Kai.\n"
        "(e) Kai plays a sixth round and wants a final score of exactly 0. What must the sixth round be? Write it as an addition and as a subtraction of a negative.\n"
        "(f) After Kai's first two rounds his score is -15. A student works out the penalty removal round as -15 - 20 and gets -35, instead of -15 - (-20). Explain in two or three sentences what mistake was made and give the correct total at that point.\n"
        "(g) Design your own five-round game for a player who starts at 0, with at least one penalty removed (subtracting a negative) and a final score of exactly -10. Show the calculation and check it a second way."
    ),
    "Type your answers in the practice boxes. Show each strategy, say how you checked, and write full sentences for the explanation questions.",
    "Did I keep a running total, rewrite subtractions as adding the opposite, group positives and negatives, work out brackets first, and check by working backwards or by a second strategy?",
    [
        _q("What is 4 - 9 + 7?", ["2", "-2", "12", "-12"], 0, "4 - 9 = -5, then -5 + 7 = 2."),
        _q("-6 - (-4) is the same as -6 + what?", ["-4", "4", "6", "-10"], 1, "Subtracting -4 is the same as adding 4."),
        _q("What is 7 - 12 + 9 - 3?", ["1", "-1", "31", "-31"], 0, "Positives 16, negatives -15, total 1."),
        _q("What is 8 - (3 - 10)?", ["1", "15", "-15", "21"], 1, "3 - 10 = -7, then 8 - (-7) = 15."),
        _q("What is -15 + 8 - (-3) + 2?", ["-2", "2", "-28", "28"], 0, "Positives 13, negatives -15, total -2."),
        _q("You start with $15, pay $22, are given $10 and pay $6. What is your balance?", ["-$3", "$3", "$53", "-$53"], 0, "15 - 22 + 10 - 6 = -3."),
        _q("You start with a number, add 6 and subtract 9 and get 4. What was the start?", ["7", "19", "1", "-7"], 0, "Undo: 4 + 9 = 13, then 13 - 6 = 7. Great work, {{name}}."),
        _q("Which is the correct rewrite of 5 - (-2) - 7 as additions?", ["5 + 2 + 7", "5 + 2 + (-7)", "5 + (-2) + 7", "5 + (-2) + (-7)"], 1, "Subtracting -2 is adding 2, and subtracting 7 is adding -7."),
        _q("What is -3 - 5 + 5 + 3?", ["0", "-8", "16", "-16"], 0, "-3 + 3 = 0 and -5 + 5 = 0, so the total is 0."),
        _q("The positive terms add to 14 and the negative terms add to -20. What is the total?", ["6", "-6", "34", "-34"], 1, "14 + (-20) = -6."),
    ],
    "Type your answers in the practice boxes and submit them. Include full sentences for parts (d), (e), (f) and (g).",
    "Extension: sign puzzle. Put a plus or a minus sign between the numbers 1, 2, 3, 4, 5, 6 (in that order, starting with +1) to make a total of exactly 1. Then find ways to make 3 and 5. Try to make 2 or 4. What do you notice, and can you explain why it happens? Hint: think about what happens to the total when you change one plus sign to a minus sign.",
    [("integer", "A whole number that can be positive, negative or zero"), ("running total", "The total so far, updated after each step"), ("opposite", "The number the same distance from zero on the other side, such as 6 and -6"), ("brackets", "Symbols that show which part to work out first"), ("group", "To collect similar terms together before adding"), ("positive", "Greater than zero"), ("negative", "Less than zero"), ("inverse", "The operation that undoes another"), ("estimate", "To find an approximate answer")],
    [],
    _sort("What sign is the final answer?", "Work out each string, then sort it by whether the answer is positive, negative or zero.", ["Positive", "Negative", "Zero"], [("5 - 8 + 3", 2), ("-2 - 3 + 10", 0), ("4 - 9 - 2", 1), ("-6 + 6 - 6", 1), ("10 - 15 + 5", 2), ("3 - (-4) - 2", 0), ("7 - 3 - 8", 1), ("-5 + 12 - 7", 2)]),
    [
        _wc("What is 9 - 5 + 4?", ["8", "0", "-8"], 0, "9 - 5 = 4, then 4 + 4 = 8."),
        _wc("What is 3 - 8 + 2?", ["3", "-3", "-13"], 1, "3 - 8 = -5, then -5 + 2 = -3."),
        _wc("What is -4 + 9 - 5?", ["10", "-18", "0"], 2, "-4 + 9 = 5, then 5 - 5 = 0."),
        _wc("What is -7 - (-7) + 4?", ["4", "-4", "18"], 0, "-7 + 7 = 0, then 0 + 4 = 4."),
        _wc("What is 6 - (-2) - 10?", ["2", "-2", "-6"], 1, "6 + 2 = 8, then 8 - 10 = -2."),
        _wc("What is -1 - 1 - 1?", ["3", "-1", "-3"], 2, "Each step moves 1 left from -1."),
        _wc("What is 0 - 5 + 8?", ["3", "-3", "13"], 0, "0 - 5 = -5, then -5 + 8 = 3."),
        _wc("What is 20 - 30 + 15 - 10?", ["5", "-5", "-15"], 1, "20 - 30 = -10, -10 + 15 = 5, 5 - 10 = -5."),
    ],
    [
        {"key": "partA", "label": "Part A: running total", "hint": "6 - 10 + 7, -4 + 9 - 8, 12 - 15 - 6, -7 - 3 + 14, 20 - 35 + 8 - 3."},
        {"key": "partB", "label": "Part B: rewrite and group", "hint": "Rewrite as additions, group positives and negatives, then combine."},
        {"key": "partC", "label": "Part C: brackets first", "hint": "9 - (4 - 12), (-5 + 8) - (6 - 10), 14 - (7 - 3 + 2)."},
        {"key": "partD", "label": "Part D: working backwards", "hint": "? + 8 - 15 = -2, 10 - ? + 4 = 1, ? - (-7) + 3 = 0."},
        {"key": "partE", "label": "Part E: spot the error", "hint": "5 - 9 + 3 = -7; -8 + 6 - (-2) = -4; 7 - (3 - 8) = -4. What went wrong?"},
        {"key": "partF", "label": "Part F: real problems", "hint": "A $50 balance with payments and a fee removed. A temperature that rises and falls."},
        {"key": "partG", "label": "Part G: write a story", "hint": "A story for 12 - 20 + 9 - 5, and its answer."},
        {"key": "taskA", "label": "Ledger (a): Kai", "hint": "Whole calculation, running total, final score."},
        {"key": "taskB", "label": "Ledger (b): Mia", "hint": "Rewrite as additions, group, final score."},
        {"key": "taskC", "label": "Ledger (c): Leo", "hint": "Final score and a backwards check."},
        {"key": "taskD", "label": "Ledger (d): ranking", "hint": "Highest to lowest. How far ahead is Leo of Kai?"},
        {"key": "taskE", "label": "Ledger (e): Kai's sixth round", "hint": "What makes his final score exactly 0? Write it two ways."},
        {"key": "taskF", "label": "Ledger (f): the student's mistake", "hint": "Two or three sentences about -15 - 20 instead of -15 - (-20)."},
        {"key": "taskG", "label": "Ledger (g): my own game", "hint": "Five rounds, one penalty removed, final score -10, checked a second way."},
    ],
    ["Treating subtracting a negative as subtracting a positive", "Losing track of the running total because nothing is written down", "Forgetting to work out the brackets first", "Grouping the terms but losing a negative sign", "Giving the answer the wrong sign after combining the totals", "Not checking the answer a second way"],
    ["Keep the score of a real game of cards or dice where players can go below zero, and write the whole game as one calculation afterwards.", "Make a set of cards with a start number and four changes, swap with a partner and solve each using a different strategy.", "Use real chips or coins in two colours to act out a multi-step problem."],
    "Part A: 6 - 10 + 7 = 3; -4 + 9 - 8 = -3; 12 - 15 - 6 = -9; -7 - 3 + 14 = 4; 20 - 35 + 8 - 3 = -10. Part B: 8 - 12 - (-5) + 3 = 8 + (-12) + 5 + 3 = 4 (positives 16, negatives -12); -6 - (-9) + (-4) - 7 = -6 + 9 + (-4) + (-7) = -8; 15 - (-8) - 20 + (-3) = 15 + 8 + (-20) + (-3) = 0; -10 + 4 - (-12) - 9 = -10 + 4 + 12 + (-9) = -3; -2 - (-2) - 2 - (-2) = -2 + 2 + (-2) + 2 = 0. Part C: 9 - (4 - 12) = 9 - (-8) = 17; (-5 + 8) - (6 - 10) = 3 - (-4) = 7; 14 - (7 - 3 + 2) = 14 - 6 = 8. Part D: 5 (5 + 8 - 15 = -2); 13 (10 - 13 + 4 = 1); -10 (-10 + 7 + 3 = 0). Part E: 5 - 9 + 3: the student added 9 and 3 instead of working left to right, the correct answer is -1; -8 + 6 - (-2): the student treated subtracting -2 as subtracting 2, the correct answer is -8 + 6 + 2 = 0; 7 - (3 - 8): the student ignored the brackets, the correct answer is 7 - (-5) = 12. Part F: 50 - 80 + 35 - (-20) = 25, so the balance is $25; -4 + 9 - 13 - 5 + 7 = -6, so the temperature is -6 degrees. Part G: accept any story that matches the four steps (start with 12, lose 20, gain 9, lose 5); the answer is -4. Ledger (a): 0 + 30 - 45 - (-20) + 12 - 50 gives 30, -15, 5, 17, -33, so Kai finishes on -33. (b): -10 - (-35) - 20 + 15 - (-5) - 40 = -10 + 35 + (-20) + 15 + 5 + (-40); positives 55, negatives -70, final score -15. (c): 25 - 40 + 18 - (-12) - 30 + 22 gives -15, 3, 15, -15, 7, so Leo finishes on 7; backwards: 7 - 22 = -15, -15 + 30 = 15, 15 - 12 = 3, 3 - 18 = -15, -15 + 40 = 25, which is the start. (d): Leo (7), Mia (-15), Kai (-33); Leo is ahead of Kai by 7 - (-33) = 40 points. (e): Kai needs +33, written as -33 + 33 = 0 and as -33 - (-33) = 0. (f): the student treated subtracting -20 as subtracting 20, so they got -15 - 20 = -35. Subtracting a negative is the same as adding the positive, so -15 - (-20) = -15 + 20 = 5, and Kai's total after that round is 5 (the running total in part (a) shows the same value). (g): accept any five-round game starting at 0 with at least one penalty removed, a final score of -10 and a correct second check. Quiz answers: 2; 4; 1; 15; -2; -$3; 7; 5 + 2 + (-7); 0; -6.",
)
