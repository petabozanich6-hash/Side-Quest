"""Stage 2 English, Week 9 Lesson 2: Report with Visuals (Writing).
UPGRADED with real visuals. The koala diagram, the koala's-day bar graph, the faulty graph and the page layout are drawn as SVG by the helper functions below, so the child can see what the lesson talks about.
The child learns how to build a whole report page that works with its visuals: choosing the right visual for each fact, writing the text first in the timeless present tense, making a clear labelled diagram, making an accurate bar graph, writing captions that add a fact, linking the text to the visuals, and checking the page with a checklist. The model page is about the koala.
Teaching design: each step gives the rule, the reason, a worked example, a common mistake and a fix. The model walkthrough follows I do, We do, You do, and the main task has success criteria for the parent to check.
Spelling: silent letters: knot, know, write, wrong, thumb, sign.
Outcomes: EN2-CWT-02 and EN2-SPELL-01, checked against lesson_library_s2_english_placeholders.py (Week 9, Lesson 2). Outcome wording is the official NESA text, with a short note on this lesson's focus.
Video status: no video attached. None was checked for this lesson, so none is listed.
Facts used: koalas are marsupials that live in the eucalypt forests of eastern Australia, eat gum leaves, have thick fur, round ears, a large dark nose and sharp claws, and a joey stays in the pouch for about six months. The sleep figures (about 18 hours asleep and 6 awake) are approximate and should be checked against a reliable source by the parent.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _visual, _video
from spelling_s2_w1 import _w, _c

WORDS = ["knot", "know", "write", "wrong", "thumb", "sign"]


def _koala_svg():
    p = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 340" font-family="Arial, sans-serif">',
        '<rect width="560" height="340" fill="#FFFDF6"/>',
        '<text x="280" y="26" text-anchor="middle" font-size="16" font-weight="bold" fill="#1F3B2D">The parts of a koala</text>',
        '<ellipse cx="280" cy="235" rx="88" ry="78" fill="#9AA0A6" stroke="#4B4F54" stroke-width="2"/>',
        '<ellipse cx="205" cy="232" rx="18" ry="44" fill="#8A9096" stroke="#4B4F54" stroke-width="2"/>',
        '<ellipse cx="355" cy="232" rx="18" ry="44" fill="#8A9096" stroke="#4B4F54" stroke-width="2"/>',
    ]
    for x in (196, 205, 214):
        p.append(f'<line x1="{x}" y1="272" x2="{x - 3}" y2="292" stroke="#222" stroke-width="4" stroke-linecap="round"/>')
    for x in (346, 355, 364):
        p.append(f'<line x1="{x}" y1="272" x2="{x + 3}" y2="292" stroke="#222" stroke-width="4" stroke-linecap="round"/>')
    p += [
        '<circle cx="222" cy="82" r="30" fill="#9AA0A6" stroke="#4B4F54" stroke-width="2"/>',
        '<circle cx="338" cy="82" r="30" fill="#9AA0A6" stroke="#4B4F54" stroke-width="2"/>',
        '<circle cx="222" cy="82" r="17" fill="#E8C9CF"/>',
        '<circle cx="338" cy="82" r="17" fill="#E8C9CF"/>',
        '<circle cx="280" cy="125" r="62" fill="#9AA0A6" stroke="#4B4F54" stroke-width="2"/>',
        '<circle cx="258" cy="114" r="5" fill="#111"/>',
        '<circle cx="302" cy="114" r="5" fill="#111"/>',
        '<ellipse cx="280" cy="138" rx="16" ry="22" fill="#2B2B2B"/>',
    ]
    notes = [
        ("thick grey fur", 15, 262, 135, 258, 222, 258),
        ("sharp claws", 15, 314, 120, 310, 200, 289),
        ("round, fluffy ears", 395, 52, 392, 48, 345, 74),
        ("large, dark nose", 395, 160, 392, 156, 296, 140),
    ]
    for text, tx, ty, lx, ly, px, py in notes:
        p.append(f'<line x1="{lx}" y1="{ly}" x2="{px}" y2="{py}" stroke="#C77B5B" stroke-width="2"/>')
        p.append(f'<circle cx="{px}" cy="{py}" r="4" fill="#C77B5B"/>')
        p.append(f'<text x="{tx}" y="{ty + 5}" font-size="15" font-weight="bold" fill="#1F3B2D">{text}</text>')
    p.append('</svg>')
    return "".join(p)


def _bar_svg(items, title, ymin, ymax, step, xlabel="What the koala is doing", ylabel="Hours", values=False):
    w, h = 560, 340
    x0, x1, yb, yt = 80, 440, 260, 50
    unit = (yb - yt) / (ymax - ymin)
    slot = (x1 - x0) / len(items)
    bw = slot * 0.5
    colours = ["#6B8A5B", "#C77B5B"]
    p = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" font-family="Arial, sans-serif">',
        f'<rect width="{w}" height="{h}" fill="#FFFDF6"/>',
    ]
    if title:
        p.append(f'<text x="{(x0 + x1) / 2:.0f}" y="28" text-anchor="middle" font-size="15" font-weight="bold" fill="#1F3B2D">{title}</text>')
    v = ymin
    while v <= ymax:
        y = yb - (v - ymin) * unit
        p.append(f'<line x1="{x0}" y1="{y:.0f}" x2="{x1}" y2="{y:.0f}" stroke="#E4DCC4" stroke-width="1"/>')
        p.append(f'<text x="{x0 - 8}" y="{y + 5:.0f}" text-anchor="end" font-size="13" fill="#333">{v}</text>')
        v += step
    p.append(f'<line x1="{x0}" y1="{yt}" x2="{x0}" y2="{yb}" stroke="#333" stroke-width="2"/>')
    p.append(f'<line x1="{x0}" y1="{yb}" x2="{x1}" y2="{yb}" stroke="#333" stroke-width="2"/>')
    for i, (name, val, label) in enumerate(items):
        cx = x0 + slot * (i + 0.5)
        top = yb - (val - ymin) * unit
        p.append(f'<rect x="{cx - bw / 2:.0f}" y="{top:.0f}" width="{bw:.0f}" height="{yb - top:.0f}" fill="{colours[i % 2]}" stroke="#333" stroke-width="1"/>')
        p.append(f'<text x="{cx:.0f}" y="{yb + 22}" text-anchor="middle" font-size="14" fill="#222">{name}</text>')
        if values:
            p.append(f'<text x="{cx:.0f}" y="{top - 6:.0f}" text-anchor="middle" font-size="14" font-weight="bold" fill="#222">{label}</text>')
    p.append(f'<text x="{(x0 + x1) / 2:.0f}" y="305" text-anchor="middle" font-size="14" fill="#333">{xlabel}</text>')
    p.append(f'<text transform="rotate(-90 22 155)" x="22" y="155" text-anchor="middle" font-size="14" fill="#333">{ylabel}</text>')
    p.append('</svg>')
    return "".join(p)


def _layout_svg():
    p = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 340" font-family="Arial, sans-serif">',
        '<rect width="560" height="340" fill="#FFFDF6"/>',
        '<rect x="20" y="12" width="520" height="34" rx="4" fill="#1F3B2D"/>',
        '<text x="280" y="35" text-anchor="middle" font-size="17" font-weight="bold" fill="#FFF">Heading: Koalas</text>',
        '<rect x="20" y="58" width="240" height="268" rx="4" fill="#F4EEDC" stroke="#8B6B4A"/>',
        '<text x="32" y="80" font-size="14" font-weight="bold" fill="#1F3B2D">Text (present tense)</text>',
    ]
    for i in range(9):
        y = 98 + i * 20
        p.append(f'<line x1="32" y1="{y}" x2="{240 if i % 3 != 2 else 190}" y2="{y}" stroke="#B9AE8C" stroke-width="5" stroke-linecap="round"/>')
    p += [
        '<text x="32" y="300" font-size="13" font-weight="bold" fill="#C0392B">...as the diagram shows.</text>',
        '<line x1="200" y1="294" x2="288" y2="122" stroke="#C0392B" stroke-width="2"/>',
        '<circle cx="288" cy="122" r="4" fill="#C0392B"/>',
        '<rect x="290" y="58" width="250" height="110" rx="4" fill="#E9EFE3" stroke="#6B8A5B"/>',
        '<text x="415" y="118" text-anchor="middle" font-size="14" font-weight="bold" fill="#1F3B2D">Diagram with title and labels</text>',
        '<text x="415" y="186" text-anchor="middle" font-size="12" fill="#333">Caption: one fact, present tense</text>',
        '<rect x="290" y="198" width="250" height="92" rx="4" fill="#F6E7DF" stroke="#C77B5B"/>',
        '<text x="415" y="248" text-anchor="middle" font-size="14" font-weight="bold" fill="#1F3B2D">Bar graph with title and scale</text>',
        '<text x="415" y="312" text-anchor="middle" font-size="12" fill="#333">Caption: one fact, present tense</text>',
        '</svg>',
    ]
    return "".join(p)


GOOD_ITEMS = [("Asleep", 18, "18"), ("Awake", 6, "6")]
FAULTY_ITEMS = [("Asleep", 14, "18"), ("Awake", 11, "6")]
GRAPH_TITLE = "A koala's day, in hours (approximate)"

V_KOALA = _visual(
    _koala_svg(),
    "A drawing of a koala facing the front, with a title, The parts of a koala. It has grey fur, two round fluffy ears, a large dark nose and a claw on each paw. Four ruled label lines point to the fur, the claws, the ears and the nose.",
    "A diagram with a title, a clear drawing and four labels joined to the parts by lines.",
)
V_GRAPH = _visual(
    _bar_svg(GOOD_ITEMS, GRAPH_TITLE, 0, 24, 6, values=True),
    "A bar graph called A koala's day, in hours (approximate). The bottom axis says What the koala is doing, with two bars. The side axis says Hours and runs from 0 to 24 in steps of 6. The asleep bar reaches 18 and the awake bar reaches 6.",
    "A graph with a title, labelled axes, a scale that starts at 0 and bars that match their numbers.",
)
V_FAULTY = _visual(
    _bar_svg(FAULTY_ITEMS, "", 10, 26, 4, values=True),
    "A faulty bar graph with no title. The scale on the side starts at 10 and goes up in steps of 4. The asleep bar is labelled 18 but only reaches 14. The awake bar is labelled 6 but sits above the starting line.",
    "A faulty graph: no title, a scale that starts at 10, and bars that do not match the numbers above them.",
)
V_LAYOUT = _visual(
    _layout_svg(),
    "A plan of a report page. A heading runs across the top. The text is on the left with a red arrow pointing from the words as the diagram shows to the diagram box. On the right there is the diagram with its caption underneath, then the graph with its caption underneath.",
    "A report page layout: heading, text on the left, each visual on the right with its caption, and a link phrase pointing to the diagram.",
)

MODEL = (
    "MODEL REPORT PAGE: KOALAS\n\n"
    "Heading: Koalas\n\n"
    "Text: Koalas are grey, furry marsupials that live in the eucalypt forests of eastern Australia. A koala has thick fur, round ears and a large, dark nose, as the diagram shows. Two thumb-like fingers on each front paw and sharp claws help it grip branches while it climbs. Koalas feed on gum leaves, and they spend most of the day asleep, as the graph shows. A baby koala, called a joey, stays in its mother's pouch for about six months.\n\n"
    "DIAGRAM: title, The parts of a koala. Labels: thick grey fur; round, fluffy ears; large, dark nose; sharp claws.\n"
    "Caption: A koala's sharp claws and thumb-like fingers help it grip branches.\n\n"
    "GRAPH: title, " + GRAPH_TITLE + ". Side axis: hours, 0 to 24, in steps of 6. Bottom axis: what the koala is doing. Bars: asleep 18, awake 6.\n"
    "Caption: Koalas spend about three-quarters of the day asleep."
)

LESSON = build(
    "s2-eng-w09-l2-report-with-visuals",
    "Report with Visuals",
    "Learn how to plan, write and check a report page where the text, diagram, graph and captions work together.",
    "Writing: report with visuals",
    ["EN2-CWT-02", "EN2-SPELL-01"],
    {
        "EN2-CWT-02": "Plans, creates and revises written texts for informative purposes, using text features, sentence-level grammar, punctuation and word-level language for a target audience. This lesson focuses on planning and writing a report page with a labelled diagram, a graph and captions, and revising it with a checklist.",
        "EN2-SPELL-01": "Selects, applies and describes appropriate phonological, orthographic and morphological generalisations and strategies when spelling in a range of contexts. This week's focus is silent letters: kn, wr, mb and gn.",
    },
    "We are learning how to write a report page where the words, diagram, graph and captions work together, and to spell words with silent letters.",
    [
        "I can choose the best kind of visual for each fact.",
        "I can write a short report text in the timeless present tense.",
        "I can make a clear diagram with a title, ruled label lines and precise labels.",
        "I can make an accurate bar graph with a title, labelled axes and an equal scale that starts at 0.",
        "I can write a caption that adds a fact in the present tense.",
        "I can refer to a visual in my text and place it near the words it explains.",
        "I can check and improve my page using a checklist.",
        "I can spell and use knot, know, write, wrong, thumb and sign.",
    ],
    ["visual", "layout", "accurate", "axis", "scale", "label", "caption", "refer"],
    ["This lesson (everything you need is inside it)", "Paper, pencil and a ruler", "A reliable book or website about an animal you choose", "Coloured pencils (optional)"],
    "Child can read diagrams, captions and bar graphs (Week 9 Lesson 1), has written a description paragraph and used the timeless present tense (Week 8 Lessons 2 and 3), and knows how to find a reliable source (Week 7 Lesson 4).",
    (
        "A report page is more than a paragraph. A reader looks at the heading, the pictures and the captions before reading every word, so the page has to work as a whole. The text explains in sentences, the diagram shows the parts, the graph shows numbers and the captions tell the reader what to notice. Each part has its own job, and no part repeats another's job. Make the visuals so that a stranger could use them, and check every part before you finish."
    ),
    [
        _step(
            "🧩", "A report page is a team",
            "A report page uses several parts, and each part has a different job.\n\n"
            "The text explains in sentences. The diagram shows the parts of something. The graph shows numbers so they can be compared. The captions tell the reader what to notice. Look at the diagram: it shows the parts of a koala with a title and four labels.\n\n"
            "Why: if every part says the same thing in the same way, the page is boring and the reader learns nothing new. When each part adds something, the page teaches more.\n\n"
            "Common mistake: copying the whole text into the labels and captions.\nFix: let the text give the explanation, the labels give names, and the caption give one extra fact.",
            "Text: A koala has thick fur and round ears. Diagram: shows where the fur and ears are. Caption: adds a new fact, that the claws help it grip branches.",
            "Each part of the page has its own job.",
            ("What is the main job of a diagram on a report page?", ["To show the parts of something", "To explain every fact in sentences", "To give the author's name"], 0, "A diagram shows the parts of something."),
            visual=[V_KOALA],
        ),
        _step(
            "🔎", "Choose the right visual",
            "Look at each fact and ask: is it about parts, about numbers, or about an idea?\n\n"
            "Parts, such as ears, nose and claws, belong in a diagram. Numbers that can be compared, such as hours asleep and awake, belong in a graph. An idea that needs explaining, such as why koalas sleep so much, belongs in the text.\n\n"
            "Why: the right visual makes the fact easy to see. The wrong visual makes the reader work harder.\n\n"
            "Common mistake: making a graph from facts that are not numbers.\nFix: only graph things you can count or measure.",
            "Fact: A koala has round ears and a large nose. Visual: diagram. Fact: A koala is asleep about 18 hours and awake about 6. Visual: graph. Fact: A joey stays in the pouch about six months. Visual: text.",
            "Parts: diagram. Numbers: graph. Ideas: text.",
            ("Which fact is best shown in a graph?", ["The hours a koala is asleep and awake", "Koalas have sharp claws", "Koalas live in forests"], 0, "Numbers that can be compared belong in a graph."),
            visual=[V_KOALA, V_GRAPH],
        ),
        _step(
            "✍️", "Write the text first",
            "Write the text before you make the visuals, so that you know what you need to show.\n\n"
            "Start with a topic sentence that names the animal and gives the main idea. Add detail sentences with precise noun groups. Use the timeless present tense, and make each verb match its subject, such as a koala has and koalas feed.\n\n"
            "Why: the text is the backbone of the page. When the text is clear, the visuals have a job to do.\n\n"
            "Common mistake: slipping into the past tense, such as Koalas lived in forests.\nFix: read each verb and ask, is this always true? Then write it in the present tense.",
            "Koalas are grey, furry marsupials that live in the eucalypt forests of eastern Australia. A koala has thick fur, round ears and a large, dark nose.",
            "Text first, present tense, verbs that match.",
            ("Which sentence is correct for a report?", ["A koala has thick fur.", "A koala had thick fur.", "A koala will have thick fur."], 0, "Reports use the timeless present tense."),
        ),
        _step(
            "🏷️", "Make a clear diagram",
            "A good diagram has a title, a large clear drawing, and labels joined to the parts by ruled lines that do not cross. Look at the koala diagram: each label line ends on a dot on the part it names.\n\n"
            "Write each label as a noun group, such as round, fluffy ears. Place the labels around the drawing, not on top of it. Use a ruler for the lines so they are straight and easy to follow.\n\n"
            "Why: if a reader cannot tell which line goes to which part, the diagram does not work.\n\n"
            "Common mistake: labels that are sentences, such as This is the koala's nose.\nFix: use a precise noun group, such as large, dark nose.",
            "Title: The parts of a koala. Labels: thick grey fur; round, fluffy ears; large, dark nose; sharp claws.",
            "Title, clear drawing, ruled lines, noun group labels.",
            ("Which is the best label?", ["This is the koala's nose", "large, dark nose", "Look here"], 1, "A label is a precise noun group."),
            visual=[V_KOALA],
        ),
        _step(
            "📊", "Make an accurate bar graph",
            "A bar graph needs a title, a label on each axis, a scale, and bars of equal width. Look at the graph: the title says what it is about, the side axis says Hours, and the bottom axis says what the koala is doing.\n\n"
            "The scale must start at 0 and go up in equal steps, such as 0, 6, 12, 18, 24. Each bar must reach exactly the value it shows. Leave equal gaps between the bars.\n\n"
            "Why: if the scale does not start at 0 or the steps are uneven, the graph tells a false story.\n\n"
            "Common mistake: starting the scale at 10, or drawing a bar that does not match its number.\nFix: use a ruler, start at 0, and check each bar against its number.",
            "Title: A koala's day, in hours (approximate). Scale: 0, 6, 12, 18, 24. Bars: asleep 18, awake 6.",
            "Title, labelled axes, scale from 0 in equal steps, accurate bars.",
            ("Where should a graph scale start?", ["At the biggest number", "At 5", "At 0"], 2, "A scale starts at 0 and goes up in equal steps."),
            visual=[V_GRAPH],
        ),
        _step(
            "💬", "Write a strong caption",
            "A caption is one sentence in the present tense. It tells the reader what to notice, and it adds a fact. It does not simply repeat the label.\n\n"
            "Why: the caption is often the first thing a reader reads, so it must be clear and true.\n\n"
            "Common mistake: a caption that gives an opinion or just a name, such as Cute koala.\nFix: say something a reader can learn, such as A koala's sharp claws help it grip branches.",
            "Weak: Koala claws. Strong: A koala's sharp claws and thumb-like fingers help it grip branches.",
            "One present tense sentence that adds a fact.",
            ("Which is the best caption for the koala diagram?", ["Koala", "I like koalas", "A koala's sharp claws help it grip branches."], 2, "A strong caption is a true present tense sentence that adds a fact."),
            visual=[V_KOALA],
        ),
        _step(
            "🔗", "Link the text and the visuals",
            "Use a phrase in the text that points to the visual, such as as the diagram shows or as the graph shows. Place each visual near the sentences it explains. The page plan shows the text on the left, a red arrow from the link phrase to the diagram, and each caption under its visual.\n\n"
            "Why: this tells the reader when to look at the picture, and it makes the page one whole.\n\n"
            "Common mistake: putting the visuals on a different page or not mentioning them.\nFix: place them beside the text, and refer to them in a sentence.",
            "A koala has thick fur, round ears and a large, dark nose, as the diagram shows.",
            "Point to the visual, and place it nearby.",
            ("Which sentence links the text to a visual?", ["Koalas are great.", "A koala has round ears, as the diagram shows.", "I drew this picture."], 1, "As the diagram shows points the reader to the visual."),
            visual=[V_LAYOUT],
        ),
        _step(
            "✅", "Check like an editor",
            "Read your page six times, each time checking one thing: facts against your source, labels against the drawing, numbers against the bars, verb tense, caption sentences, and spelling.\n\n"
            "Why: you cannot check everything at once. One check at a time finds more mistakes.\n\n"
            "Common mistake: only checking spelling.\nFix: use the checklist for every part of the page.",
            "Checklist: 1 Facts match my source. 2 Labels point to the right parts. 3 Bars match the numbers. 4 Verbs are in the present tense. 5 Captions are full sentences. 6 Spelling is checked.",
            "One check at a time, six checks.",
            ("What should you check against your source?", ["The facts", "The colours", "The page number"], 0, "Check that the facts match a reliable source."),
        ),
        _step(
            "🛠️", "Fix a faulty page",
            "Look at the faulty parts, name each problem, then fix it.\n\n"
            "Faulty text: Koalas lived in forests. I think they are cute.\nProblems: past tense; an opinion; the text does not refer to the visual.\nFixed text: Koalas live in the eucalypt forests of eastern Australia, as the diagram shows.\n\n"
            "Faulty caption: Koala.\nProblem: only a name, with no fact.\nFixed caption: A koala's thick fur helps to keep it warm.\n\n"
            "Faulty graph (shown above): no title, the scale starts at 10, and the asleep bar reaches 14 when its number says 18.\nProblems: no title, a false scale, a bar that does not match its number.\nFix: add a title, start at 0, and redraw the bar to 18. The fixed graph is shown below it.",
            "Each fix is made by naming the problem first and then changing it.",
            "Name the problem, then fix it.",
            ("What is wrong with the caption: Koala?", ["It is too long", "It only names the animal and gives no fact", "It is in the future tense"], 1, "A caption should add a fact."),
            visual_before=[V_FAULTY],
            visual=[V_GRAPH],
        ),
        _step(
            "🔤", "Spelling focus: silent letters",
            "In some words one letter is silent. The k is silent in knot and know, the w in write and wrong, the b in thumb, and the g in sign.\n\n"
            "Say the word, then picture the silent letter as you write it. Try the silly voice: say k-not, w-rite and thum-b, write what you said, then say the word normally. Related words, such as sign and signal, help you remember the g.\n\n"
            "Why: the silent letter is left over from the word's history, so you must learn to see it even though you cannot hear it.",
            "knot, know, write, wrong, thumb, sign.",
            "kn, wr, mb, gn: a letter you see but do not say.",
            ("Which word has a silent w?", ["write", "wet", "went"], 0, "The w in write is silent."),
        ),
    ],
    (
        "I DO. Watch me plan and write a page. My topic is the koala. First I gather facts from a reliable book. Koalas are marsupials. They live in eucalypt forests. They have thick fur, round ears, a large dark nose and sharp claws. They eat gum leaves, and they sleep for most of the day. A joey stays in its mother's pouch for about six months. Now I sort the facts. The parts, which are the fur, ears, nose and claws, will go in a diagram. The sleep time is a number, so it will go in a graph. The pouch fact will stay in the text. Next I write the text first. Koalas are grey, furry marsupials that live in the eucalypt forests of eastern Australia. Every verb is in the present tense: are, live. Then I add a sentence that points to the diagram: A koala has thick fur, round ears and a large, dark nose, as the diagram shows. Now I make the diagram. I give it a title, I draw a clear koala, and I use a ruler to join each label to its part. My labels are noun groups: thick grey fur, round, fluffy ears, large, dark nose, sharp claws. For the graph I write a title, label the axes, and make a scale from 0 up in steps of 6. The bars are asleep 18 and awake 6. Last I write captions that each add a fact, and I check the page six ways. You can see my diagram, my graph and my page plan above.\n\n"
        "WE DO. Now think it through with me. If I wanted to show that a koala is asleep three-quarters of the day, which visual fits best? A graph, because it is a number comparison. What would the title be? A koala's day, in hours. Where does the scale start? At 0. What is a strong caption for the claws diagram? Say it with me: A koala's sharp claws and thumb-like fingers help it grip branches. Does it add a fact? Yes. Is it in the present tense? Yes.\n\n"
        "YOU DO. Now it is your turn. Choose your own animal and build a page. Here is my finished page to check against.\n\n" + MODEL
    ),
    (
        "Here we practise together. Read each part, then type your answers in the boxes on the next stage.\n\n"
        "Part A: type diagram, graph or text for each fact. (1) A koala has round, fluffy ears. (2) A koala is asleep about 18 hours and awake about 6 hours. (3) A joey stays in its mother's pouch for about six months. (4) A koala has sharp claws on each paw.\n\n"
        "Part B: rewrite each weak part. Caption: Cute koala. Label: This part is the koala's nose. Text: Koalas lived in forests.\n\n"
        "Part C: type two things that are wrong with a graph that has no title, a scale that starts at 10, and one bar that does not match its number.\n\n"
        "Part D: type the missing silent letters: _not, _now, _rite, _rong, thum_, si_n."
    ),
    (
        "Build your own report page. Type your answers in the big box and number each one. Draw the diagram and graph on paper with a ruler. Use the model page, the pictures above and the success criteria to help you. " + "\n\n" + MODEL + "\n\n"
        "SUCCESS CRITERIA: 1 The text is in the timeless present tense and the verbs match their subjects. 2 The diagram has a title, ruled label lines and precise noun group labels. 3 The graph has a title, labelled axes and a scale that starts at 0. 4 The bars match the numbers. 5 Each caption is a present tense sentence that adds a fact. 6 The text refers to at least one visual. 7 The facts are checked against a reliable source.\n\n"
        "1. Choose: type the animal you will write about and the title of your reliable source.\n\n"
        "2. Facts: type six facts. After each fact, type D (diagram), G (graph) or T (text only).\n\n"
        "3. Plan: type the heading for your page and your topic sentence. Sketch your layout on paper, showing where the text, diagram and graph go.\n\n"
        "4. Text: type a paragraph of four to six sentences in the timeless present tense. Include one phrase such as as the diagram shows.\n\n"
        "5. Diagram: draw a diagram with a ruler. Type its title, at least four labels, and a caption.\n\n"
        "6. Graph: make a bar graph with real data from your source or from a small survey of family or friends. Type the title, what each axis shows, the scale and the values, and a caption.\n\n"
        "7. Check: go through the six checks. Type two things you checked and one thing you fixed.\n\n"
        "8. Spell: type your six spelling words and one sentence for each of know, write and thumb."
    ),
    "Which part of building the page was hardest: the text, the diagram, the graph or the captions, and which check found a mistake for you?",
    "Did I choose the right visual for each fact, write in the present tense, give my diagram a title and ruled labels, start my graph scale at 0 with accurate bars, write captions that add a fact, refer to my visuals, check my page six ways, and spell knot, know, write, wrong, thumb and sign correctly?",
    [
        _q("Which visual best shows the parts of a koala?", ["A bar graph", "A diagram with labels", "A caption only", "An index"], 1, "A labelled diagram shows the parts of something."),
        _q("Which fact is best shown in a graph?", ["Koalas have sharp claws", "Koalas eat gum leaves", "The hours a koala spends asleep and awake", "Koalas live in forests"], 2, "Numbers that can be compared belong in a graph."),
        _q("Where should the scale of a bar graph start?", ["At the biggest number", "At any number", "At 5", "At 0"], 3, "A scale starts at 0 and goes up in equal steps."),
        _q("Which is the best label for a diagram?", ["sharp claws", "This part is used by the koala for climbing and gripping", "Look here", "A big picture"], 0, "A label is a short precise noun group."),
        _q("Which is the best caption?", ["Koala.", "I like koalas!", "A koala grips branches with the thumb-like fingers on its front paws.", "Picture 2"], 2, "A strong caption is a present tense sentence that adds a fact."),
        _q("Where should a diagram be placed?", ["On a different page at the back", "Near the text it explains", "Upside down", "Anywhere at all"], 1, "Place each visual near the words it explains."),
        _q("Which sentence links the text to a visual?", ["Koalas are good.", "I drew this.", "Page ten.", "As the diagram shows, a koala has thick grey fur."], 3, "As the diagram shows points the reader to the visual."),
        _q("What should you check when you edit the page?", ["Only the colours", "How long it took", "Facts, labels, numbers, tense and spelling", "Nothing"], 2, "Check every part of the page, one thing at a time."),
        _q("Which word is spelled correctly?", ["noe", "know", "kno", "knoe"], 1, "Know has a silent k."),
        _q("Which word has a silent b?", ["thumb", "thump", "number", "tumble"], 0, "The b in thumb is silent."),
    ],
    "Type your answers in the practice boxes and in the big box, then submit them.",
    "Extension: swap pages with a family member. Read their page and use the seven success criteria to give them two strengths and one thing to improve. Then fix one thing on your own page.",
    [("visual", "A picture, diagram or graph that shows information"), ("layout", "How the parts of a page are arranged"), ("accurate", "Correct and true, with no mistakes"), ("axis", "One of the two lines along the side and bottom of a graph"), ("scale", "The numbers along a graph's side, going up in equal steps"), ("label", "A word or short group of words that names a part"), ("caption", "A sentence near a picture that explains it"), ("refer", "To point the reader to something, such as the diagram")],
    [],
    _sort("Diagram, graph or text?", "Sort each fact into the visual that shows it best.", ["Diagram", "Graph", "Text only"], [("the parts of a koala's body", 0), ("hours a koala is asleep and awake", 1), ("where the ears and nose are", 0), ("how many votes each animal got", 1), ("why koalas sleep so much", 2), ("names of the body parts", 0), ("comparing two amounts", 1), ("what a joey is called", 2)]),
    [
        _wc("Which means correct and true?", ["accurate", "layout", "visual"], 0, "Accurate means correct and true."),
        _wc("Which is a sentence that explains a picture?", ["axis", "caption", "scale"], 1, "A caption explains a picture."),
        _wc("Which means to point the reader to something?", ["label", "scale", "refer"], 2, "To refer is to point the reader to something."),
        _wc("Which is how the parts of a page are arranged?", ["layout", "axis", "caption"], 0, "Layout is how the parts of a page are arranged."),
        _wc("Which word is spelled correctly?", ["nott", "knot", "not"], 1, "Knot has a silent k."),
        _wc("Which word is spelled correctly?", ["rong", "rrong", "wrong"], 2, "Wrong has a silent w."),
        _wc("Which word is spelled correctly?", ["thumb", "thum", "thumbe"], 0, "Thumb has a silent b."),
        _wc("Which word is spelled correctly?", ["sine", "sign", "signn"], 1, "Sign has a silent g."),
    ],
    [
        {"key": "partA", "label": "Part A: choose the visual", "hint": "diagram, graph or text for each of the four facts."},
        {"key": "partB", "label": "Part B: fix the weak parts", "hint": "Rewrite the caption, the label and the text."},
        {"key": "partC", "label": "Part C: graph problems", "hint": "Two things wrong with the graph."},
        {"key": "partD", "label": "Part D: silent letters", "hint": "knot, know, write, wrong, thumb, sign."},
    ],
    ["Copying the text into the labels and captions", "Making a graph from facts that are not numbers", "Starting the scale at a number other than 0 or using uneven steps", "Drawing a bar that does not match its number", "Writing a caption that is an opinion or only a name", "Writing nee, rite or thum instead of knee, write and thumb"],
    ["Read your finished page aloud and check each part against the success criteria.", "Practise your six spelling words by writing a sentence for each."],
    "Part A: (1) diagram; (2) graph; (3) text; (4) diagram. Part B: accept a caption that is a present tense fact, such as A koala's thick fur helps to keep it warm; a label such as large, dark nose; and text such as Koalas live in forests. Part C: accept any two of: no title; the scale does not start at 0; a bar does not match its number. Part D: knot, know, write, wrong, thumb, sign. Main task, numbered answers in the big box: 1 any sensible animal and a named source. 2 six facts with sensible D, G or T labels. 3 a heading and a topic sentence that names the animal. 4 four to six present tense sentences with a reference such as as the diagram shows. 5 a diagram with a title, four precise labels and a present tense caption. 6 a graph with a title, labelled axes, a scale from 0 in equal steps, bars that match the numbers, and a present tense caption. 7 two checks and one sensible fix. 8 six correctly spelled words and sentences. Quiz answers: a diagram with labels; the hours a koala spends asleep and awake; 0; sharp claws; a present tense sentence that adds a fact; near the text it explains; as the diagram shows; facts, labels, numbers, tense and spelling; know; thumb.",
    parent_check=(
        "Use the seven success criteria as a checklist. Check that the child sorted at least one fact for the diagram and one for the graph, that the diagram has a title, ruled label lines and noun group labels, that the graph has a title, labelled axes, a scale that starts at 0 and bars that match their numbers, and that the facts can be traced to the stated source. Check that every caption is a present tense sentence that adds a fact, and that the text refers to at least one visual. The koala sleep figures in the model (about 18 hours asleep and 6 awake) are approximate, so check a reliable source if you use them. Accept any sensible animal and data. If the child has no numerical data, use a small survey of family or friends."
    ),
    worked_visuals=[V_KOALA, V_GRAPH, V_LAYOUT],
)

EXPLICIT_TEACHING = (
    "The big idea. A report page is a team. The text explains in sentences, the diagram shows the parts of something, the graph shows numbers that can be compared, and the captions tell the reader what to notice. Last lesson your child learned to read these visuals. This lesson your child builds a whole page where every part has its own job and no part repeats another's.\n\n"
    "How to open the lesson. Ask your child to tell you three facts about an animal they know. Then ask which fact would be easiest to show in a picture of its parts, and which could be counted and compared. Sorting facts this way is the skill the whole lesson rests on, and your child will use it again in the main task.\n\n"
    "Choosing the visual. Parts go in a diagram, countable things go in a graph, and ideas go in the text. The common error is a graph made from facts that are not numbers, so ask, can we count or measure this? If the answer is no, the fact stays in the text.\n\n"
    "Writing the text first. The text is the backbone of the page. It uses the timeless present tense, with verbs that match their subjects, such as a koala has and koalas feed. Ask your child to read each verb and ask, is this always true? A sentence such as as the diagram shows links the words to the picture, and the visual should sit close to that sentence.\n\n"
    "Making the diagram and graph. A diagram needs a title, a clear drawing and labels joined by ruled lines that do not cross, written as noun groups such as large, dark nose. A graph needs a title, labelled axes, a scale that starts at 0 and goes up in equal steps, and bars that reach exactly their numbers. Have your child use a ruler and check each bar against its number, because a bar that does not match its number is the most common fault.\n\n"
    "Captions and checking. A good caption is one present tense sentence that adds a fact, such as A koala's sharp claws help it grip branches. A caption that only says Koala or Cute! teaches nothing. When your child checks the page, ask for one check at a time: facts against the source, labels against the drawing, bars against the numbers, tense, captions, then spelling. Checking only the spelling is the usual shortcut, so praise the child who finds a different kind of mistake.\n\n"
    "The spelling work. The silent letters in knot, know, write, wrong, thumb and sign are left over from older pronunciations. Use the silly-voice method: say k-not, w-rite and thum-b with the silent letter said aloud, write exactly what you said, then say the word normally. Related words such as sign and signal help a child remember the silent g.\n\n"
    "Pace and support. The lesson runs about an hour and splits well into two sittings: choosing, text and diagram in the first, then graph, captions, checking and spelling in the second. The diagram and graph are drawn on paper, and the typed answers go in the big box. If your child struggles to find data for a graph, run a quick survey of the family, such as favourite fruit, and graph the results."
)
LESSON["explicit_teaching"] = EXPLICIT_TEACHING

LESSON["planner_title"] = "Guided practice answers"
LESSON["planner_intro"] = "Type your answer to each part of the guided practice. Write at least a few words in every box."

LESSON["spelling"] = {
    "focus": "Silent letters: kn, wr, mb, gn",
    "teaching": "In some words one letter is silent. The k is silent in knot and know, the w in write and wrong, the b in thumb, and the g in sign. Say the word, then picture the silent letter as you write it. Related words, such as sign and signal, can help you remember the g.",
    "words": [
        _w("knot", "knot", "silent k at the start, a tied loop of rope"),
        _w("know", "know", "silent k at the start, to have learned something"),
        _w("write", "write", "silent w at the start, to put words on paper"),
        _w("wrong", "wrong", "silent w at the start, not right"),
        _w("thumb", "thumb", "silent b at the end, the short thick finger"),
        _w("sign", "sign", "silent g in the middle, a notice or a mark"),
    ],
    "check": [
        _c("Which word has a silent k?", ["knot", "kite", "kind"], 0, "The k in knot is silent."),
        _c("Which word has a silent g?", ["gum", "sign", "gate"], 1, "The g in sign is silent."),
    ],
}
LESSON["spelling_focus"] = "Silent letters: kn, wr, mb, gn"
LESSON["hoard_words"] = list(WORDS)

if __name__ == "__main__":
    assert len(LESSON["quiz"]) == 10 and len(LESSON["word_challenges"]) == 8
    assert all(v["svg"].startswith("<svg") and v["svg"].endswith("</svg>") for v in LESSON["worked_visuals"])
    assert len(LESSON["planner_fields"]) == 4
    print("W9 L2 ok", LESSON["seed_key"])
