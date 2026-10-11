-- Year 3, Week 1, Lesson 3: Spelling strategies: sounds and syllables
--
-- Replaces the coming-soon placeholder row for seed_key 's2-eng-y3-w01-l3' with a
-- full lesson. The placeholder metadata (unit, week, role, subject) is preserved
-- and coming_soon is set to null so the card stops showing as planned.
--
-- Outcomes: EN2-SPELL-01 and EN2-VOCAB-01, wording taken from the NSW English
-- K-10 Syllabus (2022) outcomes page:
--   EN2-SPELL-01 selects, applies and describes appropriate phonological,
--     orthographic and morphological generalisations and strategies when spelling
--     in a range of contexts
--   EN2-VOCAB-01 builds knowledge and use of Tier 1, Tier 2 and Tier 3 vocabulary
--     through interacting, wide reading and writing, and by defining and analysing words
--
-- Ten inline SVG visuals are drawn in the lesson data itself. All are
-- self-contained and stop animating under prefers-reduced-motion.
--
-- The two videos are real YouTube ids found for this lesson (Scratch Garden
-- 9S7DY2lgJlU, Nessy 8NYeMoz9pjI). They have NOT been watched or checked for
-- embedding. Remove them if they do not suit.

UPDATE lessons
SET data = json_patch(data, '{
  "year_level": "Year 3",
  "subject": "English",
  "unit_title": "Narrative: story elements and planning",
  "unit_number": 1,
  "week": 1,
  "week_in_unit": 1,
  "lesson_number": 3,
  "lesson_role": "Language and spelling",
  "spelling_focus": "Sounds and syllables",
  "outcome_codes": [
    "EN2-SPELL-01",
    "EN2-VOCAB-01"
  ],
  "outcome_notes": {
    "EN2-SPELL-01": "selects, applies and describes appropriate phonological, orthographic and morphological generalisations and strategies when spelling in a range of contexts",
    "EN2-VOCAB-01": "builds knowledge and use of Tier 1, Tier 2 and Tier 3 vocabulary through interacting, wide reading and writing, and by defining and analysing words"
  },
  "learning_intention": "We are learning to break words into sounds and syllables so we can spell long words one chunk at a time.",
  "success_criteria": [
    "I can clap a word and count its syllables.",
    "I can explain that every syllable has one vowel sound.",
    "I can chunk a long word into parts that match its beats.",
    "I can stretch a word to hear the sounds inside a chunk.",
    "I can spell words that end with the -le pattern.",
    "I can use the routine: say it, clap it, chunk it, write it, check it."
  ],
  "child_mission": "Become a Beat Breaker. Clap the beats in a word, chunk the word into pieces, then spell each piece one at a time until long words stop looking scary.",
  "duration_minutes": 45,
  "materials": "This lesson (everything you need is inside it). A pencil and your book for the written parts.",
  "prior_knowledge": "Year 2 letter sounds and the idea that words are made of smaller pieces.",
  "key_vocabulary": [
    "syllable",
    "chunk",
    "vowel",
    "beat",
    "sound",
    "stretch"
  ],
  "teach_steps": [
    {
      "icon": "🥁",
      "title": "A syllable is one beat in a word",
      "explain": "Clap your own name with me. Say your name slowly and clap once for every push you can hear. Most names have one, two or three of those pushes, and each push is called a syllable.\n\nA syllable is a word part with one vowel sound in it. You do not need to see the word to find it. Say the word out loud and listen for the beats. Rabbit comes out as rab, then bit: two beats, so two syllables. Cat comes out as one single push, so cat has one syllable.\n\nThis matters because long words are much easier to spell when you break them into beats. Clap the word first, then spell one beat at a time and join the beats together.",
      "example": "Clap the word dog. You hear one push, so dog has one syllable. Clap rabbit: rab (clap), bit (clap). Two pushes, so two syllables.",
      "notice": "A common mistake is clapping once for every letter. Letters are not beats. Cat has three letters but only one beat.",
      "check": {
        "type": "multiple_choice",
        "question": "How many syllables are in the word rabbit?",
        "options": [
          "1",
          "2",
          "3",
          "4"
        ],
        "correct_index": 1,
        "explanation": "Rab-bit has two beats, so it has two syllables."
      },
      "visual": {
        "svg": "<svg viewBox=\"0 0 720 320\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>@keyframes legA{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(26deg)}}@keyframes legB{0%,100%{transform:rotate(26deg)}50%{transform:rotate(-24deg)}}@keyframes armA{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-26deg)}}@keyframes armB{0%,100%{transform:rotate(-26deg)}50%{transform:rotate(22deg)}}@keyframes waveArm{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(-40deg)}}@keyframes wag{0%,100%{transform:rotate(-18deg)}50%{transform:rotate(18deg)}}@keyframes flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.4)}}@keyframes sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}@keyframes drift{0%{transform:translateX(-12px)}100%{transform:translateX(14px)}}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes bite{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.5)}}@keyframes rise{0%{transform:translateY(6px) scale(.6);opacity:0}18%{opacity:1}100%{transform:translateY(-54px) scale(1);opacity:0}}@keyframes fall{0%{transform:translateY(-14px);opacity:0}18%{opacity:1}100%{transform:translateY(26px);opacity:0}}@keyframes pop{0%{transform:scale(.5);opacity:0}55%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}@keyframes blink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}@keyframes ripple{0%,100%{transform:scaleX(1);opacity:.7}50%{transform:scaleX(1.2);opacity:1}}@keyframes float{0%{transform:translate(0,0)}50%{transform:translate(4px,-3px)}100%{transform:translate(-3px,2px)}}@keyframes jump{0%,100%{transform:translateY(0)}30%{transform:translateY(-14px)}}.srays{animation:spin 16.0s linear infinite;transform-box:fill-box;transform-origin:50% 50%}.a1c1{animation:drift 7.0s ease-in-out infinite alternate}.a1tr{animation:sway 2.9s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}.a1kdlL{animation:legA 0.8s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a1kdlR{animation:legB %ss ease-in-out infinite;transform-box:fill-box;transform-origin:50%% 0%%}.a1kdbd{animation:bob 0.8s ease-in-out infinite}.a1kdhd{animation:bob 0.8s ease-in-out infinite}.a1kdey{animation:blink 4.2s linear infinite;transform-box:fill-box;transform-origin:50% 50%}.a1kdaL{animation:armB 1.1199999999999999s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a1kdaR{animation:waveArm 0.8s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%}.a1kdbd{animation:bob 0.8s ease-in-out infinite}.a1drht{animation:bob 0.36s ease-in-out infinite}.a1drr0{animation:pop 1.1s ease-out infinite;animation-delay:0.00s}.a1drr1{animation:pop 1.1s ease-out infinite;animation-delay:0.28s}.a1drr2{animation:pop 1.1s ease-out infinite;animation-delay:0.56s}.a1cll{animation:clapL .42s ease-in-out infinite}.a1clr{animation:clapR .42s ease-in-out infinite}.a1bt0{animation:pop .5s ease-out both;animation-delay:0.50s}.a1bt1{animation:pop .5s ease-out both;animation-delay:0.95s}.sb{font-family:Arial,sans-serif;font-weight:700}@media (prefers-reduced-motion:reduce){.scn *{animation:none !important}animate{display:none}}</style><g class=\"scn\"><defs><linearGradient id=\"gl3s1\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#a9d8ff\"/><stop offset=\"0.62\" stop-color=\"#d8efff\"/><stop offset=\"1\" stop-color=\"#eef9ff\"/></linearGradient></defs><rect width=\"720\" height=\"320\" rx=\"20\" fill=\"url(#gl3s1)\"/><g class=\"srays\"><path d=\"M85.0 44.0 L74.6 50.9 L77.1 63.1 L64.9 60.6 L58.0 71.0 L51.1 60.6 L38.9 63.1 L41.4 50.9 L31.0 44.0 L41.4 37.1 L38.9 24.9 L51.1 27.4 L58.0 17.0 L64.9 27.4 L77.1 24.9 L74.6 37.1 Z\" fill=\"#f7b731\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><circle cx=\"58.0\" cy=\"44.0\" r=\"16.0\" fill=\"#ffd24a\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><g class=\"a1c1\"><circle cx=\"596.0\" cy=\"44.0\" r=\"13.6\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><circle cx=\"611.2\" cy=\"38.4\" r=\"16.8\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><circle cx=\"629.6\" cy=\"44.0\" r=\"12.8\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><rect x=\"584.0\" y=\"41.6\" width=\"60.8\" height=\"14.4\" rx=\"7.2\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.2\"/></g><g class=\"a1tr\"><path d=\"M648.0 214.0 L648.0 183.6\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"12.2\" stroke-linecap=\"round\"/><path d=\"M648.0 214.0 L648.0 183.6\" fill=\"none\" stroke=\"#8a5a33\" stroke-width=\"8.8\" stroke-linecap=\"round\"/><path d=\"M648.0 194.8 Q640.8 186.8 636.0 178.8\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"8.2\" stroke-linecap=\"round\"/><path d=\"M648.0 194.8 Q640.8 186.8 636.0 178.8\" fill=\"none\" stroke=\"#8a5a33\" stroke-width=\"4.8\" stroke-linecap=\"round\"/><path d=\"M648.0 191.6 Q655.2 183.6 660.8 175.6\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"8.2\" stroke-linecap=\"round\"/><path d=\"M648.0 191.6 Q655.2 183.6 660.8 175.6\" fill=\"none\" stroke=\"#8a5a33\" stroke-width=\"4.8\" stroke-linecap=\"round\"/><circle cx=\"648.0\" cy=\"167.6\" r=\"19.2\" fill=\"#3fae52\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><circle cx=\"632.8\" cy=\"175.6\" r=\"13.6\" fill=\"#4cc061\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><circle cx=\"663.2\" cy=\"175.6\" r=\"13.6\" fill=\"#4cc061\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><circle cx=\"648.0\" cy=\"154.8\" r=\"12.8\" fill=\"#4cc061\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><circle cx=\"642.4\" cy=\"158.0\" r=\"4.8\" fill=\"#7fd98a\" stroke=\"#2b2521\" stroke-width=\"0.0\"/></g><rect x=\"0\" y=\"182\" width=\"720\" height=\"138\" rx=\"0\" fill=\"#8fe38f\"/><ellipse cx=\"140.0\" cy=\"253.4\" rx=\"26.4\" ry=\"6.9\" fill=\"#000\" opacity=\"0.12\"/><g class=\"a1kdlL\"><path d=\"M132.5 220.1 L132.5 239.7\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"13.8\" stroke-linecap=\"round\"/><path d=\"M132.5 220.1 L132.5 239.7\" fill=\"none\" stroke=\"#2563eb\" stroke-width=\"10.3\" stroke-linecap=\"round\"/></g><g class=\"a1kdlR\"><path d=\"M147.5 220.1 L147.5 239.7\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"13.8\" stroke-linecap=\"round\"/><path d=\"M147.5 220.1 L147.5 239.7\" fill=\"none\" stroke=\"#2563eb\" stroke-width=\"10.3\" stroke-linecap=\"round\"/></g><rect x=\"125.0\" y=\"238.5\" width=\"19.5\" height=\"11.5\" rx=\"5.8\" fill=\"#334155\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><rect x=\"136.6\" y=\"238.5\" width=\"19.5\" height=\"11.5\" rx=\"5.8\" fill=\"#334155\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><path d=\"M123.9 220.1 L119.3 198.2 Q119.3 190.2 128.5 189.1 L151.5 189.1 Q160.7 190.2 160.7 198.2 L156.1 220.1 Z\" fill=\"#ef5350\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><path d=\"M133.1 189.1 Q140.0 194.8 146.9 189.1\" fill=\"#ef5350\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><g class=\"a1kdaL\"><path d=\"M120.5 195.9 Q114.7 206.3 118.2 215.5\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"10.3\" stroke-linecap=\"round\"/><path d=\"M120.5 195.9 Q114.7 206.3 118.2 215.5\" fill=\"none\" stroke=\"#f6c9a0\" stroke-width=\"6.9\" stroke-linecap=\"round\"/></g><g class=\"a1kdaR\"><path d=\"M159.6 195.9 Q171.1 185.6 169.9 169.5\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"10.3\" stroke-linecap=\"round\"/><path d=\"M159.6 195.9 Q171.1 185.6 169.9 169.5\" fill=\"none\" stroke=\"#f6c9a0\" stroke-width=\"6.9\" stroke-linecap=\"round\"/></g><circle cx=\"118.2\" cy=\"215.5\" r=\"3.9\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"161.8\" cy=\"215.5\" r=\"3.9\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><rect x=\"136.0\" y=\"183.3\" width=\"8.0\" height=\"8.0\" rx=\"3.4\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><circle cx=\"121.0\" cy=\"167.2\" r=\"4.8\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"159.0\" cy=\"167.2\" r=\"4.8\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><g class=\"a1kdhd\"><circle cx=\"140.0\" cy=\"167.2\" r=\"18.4\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><path d=\"M121.6 164.9 Q118.2 144.2 140.0 144.2 Q161.8 144.2 158.4 164.9 Q151.5 158.0 144.6 161.4 Q137.7 158.0 130.8 161.4 Q126.2 158.0 121.6 164.9 Z\" fill=\"#4a3222\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><g class=\"a1kdey\"><ellipse cx=\"133.8\" cy=\"167.2\" rx=\"4.1\" ry=\"4.9\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"133.3\" cy=\"167.8\" r=\"2.3\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"134.8\" cy=\"165.7\" r=\"1.0\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><ellipse cx=\"146.2\" cy=\"167.2\" rx=\"4.1\" ry=\"4.9\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"146.7\" cy=\"167.8\" r=\"2.3\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"145.2\" cy=\"165.7\" r=\"1.0\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/></g><path d=\"M130.8 158.0 q3.4 -2.5 6.9 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><path d=\"M142.3 158.0 q3.4 -2.5 6.9 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><ellipse cx=\"128.5\" cy=\"174.1\" rx=\"4.1\" ry=\"2.8\" fill=\"#f87171\" opacity=\"0.35\"/><ellipse cx=\"151.5\" cy=\"174.1\" rx=\"4.1\" ry=\"2.8\" fill=\"#f87171\" opacity=\"0.35\"/><path d=\"M134.8 176.4 q5.2 5.5 10.3 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><g class=\"a1drht\"><rect x=\"290.0\" y=\"216.0\" width=\"60.0\" height=\"38.0\" rx=\"7.0\" fill=\"#e2603f\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><ellipse cx=\"320.0\" cy=\"216.0\" rx=\"30.0\" ry=\"9.0\" fill=\"#f6e3c0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><path d=\"M294.0 226.0 L346.0 246.0 M294.0 246.0 L346.0 226.0\" stroke=\"#2b2521\" stroke-width=\"2\"/><path d=\"M290.0 198.0 L308.0 212.0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"7.4\" stroke-linecap=\"round\"/><path d=\"M290.0 198.0 L308.0 212.0\" fill=\"none\" stroke=\"#b98a4a\" stroke-width=\"4.0\" stroke-linecap=\"round\"/><path d=\"M350.0 198.0 L332.0 212.0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"7.4\" stroke-linecap=\"round\"/><path d=\"M350.0 198.0 L332.0 212.0\" fill=\"none\" stroke=\"#b98a4a\" stroke-width=\"4.0\" stroke-linecap=\"round\"/></g><circle class=\"a1drr0\" cx=\"320.0\" cy=\"194.0\" r=\"10.0\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"2\"/><circle class=\"a1drr1\" cx=\"320.0\" cy=\"194.0\" r=\"17.0\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"2\"/><circle class=\"a1drr2\" cx=\"320.0\" cy=\"194.0\" r=\"24.0\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"2\"/><g transform=\"translate(510.0,146.0)\"><g class=\"a1cll\"><rect x=\"-22.0\" y=\"-24.0\" width=\"18.0\" height=\"22.0\" rx=\"7.0\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><rect x=\"-22.0\" y=\"-36.0\" width=\"18.0\" height=\"14.0\" rx=\"6.0\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/></g><g class=\"a1clr\"><rect x=\"4.0\" y=\"-24.0\" width=\"18.0\" height=\"22.0\" rx=\"7.0\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><rect x=\"4.0\" y=\"-36.0\" width=\"18.0\" height=\"14.0\" rx=\"6.0\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/></g><path d=\"M-32.0 0 L-18.0 -8.0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"9.4\" stroke-linecap=\"round\"/><path d=\"M-32.0 0 L-18.0 -8.0\" fill=\"none\" stroke=\"#f6c9a0\" stroke-width=\"6.0\" stroke-linecap=\"round\"/><path d=\"M32.0 0 L18.0 -8.0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"9.4\" stroke-linecap=\"round\"/><path d=\"M32.0 0 L18.0 -8.0\" fill=\"none\" stroke=\"#f6c9a0\" stroke-width=\"6.0\" stroke-linecap=\"round\"/></g><g class=\"a1bt0\"><circle cx=\"330.0\" cy=\"118.0\" r=\"15.0\" fill=\"#2563eb\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><text x=\"330.0\" y=\"123.1\" text-anchor=\"middle\" font-size=\"15.0\" font-weight=\"700\" fill=\"#ffffff\">1</text><text x=\"330.0\" y=\"151.0\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#334155\">rab</text></g><g class=\"a1bt1\"><circle cx=\"367.5\" cy=\"118.0\" r=\"15.0\" fill=\"#ea580c\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><text x=\"367.5\" y=\"123.1\" text-anchor=\"middle\" font-size=\"15.0\" font-weight=\"700\" fill=\"#ffffff\">2</text><text x=\"367.5\" y=\"151.0\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#334155\">bit</text></g><text x=\"610\" y=\"146\" text-anchor=\"middle\" font-size=\"17\" font-weight=\"700\" fill=\"#166534\" class=\"sb\">2 beats</text><rect x=\"40\" y=\"272\" width=\"300\" height=\"34\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"190\" y=\"295\" text-anchor=\"middle\" font-size=\"16\" font-weight=\"700\" fill=\"#1f2937\" class=\"sb\">rab-bit: two claps</text><rect x=\"380\" y=\"272\" width=\"300\" height=\"34\" rx=\"14\" fill=\"#fff7e6\" stroke=\"#f59e0b\" stroke-width=\"2.6\"/><text x=\"530\" y=\"295\" text-anchor=\"middle\" font-size=\"16\" font-weight=\"700\" fill=\"#8a3d0f\" class=\"sb\">Each clap is a syllable</text></g></svg>",
        "alt": "Animated cartoon: a girl waves beside a drum that booms while two numbered beat cards labelled rab and bit pop up, with two clapping hands and the caption rab-bit two claps.",
        "caption": "Clap rab-bit with the drum. Two beats means two syllables."
      }
    },
    {
      "icon": "👏",
      "title": "Clap and count the beats",
      "explain": "Clapping is the easiest way to find syllables because your hands keep count for you. Say the word slowly first, then clap once as you say each part.\n\nTry butterfly. Say it slowly: but, ter, fly. Clap three times and you have three syllables. Table comes out as ta, ble: two syllables. Tree comes out as a single push: one syllable. If two beats run together, you are saying the word too quickly. Slow down until you can hear each part clearly.\n\nCounting the beats before you spell tells you how many chunks to expect. That turns a long, scary word into two or three short pieces you already know how to spell.",
      "example": "Clap butterfly: but (clap), ter (clap), fly (clap). Three claps, so three syllables.",
      "notice": "Saying the word too fast squashes the beats together. Say it slowly, then clap, then speed up at the end.",
      "check": {
        "type": "multiple_choice",
        "question": "How many syllables are in the word butterfly?",
        "options": [
          "1",
          "2",
          "3",
          "4"
        ],
        "correct_index": 2,
        "explanation": "But-ter-fly has three beats, so it has three syllables."
      },
      "visual": {
        "svg": "<svg viewBox=\"0 0 720 300\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>@keyframes legA{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(26deg)}}@keyframes legB{0%,100%{transform:rotate(26deg)}50%{transform:rotate(-24deg)}}@keyframes armA{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-26deg)}}@keyframes armB{0%,100%{transform:rotate(-26deg)}50%{transform:rotate(22deg)}}@keyframes waveArm{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(-40deg)}}@keyframes wag{0%,100%{transform:rotate(-18deg)}50%{transform:rotate(18deg)}}@keyframes flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.4)}}@keyframes sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}@keyframes drift{0%{transform:translateX(-12px)}100%{transform:translateX(14px)}}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes bite{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.5)}}@keyframes rise{0%{transform:translateY(6px) scale(.6);opacity:0}18%{opacity:1}100%{transform:translateY(-54px) scale(1);opacity:0}}@keyframes fall{0%{transform:translateY(-14px);opacity:0}18%{opacity:1}100%{transform:translateY(26px);opacity:0}}@keyframes pop{0%{transform:scale(.5);opacity:0}55%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}@keyframes blink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}@keyframes ripple{0%,100%{transform:scaleX(1);opacity:.7}50%{transform:scaleX(1.2);opacity:1}}@keyframes float{0%{transform:translate(0,0)}50%{transform:translate(4px,-3px)}100%{transform:translate(-3px,2px)}}@keyframes jump{0%,100%{transform:translateY(0)}30%{transform:translateY(-14px)}}.a2bfwl{animation:flap .55s ease-in-out infinite;transform-box:fill-box;transform-origin:100% 50%}.a2bfwr{animation:flapR .55s ease-in-out infinite;transform-box:fill-box;transform-origin:0% 50%}.a2bffl{animation:float 2.6s ease-in-out infinite}.a2c2{animation:drift 8.0s ease-in-out infinite alternate}.a2kdlL{animation:legA 0.8s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a2kdlR{animation:legB %ss ease-in-out infinite;transform-box:fill-box;transform-origin:50%% 0%%}.a2kdbd{animation:bob 0.8s ease-in-out infinite}.a2kdhd{animation:bob 0.8s ease-in-out infinite}.a2kdey{animation:blink 4.2s linear infinite;transform-box:fill-box;transform-origin:50% 50%}.a2kdaL{animation:armB 1.1199999999999999s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a2kdaR{animation:waveArm 0.8s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%}.a2kdbd{animation:bob 0.8s ease-in-out infinite}.a2cll{animation:clapL .42s ease-in-out infinite}.a2clr{animation:clapR .42s ease-in-out infinite}.a2b0{animation:pop .5s ease-out both;animation-delay:0.50s}.a2b1{animation:pop .5s ease-out both;animation-delay:0.95s}.a2b2{animation:pop .5s ease-out both;animation-delay:1.40s}.sb{font-family:Arial,sans-serif;font-weight:700}@media (prefers-reduced-motion:reduce){.scn *{animation:none !important}animate{display:none}}</style><g class=\"scn\"><rect x=\"0\" y=\"0\" width=\"720\" height=\"300\" rx=\"20\" fill=\"#eaf5ff\"/><rect x=\"0\" y=\"214\" width=\"720\" height=\"86\" rx=\"0\" fill=\"#8fe38f\"/><g class=\"a2bffl\"><circle cx=\"560.0\" cy=\"93.7\" r=\"5.2\" fill=\"#5b4632\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><g class=\"a2bfwl\"><ellipse cx=\"541.6\" cy=\"82.2\" rx=\"17.2\" ry=\"13.8\" transform=\"rotate(-18 541.6 82.2)\" fill=\"#f08ea8\" stroke=\"#2b2521\" stroke-width=\"2\"/><ellipse cx=\"547.4\" cy=\"100.6\" rx=\"12.6\" ry=\"10.3\" transform=\"rotate(16 547.4 100.6)\" fill=\"#f08ea8\" stroke=\"#2b2521\" stroke-width=\"2\"/><circle cx=\"541.6\" cy=\"82.2\" r=\"3.9\" fill=\"#ffffff\" opacity=\"0.75\"/></g><g class=\"a2bfwr\"><ellipse cx=\"578.4\" cy=\"82.2\" rx=\"17.2\" ry=\"13.8\" transform=\"rotate(18 578.4 82.2)\" fill=\"#f6bf4f\" stroke=\"#2b2521\" stroke-width=\"2\"/><ellipse cx=\"572.6\" cy=\"100.6\" rx=\"12.6\" ry=\"10.3\" transform=\"rotate(-16 572.6 100.6)\" fill=\"#f6bf4f\" stroke=\"#2b2521\" stroke-width=\"2\"/><circle cx=\"578.4\" cy=\"82.2\" r=\"3.9\" fill=\"#ffffff\" opacity=\"0.75\"/></g><path d=\"M560.0 89.1 Q552.0 77.6 547.4 73.0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"5.5\" stroke-linecap=\"round\"/><path d=\"M560.0 89.1 Q552.0 77.6 547.4 73.0\" fill=\"none\" stroke=\"#5b4632\" stroke-width=\"2.1\" stroke-linecap=\"round\"/><path d=\"M560.0 89.1 Q568.0 77.6 572.6 73.0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"5.5\" stroke-linecap=\"round\"/><path d=\"M560.0 89.1 Q568.0 77.6 572.6 73.0\" fill=\"none\" stroke=\"#5b4632\" stroke-width=\"2.1\" stroke-linecap=\"round\"/><circle cx=\"547.4\" cy=\"71.8\" r=\"2.3\" fill=\"#f08ea8\" stroke=\"#2b2521\" stroke-width=\"1.4\"/><circle cx=\"572.6\" cy=\"71.8\" r=\"2.3\" fill=\"#f08ea8\" stroke=\"#2b2521\" stroke-width=\"1.4\"/></g><g class=\"a2c2\"><circle cx=\"600.0\" cy=\"50.0\" r=\"11.9\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><circle cx=\"613.3\" cy=\"45.1\" r=\"14.7\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><circle cx=\"629.4\" cy=\"50.0\" r=\"11.2\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><rect x=\"589.5\" y=\"47.9\" width=\"53.2\" height=\"12.6\" rx=\"6.3\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.2\"/></g><ellipse cx=\"118.0\" cy=\"243.6\" rx=\"27.6\" ry=\"7.2\" fill=\"#000\" opacity=\"0.12\"/><g class=\"a2kdlL\"><path d=\"M110.2 208.8 L110.2 229.2\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"14.2\" stroke-linecap=\"round\"/><path d=\"M110.2 208.8 L110.2 229.2\" fill=\"none\" stroke=\"#2f6bcf\" stroke-width=\"10.8\" stroke-linecap=\"round\"/></g><g class=\"a2kdlR\"><path d=\"M125.8 208.8 L125.8 229.2\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"14.2\" stroke-linecap=\"round\"/><path d=\"M125.8 208.8 L125.8 229.2\" fill=\"none\" stroke=\"#2f6bcf\" stroke-width=\"10.8\" stroke-linecap=\"round\"/></g><rect x=\"102.4\" y=\"228.0\" width=\"20.4\" height=\"12.0\" rx=\"6.0\" fill=\"#334155\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><rect x=\"114.4\" y=\"228.0\" width=\"20.4\" height=\"12.0\" rx=\"6.0\" fill=\"#334155\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><path d=\"M101.2 208.8 L96.4 186.0 Q96.4 177.6 106.0 176.4 L130.0 176.4 Q139.6 177.6 139.6 186.0 L134.8 208.8 Z\" fill=\"#f472b6\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><path d=\"M110.8 176.4 Q118.0 182.4 125.2 176.4\" fill=\"#f472b6\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><g class=\"a2kdaL\"><path d=\"M97.6 183.6 Q91.6 194.4 95.2 204.0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"10.6\" stroke-linecap=\"round\"/><path d=\"M97.6 183.6 Q91.6 194.4 95.2 204.0\" fill=\"none\" stroke=\"#f6c9a0\" stroke-width=\"7.2\" stroke-linecap=\"round\"/></g><g class=\"a2kdaR\"><path d=\"M138.4 183.6 Q150.4 172.8 149.2 156.0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"10.6\" stroke-linecap=\"round\"/><path d=\"M138.4 183.6 Q150.4 172.8 149.2 156.0\" fill=\"none\" stroke=\"#f6c9a0\" stroke-width=\"7.2\" stroke-linecap=\"round\"/></g><circle cx=\"95.2\" cy=\"204.0\" r=\"4.1\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"140.8\" cy=\"204.0\" r=\"4.1\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><rect x=\"113.8\" y=\"170.4\" width=\"8.4\" height=\"8.4\" rx=\"3.6\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><circle cx=\"98.2\" cy=\"153.6\" r=\"5.0\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"137.8\" cy=\"153.6\" r=\"5.0\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><g class=\"a2kdhd\"><circle cx=\"118.0\" cy=\"153.6\" r=\"19.2\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><path d=\"M98.8 151.2 Q95.2 129.6 118.0 129.6 Q140.8 129.6 137.2 151.2 Q130.0 144.0 122.8 147.6 Q115.6 144.0 108.4 147.6 Q103.6 144.0 98.8 151.2 Z\" fill=\"#4a3222\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><g class=\"a2kdey\"><ellipse cx=\"111.5\" cy=\"153.6\" rx=\"4.3\" ry=\"5.2\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"111.0\" cy=\"154.2\" r=\"2.4\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"112.6\" cy=\"152.0\" r=\"1.0\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><ellipse cx=\"124.5\" cy=\"153.6\" rx=\"4.3\" ry=\"5.2\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"125.0\" cy=\"154.2\" r=\"2.4\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"123.4\" cy=\"152.0\" r=\"1.0\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/></g><path d=\"M108.4 144.0 q3.6 -2.6 7.2 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><path d=\"M120.4 144.0 q3.6 -2.6 7.2 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><ellipse cx=\"106.0\" cy=\"160.8\" rx=\"4.3\" ry=\"2.9\" fill=\"#f87171\" opacity=\"0.35\"/><ellipse cx=\"130.0\" cy=\"160.8\" rx=\"4.3\" ry=\"2.9\" fill=\"#f87171\" opacity=\"0.35\"/><path d=\"M112.6 163.2 q5.4 5.8 10.8 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><g transform=\"translate(252.0,132.0)\"><g class=\"a2cll\"><rect x=\"-22.0\" y=\"-24.0\" width=\"18.0\" height=\"22.0\" rx=\"7.0\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><rect x=\"-22.0\" y=\"-36.0\" width=\"18.0\" height=\"14.0\" rx=\"6.0\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/></g><g class=\"a2clr\"><rect x=\"4.0\" y=\"-24.0\" width=\"18.0\" height=\"22.0\" rx=\"7.0\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><rect x=\"4.0\" y=\"-36.0\" width=\"18.0\" height=\"14.0\" rx=\"6.0\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/></g><path d=\"M-32.0 0 L-18.0 -8.0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"9.4\" stroke-linecap=\"round\"/><path d=\"M-32.0 0 L-18.0 -8.0\" fill=\"none\" stroke=\"#f6c9a0\" stroke-width=\"6.0\" stroke-linecap=\"round\"/><path d=\"M32.0 0 L18.0 -8.0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"9.4\" stroke-linecap=\"round\"/><path d=\"M32.0 0 L18.0 -8.0\" fill=\"none\" stroke=\"#f6c9a0\" stroke-width=\"6.0\" stroke-linecap=\"round\"/></g><g class=\"a2b0\"><circle cx=\"330.0\" cy=\"118.0\" r=\"16.0\" fill=\"#2563eb\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><text x=\"330.0\" y=\"123.4\" text-anchor=\"middle\" font-size=\"16.0\" font-weight=\"700\" fill=\"#ffffff\">1</text><text x=\"330.0\" y=\"152.0\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#334155\">but</text></g><g class=\"a2b1\"><circle cx=\"370.0\" cy=\"118.0\" r=\"16.0\" fill=\"#ea580c\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><text x=\"370.0\" y=\"123.4\" text-anchor=\"middle\" font-size=\"16.0\" font-weight=\"700\" fill=\"#ffffff\">2</text><text x=\"370.0\" y=\"152.0\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#334155\">ter</text></g><g class=\"a2b2\"><circle cx=\"410.0\" cy=\"118.0\" r=\"16.0\" fill=\"#7c3aed\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><text x=\"410.0\" y=\"123.4\" text-anchor=\"middle\" font-size=\"16.0\" font-weight=\"700\" fill=\"#ffffff\">3</text><text x=\"410.0\" y=\"152.0\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#334155\">fly</text></g><rect x=\"40\" y=\"250\" width=\"250\" height=\"38\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"165\" y=\"275\" text-anchor=\"middle\" font-size=\"18\" font-weight=\"700\" fill=\"#1f2937\" class=\"sb\">but-ter-fly</text><rect x=\"310\" y=\"250\" width=\"370\" height=\"38\" rx=\"14\" fill=\"#dbeafe\" stroke=\"#3b82f6\" stroke-width=\"2.6\"/><text x=\"495\" y=\"275\" text-anchor=\"middle\" font-size=\"17\" font-weight=\"700\" fill=\"#17428f\" class=\"sb\">3 claps = 3 syllables</text></g></svg>",
        "alt": "Animated cartoon: a girl claps while three numbered beat cards labelled but, ter and fly appear one after another and a butterfly flutters above the grass.",
        "caption": "Watch the beats appear as the child claps but-ter-fly."
      }
    },
    {
      "icon": "🔤",
      "title": "Every syllable has one vowel sound",
      "explain": "The five vowel letters are a, e, i, o and u. Every syllable you say has exactly one vowel sound in it. That is the quiet rule that holds syllables together.\n\nIn cat, the vowel sound is a, so cat has one syllable. In rain the letters ai work as one vowel sound, so rain also has one syllable even though it has two vowel letters. In kitten, the i and the e each make a vowel sound, so kitten has two syllables.\n\nUse this as a test when you chunk a long word. If a chunk has no vowel sound in it, that chunk is not a syllable, and your chunks need to move. This is the check that catches most chunking mistakes.",
      "example": "Boat has two vowel letters, o and a, but they make one vowel sound, so boat has one syllable.",
      "notice": "Do not count vowel letters. Count vowel sounds. Rain looks like two vowels but it is one beat.",
      "check": {
        "type": "multiple_choice",
        "question": "How many vowel sounds can you hear in the word boat?",
        "options": [
          "1",
          "2",
          "3",
          "4"
        ],
        "correct_index": 0,
        "explanation": "The letters oa make one vowel sound, so boat has one syllable."
      },
      "visual": {
        "svg": "<svg viewBox=\"0 0 720 344\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>@keyframes legA{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(26deg)}}@keyframes legB{0%,100%{transform:rotate(26deg)}50%{transform:rotate(-24deg)}}@keyframes armA{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-26deg)}}@keyframes armB{0%,100%{transform:rotate(-26deg)}50%{transform:rotate(22deg)}}@keyframes waveArm{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(-40deg)}}@keyframes wag{0%,100%{transform:rotate(-18deg)}50%{transform:rotate(18deg)}}@keyframes flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.4)}}@keyframes sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}@keyframes drift{0%{transform:translateX(-12px)}100%{transform:translateX(14px)}}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes bite{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.5)}}@keyframes rise{0%{transform:translateY(6px) scale(.6);opacity:0}18%{opacity:1}100%{transform:translateY(-54px) scale(1);opacity:0}}@keyframes fall{0%{transform:translateY(-14px);opacity:0}18%{opacity:1}100%{transform:translateY(26px);opacity:0}}@keyframes pop{0%{transform:scale(.5);opacity:0}55%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}@keyframes blink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}@keyframes ripple{0%,100%{transform:scaleX(1);opacity:.7}50%{transform:scaleX(1.2);opacity:1}}@keyframes float{0%{transform:translate(0,0)}50%{transform:translate(4px,-3px)}100%{transform:translate(-3px,2px)}}@keyframes jump{0%,100%{transform:translateY(0)}30%{transform:translateY(-14px)}}.sb{font-family:Arial,sans-serif;font-weight:700}.st{font-family:Arial,sans-serif}@media (prefers-reduced-motion:reduce){.scn *{animation:none !important}animate{display:none}}</style><g class=\"scn\"><rect x=\"0\" y=\"0\" width=\"720\" height=\"330\" rx=\"20\" fill=\"#fff8ee\"/><rect x=\"60\" y=\"34\" width=\"180\" height=\"54\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"150\" y=\"70\" text-anchor=\"middle\" font-size=\"22\" font-weight=\"700\" fill=\"#1f2937\" class=\"sb\">cat</text><rect x=\"258\" y=\"34\" width=\"150\" height=\"54\" rx=\"14\" fill=\"#fff1c9\" stroke=\"#f59e0b\" stroke-width=\"2.6\"/><text x=\"333\" y=\"68\" text-anchor=\"middle\" font-size=\"17\" font-weight=\"700\" fill=\"#8a3d0f\" class=\"sb\">vowel: a</text><circle cx=\"452\" cy=\"62\" r=\"15\" fill=\"#ef5350\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><text x=\"452\" y=\"68\" text-anchor=\"middle\" font-size=\"16\" font-weight=\"700\" fill=\"#ffffff\" class=\"sb\">1</text><text x=\"504\" y=\"68\" text-anchor=\"start\" font-size=\"17\" font-weight=\"700\" fill=\"#334155\" class=\"st\">1 beat</text><rect x=\"60\" y=\"104\" width=\"180\" height=\"54\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"150\" y=\"140\" text-anchor=\"middle\" font-size=\"22\" font-weight=\"700\" fill=\"#1f2937\" class=\"sb\">rain</text><rect x=\"258\" y=\"104\" width=\"150\" height=\"54\" rx=\"14\" fill=\"#fff1c9\" stroke=\"#f59e0b\" stroke-width=\"2.6\"/><text x=\"333\" y=\"138\" text-anchor=\"middle\" font-size=\"17\" font-weight=\"700\" fill=\"#8a3d0f\" class=\"sb\">vowel: ai</text><circle cx=\"452\" cy=\"132\" r=\"15\" fill=\"#3b82f6\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><text x=\"452\" y=\"138\" text-anchor=\"middle\" font-size=\"16\" font-weight=\"700\" fill=\"#ffffff\" class=\"sb\">1</text><text x=\"504\" y=\"138\" text-anchor=\"start\" font-size=\"17\" font-weight=\"700\" fill=\"#334155\" class=\"st\">1 beat</text><rect x=\"60\" y=\"174\" width=\"180\" height=\"54\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"150\" y=\"210\" text-anchor=\"middle\" font-size=\"22\" font-weight=\"700\" fill=\"#1f2937\" class=\"sb\">boat</text><rect x=\"258\" y=\"174\" width=\"150\" height=\"54\" rx=\"14\" fill=\"#fff1c9\" stroke=\"#f59e0b\" stroke-width=\"2.6\"/><text x=\"333\" y=\"208\" text-anchor=\"middle\" font-size=\"17\" font-weight=\"700\" fill=\"#8a3d0f\" class=\"sb\">vowel: oa</text><circle cx=\"452\" cy=\"202\" r=\"15\" fill=\"#f59e0b\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><text x=\"452\" y=\"208\" text-anchor=\"middle\" font-size=\"16\" font-weight=\"700\" fill=\"#ffffff\" class=\"sb\">1</text><text x=\"504\" y=\"208\" text-anchor=\"start\" font-size=\"17\" font-weight=\"700\" fill=\"#334155\" class=\"st\">1 beat</text><rect x=\"60\" y=\"244\" width=\"180\" height=\"54\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"150\" y=\"280\" text-anchor=\"middle\" font-size=\"22\" font-weight=\"700\" fill=\"#1f2937\" class=\"sb\">kitten</text><rect x=\"258\" y=\"244\" width=\"150\" height=\"54\" rx=\"14\" fill=\"#fff1c9\" stroke=\"#f59e0b\" stroke-width=\"2.6\"/><text x=\"333\" y=\"278\" text-anchor=\"middle\" font-size=\"17\" font-weight=\"700\" fill=\"#8a3d0f\" class=\"sb\">vowel: i e</text><circle cx=\"452\" cy=\"272\" r=\"15\" fill=\"#7c3aed\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><text x=\"452\" y=\"278\" text-anchor=\"middle\" font-size=\"16\" font-weight=\"700\" fill=\"#ffffff\" class=\"sb\">1</text><circle cx=\"490\" cy=\"272\" r=\"15\" fill=\"#7c3aed\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><text x=\"490\" y=\"278\" text-anchor=\"middle\" font-size=\"16\" font-weight=\"700\" fill=\"#ffffff\" class=\"sb\">2</text><text x=\"542\" y=\"278\" text-anchor=\"start\" font-size=\"17\" font-weight=\"700\" fill=\"#334155\" class=\"st\">2 beats</text><text x=\"360\" y=\"326\" text-anchor=\"middle\" font-size=\"16\" font-weight=\"700\" fill=\"#7c2d12\" class=\"sb\">Every syllable has one vowel sound.</text></g></svg>",
        "alt": "Animated cartoon: four word cards reading cat, rain, boat and kitten, each with its vowel letters named beside it, each followed by numbered beat dots showing one beat for cat, rain and boat and two beats for kitten.",
        "caption": "Every beat has one vowel sound. Kitten has two beats because it has two vowel sounds."
      }
    },
    {
      "icon": "✂️",
      "title": "Chunk long words to spell them",
      "explain": "Chunking means cutting a long word into its beats and spelling one piece at a time. You already know how to clap the beats, so now you write one careful chunk for each clap.\n\nFollow the same order every time. Say the word out loud. Clap the beats. Write the first chunk, then the next chunk, then join them. Rabbit becomes rab plus bit. Garden becomes gar plus den. Kitten becomes kit plus ten.\n\nChunking helps because each piece is short and familiar, so you are only ever spelling a small word. When you check your work, read the chunks back together and listen for the word you were trying to write.",
      "example": "The word garden claps twice, so you write gar, then den, and join them as garden.",
      "notice": "A chunk with no vowel sound is not a syllable. Splitting a word so that a chunk like amus stands alone means the chunks have moved.",
      "check": {
        "type": "multiple_choice",
        "question": "Which is the best way to chunk the word garden?",
        "options": [
          "ga-rden",
          "gar-den",
          "gard-en",
          "g-arden"
        ],
        "correct_index": 1,
        "explanation": "Gar-den keeps one vowel sound in each chunk, so both chunks can be heard as beats."
      },
      "visual": {
        "svg": "<svg viewBox=\"0 0 720 310\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>@keyframes legA{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(26deg)}}@keyframes legB{0%,100%{transform:rotate(26deg)}50%{transform:rotate(-24deg)}}@keyframes armA{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-26deg)}}@keyframes armB{0%,100%{transform:rotate(-26deg)}50%{transform:rotate(22deg)}}@keyframes waveArm{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(-40deg)}}@keyframes wag{0%,100%{transform:rotate(-18deg)}50%{transform:rotate(18deg)}}@keyframes flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.4)}}@keyframes sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}@keyframes drift{0%{transform:translateX(-12px)}100%{transform:translateX(14px)}}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes bite{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.5)}}@keyframes rise{0%{transform:translateY(6px) scale(.6);opacity:0}18%{opacity:1}100%{transform:translateY(-54px) scale(1);opacity:0}}@keyframes fall{0%{transform:translateY(-14px);opacity:0}18%{opacity:1}100%{transform:translateY(26px);opacity:0}}@keyframes pop{0%{transform:scale(.5);opacity:0}55%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}@keyframes blink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}@keyframes ripple{0%,100%{transform:scaleX(1);opacity:.7}50%{transform:scaleX(1.2);opacity:1}}@keyframes float{0%{transform:translate(0,0)}50%{transform:translate(4px,-3px)}100%{transform:translate(-3px,2px)}}@keyframes jump{0%,100%{transform:translateY(0)}30%{transform:translateY(-14px)}}.a4c4{animation:drift 7.5s ease-in-out infinite alternate}.a4cpb{animation:bob .8s ease-in-out infinite}.a4dgtl{animation:wag 1.0499999999999998s ease-in-out infinite;transform-box:fill-box;transform-origin:80% 90%}.a4dglA{animation:legA 0.7s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a4dglB{animation:legB 0.7s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a4dghd{animation:bob 0.7s ease-in-out infinite}.a4dger{animation:flap 1.19s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a4dgmo{animation:bite 0.7s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.sc{animation:bob 1.4s ease-in-out infinite}.sb{font-family:Arial,sans-serif;font-weight:700}@media (prefers-reduced-motion:reduce){.scn *{animation:none !important}animate{display:none}}</style><g class=\"scn\"><defs><linearGradient id=\"gl3s4\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#a9d8ff\"/><stop offset=\"0.62\" stop-color=\"#d8efff\"/><stop offset=\"1\" stop-color=\"#eef9ff\"/></linearGradient></defs><rect width=\"720\" height=\"310\" rx=\"20\" fill=\"url(#gl3s4)\"/><rect x=\"0\" y=\"196\" width=\"720\" height=\"114\" rx=\"0\" fill=\"#8fe38f\"/><g class=\"a4c4\"><circle cx=\"62.0\" cy=\"46.0\" r=\"11.9\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><circle cx=\"75.3\" cy=\"41.1\" r=\"14.7\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><circle cx=\"91.4\" cy=\"46.0\" r=\"11.2\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><rect x=\"51.5\" y=\"43.9\" width=\"53.2\" height=\"12.6\" rx=\"6.3\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.2\"/></g><g class=\"a4cpb\"><circle cx=\"120.0\" cy=\"200.2\" r=\"13.8\" fill=\"#7fc45a\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><circle cx=\"141.2\" cy=\"200.2\" r=\"13.8\" fill=\"#6cb44a\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><circle cx=\"162.5\" cy=\"200.2\" r=\"13.8\" fill=\"#7fc45a\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><circle cx=\"183.8\" cy=\"200.2\" r=\"13.8\" fill=\"#6cb44a\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><path d=\"M120.0 214.0 L120.0 222.8\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"6.7\" stroke-linecap=\"round\"/><path d=\"M120.0 214.0 L120.0 222.8\" fill=\"none\" stroke=\"#4f8a3c\" stroke-width=\"3.2\" stroke-linecap=\"round\"/><path d=\"M141.2 214.0 L141.2 222.8\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"6.7\" stroke-linecap=\"round\"/><path d=\"M141.2 214.0 L141.2 222.8\" fill=\"none\" stroke=\"#4f8a3c\" stroke-width=\"3.2\" stroke-linecap=\"round\"/><path d=\"M162.5 214.0 L162.5 222.8\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"6.7\" stroke-linecap=\"round\"/><path d=\"M162.5 214.0 L162.5 222.8\" fill=\"none\" stroke=\"#4f8a3c\" stroke-width=\"3.2\" stroke-linecap=\"round\"/><path d=\"M183.8 214.0 L183.8 222.8\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"6.7\" stroke-linecap=\"round\"/><path d=\"M183.8 214.0 L183.8 222.8\" fill=\"none\" stroke=\"#4f8a3c\" stroke-width=\"3.2\" stroke-linecap=\"round\"/><path d=\"M205.0 214.0 L205.0 222.8\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"6.7\" stroke-linecap=\"round\"/><path d=\"M205.0 214.0 L205.0 222.8\" fill=\"none\" stroke=\"#4f8a3c\" stroke-width=\"3.2\" stroke-linecap=\"round\"/><circle cx=\"205.0\" cy=\"197.8\" r=\"16.2\" fill=\"#7fc45a\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><ellipse cx=\"210.4\" cy=\"196.5\" rx=\"3.6\" ry=\"4.3\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"210.8\" cy=\"197.0\" r=\"2.0\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"209.5\" cy=\"195.2\" r=\"0.8\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><path d=\"M200.0 182.8 L195.0 171.5\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"5.7\" stroke-linecap=\"round\"/><path d=\"M200.0 182.8 L195.0 171.5\" fill=\"none\" stroke=\"#5b4632\" stroke-width=\"2.2\" stroke-linecap=\"round\"/><path d=\"M212.5 182.8 L217.5 171.5\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"5.7\" stroke-linecap=\"round\"/><path d=\"M212.5 182.8 L217.5 171.5\" fill=\"none\" stroke=\"#5b4632\" stroke-width=\"2.2\" stroke-linecap=\"round\"/><circle cx=\"195.0\" cy=\"170.2\" r=\"2.8\" fill=\"#f08ea8\" stroke=\"#2b2521\" stroke-width=\"1.2\"/><circle cx=\"217.5\" cy=\"170.2\" r=\"2.8\" fill=\"#f08ea8\" stroke=\"#2b2521\" stroke-width=\"1.2\"/><path d=\"M198.8 206.5 q7.5 6.2 15.0 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/></g><ellipse cx=\"523.2\" cy=\"216.4\" rx=\"19.2\" ry=\"4.4\" fill=\"#000\" opacity=\"0.12\"/><g class=\"a4dgtl\"><path d=\"M504.0 199.6 Q496.0 194.8 499.2 182.0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"7.4\" stroke-linecap=\"round\"/><path d=\"M504.0 199.6 Q496.0 194.8 499.2 182.0\" fill=\"none\" stroke=\"#c07f37\" stroke-width=\"4.0\" stroke-linecap=\"round\"/></g><g class=\"a4dglA\"><path d=\"M509.6 214.0 L509.6 203.6\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"8.2\" stroke-linecap=\"round\"/><path d=\"M509.6 214.0 L509.6 203.6\" fill=\"none\" stroke=\"#c07f37\" stroke-width=\"4.8\" stroke-linecap=\"round\"/></g><g class=\"a4dglB\"><path d=\"M521.6 214.0 L521.6 203.6\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"8.2\" stroke-linecap=\"round\"/><path d=\"M521.6 214.0 L521.6 203.6\" fill=\"none\" stroke=\"#c07f37\" stroke-width=\"4.8\" stroke-linecap=\"round\"/></g><g class=\"a4dglA\"><path d=\"M528.8 214.0 L528.8 203.6\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"8.2\" stroke-linecap=\"round\"/><path d=\"M528.8 214.0 L528.8 203.6\" fill=\"none\" stroke=\"#c07f37\" stroke-width=\"4.8\" stroke-linecap=\"round\"/></g><g class=\"a4dglB\"><path d=\"M533.6 214.0 L533.6 203.6\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"8.2\" stroke-linecap=\"round\"/><path d=\"M533.6 214.0 L533.6 203.6\" fill=\"none\" stroke=\"#c07f37\" stroke-width=\"4.8\" stroke-linecap=\"round\"/></g><ellipse cx=\"520.0\" cy=\"198.8\" rx=\"18.4\" ry=\"11.2\" fill=\"#e0a45c\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><g class=\"a4dghd\"><circle cx=\"536.8\" cy=\"188.4\" r=\"11.2\" fill=\"#e0a45c\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><g class=\"a4dger\"><path d=\"M528.0 180.4 Q521.6 174.0 524.8 190.0 Q531.2 186.8 532.8 182.0 Z\" fill=\"#c07f37\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><ellipse cx=\"545.6\" cy=\"193.2\" rx=\"8.8\" ry=\"7.2\" fill=\"#f8e7c8\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><circle cx=\"552.0\" cy=\"192.4\" r=\"2.7\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><ellipse cx=\"538.5\" cy=\"185.2\" rx=\"2.7\" ry=\"3.3\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"538.8\" cy=\"185.6\" r=\"1.5\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"537.8\" cy=\"184.2\" r=\"0.6\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/></g><g class=\"a4dgmo\"><path d=\"M543.2 198.0 q2.4 2.7 6.4 0.8\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><rect x=\"150\" y=\"30\" width=\"330\" height=\"44\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"315\" y=\"59\" text-anchor=\"middle\" font-size=\"19\" font-weight=\"700\" fill=\"#991b1b\" class=\"sb\">rab bit</text><path d=\"M278 43 L278 29 M300 43 L300 29\" stroke=\"#dc2626\" stroke-width=\"3\"/><g class=\"sc\"><circle cx=\"556\" cy=\"86\" r=\"9\" fill=\"none\" stroke=\"#334155\" stroke-width=\"3\"/><circle cx=\"556\" cy=\"52\" r=\"9\" fill=\"none\" stroke=\"#334155\" stroke-width=\"3\"/><path d=\"M563 80 L598 24 M563 58 L598 114\" stroke=\"#334155\" stroke-width=\"4\" stroke-linecap=\"round\"/></g><rect x=\"390\" y=\"124\" width=\"300\" height=\"40\" rx=\"14\" fill=\"#dcfce7\" stroke=\"#166534\" stroke-width=\"2.6\"/><text x=\"540\" y=\"150\" text-anchor=\"middle\" font-size=\"17\" font-weight=\"700\" fill=\"#166534\" class=\"sb\">Cut words into chunks</text><rect x=\"40\" y=\"244\" width=\"400\" height=\"40\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"240\" y=\"270\" text-anchor=\"middle\" font-size=\"17\" font-weight=\"700\" fill=\"#1f2937\" class=\"sb\">rab-bit has two chunks</text><rect x=\"460\" y=\"244\" width=\"230\" height=\"40\" rx=\"14\" fill=\"#dbeafe\" stroke=\"#3b82f6\" stroke-width=\"2.6\"/><text x=\"575\" y=\"270\" text-anchor=\"middle\" font-size=\"17\" font-weight=\"700\" fill=\"#17428f\" class=\"sb\">rab bit</text></g></svg>",
        "alt": "Animated cartoon: a green caterpillar crawls along the grass beside a dog while giant scissors cut the words rab bit apart and two cards show rab-bit cut into two chunks.",
        "caption": "Watch the scissors cut rab-bit into two chunks."
      }
    },
    {
      "icon": "🎈",
      "title": "Stretch the sounds in a chunk",
      "explain": "Stretching means saying a word very slowly, like slowly pulling a rubber band, so you can hear every single sound. Each little sound is called a phoneme.\n\nStretch the word rabbit: r, a, b, i, t. Those are five separate sounds, but rabbit only has two beats. Sounds and syllables are different things: syllables are the beats you clap, and sounds are the smallest pieces you can hear inside a beat.\n\nSometimes two letters make one sound. In ship, the letters s and h work together as a single sound, so ship has three sounds, not four. Stretching is how you find out which letters to write, and chunking is how you find out how many parts the word has.",
      "example": "Stretch the word lamp: l, a, m, p. Four sounds, but lamp has only one syllable.",
      "notice": "Do not assume every letter is a sound. In ship, sh is one sound, so ship has three sounds.",
      "check": {
        "type": "multiple_choice",
        "question": "How many sounds can you hear in the word ship?",
        "options": [
          "2",
          "3",
          "4",
          "5"
        ],
        "correct_index": 1,
        "explanation": "Sh is one sound, then i, then p. That makes three sounds."
      },
      "visual": {
        "svg": "<svg viewBox=\"0 0 720 300\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>@keyframes legA{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(26deg)}}@keyframes legB{0%,100%{transform:rotate(26deg)}50%{transform:rotate(-24deg)}}@keyframes armA{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-26deg)}}@keyframes armB{0%,100%{transform:rotate(-26deg)}50%{transform:rotate(22deg)}}@keyframes waveArm{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(-40deg)}}@keyframes wag{0%,100%{transform:rotate(-18deg)}50%{transform:rotate(18deg)}}@keyframes flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.4)}}@keyframes sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}@keyframes drift{0%{transform:translateX(-12px)}100%{transform:translateX(14px)}}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes bite{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.5)}}@keyframes rise{0%{transform:translateY(6px) scale(.6);opacity:0}18%{opacity:1}100%{transform:translateY(-54px) scale(1);opacity:0}}@keyframes fall{0%{transform:translateY(-14px);opacity:0}18%{opacity:1}100%{transform:translateY(26px);opacity:0}}@keyframes pop{0%{transform:scale(.5);opacity:0}55%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}@keyframes blink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}@keyframes ripple{0%,100%{transform:scaleX(1);opacity:.7}50%{transform:scaleX(1.2);opacity:1}}@keyframes float{0%{transform:translate(0,0)}50%{transform:translate(4px,-3px)}100%{transform:translate(-3px,2px)}}@keyframes jump{0%,100%{transform:translateY(0)}30%{transform:translateY(-14px)}}.a5kdlL{animation:legA 0.8s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a5kdlR{animation:legB %ss ease-in-out infinite;transform-box:fill-box;transform-origin:50%% 0%%}.a5kdbd{animation:bob 0.8s ease-in-out infinite}.a5kdhd{animation:bob 0.8s ease-in-out infinite}.a5kdey{animation:blink 4.2s linear infinite;transform-box:fill-box;transform-origin:50% 50%}.a5kdaL{animation:armA 0.8s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a5kdaR{animation:armB 0.8s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a5kdbd{animation:bob 0.8s ease-in-out infinite}.bd{animation:bob .9s ease-in-out infinite}.sd50{animation:pop .5s ease-out both;animation-delay:0.3s}.sd51{animation:pop .5s ease-out both;animation-delay:0.6s}.sd52{animation:pop .5s ease-out both;animation-delay:0.9s}.sd53{animation:pop .5s ease-out both;animation-delay:1.2s}.sd54{animation:pop .5s ease-out both;animation-delay:1.5s}.sb{font-family:Arial,sans-serif;font-weight:700}.st{font-family:Arial,sans-serif}@media (prefers-reduced-motion:reduce){.scn *{animation:none !important}animate{display:none}}</style><g class=\"scn\"><rect x=\"0\" y=\"0\" width=\"720\" height=\"300\" rx=\"20\" fill=\"#f0f7ff\"/><rect x=\"0\" y=\"206\" width=\"720\" height=\"94\" rx=\"0\" fill=\"#8fe38f\"/><ellipse cx=\"130.0\" cy=\"275.4\" rx=\"26.4\" ry=\"6.9\" fill=\"#000\" opacity=\"0.12\"/><g class=\"a5kdlL\"><path d=\"M122.5 242.1 L122.5 261.6\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"13.8\" stroke-linecap=\"round\"/><path d=\"M122.5 242.1 L122.5 261.6\" fill=\"none\" stroke=\"#2f6bcf\" stroke-width=\"10.3\" stroke-linecap=\"round\"/></g><g class=\"a5kdlR\"><path d=\"M137.5 242.1 L137.5 261.6\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"13.8\" stroke-linecap=\"round\"/><path d=\"M137.5 242.1 L137.5 261.6\" fill=\"none\" stroke=\"#2f6bcf\" stroke-width=\"10.3\" stroke-linecap=\"round\"/></g><rect x=\"115.0\" y=\"260.5\" width=\"19.5\" height=\"11.5\" rx=\"5.8\" fill=\"#334155\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><rect x=\"126.5\" y=\"260.5\" width=\"19.5\" height=\"11.5\" rx=\"5.8\" fill=\"#334155\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><path d=\"M113.9 242.1 L109.3 220.2 Q109.3 212.2 118.5 211.1 L141.5 211.1 Q150.7 212.2 150.7 220.2 L146.1 242.1 Z\" fill=\"#3b82f6\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><path d=\"M123.1 211.1 Q130.0 216.8 136.9 211.1\" fill=\"#3b82f6\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><g class=\"a5kdaL\"><path d=\"M110.5 217.9 Q104.7 228.3 108.2 237.5\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"10.3\" stroke-linecap=\"round\"/><path d=\"M110.5 217.9 Q104.7 228.3 108.2 237.5\" fill=\"none\" stroke=\"#f6c9a0\" stroke-width=\"6.9\" stroke-linecap=\"round\"/></g><g class=\"a5kdaR\"><path d=\"M149.6 217.9 Q155.3 228.3 151.8 237.5\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"10.3\" stroke-linecap=\"round\"/><path d=\"M149.6 217.9 Q155.3 228.3 151.8 237.5\" fill=\"none\" stroke=\"#f6c9a0\" stroke-width=\"6.9\" stroke-linecap=\"round\"/></g><circle cx=\"108.2\" cy=\"237.5\" r=\"3.9\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"151.8\" cy=\"237.5\" r=\"3.9\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><rect x=\"126.0\" y=\"205.3\" width=\"8.0\" height=\"8.0\" rx=\"3.4\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><circle cx=\"111.0\" cy=\"189.2\" r=\"4.8\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"149.0\" cy=\"189.2\" r=\"4.8\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><g class=\"a5kdhd\"><circle cx=\"130.0\" cy=\"189.2\" r=\"18.4\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><path d=\"M111.6 186.9 Q108.2 166.2 130.0 166.2 Q151.8 166.2 148.4 186.9 Q141.5 180.0 134.6 183.4 Q127.7 180.0 120.8 183.4 Q116.2 180.0 111.6 186.9 Z\" fill=\"#4a3222\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><g class=\"a5kdey\"><ellipse cx=\"123.8\" cy=\"189.2\" rx=\"4.1\" ry=\"4.9\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"123.3\" cy=\"189.8\" r=\"2.3\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"124.8\" cy=\"187.7\" r=\"1.0\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><ellipse cx=\"136.2\" cy=\"189.2\" rx=\"4.1\" ry=\"4.9\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"136.7\" cy=\"189.8\" r=\"2.3\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"135.2\" cy=\"187.7\" r=\"1.0\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/></g><path d=\"M120.8 180.0 q3.4 -2.5 6.9 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><path d=\"M132.3 180.0 q3.4 -2.5 6.9 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><ellipse cx=\"118.5\" cy=\"196.1\" rx=\"4.1\" ry=\"2.8\" fill=\"#f87171\" opacity=\"0.35\"/><ellipse cx=\"141.5\" cy=\"196.1\" rx=\"4.1\" ry=\"2.8\" fill=\"#f87171\" opacity=\"0.35\"/><path d=\"M124.8 198.4 q5.2 5.5 10.3 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><path d=\"M186 168 Q 300 128 560 156\" fill=\"none\" stroke=\"#ef5350\" stroke-width=\"7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><g class=\"bd\"><path d=\"M186 168 Q 300 128 560 156\" fill=\"none\" stroke=\"#f8b4b4\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></g><g class=\"sd50\"><circle cx=\"252\" cy=\"146\" r=\"17\" fill=\"#ffffff\" stroke=\"#3b82f6\" stroke-width=\"2.6\"/><text x=\"252\" y=\"152\" text-anchor=\"middle\" font-size=\"18\" font-weight=\"700\" fill=\"#17428f\" class=\"sb\">r</text></g><g class=\"sd51\"><circle cx=\"320\" cy=\"136\" r=\"17\" fill=\"#ffffff\" stroke=\"#3b82f6\" stroke-width=\"2.6\"/><text x=\"320\" y=\"142\" text-anchor=\"middle\" font-size=\"18\" font-weight=\"700\" fill=\"#17428f\" class=\"sb\">a</text></g><g class=\"sd52\"><circle cx=\"392\" cy=\"136\" r=\"17\" fill=\"#ffffff\" stroke=\"#3b82f6\" stroke-width=\"2.6\"/><text x=\"392\" y=\"142\" text-anchor=\"middle\" font-size=\"18\" font-weight=\"700\" fill=\"#17428f\" class=\"sb\">b</text></g><g class=\"sd53\"><circle cx=\"462\" cy=\"140\" r=\"17\" fill=\"#ffffff\" stroke=\"#3b82f6\" stroke-width=\"2.6\"/><text x=\"462\" y=\"146\" text-anchor=\"middle\" font-size=\"18\" font-weight=\"700\" fill=\"#17428f\" class=\"sb\">i</text></g><g class=\"sd54\"><circle cx=\"530\" cy=\"148\" r=\"17\" fill=\"#ffffff\" stroke=\"#3b82f6\" stroke-width=\"2.6\"/><text x=\"530\" y=\"154\" text-anchor=\"middle\" font-size=\"18\" font-weight=\"700\" fill=\"#17428f\" class=\"sb\">t</text></g><rect x=\"200\" y=\"222\" width=\"340\" height=\"40\" rx=\"14\" fill=\"#dbeafe\" stroke=\"#3b82f6\" stroke-width=\"2.6\"/><text x=\"370\" y=\"248\" text-anchor=\"middle\" font-size=\"18\" font-weight=\"700\" fill=\"#17428f\" class=\"sb\">Stretch it: r a b i t</text><text x=\"360\" y=\"32\" text-anchor=\"middle\" font-size=\"16\" font-weight=\"700\" fill=\"#334155\" class=\"st\">Say each sound slowly, like stretching a band.</text></g></svg>",
        "alt": "Animated cartoon: a boy in a blue shirt stretches a long red band across the screen while five sound bubbles labelled r, a, b, i and t pop up along the band one at a time.",
        "caption": "Stretch it slowly and the sounds appear one by one."
      }
    },
    {
      "icon": "🪄",
      "title": "The -le ending at the end of a word",
      "explain": "Many longer words finish with the letters l and e. That ending is written -le and it says ull, as in the last beat of ta-ble and lit-tle.\n\nTo spell these words, find the -le first, then chunk the letters just before it and keep the consonant with the -le. Table becomes ta plus ble. Candle becomes can plus dle. Little becomes lit plus tle.\n\nKnowing this ending saves you guessing. Once you can hear the ull at the end, you know the last two letters are l and e, not el, and the consonant before them belongs with that last beat.",
      "example": "Candle ends with the -le beat, so you write can, then dle, and join them: candle.",
      "notice": "Writing candel or tabl misses the -le pattern. Every one of these words ends with l then e.",
      "check": {
        "type": "multiple_choice",
        "question": "How do you chunk the word little?",
        "options": [
          "lit-tle",
          "litt-le",
          "li-ttle",
          "little"
        ],
        "correct_index": 0,
        "explanation": "Lit-tle keeps the consonant with the -le ending and gives one vowel sound in each chunk."
      },
      "visual": {
        "svg": "<svg viewBox=\"0 0 720 330\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>@keyframes legA{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(26deg)}}@keyframes legB{0%,100%{transform:rotate(26deg)}50%{transform:rotate(-24deg)}}@keyframes armA{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-26deg)}}@keyframes armB{0%,100%{transform:rotate(-26deg)}50%{transform:rotate(22deg)}}@keyframes waveArm{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(-40deg)}}@keyframes wag{0%,100%{transform:rotate(-18deg)}50%{transform:rotate(18deg)}}@keyframes flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.4)}}@keyframes sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}@keyframes drift{0%{transform:translateX(-12px)}100%{transform:translateX(14px)}}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes bite{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.5)}}@keyframes rise{0%{transform:translateY(6px) scale(.6);opacity:0}18%{opacity:1}100%{transform:translateY(-54px) scale(1);opacity:0}}@keyframes fall{0%{transform:translateY(-14px);opacity:0}18%{opacity:1}100%{transform:translateY(26px);opacity:0}}@keyframes pop{0%{transform:scale(.5);opacity:0}55%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}@keyframes blink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}@keyframes ripple{0%,100%{transform:scaleX(1);opacity:.7}50%{transform:scaleX(1.2);opacity:1}}@keyframes float{0%{transform:translate(0,0)}50%{transform:translate(4px,-3px)}100%{transform:translate(-3px,2px)}}@keyframes jump{0%,100%{transform:translateY(0)}30%{transform:translateY(-14px)}}.a6cd{animation:flick 1.4s ease-in-out infinite}.a6jrl{animation:bob 1.8s ease-in-out infinite}.a6cttl{animation:wag 1.3s ease-in-out infinite;transform-box:fill-box;transform-origin:80% 90%}.a6cthd{animation:bob 1.1s ease-in-out infinite}.a6ctey{animation:blink 5s linear infinite;transform-box:fill-box;transform-origin:50% 50%}.sb{font-family:Arial,sans-serif;font-weight:700}@media (prefers-reduced-motion:reduce){.scn *{animation:none !important}animate{display:none}}</style><g class=\"scn\"><rect x=\"0\" y=\"0\" width=\"720\" height=\"330\" rx=\"20\" fill=\"#fff6f0\"/><rect x=\"133.3\" y=\"254.0\" width=\"133.4\" height=\"13.8\" rx=\"4.6\" fill=\"#c98f4e\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><rect x=\"142.5\" y=\"267.8\" width=\"12.6\" height=\"32.2\" rx=\"3.4\" fill=\"#a9713a\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><rect x=\"244.8\" y=\"267.8\" width=\"12.6\" height=\"32.2\" rx=\"3.4\" fill=\"#a9713a\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><rect x=\"193.0\" y=\"216.0\" width=\"14.0\" height=\"38.0\" rx=\"4.0\" fill=\"#f2e7cf\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><g class=\"a6cd\"><path d=\"M196.0 218.0 q4.0 -8.0 0 -15.0 q-4.0 7.0 0 15.0 Z\" fill=\"#fbbf24\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/></g><g class=\"a6jrl\"><rect x=\"401.5\" y=\"241.1\" width=\"57.0\" height=\"58.9\" rx=\"11.4\" fill=\"#dff2ff\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><rect x=\"411.0\" y=\"233.5\" width=\"38.0\" height=\"9.5\" rx=\"3.8\" fill=\"#8b5a2b\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><rect x=\"404.3\" y=\"245.8\" width=\"24.7\" height=\"13.3\" rx=\"2.8\" fill=\"#fff6d6\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><rect x=\"427.1\" y=\"245.8\" width=\"24.7\" height=\"13.3\" rx=\"2.8\" fill=\"#fff6d6\" stroke=\"#2b2521\" stroke-width=\"2.2\"/></g><ellipse cx=\"601.7\" cy=\"302.6\" rx=\"17.8\" ry=\"4.2\" fill=\"#000\" opacity=\"0.12\"/><g class=\"a6cttl\"><path d=\"M584.7 283.0 Q574.5 276.2 577.9 262.6\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"7.2\" stroke-linecap=\"round\"/><path d=\"M584.7 283.0 Q574.5 276.2 577.9 262.6\" fill=\"none\" stroke=\"#7c8797\" stroke-width=\"3.8\" stroke-linecap=\"round\"/></g><path d=\"M590.6 300.0 L590.6 289.8\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"7.7\" stroke-linecap=\"round\"/><path d=\"M590.6 300.0 L590.6 289.8\" fill=\"none\" stroke=\"#7c8797\" stroke-width=\"4.2\" stroke-linecap=\"round\"/><path d=\"M600.0 300.0 L600.0 289.8\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"7.7\" stroke-linecap=\"round\"/><path d=\"M600.0 300.0 L600.0 289.8\" fill=\"none\" stroke=\"#7c8797\" stroke-width=\"4.2\" stroke-linecap=\"round\"/><path d=\"M606.8 300.0 L606.8 289.8\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"7.7\" stroke-linecap=\"round\"/><path d=\"M606.8 300.0 L606.8 289.8\" fill=\"none\" stroke=\"#7c8797\" stroke-width=\"4.2\" stroke-linecap=\"round\"/><path d=\"M612.8 300.0 L612.8 289.8\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"7.7\" stroke-linecap=\"round\"/><path d=\"M612.8 300.0 L612.8 289.8\" fill=\"none\" stroke=\"#7c8797\" stroke-width=\"4.2\" stroke-linecap=\"round\"/><ellipse cx=\"600.0\" cy=\"285.6\" rx=\"17.8\" ry=\"10.2\" fill=\"#9aa5b5\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><circle cx=\"615.3\" cy=\"274.5\" r=\"11.0\" fill=\"#9aa5b5\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><path d=\"M606.8 266.0 L606.0 255.8 L615.3 262.6 Z\" fill=\"#9aa5b5\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><path d=\"M622.1 264.3 L625.5 255.8 L616.1 262.6 Z\" fill=\"#9aa5b5\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><g class=\"a6ctey\"><ellipse cx=\"611.4\" cy=\"272.8\" rx=\"2.6\" ry=\"3.1\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"611.1\" cy=\"273.2\" r=\"1.4\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"612.0\" cy=\"271.9\" r=\"0.6\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><ellipse cx=\"619.2\" cy=\"272.8\" rx=\"2.6\" ry=\"3.1\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"619.5\" cy=\"273.2\" r=\"1.4\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"618.6\" cy=\"271.9\" r=\"0.6\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/></g><path d=\"M606.8 277.9 l-8.5 -1.7 M606.8 280.4 l-8.5 2.5\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"1.8\" stroke-linejoin=\"round\"/><path d=\"M623.8 277.9 l8.5 -1.7 M623.8 280.4 l8.5 2.5\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"1.8\" stroke-linejoin=\"round\"/><rect x=\"40\" y=\"30\" width=\"300\" height=\"42\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"190\" y=\"58\" text-anchor=\"middle\" font-size=\"19\" font-weight=\"700\" fill=\"#1f2937\" class=\"sb\">ta-ble</text><rect x=\"378\" y=\"30\" width=\"300\" height=\"42\" rx=\"14\" fill=\"#fff1c9\" stroke=\"#f59e0b\" stroke-width=\"2.6\"/><text x=\"528\" y=\"58\" text-anchor=\"middle\" font-size=\"19\" font-weight=\"700\" fill=\"#8a3d0f\" class=\"sb\">can-dle</text><rect x=\"160\" y=\"86\" width=\"400\" height=\"40\" rx=\"14\" fill=\"#dcfce7\" stroke=\"#166534\" stroke-width=\"2.6\"/><text x=\"360\" y=\"112\" text-anchor=\"middle\" font-size=\"17\" font-weight=\"700\" fill=\"#166534\" class=\"sb\">-le says ull at the end: lit-tle</text><rect x=\"120\" y=\"140\" width=\"480\" height=\"40\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"360\" y=\"166\" text-anchor=\"middle\" font-size=\"16\" font-weight=\"700\" fill=\"#1f2937\" class=\"sb\">Chunk before the -le: ta-ble, can-dle, lit-tle</text></g></svg>",
        "alt": "Animated cartoon: a table with a lit candle on it, a jar holding the chunks ta-ble and lit-tle, and a cat nearby, with cards showing ta-ble, can-dle and the rule that -le says ull at the end.",
        "caption": "Look for the -le beat: ta-ble, can-dle, lit-tle."
      }
    },
    {
      "icon": "🔁",
      "title": "The five step spelling routine",
      "explain": "Good spellers use the same routine every single time, so nothing gets missed. There are five steps: say it, clap it, chunk it, write it, check it.\n\nSay the word out loud and listen to it. Clap the beats so you know how many chunks you need. Chunk the word into those parts. Write one chunk at a time, then join them. Finally, check by reading the chunks back together and asking whether the word looks right.\n\nThe routine matters because it turns spelling into a set of small jobs instead of one big guess. When a word defeats you, go back to step one and slow the word down again. Most spelling mistakes disappear when the word is clapped and chunked before it is written.",
      "example": "Elephant: say it, clap three times, chunk el-e-phant, write the chunks, then read it back to check.",
      "notice": "Jumping straight to writing skips the clapping and chunking, and that is where misses happen.",
      "check": {
        "type": "multiple_choice",
        "question": "Which step comes third in the routine?",
        "options": [
          "Say it",
          "Clap it",
          "Chunk it",
          "Check it"
        ],
        "correct_index": 2,
        "explanation": "The order is say it, clap it, chunk it, write it, check it."
      },
      "visual": {
        "svg": "<svg viewBox=\"0 0 720 330\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>@keyframes legA{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(26deg)}}@keyframes legB{0%,100%{transform:rotate(26deg)}50%{transform:rotate(-24deg)}}@keyframes armA{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-26deg)}}@keyframes armB{0%,100%{transform:rotate(-26deg)}50%{transform:rotate(22deg)}}@keyframes waveArm{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(-40deg)}}@keyframes wag{0%,100%{transform:rotate(-18deg)}50%{transform:rotate(18deg)}}@keyframes flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.4)}}@keyframes sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}@keyframes drift{0%{transform:translateX(-12px)}100%{transform:translateX(14px)}}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes bite{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.5)}}@keyframes rise{0%{transform:translateY(6px) scale(.6);opacity:0}18%{opacity:1}100%{transform:translateY(-54px) scale(1);opacity:0}}@keyframes fall{0%{transform:translateY(-14px);opacity:0}18%{opacity:1}100%{transform:translateY(26px);opacity:0}}@keyframes pop{0%{transform:scale(.5);opacity:0}55%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}@keyframes blink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}@keyframes ripple{0%,100%{transform:scaleX(1);opacity:.7}50%{transform:scaleX(1.2);opacity:1}}@keyframes float{0%{transform:translate(0,0)}50%{transform:translate(4px,-3px)}100%{transform:translate(-3px,2px)}}@keyframes jump{0%,100%{transform:translateY(0)}30%{transform:translateY(-14px)}}.sp70{animation:pop .5s ease-out both;animation-delay:0.4s}.sp71{animation:pop .5s ease-out both;animation-delay:0.9s}.sp72{animation:pop .5s ease-out both;animation-delay:1.4s}.sp73{animation:pop .5s ease-out both;animation-delay:1.9s}.sp74{animation:pop .5s ease-out both;animation-delay:2.4s}.a7wklL{animation:legA 0.8s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a7wklR{animation:legB %ss ease-in-out infinite;transform-box:fill-box;transform-origin:50%% 0%%}.a7wkbd{animation:bob 0.8s ease-in-out infinite}.a7wkhd{animation:bob 0.8s ease-in-out infinite}.a7wkey{animation:blink 4.2s linear infinite;transform-box:fill-box;transform-origin:50% 50%}.a7wkaL{animation:armA 0.8s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a7wkaR{animation:armB 0.8s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a7wkbd{animation:bob 0.8s ease-in-out infinite}.sb{font-family:Arial,sans-serif;font-weight:700}@media (prefers-reduced-motion:reduce){.scn *{animation:none !important}animate{display:none}}</style><g class=\"scn\"><defs><linearGradient id=\"gl3s7\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#a9d8ff\"/><stop offset=\"0.62\" stop-color=\"#d8efff\"/><stop offset=\"1\" stop-color=\"#eef9ff\"/></linearGradient></defs><rect width=\"720\" height=\"330\" rx=\"20\" fill=\"url(#gl3s7)\"/><rect x=\"0\" y=\"236\" width=\"720\" height=\"94\" rx=\"0\" fill=\"#8fe38f\"/><g class=\"sp70\"><rect x=\"30\" y=\"52\" width=\"126\" height=\"50\" rx=\"25\" fill=\"#dbeafe\" stroke=\"#1e40af\" stroke-width=\"2.6\"/><text x=\"93\" y=\"84\" text-anchor=\"middle\" font-size=\"17\" font-weight=\"700\" fill=\"#1e40af\" class=\"sb\">Say it</text></g><g class=\"sp71\"><rect x=\"170\" y=\"52\" width=\"126\" height=\"50\" rx=\"25\" fill=\"#ffedd5\" stroke=\"#9a3412\" stroke-width=\"2.6\"/><text x=\"233\" y=\"84\" text-anchor=\"middle\" font-size=\"17\" font-weight=\"700\" fill=\"#9a3412\" class=\"sb\">Clap it</text></g><g class=\"sp72\"><rect x=\"310\" y=\"52\" width=\"126\" height=\"50\" rx=\"25\" fill=\"#e6dbff\" stroke=\"#52309c\" stroke-width=\"2.6\"/><text x=\"373\" y=\"84\" text-anchor=\"middle\" font-size=\"17\" font-weight=\"700\" fill=\"#52309c\" class=\"sb\">Chunk it</text></g><g class=\"sp73\"><rect x=\"450\" y=\"52\" width=\"126\" height=\"50\" rx=\"25\" fill=\"#dcfce7\" stroke=\"#166534\" stroke-width=\"2.6\"/><text x=\"513\" y=\"84\" text-anchor=\"middle\" font-size=\"17\" font-weight=\"700\" fill=\"#166534\" class=\"sb\">Write it</text></g><g class=\"sp74\"><rect x=\"590\" y=\"52\" width=\"126\" height=\"50\" rx=\"25\" fill=\"#ffe4e6\" stroke=\"#9f1239\" stroke-width=\"2.6\"/><text x=\"653\" y=\"84\" text-anchor=\"middle\" font-size=\"17\" font-weight=\"700\" fill=\"#9f1239\" class=\"sb\">Check it</text></g><path d=\"M60 236 H660\" fill=\"none\" stroke=\"#c7d2fe\" stroke-width=\"10\" stroke-linecap=\"round\" stroke-dasharray=\"12 10\"><animate attributeName=\"stroke-dashoffset\" values=\"0;-44\" keyTimes=\"0;1\" dur=\"1.4s\" repeatCount=\"indefinite\"/></path><g transform=\"translate(70,300)\"><animateMotion dur=\"6.0s\" begin=\"0s\" repeatCount=\"indefinite\" path=\"M0 0 H500\"/><ellipse cx=\"0.0\" cy=\"2.8\" rx=\"21.8\" ry=\"5.7\" fill=\"#000\" opacity=\"0.12\"/><g class=\"a7wklL\"><path d=\"M-6.2 -24.7 L-6.2 -8.5\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"11.9\" stroke-linecap=\"round\"/><path d=\"M-6.2 -24.7 L-6.2 -8.5\" fill=\"none\" stroke=\"#2f6bcf\" stroke-width=\"8.5\" stroke-linecap=\"round\"/></g><g class=\"a7wklR\"><path d=\"M6.2 -24.7 L6.2 -8.5\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"11.9\" stroke-linecap=\"round\"/><path d=\"M6.2 -24.7 L6.2 -8.5\" fill=\"none\" stroke=\"#2f6bcf\" stroke-width=\"8.5\" stroke-linecap=\"round\"/></g><rect x=\"-12.3\" y=\"-9.5\" width=\"16.1\" height=\"9.5\" rx=\"4.8\" fill=\"#334155\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><rect x=\"-2.8\" y=\"-9.5\" width=\"16.1\" height=\"9.5\" rx=\"4.8\" fill=\"#334155\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><path d=\"M-13.3 -24.7 L-17.1 -42.8 Q-17.1 -49.4 -9.5 -50.3 L9.5 -50.3 Q17.1 -49.4 17.1 -42.8 L13.3 -24.7 Z\" fill=\"#7c3aed\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><path d=\"M-5.7 -50.3 Q0.0 -45.6 5.7 -50.3\" fill=\"#7c3aed\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><g class=\"a7wkaL\"><path d=\"M-16.1 -44.6 Q-20.9 -36.1 -18.1 -28.5\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"9.1\" stroke-linecap=\"round\"/><path d=\"M-16.1 -44.6 Q-20.9 -36.1 -18.1 -28.5\" fill=\"none\" stroke=\"#f6c9a0\" stroke-width=\"5.7\" stroke-linecap=\"round\"/></g><g class=\"a7wkaR\"><path d=\"M16.1 -44.6 Q20.9 -36.1 18.1 -28.5\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"9.1\" stroke-linecap=\"round\"/><path d=\"M16.1 -44.6 Q20.9 -36.1 18.1 -28.5\" fill=\"none\" stroke=\"#f6c9a0\" stroke-width=\"5.7\" stroke-linecap=\"round\"/></g><circle cx=\"-18.1\" cy=\"-28.5\" r=\"3.2\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"18.1\" cy=\"-28.5\" r=\"3.2\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><rect x=\"-3.3\" y=\"-55.1\" width=\"6.6\" height=\"6.6\" rx=\"2.8\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><circle cx=\"-15.7\" cy=\"-68.4\" r=\"4.0\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"15.7\" cy=\"-68.4\" r=\"4.0\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><g class=\"a7wkhd\"><circle cx=\"0.0\" cy=\"-68.4\" r=\"15.2\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><path d=\"M-15.2 -70.3 Q-18.1 -87.4 0.0 -87.4 Q18.1 -87.4 15.2 -70.3 Q9.5 -76.0 3.8 -73.1 Q-1.9 -76.0 -7.6 -73.1 Q-11.4 -76.0 -15.2 -70.3 Z\" fill=\"#4a3222\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><g class=\"a7wkey\"><ellipse cx=\"-5.1\" cy=\"-68.4\" rx=\"3.4\" ry=\"4.1\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"-5.5\" cy=\"-67.9\" r=\"1.9\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"-4.3\" cy=\"-69.6\" r=\"0.8\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><ellipse cx=\"5.1\" cy=\"-68.4\" rx=\"3.4\" ry=\"4.1\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"5.5\" cy=\"-67.9\" r=\"1.9\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"4.3\" cy=\"-69.6\" r=\"0.8\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/></g><path d=\"M-7.6 -76.0 q2.8 -2.1 5.7 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><path d=\"M1.9 -76.0 q2.8 -2.1 5.7 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><ellipse cx=\"-9.5\" cy=\"-62.7\" rx=\"3.4\" ry=\"2.3\" fill=\"#f87171\" opacity=\"0.35\"/><ellipse cx=\"9.5\" cy=\"-62.7\" rx=\"3.4\" ry=\"2.3\" fill=\"#f87171\" opacity=\"0.35\"/><path d=\"M-4.3 -60.8 q4.3 4.6 8.5 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g></g><rect x=\"180\" y=\"268\" width=\"360\" height=\"38\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"360\" y=\"293\" text-anchor=\"middle\" font-size=\"17\" font-weight=\"700\" fill=\"#1f2937\" class=\"sb\">Five steps, every time</text></g></svg>",
        "alt": "Animated cartoon: a boy in a purple shirt walks along a dotted path past five signposts labelled Say it, Clap it, Chunk it, Write it and Check it, which pop up one after another.",
        "caption": "Walk the five steps: say it, clap it, chunk it, write it, check it."
      }
    },
    {
      "icon": "🐰",
      "title": "Our spelling words for this week",
      "explain": "These are the eight words we are learning: rabbit, garden, kitten, table, candle, thunder, children, elephant. Every one of them can be clapped and chunked, so use the routine on each word.\n\nMemory tricks help with the tricky parts. Rabbit has two b letters because a rabbit has two ears standing up. Kitten has two t letters because there are two of them in the middle. Thunder has a silent h you cannot hear, and children is not spelt with a t.\n\nThese words go into your Word Hoard. In the spelling stage you will see each word, hear it read aloud, say the letters back, then type it. Spell a word correctly ten times in a row and it is yours.",
      "example": "Rabbit chunks into rab plus bit, and the two b letters in the middle are the two ears you can picture.",
      "notice": "Kitten is often written with one t. Clap kit-ten and you can hear both t letters in the middle.",
      "check": {
        "type": "multiple_choice",
        "question": "Which spelling is correct?",
        "options": [
          "rabit",
          "rabbit",
          "rabbitt",
          "rabbit"
        ],
        "correct_index": 1,
        "explanation": "Rabbit has two b letters in the middle, like a rabbit''s two ears."
      },
      "visual": {
        "svg": "<svg viewBox=\"0 0 720 320\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>@keyframes legA{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(26deg)}}@keyframes legB{0%,100%{transform:rotate(26deg)}50%{transform:rotate(-24deg)}}@keyframes armA{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-26deg)}}@keyframes armB{0%,100%{transform:rotate(-26deg)}50%{transform:rotate(22deg)}}@keyframes waveArm{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(-40deg)}}@keyframes wag{0%,100%{transform:rotate(-18deg)}50%{transform:rotate(18deg)}}@keyframes flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.4)}}@keyframes sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}@keyframes drift{0%{transform:translateX(-12px)}100%{transform:translateX(14px)}}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes bite{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.5)}}@keyframes rise{0%{transform:translateY(6px) scale(.6);opacity:0}18%{opacity:1}100%{transform:translateY(-54px) scale(1);opacity:0}}@keyframes fall{0%{transform:translateY(-14px);opacity:0}18%{opacity:1}100%{transform:translateY(26px);opacity:0}}@keyframes pop{0%{transform:scale(.5);opacity:0}55%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}@keyframes blink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}@keyframes ripple{0%,100%{transform:scaleX(1);opacity:.7}50%{transform:scaleX(1.2);opacity:1}}@keyframes float{0%{transform:translate(0,0)}50%{transform:translate(4px,-3px)}100%{transform:translate(-3px,2px)}}@keyframes jump{0%,100%{transform:translateY(0)}30%{transform:translateY(-14px)}}.a8rber{animation:flap 1.6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a8rbhd{animation:bob .8s ease-in-out infinite}.a8rbey{animation:blink 4.4s linear infinite;transform-box:fill-box;transform-origin:50% 50%}.a8jrl{animation:bob 1.8s ease-in-out infinite}.a8pc{animation:bob .9s ease-in-out infinite}.sb{font-family:Arial,sans-serif;font-weight:700}.st{font-family:Arial,sans-serif}@media (prefers-reduced-motion:reduce){.scn *{animation:none !important}animate{display:none}}</style><g class=\"scn\"><rect x=\"0\" y=\"0\" width=\"720\" height=\"320\" rx=\"20\" fill=\"#f2fbf3\"/><rect x=\"0\" y=\"222\" width=\"720\" height=\"98\" rx=\"0\" fill=\"#8fe38f\"/><ellipse cx=\"150.0\" cy=\"247.2\" rx=\"26.0\" ry=\"16.9\" fill=\"#e7e2da\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><circle cx=\"129.2\" cy=\"239.4\" r=\"7.8\" fill=\"#cfc8bd\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><g class=\"a8rbhd\"><circle cx=\"173.4\" cy=\"226.4\" r=\"16.9\" fill=\"#e7e2da\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><g class=\"a8rber\"><path d=\"M166.9 213.4 q-3.9 -15.6 -6.5 -28.6 q10.4 7.8 5.2 20.8 Z\" fill=\"#e7e2da\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><g class=\"a8rber\"><path d=\"M181.2 213.4 q3.9 -15.6 9.1 -26.0 q-9.1 6.5 -5.2 18.2 Z\" fill=\"#e7e2da\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><g class=\"a8rbey\"><ellipse cx=\"177.8\" cy=\"225.1\" rx=\"2.9\" ry=\"3.5\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"178.1\" cy=\"225.5\" r=\"1.6\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"177.0\" cy=\"224.1\" r=\"0.7\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/></g><circle cx=\"185.1\" cy=\"230.3\" r=\"2.9\" fill=\"#f08ea8\" stroke=\"#2b2521\" stroke-width=\"1.4\"/><path d=\"M178.6 235.5 q3.9 3.9 7.8 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"1.8\" stroke-linejoin=\"round\"/></g><g class=\"a8jrl\"><rect x=\"385.5\" y=\"218.7\" width=\"69.0\" height=\"71.3\" rx=\"13.8\" fill=\"#dff2ff\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><rect x=\"397.0\" y=\"209.5\" width=\"46.0\" height=\"11.5\" rx=\"4.6\" fill=\"#8b5a2b\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><rect x=\"388.9\" y=\"224.4\" width=\"29.9\" height=\"16.1\" rx=\"3.4\" fill=\"#fff6d6\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><rect x=\"416.6\" y=\"224.4\" width=\"29.9\" height=\"16.1\" rx=\"3.4\" fill=\"#fff6d6\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><rect x=\"388.9\" y=\"246.3\" width=\"29.9\" height=\"16.1\" rx=\"3.4\" fill=\"#fff6d6\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><rect x=\"416.6\" y=\"246.3\" width=\"29.9\" height=\"16.1\" rx=\"3.4\" fill=\"#fff6d6\" stroke=\"#2b2521\" stroke-width=\"2.2\"/></g><g class=\"a8pc\" transform=\"translate(628.0,190.0) rotate(-20)\"><rect x=\"-5.5\" y=\"-17.6\" width=\"11.0\" height=\"33.0\" rx=\"2.2\" fill=\"#f6c344\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><path d=\"M0 -17.6 L-5.5 -24.2 L5.5 -24.2 Z\" fill=\"#e2b07a\" stroke=\"#2b2521\" stroke-width=\"1.6\" stroke-linejoin=\"round\"/><path d=\"M0 -26.4 L-2.9 -24.2 L2.9 -24.2 Z\" fill=\"#3b3b3b\" stroke=\"#2b2521\" stroke-width=\"0.0\" stroke-linejoin=\"round\"/><rect x=\"-5.5\" y=\"12.1\" width=\"11.0\" height=\"6.6\" rx=\"2.2\" fill=\"#ef7d7d\" stroke=\"#2b2521\" stroke-width=\"2.2\"/></g><rect x=\"40\" y=\"34\" width=\"300\" height=\"42\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"190\" y=\"62\" text-anchor=\"middle\" font-size=\"20\" font-weight=\"700\" fill=\"#1f2937\" class=\"sb\">rabbit</text><rect x=\"378\" y=\"34\" width=\"300\" height=\"42\" rx=\"14\" fill=\"#ffe4e6\" stroke=\"#be123c\" stroke-width=\"2.6\"/><text x=\"528\" y=\"62\" text-anchor=\"middle\" font-size=\"17\" font-weight=\"700\" fill=\"#9f1239\" class=\"sb\">two b, two ears</text><rect x=\"160\" y=\"96\" width=\"400\" height=\"40\" rx=\"14\" fill=\"#dcfce7\" stroke=\"#166534\" stroke-width=\"2.6\"/><text x=\"360\" y=\"122\" text-anchor=\"middle\" font-size=\"17\" font-weight=\"700\" fill=\"#166534\" class=\"sb\">rab-bit: clap it, then write it</text><text x=\"360\" y=\"250\" text-anchor=\"middle\" font-size=\"16\" font-weight=\"700\" fill=\"#334155\" class=\"st\">Words go in the Word Hoard</text></g></svg>",
        "alt": "Animated cartoon: a grey rabbit stands beside a glass Word Hoard jar holding word cards for rabbit, garden, kitten and candle while a pencil writes in the air and cards above show rabbit and the trick two b, two ears.",
        "caption": "Rab-bit: clap it, then write it, and the two b letters become the rabbit''s ears."
      }
    }
  ],
  "worked_example": "I do: watch me spell elephant. I say it first: elephant. Then I clap it: el, e, phant, three claps, so three chunks. I write one chunk at a time: el, then e, then phant. I join them: elephant. Then I check it by reading the chunks back: el-e-phant.\n\nWe do: you clap the word garden with me. Gar, den. Two claps, two chunks. I write gar and you write den. Now read the chunks together: garden. Does it sound right? Yes.\n\nYou do: on your own, use the same routine on the word hippopotamus. Clap it first, count the beats, then chunk it before you write it. Check your chunks to be sure every chunk has a vowel sound.",
  "worked_visuals": [
    {
      "svg": "<svg viewBox=\"0 0 720 360\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>@keyframes legA{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(26deg)}}@keyframes legB{0%,100%{transform:rotate(26deg)}50%{transform:rotate(-24deg)}}@keyframes armA{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-26deg)}}@keyframes armB{0%,100%{transform:rotate(-26deg)}50%{transform:rotate(22deg)}}@keyframes waveArm{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(-40deg)}}@keyframes wag{0%,100%{transform:rotate(-18deg)}50%{transform:rotate(18deg)}}@keyframes flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.4)}}@keyframes sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}@keyframes drift{0%{transform:translateX(-12px)}100%{transform:translateX(14px)}}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes bite{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.5)}}@keyframes rise{0%{transform:translateY(6px) scale(.6);opacity:0}18%{opacity:1}100%{transform:translateY(-54px) scale(1);opacity:0}}@keyframes fall{0%{transform:translateY(-14px);opacity:0}18%{opacity:1}100%{transform:translateY(26px);opacity:0}}@keyframes pop{0%{transform:scale(.5);opacity:0}55%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}@keyframes blink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}@keyframes ripple{0%,100%{transform:scaleX(1);opacity:.7}50%{transform:scaleX(1.2);opacity:1}}@keyframes float{0%{transform:translate(0,0)}50%{transform:translate(4px,-3px)}100%{transform:translate(-3px,2px)}}@keyframes jump{0%,100%{transform:translateY(0)}30%{transform:translateY(-14px)}}.w1b0{animation:pop .5s ease-out both;animation-delay:0.50s}.w1b1{animation:pop .5s ease-out both;animation-delay:0.95s}.w1b2{animation:pop .5s ease-out both;animation-delay:1.40s}.w1b3{animation:pop .5s ease-out both;animation-delay:1.85s}.w1b4{animation:pop .5s ease-out both;animation-delay:2.30s}.tk1{animation:pop .5s ease-out both;animation-delay:.6s}.x2{animation:pop .5s ease-out both;animation-delay:1.2s}.sb{font-family:Arial,sans-serif;font-weight:700}.st{font-family:Arial,sans-serif}@media (prefers-reduced-motion:reduce){.scn *{animation:none !important}animate{display:none}}</style><g class=\"scn\"><rect x=\"0\" y=\"0\" width=\"720\" height=\"360\" rx=\"20\" fill=\"#f8fafc\"/><rect x=\"24\" y=\"24\" width=\"672\" height=\"150\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><rect x=\"24\" y=\"206\" width=\"672\" height=\"150\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"60\" y=\"68\" text-anchor=\"start\" font-size=\"24\" font-weight=\"700\" fill=\"#166534\" class=\"sb\">hip-po-pot-a-mus</text><text x=\"60\" y=\"96\" text-anchor=\"start\" font-size=\"15\" font-weight=\"700\" fill=\"#475569\" class=\"st\">each chunk has one vowel sound</text><g class=\"w1b0\"><circle cx=\"112.0\" cy=\"132.0\" r=\"13.0\" fill=\"#2563eb\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><text x=\"112.0\" y=\"136.4\" text-anchor=\"middle\" font-size=\"13.0\" font-weight=\"700\" fill=\"#ffffff\">1</text><text x=\"112.0\" y=\"163.0\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#334155\">hip</text></g><g class=\"w1b1\"><circle cx=\"144.5\" cy=\"132.0\" r=\"13.0\" fill=\"#2563eb\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><text x=\"144.5\" y=\"136.4\" text-anchor=\"middle\" font-size=\"13.0\" font-weight=\"700\" fill=\"#ffffff\">2</text><text x=\"144.5\" y=\"163.0\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#334155\">po</text></g><g class=\"w1b2\"><circle cx=\"177.0\" cy=\"132.0\" r=\"13.0\" fill=\"#2563eb\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><text x=\"177.0\" y=\"136.4\" text-anchor=\"middle\" font-size=\"13.0\" font-weight=\"700\" fill=\"#ffffff\">3</text><text x=\"177.0\" y=\"163.0\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#334155\">pot</text></g><g class=\"w1b3\"><circle cx=\"209.5\" cy=\"132.0\" r=\"13.0\" fill=\"#2563eb\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><text x=\"209.5\" y=\"136.4\" text-anchor=\"middle\" font-size=\"13.0\" font-weight=\"700\" fill=\"#ffffff\">4</text><text x=\"209.5\" y=\"163.0\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#334155\">a</text></g><g class=\"w1b4\"><circle cx=\"242.0\" cy=\"132.0\" r=\"13.0\" fill=\"#2563eb\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><text x=\"242.0\" y=\"136.4\" text-anchor=\"middle\" font-size=\"13.0\" font-weight=\"700\" fill=\"#ffffff\">5</text><text x=\"242.0\" y=\"163.0\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#334155\">mus</text></g><g class=\"tk1\"><path d=\"M636 74 l9 9 18-22\" fill=\"none\" stroke=\"#15803d\" stroke-width=\"5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></g><text x=\"60\" y=\"250\" text-anchor=\"start\" font-size=\"24\" font-weight=\"700\" fill=\"#991b1b\" class=\"sb\">hip-po-pot-amus</text><text x=\"60\" y=\"278\" text-anchor=\"start\" font-size=\"15\" font-weight=\"700\" fill=\"#475569\" class=\"st\">the last chunk has no vowel sound</text><g class=\"x2\"><path d=\"M636 262 l20 20 m0-20 l-20 20\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></g></g></svg>",
      "alt": "Animated cartoon: two white cards, the top one showing hip-po-pot-a-mus in green with five numbered chunk dots and a green tick, the bottom one showing hip-po-pot-amus in red with a red cross and the note that the last chunk has no vowel sound.",
      "caption": "Right chunking gives every chunk a vowel sound, so the top card earns the tick."
    },
    {
      "svg": "<svg viewBox=\"0 0 720 300\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>@keyframes legA{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(26deg)}}@keyframes legB{0%,100%{transform:rotate(26deg)}50%{transform:rotate(-24deg)}}@keyframes armA{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-26deg)}}@keyframes armB{0%,100%{transform:rotate(-26deg)}50%{transform:rotate(22deg)}}@keyframes waveArm{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(-40deg)}}@keyframes wag{0%,100%{transform:rotate(-18deg)}50%{transform:rotate(18deg)}}@keyframes flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.4)}}@keyframes sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}@keyframes drift{0%{transform:translateX(-12px)}100%{transform:translateX(14px)}}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes bite{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.5)}}@keyframes rise{0%{transform:translateY(6px) scale(.6);opacity:0}18%{opacity:1}100%{transform:translateY(-54px) scale(1);opacity:0}}@keyframes fall{0%{transform:translateY(-14px);opacity:0}18%{opacity:1}100%{transform:translateY(26px);opacity:0}}@keyframes pop{0%{transform:scale(.5);opacity:0}55%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}@keyframes blink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}@keyframes ripple{0%,100%{transform:scaleX(1);opacity:.7}50%{transform:scaleX(1.2);opacity:1}}@keyframes float{0%{transform:translate(0,0)}50%{transform:translate(4px,-3px)}100%{transform:translate(-3px,2px)}}@keyframes jump{0%,100%{transform:translateY(0)}30%{transform:translateY(-14px)}}.w2elhd{animation:bob .9s ease-in-out infinite}.w2eltr{animation:sway 1.6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.w2eler{animation:flap 1.8s ease-in-out infinite;transform-box:fill-box;transform-origin:80% 20%}.w2cll{animation:clapL .42s ease-in-out infinite}.w2clr{animation:clapR .42s ease-in-out infinite}.w2b0{animation:pop .5s ease-out both;animation-delay:0.50s}.w2b1{animation:pop .5s ease-out both;animation-delay:0.95s}.w2b2{animation:pop .5s ease-out both;animation-delay:1.40s}.sb{font-family:Arial,sans-serif;font-weight:700}@media (prefers-reduced-motion:reduce){.scn *{animation:none !important}animate{display:none}}</style><g class=\"scn\"><defs><linearGradient id=\"gl3w2\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#a9d8ff\"/><stop offset=\"0.62\" stop-color=\"#d8efff\"/><stop offset=\"1\" stop-color=\"#eef9ff\"/></linearGradient></defs><rect width=\"720\" height=\"300\" rx=\"20\" fill=\"url(#gl3w2)\"/><rect x=\"0\" y=\"208\" width=\"720\" height=\"92\" rx=\"0\" fill=\"#8fe38f\"/><path d=\"M127.5 274.5 L127.5 254.5\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"12.2\" stroke-linecap=\"round\"/><path d=\"M127.5 274.5 L127.5 254.5\" fill=\"none\" stroke=\"#a8b3c4\" stroke-width=\"8.8\" stroke-linecap=\"round\"/><path d=\"M170.0 274.5 L170.0 254.5\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"12.2\" stroke-linecap=\"round\"/><path d=\"M170.0 274.5 L170.0 254.5\" fill=\"none\" stroke=\"#a8b3c4\" stroke-width=\"8.8\" stroke-linecap=\"round\"/><ellipse cx=\"150.0\" cy=\"249.5\" rx=\"32.5\" ry=\"17.5\" fill=\"#a8b3c4\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><g class=\"w2elhd\"><circle cx=\"182.5\" cy=\"234.5\" r=\"18.8\" fill=\"#a8b3c4\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><g class=\"w2eler\"><path d=\"M176.2 218.2 q-11.2 -3.8 -21.2 10.0 q2.5 10.0 12.5 7.5 q6.2 -3.8 8.8 -17.5 Z\" fill=\"#93a3b8\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><g class=\"w2eltr\"><path d=\"M195.0 239.5 Q205.0 257.0 192.5 264.5\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"10.9\" stroke-linecap=\"round\"/><path d=\"M195.0 239.5 Q205.0 257.0 192.5 264.5\" fill=\"none\" stroke=\"#a8b3c4\" stroke-width=\"7.5\" stroke-linecap=\"round\"/></g><ellipse cx=\"190.4\" cy=\"230.8\" rx=\"2.8\" ry=\"3.3\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"190.7\" cy=\"231.1\" r=\"1.6\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"189.7\" cy=\"229.7\" r=\"0.7\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/></g><g transform=\"translate(560.0,152.0)\"><g class=\"w2cll\"><rect x=\"-20.9\" y=\"-22.8\" width=\"17.1\" height=\"20.9\" rx=\"6.6\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><rect x=\"-20.9\" y=\"-34.2\" width=\"17.1\" height=\"13.3\" rx=\"5.7\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/></g><g class=\"w2clr\"><rect x=\"3.8\" y=\"-22.8\" width=\"17.1\" height=\"20.9\" rx=\"6.6\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><rect x=\"3.8\" y=\"-34.2\" width=\"17.1\" height=\"13.3\" rx=\"5.7\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/></g><path d=\"M-30.4 0 L-17.1 -7.6\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"9.1\" stroke-linecap=\"round\"/><path d=\"M-30.4 0 L-17.1 -7.6\" fill=\"none\" stroke=\"#f6c9a0\" stroke-width=\"5.7\" stroke-linecap=\"round\"/><path d=\"M30.4 0 L17.1 -7.6\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"9.1\" stroke-linecap=\"round\"/><path d=\"M30.4 0 L17.1 -7.6\" fill=\"none\" stroke=\"#f6c9a0\" stroke-width=\"5.7\" stroke-linecap=\"round\"/></g><g class=\"w2b0\"><circle cx=\"300.0\" cy=\"104.0\" r=\"15.0\" fill=\"#2563eb\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><text x=\"300.0\" y=\"109.1\" text-anchor=\"middle\" font-size=\"15.0\" font-weight=\"700\" fill=\"#ffffff\">1</text><text x=\"300.0\" y=\"137.0\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#334155\">el</text></g><g class=\"w2b1\"><circle cx=\"337.5\" cy=\"104.0\" r=\"15.0\" fill=\"#ea580c\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><text x=\"337.5\" y=\"109.1\" text-anchor=\"middle\" font-size=\"15.0\" font-weight=\"700\" fill=\"#ffffff\">2</text><text x=\"337.5\" y=\"137.0\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#334155\">e</text></g><g class=\"w2b2\"><circle cx=\"375.0\" cy=\"104.0\" r=\"15.0\" fill=\"#7c3aed\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><text x=\"375.0\" y=\"109.1\" text-anchor=\"middle\" font-size=\"15.0\" font-weight=\"700\" fill=\"#ffffff\">3</text><text x=\"375.0\" y=\"137.0\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#334155\">phant</text></g><rect x=\"40\" y=\"26\" width=\"320\" height=\"44\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"200\" y=\"56\" text-anchor=\"middle\" font-size=\"20\" font-weight=\"700\" fill=\"#1f2937\" class=\"sb\">el-e-phant</text><rect x=\"380\" y=\"26\" width=\"300\" height=\"44\" rx=\"14\" fill=\"#dcfce7\" stroke=\"#166534\" stroke-width=\"2.6\"/><text x=\"530\" y=\"56\" text-anchor=\"middle\" font-size=\"17\" font-weight=\"700\" fill=\"#166534\" class=\"sb\">3 chunks, 3 claps</text><rect x=\"300\" y=\"240\" width=\"380\" height=\"40\" rx=\"14\" fill=\"#dbeafe\" stroke=\"#3b82f6\" stroke-width=\"2.6\"/><text x=\"490\" y=\"266\" text-anchor=\"middle\" font-size=\"17\" font-weight=\"700\" fill=\"#17428f\" class=\"sb\">Say it as you clap it</text></g></svg>",
      "alt": "Animated cartoon: a cartoon elephant with a swaying trunk beside three numbered chunk cards labelled el, e and phant, clapping hands and the caption that three chunks means three claps.",
      "caption": "Elephant claps three times, so it chunks into el-e-phant."
    }
  ],
  "guided_practice": "Part A: Clap and count. Say each word and write how many syllables it has.\n1. table  2. tree  3. thunder  4. butterfly\nHint: clap once as you say each part.\nAnswer: table 2, tree 1, thunder 2, butterfly 3.\n\nPart B: Find the vowel sound. Write the vowel sound you can hear in each word.\n1. cat  2. rain  3. boat  4. kitten\nHint: two vowel letters can make one sound.\nAnswer: cat a (1 syllable), rain ai (1 syllable), boat oa (1 syllable), kitten i and e (2 syllables).\n\nPart C: Chunk it. Write each word in chunks.\n1. garden  2. kitten  3. candle  4. rabbit\nHint: every chunk needs one vowel sound.\nAnswer: gar-den, kit-ten, can-dle, rab-bit. Accept any chunking that keeps a vowel in every chunk, for example kit-ten or k-it-ten.\n\nPart D: Spelling blanks. Write the whole word, then say the chunks out loud.\n1. ra __ it  2. kit __ en  3. can __ le  4. child __ en  5. ele __ hant\nHint: use the memory tricks. A rabbit has two ears.\nAnswer: rabbit, kitten, candle, children, elephant.",
  "independent_task": "Work from the easiest part to the hardest. Write your answers in your book.\n\nPart 1: Clap and write the number of syllables.\n1. dog  2. candle  3. elephant  4. children  5. tree\n\nPart 2: Chunk these words and write them in your book.\n6. garden  7. thunder  8. kitten  9. butterfly  10. hippopotamus\n\nPart 3: Which chunk is wrong? One chunk in each word has no vowel sound. Write the correct chunking.\n11. gard-en  12. el-e-ph-ant  13. kit-tn\n\nPart 4: Sort these words into one clap, two claps and three claps.\n14. cat  15. rabbit  16. butterfly  17. table  18. dog  19. elephant\n\nPart 5: On paper, draw a beat box for each of these words. Draw one box for every syllable you can hear, then write each chunk inside its own box.\n20. table  21. kitten  22. thunder  23. elephant\n\nPart 6: Write a silly sentence that uses three of this week''s words. Underline the words you used.\n\nPart 7: Spelling sentences. Write a sentence for each word, spelling it correctly.\n24. rabbit  25. garden  26. candle",
  "response_prompt": "Which word was the hardest to chunk, and which trick helped you?",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "What is a syllable?",
      "options": [
        "A letter in a word",
        "A beat or word part with one vowel sound",
        "A whole sentence",
        "A punctuation mark"
      ],
      "correct_index": 1,
      "explanation": "A syllable is one beat in a word, and each beat has one vowel sound."
    },
    {
      "type": "multiple_choice",
      "question": "How many syllables are in the word table?",
      "options": [
        "1",
        "2",
        "3",
        "4"
      ],
      "correct_index": 1,
      "explanation": "Ta-ble has two beats, so two syllables."
    },
    {
      "type": "multiple_choice",
      "question": "How many syllables are in the word butterfly?",
      "options": [
        "1",
        "2",
        "3",
        "4"
      ],
      "correct_index": 2,
      "explanation": "But-ter-fly has three beats, so three syllables."
    },
    {
      "type": "multiple_choice",
      "question": "Every syllable must have which of these?",
      "options": [
        "A capital letter",
        "One vowel sound",
        "Two consonants",
        "A full stop"
      ],
      "correct_index": 1,
      "explanation": "Each beat has one vowel sound. A chunk with no vowel sound is not a syllable."
    },
    {
      "type": "multiple_choice",
      "question": "How many vowel sounds can you hear in the word rain?",
      "options": [
        "1",
        "2",
        "3",
        "4"
      ],
      "correct_index": 0,
      "explanation": "The letters ai make one vowel sound, so rain has one syllable."
    },
    {
      "type": "multiple_choice",
      "question": "Which is the best chunking of the word kitten?",
      "options": [
        "ki-tt-en",
        "kit-ten",
        "kitt-en",
        "k-i-t-t-e-n"
      ],
      "correct_index": 1,
      "explanation": "Kit-ten keeps one vowel sound in each chunk."
    },
    {
      "type": "multiple_choice",
      "question": "Which word ends with the -le pattern that says ull?",
      "options": [
        "little",
        "letter",
        "lid",
        "lolly"
      ],
      "correct_index": 0,
      "explanation": "Lit-tle ends with l and e making the ull sound."
    },
    {
      "type": "multiple_choice",
      "question": "How many sounds can you hear in the word ship?",
      "options": [
        "2",
        "3",
        "4",
        "5"
      ],
      "correct_index": 1,
      "explanation": "Sh is one sound, then i, then p. Three sounds in one syllable."
    },
    {
      "type": "multiple_choice",
      "question": "What is the third step of the spelling routine?",
      "options": [
        "Say it",
        "Clap it",
        "Chunk it",
        "Write it"
      ],
      "correct_index": 2,
      "explanation": "The order is say it, clap it, chunk it, write it, check it."
    },
    {
      "type": "multiple_choice",
      "question": "Which spelling of this word is correct?",
      "options": [
        "chilren",
        "children",
        "childern",
        "childen"
      ],
      "correct_index": 1,
      "explanation": "Children is spelt c h i l d r e n. It has two chunks: chil-dren."
    }
  ],
  "word_challenges": [
    {
      "type": "multiple_choice",
      "question": "What does the word syllable mean?",
      "options": [
        "A beat or word part with one vowel sound",
        "A loud noise",
        "A type of letter",
        "A whole sentence"
      ],
      "correct_index": 0,
      "explanation": "A syllable is a beat in a word with one vowel sound."
    },
    {
      "type": "multiple_choice",
      "question": "What does chunk mean in this lesson?",
      "options": [
        "To eat quickly",
        "To cut a word into beats",
        "To shout a word",
        "To rhyme a word"
      ],
      "correct_index": 1,
      "explanation": "When you chunk a word you cut it into the parts you can clap."
    },
    {
      "type": "multiple_choice",
      "question": "What does stretch mean when you spell?",
      "options": [
        "To say a word very slowly to hear each sound",
        "To make letters bigger",
        "To write on a line",
        "To copy a word"
      ],
      "correct_index": 0,
      "explanation": "Stretching the word helps you hear the small sounds inside a beat."
    },
    {
      "type": "multiple_choice",
      "question": "What is the Word Hoard?",
      "options": [
        "A spelling mistake",
        "A list of words you are collecting and learning",
        "A type of book cover",
        "A kind of test"
      ],
      "correct_index": 1,
      "explanation": "The Word Hoard keeps the words you are learning and practising."
    },
    {
      "type": "multiple_choice",
      "question": "Which word is spelt correctly?",
      "options": [
        "rabit",
        "rabbit",
        "rabbitt",
        "rabitt"
      ],
      "correct_index": 1,
      "explanation": "Rabbit has two b letters in the middle, like a rabbit''s two ears."
    },
    {
      "type": "multiple_choice",
      "question": "Which word is spelt correctly?",
      "options": [
        "kitten",
        "kiten",
        "kittenn",
        "kittin"
      ],
      "correct_index": 0,
      "explanation": "Kitten has two t letters in the middle: kit-ten."
    },
    {
      "type": "multiple_choice",
      "question": "Which word is spelt correctly?",
      "options": [
        "candel",
        "candle",
        "candell",
        "kandle"
      ],
      "correct_index": 1,
      "explanation": "Candle ends with the -le pattern: can-dle."
    },
    {
      "type": "multiple_choice",
      "question": "Which word is spelt correctly?",
      "options": [
        "thunder",
        "thundar",
        "thundr",
        "thudder"
      ],
      "correct_index": 0,
      "explanation": "Thunder is spelt t h u n d e r. The th makes one sound."
    }
  ],
  "sort_activity": {
    "instructions": "Clap each word, then sort it into the right number of beats.",
    "buckets": [
      "One clap",
      "Two claps"
    ],
    "items": [
      {
        "text": "cat",
        "answer": 0
      },
      {
        "text": "rain",
        "answer": 0
      },
      {
        "text": "tree",
        "answer": 0
      },
      {
        "text": "boat",
        "answer": 0
      },
      {
        "text": "rabbit",
        "answer": 1
      },
      {
        "text": "garden",
        "answer": 1
      },
      {
        "text": "kitten",
        "answer": 1
      },
      {
        "text": "table",
        "answer": 1
      }
    ]
  },
  "interactive_activities": [
    {
      "type": "flip_cards",
      "title": "Word breaker words to know",
      "cards": [
        {
          "front": "syllable",
          "back": "one beat in a word, with one vowel sound in it"
        },
        {
          "front": "chunk",
          "back": "a part of a word that matches one beat, like rab in rabbit"
        },
        {
          "front": "vowel sound",
          "back": "the sound made by a, e, i, o or u. Every syllable has one"
        },
        {
          "front": "beat",
          "back": "the small push of your voice you hear when you say a word part"
        },
        {
          "front": "stretch",
          "back": "say a word very slowly so you can hear every sound"
        },
        {
          "front": "sound",
          "back": "the smallest piece you can hear in a word, like the sh in ship"
        },
        {
          "front": "blend",
          "back": "join sounds or chunks together to read or write the whole word"
        },
        {
          "front": "Word Hoard",
          "back": "the place your spelling words are kept so you can practise them"
        }
      ]
    }
  ],
  "spelling": {
    "focus": "Sounds and syllables",
    "teaching": "We are learning to spell words by hearing the beats and chunks inside them.\n\nSay the word out loud, clap the beats, and chunk the word into those beats. Spell one chunk at a time and join them.\n\nWatch the tricky parts. Rabbit has two b letters in the middle, like a rabbit''s two ears. Kitten has two t letters. Candle ends with the -le pattern that says ull.\n\nPractise each word until you can spell it correctly ten times in a row.",
    "words": [
      {
        "word": "rabbit",
        "parts": "rab - bit",
        "tip": "two b letters in the middle, like a rabbit''s two ears"
      },
      {
        "word": "garden",
        "parts": "gar - den",
        "tip": "ends with den, like a little den in the yard"
      },
      {
        "word": "kitten",
        "parts": "kit - ten",
        "tip": "two t letters in the middle"
      },
      {
        "word": "table",
        "parts": "ta - ble",
        "tip": "ends with the -le pattern that says ull"
      },
      {
        "word": "candle",
        "parts": "can - dle",
        "tip": "keep the d with the -le ending"
      },
      {
        "word": "thunder",
        "parts": "thun - der",
        "tip": "starts with th, which makes one sound"
      },
      {
        "word": "children",
        "parts": "chil - dren",
        "tip": "two chunks only, and no t in the middle"
      },
      {
        "word": "elephant",
        "parts": "el - e - phant",
        "tip": "three beats, and ph makes an f sound"
      }
    ],
    "check": [
      {
        "type": "multiple_choice",
        "question": "Which word is spelt correctly?",
        "options": [
          "rabbit",
          "rabit",
          "rabbitt"
        ],
        "correct_index": 0,
        "explanation": "Rabbit has two b letters in the middle."
      },
      {
        "type": "multiple_choice",
        "question": "How many chunks do you hear in elephant?",
        "options": [
          "1",
          "2",
          "3"
        ],
        "correct_index": 2,
        "explanation": "El-e-phant has three chunks."
      },
      {
        "type": "multiple_choice",
        "question": "Which word ends with the -le pattern?",
        "options": [
          "candle",
          "garden",
          "children"
        ],
        "correct_index": 0,
        "explanation": "Candle ends with -dle, part of the -le pattern."
      }
    ]
  },
  "hoard_words": [
    "rabbit",
    "garden",
    "kitten",
    "table",
    "candle",
    "thunder",
    "children",
    "elephant"
  ],
  "coming_soon": null,
  "parent_notes": "Rationale: syllabification is the single most useful spelling strategy for Year 3, because it turns unfamiliar long words into short chunks a child already knows how to spell. This lesson teaches the beat, the vowel rule, chunking, stretching and the -le ending in that order, so each idea supports the next.\n\nAssessment notes: listen for the child clapping the beats before writing. Fluent clapping and chunking matter more than speed. In Part C of the guided practice accept any chunking that keeps a vowel sound in every chunk, for example kit-ten or k-it-ten. In the independent task, Part 5 is the on paper drawing task and Part 7 is the spelling sentences. The quiz has ten questions; a score of nine or more shows the strategy has landed. If chunking is still shaky, repeat the clapping with two syllable words before returning to longer ones.",
  "explicit_teaching": "**The big idea.** Spelling stops being a memory test once a child can hear the parts inside a word. Syllables are the beats a word makes, and nearly every long word can be cut at its beats and spelt one short chunk at a time. This lesson teaches the beat, then the vowel rule that holds a beat together, then chunking, stretching and the -le ending. Every one of those skills feeds the same outcome: a child who can spell an unfamiliar word without asking an adult.\nYear 3 is the point where words stop being short, so the strategy matters more than any single word list.\n\n**How to open the lesson.** Do not begin with a definition. Ask your child to clap their own name, then clap yours, and let them notice that some names take one clap and some take three. Only after they have heard the beats should you say the word syllable. The clapping body knowledge comes first and the label second. Then read the mission aloud together so the child knows the goal is a routine, not a list.\n\n**Beats and clapping.** Teach the child to say the word slowly, then clap once as each part is said. The most common error is clapping for every letter, which is why cat should always be offered as the counter example: three letters, one beat. If your child claps too fast and the beats run together, ask them to say the word in a robot voice. Slow speech separates beats better than any explanation. Keep the practice to a handful of words at a time, because tired clapping is careless clapping.\n\n**The vowel rule.** Every syllable has one vowel sound, and this is the rule that repairs bad chunking. A child who writes hip-po-pot-amus has cut in the wrong place and left a chunk with no vowel sound. Teach them to check each chunk by asking whether it can be spoken as a beat on its own. Explain that two vowel letters can make one sound, as in rain and boat, so we count sounds and not letters.\n\n**Chunking and stretching together.** Chunking answers how many pieces the word has. Stretching answers which letters are inside each piece. Show both on the same word, for example rabbit: two claps, then r a b i t stretched slowly. Point out that sh in ship is one sound made of two letters, because this is the discovery that stops a child from spelling every sound as a single letter.\n\n**The -le ending.** Words like table, candle and little all end with the letters l and e saying ull. The routine is to find the -le, then keep the consonant before it with that last beat, giving ta-ble and can-dle. Errors such as candel or tabl disappear once the child hears the ull and remembers that l and e close the word.\n\n**The routine and why it matters.** Say it, clap it, chunk it, write it, check it. Have your child say the five steps out loud before they spell anything, and follow them without skipping. The check step is the one children leave out, so model reading the chunks back together and asking whether the word sounds like the word. Two sittings work well: steps one to four in the first sitting, then the routine, the spelling focus and the written work in the second.\n\n**The spelling work.** This week''s words are rabbit, garden, kitten, table, candle, thunder, children and elephant. Tell the story of the rabbit with two ears to explain the double b, and let your child draw the two ears above the letters. Kitten carries the same idea with its double t. In the spelling stage the child sees the word, hears it read aloud, says the letters and then types it, and a word is mastered after ten correct spellings in a row. Keep the practice short and daily rather than long and occasional.\n\n**What to watch for, and how to fix it.** If your child can clap but cannot chunk, they are probably chunking from the letters rather than the beats; send them back to the clapping. If they chunk well but misspell inside a chunk, they need stretching practice on that word alone. If a word keeps defeating them, write it in chunks in two colours and have them trace it before writing it independently. Prompt with questions such as how many claps did you hear and does every chunk have a vowel sound, rather than giving the answer.\n\n**Pacing across two sittings.** The lesson is written for about forty five minutes, but it splits cleanly in half. In the first sitting take steps one to four, which cover the beat, the clapping, the vowel rule and chunking. In the second sitting take steps five to eight, which cover stretching, the -le ending, the routine and the spelling words, then work through the guided practice, the main task and the quiz. If you only have ten minutes, clapping four words still helps.\n\n**How to know it has worked.** The clearest sign is a child who claps before they write without being reminded, then reads their chunks back to check the word. That is the habit this lesson is really building. Spelling the eight words correctly is the short term target, but the long term prize is that any long word can be beaten with the same five steps. Revisit the routine in later weeks, for example when a new word list arrives, and ask your child to clap and chunk the word before they copy it.",
  "evidence_instructions": "Keep the written work from the independent task, especially the beat boxes in Part 5 and the spelling sentences in Part 7. A photo of the beat boxes is useful evidence of chunking.",
  "offline_alternative": "Everything in this lesson works without a device. Print the pages you need, or write the parts out by hand. Read the spelling words aloud yourself and let your child clap, chunk, write and check with you.",
  "extension": "Find five long words in a book you are reading, clap the beats and chunk them in your book. Then write a two sentence story that uses at least three of this week''s spelling words.",
  "planner_title": "Plan your chunking",
  "planner_intro": "Pick three words from this week''s list. Clap each one, then write the chunks.",
  "planner_fields": [
    {
      "key": "word1",
      "label": "Word 1",
      "hint": "clap it first, then write the chunks, for example rab-bit"
    },
    {
      "key": "word2",
      "label": "Word 2",
      "hint": "how many claps did you hear?"
    },
    {
      "key": "word3",
      "label": "Word 3",
      "hint": "type the whole word too, not just the chunks"
    }
  ],
  "glossary": [
    [
      "syllable",
      "a beat or word part with one vowel sound"
    ],
    [
      "chunk",
      "a part of a word that matches one beat"
    ],
    [
      "vowel sound",
      "the sound a, e, i, o or u makes; every syllable has one"
    ],
    [
      "beat",
      "the small push your voice makes in a word part"
    ],
    [
      "stretch",
      "say a word very slowly to hear every sound"
    ],
    [
      "sound",
      "the smallest piece you can hear in a word"
    ],
    [
      "blend",
      "to join sounds or chunks together"
    ],
    [
      "Word Hoard",
      "where your spelling words are kept for practice"
    ]
  ],
  "common_mistakes": [
    [
      "Clapping once for every letter",
      "Remind them that cat is three letters but one beat."
    ],
    [
      "Writing a chunk with no vowel sound",
      "Check every chunk by saying it on its own as a beat."
    ],
    [
      "Counting vowel letters instead of sounds",
      "Show that rain and boat each have one vowel sound."
    ],
    [
      "Spelling candle as candel",
      "Listen for the ull at the end and remember l then e."
    ],
    [
      "Spelling kitten with one t",
      "Clap kit-ten and point out both t letters in the middle."
    ]
  ],
  "answer_key": "Guided practice: Part A table 2, tree 1, thunder 2, butterfly 3. Part B cat a, rain ai, boat oa, kitten i and e. Part C gar-den, kit-ten, can-dle, rab-bit (accept any chunking with a vowel in every chunk). Part D rabbit, kitten, candle, children, elephant.\n\nIndependent task: Part 1 dog 1, candle 2, elephant 4, children 2, tree 1. Part 2 gar-den, thun-der, kit-ten, but-ter-fly, hip-po-pot-a-mus. Part 3 gar-den, el-e-phant, kit-ten. Part 4 one clap: cat, dog. Two claps: rabbit, table. Three claps: butterfly, elephant. Part 5 beat boxes should show 2, 2, 2 and 3 boxes in that order. Part 7 sentences must spell rabbit, garden and candle correctly.\n\nQuiz answers: 1B, 2B, 3C, 4B, 5A, 6B, 7A, 8B, 9C, 10B.",
  "parent_check": "Check that your child claps before writing. Accept any chunking that keeps a vowel sound in every chunk. Mark the quiz out of ten; nine or more means the strategy is secure.",
  "self_check": "By the end of this lesson you should have clapped and counted syllables, found the vowel sound in words, chunked long words, stretched the sounds, spelt the -le words, and used the five step routine on this week''s spelling list.",
  "resources": [
    {
      "type": "video",
      "title": "Syllables! (Scratch Garden)",
      "embed_url": "https://www.youtube.com/embed/9S7DY2lgJlU",
      "prompt": "Watch this video and clap along with every word.",
      "check": {
        "type": "multiple_choice",
        "question": "What does the video say you can do to find the beats in a word?",
        "options": [
          "Clap them",
          "Read them backwards",
          "Write them twice",
          "Count the letters"
        ],
        "correct_index": 0,
        "explanation": "Clapping the beats is the quickest way to count syllables."
      }
    },
    {
      "type": "video",
      "title": "Syllable division: chunking words (Nessy)",
      "embed_url": "https://www.youtube.com/embed/8NYeMoz9pjI",
      "prompt": "Watch how longer words are split into chunks. Pause on any word you want to try yourself. A grown-up may want to preview this one and pick the parts that help.",
      "check": {
        "type": "multiple_choice",
        "question": "Why do we split a long word into chunks?",
        "options": [
          "So each piece is easier to spell",
          "To make the word shorter",
          "To change the meaning",
          "So we can read it faster"
        ],
        "correct_index": 0,
        "explanation": "Short chunks are easier to spell, then you join them back together."
      }
    }
  ]
}'),
    title = 'Year 3, Week 1, Lesson 3: Sounds and syllables'
WHERE seed_key = 's2-eng-y3-w01-l3';
