"""Stage 2 English, Week 4 Lesson 4: Handwriting Speed and Legibility (Oral language, handwriting).
Typed work is done in the lesson. The handwriting itself is done on paper and checked by a parent with the checklist.
Spelling (prefixes un-, re-, dis-, mis-) finishes the week with six new words not used in Lessons 1 to 3.
Video status: the prefix video was checked by transcript. The handwriting video was checked by description only, so open and play it once before use.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["unwrap", "rebuild", "disobey", "mislead", "unclear", "refresh"]

COPY_TEXT = (
    "The Rebuild Race\n\n"
    "Mia's first page was unclear, so she chose to rebuild it. She took a slow breath, sat tall and held her pencil lightly. "
    "Her letters joined in a smooth, steady flow. She did not want to mislead her reader with messy words, and she did not disobey the rule to leave gaps. "
    "When she finished, her teacher said the page was easy to read, and Mia felt refreshed."
)

LESSON = build(
    "s2-eng-w04-l4-handwriting-speed-legibility",
    "Handwriting Speed and Legibility",
    "Learn how to write faster without making your writing messy. Find the six things that make handwriting easy to read, test your speed with a timed copy, and finish the week by spelling six more prefix words.",
    "Oral language and handwriting: speed and legibility",
    ["EN2-HANDW-01", "EN2-SPELL-01", "EN2-VOCAB-01"],
    {
        "EN2-HANDW-01": "Primary. Writes legibly and fluently in a consistent, joined style, and increases speed while keeping letter shape, size, spacing and slope.",
        "EN2-SPELL-01": "Spells words with the prefixes un-, re-, dis- and mis-, keeping the base word unchanged (week 4 spelling focus).",
        "EN2-VOCAB-01": "Understands how a prefix changes the meaning of a base word, using the meanings of un-, re-, dis- and mis-.",
    },
    "We are learning to write quickly and clearly by checking posture, grip, letter shape, size, spacing and joins, and to spell words with the prefixes un-, re-, dis- and mis-.",
    [
        "I can sit and hold my pencil in a way that helps me write comfortably.",
        "I can name the six things that make handwriting legible: posture and grip, shape, size, spacing, slope and joins.",
        "I can copy a passage neatly and count how many words I wrote in two minutes.",
        "I can check my own handwriting against a checklist and choose one thing to improve.",
        "I can write faster by joining letters and keeping my pencil moving, without losing legibility.",
        "I can spell words with the prefixes un-, re-, dis- and mis-.",
    ],
    ["legible", "fluent", "slope", "spacing", "posture", "join", "prefix", "base word"],
    ["This lesson (everything you need is inside it)", "A pencil and lined paper for the handwriting tasks", "A timer or clock (a parent can time you)"],
    "Child can form all lowercase and capital letters and has started joining letters in the school handwriting style (Weeks 1 and 2).",
    (
        "Why this matters. Handwriting is a tool for getting your ideas onto the page. If it is too slow, you forget what you wanted to say. If it is too messy, nobody can read it, including you. The goal is writing that is both quick and clear. Legible means easy to read, and fluent means smooth and steady.\n\n"
        "Speed comes from flow, not from rushing. Fast writers do not scribble. They keep the pencil moving, join letters so they do not lift too often, and use small, even movements. If you rush by pressing hard or making letters sloppy, your writing becomes harder to read and your hand gets tired.\n\n"
        "The six things that make writing legible. First, posture and grip: sit tall with your feet flat, hold the pencil lightly between your thumb and first finger, resting on your middle finger, and angle the paper. Second, letter shape: make each letter the same way every time, so an a does not look like an o. Third, size: tall letters like l, t and d are taller than small letters like a, e and o, and letters with tails like g and y go below the line. Fourth, spacing: leave a small gap between words, about the width of the letter o, and keep letters inside a word close together. Fifth, slope: lean all your letters the same way, so the writing looks even. Sixth, joins: join letters with smooth, short strokes and lift your pencil only at the end of a word or where your school style says to.\n\n"
        "A routine for neat and quick writing. 1. Sit tall and set your paper. 2. Relax your grip. 3. Say the next few words in your head, then write them without stopping in the middle of a word. 4. Keep your letters resting on the line. 5. At the end, check for the six things.\n\n"
        "How to measure progress. Copy a passage for two minutes and count the words you wrote. Then check legibility with the checklist. A good result is more words than last time and still easy to read. Progress is measured against yourself, not against anyone else.\n\n"
        "A link to spelling. Prefixes are a great way to practise joined writing, because the prefix joins straight into the base word. Un-, re-, dis- and mis- are added to the start of a base word to change its meaning. Un- means not or the opposite, re- means again, mis- means badly or wrongly, and dis- means not or the removal of something. Write each word as one smooth, joined word."
    ),
    [
        _step("1", "Why legible and fluent both matter", "Writing has two jobs: it must be easy to read, and it must be quick enough to keep up with your thoughts.\n\nSpeed without clarity is no use, and clarity that takes forever is tiring.", "A shopping list that only you can read is not legible. A beautiful page that takes an hour is not fluent.", "Aim for writing that is clear and quick.", ("What does legible mean?", ["Written very fast", "Easy to read", "Written in capital letters"], 1, "Legible means easy to read.")),
        _step("2", "Posture and grip", "Sit tall with your feet flat on the floor and your back supported. Hold your pencil lightly between your thumb and first finger, resting on your middle finger. Turn your paper a little so you can see your writing.\n\nA tight grip makes your hand sore and slows you down.", "Wiggle your fingers, then hold your pencil as if it were a small bird: firm enough not to fall, soft enough not to squash.", "A relaxed hand writes faster for longer.", ("Which grip is best?", ["Squeezing the pencil tightly", "Holding the pencil in a fist", "A light grip with the pencil resting on the middle finger"], 2, "A light grip stops your hand getting tired.")),
        _step("3", "Letter shape and size", "Form each letter the same way every time. Tall letters (b, d, h, k, l, t) reach up, small letters (a, c, e, o, u) stay low and letters with tails (g, j, p, q, y) drop below the line.\n\nWhen the sizes are mixed up, words become hard to read.", "Compare a b with a short stem to a d with a tall stem. They could look like different letters. Keep your tall letters tall.", "Same shape, same size, every time.", ("Which letter has a tail that goes below the line?", ["t", "g", "o"], 1, "G drops below the line. T is a tall letter and o is a small letter.")),
        _step("4", "Spacing and slope", "Leave a gap about the width of the letter o between words. Keep letters in the same word close together. Lean all your letters the same way.\n\nEven spacing and slope make your page look neat.", "Compare 'Ilike apples' with 'I like apples'. The gap makes it clear where each word ends.", "Small gaps in words, bigger gaps between words, one slope.", ("What should you do between words?", ["Leave no gap", "Leave a huge gap", "Leave a small gap, about the width of the letter o"], 2, "A small gap about the size of an o keeps words clear.")),
        _step("5", "Joins and flow", "Joining letters helps you write faster because you lift your pencil less. Use short, smooth join strokes, and keep the pencil moving through the word.\n\nOnly lift at the end of a word or where your school style says to.", "Write 'rebuild' in one smooth movement, with the re joining into build, and lift only at the end.", "Join smoothly and lift less.", ("Why do joins help you write faster?", ["You lift the pencil less", "You press harder", "You make bigger letters"], 0, "Fewer lifts means a smoother, quicker flow.")),
        _step("6", "Measure and improve", "Copy a passage for two minutes and count the words written. Then check legibility. Next time, try for a few more words while keeping the checklist ticks.\n\nChoose just one thing to improve each time, such as spacing or slope.", "Last time: 22 words with uneven spacing. This time: 25 words with better spacing. That is real progress.", "Improve one thing at a time.", ("How should you decide what to improve?", ["Change everything at once", "Write much bigger", "Pick one thing from the checklist"], 2, "One focus at a time is easier and works better.")),
        _step("7", "Spelling focus: prefixes", "Add the prefix to the whole base word with no letters lost. Un-: unwrap, unclear. Re-: rebuild, refresh. Dis-: disobey. Mis-: mislead.\n\nPractise writing each as one joined word.", "un + wrap = unwrap, re + build = rebuild, dis + obey = disobey, mis + lead = mislead.", "Keep the base word whole.", ("Which is spelled correctly?", ["disobay", "disobey", "dissobey"], 1, "dis + obey keeps the whole base word.")),
    ],
    (
        "Look at the model passage, 'The Rebuild Race'. The writing task is to copy it on paper, so first read it to understand it, then plan how to write it. "
        "Posture: sit tall, feet flat, paper tilted. Grip: light and relaxed. Start with the first sentence: 'Mia's first page was unclear, so she chose to rebuild it.' Say the words 'Mia's first page' in your head, then write them without stopping in the middle of a word. Notice that 'unclear' and 'rebuild' both have prefixes joined to a base word. "
        "Now check the work. Is every tall letter taller than the small letters? Is the gap between words about the size of an o? Do all letters lean the same way? Did the joins flow without extra lifts? "
        "Try one together: write 'rebuild' three times in a row. The first time, write slowly and perfectly. The second time, write at a normal speed. The third time, write a little faster but keep the shape. Compare them. The best one is the one that is both quick and clear, which is usually the second or the third. Pick one thing to improve on the next line."
    ),
    (
        "Type your answers in the practice boxes. Part A: type the six things that make handwriting legible. Part B: decide which feature each problem describes. 'The letters are all different sizes.' 'There are no gaps between words.' 'Some letters lean left and some lean right.' Part C: type the correct word: un + wrap, re + build, dis + obey, mis + lead, un + clear, re + fresh. Your parent can check your answers against the answer key."
    ),
    (
        "Read the passage, then do the tasks. Typed answers go in the boxes. The handwriting is done on paper.\n\n" + COPY_TEXT + "\n\n"
        "Stage 1 (warm up): on paper, write the letters l, t, d, g, y, then the words 'unwrap', 'rebuild' and 'disobey', slowly and neatly. Check your posture and grip. Type one thing you noticed.\n"
        "Stage 2 (timed copy): your parent times two minutes. Copy the passage on paper, starting at the beginning, as neatly as you can. Stop when time is up. Count the words you wrote and type the number.\n"
        "Stage 3 (checklist): check your page against the checklist: posture and grip, shape, size, spacing, slope, joins. Type a tick or a cross for each one with a short note.\n"
        "Stage 4 (improve): choose your weakest thing. Practise it with one line of writing on paper. Type what you changed.\n"
        "Stage 5 (second copy): copy the same passage again for two minutes. Count your words and type the number. Did you write more? Is it still legible? Type your answer.\n"
        "Stage 6 (spell): type your six spelling words and the prefix in each. Then write each one on paper, joined.\n\n"
        "Parent: look at the page and check it matches what the child typed. Look for even spacing, a consistent slope and smooth joins. Praise progress, not perfection."
    ),
    "Which of the six checklist things is your strongest, and which one will you practise next?",
    "Did I sit well, hold my pencil lightly, keep my letters the same shape, size and slope, leave gaps between words, join smoothly, and spell my six prefix words correctly?",
    [
        _q("What does legible mean?", ["Written quickly", "Easy to read", "Written in capitals", "Written in pen"], 1, "Legible means easy to read."),
        _q("Which is NOT one of the six things that make writing legible?", ["Spacing", "Slope", "Using a coloured pencil", "Joins"], 2, "Pencil colour does not affect legibility."),
        _q("What is a good grip?", ["Light, with the pencil resting on the middle finger", "As tight as possible", "A fist", "Holding the pencil at the very tip"], 0, "A light grip lets you write comfortably."),
        _q("How big should the gap between words be?", ["No gap", "About the width of the letter o", "A whole line", "As big as a hand"], 1, "A small gap keeps words separate."),
        _q("Which letter has a tail below the line?", ["b", "d", "k", "p"], 3, "P drops below the line."),
        _q("Why do joins help speed?", ["You lift your pencil less", "You make letters bigger", "You press harder", "You skip letters"], 0, "Fewer lifts means smoother flow."),
        _q("Which is the best way to improve?", ["Change everything at once", "Write as fast as possible", "Stop checking", "Pick one thing to focus on"], 3, "One focus at a time works best."),
        _q("What does the prefix re- mean?", ["not", "badly", "again", "remove"], 2, "Re- means again."),
        _q("Which is spelled correctly?", ["unclere", "unclear", "onclear", "uncleer"], 1, "un + clear."),
        _q("Which is spelled correctly?", ["misslead", "mislede", "mislead", "mysled"], 2, "mis + lead."),
    ],
    "Type your answers in the practice boxes and submit them. Keep your handwriting page safe so a parent can look at it.",
    "Extension: write a six-line poem about writing neatly on paper. Time yourself and count the words per minute. Try to beat your best score while staying legible.",
    [("legible", "Easy to read"), ("fluent", "Smooth and steady"), ("slope", "The lean of your letters"), ("spacing", "The gaps between letters and words"), ("posture", "How you sit when you write"), ("join", "A stroke that connects two letters"), ("prefix", "Letters added to the start of a word that change its meaning"), ("base word", "The word a prefix is added to")],
    [
        _video(
            "Prefixes for Kids: un-, re-, mis-, dis-", "CgWj4e2AdLI",
            "Watch for the meaning of each prefix: un-, re-, mis- and dis-. Pause after each one and say a new word you could make. This is about 3 minutes. Status: transcript checked.",
            "If the video will not play, reread Step 7 and the prefix meanings in the teaching text: un- means not, re- means again, mis- means badly, dis- means not or remove.",
            ("What does the prefix re- mean?", ["Not", "Again", "Badly"], 1, "Re- means again, as in rebuild and refresh."),
        ),
        _video(
            "Joining cursive letters smoothly", "lYOzm0zyQ84",
            "Watch how the letters join and how the writer keeps the same size, spacing and slope. Pause and copy a few joins on paper. This is about 3 minutes. Status: description only, so a parent should play it once first. The style may differ from your school style, so follow the joins you have been taught.",
            "If the video will not play, practise joins from the model passage and the six-things checklist. Write 'rebuild' and 'refresh' in one smooth line.",
            ("What helps writing stay neat when you join letters?", ["Pressing hard", "Writing very big", "Keeping the same size, spacing and slope"], 2, "Consistent size, spacing and slope keep joined writing neat."),
        ),
    ],
    _sort("Which handwriting feature is it?", "Sort each problem or tip by the feature it belongs to.", ["Spacing", "Slope", "Size", "Posture and grip"], [("Words run together", 0), ("Gaps are too big", 0), ("Letters lean different ways", 1), ("Writing leans backwards then forwards", 1), ("Tall letters are too short", 2), ("Tails do not go below the line", 2), ("Pencil held too tightly", 3), ("Paper not tilted", 3)]),
    [
        _wc("Which means 'easy to read'?", ["fluent", "legible", "posture"], 1, "Legible means easy to read."),
        _wc("Which means 'smooth and steady'?", ["fluent", "slope", "prefix"], 0, "Fluent means smooth and steady."),
        _wc("Which letter has a tail?", ["t", "e", "y"], 2, "Y drops below the line."),
        _wc("Which is correct?", ["unwrap", "unrap", "onwrap"], 0, "un + wrap."),
        _wc("Which is correct?", ["rebild", "rebuild", "rebuilt"], 1, "re + build."),
        _wc("Which is correct?", ["dissobey", "disobay", "disobey"], 2, "dis + obey."),
        _wc("Which is correct?", ["mislead", "misslead", "mislede"], 0, "mis + lead."),
        _wc("Which means 'to build again'?", ["misbuild", "unbuild", "rebuild"], 2, "Re- means again."),
    ],
    [
        {"key": "partA", "label": "Part A: the six things", "hint": "Type the six things that make handwriting legible."},
        {"key": "partB", "label": "Part B: name the feature", "hint": "Which feature is each problem about: size, spacing or slope?"},
        {"key": "partC", "label": "Part C: prefixes", "hint": "un+wrap, re+build, dis+obey, mis+lead, un+clear, re+fresh."},
        {"key": "stage1", "label": "Warm up", "hint": "One thing you noticed when you wrote the letters and words."},
        {"key": "stage2", "label": "First timed copy", "hint": "How many words did you write in two minutes?"},
        {"key": "stage3", "label": "Checklist", "hint": "A tick or cross with a short note for each of the six things."},
        {"key": "stage4", "label": "Improve", "hint": "What you practised and what you changed."},
        {"key": "stage5", "label": "Second timed copy", "hint": "Your new word count, and whether it was still legible."},
        {"key": "spelling", "label": "Spelling words", "hint": "Type the six words and the prefix in each."},
    ],
    ["Pressing too hard and gripping too tightly", "Rushing so letters become sloppy", "Forgetting gaps between words", "Letters leaning different ways", "Losing or changing letters when adding a prefix"],
    ["Write a note to someone in the family, then ask them if every word is easy to read.", "Practise your six spelling words in joined writing for five minutes."],
    "Part A: posture and grip, letter shape, size, spacing, slope and joins. Part B: letters of different sizes is size, no gaps between words is spacing, letters leaning different ways is slope. Part C: unwrap, rebuild, disobey, mislead, unclear, refresh. Main task: check that the typed word counts match the paper copy, that the second copy is not messier than the first, and that the child picked one clear improvement. Accept any honest word counts. Quiz answers: easy to read; using a coloured pencil; light grip with the pencil resting on the middle finger; about the width of the letter o; p; you lift your pencil less; pick one thing to focus on; again; unclear; mislead.",
)

LESSON["spelling"] = {
    "focus": "Prefixes: un-, re-, dis-, mis- (finishing the week)",
    "teaching": "Add the prefix to the whole base word with no letters lost. Un-: unwrap, unclear. Re-: rebuild, refresh. Dis-: disobey. Mis-: mislead. Say the prefix, then the base word, then write them as one joined word.",
    "words": [
        _w("unwrap", "un-wrap", "un + wrap, silent w"),
        _w("rebuild", "re-build", "re + build, silent u"),
        _w("disobey", "dis-o-bey", "dis + obey"),
        _w("mislead", "mis-lead", "mis + lead"),
        _w("unclear", "un-clear", "un + clear"),
        _w("refresh", "re-fresh", "re + fresh"),
    ],
    "check": [
        _c("Which means 'to build again'?", ["unbuild", "rebuild", "misbuild"], 1, "Re- means again."),
        _c("Which is spelled correctly?", ["unclere", "uncleer", "unclear"], 2, "un + clear."),
    ],
}
LESSON["spelling_focus"] = "Prefixes: un-, re-, dis-, mis- (finishing the week)"
LESSON["hoard_words"] = list(WORDS)

if __name__ == "__main__":
    assert len(LESSON["quiz"]) == 10 and len(LESSON["word_challenges"]) == 8
    print("ok", LESSON["seed_key"])
