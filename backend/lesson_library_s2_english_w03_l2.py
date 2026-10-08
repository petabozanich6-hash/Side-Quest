"""Stage 2 English, Week 3 Lesson 2: Comparing with -er and -est (Language and writing).
All written work is typed inside the lesson. Spelling (comparative and superlative endings) is attached so the lesson is self-contained.
Video X7MihJiqGK8 (Adi Connection, comparative and superlative adjectives) found by search. Re-check in the video and link run.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["bigger", "biggest", "happier", "happiest", "faster", "fastest"]

PASSAGE = (
    "The Great Garden Race\n\n"
    "Early one sunny morning, three garden creatures lined up for a race from the lettuce patch to the old flowerpot. "
    "Sid the snail was the slowest of the three, but he was also the happiest. Bea the beetle was faster than Sid, and her shiny shell was bigger than a pebble. "
    "Lola the ladybird was the smallest, yet she was the fastest, because she could fly.\n\n"
    "When the leaf fell, they were off. Bea scurried along the path, and Sid slid behind her, leaving a long, silver trail. Lola zoomed overhead. "
    "But halfway there, a strong wind blew. Lola's wings were not strong enough, so she dropped into the grass. Bea kept running and reached the flowerpot first. "
    "Sid arrived last, but he was the happiest of all. 'It was my best race ever,' he said."
)

LESSON = build(
    "s2-eng-w03-l2-comparing-er-est",
    "Comparing with -er and -est",
    "Adjectives can compare things. Learn how -er compares two things and -est compares three or more, and how to spell the changed endings correctly.",
    "Language: comparative and superlative adjectives",
    ["EN2-VOCAB-01", "EN2-CWT-01", "EN2-SPELL-01"],
    {
        "EN2-VOCAB-01": "Primary. Uses comparative and superlative forms of adjectives accurately to compare people, animals and things.",
        "EN2-CWT-01": "Writes sentences that compare, using the correct form and a clear link such as than or of the three.",
        "EN2-SPELL-01": "Spells -er and -est words, applying the rules for doubling the final consonant and changing y to i (week 3 spelling focus).",
    },
    "We are learning to use -er and -est to compare, and to spell the endings correctly.",
    ["I can explain that -er compares two things and -est compares three or more.", "I can use than correctly with -er words.", "I can use the with -est words.", "I can spell -er and -est words by doubling the last letter or changing y to i.", "I can write a clear comparing sentence of my own."],
    ["adjective", "compare", "comparative", "superlative", "than", "suffix", "double", "most"],
    ["This lesson (everything you need is inside it)"],
    "Child can find adjectives in a sentence and add -ing and -ed with the spelling rules (Week 2 Lesson 3 and Week 3 Lesson 1).",
    (
        "Why this matters. We compare things all the time: who is taller, which is the best, what is the biggest. Adjectives change their endings to show the comparison, and knowing how helps you write clear, accurate sentences and describe characters and settings with more precision.\n\n"
        "Three forms. Most adjectives have three forms. The plain form describes one thing: fast. The comparative form compares two things and ends in -er: faster. The superlative form compares three or more things and ends in -est: fastest. You use than with a comparative ('Bea is faster than Sid') and the with a superlative ('Lola is the fastest of the three').\n\n"
        "Spelling rules. Most short adjectives just add -er or -est: small, smaller, smallest. If the adjective ends in e, you only add -r or -st: nice, nicer, nicest. If a short adjective ends with one short vowel and one consonant, double the last letter: big, bigger, biggest. If the adjective ends in a consonant and y, change y to i: happy, happier, happiest.\n\n"
        "Watch out. Longer adjectives usually use more and most instead: more careful, most careful. A few are irregular: good, better, best; bad, worse, worst. Never use both: 'more bigger' is incorrect.\n\n"
        "The routine. 1. Count how many things you are comparing. 2. Two things: use -er and than. Three or more: use -est and the. 3. Check the spelling rule. 4. Read your sentence aloud to hear whether it sounds right.\n\n"
        "A quick demonstration. 'Sid is slower than Bea' compares two. 'Sid is the slowest of the three' compares three. 'Sid is the happiest snail in the garden' uses the y to i rule."
    ),
    [
        _step("1", "Adjectives can compare", "An adjective describes a noun. We can change its ending to show how much of a quality something has compared to others.\n\nThe plain form is fast. Faster and fastest are used to compare.", "Lola is fast. Lola is faster than Bea. Lola is the fastest of the three.", "Adjectives change to compare.", ("Which word compares two things?", ["fast", "faster", "fastest"], 1, "Faster is the comparative form.")),
        _step("2", "Use -er for two", "The comparative form ends in -er and compares two things. It is usually followed by than.\n\nAsk: am I comparing exactly two things?", "Bea is bigger than Sid.", "-er compares two, and goes with than.", ("Which sentence is correct?", ["Bea is faster than Sid.", "Bea is fastest than Sid.", "Bea is more faster Sid."], 0, "Faster than compares two.")),
        _step("3", "Use -est for three or more", "The superlative form ends in -est and compares three or more things. It is usually used with the.\n\nAsk: is this the most of all of them?", "Lola is the fastest of the three.", "-est is for the top of three or more.", ("Which word fits? 'Sid is the ___ of the three.'", ["slower", "slowest", "slow"], 1, "With the and three creatures, use slowest.")),
        _step("4", "Rule 1: double the last letter", "When a short adjective ends in one short vowel and one consonant, double the last letter before adding -er or -est.\n\nThink of big and sad.", "big, bigger, biggest; sad, sadder, saddest.", "Short vowel plus one consonant: double it.", ("Which is correct?", ["biger", "bigger", "biggger"], 1, "Double the g.")),
        _step("5", "Rule 2: change y to i", "When an adjective ends in a consonant and y, change the y to i before adding -er or -est.\n\nThink of happy and funny.", "happy, happier, happiest; funny, funnier, funniest.", "Consonant plus y: change y to i.", ("Which is correct?", ["happyer", "happier", "happiier"], 1, "Change the y to i.")),
        _step("6", "Rule 3: just add, or add r and st", "Most adjectives just add -er or -est: fast, faster, fastest. If the word already ends in e, only add -r or -st: nice, nicer, nicest.\n\nCheck the ending first.", "small, smaller, smallest; nice, nicer, nicest.", "Check the ending, then pick the rule.", ("Which is correct?", ["nicest", "niceest", "nicst"], 0, "Add -st after a final e.")),
        _step("7", "Longer words and irregular ones", "Long adjectives usually use more and most: more careful, most careful. A few change completely: good, better, best; bad, worse, worst.\n\nNever use -er and more together.", "This is the most beautiful flower. Her drawing is better than mine.", "Long words use more and most; some are irregular.", ("Which is correct?", ["more beautifuler", "more beautiful", "beautifuler"], 1, "Long words use more.")),
    ],
    (
        "Compare the three creatures in The Great Garden Race. Sid is slow. Bea is faster than Sid, which compares two. Lola is the fastest of the three, which compares three. Now check the spelling. Fast just adds -er and -est. Big has one short vowel before one consonant, so double the g: bigger, biggest. "
        "Happy ends in consonant plus y, so change y to i: happier, happiest. Now build your own sentences: 'Lola is smaller than Bea.' 'Sid is the happiest creature in the garden.' Check each: how many things are being compared, and is the ending spelled correctly?"
    ),
    (
        "Type your answers in the practice boxes. Part A: type the comparative and superlative of small, big, happy, nice, fast and funny. Part B: choose the correct word and type the sentence: 'Bea is (fast/faster/fastest) than Sid.' and 'Lola is the (fast/faster/fastest) of the three.' Part C: type two comparing sentences about two animals you know, using -er and than. Part D: type three superlative sentences using the. Your parent can check your answers against the answer key."
    ),
    (
        "Read the story, then complete the stages. Everything you write goes in the boxes.\n\n" + PASSAGE + "\n\n"
        "Stage 1: type four comparing words from the story and say whether each is comparative or superlative.\n"
        "Stage 2: type the three forms (plain, comparative, superlative) for each of these: slow, big, happy, small, nice, funny.\n"
        "Stage 3: write three sentences comparing Sid, Bea and Lola. One must use than and two must use the.\n"
        "Stage 4: write a short paragraph (four sentences) comparing three animals, people or objects you know. Include at least two -er words, two -est words and one of: better, best, worse, worst, more or most.\n"
        "Stage 5: check your paragraph. Type which spelling rule you used in each -er or -est word.\n"
        "Stage 6 (spell): type your six spelling words and say which rule each one uses."
    ),
    "Which spelling rule was hardest to remember, and what trick will you use?", "Did I use -er with than for two things, -est with the for three or more, spell each ending correctly and write clear comparing sentences?",
    [_q("Which form compares two things?", ["fast", "faster", "fastest", "most fast"], 1, "The comparative compares two."), _q("Which form compares three or more things?", ["fast", "faster", "fastest", "fastly"], 2, "The superlative compares three or more."), _q("Which word usually follows a comparative?", ["than", "of", "the", "a"], 0, "We say faster than."), _q("Which sentence is correct?", ["Lola is the fastest of the three.", "Lola is the faster of the three.", "Lola is the most fastest of the three.", "Lola is fastest than the three."], 0, "The fastest of three is correct."), _q("What is the comparative of big?", ["biger", "bigger", "bigest", "biggest"], 1, "Double the g."), _q("What is the superlative of happy?", ["happiest", "happyest", "happyiest", "happist"], 0, "Change y to i."), _q("What is the comparative of nice?", ["nicer", "niceer", "nicier", "nicor"], 0, "Just add -r."), _q("What is the superlative of good?", ["gooder", "goodest", "best", "better"], 2, "Good is irregular: better, best."), _q("Which is correct?", ["more careful", "carefuler", "more carefuller", "carefullest"], 0, "Long adjectives use more."), _q("Which sentence compares exactly two things?", ["Sid is slower than Bea.", "Sid is the slowest.", "Sid is the slowest of the three.", "Sid is slow."], 0, "Slower than compares two.")],
    "Type your answers in the practice boxes and submit them.", "Extension: compare three of your favourite foods, animals or places. Use -er, -est, better and best correctly in at least five sentences.",
    [("adjective", "A word that describes a noun"), ("compare", "To show how things are alike or different"), ("comparative", "The form of an adjective that compares two things, such as faster"), ("superlative", "The form of an adjective that compares three or more things, such as fastest"), ("than", "A word used after a comparative"), ("suffix", "Letters added to the end of a word"), ("double", "To write the last letter twice before adding an ending"), ("most", "The greatest amount, used with long adjectives")],
    [_video("Comparative and superlative adjectives (Adi Connection)", "X7MihJiqGK8", "Watch for the examples: big, bigger, biggest; small, smaller, smallest; fast, faster, fastest. Say each set aloud.", "Read the worked example aloud and say each set of three words.", ("Which ending compares more than two things?", ["-er", "-est", "-ing"], 1, "-est is for more than two."))],
    _sort("Plain, comparative or superlative?", "Sort each word.", ["Plain", "Comparative", "Superlative"], [("fast", 0), ("small", 0), ("bigger", 1), ("faster", 1), ("happier", 1), ("fastest", 2), ("smallest", 2), ("happiest", 2)]),
    [_wc("Which is correct?", ["bigger", "biger", "biggger"], 0, "Double the g."), _wc("Which is correct?", ["biggest", "bigest", "biggiest"], 0, "Double the g."), _wc("Which is correct?", ["happyer", "happier", "happeir"], 1, "Change y to i."), _wc("Which is correct?", ["happiest", "happyest", "hapiest"], 0, "Change y to i."), _wc("Which is correct?", ["faster", "fastter", "fastar"], 0, "Just add -er."), _wc("Which is correct?", ["fastest", "fastist", "fasstest"], 0, "Just add -est."), _wc("Which compares two?", ["smaller", "smallest", "small"], 0, "-er compares two."), _wc("Which compares three or more?", ["smaller", "smallest", "small"], 1, "-est compares three or more.")],
    [{"key":"partA","label":"Part A: three forms","hint":"Comparative and superlative of small, big, happy, nice, fast and funny."}, {"key":"partB","label":"Part B: choose the word","hint":"Type both sentences with the correct word."}, {"key":"partC","label":"Part C: two comparing sentences","hint":"Use -er and than."}, {"key":"partD","label":"Part D: three superlative sentences","hint":"Use -est and the."}, {"key":"words","label":"Four comparing words from the story","hint":"Say comparative or superlative for each."}, {"key":"forms","label":"Six sets of three forms","hint":"slow, big, happy, small, nice, funny."}, {"key":"sentences","label":"Three sentences about Sid, Bea and Lola","hint":"One with than, two with the."}, {"key":"paragraph","label":"My comparing paragraph","hint":"Four sentences, two -er, two -est, and one of better, best, worse, worst, more or most."}, {"key":"rules","label":"Spelling rule check","hint":"Which rule did you use in each -er or -est word?"}, {"key":"spelling","label":"Spelling words","hint":"Type the six words and the rule for each."}],
    ["Using -est when comparing only two things", "Using more with -er, such as more bigger", "Forgetting to double the last letter in bigger and biggest", "Writing happyer instead of happier", "Leaving out than or the"],
    ["Compare three things in your room using -er and -est.", "Find five comparing words in a book and say which rule each uses."],
    "Part A: small, smaller, smallest; big, bigger, biggest; happy, happier, happiest; nice, nicer, nicest; fast, faster, fastest; funny, funnier, funniest. Part B: Bea is faster than Sid. Lola is the fastest of the three. Part C and D: accept correct forms with than and the. Main task: accept correctly spelled forms. Stage 1 examples: slowest, happiest, faster, bigger, smallest, fastest. Stage 2: slow, slower, slowest; big, bigger, biggest; happy, happier, happiest; small, smaller, smallest; nice, nicer, nicest; funny, funnier, funniest. Stage 3: accept clear sentences with than and the, such as Bea is bigger than Sid. Lola is the fastest of the three. Sid is the slowest of the three. Quiz answers: faster; fastest; than; Lola is the fastest of the three; bigger; happiest; nicer; best; more careful; Sid is slower than Bea.",
)

LESSON["spelling"] = {"focus":"-er and -est: doubling and changing y to i", "teaching":"Adding -er and -est follows three rules. Most words just add the ending (fast, faster, fastest). If a word ends in one short vowel and one consonant, double the last letter (big, bigger, biggest). If a word ends in a consonant and y, change y to i (happy, happier, happiest).", "words":[_w("bigger","big-g-er","double the g"),_w("biggest","big-g-est","double the g"),_w("happier","happ-i-er","change y to i"),_w("happiest","happ-i-est","change y to i"),_w("faster","fast-er","just add -er"),_w("fastest","fast-est","just add -est")], "check":[_c("Which is spelled correctly?",["biger","bigger","biggger"],1,"Double the g."),_c("Which is spelled correctly?",["happyest","happiest","hapiest"],1,"Change y to i.")]}
LESSON["spelling_focus"] = "-er and -est: doubling and y to i"
LESSON["hoard_words"] = list(WORDS)
