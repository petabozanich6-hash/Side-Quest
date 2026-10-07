"""The Word Hoard: a quest-style spelling word bank.

Every word is a creature that starts Wild. A child tames it by spelling it
correctly on different days:

    wild -> spotted -> tamed -> mastered

One correct answer per day moves a word up one stage. A miss moves it back
one stage, so words are only mastered after real, spaced practice.
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


def today_local() -> str:
    return datetime.now(LOCAL_TZ).strftime("%Y-%m-%d")


def clean_word(raw: str) -> str:
    return "".join(ch for ch in (raw or "").strip() if ch.isalpha() or ch in "'-").lower()[:40]


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
                "correct_days": [],
                "attempts": 0,
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
        today = today_local()
        to_tame = [
            public(w) for w in words
            if w.get("stage") != "mastered" and today not in (w.get("correct_days") or [])
        ]
        # Wildest and most-missed creatures first.
        to_tame.sort(key=lambda w: (STAGES.index(w["stage"]), -w.get("misses", 0)))
        return {
            "summary": summary,
            "stages": STAGES,
            "labels": STAGE_LABELS,
            "words": grouped,
            "to_tame_today": to_tame[:10],
        }

    @api.post("/word-bank/practice")
    async def practise_word(data: PracticeIn, user=Depends(require_child)):
        w = await db.word_bank.find_one(
            {"id": data.word_id, "student_id": user["id"]}, {"_id": 0}
        )
        if not w:
            raise HTTPException(404, "Word not found")

        today = today_local()
        stage_i = STAGES.index(w.get("stage", "wild"))
        days = list(w.get("correct_days") or [])
        update = {"last_practised": now_iso()}
        inc = {"attempts": 1}
        xp = 0
        moved = False

        if data.correct:
            if today not in days:
                days.append(today)
                update["correct_days"] = days
                if stage_i < len(STAGES) - 1:
                    stage_i += 1
                    moved = True
                    xp = XP_MASTERED if STAGES[stage_i] == "mastered" else XP_STEP
                    if STAGES[stage_i] == "mastered":
                        update["mastered_at"] = now_iso()
        else:
            inc["misses"] = 1
            if stage_i > 0:
                stage_i -= 1
                moved = True
                update["mastered_at"] = None

        update["stage"] = STAGES[stage_i]
        await db.word_bank.update_one(
            {"id": w["id"]}, {"$set": update, "$inc": inc}
        )
        await db.word_practice.insert_one({
            "id": new_id(),
            "family_id": user["family_id"],
            "student_id": user["id"],
            "word_id": w["id"],
            "word": w["word"],
            "correct": data.correct,
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
            "moved": moved,
            "new_stage": STAGES[stage_i],
            "xp_gained": xp,
            "just_mastered": bool(xp == XP_MASTERED),
        }

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
