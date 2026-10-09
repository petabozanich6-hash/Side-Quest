"""Stage 2 English, Week 9 Lesson 2: Report with Visuals (Writing).
The child learns how to build a whole report page that works with its visuals: choosing the right visual for each fact, writing the text first in the timeless present tense, making a clear labelled diagram, making an accurate bar graph, writing captions that add a fact, linking the text to the visuals, and checking the page with a quality checklist. The model page is about the koala.
Teaching design: each step gives the rule, the reason, a worked example, a common mistake and a fix. The model walkthrough follows I do, We do, You do, and the main task has success criteria for the parent to check.
Spelling: silent letters: knot, know, write, wrong, thumb, sign.
Outcomes: EN2-CWT-02 and EN2-SPELL-01, checked against lesson_library_s2_english_placeholders.py (Week 9, Lesson 2, Report with visuals, writing slot, information reports unit, spelling silent letters kn, wr, mb, gn). Outcome wording is the official NESA text, with a short note on this lesson's focus.
Video status: no video attached. None was checked for this lesson, so none is listed.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["knot", "know", "write", "wrong", "thumb", "sign"]

MODEL = (
    "MODEL REPORT PAGE: KOALAS\n\n"
    "Heading: Koalas\n\n"
    "Text: Koalas are grey, furry marsupials that live in the eucalypt forests of eastern Australia. A koala has thick fur, round ears and a large, dark nose, as the diagram shows. Two thumb-like fingers on each front paw and sharp claws help it grip branches while it climbs. Koalas feed on gum leaves, and they spend most of the day asleep. A baby koala, called a joey, stays in its mother's pouch for about six months.\n\n"
    "DIAGRAM: a drawing of a koala with a title, 'The parts of a koala', and four labels joined to the drawing by ruled lines: thick grey fur; round, fluffy ears; large, dark nose; sharp claws.\n"
    "Caption: A koala's sharp claws and thumb-like fingers help it grip branches.\n\n"
    "GRAPH: Title: A koala's day, in hours (approximate). Side axis: hours, 0 to 24, in steps of 6, starting at 0. Bottom axis: what the koala is doing. Bars: asleep 18, awake 6.\n"
    "Caption: Koalas spend about three-quarters of the day asleep, as the graph shows."
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
        "HOW TO USE THIS LESSON. Read each step, study its worked example, then answer the check question. In the model walkthrough you will see the teacher do it first (I do), then you and the teacher think it through together (We do), then you do it yourself (You do).\n\n"
        "Why this matters. A report page is more than a paragraph. A reader looks at the heading, the pictures and the captions before reading every word, so the page has to work as a whole. When the text, diagram, graph and captions all say the same true things in different ways, the reader understands faster and remembers more.\n\n"
        "The big idea. A report page is a team. The text explains in sentences. The diagram shows the parts. The graph shows numbers. The captions connect each visual to the topic. Each member of the team has one job, and no member repeats another's job.\n\n"
        "Step 1: choose the visual to fit the fact. Parts of something belong in a diagram. Numbers that can be compared belong in a graph. Ideas that need explaining belong in the text. A fact that is just one number or word, such as a koala's baby is called a joey, can stay in the text.\n\n"
        "Step 2: write the text first. The text has a topic sentence, detail sentences and, if you wish, a closing sentence. Use the timeless present tense. Make sure each verb matches its subject, such as a koala has and koalas feed.\n\n"
        "Step 3: make each visual so a stranger could use it. A diagram needs a title, a clear drawing, and labels joined to the parts by ruled lines that do not cross. A graph needs a title, labelled axes, a scale that goes up in equal steps starting at 0, and bars of the same width.\n\n"
        "Step 4: write a caption for each visual. A caption is a sentence in the present tense that tells the reader what to notice, and it adds a fact. It does not just repeat the label.\n\n"
        "Step 5: link the text and the visuals. Refer to the visual in the text with a phrase such as as the diagram shows. Put each visual near the sentence it explains.\n\n"
        "Step 6: check like an editor. Check the facts against your source, the labels against the drawing, the numbers against the bars, the tense of every verb, and the spelling. Fix one thing at a time.\n\n"
        "Spelling link. This week's spelling focus is silent letters. The k is silent in knot and know, the w is silent in write and wrong, the b is silent in thumb, and the g is silent in sign. The silent b in thumb is also a good clue for spelling words in the same family, such as thumbs. Say the word, then picture the silent letter as you write it."
    ),
    [
        _step("1", "A report page is a team", "A report page uses several parts that each have a different job.\n\nThe text explains in sentences. The diagram shows the parts of something. The graph shows numbers so that they can be compared. The captions tell the reader what to notice.\n\nWhy: if every part says the same thing in the same way, the page is boring and the reader learns nothing new. When each part adds something, the page teaches more.\n\nCommon mistake: copying the whole text into the labels and captions.\nFix: let the text give the explanation, the labels give names, and the caption give one extra fact.", "Text: A koala has thick fur and round ears. Diagram: shows where the fur and ears are. Caption: adds a new fact, that the claws help it grip branches.", "Each part of the page has its own job.", ("What is the main job of a diagram on a report page?", ["To show the parts of something", "To explain every fact in sentences", "To give the author's name"], 0, "A diagram shows the parts of something.")),
        _step("2", "Choose the right visual", "Look at each fact and ask: is it about parts, about numbers, or about an idea?\n\nParts, such as ears, nose and claws, belong in a diagram. Numbers that can be compared, such as hours asleep and awake, belong in a graph. An idea that needs explaining, such as why koalas sleep so much, belongs in the text.\n\nWhy: the right visual makes the fact easy to see. The wrong visual makes the reader work harder.\n\nCommon mistake: making a graph from facts that are not numbers.\nFix: only graph things you can count or measure.", "Fact: A koala has round ears and a large nose. Visual: diagram. Fact: A koala is asleep about 18 hours and awake about 6. Visual: graph. Fact: A joey stays in the pouch about six months. Visual: text.", "Parts: diagram. Numbers: graph. Ideas: text.", ("Which fact is best shown in a graph?", ["The hours a koala is asleep and awake", "Koalas have sharp claws", "Koalas live in forests"], 0, "Numbers that can be compared belong in a graph.")),
        _step("3", "Write the text first", "Write the text before you make the visuals, so that you know what you need to show.\n\nStart with a topic sentence that names the animal and gives the main idea. Add detail sentences with precise noun groups. Use the timeless present tense, and make each verb match its subject.\n\nWhy: the text is the backbone of the page. When the text is clear, the visuals have a job to do.\n\nCommon mistake: slipping into the past tense, such as Koalas lived in forests.\nFix: read each verb and ask, is this always true? Then write it in the present tense.", "Koalas are grey, furry marsupials that live in the eucalypt forests of eastern Australia. A koala has thick fur, round ears and a large, dark nose.", "Text first, present tense, verbs that match.", ("Which sentence is correct for a report?", ["A koala has thick fur.", "A koala had thick fur.", "A koala will have thick fur."], 0, "Reports use the timeless present tense.")),
        _step("4", "Make a clear diagram", "A good diagram has a title, a large clear drawing, and labels joined to the parts by ruled lines that do not cross.\n\nWrite each label as a noun group, such as round, fluffy ears. Place the labels around the drawing, not on top of it. Use a ruler for the lines so they are straight and easy to follow.\n\nWhy: if a reader cannot tell which line goes to which part, the diagram does not work.\n\nCommon mistake: labels that are sentences, such as This is the koala's nose.\nFix: use a precise noun group, such as large, dark nose.", "Title: The parts of a koala. Labels: thick grey fur; round, fluffy ears; large, dark nose; sharp claws.", "Title, clear drawing, ruled lines, noun group labels.", ("Which is the best label?", ["This is the koala's nose", "large, dark nose", "Look here"], 1, "A label is a precise noun group.")),
        _step("5", "Make an accurate bar graph", "A bar graph needs a title, a label on each axis, a scale, and bars of equal width.\n\nThe scale must start at 0 and go up in equal steps, such as 0, 6, 12, 18, 24. Each bar must reach exactly the value it shows. Leave equal gaps between the bars.\n\nWhy: if the scale does not start at 0 or the steps are uneven, the graph tells a false story.\n\nCommon mistake: starting the scale at 10, or drawing a bar that does not match its number.\nFix: use a ruler, start at 0, and check each bar against its number.", "Title: A koala's day, in hours (approximate). Scale: 0, 6, 12, 18, 24. Bars: asleep 18, awake 6.", "Title, labelled axes, scale from 0 in equal steps, accurate bars.", ("Where should a graph scale start?", ["At the biggest number", "At 5", "At 0"], 2, "A scale starts at 0 and goes up in equal steps.")),
        _step("6", "Write a strong caption", "A caption is one sentence in the present tense. It tells the reader what to notice, and it adds a fact. It does not simply repeat the label.\n\nWhy: the caption is often the first thing a reader reads, so it must be clear and true.\n\nCommon mistake: a caption that gives an opinion or just a name, such as Cute koala.\nFix: say something a reader can learn, such as A koala's sharp claws help it grip branches.", "Weak: Koala claws. Strong: A koala's sharp claws and thumb-like fingers help it grip branches.", "One present tense sentence that adds a fact.", ("Which is the best caption for the koala diagram?", ["Koala", "I like koalas", "A koala's sharp claws help it grip branches."], 2, "A strong caption is a true present tense sentence that adds a fact.")),
        _step("7", "Link the text and the visuals", "Use a phrase in the text that points to the visual, such as as the diagram shows or as the graph shows. Place each visual near the sentences it explains.\n\nWhy: this tells the reader when to look at the picture, and it makes the page one whole.\n\nCommon mistake: putting the visuals on a different page or not mentioning them.\nFix: place them beside the text, and refer to them in a sentence.", "A koala has thick fur, round ears and a large, dark nose, as the diagram shows.", "Point to the visual, and place it nearby.", ("Which sentence links the text to a visual?", ["Koalas are great.", "A koala has round ears, as the diagram shows.", "I drew this picture."], 1, "As the diagram shows points the reader to the visual.")),
        _step("8", "Check like an editor", "Read your page six times, each time checking one thing: facts against your source, labels against the drawing, numbers against the bars, verb tense, caption sentences, and spelling.\n\nWhy: you cannot check everything at once. One check at a time finds more mistakes.\n\nCommon mistake: only checking spelling.\nFix: use the checklist for every part of the page.", "Checklist: 1 Facts match my source. 2 Labels point to the right parts. 3 Bars match the numbers. 4 Verbs are in the present tense. 5 Captions are full sentences. 6 Spelling is checked.", "One check at a time, six checks.", ("What should you check against your source?", ["The facts", "The colours", "The page number"], 0, "Check that the facts match a reliable source.")),
        _step("9", "Fix a faulty page", "Look at the flawed page and name each problem, then fix it.\n\nFaulty text: Koalas lived in forests. I think they are cute.\nProblems: past tense; an opinion; the text does not refer to the visual.\nFixed text: Koalas live in the eucalypt forests of eastern Australia, as the diagram on this page shows.\n\nFaulty caption: Koala.\nProblem: only a name, with no fact.\nFixed caption: A koala's thick fur helps to keep it warm.\n\nFaulty graph: scale starts at 10, no title, bar for asleep reaches 14.\nProblems: false scale, no title, bar does not match the number 18.\nFix: start at 0, add a title, redraw the bar to 18.", "Each fix is made by naming the problem first and then changing it.", "Name the problem, then fix it.", ("What is wrong with the caption: Koala?", ["It is too long", "It only names the animal and gives no fact", "It is in the future tense"], 1, "A caption should add a fact.")),
        _step("10", "Spelling focus: silent letters", "In some words one letter is silent. The k is silent in knot and know, the w in write and wrong, the b in thumb, and the g in sign.\n\nSay the word, then picture the silent letter as you write it. Think of related words, such as sign and signal, that help you remember the g.\n\nWhy: the silent letter is a sign of the word's history, so you must learn to see it even though you cannot hear it.", "knot, know, write, wrong, thumb, sign.", "kn, wr, mb, gn: a letter you see but do not say.", ("Which word has a silent w?", ["write", "wet", "went"], 0, "The w in write is silent.")),
    ],
    (
        "I DO. Watch me plan and write a page. My topic is the koala. First I gather facts from a reliable book. Koalas are marsupials. They live in eucalypt forests. They have thick fur, round ears, a large dark nose and sharp claws. They eat gum leaves, and they sleep for most of the day. A joey stays in its mother's pouch for about six months. Now I sort the facts. The parts, which are the fur, ears, nose and claws, will go in a diagram. The sleep time is a number, so it will go in a graph. The pouch fact will stay in the text. Next I write the text first. Koalas are grey, furry marsupials that live in the eucalypt forests of eastern Australia. Every verb is in the present tense: are, live. Then I add a sentence that points to the diagram: A koala has thick fur, round ears and a large, dark nose, as the diagram shows. Now I make the diagram. I give it a title, I draw a clear koala, and I use a ruler to join each label to its part. My labels are noun groups: thick grey fur, round, fluffy ears, large, dark nose, sharp claws. For the graph I write a title, label the axes, and make a scale from 0 up in steps of 6. The bars are asleep 18 and awake 6. Last I write captions that each add a fact, and I check the page six ways.\n\n"
        "WE DO. Now think it through with me. If I wanted to show that a koala is asleep three-quarters of the day, which visual fits best? A graph, because it is a number comparison. What would the title be? A koala's day, in hours. Where does the scale start? At 0. What is a strong caption for the claws diagram? Say it with me: A koala's sharp claws and thumb-like fingers help it grip branches. Does it add a fact? Yes. Is it in the present tense? Yes.\n\n"
        "YOU DO. Now it is your turn. Choose your own animal and build a page. Here is my finished page to check against.\n\n" + MODEL
    ),
    (
        "Type your answers in the practice boxes. Part A: type diagram, graph or text for each fact. (1) A koala has round, fluffy ears. (2) A koala is asleep about 18 hours and awake about 6 hours. (3) A joey stays in its mother's pouch for about six months. (4) A koala has sharp claws on each paw. Part B: rewrite each weak part. Caption: Cute koala. Label: This part is the koala's nose. Text: Koalas lived in forests. Part C: type two things that are wrong with a graph that has no title, a scale that starts at 10, and one bar that does not match its number. Part D: type the missing silent letters: _not, _now, _rite, _rong, thum_, si_n. Your parent can check your answers against the answer key."
    ),
    (
        "Build your own report page. Typed answers go in the boxes, and the diagram and graph are drawn on paper. Use the model page and the checklist below to help you.\n\n" + MODEL + "\n\n"
        "SUCCESS CRITERIA (your parent will check these): 1 The text is in the timeless present tense and the verbs match their subjects. 2 The diagram has a title, ruled label lines and precise noun group labels. 3 The graph has a title, labelled axes and a scale that starts at 0. 4 The bars match the numbers. 5 Each caption is a present tense sentence that adds a fact. 6 The text refers to at least one visual. 7 The facts are checked against a reliable source.\n\n"
        "Stage 1 (choose): type the animal you will write about and the title of your reliable source.\n"
        "Stage 2 (facts): type six facts. After each fact, type D (diagram), G (graph) or T (text only).\n"
        "Stage 3 (plan): type the heading for your page and your topic sentence. Sketch your layout on paper, showing where the text, diagram and graph go.\n"
        "Stage 4 (text): type a paragraph of four to six sentences in the timeless present tense. Include one phrase such as as the diagram shows.\n"
        "Stage 5 (diagram): draw a diagram with a ruler. Type its title, at least four labels, and a caption.\n"
        "Stage 6 (graph): make a bar graph with real data from your source or from a small survey of family or friends. Type the title, what each axis shows, the scale and the values, and a caption.\n"
        "Stage 7 (check): go through the six checks. Type two things you checked and one thing you fixed.\n"
        "Stage 8 (spell): type your six spelling words and one sentence for each of know, write and thumb.\n\n"
        "Parent: use the seven success criteria as a checklist. Check that the child sorted at least one fact for the diagram and one for the graph, that the graph's bars match its numbers and the scale starts at 0, and that the facts are traceable to the stated source. The koala sleep figures in the model are approximate, so a source should be checked if used. Accept any sensible animal and data. If the child has no numerical data, use a small survey."
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
    "Type your answers in the practice boxes and submit them.",
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
        {"key": "stage1", "label": "My animal and source", "hint": "The animal and the source title."},
        {"key": "stage2", "label": "My six facts", "hint": "Each fact with D, G or T."},
        {"key": "stage3", "label": "My heading and topic sentence", "hint": "A heading and a topic sentence."},
        {"key": "stage4", "label": "My text", "hint": "Four to six present tense sentences with one reference to a visual."},
        {"key": "stage5", "label": "My diagram", "hint": "Title, four labels and a caption."},
        {"key": "stage6", "label": "My graph", "hint": "Title, axes, scale, values and a caption."},
        {"key": "stage7", "label": "My checks", "hint": "Two things checked and one thing fixed."},
        {"key": "spelling", "label": "Spelling words", "hint": "Type your six words and a sentence each for know, write and thumb."},
    ],
    ["Copying the text into the labels and captions", "Making a graph from facts that are not numbers", "Starting the scale at a number other than 0 or using uneven steps", "Drawing a bar that does not match its number", "Writing a caption that is an opinion or only a name", "Writing nee, rite or thum instead of knee, write and thumb"],
    ["Read your finished page aloud and check each part against the success criteria.", "Practise your six spelling words by writing a sentence for each."],
    "Part A: (1) diagram; (2) graph; (3) text; (4) diagram. Part B: accept a caption that is a present tense fact, such as A koala's thick fur helps to keep it warm; a label such as large, dark nose; and text such as Koalas live in forests. Part C: accept any two of: no title; the scale does not start at 0; a bar does not match its number. Part D: knot, know, write, wrong, thumb, sign. Main task: accept any sensible animal. Stage 2: accept six facts with sensible D, G or T labels. Stage 3: accept a heading and a topic sentence that names the animal. Stage 4: accept four to six present tense sentences with a reference such as as the diagram shows. Stage 5: accept a diagram with a title, four precise labels and a present tense caption. Stage 6: accept a graph with a title, labelled axes, a scale from 0 in equal steps, bars that match the numbers, and a present tense caption. Stage 7: accept two checks and one sensible fix. Stage 8: accept six correctly spelled words and sentences. Quiz answers: a diagram with labels; the hours a koala spends asleep and awake; 0; sharp claws; a present tense sentence that adds a fact; near the text it explains; as the diagram shows; facts, labels, numbers, tense and spelling; know; thumb.",
)

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
    print("ok", LESSON["seed_key"])
