"""Stage 2 English, Week 9 Lesson 1: Diagrams, Graphs and Captions (Reading and comprehension).
REWRITTEN with real visuals. The echidna diagram and the bar graphs are drawn as SVG by the helper functions below, so the child can actually see what the lesson talks about.
The child learns how to read the visual features of an information report: labelled diagrams, captions and simple bar graphs, and how they add information that the main text does not give. The example page is about the echidna, continuing Weeks 7 and 8, with a made-up class survey for the graph.
Spelling: silent letters kn, wr, mb, gn: knee, knock, wrist, wrap, climb, gnat.
Outcomes: EN2-RECOM-01 and EN2-SPELL-01, checked against lesson_library_s2_english_placeholders.py (Week 9, Lesson 1). Outcome wording is the official NESA text, with a short note on this lesson's focus.
Resources: three YouTube videos (diagrams and labels; reading bar graphs; bar graph problems with more and total) and two echidna pages (Australian Museum, NSW schools fact sheet). Video IDs were taken from search results and the videos have not been watched in full, so a parent should preview them.
Facts used: echidnas are egg-laying mammals (monotremes) with spines, a long toothless snout, strong digging claws, and a long sticky tongue for catching ants and termites. Koalas eat eucalyptus (gum) leaves. The class survey numbers are made up.
"""
import math

from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _visual, _video, _article
from spelling_s2_w1 import _w, _c

WORDS = ["knee", "knock", "wrist", "wrap", "climb", "gnat"]

SURVEY = [("Kangaroo", 8), ("Koala", 6), ("Echidna", 4), ("Wombat", 2)]
SURVEY_TITLE = "Favourite Australian animals in Class 3"


def _echidna_svg():
    cx, cy, rx, ry = 290, 180, 120, 62
    p = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 340" font-family="Arial, sans-serif">',
        '<rect width="560" height="340" fill="#FFFDF6"/>',
        '<text x="280" y="28" text-anchor="middle" font-size="16" font-weight="bold" fill="#1F3B2D">An echidna</text>',
    ]
    for deg in range(190, 351, 10):
        a = math.radians(deg)
        x1, y1 = cx + rx * math.cos(a), cy + ry * math.sin(a)
        x2, y2 = cx + (rx + 26) * math.cos(a), cy + (ry + 26) * math.sin(a)
        p.append(f'<line x1="{x1:.0f}" y1="{y1:.0f}" x2="{x2:.0f}" y2="{y2:.0f}" stroke="#3E2A18" stroke-width="4" stroke-linecap="round"/>')
    p.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="#8B6B4A" stroke="#3E2A18" stroke-width="2"/>')
    p.append('<path d="M178,160 L78,188 L178,196 Z" fill="#6E5238" stroke="#3E2A18" stroke-width="2"/>')
    p.append('<circle cx="192" cy="166" r="5" fill="#111"/>')
    for x in (225, 330):
        p.append(f'<rect x="{x}" y="225" width="30" height="40" rx="8" fill="#6E5238" stroke="#3E2A18" stroke-width="2"/>')
        for dx in (3, 15, 27):
            p.append(f'<line x1="{x + dx}" y1="265" x2="{x + dx - 4}" y2="282" stroke="#222" stroke-width="4" stroke-linecap="round"/>')
    labels = [
        ("spines", 430, 70, 365, 106),
        ("snout", 20, 140, 112, 182),
        ("claws", 140, 322, 232, 278),
        ("short legs", 420, 312, 352, 248),
    ]
    for text, tx, ty, px, py in labels:
        sx, sy = (tx + 40, ty - 16) if tx < 100 or (tx < 200 and ty > 300) else (tx - 4, ty - 5)
        if text == "short legs":
            sx, sy = tx - 4, ty - 14
        p.append(f'<line x1="{sx}" y1="{sy}" x2="{px}" y2="{py}" stroke="#C77B5B" stroke-width="2"/>')
        p.append(f'<circle cx="{px}" cy="{py}" r="4" fill="#C77B5B"/>')
        p.append(f'<text x="{tx}" y="{ty}" font-size="16" font-weight="bold" fill="#1F3B2D">{text}</text>')
    p.append('</svg>')
    return "".join(p)


