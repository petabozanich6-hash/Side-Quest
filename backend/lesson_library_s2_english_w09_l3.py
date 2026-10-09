"""Stage 2 English, Week 9 Lesson 3: Compound and Complex Sentences (Language).
Built to match the W9 L1 benchmark. The sentence pictures are drawn as SVG by the helper functions below, so the child can see how clauses join.
The child revisits clauses and conjunctions (first met in Week 4 Lesson 3) and uses them in report writing: simple, compound and complex sentences, choosing the right joining word, placing the comma, and fixing fragments and run-ons. The practice sentences continue the Australian animals topic of Weeks 7 to 9.
Spelling: silent letters kn, wr, mb, gn: knife, knit, wreck, lamb, gnaw, design.
Outcomes: EN2-VOCAB-01 and EN2-SPELL-01, checked against lesson_library_s2_english_placeholders.py (Week 9, Lesson 3, Compound and complex sentences, language slot). The EN2-VOCAB-01 wording is the NESA text held in backend/nsw_outcomes.py, with a short note on this lesson's focus.
Video status: no video attached. None was checked for this lesson, so none is listed.
Facts used: wombats dig burrows and can run quickly over short distances, echidnas curl into a ball when in danger and have spines, koalas sleep a lot and eat gum leaves, which give them little energy. These facts are for practice sentences, so a parent should check any of them the child wants to reuse in a real report.
"""
from html import escape as _esc

from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _visual, _video
from spelling_s2_w1 import _w, _c

WORDS = ["knife", "knit", "wreck", "lamb", "gnaw", "design"]

MAIN_FILL, MAIN_LINE = "#E9EFE3", "#6B8A5B"
DEP_FILL, DEP_LINE = "#F6E7DF", "#C77B5B"
BAD_FILL, BAD_LINE = "#FBE3E1", "#C0392B"


def _rows_svg(title, rows):
    y = 46
    body = []
    for r in rows:
        kind = r[0]
        if kind == "clause":
            _, label, text, fill, line = r
            body.append(f'<rect x="40" y="{y}" width="480" height="60" rx="8" fill="{fill}" stroke="{line}" stroke-width="2"/>')
            body.append(f'<text x="54" y="{y + 20}" font-size="12" font-weight="bold" fill="{line}">{_esc(label)}</text>')
            body.append(f'<text x="54" y="{y + 46}" font-size="18" fill="#222">{_esc(text)}</text>')
            y += 68
        elif kind == "join":
            _, text, colour = r
            body.append(f'<rect x="150" y="{y}" width="260" height="32" rx="16" fill="{colour}"/>')
            body.append(f'<text x="280" y="{y + 22}" text-anchor="middle" font-size="15" font-weight="bold" fill="#FFFFFF">{_esc(text)}</text>')
            y += 40
        else:
            _, text, colour = r
            body.append(f'<text x="280" y="{y + 18}" text-anchor="middle" font-size="15" font-weight="bold" fill="{colour}">{_esc(text)}</text>')
            y += 34
    h = y + 10
    head = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 {h}" font-family="Arial, sans-serif">',
        f'<rect width="560" height="{h}" fill="#FFFDF6"/>',
        f'<text x="280" y="28" text-anchor="middle" font-size="16" font-weight="bold" fill="#1F3B2D">{_esc(title)}</text>',
    ]
    return "".join(head + body + ['</svg>'])


def _words_svg():
    p = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 340" font-family="Arial, sans-serif">',
        '<rect width="560" height="340" fill="#FFFDF6"/>',
        '<text x="280" y="26" text-anchor="middle" font-size="16" font-weight="bold" fill="#1F3B2D">Two kinds of joining word</text>',
        '<rect x="20" y="44" width="250" height="284" rx="8" fill="#E9EFE3" stroke="#6B8A5B" stroke-width="2"/>',
        '<text x="145" y="70" text-anchor="middle" font-size="14" font-weight="bold" fill="#1F3B2D">Joins two main clauses</text>',
        '<text x="145" y="88" text-anchor="middle" font-size="12" fill="#333">(use a comma before it)</text>',
        '<rect x="290" y="44" width="250" height="284" rx="8" fill="#F6E7DF" stroke="#C77B5B" stroke-width="2"/>',
        '<text x="415" y="70" text-anchor="middle" font-size="14" font-weight="bold" fill="#1F3B2D">Starts a dependent clause</text>',
        '<text x="415" y="88" text-anchor="middle" font-size="12" fill="#333">(the clause cannot stand alone)</text>',
    ]
    left = [("F", "for"), ("A", "and"), ("N", "nor"), ("B", "but"), ("O", "or"), ("Y", "yet"), ("S", "so")]
    for i, (letter, word) in enumerate(left):
        y = 120 + i * 29
        p.append(f'<text x="70" y="{y}" font-size="18" font-weight="bold" fill="#6B8A5B">{letter}</text>')
        p.append(f'<text x="110" y="{y}" font-size="18" fill="#222">{word}</text>')
    right = ["because", "when", "although", "while", "if", "after", "before", "until"]
    for i, word in enumerate(right):
        y = 118 + i * 25
        p.append(f'<text x="350" y="{y}" font-size="18" fill="#222">{word}</text>')
    p.append('</svg>')
    return "".join(p)


