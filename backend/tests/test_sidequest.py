"""End-to-end backend tests for Side Quest Learning."""
import os
import io
import time
import uuid
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
if not BASE_URL:
    # fallback to internal if env missing
    BASE_URL = "http://localhost:8001"
API = BASE_URL + "/api"

OWNER_EMAIL = "petabozanich6@gmail.com"
OWNER_PW = "SideQuest2026!"

SESSION = requests.Session()
SESSION.headers.update({"Content-Type": "application/json"})

STATE = {}


def _auth(token):
    return {"Authorization": f"Bearer {token}"}


# ============ Curriculum ============
def test_root():
    r = SESSION.get(f"{API}/")
    assert r.status_code == 200
    j = r.json()
    assert "name" in j and "version" in j


def test_stages():
    r = SESSION.get(f"{API}/curriculum/stages")
    assert r.status_code == 200
    stages = r.json()
    assert len(stages) == 7
    codes = [s["code"] for s in stages]
    assert codes == ["ES1", "S1", "S2", "S3", "S4", "S5", "S6"]


def test_outcomes_s2():
    r = SESSION.get(f"{API}/curriculum/outcomes", params={"stage": "S2"})
    assert r.status_code == 200
    outs = r.json()
    assert len(outs) >= 3
    assert all(o["stage"] == "S2" for o in outs)


# ============ Auth ============
def test_owner_login():
    r = SESSION.post(f"{API}/auth/login", json={"email": OWNER_EMAIL, "password": OWNER_PW})
    assert r.status_code == 200, r.text
    j = r.json()
    assert "token" in j and "user" in j
    STATE["owner_token"] = j["token"]
    STATE["owner_family"] = j["user"]["family_id"]


def test_register_family_a():
    email = f"TEST_a_{uuid.uuid4().hex[:8]}@example.com"
    r = SESSION.post(f"{API}/auth/register", json={
        "email": email, "password": "TestPass123!", "name": "Parent A", "family_name": "Family A"
    })
    assert r.status_code == 200, r.text
    j = r.json()
    STATE["a_token"] = j["token"]
    STATE["a_family"] = j["user"]["family_id"]
    STATE["a_email"] = email


def test_register_family_b():
    email = f"TEST_b_{uuid.uuid4().hex[:8]}@example.com"
    r = SESSION.post(f"{API}/auth/register", json={
        "email": email, "password": "TestPass123!", "name": "Parent B", "family_name": "Family B"
    })
    assert r.status_code == 200, r.text
    j = r.json()
    STATE["b_token"] = j["token"]
    STATE["b_family"] = j["user"]["family_id"]


# ============ Students ============
def test_create_student_a():
    uname = f"kida_{uuid.uuid4().hex[:6]}"
    r = SESSION.post(f"{API}/students", json={
        "name": "Kid A", "username": uname, "pin": "1234", "stage": "S2"
    }, headers=_auth(STATE["a_token"]))
    assert r.status_code == 200, r.text
    s = r.json()
    assert s["family_id"] == STATE["a_family"]
    assert "pin" not in s
    STATE["student_a_id"] = s["id"]
    STATE["student_a_username"] = uname


def test_create_student_b():
    uname = f"kidb_{uuid.uuid4().hex[:6]}"
    r = SESSION.post(f"{API}/students", json={
        "name": "Kid B", "username": uname, "pin": "9999", "stage": "S4"
    }, headers=_auth(STATE["b_token"]))
    assert r.status_code == 200
    STATE["student_b_id"] = r.json()["id"]


def test_child_login():
    r = SESSION.post(f"{API}/auth/child-login", json={
        "username": STATE["student_a_username"], "pin": "1234"
    })
    assert r.status_code == 200, r.text
    j = r.json()
    assert j["student"]["family_id"] == STATE["a_family"]
    STATE["child_a_token"] = j["token"]


# ============ Family Isolation ============
def test_family_isolation_students():
    r = SESSION.get(f"{API}/students", headers=_auth(STATE["a_token"]))
    assert r.status_code == 200
    ids = [s["id"] for s in r.json()]
    assert STATE["student_a_id"] in ids
    assert STATE["student_b_id"] not in ids


def test_family_isolation_get_other_student():
    r = SESSION.get(f"{API}/students/{STATE['student_b_id']}", headers=_auth(STATE["a_token"]))
    assert r.status_code == 404


# ============ AI Lesson Generation ============
def test_ai_generate_lesson():
    r = SESSION.post(f"{API}/ai/generate-lesson", json={
        "stage": "S2", "learning_area": "English",
        "topic": "Narrative openings", "duration_minutes": 45
    }, headers=_auth(STATE["a_token"]), timeout=180)
    assert r.status_code == 200, r.text
    L = r.json()
    assert L.get("status") == "needs_review"
    for k in ["explicit_teaching", "success_criteria", "independent_task", "evidence_requirement"]:
        assert L.get(k), f"missing {k}"
    STATE["lesson_id"] = L["id"]


def test_ai_generate_side_quest():
    r = SESSION.post(f"{API}/ai/generate-lesson", json={
        "stage": "S2", "learning_area": "English",
        "topic": "Spooky stories", "duration_minutes": 45,
        "is_side_quest": True, "theme": "Halloween"
    }, headers=_auth(STATE["a_token"]), timeout=180)
    assert r.status_code == 200, r.text
    L = r.json()
    assert L.get("is_side_quest") is True
    assert L.get("theme") == "Halloween"
    assert L.get("explicit_teaching")


