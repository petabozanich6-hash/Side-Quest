"""Stage 2 English, Week 8 Lesson 3: Timeless Present Tense (Language).
The child learns that information reports describe facts that are true now and nearly always, so they use the timeless present tense, and learns to match the verb to the subject (it hunts, they hunt) and to fix a paragraph that slips into the past tense.
Spelling: plurals -es, -ves and irregular: brushes, lunches, loaves, halves, geese, people.
Outcome codes: EN2-VOCAB-01 and EN2-SPELL-01, both of which exist in nsw_outcomes.py.
Video status: none. No timeless present tense video has been transcript-checked, so none is included.
Do not register this module in lesson_library.py or add week 8 to BUILT_OUT_WEEKS until the whole week is built.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["brushes", "lunches", "loaves", "halves", "geese", "people"]

EMU_BAD = (
    "The emu was the largest bird in Australia. It stood almost two metres tall. It could not fly, but it ran very fast. Emus ate plants, seeds and insects. The male sat on the eggs and looked after the chicks."
)
EMU_GOOD = (
    "The emu is the largest bird in Australia. It stands almost two metres tall. It cannot fly, but it runs very fast. Emus eat plants, seeds and insects. The male sits on the eggs and looks after the chicks."
)

LESSON = build(
    "s2-eng-w08-l3-timeless-present-tense",
    "Timeless Present Tense",
    "Information reports tell us what things are like, not what happened once. Learn why reports use the timeless present tense, how to match each verb to its subject, and how to fix a paragraph that slips into the past.",
    "Language: timeless present tense",
    ["EN2-VOCAB-01", "EN2-SPELL-01"],
    {
        "EN2-VOCAB-01": "Primary. Builds knowledge and use of vocabulary through interacting, wide reading and writing, and by defining and analysing words. In this lesson the child chooses and spells present tense verbs for an information report and explains why the tense fits.",
        "EN2-SPELL-01": "Selects, applies and describes appropriate phonological, orthographic and morphological generalisations and strategies when spelling, including plural endings -es, -ves and irregular plurals (week 8 spelling focus).",
    },
    "We are learning to use the timeless present tense in information reports, to match verbs to their subjects, and to spell plurals such as brushes, loaves and geese.",
    [
        "I can explain what the timeless present tense is and why reports use it.",
        "I can find the verbs in a sentence.",
        "I can change a past tense verb to the present tense.",
        "I can match the verb to a single or plural subject.",
        "I can fix a paragraph that mixes tenses.",
        "I can spell and use brushes, lunches, loaves, halves, geese and people.",
    ],
    ["tense", "present tense", "past tense", "verb", "subject", "timeless"],
    ["This lesson (everything you need is inside it)"],
    "Child knows what a verb is (Week 2), has written a description paragraph (Lesson 2) and knows simple past tense.",
    (
        "Why this matters. When you write an information report, you tell the reader what something is like. Those facts are true now and nearly always true. Using the right tense makes the report sound clear and confident.\n\n"
        "What tense is. Tense shows when something happens. Past tense tells what already happened, such as the emu ran. Present tense tells what happens now or all the time, such as the emu runs.\n\n"
        "Timeless present tense. Reports describe things that are generally true, such as what an animal looks like, eats or does. The present tense is used because the facts are not stuck in the past. We call this timeless because it is not about one moment.\n\n"
        "Matching verbs and subjects. With a single subject, most present tense verbs end in s: it runs, the male sits. With a plural subject, the verb has no s: they run, emus eat. The verbs have and be change too: it has, they have; it is, they are.\n\n"
        "When to use past tense. Use the past tense only when you tell about something that really happened once, such as a scientist who studied emus last year. Do not slip into it by accident.\n\n"
        "The routine. First, find the verbs. Second, ask: is this fact true now? Third, change any past tense verbs to the present tense. Fourth, check each verb matches its subject. Fifth, read the paragraph aloud to check it sounds right.\n\n"
        "A link to spelling. This week's spelling plurals are brushes, lunches, loaves, halves, geese and people."
    ),
    [
        _step("1", "What a verb tense shows", "Tense shows when something happens. The past tense tells what has already happened. The present tense tells what happens now or all the time.\n\nSame verb, different tense: ran and runs.", "The emu ran (past). The emu runs (present).", "Tense shows when.", ("Which verb is in the present tense?", ["ran", "runs", "will run"], 1, "Runs is the present tense.")),
        _step("2", "Why reports use the present", "A report describes facts that are true now and nearly always. The present tense shows this. This is called the timeless present.\n\nThe past tense would make the facts sound finished.", "The emu is the largest bird in Australia. It is true now, so we write is.", "True now, so write present.", ("Why does a report use the present tense?", ["The facts are true now and nearly always", "It is shorter", "It sounds old"], 0, "Reports describe general facts, so the present tense fits.")),
        _step("3", "Changing past to present", "Find each past tense verb and change it to the present tense. Some change a little (looked to looks), and some change completely (ate to eats, could to can).\n\nKeep the meaning the same.", "Past: The emu stood two metres tall and ate seeds. Present: The emu stands two metres tall and eats seeds.", "Find the verb, change the tense.", ("Change to the present tense: The emu ate seeds.", ["The emu eats seeds", "The emu eated seeds", "The emu eaten seeds"], 0, "Ate changes to eats.")),
        _step("4", "Matching verbs and subjects", "With a single subject, the present tense verb usually ends in s: it runs. With a plural subject, there is no s: they run.\n\nHave becomes has and are becomes is for a single subject.", "The emu has long legs. Emus have long legs. The emu is tall. Emus are tall.", "One subject takes -s. Many do not.", ("Which is correct?", ["Emus runs fast", "Emus run fast", "The emu run fast"], 1, "A plural subject takes run, with no s.")),
        _step("5", "Fixing a mixed paragraph", "Read the paragraph and look for past tense verbs. Change them to the present tense, and check each verb still matches its subject.\n\nLeave a past tense verb only when it tells about something that really happened once.", "Mixed: The emu is tall but it could not fly. Fixed: The emu is tall but it cannot fly.", "Spot the verb that slipped.", ("Which verb needs fixing: The emu has long legs and it ran fast?", ["has", "ran", "long"], 1, "Ran is the past tense, so change it to runs.")),
        _step("6", "Spelling focus: plurals", "Words ending in sh or ch add -es: brushes, lunches. Many words ending in f change to -ves: loaves, halves. Some change completely: goose becomes geese, and person becomes people.\n\nLearn each word, then check it.", "People packed lunches and halves of loaves for the geese.", "Check the ending before you write.", ("Which is the correct plural of goose?", ["gooses", "geese", "geeses"], 1, "Goose changes to geese.")),
    ],
    (
        "Let's compare two versions of the same report paragraph about the emu. In the first version every verb is in the past tense: was, stood, could not fly, ran, ate, sat and looked. It sounds as if emus no longer exist. In the second version the verbs are in the timeless present: is, stands, cannot fly, runs, eat, sits and looks. Now it describes emus as they are. Notice that the male sits and looks, with an s, because the subject is a single male, while emus eat, with no s, because the subject is plural. The present tense also fits the facts, because emus are still the largest bird in Australia.\n\nVERSION 1: " + EMU_BAD + "\n\nVERSION 2: " + EMU_GOOD
    ),
    (
        "Type your answers in the practice boxes. Part A: type the verb in each sentence and say if it is past or present. The kangaroo hops across the paddock. The koala slept all day. Part B: rewrite each sentence in the timeless present. The crocodile lived in rivers. Crocodiles hunted at night. Part C: choose the correct verb. Koalas (eat / eats) leaves. A koala (sleep / sleeps) for most of the day. Part D: type the correct plural for each blank. Choose from brushes, lunches, loaves, halves, geese and people. The ___ flew over the lake. We cut the apple into ___. Many ___ packed ___ for the trip. Your parent can check your answers against the answer key."
    ),
    (
        "Fix a report paragraph and write your own. Typed answers go in the boxes. Use the emu paragraphs as a model.\n\n" + EMU_BAD + "\n\n"
        "Stage 1 (find): type three past tense verbs from the emu paragraph.\n"
        "Stage 2 (fix): rewrite the whole paragraph in the timeless present tense.\n"
        "Stage 3 (check): underline each verb and check it matches its subject. Type one subject and its verb.\n"
        "Stage 4 (new paragraph): with a parent, choose an animal. Write four sentences about it in the present tense.\n"
        "Stage 5 (check again): read your paragraph aloud. Type any verb you changed.\n"
        "Stage 6 (explain): in one sentence, say why a report uses the present tense.\n"
        "Stage 7 (spell): type your six spelling words and one sentence for each of loaves, geese and people.\n\n"
        "Parent: check that every verb in Stage 2 and Stage 4 is in the present tense, that single subjects take an s verb and plural subjects do not, and that the child can explain why. Accept any sensible wording and animal."
    ),
    "Why would a report about animals sound strange if every verb was in the past tense?",
    "Did I find the verbs, change past tense verbs to the present tense, match each verb to its subject, explain why reports use the present tense, and spell brushes, lunches, loaves, halves, geese and people correctly?",
    [
        _q("What does tense show?", ["When something happens", "How loud something is", "How big something is", "Where something is"], 0, "Tense shows time."),
        _q("Which sentence is in the present tense?", ["The emu ran", "The emu runs", "The emu will run", "The emu had run"], 1, "Runs is the present tense."),
        _q("Why do reports use the timeless present tense?", ["The facts are true now and nearly always", "It is shorter", "It tells a story", "It sounds old"], 0, "Reports describe general facts."),
        _q("Which is correct?", ["Birds builds nests", "Birds build nests", "A bird build nests", "A bird builds nests and sing"], 1, "A plural subject takes build."),
        _q("Which is correct?", ["The emu have long legs", "The emu has long legs", "The emu haves long legs", "The emu having long legs"], 1, "A single subject takes has."),
        _q("Change to the present tense: The koala ate leaves.", ["The koala eats leaves", "The koala eated leaves", "The koala eaten leaves", "The koala will eat leaves"], 0, "Ate changes to eats."),
        _q("When should you use the past tense in a report?", ["When telling about something that really happened once", "Always", "Never", "For every fact"], 0, "Use the past only for single events."),
        _q("Which is the correct plural of lunch?", ["lunchs", "lunches", "lunchies", "lunchen"], 1, "Words ending in ch add -es."),
        _q("Which is the correct plural of loaf?", ["loafs", "loaves", "loafes", "loavs"], 1, "Loaf changes to loaves."),
        _q("Which is the correct plural of person?", ["persons", "peoples", "people", "personses"], 2, "The usual plural of person is people."),
    ],
    "Type your answers in the practice boxes and submit them.",
    "Extension: read a page of an information book and circle every verb. Check that nearly all are in the present tense, and find one that is in the past tense and say why.",
    [("tense", "The form of a verb that shows when something happens"), ("present tense", "Tells what happens now or all the time"), ("past tense", "Tells what has already happened"), ("verb", "A word that shows an action or a state"), ("subject", "The person or thing the sentence is about"), ("timeless", "True now and nearly always, not tied to one moment")],
    [],
    _sort("Present or past tense?", "Sort each sentence into the right group.", ["Present tense", "Past tense"], [("The emu runs very fast", 0), ("The emu ran very fast", 1), ("Koalas eat leaves", 0), ("Koalas ate leaves", 1), ("The platypus lays eggs", 0), ("The platypus laid eggs", 1)]),
    [
        _wc("Which shows when something happens?", ["tense", "subject", "noun"], 0, "Tense shows when."),
        _wc("Which tells what happens now or all the time?", ["present tense", "past tense", "future"], 0, "The present tense tells what happens now or all the time."),
        _wc("Which means true now and nearly always?", ["timeless", "finished", "unknown"], 0, "Timeless facts are true now and nearly always."),
        _wc("Which is spelled correctly?", ["brushes", "brushs", "brushies"], 0, "Brush ends in sh, so add -es."),
        _wc("Which is spelled correctly?", ["halfs", "halves", "halfes"], 1, "Half changes to halves."),
        _wc("Which is spelled correctly?", ["gooses", "geese", "geeses"], 1, "Goose changes to geese."),
        _wc("Which is spelled correctly?", ["people", "peeple", "peopel"], 0, "People is spelled p-e-o-p-l-e."),
        _wc("Which is spelled correctly?", ["lunchs", "lunches", "lunchies"], 1, "Lunch ends in ch, so add -es."),
    ],
    [
        {"key": "partA", "label": "Part A: find the verb", "hint": "Type the verb and past or present for each sentence."},
        {"key": "partB", "label": "Part B: timeless present", "hint": "Rewrite the two crocodile sentences in the present tense."},
        {"key": "partC", "label": "Part C: match the verb", "hint": "Choose the correct verb for each sentence."},
        {"key": "partD", "label": "Part D: plurals", "hint": "Fill the blanks. Choose from brushes, lunches, loaves, halves, geese and people."},
        {"key": "stage1", "label": "Past tense verbs", "hint": "Three past tense verbs from the emu paragraph."},
        {"key": "stage2", "label": "Fixed paragraph", "hint": "Rewrite the emu paragraph in the present tense."},
        {"key": "stage3", "label": "Subject and verb", "hint": "One subject and its matching verb."},
        {"key": "stage4", "label": "My paragraph", "hint": "Four present tense sentences about an animal."},
        {"key": "stage5", "label": "Changes", "hint": "Any verb you changed after reading aloud."},
        {"key": "stage6", "label": "Why present", "hint": "One sentence on why a report uses the present tense."},
        {"key": "spelling", "label": "Spelling words", "hint": "Type your six words and one sentence for each of loaves, geese and people."},
    ],
    ["Mixing present and past tense in one paragraph", "Forgetting the s on a verb with a single subject", "Adding an s to a verb with a plural subject", "Writing eated, runned or haves", "Writing plurals such as loafs, gooses or halfs"],
    ["Read a page of an information book and circle ten present tense verbs.", "Practise your six spelling words by writing a sentence for each."],
    "Part A: hops, present; slept, past. Part B: accept The crocodile lives in rivers. Crocodiles hunt at night. Part C: eat; sleeps. Part D: geese; halves; people; lunches. Main task: Stage 1: accept three of was, stood, could not fly, ran, ate, sat, looked. Stage 2: accept The emu is the largest bird in Australia. It stands almost two metres tall. It cannot fly, but it runs very fast. Emus eat plants, seeds and insects. The male sits on the eggs and looks after the chicks. Stage 3: accept any subject with its matching verb, such as emus eat or the male sits. Stage 4 to 6: accept any sensible paragraph with all verbs in the present tense, and an explanation that facts are true now. Quiz answers: when something happens; The emu runs; the facts are true now and nearly always; Birds build nests; The emu has long legs; The koala eats leaves; when telling about something that really happened once; lunches; loaves; people.",
)

LESSON["spelling"] = {
    "focus": "Plurals: -es, -ves and irregular",
    "teaching": "Words ending in sh or ch add -es (brushes, lunches). Many words ending in f change to -ves (loaves, halves). Some change completely (goose to geese, person to people). Say each word slowly and check the ending.",
    "words": [
        _w("brushes", "brush-es", "brush + es"),
        _w("lunches", "lunch-es", "lunch + es"),
        _w("loaves", "loaves", "loaf changes f to ves"),
        _w("halves", "halves", "half changes f to ves"),
        _w("geese", "geese", "irregular: goose changes to geese"),
        _w("people", "peo-ple", "irregular: the plural of person"),
    ],
    "check": [
        _c("Which is spelled correctly?", ["brushs", "brushes", "brushies"], 1, "Brush ends in sh, so add -es."),
        _c("Which is spelled correctly?", ["loafs", "loaves", "loafes"], 1, "Loaf changes to loaves."),
    ],
}
LESSON["spelling_focus"] = "Plurals: -es, -ves and irregular"
LESSON["hoard_words"] = list(WORDS)

if __name__ == "__main__":
    assert len(LESSON["quiz"]) == 10 and len(LESSON["word_challenges"]) == 8
    print("ok", LESSON["seed_key"])
