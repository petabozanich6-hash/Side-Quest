"""Stage 2 English, Week 6 Lesson 4: Listening and Note-taking (Oral language).
The child learns to listen for the main idea, write key words instead of sentences, use dot points and short forms, and use notes to say the facts back in their own words. A parent reads a short little penguin passage aloud.
Spelling: the -tion ending continued: attention, conversation, instruction, presentation, communication, observation.
Outcomes: EN2-OLC-01 and EN2-SPELL-01, checked against lesson_library_s2_english_placeholders.py (Week 6, Lesson 4, Oral language slot, listening and note-taking). Outcome wording is the official NESA text.
Video status: no video is attached to this lesson, because none has been found and checked.
This lesson needs a parent to read the passage aloud, twice, at a steady pace.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["attention", "conversation", "instruction", "presentation", "communication", "observation"]

PASSAGE = (
    "PARENT READS ALOUD (twice, slowly)\n\n"
    "Little penguins are the smallest penguins in the world. They stand about 33 centimetres tall. Their feathers are blue-grey on the back and white on the front.\n\n"
    "Little penguins live along the coast of southern Australia and New Zealand. They dig burrows or use rock crevices as nests.\n\n"
    "They hunt for small fish and squid in the sea. They come ashore at dusk, after a day of fishing.\n\n"
    "Foxes and dogs are dangers to little penguins on land."
)

LESSON = build(
    "s2-eng-w06-l4-listening-note-taking",
    "Listening and Note-taking",
    "Good listeners do not write everything down. Learn how to listen for the main idea, write key words and dot points, and then use your notes to explain what you heard in your own words.",
    "Oral language: listening and note-taking",
    ["EN2-OLC-01", "EN2-SPELL-01"],
    {
        "EN2-OLC-01": "Communicates with familiar audiences for social and learning purposes, by interacting, understanding and presenting. This lesson focuses on understanding spoken information by listening for key ideas and recording them as notes.",
        "EN2-SPELL-01": "Selects, applies and describes appropriate phonological, orthographic and morphological generalisations and strategies when spelling in a range of contexts. This week's focus is words ending in -tion.",
    },
    "We are learning to listen for the main idea, take notes using key words and dot points, and use our notes to retell facts in our own words, and to spell words that end in -tion.",
    [
        "I can show good listening behaviour.",
        "I can say the main idea of what I heard.",
        "I can write key words instead of whole sentences.",
        "I can organise notes in dot points under headings.",
        "I can use my notes to retell the facts in my own words.",
        "I can spell and use attention, conversation, instruction, presentation, communication and observation.",
    ],
    ["listening", "notes", "key word", "main idea", "dot point", "short form", "retell", "detail"],
    ["This lesson", "A parent or older person to read a short passage aloud", "Paper and a pencil for notes"],
    "Child has planned a report in Week 6 Lesson 2 and knows what a dot point and a subheading are.",
    (
        "Why this matters. You learn a lot by listening, in class, from a parent and from a speaker. You cannot remember everything, so you take notes. Notes are short. They help you remember the important facts so that you can use them later in a report.\n\n"
        "Good listening. Look at the speaker. Stay still and quiet. Think about the topic. Do not interrupt. If you do not understand something, wait for a gap and then ask a question. Good listening shows respect, and it helps you remember more.\n\n"
        "The main idea. Before you write anything, listen for the main idea, which is what the whole talk is about. It is usually in the first sentence or two. The details are the facts that tell more about the main idea.\n\n"
        "Key words. A key word is an important word that carries the meaning, such as a name, a number, a place or a technical word. Do not write whole sentences. Write only the key words. For example, the sentence Little penguins are the smallest penguins in the world becomes smallest penguin.\n\n"
        "Dot points and headings. Write each fact on its own line with a dot point. Group the facts under short headings, such as Size, Home, Food and Dangers. This matches the groups and subheadings you used when you planned a report in Lesson 2.\n\n"
        "Short forms. You can use short forms to write faster, such as cm for centimetres, a number for a number word, and an arrow for leads to. Only use short forms that you will understand later.\n\n"
        "Using your notes. After listening, read your notes and fill in anything you missed while it is still fresh. Then retell the facts out loud in your own words, in full sentences, using your notes as a guide. If you can retell it, you understood it.\n\n"
        "A link to spelling. This week's spelling focus is words ending in -tion, which sounds like shun. Many listening and speaking words end this way, such as attention, conversation, instruction, presentation, communication and observation. Pay attention to the ending, say it slowly, then write -tion."
    ),
    [
        _step("1", "Good listening", "Look at the speaker, stay still and quiet, and think about the topic. Do not talk while someone else is talking. If you do not understand, wait for a gap and ask a question.\n\nGood listening is the first step. You cannot take good notes if you are not listening.", "When a parent reads aloud, put your pencil down for the first reading and just listen. Pick up your pencil for the second reading.", "Eyes on the speaker, ears open.", ("What should you do when someone is speaking?", ["Talk to a friend", "Look at them and listen", "Look out the window"], 1, "Good listeners look at the speaker and listen carefully.")),
        _step("2", "The main idea", "The main idea is what the whole talk is about. Listen for it in the first sentence or two. The other facts are details that tell more about the main idea.\n\nSay the main idea in a few words before you start writing notes.", "Passage: Little penguins are the smallest penguins in the world. Main idea: little penguins.", "Main idea first, then details.", ("What is the main idea?", ["The most important thing the talk is about", "The last word of the talk", "The speaker's name"], 0, "The main idea is what the whole talk is about.")),
        _step("3", "Key words, not sentences", "Write only the words that carry the meaning, such as names, numbers, places and technical words. Leave out small words such as the, a, and, are.\n\nShort notes are quick to write, and they are quick to read later.", "The sentence They stand about 33 centimetres tall becomes 33 cm tall.", "Key words only.", ("Which is the best note for: They hunt for small fish and squid in the sea?", ["They hunt for small fish and squid in the sea", "hunt: fish, squid, sea", "hunt"], 1, "It keeps the key words and leaves out the small words.")),
        _step("4", "Dot points under headings", "Put each fact on its own line with a dot point. Group the facts under short headings. Your headings can be the same kind that you use for subheadings in a report.\n\nGroups make your notes easy to read and easy to turn into paragraphs.", "Size: smallest penguin; 33 cm. Home: southern Australia, New Zealand; burrows. Food: fish, squid. Dangers: foxes, dogs.", "Headings, then dot points.", ("Where would the fact foxes and dogs are dangers go?", ["Size", "Home", "Dangers"], 2, "Foxes and dogs are a danger, so the fact goes under Dangers.")),
        _step("5", "Short forms", "Short forms save time. Use cm for centimetres, numbers instead of number words, and an arrow for leads to. Do not use a short form that you may not understand later.\n\nYou can make your own short forms, but keep them simple.", "About thirty-three centimetres tall becomes 33 cm.", "Short, but still clear.", ("Which is a good short form for centimetres?", ["cm", "zz", "c"], 0, "The short form cm is clear and well known.")),
        _step("6", "Spelling focus: -tion", "The ending -tion sounds like shun. Many words you need for listening and speaking end this way: attention, conversation, instruction, presentation, communication and observation.\n\nSay the word slowly, listen for shun, then write -tion.", "Pay attention to the instruction. A conversation is a talk between people.", "Shun at the end is usually -tion.", ("Which is spelled correctly?", ["atenshun", "attention", "attension"], 1, "Attention has a double t and ends in -tion.")),
        _step("7", "Retell using your notes", "After listening, read your notes. Add any facts you missed while you still remember them. Then say the facts out loud in full sentences, in your own words, using the notes as a guide.\n\nIf you can retell it, you understood it.", "From food: fish, squid, sea you can say Little penguins hunt for fish and squid in the sea.", "Notes in, sentences out.", ("How can you check that you understood what you heard?", ["Retell it in your own words", "Read the title again", "Count the words"], 0, "If you can retell it in your own words, you understood it.")),
    ],
    (
        "Parent reads the passage below slowly. Child listens to the first reading with the pencil down. Then the second reading: child writes notes. Let me show you what the notes could look like. I listen to the first reading. The main idea is little penguins. Now the second reading, and I write notes under headings. Size: smallest penguin in world; 33 cm tall; feathers blue-grey back, white front. Home: coast of southern Australia and NZ; burrows or rock crevices. Food: small fish and squid; hunt in the sea; come ashore at dusk. Dangers: foxes, dogs on land. Notice that I did not write full sentences, and I used cm and NZ as short forms. Now I retell it using my notes: Little penguins are the smallest penguins in the world and stand about 33 centimetres tall. They live on the coast of southern Australia and New Zealand, and nest in burrows or rock crevices. They hunt for fish and squid in the sea and come ashore at dusk. Foxes and dogs are dangers on land. Notice that my retelling is in full sentences and in my own words, which shows I understood.\n\n" + PASSAGE
    ),
    (
        "Type your answers in the practice boxes. Part A: type three things that good listeners do. Part B: type the key words for this sentence: Penguins eat small fish and squid in the sea. Part C: type the correct word for each blank: A ___ is a talk between two people. Please pay ___ to the speaker. The teacher gave a clear ___ for the task. Your parent can check your answers against the answer key."
    ),
    (
        "Your parent will read a short passage aloud twice. Typed answers go in the boxes, and your paper notes are for you.\n\n" + PASSAGE + "\n\n"
        "Stage 1 (listen): listen to the first reading with your pencil down. Then type the main idea in a few words.\n"
        "Stage 2 (notes): during the second reading, write notes on paper using key words and dot points under four headings: Size, Home, Food and Dangers. Then type your notes in the box. Do not write full sentences.\n"
        "Stage 3 (fill in): read your notes and add anything you missed. Type the facts you added, or type none if you added nothing.\n"
        "Stage 4 (retell): using only your notes, say the facts out loud. Then type your retelling in full sentences, in your own words.\n"
        "Stage 5 (own topic): your parent chooses a topic and reads three or four facts about it aloud. It could be from a book. Take notes under at least two headings, then type your notes and a one-sentence retelling.\n"
        "Stage 6 (check): look at your notes. Type one thing that worked well and one thing you would change next time.\n"
        "Stage 7 (spell): type your six spelling words and one sentence for each of attention, conversation and instruction.\n\n"
        "Parent: read slowly, with a pause between paragraphs, and read the whole passage twice. Do not repeat a sentence on request during the second reading. Check that the child's notes use key words and dot points under headings, that the notes do not copy full sentences, and that the retelling uses full sentences in the child's own words. Check these facts: smallest penguins, 33 cm tall, blue-grey and white, southern Australia and New Zealand, burrows or rock crevices, small fish and squid, hunt in the sea, ashore at dusk, foxes and dogs. Do not mark for exact notes, and do not expect every fact. Praise good listening."
    ),
    "Which part of note-taking was the hardest for you: listening, choosing key words, or keeping up, and what could you try next time?",
    "Did I listen carefully, find the main idea, write key words and dot points under headings, use short forms I can read, retell the facts in my own words, and spell attention, conversation, instruction, presentation, communication and observation correctly?",
    [
        _q("What is the main idea?", ["The last fact in a talk", "What the whole talk is about", "The speaker's name", "The longest word"], 1, "The main idea is what the whole talk is about."),
        _q("What should you do first when someone starts to talk?", ["Start writing every word", "Talk with a friend", "Look at the speaker and listen", "Pack away your pencil"], 2, "Good listening comes first."),
        _q("What are key words?", ["Words that carry the important meaning", "The longest words", "Words with capital letters", "Words that rhyme"], 0, "Key words carry the important meaning."),
        _q("Which is the best note for: Foxes and dogs are dangers on land?", ["Foxes and dogs are dangers on land", "Dogs", "foxes, dogs: danger on land", "Land"], 2, "It keeps the key words and leaves out the small words."),
        _q("Why do we use dot points under headings?", ["To make the notes longer", "To make notes easy to read and sort", "To hide the facts", "To fill the page"], 1, "Headings and dot points keep notes organised."),
        _q("Which is a good short form for centimetres?", ["zz", "mc", "cm", "ct"], 2, "The short form cm is clear and well known."),
        _q("What should you do after listening?", ["Throw away your notes", "Read your notes and add what you missed", "Copy the whole talk", "Start a new topic"], 1, "Read your notes and add anything you missed."),
        _q("How can you check that you understood?", ["Retell it in your own words", "Count the dot points", "Read the title", "Check the page number"], 0, "If you can retell it, you understood it."),
        _q("Which is spelled correctly?", ["conversashun", "conversation", "conversasion", "converstion"], 1, "Conversation ends in -tion."),
        _q("Which is spelled correctly?", ["instruktion", "instrucshun", "instruction", "instrucsion"], 2, "Instruction ends in -tion."),
    ],
    "Type your answers in the practice boxes and submit them.",
    "Extension: ask a family member to tell you about a place they have visited, for about one minute. Take notes under headings of your choice, then use only your notes to retell it. Ask them what you missed, and add it to your notes in a different colour.",
    [("listening", "Paying close attention to what someone says"), ("notes", "Short written reminders of the important facts"), ("key word", "An important word that carries the meaning"), ("main idea", "What a whole talk or text is mostly about"), ("dot point", "A short note on its own line, marked with a dot"), ("short form", "A short way of writing a word, such as cm"), ("retell", "To say again in your own words"), ("detail", "A fact that tells more about the main idea")],
    [],
    _sort("Key word or small word?", "Sort each word from the sentence into key word or small word.", ["Key word", "Small word"], [("penguins", 0), ("the", 1), ("33 cm", 0), ("are", 1), ("burrows", 0), ("and", 1), ("squid", 0), ("a", 1)]),
    [
        _wc("Which means to say something again in your own words?", ["retell", "listen", "detail"], 0, "To retell is to say again in your own words."),
        _wc("Which is a short written reminder of important facts?", ["notes", "title", "caption"], 0, "Notes are short reminders."),
        _wc("Which is an important word that carries the meaning?", ["small word", "key word", "page number"], 1, "A key word carries the meaning."),
        _wc("Which is what a whole talk is mostly about?", ["detail", "caption", "main idea"], 2, "The main idea is what the whole talk is about."),
        _wc("Which is spelled correctly?", ["atention", "attention", "attenshun"], 1, "Attention has a double t and ends in -tion."),
        _wc("Which is spelled correctly?", ["presentashun", "presentasion", "presentation"], 2, "Presentation ends in -tion."),
        _wc("Which is spelled correctly?", ["communication", "comunication", "communikation"], 0, "Communication has a double m and ends in -tion."),
        _wc("Which is spelled correctly?", ["observashun", "observation", "observasion"], 1, "Observation ends in -tion."),
    ],
    [
        {"key": "partA", "label": "Part A: good listening", "hint": "Three things good listeners do."},
        {"key": "partB", "label": "Part B: key words", "hint": "Key words for: Penguins eat small fish and squid in the sea."},
        {"key": "partC", "label": "Part C: -tion words", "hint": "conversation, attention, instruction."},
        {"key": "stage1", "label": "Main idea", "hint": "After the first reading, in a few words."},
        {"key": "stage2", "label": "My notes", "hint": "Key words and dot points under Size, Home, Food and Dangers."},
        {"key": "stage3", "label": "Facts I added", "hint": "Anything you filled in afterwards, or none."},
        {"key": "stage4", "label": "My retelling", "hint": "Full sentences in your own words, using only your notes."},
        {"key": "stage5", "label": "My own topic", "hint": "Notes under at least two headings and a one-sentence retelling."},
        {"key": "stage6", "label": "Check", "hint": "One thing that worked well and one thing to change."},
        {"key": "spelling", "label": "Spelling words", "hint": "Type your six words and a sentence each for attention, conversation and instruction."},
    ],
    ["Trying to write every word instead of key words", "Writing full sentences in notes", "Copying the notes word for word instead of retelling in your own words", "Talking or looking away while the speaker is talking", "Spelling the shun sound as shun or sion"],
    ["Take notes while a family member talks about their day, then retell it.", "Practise your six spelling words by writing a sentence for each."],
    "Part A: accept any three, such as look at the speaker, stay quiet, think about the topic, do not interrupt, ask a question at a gap. Part B: accept penguins, eat, small fish, squid, sea, or similar key words, for example eat: fish, squid, sea. Part C: conversation, attention, instruction in that order. Main task Stage 1: accept little penguins or the smallest penguins. Stage 2: accept any notes in key words and dot points, for example Size: smallest penguin, 33 cm, blue-grey and white; Home: southern Australia, NZ, burrows or rock crevices; Food: small fish, squid, hunt in sea, ashore at dusk; Dangers: foxes, dogs. Stage 3: accept any facts or none. Stage 4: accept full sentences that match the facts, in the child's own words. Stages 5 to 6: accept any sensible topic, notes under at least two headings, one-sentence retelling, and a sensible reflection. Quiz answers: what the whole talk is about; look at the speaker and listen; words that carry the important meaning; foxes, dogs: danger on land; to make notes easy to read and sort; cm; read your notes and add what you missed; retell it in your own words; conversation; instruction.",
)

LESSON["spelling"] = {
    "focus": "The -tion ending (the shun sound)",
    "teaching": "The sound shun at the end of a word is most often spelled -tion. Many words you need for listening and speaking end this way: attention, conversation, instruction, presentation, communication and observation. Say the word slowly, listen for shun, then write -tion.",
    "words": [
        _w("attention", "at-ten-tion", "double t, listening carefully"),
        _w("conversation", "con-ver-sa-tion", "a talk between people"),
        _w("instruction", "in-struc-tion", "words that tell you what to do"),
        _w("presentation", "pres-en-ta-tion", "a talk that shows information"),
        _w("communication", "com-mu-ni-ca-tion", "double m, sharing messages"),
        _w("observation", "ob-ser-va-tion", "what you notice by looking and listening"),
    ],
    "check": [
        _c("Which is spelled correctly?", ["attention", "atenshun", "attension"], 0, "Attention has a double t and ends in -tion."),
        _c("Which is spelled correctly?", ["observashun", "observasion", "observation"], 2, "Observation ends in -tion."),
    ],
}
LESSON["spelling_focus"] = "The -tion ending (the shun sound)"
LESSON["hoard_words"] = list(WORDS)

if __name__ == "__main__":
    assert len(LESSON["quiz"]) == 10 and len(LESSON["word_challenges"]) == 8
    for _item in LESSON["quiz"]:
        pass
    print("ok", LESSON["seed_key"])
