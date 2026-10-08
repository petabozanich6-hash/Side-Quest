"""Stage 2 English, Week 6 Lesson 1: Text Features: Headings, Glossary, Index (Reading and viewing).
The child learns what headings, the table of contents, bold key words, the glossary and the index do, then uses them on a model information book (Sea Turtles) to find facts quickly.
Spelling: the -tion ending: action, section, station, direction, information, collection.
Video status: both videos were checked against their full transcripts and lengths. The 8:34 video uses a Costa Rica travel guide and the map versus magnifying glass idea for contents versus index. The 6:58 video uses a book about the moon and also covers key words, labels and captions.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["action", "section", "station", "direction", "information", "collection"]

SEA_TURTLES = (
    "SEA TURTLES\n\n"
    "Contents\n"
    "What is a sea turtle? ... page 2\n"
    "Where they live ... page 3\n"
    "What they eat ... page 4\n"
    "Staying safe ... page 5\n"
    "Glossary ... page 6\n"
    "Index ... page 7\n\n"
    "Page 2: What is a sea turtle?\n"
    "Sea turtles are reptiles that live in the ocean. They breathe air, so they must swim to the surface. A sea turtle has a hard shell called a carapace and flippers instead of legs.\n\n"
    "Page 3: Where they live\n"
    "Sea turtles live in warm oceans around the world. Females return to a sandy beach to lay their eggs. They bury the eggs in a nest in the sand.\n\n"
    "Page 4: What they eat\n"
    "Some sea turtles are carnivores. Leatherback turtles eat jellyfish. Green sea turtles are herbivores. They eat seagrass and algae.\n\n"
    "Page 5: Staying safe\n"
    "Sea turtles face danger from rubbish in the ocean and from fishing nets. People can help by keeping beaches clean.\n\n"
    "Page 6: Glossary\n"
    "algae: simple plant-like living things that grow in water\n"
    "carapace: the hard top shell of a turtle\n"
    "carnivore: an animal that eats only meat\n"
    "herbivore: an animal that eats only plants\n"
    "reptile: a cold-blooded animal with scales or a shell that breathes air\n\n"
    "Page 7: Index\n"
    "algae, 4\n"
    "carapace, 2, 6\n"
    "eggs, 3\n"
    "fishing nets, 5\n"
    "flippers, 2\n"
    "jellyfish, 4\n"
    "nests, 3\n"
    "rubbish, 5\n"
    "seagrass, 4"
)

LESSON = build(
    "s2-eng-w06-l1-text-features-headings-glossary-index",
    "Text Features: Headings, Glossary, Index",
    "Learn how headings, the contents page, bold words, the glossary and the index help you find facts fast in an information book, then use them on a book about sea turtles.",
    "Reading and viewing: text features of information texts",
    ["EN2-RECOM-01", "EN2-SPELL-01"],
    {
        "EN2-RECOM-01": "Primary. Fluently reads and comprehends texts, using the text features of information texts, such as headings, glossaries and indexes, to locate information and understand how texts are organised.",
        "EN2-SPELL-01": "Selects, applies and describes appropriate phonological, orthographic and morphological generalisations and strategies when spelling, including words ending in -tion (week 6 spelling focus).",
    },
    "We are learning to use headings, the table of contents, the glossary and the index to find information quickly in an information text, and to spell words that end in -tion.",
    [
        "I can explain what a heading is and how it helps a reader.",
        "I can tell the difference between a table of contents and an index.",
        "I can explain what a glossary does and why some words are in bold.",
        "I can use the index and the glossary to find facts.",
        "I can say why the glossary and the index are in alphabetical order.",
        "I can spell and use action, section, station, direction, information and collection.",
    ],
    ["text features", "heading", "subheading", "table of contents", "glossary", "index", "key word", "alphabetical order"],
    ["This lesson (everything you need is inside it)", "Optional: any information book from home or the library, to find the same features"],
    "Child can read a short information paragraph and knows the ABC order of the alphabet.",
    (
        "Why this matters. Information books are not read like stories from start to finish. Readers use them to find answers. Text features are the tools that help readers find what they need and understand it quickly. Learning them saves time and helps with reports, projects and research.\n\n"
        "Headings. A heading is like a title for one section of a book. It tells the reader what that part is about before they start. Subheadings are smaller headings under a bigger heading that break the information into smaller parts.\n\n"
        "Table of contents. The contents page is at the front. It lists the headings or chapters in the order they appear, with page numbers. It is like a map of the whole book.\n\n"
        "Bold words and the glossary. Authors often print important or tricky words in bold, or in colour. These key words are explained in the glossary near the back of the book. A glossary is like a mini dictionary. It lists the words in alphabetical order, each with a simple meaning.\n\n"
        "Index. The index is at the very back of the book. It lists names and topics in alphabetical order, with the page numbers where they appear. It is like a magnifying glass, because it helps you zoom in on a small topic and go straight to its page. The contents page shows the big topics, but the index shows the small ones.\n\n"
        "Using them together. To find the meaning of a bold word, look in the glossary. To find a section, use the contents page or the headings. To find a small fact, such as jellyfish, use the index.\n\n"
        "A link to spelling. This week's spelling focus is words ending in -tion, which sounds like shun. Many information words end this way, such as section, direction, information and collection. The ending -tion is the most common spelling of the shun sound at the end of a word."
    ),
    [
        _step("1", "What text features are", "Text features are the parts of a book that help readers find and understand information. They include headings, the table of contents, bold words, the glossary and the index.\n\nInformation books are for finding answers, so readers use these features to look things up quickly.", "An information book about sea turtles has headings for each part, a contents page at the front, and a glossary and an index at the back.", "Features are tools for finding facts.", ("Why do information books have text features?", ["To help readers find and understand information", "To make the book longer", "To hide the answers"], 0, "Text features help readers find and understand information.")),
        _step("2", "Headings and subheadings", "A heading is the name of one section. It is usually bigger or bolder than the text and tells the reader what the section is about.\n\nSubheadings sit under a heading and split the section into smaller parts.", "In the Sea Turtles book, What they eat is a heading. A subheading under it could be Carnivores or Herbivores.", "Heading names a section.", ("What does a heading tell you?", ["What that section is about", "The author's name", "The page number of the index"], 0, "A heading tells the reader what the section is about.")),
        _step("3", "Contents or index?", "The table of contents is at the front. It lists the big sections in the order they appear, with page numbers. It is like a map of the whole book.\n\nThe index is at the back. It lists small topics in alphabetical order with page numbers. It is like a magnifying glass.", "To read about what turtles eat, use the contents: What they eat, page 4. To find jellyfish, use the index: jellyfish, 4.", "Contents is a map, index is a magnifying glass.", ("Which one lists small topics in ABC order with page numbers?", ["The table of contents", "The index", "The title"], 1, "The index lists topics in alphabetical order with page numbers.")),
        _step("4", "Bold words and the glossary", "Words in bold or colour are key words. The author wants the reader to notice them because they might be new or tricky.\n\nThe glossary is a mini dictionary near the back. It lists key words in alphabetical order with simple meanings.", "Carnivore is a key word on page 4. The glossary on page 6 says a carnivore is an animal that eats only meat.", "Bold word, then glossary.", ("Where would you find the meaning of a bold word?", ["In the glossary", "In the index", "On the cover"], 0, "The glossary explains key words.")),
        _step("5", "Using the index", "Find your topic in the ABC order. Then read the page number next to it and turn to that page.\n\nIf a word has more than one page number, the topic is mentioned on each of those pages.", "Rubbish, 5 means the word rubbish is on page 5. Carapace, 2, 6 means carapace is on pages 2 and 6.", "Alphabet, then page number.", ("What does carapace, 2, 6 mean?", ["Carapace is on pages 2 and 6", "Carapace has 8 parts", "Carapace is on page 26"], 0, "The numbers are the pages where carapace appears.")),
        _step("6", "Choosing the right feature", "Ask yourself what you need. A whole section? Use the contents or the headings. A tricky word? Use the glossary. A small fact? Use the index.\n\nThe right feature saves time because you do not have to read every page.", "Question: which page tells about fishing nets? Use the index: fishing nets, 5.", "Big topic, contents. Meaning, glossary. Small fact, index.", ("Which feature would you use to find the page for fishing nets?", ["The glossary", "The index", "A heading"], 1, "The index shows pages for small topics.")),
        _step("7", "Spelling focus: -tion", "The ending -tion sounds like shun. Add -tion to many words to make a noun: act becomes action, collect becomes collection, direct becomes direction. Inform becomes information.\n\nSay it slowly, then write -tion.", "The section called Staying safe has information and a collection of ideas for action.", "Shun at the end is usually -tion.", ("Which is correct?", ["direcshun", "direction", "derection"], 1, "The shun sound at the end is spelled -tion.")),
    ],
    (
        "Read the Sea Turtles book on the screen. Let's use the text features to answer questions. Question one: which page tells what sea turtles eat? Look at the contents: What they eat is on page 4. Question two: what does carnivore mean? Carnivore is a bold key word. The glossary on page 6 says a carnivore is an animal that eats only meat. Question three: which pages mention the carapace? Look at the index under C: carapace, 2, 6. So pages 2 and 6, and page 6 is the glossary. Question four: what are two dangers to sea turtles? Look at the contents: Staying safe, page 5. The text says rubbish and fishing nets. You can also check the index for rubbish, 5, and fishing nets, 5. "
        "Notice how we did not read the whole book. We used the features to go straight to the answer. The index and glossary are in ABC order, so we found carapace and algae quickly.\n\n" + SEA_TURTLES
    ),
    (
        "Type your answers in the practice boxes. Part A: say the difference between the table of contents and the index. Part B: in the Sea Turtles book, type the page where you find out about jellyfish and what herbivore means. Part C: type the correct -tion word for each blank. Choose from action, section, station, direction, information and collection. We waited for the train at the ___. Follow the ___ arrows to the exit. This book has lots of ___ about turtles. Your parent can check your answers against the answer key."
    ),
    (
        "Use the Sea Turtles book to do the tasks. Typed answers go in the boxes.\n\n" + SEA_TURTLES + "\n\n"
        "Stage 1 (find it fast): type the page number you would turn to for each: where turtles lay eggs, what green sea turtles eat, how people can help.\n"
        "Stage 2 (glossary): type what carnivore, herbivore and algae mean in your own words.\n"
        "Stage 3 (index): type the page numbers for flippers, nests, seagrass and rubbish, and tell which feature you used.\n"
        "Stage 4 (headings): imagine a new page called Baby turtles. Type a heading for it, and two subheadings, such as Hatching and Reaching the sea.\n"
        "Stage 5 (your own glossary): choose a topic you know about, such as dogs or soccer. Type three key words with meanings, in ABC order.\n"
        "Stage 6 (your own contents page): type a contents list for a pretend book with four sections, each with a page number.\n"
        "Stage 7 (spell): type your six spelling words and one sentence for each of action, section and information.\n\n"
        "Parent: check that the child uses the right feature for each question, that glossary meanings are in their own words, that the glossary words are in alphabetical order, and that the contents page lists sections with page numbers. Accept any sensible topic for the child's own glossary."
    ),
    "Which text feature will you use most when you research, and why?",
    "Did I use headings, the contents page, the glossary and the index to find information, keep my glossary in ABC order, and spell action, section, station, direction, information and collection correctly?",
    [
        _q("Which text feature tells you what a part of a book is about?", ["A glossary", "A heading", "An index", "A page number"], 1, "A heading tells what that section is about."),
        _q("Where would you find a glossary?", ["At the start", "On the cover", "At the back of the book", "In every sentence"], 2, "A glossary is near the back of a book."),
        _q("How are the glossary and the index arranged?", ["In alphabetical order", "Biggest first", "By colour", "Randomly"], 0, "Both are in ABC order."),
        _q("The table of contents is like what?", ["A mini dictionary", "A magnifying glass", "A caption", "A map of the whole book"], 3, "The contents page is like a map of the whole book."),
        _q("Which feature shows the page for fishing nets?", ["The glossary", "A heading", "The index", "The title"], 2, "The index lists small topics with page numbers."),
        _q("Which feature tells you what carnivore means?", ["The glossary", "The index", "The contents", "A heading"], 0, "The glossary gives meanings of key words."),
        _q("Why are some words in bold?", ["They are mistakes", "They are names", "They are the end", "The author wants you to notice them"], 3, "Bold key words are important or tricky."),
        _q("Which page of Sea Turtles tells what turtles eat?", ["Page 2", "Page 4", "Page 5", "Page 6"], 1, "What they eat is on page 4."),
        _q("Which is spelled correctly?", ["acshun", "action", "actian", "actun"], 1, "The shun sound is spelled -tion."),
        _q("Which is spelled correctly?", ["informasion", "infermation", "information", "informashun"], 2, "Information ends in -tion."),
    ],
    "Type your answers in the practice boxes and submit them.",
    "Extension: choose a real information book or website. Find a heading, a subheading, a bold word, and a glossary or index. Write one sentence on how each helped you find information quickly.",
    [("text features", "Parts of a text that help readers find and understand information"), ("heading", "The title of one section of a book"), ("subheading", "A smaller heading that breaks a section into parts"), ("table of contents", "A list at the front of the sections and their page numbers"), ("glossary", "A mini dictionary of key words near the back of a book"), ("index", "An ABC list of topics and their page numbers at the back of a book"), ("key word", "An important or tricky word, often in bold"), ("alphabetical order", "Arranged in the order of the letters of the alphabet")],
    [
        _video(
            "Identifying Text Features (Miacademy)", "PKy5yb7CV4k",
            "Watch how a travel guide uses its title, table of contents, headings and subheadings, bold words, the glossary and the index. Listen for the idea that the table of contents is like a map and the index is like a magnifying glass. This is about 8 and a half minutes. It is made for third-grade students and uses a Costa Rica book. Status: full transcript checked.",
            "If the video will not play, reread Steps 2 to 5 and use the Sea Turtles book.",
            ("What is the index like, compared with the table of contents?", ["A magnifying glass that zooms in on small topics", "A map of the whole book", "A title page"], 0, "The video says the index is like a magnifying glass."),
        ),
        _video(
            "Nonfiction Text Features (Growing Primary)", "y03gQNA2PgE",
            "Watch a quick tour of nonfiction text features in a book about the moon: title, contents, headings, key words, labels, captions, glossary and index. Notice how a key word links to the glossary. This is about 7 minutes. It also mentions the American spelling glossery in its captions only, so use the lesson's spelling. Status: full transcript checked.",
            "If the video will not play, reread Steps 1 to 6 and look at a real information book.",
            ("Where is a glossary found, and what does it list?", ["At the front, and it lists page numbers", "At the end of the book, and it lists key words and definitions", "On the cover, and it lists the author"], 1, "The glossary is at the end and lists key words with definitions."),
        ),
    ],
    _sort("Glossary or index?", "Sort each description into glossary or index.", ["Glossary", "Index"], [("Tells you what carnivore means", 0), ("Lists nests, page 3", 1), ("Works like a mini dictionary", 0), ("Tells you the page for rubbish", 1), ("Explains key words from the text", 0), ("Lists topics with page numbers", 1), ("Says a reptile is a cold-blooded animal that breathes air", 0), ("Helps you zoom in on a small topic", 1)]),
    [
        _wc("Which is a list of key words and meanings near the back?", ["glossary", "heading", "index"], 0, "A glossary lists key words and meanings."),
        _wc("Which lists topics and page numbers in ABC order?", ["caption", "index", "title"], 1, "The index lists topics and page numbers."),
        _wc("Which names one section of a book?", ["index", "caption", "heading"], 2, "A heading names one section."),
        _wc("Key words are often printed in ___.", ["tiny print", "bold", "faint print"], 1, "Key words are often in bold."),
        _wc("Which is spelled correctly?", ["stasion", "stashun", "station"], 2, "Station ends in -tion."),
        _wc("Which is spelled correctly?", ["section", "secshun", "sektion"], 0, "Section ends in -tion."),
        _wc("Which is spelled correctly?", ["direcshun", "direction", "derection"], 1, "Direction ends in -tion."),
        _wc("Which is spelled correctly?", ["colection", "collection", "collecshun"], 1, "Collection has a double l and ends in -tion."),
    ],
    [
        {"key": "partA", "label": "Part A: contents or index", "hint": "What is the difference between the table of contents and the index?"},
        {"key": "partB", "label": "Part B: Sea Turtles", "hint": "The page for jellyfish and what herbivore means."},
        {"key": "partC", "label": "Part C: -tion words", "hint": "Type the -tion word that fits each of the three blanks. Choose from action, section, station, direction, information and collection."},
        {"key": "stage1", "label": "Find it fast", "hint": "Pages for eggs, what green sea turtles eat, and how people can help."},
        {"key": "stage2", "label": "Glossary", "hint": "Carnivore, herbivore and algae in your own words."},
        {"key": "stage3", "label": "Index", "hint": "Pages for flippers, nests, seagrass and rubbish, and the feature you used."},
        {"key": "stage4", "label": "Headings", "hint": "A heading and two subheadings for a page called Baby turtles."},
        {"key": "stage5", "label": "My glossary", "hint": "Three key words with meanings in ABC order."},
        {"key": "stage6", "label": "My contents page", "hint": "Four sections with page numbers."},
        {"key": "spelling", "label": "Spelling words", "hint": "Type your six words and one sentence for each of action, section and information."},
    ],
    ["Reading the whole book instead of using the features", "Mixing up the contents page and the index", "Forgetting that the glossary and index are in ABC order", "Copying glossary meanings word for word instead of using your own words", "Spelling the shun sound as shun or sion"],
    ["Find an information book at home and show a parent its contents page, glossary and index.", "Practise your six spelling words by writing a sentence for each."],
    "Part A: the table of contents is at the front and lists the big sections in order with page numbers, like a map; the index is at the back and lists small topics in ABC order with page numbers, like a magnifying glass. Part B: jellyfish is on page 4 (index); herbivore means an animal that eats only plants (glossary, page 6). Part C: station, direction, information. Main task: eggs, page 3; green sea turtles eat seagrass and algae, page 4; how people can help, page 5; carnivore is an animal that eats only meat, herbivore eats only plants, algae are simple plant-like living things that grow in water (own words); flippers, 2; nests, 3; seagrass, 4; rubbish, 5, found using the index; accept any sensible heading and subheadings for Baby turtles; the child's own glossary must have three words in alphabetical order; the contents page must list four sections with page numbers. Quiz answers: a heading; at the back of the book; in alphabetical order; a map of the whole book; the index; the glossary; the author wants you to notice them; page 4; action; information.",
)

LESSON["spelling"] = {
    "focus": "The -tion ending (the shun sound)",
    "teaching": "The sound shun at the end of a word is most often spelled -tion. Many words come from a verb: act becomes action, collect becomes collection, direct becomes direction. Say the word slowly, listen for shun, then write -tion.",
    "words": [
        _w("action", "ac-tion", "act + ion, doing something"),
        _w("section", "sec-tion", "a part of a book or text"),
        _w("station", "sta-tion", "a place where trains stop"),
        _w("direction", "di-rec-tion", "the way to go, from direct"),
        _w("information", "in-for-ma-tion", "facts, from inform"),
        _w("collection", "col-lec-tion", "a group of things, with double l"),
    ],
    "check": [
        _c("Which is spelled correctly?", ["station", "stashun", "stasion"], 0, "Station ends in -tion."),
        _c("Which is spelled correctly?", ["collecshun", "colection", "collection"], 2, "Collection has a double l and ends in -tion."),
    ],
}
LESSON["spelling_focus"] = "The -tion ending (the shun sound)"
LESSON["hoard_words"] = list(WORDS)

if __name__ == "__main__":
    assert len(LESSON["quiz"]) == 10 and len(LESSON["word_challenges"]) == 8
    print("ok", LESSON["seed_key"])
