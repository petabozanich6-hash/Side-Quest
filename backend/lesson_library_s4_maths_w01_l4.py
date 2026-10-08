"""Stage 4 Mathematics, Week 1 Lesson 4: Integers, Adding integers with different signs.
Rebuilt to the depth of the Stage 2 reference lesson. All written work is typed inside the lesson.
Replaces the placeholder with seed_key s4-maths-w01-l4.

VIDEO STATUS: candidate YouTube videos found by search, NOT yet embedded or embed-tested:
  7zMpfHufMY8 (How to Add Integers, same signs vs different signs)
  0EQrgWFHO7w (Adding Integers, with the same and different signs)
They are listed as links in resources until each has been watched and tested for embedding.
Outcome codes MA4-INT-C-01 and MAO-WM-01 are from the draft mapping and should be re-checked against NESA.
"""
from lesson_library_s4_builder import build_s4, _q, _step, _sort, _wc, _article

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
    [
        "I can tell when two integers have different signs.",
        "I can predict whether a sum will be positive, negative or zero before calculating.",
        "I can add two integers with different signs.",
        "I can explain why equal-sized opposite integers add to zero.",
        "I can add a longer list of mixed integers by grouping positives and negatives.",
        "I can find a missing number in an addition.",
        "I can solve real problems with deposits, withdrawals and temperature changes.",
        "I can explain my reasoning using the number line.",
    ],
    ["integer", "sum", "different signs", "size", "opposite", "cancel", "net change", "balance", "number line"],
    ["This lesson (everything you need is inside it)", "Paper and pencil", "A printed number line from -50 to 50 (optional)"],
    "You can add integers by moving on a number line, and you can add integers that have the same sign by adding their sizes (Week 1, Lessons 2 and 3).",
    (
        "Why this matters. Real life mixes ups and downs. A bank account has deposits and withdrawals. The temperature rises in the day and falls at night. A lift goes up and then down. When positives and negatives meet, they work against each other, so you need to know which one wins and by how much. Being able to do this quickly and check it is what makes budgets, temperature logs and scores make sense.\n\n"
        "The parts. Two integers have different signs when one is positive and one is negative, such as 9 and -4. On the number line, one move goes right and the other goes left, so they partly or fully cancel. The size of an integer is its distance from zero. With different signs, subtract the smaller size from the larger size, and the answer takes the sign of the integer with the larger size. For 9 + (-4), the sizes are 9 and 4, and 9 - 4 = 5. The larger size belongs to the positive 9, so the answer is 5. For -9 + 4, the sizes give 5 again, but the larger size belongs to -9, so the answer is -5. Equal sizes cancel: -7 + 7 = 0.\n\n"
        "The big check: predict before you calculate. Compare the sizes first, because the bigger move decides the sign. In -45 + 30, the size 45 is larger and belongs to a negative, so the answer must be negative. You can say this before doing any arithmetic, and then use the prediction as a built-in check. If your calculation gives a different sign from your prediction, stop and look for a mistake. A common error is to write 15 here, because 45 - 30 = 15, but the sign is lost.\n\n"
        "Where do the clues come from? In a real problem, the words tell you the sign. Earning, depositing, rising, gaining and above are positive. Spending, withdrawing, owing, falling, losing and below are negative. Say what zero means (a balance of $0, 0 degrees, ground floor) and write each change as an integer before you add. In a ledger, the order of events matters for the balance after each step, even though the order does not change the final total.\n\n"
        "The routine. Use these steps every time. 1. Signs: are they different? 2. Predict: which size is larger, and what sign does it have? 3. Subtract: the smaller size from the larger size. 4. Sign: the sign of the larger size. 5. Check: does the answer match your prediction, and does it make sense on the number line? For longer lists, add all the positives, add all the negatives, then combine the two totals. Then check by working left to right.\n\n"
        "This links to other skills. In Lesson 3 you added same-sign integers by adding the sizes, and here you subtract sizes instead. The size of an integer is absolute value from Lesson 1. In the next lesson you will use chips to see why opposites cancel (zero pairs). Later in Stage 4, the same pattern lets you collect like terms in algebra, such as 5x + (-8)x = -3x, and work out changes in coordinates, so this lesson is a tool for the whole year.\n\n"
        "A quick demonstration. Take this question: 'The temperature is -4 degrees. It rises 10 degrees and then falls 9 degrees. What is it now?' Signs: the changes are +10 and -9, which are different. First step: -4 + 10. The sizes are 4 and 10, the larger is positive, 10 - 4 = 6, so the answer is 6. Second step: 6 + (-9). The sizes are 6 and 9, the larger is negative, 9 - 6 = 3, so the answer is -3. Check: net change is 10 + (-9) = 1, and -4 + 1 = -3. The temperature is -3 degrees."
    ),
    [
        _step("1", "Different signs pull against each other", "Two integers have different signs when one is positive and one is negative. On the number line, one move goes right and the other goes left, so they partly cancel.\n\nThe bigger move decides which way you end up.", "9 and -4 have different signs. -4 and -9 have the same sign.", "Different signs means opposite moves. Look at the sizes to see who wins.", ("Which pair has different signs?", ["-4 and -9", "6 and 11", "-5 and 8", "-2 and -2"], 2, "-5 is negative and 8 is positive, so the signs are different.")),
        _step("2", "Positive wins", "When the positive integer has the larger size, the sum is positive. Subtract the smaller size from the larger size.\n\nOn the number line, you start on the positive side and do not move all the way back past zero.", "9 + (-4): start at 9, move 4 steps left, land on 5. Sizes: 9 - 4 = 5, and the positive 9 is larger, so the answer is 5.", "Bigger positive means a positive answer.", ("What is 9 + (-4)?", ["13", "-5", "-13", "5"], 3, "The sizes are 9 and 4, 9 - 4 = 5, and the positive is larger, so the sum is 5.")),
        _step("3", "Negative wins", "When the negative integer has the larger size, the sum is negative. Subtract the smaller size from the larger size and keep the negative sign.\n\nOn the number line, you start on the negative side and move right, but not all the way to zero.", "-9 + 4: start at -9, move 4 steps right, land on -5. Sizes: 9 - 4 = 5, and the negative -9 is larger in size, so the answer is -5.", "Bigger negative means a negative answer.", ("What is -9 + 4?", ["13", "-5", "5", "-13"], 1, "The sizes are 9 and 4, 9 - 4 = 5, and the negative has the larger size, so the sum is -5.")),
        _step("4", "Equal sizes cancel", "When the two sizes are equal, the moves cancel exactly and the sum is zero. A number and its opposite always add to zero.\n\nYou finish exactly where you started.", "-7 + 7 = 0. 25 + (-25) = 0.", "Equal and opposite means zero.", ("What is -7 + 7?", ["0", "14", "-14", "7"], 0, "-7 and 7 are opposites, so they cancel to zero.")),
        _step("5", "Longer lists", "For a list with both positives and negatives, add all the positives together and add all the negatives together. Then combine the two totals, which have different signs.\n\nThe order does not matter, so grouping is allowed.", "8 + (-3) + 5 + (-12): positives 8 + 5 = 13. Negatives (-3) + (-12) = -15. Then 13 + (-15) = -2.", "Group the positives, group the negatives, then combine.", ("What is 8 + (-3) + 5 + (-12)?", ["2", "28", "-2", "-28"], 2, "The positives total 13, the negatives total -15, and 13 + (-15) = -2.")),
        _step("6", "Predict before you calculate", "Compare the sizes first. The integer with the larger size decides the sign of the sum. Predicting the sign gives you a built-in check on your answer.\n\nIf your calculation gives a different sign from your prediction, look for a mistake.", "-45 + 30: the size 45 is larger and belongs to the negative, so the answer must be negative. The calculation gives -15.", "Predict the sign, calculate, then compare.", ("Without calculating, what is the sign of -45 + 30?", ["Positive", "Zero", "Cannot tell", "Negative"], 3, "The larger size, 45, belongs to the negative, so the answer is negative.")),
        _step("7", "Real problems", "Deposits and earnings are positive. Withdrawals, spending and losses are negative. When one follows the other, you add integers with different signs.\n\nA negative balance means money is owed.", "Earn $70, then spend $95: 70 + (-95) = -25, so the balance is -$25.", "Write each change as an integer. Add. Say the answer in words.", ("You earn $70 and then spend $95. What is your balance?", ["$25", "-$25", "$165", "-$165"], 1, "70 + (-95) = -25.")),
        _step("8", "Explaining your reasoning", "A good explanation names the signs, compares the sizes, says which one is larger and what sign the answer has, and links back to the number line.\n\nSentence starter: 'The signs are ___, the larger size is ___ and it is ___, so the answer is ___, and the number line shows ___.'", "'The signs are different. The larger size is 9 and it is negative, so -9 + 4 is negative. 9 - 4 = 5, so the answer is -5. On the number line I start at -9 and move 4 right, stopping short of zero.'", "Your reason should mention the signs, the larger size and the direction.", ("Which is the best reason that 6 + (-10) = -4?", ["Because 6 is smaller than 10", "The signs are different, the larger size is 10 and it is negative, and 10 - 6 = 4", "Because the answer is negative", "I just know it"], 1, "A good explanation names the signs, compares sizes and gives the sign of the larger one.")),
    ],
    (
        "Scenario: Sam's account is overdrawn by $20, so the starting balance is -20. Over a week there are five transactions in order: a deposit of $60, a withdrawal of $85, a deposit of $40, a withdrawal of $30 and a deposit of $50.\n\n"
        "Step 1, find zero and write each transaction as an integer. Zero is a balance of $0. Deposits are positive and withdrawals are negative: +60, -85, +40, -30, +50.\n\n"
        "Step 2, follow the balance one transaction at a time. Start at -20. After +60: -20 + 60 = 40. After -85: 40 + (-85) = -45. After +40: -45 + 40 = -5. After -30: -5 + (-30) = -35. After +50: -35 + 50 = 15. The final balance is $15.\n\n"
        "Step 3, check with the net change. Positives: 60 + 40 + 50 = 150. Negatives: -85 + (-30) = -115. Net change: 150 + (-115) = 35. Then -20 + 35 = 15. It matches, so the answer is checked two ways.\n\n"
        "Step 4, what was the lowest balance? The balances were -20, 40, -45, -5, -35 and 15. The lowest was -45, after the withdrawal of $85.\n\n"
        "Step 5, which transactions changed the balance from negative to positive or from positive to negative? The first deposit took it from -20 to 40 (negative to positive). The $85 withdrawal took it from 40 to -45 (positive to negative). The last deposit took it from -35 to 15 (negative to positive).\n\n"
        "Reasoning check. The $40 deposit raised the balance from -45 to -5, but it was not enough to make it positive, because 40 is less than 45. Well done, {{name}}. You predicted, calculated and checked."
    ),
    (
        "Work through these on paper or in the practice boxes. Part A (two integers): work out 9 + (-4), -9 + 4, 15 + (-20), -18 + 25, 30 + (-30) and -41 + 13. Part B (predict the sign first): say whether each sum will be positive, negative or zero without calculating, then work it out: 50 + (-60), -75 + 80, -12 + 12, 100 + (-99). Part C (longer lists): work out 7 + (-4) + 9 + (-15), -10 + 6 + (-3) + 12 and 20 + (-5) + (-8) + (-12) by grouping the positives and the negatives. Part D (missing numbers): find the number that goes in the gap. ? + (-6) = 4, -9 + ? = 3, 15 + ? = -5, ? + 8 = -2. Part E (spot the error): each of these has a mistake. Say what went wrong and give the correct answer. -45 + 30 = 15; 9 + (-4) = 13; -7 + 7 = -14. Part F (real problems): you earn $70 and spend $95; a temperature of -4 degrees rises by 10 degrees and then falls by 9 degrees; a lift is on floor 6 and goes down 10 floors. Write each as an addition of integers and give the answer with units."
    ),
    (
        "Mission: Bank Ledger Detective. A student's account starts with a balance of $25. Five transactions happen in this order: withdrawal $40, deposit $15, withdrawal $30, deposit $60, withdrawal $45. Work through the stages in order and type everything in the boxes.\n\n"
        "Stage 1 (find zero and write the moves): say what a balance of zero means, write each transaction as an integer, and write the starting balance plus the first transaction as an addition.\n"
        "Stage 2 (balances): find the balance after each of the five transactions, writing each step as an addition. Predict the sign of each balance before you calculate it.\n"
        "Stage 3 (zero and the lowest point): when was the balance exactly zero, and what was the lowest balance?\n"
        "Stage 4 (net change two ways): find the net change by adding left to right, and then by grouping the deposits and the withdrawals. Check that both give the same final balance.\n"
        "Stage 5 (spot the mistake and fix the account): a student works out -45 + 30 and gets 15 because 45 - 30 = 15. Explain in two or three sentences what mistake was made, point to the number line, and give the correct answer. Then work out how much the student would need to deposit after the last transaction to have a balance of $20.\n"
        "Stage 6 (make your own): make up your own ledger of five transactions that makes the balance cross zero at least twice. Write each transaction as an integer, find the balance after each, say when it crossed zero, and explain your reasoning in at least three sentences."
    ),
    "Type your answers in the practice boxes. Show each step as an addition and write full sentences for the explanation stages.",
    "Did I find zero, predict the sign by comparing sizes, subtract the smaller size from the larger, give the answer the sign of the larger size, group positives and negatives in longer lists, check my total in a second way, and explain my reasoning?",
    [
        _q("What is 8 + (-12)?", ["4", "-4", "20", "-20"], 1, "The sizes are 8 and 12. 12 - 8 = 4, and the larger size is negative, so the sum is -4."),
        _q("What is -15 + 22?", ["-7", "-37", "7", "37"], 2, "22 - 15 = 7 and the larger size is positive, so the sum is 7."),
        _q("What is -30 + 30?", ["0", "60", "-60", "30"], 0, "Opposites cancel to zero."),
        _q("Without calculating, what is the sign of -64 + 50?", ["Positive", "Negative", "Zero", "Cannot tell"], 1, "The larger size is 64 and it belongs to the negative, so the sum is negative."),
        _q("What is 5 + (-9) + 12 + (-4)?", ["-4", "30", "-30", "4"], 3, "The positives total 17, the negatives total -13, and 17 + (-13) = 4."),
        _q("Which sum is positive?", ["-20 + 15", "-7 + 4", "-3 + 10", "12 + (-13)"], 2, "-3 + 10 = 7. The others are -5, -3 and -1."),
        _q("A balance of $40 has a withdrawal of $65. What is the new balance?", ["$25", "-$25", "$105", "-$105"], 1, "40 + (-65) = -25."),
        _q("Which statement is true?", ["-6 + 10 = 4", "-6 + 10 = -4", "-6 + 10 = 16", "-6 + 10 = -16"], 0, "10 - 6 = 4 and the positive has the larger size, so the answer is 4. Great work, {{name}}."),
        _q("What number goes in the gap? -8 + ? = 5", ["-3", "3", "-13", "13"], 3, "From -8 you need to move 13 steps right to reach 5, so the missing number is 13."),
        _q("The temperature is -5 degrees, rises 9 degrees and then falls 6 degrees. What is it now?", ["2", "-2", "-20", "20"], 1, "-5 + 9 = 4, then 4 + (-6) = -2."),
    ],
    "Type your answers in the practice boxes and submit them. Include full sentences for the explanation stages.",
    "Extension: a ledger puzzle. Starting from a balance of $0, make five transactions, using each of the numbers 10, 20, 30, 40 and 50 once, each as either a deposit or a withdrawal, so that the final balance is exactly $10. Find at least two different solutions and explain how you know each is correct using the net change.",
    [("integer", "A whole number that can be positive, negative or zero"), ("sum", "The result of adding numbers together"), ("different signs", "One integer is positive and the other is negative"), ("size", "How far an integer is from zero, ignoring its sign"), ("opposite", "The integer the same distance from zero on the other side"), ("cancel", "When equal and opposite amounts add to zero"), ("net change", "The overall change after a series of moves added together"), ("balance", "The amount of money in an account; negative means money is owed"), ("number line", "A line showing numbers in order, with zero in the middle")],
    [
        _article("YouTube: How to Add Integers, same signs vs different signs", "https://www.youtube.com/watch?v=7zMpfHufMY8"),
        _article("YouTube: Adding Integers, with the same and different signs", "https://www.youtube.com/watch?v=0EQrgWFHO7w"),
        _article("Khan Academy: Adding integers on the number line", "https://en.khanacademy.org/math/grade-6-math/xf8b56da266eb02cb:integers/xf8b56da266eb02cb:intro-to-adding-negative-numbers/v/adding-integers-on-the-number-line"),
        _article("BBC Bitesize: How to add and subtract positive and negative numbers (KS3)", "https://www.bbc.co.uk/bitesize/articles/zrjsn9q"),
    ],
    _sort("Will the sum be positive, negative or zero?", "Predict the sign by comparing sizes, then sort each addition.", ["Positive", "Negative", "Zero"], [("12 + (-5)", 0), ("-12 + 5", 1), ("-9 + 9", 2), ("20 + (-25)", 1), ("-3 + 10", 0), ("14 + (-14)", 2), ("-30 + 18", 1), ("7 + (-2)", 0)]),
    [
        _wc("What is 6 + (-2)?", ["-4", "4", "8"], 1, "6 - 2 = 4 and the positive is larger."),
        _wc("What is -6 + 2?", ["4", "-4", "8"], 1, "6 - 2 = 4 and the negative is larger, so -4."),
        _wc("What is -10 + 10?", ["20", "-20", "0"], 2, "Opposites cancel to zero."),
        _wc("What is 3 + (-8)?", ["5", "-5", "11"], 1, "8 - 3 = 5 and the negative is larger, so -5."),
        _wc("What is -14 + 20?", ["-6", "34", "6"], 2, "20 - 14 = 6 and the positive is larger."),
        _wc("With different signs, the sum takes the sign of the integer with the...", ["smaller size", "larger size", "first position"], 1, "The bigger move decides the sign."),
        _wc("What is 9 + (-9)?", ["18", "0", "-18"], 1, "Opposites cancel to zero."),
        _wc("What is -25 + 5?", ["20", "-30", "-20"], 2, "25 - 5 = 20 and the negative is larger, so -20."),
    ],
    [
        {"key": "partA", "label": "Part A: two integers", "hint": "9 + (-4), -9 + 4, 15 + (-20), -18 + 25, 30 + (-30), -41 + 13."},
        {"key": "partB", "label": "Part B: predict the sign first", "hint": "50 + (-60), -75 + 80, -12 + 12, 100 + (-99). Predict, then calculate."},
        {"key": "partC", "label": "Part C: longer lists", "hint": "7 + (-4) + 9 + (-15), -10 + 6 + (-3) + 12, 20 + (-5) + (-8) + (-12). Group the positives and negatives."},
        {"key": "partD", "label": "Part D: missing numbers", "hint": "? + (-6) = 4, -9 + ? = 3, 15 + ? = -5, ? + 8 = -2."},
        {"key": "partE", "label": "Part E: spot the error", "hint": "-45 + 30 = 15; 9 + (-4) = 13; -7 + 7 = -14. What went wrong and what is correct?"},
        {"key": "partF", "label": "Part F: real problems", "hint": "Earn $70 spend $95. Temperature -4 up 10 down 9. Lift on floor 6 down 10."},
        {"key": "stage1", "label": "Stage 1: zero and the transactions", "hint": "What does a balance of zero mean? Five transactions as integers, and 25 plus the first one."},
        {"key": "stage2", "label": "Stage 2: balances", "hint": "Predict the sign, then the balance after each transaction as an addition."},
        {"key": "stage3", "label": "Stage 3: zero and the lowest point", "hint": "When exactly zero? What was the lowest balance?"},
        {"key": "stage4", "label": "Stage 4: net change two ways", "hint": "Left to right, then group deposits and withdrawals. Do they match?"},
        {"key": "stage5", "label": "Stage 5: the mistake and the deposit", "hint": "Two or three sentences about -45 + 30 = 15. Then the deposit needed to reach $20."},
        {"key": "stage6", "label": "Stage 6: my own ledger", "hint": "Five transactions that cross zero at least twice, balances, and an explanation of at least three sentences."},
    ],
    ["Subtracting the sizes but forgetting to decide the sign, such as -45 + 30 = 15", "Always giving the first number's sign to the answer", "Adding the sizes when the signs are different, such as 9 + (-4) = 13", "Thinking the answer is always negative when there is a negative in the sum", "Ignoring the order of events in a ledger and only looking at the total", "Not noticing when the balance crosses zero"],
    ["Keep a mini ledger of pocket money for a week with deposits and spending, and check the final balance two ways.", "Find the daily minimum and maximum temperatures for a place over five days, write the changes as integers and add them."],
    "Part A: 9 + (-4) = 5; -9 + 4 = -5; 15 + (-20) = -5; -18 + 25 = 7; 30 + (-30) = 0; -41 + 13 = -28. Part B: 50 + (-60) is negative, = -10; -75 + 80 is positive, = 5; -12 + 12 is zero, = 0; 100 + (-99) is positive, = 1. Part C: 7 + (-4) + 9 + (-15) = 16 + (-19) = -3; -10 + 6 + (-3) + 12 = 18 + (-13) = 5; 20 + (-5) + (-8) + (-12) = 20 + (-25) = -5. Part D: 10 (since 10 + (-6) = 4); 12 (since -9 + 12 = 3); -20 (since 15 + (-20) = -5); -10 (since -10 + 8 = -2). Part E: -45 + 30 = -15, the student lost the negative sign (the larger size is negative); 9 + (-4) = 5, the student added the sizes instead of subtracting them; -7 + 7 = 0, opposites cancel to zero. Part F: 70 + (-95) = -$25; -4 + 10 = 6, then 6 + (-9) = -3 degrees; 6 + (-10) = floor -4. Stage 1: a balance of zero means no money and no debt; transactions are -40, +15, -30, +60, -45; 25 + (-40). Stage 2: 25 + (-40) = -15 (negative, as 40 is larger); -15 + 15 = 0; 0 + (-30) = -30; -30 + 60 = 30; 30 + (-45) = -15. Stage 3: the balance was exactly zero after the second transaction; the lowest balance was -$30 after the third. Stage 4: left to right gives -15; grouping: deposits 15 + 60 = 75, withdrawals -40 + (-30) + (-45) = -115, net change 75 + (-115) = -40, and 25 + (-40) = -15, which matches. Stage 5: the student subtracted the sizes but gave the answer the wrong sign; the larger size is 45 and it is negative, so the answer is -15. From -15 to 20 needs a deposit of $35. Stage 6: accept any five-transaction ledger with correct balances that crosses zero at least twice, with a reasoned explanation. Quiz answers: -4; 7; 0; negative; 4; -3 + 10; -$25; -6 + 10 = 4; 13; -2.",
)
