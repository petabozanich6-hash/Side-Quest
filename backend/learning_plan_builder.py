"""Builds a learning plan document from the plan form, the child's saved courses, the NSW
outcomes already in the database, and subject templates. No AI service is used.

The result is saved in the plan's ai_content field (same shape as before) so the
existing View and Print screens keep working.
"""
import re
from datetime import datetime, timezone, date, timedelta

from fastapi import HTTPException, Depends

CORE_AREAS = ["English", "Mathematics", "Science and Technology", "HSIE", "Creative Arts", "PDHPE"]
SECONDARY = ("S4", "S5", "S6")

STAGE_LABEL = {
    "ES1": "Early Stage 1 (Kindergarten)", "S1": "Stage 1 (Years 1-2)", "S2": "Stage 2 (Years 3-4)",
    "S3": "Stage 3 (Years 5-6)", "S4": "Stage 4 (Years 7-8)", "S5": "Stage 5 (Years 9-10)",
    "S6": "Stage 6 (Years 11-12)",
}

AREA_MATCH = {
    "English": ["English"],
    "Mathematics": ["Math"],
    "Science and Technology": ["Science"],
    "HSIE": ["HSIE", "Human Society", "History", "Geography"],
    "Creative Arts": ["Creative", "Visual", "Music", "Drama", "Dance"],
    "PDHPE": ["PDHPE", "Personal Development", "Health"],
    "Languages": ["Language"],
    "TAS": ["TAS", "Technology and Applied"],
}

# Keyword in a course name -> (template area, outcome search words)
SUBJECT_RULES = [
    ("english", "English", ["English"]),
    ("math", "Mathematics", ["Math"]),
    ("science", "Science and Technology", ["Science"]),
    ("history", "HSIE", ["History"]),
    ("geography", "HSIE", ["Geography"]),
    ("commerce", "HSIE", ["Commerce"]),
    ("aboriginal", "HSIE", ["Aboriginal"]),
    ("hsie", "HSIE", ["HSIE", "Human Society"]),
    ("pdhpe", "PDHPE", ["PDHPE", "Personal Development", "Health"]),
    ("physical", "PDHPE", ["PDHPE", "Physical"]),
    ("music", "Creative Arts", ["Music"]),
    ("visual", "Creative Arts", ["Visual"]),
    ("drama", "Creative Arts", ["Drama"]),
    ("dance", "Creative Arts", ["Dance"]),
    ("creative", "Creative Arts", ["Creative"]),
    ("language", "Languages", ["Language"]),
    ("lote", "Languages", ["Language"]),
]

# Extra first goal for specific HSIE pathways.
SUBJECT_GOAL = {
    "history": "{n} will place key events, people and sources in time and explain why they matter",
    "geography": "{n} will read maps and data to describe places and explain how people interact with their environment",
    "commerce": "{n} will learn how money, consumers and businesses work and make sensible financial decisions",
    "aboriginal": "{n} will learn about Aboriginal peoples' cultures, histories and continuing connection to Country",
}

