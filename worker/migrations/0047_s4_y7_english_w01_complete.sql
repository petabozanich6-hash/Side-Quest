-- Approved Lesson Standard v2. Year 7 English Week 1, four complete lessons.
-- One UPDATE per lesson; preserve existing IDs, keys, ownership and assignments.
-- Migration 0046 is on main; 0043 remains reserved by PR #95.

UPDATE lessons
SET title = 'Year 7: Analyse setting, character and plot',
    data = json_patch(data, '{
  "seed_key": "s4-eng-y7-w01-l1",
  "title": "Year 7: Analyse setting, character and plot",
  "stage": "S4",
  "learning_area": "English",
  "year_level": "Year 7",
  "week": 1,
  "lesson_number": 1,
  "duration_minutes": 60,
  "child_mission": "Investigate how a short story shapes your understanding. Build an interpretation of its setting, character and plot, then support it with precise evidence.",
  "learning_intention": "We are learning to explain how setting, character choices and connected plot events create meaning in a short narrative.",
  "success_criteria": [
    "I can connect a setting detail with its effect.",
    "I can infer a character’s response from words and actions.",
    "I can explain a cause-and-result connection in the plot.",
    "I can write a claim supported by evidence and explanation."
  ],
  "materials": [
    "All texts and examples are included in this lesson",
    "Optional: paper and a pen for notes"
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
  "interactive_activities": null,
  "printable_resource": null,
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "📖",
      "title": "Read the setting for its effect",
      "explain": "**Setting is more than a place name.**\nSetting includes where and when events occur and the circumstances around them. A writer selects details to help us picture the situation and feel its pressure or atmosphere. Mood is the feeling a passage creates for a reader.\n\n**Begin with what is stated.**\nRead the short extract below. Identify a place, a time and one selected detail before deciding what it suggests. Do not invent background history because a place seems familiar.\n\n**Explain a detail’s job.**\nAn empty foyer behind a locked door can create uncertainty when a character expects an event to begin. The detail matters because it conflicts with the character’s expectation.\n\n**Distinguish detail from effect.**\n“There is a door” identifies a thing. “The unmoving door interrupts Mara’s expectation of getting ready” explains what it does in this situation. Readers can have different reactions, but a supported effect needs a link to the words.\n\nTry the frame “The detail ____ creates/suggests ____ because ____.” Use it to organise an explanation, not to replace thinking with a formula.",
      "example": "I DO:\nExtract: “Through the front glass she could see chairs, a folded display board and an empty foyer. The door would not move.”\nPlace: the front of the community hall.\nSelected detail: an empty foyer visible behind an unmoving door.\nEffect: uncertainty, because the expected exhibition preparations seem inaccessible.\n\nCOMPARE:\n“The foyer is empty” repeats the detail. I add how it affects the situation rather than listing another object.\n\nYOU TRY:\n“Warm light fell across the concrete” appears when the side entrance is open. How might that detail change the atmosphere? Try before reading on.\n\nCHECK:\nIt can suggest welcome or relief, contrasting with the blocked front entrance. Link the effect to the newly accessible entrance; do not claim warm light always has that meaning in every story.",
      "notice": "An effect depends on context. Do not turn one setting detail into a universal symbol without evidence.",
      "check": {
        "question": "Which statement explains a setting detail’s effect in this story?",
        "options": [
          "The hall contains several nouns",
          "The blocked entrance interrupts Mara’s expectation of getting ready",
          "The story has a place name",
          "Every locked door symbolises the same idea"
        ],
        "correct_index": 1,
        "explanation": "The blocked entrance matters because Mara expects to prepare her display. This connects the detail to its effect in this particular situation."
      }
    },
    {
      "icon": "📖",
      "title": "Infer character from action and dialogue",
      "explain": "**Characterisation is how a writer presents a character.**\nA writer may state a quality directly or reveal it through actions, dialogue and reactions. An inference is an interpretation supported by evidence, not a fact you add to the story.\n\n**Look for a pattern, not only a label.**\nMara pulls the handle again and worries about the roof. These details can suggest anxiety about the exhibition. One action does not prove a person always behaves that way.\n\n**Consider another explanation.**\nPulling again could also show determination to get inside. To choose between interpretations, combine details and explain which reading the wider passage supports.\n\n**Avoid unsupported mind-reading.**\n“Mara thinks every person dislikes her” is stronger than the text permits. “Her attention to the crooked roof suggests concern about how the model will be judged” is a more careful claim.\n\nUse suggests, implies or may reveal where you are interpreting. Then name the action or words that support the idea. A cautious verb does not make an unsupported guess valid by itself.",
      "example": "I DO:\nEvidence: Mara notices the crooked roof in the glass and later stops adjusting it when she reaches the open entrance.\nInference: she seems self-conscious about presenting the model, and access to the event eases that pressure.\nWhy: her attention shifts from checking the roof to stepping forward.\n\nCOMPARE:\n“Mara is bad at everything” is an unfair generalisation. The passage describes a particular moment, not her whole life.\n\nYOU TRY:\nAri checks the message and says, “We can check before deciding it’s closed.” What response does this suggest?\n\nCHECK:\nIt suggests a practical, evidence-seeking approach. Support that interpretation with his checking action rather than simply calling him clever.",
      "notice": "Describe a response in this situation before making a claim about a permanent personality trait.",
      "check": {
        "question": "Which is an evidence-based inference about Ari?",
        "options": [
          "He secretly owns the hall",
          "He has never made a mistake",
          "He takes a practical approach by checking the instructions",
          "He knows everyone’s private thoughts"
        ],
        "correct_index": 2,
        "explanation": "Checking the message and proposing that they investigate support a practical approach. The other claims add information the story does not supply."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Inference needs evidence",
            "transcript": "Pip: A character pulls a locked handle twice. Can I claim that they always make poor decisions?\nJuno: Keep the claim proportionate. Use the action and its context to interpret this moment.\nPip: I can consider another reading and explain which details support my view.\nJuno: Pause and try. Turn one character label into a careful claim with a supporting detail.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "A character pulls a locked handle twice. Can I claim that they always make poor decisions?"
                  },
                  {
                    "who": "juno",
                    "text": "Keep the claim proportionate. Use the action and its context to interpret this moment."
                  },
                  {
                    "who": "pip",
                    "text": "I can consider another reading and explain which details support my view."
                  },
                  {
                    "who": "juno",
                    "text": "Pause and try. Turn one character label into a careful claim with a supporting detail.",
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
      "icon": "📖",
      "title": "Trace plot through choices and consequences",
      "explain": "**Plot is a connected sequence.**\nA narrative’s events are more than a list of things happening. Identify a goal, obstacle, response and consequence. A consequence is the result of an action or situation.\n\n**Order is not the same as cause.**\nThen shows that an event follows another. Because or so can help explain why it happens or what follows from it. Only claim a causal link when the text supports it.\n\n**Locate a change of direction.**\nA turning point is a moment that changes how the main situation develops. Ari’s message-check and the decision to investigate the side entrance redirect the response from assuming closure to testing the instructions.\n\n**Explain how the problem settles.**\nThe resolution shows what happens to the central obstacle or goal. Getting inside lets Mara place her model. Her later sign change responds to the earlier confusion and suggests learning from the experience.\n\nDifferent turning-point choices can be defensible. Explain the approach before and after your chosen moment rather than relying on its position on the page.",
      "example": "I DO:\nGoal: prepare the model before visitors arrive.\nObstacle: the front door does not open.\nResponse: check the message and investigate the side entrance.\nConsequence: Mara gets inside and sets up.\nLater response: improve the sign with permission.\n\nMy connection: “Because Ari checks the instructions, they investigate a different entrance rather than accepting the first assumption.”\n\nYOU TRY:\nExplain why the second arrow at the front door connects to an earlier event.\n\nCHECK:\nIt responds to Mara missing the first sign and pulling the blocked handle. It is not an unrelated ending decoration: she uses her experience to help later arrivals.",
      "notice": "An exciting event is not automatically the turning point. Show what it changes in the developing problem.",
      "check": {
        "question": "Why does checking the message matter to the plot?",
        "options": [
          "It gives a reason to investigate another entrance",
          "It removes every character from the story",
          "It proves the front door is broken forever",
          "It adds an unrelated setting detail"
        ],
        "correct_index": 0,
        "explanation": "The instruction about a side entrance changes the next response and helps the characters reach their goal. The other interpretations are unsupported."
      }
    },
    {
      "icon": "📖",
      "title": "Build a claim, evidence and explanation",
      "explain": "**A claim answers an interpretive question.**\nFor example: “How does the story present Mara’s changing response?” Your claim should offer an idea about the text, not only repeat the question.\n\n**Choose precise evidence.**\nEvidence may be a short quotation or an accurately described action. Select the part that supports this claim. You do not need to copy an entire paragraph.\n\n**Explain the link.**\nAfter evidence, answer “How does this support my idea?” Naming a technique such as dialogue is useful only if you explain its role. A reader needs to follow your reasoning.\n\n**Keep the claim proportionate.**\nOne incident can suggest a change in this situation, not prove a character has permanently changed every belief. Check your wording against the strength of your evidence.\n\nReread the paragraph. Does the claim answer the question? Is the evidence accurate? Does the explanation add reasoning rather than retell the same event? Improve one weak link.",
      "example": "I DO:\nClaim: The story presents Mara moving from quick frustration towards a more considered response.\nEvidence: She first says, “That could mean anywhere,” but later asks permission to add another arrow.\nExplanation: Her early comment dismisses the sign; the later action acknowledges the problem and tries to improve it. The ending also lets both students recognise a useful point in the other’s view.\n\nCOMMON MISTAKE:\n“Mara changes. There is a sign.” The evidence is vague and the link missing. I name the contrasting responses and explain their effect.\n\nYOU TRY:\nMake one claim about Ari and choose one short supporting action. Explain the connection before comparing the model paragraph later in the lesson.",
      "notice": "A quotation does not explain itself. Add how the selected words or action support the particular claim.",
      "check": {
        "question": "What should follow a piece of textual evidence in an analytical paragraph?",
        "options": [
          "An unrelated fact about your weekend",
          "The same evidence copied again",
          "A guarantee that no other reading is possible",
          "An explanation linking the evidence to the claim"
        ],
        "correct_index": 3,
        "explanation": "The explanation shows why the evidence supports the claim. Repetition or unrelated information does not supply that reasoning."
      },
      "visual": [
        {
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 178\"><rect width=\"420\" height=\"178\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">CLAIM: your interpretation</text><text x=\"16\" y=\"80\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">EVIDENCE: precise words/action</text><text x=\"16\" y=\"126\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">EXPLAIN: how they connect</text></svg>",
          "alt": "An analysis links a claim with precise evidence and an explanation of how the evidence supports it.",
          "caption": "Explanation turns evidence into reasoning."
        }
      ]
    }
  ],
  "worked_example": "I DO: Read the complete original story.\nTHE SIDE ENTRANCE\n\nMara reached the community hall twenty minutes before the student exhibition opened. She had spent the week building a cardboard model and wanted it on a table before anyone arrived. Through the front glass she could see chairs, a folded display board and an empty foyer. The door would not move.\n\n“They said we could bring our work early,” she told Ari. She pulled the handle again. In the glass, her model’s crooked roof looked more noticeable than it had at home.\n\nAri set down his folder and checked the message on his phone. “It says side entrance for exhibitors.”\n\nMara looked along the wall. A small paper arrow pointed towards the corner, but she had walked straight past it. “That could mean anywhere,” she said.\n\n“We can check before deciding it’s closed.” Ari picked up his folder. He did not touch Mara’s model.\n\nAt the side door, a volunteer was holding the frame open while another student carried a painting through. Warm light fell across the concrete. Mara stopped adjusting the roof and stepped forward.\n\n“There’s a table for models at the back,” the volunteer said. “Take your time.”\n\nInside, Mara found a space and placed the model beside a bridge made from paddle-pop sticks. Nobody commented on her roof. Ari put his folder on the neighbouring table.\n\nMara took the paper arrow from the outside wall, showed it to the volunteer and asked whether they could add a second arrow near the front handle. With permission, she placed the new sign where the next student would see it before pulling.\n\nWhen she came back, Ari was straightening his display label. “You were right about checking,” she said. He looked up. “And you were right that the sign could be clearer.”\n\nMODEL ANALYTICAL PARAGRAPH\nThe story presents Ari as practical without making him dismissive of Mara’s concern. He checks the message and proposes that they investigate before deciding the hall is closed. This response uses available evidence to change their next action rather than arguing about who is right. However, his final comment that the sign “could be clearer” also recognises Mara’s experience. Together, the actions and dialogue suggest that a useful response combines checking an assumption with listening to someone affected by it.\n\nWHY THE PARAGRAPH WORKS\nThe claim is specific, the evidence includes action and dialogue, and the explanation identifies their relationship. It does not claim Ari is perfect or knows facts outside the text.\n\nCOMMON MISTAKE AND FIX\n“Ari has a phone, so he is practical” names an object rather than explaining its use. Fix: specify that he checks the instructions and uses what he finds to guide the next action.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 224\"><rect width=\"420\" height=\"224\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Assumption: hall is closed</text><text x=\"16\" y=\"80\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Check: side-entry instruction</text><text x=\"16\" y=\"126\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Action: investigate and set up</text><text x=\"16\" y=\"172\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Response: improve the sign</text></svg>",
      "alt": "A causal chain moves from an initial assumption through checking instructions to investigating, setting up and improving the sign.",
      "caption": "Use the chain to explain change, not merely list events."
    }
  ],
  "guided_practice": "WE DO: Build a setting explanation.\n1. Find a detail from the front entrance. Before reading the suggestion, say what makes it relevant. Suggestion: an empty foyer behind an unmoving door conflicts with Mara’s expectation of preparing early.\n2. Find a contrast at the side entrance. Suggestion: the open frame and warm light make entry possible and can create a more welcoming atmosphere.\n3. Draft a claim about the change in atmosphere. Starter: “The movement from ____ to ____ suggests ____.”\n4. Add one precise detail from each entrance. Explain why the difference matters to Mara’s goal.\n5. Reread. If you only list objects, add their effect. If you claim all darkness or light always has one meaning, narrow the statement to this story.\nYour interpretation can differ when supported. Try before comparing each suggestion.",
  "independent_task": "YOU DO: Close-reading response (about 25–30 minutes).\nUse The Side Entrance, included above.\n1. Make three notes: a setting detail and effect; a character action and possible inference; a choice and consequence in the plot.\n2. Write about 180–250 words answering: “How does the story develop Mara’s response to the blocked entrance?” Use two paragraphs if helpful.\n3. Support your response with at least two precise details. Explain each link; distinguish stated events from your interpretation.\n4. Check: focused claim; accurate evidence; explained connection; no invented thoughts or events; proportionate wording.\n5. Revise one weak link and include a short note explaining the revision.\nType in the big box or work on paper and type the response or a clear summary with your evidence-and-explanation sentences. An upload is optional. The word range guides the task; reasoning matters more than filler.",
  "response_prompt": "Which piece of evidence changed or strengthened your interpretation, and why?",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "What does setting include?",
      "options": [
        "Only a place name",
        "Only the title",
        "Where, when and the surrounding circumstances",
        "Every thought a reader invents"
      ],
      "correct_index": 2,
      "explanation": "Setting includes place, time and relevant circumstances. A place name alone does not capture all its possible roles."
    },
    {
      "type": "multiple_choice",
      "question": "Which detail supports uncertainty at the front entrance?",
      "options": [
        "An empty foyer behind an unmoving door",
        "A narrator’s invented school history",
        "A fact about an unrelated city",
        "A guarantee about all locked doors"
      ],
      "correct_index": 0,
      "explanation": "The visible emptiness and blocked access conflict with Mara’s expectation of setting up early."
    },
    {
      "type": "multiple_choice",
      "question": "What is an inference?",
      "options": [
        "A fact you add without evidence",
        "A copied title",
        "A claim that must be certain",
        "An interpretation supported by textual evidence"
      ],
      "correct_index": 3,
      "explanation": "An inference reasons from evidence. It is not an invented fact or an automatic certainty."
    },
    {
      "type": "multiple_choice",
      "question": "Which action supports Ari’s practical approach?",
      "options": [
        "He changes the exhibition date",
        "He checks the instructions before proposing a next step",
        "He comments on every model",
        "He knows all visitors’ thoughts"
      ],
      "correct_index": 1,
      "explanation": "Checking instructions supplies evidence for his proposed response. The other actions are not stated."
    },
    {
      "type": "multiple_choice",
      "question": "Why can pulling the handle again have more than one interpretation?",
      "options": [
        "Actions have no context",
        "Every interpretation is equally supported",
        "A reader must consider the action alongside other details",
        "The event never happened"
      ],
      "correct_index": 2,
      "explanation": "An action can suggest different responses; context and other evidence help assess which reading is supported."
    },
    {
      "type": "multiple_choice",
      "question": "What is a consequence in plot analysis?",
      "options": [
        "The result of an action or situation",
        "The number of letters in a name",
        "An unrelated object",
        "A word that always means a happy ending"
      ],
      "correct_index": 0,
      "explanation": "A consequence is a result that may shape what follows. It need not be happy."
    },
    {
      "type": "multiple_choice",
      "question": "Which moment changes the approach to the blocked entrance?",
      "options": [
        "Ari has a folder",
        "The story mentions a roof",
        "A model has cardboard",
        "They check the message and investigate the side entrance"
      ],
      "correct_index": 3,
      "explanation": "The checked instruction redirects them from an assumption of closure to investigating another entrance."
    },
    {
      "type": "multiple_choice",
      "question": "How does the new arrow connect to an earlier event?",
      "options": [
        "It proves every visitor was lost",
        "It responds to Mara missing the first sign",
        "It creates a different exhibition goal",
        "It removes the need for permission"
      ],
      "correct_index": 1,
      "explanation": "The extra arrow responds to the earlier confusion. Permission remains part of the stated action."
    },
    {
      "type": "multiple_choice",
      "question": "What makes evidence precise?",
      "options": [
        "It is long enough to fill a page",
        "It sounds impressive but cannot be located",
        "It identifies relevant words or an accurately described action",
        "It replaces all explanation"
      ],
      "correct_index": 2,
      "explanation": "Precise evidence can be located and connected to the claim. Length or impressiveness alone does not make it useful."
    },
    {
      "type": "multiple_choice",
      "question": "Which claim is proportionate to the evidence?",
      "options": [
        "Mara’s actions suggest a changed response in this situation",
        "Mara never makes another mistake in her life",
        "Everyone secretly dislikes the model",
        "The hall will always be closed"
      ],
      "correct_index": 0,
      "explanation": "The passage supports a situational change. The other claims go beyond what its events establish."
    }
  ],
  "parent_notes": "Parent: Teaches contextual effects of setting, careful character inference, causal plot analysis and claim-evidence-explanation paragraphs. The lesson follows the repository’s Year 7 narrative unit. Exact outcome codes are empty because a current Stage 4 code mapping was not verified from the accessible official page; do not claim full outcome coverage. All practice texts are original fiction.\n\nParent: Look for supported reasoning rather than a single prescribed interpretation. The supplied text is complete; no class novel is needed.\n\nParent: Allow a learner to split the reading into sections. Do not supply the scored answers. A different turning point can be valid when its change is explained. The lesson supplies the instruction, models and practice. The ten-question quiz is multiple-choice and the unchanged 90% threshold requires 9/10. Written analysis and reflection are part of the independent task, not automatically scored by the quiz.\n\nParent: Possible main-task interpretation: Mara initially reacts to blocked access and worries about the model, then investigates, enters and improves the sign. Use the handle, roof adjustment, entry and permission-seeking as evidence. Accept alternatives supported by the story. Reflection model: the sign-improvement action made me see her as responding constructively rather than only complaining.",
  "evidence_instructions": "Keep three close-reading notes, analytical response, one explained revision, reflection and quiz result. Review the claim-to-evidence links separately from spelling.",
  "offline_alternative": "Copy or print the included story. Make the three notes and response on paper, then type a summary and complete the quiz later.",
  "extension": "Compare two defensible interpretations of Mara’s repeated handle-pulling. Explain which additional detail makes one reading stronger.",
  "stage_hints": {
    "accept": [
      "Read the challenge and notice that your final response must explain evidence.",
      "Begin with one setting detail; character and plot connections follow.",
      "Keep a space for three notes: setting effect, character inference and plot consequence."
    ],
    "teach0": [
      "Look back at a detail and its effect as different parts of an explanation.",
      "Ask how the detail interacts with what Mara expects to do.",
      "Use “This detail suggests ____ because ____.” Keep the link specific to this situation."
    ],
    "teach1": [
      "Look back at an action and a proportionate inference.",
      "Consider what else the action might suggest before deciding.",
      "Combine two relevant details and explain why they support your reading of this moment."
    ],
    "teach2": [
      "Look back at the character’s goal and obstacle.",
      "Identify the choice before naming its result.",
      "Use a supported because/so connection and compare the approach before and after the key moment."
    ],
    "teach3": [
      "Look back at the three parts of the analytical model.",
      "Check that your evidence can be located and relates to the claim.",
      "After a detail, add “This suggests ____ because ____.” Explain the relationship instead of repeating the event."
    ],
    "learn": [
      "Read the whole story before the model paragraph.",
      "Locate each piece of evidence used in the model.",
      "Choose one action and explain its purpose in the argument before reading the next sentence."
    ],
    "guided": [
      "Start with a front-entrance detail before looking for a contrast.",
      "Make a short note about its effect on Mara’s expectation.",
      "Use the contrast starter with one detail from each entrance and explain why the change matters."
    ],
    "write": [
      "Look back at your three notes and decide which interpretation they support.",
      "Begin “The story presents Mara as ____ in response to ____.”",
      "A partial opening shape is “At the front entrance, Mara’s response suggests ____.” Fill the idea, then support it with a precise detail."
    ],
    "quiz": [
      "Return to setting, inference, plot or evidence reasoning as the question requires.",
      "Distinguish a stated event from a claim about what it suggests.",
      "Compare each option with the passage and avoid claims that require invented background information."
    ],
    "submit": [
      "Check that your response, revision note and reflection are ready.",
      "Include your evidence-and-explanation sentences if you worked on paper.",
      "Keep the original page for review and submit a clear typed summary or full response."
    ]
  }
}'),
    updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
