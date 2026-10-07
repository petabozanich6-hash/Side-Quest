"""Backend tests for the Word Hoard spelling word bank.

Run against a running server. Set OWNER_PW to the owner password, and
REACT_APP_BACKEND_URL if the server is not on localhost:8001.
"""
import os
import uuid

import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/") or "http://localhost:8001"
API = BASE_URL + "/api"
OWNER_EMAIL = "petabozanich6@gmail.com"
OWNER_PW = os.environ.get("OWNER_PW", "")

S = requests.Session()
S.headers.update({"Content-Type": "application/json"})
STATE = {}


def auth(token):
    return {"Authorization": f"Bearer {token}"}


def word_by_text(stage_map, text):
    for items in stage_map.values():
        for w in items:
            if w["word"] == text:
                return w
    return None


# ---------------- Setup ----------------
def test_setup_login_and_child():
    if not OWNER_PW:
        pytest.skip("OWNER_PW not set")
    r = S.post(f"{API}/auth/login", json={"email": OWNER_EMAIL, "password": OWNER_PW})
    assert r.status_code == 200, r.text
    STATE["t"] = r.json()["token"]

    user = f"hoard_{uuid.uuid4().hex[:6]}"
    r = S.post(f"{API}/students", json={
        "name": "Hoarder", "username": user, "pin": "1234", "stage": "S2"
    }, headers=auth(STATE["t"]))
    assert r.status_code == 200, r.text
    STATE["sid"] = r.json()["id"]

    r = S.post(f"{API}/auth/child-login", json={"username": user, "pin": "1234"})
    assert r.status_code == 200, r.text
    STATE["ct"] = r.json()["token"]


# ---------------- Adding words ----------------
def test_parent_adds_words_and_skips_duplicates():
    r = S.post(f"{API}/word-bank/words", json={
        "student_id": STATE["sid"], "words": ["because", "Because", "friend", "  "],
    }, headers=auth(STATE["t"]))
    assert r.status_code == 200, r.text
    j = r.json()
    assert sorted(w["word"] for w in j["added"]) == ["because", "friend"]
    assert "because" in j["skipped"]


def test_parent_must_name_a_child():
    r = S.post(f"{API}/word-bank/words", json={"words": ["quiet"]}, headers=auth(STATE["t"]))
    assert r.status_code == 400


def test_child_adds_own_word():
    r = S.post(f"{API}/word-bank/words", json={"words": ["necessary"]}, headers=auth(STATE["ct"]))
    assert r.status_code == 200, r.text
    assert r.json()["added"][0]["word"] == "necessary"


# ---------------- Child hoard ----------------
def test_child_sees_wild_words():
    r = S.get(f"{API}/word-bank", headers=auth(STATE["ct"]))
    assert r.status_code == 200, r.text
    j = r.json()
    assert j["summary"]["total"] == 3
    assert j["summary"]["counts"]["wild"] == 3
    assert len(j["to_tame_today"]) == 3
    STATE["wid"] = word_by_text(j["words"], "because")["id"]


def test_parent_cannot_use_child_hoard():
    r = S.get(f"{API}/word-bank", headers=auth(STATE["t"]))
    assert r.status_code in (401, 403)


# ---------------- Practice rules ----------------
def test_correct_moves_up_one_stage():
    r = S.post(f"{API}/word-bank/practice", json={"word_id": STATE["wid"], "correct": True},
               headers=auth(STATE["ct"]))
    assert r.status_code == 200, r.text
    j = r.json()
    assert j["moved"] is True
    assert j["new_stage"] == "spotted"
    assert j["xp_gained"] == 2


def test_second_correct_same_day_does_not_advance():
    r = S.post(f"{API}/word-bank/practice", json={"word_id": STATE["wid"], "correct": True},
               headers=auth(STATE["ct"]))
    assert r.status_code == 200, r.text
    j = r.json()
    assert j["moved"] is False
    assert j["new_stage"] == "spotted"
    assert j["xp_gained"] == 0


def test_miss_drops_back_a_stage():
    r = S.post(f"{API}/word-bank/practice", json={"word_id": STATE["wid"], "correct": False},
               headers=auth(STATE["ct"]))
    assert r.status_code == 200, r.text
    assert r.json()["new_stage"] == "wild"


def test_practice_unknown_word_is_404():
    r = S.post(f"{API}/word-bank/practice", json={"word_id": "nope", "correct": True},
               headers=auth(STATE["ct"]))
    assert r.status_code == 404


# ---------------- Parent report ----------------
def test_parent_report():
    r = S.get(f"{API}/word-bank/parent/{STATE['sid']}", headers=auth(STATE["t"]))
    assert r.status_code == 200, r.text
    j = r.json()
    assert j["student"]["id"] == STATE["sid"]
    assert j["summary"]["total"] == 3
    assert j["summary"]["streak"] >= 1
    assert j["summary"]["days_this_week"] == 1
    assert j["summary"]["accuracy_this_week"] is not None
    assert len(j["recent_practice"]) == 3


def test_child_cannot_read_parent_report():
    r = S.get(f"{API}/word-bank/parent/{STATE['sid']}", headers=auth(STATE["ct"]))
    assert r.status_code == 403


def test_parent_report_unknown_student_is_404():
    r = S.get(f"{API}/word-bank/parent/not-a-real-id", headers=auth(STATE["t"]))
    assert r.status_code == 404


# ---------------- Removing words ----------------
def test_child_cannot_delete_word():
    r = S.delete(f"{API}/word-bank/{STATE['wid']}", headers=auth(STATE["ct"]))
    assert r.status_code == 403


def test_parent_deletes_word():
    r = S.delete(f"{API}/word-bank/{STATE['wid']}", headers=auth(STATE["t"]))
    assert r.status_code == 200, r.text
    r = S.delete(f"{API}/word-bank/{STATE['wid']}", headers=auth(STATE["t"]))
    assert r.status_code == 404
