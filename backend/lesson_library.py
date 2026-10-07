# Built-in quests. Bump LESSON_LIBRARY_VERSION whenever lessons are added or changed.
# The library is intentionally EMPTY while the programme is rebuilt from the beginning.
# All earlier English and Maths lesson files are still in the repo (and in git history)
# but are no longer registered. To bring a lesson back, add its module to _register_lessons.
LESSON_LIBRARY_VERSION = 38

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


def _register_lessons():
    """Load lesson modules one at a time. A problem in one file is logged and
    skipped, so it can never stop the app from starting. The list is empty on purpose."""
    import importlib
    import logging

    log = logging.getLogger("sidequest")
    have = {item.get("seed_key") for item in LESSON_LIBRARY}
    modules = ()
    for module_name in modules:
        try:
            module = importlib.import_module(module_name)
            added = 0
            for lesson in _lesson_dicts_in(module):
                if lesson["seed_key"] not in have:
                    LESSON_LIBRARY.append(lesson)
                    have.add(lesson["seed_key"])
                    added += 1
            log.warning("Lesson module %s added %s lessons", module_name, added)
        except Exception as exc:  # noqa: BLE001
            log.warning("Lesson module %s not loaded: %r", module_name, exc)


_register_lessons()


def _orphan_cleanup_later():
    """After the app has started, delete any assignment whose lesson no longer
    exists. Those are the blank cards on the child page. It only acts when it can
    positively identify the lesson id field and the assignment collection, and it
    logs everything it does."""
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
    """One-time cleanup: delete every stored lesson so the old ones are gone,
    then record that it ran. v3 ran earlier; v4 clears the English and Maths
    lessons built since, so the programme can start again."""
    import logging
    import os
    try:
        from pymongo import MongoClient
        client = MongoClient(os.environ["MONGO_URL"], serverSelectionTimeoutMS=8000)
        db = client[os.environ["DB_NAME"]]
        marker = "purge_all_lessons_v4"
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