WHERE seed_key = 's4-eng-y7-w01-l1';

UPDATE lessons
SET title = 'Year 7: Craft a purposeful story opening',
    data = json_patch(data, '{
  "seed_key": "s4-eng-y7-w01-l2",
  "title": "Year 7: Craft a purposeful story opening",
  "stage": "S4",
  "learning_area": "English",
  "year_level": "Year 7",
  "week": 1,
  "lesson_number": 2,
  "duration_minutes": 60,
  "child_mission": "Build an opening that earns a reader’s attention. Introduce a character in a specific situation, then revise your choices so the reader can follow the emerging tension.",
  "learning_intention": "We are learning to craft and revise a narrative opening using purposeful setting, action, perspective and a developing question.",
  "success_criteria": [
    "I can establish a character in a clear situation.",
    "I can select details that support an atmosphere or tension.",
    "I can keep a consistent viewpoint in this opening.",
    "I can revise a vague passage by showing a purposeful action."
  ],
  "materials": [
    "All texts and examples are included in this lesson",
    "Optional: paper and a pen for notes"
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
      "key": "situation",
      "label": "Character, setting and immediate intention",
      "hint": "Who arrives where, and what do they want to achieve now?"
    },
    {
      "key": "details_tension",
      "label": "Purposeful details and developing tension",
      "hint": "Name two details and the effect you want. What unexpected issue affects the intention?"
    },
    {
      "key": "viewpoint_action",
      "label": "Viewpoint and revealing action",
      "hint": "What can your close third-person character perceive? What action will reveal a response?"
    }
  ],
  "planner_title": "Plan your narrative opening",
  "planner_intro": "Use short but specific notes. All three boxes need enough words to explain a choice; they are a plan, not a complete script.",
  "spelling": null,
  "hoard_words": null,
  "follow_up_challenges": null,
  "steps": null,
  "visual_plan": null,
  "interactive_activities": null,
  "printable_resource": null,
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "📖",
      "title": "Establish a situation worth following",
      "explain": "**An opening makes a promise to the reader.**\nIt introduces enough of a situation for the reader to follow and suggests that something matters. A narrative is a story; its narrator is the voice telling it. The narrator and the writer are not automatically the same person.\n\n**Begin with someone doing something.**\nGive a character an immediate situation or intention. “Mara needed her model on the table before visitors arrived” is more purposeful than listing every object she owns.\n\n**Provide useful context.**\nA place, time or expectation can make an action understandable. You do not need a whole biography before the first event. Choose information that helps the reader understand this moment.\n\n**Create an emerging question.**\nAn obstacle, unusual detail or uncertain choice can make a reader ask what will happen next. It does not have to be an explosion or a dramatic sentence-ending question.\n\nTest your opening: can a new reader identify who is involved, what matters now and what they may want to discover next?",
      "example": "I DO:\nWeak start: “Mara was a student. She had a model. The hall had doors.”\nRevision: “Mara balanced her model against one arm and pulled the hall’s front handle. It did not move.”\n\nThe action establishes a person, an object that matters and a blocked entrance. I can add the exhibition timing next, rather than beginning with unrelated history.\n\nYOU TRY:\nWrite two opening sentences about someone arriving to prepare a display and finding something unexpected.\n\nCHECK:\nYour unexpected detail should connect to the arrival or goal. If a reader cannot tell why it matters, add a short intention or expectation instead of another unrelated surprise.",
      "notice": "Attention comes from a meaningful situation, not only dramatic wording. Give the reader enough context to follow the question you create.",
      "check": {
        "question": "Which opening establishes an immediate situation and emerging question?",
        "options": [
          "Many people exist in many places",
          "A character has objects listed by colour",
          "Mara pulls the hall’s handle, but it does not move",
          "The story will contain events later"
        ],
        "correct_index": 2,
        "explanation": "The action and obstacle give a reader a situation and a reason to wonder what happens next. The other choices postpone that information."
      }
    },
    {
      "icon": "📖",
      "title": "Select details for a purpose",
      "explain": "**Description should do work.**\nA selected detail can establish a place, create atmosphere, reveal what a character notices or increase pressure. Sensory detail refers to what can be seen, heard, felt, smelled or tasted; it is useful when it serves the passage.\n\n**Choose rather than inventory.**\nThe roof appearing crooked in the glass matters because Mara is concerned about presenting the model. A list of every chair colour might distract from that concern.\n\n**Make a detail specific.**\n“It was a place” provides little to picture. “An empty foyer behind the glass” gives a more exact impression. Specific does not mean adding an adjective to every noun.\n\n**Match detail to intention.**\nIf you want uncertainty, choose details that support uncertainty in this situation. Do not assume one object always produces the same mood.\n\nAfter drafting, underline two details. For each, explain its job. Remove or change one that adds length but does not help the opening.",
      "example": "I DO:\nPlain: “Mara looked at the hall.”\nPurposeful detail: “Through the front glass she could see a folded display board and an empty foyer.”\nThe visible preparations suggest an event should happen, but the empty space and locked access complicate that expectation.\n\nCOMPARE:\n“The hall was big, nice, good and interesting” uses evaluative words without showing what the character notices.\n\nYOU TRY:\nChoose a sound or visible detail for a quiet exhibition entrance. Explain the effect you want before drafting it.\n\nCHECK:\nYou might choose an unanswered knock or a corridor with no footsteps to support uncertainty. Explain the context; do not treat silence as always frightening.",
      "notice": "A detail is purposeful when you can explain its role. Keep effects connected to this particular scene.",
      "check": {
        "question": "Which revision makes a setting impression more specific?",
        "options": [
          "It was a very place-like place",
          "An empty foyer was visible behind the glass",
          "It was nice and good and fine",
          "Things existed"
        ],
        "correct_index": 1,
        "explanation": "The empty foyer and glass supply a visible, specific detail. The other choices stay vague or only evaluate."
      },
      "visual": [
        {
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 178\"><rect width=\"420\" height=\"178\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">DETAIL → PURPOSE → EFFECT</text><text x=\"16\" y=\"80\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">What does the character notice?</text><text x=\"16\" y=\"126\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Why does it matter here?</text></svg>",
          "alt": "A setting detail should have a purpose and explainable effect in the character’s current situation.",
          "caption": "Select details instead of listing everything."
        }
      ]
    },
    {
      "icon": "📖",
      "title": "Control viewpoint and reveal response",
      "explain": "**Viewpoint controls what the reader can access.**\nFirst-person narration uses a character’s I perspective. Third-person narration refers to characters by names or pronouns such as she, he or they. Third-person storytelling can have different ranges of knowledge.\n\n**Use one clear approach for this task.**\nPractise a third-person opening closely following one character. Show what that character perceives and thinks, without suddenly reporting everyone else’s private thoughts. This is a task choice, not a rule that all narratives must use it.\n\n**Reveal a response through action.**\nA repeated handle-pull or adjustment to a model can suggest concern. You can state a feeling when useful, but an action gives the reader something to interpret.\n\n**Avoid mechanical viewpoint switches.**\n“Mara pulled the handle. I wondered why it was locked” changes the telling voice without an explanation. Keep your chosen approach steady or clearly establish a deliberate change.\n\nRead your draft and identify who sees or knows each detail. If a sentence reports an unexplained private thought from another person, revise the access.",
      "example": "I DO:\n“Mara saw Ari check his phone. She could not tell whether he was annoyed.”\nThis stays with what Mara perceives and her uncertainty. It does not claim knowledge of Ari’s private response.\n\nCOMPARE:\n“Mara was nervous. Ari secretly decided her work was terrible.” The second sentence jumps into his mind. For our close third-person task, I would show something Mara can observe or keep her uncertainty.\n\nYOU TRY:\nRewrite “Mara adjusted the roof. I felt everyone was judging her” in the task’s viewpoint.\n\nCHECK:\nOne option: “Mara adjusted the roof and wondered whether anyone would notice.” It follows her response without switching to an unexplained I narrator.",
      "notice": "Third person does not always mean all-knowing. Decide the narrator’s access for this task and keep it consistent.",
      "check": {
        "question": "Which sentence fits a close third-person opening following Mara?",
        "options": [
          "Mara noticed Ari’s folded arms but could not know what he thought",
          "I, an unexplained new narrator, knew all her secrets",
          "Every person’s private thoughts appeared without transition",
          "The writer and Mara must be identical"
        ],
        "correct_index": 0,
        "explanation": "The sentence follows Mara’s perception and limits knowledge of Ari’s thoughts. The other choices introduce unexplained or false assumptions."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Choose what your narrator can know",
            "transcript": "Pip: My opening follows one character, but I suddenly state another person’s private thoughts.\nJuno: For this task, keep close third-person access consistent. Show what the focal character can perceive.\nPip: I can show an action or preserve uncertainty rather than claiming unexplained knowledge.\nJuno: Pause and try. Check one sentence for who sees or knows its information.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "My opening follows one character, but I suddenly state another person’s private thoughts."
                  },
                  {
                    "who": "juno",
                    "text": "For this task, keep close third-person access consistent. Show what the focal character can perceive."
                  },
                  {
                    "who": "pip",
                    "text": "I can show an action or preserve uncertainty rather than claiming unexplained knowledge."
                  },
                  {
                    "who": "juno",
                    "text": "Pause and try. Check one sentence for who sees or knows its information.",
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
      "icon": "📖",
      "title": "Draft, compare and revise",
      "explain": "**Draft a short opening before polishing it.**\nFor this task, aim for a character in a situation, two purposeful details and an emerging tension. You are writing an opening, not the entire resolution.\n\n**Revise meaning before surface detail.**\nRevision changes what the reader understands or how the passage works. Editing checks details such as spelling and punctuation. Both matter, but correcting a comma will not supply an unclear goal.\n\n**Compare versions with a reason.**\n“The character was upset” might become an action revealing that response. Do not add an action merely because it sounds vivid; it must fit the intended situation.\n\n**Keep orientation while creating curiosity.**\nWithholding every name, place and intention can confuse instead of intrigue. Add enough information to let the reader follow the developing problem.\n\nUse a final checklist: clear situation; purposeful details; consistent task viewpoint; meaningful action; an emerging question. Choose one revision and explain its intended effect.",
      "example": "I DO:\nFirst version: “Mara was stressed. The model was not perfect. The door was bad.”\nRevision: “Mara shifted the model to her other arm and pulled the handle again. In the glass, the roof leaned further than she remembered.”\n\nThe actions and perception make her concern visible. I would add the exhibition context nearby so the reader knows why the model and entrance matter.\n\nYOU TRY:\nRevise “Ari was patient” with an action suited to waiting at an entrance.\n\nCHECK:\n“Ari set his folder down and read the message again before answering” can suggest a measured response. It is one possible choice, not a sentence to copy into every story.",
      "notice": "More descriptive words are not automatically a better revision. Explain how the change improves the reader’s understanding or attention.",
      "check": {
        "question": "Which revision explanation is useful?",
        "options": [
          "I made the passage longer, so it must be better",
          "I added unrelated objects to fill space",
          "I removed all context so no reader could follow it",
          "I replaced a vague feeling label with a relevant action to show the response"
        ],
        "correct_index": 3,
        "explanation": "The explanation connects a deliberate revision to its effect. Length, filler and total loss of context do not establish an improvement."
      }
    }
  ],
  "worked_example": "I DO: A complete model opening\nBEFORE THE DISPLAY\n\nTalia reached the hall with a paper sculpture balanced on its cardboard base. She had promised to set it up before the first visitors arrived. The noticeboard outside still displayed last month’s timetable.\n\nShe checked the event message, then the number above the entrance. Both matched. Beyond the glass, a cleaner moved between empty tables without looking towards the door. Talia lifted a hand to knock, but the sculpture shifted.\n\nShe lowered it carefully onto the dry step. One folded corner had opened during the walk. Talia pressed it back and glanced at the noticeboard again. If she could not get someone’s attention, there would be no time to repair the corner before the display began.\n\nWHY THE OPENING WORKS\nTalia has a clear intention. The outdated timetable and inaccessible activity create uncertainty, while the sculpture’s movement adds practical pressure. The narrator follows her perceptions rather than reporting the cleaner’s thoughts. The passage establishes a developing question without solving the whole problem.\n\nCOMMON MISTAKE AND FIX\n“Everyone knew Talia would fail” would claim unexplained access and predetermine the event. Keeping her uncertainty lets the reader discover what happens with her.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 224\"><rect width=\"420\" height=\"224\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Person + situation + intention</text><text x=\"16\" y=\"80\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Two details with a purpose</text><text x=\"16\" y=\"126\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Consistent viewpoint</text><text x=\"16\" y=\"172\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">A question worth following</text></svg>",
      "alt": "A story opening combines situation, purposeful details, consistent viewpoint and an emerging question.",
      "caption": "Curiosity works best when the reader has enough context."
    }
  ],
  "guided_practice": "WE DO: Plan an opening from a different prompt.\nPrompt: A student brings work to a community event, but the preparations are not what they expected.\n1. Name the student and immediate intention. Try before comparing: a learner wants to arrange a display before opening.\n2. Choose one unexpected detail that affects that intention, such as the allocated table being occupied. Avoid a random surprise with no connection.\n3. Choose two observable details. Explain the effect each should have.\n4. Draft three sentences in close third person: action; useful context; response to the unexpected detail.\n5. Check access. Can the character observe or think what each sentence describes? Replace an unexplained claim about another mind.\n6. Improve one vague feeling label using a relevant action. Explain what you want the reader to infer.",
  "independent_task": "YOU DO: Write and revise an opening (about 30 minutes).\nUse the event-arrival prompt or another small situation you can clearly establish.\n1. Complete the three plan boxes. Select a character, intention, two purposeful details and a response to an emerging problem.\n2. Draft about 180–250 words in close third person following one character. Write an opening, not a whole resolved story.\n3. Keep the reader oriented while leaving a meaningful question to follow. Show one response through action or perception.\n4. Underline or list two details and explain each intended effect.\n5. Revise one vague or confusing sentence. Include the before-and-after sentence and your reason.\nSuccess checklist: clear situation; purposeful detail; consistent access to knowledge; relevant revealing action; readable sentences.\nType the draft, detail notes and revision in the big box. Paper work can be submitted as a typed draft or a clear summary with the opening sentences and revision; an upload is optional.",
  "response_prompt": "Which deliberate choice most helped your opening engage or orient a reader, and why?",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "What should a purposeful opening establish?",
      "options": [
        "Every detail of a whole biography",
        "A character in a situation that matters",
        "A resolution before any context",
        "Only decorative adjectives"
      ],
      "correct_index": 1,
      "explanation": "An opening gives enough situation and significance for a reader to follow the developing story."
    },
    {
      "type": "multiple_choice",
      "question": "Which question tests the relevance of a setting detail?",
      "options": [
        "How many colours can I list?",
        "Does every sentence use it?",
        "What does it help the reader understand or feel here?",
        "Can it replace all action?"
      ],
      "correct_index": 2,
      "explanation": "Relevance depends on the detail’s purpose in this scene, not its quantity or repetition."
    },
    {
      "type": "multiple_choice",
      "question": "What is sensory detail?",
      "options": [
        "Information about what can be perceived through senses",
        "A list of every private thought",
        "Only a place name",
        "Any long word"
      ],
      "correct_index": 0,
      "explanation": "Sensory details involve seeing, hearing, feeling, smelling or tasting. Their use still needs a purpose."
    },
    {
      "type": "multiple_choice",
      "question": "Which wording is more specific than “The hall was nice”?",
      "options": [
        "It was good and fine",
        "The place was a place",
        "Things were there",
        "Warm light fell through the open side door"
      ],
      "correct_index": 3,
      "explanation": "The visible light and doorway give a concrete impression rather than a general evaluation."
    },
    {
      "type": "multiple_choice",
      "question": "What does first-person narration commonly use?",
      "options": [
        "Only anonymous place names",
        "An I perspective in the telling voice",
        "A guarantee that the narrator is the real writer",
        "No pronouns"
      ],
      "correct_index": 1,
      "explanation": "First-person narration uses an I perspective. The narrator is not automatically the writer."
    },
    {
      "type": "multiple_choice",
      "question": "What is the viewpoint task in this lesson?",
      "options": [
        "Report every person’s private thoughts without transition",
        "Change narrator each sentence",
        "Follow one character in close third person",
        "Never name a character"
      ],
      "correct_index": 2,
      "explanation": "The task practises consistent close third-person access, while acknowledging that other narrative approaches exist."
    },
    {
      "type": "multiple_choice",
      "question": "Which detail fits close third-person access to Talia?",
      "options": [
        "She sees the cleaner move but does not know the cleaner’s thoughts",
        "The cleaner’s secret plan appears without explanation",
        "Every future event is guaranteed",
        "The writer and Talia are the same person"
      ],
      "correct_index": 0,
      "explanation": "The detail stays with what Talia can perceive and leaves another person’s private thoughts uncertain."
    },
    {
      "type": "multiple_choice",
      "question": "What does revision address beyond surface editing?",
      "options": [
        "Only the number of pages",
        "Only spelling every name",
        "Only increasing font size",
        "The meaning and working of the passage"
      ],
      "correct_index": 3,
      "explanation": "Revision can change situation, clarity, structure or effect. Surface editing alone does not supply missing meaning."
    },
    {
      "type": "multiple_choice",
      "question": "Why can withholding all context weaken an opening?",
      "options": [
        "Every detail must be explained at once",
        "The reader may be confused rather than curious",
        "Openings cannot create questions",
        "A character must have no intention"
      ],
      "correct_index": 1,
      "explanation": "Curiosity needs enough orientation for a reader to understand what matters. Total withholding can remove that foundation."
    },
    {
      "type": "multiple_choice",
      "question": "Which action can reveal a measured response in the example?",
      "options": [
        "Ari knows everyone’s thoughts",
        "Ari changes the weather",
        "Ari reads the message again before answering",
        "Ari has no role in the scene"
      ],
      "correct_index": 2,
      "explanation": "The deliberate checking action can suggest a measured response in the stated context."
    }
  ],
  "parent_notes": "Parent: Teaches purposeful narrative openings, selected sensory/context details, close third-person access and revision for effect. The lesson follows the repository’s Year 7 narrative unit. Exact outcome codes are empty because a current Stage 4 code mapping was not verified from the accessible official page; do not claim full outcome coverage. All practice texts are original fiction.\n\nParent: Review the draft against its plan and explanations. Do not require a fixed opening formula or a particular surprise. The word range guides practice.\n\nParent: If the learner stalls, have them explain one person’s immediate intention and one related obstacle before adding details. Let them make the choices. The lesson supplies the instruction, models and practice. The ten-question quiz is multiple-choice and the unchanged 90% threshold requires 9/10. Written analysis and reflection are part of the independent task, not automatically scored by the quiz.\n\nParent: Possible response: a student arrives to set up, sees an occupied table, checks the allocation and takes a deliberate next action. A strong opening connects selected details to the pressure, stays with the character’s perception and explains one purposeful revision. Reflection model: I showed the character checking the table number so the uncertainty feels grounded in the setting.",
  "evidence_instructions": "Keep planner notes, opening draft, two detail-effect explanations, one before-and-after revision, reflection and quiz result.",
  "offline_alternative": "Draw three planning boxes using the lesson’s labels. Draft and revise on paper, then type the opening or a clear summary and complete the quiz later.",
  "extension": "Rewrite the first three sentences in first person. Explain what changes in access or voice without treating either version as automatically better.",
  "stage_hints": {
    "accept": [
      "Read the challenge and notice that you are crafting only an opening.",
      "Start with a person’s immediate intention before choosing a dramatic event.",
      "Keep a few notes about situation, purposeful details and viewpoint as you work."
    ],
    "teach0": [
      "Look back at a character doing something that matters.",
      "Ask what a new reader needs to understand the current intention.",
      "Try an action-and-context pair, then check what question it gives the reader to follow."
    ],
    "teach1": [
      "Look back at a detail and the job it does.",
      "Choose something observable that connects to the character’s situation.",
      "After a detail, explain “I want this to suggest ____ because ____.” Remove an unrelated addition."
    ],
    "teach2": [
      "Look back at what the focal character can perceive or think.",
      "Identify whose knowledge each sentence reports.",
      "Keep an observed action or the character’s uncertainty where another person’s private thoughts are not available."
    ],
    "teach3": [
      "Look back at the difference between revising meaning and surface editing.",
      "Find one vague or confusing place before adding extra adjectives.",
      "Replace or add information that serves your intended effect, then explain the reason for the change."
    ],
    "learn": [
      "Read the model opening before its explanation.",
      "Locate the intention and two purposeful details in the actual sentences.",
      "Check whose perceptions each detail follows and what unresolved question remains."
    ],
    "guided": [
      "Begin with the arrival and intention before the unexpected detail.",
      "Choose one obstacle related to that intention and two observable details.",
      "Draft an action, context and response in three sentences before expanding the opening."
    ],
    "plan": [
      "Start with the situation box and one specific intention.",
      "Give each planned detail an intended effect rather than only naming an object.",
      "Use “My character wants ____ but notices ____.” Then choose what their viewpoint can reveal."
    ],
    "write": [
      "Look back at the plan and draft your opening action first.",
      "Begin “At ____, ____ checked ____.” Add why that action matters in the next thought.",
      "A partial opening shape is “With ____ balanced in one arm, ____ reached ____.” Fill it from your own plan and keep the viewpoint steady."
    ],
    "quiz": [
      "Return to situation, detail, viewpoint or revision as the question requires.",
      "Distinguish the narrator’s access from information the writer privately knows.",
      "Test whether each option supports a clear, purposeful opening rather than merely a longer one."
    ],
    "submit": [
      "Check that the draft, detail notes and revision are ready.",
      "Include the reflection and a clear record of what you changed.",
      "If you drafted on paper, type the opening or its main sentences and revision explanation, and keep the page."
    ]
  }
}'),
    updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
