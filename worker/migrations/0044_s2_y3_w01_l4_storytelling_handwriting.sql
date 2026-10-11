-- Year 3, Week 1, Lesson 4: Storytelling aloud and joined handwriting
--
-- Replaces the coming-soon placeholder row for seed_key 's2-eng-y3-w01-l4' with a
-- full lesson. The placeholder metadata (unit, week, role, subject) is preserved
-- and coming_soon is set to null so the card stops showing as planned.
--
-- Outcomes: EN2-OLC-01 and EN2-HANDW-01, wording taken from the NSW English
-- K-10 Syllabus (2022) outcomes page:
--   EN2-OLC-01 communicates with familiar audiences for social and learning
--     purposes, by interacting, understanding and presenting
--   EN2-HANDW-01 forms legible joined letters to develop handwriting fluency
--
-- Ten inline SVG visuals are drawn in the lesson data itself, including the
-- handwriting guides and an animated joined "an". All stop under
-- prefers-reduced-motion.
--
-- The two videos are real YouTube ids found for this lesson (Oxford Owl
-- F8k93ylkBPA on storytelling, Mr Hicks UK bk8vgQXO82Y on joined handwriting).
-- They have NOT been watched or checked for embedding, and the handwriting
-- video uses UK letter formation, so check it against what the school teaches.

