# s3-mat-y6-w01-l2 — Place value and expanded form

**Year:** 6 | **Stage:** 3 | **Subject:** Mathematics | **Week:** 1 | **Lesson:** 2 | **Unit:** Large numbers and estimation | **Role:** Strategies  
**Existing title:** Place value and expanded form  
**Existing attached outcome codes:** The source migration `worker/migrations/0013_s3_maths_program.sql` inserts `outcome_codes: []` for this Coming Soon lesson. **Do not invent a code.** If the live database contains a later attached outcome, Cursor must retain it unchanged.  
**Manuscript status:** FULL INSTRUCTIONAL DRAFT — ready for implementation preview, not owner-approved.  
**Target time:** about 55–65 minutes, with optional break.  
**Materials:** pencil and paper or digital working space; optional printable place-value grid. No video.

## 1. Student opening — the mystery of the missing zeros (5 min)

**Pip:** “I found two treasure records. One says 4,306,052 coins. The other says 4,360,052. They look almost the same. Are they?”

**Juno:** “The digits are almost the same, but where a digit sits changes what it is worth. Let's investigate before we count any treasure.”

**Try first:** In `4,306,052`, what is the value of the digit `3`? Choose: 3, 3,000, 30,000, or 300,000. Write *why* you chose it.

**Feedback:** Correct: **300,000**. The 3 is in the hundred-thousands place. If you chose 3, you named the digit, not its value. If you chose 30,000 or 3,000, you counted too few places from the right. We will use a place-value chart to make this visible.

**Today's mission:** Explain the value of each digit in a large whole number, write numbers in expanded form, rebuild numbers from expanded form, and spot errors caused by missing zeros.

**Success looks like:** I can (1) identify a digit's value, (2) expand a large number correctly, (3) rebuild it without losing zero placeholders, and (4) explain why my answer makes sense.

## 2. Teaching — a digit has a face value and a place value (9 min)

A **digit** is one symbol from 0 to 9. Its **face value** is the digit itself. Its **place value** depends on its position in the number.

Read positions from right to left:

| Millions | Hundred thousands | Ten thousands | Thousands | Hundreds | Tens | Ones |
|---:|---:|---:|---:|---:|---:|---:|
| 4 | 3 | 0 | 6 | 0 | 5 | 2 |

This chart represents **4,306,052**.

- The 4 means **4,000,000**, not 4.
- The 3 means **300,000**, not 3,000.
- The 0 in ten-thousands means **no ten-thousands**.
- The 6 means **6,000**.
- The 0 in hundreds means **no hundreds**.
- The 5 means **50**.
- The 2 means **2**.

Our number system is **base ten**: moving one column left makes a digit worth ten times as much; moving one column right makes it worth one-tenth as much. Compare the digit 6 in 6, 60, 600, 6,000 and 60,000. The digit stays the same; the amount it represents changes.

**Pause and think:** In 4,306,052, would replacing the digit 6 with 7 add 1, 10, 100 or 1,000?  
**Answer:** 1,000, because the thousands column increases from 6,000 to 7,000.

### Why zero matters

Zero is not “nothing to worry about.” It holds a place so the other digits keep their correct values.

Compare **604,020** with **64,020**:

- 604,020 = six hundred four thousand and twenty.
- 64,020 = sixty-four thousand and twenty.

Removing a zero has moved the 6 from the hundred-thousands place to the ten-thousands place. The number is now much smaller.

**Misconception check:** Does the zero in 604,020 contribute a positive amount to the sum? No. Does its position matter in the written numeral? Absolutely.

## 3. Teaching — expanded form (8 min)

**Standard form** is the usual numeral: **4,306,052**.

**Expanded form** writes the number as a sum of the values of its nonzero digits:

**4,306,052 = 4,000,000 + 300,000 + 6,000 + 50 + 2.**

To expand a number:
1. Write the number in a place-value chart.
2. Identify each nonzero digit and its column.
3. Write the full value of that digit.
4. Add the values together, largest first.
5. Check that recombining them gives the original number.

You can omit a **zero-value term** from the sum, but you must keep zeros where needed when you write the standard numeral.

### Worked example A: expand 70,040,009

| Ten millions | Millions | Hundred thousands | Ten thousands | Thousands | Hundreds | Tens | Ones |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 7 | 0 | 0 | 4 | 0 | 0 | 0 | 9 |

The nonzero values are **70,000,000**, **40,000** and **9**.

So **70,040,009 = 70,000,000 + 40,000 + 9**.

**Why isn't the 4 worth 4,000?** It is in the ten-thousands column, so it means four groups of 10,000: 40,000.

### Worked example B: rebuild a number

**8,000,000 + 20,000 + 600 + 5**

Place each part in its column: 8 millions, 2 ten-thousands, 6 hundreds, 5 ones. The unmentioned columns contain zero.

