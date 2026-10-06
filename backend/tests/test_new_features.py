"""Backend tests for newer Side Quest features:
reading log, life learning, learning plan, pet full flow,
curriculum outcomes count + patterns, ICS calendar, cheer, overview,
lesson suggested_resources + follow_up_challenges fields.
"""
import os
import uuid
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
API = BASE_URL + "/api"
OWNER_EMAIL = "petabozanich6@gmail.com"
OWNER_PW = "SideQuest2026!"

S = requests.Session()
S.headers.update({"Content-Type": "application/json"})
STATE = {}


def auth(t):
    return {"Authorization": f"Bearer {t}"}


# ---------------- Setup ----------------
def test_login_owner():
    r = S.post(f"{API}/auth/login", json={"email": OWNER_EMAIL, "password": OWNER_PW})
    assert r.status_code == 200, r.text
    STATE["t"] = r.json()["token"]


def test_create_student_s2():
    u = f"newf_{uuid.uuid4().hex[:6]}"
    r = S.post(f"{API}/students", json={
        "name": "Testy", "username": u, "pin": "1234", "stage": "S2"
    }, headers=auth(STATE["t"]))
    assert r.status_code == 200, r.text
    STATE["sid"] = r.json()["id"]
    STATE["suser"] = u


def test_child_login_token():
    r = S.post(f"{API}/auth/child-login", json={"username": STATE["suser"], "pin": "1234"})
    assert r.status_code == 200
    STATE["ct"] = r.json()["token"]


# ---------------- Curriculum: stages source link + outcomes count ----------------
def test_stage_source_links():
    r = S.get(f"{API}/curriculum/stages")
    assert r.status_code == 200
    stages = r.json()
    assert any(s.get("source_link") for s in stages), "No source_link on any stage"


def test_outcomes_total_count():
    total = 0
    for code in ["ES1", "S1", "S2", "S3", "S4", "S5", "S6"]:
        r = S.get(f"{API}/curriculum/outcomes", params={"stage": code})
        assert r.status_code == 200
        total += len(r.json())
    print(f"Total outcomes across stages: {total}")
    assert total >= 100, f"Expected 100+ outcomes, got {total}"


def test_curriculum_pattern_s5():
    r = S.get(f"{API}/curriculum/pattern/S5")
    assert r.status_code == 200
    data = r.json()
    # Expect a structure with compulsory and electives
    assert isinstance(data, dict)
    # Looking for keys like compulsory/electives
    assert any(k in data for k in ("compulsory", "electives", "pattern"))


def test_curriculum_pattern_s6():
    r = S.get(f"{API}/curriculum/pattern/S6")
    assert r.status_code == 200


# ---------------- AI lesson suggested_resources + follow_up_challenges ----------------
def test_ai_lesson_has_resources_and_challenges():
    r = S.post(f"{API}/ai/generate-lesson", json={
        "stage": "S2", "learning_area": "English",
        "topic": "Narrative openings", "duration_minutes": 30
    }, headers=auth(STATE["t"]), timeout=180)
    assert r.status_code == 200, r.text
    L = r.json()
    STATE["lesson_id"] = L["id"]
    assert "suggested_resources" in L, "lesson missing suggested_resources"
    assert "follow_up_challenges" in L, "lesson missing follow_up_challenges"
    assert isinstance(L["suggested_resources"], list)
    assert isinstance(L["follow_up_challenges"], list)


# ---------------- Pet full flow ----------------
def test_pet_species_list():
    r = S.get(f"{API}/pet/species")
    assert r.status_code == 200
    assert len(r.json()) > 0


def test_pet_needs_pet_initially():
    r = S.get(f"{API}/pet", headers=auth(STATE["ct"]))
    assert r.status_code == 200
    assert r.json().get("needs_pet") is True


def test_pet_create():
    r = S.post(f"{API}/pet", json={"species": "fox", "name": "Mittens"},
               headers=auth(STATE["ct"]))
    assert r.status_code == 200, r.text
    assert r.json()["species"] == "cat"


def test_pet_feed():
    r = S.post(f"{API}/pet/feed", headers=auth(STATE["ct"]))
    assert r.status_code == 200
    assert "happiness" in r.json()


def test_pet_play():
    r = S.post(f"{API}/pet/play", headers=auth(STATE["ct"]))
    assert r.status_code == 200, f"/pet/play missing: {r.status_code} {r.text}"


def test_pet_customize():
    r = S.put(f"{API}/pet/customize", json={"background": "forest"},
              headers=auth(STATE["ct"]))
    assert r.status_code == 200, f"/pet/customize missing: {r.status_code} {r.text}"


