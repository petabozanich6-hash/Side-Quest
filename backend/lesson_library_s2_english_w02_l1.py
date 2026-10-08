"""Stage 2 English, Week 2 Lesson 1: Story Elements, character, setting and plot (Reading and comprehension).
Built to the standard in docs/LESSON_BUILD_GUIDE.md. All written work is typed inside the lesson.
Spelling is attached here so the lesson is self-contained.
Video: none yet. The video and link run will add one that has been fetched and checked.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc
from spelling_s2_w1 import _w, _c

WORDS = ["train", "away", "green", "beach", "boat", "dream"]

PASSAGE = (
    "The Green Sail\n\n"
    "On a grey, rainy Saturday, Leo stood on the beach of a small seaside town. Today was the day of the boat race, and his little wooden boat, the Dream, was ready. "
    "Then he saw the problem. The wind had torn a big hole in the sail. Leo felt his heart sink. 'I cannot race now,' he said.\n\n"
    "His grandpa did not give up. 'Let's think,' he said. Leo looked at his green raincoat. Together they cut a large square from it and stitched it over the hole. "
    "Just in time, the Dream floated to the start line. It did not win, but it finished the race, and Leo grinned from ear to ear."
)

LESSON = build(
    "s2-eng-w02-l1-story-elements",
    "Story Elements: Character, Setting and Plot",
    "Every story is built from the same three parts: who it is about, where and when it happens, and what happens. Learn to spot character, setting and plot, and use evidence from the text to explain them.",
    "Reading and comprehension: story elements",
    ["EN2-RECOM-01", "EN2-VOCAB-01", "EN2-SPELL-01"],
    {
        "EN2-RECOM-01": "Primary. Identifies character, setting and plot in a narrative and supports answers with evidence from the text.",
        "EN2-VOCAB-01": "Uses words such as character, setting, plot, problem and resolution to talk about stories.",
        "EN2-SPELL-01": "Spells words with the vowel teams ai, ay, ee, ea and oa (week 2 spelling focus).",
    },
    "We are learning to find the character, setting and plot of a story and to prove our answers with evidence.",
    [
        "I can name the characters in a story and describe them.",
        "I can describe the setting: where and when a story happens.",
        "I can say what the problem and the resolution are.",
        "I can retell the main events of a plot in order.",
        "I can use evidence from the text to support my answers.",
        "I can spell words with the vowel teams ai, ay, ee, ea and oa.",
    ],
    ["character", "setting", "plot", "problem", "resolution", "evidence", "narrative", "trait"],
    ["This lesson (everything you need is inside it)"],
    "Child can read a short story and answer simple questions about it.",
    (
        "Why this matters. When you can see how a story is built, you understand it more deeply and remember it better. Authors are like builders, and character, setting and plot are their three main materials. Knowing them also helps you write your own stories, which is where this unit is heading.\n\n"
        "The three elements. A narrative is a story. The characters are the people or animals in it. The setting is where and when the story takes place. The plot is the series of events: it usually begins by introducing the characters and setting, then a problem happens, events try to solve it, and finally there is a resolution, which is how the problem is solved.\n\n"
        "Where do the clues come from? Never guess. For characters, look at what they say, what they do and how they feel, because these show their traits, which are describing words for what kind of person they are. For setting, look for place words, time words and weather words. For plot, look for the moment the problem appears, usually shown by words such as 'but', 'then' or 'suddenly', and for the moment it is solved. When you answer a question, point to the words in the text. That is your evidence.\n\n"
        "The routine. 1. Read the story once for enjoyment. 2. Read again and underline who, where, when. 3. Find the problem and the resolution. 4. List the main events in order. 5. For every answer, find the words in the text that prove it.\n\n"
        "Reading and writing work together. A writer plans a character, a setting and a problem before writing a word. Next week you will use these same three parts to plan a story of your own, so notice how this author used them.\n\n"
        "A quick demonstration. 'The wind had torn a big hole in the sail.' That is the problem. 'Leo felt his heart sink' shows he is upset. The evidence for his feeling is the words 'heart sink'. A good reader always knows where the words are that prove an answer."
    ),
    [
        _step(
            "1", "What is a narrative?",
            "A narrative is a story. Stories can be made up or true, and they are told to entertain us, move us or teach us something. Every narrative has characters, a setting and a plot.\n\n"
            "If you can find these three parts, you understand the shape of the story.",
            "'The Green Sail' is a narrative. It has a boy and his grandpa, a rainy beach town, and a problem with a boat.",
            "A narrative is a story with characters, setting and plot.",
            ("What is a narrative?", ["A list of facts", "A story", "A poster"], 1, "A narrative is a story."),
        ),
        _step(
            "2", "Character",
            "Characters are the people or animals in a story. The main character is the one the story is mostly about. You learn about characters from what they say, what they do and how they feel.\n\n"
            "A trait describes what a character is like, such as brave, kind, clever or determined.",
            "Leo is the main character. His grandpa 'did not give up', which shows he is patient and determined.",
            "Characters show who they are by what they say, do and feel.",
            ("What is a trait?", ["A place in a story", "A word describing what a character is like", "The end of a story"], 1, "A trait describes what a character is like."),
        ),
        _step(
            "3", "Setting",
            "The setting is where and when the story happens. Look for place words, time words and weather words. The setting can change the mood of a story.\n\n"
            "Ask: where are the characters, and what time or season is it?",
            "'On a grey, rainy Saturday' and 'on the beach of a small seaside town' tell us the time, the weather and the place.",
            "Setting is where and when, so look for place, time and weather words.",
            ("Which detail is part of the setting?", ["Leo felt his heart sink", "A rainy Saturday", "His grandpa did not give up"], 1, "A rainy Saturday tells us when and what the weather is like."),
        ),
        _step(
            "4", "Plot: problem and resolution",
            "The plot is what happens. Most plots begin with an introduction, then a problem, then events that try to fix it, then a resolution when the problem is solved.\n\n"
            "Words such as 'but', 'then' and 'suddenly' often signal the problem.",
            "Problem: the sail has a hole. Resolution: they patch it with Leo's green raincoat and the boat finishes the race.",
            "The plot has a problem and a resolution.",
            ("What is a resolution?", ["How the problem is solved", "Where the story happens", "Who the story is about"], 0, "A resolution is how the problem is solved."),
        ),
        _step(
            "5", "Put the events in order",
            "Retelling a plot means listing the main events in the order they happened. Use words such as first, then, next and finally. Only include important events, not every detail.\n\n"
            "If your list makes sense on its own, you have understood the plot.",
            "First, Leo is ready for the race. Then he sees the hole. Next, Grandpa and Leo cut his raincoat. Finally, the boat finishes the race.",
            "Retell the plot with first, then, next and finally.",
            ("Which word starts a retelling?", ["Finally", "First", "Next"], 1, "First begins a retelling."),
        ),
        _step(
            "6", "Spelling focus: vowel teams",
            "This week's spelling focus is vowel teams: two vowels that work together to make one sound. The vowel team ai is in train, ay is in away, ee is in green, ea is in beach and dream, and oa is in boat.\n\n"
            "Notice where the team sits. 'ay' is at the end of a word, and 'ai' is in the middle.",
            "tr-ai-n, a-w-ay, gr-ee-n, b-ea-ch, b-oa-t, dr-ea-m.",
            "Spot the vowel team and spell it as one sound.",
            ("Which vowel team is in 'boat'?", ["ea", "oa", "ai"], 1, "boat has the vowel team oa."),
        ),
        _step(
            "7", "Prove it with evidence",
            "Evidence is the exact words in the text that prove your answer. Say your answer, then say 'I know this because the text says...' and point to the words.\n\n"
            "An answer with evidence is stronger than an answer on its own.",
            "Leo is disappointed. Evidence: 'Leo felt his heart sink.'",
            "Always point to the words that prove your answer.",
            ("What is evidence?", ["Words in the text that prove an answer", "A guess", "A picture"], 0, "Evidence is the words in the text that support your answer."),
        ),
    ],
    (
        "Work through the first paragraph of 'The Green Sail' together. Characters: Leo is mentioned first, so he is the main character. Setting: 'a grey, rainy Saturday', 'the beach of a small seaside town' (when, weather, place). Plot so far: the day of the boat race has arrived and the boat is ready. Then comes 'but', or really 'Then he saw the problem': the wind has torn a hole in the sail. "
        "How does Leo feel? The evidence is 'Leo felt his heart sink' and 'I cannot race now'. What trait does he show at the start? Disappointed. Later he grins from ear to ear, so he ends the story happy and proud. "
        "Notice that Grandpa is a character too. He says 'Let's think', which shows he is calm and helpful. "
        "Now retell the plot: first, Leo is ready to race. Then the sail is torn. Next, Grandpa helps him patch it with the raincoat. Finally, the boat finishes the race."
    ),
    (
        "Type your answers in the practice boxes.\n"
        "Part A, story map: read 'The Green Sail' in the main task and type the characters, the setting (where and when), the problem and the resolution.\n"
        "Part B, trait and evidence: type one trait for Leo and one trait for his grandpa, each with evidence from the story.\n"
        "Part C, retell: type the plot in four sentences using first, then, next and finally.\n"
        "Part D, vowel teams: underline or type the vowel team in each word: train, away, green, beach, boat, dream.\n"
        "Your parent can check your answers against the answer key."
    ),
    (
        "Read this story and then show that you understand how it is built. Everything you write goes in the boxes.\n\n" + PASSAGE + "\n\n"
        "Stage 1 (characters): type the characters and one trait for each, with evidence.\n"
        "Stage 2 (setting): type where and when the story happens, using words from the text.\n"
        "Stage 3 (plot): type the problem and the resolution, then retell the main events in order.\n"
        "Stage 4 (think): type why you think Leo grinned at the end, even though the boat did not win. Use evidence.\n"
        "Stage 5 (spell): type your six spelling words and underline the vowel team in each."
    ),
    "Think of a favourite story. Who is the main character, where is it set, and what is the problem?",
    "Did I name the characters and traits, describe the setting, find the problem and resolution, retell the plot in order, use evidence, and spell my six words with their vowel teams?",
    [
        _q("What is the setting of a story?", ["Who it is about", "Where and when it happens", "How it ends", "What the title is"], 1, "The setting is where and when a story takes place."),
        _q("What is a trait?", ["A place", "A kind of plot", "A word describing a character", "A title"], 2, "A trait describes what a character is like."),
        _q("In 'The Green Sail', what is the problem?", ["The sail has a hole", "It is Saturday", "Leo has a raincoat", "Grandpa is late"], 0, "The wind tore a hole in the sail."),
        _q("What does Leo use to fix the sail?", ["Rope", "Tape", "His green raincoat", "A blanket"], 2, "They cut a square from his raincoat."),
        _q("What is a resolution?", ["How the problem is solved", "The first event", "The title", "The weather"], 0, "The resolution is how the problem is solved."),
        _q("Which words show Leo felt sad at first?", ["grinned from ear to ear", "heart sink", "stitched it over", "start line"], 1, "'Leo felt his heart sink' shows his feelings."),
        _q("Which word is part of the setting?", ["stitched", "grandpa", "seaside", "hole"], 2, "Seaside tells us where the story happens."),
        _q("Which vowel team is in 'green'?", ["ai", "oa", "ay", "ee"], 3, "green has the vowel team ee."),
        _q("Which word has the vowel team ai?", ["train", "beach", "boat", "dream"], 0, "train has ai."),
        _q("What is evidence?", ["A guess", "A drawing", "Words in the text that prove an answer", "The title"], 2, "Evidence is the words from the text that prove your answer."),
    ],
    "Type your answers in the practice boxes and submit them.",
    "Extension: think of a character from a book or film you know. Type the character's setting, one trait with evidence, and the main problem.",
    [
        ("character", "A person or animal in a story"),
        ("setting", "Where and when a story happens"),
        ("plot", "The series of events in a story"),
        ("problem", "The trouble the characters must solve"),
        ("resolution", "How the problem is solved"),
        ("evidence", "Words in the text that prove your answer"),
        ("narrative", "A story"),
        ("trait", "A word that describes what a character is like"),
    ],
    [],
    _sort(
        "Which element is it?",
        "Sort each detail from 'The Green Sail' into character, setting or plot.",
        ["Character", "Setting", "Plot"],
        [
            ("Leo, a boy who loves boats", 0),
            ("His grandpa, who does not give up", 0),
            ("A grey, rainy Saturday", 1),
            ("The beach of a small seaside town", 1),
            ("The wind tears a hole in the sail", 2),
            ("They stitch a patch from the green raincoat", 2),
            ("The boat finishes the race", 2),
            ("A little wooden boat called the Dream", 1),
        ],
    ),
    [
        _wc("Which is the setting?", ["the beach", "Leo", "the hole"], 0, "The beach is where the story happens."),
        _wc("Which vowel team is in 'away'?", ["ai", "ay", "ee"], 1, "away has ay at the end."),
        _wc("Which word has ea?", ["beach", "boat", "train"], 0, "beach has ea."),
        _wc("Which is the correct spelling?", ["gren", "green", "grean"], 1, "green has ee."),
        _wc("Which is the correct spelling?", ["trayn", "train", "trane"], 1, "train has ai."),
        _wc("Which is the correct spelling?", ["dreem", "dreme", "dream"], 2, "dream has ea."),
        _wc("Who is the main character?", ["Leo", "The wind", "The sail"], 0, "The story is mostly about Leo."),
        _wc("Which is the correct spelling?", ["bote", "boat", "boght"], 1, "boat has oa."),
    ],
    [
        {"key": "partA", "label": "Part A: story map", "hint": "Characters, setting (where and when), problem and resolution."},
        {"key": "partB", "label": "Part B: traits and evidence", "hint": "One trait for Leo and one for his grandpa, each with evidence from the story."},
        {"key": "partC", "label": "Part C: retell", "hint": "Four sentences using first, then, next and finally."},
        {"key": "partD", "label": "Part D: vowel teams", "hint": "Type the vowel team in each of: train, away, green, beach, boat, dream."},
        {"key": "characters", "label": "Characters and traits", "hint": "Type the characters, a trait for each and the evidence."},
        {"key": "setting", "label": "Setting", "hint": "Where and when the story happens, using words from the text."},
        {"key": "plot", "label": "Plot", "hint": "The problem, the resolution and the main events in order."},
        {"key": "think", "label": "Why Leo grinned", "hint": "Say why Leo was happy even though the boat did not win, with evidence."},
        {"key": "spelling", "label": "Spelling words", "hint": "Type your six spelling words and mark the vowel team in each."},
    ],
    [
        "Answering without pointing to the words in the text",
        "Mixing up setting (where and when) with plot (what happens)",
        "Describing a character by looks only, not by what they say, do and feel",
        "Retelling every detail instead of the main events",
        "Spelling the vowel team the wrong way round, such as ia for ai or ae for ea",
    ],
    [
        "Read a short picture book and find the characters, setting and problem.",
        "Retell a favourite story to a family member in four sentences.",
    ],
    (
        "Part A: Characters: Leo and his grandpa. Setting: a grey, rainy Saturday on the beach of a small seaside town. Problem: the wind tore a hole in the sail. Resolution: they patched it with Leo's green raincoat and the boat finished the race. "
        "Part B: accept any sensible trait with evidence, for example Leo: disappointed at first (heart sink) or creative (he thought of the raincoat). Grandpa: patient or determined (did not give up) or helpful (Let's think). "
        "Part C: accept four sentences in order using the four connectives. For example: First, Leo got his boat ready for the race. Then the wind tore a hole in the sail. Next, Grandpa and Leo patched it with the raincoat. Finally, the boat finished the race. "
        "Part D: train (ai), away (ay), green (ee), beach (ea), boat (oa), dream (ea). "
        "Main task: accept a map with correct characters, setting and plot. For 'Why Leo grinned', accept answers such as: he was proud he finished, because 'it did not win, but it finished the race', or he was happy to have solved the problem with his grandpa. "
        "Quiz answers in order: Where and when it happens; A word describing a character; The sail has a hole; His green raincoat; How the problem is solved; heart sink; seaside; ee; train; Words in the text that prove an answer."
    ),
)

LESSON["spelling"] = {
    "focus": "Vowel teams ai, ay, ee, ea, oa",
    "teaching": (
        "A vowel team is two vowels that work together to make one sound. Say the word and listen for the long vowel.\n\n"
        "The sound ay is at the end of a word, as in away. The sound ai is in the middle, as in train. The teams ee and ea can both make the long e sound, as in green and beach, so learn each word by sight too."
    ),
    "words": [
        _w("train", "t-r-ai-n", "the vowel team ai is in the middle"),
        _w("away", "a-w-ay", "the vowel team ay is at the end"),
        _w("green", "g-r-ee-n", "the vowel team ee makes the long e sound"),
        _w("beach", "b-ea-ch", "the vowel team ea makes the long e sound"),
        _w("boat", "b-oa-t", "the vowel team oa makes the long o sound"),
        _w("dream", "d-r-ea-m", "the vowel team ea makes the long e sound"),
    ],
    "check": [
        _c("Which vowel team is in 'beach'?", ["ee", "ea", "ai"], 1, "beach has ea."),
        _c("Which is the correct spelling?", ["awai", "away", "awey"], 1, "ay is used at the end of away."),
    ],
}
LESSON.setdefault("learning_area", "English")
LESSON["spelling_focus"] = "Vowel teams ai, ay, ee, ea, oa"
LESSON["hoard_words"] = list(WORDS)
