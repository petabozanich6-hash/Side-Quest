"""Stage 4 Mathematics, Week 3 Lesson 2: Integers, Dividing integers.
All written work is typed inside the lesson. Replaces the placeholder with seed_key s4-maths-w03-l2.
No video is attached: none has been found and tested for this topic yet. Add one in the video and link run.
Outcome codes MA4-INT-C-01 and MAO-WM-01 are from the draft mapping and should be re-checked against NESA.
Builds on W3 L1 (multiplying integers). Next is W3 L3, order of operations with integers.
"""
from lesson_library_s4_builder import build_s4, _q, _step, _sort, _wc

LESSON = build_s4(
    "s4-maths-w03-l2",
    "Week 3, Lesson 2: Dividing Integers",
    "Division undoes multiplication, so the sign rules for dividing integers match the rules for multiplying them. Use fact families to see why, and then use division to share debts and find rates.",
    "Integers",
    ["MA4-INT-C-01", "MAO-WM-01"],
    {
        "MA4-INT-C-01": "Primary. Divides integers, uses the inverse relationship with multiplication and fact families to explain the sign rules, handles zero, 1 and -1, and solves problems involving sharing and rates.",
        "MAO-WM-01": "Working mathematically: uses inverse operations to check answers, explains why division by zero is undefined, and identifies and corrects errors.",
    },
    "We are learning to divide integers and to explain why the sign rules work.",
    ["I can use multiplication to work out a division with integers.", "I can state and use the sign rules for dividing integers.", "I can write a fact family for a multiplication with integers.", "I can divide when the answer or the divisor is 0, 1 or -1, and explain why division by 0 is undefined.", "I can work out mixed multiplications and divisions from left to right.", "I can use division to share a debt or find a rate of change."],
    ["integer", "quotient", "dividend", "divisor", "inverse operation", "fact family", "undefined", "rate of change", "mean"],
    ["This lesson (everything you need is inside it)", "Paper and pencil", "A printed number line from -30 to 30 (optional)"],
    "You can multiply integers and know the sign rules (Week 3 Lesson 1). You know that division and multiplication undo each other.",
    (
        "Why this matters. Sharing a debt among friends, finding how fast a temperature fell, and finding the average of readings above and below zero all use division of integers. The good news is that division works just like multiplication, because it undoes multiplication.\n\n"
        "Division undoes multiplication. To work out -20 \u00f7 4, ask: what number times 4 gives -20? The answer is -5, because (-5) x 4 = -20. So -20 \u00f7 4 = -5.\n\n"
        "Different signs. 12 \u00f7 (-3) asks what number times -3 gives 12. It is -4, because (-4) x (-3) = 12. A positive divided by a negative is negative, and a negative divided by a positive is negative: -35 \u00f7 7 = -5.\n\n"
        "Same signs. -42 \u00f7 (-6) asks what number times -6 gives -42. It is 7, because 7 x (-6) = -42. A negative divided by a negative is positive, and a positive divided by a positive is positive.\n\n"
        "The sign rules. If the signs are the same, the answer is positive. If the signs are different, the answer is negative. Divide the sizes as usual, then decide on the sign. These are the same rules as multiplication.\n\n"
        "Fact families. One multiplication gives a family of facts. From 5 x (-6) = -30 we get (-6) x 5 = -30, -30 \u00f7 5 = -6 and -30 \u00f7 (-6) = 5. Use the family to check any division by multiplying back.\n\n"
        "Zero, one and negative one. 0 divided by any number except 0 is 0. Any number divided by 1 is itself. Any number divided by -1 is its opposite: -15 \u00f7 (-1) = 15. Dividing by 0 is undefined: 9 \u00f7 0 has no answer because no number times 0 gives 9.\n\n"
        "Mixed operations. Multiplication and division are done from left to right. (-24) \u00f7 4 x (-3) = (-6) x (-3) = 18.\n\n"
        "Real problems. Sharing a $60 debt equally among 4 people gives -60 \u00f7 4 = -15 each. A temperature that fell 18 degrees over 6 hours changed by -18 \u00f7 6 = -3 degrees per hour."
    ),
    [
        _step("1", "Division undoes multiplication", "Turn a division into a missing-number multiplication and solve it.\n\nAlways check by multiplying back.", "-20 \u00f7 4 = ? means ? x 4 = -20, so the answer is -5. Check: (-5) x 4 = -20.", "Ask: what times the divisor gives the dividend?", ("What is -20 \u00f7 4?", ["5", "-5", "-16", "16"], 1, "(-5) x 4 = -20.")),
        _step("2", "Different signs give a negative", "When the dividend and divisor have different signs, the quotient is negative.\n\nDivide the sizes, then give the answer a negative sign.", "12 \u00f7 (-3) = -4. -35 \u00f7 7 = -5.", "Different signs: negative.", ("What is 56 \u00f7 (-8)?", ["-7", "7", "8", "-8"], 0, "The signs are different, and 56 \u00f7 8 = 7, so the answer is -7.")),
        _step("3", "Same signs give a positive", "When both numbers have the same sign, the quotient is positive.\n\nThis includes two negatives.", "-42 \u00f7 (-6) = 7. Check: 7 x (-6) = -42.", "Same signs: positive.", ("What is -81 \u00f7 (-9)?", ["-9", "9", "-72", "72"], 1, "The signs are the same, so the answer is positive, and 81 \u00f7 9 = 9.")),
        _step("4", "Fact families", "One multiplication fact gives two division facts. Use them to find a missing factor.\n\nFor 5 x (-6) = -30, the family is (-6) x 5 = -30, -30 \u00f7 5 = -6 and -30 \u00f7 (-6) = 5.", "From 9 x (-4) = -36: (-4) x 9 = -36, -36 \u00f7 9 = -4 and -36 \u00f7 (-4) = 9.", "Divide the product by one factor to get the other.", ("If (-7) x 4 = -28, what is -28 \u00f7 (-7)?", ["-4", "-7", "4", "7"], 2, "Divide the product by one factor to get the other factor, which is 4.")),
        _step("5", "Zero, one and negative one", "0 divided by a non-zero number is 0. A number divided by 1 stays the same. A number divided by -1 becomes its opposite.\n\nDividing by 0 is undefined.", "0 \u00f7 (-8) = 0. -15 \u00f7 (-1) = 15. 9 \u00f7 0 is undefined because ? x 0 = 9 has no answer.", "You cannot divide by zero.", ("What is 0 \u00f7 (-5)?", ["-5", "5", "0", "Undefined"], 2, "Zero divided by any non-zero number is 0.")),
        _step("6", "Multiply and divide together", "Work from left to right, dealing with brackets first. Apply the sign rule at each step.\n\nWrite each step on its own line.", "(-24) \u00f7 4 x (-3) = (-6) x (-3) = 18.", "Left to right, one step at a time.", ("What is (-30) \u00f7 (-5) x (-2)?", ["12", "-3", "-12", "3"], 2, "(-30) \u00f7 (-5) = 6, then 6 x (-2) = -12.")),
        _step("7", "Sharing and rates", "Divide a total change by the number of equal parts or by the time to find each share or the rate. A negative total change gives a negative result.\n\nCheck by multiplying back.", "A $60 debt shared by 4 people is -60 \u00f7 4 = -15 each. A fall of 18 degrees in 6 hours is -18 \u00f7 6 = -3 degrees per hour.", "Total change divided by time gives the rate.", ("A balance falls by $96 evenly over 8 weeks. What is the change per week?", ["12", "-12", "88", "-88"], 1, "-96 \u00f7 8 = -12, a fall of $12 per week.")),
    ],
    (
        "Scenario: A school canteen account is overdrawn by $135, so its balance is -135. Over 9 days the balance fell by $135 at an even rate.\n\n"
        "Step 1, share the debt. The account's debt is shared equally among 5 groups. -135 \u00f7 5 = -27, so each group owes $27 (a balance of -27).\n\n"
        "Step 2, find the rate. The balance changed by -135 over 9 days, so the rate is -135 \u00f7 9 = -15 dollars per day.\n\n"
        "Step 3, check by multiplying back. -15 x 9 = -135. It agrees. Also -27 x 5 = -135.\n\n"
        "Step 4, find a time. How many days for a fall of $210 at -15 per day? -210 \u00f7 (-15) = 14 days, and 14 x (-15) = -210. The signs are the same, so the answer is positive, which makes sense for a number of days.\n\n"
        "Step 5, check the signs. A negative total divided by a positive number of groups gives a negative share. A negative change divided by a negative rate gives a positive time.\n\n"
        "Good work, {{name}}. Each time, multiplying back confirms the answer."
    ),
    (
        "Work through these on paper or in the practice boxes. Part A (sign rules): work out 18 \u00f7 (-3), -28 \u00f7 4, -45 \u00f7 (-9), 72 \u00f7 (-8), -100 \u00f7 10 and -63 \u00f7 (-7). Part B (fact families): write the other three facts for 9 x (-4) = -36. Then use 6 x (-7) = -42 to work out -42 \u00f7 6 and -42 \u00f7 (-7). Then use (-8) x (-5) = 40 to work out 40 \u00f7 (-8) and 40 \u00f7 (-5). Part C (missing numbers): find the number in the gap. ? \u00f7 4 = -6, 48 \u00f7 ? = -8, ? \u00f7 (-5) = -7, (-81) \u00f7 ? = -9. Part D (zero, one and negative one): work out 0 \u00f7 (-12), (-17) \u00f7 1 and (-17) \u00f7 (-1). Then explain in a sentence why 8 \u00f7 0 is undefined. Part E (mixed): work out (-24) \u00f7 4 x (-3), 15 x (-4) \u00f7 (-6), (-48) \u00f7 (-6) \u00f7 (-2) and (-20 + 8) \u00f7 (-4). Part F (spot the error): each of these has a mistake. Say what went wrong and give the correct answer: -36 \u00f7 (-4) = -9; 24 \u00f7 (-6) = 4; (-30) \u00f7 5 = 6; 0 \u00f7 (-3) is undefined. Part G (real problems): (a) share a $135 debt equally among 5 people; (b) a balance falls by $96 evenly over 8 weeks, so find the change per week; (c) find the mean of the temperatures -8, -3, -12, 5 and -2 by adding them and dividing by 5."
    ),
    (
        "Mission: Diver Depth Log. A team of divers recorded their dives. Depths are in metres below the surface, written as negatives, and rates are in metres per minute. Type your answers in the boxes.\n\n"
        "Diver A went from 0 to -72 m in 8 minutes at an even rate. Diver B went from 0 to -45 m in 5 minutes at an even rate. Diver C rose 60 m in 12 minutes at an even rate and finished at -33 m.\n\n"
        "(a) Find the rate of each diver in metres per minute.\n"
        "(b) At Diver A's rate, how many minutes would it take to reach -153 m from the surface?\n"
        "(c) Diver C was at -33 m at the end. Where was C 8 minutes before the end?\n"
        "(d) Find the mean of the three final depths, -72 m, -45 m and -33 m.\n"
        "(e) A student says: '-48 \u00f7 (-6) = -8 because dividing makes numbers smaller, so it must stay negative.' Explain in two or three sentences what is wrong and give the correct answer.\n"
        "(f) Write the fact family for Diver A's rate, using -9 x 8 = -72.\n"
        "(g) Write three different divisions of two integers that give -7, and two different divisions that give +7."
    ),
    "Type your answers in the practice boxes. Show each division with its signs, multiply back to check, and write full sentences for the explanation questions.",
    "Did I decide whether the signs are the same or different, divide the sizes, give the answer the right sign, multiply back to check, and remember that dividing by zero is undefined?",
    [
        _q("What is -20 \u00f7 4?", ["5", "-5", "-16", "16"], 1, "(-5) x 4 = -20."),
        _q("What is 56 \u00f7 (-8)?", ["-7", "7", "8", "-8"], 0, "Different signs give a negative, and 56 \u00f7 8 = 7."),
        _q("What is -81 \u00f7 (-9)?", ["-9", "9", "-72", "72"], 1, "Same signs give a positive."),
        _q("If (-7) x 4 = -28, what is -28 \u00f7 (-7)?", ["-4", "-7", "4", "7"], 2, "Divide the product by one factor to get the other factor."),
        _q("What is 0 \u00f7 (-5)?", ["-5", "5", "0", "Undefined"], 2, "Zero divided by a non-zero number is 0."),
        _q("What is 9 \u00f7 0?", ["0", "9", "-9", "Undefined"], 3, "No number times 0 gives 9, so it is undefined."),
        _q("What is (-30) \u00f7 (-5) x (-2)?", ["12", "-3", "-12", "3"], 2, "Left to right: (-30) \u00f7 (-5) = 6, then 6 x (-2) = -12."),
        _q("A balance falls by $96 evenly over 8 weeks. What is the change per week?", ["12", "-12", "88", "-88"], 1, "-96 \u00f7 8 = -12. Good work, {{name}}."),
        _q("A negative integer divided by a positive integer is...", ["always positive", "always negative", "always zero", "sometimes either"], 1, "Different signs always give a negative."),
        _q("What is -15 \u00f7 (-1)?", ["-15", "15", "1", "-1"], 1, "Dividing by -1 gives the opposite."),
    ],
    "Type your answers in the practice boxes and submit them. Include full sentences for part D (the explanation), part (e) and part (g).",
    "Extension: explain why a number divided by 0 is undefined, and why 0 \u00f7 0 is also a problem. Use the idea that division undoes multiplication. Next, test whether -a \u00f7 b, a \u00f7 (-b) and -(a \u00f7 b) are always equal, using at least five examples. Then test whether division is commutative by comparing -12 \u00f7 4 with 4 \u00f7 (-12) and writing about what you find.",
    [("integer", "A whole number that can be positive, negative or zero"), ("quotient", "The result of dividing"), ("dividend", "The number being divided"), ("divisor", "The number you divide by"), ("inverse operation", "An operation that undoes another"), ("fact family", "A group of multiplication and division facts that use the same three numbers"), ("undefined", "Has no answer"), ("rate of change", "How much something changes in each unit of time"), ("mean", "The total of the values divided by how many there are")],
    [],
    _sort("Will the quotient be positive, negative or zero?", "Look at the signs and any zero, then sort each division.", ["Positive", "Negative", "Zero"], [("-24 \u00f7 6", 1), ("-24 \u00f7 (-6)", 0), ("0 \u00f7 (-6)", 2), ("24 \u00f7 (-6)", 1), ("-18 \u00f7 (-3)", 0), ("0 \u00f7 7", 2), ("45 \u00f7 (-9)", 1), ("-56 \u00f7 (-8)", 0)]),
    [
        _wc("What is -16 \u00f7 4?", ["4", "-4", "12"], 1, "Different signs give a negative."),
        _wc("What is -30 \u00f7 (-6)?", ["-5", "5", "24"], 1, "Same signs give a positive."),
        _wc("What is 42 \u00f7 (-7)?", ["-6", "6", "35"], 0, "Different signs give a negative."),
        _wc("What is 0 \u00f7 (-9)?", ["0", "-9", "Undefined"], 0, "Zero divided by a non-zero number is 0."),
        _wc("What is -100 \u00f7 (-10)?", ["-10", "10", "110"], 1, "Same signs give a positive."),
        _wc("What is -8 \u00f7 (-1)?", ["8", "-8", "9"], 0, "Dividing by -1 gives the opposite."),
        _wc("What is 27 \u00f7 (-3)?", ["9", "-9", "24"], 1, "Different signs give a negative."),
        _wc("What is -45 \u00f7 9?", ["-5", "5", "-36"], 0, "Different signs give a negative."),
    ],
    [
        {"key": "partA", "label": "Part A: sign rules", "hint": "18 \u00f7 (-3), -28 \u00f7 4, -45 \u00f7 (-9), 72 \u00f7 (-8), -100 \u00f7 10, -63 \u00f7 (-7)."},
        {"key": "partB", "label": "Part B: fact families", "hint": "Write the other three facts for 9 x (-4) = -36, then use the other two families."},
        {"key": "partC", "label": "Part C: missing numbers", "hint": "Turn each into a multiplication and solve."},
        {"key": "partD", "label": "Part D: zero, one and negative one", "hint": "0 \u00f7 (-12), (-17) \u00f7 1, (-17) \u00f7 (-1), and why 8 \u00f7 0 is undefined."},
        {"key": "partE", "label": "Part E: mixed", "hint": "Work left to right and do brackets first."},
        {"key": "partF", "label": "Part F: spot the error", "hint": "-36 \u00f7 (-4) = -9; 24 \u00f7 (-6) = 4; (-30) \u00f7 5 = 6; 0 \u00f7 (-3) is undefined."},
        {"key": "partG", "label": "Part G: real problems", "hint": "Share -135 among 5, find -96 over 8 weeks, and find the mean of -8, -3, -12, 5, -2."},
        {"key": "taskA", "label": "Dive log (a): rates", "hint": "Change in depth divided by time for each diver."},
        {"key": "taskB", "label": "Dive log (b): time to -153 m", "hint": "-153 divided by Diver A's rate."},
        {"key": "taskC", "label": "Dive log (c): 8 minutes earlier", "hint": "Diver C rises at a steady rate. Go back 8 minutes from -33 m."},
        {"key": "taskD", "label": "Dive log (d): mean depth", "hint": "Add the three depths, then divide by 3."},
        {"key": "taskE", "label": "Dive log (e): the student's mistake", "hint": "Two or three sentences about -48 \u00f7 (-6)."},
        {"key": "taskF", "label": "Dive log (f): fact family", "hint": "Four facts from -9 x 8 = -72."},
        {"key": "taskG", "label": "Dive log (g): quotients of -7 and 7", "hint": "Three divisions for -7 and two for +7, with signs."},
    ],
    ["Thinking a negative divided by a negative is negative", "Thinking division always makes a number smaller", "Dividing by zero or saying 0 \u00f7 5 is undefined", "Mixing up the dividend and the divisor", "Doing multiplication before division instead of left to right", "Dropping the negative sign when dividing the sizes"],
    ["Write every division as a missing-number multiplication and use chips or a number line to check.", "Use a fact family triangle with the product at the top and the two factors at the bottom.", "Make a table of equal shares of a debt, such as $60 shared by 2, 3, 4, 5 and 6 people."],
    "Part A: -6; -7; 5; -9; -10; 9. Part B: the family for 9 x (-4) = -36 is (-4) x 9 = -36, -36 \u00f7 9 = -4 and -36 \u00f7 (-4) = 9; -42 \u00f7 6 = -7 and -42 \u00f7 (-7) = 6; 40 \u00f7 (-8) = -5 and 40 \u00f7 (-5) = -8. Part C: -24 (since -24 \u00f7 4 = -6); -6 (since 48 \u00f7 (-6) = -8); 35 (since 35 \u00f7 (-5) = -7); 9 (since -81 \u00f7 9 = -9). Part D: 0; -17; 17; 8 \u00f7 0 is undefined because no number multiplied by 0 gives 8. Part E: (-24) \u00f7 4 x (-3) = (-6) x (-3) = 18; 15 x (-4) \u00f7 (-6) = -60 \u00f7 (-6) = 10; (-48) \u00f7 (-6) \u00f7 (-2) = 8 \u00f7 (-2) = -4; (-20 + 8) \u00f7 (-4) = (-12) \u00f7 (-4) = 3. Part F: -36 \u00f7 (-4) = 9, because the signs are the same so the answer is positive; 24 \u00f7 (-6) = -4, because the signs are different so the answer is negative; (-30) \u00f7 5 = -6, because the signs are different; 0 \u00f7 (-3) = 0, because zero divided by a non-zero number is 0 (it is only dividing by 0 that is undefined). Part G: (a) -135 \u00f7 5 = -27, so each person owes $27; (b) -96 \u00f7 8 = -12, a fall of $12 per week; (c) -8 + (-3) + (-12) + 5 + (-2) = -20, and -20 \u00f7 5 = -4 degrees. Dive log (a): A: -72 \u00f7 8 = -9 m per minute; B: -45 \u00f7 5 = -9 m per minute; C: 60 \u00f7 12 = 5 m per minute (rising). (b): -153 \u00f7 (-9) = 17 minutes. (c): in 8 minutes C rises 8 x 5 = 40 m, so 8 minutes before the end C was at -33 - 40 = -73 m. (d): (-72 + (-45) + (-33)) \u00f7 3 = -150 \u00f7 3 = -50 m. (e): the student thought dividing always makes the number smaller, but the signs are the same, so the quotient is positive, and -48 \u00f7 (-6) = 8; check 8 x (-6) = -48. (f): -9 x 8 = -72, 8 x (-9) = -72, -72 \u00f7 8 = -9 and -72 \u00f7 (-9) = 8. (g): for -7, accept divisions such as 42 \u00f7 (-6), -35 \u00f7 5, -70 \u00f7 10 and -49 \u00f7 7; for +7, accept divisions such as -42 \u00f7 (-6), 35 \u00f7 5, -70 \u00f7 (-10) and 49 \u00f7 7. Quiz answers: -5; -7; 9; 4; 0; undefined; -12; -12; always negative; 15.",
)
