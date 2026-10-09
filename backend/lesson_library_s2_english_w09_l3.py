"""Stage 2 English, Week 9 Lesson 3: Compound and Complex Sentences (Language).
UPGRADED in place from the W9 L1 template. Same seed key as before. Every picture is drawn as SVG by _chain_svg below.
The child learns what a clause is, the difference between a main clause and a dependent clause, how to join two main clauses into a compound sentence, how to join a main clause and a dependent clause into a complex sentence, and how to fix fragments. The example topic is Australian animals, continuing Weeks 7 to 9.
Spelling: silent letters kn, wr, mb, gn: knee, knock, wrist, wrap, climb, gnat.
Outcomes: EN2-VOCAB-01 and EN2-SPELL-01, checked against lesson_library_s2_english_placeholders.py (Week 9, Lesson 3). Wording is the official NESA text held in the placeholders file, with a short note on this lesson's focus. backend/nsw_outcomes.py holds a shorter plain language version of EN2-VOCAB-01 and EN2-SPELL-01, so the parent should check the wording against NESA.
Video status: no video attached. None was searched for or verified in this build.
Facts used: echidnas have sharp spines, strong claws for digging, a long snout and a sticky tongue for catching ants and termites (from W9 L1). Koalas eat gum leaves (from W9 L1). Koalas climb and kangaroos hop are general knowledge, so please check them. Sentences about hats, rain and bags are made up.
"""
import math

from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _visual, _video
from spelling_s2_w1 import _w, _c

WORDS = ["knee", "knock", "wrist", "wrap", "climb", "gnat"]

KINDS = {
    "main": ("#DCEBD3", "#5C8A4A", "can stand alone"),
    "join": ("#FBE3C4", "#C77B2B", "joiner"),
    "dep": ("#D6E6F2", "#4A6D8C", "cannot stand alone"),
}


def _chain_svg(title, parts):
    sizes = [int(len(t) * 8.4) + 26 for t, _ in parts]
    gap = 14
    total = sum(sizes) + gap * (len(parts) - 1)
    w = max(total + 40, 440)
    x = (w - total) / 2
    p = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.0f} 170" font-family="Arial, sans-serif">',
        f'<rect width="{w:.0f}" height="170" fill="#FFFDF6"/>',
        f'<text x="{w / 2:.0f}" y="30" text-anchor="middle" font-size="16" font-weight="bold" fill="#1F3B2D">{title}</text>',
    ]
    for (text, kind), size in zip(parts, sizes):
        fill, stroke, note = KINDS[kind]
        cx = x + size / 2
        p.append(f'<rect x="{x:.0f}" y="65" width="{size}" height="46" rx="8" fill="{fill}" stroke="{stroke}" stroke-width="2"/>')
        p.append(f'<text x="{cx:.0f}" y="94" text-anchor="middle" font-size="15" fill="#222">{text}</text>')
        p.append(f'<text x="{cx:.0f}" y="135" text-anchor="middle" font-size="13" font-weight="bold" fill="{stroke}">{note}</text>')
        x += size + gap
    p.append('</svg>')
    return "".join(p)


V_SIMPLE = _visual(
    _chain_svg("A simple sentence (one clause)", [("The echidna digs", "main")]),
    "A single green box containing the words The echidna digs, with the note can stand alone underneath.",
    "One clause with a subject (The echidna) and a verb (digs) can stand alone.",
)
V_FRAGMENT = _visual(
    _chain_svg("A fragment (a dependent clause on its own)", [("Because it has sharp spines", "dep")]),
    "A single blue box containing the words Because it has sharp spines, with the note cannot stand alone underneath. The title calls it a fragment.",
    "A dependent clause cannot stand alone. On its own it is a fragment.",
)
V_COMPOUND = _visual(
    _chain_svg("A compound sentence", [("Echidnas dig", "main"), (", and", "join"), ("koalas climb", "main")]),
    "Three boxes in a row. A green box says Echidnas dig, an orange box says comma and, and a second green box says koalas climb. Under the green boxes are the words can stand alone, and under the orange box is the word joiner.",
    "A compound sentence joins two main clauses with a comma and a joiner.",
)
V_COMPLEX = _visual(
    _chain_svg("A complex sentence", [("An echidna is safe", "main"), ("because", "join"), ("it has sharp spines", "dep")]),
    "Three boxes in a row. A green box says An echidna is safe, an orange box says because, and a blue box says it has sharp spines. Notes underneath say can stand alone, joiner and cannot stand alone.",
    "A complex sentence joins a main clause and a dependent clause.",
)
V_ORDER = _visual(
    _chain_svg("Dependent clause first, then a comma", [("Because it has sharp spines,", "dep"), ("an echidna is safe.", "main")]),
    "Two boxes in a row. A blue box says Because it has sharp spines, with a comma at the end, and a green box says an echidna is safe. Notes underneath say cannot stand alone and can stand alone.",
    "When the dependent clause comes first, a comma follows it.",
)

