"""Calendar helpers for Side Quest (kept separate so server.py stays small)."""

EDITABLE_EVENT_FIELDS = {
    "title", "date", "start_time", "duration_minutes", "event_type",
    "notes", "student_id", "status", "linked_lesson_id", "linked_assignment_id",
}


def calendar_query(user, student_id=None):
    """Build the calendar query. Children see their own events plus family-wide ones."""
    q = {"family_id": user["family_id"]}
    if user.get("role") == "child":
        q["$or"] = [{"student_id": user["id"]}, {"student_id": None}]
    elif student_id:
        q["student_id"] = student_id
    return q


def clean_event_update(data: dict) -> dict:
    """Keep only whitelisted fields for an event update."""
    return {k: v for k, v in (data or {}).items() if k in EDITABLE_EVENT_FIELDS}
