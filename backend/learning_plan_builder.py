"""Builds a learning plan document from the plan form, the NSW outcomes already in the
database, and subject templates. No AI service is used.

The result is saved in the plan's ai_content field (same shape as before) so the
existing View and Print screens keep working.
"""
import re
from datetime import datetime, timezone, date

from fastapi import HTTPException, Depends

CORE_AREAS = ["English", "Mathematics", "Science and Technology", "HSIE", "Creative Arts", "PDHPE"]

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

AREAS = {
    "English": {
        "goals": ["Read a range of texts with fluency and understanding", "Write clearly for different purposes and audiences", "Speak and listen with confidence in discussion", "Build spelling, vocabulary and handwriting"],
        "methods": ["Daily reading, independent and shared", "Explicit teaching of spelling, grammar and writing structure", "Discussion and retelling of what has been read"],
        "hooks": ["Read books and articles about {i} and discuss them", "Write a report, story or instructions about {i}", "Build vocabulary lists from texts about {i}"],
        "activities": ["Keep a reading log and talk about each book", "Weekly writing task with a checklist, edited and published", "Spelling and vocabulary practice from the reading"],
        "evidence": "Reading log, dated writing samples showing drafts and edits, spelling results, and notes from discussions.",
    },
    "Mathematics": {
        "goals": ["Understand number, place value and the four operations", "Recall number facts and use efficient strategies", "Measure, estimate and describe shape and space", "Collect, represent and interpret data"],
        "methods": ["Short explicit lessons followed by guided and independent practice", "Hands-on materials and real-life problems", "Regular revision of number facts"],
        "hooks": ["Use measurement, counting and money problems that involve {i}", "Collect and graph data about {i}", "Solve word problems set in the world of {i}"],
        "activities": ["Daily maths lesson with worked examples and practice", "Number fact fluency practice", "Weekly problem-solving task using real situations"],
        "evidence": "Dated work samples, quiz and check-up results, and photos of hands-on tasks.",
    },
    "Science and Technology": {
        "goals": ["Ask questions and investigate the natural and made world", "Build knowledge of living, physical, earth and space systems", "Design, make and evaluate simple solutions to problems", "Communicate findings with evidence"],
        "methods": ["Investigations: question, predict, test, record, conclude", "Observation and nature study", "Design and build projects"],
        "hooks": ["Investigate the science behind {i}", "Design and build something related to {i}", "Observe and record what you notice about {i}"],
        "activities": ["Fortnightly investigation with a written or drawn record", "Nature observation journal", "Design, make and evaluate project"],
        "evidence": "Investigation write-ups, labelled diagrams, photos of experiments and projects.",
    },
    "HSIE": {
        "goals": ["Understand how people and places connect across time", "Use maps, timelines and sources to find information", "Learn about Australian history, geography, civics and citizenship", "Respect different cultures, perspectives and communities"],
        "methods": ["Inquiry with sources, maps and timelines", "Reading and discussion", "Visits to museums, libraries and local sites"],
        "hooks": ["Research the history and places connected to {i}", "Map where {i} is found or comes from", "Interview a family member or community member about {i}"],
        "activities": ["Term inquiry project with a final presentation", "Map and timeline work", "Excursion or local community visit with a written reflection"],
        "evidence": "Research projects, maps and timelines, excursion records and photos.",
    },
    "Creative Arts": {
        "goals": ["Explore and make visual artworks using different materials", "Listen to, perform and create music", "Take part in drama or dance to express ideas", "Talk about their own and others' artworks"],
        "methods": ["Hands-on making with a variety of materials", "Looking at and discussing artists and artworks", "Regular practice and performance"],
        "hooks": ["Draw, paint or sculpt a series inspired by {i}", "Write or perform a song, play or dance about {i}", "Study an artist whose work relates to {i}"],
        "activities": ["Weekly art or craft session", "Music listening and practice", "End-of-term showing of finished work"],
        "evidence": "Photos of artworks, a visual art journal, and notes on performances.",
    },
    "PDHPE": {
        "goals": ["Build movement skills and regular physical fitness", "Understand healthy eating, safety and wellbeing", "Develop respectful relationships and teamwork", "Practise safe, healthy choices"],
        "methods": ["Daily physical activity and skill practice", "Games, sport and community programs", "Discussion of health and safety topics"],
        "hooks": ["Build a fitness or skills plan around {i}", "Learn the rules and teamwork skills of {i}", "Plan healthy meals or safety rules connected to {i}"],
        "activities": ["Daily exercise or sport", "Weekly community sport, swimming or group activity", "Health and safety topic discussions"],
        "evidence": "Activity log, sport or club attendance, and notes on health topics covered.",
    },
    "Languages": {
        "goals": ["Learn basic vocabulary and phrases", "Understand how another culture lives and communicates"],
        "methods": ["Short, regular practice", "Songs, games and conversation"],
        "hooks": ["Learn words and phrases connected to {i}"],
        "activities": ["Short weekly language sessions"],
        "evidence": "Vocabulary lists and notes on what has been learned.",
    },
    "TAS": {
        "goals": ["Plan, make and evaluate practical projects", "Use tools and materials safely", "Learn about food, textiles, digital and design technologies"],
        "methods": ["Project-based learning", "Demonstration, then supervised practice"],
        "hooks": ["Plan and make a project related to {i}"],
        "activities": ["Term project with a plan, steps and a final evaluation"],
        "evidence": "Project plans, photos at each stage, and a short evaluation.",
    },
}