V_SIMPLE = _visual(
    _rows_svg("A simple sentence", [
        ("clause", "MAIN CLAUSE (one subject and one verb)", "Wombats dig burrows.", MAIN_FILL, MAIN_LINE),
        ("note", "One main clause. It makes sense on its own.", MAIN_LINE),
    ]),
    "A single green box labelled main clause containing the sentence Wombats dig burrows. A note says it is one main clause that makes sense on its own.",
    "A simple sentence has one main clause.",
)
V_COMPOUND = _visual(
    _rows_svg("A compound sentence: two main clauses", [
        ("clause", "MAIN CLAUSE 1", "Wombats dig burrows", MAIN_FILL, MAIN_LINE),
        ("join", ", and  (comma + joining word)", "#1F3B2D"),
        ("clause", "MAIN CLAUSE 2", "they rest inside during the day.", MAIN_FILL, MAIN_LINE),
        ("note", "Each clause could stand alone as a sentence.", MAIN_LINE),
    ]),
    "Two green boxes labelled main clause 1 and main clause 2, joined by a dark pill that says comma and joining word, and. The sentence reads Wombats dig burrows, and they rest inside during the day.",
    "A compound sentence joins two main clauses with a comma and a joining word.",
)
V_WORDS = _visual(
    _words_svg(),
    "Two columns. The left column lists the seven joining words for = F, and = A, nor = N, but = B, or = O, yet = Y and so = S, which join two main clauses and use a comma before them. The right column lists eight words that start a dependent clause: because, when, although, while, if, after, before and until.",
    "Two kinds of joining word, and the job each one does.",
)
V_COMPLEX = _visual(
    _rows_svg("A complex sentence: main clause + dependent clause", [
        ("clause", "MAIN CLAUSE (stands alone)", "Koalas sleep for most of the day", MAIN_FILL, MAIN_LINE),
        ("join", "because  (joining word, no comma)", "#1F3B2D"),
        ("clause", "DEPENDENT CLAUSE (cannot stand alone)", "gum leaves give them little energy.", DEP_FILL, DEP_LINE),
    ]),
    "A green main clause box reading Koalas sleep for most of the day, a dark pill that says because, then an orange dependent clause box reading gum leaves give them little energy. A note says there is no comma when the main clause comes first.",
    "A complex sentence has a main clause and a dependent clause. The dependent clause cannot stand alone.",
)
V_COMPLEX_FIRST = _visual(
    _rows_svg("Dependent clause first: add a comma", [
        ("clause", "DEPENDENT CLAUSE (starts with the joining word)", "Because gum leaves give them little energy", DEP_FILL, DEP_LINE),
        ("join", ",  the comma goes here", "#4A6D8C"),
        ("clause", "MAIN CLAUSE", "koalas sleep for most of the day.", MAIN_FILL, MAIN_LINE),
    ]),
    "An orange dependent clause box reading Because gum leaves give them little energy, a blue pill that says the comma goes here, then a green main clause box reading koalas sleep for most of the day.",
    "When the dependent clause comes first, a comma follows it.",
)
V_FAULTY = _visual(
    _rows_svg("Two common mistakes", [
        ("clause", "FRAGMENT", "Because gum leaves give them little energy.", BAD_FILL, BAD_LINE),
        ("note", "A dependent clause alone. There is no main clause.", BAD_LINE),
        ("clause", "RUN-ON", "Wombats dig burrows they rest inside.", BAD_FILL, BAD_LINE),
        ("note", "Two main clauses with no joining word.", BAD_LINE),
    ]),
    "Two red boxes. The first is a fragment, Because gum leaves give them little energy, with a note that it has no main clause. The second is a run-on, Wombats dig burrows they rest inside, with a note that two main clauses have no joining word.",
    "A fragment has no main clause. A run-on has two main clauses with no join.",
)

