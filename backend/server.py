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
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header, UploadFile, File, Form, Query, Cookie, Request
from fastapi.responses import Response, StreamingResponse, JSONResponse
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

async def resolve_session_token(token: str):
    """Resolve an Emergent Google OAuth session_token cookie to a user."""
    sess = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if not sess:
        return None
    exp = sess.get("expires_at")
    if isinstance(exp, str):
        exp = datetime.fromisoformat(exp)
    if exp and exp.tzinfo is None:
        exp = exp.replace(tzinfo=timezone.utc)
    if exp and exp < datetime.now(timezone.utc):
        return None
    user = await db.users.find_one({"id": sess["user_id"]}, {"_id": 0, "password": 0})
    if not user:
        return None
    user["role"] = "parent"
    return user


async def current_user(
    creds: Optional[HTTPAuthorizationCredentials] = Depends(security),
    session_token: Optional[str] = Cookie(None),
):
    # 1. Try Google OAuth session cookie
    if session_token:
        user = await resolve_session_token(session_token)
        if user:
            return user
    # 2. Fall back to JWT bearer
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
    stage: str
    year_level: Optional[str] = None
    theme: Optional[str] = None
    subject_levels: Optional[Dict[str, str]] = None
    interests: Optional[List[str]] = None
    notes: Optional[str] = None
    electives: Optional[List[Dict[str, Any]]] = None  # [{code, name, learning_area, units}]

class CheerIn(BaseModel):
    student_id: str
    message: str
    emoji: Optional[str] = "✨"

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

class PetCreateIn(BaseModel):
    name: str
    species: str  # fox, owl, turtle, hedgehog, fawn, squirrel, rabbit, dragon

class PetHelpIn(BaseModel):
    lesson_id: Optional[str] = None
    situation: Optional[str] = None

class LifeEvidenceIn(BaseModel):
    student_id: str
    title: str
    description: str  # what the child did: "baked bread", "built a bird house", "walked the dog"
    date: Optional[str] = None
    duration_minutes: Optional[int] = None
    location: Optional[str] = None
    file_ids: List[str] = []
    parent_note: Optional[str] = None

class LifeAnalyseIn(BaseModel):
    evidence_id: str

class LifeFeedbackIn(BaseModel):
    outcome_mappings: List[Dict[str, Any]]
    status: str = "accepted"
    parent_note: Optional[str] = None

class LearningPlanIn(BaseModel):
    student_id: str
    title: str
    period_start: str  # ISO date
    period_end: str
    interests: List[str] = []
    subject_focus: List[str] = []  # learning areas to deepen
    teaching_approach: Optional[str] = None  # e.g. "project-based, nature-rich"
    notes: Optional[str] = None

class ChallengeAcceptIn(BaseModel):
    assignment_id: str
    challenge_id: str
    response_text: Optional[str] = None
    file_ids: List[str] = []

class ReadingLogIn(BaseModel):
    student_id: str
    title: str
    author: Optional[str] = None
    pages: Optional[int] = None
    pages_read: Optional[int] = None
    read_date: str  # ISO date
    duration_minutes: Optional[int] = None
    source: str = "home"  # home, library, school, audiobook, digital
    book_type: str = "fiction"  # fiction, nonfiction, picture, graphic, poetry, reference
    reading_mode: str = "independent"  # independent, with_adult, read_to, audio
    comprehension_notes: Optional[str] = None
    favourite_part: Optional[str] = None
    difficulty: Optional[str] = None  # just_right, challenging, easy
    parent_note: Optional[str] = None

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

# ===== Pet companion helpers (defined early so route handlers can call them) =====
PET_SPECIES = {
    "fox": {"label": "Fox", "voice": "clever, warm, curious"},
    "owl": {"label": "Owl", "voice": "wise, calm, patient"},
    "turtle": {"label": "Turtle", "voice": "slow and steady, encouraging"},
    "hedgehog": {"label": "Hedgehog", "voice": "gentle, careful, kind"},
    "fawn": {"label": "Fawn", "voice": "soft, hopeful, delicate"},
    "squirrel": {"label": "Squirrel", "voice": "energetic, playful, upbeat"},
    "rabbit": {"label": "Rabbit", "voice": "quick, cheerful, friendly"},
    "dragon": {"label": "Dragon", "voice": "brave, dramatic, warm-hearted"},
}

LEVEL_TIERS = [
    (0, "Egg", "egg"),
    (10, "Hatchling", "sprout"),
    (30, "Youngling", "leaf"),
    (80, "Companion", "tree"),
    (200, "Hero", "star"),
    (500, "Legend", "sparkle"),
]

def level_for_xp(xp: int):
    tier = LEVEL_TIERS[0]
    for t in LEVEL_TIERS:
        if xp >= t[0]:
            tier = t
    nxt = next((x for x in LEVEL_TIERS if x[0] > xp), None)
    return {"xp": xp, "level_name": tier[1], "level_icon": tier[2],
            "next_xp": nxt[0] if nxt else None, "next_level": nxt[1] if nxt else None}

