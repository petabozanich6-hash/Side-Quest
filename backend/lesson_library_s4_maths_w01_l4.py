"""Stage 4 Mathematics, Week 1 Lesson 4: Integers, Adding integers with different signs.
All written work is typed inside the lesson. Replaces the placeholder with seed_key s4-maths-w01-l4.
No video is attached: none has been found and tested for this topic yet. Add one in the video and link run.
Outcome codes MA4-INT-C-01 and MAO-WM-01 are from the draft mapping and should be re-checked against NESA.
"""
from lesson_library_s4_builder import build_s4, _q, _step, _sort, _wc

LESSON = build_s4(
    "s4-maths-w01-l4",
    "Week 1, Lesson 4: Adding Integers with Different Signs",
    "Money comes in and money goes out. Temperatures rise and then fall. When positive and negative changes meet, they pull against each other. Learn how to work out who wins, by how much, and what sign the answer has.",
    "Integers",
    ["MA4-INT-C-01", "MAO-WM-01"],
    {
        "MA4-INT-C-01": "Primary. Adds integers with different signs, explaining results using the number line, cancelling and the sign of the integer with the larger size.",
        "MAO-WM-01": "Working mathematically: predicts the sign of an answer before calculating, checks results two ways and communicates reasoning in words and symbols.",
    },
    "We are learning to add integers with different signs, to predict the sign of the answer, and to check our work in two ways.",
    ["I can tell when two integers have different signs.", "I can predict whether a sum will be positive, negative or zero before calculating.", "I can add two integers with different signs.", "I can explain why equal-sized opposite integers add to zero.", "I can add a longer list of mixed integers by grouping positives and negatives.", "I can find a missing number in an addition.", "I can solve real problems with deposits, withdrawals and temperature changes."],
    ["integer", "sum", "different signs", "size", "opposite", "cancel", "net change", "balance", "number line"],
    ["This lesson (everything you need is inside it)", "Paper and pencil", "A printed number line from -50 to 50 (optional)"],
    "You can add integers by moving on a number line, and you can add integers that have the same sign by adding their sizes (Week 1, Lessons 2 and 3).",
    (
        "Why this matters. Real life mixes ups and downs. A bank account has deposits and withdrawals. The temperature rises in the day and falls at night. A lift goes up and then down. When positives and negatives meet, they work against each other, so we need to know which one wins and by how much.\n\n"
        "Different signs means opposite directions. Two integers have different signs when one is positive and one is negative, such as 9 and -4. On the number line, one move goes right and the other goes left. They partly or fully cancel each other.\n\n"
        "A worked picture. 9 + (-4): start at 9 and move 4 steps left. You land on 5. The positive integer had the larger size, so the answer is positive. Now -9 + 4: start at -9 and move 4 steps right. You land on -5. The negative integer had the larger size, so the answer is negative.\n\n"
        "The pattern. With different signs, subtract the smaller size from the larger size. The answer takes the sign of the integer with the larger size. For 9 + (-4), the sizes are 9 and 4, 9 - 4 = 5, and the larger size belongs to the positive 9, so the answer is +5. For -9 + 4, 9 - 4 = 5 again, but the larger size belongs to -9, so the answer is -5.\n\n"
        "Predict before you calculate. Compare the sizes first. In -45 + 30, the size 45 is larger than 30 and 45 belongs to a negative, so the answer must be negative. You can predict the sign without any calculation, and then use the prediction as a check.\n\n"
        "Equal sizes cancel. -7 + 7 = 0. The two moves are equal and opposite, so you finish where you started.\n\n"
        "Longer lists. For several integers, add all the positives together, add all the negatives together, and then combine the two totals. 8 + (-3) + 5 + (-12): positives 8 + 5 = 13, negatives -3 + (-12) = -15, and 13 + (-15) = -2. You can check by working left to right.\n\n"
        "Real problems. Earning $70 and then spending $95 gives 70 + (-95) = -25, so the balance is -$25, which means $25 in debt."
    ),
    [
        _step("1", "Different signs pull against each other", "Two integers have different signs when one is positive and one is negative. On the number line, one move goes right and the other goes left, so they partly cancel.\n\nThe bigger move decides which way you end up.", "9 and -4 have different signs. -4 and -9 have the same sign.", "Different signs means opposite moves. Look at the sizes to see who wins.", ("Which pair has different signs?", ["-4 and -9", "6 and 11", "-5 and 8", "-2 and -2"], 2, "-5 is negative and 8 is positive, so the signs are different.")),
        _step("2", "Positive wins", "When the positive integer has the larger size, the sum is positive. Subtract the smaller size from the larger size.\n\nOn the number line, you start on the positive side and do not move all the way back past zero.", "9 + (-4): start at 9, move 4 steps left, land on 5. Sizes: 9 - 4 = 5, and the positive 9 is larger, so the answer is 5.", "Bigger positive means a positive answer.", ("What is 9 + (-4)?", ["13", "5", "-5", "-13"], 1, "The sizes are 9 and 4, 9 - 4 = 5, and the positive is larger, so the sum is 5.")),
        _step("3", "Negative wins", "When the negative integer has the larger size, the sum is negative. Subtract the smaller size from the larger size and keep the negative sign.\n\nOn the number line, you start on the negative side and move right, but not all the way to zero.", "-9 + 4: start at -9, move 4 steps right, land on -5. Sizes: 9 - 4 = 5, and the negative -9 is larger in size, so the answer is -5.", "Bigger negative means a negative answer.", ("What is -9 + 4?", ["13", "5", "-5", "-13"], 2, "The sizes are 9 and 4, 9 - 4 = 5, and the negative has the larger size, so the sum is -5.")),
        _step("4", "Equal sizes cancel", "When the two sizes are equal, the moves cancel exactly and the sum is zero. A number and its opposite always add to zero.\n\nYou finish exactly where you started.", "-7 + 7 = 0. 25 + (-25) = 0.", "Equal and opposite means zero.", ("What is -7 + 7?", ["14", "-14", "0", "7"], 2, "-7 and 7 are opposites, so they cancel to zero.")),
        _step("5", "Longer lists", "For a list with both positives and negatives, add all the positives together and add all the negatives together. Then combine the two totals, which have different signs.\n\nThe order does not matter, so grouping is allowed.", "8 + (-3) + 5 + (-12): positives 8 + 5 = 13. Negatives (-3) + (-12) = -15. Then 13 + (-15) = -2.", "Group the positives, group the negatives, then combine.", ("What is 8 + (-3) + 5 + (-12)?", ["-2", "2", "28", "-28"], 0, "The positives total 13, the negatives total -15, and 13 + (-15) = -2.")),
        _step("6", "Predict before you calculate", "Compare the sizes first. The integer with the larger size decides the sign of the sum. Predicting the sign gives you a built-in check on your answer.\n\nIf your calculation gives a different sign from your prediction, look for a mistake.", "-45 + 30: the size 45 is larger and belongs to the negative, so the answer must be negative. The calculation gives -15.", "Predict the sign, calculate, then compare.", ("Without calculating, what is the sign of -45 + 30?", ["Positive", "Negative", "Zero", "Cannot tell"], 1, "The larger size, 45, belongs to the negative, so the answer is negative.")),
        _step("7", "Real problems", "Deposits and earnings are positive. Withdrawals, spending and losses are negative. When one follows the other, you add integers with different signs.\n\nA negative balance means money is owed.", "Earn $70, then spend $95: 70 + (-95) = -25, so the balance is -$25.", "Write each change as an integer. Add. Say the answer in words.", ("You earn $70 and then spend $95. What is your balance?", ["$25", "-$25", "$165", "-$165"], 1, "70 + (-95) = -25.")),
    ],
    (
        "Scenario: Sam's account is overdrawn by $20, so the starting balance is -20. Over a week there are five transactions in order: a deposit of $60, a withdrawal of $85, a deposit of $40, a withdrawal of $30 and a deposit of $50.\n\n"
        "Step 1, write each transaction as an integer: +60, -85, +40, -30, +50.\n\n"
        "Step 2, follow the balance one transaction at a time. Start at -20. After +60: -20 + 60 = 40. After -85: 40 + (-85) = -45. After +40: -45 + 40 = -5. After -30: -5 + (-30) = -35. After +50: -35 + 50 = 15. The final balance is $15.\n\n"
        "Step 3, check with the net change. Positives: 60 + 40 + 50 = 150. Negatives: -85 + (-30) = -115. Net change: 150 + (-115) = 35. Then -20 + 35 = 15. It matches, so the answer is checked two ways.\n\n"
        "Step 4, what was the lowest balance? The balances were -20, 40, -45, -5, -35 and 15. The lowest was -45, after the withdrawal of $85.\n\n"
        "Step 5, which transactions changed the balance from negative to positive or from positive to negative? The first deposit took it from -20 to 40 (negative to positive). The $85 withdrawal took it from 40 to -45 (positive to negative). The last deposit took it from -35 to 15 (negative to positive).\n\n"
        "Reasoning check. The $40 deposit raised the balance from -45 to -5, but it was not enough to make it positive, because 40 is less than 45. Well done, {{name}}. You predicted, calculated and checked."
    ),
    (
        "Work through these on paper or in the practice boxes. Part A (two integers): work out 9 + (-4), -9 + 4, 15 + (-20), -18 + 25, 30 + (-30) and -41 + 13. Part B (predict the sign first): say whether each sum will be positive, negative or zero without calculating, then work it out: 50 + (-60), -75 + 80, -12 + 12, 100 + (-99). Part C (longer lists): work out 7 + (-4) + 9 + (-15), -10 + 6 + (-3) + 12 and 20 + (-5) + (-8) + (-12) by grouping the positives and the negatives. Part D (missing numbers): find the number that goes in the gap. ? + (-6) = 4, -9 + ? = 3, 15 + ? = -5, ? + 8 = -2. Part E (real problems): you earn $70 and spend $95; a temperature of -4 degrees rises by 10 degrees and then falls by 9 degrees; a lift is on floor 6 and goes down 10 floors. Write each as an addition of integers and give the answer with units."
    ),
    (
        "Mission: Bank Ledger Detective. A student's account starts with a balance of $25. Five transactions happen in this order: withdrawal $40, deposit $15, withdrawal $30, deposit $60, withdrawal $45. Type your answers in the boxes.\n\n"
        "(a) Write each transaction as an integer, and write the starting balance plus the first transaction as an addition.\n"
        "(b) Find the balance after each of the five transactions, writing each step as an addition.\n"
        "(c) When was the balance exactly zero, and what was the lowest balance?\n"
        "(d) Find the net change two ways: by adding left to right, and by grouping the deposits and the withdrawals. Check that both give the same final balance.\n"
        "(e) How much would the student need to deposit after the last transaction to have a balance of $20?\n"
        "(f) A student works out -45 + 30 and gets 15 because 45 - 30 = 15. Explain in two or three sentences what mistake was made and give the correct answer.\n"
        "(g) Make up your own ledger of five transactions that makes the balance cross zero at least twice. Write each transaction as an integer, find the balance after each and say when it crossed zero."
    ),
    "Type your answers in the practice boxes. Show each step as an addition and write full sentences for the explanation questions.",
    "Did I predict the sign by comparing sizes, subtract the smaller size from the larger, give the answer the sign of the larger size, group positives and negatives in longer lists, and check my total in a second way?",
    [
        _q("What is 8 + (-12)?", ["4", "-4", "20", "-20"], 1, "The sizes are 8 and 12. 12 - 8 = 4, and the larger size is negative, so the sum is -4."),
        _q("What is -15 + 22?", ["7", "-7", "37", "-37"], 0, "22 - 15 = 7 and the larger size is positive, so the sum is 7."),
        _q("What is -30 + 30?", ["60", "-60", "0", "30"], 2, "Opposites cancel to zero."),
        _q("Without calculating, what is the sign of -64 + 50?", ["Positive", "Negative", "Zero", "Cannot tell"], 1, "The larger size is 64 and it belongs to the negative, so the sum is negative."),
        _q("What is 5 + (-9) + 12 + (-4)?", ["4", "-4", "30", "-30"], 0, "The positives total 17, the negatives total -13, and 17 + (-13) = 4."),
        _q("Which sum is positive?", ["-20 + 15", "-7 + 4", "-3 + 10", "12 + (-13)"], 2, "-3 + 10 = 7. The others are -5, -3 and -1."),
        _q("A balance of $40 has a withdrawal of $65. What is the new balance?", ["-$25", "$25", "$105", "-$105"], 0, "40 + (-65) = -25."),
        _q("Which statement is true?", ["-6 + 10 = -4", "-6 + 10 = 4", "-6 + 10 = 16", "-6 + 10 = -16"], 1, "10 - 6 = 4 and the positive has the larger size, so the answer is 4. Great work, {{name}}."),
        _q("What number goes in the gap? -8 + ? = 5", ["-3", "3", "13", "-13"], 2, "From -8 you need to move 13 steps right to reach 5, so the missing number is 13."),
        _q("The temperature is -5 degrees, rises 9 degrees and then falls 6 degrees. What is it now?", ["-2", "2", "-20", "20"], 0, "-5 + 9 = 4, then 4 + (-6) = -2."),
    ],
    "Type your answers in the practice boxes and submit them. Include full sentences for parts (c), (e), (f) and (g).",
    "Extension: a ledger puzzle. Starting from a balance of $0, make five transactions, using each of the numbers 10, 20, 30, 40 and 50 once, each as either a deposit or a withdrawal, so that the final balance is exactly $10. Find at least two different solutions and explain how you know each is correct using the net change.",
    [("integer", "A whole number that can be positive, negative or zero"), ("sum", "The result of adding numbers together"), ("different signs", "One integer is positive and the other is negative"), ("size", "How far an integer is from zero, ignoring its sign"), ("opposite", "The integer the same distance from zero on the other side"), ("cancel", "When equal and opposite amounts add to zero"), ("net change", "The overall change after a series of moves added together"), ("balance", "The amount of money in an account; negative means money is owed")],
    [],
    _sort("Will the sum be positive, negative or zero?", "Predict the sign by comparing sizes, then sort each addition.", ["Positive", "Negative", "Zero"], [("12 + (-5)", 0), ("-12 + 5", 1), ("-9 + 9", 2), ("20 + (-25)", 1), ("-3 + 10", 0), ("14 + (-14)", 2), ("-30 + 18", 1), ("7 + (-2)", 0)]),
    [
        _wc("What is 6 + (-2)?", ["4", "-4", "8"], 0, "6 - 2 = 4 and the positive is larger."),
        _wc("What is -6 + 2?", ["4", "-4", "8"], 1, "6 - 2 = 4 and the negative is larger, so -4."),
        _wc("What is -10 + 10?", ["0", "20", "-20"], 0, "Opposites cancel to zero."),
        _wc("What is 3 + (-8)?", ["5", "-5", "11"], 1, "8 - 3 = 5 and the negative is larger, so -5."),
        _wc("What is -14 + 20?", ["6", "-6", "34"], 0, "20 - 14 = 6 and the positive is larger."),
        _wc("With different signs, the sum takes the sign of the integer with the...", ["larger size", "smaller size", "first position"], 0, "The bigger move decides the sign."),
        _wc("What is 9 + (-9)?", ["18", "0", "-18"], 1, "Opposites cancel to zero."),
        _wc("What is -25 + 5?", ["-20", "20", "-30"], 0, "25 - 5 = 20 and the negative is larger, so -20."),
    ],
    [
        {"key": "partA", "label": "Part A: two integers", "hint": "9 + (-4), -9 + 4, 15 + (-20), -18 + 25, 30 + (-30), -41 + 13."},
        {"key": "partB", "label": "Part B: predict the sign first", "hint": "50 + (-60), -75 + 80, -12 + 12, 100 + (-99). Predict, then calculate."},
        {"key": "partC", "label": "Part C: longer lists", "hint": "7 + (-4) + 9 + (-15), -10 + 6 + (-3) + 12, 20 + (-5) + (-8) + (-12). Group the positives and negatives."},
        {"key": "partD", "label": "Part D: missing numbers", "hint": "? + (-6) = 4, -9 + ? = 3, 15 + ? = -5, ? + 8 = -2."},
        {"key": "partE", "label": "Part E: real problems", "hint": "Earn $70 spend $95. Temperature -4 up 10 down 9. Lift on floor 6 down 10."},
        {"key": "taskA", "label": "Ledger (a): transactions as integers", "hint": "Five transactions as integers, and 25 plus the first one."},
        {"key": "taskB", "label": "Ledger (b): balances", "hint": "Balance after each transaction, written as an addition."},
        {"key": "taskC", "label": "Ledger (c): zero and lowest", "hint": "When exactly zero? What was the lowest balance?"},
        {"key": "taskD", "label": "Ledger (d): net change two ways", "hint": "Left to right, then group deposits and withdrawals."},
        {"key": "taskE", "label": "Ledger (e): deposit needed", "hint": "How much to deposit to reach $20 from the final balance?"},
        {"key": "taskF", "label": "Ledger (f): the student's mistake", "hint": "Two or three sentences about -45 + 30 = 15."},
        {"key": "taskG", "label": "Ledger (g): my own ledger", "hint": "Five transactions that cross zero at least twice."},
    ],
    ["Subtracting the sizes but forgetting to decide the sign, such as -45 + 30 = 15", "Always giving the first number's sign to the answer", "Adding the sizes when the signs are different, such as 9 + (-4) = 13", "Thinking the answer is always negative when there is a negative in the sum", "Ignoring the order of events in a ledger and only looking at the total", "Not noticing when the balance crosses zero"],
    ["Keep a mini ledger of pocket money for a week with deposits and spending, and check the final balance two ways.", "Find the daily minimum and maximum temperatures for a place over five days, write the changes as integers and add them.", "Play a card game: draw cards where red is negative and black is positive. Add each pair and score a point when the sum is positive."],
    "Part A: 9 + (-4) = 5; -9 + 4 = -5; 15 + (-20) = -5; -18 + 25 = 7; 30 + (-30) = 0; -41 + 13 = -28. Part B: 50 + (-60) is negative, = -10; -75 + 80 is positive, = 5; -12 + 12 is zero, = 0; 100 + (-99) is positive, = 1. Part C: 7 + (-4) + 9 + (-15) = 16 + (-19) = -3; -10 + 6 + (-3) + 12 = 18 + (-13) = 5; 20 + (-5) + (-8) + (-12) = 20 + (-25) = -5. Part D: 10 (since 10 + (-6) = 4); 12 (since -9 + 12 = 3); -20 (since 15 + (-20) = -5); -10 (since -10 + 8 = -2). Part E: 70 + (-95) = -$25; -4 + 10 = 6, then 6 + (-9) = -3 degrees; 6 + (-10) = floor -4. Ledger (a): transactions are -40, +15, -30, +60, -45; 25 + (-40). (b): 25 + (-40) = -15; -15 + 15 = 0; 0 + (-30) = -30; -30 + 60 = 30; 30 + (-45) = -15. (c): the balance was exactly zero after the second transaction; the lowest balance was -$30 after the third. (d): left to right gives -15; grouping: deposits 15 + 60 = 75, withdrawals -40 + (-30) + (-45) = -115, net change 75 + (-115) = -40, and 25 + (-40) = -15, which matches. (e): from -15 to 20 needs a deposit of $35. (f): the student subtracted the sizes but gave the answer the wrong sign; the larger size is 45 and it is negative, so the answer is -15. (g): accept any five-transaction ledger with correct balances that crosses zero at least twice. Quiz answers: -4; 7; 0; negative; 4; -3 + 10; -$25; -6 + 10 = 4; 13; -2.",
)