The numeral is **8,020,605**, not 8,206,005.

Check: 8,020,605 has 8,000,000 + 20,000 + 600 + 5.

### Worked example C: explain an error

A student writes: **604,020 = 600,000 + 4,000 + 200**.

**Juno:** “The first two terms are right. But 200 means two hundreds. The numeral has zero hundreds and two tens.”

Correct: **604,020 = 600,000 + 4,000 + 20**.

## 4. Guided practice — we solve it together (10 min)

Show one question at a time. Allow students to write or select an answer, request a hint, and retry. Never reveal the correct answer before an attempt unless the student explicitly requests the worked solution.

**G1 — Find a digit's value.** In **9,508,143**, what is the value of the digit **5**?  
Hint 1: Locate the 5 in the place-value chart. Hint 2: It is in the hundred-thousands column.  
**Answer:** 500,000.  
Wrong-answer feedback: 5 is the face value; 50,000 confuses hundred-thousands with ten-thousands; 5,000 confuses it with thousands.

**G2 — Expand a number.** Complete: **3,204,070 = 3,000,000 + ___ + 4,000 + ___**.  
Hint: Which nonzero digits are left?  
**Answer:** 200,000 and 70.  
Feedback: The 2 means two hundred-thousands; the 7 means seven tens. Zero hundreds and zero ones do not need separate addition terms.

**G3 — Rebuild.** Write in standard form: **6,000,000 + 90,000 + 800 + 3**.  
Hint: Write the place-value columns from millions to ones before filling them.  
**Answer:** 6,090,803.  
If answer is 6,908,003: The 9 belongs in ten-thousands, not hundred-thousands; the 8 belongs in hundreds, not thousands.

**G4 — Explain why.** Is **2,030,400** equal to **2,000,000 + 30,000 + 400**?  
**Answer:** Yes. The 2 is millions, 3 is ten-thousands, 4 is hundreds. The other places have zero value.  
Model explanation: “Each term matches a nonzero digit's position, and their sum is 2,030,400.”

**G5 — Spot the mistake.** Pip says **5,007,060 = 5,000,000 + 7,000 + 600**. What needs correcting?  
**Answer:** The final term must be **60**, not 600. The digit 6 is in the tens place. Correct expansion: 5,000,000 + 7,000 + 60.  
Feedback: The written zero in the hundreds place tells us there are no hundreds.

## 5. Independent practice — your turn (12 min)

Students answer before opening solutions. Accept numerically equivalent expansions when every term is a correct place-value contribution, but request standard expanded form for the main response.

**I1.** What is the value of 8 in **18,402,006**?  
**Answer:** 8,000,000. Explanation: 8 is in the millions place.

**I2.** Expand **6,050,304**.  
**Answer:** 6,000,000 + 50,000 + 300 + 4.

**I3.** Expand **40,700,020**.  
**Answer:** 40,000,000 + 700,000 + 20.

**I4.** Write in standard form: **9,000,000 + 400,000 + 2,000 + 10 + 6**.  
**Answer:** 9,402,016.

**I5.** Write in standard form: **30,000,000 + 80,000 + 900 + 7**.  
**Answer:** 30,080,907.

**I6.** Explain why **7,020,005** is not the same as **7,200,005**.  
**Model:** In the first number the 2 means 20,000; in the second it means 200,000. The second number is 180,000 greater.

**I7.** A student writes **2,405,080 = 2,000,000 + 400,000 + 5,000 + 800**. Identify the error and correct the expansion.  
**Answer:** The last term should be 80, not 800. Correct: 2,000,000 + 400,000 + 5,000 + 80.

**I8.** Construct the largest whole number you can with digits **0, 2, 4, 6, 8, 9**, using each once, and write its expanded form.  
**Answer:** 986,420 = 900,000 + 80,000 + 6,000 + 400 + 20.  
**Reasoning:** To make the largest number, place the largest available digit in the highest-value column first.

### Feedback logic

- Wrong by a factor of ten: “Check which column the digit belongs in. Move one place left to multiply its value by ten.”
- Missing internal zeros in standard form: “Build every place-value column, including the empty ones. A zero keeps later digits in their correct places.”
- Correct numeral but incorrect expansion: “Your number is right; now show the value of each nonzero digit, not just the digit itself.”
- Correct explanation: “You identified both the digit's column and its value. That is the reasoning we need.”

## 6. Application — repair the museum's labels (7 min)

A museum stores collection counts as sums so staff can check large records. Three labels have been mixed up.

**Record A:** 4,000,000 + 600,000 + 30,000 + 2,000 + 90 + 1  
**Record B:** 8,000,000 + 500,000 + 700 + 4  
**Record C:** 20,000,000 + 40,000 + 6,000 + 50

**Task 1:** Write each as a standard numeral.  
**Answers:** A **4,632,091**; B **8,500,704**; C **20,046,050**.