async def award_xp(student_id: str, amount: int, reason: str):
    pet = await db.pets.find_one({"student_id": student_id})
    if not pet: return None
    new_xp = int(pet.get("xp", 0)) + amount
    new_happy = min(100, int(pet.get("happiness", 70)) + 5)
    await db.pets.update_one({"student_id": student_id},
        {"$set": {"xp": new_xp, "happiness": new_happy},
         "$push": {"activity": {"amount": amount, "reason": reason, "at": now_iso()}}})
    return new_xp

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
    # NSW outcome seed is maintained in /app/backend/nsw_outcomes.py
]
from nsw_outcomes import NSW_OUTCOMES_SEED as _NSW_OUTCOMES_SEED_FULL, SEED_VERSION
NSW_OUTCOMES_SEED = _NSW_OUTCOMES_SEED_FULL

async def ensure_pet(student_id: str, family_id: str):
    return await db.pets.find_one({"student_id": student_id}, {"_id": 0})

NSW_SOURCE_LINKS = {
    "ES1": {"name": "NSW Education Standards (K-6)", "url": "https://curriculum.nsw.edu.au/learning-areas/primary"},
    "S1": {"name": "NSW Education Standards (K-6)", "url": "https://curriculum.nsw.edu.au/learning-areas/primary"},
    "S2": {"name": "NSW Education Standards (K-6)", "url": "https://curriculum.nsw.edu.au/learning-areas/primary"},
    "S3": {"name": "NSW Education Standards (K-6)", "url": "https://curriculum.nsw.edu.au/learning-areas/primary"},
    "S4": {"name": "NSW Education Standards (7-10)", "url": "https://curriculum.nsw.edu.au/learning-areas/secondary"},
    "S5": {"name": "NSW Education Standards (7-10)", "url": "https://curriculum.nsw.edu.au/learning-areas/secondary"},
    "S6": {"name": "NSW Education Standards (11-12)", "url": "https://curriculum.nsw.edu.au/learning-areas/11-12"},
}

NSW_LA_LINKS = {
    "English": "https://curriculum.nsw.edu.au/learning-areas/english",
    "Mathematics": "https://curriculum.nsw.edu.au/learning-areas/mathematics",
    "Science and Technology": "https://curriculum.nsw.edu.au/learning-areas/science-and-technology",
    "Science": "https://curriculum.nsw.edu.au/learning-areas/science",
    "HSIE": "https://curriculum.nsw.edu.au/learning-areas/hsie",
    "PDHPE": "https://curriculum.nsw.edu.au/learning-areas/pdhpe",
    "Creative Arts": "https://curriculum.nsw.edu.au/learning-areas/creative-arts",
    "Languages": "https://curriculum.nsw.edu.au/learning-areas/languages",
    "TAS": "https://curriculum.nsw.edu.au/learning-areas/tas",
    "VET": "https://educationstandards.nsw.edu.au/wps/portal/nesa/11-12/stage-6-learning-areas/vet",
}