MODEL = (
    "MODEL PARAGRAPH: WOMBATS (practice facts)\n\n"
    "Wombats dig burrows, and they rest inside during the day. Although wombats look slow, they can run quickly over short distances. When a wombat feels danger, it dashes into its burrow.\n\n"
    "Sentence 1: compound. Two main clauses joined by , and.\n"
    "Sentence 2: complex. The dependent clause comes first, so there is a comma after it.\n"
    "Sentence 3: complex. The dependent clause comes first, so there is a comma after it."
)

LESSON = build(
    "s2-eng-w09-l3-compound-complex-sentences",
    "Compound and Complex Sentences",
    "Learn how to join ideas in a report using compound and complex sentences, place the comma correctly, and fix fragments and run-ons.",
    "Language: compound and complex sentences",
    ["EN2-VOCAB-01", "EN2-SPELL-01"],
    {
        "EN2-VOCAB-01": "Builds knowledge and use of Tier 1, Tier 2 and Tier 3 vocabulary through interacting, wide reading and writing. This lesson focuses on the joining words (conjunctions) that build compound and complex sentences, and on the grammar words clause, fragment and run-on.",
        "EN2-SPELL-01": "Selects, applies and describes appropriate phonological, orthographic and morphological generalisations and strategies when spelling in a range of contexts. This week's focus is silent letters: kn, wr, mb and gn.",
    },
    "We are learning how to join ideas with compound and complex sentences, and to spell words with silent letters.",
    [
        "I can say what a clause is and tell a main clause from a dependent clause.",
        "I can write a compound sentence using a comma and a joining word.",
        "I can write a complex sentence using a joining word such as because, when or although.",
        "I can choose a joining word that matches my meaning.",
        "I can put the comma in the right place.",
        "I can fix a fragment and a run-on.",
        "I can spell and use knife, knit, wreck, lamb, gnaw and design.",
    ],
    ["clause", "main clause", "dependent clause", "conjunction", "compound sentence", "complex sentence", "fragment", "run-on"],
    ["This lesson (everything you need is inside it)", "Paper and a pencil", "Two coloured pencils for marking clauses (optional)"],
    "Child has met conjunctions and compound and complex sentences in Week 4 Lesson 3, has written description paragraphs in the timeless present tense (Week 8), and has built a report page in Week 9 Lesson 2.",
    (
        "Short sentences are clear, but a whole report of short sentences sounds choppy. Good writers join ideas so that the reader can see how they connect. A compound sentence joins two equal ideas. A complex sentence joins a main idea to a smaller idea that explains it. In this lesson you will build both kinds, put the commas in the right places, and fix two common mistakes."
    ),
    [
        _step(
            "🧩", "What is a clause?",
            "A clause is a group of words with a subject and a verb. The subject is who or what the sentence is about, and the verb tells what it does or is.\n\n"
            "A main clause makes sense on its own, so it can be a whole sentence. Wombats dig burrows is a main clause. The subject is wombats and the verb is dig. A sentence with only one main clause is a simple sentence.\n\n"
            "Why it matters: if you can find the clauses, you can see how a sentence is built, and you can join or fix them.\n\n"
            "Common mistake: thinking a long sentence must have more than one clause.\nFix: count the verbs and their subjects. One subject and verb pair means one clause, however many describing words it has.",
            "Wombats dig burrows. (subject: wombats, verb: dig)\nThe large, grey echidna curls into a ball. (subject: the large, grey echidna, verb: curls) Still one clause.",
            "One subject and verb pair is one clause.",
            ("Which is a main clause?", ["Wombats dig burrows.", "Because it is hot.", "In the forest."], 0, "A main clause has a subject and a verb and makes sense on its own."),
            visual=[V_SIMPLE],
        ),
        _step(
            "🔗", "Compound sentences",
            "A compound sentence joins two main clauses. Each clause could stand alone as a sentence, and the two ideas are equally important.\n\n"
            "You join them with a comma and a joining word. Put the comma before the joining word, not after it. Look at the picture: the two green boxes are both main clauses, and the dark pill in the middle is the comma and the joining word.\n\n"
            "Why it matters: a compound sentence shows how two ideas fit together, so your writing sounds smoother than two short sentences side by side.\n\n"
            "Common mistake: leaving out the joining word, so there is only a comma.\nFix: a comma on its own is too weak. Add and, but or so after it.",
            "Wombats dig burrows. They rest inside during the day.\nJoined: Wombats dig burrows, and they rest inside during the day.",
            "Two main clauses, a comma, then a joining word.",
            ("Where does the comma go in a compound sentence?", ["After the joining word", "Before the joining word", "At the very start"], 1, "The comma goes before the joining word."),
            visual=[V_COMPOUND],
        ),
        _step(
            "🎯", "Choose the right joining word",
            "The joining words in the left column are easy to remember with the word FANBOYS: for, and, nor, but, or, yet, so. They join two main clauses. The three you will use most are and, but and so.\n\n"
            "And adds an idea. But shows a contrast. So shows a result. Or shows a choice. Pick the word that matches what your two clauses mean, not the first one you think of.\n\n"
            "Why it matters: the wrong joining word changes the meaning, or makes the sentence strange.\n\n"
            "Common mistake: using and for everything.\nFix: ask how the two ideas connect. Is the second one extra, the opposite, or the result?",
            "Echidnas have spines, but wombats have thick fur. (but: a contrast)\nEchidnas curl into a ball, so their spines face outwards. (so: a result)\nWombats dig burrows, and they rest inside. (and: an extra idea)",
            "And adds, but contrasts, so gives a result.",
            ("Which joining word shows a contrast?", ["and", "but", "so"], 1, "But shows that the two ideas are different."),
            visual=[V_WORDS],
        ),
        _step(
            "🌳", "Complex sentences",
            "A complex sentence has one main clause and one dependent clause. A dependent clause has a subject and a verb, but it cannot stand alone, because it begins with a joining word such as because, when, although, while, if, after, before or until.\n\n"
            "In the picture, the green box is the main clause and the orange box is the dependent clause. The dependent clause gives extra information, such as the reason, the time or the condition.\n\n"
            "Why it matters: a complex sentence lets you give a reason or a time in the same sentence, and it shows the main idea and the smaller idea clearly.\n\n"
            "Common mistake: thinking any sentence with a joining word is compound.\nFix: test each part. If one part cannot stand alone, the sentence is complex.",
            "Koalas sleep for most of the day because gum leaves give them little energy.\nTest: Koalas sleep for most of the day stands alone. Gum leaves give them little energy would stand alone too, but because makes it depend on the first part. So the sentence is complex.",
            "Main clause plus a dependent clause that starts with because, when, although and so on.",
            ("Which word starts a dependent clause?", ["but", "although", "and"], 1, "Although starts a dependent clause. But and and join two main clauses."),
            visual=[V_COMPLEX],
        ),
        _step(
            "📍", "Where does the comma go?",
            "In a complex sentence, the comma depends on which clause comes first. If the main clause comes first, you usually do not need a comma: Koalas sleep a lot because gum leaves give them little energy.\n\n"
            "If the dependent clause comes first, put a comma after it, where the main clause begins. Look at the picture: the blue pill shows the comma between the two clauses.\n\n"
            "Why it matters: the comma tells the reader where to pause, so the sentence is easy to read aloud.\n\n"
            "Common mistake: putting the comma after the joining word, such as Because, gum leaves give them little energy.\nFix: read the dependent clause to its end, then put the comma.",
            "Although wombats look slow, they can run quickly over short distances.\nWhen a wombat feels danger, it dashes into its burrow.",
            "Dependent clause first means a comma after it.",
            ("Which sentence is punctuated correctly?", ["When an echidna feels danger, it curls into a ball.", "When, an echidna feels danger it curls into a ball.", "When an echidna feels danger it, curls into a ball."], 0, "The comma goes at the end of the dependent clause."),
            visual=[V_COMPLEX_FIRST],
        ),
        _step(
            "📝", "Why join ideas in a report?",
            "A report with only short, simple sentences sounds choppy. Joining ideas makes the writing flow, and it shows the reader how the facts connect. Look back at the pictures: a compound sentence joins equal ideas, and a complex sentence adds a reason, a time or a surprise.\n\n"
            "Mix the kinds. A paragraph of all compound sentences sounds like a list, and one of all complex sentences is hard to read. Use a short simple sentence to make a point strongly.\n\n"
            "Why it matters: varied sentences keep the reader interested, and your report sounds more grown up.\n\n"
            "Common mistake: joining every sentence with and.\nFix: use and, but, so, because and when, and keep some sentences short.",
            "Choppy: Wombats dig burrows. They rest inside. They come out at night.\nSmoother: Wombats dig burrows, and they rest inside during the day. They come out at night.",
            "Mix short and joined sentences.",
            ("Why mix simple, compound and complex sentences?", ["To make the writing flow and stay interesting", "To make the report longer", "To use more commas"], 0, "Varied sentences flow better and keep the reader interested."),
            visual=[V_COMPOUND, V_COMPLEX],
        ),
        _step(
            "🛠️", "Fix fragments and run-ons",
            "A fragment is a group of words that looks like a sentence but is missing a main clause. Because gum leaves give them little energy is a fragment, because it starts with because and has no main clause to go with it. Fix it by joining it to a main clause: Koalas sleep a lot because gum leaves give them little energy.\n\n"
            "A run-on is two main clauses pushed together with no joining word. Wombats dig burrows they rest inside is a run-on. Fix it with a comma and a joining word: Wombats dig burrows, and they rest inside. You could also split it into two sentences.\n\n"
            "Why it matters: fragments and run-ons confuse the reader, because they cannot tell where one idea ends.\n\n"
            "Common mistake: only a comma between two main clauses (a comma splice).\nFix: add a joining word after the comma, or use a full stop.",
            "Fragment: When the sun sets. Fixed: When the sun sets, wombats come out to feed.\nRun-on: Echidnas have spines wombats have fur. Fixed: Echidnas have spines, but wombats have fur.",
            "A fragment needs a main clause. A run-on needs a join.",
            ("Which is a fragment?", ["Wombats dig burrows.", "Because gum leaves give them little energy.", "Koalas sleep, and they eat."], 1, "It starts with because and has no main clause."),
            visual=[V_FAULTY],
        ),
        _step(
            "🔍", "Compound or complex?",
            "Use a quick test. Cover the joining word. Then ask whether each part could stand alone as a sentence. If both parts could, the sentence is compound. If one part cannot, it is complex.\n\n"
            "Then look at the joining word. And, but, so and or join two main clauses. Because, when, although, while, if, after, before and until start a dependent clause. The picture of the two kinds of joining word is a good thing to look back at.\n\n"
            "Why it matters: when you can name the kind of sentence, you can decide where the comma goes and how to fix it.\n\n"
            "Common mistake: judging by the length of the parts, not by whether they can stand alone.\nFix: always test each part by itself.",
            "Echidnas curl into a ball, so their spines face outwards. Both parts stand alone: compound.\nWhen an echidna feels danger, it curls into a ball. The first part cannot stand alone: complex.",
            "Test each part by itself.",
            ("Both parts of the sentence could stand alone. What kind is it?", ["Compound", "Complex", "A fragment"], 0, "Two main clauses make a compound sentence."),
            visual=[V_WORDS],
        ),
        _step(
            "🔤", "Spelling focus: silent letters",
            "Some words have a letter that you write but do not say. The k is silent in knife and knit, the w in wreck, the b in lamb, and the g in gnaw and design.\n\n"
            "Say the word the way it sounds, then say it in a silly way with the silent letter pronounced, like k-nife or lam-b, and write what you say. The silly voice helps your hand remember the silent letter. Related words help too: design and signal both keep the g.\n\n"
            "Why it matters: a silent letter is still part of the spelling, so leaving it out makes the word wrong.",
            "knife, knit, wreck, lamb, gnaw, design.\n\nSay: k-nife. Write: knife.\nSay: w-reck. Write: wreck.\nSay: lam-b. Write: lamb.",
            "kn, wr, mb, gn: one letter is silent but you still write it.",
            ("Which word has a silent b?", ["lamb", "lamp", "land"], 0, "The b in lamb is silent."),
        ),
    ],
    (
        "I DO. Watch me build a paragraph with joined sentences. My topic is wombats. First I write the simple facts. Wombats dig burrows. Wombats rest inside during the day. Both are main clauses, so I can make them one compound sentence. I put a comma and a joining word between them: Wombats dig burrows, and they rest inside during the day. I used and because the second idea adds to the first.\n\n"
        "Next I want to say that wombats look slow but are not. The ideas contrast, so I choose although. Although starts a dependent clause, so it needs a main clause. I write the dependent clause first, so I put a comma after it: Although wombats look slow, they can run quickly over short distances.\n\n"
        "Last I write a sentence about danger. When a wombat feels danger, it dashes into its burrow. The dependent clause comes first, so there is a comma after it. I test the first part by itself: When a wombat feels danger cannot stand alone, so the sentence is complex. You can see my sentences in the pictures above.\n\n"
        "WE DO. Now think it through with me. Echidnas have spines. Wombats have thick fur. These are two main clauses with a contrast, so which joining word fits? But. Where does the comma go? Before but. Say the whole sentence with me: Echidnas have spines, but wombats have thick fur. Now try a complex one. Koalas sleep a lot. Gum leaves give them little energy. Which joining word shows the reason? Because. Is a comma needed when the main clause comes first? No.\n\n"
        "YOU DO. Now it is your turn. Write your own sentences about an animal you know. Here is my finished paragraph to check against.\n\n" + MODEL
    ),
    (
        "Here we practise together. Read each part, then type your answers in the boxes on the next stage. You can open the 'Put it all together' stage again to look at the pictures.\n\n"
        "Part A: type simple, compound or complex for each sentence. (1) Koalas climb trees. (2) Echidnas have spines, but wombats have thick fur. (3) When an echidna feels danger, it curls into a ball. (4) Wombats dig burrows, and they rest inside.\n\n"
        "Part B: join these two sentences into one compound sentence, using a comma and a joining word: Echidnas have spines. Wombats have thick fur. Then type which joining word you chose and why.\n\n"
        "Part C: fix both mistakes. Fragment: Because gum leaves give them little energy. Run-on: Wombats dig burrows they rest inside.\n\n"
        "Part D: type the missing silent letters to make six words: _nife, _nit, _reck, lam_, _naw, desi_n."
    ),
    (
        "Now write your own joined sentences. Type your answers in the big box, and number each one. You can look back at the pictures in the 'Put it all together' stage. Choose an Australian animal you know, such as a kangaroo, kookaburra, platypus or the wombat from the model. These are practice sentences, so ask a grown-up to check any fact you want to use in a real report.\n\n" + MODEL + "\n\n"
        "1. Clauses: type the two clauses in the sentence Wombats dig burrows, and they rest inside during the day. Say which joining word links them.\n\n"
        "2. Compound: type three compound sentences about your animal. Use a different joining word in each one (choose from and, but, so, or).\n\n"
        "3. Complex: type three complex sentences about your animal. Use because, when or although. Make at least one start with the dependent clause, and put the comma after it.\n\n"
        "4. Mark: choose two of your sentences. Type the joining word in each, and type the dependent clause from one of them.\n\n"
        "5. Fix: type a correct version of each of these. Fragment: When the sun sets. Run-on: Echidnas have spines wombats have fur.\n\n"
        "6. Paragraph: type a paragraph of four to six sentences about your animal. Include at least one compound sentence, one complex sentence and one short simple sentence.\n\n"
        "7. Spelling: type your six spelling words, and write one sentence each for knife, lamb and design."
    ),
    "Which was harder for you: choosing the joining word, putting the comma in the right place, or fixing a fragment, and what helps you check your sentence?",
    "Did I find the main clause and the dependent clause, join two main clauses with a comma and a joining word, use because, when or although for a complex sentence, put the comma after a dependent clause that comes first, fix a fragment and a run-on, and spell knife, knit, wreck, lamb, gnaw and design correctly?",
    [
        _q("Which sentence is compound?", ["Wombats dig burrows.", "Wombats dig burrows, and they rest inside.", "Wombats dig burrows because they need shelter.", "Because wombats need shelter."], 1, "It joins two main clauses with a comma and and."),
        _q("Which sentence is complex?", ["Koalas climb trees, and they eat leaves.", "Koalas climb.", "Koalas sleep a lot because gum leaves give little energy.", "Koalas and wombats."], 2, "It has a main clause and a dependent clause that starts with because."),
        _q("What does a compound sentence join?", ["Two main clauses", "A main clause and a dependent clause", "Two fragments", "Two titles"], 0, "A compound sentence joins two main clauses."),
        _q("Which word starts a dependent clause?", ["and", "but", "although", "so"], 2, "Although starts a dependent clause. The others join two main clauses."),
        _q("Where does the comma go in a compound sentence?", ["After the last word", "Before the joining word", "Nowhere", "After the first word"], 1, "The comma goes before the joining word."),
        _q("Which sentence is punctuated correctly?", ["When an echidna feels danger it curls up.", "When an echidna feels danger, it curls up.", "When, an echidna feels danger it curls up.", "When an echidna, feels danger it curls up."], 1, "The comma goes after the dependent clause."),
        _q("Which is a fragment?", ["Wombats dig burrows.", "Because gum leaves give little energy.", "Koalas sleep, and they eat.", "Echidnas have spines."], 1, "It has no main clause, so it cannot stand alone."),
        _q("Which joining word shows a contrast?", ["and", "so", "but", "because"], 2, "But shows that two ideas are different."),
        _q("Which word has a silent k?", ["knife", "kite", "kick", "kind"], 0, "The k in knife is silent."),
        _q("Which word is spelled correctly?", ["reck", "wrek", "wreck", "wrec"], 2, "Wreck has a silent w."),
    ],
    "Type your answers in the practice boxes and in the big box, then submit them.",
    "Extension: choose a paragraph from a book or website about an animal. Find one compound sentence and one complex sentence in it. Type or write them out, circle the joining word in each, and say how you know which kind each one is. Then rewrite one choppy pair of simple sentences as a single joined sentence.",
    [("clause", "A group of words with a subject and a verb"), ("main clause", "A clause that makes sense on its own"), ("dependent clause", "A clause that cannot stand alone"), ("conjunction", "A joining word, such as and, but or because"), ("compound sentence", "A sentence with two main clauses"), ("complex sentence", "A sentence with a main clause and a dependent clause"), ("fragment", "Words that look like a sentence but have no main clause"), ("run-on", "Two main clauses joined with no joining word")],
    [],
    _sort("Simple, compound or complex?", "Sort each sentence by how it is built.", ["Simple", "Compound", "Complex"], [("Koalas climb trees.", 0), ("Koalas climb trees, and they eat gum leaves.", 1), ("Koalas sleep a lot because gum leaves give little energy.", 2), ("Echidnas have spines, but wombats have thick fur.", 1), ("When an echidna feels danger, it curls into a ball.", 2), ("Kookaburras sit in tall gum trees.", 0), ("Wombats dig burrows, so they have shelter.", 1), ("Although wombats look slow, they can run fast.", 2)]),
    [
        _wc("Which is a group of words with a subject and a verb?", ["clause", "comma", "caption"], 0, "A clause has a subject and a verb."),
        _wc("Which is a joining word?", ["conjunction", "fragment", "scale"], 0, "A conjunction is a joining word."),
        _wc("Which cannot stand alone?", ["main clause", "dependent clause", "simple sentence"], 1, "A dependent clause cannot stand alone."),
        _wc("Which is unfinished because it has no main clause?", ["fragment", "compound sentence", "title"], 0, "A fragment has no main clause."),
        _wc("Which word is spelled correctly?", ["nife", "knife", "kniff"], 1, "Knife has a silent k."),
        _wc("Which word is spelled correctly?", ["reck", "wrek", "wreck"], 2, "Wreck has a silent w."),
        _wc("Which word is spelled correctly?", ["lam", "lamb", "lambe"], 1, "Lamb has a silent b."),
        _wc("Which word is spelled correctly?", ["naw", "gnor", "gnaw"], 2, "Gnaw has a silent g."),
    ],
    [
        {"key": "partA", "label": "Part A: name the sentence", "hint": "simple, compound or complex for each of the four sentences."},
        {"key": "partB", "label": "Part B: join the sentences", "hint": "One compound sentence with a comma, then the joining word you chose and why."},
        {"key": "partC", "label": "Part C: fix the mistakes", "hint": "A correct version of the fragment and of the run-on."},
        {"key": "partD", "label": "Part D: silent letters", "hint": "The six words from _nife, _nit, _reck, lam_, _naw, desi_n."},
    ],
    ["Putting only a comma between two main clauses", "Using and for every joining job", "Writing a dependent clause on its own as a sentence", "Leaving out the comma after a dependent clause that comes first", "Putting the comma after the joining word, not before it", "Leaving out the silent letter: nife, reck, lam, naw"],
    ["Read a page of a book and find one compound sentence and one complex sentence.", "Practise your six spelling words by writing a sentence for each."],
    "Part A: (1) simple; (2) compound; (3) complex; (4) compound. Part B: accept a sentence such as Echidnas have spines, but wombats have thick fur, with a comma before but, and a reason such as but shows a contrast. Part C: accept a fragment fixed by joining it to a main clause, such as Koalas sleep a lot because gum leaves give them little energy; and a run-on fixed with a comma and a joining word, such as Wombats dig burrows, and they rest inside, or split into two sentences. Part D: knife, knit, wreck, lamb, gnaw, design. Main task 1: Wombats dig burrows and they rest inside during the day; the joining word is and. 2: accept three compound sentences, each with two main clauses, a comma before the joining word and a different joining word. 3: accept three complex sentences with a joining word such as because, when or although, at least one with the dependent clause first and a comma after it. 4: accept the joining words identified and one correct dependent clause. 5: accept a fragment joined to a main clause, such as When the sun sets, wombats come out to feed, and a run-on fixed, such as Echidnas have spines, but wombats have fur. 6: accept a paragraph with at least one compound, one complex and one simple sentence. 7: accept six correctly spelled words and sentences. Quiz answers: Wombats dig burrows, and they rest inside; Koalas sleep a lot because gum leaves give little energy; two main clauses; although; before the joining word; When an echidna feels danger, it curls up; Because gum leaves give little energy; but; knife; wreck.",
    parent_check=(
        "Check that every compound sentence has two clauses that could each stand alone, a comma before the joining word, and a joining word that fits the meaning. Check that every complex sentence has a dependent clause that begins with a joining word such as because, when or although, and that a comma follows a dependent clause that comes first. Check that the fragment is joined to a main clause and the run-on has a comma and a joining word, or is split in two. Check that the paragraph includes a compound, a complex and a short simple sentence. The animal facts in the practice sentences are for practice, so check any fact your child wants to reuse in a real report. Accept any sensible animal and sentences."
    ),
    worked_visuals=[V_COMPOUND, V_COMPLEX, V_COMPLEX_FIRST],
)

