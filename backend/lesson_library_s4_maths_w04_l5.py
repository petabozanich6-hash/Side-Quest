"""Stage 4 Mathematics, Week 4 Lesson 5: Fortnightly mini exam, weeks 3 and 4 (Integers and Fractions).
All written work is typed inside the lesson. Replaces the placeholder with seed_key s4-maths-w04-l5.
Plan slot: lesson 5 of an even-numbered week is a 45 minute mini exam (see lesson_library_s4_plan.py). Same format as W2 L5.
The exam covers the integer skills used in Weeks 3 and 4 (comparing, adding, subtracting and multi-step problems) and W4 L1 to L4 (factors and multiples, equivalent fractions, simplest form, comparing and ordering, improper fractions and mixed numbers).
The integer questions are a general review because the W3 lesson files were not re-read when this exam was written. Check them against the W3 content when the unit is reviewed.
Pass mark stays at 90 percent from the plan. No video is attached.
Outcome codes MA4-INT-C-01, MA4-FRC-C-01 and MAO-WM-01 are from the draft mapping and should be re-checked against NESA.
To check: that build_s4 gives this lesson the 45 minute duration for the fifth slot, as the placeholder had, and that the unit name below matches the placeholder.
"""
from lesson_library_s4_builder import build_s4, _q, _step, _sort, _wc