# NSW compulsory/elective structure for secondary
NSW_SECONDARY_PATTERN = {
    "S4": {
        "band_name": "Years 7-8",
        "compulsory": [
            {"code": "ENG-S4", "name": "English", "learning_area": "English", "units": 1},
            {"code": "MAT-S4", "name": "Mathematics", "learning_area": "Mathematics", "units": 1},
            {"code": "SCI-S4", "name": "Science", "learning_area": "Science", "units": 1},
            {"code": "HSIE-S4", "name": "Human Society and its Environment (History + Geography)", "learning_area": "HSIE", "units": 1},
            {"code": "PDHPE-S4", "name": "PDHPE", "learning_area": "PDHPE", "units": 1},
            {"code": "CA-S4", "name": "Creative Arts (Visual Arts + Music)", "learning_area": "Creative Arts", "units": 1},
            {"code": "TM-S4", "name": "Technology Mandatory", "learning_area": "TAS", "units": 1},
            {"code": "LANG-S4", "name": "Languages (100 hours over Years 7-8)", "learning_area": "Languages", "units": 1},
        ],
        "electives": [],
    },
    "S5": {
        "band_name": "Years 9-10",
        "compulsory": [
            {"code": "ENG-S5", "name": "English", "learning_area": "English", "units": 1},
            {"code": "MAT-S5", "name": "Mathematics", "learning_area": "Mathematics", "units": 1},
            {"code": "SCI-S5", "name": "Science", "learning_area": "Science", "units": 1},
            {"code": "AUS-HIST", "name": "Australian History", "learning_area": "HSIE", "units": 1},
            {"code": "AUS-GEO", "name": "Australian Geography", "learning_area": "HSIE", "units": 1},
            {"code": "PDHPE-S5", "name": "PDHPE", "learning_area": "PDHPE", "units": 1},
        ],
        "electives": [
            {"code": "COMM", "name": "Commerce", "learning_area": "HSIE"},
            {"code": "DRAMA", "name": "Drama", "learning_area": "Creative Arts"},
            {"code": "MUSIC", "name": "Music", "learning_area": "Creative Arts"},
            {"code": "VA-E", "name": "Visual Arts", "learning_area": "Creative Arts"},
            {"code": "DT", "name": "Design and Technology", "learning_area": "TAS"},
            {"code": "FT", "name": "Food Technology", "learning_area": "TAS"},
            {"code": "IST", "name": "Information and Software Technology", "learning_area": "TAS"},
            {"code": "AGR", "name": "Agricultural Technology", "learning_area": "TAS"},
            {"code": "GRAPHIC", "name": "Graphics Technology", "learning_area": "TAS"},
            {"code": "LOTE", "name": "Language (continuer)", "learning_area": "Languages"},
            {"code": "PASS", "name": "Physical Activity and Sports Studies", "learning_area": "PDHPE"},
            {"code": "WORK", "name": "Work Education", "learning_area": "TAS"},
        ],
    },
    "S6": {
        "band_name": "Years 11-12 (HSC)",
        "compulsory": [
            {"code": "ENG-S6", "name": "English (any English course required)", "learning_area": "English", "units": 2},
        ],
        "electives": [
            {"code": "ENG-STD", "name": "English Standard", "learning_area": "English", "units": 2},
            {"code": "ENG-ADV", "name": "English Advanced", "learning_area": "English", "units": 2},
            {"code": "ENG-EXT1", "name": "English Extension 1", "learning_area": "English", "units": 1},
            {"code": "ENG-EXT2", "name": "English Extension 2", "learning_area": "English", "units": 1},
            {"code": "MA-STD1", "name": "Mathematics Standard 1", "learning_area": "Mathematics", "units": 2},
            {"code": "MA-STD2", "name": "Mathematics Standard 2", "learning_area": "Mathematics", "units": 2},
            {"code": "MA-ADV", "name": "Mathematics Advanced", "learning_area": "Mathematics", "units": 2},
            {"code": "MA-EXT1", "name": "Mathematics Extension 1", "learning_area": "Mathematics", "units": 1},
            {"code": "MA-EXT2", "name": "Mathematics Extension 2", "learning_area": "Mathematics", "units": 1},
            {"code": "BIO", "name": "Biology", "learning_area": "Science", "units": 2},
            {"code": "CHEM", "name": "Chemistry", "learning_area": "Science", "units": 2},
            {"code": "PHY", "name": "Physics", "learning_area": "Science", "units": 2},
            {"code": "ES", "name": "Earth and Environmental Science", "learning_area": "Science", "units": 2},
            {"code": "IPT", "name": "Information Processes and Technology", "learning_area": "TAS", "units": 2},
            {"code": "SDD", "name": "Software Design and Development", "learning_area": "TAS", "units": 2},
            {"code": "MH", "name": "Modern History", "learning_area": "HSIE", "units": 2},
            {"code": "AH", "name": "Ancient History", "learning_area": "HSIE", "units": 2},
            {"code": "GEO", "name": "Geography", "learning_area": "HSIE", "units": 2},
            {"code": "ECO", "name": "Economics", "learning_area": "HSIE", "units": 2},
            {"code": "BS", "name": "Business Studies", "learning_area": "HSIE", "units": 2},
            {"code": "LS", "name": "Legal Studies", "learning_area": "HSIE", "units": 2},
            {"code": "SOR1", "name": "Studies of Religion I", "learning_area": "HSIE", "units": 1},
            {"code": "SOR2", "name": "Studies of Religion II", "learning_area": "HSIE", "units": 2},
            {"code": "PDHPE-S6", "name": "PDHPE", "learning_area": "PDHPE", "units": 2},
            {"code": "VA-S6", "name": "Visual Arts", "learning_area": "Creative Arts", "units": 2},
            {"code": "MUSIC1", "name": "Music 1", "learning_area": "Creative Arts", "units": 2},
            {"code": "MUSIC2", "name": "Music 2", "learning_area": "Creative Arts", "units": 2},
            {"code": "DRAMA-S6", "name": "Drama", "learning_area": "Creative Arts", "units": 2},
            {"code": "DT-S6", "name": "Design and Technology", "learning_area": "TAS", "units": 2},
            {"code": "ENT", "name": "Engineering Studies", "learning_area": "TAS", "units": 2},
            {"code": "FT-S6", "name": "Food Technology", "learning_area": "TAS", "units": 2},
            {"code": "AGR-S6", "name": "Agriculture", "learning_area": "TAS", "units": 2},
            {"code": "LANG-S6", "name": "Modern/Classical Language", "learning_area": "Languages", "units": 2},
        ],
        "note": "HSC pattern of study: minimum 12 units in Preliminary (Year 11), minimum 10 units in HSC (Year 12). Must include English and at least 6 units from Board Developed Courses in HSC."
    }
}

# ===== Routes =====
@api.get("/")
async def root():
    return {"name": "Side Quest Learning API", "version": "1.0.0"}

@api.get("/pet/species")
async def pet_species():
    return [{"id": k, **v} for k, v in PET_SPECIES.items()]

@api.get("/pet")
async def get_my_pet(user=Depends(require_child)):
    pet = await ensure_pet(user["id"], user["family_id"])
    if not pet:
        return {"needs_pet": True}
    pet.pop("_id", None)
    pet.update(level_for_xp(pet.get("xp", 0)))
    return pet

