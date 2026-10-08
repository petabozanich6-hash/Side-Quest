"""Seasonal events for the pet room (Halloween, Christmas, etc).

A parent launches an event from the Side Quest page. While it is live, the family's
children see themed room decorations and can claim one free gift for their pet.
Gifts are kept after the event ends. Nothing goes live unless a parent launches it.

Wired up from pet_care.register(...).
"""
from datetime import datetime, timezone, timedelta, date

from fastapi import HTTPException, Depends

EVENTS = {
    "halloween": {"label": "Halloween", "gift": {"id": "hw_pumpkin_hat", "label": "Pumpkin Hat"}},
    "christmas": {"label": "Christmas", "gift": {"id": "xmas_santa_hat", "label": "Santa Hat"}},
    "new_year": {"label": "New Year", "gift": {"id": "ny_party_glasses", "label": "Party Glasses"}},
    "easter": {"label": "Easter", "gift": {"id": "easter_bunny_ears", "label": "Bunny Ears"}},
    "mothers_day": {"label": "Mother's Day", "gift": {"id": "mum_bouquet", "label": "Bouquet"}},
    "birthday": {"label": "Birthday", "gift": {"id": "bday_balloon", "label": "Birthday Balloon"}, "needs_child": True},
    "lunar_new_year": {"label": "Lunar New Year", "gift": {"id": "lny_lantern", "label": "Lucky Lantern"}},
}

GIFT_EMOJI = {
    "hw_pumpkin_hat": "\U0001F383", "xmas_santa_hat": "\U0001F385", "ny_party_glasses": "\U0001F973",
    "easter_bunny_ears": "\U0001F430", "mum_bouquet": "\U0001F490", "bday_balloon": "\U0001F388",
    "lny_lantern": "\U0001F3EE",
}


def _today() -> str:
    try:
        from zoneinfo import ZoneInfo
        return datetime.now(ZoneInfo("Australia/Sydney")).date().isoformat()
    except Exception:
        return (datetime.now(timezone.utc) + timedelta(hours=11)).date().isoformat()


def _is_live(doc) -> bool:
    if not doc or not doc.get("live"):
        return False
    ends = doc.get("ends_on")
    return not ends or ends >= _today()


def _gift(eid: str) -> dict:
    g = EVENTS[eid]["gift"]
    return {"id": g["id"], "label": g["label"], "emoji": GIFT_EMOJI.get(g["id"], "\u2728")}


def register(api, db, require_child, require_parent, now_iso):

    # ---- Parent ----
    @api.get("/seasonal/events")
    async def seasonal_list(user=Depends(require_parent)):
        docs = await db.seasonal_events.find({"family_id": user["family_id"]}, {"_id": 0}).to_list(50)
        by_id = {d["event_id"]: d for d in docs}
        out = []
        for eid, ev in EVENTS.items():
            d = by_id.get(eid)
            out.append({
                "id": eid, "label": ev["label"], "gift": _gift(eid),
                "needs_child": bool(ev.get("needs_child")),
                "live": _is_live(d), "ends_on": (d or {}).get("ends_on"),
                "student_id": (d or {}).get("student_id"),
            })
        return out

    @api.post("/seasonal/{eid}/launch")
    async def seasonal_launch(eid: str, data: dict, user=Depends(require_parent)):
        if eid not in EVENTS:
            raise HTTPException(404, "Unknown event")
        ends_on = (data.get("ends_on") or "").strip() or None
        if ends_on:
            try:
                date.fromisoformat(ends_on)
            except ValueError:
                raise HTTPException(400, "End date must look like 2026-11-07")
            if ends_on < _today():
                raise HTTPException(400, "End date is in the past")
        student_id = None
        if EVENTS[eid].get("needs_child"):
            student_id = data.get("student_id")
            kid = await db.students.find_one({"id": student_id, "family_id": user["family_id"]}) if student_id else None
            if not kid:
                raise HTTPException(400, "Choose which child this is for")
        await db.seasonal_events.update_one(
            {"family_id": user["family_id"], "event_id": eid},
            {"$set": {"live": True, "ends_on": ends_on, "student_id": student_id, "started_at": now_iso()}},
            upsert=True)
        return {"ok": True}

    @api.post("/seasonal/{eid}/end")
    async def seasonal_end(eid: str, user=Depends(require_parent)):
        if eid not in EVENTS:
            raise HTTPException(404, "Unknown event")
        await db.seasonal_events.update_one(
            {"family_id": user["family_id"], "event_id": eid},
            {"$set": {"live": False, "ended_at": now_iso()}})
        return {"ok": True}

    # ---- Child ----
    @api.get("/seasonal/active")
    async def seasonal_active(user=Depends(require_child)):
        docs = await db.seasonal_events.find({"family_id": user["family_id"]}, {"_id": 0}).to_list(50)
        claims = await db.seasonal_claims.find({"student_id": user["id"]}, {"_id": 0}).to_list(100)
        claimed = {c["event_id"] for c in claims}
        events = []
        for d in docs:
            eid = d.get("event_id")
            if eid not in EVENTS or not _is_live(d):
                continue
            if EVENTS[eid].get("needs_child") and d.get("student_id") != user["id"]:
                continue
            events.append({"id": eid, "label": EVENTS[eid]["label"], "gift": _gift(eid), "claimed": eid in claimed})
        owned = [{**_gift(eid), "event": eid, "event_label": EVENTS[eid]["label"]} for eid in EVENTS if eid in claimed]
        return {"events": events, "owned": owned}

    @api.post("/seasonal/{eid}/claim")
    async def seasonal_claim(eid: str, user=Depends(require_child)):
        if eid not in EVENTS:
            raise HTTPException(404, "Unknown event")
        d = await db.seasonal_events.find_one({"family_id": user["family_id"], "event_id": eid})
        if not _is_live(d) or (EVENTS[eid].get("needs_child") and d.get("student_id") != user["id"]):
            raise HTTPException(400, "This gift isn't available right now")
        if await db.seasonal_claims.find_one({"student_id": user["id"], "event_id": eid}):
            raise HTTPException(400, "You already have this gift")
        pet = await db.pets.find_one({"student_id": user["id"]})
        if not pet:
            raise HTTPException(404, "No pet yet")
        gift = _gift(eid)
        await db.seasonal_claims.insert_one({"student_id": user["id"], "family_id": user["family_id"],
                                             "event_id": eid, "gift_id": gift["id"], "claimed_at": now_iso()})
        await db.pets.update_one({"student_id": user["id"]}, {"$addToSet": {"unlocked_accessories": gift["id"]}})
        return {"ok": True, "gift": gift}
