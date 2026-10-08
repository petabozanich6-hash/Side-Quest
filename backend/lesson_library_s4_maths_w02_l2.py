"""Stage 4 Mathematics, Week 2 Lesson 2: Integers, Subtracting a negative integer.
All written work is typed inside the lesson. Replaces the placeholder with seed_key s4-maths-w02-l2.
No video is attached: none has been found and tested for this topic yet. Add one in the video and link run.
Outcome codes MA4-INT-C-01 and MAO-WM-01 are from the draft mapping and should be re-checked against NESA.
Builds on W1 L5 (chips and zero pairs) and W2 L1 (subtracting positives, a - b as the move from b to a).
Chips are shown in text as [+] for a positive chip (+1) and [-] for a negative chip (-1).
"""
from lesson_library_s4_builder import build_s4, _q, _step, _sort, _wc

LESSON = build_s4(
    "s4-maths-w02-l2",
    "Week 2, Lesson 2: Subtracting a Negative Integer",
    "Taking away a debt leaves you better off. Learn why subtracting a negative integer gives the same answer as adding a positive one, and prove it three ways: with chips, with a pattern and on the number line.",
    "Integers",
    ["MA4-INT-C-01", "MAO-WM-01"],
    {
        "MA4-INT-C-01": "Primary. Subtracts a negative integer using chips with zero pairs, number patterns and the number line, and explains why subtracting a negative gives the same result as adding its positive opposite.",
        "MAO-WM-01": "Working mathematically: uses several representations to justify a rule, spots a pattern and generalises, and checks answers a second way.",
    },
    "We are learning to subtract negative integers and to explain why it is the same as adding a positive integer.",
    ["I can subtract negative integers using chips.", "I can use zero pairs when there are not enough negative chips to take away.", "I can use a pattern to explain why subtracting a negative increases the answer.", "I can show a subtraction of a negative on the number line.", "I can rewrite a - (-b) as a + b and calculate.", "I can solve real problems such as cancelled debts and switched-off cooling.", "I can check an answer using a second method."],
    ["integer", "subtract", "negative", "zero pair", "opposite", "pattern", "number line", "chip", "debt"],
    ["This lesson (everything you need is inside it)", "Paper and pencil", "Optional: coins, buttons or paper squares in two colours to use as chips"],
    "You can subtract a positive integer on the number line, you know a - b is the move from b to a, and you can use chips and zero pairs (Week 1 Lesson 5 and Week 2 Lesson 1).",
    (
        "Why this matters. Subtracting a negative looks strange: two minus signs side by side, and the answer goes up. But it makes sense. If you owe $5 and the debt is cancelled, you are $5 better off. Taking away something negative improves your position. This lesson shows you why, so that you can trust the rule instead of just remembering it.\n\n"
        "Chips, enough negatives. -5 - (-2): start with 5 negative chips [-][-][-][-][-] and take away 2 negative chips. 3 negative chips are left, so -5 - (-2) = -3.\n\n"
        "Chips, not enough negatives. 3 - (-2): start with 3 positive chips. There are no negative chips to take away. Add 2 zero pairs, which does not change the value. Now you have 5 positive chips and 2 negative chips. Take away the 2 negative chips. 5 positive chips are left, so 3 - (-2) = 5. Notice that the answer is bigger than the start.\n\n"
        "The pattern. Look at 5 - 2 = 3, 5 - 1 = 4, 5 - 0 = 5. Each time we subtract 1 less, the answer goes up by 1. Continue the pattern: 5 - (-1) = 6, 5 - (-2) = 7. Subtracting less and less leads us to subtracting a negative, and the answers keep climbing.\n\n"
        "The number line. a - b is the move from b to a. For 2 - (-4), find the move from -4 to 2. That is 6 steps to the right, so 2 - (-4) = 6. For -3 - (-5), the move from -5 to -3 is 2 steps to the right, so the answer is 2.\n\n"
        "The rule. Subtracting a negative integer is the same as adding the positive integer of the same size. a - (-b) = a + b. So 8 - (-3) = 8 + 3 = 11, and -6 - (-9) = -6 + 9 = 3. The two minus signs next to each other turn into a plus.\n\n"
        "The sign of the answer can still be negative. -9 - (-4) = -9 + 4 = -5. The answer is bigger than -9, but it is still below zero. Subtracting a negative always increases the value, but whether you end up above or below zero depends on the numbers.\n\n"
        "Checking. Use a second method. Add back what you subtracted: if -8 - (-5) = -3, then -3 + (-5) should be -8, and it is."
    ),
    [
        _step("1", "Taking away negative chips", "To subtract negative chips, start with the collection and remove that many negative chips.\n\nIf there are enough negative chips, just take them away and read the value of what is left.", "-5 - (-2): start with 5 negative chips, take away 2, and 3 negative chips are left, so the answer is -3.", "Take away the negative chips, then read what is left.", ("What is -7 - (-3)?", ["-10", "-4", "4", "10"], 1, "Take 3 negative chips from 7 negative chips and 4 are left, so -4.")),
        _step("2", "Not enough chips? Add zero pairs", "If there are not enough negative chips to remove, add zero pairs. This does not change the value, but it gives you negative chips to take away.\n\nAfter you take them away, the positive chips remain.", "3 - (-2): start with 3 positive chips. Add 2 zero pairs to get 5 positive and 2 negative. Take away 2 negative. 5 positive chips are left, so the answer is 5.", "Add zero pairs, then take away.", ("What is 4 - (-3)?", ["1", "-1", "7", "-7"], 2, "Add 3 zero pairs, take away 3 negative chips, and 7 positive chips remain.")),
        _step("3", "A pattern that leads to negatives", "Subtract a smaller and smaller number and watch the answers. Each time the number being subtracted drops by 1, the answer rises by 1.\n\nKeep the pattern going past zero into the negatives.", "5 - 2 = 3, 5 - 1 = 4, 5 - 0 = 5, 5 - (-1) = 6, 5 - (-2) = 7.", "Subtract less, get more. The pattern does not break at zero.", ("Continue the pattern: 4 - 2 = 2, 4 - 1 = 3, 4 - 0 = 4. What is 4 - (-1)?", ["3", "4", "5", "-5"], 2, "Each step the answer goes up by 1, so 4 - (-1) = 5.")),
        _step("4", "On the number line", "The subtraction a - b is the move from b to a. Find where b and a are, then count the steps and give the direction.\n\nA move to the right is positive.", "2 - (-4): from -4 to 2 is 6 steps right, so the answer is 6. -3 - (-5): from -5 to -3 is 2 steps right, so the answer is 2.", "From b to a. Right is positive.", ("What is -1 - (-6)?", ["-7", "-5", "5", "7"], 2, "The move from -6 to -1 is 5 steps right, so the answer is 5.")),
        _step("5", "The rule", "Subtracting a negative integer is the same as adding the matching positive integer.\n\nWrite a - (-b) as a + b, then work it out as an addition.", "8 - (-3) = 8 + 3 = 11. -6 - (-9) = -6 + 9 = 3.", "Two minus signs make a plus.", ("What is -6 - (-9)?", ["-15", "-3", "3", "15"], 2, "-6 - (-9) = -6 + 9 = 3.")),
        _step("6", "The answer can still be negative", "Subtracting a negative always makes the value bigger, but it does not always make it positive. Change to an addition and think about the signs.\n\nIf the negative number you start with is larger in size, the answer stays negative.", "-9 - (-4) = -9 + 4 = -5. The answer is bigger than -9 but still below zero.", "Bigger does not mean positive.", ("What is -9 - (-4)?", ["-13", "-5", "5", "13"], 1, "-9 - (-4) = -9 + 4 = -5.")),
        _step("7", "Real problems", "Cancelling a debt, removing a cold source or switching off a cooling machine are all subtractions of a negative. The result goes up.\n\nWrite the start, the thing taken away (as a negative), and the answer with units.", "You owe $8 and $5 of the debt is cancelled: -8 - (-5) = -3. You now owe $3.", "Take away a debt and you are better off.", ("You owe $20 and $12 of the debt is cancelled. What is your balance now?", ["-$32", "-$8", "$8", "$32"], 1, "-20 - (-12) = -20 + 12 = -8, so you owe $8.")),
    ],
    (
        "Scenario: Marcus owes his friends $9, so his balance is -9. Two debts are cancelled: first a debt of $4, then a debt of $6.\n\n"
        "Step 1, the first cancellation. -9 - (-4). With chips: start with 9 negative chips and take away 4 negative chips. 5 negative chips are left, so the balance is -5.\n\n"
        "Step 2, the second cancellation. -5 - (-6). With chips: there are only 5 negative chips but we need to take away 6. Add 1 zero pair to get 1 positive chip and 6 negative chips. Take away 6 negative chips and 1 positive chip is left. The balance is +1.\n\n"
        "Step 3, check on the number line. -5 - (-6) is the move from -6 to -5, which is 1 step right. So the answer is 1. It agrees.\n\n"
        "Step 4, check with the rule. -5 - (-6) = -5 + 6 = 1. It agrees again.\n\n"
        "Step 5, check using the total. The cancelled debts are -4 and -6, which add up to -10. Then -9 - (-10) = -9 + 10 = 1. The answers match.\n\n"
        "Step 6, interpret the answer. Marcus started owing $9 and ended with $1 in credit, because he was relieved of $10 of debt, which is $1 more than he owed.\n\n"
        "Reasoning check. Well done, {{name}}. Chips, the number line, the rule and the total all agreed on the same answer."
    ),
    (
        "Work through these on paper or in the practice boxes. Part A (chips): work out -8 - (-3), -5 - (-5), -2 - (-6), 3 - (-4), 0 - (-9) and 6 - (-6). Say which ones needed zero pairs. Part B (patterns): complete 7 - 3 = 4, 7 - 2 = 5, 7 - 1 = ?, 7 - 0 = ?, 7 - (-1) = ?, 7 - (-2) = ?, 7 - (-3) = ?. Then complete the pattern that starts at 2 - 4 = -2 and carries on down to 2 - (-2). Part C (number line): work out -4 - (-9), 3 - (-5), -10 - (-2) and -7 - (-7) by finding the move from b to a. Part D (use the rule): rewrite each as an addition and work it out: 12 - (-8), -15 - (-20), -9 - (-3) and 0 - (-14). Part E (spot the error): each of these has a mistake. Say what went wrong and give the correct answer: 5 - (-2) = 3; -4 - (-6) = -10; -8 - (-8) = -16. Part F (real problems): an account is at -$18 and a $10 fee is refunded (subtract -$10); the temperature at noon is -3 degrees and at midnight it is -11 degrees, so find noon minus midnight and say how much warmer noon is; you owe $15 and $6 of the debt is cancelled. Part G (missing numbers): find the number in the gap. ? - (-3) = 5, -4 - ? = -1, 6 - ? = 10, ? - (-8) = 0."
    ),
    (
        "Mission: Cool Room Log. A cold room starts at -12 degrees. It has four cooling units, and each one is lowering the temperature by 5, 9, 4 and 10 degrees. The units are switched off one at a time. Switching off a unit removes the cold it was adding, so you subtract its (negative) effect. Type your answers in the boxes.\n\n"
        "(a) Write each switch-off as a subtraction of a negative integer and give the temperature after each one.\n"
        "(b) Find the total effect removed. Check the final temperature with a single subtraction from -12.\n"
        "(c) After which unit did the room first rise above zero?\n"
        "(d) A second cold room starts at -20 and switches off the same four units. Find its final temperature and say how many degrees colder than the first room it is at the end.\n"
        "(e) With chips, which of your subtractions in part (a) needed zero pairs because there were not enough negative chips? Explain why.\n"
        "(f) A student works out -6 - (-2) and gets -8 because 'two minus signs both make it more negative'. Explain in two or three sentences what mistake was made and give the correct answer.\n"
        "(g) Make up your own cool room log with four units that starts below zero and ends above zero. Write each subtraction, give the temperatures and check with the total."
    ),
    "Type your answers in the practice boxes. Show each step as a subtraction, say when you used zero pairs, and write full sentences for the explanation questions.",
    "Did I take away negative chips (adding zero pairs when needed), continue patterns past zero, find the move from b to a, rewrite a - (-b) as a + b, and check each answer a second way?",
    [
        _q("What is -7 - (-3)?", ["-10", "-4", "4", "10"], 1, "-7 - (-3) = -7 + 3 = -4."),
        _q("What is 4 - (-3)?", ["1", "-1", "7", "-7"], 2, "4 - (-3) = 4 + 3 = 7."),
        _q("What is -5 - (-5)?", ["-10", "0", "10", "5"], 1, "-5 + 5 = 0."),
        _q("Subtracting -6 is the same as adding...", ["-6", "6", "0", "12"], 1, "Subtracting a negative is the same as adding the positive of the same size."),
        _q("What is -9 - (-4)?", ["-13", "-5", "5", "13"], 1, "-9 + 4 = -5."),
        _q("What is 0 - (-8)?", ["-8", "8", "0", "16"], 1, "0 + 8 = 8."),
        _q("You owe $20 and $12 of the debt is cancelled. What is your balance?", ["-$32", "-$8", "$8", "$32"], 1, "-20 - (-12) = -8, so you owe $8. Great work, {{name}}."),
        _q("Which statement is true?", ["6 - (-2) = 4", "6 - (-2) = 8", "6 - (-2) = -8", "6 - (-2) = -4"], 1, "6 - (-2) = 6 + 2 = 8."),
        _q("Given 5 - 2 = 3, 5 - 1 = 4, 5 - 0 = 5, what is 5 - (-1)?", ["4", "5", "6", "-6"], 2, "The answers go up by 1 each time, so 5 - (-1) = 6."),
        _q("Which move on the number line shows -2 - (-7)?", ["From -7 to -2, 5 steps right", "From -2 to -7, 5 steps left", "From 7 to -2", "From -7 to -2, 5 steps left"], 0, "a - b is the move from b to a, and from -7 to -2 is 5 steps right, so the answer is 5."),
    ],
    "Type your answers in the practice boxes and submit them. Include full sentences for parts (c) to (g).",
    "Extension: always bigger? Investigate a - (-b) for different values. Show that a - (-b) is always bigger than a when b is positive, and explain why using the number line. Then compare 3 - (-5) with -5 - 3. What do you notice about the two answers, and can you explain it with the idea that a - b and b - a are opposites? Finally, write a short rule in your own words that tells someone what to do whenever they see two minus signs next to each other, and test it on five examples.",
    [("integer", "A whole number that can be positive, negative or zero"), ("subtract", "To take one number away from another"), ("negative", "Less than zero"), ("zero pair", "One positive chip and one negative chip together, with a total value of zero"), ("opposite", "The number the same distance from zero on the other side, such as 6 and -6"), ("pattern", "A sequence that follows a rule"), ("number line", "A line showing numbers in order, with zero in the middle"), ("debt", "Money that is owed, shown as a negative number")],
    [],
    _sort("Will the answer be positive, negative or zero?", "Rewrite each as an addition in your head and sort by the sign of the answer.", ["Positive", "Negative", "Zero"], [("-4 - (-9)", 0), ("-9 - (-4)", 1), ("-6 - (-6)", 2), ("3 - (-3)", 0), ("0 - (-5)", 0), ("-8 - (-3)", 1), ("-2 - (-10)", 0), ("-1 - (-1)", 2)]),
    [
        _wc("What is 8 - (-2)?", ["6", "10", "-10"], 1, "8 + 2 = 10."),
        _wc("What is -3 - (-3)?", ["0", "-6", "6"], 0, "-3 + 3 = 0."),
        _wc("What is -10 - (-4)?", ["-6", "-14", "6"], 0, "-10 + 4 = -6."),
        _wc("Subtracting a negative is the same as...", ["adding a positive", "subtracting a positive", "multiplying"], 0, "a - (-b) = a + b."),
        _wc("What is 0 - (-7)?", ["7", "-7", "0"], 0, "0 + 7 = 7."),
        _wc("What is -2 - (-9)?", ["7", "-7", "11"], 0, "-2 + 9 = 7."),
        _wc("What is 5 - (-5)?", ["0", "10", "-10"], 1, "5 + 5 = 10."),
        _wc("What is -6 - (-1)?", ["-5", "-7", "5"], 0, "-6 + 1 = -5."),
    ],
    [
        {"key": "partA", "label": "Part A: chips", "hint": "-8 - (-3), -5 - (-5), -2 - (-6), 3 - (-4), 0 - (-9), 6 - (-6). Which needed zero pairs?"},
        {"key": "partB", "label": "Part B: patterns", "hint": "Continue 7 - 1 down to 7 - (-3), and the pattern from 2 - 4 down to 2 - (-2)."},
        {"key": "partC", "label": "Part C: number line", "hint": "-4 - (-9), 3 - (-5), -10 - (-2), -7 - (-7). Move from b to a."},
        {"key": "partD", "label": "Part D: use the rule", "hint": "Rewrite 12 - (-8), -15 - (-20), -9 - (-3), 0 - (-14) as additions."},
        {"key": "partE", "label": "Part E: spot the error", "hint": "5 - (-2) = 3; -4 - (-6) = -10; -8 - (-8) = -16. What went wrong?"},
        {"key": "partF", "label": "Part F: real problems", "hint": "-$18 less a -$10 fee. Noon -3 and midnight -11. Owe $15, $6 cancelled."},
        {"key": "partG", "label": "Part G: missing numbers", "hint": "? - (-3) = 5, -4 - ? = -1, 6 - ? = 10, ? - (-8) = 0."},
        {"key": "taskA", "label": "Cool room (a): temperatures", "hint": "Each switch-off as a subtraction and the temperature after it."},
        {"key": "taskB", "label": "Cool room (b): total effect", "hint": "Total removed, then one subtraction from -12."},
        {"key": "taskC", "label": "Cool room (c): above zero", "hint": "After which unit did it first rise above zero?"},
        {"key": "taskD", "label": "Cool room (d): second room", "hint": "Start -20, same four units. Compare with the first room."},
        {"key": "taskE", "label": "Cool room (e): zero pairs", "hint": "Which subtractions did not have enough negative chips? Why?"},
        {"key": "taskF", "label": "Cool room (f): the student's mistake", "hint": "Two or three sentences about -6 - (-2) = -8."},
        {"key": "taskG", "label": "Cool room (g): my own log", "hint": "Four units, start below zero, end above zero, check with the total."},
    ],
    ["Thinking two minus signs both make the answer more negative, such as -6 - (-2) = -8", "Subtracting the numbers and keeping a minus sign without thinking about the signs", "Forgetting to add zero pairs when there are not enough negative chips", "Believing the answer to a subtraction is always smaller than the start", "Thinking the answer must be positive because the rule says to add", "Not checking with a second method"],
    ["Act it out with real chips or coins in two colours, adding zero pairs whenever you need extra negatives.", "Make a pattern of ten subtractions on paper that runs from subtracting 3 down to subtracting -3, and say what you notice.", "Write five 'debt cancelled' stories with a partner and match each to a subtraction of a negative."],
    "Part A: -8 - (-3) = -5; -5 - (-5) = 0; -2 - (-6) = 4 (needed zero pairs); 3 - (-4) = 7 (needed zero pairs); 0 - (-9) = 9 (needed zero pairs); 6 - (-6) = 12 (needed zero pairs). Part B: 7 - 1 = 6, 7 - 0 = 7, 7 - (-1) = 8, 7 - (-2) = 9, 7 - (-3) = 10; 2 - 4 = -2, 2 - 3 = -1, 2 - 2 = 0, 2 - 1 = 1, 2 - 0 = 2, 2 - (-1) = 3, 2 - (-2) = 4. Part C: -4 - (-9) = 5; 3 - (-5) = 8; -10 - (-2) = -8; -7 - (-7) = 0. Part D: 12 + 8 = 20; -15 + 20 = 5; -9 + 3 = -6; 0 + 14 = 14. Part E: 5 - (-2) = 7, since subtracting a negative means adding 2; -4 - (-6) = -4 + 6 = 2; -8 - (-8) = -8 + 8 = 0. Part F: -18 - (-10) = -8, so the account is at -$8; -3 - (-11) = 8, so noon is 8 degrees warmer; -15 - (-6) = -9, so you owe $9. Part G: 2 (since 2 - (-3) = 5); -3 (since -4 - (-3) = -1); -4 (since 6 - (-4) = 10); -8 (since -8 - (-8) = 0). Cool room (a): -12 - (-5) = -7; -7 - (-9) = 2; 2 - (-4) = 6; 6 - (-10) = 16. (b): the total effect removed is 5 + 9 + 4 + 10 = 28, so -12 - (-28) = -12 + 28 = 16, which matches. (c): after the second unit, when the temperature reached 2 degrees. (d): -20 - (-28) = 8 degrees; the second room is 8 degrees colder than the first at the end (8 compared with 16). (e): -7 - (-9) needed a zero pair because only 7 negative chips were left and 9 had to be removed; 2 - (-4) and 6 - (-10) needed zero pairs because there were no negative chips at all; -12 - (-5) did not, because there were 12 negative chips. (f): the student treated both minus signs as making the answer more negative; subtracting a negative takes away a negative, which raises the value, so -6 - (-2) = -6 + 2 = -4. (g): accept any log with four units, a start below zero and an end above zero, with correct temperatures and a correct total check. Quiz answers: -4; 7; 0; 6; -5; 8; -$8; 6 - (-2) = 8; 6; from -7 to -2, 5 steps right.",
)
