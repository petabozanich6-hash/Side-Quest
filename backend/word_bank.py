"""The Word Hoard: a quest-style spelling word bank.

Every word is a creature that starts Wild. A child tames it by spelling it
correctly again and again. A word is only Mastered after 10 correct spellings
in a row. One miss sends the run back to zero:

    0 in a row  -> wild
    1 to 3      -> spotted
    4 to 9      -> tamed
    10          -> mastered (and it leaves the practice list)

Each word can be attempted twice per day (right or wrong), so mastery is
spread over several days of real practice.
The child sees their hoard; the parent sees how it is going.
"""
from datetime import datetime, timezone, timedelta
from typing import List, Optional

from fastapi import Depends, HTTPException
from pydantic import BaseModel

STAGES = ["wild", "spotted", "tamed", "mastered"]
STAGE_LABELS = {
    "wild": "Wild",
    "spotted": "Spotted",
    "tamed": "Tamed",
    "mastered": "Mastered",
}
MASTERY_STREAK = 10
DAILY_ATTEMPTS = 2
SPOTTED_AT = 1
TAMED_AT = 4
XP_STEP = 2
XP_MASTERED = 10
TRICKY_MISSES = 2
# Households are in Australia; days roll over at local time, not UTC.
LOCAL_TZ = timezone(timedelta(hours=10))


class AddWordsIn(BaseModel):
    words: List[str]
    student_id: Optional[str] = None  # parents must say which child
    source: str = "manual"  # manual, lesson, quiz_miss
    lesson_id: Optional[str] = None
    hint: Optional[str] = None


class PracticeIn(BaseModel):
    word_id: str
    correct: bool


class TryIn(BaseModel):
    word: str
    guess: str
    lesson_id: Optional[str] = None


def today_local() -> str:
    return datetime.now(LOCAL_TZ).strftime("%Y-%m-%d")


def clean_word(raw: str) -> str:
    return "".join(ch for ch in (raw or "").strip() if ch.isalpha() or ch in "'-").lower()[:40]


def stage_for_streak(streak: int) -> str:
    if streak >= MASTERY_STREAK:
        return "mastered"
    if streak >= TAMED_AT:
        return "tamed"
    if streak >= SPOTTED_AT:
        return "spotted"
    return "wild"


def streak_of(doc) -> int:
    """Current run of correct spellings. Older words without a streak start
    from where their stage left them."""
    value = doc.get("streak")
    if isinstance(value, int):
        return value
    return {"wild": 0, "spotted": SPOTTED_AT, "tamed": TAMED_AT, "mastered": MASTERY_STREAK}.get(
        doc.get("stage", "wild"), 0
    )


def attempts_used_today(doc) -> int:
    if doc.get("attempt_day") == today_local():
        return int(doc.get("attempts_today") or 0)
    return 0


def streak_from_days(days) -> int:
    """Consecutive practice days ending today (or yesterday, so the streak is not lost early)."""
    have = set(days)
    day = datetime.now(LOCAL_TZ).date()
    if day.strftime("%Y-%m-%d") not in have:
        day -= timedelta(days=1)
    count = 0
    while day.strftime("%Y-%m-%d") in have:
        count += 1
        day -= timedelta(days=1)
    return count


