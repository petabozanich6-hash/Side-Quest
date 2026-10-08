"""Stage 4 Mathematics, Week 1 Lesson 5: Integers, Zero pairs and the integer chip model.
All written work is typed inside the lesson. Replaces the placeholder with seed_key s4-maths-w01-l5.
No video is attached: none has been found and tested for this topic yet. Add one in the video and link run.
Outcome codes MA4-INT-C-01 and MAO-WM-01 are from the draft mapping and should be re-checked against NESA.
Chips are shown in text as [+] for a positive chip (+1) and [-] for a negative chip (-1).
"""
from lesson_library_s4_builder import build_s4, _q, _step, _sort, _wc

LESSON = build_s4(
    "s4-maths-w01-l5",
    "Week 1, Lesson 5: Zero Pairs and the Integer Chip Model",
    "Why does -6 + 4 equal -2? Picture it with chips. Every positive chip cancels one negative chip, and what is left is the answer. Learn the chip model, zero pairs, and how they explain every integer addition you have met this week.",
    "Integers",
    ["MA4-INT-C-01", "MAO-WM-01"],
    {
        "MA4-INT-C-01": "Primary. Represents integers and their addition using a concrete model (positive and negative chips and zero pairs), and links the model to the number line and to written calculations.",
        "MAO-WM-01": "Working mathematically: represents a problem in more than one way, explains why an answer is correct and checks one method against another.",
    },
    "We are learning to use positive and negative chips and zero pairs to show integers and to explain why integer additions work.",
    ["I can say what a positive chip and a negative chip stand for.", "I can find the value of a collection of chips.", "I can explain what a zero pair is and why it has no effect on value.", "I can add integers by combining chips and removing zero pairs.", "I can write an addition from a picture of chips.", "I can show the same integer in different ways by adding zero pairs.", "I can check a chip answer against the number line."],
    ["integer", "chip", "positive chip", "negative chip", "zero pair", "value", "model", "cancel", "sum"],
    ["This lesson (everything you need is inside it)", "Paper and pencil", "Optional: coins, buttons or paper squares in two colours to use as chips"],
    "You can add integers on the number line, and you can add integers with the same and with different signs (Week 1, Lessons 2 to 4).",
    (
        "Why this matters. A model lets you see why a rule works instead of just remembering it. The chip model shows integers as two kinds of counters and shows exactly what happens when positive and negative amounts meet. It also gets you ready to subtract integers in the next lessons.\n\n"
        "The chips. A positive chip stands for +1. We show it as [+]. A negative chip stands for -1. We show it as [-]. An integer is shown by a collection of chips. Seven positive chips show +7. Five negative chips show -5.\n\n"
        "Zero pairs. One positive chip and one negative chip together make a zero pair, because +1 + (-1) = 0. A zero pair has a value of zero, so adding it or taking it away does not change the value of a collection. Zero pairs are the heart of the model.\n\n"
        "The value of a collection. Cancel as many zero pairs as you can. Whatever chips remain give the value. 9 positive chips and 4 negative chips make 4 zero pairs, leaving 5 positive chips, so the value is +5. 3 positive chips and 5 negative chips make 3 zero pairs, leaving 2 negative chips, so the value is -2.\n\n"
        "Adding integers. To add two integers, put the chips for each integer together and then remove the zero pairs. For -6 + 4: six negative chips and four positive chips make 4 zero pairs, leaving 2 negative chips. So -6 + 4 = -2. When both integers have the same sign there are no zero pairs, so the chips just pile up: -3 + (-4) leaves 7 negative chips, which is -7.\n\n"
        "Adding zero pairs. You can add any number of zero pairs to a collection without changing its value. Three positive chips can also be shown as five positive chips and two negative chips, because the two extra negative chips are cancelled by two of the positive ones. This idea is very useful when you subtract integers in the next lessons.\n\n"
        "Checking. The chip model and the number line must agree. If you get -2 with chips and +2 on the number line, one of them has a mistake. Chips are great for understanding and for small numbers. For large numbers, use what the chips taught you: match up the sizes and see which sign is left over."
    ),
    [
        _step("1", "Positive and negative chips", "A positive chip [+] stands for +1. A negative chip [-] stands for -1. A collection of chips shows an integer.\n\nTo find the value of a collection, match up positives with negatives and see what is left.", "[+][+][+][+][+][+][+] shows +7. [-][-][-][-][-] shows -5. [+][+][+][-][-][-][-][-] has 3 positives and 5 negatives, so its value is -2.", "Count how many of each kind, then see which kind has more left over.", ("A collection has 3 positive chips and 5 negative chips. What is its value?", ["8", "2", "-2", "-8"], 2, "Three zero pairs cancel, leaving 2 negative chips, so the value is -2.")),
        _step("2", "Zero pairs", "A zero pair is one positive chip and one negative chip together: [+][-]. Its value is +1 + (-1) = 0.\n\nAdding or removing a zero pair never changes the value of a collection.", "[+][-] is a zero pair. 4 positive chips and 4 negative chips make 4 zero pairs and have a total value of 0.", "One of each colour cancels.", ("Which makes a zero pair?", ["Two positive chips", "One positive chip and one negative chip", "Two negative chips", "One positive chip on its own"], 1, "A zero pair is one positive chip and one negative chip.")),
        _step("3", "Adding with different signs", "To add two integers, put the chips for both on the table. Then take away all the zero pairs. What is left is the sum.\n\nThe chips left over have the sign of the integer with the larger size.", "-6 + 4: [-][-][-][-][-][-] and [+][+][+][+]. Remove 4 zero pairs. 2 negative chips are left, so -6 + 4 = -2.", "Pair them off. The leftovers are the answer.", ("What is -8 + 5?", ["-13", "13", "3", "-3"], 3, "Five zero pairs cancel, leaving 3 negative chips, so -8 + 5 = -3.")),
        _step("4", "Adding with the same signs", "When both integers have the same sign, all the chips are the same colour. There are no zero pairs to remove, so the chips simply pile up.\n\nThe sum is the total number of chips, with the same sign.", "-3 + (-4): 3 negative chips and 4 negative chips make 7 negative chips, which is -7.", "Same colour means no cancelling.", ("When you add -4 + (-6) with chips, how many zero pairs can you remove?", ["4", "6", "0", "10"], 2, "All the chips are negative, so there are no zero pairs.")),
        _step("5", "Showing a number in different ways", "You can add any number of zero pairs to a collection and its value stays the same. This lets you show the same integer in many ways.\n\nThe value is always the number of positive chips minus the number of negative chips.", "The value 3 can be shown as [+][+][+], or as 4 positives and 1 negative, or as 5 positives and 2 negatives. In every case, positives minus negatives is 3.", "Same value, different pictures.", ("Which collection also has a value of 3?", ["5 positive chips and 2 negative chips", "5 positive chips and 3 negative chips", "2 positive chips and 5 negative chips", "3 negative chips"], 0, "5 - 2 = 3, so two zero pairs were added to 3 positive chips.")),
        _step("6", "From a picture to an addition", "If a picture shows a group of positive chips and a group of negative chips, write it as an addition. The positive group is a positive integer. The negative group is a negative integer.\n\nThen the sum is the value of the picture.", "A picture with 8 positive chips and 3 negative chips shows 8 + (-3) = 5.", "Write each group as an integer, then add.", ("A picture shows 8 positive chips and 3 negative chips. Which addition does it show?", ["8 + 3 = 11", "8 + (-3) = 5", "-8 + 3 = -5", "-8 + (-3) = -11"], 1, "The positive group is 8 and the negative group is -3, so the addition is 8 + (-3) = 5.")),
        _step("7", "Chips and the number line agree", "The chip model and the number line are two pictures of the same idea. A zero pair is a move one way and then back again, which brings you to where you started.\n\nUse one model to check the other.", "-9 + 9 = 0: 9 negative chips and 9 positive chips make 9 zero pairs. On the number line, you move 9 right and 9 left and finish at 0.", "If two methods disagree, find the mistake.", ("Why does -9 + 9 equal 0 in the chip model?", ["9 positive chips and 9 negative chips make 9 zero pairs", "Both numbers are negative", "9 chips are left over", "The chips disappear for no reason"], 0, "Every chip is matched in a zero pair, so no chips are left and the value is 0.")),
    ],
    (
        "Scenario: Pia plays a chip game. In each draw she picks up some positive and some negative chips. Her first draw is 9 positive chips and 6 negative chips. Her second draw is 2 positive chips and 8 negative chips.\n\n"
        "Step 1, the first draw as an addition. 9 positive and 6 negative chips: 9 + (-6). Remove 6 zero pairs. 3 positive chips are left, so the first draw is worth +3.\n\n"
        "Step 2, the second draw. 2 positive and 8 negative chips: 2 + (-8). Remove 2 zero pairs. 6 negative chips are left, so the second draw is worth -6.\n\n"
        "Step 3, her total after both draws. 3 + (-6): 3 positive chips and 6 negative chips make 3 zero pairs, leaving 3 negative chips. Her total is -3.\n\n"
        "Step 4, check by pooling every chip. She has 9 + 2 = 11 positive chips and 6 + 8 = 14 negative chips. 11 zero pairs can be made, and 14 - 11 = 3 negative chips are left, so the total is -3. It matches.\n\n"
        "Step 5, check on the number line. Start at 3 and move 6 steps left. You pass zero after 3 steps and land on -3. Three methods agree.\n\n"
        "Step 6, show -3 another way. Add 4 zero pairs to her 3 negative chips. She now holds 4 positive and 7 negative chips, and 4 - 7 = -3. Adding zero pairs did not change her total.\n\n"
        "Reasoning check. Well done, {{name}}. In each case the chips that were left over told you the sign of the answer, and the number of zero pairs told you how much cancelled."
    ),
    (
        "Work through these on paper or in the practice boxes. Part A (value of chips): find the value of 7 positive and 3 negative chips, 2 positive and 9 negative chips, 6 positive and 6 negative chips, 0 positive and 5 negative chips, and 12 positive and 15 negative chips. Part B (adding with chips): work out 8 + (-5), -7 + 4, -6 + (-3), 5 + (-5), -9 + 12 and 10 + (-14). For each, say how many zero pairs you removed. Part C (same value, different pictures): show the value 4 in three different ways using zero pairs. Then find a collection of exactly 8 chips with a value of -2, and a collection of exactly 11 chips with a value of 5. Part D (picture to addition): write an addition for 9 positive and 4 negative chips, and for 3 positive and 10 negative chips, and give each sum. Part E (spot the error): each of these has a mistake. Say what went wrong and give the correct answer. -5 + 3 = -8; 6 + (-6) = 12; 4 + (-7) = 3. Part F (real problems): you have $12 and owe $7; you owe $9 and are given $4. Write each as an addition of integers and say what the chips would look like."
    ),
    (
        "Mission: Chip Lab Report. A lab game has four rounds. In each round you collect some positive and some negative chips. Round 1: 5 positive and 8 negative. Round 2: 7 positive and 2 negative. Round 3: 3 positive and 9 negative. Round 4: 10 positive and 4 negative. Type your answers in the boxes.\n\n"
        "(a) Write the value of each round as an addition, for example 5 + (-8) = ?, and give each sum.\n"
        "(b) Find the running total after each round, writing each step as an addition.\n"
        "(c) Pool all the chips from the four rounds. How many positive chips and how many negative chips are there in total? How many zero pairs can be made? What is left, and does it match your running total?\n"
        "(d) What was the lowest running total, and after which round was it?\n"
        "(e) How many positive chips would you need to add to the final total to make it exactly 10? Then design a draw of exactly 20 chips that has a value of exactly 10, and say how many chips are positive and how many are negative.\n"
        "(f) A student works out -6 + 4 and gets -10 because 'the chips pile up'. Explain in two or three sentences what mistake was made, using the words zero pair, and give the correct answer.\n"
        "(g) Make up your own four-round game that includes one round with a value of zero. Write each round as an addition, find the running totals and check by pooling all the chips."
    ),
    "Type your answers in the practice boxes. Show each step as an addition, say how many zero pairs you used, and write full sentences for the explanation questions.",
    "Did I find values by pairing up chips, remove zero pairs correctly, write additions from pictures, show the same value in different ways, and check my answer on the number line or by pooling the chips?",
    [
        _q("A collection has 9 positive and 4 negative chips. What is its value?", ["13", "5", "-5", "-13"], 1, "Four zero pairs cancel, leaving 5 positive chips, so the value is 5."),
        _q("A collection has 6 positive and 6 negative chips. What is its value?", ["12", "-12", "0", "6"], 2, "All the chips make zero pairs, so the value is 0."),
        _q("What is -8 + 5?", ["-13", "13", "3", "-3"], 3, "Five zero pairs cancel, leaving 3 negative chips, so the sum is -3."),
        _q("Which of these is a zero pair?", ["Two positive chips", "One positive chip and one negative chip", "Two negative chips", "One positive chip on its own"], 1, "+1 + (-1) = 0."),
        _q("When you add -4 + (-6) with chips, how many zero pairs can you remove?", ["4", "6", "0", "10"], 2, "All the chips are negative, so there are no zero pairs."),
        _q("Which collection has a value of -3?", ["4 positive and 7 negative chips", "7 positive and 4 negative chips", "3 positive chips", "3 positive and 3 negative chips"], 0, "4 - 7 = -3. The others have values of 3, 3 and 0."),
        _q("What is 12 + (-15)?", ["3", "-3", "27", "-27"], 1, "Twelve zero pairs cancel, leaving 3 negative chips, so the sum is -3."),
        _q("Adding a zero pair to a collection changes its value by...", ["+1", "-1", "0", "+2"], 2, "A zero pair has a value of zero. Great work, {{name}}."),
        _q("A picture shows 2 positive and 10 negative chips. Which addition does it show?", ["2 + 10 = 12", "2 + (-10) = -8", "-2 + 10 = 8", "-2 + (-10) = -12"], 1, "The positive group is 2 and the negative group is -10, so the addition is 2 + (-10) = -8."),
        _q("What is the value of 15 positive and 21 negative chips?", ["6", "-6", "36", "-36"], 1, "Fifteen zero pairs cancel, leaving 6 negative chips, so the value is -6."),
    ],
    "Type your answers in the practice boxes and submit them. Include full sentences for parts (c), (e), (f) and (g).",
    "Extension: the 12-chip investigation. Put exactly 12 chips on the table, some positive and some negative. List every possible value the collection can have, from all negative to all positive. What do you notice about the values, and why does it happen? Explain using zero pairs. Then predict what would happen with exactly 13 chips and check your prediction.",
    [("integer", "A whole number that can be positive, negative or zero"), ("chip", "A counter used to show an integer; a positive chip is +1 and a negative chip is -1"), ("positive chip", "A chip with a value of +1, shown as [+]"), ("negative chip", "A chip with a value of -1, shown as [-]"), ("zero pair", "One positive chip and one negative chip together, with a total value of zero"), ("value", "The integer that a collection of chips shows"), ("model", "A picture or object that shows how a mathematical idea works"), ("cancel", "To remove matching positive and negative amounts that add to zero"), ("sum", "The result of adding numbers together")],
    [],
    _sort("What will be left?", "Remove the zero pairs from each collection and sort it by the value of the chips that remain.", ["Positive", "Negative", "Zero"], [("7 positive, 3 negative", 0), ("3 positive, 7 negative", 1), ("5 positive, 5 negative", 2), ("10 positive, 1 negative", 0), ("2 positive, 8 negative", 1), ("9 positive, 9 negative", 2), ("6 positive, 0 negative", 0), ("0 positive, 4 negative", 1)]),
    [
        _wc("One positive chip and one negative chip make a...", ["zero pair", "double", "positive chip"], 0, "Together they have a value of zero."),
        _wc("What is 8 + (-8)?", ["16", "0", "-16"], 1, "Eight zero pairs leave nothing."),
        _wc("What is the value of 5 positive and 2 negative chips?", ["3", "7", "-3"], 0, "Two zero pairs cancel, leaving 3 positive chips."),
        _wc("What is -3 + (-2)?", ["-5", "-1", "5"], 0, "There are no zero pairs, so 3 + 2 = 5 negative chips."),
        _wc("What is -7 + 10?", ["3", "-3", "17"], 0, "Seven zero pairs cancel, leaving 3 positive chips."),
        _wc("What is the value of 4 positive and 9 negative chips?", ["5", "-5", "13"], 1, "Four zero pairs cancel, leaving 5 negative chips."),
        _wc("Adding a zero pair changes the value by...", ["0", "1", "-1"], 0, "A zero pair has a value of zero."),
        _wc("What is 6 + (-9)?", ["3", "-3", "15"], 1, "Six zero pairs cancel, leaving 3 negative chips."),
    ],
    [
        {"key": "partA", "label": "Part A: value of chips", "hint": "7 pos 3 neg, 2 pos 9 neg, 6 pos 6 neg, 0 pos 5 neg, 12 pos 15 neg."},
        {"key": "partB", "label": "Part B: adding with chips", "hint": "8 + (-5), -7 + 4, -6 + (-3), 5 + (-5), -9 + 12, 10 + (-14). How many zero pairs each?"},
        {"key": "partC", "label": "Part C: same value, different pictures", "hint": "Show 4 three ways. 8 chips worth -2. 11 chips worth 5."},
        {"key": "partD", "label": "Part D: picture to addition", "hint": "9 pos 4 neg. 3 pos 10 neg. Write the addition and the sum."},
        {"key": "partE", "label": "Part E: spot the error", "hint": "-5 + 3 = -8; 6 + (-6) = 12; 4 + (-7) = 3. What went wrong and what is correct?"},
        {"key": "partF", "label": "Part F: real problems", "hint": "$12 in hand and owe $7. Owe $9 and given $4."},
        {"key": "taskA", "label": "Lab report (a): value of each round", "hint": "Each round as an addition and its sum."},
        {"key": "taskB", "label": "Lab report (b): running totals", "hint": "Total after each round, written as an addition."},
        {"key": "taskC", "label": "Lab report (c): pooling the chips", "hint": "Total positive, total negative, zero pairs, what is left."},
        {"key": "taskD", "label": "Lab report (d): the lowest total", "hint": "Lowest running total and the round it happened."},
        {"key": "taskE", "label": "Lab report (e): reaching 10", "hint": "Positive chips needed. Then 20 chips worth exactly 10."},
        {"key": "taskF", "label": "Lab report (f): the student's mistake", "hint": "Two or three sentences about -6 + 4 = -10. Use the words zero pair."},
        {"key": "taskG", "label": "Lab report (g): my own game", "hint": "Four rounds, one worth zero, running totals, pooled check."},
    ],
    ["Piling up all the chips and ignoring the colours, such as -6 + 4 = -10", "Thinking a zero pair has a value of 2 or of 1", "Removing zero pairs from chips of the same colour", "Reading the leftover chips as having the wrong sign", "Believing that adding a zero pair changes the value", "Subtracting the number of chips instead of matching positive with negative"],
    ["Make real chips from coins, buttons or paper squares in two colours and act out five additions on a table.", "Play the chip game with a friend: roll two dice, one for positive chips and one for negative chips, and keep a running total.", "Draw a number line under your chips and show a move for each chip to see the two models match."],
    "Part A: 7 positive and 3 negative = 4; 2 positive and 9 negative = -7; 6 positive and 6 negative = 0; 0 positive and 5 negative = -5; 12 positive and 15 negative = -3. Part B: 8 + (-5) = 3 (5 zero pairs); -7 + 4 = -3 (4 zero pairs); -6 + (-3) = -9 (0 zero pairs); 5 + (-5) = 0 (5 zero pairs); -9 + 12 = 3 (9 zero pairs); 10 + (-14) = -4 (10 zero pairs). Part C: accept any three correct pictures of 4, for example 4 positive; 5 positive and 1 negative; 6 positive and 2 negative. Eight chips worth -2: 3 positive and 5 negative. Eleven chips worth 5: 8 positive and 3 negative. Part D: 9 + (-4) = 5; 3 + (-10) = -7. Part E: -5 + 3 = -2, the student added the sizes when the signs are different, so zero pairs cancel; 6 + (-6) = 0, 6 zero pairs cancel everything; 4 + (-7) = -3, there are 4 zero pairs and 3 negative chips are left, so the sign is negative. Part F: 12 + (-7) = $5, with 7 zero pairs and 5 positive chips left; -9 + 4 = -$5, with 4 zero pairs and 5 negative chips left. Lab report (a): 5 + (-8) = -3; 7 + (-2) = 5; 3 + (-9) = -6; 10 + (-4) = 6. (b): 0 + (-3) = -3; -3 + 5 = 2; 2 + (-6) = -4; -4 + 6 = 2. (c): positive chips 5 + 7 + 3 + 10 = 25; negative chips 8 + 2 + 9 + 4 = 23; 23 zero pairs; 2 positive chips are left, so the total is 2, which matches. (d): the lowest running total was -4, after Round 3. (e): 8 more positive chips (2 + 8 = 10). For 20 chips worth 10: 15 positive and 5 negative, since 15 - 5 = 10 and 15 + 5 = 20. (f): the student piled up the chips and ignored the colours; 4 positive chips and 6 negative chips make 4 zero pairs which cancel, leaving 2 negative chips, so the answer is -2. (g): accept any four-round game with one round worth zero, correct running totals and a correct pooled check. Quiz answers: 5; 0; -3; one positive chip and one negative chip; 0; 4 positive and 7 negative; -3; 0; 2 + (-10) = -8; -6.",
)
