"""Stage 2 English, Week 7 Lesson 2: Writing a Classification Paragraph (Writing).
The child learns that a classification paragraph sorts a topic into groups, then plans and writes one using a model about musical instruments.
Spelling: more -sion and -ssion words: confusion, occasion, impression, mission, passion, version.
Outcome codes: EN2-CWT-01 and EN2-SPELL-01, both of which exist in nsw_outcomes.py. (An earlier draft used EN2-CWT-02, which is not in the seed file.)
Video status: NO VIDEO YET. Candidate found but NOT verified: Information Investigation Episode 3, How to Plan and Write an Information Report (YouTube bbV_YFoqu5I). Only the search snippet was seen; the page could not be fetched, so the transcript has not been checked. Check it (or find another) before adding it to the videos list. Do not register this module in lesson_library.py or add week 7 to BUILT_OUT_WEEKS until the whole week is built.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["confusion", "occasion", "impression", "mission", "passion", "version"]

MODEL = (
    "MODEL PARAGRAPH: MUSICAL INSTRUMENTS\n\n"
    "Musical instruments can be sorted into three main groups: strings, wind and percussion. "
    "String instruments make sound when strings are plucked, strummed or rubbed with a bow. A guitar and a violin are string instruments. "
    "Wind instruments make sound when the player blows air into or across them. A flute and a trumpet are wind instruments. "
    "Percussion instruments make sound when they are hit, shaken or scraped. Drums and tambourines are percussion instruments. "
    "Sorting instruments into groups helps us understand how each one makes its sound."
)

LESSON = build(
    "s2-eng-w07-l2-classification-paragraph",
    "Writing a Classification Paragraph",
    "A classification paragraph sorts a topic into groups. Learn how to write one with a clear opening sentence, a group-by-group description with examples, and a closing sentence, then write your own.",
    "Writing: a classification paragraph",
    ["EN2-CWT-01", "EN2-SPELL-01"],
    {
        "EN2-CWT-01": "Primary. Plans, creates and revises written texts for informative purposes, using text features, sentence-level grammar, punctuation and word-level language for a target audience. In this lesson the child writes a classification paragraph that sorts a topic into groups.",
        "EN2-SPELL-01": "Selects, applies and describes appropriate phonological, orthographic and morphological generalisations and strategies when spelling, including more words ending in -sion and -ssion (week 7 spelling focus).",
    },
    "We are learning to write a classification paragraph that sorts a topic into groups and gives examples, and to spell more words that end in -sion and -ssion.",
    [
        "I can explain what a classification paragraph does.",
        "I can choose a topic that can be sorted into groups.",
        "I can write an opening sentence that names the groups.",
        "I can describe each group and give examples.",
        "I can write a closing sentence.",
        "I can spell and use confusion, occasion, impression, mission, passion and version.",
    ],
    ["classification", "group", "category", "example", "opening sentence", "closing sentence"],
    ["This lesson (everything you need is inside it)", "Optional: pencil and paper for sorting"],
    "Child has found the main idea and key details in Lesson 1 and has planned an information report in Week 6.",
    (
        "Why this matters. Information reports often sort things into groups. Sorting helps the reader see how a big topic fits together. A classification paragraph is the part of a report that does this.\n\n"
        "What it is. Classification means sorting things that are alike into groups. Animals can be sorted into mammals, birds and reptiles. Foods can be sorted into fruit, vegetables and grains. Each group is called a category.\n\n"
        "The parts. The opening sentence names the topic and says how many groups there are, such as: musical instruments can be sorted into three main groups. Then each group gets its own description and one or two examples. A closing sentence sums up why the groups are useful.\n\n"
        "The language. Use present tense, such as are and make. Use words that show sorting, such as can be sorted into, belongs to, is a type of, and one group is. Use technical words for the groups.\n\n"
        "The routine. First, choose a topic that can be sorted. Second, decide on two to four groups. Third, write the opening sentence. Fourth, write one description and one or two examples for each group. Fifth, write a closing sentence. Sixth, read it back and check that each example sits in the right group.\n\n"
        "A link to spelling. This week's spelling focus is -sion and -ssion. Words such as confusion, occasion, impression, mission, passion and version belong to this family."
    ),
    [
        _step("1", "What classification means", "To classify is to sort things that are alike into groups. Each group is a category with its own rule for what belongs in it.\n\nGood groups do not overlap. One thing should not fit in two groups.", "Animals can be sorted into mammals, birds and reptiles.", "Classification means sorting into groups.", ("What does classification mean?", ["Telling a story", "Sorting things that are alike into groups", "Giving an opinion"], 1, "Classification means sorting things that are alike into groups.")),
        _step("2", "Choosing a topic and groups", "Choose a topic that really can be sorted, and decide on two to four groups. Use a rule for each group.\n\nMusical instruments can be sorted by how they make sound.", "Topic: musical instruments. Groups: strings, wind, percussion.", "Pick a rule, then the groups.", ("Which topic can be sorted into groups?", ["My birthday", "Types of transport", "One red car"], 1, "Types of transport can be sorted, for example into land, water and air.")),
        _step("3", "The opening sentence", "The opening sentence names the topic and says how many groups there are. It can also name the groups.\n\nIt tells the reader what to expect.", "Musical instruments can be sorted into three main groups: strings, wind and percussion.", "Name the topic and the groups.", ("What should an opening sentence for a classification paragraph include?", ["The topic and the groups", "A joke", "Only the last example"], 0, "It names the topic and the groups.")),
        _step("4", "Describing each group", "For each group, say what makes things belong to it, then give one or two examples. Use the same order for every group so it is easy to follow.\n\nKeep each group description to one or two sentences.", "String instruments make sound when strings are plucked, strummed or rubbed with a bow. A guitar and a violin are string instruments.", "Rule, then examples.", ("What goes after the rule for each group?", ["A new topic", "One or two examples", "Nothing"], 1, "Each group needs examples to show the rule.")),
        _step("5", "The closing sentence", "The closing sentence sums up why the groups are useful or what the groups show. It does not add a new group.\n\nKeep it short.", "Sorting instruments into groups helps us understand how each one makes its sound.", "Sum up, do not add.", ("What should a closing sentence not do?", ["Sum up the groups", "Add a brand new group", "Be short"], 1, "A closing sentence should not add a new group.")),
        _step("6", "Spelling focus: more -sion and -ssion", "More words with the shun sound: confusion, occasion, impression, mission, passion and version.\n\nSay each word slowly and check the ending. Words like impression, mission and passion have a double s. Words like confusion and version have a single s.", "The confusion happened on one occasion when our mission was to give a good impression.", "Learn each word, then check it.", ("Which is spelled correctly?", ["mishun", "mission", "mision"], 1, "Mission ends in -ssion.")),
    ],
    (
        "Let's look at the model paragraph on the screen. The opening sentence says musical instruments can be sorted into three main groups: strings, wind and percussion. Now I check each group. For strings, the rule is that sound is made by plucking, strumming or using a bow, and the examples are a guitar and a violin. For wind, the rule is that the player blows air, and the examples are a flute and a trumpet. For percussion, the rule is that the instrument is hit, shaken or scraped, and the examples are drums and a tambourine. Each group follows the same order: rule, then examples. The closing sentence says sorting the instruments helps us understand how each makes its sound. Notice that it does not add a fourth group.\n\n" + MODEL
    ),
    (
        "Type your answers in the practice boxes. Part A: write what classification means in your own words. Part B: sort these six animals into three groups and name each group: dog, eagle, snake, cat, sparrow, lizard. Part C: write an opening sentence for a paragraph about types of transport. Part D: type the correct word for each blank. Choose from confusion, occasion, impression, mission, passion and version. A birthday is a special ___. I made a good ___ on my teacher. There was some ___ about the rules. Your parent can check your answers against the answer key."
    ),
    (
        "Write your own classification paragraph. Typed answers go in the boxes. Use the model as a guide.\n\n" + MODEL + "\n\n"
        "Stage 1 (topic): choose a topic you can sort, such as animals, foods, games, sports or vehicles. Type your topic.\n"
        "Stage 2 (groups): type two to four groups, and the rule for each.\n"
        "Stage 3 (examples): type one or two examples for each group.\n"
        "Stage 4 (opening sentence): type your opening sentence.\n"
        "Stage 5 (draft): type your paragraph. Describe each group, then give examples.\n"
        "Stage 6 (closing sentence): type your closing sentence.\n"
        "Stage 7 (check and spell): read your paragraph aloud and fix anything that does not make sense. Type your six spelling words and one sentence for each of mission, impression and version.\n\n"
        "Parent: check that the topic can really be sorted, that the groups do not overlap, that the opening sentence names the topic and groups, that every group has a rule and examples, and that the closing sentence sums up without adding a new group. Accept any sensible topic."
    ),
    "Why does sorting things into groups make a text easier to understand?",
    "Did I choose a topic that can be sorted, write an opening sentence that names the groups, describe every group with examples, write a closing sentence, and spell confusion, occasion, impression, mission, passion and version correctly?",
    [
        _q("What is a classification paragraph?", ["A story", "A paragraph that sorts a topic into groups", "A poem", "A letter"], 1, "It sorts a topic into groups."),
        _q("What does the opening sentence do?", ["Names the topic and groups", "Adds a joke", "Ends the paragraph", "Gives an opinion"], 0, "It names the topic and the groups."),
        _q("What goes with each group?", ["A rule and examples", "A story", "A question", "Nothing"], 0, "Each group needs a rule and examples."),
        _q("Which topic can be sorted?", ["Types of transport", "My dog Max", "Tuesday", "A single pencil"], 0, "Transport can be sorted into groups."),
        _q("What tense is used in a classification paragraph?", ["Present tense", "Future tense only", "Past tense only", "No tense"], 0, "Information texts use present tense."),
        _q("What should the closing sentence do?", ["Sum up", "Add a new group", "Start a new topic", "Ask for money"], 0, "It sums up."),
        _q("Which is a category for fruit?", ["Apple", "Fruit", "Carrot", "Table"], 1, "Fruit is a category. Apple is an example."),
        _q("Which is spelled correctly?", ["confushun", "confusion", "confution", "confusson"], 1, "Confusion ends in -sion."),
        _q("Which is spelled correctly?", ["impreshun", "impression", "impresion", "impretion"], 1, "Impression ends in -ssion."),
        _q("Which is spelled correctly?", ["passion", "pashun", "pasion", "passon"], 0, "Passion ends in -ssion."),
    ],
    "Type your answers in the practice boxes and submit them.",
    "Extension: write a second classification paragraph about a different topic, or swap paragraphs with a family member and check that each example sits in the right group.",
    [("classification", "Sorting things that are alike into groups"), ("group", "A set of things that are alike"), ("category", "A name for a group"), ("example", "One thing that belongs to a group"), ("opening sentence", "The first sentence, which names the topic and groups"), ("closing sentence", "The last sentence, which sums up")],
    [],
    _sort("Which group?", "Sort each item into the right group.", ["Strings", "Wind", "Percussion"], [("Guitar", 0), ("Flute", 1), ("Drums", 2), ("Violin", 0), ("Trumpet", 1), ("Tambourine", 2)]),
    [
        _wc("Which means sorting things into groups?", ["classification", "conclusion", "index"], 0, "Classification means sorting into groups."),
        _wc("Which is one thing in a group?", ["title", "example", "glossary"], 1, "An example is one thing that belongs to a group."),
        _wc("Which names a group?", ["category", "caption", "heading"], 0, "A category is a name for a group."),
        _wc("Which is spelled correctly?", ["occasion", "ocasion", "occashun"], 0, "Occasion has two c's and ends in -sion."),
        _wc("Which is spelled correctly?", ["mishun", "mision", "mission"], 2, "Mission ends in -ssion."),
        _wc("Which is spelled correctly?", ["versshun", "version", "vershun"], 1, "Version ends in -sion."),
        _wc("Which is spelled correctly?", ["passion", "pashun", "pasion"], 0, "Passion ends in -ssion."),
        _wc("Which is spelled correctly?", ["confusion", "confushun", "confution"], 0, "Confusion ends in -sion."),
    ],
    [
        {"key": "partA", "label": "Part A: classification", "hint": "In your own words, what does classification mean?"},
        {"key": "partB", "label": "Part B: sort the animals", "hint": "Name three groups and put two animals in each: dog, eagle, snake, cat, sparrow, lizard."},
        {"key": "partC", "label": "Part C: opening sentence", "hint": "An opening sentence about types of transport."},
        {"key": "partD", "label": "Part D: -sion and -ssion words", "hint": "Fill the three blanks. Choose from confusion, occasion, impression, mission, passion and version."},
        {"key": "stage1", "label": "My topic", "hint": "A topic you can sort."},
        {"key": "stage2", "label": "Groups and rules", "hint": "Two to four groups and the rule for each."},
        {"key": "stage3", "label": "Examples", "hint": "One or two examples for each group."},
        {"key": "stage4", "label": "Opening sentence", "hint": "Name the topic and the groups."},
        {"key": "stage5", "label": "My paragraph", "hint": "Describe each group, then give examples."},
        {"key": "stage6", "label": "Closing sentence", "hint": "Sum up without adding a new group."},
        {"key": "spelling", "label": "Spelling words", "hint": "Type your six words and one sentence for each of mission, impression and version."},
    ],
    ["Choosing a topic that cannot be sorted", "Groups that overlap", "Forgetting examples", "Adding a new group in the closing sentence", "Writing in the past tense"],
    ["Sort the items in a kitchen drawer into groups and name each group.", "Practise your six spelling words by writing a sentence for each."],
    "Part A: sorting things that are alike into groups. Part B: mammals (dog, cat), birds (eagle, sparrow), reptiles (snake, lizard). Part C: accept a sentence such as types of transport can be sorted into three main groups: land, water and air. Part D: occasion, impression, confusion. Main task: accept any sensible topic; two to four non-overlapping groups with a rule each; one or two examples per group; an opening sentence that names the topic and groups; a draft in present tense; a closing sentence that sums up without a new group. Quiz answers: a paragraph that sorts a topic into groups; names the topic and groups; a rule and examples; types of transport; present tense; sum up; fruit; confusion; impression; passion.",
)

LESSON["spelling"] = {
    "focus": "More -sion and -ssion words (the shun sound)",
    "teaching": "Words such as impression, mission and passion use -ssion. Words such as confusion, occasion and version use -sion. Say each word slowly, learn the pattern and check the ending.",
    "words": [
        _w("confusion", "con-fu-sion", "single s; from confuse"),
        _w("occasion", "oc-ca-sion", "double c, single s"),
        _w("impression", "im-pres-sion", "double s before ion"),
        _w("mission", "mis-sion", "double s before ion"),
        _w("passion", "pas-sion", "double s before ion"),
        _w("version", "ver-sion", "single s after r"),
    ],
    "check": [
        _c("Which is spelled correctly?", ["mission", "mishun", "mision"], 0, "Mission ends in -ssion."),
        _c("Which is spelled correctly?", ["versshun", "vershun", "version"], 2, "Version ends in -sion."),
    ],
}
LESSON["spelling_focus"] = "More -sion and -ssion words (the shun sound)"
LESSON["hoard_words"] = list(WORDS)

if __name__ == "__main__":
    assert len(LESSON["quiz"]) == 10 and len(LESSON["word_challenges"]) == 8
    print("ok", LESSON["seed_key"])
