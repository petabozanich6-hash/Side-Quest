"""Stage 2 English, Week 8 Lesson 3: Timeless Present Tense (Language).
The child learns why information reports use the timeless present tense, how a verb agrees with a singular or plural subject (an echidna digs, echidnas dig), how verb endings change (catches, carries), which words to avoid in a report (was, will, I, yesterday), and how to choose precise verbs. The model paragraph describes the echidna, continuing Week 8 Lesson 2.
Spelling: plurals: classes, bunches, leaves, shelves, mice, teeth (the same list as Week 8 Lesson 2).
Outcomes: EN2-VOCAB-01 and EN2-SPELL-01, checked against lesson_library_s2_english_placeholders.py (Week 8, Lesson 3, Timeless present tense, language slot, spelling plurals). Outcome wording is the official NESA text, with a short note on this lesson's focus.
Video status: two videos attached (present simple for facts; irregular plurals song), chosen from search descriptions and transcript excerpts. They have not been watched in full, so each carries a parent preview note.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["classes", "bunches", "leaves", "shelves", "mice", "teeth"]

MODEL = (
    "MODEL PARAGRAPH: ECHIDNAS (TIMELESS PRESENT TENSE)\n\n"
    "Echidnas are small, spiny mammals that live across Australia. "
    "An echidna has sharp spines on its back and a long, thin snout. "
    "Echidnas use their sticky tongues to catch ants and termites. "
    "A female echidna lays an egg, and the baby is called a puggle. "
    "Echidnas dig into the soil to stay safe."
)

LESSON = build(
    "s2-eng-w08-l3-timeless-present-tense",
    "Timeless Present Tense",
    "Learn why information reports are written in the timeless present tense, how verbs agree with singular and plural subjects, and how to choose precise verbs.",
    "Language: timeless present tense",
    ["EN2-VOCAB-01", "EN2-SPELL-01"],
    {
        "EN2-VOCAB-01": "Builds knowledge and use of Tier 1, Tier 2 and Tier 3 vocabulary through interacting, wide reading and writing, and by defining and analysing words. This lesson focuses on precise present-tense verbs and the language of grammar, such as tense, singular and plural.",
        "EN2-SPELL-01": "Selects, applies and describes appropriate phonological, orthographic and morphological generalisations and strategies when spelling in a range of contexts. This week's focus is plurals: -s, -es, -ves and irregular plurals.",
    },
    "We are learning how to write facts in the timeless present tense, to make verbs match their subjects, to choose precise verbs, and to spell plurals.",
    [
        "I can explain what the present tense is and why reports use it.",
        "I can tell a present tense sentence from a past or future one.",
        "I can make a verb match a singular subject (an echidna digs).",
        "I can make a verb match a plural subject (echidnas dig).",
        "I can spell verbs such as catches and carries.",
        "I can fix a report that slips into the past or future tense.",
        "I can choose a precise verb instead of a vague one.",
        "I can spell and use classes, bunches, leaves, shelves, mice and teeth.",
    ],
    ["tense", "present tense", "verb", "subject", "singular", "plural", "agree", "precise"],
    ["This lesson (everything you need is inside it)", "Paper or a computer for writing"],
    "Child has written a description paragraph (Week 8 Lesson 2), can tell facts from opinions (Week 8 Lesson 1), and knows that verbs are doing or being words.",
    (
        "Why this matters. An information report tells facts that are true all the time, not a story about one day. To show this, we write in the present tense. When facts are always true, we call this the timeless present tense. It tells the reader what something is like, not what it did yesterday.\n\n"
        "What tense means. Tense tells us when something happens. The past tense tells what has already happened, such as the echidna dug. The present tense tells what happens now or all the time, such as the echidna digs. The future tense tells what will happen, such as the echidna will dig.\n\n"
        "Timeless present. In a report we write facts, such as Echidnas live across Australia. This is true today, and it was true last year, so we use the present tense. We do not write Echidnas lived or Echidnas will live.\n\n"
        "Singular and plural subjects. The subject is who or what the sentence is about. A singular subject is one thing, and the verb usually adds s: an echidna digs, a koala sleeps, it has. A plural subject is more than one thing, and the verb stays in its plain form: echidnas dig, koalas sleep, they have. The verb agrees with its subject.\n\n"
        "Verb endings. After ch, sh, s, x, z or o, add es: an echidna catches, pushes and goes. When a verb ends in a consonant and y, change the y to i and add es: it carries, it flies. Be, have and do are irregular: it is, they are; it has, they have.\n\n"
        "Words to avoid. Reports leave out words that point to one time or one person, such as yesterday, last week, I, was, went and will. They also leave out opinions.\n\n"
        "Precise verbs. A precise verb tells exactly what happens. Feeds on, burrows, hunts and defends say more than does, goes and gets. Using precise verbs builds your vocabulary and makes a report clearer.\n\n"
        "A link to spelling. This week's spelling focus is plurals. The ending that makes a plural noun, such as classes and bunches, is the same as the ending that makes a verb agree with a singular subject, such as catches and pushes. Words ending in f or fe often change to ves, as in leaves and shelves. Some plurals are irregular, as in mice and teeth."
    ),
    [
        _step("1", "What is tense?", "Tense tells us when something happens.\n\nThe past tense tells what already happened. The present tense tells what happens now or all the time. The future tense tells what will happen.", "Past: The echidna dug. Present: The echidna digs. Future: The echidna will dig.", "Tense tells when.", ("Which sentence is in the present tense?", ["The echidna dug.", "The echidna digs.", "The echidna will dig."], 1, "Digs is the present tense.")),
        _step("2", "Timeless present in reports", "A report tells facts that are true all the time, so we write in the timeless present tense.\n\nWe do not tell a story about one day.", "Echidnas live across Australia. This is a fact that is always true.", "Facts that are always true use the present tense.", ("Which sentence fits an information report?", ["Echidnas lived in Australia.", "Echidnas live across Australia.", "Echidnas will live in Australia."], 1, "A report uses the timeless present tense.")),
        _step("3", "One thing: add s", "The subject is who or what the sentence is about. When the subject is one thing, the verb usually adds s.\n\nThe verb agrees with its subject.", "An echidna digs. A koala sleeps. It has sharp spines.", "One subject: the verb adds s.", ("Which is correct?", ["An echidna dig.", "An echidna digs.", "An echidna digging."], 1, "One echidna takes digs.")),
        _step("4", "More than one: plain verb", "When the subject is plural, the verb stays in its plain form with no s.\n\nThey, we and I also take the plain verb.", "Echidnas dig. Koalas sleep. They have sharp spines.", "Plural subject: plain verb.", ("Which is correct?", ["Echidnas digs.", "Echidnas dig.", "Echidnas digging."], 1, "More than one echidna takes dig.")),
        _step("5", "Verb endings", "After ch, sh, s, x, z or o, add es. After a consonant and y, change y to i and add es.\n\nBe and have are irregular: it is, they are; it has, they have.", "An echidna catches ants. A bird flies. A koala carries its baby.", "es after ch, sh, s, x, z, o. y to ies after a consonant.", ("Which is spelled correctly?", ["An echidna catchs ants.", "An echidna catches ants.", "An echidna catchies ants."], 1, "Verbs ending in ch add es.")),
        _step("6", "Words to leave out", "Leave out words that point to one time, such as yesterday, last week, was, went and will. Leave out I and opinions such as cute or the best.\n\nRead your report again and check each verb.", "Change An echidna was walking to An echidna walks.", "Report facts, not events.", ("Which word should be left out of a report?", ["has", "lives", "will"], 2, "Will points to the future, so it does not fit a report.")),
        _step("7", "Precise verbs", "A precise verb tells exactly what happens. Feeds on, burrows, hunts and defends say more than does, goes and gets.\n\nPick the verb that gives the clearest picture.", "A wombat burrows underground. Koalas feed on gum leaves.", "Choose the verb that says exactly what happens.", ("Which is the most precise verb? A koala ___ on gum leaves.", ["goes", "feeds", "does"], 1, "Feeds tells exactly what the koala does.")),
        _step("8", "Fix the report", "Check a report one sentence at a time. Find the subject, then check the verb. Is it in the present tense? Does it match the subject?\n\nChange any past or future verbs to the present.", "Wombats lived in burrows. A wombat dug with its claws. It will eat grass. Fixed: Wombats live in burrows. A wombat digs with its claws. It eats grass.", "Find the verb, fix the tense, match the subject.", ("How do you fix It will eat grass in a report?", ["It eats grass.", "It ate grass.", "It eating grass."], 0, "It eats grass is in the present tense.")),
        _step("9", "Spelling focus: plurals", "Most words add s. Words ending in s, x, z, ch or sh add es, as in classes and bunches. Many words ending in f or fe change to ves, as in leaves and shelves. Some plurals are irregular, as in mice and teeth.\n\nThis es ending is the same one that helps verbs agree, as in catches.", "One class, two classes. One leaf, two leaves. One mouse, two mice.", "s, es, ves, or irregular.", ("What is the plural of tooth?", ["tooths", "teeth", "teeths"], 1, "Tooth has an irregular plural, teeth.")),
    ],
    (
        "Let's see how a report stays in the timeless present tense. Here is my model. Echidnas are small, spiny mammals that live across Australia. An echidna has sharp spines on its back and a long, thin snout. Echidnas use their sticky tongues to catch ants and termites. A female echidna lays an egg, and the baby is called a puggle. Echidnas dig into the soil to stay safe. Look at the verbs. Are, live, has, use, lays, is called and dig are all in the present tense, so it reads like facts that are always true. Now look at the subjects. The first sentence is about echidnas, more than one, so the verbs are plain: are and live. The second is about an echidna, one animal, so I wrote has. In the fourth sentence, a female echidna is one animal, so I wrote lays. In the last sentence, echidnas is plural again, so I wrote dig. There is no yesterday, no I, no will and no opinion. Now I check a sentence that is wrong: An echidna catch ants. The subject is one echidna, so the verb needs the s ending. Catch ends in ch, so I add es, and the sentence becomes An echidna catches ants. Now I try a precise verb. Echidnas get ants could be Echidnas feed on ants. Feed on tells the reader exactly what happens. Now you will fix and write reports of your own.\n\n" + MODEL
    ),
    (
        "Type your answers in the practice boxes. Part A: type the correct form of the verb in brackets: An echidna (dig) ___ into the soil. Echidnas (dig) ___ into the soil. A bird (fly) ___ in the sky. A koala (catch) ___ a branch. Part B: rewrite in the timeless present tense: The kangaroo hopped across the bush. Part C: type the plural for each: one leaf, two ___. One class, two ___. One tooth, two ___. Part D: type a more precise verb to replace goes in: A snake goes across the sand. Your parent can check your answers against the answer key."
    ),
    (
        "Fix and write reports in the timeless present tense. Typed answers go in the boxes. Use the model paragraph to help you.\n\n" + MODEL + "\n\n"
        "Stage 1 (fix): type this passage again in the timeless present tense, with each verb matching its subject. Wombats lived in burrows. A wombat dug with its strong claws. It will eat grass at night.\n"
        "Stage 2 (choose): type the animal you will write about. Use a reliable book or website.\n"
        "Stage 3 (facts): type four facts about your animal, all in the present tense.\n"
        "Stage 4 (write): type a paragraph of five sentences. Use at least two singular subjects and two plural subjects, and at least one verb that ends in es.\n"
        "Stage 5 (precise): underline or type two precise verbs you used, and one vague verb you changed.\n"
        "Stage 6 (check): check each verb. Is it in the present tense? Does it match its subject? Is there a yesterday, an I, a will or an opinion to remove? Type one change you made.\n"
        "Stage 7 (spell): type your six spelling words and one sentence for each of leaves, classes and teeth.\n\n"
        "Parent: check that the child's fixed passage reads Wombats live in burrows. A wombat digs with its strong claws. It eats grass at night. Check that the child's paragraph is in the present tense throughout, that verbs match singular and plural subjects, that verbs ending in ch, sh, s, x or z use es, and that there are no opinions or words such as was or will. Accept any sensible animal. Check the facts against a reliable source if you can."
    ),
    "Which was harder for you: keeping every verb in the present tense, or making each verb match its subject, and what will you check next time you write a report?",
    "Did I use the present tense for facts, make each verb match its subject, spell verbs such as catches and carries, leave out words such as was, will and I, choose precise verbs, and spell classes, bunches, leaves, shelves, mice and teeth correctly?",
    [
        _q("What does the present tense show?", ["Something that happened yesterday", "Something that will happen", "Something that happens now or is always true", "Something imagined"], 2, "The present tense shows what happens now or is always true."),
        _q("Which sentence fits an information report?", ["An echidna dug a burrow yesterday.", "Echidnas live across Australia.", "Echidnas will live in Australia.", "I saw an echidna."], 1, "A report uses the timeless present tense."),
        _q("Which verb is correct? Echidnas ___ ants.", ["eat", "eats", "eating", "ate"], 0, "A plural subject takes the plain verb, eat."),
        _q("Which verb is correct? A wombat ___ with strong claws.", ["dig", "dug", "digging", "digs"], 3, "One wombat takes digs."),
        _q("Which sentence is spelled correctly?", ["An echidna catchs ants.", "An echidna catches ants.", "An echidna catchies ants.", "An echidna catch ants."], 1, "Verbs ending in ch add es, so catch becomes catches."),
        _q("Which verb is correct? A bird ___ in the sky.", ["flys", "fly", "flies", "flyes"], 2, "Fly changes y to i and adds es, so it becomes flies."),
        _q("Which word should be left out of a timeless present report?", ["has", "lives", "uses", "will"], 3, "Will points to the future, so it does not fit."),
        _q("Which is the most precise verb? A koala ___ on gum leaves.", ["goes", "feeds", "gets", "does"], 1, "Feeds tells exactly what the koala does."),
        _q("What is the plural of leaf?", ["leaves", "leafs", "leafes", "leavs"], 0, "Leaf changes to leaves."),
        _q("What is the plural of mouse?", ["mouses", "mice", "mices", "meese"], 1, "Mouse has an irregular plural, mice."),
    ],
    "Type your answers in the practice boxes and submit them.",
    "Extension: choose a report you have read this week, or one you wrote earlier. Check every verb. Find any verb that is not in the present tense or does not match its subject, and fix it. Read the corrected report aloud to a family member.",
    [("tense", "A verb form that shows when something happens"), ("present tense", "A verb form that shows what happens now or is always true"), ("verb", "A word that tells what someone or something does or is"), ("subject", "Who or what a sentence is about"), ("singular", "Only one"), ("plural", "More than one"), ("agree", "To match, such as a verb that matches its subject"), ("precise", "Exact and clear")],
    [
        _video(
            "Present Simple: Facts and General Truths", "WiGNJf5FbuY",
            "Watch for how the present simple is used to talk about things we know to be true. Notice that the subject and the verb match, and listen for the s ending on a singular subject. Then say two facts about an animal in the present tense. Parent: this video has not been watched in full, so please preview it. It is a short animated video made for English learners, so its examples may not be about animals.",
            "If the video will not play, reread Steps 2 to 4 and say three facts about an animal in the present tense.",
            ("Which sentence tells a fact in the present tense?", ["The sun rises in the east.", "The sun rose yesterday.", "The sun will rise tomorrow."], 0, "Rises is the present tense, and the fact is always true."),
        ),
        _video(
            "Irregular Plurals Song", "bYjIdIJN4fA",
            "Listen for plurals that do not follow the add s rule, such as foot and feet or tooth and teeth. Sing along and say each singular and plural pair. This matches mice and teeth in your spelling words. Parent: this video has not been watched in full, so please preview it. It is a song made for children learning English and its captions look garbled, so listen with your child.",
            "If the video will not play, reread Step 9 and say each singular and plural pair aloud, such as mouse and mice.",
            ("What is the plural of tooth?", ["teeth", "tooths", "teeths"], 0, "Tooth has an irregular plural, teeth."),
        ),
    ],
    _sort("Does it fit a report?", "Sort each sentence into fits a report (timeless present) or does not fit a report.", ["Fits a report", "Does not fit a report"], [("Echidnas live across Australia.", 0), ("An echidna dug a burrow yesterday.", 1), ("Echidnas will eat ants tomorrow.", 1), ("An echidna has sharp spines.", 0), ("I saw an echidna at the zoo.", 1), ("Echidnas use their sticky tongues.", 0), ("The echidna was walking.", 1), ("A puggle drinks milk.", 0)]),
    [
        _wc("Which tells when something happens?", ["tense", "title", "caption"], 0, "Tense tells when something happens."),
        _wc("Which means only one?", ["plural", "singular", "precise"], 1, "Singular means only one."),
        _wc("Which means more than one?", ["agree", "subject", "plural"], 2, "Plural means more than one."),
        _wc("Which is who or what a sentence is about?", ["subject", "verb", "tense"], 0, "The subject is who or what the sentence is about."),
        _wc("Which is the correct plural of class?", ["clases", "classes", "classs"], 1, "Words ending in ss add es, so class becomes classes."),
        _wc("Which is the correct plural of leaf?", ["leafs", "leafes", "leaves"], 2, "Leaf changes to leaves."),
        _wc("Which is the correct plural of mouse?", ["mice", "mouses", "mices"], 0, "Mouse has an irregular plural, mice."),
        _wc("Which is the correct plural of tooth?", ["tooths", "teeth", "teeths"], 1, "Tooth has an irregular plural, teeth."),
    ],
    [
        {"key": "partA", "label": "Part A: verb forms", "hint": "dig, dig, fly, catch in the present tense."},
        {"key": "partB", "label": "Part B: rewrite", "hint": "Rewrite the kangaroo sentence in the timeless present tense."},
        {"key": "partC", "label": "Part C: plurals", "hint": "leaf, class, tooth."},
        {"key": "partD", "label": "Part D: a precise verb", "hint": "A more precise verb than goes."},
        {"key": "stage1", "label": "Fixed wombat passage", "hint": "The wombat passage in the timeless present tense."},
        {"key": "stage2", "label": "My animal", "hint": "The animal you will write about."},
        {"key": "stage3", "label": "My four facts", "hint": "Four facts in the present tense."},
        {"key": "stage4", "label": "My paragraph", "hint": "Five sentences, singular and plural subjects, one es verb."},
        {"key": "stage5", "label": "Precise verbs", "hint": "Two precise verbs and one vague verb you changed."},
        {"key": "stage6", "label": "One change I made", "hint": "A verb you fixed after checking."},
        {"key": "spelling", "label": "Spelling words", "hint": "Type your six words and a sentence each for leaves, classes and teeth."},
    ],
    ["Slipping into the past tense (Echidnas lived)", "Using will or going to in a report", "Writing I or yesterday in a report", "Making the verb not match its subject (An echidna dig, Echidnas digs)", "Writing catchs or flys instead of catches and flies", "Writing leafs, mouses or classs instead of leaves, mice and classes"],
    ["Read your report aloud and listen to each verb.", "Practise your six spelling words by writing a sentence for each."],
    "Part A: digs, dig, flies, catches. Part B: accept The kangaroo hops across the bush (or any sensible present tense sentence). Part C: leaves, classes, teeth. Part D: accept a precise verb such as slithers, glides, travels, crawls or moves. Main task Stage 1: Wombats live in burrows. A wombat digs with its strong claws. It eats grass at night. Stage 2: accept any animal. Stage 3: accept four sensible facts in the present tense. Stage 4: accept a five-sentence paragraph in the present tense with at least two singular and two plural subjects and at least one es verb. Stage 5: accept two precise verbs and a sensible change. Stage 6: accept any sensible change. Stage 7: accept six correctly spelled words and sentences. Quiz answers: something that happens now or is always true; Echidnas live across Australia; eat; digs; An echidna catches ants; flies; will; feeds; leaves; mice.",
)

LESSON["spelling"] = {
    "focus": "Plurals: -s, -es, -ves and irregular",
    "teaching": "Most words add s. Words ending in s, x, z, ch or sh add es, as in classes and bunches. Many words ending in f or fe change to ves, as in leaves and shelves. Some plurals are irregular, as in mice and teeth. Say the word, think about the ending, then write it.",
    "words": [
        _w("classes", "clas-ses", "more than one class, ends in es after ss"),
        _w("bunches", "bun-ches", "more than one bunch, ends in es after ch"),
        _w("leaves", "leaves", "more than one leaf, f changes to ves"),
        _w("shelves", "shelves", "more than one shelf, f changes to ves"),
        _w("mice", "mice", "more than one mouse, an irregular plural"),
        _w("teeth", "teeth", "more than one tooth, an irregular plural"),
    ],
    "check": [
        _c("What is the plural of shelf?", ["shelfs", "shelves", "shelfes"], 1, "Shelf changes to shelves."),
        _c("What is the plural of bunch?", ["bunches", "bunchs", "bunchies"], 0, "Words ending in ch add es, so bunch becomes bunches."),
    ],
}
LESSON["spelling_focus"] = "Plurals: -s, -es, -ves and irregular"
LESSON["hoard_words"] = list(WORDS)

if __name__ == "__main__":
    assert len(LESSON["quiz"]) == 10 and len(LESSON["word_challenges"]) == 8
    print("ok", LESSON["seed_key"])
