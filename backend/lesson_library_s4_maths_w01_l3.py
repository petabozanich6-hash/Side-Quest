"""Stage 4 Mathematics, Week 1 Lesson 3: Integers, Adding integers with the same signs.
All written work is typed inside the lesson. Replaces the placeholder with seed_key s4-maths-w01-l3.
No video is attached: none has been found and tested for this topic yet. Add one in the video and link run.
Outcome codes MA4-INT-C-01 and MAO-WM-01 are from the draft mapping and should be re-checked against NESA.
"""
from lesson_library_s4_builder import build_s4, _q, _step, _sort, _wc

LESSON = build_s4(
    "s4-maths-w01-l3",
    "Week 1, Lesson 3: Adding Integers with the Same Signs",
    "Divers sink deeper, debts grow and temperatures keep falling. When every change goes the same way, the answer gets further from zero. Learn how to add integers that have the same sign, and how to spot a wrong answer fast.",
    "Integers",
    ["MA4-INT-C-01", "MAO-WM-01"],
    {
        "MA4-INT-C-01": "Primary. Adds integers with the same sign, explaining the result using the number line and the idea of repeated moves in one direction.",
        "MAO-WM-01": "Working mathematically: reasons about whether an answer is sensible, finds and corrects errors, and communicates in words and symbols.",
    },
    "We are learning to add integers that have the same sign, and to explain why the sum is further from zero than either number.",
    ["I can tell when two integers have the same sign.", "I can add two positive integers and two negative integers.", "I can add three or more negative integers.", "I can explain why the sum of two negatives is further left than both of them.", "I can find a missing number in an addition with negatives.", "I can spot and fix a mistake in a same-sign addition.", "I can solve real problems such as debts and falling temperatures."],
    ["integer", "sum", "same sign", "negative", "positive", "size", "net change", "debt", "number line"],
    ["This lesson (everything you need is inside it)", "Paper and pencil", "A printed number line from -50 to 50 (optional)"],
    "You can add integers by moving on a number line, and you know adding a negative integer moves you left (Week 1, Lesson 2).",
    (
        "Why this matters. Many real changes all go the same way: a diver keeps descending, a person keeps spending, the temperature keeps dropping. When every move goes in the same direction, you do not need to cross zero. You just keep going. Being quick and accurate with these sums is the first step towards handling mixed signs in the next lesson.\n\n"
        "Same sign means same direction. Two integers have the same sign when both are positive or both are negative. 14 and 9 are both positive. -6 and -7 are both negative. When you add them on the number line, both moves go the same way, so you never turn around.\n\n"
        "Two positives. 14 + 9: start at 14 and move 9 steps right to reach 23. This is ordinary addition.\n\n"
        "Two negatives. -6 + (-7): start at -6 and move 7 steps left. You reach -13. The sizes, 6 and 7, add up to 13, and the sum keeps the negative sign. So -6 + (-7) = -13.\n\n"
        "The size of an integer is how far it is from zero (its absolute value). With the same signs, you add the sizes and keep the sign. That is a pattern from the number line, not a trick to memorise: both moves go the same way, so the distances pile up.\n\n"
        "A sum of two negatives is further left than both numbers. -13 is less than -6 and less than -7. This gives a fast check. If a student writes -9 + (-4) = -5, the answer is closer to zero than -9, which cannot be right when you are only moving left.\n\n"
        "Three or more. Add them in any order, because the order does not matter. -3 + (-5) + (-2): add the sizes 3 + 5 + 2 = 10, and the answer is -10.\n\n"
        "Real problems. Owing $25 and then owing another $40 means you owe $65 in total, which is -25 + (-40) = -65. A temperature of -6 that falls another 9 degrees is -6 + (-9) = -15."
    ),
    [
        _step("1", "Same sign means same direction", "Two integers have the same sign when both are positive or both are negative. Adding them means two moves in the same direction, so you never turn around on the number line.\n\nIf the signs are different, the moves go opposite ways. That is the next lesson.", "-4 and -9 have the same sign (both negative). 6 and 11 have the same sign (both positive). -3 and 5 have different signs.", "Check the signs first. Same signs means the moves add up.", ("Which pair of integers has the same sign?", ["-3 and 5", "-4 and -9", "7 and -2", "-8 and 8"], 1, "-4 and -9 are both negative.")),
        _step("2", "Two positives", "Adding two positive integers is ordinary addition. Start at the first number and move right by the second.\n\nThe sum is greater than both numbers.", "14 + 9 = 23. Start at 14, move 9 steps right.", "Positive plus positive is positive and bigger than both.", ("What is 14 + 9?", ["5", "23", "-5", "-23"], 1, "Move 9 steps right from 14 to reach 23.")),
        _step("3", "Two negatives", "Adding two negative integers means two moves to the left. Add the sizes and keep the negative sign.\n\nThe sum is further left than both numbers, so it is less than both.", "-6 + (-7): the sizes are 6 and 7, and 6 + 7 = 13, so the sum is -13.", "Add the sizes. Keep the negative sign.", ("What is -6 + (-7)?", ["-1", "1", "13", "-13"], 3, "The sizes 6 and 7 add to 13 and the sign stays negative: -13.")),
        _step("4", "Why the sum moves further from zero", "With the same signs, both moves go the same way, so the distances pile up and the total is further from zero than either number.\n\nThis gives a quick check for any answer.", "-6 + (-7) = -13. The size 13 is greater than 6 and greater than 7.", "If the sum of two negatives is closer to zero than either number, something went wrong.", ("In -6 + (-7), what is true about the sum?", ["It is closer to zero than -6", "It is further left than both -6 and -7", "It is positive", "It equals 1"], 1, "-13 is further left than both -6 and -7.")),
        _step("5", "Three or more integers", "With three or more negative integers, add all the sizes and put a negative sign on the total. The order does not matter, so you can add in whatever order is easiest.\n\nA running total helps you keep track.", "-3 + (-5) + (-2): sizes 3 + 5 + 2 = 10, so the sum is -10. Running total: -3, then -8, then -10.", "Same signs give one long move in one direction.", ("What is -3 + (-5) + (-2)?", ["-10", "-4", "10", "-6"], 0, "3 + 5 + 2 = 10 and the sign stays negative, so -10.")),
        _step("6", "Checking your answer", "Before you finish, ask: does my answer make sense on the number line? Two negatives should land further left than either number. Two positives should land further right.\n\nA second check is to swap the order and see that you get the same result.", "A student writes -9 + (-4) = -5. This is wrong: -5 is to the right of -9, but adding a negative should move left. The correct answer is -13.", "Use the number line as a lie detector.", ("A student gets -9 + (-4) = -5. How can you tell this is wrong?", ["The sum of two negatives must be further from zero than either number", "The sum must be positive", "The sum must be 13", "Nothing is wrong"], 0, "-5 is closer to zero than -9, but two moves left must end further left.")),
        _step("7", "Real problems", "Debts, losses, drops in temperature and depths below sea level are all negative integers. When two of them happen one after the other, you add the negatives.\n\nAlways write each change as an integer first, then add.", "Owing $25 and then owing another $40 gives -25 + (-40) = -65, so the total debt is $65.", "Write the situation as integers, add, then say the answer in words with units.", ("You owe $25 and then owe another $40. What is your balance?", ["-$15", "$15", "-$65", "$65"], 2, "-25 + (-40) = -65.")),
    ],
    (
        "Scenario: A scuba diver starts 5 m below the surface, which is -5 m. During the dive she descends 7 m, then 6 m, then 9 m. Every move is downward, so every move is a negative integer.\n\n"
        "Step 1, write each descent as an integer: -7, -6, -9.\n\n"
        "Step 2, follow her depth one move at a time. Start at -5. After the first descent: -5 + (-7) = -12. After the second: -12 + (-6) = -18. After the third: -18 + (-9) = -27. She finishes at -27 m.\n\n"
        "Step 3, check with the net change. Add the three descents first: 7 + 6 + 9 = 22, so the net change is -22. Then -5 + (-22) = -27. It matches, so the answer is checked two ways.\n\n"
        "Step 4, does it make sense? Every move went down, so the final depth must be lower (further left) than the start. -27 is less than -5, so this passes the check.\n\n"
        "Step 5, her safe limit for this dive is -20 m. How far past the limit did she go? The limit is 20 m deep and she reached 27 m deep, so she is 27 - 20 = 7 m past the limit. We subtract here because we are comparing two depths, not adding two moves.\n\n"
        "Reasoning check. At no point did the answer move closer to zero. Well done, {{name}}. You used the number line, the net change and a sense check to prove the answer."
    ),
    (
        "Work through these on paper or in the practice boxes. Part A (two integers): work out 6 + 9, 12 + 15, -4 + (-3), -10 + (-10), -25 + (-18) and -100 + (-250). Part B (three or more): work out -2 + (-3) + (-4), 5 + 8 + 13, -6 + (-6) + (-6) and -15 + (-20) + (-5) + (-10). Part C (missing numbers): find the number that goes in the gap. -3 + ? = -11, ? + (-9) = -20, 14 + ? = 30, ? + 12 = 40. Part D (spot the error): each of these has a mistake. Say what went wrong and give the correct answer. -8 + (-5) = -3; -12 + (-1) = 11; 6 + 7 = -13. Part E (real problems): the temperature is -6 and falls 9 degrees; you owe $45 and then owe another $30; a submarine at -140 m descends a further 85 m. Write each as an addition of integers and give the answer with units."
    ),
    (
        "Mission: Dive Computer Debrief. Mia starts a dive at the surface (0 m). Her dive computer records five descents in a row: 4 m, 7 m, 9 m, 6 m and 11 m. Type your answers in the boxes.\n\n"
        "(a) Write each descent as an integer, and write the first position as an addition starting from 0.\n"
        "(b) Find Mia's depth after each of the five descents, writing each step as an addition.\n"
        "(c) Find the net change by adding all five descents. Check that it matches her final depth.\n"
        "(d) The safe limit is -30 m. After which descent did she pass the limit, and by how many metres was she past it at the end?\n"
        "(e) A second diver starts at -3 m and makes three descents of 5 m, 8 m and 10 m. Find the final depth, then say who is deeper at the end and by how many metres.\n"
        "(f) A student works out -9 + (-4) and gets -5. Explain in two or three sentences what mistake was made and give the correct answer.\n"
        "(g) Make up your own situation in which at least four changes go the same way (for example debts, losses or temperatures). Write each change as an integer, find the running total and say what the final answer means."
    ),
    "Type your answers in the practice boxes. Show each step as an addition and write full sentences for the explanation questions.",
    "Did I check the signs first, add the sizes and keep the sign for same-sign sums, use the number line to check that my answer is further from zero, and write real problems as integers before adding?",
    [
        _q("What is -8 + (-12)?", ["-4", "4", "-20", "20"], 2, "The sizes 8 and 12 add to 20 and the sign stays negative: -20."),
        _q("What is 19 + 26?", ["45", "-45", "7", "-7"], 0, "Both are positive, so 19 + 26 = 45."),
        _q("What is -35 + (-15)?", ["-20", "-50", "50", "-40"], 1, "35 + 15 = 50 and the sign stays negative: -50."),
        _q("Which sum is further from zero than -10?", ["-4 + (-3)", "-6 + (-5)", "-2 + (-7)", "-1 + (-8)"], 1, "-6 + (-5) = -11. The others are -7, -9 and -9."),
        _q("What is -4 + (-6) + (-7)?", ["-17", "-3", "17", "-9"], 0, "4 + 6 + 7 = 17 and the sign stays negative: -17."),
        _q("You owe $18 and then owe another $27. What is the total as an integer?", ["-$9", "$9", "-$45", "$45"], 2, "-18 + (-27) = -45."),
        _q("Which statement is true?", ["-5 + (-5) = 0", "-5 + (-5) = -10", "-5 + (-5) = 10", "-5 + (-5) = -25"], 1, "Two moves of 5 steps left from zero end at -10."),
        _q("The temperature is -7 degrees and falls 8 degrees. What is it now?", ["-1", "1", "-15", "15"], 2, "-7 + (-8) = -15 degrees. Great work, {{name}}."),
        _q("What number goes in the gap? -3 + ? = -12", ["9", "-9", "15", "-15"], 1, "From -3 you need to move 9 steps left to reach -12, so the missing number is -9."),
        _q("What is -120 + (-80)?", ["-40", "40", "-200", "200"], 2, "120 + 80 = 200 and the sign stays negative: -200."),
    ],
    "Type your answers in the practice boxes and submit them. Include full sentences for parts (e), (f) and (g).",
    "Extension: a mystery balance. Three debts are all different, all whole dollar amounts, and together they total -$30. Find as many different sets of three debts as you can. Then explain why no set can contain a positive amount if all the numbers are debts, and what a positive amount would mean in the story.",
    [("integer", "A whole number that can be positive, negative or zero"), ("sum", "The result of adding numbers together"), ("same sign", "Both integers are positive, or both are negative"), ("size", "How far an integer is from zero, ignoring its sign"), ("net change", "The overall change after a series of moves added together"), ("debt", "Money owed, shown as a negative integer"), ("number line", "A line showing numbers in order, with zero in the middle")],
    [],
    _sort("Where will the sum land?", "Work out each sum and sort it by where it lands on the number line.", ["Between -10 and 0", "Between -20 and -10", "Below -20"], [("-3 + (-4)", 0), ("-6 + (-8)", 1), ("-12 + (-15)", 2), ("-5 + (-2)", 0), ("-9 + (-9)", 1), ("-20 + (-4)", 2), ("-4 + (-5)", 0), ("-11 + (-7)", 1)]),
    [
        _wc("What is -5 + (-4)?", ["-9", "-1", "9"], 0, "5 + 4 = 9 and the sign stays negative."),
        _wc("What is 8 + 7?", ["1", "15", "-15"], 1, "Both are positive, so 8 + 7 = 15."),
        _wc("What is -10 + (-10)?", ["0", "-20", "20"], 1, "10 + 10 = 20 and the sign stays negative."),
        _wc("The sum of two negative integers is...", ["further left than both", "closer to zero", "positive"], 0, "Two moves left end further left than either number."),
        _wc("What is -30 + (-45)?", ["-75", "-15", "75"], 0, "30 + 45 = 75 and the sign stays negative."),
        _wc("What is -1 + (-1) + (-1)?", ["-3", "3", "-1"], 0, "Three moves of one step left give -3."),
        _wc("You owe $5 and then owe $6. What is the balance?", ["-$11", "$11", "-$1"], 0, "-5 + (-6) = -11."),
        _wc("What is -100 + (-1)?", ["-101", "-99", "101"], 0, "One more step left from -100 is -101."),
    ],
    [
        {"key": "partA", "label": "Part A: two integers", "hint": "6 + 9, 12 + 15, -4 + (-3), -10 + (-10), -25 + (-18), -100 + (-250)."},
        {"key": "partB", "label": "Part B: three or more", "hint": "-2 + (-3) + (-4), 5 + 8 + 13, -6 + (-6) + (-6), -15 + (-20) + (-5) + (-10)."},
        {"key": "partC", "label": "Part C: missing numbers", "hint": "-3 + ? = -11, ? + (-9) = -20, 14 + ? = 30, ? + 12 = 40."},
        {"key": "partD", "label": "Part D: spot the error", "hint": "-8 + (-5) = -3; -12 + (-1) = 11; 6 + 7 = -13. What went wrong and what is correct?"},
        {"key": "partE", "label": "Part E: real problems", "hint": "Temperature -6 falls 9. Owe $45 and $30. Submarine at -140 m descends 85 m."},
        {"key": "taskA", "label": "Debrief (a): descents as integers", "hint": "Five descents as integers, and 0 plus the first one."},
        {"key": "taskB", "label": "Debrief (b): depths", "hint": "Depth after each descent, written as an addition."},
        {"key": "taskC", "label": "Debrief (c): net change", "hint": "Add all five descents. Does it match the final depth?"},
        {"key": "taskD", "label": "Debrief (d): the safe limit", "hint": "After which descent did she pass -30 m? How far past at the end?"},
        {"key": "taskE", "label": "Debrief (e): second diver", "hint": "Start -3 m, descents 5, 8, 10. Who is deeper and by how much?"},
        {"key": "taskF", "label": "Debrief (f): the student's mistake", "hint": "Two or three sentences about -9 + (-4) = -5."},
        {"key": "taskG", "label": "Debrief (g): my own situation", "hint": "At least four changes in one direction, running total, meaning of the answer."},
    ],
    ["Subtracting the sizes when both integers are negative, such as -9 + (-4) = -5", "Dropping the negative sign from the answer, such as -12 + (-1) = 11", "Thinking a sum of two negatives should be closer to zero", "Changing a negative to a positive when adding the sizes", "Losing track of the running total in sums with three or more integers", "Adding when asked to compare two depths, or subtracting when asked to combine two moves"],
    ["Record every purchase you make in a week as a negative integer and add them to find the total spent.", "Look up the depth of three oceans or trenches and add a further descent of 100 m to each.", "Invent a story where a character owes money to three friends and write the total as an integer sum."],
    "Part A: 6 + 9 = 15; 12 + 15 = 27; -4 + (-3) = -7; -10 + (-10) = -20; -25 + (-18) = -43; -100 + (-250) = -350. Part B: -2 + (-3) + (-4) = -9; 5 + 8 + 13 = 26; -6 + (-6) + (-6) = -18; -15 + (-20) + (-5) + (-10) = -50. Part C: -8 (since -3 + (-8) = -11); -11 (since -11 + (-9) = -20); 16 (since 14 + 16 = 30); 28 (since 28 + 12 = 40). Part D: -8 + (-5) = -13, the student subtracted the sizes instead of adding them; -12 + (-1) = -13, the student dropped the negative sign; 6 + 7 = 13, both are positive so the sum is positive. Part E: -6 + (-9) = -15 degrees; -45 + (-30) = -$75; -140 + (-85) = -225 m. Debrief (a): descents are -4, -7, -9, -6, -11; 0 + (-4). (b): 0 + (-4) = -4; -4 + (-7) = -11; -11 + (-9) = -20; -20 + (-6) = -26; -26 + (-11) = -37. (c): -4 + (-7) + (-9) + (-6) + (-11) = -37, which matches the final depth because she started at 0. (d): she passed -30 m on the fifth descent (she was at -26 m before it); at the end she is 37 - 30 = 7 m past the limit. (e): -3 + (-5) = -8; -8 + (-8) = -16; -16 + (-10) = -26. The second diver ends at -26 m. Mia is deeper by 37 - 26 = 11 m. (f): the student subtracted the sizes (9 - 4 = 5) instead of adding them; both numbers are negative, so both moves go left, the sizes add to 13, and the correct answer is -13. (g): accept any story with four same-direction changes shown as correct integers, a correct running total and a sensible meaning for the final answer. Quiz answers: -20; 45; -50; -6 + (-5); -17; -$45; -5 + (-5) = -10; -15; -9; -200.",
)
