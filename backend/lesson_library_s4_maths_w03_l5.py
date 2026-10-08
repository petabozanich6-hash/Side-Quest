"""Stage 4 Mathematics, Week 3 Lesson 5: Integers, Integer problem solving and unit review.
All written work is typed inside the lesson. Replaces the placeholder with seed_key s4-maths-w03-l5.
No video is attached: none has been found and tested for this topic yet. Add one in the video and link run.
Outcome codes MA4-INT-C-01 and MAO-WM-01 are from the draft mapping and should be re-checked against NESA.
This is the last lesson of the Integers unit and pulls together W2 L1 to W3 L4. It is written to fit a shorter lesson, so the practice can be shared across a unit test or review session.
The magic-square extension uses the numbers -4 to 4 with every row, column and diagonal summing to 0.
"""
from lesson_library_s4_builder import build_s4, _q, _step, _sort, _wc

LESSON = build_s4(
    "s4-maths-w03-l5",
    "Week 3, Lesson 5: Integer Problem Solving and Unit Review",
    "Bring the whole Integers unit together. Use a four-step method to understand a problem, plan the operations, solve it with the right signs and check that the answer makes sense.",
    "Integers",
    ["MA4-INT-C-01", "MAO-WM-01"],
    {
        "MA4-INT-C-01": "Primary. Reviews and applies all four operations with integers, the order of operations and integer contexts in multi-step problems.",
        "MAO-WM-01": "Working mathematically: chooses and justifies a strategy (draw, table, work backwards), communicates each step, checks reasonableness and identifies and corrects errors.",
    },
    "We are learning to solve multi-step integer problems and to check our answers.",
    ["I can use a four-step method to solve a problem with integers.", "I can compare and order integers.", "I can add, subtract, multiply and divide integers correctly.", "I can use the order of operations in longer calculations.", "I can work backwards to find an unknown integer.", "I can check that the sign and size of an answer make sense.", "I can find and fix common integer mistakes."],
    ["integer", "order of operations", "net change", "inverse operation", "working backwards", "reasonable", "estimate", "total distance"],
    ["This lesson (everything you need is inside it)", "Paper and pencil", "A printed number line from -30 to 30 (optional)"],
    "You have completed the Integers lessons from Week 2 and Week 3: the number line, adding, subtracting, multiplying and dividing integers, the order of operations and integers in context.",
    (
        "Why this matters. Real problems do not tell you which operation to use. You have to read the situation, choose the operations, keep track of the signs and decide whether the answer is sensible. This lesson gives you a method and then practises the whole unit.\n\n"
        "The four steps. 1. Understand: what is the question, and what information do you have? 2. Plan: which operations will you use, and will a drawing, table or number line help? 3. Solve: do the calculation one step at a time with the signs showing. 4. Check: does the answer make sense, and does a second method give the same answer?\n\n"
        "Quick review of the rules. Adding a negative is the same as subtracting, and subtracting a negative is the same as adding. Multiplying or dividing two numbers with the same sign gives a positive, and with different signs gives a negative. A product of several non-zero integers is negative when the number of negative factors is odd. Dividing by zero is undefined.\n\n"
        "Order of operations. Do brackets first, then multiplication and division from left to right, then addition and subtraction from left to right. 5 - 3 x (4 - 7) = 5 - 3 x (-3) = 5 + 9 = 14.\n\n"
        "Working backwards. To find an unknown starting integer, undo each step in reverse order. Suppose you think of an integer, multiply it by -3 and add 5 to get -16. Undo the addition: -16 - 5 = -21. Undo the multiplication: -21 \u00f7 (-3) = 7. The integer is 7. Check: 7 x (-3) + 5 = -16.\n\n"
        "Checking reasonableness. Check the sign first: a loss should lower a total, and four negative factors give a positive product. Then check the size by rounding or estimating. A net change and a total distance are different things: going down 9, up 5 and down 6 gives a net change of -10 but a total distance of 20."
    ),
    [
        _step("1", "Understand and plan", "Read the problem twice. Underline the numbers and the key words, and decide which operation each one needs.\n\nWrite your plan before you calculate.", "A balance of -45 gets a deposit of 70. Deposit means add, so the plan is -45 + 70.", "Understand, plan, solve, check.", ("A balance of -45 receives a deposit of 70. Which calculation finds the new balance?", ["-45 + 70", "-45 - 70", "45 + 70", "70 \u00f7 (-45)"], 0, "A deposit adds to the balance, so use -45 + 70.")),
        _step("2", "Compare and order integers", "On a number line, values increase to the right. A negative integer with a bigger size is smaller.\n\nOrder from least to greatest by thinking of the number line.", "Order -7, 3, -12, 0, -1: -12, -7, -1, 0, 3.", "Further left means smaller.", ("Which is the smallest: -3, 4, -9 or 0?", ["-3", "4", "-9", "0"], 2, "-9 is furthest to the left.")),
        _step("3", "Add and subtract", "Rewrite subtracting a negative as adding a positive. Then work from left to right.\n\nKeep a running total.", "-8 - (-5) + 3 = -8 + 5 + 3 = 0.", "Subtracting a negative is adding.", ("What is -6 - (-9) + 2?", ["-13", "5", "-1", "13"], 1, "-6 + 9 = 3, then 3 + 2 = 5.")),
        _step("4", "Multiply and divide", "Apply the sign rule, then work from left to right. Same signs give a positive and different signs give a negative.\n\nOne step at a time.", "(-12) x 3 \u00f7 (-4) = (-36) \u00f7 (-4) = 9.", "Same signs positive, different signs negative.", ("What is (-5) x (-4) \u00f7 (-10)?", ["2", "-2", "-20", "20"], 1, "(-5) x (-4) = 20, then 20 \u00f7 (-10) = -2.")),
        _step("5", "Order of operations", "Brackets first, then multiplication and division, then addition and subtraction, both left to right.\n\nWrite each step on a new line.", "5 - 3 x (4 - 7) = 5 - 3 x (-3) = 5 + 9 = 14.", "Brackets, then multiply and divide, then add and subtract.", ("What is 10 + (-18) \u00f7 (7 - 10)?", ["4", "-16", "16", "-8"], 2, "(7 - 10) = -3, then (-18) \u00f7 (-3) = 6, then 10 + 6 = 16.")),
        _step("6", "Working backwards", "Undo the steps in reverse order, using inverse operations. Check by running the steps forward.\n\nAdd undoes subtract, and multiply undoes divide.", "I think of an integer, multiply by -3 and add 5 to get -16. -16 - 5 = -21, and -21 \u00f7 (-3) = 7. The integer is 7.", "Undo the last step first.", ("I think of an integer, add 8 and multiply by -2 to get -6. What is the integer?", ["5", "-11", "-5", "11"], 2, "Undo the multiplication: -6 \u00f7 (-2) = 3. Then undo the addition: 3 - 8 = -5.")),
        _step("7", "Checking the sign and the size", "Count the negative factors to predict the sign of a product. Estimate the size and compare.\n\nAn odd number of negatives gives a negative product.", "(-2) x (-7) x (-1) has three negatives, so the product is negative: -14.", "Count the negatives.", ("What is the sign of (-2) x (-7) x (-1) x (-3)?", ["Negative", "Positive", "Zero", "Cannot tell"], 1, "There are four negative factors, which is even, so the product is positive.")),
    ],
    (
        "Scenario: A glass lift in a building travels between floors. Ground level is 0 and the basement floors are negative. The lift starts at floor 4, goes down 9 floors, goes up 5 floors and then goes down 6 floors. Where does it finish, and how far has it travelled in total?\n\n"
        "Step 1, understand. We need the final floor and the total number of floors travelled. We know the start (4) and three moves: down 9, up 5 and down 6.\n\n"
        "Step 2, plan. Write the moves as -9, +5 and -6. The final floor is the start plus all the moves. The total distance is the sizes of the moves added together, with no signs.\n\n"
        "Step 3, solve. 4 + (-9) = -5, then -5 + 5 = 0, then 0 + (-6) = -6. The lift finishes at floor -6 (the sixth basement level). The total distance is 9 + 5 + 6 = 20 floors.\n\n"
        "Step 4, check. The net change is -9 + 5 - 6 = -10, and 4 + (-10) = -6. It agrees. A net change of -10 is not the same as a distance of 20, because the lift went both up and down.\n\n"
        "Step 5, work backwards. If the lift had finished at floor -2 after the same three moves, where did it start? Undo the net change: -2 - (-10) = 8. The lift started at floor 8. Check: 8 + (-10) = -2.\n\n"
        "Good work, {{name}}. Each answer was checked a second way."
    ),
    (
        "Work through these on paper or in the practice boxes, one step per line. Part A (compare and order): order -15, 8, -3, 0, -9 and 4 from least to greatest. Which is least out of -4, -40 and -14? Which is greater, -3 or -30? Part B (four operations): work out (-7) + (-8), (-7) - (-8), (-7) x (-8), (-56) \u00f7 (-8), 4 - 11, (-6) x 7, 45 \u00f7 (-9) and -12 - 5. Part C (order of operations): work out 6 + 4 x (-3), (6 + 4) x (-3), 20 - 12 \u00f7 (-4), (-5) x (3 - 8), (-18 + 6) \u00f7 (-2 x 3) and 7 - (-3) x (-2). Part D (missing numbers): find the missing integer. ? + (-7) = -2, 9 - ? = 14, ? x (-4) = 28, ? \u00f7 (-3) = -5 and -8 - ? = -3. Part E (working backwards): I think of an integer, multiply it by -3 and add 5 to get -16. I think of an integer, subtract 4 and divide by -2 to get 6. I think of an integer, add 9 and multiply by -2 to get 10. Find each integer. Part F (word problems): (a) a freezer is at -18 degrees and warms 3 degrees each hour for 5 hours, so find the temperature; (b) an account has $13 and four withdrawals of $12 are made, so find the balance; (c) an eagle at 120 m dives 45 m, dives another 30 m and then climbs 20 m, so find its height; (d) find the mean of the temperatures -5, -3, 0, -8 and -4. Part G (spot the error): each of these has a mistake. Say what went wrong and give the correct answer: (-4) x (-3) x (-2) = 24; (-15) \u00f7 (-3) = -5; -7 - (-7) = -14; 2 - 5 x (-3) = 9."
    ),
    (
        "Mission: Shipwreck Salvage. A salvage team's account starts at -$500 because of a loan. A diver descends from the surface at 8 m each minute for 6 minutes to reach a wreck. At the surface the water is 24 degrees, and it falls 3 degrees for every 12 m of depth. Type your answers in the boxes.\n\n"
        "(a) Find the depth of the wreck as an integer.\n"
        "(b) The diver finds a chest and then swims up 20 m to follow a ledge. What is the diver's depth now?\n"
        "(c) The diver then swims up at 4 m each minute until reaching the surface. How many minutes does that take?\n"
        "(d) Over four days the team recovers 3 sets of coins worth $350 each and 2 cannons worth $475 each. It pays $120 a day for the boat and $85 a day for fuel for each of the 4 days. Write one calculation for the final account balance, including the starting -$500, and work it out.\n"
        "(e) The balance from part (d) is shared equally among the 4 divers. How much does each diver get?\n"
        "(f) Find the water temperature at the depth of the wreck and the net change in temperature from the surface.\n"
        "(g) A student works out -500 + 3 x 350 from left to right and gets -173,950. Explain in two or three sentences what went wrong and give the correct answer.\n"
        "(h) Make your own 'think of an integer' puzzle with two steps and an integer answer. Give the puzzle and show how to work backwards to the answer."
    ),
    "Type your answers in the practice boxes. Show each calculation with its signs, check by a second method, and write full sentences for the explanation questions.",
    "Did I follow understand, plan, solve and check, show every step with its sign, use the order of operations, and check that the sign and size of my answer make sense?",
    [
        _q("A balance of -45 receives a deposit of 70. Which calculation finds the new balance?", ["-45 + 70", "-45 - 70", "45 + 70", "70 \u00f7 (-45)"], 0, "A deposit adds to the balance."),
        _q("Which is the smallest: -3, 4, -9 or 0?", ["-3", "4", "-9", "0"], 2, "-9 is furthest left on the number line."),
        _q("What is -6 - (-9) + 2?", ["-13", "5", "-1", "13"], 1, "-6 + 9 + 2 = 5."),
        _q("What is (-5) x (-4) \u00f7 (-10)?", ["2", "-2", "-20", "20"], 1, "20 \u00f7 (-10) = -2."),
        _q("What is 10 + (-18) \u00f7 (7 - 10)?", ["4", "-16", "16", "-8"], 2, "(-18) \u00f7 (-3) = 6, then 10 + 6 = 16."),
        _q("I think of an integer, add 8 and multiply by -2 to get -6. What is the integer?", ["5", "-11", "-5", "11"], 2, "-6 \u00f7 (-2) = 3, then 3 - 8 = -5."),
        _q("What is the sign of (-2) x (-7) x (-1) x (-3)?", ["Negative", "Positive", "Zero", "Cannot tell"], 1, "Four negative factors give a positive product."),
        _q("A lift starts at floor 4, goes down 9, up 5 and down 6. Where does it finish?", ["6", "-6", "-4", "14"], 1, "4 - 9 + 5 - 6 = -6."),
        _q("How many floors does the lift travel in total?", ["-10", "10", "20", "-20"], 2, "9 + 5 + 6 = 20, because distance has no sign. Good work, {{name}}."),
        _q("A freezer at -18 degrees warms 3 degrees each hour for 5 hours. What is the temperature?", ["-33", "-3", "3", "-15"], 1, "-18 + 5 x 3 = -3."),
    ],
    "Type your answers in the practice boxes and submit them. Include full sentences for parts (g) and (h).",
    "Extension: a magic square. Place the integers -4, -3, -2, -1, 0, 1, 2, 3 and 4 in a 3 by 3 square so that every row, every column and both diagonals add to 0. Explain why the centre number has to be 0. Then make your own one-page integer survival guide that shows the rule for each operation with one example and one common mistake.",
    [("integer", "A whole number that can be positive, negative or zero"), ("order of operations", "The agreed order in which parts of a calculation are done"), ("net change", "The final value minus the start value"), ("inverse operation", "An operation that undoes another"), ("working backwards", "Undoing steps in reverse order to find a starting value"), ("reasonable", "Makes sense in the situation"), ("estimate", "A close, rounded answer used to check"), ("total distance", "The sum of the sizes of all moves, with no signs")],
    [],
    _sort("Which operation solves it?", "Decide which operation is needed for each situation, then sort it.", ["Add", "Subtract", "Multiply", "Divide"], [("Find a final temperature after a rise", 0), ("Find the net change from a start to a final value", 1), ("Find the change from a rate over several hours", 2), ("Share a debt equally among 5 people", 3), ("Find the total after two deposits", 0), ("Find the difference between the highest and lowest elevations", 1), ("Find the change after 6 equal withdrawals", 2), ("Find the mean once the total is known", 3)]),
    [
        _wc("What is -7 + 12?", ["5", "-5", "19"], 0, "12 - 7 = 5."),
        _wc("What is -7 - 12?", ["19", "-19", "5"], 1, "-7 + (-12) = -19."),
        _wc("What is (-7) x (-12)?", ["-84", "84", "5"], 1, "Same signs give a positive."),
        _wc("What is (-84) \u00f7 12?", ["7", "-7", "72"], 1, "Different signs give a negative."),
        _wc("What is 5 - 2 x (-3)?", ["-9", "11", "9"], 1, "5 - (-6) = 11."),
        _wc("What is (5 - 2) x (-3)?", ["-9", "9", "-1"], 0, "3 x (-3) = -9."),
        _wc("What is (-20) \u00f7 (-4) + (-3)?", ["8", "2", "-8"], 1, "5 + (-3) = 2."),
        _wc("A number plus -5 equals -12. What is the number?", ["-17", "7", "-7"], 2, "-12 + 5 = -7."),
    ],
    [
        {"key": "partA", "label": "Part A: compare and order", "hint": "Order from least to greatest and think of the number line."},
        {"key": "partB", "label": "Part B: four operations", "hint": "Apply the sign rule to each."},
        {"key": "partC", "label": "Part C: order of operations", "hint": "Brackets, then multiply and divide, then add and subtract."},
        {"key": "partD", "label": "Part D: missing numbers", "hint": "Use the inverse operation and check."},
        {"key": "partE", "label": "Part E: working backwards", "hint": "Undo the last step first."},
        {"key": "partF", "label": "Part F: word problems", "hint": "Write the calculation before you work it out."},
        {"key": "partG", "label": "Part G: spot the error", "hint": "What went wrong, and what is the correct answer?"},
        {"key": "taskA", "label": "Salvage (a): depth of the wreck", "hint": "Rate x time, with a negative rate."},
        {"key": "taskB", "label": "Salvage (b): depth after swimming up", "hint": "Add the upward move to the depth."},
        {"key": "taskC", "label": "Salvage (c): minutes to the surface", "hint": "The net change needed divided by the rate."},
        {"key": "taskD", "label": "Salvage (d): final balance", "hint": "One calculation, using the order of operations."},
        {"key": "taskE", "label": "Salvage (e): each diver's share", "hint": "Divide the balance by 4."},
        {"key": "taskF", "label": "Salvage (f): temperature at the wreck", "hint": "How many 12 m steps is the wreck depth? Each one changes the temperature by -3."},
        {"key": "taskG", "label": "Salvage (g): the student's mistake", "hint": "Two or three sentences about working left to right."},
        {"key": "taskH", "label": "Salvage (h): your own puzzle", "hint": "Two steps, an integer answer, and your working backwards."},
    ],
    ["Treating subtraction of a negative as subtraction of a positive", "Getting the sign of a product with several negatives wrong", "Working from left to right without the order of operations", "Giving net change when the question asks for total distance", "Undoing steps in the wrong order when working backwards", "Skipping the check at the end"],
    ["Draw a number line or a vertical scale for every problem and mark each move.", "Write the four steps (understand, plan, solve, check) down the side of the page.", "Make a one-page rule sheet with one example for each operation."],
    "Part A: -15, -9, -3, 0, 4, 8; the least is -40; -3 is greater than -30. Part B: -15; (-7) - (-8) = 1; 56; 7; -7; -42; -5; -17. Part C: 6 + (-12) = -6; (10) x (-3) = -30; 20 - (-3) = 23; (-5) x (-5) = 25; (-12) \u00f7 (-6) = 2; 7 - 6 = 1. Part D: 5; -5; -7; 15; -5. Part E: 7 (-16 - 5 = -21, -21 \u00f7 (-3) = 7); -8 (6 x (-2) = -12, then -12 + 4 = -8); -14 (10 \u00f7 (-2) = -5, then -5 - 9 = -14). Part F: (a) -18 + 5 x 3 = -3 degrees; (b) 13 - 4 x 12 = 13 - 48 = -35, so the balance is -$35; (c) 120 - 45 - 30 + 20 = 65 m; (d) the total is -20 and -20 \u00f7 5 = -4 degrees. Part G: (-4) x (-3) x (-2): there are three negative factors, so the product is negative, -24; (-15) \u00f7 (-3): the signs are the same, so the answer is positive, 5; -7 - (-7) = -7 + 7 = 0; 2 - 5 x (-3) should be 2 - (-15) = 17, and the student worked out (2 - 5) first. Salvage (a): 6 x (-8) = -48 m. (b): -48 + 20 = -28 m. (c): the diver needs to rise 28 m, and 28 \u00f7 4 = 7 minutes. (d): -500 + 3 x 350 + 2 x 475 - 4 x 120 - 4 x 85 = -500 + 1,050 + 950 - 480 - 340 = 680, so the final balance is $680. (e): 680 \u00f7 4 = $170 each. (f): -48 m is 4 steps of 12 m, so the temperature falls by 4 x 3 = 12 degrees, giving 24 - 12 = 12 degrees at the wreck, and the net change from the surface is -12 degrees. (g): the student worked from left to right, so -500 + 3 = -497 and -497 x 350 = -173,950, but multiplication comes before addition, so the answer is -500 + 1,050 = 550. (h): accept any valid two-step puzzle with an integer answer and correct backward working. Quiz answers: -45 + 70; -9; 5; -2; 16; -5; positive; -6; 20; -3. Extension: one magic square is 3, -4, 1 / -2, 0, 2 / -1, 4, -3; the centre must be 0 because the four lines through the centre (the middle row, the middle column and both diagonals) each add to 0, so together they add to 4 x (centre) + the sum of all the outer numbers, which is 0 - centre... so centre = 0.",
)
