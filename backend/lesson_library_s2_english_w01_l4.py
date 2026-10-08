"""Stage 2 English, Week 1 Lesson 4: Storytelling Aloud and Joined Handwriting (Oral language and handwriting).
Built to the standard in docs/LESSON_BUILD_GUIDE.md. Typed work goes in the practice boxes.
The spoken task and the handwriting task are done aloud and on paper, then the child types a short self check.
Spelling is attached here so the lesson is self-contained.
Video ID AuneXk40dnc (storytelling with voice, gestures and facial expression) was found by search. Re-check it in the planned video and link run.
"""
from lesson_library_s2_english_w1_w2 import build, _q, _step, _sort, _wc, _video
from spelling_s2_w1 import _w, _c

WORDS = ["audience", "volume", "describe", "beginning", "gesture", "finally"]

PASSAGE = (
    "The Lighthouse Cat\n\n"
    "At the edge of a stormy bay stood a tall white lighthouse. A small grey cat named Pepper lived at the bottom of the stairs. "
    "One night the great lamp went out, and a fishing boat drifted towards the rocks. Pepper raced up all two hundred steps. "
    "She knocked the dusty switch with her paw and the light blazed across the water. The boat turned safely away, and Pepper curled up by the lamp, warm and proud."
)

LESSON = build(
    "s2-eng-w01-l4-storytelling-handwriting",
    "Storytelling Aloud and Joined Handwriting",
    "A great story is not only written. It is told. Learn how storytellers use their voice, face and hands to keep an audience listening, then practise the smooth joined handwriting that makes your written stories easy to read.",
    "Oral language and handwriting",
    ["EN2-OLC-01", "EN2-HANDW-01", "EN2-VOCAB-01", "EN2-SPELL-01"],
    {
        "EN2-OLC-01": "Primary. Retells a story aloud with a clear beginning, middle and end, using volume, pace, pause, face and gesture for an audience.",
        "EN2-HANDW-01": "Forms and joins letters with correct slope, size and spacing in a short piece of handwriting.",
        "EN2-VOCAB-01": "Uses words such as audience, volume, pace, gesture and describe to talk about speaking.",
        "EN2-SPELL-01": "Uses syllables to spell long storytelling words (week 1 focus: strategies and syllables).",
    },
    "We are learning to tell a story aloud so an audience enjoys it, and to join our letters smoothly when we write.",
    [
        "I can tell a story with a clear beginning, middle and end.",
        "I can change my volume, pace and tone to suit the story.",
        "I can use my face and hands to show what is happening.",
        "I can look at my audience while I speak.",
        "I can join my letters with the right slope, size and spacing.",
        "I can check my own storytelling and handwriting and say what to improve.",
    ],
    ["audience", "volume", "pace", "pause", "gesture", "expression", "slope", "joined"],
    ["This lesson (everything you need is inside it)", "A pencil and lined paper for the handwriting task", "A family member to listen to your story"],
    "Child can retell a simple story in order and can write letters with a pencil.",
    (
        "Why this matters. Stories began long before books. People told them aloud around fires, and a good storyteller can make a room go silent. Speaking well helps you share ideas, explain your thinking and feel confident in front of others. Joined handwriting matters for a different reason: it is faster, tidier and easier to read, so your ideas reach your reader without effort.\n\n"
        "The parts of a spoken story. A story needs three parts. The beginning introduces the character and the place. The middle brings a problem and the events that try to solve it. The end shows how the problem is solved and how the character feels. An audience is the people who listen, and a storyteller always keeps them in mind.\n\n"
        "The storyteller's toolkit. Your voice has four controls. Volume is how loud or soft you are. Pace is how fast or slow you speak. Tone is how your voice sounds, such as gentle, scary or excited. A pause is a short silence that makes people wait for what comes next. Your face and body help too: a facial expression shows how a character feels, and a gesture is a hand or body movement that shows what is happening, such as stretching your arms wide for 'a giant wave'.\n\n"
        "Where do the clues come from? You never have to guess how to say a line. Look at what is happening. A scary moment can be slow, quiet and tense. An exciting chase can be fast and loud. A sad moment can be soft and slow. Ask 'how does the character feel here?' and let your voice and face answer.\n\n"
        "The routine. 1. Read or think of the story and find the beginning, middle and end. 2. Make a story map with a few key words for each part. 3. Practise aloud with your voice, face and hands. 4. Tell it to your audience and look at them. 5. Ask what went well and what to improve.\n\n"
        "Joined handwriting. Joined letters flow from one to the next without lifting your pencil in the middle of a word. Keep the slope the same, so all your letters lean the same way. Keep the size even, with tall letters tall and short letters short. Leave a small, steady space between words. Sit tall, hold your pencil lightly and move your whole hand along the line.\n\n"
        "Speaking and writing work together. When you tell a story aloud first, your words are ready in your head, and when you write it down they come out in order. Rehearsing a story is one of the best ways to plan it. This is also why this week's spelling words are storyteller words.\n\n"
        "A quick demonstration. Take the sentence 'The wolf crept closer.' Say it fast and loud and it sounds silly. Say it slowly and quietly, lean forward and pause before 'closer'. Now the audience holds their breath. The words are the same. The storytelling is what changed."
    ),
    [
        _step(
            "1", "Every story has a shape",
            "A story has a beginning, a middle and an end. The beginning shows who and where. The middle shows the problem and what happens. The end shows how it is solved and how the character feels.\n\n"
            "If you can say what happens in each part, you can tell the story in order without getting lost.",
            "The Lighthouse Cat. Beginning: Pepper lives at a lighthouse. Middle: the lamp goes out and a boat is in danger. End: Pepper switches it on and the boat is safe.",
            "Beginning, middle and end keep a story in order.",
            ("Which part of a story shows the problem?", ["The end", "The title", "The middle"], 2, "The middle is where the problem and the main events happen."),
        ),
        _step(
            "2", "Use your voice",
            "Your voice has four controls. Volume is how loud or soft. Pace is how fast or slow. Tone is the feeling in your voice. A pause is a moment of silence.\n\n"
            "Match each control to the moment. Go slower and softer for something scary or sad. Go faster and louder for something exciting.",
            "'The lamp went out.' Slow and quiet. 'Pepper raced up the stairs!' Fast and louder. Then a pause before 'the light blazed'.",
            "Change volume, pace and tone to fit the moment.",
            ("Which voice suits a tense, scary moment?", ["Fast and loud", "Slow and quiet", "Mumbling"], 1, "Slow and quiet builds tension."),
        ),
        _step(
            "3", "Use your face and hands",
            "A facial expression shows how a character feels. A gesture is a hand or body movement that shows what is happening. Keep gestures between your shoulders and your waist so they are clear and not wild.\n\n"
            "Practise in a mirror. Wide eyes show surprise. A smile shows pride. Stretching your arms up can show a tall lighthouse.",
            "For 'Pepper raced up two hundred steps' you can pump your arms like running. For 'the light blazed' you can open your hands wide.",
            "Your face and hands help tell the story.",
            ("What is a gesture?", ["A movement that shows what is happening", "A very loud voice", "A kind of story"], 0, "A gesture is a hand or body movement that adds meaning."),
        ),
        _step(
            "4", "Keep your audience with you",
            "Look at your audience, not at the floor or the ceiling. Eye contact makes each listener feel part of the story. Stand or sit tall, speak clearly and do not rush.\n\n"
            "If you forget a part, pause, breathe and look at your story map. A calm pause is better than saying 'um' again and again.",
            "Look at each listener at least once. When Pepper reaches the switch, pause, look up and then say 'and the light blazed'.",
            "Look at your audience and pause when you need to think.",
            ("What should you do if you forget a part?", ["Stop and walk away", "Pause, breathe and check your map", "Say um over and over"], 1, "A calm pause and a look at your map gets you back on track."),
        ),
        _step(
            "5", "Joined handwriting",
            "In joined writing, the letters in a word flow together without lifting your pencil in the middle of the word. Keep the same slope, an even size and steady spaces between words.\n\n"
            "Start each letter on the line, join with a small upward stroke and lift your pencil only at the end of a word.",
            "Join these letters without lifting: 'ai', 'ee', 'ing'. Then join a whole word: 'story'. Lift your pencil at the end, then start 'teller'.",
            "Join letters smoothly and keep the same slope and size.",
            ("When do you lift your pencil in joined writing?", ["After every letter", "At the end of a word", "Never"], 1, "You lift only at the end of a word, or to cross a t or dot an i."),
        ),
        _step(
            "6", "Spelling focus: strategies and syllables",
            "This week's spelling words are storyteller words. Split each into syllables: au-di-ence, vol-ume, de-scribe, be-gin-ning, ges-ture, fi-nal-ly.\n\n"
            "Then find the tricky part: the au in audience, the double n in beginning, and the ture in gesture.",
            "au-di-ence (3). vol-ume (2). de-scribe (2). be-gin-ning (3). ges-ture (2). fi-nal-ly (3).",
            "Say the beats, then find the tricky part.",
            ("How many syllables are in 'beginning'?", ["2", "3", "4"], 1, "be-gin-ning has three beats."),
        ),
        _step(
            "7", "Check and improve",
            "Good storytellers and writers check their work. After you tell your story, ask: did I keep it in order, change my voice, use my face and hands, and look at my audience? After handwriting, ask: is my slope even, my size steady and my spacing neat?\n\n"
            "Pick one thing to improve next time. Small steps make big changes.",
            "'My voice changed well, but I forgot to look at my audience. Next time I will look up at each listener.'",
            "Check your work and choose one thing to improve.",
            ("After a performance, what is a helpful thing to do?", ["Pick one thing to improve", "Forget about it", "Only say what went wrong"], 0, "Choosing one improvement helps you get better."),
        ),
    ],
    (
        "Plan 'The Lighthouse Cat' together. Story map. Beginning: a stormy bay, a tall lighthouse, a small grey cat called Pepper. Middle: the lamp goes out, a boat drifts towards the rocks, Pepper races up two hundred steps. End: she knocks the switch, the light blazes, the boat turns away, Pepper is warm and proud. "
        "Now add the toolkit. Quiet and slow for the stormy bay. A pause after 'the great lamp went out'. Fast and louder for the race up the steps, with pumping arms. A big, open gesture for 'the light blazed'. A soft, happy tone at the end. Look at your audience when you say 'warm and proud'. "
        "Finally, write the first sentence in joined handwriting: 'At the edge of a stormy bay stood a tall white lighthouse.' Keep the slope even and lift your pencil only between words."
    ),
    (
        "Type your answers in the practice boxes. Do the speaking and handwriting away from the screen, then type what you did.\n"
        "Part A, story map: read 'The Lighthouse Cat' in the main task and type a few key words for the beginning, the middle and the end.\n"
        "Part B, voice plan: type how you will use volume, pace, tone and a pause for two moments in the story.\n"
        "Part C, face and hands: type one facial expression and one gesture you will use, and where.\n"
        "Part D, handwriting: write 'At the edge of a stormy bay stood a tall white lighthouse.' on lined paper in joined handwriting. Type one thing you did well and one thing to improve.\n"
        "Your parent can check your answers against the answer key."
    ),
    (
        "Read this story, then become the storyteller. Do the speaking and handwriting away from the screen, then type your answers in the boxes.\n\n" + PASSAGE + "\n\n"
        "Stage 1 (map): type your story map with key words for the beginning, middle and end.\n"
        "Stage 2 (plan): type where you will change your volume, pace and tone, and where you will pause.\n"
        "Stage 3 (perform): tell the story aloud to a family member, without reading it, using your voice, face and hands. Look at your audience.\n"
        "Stage 4 (handwriting): copy the last sentence of the story in joined handwriting on paper. Type how it looked.\n"
        "Stage 5 (spell): type your six spelling words, split into syllables with hyphens."
    ),
    "What was the hardest part of telling a story aloud, and what will you try next time to make it easier?",
    "Did I make a story map, plan my voice, face and hands, tell the story to an audience, write a sentence in joined handwriting, check my work, and split my six spelling words into syllables?",
    [
        _q("What are the three parts of a story?", ["Title, picture and page", "Beginning, middle and end", "Hook, fact and quote", "Noun, verb and adjective"], 1, "A story has a beginning, a middle and an end."),
        _q("What is volume?", ["How fast you speak", "How loud or soft you are", "How tall you stand", "How long a story is"], 1, "Volume is how loud or soft your voice is."),
        _q("Which voice suits an exciting chase?", ["Slow and quiet", "Mumbling", "Fast and louder", "Whispering"], 2, "A chase is exciting, so go faster and louder."),
        _q("What is a pause?", ["A short silence", "A loud voice", "A gesture", "A type of story"], 0, "A pause is a moment of silence that builds interest."),
        _q("What is an audience?", ["The storyteller", "A microphone", "A story map", "The people who listen"], 3, "The audience is the people who listen."),
        _q("Where should you look when you tell a story?", ["At your audience", "At the floor", "At the ceiling", "At your shoes"], 0, "Eye contact keeps the audience with you."),
        _q("In joined handwriting, when do you lift your pencil?", ["After every letter", "In the middle of a word", "At the end of a word", "Never"], 2, "You lift at the end of a word."),
        _q("What should stay the same in neat handwriting?", ["The colour", "The slope", "The paper", "The pencil"], 1, "An even slope makes writing neat."),
        _q("How many syllables are in 'audience'?", ["3", "2", "4", "1"], 0, "au-di-ence."),
        _q("What is a gesture?", ["A hand or body movement that shows meaning", "A very loud voice", "A silent letter", "A long word"], 0, "A gesture is a movement that adds meaning."),
    ],
    "Type your answers in the practice boxes and submit them. Your parent can confirm that you told the story aloud and wrote your sentence on paper.",
    "Extension: tell a different story to a younger child or a pet, with a voice change for each character. Then type what changed in your voice for each one.",
    [
        ("audience", "The people who listen to a story or speech"),
        ("volume", "How loud or soft your voice is"),
        ("pace", "How fast or slow you speak"),
        ("pause", "A short silence while speaking"),
        ("gesture", "A hand or body movement that shows meaning"),
        ("expression", "The look on your face or the feeling in your voice"),
        ("slope", "The lean of your letters, which should stay the same"),
        ("joined", "Letters connected in a flowing line without lifting the pencil"),
    ],
    [
        _video("Storytelling with voice, gestures and facial expression", "AuneXk40dnc",
               "Watch how the storyteller uses her voice, her hands and her face to make a short story more enjoyable.",
               "Choose one moment from the video and describe how the storyteller used her voice or hands to show it.",
               ("What does a storyteller use besides words to make a story enjoyable?", ["Only a loud voice", "Voice, face and gestures", "Nothing else"], 1, "Voice, face and gestures all add meaning.")),
    ],
    _sort(
        "Which tool is it?",
        "Sort each storyteller action into the tool it uses.",
        ["Voice", "Face and body", "Story shape"],
        [
            ("Speaking slowly and quietly for a scary part", 0),
            ("Pausing before the surprise", 0),
            ("Making wide eyes to show surprise", 1),
            ("Stretching your arms wide for a giant wave", 1),
            ("Starting by saying who and where", 2),
            ("Showing how the problem is solved at the end", 2),
            ("Speaking faster and louder in a chase", 0),
            ("Smiling to show a character is proud", 1),
        ],
    ),
    [
        _wc("Which is the audience?", ["The people who listen", "The storyteller", "The story"], 0, "The audience listens."),
        _wc("How many syllables are in 'volume'?", ["1", "3", "2"], 2, "vol-ume."),
        _wc("Which is split correctly?", ["be-gin-ning", "beg-in-ning", "begi-nn-ing"], 0, "be-gin-ning."),
        _wc("Which word has a double n?", ["gesture", "beginning", "audience"], 1, "beginning has a double n."),
        _wc("Which is the correct spelling?", ["discribe", "describe", "descirbe"], 1, "de-scribe."),
        _wc("What does a pause do?", ["Makes people wait for what comes next", "Makes the story shorter", "Hides the ending"], 0, "A pause builds interest."),
        _wc("How many syllables are in 'finally'?", ["3", "2", "4"], 0, "fi-nal-ly."),
        _wc("Which is the correct spelling?", ["gesture", "gesure", "jesture"], 0, "ges-ture."),
    ],
    [
        {"key": "partA", "label": "Part A: story map", "hint": "Type a few key words for the beginning, middle and end of 'The Lighthouse Cat'."},
        {"key": "partB", "label": "Part B: voice plan", "hint": "Type how you will use volume, pace, tone and a pause for two moments."},
        {"key": "partC", "label": "Part C: face and hands", "hint": "Type one facial expression and one gesture you will use, and where."},
        {"key": "partD", "label": "Part D: handwriting check", "hint": "After writing the sentence in joined handwriting on paper, type one thing you did well and one to improve."},
        {"key": "map", "label": "My story map", "hint": "Key words for the beginning, middle and end."},
        {"key": "plan", "label": "My performance plan", "hint": "Where will you change your volume, pace and tone, and where will you pause?"},
        {"key": "perform", "label": "How my performance went", "hint": "Type what went well and what to improve after telling the story aloud."},
        {"key": "handwriting", "label": "My handwriting", "hint": "Type how your joined handwriting looked: slope, size and spacing."},
        {"key": "spelling", "label": "Spelling syllables", "hint": "Type your six spelling words split into syllables with hyphens."},
    ],
    [
        "Speaking too fast, so the audience cannot follow",
        "Reading from the page instead of looking at the audience",
        "Using the same voice for the whole story",
        "Lifting the pencil in the middle of a word when writing joined letters",
        "Letting the slope and size of letters change along the line",
    ],
    [
        "Tell a short story about your day to a family member, using at least three different voices or tones.",
        "Write your name and three storyteller words in joined handwriting and check the slope and spacing.",
    ],
    (
        "Part A: accept any sensible key words, for example Beginning: stormy bay, lighthouse, cat Pepper. Middle: lamp goes out, boat near rocks, Pepper races up steps. End: switch, light blazes, boat safe, Pepper proud. "
        "Part B: accept any voice plan that fits the moment, for example slow and quiet for the lamp going out, fast and louder for the race up the steps. "
        "Part C: accept any suitable expression and gesture, for example wide eyes when the lamp goes out and pumping arms for the race. "
        "Part D: the parent confirms the sentence was written on paper in joined handwriting, and accepts any honest comment from the child. "
        "Main task: accept a map with the three parts in order, a plan that matches voice to moments, an aloud performance confirmed by the audience, a handwriting comment, and six words split into syllables: au-di-ence, vol-ume, de-scribe, be-gin-ning, ges-ture, fi-nal-ly. "
        "Quiz answers in order: Beginning, middle and end; How loud or soft you are; Fast and louder; A short silence; The people who listen; At your audience; At the end of a word; The slope; 3; A hand or body movement that shows meaning."
    ),
)

