# Built-in quests. Bump LESSON_LIBRARY_VERSION whenever lessons are added or changed.
LESSON_LIBRARY_VERSION = 20

# The Cartographer lesson and the old Week 1 lessons have been removed.
# The library now starts with the former Week 2 lessons, renumbered as Week 1.
LESSON_LIBRARY = []


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
    """Rewrite Week 2 labels and seed keys as Week 1, throughout a lesson."""
    if isinstance(value, str):
        return (
            value.replace("Week 2", "Week 1")
            .replace("week 2", "week 1")
            .replace("-w02-", "-w01-")
            .replace("_w02_", "_w01_")
            .replace("w02", "w01")
        )
    if isinstance(value, list):
        return [_renumber(v) for v in value]
    if isinstance(value, dict):
        return {k: _renumber(v) for k, v in value.items()}
    return value


def _register_lessons():
    """Load the former Week 2 modules one at a time. A problem in one file is
    logged and skipped, so it can never stop the app from starting."""
    import importlib
    import logging

    log = logging.getLogger("sidequest")
    have = {item.get("seed_key") for item in LESSON_LIBRARY}
    for module_name in ("lesson_library_s2_english_w02_pilot", "lesson_library_s2_english_w02_l2_l3"):
        try:
            module = importlib.import_module(module_name)
            added = 0
            for lesson in _lesson_dicts_in(module):
                lesson = _renumber(lesson)
                if lesson["seed_key"] not in have:
                    LESSON_LIBRARY.append(lesson)
                    have.add(lesson["seed_key"])
                    added += 1
            log.warning("Lesson module %s added %s lessons (renumbered as Week 1)", module_name, added)
        except Exception as exc:  # noqa: BLE001
            log.warning("Lesson module %s not loaded: %r", module_name, exc)


_register_lessons()


def _purge_all_lessons_once():
    """One-time cleanup: delete every stored lesson so the old five are gone,
    then record that it ran. Temporary; remove once it has run on the live database."""
    import logging
    import os
    try:
        from pymongo import MongoClient
        client = MongoClient(os.environ["MONGO_URL"], serverSelectionTimeoutMS=8000)
        db = client[os.environ["DB_NAME"]]
        marker = "purge_all_lessons_v2"
        if db.maintenance.find_one({"key": marker}):
            return
        result = db.lessons.delete_many({})
        db.maintenance.insert_one({"key": marker})
        logging.getLogger("sidequest").info("Purged %s stored lessons", result.deleted_count)
        client.close()
    except Exception as exc:
        logging.getLogger("sidequest").warning("Lesson purge skipped: %s", exc)


_purge_all_lessons_once()