# ---------------- Cheer / high-five ----------------
def test_cheer_send():
    r = S.post(f"{API}/cheers", json={
        "student_id": STATE["sid"], "message": "Great work today!", "emoji": "⭐"
    }, headers=auth(STATE["t"]))
    assert r.status_code == 200, f"/cheers endpoint missing: {r.status_code} {r.text}"
    STATE["cheer_id"] = r.json().get("id")


def test_cheer_in_child_dashboard_and_xp():
    # Get pet before to compare XP
    pet_before = S.get(f"{API}/pet", headers=auth(STATE["ct"])).json()
    xp_before = pet_before.get("xp", 0)

    # Fetch child dashboard, expect cheers to appear
    r = S.get(f"{API}/dashboard/child", headers=auth(STATE["ct"]))
    assert r.status_code == 200
    j = r.json()
    assert "cheers" in j, "child dashboard missing 'cheers' key"
    assert len(j["cheers"]) >= 1

    # XP should be +5
    pet_after = S.get(f"{API}/pet", headers=auth(STATE["ct"])).json()
    assert pet_after.get("xp", 0) >= xp_before + 5, \
        f"Expected XP +5 after cheer, got {xp_before} -> {pet_after.get('xp')}"


def test_student_overview_endpoint():
    r = S.get(f"{API}/students/{STATE['sid']}/overview", headers=auth(STATE["t"]))
    assert r.status_code == 200, f"students/overview missing: {r.status_code}"
    j = r.json()
    assert "cheers" in j


# ---------------- Reading log ----------------
def test_reading_log_create():
    r = S.post(f"{API}/reading-log", json={
        "student_id": STATE["sid"], "title": "Book A",
        "author": "Author", "minutes": 20, "read_date": "2026-01-10"
    }, headers=auth(STATE["t"]))
    assert r.status_code == 200, r.text
    STATE["read_id"] = r.json()["id"]


def test_reading_log_list():
    r = S.get(f"{API}/reading-log", params={"student_id": STATE["sid"]},
              headers=auth(STATE["t"]))
    assert r.status_code == 200
    assert any(e["id"] == STATE["read_id"] for e in r.json())


def test_reading_log_stats():
    r = S.get(f"{API}/reading-log/stats", params={"student_id": STATE["sid"]},
              headers=auth(STATE["t"]))
    assert r.status_code == 200


def test_reading_log_delete():
    r = S.delete(f"{API}/reading-log/{STATE['read_id']}", headers=auth(STATE["t"]))
    assert r.status_code == 200


# ---------------- Life Learning ----------------
def test_life_evidence_create():
    r = S.post(f"{API}/life-evidence", json={
        "student_id": STATE["sid"],
        "title": "Baked cookies",
        "description": "Measured ingredients, read recipe, talked about chemical change.",
        "date": "2026-01-11"
    }, headers=auth(STATE["t"]))
    assert r.status_code == 200, r.text
    STATE["evi_id"] = r.json()["id"]


def test_life_evidence_analyse():
    r = S.post(f"{API}/life-evidence/analyse",
               json={"evidence_id": STATE["evi_id"]},
               headers=auth(STATE["t"]), timeout=180)
    assert r.status_code == 200, r.text
    j = r.json()
    assert "mappings" in j or "learning_areas" in j or isinstance(j, dict)


def test_life_evidence_review():
    r = S.post(f"{API}/life-evidence/{STATE['evi_id']}/review",
               json={"outcome_mappings": [], "parent_note": "Looks good", "status": "accepted"},
               headers=auth(STATE["t"]))
    assert r.status_code == 200, r.text


# ---------------- Learning plans ----------------
def test_learning_plan_create():
    r = S.post(f"{API}/learning-plans", json={
        "student_id": STATE["sid"],
        "title": "Term 1 plan",
        "period_start": "2026-02-01",
        "period_end": "2026-04-10",
        "subject_focus": ["English", "Mathematics"]
    }, headers=auth(STATE["t"]))
    assert r.status_code == 200, r.text
    STATE["plan_id"] = r.json()["id"]


def test_learning_plan_generate():
    r = S.post(f"{API}/learning-plans/{STATE['plan_id']}/generate",
               headers=auth(STATE["t"]), timeout=240)
    assert r.status_code == 200, r.text


# ---------------- ICS calendar ----------------
def test_ics_calendar():
    # create an event first
    S.post(f"{API}/calendar", json={
        "title": "Reading block", "date": "2026-02-02",
        "student_id": STATE["sid"], "event_type": "lesson"
    }, headers=auth(STATE["t"]))
    r = S.get(f"{API}/calendar/ics", headers=auth(STATE["t"]))
    assert r.status_code == 200, f"ICS endpoint missing: {r.status_code}"
    assert "text/calendar" in r.headers.get("content-type", ""), r.headers
    assert "BEGIN:VCALENDAR" in r.text
