"""Seasonal release packs. Per-family on/off switch, optional dates, optional pet prize.

Registered from reading_approvals.register, so server.py needs no edit.
Every pack is OFF by default. Nothing is assumed for any family.

Each pack has 12 wearable prizes (one for each year of schooling). A child can claim
one random prize per pack per year, never a repeat, and keeps them all permanently.
The child chooses which prizes to wear (up to MAX_WORN at once).
"""
import random
from datetime import datetime, date
from typing import List, Optional

from fastapi import HTTPException, Depends
from pydantic import BaseModel

try:
    from zoneinfo import ZoneInfo
    _TZ = ZoneInfo("Australia/Sydney")
except Exception:  # pragma: no cover
    _TZ = None

MAX_WORN = 3

PACKS = {
    "halloween": {"label": "Halloween", "prizes": [
        ("Pumpkin buddy", "🎃"), ("Bat wings", "🦇"), ("Friendly ghost", "👻"), ("Spider pal", "🕷️"),
        ("Wizard hat", "🧙"), ("Cobweb cape", "🕸️"), ("Candy sack", "🍬"), ("Spooky owl", "🦉"),
        ("Harvest moon", "🌙"), ("Vampire cape", "🧛"), ("Midnight cat", "🐈"), ("Crystal ball", "🔮")]},
    "christmas": {"label": "Christmas", "prizes": [
        ("Santa hat", "🎅"), ("Tree topper", "🎄"), ("Snowman scarf", "⛄"), ("Reindeer antlers", "🦌"),
        ("Jingle bell", "🔔"), ("Sleigh ride", "🛷"), ("Snowflake crown", "❄️"), ("Stocking", "🧦"),
        ("Candle glow", "🕯️"), ("Cookie badge", "🍪"), ("Bright star", "🌟"), ("Warm mittens", "🧤")]},
    "new_year": {"label": "New Year", "prizes": [
        ("Party popper", "🎉"), ("Fireworks", "🎆"), ("Top hat", "🎩"), ("Juice toast", "🧃"),
        ("Glitter halo", "✨"), ("Confetti cape", "🎊"), ("Midnight clock", "🕛"), ("Sparkle burst", "💫"),
        ("Dance moves", "🕺"), ("Sparkler", "🎇"), ("Party tunes", "🎶"), ("Shooting star", "🌠")]},
    "easter": {"label": "Easter", "prizes": [
        ("Bunny ears", "🐰"), ("Hatching chick", "🐣"), ("Painted egg", "🥚"), ("Tulip crown", "🌷"),
        ("Daisy chain", "🌼"), ("Butterfly wings", "🦋"), ("Egg basket", "🧺"), ("Woolly lamb", "🐑"),
        ("Little sprout", "🌱"), ("Chocolate medal", "🍫"), ("Rainbow ribbon", "🌈"), ("Ladybird", "🐞")]},
    "lunar_new_year": {"label": "Lunar New Year", "prizes": [
        ("Red envelope", "🧧"), ("Paper lantern", "🏮"), ("Dragon", "🐉"), ("Lion dance", "🦁"),
        ("Bamboo", "🎍"), ("Dumpling", "🥟"), ("Lucky mandarin", "🍊"), ("Fish banner", "🎏"),
        ("Firecracker", "🧨"), ("Plum blossom", "🌸"), ("Fortune cookie", "🥠"), ("Zodiac mouse", "🐭")]},
    "birthday": {"label": "Child birthday", "prizes": [
        ("Birthday cake", "🎂"), ("Party balloon", "🎈"), ("Cupcake", "🧁"), ("Cake slice", "🍰"),
        ("Wrapped gift", "🎁"), ("Birthday crown", "👑"), ("Party face", "🥳"), ("Party ribbon", "🎀"),
        ("Ice cream", "🍦"), ("Carousel pony", "🎠"), ("Big wheel", "🎡"), ("Golden trophy", "🏆")]},
}

# Shown in the parent view, which describes the prize rather than naming one.
PRIZE_BLURB = {"name": "Surprise prize (12 to collect)", "emoji": "🎁"}


class SeasonalIn(BaseModel):
    enabled: bool = False
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    decorations: bool = True
    prize: bool = True


class WornIn(BaseModel):
    ids: List[str] = []


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


def _year() -> int:
    return int(_today()[:4])


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
    return {
        "pack": pack,
        "label": PACKS[pack]["label"],
        "prize": PRIZE_BLURB,
        "enabled": bool(cfg.get("enabled", False)),
        "start_date": cfg.get("start_date"),
        "end_date": cfg.get("end_date"),
        "decorations": bool(cfg.get("decorations", True)),
        "prize_enabled": bool(cfg.get("prize", True)),
        "active": is_active(cfg),
    }


