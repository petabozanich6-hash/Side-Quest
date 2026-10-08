"""Stage 2 English, Week 5 Lesson 2: Resolution, Revising and Editing (Writing).
The child writes the resolution for a model story (or their own story from Weeks 2 to 4), then revises it with ARMS and edits it with CUPS.
Spelling: the week's homophone focus (there, their, they're) is practised inside the editing task, with six new words: somewhere, anywhere, elsewhere, therefore, wherever, whenever.
Video status: all three videos were checked by search transcript excerpts only. Open and play each once before use, then update the notes.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["somewhere", "anywhere", "elsewhere", "therefore", "wherever", "whenever"]

STORY_START = (
    "The Missing Lunch Box\n\n"
    "On Monday morning, Jai hurried into the playground with his new blue lunch box. He had been looking forward to the school picnic all week. "
    "But when the class sat down on the grass, Jai opened his bag and gasped. His lunch box was gone! "
    "He looked under the bench, behind the tree and inside the sandpit, but it was nowhere to be seen."
)

DRAFT = (
    "then mia runned over with a blue lunch box she said I found it. jai was happy. they was going to have there picnic together. the end"
)

LESSON = build(
    "s2-eng-w05-l2-resolution-revising-editing",
    "Resolution, Revising and Editing",
    "Write the ending that solves your story's problem, then make it better in two steps. First revise your ideas and words, then edit the capitals, grammar, punctuation and spelling.",
    "Writing: resolution, revising and editing",
    ["EN2-CWT-01", "EN2-SPELL-01"],
    {
        "EN2-CWT-01": "Primary. Plans, creates and revises written texts for imaginative purposes, using text features, sentence-level grammar, punctuation and word-level language for a target audience, including writing a resolution and revising and editing a draft.",
        "EN2-SPELL-01": "Selects, applies and describes appropriate phonological, orthographic and morphological generalisations and strategies when spelling, including checking homophones such as there, their and they're while editing (week 5 spelling focus).",
    },
    "We are learning to write a resolution that solves the problem in a story, and to improve our writing by revising the ideas and editing the spelling, grammar, capital letters and punctuation.",
    [
        "I can say what a resolution is and why a story needs one.",
        "I can write a resolution that solves the problem and ties up loose ends.",
        "I can tell the difference between revising and editing.",
        "I can revise my writing using ARMS: Add, Remove, Move and Substitute.",
        "I can edit my writing using CUPS: Capitals, Usage, Punctuation and Spelling.",
        "I can spell and use there, their and they're correctly in my own writing.",
    ],
    ["resolution", "loose ends", "revise", "edit", "draft", "capital letter", "punctuation", "homophone"],
    ["This lesson (everything you need is inside it)", "Optional: your own story with an orientation and complication from Weeks 2 to 4"],
    "Child has met orientation, complication and show don't tell in Weeks 2 to 4, and can write a short paragraph with capital letters and full stops.",
    (
        "Why this matters. A good story needs an ending that solves the problem. If the ending is missing or rushed, the reader feels let down. After you write the ending, a great writer goes back and improves it. That second step is what makes writing clear and enjoyable.\n\n"
        "What a resolution is. The resolution is the part of a story where the problem is solved and everything is wrapped up. It answers the reader's questions and ties up loose ends. A resolution can show a character reaching a goal, fixing a problem, or learning a lesson. It often shows how the character feels at the end.\n\n"
        "Revising and editing are different. Revising means changing the ideas, the words and the order to make the writing better. Editing means fixing mistakes: capital letters, grammar, punctuation and spelling. Revise first, then edit, because there is no point polishing a sentence you might delete.\n\n"
        "Revise with ARMS. A is Add: add detail or a missing idea. R is Remove: remove words or sentences that are not needed or repeat. M is Move: move a sentence to a better place. S is Substitute: swap a plain word for a stronger one, such as changing happy to relieved.\n\n"
        "Edit with CUPS. C is Capitals: capital letters for the first word of each sentence, names and the word I. U is Usage: check grammar, such as ran not runned, and they were not they was. P is Punctuation: full stops, question marks, exclamation marks and speech marks. S is Spelling: check tricky words, such as there, their and they're.\n\n"
        "A link to spelling. This week's homophones are there, their and they're. When you edit, check each one by saying they are in the sentence. If it fits, write they're. If it shows belonging, write their. If it shows a place, write there."
    ),
    [
        _step("1", "What a resolution is", "The resolution is where the problem in the story is solved. It is the final part of a story, after the problem is at its biggest.\n\nWithout it, the reader is left wondering what happened.", "In The Missing Lunch Box, the problem is that the lunch box is lost. The resolution is when it is found and Jai gets it back.", "The resolution solves the problem.", ("What is a resolution?", ["The part where the problem starts", "The part where the problem is solved", "The title of the story"], 1, "The resolution is where the problem is solved.")),
        _step("2", "Ways to end a story", "A resolution can show a character reaching a goal, fixing the problem, or learning a lesson. It can show how the character feels at the end.\n\nChoose the ending that fits your story.", "Jai finds his lunch box (fixing the problem), feels relief (feeling), and remembers to zip his bag in future (lesson).", "Solve it, show the feeling, maybe add a lesson.", ("Which is a way to end a story?", ["Show the character learning a lesson", "Start a new problem and stop", "Leave out the ending"], 0, "A character learning a lesson is a common ending.")),
        _step("3", "Tie up the loose ends", "Loose ends are questions the reader still has. In the lunch box story, who found it, and where was it?\n\nAnswer them in the resolution so nothing is left hanging.", "Mia found the lunch box by the water tap and gave it back. Now the reader knows who, where and what happened next.", "Answer the reader's questions.", ("What does tie up loose ends mean?", ["Answer the questions the reader still has", "Add a new character", "Leave the problem unsolved"], 0, "Tying up loose ends answers what the reader still wonders.")),
        _step("4", "Revising and editing", "Revising changes the ideas, words and order. Editing fixes capitals, grammar, punctuation and spelling.\n\nDo them in that order: revise first, then edit.", "Revising: change 'Jai was happy' to 'Jai's face lit up with relief'. Editing: change 'runned' to 'ran'.", "Revise first, edit second.", ("What does editing mean?", ["Changing the plot", "Fixing capitals, grammar, punctuation and spelling", "Adding a new chapter"], 1, "Editing fixes mistakes in the conventions of writing.")),
        _step("5", "Revise with ARMS", "Add detail. Remove what is not needed. Move sentences to better places. Substitute plain words for stronger ones.\n\nChoose at least two of these changes for your draft.", "Add: Mia found it by the water tap. Remove: the end. Substitute: happy becomes relieved.", "Add, Remove, Move, Substitute.", ("In ARMS, what does M stand for?", ["Make", "Move", "Mend"], 1, "M stands for Move a sentence to a better place.")),
        _step("6", "Edit with CUPS", "Check Capitals, Usage, Punctuation and Spelling. Read your writing out loud slowly and point to each word.\n\nFix one thing at a time and tick it off.", "Fix: then becomes Then, mia becomes Mia, runned becomes ran, and add full stops and speech marks around what Mia says.", "Capitals, Usage, Punctuation, Spelling.", ("Which is a Usage fix?", ["Change they was to they were", "Add a full stop", "Give a name a capital"], 0, "Usage is about grammar, such as they were.")),
        _step("7", "Spelling focus: there, their, they're", "While editing, check every there, their and they're. Say they are in the sentence. If it fits, write they're.\n\nThere is a place. Their shows belonging.", "They're going to have their picnic over there. Each word does a different job.", "Place, belonging, or they are.", ("Which is correct? They were going to have ___ picnic.", ["there", "their", "they're"], 1, "Their shows that the picnic belongs to them.")),
    ],
    (
        "Read the start of The Missing Lunch Box. The problem is clear: Jai's lunch box is gone. We need a resolution. First plan it: how is the problem solved, who helps, how does Jai feel, and what changes? "
        "A model plan: Mia found the lunch box by the water tap and brings it over. Jai is relieved. He decides to always zip his name tag onto his bag. "
        "Now look at this rough draft of a resolution and think about what is wrong: then mia runned over with a blue lunch box she said I found it. jai was happy. they was going to have there picnic together. the end. "
        "Revising ideas: the draft says jai was happy, which tells the feeling. Show it instead, such as his face lit up with relief. Remove the end because the story already ends. Add where Mia found the lunch box. "
        "Editing with CUPS: Capitals (Then, Mia, Jai, They), Usage (ran, they were), Punctuation (full stops and speech marks), Spelling (their, not there). Fixed: Just then, Mia ran over with a blue lunch box. \"I found it by the water tap!\" she said. Jai's face lit up with relief. They were going to have their picnic together."
    ),
    (
        "Type your answers in the practice boxes. Part A: say in your own words what a resolution is and name two things it can show. Part B: write one change for each of A, R, M and S from ARMS for the rough draft. Part C: type the rough draft again with all the capitals, usage, punctuation and spelling fixed. Your parent can check your answers against the answer key."
    ),
    (
        "Read the start of the story, then do the tasks. Typed answers go in the boxes.\n\n" + STORY_START + "\n\n"
        "If you are writing your own story from Weeks 2 to 4, use that story instead of The Missing Lunch Box.\n\n"
        "Stage 1 (the problem): type what the problem is and what the reader wants to know.\n"
        "Stage 2 (plan the resolution): type how the problem is solved, who helps, how the character feels and what they learn.\n"
        "Stage 3 (write): type your resolution in three to five sentences. Tie up the loose ends.\n"
        "Stage 4 (revise with ARMS): type two or more changes you made, and which letters of ARMS they use.\n"
        "Stage 5 (edit with CUPS): check Capitals, Usage, Punctuation and Spelling, and type one fix for each.\n"
        "Stage 6 (final copy): type your finished resolution after revising and editing.\n"
        "Stage 7 (spell): type your six spelling words, and one sentence using there, their and they're.\n\n"
        "Parent: check that the resolution solves the problem, answers the reader's questions and shows a feeling. Check that the child has done something to revise, not only fix spelling. Accept any imaginative resolution."
    ),
    "Which change made your resolution better, and was it a revising change or an editing change?",
    "Did I solve the problem, tie up the loose ends, show a feeling, revise with ARMS, edit with CUPS, and check there, their and they're?",
    [
        _q("What is a resolution?", ["The part where the problem begins", "The part where the problem is solved and loose ends are tied up", "The title of the story", "The list of characters"], 1, "The resolution solves the problem and wraps up the story."),
        _q("Which sentence belongs in the resolution of The Missing Lunch Box?", ["Jai opened his bag and gasped", "Jai hurried into the playground", "Mia found the lunch box and gave it back to Jai", "The class sat on the grass"], 2, "Finding the lunch box solves the problem."),
        _q("What does tie up loose ends mean?", ["Answer the questions the reader still has", "Add a new character", "Leave the problem unsolved", "Start a new story"], 0, "Tying up loose ends answers the reader's remaining questions."),
        _q("What does revising mean?", ["Fixing spelling only", "Copying neatly", "Changing and improving ideas, wording and order", "Adding a title"], 2, "Revising improves the ideas, words and order."),
        _q("What does editing mean?", ["Fixing capitals, grammar, punctuation and spelling", "Adding a new chapter", "Changing the plot", "Drawing a picture"], 0, "Editing fixes the conventions of writing."),
        _q("In ARMS, what does M stand for?", ["Make", "Move", "Mend", "Mix"], 1, "M stands for Move."),
        _q("Which is a revising change?", ["Change 'Jai was happy' to 'Jai's face lit up with relief'", "Change 'runned' to 'ran'", "Add a full stop", "Give 'mia' a capital letter"], 0, "It changes the words to show the feeling, so it is revising."),
        _q("Which sentence is correct?", ["They was going to have their picnic", "They were going to have there picnic", "They're going to have there picnic", "They were going to have their picnic"], 3, "They were is correct grammar, and their shows belonging."),
        _q("Which is spelled correctly?", ["somewere", "sumwhere", "somewhere", "somewher"], 2, "some + where."),
        _q("Which is punctuated correctly?", ["'I found it' she said", "I found it she said.", "\"I found it\" she said", "\"I found it!\" she said."], 3, "Speech marks and an exclamation mark come inside the speech, and the sentence ends with a full stop."),
    ],
    "Type your answers in the practice boxes and submit them.",
    "Extension: write a different resolution for The Missing Lunch Box, such as one where Jai learns a lesson, or where the lunch box was somewhere surprising. Revise and edit it with ARMS and CUPS.",
    [("resolution", "The part of a story where the problem is solved"), ("loose ends", "Questions the reader still has at the end"), ("revise", "Change the ideas, words and order to improve writing"), ("edit", "Fix capitals, grammar, punctuation and spelling"), ("draft", "An early version of writing that can be improved"), ("capital letter", "A big letter used at the start of a sentence and for names"), ("punctuation", "Marks such as full stops, commas and speech marks"), ("homophone", "A word that sounds the same as another word but has a different spelling and meaning")],
    [
        _video(
            "What is a Resolution? (Story Elements for Kids)", "a4DOtwzQRCU",
            "Watch for the meaning of resolution and the different kinds: a character meeting a goal, or learning a lesson. Notice how loose ends are tied up. Status: transcript excerpts checked only, so a parent should play it once first and note the length.",
            "If the video will not play, reread Steps 1 to 3 and the model plan in the teaching text.",
            ("What is a resolution?", ["The final part where the problem is solved", "The first part of a story", "The setting"], 0, "The resolution is where the problem or conflict is resolved."),
        ),
        _video(
            "Narrative Writing for Kids: resolutions and solutions", "AgVQ1yxvXy4",
            "Watch how a resolution fixes the problem, wraps everything up, and can share a lesson. Notice how it gives the reader a feeling of satisfaction. Status: transcript excerpts checked only, so a parent should play it once first and note the length.",
            "If the video will not play, reread Step 2 and write an ending that shows a feeling and a lesson.",
            ("What does a good resolution give the reader?", ["A sense of satisfaction", "More questions", "A new problem"], 0, "The video says a resolution gives a sense of satisfaction."),
        ),
        _video(
            "Editing Your Writing for Kids", "izENvJJY6Hg",
            "Watch the four things to check when editing: grammar, spelling, capitalisation and punctuation. This video is made for younger students and uses American spelling, so use it as a reminder only. Status: transcript excerpts checked only, so a parent should play it once first.",
            "If the video will not play, reread Step 6 and use CUPS as your checklist.",
            ("Which is NOT one of the four things to check when editing?", ["Spelling", "Punctuation", "Changing the plot"], 2, "Editing checks grammar, spelling, capitals and punctuation, not the plot."),
        ),
    ],
    _sort("Revising or editing?", "Sort each change into revising (ideas, words, order) or editing (capitals, grammar, punctuation, spelling).", ["Revising", "Editing"], [("Add a sentence saying where Mia found the lunch box", 0), ("Swap 'happy' for 'relieved'", 0), ("Remove 'the end' because the story already finished", 0), ("Move the feeling sentence to the end", 0), ("Change 'runned' to 'ran'", 1), ("Add a capital letter to Mia", 1), ("Change 'there picnic' to 'their picnic'", 1), ("Add speech marks around what Mia says", 1)]),
    [
        _wc("Which means the part where the problem is solved?", ["complication", "resolution", "orientation"], 1, "The resolution solves the problem."),
        _wc("Which means changing ideas and words to improve writing?", ["revising", "editing", "publishing"], 0, "Revising improves ideas, words and order."),
        _wc("Which means fixing capitals, grammar, punctuation and spelling?", ["editing", "revising", "drafting"], 0, "Editing fixes the conventions."),
        _wc("Which is correct?", ["runned", "ran", "runed"], 1, "The past tense of run is ran."),
        _wc("Which fills the gaps? ___ going to share ___ lunch.", ["Their, they're", "They're, their", "There, their"], 1, "They're means they are, and their shows belonging."),
        _wc("Which is correct?", ["somewhere", "somwhere", "sumwhere"], 0, "some + where."),
        _wc("Which is correct?", ["therefore", "therefor", "therfore"], 0, "There + fore."),
        _wc("Which is correct?", ["anywere", "anywhre", "anywhere"], 2, "any + where."),
    ],
    [
        {"key": "partA", "label": "Part A: resolution", "hint": "What is a resolution? Name two things it can show."},
        {"key": "partB", "label": "Part B: ARMS", "hint": "One change each for Add, Remove, Move and Substitute on the rough draft."},
        {"key": "partC", "label": "Part C: edit the draft", "hint": "Type the rough draft again with every mistake fixed."},
        {"key": "stage1", "label": "The problem", "hint": "The problem and what the reader wants to know."},
        {"key": "stage2", "label": "Plan", "hint": "How it is solved, who helps, how the character feels and what they learn."},
        {"key": "stage3", "label": "My resolution", "hint": "Three to five sentences that tie up the loose ends."},
        {"key": "stage4", "label": "Revise with ARMS", "hint": "Two or more changes, and the ARMS letter for each."},
        {"key": "stage5", "label": "Edit with CUPS", "hint": "One fix each for Capitals, Usage, Punctuation and Spelling."},
        {"key": "stage6", "label": "Final copy", "hint": "Your finished resolution after revising and editing."},
        {"key": "spelling", "label": "Spelling words", "hint": "Type your six words and one sentence using there, their and they're."},
    ],
    ["Rushing the ending or leaving the problem unsolved", "Only fixing spelling and not revising the ideas", "Editing before revising", "Telling the feeling with happy instead of showing it", "Mixing up there, their and they're"],
    ["Read a short picture book and find the resolution. Say how the problem was solved.", "Practise your six spelling words by writing a sentence for each."],
    "Part A: a resolution is where the problem in a story is solved and loose ends are tied up; it can show a goal reached, a problem fixed, a lesson learned or a feeling. Part B: Add: where Mia found the lunch box. Remove: the end. Move: the feeling sentence to the end, or any sensible move. Substitute: happy to relieved. Part C: Just then, Mia ran over with a blue lunch box. \"I found it by the water tap!\" she said. Jai's face lit up with relief. They were going to have their picnic together. Accept small variations. Main task: check that the resolution solves the problem, ties up loose ends, shows a feeling, and that the child both revised and edited. Accept any imaginative ending. Quiz answers: the part where the problem is solved and loose ends are tied up; Mia found the lunch box and gave it back to Jai; answer the questions the reader still has; changing and improving ideas, wording and order; fixing capitals, grammar, punctuation and spelling; move; change 'Jai was happy' to 'Jai's face lit up with relief'; they were going to have their picnic; somewhere; \"I found it!\" she said.",
)

LESSON["spelling"] = {
    "focus": "Homophones: there, their, they're (in editing), with -where and there- words",
    "teaching": "Where means a place, so words with where are about places: somewhere, anywhere, elsewhere, wherever. Whenever means at any time. Therefore keeps the word there at the start. When you edit, check there, their and they're by saying they are in the sentence: if it fits, write they're.",
    "words": [
        _w("somewhere", "some-where", "some + where, a place"),
        _w("anywhere", "any-where", "any + where, any place"),
        _w("elsewhere", "else-where", "else + where, in another place"),
        _w("therefore", "there-fore", "there + fore, so"),
        _w("wherever", "wher-ev-er", "where + ever, in any place"),
        _w("whenever", "when-ev-er", "when + ever, at any time"),
    ],
    "check": [
        _c("Which is spelled correctly?", ["anywere", "anywhere", "anwhere"], 1, "any + where."),
        _c("Which means so?", ["therefore", "somewhere", "whenever"], 0, "Therefore means so, as a result."),
    ],
}
LESSON["spelling_focus"] = "Homophones: there, their, they're (in editing), with -where and there- words"
LESSON["hoard_words"] = list(WORDS)

if __name__ == "__main__":
    assert len(LESSON["quiz"]) == 10 and len(LESSON["word_challenges"]) == 8
    print("ok", LESSON["seed_key"])
