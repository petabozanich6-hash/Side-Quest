"""Stage 4 Mathematics, Week 2 Lesson 3: Integers, Addition and subtraction patterns and rules.
All written work is typed inside the lesson. Replaces the placeholder with seed_key s4-maths-w02-l3.
No video is attached: none has been found and tested for this topic yet. Add one in the video and link run.
Outcome codes MA4-INT-C-01 and MAO-WM-01 are from the draft mapping and should be re-checked against NESA.
Builds on W2 L1 and L2. Pulls the add/subtract rules together before mixed problems (W2 L4).
"""
from lesson_library_s4_builder import build_s4, _q, _step, _sort, _wc

LESSON = build_s4(
    "s4-maths-w02-l3",
    "Week 2, Lesson 3: Addition and Subtraction Patterns and Rules",
    "Adding and subtracting integers follow a small set of rules that always work. Spot the patterns, state the rules in your own words, and use them to continue sequences, run function machines and crack a pattern detective case.",
    "Integers",
    ["MA4-INT-C-01", "MAO-WM-01"],
    {
        "MA4-INT-C-01": "Primary. States and applies the rules for adding and subtracting integers, including that adding a negative is the same as subtracting a positive and subtracting a negative is the same as adding a positive, and continues integer number patterns.",
        "MAO-WM-01": "Working mathematically: identifies patterns, generalises them into rules, tests the rules on new examples and justifies conclusions.",
    },
    "We are learning to find and use the patterns and rules for adding and subtracting integers.",
    ["I can continue an integer number pattern and state its rule.", "I can say that adding a negative is the same as subtracting a positive.", "I can say that subtracting a negative is the same as adding a positive.", "I can rewrite any addition or subtraction in the equivalent form.", "I can use the zero rules: a + (-a) = 0, a - a = 0, a - 0 = a and 0 - a = -a.", "I can reorder an addition to group opposites.", "I can run a function machine with an integer rule and find a rule from a table."],
    ["integer", "pattern", "rule", "term", "opposite", "sequence", "function machine", "input", "output", "equivalent"],
    ["This lesson (everything you need is inside it)", "Paper and pencil", "A printed number line from -30 to 30 (optional)"],
    "You can add and subtract positive and negative integers using chips, the number line and the sign patterns (Week 1 and Week 2 Lessons 1 and 2).",
    (
        "Why this matters. You have now seen adding and subtracting integers in several ways. This lesson pulls it all together into a short set of rules that always work, so that you can solve problems quickly and know why the answers are right.\n\n"
        "Integer patterns. A sequence is a list of numbers that follows a rule. Starting at -10 and adding 4 each time gives -10, -6, -2, 2, 6. The terms rise by the same amount each step. Starting at 8 and subtracting 3 gives 8, 5, 2, -1, -4. The terms fall by the same amount and pass through zero without the pattern breaking.\n\n"
        "Adding a negative is the same as subtracting a positive. a + (-b) = a - b. 7 + (-3) = 7 - 3 = 4. Both move you 3 steps left.\n\n"
        "Subtracting a negative is the same as adding a positive. a - (-b) = a + b. 7 - (-3) = 7 + 3 = 10. Both move you 3 steps right.\n\n"
        "Four equivalent forms. Adding a positive and subtracting a negative both move right. Subtracting a positive and adding a negative both move left. So every addition or subtraction can be written either way: a - b = a + (-b) and a + b = a - (-b). Choose the form that is easier to work with.\n\n"
        "The zero rules. a + (-a) = 0, because opposites cancel. a - a = 0, because taking away everything leaves nothing. a - 0 = a, because taking away nothing changes nothing. 0 - a = -a, because starting from nothing and taking away a gives the opposite of a.\n\n"
        "Order. Addition can be done in any order, so you can regroup to put opposites together: -7 + 12 + 7 = 12 + (-7 + 7) = 12 + 0 = 12. Subtraction cannot be reordered: 3 - 8 is not the same as 8 - 3.\n\n"
        "Function machines. A function machine takes an input, applies a rule and gives an output. If the rule is subtract -5, then input -8 gives -8 - (-5) = -8 + 5 = -3. To find a rule from a table, look at how the output changes from the input every time."
    ),
    [
        _step("1", "Increasing patterns", "A sequence follows a rule such as 'add 4'. Each term is found by applying the rule to the term before it.\n\nThe terms increase by the same amount each step, even when they start below zero.", "Start at -10 and add 4: -10, -6, -2, 2, 6, 10.", "Same step each time, even across zero.", ("The sequence -9, -5, -1, 3 follows the rule add 4. What comes next?", ["5", "7", "-3", "1"], 1, "3 + 4 = 7.")),
        _step("2", "Decreasing patterns", "A rule such as 'subtract 3' makes the terms fall by the same amount each step. The pattern carries on past zero into the negatives.\n\nTo find the rule, subtract one term from the next and see what changes.", "Start at 8 and subtract 3: 8, 5, 2, -1, -4, -7.", "Find the rule by looking at the change from one term to the next.", ("The sequence 6, 2, -2, -6 follows which rule?", ["Add 4", "Subtract 4", "Subtract 8", "Add 8"], 1, "Each term is 4 less than the one before.")),
        _step("3", "Adding a negative", "Adding a negative integer is the same as subtracting the positive integer of the same size.\n\nBoth moves go left on the number line.", "7 + (-3) = 7 - 3 = 4. -2 + (-5) = -2 - 5 = -7.", "Add a negative: go left.", ("What is -2 + (-5)?", ["7", "3", "-3", "-7"], 3, "-2 + (-5) is the same as -2 - 5, which is -7.")),
        _step("4", "Four equivalent forms", "Subtracting a negative is the same as adding a positive. Subtracting a positive is the same as adding a negative.\n\nSo a - b = a + (-b) and a - (-b) = a + b. Both forms give the same answer.", "5 - 9 = 5 + (-9) = -4. 6 - (-4) = 6 + 4 = 10.", "Choose the form that is easier.", ("5 - 9 is the same as 5 + what?", ["9", "-9", "-5", "4"], 1, "Subtracting 9 is the same as adding -9.")),
        _step("5", "The zero rules", "Opposites add to zero: a + (-a) = 0. A number minus itself is zero: a - a = 0. Subtracting zero changes nothing: a - 0 = a.\n\nStarting from zero and subtracting a gives the opposite: 0 - a = -a.", "15 + (-15) = 0. -8 - (-8) = 0. -13 - 0 = -13. 0 - 6 = -6. 0 - (-6) = 6.", "Opposites cancel to zero.", ("What is 0 - 12?", ["12", "-12", "0", "1"], 1, "Starting from zero and subtracting 12 gives -12.")),
        _step("6", "Order and opposites", "Addition can be done in any order, so group opposites together first. Subtraction cannot be reordered.\n\nSpotting opposites can save a lot of work.", "-7 + 12 + 7: group -7 + 7 = 0, then 0 + 12 = 12. But 3 - 8 = -5 while 8 - 3 = 5.", "Add in any order; subtract in order.", ("What is -9 + 14 + 9?", ["14", "-14", "32", "4"], 0, "-9 + 9 = 0, so the answer is 14.")),
        _step("7", "Function machines", "A function machine applies a rule to every input to give an output. Write the rule as an addition or a subtraction, then calculate each output.\n\nTo find the rule, check how each output differs from its input.", "Rule subtract -5: input -8 gives -8 - (-5) = -3. Table 1, 2, 3, 4 to -2, -1, 0, 1 has the rule subtract 3.", "Apply the same rule every time.", ("A machine has the rule subtract -5. What is the output for the input -8?", ["-13", "-3", "3", "13"], 1, "-8 - (-5) = -8 + 5 = -3.")),
    ],
    (
        "Scenario: Two number patterns start a race. Pattern A starts at -11 and has the rule subtract -4 each step. Pattern B starts at 14 and has the rule subtract 6 each step.\n\n"
        "Step 1, rewrite Pattern A's rule. Subtracting -4 is the same as adding 4. So Pattern A is -11, -7, -3, 1, 5, 9. It rises.\n\n"
        "Step 2, write out Pattern B. Subtract 6 each time: 14, 8, 2, -4, -10, -16. It falls and passes through zero.\n\n"
        "Step 3, line up the terms. Term 1: -11 and 14. Term 2: -7 and 8. Term 3: -3 and 2. Term 4: 1 and -4. Term 5: 5 and -10. Term 6: 9 and -16.\n\n"
        "Step 4, when does A overtake B? At term 3, A is -3 and B is 2, so B is still ahead. At term 4, A is 1 and B is -4, so A is ahead. A overtakes B at term 4.\n\n"
        "Step 5, look at the gap. The gap from A to B is B - A. Term 1: 14 - (-11) = 25. Term 2: 8 - (-7) = 15. Term 3: 2 - (-3) = 5. Term 4: -4 - 1 = -5. The gap shrinks by 10 each step, because A rises by 4 and B falls by 6, and 4 + 6 = 10.\n\n"
        "Step 6, check with a rule. 25 - 10 - 10 - 10 = -5, which matches the gap at term 4.\n\n"
        "Reasoning check. Well done, {{name}}. You rewrote a subtracted negative as an addition, found the rule for each pattern and used the gap to explain the overtaking."
    ),
    (
        "Work through these on paper or in the practice boxes. Part A (continue the pattern): write the next two terms and the rule for each of -20, -15, -10; 30, 22, 14; -5, -1, 3; 9, 3, -3; and -2, -9, -16. Part B (rewrite then calculate): rewrite each as the equivalent form and work it out: 8 + (-5), -4 + (-6), 7 - (-2), -3 - (-8), 6 - 11, -9 - 3. Part C (zero rules): work out 15 + (-15), -8 - (-8), 0 - 20, -13 - 0, 0 - (-6). Part D (group opposites): work out -7 + 12 + 7, 15 + (-9) + (-15), -20 + 8 + 20 + (-8). Part E (function machines): the rule is add -3; find the outputs for the inputs 5, 0, -4, 10. The rule is subtract -6; find the outputs for the inputs -10, -6, 0, 5. Part F (find the rule): inputs 1, 2, 3, 4 give outputs -2, -1, 0, 1; inputs -4, 0, 3 give outputs 1, 5, 8. State each rule as an addition and as a subtraction. Part G (spot the error): each of these has a mistake. Say what went wrong and give the correct answer: -3 + (-4) = 1; 6 - (-3) = 3; 0 - 5 = 5."
    ),
    (
        "Mission: Pattern Detective Case File. Three suspect patterns have been found. Suspect A starts at -17 and adds 6 each step. Suspect B starts at 13 and subtracts 5 each step. Suspect C starts at -2 and subtracts -7 each step. Type your answers in the boxes.\n\n"
        "(a) Write the first seven terms of Suspect A and of Suspect B.\n"
        "(b) Rewrite Suspect C's rule as an addition and write its first five terms.\n"
        "(c) Which term of Suspect A is the first positive one?\n"
        "(d) Suspect A and Suspect B are compared term by term. Do they ever have exactly the same value? At which term does A first become larger than B?\n"
        "(e) Suspect D starts at 20, subtracts the same number each step and has a fourth term of -4. Find the number subtracted and write the first four terms.\n"
        "(f) A student says: 'Suspect C subtracts a number so its terms must be going down.' Explain in two or three sentences what mistake was made, and say what really happens.\n"
        "(g) Design a pattern that starts at -15 and reaches exactly 9 on its fourth step. Write its rule in two equivalent ways and list all its terms."
    ),
    "Type your answers in the practice boxes. Show each rewriting step, and write full sentences for the explanation questions.",
    "Did I continue patterns and name their rules, rewrite additions and subtractions in equivalent forms, use the zero rules, group opposites, and run function machines in both directions?",
    [
        _q("The sequence -9, -5, -1, 3 follows the rule add 4. What is the next term?", ["5", "7", "-3", "1"], 1, "3 + 4 = 7."),
        _q("Which rule fits 6, 2, -2, -6?", ["Add 4", "Subtract 4", "Subtract 8", "Add 8"], 1, "Each term is 4 less than the one before."),
        _q("7 + (-3) is the same as...", ["7 + 3", "7 - 3", "3 - 7", "-7 - 3"], 1, "Adding a negative is the same as subtracting a positive."),
        _q("5 - 9 is the same as...", ["5 + 9", "5 + (-9)", "-5 + 9", "-5 - 9"], 1, "Subtracting 9 is the same as adding -9."),
        _q("What is -4 - (-10)?", ["-14", "-6", "6", "14"], 2, "-4 + 10 = 6."),
        _q("What is 0 - 12?", ["12", "-12", "0", "1"], 1, "Starting from zero and subtracting 12 gives -12."),
        _q("What is -9 + 14 + 9?", ["14", "-14", "32", "4"], 0, "-9 + 9 = 0, so the answer is 14."),
        _q("A machine has the rule subtract -5. What is the output for the input -8?", ["-13", "-3", "3", "13"], 1, "-8 - (-5) = -8 + 5 = -3."),
        _q("A sequence starts at 3 and has the rule subtract 5. What is the third term?", ["-7", "-2", "-12", "-4"], 0, "The terms are 3, -2, -7. Great work, {{name}}."),
        _q("Which of these is NOT equal to -6 - (-2)?", ["-6 + 2", "-4", "2 - 6", "-6 - 2"], 3, "-6 - (-2) = -4. -6 - 2 = -8, so it is different."),
    ],
    "Type your answers in the practice boxes and submit them. Include full sentences for parts (d), (e), (f) and (g).",
    "Extension: when do patterns meet? Pattern A starts at -20 and adds 5 each step. Pattern B starts at 10 and subtracts 5 each step. Show that they have exactly the same value at one term, and say which term and what value. Then design two new patterns of your own, one rising and one falling, so that they meet exactly at the fifth term. Explain how you chose the starting numbers and the rules.",
    [("integer", "A whole number that can be positive, negative or zero"), ("pattern", "A sequence that follows a rule"), ("rule", "A statement of what is done to get each term or output"), ("term", "One number in a sequence"), ("opposite", "The number the same distance from zero on the other side, such as 6 and -6"), ("sequence", "A list of numbers that follows a rule"), ("function machine", "A rule that changes each input into an output"), ("input", "The number that goes into a function machine"), ("output", "The number that comes out of a function machine"), ("equivalent", "Having the same value")],
    [],
    _sort("Which way does it move?", "Picture each operation on the number line and sort it by the way it moves from the starting number.", ["Moves right", "Moves left", "Stays the same"], [("+ 5", 0), ("- 5", 1), ("+ (-5)", 1), ("- (-5)", 0), ("+ 0", 2), ("- 0", 2), ("- (-1)", 0), ("+ (-9)", 1)]),
    [
        _wc("What is 6 + (-2)?", ["4", "8", "-4"], 0, "6 + (-2) = 6 - 2 = 4."),
        _wc("What is 6 - (-2)?", ["4", "-8", "8"], 2, "6 + 2 = 8."),
        _wc("What is -6 + (-2)?", ["-8", "-4", "8"], 0, "-6 - 2 = -8."),
        _wc("What is -6 - (-2)?", ["-8", "4", "-4"], 2, "-6 + 2 = -4."),
        _wc("What is 0 - 9?", ["-9", "9", "0"], 0, "Starting from zero and subtracting 9 gives -9."),
        _wc("What is -5 - (-5)?", ["-10", "10", "0"], 2, "A number minus itself is zero."),
        _wc("The sequence is 10, 4, -2. What comes next?", ["-8", "-4", "8"], 0, "The rule is subtract 6, so -2 - 6 = -8."),
        _wc("Subtracting -3 is the same as...", ["subtract 3", "add -3", "add 3"], 2, "a - (-b) = a + b."),
    ],
    [
        {"key": "partA", "label": "Part A: continue the pattern", "hint": "Next two terms and the rule for each of the five sequences."},
        {"key": "partB", "label": "Part B: rewrite then calculate", "hint": "8 + (-5), -4 + (-6), 7 - (-2), -3 - (-8), 6 - 11, -9 - 3."},
        {"key": "partC", "label": "Part C: zero rules", "hint": "15 + (-15), -8 - (-8), 0 - 20, -13 - 0, 0 - (-6)."},
        {"key": "partD", "label": "Part D: group opposites", "hint": "-7 + 12 + 7, 15 + (-9) + (-15), -20 + 8 + 20 + (-8)."},
        {"key": "partE", "label": "Part E: function machines", "hint": "Add -3 on 5, 0, -4, 10. Subtract -6 on -10, -6, 0, 5."},
        {"key": "partF", "label": "Part F: find the rule", "hint": "Two tables. State each rule as an addition and a subtraction."},
        {"key": "partG", "label": "Part G: spot the error", "hint": "-3 + (-4) = 1; 6 - (-3) = 3; 0 - 5 = 5."},
        {"key": "taskA", "label": "Case file (a): suspects A and B", "hint": "First seven terms of each."},
        {"key": "taskB", "label": "Case file (b): suspect C", "hint": "Rewrite the rule as an addition, first five terms."},
        {"key": "taskC", "label": "Case file (c): first positive term", "hint": "Which term of A is the first positive one?"},
        {"key": "taskD", "label": "Case file (d): A against B", "hint": "Same value anywhere? When does A first beat B?"},
        {"key": "taskE", "label": "Case file (e): suspect D", "hint": "Start 20, fourth term -4. Find the number subtracted."},
        {"key": "taskF", "label": "Case file (f): the student's mistake", "hint": "Two or three sentences about suspect C going down."},
        {"key": "taskG", "label": "Case file (g): my own pattern", "hint": "Start -15, reach 9 on the fourth step. Rule in two ways."},
    ],
    ["Thinking subtracting a negative makes the terms go down", "Forgetting that adding a negative moves left", "Reordering a subtraction as if it were an addition", "Finding a rule from only the first two terms without checking the rest", "Reading a - b as b - a when finding the gap", "Dropping a negative sign when rewriting an operation"],
    ["Make a poster with the four equivalent forms and one example of each, then test a partner on it.", "Create a pattern on the number line by hopping on the floor and ask a partner to write the rule.", "Make a function machine with a secret rule and ask a partner to find it using three inputs."],
    "Part A: -5, 0 (add 5); 6, -2 (subtract 8); 7, 11 (add 4); -9, -15 (subtract 6); -23, -30 (subtract 7). Part B: 8 + (-5) = 8 - 5 = 3; -4 + (-6) = -4 - 6 = -10; 7 - (-2) = 7 + 2 = 9; -3 - (-8) = -3 + 8 = 5; 6 - 11 = 6 + (-11) = -5; -9 - 3 = -9 + (-3) = -12. Part C: 0; 0; -20; -13; 6. Part D: 12; -9; 0. Part E: add -3 gives 2, -3, -7, 7; subtract -6 gives -4, 0, 6, 11. Part F: the first table has the rule subtract 3 (or add -3); the second table has the rule add 5 (or subtract -5). Part G: -3 + (-4) = -7, because both are negative so the chips pile up; 6 - (-3) = 6 + 3 = 9; 0 - 5 = -5, because starting from zero and subtracting gives the opposite. Case file (a): Suspect A: -17, -11, -5, 1, 7, 13, 19. Suspect B: 13, 8, 3, -2, -7, -12, -17. (b): the rule is add 7; the terms are -2, 5, 12, 19, 26. (c): the fourth term (1). (d): they are never exactly equal, because at term 3 A is -5 and B is 3, and at term 4 A is 1 and B is -2; A first becomes larger than B at term 4. (e): the number subtracted is 8 (20 - 3 times 8 = -4); the terms are 20, 12, 4, -4. (f): subtracting a negative number is the same as adding a positive, so the terms go up by 7 each step; the student confused subtracting a negative with subtracting a positive. (g): the rule is add 6 (or subtract -6); the terms are -15, -9, -3, 3, 9. Quiz answers: 7; subtract 4; 7 - 3; 5 + (-9); 6; -12; 14; -3; -7; -6 - 2.",
)
