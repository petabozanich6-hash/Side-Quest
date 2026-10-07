"""Lesson certificates, mystery boxes and the achievement wall.

Certificates are created the first time a child (or parent) loads
achievements after a lesson has been accepted. Each certificate comes
with three mystery boxes. The prizes are chosen on the server when the
certificate is created, so reloading the page can never re-roll them.
"""
import random

from fastapi import HTTPException
from pydantic import BaseModel

PRIZE_POOL = [
    {"id": "leaf_crown", "name": "Leaf Crown", "emoji": "🍃"},
    {"id": "star_collar", "name": "Star Collar", "emoji": "⭐"},
    {"id": "acorn_hat", "name": "Acorn Hat", "emoji": "🌰"},
    {"id": "rainbow_ribbon", "name": "Rainbow Ribbon", "emoji": "🌈"},
    {"id": "cosy_blanket", "name": "Cosy Blanket", "emoji": "🧶"},
    {"id": "glow_lantern", "name": "Glow Lantern", "emoji": "🏮"},
    {"id": "moon_cape", "name": "Moon Cape", "emoji": "🌙"},
    {"id": "flower_wreath", "name": "Flower Wreath", "emoji": "🌸"},
]

EARNED = ["accepted", "demonstrated"]


class ClaimIn(BaseModel):
    box: int


def register(api, db, current_user, require_child, new_id, now_iso):
    from fastapi import Depends
    from typing import Optional

    def public(doc):
        doc = {k: v for k, v in doc.items() if k != "_id"}
        if not doc.get("claimed"):
            doc.pop("box_prizes", None)
            doc.pop("prize", None)
        return doc

    async def sync_student(student):
        sid = student["id"]
        fid = student["family_id"]

        assignments = await db.assignments.find(
            {"student_id": sid, "family_id": fid, "status": {"$in": EARNED}},
            {"_id": 0},
        ).to_list(1000)

        if not assignments:
            return

        have = {
            a["assignment_id"]
            for a in await db.achievements.find(
                {"student_id": sid}, {"_id": 0, "assignment_id": 1}
            ).to_list(5000)
        }

        for a in assignments:
            if a["id"] in have:
                continue

            lesson = await db.lessons.find_one({"id": a["lesson_id"]}, {"_id": 0}) or {}
            sub = await db.submissions.find_one(
                {"assignment_id": a["id"], "status": {"$in": EARNED}},
                {"_id": 0},
                sort=[("reviewed_at", -1)],
            )

            doc = {
                "id": new_id(),
                "family_id": fid,
                "student_id": sid,
                "student_name": student.get("name", ""),
                "lesson_id": a["lesson_id"],
                "lesson_title": lesson.get("title", "Lesson"),
                "learning_area": lesson.get("learning_area"),
                "stage": lesson.get("stage"),
                "outcome_codes": lesson.get("outcome_codes", []),
                "level": a["status"],
                "awarded_at": (sub or {}).get("reviewed_at") or now_iso(),
                "box_prizes": random.sample(PRIZE_POOL, 3),
                "claimed": False,
                "chosen_box": None,
                "prize": None,
                "created_at": now_iso(),
            }

            await db.achievements.update_one(
                {"assignment_id": a["id"]},
                {"$setOnInsert": doc},
                upsert=True,
            )

    @api.get("/achievements")
    async def list_achievements(student_id: Optional[str] = None, user=Depends(current_user)):
        fid = user["family_id"]

        if user.get("role") == "child":
            students = [user]
        else:
            q = {"family_id": fid}
            if student_id:
                q["id"] = student_id
            students = await db.students.find(q, {"_id": 0, "pin": 0}).to_list(50)

        for s in students:
            await sync_student(s)

        q = {"family_id": fid, "student_id": {"$in": [s["id"] for s in students]}}
        docs = await db.achievements.find(q, {"_id": 0}).sort("awarded_at", -1).to_list(2000)
        items = [public(d) for d in docs]

        return {
            "items": items,
            "unclaimed": len([i for i in items if not i.get("claimed")]),
        }

    @api.post("/achievements/{aid}/claim")
    async def claim_box(aid: str, data: ClaimIn, user=Depends(require_child)):
        if data.box not in (0, 1, 2):
            raise HTTPException(400, "Pick one of the three boxes")

        doc = await db.achievements.find_one({"id": aid, "student_id": user["id"]}, {"_id": 0})
        if not doc:
            raise HTTPException(404, "Achievement not found")
        if doc.get("claimed"):
            raise HTTPException(400, "You already opened a box for this one")

        prize = doc["box_prizes"][data.box]

        res = await db.achievements.update_one(
            {"id": aid, "student_id": user["id"], "claimed": False},
            {"$set": {
                "claimed": True,
                "chosen_box": data.box,
                "prize": prize,
                "claimed_at": now_iso(),
            }},
        )
        if res.modified_count != 1:
            raise HTTPException(400, "You already opened a box for this one")

        await db.pets.update_one(
            {"student_id": user["id"]},
            {"$push": {"items": {**prize, "from_lesson": doc.get("lesson_title"), "at": now_iso()}}},
        )

        return {
            "prize": prize,
            "boxes": doc["box_prizes"],
            "chosen_box": data.box,
            "lesson_title": doc.get("lesson_title"),
        }
