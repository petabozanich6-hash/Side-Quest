"""Seasonal release packs (Halloween). Per-family on/off switch with optional dates."""
from datetime import datetime, date
from typing import Optional

from fastapi import HTTPException
from pydantic import BaseModel

try:
    from zoneinfo import ZoneInfo
    _TZ = ZoneInfo("Australia/Sydney")
except Exception:  # pragma: no cover
    _TZ = None

PACK = "halloween"


class SeasonalIn(BaseModel):
    enabled: bool = False
    start_date: Optional[str] = None  # YYYY-MM-DD, empty = no start limit
    end_date: Optional[str] = None    # YYYY-MM-DD, empty = no end limit


def _clean_date(value: Optional[str]) -> Optional[str]:
    if value is None or str(value).strip() == "":
        return None
    try:
        return date.fromisoformat(str(value).strip()).isoformat()
    except ValueError:
        raise HTTPException(400, "Dates must look like YYYY-MM-DD")


def _today() -> str:
    now = datetime.now(_TZ) if _TZ else datetime.utcnow()
    return now.date().isoformat()


def is_active(cfg: Optional[dict]) -> bool:
    if not cfg or not cfg.get("enabled"):
        return False
    today = _today()
    start, end = cfg.get("start_date"), cfg.get("end_date")
    if start and today < start:
        return False
    if end and today > end:
        return False
    return True


def register(api, db, require_child, require_parent, now_iso):
    async def _load(family_id):
        return await db.seasonal_packs.find_one(
            {"family_id": family_id, "pack": PACK}, {"_id": 0}
        )

    @api.get("/seasonal/halloween")
    async def get_halloween(user=require_parent_dep(require_parent)):
        cfg = await _load(user["family_id"]) or {}
        return {
            "enabled": bool(cfg.get("enabled", False)),
            "start_date": cfg.get("start_date"),
            "end_date": cfg.get("end_date"),
            "active": is_active(cfg),
            "today": _today(),
        }

    @api.put("/seasonal/halloween")
    async def put_halloween(data: SeasonalIn, user=require_parent_dep(require_parent)):
        start = _clean_date(data.start_date)
        end = _clean_date(data.end_date)
        if start and end and end < start:
            raise HTTPException(400, "End date must be on or after the start date")
        doc = {
            "family_id": user["family_id"],
            "pack": PACK,
            "enabled": data.enabled,
            "start_date": start,
            "end_date": end,
            "updated_at": now_iso(),
        }
        await db.seasonal_packs.update_one(
            {"family_id": user["family_id"], "pack": PACK},
            {"$set": doc},
            upsert=True,
        )
        return {
            "enabled": data.enabled,
            "start_date": start,
            "end_date": end,
            "active": is_active(doc),
            "today": _today(),
        }

    @api.get("/seasonal/halloween/active")
    async def halloween_active(user=require_child_dep(require_child)):
        cfg = await _load(user["family_id"])
        return {"active": is_active(cfg)}


def require_parent_dep(dep):
    from fastapi import Depends
    return Depends(dep)


def require_child_dep(dep):
    from fastapi import Depends
    return Depends(dep)