WHERE seed_key = 's4-eng-y7-w01-l2';

UPDATE lessons
SET title = 'Year 7: Use nouns, verbs and sentence types deliberately',
    data = json_patch(data, '{
  "seed_key": "s4-eng-y7-w01-l3",
  "title": "Year 7: Use nouns, verbs and sentence types deliberately",
  "stage": "S4",
  "learning_area": "English",
  "year_level": "Year 7",
  "week": 1,
  "lesson_number": 3,
  "duration_minutes": 60,
  "child_mission": "Investigate how a sentence works before changing it. Identify its nouns and verb group, then choose a purpose and structure that suit a narrative moment.",
  "learning_intention": "We are learning to identify core word functions and compare sentence purposes and structures in narrative writing.",
  "success_criteria": [
    "I can distinguish a common noun from a proper noun in context.",
    "I can identify an action or state and its verb group.",
    "I can explain the purpose of a statement, question, command or exclamation.",
    "I can compare simple, compound and complex structures in the examples.",
    "I can explain a purposeful sentence revision."
  ],
  "materials": [
    "All texts and examples are included in this lesson",
    "Optional: paper and a pen for notes"
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
  "interactive_activities": null,
  "printable_resource": null,
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "📖",
      "title": "Identify nouns in context",
      "explain": "**A noun names a person, place, thing or idea.**\nCommon nouns name a class, such as student, hall or model. Proper nouns identify particular names, such as Mara. Proper names normally begin with capitals. An abstract noun names an idea or quality, such as uncertainty.\n\nThese labels describe different features: uncertainty is an abstract common noun, while Mara is a proper noun. Do not assume each word can belong to only one category.\n\n**Find the noun’s role.**\nIn “Mara carried the model”, Mara is who the clause is about and model names what she carries. A noun can appear inside a larger group: “the crooked cardboard model” contains the noun model with describing words around it.\n\n**Use context, not spelling alone.**\nSome words can do different jobs. “The light faded” uses light as a noun. “They light the room” uses light as a verb. Decide from what the word is doing in this sentence.\n\nWhen revising fiction, a specific noun can help a reader picture the scene. Check that added specificity fits the situation rather than inventing a different object.",
      "example": "I DO:\nSentence: “Mara placed the model in the hall.”\nMara: a proper noun naming a particular character.\nModel and hall: common nouns naming a thing and place.\n\nMore precise group: “the cardboard model”. The noun remains model; cardboard supplies information about it.\n\nYOU TRY:\nFind the noun in “The uncertainty slowed Mara.” Compare your answer before reading on.\n\nCHECK:\nUncertainty names an idea and Mara names the character. Slowed gives the action or effect. A word about an idea can still be a noun.",
      "notice": "Do not identify a noun only because it is long or important. Explain what it names and what it does in the sentence.",
      "check": {
        "question": "Which word is a proper noun in “Mara entered the hall”?",
        "options": [
          "Entered",
          "The",
          "Hall",
          "Mara"
        ],
        "correct_index": 3,
        "explanation": "Mara is the particular character’s name. Hall is a common noun; entered is a verb."
      }
    },
    {
      "icon": "📖",
      "title": "Find actions, states and verb groups",
      "explain": "**Verbs express more than movement.**\nA verb can express an action, such as carried, or a state/relationship, such as is in “The model is fragile”. Looking only for visible movement will miss some verbs.\n\n**Check the whole verb group.**\nIn “Mara had waited”, had helps form the verb group had waited. In “Ari could help”, could and help work together. Helping verbs can add time or possibility information.\n\n**Connect the verb with its subject.**\nIn our statement examples, identify who or what the clause is about, then the verb group. “The students were waiting” connects a plural subject with were waiting. Use a form that fits the intended subject and time.\n\n**Choose a verb for the intended action.**\n“Mara moved to the entrance” can become hurried if haste is intended, or approached if the emphasis is getting closer. The alternatives are not identical. A more specific verb should preserve or deliberately develop your meaning.\n\nRead the sentence after changing a verb. Do not add a dramatic action that contradicts the event you meant to describe.",
      "example": "I DO:\n“Mara had waited beside the door.”\nSubject: Mara.\nVerb group: had waited. I keep both words when identifying the group.\nPlace information: beside the door.\n\nCOMPARE:\n“The model is fragile.” Is is a verb even though nothing moves. Fragile describes the model.\n\nYOU TRY:\nIdentify the verb group in “Ari could check the message.”\n\nCHECK:\nCould check is the group. Could adds possibility; check names the action. Message is the noun naming what may be checked.",
      "notice": "A verb group may have more than one word. Include a helping verb where it belongs, and distinguish the group from surrounding description.",
      "check": {
        "question": "What is the verb group in “Ari could check the message”?",
        "options": [
          "The message",
          "Could check",
          "Ari only",
          "Message check"
        ],
        "correct_index": 1,
        "explanation": "Could and check form the verb group. The other words identify a person or object rather than the whole group."
      }
    },
    {
      "icon": "📖",
      "title": "Choose a sentence’s communicative purpose",
      "explain": "**Purpose and structure are different questions.**\nHere, sentence purpose means what the sentence does for communication. Our examples use four common types: a statement gives information; a question asks; a command directs; an exclamation expresses a strong response.\n\n**Compare one situation.**\nStatement: “The model is ready.”\nQuestion: “Is the model ready?”\nCommand: “Check the model.”\nExclamation: “What a careful repair that was!”\n\nThe command can omit an expressed you because the addressee is understood. Do not label it incomplete merely because the person is not written.\n\n**Read beyond the end mark.**\nPunctuation helps, but does not do all the classification. “Check the model!” is still directing someone, with strong emphasis. A statement can also carry an exclamation mark. Look at wording and purpose, not only the final symbol.\n\n**Choose for the narrative moment.**\nA character’s question can reveal uncertainty; a command can show a request or direction. Decide what the character means before selecting the form.",
      "example": "I DO:\nNeutral information: “The side entrance is open.”\nUncertainty: “Is the side entrance open?”\nDirection: “Try the side entrance.”\nStrong response: “What a relief this is!”\n\nThese are choices about communication, not a rule that every scene needs all four types.\n\nYOU TRY:\nTurn “The label is clear” into a question and a direction to someone who should check it.\n\nCHECK:\n“Is the label clear?” asks. “Check the label” directs. A full stop or emphatic exclamation mark can finish the direction according to context.",
      "notice": "A purpose label does not tell you how many clauses the sentence contains. Keep purpose and grammatical structure separate.",
      "check": {
        "question": "Why is “Check the model!” a command in this example?",
        "options": [
          "Every exclamation mark proves a question",
          "It contains no verb",
          "It directs an understood addressee to act",
          "Every short sentence is a statement"
        ],
        "correct_index": 2,
        "explanation": "The wording directs someone to check. The exclamation mark adds emphasis but does not remove the command’s function."
      },
      "visual": [
        {
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 178\"><rect width=\"420\" height=\"178\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">PURPOSE: what it communicates</text><text x=\"16\" y=\"80\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">STRUCTURE: how clauses connect</text><text x=\"16\" y=\"126\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">An end mark is only a clue.</text></svg>",
          "alt": "Sentence purpose and clause structure answer different questions; punctuation is a clue rather than the whole classification.",
          "caption": "Explain both with the actual wording."
        }
      ]
    },
    {
      "icon": "📖",
      "title": "Compare simple, compound and complex structures",
      "explain": "**A clause contains a verb and usually a subject.**\nIn our statement examples, “Mara waited” can stand as a complete sentence: it is an independent clause. “Because Mara waited” gives a reason but depends on another clause to complete the intended sentence.\n\n**A simple sentence has one independent clause.**\n“Mara waited by the door.” It can still contain detail. “Mara had waited by the door” still has one independent clause, even though its verb group has two words. Two words in a verb group do not prove a compound sentence.\n\n**A compound sentence connects independent clauses.**\n“Mara waited, but Ari checked the message.” Mara waited and Ari checked the message can each stand alone. But connects them, and the comma marks the boundary in this model.\n\n**A complex sentence includes a dependent clause.**\n“Because the front door would not open, Mara waited.” The because clause depends on the main clause. It explains a reason. Put the opening dependent part with its main idea rather than leaving it stranded.\n\n**Choose according to meaning.**\nOne clear action may suit a simple sentence; a contrast can suit a compound; a reason can suit a complex. Complexity is not automatically better. Identify the relationship you need.",
      "example": "I DO:\nSimple: “Ari read the message.” One independent clause.\nCompound: “Ari read the message, and Mara looked for the arrow.” Two independent clauses joined by and.\nComplex: “After Ari read the message, Mara looked for the arrow.” The opening after clause depends on the main clause and organises the timing.\n\nCOMMON MISTAKE:\n“After Ari read the message.” leaves the dependent part without its main idea in this practice task. I add what follows.\n\nYOU TRY:\nJoin “The door was locked” and “Mara waited” to explain a reason.\n\nCHECK:\n“Because the door was locked, Mara waited” links the reason and main clause. Another accurate arrangement is possible. Do not join unrelated facts with because merely to make a complex structure.",
      "notice": "Count clauses and identify their independence, not just the number of verbs or words. Use a sentence type because it serves a relationship.",
      "check": {
        "question": "Which example is a compound sentence as taught here?",
        "options": [
          "Mara waited, but Ari checked the message",
          "Because Mara waited",
          "Mara waited by the door",
          "The patient student waited"
        ],
        "correct_index": 0,
        "explanation": "Mara waited and Ari checked the message are independent clauses joined by but. The other choices are a dependent fragment or one independent clause."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Sentence purpose is not clause structure",
            "transcript": "Pip: A sentence can ask a question, but that does not tell me how many clauses it contains.\nJuno: Purpose asks what it communicates. Structure asks how its clauses work together.\nPip: I will identify the verb groups and check which clauses can stand independently.\nJuno: Pause and try. Explain one sentence’s purpose and structure as two separate observations.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "A sentence can ask a question, but that does not tell me how many clauses it contains."
                  },
                  {
                    "who": "juno",
                    "text": "Purpose asks what it communicates. Structure asks how its clauses work together."
                  },
                  {
                    "who": "pip",
                    "text": "I will identify the verb groups and check which clauses can stand independently."
                  },
                  {
                    "who": "juno",
                    "text": "Pause and try. Explain one sentence’s purpose and structure as two separate observations.",
                    "pause_after": true
                  }
                ]
              }
            ]
          }
        }
      ]
    }
  ],
  "worked_example": "I DO: Analyse and revise a short passage.\nORIGINAL\nMara waited. Ari had checked the message. The entrance was on the side.\n\nWORD FUNCTIONS\nMara and Ari are proper nouns. Message and entrance are common nouns. Had checked is a verb group; was expresses a relationship in the final statement.\n\nPURPOSE\nThe original sentences are statements. A character could instead ask “Is the entrance on the side?” if that uncertainty suits the moment.\n\nSTRUCTURE AND REVISION\n“After Ari had checked the message, Mara looked towards the side entrance.”\nThe opening after clause depends on the main clause. The complex structure makes the timing explicit. This is a revised fictional passage; I deliberately change Mara’s action from waiting to looking, so I should explain that change rather than pretend the wording preserves every event unchanged.\n\nMEANING-PRESERVING ALTERNATIVE\n“Ari had checked the message, and Mara waited.” This compound structure combines the stated actions without inventing a new movement.\n\nCOMMON MISTAKE AND FIX\nCalling had checked two separate clauses only because it has two words misses the verb group. I find the whole group and its subject before counting clauses.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 178\"><rect width=\"420\" height=\"178\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Simple: one independent clause</text><text x=\"16\" y=\"80\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Compound: independent + independent</text><text x=\"16\" y=\"126\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Complex: main + dependent</text></svg>",
      "alt": "Three structural examples: a simple sentence has one independent clause, a compound connects independent clauses, and a complex combines a main clause with a dependent clause.",
      "caption": "Identify the relationship before choosing the form."
    }
  ],
  "guided_practice": "WE DO: Work with “Ari could help. Mara held the model.”\n1. Identify nouns before comparing: Ari and Mara name particular characters; model names a thing.\n2. Identify the verb groups: could help and held. Do not split could from help when naming the group.\n3. Turn “Mara held the model” into a question. One option is “Did Mara hold the model?” Notice that the helping verb and main form change together.\n4. Join the original statements as a compound: “Ari could help, and Mara held the model.” Each part can stand independently.\n5. For a new fictional version, use because only if you intend and support a reason, such as “Because Ari could help, Mara let him hold the model.” Explain that this version changes the event instead of presenting it as an unchanged copy.\n6. State one purpose and one structure separately. Your explanation should refer to the actual wording.",
  "independent_task": "YOU DO: Sentence Investigator task (about 25–30 minutes).\nPractice passage: “Mara waited by the door. Ari had checked the message. The side entrance was open. Mara carried the model inside.”\n1. List two proper nouns and two common nouns, identifying what they name. If a name repeats, it is still the same noun; choose Mara and Ari rather than claiming duplicates are new examples.\n2. Identify the verb group in each sentence. Include had with checked.\n3. Create a question and a command about the model or entrance. Explain each communicative purpose.\n4. Combine two supplied events into a compound sentence. Show the two parts that can stand alone.\n5. Write a complex sentence linking a reason or time relationship you deliberately intend. Name the dependent part. Explain if your new fictional version changes any event.\n6. Check: nouns identified in context; verb groups complete; purpose separate from structure; relationships sensible; marks checked.\nType the examples and explanations in the big box, or work on paper and type a clear summary of your analyses. Do not increase length merely to make a sentence sound advanced.",
  "response_prompt": "Which sentence choice made a relationship clearer, and why?",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "Which is a common noun in “Mara carried the model”?",
      "options": [
        "Mara",
        "Carried",
        "The",
        "Model"
      ],
      "correct_index": 3,
      "explanation": "Model names a class of thing. Mara is a particular name and carried is the verb."
    },
    {
      "type": "multiple_choice",
      "question": "Why is uncertainty a noun in “The uncertainty slowed Mara”?",
      "options": [
        "Every long word is a noun",
        "It names an idea acting as the subject here",
        "It describes the roof’s colour",
        "It must be a proper name"
      ],
      "correct_index": 1,
      "explanation": "Uncertainty names an abstract idea and functions as a noun in the sentence."
    },
    {
      "type": "multiple_choice",
      "question": "Why must light be considered in context?",
      "options": [
        "It can never be used in a sentence",
        "It is always a proper noun",
        "It can function as a noun or verb in different sentences",
        "Its spelling decides every function"
      ],
      "correct_index": 2,
      "explanation": "The light faded uses light as a noun; they light the room uses it as a verb. Function depends on the sentence."
    },
    {
      "type": "multiple_choice",
      "question": "Which is the whole verb group in “Mara had waited”?",
      "options": [
        "Had waited",
        "Mara only",
        "Waited Mara",
        "Had Mara"
      ],
      "correct_index": 0,
      "explanation": "Had and waited form the verb group. Mara is the subject."
    },
    {
      "type": "multiple_choice",
      "question": "Why is is a verb in “The model is fragile”?",
      "options": [
        "Fragile must move",
        "Every descriptive word is a verb",
        "The sentence has no verb",
        "It expresses a state or relationship rather than visible movement"
      ],
      "correct_index": 3,
      "explanation": "Verbs can express states or relationships; they need not name a visible action."
    },
    {
      "type": "multiple_choice",
      "question": "What does “Is the entrance open?” do in the example?",
      "options": [
        "Directs someone to open it",
        "Asks a question about the entrance",
        "Lists two independent clauses",
        "Guarantees everyone can enter"
      ],
      "correct_index": 1,
      "explanation": "The wording asks about the entrance’s state. It does not by itself direct an action or guarantee access."
    },
    {
      "type": "multiple_choice",
      "question": "Why can “Check the sign!” remain a command?",
      "options": [
        "All punctuation is irrelevant",
        "Every short sentence is a question",
        "It directs an understood addressee, despite its emphatic mark",
        "It contains no action"
      ],
      "correct_index": 2,
      "explanation": "The direction establishes its command function; the exclamation mark adds emphasis."
    },
    {
      "type": "multiple_choice",
      "question": "Which is simple in the examples taught?",
      "options": [
        "Mara waited by the door",
        "Mara waited, but Ari left",
        "Because Mara waited, Ari checked",
        "After Ari checked, Mara entered"
      ],
      "correct_index": 0,
      "explanation": "Mara waited by the door has one independent clause. The other examples combine clauses."
    },
    {
      "type": "multiple_choice",
      "question": "Which example connects two independent clauses?",
      "options": [
        "Because the door was locked",
        "The waiting student",
        "Mara waited by the door",
        "Mara waited, but Ari checked the message"
      ],
      "correct_index": 3,
      "explanation": "Both sides can stand alone and but connects them, making the taught compound example."
    },
    {
      "type": "multiple_choice",
      "question": "What makes “Because the door was locked, Mara waited” complex?",
      "options": [
        "It has more letters than every other sentence",
        "It combines a dependent reason clause with a main clause",
        "It is an exclamation",
        "Every word is a noun"
      ],
      "correct_index": 1,
      "explanation": "The because clause is dependent and supplies a reason for the main clause. Complexity is a clause relationship, not mere length."
    }
  ],
  "parent_notes": "Parent: Teaches core noun and verb functions, sentence purposes and introductory clause structures in context. The lesson follows the repository’s Year 7 narrative unit. Exact outcome codes are empty because a current Stage 4 code mapping was not verified from the accessible official page; do not claim full outcome coverage. All practice texts are original fiction.\n\nParent: Look for explanations rather than labels copied from a list. A multiword verb group is distinguished from two independent clauses. Commands can have an understood subject.\n\nParent: Let the learner complete one analysis pass at a time. More complex wording is not a quality goal by itself. A purposeful narrative revision may change an event, but the learner should acknowledge that choice. The lesson supplies the instruction, models and practice. The ten-question quiz is multiple-choice and the unchanged 90% threshold requires 9/10. Written analysis and reflection are part of the independent task, not automatically scored by the quiz.\n\nParent: Task models: proper nouns Mara/Ari; common nouns door/message/entrance/model; verb groups waited, had checked, was, carried. Question: Is the entrance open? Command: Check the model. Compound: Ari had checked the message, and Mara waited by the door. Complex time example: After Ari had checked the message, Mara carried the model inside. Accept other correctly explained versions.",
  "evidence_instructions": "Keep noun/verb analyses, purpose examples, compound/complex examples with clause explanations, reflection and quiz result.",
  "offline_alternative": "Copy the practice passage onto paper. Mark nouns, underline complete verb groups and write the new examples with explanations. Later type a summary and complete the quiz.",
  "extension": "Write a simple sentence with a two-word verb group and a compound sentence. Explain why counting the words in a verb group does not identify the number of independent clauses.",
  "stage_hints": {
    "accept": [
      "Read the challenge and separate word jobs from sentence choices.",
      "Begin with nouns in context before analysing whole structures.",
      "Keep headings for nouns, verb groups, purpose and structure so your explanations do not mix them."
    ],
    "teach0": [
      "Look back at what a word names and how it functions here.",
      "Distinguish a particular name from a class or idea.",
      "Read the whole sentence before labelling a word that can have more than one job."
    ],
    "teach1": [
      "Look back at a complete verb group rather than one word.",
      "Find the action or state and check whether a helper belongs with it.",
      "Name the subject, then the whole group expressing the action or relationship."
    ],
    "teach2": [
      "Look back at communication and clause structure as separate questions.",
      "Ask whether the example informs, asks, directs or expresses a strong response.",
      "Use wording and context alongside punctuation; do not let one end mark decide everything."
    ],
    "teach3": [
      "Look back at which clause can stand independently.",
      "Find each subject and verb group, then check the joining relationship.",
      "Test an opening reason or time clause on its own before locating the main idea that completes it."
    ],
    "learn": [
      "Analyse the original passage before reading its revisions.",
      "Compare word functions and purpose first, then the clause relationships.",
      "Explain whether a revision keeps events the same or deliberately changes them."
    ],
    "guided": [
      "Start by identifying the named people and thing.",
      "Keep the helper with its main verb before joining sentences.",
      "Test each original statement independently, then explain the relationship your new connector creates."
    ],
    "write": [
      "Use the task headings and complete one analysis pass first.",
      "Begin “Nouns: ____ names ____. Verb group: ____.”",
      "A response opening can be “In the first sentence, the noun ____ identifies ____.” Finish that analysis before changing the sentence."
    ],
    "quiz": [
      "Return to the word-function, purpose or structure explanation matching the question.",
      "Separate what a word does from how clauses connect.",
      "For a structure choice, test clause independence; for a purpose choice, examine the wording and intended communication."
    ],
    "submit": [
      "Check that examples and their explanations are both present.",
      "Include your reflection and distinguish deliberate event changes from unchanged combinations.",
      "If you worked on paper, type the key analyses and example sentences, and keep the original notes."
    ]
  }
}'),
    updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
