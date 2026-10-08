"""Stage 4 Mathematics, Week 4 Lesson 3: Fractions, decimals and percentages, Comparing and ordering fractions.
All written work is typed inside the lesson. Replaces the placeholder with seed_key s4-maths-w04-l3.
No video is attached: none has been found and tested for this topic yet. Add one in the video and link run.
Outcome codes MA4-FRC-C-01 and MAO-WM-01 are from the draft mapping and should be re-checked against NESA.
Builds on W4 L1 (LCM, equivalent fractions) and W4 L2 (simplest form). Only proper fractions are used here. Improper fractions and mixed numbers are taught in W4 L4.
The lesson uses the cross-product test a/b compared with c/d by comparing a x d with b x c, for positive fractions only.
Next is W4 L4, improper fractions and mixed numbers. W4 L5 is the fortnightly mini exam.
"""
from lesson_library_s4_builder import build_s4, _q, _step, _sort, _wc

LESSON = build_s4(
    "s4-maths-w04-l3",
    "Week 4, Lesson 3: Comparing and Ordering Fractions",
    "Decide which of two fractions is bigger and put a list of fractions in order. Use a common denominator, the benchmark of one half and cross products, and check every answer a second way.",
    "Fractions, decimals and percentages",
    ["MA4-FRC-C-01", "MAO-WM-01"],
    {
        "MA4-FRC-C-01": "Primary. Compares and orders fractions using common denominators, benchmarks and cross products, and places fractions on a number line.",
        "MAO-WM-01": "Working mathematically: chooses a strategy, shows each step, checks a comparison by a second method and explains a common error.",
    },
    "We are learning to compare and order fractions.",
    ["I can compare fractions with the same denominator or the same numerator.", "I can use one half as a benchmark.", "I can compare fractions using a common denominator.", "I can compare fractions using cross products.", "I can order a list of fractions from least to greatest.", "I can find a fraction between two fractions.", "I can check a comparison by a second method."],
    ["compare", "order", "benchmark", "common denominator", "lowest common denominator", "cross product", "least", "greatest", "between"],
    ["This lesson (everything you need is inside it)", "Paper and pencil", "A printed fraction wall or number line from 0 to 1 (optional)"],
    "You can find the lowest common multiple of two numbers, make equivalent fractions and write a fraction in simplest form (Week 4 Lessons 1 and 2).",
    (
        "Why this matters. Recipes, discounts, scores and measurements are often given as fractions with different denominators. To decide which is bigger, or to put them in order, you need a fair way to compare. This lesson gives you three, and you can use each one to check the others.\n\n"
        "Same denominator. When the pieces are the same size, the fraction with more pieces is bigger. 5/8 is greater than 3/8.\n\n"
        "Same numerator. When you have the same number of pieces, the fraction with smaller pieces is smaller. A bigger denominator means smaller pieces, so 3/4 is greater than 3/5.\n\n"
        "Benchmarks. Compare each fraction with 1/2. A fraction is less than 1/2 if its numerator is less than half the denominator, and more than 1/2 if it is more. 4/9 is less than 1/2 because half of 9 is 4.5, and 5/8 is more because half of 8 is 4.\n\n"
        "Common denominator. Make equivalent fractions with the same denominator, then compare numerators. The lowest common denominator (LCD) is the LCM of the denominators. To compare 3/4 and 5/6, the LCM of 4 and 6 is 12, so 3/4 = 9/12 and 5/6 = 10/12. 10/12 is greater, so 5/6 is greater.\n\n"
        "Cross products. To compare a/b with c/d, work out a x d and b x c. If a x d is bigger, a/b is bigger. For 5/7 and 7/10, 5 x 10 = 50 and 7 x 7 = 49, so 5/7 is greater.\n\n"
        "Ordering. To order several fractions, write them all over the LCD and put the numerators in order. Write the answer using the original fractions. To find a fraction between two others, write them over a bigger common denominator so there is room between the numerators."
    ),
    [
        _step("1", "Same denominator", "When the denominators match, the pieces are the same size. Just compare the numerators.\n\nMore pieces means a bigger fraction.", "5/8 is greater than 3/8 because 5 pieces is more than 3 pieces of the same size.", "Same size pieces, compare the tops.", ("Which is greater: 7/10 or 9/10?", ["7/10", "9/10", "They are equal", "Cannot tell"], 1, "The pieces are tenths, and 9 tenths is more than 7 tenths.")),
        _step("2", "Same numerator", "When the numerators match, compare the sizes of the pieces. A bigger denominator means smaller pieces.\n\nThink of sharing the same thing between more people.", "3/4 is greater than 3/5 because quarters are bigger than fifths.", "Bigger bottom, smaller pieces.", ("Which is greater: 2/3 or 2/7?", ["2/7", "2/3", "They are equal", "Cannot tell"], 1, "Thirds are bigger than sevenths.")),
        _step("3", "Using one half as a benchmark", "Half of the denominator is the key. If the numerator is less than that, the fraction is less than 1/2.\n\nThis is a quick way to sort fractions before you work out any more.", "4/9: half of 9 is 4.5, and 4 is less, so 4/9 is less than 1/2. 5/8: half of 8 is 4, and 5 is more, so 5/8 is more than 1/2.", "Compare the top with half the bottom.", ("Which of these is greater than 1/2?", ["3/8", "4/10", "5/9", "2/5"], 2, "Half of 9 is 4.5, and 5 is more than 4.5.")),
        _step("4", "Using a common denominator", "Find the LCM of the denominators and rewrite both fractions over it. Then compare the numerators.\n\nYou did this in Lesson 1 when you made equivalent fractions.", "3/4 and 5/6: the LCM of 4 and 6 is 12. 3/4 = 9/12 and 5/6 = 10/12, so 5/6 is greater.", "Same denominator, then compare.", ("Which is greater: 2/3 or 3/5?", ["3/5", "2/3", "They are equal", "Cannot tell"], 1, "Over 15, 2/3 = 10/15 and 3/5 = 9/15.")),
        _step("5", "Using cross products", "Multiply the numerator of each fraction by the denominator of the other. The fraction whose product is bigger is the bigger fraction.\n\nThis is a quick check for two fractions.", "5/7 and 7/10: 5 x 10 = 50 and 7 x 7 = 49. 50 is bigger, so 5/7 is greater.", "Top times the other bottom.", ("Which is greater: 4/9 or 3/7?", ["3/7", "4/9", "They are equal", "Cannot tell"], 1, "4 x 7 = 28 and 9 x 3 = 27, so 4/9 is greater.")),
        _step("6", "Ordering a list", "Write every fraction over the LCD, put the numerators in order, then write the answer with the original fractions.\n\nSay which direction you are ordering in.", "Order 2/3, 3/4, 5/8 and 1/2 from least to greatest. Over 24 they are 16/24, 18/24, 15/24 and 12/24, so the order is 1/2, 5/8, 2/3, 3/4.", "Order the numerators, not the fractions.", ("Which is the correct order from least to greatest for 3/5, 1/2 and 7/10?", ["1/2, 3/5, 7/10", "3/5, 1/2, 7/10", "7/10, 3/5, 1/2", "1/2, 7/10, 3/5"], 0, "Over 10 they are 6/10, 5/10 and 7/10, so the order is 5, 6, 7.")),
        _step("7", "Finding a fraction between", "Write both fractions over a larger common denominator so there is a gap between the numerators. Choose any numerator in the gap.\n\nThere is always another fraction between two different fractions.", "Between 1/3 and 1/2: over 6 they are 2/6 and 3/6, with no room. Over 12 they are 4/12 and 6/12, so 5/12 fits between.", "Make room, then choose.", ("Which fraction is between 1/4 and 1/2?", ["1/8", "3/8", "5/8", "3/4"], 1, "Over 8, 1/4 = 2/8 and 1/2 = 4/8, and 3/8 is between them.")),
    ],
    (
        "Scenario: Four friends are reading the same book for a reading challenge. Mia has read 3/4 of the book, Noah 5/8, Zoe 2/3 and Liam 7/12. Put them in order from least to most read.\n\n"
        "Step 1, benchmark. Half of 4 is 2, half of 8 is 4, half of 3 is 1.5 and half of 12 is 6, so 3 > 2, 5 > 4, 2 > 1.5 and 7 > 6. All four have read more than half.\n\n"
        "Step 2, common denominator. The LCM of 4, 8, 3 and 12 is 24. 3/4 = 18/24, 5/8 = 15/24, 2/3 = 16/24 and 7/12 = 14/24.\n\n"
        "Step 3, order. The numerators in order are 14, 15, 16 and 18, so the order is Liam 7/12, Noah 5/8, Zoe 2/3 and Mia 3/4.\n\n"
        "Step 4, check with cross products. 5/8 and 2/3: 5 x 3 = 15 and 8 x 2 = 16, so 2/3 is greater than 5/8. This agrees with the order.\n\n"
        "Step 5, use the result. Mia has read 18/24 and Liam 14/24, so Mia has read 18/24 - 14/24 = 4/24 = 1/6 of the book more than Liam.\n\n"
        "Good work, {{name}}. Each answer was checked in more than one way."
    ),
    (
        "Work through these on paper or in the practice boxes, one step per line. Part A (same denominator or numerator): write greater than, less than or equal to for 5/9 and 7/9, 3/8 and 3/5, 4/11 and 4/13, and 9/12 and 5/12. Part B (benchmark): say whether each is less than, equal to or more than 1/2: 3/7, 5/9, 6/12, 11/20 and 7/16. Part C (common denominator): compare each pair by writing them over the lowest common denominator: 2/3 and 3/4, 5/6 and 7/9, 3/10 and 2/5, and 7/12 and 5/8. Part D (cross products): compare each pair using cross products: 5/7 and 7/10, 8/13 and 5/8, 11/15 and 3/4, and 9/14 and 2/3. Part E (ordering): order 3/4, 2/3 and 5/6 from least to greatest. Order 1/2, 3/8, 5/12 and 7/16 from least to greatest. Order 4/5, 7/10, 3/4 and 9/10 from greatest to least. Part F (between): find a fraction between 1/3 and 1/2, between 3/5 and 2/3, and between 1/4 and 1/3. Part G (spot the error): each of these has a mistake. Say what went wrong and give the correct answer: 3/8 is greater than 3/5 because 8 is bigger than 5; 5/6 is less than 7/9 because 5 is less than 7; the fractions 1/2, 1/3 and 1/4 in order from least to greatest are 1/2, 1/3, 1/4; to compare 2/3 and 3/5 a student wrote 2/3 = 6/15 and 3/5 = 9/15 and said 3/5 is greater."
    ),
    (
        "Mission: Fundraising Race. Four classes are racing to reach their fundraising goals. 7A has raised 5/8 of its goal, 7B has raised 7/10, 7C has raised 3/5 and 7D has raised 11/16. Type your answers in the boxes.\n\n"
        "(a) Find the lowest common denominator of 8, 10, 5 and 16, write each fraction over it, and order the classes from least to greatest.\n"
        "(b) Which classes have raised more than 2/3 of their goal? Use cross products to decide for each class.\n"
        "(c) How much more of its goal must 7A raise to reach 3/4? How much more must 7C raise to reach 7/10?\n"
        "(d) Find a fraction that lies between the amounts raised by 7A and 7D.\n"
        "(e) A student says: '7/10 is less than 11/16 because 7 is less than 11.' Explain in two or three sentences what the mistake is and say which fraction is greater.\n"
        "(f) Make your own list of four fractions with different denominators. Order them, show the common denominator you used and check two of the comparisons with cross products."
    ),
    "Type your answers in the practice boxes. Show the common denominator or the cross products, check with a second method where you can, and write full sentences for the explanation questions.",
    "Did I choose a fair way to compare, rewrite the fractions over the same denominator when I needed to, order the numerators correctly, give the answer using the original fractions, and check with a second method?",
    [
        _q("Which is greater: 7/10 or 9/10?", ["7/10", "9/10", "They are equal", "Cannot tell"], 1, "9 tenths is more than 7 tenths."),
        _q("Which is greater: 2/3 or 2/7?", ["2/7", "2/3", "They are equal", "Cannot tell"], 1, "Thirds are bigger than sevenths."),
        _q("Which of these is greater than 1/2?", ["3/8", "4/10", "5/9", "2/5"], 2, "Half of 9 is 4.5."),
        _q("Which is greater: 2/3 or 3/5?", ["3/5", "2/3", "They are equal", "Cannot tell"], 1, "10/15 is greater than 9/15."),
        _q("Which is greater: 4/9 or 3/7?", ["3/7", "4/9", "They are equal", "Cannot tell"], 1, "4 x 7 = 28 is greater than 9 x 3 = 27."),
        _q("Which is the correct order from least to greatest for 3/5, 1/2 and 7/10?", ["1/2, 3/5, 7/10", "3/5, 1/2, 7/10", "7/10, 3/5, 1/2", "1/2, 7/10, 3/5"], 0, "6/10 is between 5/10 and 7/10."),
        _q("Which fraction is between 1/4 and 1/2?", ["1/8", "3/8", "5/8", "3/4"], 1, "2/8 < 3/8 < 4/8."),
        _q("What is the lowest common denominator of 3/4 and 5/6?", ["10", "24", "12", "8"], 2, "The LCM of 4 and 6 is 12."),
        _q("Which is the least of 7/12, 5/8, 2/3 and 3/4?", ["3/4", "5/8", "7/12", "2/3"], 2, "Over 24 they are 14, 15, 16 and 18, and 14 is the least. Good work, {{name}}."),
        _q("7B has raised 7/10 of its goal and 7D has raised 11/16. Which has raised more?", ["7/10", "11/16", "They are equal", "Cannot tell"], 0, "7 x 16 = 112 and 10 x 11 = 110, so 7/10 is greater."),
    ],
    "Type your answers in the practice boxes and submit them. Include full sentences for parts (e) and (f).",
    "Extension: the fraction detective. Find a fraction between 2/5 and 3/7, and explain how you know it is between them. Then use cross products to order 5/9, 4/7, 3/5 and 7/12 from least to greatest. Finally, explain in a sentence or two why you can always find another fraction between two different fractions.",
    [("compare", "Decide which of two amounts is bigger or smaller"), ("order", "Put in a sequence such as least to greatest"), ("benchmark", "A friendly number such as 1/2 used for comparing"), ("common denominator", "A denominator that is the same for two or more fractions"), ("lowest common denominator", "The LCM of the denominators"), ("cross product", "The numerator of one fraction times the denominator of the other"), ("least", "The smallest"), ("greatest", "The largest")],
    [],
    _sort("Less than, equal to or more than a half?", "Compare each fraction with 1/2, then sort it.", ["Less than 1/2", "Equal to 1/2", "More than 1/2"], [("3/5", 2), ("4/8", 1), ("2/7", 0), ("7/12", 2), ("5/10", 1), ("3/10", 0), ("9/16", 2), ("6/13", 0)]),
    [
        _wc("Which is greater: 3/5 or 3/8?", ["3/5", "3/8", "They are equal"], 0, "Fifths are bigger than eighths."),
        _wc("Which is greater: 5/6 or 7/9?", ["7/9", "5/6", "They are equal"], 1, "Over 18, 15/18 is greater than 14/18."),
        _wc("Which is the least: 1/2, 1/3 or 1/5?", ["1/2", "1/3", "1/5"], 2, "Fifths are the smallest pieces."),
        _wc("Which is closest to 1: 1/2, 3/4 or 7/8?", ["1/2", "3/4", "7/8"], 2, "7/8 is only 1/8 away from 1."),
        _wc("Which symbol makes 4/5 __ 7/10 true?", ["<", ">", "="], 1, "4/5 = 8/10, which is greater than 7/10."),
        _wc("What is the lowest common denominator of 1/6 and 1/8?", ["14", "24", "48"], 1, "The LCM of 6 and 8 is 24."),
        _wc("Which fraction is equal to 3/4?", ["6/8", "6/7", "3/8"], 0, "Multiply the top and bottom by 2."),
        _wc("Which fraction is between 1/2 and 1?", ["1/3", "3/4", "1/4"], 1, "3/4 is more than 1/2 and less than 1."),
    ],
    [
        {"key": "partA", "label": "Part A: same denominator or numerator", "hint": "Compare the number of pieces or the size of the pieces."},
        {"key": "partB", "label": "Part B: benchmark", "hint": "Compare each top with half of the bottom."},
        {"key": "partC", "label": "Part C: common denominator", "hint": "Find the LCM, then compare the numerators."},
        {"key": "partD", "label": "Part D: cross products", "hint": "Top times the other bottom, for each fraction."},
        {"key": "partE", "label": "Part E: ordering", "hint": "Check the direction: least to greatest or greatest to least."},
        {"key": "partF", "label": "Part F: between", "hint": "Use a larger common denominator to make room."},
        {"key": "partG", "label": "Part G: spot the error", "hint": "What went wrong, and what is the correct answer?"},
        {"key": "taskA", "label": "Race (a): order the classes", "hint": "Rewrite each over the LCD of 8, 10, 5 and 16."},
        {"key": "taskB", "label": "Race (b): more than 2/3", "hint": "Cross products with 2/3 for each class."},
        {"key": "taskC", "label": "Race (c): how much more", "hint": "Use the same denominator, then subtract."},
        {"key": "taskD", "label": "Race (d): a fraction between", "hint": "Look between the numerators over 80."},
        {"key": "taskE", "label": "Race (e): the student's mistake", "hint": "Two or three sentences about the denominators."},
        {"key": "taskF", "label": "Race (f): your own list", "hint": "Four fractions, a common denominator and two cross-product checks."},
    ],
    ["Thinking a bigger denominator means a bigger fraction", "Comparing only the numerators when the denominators differ", "Changing the denominator without changing the numerator", "Ordering in the wrong direction", "Writing the answer with the changed fractions instead of the originals", "Skipping the check at the end"],
    ["Draw a fraction wall or number line from 0 to 1 and mark each fraction.", "Always say out loud whether you are ordering from least to greatest or the other way round.", "Make a one-page reference sheet that shows each comparison method with one example."],
    "Part A: 5/9 < 7/9; 3/8 < 3/5; 4/11 > 4/13; 9/12 > 5/12. Part B: 3/7 is less than 1/2; 5/9 is more; 6/12 is equal; 11/20 is more; 7/16 is less. Part C: 2/3 = 8/12 and 3/4 = 9/12, so 3/4 is greater; 5/6 = 15/18 and 7/9 = 14/18, so 5/6 is greater; 3/10 and 2/5 = 4/10, so 2/5 is greater; 7/12 = 14/24 and 5/8 = 15/24, so 5/8 is greater. Part D: 5 x 10 = 50 and 7 x 7 = 49, so 5/7 is greater; 8 x 8 = 64 and 13 x 5 = 65, so 5/8 is greater; 11 x 4 = 44 and 15 x 3 = 45, so 3/4 is greater; 9 x 3 = 27 and 14 x 2 = 28, so 2/3 is greater. Part E: over 12 they are 9, 8 and 10, so the order is 2/3, 3/4, 5/6; over 48 they are 24, 18, 20 and 21, so the order is 3/8, 5/12, 7/16, 1/2; over 20 they are 16, 14, 15 and 18, so greatest to least is 9/10, 4/5, 3/4, 7/10. Part F: accept any valid fraction, for example 5/12 (or 2/5) between 1/3 and 1/2, 19/30 between 3/5 and 2/3, and 7/24 between 1/4 and 1/3. Part G: 3/8 is less than 3/5 because with the same numerator the bigger denominator means smaller pieces; 5/6 is greater than 7/9 because 15/18 is greater than 14/18, and you cannot compare only the numerators when the denominators differ; the correct order is 1/4, 1/3, 1/2 because a bigger denominator with the same numerator means a smaller fraction; 2/3 = 10/15, not 6/15, because the top and bottom must be multiplied by the same number (5), so 2/3 is greater than 3/5 (9/15). Race (a): the LCD is 80, so 7A = 50/80, 7B = 56/80, 7C = 48/80 and 7D = 55/80, and the order from least to greatest is 7C (3/5), 7A (5/8), 7D (11/16), 7B (7/10). (b): 7B and 7D are greater than 2/3: 7/10 gives 7 x 3 = 21 and 10 x 2 = 20; 11/16 gives 11 x 3 = 33 and 16 x 2 = 32; but 5/8 gives 15 and 16 and 3/5 gives 9 and 10, so 7A and 7C have raised less than 2/3. (c): 3/4 = 6/8, and 6/8 - 5/8 = 1/8 more for 7A; 7C is 3/5 = 6/10, and 7/10 - 6/10 = 1/10 more. (d): accept any fraction between 50/80 and 55/80, for example 13/20 (= 52/80). (e): comparing only the numerators is wrong because the denominators are different, so the pieces are different sizes. Over 80, 7/10 = 56/80 and 11/16 = 55/80, so 7/10 is greater. (f): accept any valid list where the order and the cross-product checks agree. Quiz answers: 9/10; 2/3; 5/9; 2/3; 4/9; 1/2, 3/5, 7/10; 3/8; 12; 7/12; 7/10. Extension: 2/5 = 14/35 and 3/7 = 15/35, so over 70 they are 28/70 and 30/70, and 29/70 is between them. Using cross products the order from least to greatest is 5/9, 4/7, 7/12, 3/5 (over 1260 they are 700, 720, 735 and 756). You can always find another fraction because you can write both fractions over a bigger common denominator, such as double the first one, and then there is room between the numerators.",
)
