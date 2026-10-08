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

SUBJECT_GOAL = {
    "history": "Over this period {n} will learn to place key events, people and sources in time, and to explain in their own words why they mattered then and why they still matter today.",
    "geography": "Over this period {n} will practise reading maps and data to describe places, and to explain how people use and shape the environments they live in.",
    "commerce": "Over this period {n} will learn how money, consumers and businesses work, and will practise making sensible, well-reasoned financial decisions.",
    "aboriginal": "Over this period {n} will learn about the cultures and histories of Aboriginal peoples and their continuing connection to Country, with respect and an open mind.",
}

AREAS = {
    "English": {
        "goals": [
            "{n} will read a wide range of fiction and non-fiction with growing fluency, and will be able to talk about what the author is saying and how they say it.",
            "{n} will write clearly and with purpose for different audiences, planning, drafting and editing so that each piece is better than the last.",
            "{n} will build confidence in speaking and listening, taking part in discussions, giving their opinion with reasons and listening carefully to others.",
            "{n} will keep strengthening spelling, grammar, vocabulary and handwriting so that their ideas can be expressed accurately.",
        ],
        "methods": [
            "Reading happens every day, sometimes independently and sometimes together, and {n} is encouraged to talk through what they have read so that understanding can be checked as it develops.",
            "Spelling, grammar and the structure of different kinds of writing are taught directly and step by step, and {n} then applies each skill in their own writing rather than in isolated exercises.",
            "Discussion and retelling are used regularly, as they show quickly how well {n} has understood a text and where more support is needed.",
        ],
        "hooks": [
            "To keep reading engaging, {n} reads books and articles about {i} and discusses them with a parent.",
            "{n} puts their writing skills to use by producing a report, story or set of instructions about {i}.",
            "{n} builds vocabulary by collecting and learning interesting words from texts about {i}.",
        ],
        "activities": [
            "{n} keeps a reading log and talks about each book with a parent as it is finished, covering what happened, what they thought, and what they would recommend.",
            "Once a week {n} completes a piece of writing against a simple checklist, then edits it and publishes a final copy.",
            "Spelling and vocabulary practice is drawn directly from what {n} has been reading, so the words are meaningful rather than random.",
        ],
        "evidence": "A parent keeps {n}'s reading log, dated writing samples that show drafts and edits, spelling results, and short notes from discussions, so that progress can be seen over the whole period.",
    },
    "Mathematics": {
        "goals": [
            "{n} will develop a secure understanding of number, place value and the four operations, so that more advanced maths has a solid base.",
            "{n} will recall number facts quickly and choose efficient strategies for solving problems, rather than counting or guessing.",
            "{n} will learn to measure, estimate and describe shape and space, and to use these skills in everyday situations.",
            "{n} will collect, display and interpret data, and explain what it shows.",
        ],
        "methods": [
            "Each concept is introduced in a short, clear lesson, followed by guided practice with a parent and then independent practice, so {n} moves from watching to doing.",
            "Hands-on materials and real-life problems are used whenever possible, because {n} understands ideas more deeply when they can be seen and handled.",
            "Number facts and earlier topics are revised regularly, so that what {n} has learned stays learned.",
        ],
        "hooks": [
            "{n} meets maths in a way that matters to them by working on measurement, counting and money problems that involve {i}.",
            "{n} collects and graphs real data about {i}, then explains what it shows.",
            "{n} solves word problems that are set in the world of {i}.",
        ],
        "activities": [
            "A daily maths lesson with worked examples, followed by practice that {n} completes and has marked.",
            "Short, regular number fact practice so that {n} builds speed and confidence.",
            "A weekly problem-solving task using a real situation, where {n} must decide what to do and explain their thinking.",
        ],
        "evidence": "Dated work samples, results from short quizzes and check-ups, and photos of hands-on tasks give a clear picture of {n}'s progress and any gaps still to be filled.",
    },
    "Science and Technology": {
        "goals": [
            "{n} will learn to ask good questions about the natural and made world and to investigate them fairly.",
            "{n} will build knowledge of living things, materials and forces, and of earth and space, and be able to explain it in their own words.",
            "{n} will design, make and improve simple solutions to real problems.",
            "{n} will learn to communicate what they have found, backing up claims with evidence.",
        ],
        "methods": [
            "Investigations follow a clear pattern in which {n} asks a question, makes a prediction, tests it, records what happens and draws a conclusion.",
            "Observation and time outdoors are used to build the habit of noticing detail.",
            "Design and build projects give {n} the chance to try an idea, see where it fails and improve it.",
        ],
        "hooks": [
            "{n} investigates the science behind {i}, asking how and why it works.",
            "{n} designs and builds something connected to {i}.",
            "{n} observes and records what they notice about {i} over several weeks.",
        ],
        "activities": [
            "About once a fortnight {n} completes an investigation and writes or draws up what they did and found.",
            "{n} keeps an observation journal with dated entries, sketches and questions.",
            "{n} completes a design, make and evaluate project, finishing with a short reflection on what worked and what they would change.",
        ],
        "evidence": "Investigation write-ups, labelled diagrams, observation journal entries and photos of {n}'s experiments and projects show both what {n} knows and how they work like a scientist.",
    },
    "HSIE": {
        "goals": [
            "{n} will understand how people and places are connected across time, and why events in the past still affect the present.",
            "{n} will learn to use maps, timelines and sources to find and check information.",
            "{n} will learn about Australian history, geography, civics and citizenship, including how communities and government work.",
            "{n} will learn to respect different cultures, beliefs and points of view.",
        ],
        "methods": [
            "Learning is organised as an inquiry, with {n} working from a question and using sources, maps and timelines to find answers.",
            "Reading and conversation help {n} explain what they have found in their own words.",
            "Visits to museums, libraries and local places bring the topic to life.",
        ],
        "hooks": [
            "{n} researches the history and places connected to {i}.",
            "{n} maps where {i} is found, or where it comes from, and explains why.",
            "{n} interviews a family or community member about {i} and records what they learn.",
        ],
        "activities": [
            "{n} completes a term inquiry project that finishes with a presentation to the family.",
            "{n} works on maps and timelines that are added to as new topics are covered.",
            "{n} takes part in an excursion or local visit and writes a short reflection afterwards.",
        ],
        "evidence": "{n}'s research projects, maps and timelines, together with excursion records and photos, show the depth of what {n} has learned.",
    },
    "Creative Arts": {
        "goals": [
            "{n} will explore and make artworks using a range of materials and techniques, and develop their own style.",
            "{n} will listen to, perform and create music.",
            "{n} will take part in drama or dance to express ideas and feelings.",
            "{n} will learn to talk about their own and other people's artworks with thought and respect.",
        ],
        "methods": [
            "{n} learns by making, with a variety of materials and plenty of time to experiment.",
            "Artists and artworks are looked at and discussed together, so {n} learns how others have solved creative problems.",
            "Regular practice and the chance to perform or show work build {n}'s confidence.",
        ],
        "hooks": [
            "{n} draws, paints or sculpts a series of works inspired by {i}.",
            "{n} writes or performs a song, play or dance about {i}.",
            "{n} studies an artist whose work relates to {i} and responds to it in their own piece.",
        ],
        "activities": [
            "A weekly art or craft session where {n} works on a project over several weeks.",
            "Regular music listening and practice.",
            "A showing at the end of each term, where {n} presents their finished work to the family.",
        ],
        "evidence": "Photos of {n}'s artworks, a visual art journal and notes on performances show development over time.",
    },
    "PDHPE": {
        "goals": [
            "{n} will build movement skills and keep up regular physical activity that supports fitness and enjoyment.",
            "{n} will learn about healthy eating, safety and wellbeing, and how to look after themselves.",
            "{n} will develop respectful relationships and learn to work as part of a team.",
            "{n} will practise making safe, healthy choices and know where to go for help.",
        ],
        "methods": [
            "Physical activity and skill practice happen daily, so that {n} builds fitness steadily.",
            "Games, sport and community programs give {n} the chance to practise teamwork and fair play with other children.",
            "Health and safety topics are discussed openly, and {n} is encouraged to ask questions.",
        ],
        "hooks": [
            "{n} builds a fitness or skills plan around {i}.",
            "{n} learns the rules, and the teamwork needed, for {i}.",
            "{n} plans healthy meals or safety rules connected to {i}.",
        ],
        "activities": [
            "{n} gets some exercise or sport every day.",
            "{n} joins a weekly community sport, swimming or group activity.",
            "Health and safety topics are discussed regularly, with {n} recording what they learned.",
        ],
        "evidence": "{n}'s activity log, attendance at sport or clubs, and notes on the health topics covered show regular, balanced activity.",
    },
    "Languages": {
        "goals": [
            "{n} will learn basic vocabulary and phrases that can be used in simple conversation.",
            "{n} will begin to understand how another culture lives and communicates.",
        ],
        "methods": [
            "Short, regular practice helps {n} remember what they learn.",
            "Songs, games and conversation make the language enjoyable to use.",
        ],
        "hooks": ["{n} learns words and phrases connected to {i}."],
        "activities": ["Short language sessions each week, with {n} practising aloud and keeping a vocabulary list."],
        "evidence": "{n}'s vocabulary lists and notes on what has been learned.",
    },
    "TAS": {
        "goals": [
            "{n} will plan, make and evaluate practical projects from start to finish.",
            "{n} will learn to use tools and materials safely.",
            "{n} will explore food, textiles, digital and design technologies.",
        ],
        "methods": [
            "Project-based learning gives {n} a real purpose for each skill.",
            "New skills are demonstrated first and then practised by {n} with supervision.",
        ],
        "hooks": ["{n} plans and makes a project related to {i}."],
        "activities": ["A term project in which {n} writes a plan, follows the steps and evaluates the result."],
        "evidence": "{n}'s project plans, photos at each stage and a short evaluation of the finished product.",
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


def _focus_goal(first: str, label: str, end_text: str, deepen: bool, interests):
    s = (
        f"This period {first}'s main aim in {label} is to build on what they already know and take the next step at a level that suits them, "
        f"so that by {end_text} there is clear, dated work to show the progress {first} has made."
    )
    if deepen:
        s += f" {label} is also a subject the family has chosen to give extra time and depth for {first}."
    return s


async def build_plan_content(db, plan: dict, student: dict) -> dict:
    stage = student.get("stage") or ""
    stage_label = STAGE_LABEL.get(stage, stage or "their stage")
    year = student.get("year_level")
    year_text = f"Year {year}, which is {stage_label}" if year and str(year) != "K" else stage_label
    name = student.get("name") or "the student"
    first = name.split()[0]
    birth = student.get("birth_year")
    try:
        age = datetime.now(timezone.utc).year - int(birth) if birth else None
    except (TypeError, ValueError):
        age = None
    if age is not None and not (3 <= age <= 19):
        age = None
    interests = [i for i in (plan.get("interests") or []) if i]
    interest_text = _join(interests)
    start, end = plan.get("period_start", ""), plan.get("period_end", "")
    end_text = _nice_date(end) or "the end of the period"
    weeks = _weeks(start, end)
    approach = (plan.get("teaching_approach") or "").strip()
    notes = (plan.get("notes") or "").strip()
    secondary = stage in SECONDARY
    entries = _entries(student, plan)
    labels = [e[0] for e in entries]
    deepen_set = {a for a in (plan.get("subject_focus") or [])}

    learning_areas = []
    for label, area, words, key in entries:
        t = AREAS[area]
        outs = await _outcomes(db, stage, words) if stage else []
        if not outs and key:
            outs = await _outcomes(db, stage, AREA_MATCH.get(area, [area]))
        goals = [_focus_goal(first, label, end_text, label in deepen_set or area in deepen_set, interests)]
        goals += [g.format(n=first) for g in t["goals"]]
        if key in SUBJECT_GOAL:
            goals.insert(1, SUBJECT_GOAL[key].format(n=first))
        for o in outs:
            desc = (o.get("description") or "").strip().rstrip(".")
            goals.append(f"Syllabus link: this work supports the NSW outcome \"{desc}\" ({o['code']}), which {first} is working towards during this period.")
        if interests:
            hooks = [t["hooks"][n % len(t["hooks"])].format(n=first, i=i) for n, i in enumerate(interests[:3])]
        else:
            hooks = [f"To keep {label} interesting, {first} chooses a topic each term that they are curious about and builds a short project around it."]
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
    reading_line = (f"{first} has logged {books} reading sessions totalling {minutes} minutes during this period, which is kept as a record of daily reading. " if books else "")

    who = f"{first}" + (f" is {age} years old and" if age else "") + f" is working at {year_text}."
    overview = (
        f"This learning plan sets out what {first} will learn from {_nice_date(start)} to {end_text}, a period of about {weeks} weeks. "
        f"{who} The program covers {_join(labels)}, and it is pitched at the level {first} is working at now, with room to move faster or slower as the work shows what is needed. "
    )
    if interests:
        overview += (
            f"{first} is especially interested in {interest_text}. These interests are woven through the program wherever they fit, "
            f"because {first} learns best when the work feels meaningful to them. Every goal remains tied to the NSW syllabus outcomes listed under each area."
        )
    else:
        overview += f"Every goal for {first} remains tied to the NSW syllabus outcomes listed under each area."
    overview += (
        f"\n\nThe period is planned in three parts. In the opening weeks {first} settles into the routine and any gaps from earlier work are identified and filled. "
        f"The middle of the period is the main teaching phase, when new skills are introduced and practised in each area. "
        f"The final weeks are used to revise, finish outstanding projects and gather {first}'s best work, so that {first} can see and show how much has been learned."
    )
    if notes:
        overview += f"\n\nA note from {first}'s parent: {notes}"

    philosophy = (
        f"We believe {first} learns best when the work is structured, clear and matched to where they are up to, and when it connects to real life. "
        f"{first}'s program is therefore organised around the NSW syllabus outcomes for their stage, taught through regular lessons and supported by {first}'s interests, "
        "hands-on projects and experiences in the community. "
        + (f"In particular, the approach for {first} is: {approach}. " if approach else "")
        + f"{first}'s parent plans the program, teaches or supervises each lesson, and keeps a record of the learning so that progress can be seen and shared."
    )

    others = [l for l in labels if l.lower() not in ("english", "mathematics")]
    if secondary:
        weekly = (
            f"Each week follows a steady routine. English and Mathematics are taught on most mornings in focused blocks, when {first} is at their freshest. "
            + (f"{_join(others)} are placed in set sessions across the week, usually about 50 to 60 minutes each, so every subject receives regular attention. " if others else "")
            + f"{first} also reads independently each day and keeps up regular physical activity, with some flexibility built in for projects, excursions and catch-up time."
        )
    else:
        weekly = (
            f"Each week follows a steady routine. English and Mathematics are taught most mornings in focused blocks, when {first} is at their freshest. "
            + (f"{_join(others)} are covered through projects, excursions and regular sessions across the week. " if others else "")
            + f"{first} reads independently every day and has time for physical activity, with some flexibility for catch-up and for following up on {first}'s interests."
        )

    mid = _midpoint(start, end)
    review = (
        f"{first}'s parent will review progress against the goals in this plan at the halfway point"
        + (f" (around {mid})" if mid else "")
        + f" and again at the end of the period. At each review the work completed is compared with the goals, anything {first} has found hard is re-taught, "
        f"and the plan is adjusted if {first}'s needs or interests have changed. Records are kept up to date so that they are ready to show at the registration visit."
    )

    return {
        "overview": overview,
        "educational_philosophy": philosophy,
        "learning_areas": learning_areas,
        "weekly_rhythm": weekly,
        "assessment_approach": (
            f"{first}'s progress is monitored in several ways: completed lessons and quizzes, dated work samples, the reading log, photos of practical work, "
            f"and short notes from the parent's observations. Each piece of work is checked against the outcomes listed for that area, and where {first} has not yet "
            "mastered a skill it is taught again in a different way before moving on."
        ),
        "resources_overview": (
            f"{first} learns from a mix of resources, including lessons and activities recorded in Side Quest, library books, online materials chosen by a parent, "
            "hands-on equipment, community facilities and excursions. The resources actually used are recorded as the period goes on."
        ),
        "review_schedule": review,
        "assessor_notes": (
            f"{reading_line}Evidence of {first}'s learning in each area is available to look at during the visit, including the reading log, lesson "
            f"results, work samples and photos. This plan was prepared by {first}'s parent using the NSW syllabus outcomes for "
            f"{stage_label}, and reflects what {first} is working on at present. {first}'s parent is happy to talk through any part of it."
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