LESSON = build_s4(
    "s4-maths-w04-l5",
    "Week 4, Lesson 5: Fortnightly Mini Exam, Weeks 3 and 4 (Integers and Fractions)",
    "Show what you know about integers and fractions. This mini exam covers adding and subtracting integers, factors and multiples, equivalent fractions, simplest form, comparing and ordering fractions, and improper fractions and mixed numbers.",
    "Fractions, decimals and percentages",
    ["MA4-INT-C-01", "MA4-FRC-C-01", "MAO-WM-01"],
    {
        "MA4-INT-C-01": "Secondary. Compares, orders, adds and subtracts integers and solves multi-step problems with a running total and a check.",
        "MA4-FRC-C-01": "Primary. Uses factors and multiples, finds equivalent fractions, simplifies, compares and orders fractions and converts between improper fractions and mixed numbers.",
        "MAO-WM-01": "Working mathematically: selects strategies, checks answers a second way, explains reasoning and corrects errors under timed conditions.",
    },
    "We are showing what we have learned about integers and fractions in Weeks 3 and 4, and finding which ideas need more practice.",
    ["I can add and subtract integers and solve a multi-step problem.", "I can find the HCF and LCM of two numbers.", "I can find a missing number in equivalent fractions.", "I can write a fraction in simplest form.", "I can compare and order fractions.", "I can change between improper fractions and mixed numbers.", "I can explain my thinking and spot a mistake."],
    ["integer", "factor", "multiple", "HCF", "LCM", "equivalent fractions", "simplest form", "common denominator", "improper fraction", "mixed number"],
    ["This lesson (everything you need is inside it)", "Paper and pencil for working out", "A printed number line and fraction wall (optional)", "A timer for 45 minutes (optional)"],
    "You have completed Week 3 on integers and Week 4 Lessons 1 to 4 on factors and multiples, equivalent fractions, simplest form, comparing and ordering fractions, and improper fractions and mixed numbers.",
    (
        "How the mini exam works. This is a 45 minute check on Weeks 3 and 4. Work on your own, without looking back at earlier lessons. The pass mark is 90 percent, so take your time and check each answer. If you do not pass, you can try again after reviewing the steps below.\n\n"
        "What is in it. Part 1 is a quick revision guide with six steps and a check question for each. Part 2 is the exam itself: 13 multiple choice questions (the quiz), then a short answer section and a problem solving section. Type your answers into the boxes.\n\n"
        "Exam strategies. Read each question twice. Write your working on paper, one line at a time. For every answer, ask whether it makes sense: is the sign right, is the fraction in simplest form, and is the mixed number's fraction part smaller than 1? If you are unsure, check with a second method such as a number line, cross products or working backwards.\n\n"
        "Quick reminders. a + (-b) = a - b and a - (-b) = a + b. The HCF is the biggest shared factor and the LCM is the smallest shared multiple. To make an equivalent fraction, do the same thing to the top and the bottom. To compare fractions, use a common denominator or cross products. Improper to mixed: divide, and the remainder goes over the same denominator. Mixed to improper: whole x bottom + top, over the same denominator."
    ),
    [
        _step("1", "Integers: adding and comparing", "Same signs add the sizes and keep the sign. Different signs subtract the sizes and take the sign of the larger one. Further left on the number line means smaller.\n\nCheck the sign of the answer.", "-8 + 3 = -5. Order -9, -4, 0, 2 from least to greatest.", "Opposites cancel.", ("What is -7 + 4?", ["3", "-3", "11", "-11"], 1, "The larger size is 7 and it is negative, and 7 - 4 = 3, so the answer is -3.")),
        _step("2", "Integers: subtracting and multi-step", "Subtracting a negative is the same as adding a positive. For a longer problem, use a running total and check by grouping the positives and the negatives.\n\nWork out brackets first.", "-5 - (-9) = -5 + 9 = 4.", "Subtract a negative: add the positive.", ("What is -5 - (-9)?", ["-14", "14", "4", "-4"], 2, "-5 - (-9) = -5 + 9 = 4.")),
        _step("3", "Factors and multiples", "List the factors or multiples of each number. The HCF is the highest shared factor and the LCM is the lowest shared multiple.\n\nThe HCF is never bigger than the smaller number.", "The HCF of 12 and 18 is 6, and the LCM is 36.", "Shared factor, shared multiple.", ("What is the HCF of 12 and 18?", ["3", "6", "36", "2"], 1, "The factors of 12 are 1, 2, 3, 4, 6, 12 and of 18 are 1, 2, 3, 6, 9, 18, so the highest shared one is 6.")),
        _step("4", "Equivalent fractions and simplest form", "Do the same to the top and the bottom. To simplify, divide both by the HCF.\n\nCheck that the top and bottom share nothing except 1.", "18/30: the HCF is 6, so 18/30 = 3/5.", "Divide by the HCF.", ("What is 18/30 in simplest form?", ["9/15", "6/10", "3/5", "1/2"], 2, "The HCF of 18 and 30 is 6, so 18/30 = 3/5.")),
        _step("5", "Comparing and ordering fractions", "Use a common denominator or cross products. Order the numerators, then write the answer with the original fractions.\n\nCheck with a second method.", "5/8 and 3/5: 5 x 5 = 25 and 8 x 3 = 24, so 5/8 is greater.", "Same denominator, or cross products.", ("Which is greater: 5/8 or 3/5?", ["3/5", "5/8", "They are equal", "Cannot tell"], 1, "5 x 5 = 25 is greater than 8 x 3 = 24.")),
        _step("6", "Improper fractions and mixed numbers", "Improper to mixed: divide, and the remainder goes over the same denominator. Mixed to improper: whole x bottom + top.\n\nCheck by working back.", "23/6: 23 \u00f7 6 = 3 remainder 5, so 23/6 = 3 5/6.", "Divide, or multiply and add.", ("Write 23/6 as a mixed number.", ["3 1/6", "3 5/6", "4 1/6", "2 5/6"], 1, "23 \u00f7 6 = 3 remainder 5.")),
    ],
    (
        "How to answer a longer exam question. Read these two model answers.\n\n"
        "Model 1, integers. A lift in a building starts at floor -3 (the car park). It goes up 8 floors, then down 5 floors, then down 4 floors. Where does it finish?\n"
        "Step 1, write one calculation: -3 + 8 - 5 - 4.\n"
        "Step 2, running total: -3 + 8 = 5, 5 - 5 = 0, 0 - 4 = -4.\n"
        "Step 3, check by grouping: the positives are 8 and the negatives are -3, -5 and -4, which total -12, and 8 + (-12) = -4. It agrees.\n"
        "Step 4, answer in a sentence: the lift finishes at floor -4.\n\n"
        "Model 2, fractions. In a class survey, 36 of 48 students walk to school. What fraction is this in simplest form, is it more than 2/3, and what is it as a mixed number if three classes of 48 each have this fraction?\n"
        "Step 1, simplify: the HCF of 36 and 48 is 12, so 36/48 = 3/4.\n"
        "Step 2, compare with 2/3 using cross products: 3 x 3 = 9 and 4 x 2 = 8, so 3/4 is greater than 2/3.\n"
        "Step 3, check with a common denominator: 3/4 = 9/12 and 2/3 = 8/12. It agrees.\n"
        "Step 4, three classes: 3 x 3/4 = 9/4 of a class, and 9 \u00f7 4 = 2 remainder 1, so 2 1/4 classes.\n"
        "Step 5, answer in a sentence: 3/4 of the students walk, which is more than 2/3, and three such groups make 2 1/4 classes.\n\n"
        "Good work, {{name}}. In the exam, use the same pattern: write the calculation, solve it, check it, then answer in a sentence."
    ),
    (
        "Part 2, Section B (short answers). Type your answers in the practice boxes. B1: put -4, 2, -9, 0, -1 in order from least to greatest. B2: work out -8 + 5, 6 + (-11), -3 - (-7) and 4 - 10. B3: rewrite 7 - 15 + (-2) - (-6) as additions, group the positives and negatives, and find the answer. B4: find the HCF and the LCM of 12 and 30. B5: find the missing number in each: 3/5 = ?/20 and 18/45 = 2/?. B6: write each in simplest form: 24/60, 45/72 and 36/48. B7: compare each pair and say which is greater, showing a common denominator or cross products: 7/12 and 5/8, and 4/9 and 3/7. B8: order 3/4, 2/3, 7/12 and 5/6 from least to greatest. B9: write 29/6 as a mixed number and write 3 4/7 as an improper fraction. B10: a student says 3/8 is bigger than 3/5 because 8 is bigger than 5. Explain the mistake and say which fraction is greater."
    ),
    (
        "Part 2, Section C (problem solving): School Camp. A camp has 60 students. 24 choose kayaking, 15 choose climbing, 9 choose archery and 12 choose hiking. Type your answers in the boxes.\n\n"
        "C(a) Write each activity as a fraction of the 60 students in simplest form, and check that the four numbers of students add to 60.\n"
        "C(b) Order the four activities from the smallest fraction to the greatest fraction.\n"
        "C(c) Each activity runs in groups of 8 students. For each activity write the number of groups as an improper fraction and as a mixed number in simplest form, then say how many whole groups are needed so that every student has a place.\n"
        "C(d) At the camp the temperature at 6 am is -3 degrees. It rises 9 degrees by noon, falls 5 degrees by the evening and then falls 6 degrees overnight. Write the whole day as one calculation and find the final temperature. State the highest and lowest temperatures and the difference between them.\n"
        "C(e) A student says: '24/60 simplifies to 12/30, and that is the simplest form.' Explain in two or three sentences what the mistake is and give the correct answer."
    ),
    "Type your answers in the practice boxes. Show your working for every question and write full sentences for the explanation questions.",
    "Did I check the sign of each integer answer, put each fraction in simplest form, use a second method to check a comparison, keep the denominator when converting a mixed number, show my working, and explain my reasoning in sentences?",
    [
        _q("Which list is in order from least to greatest?", ["-9, -4, 0, 2", "-4, -9, 0, 2", "2, 0, -4, -9", "-9, 0, -4, 2"], 0, "The least is -9, then -4, then 0, then 2."),
        _q("What is -8 + 3?", ["5", "-5", "11", "-11"], 1, "The larger size is 8 and it is negative, and 8 - 3 = 5."),
        _q("What is -4 - (-9)?", ["-13", "13", "5", "-5"], 2, "-4 + 9 = 5."),
        _q("A temperature starts at -7 degrees, rises 10 degrees and then falls 8 degrees. What is it now?", ["5", "-5", "-25", "25"], 1, "-7 + 10 - 8 = -5."),
        _q("What is the HCF of 18 and 30?", ["3", "6", "90", "2"], 1, "6 is the biggest number that divides both."),
        _q("What is the LCM of 4 and 10?", ["40", "20", "14", "2"], 1, "The multiples of 4 are 4, 8, 12, 16, 20 and of 10 are 10, 20, so the LCM is 20."),
        _q("What is 24/60 in simplest form?", ["12/30", "6/15", "2/5", "4/10"], 2, "The HCF of 24 and 60 is 12."),
        _q("5/6 = ?/30. What is the missing numerator?", ["24", "25", "30", "5"], 1, "6 x 5 = 30, so 5 x 5 = 25."),
        _q("Which is greater: 5/8 or 3/5?", ["3/5", "5/8", "They are equal", "Cannot tell"], 1, "Over 40, 5/8 = 25/40 and 3/5 = 24/40."),
        _q("Which list shows 3/4, 2/3 and 7/12 from least to greatest?", ["3/4, 2/3, 7/12", "7/12, 2/3, 3/4", "2/3, 7/12, 3/4", "7/12, 3/4, 2/3"], 1, "Over 12 they are 9, 8 and 7, so the order is 7, 8, 9. Well done, {{name}}."),
        _q("Write 23/6 as a mixed number.", ["3 1/6", "3 5/6", "4 1/6", "2 5/6"], 1, "23 \u00f7 6 = 3 remainder 5."),
        _q("Write 3 4/7 as an improper fraction.", ["12/7", "21/7", "25/7", "28/7"], 2, "3 x 7 + 4 = 25."),
        _q("Which of these is NOT equal to 3/4?", ["6/8", "9/12", "12/20", "15/20"], 2, "12/20 simplifies to 3/5."),
    ],
    "Type your answers in the practice boxes and submit them. Include full sentences for B10, C(c), C(d) and C(e).",
    "Extension: write your own mini exam question. Make up a three-step problem that uses a fraction of a group, a fraction comparison and a mixed number. Write the calculation, solve it, check it a second way, and write a mark scheme saying how many marks each part is worth and why.",
    [("integer", "A whole number that can be positive, negative or zero"), ("factor", "A whole number that divides another exactly"), ("multiple", "The result of multiplying a number by a whole number"), ("HCF", "The highest common factor of two or more numbers"), ("LCM", "The lowest common multiple of two or more numbers"), ("equivalent fractions", "Fractions that show the same amount"), ("simplest form", "A fraction whose top and bottom share no factor except 1"), ("common denominator", "A denominator that is the same for two or more fractions"), ("improper fraction", "A fraction of one whole or more, with the top at least as big as the bottom"), ("mixed number", "A whole number and a proper fraction together")],
    [],
    _sort("Less than, equal to or more than 1?", "Work out each number, then sort it by whether it is less than 1, equal to 1 or more than 1.", ["Less than 1", "Equal to 1", "More than 1"], [("7/5", 2), ("9/9", 1), ("3/8", 0), ("2 1/4", 2), ("12/12", 1), ("5/6", 0), ("17/16", 2), ("11/13", 0)]),
    [
        _wc("Which is smaller: -6 or -1?", ["-6", "-1", "They are equal"], 0, "-6 is further left on the number line."),
        _wc("What is -3 + (-5)?", ["8", "-8", "-2"], 1, "Same signs: add the sizes, keep the sign."),
        _wc("What is 4 - (-6)?", ["-2", "10", "2"], 1, "4 + 6 = 10."),
        _wc("What is the HCF of 8 and 20?", ["2", "4", "8"], 1, "4 is the biggest number that divides both."),
        _wc("What is 12/16 in simplest form?", ["6/8", "3/4", "1/4"], 1, "Divide the top and bottom by 4."),
        _wc("Which is greater: 2/3 or 3/5?", ["3/5", "2/3", "They are equal"], 1, "10/15 is greater than 9/15."),
        _wc("Write 9/4 as a mixed number.", ["2 3/4", "2 1/4", "1 5/4"], 1, "9 \u00f7 4 = 2 remainder 1."),
        _wc("Write 1 1/2 as an improper fraction.", ["2/3", "3/2", "1/2"], 1, "1 x 2 + 1 = 3."),
    ],
    [
        {"key": "b1", "label": "B1: order", "hint": "-4, 2, -9, 0, -1 from least to greatest."},
        {"key": "b2", "label": "B2: integers", "hint": "-8 + 5, 6 + (-11), -3 - (-7), 4 - 10."},
        {"key": "b3", "label": "B3: rewrite and group", "hint": "7 - 15 + (-2) - (-6) as additions, group, combine."},
        {"key": "b4", "label": "B4: HCF and LCM", "hint": "List the factors and multiples of 12 and 30."},
        {"key": "b5", "label": "B5: missing numbers", "hint": "3/5 = ?/20 and 18/45 = 2/?."},
        {"key": "b6", "label": "B6: simplest form", "hint": "24/60, 45/72 and 36/48."},
        {"key": "b7", "label": "B7: compare", "hint": "7/12 and 5/8, and 4/9 and 3/7. Show your method."},
        {"key": "b8", "label": "B8: order fractions", "hint": "3/4, 2/3, 7/12 and 5/6 from least to greatest."},
        {"key": "b9", "label": "B9: convert", "hint": "29/6 as a mixed number and 3 4/7 as an improper fraction."},
        {"key": "b10", "label": "B10: spot the error", "hint": "3/8 against 3/5. What went wrong? Which is greater?"},
        {"key": "c1", "label": "C(a): fractions of the camp", "hint": "Each activity over 60, then simplify, and check the total."},
        {"key": "c2", "label": "C(b): order the activities", "hint": "Use a common denominator of 20."},
        {"key": "c3", "label": "C(c): groups of 8", "hint": "Students over 8, mixed number, then round up."},
        {"key": "c4", "label": "C(d): temperature", "hint": "One calculation, then highest, lowest and difference."},
        {"key": "c5", "label": "C(e): explain", "hint": "Two or three sentences about the HCF."},
    ],
    ["Treating subtracting a negative as subtracting a positive", "Giving the wrong sign when adding integers with different signs", "Mixing up the HCF and the LCM", "Doing something to the top of a fraction but not the bottom", "Comparing only the denominators or only the numerators", "Writing the quotient instead of the remainder in a mixed number", "Not checking the answer or the sign"],
    ["Make a one-page summary of the six steps with one example each before you start.", "Draw a fraction wall and a number line to check any answer you are unsure of.", "Practise with the timer on for 45 minutes and then mark your own work."],
    "Quiz answers: -9, -4, 0, 2; -5; 5; -5; 6; 20; 2/5; 25; 5/8; 7/12, 2/3, 3/4; 3 5/6; 25/7; 12/20. Section B: B1: -9, -4, -1, 0, 2. B2: -3, -5, 4, -6. B3: 7 + (-15) + (-2) + 6; positives 13, negatives -17, answer -4. B4: the factors of 12 are 1, 2, 3, 4, 6, 12 and of 30 are 1, 2, 3, 5, 6, 10, 15, 30, so the HCF is 6; the multiples of 12 are 12, 24, 36, 48, 60 and of 30 are 30, 60, so the LCM is 60. B5: 12 (since 5 x 4 = 20, so 3 x 4 = 12) and 5 (since 18 \u00f7 9 = 2 and 45 \u00f7 9 = 5). B6: 24/60 = 2/5; 45/72 = 5/8; 36/48 = 3/4. B7: over 24, 7/12 = 14/24 and 5/8 = 15/24, so 5/8 is greater; 4 x 7 = 28 and 9 x 3 = 27, so 4/9 is greater. B8: over 12 they are 9, 8, 7 and 10, so the order is 7/12, 2/3, 3/4, 5/6. B9: 29/6 = 4 5/6 (29 \u00f7 6 = 4 remainder 5) and 3 4/7 = 25/7 (3 x 7 + 4 = 25). B10: with the same numerator, the fraction with the bigger denominator has smaller pieces, so 3/8 is less than 3/5. Over 40, 3/5 = 24/40 and 3/8 = 15/40, so 3/5 is greater. Section C: C(a): kayaking 24/60 = 2/5, climbing 15/60 = 1/4, archery 9/60 = 3/20 and hiking 12/60 = 1/5, and 24 + 15 + 9 + 12 = 60 (over 20 these are 8, 5, 3 and 4, which add to 20). C(b): from smallest to greatest the order is archery 3/20, hiking 1/5, climbing 1/4, kayaking 2/5. C(c): kayaking 24/8 = 3 groups; climbing 15/8 = 1 7/8, so 2 groups; archery 9/8 = 1 1/8, so 2 groups; hiking 12/8 = 1 4/8 = 1 1/2, so 2 groups; that is 3 + 2 + 2 + 2 = 9 groups in total. C(d): -3 + 9 - 5 - 6 = -5 degrees. The highest temperature was 6 degrees (at noon), the lowest was -5 degrees (overnight) and the difference is 6 - (-5) = 11 degrees. Check by grouping: positives 9, negatives -3, -5 and -6 total -14, and 9 + (-14) = -5. C(e): 12/30 can still be divided by 6, because 12 and 30 share 6. The HCF of 24 and 60 is 12, not 2, so dividing by 12 in one step gives the simplest form 2/5. Pass mark is 90 percent.",
)
