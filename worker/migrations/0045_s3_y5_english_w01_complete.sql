-- Approved Lesson Standard v2. Year 5 English Week 1: four complete lessons.
-- One UPDATE per lesson; preserve IDs, ownership, unit links and assignments.
-- Migration 0043 remains reserved by PR #95; 0044 is the approved gold lesson.
-- Each SQL statement is below the D1 statement limit; complete arrays are supplied.

UPDATE lessons
SET title = 'Year 5: Read a plot as a chain of choices',
    data = json_patch(data, '{
  "seed_key": "s3-eng-y5-w01-l1",
  "title": "Year 5: Read a plot as a chain of choices",
  "stage": "S3",
  "learning_area": "English",
  "year_level": "Year 5",
  "week": 1,
  "lesson_number": 1,
  "duration_minutes": 60,
  "child_mission": "Become a Plot Investigator. Trace a character''s goal, obstacle and choices, then explain how those choices lead to the ending.",
  "learning_intention": "We are learning to explain how a narrative''s events connect through problems, choices and consequences.",
  "success_criteria": [
    "I can identify a character''s goal and the obstacle to it.",
    "I can distinguish an important plot event from a background detail.",
    "I can explain how a choice causes a later event.",
    "I can explain a turning point and resolution using evidence."
  ],
  "materials": [
    "This lesson contains the texts and examples you need",
    "Optional: paper and a pencil"
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
  "hoard_words": null,
  "follow_up_challenges": null,
  "steps": null,
  "visual_plan": null,
  "teach_steps": [
    {
      "icon": "🔎",
      "title": "Find the goal and obstacle",
      "explain": "**A story needs more than events.**\nA narrative tells a story. Its plot is the connected sequence of events. To follow the plot, begin with what a character wants and what gets in the way.\n\nThe opening, often called the orientation, introduces useful information about the people, place and situation. You do not need every detail to understand the problem.\n\n**Name the goal.**\nA goal is something a character is trying to achieve. Ask, “What would success look like for this person?” Use a specific action: label the seedling table before the market opens is clearer than do something good.\n\n**Name the obstacle.**\nAn obstacle makes the goal harder to reach. It may be a damaged object, a difficult decision or a disagreement. The complication is the problem or disruption that drives the story forward.\n\n**Try the two-part sentence.**\n“The character wants ____, but ____.” Read the opening carefully before filling the gaps. An object mentioned in a story is not automatically its problem; explain what it prevents.",
      "example": "I DO: Read this short opening.\nMaya wanted to deliver a model to the library exhibition. When she lifted its box, one corner came loose.\n\nI ask what Maya is trying to do. Her goal is to deliver the model. I ask what may stop her. The loose box corner could make carrying it difficult.\n\nMy explanation: “Maya wants to deliver her model, but its box has come loose.” The model is not itself the obstacle.\n\nYOU TRY:\nRavi wanted to read his speech at the hall. He discovered that two pages were out of order.\nName the goal and obstacle before reading on.\n\nCHECK:\nHis goal is to read the speech. The pages being out of order make that harder. “He has pages” is a detail, not an explanation of the obstacle.",
      "notice": "Check the relationship between the problem and the goal. If your obstacle is just a noun, add what is wrong and why it matters.",
      "check": {
        "question": "Maya wants to deliver her model, but its box has come loose. What is her goal?",
        "options": [
          "The corner of a box",
          "Delivering her model",
          "Having a loose box",
          "Finding an exhibition title"
        ],
        "correct_index": 1,
        "explanation": "Delivering the model is what Maya is trying to achieve. The loose corner is an obstacle to that goal; the other details do not name what she wants to accomplish."
      }
    },
    {
      "icon": "🔗",
      "title": "Connect a choice to its consequence",
      "explain": "**Ask why the next event happens.**\nA consequence is a result. A character''s choice can cause a consequence, which creates the next part of the plot. Read for the connection, not only for what happens first.\n\n**Order and cause are different.**\nThen tells us an event follows another. Because or so can help explain a cause or result. Two events can happen in order without one causing the other.\n\n“The bell rang. Then the sun appeared” tells an order. It does not establish that the bell made the sun appear. For a story connection, find what the text actually supports.\n\n**Use the evidence.**\n“The paper tore because Leo traced the faded letters with a pencil” connects an attempt with its result in our story. You can explain that connection without adding a new event.\n\n**Test importance.**\nAsk, “If I removed this event, would the next action still make sense?” Background details help us picture a scene. Important plot events usually change what the character can do next.",
      "example": "I DO:\nMaya taped the corner of the box. The model stayed inside when she lifted it.\n\nChoice: Maya tapes the loose corner.\nConsequence: She can lift the box with the model inside.\nConnection: “Maya taped the corner, so she could carry the model.”\n\nCompare: “Maya wore a green jumper. She taped the box.” The jumper detail does not explain why the box holds.\n\nYOU TRY:\nRavi numbered his mixed pages. He could put the speech back in order.\nExplain why the second event happens.\n\nCHECK:\nNumbering the pages helps him arrange the speech. You could write, “Ravi could order the speech because he numbered its pages.” Keep the explanation within what the text tells you.",
      "notice": "Do not turn every pair of events into a cause. Look for a supported action-and-result link and leave out causes you have invented.",
      "check": {
        "question": "Ravi numbered the mixed pages, so he could order his speech. Which part is the consequence?",
        "options": [
          "He had some pages",
          "The hall was nearby",
          "He could order the speech",
          "His name was Ravi"
        ],
        "correct_index": 2,
        "explanation": "Being able to order the speech is the result of numbering the pages. The other details do not state the result of that action."
      },
      "visual": [
        {
          "alt": "A plot connection: a goal meets an obstacle; a choice leads to a consequence. Ask why the next event happens.",
          "caption": "Explain the connection, not only the order.",
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 178\"><rect width=\"420\" height=\"178\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">Goal → obstacle → choice</text><text x=\"16\" y=\"80\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">Choice → consequence</text><text x=\"16\" y=\"126\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">Ask: why did this happen?</text></svg>"
        }
      ]
    },
    {
      "icon": "↪️",
      "title": "Locate the turning point",
      "explain": "**A turning point changes the direction.**\nA turning point is a moment when an important discovery, decision or event changes how the problem develops. It is not automatically the exact middle sentence or the loudest moment.\n\n**Track what changes.**\nBefore the turning point, a character may keep using an approach that does not work. Afterwards, the character follows a different route towards the goal. Name both sides of that change.\n\nIn our market story, tracing the large sign fails. Noor notices spare labels and chooses a different solution. The change is from repairing one large sign to making individual labels.\n\n**Support your interpretation.**\nReaders may choose different important moments. Explain why your moment changes the character''s next action. “It is exciting” describes your reaction but does not explain its role.\n\n**Make a before-and-after statement.**\n“Before ____, the character ____. After ____, the character ____.” This helps you test whether the event changes the plot.",
      "example": "I DO:\nMaya first tries carrying the broken box without fixing it. It tilts. She finds tape and decides to repair the corner.\n\nI choose the repair decision as a turning point. Before it, she repeats a risky carrying attempt. After it, she changes the box before carrying it.\n\nWeak explanation: “Finding tape is the turning point because tape appears.”\nBetter explanation: “Finding tape lets Maya change her plan from carrying the loose box to repairing it.”\n\nYOU TRY:\nRavi tries reading the mixed pages from memory. Then he sees that the pages have numbered headings and rearranges them.\nWhat changes in his approach?\n\nCHECK:\nHe changes from trying to remember the speech to using the headings to organise its pages. That change explains why the new approach can help.",
      "notice": "A turning point needs an explanation of change. Being halfway through the text is not evidence by itself.",
      "check": {
        "question": "What best supports a turning-point explanation?",
        "options": [
          "It changes the character''s approach to the problem",
          "It has the longest sentence",
          "It is exactly halfway down the page",
          "It includes a new colour word"
        ],
        "correct_index": 0,
        "explanation": "A turning point changes the direction of the problem or the character''s approach. Sentence length, page position and colour details do not establish that change."
      },
      "visual_before": [
        {
          "episode": {
            "title": "A turning point needs a change",
            "transcript": "Pip: A story''s middle is not automatically its turning point. What should I look for?\nJuno: Find a discovery or decision that changes the character''s next action.\nPip: So I compare the approach before the moment with the approach afterwards.\nJuno: Pause and try. Explain what changes in a short story you have just read.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "A story''s middle is not automatically its turning point. What should I look for?"
                  },
                  {
                    "who": "juno",
                    "text": "Find a discovery or decision that changes the character''s next action."
                  },
                  {
                    "who": "pip",
                    "text": "So I compare the approach before the moment with the approach afterwards."
                  },
                  {
                    "who": "juno",
                    "text": "Pause and try. Explain what changes in a short story you have just read.",
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
      "icon": "🧭",
      "title": "Explain the resolution and change",
      "explain": "**Show what happens to the problem.**\nThe resolution tells us how the main problem ends or settles. It may be a success, a partial success or an unresolved outcome. Do not assume every narrative has a happy ending.\n\nFor this week''s practice stories, ask whether the opening goal has been achieved and what detail proves it. A final setting description is not enough if it tells us nothing about the problem.\n\n**Notice what the character learns.**\nA reflection or final response can show how the character''s thinking changes. It is useful when supported by words or actions in the text. Avoid claiming someone becomes a different person without evidence.\n\n**Write a plot explanation.**\nInclude goal, obstacle, significant attempt, turning point and result. Connect them with reasons. A plot explanation is more than copying every sentence.\n\n**Reread to check.**\nCould a reader who has not seen the story follow your explanation? Have you supported your claims without adding events? Revise one unclear connection.",
      "example": "I DO:\nMaya carries the repaired box to the exhibition. She puts the model on the display table and adds tape to her bag for next time.\n\nResolution: The model reaches the display table, so the delivery goal is achieved.\nPossible change: Putting tape in her bag suggests she is preparing for future problems. I say suggests because I am explaining evidence.\n\nCOMMON MISTAKE:\n“The ending is that Maya wears a green jumper.” This background detail does not show what happens to her delivery problem.\n\nYOU TRY:\nRavi reads his reordered speech and keeps the numbered pages for the next event.\nWhat resolves the problem?\n\nCHECK:\nReading the speech in order resolves the mixed-page problem. Keeping the numbered pages suggests he values a useful preparation strategy.",
      "notice": "Separate what the text states from what you infer. An inference is an evidence-based interpretation, not an invented event.",
      "check": {
        "question": "Which detail best shows Maya''s delivery problem is resolved?",
        "options": [
          "She owns a bag",
          "The box has a corner",
          "Her jumper is green",
          "The model is on the exhibition table"
        ],
        "correct_index": 3,
        "explanation": "The model reaching the exhibition table shows that Maya achieved the delivery goal. The other details do not establish that the model arrived successfully."
      }
    }
  ],
  "worked_example": "I DO: Read our original story first.\n\nTHE SIGN BEFORE THE MARKET\n\nNoor and Leo had promised to label the seedling table at the community hall before the Saturday market opened. Noor had painted a large sign the afternoon before. She hoped visitors would find their table without needing directions.\n\nWhen they reached the hall, Noor unfolded the sign. A damp patch had blurred three words. The seedlings were ready, but nobody could read their names. The doors would open in twenty minutes.\n\nLeo tried tracing the faded letters with a pencil. The paper tore under the point. Noor pressed her palms against the table. Repainting the whole sign would take too long.\n\nThen she noticed the blank backs of last week''s cardboard labels. Instead of one large sign, they could make a clear label for each tray. Noor wrote the names while Leo checked them against the list they had brought.\n\nThey arranged the labels where visitors could read them. When the doors opened, a visitor pointed to a tray and said its name correctly. Noor smiled. Their table looked different from her plan, but it was ready.\n\nShe tucked the damaged sign into her bag. Next time, she would bring spare labels before anything went wrong.\n\nMY EVIDENCE-BASED PLOT EXPLANATION\nNoor and Leo want the seedling table labelled before the market opens. The large sign is blurred and time is short. Leo tries tracing the letters, but the paper tears. Noor''s discovery of blank-backed labels changes the approach: they stop trying to fix one sign and make individual labels instead. Because they write and check the labels, a visitor can identify a tray when the doors open. The labelling goal is achieved. Noor''s plan to bring spare labels suggests that she has learned to prepare a backup.\n\nWHY MY EXPLANATION WORKS\nI connect the obstacle to the goal. I include the failed attempt because it explains why they need another approach. I name a turning point and show its effect. I use the visitor''s response as evidence of the outcome. I distinguish the stated plan from my interpretation of what Noor learned.\n\nCOMMON MISTAKE AND FIX\nWeak: “Noor goes to the hall. The doors open. Her plan changes.” This gives an order but leaves out the reason for the change. Fix: add the damaged sign, failed tracing attempt and choice to make individual labels.",
  "worked_visuals": [
    {
      "alt": "Before and after the turning point: repairing the large sign changes to labelling each tray when spare labels are discovered.",
      "caption": "State what changes, then support it with a story detail.",
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 178\"><rect width=\"420\" height=\"178\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">Before: repair the large sign</text><text x=\"16\" y=\"80\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">Change: use spare labels</text><text x=\"16\" y=\"126\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">After: label each tray</text></svg>"
    }
  ],
  "guided_practice": "WE DO: Use the market story, one decision at a time.\n1. Complete “Noor wants ____, but ____.” Try before reading the suggestion. Suggestion: she wants the table labelled before opening, but the large sign is unreadable.\n2. Find one failed attempt. Explain its result. Suggestion: Leo traces the letters and the paper tears. This result makes repairing the old sign less useful.\n3. Compare the approach before and after Noor notices spare labels. Suggestion: they change from repairing one sign to writing individual labels.\n4. Find a detail showing success. Suggestion: a visitor identifies a tray correctly when the doors open.\n5. Write two connected sentences explaining the turning point and result. Starter: “When Noor ____, she decided ____. This meant ____.”\nCheck your explanation against the story. Another wording is fine if the connection is supported. Do not copy the suggestion before trying your own idea.",
  "independent_task": "YOU DO: Plot Investigator report (about 20 minutes)\nRead the market story again. All the text you need is above.\n1. Make five short notes: goal; obstacle; significant attempt and result; turning point; resolution.\n2. Beside the turning point, name the approach before and after it.\n3. Write a paragraph of about 100–150 words explaining how the events connect. Use at least two story details as evidence. You may write on paper or type in the big box.\n4. Check: Have I explained why the events happen? Have I shown how the problem ends? Have I separated an inference from a stated event?\n5. Improve one unclear link. If you worked on paper, type your report or a summary of the five notes and one cause-and-result sentence. Keep the paper for review; no upload is required.\nThen answer the reflection question.",
  "response_prompt": "Which detail most helped you explain the turning point, and why?",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "What is a character''s goal?",
      "options": [
        "A detail describing the weather",
        "The longest sentence",
        "Something the character is trying to achieve",
        "Every object in the story"
      ],
      "correct_index": 2,
      "explanation": "A goal is what a character is trying to achieve. Descriptions, sentence length and lists of objects do not define the desired achievement."
    },
    {
      "type": "multiple_choice",
      "question": "In the market story, what mainly obstructs the labelling goal?",
      "options": [
        "The large sign is blurred",
        "The seedlings have names",
        "The hall has doors",
        "Noor brings a bag"
      ],
      "correct_index": 0,
      "explanation": "The blurred sign cannot identify the seedlings clearly. The other details do not by themselves prevent the table being labelled."
    },
    {
      "type": "multiple_choice",
      "question": "Why does Leo''s tracing attempt matter to the plot?",
      "options": [
        "It gives the hall a colour",
        "It describes the whole market",
        "It tells us the time of year",
        "Its failure helps explain the change of approach"
      ],
      "correct_index": 3,
      "explanation": "The paper tearing shows the old approach failing, which helps explain why a different solution is needed."
    },
    {
      "type": "multiple_choice",
      "question": "Which pair clearly shows a choice and its consequence in the story?",
      "options": [
        "Noor has a bag; the hall has doors",
        "They write labels; a visitor identifies a tray",
        "It is Saturday; Noor smiles",
        "There are seedlings; Leo has a name"
      ],
      "correct_index": 1,
      "explanation": "Writing readable labels helps the visitor identify a tray. The other pairs do not establish a supported choice-and-result connection."
    },
    {
      "type": "multiple_choice",
      "question": "What changes after Noor notices spare labels?",
      "options": [
        "The opening time changes",
        "They move to another hall",
        "They make individual labels instead of repairing one sign",
        "The story stops having a goal"
      ],
      "correct_index": 2,
      "explanation": "The discovery enables a different method for reaching the same goal: individual labels replace the attempt to repair one large sign."
    },
    {
      "type": "multiple_choice",
      "question": "Why is page position alone a weak turning-point explanation?",
      "options": [
        "A turning point needs evidence of a meaningful change",
        "The middle of a page is never important",
        "Stories cannot have paragraphs",
        "Every sentence has the same effect"
      ],
      "correct_index": 0,
      "explanation": "A turning point is explained by a change in direction or approach. Being in the middle does not prove that function; a middle event can still matter if it causes a change."
    },
    {
      "type": "multiple_choice",
      "question": "Which detail supports the resolution?",
      "options": [
        "The afternoon before is mentioned",
        "Noor once painted a sign",
        "The hall has a table",
        "A visitor correctly names a tray"
      ],
      "correct_index": 3,
      "explanation": "The visitor''s correct identification shows the new labels are doing their job, supporting achievement of the labelling goal."
    },
    {
      "type": "multiple_choice",
      "question": "Which explanation distinguishes interpretation from a stated event?",
      "options": [
        "Noor secretly builds a new hall",
        "Her plan to bring spares suggests she learned to prepare a backup",
        "The text says Leo owns ten trays",
        "Noor never encounters problems again"
      ],
      "correct_index": 1,
      "explanation": "The plan to bring spare labels is stated evidence; saying it suggests learning clearly marks an interpretation. The other claims invent unsupported details."
    },
    {
      "type": "short_answer",
      "question": "Explain the turning point in the market story using a before-and-after comparison.",
      "sample_answer": "Before Noor noticed the spare labels, they tried repairing the large sign. Afterwards, they made individual labels, giving them a different way to reach the goal.",
      "marking_guide": "Accept a supported change of approach with both before and after. The discovery or decision may be named as the key moment.",
      "explanation": "A strong explanation identifies how the moment changes what the characters do, not just where it appears."
    },
    {
      "type": "short_answer",
      "question": "Choose a consequence of a character''s action and explain it using because or so.",
      "sample_answer": "They wrote and checked individual labels, so a visitor could identify a tray correctly.",
      "marking_guide": "Accept another accurate action-and-result pair supported by the story. Require a genuine connection rather than merely two consecutive events.",
      "explanation": "The explanation should connect a supported action to its result without inventing a cause."
    }
  ],
  "parent_notes": "Parent: Teaches narrative goals, obstacles, cause-and-result chains, turning points and resolutions at Year 5 level. Outcome codes are intentionally empty: an exact Stage 3 outcome mapping was not verified from the accessible NESA page. All story content is original fiction. This lesson follows the repository''s Year 5 narrative sequence; it does not claim to cover an entire syllabus outcome.\n\nParent: Look for connected explanations with evidence, rather than a list of events. Allow different defensible turning-point interpretations.\n\nParent: Let the child attempt each practice before comparing the suggestion. If reading load is a barrier, split the story into paragraphs; do not supply the scored answers.\n\nParent: The quiz has eight scored choices and two written responses. The existing 90% threshold requires 8/8 choices. Written responses are included in the submission for your review, not automatically graded. Model for question 9: Before Noor noticed the spare labels, they tried repairing the large sign. Afterwards, they made individual labels, giving them a different way to reach the goal. Model for question 10: They wrote and checked individual labels, so a visitor could identify a tray correctly.\n\nParent: A good report links the blurred sign, failed tracing and new-label solution. A short summary can still demonstrate understanding if its connections are accurate; note any adult reading support.",
  "evidence_instructions": "Keep the five plot notes, connected explanation, reflection and both written quiz responses. Review whether the child supports each connection with the text.",
  "offline_alternative": "Copy or print the story and make the five notes on paper. Write the explanation and reflection beside them. Later type a summary and complete the quiz on the site.",
  "extension": "Explain whether Noor noticing the labels or choosing to use them is the stronger turning-point description. Support your view without claiming there is only one possible interpretation.",
  "stage_hints": {
    "accept": [
      "Read the mission and look for the goal, problem and choices you will investigate.",
      "Begin with the first teaching step; you do not need to know the plot terms yet.",
      "Keep paper ready for five short notes, or use the text box later. The story is included in the lesson."
    ],
    "teach0": [
      "Look back at the difference between a goal and an obstacle.",
      "Ask what success would look like for the character, then what makes it harder.",
      "Use “The character wants ____, but ____.” Fill the first gap with an intended action, not an object."
    ],
    "teach1": [
      "Look back at the action-and-result example.",
      "Separate what the character does from what happens as a result.",
      "Try joining the two parts with because or so. Check that the text supports the connection."
    ],
    "teach2": [
      "Reread the before-and-after explanation.",
      "Find what approach the character uses on each side of the important moment.",
      "Use “Before this moment, ____. Afterwards, ____.” Test whether the approach actually changes."
    ],
    "teach3": [
      "Look back at the opening goal and the ending evidence.",
      "Find an ending detail that tells you what happened to the main problem.",
      "Ask whether the goal is achieved, partly achieved or still unresolved. Use a detail, not just the final sentence''s position."
    ],
    "learn": [
      "Read the original story before the model explanation.",
      "Follow one part of the model at a time and locate its evidence in the story.",
      "Begin with a goal-and-obstacle note, then trace the significant attempt that follows."
    ],
    "guided": [
      "Try the first numbered prompt before reading its suggestion.",
      "Make one short note about Noor''s goal, then a second about what blocks it.",
      "Use “Noor wants ____, but ____.” Return to the story to fill each gap in your own words."
    ],
    "write": [
      "Look back at your five notes before drafting.",
      "Begin with the goal and obstacle, then connect the failed attempt to the changed approach.",
      "Start “Noor and Leo want ____, but ____.” Explain that first connection before adding the turning point."
    ],
    "quiz": [
      "Return to the teaching step matching the term in the question.",
      "Separate goal, obstacle, action and result before comparing options.",
      "For a written explanation, use a before-and-after comparison or a supported because/so link. Do not add events."
    ],
    "submit": [
      "Check that your report and reflection are ready for review.",
      "Make sure the five-note summary and both written responses are included.",
      "If your work is on paper, type a concise summary and keep the sheet. Send your explanation for a grown-up to review."
    ]
  }
}'),
    updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
WHERE seed_key = 's3-eng-y5-w01-l1';

UPDATE lessons
SET title = 'Year 5: Plan and draft a connected narrative',
    data = json_patch(data, '{
  "seed_key": "s3-eng-y5-w01-l2",
  "title": "Year 5: Plan and draft a connected narrative",
  "stage": "S3",
  "learning_area": "English",
  "year_level": "Year 5",
  "week": 1,
  "lesson_number": 2,
  "duration_minutes": 60,
  "child_mission": "Become a Story Architect. Build a character''s goal, test it with an obstacle and shape choices that lead to a believable ending.",
  "learning_intention": "We are learning to plan and draft a narrative whose events connect through a character''s choices.",
  "success_criteria": [
    "I can introduce a character, setting and goal.",
    "I can develop a problem with connected attempts and consequences.",
    "I can write an ending that follows from an earlier choice.",
    "I can revise one weak connection in my draft."
  ],
  "materials": [
    "This lesson contains the texts and examples you need",
    "Optional: paper and a pencil"
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
  "planner_fields": [
    {
      "key": "goal_obstacle",
      "label": "Character, place, goal and obstacle",
      "hint": "Who wants to do what, where, and what prevents it?"
    },
    {
      "key": "attempts_change",
      "label": "Attempt, consequence and changed approach",
      "hint": "What fails or reveals something? What will the character choose next?"
    },
    {
      "key": "ending_evidence",
      "label": "Ending and its preparation",
      "hint": "How does a choice affect the goal? What earlier detail prepares that solution?"
    }
  ],
  "planner_title": "Build your cause-and-choice plan",
  "planner_intro": "Use short notes in all three boxes. Include the action and reason, not just one-word headings.",
  "spelling": null,
  "hoard_words": null,
  "follow_up_challenges": null,
  "steps": null,
  "visual_plan": null,
  "teach_steps": [
    {
      "icon": "🏗️",
      "title": "Build an opening with a purpose",
      "explain": "**Give the reader somewhere to begin.**\nA narrative is a story. Its opening, or orientation, introduces a character and useful information about the place and situation. A detailed opening does not need to describe everything the character owns.\n\n**Introduce a goal.**\nA goal is something the character wants to achieve. It gives the reader a reason to follow the next events. “Eli wanted to finish a drawing” is clearer than “Eli was a person.”\n\nChoose a setting detail that matters. If the hall opens in ten minutes, the time creates pressure. A list of unrelated colours may picture the room but will not establish the goal.\n\n**Draft in two small moves.**\nFirst introduce someone doing something in a place. Then show what they want. You can combine the moves, but drafting them separately helps when you are beginning.\n\n**Try and check.**\nRead your opening and ask a reader''s question: “What is this character trying to do?” If your own words do not answer it, add a specific goal.",
      "example": "I DO:\nAt the community hall, Eli balanced a cardboard model on the display table. He wanted to show how its moving part worked before the visitors arrived.\n\nMy first sentence places Eli and the model. My second names a goal and a time pressure. I leave out the colour of every chair because it does not help this opening.\n\nCOMPARE:\n“Eli had blue shoes, a hat, a table and a bag.” This lists possessions but leaves the reader guessing about the story''s purpose.\n\nYOU TRY:\nStart a story about a child preparing a display. Write one place-and-action sentence and one goal sentence.\n\nCHECK:\nThere are many answers. Check for a named character, a place and an intended achievement. A detail matters when it helps the reader understand the situation.",
      "notice": "A setting description should help the story, not postpone it indefinitely. Keep the goal specific enough to create a meaningful problem.",
      "check": {
        "question": "Which opening gives a character a clear goal?",
        "options": [
          "Eli had a shirt, shoes and a bag",
          "There were many chairs in the hall",
          "Eli wanted to demonstrate his model before visitors arrived",
          "The table was beside a chair"
        ],
        "correct_index": 2,
        "explanation": "Wanting to demonstrate the model before visitors arrive names a specific achievement. The other choices give details without a goal."
      }
    },
    {
      "icon": "⚙️",
      "title": "Make an obstacle matter",
      "explain": "**Put something between the character and the goal.**\nAn obstacle makes the goal harder to reach. The complication is the story''s problem or disruption. It should matter to the goal rather than appear as an unrelated surprise.\n\nIf Eli wants to demonstrate a model, a jammed moving part is a relevant obstacle. A distant event that never affects him may be dramatic but will not help this plot.\n\n**Show the effect.**\nDo not only name the obstacle. Show what the character cannot do now: the part will not turn, so Eli cannot demonstrate the action. This gives the next choice a reason.\n\n**Plan a connected attempt.**\nThe character tries something in response. Its consequence, or result, may solve part of the problem or make another attempt necessary. You can use the planning link “Because ____, the character decides ____.”\n\n**Keep the size manageable.**\nFor a short narrative, one main problem with two connected attempts is enough to practise. You do not need a new disaster in every sentence.",
      "example": "I DO:\nObstacle: Eli''s model wheel jams.\nEffect: He cannot demonstrate the moving part.\nFirst attempt: He pushes the wheel harder.\nConsequence: The cardboard bends, so pushing harder is not useful.\n\nThe sequence connects. The obstacle affects the goal, the attempt responds to the obstacle and the result gives Eli a reason to change his approach.\n\nCOMMON MISTAKE:\n“His wheel jams. Then he wins a prize in another town.” The new event does not explain how he deals with this problem.\n\nYOU TRY:\nA character wants to label a display, but the marker runs out. Name one relevant attempt and a possible result.\n\nCHECK:\nBorrowing a pencil or making raised-letter labels could be relevant choices. Explain how the attempt changes what the character can do; avoid solving a different problem.",
      "notice": "An attempt can fail usefully: it should reveal something or lead to the next decision. Random events do not automatically create a connected plot.",
      "check": {
        "question": "Eli wants to demonstrate his model. Which obstacle most directly affects that goal?",
        "options": [
          "His model''s moving part jams",
          "An unrelated street changes its name",
          "A visitor owns a red bag",
          "The hall has a window"
        ],
        "correct_index": 0,
        "explanation": "A jammed moving part prevents the demonstration. The other details do not establish a relevant barrier to that goal."
      },
      "visual": [
        {
          "alt": "A planning chain starts with demonstrating a model, meets a jammed wheel, and connects an attempt to a result and new choice.",
          "caption": "Each action should respond to what happened before.",
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 178\"><rect width=\"420\" height=\"178\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">Goal: demonstrate the model</text><text x=\"16\" y=\"80\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">Obstacle: the wheel jams</text><text x=\"16\" y=\"126\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">Attempt → result → new choice</text></svg>"
        }
      ]
    },
    {
      "icon": "↪️",
      "title": "Earn the turning point and ending",
      "explain": "**Let the character respond to what they learn.**\nA turning point changes the direction of the problem. For this draft, make it a discovery or decision that leads to a new approach. The resolution shows how the main problem settles.\n\n**Prepare the solution.**\nIf a character uses a useful object or idea at the end, introduce it earlier or explain where it comes from. A solution that suddenly appears without explanation can leave a reader confused.\n\nThis does not mean every ending must be predictable. A surprising solution can still follow from earlier information.\n\n**Connect action to result.**\nEli might notice that a folded edge is blocking the wheel. Straightening that edge can let it move. Finding the blockage changes the approach from pushing harder to checking the model.\n\n**Test the ending.**\nAsk, “Would this ending still make sense if I removed the turning-point choice?” If the answer is no, the connection is probably important. Show what happens to the original goal.",
      "example": "I DO:\nEarlier detail: Eli knows the cardboard wheel should spin freely.\nDiscovery: He notices a folded edge touching it.\nNew choice: He straightens the edge instead of pushing harder.\nResolution: The wheel turns and he can demonstrate it.\n\nI prepared the ending with the model''s design. I did not make a stranger appear with a perfect new model at the last moment.\n\nYOU TRY:\nA child cannot hang a display label. Earlier, she put spare string in her bag. What could a connected solution use?\n\nCHECK:\nUsing that spare string follows from the earlier detail. You still need to explain what she does and how it solves the hanging problem. Owning string alone is not a resolution.",
      "notice": "The ending should deal with the original goal, even if the character only partly succeeds. Avoid an unexplained rescuer doing everything.",
      "check": {
        "question": "Which planning choice best prepares a solution?",
        "options": [
          "Inventing a perfect helper in the final sentence with no explanation",
          "Introducing a useful item earlier, then showing how the character uses it",
          "Ending before the character acts",
          "Adding a new goal after every sentence"
        ],
        "correct_index": 1,
        "explanation": "Introducing and using a relevant item gives the solution an understandable connection. The other choices avoid or disrupt that connection."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Build an ending from a choice",
            "transcript": "Pip: My ending says the model works, but I have not explained how the character fixes it.\nJuno: Look back at the obstacle. What does the character notice, choose and change?\nPip: I can show the action and its consequence instead of jumping straight to success.\nJuno: Pause and try. Add the missing connection to one short draft.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "My ending says the model works, but I have not explained how the character fixes it."
                  },
                  {
                    "who": "juno",
                    "text": "Look back at the obstacle. What does the character notice, choose and change?"
                  },
                  {
                    "who": "pip",
                    "text": "I can show the action and its consequence instead of jumping straight to success."
                  },
                  {
                    "who": "juno",
                    "text": "Pause and try. Add the missing connection to one short draft.",
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
      "icon": "📝",
      "title": "Draft, then revise the connection",
      "explain": "**Turn notes into a readable story.**\nNotes help you remember the plot, but a draft gives a reader the experience of it. Use sentences to show actions and reactions. Start a new paragraph when an important event or focus changes.\n\n**Use a manageable sequence.**\nFor this task, write an opening, problem and first attempt, new approach, and ending. These are useful drafting sections, not a rule that every story must have exactly four paragraphs.\n\n**Reread for gaps.**\nAsk why each important action happens. If the reason exists only in your head, add it to the draft. If an attempt fails, show what the character notices or chooses next.\n\n**Revise one point before polishing everything.**\nRevision changes meaning or structure. Editing checks details such as spelling and punctuation. Both matter, but fixing a missing cause comes before decorating an unclear plot.\n\n**Use a success checklist.**\nCheck for a clear goal, relevant obstacle, connected attempts and a resolution linked to a choice. Then improve one place where the link is weak.",
      "example": "I DO:\nFirst draft: “The wheel jammed. Eli used his ruler. The model worked.”\n\nI know what I mean, but the reader does not. How does a ruler help? I revise the middle:\n“Eli saw a folded cardboard edge pressing against the wheel. He used the ruler''s straight edge to smooth the fold. When he turned the wheel again, it moved.”\n\nThe extra explanation connects the tool, action and result. I then check capitals and full stops.\n\nYOU TRY:\nRevise “The label fell. Ana used string. It stayed up.” Explain what Ana does with the string.\n\nCHECK:\nA possible revision shows Ana tying the string through the label''s hole and around the display hook. The reader can now follow how her action helps.",
      "notice": "Do not confuse adding more adjectives with fixing a plot gap. Add the missing action or reason first.",
      "check": {
        "question": "What is a useful revision when a draft jumps from a tool to a solved problem?",
        "options": [
          "Add unrelated colour words",
          "Remove the character''s goal",
          "Repeat the same unclear sentence",
          "Explain how the character uses the tool and what happens"
        ],
        "correct_index": 3,
        "explanation": "Explaining the action and its consequence repairs the missing connection. Unrelated detail, removing the goal or repeating the gap does not help the reader understand it."
      }
    }
  ],
  "worked_example": "I DO: A complete short draft\nTHE WHEEL THAT WOULD NOT TURN\n\nAt the hall, Eli placed his cardboard model on a table. Visitors would arrive in ten minutes. He wanted to demonstrate how its wheel turned.\n\nWhen he tested it, the wheel stuck. He pushed harder, but the cardboard bent. Eli pulled his hand away. Another push might make the model worse.\n\nHe leaned close and followed the wheel''s edge. A folded strip of cardboard pressed against it. Instead of pushing the wheel, he used the straight edge of his ruler to smooth the strip. He tried a gentle turn.\n\nThe wheel moved. When a visitor reached the table, Eli could show the moving part and explain his repair. He left the ruler beside the model for the next demonstration.\n\nHOW THE PARTS CONNECT\nThe opening establishes a goal. The jam blocks it. Pushing fails and makes Eli stop. Looking closely reveals the blockage, so he changes his approach. The repair enables the demonstration.\n\nCOMMON MISTAKE AND FIX\n“We have a jam, then the model works” skips the action. The model draft includes what Eli notices, what he changes and how he checks the result. A ruler is introduced as the tool he uses, not as a magic solution.",
  "worked_visuals": [
    {
      "alt": "Four drafting sections connect a person and goal, an obstacle and attempt, a new choice and result, and the goal''s outcome.",
      "caption": "Use the sections to guide a draft, not to force every story into a fixed formula.",
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 224\"><rect width=\"420\" height=\"224\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">Opening: person + goal</text><text x=\"16\" y=\"80\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">Problem: obstacle + attempt</text><text x=\"16\" y=\"126\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">Change: new choice + result</text><text x=\"16\" y=\"172\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">Ending: goal outcome</text></svg>"
    }
  ],
  "guided_practice": "WE DO: Plan a different display story.\nPrompt: A child wants visitors to read a display label, but the label keeps falling.\n1. Name a character and goal. Try your own wording. Suggestion: Ana wants her display label readable before visitors arrive.\n2. Choose one obstacle that blocks it. Suggestion: the tape does not hold the label.\n3. Name an attempt and result. Suggestion: more tape still fails, so Ana examines the display hook.\n4. Prepare a useful earlier detail. Suggestion: she has string in her bag.\n5. Show a changed approach and ending. Suggestion: she ties the label to the hook with string, checks that it is readable and is ready for visitors.\nNow draft two connected sentences about the change. Starter: “When Ana noticed ____, she decided ____. After she ____, ____.”\nCheck that the reader can follow how the choice addresses the falling-label problem. Another sensible solution is fine.",
  "independent_task": "YOU DO: Draft a connected narrative (about 20–25 minutes)\nChoose the falling-label prompt or invent another small community-display problem.\n1. Complete your three plan boxes. Give your character one clear goal and a relevant obstacle.\n2. Draft about 180–250 words, or a shorter complete story if you need more practice. Use the four sections in the model to help organise events.\n3. Show an attempt and consequence, then a changed approach. Prepare a useful idea or item before relying on it in the ending.\n4. Read the draft and explain why each important action happens. Revise one missing link.\n5. Check: goal clear; obstacle relevant; choices connected; ending shows the goal''s outcome; capitals and sentence endings checked.\nType your draft in the big box or write on paper and type a concise summary plus the two sentences you revised. Keep paper work for review; an upload is optional.\nThe suggested word range is a guide. A coherent complete plot matters more than filling space.",
  "response_prompt": "Which revision made your plot connection clearer, and how?",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "What should an opening help a reader understand?",
      "options": [
        "Every item the character owns",
        "A character, useful setting and goal",
        "The exact ending before anything happens",
        "Only the room''s colours"
      ],
      "correct_index": 1,
      "explanation": "A purposeful opening establishes the character''s situation and goal. Listing possessions or colours alone does not establish why the story matters."
    },
    {
      "type": "multiple_choice",
      "question": "Why should an obstacle connect to the goal?",
      "options": [
        "It must contain a long word",
        "It must happen in another town",
        "It makes the character''s intended achievement harder",
        "It should remove every choice"
      ],
      "correct_index": 2,
      "explanation": "A relevant obstacle blocks or complicates what the character wants to achieve, giving subsequent actions a reason."
    },
    {
      "type": "multiple_choice",
      "question": "What is a consequence?",
      "options": [
        "The result of an action or event",
        "The title''s font",
        "A list of possible names",
        "A description of every object"
      ],
      "correct_index": 0,
      "explanation": "A consequence is a result. It helps explain what a character may need to do next."
    },
    {
      "type": "multiple_choice",
      "question": "Why is Eli pushing the wheel harder a useful failed attempt?",
      "options": [
        "It guarantees every story must include a ruler",
        "It removes the problem permanently",
        "It describes his clothing",
        "The bent cardboard gives him a reason to change his approach"
      ],
      "correct_index": 3,
      "explanation": "The result shows pushing harder is unhelpful and prompts a different decision. A failed attempt matters when its consequence shapes what follows."
    },
    {
      "type": "multiple_choice",
      "question": "Which change is the turning point in the model?",
      "options": [
        "Visitors have shoes",
        "Eli stops pushing and investigates the blocked edge",
        "The table has a surface",
        "The story has four sections"
      ],
      "correct_index": 1,
      "explanation": "Investigating the blockage changes Eli''s approach to the jammed wheel. The other details do not explain that change of direction."
    },
    {
      "type": "multiple_choice",
      "question": "How can a writer prepare an ending?",
      "options": [
        "Introduce a useful detail and show how it later helps",
        "Avoid explaining the problem",
        "Make every event unrelated",
        "Skip all attempts"
      ],
      "correct_index": 0,
      "explanation": "An earlier useful detail gives a later solution a foundation. The writer still needs to show the relevant action and result."
    },
    {
      "type": "multiple_choice",
      "question": "Which is a structural revision rather than only spelling editing?",
      "options": [
        "Checking the letters in wheel",
        "Changing one misspelt name",
        "Adding an explanation of how an action solves the problem",
        "Checking a capital letter"
      ],
      "correct_index": 2,
      "explanation": "Explaining an action''s role improves the story''s meaning and connections. The other choices check surface details."
    },
    {
      "type": "multiple_choice",
      "question": "Which ending addresses the original demonstration goal?",
      "options": [
        "Eli suddenly wants a different model with no explanation",
        "The table is still a table",
        "The last paragraph lists colours",
        "Eli demonstrates the repaired moving part to a visitor"
      ],
      "correct_index": 3,
      "explanation": "The demonstration shows how the original goal is achieved after the repair."
    },
    {
      "type": "short_answer",
      "question": "Explain how your planned obstacle affects your character''s goal.",
      "sample_answer": "Ana wants visitors to read her display label, but the label keeps falling, so they may not see it.",
      "marking_guide": "Accept a specific goal and a relevant obstacle with an explanation of how it matters.",
      "explanation": "A strong response explains the connection rather than merely listing a person and an object."
    },
    {
      "type": "short_answer",
      "question": "Describe one revision that makes an action-and-result connection clear.",
      "sample_answer": "I changed ''Ana used string'' to show her tying the label to the hook, so the reader understands why it stays up.",
      "marking_guide": "Accept an actual or proposed revision adding a relevant action or reason. Require its effect on clarity.",
      "explanation": "A strong response shows what information the reader needs and how the revision supplies it."
    }
  ],
  "parent_notes": "Parent: Teaches narrative planning and drafting through goals, relevant obstacles, attempts, turning points, resolution and revision. Outcome codes are intentionally empty: an exact Stage 3 outcome mapping was not verified from the accessible NESA page. All story content is original fiction. This lesson follows the repository''s Year 5 narrative sequence; it does not claim to cover an entire syllabus outcome.\n\nParent: Look for causal coherence. The draft need not follow exactly four paragraphs or end happily, but its main goal needs an understandable outcome.\n\nParent: Each example includes a new small try and feedback. Encourage one connection repair before spelling polishing. The word range is guidance, not a pass condition.\n\nParent: The quiz has eight scored choices and two written responses. The existing 90% threshold requires 8/8 choices. Written responses are included in the submission for your review, not automatically graded. Model for question 9: Ana wants visitors to read her display label, but the label keeps falling, so they may not see it. Model for question 10: I changed ''Ana used string'' to show her tying the label to the hook, so the reader understands why it stays up.\n\nParent: Review the original draft and one revision. A shorter coherent story can show the taught skill. Do not treat filling all planner boxes as proof of a strong narrative.",
  "evidence_instructions": "Keep planner notes, the draft, one revised connection, reflection and two written quiz responses. Compare the plan with the story to see whether the ending follows from a choice.",
  "offline_alternative": "Draw three planning boxes on paper using the labels in this lesson. Draft and revise the story beneath them. Later type a summary and complete the quest check.",
  "extension": "Try an ending where the goal is only partly achieved. Explain why that outcome still follows from the character''s choices.",
  "stage_hints": {
    "accept": [
      "Read the mission and choose a small story problem you can picture.",
      "The lesson will help you plan before drafting; begin with the opening step.",
      "Keep notes about a character wanting to do something. You can choose your setting after the examples."
    ],
    "teach0": [
      "Look back at the opening''s two small moves.",
      "Separate place-and-action information from what the character wants.",
      "Ask what success would look like. Add that intended achievement to your opening."
    ],
    "teach1": [
      "Look back at the link between obstacle and goal.",
      "Ask what the character cannot do because of the problem.",
      "Use “Because ____, the character decides ____.” Test whether the decision addresses this obstacle."
    ],
    "teach2": [
      "Find the earlier detail that can support a later solution.",
      "Compare the first attempt with the changed approach.",
      "Ask what the character notices and does differently. Then show its effect on the original problem."
    ],
    "teach3": [
      "Look back at the draft with a missing connection.",
      "Find what the reader needs to know about the action.",
      "Explain how the tool or choice changes the problem before adding decorative detail."
    ],
    "learn": [
      "Read the model story before its explanation.",
      "Trace the goal, jam, failed push, investigation and repair in order.",
      "Choose one action and explain what earlier event gives it a reason."
    ],
    "guided": [
      "Begin with the falling-label goal before choosing a solution.",
      "Write one obstacle and one attempt with a result.",
      "Use the two-sentence starter to show what Ana notices and chooses next."
    ],
    "plan": [
      "Start with the first box and one specific goal.",
      "Add what prevents that goal, then move to the attempt box.",
      "Write “My character wants ____, but ____.” Use those notes to choose a relevant first attempt."
    ],
    "write": [
      "Look back at your plan and draft only the opening first.",
      "Begin “At ____, ____ wanted ____.” Add the obstacle after that situation is clear.",
      "A possible opening shape is “At the display, my character checked ____. They hoped ____.” Fill the gaps from your own plan."
    ],
    "quiz": [
      "Return to the step about the term being tested.",
      "Compare each option with goal, obstacle, action, result or revision.",
      "For a written explanation, state the goal and obstacle or show the information a revision adds. Use your own example."
    ],
    "submit": [
      "Check that the plan and draft are ready for review.",
      "Include the revision, reflection and both written answers.",
      "If you drafted on paper, type a summary and your revised sentences, then keep the page for review."
    ]
  }
}'),
    updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
WHERE seed_key = 's3-eng-y5-w01-l2';

UPDATE lessons
SET title = 'Year 5: Make narrative sentences connect',
    data = json_patch(data, '{
  "seed_key": "s3-eng-y5-w01-l3",
  "title": "Year 5: Make narrative sentences connect",
  "stage": "S3",
  "learning_area": "English",
  "year_level": "Year 5",
  "week": 1,
  "lesson_number": 3,
  "duration_minutes": 60,
  "child_mission": "Become a Clarity Editor. Repair a short narrative by keeping its time clear, linking causes and making sure readers know who acts.",
  "learning_intention": "We are learning to use tense, linking words and clear references to connect narrative events.",
  "success_criteria": [
    "I can keep a short past-time narrative consistent.",
    "I can distinguish a sequence link from a cause or result link.",
    "I can replace an unclear pronoun with a clear noun.",
    "I can explain how one edit improves a reader''s understanding."
  ],
  "materials": [
    "This lesson contains the texts and examples you need",
    "Optional: paper and a pencil"
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
  "spelling": {
    "focus": "Past-time verb endings",
    "teaching": "Some regular past verbs add -ed: walk → walked and check → checked. A verb already ending in e adds d: notice → noticed. A consonant before a final y can change y to i before ed: try → tried. In the one-syllable verb plan, a short vowel is followed by one final consonant, so the n doubles before ed: planned. These examples are regular patterns, not a claim that every past verb uses ed; write → wrote is irregular. Say the base word, identify its ending, apply the pattern and read the finished word.",
    "words": [
      {
        "word": "walked",
        "parts": "walk + ed",
        "tip": "Add ed to walk."
      },
      {
        "word": "checked",
        "parts": "check + ed",
        "tip": "Add ed to check."
      },
      {
        "word": "noticed",
        "parts": "notice + d",
        "tip": "Notice ends in e; add d."
      },
      {
        "word": "tried",
        "parts": "try → tri + ed",
        "tip": "Change consonant plus final y to i before ed."
      },
      {
        "word": "planned",
        "parts": "plan → plann + ed",
        "tip": "Double the final n in this short one-syllable verb before ed."
      }
    ],
    "check": [
      {
        "question": "Which past form correctly follows try → consonant plus final y?",
        "options": [
          "tryed",
          "try",
          "tried",
          "tryied"
        ],
        "correct_index": 2,
        "explanation": "The consonant before the final y allows y to change to i before adding ed, giving tried. The other forms do not follow this pattern."
      }
    ]
  },
  "hoard_words": [
    "walked",
    "checked",
    "noticed",
    "tried",
    "planned"
  ],
  "follow_up_challenges": null,
  "steps": null,
  "visual_plan": null,
  "teach_steps": [
    {
      "icon": "🕰️",
      "title": "Keep the story''s time clear",
      "explain": "**A verb shows an action or state.**\nIn “Noor checked the label”, checked is the verb. It tells us what Noor did. Verb tense helps a reader understand when an action takes place.\n\n**Choose a time frame.**\nThis practice narrative tells events that already happened, so it uses past tense: checked, noticed and wrote. Many regular verbs form the past with -ed; some, such as write → wrote, change differently.\n\nStories can use other time frames deliberately. For this task, practise a consistent past-time account. A sudden shift to present tense without a reason can confuse the reader about when events occur.\n\n**Find and test the verbs.**\nRead one sentence. Ask, “Is this action happening now in my account, or did it already happen?” If you are telling past events, choose the past form. Read the next sentence to check that the time remains clear.\n\n**Do not change quoted words automatically.**\nA character may say “The label is ready” during a past-time story. The narrator can write “Noor said, ''The label is ready.''” The quoted speech shows the character''s words at that moment.",
      "example": "I DO:\nDraft: “Noor checked the label. Leo writes a new one.”\nThe first verb tells a past event. Writes shifts to present without a reason. I revise: “Noor checked the label. Leo wrote a new one.”\n\nI do not change every word to end in -ed. Write becomes wrote, not writed.\n\nYOU TRY:\n“Yesterday, Ana plans the display and checked her notes.”\nFind the inconsistent verb and try a past form.\n\nCHECK:\n“Yesterday, Ana planned the display and checked her notes.” Planned and checked fit the past-time account. The spelling segment will show why planned has a doubled n.\n\nCOMPARE:\n“Ana said, ''My plan is ready.''” Said is the narrator''s past verb; is belongs to Ana''s spoken words. Keeping the quote as spoken can make sense.",
      "notice": "A tense change can be purposeful in another story. Here, change only an accidental shift in a past-time account; do not rewrite a character''s spoken words simply because the narration is past.",
      "check": {
        "question": "Which sentence keeps both narrated actions in past tense?",
        "options": [
          "Noor checked the label and Leo writes another",
          "Noor checks the label and Leo wrote another",
          "Noor checked the label and Leo wrote another",
          "Noor checking the label and Leo writes another"
        ],
        "correct_index": 2,
        "explanation": "Checked and wrote both place the narrated actions in the past. The other choices shift tense or lack a complete consistent past-time account."
      }
    },
    {
      "icon": "🔗",
      "title": "Show order, cause and result",
      "explain": "**Choose the link you mean.**\nA sequence link shows order: first, next, then or after. A cause link explains why, often using because. A result link can use so to show what follows from an action or situation.\n\nThese words are not interchangeable decorations. Choose one because it expresses the relationship you want a reader to follow.\n\n**Compare order with cause.**\n“Noor found labels. Then she wrote names” puts events in order.\n“Noor wrote new labels because the old sign was unreadable” explains why she wrote them.\n\nBoth sentences can be useful, but they do different jobs. Do not invent a cause merely because two events appear together.\n\n**Place the parts carefully.**\nBecause introduces the reason. “Because the sign was unreadable, Noor wrote labels” puts the reason first and uses a comma after that opening part.\n“Noor wrote labels because the sign was unreadable” puts the reason second.\n\n**Read for meaning.**\nCheck what the link says. If because gives the wrong reason or so gives an impossible result, the sentence needs revising.",
      "example": "I DO:\nTwo notes: “The old sign was unreadable. Noor made new labels.”\nCause version: “Noor made new labels because the old sign was unreadable.”\nResult version: “The old sign was unreadable, so Noor made new labels.”\n\nI keep the same relationship: the damaged sign explains the new-label choice. I am not claiming that making labels damaged the sign.\n\nYOU TRY:\n“The tape failed. Ana used string.”\nWrite a cause or result link before comparing this suggestion.\n\nCHECK:\n“Ana used string because the tape failed” explains her reason. “The tape failed, so Ana used string” shows her response. Both need the surrounding story to support that connection.",
      "notice": "First decide the relationship, then choose a linking word. Using then everywhere gives order but may leave important reasons unexplained.",
      "check": {
        "question": "Which word most directly introduces a reason?",
        "options": [
          "then",
          "next",
          "first",
          "because"
        ],
        "correct_index": 3,
        "explanation": "Because introduces a reason. Then, next and first usually organise the order rather than explain why something happens."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Choose the relationship before the link",
            "transcript": "Pip: I use then in every sentence. My events are in order, but the reason is still missing.\nJuno: Ask whether you need order, a cause or a result. Choose a linking word for that relationship.\nPip: Because can introduce the reason. So can connect a situation to a supported result.\nJuno: Pause and try. Explain the relationship between two notes before joining them.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "I use then in every sentence. My events are in order, but the reason is still missing."
                  },
                  {
                    "who": "juno",
                    "text": "Ask whether you need order, a cause or a result. Choose a linking word for that relationship."
                  },
                  {
                    "who": "pip",
                    "text": "Because can introduce the reason. So can connect a situation to a supported result."
                  },
                  {
                    "who": "juno",
                    "text": "Pause and try. Explain the relationship between two notes before joining them.",
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
      "icon": "👤",
      "title": "Make references clear",
      "explain": "**A pronoun can stand in for a noun.**\nWords such as she, he, they and it can refer back to a person or thing. They avoid unnecessary repetition, but only help when a reader can identify the reference.\n\n**Find the noun behind the word.**\nIn “Noor wrote a label. She checked it”, she refers to Noor and it refers to the label. The earlier sentence supplies clear references.\n\nNow compare: “The label fell on the poster. It was damaged.” Does it mean the label or the poster? The sentence leaves two possible things.\n\n**Repair uncertainty.**\nRepeat the specific noun where it helps. “The label fell on the poster. The label was damaged” makes the intended meaning clear.\nA repeated noun is useful when it prevents a misunderstanding.\n\n**Do not remove every pronoun.**\nA paragraph repeating a name in every sentence may sound clumsy. Keep clear references and repair uncertain ones. Read as if you have not seen the author''s plan.",
      "example": "I DO:\nDraft: “Noor put the card beside the sign. It had a smudged word.”\nI intend the sign to have the smudge, but the reader could think it means the card.\n\nRevision: “Noor put the card beside the sign. The sign had a smudged word.”\nThe added noun makes my intended reference clear.\n\nYOU TRY:\n“Leo placed the list under the label. It was torn.”\nYou intend the list to be torn. Rewrite only what is needed.\n\nCHECK:\n“Leo placed the list under the label. The list was torn.” Keeping a specific noun removes the uncertain reference. You do not need to add an unrelated event.",
      "notice": "When two nearby nouns could fit it, use the exact noun at the important point. Do not expect the reader to know what you meant privately.",
      "check": {
        "question": "In ''The label fell on the poster. It was damaged'', why might it need replacing?",
        "options": [
          "It could refer to either the label or the poster",
          "Pronouns never belong in narratives",
          "Poster must always be removed",
          "A sentence cannot begin with it"
        ],
        "correct_index": 0,
        "explanation": "Both objects could be the damaged one, so the reference is uncertain. Pronouns can be useful and can begin sentences when their meaning is clear."
      }
    },
    {
      "icon": "🧰",
      "title": "Edit a connected passage",
      "explain": "**Edit one kind of problem at a time.**\nChecking everything at once can make a small passage feel complicated. Use three passes: time, connections, references.\n\n**Pass 1: time.**\nFind the narrated verbs. In a past-time account, check their past forms. Leave direct speech meaningful rather than changing it mechanically.\n\n**Pass 2: connections.**\nAsk which events need an order link and which need a reason or result. Add a link only where the relationship is supported.\n\n**Pass 3: references.**\nFollow each pronoun back to a person or thing. If two nouns could fit, name the intended one.\n\n**Reread the whole result.**\nAn edit should make the passage clearer without changing the original events. Explain one change: “I changed ____ to ____ so the reader can ____.”\nThen check capitals and sentence-ending punctuation. A corrected spelling alone will not repair a missing cause or uncertain reference.",
      "example": "I DO:\nDraft: “The sign was blurred. Noor makes labels. She puts a card beside the list. It was torn.”\nIntended meaning: the list was torn.\n\nTime pass: change makes to made and puts to put.\nConnection pass: add so where the blurred sign gives Noor a reason to make labels.\nReference pass: replace the final it with the list.\n\nRevision:\n“The sign was blurred, so Noor made labels. She put a card beside the list. The list was torn.”\n\nEXPLANATION:\nI kept the events but repaired the time and relationship. Naming the list prevents readers confusing it with the card.\n\nYOU TRY:\n“The tape failed. Ana uses string. It holds the label.”\nTry a past-time account and a result link.\n\nCHECK:\n“The tape failed, so Ana used string. The string held the label.” This makes the time and response clear.",
      "notice": "Explain edits by their effect on meaning. A longer sentence is not automatically a better sentence; clarity is the test.",
      "check": {
        "question": "Which editing method matches this lesson?",
        "options": [
          "Change all words at random",
          "Check time, connections and references, then reread",
          "Remove every noun",
          "Add because whether or not a reason exists"
        ],
        "correct_index": 1,
        "explanation": "The three passes focus on specific clarity problems and finish with a whole-passage check. Random changes or unsupported links can damage meaning."
      },
      "visual": [
        {
          "alt": "Three editing passes check verb time, event connections and pronoun references, then reread without changing the events.",
          "caption": "Use one pass at a time.",
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 224\"><rect width=\"420\" height=\"224\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">Pass 1: time and verb forms</text><text x=\"16\" y=\"80\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">Pass 2: order / cause / result</text><text x=\"16\" y=\"126\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">Pass 3: clear references</text><text x=\"16\" y=\"172\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">Reread: events stay the same</text></svg>"
        }
      ]
    }
  ],
  "worked_example": "I DO: An edit with reasons\nORIGINAL PRACTICE DRAFT\nYesterday, Noor checks the display. The sign was blurred. She makes new labels. She puts a card beside the list. It was torn.\nIntended meaning: the list was torn.\n\nREVISED PASSAGE\nYesterday, Noor checked the display. The sign was blurred, so she made new labels. She put a card beside the list. The list was torn.\n\nWHY I CHANGED IT\nChecked and made fit a past-time account. Put is the same written form in present and past, so its role depends on the sentence; here it narrates a past action. So connects the damaged sign with the supported response. The list replaces an uncertain it.\n\nCOMMON MISTAKE AND FIX\nWeak edit: “She made new labels because she made new labels.” This repeats the action instead of giving a reason.\nFix: identify the actual reason in the text: the old sign was blurred.\n\nFINAL CHECK\nI have not invented a new problem or changed which item is torn. I have made the existing events easier to follow.",
  "worked_visuals": [
    {
      "alt": "Three linking words do different jobs: then shows order, because introduces a reason, so connects to a result.",
      "caption": "Use a link that matches your intended relationship.",
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 178\"><rect width=\"420\" height=\"178\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">then: what happens next</text><text x=\"16\" y=\"80\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">because: why it happens</text><text x=\"16\" y=\"126\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">so: a supported result</text></svg>"
    }
  ],
  "guided_practice": "WE DO: Try the three passes.\nPractice draft: “Yesterday, Ana plans the label. The tape fails. She uses string. The card touches the sign. It was wet.”\nIntended meaning: the sign was wet.\n\n1. Find the narrated present forms and try their past forms. Suggestion after your try: planned, failed and used fit Yesterday.\n2. Join the tape failure and string choice with a reason or result link. Suggestion: “The tape failed, so she used string.”\n3. Find the uncertain it. Suggestion: name the sign because that is the intended wet item.\n4. Read the revised passage. One version: “Yesterday, Ana planned the label. The tape failed, so she used string. The card touched the sign. The sign was wet.”\n5. Explain one change before copying the whole example. Starter: “I replaced ____ with ____ because ____.”\nNotice that touched also needs a past form. Check every narrated action, not just the first one.",
  "independent_task": "YOU DO: Clarity Editor report (about 20 minutes)\nThis is a deliberately unfinished practice draft:\n“Yesterday, Leo checks the display. The old sign was blurred. He makes new labels. He places the list beside a card. It was creased. Noor reviews the names.”\nIntended meaning: the list was creased.\n\n1. Rewrite the passage as a consistent past-time account.\n2. Add one supported cause or result link between the blurred sign and making labels.\n3. Replace the uncertain it so the reader knows which item was creased. Keep pronouns that already have a clear reference.\n4. Explain three edits: one verb change; your linking-word choice; your reference repair.\n5. Check that you have kept the original events. Add no new cause, character or problem.\nType the revised paragraph and explanations in the big box or work on paper and type a summary. Use the spelling segment to check regular endings.",
  "response_prompt": "Which edit most improved clarity for a reader, and why?",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "What does tense help a reader understand?",
      "options": [
        "When narrated actions take place",
        "Only the colour of an object",
        "How many paragraphs a text has",
        "The size of a heading"
      ],
      "correct_index": 0,
      "explanation": "Tense helps establish the time of an action or state. It does not describe heading size, colour or paragraph count."
    },
    {
      "type": "multiple_choice",
      "question": "Which keeps both narrated actions in past tense?",
      "options": [
        "Leo checked and Noor reviews",
        "Leo checks and Noor reviewed",
        "Leo checked and Noor reviewed",
        "Leo checking and Noor reviews"
      ],
      "correct_index": 2,
      "explanation": "Checked and reviewed both fit a past-time account. The other choices mix forms or do not give a complete consistent account."
    },
    {
      "type": "multiple_choice",
      "question": "Why need quoted present words not change automatically in a past narrative?",
      "options": [
        "Quotation marks remove all grammar",
        "Stories can never include speech",
        "Every quoted verb must end in ed",
        "The quote can show the character''s words at that moment"
      ],
      "correct_index": 3,
      "explanation": "Direct speech can preserve what the character says at that moment while the narrator uses past tense."
    },
    {
      "type": "multiple_choice",
      "question": "What does then usually show?",
      "options": [
        "The reason an event happened",
        "The order of events",
        "Which noun is damaged",
        "An irregular verb form"
      ],
      "correct_index": 1,
      "explanation": "Then usually signals what follows in the sequence. It does not itself establish a cause, reference or verb pattern."
    },
    {
      "type": "multiple_choice",
      "question": "Which sentence explains a reason supported by the practice context?",
      "options": [
        "Noor made labels because the old sign was blurred",
        "Noor made labels because labels made themselves",
        "Noor made labels then because first",
        "The sign blurred because the hall had a name"
      ],
      "correct_index": 0,
      "explanation": "The unreadable sign is the supported reason for making labels. The other choices are circular, unclear or invent an unsupported cause."
    },
    {
      "type": "multiple_choice",
      "question": "Which word can connect a situation with its result?",
      "options": [
        "yesterday",
        "they",
        "so",
        "card"
      ],
      "correct_index": 2,
      "explanation": "So can introduce a result or response. The other words do not function as that cause-and-result link here."
    },
    {
      "type": "multiple_choice",
      "question": "What is the problem in ''The list touched the card. It was torn''?",
      "options": [
        "It cannot be a pronoun",
        "Torn must mean both items",
        "The sentence contains no nouns",
        "It could refer to either nearby item"
      ],
      "correct_index": 3,
      "explanation": "Both the list and card are possible references for it. Naming the intended item removes uncertainty."
    },
    {
      "type": "multiple_choice",
      "question": "Which past form of try is correct?",
      "options": [
        "tryed",
        "tried",
        "tryied",
        "tryinged"
      ],
      "correct_index": 1,
      "explanation": "Try has a consonant before final y, so y changes to i before ed: tried."
    },
    {
      "type": "short_answer",
      "question": "Explain why a cause link can be more useful than only then in the sign passage.",
      "sample_answer": "Because or so can explain that the blurred sign gives a reason for making labels, while then only places the events in order.",
      "marking_guide": "Accept a correct distinction between event order and a supported reason/result. Do not require one exact word.",
      "explanation": "A strong answer explains the relationship each linking choice expresses."
    },
    {
      "type": "short_answer",
      "question": "Repair ''The list touched the card. It was creased'' when the intended meaning is that the list was creased. Explain your edit.",
      "sample_answer": "The list touched the card. The list was creased. I named the list so the reader does not confuse it with the card.",
      "marking_guide": "Accept an equivalent clear reference without changing the intended item. Require an explanation of the uncertainty removed.",
      "explanation": "A strong answer identifies the intended noun and explains why repeating it helps."
    }
  ],
  "parent_notes": "Parent: Teaches consistency of past-time narration, sequence versus cause/result links, pronoun reference and regular past-verb spelling. Outcome codes are intentionally empty: an exact Stage 3 outcome mapping was not verified from the accessible NESA page. All story content is original fiction. This lesson follows the repository''s Year 5 narrative sequence; it does not claim to cover an entire syllabus outcome.\n\nParent: Look for meaning-preserving edits with reasons. A character''s quoted present words need not be mechanically changed. The practice intentionally allows more than one clear revised wording.\n\nParent: Let the child work in three separate passes and compare suggestions after trying. The pronoun tasks specify the intended item to prevent guesswork.\n\nParent: The quiz has eight scored choices and two written responses. The existing 90% threshold requires 8/8 choices. Written responses are included in the submission for your review, not automatically graded. Model for question 9: Because or so can explain that the blurred sign gives a reason for making labels, while then only places the events in order. Model for question 10: The list touched the card. The list was creased. I named the list so the reader does not confuse it with the card.\n\nParent: Possible task revision: Yesterday, Leo checked the display. The old sign was blurred, so he made new labels. He placed the list beside a card. The list was creased. Noor reviewed the names. Check the explanation as well as the revised words.",
  "evidence_instructions": "Keep the edited passage, three explanations, reflection and both written quiz answers. Review whether edits preserve events and clarify the intended meaning.",
  "offline_alternative": "Copy the practice draft and intended-meaning note onto paper. Mark verbs first, links second and references third. Write the revised passage and reasons, then type a summary and complete the quiz later.",
  "extension": "Write a pair of versions using because and so for the same supported relationship. Explain how you arrange reason and result in each.",
  "stage_hints": {
    "accept": [
      "Read the mission and notice the three kinds of clarity check.",
      "You will practise each check separately before editing a paragraph.",
      "Begin with a narrated verb and ask when its action happened. You can add linking words later."
    ],
    "teach0": [
      "Look back at the difference between narration and a character''s spoken words.",
      "Find each narrated action and decide whether it fits the past-time account.",
      "Try reading the line with Yesterday at its beginning. Compare the action forms without changing quoted speech mechanically."
    ],
    "teach1": [
      "Look back at order, reason and result as different relationships.",
      "Ask whether you mean what comes next or why an action happens.",
      "Name the relationship first, then test which word expresses it without adding an unsupported reason."
    ],
    "teach2": [
      "Find both nouns near the uncertain reference.",
      "Ask which object the writer intends the pronoun to name.",
      "Try replacing the pronoun with a specific noun and check that the intended event stays the same."
    ],
    "teach3": [
      "Look back at the three editing passes.",
      "Check one type of problem before moving to the next.",
      "Underline narrated actions, then inspect links, then follow each pronoun back to its intended noun."
    ],
    "learn": [
      "Read the unfinished draft and its intended-meaning note first.",
      "Compare one edited verb before looking at the links and reference repair.",
      "Explain what a change helps the reader understand instead of only copying the finished passage."
    ],
    "spelling": [
      "Look back at the base word before adding a past ending.",
      "Check whether the base ends in e, consonant plus y or a simple consonant pattern.",
      "Say the base word, identify its ending, apply that example''s pattern and reread. Remember some past verbs change differently."
    ],
    "guided": [
      "Try the first pass before reading its suggestion.",
      "Keep the intended wet item in mind when you reach the reference pass.",
      "Use “I replaced ____ with ____ because ____.” Explain just one repair before checking the whole passage."
    ],
    "write": [
      "Read the draft and the intended-meaning note before changing words.",
      "Begin your response with the first sentence in the stated time frame.",
      "Use a response shape: “Revised passage: Yesterday, Leo ____.” Then add an edit explanation of your own."
    ],
    "quiz": [
      "Return to the step about tense, links, references or endings.",
      "Identify the intended time or relationship before comparing choices.",
      "For a written response, explain the uncertainty or relationship first, then give a meaning-preserving repair."
    ],
    "submit": [
      "Check your edited passage and three explanations are ready.",
      "Include your reflection and the two written responses.",
      "If you worked on paper, type the revision or a concise explanation summary and keep the page for review."
    ]
  }
}'),
    updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
WHERE seed_key = 's3-eng-y5-w01-l3';

UPDATE lessons
SET title = 'Year 5: Prepare and deliver a clear retelling',
    data = json_patch(data, '{
  "seed_key": "s3-eng-y5-w01-l4",
  "title": "Year 5: Prepare and deliver a clear retelling",
  "stage": "S3",
  "learning_area": "English",
  "year_level": "Year 5",
  "week": 1,
  "lesson_number": 4,
  "duration_minutes": 60,
  "child_mission": "Become a Story Presenter. Turn a complete narrative into a connected retelling, prepare readable cues and improve one part of your delivery.",
  "learning_intention": "We are learning to retell significant narrative events clearly for a listener, using a readable cue card and purposeful delivery.",
  "success_criteria": [
    "I can select events needed to explain a plot.",
    "I can connect a goal, problem, choice and result in a retelling.",
    "I can prepare readable cue notes without copying a whole script.",
    "I can rehearse and explain one improvement to my delivery."
  ],
  "materials": [
    "This lesson contains the texts and examples you need",
    "Optional: paper and a pencil"
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
  "hoard_words": null,
  "follow_up_challenges": null,
  "steps": null,
  "visual_plan": null,
  "teach_steps": [
    {
      "icon": "🎯",
      "title": "Choose what your listener needs",
      "explain": "**A retelling is a new account of a story.**\nYou tell the important events in your own words while keeping the original meaning. A listener who has not read the text needs enough information to follow its main problem and outcome.\n\n**Find a small event chain.**\nIdentify who wants what, what blocks the goal, what the character tries, what changes and how the problem ends. A goal is an intended achievement; a turning point changes the direction; a resolution shows how the main problem settles.\n\nYou may keep a setting detail when it explains the pressure or action. If a market opens soon, the timing helps explain why a character changes plans. Listing every object can bury that connection.\n\n**Keep facts and interpretation distinct.**\nDo not invent an event to make a short retelling exciting. If you describe what a character learns, support it with a word or action and use a phrase such as suggests when appropriate.\n\n**Test the selection.**\nAsk, “Would leaving this out make the next important action confusing?” Keep the information needed for the listener to follow the story.",
      "example": "I DO:\nShort story notes: Maya needs to deliver a model. The box corner breaks. A first carrying attempt tilts. She repairs the corner. The model reaches the exhibition.\n\nI keep the goal, broken corner, unsuccessful attempt, repair and successful delivery. A green-jumper detail is not needed to explain the repair.\n\nCOMPARE:\n“Maya has a box and a jumper” is too little plot.\nA description of every chair at the exhibition may be too much unrelated information.\n\nYOU TRY:\nIf a speech''s pages are mixed and numbering them solves the order problem, which actions would a listener need?\n\nCHECK:\nInclude the speech goal, mixed pages, the numbering choice and the resulting ordered reading. Explain the main problem rather than listing possessions.",
      "notice": "A shorter retelling still needs the connections. Cut unneeded details rather than removing the reason the character changes approach.",
      "check": {
        "question": "Which detail is most important in a retelling about a broken delivery box?",
        "options": [
          "A list of unrelated chairs",
          "The colour of every wall",
          "The character''s name written three times",
          "The repair that lets the model arrive"
        ],
        "correct_index": 3,
        "explanation": "The repair explains how the obstacle is overcome and the delivery goal is achieved. The other details do not explain that plot connection."
      }
    },
    {
      "icon": "🔗",
      "title": "Build a spoken chain",
      "explain": "**Order helps, but reasons matter too.**\nA listener hears one sentence at a time. Give them an understandable beginning, connected middle and ending. Use the order of the story unless you deliberately explain another arrangement.\n\nSequence words such as first, then and finally can organise events. Because introduces a reason; so can show a result or response. Choose a link for the relationship, not just to avoid repeating a word.\n\n**Use your own wording.**\nRead a part, look away and explain what happened. Then check the text for accuracy. You can keep a character''s name or an essential term without copying every original sentence.\n\n**Make an opening useful.**\nName the main character and goal before the obstacle. “This story follows Noor, who wants...” helps an unfamiliar listener more than “And then it happened.”\n\n**Close the chain.**\nShow the outcome of the original problem. A final thought about learning can follow, but it should not replace explaining how the goal ends.",
      "example": "I DO:\n“This story follows Maya, who wants to deliver her model. The box corner breaks, so carrying it becomes difficult. After an unsuccessful try, she repairs the corner. The model reaches the exhibition because the repaired box can hold it.”\n\nMy opening gives a goal. So explains the problem''s effect; after shows sequence; because supports the outcome. I keep the original meaning in my own words.\n\nYOU TRY:\nRetell a mixed-page speech problem in three sentences: goal and obstacle; useful choice; outcome.\n\nCHECK:\nA possible chain names the speaking goal, explains the mixed pages, shows how numbering helps and ends with the ordered speech. Your exact words can differ.",
      "notice": "Do not begin with unexplained he, she, it or they. Introduce the person or thing before expecting the listener to identify it.",
      "check": {
        "question": "What is a useful opening for an unfamiliar listener?",
        "options": [
          "And then it happened",
          "This story follows Noor, who wants the table labelled before opening",
          "She did that because of it",
          "Finally, without any beginning"
        ],
        "correct_index": 1,
        "explanation": "The opening identifies a character and goal so the listener can understand subsequent problems and choices. The other openings rely on missing information."
      }
    },
    {
      "icon": "🎙️",
      "title": "Rehearse for clarity",
      "explain": "**Delivery is how you present the words.**\nA clear retelling needs understandable content and delivery. Pace is speed, volume is loudness and pitch is how high or low your voice sounds. Pause briefly between important thoughts.\n\n**Choose from meaning and audience.**\nUse a comfortable volume a listener can hear. Give an important cause or change enough time. You may emphasise a key word, but shouting every sentence hides rather than highlights the connection.\n\n**Try a small part.**\nSay one opening and one cause-and-result sentence. Listen for words that merge together or become unclear. You do not need a recording; you can notice what you rush while rehearsing.\n\n**Improve one thing.**\nFirst rehearsal: check whether all important plot parts are present.\nSecond rehearsal: choose one delivery change, such as pausing after the goal or slowing the turning-point explanation.\n\n**Explain your choice.**\n“I slowed ____ so the listener could ____.” A useful improvement has a purpose, rather than being a demand to sound dramatic.",
      "example": "I DO:\nFirst try: I rush “She repaired the box so the model could be carried.” The repair and result blur together.\nSecond try: I keep the words clear and pause briefly after the repair thought. The listener has time to follow why it matters.\n\nCOMPARE:\nGetting louder does not automatically fix missing or rushed words. First make the content and pace clear.\n\nYOU TRY:\nSay “The pages were mixed, so Ravi numbered them” twice. In the second reading, make the reason for his response easier to follow.\n\nCHECK:\nA slightly slower pace or brief thought pause can help. Keep the relationship intact; do not separate every word or add an invented action.",
      "notice": "There is no required accent or performance voice. Aim for a listener to follow the meaning using your comfortable way of speaking.",
      "check": {
        "question": "Your turning-point explanation was rushed. What is a purposeful rehearsal change?",
        "options": [
          "Shout all the words",
          "Remove the problem",
          "Give the explanation more time and keep the words clear",
          "Invent a louder event"
        ],
        "correct_index": 2,
        "explanation": "A steadier pace gives the listener time to follow the change. Shouting, removing the problem or inventing events does not repair rushed explanation."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Rehearse with a reason",
            "transcript": "Pip: My retelling includes the problem and solution, but I rush the important change.\nJuno: Practise that connection at a steadier pace. Give the listener time to follow the choice.\nPip: I will use short cues and explain the events in my own words.\nJuno: Pause and try. Say one connected sentence twice and name your improvement.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "My retelling includes the problem and solution, but I rush the important change."
                  },
                  {
                    "who": "juno",
                    "text": "Practise that connection at a steadier pace. Give the listener time to follow the choice."
                  },
                  {
                    "who": "pip",
                    "text": "I will use short cues and explain the events in my own words."
                  },
                  {
                    "who": "juno",
                    "text": "Pause and try. Say one connected sentence twice and name your improvement.",
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
      "icon": "🗒️",
      "title": "Make a readable cue card",
      "explain": "**A cue prompts memory.**\nA cue card uses short notes to remind you of the event chain. It is different from a complete script. If you copy every sentence, you may spend the presentation trying to read tiny words instead of retelling.\n\n**Use a small structure.**\nFor this task, write five labels: goal, obstacle, attempt, change and outcome. Add a few meaningful words beneath each. These are practice categories, not a rule for every kind of presentation.\n\n**Make handwriting usable.**\nOn paper, keep letter shapes distinguishable, word spacing clear and size consistent enough to read at a glance. Give each cue its own line. If one word is cramped or unclear, rewrite that part rather than decorating the whole card.\n\nYou may type the cues if that is your accessible writing method. A typed card can support the retelling, but it does not demonstrate handwriting.\n\n**Test rather than assume.**\nSet the card at a comfortable reading distance. Say one cue, then explain its event in a complete spoken sentence. If the cue does not remind you of the event, revise the wording.",
      "example": "I DO: Five notes for Maya''s story\nGoal: deliver model\nObstacle: loose box corner\nAttempt: carrying tilts box\nChange: repair with tape\nOutcome: model reaches exhibition\n\nEach line reminds me of a connected event. I say the full explanation aloud rather than trying to perform only the two-word notes.\n\nCOMMON MISTAKE:\nOne crowded paragraph of tiny notes is difficult to glance at. Fix: separate the event labels, use readable words and leave space.\n\nYOU TRY:\nWrite a cue for a character using page numbers to organise a speech. Can you explain the action from that cue?\n\nCHECK:\n“Change: number and order pages” is more useful than a lone word such as stuff. Check the readability of your actual card, not just its appearance.",
      "notice": "A cue needs enough meaning to prompt you, but not a whole copied script. Review handwritten clarity only when you actually wrote the card by hand.",
      "check": {
        "question": "Which cue is most useful for a page-ordering choice?",
        "options": [
          "Stuff",
          "Everything happened",
          "A whole unrelated paragraph",
          "Change: number and order pages"
        ],
        "correct_index": 3,
        "explanation": "The short cue identifies the action that changes the situation. Vague words and unrelated long text do not prompt that important event clearly."
      },
      "visual": [
        {
          "alt": "A cue card with five separately spaced event labels: goal, obstacle, attempt, change and outcome.",
          "caption": "Use short readable notes, then explain the full connection aloud.",
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 270\"><rect width=\"420\" height=\"270\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">GOAL: what they want</text><text x=\"16\" y=\"80\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">OBSTACLE: what blocks it</text><text x=\"16\" y=\"126\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">ATTEMPT: what they try</text><text x=\"16\" y=\"172\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">CHANGE: a new approach</text><text x=\"16\" y=\"218\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">OUTCOME: how it ends</text></svg>"
        }
      ]
    }
  ],
  "worked_example": "I DO: Read the complete original story.\nTHE SIGN BEFORE THE MARKET\n\nNoor and Leo had promised to label the seedling table at the community hall before the Saturday market opened. Noor had painted a large sign the afternoon before. She hoped visitors would find their table without needing directions.\n\nWhen they reached the hall, Noor unfolded the sign. A damp patch had blurred three words. The seedlings were ready, but nobody could read their names. The doors would open in twenty minutes.\n\nLeo tried tracing the faded letters with a pencil. The paper tore under the point. Noor pressed her palms against the table. Repainting the whole sign would take too long.\n\nThen she noticed the blank backs of last week''s cardboard labels. Instead of one large sign, they could make a clear label for each tray. Noor wrote the names while Leo checked them against the list they had brought.\n\nThey arranged the labels where visitors could read them. When the doors opened, a visitor pointed to a tray and said its name correctly. Noor smiled. Their table looked different from her plan, but it was ready.\n\nShe tucked the damaged sign into her bag. Next time, she would bring spare labels before anything went wrong.\n\nMODEL RETELLING\n“This story follows Noor and Leo, who want to label a seedling table before the market opens. Their large sign is blurred, so the plants are difficult to identify. Leo tries tracing the words, but the paper tears. Noor notices spare labels and changes the approach: they label each tray instead of repairing the large sign. Because they write and check the labels, a visitor can identify a tray when the doors open. Noor plans to bring spare labels next time, which suggests she has learned to prepare a backup.”\n\nMY CUE CARD\nGoal: label before opening\nObstacle: blurred sign\nAttempt: tracing tears paper\nChange: individual labels\nOutcome: visitor identifies tray\n\nWHY IT WORKS\nThe listener gets the goal before the problem. Each important choice connects to a result. The final learning interpretation is marked with suggests. The cue notes prompt the model but are not a copied script.\n\nCOMMON MISTAKE AND FIX\nToo vague: “They went to the hall and changed something.” Fix: name the sign problem and the change to individual labels.",
  "worked_visuals": [
    {
      "alt": "The cue card prompts memory; spoken sentences explain the plot; pauses help separate thoughts.",
      "caption": "Notes and delivery have different jobs.",
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 178\"><rect width=\"420\" height=\"178\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">Cues prompt your memory.</text><text x=\"16\" y=\"80\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">Sentences explain the plot.</text><text x=\"16\" y=\"126\" font-family=\"Arial, sans-serif\" font-size=\"22\" fill=\"#18382b\">Pause between clear thoughts.</text></svg>"
    }
  ],
  "guided_practice": "WE DO: Prepare one part before the whole retelling.\n1. Read the market story and say the opening goal in your own words. Suggestion after your try: Noor and Leo want the table labelled before visitors arrive.\n2. Explain why the first attempt leads to a new choice. Suggestion: tracing tears the paper, which makes repairing the old sign less useful.\n3. Write two short cues for that connection. Suggestion: “Attempt: tracing tears paper” and “Change: spare labels”.\n4. Use the cues to speak two connected sentences without copying the model.\n5. Repeat once. Choose a steadier pace, clearer word or thought pause. Say which change helps a listener.\nCheck your wording against the story. Keep the evidence and original events even when your sentence wording differs.",
  "independent_task": "YOU DO: A clear retelling and cue-card task (about 20 minutes)\nUse the market story included above.\n1. Select five important plot notes: goal, obstacle, attempt, change and outcome.\n2. Write a cue card by hand on paper, or type it if needed. Keep each note readable and short enough to glance at. If handwritten, check letter shapes, spacing and a consistent readable size.\n3. Prepare a retelling of about one to two minutes. Use your own wording and at least one supported cause-and-result connection. You can practise alone; a live listener or recording is optional.\n4. Rehearse twice. Between tries, choose and make one purposeful delivery improvement.\n5. In the big text box, include the five cues, your retelling wording or a clear written summary, and the delivery change with its reason. Keep the physical cue card for review if you used one.\nCheck: a new listener can follow the goal and outcome; events are accurate; cues prompt rather than replace the explanation; one improvement is explained.",
  "response_prompt": "Which cue or delivery change most helped you explain the plot, and why?",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "What is the purpose of a retelling?",
      "options": [
        "Copy every sentence without deciding what matters",
        "Tell important events in your own words while keeping meaning",
        "Invent a different resolution and call it the original",
        "List every object in order of colour"
      ],
      "correct_index": 1,
      "explanation": "A retelling preserves the important events and meaning using the speaker''s wording. It is not a copied inventory or an invented replacement."
    },
    {
      "type": "multiple_choice",
      "question": "Which detail is essential to the market retelling?",
      "options": [
        "The colour of every chair",
        "A list of all visitors'' names",
        "The sign problem that leads to new labels",
        "An invented prize at the end"
      ],
      "correct_index": 2,
      "explanation": "The damaged sign explains the obstacle and new-label response. The other details are unnecessary or unsupported."
    },
    {
      "type": "multiple_choice",
      "question": "Why should a retelling introduce a character before using unclear pronouns?",
      "options": [
        "An unfamiliar listener needs to know who is being discussed",
        "Pronouns are always forbidden",
        "Names must appear in every sentence",
        "Every opening must rhyme"
      ],
      "correct_index": 0,
      "explanation": "An introduced person gives the listener a reference for later pronouns. Pronouns can still be used when clear."
    },
    {
      "type": "multiple_choice",
      "question": "Which link most directly introduces a reason?",
      "options": [
        "then",
        "finally",
        "first",
        "because"
      ],
      "correct_index": 3,
      "explanation": "Because introduces a reason. The other words commonly organise sequence."
    },
    {
      "type": "multiple_choice",
      "question": "What should the end of the retelling explain?",
      "options": [
        "Only the number of lines spoken",
        "How the main problem ends or settles",
        "An unrelated favourite colour",
        "All possible future stories"
      ],
      "correct_index": 1,
      "explanation": "The ending closes the central event chain by showing what happens to the main problem."
    },
    {
      "type": "multiple_choice",
      "question": "Which delivery choice is useful for a rushed cause-and-result explanation?",
      "options": [
        "Speak at a steadier pace and keep words clear",
        "Shout every word",
        "Remove the cause",
        "Change the story''s events"
      ],
      "correct_index": 0,
      "explanation": "A steadier pace improves clarity while preserving the connection. Loudness alone or removing information does not fix rushing."
    },
    {
      "type": "multiple_choice",
      "question": "What is the job of a cue card?",
      "options": [
        "Replace every spoken sentence with one vague word",
        "Hold an unrelated drawing",
        "Prompt the main event chain with short notes",
        "Prove a story must have five paragraphs"
      ],
      "correct_index": 2,
      "explanation": "Short meaningful notes prompt the event chain. The practice categories do not impose a paragraph rule on stories."
    },
    {
      "type": "multiple_choice",
      "question": "Which note supports useful handwritten cue-card checking?",
      "options": [
        "Decoration alone proves readability",
        "Typed notes always prove handwriting skill",
        "All notes should be squeezed onto one line",
        "Check letter clarity, word spacing and readable size"
      ],
      "correct_index": 3,
      "explanation": "Letter clarity, spacing and size determine whether handwritten words can be used at a glance. Decoration and typing do not establish handwriting evidence."
    },
    {
      "type": "short_answer",
      "question": "Explain why you kept one particular event in your retelling.",
      "sample_answer": "I kept the tracing attempt because its failure explains why Noor needs a different approach.",
      "marking_guide": "Accept a significant event and explanation of its role. Do not require the exact example.",
      "explanation": "A strong answer links selection to what the listener needs for understanding."
    },
    {
      "type": "short_answer",
      "question": "Describe one rehearsal improvement and its purpose.",
      "sample_answer": "I slowed the turning-point sentence so the listener could follow the change from one sign to individual labels.",
      "marking_guide": "Accept a specific change in pace, clarity, pausing, emphasis or organisation and a sensible purpose.",
      "explanation": "A strong answer identifies the improvement and its effect rather than simply saying the second try was better."
    }
  ],
  "parent_notes": "Parent: Teaches selecting significant narrative events, connected oral retelling, rehearsal with purposeful delivery and readable cue-note preparation. Outcome codes are intentionally empty: an exact Stage 3 outcome mapping was not verified from the accessible NESA page. All story content is original fiction. This lesson follows the repository''s Year 5 narrative sequence; it does not claim to cover an entire syllabus outcome.\n\nParent: Look for accurate event connections, useful notes and an explained delivery improvement. Assess oral delivery only if observed; handwriting only if a handwritten card exists.\n\nParent: The child may practise alone or use their usual communication support. No accent, performance voice, recording or upload is required. Keep cue-card feedback focused on usability.\n\nParent: The quiz has eight scored choices and two written responses. The existing 90% threshold requires 8/8 choices. Written responses are included in the submission for your review, not automatically graded. Model for question 9: I kept the tracing attempt because its failure explains why Noor needs a different approach. Model for question 10: I slowed the turning-point sentence so the listener could follow the change from one sign to individual labels.\n\nParent: Keep the five notes and retelling wording or summary. If no oral performance was observed, record that written evidence shows planning and explanation, not proof of delivery.",
  "evidence_instructions": "Keep cue notes, the written retelling or summary, rehearsal reflection and both written quiz answers. Where available, note observed oral clarity and inspect the actual handwritten card separately.",
  "offline_alternative": "Copy the story or use the printed lesson. Write five cues on paper, retell and rehearse without the screen. Later type a summary and complete the quiz. Keep the card for review.",
  "extension": "Make a second, shorter retelling for a listener who has only thirty seconds. Explain what you removed and why the main connection still makes sense.",
  "stage_hints": {
    "accept": [
      "Read the mission and notice that you will select, prepare and rehearse.",
      "Begin with the story''s goal and problem; delivery practice comes later.",
      "Keep paper ready for short cues if you want handwritten practice, or plan to type notes."
    ],
    "teach0": [
      "Look back at the question about what a listener needs.",
      "Find which event explains the next important choice.",
      "Test removing the detail. If the main action becomes confusing, explain why that detail matters."
    ],
    "teach1": [
      "Look back at the model''s character-and-goal opening.",
      "Ask what an unfamiliar listener knows before your first sentence.",
      "Name the character and intended achievement before explaining the obstacle."
    ],
    "teach2": [
      "Look back at the difference between content and delivery.",
      "Find a rushed connection and choose one comfortable change.",
      "Say that short connection twice and listen for the words and reason becoming clearer."
    ],
    "teach3": [
      "Look back at short cues versus a full script.",
      "Ask which note would prompt the action you need to explain.",
      "Choose a brief event label and a few meaningful action words, then try speaking a complete sentence from it."
    ],
    "learn": [
      "Read the original story before the spoken model.",
      "Compare each model sentence with one of the five cues.",
      "Pick one cue and explain its event in your own sentence without changing the original meaning."
    ],
    "guided": [
      "Start with the opening goal before the delivery try.",
      "Make two short cues for a failed attempt and changed approach.",
      "Use those notes to say one action-and-result connection, then decide what to improve."
    ],
    "write": [
      "Look back at your five event notes and begin with the opening.",
      "Use “This story follows ____, who wants ____.” Keep the first sentence clear.",
      "A partial opening shape is “Before the event began, ____ needed to ____.” Fill the gaps, then introduce the obstacle."
    ],
    "quiz": [
      "Return to the step about selection, connection, delivery or cues.",
      "Ask what each choice would help a listener understand.",
      "For a written response, name an event or improvement and explain its purpose rather than copying a whole model."
    ],
    "submit": [
      "Check that cue notes, wording and reflection are ready.",
      "Include both written responses and identify any handwritten card you kept.",
      "Submit your planning evidence and note whether the retelling was practised alone or observed. Keep paper cues for review."
    ]
  }
}'),
    updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
WHERE seed_key = 's3-eng-y5-w01-l4';