AREAS = {
    "English": {
        "goals": ["{n} will read a range of texts with fluency and understanding", "{n} will write clearly for different purposes and audiences", "{n} will speak and listen with confidence in discussion", "{n} will build spelling, vocabulary and handwriting"],
        "methods": ["Daily reading, independent and shared, with {n} talking about what was read", "Explicit teaching of spelling, grammar and writing structure, then {n} applies it in their own writing", "Discussion and retelling to check {n}'s understanding"],
        "hooks": ["{n} reads books and articles about {i} and discusses them", "{n} writes a report, story or instructions about {i}", "{n} builds vocabulary lists from texts about {i}"],
        "activities": ["{n} keeps a reading log and talks about each book", "Weekly writing task for {n} with a checklist, edited and published", "Spelling and vocabulary practice drawn from {n}'s reading"],
        "evidence": "{n}'s reading log, dated writing samples showing drafts and edits, spelling results, and notes from discussions.",
    },
    "Mathematics": {
        "goals": ["{n} will understand number, place value and the four operations", "{n} will recall number facts and use efficient strategies", "{n} will measure, estimate and describe shape and space", "{n} will collect, represent and interpret data"],
        "methods": ["Short explicit lessons followed by guided and independent practice for {n}", "Hands-on materials and real-life problems", "Regular revision of number facts until {n} is fluent"],
        "hooks": ["{n} uses measurement, counting and money problems that involve {i}", "{n} collects and graphs data about {i}", "{n} solves word problems set in the world of {i}"],
        "activities": ["Daily maths lesson with worked examples and practice", "Number fact fluency practice for {n}", "Weekly problem-solving task using real situations"],
        "evidence": "{n}'s dated work samples, quiz and check-up results, and photos of hands-on tasks.",
    },
    "Science and Technology": {
        "goals": ["{n} will ask questions and investigate the natural and made world", "{n} will build knowledge of living, physical, earth and space systems", "{n} will design, make and evaluate solutions to problems", "{n} will communicate findings with evidence"],
        "methods": ["Investigations where {n} asks a question, predicts, tests, records and concludes", "Observation and nature study", "Design and build projects"],
        "hooks": ["{n} investigates the science behind {i}", "{n} designs and builds something related to {i}", "{n} observes and records what they notice about {i}"],
        "activities": ["Fortnightly investigation with a written or drawn record by {n}", "Observation journal kept by {n}", "Design, make and evaluate project"],
        "evidence": "{n}'s investigation write-ups, labelled diagrams, and photos of experiments and projects.",
    },
    "HSIE": {
        "goals": ["{n} will understand how people and places connect across time", "{n} will use maps, timelines and sources to find information", "{n} will learn about Australian history, geography, civics and citizenship", "{n} will respect different cultures, perspectives and communities"],
        "methods": ["Inquiry with sources, maps and timelines", "Reading and discussion, with {n} explaining what they found", "Visits to museums, libraries and local sites"],
        "hooks": ["{n} researches the history and places connected to {i}", "{n} maps where {i} is found or comes from", "{n} interviews a family or community member about {i}"],
        "activities": ["Term inquiry project with a final presentation by {n}", "Map and timeline work", "Excursion or local community visit followed by {n}'s written reflection"],
        "evidence": "{n}'s research projects, maps and timelines, excursion records and photos.",
    },
    "Creative Arts": {
        "goals": ["{n} will explore and make artworks using different materials and techniques", "{n} will listen to, perform and create music", "{n} will take part in drama or dance to express ideas", "{n} will talk about their own and others' artworks"],
        "methods": ["Hands-on making with a variety of materials", "Looking at and discussing artists and artworks with {n}", "Regular practice and performance"],
        "hooks": ["{n} draws, paints or sculpts a series inspired by {i}", "{n} writes or performs a song, play or dance about {i}", "{n} studies an artist whose work relates to {i}"],
        "activities": ["Weekly art or craft session for {n}", "Music listening and practice", "End-of-term showing of {n}'s finished work"],
        "evidence": "Photos of {n}'s artworks, a visual art journal, and notes on performances.",
    },
    "PDHPE": {
        "goals": ["{n} will build movement skills and regular physical fitness", "{n} will understand healthy eating, safety and wellbeing", "{n} will develop respectful relationships and teamwork", "{n} will practise safe, healthy choices"],
        "methods": ["Daily physical activity and skill practice", "Games, sport and community programs", "Discussion of health and safety topics with {n}"],
        "hooks": ["{n} builds a fitness or skills plan around {i}", "{n} learns the rules and teamwork skills of {i}", "{n} plans healthy meals or safety rules connected to {i}"],
        "activities": ["Daily exercise or sport", "Weekly community sport, swimming or group activity for {n}", "Health and safety topic discussions"],
        "evidence": "{n}'s activity log, sport or club attendance, and notes on health topics covered.",
    },
    "Languages": {
        "goals": ["{n} will learn basic vocabulary and phrases", "{n} will understand how another culture lives and communicates"],
        "methods": ["Short, regular practice", "Songs, games and conversation"],
        "hooks": ["{n} learns words and phrases connected to {i}"],
        "activities": ["Short weekly language sessions for {n}"],
        "evidence": "{n}'s vocabulary lists and notes on what has been learned.",
    },
    "TAS": {
        "goals": ["{n} will plan, make and evaluate practical projects", "{n} will use tools and materials safely", "{n} will learn about food, textiles, digital and design technologies"],
        "methods": ["Project-based learning", "Demonstration, then supervised practice by {n}"],
        "hooks": ["{n} plans and makes a project related to {i}"],
        "activities": ["Term project with a plan, steps and a final evaluation by {n}"],
        "evidence": "{n}'s project plans, photos at each stage, and a short evaluation.",
    },
}