LESSON["spelling"] = {
    "focus": "Strategies and syllables",
    "teaching": (
        "Say each storyteller word in beats and write one beat at a time. Then pick out the tricky part.\n\n"
        "The tricky part of 'beginning' is the double n. The tricky part of 'audience' is the au at the start. The tricky part of 'gesture' is the ture at the end."
    ),
    "words": [
        _w("audience", "au-di-ence", "three beats, and it starts with au"),
        _w("volume", "vol-ume", "two beats, and it ends with ume"),
        _w("describe", "de-scribe", "two beats, and scribe has a silent e on the end"),
        _w("beginning", "be-gin-ning", "three beats, and it has a double n"),
        _w("gesture", "ges-ture", "two beats, and the ending is spelled ture"),
        _w("finally", "fi-nal-ly", "three beats, and it is final plus ly"),
    ],
    "check": [
        _c("How many syllables are in 'beginning'?", ["2", "4", "3"], 2, "be-gin-ning has three beats."),
        _c("Which is split correctly?", ["au-di-ence", "aud-i-ence", "a-udi-ence"], 0, "au-di-ence."),
    ],
}
LESSON.setdefault("learning_area", "English")
LESSON["spelling_focus"] = "Strategies and syllables"
LESSON["hoard_words"] = list(WORDS)
