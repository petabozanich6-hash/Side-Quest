"""Stage 2 English, Week 1 Lesson 3: Spelling Detective, four strategies (Language).
Built to the standard in docs/LESSON_BUILD_GUIDE.md. All written work is typed inside the lesson.
Spelling is attached here so the lesson is self-contained.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["strategy", "syllable", "detective", "vowel", "consonant", "practise"]

LESSON = build(
    "s2-eng-w01-l3-spelling-detective",
    "Spelling Detective",
    "Good spellers are not lucky. They are detectives with a toolkit! Learn four strategies for cracking any tricky word, and know which one to reach for.",
    "Language: spelling strategies and vocabulary",
    ["EN2-VOCAB-01", "EN2-SPELL-01"],
    {
        "EN2-VOCAB-01": "Primary. Learns and uses the words vowel, consonant, syllable, base word, prefix and suffix to talk about words.",
        "EN2-SPELL-01": "Selects, applies and describes sounding out, splitting, base words and look, say, cover, write, check when spelling.",
    },
    "We are learning four spelling strategies and how to choose the best one for a tricky word.",
    [
        "I can tell a vowel from a consonant.",
        "I can sound out and split a word into syllables.",
        "I can find the base word, the prefix and the suffix in a word.",
        "I can use look, say, cover, write, check to learn a tricky word.",
        "I can say which strategy I used and why.",
        "I can check a spelling in a dictionary.",
    ],
    ["strategy", "syllable", "vowel", "consonant", "base word", "prefix", "suffix", "dictionary"],
    ["This lesson (everything you need is inside it)"],
    "Child knows the alphabet and can write simple words from memory.",
    (
        "Why this matters. English spelling is not random, even though it can look that way. Most words follow patterns of sound, beat and meaning, and spelling detectives learn to spot those patterns. Instead of memorising every word one letter at a time, you learn a few strategies that work on thousands of words.\n\n"
        "The alphabet has two kinds of letters. The vowels are a, e, i, o and u, and every syllable needs a vowel sound. The other twenty-one letters are consonants. Knowing this helps you split words and find the tricky part. Sometimes y acts as a vowel too, as in 'rhythm' and 'gym'.\n\n"
        "Strategy 1: Sound it out. Say the word slowly and listen for each sound, then write a letter or letters for each one. This works well for regular words like 'strip' or 'crunch'. It does not work alone for words with silent or unexpected letters, like 'knife' or 'because'.\n\n"
        "Strategy 2: Split it. A syllable is one beat in a word. Tap or clap the beats and write the word one chunk at a time: de-tec-tive, con-so-nant. Long words become a few short ones.\n\n"
        "Strategy 3: Base word and parts. Many words are built from a base word with a prefix at the front, a suffix at the end, or both. 'Unhappily' is un + happy + ly. If you can spell the base word and the parts, you can spell the whole word. Watch for changes at the join, such as y changing to i.\n\n"
        "Strategy 4: Remember the tricky bit. Some words have a part that just has to be remembered. Use Look, Say, Cover, Write, Check. Look at the word and find the tricky part. Say it, perhaps in a funny way to help your memory, such as 'Wed-nes-day'. Cover it. Write it from memory. Check it letter by letter. If you made a mistake, mark just the wrong part and try again.\n\n"
        "Choosing a strategy. A good detective asks: is this word regular? Then sound it out. Is it long? Then split it. Does it have parts I know? Then base word and parts. Is there a tricky bit? Then Look, Say, Cover, Write, Check. For any word you are still unsure of, check a dictionary, which lists every word in alphabetical order with its correct spelling.\n\n"
        "A quick demonstration. Take 'unforgettable'. Split it: un-for-get-ta-ble. Base word: get, doubled to get-t before the ending. Parts: un + forget + able. Tricky bit: the double t. Strategies used: split it and base word and parts."
    ),
    [
        _step(
            "1", "Vowels and consonants",
            "The five vowels are a, e, i, o and u, and every syllable has at least one vowel sound. The remaining twenty-one letters are consonants. Sometimes y works as a vowel, as in 'gym'.\n\n"
            "Why does it matter? Because syllables are built around vowels, so finding the vowels helps you split a word.",
            "In 'detective' the vowels are e, e, i, e. In 'strategy' the vowels are a, e and y.",
            "Every syllable needs a vowel sound.",
            ("Which letters are all vowels?", ["a, e, i, o, u", "b, c, d, f, g", "s, t, r, n, m"], 0, "The five vowels are a, e, i, o and u."),
        ),
        _step(
            "2", "Strategy 1: Sound it out",
            "Say the word slowly. Listen for each separate sound. Write a letter or letters for each sound. Then check that it looks right.\n\n"
            "This works for regular words. It is a good first try, but it will not catch silent letters or unusual spellings by itself.",
            "'crunch' has the sounds c-r-u-n-ch. 'strip' has s-t-r-i-p.",
            "Good for regular words, but check the result.",
            ("Sounding out works best for...", ["regular words", "words with silent letters", "every word"], 0, "Regular words match their sounds."),
        ),
        _step(
            "3", "Strategy 2: Split it into syllables",
            "Clap the beats in a word. Write one beat at a time. Every beat has a vowel sound.\n\n"
            "'Consonant' has three beats: con-so-nant. 'Detective' has three: de-tec-tive. Splitting makes a long word feel like three small ones.",
            "vow-el (2). syl-la-ble (3). prac-tise (2). strat-e-gy (3). con-so-nant (3).",
            "Long words are short chunks joined together.",
            ("How many syllables are in 'syllable'?", ["2", "3", "4"], 1, "syl-la-ble has three beats."),
        ),
        _step(
            "4", "Strategy 3: Base word, prefix and suffix",
            "A base word is the word you start with. A prefix goes at the front and changes the meaning: un-, re-, dis-. A suffix goes at the end: -ful, -ly, -ing, -ed.\n\n"
            "Find the base word, spell it, then add each part. 'Replaying' is re + play + ing. Watch the join: 'happy' becomes 'happily', where y changes to i.",
            "unkind = un + kind. careful = care + ful. rewriting = re + write + ing (the e drops).",
            "If you can spell the parts, you can spell the word.",
            ("What is the base word in 'unhappy'?", ["happy", "un", "unhap"], 0, "Un is the prefix, and happy is the base word."),
        ),
        _step(
            "5", "Strategy 4: Look, Say, Cover, Write, Check",
            "Look at the word and find the tricky bit. Say it, and try saying it the way it is spelled to help your memory, like 'Wed-nes-day'. Cover the word. Write it from memory. Check it letter by letter.\n\n"
            "If it is wrong, only mark the part that is wrong, then try again. Repeat until you can write it correctly three times in a row.",
            "'because': tricky bit is au. Say 'be-CAUSE', write it, check it. 'separate': tricky bit is the a in the middle (sep-A-rate).",
            "Find the tricky bit and practise only that.",
            ("What do you do after you cover the word?", ["Write it from memory", "Look at it again", "Skip to the next word"], 0, "Cover, then write from memory, then check."),
        ),
        _step(
            "6", "Spelling focus: choose a strategy",
            "A good detective chooses the strategy that fits the word. Regular word: sound it out. Long word: split it. Word with parts: base word and parts. Tricky bit: Look, Say, Cover, Write, Check.\n\n"
            "This week's words: strat-e-gy, syl-la-ble, de-tec-tive, vow-el, con-so-nant, prac-tise. Decide which strategy suits each one best.",
            "'detective' is long, so split it. 'practise' has a tricky bit, the s and the ise ending. 'vowel' is short, with the tricky ow-el.",
            "Match the strategy to the word.",
            ("Which strategy best suits a long word like 'consonant'?", ["Split it into syllables", "Skip it", "Guess"], 0, "Splitting breaks a long word into short chunks."),
        ),
        _step(
            "7", "Check it in a dictionary",
            "A dictionary lists words in alphabetical order. To find a word, use the first letter, then the second, then the third. Guide words at the top of each page show the first and last word on that page.\n\n"
            "If you cannot find your spelling, try another way of spelling the first sound. For example, if 'kemistry' is not there, try 'chemistry'.",
            "To find 'detective', go to D, then find 'de', then 'det'.",
            "The dictionary is the detective's final check.",
            ("A dictionary lists words in...", ["alphabetical order", "order of length", "a random order"], 0, "Alphabetical order makes any word easy to find."),
        ),
    ],
    (
        "Crack the word 'unforgettable' as a detective. Step 1, vowels and beats: u, o, e, a, e. It has five beats, un-for-get-ta-ble. Step 2, base word and parts: un + forget + able. The base word forget is itself for + get. "
        "Step 3, tricky bit: the double t, because get doubles its last letter before an ending that starts with a vowel. Step 4, practise with Look, Say, Cover, Write, Check. "
        "Strategies used: split it, base word and parts, and Look, Say, Cover, Write, Check for the double t. Explanation: 'I split it into five beats and I remembered that get doubles its t before able.'"
    ),
    (
        "Type your answers in the practice boxes.\n"
        "Part A, vowels: write the vowels you can find in 'strategy', 'detective' and 'practise'.\n"
        "Part B, split it: split into syllables and write how many: syllable, consonant, vowel, strategy, detective.\n"
        "Part C, parts: write the base word and the prefix or suffix for each: unkind, careful, replaying, quickly.\n"
        "Part D, choose a strategy: for each word, say which strategy you would use and why: because, unforgettable, crunch.\n"
        "Your parent can check your answers against the answer key."
    ),
    (
        "You are a spelling detective with six case files: strategy, syllable, detective, vowel, consonant and practise.\n\n"
        "Stage 1 (vowels): type the vowels in each of the six words.\n"
        "Stage 2 (split): split each word into syllables with hyphens and type how many beats it has.\n"
        "Stage 3 (tricky bits): type the tricky part of each word, the bit you think a speller might get wrong.\n"
        "Stage 4 (practise): use Look, Say, Cover, Write, Check on each word. Type each from memory, then type which words you got right first time.\n"
        "Stage 5 (explain): choose one word and write at least three sentences explaining which strategies you used and why they worked."
    ),
    "Which of the four strategies do you think will help you most, and which word will you use it on next?",
    "Did I find the vowels, split each word, name the tricky bits, practise each word from memory, and explain the strategies I used?",
    [
        _q("Which letters are vowels?", ["a, e, i, o, u", "b, c, d, f, g", "s, t, r, n, m", "w, x, y, z"], 0, "The five vowels are a, e, i, o and u."),
        _q("What is a syllable?", ["One beat in a word", "A silent letter", "A kind of sentence", "A full stop"], 0, "A syllable is one beat."),
        _q("How many syllables are in 'detective'?", ["2", "3", "4", "5"], 1, "de-tec-tive."),
        _q("In 'unhappy' the prefix is...", ["un", "happy", "hap", "py"], 0, "Un is at the front and changes the meaning."),
        _q("In 'careful' the suffix is...", ["ful", "care", "car", "are"], 0, "Ful is the ending added to care."),
        _q("What is the first step in Look, Say, Cover, Write, Check?", ["Look and find the tricky part", "Write it", "Cover it", "Check it"], 0, "You look first and find the tricky bit."),
        _q("Which strategy suits a long word like 'consonant'?", ["Split it into syllables", "Skip it", "Guess", "Sound it out only"], 0, "Splitting breaks it into short chunks."),
        _q("A dictionary lists words in...", ["alphabetical order", "order of length", "order of difficulty", "no order"], 0, "Alphabetical order."),
        _q("What do you do if you spell a word wrong when checking?", ["Mark only the wrong part and try again", "Rub it all out and give up", "Ignore it", "Write it ten times without looking"], 0, "Mark the wrong part and try again."),
        _q("Which is the base word in 'replaying'?", ["play", "re", "ing", "replay"], 0, "Play is the base, with re at the front and ing at the end."),
    ],
    "Type your answers in the practice boxes and submit them.",
    "Extension: choose a long word from a book you are reading, then use at least two strategies to spell it and type how you did it.",
    [
        ("strategy", "A plan or method for doing something well"),
        ("syllable", "One beat in a word, with one vowel sound"),
        ("vowel", "One of the letters a, e, i, o, u"),
        ("consonant", "A letter that is not a vowel"),
        ("base word", "The main word before any prefix or suffix is added"),
        ("prefix", "A group of letters added at the front of a word"),
        ("suffix", "A group of letters added at the end of a word"),
        ("dictionary", "A book or website that lists words in alphabetical order with their spelling and meaning"),
    ],
    [
        _video("Syllables, prefixes and suffixes for kids (Kids Academy)", "Qz0LWrJDfx0",
               "Watch how to find syllables and how prefixes and suffixes change a word. Then answer the question below.",
               "Clap the syllables in your first and last name, then in this week's six words.",
               ("What does a prefix do to a word?", ["Adds to the front and can change the meaning", "Adds a full stop", "Takes letters away"], 0, "A prefix goes at the front of a base word and changes its meaning.")),
        _video("Prefixes and suffixes grammar lesson", "jujRYzE9Cxs",
               "Watch how to spot the root word, prefix and suffix. Notice how finding the base word helps you spell the rest.",
               "Find the base word in three long words from a book or magazine.",
               ("Why does finding the base word help you spell?", ["You only need to learn the parts", "It makes words shorter", "It is a spelling rule"], 0, "If you know the base word and the parts you can build the whole word.")),
    ],
    _sort(
        "Pick the strategy",
        "Sort each word under the strategy that helps most.",
        ["Sound it out", "Split it", "Base word and parts", "Look, Say, Cover, Write, Check"],
        [
            ("crunch", 0),
            ("strip", 0),
            ("detective", 1),
            ("consonant", 1),
            ("unkind", 2),
            ("replaying", 2),
            ("because", 3),
            ("separate", 3),
        ],
    ),
    [
        _wc("Which is a vowel?", ["e", "t", "p"], 0, "E is a vowel."),
        _wc("How many syllables are in 'strategy'?", ["2", "3", "4"], 1, "strat-e-gy."),
        _wc("How many syllables are in 'practise'?", ["1", "2", "3"], 1, "prac-tise."),
        _wc("What is the base word in 'quickly'?", ["quick", "ly", "qui"], 0, "Quick is the base and ly is the suffix."),
        _wc("Which is split correctly?", ["con-so-nant", "cons-on-ant", "co-nson-ant"], 0, "con-so-nant."),
        _wc("What does the C in Look, Say, Cover, Write, Check do?", ["You cover the word", "You copy it", "You count it"], 0, "Cover means hide the word before you write it."),
        _wc("Which word has a double letter you must remember?", ["unforgettable", "crunch", "strip"], 0, "The double t in unforgettable."),
        _wc("Which tool lists words in alphabetical order?", ["a dictionary", "a map", "a calendar"], 0, "A dictionary."),
    ],
    [
        {"key": "partA", "label": "Part A: vowels", "hint": "Type the vowels in 'strategy', 'detective' and 'practise'."},
        {"key": "partB", "label": "Part B: split it", "hint": "Split into syllables and give the number: syllable, consonant, vowel, strategy, detective."},
        {"key": "partC", "label": "Part C: parts", "hint": "Type the base word and the prefix or suffix: unkind, careful, replaying, quickly."},
        {"key": "partD", "label": "Part D: choose a strategy", "hint": "For each word type the strategy you would use and why: because, unforgettable, crunch."},
        {"key": "vowels", "label": "Vowels in my six words", "hint": "Type the vowels in strategy, syllable, detective, vowel, consonant and practise."},
        {"key": "split", "label": "Syllables in my six words", "hint": "Type each word with hyphens between the syllables, and the number of beats."},
        {"key": "tricky", "label": "Tricky bits", "hint": "Type the tricky part of each of the six words."},
        {"key": "recall", "label": "From memory", "hint": "After Look, Say, Cover, Write, Check, type each word from memory. Which did you get right first time?"},
        {"key": "explain", "label": "My explanation", "hint": "Choose one word and write at least three sentences about the strategies you used and why they worked."},
    ],
    [
        "Sounding out every word, including words with silent or unexpected letters",
        "Copying a word again and again without covering it",
        "Forgetting that a word can have a prefix and a suffix",
        "Not using the dictionary when unsure",
        "Practising the whole word instead of just the tricky bit",
    ],
    [
        "Choose five words you often misspell and use Look, Say, Cover, Write, Check on each for three days.",
        "Find ten words in a dictionary that start with un- and write the base word for each.",
    ],
    (
        "Part A: strategy a, e, y (y acts as a vowel); detective e, e, i, e; practise a, i, e. "
        "Part B: syl-la-ble (3), con-so-nant (3), vow-el (2), strat-e-gy (3), de-tec-tive (3). "
        "Part C: unkind = un + kind; careful = care + ful; replaying = re + play + ing; quickly = quick + ly. "
        "Part D: accept any sensible choice with a reason, for example because (Look, Say, Cover, Write, Check, because of the tricky au), unforgettable (split it and base word and parts), crunch (sound it out, because it is regular). "
        "Main task: accept any correct vowels, syllable splits (strat-e-gy, syl-la-ble, de-tec-tive, vow-el, con-so-nant, prac-tise) and sensible tricky bits, for example the y in strategy, the double l in syllable, the ow in vowel, the ise in practise. Accept any reasonable explanation of the strategies."
    ),
)

LESSON["spelling"] = {
    "focus": "Strategies and syllables",
    "teaching": (
        "Detectives choose the right tool for the job. Sound out regular words, split long words into beats, look for a base word and parts, and use Look, Say, Cover, Write, Check for the tricky bit.\n\n"
        "When you are still unsure, check a dictionary. Mark only the wrong part of a word, not the whole word, and try again."
    ),
    "words": [
        _w("strategy", "strat-e-gy", "three beats, and the y at the end acts as a vowel"),
        _w("syllable", "syl-la-ble", "three beats, starting with a y that sounds like i, and a double l"),
        _w("detective", "de-tec-tive", "three beats, and the ending is tive"),
        _w("vowel", "vow-el", "two beats, and the sound ow is spelled ow"),
        _w("consonant", "con-so-nant", "three beats, and it ends in ant"),
        _w("practise", "prac-tise", "two beats, and the verb ends in ise in Australian spelling"),
    ],
    "check": [
        _c("How many syllables are in 'detective'?", ["2", "3", "4"], 1, "de-tec-tive has three beats."),
    ],
}
LESSON.setdefault("learning_area", "English")
LESSON["spelling_focus"] = "Strategies and syllables"
LESSON["hoard_words"] = list(WORDS)