def _family(user: dict):
    return user.get("family_id") or user.get("parent_id")


def _classify(name: str):
    low = (name or "").lower()
    for key, area, words in SUBJECT_RULES:
        if key in low:
            return area, words, key
    return "TAS", ["TAS", "Technology and Applied"], ""


async def _outcomes(db, stage: str, words, limit: int = 3):
    pats = [{"learning_area": {"$regex": re.escape(p), "$options": "i"}} for p in words]
    rows = await db.outcomes.find({"stage": stage, "$or": pats}, {"_id": 0}).to_list(40)
    return rows[:limit]


async def _reading_summary(db, student_id: str, start: str, end: str):
    rows = await db.reading_log.find(
        {"student_id": student_id, "read_date": {"$gte": start, "$lte": end}},
        {"_id": 0, "title": 1, "duration_minutes": 1}).to_list(2000)
    minutes = sum(int(r.get("duration_minutes") or 0) for r in rows)
    return len(rows), minutes


def _weeks(start: str, end: str) -> int:
    try:
        d = (date.fromisoformat(end) - date.fromisoformat(start)).days
        return max(1, round(d / 7))
    except ValueError:
        return 0


def _midpoint(start: str, end: str) -> str:
    try:
        s, e = date.fromisoformat(start), date.fromisoformat(end)
        return (s + timedelta(days=(e - s).days // 2)).strftime("%d %B %Y").lstrip("0")
    except ValueError:
        return ""


def _nice_date(v: str) -> str:
    try:
        return date.fromisoformat(v).strftime("%d %B %Y").lstrip("0")
    except ValueError:
        return v or ""


def _join(items):
    items = [i for i in items if i]
    if len(items) <= 1:
        return "".join(items)
    return ", ".join(items[:-1]) + " and " + items[-1]


def _entries(student: dict, plan: dict):
    """Subjects to plan for: (label, template area, outcome words, subject key)."""
    stage = student.get("stage") or ""
    saved = [c.get("name") for c in (student.get("electives") or []) if c.get("name")]
    saved = list(dict.fromkeys(saved))
    out = []
    if stage in SECONDARY and saved:
        for name in saved:
            area, words, key = _classify(name)
            out.append((re.sub(r"\s*\(.*\)", "", name), area, words, key))
        return out
    focus = [a for a in (plan.get("subject_focus") or []) if a in AREAS]
    for a in dict.fromkeys(CORE_AREAS + focus):
        out.append((a, a, AREA_MATCH.get(a, [a]), ""))
    return out


async def build_plan_content(db, plan: dict, student: dict) -> dict:
    stage = student.get("stage") or ""
    stage_label = STAGE_LABEL.get(stage, stage or "their stage")
    year = student.get("year_level")
    year_text = f"Year {year}, {stage_label}" if year and str(year) not in ("K",) else stage_label
    name = student.get("name") or "the student"
    first = name.split()[0]
    interests = [i for i in (plan.get("interests") or []) if i]
    interest_text = _join(interests) if interests else ""
    start, end = plan.get("period_start", ""), plan.get("period_end", "")
    weeks = _weeks(start, end)
    approach = (plan.get("teaching_approach") or "").strip()
    notes = (plan.get("notes") or "").strip()
    secondary = stage in SECONDARY
    entries = _entries(student, plan)
    labels = [e[0] for e in entries]

    learning_areas = []
    for label, area, words, key in entries:
        t = AREAS[area]
        outs = await _outcomes(db, stage, words) if stage else []
        if not outs and key:
            outs = await _outcomes(db, stage, AREA_MATCH.get(area, [area]))
        goals = [g.format(n=first) for g in t["goals"]]
        if key in SUBJECT_GOAL:
            goals.insert(0, SUBJECT_GOAL[key].format(n=first))
        goals += [f"Working towards {o['code']}: {o['description']}" for o in outs]
        if interests:
            hooks = [t["hooks"][n % len(t["hooks"])].format(n=first, i=i) for n, i in enumerate(interests[:3])]
        else:
            hooks = [f"{first} chooses a topic within {label} each term and builds a short project around it"]
        learning_areas.append({
            "area": label,
            "goals": goals,
            "indicative_outcome_codes": [o["code"] for o in outs],
            "teaching_methods": [m.format(n=first) for m in t["methods"]],
            "interest_hooks": hooks,
            "sample_activities": [a.format(n=first) for a in t["activities"]],
            "evidence_approach": t["evidence"].format(n=first),
        })

    books, minutes = await _reading_summary(db, plan["student_id"], start, end)
    reading_line = (f"{first} has {books} reading entries ({minutes} minutes) recorded in the reading log for this period. " if books else "")

    overview = (
        f"This plan sets out {first}'s learning from {_nice_date(start)} to {_nice_date(end)} (about {weeks} weeks). "
        f"{first} is working at {year_text}, and the program covers {_join(labels)}. "
    )
    if interests:
        overview += f"{first}'s interests in {interest_text} are used to make the learning meaningful, while every goal stays tied to the NSW syllabus outcomes listed under each area."
    else:
        overview += f"Every goal for {first} is tied to the NSW syllabus outcomes listed under each area."
    if notes:
        overview += f"\n\nParent notes: {notes}"

    philosophy = (
        f"{first}'s learning is organised around the NSW syllabus outcomes for their stage. It is taught through regular, "
        f"structured lessons and supported by {first}'s interests, real-life experiences and hands-on projects. "
        + (f"The teaching approach for {first} is: {approach}. " if approach else "")
        + f"{first}'s parent plans, teaches, supervises and records the learning."
    )

    others = [l for l in labels if l.lower() not in ("english", "mathematics")]
    if secondary:
        weekly = (
            f"English and Mathematics are taught on most mornings in focused blocks for {first}. "
            + (f"{_join(others)} are timetabled across the week in set sessions of about 50 to 60 minutes. " if others else "")
            + f"{first} also reads independently each day and keeps up regular physical activity."
        )
    else:
        weekly = (
            f"English and Mathematics are taught most mornings in focused blocks for {first}. "
            + (f"{_join(others)} are covered through projects, excursions and regular sessions across the week. " if others else "")
            + f"{first} reads independently every day, and some physical activity happens daily."
        )

    mid = _midpoint(start, end)
    review = (
        f"{first}'s parent reviews progress against these goals at the midpoint of the period"
        + (f" (around {mid})" if mid else "")
        + f" and again at the end, and updates the plan when {first}'s needs or interests change. "
        "Records are kept up to date so they can be shown at the registration visit."
    )

    return {
        "overview": overview,
        "educational_philosophy": philosophy,
        "learning_areas": learning_areas,
        "weekly_rhythm": weekly,
        "assessment_approach": (
            f"{first}'s progress is monitored through completed lessons and quizzes, dated work samples, the reading log, photos and "
            f"short parent observation notes. {first}'s work is checked against the outcomes listed for each area and re-taught where needed."
        ),
        "resources_overview": (
            f"Lessons and activities recorded in Side Quest, library books, online resources chosen by {first}'s parent, "
            "hands-on materials, community facilities and excursions. The resources used are recorded as the period goes on."
        ),
        "review_schedule": review,
        "assessor_notes": (
            f"{reading_line}Evidence of {first}'s learning in each area is available for the visit, including the reading log, lesson "
            f"results, work samples and photos. This plan was prepared by {first}'s parent from the NSW syllabus outcomes for "
            f"{stage_label} and has been reviewed by the parent."
        ),
        "generated_by": "template",
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }


def register(api, db, require_parent):

    @api.post("/learning-plans/{pid}/build")
    async def build_learning_plan(pid: str, user=Depends(require_parent)):
        fam = _family(user)
        plan = await db.learning_plans.find_one({"id": pid, "family_id": fam}, {"_id": 0})
        if not plan:
            raise HTTPException(404, "Plan not found")
        student = await db.students.find_one({"id": plan["student_id"]}, {"_id": 0, "pin": 0})
        if not student:
            raise HTTPException(404, "Student not found")
        content = await build_plan_content(db, plan, student)
        await db.learning_plans.update_one({"id": pid}, {"$set": {"ai_content": content, "status": "draft"}})
        return {"ok": True}
