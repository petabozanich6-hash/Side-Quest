"""Stage 2 English, Week 2 Lesson 2: Planning a Story with a Story Mountain (Writing: plan).
Built to the standard in docs/LESSON_BUILD_GUIDE.md. All written work is typed inside the lesson.
Spelling is attached here so the lesson is self-contained.
Video ID cYqmNO6gr2Y (writing a story with beginning, middle, end, tutorial for kids) was found by search. Re-check it in the planned video and link run.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["wait", "play", "three", "peak", "road", "speed"]

PASSAGE = (
    "Model Plan: The Lost Kite\n\n"
    "Title: The Lost Kite\n"
    "Characters: Priya (brave, thoughtful) and her little brother Sam (careful, a bit scared of heights)\n"
    "Setting: a windy hill beside a river, on a bright afternoon\n\n"
    "1. Opening: Priya and Sam fly their red kite on the windy hill.\n"
    "2. Build-up: A gust snaps the string. The kite sails over the river and into the forest. The children chase it down the path.\n"
    "3. Problem (the peak): The kite is stuck at the top of a tall tree, and dark clouds are rolling in. Sam is too scared to climb.\n"
    "4. Resolution: Priya ties a ball of string to a stone and throws it over a branch. Together they pull gently until the kite floats down.\n"
    "5. Ending: They walk home as the first drops of rain fall, and they promise to tie a stronger knot next time."
)

LESSON = build(
    "s2-eng-w02-l2-story-mountain",
    "Planning a Story with a Story Mountain",
    "Great stories are planned before they are written. Learn the five parts of a story mountain, study a model plan, then plan an exciting story of your own from the opening to the ending.",
    "Writing: planning a narrative",
    ["EN2-CWT-01", "EN2-RECOM-01", "EN2-VOCAB-01", "EN2-SPELL-01"],
    {
        "EN2-CWT-01": "Primary. Plans a narrative using a story mountain: characters, setting, opening, build-up, problem, resolution and ending.",
        "EN2-RECOM-01": "Uses understanding of story structure from reading to plan a story.",
        "EN2-VOCAB-01": "Uses words such as opening, build-up, problem, resolution, ending and structure.",
        "EN2-SPELL-01": "Spells words with the vowel teams ai, ay, ee, ea and oa (week 2 spelling focus).",
    },
    "We are learning to plan a story with a story mountain before we write it.",
    [
        "I can name the five parts of a story mountain.",
        "I can say what belongs in each part.",
        "I can choose characters and a setting for my story.",
        "I can plan a problem that is exciting and a resolution that makes sense.",
        "I can put my plan in order so the story flows.",
        "I can spell words with the vowel teams ai, ay, ee, ea and oa.",
    ],
    ["plan", "structure", "opening", "build-up", "problem", "resolution", "ending", "peak"],
    ["This lesson (everything you need is inside it)"],
    "Child knows a story has characters, a setting and a problem to solve (Week 2 Lesson 1).",
    (
        "Why this matters. Writers who start without a plan often get stuck halfway, run out of ideas, or forget to solve the problem. A plan is like a map: it shows where you start, where the story is heading and where it ends. A good plan makes the writing faster, and the finished story is clearer and more exciting.\n\n"
        "The story mountain. A story mountain is a picture of the shape of a story. Stories climb up to an exciting peak and then come down again. It has five parts. The opening introduces the characters and setting. The build-up is the events that lead towards trouble. The problem is the peak of the mountain, the most exciting or worrying moment. The resolution is how the problem is solved. The ending is where everything settles down and we see how the characters feel.\n\n"
        "Where do ideas come from? You never have to wait for inspiration. Start with a character who wants something. Add a place. Then ask 'what could go wrong?' That is your problem. Then ask 'how could they fix it, using their own strengths?' That is your resolution. Look at the stories you read in Lesson 1 and notice where the problem and resolution sit.\n\n"
        "The routine. 1. Choose a character and give them a trait. 2. Choose a setting. 3. Decide what goes wrong, which is your problem. 4. Decide how it is solved. 5. Fill in the five parts of the mountain with short notes, not full sentences. 6. Check that each part leads to the next.\n\n"
        "Planning and writing work together. Next lesson you will use this same planning skill to write the opening and the build-up. The better your plan, the easier the writing will be. Short notes are enough. A plan is for you, so save your best words for the real writing.\n\n"
        "A quick demonstration. Character: Priya, brave. Setting: a windy hill. Problem: her kite is stuck at the top of a tall tree. That is the peak. Resolution: she throws a stone with a string over a branch. The opening and build-up are what you write before that peak, and the ending is what comes after."
    ),
    [
        _step(
            "1", "Why plan?",
            "A plan helps you know where your story is heading before you start writing. It stops you getting stuck and helps you keep the story in order. Planners use short notes, not full sentences.\n\n"
            "Think of a plan as a map for the journey of your story.",
            "Without a plan: 'Once there was a kite and then... um...'. With a plan: you already know the kite will get stuck and how it will be saved.",
            "A plan is a map for your story, written in short notes.",
            ("What does a plan help a writer do?", ["Know where the story is going", "Write more slowly", "Skip the ending"], 0, "A plan shows where the story starts, builds and ends."),
        ),
        _step(
            "2", "The five parts of the mountain",
            "A story mountain has five parts. Opening: meet the characters and setting. Build-up: events that lead to trouble. Problem: the peak, the most exciting moment. Resolution: how the problem is solved. Ending: how it all settles down.\n\n"
            "Remember the order: Opening, Build-up, Problem, Resolution, Ending.",
            "The Lost Kite: Opening (fly the kite), Build-up (string snaps), Problem (stuck in the tree), Resolution (stone and string), Ending (walk home).",
            "Opening, Build-up, Problem, Resolution, Ending.",
            ("Which part is the peak of the mountain?", ["Opening", "Problem", "Ending"], 1, "The problem is the exciting peak."),
        ),
        _step(
            "3", "Characters and setting",
            "Choose your main character and give them a trait, such as brave, curious or clumsy. Then choose a setting: where and when the story happens. Use the setting to add mood, such as a stormy night or a sunny beach.\n\n"
            "A character's trait can also help solve the problem.",
            "Priya is thoughtful, so she thinks of the stone and string. Sam is careful, so he holds the string steady.",
            "Choose a character with a trait, and a setting with a mood.",
            ("Which is a trait?", ["A windy hill", "Thoughtful", "A red kite"], 1, "A trait describes what a character is like."),
        ),
        _step(
            "4", "Make a problem that matters",
            "The problem is the heart of the story. Ask: what does my character want, and what stops them? A good problem is exciting but possible to solve, and it should be connected to the setting and the character.\n\n"
            "Try the question 'what could go wrong?'",
            "Priya wants to fly the kite. What could go wrong? It gets stuck in a tall tree, and a storm is coming.",
            "Ask what the character wants and what stops them.",
            ("A good problem is...", ["Exciting but solvable", "Impossible to solve", "Not connected to the story"], 0, "A good problem is exciting and can be solved."),
        ),
        _step(
            "5", "Plan a resolution that makes sense",
            "The resolution is how the character solves the problem. It should use something the reader already knows about the character or setting, so it feels fair. Avoid sudden magic or luck.\n\n"
            "Then plan the ending: how does the character feel, and what do they learn?",
            "The ball of string was mentioned in the build-up, so the resolution feels earned. In the ending they learn to tie a stronger knot.",
            "The resolution should use the character or setting, not sudden luck.",
            ("A fair resolution is one that...", ["Appears from nowhere", "Uses things the reader already knows", "Ignores the problem"], 1, "A fair resolution uses clues the reader already has."),
        ),
        _step(
            "6", "Spelling focus: vowel teams",
            "This week's spelling focus is vowel teams. The words for this lesson are wait (ai), play (ay), three (ee), peak (ea), road (oa) and speed (ee).\n\n"
            "Hint: 'ay' comes at the end of a word, and 'ai' is in the middle. Look for peak in the story mountain.",
            "w-ai-t, pl-ay, thr-ee, p-ea-k, r-oa-d, sp-ee-d.",
            "Spot the vowel team and spell it as one sound.",
            ("Which vowel team is in 'road'?", ["ea", "oa", "ai"], 1, "road has the vowel team oa."),
        ),
        _step(
            "7", "Check your plan",
            "Read your plan from top to bottom. Does each part lead to the next? Is the problem clear? Does the resolution solve it? Is there an ending that shows how the character feels? Fix any gaps now, because it is much easier to change a plan than a whole story.\n\n"
            "Then you are ready to write.",
            "If the plan says the kite is stuck, but the resolution never mentions the kite, the plan has a gap. Add a line that frees the kite.",
            "Check each part leads to the next before you write.",
            ("Why check a plan before writing?", ["It is easier to fix a plan than a story", "To make it longer", "There is no reason"], 0, "Fixing a plan is quicker than fixing a whole story."),
        ),
    ],
    (
        "Plan a story together using the three starters: a lighthouse, a missing key, and a thunderstorm. Choose a character: Ava, curious. Setting: a stormy night at an old lighthouse. "
        "Problem (the peak): the lighthouse key is missing and a ship is out at sea. Opening: Ava visits her uncle, the lighthouse keeper, as the storm begins. Build-up: the lights flicker, the door to the lamp room is locked, and the key is not on its hook. "
        "Resolution: Ava remembers seeing her uncle's cat playing with something shiny under the stairs. She finds the key and unlocks the lamp. Ending: the beam shines out, the ship turns safely away, and Ava smiles as the storm fades. "
        "Check the plan: does each part lead to the next? Yes. Is the resolution fair? Yes, because the cat and the shiny object were mentioned earlier in the build-up. Now try your own with a different character, setting and problem."
    ),
    (
        "Type your answers in the practice boxes.\n"
        "Part A, order: type the five parts of the story mountain in the correct order.\n"
        "Part B, study the model: read the model plan in the main task and type what the problem is and how it is solved.\n"
        "Part C, build a plan: use the starters 'a lost map', 'a desert' and 'a camel' to type a character with a trait, a setting and a problem.\n"
        "Part D, vowel teams: type the vowel team in each word: wait, play, three, peak, road, speed.\n"
        "Your parent can check your answers against the answer key."
    ),
    (
        "Study the model plan, then plan your own story. Everything you write goes in the boxes.\n\n" + PASSAGE + "\n\n"
        "Stage 1 (choose): pick one starter set, either 'a robot, a garden, a secret' or 'a dragon, a school, a lost shoe'. Type your character with a trait, and your setting.\n"
        "Stage 2 (problem): type the problem, the most exciting moment of your story.\n"
        "Stage 3 (mountain): type short notes for each of the five parts: opening, build-up, problem, resolution, ending.\n"
        "Stage 4 (check): type whether each part leads to the next, and one thing you changed to make the plan better.\n"
        "Stage 5 (spell): type your six spelling words and underline the vowel team in each."
    ),
    "Which part of the story mountain do you find hardest to plan, and what will you do to make it easier?",
    "Did I name the five parts, choose a character and setting, plan a clear problem and a fair resolution, check my plan, and spell my six words with their vowel teams?",
    [
        _q("What is a story mountain?", ["A picture of the shape of a story", "A real mountain", "A kind of poem", "A spelling list"], 0, "It is a picture of the shape of a story."),
        _q("How many parts does the story mountain here have?", ["3", "4", "6", "5"], 3, "It has five parts."),
        _q("Which part comes first?", ["Problem", "Ending", "Opening", "Resolution"], 2, "The opening comes first."),
        _q("Which part is the peak of the mountain?", ["Problem", "Opening", "Ending", "Build-up"], 0, "The problem is the exciting peak."),
        _q("What happens in the resolution?", ["We meet the characters", "The problem is solved", "The title is chosen", "The weather changes"], 1, "The resolution solves the problem."),
        _q("In the model plan, what is the problem?", ["The kite is red", "The hill is windy", "The kite is stuck at the top of a tree", "Sam is a boy"], 2, "The kite is stuck in a tall tree."),
        _q("How does Priya solve the problem?", ["By climbing the tree", "By ties a string to a stone and throwing it over a branch", "By calling for help", "By buying a new kite"], 1, "She uses a stone and string to pull the kite free."),
        _q("Which is a good way to write a plan?", ["Short notes", "Full paragraphs", "A finished story", "One word only"], 0, "Plans use short notes."),
        _q("Which word has the vowel team ea?", ["road", "wait", "peak", "play"], 2, "peak has ea."),
        _q("Which word has the vowel team ay?", ["play", "wait", "three", "road"], 0, "play has ay at the end."),
    ],
    "Type your answers in the practice boxes and submit them.",
    "Extension: take a story you love and sort its events onto the five parts of a story mountain. Type your notes.",
    [
        ("plan", "Notes that show what will happen in a story before you write it"),
        ("structure", "The order in which the parts of a text are arranged"),
        ("opening", "The first part of a story, where we meet the characters and setting"),
        ("build-up", "The events that lead towards the problem"),
        ("problem", "The peak of the story, where the trouble happens"),
        ("resolution", "How the problem is solved"),
        ("ending", "The last part of a story, where everything settles down"),
        ("peak", "The highest, most exciting point"),
    ],
    [
        _video("Writing a story with a beginning, middle and end (tutorial for kids)", "cYqmNO6gr2Y",
               "Watch how the video builds a story from an idea, a setting and characters into a beginning, a middle and an ending.",
               "Choose one idea from the video and use it as a starter for your own story plan.",
               ("What does a story need to work?", ["Only a title", "A beginning, a middle and an end", "Just one character"], 1, "A story needs a beginning, a middle and an end that fit together.")),
    ],
    _sort(
        "Which part of the mountain?",
        "Sort each event from 'The Lost Kite' into the part of the story mountain it belongs to.",
        ["Opening", "Build-up", "Problem", "Resolution", "Ending"],
        [
            ("Priya and Sam fly a red kite on a windy hill", 0),
            ("A gust snaps the string", 1),
            ("The kite sails over the river into the forest", 1),
            ("The kite is stuck at the top of a tall tree", 2),
            ("Sam is too scared to climb", 2),
            ("Priya throws a stone tied to string over a branch", 3),
            ("They pull gently until the kite floats down", 3),
            ("They walk home and promise to tie a stronger knot", 4),
        ],
    ),
    [
        _wc("Which part comes after the build-up?", ["Problem", "Ending", "Opening"], 0, "The problem comes after the build-up."),
        _wc("Which vowel team is in 'wait'?", ["ai", "ay", "ea"], 0, "wait has ai in the middle."),
        _wc("Which is the correct spelling?", ["plai", "play", "pley"], 1, "play ends with ay."),
        _wc("Which is the correct spelling?", ["thre", "three", "threa"], 1, "three has ee."),
        _wc("Which is the correct spelling?", ["peek", "peak", "peke"], 1, "the peak of the mountain has ea."),
        _wc("Which is the correct spelling?", ["rode", "roed", "road"], 2, "road has oa."),
        _wc("Which is the correct spelling?", ["sped", "speed", "spead"], 1, "speed has ee."),
        _wc("What part shows how the problem is solved?", ["Resolution", "Opening", "Build-up"], 0, "The resolution solves the problem."),
    ],
    [
        {"key": "partA", "label": "Part A: the five parts in order", "hint": "Type the five parts of the story mountain in order."},
        {"key": "partB", "label": "Part B: study the model", "hint": "What is the problem in The Lost Kite and how is it solved?"},
        {"key": "partC", "label": "Part C: build a plan", "hint": "Use a lost map, a desert and a camel to type a character with a trait, a setting and a problem."},
        {"key": "partD", "label": "Part D: vowel teams", "hint": "Type the vowel team in: wait, play, three, peak, road, speed."},
        {"key": "character", "label": "My character and setting", "hint": "Type your character with a trait, and your setting."},
        {"key": "problem", "label": "My problem", "hint": "What is the most exciting moment of your story?"},
        {"key": "mountain", "label": "My story mountain", "hint": "Short notes for opening, build-up, problem, resolution and ending."},
        {"key": "check", "label": "My check", "hint": "Does each part lead to the next? What did you change?"},
        {"key": "spelling", "label": "Spelling words", "hint": "Type your six spelling words and mark the vowel team in each."},
    ],
    [
        "Writing the whole story instead of short notes",
        "Starting the story with the problem instead of the opening",
        "A resolution that uses sudden luck or magic",
        "A problem that is too small to be exciting",
        "Spelling the vowel team the wrong way round, such as ia for ai",
    ],
    [
        "Plan a second story using a different set of starters.",
        "Explain your story mountain to a family member and see if they can guess the ending.",
    ],
    (
        "Part A: Opening, Build-up, Problem, Resolution, Ending. "
        "Part B: the problem is that the kite is stuck at the top of a tall tree while dark clouds roll in. It is solved when Priya ties a ball of string to a stone, throws it over a branch and they pull gently until the kite floats down. "
        "Part C: accept any character with a trait, a setting and a problem connected to a lost map, a desert and a camel. "
        "Part D: wait (ai), play (ay), three (ee), peak (ea), road (oa), speed (ee). "
        "Main task: accept any character with a trait, a setting, a clear problem and five parts in the correct order. The resolution should solve the problem fairly using something established earlier. The check should be honest and show at least one change. "
        "Quiz answers in order: A picture of the shape of a story; 5; Opening; Problem; The problem is solved; The kite is stuck at the top of a tall tree; By tying a string to a stone and throwing it over a branch; Short notes; peak; play."
    ),
)

LESSON["spelling"] = {
    "focus": "Vowel teams ai, ay, ee, ea, oa",
    "teaching": (
        "A vowel team is two vowels that work together to make one sound. Say the word and listen for the long vowel.\n\n"
        "The sound ay is at the end of a word, as in play. The sound ai is in the middle, as in wait. The teams ee and ea both make the long e sound, as in speed and peak, so learn each word by sight too."
    ),
    "words": [
        _w("wait", "w-ai-t", "the vowel team ai is in the middle"),
        _w("play", "p-l-ay", "the vowel team ay is at the end"),
        _w("three", "th-r-ee", "the vowel team ee makes the long e sound"),
        _w("peak", "p-ea-k", "the vowel team ea makes the long e sound"),
        _w("road", "r-oa-d", "the vowel team oa makes the long o sound"),
        _w("speed", "s-p-ee-d", "the vowel team ee makes the long e sound"),
    ],
    "check": [
        _c("Which vowel team is in 'peak'?", ["ee", "ea", "ai"], 1, "peak has ea."),
        _c("Which is the correct spelling?", ["wate", "wait", "wayt"], 1, "wait has ai in the middle."),
    ],
}
LESSON.setdefault("learning_area", "English")
LESSON["spelling_focus"] = "Vowel teams ai, ay, ee, ea, oa"
LESSON["hoard_words"] = list(WORDS)