UPDATE lessons
SET data = json_patch(data, '{
  "year_level": "Year 3",
  "subject": "English",
  "unit_title": "Narrative: story elements and planning",
  "unit_number": 1,
  "week": 1,
  "week_in_unit": 1,
  "lesson_number": 4,
  "lesson_role": "Speaking and handwriting",
  "spelling_focus": "Sounds and syllables",
  "outcome_codes": [
    "EN2-OLC-01",
    "EN2-HANDW-01"
  ],
  "outcome_notes": {
    "EN2-OLC-01": "communicates with familiar audiences for social and learning purposes, by interacting, understanding and presenting",
    "EN2-HANDW-01": "forms legible joined letters to develop handwriting fluency"
  },
  "learning_intention": "We are learning to tell a story aloud to an audience and to write the week''s words in legible joined letters.",
  "success_criteria": [
    "I can speak clearly and slowly so my listeners can hear every word.",
    "I can look at my listeners while I tell a story.",
    "I can plan a story with a beginning, a middle and an end.",
    "I can change my voice for different characters.",
    "I can pause at full stops and use expression.",
    "I can join my letters and keep them sitting on the baseline."
  ],
  "child_mission": "Become a Storyteller. Plan a story with a beginning, a middle and an end, tell it aloud with a voice for each character, then write the week''s words in neat joined letters.",
  "duration_minutes": 45,
  "materials": "This lesson (everything you need is inside it). A pencil and your handwriting book for the written parts. Someone to tell your story to: a family member, a friend, or a favourite toy.",
  "prior_knowledge": "Year 2 letter formation in print, and the idea that a story has a beginning, a middle and an end.",
  "key_vocabulary": [
    "storyteller",
    "audience",
    "expression",
    "pace",
    "join",
    "legible"
  ],
  "teach_steps": [
    {
      "icon": "🗣",
      "title": "Tell it so everyone can hear",
      "explain": "A story only works if your listeners can hear every word. Before you begin, stand or sit up tall, fill your chest with air, and use your speaking voice rather than your whisper voice.\n\nSlow down. Slow speech is easier to follow than fast speech, and it gives you time to think about what comes next. Say the first line of your story to the wall, then say it to a person. If the person has to ask you to repeat it, your voice was too quiet or too quick.\n\nA storyteller also knows when to slow right down. When something exciting is about to happen, dropping your voice and slowing your words makes everyone lean in. Volume and pace are your two dials.",
      "example": "Say this line twice, once too fast and once slowly: Once there was a rabbit who found a carrot. The slow version is easier to follow.",
      "notice": "A common mistake is racing to the end because the story is exciting. Listeners cannot follow a story that runs at full speed.",
      "check": {
        "type": "multiple_choice",
        "question": "What should you do with your voice when you tell a story to a group?",
        "options": [
          "Speak softly so it is a secret",
          "Speak clearly and slowly so everyone can hear",
          "Speak as fast as you can",
          "Whisper the exciting parts"
        ],
        "correct_index": 1,
        "explanation": "A storyteller speaks clearly and slowly so every listener can follow the story."
      },
      "visual": {
        "svg": "<svg viewBox=\"0 0 720 330\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>@keyframes legA{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(26deg)}}@keyframes legB{0%,100%{transform:rotate(26deg)}50%{transform:rotate(-24deg)}}@keyframes armA{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-26deg)}}@keyframes armB{0%,100%{transform:rotate(-26deg)}50%{transform:rotate(22deg)}}@keyframes waveArm{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(-40deg)}}@keyframes wag{0%,100%{transform:rotate(-18deg)}50%{transform:rotate(18deg)}}@keyframes flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.4)}}@keyframes sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}@keyframes drift{0%{transform:translateX(-12px)}100%{transform:translateX(14px)}}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes bite{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.5)}}@keyframes rise{0%{transform:translateY(6px) scale(.6);opacity:0}18%{opacity:1}100%{transform:translateY(-54px) scale(1);opacity:0}}@keyframes fall{0%{transform:translateY(-14px);opacity:0}18%{opacity:1}100%{transform:translateY(26px);opacity:0}}@keyframes pop{0%{transform:scale(.5);opacity:0}55%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}@keyframes blink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}@keyframes ripple{0%,100%{transform:scaleX(1);opacity:.7}50%{transform:scaleX(1.2);opacity:1}}@keyframes float{0%{transform:translate(0,0)}50%{transform:translate(4px,-3px)}100%{transform:translate(-3px,2px)}}@keyframes jump{0%,100%{transform:translateY(0)}30%{transform:translateY(-14px)}}.srays{animation:spin 16.0s linear infinite;transform-box:fill-box;transform-origin:50% 50%}.a1c{animation:drift 7.0s ease-in-out infinite alternate}.a1klL{animation:legA 0.85s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a1klR{animation:legB %ss ease-in-out infinite;transform-box:fill-box;transform-origin:50%% 0%%}.a1kbd{animation:bob 0.85s ease-in-out infinite}.a1khd{animation:bob 0.85s ease-in-out infinite}.a1key{animation:blink 4.2s linear infinite;transform-box:fill-box;transform-origin:50% 50%}.a1kaL{animation:armB 1.19s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a1kaR{animation:waveArm 0.85s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%}.a1kbd{animation:bob 0.85s ease-in-out infinite}.a1w0{animation:pop 1.3s ease-out infinite;animation-delay:0.00s}.a1w1{animation:pop 1.3s ease-out infinite;animation-delay:0.22s}.a1w2{animation:pop 1.3s ease-out infinite;animation-delay:0.44s}.a1g{animation:sway 2.2s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}.a1t{animation:pop .5s ease-out both;animation-delay:0.4s}.sb{font-family:Arial,sans-serif;font-weight:700}@media (prefers-reduced-motion:reduce){.scn *{animation:none !important}animate{display:none}}</style><g class=\"scn\"><defs><linearGradient id=\"gl4s1\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#a9d8ff\"/><stop offset=\"0.62\" stop-color=\"#d8efff\"/><stop offset=\"1\" stop-color=\"#eef9ff\"/></linearGradient></defs><rect width=\"720\" height=\"330\" rx=\"20\" fill=\"url(#gl4s1)\"/><rect x=\"0\" y=\"250\" width=\"720\" height=\"80\" rx=\"0\" fill=\"#8fe38f\"/><g class=\"srays\"><path d=\"M698.0 40.0 L687.7 46.5 L690.4 58.4 L678.5 55.7 L672.0 66.0 L665.5 55.7 L653.6 58.4 L656.3 46.5 L646.0 40.0 L656.3 33.5 L653.6 21.6 L665.5 24.3 L672.0 14.0 L678.5 24.3 L690.4 21.6 L687.7 33.5 Z\" fill=\"#f7b731\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><circle cx=\"672.0\" cy=\"40.0\" r=\"15.0\" fill=\"#ffd24a\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><g class=\"a1c\"><circle cx=\"600.0\" cy=\"46.0\" r=\"12.8\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><circle cx=\"614.2\" cy=\"40.8\" r=\"15.8\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><circle cx=\"631.5\" cy=\"46.0\" r=\"12.0\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><rect x=\"588.8\" y=\"43.8\" width=\"57.0\" height=\"13.5\" rx=\"6.8\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.2\"/></g><ellipse cx=\"150.0\" cy=\"273.6\" rx=\"27.6\" ry=\"7.2\" fill=\"#000\" opacity=\"0.12\"/><g class=\"a1klL\"><path d=\"M142.2 238.8 L142.2 259.2\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"14.2\" stroke-linecap=\"round\"/><path d=\"M142.2 238.8 L142.2 259.2\" fill=\"none\" stroke=\"#2f6bcf\" stroke-width=\"10.8\" stroke-linecap=\"round\"/></g><g class=\"a1klR\"><path d=\"M157.8 238.8 L157.8 259.2\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"14.2\" stroke-linecap=\"round\"/><path d=\"M157.8 238.8 L157.8 259.2\" fill=\"none\" stroke=\"#2f6bcf\" stroke-width=\"10.8\" stroke-linecap=\"round\"/></g><rect x=\"134.4\" y=\"258.0\" width=\"20.4\" height=\"12.0\" rx=\"6.0\" fill=\"#334155\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><rect x=\"146.4\" y=\"258.0\" width=\"20.4\" height=\"12.0\" rx=\"6.0\" fill=\"#334155\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><path d=\"M133.2 238.8 L128.4 216.0 Q128.4 207.6 138.0 206.4 L162.0 206.4 Q171.6 207.6 171.6 216.0 L166.8 238.8 Z\" fill=\"#ef5350\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><path d=\"M142.8 206.4 Q150.0 212.4 157.2 206.4\" fill=\"#ef5350\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><g class=\"a1kaL\"><path d=\"M129.6 213.6 Q123.6 224.4 127.2 234.0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"10.6\" stroke-linecap=\"round\"/><path d=\"M129.6 213.6 Q123.6 224.4 127.2 234.0\" fill=\"none\" stroke=\"#f6c9a0\" stroke-width=\"7.2\" stroke-linecap=\"round\"/></g><g class=\"a1kaR\"><path d=\"M170.4 213.6 Q182.4 202.8 181.2 186.0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"10.6\" stroke-linecap=\"round\"/><path d=\"M170.4 213.6 Q182.4 202.8 181.2 186.0\" fill=\"none\" stroke=\"#f6c9a0\" stroke-width=\"7.2\" stroke-linecap=\"round\"/></g><circle cx=\"127.2\" cy=\"234.0\" r=\"4.1\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"172.8\" cy=\"234.0\" r=\"4.1\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><rect x=\"145.8\" y=\"200.4\" width=\"8.4\" height=\"8.4\" rx=\"3.6\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><circle cx=\"130.2\" cy=\"183.6\" r=\"5.0\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"169.8\" cy=\"183.6\" r=\"5.0\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><g class=\"a1khd\"><circle cx=\"150.0\" cy=\"183.6\" r=\"19.2\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><path d=\"M130.8 181.2 Q127.2 159.6 150.0 159.6 Q172.8 159.6 169.2 181.2 Q162.0 174.0 154.8 177.6 Q147.6 174.0 140.4 177.6 Q135.6 174.0 130.8 181.2 Z\" fill=\"#4a3222\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><g class=\"a1key\"><ellipse cx=\"143.5\" cy=\"183.6\" rx=\"4.3\" ry=\"5.2\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"143.0\" cy=\"184.2\" r=\"2.4\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"144.6\" cy=\"182.0\" r=\"1.0\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><ellipse cx=\"156.5\" cy=\"183.6\" rx=\"4.3\" ry=\"5.2\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"157.0\" cy=\"184.2\" r=\"2.4\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"155.4\" cy=\"182.0\" r=\"1.0\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/></g><path d=\"M140.4 174.0 q3.6 -2.6 7.2 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><path d=\"M152.4 174.0 q3.6 -2.6 7.2 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><ellipse cx=\"138.0\" cy=\"190.8\" rx=\"4.3\" ry=\"2.9\" fill=\"#f87171\" opacity=\"0.35\"/><ellipse cx=\"162.0\" cy=\"190.8\" rx=\"4.3\" ry=\"2.9\" fill=\"#f87171\" opacity=\"0.35\"/><path d=\"M144.6 193.2 q5.4 5.8 10.8 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><g class=\"a1w0\"><path d=\"M232.0 182.0 a16.0 16.0 0 0 1 0 48.0\" fill=\"none\" stroke=\"#7c3aed\" stroke-width=\"4\" stroke-linecap=\"round\"/></g><g class=\"a1w1\"><path d=\"M248.0 188.0 a26.0 26.0 0 0 1 0 36.0\" fill=\"none\" stroke=\"#7c3aed\" stroke-width=\"4\" stroke-linecap=\"round\"/></g><g class=\"a1w2\"><path d=\"M264.0 194.0 a36.0 36.0 0 0 1 0 24.0\" fill=\"none\" stroke=\"#7c3aed\" stroke-width=\"4\" stroke-linecap=\"round\"/></g><circle cx=\"420.0\" cy=\"180.0\" r=\"49.4\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><path d=\"M385.8 187.6 A 38.0 38.0 0 0 1 454.2 187.6\" fill=\"none\" stroke=\"#cbd5e1\" stroke-width=\"3\"/><g class=\"a1g\"><path d=\"M420.0 183.8 L444.7 155.3\" stroke=\"#ef4444\" stroke-width=\"3\" stroke-linecap=\"round\"/></g><circle cx=\"420.0\" cy=\"180.0\" r=\"6.5\" fill=\"#334155\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><text x=\"420.0\" y=\"248.4\" text-anchor=\"middle\" font-size=\"14\" font-family=\"Arial,sans-serif\" font-weight=\"700\" fill=\"#334155\">pace</text><g class=\"a1t\"><rect x=\"430\" y=\"262\" width=\"250\" height=\"46\" rx=\"12\" fill=\"#dcfce7\" stroke=\"#166534\" stroke-width=\"2.6\"/><path d=\"M448.0 285.0 l6 6 12-14\" fill=\"none\" stroke=\"#166534\" stroke-width=\"4\" stroke-linecap=\"round\"/><text x=\"480.0\" y=\"291.0\" font-size=\"16\" font-family=\"Arial,sans-serif\" font-weight=\"700\" fill=\"#166534\">Loud enough to hear</text></g><rect x=\"40\" y=\"44\" width=\"320\" height=\"48\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"200\" y=\"75\" text-anchor=\"middle\" font-size=\"19\" font-weight=\"700\" fill=\"#1f2937\" class=\"sb\">Speak clearly</text><rect x=\"40\" y=\"108\" width=\"320\" height=\"48\" rx=\"14\" fill=\"#e6dbff\" stroke=\"#52309c\" stroke-width=\"2.6\"/><text x=\"200\" y=\"139\" text-anchor=\"middle\" font-size=\"19\" font-weight=\"700\" fill=\"#52309c\" class=\"sb\">Not too fast</text></g></svg>",
        "alt": "Animated cartoon: a girl tells a story in a park with sound waves coming from her mouth, a dial labelled pace beside her and a green card reading loud enough to hear, while cards read speak clearly and not too fast.",
        "caption": "Speak clearly and slowly, and keep your eye on the pace dial."
      }
    },
    {
      "icon": "👀",
      "title": "Face your listeners",
      "explain": "Look at the people you are telling the story to, not at the floor or the ceiling. Your face is part of the story, and your listeners need to see it.\n\nTurn your body towards your audience and look around the group as you speak, a few seconds at each person. If you are telling your story to one person, look at them. If you are telling it to a family, move your eyes from face to face so nobody feels left out.\n\nLooking at your listeners also tells you how the story is going. If they look confused, slow down. If they are smiling, you know the funny part worked.",
      "example": "Before you start, look at your audience, smile, and wait until they are quiet. Then begin with your first line.",
      "notice": "Reading with your eyes fixed on the page or the floor loses your listeners, even when the words are perfect.",
      "check": {
        "type": "multiple_choice",
        "question": "Where should you look while you tell a story?",
        "options": [
          "At the floor",
          "At the ceiling",
          "At your listeners",
          "Behind you"
        ],
        "correct_index": 2,
        "explanation": "Looking at your listeners keeps them with you and shows you how the story is going."
      },
      "visual": {
        "svg": "<svg viewBox=\"0 0 720 320\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>@keyframes legA{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(26deg)}}@keyframes legB{0%,100%{transform:rotate(26deg)}50%{transform:rotate(-24deg)}}@keyframes armA{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-26deg)}}@keyframes armB{0%,100%{transform:rotate(-26deg)}50%{transform:rotate(22deg)}}@keyframes waveArm{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(-40deg)}}@keyframes wag{0%,100%{transform:rotate(-18deg)}50%{transform:rotate(18deg)}}@keyframes flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.4)}}@keyframes sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}@keyframes drift{0%{transform:translateX(-12px)}100%{transform:translateX(14px)}}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes bite{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.5)}}@keyframes rise{0%{transform:translateY(6px) scale(.6);opacity:0}18%{opacity:1}100%{transform:translateY(-54px) scale(1);opacity:0}}@keyframes fall{0%{transform:translateY(-14px);opacity:0}18%{opacity:1}100%{transform:translateY(26px);opacity:0}}@keyframes pop{0%{transform:scale(.5);opacity:0}55%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}@keyframes blink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}@keyframes ripple{0%,100%{transform:scaleX(1);opacity:.7}50%{transform:scaleX(1.2);opacity:1}}@keyframes float{0%{transform:translate(0,0)}50%{transform:translate(4px,-3px)}100%{transform:translate(-3px,2px)}}@keyframes jump{0%,100%{transform:translateY(0)}30%{transform:translateY(-14px)}}.a2klL{animation:legA 0.85s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a2klR{animation:legB %ss ease-in-out infinite;transform-box:fill-box;transform-origin:50%% 0%%}.a2kbd{animation:bob 0.85s ease-in-out infinite}.a2khd{animation:bob 0.85s ease-in-out infinite}.a2key{animation:blink 4.2s linear infinite;transform-box:fill-box;transform-origin:50% 50%}.a2kaL{animation:armB 1.19s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a2kaR{animation:waveArm 0.85s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%}.a2kbd{animation:bob 0.85s ease-in-out infinite}.a2llL{animation:legA 1.0s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a2llR{animation:legB %ss ease-in-out infinite;transform-box:fill-box;transform-origin:50%% 0%%}.a2lbd{animation:bob 1.0s ease-in-out infinite}.a2lhd{animation:bob 1.0s ease-in-out infinite}.a2ley{animation:blink 4.2s linear infinite;transform-box:fill-box;transform-origin:50% 50%}.a2laL{animation:armA 1.0s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a2laR{animation:armB 1.0s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a2lbd{animation:bob 1.0s ease-in-out infinite}.a2ctl{animation:wag 1.4300000000000002s ease-in-out infinite;transform-box:fill-box;transform-origin:80% 90%}.a2chd{animation:bob 1.2100000000000002s ease-in-out infinite}.a2cey{animation:blink 5s linear infinite;transform-box:fill-box;transform-origin:50% 50%}.a2b{animation:pop .5s ease-out both}.sb{font-family:Arial,sans-serif;font-weight:700}@media (prefers-reduced-motion:reduce){.scn *{animation:none !important}animate{display:none}}</style><g class=\"scn\"><defs><linearGradient id=\"gl4s2\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#a9d8ff\"/><stop offset=\"0.62\" stop-color=\"#d8efff\"/><stop offset=\"1\" stop-color=\"#eef9ff\"/></linearGradient></defs><rect width=\"720\" height=\"320\" rx=\"20\" fill=\"url(#gl4s2)\"/><rect x=\"0\" y=\"244\" width=\"720\" height=\"76\" rx=\"0\" fill=\"#8fe38f\"/><ellipse cx=\"140.0\" cy=\"269.6\" rx=\"27.6\" ry=\"7.2\" fill=\"#000\" opacity=\"0.12\"/><g class=\"a2klL\"><path d=\"M132.2 234.8 L132.2 255.2\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"14.2\" stroke-linecap=\"round\"/><path d=\"M132.2 234.8 L132.2 255.2\" fill=\"none\" stroke=\"#2f6bcf\" stroke-width=\"10.8\" stroke-linecap=\"round\"/></g><g class=\"a2klR\"><path d=\"M147.8 234.8 L147.8 255.2\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"14.2\" stroke-linecap=\"round\"/><path d=\"M147.8 234.8 L147.8 255.2\" fill=\"none\" stroke=\"#2f6bcf\" stroke-width=\"10.8\" stroke-linecap=\"round\"/></g><rect x=\"124.4\" y=\"254.0\" width=\"20.4\" height=\"12.0\" rx=\"6.0\" fill=\"#334155\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><rect x=\"136.4\" y=\"254.0\" width=\"20.4\" height=\"12.0\" rx=\"6.0\" fill=\"#334155\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><path d=\"M123.2 234.8 L118.4 212.0 Q118.4 203.6 128.0 202.4 L152.0 202.4 Q161.6 203.6 161.6 212.0 L156.8 234.8 Z\" fill=\"#7c3aed\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><path d=\"M132.8 202.4 Q140.0 208.4 147.2 202.4\" fill=\"#7c3aed\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><g class=\"a2kaL\"><path d=\"M119.6 209.6 Q113.6 220.4 117.2 230.0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"10.6\" stroke-linecap=\"round\"/><path d=\"M119.6 209.6 Q113.6 220.4 117.2 230.0\" fill=\"none\" stroke=\"#f6c9a0\" stroke-width=\"7.2\" stroke-linecap=\"round\"/></g><g class=\"a2kaR\"><path d=\"M160.4 209.6 Q172.4 198.8 171.2 182.0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"10.6\" stroke-linecap=\"round\"/><path d=\"M160.4 209.6 Q172.4 198.8 171.2 182.0\" fill=\"none\" stroke=\"#f6c9a0\" stroke-width=\"7.2\" stroke-linecap=\"round\"/></g><circle cx=\"117.2\" cy=\"230.0\" r=\"4.1\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"162.8\" cy=\"230.0\" r=\"4.1\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><rect x=\"135.8\" y=\"196.4\" width=\"8.4\" height=\"8.4\" rx=\"3.6\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><circle cx=\"120.2\" cy=\"179.6\" r=\"5.0\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"159.8\" cy=\"179.6\" r=\"5.0\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><g class=\"a2khd\"><circle cx=\"140.0\" cy=\"179.6\" r=\"19.2\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><path d=\"M120.8 177.2 Q117.2 155.6 140.0 155.6 Q162.8 155.6 159.2 177.2 Q152.0 170.0 144.8 173.6 Q137.6 170.0 130.4 173.6 Q125.6 170.0 120.8 177.2 Z\" fill=\"#4a3222\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><g class=\"a2key\"><ellipse cx=\"133.5\" cy=\"179.6\" rx=\"4.3\" ry=\"5.2\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"133.0\" cy=\"180.2\" r=\"2.4\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"134.6\" cy=\"178.0\" r=\"1.0\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><ellipse cx=\"146.5\" cy=\"179.6\" rx=\"4.3\" ry=\"5.2\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"147.0\" cy=\"180.2\" r=\"2.4\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"145.4\" cy=\"178.0\" r=\"1.0\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/></g><path d=\"M130.4 170.0 q3.6 -2.6 7.2 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><path d=\"M142.4 170.0 q3.6 -2.6 7.2 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><ellipse cx=\"128.0\" cy=\"186.8\" rx=\"4.3\" ry=\"2.9\" fill=\"#f87171\" opacity=\"0.35\"/><ellipse cx=\"152.0\" cy=\"186.8\" rx=\"4.3\" ry=\"2.9\" fill=\"#f87171\" opacity=\"0.35\"/><path d=\"M134.6 189.2 q5.4 5.8 10.8 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><ellipse cx=\"560.0\" cy=\"271.0\" rx=\"23.0\" ry=\"6.0\" fill=\"#000\" opacity=\"0.12\"/><g class=\"a2llL\"><path d=\"M553.5 242.0 L553.5 259.0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"12.4\" stroke-linecap=\"round\"/><path d=\"M553.5 242.0 L553.5 259.0\" fill=\"none\" stroke=\"#2f6bcf\" stroke-width=\"9.0\" stroke-linecap=\"round\"/></g><g class=\"a2llR\"><path d=\"M566.5 242.0 L566.5 259.0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"12.4\" stroke-linecap=\"round\"/><path d=\"M566.5 242.0 L566.5 259.0\" fill=\"none\" stroke=\"#2f6bcf\" stroke-width=\"9.0\" stroke-linecap=\"round\"/></g><rect x=\"547.0\" y=\"258.0\" width=\"17.0\" height=\"10.0\" rx=\"5.0\" fill=\"#334155\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><rect x=\"557.0\" y=\"258.0\" width=\"17.0\" height=\"10.0\" rx=\"5.0\" fill=\"#334155\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><path d=\"M546.0 242.0 L542.0 223.0 Q542.0 216.0 550.0 215.0 L570.0 215.0 Q578.0 216.0 578.0 223.0 L574.0 242.0 Z\" fill=\"#0ea5e9\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><path d=\"M554.0 215.0 Q560.0 220.0 566.0 215.0\" fill=\"#0ea5e9\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><g class=\"a2laL\"><path d=\"M543.0 221.0 Q538.0 230.0 541.0 238.0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"9.4\" stroke-linecap=\"round\"/><path d=\"M543.0 221.0 Q538.0 230.0 541.0 238.0\" fill=\"none\" stroke=\"#f6c9a0\" stroke-width=\"6.0\" stroke-linecap=\"round\"/></g><g class=\"a2laR\"><path d=\"M577.0 221.0 Q582.0 230.0 579.0 238.0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"9.4\" stroke-linecap=\"round\"/><path d=\"M577.0 221.0 Q582.0 230.0 579.0 238.0\" fill=\"none\" stroke=\"#f6c9a0\" stroke-width=\"6.0\" stroke-linecap=\"round\"/></g><circle cx=\"541.0\" cy=\"238.0\" r=\"3.4\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"579.0\" cy=\"238.0\" r=\"3.4\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><rect x=\"556.5\" y=\"210.0\" width=\"7.0\" height=\"7.0\" rx=\"3.0\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><circle cx=\"543.5\" cy=\"196.0\" r=\"4.2\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"576.5\" cy=\"196.0\" r=\"4.2\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><g class=\"a2lhd\"><circle cx=\"560.0\" cy=\"196.0\" r=\"16.0\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><path d=\"M544.0 194.0 Q541.0 176.0 560.0 176.0 Q579.0 176.0 576.0 194.0 Q570.0 188.0 564.0 191.0 Q558.0 188.0 552.0 191.0 Q548.0 188.0 544.0 194.0 Z\" fill=\"#4a3222\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><g class=\"a2ley\"><ellipse cx=\"554.6\" cy=\"196.0\" rx=\"3.6\" ry=\"4.3\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"554.2\" cy=\"196.5\" r=\"2.0\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"555.5\" cy=\"194.7\" r=\"0.8\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><ellipse cx=\"565.4\" cy=\"196.0\" rx=\"3.6\" ry=\"4.3\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"565.8\" cy=\"196.5\" r=\"2.0\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"564.5\" cy=\"194.7\" r=\"0.8\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/></g><path d=\"M552.0 188.0 q3.0 -2.2 6.0 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><path d=\"M562.0 188.0 q3.0 -2.2 6.0 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><ellipse cx=\"550.0\" cy=\"202.0\" rx=\"3.6\" ry=\"2.4\" fill=\"#f87171\" opacity=\"0.35\"/><ellipse cx=\"570.0\" cy=\"202.0\" rx=\"3.6\" ry=\"2.4\" fill=\"#f87171\" opacity=\"0.35\"/><path d=\"M555.5 204.0 q4.5 4.8 9.0 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><ellipse cx=\"663.6\" cy=\"270.4\" rx=\"16.8\" ry=\"4.0\" fill=\"#000\" opacity=\"0.12\"/><g class=\"a2ctl\"><path d=\"M647.6 252.0 Q638.0 245.6 641.2 232.8\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"7.0\" stroke-linecap=\"round\"/><path d=\"M647.6 252.0 Q638.0 245.6 641.2 232.8\" fill=\"none\" stroke=\"#7c8797\" stroke-width=\"3.6\" stroke-linecap=\"round\"/></g><path d=\"M653.2 268.0 L653.2 258.4\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"7.4\" stroke-linecap=\"round\"/><path d=\"M653.2 268.0 L653.2 258.4\" fill=\"none\" stroke=\"#7c8797\" stroke-width=\"4.0\" stroke-linecap=\"round\"/><path d=\"M662.0 268.0 L662.0 258.4\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"7.4\" stroke-linecap=\"round\"/><path d=\"M662.0 268.0 L662.0 258.4\" fill=\"none\" stroke=\"#7c8797\" stroke-width=\"4.0\" stroke-linecap=\"round\"/><path d=\"M668.4 268.0 L668.4 258.4\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"7.4\" stroke-linecap=\"round\"/><path d=\"M668.4 268.0 L668.4 258.4\" fill=\"none\" stroke=\"#7c8797\" stroke-width=\"4.0\" stroke-linecap=\"round\"/><path d=\"M674.0 268.0 L674.0 258.4\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"7.4\" stroke-linecap=\"round\"/><path d=\"M674.0 268.0 L674.0 258.4\" fill=\"none\" stroke=\"#7c8797\" stroke-width=\"4.0\" stroke-linecap=\"round\"/><ellipse cx=\"662.0\" cy=\"254.4\" rx=\"16.8\" ry=\"9.6\" fill=\"#9aa5b5\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><circle cx=\"676.4\" cy=\"244.0\" r=\"10.4\" fill=\"#9aa5b5\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><path d=\"M668.4 236.0 L667.6 226.4 L676.4 232.8 Z\" fill=\"#9aa5b5\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><path d=\"M682.8 234.4 L686.0 226.4 L677.2 232.8 Z\" fill=\"#9aa5b5\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><g class=\"a2cey\"><ellipse cx=\"672.7\" cy=\"242.4\" rx=\"2.4\" ry=\"2.9\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"672.5\" cy=\"242.7\" r=\"1.4\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"673.3\" cy=\"241.5\" r=\"0.6\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><ellipse cx=\"680.1\" cy=\"242.4\" rx=\"2.4\" ry=\"2.9\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"680.3\" cy=\"242.7\" r=\"1.4\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"679.5\" cy=\"241.5\" r=\"0.6\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/></g><path d=\"M668.4 247.2 l-8.0 -1.6 M668.4 249.6 l-8.0 2.4\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"1.8\" stroke-linejoin=\"round\"/><path d=\"M684.4 247.2 l8.0 -1.6 M684.4 249.6 l8.0 2.4\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"1.8\" stroke-linejoin=\"round\"/><path d=\"M206 218 Q 380 196 520 214\" fill=\"none\" stroke=\"#7c3aed\" stroke-width=\"3\" stroke-dasharray=\"8 8\" stroke-linecap=\"round\"><animate attributeName=\"stroke-dashoffset\" values=\"0;-32\" keyTimes=\"0;1\" dur=\"1.2s\" repeatCount=\"indefinite\"/></path><g class=\"a2b\"><rect x=\"250\" y=\"66\" width=\"270\" height=\"62\" rx=\"25.8\" fill=\"#ffffff\" stroke=\"#7c3aed\" stroke-width=\"2.6\"/><path d=\"M272.0 128.0 L266.0 144.0 L296.0 128.0 Z\" fill=\"#ffffff\" stroke=\"#7c3aed\" stroke-width=\"2.6\" stroke-linejoin=\"round\"/><text x=\"385.0\" y=\"103.1\" text-anchor=\"middle\" font-size=\"18\" font-family=\"Arial,sans-serif\" font-weight=\"700\" fill=\"#52309c\">Hello everyone!</text></g><rect x=\"60\" y=\"280\" width=\"600\" height=\"36\" rx=\"14\" fill=\"#e6dbff\" stroke=\"#52309c\" stroke-width=\"2.6\"/><text x=\"360\" y=\"305\" text-anchor=\"middle\" font-size=\"17\" font-weight=\"700\" fill=\"#52309c\" class=\"sb\">Look at your listeners while you tell it</text></g></svg>",
        "alt": "Animated cartoon: a boy tells a story to a friend and a cat while a dotted line runs from his face to the listener, with a speech bubble saying hello everyone and a card about looking at listeners.",
        "caption": "Turn towards your listeners and speak to them, not to the floor."
      }
    },
    {
      "icon": "🧩",
      "title": "A story has a beginning, a middle and an end",
      "explain": "Every story has three parts. The beginning introduces who and where. The middle shows the problem or the surprise. The end shows how it finished and how the characters felt.\n\nBefore you tell a story aloud, plan those three parts in your head, or write just a few words for each one. Who is it about and where are they. What goes wrong or what is exciting. How does it finish. Three or four words per part is plenty of planning.\n\nPlanning is what stops a story from wandering. Without a plan, storytellers often get lost in the middle and lose the ending altogether, which is the part everyone is waiting for.",
      "example": "Plan for the rabbit story: beginning, a rabbit finds a carrot. Middle, another rabbit wants it. End, they share the carrot.",
      "notice": "Telling a story with no plan usually means the middle drifts and the ending disappears.",
      "check": {
        "type": "multiple_choice",
        "question": "Which three parts does every story have?",
        "options": [
          "A beginning, a middle and an end",
          "A beginning, a plan and a list",
          "A title, a page and a picture",
          "A question, an answer and a joke"
        ],
        "correct_index": 0,
        "explanation": "Stories go beginning, middle, end. Plan those three parts before you tell it."
      },
      "visual": {
        "svg": "<svg viewBox=\"0 0 720 350\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>@keyframes legA{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(26deg)}}@keyframes legB{0%,100%{transform:rotate(26deg)}50%{transform:rotate(-24deg)}}@keyframes armA{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-26deg)}}@keyframes armB{0%,100%{transform:rotate(-26deg)}50%{transform:rotate(22deg)}}@keyframes waveArm{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(-40deg)}}@keyframes wag{0%,100%{transform:rotate(-18deg)}50%{transform:rotate(18deg)}}@keyframes flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.4)}}@keyframes sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}@keyframes drift{0%{transform:translateX(-12px)}100%{transform:translateX(14px)}}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes bite{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.5)}}@keyframes rise{0%{transform:translateY(6px) scale(.6);opacity:0}18%{opacity:1}100%{transform:translateY(-54px) scale(1);opacity:0}}@keyframes fall{0%{transform:translateY(-14px);opacity:0}18%{opacity:1}100%{transform:translateY(26px);opacity:0}}@keyframes pop{0%{transform:scale(.5);opacity:0}55%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}@keyframes blink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}@keyframes ripple{0%,100%{transform:scaleX(1);opacity:.7}50%{transform:scaleX(1.2);opacity:1}}@keyframes float{0%{transform:translate(0,0)}50%{transform:translate(4px,-3px)}100%{transform:translate(-3px,2px)}}@keyframes jump{0%,100%{transform:translateY(0)}30%{transform:translateY(-14px)}}.a3p0{animation:pop .6s ease-out both;animation-delay:0.0s}.a3rer{animation:flap 1.6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a3rhd{animation:bob .8s ease-in-out infinite}.a3rey{animation:blink 4.4s linear infinite;transform-box:fill-box;transform-origin:50% 50%}.a3p1{animation:pop .6s ease-out both;animation-delay:0.6s}.a3r2er{animation:flap 1.6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a3r2hd{animation:bob .8s ease-in-out infinite}.a3r2ey{animation:blink 4.4s linear infinite;transform-box:fill-box;transform-origin:50% 50%}.a3p2{animation:pop .6s ease-out both;animation-delay:1.2s}.a3r3er{animation:flap 1.6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a3r3hd{animation:bob .8s ease-in-out infinite}.a3r3ey{animation:blink 4.4s linear infinite;transform-box:fill-box;transform-origin:50% 50%}.a3r4er{animation:flap 1.6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a3r4hd{animation:bob .8s ease-in-out infinite}.a3r4ey{animation:blink 4.4s linear infinite;transform-box:fill-box;transform-origin:50% 50%}.sb{font-family:Arial,sans-serif;font-weight:700}.st{font-family:Arial,sans-serif}@media (prefers-reduced-motion:reduce){.scn *{animation:none !important}animate{display:none}}</style><g class=\"scn\"><rect x=\"0\" y=\"0\" width=\"720\" height=\"350\" rx=\"20\" fill=\"#eef2ff\"/><rect x=\"40\" y=\"40\" width=\"640\" height=\"46\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"360\" y=\"70\" text-anchor=\"middle\" font-size=\"18\" font-weight=\"700\" fill=\"#1f2937\" class=\"sb\">A story has a beginning, a middle and an end</text><g class=\"a3p0\"><rect x=\"30\" y=\"104\" width=\"210\" height=\"150\" rx=\"14\" fill=\"#dbeafe\" stroke=\"#1e40af\" stroke-width=\"2.6\"/><ellipse cx=\"100.0\" cy=\"222.4\" rx=\"17.0\" ry=\"11.0\" fill=\"#e7e2da\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><circle cx=\"86.4\" cy=\"217.3\" r=\"5.1\" fill=\"#cfc8bd\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><g class=\"a3rhd\"><circle cx=\"115.3\" cy=\"208.8\" r=\"11.0\" fill=\"#e7e2da\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><g class=\"a3rer\"><path d=\"M111.0 200.3 q-2.5 -10.2 -4.2 -18.7 q6.8 5.1 3.4 13.6 Z\" fill=\"#e7e2da\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><g class=\"a3rer\"><path d=\"M120.4 200.3 q2.5 -10.2 6.0 -17.0 q-6.0 4.2 -3.4 11.9 Z\" fill=\"#e7e2da\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><g class=\"a3rey\"><ellipse cx=\"118.1\" cy=\"207.9\" rx=\"1.9\" ry=\"2.3\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"118.4\" cy=\"208.2\" r=\"1.1\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"117.7\" cy=\"207.3\" r=\"0.4\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/></g><circle cx=\"123.0\" cy=\"211.3\" r=\"1.9\" fill=\"#f08ea8\" stroke=\"#2b2521\" stroke-width=\"1.4\"/><path d=\"M118.7 214.8 q2.5 2.5 5.1 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"1.8\" stroke-linejoin=\"round\"/></g><path d=\"M180.0 240.0 l12.6 -27.0 l12.6 27.0 z\" fill=\"#f97316\" stroke=\"2.2\" stroke-width=\"None\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M192.6 213.0 l-7.2 -10.8 M192.6 213.0 l3.6 -11.7\" fill=\"none\" stroke=\"#15803d\" stroke-width=\"3.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><text x=\"135.0\" y=\"292\" text-anchor=\"middle\" font-size=\"17\" font-family=\"Arial,sans-serif\" font-weight=\"700\" fill=\"#1e40af\">Beginning</text></g><g class=\"a3p1\"><rect x=\"260\" y=\"104\" width=\"210\" height=\"150\" rx=\"14\" fill=\"#ffedd5\" stroke=\"#9a3412\" stroke-width=\"2.6\"/><ellipse cx=\"340.0\" cy=\"222.4\" rx=\"17.0\" ry=\"11.0\" fill=\"#dfd8cd\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><circle cx=\"326.4\" cy=\"217.3\" r=\"5.1\" fill=\"#cfc8bd\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><g class=\"a3r2hd\"><circle cx=\"355.3\" cy=\"208.8\" r=\"11.0\" fill=\"#dfd8cd\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><g class=\"a3r2er\"><path d=\"M351.1 200.3 q-2.5 -10.2 -4.2 -18.7 q6.8 5.1 3.4 13.6 Z\" fill=\"#dfd8cd\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><g class=\"a3r2er\"><path d=\"M360.4 200.3 q2.5 -10.2 6.0 -17.0 q-6.0 4.2 -3.4 11.9 Z\" fill=\"#dfd8cd\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><g class=\"a3r2ey\"><ellipse cx=\"358.1\" cy=\"207.9\" rx=\"1.9\" ry=\"2.3\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"358.4\" cy=\"208.2\" r=\"1.1\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"357.7\" cy=\"207.3\" r=\"0.4\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/></g><circle cx=\"362.9\" cy=\"211.3\" r=\"1.9\" fill=\"#f08ea8\" stroke=\"#2b2521\" stroke-width=\"1.4\"/><path d=\"M358.7 214.8 q2.5 2.5 5.1 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"1.8\" stroke-linejoin=\"round\"/></g><text x=\"365\" y=\"140\" text-anchor=\"middle\" font-size=\"30\" font-weight=\"700\" fill=\"#be123c\" class=\"sb\">!</text><text x=\"365.0\" y=\"292\" text-anchor=\"middle\" font-size=\"17\" font-family=\"Arial,sans-serif\" font-weight=\"700\" fill=\"#9a3412\">Middle</text></g><g class=\"a3p2\"><rect x=\"490\" y=\"104\" width=\"210\" height=\"150\" rx=\"14\" fill=\"#dcfce7\" stroke=\"#166534\" stroke-width=\"2.6\"/><ellipse cx=\"560.0\" cy=\"222.4\" rx=\"17.0\" ry=\"11.0\" fill=\"#e7e2da\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><circle cx=\"546.4\" cy=\"217.3\" r=\"5.1\" fill=\"#cfc8bd\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><g class=\"a3r3hd\"><circle cx=\"575.3\" cy=\"208.8\" r=\"11.0\" fill=\"#e7e2da\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><g class=\"a3r3er\"><path d=\"M571.0 200.3 q-2.5 -10.2 -4.2 -18.7 q6.8 5.1 3.4 13.6 Z\" fill=\"#e7e2da\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><g class=\"a3r3er\"><path d=\"M580.4 200.3 q2.5 -10.2 6.0 -17.0 q-6.0 4.2 -3.4 11.9 Z\" fill=\"#e7e2da\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><g class=\"a3r3ey\"><ellipse cx=\"578.1\" cy=\"207.9\" rx=\"1.9\" ry=\"2.3\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"578.4\" cy=\"208.2\" r=\"1.1\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"577.7\" cy=\"207.3\" r=\"0.4\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/></g><circle cx=\"583.0\" cy=\"211.3\" r=\"1.9\" fill=\"#f08ea8\" stroke=\"#2b2521\" stroke-width=\"1.4\"/><path d=\"M578.7 214.8 q2.5 2.5 5.1 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"1.8\" stroke-linejoin=\"round\"/></g><ellipse cx=\"630.0\" cy=\"228.8\" rx=\"14.0\" ry=\"9.1\" fill=\"#f3ece2\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><circle cx=\"618.8\" cy=\"224.6\" r=\"4.2\" fill=\"#cfc8bd\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><g class=\"a3r4hd\"><circle cx=\"642.6\" cy=\"217.6\" r=\"9.1\" fill=\"#f3ece2\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><g class=\"a3r4er\"><path d=\"M639.1 210.6 q-2.1 -8.4 -3.5 -15.4 q5.6 4.2 2.8 11.2 Z\" fill=\"#f3ece2\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><g class=\"a3r4er\"><path d=\"M646.8 210.6 q2.1 -8.4 4.9 -14.0 q-4.9 3.5 -2.8 9.8 Z\" fill=\"#f3ece2\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><g class=\"a3r4ey\"><ellipse cx=\"644.9\" cy=\"216.9\" rx=\"1.6\" ry=\"1.9\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"645.1\" cy=\"217.1\" r=\"0.9\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"644.6\" cy=\"216.3\" r=\"0.4\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/></g><circle cx=\"648.9\" cy=\"219.7\" r=\"1.5\" fill=\"#f08ea8\" stroke=\"#2b2521\" stroke-width=\"1.4\"/><path d=\"M645.4 222.5 q2.1 2.1 4.2 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"1.8\" stroke-linejoin=\"round\"/></g><text x=\"595.0\" y=\"292\" text-anchor=\"middle\" font-size=\"17\" font-family=\"Arial,sans-serif\" font-weight=\"700\" fill=\"#166534\">End</text></g><rect x=\"60\" y=\"310\" width=\"600\" height=\"34\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"360\" y=\"334\" text-anchor=\"middle\" font-size=\"16\" font-weight=\"700\" fill=\"#334155\" class=\"st\">Plan what happens first, next and last</text></g></svg>",
        "alt": "Animated cartoon: three panels showing a rabbit finding a carrot, a second rabbit arriving with a surprise, and the two rabbits together, labelled beginning, middle and end, under a title card that says a story has a beginning, a middle and an end.",
        "caption": "Plan the beginning, the middle and the end before you start telling."
      }
    },
    {
      "icon": "🐺",
      "title": "Give each character a voice",
      "explain": "You are one person telling a story with several characters in it, so you need a different voice for each one. Your listeners then know immediately who is speaking without you saying who it was.\n\nUse two things to change a character. Make the voice higher or lower, and make it louder or softer. A wolf usually gets a big, low voice. A mouse usually gets a tiny, high voice. A worried character might speak quickly. A shy character might speak softly and slowly.\n\nYou do not need to be an actor. One clear change in pitch and volume is enough for a listener to follow the story. The narrator, which is you, uses your normal voice between characters.",
      "example": "For the wolf say, I will huff and I will puff, in a big low voice. For the mouse say, Squeak, help me, in a tiny high voice.",
      "notice": "A common mistake is using the same flat voice for every character. Then the listener cannot tell who is talking.",
      "check": {
        "type": "multiple_choice",
        "question": "What are the two easiest ways to change your voice for a character?",
        "options": [
          "Speak in a different language",
          "Change how high or low it is and how loud it is",
          "Close your eyes",
          "Face the other way"
        ],
        "correct_index": 1,
        "explanation": "Changing pitch and volume is enough for listeners to know who is speaking."
      },
      "visual": {
        "svg": "<svg viewBox=\"0 0 720 330\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>@keyframes legA{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(26deg)}}@keyframes legB{0%,100%{transform:rotate(26deg)}50%{transform:rotate(-24deg)}}@keyframes armA{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-26deg)}}@keyframes armB{0%,100%{transform:rotate(-26deg)}50%{transform:rotate(22deg)}}@keyframes waveArm{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(-40deg)}}@keyframes wag{0%,100%{transform:rotate(-18deg)}50%{transform:rotate(18deg)}}@keyframes flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.4)}}@keyframes sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}@keyframes drift{0%{transform:translateX(-12px)}100%{transform:translateX(14px)}}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes bite{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.5)}}@keyframes rise{0%{transform:translateY(6px) scale(.6);opacity:0}18%{opacity:1}100%{transform:translateY(-54px) scale(1);opacity:0}}@keyframes fall{0%{transform:translateY(-14px);opacity:0}18%{opacity:1}100%{transform:translateY(26px);opacity:0}}@keyframes pop{0%{transform:scale(.5);opacity:0}55%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}@keyframes blink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}@keyframes ripple{0%,100%{transform:scaleX(1);opacity:.7}50%{transform:scaleX(1.2);opacity:1}}@keyframes float{0%{transform:translate(0,0)}50%{transform:translate(4px,-3px)}100%{transform:translate(-3px,2px)}}@keyframes jump{0%,100%{transform:translateY(0)}30%{transform:translateY(-14px)}}.a4whd{animation:bob .9s ease-in-out infinite}.a4wmo{animation:bite .7s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a4b{animation:pop .5s ease-out both}.a4b2{animation:pop .5s ease-out both}.a4a1{animation:bob 1.4s ease-in-out infinite}.a4a2{animation:bob 1.4s ease-in-out infinite}.sb{font-family:Arial,sans-serif;font-weight:700}.st{font-family:Arial,sans-serif}@media (prefers-reduced-motion:reduce){.scn *{animation:none !important}animate{display:none}}</style><g class=\"scn\"><defs><linearGradient id=\"gl4s4\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#a9d8ff\"/><stop offset=\"0.62\" stop-color=\"#d8efff\"/><stop offset=\"1\" stop-color=\"#eef9ff\"/></linearGradient></defs><rect width=\"720\" height=\"330\" rx=\"20\" fill=\"url(#gl4s4)\"/><rect x=\"0\" y=\"254\" width=\"720\" height=\"76\" rx=\"0\" fill=\"#8fe38f\"/><ellipse cx=\"102.4\" cy=\"278.2\" rx=\"24.2\" ry=\"14.3\" fill=\"#9aa5b5\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><path d=\"M91.4 278.2 L82.6 260.6\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"8.9\" stroke-linecap=\"round\"/><path d=\"M91.4 278.2 L82.6 260.6\" fill=\"none\" stroke=\"#9aa5b5\" stroke-width=\"5.5\" stroke-linecap=\"round\"/><g class=\"a4whd\"><circle cx=\"120.0\" cy=\"243.0\" r=\"17.6\" fill=\"#9aa5b5\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><path d=\"M104.6 229.8 L99.1 212.2 L115.6 225.4 Z\" fill=\"#9aa5b5\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><path d=\"M135.4 229.8 L140.9 212.2 L124.4 225.4 Z\" fill=\"#9aa5b5\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><ellipse cx=\"124.4\" cy=\"251.8\" rx=\"14.3\" ry=\"9.9\" fill=\"#c9d2df\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><circle cx=\"133.2\" cy=\"251.8\" r=\"3.5\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><ellipse cx=\"125.0\" cy=\"238.6\" rx=\"3.4\" ry=\"4.0\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"125.4\" cy=\"239.1\" r=\"1.9\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"124.2\" cy=\"237.4\" r=\"0.8\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><g class=\"a4wmo\"><path d=\"M120.0 258.4 q5.5 5.5 11.0 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g></g><ellipse cx=\"507.5\" cy=\"284.5\" rx=\"16.2\" ry=\"11.2\" fill=\"#b9c2cf\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><circle cx=\"527.5\" cy=\"277.0\" r=\"11.2\" fill=\"#b9c2cf\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><circle cx=\"521.2\" cy=\"265.8\" r=\"7.5\" fill=\"#b9c2cf\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"533.8\" cy=\"265.8\" r=\"7.5\" fill=\"#b9c2cf\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"521.2\" cy=\"265.8\" r=\"3.8\" fill=\"#f4a7bb\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"533.8\" cy=\"265.8\" r=\"3.8\" fill=\"#f4a7bb\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><ellipse cx=\"531.5\" cy=\"275.8\" rx=\"2.7\" ry=\"3.2\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"531.8\" cy=\"276.1\" r=\"1.5\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"530.9\" cy=\"274.8\" r=\"0.6\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"536.2\" cy=\"279.5\" r=\"2.5\" fill=\"#f08ea8\" stroke=\"#2b2521\" stroke-width=\"1.2\"/><path d=\"M495.0 284.5 Q485.0 274.5 490.0 262.0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"6.4\" stroke-linecap=\"round\"/><path d=\"M495.0 284.5 Q485.0 274.5 490.0 262.0\" fill=\"none\" stroke=\"#c9d2df\" stroke-width=\"3.0\" stroke-linecap=\"round\"/><g class=\"a4b\"><rect x=\"250\" y=\"58\" width=\"410\" height=\"58\" rx=\"24.2\" fill=\"#ffffff\" stroke=\"#334155\" stroke-width=\"2.6\"/><path d=\"M272.0 116.0 L266.0 132.0 L296.0 116.0 Z\" fill=\"#ffffff\" stroke=\"#334155\" stroke-width=\"2.6\" stroke-linejoin=\"round\"/><text x=\"455.0\" y=\"92.8\" text-anchor=\"middle\" font-size=\"17\" font-family=\"Arial,sans-serif\" font-weight=\"700\" fill=\"#1f2937\">I will huff and I will puff</text></g><g class=\"a4b2\"><rect x=\"556\" y=\"150\" width=\"132\" height=\"46\" rx=\"19.2\" fill=\"#fff1c9\" stroke=\"#f59e0b\" stroke-width=\"2.6\"/><path d=\"M648.0 196.0 L658.0 212.0 L674.0 196.0 Z\" fill=\"#fff1c9\" stroke=\"#f59e0b\" stroke-width=\"2.6\" stroke-linejoin=\"round\"/><text x=\"622.0\" y=\"178.1\" text-anchor=\"middle\" font-size=\"15\" font-family=\"Arial,sans-serif\" font-weight=\"700\" fill=\"#8a3d0f\">Squeak!</text></g><g class=\"a4a1\"><path d=\"M176.0 238.0 L176.0 192.0\" stroke=\"#334155\" stroke-width=\"4\" stroke-linecap=\"round\"/><path d=\"M176.0 192.0 l-12 2 l6 -12 z\" fill=\"#334155\"/></g><text x=\"176\" y=\"184\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"700\" fill=\"#334155\" class=\"st\">big voice</text><g class=\"a4a2\"><path d=\"M500.0 236.0 L500.0 262.0\" stroke=\"#f59e0b\" stroke-width=\"4\" stroke-linecap=\"round\"/><path d=\"M500.0 262.0 l-12 2 l6 -12 z\" fill=\"#f59e0b\"/></g><text x=\"500\" y=\"228\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"700\" fill=\"#8a3d0f\" class=\"st\">small voice</text><rect x=\"60\" y=\"300\" width=\"600\" height=\"26\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"360\" y=\"319\" text-anchor=\"middle\" font-size=\"16\" font-weight=\"700\" fill=\"#334155\" class=\"sb\">Change your voice for each character</text></g></svg>",
        "alt": "Animated cartoon: a grey wolf with a big speech bubble saying I will huff and I will puff and an arrow labelled big voice, plus a small mouse with a bubble saying Squeak and an arrow labelled small voice.",
        "caption": "A big voice for the wolf and a tiny voice for the mouse."
      }
    },
    {
      "icon": "⏸️",
      "title": "Pause and use expression",
      "explain": "Expression is how you say the words, not what the words are. Two storytellers can say the same sentence and one of them will be much more interesting to listen to.\n\nPause at every full stop, and make the pause long enough to count to one. When you read a question, let your voice rise at the end. When you read an exclamation, make the strong words sound stronger and a little louder. If a sentence says the dragon crept closer, say it slowly and quietly as the dragon creeps.\n\nExpression is what makes listeners feel the story instead of only hearing it. Practise one sentence until it sounds the way you want, then use that same care for the whole story.",
      "example": "Say: The dragon crept closer. Say it slowly and softly, then say it in a flat voice. The slow one sounds like a dragon.",
      "notice": "Reading every sentence in the same flat voice is the fastest way to lose an audience, even with a good story.",
      "check": {
        "type": "multiple_choice",
        "question": "What should your voice do when you read a question aloud?",
        "options": [
          "Drop flat at the end",
          "Rise at the end",
          "Get very quiet",
          "Speed up"
        ],
        "correct_index": 1,
        "explanation": "A question lifts at the end. That lift tells listeners a question is being asked."
      },
      "visual": {
        "svg": "<svg viewBox=\"0 0 720 330\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>@keyframes legA{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(26deg)}}@keyframes legB{0%,100%{transform:rotate(26deg)}50%{transform:rotate(-24deg)}}@keyframes armA{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-26deg)}}@keyframes armB{0%,100%{transform:rotate(-26deg)}50%{transform:rotate(22deg)}}@keyframes waveArm{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(-40deg)}}@keyframes wag{0%,100%{transform:rotate(-18deg)}50%{transform:rotate(18deg)}}@keyframes flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.4)}}@keyframes sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}@keyframes drift{0%{transform:translateX(-12px)}100%{transform:translateX(14px)}}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes bite{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.5)}}@keyframes rise{0%{transform:translateY(6px) scale(.6);opacity:0}18%{opacity:1}100%{transform:translateY(-54px) scale(1);opacity:0}}@keyframes fall{0%{transform:translateY(-14px);opacity:0}18%{opacity:1}100%{transform:translateY(26px);opacity:0}}@keyframes pop{0%{transform:scale(.5);opacity:0}55%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}@keyframes blink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}@keyframes ripple{0%,100%{transform:scaleX(1);opacity:.7}50%{transform:scaleX(1.2);opacity:1}}@keyframes float{0%{transform:translate(0,0)}50%{transform:translate(4px,-3px)}100%{transform:translate(-3px,2px)}}@keyframes jump{0%,100%{transform:translateY(0)}30%{transform:translateY(-14px)}}.a5b0{animation:pop .5s ease-out both;animation-delay:0.3s}.a5b1{animation:pop .5s ease-out both;animation-delay:0.8s}.a5b2{animation:pop .5s ease-out both;animation-delay:1.3s}.a5klL{animation:legA 0.9s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a5klR{animation:legB %ss ease-in-out infinite;transform-box:fill-box;transform-origin:50%% 0%%}.a5kbd{animation:bob 0.9s ease-in-out infinite}.a5khd{animation:bob 0.9s ease-in-out infinite}.a5key{animation:blink 4.2s linear infinite;transform-box:fill-box;transform-origin:50% 50%}.a5kaL{animation:armB 1.26s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a5kaR{animation:waveArm 0.9s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%}.a5kbd{animation:bob 0.9s ease-in-out infinite}.a5bb{animation:pop .5s ease-out both}.sb{font-family:Arial,sans-serif;font-weight:700}@media (prefers-reduced-motion:reduce){.scn *{animation:none !important}animate{display:none}}</style><g class=\"scn\"><rect x=\"0\" y=\"0\" width=\"720\" height=\"330\" rx=\"20\" fill=\"#f7f6ff\"/><g class=\"a5b0\"><rect x=\"30\" y=\"48\" width=\"210\" height=\"140\" rx=\"14\" fill=\"#dbeafe\" stroke=\"#1e40af\" stroke-width=\"2.6\"/><text x=\"135\" y=\"128\" text-anchor=\"middle\" font-size=\"48\" font-weight=\"700\" fill=\"#1e40af\" class=\"sb\">||</text><text x=\"135\" y=\"168\" text-anchor=\"middle\" font-size=\"18\" font-weight=\"700\" fill=\"#1e40af\" class=\"sb\">Pause</text><text x=\"135.0\" y=\"212\" text-anchor=\"middle\" font-size=\"14\" font-family=\"Arial,sans-serif\" fill=\"#334155\">stop at the full stop</text></g><g class=\"a5b1\"><rect x=\"260\" y=\"48\" width=\"210\" height=\"140\" rx=\"14\" fill=\"#ffedd5\" stroke=\"#9a3412\" stroke-width=\"2.6\"/><text x=\"365\" y=\"128\" text-anchor=\"middle\" font-size=\"48\" font-weight=\"700\" fill=\"#9a3412\" class=\"sb\">?</text><text x=\"365\" y=\"168\" text-anchor=\"middle\" font-size=\"18\" font-weight=\"700\" fill=\"#9a3412\" class=\"sb\">Lift</text><text x=\"365.0\" y=\"212\" text-anchor=\"middle\" font-size=\"14\" font-family=\"Arial,sans-serif\" fill=\"#334155\">your voice rises</text></g><g class=\"a5b2\"><rect x=\"490\" y=\"48\" width=\"210\" height=\"140\" rx=\"14\" fill=\"#ffe4e6\" stroke=\"#9f1239\" stroke-width=\"2.6\"/><text x=\"595\" y=\"128\" text-anchor=\"middle\" font-size=\"48\" font-weight=\"700\" fill=\"#9f1239\" class=\"sb\">!</text><text x=\"595\" y=\"168\" text-anchor=\"middle\" font-size=\"18\" font-weight=\"700\" fill=\"#9f1239\" class=\"sb\">Feel</text><text x=\"595.0\" y=\"212\" text-anchor=\"middle\" font-size=\"14\" font-family=\"Arial,sans-serif\" fill=\"#334155\">strong words sound strong</text></g><ellipse cx=\"62.0\" cy=\"317.0\" rx=\"23.0\" ry=\"6.0\" fill=\"#000\" opacity=\"0.12\"/><g class=\"a5klL\"><path d=\"M55.5 288.0 L55.5 305.0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"12.4\" stroke-linecap=\"round\"/><path d=\"M55.5 288.0 L55.5 305.0\" fill=\"none\" stroke=\"#2f6bcf\" stroke-width=\"9.0\" stroke-linecap=\"round\"/></g><g class=\"a5klR\"><path d=\"M68.5 288.0 L68.5 305.0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"12.4\" stroke-linecap=\"round\"/><path d=\"M68.5 288.0 L68.5 305.0\" fill=\"none\" stroke=\"#2f6bcf\" stroke-width=\"9.0\" stroke-linecap=\"round\"/></g><rect x=\"49.0\" y=\"304.0\" width=\"17.0\" height=\"10.0\" rx=\"5.0\" fill=\"#334155\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><rect x=\"59.0\" y=\"304.0\" width=\"17.0\" height=\"10.0\" rx=\"5.0\" fill=\"#334155\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><path d=\"M48.0 288.0 L44.0 269.0 Q44.0 262.0 52.0 261.0 L72.0 261.0 Q80.0 262.0 80.0 269.0 L76.0 288.0 Z\" fill=\"#f472b6\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><path d=\"M56.0 261.0 Q62.0 266.0 68.0 261.0\" fill=\"#f472b6\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><g class=\"a5kaL\"><path d=\"M45.0 267.0 Q40.0 276.0 43.0 284.0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"9.4\" stroke-linecap=\"round\"/><path d=\"M45.0 267.0 Q40.0 276.0 43.0 284.0\" fill=\"none\" stroke=\"#f6c9a0\" stroke-width=\"6.0\" stroke-linecap=\"round\"/></g><g class=\"a5kaR\"><path d=\"M79.0 267.0 Q89.0 258.0 88.0 244.0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"9.4\" stroke-linecap=\"round\"/><path d=\"M79.0 267.0 Q89.0 258.0 88.0 244.0\" fill=\"none\" stroke=\"#f6c9a0\" stroke-width=\"6.0\" stroke-linecap=\"round\"/></g><circle cx=\"43.0\" cy=\"284.0\" r=\"3.4\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"81.0\" cy=\"284.0\" r=\"3.4\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><rect x=\"58.5\" y=\"256.0\" width=\"7.0\" height=\"7.0\" rx=\"3.0\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><circle cx=\"45.5\" cy=\"242.0\" r=\"4.2\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"78.5\" cy=\"242.0\" r=\"4.2\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><g class=\"a5khd\"><circle cx=\"62.0\" cy=\"242.0\" r=\"16.0\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><path d=\"M46.0 240.0 Q43.0 222.0 62.0 222.0 Q81.0 222.0 78.0 240.0 Q72.0 234.0 66.0 237.0 Q60.0 234.0 54.0 237.0 Q50.0 234.0 46.0 240.0 Z\" fill=\"#4a3222\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><g class=\"a5key\"><ellipse cx=\"56.6\" cy=\"242.0\" rx=\"3.6\" ry=\"4.3\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"56.2\" cy=\"242.5\" r=\"2.0\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"57.5\" cy=\"240.7\" r=\"0.8\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><ellipse cx=\"67.4\" cy=\"242.0\" rx=\"3.6\" ry=\"4.3\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"67.8\" cy=\"242.5\" r=\"2.0\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"66.5\" cy=\"240.7\" r=\"0.8\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/></g><path d=\"M54.0 234.0 q3.0 -2.2 6.0 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><path d=\"M64.0 234.0 q3.0 -2.2 6.0 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><ellipse cx=\"52.0\" cy=\"248.0\" rx=\"3.6\" ry=\"2.4\" fill=\"#f87171\" opacity=\"0.35\"/><ellipse cx=\"72.0\" cy=\"248.0\" rx=\"3.6\" ry=\"2.4\" fill=\"#f87171\" opacity=\"0.35\"/><path d=\"M57.5 250.0 q4.5 4.8 9.0 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><g class=\"a5bb\"><rect x=\"150\" y=\"250\" width=\"450\" height=\"52\" rx=\"21.7\" fill=\"#ffffff\" stroke=\"#7c3aed\" stroke-width=\"2.6\"/><path d=\"M172.0 302.0 L166.0 318.0 L196.0 302.0 Z\" fill=\"#ffffff\" stroke=\"#7c3aed\" stroke-width=\"2.6\" stroke-linejoin=\"round\"/><text x=\"375.0\" y=\"281.8\" text-anchor=\"middle\" font-size=\"17\" font-family=\"Arial,sans-serif\" font-weight=\"700\" fill=\"#52309c\">Once... upon... a... time</text></g></g></svg>",
        "alt": "Animated cartoon: three cards showing a pause symbol for pausing at the full stop, a question mark for a rising voice and an exclamation mark for strong words, with a girl speaking the line Once upon a time in a slow storytelling voice.",
        "caption": "Pause at the full stop, lift your voice for a question, and make strong words sound strong."
      }
    },
    {
      "icon": "💬",
      "title": "Tell it in your own words",
      "explain": "Good storytellers do not memorise every word. They remember the story, then tell it in their own words. That sounds natural and it means you can never get stuck because you forgot one sentence.\n\nStart by telling the story to yourself in three sentences: one for the beginning, one for the middle, one for the end. Then tell it again, adding one more detail to each part. Each time you tell it, your story gets fuller without being written down and memorised.\n\nThis is the difference between reading a story aloud and telling a story. Reading uses someone else''s words. Telling uses the pictures in your head, and that is why listeners lean in to hear a told story.",
      "example": "Tell the rabbit story in your own words: A rabbit found a carrot. Another rabbit wanted it. They shared it and ate together.",
      "notice": "Trying to remember a story word for word makes storytellers freeze when one sentence slips.",
      "check": {
        "type": "multiple_choice",
        "question": "What is the best way to remember a story you will tell aloud?",
        "options": [
          "Memorise every word exactly",
          "Remember the three parts and tell it in your own words",
          "Write it out and read it",
          "Practise it only once"
        ],
        "correct_index": 1,
        "explanation": "If you remember the beginning, middle and end, you can always tell the story in your own words."
      },
      "visual": {
        "svg": "<svg viewBox=\"0 0 720 330\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>@keyframes legA{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(26deg)}}@keyframes legB{0%,100%{transform:rotate(26deg)}50%{transform:rotate(-24deg)}}@keyframes armA{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-26deg)}}@keyframes armB{0%,100%{transform:rotate(-26deg)}50%{transform:rotate(22deg)}}@keyframes waveArm{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(-40deg)}}@keyframes wag{0%,100%{transform:rotate(-18deg)}50%{transform:rotate(18deg)}}@keyframes flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.4)}}@keyframes sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}@keyframes drift{0%{transform:translateX(-12px)}100%{transform:translateX(14px)}}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes bite{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.5)}}@keyframes rise{0%{transform:translateY(6px) scale(.6);opacity:0}18%{opacity:1}100%{transform:translateY(-54px) scale(1);opacity:0}}@keyframes fall{0%{transform:translateY(-14px);opacity:0}18%{opacity:1}100%{transform:translateY(26px);opacity:0}}@keyframes pop{0%{transform:scale(.5);opacity:0}55%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}@keyframes blink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}@keyframes ripple{0%,100%{transform:scaleX(1);opacity:.7}50%{transform:scaleX(1.2);opacity:1}}@keyframes float{0%{transform:translate(0,0)}50%{transform:translate(4px,-3px)}100%{transform:translate(-3px,2px)}}@keyframes jump{0%,100%{transform:translateY(0)}30%{transform:translateY(-14px)}}.a6r1er{animation:flap 1.6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a6r1hd{animation:bob .8s ease-in-out infinite}.a6r1ey{animation:blink 4.4s linear infinite;transform-box:fill-box;transform-origin:50% 50%}.a6r2er{animation:flap 1.6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a6r2hd{animation:bob .8s ease-in-out infinite}.a6r2ey{animation:blink 4.4s linear infinite;transform-box:fill-box;transform-origin:50% 50%}.a6r3er{animation:flap 1.6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a6r3hd{animation:bob .8s ease-in-out infinite}.a6r3ey{animation:blink 4.4s linear infinite;transform-box:fill-box;transform-origin:50% 50%}.a6r4er{animation:flap 1.6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a6r4hd{animation:bob .8s ease-in-out infinite}.a6r4ey{animation:blink 4.4s linear infinite;transform-box:fill-box;transform-origin:50% 50%}.a6klL{animation:legA 0.9s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a6klR{animation:legB %ss ease-in-out infinite;transform-box:fill-box;transform-origin:50%% 0%%}.a6kbd{animation:bob 0.9s ease-in-out infinite}.a6khd{animation:bob 0.9s ease-in-out infinite}.a6key{animation:blink 4.2s linear infinite;transform-box:fill-box;transform-origin:50% 50%}.a6kaL{animation:armB 1.26s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a6kaR{animation:waveArm 0.9s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%}.a6kbd{animation:bob 0.9s ease-in-out infinite}.a6b{animation:pop .5s ease-out both}.sb{font-family:Arial,sans-serif;font-weight:700}@media (prefers-reduced-motion:reduce){.scn *{animation:none !important}animate{display:none}}</style><g class=\"scn\"><rect x=\"0\" y=\"0\" width=\"720\" height=\"330\" rx=\"20\" fill=\"#f2fbf3\"/><rect x=\"40\" y=\"40\" width=\"200\" height=\"132\" rx=\"14\" fill=\"#dbeafe\" stroke=\"#1e40af\" stroke-width=\"2.6\"/><text x=\"140\" y=\"74\" text-anchor=\"middle\" font-size=\"18\" font-weight=\"700\" fill=\"#1e40af\" class=\"sb\">First</text><ellipse cx=\"110.0\" cy=\"144.8\" rx=\"14.0\" ry=\"9.1\" fill=\"#e7e2da\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><circle cx=\"98.8\" cy=\"140.6\" r=\"4.2\" fill=\"#cfc8bd\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><g class=\"a6r1hd\"><circle cx=\"122.6\" cy=\"133.6\" r=\"9.1\" fill=\"#e7e2da\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><g class=\"a6r1er\"><path d=\"M119.1 126.6 q-2.1 -8.4 -3.5 -15.4 q5.6 4.2 2.8 11.2 Z\" fill=\"#e7e2da\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><g class=\"a6r1er\"><path d=\"M126.8 126.6 q2.1 -8.4 4.9 -14.0 q-4.9 3.5 -2.8 9.8 Z\" fill=\"#e7e2da\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><g class=\"a6r1ey\"><ellipse cx=\"124.9\" cy=\"132.9\" rx=\"1.6\" ry=\"1.9\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"125.1\" cy=\"133.1\" r=\"0.9\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"124.6\" cy=\"132.3\" r=\"0.4\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/></g><circle cx=\"128.9\" cy=\"135.7\" r=\"1.5\" fill=\"#f08ea8\" stroke=\"#2b2521\" stroke-width=\"1.4\"/><path d=\"M125.4 138.5 q2.1 2.1 4.2 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"1.8\" stroke-linejoin=\"round\"/></g><rect x=\"260\" y=\"40\" width=\"200\" height=\"132\" rx=\"14\" fill=\"#ffedd5\" stroke=\"#9a3412\" stroke-width=\"2.6\"/><text x=\"360\" y=\"74\" text-anchor=\"middle\" font-size=\"18\" font-weight=\"700\" fill=\"#9a3412\" class=\"sb\">Then</text><path d=\"M340.0 158.0 l12.6 -27.0 l12.6 27.0 z\" fill=\"#f97316\" stroke=\"2.2\" stroke-width=\"None\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M352.6 131.0 l-7.2 -10.8 M352.6 131.0 l3.6 -11.7\" fill=\"none\" stroke=\"#15803d\" stroke-width=\"3.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><ellipse cx=\"400.0\" cy=\"148.4\" rx=\"12.0\" ry=\"7.8\" fill=\"#dfd8cd\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><circle cx=\"390.4\" cy=\"144.8\" r=\"3.6\" fill=\"#cfc8bd\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><g class=\"a6r2hd\"><circle cx=\"410.8\" cy=\"138.8\" r=\"7.8\" fill=\"#dfd8cd\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><g class=\"a6r2er\"><path d=\"M407.8 132.8 q-1.8 -7.2 -3.0 -13.2 q4.8 3.6 2.4 9.6 Z\" fill=\"#dfd8cd\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><g class=\"a6r2er\"><path d=\"M414.4 132.8 q1.8 -7.2 4.2 -12.0 q-4.2 3.0 -2.4 8.4 Z\" fill=\"#dfd8cd\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><g class=\"a6r2ey\"><ellipse cx=\"412.8\" cy=\"138.2\" rx=\"1.3\" ry=\"1.6\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"413.0\" cy=\"138.4\" r=\"0.7\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"412.5\" cy=\"137.7\" r=\"0.3\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/></g><circle cx=\"416.2\" cy=\"140.6\" r=\"1.3\" fill=\"#f08ea8\" stroke=\"#2b2521\" stroke-width=\"1.4\"/><path d=\"M413.2 143.0 q1.8 1.8 3.6 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"1.8\" stroke-linejoin=\"round\"/></g><rect x=\"480\" y=\"40\" width=\"200\" height=\"132\" rx=\"14\" fill=\"#dcfce7\" stroke=\"#166534\" stroke-width=\"2.6\"/><text x=\"580\" y=\"74\" text-anchor=\"middle\" font-size=\"18\" font-weight=\"700\" fill=\"#166534\" class=\"sb\">Last</text><ellipse cx=\"550.0\" cy=\"144.8\" rx=\"14.0\" ry=\"9.1\" fill=\"#e7e2da\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><circle cx=\"538.8\" cy=\"140.6\" r=\"4.2\" fill=\"#cfc8bd\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><g class=\"a6r3hd\"><circle cx=\"562.6\" cy=\"133.6\" r=\"9.1\" fill=\"#e7e2da\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><g class=\"a6r3er\"><path d=\"M559.1 126.6 q-2.1 -8.4 -3.5 -15.4 q5.6 4.2 2.8 11.2 Z\" fill=\"#e7e2da\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><g class=\"a6r3er\"><path d=\"M566.8 126.6 q2.1 -8.4 4.9 -14.0 q-4.9 3.5 -2.8 9.8 Z\" fill=\"#e7e2da\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><g class=\"a6r3ey\"><ellipse cx=\"564.9\" cy=\"132.9\" rx=\"1.6\" ry=\"1.9\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"565.1\" cy=\"133.1\" r=\"0.9\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"564.6\" cy=\"132.3\" r=\"0.4\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/></g><circle cx=\"568.9\" cy=\"135.7\" r=\"1.5\" fill=\"#f08ea8\" stroke=\"#2b2521\" stroke-width=\"1.4\"/><path d=\"M565.4 138.5 q2.1 2.1 4.2 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"1.8\" stroke-linejoin=\"round\"/></g><ellipse cx=\"620.0\" cy=\"147.8\" rx=\"12.8\" ry=\"8.3\" fill=\"#f3ece2\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><circle cx=\"609.8\" cy=\"143.9\" r=\"3.8\" fill=\"#cfc8bd\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><g class=\"a6r4hd\"><circle cx=\"631.5\" cy=\"137.5\" r=\"8.3\" fill=\"#f3ece2\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><g class=\"a6r4er\"><path d=\"M628.3 131.1 q-1.9 -7.7 -3.2 -14.1 q5.1 3.8 2.6 10.2 Z\" fill=\"#f3ece2\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><g class=\"a6r4er\"><path d=\"M635.4 131.1 q1.9 -7.7 4.5 -12.8 q-4.5 3.2 -2.6 9.0 Z\" fill=\"#f3ece2\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><g class=\"a6r4ey\"><ellipse cx=\"633.7\" cy=\"136.9\" rx=\"1.4\" ry=\"1.7\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"633.8\" cy=\"137.1\" r=\"0.8\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"633.3\" cy=\"136.4\" r=\"0.3\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/></g><circle cx=\"637.3\" cy=\"139.4\" r=\"1.4\" fill=\"#f08ea8\" stroke=\"#2b2521\" stroke-width=\"1.4\"/><path d=\"M634.1 142.0 q1.9 1.9 3.8 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"1.8\" stroke-linejoin=\"round\"/></g><ellipse cx=\"120.0\" cy=\"309.1\" rx=\"24.2\" ry=\"6.3\" fill=\"#000\" opacity=\"0.12\"/><g class=\"a6klL\"><path d=\"M113.2 278.7 L113.2 296.6\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"12.9\" stroke-linecap=\"round\"/><path d=\"M113.2 278.7 L113.2 296.6\" fill=\"none\" stroke=\"#2f6bcf\" stroke-width=\"9.5\" stroke-linecap=\"round\"/></g><g class=\"a6klR\"><path d=\"M126.8 278.7 L126.8 296.6\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"12.9\" stroke-linecap=\"round\"/><path d=\"M126.8 278.7 L126.8 296.6\" fill=\"none\" stroke=\"#2f6bcf\" stroke-width=\"9.5\" stroke-linecap=\"round\"/></g><rect x=\"106.3\" y=\"295.5\" width=\"17.9\" height=\"10.5\" rx=\"5.2\" fill=\"#334155\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><rect x=\"116.8\" y=\"295.5\" width=\"17.9\" height=\"10.5\" rx=\"5.2\" fill=\"#334155\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><path d=\"M105.3 278.7 L101.1 258.8 Q101.1 251.4 109.5 250.3 L130.5 250.3 Q138.9 251.4 138.9 258.8 L134.7 278.7 Z\" fill=\"#0ea5e9\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><path d=\"M113.7 250.3 Q120.0 255.6 126.3 250.3\" fill=\"#0ea5e9\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><g class=\"a6kaL\"><path d=\"M102.2 256.6 Q96.9 266.1 100.0 274.5\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"9.7\" stroke-linecap=\"round\"/><path d=\"M102.2 256.6 Q96.9 266.1 100.0 274.5\" fill=\"none\" stroke=\"#f6c9a0\" stroke-width=\"6.3\" stroke-linecap=\"round\"/></g><g class=\"a6kaR\"><path d=\"M137.8 256.6 Q148.3 247.2 147.3 232.5\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"9.7\" stroke-linecap=\"round\"/><path d=\"M137.8 256.6 Q148.3 247.2 147.3 232.5\" fill=\"none\" stroke=\"#f6c9a0\" stroke-width=\"6.3\" stroke-linecap=\"round\"/></g><circle cx=\"100.0\" cy=\"274.5\" r=\"3.6\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"139.9\" cy=\"274.5\" r=\"3.6\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><rect x=\"116.3\" y=\"245.1\" width=\"7.4\" height=\"7.4\" rx=\"3.2\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><circle cx=\"102.7\" cy=\"230.4\" r=\"4.4\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"137.3\" cy=\"230.4\" r=\"4.4\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><g class=\"a6khd\"><circle cx=\"120.0\" cy=\"230.4\" r=\"16.8\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><path d=\"M103.2 228.3 Q100.0 209.4 120.0 209.4 Q139.9 209.4 136.8 228.3 Q130.5 222.0 124.2 225.1 Q117.9 222.0 111.6 225.1 Q107.4 222.0 103.2 228.3 Z\" fill=\"#4a3222\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><g class=\"a6key\"><ellipse cx=\"114.3\" cy=\"230.4\" rx=\"3.8\" ry=\"4.5\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"113.9\" cy=\"230.9\" r=\"2.1\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"115.3\" cy=\"229.0\" r=\"0.9\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><ellipse cx=\"125.7\" cy=\"230.4\" rx=\"3.8\" ry=\"4.5\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"126.1\" cy=\"230.9\" r=\"2.1\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"124.7\" cy=\"229.0\" r=\"0.9\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/></g><path d=\"M111.6 222.0 q3.2 -2.3 6.3 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><path d=\"M122.1 222.0 q3.2 -2.3 6.3 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><ellipse cx=\"109.5\" cy=\"236.7\" rx=\"3.8\" ry=\"2.5\" fill=\"#f87171\" opacity=\"0.35\"/><ellipse cx=\"130.5\" cy=\"236.7\" rx=\"3.8\" ry=\"2.5\" fill=\"#f87171\" opacity=\"0.35\"/><path d=\"M115.3 238.8 q4.7 5.0 9.5 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><g class=\"a6b\"><rect x=\"240\" y=\"240\" width=\"420\" height=\"54\" rx=\"22.5\" fill=\"#ffffff\" stroke=\"#0ea5e9\" stroke-width=\"2.6\"/><path d=\"M262.0 294.0 L256.0 310.0 L286.0 294.0 Z\" fill=\"#ffffff\" stroke=\"#0ea5e9\" stroke-width=\"2.6\" stroke-linejoin=\"round\"/><text x=\"450.0\" y=\"272.8\" text-anchor=\"middle\" font-size=\"17\" font-family=\"Arial,sans-serif\" font-weight=\"700\" fill=\"#0c4a6e\">So the rabbit shared the carrot</text></g></g></svg>",
        "alt": "Animated cartoon: a picture strip showing a rabbit finding a carrot, a second rabbit arriving, and the two rabbits sharing, labelled First, Then and Last, with a boy telling the story and a speech bubble saying so the rabbit shared the carrot.",
        "caption": "Use the pictures in your head, not memorised words: first, then, last."
      }
    },
    {
      "icon": "✏️",
      "title": "Joined handwriting: the four joins",
      "explain": "Joined handwriting means the letters in a word are connected, so the pencil keeps moving until the word is finished. It is faster than printing and it helps your hand remember the shape of a word.\n\nStart each letter on the baseline, the solid line. Leave the exit stroke at the end of a letter so it flows into the next letter without lifting the pencil. The four joins you will practise are an, in, ck and ou. Keep the letters the same height, keep them sitting on the baseline, and keep your slant the same all the way along the word.\n\nLegible means a reader can read it easily. Joined writing only helps if it is still clear, so slow down when a word is new and keep the letters the same size.",
      "example": "Write an with one movement: start on the line, make the a, keep going and make the n, then stop. The pencil never left the paper.",
      "notice": "Lifting the pencil between every letter turns joined writing back into printing. The join is the whole point.",
      "check": {
        "type": "multiple_choice",
        "question": "Where should each joined letter start?",
        "options": [
          "In the air",
          "At the top of the page",
          "On the dotted line",
          "On the baseline"
        ],
        "correct_index": 3,
        "explanation": "Joined letters start on the baseline so the word stays straight and even."
      },
      "visual": {
        "svg": "<svg viewBox=\"0 0 720 340\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>@keyframes legA{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(26deg)}}@keyframes legB{0%,100%{transform:rotate(26deg)}50%{transform:rotate(-24deg)}}@keyframes armA{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-26deg)}}@keyframes armB{0%,100%{transform:rotate(-26deg)}50%{transform:rotate(22deg)}}@keyframes waveArm{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(-40deg)}}@keyframes wag{0%,100%{transform:rotate(-18deg)}50%{transform:rotate(18deg)}}@keyframes flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.4)}}@keyframes sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}@keyframes drift{0%{transform:translateX(-12px)}100%{transform:translateX(14px)}}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes bite{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.5)}}@keyframes rise{0%{transform:translateY(6px) scale(.6);opacity:0}18%{opacity:1}100%{transform:translateY(-54px) scale(1);opacity:0}}@keyframes fall{0%{transform:translateY(-14px);opacity:0}18%{opacity:1}100%{transform:translateY(26px);opacity:0}}@keyframes pop{0%{transform:scale(.5);opacity:0}55%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}@keyframes blink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}@keyframes ripple{0%,100%{transform:scaleX(1);opacity:.7}50%{transform:scaleX(1.2);opacity:1}}@keyframes float{0%{transform:translate(0,0)}50%{transform:translate(4px,-3px)}100%{transform:translate(-3px,2px)}}@keyframes jump{0%,100%{transform:translateY(0)}30%{transform:translateY(-14px)}}.a7xt{animation:write 3.4s ease-in-out infinite}.a7j0{animation:pop .5s ease-out both;animation-delay:0.3s}.a7j1{animation:pop .5s ease-out both;animation-delay:0.6s}.a7j2{animation:pop .5s ease-out both;animation-delay:1.0s}.a7j3{animation:pop .5s ease-out both;animation-delay:1.3s}.sb{font-family:Arial,sans-serif;font-weight:700}.st{font-family:Arial,sans-serif}@media (prefers-reduced-motion:reduce){.scn *{animation:none !important}animate{display:none}}</style><g class=\"scn\"><rect x=\"0\" y=\"0\" width=\"720\" height=\"340\" rx=\"20\" fill=\"#fffdf7\"/><path d=\"M60.0 172.0 H660.0\" stroke=\"#c7d2fe\" stroke-width=\"2\" stroke-dasharray=\"6 6\"/><path d=\"M60.0 192.0 H660.0\" stroke=\"#93c5fd\" stroke-width=\"2\" stroke-dasharray=\"6 6\"/><path d=\"M60.0 212.0 H660.0\" stroke=\"#64748b\" stroke-width=\"2.4\"/><g transform=\"translate(70.0,146.0) scale(1.50)\"><g class=\"a7xt\"><path d=\"M14 44 C 10 26, 30 22, 32 38 C 33 45, 25 47, 23 40 C 21 33, 31 29, 40 31 C 46 32, 48 28, 50 24 C 52 18, 57 19, 57 26 L 57 43 C 57 36, 63 21, 68 25 C 72 29, 72 39, 72 43 C 72 47, 70 49, 67 51\" fill=\"none\" stroke=\"#1F3B2D\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-dasharray=\"230\" stroke-dashoffset=\"0\"><animate attributeName=\"stroke-dashoffset\" values=\"230;0;0;230\" keyTimes=\"0;0.55;0.85;1\" dur=\"3.4s\" repeatCount=\"indefinite\"/></path></g><g transform=\"translate(64,40) rotate(-32)\"><rect x=\"-4.0\" y=\"0.0\" width=\"8.0\" height=\"26.0\" rx=\"2.0\" fill=\"#f6c344\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><path d=\"M0 26 L-4 33 L4 33 Z\" fill=\"#e2b07a\" stroke=\"#2b2521\" stroke-width=\"1.6\" stroke-linejoin=\"round\"/><rect x=\"-4.0\" y=\"-6.0\" width=\"8.0\" height=\"6.0\" rx=\"2.0\" fill=\"#ef7d7d\" stroke=\"#2b2521\" stroke-width=\"2.2\"/></g></g><text x=\"360\" y=\"44\" text-anchor=\"middle\" font-size=\"18\" font-weight=\"700\" fill=\"#1f2937\" class=\"sb\">Joined handwriting: keep the pencil on the line</text><g class=\"a7j0\"><rect x=\"60\" y=\"236\" width=\"130\" height=\"56\" rx=\"14\" fill=\"#dbeafe\" stroke=\"#1e40af\" stroke-width=\"2.6\"/><text x=\"125.0\" y=\"272\" text-anchor=\"middle\" font-size=\"26\" font-family=\"Arial,sans-serif\" font-style=\"italic\" font-weight=\"700\" fill=\"#1e40af\">an</text></g><g class=\"a7j1\"><rect x=\"210\" y=\"236\" width=\"130\" height=\"56\" rx=\"14\" fill=\"#ffedd5\" stroke=\"#9a3412\" stroke-width=\"2.6\"/><text x=\"275.0\" y=\"272\" text-anchor=\"middle\" font-size=\"26\" font-family=\"Arial,sans-serif\" font-style=\"italic\" font-weight=\"700\" fill=\"#9a3412\">in</text></g><g class=\"a7j2\"><rect x=\"360\" y=\"236\" width=\"130\" height=\"56\" rx=\"14\" fill=\"#dcfce7\" stroke=\"#166534\" stroke-width=\"2.6\"/><text x=\"425.0\" y=\"272\" text-anchor=\"middle\" font-size=\"26\" font-family=\"Arial,sans-serif\" font-style=\"italic\" font-weight=\"700\" fill=\"#166534\">ck</text></g><g class=\"a7j3\"><rect x=\"510\" y=\"236\" width=\"130\" height=\"56\" rx=\"14\" fill=\"#e6dbff\" stroke=\"#52309c\" stroke-width=\"2.6\"/><text x=\"575.0\" y=\"272\" text-anchor=\"middle\" font-size=\"26\" font-family=\"Arial,sans-serif\" font-style=\"italic\" font-weight=\"700\" fill=\"#52309c\">ou</text></g><rect x=\"80\" y=\"306\" width=\"560\" height=\"28\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"360\" y=\"326\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#334155\" class=\"st\">Start on the line and join without lifting the pencil</text></g></svg>",
        "alt": "Animated cartoon: writing guide lines with a joined an being written and a pencil above the line, plus four cards showing the joins an, in, ck and ou, and the rule to start on the line and join without lifting the pencil.",
        "caption": "Start on the line, keep the pencil moving, and join the letters."
      }
    },
    {
      "icon": "🐰",
      "title": "Handwrite this week''s words in joined letters",
      "explain": "This week''s words are rabbit, garden, kitten, table, candle, thunder, children and elephant. You have already clapped them into chunks, and now you will write them in joined letters.\n\nSay the word in chunks, then write it in chunks, joining every letter as you go. Rabbit is rab then bit, written without lifting the pencil. Keep every letter sitting on the baseline and keep the tall letters like b, d and l the same height.\n\nThese words are in your Word Hoard. When you practise them, do two things at once: spell them correctly and write them in neat joined letters. Neat, joined handwriting makes a piece of writing much easier for a reader to enjoy.",
      "example": "Write rab-bit in joined letters: say rab, write rab joined, say bit, write bit joined, then read the word back.",
      "notice": "A common mistake is to make the letters so small or so crowded that the joins disappear. Keep the word spread out and clear.",
      "check": {
        "type": "multiple_choice",
        "question": "What should you do as you join the letters in rabbit?",
        "options": [
          "Lift the pencil after every letter",
          "Keep every letter sitting on the baseline",
          "Write the letters as small as you can",
          "Write it all in capitals"
        ],
        "correct_index": 1,
        "explanation": "Joined letters sit on the baseline, and the pencil keeps moving."
      },
      "visual": {
        "svg": "<svg viewBox=\"0 0 720 330\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>@keyframes legA{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(26deg)}}@keyframes legB{0%,100%{transform:rotate(26deg)}50%{transform:rotate(-24deg)}}@keyframes armA{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-26deg)}}@keyframes armB{0%,100%{transform:rotate(-26deg)}50%{transform:rotate(22deg)}}@keyframes waveArm{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(-40deg)}}@keyframes wag{0%,100%{transform:rotate(-18deg)}50%{transform:rotate(18deg)}}@keyframes flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.4)}}@keyframes sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}@keyframes drift{0%{transform:translateX(-12px)}100%{transform:translateX(14px)}}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes bite{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.5)}}@keyframes rise{0%{transform:translateY(6px) scale(.6);opacity:0}18%{opacity:1}100%{transform:translateY(-54px) scale(1);opacity:0}}@keyframes fall{0%{transform:translateY(-14px);opacity:0}18%{opacity:1}100%{transform:translateY(26px);opacity:0}}@keyframes pop{0%{transform:scale(.5);opacity:0}55%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}@keyframes blink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}@keyframes ripple{0%,100%{transform:scaleX(1);opacity:.7}50%{transform:scaleX(1.2);opacity:1}}@keyframes float{0%{transform:translate(0,0)}50%{transform:translate(4px,-3px)}100%{transform:translate(-3px,2px)}}@keyframes jump{0%,100%{transform:translateY(0)}30%{transform:translateY(-14px)}}.a8rer{animation:flap 1.6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a8rhd{animation:bob .8s ease-in-out infinite}.a8rey{animation:blink 4.4s linear infinite;transform-box:fill-box;transform-origin:50% 50%}.a8p{animation:bob .9s ease-in-out infinite}.sb{font-family:Arial,sans-serif;font-weight:700}.st{font-family:Arial,sans-serif}@media (prefers-reduced-motion:reduce){.scn *{animation:none !important}animate{display:none}}</style><g class=\"scn\"><rect x=\"0\" y=\"0\" width=\"720\" height=\"330\" rx=\"20\" fill=\"#f7faff\"/><rect x=\"199\" y=\"162\" width=\"162\" height=\"108\" rx=\"8.1\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"2.4\"/><path d=\"M212.5 191.7 H347.5\" stroke=\"#c7d2fe\" stroke-width=\"2\" stroke-dasharray=\"6 6\"/><text x=\"217.9\" y=\"186.3\" font-size=\"21.6\" font-family=\"Arial,sans-serif\" font-style=\"italic\" font-weight=\"700\" fill=\"#1F3B2D\">rabbit</text><path d=\"M212.5 221.4 H347.5\" stroke=\"#c7d2fe\" stroke-width=\"2\" stroke-dasharray=\"6 6\"/><text x=\"217.9\" y=\"216.0\" font-size=\"21.6\" font-family=\"Arial,sans-serif\" font-style=\"italic\" font-weight=\"700\" fill=\"#1F3B2D\">garden</text><path d=\"M212.5 251.1 H347.5\" stroke=\"#c7d2fe\" stroke-width=\"2\" stroke-dasharray=\"6 6\"/><text x=\"217.9\" y=\"245.7\" font-size=\"21.6\" font-family=\"Arial,sans-serif\" font-style=\"italic\" font-weight=\"700\" fill=\"#1F3B2D\">kitten</text><ellipse cx=\"590.0\" cy=\"269.2\" rx=\"21.0\" ry=\"13.7\" fill=\"#e7e2da\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><circle cx=\"573.2\" cy=\"262.9\" r=\"6.3\" fill=\"#cfc8bd\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><g class=\"a8rhd\"><circle cx=\"608.9\" cy=\"252.4\" r=\"13.7\" fill=\"#e7e2da\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><g class=\"a8rer\"><path d=\"M603.6 241.9 q-3.2 -12.6 -5.2 -23.1 q8.4 6.3 4.2 16.8 Z\" fill=\"#e7e2da\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><g class=\"a8rer\"><path d=\"M615.2 241.9 q3.2 -12.6 7.4 -21.0 q-7.4 5.2 -4.2 14.7 Z\" fill=\"#e7e2da\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><g class=\"a8rey\"><ellipse cx=\"612.4\" cy=\"251.3\" rx=\"2.3\" ry=\"2.8\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"612.7\" cy=\"251.7\" r=\"1.3\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"611.8\" cy=\"250.5\" r=\"0.6\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/></g><circle cx=\"618.4\" cy=\"255.6\" r=\"2.3\" fill=\"#f08ea8\" stroke=\"#2b2521\" stroke-width=\"1.4\"/><path d=\"M613.1 259.8 q3.2 3.2 6.3 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"1.8\" stroke-linejoin=\"round\"/></g><g class=\"a8p\" transform=\"translate(508.0,180.0) rotate(-18)\"><rect x=\"-6.0\" y=\"-19.2\" width=\"12.0\" height=\"36.0\" rx=\"2.4\" fill=\"#f6c344\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><path d=\"M0 -19.2 L-6.0 -26.4 L6.0 -26.4 Z\" fill=\"#e2b07a\" stroke=\"#2b2521\" stroke-width=\"1.6\" stroke-linejoin=\"round\"/><path d=\"M0 -28.8 L-3.1 -26.4 L3.1 -26.4 Z\" fill=\"#3b3b3b\" stroke=\"#2b2521\" stroke-width=\"0.0\" stroke-linejoin=\"round\"/><rect x=\"-6.0\" y=\"13.2\" width=\"12.0\" height=\"7.2\" rx=\"2.4\" fill=\"#ef7d7d\" stroke=\"#2b2521\" stroke-width=\"2.2\"/></g><rect x=\"40\" y=\"36\" width=\"300\" height=\"44\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"190\" y=\"66\" text-anchor=\"middle\" font-size=\"20\" font-weight=\"700\" fill=\"#1f2937\" class=\"sb\">rab-bit</text><rect x=\"378\" y=\"36\" width=\"300\" height=\"44\" rx=\"14\" fill=\"#dcfce7\" stroke=\"#166534\" stroke-width=\"2.6\"/><text x=\"528\" y=\"66\" text-anchor=\"middle\" font-size=\"17\" font-weight=\"700\" fill=\"#166534\" class=\"sb\">Join every letter</text><rect x=\"60\" y=\"96\" width=\"600\" height=\"34\" rx=\"14\" fill=\"#e6dbff\" stroke=\"#52309c\" stroke-width=\"2.6\"/><text x=\"360\" y=\"120\" text-anchor=\"middle\" font-size=\"16\" font-weight=\"700\" fill=\"#52309c\" class=\"sb\">Copy the words from your list in joined letters</text><text x=\"360\" y=\"318\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#334155\" class=\"st\">Say each word in chunks as you write it</text></g></svg>",
        "alt": "Animated cartoon: a lined notebook page with rabbit, garden and kitten written on the lines, a pencil writing above it, a rabbit beside the page and cards showing rab-bit and the instruction to join every letter.",
        "caption": "Write the week''s words in joined letters, one chunk at a time."
      }
    }
  ],
  "worked_example": "I do: watch me tell the rabbit story. I plan it first. Beginning, a rabbit finds a carrot. Middle, another rabbit wants it. End, they share it. Then I tell it aloud. I stand up tall, look at my listeners, and begin slowly: Once there was a rabbit who found a carrot. For the second rabbit I use a higher voice, and I pause before the ending so my listeners lean in.\n\nWe do: you say the wolf line with me. I will begin in a big low voice, and you copy me: I will huff and I will puff. Now we swap. You be the mouse and I will be the wolf. Notice how the two voices tell the listener who is speaking.\n\nYou do: on your own, plan a three part story about an animal that loses something, then tell it aloud to your audience. Afterwards, write the name of your animal in joined letters and check that every letter sits on the baseline.",
  "worked_visuals": [
    {
      "svg": "<svg viewBox=\"0 0 720 330\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>@keyframes legA{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(26deg)}}@keyframes legB{0%,100%{transform:rotate(26deg)}50%{transform:rotate(-24deg)}}@keyframes armA{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-26deg)}}@keyframes armB{0%,100%{transform:rotate(-26deg)}50%{transform:rotate(22deg)}}@keyframes waveArm{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(-40deg)}}@keyframes wag{0%,100%{transform:rotate(-18deg)}50%{transform:rotate(18deg)}}@keyframes flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.4)}}@keyframes sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}@keyframes drift{0%{transform:translateX(-12px)}100%{transform:translateX(14px)}}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes bite{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.5)}}@keyframes rise{0%{transform:translateY(6px) scale(.6);opacity:0}18%{opacity:1}100%{transform:translateY(-54px) scale(1);opacity:0}}@keyframes fall{0%{transform:translateY(-14px);opacity:0}18%{opacity:1}100%{transform:translateY(26px);opacity:0}}@keyframes pop{0%{transform:scale(.5);opacity:0}55%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}@keyframes blink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}@keyframes ripple{0%,100%{transform:scaleX(1);opacity:.7}50%{transform:scaleX(1.2);opacity:1}}@keyframes float{0%{transform:translate(0,0)}50%{transform:translate(4px,-3px)}100%{transform:translate(-3px,2px)}}@keyframes jump{0%,100%{transform:translateY(0)}30%{transform:translateY(-14px)}}.w1a{animation:pop .5s ease-out both;animation-delay:.6s}.w1b{animation:pop .5s ease-out both;animation-delay:1.2s}.sb{font-family:Arial,sans-serif;font-weight:700}.st{font-family:Arial,sans-serif}@media (prefers-reduced-motion:reduce){.scn *{animation:none !important}animate{display:none}}</style><g class=\"scn\"><rect x=\"0\" y=\"0\" width=\"720\" height=\"330\" rx=\"20\" fill=\"#f8fafc\"/><rect x=\"30\" y=\"30\" width=\"660\" height=\"124\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><rect x=\"30\" y=\"178\" width=\"660\" height=\"124\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><path d=\"M80.0 76.0 H380.0\" stroke=\"#c7d2fe\" stroke-width=\"2\" stroke-dasharray=\"6 6\"/><path d=\"M80.0 96.0 H380.0\" stroke=\"#93c5fd\" stroke-width=\"2\" stroke-dasharray=\"6 6\"/><path d=\"M80.0 116.0 H380.0\" stroke=\"#64748b\" stroke-width=\"2.4\"/><path d=\"M96 83 C 92 59, 118 55, 122 75 C 124 85, 112 87, 110 79 C 108 71, 124 67, 138 69 C 146 71, 150 65, 152 57 C 156 49, 164 51, 164 63 L 164 87\" fill=\"none\" stroke=\"#1F3B2D\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M80.0 224.0 H380.0\" stroke=\"#c7d2fe\" stroke-width=\"2\" stroke-dasharray=\"6 6\"/><path d=\"M80.0 244.0 H380.0\" stroke=\"#93c5fd\" stroke-width=\"2\" stroke-dasharray=\"6 6\"/><path d=\"M80.0 264.0 H380.0\" stroke=\"#64748b\" stroke-width=\"2.4\"/><text x=\"96\" y=\"252\" text-anchor=\"start\" font-size=\"26\" font-weight=\"700\" fill=\"#374151\" class=\"sb\">a n</text><g class=\"w1a\"><path d=\"M636 74 l9 9 18-22\" fill=\"none\" stroke=\"#15803d\" stroke-width=\"5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></g><g class=\"w1b\"><path d=\"M636 224 l20 20 m0-20 l-20 20\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></g><text x=\"420\" y=\"86\" text-anchor=\"start\" font-size=\"16\" font-weight=\"700\" fill=\"#166534\" class=\"sb\">joined: one movement</text><text x=\"420\" y=\"236\" text-anchor=\"start\" font-size=\"16\" font-weight=\"700\" fill=\"#991b1b\" class=\"sb\">not joined: pencil lifts</text><text x=\"420\" y=\"112\" text-anchor=\"start\" font-size=\"14\" font-weight=\"700\" fill=\"#475569\" class=\"st\">every letter starts on the line</text><text x=\"420\" y=\"262\" text-anchor=\"start\" font-size=\"14\" font-weight=\"700\" fill=\"#475569\" class=\"st\">the pencil stops and starts</text></g></svg>",
      "alt": "Animated cartoon: two handwriting samples on guide lines, the top one showing a smoothly joined an with a green tick and the note that the letters were written in one movement, the bottom one showing a and n printed separately with a red cross and the note that the pencil lifted.",
      "caption": "Joined writing is one smooth movement. Printed letters are lifted between each letter."
    },
    {
      "svg": "<svg viewBox=\"0 0 720 330\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>@keyframes legA{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(26deg)}}@keyframes legB{0%,100%{transform:rotate(26deg)}50%{transform:rotate(-24deg)}}@keyframes armA{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-26deg)}}@keyframes armB{0%,100%{transform:rotate(-26deg)}50%{transform:rotate(22deg)}}@keyframes waveArm{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(-40deg)}}@keyframes wag{0%,100%{transform:rotate(-18deg)}50%{transform:rotate(18deg)}}@keyframes flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.4)}}@keyframes sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}@keyframes drift{0%{transform:translateX(-12px)}100%{transform:translateX(14px)}}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes bite{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.5)}}@keyframes rise{0%{transform:translateY(6px) scale(.6);opacity:0}18%{opacity:1}100%{transform:translateY(-54px) scale(1);opacity:0}}@keyframes fall{0%{transform:translateY(-14px);opacity:0}18%{opacity:1}100%{transform:translateY(26px);opacity:0}}@keyframes pop{0%{transform:scale(.5);opacity:0}55%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}@keyframes blink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}@keyframes ripple{0%,100%{transform:scaleX(1);opacity:.7}50%{transform:scaleX(1.2);opacity:1}}@keyframes float{0%{transform:translate(0,0)}50%{transform:translate(4px,-3px)}100%{transform:translate(-3px,2px)}}@keyframes jump{0%,100%{transform:translateY(0)}30%{transform:translateY(-14px)}}.w2klL{animation:legA 0.9s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.w2klR{animation:legB %ss ease-in-out infinite;transform-box:fill-box;transform-origin:50%% 0%%}.w2kbd{animation:bob 0.9s ease-in-out infinite}.w2khd{animation:bob 0.9s ease-in-out infinite}.w2key{animation:blink 4.2s linear infinite;transform-box:fill-box;transform-origin:50% 50%}.w2kaL{animation:armB 1.26s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.w2kaR{animation:waveArm 0.9s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%}.w2kbd{animation:bob 0.9s ease-in-out infinite}.w2b{animation:pop .5s ease-out both}.w2t0{animation:pop .5s ease-out both;animation-delay:0.4s}.w2t1{animation:pop .5s ease-out both;animation-delay:0.9s}.w2t2{animation:pop .5s ease-out both;animation-delay:1.4s}.sb{font-family:Arial,sans-serif;font-weight:700}@media (prefers-reduced-motion:reduce){.scn *{animation:none !important}animate{display:none}}</style><g class=\"scn\"><defs><linearGradient id=\"gl4w2\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#a9d8ff\"/><stop offset=\"0.62\" stop-color=\"#d8efff\"/><stop offset=\"1\" stop-color=\"#eef9ff\"/></linearGradient></defs><rect width=\"720\" height=\"330\" rx=\"20\" fill=\"url(#gl4w2)\"/><rect x=\"0\" y=\"262\" width=\"720\" height=\"68\" rx=\"0\" fill=\"#8fe38f\"/><ellipse cx=\"140.0\" cy=\"293.4\" rx=\"26.4\" ry=\"6.9\" fill=\"#000\" opacity=\"0.12\"/><g class=\"w2klL\"><path d=\"M132.5 260.1 L132.5 279.6\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"13.8\" stroke-linecap=\"round\"/><path d=\"M132.5 260.1 L132.5 279.6\" fill=\"none\" stroke=\"#2f6bcf\" stroke-width=\"10.3\" stroke-linecap=\"round\"/></g><g class=\"w2klR\"><path d=\"M147.5 260.1 L147.5 279.6\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"13.8\" stroke-linecap=\"round\"/><path d=\"M147.5 260.1 L147.5 279.6\" fill=\"none\" stroke=\"#2f6bcf\" stroke-width=\"10.3\" stroke-linecap=\"round\"/></g><rect x=\"125.0\" y=\"278.5\" width=\"19.5\" height=\"11.5\" rx=\"5.8\" fill=\"#334155\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><rect x=\"136.6\" y=\"278.5\" width=\"19.5\" height=\"11.5\" rx=\"5.8\" fill=\"#334155\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><path d=\"M123.9 260.1 L119.3 238.2 Q119.3 230.2 128.5 229.1 L151.5 229.1 Q160.7 230.2 160.7 238.2 L156.1 260.1 Z\" fill=\"#f59e0b\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><path d=\"M133.1 229.1 Q140.0 234.8 146.9 229.1\" fill=\"#f59e0b\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><g class=\"w2kaL\"><path d=\"M120.5 235.9 Q114.7 246.3 118.2 255.5\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"10.3\" stroke-linecap=\"round\"/><path d=\"M120.5 235.9 Q114.7 246.3 118.2 255.5\" fill=\"none\" stroke=\"#f6c9a0\" stroke-width=\"6.9\" stroke-linecap=\"round\"/></g><g class=\"w2kaR\"><path d=\"M159.6 235.9 Q171.1 225.6 169.9 209.5\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"10.3\" stroke-linecap=\"round\"/><path d=\"M159.6 235.9 Q171.1 225.6 169.9 209.5\" fill=\"none\" stroke=\"#f6c9a0\" stroke-width=\"6.9\" stroke-linecap=\"round\"/></g><circle cx=\"118.2\" cy=\"255.5\" r=\"3.9\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"161.8\" cy=\"255.5\" r=\"3.9\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><rect x=\"136.0\" y=\"223.3\" width=\"8.0\" height=\"8.0\" rx=\"3.4\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><circle cx=\"121.0\" cy=\"207.2\" r=\"4.8\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"159.0\" cy=\"207.2\" r=\"4.8\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><g class=\"w2khd\"><circle cx=\"140.0\" cy=\"207.2\" r=\"18.4\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><path d=\"M121.6 204.9 Q118.2 184.2 140.0 184.2 Q161.8 184.2 158.4 204.9 Q151.5 198.0 144.6 201.4 Q137.7 198.0 130.8 201.4 Q126.2 198.0 121.6 204.9 Z\" fill=\"#4a3222\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><g class=\"w2key\"><ellipse cx=\"133.8\" cy=\"207.2\" rx=\"4.1\" ry=\"4.9\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"133.3\" cy=\"207.8\" r=\"2.3\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"134.8\" cy=\"205.7\" r=\"1.0\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><ellipse cx=\"146.2\" cy=\"207.2\" rx=\"4.1\" ry=\"4.9\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"146.7\" cy=\"207.8\" r=\"2.3\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"145.2\" cy=\"205.7\" r=\"1.0\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/></g><path d=\"M130.8 198.0 q3.4 -2.5 6.9 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><path d=\"M142.3 198.0 q3.4 -2.5 6.9 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><ellipse cx=\"128.5\" cy=\"214.1\" rx=\"4.1\" ry=\"2.8\" fill=\"#f87171\" opacity=\"0.35\"/><ellipse cx=\"151.5\" cy=\"214.1\" rx=\"4.1\" ry=\"2.8\" fill=\"#f87171\" opacity=\"0.35\"/><path d=\"M134.8 216.4 q5.2 5.5 10.3 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><g class=\"w2b\"><rect x=\"230\" y=\"60\" width=\"420\" height=\"56\" rx=\"23.3\" fill=\"#ffffff\" stroke=\"#f59e0b\" stroke-width=\"2.6\"/><path d=\"M252.0 116.0 L246.0 132.0 L276.0 116.0 Z\" fill=\"#ffffff\" stroke=\"#f59e0b\" stroke-width=\"2.6\" stroke-linejoin=\"round\"/><text x=\"440.0\" y=\"93.8\" text-anchor=\"middle\" font-size=\"17\" font-family=\"Arial,sans-serif\" font-weight=\"700\" fill=\"#8a3d0f\">The rabbit shared the carrot</text></g><g class=\"w2t0\"><rect x=\"300\" y=\"140\" width=\"390\" height=\"46\" rx=\"12\" fill=\"#dbeafe\" stroke=\"#1e40af\" stroke-width=\"2.6\"/><path d=\"M318.0 163.0 l6 6 12-14\" fill=\"none\" stroke=\"#1e40af\" stroke-width=\"4\" stroke-linecap=\"round\"/><text x=\"350.0\" y=\"169.0\" font-size=\"16\" font-family=\"Arial,sans-serif\" font-weight=\"700\" fill=\"#1e40af\">Clear, slow voice</text></g><g class=\"w2t1\"><rect x=\"300\" y=\"198\" width=\"390\" height=\"46\" rx=\"12\" fill=\"#ffedd5\" stroke=\"#9a3412\" stroke-width=\"2.6\"/><path d=\"M318.0 221.0 l6 6 12-14\" fill=\"none\" stroke=\"#9a3412\" stroke-width=\"4\" stroke-linecap=\"round\"/><text x=\"350.0\" y=\"227.0\" font-size=\"16\" font-family=\"Arial,sans-serif\" font-weight=\"700\" fill=\"#9a3412\">Pause at each full stop</text></g><g class=\"w2t2\"><rect x=\"300\" y=\"256\" width=\"390\" height=\"46\" rx=\"12\" fill=\"#dcfce7\" stroke=\"#166534\" stroke-width=\"2.6\"/><path d=\"M318.0 279.0 l6 6 12-14\" fill=\"none\" stroke=\"#166534\" stroke-width=\"4\" stroke-linecap=\"round\"/><text x=\"350.0\" y=\"285.0\" font-size=\"16\" font-family=\"Arial,sans-serif\" font-weight=\"700\" fill=\"#166534\">A voice for each character</text></g></g></svg>",
      "alt": "Animated cartoon: a boy tells a story with a speech bubble saying the rabbit shared the carrot, beside three ticked checklist cards reading clear slow voice, pause at each full stop, and a voice for each character.",
      "caption": "The four point checklist a storyteller runs through before telling a story."
    }
  ],
  "guided_practice": "Part A: Read it aloud three ways. Say this sentence out loud: The dragon crept closer.\n1. Say it in a flat voice. 2. Say it slowly and quietly. 3. Say it as a warning. Which one sounds most like a dragon? Write which and why.\nHint: expression means saying the words in a way that matches the story.\nAnswer: the slow, quiet version sounds like a creeping dragon, because pace and volume match the action.\n\nPart B: Plan a story. Write three or four words for each part of your own story.\n1. Beginning (who and where). 2. Middle (the problem or surprise). 3. End (how it finished).\nHint: keep each part to a few words only. The plan is not the story.\nAnswer: any three part plan. For example beginning, a boy at the beach. Middle, his ball rolls into the water. End, a big wave brings it back.\n\nPart C: Joined handwriting. Write each join three times on the lines.\n1. an  2. in  3. ck  4. ou\nHint: start on the solid line and do not lift the pencil until the pair is finished.\nAnswer: each pair written as one joined movement, letters sitting on the baseline.\n\nPart D: Spelling blanks in joined letters. Write each word correctly, joining the letters.\n1. ra __ it  2. kit __ en  3. can __ le  4. child __ en  5. ele __ hant\nHint: say the word in chunks as you join the letters.\nAnswer: rabbit, kitten, candle, children, elephant.",
  "independent_task": "Work from the easiest part to the hardest. Some parts are spoken and some are written in your book.\n\nPart 1: Tell your three part story aloud to your audience. Use a slow, clear voice and look at your listeners.\n\nPart 2: Write your story plan in your book as three headings.\n1. Beginning  2. Middle  3. End\n\nPart 3: Choose two characters from your story and write one line each of what they say. Beside each line, write big voice or small voice.\n\nPart 4: Joined handwriting practice. Write these joins twice each on the lines in your book.\n4. an  5. in  6. ck  7. ou\n\nPart 5: Copy this sentence in joined letters, keeping every letter on the baseline.\n8. The rabbit found a carrot in the garden.\n\nPart 6: On paper, write this week''s words in joined letters and draw a line under any letter you found hard to join.\n9. rabbit  10. garden  11. kitten  12. thunder  13. children\n\nPart 7: Spelling sentences. Write one sentence for each word, in joined letters where you can.\n14. candle  15. elephant\n\nResponse prompt: which was easier for you, telling the story aloud or writing it in joined letters, and what will you practise next?",
  "response_prompt": "Which was easier for you, telling the story aloud or writing it in joined letters, and what will you practise next?",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "What is an audience?",
      "options": [
        "The people you are telling your story to",
        "The end of a story",
        "A type of pencil",
        "The title of a story"
      ],
      "correct_index": 0,
      "explanation": "Your audience is the people listening to you."
    },
    {
      "type": "multiple_choice",
      "question": "How should you speak when you tell a story to a group?",
      "options": [
        "Very quietly",
        "As fast as you can",
        "In a whisper",
        "Clearly and slowly"
      ],
      "correct_index": 3,
      "explanation": "Clear, slow speech is easiest for listeners to follow."
    },
    {
      "type": "multiple_choice",
      "question": "Where should you look while you tell a story?",
      "options": [
        "At your feet",
        "Out of the window",
        "At your listeners",
        "At the ceiling"
      ],
      "correct_index": 2,
      "explanation": "Looking at your listeners keeps them with you and shows how the story is going."
    },
    {
      "type": "multiple_choice",
      "question": "Which are the three parts of a story?",
      "options": [
        "Title, page, picture",
        "Beginning, middle, end",
        "Who, what, why",
        "Start, stop, finish"
      ],
      "correct_index": 1,
      "explanation": "Every story has a beginning, a middle and an end."
    },
    {
      "type": "multiple_choice",
      "question": "How do you make a character sound like a wolf?",
      "options": [
        "Whisper every word",
        "Speak with no expression",
        "Read very fast",
        "Use a big low voice"
      ],
      "correct_index": 3,
      "explanation": "Changing pitch and volume tells listeners who is speaking."
    },
    {
      "type": "multiple_choice",
      "question": "What does expression mean when you tell a story?",
      "options": [
        "Saying every word the same",
        "Speaking in a different language",
        "Saying the words in a way that matches the story",
        "Using longer words"
      ],
      "correct_index": 2,
      "explanation": "Expression is how you say the words, so they match what is happening."
    },
    {
      "type": "multiple_choice",
      "question": "When you read a question aloud, your voice should…",
      "options": [
        "Rise at the end",
        "Drop flat",
        "Stop in the middle",
        "Get very loud"
      ],
      "correct_index": 0,
      "explanation": "A question lifts at the end."
    },
    {
      "type": "multiple_choice",
      "question": "Where should each joined letter start?",
      "options": [
        "In the air",
        "On the baseline",
        "At the top of the page",
        "On the dotted line"
      ],
      "correct_index": 1,
      "explanation": "Each letter starts on the baseline so the word stays straight."
    },
    {
      "type": "multiple_choice",
      "question": "What does legible mean?",
      "options": [
        "Very fast to write",
        "Easy for a reader to read",
        "Written in capitals",
        "Written in pencil"
      ],
      "correct_index": 1,
      "explanation": "Legible writing is clear enough for someone else to read easily."
    },
    {
      "type": "multiple_choice",
      "question": "Which join is written as one movement without lifting the pencil?",
      "options": [
        "a then n printed separately",
        "a n with a space",
        "an joined together",
        "A N in capitals"
      ],
      "correct_index": 2,
      "explanation": "Joined writing keeps the pencil moving, so an is written without lifting."
    }
  ],
  "word_challenges": [
    {
      "type": "multiple_choice",
      "question": "What is a storyteller?",
      "options": [
        "A person who tells a story aloud",
        "A kind of book",
        "A story about a person",
        "A type of pencil"
      ],
      "correct_index": 0,
      "explanation": "A storyteller tells the story out loud to an audience."
    },
    {
      "type": "multiple_choice",
      "question": "What does pace mean when you speak?",
      "options": [
        "How fast or slow you speak",
        "How tall you stand",
        "How loud the room is",
        "How long the story is"
      ],
      "correct_index": 0,
      "explanation": "Pace is the speed of your speaking. Slower is usually easier to follow."
    },
    {
      "type": "multiple_choice",
      "question": "What does legible mean?",
      "options": [
        "Clear enough to read easily",
        "Written very quickly",
        "Written in the dark",
        "Very small"
      ],
      "correct_index": 0,
      "explanation": "Legible handwriting can be read easily by someone else."
    },
    {
      "type": "multiple_choice",
      "question": "What does joined handwriting mean?",
      "options": [
        "The letters in a word are connected",
        "Every letter is a capital",
        "The words are written in the air",
        "The letters are all the same letter"
      ],
      "correct_index": 0,
      "explanation": "In joined handwriting the pencil keeps moving and the letters connect."
    },
    {
      "type": "multiple_choice",
      "question": "Which word is spelt correctly?",
      "options": [
        "rabbit",
        "rabit",
        "rabbitt",
        "rabitt"
      ],
      "correct_index": 0,
      "explanation": "Rabbit has two b letters in the middle."
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
      "explanation": "Kitten has two t letters in the middle."
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
      "explanation": "Thunder is spelt t h u n d e r."
    },
    {
      "type": "multiple_choice",
      "question": "Which word is spelt correctly?",
      "options": [
        "children",
        "chilren",
        "childern",
        "childen"
      ],
      "correct_index": 0,
      "explanation": "Children is spelt c h i l d r e n."
    }
  ],
  "sort_activity": {
    "instructions": "Read each job, then sort it into telling a story aloud or joined handwriting.",
    "buckets": [
      "Telling aloud",
      "Joined handwriting"
    ],
    "items": [
      {
        "text": "Pause at each full stop",
        "answer": 0
      },
      {
        "text": "Start each letter on the baseline",
        "answer": 1
      },
      {
        "text": "Look at your listeners",
        "answer": 0
      },
      {
        "text": "Keep the pencil moving between letters",
        "answer": 1
      },
      {
        "text": "Change your voice for each character",
        "answer": 0
      },
      {
        "text": "Keep every letter the same height",
        "answer": 1
      },
      {
        "text": "Slow down for the exciting part",
        "answer": 0
      },
      {
        "text": "Make sure the word is legible",
        "answer": 1
      }
    ]
  },
  "interactive_activities": [
    {
      "type": "flip_cards",
      "title": "Storyteller words to know",
      "cards": [
        {
          "front": "storyteller",
          "back": "a person who tells a story aloud to an audience"
        },
        {
          "front": "audience",
          "back": "the people listening to your story"
        },
        {
          "front": "expression",
          "back": "saying the words in a way that matches what is happening"
        },
        {
          "front": "pace",
          "back": "how fast or how slowly you speak"
        },
        {
          "front": "join",
          "back": "connect the letters of a word so the pencil keeps moving"
        },
        {
          "front": "baseline",
          "back": "the solid line your letters sit on"
        },
        {
          "front": "legible",
          "back": "clear enough for someone else to read easily"
        },
        {
          "front": "narrator",
          "back": "the voice that tells the story, which is you"
        }
      ]
    }
  ],
  "spelling": {
    "focus": "Sounds and syllables",
    "teaching": "We are practising this week''s words again, and this time we will write them in joined letters.\n\nSay the word, clap the beats, then write the chunks joined together without lifting the pencil.\n\nKeep every letter sitting on the baseline. Tall letters like b, d and l go up to the same height, and letters like g and p go below the line.\n\nSpell each word correctly ten times in a row, and make the joined writing legible, which means someone else can read it easily.",
    "words": [
      {
        "word": "rabbit",
        "parts": "rab - bit",
        "tip": "two b letters in the middle, like a rabbit''s two ears"
      },
      {
        "word": "garden",
        "parts": "gar - den",
        "tip": "ends with den, and the d joins straight into the e"
      },
      {
        "word": "kitten",
        "parts": "kit - ten",
        "tip": "two t letters in the middle, joined across the top"
      },
      {
        "word": "table",
        "parts": "ta - ble",
        "tip": "ends with the -le pattern that says ull"
      },
      {
        "word": "candle",
        "parts": "can - dle",
        "tip": "keep the d with the -le ending, one smooth movement"
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
        "question": "Which join is written without lifting the pencil?",
        "options": [
          "a n",
          "an",
          "a-n",
          "AN"
        ],
        "correct_index": 1,
        "explanation": "Joined writing keeps the pencil moving, so an is one movement."
      },
      {
        "type": "multiple_choice",
        "question": "Where does each letter sit?",
        "options": [
          "On the baseline",
          "In the middle of the page",
          "At the top of the page",
          "Below the margin"
        ],
        "correct_index": 0,
        "explanation": "Letters sit on the solid baseline."
      },
      {
        "type": "multiple_choice",
        "question": "Which word is spelt correctly?",
        "options": [
          "children",
          "chilren",
          "childern"
        ],
        "correct_index": 0,
        "explanation": "Children is spelt c h i l d r e n."
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
  "parent_notes": "Rationale: this lesson pairs the two halves of the week''s outcomes that the rest of the week does not reach, speaking to an audience and joined handwriting. Both are performance skills, so the lesson is built around doing rather than reading: the child plans a story, tells it aloud, then practises the joins and writes the week''s words in joined letters.\n\nAssessment notes: for the spoken parts you are listening for a clear, slow voice, eyes on the audience, a voice for at least two characters, and a pause at the full stops. Accept any voice the child chooses for a character as long as they can tell you who it is. For the handwriting parts, look for letters sitting on the baseline, even height, and joins that are not cut in the middle. Legibility matters more than speed, so a slow neat line is a better result than a fast untidy one. The quiz has ten questions and a score of nine or more shows both skills have landed. If the joins are still shaky, spend another five minutes on just an, in, ck and ou before attempting whole words.",
  "explicit_teaching": "**The big idea.** Telling a story aloud and writing it clearly are two halves of the same skill: making a listener or reader understand you. This lesson takes the narrative planning the child did earlier in the week and turns it into a spoken performance, then moves to joined handwriting so the written version of the week''s words is fast and easy to read. Both parts are assessed by you, the audience, which is exactly how a child improves at them.\n\n**How to open the lesson.** Start by asking your child to tell you one thing that happened today, then ask them to tell it again looking at your face the whole time. Do not explain anything yet. The second telling is usually better, and your child will have felt the difference for themselves. Only then introduce the words audience, pace and expression.\n\n**Voice and pace.** The biggest problem with a child telling a story aloud is speed. Ask for a slow telling and then model the difference, saying the same first line fast and then slowly. Prompt with the two dials: how loud, and how slow. If your child rushes, ask them to tell the story to a favourite toy first, because an audience of one is less frightening than a family and the practice carries over.\n\n**Facing the audience.** Eyes on the listeners is a habit, not a rule to recite. Practise it by having your child hold your gaze for the first sentence only, then let them look anywhere they like for the rest. Add one more sentence of eye contact each time. If they read from a page, show them how to look up at the end of each sentence, which is where the punctuation gives them a natural pause.\n\n**Characters and expression.** Two changes are enough for a character to be recognisable: pitch and volume. The wolf gets a big low voice and the mouse gets a tiny high voice. Then add expression, which means matching the sound of the sentence to its meaning. Pause at every full stop long enough to count to one, lift the voice at a question mark, and slow right down for the exciting part. Point out that a flat voice loses an audience even when the story itself is good.\n\n**Telling in your own words.** Discourage memorising. Ask your child to remember the three parts and then tell the story in their own words, adding one new detail each time they retell it. If they get stuck, ask what happened next rather than supplying the sentence. This keeps the story alive and removes the fear of forgetting a memorised line.\n\n**Joined handwriting and the four joins.** The joins in this lesson are an, in, ck and ou. Every letter starts on the solid baseline and ends with a small exit stroke that flows into the next letter, so the pencil does not lift until the word is finished. Watch for letters that shrink or grow, and for a word that lifts between every letter, which turns joined writing back into printing. Keep sessions short. Five careful minutes of joins beats twenty tired minutes of copying.\n\n**Why joined writing is worth the effort.** Joined handwriting is faster than printing because the pencil stays on the page, and speed matters as children begin to write longer pieces. It also helps spelling, because the hand learns the shape of a whole word rather than a line of separate letters. Keep the letters even, sitting on the baseline, and legible, which means a reader can read the word first time. A neat joined line that takes a little longer is worth far more than a rushed one nobody can read.\n\n**Putting it together and pacing the lesson.** Two sittings work well. In the first sitting do steps one to six, the planning and the spoken work, and finish by telling the story to an audience. In the second sitting do steps seven and eight, the joins and the week''s words in joined letters, then the guided practice, the main task and the quiz. If you have only fifteen minutes, tell the story aloud and practise two joins.\n\n**Working with a reluctant storyteller.** Some children find an audience frightening. Start with an audience of one, a favourite toy or a soft toy, and let the child tell the story sitting down. Once the words flow, add a second listener, then ask them to stand. Make the first telling short, because three sentences is a complete story for this purpose. Praise one specific detail, such as the voice they used for the second rabbit, so they know exactly what to repeat.\n\n**How to know it has worked.** The clearest sign is a child who plans three parts before telling, keeps their eyes on the audience, and pauses at the full stops without being reminded. In handwriting, the sign is a word written in one flow with the letters sitting evenly on the line and a reader able to read it first time. Both are habits, so revisit them in later weeks: ask for a story told aloud when a new book is finished, and keep the join practice going in short daily bursts rather than one long session.\n\nfull stop out loud. If they cannot keep a character voice, let them copy yours. If their joins collapse, go back to the single joins an, in, ck and ou, writing them large before returning to whole words. Legibility is the goal, not speed, so celebrate a slow neat line and remind them that a reader has to be able to enjoy what they wrote.",
  "evidence_instructions": "Record the story telling on a phone if you can, which makes the improvement between tellings easy to hear. Keep the story plan, the join practice and the joined copy of the week''s words.",
  "offline_alternative": "Everything in this lesson works without a device. The videos are optional. Use the printed pages or write the parts out by hand, and be the audience yourself.",
  "extension": "Tell your story a second time to a different audience and add one new detail to each part. Then write your favourite sentence from the story in your best joined handwriting.",
  "planner_title": "Plan your story",
  "planner_intro": "Plan your story in three parts, then tell it aloud before you write anything else.",
  "planner_fields": [
    {
      "key": "begin",
      "label": "Beginning",
      "hint": "who is in the story and where are they"
    },
    {
      "key": "middle",
      "label": "Middle",
      "hint": "what goes wrong or what is surprising"
    },
    {
      "key": "end",
      "label": "End",
      "hint": "how it finishes and how the characters feel"
    }
  ],
  "glossary": [
    [
      "storyteller",
      "a person who tells a story aloud"
    ],
    [
      "audience",
      "the people listening"
    ],
    [
      "pace",
      "how fast or slowly you speak"
    ],
    [
      "expression",
      "saying words in a way that matches the story"
    ],
    [
      "narrator",
      "the voice telling the story"
    ],
    [
      "join",
      "connect letters so the pencil keeps moving"
    ],
    [
      "baseline",
      "the solid line the letters sit on"
    ],
    [
      "legible",
      "clear enough to read easily"
    ]
  ],
  "common_mistakes": [
    [
      "Racing to the end of the story",
      "Slow right down and count the pause at each full stop."
    ],
    [
      "Speaking to the floor",
      "Practise eye contact for one sentence, then add one more each time."
    ],
    [
      "The same flat voice for every character",
      "Change pitch and volume, big and low for a wolf, small and high for a mouse."
    ],
    [
      "Lifting the pencil between letters",
      "Write the join pairs an, in, ck and ou as single movements."
    ],
    [
      "Letters that shrink or float off the line",
      "Start every letter on the baseline and keep the height even."
    ]
  ],
  "answer_key": "Guided practice: Part A the slow, quiet version sounds most like a dragon because pace and volume match the action. Part B accept any three part plan with a who and where, a problem or surprise, and an ending. Part C the joins an, in, ck and ou written as single movements, letters on the baseline. Part D rabbit, kitten, candle, children, elephant.\n\nIndependent task: Part 3 accept any character lines as long as the voice label matches. Part 5 the sentence copied in joined letters with every letter on the baseline. Part 6 the week''s words in joined letters. Part 7 sentences must spell candle and elephant correctly.\n\nQuiz answers: 1A, 2D, 3C, 4B, 5D, 6C, 7A, 8D, 9B, 10C.",
  "parent_check": "Listen for a clear slow voice and eyes on the audience during the telling. Check the handwriting for letters on the baseline, even height and joins that are not cut. Mark the quiz out of ten; nine or more means both skills are secure.",
  "self_check": "By the end of this lesson you should have planned a story with a beginning, a middle and an end, told it aloud to an audience with a voice for each character, joined these letters an in ck ou, and written this week''s words in legible joined handwriting.",
  "resources": [
    {
      "type": "video",
      "title": "How to develop storytelling skills (Oxford Owl)",
      "embed_url": "https://www.youtube.com/embed/F8k93ylkBPA",
      "prompt": "Watch this before you tell your story. Notice one tip you will try.",
      "check": {
        "type": "multiple_choice",
        "question": "What does the video suggest you do to become a better storyteller?",
        "options": [
          "Practise telling stories out loud",
          "Only ever read stories silently",
          "Memorise every word",
          "Tell stories only once"
        ],
        "correct_index": 0,
        "explanation": "Telling stories out loud again and again is how storytelling improves."
      }
    },
    {
      "type": "video",
      "title": "Joined up handwriting: the letter a (Mr Hicks UK)",
      "embed_url": "https://www.youtube.com/embed/bk8vgQXO82Y",
      "prompt": "Watch how the letter starts on the line and joins to the next letter. A grown-up may want to check the letter shapes against what your school teaches.",
      "check": {
        "type": "multiple_choice",
        "question": "Where does the letter in the video start?",
        "options": [
          "On the baseline",
          "At the top of the page",
          "In the air",
          "On the margin"
        ],
        "correct_index": 0,
        "explanation": "Joined letters start on the baseline before flowing into the next letter."
      }
    }
  ]
}'),
    title = 'Year 3, Week 1, Lesson 4: Storytelling aloud and joined handwriting'
WHERE seed_key = 's2-eng-y3-w01-l4';