@api.post("/pet")
async def create_pet(data: PetCreateIn, user=Depends(require_child)):
    if data.species not in PET_SPECIES:
        raise HTTPException(400, "Unknown species")
    existing = await db.pets.find_one({"student_id": user["id"]})
    if existing:
        raise HTTPException(400, "Pet already exists")
    pet = {
        "id": new_id(),
        "student_id": user["id"],
        "family_id": user["family_id"],
        "name": data.name.strip()[:30] or PET_SPECIES[data.species]["label"],
        "species": data.species,
        "xp": 0,
        "happiness": 80,
        "created_at": now_iso(),
        "last_fed": now_iso(),
        "activity": [],
    }
    await db.pets.insert_one(pet)
    pet.pop("_id", None)
    pet.update(level_for_xp(0))
    return pet

@api.post("/pet/feed")
async def feed_pet(user=Depends(require_child)):
    pet = await db.pets.find_one({"student_id": user["id"]})
    if not pet: raise HTTPException(404, "No pet yet")
    new_happy = min(100, int(pet.get("happiness", 70)) + 10)
    await db.pets.update_one({"student_id": user["id"]},
        {"$set": {"happiness": new_happy, "last_fed": now_iso()}})
    return {"happiness": new_happy}

@api.post("/pet/help")
async def pet_help_route(data: PetHelpIn, user=Depends(require_child)):
    """AI-powered contextual help message in pet's voice."""
    pet = await db.pets.find_one({"student_id": user["id"]})
    if not pet: raise HTTPException(404, "No pet yet")
    lesson = None
    if data.lesson_id:
        lesson = await db.lessons.find_one({"id": data.lesson_id, "family_id": user["family_id"]}, {"_id": 0})
    species = PET_SPECIES.get(pet["species"], {"voice": "warm and encouraging"})
    student_name = user.get("name", "friend")
    stage = user.get("stage", "primary")
    age_tone = "very short, simple words, warm" if stage in ("ES1","S1","S2") else "friendly, clear" if stage in ("S3","S4") else "mature, respectful"

    prompt = f"""You are {pet['name']}, a {pet['species']} pet companion for a homeschool student.
Voice: {species['voice']}. Tone: {age_tone}.

The student {student_name} says they're stuck on this lesson:
Title: {lesson.get('title') if lesson else 'their current task'}
Learning intention: {lesson.get('learning_intention','') if lesson else ''}
Success criteria: {lesson.get('success_criteria',[]) if lesson else []}
Key vocabulary: {lesson.get('key_vocabulary',[]) if lesson else []}

What they said: "{data.situation or '(nothing yet)'}"

Reply as the pet in FIRST PERSON. Give 3 short, kind, concrete nudges to help them move forward. Do NOT give the answer. Encourage them to try the first step, re-read the key words, look at the example, or ask a grown-up when ready. Keep it under 90 words. End with a cheer. No markdown, no lists, just a warm paragraph."""

    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage
        chat = LlmChat(api_key=EMERGENT_LLM_KEY, session_id=f"pet-{new_id()}",
                       system_message=f"You are a kind homeschool pet companion. You never give answers, only encouragement.").with_model("anthropic", "claude-sonnet-5-5")
        resp = await chat.send_message(UserMessage(text=prompt))
        message = resp if isinstance(resp, str) else str(resp)
    except Exception as e:
        message = f"Hey {student_name}! I'm {pet['name']}. Let's take this one tiny step. Read the first question slowly, then try just the beginning. If a word feels tricky, check the key words. You've got this — I'll be right here. 💛"
    return {"message": message.strip()[:600], "pet": {"name": pet["name"], "species": pet["species"]}}

@api.get("/curriculum/stages")
async def get_stages():
    return [{**s, "source_link": NSW_SOURCE_LINKS.get(s["code"])} for s in NSW_STAGES]

@api.get("/curriculum/learning-areas")
async def get_learning_areas(band: str = "primary"):
    areas = NSW_LEARNING_AREAS.get(band, NSW_LEARNING_AREAS["primary"])
    return [{"name": a, "source_link": NSW_LA_LINKS.get(a)} for a in areas]

@api.get("/curriculum/pattern/{stage}")
async def get_pattern(stage: str):
    return NSW_SECONDARY_PATTERN.get(stage, {"compulsory": [], "electives": []})

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

