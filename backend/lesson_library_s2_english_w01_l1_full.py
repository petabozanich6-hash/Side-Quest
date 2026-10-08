"""Stage 2 English, Week 1, Lesson 1: Reading with expression (60 minutes).
Replaces the placeholder s2-eng-w01-l1. Uses the shared build helpers.

TO REGISTER: add this module to LESSON_MODULES in lesson_library.py. Because BUILT_OUT_WEEKS in
lesson_library_s2_english_placeholders.py skips a whole week, do NOT add week 1 there until L2 to L4
are built. Instead remove or skip only the 's2-eng-w01-l1' placeholder so there is no duplicate.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _video, _sort, _wc, _article

PASSAGE = (
    "The Night the Dingo Came\n\n"
    "Mia woke to a scratching sound outside the tent. She sat up, listening. Scratch, scratch, scratch. "
    "'Dad?' she whispered. 'Is that you?' Nobody answered.\n\n"
    "Slowly, she unzipped the flap and peeked out. Moonlight spilled across the red dirt, and there, beside "
    "the campfire, stood a thin, golden dingo. Its ears were pointed. Its eyes glittered. Mia held her breath.\n\n"
    "For a long moment, neither of them moved. Then the dingo licked the last crumbs from the damper tin, "
    "turned, and trotted away into the dark. 'Well!' Mia laughed softly. 'You only wanted supper!'"
)

W1L1 = build(
    "s2-eng-w01-l1-reading-expression", "Voice of the Storyteller: Reading with Expression",
    "A campfire story is waiting for a voice! Train your reading voice like an actor, then show that you understand every line.",
    "Reading fluency and comprehension: reading with expression",
    ["EN2-RECOM-01", "EN2-REFLU-01", "EN2-UARL-01", "EN2-SPELL-01"],
    {"EN2-REFLU-01": "Primary. Practises accuracy, rate and prosody (phrasing and expression) suited to purpose and meaning.",
     "EN2-RECOM-01": "Answers literal and inferential questions and retells a passage in order.",
     "EN2-UARL-01": "Describes how a character's feelings are represented in a short narrative.",
     "EN2-SPELL-01": "Uses syllables and word parts to read and spell words from the passage."},
    "We are learning to read aloud accurately, smoothly and with expression, and to understand what we read.",
    ["I can read the words accurately and fix mistakes.",
     "I can use punctuation to decide where to pause and how my voice should sound.",
     "I can read in meaningful phrases at a natural speaking pace.",
     "I can change my volume, speed, pitch and tone to show a character's feelings.",
     "I can answer a literal question and an inference question about a passage."],
    ["fluency", "accuracy", "pace", "phrasing", "expression", "punctuation", "literal", "infer"],
    ["A short text of your choice (about 100 words)", "Pencil", "Notebook", "A listener (family member, pet or soft toy)", "A device to record yourself (optional)"],
    "Child can read simple chapter-book text and knows the main punctuation marks.",
    "Fluent reading has four parts: accuracy (reading the words that are really there), pace (a natural talking speed), phrasing (reading words in chunks that belong together) and expression (a voice that shows meaning and feeling). Together, the last three are called prosody.\n\nWhy it matters: when reading the words is easy, your brain is free to think about what the text means. Reading aloud also shows you where you do not understand. If a sentence will not come out smoothly, stop and ask what it means.\n\nPunctuation is the author's set of voice instructions. A comma is a short pause, a full stop is a longer pause with a falling voice, a question mark lifts the voice, an exclamation mark adds force, three dots mean trailing off or suspense, and quotation marks mean a character is speaking.\n\nGood readers read a text silently first, then aloud. Scan for punctuation and speaking words (whispered, shouted) before you read, then plan your voice.",
    [
        _step("1", "Accuracy and fixing mistakes",
              "Accuracy means reading the words that are on the page. When something goes wrong, strong readers notice and fix it. Ask three questions: Does it make sense? Does it sound right? Does it look right (do the letters match)?\n\nWhen a word is hard, use your tools: split it into syllables, look for a prefix or suffix, read to the end of the sentence and come back, or think what word would fit the story.\n\nGoing back to fix a word is a strength, not a failure. It means you are monitoring your understanding.",
              "The text says 'Mia listened to the scratching.' You read 'listed'. It does not sound right, so you stop, look again (lis-ten-ed), fix it and carry on.",
              "Re-reading to fix a word is what expert readers do.",
              ("A word you read does not make sense. What should you do?", ["Go back and re-read it", "Keep going and hope", "Skip the page"], 0, "Self-correcting is a strong reading habit.")),
        _step("2", "Pace and phrasing",
              "A good pace sounds like natural talking. Too fast and listeners cannot follow. Too slow and the sentence falls apart. Change your pace on purpose: slow down for scary or important moments, speed up for action.\n\nPhrasing means reading in meaningful chunks instead of word by word. Find the chunks by looking at punctuation and at small words that start a new idea (and, but, then, to, in). Put a slash at each natural pause and read each chunk in one smooth breath.\n\nTest yourself: read a sentence aloud, then say it the way you would tell a friend. If the two sound different, adjust your pace and phrasing.",
              "Mia woke / to a scratching sound / outside the tent. / She sat up, / listening.",
              "Chunks follow meaning and punctuation, not single words.",
              ("What is phrasing?", ["Reading in meaningful chunks", "Reading as fast as you can", "Reading word by word"], 0, "Phrasing groups words by meaning.")),
        _step("3", "Punctuation as voice instructions",
              "A comma means a short breath. A full stop means a longer stop and a falling voice. A question mark lifts your voice at the end. An exclamation mark adds energy or volume. Three dots (...) mean a slow trailing off. Quotation marks mean a character is speaking, so change your voice.\n\nThe words around the quote give clues about how to say it: 'she whispered', 'he bellowed' and 'they giggled' each tell you what your voice should do.\n\nBefore reading a page aloud, scan it for punctuation and speaking words. Then you already know where your voice will change.",
              "'Dad?' she whispered. (rising, soft) 'Well!' Mia laughed softly. (a little surprised, then warm) Scratch, scratch, scratch. (short, even beats)",
              "Pause at a comma, stop at a full stop, rise at a question mark.",
              ("What does your voice do at a question mark?", ["Rises", "Falls", "Stays flat"], 0, "Questions usually lift at the end.")),
        _step("4", "Expression: your voice toolbox",
              "Expression is how your voice shows meaning and feeling. You have four controls: volume (loud or soft), speed (fast or slow), pitch (high or low) and tone (the feeling, such as scared, cross, excited or gentle).\n\nBefore reading dialogue, ask: Who is speaking? How do they feel? How would that voice sound? Give each character a slightly different voice so listeners can tell them apart. Narration usually has a steady storyteller voice, with expression added as the action or feeling rises.\n\nTry reading the same line three ways (whispered, shouted, bored) and notice how the meaning changes.",
              "Soft and slow: 'Dad? Is that you?' Loud and fast: 'Run! The tide is coming in!' Warm and relieved: 'You only wanted supper!'",
              "Match your voice to the meaning of the words.",
              ("Which line should be read softly?", ["'Be quiet, someone is coming,' she whispered.", "'Look out!' he shouted."], 0, "Whispering matches a soft voice.")),
        _step("5", "Understanding what you read",
              "Reading is not just saying the words. A literal question asks for a fact stated in the text, so you can point to the answer. An inference question asks you to work something out from clues plus what you already know. A good inference answer starts: 'I think... because the text says...'.\n\nWhen you finish, retell the passage in your own words in order: beginning, middle and end. If you can retell it, you understood it.\n\nYou can also describe how the author shows a character's feelings, through what they do, say and notice.",
              "Literal: What did the dingo lick? (the damper tin). Inference: How did Mia feel when she saw the dingo? (nervous at first, because she held her breath; relieved at the end, because she laughed.)",
              "Literal answers are found in the text; inference answers are built from clues.",
              ("Which is an inference question?", ["How did Mia feel when she saw the dingo?", "Where was the dingo standing?", "What did Mia whisper?"], 0, "The text does not say the feeling outright, so you work it out.")),
        _step("6", "Spelling: strategies and syllables",
              "This week's spelling focus is strategies and syllables. When you meet a long word while reading, split it into syllables, read one chunk at a time, then say it smoothly. The same chunks help you spell it.\n\nTry these words from the passage: scratch-ing (2), cam-p-fire (3 beats: camp-fi-re, or camp + fire as a compound), moon-light (compound), glit-ter-ed (3). Use Look, Say, Cover, Write, Check for the tricky ones.\n\nYou can add any tricky words to your Word Hoard yourself.",
              "moon + light = moonlight. camp + fire = campfire. glit-ter-ed = 3 syllables.",
              "Reading and spelling use the same word-part skills.",
              ("How many syllables are in 'glittered'?", ["2", "3", "4"], 1, "glit-ter-ed has three beats.")),
    ],
    "Read the passage silently first. Phrasing: Mia woke / to a scratching sound / outside the tent. / She sat up, / listening. Expression plan: read 'Scratch, scratch, scratch.' in short, even beats; read 'Dad?' in a soft rising whisper; slow right down for 'Mia held her breath.'; let your voice relax and warm up for 'You only wanted supper!'. Literal question: what did the dingo lick? (the damper tin). Inference question: why did Mia laugh at the end? (because she realised the dingo was only looking for food, and she was no longer frightened).\n\nPassage:\n" + PASSAGE,
    "Use the passage 'The Night the Dingo Came'. Part A (phrasing): copy the first two sentences and put a slash at each natural pause. Part B (punctuation): list each punctuation mark in the passage and say what your voice does for each. Part C (expression): read the last paragraph three times, changing volume, speed or tone each time, and say which version sounded best and why. Part D (understanding): write one literal question and one inference question, with answers. Check Parts A and B against the answer key your parent has.",
    "Stage 1 (choose): pick a page of about 100 words from your own book.\nStage 2 (plan): read it silently, mark phrases with slashes, circle punctuation and underline speaking words.\nStage 3 (read): read it aloud three times to a listener, or record it. After each read, rate your accuracy, pace, phrasing and expression from 1 to 3.\nStage 4 (reflect): write two sentences on what improved, write one literal and one inference question with answers, then retell the passage in three sentences: beginning, middle, end.",
    "Which of the four parts of fluency is your strongest, and which will you work on next?",
    "Did I read three times, rate each read, write two sentences on what improved, write two questions with answers and retell the passage in three sentences?",
    [
        _q("What does a comma tell your voice to do?", ["Pause briefly", "Stop for a long time", "Shout"], 0, "A comma is a short pause."),
        _q("What does your voice do at a question mark?", ["Rises", "Falls", "Stays flat"], 0, "Questions usually rise at the end."),
        _q("What is phrasing?", ["Reading in meaningful chunks", "Reading very fast", "Reading word by word"], 0, "Phrasing groups words by meaning."),
        _q("Which part of fluency is about your voice showing feeling?", ["Expression", "Accuracy", "Pace"], 0, "Expression carries feeling."),
        _q("What does an exclamation mark add?", ["Strong feeling", "A question", "A list"], 0, "It shows strong feeling or force."),
        _q("You read a word that makes no sense. What do you do?", ["Go back and fix it", "Ignore it", "Stop reading"], 0, "Self-correct."),
        _q("In the passage, what sound did Mia hear?", ["Scratching", "Singing", "Thunder"], 0, "Scratch, scratch, scratch."),
        _q("In the passage, what did the dingo lick?", ["The damper tin", "The tent", "Mia's hand"], 0, "It licked crumbs from the damper tin."),
        _q("Why did Mia hold her breath when she saw the dingo?", ["She was nervous", "She was sleepy", "She was bored"], 0, "Holding your breath shows nerves; this is an inference."),
        _q("How should you read 'she whispered'?", ["Softly", "Loudly", "Very fast"], 0, "Whispered means soft."),
    ],
    "Upload a short recording, or a photo of your rating table, your two sentences, your two questions and your three-sentence retell.",
    "Read a short poem aloud and plan where to pause, speed up and slow down. Mark your plan on the page.",
    [("fluency", "Reading smoothly and with understanding."), ("accuracy", "Reading the words that are on the page."),
     ("pace", "The speed of your reading."), ("phrasing", "Reading in meaningful chunks."),
     ("expression", "Using your voice to show meaning and feeling."), ("punctuation", "Marks that guide pauses and voice."),
     ("literal", "A question whose answer is stated in the text."), ("infer", "Work something out using clues in the text.")],
    [
        _video("Punctuation Celebration (read aloud)", "RgGrNL82r4I",
               "Listen to how the reader's voice changes with punctuation. Notice the pauses, the rises and the feeling.",
               "Read a page aloud and mark each comma with a short pause and each question mark with a rise.",
               ("Which part of fluency is shown when a reader's voice changes with the meaning?", ["Expression", "Spelling", "Handwriting"], 0, "Expression shows meaning through the voice.")),
        _video("Punctuation and grammar for kids (read aloud)", "2zNAQW5jPwI",
               "Listen to the read-aloud and notice how the narrator treats each punctuation mark.",
               "Choose a short text and read it with a pause at every punctuation mark.",
               ("What should a reader do at a full stop?", ["Pause and let the idea finish", "Speed up", "Skip it"], 0, "A full stop is a longer pause.")),
        _article("Fluency practice: reading with expression (Reading Universe)", "https://readinguniverse.org/resources/video/fluency/fluency-practice-reading-with-expression"),
    ],
    _sort("Voice sorter", "How should your voice sound for each line? Tap one, then press Check.",
          ["Soft and slow", "Loud and fast", "Rising (a question)"],
          [("'Be quiet, the baby is sleeping,' she whispered.", 0), ("The candle flickered in the dark, silent room.", 0),
           ("'I think I heard something,' he murmured.", 0), ("'Run! The tide is coming in!'", 1),
           ("'We won! We actually won!'", 1), ("'Look out behind you!' she screamed.", 1),
           ("'Where did you hide the key?'", 2), ("'Are you coming to the beach with us?'", 2), ("'Did you see that?'", 2)]),
    [
        _wc("The wind howled and the sea ___ against the cliff.", ["crashed", "sat", "smiled"], 0, "Crashed paints a strong sound picture."),
        _wc("A reader who skips punctuation will ___.", ["miss the pauses and feeling", "read faster and better", "learn spelling"], 0, "Punctuation guides pauses and feeling."),
        _wc("If someone 'murmured', their voice was ___.", ["quiet and low", "loud", "high and squeaky"], 0, "Murmured means spoke quietly."),
        _wc("To 'infer' means to ___.", ["work out using clues", "copy a word", "read quickly"], 0, "Infer means working something out from clues."),
        _wc("A 'literal' question has an answer that is ___.", ["stated in the text", "hidden in clues", "never found"], 0, "Literal means you can point to it."),
        _wc("If a character 'bellowed', your voice should be ___.", ["loud and deep", "whispery", "silent"], 0, "Bellowed means shouted in a deep, loud voice."),
    ],
    [
        {"key": "book", "label": "My book", "hint": "Title and the page you chose."},
        {"key": "goal", "label": "My fluency goal", "hint": "Which of accuracy, pace, phrasing or expression will you work on?"},
        {"key": "chunks", "label": "Chunks", "hint": "Copy one sentence from your page and mark the phrases with slashes."},
    ],
    ["Reading so fast the meaning is lost.", "Reading word by word with no chunks.", "Ignoring punctuation when reading aloud.", "Not stopping to fix a word that does not make sense."],
    [{"title": "Radio Voice", "description": "Record yourself reading a page like a radio announcer. Share it with a family member and ask which part sounded best.", "type": "speak", "difficulty": "medium", "evidence_type": "audio"},
     {"title": "Character Voices", "description": "Read a scene from a book giving each character a different voice. Write how you chose each voice.", "type": "create", "difficulty": "stretch", "evidence_type": "audio"}],
    "Part A (example): Mia woke / to a scratching sound / outside the tent. / She sat up, / listening. Part B: comma = short pause; full stop = longer pause and falling voice; question mark = voice rises; exclamation mark = strong feeling; quotation marks = a character speaks, so change voice. Part C: any sensible comparison of volume, speed or tone, for example slow and soft builds suspense. Part D: literal e.g. What did the dingo lick? (the damper tin). Inference e.g. Why did Mia laugh at the end? (she realised the dingo only wanted food, and she was relieved).",
)

W1L1["learning_area"] = "English"
W1L1["spelling_focus"] = "Strategies and syllables"
W1L1["hoard_words"] = []
W1L1["is_placeholder"] = False
W1L1["passage"] = PASSAGE

LESSONS = [W1L1]

if __name__ == "__main__":
    assert len(W1L1["quiz"]) == 10
    print("OK:", W1L1["seed_key"])
