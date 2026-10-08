"""Stage 4 Mathematics, Week 3 Lesson 3: Integers, Order of operations with integers.
All written work is typed inside the lesson. Replaces the placeholder with seed_key s4-maths-w03-l3.
No video is attached: none has been found and tested for this topic yet. Add one in the video and link run.
Outcome codes MA4-INT-C-01 and MAO-WM-01 are from the draft mapping and should be re-checked against NESA.
Powers are left out on purpose (Indices is the next unit, weeks 10 and 11); they appear only in the extension.
Builds on W3 L1 and L2. Next is W3 L4, integers in context.
"""
from lesson_library_s4_builder import build_s4, _q, _step, _sort, _wc

LESSON = build_s4(
    "s4-maths-w03-l3",
    "Week 3, Lesson 3: Order of Operations with Integers",
    "When a calculation mixes brackets, multiplication, division, addition and subtraction, the order you work in changes the answer. Learn the order, apply it with positive and negative numbers, and check each step.",
    "Integers",
    ["MA4-INT-C-01", "MAO-WM-01"],
    {
        "MA4-INT-C-01": "Primary. Applies the order of operations to calculations with integers involving brackets, multiplication, division, addition and subtraction, with negative numbers throughout.",
        "MAO-WM-01": "Working mathematically: writes each step on a new line, explains why the order matters, checks by a second method and identifies errors in sequencing.",
    },
    "We are learning the order of operations and how to use it with integers.",
    ["I can explain why the order of operations matters.", "I can work out brackets first, including brackets with negative numbers.", "I can multiply and divide from left to right.", "I can add and subtract from left to right, including subtracting negatives.", "I can work out calculations that mix all four operations.", "I can treat a fraction bar as brackets.", "I can find and fix a mistake in the order of working."],
    ["integer", "brackets", "order of operations", "expression", "left to right", "fraction bar", "evaluate", "grouping symbol"],
    ["This lesson (everything you need is inside it)", "Paper and pencil", "A calculator that follows the order of operations (optional, for checking only)"],
    "You can add, subtract, multiply and divide integers (Weeks 1 to 3). You know the sign rules for each operation.",
    (
        "Why this matters. 2 + 3 x (-4) has one correct answer. If everyone worked in a different order, the same calculation would give different answers, so mathematicians agree on one order. Work out 2 + 3 x (-4) from left to right and you get 5 x (-4) = -20. Follow the agreed order and you get 2 + (-12) = -10. Only -10 is correct.\n\n"
        "The order. 1. Work out anything inside brackets first. 2. Then multiply and divide, working from left to right. 3. Then add and subtract, working from left to right.\n\n"
        "Brackets. Calculate inside the brackets first, including any negative numbers. 3 x (4 - 9) = 3 x (-5) = -15. A fraction bar works like a pair of brackets: (6 - 18) over (2 x (-3)) means work out the top and the bottom first, then divide: -12 \u00f7 (-6) = 2.\n\n"
        "Multiply and divide. These have equal rank, so go from left to right. 24 \u00f7 (-4) x (-3) = (-6) x (-3) = 18. Do not do the multiplication first just because it is a multiplication.\n\n"
        "Add and subtract. These also have equal rank, so go from left to right. Rewrite a subtraction of a negative as an addition: 10 - 4 - (-6) + (-3) = 6 + 6 + (-3) = 9.\n\n"
        "Mixed calculations. Do the brackets, then each multiplication and division, then the additions and subtractions. 4 - 6 x (-2) + 8 \u00f7 (-4): the multiplication is -12 and the division is -2, so the calculation becomes 4 - (-12) + (-2) = 4 + 12 - 2 = 14.\n\n"
        "Habits of good working. Write one step on each line and copy the rest of the calculation each time. Underline the part you are working out. Circle every negative sign and check each sign rule. At the end, check the answer by estimating or by trying the steps again in a different way."
    ),
    [
        _step("1", "Why the order matters", "The same numbers and operations can give different answers in different orders. The agreed order gives one right answer.\n\nMultiplication comes before addition.", "2 + 3 x (-4) = 2 + (-12) = -10. Working left to right gives 5 x (-4) = -20, which is wrong.", "Follow the agreed order.", ("What is 5 + 2 x (-3)?", ["-9", "-1", "11", "1"], 1, "2 x (-3) = -6 first, then 5 + (-6) = -1.")),
        _step("2", "Brackets first", "Calculate everything inside brackets before anything else, even when there are negatives.\n\nThen use the result in the rest of the calculation.", "3 x (4 - 9) = 3 x (-5) = -15. (8 - 3) x (-4) = 5 x (-4) = -20.", "Brackets are done first.", ("What is (-2 + 8) x (-3)?", ["18", "-18", "-14", "14"], 1, "(-2 + 8) = 6, and 6 x (-3) = -18.")),
        _step("3", "Multiply and divide left to right", "Multiplication and division have equal rank. Work from the left and apply the sign rule at each step.\n\nDo not skip ahead.", "24 \u00f7 (-4) x (-3) = (-6) x (-3) = 18.", "Equal rank means left to right.", ("What is (-36) \u00f7 9 x (-2)?", ["-8", "-2", "8", "2"], 2, "(-36) \u00f7 9 = -4, then (-4) x (-2) = 8.")),
        _step("4", "Add and subtract left to right", "Addition and subtraction also have equal rank. Rewrite subtracting a negative as adding a positive.\n\nKeep a running total.", "10 - 4 - (-6) + (-3) = 6 + 6 + (-3) = 9.", "Subtracting a negative is adding.", ("What is -5 + 8 - (-2)?", ["-1", "1", "5", "-5"], 2, "-5 + 8 = 3, then 3 - (-2) = 3 + 2 = 5.")),
        _step("5", "Mixing all the operations", "Do multiplications and divisions first, then the additions and subtractions. Write each step on a new line.\n\nWork out each product or quotient before you combine.", "4 - 6 x (-2) + 8 \u00f7 (-4) = 4 - (-12) + (-2) = 4 + 12 - 2 = 14.", "Multiply and divide before add and subtract.", ("What is 7 + (-12) \u00f7 3?", ["-3", "3", "11", "-1"], 1, "(-12) \u00f7 3 = -4 first, then 7 + (-4) = 3.")),
        _step("6", "Fraction bars", "A fraction bar groups the top and the bottom. Work out the top, work out the bottom, then divide.\n\nThe same idea applies to any grouping symbol.", "(6 - 18) over (2 x (-3)) = (-12) \u00f7 (-6) = 2.", "Top and bottom are like brackets.", ("What is (-9 - 3) \u00f7 (2 - 6)?", ["-3", "-4", "3", "4"], 2, "(-12) \u00f7 (-4) = 3.")),
        _step("7", "Calculations in context", "A real situation can give a long calculation. Translate each part into a number or an operation and then follow the order.\n\nCheck that the final sign makes sense.", "A balance starts at -20. There are 2 deposits of $15 and 3 fees of $8. -20 + 2 x 15 - 3 x 8 = -20 + 30 - 24 = -14.", "Translate, order, check.", ("What is -20 + 2 x 15 - 3 x 8?", ["26", "14", "-26", "-14"], 3, "2 x 15 = 30 and 3 x 8 = 24, so -20 + 30 - 24 = -14.")),
    ],
    (
        "Scenario: In a quiz game, a team starts with -3 points, earns 5 points for each of 6 correct answers and loses 2 points for each of 4 wrong answers. The score is -3 + 6 x 5 + 4 x (-2).\n\n"
        "Step 1, brackets. There are no brackets, so go to multiplication and division.\n\n"
        "Step 2, multiply. 6 x 5 = 30 and 4 x (-2) = -8. The calculation is now -3 + 30 + (-8).\n\n"
        "Step 3, add left to right. -3 + 30 = 27, then 27 + (-8) = 19. The score is 19.\n\n"
        "Step 4, check by grouping. The positive amount is 30 and the negative amounts are -3 and -8, which make -11. 30 + (-11) = 19. It agrees.\n\n"
        "Step 5, see why the order matters. If you work from left to right ignoring the order, you get -3 + 6 = 3, 3 x 5 = 15, 15 + 4 = 19 and 19 x (-2) = -38. This is not 19. The score makes no sense, because a team that earns 30 points and loses 8 cannot finish on -38.\n\n"
        "Step 6, check the sign. The earnings of 30 are larger than the losses of 11, so the answer must be positive, and 19 is.\n\n"
        "Good work, {{name}}. Always do the multiplications before the additions and check that your final answer is sensible."
    ),
    (
        "Work through these on paper or in the practice boxes, one step per line. Part A (does the order matter?): work out 8 + 3 x (-4), (8 + 3) x (-4), 8 - 3 x (-4) and (8 - 3) x (-4). Say which two have different answers because of the brackets. Part B (brackets): work out (-5 + 2) x 6, 4 x (3 - 10), (-12) \u00f7 (7 - 11), (-3 - 5) x (-2) and -10 - (4 - 9). Part C (multiply and divide): work out 18 \u00f7 (-3) x 2, (-4) x 6 \u00f7 (-8), 40 \u00f7 (-5) \u00f7 (-2) and (-3) x (-4) x (-2). Part D (add and subtract): work out 9 - 15 + (-4), -6 - (-8) + 3 and 12 + (-7) - (-5) - 20. Part E (mixed): work out 5 + 3 x (-4), 20 - 6 x 4 \u00f7 (-2), (-18) \u00f7 3 + 2 x (-5), 7 - (3 - 8) x 2 and (-2) x (-3) - (-4) x 5. Part F (fraction bars): work out (6 - 18) over (2 x (-3)) and (-4 + 24) over (1 - 6). Part G (spot the error): each of these has a mistake in the order. Say what went wrong and give the correct answer: 2 + 3 x (-4) = -20; -5 - 3 x (-2) = 16; 12 \u00f7 4 x (-3) = -1; (-8) - (-2) x 3 = -18. Part H (add brackets): put one pair of brackets in 3 + 4 x (-2) to make the answer -14, and one pair in 10 - 6 \u00f7 2 to make the answer 2."
    ),
    (
        "Mission: Quest Score Sheet. A quiz game gives +6 points for each correct answer, -4 points for each wrong answer and -1 point for each skipped question. Three teams played. Red had 7 correct, 3 wrong and 2 skipped. Blue had 4 correct, 6 wrong and 2 skipped. Green had 2 correct, 8 wrong and 5 skipped. Type your answers in the boxes.\n\n"
        "(a) Write a calculation for each team's score, and work it out.\n"
        "(b) Each team also started with a handicap: Red -10, Blue +6, Green +24. Write and work out each final score, including the handicap.\n"
        "(c) Find the mean of the three final scores from part (b), using a calculation with brackets or a fraction bar.\n"
        "(d) A judge adds a bonus of (correct - wrong) x 2. Work out each team's bonus. Then show what answer you would get for Red if the brackets were left out, and explain the difference.\n"
        "(e) A scorekeeper works out Green's score like this: 2 x 6 = 12, 12 + 8 = 20, 20 x (-4) = -80, -80 + 5 = -75, -75 x (-1) = 75. Say what went wrong and find the correct score.\n"
        "(f) Find two different sets of (correct, wrong, skipped) that give a total of exactly 0, and show the calculation for each."
    ),
    "Type your answers in the practice boxes. Write one step per line, and use full sentences for the explanation questions.",
    "Did I do brackets first, then multiplication and division from left to right, then addition and subtraction from left to right, show each step on its own line, and check that my final sign makes sense?",
    [
        _q("What is 5 + 2 x (-3)?", ["-9", "-1", "11", "1"], 1, "Multiply first: 5 + (-6) = -1."),
        _q("What is (-2 + 8) x (-3)?", ["18", "-18", "-14", "14"], 1, "Brackets first: 6 x (-3) = -18."),
        _q("What is (-36) \u00f7 9 x (-2)?", ["-8", "-2", "8", "2"], 2, "Left to right: -4 x (-2) = 8."),
        _q("What is -5 + 8 - (-2)?", ["-1", "1", "5", "-5"], 2, "-5 + 8 = 3, then 3 + 2 = 5."),
        _q("What is 7 + (-12) \u00f7 3?", ["-3", "3", "11", "-1"], 1, "Divide first: 7 + (-4) = 3."),
        _q("What is (-9 - 3) \u00f7 (2 - 6)?", ["-3", "-4", "3", "4"], 2, "(-12) \u00f7 (-4) = 3."),
        _q("What is -20 + 2 x 15 - 3 x 8?", ["26", "14", "-26", "-14"], 3, "-20 + 30 - 24 = -14."),
        _q("Which operation comes first in 10 - 4 x (-2)?", ["Subtract 10 - 4", "Multiply 4 x (-2)", "Both at the same time", "Add"], 1, "With no brackets, multiplication comes before subtraction."),
        _q("What is 4 - 6 x (-2) + 8 \u00f7 (-4)?", ["10", "6", "14", "-14"], 2, "4 + 12 + (-2) = 14. Well done, {{name}}."),
        _q("Where should brackets go in 3 + 4 x (-2) to make -14?", ["3 + (4 x (-2))", "(3 + 4) x (-2)", "3 + 4 x (-2) with no brackets", "It cannot be done"], 1, "(3 + 4) x (-2) = 7 x (-2) = -14."),
    ],
    "Type your answers in the practice boxes and submit them. Include full sentences for parts (d), (e) and (f).",
    "Extension: powers. Investigate what (-3) x (-3) gives and what -(3 x 3) gives. People write the first as (-3) squared and the second as the negative of 3 squared. Why do the brackets matter? Then try the four fours puzzle: use exactly four 4s with +, -, x, \u00f7 and brackets to make each integer from -5 to 5, such as (4 - 4) x (4 + 4) = 0. Write each calculation and check it.",
    [("integer", "A whole number that can be positive, negative or zero"), ("brackets", "Symbols that group part of a calculation to be done first"), ("order of operations", "The agreed order in which parts of a calculation are done"), ("expression", "A calculation made of numbers and operations"), ("left to right", "The direction to work when operations have equal rank"), ("fraction bar", "The line in a fraction, which groups the top and the bottom"), ("evaluate", "To work out the value"), ("grouping symbol", "A symbol such as brackets that shows what to do first")],
    [],
    _sort("What do you do first?", "Look at the calculation and decide which step comes first, then sort each one.", ["Brackets first", "Multiply or divide first", "Add or subtract first"], [("5 + 3 x (-2)", 1), ("(5 + 3) x (-2)", 0), ("12 - 4 + (-6)", 2), ("-8 \u00f7 2 - 3", 1), ("(-8 - 2) \u00f7 5", 0), ("-9 + 4 - 7", 2), ("6 - (-3) x 2", 1), ("-4 + (10 - 7)", 0)]),
    [
        _wc("What is 2 + 3 x (-4)?", ["-10", "-20", "14"], 0, "Multiply first: 2 + (-12) = -10."),
        _wc("What is (2 + 3) x (-4)?", ["-10", "-20", "20"], 1, "Brackets first: 5 x (-4) = -20."),
        _wc("What is -6 + 8 \u00f7 2?", ["1", "-7", "-2"], 2, "Divide first: -6 + 4 = -2."),
        _wc("What is 10 - 2 x 3?", ["24", "4", "16"], 1, "Multiply first: 10 - 6 = 4."),
        _wc("What is (-12) \u00f7 (-4) + 1?", ["4", "2", "-2"], 0, "3 + 1 = 4."),
        _wc("What is -3 - 2 x (-5)?", ["-25", "7", "13"], 1, "-3 - (-10) = 7."),
        _wc("What is (7 - 10) x 3?", ["9", "-9", "-3"], 1, "(-3) x 3 = -9."),
        _wc("What is 8 - 6 \u00f7 3?", ["2", "6", "-2"], 1, "Divide first: 8 - 2 = 6."),
    ],
    [
        {"key": "partA", "label": "Part A: does the order matter?", "hint": "8 + 3 x (-4), (8 + 3) x (-4), 8 - 3 x (-4), (8 - 3) x (-4)."},
        {"key": "partB", "label": "Part B: brackets", "hint": "Work out the brackets first, one step per line."},
        {"key": "partC", "label": "Part C: multiply and divide", "hint": "Left to right, applying the sign rule each step."},
        {"key": "partD", "label": "Part D: add and subtract", "hint": "Rewrite subtracting a negative as adding."},
        {"key": "partE", "label": "Part E: mixed", "hint": "Brackets, then multiply and divide, then add and subtract."},
        {"key": "partF", "label": "Part F: fraction bars", "hint": "Top, then bottom, then divide."},
        {"key": "partG", "label": "Part G: spot the error", "hint": "What was done in the wrong order, and what is the correct answer?"},
        {"key": "partH", "label": "Part H: add brackets", "hint": "Put one pair of brackets in each calculation to get the target answer."},
        {"key": "taskA", "label": "Score sheet (a): team scores", "hint": "Points per answer times the number of answers, added together."},
        {"key": "taskB", "label": "Score sheet (b): with handicap", "hint": "Add each handicap to the score from part (a)."},
        {"key": "taskC", "label": "Score sheet (c): mean", "hint": "Add the three final scores in brackets, then divide by 3."},
        {"key": "taskD", "label": "Score sheet (d): bonus", "hint": "(correct - wrong) x 2 for each team, then the no-brackets version for Red."},
        {"key": "taskE", "label": "Score sheet (e): scorekeeper's error", "hint": "What order did they use? What is the correct score?"},
        {"key": "taskF", "label": "Score sheet (f): totals of exactly 0", "hint": "Try a team with no skipped questions first."},
    ],
    ["Working strictly from left to right ignoring the order", "Adding before multiplying because the addition comes first on the page", "Doing multiplication before division even when division comes first", "Ignoring brackets or doing them last", "Mishandling subtracting a negative inside a longer calculation", "Losing a negative sign when copying a step"],
    ["Write each calculation on one line, underline the next step, and copy the rest on the next line.", "Use two colours: one for the part being worked out and one for the rest.", "Estimate first so you can tell whether the sign and size of the answer make sense."],
    "Part A: 8 + 3 x (-4) = 8 + (-12) = -4; (8 + 3) x (-4) = 11 x (-4) = -44; 8 - 3 x (-4) = 8 + 12 = 20; (8 - 3) x (-4) = 5 x (-4) = -20. The brackets change the answers in the first and second, and in the third and fourth. Part B: -18; -28; 3; 16; -5. Part C: -12; 3; 4; -24. Part D: -10; 5; -10. Part E: -7; 32; -16; 17; 26. Part F: 2; -4. Part G: 2 + 3 x (-4): the student added before multiplying, and the correct answer is -10. -5 - 3 x (-2): the student worked out (-5 - 3) first, and the correct answer is -5 + 6 = 1. 12 \u00f7 4 x (-3): the student did the multiplication before the division, and the correct answer is 3 x (-3) = -9. (-8) - (-2) x 3: the student subtracted before multiplying, and the correct answer is -8 - (-6) = -2. Part H: (3 + 4) x (-2) = -14; (10 - 6) \u00f7 2 = 2. Score sheet (a): Red 7 x 6 + 3 x (-4) + 2 x (-1) = 42 - 12 - 2 = 28; Blue 4 x 6 + 6 x (-4) + 2 x (-1) = 24 - 24 - 2 = -2; Green 2 x 6 + 8 x (-4) + 5 x (-1) = 12 - 32 - 5 = -25. (b): Red -10 + 28 = 18; Blue 6 + (-2) = 4; Green 24 + (-25) = -1. (c): (18 + 4 + (-1)) \u00f7 3 = 21 \u00f7 3 = 7. (d): Red (7 - 3) x 2 = 8; Blue (4 - 6) x 2 = -4; Green (2 - 8) x 2 = -12. Without brackets, 7 - 3 x 2 = 7 - 6 = 1, which is wrong, because the multiplication would apply only to the 3 instead of to the whole difference. With bonuses the final scores are Red 26, Blue 0 and Green -13. (e): the scorekeeper worked strictly from left to right instead of multiplying first; the correct score is 12 + (-32) + (-5) = -25. (f): accept any valid set, such as (4, 6, 0): 4 x 6 + 6 x (-4) = 0; (2, 3, 0): 2 x 6 + 3 x (-4) = 0; (1, 0, 6): 1 x 6 + 6 x (-1) = 0; (3, 3, 6): 3 x 6 + 3 x (-4) + 6 x (-1) = 18 - 12 - 6 = 0. Quiz answers: -1; -18; 8; 5; 3; 3; -14; multiply 4 x (-2); 14; (3 + 4) x (-2).",
)
