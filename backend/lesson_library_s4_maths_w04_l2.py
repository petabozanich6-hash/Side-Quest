"""Stage 4 Mathematics, Week 4 Lesson 2: Fractions, decimals and percentages, Simplifying fractions.
All written work is typed inside the lesson. Replaces the placeholder with seed_key s4-maths-w04-l2.
No video is attached: none has been found and tested for this topic yet. Add one in the video and link run.
Outcome codes MA4-FRC-C-01 and MAO-WM-01 are from the draft mapping and should be re-checked against NESA.
Builds on W4 L1 (factors, multiples, HCF, equivalent fractions). Divisibility tests for 2, 3, 4, 5, 6, 9 and 10 are taught inside this lesson.
Fractions that simplify to whole numbers (such as 24/8) are included in a light way. Improper fractions and mixed numbers are taught fully in W4 L4.
Next is W4 L3, comparing and ordering fractions.
"""
from lesson_library_s4_builder import build_s4, _q, _step, _sort, _wc

LESSON = build_s4(
    "s4-maths-w04-l2",
    "Week 4, Lesson 2: Simplifying Fractions",
    "Learn to write a fraction in its simplest form by dividing the top and bottom by common factors. Use divisibility tests to spot those factors quickly, and check that nothing is left to simplify.",
    "Fractions, decimals and percentages",
    ["MA4-FRC-C-01", "MAO-WM-01"],
    {
        "MA4-FRC-C-01": "Primary. Simplifies fractions by dividing by common factors and the highest common factor, and recognises simplest form.",
        "MAO-WM-01": "Working mathematically: chooses an efficient method, shows each step, checks a result by working back and explains an error.",
    },
    "We are learning to write fractions in simplest form.",
    ["I can say what simplest form means.", "I can use divisibility tests to find common factors.", "I can simplify a fraction by dividing by the HCF.", "I can simplify a fraction in more than one step.", "I can tell whether a fraction is in simplest form.", "I can write a part of a group or a measurement as a simple fraction.", "I can check a simplified fraction by working back."],
    ["simplest form", "simplify", "common factor", "highest common factor (HCF)", "divisible", "divisibility test", "numerator", "denominator", "equivalent fractions"],
    ["This lesson (everything you need is inside it)", "Paper and pencil", "A printed fraction wall or a drawing of one (optional)"],
    "You can list factors, find the highest common factor of two numbers and make equivalent fractions by multiplying or dividing the top and bottom by the same number (Week 4 Lesson 1).",
    (
        "Why this matters. A fraction like 48/60 is hard to picture and hard to compare. In simplest form it is 4/5, which is much easier to read. Simplifying also makes answers in later fraction work neat and easy to check.\n\n"
        "Simplest form. A fraction is in simplest form when the numerator and the denominator have no common factor except 1. 3/4 is in simplest form. 6/8 is not, because both numbers can be divided by 2.\n\n"
        "How to simplify. Divide the numerator and the denominator by the same common factor. If you use the highest common factor (HCF), you finish in one step: 18/48, with an HCF of 6, becomes 18 \u00f7 6 over 48 \u00f7 6 = 3/8. If you use a smaller factor, repeat until nothing is left to divide by.\n\n"
        "Divisibility tests. A number is divisible by 2 if it is even, by 3 if its digits add to a multiple of 3, by 5 if it ends in 0 or 5, by 10 if it ends in 0, by 9 if its digits add to a multiple of 9, and by 4 if its last two digits make a number divisible by 4. It is divisible by 6 if it passes the tests for 2 and 3. For 45/60, both end in 0 or 5, so divide by 5. Both have digits adding to a multiple of 3 (4 + 5 = 9, 6 + 0 = 6), so divide by 3 as well, or by 15.\n\n"
        "Checking simplest form. Ask whether the top and bottom still share a factor other than 1. If the HCF is 1, the fraction is in simplest form. To check a simplified fraction, multiply back: 3/8 x (6/6) = 18/48.\n\n"
        "Parts of a group and measurements. To write 15 out of 40 as a fraction, put 15 over 40 and simplify to 3/8. When there are units, change both to the same unit first: 250 g of 1 kg is 250/1000 = 1/4.\n\n"
        "Whole numbers. If the denominator divides the numerator exactly, the fraction is a whole number: 24/8 = 3 and 10/10 = 1."
    ),
    [
        _step("1", "What simplest form means", "A fraction is in simplest form when the top and bottom share no factor except 1. You cannot divide both by anything bigger than 1.\n\nSimplest form is the shortest name for the amount.", "7/12 is in simplest form because 7 and 12 share only 1. 10/15 is not, because both divide by 5.", "No common factor except 1.", ("Which of these fractions is in simplest form?", ["6/9", "7/12", "10/15", "8/20"], 1, "7 and 12 share no factor other than 1, but the others share 3, 5 and 4.")),
        _step("2", "Divisibility tests", "Use the tests to find common factors quickly. Digits that add to a multiple of 3 means divisible by 3, and ending in 0 or 5 means divisible by 5.\n\nTest the top and the bottom with the same rule.", "45/60: both end in 0 or 5 so divide by 5. The digit sums are 9 and 6, so both are divisible by 3.", "Test top and bottom.", ("Which of these numbers is divisible by 3?", ["124", "231", "415", "502"], 1, "2 + 3 + 1 = 6, which is a multiple of 3.")),
        _step("3", "Simplify using the HCF", "Find the HCF of the numerator and denominator and divide both by it. You finish in one step.\n\nList the factors if you are not sure.", "18/48: the HCF is 6. 18 \u00f7 6 = 3 and 48 \u00f7 6 = 8, so 18/48 = 3/8.", "Divide by the HCF.", ("What is 24/36 in simplest form?", ["12/18", "6/9", "2/3", "4/6"], 2, "The HCF of 24 and 36 is 12, so 24/36 = 2/3.")),
        _step("4", "Simplify in steps", "If you cannot see the HCF, divide by any common factor, then look again. Repeat until the top and bottom share nothing except 1.\n\nEvery step keeps the same amount.", "72/96 \u00f7 2 = 36/48, then \u00f7 2 = 18/24, then \u00f7 6 = 3/4.", "Keep dividing until nothing is left.", ("Simplify 40/100 in steps. What is the simplest form?", ["4/10", "2/5", "20/50", "1/2"], 1, "40/100 = 4/10 = 2/5, and 2 and 5 share only 1.")),
        _step("5", "Checking for simplest form", "Check whether the top and bottom still share a factor. If they do, the fraction can be simplified more.\n\nDo this check on every answer.", "14/21 is not in simplest form because both divide by 7. It simplifies to 2/3.", "HCF of 1 means simplest.", ("Which of these is NOT in simplest form?", ["5/9", "8/15", "14/21", "11/12"], 2, "14 and 21 both divide by 7.")),
        _step("6", "Parts of a group", "Write the part over the total and then simplify. Make sure the top and bottom use the same unit.\n\nThe total goes on the bottom.", "15 of 40 students is 15/40. The HCF is 5, so it is 3/8.", "Part over whole, then simplify.", ("12 of 30 counters are blue. What is the fraction in simplest form?", ["6/15", "2/5", "4/10", "1/3"], 1, "12/30 has an HCF of 6, so it is 2/5.")),
        _step("7", "Measurements and whole numbers", "Change both amounts to the same unit, then write one over the other and simplify. If the bottom divides the top exactly, the answer is a whole number.\n\nWrite the unit change in your working.", "250 g out of 1 kg is 250/1000 = 1/4. Also 24/8 = 3.", "Same units first.", ("What is 45 minutes out of 1 hour as a fraction in simplest form?", ["4/5", "3/4", "45/1", "1/4"], 1, "1 hour is 60 minutes, so 45/60 = 3/4.")),
    ],
    (
        "Scenario: A class of 28 students is asked how they travel to school. 12 walk, 8 catch a bus, 6 come by car and 2 ride a bike. Write each group as a fraction of the class in simplest form.\n\n"
        "Step 1, understand. Each group goes over 28, the number of students. The four groups should add to 28: 12 + 8 + 6 + 2 = 28.\n\n"
        "Step 2, simplify each one. Walk: 12/28, the HCF is 4, so 3/7. Bus: 8/28, the HCF is 4, so 2/7. Car: 6/28, the HCF is 2, so 3/14. Bike: 2/28, the HCF is 2, so 1/14.\n\n"
        "Step 3, check by working back. 3/7 x 4/4 = 12/28, 2/7 x 4/4 = 8/28, 3/14 x 2/2 = 6/28 and 1/14 x 2/2 = 2/28. They all match.\n\n"
        "Step 4, check the total. Writing every fraction with a denominator of 14, we get 6/14, 4/14, 3/14 and 1/14, and 6 + 4 + 3 + 1 = 14, which is one whole class.\n\n"
        "Step 5, use the result. Bus and car together is 8 + 6 = 14 students, which is 14/28 = 1/2. Exactly half the class travels by bus or car.\n\n"
        "Good work, {{name}}. Each answer was checked in more than one way."
    ),
    (
        "Work through these on paper or in the practice boxes, one step per line. Part A (divisibility): which of 2, 3, 5, 9 and 10 divide 360? Which of them divide 135? Is 128 divisible by 4? Is 252 divisible by 6? Part B (one step): simplify 6/8, 10/25, 14/21, 18/30, 16/64 and 45/75. Part C (larger numbers): simplify 72/96, 84/126, 150/210 and 90/360, showing the HCF or each step. Part D (is it simplest?): decide whether each is in simplest form, and simplify if it is not: 9/16, 12/18, 15/28, 21/35 and 17/51. Part E (whole numbers): work out 24/8, 45/9, 100/25 and 36/36. Part F (parts and measurements): write each as a fraction in simplest form: 15 of 40 students, 18 of 24 marbles, 250 g of 1 kg, 45 minutes of 1 hour, 60 cm of 2 m and 8 months of a year. Part G (spot the error): each of these has a mistake. Say what went wrong and give the correct answer: 18/24 = 9/12 and that is the simplest form; 16/24 = 8/16 because 8 was taken from the top and the bottom; 4/12 = 1/4 because the top was divided by 4 and the bottom by 3; 30/45 = 6/9 and that is the simplest form."
    ),
    (
        "Mission: Sports Survey. A school of 240 students is asked about its favourite sport: 90 chose swimming, 60 chose athletics, 48 chose cross country, 30 chose team games and 12 chose other. Type your answers in the boxes.\n\n"
        "(a) Write each group as a fraction of 240 and then in simplest form, and check that the numbers of students add to 240.\n"
        "(b) Which sport is exactly one quarter of the students? Which two sports together are exactly one half?\n"
        "(c) Next year there are 360 students and the same fractions choose each sport. Use equivalent fractions to find how many choose each sport, and check that the total is 360.\n"
        "(d) Write each of these as a fraction in simplest form: 250 m out of a 1 km course, 45 minutes out of a 3 hour program and 36 seconds out of 2 minutes.\n"
        "(e) A student says: '90/240 simplifies to 9/24, and that is the simplest form.' Explain in two or three sentences what the mistake is and give the correct simplest form.\n"
        "(f) Make your own survey of 20 people with four choices. Write each as a fraction of 20 in simplest form and check that the numerators over 20 add to 20."
    ),
    "Type your answers in the practice boxes. Show the HCF or each dividing step, check by working back where you can, and write full sentences for the explanation questions.",
    "Did I divide the top and the bottom by the same number each time, find the highest common factor or keep going until nothing was left, put the same units on the top and the bottom, and check that my answer is in simplest form?",
    [
        _q("Which of these fractions is in simplest form?", ["6/9", "7/12", "10/15", "8/20"], 1, "7 and 12 share no factor other than 1."),
        _q("Which of these numbers is divisible by 3?", ["124", "231", "415", "502"], 1, "2 + 3 + 1 = 6."),
        _q("What is 24/36 in simplest form?", ["12/18", "6/9", "2/3", "4/6"], 2, "The HCF is 12."),
        _q("What is 40/100 in simplest form?", ["4/10", "2/5", "20/50", "1/2"], 1, "The HCF is 20, so 40/100 = 2/5."),
        _q("Which of these is NOT in simplest form?", ["5/9", "8/15", "14/21", "11/12"], 2, "14 and 21 share 7."),
        _q("12 of 30 counters are blue. What fraction is this in simplest form?", ["6/15", "2/5", "4/10", "1/3"], 1, "The HCF of 12 and 30 is 6."),
        _q("What is 45 minutes out of 1 hour in simplest form?", ["4/5", "3/4", "45/1", "1/4"], 1, "45/60 = 3/4."),
        _q("What is 24/8?", ["8", "3", "16", "1/3"], 1, "24 \u00f7 8 = 3."),
        _q("What is 84/126 in simplest form?", ["3/4", "2/3", "4/6", "6/9"], 1, "The HCF is 42, so 84/126 = 2/3. Good work, {{name}}."),
        _q("90 of 240 students chose swimming. What fraction is this in simplest form?", ["9/24", "3/8", "30/80", "45/120"], 1, "The HCF of 90 and 240 is 30."),
    ],
    "Type your answers in the practice boxes and submit them. Include full sentences for parts (e) and (f).",
    "Extension: the simplest-form detective. List every fraction with a denominator of 12 and a numerator from 1 to 11 that is already in simplest form. Explain why every fraction with a denominator of 7 and a numerator from 1 to 6 is in simplest form. Then find a fraction that simplifies to 2/3 with a denominator between 50 and 60, and find the fraction equal to 2/3 whose numerator and denominator add to 85.",
    [("simplest form", "A fraction whose top and bottom share no factor except 1"), ("simplify", "Divide the top and bottom by a common factor"), ("common factor", "A factor shared by two or more numbers"), ("highest common factor (HCF)", "The largest common factor"), ("divisible", "Can be divided exactly with no remainder"), ("divisibility test", "A quick rule to check whether a number is divisible by another"), ("numerator", "The top number of a fraction"), ("denominator", "The bottom number of a fraction")],
    [],
    _sort("Simplest form or not?", "Decide whether each fraction is already in simplest form or can be simplified, then sort it.", ["Already in simplest form", "Can be simplified"], [("3/7", 0), ("6/10", 1), ("11/15", 0), ("12/16", 1), ("5/8", 0), ("21/28", 1), ("9/20", 0), ("15/45", 1)]),
    [
        _wc("What is 8/12 in simplest form?", ["2/3", "4/6", "3/2"], 0, "Divide the top and bottom by 4."),
        _wc("What is 10/15 in simplest form?", ["1/2", "2/3", "5/10"], 1, "Divide the top and bottom by 5."),
        _wc("Which number simplifies 21/28 in one step?", ["3", "7", "14"], 1, "7 is the HCF of 21 and 28."),
        _wc("Is 36 divisible by 9?", ["No", "Yes", "Only by 3"], 1, "3 + 6 = 9, so 36 is divisible by 9."),
        _wc("What is 16/20 in simplest form?", ["8/10", "4/5", "2/5"], 1, "Divide the top and bottom by 4."),
        _wc("What is 30/30?", ["0", "1", "30"], 1, "Any number over itself is 1."),
        _wc("What is 60 cm out of 1 m in simplest form?", ["3/5", "6/10", "60/1"], 0, "60/100 = 3/5."),
        _wc("What is the HCF of 45 and 75?", ["5", "15", "25"], 1, "45 = 15 x 3 and 75 = 15 x 5."),
    ],
    [
        {"key": "partA", "label": "Part A: divisibility", "hint": "Use the tests for 2, 3, 4, 5, 6, 9 and 10."},
        {"key": "partB", "label": "Part B: one step", "hint": "Divide the top and bottom by the HCF."},
        {"key": "partC", "label": "Part C: larger numbers", "hint": "Show the HCF or each dividing step."},
        {"key": "partD", "label": "Part D: is it simplest?", "hint": "Check for a common factor, then simplify if needed."},
        {"key": "partE", "label": "Part E: whole numbers", "hint": "Does the bottom divide the top exactly?"},
        {"key": "partF", "label": "Part F: parts and measurements", "hint": "Same units first, then simplify."},
        {"key": "partG", "label": "Part G: spot the error", "hint": "What went wrong, and what is the correct answer?"},
        {"key": "taskA", "label": "Survey (a): each sport", "hint": "Put each group over 240, then simplify."},
        {"key": "taskB", "label": "Survey (b): one quarter and one half", "hint": "Compare your simplest fractions with 1/4 and 1/2."},
        {"key": "taskC", "label": "Survey (c): next year", "hint": "Make equivalent fractions with denominator 360."},
        {"key": "taskD", "label": "Survey (d): measurements", "hint": "Change to the same unit before you simplify."},
        {"key": "taskE", "label": "Survey (e): the student's mistake", "hint": "Two or three sentences about stopping too early."},
        {"key": "taskF", "label": "Survey (f): your own survey", "hint": "Four choices, 20 people, and a check that they add to 20."},
    ],
    ["Dividing the top and the bottom by different numbers", "Subtracting the same number instead of dividing", "Stopping before the fraction is fully simplified", "Dividing only the top or only the bottom", "Forgetting to change units before writing a fraction", "Skipping the check at the end"],
    ["Write the factors of the top and bottom in two lists and circle the biggest shared one.", "Use the divisibility tests on every question before you start.", "Make a one-page rule sheet with each divisibility test and one example."],
    "Part A: 360 is divisible by 2, 3, 5, 9 and 10 (it is even, ends in 0 and its digits add to 9); 135 is divisible by 3, 5 and 9 (not 2 because it is odd, and not 10 because it does not end in 0); 128 is divisible by 4 because 28 \u00f7 4 = 7; 252 is divisible by 6 because it is even and its digits add to 9, which is a multiple of 3. Part B: 3/4, 2/5, 2/3, 3/5, 1/4, 3/5. Part C: 72/96 = 3/4 (HCF 24); 84/126 = 2/3 (HCF 42); 150/210 = 5/7 (HCF 30); 90/360 = 1/4 (HCF 90). Part D: 9/16 is in simplest form; 12/18 = 2/3; 15/28 is in simplest form; 21/35 = 3/5; 17/51 = 1/3. Part E: 3, 5, 4 and 1. Part F: 15/40 = 3/8; 18/24 = 3/4; 250/1000 = 1/4; 45/60 = 3/4; 60 cm of 200 cm is 60/200 = 3/10; 8/12 = 2/3. Part G: 18/24 = 9/12 stopped too early because 9 and 12 still share 3, so the simplest form is 3/4; 16/24 = 8/16 is wrong because subtracting does not keep the same amount, so the correct answer is 2/3; 4/12 = 1/4 is wrong because the top and bottom must be divided by the same number, so the correct answer is 1/3; 30/45 = 6/9 stopped too early because 6 and 9 still share 3, so the simplest form is 2/3. Survey (a): swimming 90/240 = 3/8, athletics 60/240 = 1/4, cross country 48/240 = 1/5, team games 30/240 = 1/8, other 12/240 = 1/20, and 90 + 60 + 48 + 30 + 12 = 240. (b): athletics is exactly one quarter, and swimming plus team games is 3/8 + 1/8 = 4/8 = 1/2. (c): with 360 students, swimming 3/8 = 135/360, athletics 1/4 = 90/360, cross country 1/5 = 72/360, team games 1/8 = 45/360 and other 1/20 = 18/360, and 135 + 90 + 72 + 45 + 18 = 360. (d): 250/1000 = 1/4; 3 hours is 180 minutes, so 45/180 = 1/4; 2 minutes is 120 seconds, so 36/120 = 3/10. (e): 9/24 can still be divided by 3, which gives 3/8. The HCF of 90 and 240 is 30, not 10, so dividing by 30 in one step gives the simplest form 3/8. (f): accept any valid survey where the numerators add to 20 and each fraction is correctly simplified. Quiz answers: 7/12; 231; 2/3; 2/5; 14/21; 2/5; 3/4; 3; 2/3; 3/8. Extension: with a denominator of 12 the fractions in simplest form are 1/12, 5/12, 7/12 and 11/12. A denominator of 7 has only the factors 1 and 7, and a numerator from 1 to 6 is smaller than 7, so it cannot share 7, which means the HCF is 1. A fraction equal to 2/3 with a denominator between 50 and 60 is 36/54 or 38/57. For the sum of 85, the numerator is 2k and the denominator is 3k, so 5k = 85, k = 17, and the fraction is 34/51.",
)