@api.post("/auth/session")
async def auth_session(request: Request, response: Response):
    """Exchange Emergent OAuth session_id for an app session.
    Called by frontend AuthCallback with JSON body {"session_id": "..."}
    """
    body = await request.json()
    session_id = body.get("session_id")
    if not session_id:
        raise HTTPException(400, "session_id required")
    try:
        resp = requests.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id}, timeout=15,
        )
        resp.raise_for_status()
        data = resp.json()
    except Exception as e:
        logger.error(f"Google session fetch failed: {e}")
        raise HTTPException(401, "Could not verify Google session")

    email = (data.get("email") or "").lower().strip()
    name = data.get("name") or email.split("@")[0]
    picture = data.get("picture")
    session_token = data.get("session_token")
    if not email or not session_token:
        raise HTTPException(400, "Invalid Google session response")

    # Find or create user+family
    existing = await db.users.find_one({"email": email})
    if existing:
        user = existing
        await db.users.update_one({"id": user["id"]}, {"$set": {"name": name, "picture": picture}})
    else:
        family_id = new_id(); user_id = new_id()
        family = {"id": family_id, "name": f"{name}'s Family", "owner_id": user_id, "created_at": now_iso()}
        user = {"id": user_id, "email": email, "name": name, "picture": picture,
                "family_id": family_id, "is_owner": True, "oauth_provider": "google",
                "created_at": now_iso()}
        await db.families.insert_one(family)
        await db.users.insert_one(user)

    # Store session with 7-day expiry
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    await db.user_sessions.insert_one({
        "id": new_id(),
        "user_id": user["id"],
        "session_token": session_token,
        "expires_at": expires_at.isoformat(),
        "created_at": now_iso(),
    })

    response.set_cookie(
        "session_token", session_token,
        max_age=7 * 24 * 60 * 60,
        httponly=True, secure=True, samesite="none", path="/"
    )
    user_safe = {k: v for k, v in user.items() if k not in ("password", "_id")}
    user_safe["role"] = "parent"
    return {"user": user_safe}

@api.post("/auth/logout")
async def logout(response: Response, session_token: Optional[str] = Cookie(None)):
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    response.delete_cookie("session_token", path="/", samesite="none", secure=True)
    return {"ok": True}

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
        "electives": data.electives or [],
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
    xp_gained = await award_xp(user["id"], 15, f"Submitted: {a.get('lesson_id')}")
    return {**{k:v for k,v in sub.items() if k != '_id'}, "xp_gained": 15, "pet_xp": xp_gained}

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
        # Award pet XP for feedback statuses
        xp_map = {"accepted": 25, "demonstrated": 50, "needs_revision": 5, "needs_more_practice": 10}
        bonus = xp_map.get(data.status, 0)
        if bonus:
            await award_xp(sub["student_id"], bonus, f"Feedback: {data.status}")
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
  "suggested_resources": [
    {{"title": "resource name", "type": "video|article|book|interactive|podcast|dataset", "where_to_find": "e.g. ABC Education, Scootle, local library, National Geographic Kids - DO NOT invent URLs; describe where to search", "purpose": "why use it", "offline_alternative": "equivalent offline option", "stage_appropriate": true}}
  ],
  "follow_up_challenges": [
    {{"title": "challenge name", "type": "apply_in_life|teach_someone|create_something|measure_change|quiz|project", "description": "specific challenge instruction", "evidence_type": "photo|video|audio|written|measurement|parent_observation", "difficulty": "easy|medium|stretch"}}
  ],
  "outcome_codes": ["Suggested NSW outcome codes - leave empty if uncertain"],
  "source_note": "Note that NSW outcome mappings are AI-suggested and must be verified by the parent against NESA sources"
}}

CRITICAL RULES:
- Provide 2-4 external resource suggestions. NEVER invent URLs. Describe where to find them (library catalog, free Australian sites like ABC Education, Scootle, NSW DoE free resources, Khan Academy, etc.)
- Provide 3 follow-up challenges that help prove the learning sticks - at least one should be a real-world application
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
            "outcome_codes", "source_note", "suggested_resources", "follow_up_challenges"
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

# ----- Life Learning Evidence (everyday activities mapped to outcomes) -----
@api.post("/life-evidence")
async def create_life_evidence(data: LifeEvidenceIn, user=Depends(require_parent)):
    student = await db.students.find_one({"id": data.student_id, "family_id": user["family_id"]})
    if not student: raise HTTPException(404, "Student not found")
    rec = {
        "id": new_id(),
        "family_id": user["family_id"],
        "student_id": data.student_id,
        "title": data.title,
        "description": data.description,
        "date": data.date or now_iso()[:10],
        "duration_minutes": data.duration_minutes,
        "location": data.location,
        "file_ids": data.file_ids,
        "parent_note": data.parent_note,
        "status": "awaiting_mapping",
        "ai_mappings": [],
        "accepted_mappings": [],
        "created_by": user["id"],
        "created_at": now_iso(),
    }
    await db.life_evidence.insert_one(rec)
    return strip_mongo(rec)

@api.get("/life-evidence")
async def list_life_evidence(student_id: Optional[str] = None, user=Depends(require_parent)):
    q = {"family_id": user["family_id"]}
    if student_id: q["student_id"] = student_id
    recs = await db.life_evidence.find(q, {"_id": 0}).sort("created_at", -1).to_list(500)
    for r in recs:
        r["student"] = await db.students.find_one({"id": r["student_id"]}, {"_id": 0, "pin": 0})
    return recs

