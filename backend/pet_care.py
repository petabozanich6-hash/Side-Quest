"""Pet care system for Side Quest Learning.

Everything is computed lazily from timestamps whenever the pet is loaded,
so no background scheduler is needed.

Wire-up (in server.py, after achievements.register(...)):
    import pet_care
    pet_care.register(api, db, require_child, require_parent, now_iso)
"""
from datetime import datetime, timezone, timedelta
from typing import Optional

from fastapi import HTTPException, Depends

# ---- Tunable settings -------------------------------------------------------
STAGES = [  # (xp needed, name, icon)
    (0, "Egg", "egg"),
    (60, "Hatchling", "sprout"),
    (200, "Youngling", "leaf"),
    (500, "Companion", "tree"),
    (1000, "Hero", "star"),
    (2000, "Legend", "sparkle"),
]
HATCH_XP = 60
HATCH_CARE_DAYS = 3          # egg must be cared for on this many different days
FEED_COOLDOWN_HOURS = 6
POOP_INTERVAL_HOURS = 24
SAD_DAYS = 2                 # days of neglect -> sad / hungry
SICK_DAYS = 3                # -> sick
ASLEEP_DAYS = 6              # -> asleep (revivable by feeding)
PLAY_XP = 2
PLAY_DAILY_CAP = 5

# Visual identity for each species' egg (frontend renders from this).
EGG_STYLES = {
    "fox":      {"base": "#F4A261", "accent": "#FFF1E0", "pattern": "zigzag",   "glow": "#FFD6A5"},
    "owl":      {"base": "#A98467", "accent": "#EAD7C3", "pattern": "feathers", "glow": "#E8D5B7"},
    "turtle":   {"base": "#8FBF9F", "accent": "#4F8A6B", "pattern": "hexagons", "glow": "#C7F0D8"},
    "hedgehog": {"base": "#C9B8A6", "accent": "#7B6A5A", "pattern": "spikes",   "glow": "#EFE3D3"},
    "fawn":     {"base": "#E9C8A0", "accent": "#FFFFFF", "pattern": "spots",    "glow": "#FFF0DC"},
    "squirrel": {"base": "#B5651D", "accent": "#F0C987", "pattern": "stripes",  "glow": "#FFD9A0"},
    "rabbit":   {"base": "#F2E9F0", "accent": "#F7B6D2", "pattern": "hearts",   "glow": "#FFE0EF"},
    "dragon":   {"base": "#7B5EA7", "accent": "#F2C14E", "pattern": "scales",   "glow": "#D9C2FF"},
}

# Accessories: id -> (label, unlock rule). Rules: stage:<name>, streak:<n>,
# cleans:<n>, reading:<n>
ACCESSORIES = {
    "scarf":         ("Cozy Scarf", "stage:Hatchling"),
    "bow":           ("Little Bow", "cleans:3"),
    "flower_crown":  ("Flower Crown", "stage:Youngling"),
    "party_hat":     ("Party Hat", "streak:7"),
    "bookworm_specs": ("Bookworm Specs", "reading:5"),
    "backpack":      ("Adventure Backpack", "stage:Companion"),
    "cape":          ("Hero Cape", "stage:Hero"),
    "star_badge":    ("Star Badge", "streak:30"),
    "crown":         ("Legend Crown", "stage:Legend"),
}


# ---- Helpers ----------------------------------------------------------------
def _parse(s: Optional[str]):
    if not s:
        return None
    try:
        d = datetime.fromisoformat(s)
    except ValueError:
        return None
    return d if d.tzinfo else d.replace(tzinfo=timezone.utc)


def _iso(d: datetime) -> str:
    return d.isoformat()


def _stage_for(xp: int, hatched: bool):
    if not hatched:
        tier = STAGES[0]
    else:
        tier = STAGES[1]
        for t in STAGES[1:]:
            if xp >= t[0]:
                tier = t
    nxt = next((x for x in STAGES if x[0] > xp and (hatched or x[0] > 0)), None)
    if not hatched:
        nxt = STAGES[1]
    return {"level_name": tier[1], "level_icon": tier[2],
            "next_xp": nxt[0] if nxt else None, "next_level": nxt[1] if nxt else None}