EXPLICIT_TEACHING = (
    "The big idea. A report made only of short sentences sounds choppy and makes the reader do the work of connecting the facts. Compound and complex sentences do that work for the reader. A compound sentence joins two equal ideas. A complex sentence joins a main idea to a smaller idea that gives a reason, a time or a surprise. Your child met these in Week 4, and this lesson uses them in report writing and tidies up the punctuation.\n\n"
    "How to open the lesson. Read your child a short choppy paragraph, such as Wombats dig burrows. They rest inside. They come out at night. Then read the joined version, Wombats dig burrows, and they rest inside during the day. Ask which one sounds better and why. Once your child has heard the difference, the grammar words have a job to do.\n\n"
    "Clauses. A clause has a subject and a verb. A main clause makes sense on its own, and a dependent clause does not. Teach one test and use it every time: could this part be a whole sentence on its own? If yes, it is a main clause. If no, it depends on another clause. Children who can apply that test can sort almost any sentence.\n\n"
    "Compound sentences. Two main clauses, then a comma and a joining word. The seven joining words are for, and, nor, but, or, yet and so, which spell FANBOYS. Children overuse and, so ask what the second idea does. Does it add, contrast or give a result? That tells them to use and, but or so. The comma goes before the joining word, never after it.\n\n"
    "Complex sentences. A main clause and a dependent clause that begins with a joining word such as because, when, although, while, if, after, before or until. When the main clause comes first, no comma is usually needed. When the dependent clause comes first, a comma follows it. Have your child read the sentence aloud, and listen for the natural pause where the comma belongs.\n\n"
    "Fragments and run-ons. A fragment is a dependent clause standing alone, such as Because gum leaves give them little energy. A run-on pushes two main clauses together with no join. A comma alone between two main clauses (a comma splice) is a common version, so teach that a comma is too weak to join them. For every mistake, ask your child to name it first and then fix it.\n\n"
    "The spelling work. The silent letters in knife, knit, wreck, lamb, gnaw and design are left over from older pronunciations. Use the silly-voice method: say k-nife, w-reck and lam-b with the silent letter pronounced, write exactly what you said, then say the word normally. Related words help with design, because signal and sign also keep the g.\n\n"
    "Pace and support. The lesson runs about an hour and splits well into two sittings: clauses, compound and complex sentences in the first, and commas, mistakes, the main task and spelling in the second. The pictures are there to look back at, so encourage your child to open the 'Put it all together' stage whenever a rule slips. If your child finds complex sentences hard, spend longer on because and when, and leave although for later."
)
LESSON["explicit_teaching"] = EXPLICIT_TEACHING