def _bar_svg(items, title=SURVEY_TITLE, ymax=10, step=2, xlabel="Animal", ylabel="Number of votes", values=False, trace=None, notes=None):
    w, h = 620, 360
    x0, x1, yb, yt = 70, 470, 270, 50
    unit = (yb - yt) / ymax
    slot = (x1 - x0) / len(items)
    bw = slot * 0.64
    colours = ["#C77B5B", "#6B8A5B", "#8B6B4A", "#4A6D8C", "#A07CA8"]
    p = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" font-family="Arial, sans-serif">',
        f'<rect width="{w}" height="{h}" fill="#FFFDF6"/>',
        f'<text x="{(x0 + x1) / 2:.0f}" y="30" text-anchor="middle" font-size="15" font-weight="bold" fill="#1F3B2D">{title}</text>',
    ]
    for v in range(0, ymax + 1, step):
        y = yb - v * unit
        p.append(f'<line x1="{x0}" y1="{y:.0f}" x2="{x1}" y2="{y:.0f}" stroke="#E4DCC4" stroke-width="1"/>')
        p.append(f'<text x="{x0 - 8}" y="{y + 5:.0f}" text-anchor="end" font-size="13" fill="#333">{v}</text>')
    p.append(f'<line x1="{x0}" y1="{yt}" x2="{x0}" y2="{yb}" stroke="#333" stroke-width="2"/>')
    p.append(f'<line x1="{x0}" y1="{yb}" x2="{x1}" y2="{yb}" stroke="#333" stroke-width="2"/>')
    for i, (name, val) in enumerate(items):
        cx = x0 + slot * (i + 0.5)
        top = yb - val * unit
        p.append(f'<rect x="{cx - bw / 2:.0f}" y="{top:.0f}" width="{bw:.0f}" height="{val * unit:.0f}" fill="{colours[i % len(colours)]}" stroke="#333" stroke-width="1"/>')
        p.append(f'<text x="{cx:.0f}" y="{yb + 22}" text-anchor="middle" font-size="14" fill="#222">{name}</text>')
        if values:
            p.append(f'<text x="{cx:.0f}" y="{top - 6:.0f}" text-anchor="middle" font-size="14" font-weight="bold" fill="#222">{val}</text>')
        if trace == name:
            p.append(f'<line x1="{cx:.0f}" y1="{top:.0f}" x2="{x0}" y2="{top:.0f}" stroke="#C0392B" stroke-width="2" stroke-dasharray="6 4"/>')
            p.append(f'<circle cx="{x0}" cy="{top:.0f}" r="5" fill="#C0392B"/>')
            p.append(f'<text x="{cx:.0f}" y="{top - 10:.0f}" text-anchor="middle" font-size="13" font-weight="bold" fill="#C0392B">1. top of the bar</text>')
            p.append(f'<text x="{x0 + 10}" y="{top - 8:.0f}" font-size="13" font-weight="bold" fill="#C0392B">2. go across</text>')
    p.append(f'<text x="{(x0 + x1) / 2:.0f}" y="318" text-anchor="middle" font-size="14" fill="#333">{xlabel}</text>')
    p.append(f'<text transform="rotate(-90 18 160)" x="18" y="160" text-anchor="middle" font-size="14" fill="#333">{ylabel}</text>')
    for text, tx, ty, px, py in (notes or []):
        sx, sy = (tx + 25, ty - 16) if tx < 100 else (tx - 4, ty - 5)
        p.append(f'<line x1="{sx}" y1="{sy}" x2="{px}" y2="{py}" stroke="#C0392B" stroke-width="1.5"/>')
        p.append(f'<circle cx="{px}" cy="{py}" r="4" fill="#C0392B"/>')
        p.append(f'<text x="{tx}" y="{ty}" font-size="14" font-weight="bold" fill="#C0392B">{text}</text>')
    p.append('</svg>')
    return "".join(p)


V_ECHIDNA = _visual(
    _echidna_svg(),
    "A drawing of an echidna from the side, facing left. Long spines cover its back, it has a long thin snout, short legs and strong claws. Label lines point to the spines, the snout, the claws and the short legs.",
    "An echidna's sharp spines and strong claws help to keep it safe.",
)
V_GRAPH_PLAIN = _visual(
    _bar_svg(SURVEY),
    "A bar graph called Favourite Australian animals in Class 3. The bottom axis names four animals. The side axis shows the number of votes from 0 to 10 in steps of 2. The bars reach 8 for kangaroo, 6 for koala, 4 for echidna and 2 for wombat.",
    "A bar graph from a made-up class survey.",
)
V_GRAPH_PARTS = _visual(
    _bar_svg(SURVEY, notes=[("Title", 505, 30, 430, 24), ("A bar", 505, 120, 352, 184), ("Bottom axis", 505, 300, 462, 288), ("Scale", 20, 345, 58, 205)]),
    "The same bar graph with four red notes. Title points to the heading, A bar points to a bar, Bottom axis points to the animal names, and Scale points to the numbers up the side.",
    "The four parts to check on every bar graph: the title, the bars, the bottom axis and the scale.",
)
V_GRAPH_TRACE = _visual(
    _bar_svg(SURVEY, trace="Kangaroo"),
    "The bar graph with a red dotted line running from the top of the kangaroo bar across to the number 8 on the scale.",
    "To read a bar: find the top of the bar, then go across to the scale. The kangaroo bar reaches 8.",
)
V_GRAPH_VALUES = _visual(
    _bar_svg(SURVEY, values=True),
    "The bar graph with the number of votes written above each bar: kangaroo 8, koala 6, echidna 4, wombat 2.",
    "Kangaroo 8, koala 6, echidna 4, wombat 2. Now we can compare and add.",
)