@api.get("/life-evidence/{eid}")
async def get_life_evidence(eid: str, user=Depends(require_parent)):
    r = await db.life_evidence.find_one({"id": eid, "family_id": user["family_id"]}, {"_id": 0})
    if not r: raise HTTPException(404)
    r["student"] = await db.students.find_one({"id": r["student_id"]}, {"_id": 0, "pin": 0})
    files = []
    for fid in r.get("file_ids", []):
        f = await db.files.find_one({"id": fid}, {"_id": 0})
        if f: files.append(f)
    r["files"] = files
    return r

@api.post("/life-evidence/analyse")
async def analyse_life_evidence(data: LifeAnalyseIn, user=Depends(require_parent)):
    if not EMERGENT_LLM_KEY: raise HTTPException(500, "AI not configured")
    rec = await db.life_evidence.find_one({"id": data.evidence_id, "family_id": user["family_id"]}, {"_id": 0})
    if not rec: raise HTTPException(404)
    student = await db.students.find_one({"id": rec["student_id"]}, {"_id": 0, "pin": 0})
    stage = student.get("stage", "S2") if student else "S2"
    band = next((s["band"] for s in NSW_STAGES if s["code"] == stage), "primary")
    areas = NSW_LEARNING_AREAS.get(band, NSW_LEARNING_AREAS["primary"])
    seed_outcomes = NSW_OUTCOMES_SEED

    prompt = f"""You are an expert NSW homeschool curriculum assessor. Parents in NSW may use everyday life activities (baking, gardening, bushwalking, building, music, caring for animals, budgeting, cooking) as legitimate evidence toward curriculum outcomes.

ACTIVITY SUBMITTED BY PARENT:
Title: {rec['title']}
Description: {rec['description']}
Duration: {rec.get('duration_minutes','n/a')} minutes
Location: {rec.get('location','n/a')}
Parent note: {rec.get('parent_note','')}
Date: {rec.get('date')}

STUDENT CONTEXT:
Name: {student['name'] if student else ''}
Stage: {stage}
Learning areas available at this band: {', '.join(areas)}

SAMPLE REFERENCE OUTCOMES (not exhaustive; add others if you know them, but mark confidence as 'medium' or 'low' when unsure):
{json.dumps([o for o in seed_outcomes if o.get('stage') == stage], indent=1)}

Return STRICT JSON only with keys:
{{
  "summary": "1-2 sentences describing what was learnt",
  "activity_type": "e.g. baking, bushwalking, animal care",
  "mappings": [
    {{
      "learning_area": "English | Mathematics | Science and Technology | HSIE | PDHPE | Creative Arts | Languages | TAS",
      "code": "exact NSW outcome code if you know it, else empty string",
      "description": "plain-language skill demonstrated",
      "evidence_statement": "how the activity shows this skill",
      "confidence": "high | medium | low"
    }}
  ],
  "additional_evidence_suggested": "what extra documentation (photo, quote, measurement, etc) would strengthen the mapping",
  "parent_review_note": "Reminder that these are AI suggestions for parent review, not official"
}}

RULES:
- Spread across multiple learning areas when the activity genuinely touches them
- Do NOT invent codes - leave code empty if unsure, keep description specific
- Match complexity to stage {stage}
- For baking: likely Mathematics (measurement, ratio), Science and Technology (chemical change, materials), English (reading recipes, procedural text), PDHPE (nutrition)
- For bushwalking: HSIE (geography, place), Science (ecosystems), PDHPE (physical activity), English (observation writing)
- Return 3-6 strong mappings, not a token one per area"""

    try:
        raw = await call_claude(prompt)
    except Exception as e:
        raise HTTPException(500, f"AI mapping failed: {str(e)[:200]}")
    parsed = extract_json(raw)
    if not parsed or "mappings" not in parsed:
        raise HTTPException(500, "AI returned invalid mapping format")
    for m in parsed.get("mappings", []):
        m["id"] = new_id()
        m["accepted"] = None
    await db.life_evidence.update_one({"id": data.evidence_id},
        {"$set": {"ai_mappings": parsed.get("mappings", []),
                  "ai_summary": parsed.get("summary"),
                  "ai_activity_type": parsed.get("activity_type"),
                  "ai_additional": parsed.get("additional_evidence_suggested"),
                  "status": "mapping_ready",
                  "analysed_at": now_iso()}})
    return parsed

@api.post("/life-evidence/{eid}/review")
async def review_life_evidence(eid: str, data: LifeFeedbackIn, user=Depends(require_parent)):
    accepted = [m for m in data.outcome_mappings if m.get("accepted")]
    await db.life_evidence.update_one({"id": eid, "family_id": user["family_id"]},
        {"$set": {"accepted_mappings": accepted,
                  "status": data.status,
                  "parent_note": data.parent_note,
                  "reviewed_at": now_iso(),
                  "reviewed_by": user["id"]}})
    # Award pet XP for life-learning evidence too
    rec = await db.life_evidence.find_one({"id": eid}, {"_id": 0})
    if rec:
        xp = {"accepted": 20, "demonstrated": 45, "needs_more_evidence": 5}.get(data.status, 10)
        await award_xp(rec["student_id"], xp, f"Life learning: {rec.get('title')}")
    return {"ok": True, "accepted_count": len(accepted)}