LESSON["planner_title"] = "Guided practice answers"
LESSON["planner_intro"] = "Type your answer to each part of the guided practice. Write at least a few words in every box."

LESSON["spelling"] = {
    "focus": "Silent letters: kn, wr, mb, gn",
    "teaching": "In some words one letter is silent. The k is silent in knife and knit, the w in wreck, the b in lamb, and the g in gnaw and design. Long ago people said these letters aloud, and the spelling stayed after the sound was lost. Say the word, then picture the silent letter as you write it.",
    "words": [
        _w("knife", "knife", "silent k at the start, a tool for cutting"),
        _w("knit", "knit", "silent k at the start, to make cloth from wool with needles"),
        _w("wreck", "wreck", "silent w at the start, to break or ruin something"),
        _w("lamb", "lamb", "silent b at the end, a young sheep"),
        _w("gnaw", "gnaw", "silent g at the start, to chew again and again"),
        _w("design", "design", "silent g in the middle, to plan how something will look"),
    ],
    "check": [
        _c("Which word has a silent w?", ["wreck", "went", "wind"], 0, "The w in wreck is silent."),
        _c("Which word has a silent g?", ["gum", "gate", "gnaw"], 2, "The g in gnaw is silent."),
    ],
}
LESSON["spelling_focus"] = "Silent letters: kn, wr, mb, gn"
LESSON["hoard_words"] = list(WORDS)

if __name__ == "__main__":
    assert len(LESSON["quiz"]) == 10 and len(LESSON["word_challenges"]) == 8
    assert len(LESSON["planner_fields"]) == 4
    assert all("visual" in s or "visual_before" in s for s in LESSON["teach_steps"][:8])
    assert all(v["svg"].startswith("<svg") and v["svg"].endswith("</svg>") for v in LESSON["worked_visuals"])
    print("W9 L3 ok", LESSON["seed_key"])
