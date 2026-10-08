"""Seasonal release packs. Per-family on/off switch, optional dates, optional pet prize.

Registered from reading_approvals.register, so server.py needs no edit.
Every pack is OFF by default. Nothing is assumed for any family.
"""
from datetime import datetime, date
from typing import Optional

from fastapi import HTTPException, Depends
from pydantic import BaseModel

try:
    from zoneinfo import ZoneInfo
    _TZ = ZoneInfo("Australia/Sydney")
except Exception:  # pragma: no cover
    _TZ = None

PACKS = {
    "halloween": {"label": "Halloween", "prize": {"name": "Pumpkin buddy", "emoji": "🎃"}},
    "christmas": {"label": "Christmas", "prize": {"name": "Santa hat", "emoji": "🎅"}},
    "new_year": {"label": "New Year", "prize": {"name": "Party popper", "emoji": "🎉"}},
    "easter": {"label": "Easter", "prize": {"name": "Bunny ears", "emoji": "🐰"}},
    "lunar_new_year": {"label": "Lunar New Year", "prize": {"name": "Red envelope", "emoji": "🧧"}},
    "birthday": {"label": "Child birthday", "prize": {"name": "Birthday cake", "emoji": "🎂"}},
}


class SeasonalIn(BaseModel):
    enabled: bool = False
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    decorations: bool = True
    prize: bool = True


def _family_parent(user: dict):
    return user.get("family_id") or user.get("id")


def _family_child(user: dict):
    return user.get("family_id") or user.get("parent_id")


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


def _view(pack: str, cfg: Optional[dict]) -> dict:
    cfg = cfg or {}
    meta = PACKS[pack]
    return {
        "pack": pack,
        "label": meta["label"],
        "prize": meta["prize"],
        "enabled": bool(cfg.get("enabled", False)),
        "start_date": cfg.get("start_date"),
        "end_date": cfg.get("end_date"),
        "decorations": bool(cfg.get("decorations", True)),
        "prize_enabled": bool(cfg.get("prize", True)),
        "active": is_active(cfg),
    }


def register(api, db, require_child, require_parent, now_iso):
    def _now():
        return now_iso() if callable(now_iso) else str(now_iso)

    async def _family_configs(family_id) -> dict:
        docs = await db.seasonal_packs.find({"family_id": family_id}, {"_id": 0}).to_list(50)
        return {d["pack"]: d for d in docs}

    @api.get("/seasonal")
    async def list_packs(user=Depends(require_parent)):
        cfgs = await _family_configs(_family_parent(user))
        return {"today": _today(), "packs": [_view(p, cfgs.get(p)) for p in PACKS]}

    @api.put("/seasonal/{pack}")
    async def save_pack(pack: str, data: SeasonalIn, user=Depends(require_parent)):
        if pack not in PACKS:
            raise HTTPException(404, "Unknown pack")
        start = _clean_date(data.start_date)
        end = _clean_date(data.end_date)
        if start and end and end < start:
            raise HTTPException(400, "End date must be on or after the start date")
        fam = _family_parent(user)
        doc = {"family_id": fam, "pack": pack, "enabled": data.enabled,
               "start_date": start, "end_date": end,
               "decorations": data.decorations, "prize": data.prize,
               "updated_at": _now()}
        await db.seasonal_packs.update_one({"family_id": fam, "pack": pack}, {"$set": doc}, upsert=True)
        return _view(pack, doc)

    @api.get("/seasonal/active")
    async def active_packs(user=Depends(require_child)):
        cfgs = await _family_configs(_family_child(user))
        claims = await db.seasonal_prizes.find({"student_id": user["id"]}, {"_id": 0, "pack": 1}).to_list(50)
        claimed = {c["pack"] for c in claims}
        out = []
        for p in PACKS:
            v = _view(p, cfgs.get(p))
            if not v["active"]:
                continue
            out.append({"pack": p, "label": v["label"], "decorations": v["decorations"],
                        "prize": v["prize"] if v["prize_enabled"] else None,
                        "claimed": p in claimed})
        return {"packs": out}

    @api.post("/seasonal/{pack}/claim")
    async def claim_prize(pack: str, user=Depends(require_child)):
        if pack not in PACKS:
            raise HTTPException(404, "Unknown pack")
        cfg = (await _family_configs(_family_child(user))).get(pack)
        v = _view(pack, cfg)
        if not v["active"] or not v["prize_enabled"]:
            raise HTTPException(400, "This prize is not available right now")
        await db.seasonal_prizes.update_one(
            {"student_id": user["id"], "pack": pack},
            {"$setOnInsert": {"student_id": user["id"], "pack": pack, "claimed_at": _now()}},
            upsert=True)
        return {"ok": True, "prize": v["prize"]}