# ============ Assignments ============
def test_create_assignment():
    r = SESSION.post(f"{API}/assignments", json={
        "student_id": STATE["student_a_id"], "lesson_id": STATE["lesson_id"]
    }, headers=_auth(STATE["a_token"]))
    assert r.status_code == 200, r.text
    a = r.json()
    assert a["status"] == "not_started"
    STATE["assignment_id"] = a["id"]


def test_child_only_sees_own_assignments():
    r = SESSION.get(f"{API}/assignments", headers=_auth(STATE["child_a_token"]))
    assert r.status_code == 200
    ids = [a["id"] for a in r.json()]
    assert STATE["assignment_id"] in ids
    # all should belong to this child
    for a in r.json():
        assert a["student_id"] == STATE["student_a_id"]


# ============ File upload ============
def test_file_upload_and_download():
    # tiny PNG header
    png = (b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
           b"\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc\xf8\xff\xff?\x00\x05\xfe\x02\xfe\xdc\xccY\xe7\x00\x00\x00\x00IEND\xaeB`\x82")
    files = {"file": ("test.png", io.BytesIO(png), "image/png")}
    r = requests.post(f"{API}/files/upload", files=files,
                      headers={"Authorization": f"Bearer {STATE['child_a_token']}"}, timeout=60)
    assert r.status_code == 200, r.text
    f = r.json()
    assert "id" in f and "storage_path" in f
    STATE["file_id"] = f["id"]

    # Download via query param
    r2 = requests.get(f"{API}/files/{f['id']}", params={"auth": STATE["child_a_token"]}, timeout=60)
    assert r2.status_code == 200
    assert r2.headers.get("content-type", "").startswith("image/")
    assert r2.content[:8] == b"\x89PNG\r\n\x1a\n"


# ============ Submissions ============
def test_submit_work():
    r = SESSION.post(f"{API}/submissions", json={
        "assignment_id": STATE["assignment_id"],
        "response_text": "Once upon a time, a shadow slipped under the door...",
        "reflection": "I tried a hook using sensory detail.",
        "file_ids": [STATE["file_id"]],
        "needs_help": False
    }, headers=_auth(STATE["child_a_token"]))
    assert r.status_code == 200, r.text
    STATE["submission_id"] = r.json()["id"]

    # Verify assignment status moved to submitted
    r2 = SESSION.get(f"{API}/assignments/{STATE['assignment_id']}", headers=_auth(STATE["a_token"]))
    assert r2.status_code == 200
    assert r2.json()["status"] == "submitted"


def test_ai_analyse_submission():
    r = SESSION.post(f"{API}/ai/analyse-submission",
                    json={"submission_id": STATE["submission_id"]},
                    headers=_auth(STATE["a_token"]), timeout=180)
    assert r.status_code == 200, r.text
    a = r.json()
    for k in ["summary", "possible_outcomes", "suggested_feedback", "overall_confidence"]:
        assert k in a, f"missing {k}"


def test_parent_feedback():
    r = SESSION.post(f"{API}/submissions/{STATE['submission_id']}/feedback", json={
        "submission_id": STATE["submission_id"],
        "feedback_text": "Great hook! Keep working on sentence variety.",
        "status": "demonstrated",
        "next_step": "Try a second paragraph with dialogue."
    }, headers=_auth(STATE["a_token"]))
    assert r.status_code == 200
    r2 = SESSION.get(f"{API}/assignments/{STATE['assignment_id']}", headers=_auth(STATE["a_token"]))
    assert r2.json()["status"] == "demonstrated"


# ============ Resources ============
def test_create_and_approve_resource():
    r = SESSION.post(f"{API}/resources", json={
        "title": "ABC Education", "url": "https://education.abc.net.au",
        "licence": "government", "stage": "S2", "learning_area": "English"
    }, headers=_auth(STATE["a_token"]))
    assert r.status_code == 200
    rid = r.json()["id"]
    assert r.json()["approved"] is False
    r2 = SESSION.put(f"{API}/resources/{rid}/approve", headers=_auth(STATE["a_token"]))
    assert r2.status_code == 200
    r3 = SESSION.get(f"{API}/resources", headers=_auth(STATE["a_token"]))
    found = next((x for x in r3.json() if x["id"] == rid), None)
    assert found and found["approved"] is True


# ============ Calendar ============
def test_calendar():
    r = SESSION.post(f"{API}/calendar", json={
        "title": "Writing block", "date": "2026-02-01",
        "student_id": STATE["student_a_id"], "event_type": "lesson"
    }, headers=_auth(STATE["a_token"]))
    assert r.status_code == 200
    eid = r.json()["id"]
    r2 = SESSION.get(f"{API}/calendar", headers=_auth(STATE["a_token"]))
    assert any(e["id"] == eid for e in r2.json())


# ============ Dashboards ============
def test_parent_dashboard():
    r = SESSION.get(f"{API}/dashboard/parent", headers=_auth(STATE["a_token"]))
    assert r.status_code == 200
    j = r.json()
    assert "students" in j and "pending_review" in j
    assert any(s["id"] == STATE["student_a_id"] for s in j["students"])


def test_child_dashboard():
    r = SESSION.get(f"{API}/dashboard/child", headers=_auth(STATE["child_a_token"]))
    assert r.status_code == 200
    j = r.json()
    assert "today" in j and "feedback" in j


# ============ Audit ============
def test_audit():
    r = SESSION.get(f"{API}/audit", headers=_auth(STATE["a_token"]))
    assert r.status_code == 200
    j = r.json()
    assert "issues" in j and "coverage" in j
    assert isinstance(j["issues"], list)