def _norm(doc: dict) -> Optional[dict]:
    """Turn a stored claim into a prize. Older single-prize claims become the pack's first prize."""
    pack = doc.get("pack")
    if pack not in PACKS:
        return None
    pid = doc.get("prize_id") or f"{pack}-1"
    try:
        name, emoji = PACKS[pack]["prizes"][int(pid.rsplit("-", 1)[1]) - 1]
    except (ValueError, IndexError):
        return None
    try:
        year = int(doc.get("year") or str(doc.get("claimed_at") or "")[:4])
    except ValueError:
        year = _year()
    return {"id": pid, "pack": pack, "label": PACKS[pack]["label"], "name": name,
            "emoji": emoji, "year": year, "worn": bool(doc.get("worn", True))}


def register(api, db, require_child, require_parent, now_iso):
    def _now():
        return now_iso() if callable(now_iso) else str(now_iso)

    async def _family_configs(family_id) -> dict:
        docs = await db.seasonal_packs.find({"family_id": family_id}, {"_id": 0}).to_list(50)
        return {d["pack"]: d for d in docs}

    async def _owned(student_id) -> list:
        docs = await db.seasonal_prizes.find({"student_id": student_id}).to_list(500)
        rows = [(d, _norm(d)) for d in docs]
        rows = [(d, n) for d, n in rows if n]
        order = list(PACKS)
        rows.sort(key=lambda r: (order.index(r[1]["pack"]), int(r[1]["id"].rsplit("-", 1)[1])))
        return rows

    @api.get("/seasonal")
    async def list_packs(user=Depends(require_parent)):
        cfgs = await _family_configs(_family_parent(user))
        return {"today": _today(), "packs": [_view(p, cfgs.get(p)) for p in PACKS]}

    # Registered before PUT /seasonal/{pack} so "worn" is not read as a pack name.
    @api.put("/seasonal/worn")
    async def set_worn(data: WornIn, user=Depends(require_child)):
        rows = await _owned(user["id"])
        wanted = {n["id"] for _, n in rows if n["id"] in set(data.ids)}
        if len(wanted) > MAX_WORN:
            raise HTTPException(400, f"Pick up to {MAX_WORN} prizes at a time")
        for d, n in rows:
            await db.seasonal_prizes.update_one({"_id": d["_id"]}, {"$set": {"worn": n["id"] in wanted}})
        return {"ok": True, "keepsakes": [{**n, "worn": n["id"] in wanted} for _, n in rows]}

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
        keepsakes = [n for _, n in await _owned(user["id"])]
        year = _year()
        this_year = {k["pack"] for k in keepsakes if k["year"] == year}
        out = []
        for p in PACKS:
            v = _view(p, cfgs.get(p))
            if not v["active"]:
                continue
            have = sum(1 for k in keepsakes if k["pack"] == p)
            out.append({"pack": p, "label": v["label"], "decorations": v["decorations"],
                        "prize_enabled": v["prize_enabled"], "claimed": p in this_year,
                        "complete": have >= len(PACKS[p]["prizes"])})
        return {"packs": out, "keepsakes": keepsakes, "max_worn": MAX_WORN}

    @api.post("/seasonal/{pack}/claim")
    async def claim_prize(pack: str, user=Depends(require_child)):
        if pack not in PACKS:
            raise HTTPException(404, "Unknown pack")
        cfg = (await _family_configs(_family_child(user))).get(pack)
        v = _view(pack, cfg)
        if not v["active"] or not v["prize_enabled"]:
            raise HTTPException(400, "This prize is not available right now")
        rows = await _owned(user["id"])
        year = _year()
        mine = [n for _, n in rows if n["pack"] == pack]
        if any(n["year"] == year for n in mine):
            raise HTTPException(400, "You already claimed this year's prize. See you next year!")
        have = {n["id"] for n in mine}
        left = [f"{pack}-{i + 1}" for i in range(len(PACKS[pack]["prizes"])) if f"{pack}-{i + 1}" not in have]
        if not left:
            raise HTTPException(400, "You have collected every prize in this set!")
        pid = random.choice(left)
        worn_now = sum(1 for _, n in rows if n["worn"])
        res = await db.seasonal_prizes.update_one(
            {"student_id": user["id"], "pack": pack, "year": year},
            {"$setOnInsert": {"student_id": user["id"], "pack": pack, "year": year, "prize_id": pid,
                             "claimed_at": _now(), "worn": worn_now < MAX_WORN}},
            upsert=True)
        if res.upserted_id is None:
            raise HTTPException(400, "You already claimed this year's prize. See you next year!")
        name, emoji = PACKS[pack]["prizes"][int(pid.rsplit("-", 1)[1]) - 1]
        return {"ok": True, "prize": {"id": pid, "name": name, "emoji": emoji}}