**Task 2:** A printed label says Record C is **20,460,050**. Explain why that is wrong.  
**Model:** The sum has 40,000 and 6,000, which together make 46,000. The incorrect label puts 4 in the hundred-thousands place, changing 40,000 to 400,000.

**Task 3 — challenge:** Change **one digit** in Record B's standard numeral so the collection count increases by exactly **10,000**. State the new numeral and why.  
**Answer:** **8,510,704**. Change the ten-thousands digit from 0 to 1. The number increases by 10,000.

**Assessment rubric:** 1 point each for three correct numerals; 2 for correct place-value error explanation; 2 for valid 10,000 change with explanation. Total 7.

## 7. Exit assessment — show what you know (7 min)

Do these without hints first.

**E1 (1 pt):** In **12,307,045**, what is the value of 3?  
**Answer:** 300,000.

**E2 (2 pts):** Expand **5,060,209**.  
**Answer:** 5,000,000 + 60,000 + 200 + 9.  
Mark 2 for all correct terms, 1 for mostly correct with one place error.

**E3 (2 pts):** Write **7,000,000 + 400,000 + 30,000 + 8** in standard form.  
**Answer:** 7,430,008.  
Mark 2 for correct numeral, 1 for correct nonzero digits but one missing zero.

**E4 (2 pts):** Explain why **3,005,020** cannot be expanded as **3,000,000 + 5,000 + 200**.  
**Model:** The numeral contains two tens, which is 20, not two hundreds. Correct: 3,000,000 + 5,000 + 20.  
Mark 1 for identifying the place error, 1 for correct expansion.

**E5 (2 pts):** A number is **6,000,000 + 80,000 + 900 + 4**. A student writes **6,809,004**. Give the correct number and explain the student's mistake.  
**Answer:** **6,080,904**. The 8 belongs in the ten-thousands column and the 9 in hundreds; the student shifted both into higher places.  
Mark 1 for correct numeral and 1 for explanation.

**Total:** 9 points. **8–9:** ready to move on. **6–7:** revisit the wrong type of question and retry an equivalent item. **0–5:** return to the place-value chart and guided examples before continuing. These thresholds are instructional guidance, not a validated psychometric scale.

### Targeted reteaching

- Missed E1: revisit the digit-value chart, then identify the 4 in 14,200,000 (**4,000,000**).
- Missed E2: expand 2,040,106 (**2,000,000 + 40,000 + 100 + 6**).
- Missed E3: rebuild 3,000,000 + 20,000 + 50 + 1 (**3,020,051**).
- Missed E4/E5: compare 5,006,070 and 5,060,700, identifying how the 6 and 7 shift value.

## 8. Reflection and next lesson (2 min)

Complete: “A zero is important in a large number because ______.”  
**Model:** “It holds an empty place so other digits stay in the correct columns.”

**Juno:** “You can now unpack a number into the value of each digit and put it back together without losing its zeros.”

**Next lesson:** Comparing and ordering large numbers. We will use place value to decide which of two large numbers is greater and explain why.

## 9. Static image and interaction briefs for Cursor

**Image 1 — place-value grid:** Accessible HTML/SVG or raster diagram showing `4,306,052` across seven labelled columns; visually distinguish zero columns and nonzero contributions. **Alt:** “Place-value chart for 4,306,052: four millions, three hundred-thousands, zero ten-thousands, six thousands, zero hundreds, five tens, two ones.” No decorative character required.

**Image 2 — zero comparison:** Side-by-side `604,020` and `64,020` with corresponding place-value grids and a callout identifying the shifted 6. **Alt:** “Removing a zero changes the position of the 6 from hundred-thousands to ten-thousands.”

**Interaction A:** Place digits into labelled columns. Validate both the digit and its column; do not accept visually shifted digits as correct.

**Interaction B:** Expanded-form input supports separated terms and equivalent ordering; canonical display uses descending place value. Check numeric value *and* requested place-value decomposition, not sum alone.

**Interaction C:** Error-spotting question with selection of incorrect term plus written correction. For free text, use a rubric or human review rather than claiming exact semantic grading.

**Interaction D:** Exit ticket persists answers and score; retry presents the targeted reteaching prompt. Do not lock the learner out on a low score.

**Accessibility:** keyboard operable controls, labelled place-value cells, high contrast, visible focus, accessible text alternatives, no reliance on colour alone, written equivalent to any drag interaction.

**Parent/teacher note:** Students who consistently lose zeros may benefit from physically drawing every column before writing the numeral. Ask “Which column is this digit in?” rather than simply saying “Count your zeros.”

## 10. Implementation and editorial status

This manuscript supplies complete initial student-facing teaching, exact activities, answer keys and feedback. Cursor must implement it without rewriting the teaching. The owner has not reviewed this draft; preserve the existing Coming Soon title and attached outcomes as stored in the app. No video or video placeholder is needed.
