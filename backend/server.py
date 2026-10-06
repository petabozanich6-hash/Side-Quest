"""Side Quest Learning - K-12 Homeschool Platform Backend."""
import os
import uuid
import json
import logging
from pathlib import Path
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict, Any

import jwt
import bcrypt
import requests
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header, UploadFile, File, Form, Query
from fastapi.responses import Response, StreamingResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field, EmailStr
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

logger = logging.getLogger("sidequest")
logging.basicConfig(level=logging.INFO)

# ===== Config =====
MONGO_URL = os.environ['MONGO_URL']
DB_NAME = os.environ['DB_NAME']
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')
JWT_SECRET = os.environ.get('JWT_SECRET', 'side-quest-dev-secret-change-me')
JWT_ALG = "HS256"
JWT_DAYS = 30
APP_NAME = "sidequest"
OWNER_EMAIL = "petabozanich6@gmail.com"

STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

app = FastAPI(title="Side Quest Learning API")
api = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

# ===== Object Storage =====
storage_key: Optional[str] = None

def init_storage(force: bool = False):
    global storage_key
    if storage_key and not force:
        return storage_key
    if not EMERGENT_LLM_KEY:
        return None
    try:
        resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_LLM_KEY}, timeout=30)
        resp.raise_for_status()
        storage_key = resp.json()["storage_key"]
        logger.info("Storage initialized")
        return storage_key
    except Exception as e:
        logger.error(f"Storage init failed: {e}")
        return None

def put_object(path: str, data: bytes, content_type: str):
    key = init_storage()
    if not key:
        raise HTTPException(500, "Storage unavailable")
    resp = requests.put(f"{STORAGE_URL}/objects/{path}",
                        headers={"X-Storage-Key": key, "Content-Type": content_type},
                        data=data, timeout=120)
    if resp.status_code == 404:
        init_storage(force=True)
        resp = requests.put(f"{STORAGE_URL}/objects/{path}",
                            headers={"X-Storage-Key": storage_key, "Content-Type": content_type},
                            data=data, timeout=120)
    resp.raise_for_status()
    return resp.json()

def get_object(path: str):
    key = init_storage()
    if not key:
        raise HTTPException(500, "Storage unavailable")
    resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=60)
    if resp.status_code == 404:
        raise HTTPException(404, "File not found")
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")

# ===== Auth helpers =====
def hash_pw(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()

def verify_pw(pw: str, h: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode(), h.encode())
    except Exception:
        return False

def make_token(data: dict) -> str:
    payload = {**data, "exp": datetime.now(timezone.utc) + timedelta(days=JWT_DAYS)}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)

