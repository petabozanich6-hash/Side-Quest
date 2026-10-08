"""Stage 4 Mathematics, Week 4 Lesson 1: Fractions, decimals and percentages, Factors, multiples and equivalent fractions.
All written work is typed inside the lesson. Replaces the placeholder with seed_key s4-maths-w04-l1.
No video is attached: none has been found and tested for this topic yet. Add one in the video and link run.
Outcome codes MA4-FRC-C-01 and MAO-WM-01 are from the draft mapping and should be re-checked against NESA.
First lesson of the Fractions, decimals and percentages unit (Weeks 4 to 9). Prior learning is whole-number times tables and reading a fraction as part of a whole.
Week 4 Lesson 5 is a fortnightly mini exam covering Integers and Fractions, so this unit's lessons 1 to 4 in Week 4 are L1 to L4.
Next is W4 L2, simplifying fractions.
"""
from lesson_library_s4_builder import build_s4, _q, _step, _sort, _wc

LESSON = build_s4(
    "s4-maths-w04-l1",
    "Week 4, Lesson 1: Factors, Multiples and Equivalent Fractions",
    "Start the Fractions unit by learning the number tools it depends on: factors, multiples, the highest common factor and the lowest common multiple. Then use them to make and check equivalent fractions.",
    "Fractions, decimals and percentages",
    ["MA4-FRC-C-01", "MAO-WM-01"],
    {
        "MA4-FRC-C-01": "Primary. Uses factors, multiples, the highest common factor and the lowest common multiple, and finds and checks equivalent fractions.",
        "MAO-WM-01": "Working mathematically: chooses a method, shows each step, checks a result a second way and explains an error.",
    },
    "We are learning to use factors and multiples to make and check equivalent fractions.",
    ["I can list the factors and multiples of a whole number.", "I can find the highest common factor of two numbers.", "I can find the lowest common multiple of two numbers.", "I can explain what equivalent fractions are.", "I can make an equivalent fraction by multiplying or dividing the top and bottom by the same number.", "I can find a missing number in a pair of equivalent fractions.", "I can check whether two fractions are equivalent."],
    ["factor", "multiple", "factor pair", "common factor", "highest common factor (HCF)", "lowest common multiple (LCM)", "numerator", "denominator", "equivalent fractions", "simplest form"],
    ["This lesson (everything you need is inside it)", "Paper and pencil", "A printed fraction wall or a drawing of one (optional)"],
    "You know your times tables, can multiply and divide whole numbers, and can read a fraction as a number of equal parts out of a whole.",
    (
        "Why this matters. Almost every fraction skill uses factors and multiples. To simplify a fraction you divide by a common factor. To add fractions you need a common multiple of the denominators. This lesson builds both tools and then uses them.\n\n"
        "Factors. A factor of a number divides it exactly with nothing left over. The factors of 24 are 1, 2, 3, 4, 6, 8, 12 and 24. They come in pairs that multiply to 24: 1 x 24, 2 x 12, 3 x 8 and 4 x 6.\n\n"
        "Multiples. A multiple of a number is what you get when you multiply it by a whole number. The multiples of 6 are 6, 12, 18, 24, 30 and so on, and they never stop.\n\n"
        "Highest common factor. The common factors of two numbers are the factors they share. The factors of 12 are 1, 2, 3, 4, 6 and 12. The factors of 18 are 1, 2, 3, 6, 9 and 18. They share 1, 2, 3 and 6, so the highest common factor (HCF) is 6.\n\n"
        "Lowest common multiple. The common multiples of two numbers are the multiples they share. The multiples of 4 are 4, 8, 12, 16, 20, 24 and the multiples of 6 are 6, 12, 18, 24. They share 12 and 24, so the lowest common multiple (LCM) is 12.\n\n"
        "Equivalent fractions. Equivalent fractions are different names for the same amount. 1/2, 2/4 and 3/6 are all the same size. To make one, multiply or divide the numerator and the denominator by the same non-zero number: 3/5 x (4/4) = 12/20, and 18/24 \u00f7 (6/6) = 3/4.\n\n"
        "Checking. Two fractions a/b and c/d are equivalent when a x d = b x c. For 2/3 and 8/12, 2 x 12 = 24 and 3 x 8 = 24, so they are equivalent."
    ),
    [
        _step("1", "Factors and factor pairs", "Find factors in pairs. Start at 1 and test each whole number in turn until the pairs meet.\n\nWrite them in order and check that each pair multiplies to the number.", "The factors of 24 are 1, 2, 3, 4, 6, 8, 12 and 24, from the pairs 1 x 24, 2 x 12, 3 x 8 and 4 x 6.", "A factor divides exactly.", ("Which of these is NOT a factor of 18?", ["6", "9", "4", "3"], 2, "18 \u00f7 4 = 4.5, so 4 does not divide 18 exactly.")),
        _step("2", "Multiples", "Count up in steps of the number. Every multiple is the number times 1, 2, 3 and so on.\n\nMultiples are always at least as big as the number.", "The multiples of 6 are 6, 12, 18, 24 and 30.", "Multiples go on forever.", ("Which of these is a multiple of 7?", ["27", "36", "35", "45"], 2, "5 x 7 = 35.")),
        _step("3", "Common factors and the HCF", "List the factors of each number, find the ones they share and pick the biggest.\n\nThe HCF is at least 1 and at most the smaller number.", "12 has 1, 2, 3, 4, 6, 12 and 18 has 1, 2, 3, 6, 9, 18. The common factors are 1, 2, 3 and 6, so the HCF is 6.", "Highest shared factor.", ("What is the HCF of 16 and 24?", ["4", "8", "16", "2"], 1, "The factors of 16 are 1, 2, 4, 8, 16 and of 24 are 1, 2, 3, 4, 6, 8, 12, 24. The highest shared one is 8.")),
        _step("4", "Common multiples and the LCM", "List multiples of each number until one appears in both lists. The first match is the LCM.\n\nThe LCM is at least as big as the larger number.", "The multiples of 4 are 4, 8, 12 and of 6 are 6, 12. The LCM of 4 and 6 is 12.", "Lowest shared multiple.", ("What is the LCM of 6 and 8?", ["12", "48", "24", "14"], 2, "The multiples of 6 are 6, 12, 18, 24 and of 8 are 8, 16, 24. The first shared one is 24.")),
        _step("5", "What equivalent fractions are", "Equivalent fractions name the same amount in pieces of different sizes. On a fraction wall they line up exactly.\n\nThe amount stays the same, but the number of pieces changes.", "1/2 = 2/4 = 3/6 = 4/8. Each is half of the whole.", "Same amount, different name.", ("Which fraction is equivalent to 2/3?", ["4/6", "3/4", "2/6", "4/9"], 0, "2/3 x 2/2 = 4/6.")),
        _step("6", "Making equivalent fractions by multiplying", "Multiply the numerator and the denominator by the same number. The fraction is multiplied by 1, so the amount does not change.\n\nFind the multiplier by comparing the denominators.", "3/5 = ?/20. 5 x 4 = 20, so multiply the top by 4 as well: 3 x 4 = 12, so 3/5 = 12/20.", "Do the same to the top and the bottom.", ("3/4 = ?/20. What is the missing numerator?", ["12", "15", "16", "5"], 1, "4 x 5 = 20, so 3 x 5 = 15.")),
        _step("7", "Dividing and checking", "Divide the numerator and the denominator by the same common factor. Check with the cross products a x d and b x c.\n\nIf both cross products are the same, the fractions are equivalent.", "18/24 = 3/4 because 18 \u00f7 6 = 3 and 24 \u00f7 6 = 4. Check: 18 x 4 = 72 and 24 x 3 = 72.", "Divide by a common factor.", ("8/12 = 2/?. What is the missing denominator?", ["6", "3", "4", "2"], 1, "8 \u00f7 4 = 2, so 12 \u00f7 4 = 3.")),
    ],
    (
        "Scenario: At a pizza night, Ava eats 6 slices of a pizza cut into 8 equal slices. Ben eats 9 slices of an identical pizza cut into 12 equal slices. Who ate more pizza?\n\n"
        "Step 1, understand. Ava ate 6/8 of her pizza and Ben ate 9/12 of his. The slices are different sizes, so we cannot just compare 6 and 9.\n\n"
        "Step 2, divide by the HCF. The factors of 6 are 1, 2, 3, 6 and of 8 are 1, 2, 4, 8, so the HCF is 2 and 6/8 = 3/4. The factors of 9 are 1, 3, 9 and of 12 are 1, 2, 3, 4, 6, 12, so the HCF is 3 and 9/12 = 3/4.\n\n"
        "Step 3, compare. Both are 3/4, so they ate the same amount.\n\n"
        "Step 4, check with a common denominator. The LCM of 8 and 12 is 24. 6/8 = 18/24 (multiply by 3) and 9/12 = 18/24 (multiply by 2). They match.\n\n"
        "Step 5, check with cross products. 6 x 12 = 72 and 8 x 9 = 72, so the fractions are equivalent.\n\n"
        "Good work, {{name}}. Each answer was checked in more than one way."
    ),
    (
        "Work through these on paper or in the practice boxes, one step per line. Part A (factors): list all the factors of 20, then of 36, then of 29. Is 7 a factor of 91? Is 8 a factor of 100? Part B (multiples): write the first six multiples of 9 and the first five multiples of 12. Is 84 a multiple of 7? List the multiples of 8 between 30 and 50. Part C (HCF and LCM): find the HCF of 12 and 30, 28 and 42, 15 and 16, and 36 and 48. Find the LCM of 4 and 10, 6 and 9, 5 and 7, and 12 and 18. Part D (equivalent by multiplying): find the missing number in 2/3 = ?/12, 5/6 = 15/?, 3/8 = ?/40 and 7/10 = 63/?. Write three fractions equivalent to 4/5. Part E (equivalent by dividing): find the missing number in 12/18 = ?/3, 20/50 = ?/5, 18/27 = 2/? and 45/60 = 3/?. Part F (same or different?): decide whether each pair is equivalent and show a check: 3/5 and 9/15, 4/7 and 8/15, 5/8 and 15/24, and 6/9 and 10/15. Part G (spot the error): each of these has a mistake. Say what went wrong and give a correct answer: 2/5 = 3/6 because 1 was added to the top and the bottom; 12/16 = 6/10 because the top was divided by 2 and 6 was taken from the bottom; the LCM of 6 and 4 is 24; the HCF of 18 and 24 is 3."
    ),
    (
        "Mission: Mosaic Floor. An artist designs a mosaic floor made of 48 equal square tiles. There are 18 blue tiles, 12 green tiles, 6 red tiles and the rest are white. Type your answers in the boxes.\n\n"
        "(a) Find the number of white tiles. Then write the fraction of the floor in each colour, first as a fraction of 48 and then in simplest form by dividing by the HCF.\n"
        "(b) A second floor has 64 tiles and uses the same fractions of each colour. Use equivalent fractions to find how many tiles of each colour it needs, and check that the four numbers add to 64.\n"
        "(c) Blue tiles are sold in boxes of 6 and green tiles in boxes of 8. The artist wants the same number of blue and green tiles using whole boxes. Find the smallest number of tiles of each colour and the number of boxes of each.\n"
        "(d) A border panel measures 60 cm by 84 cm. Find the side of the largest square tile that fits exactly with no cutting. Then find the shortest rail that can be made from whole strips of either 12 cm or 18 cm.\n"
        "(e) A student says: '18/48 simplifies to 9/24, and that is the simplest form.' Explain in two or three sentences what the mistake is and give the simplest form.\n"
        "(f) Design your own floor with 36 tiles and three colours. Write each colour as a fraction of 36 and in simplest form, and check that the numerators add to 36."
    ),
    "Type your answers in the practice boxes. Show each calculation, check with a second method where you can, and write full sentences for the explanation questions.",
    "Did I list factors and multiples in order, find the HCF and LCM correctly, do the same thing to the top and the bottom of each fraction, and check that fractions are equivalent?",
    [
        _q("Which of these is NOT a factor of 18?", ["6", "9", "4", "3"], 2, "18 \u00f7 4 is not a whole number."),
        _q("Which of these is a multiple of 7?", ["27", "36", "35", "45"], 2, "5 x 7 = 35."),
        _q("What is the HCF of 16 and 24?", ["4", "8", "16", "2"], 1, "8 is the biggest number that divides both."),
        _q("What is the LCM of 6 and 8?", ["12", "48", "24", "14"], 2, "24 is the first multiple of both."),
        _q("Which fraction is equivalent to 2/3?", ["4/6", "3/4", "2/6", "4/9"], 0, "Multiply the top and bottom by 2."),
        _q("3/4 = ?/20. What is the missing numerator?", ["12", "15", "16", "5"], 1, "4 x 5 = 20, so 3 x 5 = 15."),
        _q("8/12 = 2/?. What is the missing denominator?", ["6", "3", "4", "2"], 1, "Divide the top and bottom by 4."),
        _q("Which pair of fractions is equivalent?", ["2/5 and 3/6", "3/5 and 9/15", "1/4 and 2/6", "4/7 and 8/15"], 1, "3 x 15 = 45 and 5 x 9 = 45."),
        _q("What is 18/48 in simplest form?", ["9/24", "6/16", "3/8", "1/3"], 2, "The HCF of 18 and 48 is 6, so 18/48 = 3/8. Good work, {{name}}."),
        _q("What is the smallest number of tiles that can be made from whole boxes of 6 or whole boxes of 8?", ["14", "24", "48", "12"], 1, "The LCM of 6 and 8 is 24."),
    ],
    "Type your answers in the practice boxes and submit them. Include full sentences for parts (e) and (f).",
    "Extension: the family of 3/4. List every fraction equivalent to 3/4 with a denominator under 50, and describe the pattern in the numerators and denominators. Then find the fraction equivalent to 3/4 whose numerator and denominator add to 70. Next, explain why a fraction is in simplest form only when the HCF of its numerator and denominator is 1, and give two examples of your own.",
    [("factor", "A whole number that divides another exactly"), ("multiple", "The result of multiplying a number by a whole number"), ("factor pair", "Two factors that multiply to the number"), ("common factor", "A factor shared by two or more numbers"), ("highest common factor (HCF)", "The largest common factor"), ("lowest common multiple (LCM)", "The smallest common multiple"), ("equivalent fractions", "Fractions that show the same amount"), ("simplest form", "A fraction with no common factor in the top and bottom other than 1")],
    [],
    _sort("Factor, multiple or neither of 12?", "Decide whether each number is a factor of 12, a multiple of 12 or neither, then sort it.", ["Factor of 12", "Multiple of 12", "Neither"], [("3", 0), ("24", 1), ("5", 2), ("6", 0), ("36", 1), ("18", 2), ("4", 0), ("60", 1)]),
    [
        _wc("What is the HCF of 10 and 25?", ["5", "10", "50"], 0, "5 is the biggest shared factor."),
        _wc("What is the LCM of 3 and 5?", ["8", "15", "1"], 1, "3 x 5 = 15 and they share no factors."),
        _wc("1/2 = ?/10. What is the missing number?", ["2", "5", "10"], 1, "2 x 5 = 10, so 1 x 5 = 5."),
        _wc("6/8 = 3/?. What is the missing number?", ["3", "4", "2"], 1, "Divide the top and bottom by 2."),
        _wc("Which fraction is equivalent to 5/6?", ["10/12", "10/6", "5/12"], 0, "Multiply the top and bottom by 2."),
        _wc("Which fraction is in simplest form?", ["4/10", "3/8", "6/9"], 1, "3 and 8 share no factor other than 1."),
        _wc("What are the factors of 7?", ["1 and 7", "1, 7 and 14", "7 only"], 0, "7 is only divisible by 1 and itself."),
        _wc("What is 12/20 in simplest form?", ["6/10", "3/5", "4/5"], 1, "Divide the top and bottom by the HCF, 4."),
    ],
    [
        {"key": "partA", "label": "Part A: factors", "hint": "Find the factors in pairs."},
        {"key": "partB", "label": "Part B: multiples", "hint": "Count up in steps of the number."},
        {"key": "partC", "label": "Part C: HCF and LCM", "hint": "List the factors or multiples of each number."},
        {"key": "partD", "label": "Part D: equivalent by multiplying", "hint": "Find the multiplier from the two denominators."},
        {"key": "partE", "label": "Part E: equivalent by dividing", "hint": "Find the common factor to divide by."},
        {"key": "partF", "label": "Part F: same or different", "hint": "Use the cross products to check."},
        {"key": "partG", "label": "Part G: spot the error", "hint": "What went wrong, and what is a correct answer?"},
        {"key": "taskA", "label": "Mosaic (a): fractions of the floor", "hint": "Fraction of 48, then divide by the HCF."},
        {"key": "taskB", "label": "Mosaic (b): the 64-tile floor", "hint": "Make equivalent fractions with denominator 64."},
        {"key": "taskC", "label": "Mosaic (c): whole boxes", "hint": "Find the LCM of 6 and 8."},
        {"key": "taskD", "label": "Mosaic (d): tile and rail", "hint": "HCF for the tile, LCM for the rail."},
        {"key": "taskE", "label": "Mosaic (e): the student's mistake", "hint": "Two or three sentences about the HCF."},
        {"key": "taskF", "label": "Mosaic (f): your own floor", "hint": "Three colours, 36 tiles, and a check that they add to 36."},
    ],
    ["Adding the same number to the top and bottom of a fraction instead of multiplying", "Doing something to the top but not the bottom", "Mixing up the HCF and the LCM", "Stopping at a common factor that is not the highest one", "Leaving a fraction that can still be simplified", "Skipping the check at the end"],
    ["Draw a fraction wall to see why equivalent fractions are the same size.", "Write factor pairs in two columns so none are missed.", "Make a one-page reference sheet with HCF, LCM and equivalent fractions, each with one example."],
    "Part A: 20 has 1, 2, 4, 5, 10, 20; 36 has 1, 2, 3, 4, 6, 9, 12, 18, 36; 29 has only 1 and 29; 7 is a factor of 91 because 7 x 13 = 91; 8 is not a factor of 100 because 100 \u00f7 8 = 12.5. Part B: 9, 18, 27, 36, 45, 54; 12, 24, 36, 48, 60; 84 is a multiple of 7 because 7 x 12 = 84; the multiples of 8 between 30 and 50 are 32, 40, 48. Part C: HCF 6, 14, 1, 12; LCM 20, 18, 35, 36. Part D: 8; 18; 15; 90; for example 8/10, 12/15, 16/20. Part E: 2; 2; 3; 4. Part F: 3/5 and 9/15 are equivalent (3 x 15 = 45 = 5 x 9); 4/7 and 8/15 are not (4 x 15 = 60 but 7 x 8 = 56); 5/8 and 15/24 are equivalent (5 x 24 = 120 = 8 x 15); 6/9 and 10/15 are equivalent (both are 2/3). Part G: adding 1 to the top and bottom does not keep the same amount, so 2/5 is equivalent to 4/10 or 6/15, not 3/6; the top and bottom must be divided by the same number, so 12/16 = 6/8 (or 3/4); the LCM of 6 and 4 is 12, because 24 is a common multiple but not the lowest; 3 is a common factor of 18 and 24 but the highest is 6. Mosaic (a): there are 48 - 18 - 12 - 6 = 12 white tiles. Blue is 18/48 = 3/8, green is 12/48 = 1/4, red is 6/48 = 1/8 and white is 12/48 = 1/4. (b): the 64-tile floor has blue 3/8 = 24/64, green 1/4 = 16/64, red 1/8 = 8/64 and white 1/4 = 16/64, and 24 + 16 + 8 + 16 = 64. (c): the LCM of 6 and 8 is 24, so 24 tiles of each colour, which is 4 boxes of blue and 3 boxes of green. (d): the HCF of 60 and 84 is 12, so the largest tile has a side of 12 cm (5 tiles by 7 tiles). The LCM of 12 and 18 is 36, so the shortest rail is 36 cm. (e): 9/24 can still be divided by 3, which gives 3/8. The HCF of 18 and 48 is 6, not 2, so dividing by 6 in one step gives the simplest form 3/8. (f): accept any valid design where the numerators add to 36 and each fraction is correctly simplified. Quiz answers: 4; 35; 8; 24; 4/6; 15; 3; 3/5 and 9/15; 3/8; 24. Extension: the fractions are 6/8, 9/12, 12/16, 15/20, 18/24, 21/28, 24/32, 27/36, 30/40, 33/44 and 36/48. The numerators go up by 3 and the denominators go up by 4 each time. For the sum of 70, the numerator is 3k and the denominator is 4k, so 7k = 70, k = 10, and the fraction is 30/40. A fraction is in simplest form when the HCF of its numerator and denominator is 1, because if the HCF were bigger you could divide both by it. Accept any two valid examples.",
)