DATA_LINE = "Bars in the model graph: Kangaroo 8, Koala 6, Echidna 4, Wombat 2 (scale 0 to 10, going up in steps of 2)."

MODEL = (
    "MODEL PAGE: ECHIDNA FACTS\n\n"
    "Text: Echidnas are small, spiny mammals that live across Australia. They use their long snouts to find food.\n\n"
    "Diagram labels: spines (on its back); snout (long and thin); claws (strong, for digging); short legs.\n"
    "Caption under the diagram: An echidna's sharp spines and strong claws help to keep it safe.\n\n"
    "Graph title: " + SURVEY_TITLE + "\n" + DATA_LINE
)

RESOURCES = [
    _video(
        "Text features: diagrams and labels",
        "vdyiupgsplI",
        "Watch for how the video explains a diagram and its labels. Pause and say what a label line points to. Then look back at the echidna diagram and name its four labels.",
        "If you cannot watch the video, look at a diagram in a library book or the echidna diagram in this lesson and say what each label names.",
        ("What does a label on a diagram do?", ["It names one part of the picture", "It tells you who drew it", "It gives the page number"], 0, "A label names a part of the diagram, and its line points to that part."),
    ),
    _video(
        "How to read and interpret a bar graph",
        "nDaKJBjZszQ",
        "Watch how the video names the parts of a bar graph: the title, the bottom axis and the side axis. Check each part on the lesson graph afterwards. This video uses small numbers, so it is a gentle start.",
        "If you cannot watch the video, use the lesson graph and point to the title, the bottom axis, the scale and a bar, saying the name of each.",
        ("What should you read first on a bar graph?", ["The title, to see what it is about", "The tallest bar", "The colours"], 0, "The title tells you what the graph is about, so read it first."),
    ),
    _video(
        "Bar graph problems: how many more, how many altogether",
        "iCnh6EL1Lmo",
        "Watch how the video reads bars, subtracts to find how many more, and adds to find the total. It counts the scale by tens and its graph is about baseball, but the method is exactly what you do with the echidna survey graph.",
        "If you cannot watch the video, use the lesson graph and write a number sentence for how many more votes the kangaroo got than the koala, and the total of all four animals.",
        ("To find how many more, what do you do?", ["Subtract the smaller number from the larger", "Add all the numbers", "Count the bars"], 0, "How many more means find the difference, so subtract."),
    ),
    _article("Short-beaked echidna (Australian Museum)", "https://australian.museum/learn/animals/mammals/short-beaked-echidna/"),
    _article("Short-beaked echidna fact sheet (NSW school wildlife site)", "https://fieldofmar-e.schools.nsw.gov.au/fact-sheets/mammals/short-beaked-echidna-fact-sheet"),
]

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
        "I can read the labels on a diagram and follow each label line to its part.",
        "I can use a caption to understand a picture.",
        "I can read the title, axes, scale and bars on a bar graph.",
        "I can answer questions using the numbers on a graph.",
        "I can say what a visual tells me that the text does not.",
        "I can spell and use knee, knock, wrist, wrap, climb and gnat.",
    ],
    ["diagram", "label", "caption", "graph", "scale", "title", "data", "compare"],
    ["This lesson (everything you need is inside it)", "Paper and a pencil", "A ruler (for the main task)"],
    "Child can name text features such as headings, glossary and index (Week 6 Lesson 1), and has read and written about the echidna in Weeks 7 and 8.",
    (
        "Diagrams, graphs and captions are the pictures-with-a-purpose of an information report. A diagram shows the parts of something and a label names each part. A caption explains a picture in a short sentence. A bar graph shows amounts with bars so they can be compared. Always read the visual and the words together and ask what the visual adds."
    ),
    [
        _step(
            "🔍", "Why reports use pictures and graphs",
            "Imagine you had to tell a friend what an echidna looks like, but you were only allowed to use words. You might say it is small, brown and covered in spikes. Your friend could still picture something quite different from the real animal. Now imagine you hold up a drawing. In one glance your friend can see the spiky back, the long thin nose and the strong little feet.\n\n"
            "That is why the people who write information reports add visuals. A visual is any picture, diagram, photo or graph that goes along with the words. Some things are very hard to explain in words but easy to show, like what the parts of an animal are called and where they are. Other things, like how many people like each animal, are far easier to compare in a graph than in a long sentence full of numbers.\n\n"
            "The words and the visuals work as a team, and neither one tells you everything. A strong reader uses both, and moves back and forth between them.",
            "Words only: Echidnas are small, spiny mammals.\n\nWords plus the diagram: now you can see that the spines cover its back, that the nose is long and thin, and that the legs are short with strong claws. The sentence never told you those things.",
            "Look at the diagram and count what it shows you that the sentence did not say. That is what a visual adds.",
            ("Why does a report use a diagram?", ["To show the parts of something", "To end the report", "To list the author's name"], 0, "A diagram shows the parts of something and where they are."),
            visual=[V_ECHIDNA],
        ),
        _step(
            "🏷️", "Diagrams and labels",
            "A diagram is a drawing made to teach you something. It is different from a photo, because the person who made it leaves out the busy, unimportant bits and keeps only the parts you need to learn.\n\n"
            "Every good diagram has a title, which tells you what the whole picture shows. It also has labels. A label is a word or a few words that name one part. Each label has a label line, and the line ends on the exact part that the label names, usually with a dot.\n\n"
            "There is a simple habit that makes diagrams easy to read: read the label, follow its line with your finger, find the part it touches, and say in your own words what that part is. Doing this slowly is much better than glancing at the picture and guessing.",
            "Read the label claws. Follow the line with your finger. It ends on the feet at the bottom of the echidna, so the claws are on its feet, and the strong shape tells us they are for digging.\n\nRead the label snout. The line ends on the long thin nose at the front, so that is the snout.",
            "A label only makes sense with its line. Always check where the line ends.",
            ("What does a label line do?", ["It joins a label to the part it names", "It shows the end of the report", "It tells you the page number"], 0, "The label line ends on the part that the label names."),
            visual=[V_ECHIDNA],
        ),
        _step(
            "📝", "Captions",
            "A caption is a short line of writing that sits near a picture, diagram or graph. Your eyes usually go to the picture first, and the caption tells you what you are looking at and what to notice. Sometimes it adds a fact that is not in the main text.\n\n"
            "A good caption is a full sentence. It is about the picture, it is a fact and not an opinion, and in an information report it is usually written in the present tense, as if it is true now. \"An echidna uses its claws to dig\" is present tense. \"Yesterday I saw an echidna\" is a story about the past, and it belongs in a recount, not a caption.\n\n"
            "A weak caption such as \"Cute!\" or \"Photo 2\" tells the reader nothing. Before you write a caption, ask yourself what the reader should learn from this picture.",
            "Weak: Cute!\nWeak: Photo 2\nWeak: Yesterday I saw one.\nStrong: An echidna's sharp spines and strong claws help to keep it safe.\n\nThe strong caption is a present tense sentence, it is a fact, and it adds something: the spines and claws are for staying safe.",
            "A caption explains the picture, and it adds a fact. Look at the caption under the echidna diagram.",
            ("Which is the best caption for a photo of an echidna digging?", ["Cute!", "An echidna uses its strong claws to dig into the soil.", "I saw one last week."], 1, "A good caption is a clear present tense fact about the picture."),
            visual=[V_ECHIDNA],
        ),
        _step(
            "📊", "The parts of a bar graph",
            "A bar graph turns numbers into towers so your eyes can compare them quickly. The tallest tower has the most, and the shortest has the least. Before you read any bars, check four things in the same order every time.\n\n"
            "First, read the title. It tells you what the graph is about. Second, read the bottom axis. It names the things that were counted, here the animals. Third, read the scale up the side. These are the numbers, and you must check how they count: here they go up in twos (0, 2, 4, 6, 8, 10). Fourth, look at the bars.\n\n"
            "The numbers that a graph shows are called data. People collect data by counting or asking questions, for example by asking a class which animal they like best, and then they draw the graph so everyone can understand the answer at a glance.",
            "Title: Favourite Australian animals in Class 3. So the graph is about which animal this class likes best.\nBottom axis: the animal. Side axis: the number of votes, counting by 2s.\nBars: one for each animal.",
            "Title, bottom axis, scale, bars. Check the scale first, because it does not always count by 1.",
            ("What does the scale on a graph show?", ["The numbers, so you can tell how much each bar shows", "Who made the graph", "The colour of the bars"], 0, "The scale is the row of numbers that you use to read the bars."),
            visual=[V_GRAPH_PARTS],
        ),
        _step(
            "📏", "Reading the bars",
            "To find out what a bar says, do two things. First, find the top of the bar. Second, slide your finger straight across to the scale and read the number it lines up with. The dotted line in the picture shows exactly how to do it.\n\n"
            "Sometimes the top of a bar sits between two lines on the scale. If the scale counts by twos and a bar stops halfway between 4 and 6, the number is 5. Always look at how the scale counts before you decide.\n\n"
            "Once you can read every bar, you can answer questions. The tallest bar is the most and the shortest bar is the least. Bars that are the same height have the same amount.",
            "The kangaroo bar reaches the line marked 8, so 8 people chose the kangaroo. The wombat bar reaches 2, so only 2 people chose the wombat. The tallest bar is the kangaroo, and the shortest is the wombat.",
            "Top of the bar first, then straight across to the scale.",
            ("The top of a bar lines up with 6 on the scale. What does that mean?", ["That bar shows 6", "The bar is 6 centimetres tall", "It is the sixth bar"], 0, "You read the number the top of the bar lines up with."),
            visual=[V_GRAPH_TRACE],
        ),
        _step(
            "➕", "Comparing the data",
            "Graphs are made so we can compare. Once the numbers are written out, you can do number sentences with them. Different questions use different operations, and the words in the question are your clue.\n\n"
            "When a question says how many more, how many fewer or what is the difference, subtract the smaller number from the larger. When it says altogether or in total, add the numbers. When it says which has the most or the least, you only need to look for the tallest or shortest bar.\n\n"
            "Write the number sentence before you write the answer. It stops mistakes, and it shows your thinking to anyone who checks your work.",
            "How many more votes did the kangaroo get than the wombat? More means subtract: 8 - 2 = 6, so 6 more.\n\nHow many votes altogether? Altogether means add: 8 + 6 + 4 + 2 = 20 votes.\n\nWhich animal got the fewest votes? The shortest bar is the wombat, with 2.",
            "The question words are clues: more or fewer means subtract, altogether means add.",
            ("How many more votes did the kangaroo get than the wombat?", ["10", "6", "4"], 1, "8 - 2 = 6."),
            visual=[V_GRAPH_VALUES],
        ),
        _step(
            "🧩", "Visuals and words together",
            "When you read a page with visuals, do not read the words and then skip the pictures. Use three questions. Do the words and the visual agree with each other? What does the visual tell me that the words do not? And is this the right kind of visual for the job?\n\n"
            "Different visuals do different jobs. A diagram shows the parts of something and what they are called. A graph shows numbers so that we can compare them. A photograph shows what something really looks like. A map shows where something is. A writer picks the visual that fits what they want the reader to understand.\n\n"
            "If a report says echidnas have spines, the diagram can show exactly where on the body they grow, and the label gives you the proper name. The graph can tell you something the words never could, like how many people in a class like the echidna best.",
            "The text says: Echidnas are small, spiny mammals.\nThe diagram adds: where the spines are, and the names of the snout, claws and legs.\nThe graph adds: exactly how many people in Class 3 chose the echidna (4), and that more people chose the kangaroo (8).",
            "Ask what the visual adds that the words do not.",
            ("Which visual would you use to show how many of each animal was counted?", ["A diagram", "A bar graph", "A caption"], 1, "A bar graph shows numbers and lets us compare them."),
            visual=[V_ECHIDNA, V_GRAPH_PLAIN],
        ),
        _step(
            "🔤", "Spelling focus: silent letters",
            "Some words have a letter that you write but do not say. These are called silent letters. Long ago, people really did say them. Knee was said with a k sound at the start, and so was knock. The way we say the words slowly changed, but the spelling stayed the same, so the old letters are still sitting there.\n\n"
            "This week we have four patterns. The k is silent in kn words: knee and knock. The w is silent in wr words: wrist and wrap. The b is silent after m at the end of climb. The g is silent in gn words: gnat.\n\n"
            "A good way to remember is to say the word the way it sounds, then say it in a silly way with the silent letter pronounced, like k-nee, and write what you say. That silly voice will help your hand remember the silent letter.",
            "knee, knock, wrist, wrap, climb, gnat.\n\nSay: k-nee. Write: knee.\nSay: w-rist. Write: wrist.\nSay: clim-b. Write: climb.",
            "kn, wr, mb, gn: one letter is silent but you still write it.",
            ("Which word has a silent k?", ["knee", "keep", "kick"], 0, "The k in knee is silent. In keep and kick you can hear the k."),
        ),
    ],
    (
        "Let's read a page with visuals together, using the echidna diagram and the graph shown above.\n\n"
        "My page says: Echidnas are small, spiny mammals that live across Australia. They use their long snouts to find food. I read the words first, then I look at the diagram. The text says echidnas are spiny, but the diagram shows me where the spines are, on its back, and the label names them. I follow the label line for claws, and it ends on the strong feet, so I know the claws are on the feet. Then I read the caption: An echidna's sharp spines and strong claws help to keep it safe. The caption adds a fact the text did not say.\n\n"
        "Now the graph. I read the title first: Favourite Australian animals in Class 3. The bottom axis names the animals, and the side axis counts votes in steps of 2. I look at the top of each bar and go across to the scale. Kangaroo is 8, koala 6, echidna 4, wombat 2. The tallest bar is the kangaroo, so it got the most votes, and the wombat got the fewest. To compare, I subtract: 8 - 2 = 6, so the kangaroo got 6 more votes than the wombat. To find the total I add: 8 + 6 + 4 + 2 = 20 votes.\n\n"
        "Now it is your turn to read the visuals and make some of your own.\n\n" + MODEL
    ),
    (
        "Here we practise together. Read each part, then type your answers in the boxes on the next stage. You can open the 'Put it all together' stage again at any time to look at the echidna diagram and the graph.\n\n"
        "Part A: look at the echidna diagram and type its four labels.\n\n"
        "Part B: type a caption for a picture of a koala eating gum leaves. Make it a full sentence in the present tense.\n\n"
        "Part C: use the model graph. " + DATA_LINE + " Type three answers: how many votes the koala got; how many more votes the kangaroo got than the echidna; and how many votes the koala and the wombat got altogether. Write the number sentences too.\n\n"
        "Part D: type the missing silent letters to make five words: _nee, _rist, _nock, clim_, _nat."
    ),
    (
        "Now read the visuals and make your own. Type your answers in the big box, and number each one. You can look back at the echidna diagram and the graph in the 'Put it all together' stage. " + DATA_LINE + "\n\n"
        "1. Graph: type the title of the model graph, and say what each axis shows.\n\n"
        "2. Diagram: type two things the diagram shows that the text does not say.\n\n"
        "3. Compare: type the animal with the fewest votes, and how many fewer votes it has than the animal with the most.\n\n"
        "4. Caption: type a caption for a picture of an echidna using its sticky tongue to catch ants. Write it as a full sentence in the present tense.\n\n"
        "5. Your own diagram: on paper, draw an animal you know and add four labels with label lines and a title. Type your four labels and a caption for your diagram.\n\n"
        "6. Your own survey: ask eight to ten people which of three animals is their favourite. Type the number for each animal. On paper, draw a bar graph with a title, labelled axes and a scale, using a ruler. Type one sentence about what your graph shows.\n\n"
        "7. Spelling: type your six spelling words, and write one sentence each for knee, wrist and climb."
    ),
    "Which was harder for you: reading the diagram or reading the graph, and what helps you check that you have read it correctly?",
    "Did I read the labels and captions, read the title, scale and bars of the graph, compare numbers correctly, say what each visual adds, and spell knee, knock, wrist, wrap, climb and gnat correctly?",
    [
        _q("What does a caption do?", ["Gives the author's name", "Explains a picture, diagram or graph in a short line", "Lists the glossary", "Gives the page number"], 1, "A caption explains what the visual shows."),
        _q("What are labels on a diagram?", ["Words that name parts, with lines pointing to them", "The title", "Long paragraphs", "Page numbers"], 0, "Labels name the parts, and the lines point to them."),
        _q("Which visual is best for showing how many of each?", ["A heading", "A map", "A bar graph", "A glossary"], 2, "A bar graph shows amounts so we can compare them."),
        _q("In the model graph (kangaroo 8, koala 6, echidna 4, wombat 2), which animal got the most votes?", ["Echidna", "Koala", "Wombat", "Kangaroo"], 3, "The kangaroo bar is the tallest, at 8 votes."),
        _q("In the model graph (kangaroo 8, koala 6, echidna 4, wombat 2), how many more votes did the kangaroo get than the wombat?", ["4", "6", "8", "10"], 1, "8 - 2 = 6."),
        _q("How many votes were there altogether (kangaroo 8, koala 6, echidna 4, wombat 2)?", ["20", "18", "22", "16"], 0, "8 + 6 + 4 + 2 = 20."),
        _q("What does the title of a graph tell you?", ["Who drew it", "What colour the bars are", "What the graph is about", "Nothing"], 2, "The title tells what the graph is about."),
        _q("Which is the best caption for a picture of an echidna digging?", ["Cute!", "Photo 3", "Yesterday I saw one.", "An echidna uses its strong claws to dig into the soil."], 3, "A good caption is a clear present tense fact about the picture."),
        _q("Which word has a silent k?", ["rock", "knock", "lock", "luck"], 1, "The k in knock is silent."),
        _q("Which word is spelled correctly?", ["clim", "clime", "climb", "cliem"], 2, "Climb has a silent b at the end."),
    ],
    "Type your answers in the practice boxes and in the big box, then submit them.",
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
        {"key": "partA", "label": "Part A: diagram labels", "hint": "The four labels on the echidna diagram."},
        {"key": "partB", "label": "Part B: a caption", "hint": "A present tense caption for a koala eating gum leaves."},
        {"key": "partC", "label": "Part C: graph answers", "hint": "Koala votes; kangaroo minus echidna; koala plus wombat. Add your number sentences."},
        {"key": "partD", "label": "Part D: silent letters", "hint": "The five words from _nee, _rist, _nock, clim_, _nat."},
    ],
    ["Ignoring the labels and reading only the text", "Reading the wrong bar or forgetting to check the scale", "Adding when you should subtract to compare", "Writing a caption that is an opinion or a past tense story", "Forgetting the title or axis labels on a graph", "Leaving out the silent letter: nee, rist, clim, nat"],
    ["Find a graph or diagram in a book and read it aloud to someone.", "Practise your six spelling words by writing a sentence for each."],
    "Part A: spines, snout, claws, short legs. Part B: accept a present tense caption such as A koala feeds on gum leaves. Part C: 6; 4 (8 - 4); 8 (6 + 2). Part D: knee, wrist, knock, climb, gnat. Main task 1: Favourite Australian animals in Class 3; the bottom axis names the animal and the side axis shows the number of votes. 2: accept two sensible additions, such as where the spines are, what the parts are called, and that claws are strong and used for digging. 3: wombat, 6 fewer votes than the kangaroo (2 compared with 8). 4: accept a present tense sentence such as An echidna uses its sticky tongue to catch ants. 5: accept a diagram with a title, four labels and a present tense caption. 6: accept any sensible counts, a graph with a title, labelled axes and a scale, and a sentence that matches the data. 7: accept six correctly spelled words and sentences. Quiz answers: explains a picture, diagram or graph in a short line; words that name parts, with lines pointing to them; a bar graph; kangaroo; 6; 20; what the graph is about; An echidna uses its strong claws to dig into the soil; knock; climb.",
    parent_check=(
        "Check that the child names the graph title and axes correctly, and that the child identifies two sensible things that the diagram adds, such as where the spines are or what the parts are called. Check that fewest is wombat with 2 votes, which is 6 fewer than the kangaroo's 8. Check that the captions are full present tense sentences, that the child's diagram has a title, four labels and label lines, and that the survey counts match the bars on the child's graph. Accept any sensible animals and survey results."
    ),
    worked_visuals=[V_ECHIDNA, V_GRAPH_VALUES],
)

