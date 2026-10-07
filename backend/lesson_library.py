# Built-in quests. Bump LESSON_LIBRARY_VERSION whenever lessons are added or changed.
LESSON_LIBRARY_VERSION = 10

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
        "pass_mark": 0.9,
        "outcome_codes": ["EN2-CWT-01", "EN2-RECOM-01", "EN2-UARL-01", "EN2-VOCAB-01", "EN2-SPELL-01", "EN2-OLC-01"],
        "outcome_notes": {
            "EN2-CWT-01": "Primary outcome. Plans (story planner), writes and revises an imaginative narrative.",
            "EN2-RECOM-01": "Sorts sentences into orientation, complication and resolution, then answers quiz questions 1-5.",
            "EN2-UARL-01": "Builds a suspenseful sentence and explains technique (suspense builder; quiz questions 7-9).",
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
        "prior_knowledge": "Familiar with the idea that stories have characters and a setting. Can write several connected sentences.",
        "explicit_teaching": "Most narratives follow a pattern. The ORIENTATION introduces the character, the setting and the time. The COMPLICATION is the problem that disrupts everything. The RESOLUTION is how the problem is solved.\n\nStrong writers also build ATMOSPHERE, which is the feeling a reader gets, using precise words. 'The path was bad' tells us little. 'The path was treacherous' makes us feel danger.\n\nPrecise words also build SUSPENSE, which is the feeling of wanting to know what happens next. A writer can build suspense by slowing the moment down, for example 'She stepped cautiously onto the bridge, one plank at a time.'",
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
                    {"front": "\U0001F9ED Orientation", "back": "Introduces the character, setting and time."},
                    {"front": "\u26A1 Complication", "back": "The problem that disrupts the story."},
                    {"front": "\U0001F3C1 Resolution", "back": "How the problem is solved."},
                    {"front": "\U0001F32B\uFE0F Atmosphere", "back": "The feeling created by the writer's word choices."},
                    {"front": "\U0001F441\uFE0F Suspense", "back": "The feeling of wanting to know what happens next."},
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
                {"text": "Ada found the book hidden in the mayor's hat, and the bakery reopened.", "answer": 2}
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
            {"key": "hero", "label": "\U0001F9ED Hero", "hint": "Who is your main character? Give them a name and one special trait."},
            {"key": "place", "label": "\U0001F3DE\uFE0F Place", "hint": "Where does your story happen? Describe it in a few words."},
            {"key": "problem", "label": "\u26A1 Problem", "hint": "What goes wrong? This is your complication."},
            {"key": "solution", "label": "\U0001F3C1 Solution", "hint": "How does your hero fix it? This is your resolution."}
        ],
        "steps": [
            {"title": "\U0001F4DC Step 1: Accept the quest", "detail": "Read your mission and accept the quest.", "duration_minutes": 5},
            {"title": "\U0001F4D6 Step 2: Learn the map", "detail": "Read the teaching, flip every Quest Codex card and sort the story sentences.", "duration_minutes": 10},
            {"title": "\U0001F50D Step 3: Decode the craft", "detail": "Watch the two videos, then build a suspenseful sentence and choose precise words.", "duration_minutes": 10},
            {"title": "\U0001F5FA\uFE0F Step 4: Chart your route", "detail": "Fill in your story planner: hero, place, problem and solution.", "duration_minutes": 10},
            {"title": "\u270D\uFE0F Step 5: Write the tale", "detail": "Write your story. Use three precise words and slow down one moment.", "duration_minutes": 15},
            {"title": "\U0001F6E1\uFE0F Step 6: Clear the Quest check", "detail": "Answer the 10-question Quest check. You need 9 out of 10 to pass.", "duration_minutes": 5},
            {"title": "\U0001F3C6 Step 7: Hand it in", "detail": "Proofread, retell your story to a family member and submit your evidence.", "duration_minutes": 5}
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
        "parent_notes": "The quest is a staged sequence: accept the quest, learn the key terms (flip all cards), sort story sentences, watch two short videos with a check question, choose precise words and build a suspenseful sentence, fill in a story planner, write the story, then clear a 10-question Quest check (90%, so 9 out of 10, with retries). Submission is locked until the quiz is passed. The submission text includes the quiz score, the plan and the answer to the response question. Outcomes covered: EN2-CWT-01, EN2-RECOM-01, EN2-UARL-01, EN2-VOCAB-01, EN2-SPELL-01 and EN2-OLC-01. Verify the outcome mapping against the NESA English K-10 syllabus.",
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
