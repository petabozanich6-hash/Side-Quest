"""Stage 4 Mathematics, Week 2 Lesson 1: Integers, Subtracting integers on the number line.
All written work is typed inside the lesson. Replaces the placeholder with seed_key s4-maths-w02-l1.
No video is attached: none has been found and tested for this topic yet. Add one in the video and link run.
Outcome codes MA4-INT-C-01 and MAO-WM-01 are from the draft mapping and should be re-checked against NESA.
This lesson subtracts positive integers only. Subtracting a negative integer is the next lesson (W2 L2).
"""
from lesson_library_s4_builder import build_s4, _q, _step, _sort, _wc

LESSON = build_s4(
    "s4-maths-w02-l1",
    "Week 2, Lesson 1: Subtracting Integers on the Number Line",
    "Temperatures fall, accounts are drawn down and lifts go lower. Learn to subtract on the number line, to cross zero with confidence, and to see subtraction as both a move and a difference between two places.",
    "Integers",
    ["MA4-INT-C-01", "MAO-WM-01"],
    {
        "MA4-INT-C-01": "Primary. Subtracts a positive integer from any integer using the number line, including answers that cross zero, and explains subtraction as a move and as the difference between two positions. Subtracting negative integers follows in the next lesson.",
        "MAO-WM-01": "Working mathematically: models problems, checks answers using the inverse operation and explains why order matters.",
    },
    "We are learning to subtract positive integers on a number line, to cross zero, and to check our answers using addition.",
    ["I can show a subtraction as a move to the left on a number line.", "I can subtract when the answer is below zero.", "I can subtract a positive integer from a negative integer.", "I can explain why a - b and b - a have opposite answers.", "I can explain a subtraction as the move from one number to another.", "I can check a subtraction by adding.", "I can solve real problems such as falling temperatures and drawing down an account."],
    ["integer", "subtract", "difference", "number line", "inverse operation", "positive", "negative", "distance", "order"],
    ["This lesson (everything you need is inside it)", "Paper and pencil", "A printed number line from -30 to 30 (optional)"],
    "You can add integers on the number line, with chips and with the sign patterns, and you can say what a zero pair is (Week 1, Lessons 2 to 5).",
    (
        "Why this matters. Every time something falls, shrinks or is taken away, we subtract. If you take more away than you started with, you end up below zero, so subtracting integers is where negative numbers really get used. This lesson uses the number line so you can see what is happening. In the next lesson we will subtract negative integers.\n\n"
        "Subtracting a positive integer is a move left. Start at the first integer on the number line and move to the left by the amount you are subtracting. 7 - 3: start at 7 and move 3 steps left to reach 4. Adding moves right (for a positive integer), and subtracting moves left.\n\n"
        "Crossing zero. 3 - 8: start at 3 and move 8 steps left. Three steps take you to zero and five more take you to -5, so 3 - 8 = -5. When you take away more than you have, the answer is negative.\n\n"
        "Starting below zero. -3 - 4: start at -3 and move 4 steps left to reach -7. You are already on the negative side and you keep going left, so the answer is further from zero.\n\n"
        "Order matters. 8 - 3 = 5 but 3 - 8 = -5. These are opposites: same size, opposite sign. Unlike addition, subtraction is not the same in either order. 3 + 8 and 8 + 3 are equal, but 3 - 8 and 8 - 3 are not.\n\n"
        "Subtraction as a difference. The subtraction a - b is also the move that takes you from b to a. For 2 - 7, ask: how do you get from 7 to 2? You move 5 steps left, so 2 - 7 = -5. Notice the difference between this and distance. The distance between 2 and 7 is 5, which is never negative. The answer to 2 - 7 is -5, which tells you the direction as well.\n\n"
        "Subtraction undoes addition. Subtraction is the inverse operation of addition. If 4 + 6 = 10, then 10 - 6 = 4. If -4 + 9 = 5, then 5 - 9 = -4. This gives a useful check: add back what you subtracted and you should return to the number you started with."
    ),
    [
        _step("1", "Subtracting is a move left", "To subtract a positive integer, start at the first number on the number line and move left by the amount you are subtracting.\n\nAddition of a positive moves right. Subtraction of a positive moves left.", "7 - 3: start at 7, move 3 steps left, finish at 4.", "Subtract means move left.", ("On a number line you start at 7 and subtract 3. Where do you finish?", ["10", "4", "-4", "3"], 1, "Moving 3 steps left from 7 takes you to 4.")),
        _step("2", "Crossing zero", "If you subtract more than you started with, you move past zero and the answer is negative. Count the steps to zero first, then the steps beyond zero.\n\nThe answer tells you how far below zero you are.", "3 - 8: 3 steps to reach 0, then 5 more steps, so the answer is -5.", "Count to zero, then keep going.", ("What is 2 - 9?", ["7", "-7", "11", "-11"], 1, "2 steps to zero and 7 more steps gives -7.")),
        _step("3", "Starting below zero", "When you start on the negative side and subtract a positive integer, you move further left, so the answer is further from zero.\n\nThis gives the same result as adding a negative integer of the same size.", "-3 - 4: start at -3, move 4 steps left, finish at -7.", "Negative start, subtract positive: keep going left.", ("What is -5 - 6?", ["-11", "-1", "1", "11"], 0, "Starting at -5 and moving 6 steps left takes you to -11.")),
        _step("4", "Order matters", "Swapping the order in a subtraction gives the opposite answer. The size stays the same but the sign changes.\n\nThis is different from addition, where the order does not matter.", "8 - 3 = 5 but 3 - 8 = -5. 12 - 7 = 5 but 7 - 12 = -5.", "a - b and b - a are opposites.", ("If 12 - 7 = 5, what is 7 - 12?", ["5", "-5", "19", "-19"], 1, "Swapping the order gives the opposite answer, which is -5.")),
        _step("5", "Subtraction as the move between two numbers", "The subtraction a - b is the move that takes you from b to a. Work out how many steps and in which direction.\n\nThis is different from distance, which has no direction and is never negative.", "2 - 7: from 7 to 2 is 5 steps left, so the answer is -5. The distance between 2 and 7 is 5.", "a - b: from b to a.", ("Which move shows 3 - 9?", ["From 9 to 3, 6 steps left", "From 3 to 9, 6 steps right", "From 0 to 12", "From 9 to 3, 12 steps"], 0, "3 - 9 is the move from 9 to 3, which is 6 steps left, so the answer is -6.")),
        _step("6", "Check by adding back", "Subtraction is the inverse of addition. After you subtract, add the same number back. You should get the number you started with.\n\nThis is a quick, reliable check.", "7 - 12 = -5. Check: -5 + 12 = 7. Correct.", "Add it back to check.", ("If -4 + 9 = 5, what is 5 - 9?", ["-4", "4", "14", "-14"], 0, "Subtracting 9 undoes adding 9, so 5 - 9 = -4.")),
        _step("7", "Real problems", "Falling temperatures, spending more than you have and going down floors are all subtractions. Write the starting amount, subtract the amount taken away, and say what the answer means.\n\nA negative answer means below zero, in debt or below ground.", "The temperature is 4 degrees and falls 9 degrees: 4 - 9 = -5 degrees.", "Write the problem as a subtraction, then check on the number line.", ("The temperature is 4 degrees and drops 9 degrees. What is it now?", ["13", "5", "-5", "-13"], 2, "4 - 9 = -5 degrees.")),
    ],
    (
        "Scenario: At a ski resort the temperature at noon is 6 degrees. Over the afternoon and night the temperature falls by 4, then 5, then 6, then 2 degrees.\n\n"
        "Step 1, write each fall as a subtraction and follow the temperature. After the first fall: 6 - 4 = 2. After the second: 2 - 5 = -3. After the third: -3 - 6 = -9. After the fourth: -9 - 2 = -11. The final temperature is -11 degrees.\n\n"
        "Step 2, check each step on the number line. 2 - 5: 2 steps to zero and 3 more gives -3. -3 - 6: from -3 move 6 steps left to reach -9. Both agree.\n\n"
        "Step 3, check using the total fall. The falls add up to 4 + 5 + 6 + 2 = 17 degrees. Then 6 - 17 = -11. This matches the step-by-step answer.\n\n"
        "Step 4, check by adding back. -11 + 17 = 6, which is where we started, so the subtraction is correct.\n\n"
        "Step 5, when did the temperature first go below zero? After the second fall, when it reached -3 degrees.\n\n"
        "Step 6, the change from noon to the end. The final temperature is -11 and the noon temperature was 6. The move from 6 to -11 is 17 steps left. So -11 - 6 = -17. The distance between the two temperatures is 17 degrees, which is the same size without the sign.\n\n"
        "Reasoning check. Well done, {{name}}. You used the number line to move, a total to check, and addition to confirm the answer."
    ),
    (
        "Work through these on paper or in the practice boxes. Part A (subtracting): work out 9 - 4, 4 - 9, 12 - 20, 0 - 7, -3 - 5, -10 - 15 and -1 - 1. Part B (order matters): work out 15 - 6 and 6 - 15, and then 25 - 40 and 40 - 25. What do you notice about each pair? Part C (check by adding back): work out 11 - 15 and 7 - 12, and then check each by adding back the number you subtracted. Part D (missing numbers): find the number that goes in the gap. 5 - ? = -2, ? - 8 = -3, -4 - ? = -10, ? - 9 = -9. Part E (difference or distance): for 3 and 11, find the distance between them, then 3 - 11 and 11 - 3. For -5 and 4, find the distance between them and work out -5 - 4. Explain how a - b is different from the distance. Part F (real problems): the temperature is 3 degrees and falls 8 degrees; a lift is on floor 2 and goes down 6 floors; an account has $15 and $40 is paid out. Write each as a subtraction and give the answer with units."
    ),
    (
        "Mission: Polar Station Weather Log. A polar station records -2 degrees at 6 am. During the day and night the temperature falls by 3, then 4, then 6, then 2, then 8 degrees at later checks. Type your answers in the boxes.\n\n"
        "(a) Write each fall as a subtraction and find the temperature after each one.\n"
        "(b) Find the total fall in degrees. Check the final temperature with a single subtraction, starting from -2.\n"
        "(c) A freezer alarm sounds when the temperature goes below -20 degrees. After which fall did the alarm first sound, and by how many degrees was the temperature below -20 at the end?\n"
        "(d) A second station starts at 4 degrees and has the same total fall. Find its final temperature, and say how many degrees warmer or colder it is than the first station at the end.\n"
        "(e) Use addition to check your answer to part (b).\n"
        "(f) A student works out 3 - 8 and gets 5 because 'you subtract the smaller from the larger'. Explain in two or three sentences what mistake was made and give the correct answer.\n"
        "(g) Make up your own weather log with five falls that starts above zero and ends below zero. Write each fall as a subtraction, give the temperature after each and check with the total fall."
    ),
    "Type your answers in the practice boxes. Show each step as a subtraction and write full sentences for the explanation questions.",
    "Did I move left to subtract a positive integer, cross zero correctly, remember that order matters, think of a - b as the move from b to a, and check my answer by adding back?",
    [
        _q("What is 7 - 12?", ["5", "-5", "19", "-19"], 1, "7 steps to zero and 5 more gives -5."),
        _q("What is -4 - 6?", ["-10", "-2", "2", "10"], 0, "Move 6 steps left from -4 to reach -10."),
        _q("What is 0 - 9?", ["9", "-9", "0", "1"], 1, "Move 9 steps left from 0 to reach -9."),
        _q("If 20 - 8 = 12, what is 8 - 20?", ["12", "-12", "28", "-28"], 1, "Swapping the order gives the opposite answer."),
        _q("Subtracting a positive integer moves you...", ["to the right", "to the left", "nowhere", "to zero"], 1, "Subtracting a positive moves left on the number line."),
        _q("Which statement is true?", ["5 - 9 = 4", "5 - 9 = -4", "5 - 9 = 14", "5 - 9 = -14"], 1, "5 steps to zero and 4 more gives -4."),
        _q("The temperature is 3 degrees and falls 8 degrees. What is it now?", ["5", "-5", "11", "-11"], 1, "3 - 8 = -5 degrees. Great work, {{name}}."),
        _q("If -4 + 9 = 5, what is 5 - 9?", ["-4", "4", "14", "-14"], 0, "Subtracting 9 undoes adding 9, so 5 - 9 = -4."),
        _q("What is the distance between 3 and 11 on the number line?", ["-8", "8", "14", "-14"], 1, "From 3 to 11 is 8 steps, and a distance is never negative."),
        _q("What number goes in the gap? ? - 8 = -3", ["-11", "-5", "5", "11"], 2, "5 - 8 = -3, so the missing number is 5."),
    ],
    "Type your answers in the practice boxes and submit them. Include full sentences for parts (c), (d), (f) and (g).",
    "Extension: a sneak preview. We can use the idea that a - b is the move from b to a. Use it to work out the move from -5 to -3. What is -3 - (-5)? Then work out the move from -2 to -9, which is -9 - (-2), and the move from 4 to 4. What do you notice about the answers when the number being subtracted is negative? Write a prediction about what happens next lesson, and explain it using the number line.",
    [("integer", "A whole number that can be positive, negative or zero"), ("subtract", "To take one number away from another; on the number line, to move left by a positive amount"), ("difference", "The result of a subtraction; the move from the second number to the first"), ("number line", "A line showing numbers in order, with zero in the middle"), ("inverse operation", "An operation that undoes another, such as subtraction undoing addition"), ("distance", "How far apart two numbers are; never negative"), ("order", "Which number comes first; it matters in subtraction")],
    [],
    _sort("Will the answer be positive, negative or zero?", "Picture the number line and sort each subtraction by the sign of its answer.", ["Positive", "Negative", "Zero"], [("9 - 4", 0), ("4 - 9", 1), ("6 - 6", 2), ("0 - 5", 1), ("15 - 10", 0), ("3 - 12", 1), ("-2 - 2", 1), ("20 - 20", 2)]),
    [
        _wc("What is 6 - 10?", ["4", "-4", "16"], 1, "6 steps to zero and 4 more gives -4."),
        _wc("What is -3 - 2?", ["-5", "-1", "5"], 0, "Move 2 steps left from -3 to reach -5."),
        _wc("What is 10 - 10?", ["0", "20", "-20"], 0, "Taking away everything leaves zero."),
        _wc("Subtracting a positive integer moves you...", ["left", "right", "up"], 0, "Left is the direction of smaller numbers."),
        _wc("What is 0 - 4?", ["4", "-4", "0"], 1, "Move 4 steps left from 0 to reach -4."),
        _wc("What is -8 - 8?", ["-16", "0", "16"], 0, "Move 8 steps left from -8 to reach -16."),
        _wc("If 9 - 5 = 4, what is 5 - 9?", ["4", "-4", "14"], 1, "Swapping the order gives the opposite answer."),
        _wc("What is 2 - 11?", ["9", "-9", "13"], 1, "2 steps to zero and 9 more gives -9."),
    ],
    [
        {"key": "partA", "label": "Part A: subtracting", "hint": "9 - 4, 4 - 9, 12 - 20, 0 - 7, -3 - 5, -10 - 15, -1 - 1."},
        {"key": "partB", "label": "Part B: order matters", "hint": "15 - 6 and 6 - 15, 25 - 40 and 40 - 25. What do you notice?"},
        {"key": "partC", "label": "Part C: check by adding back", "hint": "11 - 15 and 7 - 12, each checked by adding back."},
        {"key": "partD", "label": "Part D: missing numbers", "hint": "5 - ? = -2, ? - 8 = -3, -4 - ? = -10, ? - 9 = -9."},
        {"key": "partE", "label": "Part E: difference or distance", "hint": "3 and 11. -5 and 4. How is a - b different from distance?"},
        {"key": "partF", "label": "Part F: real problems", "hint": "3 degrees falls 8. Floor 2 down 6. $15 and $40 paid out."},
        {"key": "taskA", "label": "Weather log (a): temperatures", "hint": "Each fall as a subtraction and the temperature after it."},
        {"key": "taskB", "label": "Weather log (b): total fall", "hint": "Total fall, then one subtraction from -2."},
        {"key": "taskC", "label": "Weather log (c): the alarm", "hint": "After which fall below -20? How far below at the end?"},
        {"key": "taskD", "label": "Weather log (d): second station", "hint": "Start 4 degrees, same total fall. Compare final temperatures."},
        {"key": "taskE", "label": "Weather log (e): check by adding", "hint": "Add the total fall back to your final temperature."},
        {"key": "taskF", "label": "Weather log (f): the student's mistake", "hint": "Two or three sentences about 3 - 8 = 5."},
        {"key": "taskG", "label": "Weather log (g): my own log", "hint": "Five falls, start above zero, end below zero, check with the total."},
    ],
    ["Subtracting the smaller number from the larger number whatever the order, such as 3 - 8 = 5", "Moving right when subtracting", "Thinking subtraction is the same in either order", "Stopping at zero instead of carrying on past it", "Confusing the answer to a - b with the distance between a and b", "Not checking by adding back"],
    ["Record the temperature at the same time each day for a week. Write the change from day to day as a subtraction and check with the total change.", "Walk a number line drawn on the floor to act out ten subtractions, saying the move aloud each time.", "Make a pack of subtraction cards with a - b on one side and b - a on the other. Ask a partner to predict the sign before turning the card."],
    "Part A: 9 - 4 = 5; 4 - 9 = -5; 12 - 20 = -8; 0 - 7 = -7; -3 - 5 = -8; -10 - 15 = -25; -1 - 1 = -2. Part B: 15 - 6 = 9 and 6 - 15 = -9; 25 - 40 = -15 and 40 - 25 = 15; in each pair the answers are opposites. Part C: 11 - 15 = -4, check -4 + 15 = 11; 7 - 12 = -5, check -5 + 12 = 7. Part D: 7 (since 5 - 7 = -2); 5 (since 5 - 8 = -3); 6 (since -4 - 6 = -10); 0 (since 0 - 9 = -9). Part E: the distance between 3 and 11 is 8; 3 - 11 = -8; 11 - 3 = 8; the distance between -5 and 4 is 9; -5 - 4 = -9; the distance is always positive and has no direction, while a - b is the signed move from b to a. Part F: 3 - 8 = -5 degrees; 2 - 6 = floor -4; 15 - 40 = -$25. Weather log (a): -2 - 3 = -5; -5 - 4 = -9; -9 - 6 = -15; -15 - 2 = -17; -17 - 8 = -25. (b): the total fall is 3 + 4 + 6 + 2 + 8 = 23, and -2 - 23 = -25, which matches. (c): the alarm first sounded after the final fall (-25 is below -20, and -17 is not); at the end it was 5 degrees below -20. (d): 4 - 23 = -19 degrees; the second station is 6 degrees warmer than the first (-19 compared with -25). (e): -25 + 23 = -2, which is the starting temperature. (f): the student subtracted the smaller number from the larger and ignored the order; 3 - 8 means starting at 3 and moving 8 left, so the correct answer is -5. (g): accept any five falls starting above zero and ending below zero, with correct temperatures and a correct total check. Quiz answers: -5; -10; -9; -12; to the left; 5 - 9 = -4; -5; -4; 8; 5.",
)
