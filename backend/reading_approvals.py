"""Child-submitted reading logs that a parent must approve.

Submissions live in their own collection (reading_submissions). Nothing reaches
the real reading_log (or earns pet XP) until a parent approves it.

Wire-up in server.py, next to the other register calls:
    import reading_approvals
    reading_approvals.register(api, db, require_child, require_parent, now_iso)
"""
import uuid
from datetime import datetime, timezone, timedelta

from fastapi import HTTPException, Depends

DAILY_LIMIT = 3
MAX_DAYS_BACK = 7
READING_XP = 3
BOOK_TYPES = {"fiction", "nonfiction", "picture", "graphic", "poetry", "reference"}
MODES = {"independent", "with_adult", "read_to", "audio"}


def _family(user: dict):
    return user.get("family_id") or user.get("parent_id")


def _clean_int(v, lo, hi, field):
    if v in (None, ""):
        return None
    try:
        n = int(v)
    except (TypeError, ValueError):
        raise HTTPException(400, f"{field} must be a number")
    if n < lo or n > hi:
        raise HTTPException(400, f"{field} must be between {lo} and {hi}")
    return n


def register(api, db, require_child, require_parent, now_iso):

    @api.post("/reading-submissions")
    async def submit(data: dict, user=Depends(require_child)):
        title = str(data.get("title", "")).strip()
        if not title or len(title) > 120:
            raise HTTPException(400, "Please enter the book title")
        author = str(data.get("author", "")).strip()[:80]
        today = datetime.now(timezone.utc).date()
        try:
            read_date = datetime.fromisoformat(str(data.get("read_date"))).date()
        except ValueError:
            raise HTTPException(400, "Please choose the date you read")
        if read_date > today + timedelta(days=1):
            raise HTTPException(400, "That date is in the future")
        if read_date < today - timedelta(days=MAX_DAYS_BACK):
            raise HTTPException(400, f"You can only add reading from the last {MAX_DAYS_BACK} days")
        minutes = _clean_int(data.get("duration_minutes"), 1, 600, "Minutes")
        if minutes is None:
            raise HTTPException(400, "How many minutes did you read?")
        pages = _clean_int(data.get("pages"), 1, 5000, "Pages")
        book_type = data.get("book_type", "fiction")
        mode = data.get("reading_mode", "independent")
        if book_type not in BOOK_TYPES or mode not in MODES:
            raise HTTPException(400, "Invalid book type or reading mode")

        start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        todays = await db.reading_submissions.find(
            {"student_id": user["id"], "created_at": {"$gte": start.isoformat()}}, {"_id": 0, "title": 1, "status": 1}
        ).to_list(50)
        if len(todays) >= DAILY_LIMIT:
            raise HTTPException(400, f"You can add up to {DAILY_LIMIT} books a day")
        if any(t["title"].lower() == title.lower() and t["status"] != "rejected" for t in todays):
            raise HTTPException(400, "You already added that book today")

        doc = {"id": str(uuid.uuid4()), "student_id": user["id"], "family_id": _family(user),
               "title": title, "author": author, "read_date": read_date.isoformat(),
               "duration_minutes": minutes, "pages": pages, "book_type": book_type,
               "reading_mode": mode, "status": "pending", "parent_note": "",
               "created_at": datetime.now(timezone.utc).isoformat()}
        await db.reading_submissions.insert_one(dict(doc))
        return doc

    @api.get("/reading-submissions/mine")
    async def mine(user=Depends(require_child)):
        return await db.reading_submissions.find(
            {"student_id": user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(100)

    @api.get("/reading-submissions/pending")
    async def pending(user=Depends(require_parent)):
        q = {"status": "pending"}
        fam = _family(user)
        q["family_id"] = fam if fam is not None else user.get("id")
        return await db.reading_submissions.find(q, {"_id": 0}).sort("created_at", 1).to_list(200)

    async def _get_pending(sid: str, user: dict):
        fam = _family(user)
        sub = await db.reading_submissions.find_one(
            {"id": sid, "family_id": fam if fam is not None else user.get("id")}, {"_id": 0})
        if not sub:
            raise HTTPException(404, "Submission not found")
        if sub["status"] != "pending":
            raise HTTPException(400, "Already reviewed")
        return sub

    @api.post("/reading-submissions/{sid}/approve")
    async def approve(sid: str, data: dict = None, user=Depends(require_parent)):
        sub = await _get_pending(sid, user)
        edits = data or {}
        minutes = _clean_int(edits.get("duration_minutes"), 1, 600, "Minutes") or sub["duration_minutes"]
        pages = _clean_int(edits.get("pages"), 1, 5000, "Pages") or sub.get("pages")
        now = now_iso() if callable(now_iso) else datetime.now(timezone.utc).isoformat()
        entry = {"id": str(uuid.uuid4()), "student_id": sub["student_id"],
                 "family_id": sub["family_id"], "parent_id": sub["family_id"],
                 "title": sub["title"], "author": sub.get("author", ""),
                 "pages": pages, "pages_read": None, "read_date": sub["read_date"],
                 "duration_minutes": minutes, "source": "home",
                 "book_type": sub["book_type"], "reading_mode": sub["reading_mode"],
                 "comprehension_notes": "", "favourite_part": "", "difficulty": "just_right",
                 "parent_note": "", "verified_by_parent": True, "submitted_by_child": True,
                 "created_at": now}
        await db.reading_log.insert_one(dict(entry))
        await db.reading_submissions.update_one(
            {"id": sid}, {"$set": {"status": "approved", "reviewed_at": now, "reading_log_id": entry["id"]}})
        await db.pets.update_one(
            {"student_id": sub["student_id"]},
            {"$inc": {"xp": READING_XP},
             "$push": {"activity": {"amount": READING_XP, "reason": f"Read {sub['title']}", "at": now}}})
        return {"ok": True, "entry_id": entry["id"]}

    @api.post("/reading-submissions/{sid}/reject")
    async def reject(sid: str, data: dict = None, user=Depends(require_parent)):
        await _get_pending(sid, user)
        note = str((data or {}).get("parent_note", "")).strip()[:200]
        await db.reading_submissions.update_one(
            {"id": sid}, {"$set": {"status": "rejected", "parent_note": note,
                                   "reviewed_at": datetime.now(timezone.utc).isoformat()}})
        return {"ok": True}
