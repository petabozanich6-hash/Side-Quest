"""Stage 2 English, Week 7 Lesson 3: Pronouns and Cohesion (Language).
The child learns what pronouns are, how they replace repeated nouns, which pronoun to use for the doer of an action (I, he, she, we, they) and the receiver (me, him, her, us, them), how pronouns show belonging (my, her, their), how to make clear who or what a pronoun refers to, and how this helps a text hold together (cohesion).
Spelling: -sion and -ssion: revision, invasion, explosion, possession, profession, impression.
Outcomes: EN2-VOCAB-01 and EN2-SPELL-01, checked against lesson_library_s2_english_placeholders.py (Week 7, Lesson 3, Pronouns and cohesion, Language slot, spelling -sion and -ssion). Outcome wording is the official NESA text, with a short note on this lesson's focus.
Video status: one video attached, chosen from its description and transcript excerpts, not watched in full, so it carries a parent preview note. The lesson teaching was deepened with I or me and belonging pronouns.
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
    "Learn how pronouns take the place of nouns, which pronoun to choose (I or me, he or him, they or them, her or their), how to make it clear who or what a pronoun means, and how this makes writing flow smoothly.",
    "Language: pronouns and cohesion",
    ["EN2-VOCAB-01", "EN2-SPELL-01"],
    {
        "EN2-VOCAB-01": "Builds knowledge and use of Tier 1, Tier 2 and Tier 3 vocabulary through interacting, wide reading and writing, and by defining and analysing words. This lesson focuses on pronouns and how they help a text hold together.",
        "EN2-SPELL-01": "Selects, applies and describes appropriate phonological, orthographic and morphological generalisations and strategies when spelling in a range of contexts. This week's focus is words ending in -sion and -ssion.",
    },
    "We are learning what pronouns are, how to choose the right pronoun and use it so a text flows and is clear, and to spell words that end in -sion and -ssion.",
    [
        "I can explain what a pronoun is.",
        "I can replace a repeated noun with a pronoun.",
        "I can choose the right pronoun for one or for more than one.",
        "I can choose between I and me, he and him, she and her, we and us, and they and them.",
        "I can use pronouns such as my, her, its and their to show belonging.",
        "I can make sure it is clear who or what a pronoun means.",
        "I can explain how pronouns help a text flow.",
        "I can spell and use revision, invasion, explosion, possession, profession and impression.",
    ],
    ["noun", "pronoun", "refer", "cohesion", "repeat", "replace", "clear", "flow", "belonging"],
    ["This lesson (everything you need is inside it)", "Optional: a page from a book or your own writing to check"],
    "Child knows what a noun is (Week 2 Lesson 3) and has written a classification paragraph (Week 7 Lesson 2).",
    (
        "Why this matters. If a writer uses the same noun in every sentence, the writing sounds bumpy and boring. Pronouns fix this. They also help the sentences link together so the text flows. When sentences link well, we say the text has cohesion.\n\n"
        "What a pronoun is. A pronoun is a word that takes the place of a noun. Examples are he, she, it, we, they, him, her, them and I. Instead of saying Mia loves Mia's dog, we say Mia loves her dog.\n\n"
        "One or more than one. Use he, she or it for one person or thing. Use they or them for more than one. We means the speaker and at least one other person. Choose the pronoun that matches who or what you are talking about.\n\n"
        "Doer and receiver. Some pronouns are used for the person or thing that does the action: I, you, he, she, it, we and they. Other pronouns are used for the person or thing that the action happens to: me, you, him, her, it, us and them. We say She called me, not Her called I. A quick test for a pair like Mia and me: take the other person out and say the sentence again. Mia and I went to the park becomes I went to the park, which is right. Dad gave the ball to Mia and me becomes Dad gave the ball to me, which is right.\n\n"
        "Belonging. Some pronouns show that something belongs to someone: my, your, his, her, its, our and their. They go in front of a noun, as in their tree or her bag. A few stand alone, such as mine, yours, hers, ours and theirs, as in The bag is hers. The word its has no apostrophe when it shows belonging.\n\n"
        "Referring back. A pronoun refers to a noun that has already been named. Look at Koalas live in trees. They eat gum leaves. The word They refers back to koalas.\n\n"
        "Making it clear. A pronoun must be clear. If two people are named in a sentence, the reader may not know which one the pronoun means. In Zoe told Mia that she had won, we do not know who won. Fix it by using a name or by rewriting the sentence.\n\n"
        "Cohesion. Cohesion means the parts of a text link together smoothly. Pronouns are one way. Others are repeating a key word on purpose and using connecting words such as then, also and but. Good writers use a mix, so the text is neither bumpy nor confusing.\n\n"
        "A link to spelling. This week's spelling focus is words ending in -sion and -ssion. The -sion ending often says zhun, as in revision, invasion and explosion. The -ssion ending says shun, as in possession, profession and impression."
    ),
    [
        _step("1", "What is a pronoun?", "A pronoun is a word that takes the place of a noun. Examples are he, she, it, we and they.\n\nPronouns stop us from repeating the same noun again and again.", "Instead of Mia loves Mia's dog, we say Mia loves her dog.", "A pronoun stands in for a noun.", ("What is a pronoun?", ["A word that takes the place of a noun", "A word that names a place only", "A word that ends a sentence"], 0, "A pronoun takes the place of a noun.")),
        _step("2", "Replacing repeated nouns", "When the same noun starts every sentence, replace it with a pronoun after the first time.\n\nName the noun first, so the reader knows what the pronoun means.", "Koalas live in trees. They eat gum leaves. They sleep for most of the day.", "Name first, then use a pronoun.", ("Which pronoun replaces Koalas in Koalas have thick fur?", ["He", "They", "It"], 1, "Koalas is more than one, so we use They.")),
        _step("3", "One or more than one", "Use he, she or it for one person or thing, and they or them for more than one.\n\nWe means the speaker plus one or more other people.", "The koala sleeps. It has grey fur. The koalas sleep. They have grey fur.", "One: he, she, it. More than one: they.", ("Which pronoun replaces The koala in The koala sleeps all day?", ["They", "We", "It"], 2, "The koala is one animal, so we use It.")),
        _step("4", "The doer and the receiver", "Use I, he, she, we and they for the person who does the action. Use me, him, her, us and them for the person the action happens to.\n\nTo check Mia and me or Mia and I, take the other person out and see which sounds right.", "Mia and I went to the park. (I went.) Dad gave the ball to Mia and me. (Dad gave the ball to me.) She called me.", "Doer: I, he, she, we, they. Receiver: me, him, her, us, them.", ("Which is correct?", ["Mia and me went swimming.", "Mia and I went swimming.", "Me and Mia went swimming."], 1, "Take Mia out: I went swimming is correct, so Mia and I is correct.")),
        _step("5", "Pronouns that show belonging", "Some pronouns show who something belongs to: my, your, his, her, its, our and their. They go before a noun.\n\nSome stand alone: mine, yours, hers, ours and theirs. The word its has no apostrophe when it shows belonging.", "The koalas climbed down from their tree. The bag is hers. The koala hugged its branch.", "Belonging: my, your, his, her, its, our, their.", ("Which word fits? The koalas climbed down from ___ tree.", ["they", "their", "them"], 1, "Their shows that the tree belongs to the koalas.")),
        _step("6", "Making it clear", "A pronoun must clearly refer to one noun. If two people are named, the reader may not know which one you mean.\n\nFix it by using a name, or by rewriting the sentence.", "Unclear: Zoe told Mia that she had won. Clear: Zoe told Mia that Mia had won.", "Check who the pronoun means.", ("What is the problem with Sam told Ben he was late?", ["It has no full stop", "It has no verb", "We do not know who he is"], 2, "He could be Sam or Ben, so it is unclear.")),
        _step("7", "Cohesion", "Cohesion means the parts of a text link together smoothly. Pronouns help. So do key words repeated on purpose, and connecting words such as then and also.\n\nToo many pronouns can be confusing, so use a mix.", "Koalas live in trees. They eat gum leaves, and they also sleep a lot.", "Link the sentences.", ("What does cohesion mean?", ["The text is very long", "The parts of a text link together smoothly", "The words rhyme"], 1, "Cohesion means a text links together smoothly.")),
        _step("8", "Checking your own writing", "Read your writing aloud. Listen for a noun that repeats too much, for any pronoun where you cannot tell who it means, and for I or me and he or him mix-ups.\n\nFix each one, then read it again.", "Mia has a dog. Mia loves the dog. Better: Mia has a dog. She loves it.", "Read aloud, then fix.", ("Which version flows better?", ["Mia has a dog. Mia loves the dog.", "Dog Mia has loves Mia.", "Mia has a dog. She loves it."], 2, "The last version uses pronouns so it flows.")),
        _step("9", "Spelling focus: -sion and -ssion", "Words ending in -sion often say zhun, as in revision, invasion and explosion. Words ending in -ssion say shun, as in possession, profession and impression.\n\nSay the word slowly, listen to the ending, then write it.", "We did a revision of our words. That is my possession.", "Zhun is -sion. Shun after double s is -ssion.", ("Which is spelled correctly?", ["explosshun", "explosion", "explotion"], 1, "Explosion is spelled with -sion.")),
    ],
    (
        "Let's look at the repeated nouns in this paragraph and fix them with pronouns. Here it is: Koalas live in trees. Koalas eat gum leaves. Koalas sleep for most of the day. Koalas have thick grey fur. The word Koalas starts every sentence, and it sounds bumpy. I will keep the first Koalas, so the reader knows who we are talking about. Then I replace the others with They, because koalas is more than one. Here is the better paragraph: Koalas live in trees. They eat gum leaves. They sleep for most of the day. They have thick grey fur. Notice that each They refers back to koalas, and it is clear. Next, which pronoun? Mia and ___ went to the park. I take Mia out and say ___ went to the park. I went, not me went. So it is Mia and I. Now the receiver: Dad gave the ball to Mia and ___. I take Mia out: Dad gave the ball to ___. Dad gave the ball to me, not to I. So it is Mia and me. Now belonging: The koalas climbed down from ___ tree. The tree belongs to the koalas, so I use their. Now I will check a sentence that is unclear: Zoe told Mia that she had won the prize. Who won, Zoe or Mia? The reader cannot tell. I can fix it by writing: Zoe told Mia, You won the prize. Or I can use a name: Zoe told Mia that Mia had won the prize. Last, a short example with one thing: The kangaroo hopped across the paddock. It stopped to eat grass. It is one animal, so I use It. Using a mix of nouns and pronouns makes writing flow and keeps it clear.\n\n" + REPEATED + "\n\n" + BETTER
    ),
    (
        "Type your answers in the practice boxes. Part A: rewrite The kangaroo hopped. The kangaroo ate grass. using a pronoun for the second sentence. Part B: type who they means in Tom and Amy ran. They were fast. Part C: type the correct word for each blank: We did a ___ of our work before the test. A loud ___ shook the house. The picture made a strong ___ on me. Part D: type I or me for each blank, and say how you checked: Ben and ___ rode bikes. Mum gave a drink to Ben and ___. Your parent can check your answers against the answer key."
    ),
    (
        "Use the Koalas paragraph to do the tasks. Typed answers go in the boxes.\n\n" + REPEATED + "\n\n"
        "Stage 1 (find): type the noun that is repeated, and say how many times it appears.\n"
        "Stage 2 (rewrite): rewrite the paragraph, keeping the first sentence and using a pronoun in the other three. Type your new paragraph.\n"
        "Stage 3 (clear): the sentence Zoe told Mia that she had won the prize is unclear. Type one way to fix it.\n"
        "Stage 4 (choose): type the right pronoun for each blank: The echidna digs. ___ has strong claws. The dingoes howl. ___ are loud. My sister and I swim. ___ love the water. Dad called Mia and ___ for dinner (I or me). The wombats stayed in ___ burrow (they, them or their).\n"
        "Stage 5 (write): write four sentences about an animal or a person you like. Use at least two pronouns, and include one that shows belonging, such as her, his or their. Type your sentences.\n"
        "Stage 6 (check): read your writing aloud. Type one pronoun and the noun it refers to, and say whether it is clear.\n"
        "Stage 7 (spell): type your six spelling words and one sentence for each of revision, explosion and impression.\n\n"
        "Parent: check that the first noun is kept and later nouns are replaced with matching pronouns (They for plural, It, He or She for one), that the rewrite flows, that the fix for the unclear sentence names who won, that the child can explain the take-the-other-person-out test for I and me, and that the child's own sentences use pronouns that clearly refer back to a noun. Accept any sensible fix and topic."
    ),
    "Which was harder for you: choosing the right pronoun (such as I or me), or making sure it was clear who it meant, and what will you do next time?",
    "Did I use pronouns in place of repeated nouns, choose pronouns that match one or more than one, choose between I and me and between their and them, make it clear who each pronoun means, and spell revision, invasion, explosion, possession, profession and impression correctly?",
    [
        _q("What is a pronoun?", ["A word that takes the place of a noun", "A word that names a place only", "A word that joins sentences", "A full stop"], 0, "A pronoun takes the place of a noun."),
        _q("Which pronoun replaces Echidnas in Echidnas have spines?", ["He", "They", "It", "We"], 1, "Echidnas is more than one, so we use They."),
        _q("Which is correct? Mia and ___ went swimming.", ["me", "I", "my", "mine"], 1, "Take Mia out: I went swimming is correct, so Mia and I."),
        _q("What does cohesion mean?", ["Words that rhyme", "A very long sentence", "The parts of a text link together smoothly", "A picture in a book"], 2, "Cohesion means a text links together smoothly."),
        _q("Why is it a problem to use the same noun to start every sentence?", ["It is a spelling mistake", "It sounds repeated and bumpy", "It makes the text too short", "It breaks the full stop rule"], 1, "Repeating the same noun sounds bumpy, so pronouns help."),
        _q("What is wrong with Sam told Ben he was late?", ["It has no capital letter", "It has no verb", "We do not know who he means", "It has too many full stops"], 2, "He could mean Sam or Ben, so it is unclear."),
        _q("Which is correct? The teacher gave the book to ___.", ["she", "hers", "her", "they"], 2, "Her is the receiver pronoun: the teacher gave the book to her."),
        _q("Which word fits? The koalas climbed down from ___ tree.", ["they", "them", "their", "we"], 2, "Their shows that the tree belongs to the koalas."),
        _q("Which is spelled correctly?", ["invashun", "invasion", "invassion", "invazion"], 1, "Invasion is spelled with -sion."),
        _q("Which is spelled correctly?", ["posession", "possesion", "possession", "poshun"], 2, "Possession is spelled with -ssion."),
    ],
    "Type your answers in the practice boxes and submit them.",
    "Extension: choose a page of your favourite book. Find three pronouns and write the noun each one refers to. Then find a place where the author repeats a noun on purpose, and say why.",
    [("noun", "A word that names a person, place, thing or idea"), ("pronoun", "A word that takes the place of a noun, such as he, she, it or they"), ("refer", "To point back to something already named"), ("cohesion", "When the parts of a text link together smoothly"), ("repeat", "To say or write the same thing again"), ("replace", "To put one thing in the place of another"), ("clear", "Easy to understand"), ("flow", "To read smoothly without bumps"), ("belonging", "Showing who or what owns something, as in my, her or their")],
    [
        _video(
            "How to Teach Kids 4 Types of Pronouns", "Ht2R55PF8mo",
            "Watch for three groups of pronouns. Subject pronouns are I, you, she, he, it, we and they, and they tell who or what does the action. Object pronouns are me, you, her, him, it, us and them, and they tell who or what the action affects. Possessive pronouns, such as my, your, her, his, its, our and their, show who or what has something. Pause after each group and say a sentence of your own. You can stop before the part on indefinite pronouns, because that is not part of this lesson. Parent: this video has not been watched in full, so please preview it before your child watches. The video's names for the groups differ a little from this lesson's words doer and receiver.",
            "If the video will not play, reread Steps 4 and 5 and say one sentence aloud for each group.",
            ("Which is correct?", ["Dad gave the ball to I.", "Dad gave the ball to me.", "Dad gave the ball to my."], 1, "Me is the receiver pronoun, so Dad gave the ball to me."),
        ),
    ],
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
        {"key": "partD", "label": "Part D: I or me", "hint": "Type I or me for each blank and say how you checked."},
        {"key": "stage1", "label": "Repeated noun", "hint": "The noun and how many times it appears."},
        {"key": "stage2", "label": "My rewrite", "hint": "Keep the first sentence and use a pronoun in the others."},
        {"key": "stage3", "label": "Fix the unclear sentence", "hint": "Make it clear who won."},
        {"key": "stage4", "label": "Choose the pronoun", "hint": "One for each blank, including I or me and their, them or they."},
        {"key": "stage5", "label": "My sentences", "hint": "Four sentences with at least two pronouns, one showing belonging."},
        {"key": "stage6", "label": "My check", "hint": "One pronoun, the noun it refers to, and whether it is clear."},
        {"key": "spelling", "label": "Spelling words", "hint": "Type your six words and a sentence each for revision, explosion and impression."},
    ],
    ["Using the same noun at the start of every sentence", "Using they for one person or thing", "Using a pronoun before naming who it means", "Using he or she when it could mean two different people", "Saying me and Mia went instead of Mia and I went", "Writing it's instead of its to show belonging", "Spelling possession, profession or impression with only one s"],
    ["Read your writing aloud and listen for repeated nouns.", "Practise your six spelling words by writing a sentence for each."],
    "Part A: accept The kangaroo hopped. It ate grass. Part B: Tom and Amy. Part C: revision, explosion, impression in that order. Part D: Ben and I rode bikes; Mum gave a drink to Ben and me; accept an explanation such as take Ben out and the sentence still makes sense with I or me. Main task Stage 1: koalas (or Koalas), four times. Stage 2: accept Koalas live in trees. They eat gum leaves. They sleep for most of the day. They have thick grey fur. Stage 3: accept any fix that makes clear who won, such as Zoe told Mia that Mia had won the prize, or Zoe told Mia, You won the prize. Stage 4: It (or He or She); They; We; me; their. Stage 5: accept four sensible sentences with at least two pronouns that match what they refer to and one showing belonging. Stage 6: accept any pronoun with the right noun and a sensible judgement. Stage 7: accept six correctly spelled words and sentences. Quiz answers: a word that takes the place of a noun; They; I; the parts of a text link together smoothly; it sounds repeated and bumpy; we do not know who he means; her; their; invasion; possession.",
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