def _family(user: dict):
    return user.get("family_id") or user.get("parent_id")


async def _outcomes(db, stage: str, area: str, limit: int = 6):
    pats = [{"learning_area": {"$regex": re.escape(p), "$options": "i"}} for p in AREA_MATCH.get(area, [area])]
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


async def build_plan_content(db, plan: dict, student: dict) -> dict:
    stage = student.get("stage") or ""
    stage_label = STAGE_LABEL.get(stage, stage or "the child's stage")
    name = student.get("name") or "the student"
    first = name.split()[0]
    interests = [i for i in (plan.get("interests") or []) if i]
    interest_text = ", ".join(interests) if interests else "their own interests"
    focus = [a for a in (plan.get("subject_focus") or []) if a in AREAS]
    areas = list(dict.fromkeys(CORE_AREAS + focus))
    weeks = _weeks(plan.get("period_start", ""), plan.get("period_end", ""))
    approach = (plan.get("teaching_approach") or "").strip()
    notes = (plan.get("notes") or "").strip()

    learning_areas = []
    for area in areas:
        t = AREAS[area]
        outs = await _outcomes(db, stage, area) if stage else []
        goals = [f"{o['code']}: {o['description']}" for o in outs] or t["goals"]
        hooks_src = interests or ["a topic your child chooses"]
        hooks = [t["hooks"][n % len(t["hooks"])].format(i=i) for n, i in enumerate(hooks_src[:3])]
        learning_areas.append({
            "area": area,
            "goals": goals,
            "indicative_outcome_codes": [o["code"] for o in outs],
            "teaching_methods": t["methods"],
            "interest_hooks": hooks,
            "sample_activities": t["activities"],
            "evidence_approach": t["evidence"],
        })

    books, minutes = await _reading_summary(db, plan["student_id"], plan.get("period_start", ""), plan.get("period_end", ""))
    reading_line = (f"During this period {books} reading entries ({minutes} minutes) have been recorded in the reading log. " if books else "")

    overview = (
        f"This plan covers {plan.get('period_start')} to {plan.get('period_end')} (about {weeks} weeks) for {name}, "
        f"working at {stage_label}. It covers the key learning areas: {', '.join(areas)}. "
        f"{first}'s interests ({interest_text}) are used to make the learning meaningful while the goals stay tied to the NSW syllabus outcomes listed under each area."
    )
    if notes:
        overview += f"\n\nParent notes: {notes}"

    philosophy = (
        "Learning is organised around the NSW syllabus outcomes for the child's stage, taught through regular, "
        "structured lessons and supported by the child's interests, real-life experiences and hands-on projects. "
        + (f"Teaching approach: {approach}. " if approach else "")
        + "The parent plans, teaches, supervises and records the learning."
    )

    return {
        "overview": overview,
        "educational_philosophy": philosophy,
        "learning_areas": learning_areas,
        "weekly_rhythm": (
            "Core subjects (English and Mathematics) are taught most mornings in focused blocks. Science and Technology, HSIE, "
            "Creative Arts and PDHPE are covered through projects, excursions and regular sessions across the week. "
            "Daily independent reading and some physical activity happen every day."
        ),
        "assessment_approach": (
            "Progress is monitored through completed lessons and quizzes, dated work samples, the reading log, photos and "
            "short parent observation notes. Work is checked against the outcomes listed for each area and re-taught where needed."
        ),
        "resources_overview": (
            "Lessons and activities in the Side Quest platform, library books, online resources chosen by the parent, "
            "hands-on materials, community facilities and excursions. The resources used are recorded in the platform."
        ),
        "review_schedule": (
            "The parent reviews progress each term and updates the plan when the child's needs or interests change. "
            "Records are kept up to date so they can be shown at the registration visit."
        ),
        "assessor_notes": (
            f"{reading_line}Evidence for each learning area is available in the platform, including the reading log, lesson "
            "results, work samples and photos. This plan was built from the parent's inputs and the NSW syllabus outcomes held in the platform, and has been reviewed by the parent."
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
