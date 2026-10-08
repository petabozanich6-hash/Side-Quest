"""Stage 4 Mathematics, Week 1 Lesson 1: Integers, Explore (positive and negative numbers).
All written work is typed inside the lesson. Replaces the placeholder with seed_key s4-maths-w01-l1.
No video is attached: none has been found and tested for this topic yet. Add one in the video and link run.
Outcome codes MA4-INT-C-01 and MAO-WM-01 are from the draft mapping and should be re-checked against NESA.
"""
from lesson_library_s4_builder import build_s4, _q, _step, _sort, _wc

LESSON = build_s4(
    "s4-maths-w01-l1",
    "Week 1, Lesson 1: Integers, Exploring Positive and Negative Numbers",
    "Numbers do not stop at zero. Explorers, divers, pilots and bankers all use numbers below zero. Learn how integers work on the number line, how to compare and order them, and how to measure how far apart they are.",
    "Integers",
    ["MA4-INT-C-01", "MAO-WM-01"],
    {
        "MA4-INT-C-01": "Primary. Recognises, represents, compares and orders integers, and uses the number line to model them. Operations with integers are built on this in the following lessons.",
        "MAO-WM-01": "Working mathematically: communicates reasoning in words and symbols, and checks whether answers make sense.",
    },
    "We are learning to describe, compare and order positive and negative whole numbers (integers) using the number line.",
    ["I can say what an integer is and give examples of each kind.", "I can place integers on a number line.", "I can write an integer for a real situation, such as 40 m below sea level.", "I can compare and order integers, including negatives.", "I can find the opposite and the absolute value of an integer.", "I can work out the distance between two integers on a number line."],
    ["integer", "positive", "negative", "zero", "number line", "opposite", "absolute value", "origin", "greater than", "less than"],
    ["This lesson (everything you need is inside it)", "Paper and pencil", "A ruler", "A printed number line from -10 to 10 (optional)"],
    "You can count, compare and order whole numbers, and you can place whole numbers on a number line (Stage 3).",
    (
        "Why this matters. Many real situations go below zero: temperatures on a frosty night, the depth of the ocean, a bank account that is overdrawn, or a basement car park. To describe them clearly we need numbers on the other side of zero. Mathematicians call the whole set of these numbers the integers.\n\n"
        "What is an integer? An integer is a whole number that can be positive, negative or zero. Positive integers are 1, 2, 3 and so on. Negative integers are -1, -2, -3 and so on. Zero is an integer too, and it is neither positive nor negative. Fractions and decimals such as 2.5 or 3/4 are not integers.\n\n"
        "The number line. Draw a straight line and mark zero in the middle. Positive integers go to the right and negative integers go to the left, spaced equally. Numbers get larger as you move right and smaller as you move left. So -2 is to the right of -5, which means -2 is greater than -5.\n\n"
        "Comparing and ordering. Any positive integer is greater than any negative integer. Zero is greater than every negative integer and less than every positive integer. Among negatives, the one closest to zero is the greatest. Be careful: 9 is greater than 3, but -9 is less than -3, because -9 sits further to the left.\n\n"
        "Opposites. Two integers that are the same distance from zero on opposite sides are opposites. The opposite of 6 is -6, and the opposite of -6 is 6. The opposite of 0 is 0. A number and its opposite always add to zero.\n\n"
        "Absolute value. The absolute value of an integer is its distance from zero, so it is never negative. We write it with two bars: |-7| = 7 and |7| = 7. Absolute value tells you how far, not which direction.\n\n"
        "Distance between integers. To find how far apart two integers are, count the steps on the number line. If you cross zero, count the steps to zero and then the steps on from zero, and add them. From -6 to 2 is 6 steps to reach zero, then 2 more, so 8 steps."
    ),
    [
        _step("1", "What is an integer?", "An integer is a whole number that can be positive, negative or zero. Positive integers are 1, 2, 3 and so on. Negative integers are -1, -2, -3 and so on.\n\nZero is an integer but is neither positive nor negative. Fractions and decimals are not integers.", "Integers: -12, -1, 0, 5, 300. Not integers: 2.5, -0.75, 3/4.", "Integers are whole numbers on both sides of zero, and zero itself.", ("Which of these is an integer?", ["-7", "2.5", "3/4", "0.1"], 0, "-7 is a whole number, so it is a negative integer. The others are fractions or decimals.")),
        _step("2", "The number line", "A number line is a straight line with zero in the middle. Positive integers go to the right and negative integers go to the left, equally spaced.\n\nThe further right a number is, the greater it is.", "On a line from -5 to 5, the number -2 is two steps left of zero and 3 is three steps right of zero.", "Right means greater. Left means less.", ("Which number is greater?", ["-8", "-3", "They are equal", "You cannot tell"], 1, "-3 is further right on the number line than -8, so it is greater.")),
        _step("3", "Integers in the real world", "We use a negative integer for something below a starting point of zero. The starting point depends on the situation: sea level for height, zero degrees for temperature, a balance of zero dollars for money.\n\nThe sign tells you the direction. The number tells you how far.", "A diver 15 m below sea level is at -15. A bank balance of owing $25 is -25. A temperature of 4 degrees below zero is -4. Basement level 2 is floor -2.", "Below zero or owing something is negative. Above zero or having something is positive.", ("A submarine is 120 m below sea level. Which integer shows this?", ["120", "-120", "1.2", "0"], 1, "Below sea level is below zero, so the integer is -120.")),
        _step("4", "Comparing and ordering", "Every positive integer is greater than every negative integer. Zero sits between them. Among negative integers, the one closer to zero is greater.\n\nTo order integers, picture them on the number line and read from left (least) to right (greatest).", "Order -9, 4, -2, 0 from least to greatest: -9, -2, 0, 4.", "A bigger digit does not mean a bigger number when the sign is negative.", ("Which is the smallest integer?", ["3", "-1", "0", "-6"], 3, "-6 is furthest to the left, so it is the least.")),
        _step("5", "Opposites", "Opposites are the same distance from zero but on different sides. To find the opposite, change the sign.\n\nThe opposite of 0 is 0. A number and its opposite always add to zero.", "The opposite of 5 is -5. The opposite of -8 is 8. 5 + (-5) = 0.", "An opposite flips the sign and keeps the size.", ("What is the opposite of -12?", ["-12", "12", "0", "-21"], 1, "Changing the sign of -12 gives 12.")),
        _step("6", "Absolute value", "The absolute value of a number is its distance from zero. Distance is never negative, so absolute value is always zero or positive.\n\nWe write absolute value with two bars: |-7| = 7.", "|-7| = 7, |7| = 7 and |0| = 0. Both 7 and -7 are 7 steps from zero.", "Absolute value tells you how far from zero, not which direction.", ("What is |-15|?", ["-15", "0", "15", "30"], 2, "-15 is 15 steps from zero, so its absolute value is 15.")),
        _step("7", "Distance between integers", "To find how far apart two integers are, count steps on the number line. If the numbers are on the same side of zero, subtract the smaller size from the larger size. If you cross zero, add the two distances to zero.\n\nAlways check that your answer makes sense on the number line.", "From -6 to 2: 6 steps to zero, then 2 more steps, so 8 steps. From -63 to -18: both are below zero, so 63 - 18 = 45 steps.", "Crossing zero means adding the two distances. Staying on one side means subtracting.", ("The temperature rises from -6 to 2 degrees. How many degrees is the rise?", ["4", "6", "8", "-8"], 2, "There are 6 degrees up to zero and 2 more above zero, so 6 + 2 = 8.")),
    ],
    (
        "Scenario: A cave explorer starts at the cave entrance, which is at sea level (0 m). She records five places on a map: Campsite 45 m above sea level, Lake 18 m below, Deep chamber 63 m below, Cliff top 90 m above, and the entrance at 0.\n\n"
        "Step 1, write each as an integer. Above sea level is positive, below is negative. Campsite +45, Lake -18, Deep chamber -63, Cliff top +90, Entrance 0.\n\n"
        "Step 2, order from lowest to highest. Picture the number line. The furthest left is -63, then -18, then 0, then 45, then 90. So the order is -63, -18, 0, 45, 90.\n\n"
        "Step 3, which place is closest to sea level? Use absolute value, because we only want the distance. |0| = 0 is the smallest, so the entrance is closest, then the Lake with |-18| = 18, then the Campsite with 45.\n\n"
        "Step 4, how far is it from the Deep chamber to the Lake? Both are below zero, so subtract: 63 - 18 = 45 m. Check on the number line: from -63 up to -18 is 45 steps.\n\n"
        "Step 5, how far from the Deep chamber to the Cliff top? This crosses zero, so add: 63 + 90 = 153 m.\n\n"
        "Reasoning check. Notice that 63 is greater than 18, yet -63 is less than -18. The Deep chamber is lower because it is further below sea level. Well done, {{name}}. You just explained why the sign matters as much as the size."
    ),
    (
        "Work through these on paper or in the practice boxes. Part A (classify): for each number say whether it is a positive integer, a negative integer, zero or not an integer: 7, -3, 0, 2.5, -18, 100. Part B (write as integers): 15 m below sea level; owing $40; 6 floors above ground; 8 degrees below zero; a gain of 12 points. Part C (order): put -5, 3, -11, 0, 8, -2 in order from least to greatest. Part D (opposites and absolute value): write the opposite of 9, -14 and 0, then work out |-20| and |13|. Part E (distance): find how far it is from -7 to 2, and from -12 to -4. Check each answer by counting steps on a number line."
    ),
    (
        "Mission: Cave Explorer's Logbook. The explorer's map shows these places: Campsite 45 m above sea level; Lake 18 m below sea level; Deep chamber 63 m below sea level; Cliff top 90 m above sea level; Cave entrance at sea level. Type your answers in the boxes.\n\n"
        "(a) Write the height of each place as an integer.\n"
        "(b) Order the five places from lowest to highest.\n"
        "(c) Which place is closest to sea level, and which is furthest from it? Use absolute value to explain.\n"
        "(d) How far is it from the Deep chamber to the Lake?\n"
        "(e) How far is it from the Deep chamber to the Cliff top? Explain why you add this time.\n"
        "(f) A friend says -63 is greater than -18 because 63 is greater than 18. Explain in two or three sentences why your friend is wrong.\n"
        "(g) Make up your own situation that uses integers (for example temperatures, money or lifts). Write four integers for it, order them and give one distance between two of them."
    ),
    "Type your answers in the practice boxes. Show your working and write full sentences for the explanation questions.",
    "Did I write each situation as an integer with the correct sign, order integers using the number line, explain why a negative with a bigger digit is smaller, find opposites and absolute values, and decide when to add and when to subtract distances?",
    [
        _q("Which of these is NOT an integer?", ["-6", "0", "2.5", "14"], 2, "2.5 is a decimal, not a whole number. Integers are whole numbers, positive, negative or zero."),
        _q("Which integer is the greatest?", ["-9", "-5", "-1", "-12"], 2, "-1 is closest to zero and furthest right on the number line, so it is the greatest."),
        _q("Which list is in order from least to greatest?", ["0, -3, -8, 5", "-8, -3, 0, 5", "5, 0, -3, -8", "-3, -8, 0, 5"], 1, "Reading left to right on the number line gives -8, -3, 0, 5."),
        _q("What is the opposite of -14?", ["-14", "14", "0", "-41"], 1, "Changing the sign of -14 gives 14."),
        _q("What is |-9|?", ["-9", "0", "9", "18"], 2, "Absolute value is the distance from zero, and -9 is 9 steps from zero."),
        _q("Which integer describes a diver 30 m below sea level?", ["30", "-30", "3.0", "0"], 1, "Below sea level is below zero, so it is -30."),
        _q("The temperature rises from -4 to 3 degrees. By how many degrees does it rise?", ["1", "3", "7", "-7"], 2, "It crosses zero: 4 steps up to zero plus 3 more is 7."),
        _q("Which statement is true?", ["-3 > 2", "-10 < -4", "0 < -1", "-5 > -1"], 1, "-10 is further left than -4, so -10 < -4. Great work, {{name}}."),
        _q("What do you get when you add a number and its opposite?", ["Always 0", "Always 1", "The number itself", "Always a negative"], 0, "A number and its opposite are the same distance from zero on opposite sides, so they cancel to 0."),
        _q("Which number has the same absolute value as -6?", ["-60", "6", "-16", "0"], 1, "|-6| = 6 and |6| = 6."),
    ],
    "Type your answers in the practice boxes and submit them. Include full sentences for parts (c), (e), (f) and (g).",
    "Extension: a lift in a tall building with three basement levels travels between floors -3 and 14. Write the distance between each pair of floors in your list of five. Explain why there is no floor 0 in some real buildings, and decide how that changes the counting.",
    [("integer", "A whole number that can be positive, negative or zero"), ("positive", "Greater than zero, to the right of zero on the number line"), ("negative", "Less than zero, to the left of zero on the number line"), ("zero", "An integer that is neither positive nor negative"), ("number line", "A line showing numbers in order, with zero in the middle"), ("opposite", "The integer the same distance from zero on the other side"), ("absolute value", "The distance of a number from zero, written with bars like |-7|"), ("greater than", "Further to the right on the number line, written >"), ("less than", "Further to the left on the number line, written <")],
    [],
    _sort("Which kind of number is it?", "Sort each number into the correct group.", ["Positive integer", "Negative integer", "Zero", "Not an integer"], [("8", 0), ("-5", 1), ("0", 2), ("3.5", 3), ("-120", 1), ("1/2", 3), ("42", 0), ("-0.7", 3)]),
    [
        _wc("Which is greater?", ["-4", "-9", "They are equal"], 0, "-4 is closer to zero, so it is greater."),
        _wc("What is the opposite of 17?", ["-17", "17", "71"], 0, "Change the sign to get -17."),
        _wc("What is |-25|?", ["-25", "25", "0"], 1, "It is 25 steps from zero."),
        _wc("Which integer shows a loss of $60?", ["60", "-60", "6"], 1, "A loss is below zero, so -60."),
        _wc("Which is the least?", ["-2", "-20", "0"], 1, "-20 is furthest left."),
        _wc("How many steps from -3 to 4?", ["1", "7", "-7"], 1, "3 steps to zero plus 4 more is 7."),
        _wc("Which symbol makes this true: -8 __ -3?", ["<", ">", "="], 0, "-8 is to the left of -3, so -8 < -3."),
        _wc("What is the opposite of 0?", ["0", "1", "-1"], 0, "Zero is its own opposite."),
    ],
    [
        {"key": "partA", "label": "Part A: classify", "hint": "7, -3, 0, 2.5, -18, 100: positive integer, negative integer, zero or not an integer?"},
        {"key": "partB", "label": "Part B: write as integers", "hint": "15 m below sea level; owing $40; 6 floors above ground; 8 degrees below zero; a gain of 12 points."},
        {"key": "partC", "label": "Part C: order", "hint": "Order -5, 3, -11, 0, 8, -2 from least to greatest."},
        {"key": "partD", "label": "Part D: opposites and absolute value", "hint": "Opposite of 9, -14 and 0. Then |-20| and |13|."},
        {"key": "partE", "label": "Part E: distance", "hint": "How far from -7 to 2? How far from -12 to -4?"},
        {"key": "taskA", "label": "Logbook (a): integers", "hint": "Campsite, Lake, Deep chamber, Cliff top, Cave entrance as integers."},
        {"key": "taskB", "label": "Logbook (b): order", "hint": "Lowest to highest."},
        {"key": "taskC", "label": "Logbook (c): closest and furthest", "hint": "Use absolute value to explain."},
        {"key": "taskD", "label": "Logbook (d): Deep chamber to Lake", "hint": "Same side of zero. Subtract or add?"},
        {"key": "taskE", "label": "Logbook (e): Deep chamber to Cliff top", "hint": "This crosses zero. Explain why you add."},
        {"key": "taskF", "label": "Logbook (f): the friend's mistake", "hint": "Two or three sentences about -63 and -18."},
        {"key": "taskG", "label": "Logbook (g): my own situation", "hint": "Four integers, put in order, and one distance."},
    ],
    ["Thinking -9 is greater than -3 because 9 is greater than 3", "Forgetting the negative sign when writing a situation below zero", "Treating zero as positive or negative", "Writing a negative absolute value, such as |-7| = -7", "Subtracting when the distance crosses zero, instead of adding the two distances", "Calling decimals or fractions integers"],
    ["Collect five real temperatures or heights, write them as integers and order them.", "Draw a number line from -20 to 20 and mark the places you visit in a week, using your front door as zero.", "Find out the lowest and highest points in Australia as integers relative to sea level."],
    "Part A: 7 positive integer; -3 negative integer; 0 zero; 2.5 not an integer; -18 negative integer; 100 positive integer. Part B: -15; -40; 6; -8; 12. Part C: -11, -5, -2, 0, 3, 8. Part D: opposite of 9 is -9, of -14 is 14, of 0 is 0; |-20| = 20; |13| = 13. Part E: -7 to 2 is 7 + 2 = 9; -12 to -4 is 12 - 4 = 8. Logbook (a): Campsite 45, Lake -18, Deep chamber -63, Cliff top 90, Entrance 0. (b): -63, -18, 0, 45, 90. (c): closest is the Entrance since |0| = 0; furthest is the Cliff top since |90| = 90 is larger than |-63| = 63; accept clear use of absolute value. (d): 63 - 18 = 45 m. (e): 63 + 90 = 153 m, they add because the path crosses zero (sea level), so there are two separate distances to zero. (f): -63 is further below zero than -18, so it is further left on the number line and is less. Accept any answer that mentions position on the number line or distance below zero. (g): accept any sensible situation with four correctly signed integers, ordered correctly, and a correct distance with working. Quiz answers: 2.5; -1; -8, -3, 0, 5; 14; 9; -30; 7; -10 < -4; always 0; 6.",
)
