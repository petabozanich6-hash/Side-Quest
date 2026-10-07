# Built-in quests. Bump LESSON_LIBRARY_VERSION whenever lessons are added or changed.
LESSON_LIBRARY_VERSION = 13

LESSON_LIBRARY = [
    {
        "seed_key": "s2-y3-eng-narrative-cartographer-01",
        "library": True,
        "stage": "S2",
        "year_level": "Year 3",
        "learning_area": "English",
        "subject": "Creating written texts: imaginative narrative",
        "title": "The Cartographer's Last Tale",
        "child_mission": "🗺️ A cartographer has vanished, leaving behind one unfinished map and a story with no ending. Learn how stories are built, then write the ending that brings the cartographer home.",
        "duration_minutes": 60,
        "pass_mark": 0.9,
        "outcome_codes": ["EN2-CWT-01", "EN2-RECOM-01", "EN2-UARL-01", "EN2-VOCAB-01", "EN2-SPELL-01", "EN2-OLC-01"],
        "outcome_notes": {
            "EN2-CWT-01": "Primary outcome. Plans (story planner), writes and revises an imaginative narrative.",
            "EN2-RECOM-01": "Learns and sorts orientation, complication and resolution, then answers quiz questions 1-5.",
            "EN2-UARL-01": "Learns and builds suspense, and explains the technique (suspense builder; quiz questions 7-9).",
            "EN2-VOCAB-01": "Chooses precise Tier 2 words such as 'vanished', 'treacherous' and 'cautiously' (word power stage; quiz questions 6 and 10).",
            "EN2-SPELL-01": "Proofreads and explains how they spelled two tricky words (assessed through submitted work).",
            "EN2-OLC-01": "Retells the story aloud to a family member (Storyteller's Table challenge)."
        },
        "learning_intention": "We are learning to plan and write an imaginative story with a clear beginning, problem and ending, using precise words to build atmosphere.",
        "success_criteria": [
            "I can identify the orientation, complication and resolution in a short story.",
            "I can explain one technique an author uses to build suspense or a feeling.",
            "I can plan a story with a character, a setting, a problem and a solution.",
            "I can write a story ending using at least three precise vocabulary words.",
            "I can proofread my writing and explain how I spelled two tricky words.",
            "I can score 90% or more on the Quest check."
        ],
        "key_vocabulary": ["orientation", "complication", "resolution", "atmosphere", "vanished", "treacherous", "cautiously", "suspense"],
        "materials": ["Paper or a device for writing", "Pencil and coloured pencils", "A family member to listen at the end"],
        "prior_knowledge": "No prior knowledge of story structure is assumed. Child can write several connected sentences.",
        "explicit_teaching": "Most narratives follow a pattern. The ORIENTATION introduces the character, the setting and the time. The COMPLICATION is the problem that disrupts everything. The RESOLUTION is how the problem is solved.\n\nStrong writers also build ATMOSPHERE, which is the feeling a reader gets, using precise words. 'The path was bad' tells us little. 'The path was treacherous' makes us feel danger.\n\nPrecise words also build SUSPENSE, which is the feeling of wanting to know what happens next. A writer can build suspense by slowing the moment down, for example 'She stepped cautiously onto the bridge, one plank at a time.'",
        "teach_steps": [
            {
                "icon": "🧭",
                "title": "How a story begins",
                "explain": "Every story starts by telling the reader three things: WHO is in it, WHERE it happens and WHEN it happens.\n\nThis opening part has a special name. It is called the ORIENTATION. It works like the first look at a map: it shows you where you are before the adventure begins.",
                "example": "Long ago, in a tiny village beside a dark forest, a boy named Tom lived with his grandmother.",
                "notice": "Who? Tom. Where? A village beside a dark forest. When? Long ago. That is a complete orientation.",
                "check": {
                    "question": "Which sentence is an orientation?",
                    "options": ["Suddenly, the door slammed shut.", "Once, in a castle on a hill, lived a lonely dragon named Pip.", "And they all lived happily ever after."],
                    "correct_index": 1,
                    "explanation": "Yes! It tells us who (Pip), where (a castle on a hill) and when (once)."
                }
            },
            {
                "icon": "⚡",
                "title": "The problem appears",
                "explain": "Next, something goes wrong. A problem appears that the character has to deal with. This is called the COMPLICATION.\n\nWithout a problem there would be no story, because nothing would happen! Words like 'suddenly', 'one day' and 'but' often warn us that the problem is coming.",
                "example": "One morning, Tom found that the village well had run dry.",
                "notice": "'One morning' tells us something is changing. The problem is that the water has gone.",
                "check": {
                    "question": "Pip loved her castle. But one night a storm blew her treasure away. What is the complication?",
                    "options": ["Pip loved her castle", "A storm blew her treasure away", "Pip is a dragon"],
                    "correct_index": 1,
                    "explanation": "Right! The storm taking the treasure is the problem Pip must solve."
                }
            },
            {
                "icon": "🏁",
                "title": "The problem is solved",
                "explain": "At the end of the story the problem gets solved. This is called the RESOLUTION. The character does something brave or clever and things settle down.\n\nA good resolution fixes the exact problem from the complication. If the well ran dry, the ending must be about getting water back.",
                "example": "Tom followed a tiny stream up the mountain and found a fallen rock blocking it. He pushed the rock aside and the water rushed home.",
                "notice": "The problem was no water, and the ending brings the water back. The ending matches the problem.",
                "check": {
                    "question": "The complication was: a storm blew Pip's treasure away. Which resolution fits?",
                    "options": ["Pip found her treasure in a tree and carried it home.", "Pip had a sandwich for lunch.", "It was a Tuesday."],
                    "correct_index": 0,
                    "explanation": "Yes! The treasure was lost, so the ending finds it again."
                }
            },
            {
                "icon": "🌫️",
                "title": "Making readers feel",
                "explain": "Good writers make readers FEEL something. The feeling of a story is called its ATMOSPHERE.\n\nThey create it with precise words. A precise word paints a clear picture, while a vague word does not. 'Big' is vague, but 'enormous' is precise. One useful precise word is TREACHEROUS, which means dangerous in a hidden way, like thin ice that looks safe.",
                "example": "Vague: The cave was dark.\nPrecise: A cold, silent darkness swallowed the cave.",
                "notice": "'Cold', 'silent' and 'swallowed' make us feel uneasy. The second sentence has atmosphere.",
                "check": {
                    "question": "A path looks safe but is secretly dangerous. Which precise word describes it?",
                    "options": ["treacherous", "cheerful", "tiny"],
                    "correct_index": 0,
                    "explanation": "Treacherous means dangerous in a way you cannot easily see."
                }
            },
            {
                "icon": "👁️",
                "title": "Building suspense",
                "explain": "SUSPENSE is the feeling of NEEDING to know what happens next.\n\nWriters build it by slowing the moment down. Instead of rushing, they show each small step and what the character notices. The reader waits with a pounding heart. The word CAUTIOUSLY, which means with great care, is a handy suspense word.",
                "example": "Fast: She crossed the bridge.\nSlow: She stepped cautiously onto the bridge. One plank creaked. Then another. Far below, the river roared.",
                "notice": "Short sentences and small details slow the moment down, so we feel every step.",
                "check": {
                    "question": "Which version builds more suspense?",
                    "options": ["He opened the door.", "He reached for the handle, held his breath, and opened the door very slowly."],
                    "correct_index": 1,
                    "explanation": "Yes! Slowing the moment down makes the reader wait."
                }
            }
        ],
        "worked_example": "ORIENTATION: Mira, a young mapmaker, lived in a lighthouse at the edge of the sea. COMPLICATION: One morning her teacher had vanished, leaving a half-drawn map with a red circle on it. RESOLUTION: Mira followed the map across the treacherous cliffs and found her teacher safe in a cave, sketching the stars. Notice the technique: the writer slowed the moment down ('She moved cautiously along the cliff, one step at a time') so that we feel the danger.",
        "guided_practice": "Copy the three labels (Orientation, Complication, Resolution) onto your page and write one sentence from the story under each. Underline one precise word that builds atmosphere and write what feeling it creates.",
        "independent_task": "Write your own ending to the Cartographer's story, or invent a new quest of your own. Write at least 8 sentences. Include the orientation, a clear complication and a resolution. Use at least three of the key words and slow down one moment to build suspense.",
        "response_prompt": "Which technique did you use to build suspense or atmosphere, and where in your story can we see it?",
        "self_check": "Does my story have an orientation, a complication and a resolution? Did I use three precise words? Did I slow one moment down? Did I check my spelling?",
        "accessibility_notes": "Allow the story to be dictated or typed. Provide sentence starters for each part. Reduce the required length to 5 sentences if needed.",
        "interactive_activities": [
            {
                "type": "flip_cards",
                "title": "Quest Codex: key terms",
                "cards": [
                    {"front": "🧭 Orientation", "back": "Introduces the character, setting and time."},
                    {"front": "⚡ Complication", "back": "The problem that disrupts the story."},
                    {"front": "🏁 Resolution", "back": "How the problem is solved."},
                    {"front": "🌫️ Atmosphere", "back": "The feeling created by the writer's word choices."},
                    {"front": "👁️ Suspense", "back": "The feeling of wanting to know what happens next."},
                    {"front": "Treacherous", "back": "Dangerous in a way that is not obvious at first."}
                ]
            }
        ],
        "sort_activity": {
            "title": "Story sorter",
            "instructions": "Each sentence comes from a short story. Tap the part of the story it belongs to, then press Check.",
            "buckets": ["Orientation", "Complication", "Resolution"],
            "items": [
                {"text": "Finn, a young sailor, lived in a harbour town where the fog rolled in every morning.", "answer": 0},
                {"text": "One night, the harbour lantern vanished from the dock.", "answer": 1},
                {"text": "At last, Finn carried the lantern home and the harbour glowed again.", "answer": 2},
                {"text": "Long ago, in a forest village, lived a girl named Ada who loved baking.", "answer": 0},
                {"text": "Suddenly the bakery's secret recipe book disappeared.", "answer": 1},
                {"text": "Ada found the book hidden in the mayor's hat, and the bakery reopened.", "answer": 2},
                {"text": "In a snowy mountain camp, a young climber named Zara tied her boots each dawn.", "answer": 0},
                {"text": "But when the storm hit, the only rope snapped in two.", "answer": 1}
            ]
        },
        "word_challenges": [
            {"question": "The cave was ___ and silent, so Mira felt uneasy.", "options": ["nice", "gloomy", "big"], "correct_index": 1, "explanation": "Gloomy creates a dark, uneasy feeling."},
            {"question": "Mira walked ___ across the old bridge so she would not slip.", "options": ["quickly", "cautiously", "loudly"], "correct_index": 1, "explanation": "Cautiously means with great care."},
            {"question": "Her teacher had ___, leaving only a half-drawn map.", "options": ["vanished", "arrived", "laughed"], "correct_index": 0, "explanation": "Vanished means disappeared suddenly."},
            {"question": "The ___ cliff path made her heart pound.", "options": ["pretty", "short", "treacherous"], "correct_index": 2, "explanation": "Treacherous means dangerous in a hidden way."}
        ],
        "suspense_builder": {
            "title": "Suspense builder",
            "instructions": "Make this sentence build suspense. Choose the best piece for each gap.",
            "template": ["Mira ", 0, " onto the old bridge, ", 1, ", while ", 2, "."],
            "slots": [
                {"options": ["ran", "stepped cautiously", "skipped"], "correct": 1},
                {"options": ["feeling happy", "one plank at a time", "very quickly"], "correct": 1},
                {"options": ["the river roared far below", "it was a bridge", "she ate lunch"], "correct": 0}
            ],
            "success": "That is suspense! You slowed the moment down and added a danger clue."
        },
        "planner_fields": [
            {"key": "hero", "label": "🧭 Hero", "hint": "Who is your main character? Give them a name and one special trait."},
            {"key": "place", "label": "🏞️ Place", "hint": "Where does your story happen? Describe it in a few words."},
            {"key": "problem", "label": "⚡ Problem", "hint": "What goes wrong? This is your complication."},
            {"key": "solution", "label": "🏁 Solution", "hint": "How does your hero fix it? This is your resolution."}
        ],
        "steps": [
            {"title": "📜 Step 1: Accept the quest", "detail": "Read your mission and accept the quest.", "duration_minutes": 5},
            {"title": "📖 Step 2: Learn the map", "detail": "Five short lessons: orientation, complication, resolution, atmosphere and suspense. Each has an example and a quick try.", "duration_minutes": 15},
            {"title": "🔍 Step 3: Practise the craft", "detail": "Sort story sentences, watch the two videos, then choose precise words and build a suspenseful sentence.", "duration_minutes": 10},
            {"title": "🗺️ Step 4: Chart your route", "detail": "Fill in your story planner: hero, place, problem and solution.", "duration_minutes": 5},
            {"title": "✍️ Step 5: Write the tale", "detail": "Write your story. Use three precise words and slow down one moment.", "duration_minutes": 15},
            {"title": "🛡️ Step 6: Clear the Quest check", "detail": "Answer the 10-question Quest check. You need 9 out of 10 to pass.", "duration_minutes": 5},
            {"title": "🏆 Step 7: Hand it in", "detail": "Proofread, retell your story to a family member and submit your evidence.", "duration_minutes": 5}
        ],
        "resources": [
            {
                "type": "video",
                "title": "What is a narrative? Orientation, complication and resolution",
                "url": "https://www.youtube.com/watch?v=0NESGqweSwI",
                "embed_url": "https://www.youtube-nocookie.com/embed/0NESGqweSwI",
                "prompt": "Watch for the parts of a narrative. Then answer the question below.",
                "offline_alternative": "Re-read the worked example and label the orientation, complication and resolution.",
                "check": {
                    "question": "In a story, which part is the problem that disrupts everything?",
                    "options": ["Orientation", "Resolution", "Complication"],
                    "correct_index": 2,
                    "explanation": "Yes! The complication is the problem."
                }
            },
            {
                "type": "video",
                "title": "Pixar in a Box: Introduction to storytelling (Khan Academy)",
                "url": "https://www.youtube.com/watch?v=1rMnzNZkIX0",
                "embed_url": "https://www.youtube-nocookie.com/embed/1rMnzNZkIX0",
                "prompt": "Pixar's storytellers say a story is meant to make the audience feel something.",
                "offline_alternative": "Think of a film you love and describe the feeling it gave you and why.",
                "check": {
                    "question": "Which feeling do you want YOUR readers to have at the end of your story?",
                    "options": ["Excited", "Relieved", "Surprised", "Proud"],
                    "explanation": "Great choice. Keep that feeling in mind as you write."
                }
            },
            {
                "type": "article",
                "title": "How to create a character for a story (BBC Bitesize)",
                "url": "https://www.bbc.co.uk/bitesize/articles/zd72scw"
            }
        ],
        "quiz": [
            {
                "question": "Which part of a story introduces the character, setting and time?",
                "type": "multiple_choice",
                "options": ["Resolution", "Orientation", "Complication", "Atmosphere"],
                "correct_index": 1,
                "explanation": "Look at the Quest Codex card for orientation. It tells us who, where and when."
            },
            {
                "question": "What is a complication in a story?",
                "type": "multiple_choice",
                "options": ["The ending of the story", "A list of characters", "The problem that disrupts the story", "The title"],
                "correct_index": 2,
                "explanation": "The complication is the problem the character has to deal with."
            },
            {
                "question": "What happens in the resolution of a story?",
                "type": "multiple_choice",
                "options": ["The problem is introduced", "The characters are described", "We learn where the story is set", "The problem is solved"],
                "correct_index": 3,
                "explanation": "The resolution is how the problem is solved at the end."
            },
            {
                "question": "Which sentence is the ORIENTATION of a story?",
                "type": "multiple_choice",
                "options": [
                    "Mira, a young mapmaker, lived in a lighthouse at the edge of the sea.",
                    "One morning her teacher had vanished.",
                    "At last she found her teacher safe in a cave.",
                    "The path was treacherous."
                ],
                "correct_index": 0,
                "explanation": "The orientation introduces the character and the setting."
            },
            {
                "question": "Which sentence shows the COMPLICATION?",
                "type": "multiple_choice",
                "options": [
                    "Long ago, a small village sat beside a quiet river.",
                    "Suddenly the bridge collapsed and the villagers were trapped.",
                    "In the end, everyone was rescued and the bridge was rebuilt.",
                    "Finn loved to draw maps of the village."
                ],
                "correct_index": 1,
                "explanation": "The complication is the sudden problem that disrupts the story."
            },
            {
                "question": "Which word best builds a feeling of hidden danger? 'The path along the cliff was ___.'",
                "type": "multiple_choice",
                "options": ["nice", "long", "treacherous", "big"],
                "correct_index": 2,
                "explanation": "Treacherous suggests danger that is not obvious at first."
            },
            {
                "question": "What does 'suspense' mean?",
                "type": "multiple_choice",
                "options": [
                    "A funny part of a story",
                    "The wish to know what happens next",
                    "The title of a story",
                    "The last sentence"
                ],
                "correct_index": 1,
                "explanation": "Suspense is the feeling of wanting to know what happens next."
            },
            {
                "question": "Which technique builds suspense by slowing the moment down?",
                "type": "multiple_choice",
                "options": [
                    "She crossed the bridge.",
                    "She stepped cautiously onto the bridge, one plank at a time.",
                    "The bridge was there.",
                    "Bridges are made of wood."
                ],
                "correct_index": 1,
                "explanation": "Describing each small step slows the moment, so the reader feels the danger."
            },
            {
                "question": "Which sentence builds the strongest atmosphere?",
                "type": "multiple_choice",
                "options": [
                    "The cave was dark.",
                    "A cold, silent darkness swallowed the cave.",
                    "There was a cave.",
                    "The cave was a cave."
                ],
                "correct_index": 1,
                "explanation": "Precise words like 'cold', 'silent' and 'swallowed' create a feeling."
            },
            {
                "question": "What does 'cautiously' mean?",
                "type": "multiple_choice",
                "options": ["Very fast", "Very loudly", "With great care", "Without looking"],
                "correct_index": 2,
                "explanation": "Cautiously means carefully, to avoid danger."
            }
        ],
        "reflection_prompts": ["Which part of your story are you proudest of, and why?", "What would you change if you wrote a second draft?"],
        "evidence_instructions": "Upload a photo or typed copy of your finished story. Highlight your three precise words and the moment where you built suspense.",
        "parent_notes": "The quest teaches from scratch, one idea at a time. Five mini lessons (orientation, complication, resolution, atmosphere and suspense) each give an explanation, a worked example and a quick check before the next unlocks. Then the child flips key-term cards, sorts story sentences (shuffled each visit), watches two short videos with a check question, chooses precise words (options also shuffled) and builds a suspenseful sentence. They then fill in a story planner, write the story and clear a 10-question Quest check (90%, so 9 out of 10, with retries). Submission is locked until the quiz is passed. The submission text includes the quiz score, the plan and the answer to the response question. Outcomes covered: EN2-CWT-01, EN2-RECOM-01, EN2-UARL-01, EN2-VOCAB-01, EN2-SPELL-01 and EN2-OLC-01. Verify the outcome mapping against the NESA English K-10 syllabus.",
        "source_note": "Outcome codes are from the NSW English K-10 Syllabus (NESA 2022), Stage 2. Parent to verify alignment against the NESA website.",
        "offline_alternative": "Hand-write the story on paper and draw the route map instead of using a device. The videos can be skipped if the worked example is read aloud.",
        "extension": "Write a second ending in a different mood, such as humorous instead of tense, and compare how word choice changes the atmosphere.",
        "follow_up_challenges": [
            {
                "title": "The Lost Page",
                "description": "Write the missing middle of the story: what happened to Mira between the lighthouse and the cave?",
                "type": "create",
                "difficulty": "medium",
                "evidence_type": "photo"
            },
            {
                "title": "Storyteller's Table",
                "description": "Tell your story aloud to a family member without reading it. Ask which moment built the most suspense.",
                "type": "speak",
                "difficulty": "medium",
                "evidence_type": "audio"
            },
            {
                "title": "Craft Spotter",
                "description": "Find a technique for building suspense in a book you are reading. Copy the sentence and explain why it works.",
                "type": "investigation",
                "difficulty": "stretch",
                "evidence_type": "photo"
            }
        ]
    }
]

from lesson_library_s2_english_w1_w2 import WEEK_1  # noqa: E402

LESSON_LIBRARY.extend(WEEK_1)


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


def _register_week2():
    """Load Week 2 modules one at a time. A problem in one file is logged and
    skipped, so it can never stop the app from starting."""
    import importlib
    import logging

    log = logging.getLogger("sidequest")
    have = {item.get("seed_key") for item in LESSON_LIBRARY}
    for module_name in ("lesson_library_s2_english_w02_pilot", "lesson_library_s2_english_w02_l2_l3"):
        try:
            module = importlib.import_module(module_name)
            added = 0
            for lesson in _lesson_dicts_in(module):
                if lesson["seed_key"] not in have:
                    LESSON_LIBRARY.append(lesson)
                    have.add(lesson["seed_key"])
                    added += 1
            log.warning("Week 2 module %s added %s lessons", module_name, added)
        except Exception as exc:  # noqa: BLE001
            log.warning("Week 2 module %s not loaded: %r", module_name, exc)


_register_week2()

# The Week 1 module also changes the version when it is imported. Set the final
# value here, after every import, so this always wins and forces a re-seed.
LESSON_LIBRARY_VERSION = max(LESSON_LIBRARY_VERSION, 15) + 1


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
