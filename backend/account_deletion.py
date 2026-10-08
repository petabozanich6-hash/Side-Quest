"""Parent account deletion.

POST /api/auth/delete-account  (parent only)
    body: {"password": "...", "confirm": "DELETE"}

Permanently erases the parent, their family, every child profile and everything
related to them (assignments, submissions, reading logs, pets, uploads, etc).
Shared library lessons (family_id = None) are never touched.

Collections are discovered at run time, so data added by other modules
(pets, achievements, seasonal packs, ...) is removed without listing each one.
A document is removed if it carries this family's id (family_id / parent_id) or
belongs to one of the family's children (student_id / child_id).
"""
import re
import logging

import bcrypt
from fastapi import HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorGridFSBucket

logger = logging.getLogger("sidequest")

# Never bulk-purged by the generic sweep.
SKIP_COLLECTIONS = {
    "fs.files", "fs.chunks",   # uploads, handled separately below
    "outcomes", "app_config",  # shared app data
    "users", "families", "students",  # removed explicitly at the end
}
UPLOAD_PREFIX = "sidequest/families/"


def _check_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode(), hashed.encode())
    except Exception:
        return False


async def _delete_uploads(db, family_id: str) -> int:
    bucket = AsyncIOMotorGridFSBucket(db)
    prefix = f"{UPLOAD_PREFIX}{family_id}/"
    removed = 0
    async for f in db["fs.files"].find({"filename": {"$regex": "^" + re.escape(prefix)}}, {"_id": 1}):
        try:
            await bucket.delete(f["_id"])
            removed += 1
        except Exception:
            logger.exception("Could not delete an upload during account deletion")
    return removed


async def purge_family(db, family_id: str, user_id: str) -> dict:
    if not family_id or not isinstance(family_id, str):
        raise HTTPException(400, "No family to delete")

    students = await db.students.find({"family_id": family_id}, {"_id": 0, "id": 1}).to_list(1000)
    student_ids = [s["id"] for s in students]

    report = {"uploads": await _delete_uploads(db, family_id)}

    conditions = [
        {"family_id": family_id},
        {"parent_id": {"$in": [family_id, user_id]}},
    ]
    if student_ids:
        conditions.append({"student_id": {"$in": student_ids}})
        conditions.append({"child_id": {"$in": student_ids}})

    for name in await db.list_collection_names():
        if name in SKIP_COLLECTIONS or name.startswith("system."):
            continue
        res = await db[name].delete_many({"$or": conditions})
        if res.deleted_count:
            report[name] = res.deleted_count

    report["students"] = (await db.students.delete_many({"family_id": family_id})).deleted_count
    report["families"] = (await db.families.delete_many({"id": family_id})).deleted_count
    return report


def register(api, db, require_parent):

    @api.post("/auth/delete-account")
    async def delete_account(data: dict, user=Depends(require_parent)):
        if str(data.get("confirm", "")).strip() != "DELETE":
            raise HTTPException(400, "Type DELETE to confirm")

        record = await db.users.find_one({"id": user["id"]})
        if not record:
            raise HTTPException(404, "Account not found")
        if not _check_password(str(data.get("password", "")), record.get("password", "")):
            raise HTTPException(403, "Incorrect password")

        family_id = record.get("family_id")

        # If another parent still belongs to this family, only remove this login.
        others = await db.users.count_documents({"family_id": family_id, "id": {"$ne": record["id"]}})
        if others:
            await db.users.delete_one({"id": record["id"]})
            logger.info("Parent account removed; family kept because other parents remain")
            return {"ok": True, "family_deleted": False}

        report = await purge_family(db, family_id, record["id"])
        await db.users.delete_one({"id": record["id"]})
        logger.info(f"Deleted parent account and family data: {report}")
        return {"ok": True, "family_deleted": True, "deleted": report}