async def current_user(creds: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    if not creds:
        raise HTTPException(401, "Not authenticated")
    try:
        payload = jwt.decode(creds.credentials, JWT_SECRET, algorithms=[JWT_ALG])
    except Exception:
        raise HTTPException(401, "Invalid token")
    uid = payload.get("sub")
    role = payload.get("role")
    user = None
    if role == "parent":
        user = await db.users.find_one({"id": uid}, {"_id": 0, "password": 0})
    elif role == "child":
        user = await db.students.find_one({"id": uid}, {"_id": 0, "pin": 0})
    if not user:
        raise HTTPException(401, "User not found")
    user["role"] = role
    return user

def require_parent(user=Depends(current_user)):
    if user.get("role") != "parent":
        raise HTTPException(403, "Parent access required")
    return user

def require_child(user=Depends(current_user)):
    if user.get("role") != "child":
        raise HTTPException(403, "Child access required")
    return user

def now_iso():
    return datetime.now(timezone.utc).isoformat()

def new_id():
    return str(uuid.uuid4())

# ===== Models =====
class RegisterIn(BaseModel):
    email: EmailStr
    password: str
    name: str
    family_name: Optional[str] = None

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class ChildLoginIn(BaseModel):
    username: str
    pin: str

class StudentIn(BaseModel):
    name: str
    username: str
    pin: str
    birth_year: Optional[int] = None
    stage: str  # ES1, S1, S2, S3, S4, S5, S6
    year_level: Optional[str] = None
    theme: Optional[str] = None  # early, primary, secondary, senior
    subject_levels: Optional[Dict[str, str]] = None
    interests: Optional[List[str]] = None
    notes: Optional[str] = None

class ProgramIn(BaseModel):
    student_id: str
    title: str
    framework: str = "NSW"
    stage: str
    year_level: Optional[str] = None
    learning_areas: List[str] = []
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    notes: Optional[str] = None

class UnitIn(BaseModel):
    program_id: str
    title: str
    big_question: Optional[str] = None
    essential_understanding: Optional[str] = None
    subjects: List[str] = []
    duration_weeks: int = 4
    outcomes: List[str] = []
    description: Optional[str] = None

class LessonIn(BaseModel):
    unit_id: Optional[str] = None
    program_id: Optional[str] = None
    title: str
    stage: str
    year_level: Optional[str] = None
    learning_area: str
    subject: Optional[str] = None
    outcome_codes: List[str] = []
    learning_intention: str
    success_criteria: List[str] = []
    duration_minutes: int = 45
    materials: List[str] = []
    key_vocabulary: List[str] = []
    prior_knowledge: Optional[str] = None
    explicit_teaching: str
    worked_example: Optional[str] = None
    guided_practice: Optional[str] = None
    independent_task: str
    response_prompt: Optional[str] = None
    evidence_requirement: Optional[str] = None
    self_check: Optional[str] = None
    reflection_prompt: Optional[str] = None
    printable_version: Optional[str] = None
    offline_alternative: Optional[str] = None
    accessibility_notes: Optional[str] = None
    external_resources: List[str] = []
    source_note: Optional[str] = None
    status: str = "draft"  # draft, needs_review, approved

class AssignmentIn(BaseModel):
    student_id: str
    lesson_id: str
    due_date: Optional[str] = None
    scheduled_date: Optional[str] = None
    support_level: str = "green"  # green, yellow, red
    parent_notes: Optional[str] = None

class SubmissionIn(BaseModel):
    assignment_id: str
    response_text: Optional[str] = None
    reflection: Optional[str] = None
    file_ids: List[str] = []
    needs_help: bool = False

class FeedbackIn(BaseModel):
    submission_id: str
    feedback_text: str
    status: str  # accepted, needs_revision, demonstrated, needs_more_practice
    next_step: Optional[str] = None
    outcome_mappings: Optional[List[Dict[str, Any]]] = None

class ResourceIn(BaseModel):
    title: str
    url: str
    provider: Optional[str] = None
    resource_type: str = "link"
    learning_area: Optional[str] = None
    stage: Optional[str] = None
    purpose: Optional[str] = None
    licence: str = "unknown"  # cc_by, cc_by_sa, public_domain, link_only, government, unknown
    attribution: Optional[str] = None
    response_task: Optional[str] = None
    offline_alternative: Optional[str] = None
    age_suitability: Optional[str] = None

class CalendarEventIn(BaseModel):
    student_id: Optional[str] = None
    title: str
    date: str
    start_time: Optional[str] = None
    duration_minutes: Optional[int] = None
    event_type: str = "lesson"
    linked_lesson_id: Optional[str] = None
    linked_assignment_id: Optional[str] = None
    notes: Optional[str] = None

class AILessonRequest(BaseModel):
    stage: str
    year_level: Optional[str] = None
    learning_area: str
    subject: Optional[str] = None
    topic: str
    duration_minutes: int = 45
    learner_notes: Optional[str] = None
    support_level: str = "green"
    is_side_quest: bool = False
    theme: Optional[str] = None

class AIAnalyseRequest(BaseModel):
    submission_id: str

# ===== Family data isolation helper =====
async def get_family_id(user):
    if user.get("role") == "parent":
        return user.get("family_id")
    elif user.get("role") == "child":
        return user.get("family_id")
    raise HTTPException(403, "No family")

def strip_mongo(doc):
    if doc and "_id" in doc:
        doc.pop("_id", None)
    return doc

# ===== Curriculum Data (NSW) =====
NSW_STAGES = [
    {"code": "ES1", "name": "Early Stage 1", "years": "Kindergarten", "band": "primary"},
    {"code": "S1", "name": "Stage 1", "years": "Years 1-2", "band": "primary"},
    {"code": "S2", "name": "Stage 2", "years": "Years 3-4", "band": "primary"},
    {"code": "S3", "name": "Stage 3", "years": "Years 5-6", "band": "primary"},
    {"code": "S4", "name": "Stage 4", "years": "Years 7-8", "band": "secondary"},
    {"code": "S5", "name": "Stage 5", "years": "Years 9-10", "band": "secondary"},
    {"code": "S6", "name": "Stage 6", "years": "Years 11-12", "band": "senior"},
]

NSW_LEARNING_AREAS = {
    "primary": ["English", "Mathematics", "Science and Technology", "HSIE", "PDHPE", "Creative Arts", "Languages"],
    "secondary": ["English", "Mathematics", "Science", "HSIE", "PDHPE", "Creative Arts", "Languages", "TAS"],
    "senior": ["English", "Mathematics", "Science", "HSIE", "PDHPE", "Creative Arts", "Languages", "TAS", "VET"],
}

# Sample curriculum outcomes - these are plain-language representations, parent must verify against NESA
NSW_OUTCOMES_SEED = [
    {"code": "ENe-RECOM-01", "stage": "ES1", "learning_area": "English", "description": "Comprehends independently read texts using background knowledge, word knowledge and understanding of how language works", "source": "NSW English K-10 Syllabus (NESA 2022)"},
    {"code": "MAe-RWN-01", "stage": "ES1", "learning_area": "Mathematics", "description": "Reads numerals and represents whole numbers to at least 20", "source": "NSW Mathematics K-10 Syllabus (NESA 2022)"},
    {"code": "EN2-RECOM-01", "stage": "S2", "learning_area": "English", "description": "Reads and comprehends texts for wide purposes using knowledge of text structures and language, and by monitoring comprehension", "source": "NSW English K-10 Syllabus (NESA 2022)"},
    {"code": "MA2-RWN-01", "stage": "S2", "learning_area": "Mathematics", "description": "Applies an understanding of place value and the role of zero to represent numbers to at least tens of thousands", "source": "NSW Mathematics K-10 Syllabus (NESA 2022)"},
    {"code": "ST2-1WS-S", "stage": "S2", "learning_area": "Science and Technology", "description": "Questions, plans and conducts scientific investigations, collects and summarises data and communicates using scientific representations, text and language", "source": "NSW Science and Technology K-6 Syllabus"},
    {"code": "GE2-1", "stage": "S2", "learning_area": "HSIE", "description": "Examines features and characteristics of places and environments", "source": "NSW Geography K-10 Syllabus"},
    {"code": "EN4-RVL-01", "stage": "S4", "learning_area": "English", "description": "Uses a range of personal, creative and critical strategies to interpret complex texts", "source": "NSW English 7-10 Syllabus (NESA 2022)"},
    {"code": "MA4-ARI-C-01", "stage": "S4", "learning_area": "Mathematics", "description": "Applies arithmetic operations to positive and negative integers to solve problems", "source": "NSW Mathematics 7-10 Syllabus (NESA 2022)"},
    {"code": "SC4-WS-01", "stage": "S4", "learning_area": "Science", "description": "Identifies questions and problems that can be tested or researched and makes predictions based on scientific knowledge", "source": "NSW Science 7-10 Syllabus"},
    {"code": "HT4-1", "stage": "S4", "learning_area": "HSIE", "description": "Describes the nature of history and archaeology and explains their contribution to an understanding of the past", "source": "NSW History 7-10 Syllabus"},
    {"code": "EN11-1", "stage": "S6", "learning_area": "English", "description": "Responds to and composes increasingly complex texts for understanding, interpretation, analysis, imaginative expression and pleasure", "source": "NSW English Standard Stage 6 Syllabus"},
    {"code": "MA11-1", "stage": "S6", "learning_area": "Mathematics", "description": "Uses algebraic and graphical techniques to solve, and where appropriate, compare alternative solutions to problems", "source": "NSW Mathematics Advanced Stage 6 Syllabus"},
    {"code": "CH11-1", "stage": "S6", "learning_area": "Science", "description": "Develops and evaluates questions and hypotheses for scientific investigation", "source": "NSW Chemistry Stage 6 Syllabus"},
]

# ===== Routes =====
@api.get("/")
async def root():
    return {"name": "Side Quest Learning API", "version": "1.0.0"}

@api.get("/curriculum/stages")
async def get_stages():
    return NSW_STAGES

@api.get("/curriculum/learning-areas")
async def get_learning_areas(band: str = "primary"):
    return NSW_LEARNING_AREAS.get(band, NSW_LEARNING_AREAS["primary"])

@api.get("/curriculum/outcomes")
async def get_outcomes(stage: Optional[str] = None, learning_area: Optional[str] = None):
    q = {}
    if stage: q["stage"] = stage
    if learning_area: q["learning_area"] = learning_area
    docs = await db.outcomes.find(q, {"_id": 0}).to_list(500)
    return docs

# ----- Auth -----
@api.post("/auth/register")
async def register(data: RegisterIn):
    existing = await db.users.find_one({"email": data.email.lower()})
    if existing:
        raise HTTPException(400, "Email already registered")
    family_id = new_id()
    user_id = new_id()
    family = {
        "id": family_id,
        "name": data.family_name or f"{data.name}'s Family",
        "owner_id": user_id,
        "created_at": now_iso(),
    }
    user = {
        "id": user_id,
        "email": data.email.lower(),
        "password": hash_pw(data.password),
        "name": data.name,
        "family_id": family_id,
        "is_owner": True,
        "created_at": now_iso(),
    }
    await db.families.insert_one(family)
    await db.users.insert_one(user)
    token = make_token({"sub": user_id, "role": "parent", "family_id": family_id})
    user.pop("password", None); user.pop("_id", None)
    return {"token": token, "user": user, "family": strip_mongo(family)}

@api.post("/auth/login")
async def login(data: LoginIn):
    user = await db.users.find_one({"email": data.email.lower()})
    if not user or not verify_pw(data.password, user["password"]):
        raise HTTPException(401, "Invalid credentials")
    token = make_token({"sub": user["id"], "role": "parent", "family_id": user["family_id"]})
    user.pop("password", None); user.pop("_id", None)
    return {"token": token, "user": user}

@api.post("/auth/child-login")
async def child_login(data: ChildLoginIn):
    student = await db.students.find_one({"username": data.username.lower()})
    if not student or not verify_pw(data.pin, student["pin"]):
        raise HTTPException(401, "Invalid username or PIN")
    token = make_token({"sub": student["id"], "role": "child", "family_id": student["family_id"]})
    student.pop("pin", None); student.pop("_id", None)
    return {"token": token, "student": student}

@api.get("/auth/me")
async def me(user=Depends(current_user)):
    return user

# ----- Students -----
@api.get("/students")
async def list_students(user=Depends(require_parent)):
    docs = await db.students.find({"family_id": user["family_id"]}, {"_id": 0, "pin": 0}).to_list(100)
    return docs

@api.post("/students")
async def create_student(data: StudentIn, user=Depends(require_parent)):
    exists = await db.students.find_one({"username": data.username.lower()})
    if exists:
        raise HTTPException(400, "Username already taken")
    stage_obj = next((s for s in NSW_STAGES if s["code"] == data.stage), None)
    theme = data.theme or ("early" if data.stage == "ES1" else "primary" if data.stage in ["S1", "S2", "S3"] else "secondary" if data.stage in ["S4", "S5"] else "senior")
    student = {
        "id": new_id(),
        "family_id": user["family_id"],
        "name": data.name,
        "username": data.username.lower(),
        "pin": hash_pw(data.pin),
        "birth_year": data.birth_year,
        "stage": data.stage,
        "stage_name": stage_obj["name"] if stage_obj else data.stage,
        "year_level": data.year_level,
        "band": stage_obj["band"] if stage_obj else "primary",
        "theme": theme,
        "subject_levels": data.subject_levels or {},
        "interests": data.interests or [],
        "notes": data.notes,
        "created_at": now_iso(),
    }
    await db.students.insert_one(student)
    student.pop("pin", None); student.pop("_id", None)
    return student

@api.get("/students/{sid}")
async def get_student(sid: str, user=Depends(current_user)):
    s = await db.students.find_one({"id": sid, "family_id": user["family_id"]}, {"_id": 0, "pin": 0})
    if not s: raise HTTPException(404)
    return s

@api.put("/students/{sid}")
async def update_student(sid: str, data: StudentIn, user=Depends(require_parent)):
    update = data.model_dump(exclude_unset=True)
    if "pin" in update and update["pin"]:
        update["pin"] = hash_pw(update["pin"])
    else:
        update.pop("pin", None)
    if "username" in update:
        update["username"] = update["username"].lower()
    await db.students.update_one({"id": sid, "family_id": user["family_id"]}, {"$set": update})
    s = await db.students.find_one({"id": sid}, {"_id": 0, "pin": 0})
    return s

@api.delete("/students/{sid}")
async def delete_student(sid: str, user=Depends(require_parent)):
    await db.students.delete_one({"id": sid, "family_id": user["family_id"]})
    return {"ok": True}

# ----- Programs -----
@api.get("/programs")
async def list_programs(student_id: Optional[str] = None, user=Depends(require_parent)):
    q = {"family_id": user["family_id"]}
    if student_id: q["student_id"] = student_id
    return await db.programs.find(q, {"_id": 0}).to_list(200)

@api.post("/programs")
async def create_program(data: ProgramIn, user=Depends(require_parent)):
    p = {**data.model_dump(), "id": new_id(), "family_id": user["family_id"], "created_at": now_iso()}
    await db.programs.insert_one(p)
    return strip_mongo(p)

@api.get("/programs/{pid}")
async def get_program(pid: str, user=Depends(require_parent)):
    p = await db.programs.find_one({"id": pid, "family_id": user["family_id"]}, {"_id": 0})
    if not p: raise HTTPException(404)
    return p

# ----- Units -----
@api.get("/units")
async def list_units(program_id: Optional[str] = None, user=Depends(require_parent)):
    q = {"family_id": user["family_id"]}
    if program_id: q["program_id"] = program_id
    return await db.units.find(q, {"_id": 0}).to_list(200)

@api.post("/units")
async def create_unit(data: UnitIn, user=Depends(require_parent)):
    u = {**data.model_dump(), "id": new_id(), "family_id": user["family_id"], "created_at": now_iso()}
    await db.units.insert_one(u)
    return strip_mongo(u)

# ----- Lessons -----
@api.get("/lessons")
async def list_lessons(unit_id: Optional[str] = None, stage: Optional[str] = None, user=Depends(require_parent)):
    q = {"family_id": user["family_id"]}
    if unit_id: q["unit_id"] = unit_id
    if stage: q["stage"] = stage
    return await db.lessons.find(q, {"_id": 0}).sort("created_at", -1).to_list(500)

@api.post("/lessons")
async def create_lesson(data: LessonIn, user=Depends(require_parent)):
    lesson = {**data.model_dump(), "id": new_id(), "family_id": user["family_id"], "created_at": now_iso()}
    await db.lessons.insert_one(lesson)
    return strip_mongo(lesson)

@api.get("/lessons/{lid}")
async def get_lesson(lid: str, user=Depends(current_user)):
    l = await db.lessons.find_one({"id": lid, "family_id": user["family_id"]}, {"_id": 0})
    if not l: raise HTTPException(404)
    return l

@api.put("/lessons/{lid}")
async def update_lesson(lid: str, data: dict, user=Depends(require_parent)):
    await db.lessons.update_one({"id": lid, "family_id": user["family_id"]}, {"$set": data})
    return await db.lessons.find_one({"id": lid}, {"_id": 0})

@api.delete("/lessons/{lid}")
async def delete_lesson(lid: str, user=Depends(require_parent)):
    await db.lessons.delete_one({"id": lid, "family_id": user["family_id"]})
    return {"ok": True}

# ----- Assignments -----
@api.get("/assignments")
async def list_assignments(student_id: Optional[str] = None, status: Optional[str] = None, user=Depends(current_user)):
    q = {"family_id": user["family_id"]}
    if user.get("role") == "child":
        q["student_id"] = user["id"]
    elif student_id:
        q["student_id"] = student_id
    if status: q["status"] = status
    assignments = await db.assignments.find(q, {"_id": 0}).sort("created_at", -1).to_list(500)
    # Attach lesson info
    for a in assignments:
        lesson = await db.lessons.find_one({"id": a["lesson_id"]}, {"_id": 0})
        a["lesson"] = lesson
    return assignments

@api.post("/assignments")
async def create_assignment(data: AssignmentIn, user=Depends(require_parent)):
    a = {**data.model_dump(), "id": new_id(), "family_id": user["family_id"],
         "status": "not_started", "created_at": now_iso()}
    await db.assignments.insert_one(a)
    return strip_mongo(a)

@api.get("/assignments/{aid}")
async def get_assignment(aid: str, user=Depends(current_user)):
    q = {"id": aid, "family_id": user["family_id"]}
    if user.get("role") == "child":
        q["student_id"] = user["id"]
    a = await db.assignments.find_one(q, {"_id": 0})
    if not a: raise HTTPException(404)
    lesson = await db.lessons.find_one({"id": a["lesson_id"]}, {"_id": 0})
    a["lesson"] = lesson
    subs = await db.submissions.find({"assignment_id": aid}, {"_id": 0}).sort("submitted_at", -1).to_list(50)
    a["submissions"] = subs
    return a

@api.put("/assignments/{aid}/status")
async def update_assignment_status(aid: str, status: str = Query(...), user=Depends(current_user)):
    q = {"id": aid, "family_id": user["family_id"]}
    if user.get("role") == "child":
        q["student_id"] = user["id"]
        allowed = ["opened", "in_progress", "awaiting_help", "submitted"]
        if status not in allowed:
            raise HTTPException(403, "Child cannot set this status")
    await db.assignments.update_one(q, {"$set": {"status": status, "updated_at": now_iso()}})
    return {"ok": True}

# ----- Submissions -----
@api.post("/submissions")
async def submit_work(data: SubmissionIn, user=Depends(require_child)):
    a = await db.assignments.find_one({"id": data.assignment_id, "student_id": user["id"]})
    if not a: raise HTTPException(404, "Assignment not found")
    sub = {
        "id": new_id(),
        "family_id": user["family_id"],
        "assignment_id": data.assignment_id,
        "student_id": user["id"],
        "lesson_id": a["lesson_id"],
        "response_text": data.response_text,
        "reflection": data.reflection,
        "file_ids": data.file_ids,
        "needs_help": data.needs_help,
        "status": "awaiting_help" if data.needs_help else "submitted",
        "submitted_at": now_iso(),
    }
    await db.submissions.insert_one(sub)
    new_status = "awaiting_help" if data.needs_help else "submitted"
    await db.assignments.update_one({"id": data.assignment_id}, {"$set": {"status": new_status, "updated_at": now_iso()}})
    return strip_mongo(sub)

@api.get("/submissions")
async def list_submissions(student_id: Optional[str] = None, status: Optional[str] = None, user=Depends(current_user)):
    q = {"family_id": user["family_id"]}
    if user.get("role") == "child":
        q["student_id"] = user["id"]
    elif student_id:
        q["student_id"] = student_id
    if status: q["status"] = status
    subs = await db.submissions.find(q, {"_id": 0}).sort("submitted_at", -1).to_list(500)
    for s in subs:
        s["lesson"] = await db.lessons.find_one({"id": s["lesson_id"]}, {"_id": 0, "explicit_teaching": 0})
        s["student"] = await db.students.find_one({"id": s["student_id"]}, {"_id": 0, "pin": 0})
    return subs

@api.get("/submissions/{sid}")
async def get_submission(sid: str, user=Depends(current_user)):
    s = await db.submissions.find_one({"id": sid, "family_id": user["family_id"]}, {"_id": 0})
    if not s: raise HTTPException(404)
    s["lesson"] = await db.lessons.find_one({"id": s["lesson_id"]}, {"_id": 0})
    s["student"] = await db.students.find_one({"id": s["student_id"]}, {"_id": 0, "pin": 0})
    files = []
    for fid in s.get("file_ids", []):
        f = await db.files.find_one({"id": fid}, {"_id": 0})
        if f: files.append(f)
    s["files"] = files
    return s

@api.post("/submissions/{sid}/feedback")
async def give_feedback(sid: str, data: FeedbackIn, user=Depends(require_parent)):
    update = {
        "parent_feedback": data.feedback_text,
        "status": data.status,
        "next_step": data.next_step,
        "outcome_mappings": data.outcome_mappings or [],
        "reviewed_at": now_iso(),
        "reviewed_by": user["id"],
    }
    await db.submissions.update_one({"id": sid, "family_id": user["family_id"]}, {"$set": update})
    sub = await db.submissions.find_one({"id": sid})
    if sub:
        new_status_map = {"accepted": "accepted", "demonstrated": "demonstrated",
                          "needs_revision": "needs_revision", "needs_more_practice": "needs_more_practice"}
        await db.assignments.update_one({"id": sub["assignment_id"]},
                                        {"$set": {"status": new_status_map.get(data.status, "accepted")}})
    return {"ok": True}

# ----- Files -----
@api.post("/files/upload")
async def upload_file(file: UploadFile = File(...), context: Optional[str] = Form(None), user=Depends(current_user)):
    ext = file.filename.split(".")[-1].lower() if "." in file.filename else "bin"
    file_id = new_id()
    path = f"{APP_NAME}/families/{user['family_id']}/{file_id}.{ext}"
    data = await file.read()
    if len(data) > 50 * 1024 * 1024:
        raise HTTPException(413, "File too large (max 50MB)")
    content_type = file.content_type or "application/octet-stream"
    result = put_object(path, data, content_type)
    rec = {
        "id": file_id,
        "family_id": user["family_id"],
        "uploader_id": user["id"],
        "uploader_role": user["role"],
        "storage_path": result["path"],
        "original_filename": file.filename,
        "content_type": content_type,
        "size": result.get("size", len(data)),
        "context": context,
        "is_deleted": False,
        "created_at": now_iso(),
    }
    await db.files.insert_one(rec)
    return strip_mongo(rec)

@api.get("/files/{fid}")
async def download_file(fid: str, auth: Optional[str] = Query(None),
                       authorization: Optional[str] = Header(None)):
    # token flexibility for <img src>
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization[7:]
    elif auth:
        token = auth
    if not token:
        raise HTTPException(401, "No auth")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except Exception:
        raise HTTPException(401, "Invalid token")
    family_id = payload.get("family_id")
    rec = await db.files.find_one({"id": fid, "family_id": family_id, "is_deleted": False})
    if not rec: raise HTTPException(404)
    data, ct = get_object(rec["storage_path"])
    return Response(content=data, media_type=rec.get("content_type", ct))

# ----- Resources -----
@api.get("/resources")
async def list_resources(stage: Optional[str] = None, learning_area: Optional[str] = None, user=Depends(current_user)):
    q = {"$or": [{"family_id": user["family_id"]}, {"shared": True}]}
    if stage: q["stage"] = stage
    if learning_area: q["learning_area"] = learning_area
    if user.get("role") == "child":
        q["approved"] = True
    return await db.resources.find(q, {"_id": 0}).to_list(500)

@api.post("/resources")
async def create_resource(data: ResourceIn, user=Depends(require_parent)):
    r = {**data.model_dump(), "id": new_id(), "family_id": user["family_id"],
         "approved": False, "status": "needs_checking", "shared": False,
         "created_at": now_iso(), "last_checked": now_iso()}
    await db.resources.insert_one(r)
    return strip_mongo(r)

@api.put("/resources/{rid}/approve")
async def approve_resource(rid: str, user=Depends(require_parent)):
    await db.resources.update_one({"id": rid, "family_id": user["family_id"]},
                                   {"$set": {"approved": True, "status": "parent_approved"}})
    return {"ok": True}

# ----- Calendar -----
@api.get("/calendar")
async def list_events(student_id: Optional[str] = None, user=Depends(current_user)):
    q = {"family_id": user["family_id"]}
    if user.get("role") == "child":
        q["student_id"] = user["id"]
    elif student_id:
        q["student_id"] = student_id
    return await db.calendar_events.find(q, {"_id": 0}).sort("date", 1).to_list(1000)

@api.post("/calendar")
async def create_event(data: CalendarEventIn, user=Depends(require_parent)):
    e = {**data.model_dump(), "id": new_id(), "family_id": user["family_id"],
         "status": "scheduled", "created_at": now_iso()}
    await db.calendar_events.insert_one(e)
    return strip_mongo(e)

@api.put("/calendar/{eid}")
async def update_event(eid: str, data: dict, user=Depends(require_parent)):
    await db.calendar_events.update_one({"id": eid, "family_id": user["family_id"]}, {"$set": data})
    return await db.calendar_events.find_one({"id": eid}, {"_id": 0})

@api.delete("/calendar/{eid}")
async def delete_event(eid: str, user=Depends(require_parent)):
    await db.calendar_events.delete_one({"id": eid, "family_id": user["family_id"]})
    return {"ok": True}

# ----- AI Lesson Generator -----
def build_lesson_prompt(req: AILessonRequest) -> str:
    band = "primary" if req.stage in ["ES1", "S1", "S2", "S3"] else "secondary" if req.stage in ["S4", "S5"] else "senior"
    tone = {
        "primary": "friendly, clear, encouraging for a primary-age child",
        "secondary": "modern, focused, age-appropriate for secondary students; include research and source analysis as suitable",
        "senior": "mature, course-oriented, academically rigorous for senior-secondary students"
    }[band]
    side_quest_block = ""
    if req.is_side_quest and req.theme:
        side_quest_block = f"\nTHIS IS A SIDE QUEST themed around: '{req.theme}'. Use the theme as a context for genuine curriculum learning — do not make commercial consumption the goal."
    return f"""You are a NSW Australia homeschool curriculum lesson designer. Create ONE complete lesson in strict JSON. Tone: {tone}.

INPUT:
- Stage: {req.stage} ({req.year_level or ''})
- Learning Area: {req.learning_area}
- Subject: {req.subject or req.learning_area}
- Topic: {req.topic}
- Duration: {req.duration_minutes} minutes
- Learner notes: {req.learner_notes or 'none'}
- Support level: {req.support_level}
{side_quest_block}

Return ONLY valid JSON (no markdown, no commentary) with exact keys:
{{
  "title": "...",
  "learning_intention": "plain-language 'I am learning to...' statement",
  "success_criteria": ["I can...", "I can...", "I can..."],
  "duration_minutes": {req.duration_minutes},
  "materials": ["..."],
  "key_vocabulary": ["term: definition", "..."],
  "prior_knowledge": "What the student should already know",
  "explicit_teaching": "A clear teaching explanation (3-6 short paragraphs) that teaches the concept directly - do not just link to a video",
  "worked_example": "A specific step-by-step worked example appropriate for the stage",
  "guided_practice": "A guided practice task",
  "independent_task": "A specific independent task the student must do",
  "response_prompt": "What the student must write/record/produce",
  "evidence_requirement": "What evidence (typed answer, photo, audio, video, project artifact) proves learning",
  "self_check": "How the student checks their own work",
  "reflection_prompt": "A reflection question",
  "printable_version": "Instructions for completing on paper if no device available",
  "offline_alternative": "A no-device alternative pathway",
  "accessibility_notes": "Accessibility adaptations (audio support, visuals, etc)",
  "outcome_codes": ["Suggested NSW outcome codes - leave empty if uncertain"],
  "source_note": "Note that NSW outcome mappings are AI-suggested and must be verified by the parent against NESA sources"
}}

CRITICAL RULES:
- Do NOT invent NSW outcome codes if unsure - leave outcome_codes empty and note it
- Match complexity to Stage {req.stage}: do not use primary worksheet style for secondary/senior
- Include explicit teaching content, not just "watch a video"
- Provide a genuine offline alternative
"""

async def call_claude(prompt: str) -> str:
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"sq-{new_id()}",
        system_message="You are an expert NSW Australia K-12 curriculum designer. You return strict JSON only when asked. You never invent syllabus outcome codes."
    ).with_model("anthropic", "claude-sonnet-5-5")
    resp = await chat.send_message(UserMessage(text=prompt))
    return resp if isinstance(resp, str) else str(resp)

