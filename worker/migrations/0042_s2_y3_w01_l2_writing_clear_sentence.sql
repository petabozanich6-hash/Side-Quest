-- Year 3, Week 1, Lesson 2: Writing a clear sentence.
-- Rebuilds the coming-soon placeholder on seed_key s2-eng-y3-w01-l2 into a full lesson.
-- json_patch merges these fields into the existing data; keys set to null are removed
-- (this is how coming_soon and source_note are cleared).
-- All inline SVG visuals are original and are rendered by QuestVisual through
-- teach_steps[].visual / visual_before, worked_visuals and the child flip-card activity.
-- Each SVG sets a viewBox, uses text of at least 15px, keeps a static final state under
-- prefers-reduced-motion, and stays under about 12 KB.
-- Outcomes: EN2-CWT-01 (Creating written texts, Stage 2 English K-10 2022) is addressed.
-- The placeholder also carried EN2-UARL-01, but a sentence-construction lesson does not
-- address responding to literature, so that outcome is not claimed here. Re-check the
-- code against the current NESA syllabus before curriculum release.
UPDATE lessons
SET data = json_patch(data, '{
  "coming_soon": null,
  "source_note": null,
  "duration_minutes": 45,
  "outcome_codes": [
    "EN2-CWT-01"
  ],
  "child_mission": "Become a Sentence Builder. Learn what a sentence needs, then write clear sentences that start with a capital letter, make complete sense and finish with the right end mark.",
  "learning_intention": "We are learning to write clear sentences that make complete sense.",
  "success_criteria": [
    "I can explain what a sentence is.",
    "I can find the naming part and the doing part in a sentence.",
    "I can start a sentence with a capital letter and end it with the correct end mark.",
    "I can fix a fragment by adding the missing part.",
    "I can fix a run-on sentence by splitting it or joining it with and, but or so.",
    "I can add detail that tells when, where, how or what kind.",
    "I can read my sentence aloud and use the three-point check to improve it."
  ],
  "materials": [
    "This lesson, with everything you need inside it",
    "A pencil and paper or an exercise book",
    "A quiet spot where you can read your sentences aloud",
    "Optional: a parent or sibling to listen"
  ],
  "teach_steps": [
    {
      "icon": "✏️",
      "title": "What is a sentence?",
      "explain": "A sentence is a group of words that tells one complete idea. When you read a sentence, you should not be left asking a question such as, what happened next, or who did that. A sentence finishes the thought it started.\n\nA clear sentence has three things. It tells the reader who or what the sentence is about. It tells the reader what that person or thing did, or what they are like. It makes complete sense on its own. A sentence also begins with a capital letter and ends with a full stop, a question mark or an exclamation mark.\n\nIt helps to think of a sentence as a complete idea, not just a group of words. A long group of words is not automatically a sentence, and a short group of words can be one. For example, the little sentence It rained. is complete, while the long group The tall girl with the red shoes and the green hat is not, because it never says what the girl did.",
      "visual_before": {
        "svg": "<svg viewBox=\"0 0 720 260\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>.v1b{font-family:Arial,sans-serif;font-weight:700}.v1t{font:16px Arial,sans-serif;fill:#334155}@media (prefers-reduced-motion:reduce){animate{display:none}}</style><rect width=\"720\" height=\"260\" rx=\"20\" fill=\"#eff6ff\"/><text x=\"360\" y=\"38\" text-anchor=\"middle\" class=\"v1b\" font-size=\"24\" fill=\"#1e3a8a\">A sentence tells one complete idea</text><rect x=\"48\" y=\"70\" width=\"176\" height=\"72\" rx=\"14\" fill=\"#dbeafe\"/><rect x=\"236\" y=\"70\" width=\"272\" height=\"72\" rx=\"14\" fill=\"#ffedd5\"/><rect x=\"520\" y=\"70\" width=\"152\" height=\"72\" rx=\"14\" fill=\"#ede9fe\"/><g><animateTransform attributeName=\"transform\" type=\"translate\" values=\"-190 0;0 0;0 0\" keyTimes=\"0;.3;1\" dur=\"5s\" repeatCount=\"indefinite\"/><text x=\"136\" y=\"114\" text-anchor=\"middle\" class=\"v1b\" font-size=\"22\" fill=\"#1e40af\">The girl</text></g><g><animateTransform attributeName=\"transform\" type=\"translate\" values=\"300 0;0 0;0 0\" keyTimes=\"0;.5;1\" dur=\"5s\" repeatCount=\"indefinite\"/><text x=\"372\" y=\"114\" text-anchor=\"middle\" class=\"v1b\" font-size=\"22\" fill=\"#9a3412\">kicked the ball</text></g><g><animateTransform attributeName=\"transform\" type=\"translate\" values=\"0 -95;0 0;0 0\" keyTimes=\"0;.64;1\" dur=\"5s\" repeatCount=\"indefinite\"/><circle cx=\"596\" cy=\"106\" r=\"24\" fill=\"#c4b5fd\"/><circle cx=\"596\" cy=\"106\" r=\"9\" fill=\"#5b21b6\"/></g><g><animate attributeName=\"opacity\" values=\"0;0;1;1\" keyTimes=\"0;.8;.88;1\" dur=\"5s\" repeatCount=\"indefinite\"/><circle cx=\"660\" cy=\"106\" r=\"19\" fill=\"#dcfce7\"/><path d=\"M651 106l6 6 12-15\" fill=\"none\" stroke=\"#16a34a\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></g><text x=\"136\" y=\"176\" text-anchor=\"middle\" class=\"v1t\">Who or what?</text><text x=\"372\" y=\"176\" text-anchor=\"middle\" class=\"v1t\">Did what?</text><text x=\"596\" y=\"176\" text-anchor=\"middle\" class=\"v1t\">End mark</text><text x=\"360\" y=\"222\" text-anchor=\"middle\" class=\"v1t\">Read it aloud. If it feels finished, you have a sentence.</text></svg>",
        "alt": "Three labelled spaces fill in order: The girl, kicked the ball and an end mark, finishing with a green tick. Captions read Who or what, Did what and End mark.",
        "caption": "A sentence is built in three parts. Watch each part arrive, then read the finished sentence aloud."
      },
      "example": "The girl kicked the ball.\nWho or what? The girl. Did what? Kicked the ball. It makes complete sense, so it is a sentence.\n\nIt rained.\nThis is also a sentence. It is short, but it tells one complete idea.\n\nThe tall girl with the red shoes.\nThis is not a sentence. It tells us who, but it never says what she did.",
      "notice": "Common mistake: believing a long group of words must be a sentence. Length does not make a sentence. A complete idea does.",
      "check": {
        "question": "What does a complete sentence need?",
        "options": [
          "A picture and a title",
          "Someone or something and what they did, told as one complete idea",
          "At least ten words"
        ],
        "correct_index": 1,
        "explanation": "A sentence tells one complete idea. It needs a who or what part and a doing or being part."
      }
    },
    {
      "icon": "🔎",
      "title": "Who or what? Doing what?",
      "explain": "To test a sentence, ask two questions. First ask: who or what is this about? The answer is the naming part, and it is usually a person, animal, place or thing. Then ask: what did they do, or what are they like? The answer is the doing part, and it is built around a verb.\n\nVerbs are doing words such as run, jump, laugh, eat and sleep. Some verbs tell us about being or having, such as is, are, was and has. The doing part can be a single verb, such as sang, or a verb with other words, such as sang loudly or baked a cake.\n\nIf you can answer both questions, you very likely have a sentence. If one answer is missing, the group of words is not finished. A group of describing words with no verb, such as the big brown fluffy dog, tells us about something but never says what it does.",
      "visual": {
        "svg": "<svg viewBox=\"0 0 720 300\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>.v2b{font-family:Arial,sans-serif;font-weight:700}.v2t{font:16px Arial,sans-serif;fill:#334155}@media (prefers-reduced-motion:reduce){animate{display:none}}</style><rect width=\"720\" height=\"300\" rx=\"20\" fill=\"#f8fafc\"/><text x=\"360\" y=\"36\" text-anchor=\"middle\" class=\"v2b\" font-size=\"24\" fill=\"#1f2937\">Ask two questions about every sentence</text><rect x=\"55\" y=\"58\" width=\"285\" height=\"70\" rx=\"16\" fill=\"#dbeafe\"/><text x=\"197\" y=\"90\" text-anchor=\"middle\" class=\"v2b\" font-size=\"22\" fill=\"#1e40af\">WHO or WHAT?</text><text x=\"197\" y=\"116\" text-anchor=\"middle\" class=\"v2t\">the naming part</text><rect x=\"380\" y=\"58\" width=\"285\" height=\"70\" rx=\"16\" fill=\"#ffedd5\"/><text x=\"522\" y=\"90\" text-anchor=\"middle\" class=\"v2b\" font-size=\"22\" fill=\"#9a3412\">DID WHAT?</text><text x=\"522\" y=\"116\" text-anchor=\"middle\" class=\"v2t\">the doing or being part</text><rect y=\"148\" x=\"70\" width=\"110\" height=\"30\" rx=\"6\" fill=\"#bfdbfe\"><animate attributeName=\"width\" values=\"0;110;110\" keyTimes=\"0;.3;1\" dur=\"5s\" repeatCount=\"indefinite\"/></rect><text x=\"78\" y=\"170\" class=\"v2b\" font-size=\"20\" fill=\"#1e40af\">The birds</text><rect y=\"148\" x=\"196\" width=\"140\" height=\"30\" rx=\"6\" fill=\"#fed7aa\"><animate attributeName=\"width\" values=\"0;0;140;140\" keyTimes=\"0;.34;.58;1\" dur=\"5s\" repeatCount=\"indefinite\"/></rect><text x=\"204\" y=\"170\" class=\"v2b\" font-size=\"20\" fill=\"#9a3412\">sang loudly</text><rect y=\"206\" x=\"70\" width=\"130\" height=\"30\" rx=\"6\" fill=\"#bfdbfe\"><animate attributeName=\"width\" values=\"0;0;130;130\" keyTimes=\"0;.6;.8;1\" dur=\"5s\" repeatCount=\"indefinite\"/></rect><text x=\"78\" y=\"228\" class=\"v2b\" font-size=\"20\" fill=\"#1e40af\">My brother</text><rect y=\"206\" x=\"216\" width=\"150\" height=\"30\" rx=\"6\" fill=\"#fed7aa\"><animate attributeName=\"width\" values=\"0;0;0;150;150\" keyTimes=\"0;.62;.82;.94;1\" dur=\"5s\" repeatCount=\"indefinite\"/></rect><text x=\"224\" y=\"228\" class=\"v2b\" font-size=\"20\" fill=\"#9a3412\">baked a cake</text><text x=\"360\" y=\"278\" text-anchor=\"middle\" class=\"v2t\">Blue shows who or what. Orange shows what happened or what it is like.</text></svg>",
        "alt": "Two question cards, WHO or WHAT and DID WHAT, above example sentences where the naming part is highlighted blue and the doing part orange.",
        "caption": "A blue highlight sweeps the naming part and an orange highlight sweeps the doing part. Find both parts in your own sentences."
      },
      "example": "The birds sang loudly.\nWho or what? The birds. Did what? Sang loudly.\n\nThe puppy is tiny.\nWho or what? The puppy. What is it like? Tiny.\n\nMy brother baked a cake.\nWho or what? My brother. Did what? Baked a cake.",
      "notice": "Common mistake: writing only describing words, such as the big brown fluffy dog, and forgetting the verb. That group of words is not a sentence.",
      "check": {
        "question": "In the sentence The birds sang loudly, what is the doing part?",
        "options": [
          "The",
          "sang",
          "loudly"
        ],
        "correct_index": 1,
        "explanation": "Sang is the verb. It tells us what the birds did."
      }
    },
    {
      "icon": "🔤",
      "title": "Capital letters and end marks",
      "explain": "Every sentence begins with a capital letter. This is a signal to the reader that a new idea is starting. Names of people, places and days also use capital letters, and so does the word I. Everything else stays in small letters unless it starts a sentence or is a name.\n\nEvery sentence ends with an end mark. A full stop ends a statement that tells the reader something. A question mark ends a sentence that asks something. An exclamation mark ends a sentence that shows strong feeling, such as surprise, joy or alarm.\n\nThe end mark is a meaning signal. Read your sentence aloud to test it: if your voice falls and the idea is finished, you need a full stop. If your voice rises because you are asking, you need a question mark. If your voice is strong with feeling, you need an exclamation mark.",
      "visual": {
        "svg": "<svg viewBox=\"0 0 720 300\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>.v3b{font-family:Arial,sans-serif;font-weight:700}.v3t{font:16px Arial,sans-serif;fill:#334155}@media (prefers-reduced-motion:reduce){animate{display:none}}</style><rect width=\"720\" height=\"300\" rx=\"20\" fill=\"#fff7ed\"/><text x=\"360\" y=\"36\" text-anchor=\"middle\" class=\"v3b\" font-size=\"24\" fill=\"#9a3412\">Capital letter at the start, end mark at the finish</text><text x=\"150\" y=\"96\" class=\"v3b\" font-size=\"26\" fill=\"#7c3aed\">T<animate attributeName=\"font-size\" values=\"12;26;26\" keyTimes=\"0;.28;1\" dur=\"5s\" repeatCount=\"indefinite\"/></text><text x=\"166\" y=\"96\" class=\"v3b\" font-size=\"24\" fill=\"#1f2937\">he dog barked</text><g><animateTransform attributeName=\"transform\" type=\"translate\" values=\"0 -70;0 0;0 0\" keyTimes=\"0;.5;1\" dur=\"5s\" repeatCount=\"indefinite\"/><circle cx=\"356\" cy=\"90\" r=\"6\" fill=\"#ea580c\"/></g><text x=\"360\" y=\"126\" text-anchor=\"middle\" class=\"v3t\">Watch the capital letter grow and the end mark drop into place.</text><g><rect x=\"40\" y=\"146\" width=\"200\" height=\"126\" rx=\"16\" fill=\"#fff\" stroke=\"#fdba74\" stroke-width=\"3\"/><circle cx=\"140\" cy=\"192\" r=\"13\" fill=\"#ea580c\"/><text x=\"140\" y=\"228\" text-anchor=\"middle\" class=\"v3b\" font-size=\"19\">Statement</text><text x=\"140\" y=\"254\" text-anchor=\"middle\" class=\"v3t\">The dog barked.</text></g><g><rect x=\"260\" y=\"146\" width=\"200\" height=\"126\" rx=\"16\" fill=\"#fff\" stroke=\"#60a5fa\" stroke-width=\"3\"/><text x=\"360\" y=\"196\" text-anchor=\"middle\" class=\"v3b\" font-size=\"46\" fill=\"#2563eb\">?</text><text x=\"360\" y=\"228\" text-anchor=\"middle\" class=\"v3b\" font-size=\"19\">Question</text><text x=\"360\" y=\"254\" text-anchor=\"middle\" class=\"v3t\">Did you see the dog?</text></g><g><rect x=\"480\" y=\"146\" width=\"200\" height=\"126\" rx=\"16\" fill=\"#fff\" stroke=\"#c084fc\" stroke-width=\"3\"/><text x=\"580\" y=\"196\" text-anchor=\"middle\" class=\"v3b\" font-size=\"46\" fill=\"#7c3aed\">!</text><text x=\"580\" y=\"228\" text-anchor=\"middle\" class=\"v3b\" font-size=\"19\">Strong feeling</text><text x=\"580\" y=\"254\" text-anchor=\"middle\" class=\"v3t\">Watch out for that dog!</text></g></svg>",
        "alt": "The first letter of the sentence grows into a capital T while a full stop drops into the end. Three panels show a full stop for a statement, a question mark for a question and an exclamation mark for strong feeling.",
        "caption": "Watch the capital letter grow and the end mark drop in. Then match each end mark to its meaning."
      },
      "example": "We went to the beach.\nA statement, so it ends with a full stop. It starts with a capital W.\n\nDid you bring a towel?\nA question, so it ends with a question mark.\n\nWatch out for the wave!\nStrong feeling, so it ends with an exclamation mark.",
      "notice": "Common mistakes: forgetting the end mark, using a full stop for a question, and putting capital letters in the middle of words that are not names.",
      "check": {
        "question": "Which end mark belongs at the end of: Where is my hat",
        "options": [
          "A full stop",
          "A question mark",
          "A comma"
        ],
        "correct_index": 1,
        "explanation": "The sentence asks something, so it ends with a question mark."
      }
    },
    {
      "icon": "🧩",
      "title": "Fixing fragments",
      "explain": "A fragment is a group of words that is missing something, so it does not make complete sense on its own. Most fragments are missing either the naming part or the doing part. A fragment can look like a sentence because it starts with a capital letter and ends with an end mark, but the thought is unfinished.\n\nTo fix a fragment, work out which of the two questions cannot be answered. If you cannot say who or what, add the naming part. If you cannot say what happened, add the doing part. Then check the whole group of words again: capital letter, end mark, and one complete idea.\n\nWriters sometimes use fragments on purpose for a special effect, but in your own clear sentences you should write the full idea. Adding an end mark to a fragment does not make it a sentence; the missing part still has to be added.",
      "visual": {
        "svg": "<svg viewBox=\"0 0 720 260\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>.v4b{font-family:Arial,sans-serif;font-weight:700}.v4t{font:16px Arial,sans-serif;fill:#334155}@media (prefers-reduced-motion:reduce){animate{display:none}}</style><rect width=\"720\" height=\"260\" rx=\"20\" fill=\"#fef2f2\"/><text x=\"360\" y=\"36\" text-anchor=\"middle\" class=\"v4b\" font-size=\"24\" fill=\"#991b1b\">A fragment is missing a piece</text><rect x=\"30\" y=\"76\" width=\"280\" height=\"82\" rx=\"12\" fill=\"#fee2e2\" stroke=\"#dc2626\" stroke-width=\"3\" stroke-dasharray=\"8 6\"/><text x=\"170\" y=\"112\" text-anchor=\"middle\" class=\"v4b\" font-size=\"21\" fill=\"#991b1b\">Ran down the hill.</text><text x=\"170\" y=\"144\" text-anchor=\"middle\" class=\"v4t\">Who ran? It is not there.</text><path d=\"M316 117h34\" stroke=\"#16a34a\" stroke-width=\"6\" stroke-linecap=\"round\"><animate attributeName=\"stroke-dasharray\" values=\"0 60;60 0;60 0\" dur=\"2.6s\" repeatCount=\"indefinite\"/></path><rect x=\"358\" y=\"76\" width=\"332\" height=\"82\" rx=\"12\" fill=\"#dcfce7\"/><g><animateTransform attributeName=\"transform\" type=\"translate\" values=\"0 -60;0 0;0 0\" keyTimes=\"0;.42;1\" dur=\"5s\" repeatCount=\"indefinite\"/><text x=\"372\" y=\"122\" class=\"v4b\" font-size=\"18\" fill=\"#1e40af\">The boy</text></g><text x=\"470\" y=\"122\" class=\"v4b\" font-size=\"18\" fill=\"#166534\">ran down the hill.</text><g><animate attributeName=\"opacity\" values=\"0;0;1;1\" keyTimes=\"0;.6;.7;1\" dur=\"5s\" repeatCount=\"indefinite\"/><circle cx=\"658\" cy=\"100\" r=\"15\" fill=\"#bbf7d0\"/><path d=\"M651 100l6 6 12-15\" fill=\"none\" stroke=\"#166534\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></g><text x=\"360\" y=\"212\" text-anchor=\"middle\" class=\"v4t\">Ask which question cannot be answered, then add that part.</text><text x=\"360\" y=\"240\" text-anchor=\"middle\" class=\"v4t\">A full stop on a fragment does not make it a sentence.</text></svg>",
        "alt": "A dashed red fragment, Ran down the hill, with the question Who ran? becomes a green complete sentence as The boy slides into the front and a tick appears.",
        "caption": "The naming part slides in from the left. Watch the fragment become a complete sentence."
      },
      "example": "Fragment: Ran down the hill.\nWho ran? Missing. Fixed: The boy ran down the hill.\n\nFragment: The big brown dog.\nWhat did it do? Missing. Fixed: The big brown dog barked at the postie.\n\nFragment: In the morning.\nWhat happened, and who did it? Fixed: In the morning, we walked to school.",
      "notice": "Common mistake: thinking a long group of words must be a sentence. Length does not make a sentence complete.",
      "check": {
        "question": "Which one is a complete sentence?",
        "options": [
          "Ran down the hill.",
          "The girl ran down the hill.",
          "The girl down the hill."
        ],
        "correct_index": 1,
        "explanation": "The girl ran down the hill tells who and what she did, so it is complete."
      }
    },
    {
      "icon": "🚂",
      "title": "Fixing run-on sentences",
      "explain": "A run-on sentence pushes two or more complete ideas together with no clear break. The words are all correct, but the reader cannot see where one idea ends and the next one begins. A close cousin is the comma splice, where two complete ideas are joined by only a comma.\n\nThere are two reliable ways to fix a run-on. You can split it into separate sentences, giving each one a capital letter and an end mark. Or you can join the ideas with a joining word such as and, but, so or because, adding a comma before the joining word when it helps the reader.\n\nReading aloud is the quickest test. When you run out of breath, or when your voice naturally stops, you have probably found the place where one idea ends. Fix the run-on there, then read it again to check that each idea is now clear.",
      "visual": {
        "svg": "<svg viewBox=\"0 0 720 300\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>.v5b{font-family:Arial,sans-serif;font-weight:700}.v5t{font:16px Arial,sans-serif;fill:#334155}@media (prefers-reduced-motion:reduce){animate{display:none}}</style><rect width=\"720\" height=\"300\" rx=\"20\" fill=\"#fff7ed\"/><text x=\"360\" y=\"34\" text-anchor=\"middle\" class=\"v5b\" font-size=\"24\" fill=\"#9a3412\">A run-on sentence needs clear stops</text><rect x=\"40\" y=\"50\" width=\"640\" height=\"52\" rx=\"12\" fill=\"#fee2e2\"/><text x=\"360\" y=\"82\" text-anchor=\"middle\" class=\"v5b\" font-size=\"18\" fill=\"#991b1b\">The dog barked the cat ran away the boy laughed</text><path d=\"M360 110v28\" stroke=\"#ea580c\" stroke-width=\"6\" stroke-linecap=\"round\"><animate attributeName=\"stroke-dasharray\" values=\"0 40;40 0;40 0\" dur=\"2.4s\" repeatCount=\"indefinite\"/></path><polygon points=\"350,136 370,136 360,150\" fill=\"#ea580c\"/><g><animateTransform attributeName=\"transform\" type=\"translate\" values=\"0 30;0 0;0 0\" keyTimes=\"0;.34;1\" dur=\"5s\" repeatCount=\"indefinite\"/><animate attributeName=\"opacity\" values=\"0;1;1\" keyTimes=\"0;.34;1\" dur=\"5s\" repeatCount=\"indefinite\"/><rect x=\"40\" y=\"168\" width=\"200\" height=\"60\" rx=\"10\" fill=\"#dcfce7\"/><text x=\"140\" y=\"204\" text-anchor=\"middle\" class=\"v5b\" font-size=\"17\" fill=\"#166534\">The dog barked.</text></g><g><animateTransform attributeName=\"transform\" type=\"translate\" values=\"0 30;0 0;0 0\" keyTimes=\"0;.5;1\" dur=\"5s\" repeatCount=\"indefinite\"/><animate attributeName=\"opacity\" values=\"0;0;1;1\" keyTimes=\"0;.48;.5;1\" dur=\"5s\" repeatCount=\"indefinite\"/><rect x=\"260\" y=\"168\" width=\"200\" height=\"60\" rx=\"10\" fill=\"#dcfce7\"/><text x=\"360\" y=\"204\" text-anchor=\"middle\" class=\"v5b\" font-size=\"17\" fill=\"#166534\">The cat ran away.</text></g><g><animateTransform attributeName=\"transform\" type=\"translate\" values=\"0 30;0 0;0 0\" keyTimes=\"0;.66;1\" dur=\"5s\" repeatCount=\"indefinite\"/><animate attributeName=\"opacity\" values=\"0;0;0;1;1\" keyTimes=\"0;.64;.66;.68;1\" dur=\"5s\" repeatCount=\"indefinite\"/><rect x=\"480\" y=\"168\" width=\"200\" height=\"60\" rx=\"10\" fill=\"#dcfce7\"/><text x=\"580\" y=\"204\" text-anchor=\"middle\" class=\"v5b\" font-size=\"17\" fill=\"#166534\">The boy laughed.</text></g><text x=\"360\" y=\"262\" text-anchor=\"middle\" class=\"v5t\">Split the ideas into separate sentences, or join them with a joining word.</text><text x=\"360\" y=\"286\" text-anchor=\"middle\" class=\"v5t\">Read aloud: the place you take a breath is often where the break belongs.</text></svg>",
        "alt": "A long red run-on sentence is separated into three green sentence cards that appear one at a time, each with its own full stop.",
        "caption": "Watch one crowded line become three separate sentences. Each new sentence arrives with its own full stop."
      },
      "example": "Run-on: The dog barked the cat ran away the boy laughed.\nFix by splitting: The dog barked. The cat ran away. The boy laughed.\nFix by joining: The dog barked, and the cat ran away. The boy laughed.\n\nComma splice: We got home, we had dinner.\nFixed: We got home. We had dinner. Or: We got home, and we had dinner.",
      "notice": "Common mistake: joining two complete ideas with only a comma, or with no punctuation at all. A comma is not strong enough to hold two complete ideas on its own.",
      "check": {
        "question": "Which is the best fix for: The rain stopped we went outside",
        "options": [
          "The rain stopped, so we went outside.",
          "The rain stopped we went outside.",
          "The rain stopped we, went outside."
        ],
        "correct_index": 0,
        "explanation": "The joining word so, with a comma, shows that going outside was the result of the rain stopping."
      }
    },
    {
      "icon": "🌉",
      "title": "Joining ideas with and, but and so",
      "explain": "A conjunction is a joining word. It connects two ideas and shows how they are related. The works are and, but, so and because. And adds another idea. But shows a contrast or a surprise. So shows a result. Because gives a reason.\n\nWhen a conjunction joins two complete ideas, put a comma before the conjunction. For example, in It was raining, so we stayed inside, the comma marks the end of the first complete idea. Without the comma the sentence still makes sense, but the comma helps the reader.\n\nChoosing the right conjunction matters. It was cold we wore coats becomes much clearer as It was cold, so we wore coats. The joining word tells the reader that the cold caused the coats, not that the two ideas are simply listed.",
      "visual": {
        "svg": "<svg viewBox=\"0 0 720 300\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>.v6b{font-family:Arial,sans-serif;font-weight:700}.v6t{font:16px Arial,sans-serif;fill:#334155}@media (prefers-reduced-motion:reduce){animate{display:none}}</style><rect width=\"720\" height=\"300\" rx=\"20\" fill=\"#f0fdf4\"/><text x=\"360\" y=\"34\" text-anchor=\"middle\" class=\"v6b\" font-size=\"24\" fill=\"#166534\">Join two ideas with and, but or so</text><rect x=\"40\" y=\"86\" width=\"250\" height=\"60\" rx=\"12\" fill=\"#dbeafe\"/><text x=\"165\" y=\"123\" text-anchor=\"middle\" class=\"v6b\" font-size=\"19\" fill=\"#1e40af\">It was raining</text><rect x=\"430\" y=\"86\" width=\"250\" height=\"60\" rx=\"12\" fill=\"#ffedd5\"/><text x=\"555\" y=\"123\" text-anchor=\"middle\" class=\"v6b\" font-size=\"19\" fill=\"#9a3412\">we stayed inside</text><path d=\"M298 116h122\" stroke=\"#16a34a\" stroke-width=\"6\" stroke-linecap=\"round\"><animate attributeName=\"stroke-dasharray\" values=\"0 130;130 0;130 0\" dur=\"3s\" repeatCount=\"indefinite\"/></path><circle cx=\"360\" cy=\"116\" r=\"30\" fill=\"#dcfce7\" stroke=\"#16a34a\" stroke-width=\"3\"><animate attributeName=\"r\" values=\"24;30;30\" keyTimes=\"0;.5;1\" dur=\"5s\" repeatCount=\"indefinite\"/></circle><text x=\"360\" y=\"124\" text-anchor=\"middle\" class=\"v6b\" font-size=\"22\" fill=\"#166534\">so</text><text x=\"272\" y=\"106\" class=\"v6b\" font-size=\"30\" fill=\"#166534\">,<animate attributeName=\"opacity\" values=\"0;1;1\" keyTimes=\"0;.55;1\" dur=\"5s\" repeatCount=\"indefinite\"/></text><text x=\"360\" y=\"176\" text-anchor=\"middle\" class=\"v6t\">so shows the result: the rain caused staying inside.</text><rect x=\"80\" y=\"196\" width=\"560\" height=\"34\" rx=\"8\" fill=\"#ffffff\"/><text x=\"360\" y=\"219\" text-anchor=\"middle\" class=\"v6b\" font-size=\"17\" fill=\"#166534\">and adds an idea | but shows a contrast | so shows a result</text><text x=\"360\" y=\"262\" text-anchor=\"middle\" class=\"v6t\">Use a comma before and, but or so when it joins two complete ideas.</text><text x=\"360\" y=\"286\" text-anchor=\"middle\" class=\"v6t\">Choose the joining word that shows how the two ideas are connected.</text></svg>",
        "alt": "Two idea cards, It was raining and we stayed inside, are joined by a green bridge labelled so with a comma appearing before it.",
        "caption": "Watch the bridge form between the two ideas. The word so tells the reader that one idea is the result of the other."
      },
      "example": "It was raining, so we stayed inside.\nSo shows the result: the rain caused staying inside.\n\nI wanted to play, but it was too dark.\nBut shows a contrast.\n\nWe packed a picnic, and we drove to the beach.\nAnd simply adds another idea.",
      "notice": "Common mistakes: using and to join two ideas that are not really related, and leaving out the comma before and, but or so when they join two complete ideas.",
      "check": {
        "question": "Which joining word best completes: The path was slippery, ___ we walked slowly.",
        "options": [
          "but",
          "so",
          "and"
        ],
        "correct_index": 1,
        "explanation": "Walking slowly was the result of the slippery path, so so is the best choice."
      }
    },
    {
      "icon": "🌈",
      "title": "Adding clear detail",
      "explain": "A short sentence can be clear and correct, but detail helps the reader picture what you mean. Useful detail answers one of four questions: when, where, how, or what kind. For example, the plain sentence The dog ran becomes clearer as After lunch, the brown dog ran across the park.\n\nBuild detail one piece at a time. Start with a complete sentence, then add a single piece of detail and read the whole sentence again. If it still says one clear idea, add another piece. Keeping the main idea easy to find is more important than making the sentence long.\n\nA when phrase that comes at the start of a sentence takes a comma after it, as in After lunch, the dog ran. Too many describing words can bury the main idea, so check that every detail earns its place and helps the reader.",
      "visual": {
        "svg": "<svg viewBox=\"0 0 720 320\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>.v7b{font-family:Arial,sans-serif;font-weight:700}.v7t{font:16px Arial,sans-serif;fill:#334155}@media (prefers-reduced-motion:reduce){animate{display:none}}</style><rect width=\"720\" height=\"320\" rx=\"20\" fill=\"#f5f3ff\"/><text x=\"360\" y=\"34\" text-anchor=\"middle\" class=\"v7b\" font-size=\"24\" fill=\"#5b21b6\">Add one helpful detail at a time</text><text x=\"86\" y=\"86\" text-anchor=\"end\" class=\"v7t\">Start</text><rect x=\"100\" y=\"62\" width=\"200\" height=\"40\" rx=\"9\" fill=\"#e5e7eb\"/><text x=\"200\" y=\"88\" text-anchor=\"middle\" class=\"v7b\" font-size=\"19\">The dog ran.</text><text x=\"86\" y=\"140\" text-anchor=\"end\" class=\"v7t\">Where?</text><g><animateTransform attributeName=\"transform\" type=\"translate\" values=\"-24 0;0 0;0 0\" keyTimes=\"0;.3;1\" dur=\"6s\" repeatCount=\"indefinite\"/><rect x=\"100\" y=\"116\" width=\"360\" height=\"40\" rx=\"9\" fill=\"#dbeafe\"/><text x=\"120\" y=\"142\" class=\"v7b\" font-size=\"19\" fill=\"#1e40af\">The dog ran across the park.</text></g><text x=\"86\" y=\"194\" text-anchor=\"end\" class=\"v7t\">When?</text><g><animateTransform attributeName=\"transform\" type=\"translate\" values=\"-24 0;0 0;0 0\" keyTimes=\"0;.52;1\" dur=\"6s\" repeatCount=\"indefinite\"/><animate attributeName=\"opacity\" values=\"1;1\" dur=\"6s\" repeatCount=\"indefinite\"/><rect x=\"100\" y=\"170\" width=\"470\" height=\"40\" rx=\"9\" fill=\"#ffedd5\"/><text x=\"120\" y=\"196\" class=\"v7b\" font-size=\"18\" fill=\"#9a3412\">After lunch, the dog ran across the park.</text></g><text x=\"86\" y=\"248\" text-anchor=\"end\" class=\"v7t\">What kind?</text><g><animateTransform attributeName=\"transform\" type=\"translate\" values=\"-24 0;0 0;0 0\" keyTimes=\"0;.74;1\" dur=\"6s\" repeatCount=\"indefinite\"/><rect x=\"100\" y=\"224\" width=\"540\" height=\"40\" rx=\"9\" fill=\"#dcfce7\"/><text x=\"120\" y=\"250\" class=\"v7b\" font-size=\"18\" fill=\"#166534\">After lunch, the brown dog ran across the park.</text></g><rect x=\"110\" y=\"272\" width=\"120\" height=\"10\" rx=\"5\" fill=\"#c4b5fd\"><animate attributeName=\"x\" values=\"110;490;110\" dur=\"6s\" repeatCount=\"indefinite\"/></rect><text x=\"360\" y=\"304\" text-anchor=\"middle\" class=\"v7t\">Useful details answer when, where, how or what kind.</text></svg>",
        "alt": "A sentence grows from The dog ran, adding across the park, then After lunch, then brown, until it reads After lunch, the brown dog ran across the park, while a purple bar sweeps the finished line.",
        "caption": "Watch the sentence grow one detail at a time. The labels show which question each new detail answers."
      },
      "example": "Start: The dog ran.\nWhere? The dog ran across the park.\nWhen? After lunch, the dog ran across the park.\nWhat kind? After lunch, the brown dog ran across the park.",
      "notice": "Common mistake: adding so many words that the main idea is buried. Add detail one piece at a time and read the sentence again after each addition.",
      "check": {
        "question": "Which sentence uses detail most usefully?",
        "options": [
          "The dog ran.",
          "The brown dog ran across the park after lunch.",
          "The dog ran ran ran."
        ],
        "correct_index": 1,
        "explanation": "It tells what kind of dog, where it ran and when, and it still says one clear idea."
      }
    },
    {
      "icon": "👂",
      "title": "Check it and improve it",
      "explain": "Good writers do not finish a sentence once and move on. They check it. Read each sentence aloud, slowly, because your ear often hears a problem that your eye misses. Then run three checks. First, does it start with a capital letter and end with an end mark? Second, can you find who or what and what they did? Third, does it make complete sense on its own?\n\nIf a check fails, fix that one thing and read the sentence again. Work on one problem at a time, because changing many things at once makes it hard to tell what helped. Draft after school we played becomes After school, we played cricket in the yard once the capital letter, comma and missing detail are added.\n\nChecking and improving is part of writing, not a sign that you made a mistake. Every writer drafts and then fixes.",
      "visual": {
        "svg": "<svg viewBox=\"0 0 720 300\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>.v8b{font-family:Arial,sans-serif;font-weight:700}.v8t{font:16px Arial,sans-serif;fill:#334155}@media (prefers-reduced-motion:reduce){animate{display:none}}</style><rect width=\"720\" height=\"300\" rx=\"20\" fill=\"#eef2ff\"/><text x=\"360\" y=\"34\" text-anchor=\"middle\" class=\"v8b\" font-size=\"24\" fill=\"#3730a3\">The three-point sentence check</text><path d=\"M168 150h144M408 150h144\" stroke=\"#a5b4fc\" stroke-width=\"6\" stroke-linecap=\"round\" stroke-dasharray=\"10 8\"><animate attributeName=\"stroke-dashoffset\" values=\"0;-36\" dur=\"1.4s\" repeatCount=\"indefinite\"/></path><circle cx=\"120\" cy=\"150\" r=\"52\" fill=\"#dbeafe\"/><text x=\"120\" y=\"143\" text-anchor=\"middle\" class=\"v8b\" font-size=\"22\" fill=\"#1e40af\">1</text><text x=\"120\" y=\"168\" text-anchor=\"middle\" class=\"v8b\" font-size=\"15\" fill=\"#1e40af\">Capital +</text><text x=\"120\" y=\"186\" text-anchor=\"middle\" class=\"v8b\" font-size=\"15\" fill=\"#1e40af\">end mark</text><circle cx=\"360\" cy=\"150\" r=\"52\" fill=\"#ffedd5\"/><text x=\"360\" y=\"143\" text-anchor=\"middle\" class=\"v8b\" font-size=\"22\" fill=\"#9a3412\">2</text><text x=\"360\" y=\"168\" text-anchor=\"middle\" class=\"v8b\" font-size=\"15\" fill=\"#9a3412\">Who or what?</text><text x=\"360\" y=\"186\" text-anchor=\"middle\" class=\"v8b\" font-size=\"15\" fill=\"#9a3412\">Did what?</text><circle cx=\"600\" cy=\"150\" r=\"52\" fill=\"#dcfce7\"/><text x=\"600\" y=\"143\" text-anchor=\"middle\" class=\"v8b\" font-size=\"22\" fill=\"#166534\">3</text><text x=\"600\" y=\"168\" text-anchor=\"middle\" class=\"v8b\" font-size=\"15\" fill=\"#166534\">Makes</text><text x=\"600\" y=\"186\" text-anchor=\"middle\" class=\"v8b\" font-size=\"15\" fill=\"#166534\">sense?</text><circle r=\"9\" fill=\"#4338ca\" cx=\"120\" cy=\"150\"><animateMotion dur=\"5s\" repeatCount=\"indefinite\" path=\"M120 150 L600 150\"/></circle><text x=\"360\" y=\"236\" text-anchor=\"middle\" class=\"v8t\">Draft: after school we played</text><text x=\"360\" y=\"266\" text-anchor=\"middle\" class=\"v8b\" font-size=\"18\" fill=\"#166534\">Fixed: After school, we played cricket in the yard.</text><text x=\"360\" y=\"290\" text-anchor=\"middle\" class=\"v8t\">Fix one thing, then read the sentence again.</text></svg>",
        "alt": "Three connected checkpoints, capital and end mark, who or what and did what, and makes sense, with a moving dot travelling between them and a fixed sentence at the bottom.",
        "caption": "Watch the dot travel from check one to check three. Use all three checks on every sentence you write."
      },
      "example": "Draft: after school we played\nCheck 1: no capital letter, no end mark. Check 2: who is we, and what did we do? Check 3: played what, and where? It is not complete enough.\nFixed: After school, we played cricket in the yard.",
      "notice": "Common mistake: handing in a first draft without checking. Checking is quick, and it makes your writing much clearer.",
      "check": {
        "question": "What is the best last step after you write a sentence?",
        "options": [
          "Read it aloud and use the three-point check",
          "Make it as long as possible",
          "Hand it in without reading it again"
        ],
        "correct_index": 0,
        "explanation": "Reading aloud and checking the capital letter, end mark and meaning helps you find and fix problems."
      }
    }
  ],
  "interactive_activities": [
    {
      "type": "flip_cards",
      "title": "Sentence words to know",
      "cards": [
        {
          "front": "sentence",
          "back": "a group of words that tells one complete idea"
        },
        {
          "front": "fragment",
          "back": "a group of words that is missing a naming part or a doing part"
        },
        {
          "front": "run-on",
          "back": "two or more complete ideas pushed together with no clear break"
        },
        {
          "front": "conjunction",
          "back": "a joining word such as and, but or so that connects two ideas"
        },
        {
          "front": "capital letter",
          "back": "the large letter at the start of a sentence or the start of a name"
        },
        {
          "front": "end mark",
          "back": "the full stop, question mark or exclamation mark that finishes a sentence"
        },
        {
          "front": "detail",
          "back": "extra words that tell when, where, how or what kind"
        }
      ]
    }
  ],
  "explicit_teaching": "This lesson teaches the complete sentence, the building block of all writing. At this age, children often write fragments and run-ons because they write the way they speak. The aim is not long or fancy sentences. It is sentences that are clear, complete and correctly marked.\n\nTeach with one simple routine and keep using it: who or what, did what, makes sense, capital letter, end mark. Model it on one sentence first, then let your child try. Use the words sentence, fragment, run-on and conjunction, but it is fine if your child only remembers sentence and complete at first.\n\nCorrect gently. Ask a question instead of telling the answer: Who ran? or Where did the sentence stop? Praise one thing your child did well, then fix one thing together. If writing is tiring, let your child say the sentence aloud first, then write it. If your child is confident, ask for detail: when, where, how or what kind.",
  "worked_example": "Example 1: The girl kicked the ball.\nReasoning: who or what? The girl. Did what? Kicked the ball. It starts with a capital letter and ends with a full stop. It makes complete sense, so it is a sentence. Common mistake: writing kicked the ball and leaving out who kicked it.\n\nExample 2: Ran across the road.\nReasoning: the doing part is there, but who ran is missing, so this is a fragment. Fix: The cat ran across the road. Common mistake: starting with the doing word and forgetting the naming part.\n\nExample 3: The big green frog.\nReasoning: we know who or what, but there is no doing word, so it is a fragment. Fix: The big green frog jumped into the pond. Common mistake: writing only describing words and thinking the group is a sentence.\n\nExample 4: We went to the park we played on the swings.\nReasoning: two complete ideas are pushed together, so this is a run-on. Split it: We went to the park. We played on the swings. Or join it: We went to the park, and we played on the swings. Common mistake: joining the two ideas with only a comma, which is a comma splice.\n\nExample 5: Did you see that\nReasoning: the sentence asks something, so it needs a question mark. Fix: Did you see that? Common mistake: using a full stop for a question.\n\nExample 6: Draft: the dog ran.\nReasoning: first fix the capital letter and end mark: The dog ran. Then add detail one piece at a time: The dog ran across the park. After lunch, the dog ran across the park. After lunch, the brown dog ran across the park. Common mistake: adding lots of detail before fixing the capital letter and the end mark.",
  "worked_visuals": [
    {
      "svg": "<svg viewBox=\"0 0 720 260\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>.w1b{font-family:Arial,sans-serif;font-weight:700}.w1t{font:16px Arial,sans-serif;fill:#334155}@media (prefers-reduced-motion:reduce){animate{display:none}}</style><rect width=\"720\" height=\"260\" rx=\"20\" fill=\"#f8fafc\"/><text x=\"360\" y=\"34\" text-anchor=\"middle\" class=\"w1b\" font-size=\"23\" fill=\"#1f2937\">Sentence or not? Check the two questions</text><rect x=\"40\" y=\"52\" width=\"470\" height=\"52\" rx=\"10\" fill=\"#dcfce7\"/><text x=\"60\" y=\"84\" class=\"w1b\" font-size=\"18\" fill=\"#166534\">The cat sat on the mat.</text><g><animate attributeName=\"opacity\" values=\"0;0;1;1\" keyTimes=\"0;.16;.24;1\" dur=\"5s\" repeatCount=\"indefinite\"/><path d=\"M524 78l10 10 20-24\" fill=\"none\" stroke=\"#16a34a\" stroke-width=\"5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></g><text x=\"566\" y=\"82\" text-anchor=\"start\" class=\"w1t\">who: the cat</text><rect x=\"40\" y=\"112\" width=\"470\" height=\"52\" rx=\"10\" fill=\"#fee2e2\"/><text x=\"60\" y=\"144\" class=\"w1b\" font-size=\"18\" fill=\"#991b1b\">Under the old bridge.</text><g><animate attributeName=\"opacity\" values=\"0;0;0;1;1\" keyTimes=\"0;.44;.52;.6;1\" dur=\"5s\" repeatCount=\"indefinite\"/><path d=\"M526 128l22 22m0-22l-22 22\" stroke=\"#dc2626\" stroke-width=\"5\" stroke-linecap=\"round\"/></g><text x=\"566\" y=\"142\" text-anchor=\"start\" class=\"w1t\">who? missing</text><rect x=\"40\" y=\"172\" width=\"470\" height=\"52\" rx=\"10\" fill=\"#dcfce7\"/><text x=\"60\" y=\"204\" class=\"w1b\" font-size=\"18\" fill=\"#166534\">My mum made dinner.</text><g><animate attributeName=\"opacity\" values=\"0;0;0;0;1;1\" keyTimes=\"0;.72;.78;.84;.9;1\" dur=\"5s\" repeatCount=\"indefinite\"/><path d=\"M524 198l10 10 20-24\" fill=\"none\" stroke=\"#16a34a\" stroke-width=\"5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></g><text x=\"566\" y=\"202\" text-anchor=\"start\" class=\"w1t\">who: my mum</text><text x=\"360\" y=\"246\" text-anchor=\"middle\" class=\"w1t\">A tick means both questions have answers. A cross means a part is missing.</text></svg>",
      "alt": "A tick appears beside two complete sentences and a cross beside a fragment, with a short reason beside each.",
      "caption": "Check who or what and what happened. Both answers mean a sentence; a missing answer means a fragment."
    },
    {
      "svg": "<svg viewBox=\"0 0 720 240\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\"><style>.w2b{font-family:Arial,sans-serif;font-weight:700}.w2t{font:16px Arial,sans-serif;fill:#334155}@media (prefers-reduced-motion:reduce){animate{display:none}}</style><rect width=\"720\" height=\"240\" rx=\"20\" fill=\"#eef2ff\"/><text x=\"360\" y=\"34\" text-anchor=\"middle\" class=\"w2b\" font-size=\"23\" fill=\"#3730a3\">From a fragment to a clear sentence</text><rect x=\"60\" y=\"56\" width=\"420\" height=\"42\" rx=\"9\" fill=\"#e5e7eb\"/><text x=\"80\" y=\"83\" class=\"w2b\" font-size=\"18\">Laughed and laughed.</text><g><animateTransform attributeName=\"transform\" type=\"translate\" values=\"-40 0;0 0;0 0\" keyTimes=\"0;.3;1\" dur=\"6s\" repeatCount=\"indefinite\"/><rect x=\"60\" y=\"112\" width=\"500\" height=\"42\" rx=\"9\" fill=\"#dbeafe\"/><text x=\"80\" y=\"139\" class=\"w2b\" font-size=\"18\" fill=\"#1e40af\">The baby laughed and laughed.</text></g><g><animateTransform attributeName=\"transform\" type=\"translate\" values=\"-40 0;0 0;0 0\" keyTimes=\"0;.56;1\" dur=\"6s\" repeatCount=\"indefinite\"/><rect x=\"60\" y=\"168\" width=\"560\" height=\"42\" rx=\"9\" fill=\"#dcfce7\"/><text x=\"80\" y=\"195\" class=\"w2b\" font-size=\"18\" fill=\"#166534\">The baby laughed and laughed in the bath.</text></g><text x=\"360\" y=\"230\" text-anchor=\"middle\" class=\"w2t\">Add the naming part first, then add one useful detail.</text></svg>",
      "alt": "A fragment, Laughed and laughed, gains the naming part and then a detail, ending as The baby laughed and laughed in the bath.",
      "caption": "Add the naming part first, then add one useful detail."
    }
  ],
  "guided_practice": "Part A: Name the parts. Write who or what and what they did: The baby laughed at the funny face. Hint: use the two questions. Answer: Who or what: the baby. Did what: laughed at the funny face.\n\nPart B: Choose the end mark. Add the missing end mark: Where did you put the keys. Hint: is it asking something? Answer: Where did you put the keys?\n\nPart C: Fix the fragment. Make this a complete sentence: Jumped over the log. Hint: who or what jumped? Answer: any complete sentence with a naming part, such as The rabbit jumped over the log.\n\nPart D: Fix the fragment. Make this a complete sentence: The tall old tree. Hint: what did the tree do? Answer: any complete sentence with a doing part, such as The tall old tree fell in the storm.\n\nPart E: Fix the run-on by splitting it: The sun came out the children ran to the pool. Hint: where does one idea end? Answer: The sun came out. The children ran to the pool.\n\nPart F: Fix the run-on by joining with and, but or so: It was raining we stayed inside. Hint: which idea caused the other? Answer: It was raining, so we stayed inside.\n\nPart G: Add detail. Start with: The bird sang. Add where, when and what kind. Hint: answer where, then when, then what kind. Answer: any clear sentence such as In the morning, the little bird sang in the gum tree.\n\nPart H: Check and fix the draft: my sister likes pizza. Hint: use the three-point check. Answer: My sister likes pizza. The sentence is already complete; it needs a capital letter and a full stop.\n\nParent prompt for every part: ask, who or what is it about, and what did they do? Then ask your child to read the sentence aloud and listen for the end mark.",
  "independent_task": "Work from the easiest tasks to the hardest. Write your answers in your book.\n\nPart 1: Sentence or not a sentence? Write sentence or not a sentence.\n1. The cat sat on the mat.\n2. Under the old bridge.\n3. My mum made dinner.\n4. Laughed and laughed.\n5. The tiny kitten purred.\n\nPart 2: Fix these fragments. Rewrite each as a complete sentence with a capital letter and an end mark.\n6. ran to the shops\n7. the happy children\n8. is the bus coming\n9. we saw a big whale it jumped out of the water\n10. in the morning\n\nPart 3: Fix these run-on sentences. Split them, or join the ideas with and, but or so.\n11. The sun was hot we went for a swim.\n12. I like apples I do not like pears.\n13. We packed our bags we drove to the beach.\n\nPart 4: Add detail and write your own.\n14. Improve each sentence by adding when, where or what kind: (a) The boy ran. (b) The dog slept. (c) A bird flew.\n15. Write three clear sentences about your favourite place. Use at least one question and at least one exclamation mark. Then read all three aloud, use the three-point check on each one, and fix anything you find.",
  "response_prompt": "Write one or two sentences about which part of making a clear sentence was easiest for you today, and which part you want to practise more.",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "What is a sentence?",
      "options": [
        "A group of words that tells one complete idea",
        "Any group of words",
        "A single letter"
      ],
      "correct_index": 0,
      "explanation": "A sentence tells one complete idea and makes sense on its own."
    },
    {
      "type": "multiple_choice",
      "question": "How should a sentence begin and end?",
      "options": [
        "With a small letter and no end mark",
        "With a capital letter and an end mark",
        "With a comma and a capital letter"
      ],
      "correct_index": 1,
      "explanation": "A sentence begins with a capital letter and ends with a full stop, question mark or exclamation mark."
    },
    {
      "type": "multiple_choice",
      "question": "Which one is a complete sentence?",
      "options": [
        "Ran across the field.",
        "The big brown horse.",
        "The horse ran across the field."
      ],
      "correct_index": 2,
      "explanation": "It tells who (the horse) and what it did (ran across the field)."
    },
    {
      "type": "multiple_choice",
      "question": "The big brown dog. Why is this a fragment?",
      "options": [
        "It does not say what the dog did",
        "It is too short",
        "It has a capital letter"
      ],
      "correct_index": 0,
      "explanation": "It only describes the dog. There is no doing word to say what the dog did."
    },
    {
      "type": "multiple_choice",
      "question": "Which is the best fix for: The dog barked the cat ran away",
      "options": [
        "The dog barked, and the cat ran away.",
        "The dog barked the cat ran away.",
        "The dog, barked the cat ran away."
      ],
      "correct_index": 0,
      "explanation": "The joining word and, with a comma, separates the two ideas clearly."
    },
    {
      "type": "multiple_choice",
      "question": "Which end mark should be at the end of: What time does the movie start",
      "options": [
        "A full stop",
        "An exclamation mark",
        "A question mark"
      ],
      "correct_index": 2,
      "explanation": "The sentence asks something, so it needs a question mark."
    },
    {
      "type": "multiple_choice",
      "question": "Which joining word best completes: It was cold, ___ we wore coats.",
      "options": [
        "but",
        "so",
        "and"
      ],
      "correct_index": 1,
      "explanation": "Wearing coats was the result of the cold, so so shows the correct relationship."
    },
    {
      "type": "multiple_choice",
      "question": "What is the best way to check a sentence you wrote?",
      "options": [
        "Read it aloud and use the three-point check",
        "Hand it in without looking at it again",
        "Make it longer"
      ],
      "correct_index": 0,
      "explanation": "Reading aloud and checking the capital letter, end mark and meaning helps you find mistakes."
    },
    {
      "type": "short_answer",
      "question": "Rewrite this fragment as a complete sentence and explain what you added: Jumped into the pool.",
      "sample_answer": "The boy jumped into the pool. I added the naming part, the boy, so the sentence now tells who jumped and what they did.",
      "marking_guide": "Full marks for a complete sentence with a naming part and a correct capital letter and end mark, plus an explanation of what was added. Partial marks for a complete sentence with no explanation."
    },
    {
      "type": "short_answer",
      "question": "Fix this run-on sentence in two different ways: We got home we had dinner we watched a movie.",
      "sample_answer": "Split: We got home. We had dinner. We watched a movie. Joined: We got home, and we had dinner. Then we watched a movie.",
      "marking_guide": "Full marks for two different correct fixes, such as splitting and joining, with capital letters and end marks. Partial marks for one correct fix."
    }
  ],
  "parent_notes": "Rationale: a clear sentence is the foundation of all writing, so this lesson teaches the complete sentence before longer texts. Year 3 children often write fragments and run-ons because they write the way they speak, so the goal is sentences that are clear, complete and correctly marked rather than long or fancy.\n\nAssessment notes: watch for three common patterns. Fragments usually start with a doing word or describe a noun without a verb. Run-ons and comma splices come from writing ideas exactly as they are spoken. Missing end marks and capitals are usually the last thing to become automatic. Praise one thing before fixing one thing, and fix one thing at a time.\n\nHow to help: keep the routine simple, who or what, did what, makes sense, capital letter, end mark. Say each sentence aloud before writing it. If writing is tiring, let your child speak the sentence and you write it, then they copy it. If your child is confident, push on detail: when, where, how or what kind. Use the quiz and the independent task as evidence, not as a test to pass.",
  "evidence_instructions": "Keep the fifteen answers from the independent task and the two short-answer responses from the quiz as evidence. For each of the three sentences in task 15, tick whether it starts with a capital letter, ends with an end mark, and makes complete sense. Note one thing your child did well and one thing to practise next.",
  "offline_alternative": "Printable activity pack. Sheet 1, Sentence or not a sentence: two columns headed Sentence and Not a sentence, with the five Part 1 groups to cut out or write in. Sheet 2, Fix-it worksheet: the five Part 2 fragments with a line under each to rewrite, plus the three Part 3 run-ons with space to write two different fixes. Sheet 3, Detail ladder: a sentence at the bottom and three boxes above labelled Where, When and What kind, to build a longer sentence. Sheet 4, Sentence Check Card: five tick boxes labelled Capital letter, Who or what, Did what, End mark and Makes complete sense. Sheet 5, Sentence words to remember: sentence, fragment, run-on, conjunction, end mark, with space for a definition and an example. Answers for the parent: Part 1 is sentence, not a sentence, sentence, not a sentence, sentence. For Parts 2 and 3, accept any clear, complete sentence with the needed correction or joining word.",
  "extension": "Choose a picture in a book or a photo at home. Write five clear sentences about it. Use at least one question and one exclamation, join one pair of ideas with and, but or so, and add detail to two of the sentences. Then read them aloud and use the three-point check on each one."
}')
WHERE seed_key = 's2-eng-y3-w01-l2';
