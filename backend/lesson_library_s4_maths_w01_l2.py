"""Stage 4 Mathematics, Week 1 Lesson 2: Integers, Adding integers on the number line.
Rebuilt to the depth of the Stage 2 reference lesson (docs/LESSON_BUILD_GUIDE.md).
All written work is typed inside the lesson. Replaces the placeholder with seed_key s4-maths-w01-l2.

VIDEO STATUS: no YouTube video ID has been checked yet, so none is embedded. The resources list holds
checkable links to Khan Academy and BBC Bitesize. Add at least one embedded video with _video(...) once an
ID has been watched and approved, then re-check every link before release.
Outcome codes MA4-INT-C-01 and MAO-WM-01 are from the draft mapping and should be re-checked against NESA.
"""
from lesson_library_s4_builder import build_s4, _q, _step, _sort, _wc, _article

LESSON = build_s4(
    "s4-maths-w01-l2",
    "Week 1, Lesson 2: Adding Integers on the Number Line",
    "Lifts, temperatures and bank balances all change when you add to them. Learn to add positive and negative integers by moving along the number line, check every answer by seeing where you land, and explain your reasoning.",
    "Integers",
    ["MA4-INT-C-01", "MAO-WM-01"],
    {
        "MA4-INT-C-01": "Primary. Adds integers, using the number line to model each addition and to explain the result. Subtraction of integers is built on this in later lessons.",
        "MAO-WM-01": "Working mathematically: models problems, explains reasoning in words and symbols, and checks that answers make sense.",
    },
    "We are learning to add positive and negative integers by moving along a number line, and to explain why each answer makes sense.",
    [
        "I can show an addition of integers as a move on a number line.",
        "I can say which direction adding a positive or a negative integer moves me.",
        "I can work out sums such as -4 + 6, 2 + (-5) and -3 + (-4).",
        "I can explain why a number plus its opposite is zero.",
        "I can find a missing number in an addition.",
        "I can solve a real problem by adding integers and checking the answer on the number line.",
        "I can explain my reasoning using the number line.",
    ],
    ["integer", "sum", "number line", "positive", "negative", "opposite", "brackets", "net change", "zero"],
    ["This lesson (everything you need is inside it)", "Paper and pencil", "A ruler", "A printed number line from -20 to 20 (optional)"],
    "You can say what an integer is, place integers on a number line, compare and order them, and find opposites and absolute values (Week 1, Lesson 1).",
    (
        "Why this matters. Numbers change all the time. A temperature rises or falls, a lift goes up or down, a bank balance grows or shrinks. When the numbers are integers, some of the changes cross zero. The number line lets you see exactly what is happening instead of guessing. Adding integers is also the base for subtraction, for algebra with negative numbers, and for graphs, so it is worth getting right now.\n\n"
        "The big idea: addition is a move. Start at the first integer on the number line. The second integer tells you how far to move and in which direction. Adding a positive integer moves you to the right. Adding a negative integer moves you to the left. Where you finish is the sum. The sum is simply the answer to an addition. Notice that adding does not always make a number bigger. Adding a negative makes the result smaller, and that is the idea most students find hardest.\n\n"
        "The parts you need. Brackets keep signs apart: we put brackets around a negative number that follows a plus sign, so we write 7 + (-3), not 7 + -3. The plus sign is the operation, which is what you do. The minus sign inside the brackets belongs to the number. A number plus its opposite is zero, such as -9 + 9 = 0, because you move away from zero and then straight back. Adding zero changes nothing. Order does not matter: -8 + 3 and 3 + (-8) both land on -5, because they are the same two moves in a different order.\n\n"
        "Where do the clues come from? In a real problem, the words tell you the sign. Rise, gain, deposit, climb and up are positive. Fall, loss, withdrawal, drop and down are negative. Before you write anything, decide what zero means (ground floor, 0 degrees, a balance of $0) and decide which direction is positive. Then each change in the story becomes an integer you can add. If you cannot say what zero stands for, you are not ready to add yet.\n\n"
        "The routine. Use these five steps every time. 1. Start: mark the first integer on a quick number line. 2. Direction: positive moves right, negative moves left. 3. Distance: the size of the second integer is the number of steps. 4. Land: say where you finish, and write the sum. 5. Check: swap the order, or ask whether the answer is left or right of the start in the right direction. For example, adding a negative must land to the left of where you started. If it does not, something went wrong.\n\n"
        "Addition links to other skills. In Lesson 1 you learned to find the distance between two integers, and adding is the same idea in reverse: you are given the start and the distance and asked where you land. Later in this unit, subtracting integers will be built on exactly this move. In Week 6 you will use the same left-and-right moves along an axis when you plot points on a coordinate plane. The patterns after drawing help too. When both integers have the same sign, keep that sign and add the sizes: -3 + (-4) = -7. When the signs are different, subtract the smaller size from the larger size and take the sign of the integer with the larger size: 4 + (-6) = -2. These patterns are a check, not a replacement for sketching the line.\n\n"
        "A quick demonstration. Take this question: 'The temperature is -3 degrees at midnight, then it falls 5 degrees and later rises 9 degrees. What is it now?' Start: -3. Direction and distance: falls 5 is -5, so move 5 left to -8. Then rises 9 is +9, so move 9 right to 1. Land: the temperature is 1 degree. Check with net change: -5 + 9 = 4, and -3 + 4 = 1. It matches, so the answer is checked two different ways. Notice that the net change is the overall result of all the moves added together."
    ),
    [
        _step("1", "Addition is a move", "Start at the first integer on the number line. The second integer tells you how far to move and in which direction. The place you finish is the sum.\n\nPositive means move right. Negative means move left.", "-3 + 5: start at -3, move 5 steps right, finish at 2.", "Always say where you start, which way you move and how far.", ("On a number line you start at -3 and add 5. Where do you finish?", ["-8", "2", "8", "-2"], 1, "Starting at -3 and moving 5 steps right takes you through 0 and on to 2.")),
        _step("2", "Adding a positive integer", "Adding a positive integer moves you right, so the result is greater than where you started.\n\nWhen you start below zero, count the steps to zero first, then keep going.", "-4 + 6: 4 steps to reach 0, then 2 more steps, so the sum is 2.", "Adding a positive always moves right.", ("What is -4 + 6?", ["-10", "10", "2", "-2"], 2, "Move 6 steps right from -4: 4 steps to zero and 2 more gives 2.")),
        _step("3", "Adding a negative integer", "Adding a negative integer moves you left, so the result is less than where you started.\n\nThis can feel odd, because we usually think addition makes numbers bigger. On the number line it is clear: left means smaller.", "2 + (-5): 2 steps to reach 0, then 3 more steps left, so the sum is -3.", "Adding a negative moves left and makes the result smaller.", ("What is 2 + (-5)?", ["7", "-7", "3", "-3"], 3, "Move 5 steps left from 2: 2 steps to zero and 3 more gives -3.")),
        _step("4", "Brackets keep signs apart", "We write brackets around a negative number that comes after a plus sign. The plus sign is the operation (what you do). The minus sign inside the brackets is part of the number.\n\nWhen both numbers are negative, you move left from a negative start, so the result is even further left.", "7 + (-3) = 4. -3 + (-4) = -7: start at -3 and move 4 steps left.", "One sign tells you what to do. The other sign tells you the kind of number.", ("What is 7 + (-3)?", ["10", "4", "-4", "-10"], 1, "Move 3 steps left from 7 and you finish at 4.")),
        _step("5", "Order does not matter", "You can add two integers in either order and get the same sum. Swapping the order gives a good way to check your work.\n\nSometimes one order is easier to picture.", "-8 + 3 = -5 and 3 + (-8) = -5.", "The same two moves in a different order land in the same place.", ("Which calculation has the same answer as -8 + 3?", ["8 + 3", "-3 + 8", "3 + (-8)", "3 + 8"], 2, "3 + (-8) uses the same two integers, so the sum is the same: -5.")),
        _step("6", "Opposites and zero", "A number plus its opposite is zero, because you move away from zero and then back by the same amount.\n\nAdding zero does not change a number.", "-9 + 9 = 0. 15 + (-15) = 0. -6 + 0 = -6.", "Opposites cancel. Zero changes nothing.", ("What is -9 + 9?", ["0", "-18", "18", "9"], 0, "-9 and 9 are opposites, so they cancel to zero.")),
        _step("7", "Real problems and net change", "For a real problem, choose zero (sea level, 0 degrees, a balance of $0) and decide which direction is positive. Write each change as an integer, then add.\n\nWith several changes, add them all up to get the net change, then apply it to the start.", "The temperature is -3 degrees at midnight and rises 8 degrees by morning: -3 + 8 = 5 degrees.", "Rises, gains and deposits are positive. Falls, losses and withdrawals are negative.", ("The temperature is -3 degrees at midnight and rises 8 degrees by morning. What is it in the morning?", ["-11", "11", "-5", "5"], 3, "-3 + 8 = 5 degrees.")),
        _step("8", "Explaining your reasoning", "A mathematician does not only give an answer. They say why it is right. A good explanation names the move, gives the direction and distance, and links the result back to the number line.\n\nSentence starter: 'I started at ___ and moved ___ steps ___ because ___, so I landed on ___.'", "'I started at 4 and added -9, so I moved 9 steps left. Four steps took me to zero and five more took me to -5.'", "Your reason should say where you started, which way you moved and how far.", ("Which is the best explanation of 3 + (-7) = -4?", ["Because 7 is bigger than 3", "I started at 3 and moved 7 steps left, which takes me past zero to -4", "Because the answer is negative", "I just know it"], 1, "A good explanation names the start, the direction and the distance, and uses the number line.")),
    ],
    (
        "Scenario: A lift in a tall building has three basement levels. Zero is the ground floor. The lift starts at basement level 3, which is floor -3. It makes five trips: up 8, down 9, up 4, down 6 and up 10.\n\n"
        "Step 1, find zero and write each trip as an integer. Zero is the ground floor. Up is positive and down is negative: +8, -9, +4, -6, +10.\n\n"
        "Step 2, follow the lift one trip at a time. Start at -3. After +8: -3 + 8 = 5. After -9: 5 + (-9) = -4. After +4: -4 + 4 = 0. After -6: 0 + (-6) = -6. After +10: -6 + 10 = 4. The lift finishes on floor 4.\n\n"
        "Step 3, check with the net change. Add all the trips first: 8 + (-9) + 4 + (-6) + 10. Take 8 and 4 and 10 to make 22, then take -9 and -6 to make -15. Then 22 + (-15) = 7. The net change is 7 floors up.\n\n"
        "Step 4, apply the net change to the start: -3 + 7 = 4. It matches, so the answer is checked two different ways.\n\n"
        "Step 5, what was the lowest floor the lift reached? The positions were -3, 5, -4, 0, -6 and 4. The lowest is -6, which is basement level 6.\n\n"
        "Reasoning check. After the third trip the lift was at floor 0, so it came back to ground level even though it went up 4 from -4. Well done, {{name}}. You used the number line to see each move and the net change to check the total."
    ),
    (
        "Work through these on paper or in the practice boxes. Part A (move on the number line): work out 5 + 3, -2 + 6, -7 + 4, 3 + (-8), -4 + (-5) and 0 + (-6). Part B (opposites and zero): work out -12 + 12, 15 + (-15), -9 + 0 and -20 + (-1). Part C (order does not matter): work out -15 + 8 and 8 + (-15), then explain why they match. Part D (missing numbers): find the number that goes in the gap. ? + 3 = -2, -4 + ? = 5, 6 + ? = -1, ? + (-3) = -10. Part E (real problems): the temperature is -5 and rises 12 degrees; a bank balance is -$30 and $80 is deposited; a diver at -14 m dives 9 m deeper. Write each as an addition of integers and give the answer with units. Check each answer by sketching the number line."
    ),
    (
        "Mission: Mine Lift Logbook. A mine lift operator starts at the surface, which is level 0. The lift makes five moves in order: down 12 m, down 8 m, up 15 m, down 9 m, up 22 m. Work through the stages in order and type everything in the boxes.\n\n"
        "Stage 1 (find zero and write the moves): say what zero stands for, write each move as an integer, and write the starting position plus the first move as an addition.\n"
        "Stage 2 (positions): find the lift's position after each of the five moves, writing each step as an addition.\n"
        "Stage 3 (lowest and net change): what was the lowest position the lift reached? Add all five moves together to find the net change, and check that it matches the final position.\n"
        "Stage 4 (one move): could the operator have reached the same final position with a single move from the surface? Say which move and explain.\n"
        "Stage 5 (spot the mistake): a student works out -12 + (-8) and gets -4 because 12 - 8 = 4. Explain in two or three sentences what mistake was made, point to the number line, and give the correct answer.\n"
        "Stage 6 (make your own): make up your own journey with five moves that starts somewhere other than zero. Write each move as an integer, find the position after each move, give the net change, and explain your reasoning in at least three sentences."
    ),
    "Type your answers in the practice boxes. Show each step as an addition and write full sentences for the explanation stages.",
    "Did I find zero, show each addition as a move on the number line, move the correct way for positive and negative integers, use brackets correctly, find missing numbers, check my total using the net change, and explain my reasoning with the number line?",
    [
        _q("What is 7 + (-10)?", ["-3", "3", "17", "-17"], 0, "Move 10 steps left from 7: 7 steps to zero and 3 more gives -3."),
        _q("What is -6 + (-4)?", ["-2", "2", "10", "-10"], 3, "Start at -6 and move 4 steps left to reach -10."),
        _q("What is -9 + 15?", ["-24", "6", "24", "-6"], 1, "Move 15 steps right from -9: 9 steps to zero and 6 more gives 6."),
        _q("On a number line, adding a negative integer moves you...", ["to the right", "nowhere", "straight to zero", "to the left"], 3, "A negative integer means a move to the left."),
        _q("What is -8 + 8?", ["0", "-16", "16", "8"], 0, "A number plus its opposite is zero."),
        _q("Which calculation has the same answer as -5 + 12?", ["5 + 12", "-12 + 5", "12 + (-5)", "12 + 5"], 2, "Adding in a different order gives the same sum: both equal 7."),
        _q("The temperature is -7 degrees and falls by 5 degrees. What is it now?", ["-2", "-12", "2", "12"], 1, "-7 + (-5) = -12 degrees."),
        _q("Which statement is true?", ["-3 + 8 = -5", "-2 + (-2) = 0", "6 + (-6) = 12", "4 + (-9) = -5"], 3, "4 + (-9): 4 steps to zero and 5 more left gives -5. Great work, {{name}}."),
        _q("What number added to -4 gives 6?", ["2", "-2", "-10", "10"], 3, "From -4 you need to move 10 steps right to reach 6, so -4 + 10 = 6."),
        _q("What is -20 + (-15)?", ["-35", "-5", "5", "35"], 0, "Both are negative, so move left from -20 by 15 steps to reach -35."),
    ],
    "Type your answers in the practice boxes and submit them. Include full sentences for the explanation stages.",
    "Extension: a puzzle with five integers in a row, where each integer after the first is found by adding -3, +7, -10, +4 to the one before. Choose a start number so that the lowest number in the row is exactly -5. Explain how you decided, using the net change after each step.",
    [("integer", "A whole number that can be positive, negative or zero"), ("sum", "The result of adding numbers together"), ("number line", "A line showing numbers in order, with zero in the middle"), ("positive", "Greater than zero, to the right of zero on the number line"), ("negative", "Less than zero, to the left of zero on the number line"), ("opposite", "The integer the same distance from zero on the other side"), ("brackets", "Used to keep a negative sign apart from the plus sign, as in 7 + (-3)"), ("net change", "The overall change after a series of moves added together"), ("zero", "The integer that is neither positive nor negative; adding it changes nothing")],
    [
        _article("BBC Bitesize: How to add and subtract positive and negative numbers (KS3)", "https://www.bbc.co.uk/bitesize/articles/zrjsn9q"),
        _article("Khan Academy: Adding negative numbers example (video)", "https://www.khanacademy.org/math/arithmetic/negative-numbers/v/adding-negative-numbers"),
    ],
    _sort("Will the sum be positive, negative or zero?", "Sort each addition by the sign of its answer. Picture the number line.", ["Positive", "Negative", "Zero"], [("8 + (-3)", 0), ("-8 + 3", 1), ("-5 + 5", 2), ("-4 + (-4)", 1), ("10 + (-2)", 0), ("-7 + 7", 2), ("-1 + 6", 0), ("2 + (-9)", 1)]),
    [
        _wc("What is -3 + 5?", ["-2", "8", "2"], 2, "Move 5 steps right from -3 and you land on 2."),
        _wc("What is 4 + (-7)?", ["3", "-3", "11"], 1, "Move 7 steps left from 4 and you land on -3."),
        _wc("What is -6 + (-1)?", ["-5", "7", "-7"], 2, "Move 1 step left from -6 to reach -7."),
        _wc("What is -9 + 9?", ["18", "0", "-18"], 1, "Opposites add to zero."),
        _wc("Adding a negative integer moves you...", ["right", "up", "left"], 2, "Negative means left on the number line."),
        _wc("What is -2 + 10?", ["12", "-8", "8"], 2, "Move 10 steps right from -2 and you land on 8."),
        _wc("What is 5 + (-5)?", ["10", "0", "-10"], 1, "5 and -5 are opposites, so the sum is zero."),
        _wc("What is -11 + 4?", ["7", "-15", "-7"], 2, "Move 4 steps right from -11 and you land on -7."),
    ],
    [
        {"key": "partA", "label": "Part A: moves on the number line", "hint": "5 + 3, -2 + 6, -7 + 4, 3 + (-8), -4 + (-5), 0 + (-6)."},
        {"key": "partB", "label": "Part B: opposites and zero", "hint": "-12 + 12, 15 + (-15), -9 + 0, -20 + (-1)."},
        {"key": "partC", "label": "Part C: order does not matter", "hint": "-15 + 8 and 8 + (-15). Why do they match?"},
        {"key": "partD", "label": "Part D: missing numbers", "hint": "? + 3 = -2, -4 + ? = 5, 6 + ? = -1, ? + (-3) = -10."},
        {"key": "partE", "label": "Part E: real problems", "hint": "Temperature -5 rises 12. Balance -$30 plus $80. Diver at -14 m dives 9 m deeper."},
        {"key": "stage1", "label": "Stage 1: zero and the moves", "hint": "What does zero stand for? Write the five moves as integers and 0 plus the first move."},
        {"key": "stage2", "label": "Stage 2: positions", "hint": "Position after each move, written as an addition."},
        {"key": "stage3", "label": "Stage 3: lowest position and net change", "hint": "Which position was lowest? Add all five moves. Does it match the final position?"},
        {"key": "stage4", "label": "Stage 4: a single move", "hint": "Which single move reaches the same place? Explain."},
        {"key": "stage5", "label": "Stage 5: spot the mistake", "hint": "Two or three sentences about -12 + (-8). Point to the number line."},
        {"key": "stage6", "label": "Stage 6: my own journey", "hint": "Five moves, positions, the net change, and an explanation of at least three sentences."},
    ],
    ["Adding the sizes and ignoring the signs, such as saying -12 + (-8) = -4", "Moving right when adding a negative integer", "Believing addition always makes a number bigger", "Writing 7 + -3 without brackets and mixing up the operation sign and the number's sign", "Forgetting to cross zero and stopping at zero when moving past it", "Giving a positive answer when the larger-sized integer is negative"],
    ["Record the temperature each hour for a day (or look up a cold place) and write the changes as integers. Add them to check the final temperature.", "Draw a number line from -20 to 20 on the floor with chalk or tape and act out five additions by walking."],
    "Part A: 5 + 3 = 8; -2 + 6 = 4; -7 + 4 = -3; 3 + (-8) = -5; -4 + (-5) = -9; 0 + (-6) = -6. Part B: -12 + 12 = 0; 15 + (-15) = 0; -9 + 0 = -9; -20 + (-1) = -21. Part C: both equal -7; they use the same two integers, so the same two moves land in the same place whichever order they are made in. Part D: -5 (since -5 + 3 = -2); 9 (since -4 + 9 = 5); -7 (since 6 + (-7) = -1); -7 (since -7 + (-3) = -10). Part E: -5 + 12 = 7 degrees; -30 + 80 = $50; -14 + (-9) = -23 m. Stage 1: zero is the surface; moves are -12, -8, +15, -9, +22; 0 + (-12). Stage 2: 0 + (-12) = -12; -12 + (-8) = -20; -20 + 15 = -5; -5 + (-9) = -14; -14 + 22 = 8. Stage 3: lowest position is -20 m; -12 + (-8) + 15 + (-9) + 22 = 8, which matches the final position of 8 m because the lift started at 0. Stage 4: yes, a single move of up 8 m from the surface reaches the same position, since the net change is +8. Stage 5: the student ignored the negative signs and subtracted the sizes; both numbers are negative, so the lift moves 8 steps further left from -12 and the correct answer is -20. Stage 6: accept any five moves that give correct positions and a correct net change with a start different from zero, plus a reasoned explanation. Quiz answers: -3; -10; 6; to the left; 0; 12 + (-5); -12; 4 + (-9) = -5; 10; -35.",
)
