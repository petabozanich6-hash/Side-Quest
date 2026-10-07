"""Spelling segment content for Stage 2 English Week 1 (focus: sounds and syllables).
Kept in its own module so the large lesson file is not touched.
Call apply_week1_spelling() after WEEK_1 is built; it adds a `spelling` object to each lesson.
Format is documented in docs/spelling-scope-and-sequence.md."""


def _w(word, parts, tip):
    return {"word": word, "parts": parts, "tip": tip}


def _c(question, options, idx, why):
    return {"question": question, "options": options, "correct_index": idx, "explanation": why}


SPELLING_W1 = {
    "s2-eng-w01-l1-spelling-strategies": {
        "focus": "Sounds and syllables",
        "teaching": (
            "A syllable is one beat in a word. Say the word and feel your chin drop: it drops once for each beat. "
            "Spell one syllable at a time and a long word becomes a few short ones.\n\n"
            "Listen for a short vowel followed by another syllable. The middle of the word often has a double letter: "
            "rab-bit, rib-bon, mit-ten. Compound words are two whole words joined together, so spell each part and join them: "
            "sun + shine = sunshine."
        ),
        "words": [
            _w("rabbit", "rab-bit", "double b after the short vowel a"),
            _w("ribbon", "rib-bon", "double b in the middle, just like rabbit"),
            _w("butterfly", "but-ter-fly", "three beats, with a double t in the middle"),
            _w("sunshine", "sun + shine", "two whole words joined together"),
            _w("elephant", "el-e-phant", "the ph says f"),
        ],
        "check": [
            _c("Which word has a double letter in the middle?", ["rabbit", "elephant", "sunshine"], 0, "rab-bit has a double b."),
        ],
    },
    "s2-eng-w01-l2-sentence-builder": {
        "focus": "Sounds and syllables",
        "teaching": (
            "Writers split long words into syllables so they can spell them one chunk at a time. "
            "Tap out the beats, write each chunk, then read the whole word back to check it.\n\n"
            "Today's words are the language of sentences. Each one is long, so say it slowly and listen for every beat."
        ),
        "words": [
            _w("sentence", "sen-tence", "the ce at the end says s, like in fence"),
            _w("question", "ques-tion", "the tion at the end says shun"),
            _w("capital", "cap-i-tal", "three beats, and the middle one is a quiet i"),
            _w("comma", "com-ma", "double m in the middle"),
            _w("apostrophe", "a-pos-tro-phe", "four beats, and the ph says f"),
        ],
        "check": [
            _c("How many syllables are in 'capital'?", ["2", "3", "4"], 1, "cap-i-tal has three beats."),
        ],
    },
    "s2-eng-w01-l3-reading-expression": {
        "focus": "Sounds and syllables",
        "teaching": (
            "Reading and spelling use the same skill in opposite directions. When you read, you join the sounds and syllables. "
            "When you spell, you break the word back into sounds and syllables.\n\n"
            "Compound words are easy to read and easy to spell once you spot the two small words inside them."
        ),
        "words": [
            _w("lighthouse", "light + house", "a compound word, and the igh makes the long i sound"),
            _w("evening", "eve-ning", "two beats, ending in ing"),
            _w("polished", "pol-ished", "the sh sound is spelt with a digraph"),
            _w("whisper", "whis-per", "the wh at the start, and the er at the end"),
            _w("expression", "ex-pres-sion", "double s, and the sion says shun"),
        ],
        "check": [
            _c("Which word is a compound word?", ["lighthouse", "evening", "whisper"], 0, "light + house."),
        ],
    },
    "s2-eng-w01-l4-show-dont-tell": {
        "focus": "Sounds and syllables",
        "teaching": (
            "Strong verbs and precise describing words are often longer words, so syllables help you spell them. "
            "Break the word into beats, spell each beat, and look out for double letters and digraphs.\n\n"
            "Before you hand in your description, underline any long word and check it one syllable at a time."
        ),
        "words": [
            _w("shadow", "shad-ow", "the ow at the end says oh"),
            _w("creaking", "creak-ing", "the ea says ee, then the ing suffix"),
            _w("moonlight", "moon + light", "a compound word with the igh sound"),
            _w("trembled", "trem-bled", "two beats, ending in ed"),
            _w("enormous", "e-nor-mous", "three beats, ending in ous"),
        ],
        "check": [
            _c("How many syllables are in 'enormous'?", ["2", "3", "4"], 1, "e-nor-mous has three beats."),
        ],
    },
}


def apply_week1_spelling(lessons):
    """Attach a spelling object to each Week 1 lesson. Safe to call more than once."""
    for lesson in lessons:
        data = SPELLING_W1.get(lesson.get("seed_key"))
        if data:
            lesson["spelling"] = data
    return lessons
