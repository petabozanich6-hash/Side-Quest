# Built-in quests. Bump LESSON_LIBRARY_VERSION whenever lessons are added or changed.
LESSON_LIBRARY_VERSION = 28

# The Cartographer lesson and the old Week 1 lessons have been removed.
# The library now starts with the former Week 2 lessons, renumbered as Week 1.
# Plan week 3 lessons are renumbered as Week 2, and so on.
LESSON_LIBRARY = []

# Phrases that pointed back to earlier learning. This is now the first week,
# so each one is rewritten to teach the idea in place.
_EXACT_FIXES = [
    ("Practise with Look, Say, Cover, Write, Check from Week 1.",
     "Practise with Look, Say, Cover, Write, Check: look carefully at the word, say it aloud, cover it, write it from memory, then check it letter by letter."),
    ("Use the rules from Week 1. Drop the silent e",
     "Use these three rules. Drop the silent e"),
]


def _lesson_dicts_in(module):
    """Return every lesson dict (or list of lesson dicts) exposed by a module,
    whatever the variables are called. Helper functions are ignored."""
    found = []
    for name in sorted(dir(module)):
        if name.startswith("_"):
            continue
        value = getattr(module, name)
        if isinstance(value, dict) and value.get("seed_key"):
            found.append(value)
        elif isinstance(value, (list, tuple)) and value and all(isinstance(i, dict) and i.get("seed_key") for i in value):
            found.extend(value)
    return found


def _renumber(value):
    """Rewrite plan Week 2 labels and seed keys as Week 1 and plan Week 3 as
    Week 2, and remove references to earlier learning, throughout a lesson."""
    if isinstance(value, str):
        for old, new in _EXACT_FIXES:
            value = value.replace(old, new)
        value = (
            value.replace("Week 2", "Week 1")
            .replace("week 2", "week 1")
            .replace("-w02-", "-w01-")
            .replace("_w02_", "_w01_")
            .replace("w02", "w01")
        )
        return (
            value.replace("Week 3", "Week 2")
            .replace("week 3", "week 2")
            .replace("-w03-", "-w02-")
            .replace("_w03_", "_w02_")
        )
    if isinstance(value, list):
        return [_renumber(v) for v in value]
    if isinstance(value, dict):
        out = {k: _renumber(v) for k, v in value.items()}
        question = out.get("question")
        if isinstance(question, str) and question.startswith("How many n letters are in 'beginning'"):
            out["correct_index"] = 0
            out["explanation"] = "beginning is spelt b-e-g-i-n-n-i-n-g, so it has three n letters."
        return out
    return value


def _register_lessons():
    """Load the lesson modules one at a time. A problem in one file is
    logged and skipped, so it can never stop the app from starting.
    The fully taught lessons load first so they win over the older versions."""
    import importlib
    import logging

    log = logging.getLogger("sidequest")
    have = {item.get("seed_key") for item in LESSON_LIBRARY}
    modules = (
        "lesson_library_s2_english_w02_pilot",
        "lesson_library_s2_english_w02_l2_full",
        "lesson_library_s2_english_w02_l3_full",
        "lesson_library_s2_english_w02_l4_full",
        "lesson_library_s2_english_w03_l1_full",
        "lesson_library_s2_english_w03_l2_full",
        "lesson_library_s2_english_w03_l3_full",
        "lesson_library_s2_english_w03_l4_full",
        "lesson_library_s2_english_w02_l2_l3",
    )
    for module_name in modules:
        try:
            module = importlib.import_module(module_name)
            added = 0
            for lesson in _lesson_dicts_in(module):
                lesson = _renumber(lesson)
                if lesson["seed_key"] not in have:
                    LESSON_LIBRARY.append(lesson)
                    have.add(lesson["seed_key"])
                    added += 1
            log.warning("Lesson module %s added %s lessons (renumbered)", module_name, added)
        except Exception as exc:  # noqa: BLE001
            log.warning("Lesson module %s not loaded: %r", module_name, exc)


_register_lessons()


def _orphan_cleanup_later():
    """After the app has seeded the new lessons, delete any assignment whose
    lesson no longer exists. Those are the blank cards on the child page.
    It only acts when it can positively identify the lesson id field and the
    assignment collection, and it logs everything it does."""
    import logging
    import os
    import threading
    import time

    log = logging.getLogger("sidequest")

    def run():
        for delay in (75, 120, 240):
            time.sleep(delay)
            try:
                from pymongo import MongoClient
                client = MongoClient(os.environ["MONGO_URL"], serverSelectionTimeoutMS=8000)
                db = client[os.environ["DB_NAME"]]
                sample = db.lessons.find_one({})
                if not sample or "id" not in sample:
                    log.warning("Orphan cleanup: lessons not ready or no 'id' field; skipped")
                    client.close()
                    continue
                valid = {doc["id"] for doc in db.lessons.find({}, {"id": 1}) if doc.get("id")}
                names = [n for n in db.list_collection_names() if "assign" in n.lower()]
                for name in names:
                    coll = db[name]
                    probe = coll.find_one({})
                    if not probe:
                        continue
                    field = next((f for f in ("lesson_id", "quest_id") if f in probe), None)
                    if not field:
                        log.warning("Orphan cleanup: no lesson field found in %s; skipped", name)
                        continue
                    result = coll.delete_many({field: {"$exists": True, "$nin": list(valid)}})
                    log.warning("Orphan cleanup: removed %s orphaned records from %s", result.deleted_count, name)
                client.close()
            except Exception as exc:  # noqa: BLE001
                log.warning("Orphan cleanup failed: %s", exc)

    threading.Thread(target=run, daemon=True).start()


def _purge_all_lessons_once():
    """One-time cleanup: delete every stored lesson so the old five are gone,
    then record that it ran. Already run on the live database in v3."""
    import logging
    import os
    try:
        from pymongo import MongoClient
        client = MongoClient(os.environ["MONGO_URL"], serverSelectionTimeoutMS=8000)
        db = client[os.environ["DB_NAME"]]
        marker = "purge_all_lessons_v3"
        if db.maintenance.find_one({"key": marker}):
            return
        result = db.lessons.delete_many({})
        db.maintenance.insert_one({"key": marker})
        logging.getLogger("sidequest").info("Purged %s stored lessons", result.deleted_count)
        client.close()
    except Exception as exc:
        logging.getLogger("sidequest").warning("Lesson purge skipped: %s", exc)


_purge_all_lessons_once()
_orphan_cleanup_later()