def _status(hatched: bool, neglect_days: float) -> str:
    if neglect_days >= ASLEEP_DAYS:
        return "asleep" if hatched else "cold"
    if neglect_days >= SICK_DAYS:
        return "sick" if hatched else "cold"
    if neglect_days >= SAD_DAYS:
        return "sad" if hatched else "chilly"
    return "ok"


def _rule_met(rule: str, stage_idx: int, pet: dict, reading_count: int) -> bool:
    kind, _, val = rule.partition(":")
    if kind == "stage":
        names = [s[1] for s in STAGES]
        return val in names and stage_idx >= names.index(val)
    if kind == "streak":
        return int(pet.get("best_streak", 0)) >= int(val)
    if kind == "cleans":
        return int(pet.get("cleans_total", 0)) >= int(val)
    if kind == "reading":
        return reading_count >= int(val)
    return False


async def _sync(db, pet: dict, now: datetime) -> dict:
    """Bring a pet up to date from timestamps, persist, and return it."""
    upd = {}
    paused = bool(pet.get("care_paused"))
    clock = _parse(pet.get("paused_at")) if paused and pet.get("paused_at") else now
    clock = clock or now

    last_fed = _parse(pet.get("last_fed")) or clock
    hatched = bool(pet.get("hatched"))
    xp = int(pet.get("xp", 0))

    if not hatched and xp >= HATCH_XP and len(pet.get("egg_care_dates", [])) >= HATCH_CARE_DAYS:
        hatched = True
        upd["hatched"] = True
        upd["hatched_at"] = _iso(clock)
        upd["next_poop_at"] = _iso(clock + timedelta(hours=POOP_INTERVAL_HOURS))
        pet["next_poop_at"] = upd["next_poop_at"]

    nxt_poop = _parse(pet.get("next_poop_at"))
    if hatched and nxt_poop is None:
        nxt_poop = clock + timedelta(hours=POOP_INTERVAL_HOURS)
        upd["next_poop_at"] = _iso(nxt_poop)
    poop_pending = bool(pet.get("poop_pending"))
    poop_since = _parse(pet.get("poop_since"))
    if hatched and not poop_pending and nxt_poop and clock >= nxt_poop:
        poop_pending, poop_since = True, nxt_poop
        upd["poop_pending"] = True
        upd["poop_since"] = _iso(nxt_poop)

    fed_days = max(0.0, (clock - last_fed).total_seconds() / 86400)
    poop_days = (max(0.0, (clock - poop_since).total_seconds() / 86400)
                 if poop_pending and poop_since else 0.0)
    neglect = max(fed_days, poop_days)

    pet.update(upd)
    pet.update({"hatched": hatched, "poop_pending": poop_pending,
                "poop_since": _iso(poop_since) if poop_since else None,
                "neglect_days": round(neglect, 2),
                "care_status": _status(hatched, neglect)})
    if upd:
        await db.pets.update_one({"student_id": pet["student_id"]}, {"$set": upd})
    return pet


async def _public(db, pet: dict) -> dict:
    out = {k: v for k, v in pet.items() if k not in ("_id", "activity")}
    stage = _stage_for(int(pet.get("xp", 0)), bool(pet.get("hatched")))
    out.update(stage)
    names = [s[1] for s in STAGES]
    stage_idx = names.index(stage["level_name"])
    reading = await db.reading_log.count_documents({"student_id": pet["student_id"]})

    unlocked = set(pet.get("unlocked_accessories", []))
    for aid, (_, rule) in ACCESSORIES.items():
        if aid not in unlocked and _rule_met(rule, stage_idx, pet, reading):
            unlocked.add(aid)
    if unlocked != set(pet.get("unlocked_accessories", [])):
        await db.pets.update_one({"student_id": pet["student_id"]},
                                 {"$set": {"unlocked_accessories": sorted(unlocked)}})
    out["unlocked_accessories"] = sorted(unlocked)
    out["accessory_catalog"] = [
        {"id": aid, "label": lab, "rule": rule, "unlocked": aid in unlocked}
        for aid, (lab, rule) in ACCESSORIES.items()]
    out["egg_style"] = EGG_STYLES.get(pet.get("species"), EGG_STYLES["dragon"])
    out["hatch"] = {"xp_needed": HATCH_XP, "care_days_needed": HATCH_CARE_DAYS,
                    "care_days_done": len(pet.get("egg_care_dates", []))}
    out["care"] = {
        "needs_feeding": _needs_feed(pet),
        "needs_cleaning": bool(pet.get("poop_pending")),
        "asleep": pet.get("care_status") == "asleep",
        "paused": bool(pet.get("care_paused")),
    }
    return out


