# Built-in quests. Bump LESSON_LIBRARY_VERSION whenever lessons are added or changed.
LESSON_LIBRARY_VERSION = 7

LESSON_LIBRARY = [
    {
        "seed_key": "s2-y3-eng-narrative-cartographer-01",
        "library": True,
        "stage": "S2",
        "year_level": "Year 3",
        "learning_area": "English",
        "subject": "Creating written texts: imaginative narrative",
        "title": "The Cartographer's Last Tale",
        "child_mission": "\U0001F5FA\uFE0F A cartographer has vanished, leaving behind one unfinished map and a story with no ending. Study how stories are built, then write the ending that brings the cartographer home.",
        "duration_minutes": 60,
        "outcome_codes": ["EN2-CWT-01", "EN2-RECOM-01", "EN2-UARL-01", "EN2-VOCAB-01", "EN2-SPELL-01", "EN2-OLC-01"],
        "outcome_notes": {
            "EN2-CWT-01": "Primary outcome. Plans, writes and revises an imaginative narrative (Steps 4-6).",
            "EN2-RECOM-01": "Reads a model story and identifies its structure: orientation, complication, resolution (Steps 2-3).",
            "EN2-UARL-01": "Explains how the author builds tension or a feeling, then uses a similar technique in their own story (Steps 3 and 5).",
            "EN2-VOCAB-01": "Learns and uses precise Tier 2 words such as 'vanished', 'treacherous' and 'cautiously' (Steps 1 and 5).",
            "EN2-SPELL-01": "Proofreads and explains how they spelled two tricky words (Step 6).",
            "EN2-OLC-01": "Retells the story aloud to a family member (Step 7)."
        },
        "learning_intention": "We are learning to plan and write an imaginative story with a clear beginning, problem and ending, using precise words to build atmosphere.",
        "success_criteria": [
            "I can identify the orientation, complication and resolution in a short story.",
            "I can explain one technique an author uses to build suspense or a feeling.",
            "I can plan a story with a character, a setting, a problem and a solution.",
            "I can write a story ending using at least three precise vocabulary words.",
            "I can proofread my writing and explain how I spelled two tricky words."
        ],
        "key_vocabulary": ["orientation", "complication", "resolution", "atmosphere", "vanished", "treacherous", "cautiously", "suspense"],
        "materials": ["Paper or a device for writing", "Pencil and coloured pencils", "A short story to read (provided below, or any adventure story from home)", "A family member to listen at the end"],
        "prior_knowledge": "Familiar with the idea that stories have characters and a setting. Can write several connected sentences.",
        "explicit_teaching": "Most narratives follow a pattern. The ORIENTATION introduces the character, the setting and the time. The COMPLICATION is the problem that disrupts everything. The RESOLUTION is how the problem is solved. Strong writers also build ATMOSPHERE, which is the feeling a reader gets, using precise words. 'The path was bad' tells us little. 'The path was treacherous' makes us feel danger. Precise words also build SUSPENSE, which is the feeling of wanting to know what happens next. A writer can build suspense by slowing the moment down, for example 'She stepped cautiously onto the bridge, one plank at a time.'",
        "worked_example": "Read this short story. ORIENTATION: Mira, a young mapmaker, lived in a lighthouse at the edge of the sea. COMPLICATION: One morning her teacher had vanished, leaving a half-drawn map with a red circle on it. RESOLUTION: Mira followed the map across the treacherous cliffs and found her teacher safe in a cave, sketching the stars. Now notice the technique: the writer slowed the moment down ('She moved cautiously along the cliff, one step at a time') so that we feel the danger. That is how suspense is built.",
        "guided_practice": "Read the worked example again. Copy the three labels (Orientation, Complication, Resolution) onto your page and write one sentence from the story under each. Then underline one precise word that builds atmosphere and write what feeling it creates. Finally, find one place where the writer slows the moment down and explain how it builds suspense.",
        "independent_task": "Write your own ending to the Cartographer's story, or invent a new quest of your own. Plan first: character, setting, problem, solution. Then write at least 8 sentences. Include the orientation, a clear complication and a resolution. Use at least three of the vocabulary words and slow down one moment to build suspense.",
        "response_prompt": "Which technique did you use to build suspense or atmosphere, and where in your story can we see it?",
        "self_check": "Does my story have an orientation, a complication and a resolution? Did I use three precise words? Did I slow one moment down? Did I check my spelling?",
        "accessibility_notes": "Allow the story to be dictated or typed. Provide sentence starters for each part. Reduce the required length to 5 sentences if needed.",
        "interactive_activities": [
            {
                "type": "flip_cards",
                "title": "Quest Codex: key terms",
                "cards": [
                    {"front": "\U0001F9ED Orientation", "back": "Introduces the character, setting and time."},
                    {"front": "\u26A1 Complication", "back": "The problem that disrupts the story."},
                    {"front": "\U0001F3C1 Resolution", "back": "How the problem is solved."},
                    {"front": "\U0001F32B\uFE0F Atmosphere", "back": "The feeling created by the writer's word choices."},
                    {"front": "\U0001F441\uFE0F Suspense", "back": "The feeling of wanting to know what happens next."},
                    {"front": "Treacherous", "back": "Dangerous in a way that is not obvious at first."}
                ]
            }
        ],
        "steps": [
            {"title": "\U0001F4DC Step 1: Accept the quest", "detail": "Read your mission. Say each Quest Codex word aloud and use two of them in a spoken sentence.", "duration_minutes": 5},
            {"title": "\U0001F4D6 Step 2: Study the map", "detail": "Read the worked example and label the orientation, complication and resolution.", "duration_minutes": 10},
            {"title": "\U0001F50D Step 3: Decode the craft", "detail": "Watch the two videos in Resources, then find the technique the writer used to build suspense.", "duration_minutes": 10},
            {"title": "\U0001F5FA\uFE0F Step 4: Chart your route", "detail": "Plan your story: character, setting, problem and solution. A simple map or storyboard works well.", "duration_minutes": 10},
            {"title": "\u270D\uFE0F Step 5: Write the tale", "detail": "Write your story. Use three precise words and slow down one moment.", "duration_minutes": 15},
            {"title": "\U0001F6E1\uFE0F Step 6: Proof your work", "detail": "Reread aloud, fix spelling and punctuation, and note how you spelled two tricky words.", "duration_minutes": 5},
            {"title": "\U0001F3C6 Step 7: Return with the story", "detail": "Read or retell your story to a family member, complete the quiz and upload your evidence.", "duration_minutes": 5}
        ],
        "resources": [
            {
                "type": "video",
                "title": "Pixar in a Box: Introduction to storytelling (Khan Academy)",
                "url": "https://www.khanacademy.org/computing/pixar/storytelling/we-are-all-storytellers/v/storytelling-introb"
            },
            {
                "type": "video",
                "title": "Story structure (BBC Bitesize)",
                "url": "https://www.bbc.co.uk/bitesize/topics/zbh9fdm"
            },
            {
                "type": "article",
                "title": "How to create a character for a story (BBC Bitesize)",
                "url": "https://www.bbc.co.uk/bitesize/articles/zd72scw"
            },
            {
                "type": "practice",
                "title": "The elements of a story (Khan Academy, Grade 3)",
                "url": "https://www.khanacademy.org/ela/cc-3rd-reading-vocab/xaf0c1b5d7010608e:cc-3rd-homes"
            }
        ],
        "quiz": [
            {
                "question": "Which part of a story introduces the character, setting and time?",
                "type": "multiple_choice",
                "options": ["Resolution", "Orientation", "Complication", "Atmosphere"],
                "correct_index": 1,
                "explanation": "The orientation introduces who, where and when."
            },
            {
                "question": "What is a complication?",
                "type": "multiple_choice",
                "options": ["The ending of the story", "The problem that disrupts the story", "A list of characters", "The title"],
                "correct_index": 1,
                "explanation": "The complication is the problem the character has to deal with."
            },
            {
                "question": "Which word best builds a sense of danger? 'The path was ___.'",
                "type": "multiple_choice",
                "options": ["nice", "treacherous", "big", "long"],
                "correct_index": 1,
                "explanation": "Treacherous suggests hidden danger, which builds atmosphere."
            },
            {
                "question": "Describe one way a writer can build suspense.",
                "type": "short_answer",
                "sample_answer": "The writer can slow the moment down by describing each small step, such as 'She stepped cautiously onto the bridge, one plank at a time.'",
                "marking_guide": "Accept any valid technique: slowing the moment, precise words, short sentences, withholding information."
            }
        ],
        "reflection_prompts": ["Which part of your story are you proudest of, and why?", "What would you change if you wrote a second draft?"],
        "evidence_instructions": "Upload a photo or typed copy of your story plan and finished story. Highlight your three precise words and the moment where you built suspense.",
        "parent_notes": "This quest develops narrative writing (EN2-CWT-01) alongside reading structure (EN2-RECOM-01), how authors shape ideas (EN2-UARL-01), vocabulary (EN2-VOCAB-01), spelling strategies (EN2-SPELL-01) and spoken retelling (EN2-OLC-01). Ask your child to point out the orientation, complication and resolution, and to read the ending aloud. Verify the outcome mapping against the NESA English K-10 syllabus.",
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
