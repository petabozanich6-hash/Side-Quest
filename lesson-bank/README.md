# Lesson bank

A reusable library of self-contained lessons, organised by stage, subject and week. It is independent of any one family. The site builds each child's daily schedule by picking lessons from the bank, so the bank can be shared with other homeschool parents later.

## Structure

    lesson-bank/
      stage-2/mathematics/week-01/S2-MAT-W01-L01.md
      stage-4/science/week-03/S4-SCI-W03-L02.md
      tools/build_bank.py
      scope-and-sequence.md

One Markdown file per lesson (the source). Run `python lesson-bank/tools/build_bank.py lesson-bank` to check every lesson and write a JSON file next to each one. The site reads the JSON. Week 1 of Stage 2 Mathematics was written directly in JSON before this format existed.

## Lesson source format (Markdown)

    ---
    code: S2-MAT-W02-L01
    stage: 2
    subject: Mathematics
    week: 2
    lesson: 1
    title: Adding by partitioning
    minutes: 45
    outcomes: MA2-RN-02
    video: link
    practice: link
    worksheet: text
    ---
    ## Warm-up
    - question :: answer
    ## Teach
    ### Heading
    Body text.
    ## Worked examples
    - question :: steps :: answer
    ## Guided practice
    - question :: hint :: answer
    ## Task
    Instructions: what to do.
    - question :: answer
    ## Quiz
    - question :: option a | option b | option c :: correct option :: explanation

Rules: one item per line, `::` separates the parts, `|` separates quiz options, and the correct quiz answer must match one option exactly. Do not use `::` or `|` inside the text.

## The child's name

Write `{{name}}` wherever the logged-in child's name should appear, for example 'Well done, {{name}}.' The site replaces it with the child's name when it shows the lesson, and falls back to 'you' if there is no name. Use it in teaching cards, word problems and quiz feedback. Never write a real child's name in the bank.

## Size of the first build (10 weeks)

| Stage | Lessons per week | Weeks | Lessons |
|---|---|---|---|
| Stage 2 (Year 3): English 5, Mathematics 5, Science 3, HSIE 3, PDHPE 2, Creative Arts 2 | 20 | 10 | 200 |
| Stage 4 (Year 7): English 5, Mathematics 5, Science 4, History 3, Technology 3, Visual Arts 2 | 22 | 10 | 220 |

Total: about 420 lessons.

## Rules for every lesson

- Teach a concept fully before asking questions on it: explanation, worked examples, guided practice, independent task, quiz.
- Written for a child working alone, so every question has an answer and a hint.
- At least one tested video or resource link. A link starting with PENDING has not been found or tested yet.
- Outcome code recorded, but not shown to the child. Check each code against the current NESA syllabus.
