"""Stage 2 English, Week 7 Lesson 3: Pronouns and Cohesion (Language).
The child learns what pronouns are, how they replace repeated nouns, how to make clear who or what a pronoun refers to, and how this helps a text hold together (cohesion).
Spelling: -sion and -ssion: revision, invasion, explosion, possession, profession, impression.
Outcomes: EN2-VOCAB-01 and EN2-SPELL-01, checked against lesson_library_s2_english_placeholders.py (Week 7, Lesson 3, Pronouns and cohesion, Language slot, spelling -sion and -ssion). Outcome wording is the official NESA text, with a short note on this lesson's focus.
Video status: no video is attached to this lesson, because none has been found and checked.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["revision", "invasion", "explosion", "possession", "profession", "impression"]

REPEATED = (
    "Koalas live in trees. Koalas eat gum leaves. Koalas sleep for most of the day. Koalas have thick grey fur."
)

BETTER = (
    "Koalas live in trees. They eat gum leaves. They sleep for most of the day. They have thick grey fur."
)

LESSON = build(
    "s2-eng-w07-l3-pronouns-cohesion",
    "Pronouns and Cohesion",
    "Learn how pronouns take the place of nouns, how to make it clear who or what a pronoun means, and how this makes writing flow smoothly.",
    "Language: pronouns and cohesion",
    ["EN2-VOCAB-01", "EN2-SPELL-01"],
    {
        "EN2-VOCAB-01": "Builds knowledge and use of Tier 1, Tier 2 and Tier 3 vocabulary through interacting, wide reading and writing, and by defining and analysing words. This lesson focuses on pronouns and how they help a text hold together.",
        "EN2-SPELL-01": "Selects, applies and describes appropriate phonological, orthographic and morphological generalisations and strategies when spelling in a range of contexts. This week's focus is words ending in -sion and -ssion.",
    },
    "We are learning what pronouns are, how to use them so a text flows and is clear, and to spell words that end in -sion and -ssion.",
    [
        "I can explain what a pronoun is.",
        "I can replace a repeated noun with a pronoun.",
        "I can choose the right pronoun for one or for more than one.",
        "I can make sure it is clear who or what a pronoun means.",
        "I can explain how pronouns help a text flow.",
        "I can spell and use revision, invasion, explosion, possession, profession and impression.",
    ],
    ["noun", "pronoun", "refer", "cohesion", "repeat", "replace", "clear", "flow"],
    ["This lesson (everything you need is inside it)", "Optional: a page from a book or your own writing to check"],
    "Child knows what a noun is (Week 2 Lesson 3) and has written a classification paragraph (Week 7 Lesson 2).",
    (
        "Why this matters. If a writer uses the same noun in every sentence, the writing sounds bumpy and boring. Pronouns fix this. They also help the sentences link together so the text flows. When sentences link well, we say the text has cohesion.\n\n"
        "What a pronoun is. A pronoun is a word that takes the place of a noun. Examples are he, she, it, we, they, him, her, them and I. Instead of saying Mia loves Mia's dog, we say Mia loves her dog.\n\n"
        "One or more than one. Use he, she or it for one person or thing. Use they or them for more than one. We means the speaker and at least one other person. Choose the pronoun that matches who or what you are talking about.\n\n"
        "Referring back. A pronoun refers to a noun that has already been named. Look at Koalas live in trees. They eat gum leaves. The word They refers back to koalas.\n\n"
        "Making it clear. A pronoun must be clear. If two people are named in a sentence, the reader may not know which one the pronoun means. In Zoe told Mia that she had won, we do not know who won. Fix it by using a name or by rewriting the sentence.\n\n"
        "Cohesion. Cohesion means the parts of a text link together smoothly. Pronouns are one way. Others are repeating a key word on purpose and using connecting words such as then, also and but. Good writers use a mix, so the text is neither bumpy nor confusing.\n\n"
        "A link to spelling. This week's spelling focus is words ending in -sion and -ssion. The -sion ending often says zhun, as in revision, invasion and explosion. The -ssion ending says shun, as in possession, profession and impression."
    ),
    [
        _step("1", "What is a pronoun?", "A pronoun is a word that takes the place of a noun. Examples are he, she, it, we and they.\n\nPronouns stop us from repeating the same noun again and again.", "Instead of Mia loves Mia's dog, we say Mia loves her dog.", "A pronoun stands in for a noun.", ("What is a pronoun?", ["A word that takes the place of a noun", "A word that names a place only", "A word that ends a sentence"], 0, "A pronoun takes the place of a noun.")),
        _step("2", "Replacing repeated nouns", "When the same noun starts every sentence, replace it with a pronoun after the first time.\n\nName the noun first, so the reader knows what the pronoun means.", "Koalas live in trees. They eat gum leaves. They sleep for most of the day.", "Name first, then use a pronoun.", ("Which pronoun replaces Koalas in Koalas have thick fur?", ["They", "He", "It"], 0, "Koalas is more than one, so we use They.")),
        _step("3", "One or more than one", "Use he, she or it for one person or thing, and they or them for more than one.\n\nWe means the speaker plus one or more other people.", "The koala sleeps. It has grey fur. The koalas sleep. They have grey fur.", "One: he, she, it. More than one: they.", ("Which pronoun replaces The koala in The koala sleeps all day?", ["It", "They", "We"], 0, "The koala is one animal, so we use It.")),
        _step("4", "Making it clear", "A pronoun must clearly refer to one noun. If two people are named, the reader may not know which one you mean.\n\nFix it by using a name, or by rewriting the sentence.", "Unclear: Zoe told Mia that she had won. Clear: Zoe told Mia that Mia had won.", "Check who the pronoun means.", ("What is the problem with Sam told Ben he was late?", ["We do not know who he is", "It has no full stop", "It has no verb"], 0, "He could be Sam or Ben, so it is unclear.")),
        _step("5", "Cohesion", "Cohesion means the parts of a text link together smoothly. Pronouns help. So do key words repeated on purpose, and connecting words such as then and also.\n\nToo many pronouns can be confusing, so use a mix.", "Koalas live in trees. They eat gum leaves, and they also sleep a lot.", "Link the sentences.", ("What does cohesion mean?", ["The parts of a text link together smoothly", "The text is very long", "The words rhyme"], 0, "Cohesion means a text links together smoothly.")),
        _step("6", "Checking your own writing", "Read your writing aloud. Listen for a noun that repeats too much, and for any pronoun where you cannot tell who it means.\n\nFix each one, then read it again.", "Mia has a dog. Mia loves the dog. Better: Mia has a dog. She loves it.", "Read aloud, then fix.", ("Which version flows better?", ["Mia has a dog. She loves it.", "Mia has a dog. Mia loves the dog.", "Dog Mia has loves Mia."], 0, "The first version uses pronouns so it flows.")),
        _step("7", "Spelling focus: -sion and -ssion", "Words ending in -sion often say zhun, as in revision, invasion and explosion. Words ending in -ssion say shun, as in possession, profession and impression.\n\nSay the word slowly, listen to the ending, then write it.", "We did a revision of our words. That is my possession.", "Zhun is -sion. Shun after double s is -ssion.", ("Which is spelled correctly?", ["explosion", "explosshun", "explotion"], 0, "Explosion is spelled with -sion.")),
    ],
    (
        "Let's look at the repeated nouns in this paragraph and fix them with pronouns. Here it is: Koalas live in trees. Koalas eat gum leaves. Koalas sleep for most of the day. Koalas have thick grey fur. The word Koalas starts every sentence, and it sounds bumpy. I will keep the first Koalas, so the reader knows who we are talking about. Then I replace the others with They, because koalas is more than one. Here is the better paragraph: Koalas live in trees. They eat gum leaves. They sleep for most of the day. They have thick grey fur. Notice that each They refers back to koalas, and it is clear. Now I will check a sentence that is unclear: Zoe told Mia that she had won the prize. Who won, Zoe or Mia? The reader cannot tell. I can fix it by writing: Zoe told Mia, You won the prize. Or I can use a name: Zoe told Mia that Mia had won the prize. Last, a short example with one thing: The kangaroo hopped across the paddock. It stopped to eat grass. It is one animal, so I use It. Using a mix of nouns and pronouns makes writing flow and keeps it clear.\n\n" + REPEATED + "\n\n" + BETTER
    ),
    (
        "Type your answers in the practice boxes. Part A: rewrite The kangaroo hopped. The kangaroo ate grass. using a pronoun for the second sentence. Part B: type who they means in Tom and Amy ran. They were fast. Part C: type the correct word for each blank: We did a ___ of our work before the test. A loud ___ shook the house. The picture made a strong ___ on me. Your parent can check your answers against the answer key."
    ),
    (
        "Use the Koalas paragraph to do the tasks. Typed answers go in the boxes.\n\n" + REPEATED + "\n\n"
        "Stage 1 (find): type the noun that is repeated, and say how many times it appears.\n"
        "Stage 2 (rewrite): rewrite the paragraph, keeping the first sentence and using a pronoun in the other three. Type your new paragraph.\n"
        "Stage 3 (clear): the sentence Zoe told Mia that she had won the prize is unclear. Type one way to fix it.\n"
        "Stage 4 (choose): type the right pronoun for each blank: The echidna digs. ___ has strong claws. The dingoes howl. ___ are loud. My sister and I swim. ___ love the water.\n"
        "Stage 5 (write): write four sentences about an animal or a person you like. Use at least two pronouns. Type your sentences.\n"
        "Stage 6 (check): read your writing aloud. Type one pronoun and the noun it refers to, and say whether it is clear.\n"
        "Stage 7 (spell): type your six spelling words and one sentence for each of revision, explosion and impression.\n\n"
        "Parent: check that the first noun is kept and later nouns are replaced with matching pronouns (They for plural, It, He or She for one), that the rewrite flows, that the fix for the unclear sentence names who won, and that the child's own sentences use pronouns that clearly refer back to a noun. Accept any sensible fix and topic."
    ),
    "Which was harder for you: choosing the right pronoun, or making sure it was clear who it meant, and what will you do next time?",
    "Did I use pronouns in place of repeated nouns, choose pronouns that match one or more than one, make it clear who each pronoun means, and spell revision, invasion, explosion, possession, profession and impression correctly?",
    [
        _q("What is a pronoun?", ["A word that takes the place of a noun", "A word that names a place only", "A word that joins sentences", "A full stop"], 0, "A pronoun takes the place of a noun."),
        _q("Which pronoun replaces Echidnas in Echidnas have spines?", ["They", "He", "It", "We"], 0, "Echidnas is more than one, so we use They."),
        _q("Which pronoun replaces Mia in Mia kicked the ball?", ["She", "They", "It", "We"], 0, "Mia is one girl, so we use She."),
        _q("What does cohesion mean?", ["The parts of a text link together smoothly", "Words that rhyme", "A very long sentence", "A picture in a book"], 0, "Cohesion means a text links together smoothly."),
        _q("Why is it a problem to use the same noun to start every sentence?", ["It sounds repeated and bumpy", "It is a spelling mistake", "It makes the text too short", "It breaks the full stop rule"], 0, "Repeating the same noun sounds bumpy, so pronouns help."),
        _q("What is wrong with Sam told Ben he was late?", ["We do not know who he means", "It has no capital letter", "It has no verb", "It has too many full stops"], 0, "He could mean Sam or Ben, so it is unclear."),
        _q("Which pronoun replaces The koala in The koala sleeps all day?", ["It", "They", "We", "You"], 0, "The koala is one animal, so we use It."),
        _q("In Dad and I went shopping. We bought fruit., who is We?", ["Dad and I", "Only Dad", "Only I", "The fruit"], 0, "We means Dad and I."),
        _q("Which is spelled correctly?", ["invashun", "invasion", "invassion", "invazion"], 1, "Invasion is spelled with -sion."),
        _q("Which is spelled correctly?", ["posession", "possesion", "possession", "poshun"], 2, "Possession is spelled with -ssion."),
    ],
    "Type your answers in the practice boxes and submit them.",
    "Extension: choose a page of your favourite book. Find three pronouns and write the noun each one refers to. Then find a place where the author repeats a noun on purpose, and say why.",
    [("noun", "A word that names a person, place, thing or idea"), ("pronoun", "A word that takes the place of a noun, such as he, she, it or they"), ("refer", "To point back to something already named"), ("cohesion", "When the parts of a text link together smoothly"), ("repeat", "To say or write the same thing again"), ("replace", "To put one thing in the place of another"), ("clear", "Easy to understand"), ("flow", "To read smoothly without bumps")],
    [],
    _sort("Noun or pronoun?", "Sort each word into noun or pronoun.", ["Noun", "Pronoun"], [("she", 1), ("kangaroo", 0), ("they", 1), ("Mia", 0), ("it", 1), ("we", 1), ("echidna", 0), ("them", 1)]),
    [
        _wc("Which word takes the place of a noun?", ["pronoun", "title", "caption"], 0, "A pronoun takes the place of a noun."),
        _wc("Which word means the parts of a text link together smoothly?", ["cohesion", "summary", "feature"], 0, "Cohesion means a text links together smoothly."),
        _wc("Which means to point back to something already named?", ["retell", "refer", "replace"], 1, "To refer is to point back to something already named."),
        _wc("Which means to put one thing in the place of another?", ["repeat", "summarise", "replace"], 2, "To replace is to put one thing in the place of another."),
        _wc("Which is spelled correctly?", ["revishun", "revision", "revission"], 1, "Revision is spelled with -sion."),
        _wc("Which is spelled correctly?", ["explosion", "explosshun", "explotion"], 0, "Explosion is spelled with -sion."),
        _wc("Which is spelled correctly?", ["profesion", "profeshun", "profession"], 2, "Profession is spelled with -ssion."),
        _wc("Which is spelled correctly?", ["impresion", "impression", "impreshun"], 1, "Impression is spelled with -ssion."),
    ],
    [
        {"key": "partA", "label": "Part A: use a pronoun", "hint": "Rewrite the second sentence about the kangaroo."},
        {"key": "partB", "label": "Part B: who does it mean?", "hint": "Who does They mean?"},
        {"key": "partC", "label": "Part C: -sion and -ssion words", "hint": "revision, explosion, impression."},
        {"key": "stage1", "label": "Repeated noun", "hint": "The noun and how many times it appears."},
        {"key": "stage2", "label": "My rewrite", "hint": "Keep the first sentence and use a pronoun in the others."},
        {"key": "stage3", "label": "Fix the unclear sentence", "hint": "Make it clear who won."},
        {"key": "stage4", "label": "Choose the pronoun", "hint": "One for each blank."},
        {"key": "stage5", "label": "My sentences", "hint": "Four sentences with at least two pronouns."},
        {"key": "stage6", "label": "My check", "hint": "One pronoun, the noun it refers to, and whether it is clear."},
        {"key": "spelling", "label": "Spelling words", "hint": "Type your six words and a sentence each for revision, explosion and impression."},
    ],
    ["Using the same noun at the start of every sentence", "Using they for one person or thing", "Using a pronoun before naming who it means", "Using he or she when it could mean two different people", "Spelling possession, profession or impression with only one s"],
    ["Read your writing aloud and listen for repeated nouns.", "Practise your six spelling words by writing a sentence for each."],
    "Part A: accept The kangaroo hopped. It ate grass. Part B: Tom and Amy. Part C: revision, explosion, impression in that order. Main task Stage 1: koalas (or Koalas), four times. Stage 2: accept Koalas live in trees. They eat gum leaves. They sleep for most of the day. They have thick grey fur. Stage 3: accept any fix that makes clear who won, such as Zoe told Mia that Mia had won the prize, or Zoe told Mia, You won the prize. Stage 4: It (or He or She); They; We. Stage 5: accept four sensible sentences with at least two pronouns that match what they refer to. Stage 6: accept any pronoun with the right noun and a sensible judgement. Stage 7: accept six correctly spelled words and sentences. Quiz answers: a word that takes the place of a noun; They; She; the parts of a text link together smoothly; it sounds repeated and bumpy; we do not know who he means; It; Dad and I; invasion; possession.",
)

LESSON["spelling"] = {
    "focus": "-sion and -ssion (the zhun and shun sounds)",
    "teaching": "The ending -sion often says zhun, as in revision, invasion and explosion. The ending -ssion says shun, as in possession, profession and impression. Say the word slowly, listen to the ending, then write it.",
    "words": [
        _w("revision", "re-vi-sion", "checking and improving your work, ends in zhun"),
        _w("invasion", "in-va-sion", "entering a place to take it over, ends in zhun"),
        _w("explosion", "ex-plo-sion", "a sudden loud burst, ends in zhun"),
        _w("possession", "pos-ses-sion", "something that you own, double s twice"),
        _w("profession", "pro-fes-sion", "a job that needs training, double s"),
        _w("impression", "im-pres-sion", "a feeling or idea about something, double s"),
    ],
    "check": [
        _c("Which is spelled correctly?", ["explosion", "explosshun", "explotion"], 0, "Explosion is spelled with -sion."),
        _c("Which is spelled correctly?", ["profesion", "profeshun", "profession"], 2, "Profession is spelled with -ssion."),
    ],
}
LESSON["spelling_focus"] = "-sion and -ssion (the zhun and shun sounds)"
LESSON["hoard_words"] = list(WORDS)

if __name__ == "__main__":
    assert len(LESSON["quiz"]) == 10 and len(LESSON["word_challenges"]) == 8
    print("ok", LESSON["seed_key"])