def register(api, db, current_user, require_child, new_id, now_iso):
    def public(doc):
        d = {k: v for k, v in doc.items() if k != "_id"}
        streak = streak_of(d)
        used = attempts_used_today(d)
        d["streak"] = streak
        d["streak_target"] = MASTERY_STREAK
        d["attempts_today"] = used
        d["attempts_left"] = max(DAILY_ATTEMPTS - used, 0)
        d["stage"] = d.get("stage") or stage_for_streak(streak)
        d["stage_label"] = STAGE_LABELS.get(d.get("stage"), "Wild")
        d["practised_today"] = today_local() in (d.get("correct_days") or [])
        return d

    async def summary_for(student_id: str, family_id: str):
        words = await db.word_bank.find(
            {"student_id": student_id, "family_id": family_id}, {"_id": 0}
        ).to_list(5000)
        counts = {s: 0 for s in STAGES}
        for w in words:
            counts[w.get("stage", "wild")] = counts.get(w.get("stage", "wild"), 0) + 1

        log = await db.word_practice.find(
            {"student_id": student_id, "family_id": family_id}, {"_id": 0}
        ).sort("at", -1).to_list(2000)
        days = {p["date"] for p in log}
        week_start = (datetime.now(LOCAL_TZ).date() - timedelta(days=6)).strftime("%Y-%m-%d")
        week = [p for p in log if p["date"] >= week_start]
        week_correct = len([p for p in week if p.get("correct")])

        return {
            "total": len(words),
            "counts": counts,
            "streak": streak_from_days(days),
            "days_this_week": len({p["date"] for p in week}),
            "attempts_this_week": len(week),
            "accuracy_this_week": round(100 * week_correct / len(week)) if week else None,
            "practised_today": today_local() in days,
            "mastery_streak": MASTERY_STREAK,
            "daily_attempts": DAILY_ATTEMPTS,
        }, words, log

    async def add_words(student_id, family_id, data: AddWordsIn, added_by):
        added, skipped = [], []
        for raw in data.words[:100]:
            word = clean_word(raw)
            if not word:
                continue
            exists = await db.word_bank.find_one(
                {"student_id": student_id, "family_id": family_id, "word": word}
            )
            if exists:
                skipped.append(word)
                continue
            doc = {
                "id": new_id(),
                "family_id": family_id,
                "student_id": student_id,
                "word": word,
                "hint": data.hint,
                "stage": "wild",
                "streak": 0,
                "correct_days": [],
                "attempts": 0,
                "attempt_day": None,
                "attempts_today": 0,
                "misses": 0,
                "source": data.source,
                "lesson_id": data.lesson_id,
                "added_by": added_by,
                "created_at": now_iso(),
                "last_practised": None,
                "mastered_at": None,
            }
            await db.word_bank.insert_one(doc)
            added.append(public(doc))
        return {"added": added, "skipped": skipped}

    async def apply_attempt(w, correct: bool, user):
        """Record one spelling attempt. A correct spelling adds one to the run,
        a miss sends the run back to zero. Ten in a row masters the word.
        Each word allows DAILY_ATTEMPTS attempts per day."""
        today = today_local()
        used = attempts_used_today(w)
        if used >= DAILY_ATTEMPTS:
            raise HTTPException(
                429,
                f"You have used both tries for this word today. Come back tomorrow!",
            )

        old_stage = w.get("stage", "wild")
        streak = streak_of(w)
        update = {"last_practised": now_iso(), "attempt_day": today, "attempts_today": used + 1}
        inc = {"attempts": 1}
        xp = 0

        if correct:
            streak = min(streak + 1, MASTERY_STREAK)
            days = list(w.get("correct_days") or [])
            if today not in days:
                days.append(today)
                update["correct_days"] = days
        else:
            streak = 0
            inc["misses"] = 1

        new_stage = stage_for_streak(streak)
        moved = new_stage != old_stage
        just_mastered = new_stage == "mastered" and old_stage != "mastered"

        if correct and moved and STAGES.index(new_stage) > STAGES.index(old_stage):
            xp = XP_MASTERED if just_mastered else XP_STEP
        if just_mastered:
            update["mastered_at"] = now_iso()
        elif new_stage != "mastered":
            update["mastered_at"] = None

        update["streak"] = streak
        update["stage"] = new_stage
        await db.word_bank.update_one({"id": w["id"]}, {"$set": update, "$inc": inc})
        await db.word_practice.insert_one({
            "id": new_id(),
            "family_id": user["family_id"],
            "student_id": user["id"],
            "word_id": w["id"],
            "word": w["word"],
            "correct": correct,
            "date": today,
            "at": now_iso(),
        })

        if xp:
            await db.pets.update_one(
                {"student_id": user["id"]},
                {"$inc": {"xp": xp},
                 "$push": {"activity": {"amount": xp, "reason": f"Word Hoard: {w['word']}", "at": now_iso()}}},
            )

        fresh = await db.word_bank.find_one({"id": w["id"]}, {"_id": 0})
        return {
            "word": public(fresh),
            "correct": correct,
            "moved": moved,
            "new_stage": new_stage,
            "xp_gained": xp,
            "just_mastered": just_mastered,
            "streak": streak,
            "streak_target": MASTERY_STREAK,
            "to_go": max(MASTERY_STREAK - streak, 0),
            "attempts_left": max(DAILY_ATTEMPTS - (used + 1), 0),
            "daily_attempts": DAILY_ATTEMPTS,
        }

    @api.post("/word-bank/words")
    async def add_word_bank_words(data: AddWordsIn, user=Depends(current_user)):
        if user.get("role") == "child":
            student_id = user["id"]
        else:
            if not data.student_id:
                raise HTTPException(400, "student_id is required")
            student = await db.students.find_one(
                {"id": data.student_id, "family_id": user["family_id"]}
            )
            if not student:
                raise HTTPException(404, "Student not found")
            student_id = data.student_id
        return await add_words(student_id, user["family_id"], data, user["id"])

    @api.get("/word-bank")
    async def my_word_hoard(user=Depends(require_child)):
        summary, words, log = await summary_for(user["id"], user["family_id"])
        grouped = {s: [] for s in STAGES}
        for w in words:
            grouped.setdefault(w.get("stage", "wild"), []).append(public(w))
        # Words that are not mastered and still have tries left today.
        open_words = [public(w) for w in words if w.get("stage") != "mastered"]
        to_tame = [w for w in open_words if w["attempts_left"] > 0]
        resting = len(open_words) - len(to_tame)
        # Wildest and most-missed creatures first.
        to_tame.sort(key=lambda w: (STAGES.index(w["stage"]), -w.get("misses", 0)))
        return {
            "summary": summary,
            "stages": STAGES,
            "labels": STAGE_LABELS,
            "mastery_streak": MASTERY_STREAK,
            "daily_attempts": DAILY_ATTEMPTS,
            "words": grouped,
            "to_tame_today": to_tame[:10],
            "resting_today": resting,
        }

    @api.post("/word-bank/practice")
    async def practise_word(data: PracticeIn, user=Depends(require_child)):
        w = await db.word_bank.find_one(
            {"id": data.word_id, "student_id": user["id"]}, {"_id": 0}
        )
        if not w:
            raise HTTPException(404, "Word not found")
        return await apply_attempt(w, data.correct, user)

    @api.post("/word-bank/try")
    async def try_spelling(data: TryIn, user=Depends(require_child)):
        """The child types the word from memory. The server checks the spelling
        and counts it towards the run of 10 in a row."""
        word = clean_word(data.word)
        if not word:
            raise HTTPException(400, "A word is required")
        query = {"student_id": user["id"], "family_id": user["family_id"], "word": word}
        w = await db.word_bank.find_one(query, {"_id": 0})
        if not w:
            await add_words(
                user["id"],
                user["family_id"],
                AddWordsIn(words=[word], source="lesson", lesson_id=data.lesson_id),
                user["id"],
            )
            w = await db.word_bank.find_one(query, {"_id": 0})
        if not w:
            raise HTTPException(404, "Word not found")
        correct = (data.guess or "").strip().lower() == word
        return await apply_attempt(w, correct, user)

    @api.get("/word-bank/parent/{student_id}")
    async def parent_hoard_report(student_id: str, user=Depends(current_user)):
        if user.get("role") != "parent":
            raise HTTPException(403, "Parent access required")
        student = await db.students.find_one(
            {"id": student_id, "family_id": user["family_id"]}, {"_id": 0, "pin": 0}
        )
        if not student:
            raise HTTPException(404, "Student not found")

        summary, words, log = await summary_for(student_id, user["family_id"])
        tricky = [
            public(w) for w in words
            if w.get("misses", 0) >= TRICKY_MISSES and w.get("stage") != "mastered"
        ]
        tricky.sort(key=lambda w: -w.get("misses", 0))
        mastered = sorted(
            [public(w) for w in words if w.get("stage") == "mastered"],
            key=lambda w: w.get("mastered_at") or "",
            reverse=True,
        )
        return {
            "student": {"id": student["id"], "name": student.get("name")},
            "summary": summary,
            "tricky_words": tricky[:15],
            "recently_mastered": mastered[:10],
            "recent_practice": log[:25],
            "words": [public(w) for w in words],
        }

    @api.delete("/word-bank/{word_id}")
    async def remove_word(word_id: str, user=Depends(current_user)):
        if user.get("role") != "parent":
            raise HTTPException(403, "Parent access required")
        res = await db.word_bank.delete_one(
            {"id": word_id, "family_id": user["family_id"]}
        )
        if res.deleted_count == 0:
            raise HTTPException(404, "Word not found")
        return {"ok": True}