WHERE seed_key = 's4-eng-y7-w01-l3';

UPDATE lessons
SET title = 'Year 7: Read aloud and discuss with evidence',
    data = json_patch(data, '{
  "seed_key": "s4-eng-y7-w01-l4",
  "title": "Year 7: Read aloud and discuss with evidence",
  "stage": "S4",
  "learning_area": "English",
  "year_level": "Year 7",
  "week": 1,
  "lesson_number": 4,
  "duration_minutes": 60,
  "child_mission": "Prepare a purposeful reading and a considered response. Use the story’s meaning to guide delivery, then test your interpretation against another supported view.",
  "learning_intention": "We are learning to read a short narrative passage clearly and discuss interpretations through evidence, clarification and reflection.",
  "success_criteria": [
    "I can prepare a passage by checking meaning and word groups.",
    "I can choose a delivery change with a reason.",
    "I can support an interpretation with a precise detail.",
    "I can respond to another view accurately and respectfully.",
    "I can explain how rehearsal or another interpretation affected my response."
  ],
  "materials": [
    "All texts and examples are included in this lesson",
    "Optional: paper and a pen for notes"
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
  "interactive_activities": null,
  "printable_resource": null,
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "📖",
      "title": "Prepare meaning before delivery",
      "explain": "**Reading aloud starts with understanding.**\nRead the chosen passage quietly first. Identify who speaks, what happens and which words need attention. Do not select a dramatic voice before checking the meaning.\n\n**Separate narrator and dialogue.**\nQuotation marks mark a character’s spoken words. The surrounding narration can describe actions or qualify how we understand the line. Read those words too rather than treating the speech as a separate story.\n\n**Clarify unfamiliar words in this text.**\nA foyer is an entrance space inside a building. An exhibitor is someone showing work at an exhibition. An assumption is something accepted without checking it here. Use these meanings in the passage; do not guess a new event from an unfamiliar word.\n\n**Group words into meaningful phrases.**\nA phrase is a meaningful word group. Keep a group such as before deciding it’s closed together enough for its relationship to be heard. Punctuation and meaning can guide brief pauses.\n\nMark two or three practice cues if helpful. A slash can remind you of a pause, but it is not part of the original text to pronounce.",
      "example": "I DO:\n“We can check before deciding it’s closed.” Ari picked up his folder. He did not touch Mara’s model.\n\nI identify Ari’s spoken line and the following narrated actions. I keep before deciding it’s closed as a connected thought rather than stopping after each word.\nI consider the meaning: Ari proposes checking the assumption. The narrated action also preserves Mara’s responsibility for her model.\n\nYOU TRY:\nRead “There’s a table for models at the back,” the volunteer said. “Take your time.”\nIdentify the spoken words and narration before rehearsing.\n\nCHECK:\nThe volunteer’s two spoken lines are separated by the narration the volunteer said. Read the full passage so a listener can follow who is speaking.",
      "notice": "Meaningful grouping matters more than making every comma the same length of pause. Keep practice marks out of the spoken text.",
      "check": {
        "question": "What should you do before choosing a delivery style?",
        "options": [
          "Skip the narration",
          "Guess the ending from one word",
          "Copy a dramatic voice regardless of meaning",
          "Check the passage’s meaning, speaker and unfamiliar words"
        ],
        "correct_index": 3,
        "explanation": "Meaning and speaker information guide purposeful delivery. Skipping or guessing can distort the passage."
      }
    },
    {
      "icon": "📖",
      "title": "Choose delivery and rehearse a change",
      "explain": "**Delivery should serve a listener’s understanding.**\nPace is speed, volume is loudness and pitch is how high or low the voice sounds. Emphasis gives a selected word extra prominence. A pause can separate thoughts or give an important relationship time to register.\n\n**Make a supported choice.**\nAri’s proposal to check can use a steady pace so its reasoning is clear. Mara’s repeated handle-pulling may suggest frustration, but you should explain the chosen reading from context rather than treating every line as a shout.\n\n**Keep accuracy.**\nUse a comfortable voice, say the written words clearly and do not replace them to fit a performance. There is no required accent or acting style.\n\n**Rehearse twice with a purpose.**\nFirst check word accuracy and grouping. Then choose one delivery change: slow a rushed reason, give a key word prominence or adjust an unhelpful pause. Compare the effect in your second attempt.\n\nExplain your choice: “I changed ____ so the listener could ____.” An improvement should have a reason, not only sound different.",
      "example": "I DO:\nFirst try: I rush Ari’s words before deciding it’s closed, so the important order is unclear.\nChange: I give check a little emphasis and read the reason at a steady pace.\nSecond try: the listener can follow that checking comes before the conclusion.\n\nCOMMON MISTAKE:\nIncreasing volume on every word does not fix a rushed connection. I focus on the particular meaning I want heard.\n\nYOU TRY:\nRead “Take your time” twice. Choose a comfortable pace that matches the volunteer’s reassurance in context.\n\nCHECK:\nYou might use a calm, steady delivery. Explain how your choice fits the line rather than claiming everyone must perform it identically.",
      "notice": "Select one change you can explain. Different natural voices can communicate the same supported meaning.",
      "check": {
        "question": "What makes a rehearsal change purposeful?",
        "options": [
          "It is linked to how a listener follows the meaning",
          "It is louder on every word",
          "It adds events not written",
          "It guarantees one required accent"
        ],
        "correct_index": 0,
        "explanation": "A purposeful change has an explainable effect on clarity or interpretation. Loudness alone, invented content or an accent requirement do not establish that."
      }
    },
    {
      "icon": "📖",
      "title": "Discuss a claim with evidence",
      "explain": "**Discussion develops ideas, not only opinions.**\nA claim is an interpretation you offer about the story. Support it with a precise action or short quotation, then explain how the evidence relates to the claim.\n\n**Understand a different view first.**\nParaphrase means expressing someone’s idea accurately in your own words. Before agreeing or disagreeing, state what the other interpretation actually says. Do not make it more extreme to dismiss it.\n\n**Ask a clarification question.**\n“Which detail supports that view?” or “Do you mean her initial response or her final action?” can help locate the difference. A question is more useful when it addresses reasoning rather than insulting a person.\n\n**Respond with a link.**\nYou can build on a view, qualify it or offer a different interpretation. Use evidence for your response. Respect does not require agreement; it requires dealing fairly with the stated idea.\n\nIf working alone, use the supplied practice views as a discussion rehearsal. This prepares responses but is different evidence from listening to an actual partner.",
      "example": "PRACTICE VIEW A:\n“Mara’s comment about the sign sounds dismissive because she says it could mean anywhere before checking.”\nPRACTICE VIEW B:\n“Her concern is also reasonable because she misses the small arrow, and Ari later agrees the sign could be clearer.”\n\nI DO:\nAccurate paraphrase: View A focuses on the quick initial dismissal.\nClarification: “Are you describing only her first response, or her whole behaviour?”\nResponse: “I agree about the first response, but the final permission-seeking action suggests she later tries to improve the problem.”\n\nYOU TRY:\nRespond to View B using a specific detail. Try before reading on.\n\nCHECK:\nA useful response may agree, disagree or qualify, provided it represents View B accurately and explains relevant evidence. “That view is stupid” does not test its reasoning.",
      "notice": "Evaluate the interpretation, not the person. A disagreement should state a reason and refer to the story.",
      "check": {
        "question": "Which response best asks for useful clarification?",
        "options": [
          "You must be wrong because I disagree",
          "Which detail supports your interpretation of her response?",
          "Nobody can have another view",
          "Your idea proves something about your whole personality"
        ],
        "correct_index": 1,
        "explanation": "The question asks about the evidence for an interpretation. The other responses dismiss or personalise without examining reasoning."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Disagreement can improve an interpretation",
            "transcript": "Pip: Another reader interprets the character differently. Should I dismiss the idea immediately?\nJuno: Paraphrase it accurately first, then ask which detail supports the reasoning.\nPip: I can agree, qualify or disagree using evidence instead of criticising the person.\nJuno: Pause and try. Write a fair response to one different interpretation of the story.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "Another reader interprets the character differently. Should I dismiss the idea immediately?"
                  },
                  {
                    "who": "juno",
                    "text": "Paraphrase it accurately first, then ask which detail supports the reasoning."
                  },
                  {
                    "who": "pip",
                    "text": "I can agree, qualify or disagree using evidence instead of criticising the person."
                  },
                  {
                    "who": "juno",
                    "text": "Pause and try. Write a fair response to one different interpretation of the story.",
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
      "icon": "📖",
      "title": "Reflect, revise and keep evidence honest",
      "explain": "**Another view can sharpen your interpretation.**\nYou do not have to abandon a claim whenever someone disagrees. Consider the new evidence and decide whether to keep, qualify or change the idea. Explain the reason.\n\n**Keep the scope accurate.**\n“Mara is always dismissive” goes beyond the story. “Her first response sounds dismissive, but her later action is constructive” recognises contrasting evidence without pretending the incident proves her whole personality.\n\n**Use a short reflection chain.**\nInitial idea → evidence or feedback considered → revised or retained idea with a reason. This shows your thinking, not just a statement that you improved.\n\n**Separate evidence types.**\nA written delivery plan shows what you intended. An observed or recorded reading can show what you actually did. A solo response to practice views shows discussion preparation, not proof that you listened to a real person.\n\nComplete this lesson independently when needed. Use your usual communication support and describe it honestly so a reviewer knows which skills the evidence demonstrates.",
      "example": "I DO:\nInitial claim: “Mara rejects advice.”\nEvidence considered: she later says Ari was right about checking and asks to improve the sign.\nRevised claim: “Mara initially resists the suggestion, then recognises its value and responds constructively.”\nReason: the revised wording accounts for both early dialogue and later actions.\n\nFor delivery, I record the planned pace change and what I noticed in rehearsal. If no one heard it, I do not label the written plan as an observed performance.\n\nYOU TRY:\nQualify a claim that describes Mara’s entire personality using only one early comment.\n\nCHECK:\nNarrow it to the early response and consider the ending. A retained interpretation is fine when you explain why the evidence still supports it.",
      "notice": "Reflection can explain a retained view as well as a changed one. State the evidence and its effect on your reasoning.",
      "check": {
        "question": "Which reflection shows consideration of contrasting evidence?",
        "options": [
          "I was right, so no evidence mattered",
          "My plan proves an observed performance even if nobody heard it",
          "Another view means I must copy it without thinking",
          "I narrowed my claim after considering her later constructive action"
        ],
        "correct_index": 3,
        "explanation": "The reflection identifies evidence and explains a proportionate change. The other choices ignore reasoning or misdescribe evidence."
      },
      "visual": [
        {
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 224\"><rect width=\"420\" height=\"224\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Initial interpretation</text><text x=\"16\" y=\"80\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">New evidence considered</text><text x=\"16\" y=\"126\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Keep / qualify / change</text><text x=\"16\" y=\"172\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Explain the reason</text></svg>",
          "alt": "A reflection moves from an initial interpretation through considered evidence to keeping, qualifying or changing it with a reason.",
          "caption": "Do not confuse agreement with reflection."
        }
      ]
    }
  ],
  "worked_example": "I DO: Use the full original story for preparation.\nTHE SIDE ENTRANCE\n\nMara reached the community hall twenty minutes before the student exhibition opened. She had spent the week building a cardboard model and wanted it on a table before anyone arrived. Through the front glass she could see chairs, a folded display board and an empty foyer. The door would not move.\n\n“They said we could bring our work early,” she told Ari. She pulled the handle again. In the glass, her model’s crooked roof looked more noticeable than it had at home.\n\nAri set down his folder and checked the message on his phone. “It says side entrance for exhibitors.”\n\nMara looked along the wall. A small paper arrow pointed towards the corner, but she had walked straight past it. “That could mean anywhere,” she said.\n\n“We can check before deciding it’s closed.” Ari picked up his folder. He did not touch Mara’s model.\n\nAt the side door, a volunteer was holding the frame open while another student carried a painting through. Warm light fell across the concrete. Mara stopped adjusting the roof and stepped forward.\n\n“There’s a table for models at the back,” the volunteer said. “Take your time.”\n\nInside, Mara found a space and placed the model beside a bridge made from paddle-pop sticks. Nobody commented on her roof. Ari put his folder on the neighbouring table.\n\nMara took the paper arrow from the outside wall, showed it to the volunteer and asked whether they could add a second arrow near the front handle. With permission, she placed the new sign where the next student would see it before pulling.\n\nWhen she came back, Ari was straightening his display label. “You were right about checking,” she said. He looked up. “And you were right that the sign could be clearer.”\n\nMODEL DELIVERY NOTE\nFor Ari’s proposal to check before deciding, I will keep the reason connected and give check a little prominence. This helps a listener follow his measured response. I will compare word clarity in two rehearsals instead of making every line louder.\n\nMODEL DISCUSSION RESPONSE\nView A identifies a dismissive early comment. I agree that “That could mean anywhere” resists Ari’s suggestion. However, the ending complicates a claim that Mara simply rejects advice: she acknowledges his point and asks permission to improve the sign. I would qualify the claim to describe an initial response followed by a constructive change.\n\nWHY IT WORKS\nThe response accurately represents the other view, supplies evidence and explains a qualification. It does not need to declare one reader the winner.\n\nCOMMON MISTAKE AND FIX\n“View A says Mara is a terrible person” exaggerates the stated interpretation. Fix: paraphrase its actual focus on her early response before evaluating it.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 224\"><rect width=\"420\" height=\"224\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Paraphrase the view fairly</text><text x=\"16\" y=\"80\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Ask about evidence or scope</text><text x=\"16\" y=\"126\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Respond with a precise detail</text><text x=\"16\" y=\"172\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Reflect on the reasoning</text></svg>",
      "alt": "Discussion preparation paraphrases a view, asks about evidence or scope, responds with detail and reflects on the reasoning.",
      "caption": "Fair representation comes before disagreement."
    }
  ],
  "guided_practice": "WE DO: Prepare one excerpt and one response.\n1. Choose Ari’s proposal and following narration. Identify the speaker, action and central reasoning before choosing delivery.\n2. Mark one brief thought pause and one optional emphasis. Read twice; explain one change.\n3. Paraphrase View B from the teaching example without making it stronger than it is. Suggestion after your try: the view argues that Mara’s concern about unclear signage has evidence too.\n4. Ask a clarification question about evidence or scope. For example, ask whether the interpretation explains only the initial confusion or also the ending.\n5. Draft a response with a short detail and explanation. You can build on the view or qualify it.\n6. Reflect: did the alternative make you notice a detail you had ignored? Explain rather than merely saying you agree.",
  "independent_task": "YOU DO: Reading and discussion preparation (about 25–30 minutes).\nUse The Side Entrance, included above. This task can be completed independently.\n1. Choose an excerpt of about 60–90 words. Identify speakers and explain its meaning in two short notes.\n2. Plan a pace, pause or emphasis choice with a reason. Rehearse twice and note one improvement. A listener or recording is optional; use your usual communication method if speaking is inaccessible.\n3. State your interpretation of Mara’s response in one or two sentences, with a supporting detail.\n4. Respond in about 120–180 words to View A or View B from the lesson. Paraphrase fairly, ask one useful clarification question, and build, qualify or disagree with evidence.\n5. Reflect on whether the other view changed or sharpened your claim.\nSuccess checklist: accurate reading preparation; purposeful delivery choice; fair representation; precise evidence; explained response; honest evidence description.\nIn the big box include the excerpt reference, preparation notes, rehearsal change and discussion response. Say whether practice was solo or observed. Paper work can be summarised in text; uploads are optional.",
  "response_prompt": "Which rehearsal observation or alternative interpretation most affected your final response, and why?",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "What should guide reading-aloud preparation?",
      "options": [
        "A dramatic voice chosen before reading",
        "Ignoring the speaker",
        "The passage’s meaning, speaker and relevant words",
        "Inventing a different event"
      ],
      "correct_index": 2,
      "explanation": "Understanding the meaning and speaker helps delivery communicate the actual text."
    },
    {
      "type": "multiple_choice",
      "question": "What does paraphrase mean here?",
      "options": [
        "Express another idea accurately in your own words",
        "Make it more extreme before rejecting it",
        "Copy an unrelated title",
        "Replace the story’s ending"
      ],
      "correct_index": 0,
      "explanation": "A paraphrase preserves the idea’s meaning while changing wording. It should not distort the view."
    },
    {
      "type": "multiple_choice",
      "question": "Which is a purposeful pace decision?",
      "options": [
        "Read every event faster regardless of meaning",
        "Treat every word as a separate paragraph",
        "Change the dialogue’s words to suit your voice",
        "Slow a rushed reason so a listener can follow it"
      ],
      "correct_index": 3,
      "explanation": "The change has a specific clarity purpose and preserves the text."
    },
    {
      "type": "multiple_choice",
      "question": "Why keep “before deciding it’s closed” as a connected thought?",
      "options": [
        "It is always the longest phrase",
        "It helps the listener follow the relationship between checking and deciding",
        "It removes all punctuation rules",
        "It proves the hall never opens"
      ],
      "correct_index": 1,
      "explanation": "The connected phrasing makes the order of Ari’s reasoning easier to follow."
    },
    {
      "type": "multiple_choice",
      "question": "What should a fair response to another view do first?",
      "options": [
        "Insult its author",
        "Claim only one view can exist",
        "Represent what the view actually says",
        "Invent evidence for it"
      ],
      "correct_index": 2,
      "explanation": "Accurate representation is necessary before agreement, qualification or disagreement."
    },
    {
      "type": "multiple_choice",
      "question": "Which question usefully clarifies an interpretation?",
      "options": [
        "Do you mean the initial response or the whole behaviour?",
        "Why are you always wrong?",
        "Can we ignore all details?",
        "Does disagreement prove a bad personality?"
      ],
      "correct_index": 0,
      "explanation": "The question checks the scope of the claim without attacking the person."
    },
    {
      "type": "multiple_choice",
      "question": "How can a student disagree respectfully?",
      "options": [
        "Replace reasons with volume",
        "Dismiss every alternative immediately",
        "Refuse to read the view",
        "Explain a different interpretation using relevant evidence"
      ],
      "correct_index": 3,
      "explanation": "A reasoned disagreement examines the interpretation through evidence rather than personal attack."
    },
    {
      "type": "multiple_choice",
      "question": "Which ending detail complicates “Mara rejects all advice”?",
      "options": [
        "The story contains concrete",
        "She acknowledges Ari’s point and asks to improve the sign",
        "The model is made of cardboard",
        "The hall has a foyer"
      ],
      "correct_index": 1,
      "explanation": "Her acknowledgement and constructive request provide contrasting evidence about her later response."
    },
    {
      "type": "multiple_choice",
      "question": "What does a written delivery plan demonstrate by itself?",
      "options": [
        "An observed oral performance",
        "Proof of listening to a real partner",
        "Intended preparation and choices",
        "Every person’s reaction"
      ],
      "correct_index": 2,
      "explanation": "A plan records intentions. Actual delivery or interaction needs separate observed or recorded evidence."
    },
    {
      "type": "multiple_choice",
      "question": "What can a useful reflection do?",
      "options": [
        "Explain why a view was kept, qualified or changed after considering evidence",
        "Only say the learner was right",
        "Copy another view without a reason",
        "Guarantee the first reading was perfect"
      ],
      "correct_index": 0,
      "explanation": "Reflection explains the effect of considered evidence, whether the final view changes or is retained."
    }
  ],
  "parent_notes": "Parent: Teaches meaningful reading preparation, purposeful rehearsal, evidence-based response, fair paraphrase, clarification and reflective qualification. The lesson follows the repository’s Year 7 narrative unit. Exact outcome codes are empty because a current Stage 4 code mapping was not verified from the accessible official page; do not claim full outcome coverage. All practice texts are original fiction.\n\nParent: Assess oral delivery or actual listening only if observed or recorded. A solo written rehearsal demonstrates preparation and reasoning, not a live interaction.\n\nParent: No partner, recording, upload, accent or acting style is required. Accept the learner’s usual communication support and note what was actually demonstrated. The lesson supplies the instruction, models and practice. The ten-question quiz is multiple-choice and the unchanged 90% threshold requires 9/10. Written analysis and reflection are part of the independent task, not automatically scored by the quiz.\n\nParent: A strong response to View A can accept the early dismissal while using permission-seeking and the final acknowledgement to qualify it. A response to View B may recognise the signage concern while explaining that checking remains a useful action. Reflection model: the ending made me narrow an all-or-nothing personality claim to a change within this incident.",
  "evidence_instructions": "Keep excerpt notes, delivery choice and rehearsal observation, discussion response, reflection and quiz result. Record solo versus observed practice and any communication support.",
  "offline_alternative": "Copy or print the story and two practice views. Prepare an excerpt, rehearse and draft the response on paper. Later type a summary and complete the quiz.",
  "extension": "Write a response that fairly combines the strongest supported part of View A with View B. Explain what each contributes without forcing complete agreement.",
  "stage_hints": {
    "accept": [
      "Read the challenge and notice preparation, delivery and reasoning as separate parts.",
      "Begin by understanding one excerpt before planning its performance.",
      "Keep notes for a delivery choice and a supported interpretation as you progress."
    ],
    "teach0": [
      "Look back at the speaker and narration in the extract.",
      "Clarify a word and identify the connected thought before marking a pause.",
      "Say what the passage means, then group words so that relationship remains clear."
    ],
    "teach1": [
      "Look back at a rehearsal change with an explicit purpose.",
      "Choose one rushed or unclear phrase rather than changing every tool at once.",
      "Try the phrase twice and compare how a listener could follow the important reasoning."
    ],
    "teach2": [
      "Look back at accurate representation before evaluation.",
      "State the other view’s scope and ask what evidence supports it.",
      "Use “I understand this view as ____. The detail ____ leads me to ____.” Supply your own reason."
    ],
    "teach3": [
      "Look back at the initial-idea and considered-evidence chain.",
      "Find a detail that supports or complicates the first claim.",
      "Explain whether you keep, narrow or change the view and why; describe the evidence you actually produced."
    ],
    "learn": [
      "Read the whole story and model response before judging the alternative.",
      "Locate the early comment and later actions the model compares.",
      "Explain how the later evidence affects the scope of the initial interpretation."
    ],
    "guided": [
      "Begin with the selected excerpt’s meaning and speaker.",
      "Choose one delivery change, then paraphrase the practice view separately.",
      "Ask a scope or evidence question before adding your own supported response."
    ],
    "write": [
      "Prepare the excerpt first, then state your own claim.",
      "Begin the discussion response “This view focuses on ____.” Represent it fairly.",
      "A partial response opening is “I read this interpretation as ____. One detail I would consider is ____.” Finish with your own evidence and reasoning."
    ],
    "quiz": [
      "Return to preparation, delivery, fair response or evidence description as needed.",
      "Distinguish intended choices from what was actually observed.",
      "Evaluate whether each option preserves the text and examines reasoning rather than attacking a person."
    ],
    "submit": [
      "Check that preparation notes and response reasoning are present.",
      "Include the reflection and identify whether practice was solo or observed.",
      "Submit a clear text record of your choices and response; keep any paper work for review."
    ]
  }
}'),
    updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
WHERE seed_key = 's4-eng-y7-w01-l4';