MODEL = (
    "MODEL SENTENCES: ECHIDNA FACTS\n\n"
    "Simple: An echidna digs.\n"
    "Compound: Echidnas dig, and koalas climb.\n"
    "Complex: An echidna is safe because it has sharp spines.\n"
    "Complex, dependent clause first: Because it has sharp spines, an echidna is safe.\n"
    "Fragment to fix: Because it has sharp spines."
)

LESSON = build(
    "s2-eng-w09-l3-compound-complex-sentences",
    "Compound and Complex Sentences",
    "Learn what a clause is, and how to join clauses into compound and complex sentences, and how to fix fragments.",
    "Language: compound and complex sentences",
    ["EN2-VOCAB-01", "EN2-SPELL-01"],
    {
        "EN2-VOCAB-01": "Builds knowledge and use of Tier 1, Tier 2 and Tier 3 vocabulary through interacting, wide reading and writing, and by defining and analysing words. This lesson focuses on the grammar words clause, conjunction, compound and complex, and on using them to build and fix sentences.",
        "EN2-SPELL-01": "Selects, applies and describes appropriate phonological, orthographic and morphological generalisations and strategies when spelling in a range of contexts. This week's focus is silent letters: kn, wr, mb and gn.",
    },
    "We are learning how to build compound and complex sentences with clauses and joining words, and to spell words with silent letters.",
    [
        "I can find the subject and the verb in a clause.",
        "I can tell a main clause from a dependent clause.",
        "I can join two main clauses into a compound sentence with a comma and a joiner.",
        "I can join a main clause and a dependent clause into a complex sentence.",
        "I can put a comma after a dependent clause that starts a sentence.",
        "I can fix a fragment.",
        "I can spell and use knee, knock, wrist, wrap, climb and gnat.",
    ],
    ["clause", "conjunction", "compound", "complex", "fragment", "comma", "subject", "verb"],
    ["This lesson (everything you need is inside it)", "Paper and a pencil", "Two coloured pencils (for the main task)"],
    "Child has met nouns, verbs and adjectives (Week 2 Lesson 3), conjunctions and complex sentences (Week 4 Lesson 3) and the timeless present tense (Week 8 Lesson 3), and has read and written about the echidna in Weeks 7 to 9.",
    (
        "Short sentences are easy to read, but a page of only short sentences sounds choppy. Good writers join their ideas so the reader can see how they fit together. This lesson shows you how. You will learn what a clause is, then how to join clauses into compound and complex sentences. You will also learn how to spot and fix a fragment. The examples are about echidnas and koalas."
    ),
    [
        _step(
            "🧱", "What a clause is",
            "Say just one word out loud, like digs. It feels unfinished, doesn't it? Now say: The echidna digs. That feels complete, because it tells you who or what the sentence is about and what that thing does. A group of words that does this job is called a clause. Every clause has a subject, which is the who or what, and a verb, which is the doing or being word.\n\n"
            "To find a clause, ask two questions in this order. First, who or what is this about? That is the subject. Then, what is it doing or being? That is the verb. In the picture, The echidna is the subject and digs is the verb. If you can answer both questions, you have found a clause.\n\n"
            "Clauses matter because every longer sentence is built from them, the way a wall is built from bricks. A common mistake is to call any group of words a clause, such as in the soil. Test it with the two questions. There is no subject and no verb, so it is only a phrase, and it needs a clause to hold it up.",
            "The echidna digs. Subject: The echidna. Verb: digs.\n\nKoalas eat gum leaves. Subject: Koalas. Verb: eat.",
            "A clause has a subject and a verb.",
            ("Which group of words is a clause?", ["Koalas climb", "in the tall tree", "very slowly"], 0, "Koalas climb has a subject (Koalas) and a verb (climb)."),
            visual=[V_SIMPLE],
        ),
        _step(
            "✋", "Stands alone or needs help",
            "Some clauses can stand on their own as a whole sentence. An echidna is safe makes complete sense by itself. This is called a main clause. Other clauses start with a word like because or although, and when you read them alone you are left hanging. Because it has sharp spines. Because it has sharp spines, what? That kind of clause is called a dependent clause, since it depends on a main clause to finish its meaning.\n\n"
            "Here is a quick test. Read the clause by itself and ask, does this make complete sense? If yes, it is a main clause. If you are left waiting for more, it is a dependent clause. In the picture, the blue box starts with because, and the note under it says it cannot stand alone.\n\n"
            "This matters because a dependent clause written alone and ended with a full stop is a fragment, which is a piece of a sentence pretending to be a whole one. It is one of the most common writing mistakes. The fix is to join the fragment to a main clause, for example: An echidna is safe because it has sharp spines.",
            "An echidna is safe. Does it make sense alone? Yes, so it is a main clause.\n\nBecause it has sharp spines. Does it make sense alone? No, we are waiting for more, so it is a dependent clause.",
            "A main clause stands alone. A dependent clause needs a main clause.",
            ("Which one is a dependent clause?", ["Koalas climb", "Although echidnas are small", "Echidnas dig"], 1, "Although echidnas are small leaves us waiting for the rest, so it cannot stand alone."),
            visual=[V_FRAGMENT],
        ),
        _step(
            "🔗", "Compound sentences",
            "Two main clauses can be joined into one longer sentence. Echidnas dig. Koalas climb. Each one makes sense alone. Join them with a joining word and you get: Echidnas dig, and koalas climb. A sentence made from two main clauses is called a compound sentence, and the joining word is called a conjunction.\n\n"
            "Seven joiners do this job: for, and, nor, but, or, yet and so. Each one does something different. And adds an idea, but shows a difference, or gives a choice, and so shows a result. Write a comma before the joiner, as the picture shows. Before you join, check that the words on both sides could stand alone as sentences.\n\n"
            "Compound sentences matter because they show how two equal ideas are linked. A common mistake is to join two clauses with only a comma, like Echidnas dig, koalas climb. The joiner is missing. The fix is easy: add a joiner after the comma, as in Echidnas dig, and koalas climb.",
            "Koalas eat gum leaves. Echidnas eat ants.\n\nJoin them with but: Koalas eat gum leaves, but echidnas eat ants.\n\nBoth sides can stand alone, so this is a compound sentence.",
            "Compound: two main clauses, a comma and a joiner.",
            ("Which joiner shows a difference?", ["and", "but", "so"], 1, "But shows that the two ideas are different."),
            visual=[V_COMPOUND],
        ),
        _step(
            "🧩", "Complex sentences",
            "A complex sentence has one main clause and one dependent clause. The dependent clause starts with a different kind of joining word, called a subordinating conjunction. Some are because, when, if, although, while, after, before and until. For example: An echidna is safe because it has sharp spines. The main clause is An echidna is safe, and the dependent clause is because it has sharp spines.\n\n"
            "The joiner sits at the start of the dependent clause, and it tells you how the two ideas connect. Because gives a reason. When, after and before give a time. If gives a condition. Although shows a surprise. To build a complex sentence, write your main clause first, choose the joiner that matches your meaning, then add the dependent clause.\n\n"
            "Complex sentences matter because they explain how ideas are linked, not just that they are. A common mistake is to choose a joiner that does not fit, such as An echidna is safe although it has sharp spines. It sounds odd, because the spines are the reason. Swap although for because and it makes sense.",
            "I wear a hat. The sun is strong. (made up)\n\nJoin with because: I wear a hat because the sun is strong.\n\nMain clause: I wear a hat. Dependent clause: because the sun is strong.",
            "Complex: a main clause plus a dependent clause that starts with a joiner such as because.",
            ("Which word starts a dependent clause?", ["echidna", "because", "spines"], 1, "Because is a joiner that starts a dependent clause."),
            visual=[V_COMPLEX],
        ),
        _step(
            "🔄", "Dependent clause first",
            "You can swap the order of a complex sentence. Instead of putting the main clause first, you can start with the dependent clause: Because it has sharp spines, an echidna is safe. The meaning stays the same, but it reads differently, and starting with a joiner makes your writing more interesting.\n\n"
            "When the dependent clause comes first, put a comma after it, right where the main clause begins, as the picture shows. When the main clause comes first, you usually do not need a comma. To check, find the joiner. If it starts the sentence, a comma is needed.\n\n"
            "Mistakes come from forgetting this comma: Because it has sharp spines an echidna is safe. Read it aloud and you will hear a small pause after spines, and that pause is where the comma goes. Fix it by writing the comma, then read it again.",
            "Main clause first: An echidna is safe because it has sharp spines. No comma.\n\nDependent clause first: Because it has sharp spines, an echidna is safe. Comma after spines.",
            "If the dependent clause comes first, put a comma after it.",
            ("Which sentence has the comma in the right place?", ["Because it has sharp spines, an echidna is safe.", "Because it has sharp spines an echidna, is safe.", "Because, it has sharp spines an echidna is safe."], 0, "The comma goes after the whole dependent clause."),
            visual=[V_ORDER],
        ),
        _step(
            "⚖️", "Choosing the right sentence",
            "Now you have three tools. A simple sentence has one clause. A compound sentence joins two main clauses. A complex sentence joins a main clause and a dependent clause. Good writers mix them, because a page of only short sentences sounds choppy, and a page of only long ones is tiring to read.\n\n"
            "To choose, ask how your ideas are linked. If both ideas are equally important, join them as a compound sentence with and, but, or or so. If one idea explains the other or depends on it, make a complex sentence with because, when, if or although. Look at the two pictures and notice what each joiner does.\n\n"
            "The mistake to avoid is making a sentence very long by chaining ideas with and, and, and. Echidnas dig and koalas climb and kangaroos hop and it goes on and on. Stop after two ideas and begin a new sentence. A good rule is one joiner in each sentence.",
            "Two equal ideas: Echidnas dig, and koalas climb. (compound)\n\nOne idea explains the other: An echidna is safe because it has sharp spines. (complex)",
            "Equal ideas make a compound sentence. A reason or a time makes a complex sentence.",
            ("Which sentence gives a reason?", ["Echidnas dig, and koalas climb.", "An echidna is safe because it has sharp spines.", "Koalas climb."], 1, "Because gives a reason, so this is a complex sentence."),
            visual=[V_COMPOUND, V_COMPLEX],
        ),
        _step(
            "🛠️", "Fixing fragments and run ons",
            "Before you hand in your writing, check for two big mistakes. The first is a fragment, a dependent clause standing alone, like Because it has sharp spines. The second is a run on sentence, where two main clauses are stuck together with no joiner, like Echidnas dig koalas climb.\n\n"
            "To fix a fragment, join it to a main clause, either after the clause or before it with a comma, as the pictures show. To fix a run on, add a comma and a joiner, or finish the first sentence with a full stop and start the next with a capital letter. Read each sentence aloud and listen for where it feels unfinished or where you run out of breath.\n\n"
            "Checking matters because readers only understand writing that is clear, and fixing mistakes is part of being a writer. A common slip is to fix a fragment by adding only a capital letter or a full stop. That cannot rescue a dependent clause. It needs a main clause to lean on.",
            "Fragment: Although echidnas are small.\nFixed: Although echidnas are small, they are tough.\n\nRun on: Echidnas dig koalas climb.\nFixed: Echidnas dig, and koalas climb.",
            "Fix a fragment by adding a main clause. Fix a run on with a comma and a joiner.",
            ("What fixes the fragment Because it has sharp spines?", ["Add a main clause", "Add a full stop", "Add a capital letter"], 0, "A dependent clause needs a main clause to finish its meaning."),
            visual=[V_FRAGMENT, V_ORDER],
        ),
        _step(
            "🔤", "Spelling focus: silent letters",
            "Some words have a letter that you write but do not say. These are called silent letters. Long ago people really did say them. Knee began with a k sound, and so did knock. The way we say the words changed slowly, but the spelling stayed, so the old letters are still there.\n\n"
            "This week we have four patterns. The k is silent in kn words: knee and knock. The w is silent in wr words: wrist and wrap. The b is silent after m in climb. The g is silent in gn words: gnat.\n\n"
            "A good way to remember is to say the word the silly way, with the silent letter sounded out, like k-nee, and write what you say. That silly voice helps your hand remember the silent letter. Then say the word the normal way.",
            "knee, knock, wrist, wrap, climb, gnat.\n\nSay: k-nee. Write: knee.\nSay: w-rist. Write: wrist.\nSay: clim-b. Write: climb.",
            "kn, wr, mb, gn: one letter is silent but you still write it.",
            ("Which word has a silent w?", ["wrap", "water", "will"], 0, "The w in wrap is silent."),
        ),
    ],
    (
        "I do. I will build sentences about echidnas and koalas out loud, using the pictures above.\n\n"
        "My first clause is The echidna digs. I ask who or what? The echidna, so that is the subject. I ask what is it doing? Digs, so that is the verb. It makes sense alone, so it is a main clause. My second clause is Koalas climb. That is also a main clause. I want to link them as equal ideas, so I choose and, and I put a comma before it: Echidnas dig, and koalas climb. That is a compound sentence.\n\n"
        "Now a reason. I know that an echidna is safe, and I know why: it has sharp spines. I join them with because: An echidna is safe because it has sharp spines. The part that starts with because cannot stand alone, so it is the dependent clause. If I want it to come first, I write the comma after spines: Because it has sharp spines, an echidna is safe.\n\n"
        "We do. Let us try one together. Koalas eat gum leaves. Echidnas eat ants. What joiner shows a difference? But. Where does the comma go? Before but. So we write: Koalas eat gum leaves, but echidnas eat ants. Is each side able to stand alone? Yes, so it is a compound sentence. Now fix this fragment together: Although echidnas are small. What does it need? A main clause. We add one: Although echidnas are small, they are tough.\n\n"
        "You do. Now it is your turn to build and fix sentences of your own.\n\n" + MODEL
    ),
    (
        "Here we practise together. Read each part, then type your answers in the boxes on the next stage. You can open the 'Put it all together' stage again at any time to look at the sentence pictures.\n\n"
        "Part A: type the subject and the verb in this clause: The koala climbs.\n\n"
        "Part B: join these two main clauses into one compound sentence with a comma and a joiner: Koalas climb. Echidnas dig.\n\n"
        "Part C: finish this complex sentence: An echidna is safe because ... Then fix this fragment by adding a main clause: Although echidnas are small.\n\n"
        "Part D: type the missing silent letters to make five words: _nock, _rap, _nat, clim_, _nee."
    ),
    (
        "Now build and fix sentences of your own. Type your answers in the big box, and number each one. You can look back at the sentence pictures in the 'Put it all together' stage.\n\n"
        "1. Clauses: type the subject and the verb in each sentence. The echidna digs. Koalas eat gum leaves. Kangaroos hop.\n\n"
        "2. Compound sentences: join each pair with a comma and a joiner, and type the new sentence. Koalas eat gum leaves. Echidnas eat ants. / An echidna has spines. It has a long snout.\n\n"
        "3. Complex sentences: join each pair with because and type the new sentence. I wear a hat. The sun is strong. (made up) / An echidna is safe. It has sharp spines.\n\n"
        "4. Fragments: turn each fragment into a full sentence by adding a main clause. Although echidnas are small. / When it is hot.\n\n"
        "5. Swap the order: take your complex sentence about the hat from question 3 and write it again with the dependent clause first. Remember the comma.\n\n"
        "6. Your own paragraph: on paper, write four sentences about an animal you know. Write one simple sentence, one compound sentence, one complex sentence, and one complex sentence that starts with the dependent clause. Use two coloured pencils to underline the main clauses in one colour and the dependent clauses in the other. Type your paragraph.\n\n"
        "7. Spelling: type your six spelling words, and write one sentence each for knee, wrist and climb."
    ),
    "Which kind of sentence was easiest for you to build, and which was hardest? What helps you check that you have joined the clauses correctly?",
    "Did I find the subject and verb, check that my compound sentences have a comma and a joiner, put a comma after a dependent clause that starts a sentence, fix every fragment, and spell knee, knock, wrist, wrap, climb and gnat correctly?",
    [
        _q("What is a clause?", ["A group of words with a subject and a verb", "A single letter", "A picture label", "A page number"], 0, "A clause has a subject and a verb."),
        _q("Which word is a conjunction?", ["echidna", "and", "spines", "quickly"], 1, "And joins two clauses, so it is a conjunction."),
        _q("Which sentence is compound?", ["Echidnas dig, and koalas climb.", "Because it rained.", "An echidna digs.", "Although it is small."], 0, "It joins two main clauses with a comma and and."),
        _q("Which sentence is complex?", ["Koalas climb, but echidnas dig.", "An echidna is safe because it has sharp spines.", "Koalas climb.", "Echidnas dig, and koalas climb."], 1, "It has a main clause and a dependent clause that starts with because."),
        _q("Which is a fragment?", ["An echidna is safe.", "Echidnas dig.", "Because it has sharp spines", "Koalas climb, and echidnas dig."], 2, "Because it has sharp spines cannot stand alone."),
        _q("When a dependent clause starts a sentence, what comes after it?", ["A full stop", "A comma", "A question mark", "Nothing"], 1, "A comma separates the dependent clause from the main clause."),
        _q("Which joiner shows a reason?", ["but", "or", "yet", "because"], 3, "Because gives a reason."),
        _q("Which joiner gives a choice?", ["because", "although", "or", "when"], 2, "Or gives a choice between two things."),
        _q("Which word has a silent g?", ["gum", "gnat", "goat", "grass"], 1, "The g in gnat is silent."),
        _q("Which word is spelled correctly?", ["rapp", "wrapp", "wrap", "wrapt"], 2, "Wrap has a silent w."),
    ],
    "Type your answers in the practice boxes and in the big box, then submit them.",
    "Extension: find a paragraph in a book or a website page. Find one compound sentence and one complex sentence. Copy each one, circle the joiner, and underline the main clause. Show a family member.",
    [("clause", "A group of words with a subject and a verb"), ("conjunction", "A joining word such as and, but or because"), ("compound", "Made of two main clauses joined together"), ("complex", "Made of a main clause and a dependent clause"), ("fragment", "A piece of a sentence that cannot stand alone"), ("comma", "A small mark that shows a short pause"), ("subject", "The who or what a clause is about"), ("verb", "The word that shows what someone or something does or is")],
    [],
    _sort("Compound or complex?", "Sort each sentence into compound or complex.", ["Compound sentence", "Complex sentence"], [("Echidnas dig, and koalas climb.", 0), ("An echidna is safe because it has sharp spines.", 1), ("Koalas eat gum leaves, but echidnas eat ants.", 0), ("I stayed inside because it was raining. (made up)", 1), ("I wore a hat, so I stayed cool. (made up)", 0), ("We will go outside if it stops raining. (made up)", 1), ("The tongue is sticky, and it catches ants.", 0), ("Although echidnas are small, they are tough.", 1)]),
    [
        _wc("Which is a group of words with a subject and a verb?", ["clause", "comma", "fragment"], 0, "A clause has a subject and a verb."),
        _wc("Which is a joining word such as and or because?", ["comma", "conjunction", "fragment"], 1, "A conjunction joins clauses."),
        _wc("Which is a piece of a sentence that cannot stand alone?", ["fragment", "conjunction", "comma"], 0, "A fragment is a piece of a sentence."),
        _wc("Which mark goes after a dependent clause that starts a sentence?", ["conjunction", "fragment", "comma"], 2, "A comma goes after the dependent clause."),
        _wc("Which is the correct spelling for the sound at a door?", ["nock", "knock", "knok"], 1, "Knock has a silent k."),
        _wc("Which is the correct spelling for covering a present?", ["rap", "wrapp", "wrap"], 2, "Wrap has a silent w."),
        _wc("Which is the correct spelling for a tiny flying insect?", ["gnat", "nat", "gnatt"], 0, "Gnat has a silent g."),
        _wc("Which is the correct spelling for going up a tree?", ["clim", "climb", "clime"], 1, "Climb has a silent b."),
    ],
    [
        {"key": "partA", "label": "Part A: subject and verb", "hint": "Type the subject and the verb from The koala climbs."},
        {"key": "partB", "label": "Part B: a compound sentence", "hint": "Join Koalas climb and Echidnas dig with a comma and a joiner."},
        {"key": "partC", "label": "Part C: complex and fragment", "hint": "Finish the sentence with because, then fix Although echidnas are small."},
        {"key": "partD", "label": "Part D: silent letters", "hint": "The five words from _nock, _rap, _nat, clim_, _nee."},
    ],
    ["Writing a dependent clause on its own as if it were a sentence", "Joining two main clauses with only a comma and no joiner", "Forgetting the comma after a dependent clause that starts a sentence", "Choosing a joiner that does not fit the meaning", "Chaining many ideas together with and", "Leaving out the silent letter: nock, rap, clim, nat"],
    ["Read a page of a book and find one compound sentence and one complex sentence.", "Practise your six spelling words by writing a sentence for each."],
    "Part A: subject The koala, verb climbs. Part B: Koalas climb, and echidnas dig. (accept but or so if the meaning is explained). Part C: accept a complete reason such as An echidna is safe because it has sharp spines; accept a fragment fixed with a main clause, such as Although echidnas are small, they are tough. Part D: knock, wrap, gnat, climb, knee. Main task 1: The echidna digs (subject The echidna, verb digs); Koalas eat gum leaves (Koalas, eat); Kangaroos hop (Kangaroos, hop). 2: Koalas eat gum leaves, but echidnas eat ants. An echidna has spines, and it has a long snout. 3: I wear a hat because the sun is strong. An echidna is safe because it has sharp spines. 4: accept any complete sentence that adds a main clause, such as Although echidnas are small, they are tough. When it is hot, I drink water. 5: Because the sun is strong, I wear a hat. 6: accept any four sentences that include a simple, a compound, a complex and a complex with the dependent clause first and a comma, with the clauses underlined in two colours. 7: accept six correctly spelled words and sentences. Quiz answers: a group of words with a subject and a verb; and; Echidnas dig, and koalas climb.; An echidna is safe because it has sharp spines.; Because it has sharp spines; a comma; because; or; gnat; wrap.",
    parent_check=(
        "Check that the child finds the subject and the verb in each clause, that each compound sentence has a comma and a joiner, and that each complex sentence uses a joiner that fits the meaning. Check that the comma follows the dependent clause when it comes first, and that every fragment now has a main clause. Check that the paragraph has one simple, one compound and one complex sentence plus one with the dependent clause first. Accept any sensible animal and sentences. The hat, rain and bag sentences are made up, and koalas climb and kangaroos hop should be checked as general knowledge."
    ),
    worked_visuals=[V_COMPOUND, V_COMPLEX],
)

