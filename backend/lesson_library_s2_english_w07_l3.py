"""Stage 2 English, Week 7 Lesson 3: Pronouns and Cohesion (Language).
The child learns that pronouns replace nouns, which stops repetition and links sentences together, and learns to check that each pronoun clearly points back to one noun.
Spelling: -sion and -ssion review words: division, collision, conclusion, invasion, profession, session.
Outcome code note: uses EN2-CWT-01, the code that exists in nsw_outcomes.py. Check that Week 7 Lesson 2 uses the same code, because it was first written with EN2-CWT-02, which is not in the seed file.
Video status: NO VIDEO YET. Find one, check its transcript, then add it to the videos list. Do not register this module in lesson_library.py or add week 7 to BUILT_OUT_WEEKS until the whole week is built.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["division", "collision", "conclusion", "invasion", "profession", "session"]

KOALA_BAD = (
    "Koalas live in eucalyptus trees. Koalas eat eucalyptus leaves. Koalas sleep for most of the day because eucalyptus leaves give koalas very little energy."
)
KOALA_GOOD = (
    "Koalas live in eucalyptus trees. They eat eucalyptus leaves. They sleep for most of the day because the leaves give them very little energy."
)

LESSON = build(
    "s2-eng-w07-l3-pronouns-and-cohesion",
    "Pronouns and Cohesion",
    "Pronouns take the place of nouns so that writing does not repeat itself. Learn the main kinds of pronoun, how they link sentences together, and how to make sure each one clearly points to the right noun.",
    "Language: pronouns and cohesion",
    ["EN2-CWT-01", "EN2-SPELL-01"],
    {
        "EN2-CWT-01": "Primary. Plans, creates and revises written texts using sentence-level grammar, punctuation and word-level language. In this lesson the child uses pronouns to avoid repetition and to link sentences, and checks that each pronoun clearly refers to its noun.",
        "EN2-SPELL-01": "Selects, applies and describes appropriate phonological, orthographic and morphological generalisations and strategies when spelling, including review of words ending in -sion and -ssion (week 7 spelling focus).",
    },
    "We are learning to use pronouns to avoid repeating nouns and to link our sentences, and to spell words that end in -sion and -ssion.",
    [
        "I can explain what a pronoun is.",
        "I can use subject, object and possessive pronouns.",
        "I can replace repeated nouns with pronouns.",
        "I can check that a pronoun clearly points to one noun.",
        "I can use pronouns to link sentences in a paragraph.",
        "I can spell and use division, collision, conclusion, invasion, profession and session.",
    ],
    ["pronoun", "noun", "cohesion", "repetition", "possessive", "reference"],
    ["This lesson (everything you need is inside it)"],
    "Child can identify a noun and a verb (Week 2) and has written a classification paragraph in Lesson 2.",
    (
        "Why this matters. If you repeat the same noun in every sentence, writing sounds clumsy. Pronouns let you refer back to a noun without repeating it. They also join sentences together so the text flows. This joining is called cohesion.\n\n"
        "What a pronoun is. A pronoun is a word that takes the place of a noun or a noun group. Instead of saying koalas again and again, we say they.\n\n"
        "Subject pronouns. These do the action: I, you, he, she, it, we, they. For example: they eat eucalyptus leaves.\n\n"
        "Object pronouns. These receive the action: me, you, him, her, it, us, them. For example: the leaves give them very little energy.\n\n"
        "Possessive pronouns and words. These show who owns something: my, your, his, her, its, our, their, and mine, yours, ours, theirs. For example: their favourite food is eucalyptus.\n\n"
        "Clear reference. Every pronoun must clearly point back to one noun. In the sentence Mia told Jess that she won, we cannot tell who won. Fix it by using a name again: Mia told Jess that Mia won.\n\n"
        "The routine. First, read your paragraph. Second, circle any noun that is repeated close together. Third, replace some with a pronoun. Fourth, check each pronoun points to one clear noun. Fifth, keep some nouns so the reader never gets lost.\n\n"
        "A link to spelling. This week's spelling words are division, collision, conclusion, invasion, profession and session."
    ),
    [
        _step("1", "What a pronoun does", "A pronoun takes the place of a noun. It stops us repeating the same noun again and again.\n\nKoalas becomes they. A koala becomes it.", "Koalas eat leaves. They sleep a lot.", "A pronoun stands in for a noun.", ("Which word is a pronoun?", ["koala", "they", "leaves"], 1, "They takes the place of a noun.")),
        _step("2", "Subject pronouns", "Subject pronouns are the doer of the action: I, you, he, she, it, we, they.\n\nThe subject pronoun usually comes before the verb.", "She reads. They eat. We learn.", "The doer of the action.", ("Which is a subject pronoun?", ["them", "she", "mine"], 1, "She is a subject pronoun.")),
        _step("3", "Object pronouns", "Object pronouns come after the verb or after a word like to or with: me, you, him, her, it, us, them.\n\nThe leaves give them energy.", "The teacher helped us. Mum gave it to him.", "The receiver of the action.", ("Which is an object pronoun?", ["we", "us", "they"], 1, "Us comes after the verb, so it is an object pronoun.")),
        _step("4", "Possessive pronouns", "Possessive words show who owns something: my, your, his, her, its, our, their. Possessive pronouns stand alone: mine, yours, hers, ours, theirs.\n\nNote that its has no apostrophe when it shows ownership.", "That is their tree. The tree is theirs.", "They show ownership.", ("Which shows ownership?", ["their", "they", "them"], 0, "Their shows ownership.")),
        _step("5", "Clear reference", "A pronoun must clearly point to one noun. If two nouns could fit, the reader gets confused.\n\nFix it by using the noun again or by rewording.", "Unclear: Mia told Jess that she won. Clear: Mia told Jess that Mia won.", "One pronoun, one clear noun.", ("What is wrong with: Tom met Sam and he smiled?", ["It is unclear who smiled", "Nothing", "It has no verb"], 0, "He could be Tom or Sam.")),
        _step("6", "Cohesion and spelling", "Pronouns link one sentence to the next. Compare: Koalas live in trees. They eat leaves. Because they points back to koalas, the sentences connect.\n\nSpelling focus: division, collision, conclusion, invasion, profession and session. Division, collision, conclusion and invasion have a single s. Profession and session have a double s.", "The conclusion helped them understand the division.", "Link the sentences, then check.", ("Which is spelled correctly?", ["colishun", "collision", "collission"], 1, "Collision ends in -sion.")),
    ],
    (
        "Let's compare two versions of the same text. The first version repeats the word koalas in every sentence, and the word eucalyptus too. It sounds clumsy. In the second version, they replaces koalas, and the leaves and them replace the repeated nouns. The text now flows, because each pronoun points clearly back to koalas. Notice that the first sentence still uses the noun, so the reader knows who they is. Always start with the noun, then use the pronoun.\n\nVERSION 1: " + KOALA_BAD + "\n\nVERSION 2: " + KOALA_GOOD
    ),
    (
        "Type your answers in the practice boxes. Part A: type the pronoun that replaces the underlined words. Maya loves reading. Maya reads every night. The books were old. Maya liked the books. Part B: type the possessive word for each blank. This is ___ bag (belongs to me). That is ___ house (belongs to them). The dog wagged ___ tail. Part C: this sentence is unclear. Rewrite it so it is clear. Ben told Leo that he was late. Part D: type the correct word for each blank. Choose from division, collision, conclusion, invasion, profession and session. The two cars had a ___. A teacher has a very important ___. We had a long maths ___. Your parent can check your answers against the answer key."
    ),
    (
        "Improve a paragraph with pronouns. Typed answers go in the boxes.\n\n"
        "Stage 1 (read): read this paragraph. Penguins live in cold places. Penguins cannot fly. Penguins swim very fast. Penguins catch fish in the sea. Penguins keep penguins' chicks warm.\n"
        "Stage 2 (find): type the noun that is repeated too often.\n"
        "Stage 3 (replace): rewrite the paragraph and use they, them or their where it sounds right. Keep the noun in the first sentence.\n"
        "Stage 4 (check): type one pronoun from your paragraph and the noun it points to.\n"
        "Stage 5 (your own): write a short paragraph of four sentences about an animal you like. Use at least three pronouns.\n"
        "Stage 6 (reference check): underline every pronoun and make sure each one clearly points to one noun. Type any change you made.\n"
        "Stage 7 (spell): type your six spelling words and one sentence for each of collision, conclusion and session.\n\n"
        "Parent: check that the first sentence still names the animal, that pronouns match in number (they for more than one, it for one), that each pronoun has one clear noun, and that at least three pronouns are used. Accept any sensible wording."
    ),
    "Why should the first sentence use the noun instead of a pronoun?",
    "Did I replace repeated nouns with pronouns, keep the noun at the start, check that each pronoun points to one clear noun, and spell division, collision, conclusion, invasion, profession and session correctly?",
    [
        _q("What does a pronoun do?", ["Takes the place of a noun", "Shows an action", "Describes a noun", "Joins two clauses"], 0, "A pronoun takes the place of a noun."),
        _q("Which is a subject pronoun?", ["them", "us", "they", "him"], 2, "They is a subject pronoun."),
        _q("Which is an object pronoun?", ["she", "her", "I", "we"], 1, "Her is an object pronoun."),
        _q("Which shows ownership?", ["their", "them", "they", "it"], 0, "Their shows ownership."),
        _q("What is cohesion?", ["How sentences link together", "How loud you speak", "A kind of verb", "A type of spelling"], 0, "Cohesion is how sentences link."),
        _q("What is wrong with: Ana told Zoe that she was clever?", ["Unclear who she is", "No noun", "No verb", "Nothing"], 0, "She could be Ana or Zoe."),
        _q("Which pronoun replaces the girls?", ["he", "they", "it", "she"], 1, "They replaces more than one."),
        _q("Which is spelled correctly?", ["divishun", "division", "divission", "divizion"], 1, "Division ends in -sion."),
        _q("Which is spelled correctly?", ["profesion", "profeshun", "profession", "professon"], 2, "Profession ends in -ssion."),
        _q("Which is spelled correctly?", ["session", "seshun", "sesion", "sessin"], 0, "Session ends in -ssion."),
    ],
    "Type your answers in the practice boxes and submit them.",
    "Extension: take a paragraph from a book or magazine and circle every pronoun. For each, draw an arrow to the noun it points to.",
    [("pronoun", "A word that takes the place of a noun"), ("noun", "A word for a person, place, thing or idea"), ("cohesion", "How the parts of a text link together"), ("repetition", "Using the same word again and again"), ("possessive", "Showing who owns something"), ("reference", "The noun a pronoun points back to")],
    [],
    _sort("Which kind of pronoun?", "Sort each pronoun into the right group.", ["Subject", "Object", "Possessive"], [("they", 0), ("them", 1), ("their", 2), ("she", 0), ("us", 1), ("our", 2)]),
    [
        _wc("Which takes the place of a noun?", ["pronoun", "verb", "adjective"], 0, "A pronoun takes the place of a noun."),
        _wc("Which means how the parts of a text link?", ["cohesion", "division", "reference"], 0, "Cohesion is how a text links together."),
        _wc("Which means using the same word too often?", ["repetition", "possessive", "session"], 0, "Repetition is using the same word again and again."),
        _wc("Which is spelled correctly?", ["collision", "colision", "colishun"], 0, "Collision has a double l and ends in -sion."),
        _wc("Which is spelled correctly?", ["conclushun", "conclusion", "conclution"], 1, "Conclusion ends in -sion."),
        _wc("Which is spelled correctly?", ["invasion", "invashun", "invassion"], 0, "Invasion ends in -sion."),
        _wc("Which is spelled correctly?", ["profeshun", "profession", "profesion"], 1, "Profession ends in -ssion."),
        _wc("Which is spelled correctly?", ["sesion", "seshun", "session"], 2, "Session ends in -ssion."),
    ],
    [
        {"key": "partA", "label": "Part A: replace the noun", "hint": "Rewrite the Maya and books sentences using pronouns."},
        {"key": "partB", "label": "Part B: possessive words", "hint": "Fill the three blanks."},
        {"key": "partC", "label": "Part C: clear reference", "hint": "Rewrite the Ben and Leo sentence so it is clear."},
        {"key": "partD", "label": "Part D: -sion and -ssion words", "hint": "Fill the three blanks. Choose from division, collision, conclusion, invasion, profession and session."},
        {"key": "stage2", "label": "Repeated noun", "hint": "The noun that is repeated too often."},
        {"key": "stage3", "label": "Penguin paragraph", "hint": "Rewrite with pronouns. Keep the noun in the first sentence."},
        {"key": "stage4", "label": "Pronoun and noun", "hint": "One pronoun and the noun it points to."},
        {"key": "stage5", "label": "My paragraph", "hint": "Four sentences about an animal, with at least three pronouns."},
        {"key": "stage6", "label": "Reference check", "hint": "Any change you made after checking."},
        {"key": "spelling", "label": "Spelling words", "hint": "Type your six words and one sentence for each of collision, conclusion and session."},
    ],
    ["Using a pronoun with no clear noun", "Using he or she when two people could fit", "Using they for one thing", "Writing it's instead of its for ownership", "Replacing every noun so the text becomes unclear"],
    ["Read a paragraph and circle every pronoun, then draw an arrow to the noun it replaces.", "Practise your six spelling words by writing a sentence for each."],
    "Part A: accept Maya loves reading. She reads every night. The books were old. She liked them. Part B: my, their, its. Part C: accept Ben told Leo that Ben was late, or Ben told Leo that Leo was late, or a sensible rewording. Part D: collision, profession, session. Main task: Stage 2: penguins. Stage 3: accept a version such as Penguins live in cold places. They cannot fly. They swim very fast. They catch fish in the sea. They keep their chicks warm. Stage 4: accept any pronoun with the right noun. Stage 5 and 6: accept any sensible paragraph with at least three clear pronouns. Quiz answers: takes the place of a noun; they; her; their; how sentences link together; unclear who she is; they; division; profession; session.",
)

LESSON["spelling"] = {
    "focus": "-sion and -ssion review (the shun sound)",
    "teaching": "Division, collision, conclusion and invasion use -sion. Profession and session use -ssion. Say each word slowly and check the ending.",
    "words": [
        _w("division", "di-vi-sion", "from divide; single s"),
        _w("collision", "col-li-sion", "double l, single s"),
        _w("conclusion", "con-clu-sion", "from conclude; single s"),
        _w("invasion", "in-va-sion", "from invade; single s"),
        _w("profession", "pro-fes-sion", "double s before ion"),
        _w("session", "ses-sion", "double s before ion"),
    ],
    "check": [
        _c("Which is spelled correctly?", ["division", "divishun", "divission"], 0, "Division ends in -sion."),
        _c("Which is spelled correctly?", ["seshun", "sesion", "session"], 2, "Session ends in -ssion."),
    ],
}
LESSON["spelling_focus"] = "-sion and -ssion review (the shun sound)"
LESSON["hoard_words"] = list(WORDS)

if __name__ == "__main__":
    assert len(LESSON["quiz"]) == 10 and len(LESSON["word_challenges"]) == 8
    print("ok", LESSON["seed_key"])