def extract_json(text: str) -> dict:
    text = text.strip()
    if text.startswith("```"):
        text = text.split("```", 2)[1]
        if text.startswith("json"):
            text = text[4:]
        text = text.strip("`\n ")
    # try direct parse
    try:
        return json.loads(text)
    except Exception:
        pass
    # try finding first { to last }
    start = text.find("{"); end = text.rfind("}")
    if start >= 0 and end > start:
        try:
            return json.loads(text[start:end+1])
        except Exception:
            pass
    return {}

@api.post("/ai/generate-lesson")
async def ai_generate_lesson(req: AILessonRequest, user=Depends(require_parent)):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(500, "AI not configured")
    prompt = build_lesson_prompt(req)
    try:
        raw = await call_claude(prompt)
    except Exception as e:
        logger.error(f"AI error: {e}")
        raise HTTPException(500, f"AI generation failed: {str(e)[:200]}")
    data = extract_json(raw)
    if not data or "title" not in data:
        raise HTTPException(500, "AI returned invalid lesson format")
    stage_obj = next((s for s in NSW_STAGES if s["code"] == req.stage), None)
    lesson = {
        "id": new_id(),
        "family_id": user["family_id"],
        "stage": req.stage,
        "year_level": req.year_level,
        "learning_area": req.learning_area,
        "subject": req.subject,
        "band": stage_obj["band"] if stage_obj else "primary",
        "status": "needs_review",
        "ai_generated": True,
        "is_side_quest": req.is_side_quest,
        "theme": req.theme,
        "created_at": now_iso(),
        **{k: data.get(k) for k in [
            "title", "learning_intention", "success_criteria", "duration_minutes",
            "materials", "key_vocabulary", "prior_knowledge", "explicit_teaching",
            "worked_example", "guided_practice", "independent_task", "response_prompt",
            "evidence_requirement", "self_check", "reflection_prompt",
            "printable_version", "offline_alternative", "accessibility_notes",
            "outcome_codes", "source_note"
        ]},
    }
    # Defaults
    for k, dv in [("success_criteria", []), ("materials", []), ("key_vocabulary", []),
                  ("outcome_codes", []), ("duration_minutes", req.duration_minutes)]:
        if lesson.get(k) is None: lesson[k] = dv
    await db.lessons.insert_one(lesson)
    return strip_mongo(lesson)

