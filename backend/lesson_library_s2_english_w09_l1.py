"""Stage 2 English, Week 9 Lesson 1: Diagrams, Graphs and Captions (Reading and comprehension).
The child learns how to read the visual features of an information report: labelled diagrams, captions, and simple bar graphs, and how they add information that the main text does not give. The example page is about the echidna, continuing Weeks 7 and 8, with a made-up class survey for the graph.
Spelling: silent letters kn, wr, mb, gn: knee, knock, wrist, wrap, climb, gnat.
Outcomes: EN2-RECOM-01 and EN2-SPELL-01, checked against lesson_library_s2_english_placeholders.py (Week 9, Lesson 1, Diagrams, graphs and captions, reading slot, information reports unit, spelling silent letters kn, wr, mb, gn). Outcome wording is the official NESA text, with a short note on this lesson's focus.
Video status: no video attached. None was checked for this lesson, so none is listed.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["knee", "knock", "wrist", "wrap", "climb", "gnat"]

MODEL = (
    "MODEL PAGE: ECHIDNA FACTS\n\n"
    "Text: Echidnas are small, spiny mammals that live across Australia. They use their long snouts to find food.\n\n"
    "DIAGRAM (a picture of an echidna with label lines):\n"
    "Label 1: spines (on its back)\n"
    "Label 2: snout (long and thin)\n"
    "Label 3: claws (strong, for digging)\n"
    "Label 4: short legs\n"
    "Caption under the diagram: An echidna's sharp spines and strong claws help to keep it safe.\n\n"
    "BAR GRAPH (from a made-up class survey):\n"
    "Title: Favourite Australian animals in Class 3\n"
    "Side axis: number of votes, from 0 to 10, going up in steps of 2\n"
    "Bottom axis: the animal\n"
    "Bars: Kangaroo 8, Koala 6, Echidna 4, Wombat 2"
)

LESSON = build(
    "s2-eng-w09-l1-diagrams-graphs-captions",
    "Diagrams, Graphs and Captions",
    "Learn how to read labelled diagrams, captions and bar graphs in an information report, and how they add information to the main text.",
    "Reading: diagrams, graphs and captions",
    ["EN2-RECOM-01", "EN2-SPELL-01"],
    {
        "EN2-RECOM-01": "Reads and comprehends texts for wide purposes using knowledge of text structures and language, and by monitoring comprehension. This lesson focuses on reading diagrams, graphs and captions, and linking them to the main text of an information report.",
        "EN2-SPELL-01": "Selects, applies and describes appropriate phonological, orthographic and morphological generalisations and strategies when spelling in a range of contexts. This week's focus is silent letters: kn, wr, mb and gn.",
    },
    "We are learning how to read diagrams, graphs and captions to find information, and to spell words with silent letters.",
    [
        "I can explain why a report uses diagrams, graphs and captions.",
        "I can read the labels on a diagram.",
        "I can use a caption to understand a picture.",
        "I can read the title, axes and bars on a bar graph.",
        "I can answer questions using the numbers on a graph.",
        "I can say what a visual tells me that the text does not.",
        "I can spell and use knee, knock, wrist, wrap, climb and gnat.",
    ],
    ["diagram", "label", "caption", "graph", "scale", "title", "data", "compare"],
    ["This lesson (everything you need is inside it)", "Paper and a pencil", "A ruler (for the main task)"],
    "Child can name text features such as headings, glossary and index (Week 6 Lesson 1), and has read and written about the echidna in Weeks 7 and 8.",
    (
        "Why this matters. Information reports often use pictures, diagrams and graphs along with words. These visuals can show things that are hard to say in words, such as the parts of an animal or how many of each kind there are. A good reader reads the words and the visuals together.\n\n"
        "Diagrams and labels. A diagram is a picture that shows the parts of something. A label is a word or short group of words that names a part. A label line points to the part it names. A diagram usually has a title, too.\n\n"
        "Captions. A caption is a short line of writing near a picture, diagram or graph. It tells the reader what they are looking at, and sometimes adds a fact. Captions are usually written in the present tense, such as An echidna's strong claws help it dig.\n\n"
        "Bar graphs. A bar graph uses bars to show amounts, so that we can compare them. It has a title that tells what the graph is about, and two axes. One axis names the things being counted, and the other is a scale of numbers. To read a bar, look at the top of the bar and follow across to the scale. The numbers in a graph are called data.\n\n"
        "Reading the data. Look for the tallest bar, which is the most, and the shortest bar, which is the least. To compare, subtract: if kangaroo has 8 votes and wombat has 2, kangaroo has 6 more votes. To find the total, add all the bars.\n\n"
        "Reading visuals with the text. Check that the text and the visual agree. Then ask what the visual shows that the text does not. A diagram can show what the parts are called, and a graph can show exact numbers.\n\n"
        "Choosing the right visual. A diagram shows the parts of something. A graph shows numbers and lets us compare them. A photograph shows what something looks like. A map shows where something is.\n\n"
        "A link to spelling. This week's spelling focus is silent letters. In some words one letter is not said. The k is silent in knee and knock, the w is silent in wrist and wrap, the b is silent in climb, and the g is silent in gnat. Say the word, then picture the silent letter as you write it."
    ),
    [
        _step("1", "Why reports use visuals", "A report can use diagrams, graphs and captions along with its words.\n\nVisuals show things that are hard to say in words, so a good reader reads both together.", "A diagram shows the parts of an echidna. A graph shows how many people chose each animal.", "Read the words and the visuals together.", ("Why does a report use a diagram?", ["To show the parts of something", "To end the report", "To list the author's name"], 0, "A diagram shows the parts of something.")),
        _step("2", "Diagrams and labels", "A diagram is a picture that shows parts. A label names a part, and a label line points to it. Most diagrams have a title.\n\nRead each label, then follow its line to the part.", "Label: claws. The line points to the echidna's strong feet.", "Label, line, part.", ("What is a label?", ["A word that names a part of a picture", "The last sentence", "A page number"], 0, "A label names a part, and its line points to it.")),
        _step("3", "Captions", "A caption is a short line of writing near a picture. It tells what you are looking at and may add a fact.\n\nCaptions are usually in the present tense.", "An echidna's sharp spines and strong claws help to keep it safe.", "A caption explains a picture.", ("What does a caption do?", ["It explains the picture", "It gives a score", "It lists the index"], 0, "A caption tells what the picture shows.")),
        _step("4", "Parts of a bar graph", "A bar graph has a title, a bottom axis that names the things counted, a side axis with a scale of numbers, and bars.\n\nThe title tells what the graph is about.", "Title: Favourite Australian animals in Class 3. Bottom axis: the animal. Side axis: number of votes.", "Title, axes, scale, bars.", ("What does the title of a graph tell you?", ["What the graph is about", "Who drew it", "How tall the bars are"], 0, "The title tells what the graph is about.")),
        _step("5", "Reading the bars", "Look at the top of a bar, then follow across to the scale. The tallest bar is the most. The shortest bar is the least.\n\nCheck the scale. It goes up in steps, not always by 1.", "In the model graph, the kangaroo bar reaches 8, so 8 people chose the kangaroo.", "Top of bar, then across to the scale.", ("Which bar is the tallest in the model graph?", ["Wombat", "Echidna", "Kangaroo"], 2, "Kangaroo has 8 votes, the most.")),
        _step("6", "Comparing the data", "To compare, subtract. To find a total, add.\n\nWrite the number sentence, then the answer.", "Kangaroo 8 and wombat 2: 8 minus 2 is 6, so the kangaroo got 6 more votes. Total votes: 8 plus 6 plus 4 plus 2 is 20.", "Compare by taking away, total by adding.", ("How many more votes did the kangaroo get than the wombat?", ["10", "6", "4"], 1, "8 minus 2 is 6.")),
        _step("7", "Visuals and the text together", "Check that the text and visual agree. Then ask what the visual shows that the text does not.\n\nThe diagram names the parts, and the graph gives exact numbers.", "The text says echidnas have spines. The diagram shows where the spines are and the label names them.", "What does the visual add?", ("Which visual shows exact numbers so we can compare?", ["A diagram", "A bar graph", "A caption"], 1, "A bar graph shows numbers and lets us compare.")),
        _step("8", "Spelling focus: silent letters", "In some words one letter is silent. The k is silent in knee and knock, the w in wrist and wrap, the b in climb, and the g in gnat.\n\nSay the word, then picture the silent letter as you write it.", "knee, knock, wrist, wrap, climb, gnat.", "kn, wr, mb, gn: the first or last letter is silent.", ("Which word has a silent k?", ["knee", "keep", "kick"], 0, "The k in knee is silent.")),
    ],
    (
        "Let's read a page with visuals together. Here is my page. Echidnas are small, spiny mammals that live across Australia. They use their long snouts to find food. Next is a diagram of an echidna with four labels: spines, snout, claws and short legs. Under it is a caption: An echidna's sharp spines and strong claws help to keep it safe. Last is a bar graph. First, the diagram. The text says echidnas are spiny, but the diagram shows me where the spines are, on its back, and the label names them. The label line for claws points to the strong feet, so I know claws are used for digging. The caption adds a fact the text did not say: the spines and claws help to keep it safe. Now the graph. I read the title first: Favourite Australian animals in Class 3. The bottom axis names the animals, and the side axis counts votes in steps of 2. I look at the top of each bar and go across to the scale. Kangaroo is 8, koala 6, echidna 4, wombat 2. The tallest bar is kangaroo, so it got the most votes, and the wombat got the least. To compare, I subtract: 8 minus 2 is 6, so kangaroo got 6 more votes than wombat. To find the total I add: 8 plus 6 plus 4 plus 2 is 20 votes. Now it is your turn to read the visuals and make some of your own.\n\n" + MODEL
    ),
    (
        "Type your answers in the practice boxes. Part A: look at the model diagram and type the four labels. Part B: type a caption for a picture of a koala eating gum leaves. Part C: use the model graph. Type the number of votes for koala; how many more votes the kangaroo got than the echidna; and how many votes the koala and the wombat got altogether. Part D: type the missing silent letters: _nee, _rist, _nock, clim_, _nat. Your parent can check your answers against the answer key."
    ),
    (
        "Read the visuals and make your own. Typed answers go in the boxes. Use the model page below to help you.\n\n" + MODEL + "\n\n"
        "Stage 1 (graph): type the title of the model graph, and say what each axis shows.\n"
        "Stage 2 (diagram): type two things the diagram shows that the text does not say.\n"
        "Stage 3 (compare): type the animal with the fewest votes and how many fewer votes it has than the animal with the most.\n"
        "Stage 4 (caption): type a caption for a picture of an echidna using its sticky tongue to catch ants. Write it as a full sentence in the present tense.\n"
        "Stage 5 (diagram): on paper, draw an animal you know and add four labels with label lines and a title. Type the four labels and a caption for your diagram.\n"
        "Stage 6 (survey): ask eight to ten people which of three animals is their favourite. Type the number for each animal. On paper, draw a bar graph with a title, labelled axes and a scale. Type one sentence about what your graph shows.\n"
        "Stage 7 (spell): type your six spelling words and one sentence for each of knee, wrist and climb.\n\n"
        "Parent: check that the child names the graph title and axes correctly, and that the child identifies two sensible things that the diagram adds, such as where the spines are or what the parts are called. Check that fewest is wombat with 2 votes, which is 6 fewer than the kangaroo's 8. Check that the captions are full present tense sentences, that the child's diagram has a title, four labels and label lines, and that the survey counts match the bars on the child's graph. Accept any sensible animals and survey results."
    ),
    "Which was harder for you: reading the diagram or reading the graph, and what helps you check that you have read it correctly?",
    "Did I read the labels and captions, read the title and axes of the graph, compare numbers correctly, say what each visual adds, and spell knee, knock, wrist, wrap, climb and gnat correctly?",
    [
        _q("What does a caption do?", ["Gives the author's name", "Explains a picture, diagram or graph in a short line", "Lists the glossary", "Gives the page number"], 1, "A caption explains what the visual shows."),
        _q("What are labels on a diagram?", ["Words that name parts, with lines pointing to them", "The title", "Long paragraphs", "Page numbers"], 0, "Labels name the parts, and the lines point to them."),
        _q("Which visual is best for showing how many of each?", ["A heading", "A map", "A bar graph", "A glossary"], 2, "A bar graph shows amounts so we can compare them."),
        _q("In the model graph, which animal got the most votes?", ["Echidna", "Koala", "Wombat", "Kangaroo"], 3, "The kangaroo bar is the tallest, at 8 votes."),
        _q("How many more votes did the kangaroo get than the wombat?", ["4", "6", "8", "10"], 1, "8 minus 2 is 6."),
        _q("How many votes were there altogether in the model graph?", ["20", "18", "22", "16"], 0, "8 plus 6 plus 4 plus 2 is 20."),
        _q("What does the title of a graph tell you?", ["Who drew it", "What colour the bars are", "What the graph is about", "Nothing"], 2, "The title tells what the graph is about."),
        _q("Which is the best caption for a picture of an echidna digging?", ["Cute!", "Photo 3", "Yesterday I saw one.", "An echidna uses its strong claws to dig into the soil."], 3, "A good caption is a clear present tense fact about the picture."),
        _q("Which word has a silent k?", ["rock", "knock", "lock", "luck"], 1, "The k in knock is silent."),
        _q("Which word is spelled correctly?", ["clim", "clime", "climb", "cliem"], 2, "Climb has a silent b at the end."),
    ],
    "Type your answers in the practice boxes and submit them.",
    "Extension: find a report, a textbook or a website page with a diagram or graph. Write one caption for it, and one question that someone could answer by reading it. Ask a family member to answer your question.",
    [("diagram", "A picture that shows the parts of something"), ("label", "A word that names a part of a picture"), ("caption", "A short line of writing that explains a picture"), ("graph", "A drawing that uses bars or lines to show numbers"), ("scale", "The numbers along a graph's side that show how much"), ("title", "The name of a text or graph that tells what it is about"), ("data", "Facts or numbers that have been collected"), ("compare", "To look at how things are the same or different")],
    [],
    _sort("Diagram or graph?", "Sort each feature into diagram feature or graph feature.", ["Diagram feature", "Graph feature"], [("label lines that point to parts", 0), ("bars of different heights", 1), ("a scale of numbers up the side", 1), ("names of the parts of an animal", 0), ("shows how many of each", 1), ("shows what the parts are called", 0), ("lets us compare amounts", 1), ("shows the parts of a body", 0)]),
    [
        _wc("Which is a picture that shows the parts of something?", ["diagram", "caption", "scale"], 0, "A diagram shows the parts of something."),
        _wc("Which is a short line that explains a picture?", ["label", "caption", "title"], 1, "A caption explains a picture."),
        _wc("Which names a part of a diagram?", ["scale", "data", "label"], 2, "A label names a part."),
        _wc("Which means the numbers up the side of a graph?", ["scale", "caption", "label"], 0, "The scale is the numbers along the side."),
        _wc("Which word is spelled correctly?", ["nee", "knee", "kneee"], 1, "Knee has a silent k."),
        _wc("Which word is spelled correctly?", ["rist", "wirst", "wrist"], 2, "Wrist has a silent w."),
        _wc("Which word is spelled correctly?", ["climb", "clim", "clime"], 0, "Climb has a silent b."),
        _wc("Which word is spelled correctly?", ["nat", "gnat", "gnatt"], 1, "Gnat has a silent g."),
    ],
    [
        {"key": "partA", "label": "Part A: diagram labels", "hint": "The four labels on the model diagram."},
        {"key": "partB", "label": "Part B: a caption", "hint": "A caption for a koala eating gum leaves."},
        {"key": "partC", "label": "Part C: graph answers", "hint": "Koala votes; kangaroo minus echidna; koala plus wombat."},
        {"key": "partD", "label": "Part D: silent letters", "hint": "nee, rist, nock, clim, nat."},
        {"key": "stage1", "label": "Graph title and axes", "hint": "The title and what each axis shows."},
        {"key": "stage2", "label": "What the diagram adds", "hint": "Two things the text does not say."},
        {"key": "stage3", "label": "Fewest and most", "hint": "The animal with fewest votes and how many fewer."},
        {"key": "stage4", "label": "Echidna caption", "hint": "A present tense sentence."},
        {"key": "stage5", "label": "My diagram", "hint": "Four labels and a caption."},
        {"key": "stage6", "label": "My survey", "hint": "The counts and one sentence about the result."},
        {"key": "spelling", "label": "Spelling words", "hint": "Type your six words and a sentence each for knee, wrist and climb."},
    ],
    ["Ignoring the labels and reading only the text", "Reading the wrong bar or forgetting to check the scale", "Adding when you should subtract to compare", "Writing a caption that is an opinion or a past tense story", "Forgetting the title or axis labels on a graph", "Leaving out the silent letter: nee, rist, clim, nat"],
    ["Find a graph or diagram in a book and read it aloud to someone.", "Practise your six spelling words by writing a sentence for each."],
    "Part A: spines, snout, claws, short legs. Part B: accept a present tense caption such as A koala feeds on gum leaves. Part C: 6; 4; 8. Part D: knee, wrist, knock, climb, gnat. Main task Stage 1: Favourite Australian animals in Class 3; the bottom axis names the animal and the side axis shows the number of votes. Stage 2: accept two sensible additions, such as where the spines are, what the parts are called, and that claws are strong and used for digging. Stage 3: wombat, 6 fewer votes than the kangaroo (2 compared with 8). Stage 4: accept a present tense sentence such as An echidna uses its sticky tongue to catch ants. Stage 5: accept a diagram with a title, four labels and a present tense caption. Stage 6: accept any sensible counts, a graph with a title, labelled axes and a scale, and a sentence that matches the data. Stage 7: accept six correctly spelled words and sentences. Quiz answers: explains a picture, diagram or graph in a short line; words that name parts, with lines pointing to them; a bar graph; kangaroo; 6; 20; what the graph is about; An echidna uses its strong claws to dig into the soil; knock; climb.",
)

LESSON["spelling"] = {
    "focus": "Silent letters: kn, wr, mb, gn",
    "teaching": "In some words one letter is silent. The k is silent in knee and knock, the w in wrist and wrap, the b in climb, and the g in gnat. Say the word, then picture the silent letter as you write it.",
    "words": [
        _w("knee", "knee", "silent k at the start, the joint in your leg"),
        _w("knock", "knock", "silent k at the start, to tap on a door"),
        _w("wrist", "wrist", "silent w at the start, the joint by your hand"),
        _w("wrap", "wrap", "silent w at the start, to cover something"),
        _w("climb", "climb", "silent b at the end, to go up"),
        _w("gnat", "gnat", "silent g at the start, a tiny flying insect"),
    ],
    "check": [
        _c("Which word has a silent w?", ["wrist", "west", "wind"], 0, "The w in wrist is silent."),
        _c("Which word has a silent b?", ["band", "bring", "climb"], 2, "The b in climb is silent."),
    ],
}
LESSON["spelling_focus"] = "Silent letters: kn, wr, mb, gn"
LESSON["hoard_words"] = list(WORDS)

if __name__ == "__main__":
    assert len(LESSON["quiz"]) == 10 and len(LESSON["word_challenges"]) == 8
    print("ok", LESSON["seed_key"])
