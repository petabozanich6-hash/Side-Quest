# Side Quest Learning

A homeschool platform for Australian families, aligned to NSW (NESA) Stage outcomes. Parents plan, assign and review work; children complete interactive, quest-style lessons.

## Features

- Lessons organised by NSW Stage and mapped to NESA outcome codes
- Child-facing lessons: teaching steps, embedded videos, flip-to-reveal cards, mixed-format quizzes, progressive completion
- Parent-facing area: outcome alignment, per-child calendar, review of submitted work, evidence records
- Achievements, pet helper (hint ladders, no AI), Word Hoard spelling bank, document writer

## Structure

- `backend/` - Python API (`server.py`), lesson libraries (`lesson_library_*.py`), NSW outcomes (`nsw_outcomes.py`), achievements, calendar routes, word bank
- `frontend/` - web client
- `tests/`, `backend/tests/`, `test_reports/` - automated tests and reports
- `docs/` - project documentation

## Lesson naming

Lesson modules follow `lesson_library_s2_<subject>_...py`. Pass 1 holds the teaching content; `_pass2` files attach videos and links. Register every new module in the lesson library loader.

## Status

- Stage 2 English: weeks 1-10 built
- Stage 2 Maths: weeks 1-2 built; weeks 3-10 in progress
- Next: Year 3 and Stage 4 (Year 7) across all subjects

## Running locally

```
cd backend
pip install -r requirements.txt
uvicorn server:app --reload
```

Deployed on Render. Python version is set in `runtime.txt`.
