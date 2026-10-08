# Built-in quests. Bump LESSON_LIBRARY_VERSION whenever lessons are added or changed.
LESSON_LIBRARY_VERSION = 70

# All previous lessons have been cleared so the library can be rebuilt from scratch.
# Finished Stage 4 lesson files named lesson_library_s4_<subject>_wNN_lN.py are found automatically
# and loaded before the listed modules, so a new finished lesson only needs its own file.
# Other modules are listed in LESSON_MODULES below as they are written.
# Placeholder lesson sets (lesson_library_*_placeholders.py) are NOT registered here, so they do not
# appear on the live site. The files stay in the repo as a build reference.
# Renumbering has been removed: lessons keep the week numbers they are written with.
LESSON_LIBRARY = []

LESSON_MODULES = (
    "lesson_library_s2_english_w01_l1",
    "lesson_library_s2_english_w01_l2",
    "lesson_library_s2_english_w01_l3",
    "lesson_library_s2_english_w01_l4",
    "lesson_library_s2_english_w02_l1",
    "lesson_library_s2_english_w02_l2",
    "lesson_library_s2_english_w02_l3",
    "lesson_library_s2_english_w02_l4",
    "lesson_library_s2_english_w03_l1",
    "lesson_library_s2_english_w03_l2",
    "lesson_library_s2_english_w03_l3",
    "lesson_library_s2_english_w03_l4",
    "lesson_library_s2_english_w04_l1",
    "lesson_library_s2_english_w04_l2",
    "lesson_library_s2_english_w04_l3",
    "lesson_library_s2_english_w04_l4",
    "lesson_library_s2_english_w05_l1",
    "lesson_library_s2_english_w05_l2",
    "lesson_library_s2_english_w05_l3",
    "lesson_library_s2_english_w05_l4",
    "lesson_library_s2_english_w06_l1",
)


def _discover_finished_s4():
    import glob
    import os
    import re
    here = os.path.dirname(os.path.abspath(__file__))
    pattern = re.compile(r"^lesson_library_s4_[a-z_]+_w\d{2}_l\d+\.py$")
    names = []
    for path in sorted(glob.glob(os.path.join(here, "lesson_library_s4_*.py"))):
        base = os.path.basename(path)
        if pattern.match(base):
            names.append(base[:-3])
    return tuple(names)


def _lesson_dicts_in(module):
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
    import importlib
    import logging
    log = logging.getLogger("sidequest")
    have = {item.get("seed_key") for item in LESSON_LIBRARY}
    finished = _discover_finished_s4()
    ordered = list(finished) + [m for m in LESSON_MODULES if m not in finished]
    for module_name in ordered:
        try:
            module = importlib.import_module(module_name)
            added = 0
            for lesson in _lesson_dicts_in(module):
                if lesson["seed_key"] not in have:
                    LESSON_LIBRARY.append(lesson)
                    have.add(lesson["seed_key"])
                    added += 1
            log.warning("Lesson module %s added %s lessons", module_name, added)
        except Exception as exc:
            log.warning("Lesson module %s not loaded: %r", module_name, exc)


_register_lessons()


def _attach_spelling():
    import logging
    log = logging.getLogger("sidequest")
    try:
        from spelling_live import apply_spelling
        apply_spelling(LESSON_LIBRARY)
        count = len([item for item in LESSON_LIBRARY if item.get("spelling")])
        log.warning("Spelling segment attached to %s lessons", count)
    except Exception as exc:
        log.warning("Spelling segments not attached: %r", exc)


_attach_spelling()


def _orphan_cleanup_later():
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
            except Exception as exc:
                log.warning("Orphan cleanup failed: %s", exc)
    threading.Thread(target=run, daemon=True).start()


def _purge_all_lessons_once():
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
