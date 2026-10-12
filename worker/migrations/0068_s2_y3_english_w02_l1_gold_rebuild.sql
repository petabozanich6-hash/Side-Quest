-- Standard v2 Gold-depth correction of Year 3 English Week 2 Lesson 1.
-- Replaces generic draft content using the existing stable seeded row.
UPDATE lessons SET title='The Missing Seedlings: Story Detectives',data=json_patch(data,'{
  "seed_key": "s2-eng-y3-w02-l1",
  "title": "The Missing Seedlings: Story Detectives",
  "stage": "Stage 2",
  "learning_area": "English",
  "year_level": 3,
  "week": 2,
  "lesson_number": 1,
  "duration_minutes": 60,
  "child_mission": "Solve the mystery of the missing seedlings by finding the main character, setting, problem and resolution. Then write your own four-part story map.",
  "learning_intention": "We are learning how characters, settings and connected events make a story, so we can explain how a plot develops.",
  "success_criteria": [
    "I can name a main character and justify my choice with an action.",
    "I can identify where and when a story happens using text clues.",
    "I can put the important plot events in order.",
    "I can distinguish the problem from the resolution.",
    "I can make a story map with evidence from the text."
  ],
  "materials": [
    "All original stories and diagrams are included.",
    "Optional pencil and paper to draw a story map."
  ],
  "outcome_codes": [],
  "review_status": "unreviewed",
  "pass": 1,
  "pass_mark": 0.9,
  "coming_soon": null,
  "source_note": null,
  "explicit_teaching": null,
  "resources": null,
  "sort_activity": null,
  "word_challenges": null,
  "suspense_builder": null,
  "planner_fields": null,
  "planner_title": null,
  "planner_intro": null,
  "spelling": null,
  "spelling_focus": null,
  "hoard_words": null,
  "follow_up_challenges": null,
  "steps": null,
  "visual_plan": null,
  "interactive_activities": [
    {
      "type": "flip_cards",
      "title": "Story evidence flashcards",
      "cards": [
        {
          "front": "Who makes the important choices?",
          "back": "Mara, Asha or Tessa: find the main character''s actions."
        },
        {
          "front": "What questions reveal setting?",
          "back": "Where does it happen? When does it happen?"
        },
        {
          "front": "How does plot differ from a list of objects?",
          "back": "Plot connects events through a complication, actions and consequences."
        },
        {
          "front": "What is a resolution?",
          "back": "The outcome that responds to the original problem."
        }
      ]
    }
  ],
  "printable_resource": {
    "title": "Story Detective Evidence Board",
    "instructions": "Read The Lost Lantern and complete each box using evidence from the story.",
    "passage": "Late on a rainy afternoon, Tessa arrived at the campsite beside the river. She was ready to read in her tent, but the lantern was gone. She checked the supplies box and spotted a trail of wet footprints near the cooking shelter. Tessa followed the footprints and found her cousin Ari carrying the lantern. “I took it to replace the batteries,” Ari said. They returned together, and the lantern shone brightly inside the tent.",
    "prompts": [
      "Who acts? Give an example.",
      "Where and when? Copy two clues.",
      "Number four important events in order.",
      "Name the problem and resolution. What must you not assume?"
    ]
  },
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "🕵️",
      "title": "Find the character who makes choices",
      "explain": "**A character is a person, animal or imagined being who takes part in a story.** The *main* character is often the one whose choices lead us through the events. A story may have other characters too.\n\nRead this original opening: *At dusk, Mara hurried into the community garden with an empty basket. The gate creaked behind her.* Who is acting? Mara hurries. The basket and gate are objects, not characters.\n\n**The important question:** Who acts or makes decisions? If someone is simply mentioned, that does not automatically make them the main character. Continue reading to see which person''s choices the story follows.",
      "example": "**WATCH MY THINKING**\n1. I underline *Mara hurried*. The name Mara identifies a person.\n2. I notice *basket* and *gate*, but neither makes a choice.\n3. Later Mara *follows* the prints and helps the seedlings. Her actions drive the story.\n4. I write: *Mara is the main character because she follows the clues and helps the plants.*\n\n**TRY:** In *Leo lifted a pot while Mara searched the shelf*, name both characters. Which character has been central to the story so far? Mara, because we follow her investigation.\n\n**CHECK:** A character answer needs evidence of an action, not just a name.",
      "notice": "Being named once is not enough to make someone the main character. Look for the person whose actions connect major events.",
      "check": {
        "type": "multiple_choice",
        "question": "Who is the main character of the missing-seedlings story?",
        "options": [
          "The garden gate",
          "Mara",
          "The empty basket",
          "The greenhouse"
        ],
        "correct_index": 1,
        "explanation": "Mara searches and follows the muddy prints; we experience the investigation through her actions."
      },
      "visual_before": [
        {
          "episode": {
            "title": "The missing seedlings: who, where, what changed?",
            "transcript": "Pip: Mara came to the garden with a basket, but the seedlings were missing. Is the basket the main character? Juno: No. Mara makes the decisions, so she is the main character. Pip: The garden is the setting, and the missing seedlings make a problem. Juno: Exactly. Pause and predict what the muddy footprints might lead Mara to find.",
            "scenes": [
              {
                "bg": "evening",
                "lines": [
                  {
                    "who": "pip",
                    "text": "Mara came to the garden with a basket, but the seedlings were missing. Is the basket the main character?"
                  },
                  {
                    "who": "juno",
                    "text": "No. Mara makes the decisions, so she is the main character."
                  },
                  {
                    "who": "pip",
                    "text": "The garden is the setting, and the missing seedlings make a problem."
                  },
                  {
                    "who": "juno",
                    "text": "Exactly. Pause and predict what the muddy footprints might lead Mara to find.",
                    "pause_after": true
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    {
      "icon": "📍",
      "title": "Locate the setting with two kinds of clues",
      "explain": "**The setting is where and when a story happens.** A location can be a house, beach, spaceship or garden. A time can be a season, morning, night, the distant past or a future year.\n\nRead the opening again: *At dusk, Mara hurried into the community garden.* *Community garden* names the location; *at dusk* names the time of day. The greenhouse is a more precise place inside the broader garden setting.\n\nSettings can affect events. A creaking gate at dusk may make a mystery feel different from a sunny playground at lunchtime. You should still separate what the text states from the mood you infer.",
      "example": "**WATCH MY THINKING**\n1. I ask **where?** and find *community garden*.\n2. I ask **when?** and find *at dusk*.\n3. I combine them: *The story takes place in a community garden at dusk.*\n\n**TRY:** *Early on Saturday, Nina searched the library.* Where is the scene? Library. When? Early on Saturday.\n\n**COMMON MISTAKE:** *Early* alone is not a location, and *library* alone is not a time. Keep the clues in the correct categories.",
      "notice": "Some stories give only where or only when. Record what is known, and don''t invent an exact date if none is supplied.",
      "check": {
        "type": "multiple_choice",
        "question": "Which phrase gives both where and when Mara''s story begins?",
        "options": [
          "At dusk in a community garden",
          "After school beside the ocean",
          "On Monday at the library",
          "In the greenhouse at sunrise"
        ],
        "correct_index": 0,
        "explanation": "The passage states *at dusk* and *community garden*; the other times and places are invented."
      }
    },
    {
      "icon": "🧭",
      "title": "Follow plot events in a useful order",
      "explain": "**Plot is the sequence of connected events in a story.** It is more than a list of objects. A beginning establishes the situation, a problem changes what the character needs to do, important actions follow, and an ending shows what happens as a result.\n\nOur mystery develops this way: Mara visits the garden → seedlings are missing → she finds muddy prints → she follows the prints → she and Leo set the seedlings upright. Each event helps explain why the next one matters.\n\nA useful story map keeps key turning points. You do not need to include every detail, such as the basket being empty, unless it helps the reader understand the problem or action.",
      "example": "**WATCH MY THINKING**\n1. **Beginning:** Mara arrives at the garden.\n2. **Problem:** The seedlings are not on the shelf.\n3. **Action:** Mara follows prints and discovers the overturned pots.\n4. **Ending:** Mara and Leo make the plants safe.\n\n**TRY:** Put these events in order: (A) plants are upright; (B) prints appear; (C) seedlings are missing. The logical order is C → B → A.\n\n**COMPARE:** ''There is a gate'' describes part of the scene, but it is not the turning point of the plot.",
      "notice": "A plot event should affect the story; a setting detail might help mood but may not move the problem forward.",
      "check": {
        "type": "multiple_choice",
        "question": "What happens immediately before Mara discovers Leo by the pots?",
        "options": [
          "Mara follows the muddy prints",
          "The caretaker arrives",
          "The seedlings are safe",
          "The story ends"
        ],
        "correct_index": 0,
        "explanation": "Following the muddy prints leads Mara to the greenhouse and the overturned pots."
      }
    },
    {
      "icon": "🌱",
      "title": "Separate the problem from its resolution",
      "explain": "**A problem or complication is what the main character needs to respond to.** A **resolution** is how the problem changes or is dealt with by the ending. A resolution may not solve everything perfectly, but it should connect to the original problem.\n\nThe missing seedlings create the complication. Finding them tipped over explains their disappearance. Setting them upright is the response that makes them safe. The story does not say somebody stole them, so we must not add a theft.\n\nWhen retelling a story, use clues rather than guesses: *The plants were missing from their shelf*, not *a thief took them*. This makes your map accurate.",
      "example": "**WATCH MY THINKING**\n1. The complication: *The seedlings were missing from their shelf.*\n2. The clue: *Muddy prints lead toward the greenhouse.*\n3. The explanation: *Leo says the wind knocked the pots over.*\n4. The resolution: *Mara and Leo stand the plants upright.*\n\n**TRY:** If a bike tyre is flat and a character repairs it, which event is the resolution? The repair.\n\n**CHECK:** A resolution must respond to the original difficulty; merely introducing a new location is not enough.",
      "notice": "The clues don''t prove a thief was involved. Explain the ending using what the story actually tells you.",
      "check": {
        "type": "multiple_choice",
        "question": "Which event resolves the seedling problem?",
        "options": [
          "The gate creaks",
          "Mara brings an empty basket",
          "Mara and Leo set the seedlings upright",
          "Muddy prints appear"
        ],
        "correct_index": 2,
        "explanation": "They set the seedlings upright and make the plants safe, directly addressing the original problem."
      }
    }
  ],
  "worked_example": "## Story detectives: solve the complete mystery\n\nRead the original story slowly. You can return to it while answering.\n\nAt dusk, Mara hurried into the community garden with an empty basket. The gate creaked behind her. The school seedlings were missing from their shelf. A line of muddy prints led towards the greenhouse. Mara followed them and found Leo kneeling beside overturned pots. \"The wind knocked them down,\" Leo said. Together they set each seedling upright. By the time the caretaker arrived, the plants were safe.\n\n**MODEL 1 — Who is the story about?** I look for actions. Mara *hurried*, *followed*, and *helped*. She is the main character. Leo is another character who helps at the ending.\n\n**MODEL 2 — Where and when?** *Community garden* and *at dusk* are stated in the first sentence. The greenhouse is a later, more specific place within the story.\n\n**MODEL 3 — What happens?** Beginning: Mara visits the garden. Problem: the seedlings are missing. Important action: she follows the prints and discovers overturned pots. Resolution: she and Leo put the seedlings upright.\n\n**MODEL 4 — What must I not assume?** Muddy prints are a clue, but the passage doesn''t say anyone stole a plant. The text offers a wind explanation. If I claim a theft, I change the story rather than map it.\n\n**Your first attempt:** Without looking at the model, explain which action by Mara was most important in moving the story forward. *Possible answer:* Following the muddy prints led her to the missing seedlings. Compare your answer with the model and revise if needed.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 580 280\"><rect width=\"580\" height=\"280\" rx=\"12\" fill=\"#f5f8f5\"/><rect x=\"16\" y=\"48\" width=\"170\" height=\"178\" rx=\"12\" fill=\"#dce9e3\"/><rect x=\"205\" y=\"48\" width=\"170\" height=\"178\" rx=\"12\" fill=\"#f9e9ce\"/><rect x=\"394\" y=\"48\" width=\"170\" height=\"178\" rx=\"12\" fill=\"#dce5f5\"/><text x=\"22\" y=\"29\" font-family=\"Arial\" font-size=\"20\" fill=\"#24372e\">Three clues to a story</text><text x=\"29\" y=\"85\" font-family=\"Arial\" font-size=\"19\">CHARACTER</text><text x=\"29\" y=\"115\" font-family=\"Arial\" font-size=\"16\">Who chooses?</text><text x=\"29\" y=\"150\" font-family=\"Arial\" font-size=\"17\">Mara</text><text x=\"218\" y=\"85\" font-family=\"Arial\" font-size=\"19\">SETTING</text><text x=\"218\" y=\"115\" font-family=\"Arial\" font-size=\"16\">Where? When?</text><text x=\"218\" y=\"150\" font-family=\"Arial\" font-size=\"17\">Garden at dusk</text><text x=\"407\" y=\"85\" font-family=\"Arial\" font-size=\"19\">PLOT</text><text x=\"407\" y=\"115\" font-family=\"Arial\" font-size=\"16\">What changes?</text><text x=\"407\" y=\"150\" font-family=\"Arial\" font-size=\"17\">Seedlings lost</text><text x=\"407\" y=\"180\" font-family=\"Arial\" font-size=\"17\">Then rescued</text><text x=\"30\" y=\"257\" font-family=\"Arial\" font-size=\"16\" fill=\"#24372e\">A basket is an object, not a decision-making character.</text></svg>",
      "alt": "Three labelled columns show character Mara, setting community garden at dusk, and plot from missing seedlings to their rescue.",
      "caption": "Find the person making decisions, the place and time, and the events that change the problem."
    }
  ],
  "guided_practice": "## Practise with a second original story\n\n*Just after sunrise, Asha opened the small town bakery. A trail of flour crossed the floor. The dough for the market had disappeared from the mixing table. Asha followed the trail to the pantry, where her brother Finn was carrying the bowl to a cooler shelf. “I moved it so it would not overheat,” he explained. Together they returned the dough and prepared the morning loaves.*\n\n**Try these before opening the feedback in your thinking:**\n\n1. **Character:** Who is the main character? Write an action as evidence. *Sentence starter:* “The main character is ____ because ____.”\n2. **Setting:** Where and when does the opening happen? Quote both clues.\n3. **Plot:** Order these: Asha follows flour → dough is missing → they prepare loaves. Label beginning, complication, action or ending where appropriate.\n4. **Resolution:** How does the problem change by the ending? Why is “someone stole the dough” unsupported?\n\n**CHECK YOUR ANSWERS:**\n1. Asha; she opens the bakery and follows the flour trail. Finn is another character.\n2. At the small town bakery, just after sunrise.\n3. Dough is missing → Asha follows flour → they prepare loaves after locating the dough.\n4. Asha learns Finn moved the bowl to protect the dough, and they return to baking. There is no evidence of theft.\n\n**If something was difficult:** Reread only the sentence containing the clue, then revise one answer before moving on.",
  "independent_task": "## Your own story map: The Lost Lantern\n\nRead this third original story. Then complete a **four-part story map in your own words**.\n\n*Late on a rainy afternoon, Tessa arrived at the campsite beside the river. She was ready to read in her tent, but the lantern was gone. She checked the supplies box and spotted a trail of wet footprints near the cooking shelter. Tessa followed the footprints and found her cousin Ari carrying the lantern. “I took it to replace the batteries,” Ari said. They returned together, and the lantern shone brightly inside the tent.*\n\n**Write these four headings with your answers:**\n\n**1. Character:** Name the main character and give one action that proves your choice.\n\n**2. Setting:** Name the place and the time/weather clues stated in the story.\n\n**3. Plot:** List *four* important events in order: opening situation, problem, response and ending. Use arrows or numbered sentences.\n\n**4. Problem and resolution:** Explain the specific problem and how it is resolved. Add one sentence about a conclusion you **cannot** make from the text (for example, that Ari intended to keep the lantern).\n\n**Self-check before submitting:** Does each claim have evidence? Is the order correct? Have you accidentally added something the narrator never said?\n\n**Challenge:** Rewrite the ending so the lantern still does not work, then describe how that changes the resolution.",
  "response_prompt": "Write your four-part Lost Lantern story map: character and action, setting clues, four ordered plot events, and problem/resolution with one unsupported inference to avoid.",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "Why is Tessa the main character of The Lost Lantern?",
      "options": [
        "She is named in the first sentence only",
        "She arrives, searches and follows the clues",
        "She owns the campsite",
        "Ari is never a character"
      ],
      "correct_index": 1,
      "explanation": "Tessa makes the decisions that connect the major events: looking for the lantern and following the footprints."
    },
    {
      "type": "multiple_choice",
      "question": "Which words tell us when The Lost Lantern begins?",
      "options": [
        "Beside the river",
        "A lantern was gone",
        "Late on a rainy afternoon",
        "Inside the tent"
      ],
      "correct_index": 2,
      "explanation": "*Late on a rainy afternoon* states the time and weather. *Beside the river* helps locate the place."
    },
    {
      "type": "multiple_choice",
      "question": "Which is a setting clue rather than a plot action?",
      "options": [
        "Tessa followed the footprints",
        "Ari replaced the batteries",
        "The lantern shone brightly",
        "The campsite beside the river"
      ],
      "correct_index": 3,
      "explanation": "A campsite beside the river describes where the story takes place rather than something a character does."
    },
    {
      "type": "multiple_choice",
      "question": "What is the main problem Tessa faces?",
      "options": [
        "She cannot find the lantern",
        "The river has disappeared",
        "The tent has blown away",
        "Ari cannot read"
      ],
      "correct_index": 0,
      "explanation": "The missing lantern is the complication that motivates Tessa''s search."
    },
    {
      "type": "multiple_choice",
      "question": "Which event comes directly after Tessa notices wet footprints?",
      "options": [
        "Ari returns to the tent",
        "She follows the footprints",
        "The lantern shines brightly",
        "The rain stops"
      ],
      "correct_index": 1,
      "explanation": "Tessa follows the footprint trail toward the cooking shelter, which leads to Ari."
    },
    {
      "type": "multiple_choice",
      "question": "Which event best shows the story''s resolution?",
      "options": [
        "The campsite is beside a river",
        "Tessa notices rain",
        "The lantern shines in the tent after the batteries are replaced",
        "Tessa arrives at the campsite"
      ],
      "correct_index": 2,
      "explanation": "The lantern works and is back in the tent, resolving the original missing-lantern problem."
    },
    {
      "type": "multiple_choice",
      "question": "What does the text NOT prove?",
      "options": [
        "There is a cooking shelter",
        "Ari intended to steal the lantern",
        "Ari was carrying the lantern",
        "The afternoon was rainy"
      ],
      "correct_index": 1,
      "explanation": "The story says Ari took the lantern to replace the batteries. It does not support a claim of theft."
    },
    {
      "type": "multiple_choice",
      "question": "Which story map keeps only important events in a logical order?",
      "options": [
        "Lantern missing → footprints followed → Ari found → lantern works",
        "Lantern works → Tessa arrives → lantern missing → footprints appear",
        "Rain → river → tent → batteries with no connected actions",
        "Ari appears → tent vanishes → Tessa finds a map → lantern stolen"
      ],
      "correct_index": 0,
      "explanation": "The first sequence tracks the complication, investigation and resolution without inventing extra events."
    },
    {
      "type": "short_answer",
      "question": "Write a story map of The Lost Lantern naming its main character, setting and at least three events in order.",
      "sample_answer": "Tessa is the main character because she searches for the lantern and follows the wet footprints. The setting is a campsite beside a river, late on a rainy afternoon. The lantern is missing, Tessa notices and follows footprints, she finds Ari with it, and the lantern works again after the batteries are replaced.",
      "marking_guide": "Look for Tessa with action evidence, campsite/river and late rainy afternoon, and a correctly ordered sequence involving lantern missing, footprints, Ari and a working lantern.",
      "explanation": "A story map organises specific evidence in narrative order."
    },
    {
      "type": "short_answer",
      "question": "Explain the problem and resolution in The Lost Lantern and one conclusion that would be unsupported.",
      "sample_answer": "The problem is that the lantern is gone when Tessa wants to read. Ari has taken it to replace the batteries, and they return together with a working lantern. It would be unsupported to say Ari intended to steal it because the text gives a different explanation.",
      "marking_guide": "Require missing lantern, Ari''s battery replacement and return, plus rejection of an unsupported claim such as deliberate theft.",
      "explanation": "An evidence-based resolution responds to the stated complication without adding imagined motives."
    }
  ],
  "parent_notes": "Parent: **Teaching evidence.** Check that the child can distinguish character, setting and plot *using clues*, not just recite terms. Listen to an oral retelling or read the four-part story map. If a location or time is invented, ask the child to point to the supporting phrase.\n\nParent: **Written quiz 1 model.** Tessa is the main character because she searches for the lantern and follows the wet footprints. The setting is a campsite beside a river, late on a rainy afternoon. The lantern is missing, Tessa notices and follows footprints, she finds Ari with it, and the lantern works again after the batteries are replaced.\n\nParent: **Written quiz 2 model.** The problem is that the lantern is gone when Tessa wants to read. Ari has taken it to replace the batteries, and they return together with a working lantern. It would be unsupported to say Ari intended to steal it because the text gives a different explanation.\n\nParent: **Review and next step.** Mark the two written answers for accuracy and supported reasoning. A child who confuses complication and resolution should retell the story with beginning, problem, action and ending cards before retrying. Eight scored MCQs at a 90% threshold require eight correct; do not claim an unsupported skill is mastered from clicks alone.",
  "evidence_instructions": "Save the four-heading Lost Lantern map, at least one revised response, the eight topic-specific multiple choice answers and both written quiz answers. A photograph of a handwritten map or a typed map is equally acceptable.",
  "offline_alternative": "Read or copy the original three short stories on paper. Draw four boxes labelled Character, Setting, Plot, Problem/Resolution and fill them with clues. The learner may explain orally to a parent; keep notes or a photo as evidence.",
  "extension": "Write a new four-sentence ending in which the lantern still does not work. Describe how this changes the resolution, but keep the same character and setting.",
  "stage_hints": {
    "accept": [
      "Your mission is to find who acts, where and when, and what changes in the story.",
      "Look at the four success statements. You will first practise on Mara''s mystery.",
      "A written answer or a photo of a handwritten story map both count as evidence."
    ],
    "teach0": [
      "Who follows the clues in the garden? Find a verb near a person''s name.",
      "A basket can be important, but it does not choose to investigate. Look for someone who does.",
      "Reread the ending: who helps make the plants safe? Connect that action to the main character."
    ],
    "teach1": [
      "Setting has two parts: location and time. Look at the first sentence.",
      "Find a phrase that names a garden and another that says what part of the day it is.",
      "If you wrote a date, check whether the narrator actually supplied one; revise unsupported details."
    ],
    "teach2": [
      "Look for the event that makes the character act.",
      "Follow the sequence: something is missing, a clue appears, someone investigates.",
      "Find the event that changes the plants'' situation at the end and put it last."
    ],
    "teach3": [
      "What goes wrong before anyone begins to look for clues?",
      "How do the characters help the plants at the ending?",
      "Do the muddy marks prove theft? Separate what happened from what you guessed."
    ],
    "learn": [
      "Use the three columns in the diagram: who, where/when, what changes.",
      "Look at the worked story''s beginning, complication, search and solution.",
      "Explain why the footprints matter for the investigation rather than merely listing them."
    ],
    "guided": [
      "Start with Asha''s action at the bakery. Who follows the flour?",
      "Look at the first sentence for place and time clues.",
      "Keep the events in causal order: missing dough, trail, discovery, then return to baking."
    ],
    "write": [
      "Copy the four headings first: Character, Setting, Plot, Problem/Resolution.",
      "Look for Tessa''s actions and for words naming the location and time.",
      "Check that your sequence moves from missing lantern to finding Ari and restoring light. Add a sentence rejecting one unsupported claim."
    ],
    "quiz": [
      "Read the relevant sentence again before choosing. Every question refers to the lantern story.",
      "Separate location/time questions from action questions; they ask for different clues.",
      "For the written responses, use evidence from the passage and avoid assuming anyone intended harm."
    ],
    "submit": [
      "Check that the four headings all have answers, not just labels.",
      "Check the order of your plot and whether your problem matches your resolution.",
      "Read the map aloud once. Fix an unsupported detail, then submit your own work."
    ]
  }
}'),updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE seed_key='s2-eng-y3-w02-l1';