@api.post("/ai/analyse-submission")
async def ai_analyse_submission(req: AIAnalyseRequest, user=Depends(require_parent)):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(500, "AI not configured")
    sub = await db.submissions.find_one({"id": req.submission_id, "family_id": user["family_id"]}, {"_id": 0})
    if not sub: raise HTTPException(404)
    lesson = await db.lessons.find_one({"id": sub["lesson_id"]}, {"_id": 0})
    files = [await db.files.find_one({"id": fid}, {"_id": 0}) for fid in sub.get("file_ids", [])]
    file_summary = ", ".join([f["original_filename"] + f" ({f['content_type']})" for f in files if f]) or "none"
    prompt = f"""Analyse this student work submission and return STRICT JSON.

LESSON TITLE: {lesson.get('title') if lesson else 'Unknown'}
STAGE: {lesson.get('stage') if lesson else '?'}
LEARNING AREA: {lesson.get('learning_area') if lesson else '?'}
LEARNING INTENTION: {lesson.get('learning_intention') if lesson else ''}
SUCCESS CRITERIA: {lesson.get('success_criteria') if lesson else []}
EVIDENCE REQUIREMENT: {lesson.get('evidence_requirement') if lesson else ''}

STUDENT TYPED RESPONSE:
{sub.get('response_text') or '[none - evidence may be in files]'}

STUDENT REFLECTION:
{sub.get('reflection') or '[none]'}

UPLOADED FILES: {file_summary}

Return ONLY JSON with keys:
{{
  "summary": "1-2 sentence summary of what was submitted",
  "demonstrated": ["skills/knowledge that appear demonstrated"],
  "possible_outcomes": [{{"code": "code or empty", "description": "...", "confidence": "high|medium|low"}}],
  "misconceptions": ["any possible misconceptions - may be empty"],
  "suggested_feedback": "Draft constructive feedback for the parent to review and edit",
  "suggested_next_step": "One concrete next step",
  "additional_evidence_needed": "What additional evidence would strengthen the mapping, or 'none'",
  "overall_confidence": "high|medium|low|unable_to_determine",
  "parent_review_note": "Reminder that this is AI suggestion only"
}}

RULES:
- Never mark anything as 'demonstrated' definitively
- Do not infer sensitive characteristics
- Be concrete and specific
"""
    try:
        raw = await call_claude(prompt)
    except Exception as e:
        raise HTTPException(500, f"AI analysis failed: {str(e)[:200]}")
    data = extract_json(raw)
    if not data: raise HTTPException(500, "AI returned invalid format")
    analysis = {
        "id": new_id(),
        "submission_id": req.submission_id,
        "family_id": user["family_id"],
        "generated_at": now_iso(),
        **data,
    }
    await db.submission_analyses.insert_one(analysis)
    await db.submissions.update_one({"id": req.submission_id}, {"$set": {"ai_analysis_id": analysis["id"]}})
    return strip_mongo(analysis)