# ----- Learning Plans (for AP inspection) -----
@api.get("/learning-plans")
async def list_learning_plans(student_id: Optional[str] = None, user=Depends(require_parent)):
    q = {"family_id": user["family_id"]}
    if student_id: q["student_id"] = student_id
    plans = await db.learning_plans.find(q, {"_id": 0}).sort("created_at", -1).to_list(100)
    for p in plans:
        p["student"] = await db.students.find_one({"id": p["student_id"]}, {"_id": 0, "pin": 0})
    return plans

@api.get("/learning-plans/{pid}")
async def get_learning_plan(pid: str, user=Depends(require_parent)):
    p = await db.learning_plans.find_one({"id": pid, "family_id": user["family_id"]}, {"_id": 0})
    if not p: raise HTTPException(404)
    p["student"] = await db.students.find_one({"id": p["student_id"]}, {"_id": 0, "pin": 0})
    return p

@api.post("/learning-plans")
async def create_learning_plan(data: LearningPlanIn, user=Depends(require_parent)):
    student = await db.students.find_one({"id": data.student_id, "family_id": user["family_id"]})
    if not student: raise HTTPException(404)
    plan = {
        "id": new_id(),
        "family_id": user["family_id"],
        "student_id": data.student_id,
        "title": data.title,
        "period_start": data.period_start,
        "period_end": data.period_end,
        "interests": data.interests,
        "subject_focus": data.subject_focus,
        "teaching_approach": data.teaching_approach,
        "notes": data.notes,
        "status": "draft",
        "ai_content": None,
        "created_at": now_iso(),
    }
    await db.learning_plans.insert_one(plan)
    return strip_mongo(plan)

@api.delete("/learning-plans/{pid}")
async def delete_learning_plan(pid: str, user=Depends(require_parent)):
    await db.learning_plans.delete_one({"id": pid, "family_id": user["family_id"]})
    return {"ok": True}

@api.post("/learning-plans/{pid}/generate")
async def generate_learning_plan(pid: str, user=Depends(require_parent)):
    if not EMERGENT_LLM_KEY: raise HTTPException(500, "AI not configured")
    plan = await db.learning_plans.find_one({"id": pid, "family_id": user["family_id"]}, {"_id": 0})
    if not plan: raise HTTPException(404)
    student = await db.students.find_one({"id": plan["student_id"]}, {"_id": 0, "pin": 0})
    stage = student.get("stage", "S2") if student else "S2"
    band = next((s["band"] for s in NSW_STAGES if s["code"] == stage), "primary")
    areas = plan.get("subject_focus") or NSW_LEARNING_AREAS.get(band, NSW_LEARNING_AREAS["primary"])
    interests = ", ".join(plan.get("interests", []) or ["general curiosity"])

    prompt = f"""You are an experienced NSW homeschool educator preparing an educational program document that will be presented to an Authorised Person (AP) during a NESA home-schooling registration inspection.

STUDENT:
Name: {student['name'] if student else 'Student'}
Stage: {stage} ({next((s['name'] for s in NSW_STAGES if s['code'] == stage), '')})
Interests: {interests}

PLAN DETAILS:
Title: {plan['title']}
Period: {plan['period_start']} to {plan['period_end']}
Learning areas in focus: {', '.join(areas)}
Teaching approach: {plan.get('teaching_approach') or 'balanced, interest-led where possible'}
Parent notes: {plan.get('notes') or 'none'}

Produce a professional, respectful, AP-ready learning plan in STRICT JSON only. Match the structure NESA inspectors expect: syllabus-referenced goals, teaching methods, resources, assessment approach, and a review schedule. Weave the child's interests into learning objectives where it is genuinely educational — not forced.

Return JSON with EXACT keys:
{{
  "overview": "2-3 paragraph introduction describing the student, approach, and overall intent for the period",
  "educational_philosophy": "Brief paragraph on this family's educational philosophy and how it meets the home-schooling expectations",
  "learning_areas": [
    {{
      "area": "learning area name",
      "goals": ["3-5 specific, measurable goals written as learning outcomes"],
      "indicative_outcome_codes": ["NSW outcome codes if known, else empty strings"],
      "teaching_methods": ["concrete methods: explicit teaching, guided practice, project work, excursions, etc"],
      "interest_hooks": ["specific ways the child's interests connect to this area"],
      "sample_activities": ["3-5 example learning activities for the period"],
      "evidence_approach": "How evidence of learning will be collected and documented"
    }}
  ],
  "weekly_rhythm": "Plain-language description of the typical teaching week",
  "assessment_approach": "How the parent will assess progress - formative, summative, work samples, observations, discussion",
  "resources_overview": "Types of resources used - texts, online, library, community, excursions, co-ops",
  "review_schedule": "How and when the plan will be reviewed and adjusted",
  "assessor_notes": "Short section that proactively addresses typical AP questions: how outcomes are covered, how progress is tracked, accommodations, parent qualifications and supervision"
}}

RULES:
- Write respectfully in the parent's voice ('I will', 'we plan to')
- Keep tone professional and specific, not marketing-fluffy
- Produce ONE JSON object only
- At least 3 learning areas; use the ones listed in focus
- NEVER invent outcome codes - leave them empty if unsure"""

    try:
        raw = await call_claude(prompt)
    except Exception as e:
        raise HTTPException(500, f"AI generation failed: {str(e)[:200]}")
    parsed = extract_json(raw)
    if not parsed or "overview" not in parsed:
        raise HTTPException(500, "AI returned invalid plan format")
    await db.learning_plans.update_one({"id": pid},
        {"$set": {"ai_content": parsed, "status": "generated", "generated_at": now_iso()}})
    return parsed

