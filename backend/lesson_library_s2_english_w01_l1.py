"""Stage 2 English, Week 1 Lesson 1: Reading with Expression.
One fully built test lesson, written to the Week 1 L1 slot of docs/english_s2_scope_and_sequence.md.
It uses the build helpers from lesson_library_s2_english_w1_w2 (only the helpers; no old lesson content).
The placeholder for this slot still exists in lesson_library_s2_english_placeholders.py.

TODO before release: add checked YouTube and BBC Bitesize / Khan Academy resources
(plan rule: every link is fetched and checked first). Word Hoard wiring is deferred.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc

LESSON = build(
    "s2-eng-w01-l1-reading-expression",
    "Reading with Expression",
    "The Story Stage needs a voice! Learn the reader's toolkit of punctuation, pace, volume, tone and emphasis, then perform a passage and explain every choice you made.",
    "Reading: fluency and comprehension",
    ["EN2-REFLU-01", "EN2-RECOM-01", "EN2-SPELL-01", "EN2-VOCAB-01"],
    {
        "EN2-REFLU-01": "Primary. Reads aloud with accuracy, appropriate pace, phrasing and expression.",
        "EN2-RECOM-01": "Uses expression to show the meaning and mood of a text, and explains the choices made.",
        "EN2-SPELL-01": "Splits long words into syllables to read and spell them (week 1 spelling focus: strategies, syllables).",
        "EN2-VOCAB-01": "Uses speech verbs and tone words to work out how a character feels.",
    },
    "We are learning to read aloud smoothly and with expression so that our listeners understand the meaning and feel the mood.",
    [
        "I can use punctuation to decide where to pause, stop or change my voice.",
        "I can change my pace, volume and tone to match what is happening in the text.",
        "I can stress a key word and explain how it changes the meaning.",
        "I can use speech verbs and other clues to choose a tone for a character.",
        "I can split long words into syllables to read and spell them.",
        "I can explain why I read a part the way I did.",
    ],
    ["fluency", "expression", "pace", "volume", "tone", "emphasis", "phrasing", "punctuation", "syllable"],
    ["A short story or poem you like (8 to 10 sentences)", "Pencil and coloured pencil", "Notebook", "A listener, or a device to record yourself"],
    "Child can read simple sentences aloud and recognises full stops, commas, question marks and exclamation marks.",
    (
        "Fluent reading sounds like talking. A fluent reader reads accurately, at a steady pace, in phrases rather than word by word, and with expression. "
        "Expression is not acting for fun: it shows the listener what the words mean and how the characters feel. If a reader is flat, the listener may miss the meaning.\n\n"
        "The reader's toolkit has five tools. Punctuation is the map that tells you where to pause or change your voice. Pace is how fast or slow you read. "
        "Volume is how loud or soft. Tone is the feeling in the voice. Emphasis is stressing one key word. Good readers choose each tool on purpose, because they have thought about what the text means.\n\n"
        "Reading long words smoothly is part of fluency, so today's spelling focus is syllables. If you can split a word into beats, you can read it without stumbling and spell it one chunk at a time.\n\n"
        "The routine for the lesson is: read it quietly first, mark it, practise, perform, then explain."
    ),
    [
        _step(
            "1", "What is fluency?",
            "Fluency has four parts, which you can remember as A-P-P-E. Accuracy: you read the words correctly. Pace: not too fast and not too slow. Phrasing: you group words into meaningful chunks. Expression: your voice shows meaning and feeling.\n\n"
            "A word-by-word reader sounds like a robot. A fluent reader sounds like a person telling a story. Read the sentence below two ways to hear the difference.",
            "Robot: 'The / dog / ran / down / the / hill.' Fluent: 'The dog ran / down the hill.' The second way groups words into phrases that make sense.",
            "Phrasing means reading in chunks that belong together, usually at commas and the ends of sentences.",
            ("What does phrasing mean?", ["Reading in meaningful chunks", "Reading as fast as you can", "Reading in a loud voice"], 0, "Phrasing groups words that belong together."),
        ),
        _step(
            "2", "Punctuation is your map",
            "A full stop means stop and take a small breath. A comma means a short pause. A question mark makes your voice rise at the end. An exclamation mark shows strong feeling such as shock, joy or anger. "
            "Speech marks tell you that someone is talking, so you can change your voice for the character. Three dots (an ellipsis) mean a trailing off or a suspenseful pause.\n\n"
            "Never read through a full stop without stopping. Never ignore a question mark. Punctuation was put there by the author to tell you how to read.",
            "'Run!' she said. 'Where?' he asked. 'Anywhere... just run.' Same words, but the punctuation tells you the first is urgent, the second rises, and the third trails off.",
            "The author hides reading instructions inside the punctuation.",
            ("What should your voice do at a question mark?", ["Rise", "Drop and stop", "Whisper"], 0, "A question mark makes the voice rise."),
        ),
        _step(
            "3", "Pace: when to go fast, when to go slow",
            "Speed up for fast action, lists and excitement. Slow down for sad, scary, important or mysterious moments. A pause just before a big word makes listeners lean in. "
            "Short sentences often feel fast. Long, flowing sentences often feel slow and calm.\n\n"
            "The pace should always match what is happening. If a character is running for their life, a slow reading sounds wrong. If the moment is quiet and sad, a rushed reading sounds careless.",
            "Fast: 'He ran, he jumped, he slid under the gate.' Slow: 'The room was quiet... and then... the lamp went out.'",
            "Ask yourself: is this moment busy or still?",
            ("When should you slow down?", ["At a tense or sad moment", "At every comma", "Never"], 0, "Slowing down builds feeling and tension."),
        ),
        _step(
            "4", "Volume and emphasis",
            "Loud volume shows shouting, excitement or anger. Soft volume shows secrets, fear or sadness. Emphasis means stressing one key word more than the others. Changing which word you stress can change the meaning of the whole sentence.\n\n"
            "Try this sentence and stress a different word each time: 'I did not take your book.' Stress I: someone else did. Stress not: you are denying it. Stress your: you took someone else's.",
            "'She never said he stole it.' Stress She: someone else might have. Stress never: she did not say it at all. Stress stole: he did something else.",
            "One word can change the meaning of a sentence, so choose the stressed word on purpose.",
            ("What does emphasis do?", ["Stresses a key word", "Makes you read faster", "Skips a word"], 0, "Emphasis highlights the important word."),
        ),
        _step(
            "5", "Tone: the feeling in your voice",
            "Tone is the mood of the voice: happy, nervous, angry, kind, bored, excited. You find the tone by looking for clues. The best clues are speech verbs and descriptions: whispered, grumbled, snapped, cheered, sighed. "
            "Other clues are what is happening in the story and how the character would feel.\n\n"
            "Authors choose speech verbs carefully. 'Said' is neutral. 'Roared' and 'whispered' tell you exactly how to sound.",
            "'Get out,' she whispered (scared, quiet). 'Get out!' she roared (angry, loud). 'Get out,' she sighed (tired, sad).",
            "Underline the speech verb first, then choose the tone.",
            ("Which word is the best clue to tone?", ["grumbled", "the", "and"], 0, "Speech verbs like grumbled tell you how to say the words."),
        ),
        _step(
            "6", "Spelling focus: syllables and long words",
            "A syllable is one beat in a word, and each syllable has a vowel sound. Tap your chin as you say a word and count the drops. Splitting a long word into syllables helps you read it smoothly and spell it one chunk at a time.\n\n"
            "Practise reading these before you perform: won-der-ful, ad-ven-ture, ex-pres-sion, ex-cel-lent, re-mem-ber, beau-ti-ful. If a word makes you stumble in a passage, split it into syllables and practise just that word three times.",
            "won-der-ful (3). ad-ven-ture (3). ex-pres-sion (3). un-for-get-ta-ble (5). si-lence (2).",
            "Every syllable is easy by itself. Long words are just short chunks joined together.",
            ("How many syllables are in 'wonderful'?", ["2", "3", "4"], 1, "won-der-ful has three beats."),
        ),
        _step(
            "7", "Marking a passage like a performer",
            "Professional readers mark their script. Use a simple code: a single slash / for a short pause, a double slash // for a long pause, an underline for a word to stress, an arrow up for a rising voice, an arrow down for a falling voice, and a note in the margin for tone.\n\n"
            "Read the passage silently first to find out what it means. Then mark it. Then read it aloud three times: once for smooth and accurate, once adding pace and volume, and once adding tone and emphasis.",
            "'The cave was silent. // Then, / from far below, / came a sound.' Marks: slow pace at 'silent', long pause after 'silent', rising voice on 'Was it water?'.",
            "Marking turns your thinking into a plan you can follow.",
            ("What should you do before you mark a passage?", ["Read it silently to understand it", "Read it as fast as you can", "Skip to the end"], 0, "You need to understand the meaning before you choose how to read."),
        ),
        _step(
            "8", "Explaining your choices",
            "Good readers can say why they read a part a certain way. This shows comprehension: you are using what the text means to decide how it sounds. A good explanation names the tool, the choice and the reason.\n\n"
            "Sentence starter: 'I (slowed down / whispered / stressed the word ___) because ___.'",
            "'I slowed down at the word silent because the cave is quiet and tense. I whispered Hello because Mia is scared and does not want to wake whatever is below.'",
            "The reason always points back to the meaning of the story.",
            ("A good explanation of a reading choice includes...", ["the tool, the choice and the reason", "only the word you changed", "how many times you read"], 0, "Name the tool, say what you did, and give the reason from the text."),
        ),
    ],
    (
        "Passage: 'The cave was silent. Then, from far below, came a sound. Was it water? Was it breathing? Mia gripped the torch and whispered, \"Hello?\"'\n\n"
        "Step 1, understand it: it is a tense, scary moment and Mia is nervous. Step 2, mark it: slow pace on the first sentence with a long pause after 'silent'. Underline 'below' and 'sound' for emphasis. "
        "Rising arrows on both questions. A soft volume and nervous tone note on the last line. Step 3, perform: first read for accuracy, then add pace and volume, then tone. "
        "Step 4, explain: 'I slowed down and paused after silent because the cave is quiet and the author wants the listener to feel the tension. I made my voice rise at the two questions because they are questions, and I whispered Hello because Mia is scared.'"
    ),
    (
        "Work in your notebook. Part A, pauses and stress: copy this sentence, put / for short pauses and underline the word to stress: 'Wait,' said Tom, 'that is not my bag.' (Hint: which word shows he is sure?)\n"
        "Part B, tone match: choose a tone for each line. 1. 'Come here at once!' 2. 'It's all right, I'm here.' 3. 'I suppose so,' he sighed. 4. 'We won!' she cheered.\n"
        "Part C, syllables: split into syllables and write how many: adventure, excellent, remember, beautiful, unforgettable.\n"
        "Part D, same words, different meaning: read 'I never said he was late' aloud six times, stressing a different word each time, and write what each version means.\n"
        "Check your answers against the answer key your parent has."
    ),
    (
        "Stage 1 (choose): pick a passage of 8 to 10 sentences from your own reading book, with some speech.\n"
        "Stage 2 (understand): read it silently and write one sentence about what is happening and how the characters feel.\n"
        "Stage 3 (mark): mark pauses, circle or underline at least three words to stress, add arrows for rising or falling voice, and write a tone note beside the speech.\n"
        "Stage 4 (practise): read it aloud three times (smooth, then pace and volume, then tone and emphasis). Split two tricky long words into syllables and practise each three times.\n"
        "Stage 5 (perform): perform for a family member or record yourself. Ask your listener one thing that sounded good and one thing to improve.\n"
        "Stage 6 (explain): write at least four sentences explaining your choices. Use 'I ___ because ___'. Include at least one about pace, one about tone and one about emphasis."
    ),
    "Which reading tool made the biggest difference to your performance, and how do you know? What would you do differently next time?",
    "Did I choose a passage, write what is happening, mark pauses, stress and tone, read it three times, practise two long words by syllables, perform it, record feedback, and write four sentences explaining my choices?",
    [
        _q("What does a full stop tell a reader to do?", ["Stop and take a small breath", "Speed up", "Shout", "Whisper"], 0, "A full stop is a stop."),
        _q("What happens to your voice at a question mark?", ["It rises", "It drops", "It stays flat", "It disappears"], 0, "A question mark makes the voice rise."),
        _q("What is pace?", ["How fast or slow you read", "How loud you read", "How neatly you write", "How well you spell"], 0, "Pace is speed."),
        _q("Which volume suits a secret or something scary?", ["Soft", "Loud", "Very fast", "Flat"], 0, "Soft volume shows secrets and fear."),
        _q("What is emphasis?", ["Stressing a key word", "Skipping a word", "Reading twice", "Reading in a whisper"], 0, "Emphasis highlights the important word."),
        _q("Which word is the best clue to tone in: 'Go away,' he grumbled?", ["grumbled", "Go", "he", "away"], 0, "The speech verb tells you how to say it."),
        _q("How many syllables are in 'adventure'?", ["2", "3", "4", "5"], 1, "ad-ven-ture."),
        _q("What does phrasing mean?", ["Reading in meaningful chunks", "Reading very loudly", "Reading one word at a time", "Reading without stopping"], 0, "Phrasing groups words that belong together."),
        _q("Why do good readers read silently first?", ["To understand the meaning before deciding how to read", "To read faster", "To avoid mistakes in spelling", "It is not necessary"], 0, "Expression comes from understanding."),
        _q("Which is a good explanation of a reading choice?", ["I whispered because Mia is scared of the dark cave.", "I read it loudly.", "I like whispering.", "I read it three times."], 0, "A good explanation gives the reason from the text."),
    ],
    "Submit your marked passage (photo or copy), your answers to Parts A to D, a recording or a note from your listener, and your explanation sentences.",
    "Extension: choose a passage with two characters and use a different voice for each. Mark which tool you change between them.",
    [
        ("fluency", "Reading smoothly and accurately, like talking"),
        ("phrasing", "Reading in chunks of words that belong together"),
        ("pace", "How fast or slow you read"),
        ("volume", "How loud or soft your voice is"),
        ("tone", "The feeling in your voice"),
        ("emphasis", "Stressing a key word to show meaning"),
        ("syllable", "One beat in a word, with one vowel sound"),
        ("speech verb", "A verb like whispered or roared that shows how something was said"),
    ],
    [],
    _sort(
        "Match the tool to the job",
        "Sort each reading choice under the tool it belongs to.",
        ["Pace", "Volume", "Tone"],
        [
            ("Slow down at a sad moment", "Pace"),
            ("Speed up during a chase", "Pace"),
            ("Whisper a secret", "Volume"),
            ("Shout a warning", "Volume"),
            ("Sound nervous when a character is scared", "Tone"),
            ("Sound cheerful when a character is delighted", "Tone"),
        ],
    ),
    [
        _wc("How many syllables are in 'beautiful'?", ["2", "3", "4"], 1, "beau-ti-ful."),
        _wc("Which speech verb shows the quietest way of speaking?", ["whispered", "shouted", "roared"], 0, "Whispered is soft and quiet."),
        _wc("Which is split into syllables correctly?", ["ex-cel-lent", "exc-ell-ent", "e-xcel-lent"], 0, "ex-cel-lent."),
    ],
    None,
    [
        "Reading too fast and ignoring punctuation",
        "Reading in a flat voice with no pauses or change of tone",
        "Stressing every word equally, which is the same as stressing none",
        "Choosing a tone that does not match the text (for example cheerful for a sad moment)",
        "Explaining a choice with 'because I like it' instead of a reason from the text",
    ],
    [
        "Read the same short sentence in three different tones and describe the difference.",
        "Choose a favourite speech verb and write three sentences that use it.",
    ],
    (
        "Part A: Wait, / said Tom, / that is not my bag. Stress 'not' (or 'my'). Part B: 1 urgent or angry; 2 gentle or comforting; 3 reluctant or tired; 4 excited or joyful. "
        "Part C: ad-ven-ture (3), ex-cel-lent (3), re-mem-ber (3), beau-ti-ful (3), un-for-get-ta-ble (5). "
        "Part D: 'I never said he was late' - Stress I: someone else said it. Stress never: you did not say it at all. Stress said: you hinted or wrote it instead. Stress he: you meant someone else. Stress was: you meant he is late now or will be. Stress late: you said he was early or on time or something else. Accept any sensible explanation."
    ),
)
