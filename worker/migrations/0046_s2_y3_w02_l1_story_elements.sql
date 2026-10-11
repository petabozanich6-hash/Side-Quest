-- Year 3, Week 2, Lesson 1: Story elements: character, setting and plot
--
-- Replaces the coming-soon placeholder row for seed_key 's2-eng-y3-w02-l1' with a
-- full lesson. The placeholder metadata (unit, week, role, subject) is preserved
-- and coming_soon is set to null so the card stops showing as planned.
--
-- Outcomes: EN2-RECOM-01 and EN2-UARL-01, wording taken from the NSW English
-- K-10 Syllabus (2022) outcomes page:
--   EN2-RECOM-01 reads and comprehends texts for wide purposes using knowledge of
--     text structures and language, and by monitoring comprehension
--   EN2-UARL-01 identifies and describes how ideas are represented in literature
--     and strategically uses similar representations when creating texts
--
-- Ten inline SVG visuals are drawn in the lesson data itself and stop animating
-- under prefers-reduced-motion.
--
-- The two videos are real YouTube ids found for this lesson (Swick's Classroom
-- m3WHmmYTHeE, Scratch Garden NpWHZJZQDSE). They have NOT been watched or checked
-- for embedding.

UPDATE lessons
SET data = json_patch(data, '{
  "year_level": "Year 3",
  "subject": "English",
  "unit_title": "Narrative: story elements and planning",
  "unit_number": 1,
  "week": 2,
  "week_in_unit": 2,
  "lesson_number": 1,
  "lesson_role": "Reading",
  "spelling_focus": "Vowel teams: ai, ay, ee, ea, oa",
  "outcome_codes": [
    "EN2-RECOM-01",
    "EN2-UARL-01"
  ],
  "outcome_notes": {
    "EN2-RECOM-01": "reads and comprehends texts for wide purposes using knowledge of text structures and language, and by monitoring comprehension",
    "EN2-UARL-01": "identifies and describes how ideas are represented in literature and strategically uses similar representations when creating texts"
  },
  "learning_intention": "We are learning to find the characters, the setting and the plot in a story so we can understand and retell it.",
  "success_criteria": [
    "I can name the characters in a story.",
    "I can describe the setting, including where and when.",
    "I can explain the plot in the order it happens.",
    "I can find the elements as I read.",
    "I can tell the difference between a trait and a feeling.",
    "I can fill in a story map and retell a story from it."
  ],
  "child_mission": "Become a Story Detective. Read a story and hunt for the three elements, who it is about, where it happens and what happens, then retell it from your story map.",
  "duration_minutes": 45,
  "materials": "This lesson (everything you need is inside it), plus a short story or picture book you are reading this week, chosen by your grown-up. A pencil and your book for the written parts.",
  "prior_knowledge": "Year 2 retelling of simple stories, and the idea that a story has a beginning, a middle and an end.",
  "key_vocabulary": [
    "character",
    "setting",
    "plot",
    "trait",
    "feeling",
    "element"
  ],
  "teach_steps": [
    {
      "icon": "📖",
      "title": "The three story elements",
      "explain": "Stories are built from three parts, and readers who know them understand a story much more easily. The parts are the characters, the setting and the plot.\n\nThe characters are the people or animals the story is about. The setting is where and when the story happens. The plot is what happens, in the order it happens. Every story you read this year will have all three.\n\nOnce you can name the three elements, you can retell a story without missing anything important. Start with who, then where, then what happened.",
      "example": "In the story of the rabbit and the carrot, the characters are the two rabbits, the setting is a vegetable garden, and the plot is that one rabbit found a carrot and shared it.",
      "notice": "A common mistake is to call the plot the characters. Ask who it is about, and that answer gives you the characters.",
      "check": {
        "type": "multiple_choice",
        "question": "Which of these is a story element?",
        "options": [
          "The page number",
          "The setting",
          "The title font",
          "The book cover"
        ],
        "correct_index": 1,
        "explanation": "Characters, setting and plot are the three story elements."
      },
      "visual": {
        "svg": "<svg viewBox=\"0 0 720 330\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>@keyframes legA{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(26deg)}}@keyframes legB{0%,100%{transform:rotate(26deg)}50%{transform:rotate(-24deg)}}@keyframes armA{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-26deg)}}@keyframes armB{0%,100%{transform:rotate(-26deg)}50%{transform:rotate(22deg)}}@keyframes waveArm{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(-40deg)}}@keyframes wag{0%,100%{transform:rotate(-18deg)}50%{transform:rotate(18deg)}}@keyframes flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.4)}}@keyframes sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}@keyframes drift{0%{transform:translateX(-12px)}100%{transform:translateX(14px)}}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes bite{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.5)}}@keyframes rise{0%{transform:translateY(6px) scale(.6);opacity:0}18%{opacity:1}100%{transform:translateY(-54px) scale(1);opacity:0}}@keyframes fall{0%{transform:translateY(-14px);opacity:0}18%{opacity:1}100%{transform:translateY(26px);opacity:0}}@keyframes pop{0%{transform:scale(.5);opacity:0}55%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}@keyframes blink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}@keyframes ripple{0%,100%{transform:scaleX(1);opacity:.7}50%{transform:scaleX(1.2);opacity:1}}@keyframes float{0%{transform:translate(0,0)}50%{transform:translate(4px,-3px)}100%{transform:translate(-3px,2px)}}@keyframes jump{0%,100%{transform:translateY(0)}30%{transform:translateY(-14px)}}.a1c0{animation:pop .5s ease-out both;animation-delay:0.3s}.a1klL{animation:legA 0.9s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a1klR{animation:legB %ss ease-in-out infinite;transform-box:fill-box;transform-origin:50%% 0%%}.a1kbd{animation:bob 0.9s ease-in-out infinite}.a1khd{animation:bob 0.9s ease-in-out infinite}.a1key{animation:blink 4.2s linear infinite;transform-box:fill-box;transform-origin:50% 50%}.a1kaL{animation:armB 1.26s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a1kaR{animation:waveArm 0.9s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%}.a1kbd{animation:bob 0.9s ease-in-out infinite}.a1c1{animation:pop .5s ease-out both;animation-delay:0.7s}.a1t{animation:sway 3.0s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}.a1c2{animation:pop .5s ease-out both;animation-delay:1.1s}.sb{font-family:Arial,sans-serif;font-weight:700}@media (prefers-reduced-motion:reduce){.scn *{animation:none !important}animate{display:none}}</style><g class=\"scn\"><rect x=\"0\" y=\"0\" width=\"720\" height=\"330\" rx=\"20\" fill=\"#f4f8ff\"/><rect x=\"40\" y=\"26\" width=\"640\" height=\"44\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"360\" y=\"55\" text-anchor=\"middle\" font-size=\"18\" font-weight=\"700\" fill=\"#1f2937\" class=\"sb\">Every story has characters, a setting and a plot</text><g class=\"a1c0\"><rect x=\"30\" y=\"86\" width=\"210\" height=\"166\" rx=\"14\" fill=\"#dbeafe\" stroke=\"#1e40af\" stroke-width=\"2.6\"/><ellipse cx=\"135.0\" cy=\"205.7\" rx=\"20.7\" ry=\"5.4\" fill=\"#000\" opacity=\"0.12\"/><g class=\"a1klL\"><path d=\"M129.2 179.6 L129.2 194.9\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"11.5\" stroke-linecap=\"round\"/><path d=\"M129.2 179.6 L129.2 194.9\" fill=\"none\" stroke=\"#2f6bcf\" stroke-width=\"8.1\" stroke-linecap=\"round\"/></g><g class=\"a1klR\"><path d=\"M140.8 179.6 L140.8 194.9\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"11.5\" stroke-linecap=\"round\"/><path d=\"M140.8 179.6 L140.8 194.9\" fill=\"none\" stroke=\"#2f6bcf\" stroke-width=\"8.1\" stroke-linecap=\"round\"/></g><rect x=\"123.3\" y=\"194.0\" width=\"15.3\" height=\"9.0\" rx=\"4.5\" fill=\"#334155\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><rect x=\"132.3\" y=\"194.0\" width=\"15.3\" height=\"9.0\" rx=\"4.5\" fill=\"#334155\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><path d=\"M122.4 179.6 L118.8 162.5 Q118.8 156.2 126.0 155.3 L144.0 155.3 Q151.2 156.2 151.2 162.5 L147.6 179.6 Z\" fill=\"#ef5350\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><path d=\"M129.6 155.3 Q135.0 159.8 140.4 155.3\" fill=\"#ef5350\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><g class=\"a1kaL\"><path d=\"M119.7 160.7 Q115.2 168.8 117.9 176.0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"8.8\" stroke-linecap=\"round\"/><path d=\"M119.7 160.7 Q115.2 168.8 117.9 176.0\" fill=\"none\" stroke=\"#f6c9a0\" stroke-width=\"5.4\" stroke-linecap=\"round\"/></g><g class=\"a1kaR\"><path d=\"M150.3 160.7 Q159.3 152.6 158.4 140.0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"8.8\" stroke-linecap=\"round\"/><path d=\"M150.3 160.7 Q159.3 152.6 158.4 140.0\" fill=\"none\" stroke=\"#f6c9a0\" stroke-width=\"5.4\" stroke-linecap=\"round\"/></g><circle cx=\"117.9\" cy=\"176.0\" r=\"3.1\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"152.1\" cy=\"176.0\" r=\"3.1\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><rect x=\"131.8\" y=\"150.8\" width=\"6.3\" height=\"6.3\" rx=\"2.7\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><circle cx=\"120.2\" cy=\"138.2\" r=\"3.8\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"149.8\" cy=\"138.2\" r=\"3.8\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><g class=\"a1khd\"><circle cx=\"135.0\" cy=\"138.2\" r=\"14.4\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><path d=\"M120.6 136.4 Q117.9 120.2 135.0 120.2 Q152.1 120.2 149.4 136.4 Q144.0 131.0 138.6 133.7 Q133.2 131.0 127.8 133.7 Q124.2 131.0 120.6 136.4 Z\" fill=\"#4a3222\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><g class=\"a1key\"><ellipse cx=\"130.1\" cy=\"138.2\" rx=\"3.2\" ry=\"3.9\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"129.8\" cy=\"138.6\" r=\"1.8\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"130.9\" cy=\"137.0\" r=\"0.8\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><ellipse cx=\"139.9\" cy=\"138.2\" rx=\"3.2\" ry=\"3.9\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"140.2\" cy=\"138.6\" r=\"1.8\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"139.1\" cy=\"137.0\" r=\"0.8\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/></g><path d=\"M127.8 131.0 q2.7 -2.0 5.4 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><path d=\"M136.8 131.0 q2.7 -2.0 5.4 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><ellipse cx=\"126.0\" cy=\"143.6\" rx=\"3.2\" ry=\"2.2\" fill=\"#f87171\" opacity=\"0.35\"/><ellipse cx=\"144.0\" cy=\"143.6\" rx=\"3.2\" ry=\"2.2\" fill=\"#f87171\" opacity=\"0.35\"/><path d=\"M130.9 145.4 q4.0 4.3 8.1 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><text x=\"135\" y=\"238\" text-anchor=\"middle\" font-size=\"17\" font-family=\"Arial,sans-serif\" font-weight=\"700\" fill=\"#1e40af\">Characters</text></g><g class=\"a1c1\"><rect x=\"260\" y=\"86\" width=\"210\" height=\"166\" rx=\"14\" fill=\"#dcfce7\" stroke=\"#166534\" stroke-width=\"2.6\"/><rect x=\"308.9\" y=\"181.9\" width=\"42.2\" height=\"21.1\" rx=\"1.9\" fill=\"#f8e3bd\" stroke=\"#b07d46\" stroke-width=\"2.4\"/><path d=\"M304.0 183.2 L330.0 164.6 L356.0 183.2 Z\" fill=\"#c94f4f\" stroke=\"#a13c3c\" stroke-width=\"2.4\" stroke-linejoin=\"round\"/><rect x=\"313.9\" y=\"189.4\" width=\"9.9\" height=\"13.6\" rx=\"1.2\" fill=\"#8b5a2b\"/><rect x=\"333.7\" y=\"186.9\" width=\"9.9\" height=\"8.7\" rx=\"1.2\" fill=\"#bfe3ff\" stroke=\"#8b5a2b\" stroke-width=\"2\"/><g class=\"a1t\"><path d=\"M420.0 204.0 L420.0 185.0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"8.9\" stroke-linecap=\"round\"/><path d=\"M420.0 204.0 L420.0 185.0\" fill=\"none\" stroke=\"#8a5a33\" stroke-width=\"5.5\" stroke-linecap=\"round\"/><path d=\"M420.0 192.0 Q415.5 187.0 412.5 182.0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"6.4\" stroke-linecap=\"round\"/><path d=\"M420.0 192.0 Q415.5 187.0 412.5 182.0\" fill=\"none\" stroke=\"#8a5a33\" stroke-width=\"3.0\" stroke-linecap=\"round\"/><path d=\"M420.0 190.0 Q424.5 185.0 428.0 180.0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"6.4\" stroke-linecap=\"round\"/><path d=\"M420.0 190.0 Q424.5 185.0 428.0 180.0\" fill=\"none\" stroke=\"#8a5a33\" stroke-width=\"3.0\" stroke-linecap=\"round\"/><circle cx=\"420.0\" cy=\"175.0\" r=\"12.0\" fill=\"#3fae52\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><circle cx=\"410.5\" cy=\"180.0\" r=\"8.5\" fill=\"#4cc061\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><circle cx=\"429.5\" cy=\"180.0\" r=\"8.5\" fill=\"#4cc061\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><circle cx=\"420.0\" cy=\"167.0\" r=\"8.0\" fill=\"#4cc061\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><circle cx=\"416.5\" cy=\"169.0\" r=\"3.0\" fill=\"#7fd98a\" stroke=\"#2b2521\" stroke-width=\"0.0\"/></g><text x=\"365\" y=\"238\" text-anchor=\"middle\" font-size=\"17\" font-family=\"Arial,sans-serif\" font-weight=\"700\" fill=\"#166534\">Setting</text></g><g class=\"a1c2\"><rect x=\"490\" y=\"86\" width=\"210\" height=\"166\" rx=\"14\" fill=\"#ffedd5\" stroke=\"#9a3412\" stroke-width=\"2.6\"/><rect x=\"512\" y=\"120\" width=\"50\" height=\"46\" rx=\"14\" fill=\"#ffffff\" stroke=\"#9a3412\" stroke-width=\"2.2\"/><text x=\"537\" y=\"150\" text-anchor=\"middle\" font-size=\"20\" font-weight=\"700\" fill=\"#9a3412\" class=\"sb\">1</text><rect x=\"570\" y=\"120\" width=\"50\" height=\"46\" rx=\"14\" fill=\"#ffffff\" stroke=\"#9a3412\" stroke-width=\"2.2\"/><text x=\"595\" y=\"150\" text-anchor=\"middle\" font-size=\"20\" font-weight=\"700\" fill=\"#9a3412\" class=\"sb\">2</text><rect x=\"628\" y=\"120\" width=\"50\" height=\"46\" rx=\"14\" fill=\"#ffffff\" stroke=\"#9a3412\" stroke-width=\"2.2\"/><text x=\"653\" y=\"150\" text-anchor=\"middle\" font-size=\"20\" font-weight=\"700\" fill=\"#9a3412\" class=\"sb\">3</text><path d=\"M564.0 143 h6 M622.0 143 h6\" fill=\"none\" stroke=\"#9a3412\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><text x=\"595\" y=\"238\" text-anchor=\"middle\" font-size=\"17\" font-family=\"Arial,sans-serif\" font-weight=\"700\" fill=\"#9a3412\">Plot</text></g><rect x=\"120\" y=\"272\" width=\"480\" height=\"40\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"360\" y=\"298\" text-anchor=\"middle\" font-size=\"16\" font-weight=\"700\" fill=\"#334155\" class=\"sb\">Characters + setting + plot for the whole story</text></g></svg>",
        "alt": "Animated cartoon: three cards labelled Characters, Setting and Plot. The characters card holds a boy waving, the setting card holds a house and a tree, and the plot card holds three numbered boxes joined by arrows.",
        "caption": "Characters, setting and plot. Every story has all three."
      }
    },
    {
      "icon": "👤",
      "title": "Characters: who the story is about",
      "explain": "Characters are the who of a story. They can be people, animals, or even objects that act and speak.\n\nAs you read, keep track of the characters and what each one wants. A story usually has one main character and a few others. The main character is the one the story follows, and the others help or hinder them.\n\nWatching what characters want is what makes reading interesting. Ask yourself what the main character is trying to do, and then read on to see whether they manage it.",
      "example": "In a story about a lost hat, the main character might be Mia, and the other characters might be her brother and a helpful dog.",
      "notice": "Naming every person mentioned is not needed. Name the characters who matter to what happens.",
      "check": {
        "type": "multiple_choice",
        "question": "What are the characters in a story?",
        "options": [
          "The people or animals the story is about",
          "The places in the story",
          "The funny parts",
          "The order of events"
        ],
        "correct_index": 0,
        "explanation": "Characters are the who of the story, the people or animals it follows."
      },
      "visual": {
        "svg": "<svg viewBox=\"0 0 720 330\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>@keyframes legA{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(26deg)}}@keyframes legB{0%,100%{transform:rotate(26deg)}50%{transform:rotate(-24deg)}}@keyframes armA{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-26deg)}}@keyframes armB{0%,100%{transform:rotate(-26deg)}50%{transform:rotate(22deg)}}@keyframes waveArm{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(-40deg)}}@keyframes wag{0%,100%{transform:rotate(-18deg)}50%{transform:rotate(18deg)}}@keyframes flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.4)}}@keyframes sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}@keyframes drift{0%{transform:translateX(-12px)}100%{transform:translateX(14px)}}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes bite{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.5)}}@keyframes rise{0%{transform:translateY(6px) scale(.6);opacity:0}18%{opacity:1}100%{transform:translateY(-54px) scale(1);opacity:0}}@keyframes fall{0%{transform:translateY(-14px);opacity:0}18%{opacity:1}100%{transform:translateY(26px);opacity:0}}@keyframes pop{0%{transform:scale(.5);opacity:0}55%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}@keyframes blink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}@keyframes ripple{0%,100%{transform:scaleX(1);opacity:.7}50%{transform:scaleX(1.2);opacity:1}}@keyframes float{0%{transform:translate(0,0)}50%{transform:translate(4px,-3px)}100%{transform:translate(-3px,2px)}}@keyframes jump{0%,100%{transform:translateY(0)}30%{transform:translateY(-14px)}}.a2klL{animation:legA 0.9s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a2klR{animation:legB %ss ease-in-out infinite;transform-box:fill-box;transform-origin:50%% 0%%}.a2kbd{animation:bob 0.9s ease-in-out infinite}.a2khd{animation:bob 0.9s ease-in-out infinite}.a2key{animation:blink 4.2s linear infinite;transform-box:fill-box;transform-origin:50% 50%}.a2kaL{animation:armB 1.26s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a2kaR{animation:waveArm 0.9s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%}.a2kbd{animation:bob 0.9s ease-in-out infinite}.a2dtl{animation:wag 1.2000000000000002s ease-in-out infinite;transform-box:fill-box;transform-origin:80% 90%}.a2dlA{animation:legA 0.8s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a2dlB{animation:legB 0.8s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a2dhd{animation:bob 0.8s ease-in-out infinite}.a2der{animation:flap 1.36s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a2dmo{animation:bite 0.8s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a2ctl{animation:wag 1.3650000000000002s ease-in-out infinite;transform-box:fill-box;transform-origin:80% 90%}.a2chd{animation:bob 1.1550000000000002s ease-in-out infinite}.a2cey{animation:blink 5s linear infinite;transform-box:fill-box;transform-origin:50% 50%}.a2t0{animation:pop .5s ease-out both}.a2t1{animation:pop .5s ease-out both}.a2t2{animation:pop .5s ease-out both}.sb{font-family:Arial,sans-serif;font-weight:700}@media (prefers-reduced-motion:reduce){.scn *{animation:none !important}animate{display:none}}</style><g class=\"scn\"><defs><linearGradient id=\"gw2a2\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#a9d8ff\"/><stop offset=\"0.62\" stop-color=\"#d8efff\"/><stop offset=\"1\" stop-color=\"#eef9ff\"/></linearGradient></defs><rect width=\"720\" height=\"330\" rx=\"20\" fill=\"url(#gw2a2)\"/><rect x=\"0\" y=\"250\" width=\"720\" height=\"80\" rx=\"0\" fill=\"#8fe38f\"/><ellipse cx=\"150.0\" cy=\"275.4\" rx=\"26.4\" ry=\"6.9\" fill=\"#000\" opacity=\"0.12\"/><g class=\"a2klL\"><path d=\"M142.5 242.1 L142.5 261.6\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"13.8\" stroke-linecap=\"round\"/><path d=\"M142.5 242.1 L142.5 261.6\" fill=\"none\" stroke=\"#2f6bcf\" stroke-width=\"10.3\" stroke-linecap=\"round\"/></g><g class=\"a2klR\"><path d=\"M157.5 242.1 L157.5 261.6\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"13.8\" stroke-linecap=\"round\"/><path d=\"M157.5 242.1 L157.5 261.6\" fill=\"none\" stroke=\"#2f6bcf\" stroke-width=\"10.3\" stroke-linecap=\"round\"/></g><rect x=\"135.1\" y=\"260.5\" width=\"19.5\" height=\"11.5\" rx=\"5.8\" fill=\"#334155\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><rect x=\"146.6\" y=\"260.5\" width=\"19.5\" height=\"11.5\" rx=\"5.8\" fill=\"#334155\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><path d=\"M133.9 242.1 L129.3 220.2 Q129.3 212.2 138.5 211.1 L161.5 211.1 Q170.7 212.2 170.7 220.2 L166.1 242.1 Z\" fill=\"#7c3aed\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><path d=\"M143.1 211.1 Q150.0 216.8 156.9 211.1\" fill=\"#7c3aed\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><g class=\"a2kaL\"><path d=\"M130.4 217.9 Q124.7 228.3 128.2 237.5\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"10.3\" stroke-linecap=\"round\"/><path d=\"M130.4 217.9 Q124.7 228.3 128.2 237.5\" fill=\"none\" stroke=\"#f6c9a0\" stroke-width=\"6.9\" stroke-linecap=\"round\"/></g><g class=\"a2kaR\"><path d=\"M169.6 217.9 Q181.1 207.6 179.9 191.5\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"10.3\" stroke-linecap=\"round\"/><path d=\"M169.6 217.9 Q181.1 207.6 179.9 191.5\" fill=\"none\" stroke=\"#f6c9a0\" stroke-width=\"6.9\" stroke-linecap=\"round\"/></g><circle cx=\"128.2\" cy=\"237.5\" r=\"3.9\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"171.8\" cy=\"237.5\" r=\"3.9\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><rect x=\"146.0\" y=\"205.3\" width=\"8.0\" height=\"8.0\" rx=\"3.4\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><circle cx=\"131.0\" cy=\"189.2\" r=\"4.8\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"169.0\" cy=\"189.2\" r=\"4.8\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><g class=\"a2khd\"><circle cx=\"150.0\" cy=\"189.2\" r=\"18.4\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><path d=\"M131.6 186.9 Q128.2 166.2 150.0 166.2 Q171.8 166.2 168.4 186.9 Q161.5 180.0 154.6 183.4 Q147.7 180.0 140.8 183.4 Q136.2 180.0 131.6 186.9 Z\" fill=\"#4a3222\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><g class=\"a2key\"><ellipse cx=\"143.8\" cy=\"189.2\" rx=\"4.1\" ry=\"4.9\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"143.3\" cy=\"189.8\" r=\"2.3\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"144.8\" cy=\"187.7\" r=\"1.0\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><ellipse cx=\"156.2\" cy=\"189.2\" rx=\"4.1\" ry=\"4.9\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"156.7\" cy=\"189.8\" r=\"2.3\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"155.2\" cy=\"187.7\" r=\"1.0\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/></g><path d=\"M140.8 180.0 q3.4 -2.5 6.9 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><path d=\"M152.3 180.0 q3.4 -2.5 6.9 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><ellipse cx=\"138.5\" cy=\"196.1\" rx=\"4.1\" ry=\"2.8\" fill=\"#f87171\" opacity=\"0.35\"/><ellipse cx=\"161.5\" cy=\"196.1\" rx=\"4.1\" ry=\"2.8\" fill=\"#f87171\" opacity=\"0.35\"/><path d=\"M144.8 198.4 q5.2 5.5 10.3 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><ellipse cx=\"384.0\" cy=\"277.0\" rx=\"24.0\" ry=\"5.5\" fill=\"#000\" opacity=\"0.12\"/><g class=\"a2dtl\"><path d=\"M360.0 256.0 Q350.0 250.0 354.0 234.0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"8.4\" stroke-linecap=\"round\"/><path d=\"M360.0 256.0 Q350.0 250.0 354.0 234.0\" fill=\"none\" stroke=\"#c07f37\" stroke-width=\"5.0\" stroke-linecap=\"round\"/></g><g class=\"a2dlA\"><path d=\"M367.0 274.0 L367.0 261.0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"9.4\" stroke-linecap=\"round\"/><path d=\"M367.0 274.0 L367.0 261.0\" fill=\"none\" stroke=\"#c07f37\" stroke-width=\"6.0\" stroke-linecap=\"round\"/></g><g class=\"a2dlB\"><path d=\"M382.0 274.0 L382.0 261.0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"9.4\" stroke-linecap=\"round\"/><path d=\"M382.0 274.0 L382.0 261.0\" fill=\"none\" stroke=\"#c07f37\" stroke-width=\"6.0\" stroke-linecap=\"round\"/></g><g class=\"a2dlA\"><path d=\"M391.0 274.0 L391.0 261.0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"9.4\" stroke-linecap=\"round\"/><path d=\"M391.0 274.0 L391.0 261.0\" fill=\"none\" stroke=\"#c07f37\" stroke-width=\"6.0\" stroke-linecap=\"round\"/></g><g class=\"a2dlB\"><path d=\"M397.0 274.0 L397.0 261.0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"9.4\" stroke-linecap=\"round\"/><path d=\"M397.0 274.0 L397.0 261.0\" fill=\"none\" stroke=\"#c07f37\" stroke-width=\"6.0\" stroke-linecap=\"round\"/></g><ellipse cx=\"380.0\" cy=\"255.0\" rx=\"23.0\" ry=\"14.0\" fill=\"#e0a45c\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><g class=\"a2dhd\"><circle cx=\"401.0\" cy=\"242.0\" r=\"14.0\" fill=\"#e0a45c\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><g class=\"a2der\"><path d=\"M390.0 232.0 Q382.0 224.0 386.0 244.0 Q394.0 240.0 396.0 234.0 Z\" fill=\"#c07f37\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><ellipse cx=\"412.0\" cy=\"248.0\" rx=\"11.0\" ry=\"9.0\" fill=\"#f8e7c8\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><circle cx=\"420.0\" cy=\"247.0\" r=\"3.4\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><ellipse cx=\"403.1\" cy=\"238.0\" rx=\"3.4\" ry=\"4.1\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"403.5\" cy=\"238.5\" r=\"1.9\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"402.3\" cy=\"236.8\" r=\"0.8\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/></g><g class=\"a2dmo\"><path d=\"M409.0 254.0 q3.0 3.4 8.0 1.0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><ellipse cx=\"601.9\" cy=\"278.9\" rx=\"19.9\" ry=\"4.8\" fill=\"#000\" opacity=\"0.12\"/><g class=\"a2ctl\"><path d=\"M582.9 257.0 Q571.5 249.4 575.3 234.2\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"7.7\" stroke-linecap=\"round\"/><path d=\"M582.9 257.0 Q571.5 249.4 575.3 234.2\" fill=\"none\" stroke=\"#7c8797\" stroke-width=\"4.3\" stroke-linecap=\"round\"/></g><path d=\"M589.5 276.0 L589.5 264.6\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"8.2\" stroke-linecap=\"round\"/><path d=\"M589.5 276.0 L589.5 264.6\" fill=\"none\" stroke=\"#7c8797\" stroke-width=\"4.8\" stroke-linecap=\"round\"/><path d=\"M600.0 276.0 L600.0 264.6\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"8.2\" stroke-linecap=\"round\"/><path d=\"M600.0 276.0 L600.0 264.6\" fill=\"none\" stroke=\"#7c8797\" stroke-width=\"4.8\" stroke-linecap=\"round\"/><path d=\"M607.6 276.0 L607.6 264.6\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"8.2\" stroke-linecap=\"round\"/><path d=\"M607.6 276.0 L607.6 264.6\" fill=\"none\" stroke=\"#7c8797\" stroke-width=\"4.8\" stroke-linecap=\"round\"/><path d=\"M614.2 276.0 L614.2 264.6\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"8.2\" stroke-linecap=\"round\"/><path d=\"M614.2 276.0 L614.2 264.6\" fill=\"none\" stroke=\"#7c8797\" stroke-width=\"4.8\" stroke-linecap=\"round\"/><ellipse cx=\"600.0\" cy=\"259.9\" rx=\"19.9\" ry=\"11.4\" fill=\"#9aa5b5\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><circle cx=\"617.1\" cy=\"247.5\" r=\"12.3\" fill=\"#9aa5b5\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><path d=\"M607.6 238.0 L606.6 226.6 L617.1 234.2 Z\" fill=\"#9aa5b5\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><path d=\"M624.7 236.1 L628.5 226.6 L618.0 234.2 Z\" fill=\"#9aa5b5\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><g class=\"a2cey\"><ellipse cx=\"612.7\" cy=\"245.6\" rx=\"2.9\" ry=\"3.5\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"612.4\" cy=\"246.0\" r=\"1.6\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"613.5\" cy=\"244.6\" r=\"0.7\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><ellipse cx=\"621.5\" cy=\"245.6\" rx=\"2.9\" ry=\"3.5\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"621.8\" cy=\"246.0\" r=\"1.6\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"620.7\" cy=\"244.6\" r=\"0.7\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/></g><path d=\"M607.6 251.3 l-9.5 -1.9 M607.6 254.2 l-9.5 2.8\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"1.8\" stroke-linejoin=\"round\"/><path d=\"M626.6 251.3 l9.5 -1.9 M626.6 254.2 l9.5 2.8\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"1.8\" stroke-linejoin=\"round\"/><g class=\"a2t0\"><rect x=\"110\" y=\"150\" width=\"120\" height=\"34\" rx=\"17\" fill=\"#dbeafe\" stroke=\"#1e40af\" stroke-width=\"2.4\"/><text x=\"170.0\" y=\"172.0\" text-anchor=\"middle\" font-size=\"15\" font-family=\"Arial,sans-serif\" font-weight=\"700\" fill=\"#1e40af\">Lily</text></g><g class=\"a2t1\"><rect x=\"345\" y=\"150\" width=\"120\" height=\"34\" rx=\"17\" fill=\"#ffedd5\" stroke=\"#9a3412\" stroke-width=\"2.4\"/><text x=\"405.0\" y=\"172.0\" text-anchor=\"middle\" font-size=\"15\" font-family=\"Arial,sans-serif\" font-weight=\"700\" fill=\"#9a3412\">Bud</text></g><g class=\"a2t2\"><rect x=\"565\" y=\"150\" width=\"120\" height=\"34\" rx=\"17\" fill=\"#dcfce7\" stroke=\"#166534\" stroke-width=\"2.4\"/><text x=\"625.0\" y=\"172.0\" text-anchor=\"middle\" font-size=\"15\" font-family=\"Arial,sans-serif\" font-weight=\"700\" fill=\"#166534\">Mia</text></g><rect x=\"60\" y=\"290\" width=\"600\" height=\"34\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"360\" y=\"314\" text-anchor=\"middle\" font-size=\"17\" font-weight=\"700\" fill=\"#334155\" class=\"sb\">Characters are the who of the story</text></g></svg>",
        "alt": "Animated cartoon: a girl, a dog and a cat on the grass with name tags above them reading Lily, Bud and Mia, and a caption that characters are the who of the story.",
        "caption": "The characters are the who. Here they are Lily, Bud and Mia."
      }
    },
    {
      "icon": "🗺",
      "title": "Setting: where and when",
      "explain": "The setting is where and when a story happens. Where might be a cave, a school or a beach. When might be summer, midnight, or a hundred years ago.\n\nSetting is more than background. It changes what the characters can do. In a dark cave a character cannot see well. At midnight everyone else is asleep, so a character is alone. Readers who notice the setting can predict what might happen next.\n\nLook for setting clues at the start of a story, because writers usually place them early so you can picture the scene.",
      "example": "The setting of a story might be a park in summer, which tells you it is warm, it is daytime and there are other people around.",
      "notice": "The setting is not just the place. The time of day and the season matter too.",
      "check": {
        "type": "multiple_choice",
        "question": "What does the setting of a story tell you?",
        "options": [
          "Where and when the story happens",
          "Who the story is about",
          "What the problem is",
          "How the story ends"
        ],
        "correct_index": 0,
        "explanation": "The setting is where and when the story takes place."
      },
      "visual": {
        "svg": "<svg viewBox=\"0 0 720 330\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>@keyframes legA{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(26deg)}}@keyframes legB{0%,100%{transform:rotate(26deg)}50%{transform:rotate(-24deg)}}@keyframes armA{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-26deg)}}@keyframes armB{0%,100%{transform:rotate(-26deg)}50%{transform:rotate(22deg)}}@keyframes waveArm{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(-40deg)}}@keyframes wag{0%,100%{transform:rotate(-18deg)}50%{transform:rotate(18deg)}}@keyframes flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.4)}}@keyframes sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}@keyframes drift{0%{transform:translateX(-12px)}100%{transform:translateX(14px)}}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes bite{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.5)}}@keyframes rise{0%{transform:translateY(6px) scale(.6);opacity:0}18%{opacity:1}100%{transform:translateY(-54px) scale(1);opacity:0}}@keyframes fall{0%{transform:translateY(-14px);opacity:0}18%{opacity:1}100%{transform:translateY(26px);opacity:0}}@keyframes pop{0%{transform:scale(.5);opacity:0}55%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}@keyframes blink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}@keyframes ripple{0%,100%{transform:scaleX(1);opacity:.7}50%{transform:scaleX(1.2);opacity:1}}@keyframes float{0%{transform:translate(0,0)}50%{transform:translate(4px,-3px)}100%{transform:translate(-3px,2px)}}@keyframes jump{0%,100%{transform:translateY(0)}30%{transform:translateY(-14px)}}.srays{animation:spin 16.0s linear infinite;transform-box:fill-box;transform-origin:50% 50%}.a3c{animation:drift 7.0s ease-in-out infinite alternate}.a3t{animation:sway 3.0s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}.a3t1{animation:pop .5s ease-out both}.sb{font-family:Arial,sans-serif;font-weight:700}.st{font-family:Arial,sans-serif}@media (prefers-reduced-motion:reduce){.scn *{animation:none !important}animate{display:none}}</style><g class=\"scn\"><defs><linearGradient id=\"gw2a3\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#a9d8ff\"/><stop offset=\"0.62\" stop-color=\"#d8efff\"/><stop offset=\"1\" stop-color=\"#eef9ff\"/></linearGradient></defs><rect width=\"720\" height=\"330\" rx=\"20\" fill=\"url(#gw2a3)\"/><rect x=\"0\" y=\"252\" width=\"720\" height=\"78\" rx=\"0\" fill=\"#8fe38f\"/><g class=\"srays\"><path d=\"M125.0 74.0 L114.5 81.7 L116.5 94.5 L103.7 92.5 L96.0 103.0 L88.3 92.5 L75.5 94.5 L77.5 81.7 L67.0 74.0 L77.5 66.3 L75.5 53.5 L88.3 55.5 L96.0 45.0 L103.7 55.5 L116.5 53.5 L114.5 66.3 Z\" fill=\"#f7b731\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><circle cx=\"96.0\" cy=\"74.0\" r=\"18.0\" fill=\"#ffd24a\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><g class=\"a3c\"><circle cx=\"300.0\" cy=\"72.0\" r=\"13.6\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><circle cx=\"315.2\" cy=\"66.4\" r=\"16.8\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><circle cx=\"333.6\" cy=\"72.0\" r=\"12.8\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><rect x=\"288.0\" y=\"69.6\" width=\"60.8\" height=\"14.4\" rx=\"7.2\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.2\"/></g><rect x=\"129.2\" y=\"259.2\" width=\"81.6\" height=\"40.8\" rx=\"3.6\" fill=\"#f8e3bd\" stroke=\"#b07d46\" stroke-width=\"2.4\"/><path d=\"M119.6 261.6 L170.0 225.6 L220.4 261.6 Z\" fill=\"#c94f4f\" stroke=\"#a13c3c\" stroke-width=\"2.4\" stroke-linejoin=\"round\"/><rect x=\"138.8\" y=\"273.6\" width=\"19.2\" height=\"26.4\" rx=\"2.4\" fill=\"#8b5a2b\"/><rect x=\"177.2\" y=\"268.8\" width=\"19.2\" height=\"16.8\" rx=\"2.4\" fill=\"#bfe3ff\" stroke=\"#8b5a2b\" stroke-width=\"2\"/><g class=\"a3t\"><path d=\"M320.0 304.0 L320.0 267.9\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"13.8\" stroke-linecap=\"round\"/><path d=\"M320.0 304.0 L320.0 267.9\" fill=\"none\" stroke=\"#8a5a33\" stroke-width=\"10.4\" stroke-linecap=\"round\"/><path d=\"M320.0 281.2 Q311.4 271.7 305.8 262.2\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"9.1\" stroke-linecap=\"round\"/><path d=\"M320.0 281.2 Q311.4 271.7 305.8 262.2\" fill=\"none\" stroke=\"#8a5a33\" stroke-width=\"5.7\" stroke-linecap=\"round\"/><path d=\"M320.0 277.4 Q328.6 267.9 335.2 258.4\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"9.1\" stroke-linecap=\"round\"/><path d=\"M320.0 277.4 Q328.6 267.9 335.2 258.4\" fill=\"none\" stroke=\"#8a5a33\" stroke-width=\"5.7\" stroke-linecap=\"round\"/><circle cx=\"320.0\" cy=\"248.9\" r=\"22.8\" fill=\"#3fae52\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><circle cx=\"301.9\" cy=\"258.4\" r=\"16.1\" fill=\"#4cc061\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><circle cx=\"338.1\" cy=\"258.4\" r=\"16.1\" fill=\"#4cc061\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><circle cx=\"320.0\" cy=\"233.7\" r=\"15.2\" fill=\"#4cc061\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><circle cx=\"313.4\" cy=\"237.5\" r=\"5.7\" fill=\"#7fd98a\" stroke=\"#2b2521\" stroke-width=\"0.0\"/></g><rect x=\"430\" y=\"60\" width=\"250\" height=\"96\" rx=\"14\" fill=\"#e6dbff\" stroke=\"#52309c\" stroke-width=\"2.6\"/><text x=\"555\" y=\"100\" text-anchor=\"middle\" font-size=\"21\" font-weight=\"700\" fill=\"#52309c\" class=\"sb\">Setting</text><text x=\"555\" y=\"132\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#52309c\" class=\"st\">the place and the time</text><g class=\"a3t1\"><rect x=\"470\" y=\"180\" width=\"180\" height=\"34\" rx=\"17\" fill=\"#dbeafe\" stroke=\"#1e40af\" stroke-width=\"2.4\"/><text x=\"560.0\" y=\"202.0\" text-anchor=\"middle\" font-size=\"15\" font-family=\"Arial,sans-serif\" font-weight=\"700\" fill=\"#1e40af\">a park in summer</text></g><rect x=\"60\" y=\"290\" width=\"600\" height=\"34\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"360\" y=\"314\" text-anchor=\"middle\" font-size=\"16\" font-weight=\"700\" fill=\"#334155\" class=\"sb\">Setting tells you where and when the story happens</text></g></svg>",
        "alt": "Animated cartoon: a house and a tree in a sunny park with a card reading Setting, the place and the time, and a tag underneath reading a park in summer.",
        "caption": "The setting tells you where and when, not just where."
      }
    },
    {
      "icon": "🧩",
      "title": "Plot: what happens, in order",
      "explain": "The plot is what happens in a story, told in the order it happens. It usually starts with something ordinary, then something goes wrong or a problem appears, and finally the problem is solved.\n\nReaders follow a plot best when they hold three questions in mind. What is the problem. What does the main character try. How is it solved. Those three questions are the beginning, the middle and the end.\n\nOrder matters in a plot. If you tell the ending first, the story stops making sense, and the reader cannot follow how the characters got there.",
      "example": "The plot of the rabbit story: first a rabbit found a carrot, then another rabbit wanted it, and finally they shared it.",
      "notice": "The plot is a set of events, not a feeling. How a character feels belongs to the character, not to the plot.",
      "check": {
        "type": "multiple_choice",
        "question": "What is the plot of a story?",
        "options": [
          "What happens, in the order it happens",
          "Where the story happens",
          "Who is in the story",
          "How long the story is"
        ],
        "correct_index": 2,
        "explanation": "The plot is the events of the story in order."
      },
      "visual": {
        "svg": "<svg viewBox=\"0 0 720 330\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>@keyframes legA{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(26deg)}}@keyframes legB{0%,100%{transform:rotate(26deg)}50%{transform:rotate(-24deg)}}@keyframes armA{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-26deg)}}@keyframes armB{0%,100%{transform:rotate(-26deg)}50%{transform:rotate(22deg)}}@keyframes waveArm{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(-40deg)}}@keyframes wag{0%,100%{transform:rotate(-18deg)}50%{transform:rotate(18deg)}}@keyframes flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.4)}}@keyframes sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}@keyframes drift{0%{transform:translateX(-12px)}100%{transform:translateX(14px)}}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes bite{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.5)}}@keyframes rise{0%{transform:translateY(6px) scale(.6);opacity:0}18%{opacity:1}100%{transform:translateY(-54px) scale(1);opacity:0}}@keyframes fall{0%{transform:translateY(-14px);opacity:0}18%{opacity:1}100%{transform:translateY(26px);opacity:0}}@keyframes pop{0%{transform:scale(.5);opacity:0}55%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}@keyframes blink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}@keyframes ripple{0%,100%{transform:scaleX(1);opacity:.7}50%{transform:scaleX(1.2);opacity:1}}@keyframes float{0%{transform:translate(0,0)}50%{transform:translate(4px,-3px)}100%{transform:translate(-3px,2px)}}@keyframes jump{0%,100%{transform:translateY(0)}30%{transform:translateY(-14px)}}.a4p0{animation:pop .6s ease-out both;animation-delay:0.0s}.a4r1er{animation:flap 1.6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a4r1hd{animation:bob .8s ease-in-out infinite}.a4r1ey{animation:blink 4.4s linear infinite;transform-box:fill-box;transform-origin:50% 50%}.a4p1{animation:pop .6s ease-out both;animation-delay:0.6s}.a4r2er{animation:flap 1.6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a4r2hd{animation:bob .8s ease-in-out infinite}.a4r2ey{animation:blink 4.4s linear infinite;transform-box:fill-box;transform-origin:50% 50%}.a4p2{animation:pop .6s ease-out both;animation-delay:1.2s}.a4r3er{animation:flap 1.6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a4r3hd{animation:bob .8s ease-in-out infinite}.a4r3ey{animation:blink 4.4s linear infinite;transform-box:fill-box;transform-origin:50% 50%}.a4r4er{animation:flap 1.6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a4r4hd{animation:bob .8s ease-in-out infinite}.a4r4ey{animation:blink 4.4s linear infinite;transform-box:fill-box;transform-origin:50% 50%}.sb{font-family:Arial,sans-serif;font-weight:700}@media (prefers-reduced-motion:reduce){.scn *{animation:none !important}animate{display:none}}</style><g class=\"scn\"><rect x=\"0\" y=\"0\" width=\"720\" height=\"330\" rx=\"20\" fill=\"#f7faff\"/><rect x=\"40\" y=\"26\" width=\"640\" height=\"44\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"360\" y=\"55\" text-anchor=\"middle\" font-size=\"18\" font-weight=\"700\" fill=\"#1f2937\" class=\"sb\">The plot is what happens, in order</text><g class=\"a4p0\"><rect x=\"30\" y=\"86\" width=\"210\" height=\"158\" rx=\"14\" fill=\"#dbeafe\" stroke=\"#1e40af\" stroke-width=\"2.6\"/><ellipse cx=\"102.0\" cy=\"192.4\" rx=\"17.0\" ry=\"11.0\" fill=\"#e7e2da\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><circle cx=\"88.4\" cy=\"187.3\" r=\"5.1\" fill=\"#cfc8bd\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><g class=\"a4r1hd\"><circle cx=\"117.3\" cy=\"178.8\" r=\"11.0\" fill=\"#e7e2da\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><g class=\"a4r1er\"><path d=\"M113.0 170.3 q-2.5 -10.2 -4.2 -18.7 q6.8 5.1 3.4 13.6 Z\" fill=\"#e7e2da\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><g class=\"a4r1er\"><path d=\"M122.4 170.3 q2.5 -10.2 6.0 -17.0 q-6.0 4.2 -3.4 11.9 Z\" fill=\"#e7e2da\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><g class=\"a4r1ey\"><ellipse cx=\"120.1\" cy=\"177.9\" rx=\"1.9\" ry=\"2.3\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"120.4\" cy=\"178.2\" r=\"1.1\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"119.7\" cy=\"177.3\" r=\"0.4\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/></g><circle cx=\"125.0\" cy=\"181.3\" r=\"1.9\" fill=\"#f08ea8\" stroke=\"#2b2521\" stroke-width=\"1.4\"/><path d=\"M120.7 184.8 q2.5 2.5 5.1 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"1.8\" stroke-linejoin=\"round\"/></g><text x=\"135\" y=\"232\" text-anchor=\"middle\" font-size=\"17\" font-family=\"Arial,sans-serif\" font-weight=\"700\" fill=\"#1e40af\">Beginning</text></g><g class=\"a4p1\"><rect x=\"260\" y=\"86\" width=\"210\" height=\"158\" rx=\"14\" fill=\"#ffedd5\" stroke=\"#9a3412\" stroke-width=\"2.6\"/><ellipse cx=\"340.0\" cy=\"192.4\" rx=\"17.0\" ry=\"11.0\" fill=\"#dfd8cd\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><circle cx=\"326.4\" cy=\"187.3\" r=\"5.1\" fill=\"#cfc8bd\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><g class=\"a4r2hd\"><circle cx=\"355.3\" cy=\"178.8\" r=\"11.0\" fill=\"#dfd8cd\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><g class=\"a4r2er\"><path d=\"M351.1 170.3 q-2.5 -10.2 -4.2 -18.7 q6.8 5.1 3.4 13.6 Z\" fill=\"#dfd8cd\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><g class=\"a4r2er\"><path d=\"M360.4 170.3 q2.5 -10.2 6.0 -17.0 q-6.0 4.2 -3.4 11.9 Z\" fill=\"#dfd8cd\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><g class=\"a4r2ey\"><ellipse cx=\"358.1\" cy=\"177.9\" rx=\"1.9\" ry=\"2.3\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"358.4\" cy=\"178.2\" r=\"1.1\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"357.7\" cy=\"177.3\" r=\"0.4\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/></g><circle cx=\"362.9\" cy=\"181.3\" r=\"1.9\" fill=\"#f08ea8\" stroke=\"#2b2521\" stroke-width=\"1.4\"/><path d=\"M358.7 184.8 q2.5 2.5 5.1 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"1.8\" stroke-linejoin=\"round\"/></g><text x=\"365\" y=\"112\" text-anchor=\"middle\" font-size=\"28\" font-weight=\"700\" fill=\"#be123c\" class=\"sb\">!</text><text x=\"365\" y=\"232\" text-anchor=\"middle\" font-size=\"17\" font-family=\"Arial,sans-serif\" font-weight=\"700\" fill=\"#9a3412\">Middle</text></g><g class=\"a4p2\"><rect x=\"490\" y=\"86\" width=\"210\" height=\"158\" rx=\"14\" fill=\"#dcfce7\" stroke=\"#166534\" stroke-width=\"2.6\"/><ellipse cx=\"554.0\" cy=\"193.2\" rx=\"16.0\" ry=\"10.4\" fill=\"#e7e2da\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><circle cx=\"541.2\" cy=\"188.4\" r=\"4.8\" fill=\"#cfc8bd\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><g class=\"a4r3hd\"><circle cx=\"568.4\" cy=\"180.4\" r=\"10.4\" fill=\"#e7e2da\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><g class=\"a4r3er\"><path d=\"M564.4 172.4 q-2.4 -9.6 -4.0 -17.6 q6.4 4.8 3.2 12.8 Z\" fill=\"#e7e2da\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><g class=\"a4r3er\"><path d=\"M573.2 172.4 q2.4 -9.6 5.6 -16.0 q-5.6 4.0 -3.2 11.2 Z\" fill=\"#e7e2da\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><g class=\"a4r3ey\"><ellipse cx=\"571.1\" cy=\"179.6\" rx=\"1.8\" ry=\"2.1\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"571.3\" cy=\"179.8\" r=\"1.0\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"570.6\" cy=\"179.0\" r=\"0.4\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/></g><circle cx=\"575.6\" cy=\"182.8\" r=\"1.8\" fill=\"#f08ea8\" stroke=\"#2b2521\" stroke-width=\"1.4\"/><path d=\"M571.6 186.0 q2.4 2.4 4.8 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"1.8\" stroke-linejoin=\"round\"/></g><ellipse cx=\"630.0\" cy=\"196.8\" rx=\"14.0\" ry=\"9.1\" fill=\"#f3ece2\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><circle cx=\"618.8\" cy=\"192.6\" r=\"4.2\" fill=\"#cfc8bd\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><g class=\"a4r4hd\"><circle cx=\"642.6\" cy=\"185.6\" r=\"9.1\" fill=\"#f3ece2\" stroke=\"#2b2521\" stroke-width=\"2.4\"/><g class=\"a4r4er\"><path d=\"M639.1 178.6 q-2.1 -8.4 -3.5 -15.4 q5.6 4.2 2.8 11.2 Z\" fill=\"#f3ece2\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><g class=\"a4r4er\"><path d=\"M646.8 178.6 q2.1 -8.4 4.9 -14.0 q-4.9 3.5 -2.8 9.8 Z\" fill=\"#f3ece2\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><g class=\"a4r4ey\"><ellipse cx=\"644.9\" cy=\"184.9\" rx=\"1.6\" ry=\"1.9\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"645.1\" cy=\"185.1\" r=\"0.9\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"644.6\" cy=\"184.3\" r=\"0.4\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/></g><circle cx=\"648.9\" cy=\"187.7\" r=\"1.5\" fill=\"#f08ea8\" stroke=\"#2b2521\" stroke-width=\"1.4\"/><path d=\"M645.4 190.5 q2.1 2.1 4.2 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"1.8\" stroke-linejoin=\"round\"/></g><text x=\"595\" y=\"232\" text-anchor=\"middle\" font-size=\"17\" font-family=\"Arial,sans-serif\" font-weight=\"700\" fill=\"#166534\">End</text></g><rect x=\"140\" y=\"272\" width=\"440\" height=\"40\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"360\" y=\"298\" text-anchor=\"middle\" font-size=\"16\" font-weight=\"700\" fill=\"#334155\" class=\"sb\">First, then, last: the order matters</text></g></svg>",
        "alt": "Animated cartoon: three panels showing a rabbit finding a carrot, a second rabbit arriving with a surprise, and the two rabbits together, labelled beginning, middle and end, with the caption that first, then, last, the order matters.",
        "caption": "The plot runs beginning, middle, end, in that order."
      }
    },
    {
      "icon": "🔍",
      "title": "Finding the elements as you read",
      "explain": "Reading for story elements is a habit you can build. Before you begin, remind yourself of the three questions: who, where and what happens.\n\nAs you read, mark the elements as you meet them. The characters usually appear in the first few sentences. The setting is often in the first paragraph too. The plot unfolds across the whole story, so notice the problem when it appears and then watch how it is solved.\n\nIf you can answer who, where and what happened after reading, you have understood the story at its foundation, and you can then think about the smaller details.",
      "example": "Read the first line of a story: Mia ran along the beach at sunset. Who is Mia, where is the beach, and the sunset tells you when.",
      "notice": "Readers who skip the opening often miss the setting. The first paragraph is where the writer places it on purpose.",
      "check": {
        "type": "multiple_choice",
        "question": "When do most stories give you the characters and the setting?",
        "options": [
          "In the first few sentences",
          "In the last sentence",
          "Nowhere",
          "Only in the pictures"
        ],
        "correct_index": 0,
        "explanation": "Writers usually tell you who and where at the start so you can picture the story."
      },
      "visual": {
        "svg": "<svg viewBox=\"0 0 720 320\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>@keyframes legA{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(26deg)}}@keyframes legB{0%,100%{transform:rotate(26deg)}50%{transform:rotate(-24deg)}}@keyframes armA{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-26deg)}}@keyframes armB{0%,100%{transform:rotate(-26deg)}50%{transform:rotate(22deg)}}@keyframes waveArm{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(-40deg)}}@keyframes wag{0%,100%{transform:rotate(-18deg)}50%{transform:rotate(18deg)}}@keyframes flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.4)}}@keyframes sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}@keyframes drift{0%{transform:translateX(-12px)}100%{transform:translateX(14px)}}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes bite{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.5)}}@keyframes rise{0%{transform:translateY(6px) scale(.6);opacity:0}18%{opacity:1}100%{transform:translateY(-54px) scale(1);opacity:0}}@keyframes fall{0%{transform:translateY(-14px);opacity:0}18%{opacity:1}100%{transform:translateY(26px);opacity:0}}@keyframes pop{0%{transform:scale(.5);opacity:0}55%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}@keyframes blink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}@keyframes ripple{0%,100%{transform:scaleX(1);opacity:.7}50%{transform:scaleX(1.2);opacity:1}}@keyframes float{0%{transform:translate(0,0)}50%{transform:translate(4px,-3px)}100%{transform:translate(-3px,2px)}}@keyframes jump{0%,100%{transform:translateY(0)}30%{transform:translateY(-14px)}}.a5bl{animation:bob 2.2s ease-in-out infinite}.a5m{animation:sway 2.6s ease-in-out infinite;transform-box:fill-box;transform-origin:20% 80%}.a5t0{animation:pop .5s ease-out both}.a5t1{animation:pop .5s ease-out both}.a5t2{animation:pop .5s ease-out both}.sb{font-family:Arial,sans-serif;font-weight:700}@media (prefers-reduced-motion:reduce){.scn *{animation:none !important}animate{display:none}}</style><g class=\"scn\"><rect x=\"0\" y=\"0\" width=\"720\" height=\"320\" rx=\"20\" fill=\"#fffdf7\"/><g class=\"a5bl\"><path d=\"M260.0 179.0 C 224.0 170.0 188.0 173.0 176.0 185.0 L 176.0 263.0 C 188.0 251.0 224.0 248.0 260.0 260.0 Z\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.4\" stroke-linejoin=\"round\"/><path d=\"M194.0 197.0 h57.0\" stroke=\"#cbd5e1\" stroke-width=\"2.4\"/><path d=\"M194.0 213.5 h57.0\" stroke=\"#cbd5e1\" stroke-width=\"2.4\"/><path d=\"M194.0 230.0 h57.0\" stroke=\"#cbd5e1\" stroke-width=\"2.4\"/><path d=\"M194.0 246.5 h57.0\" stroke=\"#cbd5e1\" stroke-width=\"2.4\"/><path d=\"M260.0 179.0 C 296.0 170.0 332.0 173.0 344.0 185.0 L 344.0 263.0 C 332.0 251.0 296.0 248.0 260.0 260.0 Z\" fill=\"#f8fafc\" stroke=\"#2b2521\" stroke-width=\"2.4\" stroke-linejoin=\"round\"/><path d=\"M272.0 197.0 h57.0\" stroke=\"#cbd5e1\" stroke-width=\"2.4\"/><path d=\"M272.0 213.5 h57.0\" stroke=\"#cbd5e1\" stroke-width=\"2.4\"/><path d=\"M272.0 230.0 h57.0\" stroke=\"#cbd5e1\" stroke-width=\"2.4\"/><path d=\"M272.0 246.5 h57.0\" stroke=\"#cbd5e1\" stroke-width=\"2.4\"/><path d=\"M260.0 179.0 L260.0 260.0\" stroke=\"#2b2521\" stroke-width=\"2.4\"/></g><g class=\"a5m\"><circle cx=\"470.0\" cy=\"196.0\" r=\"29.9\" fill=\"#ffffff\" fill-opacity=\"0.5\" stroke=\"#2b2521\" stroke-width=\"5\"/><path d=\"M491.9 217.8 L520.6 246.6\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"12.6\" stroke-linecap=\"round\"/><path d=\"M491.9 217.8 L520.6 246.6\" fill=\"none\" stroke=\"#b98a4a\" stroke-width=\"9.2\" stroke-linecap=\"round\"/></g><g class=\"a5t0\"><rect x=\"60\" y=\"44\" width=\"250\" height=\"34\" rx=\"17\" fill=\"#dbeafe\" stroke=\"#1e40af\" stroke-width=\"2.4\"/><text x=\"185.0\" y=\"66.0\" text-anchor=\"middle\" font-size=\"15\" font-family=\"Arial,sans-serif\" font-weight=\"700\" fill=\"#1e40af\">character: Mia</text></g><g class=\"a5t1\"><rect x=\"60\" y=\"92\" width=\"250\" height=\"34\" rx=\"17\" fill=\"#dcfce7\" stroke=\"#166534\" stroke-width=\"2.4\"/><text x=\"185.0\" y=\"114.0\" text-anchor=\"middle\" font-size=\"15\" font-family=\"Arial,sans-serif\" font-weight=\"700\" fill=\"#166534\">setting: a dark cave</text></g><g class=\"a5t2\"><rect x=\"60\" y=\"140\" width=\"250\" height=\"34\" rx=\"17\" fill=\"#ffedd5\" stroke=\"#9a3412\" stroke-width=\"2.4\"/><text x=\"185.0\" y=\"162.0\" text-anchor=\"middle\" font-size=\"15\" font-family=\"Arial,sans-serif\" font-weight=\"700\" fill=\"#9a3412\">plot: she got lost</text></g><rect x=\"356\" y=\"258\" width=\"344\" height=\"44\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"528\" y=\"287\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#334155\" class=\"sb\">Look for the three elements as you read</text></g></svg>",
        "alt": "Animated cartoon: an open book with a magnifying glass above it, and three tags popping out labelled character: Mia, setting: a dark cave and plot: she got lost, with a card about looking for the three elements as you read.",
        "caption": "Hunt for the three elements as you read: who, where, what happens."
      }
    },
    {
      "icon": "💗",
      "title": "Traits and feelings",
      "explain": "Characters have traits, which are the things they are like all the time, and feelings, which change as the story goes.\n\nA trait might be kind, brave, curious or shy. A feeling might be worried, excited or proud. Mia can be a brave character who still feels worried when she loses her hat, because traits stay and feelings change.\n\nWriters rarely say these words directly. They show them through what a character does and says. If someone shares their lunch, the writer is showing you that they are kind. Reading for traits means reading between the lines.",
      "example": "Mia searched all afternoon and never gave up. That shows the trait of being determined, without the story saying so.",
      "notice": "Feelings change from page to page, but traits stay. Do not treat one worried moment as a character''s whole personality.",
      "check": {
        "type": "multiple_choice",
        "question": "What is the difference between a trait and a feeling?",
        "options": [
          "A trait stays and a feeling changes",
          "They are the same thing",
          "A feeling stays and a trait changes",
          "Only animals have traits"
        ],
        "correct_index": 0,
        "explanation": "Traits are what a character is always like. Feelings change as the story goes."
      },
      "visual": {
        "svg": "<svg viewBox=\"0 0 720 330\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>@keyframes legA{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(26deg)}}@keyframes legB{0%,100%{transform:rotate(26deg)}50%{transform:rotate(-24deg)}}@keyframes armA{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-26deg)}}@keyframes armB{0%,100%{transform:rotate(-26deg)}50%{transform:rotate(22deg)}}@keyframes waveArm{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(-40deg)}}@keyframes wag{0%,100%{transform:rotate(-18deg)}50%{transform:rotate(18deg)}}@keyframes flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.4)}}@keyframes sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}@keyframes drift{0%{transform:translateX(-12px)}100%{transform:translateX(14px)}}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes bite{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.5)}}@keyframes rise{0%{transform:translateY(6px) scale(.6);opacity:0}18%{opacity:1}100%{transform:translateY(-54px) scale(1);opacity:0}}@keyframes fall{0%{transform:translateY(-14px);opacity:0}18%{opacity:1}100%{transform:translateY(26px);opacity:0}}@keyframes pop{0%{transform:scale(.5);opacity:0}55%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}@keyframes blink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}@keyframes ripple{0%,100%{transform:scaleX(1);opacity:.7}50%{transform:scaleX(1.2);opacity:1}}@keyframes float{0%{transform:translate(0,0)}50%{transform:translate(4px,-3px)}100%{transform:translate(-3px,2px)}}@keyframes jump{0%,100%{transform:translateY(0)}30%{transform:translateY(-14px)}}.a6klL{animation:legA 0.9s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a6klR{animation:legB %ss ease-in-out infinite;transform-box:fill-box;transform-origin:50%% 0%%}.a6kbd{animation:bob 0.9s ease-in-out infinite}.a6khd{animation:bob 0.9s ease-in-out infinite}.a6key{animation:blink 4.2s linear infinite;transform-box:fill-box;transform-origin:50% 50%}.a6kaL{animation:armB 1.26s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0%}.a6kaR{animation:waveArm 0.9s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%}.a6kbd{animation:bob 0.9s ease-in-out infinite}.a6b{animation:pop .5s ease-out both}.a6t0{animation:pop .5s ease-out both}.a6t1{animation:pop .5s ease-out both}.a6t2{animation:pop .5s ease-out both}.sb{font-family:Arial,sans-serif;font-weight:700}@media (prefers-reduced-motion:reduce){.scn *{animation:none !important}animate{display:none}}</style><g class=\"scn\"><rect x=\"0\" y=\"0\" width=\"720\" height=\"330\" rx=\"20\" fill=\"#f8f7ff\"/><ellipse cx=\"140.0\" cy=\"303.8\" rx=\"28.8\" ry=\"7.5\" fill=\"#000\" opacity=\"0.12\"/><g class=\"a6klL\"><path d=\"M131.9 267.5 L131.9 288.8\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"14.7\" stroke-linecap=\"round\"/><path d=\"M131.9 267.5 L131.9 288.8\" fill=\"none\" stroke=\"#2f6bcf\" stroke-width=\"11.2\" stroke-linecap=\"round\"/></g><g class=\"a6klR\"><path d=\"M148.1 267.5 L148.1 288.8\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"14.7\" stroke-linecap=\"round\"/><path d=\"M148.1 267.5 L148.1 288.8\" fill=\"none\" stroke=\"#2f6bcf\" stroke-width=\"11.2\" stroke-linecap=\"round\"/></g><rect x=\"123.8\" y=\"287.5\" width=\"21.2\" height=\"12.5\" rx=\"6.2\" fill=\"#334155\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><rect x=\"136.2\" y=\"287.5\" width=\"21.2\" height=\"12.5\" rx=\"6.2\" fill=\"#334155\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><path d=\"M122.5 267.5 L117.5 243.8 Q117.5 235.0 127.5 233.8 L152.5 233.8 Q162.5 235.0 162.5 243.8 L157.5 267.5 Z\" fill=\"#0ea5e9\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><path d=\"M132.5 233.8 Q140.0 240.0 147.5 233.8\" fill=\"#0ea5e9\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><g class=\"a6kaL\"><path d=\"M118.8 241.2 Q112.5 252.5 116.2 262.5\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"10.9\" stroke-linecap=\"round\"/><path d=\"M118.8 241.2 Q112.5 252.5 116.2 262.5\" fill=\"none\" stroke=\"#f6c9a0\" stroke-width=\"7.5\" stroke-linecap=\"round\"/></g><g class=\"a6kaR\"><path d=\"M161.2 241.2 Q173.8 230.0 172.5 212.5\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"10.9\" stroke-linecap=\"round\"/><path d=\"M161.2 241.2 Q173.8 230.0 172.5 212.5\" fill=\"none\" stroke=\"#f6c9a0\" stroke-width=\"7.5\" stroke-linecap=\"round\"/></g><circle cx=\"116.2\" cy=\"262.5\" r=\"4.2\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"163.8\" cy=\"262.5\" r=\"4.2\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><rect x=\"135.6\" y=\"227.5\" width=\"8.8\" height=\"8.8\" rx=\"3.8\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><circle cx=\"119.4\" cy=\"210.0\" r=\"5.2\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"160.6\" cy=\"210.0\" r=\"5.2\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><g class=\"a6khd\"><circle cx=\"140.0\" cy=\"210.0\" r=\"20.0\" fill=\"#f6c9a0\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><path d=\"M120.0 207.5 Q116.2 185.0 140.0 185.0 Q163.8 185.0 160.0 207.5 Q152.5 200.0 145.0 203.8 Q137.5 200.0 130.0 203.8 Q125.0 200.0 120.0 207.5 Z\" fill=\"#4a3222\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><g class=\"a6key\"><ellipse cx=\"133.2\" cy=\"210.0\" rx=\"4.5\" ry=\"5.4\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"132.8\" cy=\"210.6\" r=\"2.5\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"134.4\" cy=\"208.4\" r=\"1.1\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><ellipse cx=\"146.8\" cy=\"210.0\" rx=\"4.5\" ry=\"5.4\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.0\"/><circle cx=\"147.2\" cy=\"210.6\" r=\"2.5\" fill=\"#2b2521\" stroke=\"#2b2521\" stroke-width=\"0.0\"/><circle cx=\"145.6\" cy=\"208.4\" r=\"1.1\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"0.0\"/></g><path d=\"M130.0 200.0 q3.8 -2.8 7.5 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><path d=\"M142.5 200.0 q3.8 -2.8 7.5 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.0\" stroke-linejoin=\"round\"/><ellipse cx=\"127.5\" cy=\"217.5\" rx=\"4.5\" ry=\"3.0\" fill=\"#f87171\" opacity=\"0.35\"/><ellipse cx=\"152.5\" cy=\"217.5\" rx=\"4.5\" ry=\"3.0\" fill=\"#f87171\" opacity=\"0.35\"/><path d=\"M134.4 220.0 q5.6 6.0 11.2 0\" fill=\"none\" stroke=\"#2b2521\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/></g><g class=\"a6b\"><rect x=\"230\" y=\"44\" width=\"420\" height=\"52\" rx=\"21.7\" fill=\"#ffffff\" stroke=\"#0ea5e9\" stroke-width=\"2.6\"/><path d=\"M252.0 96.0 L246.0 112.0 L276.0 96.0 Z\" fill=\"#ffffff\" stroke=\"#0ea5e9\" stroke-width=\"2.6\" stroke-linejoin=\"round\"/><text x=\"440.0\" y=\"75.8\" text-anchor=\"middle\" font-size=\"17\" font-family=\"Arial,sans-serif\" font-weight=\"700\" fill=\"#0c4a6e\">What is Mia like inside?</text></g><g class=\"a6t0\"><rect x=\"300\" y=\"120\" width=\"330\" height=\"34\" rx=\"17\" fill=\"#dcfce7\" stroke=\"#166534\" stroke-width=\"2.4\"/><text x=\"465.0\" y=\"142.0\" text-anchor=\"middle\" font-size=\"17\" font-family=\"Arial,sans-serif\" font-weight=\"700\" fill=\"#166534\">kind</text></g><g class=\"a6t1\"><rect x=\"300\" y=\"176\" width=\"330\" height=\"34\" rx=\"17\" fill=\"#dbeafe\" stroke=\"#1e40af\" stroke-width=\"2.4\"/><text x=\"465.0\" y=\"198.0\" text-anchor=\"middle\" font-size=\"17\" font-family=\"Arial,sans-serif\" font-weight=\"700\" fill=\"#1e40af\">brave</text></g><g class=\"a6t2\"><rect x=\"300\" y=\"232\" width=\"330\" height=\"34\" rx=\"17\" fill=\"#ffe4e6\" stroke=\"#9f1239\" stroke-width=\"2.4\"/><text x=\"465.0\" y=\"254.0\" text-anchor=\"middle\" font-size=\"17\" font-family=\"Arial,sans-serif\" font-weight=\"700\" fill=\"#9f1239\">worried</text></g><rect x=\"60\" y=\"290\" width=\"600\" height=\"34\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"360\" y=\"314\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#334155\" class=\"sb\">Traits say what a character is like. Feelings change as the story goes</text></g></svg>",
        "alt": "Animated cartoon: a boy in a blue shirt with a speech bubble asking what Mia is like inside, beside three cards reading kind, brave and worried, and a caption that traits stay while feelings change.",
        "caption": "Traits stay. Feelings change as the story goes."
      }
    },
    {
      "icon": "🗂",
      "title": "Retelling with a story map",
      "explain": "A story map is three boxes on a page. One box for the characters, one for the setting and one for the plot. You fill it in as you read, or straight after.\n\nUsing a map makes retelling easy because you always follow the same order: who, where, then what happened. Write a few words only. The map is a reminder, not the story. Then retell the story aloud from the map in your own words.\n\nRetelling is the best test of comprehension. If you can retell it, you understood it. If the retelling wobbles, go back to the story and find the part you missed.",
      "example": "Mia, the beach at sunset, and her hat blew into the sea until a dog fetched it. Three boxes, one story.",
      "notice": "Retelling is not copying sentences. Use your own words and keep to the order of events.",
      "check": {
        "type": "multiple_choice",
        "question": "Which order does a story map use?",
        "options": [
          "Plot, character, setting",
          "Characters, setting, plot",
          "Setting, plot, character",
          "Any order you like"
        ],
        "correct_index": 1,
        "explanation": "A story map goes who, where, then what happened."
      },
      "visual": {
        "svg": "<svg viewBox=\"0 0 720 330\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>@keyframes legA{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(26deg)}}@keyframes legB{0%,100%{transform:rotate(26deg)}50%{transform:rotate(-24deg)}}@keyframes armA{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-26deg)}}@keyframes armB{0%,100%{transform:rotate(-26deg)}50%{transform:rotate(22deg)}}@keyframes waveArm{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(-40deg)}}@keyframes wag{0%,100%{transform:rotate(-18deg)}50%{transform:rotate(18deg)}}@keyframes flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.4)}}@keyframes sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}@keyframes drift{0%{transform:translateX(-12px)}100%{transform:translateX(14px)}}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes bite{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.5)}}@keyframes rise{0%{transform:translateY(6px) scale(.6);opacity:0}18%{opacity:1}100%{transform:translateY(-54px) scale(1);opacity:0}}@keyframes fall{0%{transform:translateY(-14px);opacity:0}18%{opacity:1}100%{transform:translateY(26px);opacity:0}}@keyframes pop{0%{transform:scale(.5);opacity:0}55%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}@keyframes blink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}@keyframes ripple{0%,100%{transform:scaleX(1);opacity:.7}50%{transform:scaleX(1.2);opacity:1}}@keyframes float{0%{transform:translate(0,0)}50%{transform:translate(4px,-3px)}100%{transform:translate(-3px,2px)}}@keyframes jump{0%,100%{transform:translateY(0)}30%{transform:translateY(-14px)}}.a7b0{animation:pop .6s ease-out both;animation-delay:0.4s}.a7b1{animation:pop .6s ease-out both;animation-delay:0.9s}.a7b2{animation:pop .6s ease-out both;animation-delay:1.4s}.sb{font-family:Arial,sans-serif;font-weight:700}@media (prefers-reduced-motion:reduce){.scn *{animation:none !important}animate{display:none}}</style><g class=\"scn\"><rect x=\"0\" y=\"0\" width=\"720\" height=\"330\" rx=\"20\" fill=\"#f2fbf3\"/><rect x=\"40\" y=\"26\" width=\"640\" height=\"44\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"360\" y=\"55\" text-anchor=\"middle\" font-size=\"18\" font-weight=\"700\" fill=\"#1f2937\" class=\"sb\">Use a story map to retell a story</text><g class=\"a7b0\"><rect x=\"30\" y=\"92\" width=\"210\" height=\"120\" rx=\"14\" fill=\"#dbeafe\" stroke=\"#1e40af\" stroke-width=\"2.6\"/><text x=\"135\" y=\"140\" text-anchor=\"middle\" font-size=\"17\" font-family=\"Arial,sans-serif\" font-weight=\"700\" fill=\"#1e40af\">Character</text><path d=\"M70 176 h130\" stroke=\"#1e40af\" stroke-width=\"2\" stroke-dasharray=\"6 6\"/></g><g class=\"a7b1\"><rect x=\"260\" y=\"92\" width=\"210\" height=\"120\" rx=\"14\" fill=\"#dcfce7\" stroke=\"#166534\" stroke-width=\"2.6\"/><text x=\"365\" y=\"140\" text-anchor=\"middle\" font-size=\"17\" font-family=\"Arial,sans-serif\" font-weight=\"700\" fill=\"#166534\">Setting</text><path d=\"M300 176 h130\" stroke=\"#166534\" stroke-width=\"2\" stroke-dasharray=\"6 6\"/></g><g class=\"a7b2\"><rect x=\"490\" y=\"92\" width=\"210\" height=\"120\" rx=\"14\" fill=\"#ffedd5\" stroke=\"#9a3412\" stroke-width=\"2.6\"/><text x=\"595\" y=\"140\" text-anchor=\"middle\" font-size=\"17\" font-family=\"Arial,sans-serif\" font-weight=\"700\" fill=\"#9a3412\">Plot</text><path d=\"M530 176 h130\" stroke=\"#9a3412\" stroke-width=\"2\" stroke-dasharray=\"6 6\"/></g><rect x=\"200\" y=\"232\" width=\"320\" height=\"40\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"360\" y=\"258\" text-anchor=\"middle\" font-size=\"16\" font-weight=\"700\" fill=\"#334155\" class=\"sb\">Fill it in, then retell</text><rect x=\"120\" y=\"282\" width=\"480\" height=\"34\" rx=\"14\" fill=\"#e6dbff\" stroke=\"#52309c\" stroke-width=\"2.2\"/><text x=\"360\" y=\"306\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#52309c\" class=\"sb\">Retelling uses the elements in order</text></g></svg>",
        "alt": "Animated cartoon: three empty boxes labelled Character, Setting and Plot with dotted writing lines inside, and captions that say to fill it in then retell, and that retelling uses the elements in order.",
        "caption": "Fill in the three boxes, then retell the story in order."
      }
    },
    {
      "icon": "🔤",
      "title": "Spelling: vowel teams",
      "explain": "This week''s spelling focus is vowel teams. A vowel team is two vowels working together to make one vowel sound. The teams we are learning are ai, ay, ee, ea and oa.\n\nRain uses ai, play uses ay, see uses ee, eat uses ea and boat uses oa. The two letters work as a team, so you hear one sound and the team stays inside one syllable. That is why boat has one clap, not two.\n\nMemory tricks help you pick the right team. Ai and ay both say the same sound, but ay usually comes at the end of a word, as in play. Say the word, clap it, and listen for the vowel team before you choose the letters.",
      "example": "Boat has the vowel team oa in the middle, so it makes one vowel sound and one syllable.",
      "notice": "Do not split a vowel team into two syllables. Boat is one clap, not bo-at.",
      "check": {
        "type": "multiple_choice",
        "question": "Which word has a vowel team that makes one sound?",
        "options": [
          "boat",
          "table",
          "kitten",
          "rabbit"
        ],
        "correct_index": 0,
        "explanation": "In boat the letters oa work as one team and make one vowel sound."
      },
      "visual": {
        "svg": "<svg viewBox=\"0 0 720 330\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>@keyframes legA{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(26deg)}}@keyframes legB{0%,100%{transform:rotate(26deg)}50%{transform:rotate(-24deg)}}@keyframes armA{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-26deg)}}@keyframes armB{0%,100%{transform:rotate(-26deg)}50%{transform:rotate(22deg)}}@keyframes waveArm{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(-40deg)}}@keyframes wag{0%,100%{transform:rotate(-18deg)}50%{transform:rotate(18deg)}}@keyframes flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.4)}}@keyframes sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}@keyframes drift{0%{transform:translateX(-12px)}100%{transform:translateX(14px)}}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes bite{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.5)}}@keyframes rise{0%{transform:translateY(6px) scale(.6);opacity:0}18%{opacity:1}100%{transform:translateY(-54px) scale(1);opacity:0}}@keyframes fall{0%{transform:translateY(-14px);opacity:0}18%{opacity:1}100%{transform:translateY(26px);opacity:0}}@keyframes pop{0%{transform:scale(.5);opacity:0}55%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}@keyframes blink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}@keyframes ripple{0%,100%{transform:scaleX(1);opacity:.7}50%{transform:scaleX(1.2);opacity:1}}@keyframes float{0%{transform:translate(0,0)}50%{transform:translate(4px,-3px)}100%{transform:translate(-3px,2px)}}@keyframes jump{0%,100%{transform:translateY(0)}30%{transform:translateY(-14px)}}.sb{font-family:Arial,sans-serif;font-weight:700}.st{font-family:Arial,sans-serif}@media (prefers-reduced-motion:reduce){.scn *{animation:none !important}animate{display:none}}</style><g class=\"scn\"><rect x=\"0\" y=\"0\" width=\"720\" height=\"330\" rx=\"20\" fill=\"#fffaf2\"/><rect x=\"40\" y=\"26\" width=\"640\" height=\"44\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"360\" y=\"55\" text-anchor=\"middle\" font-size=\"18\" font-weight=\"700\" fill=\"#1f2937\" class=\"sb\">Vowel teams: two vowels working together</text><rect x=\"60\" y=\"84\" width=\"150\" height=\"36\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"135\" y=\"110\" text-anchor=\"middle\" font-size=\"19\" font-weight=\"700\" fill=\"#1f2937\" class=\"sb\">rain</text><rect x=\"228\" y=\"84\" width=\"150\" height=\"36\" rx=\"14\" fill=\"#fff1c9\" stroke=\"#f59e0b\" stroke-width=\"2.4\"/><text x=\"303\" y=\"110\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#8a3d0f\" class=\"sb\">vowel team: ai</text><circle cx=\"425\" cy=\"102\" r=\"13\" fill=\"#3b82f6\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><text x=\"425\" y=\"107\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#ffffff\" class=\"sb\">1</text><text x=\"468\" y=\"109\" text-anchor=\"start\" font-size=\"15\" font-weight=\"700\" fill=\"#334155\" class=\"st\">1 sound</text><rect x=\"60\" y=\"124\" width=\"150\" height=\"36\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"135\" y=\"150\" text-anchor=\"middle\" font-size=\"19\" font-weight=\"700\" fill=\"#1f2937\" class=\"sb\">play</text><rect x=\"228\" y=\"124\" width=\"150\" height=\"36\" rx=\"14\" fill=\"#fff1c9\" stroke=\"#f59e0b\" stroke-width=\"2.4\"/><text x=\"303\" y=\"150\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#8a3d0f\" class=\"sb\">vowel team: ay</text><circle cx=\"425\" cy=\"142\" r=\"13\" fill=\"#166534\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><text x=\"425\" y=\"147\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#ffffff\" class=\"sb\">1</text><text x=\"468\" y=\"149\" text-anchor=\"start\" font-size=\"15\" font-weight=\"700\" fill=\"#334155\" class=\"st\">1 sound</text><rect x=\"60\" y=\"164\" width=\"150\" height=\"36\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"135\" y=\"190\" text-anchor=\"middle\" font-size=\"19\" font-weight=\"700\" fill=\"#1f2937\" class=\"sb\">see</text><rect x=\"228\" y=\"164\" width=\"150\" height=\"36\" rx=\"14\" fill=\"#fff1c9\" stroke=\"#f59e0b\" stroke-width=\"2.4\"/><text x=\"303\" y=\"190\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#8a3d0f\" class=\"sb\">vowel team: ee</text><circle cx=\"425\" cy=\"182\" r=\"13\" fill=\"#7c3aed\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><text x=\"425\" y=\"187\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#ffffff\" class=\"sb\">1</text><text x=\"468\" y=\"189\" text-anchor=\"start\" font-size=\"15\" font-weight=\"700\" fill=\"#334155\" class=\"st\">1 sound</text><rect x=\"60\" y=\"204\" width=\"150\" height=\"36\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"135\" y=\"230\" text-anchor=\"middle\" font-size=\"19\" font-weight=\"700\" fill=\"#1f2937\" class=\"sb\">boat</text><rect x=\"228\" y=\"204\" width=\"150\" height=\"36\" rx=\"14\" fill=\"#fff1c9\" stroke=\"#f59e0b\" stroke-width=\"2.4\"/><text x=\"303\" y=\"230\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#8a3d0f\" class=\"sb\">vowel team: oa</text><circle cx=\"425\" cy=\"222\" r=\"13\" fill=\"#ea580c\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><text x=\"425\" y=\"227\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#ffffff\" class=\"sb\">1</text><text x=\"468\" y=\"229\" text-anchor=\"start\" font-size=\"15\" font-weight=\"700\" fill=\"#334155\" class=\"st\">1 sound</text><rect x=\"60\" y=\"244\" width=\"150\" height=\"36\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"135\" y=\"270\" text-anchor=\"middle\" font-size=\"19\" font-weight=\"700\" fill=\"#1f2937\" class=\"sb\">eat</text><rect x=\"228\" y=\"244\" width=\"150\" height=\"36\" rx=\"14\" fill=\"#fff1c9\" stroke=\"#f59e0b\" stroke-width=\"2.4\"/><text x=\"303\" y=\"270\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#8a3d0f\" class=\"sb\">vowel team: ea</text><circle cx=\"425\" cy=\"262\" r=\"13\" fill=\"#be123c\" stroke=\"#2b2521\" stroke-width=\"2.2\"/><text x=\"425\" y=\"267\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#ffffff\" class=\"sb\">1</text><text x=\"468\" y=\"269\" text-anchor=\"start\" font-size=\"15\" font-weight=\"700\" fill=\"#334155\" class=\"st\">1 sound</text><rect x=\"590\" y=\"150\" width=\"110\" height=\"110\" rx=\"14\" fill=\"#dcfce7\" stroke=\"#166534\" stroke-width=\"2.6\"/><text x=\"620\" y=\"196\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#166534\" class=\"sb\">long</text><text x=\"620\" y=\"216\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#166534\" class=\"sb\">vowel</text><rect x=\"60\" y=\"296\" width=\"600\" height=\"26\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"360\" y=\"314\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"700\" fill=\"#334155\" class=\"st\">A vowel team makes one vowel sound, so it stays in one syllable</text></g></svg>",
        "alt": "Animated cartoon: five word cards reading rain, play, see, boat and eat, each beside a card naming its vowel team ai, ay, ee, oa and ea, with beat dots showing one sound each and a card reading long vowel.",
        "caption": "Two vowels, one sound: ai, ay, ee, ea and oa."
      }
    }
  ],
  "worked_example": "I do: watch me find the elements in a short story. Mia ran along the beach at sunset, looking for her red hat. A wave rolled in and took it, so a friendly dog swam out and brought it back. First I ask who it is about, and the answer is Mia and the dog, so those are the characters. Then I ask where and when: a beach at sunset, so that is the setting. Then I ask what happened, in order: Mia lost her hat, the wave took it, the dog fetched it. That is the plot.\n\nWe do: you read the first line of the story in your book this week, and we will find the who and the where together. I will write the character in the first box and you write the setting in the second.\n\nYou do: on your own, read your story and fill in all three boxes of the story map. Then retell the story to your grown-up using only your map, in your own words.",
  "worked_visuals": [
    {
      "svg": "<svg viewBox=\"0 0 720 330\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>@keyframes legA{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(26deg)}}@keyframes legB{0%,100%{transform:rotate(26deg)}50%{transform:rotate(-24deg)}}@keyframes armA{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-26deg)}}@keyframes armB{0%,100%{transform:rotate(-26deg)}50%{transform:rotate(22deg)}}@keyframes waveArm{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(-40deg)}}@keyframes wag{0%,100%{transform:rotate(-18deg)}50%{transform:rotate(18deg)}}@keyframes flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.4)}}@keyframes sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}@keyframes drift{0%{transform:translateX(-12px)}100%{transform:translateX(14px)}}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes bite{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.5)}}@keyframes rise{0%{transform:translateY(6px) scale(.6);opacity:0}18%{opacity:1}100%{transform:translateY(-54px) scale(1);opacity:0}}@keyframes fall{0%{transform:translateY(-14px);opacity:0}18%{opacity:1}100%{transform:translateY(26px);opacity:0}}@keyframes pop{0%{transform:scale(.5);opacity:0}55%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}@keyframes blink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}@keyframes ripple{0%,100%{transform:scaleX(1);opacity:.7}50%{transform:scaleX(1.2);opacity:1}}@keyframes float{0%{transform:translate(0,0)}50%{transform:translate(4px,-3px)}100%{transform:translate(-3px,2px)}}@keyframes jump{0%,100%{transform:translateY(0)}30%{transform:translateY(-14px)}}.w1k0{animation:pop .5s ease-out both;animation-delay:0.4s}.w1k1{animation:pop .5s ease-out both;animation-delay:0.9s}.w1k2{animation:pop .5s ease-out both;animation-delay:1.4s}.sb{font-family:Arial,sans-serif;font-weight:700}.st{font-family:Arial,sans-serif}@media (prefers-reduced-motion:reduce){.scn *{animation:none !important}animate{display:none}}</style><g class=\"scn\"><rect x=\"0\" y=\"0\" width=\"720\" height=\"330\" rx=\"20\" fill=\"#f8fafc\"/><rect x=\"24\" y=\"24\" width=\"672\" height=\"44\" rx=\"14\" fill=\"#ffffff\" stroke=\"#2b2521\" stroke-width=\"2.6\"/><text x=\"360\" y=\"53\" text-anchor=\"middle\" font-size=\"18\" font-weight=\"700\" fill=\"#1f2937\" class=\"sb\">The Lost Hat: a story map</text><rect x=\"24\" y=\"86\" width=\"672\" height=\"62\" rx=\"14\" fill=\"#dbeafe\" stroke=\"#1e40af\" stroke-width=\"2.6\"/><text x=\"56\" y=\"124\" text-anchor=\"start\" font-size=\"17\" font-weight=\"700\" fill=\"#1e40af\" class=\"sb\">Character</text><text x=\"220\" y=\"124\" text-anchor=\"start\" font-size=\"16\" font-weight=\"700\" fill=\"#1f2937\" class=\"st\">Mia</text><g class=\"w1k0\"><path d=\"M646 110 l8 8 16-20\" fill=\"none\" stroke=\"#15803d\" stroke-width=\"4\" stroke-linecap=\"round\"/></g><rect x=\"24\" y=\"160\" width=\"672\" height=\"62\" rx=\"14\" fill=\"#dcfce7\" stroke=\"#166534\" stroke-width=\"2.6\"/><text x=\"56\" y=\"198\" text-anchor=\"start\" font-size=\"17\" font-weight=\"700\" fill=\"#166534\" class=\"sb\">Setting</text><text x=\"220\" y=\"198\" text-anchor=\"start\" font-size=\"16\" font-weight=\"700\" fill=\"#1f2937\" class=\"st\">the beach at sunset</text><g class=\"w1k1\"><path d=\"M646 184 l8 8 16-20\" fill=\"none\" stroke=\"#15803d\" stroke-width=\"4\" stroke-linecap=\"round\"/></g><rect x=\"24\" y=\"234\" width=\"672\" height=\"62\" rx=\"14\" fill=\"#ffedd5\" stroke=\"#9a3412\" stroke-width=\"2.6\"/><text x=\"56\" y=\"272\" text-anchor=\"start\" font-size=\"17\" font-weight=\"700\" fill=\"#9a3412\" class=\"sb\">Plot</text><text x=\"220\" y=\"272\" text-anchor=\"start\" font-size=\"16\" font-weight=\"700\" fill=\"#1f2937\" class=\"st\">her hat blew into the sea, then a dog brought it back</text><g class=\"w1k2\"><path d=\"M646 258 l8 8 16-20\" fill=\"none\" stroke=\"#15803d\" stroke-width=\"4\" stroke-linecap=\"round\"/></g><text x=\"360\" y=\"314\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#334155\" class=\"st\">All three elements, or the story will not make sense</text></g></svg>",
      "alt": "Animated cartoon: a completed story map for The Lost Hat with three ticked rows reading Character Mia, Setting the beach at sunset, and Plot her hat blew into the sea then a dog brought it back.",
      "caption": "A completed story map: who, where, and what happened in order."
    },
    {
      "svg": "<svg viewBox=\"0 0 720 320\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>@keyframes legA{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(26deg)}}@keyframes legB{0%,100%{transform:rotate(26deg)}50%{transform:rotate(-24deg)}}@keyframes armA{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-26deg)}}@keyframes armB{0%,100%{transform:rotate(-26deg)}50%{transform:rotate(22deg)}}@keyframes waveArm{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(-40deg)}}@keyframes wag{0%,100%{transform:rotate(-18deg)}50%{transform:rotate(18deg)}}@keyframes flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.4)}}@keyframes sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}@keyframes drift{0%{transform:translateX(-12px)}100%{transform:translateX(14px)}}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes bite{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.5)}}@keyframes rise{0%{transform:translateY(6px) scale(.6);opacity:0}18%{opacity:1}100%{transform:translateY(-54px) scale(1);opacity:0}}@keyframes fall{0%{transform:translateY(-14px);opacity:0}18%{opacity:1}100%{transform:translateY(26px);opacity:0}}@keyframes pop{0%{transform:scale(.5);opacity:0}55%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}@keyframes blink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}@keyframes ripple{0%,100%{transform:scaleX(1);opacity:.7}50%{transform:scaleX(1.2);opacity:1}}@keyframes float{0%{transform:translate(0,0)}50%{transform:translate(4px,-3px)}100%{transform:translate(-3px,2px)}}@keyframes jump{0%,100%{transform:translateY(0)}30%{transform:translateY(-14px)}}.w2a{animation:pop .5s ease-out both;animation-delay:.6s}.w2b{animation:pop .5s ease-out both;animation-delay:1.2s}.sb{font-family:Arial,sans-serif;font-weight:700}.st{font-family:Arial,sans-serif}@media (prefers-reduced-motion:reduce){.scn *{animation:none !important}animate{display:none}}</style><g class=\"scn\"><rect x=\"0\" y=\"0\" width=\"720\" height=\"320\" rx=\"20\" fill=\"#f8fafc\"/><rect x=\"30\" y=\"26\" width=\"660\" height=\"124\" rx=\"14\" fill=\"#dcfce7\" stroke=\"#166534\" stroke-width=\"2.6\"/><text x=\"60\" y=\"70\" text-anchor=\"start\" font-size=\"22\" font-weight=\"700\" fill=\"#166534\" class=\"sb\">the timid mouse</text><text x=\"60\" y=\"102\" text-anchor=\"start\" font-size=\"15\" font-weight=\"700\" fill=\"#475569\" class=\"st\">this names a character, so it is a story element</text><rect x=\"30\" y=\"170\" width=\"660\" height=\"124\" rx=\"14\" fill=\"#ffe4e6\" stroke=\"#9f1239\" stroke-width=\"2.6\"/><text x=\"60\" y=\"214\" text-anchor=\"start\" font-size=\"22\" font-weight=\"700\" fill=\"#9f1239\" class=\"sb\">the mouse squeaked</text><text x=\"60\" y=\"246\" text-anchor=\"start\" font-size=\"15\" font-weight=\"700\" fill=\"#475569\" class=\"st\">this tells what happened, so it is part of the plot, not a character</text><g class=\"w2a\"><path d=\"M630 70 l9 9 18-22\" fill=\"none\" stroke=\"#15803d\" stroke-width=\"5\" stroke-linecap=\"round\"/></g><g class=\"w2b\"><path d=\"M630 214 l20 20 m0-20 l-20 20\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"5\" stroke-linecap=\"round\"/></g></g></svg>",
      "alt": "Animated cartoon: two cards, the top one showing the phrase the timid mouse in green with a tick and the note that it names a character, the bottom one showing the mouse squeaked in red with a cross and the note that this is part of the plot.",
      "caption": "A character is who the story is about. What they do belongs to the plot."
    }
  ],
  "guided_practice": "Part A: Name the characters. Read this line and list the characters: Mia and her brother Tom ran to the beach, and their dog Bud followed.\nHint: characters are the who. There are three of them.\nAnswer: Mia, Tom and Bud.\n\nPart B: Describe the setting. Write where and when for this line: At midnight the old lighthouse creaked in the wind.\nHint: the setting has two parts, a place and a time.\nAnswer: where, an old lighthouse. When, midnight.\n\nPart C: Put the plot in order. These events are muddled. Number them 1, 2 and 3 in the order they happen.\nA dog brought the hat back. Mia lost her hat. A wave took it out to sea.\nHint: the problem comes before the solution.\nAnswer: 1 Mia lost her hat, 2 a wave took it out to sea, 3 a dog brought the hat back.\n\nPart D: Spelling, vowel teams. Fill in the missing vowel team in each word.\n1. r __ n (rain)  2. pl __ (play)  3. s __ (see)  4. b __ t (boat)  5. __ t (eat)\nHint: ay usually comes at the end of a word, and ai usually sits inside it.\nAnswer: rain ai, play ay, see ee, boat oa, eat ea.",
  "independent_task": "Read your story for this week first, then work through the parts. Write your answers in your book.\n\nPart 1: List the characters in your story and say which one is the main character.\n\nPart 2: Write the setting. Write the place and the time.\n\nPart 3: Write the plot in three lines. Line one, what happened first. Line two, the problem. Line three, how it was solved.\n\nPart 4: Write one trait and one feeling for the main character, and explain what in the story showed you each one.\n\nPart 5: On paper, draw a story map with three boxes and fill it in with a few words each.\n\nPart 6: Sort these into characters, settings and plot events.\n4. a dark cave  5. Mia  6. the hat blew into the sea  7. Bud the dog  8. a beach at sunset  9. the dog swam out\n\nPart 7: Spelling sentences. Write a sentence for each word.\n10. rain  11. play  12. boat\n\nResponse prompt: which story element was hardest to find in your story, and what clue helped you in the end?",
  "response_prompt": "Which story element was hardest to find in your story, and what clue helped you in the end?",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "Which three parts make up a story?",
      "options": [
        "Characters, setting and plot",
        "Title, page and cover",
        "Who, why and when",
        "Start, stop and finish"
      ],
      "correct_index": 0,
      "explanation": "Every story has characters, a setting and a plot."
    },
    {
      "type": "multiple_choice",
      "question": "What is the setting of a story?",
      "options": [
        "Who the story is about",
        "Where and when the story happens",
        "What the problem is",
        "The last sentence"
      ],
      "correct_index": 1,
      "explanation": "The setting is where and when, not just where."
    },
    {
      "type": "multiple_choice",
      "question": "What is the plot of a story?",
      "options": [
        "What happens, in order",
        "Where it happens",
        "Who it is about",
        "How long it is"
      ],
      "correct_index": 0,
      "explanation": "The plot is the events of the story in the order they happen."
    },
    {
      "type": "multiple_choice",
      "question": "In a story about a lost hat, which is a character?",
      "options": [
        "A beach at sunset",
        "Mia and her dog Bud",
        "She lost her hat",
        "The wind was cold"
      ],
      "correct_index": 1,
      "explanation": "Characters are the who. Mia and Bud are who the story is about."
    },
    {
      "type": "multiple_choice",
      "question": "Which sentence describes a setting?",
      "options": [
        "Mia felt worried",
        "The dog fetched the hat",
        "A beach at sunset",
        "She searched all afternoon"
      ],
      "correct_index": 2,
      "explanation": "A beach at sunset tells you where and when, so it is the setting."
    },
    {
      "type": "multiple_choice",
      "question": "What is a trait?",
      "options": [
        "Something a character is always like",
        "Something a character feels for a moment",
        "The place a story happens",
        "The order of events"
      ],
      "correct_index": 0,
      "explanation": "A trait stays with the character. A feeling changes."
    },
    {
      "type": "multiple_choice",
      "question": "Mia feels worried when her hat blows away, but she is usually brave. What is the trait?",
      "options": [
        "Worried",
        "Brave",
        "The hat",
        "The beach"
      ],
      "correct_index": 1,
      "explanation": "Brave is what she is always like, so it is the trait. Worried is the feeling at that moment."
    },
    {
      "type": "multiple_choice",
      "question": "What is a story map for?",
      "options": [
        "Retelling the story in order",
        "Making the story longer",
        "Drawing the characters",
        "Counting the pages"
      ],
      "correct_index": 0,
      "explanation": "A story map holds the elements so you can retell the story in order."
    },
    {
      "type": "multiple_choice",
      "question": "Which word contains a vowel team?",
      "options": [
        "play",
        "cat",
        "strip",
        "jump"
      ],
      "correct_index": 0,
      "explanation": "In play the letters ay work as a team to make one vowel sound."
    },
    {
      "type": "multiple_choice",
      "question": "How many vowel sounds are in the word boat?",
      "options": [
        "2",
        "3",
        "1",
        "4"
      ],
      "correct_index": 2,
      "explanation": "The vowel team oa makes one sound, so boat has one vowel sound."
    }
  ],
  "word_challenges": [
    {
      "type": "multiple_choice",
      "question": "What does the word character mean in a story?",
      "options": [
        "A person or animal the story is about",
        "The place a story happens",
        "The order of events",
        "The last page"
      ],
      "correct_index": 0,
      "explanation": "Characters are the who of the story."
    },
    {
      "type": "multiple_choice",
      "question": "What does setting mean in a story?",
      "options": [
        "Where and when the story happens",
        "Who the story is about",
        "What the problem is",
        "The title"
      ],
      "correct_index": 0,
      "explanation": "Setting is the place and the time of the story."
    },
    {
      "type": "multiple_choice",
      "question": "What does plot mean in a story?",
      "options": [
        "The events, in order",
        "The place",
        "The characters",
        "The cover"
      ],
      "correct_index": 0,
      "explanation": "The plot is what happens, in the order it happens."
    },
    {
      "type": "multiple_choice",
      "question": "What does retell mean?",
      "options": [
        "Tell the story again in your own words",
        "Copy the story word for word",
        "Read the story faster",
        "Draw the story"
      ],
      "correct_index": 0,
      "explanation": "A retelling uses your own words and keeps the order."
    },
    {
      "type": "multiple_choice",
      "question": "Which word is spelt correctly?",
      "options": [
        "rain",
        "rane",
        "rayn",
        "reain"
      ],
      "correct_index": 0,
      "explanation": "Rain uses the vowel team ai."
    },
    {
      "type": "multiple_choice",
      "question": "Which word is spelt correctly?",
      "options": [
        "play",
        "plai",
        "pley",
        "plaey"
      ],
      "correct_index": 0,
      "explanation": "Play uses the vowel team ay, which usually comes at the end."
    },
    {
      "type": "multiple_choice",
      "question": "Which word is spelt correctly?",
      "options": [
        "boat",
        "bote",
        "bowt",
        "baot"
      ],
      "correct_index": 0,
      "explanation": "Boat uses the vowel team oa."
    },
    {
      "type": "multiple_choice",
      "question": "Which word is spelt correctly?",
      "options": [
        "eat",
        "ete",
        "eet",
        "ate"
      ],
      "correct_index": 0,
      "explanation": "Eat uses the vowel team ea."
    }
  ],
  "sort_activity": {
    "instructions": "Read each item, then sort it into characters, settings or plot events.",
    "buckets": [
      "Characters",
      "Settings",
      "Plot events"
    ],
    "items": [
      {
        "text": "Mia",
        "answer": 0
      },
      {
        "text": "Bud the dog",
        "answer": 0
      },
      {
        "text": "the guide",
        "answer": 0
      },
      {
        "text": "a beach at sunset",
        "answer": 1
      },
      {
        "text": "a dark cave",
        "answer": 1
      },
      {
        "text": "a busy school",
        "answer": 1
      },
      {
        "text": "the hat blew into the sea",
        "answer": 2
      },
      {
        "text": "the dog swam out to fetch it",
        "answer": 2
      }
    ]
  },
  "interactive_activities": [
    {
      "type": "flip_cards",
      "title": "Story detective words",
      "cards": [
        {
          "front": "character",
          "back": "a person or animal the story is about"
        },
        {
          "front": "setting",
          "back": "where and when the story happens"
        },
        {
          "front": "plot",
          "back": "what happens in the story, in order"
        },
        {
          "front": "element",
          "back": "one of the building blocks of a story"
        },
        {
          "front": "trait",
          "back": "something a character is always like, such as kind or brave"
        },
        {
          "front": "feeling",
          "back": "how a character feels at one moment, which can change"
        },
        {
          "front": "retell",
          "back": "tell the story again in your own words"
        },
        {
          "front": "story map",
          "back": "three boxes for who, where and what happened"
        }
      ]
    }
  ],
  "spelling": {
    "focus": "Vowel teams: ai, ay, ee, ea, oa",
    "teaching": "This week we are learning vowel teams. A vowel team is two vowels working together to make one vowel sound.\n\nSay each word and listen for the single sound the team makes: rain, play, see, eat, boat. The team stays inside one syllable, so boat claps once.\n\nTwo teams can make the same sound. Ai and ay both say the long a sound, but ay usually comes at the end of a word, as in play, and ai usually sits inside, as in rain.\n\nPractise each word until you can spell it correctly ten times in a row.",
    "words": [
      {
        "word": "rain",
        "parts": "r - ai - n",
        "tip": "ai sits inside the word and makes one long a sound"
      },
      {
        "word": "play",
        "parts": "pl - ay",
        "tip": "ay usually comes at the end of a word"
      },
      {
        "word": "see",
        "parts": "s - ee",
        "tip": "ee makes the long e sound"
      },
      {
        "word": "eat",
        "parts": "ea - t",
        "tip": "ea makes the long e sound at the start of this word"
      },
      {
        "word": "boat",
        "parts": "b - oa - t",
        "tip": "oa makes the long o sound, so boat claps once"
      },
      {
        "word": "wait",
        "parts": "w - ai - t",
        "tip": "ai inside the word again, just like rain"
      },
      {
        "word": "green",
        "parts": "gr - ee - n",
        "tip": "ee in the middle makes one long e sound"
      },
      {
        "word": "sea",
        "parts": "s - ea",
        "tip": "ea at the end, and it rhymes with see"
      }
    ],
    "check": [
      {
        "type": "multiple_choice",
        "question": "Which word is spelt correctly?",
        "options": [
          "rain",
          "rane",
          "rayn"
        ],
        "correct_index": 0,
        "explanation": "Rain uses the vowel team ai."
      },
      {
        "type": "multiple_choice",
        "question": "Which team usually comes at the end of a word?",
        "options": [
          "ai",
          "ay"
        ],
        "correct_index": 1,
        "explanation": "Ay usually comes at the end, as in play."
      },
      {
        "type": "multiple_choice",
        "question": "How many syllables are in the word boat?",
        "options": [
          "1",
          "2"
        ],
        "correct_index": 0,
        "explanation": "The vowel team oa makes one vowel sound, so boat has one syllable."
      }
    ]
  },
  "hoard_words": [
    "rain",
    "play",
    "see",
    "eat",
    "boat",
    "wait",
    "green",
    "sea"
  ],
  "coming_soon": null,
  "parent_notes": "Rationale: story elements are the foundation of reading comprehension, and naming them gives a child a concrete way into any narrative. This lesson teaches the three elements, then moves to the finer distinctions that Year 3 readers need: character traits compared with feelings, and the order of plot events. The story map is the tool that ties it together, because filling one in is proof of comprehension.\n\nAssessment notes: the reading texts are chosen by you at the time, so the guided practice uses short lines supplied in the lesson and the main task uses your child''s own book. Listen for a retelling that keeps the order of events and uses the elements as its structure. Accept any trait supported by something the character did, and accept a feeling if your child can say when it changed. The quiz has ten questions and a score of nine or more shows the lesson has landed. If retelling is still shaky, ask for it orally before expecting it in writing.",
  "explicit_teaching": "**The big idea.** Comprehension improves quickly once a reader has a frame to hang a story on. Characters, setting and plot are that frame. This lesson teaches the three elements, then sharpens two things Year 3 readers often confuse: the difference between a trait and a feeling, and the importance of the order of events. The story map at the end turns all of it into a tool your child can use for any story, including the book they are reading this week.\n\n**How to open the lesson.** Do not start with the words character, setting and plot. Ask your child to tell you about the last story or film they enjoyed, and then ask three questions: who was it about, where did it happen, and what happened. Their answers are the elements. Only then give the three labels, and praise the retelling they just produced.\n\n**Characters and what they want.** Characters are the who of a story, and the useful question is not only who is in it but what they want. Ask your child to name the main character and say what that character is trying to do. This is the fastest way to move a reader from listing names to understanding a story. Watch for children naming every person mentioned, including people who do not matter; gently narrow it to the characters who affect what happens.\n\n**Setting, and why it is more than background.** The setting is where and when, and both halves matter. A beach is different at midday and at midnight. Setting also constrains what characters can do, which is why readers who notice it can predict. Encourage your child to find a setting clue in the first paragraph, because writers usually place it there on purpose. If they cannot find the when, ask whether the story says anything about light, weather, seasons or school.\n\n**Plot, order and problem.** The plot is the events in order. Three questions carry it: what is the problem, what does the main character try, how is it solved. Practise ordering by muddling three events from a familiar story and asking your child to number them. This is also where comprehension breaks down most often, so if your child can order events, they are reading well.\n\n**Traits and feelings.** A trait stays. A feeling changes. Mia can be brave, which is her trait, and still feel worried when her hat blows away, which is a feeling at that moment. Teach your child to point at the evidence: what did the character do or say that showed this. Accept any trait that is supported by the text, and beware of turning one worried moment into a whole personality.\n\n**The story map and retelling.** Three boxes, who, where and what happened, filled in with a few words each. The map is not the story. It is a set of hooks. Then retell aloud from the map in your own words. Retelling is the best comprehension check you can run, and it takes two minutes. If the retelling is out of order, the child has understood the pieces but not the shape, so reread the middle together.\n\n**The spelling work and this week''s vowel teams.** The focus is ai, ay, ee, ea and oa, the teams that make long vowel sounds. Show your child that two teams can make the same sound: ai sits inside a word, as in rain, and ay comes at the end, as in play. Say each word and clap it, and check that a team stays inside one syllable, so boat claps once, not twice. In the spelling stage your child sees and hears each word, then types it, and a word is mastered after ten correct spellings in a row.\n\n**Reading together, and what to ask.** The fastest way to teach story elements is to read aloud to your child and pause once or twice to ask a question. Keep the questions to the three elements: who is this about, where are they, and what has happened so far. Resist asking about every detail, because the goal is a frame, not a quiz. When your child reads to you, ask the same three questions at the end and let them answer from memory before looking back.\n\n**How to know it has worked.** The clearest sign is a child who offers the who, where and what happened without being prompted, and whose retelling keeps the order straight. A second sign is noticing a trait and pointing at the evidence for it, such as saying the character was generous because they shared. Both habits transfer to every text they read, including information books where the who and where become the topic and the context. Revisit the story map whenever a new book begins, and keep the three questions on hand. Story elements also feed directly into the writing lessons this week, because a child who can find the elements in a story is already halfway to planning one of their own.**What to watch for, and how to fix it.** If your child lists characters but cannot say what happens, ask what the problem was. If they retell the ending first, have them sort three events from the story into order. If the setting is missing, point at the first sentence and reread it together. If traits and feelings are muddled, ask what the character is like when nothing is going wrong. Keep the reading text easy for this lesson so the thinking is about the elements, not about decoding hard words.",
  "evidence_instructions": "Keep the completed story map and the written retelling from the main task. The map is the clearest evidence of comprehension, and a photo of it is enough.",
  "offline_alternative": "Everything works without a device. Use the printed pages or write the parts out by hand, and read the story aloud together instead of watching anything.",
  "extension": "Read a second short story and make a second story map, then tell your grown-up which of the two stories had the more interesting setting and why.",
  "planner_title": "Plan your story map",
  "planner_intro": "Read your story first, then fill in the three boxes with a few words each.",
  "planner_fields": [
    {
      "key": "chars",
      "label": "Characters",
      "hint": "who the story is about, and which one is the main character"
    },
    {
      "key": "setting",
      "label": "Setting",
      "hint": "where it happens and when, for example a beach at sunset"
    },
    {
      "key": "plot",
      "label": "Plot",
      "hint": "what happened, in order, including how the problem was solved"
    }
  ],
  "glossary": [
    [
      "character",
      "a person or animal the story is about"
    ],
    [
      "setting",
      "where and when the story happens"
    ],
    [
      "plot",
      "what happens in the story, in order"
    ],
    [
      "element",
      "one of the building blocks of a story"
    ],
    [
      "trait",
      "something a character is always like"
    ],
    [
      "feeling",
      "how a character feels at one moment"
    ],
    [
      "retell",
      "tell the story again in your own words"
    ],
    [
      "story map",
      "three boxes for who, where and what happened"
    ]
  ],
  "common_mistakes": [
    [
      "Listing every name in the story as a character",
      "Ask which characters actually change what happens."
    ],
    [
      "Confusing the plot with the setting",
      "Ask what happened, in order, rather than where it happened."
    ],
    [
      "Treating one feeling as the character''s whole personality",
      "Ask what the character is like when nothing is going wrong."
    ],
    [
      "Retelling the events out of order",
      "Sort three events from the story into order before retelling."
    ],
    [
      "Splitting a vowel team into two syllables",
      "Clap it: boat is one clap because oa makes one sound."
    ]
  ],
  "answer_key": "Guided practice: Part A characters Mia, Tom and Bud. Part B where, an old lighthouse, when, midnight. Part C 1 Mia lost her hat, 2 a wave took it out to sea, 3 a dog brought the hat back. Part D rain ai, play ay, see ee, boat oa, eat ea.\n\nIndependent task: Parts 1 to 5 depend on the story your child is reading, so check that the map has a who, a where and when, and events in order. Part 4 needs a trait with evidence, such as sharing a lunch showing kindness. Part 6 characters Mia and Bud the dog, settings a dark cave and a beach at sunset, plot events the hat blew into the sea and the dog swam out. Part 7 sentences must spell rain, play and boat correctly.\n\nQuiz answers: 1A, 2B, 3A, 4B, 5C, 6A, 7B, 8A, 9A, 10C.",
  "parent_check": "Listen for a retelling that keeps the order of events and names who, where and what happened. Accept any trait your child can support from the story. Mark the quiz out of ten; nine or more means the elements are secure.",
  "self_check": "By the end of this lesson you should have named the characters, described the setting with a place and a time, written the plot in order, told a trait from a feeling, filled in a story map and retold your story from it.",
  "resources": [
    {
      "type": "video",
      "title": "Story Elements Song: character, setting and plot (Swick''s Classroom)",
      "embed_url": "https://www.youtube.com/embed/m3WHmmYTHeE",
      "prompt": "Watch this before you read your story. Listen for the three elements.",
      "check": {
        "type": "multiple_choice",
        "question": "Which three elements does the song name?",
        "options": [
          "Character, setting and plot",
          "Noun, verb and adjective",
          "Who, why and how",
          "Start, middle and stop"
        ],
        "correct_index": 0,
        "explanation": "The song names the three story elements: character, setting and plot."
      }
    },
    {
      "type": "video",
      "title": "Plot Mountain! (Scratch Garden)",
      "embed_url": "https://www.youtube.com/embed/NpWHZJZQDSE",
      "prompt": "This song shows how a plot climbs and then settles. Notice where the problem is biggest.",
      "check": {
        "type": "multiple_choice",
        "question": "On a plot mountain, where is the biggest problem?",
        "options": [
          "Near the top",
          "At the very start",
          "After the story ends",
          "There is no problem"
        ],
        "correct_index": 0,
        "explanation": "A plot mountain climbs towards the biggest problem near the top, then settles as it is solved."
      }
    }
  ]
}'),
    title = 'Year 3, Week 2, Lesson 1: Story elements: character, setting and plot'
WHERE seed_key = 's2-eng-y3-w02-l1';