@api.get("/submissions/{sid}/analysis")
async def get_analysis(sid: str, user=Depends(require_parent)):
    a = await db.submission_analyses.find_one({"submission_id": sid, "family_id": user["family_id"]}, {"_id": 0}, sort=[("generated_at", -1)])
    if not a: raise HTTPException(404, "No analysis yet")
    return a

# ----- Dashboard -----
@api.get("/dashboard/parent")
async def parent_dashboard(user=Depends(require_parent)):
    family_id = user["family_id"]
    students = await db.students.find({"family_id": family_id}, {"_id": 0, "pin": 0}).to_list(50)
    out = {"students": [], "pending_review": 0, "awaiting_help": 0, "resources_pending": 0, "unapproved_resources": 0}
    pending = await db.submissions.count_documents({"family_id": family_id, "status": "submitted"})
    awaiting_help = await db.assignments.count_documents({"family_id": family_id, "status": "awaiting_help"})
    unapp = await db.resources.count_documents({"family_id": family_id, "approved": False})
    out.update({"pending_review": pending, "awaiting_help": awaiting_help, "unapproved_resources": unapp})
    for s in students:
        total_a = await db.assignments.count_documents({"family_id": family_id, "student_id": s["id"]})
        completed = await db.assignments.count_documents({"family_id": family_id, "student_id": s["id"], "status": {"$in": ["accepted", "demonstrated", "completed"]}})
        awaiting = await db.assignments.count_documents({"family_id": family_id, "student_id": s["id"], "status": "awaiting_help"})
        out["students"].append({**s, "total_assignments": total_a, "completed": completed, "awaiting_help": awaiting})
    return out

