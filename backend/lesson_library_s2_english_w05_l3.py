"""Stage 2 English, Week 5 Lesson 3: Punctuating Dialogue (Grammar and punctuation).
The child learns the rules for punctuating direct speech, fixes unpunctuated dialogue, then writes their own short dialogue.
Spelling: contraction and possession homophones that follow on from there, their and they're: its, it's, your, you're, we're, were.
Video status: both videos were checked against their full transcripts. The rules in the lesson follow the first video (speech first or tag first, question and exclamation marks, new line for a new speaker). The second video uses the American term quotation marks.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["its", "it's", "your", "you're", "we're", "were"]

UNPUNCTUATED = (
    "Sam looked at the empty sky. Where is my kite he asked\n"
    "It blew over the dunes said Priya\n"
    "Sam yelled Lets go"
)

LESSON = build(
    "s2-eng-w05-l3-punctuating-dialogue",
    "Punctuating Dialogue",
    "Learn the rules for writing what characters say. Use speech marks, capital letters, commas and a new line for each speaker so your readers can follow every word.",
    "Grammar and punctuation: punctuating dialogue",
    ["EN2-CWT-01", "EN2-SPELL-01"],
    {
        "EN2-CWT-01": "Primary. Plans, creates and revises written texts for imaginative purposes, using sentence-level grammar, punctuation and word-level language, including punctuating direct speech with speech marks, capital letters, commas, question marks and exclamation marks.",
        "EN2-SPELL-01": "Selects, applies and describes appropriate phonological, orthographic and morphological generalisations and strategies when spelling, including the homophones its and it's, your and you're, and we're and were (week 5 spelling focus).",
    },
    "We are learning to punctuate dialogue correctly using speech marks, capital letters, commas, question marks and exclamation marks, and to spell its, it's, your, you're, we're and were.",
    [
        "I can say what direct speech is.",
        "I can put speech marks around the exact words that are spoken.",
        "I can start speech with a capital letter and put the right punctuation inside the speech marks.",
        "I can place the comma correctly when the speech or the tag comes first.",
        "I can start a new line for each new speaker.",
        "I can spell and use its, it's, your, you're, we're and were correctly.",
    ],
    ["dialogue", "direct speech", "speech marks", "inverted commas", "tag", "new line", "contraction", "homophone"],
    ["This lesson (everything you need is inside it)", "Optional: your story from Weeks 2 to 5, so you can add dialogue to it"],
    "Child can write a sentence with a capital letter and a full stop, and has read stories with characters who speak (Weeks 1 to 5).",
    (
        "Why this matters. Dialogue is the words characters say to each other. It makes a story come alive and shows what characters are like. But it only works if the reader can see exactly who is speaking and what they say. Correct punctuation is how we show that.\n\n"
        "Direct speech and speech marks. Direct speech means the exact words that someone says. We put speech marks around those exact words. Speech marks are also called inverted commas or quotation marks. Think of them as a door that opens before the first spoken word and closes after the last one.\n\n"
        "The tag. The tag tells the reader who is speaking and how, such as said Pam or asked Bob. The tag is not inside the speech marks. The spoken words always start with a capital letter, even when the tag comes first.\n\n"
        "Speech first. When the speech comes before the tag, put a comma at the end of the speech, inside the speech marks, and then the tag, then a full stop: \"I made this pizza,\" said Pam. If the speech is a question or exclamation, the question mark or exclamation mark replaces the comma and stays inside the speech marks: \"What do you see?\" asked Bob. The tag after it starts with a small letter.\n\n"
        "Tag first. When the tag comes first, put a comma after the tag, then open the speech marks. The speech starts with a capital letter and the punctuation stays inside the closing marks: Pam said, \"I made this pizza.\" And with a question: Bob asked, \"What do you see?\"\n\n"
        "A new line for a new speaker. Each time a different person speaks, start a new line. This helps the reader to follow who is talking.\n\n"
        "A link to spelling. This week's spelling words are contraction homophones. It's means it is, but its shows that something belongs to it. You're means you are, but your shows that something belongs to you. We're means we are, but were is the past of are. Say the long form in the sentence to test it: if it fits, use the apostrophe."
    ),
    [
        _step("1", "What direct speech is", "Direct speech means the exact words someone says. It is what a character says out loud in a story.\n\nWe use speech marks, which are also called inverted commas or quotation marks, to show it.", "Pam said, \"I made this pizza.\" The words inside the speech marks are exactly what Pam said.", "Exact words go inside speech marks.", ("What is direct speech?", ["The exact words someone says", "A summary of what was said", "The title of a story"], 0, "Direct speech is the exact words spoken.")),
        _step("2", "Speech marks are like a door", "Open the speech marks before the first spoken word. Close them after the last spoken word and its punctuation.\n\nThe tag, such as he asked, stays outside the door.", "\"Where is my kite?\" he asked. The spoken words are inside, he asked is outside.", "Open before, close after.", ("Which part goes inside the speech marks?", ["The tag", "The exact words spoken", "The name of the speaker"], 1, "Only the exact spoken words go inside.")),
        _step("3", "Start speech with a capital letter", "The first word inside the speech marks always starts with a capital letter.\n\nThis is true even when the tag comes before the speech.", "Bob asked, \"What do you see?\" The word What has a capital letter even though it is in the middle of the sentence.", "Always a capital to begin speech.", ("Which is correct?", ["Sam yelled, \"let's go!\"", "Sam yelled, \"Let's go!\"", "Sam yelled, Let's go!"], 1, "Speech begins with a capital letter and sits inside speech marks.")),
        _step("4", "Speech first", "When the speech comes first, end it with a comma, a question mark or an exclamation mark, inside the closing speech marks. Then add the tag and finish with a full stop.\n\nA question mark or exclamation mark replaces the comma, and the tag starts with a small letter.", "\"I made this pizza,\" said Pam. \"What do you see?\" asked Bob. \"Look at this!\" yelled Bob.", "Punctuation goes inside the marks, then the tag.", ("Which is correct?", ["\"I made this pizza\", said Pam.", "\"I made this pizza,\" said Pam.", "\"I made this pizza\" said Pam."], 1, "The comma goes inside the closing speech marks.")),
        _step("5", "Tag first", "When the tag comes first, put a comma after the tag. Then open the speech marks, start with a capital letter, and put the end punctuation inside the closing marks.\n\nThere is no extra full stop after a question mark or exclamation mark.", "Pam said, \"I made this pizza.\" Bob asked, \"What do you see?\" Bob yelled, \"Look at this!\"", "Comma after the tag, then the speech.", ("Where does the comma go when the tag comes first?", ["After the tag, before the speech marks", "Inside the speech marks", "Nowhere"], 0, "The comma separates the tag from the speech.")),
        _step("6", "A new line for a new speaker", "Every time a different character speaks, start a new line. It makes it clear who says what.\n\nKeep each speaker's words and their tag together on one line.", "\"It is pouring,\" cried Mum.\n\"Can we go to the shelter?\" asked Sally.\nMum replied, \"Yes, that is a great idea.\"", "New speaker, new line.", ("When do you start a new line in dialogue?", ["When a different person starts speaking", "After every comma", "Only at the end of the story"], 0, "A new line shows a new speaker.")),
        _step("7", "Spelling focus: its/it's, your/you're, we're/were", "It's means it is. Its shows that something belongs to it. You're means you are. Your shows that something belongs to you. We're means we are. Were is the past of are.\n\nTest it: say the long form. If it fits, use the apostrophe.", "It's a kite, and its tail is red. You're right, and your idea is good. We're here, but we were late.", "Say it is, you are, we are to check.", ("Which is correct? The dog wagged ___ tail.", ["it's", "its", "its'"], 1, "Its shows that the tail belongs to the dog.")),
    ],
    (
        "Look at the broken dialogue and fix it together. It has no speech marks, no capital letters in the speech and no punctuation. Line one: Sam looked at the empty sky. Where is my kite he asked. The spoken words are Where is my kite. They are a question, so we need a capital W, a question mark inside the speech marks, and a full stop at the very end after he asked. Fixed: Sam looked at the empty sky. \"Where is my kite?\" he asked. "
        "Line two: It blew over the dunes said Priya. The spoken words are It blew over the dunes. Speech comes first, so it ends with a comma inside the speech marks, and then comes the tag. Fixed: \"It blew over the dunes,\" said Priya. This is a new speaker, so it goes on a new line. "
        "Line three: Sam yelled Lets go. This time the tag comes first, so we put a comma after yelled, open the speech marks, use a capital L, and add the apostrophe in Let's with an exclamation mark inside the closing marks. Fixed: Sam yelled, \"Let's go!\" Sam is a new speaker, so it is also on a new line."
    ),
    (
        "Type your answers in the practice boxes. Part A: type the rule for where the comma goes when the tag comes first, and when the speech comes first. Part B: type this sentence with the correct punctuation: where are you going asked mia. Part C: type the correct word for each blank: ___ a lovely day; the bird fed ___ chicks; ___ going to love this. Your parent can check your answers against the answer key."
    ),
    (
        "Read the broken dialogue, then do the tasks. Typed answers go in the boxes.\n\n" + UNPUNCTUATED + "\n\n"
        "Stage 1 (spot the speech): type the exact words each character says in the broken dialogue.\n"
        "Stage 2 (fix it): type the whole dialogue again with speech marks, capital letters, commas, question and exclamation marks, and a new line for each speaker.\n"
        "Stage 3 (check): type the three things you fixed in the first line.\n"
        "Stage 4 (write your own): write four lines of dialogue between two characters, such as Mia and Jai from The Missing Lunch Box. Use one question, one exclamation, one line with the tag first and one with the speech first.\n"
        "Stage 5 (check): type a checklist that shows speech marks, capital letters, punctuation inside the marks, commas and new lines.\n"
        "Stage 6 (spell): type your six spelling words and one sentence for each of its, it's, your and you're.\n\n"
        "Parent: check that every spoken word is inside speech marks, that speech starts with a capital letter, that punctuation sits inside the closing marks, and that each speaker has a new line. Accept any imaginative dialogue."
    ),
    "Which rule was the hardest to remember, and what will help you remember it?",
    "Did I put speech marks around the exact words, start speech with a capital letter, put punctuation inside the marks, place the comma correctly, start a new line for each speaker, and spell its, it's, your, you're, we're and were correctly?",
    [
        _q("What are speech marks used for?", ["To end a sentence", "To show the exact words someone says", "To join two words", "To show a title"], 1, "Speech marks go around the exact words spoken."),
        _q("Which is punctuated correctly?", ["\"I made this pizza\", said Pam.", "I made this pizza, said Pam.", "\"I made this pizza,\" said Pam.", "\"i made this pizza,\" said Pam."], 2, "The speech has marks, a capital letter and a comma inside the closing marks."),
        _q("Which is punctuated correctly?", ["Pam said \"I made this pizza.\"", "Pam said \"I made this pizza\".", "Pam said, \"i made this pizza.\"", "Pam said, \"I made this pizza.\""], 3, "A comma follows the tag, and the speech starts with a capital letter."),
        _q("Where does the question mark go in: What do you see asked Bob?", ["Inside the speech marks, after see", "After Bob", "Nowhere", "After asked"], 0, "The question mark is part of what Bob asks, so it goes inside the marks."),
        _q("Which is correct?", ["\"Look at this\"! yelled Bob.", "\"Look at this!\", yelled Bob.", "\"Look at this!\" Yelled Bob.", "\"Look at this!\" yelled Bob."], 3, "The exclamation mark sits inside the marks, and the tag starts with a small letter."),
        _q("When do you start a new line in dialogue?", ["After every sentence", "When a different person speaks", "Only at the end", "Never"], 1, "A new speaker gets a new line."),
        _q("When does the comma go before the speech marks?", ["When the tag comes first", "When the speech comes first", "Never", "Always"], 0, "When the tag comes first, a comma follows the tag."),
        _q("Which is correct? The kite lost ___ tail.", ["it's", "its'", "its", "its's"], 2, "Its shows that the tail belongs to the kite."),
        _q("Which is correct? ___ a sunny day.", ["Its", "It's", "Its'", "Is"], 1, "It's means it is."),
        _q("Which means you are?", ["your", "youre", "you're", "yoor"], 2, "You're is short for you are."),
    ],
    "Type your answers in the practice boxes and submit them.",
    "Extension: add a dialogue of at least six lines to your own story. Use a mix of tags before and after the speech, and use a stronger word than said, such as whispered or shouted.",
    [("dialogue", "A conversation between characters in a story"), ("direct speech", "The exact words someone says"), ("speech marks", "Marks that go around the exact words spoken, also called inverted commas or quotation marks"), ("inverted commas", "Another name for speech marks"), ("tag", "The words that tell who is speaking, such as said Pam"), ("new line", "Starting a fresh line for each new speaker"), ("contraction", "Two words joined into one with an apostrophe"), ("homophone", "A word that sounds the same as another word but has a different spelling and meaning")],
    [
        _video(
            "How To Use Speech Marks", "u6pkcdEylTE",
            "Watch the rules for speech marks: put them around the exact words, start speech with a capital letter, and use a comma, question mark or exclamation mark inside the marks. Notice the difference when the tag comes first, and the rule for a new line for each speaker. This is about 5 and a half minutes. It uses the American name Mom in one example. Status: full transcript checked.",
            "If the video will not play, reread Steps 3 to 6 and the worked example in the teaching text.",
            ("Where does the comma go when the speech comes before the tag?", ["After the tag", "Inside the closing speech marks", "Nowhere"], 1, "The comma sits at the end of the speech, inside the closing marks."),
        ),
        _video(
            "Punctuating Dialogue (Grammar for Kids)", "vZ4BbyBUSmA",
            "Watch for the idea that speech marks are like a door that opens and closes around the spoken words, and for the rule about capital letters and commas. This is about 4 minutes. It uses the American term quotation marks and asks you to pause the video and try questions. Status: full transcript checked.",
            "If the video will not play, reread Steps 2 to 5 and use the door idea.",
            ("What does the video compare speech marks to?", ["A fence", "A bridge", "A door that opens and closes"], 2, "The video says to think of speech marks as a door that opens and closes."),
        ),
    ],
    _sort("Correct or needs fixing?", "Sort each line of dialogue into correct or needs fixing.", ["Correct", "Needs fixing"], [("\"Where is my kite?\" he asked.", 0), ("Sam yelled, \"Let's go!\"", 0), ("\"It blew over the dunes,\" said Priya.", 0), ("Priya said, \"We can find it.\"", 0), ("Where is my kite he asked.", 1), ("Sam yelled \"let's go\"", 1), ("\"It blew over the dunes\", said Priya.", 1), ("\"Look out!\" Yelled Mia.", 1)]),
    [
        _wc("Which means the exact words a person says?", ["direct speech", "adverb", "noun"], 0, "Direct speech is the exact words spoken."),
        _wc("Which is another name for speech marks?", ["apostrophes", "inverted commas", "brackets"], 1, "Speech marks are also called inverted commas or quotation marks."),
        _wc("Which tells the reader who is speaking?", ["heading", "caption", "tag"], 2, "The tag, such as said Pam, tells who is speaking."),
        _wc("___ time to go.", ["Its", "It's", "Its'"], 1, "It's means it is."),
        _wc("The dog wagged ___ tail.", ["its", "it's", "its'"], 0, "Its shows that the tail belongs to the dog."),
        _wc("___ going to love this!", ["Your", "Youre", "You're"], 2, "You're means you are."),
        _wc("___ at the park now.", ["We're", "Were", "Wear"], 0, "We're means we are."),
        _wc("They ___ at the beach yesterday.", ["we're", "were", "wear"], 1, "Were is the past of are."),
    ],
    [
        {"key": "partA", "label": "Part A: the comma rule", "hint": "Where does the comma go when the tag comes first? When the speech comes first?"},
        {"key": "partB", "label": "Part B: fix the sentence", "hint": "where are you going asked mia"},
        {"key": "partC", "label": "Part C: its, it's, your or you're", "hint": "___ a lovely day; the bird fed ___ chicks; ___ going to love this."},
        {"key": "stage1", "label": "Spot the speech", "hint": "The exact words each character says."},
        {"key": "stage2", "label": "Fixed dialogue", "hint": "The whole dialogue with speech marks, capitals, commas and new lines."},
        {"key": "stage3", "label": "Check", "hint": "Three things you fixed in the first line."},
        {"key": "stage4", "label": "My dialogue", "hint": "Four lines with a question, an exclamation, a tag first and speech first."},
        {"key": "stage5", "label": "Checklist", "hint": "Speech marks, capitals, punctuation inside, commas and new lines."},
        {"key": "spelling", "label": "Spelling words", "hint": "Type your six words and a sentence for each of its, it's, your and you're."},
    ],
    ["Leaving out the speech marks", "Forgetting the capital letter at the start of speech", "Putting the comma or question mark outside the speech marks", "Starting the tag with a capital letter after a question mark", "Not starting a new line for a new speaker", "Mixing up its and it's, or your and you're"],
    ["Read a page of a story with dialogue and point out the speech marks, the commas and the new lines.", "Practise your six spelling words by writing a sentence for each."],
    "Part A: when the tag comes first, the comma goes after the tag, before the opening speech marks; when the speech comes first, the comma goes at the end of the speech, inside the closing speech marks. Part B: \"Where are you going?\" asked Mia. Part C: It's; its; You're. Main task fixed dialogue: Sam looked at the empty sky. \"Where is my kite?\" he asked. \"It blew over the dunes,\" said Priya. Sam yelled, \"Let's go!\" Accept variations in the child's own dialogue as long as every spoken word is in speech marks, speech starts with a capital letter, punctuation sits inside the marks, commas are placed correctly and each speaker has a new line. Quiz answers: to show the exact words someone says; \"I made this pizza,\" said Pam.; Pam said, \"I made this pizza.\"; inside the speech marks, after see; \"Look at this!\" yelled Bob.; when a different person speaks; when the tag comes first; its; It's; you're.",
)

LESSON["spelling"] = {
    "focus": "Homophones: its/it's, your/you're, we're/were",
    "teaching": "It's means it is, and its shows that something belongs to it. You're means you are, and your shows that something belongs to you. We're means we are, and were is the past of are. Test it by saying the long form: if it fits, use the apostrophe.",
    "words": [
        _w("its", "its", "belonging to it, with no apostrophe"),
        _w("it's", "it-is", "it is, and the apostrophe takes the place of the letter i"),
        _w("your", "your", "belonging to you, with no apostrophe"),
        _w("you're", "you-are", "you are, and the apostrophe takes the place of the letter a"),
        _w("we're", "we-are", "we are, and the apostrophe takes the place of the letter a"),
        _w("were", "were", "the past of are, as in they were late"),
    ],
    "check": [
        _c("Which means it is?", ["its", "it's", "its'"], 1, "It's is short for it is."),
        _c("Which is correct? ___ going to the beach.", ["Your", "You're", "Youre"], 1, "You're means you are."),
    ],
}
LESSON["spelling_focus"] = "Homophones: its/it's, your/you're, we're/were"
LESSON["hoard_words"] = list(WORDS)

if __name__ == "__main__":
    assert len(LESSON["quiz"]) == 10 and len(LESSON["word_challenges"]) == 8
    print("ok", LESSON["seed_key"])
