"""Stage 4 Mathematics, Week 3 Lesson 1: Integers, Multiplying integers.
All written work is typed inside the lesson. Replaces the placeholder with seed_key s4-maths-w03-l1.
No video is attached: none has been found and tested for this topic yet. Add one in the video and link run.
Outcome codes MA4-INT-C-01 and MAO-WM-01 are from the draft mapping and should be re-checked against NESA.
Builds on W1 and W2 (adding and subtracting integers, including subtracting a negative). Next is W3 L2, dividing integers.
"""
from lesson_library_s4_builder import build_s4, _q, _step, _sort, _wc

LESSON = build_s4(
    "s4-maths-w03-l1",
    "Week 3, Lesson 1: Multiplying Integers",
    "Multiplication of integers follows clear sign rules that you can explain, not just memorise. Use repeated addition, patterns and rates of change to see why a negative times a negative is positive.",
    "Integers",
    ["MA4-INT-C-01", "MAO-WM-01"],
    {
        "MA4-INT-C-01": "Primary. Multiplies integers, states and explains the sign rules using repeated addition and number patterns, and applies them to rates of change in context.",
        "MAO-WM-01": "Working mathematically: generalises from patterns, justifies a rule in more than one way, and identifies and corrects errors.",
    },
    "We are learning to multiply integers and to explain why the sign rules work.",
    ["I can multiply a positive integer by a negative integer using repeated addition.", "I can multiply a negative integer by a positive integer.", "I can use a pattern to explain why a negative times a negative is positive.", "I can state and use the sign rules for multiplication.", "I can multiply more than two integers by counting the negative signs.", "I can use the special cases of multiplying by 0, 1 and -1.", "I can use rates of change to solve real problems with negative integers."],
    ["integer", "product", "factor", "positive", "negative", "repeated addition", "rate of change", "pattern", "sign"],
    ["This lesson (everything you need is inside it)", "Paper and pencil", "A printed number line from -30 to 30 (optional)"],
    "You can add and subtract integers, including subtracting a negative, and you know that multiplication can be thought of as repeated addition (Weeks 1 and 2).",
    (
        "Why this matters. Many real changes repeat: a temperature that falls 3 degrees every hour, a diver who descends 4 metres every minute, a fee of $15 taken from an account each month. Multiplying integers lets you find the total change in one step. It also lets you look backwards in time, which is where a negative times a negative comes in.\n\n"
        "Positive times negative. Multiplication is repeated addition. 4 x (-3) means four lots of -3: (-3) + (-3) + (-3) + (-3) = -12. So a positive number times a negative number gives a negative answer.\n\n"
        "Negative times positive. Multiplication can be done in either order, so (-3) x 4 = 4 x (-3) = -12. A pattern shows the same thing: 3 x 4 = 12, 2 x 4 = 8, 1 x 4 = 4, 0 x 4 = 0, then (-1) x 4 = -4 and (-2) x 4 = -8. Each step down in the first number takes 4 off the answer.\n\n"
        "Negative times negative. Use a pattern again, this time with -4: 3 x (-4) = -12, 2 x (-4) = -8, 1 x (-4) = -4, 0 x (-4) = 0. The answers go up by 4 each time, so the next ones are (-1) x (-4) = 4 and (-2) x (-4) = 8. A negative times a negative is positive. You can also see it with subtraction: (-3) x (-4) means take away 3 lots of -4, so 0 - (-4) - (-4) - (-4) = 12.\n\n"
        "The sign rules. If the signs are the same, the answer is positive. If the signs are different, the answer is negative. Multiply the sizes as usual, then decide on the sign.\n\n"
        "More than two factors. Count the negative signs. An even number of negatives gives a positive answer, and an odd number gives a negative answer. (-2) x (-3) x (-4): there are three negatives, so the answer is negative, and 2 x 3 x 4 = 24, so the answer is -24.\n\n"
        "Special cases. Any number times 0 is 0. Any number times 1 is itself. Any number times -1 is its opposite: (-9) x (-1) = 9 and 7 x (-1) = -7.\n\n"
        "Rates of change. A rate of -3 degrees per hour times 5 hours gives 5 x (-3) = -15 degrees, a fall of 15. Looking back 4 hours is -4 hours, so (-4) x (-3) = 12: the temperature was 12 degrees higher four hours ago."
    ),
    [
        _step("1", "Positive times negative", "Multiplication is repeated addition. A positive number of groups of a negative number gives a negative total.\n\nWrite it as an addition first if you are not sure.", "4 x (-3) = (-3) + (-3) + (-3) + (-3) = -12.", "Groups of a negative add up to a negative.", ("What is 5 x (-2)?", ["10", "-10", "-7", "7"], 1, "Five lots of -2 is -10.")),
        _step("2", "Negative times positive", "The order does not matter in multiplication, so a negative times a positive is the same as the positive times the negative.\n\nA pattern also shows it: each step down in the first number takes the same amount off the answer.", "(-6) x 3 = 3 x (-6) = -18. Pattern: 2 x 4 = 8, 1 x 4 = 4, 0 x 4 = 0, (-1) x 4 = -4.", "Order does not matter.", ("What is (-7) x 2?", ["14", "-14", "-5", "5"], 1, "(-7) x 2 = 2 x (-7) = -14.")),
        _step("3", "Negative times negative", "Look at the pattern 3 x (-4) = -12, 2 x (-4) = -8, 1 x (-4) = -4, 0 x (-4) = 0. The answers go up by 4 each time.\n\nKeep the pattern going and the next answers are positive.", "(-1) x (-4) = 4 and (-2) x (-4) = 8. Also (-3) x (-4) = 0 - (-4) - (-4) - (-4) = 12.", "The pattern does not stop at zero.", ("What is (-3) x (-5)?", ["-15", "15", "-8", "8"], 1, "Negative times negative is positive, and 3 x 5 = 15.")),
        _step("4", "The sign rules", "Same signs give a positive answer. Different signs give a negative answer.\n\nMultiply the sizes first, then decide on the sign.", "8 x (-9) = -72 (different signs). (-6) x (-7) = 42 (same signs). (-12) x 5 = -60.", "Same signs positive, different signs negative.", ("What is (-6) x (-7)?", ["-42", "42", "-13", "13"], 1, "Same signs give a positive, and 6 x 7 = 42.")),
        _step("5", "More than two factors", "Count the negative signs. An even number of negatives makes the answer positive, an odd number makes it negative.\n\nOr multiply two at a time and apply the rule each time.", "(-2) x (-3) x (-4): (-2) x (-3) = 6, then 6 x (-4) = -24. Three negatives, so negative.", "Count the negatives.", ("What is (-1) x (-1) x (-1) x (-1)?", ["-1", "1", "4", "-4"], 1, "Four negatives is an even number, so the answer is positive, and the answer is 1.")),
        _step("6", "Zero, one and negative one", "Anything times 0 is 0. Anything times 1 is itself. Anything times -1 is its opposite.\n\nThese make quick checks and shortcuts.", "(-9) x 0 = 0. (-9) x (-1) = 9. 7 x (-1) = -7.", "Times -1 flips the sign.", ("What is (-15) x (-1)?", ["-15", "15", "-16", "16"], 1, "Multiplying by -1 gives the opposite, so the answer is 15.")),
        _step("7", "Rates of change", "A negative rate is a fall each unit of time. Multiply the rate by the time to find the total change. A negative time means looking back.\n\nWrite the multiplication with its signs and then interpret the answer.", "A fall of 3 degrees per hour for 5 hours: 5 x (-3) = -15. Four hours ago: (-4) x (-3) = 12 degrees higher.", "Rate times time gives the change.", ("A diver descends 4 metres every minute. What is the change in depth after 6 minutes?", ["24 m", "-10 m", "-24 m", "10 m"], 2, "The rate is -4 m per minute, and 6 x (-4) = -24, so the diver is 24 m lower.")),
    ],
    (
        "Scenario: A freezer's temperature is changing by -4 degrees every hour, and right now it is 2 degrees. The temperature t hours from now is 2 + (-4) x t. A negative t means hours ago.\n\n"
        "Step 1, three hours from now. t = 3. The change is 3 x (-4) = -12. The temperature is 2 + (-12) = -10 degrees.\n\n"
        "Step 2, three hours ago. t = -3. The change is (-3) x (-4) = 12. The temperature was 2 + 12 = 14 degrees.\n\n"
        "Step 3, check with a table. At t = -3, -2, -1, 0, 1, 2, 3 the temperatures are 14, 10, 6, 2, -2, -6, -10. They fall by 4 each hour, so 14 at three hours ago fits the pattern.\n\n"
        "Step 4, check with subtraction. (-3) x (-4) means taking away three lots of -4, so 0 - (-4) - (-4) - (-4) = 4 + 4 + 4 = 12. It agrees.\n\n"
        "Step 5, check the sign. The freezer is cooling, so it must have been warmer in the past. That is why a negative rate times a negative time is positive.\n\n"
        "Reasoning check. Well done, {{name}}. The pattern, the subtraction and the real situation all agree that a negative times a negative is positive."
    ),
    (
        "Work through these on paper or in the practice boxes. Part A (repeated addition): work out 5 x (-2), 3 x (-7), 4 x (-6), 6 x (-1) and 2 x (-15). Write the first one as a repeated addition. Part B (patterns): complete 3 x (-5) = -15, 2 x (-5) = -10, 1 x (-5), 0 x (-5), (-1) x (-5), (-2) x (-5), (-3) x (-5). Then complete (-4) x 4 = -16, (-4) x 3 = -12, (-4) x 2, (-4) x 1, (-4) x 0, (-4) x (-1), (-4) x (-2), (-4) x (-3). Part C (sign rules): work out (-6) x (-7), 8 x (-9), (-12) x 5, (-11) x (-3), (-9) x 0 and 15 x (-2). Part D (more than two factors): work out (-2) x (-3) x (-4), (-1) x (-1) x (-1) x (-1), 5 x (-2) x (-3), (-2) x (-2) x (-2) x (-2) x (-2) and 3 x (-4) x 0 x (-7). Part E (missing numbers): find the number in the gap. ? x 4 = -20, (-6) x ? = 42, ? x (-3) = -27, (-8) x ? = -8. Part F (spot the error): each of these has a mistake. Say what went wrong and give the correct answer: (-5) x (-4) = -20; 6 x (-3) = 18; (-2) x (-3) x (-5) = 30. Part G (real problems): a diver descends 4 m every minute, so find the change in depth after 6 minutes; a bank takes a $15 fee each month, so find the change in the balance after 8 months; the temperature is falling 2 degrees per hour, so find how much higher it was 5 hours ago."
    ),
    (
        "Mission: Mine Lift Log. Three lifts in a mine all pass level 0 at time 0. Lift A moves at -6 metres per minute, Lift B at +4 metres per minute and Lift C at -3 metres per minute. A negative time means minutes before time 0. Position = rate x time. Type your answers in the boxes.\n\n"
        "(a) Find the position of each lift 5 minutes after time 0.\n"
        "(b) Find the position of each lift 4 minutes before time 0, which is time -4.\n"
        "(c) Explain why Lift A was above level 0 at time -4, using the idea of a negative times a negative.\n"
        "(d) After how many minutes does Lift A reach -54 metres?\n"
        "(e) At time 5, find the sum of the positions of Lift A and Lift C, and the position of A minus the position of C.\n"
        "(f) A student says: '(-6) x (-4) = -24 because both numbers are negative so the answer is more negative.' Explain in two or three sentences what mistake was made and give the correct answer.\n"
        "(g) Find two different multiplications of two integers that give -48, and two that give +48. Write each with its signs."
    ),
    "Type your answers in the practice boxes. Show each multiplication with its signs, and write full sentences for the explanation questions.",
    "Did I say whether the signs are the same or different, multiply the sizes, give the answer the right sign, count negatives in longer products, and check with a pattern or an addition?",
    [
        _q("What is 4 x (-3)?", ["12", "-12", "-7", "7"], 1, "Four lots of -3 is -12."),
        _q("What is (-6) x 3?", ["-18", "18", "-3", "3"], 0, "Different signs give a negative, and 6 x 3 = 18."),
        _q("What is (-7) x (-5)?", ["-35", "35", "-12", "12"], 1, "Same signs give a positive, and 7 x 5 = 35."),
        _q("The product of two negative integers is...", ["always negative", "always positive", "always zero", "sometimes positive and sometimes negative"], 1, "A negative times a negative is always positive."),
        _q("What is (-2) x (-3) x (-4)?", ["24", "9", "-24", "-9"], 2, "Three negatives make a negative answer, and 2 x 3 x 4 = 24."),
        _q("What is (-9) x 0?", ["-9", "9", "1", "0"], 3, "Anything times 0 is 0."),
        _q("What is (-15) x (-1)?", ["-15", "15", "-16", "16"], 1, "Multiplying by -1 gives the opposite."),
        _q("A temperature falls 3 degrees each hour. What is the change after 5 hours?", ["-15", "15", "-8", "8"], 0, "5 x (-3) = -15. Good work, {{name}}."),
        _q("What is (-1) x (-1) x (-1) x (-1) x (-1)?", ["-1", "1", "5", "-5"], 0, "Five negatives is an odd number, so the answer is -1."),
        _q("Which of these is positive?", ["(-4) x 5", "4 x (-5)", "(-4) x (-5)", "(-4) x 0"], 2, "Only (-4) x (-5) = 20 is positive."),
    ],
    "Type your answers in the practice boxes and submit them. Include full sentences for parts (c), (f) and (g).",
    "Extension: why is a negative times a negative positive? Show that (-3) x (4 + (-4)) = 0 because the brackets equal 0. Then use the distributive law to write this as (-3) x 4 + (-3) x (-4) = 0. Work out (-3) x 4, and then explain what (-3) x (-4) must be for the total to be 0. Next, investigate (-1) multiplied by itself 20 times and then 21 times, and explain the pattern. Finally, test whether (-a) x b = -(a x b) with five examples of your own.",
    [("integer", "A whole number that can be positive, negative or zero"), ("product", "The result of multiplying"), ("factor", "A number that is multiplied"), ("positive", "Greater than zero"), ("negative", "Less than zero"), ("repeated addition", "Adding the same number several times"), ("rate of change", "How much something changes in each unit of time"), ("sign", "Whether a number is positive or negative")],
    [],
    _sort("Will the product be positive, negative or zero?", "Count the negative signs and look for a zero, then sort each product.", ["Positive", "Negative", "Zero"], [("(-3) x (-4)", 0), ("5 x (-6)", 1), ("(-8) x 0", 2), ("(-2) x (-2) x (-2)", 1), ("(-1) x (-1)", 0), ("0 x (-5)", 2), ("(-4) x 3", 1), ("(-5) x (-5) x (-5) x (-5)", 0)]),
    [
        _wc("What is (-3) x 8?", ["-24", "24", "5"], 0, "Different signs give a negative, and 3 x 8 = 24."),
        _wc("What is (-4) x (-4)?", ["-16", "8", "16"], 2, "Same signs give a positive."),
        _wc("What is 9 x (-2)?", ["18", "-18", "7"], 1, "Different signs give a negative."),
        _wc("What is (-10) x (-10)?", ["-100", "100", "20"], 1, "Same signs give a positive."),
        _wc("What is (-5) x 0?", ["0", "-5", "5"], 0, "Anything times 0 is 0."),
        _wc("What is (-1) x (-1) x (-1)?", ["1", "3", "-1"], 2, "Three negatives give a negative answer."),
        _wc("What is (-6) x (-1)?", ["-6", "6", "7"], 1, "Times -1 gives the opposite."),
        _wc("What is (-2) x (-3) x 2?", ["12", "-12", "-7"], 0, "(-2) x (-3) = 6, then 6 x 2 = 12."),
    ],
    [
        {"key": "partA", "label": "Part A: repeated addition", "hint": "5 x (-2), 3 x (-7), 4 x (-6), 6 x (-1), 2 x (-15). Write the first as an addition."},
        {"key": "partB", "label": "Part B: patterns", "hint": "Complete both patterns by continuing the answers past zero."},
        {"key": "partC", "label": "Part C: sign rules", "hint": "(-6) x (-7), 8 x (-9), (-12) x 5, (-11) x (-3), (-9) x 0, 15 x (-2)."},
        {"key": "partD", "label": "Part D: more than two factors", "hint": "Count the negatives, then multiply the sizes."},
        {"key": "partE", "label": "Part E: missing numbers", "hint": "? x 4 = -20, (-6) x ? = 42, ? x (-3) = -27, (-8) x ? = -8."},
        {"key": "partF", "label": "Part F: spot the error", "hint": "(-5) x (-4) = -20; 6 x (-3) = 18; (-2) x (-3) x (-5) = 30."},
        {"key": "partG", "label": "Part G: real problems", "hint": "A diver at -4 m per minute for 6 minutes, a $15 monthly fee for 8 months, a temperature falling 2 degrees per hour looking back 5 hours."},
        {"key": "taskA", "label": "Lift log (a): after 5 minutes", "hint": "Position = rate x time for each lift."},
        {"key": "taskB", "label": "Lift log (b): at time -4", "hint": "Rate x -4 for each lift."},
        {"key": "taskC", "label": "Lift log (c): why above zero", "hint": "Negative rate times a negative time. Where was Lift A before time 0?"},
        {"key": "taskD", "label": "Lift log (d): reaching -54", "hint": "How many minutes at -6 m per minute?"},
        {"key": "taskE", "label": "Lift log (e): A and C at time 5", "hint": "Sum of positions, and A minus C."},
        {"key": "taskF", "label": "Lift log (f): the student's mistake", "hint": "Two or three sentences about (-6) x (-4)."},
        {"key": "taskG", "label": "Lift log (g): products of -48 and 48", "hint": "Two different pairs for each, with signs."},
    ],
    ["Thinking a negative times a negative is negative because both numbers are negative", "Applying the add rule (same signs make a bigger negative) to multiplication", "Getting the sign wrong in a product with three or more negatives", "Believing multiplying always makes a number bigger", "Forgetting that anything times 0 is 0", "Dropping the negative sign when finding the size of the product"],
    ["Make a pattern of ten multiplications from 4 x 3 down to (-3) x (-3) and look at the answers.", "Use real chips: groups of negative chips for positive times negative, and removing groups for negative times negative.", "Act out a falling temperature with a table of hours (past and future) and temperatures."],
    "Part A: 5 x (-2) = (-2) + (-2) + (-2) + (-2) + (-2) = -10; 3 x (-7) = -21; 4 x (-6) = -24; 6 x (-1) = -6; 2 x (-15) = -30. Part B: 1 x (-5) = -5, 0 x (-5) = 0, (-1) x (-5) = 5, (-2) x (-5) = 10, (-3) x (-5) = 15; (-4) x 2 = -8, (-4) x 1 = -4, (-4) x 0 = 0, (-4) x (-1) = 4, (-4) x (-2) = 8, (-4) x (-3) = 12. Part C: 42; -72; -60; 33; 0; -30. Part D: (-2) x (-3) x (-4) = -24; (-1) x (-1) x (-1) x (-1) = 1; 5 x (-2) x (-3) = 30; (-2) to the fifth (five factors of -2) = -32; 3 x (-4) x 0 x (-7) = 0. Part E: -5; -7; 9; 1. Part F: (-5) x (-4) = 20, because the signs are the same so the answer is positive; 6 x (-3) = -18, because the signs are different so the answer is negative; (-2) x (-3) x (-5) = -30, because there are three negatives, which is odd, so the answer is negative. Part G: 6 x (-4) = -24, so the depth changes by -24 m; 8 x (-15) = -120, so the balance falls by $120; (-5) x (-2) = 10, so the temperature was 10 degrees higher 5 hours ago. Lift log (a): A: 5 x (-6) = -30 m; B: 5 x 4 = 20 m; C: 5 x (-3) = -15 m. (b): A: (-4) x (-6) = 24 m; B: (-4) x 4 = -16 m; C: (-4) x (-3) = 12 m. (c): Lift A moves down 6 m each minute, so before time 0 it must have been higher; mathematically a negative rate times a negative time gives a positive position of 24 m. (d): (-54) divided by (-6) is 9, because 9 x (-6) = -54, so after 9 minutes. (e): the sum is -30 + (-15) = -45 m; A minus C is -30 - (-15) = -15 m. (f): the student treated two negatives as making an even more negative answer; the signs are the same, so the product is positive, and (-6) x (-4) = 24. (g): for -48, accept pairs such as 6 x (-8), (-6) x 8, 12 x (-4), (-12) x 4, 3 x (-16) and 1 x (-48); for +48, accept pairs such as (-6) x (-8), 6 x 8, (-12) x (-4), 12 x 4, (-3) x (-16) and (-1) x (-48). Quiz answers: -12; -18; 35; always positive; -24; 0; 15; -15; -1; (-4) x (-5).",
)
