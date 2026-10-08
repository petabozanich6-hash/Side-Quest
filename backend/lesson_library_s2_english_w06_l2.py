"""Stage 2 English, Week 6 Lesson 2: Planning an Information Report (Writing).
The child learns to choose a focused topic, ask questions, brainstorm facts, group the facts into categories, turn the categories into subheadings, and plan an introduction and a conclusion. This is a planning lesson only; the child drafts the report in later lessons.
Spelling: the -tion ending continued: question, location, description, population, introduction, classification.
Video status: bbV_YFoqu5I (Information Investigation, Episode 3) was checked against its title, description and chapter list (about 2 minutes, planning then introduction, body paragraphs and conclusion). FULL TRANSCRIPT NOT YET CHECKED. Re-check the ID, length and wording before release.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["question", "location", "description", "population", "introduction", "classification"]

KOALA_FACTS = (
    "KOALA FACT BANK (jumbled)\n"
    "1. Koalas eat the leaves of eucalyptus trees.\n"
    "2. A koala has thick, grey, woolly fur.\n"
    "3. Koalas live in eucalypt forests in eastern Australia.\n"
    "4. A baby koala is called a joey.\n"
    "5. Koalas sleep for many hours each day.\n"
    "6. A koala has sharp claws for climbing.\n"
    "7. A joey lives in its mother's pouch for about six months.\n"
    "8. Bushfires and land clearing destroy koala homes.\n"
    "9. Koalas are marsupials, not bears.\n"
    "10. A koala has a large, round, black nose.\n"
    "11. Eucalyptus leaves give koalas food and most of their water.\n"
    "12. Cars and dogs can be a danger to koalas on the ground."
)

PENGUIN_FACTS = (
    "LITTLE PENGUIN FACT BANK (jumbled)\n"
    "1. Little penguins eat small fish and squid.\n"
    "2. They are the smallest penguins in the world.\n"
    "3. They live along the coast of southern Australia and New Zealand.\n"
    "4. Their feathers are blue-grey on the back and white on the front.\n"
    "5. They dig burrows or use rock crevices as nests.\n"
    "6. They hunt for food in the sea.\n"
    "7. They stand about 33 centimetres tall.\n"
    "8. Foxes and dogs are dangers to little penguins on land.\n"
    "9. They come ashore at dusk after a day of fishing.\n"
    "10. Their flippers help them swim fast."
)

LESSON = build(
    "s2-eng-w06-l2-planning-a-report",
    "Planning an Information Report",
    "A good report starts before the first sentence. Learn how to turn a pile of jumbled facts into a clear plan with groups, subheadings, an introduction and a conclusion, so that your report is easy to write and easy to read.",
    "Writing: planning an information report",
    ["EN2-CWT-01", "EN2-SPELL-01"],
    {
        "EN2-CWT-01": "Primary. Plans, composes, revises and edits written texts, selecting and organising information into groups and subheadings to plan an information report for a purpose and an audience.",
        "EN2-SPELL-01": "Selects, applies and describes appropriate phonological, orthographic and morphological generalisations and strategies when spelling, including words ending in -tion (week 6 spelling focus).",
    },
    "We are learning to plan an information report by choosing a focused topic, brainstorming facts, grouping them under subheadings, and planning an introduction and a conclusion, and to spell words that end in -tion.",
    [
        "I can say what an information report is for and who reads it.",
        "I can choose a topic that is not too big and not too small.",
        "I can brainstorm facts and questions about my topic.",
        "I can sort facts into groups and give each group a subheading.",
        "I can plan an introduction and a conclusion in dot points.",
        "I can spell and use question, location, description, population, introduction and classification.",
    ],
    ["information report", "topic", "brainstorm", "category", "subheading", "dot point", "introduction", "conclusion"],
    ["This lesson (everything you need is inside it)", "Optional: an information book or a trusted website about an animal, place or hobby you like"],
    "Child has met headings, the contents page, the glossary and the index in Week 6 Lesson 1, and can write a simple sentence.",
    (
        "Why this matters. An information report tells the reader true facts about one topic. The reader should be able to find any fact quickly and understand how the facts fit together. A report that is written without a plan often jumps from idea to idea, repeats itself or forgets important parts. A plan is like a map. It shows you where you are going before you start the trip.\n\n"
        "Choosing a topic. A topic is what the report is about. A topic that is too big, such as animals, cannot fit in one report. A topic that is too small, such as the colour of one koala's ear, has almost nothing to say. A good topic is about the right size, such as koalas or little penguins. Ask yourself: could I find at least eight facts about this, and could I sort them into four groups?\n\n"
        "Brainstorming. To brainstorm means to write down every idea and fact you can think of, quickly, without worrying about the order. Start with what you already know. Then write questions you want answered, such as: What does it eat? Where does it live? What dangers does it face? Each question can lead to a group of facts.\n\n"
        "Grouping into categories. A category is a group of facts that belong together. Sort your facts into piles. Facts about food go together. Facts about homes go together. Facts about how an animal looks go together. Putting facts into categories is called classification. Each category becomes one paragraph in your report.\n\n"
        "Subheadings. A subheading is a short title for one category. It tells the reader what the paragraph is about. Good subheadings are short, such as Appearance, Habitat, Food and Dangers. In Lesson 1 you learned that headings help readers find information. Now you are choosing headings for your own report.\n\n"
        "Introduction and conclusion. The introduction comes first. It tells the reader what the topic is, what type of thing it is, and where it is found. It also gives one interesting fact to make the reader keen to read on. The conclusion comes last. It reminds the reader of the most important idea. At the planning stage, write each of these as dot points. Dot points are short notes, not full sentences.\n\n"
        "The planning routine. 1. Choose a topic of the right size. 2. Write questions. 3. Brainstorm facts. 4. Sort the facts into categories. 5. Give each category a subheading. 6. Put the subheadings in a sensible order. 7. Plan the introduction and the conclusion in dot points. 8. Check that every fact is true and belongs in its group.\n\n"
        "A quick demonstration. Topic: koalas. Question: what do koalas eat? Fact: koalas eat eucalyptus leaves. This fact belongs in a group called Food. Another fact is that eucalyptus leaves give koalas most of their water. That also belongs in Food. The fact that a koala has sharp claws belongs in a different group called Appearance, because it tells how a koala looks and what its body is like.\n\n"
        "A link to spelling. This week's spelling focus is words ending in -tion, which sounds like shun. Many planning words end this way, such as question, location, description, population, introduction and classification. Notice that question is a little different, because the tion in question sounds like chun. The letters are still t, i, o, n."
    ),
    [
        _step("1", "What an information report does", "An information report gives true facts about one topic. It is not a story. It does not have characters or a problem to solve, and it does not use I or my. It is written in the present tense, for example koalas live, not koalas lived.\n\nThe reader wants facts that are easy to find. A plan helps the writer put the facts in a clear order.", "A report about little penguins tells where they live, what they eat and how big they are. It does not tell a story about one named penguin.", "A report tells true facts about one topic in a clear order.", ("What is an information report for?", ["Telling a made-up story", "Giving true facts about one topic", "Asking the reader to buy something"], 1, "An information report gives true facts about one topic.")),
        _step("2", "Choosing a topic of the right size", "A topic that is too big cannot be covered in one report. A topic that is too small has too few facts. The right size has at least eight facts that can be sorted into about four groups.\n\nIf a topic is too big, narrow it down. Animals becomes Australian animals, then marsupials, then koalas.", "Too big: sports. Too small: my soccer boots. Just right: soccer.", "Not too big, not too small.", ("Which topic is the best size for a short report?", ["Everything about the ocean", "Little penguins", "One penguin's left foot"], 1, "Little penguins has enough facts but is still focused.")),
        _step("3", "Questions and brainstorming", "Before you look for facts, write questions. Questions give you a direction. Good question starters are what, where, how, why and who.\n\nThen brainstorm. Write down every fact you already know, and any new facts you find. Do not worry about the order yet. Use dot points, not full sentences.", "Questions about koalas: What do they eat? Where do they live? How big are joeys? What dangers do they face? Brainstormed facts: eucalyptus leaves, sleep many hours, joey, pouch, thick fur.", "Questions first, then facts.", ("What does it mean to brainstorm?", ["Write the final paragraph", "Check your spelling", "Write down all your ideas quickly, in any order"], 2, "Brainstorming means collecting ideas and facts quickly, before sorting them.")),
        _step("4", "Grouping facts into categories", "Read through your facts and look for facts that belong together. Put them in piles. Each pile is a category. A category should have at least two facts. If a fact does not fit any group, ask whether it belongs in the report at all.\n\nSorting facts into groups is called classification.", "Food: eucalyptus leaves, leaves give water. Appearance: thick fur, sharp claws, large black nose. Dangers: bushfires, cars and dogs.", "Facts that belong together go in the same group.", ("Where does the fact koalas have sharp claws belong?", ["Food", "Dangers", "Appearance"], 2, "Claws are part of how a koala looks and is built, so it belongs in Appearance.")),
        _step("5", "Subheadings and order", "Give each category a short subheading. Use a noun or a noun group, not a whole sentence. Then decide on a sensible order. Many reports start with general facts, such as what the animal is and what it looks like, and finish with more specific facts, such as dangers and how people can help.\n\nThe subheadings will become your contents page if your report is long.", "Order for koalas: Appearance, Habitat, Food, Life cycle, Dangers.", "Short subheadings in a sensible order.", ("Which is the best subheading?", ["Habitat", "Where koalas live in the forest and what trees they pick", "Koalas"], 0, "A subheading is short and names the group. Habitat does that.")),
        _step("6", "Spelling focus: -tion", "The ending -tion sounds like shun. Many words that you need when planning end this way: question, location, description, population, introduction and classification.\n\nIn question, the tion sounds like chun because of the s before it. Say the word slowly, then write -tion.", "The introduction gives the location of the animal and a description of it. A question can start your plan.", "Shun at the end is usually -tion.", ("Which is spelled correctly?", ["introdukshun", "intraduction", "introduction"], 2, "Introduction ends in -tion and has the root intro plus duct.")),
        _step("7", "Planning the introduction and conclusion", "The introduction in dot points answers three things: what is it, where is it found, and one amazing fact. The conclusion in dot points repeats the big idea and may say why the topic matters.\n\nWrite dot points, not full sentences. You will turn them into sentences when you write the draft.", "Introduction: koala, a marsupial; eastern Australia; sleeps many hours a day. Conclusion: koalas need healthy forests; people can help protect them.", "Introduction: what, where, wow. Conclusion: big idea.", ("Which is a good dot point for an introduction?", ["Then the koala went home and had dinner", "Koala, a marsupial from eastern Australia", "I love koalas the most"], 1, "A good introduction dot point names the topic and says what and where.")),
    ],
    (
        "Topic: koalas. Let's plan a report together. Step one: is koalas the right size? Yes, there are plenty of facts and it is focused. Step two: write questions. What do they look like? Where do they live? What do they eat? How do they grow up? What dangers do they face? Step three: brainstorm. Read the fact bank below. There are twelve facts in a jumbled order. Step four: sort them. Appearance: fact 2 thick grey woolly fur, fact 6 sharp claws, fact 10 large round black nose. Habitat: fact 3 eucalypt forests in eastern Australia. Food: fact 1 eucalyptus leaves, fact 11 leaves give food and water. Life cycle: fact 4 joey, fact 7 pouch for about six months. Dangers: fact 8 bushfires and land clearing, fact 12 cars and dogs. Two facts are left over. Fact 5 says koalas sleep for many hours each day. That could go in a group called Behaviour, or we could move it to Habitat or Food. Fact 9 says koalas are marsupials, not bears. That is a great fact for the introduction because it tells what a koala is. Step five: subheadings and order. Appearance, Habitat, Food, Life cycle, Dangers. Step six: introduction dot points. Koala, a marsupial and not a bear; lives in eastern Australia; sleeps for many hours each day. Step seven: conclusion dot points. Koalas depend on healthy eucalypt forests; people can protect them by looking after their homes. Notice how the plan has a clear order and every fact has a home. Because the plan is done, writing the paragraphs will be much easier.\n\n" + KOALA_FACTS
    ),
    (
        "Type your answers in the practice boxes. Part A: type one reason why a plan helps a writer, and one example of a topic that is too big and a better, smaller topic. Part B: sort these facts about little penguins into three groups and type your groups: Food, Appearance, Dangers. Facts: they eat small fish and squid; they stand about 33 centimetres tall; foxes and dogs are dangers on land; their feathers are blue-grey and white; they hunt in the sea; their flippers help them swim fast. Part C: type the correct word for each blank: The ___ of the penguin colony is the coast of southern Australia. Write a ___ of the penguin's feathers. The ___ of the colony is going up. Your parent can check your answers against the answer key."
    ),
    (
        "Plan a report about little penguins first, then plan your own report. Typed answers go in the boxes.\n\n" + PENGUIN_FACTS + "\n\n"
        "Stage 1 (group the facts): sort all ten little penguin facts into four groups and type a subheading for each group. Every fact should be used once. Two groups can have two facts and two groups can have three.\n"
        "Stage 2 (order it): type your four subheadings in the order you would put them in the report, and say why.\n"
        "Stage 3 (introduction plan): type three dot points for the introduction: what a little penguin is, where it lives, and one interesting fact.\n"
        "Stage 4 (conclusion plan): type two dot points for the conclusion.\n"
        "Stage 5 (your topic): choose your own topic. It could be an animal, a place, a sport or a hobby. Type your topic and say in one sentence why it is the right size.\n"
        "Stage 6 (your questions and facts): type four questions about your topic. Then brainstorm at least eight true facts. Use a book, a trusted website or what you already know.\n"
        "Stage 7 (your plan): sort your facts into at least three groups and type a subheading for each. Then type your introduction and conclusion dot points.\n"
        "Stage 8 (spell): type your six spelling words and one sentence for each of question, location and description.\n\n"
        "Parent: check that each penguin fact is used once and sits in a sensible group, that subheadings are short, that the order has a reason, that the introduction names the topic, tells where it lives and has an interesting fact, that the child's own topic is not too big or too small, and that facts are true and in dot points rather than full sentences. This lesson is planning only, so do not ask for full paragraphs."
    ),
    "Which part of planning did you find hardest: choosing a topic, grouping facts or writing subheadings, and what could you do to make it easier next time?",
    "Did I choose a topic of the right size, brainstorm questions and at least eight true facts, sort them into groups with short subheadings, plan an introduction and a conclusion in dot points, and spell question, location, description, population, introduction and classification correctly?",
    [
        _q("What is an information report?", ["A made-up story", "A poem", "A text that gives true facts about one topic", "A letter to a friend"], 2, "An information report gives true facts about one topic."),
        _q("Which topic is the best size?", ["Everything in the world", "Kangaroos", "One kangaroo's tail tip", "All animals"], 1, "Kangaroos is focused and has enough facts."),
        _q("What does brainstorm mean?", ["Write ideas and facts quickly in any order", "Fix your spelling", "Draw a picture", "Read the glossary"], 0, "Brainstorming means collecting ideas first."),
        _q("What is a category?", ["A spelling mistake", "A kind of heading font", "A page number", "A group of facts that belong together"], 3, "A category is a group of facts that belong together."),
        _q("Which is a good subheading?", ["Food", "The things that this animal likes to eat in the wild", "Hello", "I like this"], 0, "A good subheading is short and names the group."),
        _q("What goes in the introduction?", ["Only the end of the story", "What the topic is and where it is found", "A list of spelling words", "The glossary"], 1, "An introduction says what the topic is and where it is found."),
        _q("What are dot points?", ["Full paragraphs", "Page numbers", "Short notes, not full sentences", "Capital letters"], 2, "Dot points are short notes."),
        _q("Which tense is used in an information report?", ["Past tense", "Present tense", "Future tense", "Any tense"], 1, "Information reports are written in the present tense."),
        _q("Which is spelled correctly?", ["locasion", "locashun", "lokation", "location"], 3, "Location ends in -tion."),
        _q("Which is spelled correctly?", ["description", "discripshun", "descripsion", "descripton"], 0, "Description ends in -tion."),
    ],
    "Type your answers in the practice boxes and submit them.",
    "Extension: take your plan and ask a family member or friend what they would like to know about your topic. Add at least one new question and one new fact. Then decide whether you need a new group, and write the new subheading.",
    [("information report", "A text that gives true facts about one topic"), ("topic", "What a text is about"), ("brainstorm", "To write down lots of ideas quickly, in any order"), ("category", "A group of facts that belong together"), ("subheading", "A short title for one group of facts in a report"), ("dot point", "A short note, not a full sentence"), ("introduction", "The opening part of a report that says what the topic is and where it is found"), ("conclusion", "The closing part of a report that sums up the big idea")],
    [
        _video(
            "How to Plan and Write an Information Report (Information Investigation, Episode 3)", "bbV_YFoqu5I",
            "Watch for why a writer plans first, and how a plan has an introduction, subheadings and a conclusion. Listen for how short dot points are turned into full sentences later. The video is about 2 minutes. Status: title, description and chapters checked; full transcript still to be checked.",
            "If the video will not play, reread Steps 3 to 7 and look again at the koala plan in the worked example.",
            ("According to the video, what should you map out before you start writing?", ["Only the spelling words", "Your introduction, subheadings and conclusion", "The page numbers"], 1, "The video says to map out the introduction, subheadings and conclusion first."),
        ),
    ],
    _sort("Which group does the fact belong to?", "Sort each fact about little penguins into Food, Appearance or Dangers.", ["Food", "Appearance", "Dangers"], [("They eat small fish and squid", 0), ("They are about 33 centimetres tall", 1), ("Foxes are a danger on land", 2), ("Their feathers are blue-grey and white", 1), ("They hunt in the sea", 0), ("Dogs can harm them on beaches", 2), ("Their flippers help them swim fast", 1), ("They catch fish to feed their chicks", 0)]),
    [
        _wc("Which means to write down lots of ideas quickly?", ["brainstorm", "conclusion", "index"], 0, "To brainstorm is to collect ideas quickly."),
        _wc("Which is a short title for one group of facts?", ["glossary", "subheading", "sentence"], 1, "A subheading is a short title for a group."),
        _wc("Which is a group of facts that belong together?", ["caption", "index", "category"], 2, "A category is a group of facts that belong together."),
        _wc("Which is the opening part of a report?", ["introduction", "conclusion", "glossary"], 0, "The introduction opens the report."),
        _wc("Which is spelled correctly?", ["qestion", "question", "questun"], 1, "Question ends in -tion."),
        _wc("Which is spelled correctly?", ["populasion", "populashun", "population"], 2, "Population ends in -tion."),
        _wc("Which is spelled correctly?", ["classification", "clasification", "classifikation"], 0, "Classification has double s and ends in -tion."),
        _wc("Which is spelled correctly?", ["introdukshun", "introduction", "intraduction"], 1, "Introduction ends in -tion."),
    ],
    [
        {"key": "partA", "label": "Part A: why plan", "hint": "One reason a plan helps, and one topic that is too big with a smaller topic."},
        {"key": "partB", "label": "Part B: penguin groups", "hint": "Sort the six facts into Food, Appearance and Dangers."},
        {"key": "partC", "label": "Part C: -tion words", "hint": "location, description and population."},
        {"key": "stage1", "label": "Group the facts", "hint": "Four groups with a subheading each. Use every fact once."},
        {"key": "stage2", "label": "Order", "hint": "Your four subheadings in order, and why."},
        {"key": "stage3", "label": "Introduction plan", "hint": "What a little penguin is, where it lives, one interesting fact."},
        {"key": "stage4", "label": "Conclusion plan", "hint": "Two dot points."},
        {"key": "stage5", "label": "My topic", "hint": "Your topic and why it is the right size."},
        {"key": "stage6", "label": "My questions and facts", "hint": "Four questions and at least eight true facts."},
        {"key": "stage7", "label": "My plan", "hint": "Groups, subheadings, introduction and conclusion dot points."},
        {"key": "spelling", "label": "Spelling words", "hint": "Type your six words and a sentence each for question, location and description."},
    ],
    ["Choosing a topic that is too big, such as animals, or too small to have facts", "Writing full sentences or paragraphs while planning instead of dot points", "Putting a fact in the wrong group, or leaving a fact out", "Writing subheadings that are whole sentences instead of short titles", "Spelling the shun sound as shun or sion"],
    ["Choose a topic you know a lot about and plan a report to teach someone in your family.", "Practise your six spelling words by writing a sentence for each."],
    "Part A: accept any sensible reason, such as a plan keeps facts in order, stops repeating and makes sure nothing is missed; accept any too-big topic with a smaller version, for example animals becomes koalas. Part B: Food, they eat small fish and squid, they hunt in the sea; Appearance, they stand about 33 centimetres tall, their feathers are blue-grey and white, and their flippers help them swim fast would also fit here as a body feature, so accept either grouping with flippers under Appearance or a Swimming group; Dangers, foxes and dogs are dangers on land. Part C: location, description, population in that order. Main task Stage 1: accept any sensible four groups, for example Appearance (facts 2, 4, 7), Food (facts 1, 6), Habitat (facts 3, 5, 9) and Dangers (fact 8); fact 10 can go in Appearance or a Swimming group. Stage 2: accept any order with a reason. Stage 3: accept dot points such as little penguin, the smallest penguin; southern Australian coast; comes ashore at dusk. Stage 4: accept sensible dot points. Stages 5 to 7: accept any suitable topic with eight true facts, at least three groups with short subheadings, and introduction and conclusion in dot points. Quiz answers: a text that gives true facts about one topic; kangaroos; write ideas and facts quickly in any order; a group of facts that belong together; Food; what the topic is and where it is found; short notes, not full sentences; present tense; location; description.",
)

LESSON["spelling"] = {
    "focus": "The -tion ending (the shun sound)",
    "teaching": "The sound shun at the end of a word is most often spelled -tion. Many planning words end this way: question, location, description, population, introduction and classification. In question, the tion sounds like chun because of the s before it, but the letters are the same. Say the word slowly, listen for the ending, then write -tion.",
    "words": [
        _w("question", "ques-tion", "the tion sounds like chun, but is still t-i-o-n"),
        _w("location", "lo-ca-tion", "locate + ion, where something is"),
        _w("description", "de-scrip-tion", "describe changes to scrip, then -tion"),
        _w("population", "pop-u-la-tion", "how many live in a place, from popular"),
        _w("introduction", "in-tro-duc-tion", "intro + duct, the opening part"),
        _w("classification", "clas-si-fi-ca-tion", "double s, sorting into groups"),
    ],
    "check": [
        _c("Which is spelled correctly?", ["location", "locashun", "locasion"], 0, "Location ends in -tion."),
        _c("Which is spelled correctly?", ["questshun", "queston", "question"], 2, "Question ends in -tion."),
    ],
}
LESSON["spelling_focus"] = "The -tion ending (the shun sound)"
LESSON["hoard_words"] = list(WORDS)

if __name__ == "__main__":
    assert len(LESSON["quiz"]) == 10 and len(LESSON["word_challenges"]) == 8
    print("ok", LESSON["seed_key"])
