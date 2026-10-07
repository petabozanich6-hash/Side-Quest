# Lesson bank

A reusable library of self-contained lessons, organised by stage, subject and week. It is independent of any one family. The site builds each child's daily schedule by picking lessons from the bank, so the bank can be shared with other homeschool parents later.

## Structure

    lesson-bank/
      stage-2/english/week-01/lesson-01.json
      stage-2/mathematics/week-01/lesson-01.json
      stage-4/science/week-03/lesson-02.json
      scope-and-sequence.md

One JSON file per lesson. The file name is the lesson code, for example S2-MAT-W01-L01.

## Lesson file format

    {
      "code": "S2-MAT-W01-L01",
      "stage": 2,
      "subject": "Mathematics",
      "week": 1,
      "lesson": 1,
      "title": "Place value to 1000",
      "minutes": 45,
      "outcomes": ["MA2-RN-01"],
      "warmup": [{"q": "", "a": ""}],
      "teach": [{"heading": "", "body": ""}],
      "worked_examples": [{"q": "", "steps": "", "a": ""}],
      "guided_practice": [{"q": "", "hint": "", "a": ""}],
      "task": {"instructions": "", "questions": [], "answers": []},
      "quiz": [{"q": "", "options": [], "answer": "", "explain": ""}],
      "resources": {"video": "", "practice": "", "worksheet": ""}
    }

## Size of the first build (10 weeks)

| Stage | Lessons per week | Weeks | Lessons |
|---|---|---|---|
| Stage 2 (Year 3): English 5, Mathematics 5, Science 3, HSIE 3, PDHPE 2, Creative Arts 2 | 20 | 10 | 200 |
| Stage 4 (Year 7): English 5, Mathematics 5, Science 4, History 3, Technology 3, Visual Arts 2 | 22 | 10 | 220 |

Total: about 420 lessons.

## Build order

1. Scope and sequence (this folder): the topic for each subject each week.
2. Write lessons one subject-stage block at a time, Mathematics and English first, so the core subjects are ready for Week 1.
3. Validate each batch: JSON loads, every lesson has a quiz and answers, every link is tested.
4. Site reads the bank and builds each day's schedule.

## Rules for every lesson

- Teach a concept fully before asking questions on it: explanation, worked examples, guided practice, independent task, quiz.
- Written for a child working alone, so every question has an answer and a hint.
- At least one tested video or resource link.
- Outcome code recorded, but not shown to the child.