LESSON["resources"] = RESOURCES

EXPLICIT_TEACHING = (
    "The big idea. Every information report is really two texts working side by side: the words, and the visuals. Children usually learn to read the words long before they learn to read the visuals, so they treat a diagram as decoration and a graph as something to skip. This lesson changes that habit. By the end, your child should treat a diagram, a caption and a bar graph the way a detective treats evidence. Each one holds facts that the paragraph beside it never mentions, and a careful reader goes looking for them.\n\n"
    "How to open the lesson. Start with a question, not a definition. Ask your child to describe an echidna to you using words only, while you try to draw what you hear. Give it thirty seconds, then hold up the diagram in the lesson. The gap between your sketch and the real picture is the whole lesson in one moment. Name it out loud: a visual can carry things that words carry badly, such as where a part sits on a body, what a part is called, or how many of something there are. Once your child has felt that gap for themselves, the vocabulary (diagram, label, caption, scale) has something to attach to.\n\n"
    "Teaching diagrams. A diagram is not a photograph. The person who made it chose what to leave out, so what remains is exactly what the reader is meant to learn. Teach one routine and use it every time: read the label, follow its line with a finger until it reaches the dot, then say in your own words what that part is and what it does. The finger-on-the-dot move is the one that matters, because the most common error is reading a label as though it floats beside the nearest part of the body. Ask, where does the line for claws end, and what does the shape of that part tell us about digging? If your child answers from the picture rather than from guessing, the routine is working.\n\n"
    "Teaching captions. A caption is the smallest piece of writing in a report, and the one children most often get wrong. Weak captions fall into three families. There are reactions, such as Cute! There are empty labels, such as Photo 2. And there are personal stories, such as Yesterday I saw one, which belong in a recount and not in a report. A strong caption is a full sentence that states a true fact about this particular picture, in the present tense, and tells the reader something the main text did not. Give your child a simple test: if someone read only the caption, would they learn something true? If the answer is no, rewrite it. The present tense matters because a report describes how echidnas are in general, not what happened to one echidna once.\n\n"
    "Teaching bar graphs. Always check four things in the same order: the title, the bottom axis, the scale, then the bars. The title says what the graph is about. The bottom axis names what was counted. The scale says how much each step is worth, and this is where most mistakes begin, because in this lesson the scale counts by twos and children are used to counting by ones. Before your child reads a single bar, ask what each gridline counts by. To read a bar, find the top, then slide a finger straight across to the scale. If the top lands halfway between 4 and 6, the bar shows 5. A ruler laid flat across the top of the bar helps children whose eyes drift.\n\n"
    "Teaching comparison. Graphs exist so we can compare, and the words in the question tell you which operation to use. How many more, how many fewer and what is the difference all mean subtract the smaller number from the larger. Altogether and in total mean add. Most and least only ask you to find the tallest or shortest bar. Have your child underline the question word before writing anything, and write the number sentence before the answer, for example 8 - 2 = 6 for kangaroo against wombat, and 8 + 6 + 4 + 2 = 20 for the total. One more trap to watch for: a question about which animal wants a name for its answer, while a question about how many wants a number. Children often give one when the other is asked, and underlining the question words fixes it.\n\n"
    "Putting words and visuals together. When your child reads a report page, teach three questions. Do the words and the visual agree? What does the visual tell me that the words do not? Is this the right kind of visual for the job? A diagram is for parts and their names, a graph is for amounts we want to compare, a photograph is for what something really looks like, and a map is for where something is. The best evidence of understanding is your child saying, unprompted, something like: the text only said spiny, but the diagram shows me the spines are on its back. Praise that sentence when you hear it.\n\n"
    "The spelling work. The silent letters in knee, knock, wrist, wrap, climb and gnat are left over from a time when people pronounced them. Tell your child that story, because a reason makes a spelling easier to remember than a rule does. Then use the silly-voice method: say k-nee, w-rist and clim-b with the silent letter pronounced, write exactly what you said, and then say the word normally. Ten minutes of this beats a long list copied out three times.\n\n"
    "Videos and reading. Use the videos as a second voice, not a replacement for you. Watch the diagrams and labels video before the diagram work, and the two bar graph videos before the graph work, pausing to ask your child to predict the next step. Read the Australian Museum echidna page together afterwards and see how many of its facts your child could have shown in a diagram, and how many would be better as a graph. Preview each video yourself first, because the graph videos use other examples and some American wording.\n\n"
    "What to watch for and how to fix it. If your child reads only the text, point to the diagram and ask what is in it that the sentence never said. If they read a bar wrongly, go back to the scale and ask what each step counts by. If they add when they should subtract, return to the question word. If a caption sounds like an opinion or a story, ask whether it states a fact about the picture, in the present tense. If a graph is missing its title or axis names, ask whether a stranger could tell what it shows. Keep the pace relaxed. The lesson runs about an hour, and it splits well into two sittings, with the diagram and captions in the first and the graph, comparison and spelling in the second."
)
LESSON["explicit_teaching"] = EXPLICIT_TEACHING

LESSON["planner_title"] = "Guided practice answers"
LESSON["planner_intro"] = "Type your answer to each part of the guided practice. Write at least a few words in every box."

LESSON["spelling"] = {
    "focus": "Silent letters: kn, wr, mb, gn",
    "teaching": "In some words one letter is silent. The k is silent in knee and knock, the w in wrist and wrap, the b in climb, and the g in gnat. Long ago people said these letters aloud, and the spelling stayed after the sound was lost. Say the word, then picture the silent letter as you write it.",
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
    assert all("visual" in s or "visual_before" in s for s in LESSON["teach_steps"][:7])
    assert all(v["svg"].startswith("<svg") and v["svg"].endswith("</svg>") for v in LESSON["worked_visuals"])
    assert len(LESSON["resources"]) == 5 and sum(r["type"] == "video" for r in LESSON["resources"]) == 3
    print("W9 L1 ok")
