"""Uncapped lesson list.

The original GET /api/lessons returns at most 500 lessons, newest first,
so older lessons never show up. This adds GET /api/lesson-index which
returns every visible lesson in a stable order (oldest first, so the
library reads in the order it was seeded). The old route is unchanged.
"""
from typing import Optional

from fastapi import Depends, HTTPException


def register(api, db, current_user, require_child, new_id, now_iso):
    @api.get("/lesson-index")
    async def lesson_index(
        unit_id: Optional[str] = None,
        stage: Optional[str] = None,
        user=Depends(current_user),
    ):
        if user.get("role") != "parent":
            raise HTTPException(403, "Parent access required")

        q = {
            "$or": [
                {"family_id": user["family_id"]},
                {"family_id": None},
                {"library": True},
            ]
        }

        filters = []
        if unit_id:
            filters.append({"unit_id": unit_id})
        if stage:
            filters.append({"stage": stage})
        if filters:
            q = {"$and": [q, *filters]}

        return await db.lessons.find(q, {"_id": 0}).sort("created_at", 1).to_list(None)