def _needs_feed(pet: dict) -> bool:
    lf = _parse(pet.get("last_fed"))
    if not lf:
        return True
    return (datetime.now(timezone.utc) - lf) >= timedelta(hours=FEED_COOLDOWN_HOURS)


async def _load(db, student_id: str, now: datetime) -> dict:
    pet = await db.pets.find_one({"student_id": student_id})
    if not pet:
        raise HTTPException(404, "No pet yet")
    pet.pop("_id", None)
    return await _sync(db, pet, now)


def _touch_streak(pet: dict, now: datetime) -> dict:
    today = now.date().isoformat()
    yesterday = (now.date() - timedelta(days=1)).isoformat()
    last = pet.get("last_streak_date")
    streak = int(pet.get("care_streak", 0))
    if last == today:
        pass
    elif last == yesterday:
        streak += 1
    else:
        streak = 1
    return {"last_streak_date": today, "care_streak": streak,
            "best_streak": max(int(pet.get("best_streak", 0)), streak)}


# ---- Routes -----------------------------------------------------------------
def register(api, db, require_child, require_parent, now_iso):

    @api.get("/pet/state")
    async def pet_state(user=Depends(require_child)):
        now = datetime.now(timezone.utc)
        pet = await db.pets.find_one({"student_id": user["id"]})
        if not pet:
            return {"needs_pet": True}
        pet.pop("_id", None)
        pet = await _sync(db, pet, now)
        return await _public(db, pet)

    @api.post("/pet/care/feed")
    async def care_feed(user=Depends(require_child)):
        now = datetime.now(timezone.utc)
        pet = await _load(db, user["id"], now)
        if pet.get("care_paused"):
            raise HTTPException(400, "Care is paused by your parent")
        revived = pet["care_status"] == "asleep"
        if not revived and not _needs_feed(pet):
            raise HTTPException(400, "Not hungry yet - try again later")
        happy = int(pet.get("happiness", 70))
        upd = {"last_fed": _iso(now), **_touch_streak(pet, now)}
        if revived:
            upd["happiness"] = 25
            upd["revived_count"] = int(pet.get("revived_count", 0)) + 1
            if pet.get("poop_pending"):
                upd["poop_since"] = _iso(now)
        else:
            upd["happiness"] = min(100, happy + 10)
        if not pet.get("hatched"):
            dates = set(pet.get("egg_care_dates", []))
            dates.add(now.date().isoformat())
            upd["egg_care_dates"] = sorted(dates)
        await db.pets.update_one({"student_id": user["id"]}, {"$set": upd})
        pet.update(upd)
        pet = await _sync(db, pet, now)
        out = await _public(db, pet)
        out["revived"] = revived
        return out

    @api.post("/pet/care/play")
    async def care_play(user=Depends(require_child)):
        now = datetime.now(timezone.utc)
        pet = await _load(db, user["id"], now)
        if pet.get("care_paused"):
            raise HTTPException(400, "Care is paused by your parent")
        if pet["care_status"] == "asleep":
            raise HTTPException(400, "Your pet is asleep - feed it to wake it up")
        today = now.date().isoformat()
        count = int(pet.get("play_count", 0)) if pet.get("play_day") == today else 0
        if count >= PLAY_DAILY_CAP:
            raise HTTPException(400, "Your pet is tired - play again tomorrow")
        upd = {"play_day": today, "play_count": count + 1, "last_played": _iso(now),
               "happiness": min(100, int(pet.get("happiness", 70)) + 8),
               "xp": int(pet.get("xp", 0)) + PLAY_XP}
        if not pet.get("hatched"):
            dates = set(pet.get("egg_care_dates", []))
            dates.add(today)
            upd["egg_care_dates"] = sorted(dates)
        await db.pets.update_one(
            {"student_id": user["id"]},
            {"$set": upd,
             "$push": {"activity": {"amount": PLAY_XP, "reason": "Played with pet", "at": _iso(now)}}})
        pet.update(upd)
        pet = await _sync(db, pet, now)
        return await _public(db, pet)

    @api.post("/pet/care/clean")
    async def care_clean(user=Depends(require_child)):
        now = datetime.now(timezone.utc)
        pet = await _load(db, user["id"], now)
        if pet.get("care_paused"):
            raise HTTPException(400, "Care is paused by your parent")
        if not pet.get("poop_pending"):
            raise HTTPException(400, "Nothing to clean right now")
        upd = {"poop_pending": False, "poop_since": None,
               "next_poop_at": _iso(now + timedelta(hours=POOP_INTERVAL_HOURS)),
               "cleans_total": int(pet.get("cleans_total", 0)) + 1,
               "happiness": min(100, int(pet.get("happiness", 70)) + 5)}
        await db.pets.update_one({"student_id": user["id"]}, {"$set": upd})
        pet.update(upd)
        pet = await _sync(db, pet, now)
        return await _public(db, pet)

    @api.put("/pet/care/wear")
    async def care_wear(data: dict, user=Depends(require_child)):
        now = datetime.now(timezone.utc)
        pet = await _load(db, user["id"], now)
        pub = await _public(db, pet)
        wanted = data.get("accessories", [])
        if not isinstance(wanted, list):
            raise HTTPException(400, "accessories must be a list")
        allowed = set(pub["unlocked_accessories"])
        worn = [a for a in wanted if a in allowed][:10]
        await db.pets.update_one({"student_id": user["id"]}, {"$set": {"accessories": worn}})
        return {"accessories": worn}

    # ---- Parent holiday pause (stops the neglect clock) ----
    @api.post("/pet/care/pause")
    async def care_pause(data: dict, user=Depends(require_parent)):
        pet = await db.pets.find_one({"student_id": data.get("student_id"),
                                      "family_id": user["family_id"]})
        if not pet:
            raise HTTPException(404, "Pet not found")
        if pet.get("care_paused"):
            return {"ok": True, "paused": True}
        now = datetime.now(timezone.utc)
        pet.pop("_id", None)
        await _sync(db, pet, now)
        await db.pets.update_one({"student_id": pet["student_id"]},
                                 {"$set": {"care_paused": True, "paused_at": _iso(now)}})
        return {"ok": True, "paused": True}

    @api.post("/pet/care/resume")
    async def care_resume(data: dict, user=Depends(require_parent)):
        pet = await db.pets.find_one({"student_id": data.get("student_id"),
                                      "family_id": user["family_id"]})
        if not pet:
            raise HTTPException(404, "Pet not found")
        if not pet.get("care_paused"):
            return {"ok": True, "paused": False}
        now = datetime.now(timezone.utc)
        paused_at = _parse(pet.get("paused_at")) or now
        delta = max(timedelta(0), now - paused_at)
        upd = {"care_paused": False, "paused_at": None}
        for key in ("last_fed", "next_poop_at", "poop_since"):
            d = _parse(pet.get(key))
            if d:
                upd[key] = _iso(d + delta)
        await db.pets.update_one({"student_id": pet["student_id"]}, {"$set": upd})
        return {"ok": True, "paused": False}

    # ---- Seasonal events (Halloween, Christmas, etc) ----
    import seasonal_events
    seasonal_events.register(api, db, require_child, require_parent, now_iso)
