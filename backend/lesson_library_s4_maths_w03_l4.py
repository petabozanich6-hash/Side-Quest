"""Stage 4 Mathematics, Week 3 Lesson 4: Integers, Integers in context: temperature, money and elevation.
All written work is typed inside the lesson. Replaces the placeholder with seed_key s4-maths-w03-l4.
No video is attached: none has been found and tested for this topic yet. Add one in the video and link run.
Outcome codes MA4-INT-C-01 and MAO-WM-01 are from the draft mapping and should be re-checked against NESA.
The quiz uses approximate real heights (Mount Kosciuszko about 2,228 m, Kati Thanda-Lake Eyre about -15 m). Check these before release.
The temperature-and-height rule in the extension is a simplified pretend rule for practice, and it is labelled that way.
Builds on W3 L1 to L3. Next is W3 L5, integer problem solving and unit review.
"""
from lesson_library_s4_builder import build_s4, _q, _step, _sort, _wc

LESSON = build_s4(
    "s4-maths-w03-l4",
    "Week 3, Lesson 4: Integers in Context: Temperature, Money and Elevation",
    "Real situations use integers all the time. Learn to turn words into integers, find the final value, the difference and the net change, and decide whether an answer makes sense.",
    "Integers",
    ["MA4-INT-C-01", "MAO-WM-01"],
    {
        "MA4-INT-C-01": "Primary. Uses integers to represent and solve problems about temperature, money and elevation, including final value, difference, net change and mean.",
        "MAO-WM-01": "Working mathematically: translates words to calculations, chooses an operation and checks that the answer and its sign make sense in the situation.",
    },
    "We are learning to use integers to solve real problems about temperature, money and elevation.",
    ["I can write a real situation as a positive or negative integer.", "I can find a final value from a start and a change.", "I can find the difference between two values.", "I can find the net change from a start and a final value.", "I can solve multi-step problems about money and elevation.", "I can use rates and means with integers.", "I can check that an answer and its sign make sense."],
    ["integer", "above and below sea level", "deposit", "withdrawal", "balance", "overdrawn", "net change", "difference", "elevation", "mean"],
    ["This lesson (everything you need is inside it)", "Paper and pencil", "A printed number line or a drawing of a thermometer (optional)"],
    "You can add, subtract, multiply and divide integers and use the order of operations (Week 3 Lessons 1 to 3).",
    (
        "Why this matters. Weather reports, bank statements and maps all use negative numbers. A balance of -$45 means you owe $45. An elevation of -15 m means 15 m below sea level. A temperature of -4 degrees is below freezing. To solve problems with them you need to turn each situation into an integer and decide which operation to use.\n\n"
        "Reading the situation. Up, above, rise, deposit, profit and gain are positive. Down, below, fall, withdrawal, fee, debt and loss are negative. Zero is the starting point: sea level, the freezing point of water, or a balance of nothing.\n\n"
        "Finding a final value. Final value = start + change. A temperature of -4 that rises 9 is -4 + 9 = 5. A temperature of -4 that falls 7 is -4 + (-7) = -11.\n\n"
        "Finding a difference. The difference between two values is the larger minus the smaller. The difference between 14 and -6 is 14 - (-6) = 20. Draw a number line to see it: from -6 to 0 is 6 and from 0 to 14 is 14, so the distance is 20.\n\n"
        "Finding a net change. Net change = final value - start value. From -3 to 8 is 8 - (-3) = 11. From 5 to -7 is -7 - 5 = -12. A negative net change means the value went down.\n\n"
        "Rates and means. A total change divided by the time gives the rate: -18 degrees over 6 days is -3 degrees per day. A rate times a time gives a change: a diver who descends 15 m a minute for 8 minutes changes by 8 x (-15) = -120 m. A mean is the total divided by how many values there are.\n\n"
        "Checking. Ask whether the sign and the size make sense. A fall should give a smaller value, a deposit should give a bigger balance, and a distance between two values can never be negative."
    ),
    [
        _step("1", "Reading a situation as an integer", "Decide whether the situation is above or below zero, a gain or a loss. Write the amount with the right sign.\n\nA deposit is positive, and a withdrawal is negative.", "A withdrawal of $30 is -30. 5 m below sea level is -5. A temperature drop of 4 degrees is -4.", "Gain is positive. Loss is negative.", ("Which integer shows a withdrawal of $80?", ["80", "-80", "0", "8"], 1, "A withdrawal takes money out, so it is negative.")),
        _step("2", "Final value from a start and a change", "Add the change to the start. A fall is a negative change.\n\nWrite the addition with the signs showing.", "-4 and rises 9: -4 + 9 = 5. -4 and falls 7: -4 + (-7) = -11.", "Final = start + change.", ("The temperature is -6 degrees and falls 5 degrees. What is it now?", ["-1", "11", "-11", "1"], 2, "-6 + (-5) = -11.")),
        _step("3", "Difference between two values", "Subtract the smaller value from the larger. The distance between two values is positive.\n\nA number line helps you see it.", "The difference between 14 and -6 is 14 - (-6) = 20.", "Larger minus smaller.", ("What is the difference between 9 and -7?", ["2", "16", "-16", "-2"], 1, "9 - (-7) = 9 + 7 = 16.")),
        _step("4", "Money and balances", "A balance can go below zero when an account is overdrawn. Add deposits as positives and subtract withdrawals and fees.\n\nWork from left to right with a running total.", "-45 + 120 - 15 - 60 = 0. The account is back to zero.", "Keep a running balance.", ("A balance of -30 gets a deposit of 50 and then a withdrawal of 35. What is the balance?", ["15", "-45", "-15", "45"], 2, "-30 + 50 = 20, then 20 - 35 = -15.")),
        _step("5", "Elevation", "Elevation is the height above sea level, and a place below sea level has a negative elevation. Going up adds, going down subtracts.\n\nSketch a vertical number line.", "A hut at 80 m goes down 130 m. 80 - 130 = -50, which is 50 m below sea level.", "Up adds, down subtracts.", ("A submarine at -120 m rises 45 m. Where is it now?", ["-165", "-75", "75", "165"], 1, "-120 + 45 = -75.")),
        _step("6", "Net change", "Subtract the start from the final value. The sign tells you whether it went up or down.\n\nA negative net change is a decrease.", "From -3 to 8 the net change is 8 - (-3) = 11. From 5 to -7 it is -7 - 5 = -12.", "Net change = final - start.", ("A temperature goes from 4 to -9. What is the net change?", ["13", "5", "-13", "-5"], 2, "-9 - 4 = -13.")),
        _step("7", "Rates and means", "Multiply a rate by a time for a total change. Divide a total change by a time for a rate. Divide a total by the number of values for a mean.\n\nKeep the signs through every step.", "A diver descends 15 m a minute for 8 minutes: 8 x (-15) = -120 m. A fall of 18 degrees over 6 days is -18 \u00f7 6 = -3 degrees per day.", "Rate x time = change.", ("A diver descends 15 m each minute for 8 minutes from the surface. What is the final depth?", ["120", "-23", "-120", "23"], 2, "8 x (-15) = -120, so the diver is at -120 m.")),
    ],
    (
        "Scenario: A surveyor starts at an elevation of 120 m. She walks down 75 m to a lake shore, takes a mine lift down 160 m, then climbs up 60 m.\n\n"
        "Step 1, write each stop. Start: 120. After the walk: 120 - 75 = 45. After the lift: 45 - 160 = -115. After the climb: -115 + 60 = -55.\n\n"
        "Step 2, net change. Final - start = -55 - 120 = -175. Check by adding the moves: -75 - 160 + 60 = -175. It agrees.\n\n"
        "Step 3, difference between the highest and lowest stops. The highest was 120 m and the lowest was -115 m. 120 - (-115) = 235 m.\n\n"
        "Step 4, rate. The trip took 5 hours, so the mean change per hour is -175 \u00f7 5 = -35 m per hour. Check: 5 x (-35) = -175.\n\n"
        "Step 5, check the signs. She went down more than she went up, so the net change is negative, and the final elevation is below sea level. The difference between two heights is positive.\n\n"
        "Good work, {{name}}. Each answer was checked in two ways."
    ),
    (
        "Work through these on paper or in the practice boxes, one step per line. Part A (integers from words): write an integer for each. 12 m below sea level, $45 owed, a temperature drop of 8 degrees, 30 m above sea level, and a withdrawal of $20. Part B (temperature): find the final temperature when -4 rises 9, when 3 falls 11 and when -7 rises 7. Find the difference between a maximum of 14 and a minimum of -9. Then for the daily temperatures Monday -3, Tuesday 2, Wednesday -6 and Thursday 5, find the difference between the warmest and coldest days and the change from each day to the next. Part C (money): find the balance when you start with 40 and withdraw 75, when you start with -20, deposit 90 and pay a fee of 12, and when you start with -65, make two deposits of 40 and then pay 30. Find the net change from -25 to 60, and from 30 to -45. Part D (elevation): find the change in elevation from 85 m to -30 m. Using about 2,228 m for Mount Kosciuszko and about -15 m for Kati Thanda-Lake Eyre, find the difference in height. A submarine at -200 m rises 85 m and then dives 150 m, so find its final depth. Part E (rates and means): a temperature of 5 falls 4 degrees each hour for 6 hours, so find the final temperature; a diver descends 12 m each minute for 5 minutes, so find the change in depth; find the mean of -6, -2, -9, 3 and -1. Part F (spot the error): each of these has a mistake. Say what went wrong and give the correct answer: the difference between 8 and -5 is 3; a temperature of -3 falls 5 and is now 2; the net change from -6 to 4 is -2. Part G (multi-step): a balance starts at -30, then there are 3 deposits of 25, 2 fees of 8 and a withdrawal of 50. Write one calculation and find the final balance."
    ),
    (
        "Mission: Expedition Log. A team starts Day 1 at a camp at 350 m elevation with a night temperature of -4 degrees. Each day the elevation and the night temperature change as follows. Day 2: climb 420 m, temperature falls 6 degrees. Day 3: climb 380 m, temperature falls 5 degrees. Day 4: descend 700 m, temperature rises 9 degrees. Day 5: descend 520 m into a cave system, temperature rises 12 degrees. Type your answers in the boxes.\n\n"
        "(a) Find the elevation and the night temperature for Days 2 to 5.\n"
        "(b) Find the net change in elevation and in temperature from Day 1 to Day 5.\n"
        "(c) Find the highest and lowest elevations and the difference between them. Then find the warmest and coldest temperatures and the difference between them.\n"
        "(d) Find the mean daily change in elevation over the four moves.\n"
        "(e) The team's account starts at -$200 (overdrawn). It receives a grant of $1,500, pays $640 for equipment, pays $45 a day for food for 5 days and pays $60 a day for fuel for 3 days. Write one calculation for the final balance and work it out.\n"
        "(f) A student says: 'The difference between the highest elevation, 1,150 m, and the lowest, -70 m, is 1,150 - 70 = 1,080 m.' Explain in two or three sentences what the mistake is and give the correct difference.\n"
        "(g) Write your own problem that uses temperature, money or elevation and has a negative answer. Write the calculation and the answer, and say why a negative answer makes sense."
    ),
    "Type your answers in the practice boxes. Show each calculation with its signs, include the units, and write full sentences for the explanation questions.",
    "Did I write each situation as an integer with the right sign, choose between add, subtract, multiply and divide, show the calculation, and check that my answer makes sense in the situation?",
    [
        _q("Which integer shows a withdrawal of $80?", ["80", "-80", "0", "8"], 1, "A withdrawal is a loss, so it is negative."),
        _q("The temperature is -6 degrees and falls 5 degrees. What is it now?", ["-1", "11", "-11", "1"], 2, "-6 + (-5) = -11."),
        _q("What is the difference between 9 and -7?", ["2", "16", "-16", "-2"], 1, "9 - (-7) = 16."),
        _q("A balance of -30 gets a deposit of 50, then a withdrawal of 35. What is the balance?", ["15", "-45", "-15", "45"], 2, "-30 + 50 - 35 = -15."),
        _q("A submarine at -120 m rises 45 m. Where is it now?", ["-165", "-75", "75", "165"], 1, "-120 + 45 = -75."),
        _q("A temperature goes from 4 to -9. What is the net change?", ["13", "5", "-13", "-5"], 2, "-9 - 4 = -13."),
        _q("A diver descends 15 m each minute for 8 minutes from the surface. What is the final depth?", ["120", "-23", "-120", "23"], 2, "8 x (-15) = -120."),
        _q("The highest point is about 2,228 m and the lowest is about -15 m. What is the difference?", ["2,213 m", "2,243 m", "-2,243 m", "2,228 m"], 1, "2,228 - (-15) = 2,243."),
        _q("What is the mean of -6, -2, -9, 3 and -1?", ["3", "-15", "-3", "15"], 2, "The total is -15, and -15 \u00f7 5 = -3. Good work, {{name}}."),
        _q("A balance changes from 25 to -40. What is the net change?", ["65", "-65", "-15", "15"], 1, "-40 - 25 = -65."),
    ],
    "Type your answers in the practice boxes and submit them. Include full sentences for parts (f) and (g).",
    "Extension: a simplified pretend rule. Suppose the temperature falls by 6 degrees for every 1,000 m you climb, starting from 20 degrees at sea level (this is only a practice rule). Work out the temperature at 2,000 m, at 3,000 m and at 4,000 m. Then find the elevation at which the temperature would be -4 degrees. Next, design an expedition planner with three locations, one of them below sea level, and find all three pairwise differences in elevation. Explain which operation you used for each and why.",
    [("integer", "A whole number that can be positive, negative or zero"), ("above and below sea level", "Positive and negative elevations measured from sea level"), ("deposit", "Money put into an account, a positive change"), ("withdrawal", "Money taken out of an account, a negative change"), ("balance", "The amount of money in an account"), ("overdrawn", "Having a negative balance"), ("net change", "The final value minus the start value"), ("difference", "How far apart two values are, the larger minus the smaller"), ("elevation", "Height above or below sea level"), ("mean", "The total of the values divided by how many there are")],
    [],
    _sort("Positive, negative or zero?", "Decide how each situation is written as an integer, then sort it.", ["Positive", "Negative", "Zero"], [("A $40 deposit", 0), ("A $40 fee", 1), ("10 m below sea level", 1), ("Sea level", 2), ("A rise of 6 degrees", 0), ("The freezing point of water in degrees Celsius", 2), ("An overdrawn balance", 1), ("A profit of $25", 0)]),
    [
        _wc("-3 degrees rises 8. What is the new temperature?", ["5", "-11", "11"], 0, "-3 + 8 = 5."),
        _wc("2 degrees falls 7. What is the new temperature?", ["9", "-5", "5"], 1, "2 - 7 = -5."),
        _wc("What is the difference between 6 and -4?", ["2", "10", "-10"], 1, "6 - (-4) = 10."),
        _wc("A balance of -20 gets a $50 deposit. What is the balance?", ["30", "-30", "70"], 0, "-20 + 50 = 30."),
        _wc("A diver at -50 m dives 25 m more. Where is the diver?", ["75", "-25", "-75"], 2, "-50 - 25 = -75."),
        _wc("An elevation of 40 m goes down 90 m. What is the new elevation?", ["-50", "50", "130"], 0, "40 - 90 = -50."),
        _wc("What is the net change from -8 to 3?", ["-11", "11", "-5"], 1, "3 - (-8) = 11."),
        _wc("A balance of -25 gets four deposits of $15. What is the balance?", ["-85", "35", "-35"], 1, "-25 + 4 x 15 = 35."),
    ],
    [
        {"key": "partA", "label": "Part A: integers from words", "hint": "12 m below sea level, $45 owed, a drop of 8 degrees, 30 m above sea level, a $20 withdrawal."},
        {"key": "partB", "label": "Part B: temperature", "hint": "Final temperatures, the difference between 14 and -9, and the four-day temperatures."},
        {"key": "partC", "label": "Part C: money", "hint": "Running balances and two net changes."},
        {"key": "partD", "label": "Part D: elevation", "hint": "85 m to -30 m, the height difference and the submarine."},
        {"key": "partE", "label": "Part E: rates and means", "hint": "Rate x time, then the mean of -6, -2, -9, 3, -1."},
        {"key": "partF", "label": "Part F: spot the error", "hint": "Say what the student did wrong and give the correct answer."},
        {"key": "partG", "label": "Part G: multi-step", "hint": "One calculation with multiplication, then add and subtract."},
        {"key": "taskA", "label": "Expedition (a): days 2 to 5", "hint": "Elevation and temperature for each day, one step at a time."},
        {"key": "taskB", "label": "Expedition (b): net changes", "hint": "Final minus start for elevation and temperature."},
        {"key": "taskC", "label": "Expedition (c): highest, lowest and differences", "hint": "Larger minus smaller, for elevation and for temperature."},
        {"key": "taskD", "label": "Expedition (d): mean daily change", "hint": "Add the four changes and divide by 4."},
        {"key": "taskE", "label": "Expedition (e): final balance", "hint": "One calculation with the order of operations."},
        {"key": "taskF", "label": "Expedition (f): the student's mistake", "hint": "Two or three sentences about 1,150 - 70."},
        {"key": "taskG", "label": "Expedition (g): your own problem", "hint": "A story with a calculation, an answer and why the answer is negative."},
    ],
    ["Treating a fall or a withdrawal as positive", "Calculating a difference as 14 - 6 instead of 14 - (-6)", "Giving a difference or a distance as a negative number", "Subtracting the larger from the smaller when finding net change", "Thinking -10 degrees is warmer than -5 degrees", "Dropping the sign when a mean is negative"],
    ["Draw a vertical number line for temperature or elevation and mark every step on it.", "Use a bank statement table with columns for deposits, withdrawals and balance.", "Act out each problem with a story and an arrow up or down for each change."],
    "Part A: -12; -45; -8; 30; -20. Part B: -4 + 9 = 5; 3 - 11 = -8; -7 + 7 = 0; the difference is 14 - (-9) = 23; the warmest day is Thursday (5) and the coldest is Wednesday (-6), so the difference is 11; the changes are 2 - (-3) = 5 (Monday to Tuesday), -6 - 2 = -8 (Tuesday to Wednesday) and 5 - (-6) = 11 (Wednesday to Thursday). Part C: 40 - 75 = -35; -20 + 90 - 12 = 58; -65 + 2 x 40 - 30 = -15; the net change from -25 to 60 is 60 - (-25) = 85; from 30 to -45 it is -45 - 30 = -75. Part D: -30 - 85 = -115, a fall of 115 m; the difference is 2,228 - (-15) = 2,243 m; the submarine goes -200 + 85 = -115 and then -115 - 150 = -265, so it ends at -265 m. Part E: 5 + 6 x (-4) = 5 - 24 = -19 degrees; 5 x (-12) = -60 m; the mean is (-6 + (-2) + (-9) + 3 + (-1)) \u00f7 5 = -15 \u00f7 5 = -3. Part F: the difference between 8 and -5 is 8 - (-5) = 13, not 3 (the student subtracted the sizes); -3 falls 5 is -3 - 5 = -8, not 2; the net change from -6 to 4 is 4 - (-6) = 10, not -2 (the student found the wrong sign and the wrong size). Part G: -30 + 3 x 25 - 2 x 8 - 50 = -30 + 75 - 16 - 50 = -21. Expedition (a): Day 2: 350 + 420 = 770 m and -4 + (-6) = -10 degrees; Day 3: 770 + 380 = 1,150 m and -10 + (-5) = -15 degrees; Day 4: 1,150 - 700 = 450 m and -15 + 9 = -6 degrees; Day 5: 450 - 520 = -70 m and -6 + 12 = 6 degrees. (b): the net change in elevation is -70 - 350 = -420 m and in temperature is 6 - (-4) = 10 degrees. (c): the highest elevation is 1,150 m and the lowest is -70 m, so the difference is 1,150 - (-70) = 1,220 m; the warmest temperature is 6 and the coldest is -15, so the difference is 6 - (-15) = 21 degrees. (d): the four moves are +420, +380, -700 and -520, which total -420, and -420 \u00f7 4 = -105 m per day. (e): -200 + 1,500 - 640 - 5 x 45 - 3 x 60 = -200 + 1,500 - 640 - 225 - 180 = 255, so the final balance is $255. (f): the student added the 70 instead of subtracting a negative; the difference is 1,150 - (-70) = 1,220 m, which is the distance from -70 m up to 1,150 m. (g): accept any sensible problem with a correct calculation, a negative answer and a sensible explanation. Quiz answers: -80; -11; 16; -15; -75; -13; -120; 2,243 m; -3; -65. Extension: 20 - 2 x 6 = 8 degrees at 2,000 m; 20 - 3 x 6 = 2 degrees at 3,000 m; 20 - 4 x 6 = -4 degrees at 4,000 m; the temperature is -4 degrees at 4,000 m.",
)
