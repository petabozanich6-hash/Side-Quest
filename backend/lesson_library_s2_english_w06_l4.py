"""Stage 2 English, Week 6 Lesson 4: Listening and Note-taking (Oral language).
The child learns good listening habits, how to listen for the main idea and signpost words, how to write short key word notes in their own words, and how to turn notes into a spoken retell. A parent reads a short passage about the tawny frogmouth aloud and the child makes notes without looking at the text.
Spelling: the -tion ending: conversation, instruction, connection, suggestion, reflection, presentation.
Video status: How to Take Notes (Research for Kids Lesson 13, 4UJszFjnbGY) and Listening In The Classroom (AmLfFRdz1eE) were checked against their transcripts. The notes video teaches bullet points, paraphrasing and writing at least three key facts. The listening video gives three tips: focus your attention, be engaged and show empathy.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["conversation", "instruction", "connection", "suggestion", "reflection", "presentation"]

PASSAGE = (
    "PARENT READS ALOUD (read it slowly, twice; the child must not look at the words)\n\n"
    "The Tawny Frogmouth\n\n"
    "The tawny frogmouth is a bird that lives across Australia. Many people think it is an owl because it has big eyes and hunts at night, but it is not an owl at all. It is closer to a bird called a nightjar.\n\n"
    "First, let us look at its body. The tawny frogmouth has a wide, flat beak that looks a little like a frog's mouth. This is where its name comes from. Its feet are weak, so it catches food with its beak.\n\n"
    "Next, let us look at its food. The tawny frogmouth hunts at night. It eats insects, slugs, mice and small lizards.\n\n"
    "Finally, let us look at how it stays safe. By day the tawny frogmouth sits very still on a tree branch. It points its beak up and closes its eyes to a tiny slit. Its grey feathers look like bark, so it looks just like a broken branch."
)

MODEL_NOTES = (
    "MODEL NOTES\n\n"
    "Topic: Tawny frogmouth\n\n"
    "Intro\n"
    "lives across Australia\n"
    "looks like owl, NOT owl; closer to nightjar\n\n"
    "Body\n"
    "wide flat beak (frog's mouth)\n"
    "weak feet, so catches food with beak\n\n"
    "Food\n"
    "hunts at night\n"
    "insects, slugs, mice, small lizards\n\n"
    "Staying safe\n"
    "still on branch by day\n"
    "beak up, eyes slits\n"
    "grey feathers look like bark, looks like broken branch"
)

LESSON = build(
    "s2-eng-w06-l4-listening-and-note-taking",
    "Listening and Note-taking",
    "Good listeners catch the important facts and write them down fast. Learn how to listen, make short key word notes, and use them to retell what you heard.",
    "Oral language: listening and note-taking",
    ["EN2-OLC-01", "EN2-SPELL-01"],
    {
        "EN2-OLC-01": "Primary. Communicates effectively by using interaction skills, awareness of audience and speaking and listening conventions, including listening for the main idea, recording key points in notes, and retelling in the child's own words.",
        "EN2-SPELL-01": "Selects, applies and describes appropriate phonological, orthographic and morphological generalisations and strategies when spelling, including words ending in -tion (week 6 spelling focus).",
    },
    "We are learning to listen for the main idea, write short key word notes in our own words, and use them to retell what we heard, and to spell words that end in -tion.",
    [
        "I can show good listening habits.",
        "I can listen for the main idea and for signpost words such as first, next and finally.",
        "I can write short key word notes, not full sentences.",
        "I can organise notes under headings.",
        "I can use my notes to retell what I heard in my own words.",
        "I can spell and use conversation, instruction, connection, suggestion, reflection and presentation.",
    ],
    ["listening", "key words", "notes", "main idea", "signpost word", "heading", "retell", "paraphrase"],
    ["This lesson (everything you need is inside it)", "A parent or older person to read a short passage aloud", "Paper and a pencil for notes"],
    "Child can plan a report and use headings (Lessons 1 and 2) and knows technical words come with clues (Lesson 3).",
    (
        "Why this matters. We learn a lot by listening, in class, in conversations and in talks. But we can not remember everything we hear. Good listeners write short notes to keep the important facts, and use them later. This is also how writers collect facts for an information report.\n\n"
        "Good listening habits. Focus your attention and put away distractions. Look at the speaker. Be engaged by thinking about what is said and asking questions when it is your turn. Show respect by not interrupting. Listening is more than hearing. It means trying to understand.\n\n"
        "Listen for the main idea. The main idea is the big point of a talk. Listen for it at the start, and again at the end. Speakers also give signpost words that tell you where they are up to, such as first, next, also and finally. When you hear a signpost word, a new fact or section is coming.\n\n"
        "Write key words, not sentences. You can not write everything down, so write only key words and short phrases. Leave out little words such as the, a and is. Write in your own words. This is called paraphrasing, and it stops notes from being copied.\n\n"
        "Organise your notes. Put a heading for each section, then bullet points under it. Use short forms and symbols, such as kids instead of children, and an arrow for leads to. Only you need to understand your short forms.\n\n"
        "Use your notes. After listening, read your notes and retell the talk aloud in your own words. If a gap appears, ask a question or look for the fact later. Good notes help you speak or write clearly.\n\n"
        "A link to spelling. This week's spelling focus is words ending in -tion, which sounds like shun. Words about listening and speaking end this way, such as conversation, instruction, connection, suggestion, reflection and presentation."
    ),
    [
        _step("1", "Be ready to listen", "Good listeners focus their attention and put away distractions. They look at the speaker and keep their body still.\n\nThey also stay engaged by thinking and, when it is their turn, asking questions.", "Before a talk begins, put toys and devices away, sit up and look at the speaker.", "Focus, look, think.", ("Which shows good listening?", ["Playing with a toy during the talk", "Looking at the speaker and thinking about what is said", "Talking to a friend"], 1, "Good listeners focus and think about what is said.")),
        _step("2", "Listen for the main idea and signpost words", "The main idea is the big point. Signpost words such as first, next, also and finally tell you where the speaker is up to.\n\nWhen you hear one, a new fact or section is coming.", "In the frogmouth talk, First, Next and Finally signal the body, the food and how it stays safe.", "Signpost words show the next part.", ("Which is a signpost word?", ["Finally", "Frog", "Branch"], 0, "Finally is a signpost word that tells you the last part is coming.")),
        _step("3", "Write key words, not sentences", "Notes are short. Write only key words and short phrases, and leave out words like the, a and is.\n\nWrite in your own words.", "The sentence It eats insects, slugs, mice and small lizards becomes the notes: insects, slugs, mice, small lizards.", "Key words only.", ("Which is the best note?", ["It eats insects, slugs, mice and small lizards at night", "insects, slugs, mice, small lizards", "I like frogmouths"], 1, "A good note is made of key words.")),
        _step("4", "Use short forms and symbols", "Use short forms to write faster, such as kids for children, w for with, and an arrow for leads to.\n\nOnly you need to be able to read them, but check them straight after.", "Wide flat beak becomes wide beak. Looks like a broken branch becomes = broken branch.", "Short forms save time.", ("Why use short forms?", ["To make notes look pretty", "To write faster", "To make spelling harder"], 1, "Short forms let you keep up with the speaker.")),
        _step("5", "Organise with headings", "Put a heading for each section of the talk. Then add bullet points under it.\n\nGroups of notes make it easy to find a fact later.", "Headings in the model notes: Body, Food and Staying safe.", "Heading, then bullets.", ("What goes under a heading?", ["Nothing", "A long paragraph", "Bullet points of key words"], 2, "Bullet points of key words go under each heading.")),
        _step("6", "Retell from your notes", "After listening, read your notes and retell the talk in your own words. Use the headings in order.\n\nIf there is a gap, ask a question or check later.", "The tawny frogmouth is not an owl. It has a wide beak and weak feet. It eats insects and mice at night, and it stays safe by looking like a branch.", "Retell in your own words.", ("What do you use to retell a talk?", ["Your notes, in your own words", "A copy of every word", "Nothing at all"], 0, "Use your notes and say it in your own words.")),
        _step("7", "Spelling focus: -tion", "The ending -tion sounds like shun. Many talking words end this way: conversation, instruction, connection, suggestion, reflection and presentation.\n\nSay the word slowly, listen for shun at the end, then write -tion.", "During a conversation we follow the instruction, make a connection, give a suggestion and share a reflection.", "Shun at the end is usually -tion.", ("Which is spelled correctly?", ["presentashun", "presentation", "presentasion"], 1, "Presentation ends in -tion.")),
    ],
    (
        "Here is how I listen and take notes on the tawny frogmouth. Before the talk, I put my things away, sit up and look at the speaker. I listen for the main idea: the tawny frogmouth is a bird that is not an owl. When I hear First, I get ready to write under Body. I do not write a sentence. I write wide beak and weak feet. When I hear Next, I start a new heading, Food, and write insects, slugs, mice and small lizards. When I hear Finally, I start Staying safe and write still on branch, beak up and looks like a broken branch. Look at my model notes on the screen. They are short, in groups and in my own words. Now I can use them to retell the talk without reading the whole passage. "
        "Notice that I did not write every word. Listening is about getting the key facts.\n\n" + MODEL_NOTES
    ),
    (
        "Type your answers in the practice boxes. Part A: type three good listening habits. Part B: for each sentence, type the key words you would write as a note. The tawny frogmouth hunts at night. It eats insects, slugs, mice and small lizards. Part C: type the signpost words that a speaker might use to say first, then next, then last. Part D: type the correct -tion word for each blank. Choose from conversation, instruction, connection, suggestion, reflection and presentation. When two people talk, they are having a ___. A teacher gives an ___ to tell you what to do. A talk you give to the class is a ___. Your parent can check your answers against the answer key."
    ),
    (
        "Practise listening and note-taking with a parent. Typed answers go in the boxes.\n\n" + PASSAGE + "\n\n"
        "Stage 1 (get ready): type two things you will do to be a good listener.\n"
        "Stage 2 (listen and note): while a parent reads the passage aloud, write your notes on paper. Do not look at the passage. Then type your notes, with a heading for each section.\n"
        "Stage 3 (signpost words): type the signpost words you heard.\n"
        "Stage 4 (check): your parent reads it again. Add anything you missed and type any changes.\n"
        "Stage 5 (retell): look at your notes and retell the talk aloud in your own words. Then type three sentences that retell it.\n"
        "Stage 6 (try it yourself): ask a family member to tell you about their day for one minute. Type short notes of what they said.\n"
        "Stage 7 (spell): type your six spelling words and one sentence for each of conversation, instruction and presentation.\n\n"
        "Parent: check that notes are key words and not sentences, that each section has a heading, that the main idea (not an owl) is noted, that the signpost words are first, next and finally, and that the retell is in the child's own words. Accept different headings and short forms."
    ),
    "Why can't a good listener write down every word a speaker says?",
    "Did I listen carefully, write key word notes under headings, retell in my own words, and spell conversation, instruction, connection, suggestion, reflection and presentation correctly?",
    [
        _q("What is the main idea of a talk?", ["The big point", "The first word", "The last page", "The speaker's name"], 0, "The main idea is the big point of a talk."),
        _q("Which is a signpost word?", ["Branch", "Insect", "Next", "Beak"], 2, "Next is a signpost word that tells you a new part is coming."),
        _q("What should notes be made of?", ["Full paragraphs", "Key words and short phrases", "Every word spoken", "Pictures only"], 1, "Notes are key words and short phrases."),
        _q("What does paraphrasing mean?", ["Copying exactly", "Writing faster", "Writing the longest version", "Putting an idea in your own words"], 3, "Paraphrasing means using your own words."),
        _q("Which shows good listening?", ["Looking at the speaker", "Interrupting", "Looking away", "Playing"], 0, "Looking at the speaker and thinking shows good listening."),
        _q("What goes under a heading in notes?", ["A long story", "Bullet points of key words", "Nothing", "A drawing only"], 1, "Bullet points of key words go under each heading."),
        _q("Which is the best note for The bird eats insects and mice at night?", ["The bird eats insects and mice at night", "I like birds", "insects, mice, night", "eats"], 2, "Insects, mice, night are the key words."),
        _q("What do you use your notes for after the talk?", ["To throw away", "To copy a book", "To forget it", "To retell it in your own words"], 3, "Use your notes to retell in your own words."),
        _q("Which is spelled correctly?", ["conversashun", "conversation", "conversasion", "conversaton"], 1, "Conversation ends in -tion."),
        _q("Which is spelled correctly?", ["suggeshun", "sugestion", "suggestion", "suggesion"], 2, "Suggestion has a double g and ends in -tion."),
    ],
    "Type your answers in the practice boxes and submit them.",
    "Extension: listen to a short talk or video with a parent, such as a news story for kids. Take notes in key words under headings, then retell it to a family member in two minutes.",
    [("listening", "Hearing and trying to understand what someone says"), ("key words", "The most important words in a sentence"), ("notes", "Short key words and phrases that record facts"), ("main idea", "The big point of a text or talk"), ("signpost word", "A word such as first, next or finally that tells you where a speaker is up to"), ("heading", "A title for a section of notes"), ("retell", "To tell again in your own words"), ("paraphrase", "To say something in your own words")],
    [
        _video(
            "How to Take Notes | Research for Kids Lesson 13", "4UJszFjnbGY",
            "Watch how to take notes in your own words, use bullet points to list facts, and write at least three key facts about a topic. Listen for how paraphrasing keeps notes from being copied. Status: transcript checked.",
            "If the video will not play, reread Steps 3 and 5 and use the model notes.",
            ("What does the video say to do when you write notes?", ["Copy the sentences exactly", "Put the ideas in your own words", "Write as much as you can"], 1, "The video says to paraphrase, which means putting the idea in your own words."),
        ),
        _video(
            "Listening In The Classroom", "AmLfFRdz1eE",
            "Watch three tips for being a better listener: focus your attention, be engaged and show empathy. Think about which tip you find hardest. Status: transcript checked.",
            "If the video will not play, reread Step 1.",
            ("What is the first tip for listening in the classroom?", ["Focus your attention", "Talk loudly", "Look at the clock"], 0, "The first tip is to focus your attention and put away distractions."),
        ),
    ],
    _sort("Good note or too long?", "Sort each item into a good note or too long to be a note.", ["Good note", "Too long to be a note"], [("wide flat beak", 0), ("The tawny frogmouth has a wide, flat beak that looks like a frog's mouth", 1), ("insects, slugs, mice", 0), ("By day the bird sits very still on a tree branch", 1), ("beak up, eyes slits", 0), ("Its grey feathers look like bark", 1), ("weak feet", 0), ("It hunts at night and eats small animals", 1)]),
    [
        _wc("Which is the big point of a talk?", ["main idea", "signpost", "heading"], 0, "The main idea is the big point of a talk."),
        _wc("Which is a word like first, next or finally?", ["bullet word", "signpost word", "key page"], 1, "A signpost word shows where the speaker is up to."),
        _wc("Which means to say it in your own words?", ["copy", "repeat", "paraphrase"], 2, "Paraphrase means to say it in your own words."),
        _wc("Which means to tell again in your own words?", ["retell", "forget", "guess"], 0, "Retell means to tell again in your own words."),
        _wc("Which is spelled correctly?", ["instrucshun", "instruction", "instrucsion"], 1, "Instruction ends in -tion."),
        _wc("Which is spelled correctly?", ["conection", "conectshun", "connection"], 2, "Connection has a double n and ends in -tion."),
        _wc("Which is spelled correctly?", ["reflection", "reflecshun", "reflecsion"], 0, "Reflection ends in -tion."),
        _wc("Which is spelled correctly?", ["presentashun", "presentation", "presentasion"], 1, "Presentation ends in -tion."),
    ],
    [
        {"key": "partA", "label": "Part A: listening habits", "hint": "Three good listening habits."},
        {"key": "partB", "label": "Part B: key word notes", "hint": "Key words for each sentence about the tawny frogmouth."},
        {"key": "partC", "label": "Part C: signpost words", "hint": "Signpost words for first, next and last."},
        {"key": "partD", "label": "Part D: -tion words", "hint": "Fill the three blanks. Choose from conversation, instruction, connection, suggestion, reflection and presentation."},
        {"key": "stage1", "label": "Get ready", "hint": "Two things you will do to be a good listener."},
        {"key": "stage2", "label": "My notes", "hint": "Your notes with a heading for each section."},
        {"key": "stage3", "label": "Signpost words", "hint": "The signpost words you heard."},
        {"key": "stage4", "label": "Check and add", "hint": "What you added after the second reading."},
        {"key": "stage5", "label": "My retell", "hint": "Three sentences that retell the talk in your own words."},
        {"key": "stage6", "label": "Notes on a family talk", "hint": "Short notes of what a family member said about their day."},
        {"key": "spelling", "label": "Spelling words", "hint": "Type your six words and one sentence for each of conversation, instruction and presentation."},
    ],
    ["Trying to write down every word", "Writing full sentences instead of key words", "Not leaving space for headings", "Looking at the passage while taking notes", "Spelling the shun sound as shun or sion"],
    ["Listen to a short news story or talk with a parent and note the main idea in three words.", "Practise your six spelling words by writing a sentence for each."],
    "Part A: accept three listening habits, such as look at the speaker, put away distractions, think about what is said, do not interrupt. Part B: hunts at night becomes hunts, night (or night hunter); eats insects, slugs, mice and small lizards becomes insects, slugs, mice, small lizards. Part C: first, next, finally (also accept then, last, to begin with). Part D: conversation, instruction, presentation. Main task: Stage 1 accept habits such as looking at the speaker and putting devices away. Stage 2 accept key word notes under headings such as Body, Food and Staying safe (not full sentences); the main idea is that the tawny frogmouth is a bird that is not an owl. Stage 3 first, next, finally. Stage 4 accept any facts added. Stage 5 accept three retelling sentences in the child's own words. Stage 6 accept short key word notes of any family talk. Quiz answers: the big point; next; key words and short phrases; putting an idea in your own words; looking at the speaker; bullet points of key words; insects, mice, night; to retell it in your own words; conversation; suggestion.",
)

LESSON["spelling"] = {
    "focus": "The -tion ending (the shun sound)",
    "teaching": "The sound shun at the end of a word is most often spelled -tion. Many talking words end this way: conversation, instruction, connection, suggestion, reflection and presentation. Say the word slowly, listen for shun, then write -tion.",
    "words": [
        _w("conversation", "con-ver-sa-tion", "a talk between people, with sa before tion"),
        _w("instruction", "in-struc-tion", "from instruct, with c before tion"),
        _w("connection", "con-nec-tion", "double n in the middle, then c, then tion"),
        _w("suggestion", "sug-ges-tion", "double g, then s, then tion"),
        _w("reflection", "re-flec-tion", "from reflect, with c before tion"),
        _w("presentation", "pres-en-ta-tion", "from present, with ta before tion"),
    ],
    "check": [
        _c("Which is spelled correctly?", ["conversashun", "conversation", "conversasion"], 1, "Conversation ends in -tion."),
        _c("Which is spelled correctly?", ["sugestion", "suggeshun", "suggestion"], 2, "Suggestion has a double g and ends in -tion."),
    ],
}
LESSON["spelling_focus"] = "The -tion ending (the shun sound)"
LESSON["hoard_words"] = list(WORDS)

if __name__ == "__main__":
    assert len(LESSON["quiz"]) == 10 and len(LESSON["word_challenges"]) == 8
    print("ok", LESSON["seed_key"])
