# Built-in lesson content has been removed so lessons can be rebuilt from scratch.
# Bump the version when adding new lessons.
LESSON_LIBRARY_VERSION = 6

LESSON_LIBRARY = []


def _purge_all_lessons_once():
    """One-time cleanup: delete every stored lesson, then record that it ran.
    Temporary; remove once it has run on the live database."""
    import logging
    import os
    try:
        from pymongo import MongoClient
        client = MongoClient(os.environ["MONGO_URL"], serverSelectionTimeoutMS=8000)
        db = client[os.environ["DB_NAME"]]
        marker = "purge_all_lessons_v1"
        if db.maintenance.find_one({"key": marker}):
            return
        result = db.lessons.delete_many({})
        db.maintenance.insert_one({"key": marker})
        logging.getLogger("sidequest").info("Purged %s stored lessons", result.deleted_count)
        client.close()
    except Exception as exc:
        logging.getLogger("sidequest").warning("Lesson purge skipped: %s", exc)


_purge_all_lessons_once()
