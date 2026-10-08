"""Stage 2 English, Week 1 Lesson 2: Sentence Builder (Writing).
Built to the standard in docs/LESSON_BUILD_GUIDE.md. All written work is typed inside the lesson.
Spelling is attached here so the lesson is self-contained.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["sentence", "capital", "complete", "because", "different", "together"]

LESSON = build(
    "s2-eng-w01-l2-sentence-builder",
    "Sentence Builder",
    "Every story, report and letter is built from sentences. Become a sentence builder: learn the parts every sentence needs, then stretch a tiny sentence into a vivid one.",
    "Writing: sentences",
    ["EN2-CWT-01", "EN2-SPELL-01"],
    {
        "EN2-CWT-01": "Primary. Plans, creates and revises sentences using correct grammar and punctuation for a reader.",
        "EN2-SPELL-01": "Uses syllables and the look, say, cover, write, check method to spell sentence words.",
    },
    "We are learning to build complete sentences and to make them more interesting by adding detail.",
    [
        "I can say what makes a sentence complete.",
        "I can find the subject and the verb in a sentence.",
        "I can write a statement, a question, a command and an exclamation with the right end punctuation.",
        "I can add when, where or how to make a sentence more interesting.",
        "I can fix a fragment and a run-on sentence.",
        "I can check my sentences with CAPS.",
    ],
    ["sentence", "subject", "verb", "fragment", "run-on", "statement", "question", "command", "exclamation"],
    ["This lesson (everything you need is inside it)"],
    "Child can write a simple sentence beginning with a capital letter and ending with a full stop.",
    (
        "Why this matters. A sentence is the smallest piece of writing that makes full sense by itself. If you can build a strong sentence, you can build a paragraph, a story or a report, because bigger writing is just sentences joined in order. Readers also judge writing by its sentences: a text with clear, complete sentences is easy to follow, and a text with broken ones is tiring to read.\n\n"
        "What makes a sentence? A sentence is a group of words that makes complete sense. It needs two main parts. The subject tells you who or what the sentence is about. The verb tells you what the subject does or is. 'Dogs bark.' has both, so it is a complete sentence even though it is short. 'Barking loudly at night' has no subject, so we do not know who is barking. It is a fragment, which is a piece of a sentence that cannot stand on its own.\n\n"
        "Four jobs a sentence can do. A statement tells something and ends with a full stop. A question asks something and ends with a question mark. A command tells someone to do something and usually ends with a full stop, and the subject 'you' is hidden, as in 'Close the door.' An exclamation shows strong feeling and ends with an exclamation mark. Choosing the right job and the right end mark is part of writing well.\n\n"
        "Building and stretching. You can build a sentence in layers. Start with the core: who or what, and what they do. Then add detail by answering three questions: when? where? how? 'The dog barked.' becomes 'Late at night, the old dog barked angrily at the gate.' The core is still there, but the reader can now see and hear the scene. A good builder stretches a sentence only as far as the meaning needs, because a sentence packed with too many ideas turns into a run-on.\n\n"
        "Two common problems. A fragment is missing a part, usually the subject or the verb. A run-on sentence joins two complete ideas with no proper join, such as 'The rain fell we stayed inside.' Fix it by splitting it into two sentences, or by joining the ideas with a comma and a joining word: 'The rain fell, so we stayed inside.'\n\n"
        "The routine. Think about what you want to say. Build the core sentence. Stretch it with when, where or how. Then check it with CAPS: Capital letter at the start, Action word (a verb) and a who or what, Punctuation to finish, Sense, meaning it makes sense when you read it aloud. Reading your writing aloud is the quickest way to catch a missing word or a sentence that runs on.\n\n"
        "A quick demonstration. Start with 'Birds sing.' Core: subject Birds, verb sing. When? 'At sunrise'. Where? 'in the gum trees'. How? 'sweetly'. Built sentence: 'At sunrise, the birds sing sweetly in the gum trees.' CAPS check: capital A, verb sing, who is birds, full stop at the end, and it sounds right aloud."
    ),
    [
        _step(
            "1", "What is a sentence?",
            "A sentence is a group of words that makes complete sense on its own. It starts with a capital letter and ends with a full stop, a question mark or an exclamation mark. If you read it aloud and still ask 'what happened?' or 'who?', it is not finished.\n\n"
            "Test it: 'The kangaroo hopped across the paddock.' makes full sense. 'Across the paddock' does not, because we do not know who did what.",
            "Complete: 'Mia opened the gate.' Not complete: 'Opened the gate quickly.' (Who opened it?)",
            "A sentence makes complete sense by itself.",
            ("Which is a complete sentence?", ["Across the paddock", "The kangaroo hopped away.", "Hopped quickly and"], 1, "Only the second has a subject and a verb and makes full sense."),
        ),
        _step(
            "2", "Subject and verb: the core",
            "The subject is who or what the sentence is about. The verb is the action or the state of being. Find the verb first by asking 'what is happening?' Then ask 'who or what is doing it?' to find the subject.\n\n"
            "Every sentence has this core, even a very short one. Short sentences can be strong: 'Rain fell.' 'Mia ran.'",
            "'The young emu sprinted.' Verb: sprinted. Subject: the young emu. 'Tom is tired.' Verb: is. Subject: Tom.",
            "Find the verb first, then ask who or what is doing it.",
            ("In 'The cat sleeps.' which word is the verb?", ["The", "cat", "sleeps"], 2, "Sleeps is the action word."),
        ),
        _step(
            "3", "Four jobs for a sentence",
            "A statement tells something: 'The bus is late.' A question asks something: 'Is the bus late?' A command tells someone to do something: 'Catch the bus.' An exclamation shows strong feeling: 'The bus is late again!'\n\n"
            "Match the end mark to the job: full stop for statements and most commands, question mark for questions, exclamation mark for strong feeling.",
            "'Look at that rainbow!' (exclamation) 'Is that a rainbow?' (question) 'Look up.' (command) 'It is a rainbow.' (statement)",
            "Choose the sentence job first, then the end mark.",
            ("Which end mark belongs on 'Where are my shoes'?", ["A full stop", "A question mark", "An exclamation mark"], 1, "It asks something, so it needs a question mark."),
        ),
        _step(
            "4", "Stretch it: when, where, how",
            "Start with the core, then answer three questions. When did it happen? Where? How? Each answer adds detail and helps the reader picture the scene.\n\n"
            "Put a short 'when' or 'where' phrase at the start and follow it with a comma: 'After lunch, the children played.' Add 'how' words near the verb: 'The children played happily.'",
            "Core: 'The wind blew.' When: 'All night'. Where: 'across the plains'. How: 'fiercely'. Built: 'All night, the wind blew fiercely across the plains.'",
            "Answer when, where and how to stretch a sentence.",
            ("Which phrase tells you WHEN?", ["after lunch", "in the park", "very quietly"], 0, "After lunch tells you when it happened."),
        ),
        _step(
            "5", "Fixing fragments and run-ons",
            "A fragment is missing a subject or a verb. To fix it, add the missing part. A run-on joins two complete ideas with no join. To fix it, split it into two sentences, or join with a comma and a word like and, but, so or because.\n\n"
            "Read aloud to hear the problem. A fragment sounds unfinished. A run-on makes you run out of breath.",
            "Fragment: 'Walking home.' Fixed: 'Sam was walking home.' Run-on: 'It was late we went home.' Fixed: 'It was late, so we went home.'",
            "Fix a fragment by adding what is missing. Fix a run-on by splitting or joining.",
            ("'The sun set we ate dinner.' is a...", ["fragment", "run-on", "question"], 1, "Two complete ideas have been joined with no join."),
        ),
        _step(
            "6", "Spelling focus: syllables in sentence words",
            "Long words are easier to spell one syllable at a time. Say the word, tap each beat, then write the chunks: sen-tence, cap-i-tal, com-plete, be-cause, dif-fer-ent, to-geth-er.\n\n"
            "Use Look, Say, Cover, Write, Check for the tricky part: the tence in sentence, the double f in different, the au in because.",
            "sen-tence (2). cap-i-tal (3). com-plete (2). be-cause (2). dif-fer-ent (3). to-geth-er (3).",
            "Spell a long word one beat at a time.",
            ("How many syllables are in 'different'?", ["2", "3", "4"], 1, "dif-fer-ent has three beats."),
        ),
        _step(
            "7", "Check it with CAPS",
            "Before you finish any piece of writing, check each sentence with CAPS. C: Capital letter at the start. A: Action word (a verb) and a who or what. P: Punctuation to finish. S: Sense, so read it aloud and listen.\n\n"
            "Checking is not extra work. It is part of writing. Even adult writers read their sentences aloud before they send them.",
            "'the dogs barks loudly' fails CAPS. Fixed: 'The dogs bark loudly.' (capital, matching verb, full stop, makes sense).",
            "CAPS: Capital, Action, Punctuation, Sense.",
            ("What does the S in CAPS stand for?", ["Sense", "Spelling", "Silence"], 0, "Read it aloud to check that it makes sense."),
        ),
    ],
    (
        "Build one sentence together. Core: 'Lizards bask.' Subject: Lizards. Verb: bask. When? 'On hot afternoons'. Where? 'on the warm rocks'. How? 'lazily'. Built sentence: 'On hot afternoons, lizards bask lazily on the warm rocks.' "
        "CAPS check: Capital O at the start. Action word bask, who is lizards. Full stop at the end. Read aloud: it makes sense and sounds smooth. "
        "Now fix a run-on: 'The lizard ran I laughed.' Split it: 'The lizard ran. I laughed.' Or join it: 'The lizard ran, and I laughed.'"
    ),
    (
        "Type your answers in the practice boxes.\n"
        "Part A, subject and verb: write the subject and the verb for each. 1. The old bus rattled. 2. Birds sing. 3. My brother is hungry.\n"
        "Part B, four jobs: add the right end mark to each. 1. What time is it 2. Close the window 3. We won 4. The sky is blue\n"
        "Part C, stretch: take the core 'The boy ran.' and add when, where and how to build one new sentence.\n"
        "Part D, fix: rewrite each correctly. 1. Walking in the rain. 2. The bell rang we lined up.\n"
        "Your parent can check your answers against the answer key."
    ),
    (
        "You are the sentence builder for a short story called 'The Strange Parcel'. Everything you write goes in the boxes.\n\n"
        "Stage 1 (core): type three core sentences, each with a subject and a verb, about a strange parcel arriving at your door.\n"
        "Stage 2 (stretch): pick one core sentence and stretch it with when, where and how. Type the built sentence.\n"
        "Stage 3 (four jobs): write one statement, one question, one command and one exclamation about the parcel.\n"
        "Stage 4 (check): check all your sentences with CAPS and type what you fixed.\n"
        "Stage 5 (spell): type your six spelling words, split into syllables with hyphens."
    ),
    "Which of the four jobs (statement, question, command, exclamation) was the hardest to write, and why?",
    "Did I write three core sentences, stretch one with when, where and how, write all four sentence jobs, check with CAPS, and split my six spelling words into syllables?",
    [
        _q("What are the two main parts every sentence needs?", ["A subject and a verb", "A noun and an adjective", "A capital and a comma", "A question and an answer"], 0, "A sentence needs a subject and a verb."),
        _q("Which is a fragment?", ["Running down the hill", "Tom ran down the hill.", "We ran home.", "Birds sing."], 0, "It has no subject, so it is a piece of a sentence."),
        _q("Which end mark suits a question?", ["?", ".", "!", ","], 0, "Questions end with a question mark."),
        _q("'Shut the gate.' is a...", ["command", "question", "fragment", "exclamation"], 0, "It tells someone to do something."),
        _q("Which is a run-on sentence?", ["The dog barked we ran.", "The dog barked, so we ran.", "The dog barked.", "We ran."], 0, "Two complete ideas joined with no join."),
        _q("Which phrase tells you WHERE?", ["on the roof", "yesterday", "quickly", "because it rained"], 0, "On the roof tells where."),
        _q("What does the A in CAPS remind you to check?", ["An action word and a who or what", "Adjectives", "Answers", "Alphabet order"], 0, "A is for action word, the verb, and a subject."),
        _q("How many syllables are in 'capital'?", ["2", "3", "4", "1"], 1, "cap-i-tal."),
        _q("Which sentence is stretched with how?", ["The cat crept silently.", "The cat crept.", "Crept the cat.", "The cat."], 0, "Silently tells how."),
        _q("Why read your sentences aloud?", ["To hear missing words and run-ons", "To make them longer", "To save time", "It is not helpful"], 0, "Your ear catches problems your eyes miss."),
    ],
    "Type your answers in the practice boxes and submit them.",
    "Extension: take your best stretched sentence and stretch it a second time by adding a describing word before one noun. Type the new sentence and say which word you added.",
    [
        ("sentence", "A group of words that makes complete sense on its own"),
        ("subject", "Who or what the sentence is about"),
        ("verb", "The action or state of being in a sentence"),
        ("fragment", "A piece of a sentence that cannot stand on its own"),
        ("run-on", "Two complete ideas joined with no proper join"),
        ("statement", "A sentence that tells something"),
        ("question", "A sentence that asks something"),
        ("command", "A sentence that tells someone to do something"),
        ("exclamation", "A sentence that shows strong feeling"),
    ],
    [
        _video("Nouns, Verbs and Adjectives for Kids (Wombat School, Australian curriculum)", "984ntq-7x58",
               "Watch how to spot the nouns and verbs in simple sentences. A subject is often a noun and a verb tells the action.",
               "Pick three sentences from the video and say the subject and the verb in each.",
               ("Which word in a sentence shows the action?", ["The verb", "The noun", "The full stop"], 0, "The verb shows the action.")),
    ],
    _sort(
        "Which job is it?",
        "Sort each sentence into the job it does.",
        ["Statement", "Question", "Command", "Exclamation"],
        [
            ("The river is wide.", 0),
            ("Where is the river?", 1),
            ("Cross the river.", 2),
            ("What a huge river!", 3),
            ("We swam yesterday.", 0),
            ("Did you swim?", 1),
            ("Stay close to the bank.", 2),
            ("The water is freezing!", 3),
        ],
    ),
    [
        _wc("Which is the verb in 'The eagle soared.'?", ["soared", "eagle", "The"], 0, "Soared is the action."),
        _wc("Which is the subject in 'My sister laughed.'?", ["My sister", "laughed", "My"], 0, "My sister is who the sentence is about."),
        _wc("Which sentence is complete?", ["The storm passed.", "After the storm", "Passing over"], 0, "It has a subject and a verb."),
        _wc("Which tells you HOW?", ["nervously", "at noon", "in the shed"], 0, "Nervously tells how."),
        _wc("Which end mark: 'Watch out'", ["!", "?", ","], 0, "It is a warning with strong feeling."),
        _wc("How many syllables are in 'together'?", ["2", "3", "4"], 1, "to-geth-er."),
        _wc("Which is correctly split: 'different'?", ["dif-fer-ent", "di-ffe-rent", "diff-er-ent"], 0, "dif-fer-ent."),
        _wc("'We ate we left' is a...", ["run-on", "fragment", "question"], 0, "Two ideas joined with no join."),
    ],
    [
        {"key": "partA", "label": "Part A: subject and verb", "hint": "For each sentence type the subject and the verb. 1. The old bus rattled. 2. Birds sing. 3. My brother is hungry."},
        {"key": "partB", "label": "Part B: end marks", "hint": "Type each with the right end mark: What time is it / Close the window / We won / The sky is blue."},
        {"key": "partC", "label": "Part C: stretch it", "hint": "Take 'The boy ran.' and add when, where and how in one new sentence."},
        {"key": "partD", "label": "Part D: fix it", "hint": "Rewrite correctly: 1. Walking in the rain. 2. The bell rang we lined up."},
        {"key": "core", "label": "Three core sentences", "hint": "Three sentences with a subject and a verb about a strange parcel arriving."},
        {"key": "built", "label": "My built sentence", "hint": "Stretch one core sentence with when, where and how."},
        {"key": "fourjobs", "label": "Four sentence jobs", "hint": "Write a statement, a question, a command and an exclamation about the parcel."},
        {"key": "caps", "label": "My CAPS check", "hint": "Type what you fixed when you checked your sentences with CAPS."},
        {"key": "spelling", "label": "Spelling syllables", "hint": "Type your six spelling words split into syllables with hyphens."},
    ],
    [
        "Leaving out the verb, so the sentence is a fragment",
        "Joining two ideas with no join, which makes a run-on",
        "Forgetting the capital letter or the end mark",
        "Putting a full stop on a question",
        "Stretching a sentence so far it loses its meaning",
    ],
    [
        "Choose an object in your room and write four sentences about it: a statement, a question, a command and an exclamation.",
        "Take a sentence from a book you are reading and stretch it by changing when, where or how.",
    ],
    (
        "Part A: 1 subject The old bus, verb rattled. 2 subject Birds, verb sing. 3 subject My brother, verb is. "
        "Part B: What time is it? Close the window. (or !) We won! The sky is blue. "
        "Part C: Accept any sentence with a clear subject and verb that includes a when, a where and a how, for example: 'After school, the boy ran quickly along the beach.' "
        "Part D: 1 Accept any fix that adds a subject, for example 'We were walking in the rain.' 2 'The bell rang. We lined up.' or 'The bell rang, so we lined up.' "
        "Main task: accept any three core sentences with subject and verb, a stretched sentence with all three details, four correct sentence jobs with the right end marks, and six words split into syllables: sen-tence, cap-i-tal, com-plete, be-cause, dif-fer-ent, to-geth-er."
    ),
)

LESSON["spelling"] = {
    "focus": "Strategies and syllables",
    "teaching": (
        "Long words are easier when you spell one syllable at a time. Say the word, tap each beat, and write one chunk at a time.\n\n"
        "Then pick out the tricky part and give it extra attention. The tricky part of 'different' is the double f. The tricky part of 'because' is the au."
    ),
    "words": [
        _w("sentence", "sen-tence", "two beats, and the second beat is spelled tence"),
        _w("capital", "cap-i-tal", "three beats, and it ends with tal not tle"),
        _w("complete", "com-plete", "two beats, and the plete has a silent e on the end"),
        _w("because", "be-cause", "two beats, and the cause has au in the middle"),
        _w("different", "dif-fer-ent", "three beats, and it has a double f"),
        _w("together", "to-geth-er", "three small words hide inside: to, get, her"),
    ],
    "check": [
        _c("How many syllables are in 'capital'?", ["2", "3", "4"], 1, "cap-i-tal has three beats."),
    ],
}
LESSON.setdefault("learning_area", "English")
LESSON["spelling_focus"] = "Strategies and syllables"
LESSON["hoard_words"] = list(WORDS)
