"""Stage 4 Mathematics, Week 4 Lesson 4: Fractions, decimals and percentages, Improper fractions and mixed numbers.
All written work is typed inside the lesson. Replaces the placeholder with seed_key s4-maths-w04-l4.
No video is attached: none has been found and tested for this topic yet. Add one in the video and link run.
Outcome codes MA4-FRC-C-01 and MAO-WM-01 are from the draft mapping and should be re-checked against NESA.
Builds on W4 L1 to L3 (equivalent fractions, simplest form, comparing and ordering). Mixed numbers are written with a space, such as 3 2/5.
Only subtraction of fractions with the same denominator is used in the worked example and mission, so adding and subtracting fractions with different denominators is left for the next lessons in the unit.
Next is W4 L5, the fortnightly mini exam on Integers and Fractions.
"""
from lesson_library_s4_builder import build_s4, _q, _step, _sort, _wc

LESSON = build_s4(
    "s4-maths-w04-l4",
    "Week 4, Lesson 4: Improper Fractions and Mixed Numbers",
    "Learn what improper fractions and mixed numbers are, and how to change from one to the other. Place them on a number line, compare and order them, and use them to solve problems about pies, slices and wholes.",
    "Fractions, decimals and percentages",
    ["MA4-FRC-C-01", "MAO-WM-01"],
    {
        "MA4-FRC-C-01": "Primary. Converts between improper fractions and mixed numbers, places them on a number line and compares and orders them.",
        "MAO-WM-01": "Working mathematically: chooses a method, shows each step, checks a conversion by working back and explains an error.",
    },
    "We are learning to convert between improper fractions and mixed numbers.",
    ["I can tell proper fractions, improper fractions and mixed numbers apart.", "I can place an improper fraction on a number line.", "I can change an improper fraction to a mixed number.", "I can change a mixed number to an improper fraction.", "I can write whole numbers as fractions.", "I can write the fraction part of a mixed number in simplest form.", "I can compare and order mixed numbers and improper fractions."],
    ["proper fraction", "improper fraction", "mixed number", "whole number", "numerator", "denominator", "remainder", "quotient", "number line"],
    ["This lesson (everything you need is inside it)", "Paper and pencil", "A printed number line from 0 to 5 (optional)"],
    "You can write a fraction in simplest form, compare fractions using a common denominator and divide whole numbers with a remainder (Week 4 Lessons 1 to 3).",
    (
        "Why this matters. Many amounts are bigger than one whole, such as 29 slices of pizza from pizzas cut into 8. Improper fractions and mixed numbers let us write those amounts clearly, and we choose the form that suits the job.\n\n"
        "Types of fraction. A proper fraction is less than one whole, so the numerator is smaller than the denominator, like 3/4. An improper fraction is one whole or more, so the numerator is at least as big as the denominator, like 7/4 or 4/4. A mixed number has a whole number and a proper fraction, like 1 3/4.\n\n"
        "Improper fraction to mixed number. Divide the numerator by the denominator. The quotient is the whole number, the remainder is the new numerator and the denominator stays the same. For 17/5, 17 \u00f7 5 = 3 remainder 2, so 17/5 = 3 2/5.\n\n"
        "Mixed number to improper fraction. Multiply the whole number by the denominator, add the numerator and keep the denominator. For 3 2/5, 3 x 5 + 2 = 17, so 3 2/5 = 17/5.\n\n"
        "Whole numbers as fractions. A whole number n equals n x d over d for any denominator d. For example 3 = 12/4 = 15/5, and 24/6 = 4 because 24 \u00f7 6 = 4.\n\n"
        "Simplest form. If the fraction part of a mixed number can be simplified, simplify it: 2 6/8 = 2 3/4.\n\n"
        "Comparing. For mixed numbers, compare the whole numbers first. If they are the same, compare the fraction parts using a common denominator. To compare a mixed number with an improper fraction, change them to the same form first."
    ),
    [
        _step("1", "Proper, improper and mixed", "A proper fraction has a smaller top than bottom. An improper fraction has a top that is the same as or bigger than the bottom. A mixed number has a whole number and a fraction.\n\nAn improper fraction is not wrong, it is just one whole or more.", "3/4 is proper, 7/4 is improper and 1 3/4 is a mixed number. 7/4 and 1 3/4 are the same amount.", "Top at least the bottom means one whole or more.", ("Which of these is an improper fraction?", ["3/8", "8/3", "1 2/3", "5/9"], 1, "8 is bigger than 3, so 8/3 is more than one whole.")),
        _step("2", "Pictures and number lines", "Split each whole into the number of parts shown by the denominator. Count along past the whole numbers.\n\nThe whole number tells you which two whole numbers the fraction sits between.", "7/4: one whole is 4 quarters, so 7 quarters is 1 whole and 3 quarters. It sits between 1 and 2.", "Count wholes, then the rest.", ("A number line is split into fifths. Between which two whole numbers is 8/5?", ["0 and 1", "1 and 2", "2 and 3", "3 and 4"], 1, "5/5 = 1 and 10/5 = 2, and 8 is between 5 and 10.")),
        _step("3", "Improper fraction to mixed number", "Divide the top by the bottom. The quotient is the whole number. The remainder goes over the same denominator.\n\nCheck that the remainder is smaller than the denominator.", "17/5: 17 \u00f7 5 = 3 remainder 2, so 17/5 = 3 2/5.", "Divide, then write the remainder as a fraction.", ("Write 11/4 as a mixed number.", ["2 1/4", "2 3/4", "3 1/4", "1 3/4"], 1, "11 \u00f7 4 = 2 remainder 3, so 11/4 = 2 3/4.")),
        _step("4", "Mixed number to improper fraction", "Multiply the whole number by the denominator and add the numerator. Keep the denominator.\n\nThe new numerator counts all the parts.", "3 2/5: 3 x 5 + 2 = 17, so 3 2/5 = 17/5.", "Whole times bottom, plus top.", ("Write 2 3/8 as an improper fraction.", ["16/8", "19/8", "23/8", "11/8"], 1, "2 x 8 + 3 = 19, so 2 3/8 = 19/8.")),
        _step("5", "Whole numbers as fractions", "Any whole number can be written as a fraction. Multiply the whole number by the denominator you want to get the numerator.\n\nIf the bottom divides the top exactly, the fraction is a whole number.", "3 = 12/4 because 3 x 4 = 12. Also 20/5 = 4 because 20 \u00f7 5 = 4.", "A whole is a fraction with the same top and bottom.", ("Which of these fractions is equal to 4?", ["16/3", "20/5", "14/4", "9/2"], 1, "20 \u00f7 5 = 4.")),
        _step("6", "Simplifying the fraction part", "After you convert, check whether the fraction part can be simplified. Use the HCF of the numerator and denominator.\n\nThe whole number does not change.", "2 6/8 = 2 3/4, and 14/6 = 2 2/6 = 2 1/3.", "Simplify the fraction part only.", ("Write 14/6 as a mixed number in simplest form.", ["2 2/3", "2 1/3", "2 1/6", "3 1/3"], 1, "14 \u00f7 6 = 2 remainder 2, so 2 2/6 = 2 1/3.")),
        _step("7", "Comparing and ordering", "Compare the whole numbers first. If they match, compare the fraction parts with a common denominator. Change an improper fraction to a mixed number to compare it with another mixed number.\n\nPut both numbers in the same form.", "2 3/4 and 2 2/3 have the same whole number. 3/4 = 9/12 and 2/3 = 8/12, so 2 3/4 is greater.", "Wholes first, then fractions.", ("Which is greater: 10/3 or 3 1/2?", ["10/3", "3 1/2", "They are equal", "Cannot tell"], 1, "10/3 = 3 1/3, and 1/2 is greater than 1/3, so 3 1/2 is greater.")),
    ],
    (
        "Scenario: At a pizza party, every pizza is cut into 8 equal slices. The guests eat 29 slices. How many pizzas is that, and how much of a 4-pizza order is left?\n\n"
        "Step 1, write the amount. Each slice is 1/8 of a pizza, so 29 slices is 29/8 of a pizza. This is an improper fraction because 29 is bigger than 8.\n\n"
        "Step 2, change to a mixed number. 29 \u00f7 8 = 3 remainder 5, so 29/8 = 3 5/8 pizzas.\n\n"
        "Step 3, check by working back. 3 x 8 + 5 = 29, so 3 5/8 = 29/8.\n\n"
        "Step 4, locate it. 3 5/8 is between 3 and 4. Half of 8 is 4 and 5 is more than 4, so it is closer to 4.\n\n"
        "Step 5, find what is left. 4 pizzas is 32 slices, so 32/8 - 29/8 = 3/8 of a pizza is left over.\n\n"
        "Step 6, compare. A second party ate 3 3/4 pizzas. 3/4 = 6/8, and 5/8 is less than 6/8, so the second party ate more, by 6/8 - 5/8 = 1/8 of a pizza.\n\n"
        "Good work, {{name}}. Each answer was checked in more than one way."
    ),
    (
        "Work through these on paper or in the practice boxes, one step per line. Part A (classify): say whether each is a proper fraction, an improper fraction or a mixed number: 5/9, 9/5, 2 1/3, 7/7, 1/8 and 12/5. Part B (improper to mixed): write 7/3, 13/4, 22/5, 30/7, 41/8 and 59/10 as mixed numbers. Part C (mixed to improper): write 2 1/5, 3 3/4, 5 2/7, 4 5/8, 6 1/10 and 1 11/12 as improper fractions. Part D (simplest form): write each as a mixed number in simplest form: 14/6, 26/8, 45/12 and 40/16. Part E (whole numbers): work out 24/6 and 35/7, then find the missing number in 3 = ?/4, 5 = ?/3 and 7 = ?/8. Part F (compare and order): which is greater, 2 3/4 or 2 2/3? Which is greater, 3 1/5 or 16/5? Which is greater, 7/2 or 3 1/3? Order 9/4, 7/3, 2 1/2 and 2 2/3 from least to greatest. Part G (spot the error): each of these has a mistake. Say what went wrong and give the correct answer: 13/4 = 3 3/4; 2 3/5 = 11/5 because 2 x 3 + 5 = 11; 3 1/2 is less than 3 1/3 because 2 is less than 3; 14/4 = 3 2/4 and that is the simplest form."
    ),
    (
        "Mission: Bake Sale. A school bake sale sells pies that are each cut into 6 equal slices. On Monday 27 slices are sold, on Tuesday 35, on Wednesday 19 and on Thursday 44. Type your answers in the boxes.\n\n"
        "(a) For each day, write the number of pies sold as an improper fraction with a denominator of 6 and then as a mixed number in simplest form.\n"
        "(b) Order the four days from the fewest pies sold to the most pies sold.\n"
        "(c) The bakery can only bake whole pies. How many whole pies must be baked each day so that none sell out early, and what fraction of a pie is left over each day, in simplest form?\n"
        "(d) How many slices are sold in total over the four days? Write the total as an improper fraction of pies and as a mixed number, and check by working back.\n"
        "(e) A student says: '27/6 = 4 3/6, and that is the simplest form.' Explain in two or three sentences what is missing and give the correct answer.\n"
        "(f) Make your own bake sale with pies cut into 8 slices and four days of sales. Write each day as an improper fraction and as a mixed number in simplest form, and order the days."
    ),
    "Type your answers in the practice boxes. Show each division or multiplication, check by working back where you can, and write full sentences for the explanation questions.",
    "Did I divide for improper to mixed and multiply then add for mixed to improper, keep the denominator, make sure the remainder is smaller than the denominator, simplify the fraction part and check by working back?",
    [
        _q("Which of these is an improper fraction?", ["3/8", "8/3", "1 2/3", "5/9"], 1, "8 is bigger than 3."),
        _q("A number line is split into fifths. Between which two whole numbers is 8/5?", ["0 and 1", "1 and 2", "2 and 3", "3 and 4"], 1, "5/5 = 1 and 10/5 = 2."),
        _q("Write 11/4 as a mixed number.", ["2 1/4", "2 3/4", "3 1/4", "1 3/4"], 1, "11 \u00f7 4 = 2 remainder 3."),
        _q("Write 2 3/8 as an improper fraction.", ["16/8", "19/8", "23/8", "11/8"], 1, "2 x 8 + 3 = 19."),
        _q("Which of these fractions is equal to 4?", ["16/3", "20/5", "14/4", "9/2"], 1, "20 \u00f7 5 = 4."),
        _q("Write 14/6 as a mixed number in simplest form.", ["2 2/3", "2 1/3", "2 1/6", "3 1/3"], 1, "14 \u00f7 6 = 2 remainder 2, and 2/6 = 1/3."),
        _q("Which is greater: 10/3 or 3 1/2?", ["10/3", "3 1/2", "They are equal", "Cannot tell"], 1, "10/3 = 3 1/3, which is less than 3 1/2."),
        _q("Write 5 3/10 as an improper fraction.", ["15/10", "53/10", "8/10", "50/3"], 1, "5 x 10 + 3 = 53."),
        _q("Which is the greatest of 9/4, 7/3, 2 1/2 and 2 2/3?", ["9/4", "7/3", "2 1/2", "2 2/3"], 3, "The whole numbers are all 2, and the fraction parts are 1/4, 1/3, 1/2 and 2/3. Good work, {{name}}."),
        _q("A bake sale sells 44 slices of pie, with 6 slices in each pie. How many pies is that, as a mixed number in simplest form?", ["7 2/6", "7 1/3", "8 1/3", "6 2/3"], 1, "44 \u00f7 6 = 7 remainder 2, and 2/6 = 1/3."),
    ],
    "Type your answers in the practice boxes and submit them. Include full sentences for parts (e) and (f).",
    "Extension: the mixed number detective. Write the improper fraction that sits exactly halfway between 2 and 3. Find an improper fraction with a denominator of 7 that lies between 3 1/2 and 4. Count how many improper fractions with a denominator of 5 lie strictly between 1 and 3. Finally, explain why the improper fraction made from a mixed number always has a numerator bigger than its denominator.",
    [("proper fraction", "A fraction less than one whole, with the numerator smaller than the denominator"), ("improper fraction", "A fraction of one whole or more, with the numerator at least as big as the denominator"), ("mixed number", "A whole number and a proper fraction together"), ("whole number", "A number with no fraction part, such as 0, 1, 2 and 3"), ("quotient", "The result of a division"), ("remainder", "What is left over after dividing"), ("number line", "A line on which numbers are placed in order")],
    [],
    _sort("Proper, improper or mixed?", "Decide whether each number is a proper fraction, an improper fraction or a mixed number, then sort it.", ["Proper fraction", "Improper fraction", "Mixed number"], [("3/5", 0), ("9/4", 1), ("2 1/3", 2), ("7/7", 1), ("1/10", 0), ("4 5/6", 2), ("15/8", 1), ("11/12", 0)]),
    [
        _wc("Write 7/2 as a mixed number.", ["3 1/2", "2 1/2", "3 2/1"], 0, "7 \u00f7 2 = 3 remainder 1."),
        _wc("Write 1 3/4 as an improper fraction.", ["5/4", "7/4", "4/7"], 1, "1 x 4 + 3 = 7."),
        _wc("How many quarters are in 3 wholes?", ["3", "7", "12"], 2, "3 x 4 = 12."),
        _wc("Which mixed number is equal to 2 6/8?", ["2 3/4", "2 2/3", "3 1/4"], 0, "Divide the top and bottom of 6/8 by 2."),
        _wc("Which of these is between 2 and 3?", ["7/2", "5/2", "9/2"], 1, "5/2 = 2 1/2."),
        _wc("What is 24/6?", ["6", "4", "144"], 1, "24 \u00f7 6 = 4."),
        _wc("Which is greater: 5/4 or 1 1/2?", ["5/4", "1 1/2", "They are equal"], 1, "1 1/2 = 6/4, which is more than 5/4."),
        _wc("Is 9/9 a proper fraction?", ["Yes, it is less than 1", "No, it equals 1", "It is a mixed number"], 1, "9/9 is one whole, so it is an improper fraction."),
    ],
    [
        {"key": "partA", "label": "Part A: classify", "hint": "Compare the top with the bottom."},
        {"key": "partB", "label": "Part B: improper to mixed", "hint": "Divide, then write the remainder over the same denominator."},
        {"key": "partC", "label": "Part C: mixed to improper", "hint": "Whole times bottom, plus top."},
        {"key": "partD", "label": "Part D: simplest form", "hint": "Convert, then simplify the fraction part."},
        {"key": "partE", "label": "Part E: whole numbers", "hint": "Whole number times the denominator."},
        {"key": "partF", "label": "Part F: compare and order", "hint": "Wholes first, then the fraction parts."},
        {"key": "partG", "label": "Part G: spot the error", "hint": "What went wrong, and what is the correct answer?"},
        {"key": "taskA", "label": "Bake sale (a): each day", "hint": "Slices over 6, then convert and simplify."},
        {"key": "taskB", "label": "Bake sale (b): order the days", "hint": "Compare the mixed numbers."},
        {"key": "taskC", "label": "Bake sale (c): whole pies and leftovers", "hint": "Round up to the next whole pie, then subtract."},
        {"key": "taskD", "label": "Bake sale (d): the total", "hint": "Add the slices first, then convert."},
        {"key": "taskE", "label": "Bake sale (e): the student's mistake", "hint": "Two or three sentences about the fraction part."},
        {"key": "taskF", "label": "Bake sale (f): your own sale", "hint": "Pies cut into 8, four days, and an order."},
    ],
    ["Writing the quotient as the numerator instead of the remainder", "Multiplying the whole number by the numerator instead of the denominator", "Changing the denominator when converting", "Leaving the fraction part unsimplified", "Comparing only the fraction parts when the whole numbers differ", "Skipping the check at the end"],
    ["Draw pies or bars and shade them to see the wholes and the leftover parts.", "Use a number line from 0 to 5 to place each answer.", "Make a one-page reference sheet with both conversion methods and one example each."],
    "Part A: 5/9 is proper; 9/5 is improper; 2 1/3 is a mixed number; 7/7 is improper (it equals 1); 1/8 is proper; 12/5 is improper. Part B: 7/3 = 2 1/3; 13/4 = 3 1/4; 22/5 = 4 2/5; 30/7 = 4 2/7; 41/8 = 5 1/8; 59/10 = 5 9/10. Part C: 11/5; 15/4; 37/7; 37/8; 61/10; 23/12. Part D: 14/6 = 2 2/6 = 2 1/3; 26/8 = 3 2/8 = 3 1/4; 45/12 = 3 9/12 = 3 3/4; 40/16 = 2 8/16 = 2 1/2. Part E: 24/6 = 4; 35/7 = 5; 3 = 12/4; 5 = 15/3; 7 = 56/8. Part F: 2 3/4 is greater than 2 2/3 (9/12 against 8/12); 3 1/5 and 16/5 are equal because 16/5 = 3 1/5; 7/2 = 3 1/2, which is greater than 3 1/3; from least to greatest the order is 9/4 (2 1/4), 7/3 (2 1/3), 2 1/2, 2 2/3. Part G: 13/4 = 3 1/4, because 13 \u00f7 4 = 3 remainder 1 and the remainder, not 3, goes on top; 2 3/5 = 13/5 because the whole number is multiplied by the denominator, 2 x 5 + 3 = 13; 3 1/2 is greater than 3 1/3 because with the same numerator the smaller denominator gives bigger pieces (3/6 against 2/6); 14/4 = 3 2/4 can still be simplified, so it is 3 1/2. Bake sale (a): Monday 27/6 = 4 3/6 = 4 1/2; Tuesday 35/6 = 5 5/6; Wednesday 19/6 = 3 1/6; Thursday 44/6 = 7 2/6 = 7 1/3. (b): from fewest to most the order is Wednesday (3 1/6), Monday (4 1/2), Tuesday (5 5/6), Thursday (7 1/3). (c): Monday 5 pies with 1/2 of a pie left; Tuesday 6 pies with 1/6 left; Wednesday 4 pies with 5/6 left; Thursday 8 pies with 2/3 left. (d): 27 + 35 + 19 + 44 = 125 slices, so 125/6 pies, and 125 \u00f7 6 = 20 remainder 5, so 20 5/6 pies; check 20 x 6 + 5 = 125. (e): the fraction part 3/6 can still be simplified, because 3 and 6 share a factor of 3. The simplest form is 4 1/2. (f): accept any valid bake sale where each conversion is correct and checked and the order is correct. Quiz answers: 8/3; 1 and 2; 2 3/4; 19/8; 20/5; 2 1/3; 3 1/2; 53/10; 2 2/3; 7 1/3. Extension: the improper fraction halfway between 2 and 3 is 5/2. An improper fraction with a denominator of 7 between 3 1/2 and 4 is 25/7, 26/7 or 27/7, because 3 1/2 is 24.5/7 and 4 is 28/7. The improper fractions with a denominator of 5 strictly between 1 and 3 are 6/5 to 14/5, which is 9 fractions. The numerator of the improper fraction from a mixed number is whole number x denominator + numerator, and since the whole number is at least 1 this is at least the denominator plus the fraction's numerator, which is always more than the denominator.",
)
