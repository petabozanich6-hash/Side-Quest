"""Stage 2 English, Week 5 Lesson 1: Summarising a Story (Reading and comprehension).
The child reads an original short story, then summarises it with the beginning-middle-end frame and the Somebody Wanted But So frame.
Spelling focus for the week: the homophones there, their and they're. Six words are used here.
Video status: the summarising video and the Somebody Wanted But So video were checked against their full transcripts. The homophones song was checked by title, description and a noisy transcript (it confirms their = possession and they're = contraction), so open and play it once before use.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["there", "their", "they're", "theirs", "everywhere", "nowhere"]

STORY = (
    "The Lost Kite\n\n"
    "Sam and his sister Priya wanted to fly their new red kite at the beach. They carried it down to the sand, but there was no wind at all. "
    "They waited and waited. Then a strong gust came and the kite shot up into the sky.\n\n"
    "Suddenly the string slipped out of Sam's hand, and the kite sailed away over the dunes. \"It's gone!\" Sam cried. "
    "Priya did not stop to cry. She ran after the kite, up and down the dunes, until she saw a red tail in a bush.\n\n"
    "A friendly ranger helped them unhook the kite. Sam and Priya tied the string to their wrists. This time, when the wind came, "
    "the kite stayed with them, high above the sea."
)

LESSON = build(
    "s2-eng-w05-l1-summarising-a-story",
    "Summarising a Story",
    "Learn how to tell the whole story in just a few sentences. Find the most important parts, leave out the small details, and use two helpful frames to write a summary in your own words.",
    "Reading and comprehension: summarising a story",
    ["EN2-RECOM-01", "EN2-UARL-01", "EN2-SPELL-01"],
    {
        "EN2-RECOM-01": "Primary. Reads and comprehends texts for wide purposes using knowledge of text structures and language, and by monitoring comprehension, including identifying the main events and summarising a story.",
        "EN2-UARL-01": "Identifies and describes how ideas are represented in literature, using the beginning, middle and end of a story to show how events build.",
        "EN2-SPELL-01": "Selects, applies and describes appropriate phonological, orthographic and morphological generalisations and strategies when spelling, including homophones such as there, their and they're (week 5 spelling focus).",
    },
    "We are learning to summarise a story by finding the most important events and retelling them briefly in our own words, and to spell the homophones there, their and they're.",
    [
        "I can say what a summary is.",
        "I can find who, what, when, where, why and how in a story.",
        "I can sort the events of a story into the beginning, middle and end.",
        "I can use the Somebody Wanted But So frame to write a summary.",
        "I can leave out small details and keep my own opinions out of a summary.",
        "I can spell and use there, their and they're correctly.",
    ],
    ["summary", "main idea", "detail", "beginning", "middle", "end", "homophone", "contraction"],
    ["This lesson (everything you need is inside it)", "Optional: a notebook to jot down the three parts before typing"],
    "Child can read a short story independently and has met story elements: character, setting and plot (Weeks 1 to 4).",
    (
        "Why this matters. A summary is a short version of a story that tells only the most important parts. We use summaries when we tell a friend about a book, write a book review or check that we understood what we read. If you can summarise a story, you really understood it.\n\n"
        "What goes in a summary. Think about who the story is about, what happens, when and where it happens, why it happens and how it ends. These are the main points. A summary leaves out small details, like the colour of a character's shirt or what they had for lunch, because the story would still make sense without them.\n\n"
        "Use your own words. A summary is not copying sentences from the story. You read, think about the main points, then tell them yourself. Keep your own opinions out, because a summary says what happened, not whether you liked it.\n\n"
        "Two frames to help. The first is Beginning, Middle, End. Every story has a start where we meet the characters and the problem, a middle where things build up or change, and an end where the problem is solved. The second is Somebody Wanted But So. Somebody is the main character, Wanted is what they wanted, But is the problem, and So is what happened in the end.\n\n"
        "A link to spelling. This week's spelling words are the homophones there, their and they're. Homophones sound the same but have different spellings and meanings. There is a place. Their means belonging to them. They're is short for they are. The apostrophe in they're takes the place of the missing letter a."
    ),
    [
        _step("1", "What a summary is", "A summary is a short version of a story that tells only the main points. It is much shorter than the story but still makes sense on its own.\n\nA summary of a whole book might be only three or four sentences.", "The Three Little Pigs in one line: three pigs build houses, a wolf blows down two, and the pigs stay safe in the brick one.", "Short, with only the main points.", ("What is a summary?", ["A copy of the whole story", "A short version with only the main points", "A list of your favourite parts"], 1, "A summary is a short version with the main points.")),
        _step("2", "Who, what, when, where, why, how", "Ask six questions as you read. Who is it about? What happens? When and where does it happen? Why does it happen? How does it end?\n\nThe answers are the main points of the story.", "In The Lost Kite: who is Sam and Priya, what is the kite, where is the beach, why is the kite lost (a gust of wind), how does it end (they fly it again safely).", "Six questions find the main points.", ("Which question asks about the place?", ["Who", "Where", "Why"], 1, "Where asks about the place.")),
        _step("3", "Beginning, middle and end", "Split the story into three parts. The beginning introduces the characters and the problem. The middle shows what happens as things build up. The end shows how the problem is solved.\n\nWrite one or two key events for each part.", "Beginning: the children take the kite to the beach but there is no wind. Middle: a gust lifts the kite, then the string slips and it blows away. End: Priya finds it in a bush and they fly it again.", "Three parts, one or two events each.", ("Which part of a story solves the problem?", ["The end", "The beginning", "The title"], 0, "The end is where the problem is solved.")),
        _step("4", "Somebody Wanted But So", "Fill in four blanks. Somebody (the main character) wanted (what they wanted) but (the problem) so (what happened in the end).\n\nPut the four parts together into one sentence.", "Sam and Priya wanted to fly their new kite, but it blew away, so they chased it, found it in a bush and flew it again.", "Somebody, Wanted, But, So makes one sentence.", ("In Somebody Wanted But So, what does But tell us?", ["The problem", "The main character", "The ending"], 0, "But introduces the problem.")),
        _step("5", "Leave out the small details", "Ask yourself, would the story still make sense without this? If yes, leave it out.\n\nThe ranger being friendly and the dunes being sandy are nice details, but they are not the main points.", "Include: the kite blew away. Leave out: the kite was red with a long tail (nice, but not needed).", "Keep the main points, drop the small details.", ("Which detail could be left out of a summary of The Lost Kite?", ["The kite blew away", "The kite was found in a bush", "The kite had a red tail"], 2, "The colour of the tail is a small detail.")),
        _step("6", "Your own words, no opinions", "Write the summary in your own words. Do not copy sentences from the story and do not say whether you liked it.\n\nA summary says what happened, not what you think about it.", "Not a summary: I loved this story because it was funny. A summary: Two children lose their kite in the wind but find it and fly it again.", "Own words, just the facts.", ("Which sentence is a summary, not an opinion?", ["I think the kite was the best part", "Two children lose their kite, find it and fly it again", "The story was very exciting"], 1, "A summary says what happened, not what you think.")),
        _step("7", "Spelling focus: there, their, they're", "There is a place (over there). Their means belonging to them (their kite). They're means they are (they're at the beach).\n\nTest it: say they are in the sentence. If it fits, write they're.", "They're running to the beach to fly their kite. It is over there by the dunes.", "Place, belonging, or they are.", ("Which is correct? ___ kite is red.", ["There", "They're", "Their"], 2, "Their shows that the kite belongs to them.")),
    ],
    (
        "Read The Lost Kite carefully, then work through it together. First ask who, what, when, where, why and how. Who: Sam and Priya. What: they fly a kite that blows away. When and where: at the beach. Why: a gust of wind pulls the string away. How: they find it and fly it safely. "
        "Now sort the events into the beginning, the middle and the end. Beginning: the children carry the kite to the beach and there is no wind. Middle: a gust lifts the kite, the string slips and it sails away. End: Priya finds the kite in a bush, the ranger helps and they fly it again. "
        "Last, use Somebody Wanted But So: Sam and Priya wanted to fly their new kite, but it blew away, so they chased it, found it in a bush and flew it again safely. Notice what was left out: the colour of the kite, the ranger being friendly, and the dunes. The story still makes sense without them."
    ),
    (
        "Type your answers in the practice boxes. Part A: type the beginning, middle and end of The Lost Kite in one sentence each. Part B: complete Somebody Wanted But So for the story. Part C: type the correct word for each blank: ___ kite is red; put it over ___; I think ___ at the beach. Your parent can check your answers against the answer key."
    ),
    (
        "Read the story, then do the tasks. Typed answers go in the boxes.\n\n" + STORY + "\n\n"
        "Stage 1 (find the main points): type who, what, when, where, why and how for the story, one short answer for each.\n"
        "Stage 2 (three parts): type one sentence for the beginning, one for the middle and one for the end.\n"
        "Stage 3 (frame): complete Somebody Wanted But So for the story and type it as one sentence.\n"
        "Stage 4 (write a summary): join your three parts into a short paragraph of three to four sentences, in your own words, with no opinions. Type it in the box.\n"
        "Stage 5 (check): count your sentences, check that you left out small details, and tick that you did not copy from the story. Type your check.\n"
        "Stage 6 (spell): type your six spelling words and one sentence for each of there, their and they're.\n\n"
        "Parent: check the summary is shorter than the story, covers the beginning, middle and end, and is in the child's own words. Accept any accurate wording."
    ),
    "Which was easier for you, Beginning Middle End or Somebody Wanted But So, and why?",
    "Did I find the main points, leave out small details, use my own words, keep my opinions out, and spell there, their and they're correctly?",
    [
        _q("What is a summary?", ["A copy of the whole story", "A short version with only the main points", "A list of your opinions", "A new story"], 1, "A summary is a short version with the main points."),
        _q("Which belongs in a summary of The Lost Kite?", ["The colour of the ranger's hat", "The kite blew away over the dunes", "What Sam had for lunch", "How warm the sand was"], 1, "The kite blowing away is a main event."),
        _q("Whose words should you use in a summary?", ["The author's exact words", "Your own words", "Your friend's words", "No words at all"], 1, "A summary is written in your own words."),
        _q("Which event is in the beginning of The Lost Kite?", ["A ranger helps unhook the kite", "The string slips out of Sam's hand", "The kite lands in a bush", "The children take the kite to the beach and there is no wind"], 3, "The beginning sets up the characters and the problem."),
        _q("In Somebody Wanted But So, what does But tell you?", ["The problem", "The main character", "The ending", "The setting"], 0, "But introduces the problem."),
        _q("Which is the best summary of The Lost Kite?", ["I loved the story about the kite", "There was a beach, a ranger, and sand", "Sam and Priya wanted to fly their kite, but it blew away, so they chased it and flew it again", "The kite was red"], 2, "It has the main points in order and no opinion."),
        _q("Should a summary include your opinion?", ["Yes, always", "No, keep to what happened in the story", "Only if it is long", "Only in the title"], 1, "A summary says what happened, not what you think."),
        _q("Which is correct? Put your bag over ___.", ["their", "there", "they're", "thare"], 1, "There is a place."),
        _q("Which is correct? ___ going to the beach.", ["Their", "There", "They're", "Thier"], 2, "They're means they are."),
        _q("Which is correct? The children packed ___ towels.", ["there", "they're", "their", "theyre"], 2, "Their means belonging to them."),
    ],
    "Type your answers in the practice boxes and submit them.",
    "Extension: choose a short story or picture book you know well and write a Somebody Wanted But So summary of it. Then shorten it to one sentence without losing the main point.",
    [("summary", "A short version of a story with only the main points"), ("main idea", "The most important point"), ("detail", "A small piece of information that is not essential"), ("beginning", "The part of a story where we meet the characters and the problem"), ("middle", "The part where events build up or change"), ("end", "The part where the problem is solved"), ("homophone", "A word that sounds the same as another word but has a different spelling and meaning"), ("contraction", "Two words joined into one with an apostrophe")],
    [
        _video(
            "How to summarise a story (beginning, middle and end)", "cXTmf6tjhJw",
            "Watch how the story is split into beginning, middle and end, and how only the most important parts are kept in your own words. This is about 9 and a half minutes, so you can watch it in two parts. Status: full transcript checked.",
            "If the video will not play, reread Steps 2 and 3 and the worked example in the teaching text.",
            ("What does the video say you should include when you summarise?", ["Every detail", "Only the most important parts", "Your opinions"], 1, "A summary tells only the most important parts."),
        ),
        _video(
            "Summarising with Somebody Wanted But So", "4jUi0pSQ-bU",
            "Watch how Reya fills in Somebody wanted, but, so to retell The Three Little Pigs in one sentence. This is about 1 and a half minutes. Status: full transcript checked.",
            "If the video will not play, reread Step 4 and try the frame on a story you know well.",
            ("What does the word but introduce in the frame?", ["The problem", "The characters", "The setting"], 0, "But tells the problem in the story."),
        ),
        _video(
            "There, Their, They're homophones song", "3OjweUfHZ90",
            "Listen for what each word means: their shows that something belongs to someone, they're is a contraction, and there is a place. This is a rock song from a UK classroom group, about 4 minutes. Status: title, description and a noisy transcript checked (it confirms their and they're), so a parent should play it once first. It is a song, so it mostly helps the words stick.",
            "If the video will not play, reread Step 7: place, belonging, or they are.",
            ("What does they're mean?", ["A place", "They are", "Belonging to them"], 1, "They're is short for they are."),
        ),
    ],
    _sort("Beginning, middle or end?", "Sort each event from The Lost Kite into the part of the story where it happens.", ["Beginning", "Middle", "End"], [("Sam and Priya carry their kite to the beach", 0), ("There is no wind at first", 0), ("A strong gust lifts the kite", 1), ("The string slips and the kite blows away", 1), ("The kite lands in a bush", 2), ("A ranger helps unhook the kite", 2), ("They tie the string to their wrists and fly it again", 2)]),
    [
        _wc("Which means belonging to them?", ["there", "their", "they're"], 1, "Their means belonging to them."),
        _wc("Which means a place?", ["their", "they're", "there"], 2, "There is a place."),
        _wc("Which is short for they are?", ["they're", "their", "there"], 0, "They're is a contraction of they are."),
        _wc("___ kite is red.", ["They're", "There", "Their"], 2, "The kite belongs to them, so their."),
        _wc("Put it over ___.", ["their", "there", "they're"], 1, "Over there is a place."),
        _wc("I think ___ late.", ["there", "they're", "their"], 1, "They're late means they are late."),
        _wc("Which word means a short version with the main points?", ["summary", "setting", "climax"], 0, "A summary is a short version with the main points."),
        _wc("Which means the most important point?", ["detail", "main idea", "title"], 1, "The main idea is the most important point."),
    ],
    [
        {"key": "partA", "label": "Part A: three parts", "hint": "One sentence each for the beginning, middle and end of The Lost Kite."},
        {"key": "partB", "label": "Part B: Somebody Wanted But So", "hint": "Somebody, wanted, but, so, all in one sentence."},
        {"key": "partC", "label": "Part C: there, their or they're", "hint": "___ kite is red; put it over ___; I think ___ at the beach."},
        {"key": "stage1", "label": "Main points", "hint": "Who, what, when, where, why and how for the story."},
        {"key": "stage2", "label": "Three parts", "hint": "One sentence for the beginning, the middle and the end."},
        {"key": "stage3", "label": "Frame", "hint": "Your Somebody Wanted But So sentence."},
        {"key": "stage4", "label": "My summary", "hint": "Three to four sentences, in your own words, with no opinions."},
        {"key": "stage5", "label": "Check", "hint": "Number of sentences, small details left out, and not copied."},
        {"key": "spelling", "label": "Spelling words", "hint": "Type your six words and one sentence each for there, their and they're."},
    ],
    ["Copying whole sentences from the story", "Including small details that do not matter", "Adding your own opinion", "Telling the events out of order", "Mixing up there, their and they're"],
    ["Retell a favourite story to someone at home in under a minute, using Somebody Wanted But So.", "Practise your six spelling words by writing a sentence for each."],
    "Part A: Beginning: Sam and Priya take their kite to the beach but there is no wind. Middle: a gust lifts the kite, then the string slips and it blows away. End: Priya finds it in a bush and they fly it again. Part B: Sam and Priya wanted to fly their new kite, but it blew away, so they chased it, found it in a bush and flew it again. Part C: Their; there; they're. Main task: check that the summary is shorter than the story, covers all three parts in order, is in the child's own words and has no opinion. Accept any accurate wording. Quiz answers: a short version with only the main points; the kite blew away over the dunes; your own words; the children take the kite to the beach and there is no wind; the problem; Sam and Priya wanted to fly their kite, but it blew away, so they chased it and flew it again; no, keep to what happened in the story; there; they're; their.",
)

LESSON["spelling"] = {
    "focus": "Homophones: there, their, they're",
    "teaching": "There is a place. Their means belonging to them. They're means they are, and the apostrophe takes the place of the missing letter a. Test it by saying they are in the sentence: if it fits, write they're.",
    "words": [
        _w("there", "there", "a place, and it hides the word here"),
        _w("their", "their", "belonging to them, with the ei in the middle"),
        _w("they're", "they-are", "they are, with an apostrophe for the missing a"),
        _w("theirs", "theirs", "their plus s, belonging to them"),
        _w("everywhere", "ev-ery-where", "every + where, in all places"),
        _w("nowhere", "no-where", "no + where, in no place"),
    ],
    "check": [
        _c("Which means they are?", ["there", "they're", "their"], 1, "They're is short for they are."),
        _c("Which is correct? Put it over ___.", ["their", "they're", "there"], 2, "There is a place."),
    ],
}
LESSON["spelling_focus"] = "Homophones: there, their, they're"
LESSON["hoard_words"] = list(WORDS)

if __name__ == "__main__":
    assert len(LESSON["quiz"]) == 10 and len(LESSON["word_challenges"]) == 8
    print("ok", LESSON["seed_key"])
