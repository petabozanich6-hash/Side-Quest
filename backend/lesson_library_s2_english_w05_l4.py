"""Stage 2 English, Week 5 Lesson 4: Publish and Read Your Story (Writing and speaking).
The child proofreads and publishes their story with a cover page, rehearses reading it aloud with speed, accuracy and expression, and shares it in an author's chair with feedback.
Spelling: homophone and contraction review: who's, whose, where, wear, they'll, you'll.
Video status: both videos were checked against their full transcripts. The publishing video uses a superhero story (a villain freezes a character) and is made for younger students. The fluency video is a calm read-along about a boy and a turtle.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["who's", "whose", "where", "wear", "they'll", "you'll"]

READ_PASSAGE = (
    "Sam peered into the tide pool.\n"
    "\"Look!\" he whispered. \"Is that a crab?\"\n"
    "\"Yes,\" said Priya, \"and it is huge!\"\n"
    "They giggled all the way home."
)

LESSON = build(
    "s2-eng-w05-l4-publish-and-read-your-story",
    "Publish and Read Your Story",
    "Finish your story like a real author. Check it one last time, make a cover page, practise reading it aloud with feeling, and share it with an audience.",
    "Writing and speaking: publishing and reading aloud",
    ["EN2-CWT-01", "EN2-RECOM-01", "EN2-SPELL-01"],
    {
        "EN2-CWT-01": "Primary. Plans, creates and revises written texts for imaginative purposes, including publishing a final copy with a title, author name and illustration after revising and editing.",
        "EN2-RECOM-01": "Reads aloud with appropriate speed, accuracy and expression, using punctuation such as full stops, question marks and exclamation marks to guide the voice.",
        "EN2-SPELL-01": "Selects, applies and describes appropriate phonological, orthographic and morphological generalisations and strategies when spelling, reviewing homophones and contractions from Week 5 (who's and whose, where and wear, they'll and you'll).",
    },
    "We are learning to publish a story with a title, author name and illustration, and to read it aloud at a just-right speed, accurately and with expression.",
    [
        "I can explain that publishing is the last stage of the writing process.",
        "I can proofread my story one last time.",
        "I can make a cover page with a title, author name and illustration.",
        "I can read aloud with a just-right speed, accuracy and expression.",
        "I can use punctuation to guide my voice.",
        "I can share my story and give or receive a glow and a grow.",
        "I can spell and use who's, whose, where, wear, they'll and you'll correctly.",
    ],
    ["publish", "proofread", "cover page", "fluency", "expression", "author", "audience", "homophone"],
    ["This lesson (everything you need is inside it)", "Your story from Weeks 2 to 5, or The Missing Lunch Box with your resolution and dialogue", "A family member or friend to be your audience", "Optional: paper, pencils or crayons for a cover illustration"],
    "Child has a story with a beginning, a problem and a resolution, and has met revising, editing, and punctuating dialogue (Weeks 2 to 5).",
    (
        "Why this matters. Writing is only finished when it is shared. Publishing means preparing your writing so readers can enjoy it. Real authors publish their work to share it, and to become better writers. Reading your story aloud lets your audience hear the characters and feel the problem and the resolution.\n\n"
        "The writing process. A writer plans, drafts, revises, edits, and then publishes. Publishing comes last, after you have revised and edited. In this lesson you will do the final steps: a last proofread, a neat final copy, a cover page and a reading.\n\n"
        "Proofread one last time. Even after editing, small mistakes can hide. Read slowly and point at each word. Check capital letters, punctuation, spelling and the speech marks in your dialogue. Check tricky words you have learned in Week 5: there, their, they're, its, it's, your, you're, we're and were.\n\n"
        "The cover page. A cover page has the title of your story, your name as the author, and an illustration that makes readers want to read it. The title should hint at the story without giving away the ending.\n\n"
        "Fluent reading. A fluent reader reads with three things: a just-right speed, accuracy, and expression. Speed is not too fast and not too slow. Accuracy means reading the words correctly without skipping any. Expression means adding feeling and using the punctuation: pause at full stops and commas, let your voice rise at a question mark, and use stronger emotion at an exclamation mark.\n\n"
        "The author's chair. Authors sit in a special seat to read their writing to an audience. Read loudly and clearly, look up from the page sometimes, and use a different voice for each character. Listeners give one glow, something that was great, and one grow, one thing to try next time.\n\n"
        "A link to spelling. Revise this week's homophones with new words: who's means who is, but whose shows belonging. Where is a place, but wear means to have clothes on. They'll means they will, and you'll means you will."
    ),
    [
        _step("1", "Publishing is the last stage", "The writing process has stages: plan, draft, revise, edit and publish. Publishing is the last stage.\n\nWe publish to share our writing with readers, and to become better writers.", "You have planned with a story mountain, drafted your story, revised with ARMS and edited with CUPS. Now it is time to publish.", "Publish last, to share.", ("What is publishing?", ["Fixing spelling only", "The last stage, when you prepare your writing to share", "Planning a story"], 1, "Publishing is the last stage of the writing process.")),
        _step("2", "Proofread one last time", "Read slowly and point at each word. Check capital letters, punctuation, spelling and the speech marks in your dialogue.\n\nTick each check off as you go.", "Check: every sentence starts with a capital, every spoken word is inside speech marks, there and their and they're are correct.", "Slow reading and pointing.", ("What should you do when proofreading?", ["Read slowly and point at each word", "Skip to the end", "Only read the title"], 0, "Reading slowly and pointing helps you spot mistakes.")),
        _step("3", "Make a cover page", "Write the title of your story, then your name as the author, and draw an illustration that makes readers want to read it.\n\nChoose a title that hints at the story.", "Title: The Missing Lunch Box. By Jai's friend, your name. Illustration: a blue lunch box on the grass with a question mark above it.", "Title, author, illustration.", ("What goes on a cover page?", ["The answer key", "Title, author's name and an illustration", "Only the page number"], 1, "A cover page shows the title, the author and an illustration.")),
        _step("4", "Speed, accuracy and expression", "Fluent readers read at a just-right speed, accurately and with expression.\n\nNot too fast, not too slow. Read every word correctly. Add feeling.", "Reading Sam peered into the tide pool too fast hides the story. Too slow is hard to follow. Just right helps the listener enjoy it.", "Three parts of fluency.", ("What are the three parts of fluent reading?", ["Loud, quiet and fast", "Pictures, titles and covers", "Speed, accuracy and expression"], 2, "Fluency means speed, accuracy and expression.")),
        _step("5", "Let punctuation guide your voice", "Pause at full stops and commas. Let your voice rise at a question mark. Use stronger emotion at an exclamation mark.\n\nChange your voice for each character in the dialogue.", "\"Look!\" he whispered. (stronger, quiet excitement) \"Is that a crab?\" (voice goes up at the end)", "Punctuation tells your voice what to do.", ("What should your voice do at a question mark?", ["Go up", "Go flat", "Stop reading"], 0, "A question mark means your voice rises at the end.")),
        _step("6", "The author's chair", "Sit tall, read loudly and clearly, look up sometimes, and use a different voice for each character.\n\nListeners say one glow, which is something great, and one grow, which is something to try next time.", "Glow: I loved how your voice went up on the question. Grow: slow down a little in the exciting part.", "Read well, then share glow and grow.", ("What is a glow?", ["Something great about the reading", "A mistake", "A new character"], 0, "A glow is something the listener thought was great.")),
        _step("7", "Spelling focus: who's, whose, where, wear, they'll, you'll", "Who's means who is. Whose shows belonging. Where is a place. Wear means to have clothes on. They'll means they will, and you'll means you will.\n\nTest it: say the long form. If it fits, use the apostrophe.", "Who's reading first? Whose story is this? Where is the cover? I will wear my best shirt. They'll clap, and you'll smile.", "Say who is, they will, you will to check.", ("Which is correct? ___ story is this?", ["Who's", "Whose", "Whos"], 1, "Whose shows belonging.")),
    ],
    (
        "Practise reading this short passage aloud three times: once too slow, once too fast, and once just right. Then read it again with expression.\n\n" + READ_PASSAGE + "\n\n"
        "Mark it up. Draw a slash at each place you will pause. Circle the question mark and underline the exclamation marks. Look at line two. \"Look!\" he whispered. The word Look has an exclamation mark, but the tag says he whispered, so it needs to be exciting but quiet. Then \"Is that a crab?\" is a question, so your voice rises at the end. Line three: \"Yes,\" said Priya, \"and it is huge!\" pauses at both commas and ends with strong feeling. Last, They giggled all the way home is a calm ending, so slow down."
    ),
    (
        "Type your answers in the practice boxes. Part A: type what publishing means and name the three parts of a cover page. Part B: type where your voice goes up, where it pauses and where it gets stronger in the passage above. Part C: type the correct word for each blank: ___ story is this? ___ going to read first? ___ love my story! Your parent can check your answers against the answer key."
    ),
    (
        "Do the tasks to publish and share your story. Typed answers go in the boxes. If you have your own story from Weeks 2 to 5, use it. If not, use The Missing Lunch Box: the start from Lesson 2, your resolution, and your dialogue from Lesson 3.\n\n"
        "Stage 1 (pick and title): type the title of your story and your name as the author.\n"
        "Stage 2 (proofread): read your story slowly, pointing at each word, and type three things you checked or fixed.\n"
        "Stage 3 (final copy): type your finished story with a beginning, a problem, dialogue and a resolution.\n"
        "Stage 4 (cover page): type your title, author name, and one sentence describing your illustration. If you can, draw it on paper.\n"
        "Stage 5 (rehearse): type three places you will pause and one place you will change your voice.\n"
        "Stage 6 (author's chair): read your story aloud to a family member or friend. Type one glow and one grow they gave you.\n"
        "Stage 7 (spell): type your six spelling words and one sentence for each of who's, whose, where and wear.\n\n"
        "Parent: listen to the reading. Check that the child reads at a steady pace, reads the words correctly, and uses some expression. Give one glow and one grow. Accept any imaginative story. Check that the child has a title, an author name, a beginning, a problem and a resolution."
    ),
    "What went well in your reading, and what will you do differently next time?",
    "Did I proofread, make a cover page, read at a just-right speed, accurately and with expression, share my story, and spell who's, whose, where, wear, they'll and you'll correctly?",
    [
        _q("What is the final stage of the writing process?", ["Planning", "Publishing", "Drafting", "Editing"], 1, "Publishing is the last stage."),
        _q("Why do writers publish their work?", ["To avoid editing", "To make it shorter", "To share it with readers", "To hide it"], 2, "We publish to share our writing with readers."),
        _q("What should you do before you publish?", ["Revise and edit", "Nothing", "Only draw the cover", "Delete the story"], 0, "You revise and edit before publishing."),
        _q("What goes on a cover page?", ["Only a page number", "A list of spelling words", "The word count", "Title, author's name and an illustration"], 3, "A cover page shows the title, author and illustration."),
        _q("What are the three parts of fluent reading?", ["Volume, colour and size", "Speed, accuracy and expression", "Length, height and width", "Reading, writing and drawing"], 1, "Fluency is speed, accuracy and expression."),
        _q("What should your voice do at a question mark?", ["Whisper", "Stay flat", "Go up at the end", "Stop reading"], 2, "A question mark makes your voice go up."),
        _q("What does an exclamation mark tell you to do?", ["Read with stronger feeling", "Read very slowly", "Stop reading", "Whisper"], 0, "An exclamation mark means stronger emotion."),
        _q("What should you do at a full stop?", ["Speed up", "Skip it", "Shout", "Pause briefly"], 3, "A full stop is a pause."),
        _q("Which is correct? ___ the author of this story?", ["Whose", "Who's", "Whos", "Whoes"], 1, "Who's means who is."),
        _q("Which is correct? I will ___ my best shirt to school.", ["were", "where", "ware", "wear"], 3, "Wear means to have clothes on."),
    ],
    "Type your answers in the practice boxes and submit them.",
    "Extension: make a small book of your story with a cover and a page for each part, then read it to a younger child. Ask them what their favourite part was.",
    [("publish", "Prepare writing to share with readers; the last stage of writing"), ("proofread", "Read slowly to check for mistakes one last time"), ("cover page", "The front page with a title, author name and illustration"), ("fluency", "Reading with a just-right speed, accuracy and expression"), ("expression", "Adding feeling to your voice when you read"), ("author", "The person who wrote a story"), ("audience", "The people who listen to or read your story"), ("homophone", "A word that sounds the same as another word but has a different spelling and meaning")],
    [
        _video(
            "Publishing Your Narrative", "ZG09WmwrTr4",
            "Watch what publishing means, why authors publish, and how a cover page with a title, author name and illustration is made. This is about 5 minutes. It is made for younger students and uses a superhero story where a villain freezes a character. Status: full transcript checked.",
            "If the video will not play, reread Steps 1 to 3 and make your cover page.",
            ("What is publishing?", ["Fixing spelling only", "The last stage of the writing process, when we prepare writing to share", "Planning a story"], 1, "Publishing is the last stage, when we prepare writing to share."),
        ),
        _video(
            "Reading Fluency: Speed, Accuracy and Expression", "i0cQu7vnDzs",
            "Watch the three parts of fluent reading and listen to the same story read too slowly, too fast and just right. Notice how the voice pauses at punctuation, goes up at a question mark and gets stronger at an exclamation mark. This is about 5 and a half minutes. Status: full transcript checked.",
            "If the video will not play, reread Steps 4 and 5 and practise the passage.",
            ("What are the three parts of fluency in the video?", ["Loud, quiet and fast", "Pictures, titles and covers", "Speed, accuracy and expression"], 2, "The video says fluency is speed, accuracy and expression."),
        ),
    ],
    _sort("Before publishing or publishing day?", "Sort each job into before publishing (planning to editing) or publishing day.", ["Before publishing", "Publishing day"], [("Plan with a story mountain", 0), ("Write a first draft", 0), ("Revise with ARMS", 0), ("Edit with CUPS", 0), ("Write the final copy neatly", 1), ("Add a title and the author's name", 1), ("Draw an illustration", 1), ("Read the story aloud to an audience", 1)]),
    [
        _wc("Which means preparing writing to share?", ["publishing", "drafting", "planning"], 0, "Publishing is preparing writing to share."),
        _wc("Which means reading smoothly with speed, accuracy and expression?", ["fiction", "fluency", "fraction"], 1, "Fluency is reading smoothly and expressively."),
        _wc("Which means reading the words correctly?", ["speed", "expression", "accuracy"], 2, "Accuracy means reading the words correctly."),
        _wc("Which means adding feeling to your voice?", ["expression", "accuracy", "title"], 0, "Expression adds feeling."),
        _wc("___ idea was this?", ["Who's", "Whose", "Whos"], 1, "Whose shows belonging."),
        _wc("___ coming to the author's chair?", ["Whose", "Whos", "Who's"], 2, "Who's means who is."),
        _wc("___ love my story!", ["You'll", "Youll", "Yoll"], 0, "You'll means you will."),
        _wc("They ___ clap when I finish.", ["theyl", "they'll", "they'l"], 1, "They'll means they will."),
    ],
    [
        {"key": "partA", "label": "Part A: publishing", "hint": "What does publishing mean? Name the three parts of a cover page."},
        {"key": "partB", "label": "Part B: reading the passage", "hint": "Where does your voice go up, pause and get stronger?"},
        {"key": "partC", "label": "Part C: who's, whose or you'll", "hint": "___ story is this? ___ going to read first? ___ love my story!"},
        {"key": "stage1", "label": "Title and author", "hint": "The title of your story and your name as the author."},
        {"key": "stage2", "label": "Proofread", "hint": "Three things you checked or fixed."},
        {"key": "stage3", "label": "Final copy", "hint": "Your finished story with a beginning, a problem, dialogue and a resolution."},
        {"key": "stage4", "label": "Cover page", "hint": "Title, author name and one sentence about your illustration."},
        {"key": "stage5", "label": "Rehearse", "hint": "Three places you will pause and one place you will change your voice."},
        {"key": "stage6", "label": "Author's chair", "hint": "One glow and one grow from your listener."},
        {"key": "spelling", "label": "Spelling words", "hint": "Type your six words and one sentence each for who's, whose, where and wear."},
    ],
    ["Skipping the final proofread", "Reading too fast to be understood", "Reading in a flat voice", "Ignoring the punctuation when reading aloud", "Mixing up who's and whose, or where and wear"],
    ["Read your published story to someone else at home, such as a grandparent, over a call.", "Practise your six spelling words by writing a sentence for each."],
    "Part A: publishing means preparing your writing to share with readers; it is the last stage of the writing process; a cover page has a title, an author name and an illustration. Part B: the voice goes up at the question mark after crab; pauses at the commas and at the end of each sentence; stronger on Look! and and it is huge!. Part C: Whose; Who's; You'll. Main task: check that the story has a title, an author name, a beginning, a problem, dialogue and a resolution; that the proofread shows real checks; that the cover page has a title, author and an illustration idea; and that the reading was at a steady pace, accurate and with some expression. Accept any imaginative story. Quiz answers: publishing; to share it with readers; revise and edit; title, author's name and an illustration; speed, accuracy and expression; go up at the end; read with stronger feeling; pause briefly; who's; wear.",
)

LESSON["spelling"] = {
    "focus": "Homophones and contractions: who's/whose, where/wear, they'll, you'll",
    "teaching": "Who's means who is, and whose shows belonging. Where is a place, and wear means to have clothes on. They'll means they will, and you'll means you will, and the apostrophe takes the place of the missing letters wi. Test it by saying the long form.",
    "words": [
        _w("who's", "who-is", "who is, with an apostrophe for the missing i"),
        _w("whose", "whose", "belonging to whom, with no apostrophe"),
        _w("where", "where", "a place, and it hides the word here"),
        _w("wear", "wear", "to have clothes on, with ear in the middle"),
        _w("they'll", "they-will", "they will, with an apostrophe for the missing wi"),
        _w("you'll", "you-will", "you will, with an apostrophe for the missing wi"),
    ],
    "check": [
        _c("Which means who is?", ["whose", "who's", "whos"], 1, "Who's is short for who is."),
        _c("Which is correct? I will ___ my hat.", ["where", "wear", "were"], 1, "Wear means to have clothes on."),
    ],
}
LESSON["spelling_focus"] = "Homophones and contractions: who's/whose, where/wear, they'll, you'll"
LESSON["hoard_words"] = list(WORDS)

if __name__ == "__main__":
    assert len(LESSON["quiz"]) == 10 and len(LESSON["word_challenges"]) == 8
    print("ok", LESSON["seed_key"])