EXPLICIT_TEACHING = (
    "The big idea. A sentence is built from clauses, and a clause is a group of words with a subject and a verb. Once your child can see clauses, joining them stops being a mystery and becomes a choice. This lesson teaches three sentence shapes: the simple sentence with one clause, the compound sentence that joins two equal main clauses, and the complex sentence that joins a main clause with a dependent clause. The skill matters because young writers tend to produce either a string of short sentences or one long sentence chained with and. Knowing the shapes lets them vary their writing on purpose.\n\n"
    "How to open the lesson. Write two short sentences on paper: Echidnas dig. Koalas climb. Read them aloud in a flat, choppy voice and ask your child what it sounds like. Most children say it sounds like a robot. Then read the joined version, Echidnas dig, and koalas climb, in a natural voice. The difference in rhythm is the reason this lesson exists. Name the skill: today you learn to join ideas so they flow, and to know exactly what kind of joining you have done.\n\n"
    "Teaching the clause. Give your child a two question routine and use it every time. Ask who or what is this about, which finds the subject, and ask what is it doing or being, which finds the verb. If both answers exist, it is a clause. Practise with plain examples first, such as The echidna digs, then show a non example such as in the soil. A phrase has no subject and verb together, so it cannot be a clause. Children who can say why in the soil is not a clause have understood the idea, even if they cannot yet name every word type.\n\n"
    "Teaching main and dependent clauses. The key test is whether the clause makes complete sense when read alone. An echidna is safe does. Because it has sharp spines does not, and the reader is left waiting. Tell your child that the first kind is a main clause and the second is a dependent clause because it depends on a main clause. This is the foundation for understanding fragments. A fragment is a dependent clause that has been written alone and ended with a full stop. It is one of the most common errors in Year 3 and 4 writing, and children fix it best when they hear it. Read the fragment aloud and ask what the reader is waiting for.\n\n"
    "Teaching compound sentences. A compound sentence joins two main clauses with a comma and one of seven joiners: for, and, nor, but, or, yet and so. Focus on and, but, or and so first, because children use them most. Teach the meaning of each. And adds, but contrasts, or offers a choice, and so gives a result. Insist on the check that both sides can stand alone, because that check separates a compound sentence from a main clause with a list or an extra phrase. The common error is a comma splice, where two clauses are joined by a comma and no joiner, as in Echidnas dig, koalas climb. The fix is to add the joiner after the comma.\n\n"
    "Teaching complex sentences. A complex sentence has one main clause and one dependent clause, and the dependent clause begins with a subordinating conjunction such as because, when, if, although, while, after, before or until. Teach the job of each joiner. Because gives a reason, when, after and before give a time, if gives a condition, and although shows a surprise. The most useful habit is to write the main clause first, then choose the joiner that matches the meaning. When the dependent clause starts the sentence, a comma follows it. When it comes second, no comma is usually needed. Let your child read both versions aloud, because the small pause after the dependent clause is something they can hear.\n\n"
    "Fixing fragments and run ons. These are the two mistakes your child should be able to spot in their own writing. To fix a fragment, join it to a main clause. To fix a run on, add a comma and a joiner, or split it into two sentences with a full stop and a capital letter. Avoid fixing a fragment only by adding a capital letter or a full stop, because that does not change what the clause is. Encourage your child to read each sentence aloud slowly, and to put a finger on each full stop and ask whether the words before it make complete sense. Praise the moment your child catches an error without help.\n\n"
    "The spelling work. The silent letters in knee, knock, wrist, wrap, climb and gnat are left over from a time when people pronounced them. Tell your child that story, because a reason is easier to remember than a rule. Then use the silly voice method: say k-nee, w-rist and clim-b with the silent letter sounded out, write exactly what you said, and then say the word normally. Ten minutes of this beats copying a list three times.\n\n"
    "What to watch for and how to fix it. If your child cannot find the subject, ask who or what the sentence is about. If they write fragments, ask what the reader is waiting for. If they join clauses with only a comma, ask which joiner is missing. If they forget the comma after a dependent clause that starts a sentence, read the sentence aloud and ask where the pause is. If they chain many ideas with and, tell them one joiner in each sentence. Keep the pace relaxed. The lesson runs about an hour and splits well into two sittings, with clauses and compound sentences in the first, and complex sentences, fixing and spelling in the second."
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
    print("W9 L3 ok", LESSON["seed_key"])