@api.get("/dashboard/child")
async def child_dashboard(user=Depends(require_child)):
    today_assignments = await db.assignments.find({"student_id": user["id"], "status": {"$in": ["not_started", "opened", "in_progress", "awaiting_help", "needs_revision"]}}, {"_id": 0}).sort("created_at", -1).to_list(50)
    for a in today_assignments:
        a["lesson"] = await db.lessons.find_one({"id": a["lesson_id"]}, {"_id": 0, "explicit_teaching": 0, "worked_example": 0})
    recent_feedback = await db.submissions.find({"student_id": user["id"], "parent_feedback": {"$exists": True}}, {"_id": 0}).sort("reviewed_at", -1).to_list(5)
    for f in recent_feedback:
        f["lesson"] = await db.lessons.find_one({"id": f["lesson_id"]}, {"_id": 0, "explicit_teaching": 0})
    return {"student": user, "today": today_assignments[:5], "all_pending": today_assignments, "feedback": recent_feedback}

# ----- Curriculum Audit -----
@api.get("/audit")
async def curriculum_audit(student_id: Optional[str] = None, user=Depends(require_parent)):
    q = {"family_id": user["family_id"]}
    if student_id: q["student_id"] = student_id
    assignments = await db.assignments.find(q, {"_id": 0}).to_list(2000)
    issues = []
    # lessons without outcome codes
    lessons = await db.lessons.find({"family_id": user["family_id"]}, {"_id": 0}).to_list(1000)
    for l in lessons:
        if not l.get("outcome_codes"):
            issues.append({"type": "lesson_no_outcome", "severity": "medium", "lesson_id": l["id"], "title": l["title"], "message": "Lesson has no linked curriculum outcome"})
        if not l.get("evidence_requirement"):
            issues.append({"type": "lesson_no_evidence", "severity": "medium", "lesson_id": l["id"], "title": l["title"], "message": "Lesson has no evidence requirement"})
        if not l.get("offline_alternative"):
            issues.append({"type": "lesson_no_offline", "severity": "low", "lesson_id": l["id"], "title": l["title"], "message": "Lesson has no offline alternative"})
    resources = await db.resources.find({"family_id": user["family_id"]}, {"_id": 0}).to_list(500)
    for r in resources:
        if not r.get("approved"):
            issues.append({"type": "resource_unapproved", "severity": "high", "resource_id": r["id"], "title": r["title"], "message": "Resource not parent-approved"})
        if r.get("licence") == "unknown":
            issues.append({"type": "resource_licence_unclear", "severity": "medium", "resource_id": r["id"], "title": r["title"], "message": "Licence unclear - treat as link-only"})
    # coverage by stage/learning area
    coverage = {}
    for a in assignments:
        l = next((x for x in lessons if x["id"] == a["lesson_id"]), None)
        if not l: continue
        key = f"{l.get('stage')}:{l.get('learning_area')}"
        coverage.setdefault(key, {"stage": l.get("stage"), "learning_area": l.get("learning_area"), "count": 0, "demonstrated": 0})
        coverage[key]["count"] += 1
        if a.get("status") == "demonstrated": coverage[key]["demonstrated"] += 1
    return {"issues": issues, "coverage": list(coverage.values()), "notice": "This audit identifies planning and evidence gaps. It does not determine registration eligibility or replace official advice."}

# ----- Seed curriculum + demo -----
@app.on_event("startup")
async def startup():
    init_storage()
    count = await db.outcomes.count_documents({})
    if count == 0:
        await db.outcomes.insert_many([{**o, "id": new_id()} for o in NSW_OUTCOMES_SEED])
        logger.info("Seeded NSW outcomes")
    # Owner account seed
    owner = await db.users.find_one({"email": OWNER_EMAIL})
    if not owner:
        family_id = new_id(); user_id = new_id()
        await db.families.insert_one({"id": family_id, "name": "Bozanich Family", "owner_id": user_id, "created_at": now_iso()})
        await db.users.insert_one({"id": user_id, "email": OWNER_EMAIL, "password": hash_pw("SideQuest2026!"),
                                   "name": "Peta", "family_id": family_id, "is_owner": True, "created_at": now_iso()})
        logger.info(f"Seeded owner account {OWNER_EMAIL}")

@app.on_event("shutdown")
async def shutdown():
    client.close()

app.include_router(api)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