# ----- Reading Log -----
@api.get("/reading-log")
async def list_reading(student_id: Optional[str] = None, user=Depends(current_user)):
    q = {"family_id": user["family_id"]}
    if user.get("role") == "child":
        q["student_id"] = user["id"]
    elif student_id:
        q["student_id"] = student_id
    entries = await db.reading_log.find(q, {"_id": 0}).sort("read_date", -1).to_list(1000)
    if user.get("role") == "parent":
        for e in entries:
            e["student"] = await db.students.find_one({"id": e["student_id"]}, {"_id": 0, "pin": 0})
    return entries

@api.get("/reading-log/stats")
async def reading_stats(student_id: Optional[str] = None, user=Depends(require_parent)):
    q = {"family_id": user["family_id"]}
    if student_id: q["student_id"] = student_id
    entries = await db.reading_log.find(q, {"_id": 0}).to_list(5000)
    titles = set()
    total_minutes = 0; total_pages = 0
    by_type = {}
    by_mode = {}
    for e in entries:
        titles.add((e.get("title","") + "|" + (e.get("author") or "")).lower())
        total_minutes += int(e.get("duration_minutes") or 0)
        total_pages += int(e.get("pages_read") or e.get("pages") or 0)
        bt = e.get("book_type", "fiction"); by_type[bt] = by_type.get(bt, 0) + 1
        bm = e.get("reading_mode", "independent"); by_mode[bm] = by_mode.get(bm, 0) + 1
    return {
        "entries": len(entries),
        "unique_books": len(titles),
        "total_minutes": total_minutes,
        "total_pages": total_pages,
        "by_type": by_type,
        "by_mode": by_mode,
    }

@api.post("/reading-log")
async def add_reading(data: ReadingLogIn, user=Depends(current_user)):
    if user.get("role") == "child" and data.student_id != user["id"]:
        raise HTTPException(403, "Can't log for another student")
    entry = {**data.model_dump(), "id": new_id(), "family_id": user["family_id"],
             "logged_by": user["id"], "logged_role": user.get("role"), "created_at": now_iso()}
    await db.reading_log.insert_one(entry)
    # Award a tiny XP to pet
    if user.get("role") == "child":
        await award_xp(user["id"], 3, f"Read: {data.title}")
    return strip_mongo(entry)

@api.delete("/reading-log/{eid}")
async def del_reading(eid: str, user=Depends(require_parent)):
    await db.reading_log.delete_one({"id": eid, "family_id": user["family_id"]})
    return {"ok": True}

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
    # include life-learning accepted mappings in coverage
    life = await db.life_evidence.find({"family_id": user["family_id"], "status": {"$in": ["accepted", "demonstrated"]}}, {"_id": 0}).to_list(500)
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
    # Fold in life-learning
    for le in life:
        student = next((s for s in [await db.students.find_one({"id": le["student_id"]}, {"_id": 0, "pin": 0})] if s), None)
        stage = student["stage"] if student else "S2"
        for m in le.get("accepted_mappings", []):
            la = m.get("learning_area")
            if not la: continue
            key = f"{stage}:{la}"
            coverage.setdefault(key, {"stage": stage, "learning_area": la, "count": 0, "demonstrated": 0, "life_learning": 0})
            coverage[key]["life_learning"] = coverage[key].get("life_learning", 0) + 1
            if le.get("status") == "demonstrated": coverage[key]["demonstrated"] += 1
    return {"issues": issues, "coverage": list(coverage.values()), "notice": "This audit identifies planning and evidence gaps. It does not determine registration eligibility or replace official advice."}

# ----- Seed curriculum + demo -----
@app.on_event("startup")
async def startup():
    init_storage()
    cfg = await db.app_config.find_one({"id": "seed"}) or {}
    if cfg.get("outcomes_version", 0) < SEED_VERSION:
        await db.outcomes.delete_many({})
        await db.outcomes.insert_many([{**o, "id": new_id()} for o in NSW_OUTCOMES_SEED])
        await db.app_config.update_one({"id": "seed"}, {"$set": {"outcomes_version": SEED_VERSION, "updated_at": now_iso()}}, upsert=True)
        logger.info(f"Reseeded NSW outcomes to version {SEED_VERSION} ({len(NSW_OUTCOMES_SEED)} entries)")
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
_cors = os.environ.get('CORS_ORIGINS', '*').split(',')
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=_cors if _cors != ['*'] else ["*"],
    allow_origin_regex=".*" if _cors == ['*'] else None,
    allow_methods=["*"],
    allow_headers=["*"],
)
