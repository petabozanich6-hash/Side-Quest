-- Standard v2: larger Stage 2/4 priority batch; 20 complete lessons.
-- Original internal content; Workers Paid quality policy.

-- s4-eng-y8-w01-l1
UPDATE lessons SET title='Year 8: Evaluate a narrator’s reliability', data=json_patch(data, '{
  "seed_key": "s4-eng-y8-w01-l1",
  "title": "Year 8: Evaluate a narrator’s reliability",
  "stage": "S4",
  "learning_area": "English",
  "year_level": "Year 8",
  "week": 1,
  "lesson_number": 1,
  "duration_minutes": 60,
  "child_mission": "Explore evaluate a narrator’s reliability through an original courtyard story. Make deliberate choices and explain them with precise evidence.",
  "learning_intention": "We are learning to evaluate a narrator’s reliability.",
  "success_criteria": [
    "I can explain the key narrative or language idea.",
    "I can use a specific example to support a decision.",
    "I can apply the taught method to a complete response.",
    "I can revise or qualify a choice and explain its effect."
  ],
  "materials": [
    "Everything you need to read is included in this lesson",
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
  "spelling_focus": null,
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
      "icon": "🔎",
      "title": "Separate narrator, character and author",
      "explain": "**The narrator is the voice telling the story.**\nThe author creates the text; the narrator presents its events. In a first-person narrative, I may be a character inside those events. Do not assume every statement by that narrator is the author’s own view.\n\n**Perspective limits information.**\nA character narrator reports what they notice, remember or choose to tell. They cannot automatically know another character’s private thoughts. A statement about someone else’s motive may be an inference rather than observed evidence.\n\n**Read the complete story below first.**\nTrack what Kai reports doing and what Kai claims to know. The first-person voice gives direct access to Kai’s account, but it does not guarantee that the account is complete or accurate.\n\nStart with the distinction between voice and event. Later steps will evaluate particular claims rather than treating an entire narrator as simply truthful or false.",
      "example": "READ THE ORIGINAL STORY\nTHE LAST SIGN\nI was the first one ready for the courtyard exhibition. I am sure of that. My phone said 9:12 when I put it down, and the opening was not until ten. The others were still moving tables.\nThe blue sign beside our display had vanished. Sam was standing near the garden gate with a roll of tape. That made the answer obvious: Sam must have taken it. I had watched our table all morning, so there was no other explanation.\n“Where did you put the sign?” I asked.\nSam glanced towards the gate. “I came through there at five past nine. I taped up the directions first.”\n“That is not what I asked.”\nSam set the tape on a chair. “I haven’t moved your sign. Have you looked behind the board?”\nI knew it could not be behind the board. I had put it neatly on the table. Still, I bent down because Sam was waiting. A blue edge showed in the narrow gap. I pulled out the sign. The fan on the windowsill was pointing straight at the display.\nSam held the board while I placed the sign back. “We can tape the corners,” Sam said.\nI said that was what I had planned to do anyway. Then I noticed the time again. Between writing messages and checking a game score, I had spent several minutes looking at my phone with my back to the table. Perhaps all morning was not quite the right description.\nAt ten, the exhibition opened. The sign stayed in place. I told the first visitor we had solved a small problem together, which sounded better than explaining how certain I had been.\n\nI DO:\nKai is the first-person character narrator. The claim that Sam took the sign is Kai’s interpretation, not an independently confirmed event.\n\nYOU TRY:\nFind a sentence in which Kai claims knowledge of someone else’s action.\n\nCHECK:\n“Sam must have taken it” attributes an action without direct observation. The text later gives reasons to question that certainty.",
      "notice": "First person describes a viewpoint; it does not automatically mean unreliable.",
      "check": {
        "question": "Who makes the claim that Sam took the sign?",
        "options": [
          "An independent report outside the story",
          "Sam in a confirmed confession",
          "The first-person narrator Kai",
          "Every reader as a proven fact"
        ],
        "correct_index": 2,
        "explanation": "Kai presents that interpretation. The narrative does not provide an independent confirmation of the accusation."
      },
      "visual": [
        {
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 178\"><rect width=\"420\" height=\"178\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Claim: continuous observation</text><text x=\"16\" y=\"80\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Later detail: back to table</text><text x=\"16\" y=\"126\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Inference: certainty is limited</text></svg>",
          "alt": "A reliability comparison places continuous-observation certainty beside the later admission of looking away, supporting a limited inference.",
          "caption": "Evaluate a specific claim with paired evidence."
        }
      ]
    },
    {
      "icon": "🔎",
      "title": "Compare a claim with contrary evidence",
      "explain": "**Reliability concerns how far an account can be trusted.**\nAn unreliable narrator may misremember, misunderstand, conceal information or present a biased interpretation. This lesson evaluates reliability within a fictional text; it does not diagnose a person.\n\n**Find an actual gap or contradiction.**\nKai claims to have watched the table all morning. Later Kai reports several minutes looking at a phone with their back to the table. Those two statements do not fully fit. The later admission weakens the claim of continuous observation.\n\n**Check a specific claim, not every sentence at once.**\nThe sign really is missing from its expected place. That reported event can be accurate even while the accusation about Sam is unsupported. Reliability can vary across an account.\n\nUse a two-column note: claim and evidence that complicates it. Explain the connection before applying the label unreliable.",
      "example": "I DO:\nClaim: “I had watched our table all morning.”\nContrary evidence: several minutes on the phone with a back turned to the table.\nReason: Kai did not continuously observe what happened, so the certainty about Sam’s action is not justified.\n\nYOU TRY:\nCompare the claim of being first ready with Sam’s stated arrival time. What can you cautiously question?\n\nCHECK:\nSam says five past nine, while Kai looks at the phone at 9:12. These details complicate Kai’s confident first-ready claim, but arrival and readiness are not identical. Do not claim the times alone prove every part of the opening false.",
      "notice": "A useful judgement is specific and proportionate. One questionable claim does not make every reported event false.",
      "check": {
        "question": "Which detail directly weakens Kai’s claim of watching continuously?",
        "options": [
          "The sign is blue",
          "Kai later admits looking at a phone with a back turned",
          "The exhibition opens at ten",
          "The courtyard has a gate"
        ],
        "correct_index": 1,
        "explanation": "The admission contradicts uninterrupted observation. The other details do not establish that gap."
      }
    },
    {
      "icon": "🔎",
      "title": "Infer bias without inventing certainty",
      "explain": "**Bias is a leaning that shapes interpretation.**\nKai interprets Sam’s nearby tape as proof of removal and resists a question that offers another explanation. The account may protect Kai’s image as prepared and competent.\n\n**Use language as evidence.**\nWords such as obvious, no other explanation and I knew signal strong certainty. Compare that certainty with the limited observation. The mismatch is more useful than simply saying Kai sounds unpleasant.\n\n**Qualify an inference.**\nSay the wording suggests defensiveness or a wish to appear prepared. That is an interpretation supported by the text, not access to a mind outside the narrated words. Alternative supported readings may be possible.\n\nNotice the ending’s effect. Kai gives visitors a smoother account of solving the problem together. This may show selective presentation, while the admission about the phone also shows some self-correction.",
      "example": "I DO:\nThe phrase “there was no other explanation” makes Kai’s accusation sound certain. The phone admission shows a gap in observation, suggesting overconfidence rather than proof against Sam.\n\nYOU TRY:\nExplain what “which sounded better” suggests about the account Kai gives visitors.\n\nCHECK:\nIt suggests Kai selects a version that presents the incident more favourably. The inference concerns the wording, not a claim that every part of the final statement is false.",
      "notice": "Support an interpretation with words and explain its scope. Avoid turning one incident into a claim about an entire personality.",
      "check": {
        "question": "Which inference is proportionate to the ending?",
        "options": [
          "Kai is proven dishonest in every situation",
          "Sam definitely moved the sign",
          "All narrators are liars",
          "Kai may prefer an account that presents the incident favourably"
        ],
        "correct_index": 3,
        "explanation": "Which sounded better supports a limited inference about selective presentation in this incident."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Evaluate a narrator’s reliability",
            "transcript": "Pip: Kai sounds certain about watching the table. Is certainty itself enough evidence?\nJuno: Compare the claim with the later phone admission. The gap limits what Kai could observe; it does not prove every reported event false.\nPip: I can judge the accusation specifically and acknowledge the later self-correction.\nJuno: Pause and link one claim with a detail that complicates it. Explain the scope of your judgement.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "Kai sounds certain about watching the table. Is certainty itself enough evidence?"
                  },
                  {
                    "who": "juno",
                    "text": "Compare the claim with the later phone admission. The gap limits what Kai could observe; it does not prove every reported event false."
                  },
                  {
                    "who": "pip",
                    "text": "I can judge the accusation specifically and acknowledge the later self-correction."
                  },
                  {
                    "who": "juno",
                    "text": "Pause and link one claim with a detail that complicates it. Explain the scope of your judgement.",
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
      "icon": "🔎",
      "title": "Write a claim, evidence and explanation",
      "explain": "**An analysis explains how the account shapes meaning.**\nState a focused claim about one aspect of reliability. Support it with a short quotation or accurate paraphrase, then explain what that detail changes for a reader.\n\n**Use paired evidence when judging a contradiction.**\nA certainty claim alone might not establish unreliability. Pair it with the later admission that limits the narrator’s knowledge. The contrast gives your reasoning a foundation.\n\n**Acknowledge limits and self-correction.**\nKai’s uncertainty near the end complicates a simple label. You can argue that the accusation is unreliable while acknowledging the account reveals the narrator’s own mistake.\n\nRead the paragraph back. It should distinguish event, interpretation and qualification, rather than retelling the plot without explaining reliability.",
      "example": "I DO:\n“Kai’s accusation is unreliable because the confidence exceeds the observation. Kai claims to have watched all morning, but later admits facing away while using a phone. This gap means the nearby tape does not prove Sam moved the sign. The later self-correction also prevents a judgement that every part of the account is knowingly false.”\n\nYOU TRY:\nGive a focused claim about the opening, paired with a detail that complicates it.\n\nCHECK:\nUse the time details cautiously and distinguish arriving from being ready. The strongest claim describes overconfidence rather than claiming more than the evidence proves.",
      "notice": "Evidence needs an explained relationship. Quoting two lines without connecting them is not yet analysis.",
      "check": {
        "question": "What strengthens a reliability analysis?",
        "options": [
          "A specific claim, paired evidence and an explained limit",
          "A judgement based only on liking the character",
          "A retelling with no link to reliability",
          "An invented confession"
        ],
        "correct_index": 0,
        "explanation": "A focused claim supported by connected evidence makes the judgement checkable and proportionate."
      }
    }
  ],
  "worked_example": "I DO: Read the complete source and analyse a specific claim.\nTHE LAST SIGN\nI was the first one ready for the courtyard exhibition. I am sure of that. My phone said 9:12 when I put it down, and the opening was not until ten. The others were still moving tables.\nThe blue sign beside our display had vanished. Sam was standing near the garden gate with a roll of tape. That made the answer obvious: Sam must have taken it. I had watched our table all morning, so there was no other explanation.\n“Where did you put the sign?” I asked.\nSam glanced towards the gate. “I came through there at five past nine. I taped up the directions first.”\n“That is not what I asked.”\nSam set the tape on a chair. “I haven’t moved your sign. Have you looked behind the board?”\nI knew it could not be behind the board. I had put it neatly on the table. Still, I bent down because Sam was waiting. A blue edge showed in the narrow gap. I pulled out the sign. The fan on the windowsill was pointing straight at the display.\nSam held the board while I placed the sign back. “We can tape the corners,” Sam said.\nI said that was what I had planned to do anyway. Then I noticed the time again. Between writing messages and checking a game score, I had spent several minutes looking at my phone with my back to the table. Perhaps all morning was not quite the right description.\nAt ten, the exhibition opened. The sign stayed in place. I told the first visitor we had solved a small problem together, which sounded better than explaining how certain I had been.\n\nMODEL ANALYSIS\nKai’s accusation is unreliable because its certainty exceeds the narrator’s observation. Kai claims to have watched the table all morning, yet later admits spending several minutes on a phone with a back turned. The contrast creates a gap in what Kai could know about the sign. Sam’s tape and nearby position therefore do not prove removal. The sign is found behind the board, and the fan offers a plausible alternative cause without either character reporting the fall. The account also reveals Kai’s self-correction, so it would be too broad to label every event a deliberate lie. The ending suggests selective presentation when Kai says the cooperative version sounded better.\n\nWHY IT WORKS\nThe claim is specific, the evidence is paired and each inference has a stated limit.\n\nCOMMON MISTAKE AND FIX\n“Kai lies about everything” exceeds the text. Revise to a judgement about the unsupported accusation and explain the contradictory observation claim.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 178\"><rect width=\"420\" height=\"178\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Claim: continuous observation</text><text x=\"16\" y=\"80\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Later detail: back to table</text><text x=\"16\" y=\"126\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Inference: certainty is limited</text></svg>",
      "alt": "A reliability comparison places continuous-observation certainty beside the later admission of looking away, supporting a limited inference.",
      "caption": "Evaluate a specific claim with paired evidence."
    }
  ],
  "guided_practice": "WE DO:\n1. Record the continuous-observation claim and the phone admission in separate columns.\n2. Explain the mismatch before using the reliability label. Feedback: looking away limits what Kai can know.\n3. Identify the tape detail. Ask whether it proves removal; compare after trying: presence of tape is not direct observation of the act.\n4. Draft a claim about the accusation, with both evidence and a qualification.\n5. Check the ending for self-correction and selective presentation. Include a precise detail rather than a whole-person judgement.\n6. Reread your paragraph: is it analysis of a claim, or only a plot summary? Revise one sentence with a reason.",
  "independent_task": "YOU DO: Evaluate a narrator’s reliability task (about 25–30 minutes).\n1. Read the complete source or models included in this lesson.\n2. Write an evidence table with two claims and details that complicate them. Then write a 150–200-word analysis of the accusation’s reliability, acknowledging one limit or self-correction.\n3. Show the evidence, planning or clause working behind two decisions.\n4. Reread or rehearse and improve one specific part. Explain the before-and-after change and its purpose.\n5. Answer the reflection. Work on paper or in the big box; type a clear record if you used paper. Uploads are optional.\nSuccess checklist: requested complete response; accurate event or clause relationships; supported choices; appropriate knowledge limits; explained revision; honest evidence record.",
  "response_prompt": "Which evidence or craft decision most affected your evaluate a narrator’s reliability response, and why?",
  "quiz": [
    {
      "question": "Who makes the claim that Sam took the sign?",
      "options": [
        "An independent report outside the story",
        "Sam in a confirmed confession",
        "The first-person narrator Kai",
        "Every reader as a proven fact"
      ],
      "correct_index": 2,
      "explanation": "Kai presents that interpretation. The narrative does not provide an independent confirmation of the accusation.",
      "type": "multiple_choice"
    },
    {
      "question": "Which detail directly weakens Kai’s claim of watching continuously?",
      "options": [
        "The sign is blue",
        "Kai later admits looking at a phone with a back turned",
        "The exhibition opens at ten",
        "The courtyard has a gate"
      ],
      "correct_index": 1,
      "explanation": "The admission contradicts uninterrupted observation. The other details do not establish that gap.",
      "type": "multiple_choice"
    },
    {
      "question": "Which inference is proportionate to the ending?",
      "options": [
        "Kai is proven dishonest in every situation",
        "Sam definitely moved the sign",
        "All narrators are liars",
        "Kai may prefer an account that presents the incident favourably"
      ],
      "correct_index": 3,
      "explanation": "Which sounded better supports a limited inference about selective presentation in this incident.",
      "type": "multiple_choice"
    },
    {
      "question": "What strengthens a reliability analysis?",
      "options": [
        "A specific claim, paired evidence and an explained limit",
        "A judgement based only on liking the character",
        "A retelling with no link to reliability",
        "An invented confession"
      ],
      "correct_index": 0,
      "explanation": "A focused claim supported by connected evidence makes the judgement checkable and proportionate.",
      "type": "multiple_choice"
    },
    {
      "question": "Does first-person narration automatically establish unreliability?",
      "options": [
        "Yes, every I is a lie",
        "No; evaluate particular claims against evidence",
        "Yes, because authors never use I",
        "No narrative can be evaluated"
      ],
      "correct_index": 1,
      "explanation": "First person is a viewpoint. Reliability requires evidence about the account.",
      "type": "multiple_choice"
    },
    {
      "question": "Which certainty phrase should be tested against evidence?",
      "options": [
        "The sign is blue",
        "The opening is at ten",
        "There was no other explanation",
        "The garden has a gate"
      ],
      "correct_index": 2,
      "explanation": "The exclusive certainty claim needs to be checked against the narrator’s actual observations.",
      "type": "multiple_choice"
    },
    {
      "question": "Why qualify the fan explanation?",
      "options": [
        "Neither narrator reports watching the sign fall",
        "The fan can never move paper",
        "The sign is imaginary",
        "Every explanation must be ignored"
      ],
      "correct_index": 0,
      "explanation": "The fan’s position supports a possibility but does not directly document the fall.",
      "type": "multiple_choice"
    },
    {
      "question": "What does the phone admission support?",
      "options": [
        "A proof that every detail is false",
        "A proof that Sam took the sign",
        "A rule about all narrators",
        "A limit on Kai’s continuous observation claim"
      ],
      "correct_index": 3,
      "explanation": "The admission supplies a specific gap in observation.",
      "type": "multiple_choice"
    },
    {
      "question": "Which response avoids a whole-person judgement?",
      "options": [
        "Kai is dishonest in every situation",
        "The accusation exceeds the evidence available in this incident",
        "Sam never makes mistakes",
        "All stories are false"
      ],
      "correct_index": 1,
      "explanation": "The claim is limited to what this text supports.",
      "type": "multiple_choice"
    },
    {
      "question": "What can self-correction do to an analysis?",
      "options": [
        "Make evidence unnecessary",
        "Prove all earlier claims true",
        "Complicate an absolute judgement of deliberate deception",
        "Erase every event"
      ],
      "correct_index": 2,
      "explanation": "The narrator’s admission supports a more qualified reliability judgement.",
      "type": "multiple_choice"
    }
  ],
  "parent_notes": "Parent: Teaches evaluate a narrator’s reliability through original narrative material and explicit language or craft modelling. Original content follows the repository’s topic sequence. Exact outcome codes are empty pending verified mapping; this is not a claim of complete syllabus coverage.\n\nParent: Look for supported and qualified interpretation, controlled information access, complete clause relationships or accurate storytelling as appropriate. Do not treat fictional reliability analysis as a diagnosis of real people. The lesson itself supplies the teaching and feedback. Your role is access support and reviewing the evidence.\n\nParent: A strong response pairs continuous-observation certainty with the phone admission, questions the unsupported accusation and recognises partial self-correction. The timing detail complicates readiness but does not alone prove who was first ready.\n\nParent: Ten scored choices use the unchanged 90% threshold, requiring 9/10. The independent task and reflection supply written reasoning for manual review.",
  "evidence_instructions": "Keep the evaluate a narrator’s reliability task, supporting notes or working, before-and-after revision, reflection and quiz result.",
  "offline_alternative": "Copy or print the supplied source and models, complete the evaluate a narrator’s reliability task on paper and rehearse where needed. Later type a clear evidence summary.",
  "extension": "Write an alternative supported interpretation of the ending that recognises both selective presentation and self-correction.",
  "stage_hints": {
    "accept": [
      "Read the mission about evaluate a narrator’s reliability.",
      "You will practise evaluate a narrator’s reliability through models before making your own response.",
      "Begin with the first explanation of evaluate a narrator’s reliability; the examples remain available while you work."
    ],
    "teach0": [
      "Look for the voice using I in the story.",
      "Separate an observed action from a claim about another person’s motive or behaviour.",
      "Identify who makes the claim before treating it as a verified event."
    ],
    "teach1": [
      "Read the claim and later admission side by side.",
      "Ask what the later detail prevents Kai from knowing with certainty.",
      "Explain that precise limit instead of declaring every event false."
    ],
    "teach2": [
      "Look for wording that presents Kai’s certainty or self-image.",
      "Compare the wording with what the narrator actually observed.",
      "Use suggests or may and explain the specific textual link."
    ],
    "teach3": [
      "Look back at the paragraph’s claim and paired evidence.",
      "Explain what the contradiction changes about the narrator’s knowledge.",
      "Include a qualification when the text also shows self-correction."
    ],
    "learn": [
      "Read the complete model and its explanation before copying a shape.",
      "Match one decision to the source detail or clause relationship that supports it.",
      "Explain how the model handles evaluate a narrator’s reliability and where it limits its claim."
    ],
    "guided": [
      "Start with the first supplied source detail or clause unit.",
      "Complete one evaluate a narrator’s reliability attempt before reading its feedback.",
      "Use the model’s checking question on your own attempt, then explain the reason for a revision."
    ],
    "write": [
      "Begin with one specific claim Kai makes, not a whole-person judgement.",
      "Start “Kai’s claim about ____ is limited because ____.”",
      "A partial opening is “The narrator presents ____ confidently. However, the later detail ____ complicates that certainty.” Add your own evidence and qualification."
    ],
    "quiz": [
      "Return to the specific evaluate a narrator’s reliability teaching step named by the question.",
      "For a reliability question, compare a specific claim with what the narrator actually observed.",
      "Use source evidence or the demonstrated clause test before choosing; do not select by how confident an option sounds."
    ],
    "submit": [
      "Check that your evaluate a narrator’s reliability task and working are present.",
      "Include the evaluate a narrator’s reliability reflection and any written reasoning you produced.",
      "Send your evaluate a narrator’s reliability evidence for review; type a clear record if you used paper."
    ]
  }
}'), updated_at=datetime('now') WHERE seed_key='s4-eng-y8-w01-l1';

-- s4-eng-y8-w01-l2
UPDATE lessons SET title='Year 8: Rewrite a scene from another perspective', data=json_patch(data, '{
  "seed_key": "s4-eng-y8-w01-l2",
  "title": "Year 8: Rewrite a scene from another perspective",
  "stage": "S4",
  "learning_area": "English",
  "year_level": "Year 8",
  "week": 1,
  "lesson_number": 2,
  "duration_minutes": 60,
  "child_mission": "Explore rewrite a scene from another perspective through an original courtyard story. Make deliberate choices and explain them with precise evidence.",
  "learning_intention": "We are learning to rewrite a scene from another perspective.",
  "success_criteria": [
    "I can explain the key narrative or language idea.",
    "I can use a specific example to support a decision.",
    "I can apply the taught method to a complete response.",
    "I can revise or qualify a choice and explain its effect."
  ],
  "materials": [
    "Everything you need to read is included in this lesson",
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
      "key": "events",
      "label": "Shared events in order",
      "hint": "What must remain recognisable in this incident?"
    },
    {
      "key": "lens",
      "label": "Lens and available information",
      "hint": "Choose first-person Sam or third-person limited Sam. What can Sam see or hear?"
    },
    {
      "key": "voice",
      "label": "Two voice choices and their purpose",
      "hint": "Choose details, wording or a plausible thought to create your emphasis."
    }
  ],
  "planner_title": "Keep the event; change the lens",
  "planner_intro": "Use short notes to separate shared events, available information and the voice choices you are creating.",
  "spelling": null,
  "spelling_focus": null,
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
      "icon": "🔎",
      "title": "Separate shared events from private interpretations",
      "explain": "**Perspective is the position from which a story is perceived.**\nA different narrator can notice different details and attach different meanings to the same events. Changing perspective does not require changing every shared event.\n\n**Make an event record first.**\nRead The Last Sign below. Record what is directly reported: Sam has tape, Kai asks about the missing sign, the sign is behind the board, and they secure it. Separately label Kai’s unsupported accusation as an interpretation.\n\n**Distinguish fact constraints from creative choices.**\nIn a perspective rewrite, you may invent plausible thoughts for Sam because you are writing original fiction. Those invented thoughts are not evidence that the source proved Sam felt that way.\n\nKeep the agreed sequence stable when the task asks for the same incident. The creative change is the account’s access and emphasis, not an unexplained replacement of the central event.",
      "example": "READ THE ORIGINAL SCENE\nTHE LAST SIGN\nI was the first one ready for the courtyard exhibition. I am sure of that. My phone said 9:12 when I put it down, and the opening was not until ten. The others were still moving tables.\nThe blue sign beside our display had vanished. Sam was standing near the garden gate with a roll of tape. That made the answer obvious: Sam must have taken it. I had watched our table all morning, so there was no other explanation.\n“Where did you put the sign?” I asked.\nSam glanced towards the gate. “I came through there at five past nine. I taped up the directions first.”\n“That is not what I asked.”\nSam set the tape on a chair. “I haven’t moved your sign. Have you looked behind the board?”\nI knew it could not be behind the board. I had put it neatly on the table. Still, I bent down because Sam was waiting. A blue edge showed in the narrow gap. I pulled out the sign. The fan on the windowsill was pointing straight at the display.\nSam held the board while I placed the sign back. “We can tape the corners,” Sam said.\nI said that was what I had planned to do anyway. Then I noticed the time again. Between writing messages and checking a game score, I had spent several minutes looking at my phone with my back to the table. Perhaps all morning was not quite the right description.\nAt ten, the exhibition opened. The sign stayed in place. I told the first visitor we had solved a small problem together, which sounded better than explaining how certain I had been.\n\nI DO:\nShared event: the blue sign is found behind the board.\nKai’s interpretation: Sam must have taken it.\nCreative choice for a Sam rewrite: Sam wants visitors to find the gate. This motive is plausible fiction, not a verified fact about an unseen real person.\n\nYOU TRY:\nLabel the fan’s role carefully: what is seen, and what is inferred?\n\nCHECK:\nThe fan faces the display. Its draught is a plausible explanation for the paper’s movement, but neither narrator reports watching the sign fall.",
      "notice": "Creative thoughts belong to the rewrite. Do not present them as source evidence in an analytical response.",
      "check": {
        "question": "What should a same-incident perspective rewrite preserve?",
        "options": [
          "Every original judgement as a proven fact",
          "Only the original title",
          "No shared events at all",
          "The central shared events and sequence"
        ],
        "correct_index": 3,
        "explanation": "The incident stays recognisable through its shared events; viewpoint changes access, emphasis and interpretation."
      },
      "visual": [
        {
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 178\"><rect width=\"420\" height=\"178\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Shared events stay recognisable</text><text x=\"16\" y=\"80\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Lens: Sam’s observations</text><text x=\"16\" y=\"126\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Voice: selected practical details</text></svg>",
          "alt": "A perspective diagram separates shared events from the focal character’s available information and selected voice details.",
          "caption": "Change access and emphasis while preserving the incident."
        }
      ]
    },
    {
      "icon": "🔎",
      "title": "Choose a viewpoint and control access",
      "explain": "**Viewpoint controls what the narration can know.**\nA first-person Sam uses I to report Sam’s experience. A third-person limited Sam uses the name or pronouns while staying with Sam’s perceptions and thoughts. Neither automatically knows Kai’s private thoughts.\n\n**Choose one lens for the scene.**\nIf using third-person limited, describe what Sam sees and hears, and choose plausible interior thought for Sam. Avoid suddenly stating what Kai secretly thinks without marking a different narrative choice.\n\n**Report behaviour before inferring motive.**\nSam can see Kai holding a phone. Sam cannot directly observe the contents of Kai’s mind. Use a cautious interpretation or leave the action to speak for itself.\n\nA consistent lens helps a reader know which information is available. Precision matters more than adding I to every sentence.",
      "example": "I DO:\nThird-person limited: “Sam saw Kai put the phone down and look at the empty space.”\nWithin that lens, I can invent Sam’s thought about getting ready. I avoid “Kai secretly wanted to blame someone” as an unmarked fact about Kai’s mind.\n\nYOU TRY:\nRewrite one observed action through Sam’s lens without claiming Kai’s private motive.\n\nCHECK:\n“Kai asked where the sign was” preserves something Sam hears. An interpretation can be added cautiously, but it should not become unexplained mind-reading.",
      "notice": "Changing pronouns alone does not create a controlled perspective. Check access to information.",
      "check": {
        "question": "Which sentence fits third-person limited Sam?",
        "options": [
          "Sam knew every secret thought in Kai’s mind without explanation",
          "Sam heard Kai ask where the sign was",
          "The author becomes the sign",
          "All characters share one hidden thought"
        ],
        "correct_index": 1,
        "explanation": "Sam can hear the spoken question. The lens does not automatically provide direct access to Kai’s private thoughts."
      }
    },
    {
      "icon": "🔎",
      "title": "Build a distinct voice through choices",
      "explain": "**Voice is the impression created by the telling.**\nWord choice, sentence patterns and selected details can suggest attitude and priorities. A practical account may attend to signs, visitors and the next action; a defensive account may emphasise certainty and personal credit.\n\n**Choose a coherent priority.**\nFor Sam, one creative choice is focusing on preparing the entrance. Select details about arrows and securing corners to support that priority. You do not need to make Sam flawless or turn Kai into a villain.\n\n**Show a thought through a decision.**\nSam can decide not to argue about credit because visitors will arrive soon. An action and brief thought can establish voice more precisely than a label such as nice.\n\nKeep language consistent with the chosen lens and purpose. A new perspective should reveal a different emphasis while remaining part of the same incident.",
      "example": "I DO:\n“Sam chose not to argue about whose idea it was. The visitors would soon arrive, and the sign needed to stay visible.”\nThis invented thought foregrounds practical preparation. It is a narrative choice, not proof that Sam always behaves that way.\n\nYOU TRY:\nChoose one detail Sam might prioritise in the courtyard and explain how it supports the voice.\n\nCHECK:\nAn arrow near the entrance can support a concern with helping visitors find the route. Keep the priority linked to an action.",
      "notice": "A different perspective can complicate the incident without reversing every judgement into its opposite.",
      "check": {
        "question": "Which choice can establish a practical voice?",
        "options": [
          "Describe every character as perfect",
          "Change the shared event to an unrelated race",
          "Focus on securing the sign before visitors arrive",
          "Repeat a personality label without action"
        ],
        "correct_index": 2,
        "explanation": "The selected task and action foreground preparation, supporting a practical voice through concrete decisions."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Rewrite a scene from another perspective",
            "transcript": "Pip: If I rewrite through Sam, can I state every secret thought Kai has?\nJuno: Choose the lens. Sam can observe the question and discovery, but a limited viewpoint does not automatically enter another mind.\nPip: I can preserve the shared events while selecting Sam’s practical priority. New interior thoughts are my fiction choices.\nJuno: Pause and revise one unobserved thought into a visible action or qualified interpretation.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "If I rewrite through Sam, can I state every secret thought Kai has?"
                  },
                  {
                    "who": "juno",
                    "text": "Choose the lens. Sam can observe the question and discovery, but a limited viewpoint does not automatically enter another mind."
                  },
                  {
                    "who": "pip",
                    "text": "I can preserve the shared events while selecting Sam’s practical priority. New interior thoughts are my fiction choices."
                  },
                  {
                    "who": "juno",
                    "text": "Pause and revise one unobserved thought into a visible action or qualified interpretation.",
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
      "icon": "🔎",
      "title": "Revise for continuity and explain the effect",
      "explain": "**Compare the rewrite with the event record.**\nCheck the arrival time stated by Sam, the question, discovery and secured corners. If you change an event intentionally, it becomes an adaptation rather than the same-incident rewrite requested here.\n\n**Check access sentence by sentence.**\nAsk how Sam knows each stated fact. A perception, spoken line or chosen interior thought should fit the viewpoint. Remove unmarked access to another mind.\n\n**Explain the perspective’s effect.**\nName a detail or wording choice and what it makes the reader notice. For example, preparing directions may shift attention from blame to a shared task.\n\nShow one before-and-after revision with a reason. That records your craft decision more clearly than saying you made it sound better.",
      "example": "I DO:\nBefore: “Sam knew Kai was embarrassed.”\nAfter: “Kai looked at the sign and said it had been the plan all along.”\nReason: the revision reports visible or audible behaviour instead of unexplained access to Kai’s private feeling.\n\nYOU TRY:\nChoose a sentence in your draft and test how the focal character could know it.\n\nCHECK:\nIf the knowledge is not available through the chosen lens, revise it into observation, qualified inference or your own focal character’s thought.",
      "notice": "An effect explanation links a craft choice with a reader’s focus. It is not only a plot summary.",
      "check": {
        "question": "Which revision improves viewpoint control?",
        "options": [
          "Replace unobserved private thought with observable behaviour",
          "Give Sam knowledge of every future event",
          "Remove the incident’s shared outcome",
          "Add a new secret as if the source confirmed it"
        ],
        "correct_index": 0,
        "explanation": "Observable behaviour fits the lens and avoids unexplained knowledge of another character’s mind."
      }
    }
  ],
  "worked_example": "I DO: Keep the shared incident but select a new lens.\nSHARED-EVENT NOTES\nSam prepares directions; Kai asks about the missing sign; the sign is found behind the board; the corners are secured before opening.\n\nCOMPLETE THIRD-PERSON LIMITED SAM MODEL\nBEFORE THE OPENING\nSam reached the courtyard at five past nine carrying tape for the direction signs. The exhibition would open at ten, and visitors needed to find the garden gate. Sam fixed an arrow near the entrance, then looked towards the display tables.\nKai stood beside a model with a phone in hand. A few minutes later, Kai put the phone down and looked at the empty space beside the board.\n“Where did you put the sign?” Kai asked.\nSam followed the glance towards the roll of tape. “I haven’t moved your sign. Have you looked behind the board?”\nKai bent down and drew out the blue sign. The fan faced the table; its draught could explain the paper’s movement, although Sam had not seen it fall.\nSam held the board while Kai replaced the sign. “We can tape the corners.”\n“That was my plan,” Kai said.\nSam chose not to argue about whose idea it was. The visitors would soon arrive, and the sign needed to stay visible. At ten, the corners were secure and both displays were ready.\n\nWHY IT WORKS\nThe model keeps the recognisable events while selecting Sam’s observations and a practical preparation priority. The interior choice not to argue is newly created fiction, not evidence that the source established Sam’s private motive.\n\nCOMMON MISTAKE AND FIX\n“Sam knew Kai secretly felt ashamed” gives unmarked access to Kai’s mind. Replace it with visible behaviour or dialogue, or use a clearly qualified interpretation.\n\nREVISION EXPLANATION\nI foregrounded directions and securing corners so the incident centres on preparation rather than the narrator’s certainty about blame.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 178\"><rect width=\"420\" height=\"178\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Shared events stay recognisable</text><text x=\"16\" y=\"80\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Lens: Sam’s observations</text><text x=\"16\" y=\"126\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Voice: selected practical details</text></svg>",
      "alt": "A perspective diagram separates shared events from the focal character’s available information and selected voice details.",
      "caption": "Change access and emphasis while preserving the incident."
    }
  ],
  "guided_practice": "WE DO:\n1. Write four shared events in order before inventing interior thoughts.\n2. Choose Sam’s third-person limited lens. List one seen action and one heard line.\n3. Rewrite “Sam knew Kai was embarrassed” without unmarked mind-reading. Compare: describe Kai looking at the sign and claiming the plan was already intended.\n4. Choose a practical detail such as the direction arrow. Explain how it changes emphasis.\n5. Draft a short discovery paragraph, then compare its sequence with the shared-event record.\n6. Explain one new thought as your creative choice rather than a source-confirmed fact.",
  "independent_task": "YOU DO: Rewrite a scene from another perspective task (about 25–30 minutes).\n1. Read the complete source or models included in this lesson.\n2. Plan a shared-event record, then write 200–300 words from Sam’s first-person or third-person limited perspective. Preserve the incident, make two deliberate voice choices and explain a viewpoint revision.\n3. Show the evidence, planning or clause working behind two decisions.\n4. Reread or rehearse and improve one specific part. Explain the before-and-after change and its purpose.\n5. Answer the reflection. Work on paper or in the big box; type a clear record if you used paper. Uploads are optional.\nSuccess checklist: requested complete response; accurate event or clause relationships; supported choices; appropriate knowledge limits; explained revision; honest evidence record.",
  "response_prompt": "Which evidence or craft decision most affected your rewrite a scene from another perspective response, and why?",
  "quiz": [
    {
      "question": "What should a same-incident perspective rewrite preserve?",
      "options": [
        "Every original judgement as a proven fact",
        "Only the original title",
        "No shared events at all",
        "The central shared events and sequence"
      ],
      "correct_index": 3,
      "explanation": "The incident stays recognisable through its shared events; viewpoint changes access, emphasis and interpretation.",
      "type": "multiple_choice"
    },
    {
      "question": "Which sentence fits third-person limited Sam?",
      "options": [
        "Sam knew every secret thought in Kai’s mind without explanation",
        "Sam heard Kai ask where the sign was",
        "The author becomes the sign",
        "All characters share one hidden thought"
      ],
      "correct_index": 1,
      "explanation": "Sam can hear the spoken question. The lens does not automatically provide direct access to Kai’s private thoughts.",
      "type": "multiple_choice"
    },
    {
      "question": "Which choice can establish a practical voice?",
      "options": [
        "Describe every character as perfect",
        "Change the shared event to an unrelated race",
        "Focus on securing the sign before visitors arrive",
        "Repeat a personality label without action"
      ],
      "correct_index": 2,
      "explanation": "The selected task and action foreground preparation, supporting a practical voice through concrete decisions.",
      "type": "multiple_choice"
    },
    {
      "question": "Which revision improves viewpoint control?",
      "options": [
        "Replace unobserved private thought with observable behaviour",
        "Give Sam knowledge of every future event",
        "Remove the incident’s shared outcome",
        "Add a new secret as if the source confirmed it"
      ],
      "correct_index": 0,
      "explanation": "Observable behaviour fits the lens and avoids unexplained knowledge of another character’s mind.",
      "type": "multiple_choice"
    },
    {
      "question": "What changes when a narrative perspective changes?",
      "options": [
        "Every shared event must reverse",
        "Information access and emphasis can change",
        "The source proves new private thoughts",
        "All pronouns disappear"
      ],
      "correct_index": 1,
      "explanation": "A new lens can change available observations and selected emphasis while preserving events.",
      "type": "multiple_choice"
    },
    {
      "question": "What are newly invented thoughts in the rewrite?",
      "options": [
        "Independent source evidence",
        "Facts about a real person",
        "Creative fiction choices",
        "A reason to remove all events"
      ],
      "correct_index": 2,
      "explanation": "The writer may create them for the new version but should not treat them as source-confirmed facts.",
      "type": "multiple_choice"
    },
    {
      "question": "Which detail supports the Sam model’s priority?",
      "options": [
        "Preparing entrance directions",
        "An invented unrelated race",
        "Knowing every secret thought",
        "Changing the time without explanation"
      ],
      "correct_index": 0,
      "explanation": "Preparing directions foregrounds practical readiness in this incident.",
      "type": "multiple_choice"
    },
    {
      "question": "What is a viewpoint-control check?",
      "options": [
        "Count only the adjectives",
        "Change every character into a villain",
        "Remove all dialogue",
        "Ask how the focal character knows each stated fact"
      ],
      "correct_index": 3,
      "explanation": "The knowledge-access question checks consistency with the chosen lens.",
      "type": "multiple_choice"
    },
    {
      "question": "Which wording preserves uncertainty?",
      "options": [
        "Sam watched the fall when the source never reports it",
        "The fan could explain the movement, though Sam had not seen it fall",
        "All private motives are proven",
        "Kai’s accusation must be correct"
      ],
      "correct_index": 1,
      "explanation": "The wording distinguishes a plausible cause from direct observation.",
      "type": "multiple_choice"
    },
    {
      "question": "What should the revision explanation connect?",
      "options": [
        "Only the word count",
        "The title and page colour",
        "A specific craft choice with its effect on the reader’s focus",
        "An invented source quotation"
      ],
      "correct_index": 2,
      "explanation": "Explaining choice and effect records the narrative purpose of a revision.",
      "type": "multiple_choice"
    }
  ],
  "parent_notes": "Parent: Teaches rewrite a scene from another perspective through original narrative material and explicit language or craft modelling. Original content follows the repository’s topic sequence. Exact outcome codes are empty pending verified mapping; this is not a claim of complete syllabus coverage.\n\nParent: Look for supported and qualified interpretation, controlled information access, complete clause relationships or accurate storytelling as appropriate. Do not treat fictional reliability analysis as a diagnosis of real people. The lesson itself supplies the teaching and feedback. Your role is access support and reviewing the evidence.\n\nParent: A strong rewrite preserves the question, sign discovery and securing outcome. New interior thoughts are creative choices, not established source facts. The included Sam model uses third-person limited access and a practical emphasis.\n\nParent: Ten scored choices use the unchanged 90% threshold, requiring 9/10. The independent task and reflection supply written reasoning for manual review.",
  "evidence_instructions": "Keep the rewrite a scene from another perspective task, supporting notes or working, before-and-after revision, reflection and quiz result.",
  "offline_alternative": "Copy or print the supplied source and models, complete the rewrite a scene from another perspective task on paper and rehearse where needed. Later type a clear evidence summary.",
  "extension": "Rewrite the same short discovery through Kai and Sam in two brief paragraphs. Explain what each can know and what each emphasises.",
  "stage_hints": {
    "accept": [
      "Read the mission about rewrite a scene from another perspective.",
      "You will practise rewrite a scene from another perspective through models before making your own response.",
      "Begin with the first explanation of rewrite a scene from another perspective; the examples remain available while you work."
    ],
    "teach0": [
      "Reread the incident’s directly reported actions.",
      "Put an unsupported interpretation in a separate note from shared events.",
      "Preserve the event sequence, then label any new interior thought as a creative choice."
    ],
    "teach1": [
      "Identify whose perceptions anchor this version.",
      "Keep observed actions separate from another character’s private thoughts.",
      "Write what the focal character can see or hear before adding a qualified interpretation."
    ],
    "teach2": [
      "Look at the details selected for the focal character.",
      "Choose a priority that connects to an action in this incident.",
      "Use one concrete action and a brief thought to establish voice without a sweeping personality claim."
    ],
    "teach3": [
      "Compare each sentence with the chosen viewpoint’s access.",
      "Find an unsupported claim about another character’s private thought.",
      "Replace it with behaviour, a qualified inference or a clearly chosen thought of the focal character."
    ],
    "learn": [
      "Read the complete model and its explanation before copying a shape.",
      "Match one decision to the source detail or clause relationship that supports it.",
      "Explain how the model handles rewrite a scene from another perspective and where it limits its claim."
    ],
    "guided": [
      "Start with the first supplied source detail or clause unit.",
      "Complete one rewrite a scene from another perspective attempt before reading its feedback.",
      "Use the model’s checking question on your own attempt, then explain the reason for a revision."
    ],
    "write": [
      "Record the shared events before inventing Sam’s interior thoughts.",
      "Begin “Sam arrived at ____ to ____.” Choose an opening consistent with the incident.",
      "A partial opening is “Near the garden gate, Sam noticed ____.” Continue with only the information available through your chosen lens."
    ],
    "quiz": [
      "Return to the specific rewrite a scene from another perspective teaching step named by the question.",
      "For a perspective question, check which information the chosen focal character can access.",
      "Use source evidence or the demonstrated clause test before choosing; do not select by how confident an option sounds."
    ],
    "submit": [
      "Check that your rewrite a scene from another perspective task and working are present.",
      "Include the rewrite a scene from another perspective reflection and any written reasoning you produced.",
      "Send your rewrite a scene from another perspective evidence for review; type a clear record if you used paper."
    ],
    "plan": [
      "Begin with the shared-event box before inventing a motive.",
      "Record one directly reported action, then decide what the Sam lens can know.",
      "Add a voice choice that changes emphasis while keeping the event record stable."
    ]
  }
}'), updated_at=datetime('now') WHERE seed_key='s4-eng-y8-w01-l2';

-- s4-eng-y8-w01-l3
UPDATE lessons SET title='Year 8: Control complex sentences and clauses', data=json_patch(data, '{
  "seed_key": "s4-eng-y8-w01-l3",
  "title": "Year 8: Control complex sentences and clauses",
  "stage": "S4",
  "learning_area": "English",
  "year_level": "Year 8",
  "week": 1,
  "lesson_number": 3,
  "duration_minutes": 60,
  "child_mission": "Explore control complex sentences and clauses through an original courtyard story. Make deliberate choices and explain them with precise evidence.",
  "learning_intention": "We are learning to control complex sentences and clauses.",
  "success_criteria": [
    "I can explain the key narrative or language idea.",
    "I can use a specific example to support a decision.",
    "I can apply the taught method to a complete response.",
    "I can revise or qualify a choice and explain its effect."
  ],
  "materials": [
    "Everything you need to read is included in this lesson",
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
  "spelling_focus": null,
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
      "icon": "🔎",
      "title": "Find the subject and verb in each clause",
      "explain": "**A clause contains a subject and a verb.**\nThe subject identifies who or what the clause is about; the verb expresses action or state. In “Kai checked the table”, Kai is the subject and checked is the verb.\n\n**A sentence can contain more than one clause.**\n“Sam held the board because Kai needed both hands” contains two subject–verb units. A long list of objects does not automatically create extra clauses.\n\n**A verb group may contain several words.**\n“Sam was holding the board” has the verb group was holding. Those words work together within one clause; counting verb-shaped words alone can overcount clauses.\n\nMark subject and verb before naming structure. This gives evidence for a clause count instead of judging only the sentence’s length.",
      "example": "I DO:\n“Sam held the board because Kai needed both hands.”\nUnit one: Sam / held.\nUnit two: Kai / needed.\n“Sam was holding the board” is one subject with one multiword verb group.\n\nYOU TRY:\nIdentify the subject and verb in “The sign was visible”.\n\nCHECK:\nThe sign is the subject; was is the verb connecting it with the description visible. A verb can express state rather than movement.",
      "notice": "Do not count every word in a verb group as a separate clause.",
      "check": {
        "question": "Which is the verb group in “Sam was holding the board”?",
        "options": [
          "Sam was",
          "Holding the board Sam",
          "Was holding",
          "Board only"
        ],
        "correct_index": 2,
        "explanation": "Was holding works as the clause’s verb group with Sam as subject."
      },
      "visual": [
        {
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 224\"><rect width=\"420\" height=\"224\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Main: Sam held the board</text><text x=\"16\" y=\"80\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Reason: because Kai needed</text><text x=\"16\" y=\"126\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">both hands</text><text x=\"16\" y=\"172\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Introductory clause → comma</text></svg>",
          "alt": "A clause diagram identifies a main action and a dependent reason, with a comma after an introductory subordinate clause.",
          "caption": "Structure is about clause relationships, not length."
        }
      ]
    },
    {
      "icon": "🔎",
      "title": "Distinguish main and subordinate clauses",
      "explain": "**A main clause can stand as a complete statement in these models.**\n“Sam held the board” gives an independent idea. A subordinate clause depends on another clause for the complete sentence relationship.\n\n**A subordinating conjunction marks the relationship.**\nBecause Kai needed both hands gives a reason but leaves a reader waiting for the main statement. Words such as because, although and when can introduce dependent relationships.\n\n**A complex sentence combines a main and a subordinate clause.**\n“Sam held the board because Kai needed both hands” connects action with reason. Complex describes clause structure, not how difficult or long the sentence looks.\n\nRead the clauses separately to test their jobs, then together to check the complete meaning. Not every conjunction makes the same kind of structure.",
      "example": "I DO:\nMain: Sam held the board.\nSubordinate: because Kai needed both hands.\nComplete: Sam held the board because Kai needed both hands.\n\nYOU TRY:\nWhy is “Because Kai needed both hands” incomplete as the whole task sentence?\n\nCHECK:\nIt gives a reason but not the main action linked to that reason. Add the main clause rather than only a full stop.",
      "notice": "A capital and full stop do not supply a missing main clause.",
      "check": {
        "question": "Why is “Because Kai needed both hands” incomplete here?",
        "options": [
          "It contains no letters",
          "It provides a dependent reason without its main statement",
          "Every sentence must be long",
          "Because can never occur in writing"
        ],
        "correct_index": 1,
        "explanation": "The clause depends on a main statement to complete the reason relationship in this task."
      }
    },
    {
      "icon": "🔎",
      "title": "Choose a conjunction for the intended relationship",
      "explain": "**Different links carry different meanings.**\nBecause introduces reason; when can indicate time; although introduces contrast or concession. Replacing one with another can change the relationship even if the surrounding words stay similar.\n\n**Check the intended logic.**\n“Although the sign fell, the display was ready on time” contrasts a setback with a completed outcome. “The sign fell because the fan faced the table” suggests a cause; in the story this is an inference, so qualify it if making an analytical claim.\n\n**Preserve the level of certainty.**\nFor analysis, “The sign may have moved because the fan faced the table” avoids claiming an unobserved cause as proven. For original fiction, an author can establish a cause through the chosen narration.\n\nChoose the relationship before choosing the conjunction. A fluent sentence can still express the wrong reason, time or contrast.",
      "example": "I DO:\nReason: “Sam held the board because Kai needed both hands.”\nTime: “Kai found the sign when Sam suggested checking the gap.”\nContrast: “Although they lost time, the display was ready.”\n\nYOU TRY:\nLink a setback with a successful outcome using a contrast relationship.\n\nCHECK:\n“Although the sign fell, the display was ready on time” preserves the contrast. A reason conjunction would express a different connection.",
      "notice": "The link changes meaning. Check whether the clause expresses the relationship you intended.",
      "check": {
        "question": "Which word introduces contrast in the taught models?",
        "options": [
          "Because",
          "When",
          "And only",
          "Although"
        ],
        "correct_index": 3,
        "explanation": "Although introduces a concession or contrast between the dependent clause and the main outcome."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Control complex sentences and clauses",
            "transcript": "Pip: Because Kai needed both hands gives a reason. Does it finish the whole statement by itself?\nJuno: Attach a main clause: Sam held the board. Together they make the reason relationship complete.\nPip: If the reason comes first, I mark its boundary: Because Kai needed both hands, Sam held the board.\nJuno: Pause and identify each subject and verb before reordering your own clause pair.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "Because Kai needed both hands gives a reason. Does it finish the whole statement by itself?"
                  },
                  {
                    "who": "juno",
                    "text": "Attach a main clause: Sam held the board. Together they make the reason relationship complete."
                  },
                  {
                    "who": "pip",
                    "text": "If the reason comes first, I mark its boundary: Because Kai needed both hands, Sam held the board."
                  },
                  {
                    "who": "juno",
                    "text": "Pause and identify each subject and verb before reordering your own clause pair.",
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
      "icon": "🔎",
      "title": "Reorder clauses and punctuate the model",
      "explain": "**The subordinate clause can come first.**\n“Because Kai needed both hands, Sam held the board.” In this model, a comma marks the end of the introductory subordinate clause before the main statement.\n\n**The main clause can come first too.**\n“Sam held the board because Kai needed both hands.” In this model, no comma is needed before the following reason clause. Other clause types can use different comma patterns; keep this task to the demonstrated structures.\n\n**Avoid fragments and comma splices.**\nDo not leave “Because Kai needed both hands” alone. Do not join two independent statements with only a comma and call that a complex sentence. Our target needs a subordinate relationship as well as a main clause.\n\nReorder one sentence and check that the cause, time or contrast remains clear. Punctuation should help the reader follow the structure, not replace a missing clause.",
      "example": "I DO:\nMain first: “Sam held the board because Kai needed both hands.”\nSubordinate first: “Because Kai needed both hands, Sam held the board.”\nThe meaning is preserved while the introductory clause is marked with a comma.\n\nYOU TRY:\nMove “although they lost time” to the beginning of a sentence about the display being ready.\n\nCHECK:\n“Although they lost time, the display was ready.” The comma follows the introductory clause; the main statement remains complete.",
      "notice": "Check both structure and marks. Punctuation cannot turn an unfinished reason into a complete thought.",
      "check": {
        "question": "Which follows the demonstrated introductory-clause pattern?",
        "options": [
          "Because Kai needed both hands, Sam held the board.",
          "Because, Kai needed both hands Sam held the board.",
          "Because Kai needed both hands.",
          "Sam held, because the board."
        ],
        "correct_index": 0,
        "explanation": "The introductory subordinate clause is followed by a comma and a complete main statement."
      }
    }
  ],
  "worked_example": "I DO: Build and edit a complete set of complex sentences.\nReason: Sam held the board because Kai needed both hands.\nReason, reordered: Because Kai needed both hands, Sam held the board.\nTime: Kai found the sign when Sam suggested checking the gap.\nTime, reordered: When Sam suggested checking the gap, Kai found the sign.\nContrast: Although they lost time, the display was ready.\nContrast, main first: The display was ready although they lost time.\n\nCLAUSE LABELS\nSam / held and Kai / needed are two subject–verb units in the first sentence. Because introduces a dependent reason; Sam held the board is the main statement. Was ready is a verb group expressing a state in the contrast model.\n\nCOMMON MISTAKE AND FIX\n“Because the sign fell.” gives a dependent reason without its main statement. Repair: “Because the sign fell, Kai checked behind the board.” The repair supplies the main action and marks the introductory boundary.\n\nWHY IT WORKS\nThe linking word expresses the intended relationship, both clauses are present, and the punctuation follows the demonstrated order. Reordering does not replace the reason with a different event.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 224\"><rect width=\"420\" height=\"224\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Main: Sam held the board</text><text x=\"16\" y=\"80\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Reason: because Kai needed</text><text x=\"16\" y=\"126\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">both hands</text><text x=\"16\" y=\"172\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Introductory clause → comma</text></svg>",
      "alt": "A clause diagram identifies a main action and a dependent reason, with a comma after an introductory subordinate clause.",
      "caption": "Structure is about clause relationships, not length."
    }
  ],
  "guided_practice": "WE DO:\n1. Mark Sam / held in “Sam held the board”. This is the main statement.\n2. Mark Kai / needed in “because Kai needed both hands”. It is a dependent reason.\n3. Join them main-first and compare with the model: no comma is needed in this demonstrated reason order.\n4. Move the reason first. Compare: “Because Kai needed both hands, Sam held the board.”\n5. Choose although to link a setback and a successful outcome, then explain the contrast.\n6. Repair “When the exhibition opened.” with a complete main statement. Example after your attempt: “When the exhibition opened, the sign stayed visible.”",
  "independent_task": "YOU DO: Control complex sentences and clauses task (about 25–30 minutes).\n1. Read the complete source or models included in this lesson.\n2. Write six complex sentences: two reason, two time and two contrast. Label subjects and verbs in three, reorder two using the model punctuation, and repair the supplied fragment “Because the sign fell.” Explain one revision.\n3. Show the evidence, planning or clause working behind two decisions.\n4. Reread or rehearse and improve one specific part. Explain the before-and-after change and its purpose.\n5. Answer the reflection. Work on paper or in the big box; type a clear record if you used paper. Uploads are optional.\nSuccess checklist: requested complete response; accurate event or clause relationships; supported choices; appropriate knowledge limits; explained revision; honest evidence record.",
  "response_prompt": "Which evidence or craft decision most affected your control complex sentences and clauses response, and why?",
  "quiz": [
    {
      "question": "Which is the verb group in “Sam was holding the board”?",
      "options": [
        "Sam was",
        "Holding the board Sam",
        "Was holding",
        "Board only"
      ],
      "correct_index": 2,
      "explanation": "Was holding works as the clause’s verb group with Sam as subject.",
      "type": "multiple_choice"
    },
    {
      "question": "Why is “Because Kai needed both hands” incomplete here?",
      "options": [
        "It contains no letters",
        "It provides a dependent reason without its main statement",
        "Every sentence must be long",
        "Because can never occur in writing"
      ],
      "correct_index": 1,
      "explanation": "The clause depends on a main statement to complete the reason relationship in this task.",
      "type": "multiple_choice"
    },
    {
      "question": "Which word introduces contrast in the taught models?",
      "options": [
        "Because",
        "When",
        "And only",
        "Although"
      ],
      "correct_index": 3,
      "explanation": "Although introduces a concession or contrast between the dependent clause and the main outcome.",
      "type": "multiple_choice"
    },
    {
      "question": "Which follows the demonstrated introductory-clause pattern?",
      "options": [
        "Because Kai needed both hands, Sam held the board.",
        "Because, Kai needed both hands Sam held the board.",
        "Because Kai needed both hands.",
        "Sam held, because the board."
      ],
      "correct_index": 0,
      "explanation": "The introductory subordinate clause is followed by a comma and a complete main statement.",
      "type": "multiple_choice"
    },
    {
      "question": "What makes a sentence complex in these models?",
      "options": [
        "Its printed length only",
        "A main clause and a subordinate clause",
        "Every long verb group",
        "The number of adjectives"
      ],
      "correct_index": 1,
      "explanation": "Complex is a clause-structure description.",
      "type": "multiple_choice"
    },
    {
      "question": "What relationship does because introduce?",
      "options": [
        "Alphabet order",
        "An unrelated comparison",
        "Reason",
        "Only a list of nouns"
      ],
      "correct_index": 2,
      "explanation": "Because links a dependent reason to the main statement.",
      "type": "multiple_choice"
    },
    {
      "question": "What relationship can when introduce?",
      "options": [
        "Time",
        "A guaranteed cause in every case",
        "An adjective count",
        "A replacement for all verbs"
      ],
      "correct_index": 0,
      "explanation": "When can link the timing of a dependent event to the main event.",
      "type": "multiple_choice"
    },
    {
      "question": "Which fixes the supplied fragment?",
      "options": [
        "Because the sign fell.",
        "Because, the sign fell.",
        "Because the sign.",
        "Because the sign fell, Kai checked behind the board."
      ],
      "correct_index": 3,
      "explanation": "The repair supplies a main statement after the dependent reason.",
      "type": "multiple_choice"
    },
    {
      "question": "Which main-first reason sentence matches the model punctuation?",
      "options": [
        "Sam held, the board because Kai needed both hands.",
        "Sam held the board because Kai needed both hands.",
        "Sam, held the board because.",
        "Because Kai needed both hands."
      ],
      "correct_index": 1,
      "explanation": "The complete main-first reason model does not need a comma at that boundary.",
      "type": "multiple_choice"
    },
    {
      "question": "Why count subject–verb units instead of verb-shaped words?",
      "options": [
        "Clauses have no subjects",
        "Every auxiliary is a separate sentence",
        "Several words may form one verb group in one clause",
        "Only sentence length matters"
      ],
      "correct_index": 2,
      "explanation": "A multiword verb group can belong to a single clause.",
      "type": "multiple_choice"
    }
  ],
  "parent_notes": "Parent: Teaches control complex sentences and clauses through original narrative material and explicit language or craft modelling. Original content follows the repository’s topic sequence. Exact outcome codes are empty pending verified mapping; this is not a claim of complete syllabus coverage.\n\nParent: Look for supported and qualified interpretation, controlled information access, complete clause relationships or accurate storytelling as appropriate. Do not treat fictional reliability analysis as a diagnosis of real people. The lesson itself supplies the teaching and feedback. Your role is access support and reviewing the evidence.\n\nParent: Accept logical complete examples using because, when and although. Introductory dependent clauses use the taught comma boundary. Model repair: Because the sign fell, Kai checked behind the board. A full stop alone does not repair the fragment.\n\nParent: Ten scored choices use the unchanged 90% threshold, requiring 9/10. The independent task and reflection supply written reasoning for manual review.",
  "evidence_instructions": "Keep the control complex sentences and clauses task, supporting notes or working, before-and-after revision, reflection and quiz result.",
  "offline_alternative": "Copy or print the supplied source and models, complete the control complex sentences and clauses task on paper and rehearse where needed. Later type a clear evidence summary.",
  "extension": "Take one reason sentence and one contrast sentence. Reorder each, preserving meaning and using the demonstrated punctuation.",
  "stage_hints": {
    "accept": [
      "Read the mission about control complex sentences and clauses.",
      "You will practise control complex sentences and clauses through models before making your own response.",
      "Begin with the first explanation of control complex sentences and clauses; the examples remain available while you work."
    ],
    "teach0": [
      "Look for who or what the statement concerns.",
      "Find the action or state words working together.",
      "Mark one subject–verb unit before deciding whether another clause begins."
    ],
    "teach1": [
      "Read the clause by itself and notice what the relationship expects next.",
      "Separate the dependent reason from the main action.",
      "Attach a suitable main statement so the sentence expresses the complete relationship."
    ],
    "teach2": [
      "Name the intended relationship before picking a linking word.",
      "Distinguish reason, time and contrast.",
      "Read the full sentence and check that the conjunction preserves that relationship."
    ],
    "teach3": [
      "Identify the end of the introductory dependent clause.",
      "Keep the main statement complete after it.",
      "Use the model’s comma boundary and read both clauses together for meaning."
    ],
    "learn": [
      "Read the complete model and its explanation before copying a shape.",
      "Match one decision to the source detail or clause relationship that supports it.",
      "Explain how the model handles control complex sentences and clauses and where it limits its claim."
    ],
    "guided": [
      "Start with the first supplied source detail or clause unit.",
      "Complete one control complex sentences and clauses attempt before reading its feedback.",
      "Use the model’s checking question on your own attempt, then explain the reason for a revision."
    ],
    "write": [
      "Start with one main statement and a reason clause.",
      "Use “____ because ____” and label the subject and verb in each part.",
      "A partial opening is “Sam ____ because Kai ____.” Complete both clauses, then test and reorder your sentence using the model boundary."
    ],
    "quiz": [
      "Return to the specific control complex sentences and clauses teaching step named by the question.",
      "For a clause question, mark each subject and verb, then identify the linking relationship.",
      "Use source evidence or the demonstrated clause test before choosing; do not select by how confident an option sounds."
    ],
    "submit": [
      "Check that your control complex sentences and clauses task and working are present.",
      "Include the control complex sentences and clauses reflection and any written reasoning you produced.",
      "Send your control complex sentences and clauses evidence for review; type a clear record if you used paper."
    ]
  }
}'), updated_at=datetime('now') WHERE seed_key='s4-eng-y8-w01-l3';

-- s4-eng-y8-w01-l4
UPDATE lessons SET title='Year 8: Tell a story with deliberate perspective', data=json_patch(data, '{
  "seed_key": "s4-eng-y8-w01-l4",
  "title": "Year 8: Tell a story with deliberate perspective",
  "stage": "S4",
  "learning_area": "English",
  "year_level": "Year 8",
  "week": 1,
  "lesson_number": 4,
  "duration_minutes": 60,
  "child_mission": "Explore tell a story with deliberate perspective through an original courtyard story. Make deliberate choices and explain them with precise evidence.",
  "learning_intention": "We are learning to tell a story with deliberate perspective.",
  "success_criteria": [
    "I can explain the key narrative or language idea.",
    "I can use a specific example to support a decision.",
    "I can apply the taught method to a complete response.",
    "I can revise or qualify a choice and explain its effect."
  ],
  "materials": [
    "Everything you need to read is included in this lesson",
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
  "spelling_focus": null,
  "hoard_words": null,
  "follow_up_challenges": null,
  "steps": null,
  "visual_plan": null,
  "interactive_activities": null,
  "printable_resource": {
    "title": "Sam’s version: storytelling cue organiser",
    "instructions": "Read the complete story, make brief event cues, plan two delivery choices and record one rehearsal improvement. Label the practice method accurately.",
    "passage": "BEFORE THE OPENING\nSam reached the courtyard at five past nine carrying tape for the direction signs. The exhibition would open at ten, and visitors needed to find the garden gate. Sam fixed an arrow near the entrance, then looked towards the display tables.\nKai stood beside a model with a phone in hand. A few minutes later, Kai put the phone down and looked at the empty space beside the board.\n“Where did you put the sign?” Kai asked.\nSam followed the glance towards the roll of tape. “I haven’t moved your sign. Have you looked behind the board?”\nKai bent down and drew out the blue sign. The fan faced the table; its draught could explain the paper’s movement, although Sam had not seen it fall.\nSam held the board while Kai replaced the sign. “We can tape the corners.”\n“That was my plan,” Kai said.\nSam chose not to argue about whose idea it was. The visitors would soon arrive, and the sign needed to stay visible. At ten, the corners were secure and both displays were ready.",
    "prompts": [
      "Person, situation and goal",
      "Question and knowledge limit",
      "Response and discovery",
      "Securing action and outcome",
      "Delivery choices and their purposes",
      "Rehearsal change and evidence type"
    ]
  },
  "reflection_prompts": null,
  "reflection_prompt": null,
  "teach_steps": [
    {
      "icon": "🔎",
      "title": "Plan the listener’s route through the incident",
      "explain": "**An oral telling unfolds once for a listener.**\nIntroduce person, setting and goal before the problem, response and outcome. A listener may not be able to reread a previous sentence, so clear connections matter.\n\n**Select a perspective deliberately.**\nRead the Sam version below. Its focus is preparing the exhibition and dealing with a question about the sign. Keep that focus if retelling this version; do not quietly turn Kai’s accusation into a confirmed event.\n\n**Choose essential events rather than every sentence.**\nArrival and directions establish the goal, the missing sign creates the problem, checking the gap leads to discovery, and securing the corners leads to readiness. Preserve those connections in your own wording.\n\nWrite a short event map before planning delivery. A dramatic voice cannot compensate for a missing cause or an unexplained outcome.",
      "example": "READ THE COMPLETE ORIGINAL SAM VERSION\nBEFORE THE OPENING\nSam reached the courtyard at five past nine carrying tape for the direction signs. The exhibition would open at ten, and visitors needed to find the garden gate. Sam fixed an arrow near the entrance, then looked towards the display tables.\nKai stood beside a model with a phone in hand. A few minutes later, Kai put the phone down and looked at the empty space beside the board.\n“Where did you put the sign?” Kai asked.\nSam followed the glance towards the roll of tape. “I haven’t moved your sign. Have you looked behind the board?”\nKai bent down and drew out the blue sign. The fan faced the table; its draught could explain the paper’s movement, although Sam had not seen it fall.\nSam held the board while Kai replaced the sign. “We can tape the corners.”\n“That was my plan,” Kai said.\nSam chose not to argue about whose idea it was. The visitors would soon arrive, and the sign needed to stay visible. At ten, the corners were secure and both displays were ready.\n\nI DO:\nBeginning: Sam prepares directions before the exhibition.\nProblem: Kai questions Sam about the missing sign.\nResponse: Sam suggests checking the gap and helps secure the sign.\nOutcome: both displays are ready at opening.\n\nYOU TRY:\nWhich event prevents the telling from treating Kai’s accusation as a confirmed fact?\n\nCHECK:\nThe sign is discovered behind the board, and Sam’s account does not report removing it. Keep the distinction between accusation and observed action.",
      "notice": "Retelling should preserve the selected version’s events and knowledge limits.",
      "check": {
        "question": "What should a telling of the Sam version preserve?",
        "options": [
          "The accusation as independently proven",
          "The changed focus and actual event connections",
          "A new unrelated ending without explanation",
          "Every original word memorised"
        ],
        "correct_index": 1,
        "explanation": "The retelling keeps the Sam version’s perspective and event relationships without needing word-for-word memorisation."
      },
      "visual": [
        {
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 224\"><rect width=\"420\" height=\"224\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Cue → complete event</text><text x=\"16\" y=\"80\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Delivery → meaningful choice</text><text x=\"16\" y=\"126\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Rehearse → explain a change</text><text x=\"16\" y=\"172\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Evidence → label honestly</text></svg>",
          "alt": "A storytelling sequence turns a cue into a complete event, selects purposeful delivery, rehearses and labels the evidence type.",
          "caption": "Preparation and observed performance are different evidence."
        }
      ]
    },
    {
      "icon": "🔎",
      "title": "Create cues that prompt complete ideas",
      "explain": "**Cue notes are brief reminders.**\nUse a short phrase per event, not a full paragraph to read. A cue such as gate directions carries more meaning than gate alone. Choose a format accessible to you.\n\n**Explain from the cue, then move on.**\nGlance at one note and communicate its event as a complete idea. Looking back is allowed. The cue supports memory but the listener needs the relationship, not just a list of nouns.\n\n**Keep viewpoint in the cues.**\nA note such as Kai’s accusation can prompt a reported claim. A note such as Sam took sign would present an unsupported event. The notes should preserve the selected account’s limits.\n\nTest the cue by looking away and explaining. If it loses an action or encourages an inaccurate claim, revise the wording before rehearsal.",
      "example": "I DO:\nCue: “Gate directions before opening.”\nTelling: “Sam arrived early to put up directions so visitors could find the courtyard.”\nCue: “Question → gap check.”\nTelling: “Kai asked about the missing sign, and Sam suggested looking behind the board.”\n\nYOU TRY:\nTurn “corners secured, opening” into a connected outcome.\n\nCHECK:\nExplain that they secured the sign so it stayed visible when the exhibition opened. Keep the action and result, not only two nouns.",
      "notice": "A useful cue prompts an accurate action and relationship.",
      "check": {
        "question": "Which cue preserves the account’s knowledge limit?",
        "options": [
          "Sam definitely caused every problem",
          "Kai’s private thoughts proved",
          "Question about sign → check gap",
          "All events invented by the listener"
        ],
        "correct_index": 2,
        "explanation": "The cue records the question and response without treating the accusation as a verified action."
      }
    },
    {
      "icon": "🔎",
      "title": "Choose delivery for meaning and audience",
      "explain": "**Pace, pause and emphasis guide attention.**\nPace is speed, a pause separates thoughts, and emphasis makes a selected word or phrase stand out. Choose them for the meaning you want a listener to follow.\n\n**Clarify the viewpoint shift and discovery.**\nGive the opening enough time to introduce Sam’s purpose. A brief pause before the gap check can mark a change from accusation to action. Keep connected phrases together instead of pausing between every word.\n\n**Avoid using performance to invent certainty.**\nA forceful reading of an accusation can make it sound proven. Preserve its status as a question or claim through accurate wording; delivery should not replace evidence.\n\nAdapt to the listener and your usual communication support. Clarity does not require an accent, theatrical character voice, audience, recording or upload.",
      "example": "I DO:\nI pause after reporting Kai’s question, then give the suggested gap check a steady pace. This helps the listener follow the response without treating the accusation as the ending.\n\nYOU TRY:\nTell the discovery event twice. Change one pace or pause choice, then explain whether it makes the connection clearer.\n\nCHECK:\nKeep the wording accurate and related words connected. If the event is already clear, preserve the useful choice instead of exaggerating every word.",
      "notice": "A delivery choice needs a reason tied to meaning, not only a claim that it sounds dramatic.",
      "check": {
        "question": "Which delivery plan has a clear purpose?",
        "options": [
          "Make every word loud regardless of meaning",
          "Pause inside every phrase",
          "Replace the discovery with an accusation",
          "Pause at the shift from question to checking so the response is clear"
        ],
        "correct_index": 3,
        "explanation": "The pause marks an important relationship between events and supports the listener’s understanding."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Tell a story with deliberate perspective",
            "transcript": "Pip: My note says question and gap check. It needs a full event for the listener.\nJuno: Explain that Kai asks about the sign and Sam suggests checking behind the board. Keep the accusation separate from an observed action.\nPip: I will pause at that transition, then rehearse and check whether the discovery is clear.\nJuno: Pause and try one cue twice. Explain a change and label whether your practice was solo or observed.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "My note says question and gap check. It needs a full event for the listener."
                  },
                  {
                    "who": "juno",
                    "text": "Explain that Kai asks about the sign and Sam suggests checking behind the board. Keep the accusation separate from an observed action."
                  },
                  {
                    "who": "pip",
                    "text": "I will pause at that transition, then rehearse and check whether the discovery is clear."
                  },
                  {
                    "who": "juno",
                    "text": "Pause and try one cue twice. Explain a change and label whether your practice was solo or observed.",
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
      "icon": "🔎",
      "title": "Rehearse, reflect and label the evidence",
      "explain": "**Rehearsal tests a plan.**\nCommunicate the whole telling once. Check event accuracy first, then clarity and delivery. A smooth performance can still make an unsupported claim; a correct plan does not by itself demonstrate actual speaking.\n\n**Make one specific improvement.**\nRestore a missing action, clarify a reference or give the discovery enough time. Practise again and explain what changed and why. If the first attempt worked, describe the check that confirmed it.\n\n**Separate evidence types.**\nCues and a written delivery plan show preparation. An observed or recorded telling can show actual delivery. Solo practice allows reflection on what you noticed, but it is not proof that a real listener understood.\n\nUse your normal communication method and identify it accurately. This lesson can be completed independently; a partner or recording is optional.",
      "example": "I DO:\nFirst draft cue: “Sam moved sign.”\nRepair: “Kai asks; sign found in gap.”\nReason: the revised cue avoids turning an accusation into a reported fact.\nRehearsal change: I slow the discovery and explain how securing the corners completes the goal.\n\nYOU TRY:\nCheck one cue or delivery choice, practise again and explain the improvement with its evidence type.\n\nCHECK:\nName an actual change and purpose. Label solo, observed, recorded or written practice rather than overstating what the evidence demonstrates.",
      "notice": "Do not label a written plan as an observed performance.",
      "check": {
        "question": "What does a written cue and delivery plan show by itself?",
        "options": [
          "Preparation and intended choices",
          "An audience’s actual response",
          "A recorded oral performance",
          "Proof of another person’s listening"
        ],
        "correct_index": 0,
        "explanation": "The plan records preparation; actual delivery and interaction need separate observed or recorded evidence."
      }
    }
  ],
  "worked_example": "I DO: Prepare a complete telling of the supplied version.\nBEFORE THE OPENING\nSam reached the courtyard at five past nine carrying tape for the direction signs. The exhibition would open at ten, and visitors needed to find the garden gate. Sam fixed an arrow near the entrance, then looked towards the display tables.\nKai stood beside a model with a phone in hand. A few minutes later, Kai put the phone down and looked at the empty space beside the board.\n“Where did you put the sign?” Kai asked.\nSam followed the glance towards the roll of tape. “I haven’t moved your sign. Have you looked behind the board?”\nKai bent down and drew out the blue sign. The fan faced the table; its draught could explain the paper’s movement, although Sam had not seen it fall.\nSam held the board while Kai replaced the sign. “We can tape the corners.”\n“That was my plan,” Kai said.\nSam chose not to argue about whose idea it was. The visitors would soon arrive, and the sign needed to stay visible. At ten, the corners were secure and both displays were ready.\n\nCUE NOTES\nSam: directions before opening\nKai: question about missing sign\nGap check: blue edge found\nCorners secured: displays ready\n\nMODEL TELLING\n“Sam arrived at the courtyard to prepare directions before the exhibition opened. Kai noticed a missing sign and asked Sam about it. Rather than accept the accusation as fact, Sam suggested looking behind the board. Kai found the blue sign in the gap. The fan faced the display, although neither had seen the paper fall. Sam helped hold the board while they secured the sign’s corners. By opening time, the sign stayed visible and both displays were ready.”\n\nDELIVERY PLAN\nIntroduce Sam’s preparation purpose clearly. Pause briefly at the shift from question to gap check. Keep the discovery’s related phrases connected.\n\nCOMMON MISTAKE AND FIX\n“Sam took the sign” turns an accusation into an event. Replace it with “Kai asked about the sign” and preserve the later discovery.\n\nREHEARSAL RECORD\nI revised the inaccurate cue and slowed the discovery explanation. This is a solo-practice report; it does not claim an observed performance or a real listener’s response.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 224\"><rect width=\"420\" height=\"224\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Cue → complete event</text><text x=\"16\" y=\"80\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Delivery → meaningful choice</text><text x=\"16\" y=\"126\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Rehearse → explain a change</text><text x=\"16\" y=\"172\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Evidence → label honestly</text></svg>",
      "alt": "A storytelling sequence turns a cue into a complete event, selects purposeful delivery, rehearses and labels the evidence type.",
      "caption": "Preparation and observed performance are different evidence."
    }
  ],
  "guided_practice": "WE DO:\n1. Turn the opening into a cue about person and preparation goal.\n2. Record the question as a reported claim, not proof that Sam moved the sign.\n3. Turn the gap-check cue into a complete event in your own wording.\n4. Add the securing action and outcome. Check both against the source.\n5. Rehearse once, then choose one accuracy or delivery improvement.\n6. Rehearse again and explain the change. Label the practice method you actually used; a listener or recording is optional.",
  "independent_task": "YOU DO: Tell a story with deliberate perspective task (about 25–30 minutes).\n1. Read the complete source or models included in this lesson.\n2. Prepare four or five cue notes for the Sam version, plan two delivery choices with reasons, rehearse a one-to-two-minute telling twice and explain an improvement. Submit the cue record and retelling summary, labelled solo, observed, recorded or written practice.\n3. Show the evidence, planning or clause working behind two decisions.\n4. Reread or rehearse and improve one specific part. Explain the before-and-after change and its purpose.\n5. Answer the reflection. Work on paper or in the big box; type a clear record if you used paper. Uploads are optional.\nSuccess checklist: requested complete response; accurate event or clause relationships; supported choices; appropriate knowledge limits; explained revision; honest evidence record.",
  "response_prompt": "Which evidence or craft decision most affected your tell a story with deliberate perspective response, and why?",
  "quiz": [
    {
      "question": "What should a telling of the Sam version preserve?",
      "options": [
        "The accusation as independently proven",
        "The changed focus and actual event connections",
        "A new unrelated ending without explanation",
        "Every original word memorised"
      ],
      "correct_index": 1,
      "explanation": "The retelling keeps the Sam version’s perspective and event relationships without needing word-for-word memorisation.",
      "type": "multiple_choice"
    },
    {
      "question": "Which cue preserves the account’s knowledge limit?",
      "options": [
        "Sam definitely caused every problem",
        "Kai’s private thoughts proved",
        "Question about sign → check gap",
        "All events invented by the listener"
      ],
      "correct_index": 2,
      "explanation": "The cue records the question and response without treating the accusation as a verified action.",
      "type": "multiple_choice"
    },
    {
      "question": "Which delivery plan has a clear purpose?",
      "options": [
        "Make every word loud regardless of meaning",
        "Pause inside every phrase",
        "Replace the discovery with an accusation",
        "Pause at the shift from question to checking so the response is clear"
      ],
      "correct_index": 3,
      "explanation": "The pause marks an important relationship between events and supports the listener’s understanding.",
      "type": "multiple_choice"
    },
    {
      "question": "What does a written cue and delivery plan show by itself?",
      "options": [
        "Preparation and intended choices",
        "An audience’s actual response",
        "A recorded oral performance",
        "Proof of another person’s listening"
      ],
      "correct_index": 0,
      "explanation": "The plan records preparation; actual delivery and interaction need separate observed or recorded evidence.",
      "type": "multiple_choice"
    },
    {
      "question": "What should an oral telling introduce first?",
      "options": [
        "Only the final claim",
        "Person, situation and goal",
        "Every private thought as fact",
        "A list of punctuation marks"
      ],
      "correct_index": 1,
      "explanation": "The listener needs an initial frame for later events.",
      "type": "multiple_choice"
    },
    {
      "question": "Why keep accusation separate from action?",
      "options": [
        "No event matters",
        "Every claim is proven",
        "The selected source does not confirm the alleged removal",
        "Every retelling must blame someone"
      ],
      "correct_index": 2,
      "explanation": "Accurate retelling preserves the source’s knowledge limits.",
      "type": "multiple_choice"
    },
    {
      "question": "What is a cue for?",
      "options": [
        "Prompting an accurate full idea",
        "Replacing every event with vague nouns",
        "Proving a live performance",
        "Changing the outcome randomly"
      ],
      "correct_index": 0,
      "explanation": "A useful cue supports a complete connected telling.",
      "type": "multiple_choice"
    },
    {
      "question": "What should guide a delivery change?",
      "options": [
        "An accent requirement",
        "Volume regardless of meaning",
        "A dramatic voice chosen before reading",
        "The meaning and transition a listener needs to follow"
      ],
      "correct_index": 3,
      "explanation": "Delivery choices should have a clarity purpose.",
      "type": "multiple_choice"
    },
    {
      "question": "Which evidence label is honest for independent rehearsal?",
      "options": [
        "Observed by a real listener when none was present",
        "Solo practice with a written reflection",
        "Recorded audio when nothing was recorded",
        "Proof of another person’s listening"
      ],
      "correct_index": 1,
      "explanation": "The label describes what actually happened.",
      "type": "multiple_choice"
    },
    {
      "question": "What does a useful reflection identify?",
      "options": [
        "Only that it sounded better",
        "The number of decorations",
        "An actual change and its purpose",
        "An invented audience response"
      ],
      "correct_index": 2,
      "explanation": "A reflection explains the specific improvement and why it helps.",
      "type": "multiple_choice"
    }
  ],
  "parent_notes": "Parent: Teaches tell a story with deliberate perspective through original narrative material and explicit language or craft modelling. Original content follows the repository’s topic sequence. Exact outcome codes are empty pending verified mapping; this is not a claim of complete syllabus coverage.\n\nParent: Look for supported and qualified interpretation, controlled information access, complete clause relationships or accurate storytelling as appropriate. Do not treat fictional reliability analysis as a diagnosis of real people. The lesson itself supplies the teaching and feedback. Your role is access support and reviewing the evidence.\n\nParent: A strong telling retains Sam’s entrance preparation, Kai’s question, checking, discovery and securing outcome. Assess actual oral delivery only if heard or recorded. A solo written record supports preparation and reasoning without proving a live interaction.\n\nParent: Ten scored choices use the unchanged 90% threshold, requiring 9/10. The independent task and reflection supply written reasoning for manual review.",
  "evidence_instructions": "Keep the tell a story with deliberate perspective task, supporting notes or working, before-and-after revision, reflection and quiz result.",
  "offline_alternative": "Copy or print the supplied source and models, complete the tell a story with deliberate perspective task on paper and rehearse where needed. Later type a clear evidence summary.",
  "extension": "Tell the incident through two different openings. Explain what extra background a listener needs in the second version.",
  "stage_hints": {
    "accept": [
      "Read the mission about tell a story with deliberate perspective.",
      "You will practise tell a story with deliberate perspective through models before making your own response.",
      "Begin with the first explanation of tell a story with deliberate perspective; the examples remain available while you work."
    ],
    "teach0": [
      "Reread the selected version’s goal and outcome.",
      "Separate the accusation from directly reported actions.",
      "Map beginning, problem, response and outcome before choosing delivery."
    ],
    "teach1": [
      "Look at what the cue would make you claim.",
      "Keep a reported interpretation separate from an observed event.",
      "Choose a brief action phrase that prompts an accurate full idea."
    ],
    "teach2": [
      "Locate the event transition you want the listener to notice.",
      "Choose one pace, pause or emphasis change rather than changing everything.",
      "Rehearse the short section twice and compare whether the intended meaning is clearer."
    ],
    "teach3": [
      "Look at the distinction between preparation and performance.",
      "Choose one actual accuracy or delivery improvement from your practice.",
      "Explain the change and label the kind of evidence you really produced."
    ],
    "learn": [
      "Read the complete model and its explanation before copying a shape.",
      "Match one decision to the source detail or clause relationship that supports it.",
      "Explain how the model handles tell a story with deliberate perspective and where it limits its claim."
    ],
    "guided": [
      "Start with the first supplied source detail or clause unit.",
      "Complete one tell a story with deliberate perspective attempt before reading its feedback.",
      "Use the model’s checking question on your own attempt, then explain the reason for a revision."
    ],
    "write": [
      "Begin with the person, preparation goal and first event cue.",
      "Start “Sam arrived before ____ because ____.” Keep the chosen version accurate.",
      "A partial opening is “At the courtyard, Sam wanted ____.” Complete the purpose, then move to the question and response in your own words."
    ],
    "quiz": [
      "Return to the specific tell a story with deliberate perspective teaching step named by the question.",
      "For a storytelling question, separate event accuracy, delivery choices and the evidence actually produced.",
      "Use source evidence or the demonstrated clause test before choosing; do not select by how confident an option sounds."
    ],
    "submit": [
      "Check that your tell a story with deliberate perspective task and working are present.",
      "Include the tell a story with deliberate perspective reflection and any written reasoning you produced.",
      "Send your tell a story with deliberate perspective evidence for review; type a clear record if you used paper."
    ]
  }
}'), updated_at=datetime('now') WHERE seed_key='s4-eng-y8-w01-l4';

-- s2-mat-y3-w01-l1
UPDATE lessons SET title='Year 3: Read and count whole numbers', data=json_patch(data, '{
  "seed_key": "s2-mat-y3-w01-l1",
  "title": "Year 3: Read and count whole numbers",
  "stage": "S2",
  "learning_area": "Mathematics",
  "year_level": "Year 3",
  "week": 1,
  "lesson_number": 1,
  "duration_minutes": 60,
  "child_mission": "Become a Number Investigator! Use place groups to solve read and count whole numbers tasks and explain how you checked.",
  "learning_intention": "We are learning to read and count whole numbers within the range to 10,000.",
  "success_criteria": [
    "I can read a numeral through its place groups.",
    "I can match a digit to its value.",
    "I can show a correct partition or comparison.",
    "I can check an answer and explain my reason."
  ],
  "materials": [
    "Everything you need to read is included in this lesson",
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
  "spelling_focus": null,
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
      "title": "Build the number from equal groups",
      "explain": "**A whole number counts complete units.**\nAn item count such as a number of cards uses whole units, not parts of one card. Large counts are organised into equal groups so we do not have to count every item again.\n\n**Each place is ten times the place to its right.**\nTen ones make a ten. Ten tens make a hundred. Ten hundreds make a thousand. Ten thousands make a ten thousand. Picture bundling ten small groups into one larger group. The written places record how many of each group there are.\n\n**Keep the range in view.**\nToday we read whole numbers up to 10,000. A new place appears when every lower place reaches nine and one more unit is added. This is a change in grouping, not a new kind of number.\n\nStart at the ones place on the right. Name each column before reading its digit; a digit’s shape alone does not tell its value.",
      "example": "I DO:\n4,518 has 8 ones at the right. The next column records tens, then hundreds, then thousands. I use columns instead of counting 4,518 individual cards.\n\nYOU TRY:\nHow many tens make one hundred? Use equal bundles before checking.\n\nCHECK:\nTen tens make one hundred because ten groups of ten contain a hundred units. It is not one ten with a different name.",
      "notice": "Read from the right to identify places, then from the left to say the whole number.",
      "check": {
        "question": "What happens when ten hundreds are grouped together?",
        "options": [
          "They become ten ones",
          "They become one thousand",
          "They become one hundred",
          "They disappear from the count"
        ],
        "correct_index": 1,
        "explanation": "Ten groups of one hundred contain one thousand units. Regrouping changes the grouping, not the total."
      },
      "visual": [
        {
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 450 190\"><rect width=\"450\" height=\"190\" fill=\"#f5faf7\"/><rect x=\"0.0\" y=\"10\" width=\"112.5\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"56.25\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Thousands</text><text x=\"56.25\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">4</text><text x=\"56.25\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">4,000</text><rect x=\"112.5\" y=\"10\" width=\"112.5\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"168.75\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Hundreds</text><text x=\"168.75\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">5</text><text x=\"168.75\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">500</text><rect x=\"225.0\" y=\"10\" width=\"112.5\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"281.25\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Tens</text><text x=\"281.25\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">1</text><text x=\"281.25\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">10</text><rect x=\"337.5\" y=\"10\" width=\"112.5\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"393.75\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Ones</text><text x=\"393.75\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">8</text><text x=\"393.75\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">8</text></svg>",
          "alt": "A place-value chart for 4,518. Thousands: digit 4, value 4,000, Hundreds: digit 5, value 500, Tens: digit 1, value 10, Ones: digit 8, value 8.",
          "caption": "A digit’s column gives its value."
        }
      ]
    },
    {
      "icon": "📖",
      "title": "Read the digits through their places",
      "explain": "**Digit and value are different.**\nA digit is a written symbol from zero to nine. Its value depends on the place. A four in the hundreds column means four hundreds; in the ones column it means four ones.\n\n**Read a useful chunk.**\nIn 4,518, separate the thousands part from the final three digits. Read the thousands part, then the hundreds, tens and ones that follow. A space or comma can help group digits; it does not mean a decimal point.\n\n**Say the number in words.**\nOur model is “four thousand five hundred and eighteen”. Say the number, point to each matching part and check that you did not turn a digit into the wrong-sized group.\n\nThe same method works with fewer or more non-zero places. The number of digits gives a starting clue, but the position of each digit settles its value.",
      "example": "I DO:\n4,518 = 4,000 + 500 + 10 + 8.\nWords: four thousand five hundred and eighteen.\nI match each spoken group with its column, then read the whole count once.\n\nYOU TRY:\nRead 4,026 using the columns. Try before comparing.\n\nCHECK:\nIt is four thousand and twenty-six. The zero column contributes no groups of that size, but still holds its place.",
      "notice": "Do not read every digit as a separate number name when the task asks for the whole number.",
      "check": {
        "question": "Which words correctly read 4,518?",
        "options": [
          "four thousand six hundred and eighteen",
          "four thousand four hundred and eighteen",
          "four thousand five hundred and eighteen",
          "four thousand five hundred and twenty-eight"
        ],
        "correct_index": 2,
        "explanation": "Four thousand five hundred and eighteen matches the thousands part and the remaining hundreds, tens and ones. The other readings change a digit’s value."
      }
    },
    {
      "icon": "📖",
      "title": "Keep zero as a place holder",
      "explain": "**Zero can hold an empty column.**\nIt says there are no groups of that size. It is still important because it keeps the other digits in their intended places. Deleting an internal zero shifts later digits and changes the value.\n\n**Compare two readings.**\nRead 4,026 in the chart. Identify the zero column before saying the complete number. It does not make the entire count zero. It only marks an empty place within the count.\n\n**Write from words with the same care.**\nWrite the needed place columns first. Fill each stated group, then use zero for a column with no group. Check the result by reading it back. This is safer than writing only the non-zero digits you hear.\n\nWhen using expanded form, you can omit a zero term because it adds nothing. When writing the numeral, preserve the column itself.",
      "example": "I DO:\n4,026 = 4,000 + 20 + 6.\nI preserve its zero column in the numeral. Omitting a zero term from the sum does not allow me to omit the place from the numeral.\n\nYOU TRY:\nWrite “four thousand and twenty-six” from its place groups, then read your result back.\n\nCHECK:\nThe numeral is 4,026. Compare every column, not just the digits you pronounced.",
      "notice": "A place holder is part of the numeral’s structure. Empty is not the same as missing.",
      "check": {
        "question": "Why keep an internal zero when writing a whole number?",
        "options": [
          "It makes all other digits worthless",
          "It means the whole count is zero",
          "It is only decoration",
          "It preserves the positions of the other digits"
        ],
        "correct_index": 3,
        "explanation": "The zero marks an empty place and keeps later digits in their intended columns. Removing it changes those positions."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Read and count whole numbers in action",
            "transcript": "Pip: I am practising how to keep zero as a place holder. I need to track the value, not just copy digits.\nJuno: Zero can hold an empty column.\nIt says there are no groups of that size. It is still important because it keeps the other digits in their intended places. Deleting an internal zero shifts later digits and changes the value.\nPip: 4,026 = 4,000 + 20 + 6.\nI preserve its zero column in the numeral. Omitting a zero term from the sum does not allow me to omit the place from the numeral.\nJuno: Pause and try a fresh example with the same check. Explain what stays unchanged or which value relationship settles the result.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "I am practising how to keep zero as a place holder. I need to track the value, not just copy digits."
                  },
                  {
                    "who": "juno",
                    "text": "Zero can hold an empty column.\nIt says there are no groups of that size. It is still important because it keeps the other digits in their intended places. Deleting an internal zero shifts later digits and changes the value."
                  },
                  {
                    "who": "pip",
                    "text": "4,026 = 4,000 + 20 + 6.\nI preserve its zero column in the numeral. Omitting a zero term from the sum does not allow me to omit the place from the numeral."
                  },
                  {
                    "who": "juno",
                    "text": "Pause and try a fresh example with the same check. Explain what stays unchanged or which value relationship settles the result.",
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
      "title": "Cross a counting boundary and check",
      "explain": "**One more can change several digits.**\nWhen the ones reach nine, the next unit completes a ten. When every lower column reaches nine, the next unit completes the next larger group. Think about bundling rather than simply putting an extra digit at the end.\n\n**Use a known boundary.**\nAfter 9,999 comes 10,000. The lower nines regroup into one new leading unit. The zeroes show that no leftover smaller groups remain. The count increases by one, not by a whole extra set of unrelated digits.\n\n**Check in both directions.**\nCount one forward and one back. If the previous number returns, the step fits. Explain the changed groups so you know why the written change happened.\n\nWhen a task asks you to count, check its step size too. Counting by one and counting by ten are different jobs; do not silently change the step.",
      "example": "I DO:\n9,998, 9,999, 10,000.\nI bundle the completed lower groups. Backwards: 10,000, 9,999, 9,998.\n\nYOU TRY:\nWhat is one more than 4,518? Which column changes?\n\nCHECK:\nIt is 4,519. Only the final ones digit changes here because no lower group is completed. A boundary can change more columns, but not every counting step does.",
      "notice": "Count the units and explain regrouping. Attaching a zero would multiply a number by ten, not add one.",
      "check": {
        "question": "What comes immediately after 9,999 when counting by one?",
        "options": [
          "10,000",
          "10,009",
          "9,998",
          "100,000"
        ],
        "correct_index": 0,
        "explanation": "10,000 is one greater than 9,999; the completed lower groups regroup into the next place."
      }
    }
  ],
  "worked_example": "I DO: Complete a connected read and count whole numbers record.\nTarget numeral: 4,518. Words: four thousand five hundred and eighteen.\nStandard partition: 4,000 + 500 + 10 + 8.\nHundreds digit: 5; value: 500.\nAnother partition: 4,418 + 100 = 4,518.\nComparison: 4,518 > 4,026. I compare matching places from the left; the first unequal place decides. The difference is 492.\nAscending set: 4,026, 4,518, 4,618.\n\nWHY THE REPRESENTATIONS AGREE\nThe written numeral, words and expanded sum describe the same place groups. The non-standard partition also returns the same total. Comparing uses those group values, not only the shape of a single digit.\n\nCOMMON MISTAKE AND FIX\nWriting the hundreds digit’s value as 5 loses its unit size. I change the value label to 500. Another possible error is deleting the zero in 4,026; I keep its column and reread the whole count.\n\nCHECK\nI rebuild the numeral from its non-zero terms and read the comparison in both directions. If a check disagrees, I revisit the relevant column before changing unrelated digits.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 450 190\"><rect width=\"450\" height=\"190\" fill=\"#f5faf7\"/><rect x=\"0.0\" y=\"10\" width=\"112.5\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"56.25\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Thousands</text><text x=\"56.25\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">4</text><text x=\"56.25\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">4,000</text><rect x=\"112.5\" y=\"10\" width=\"112.5\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"168.75\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Hundreds</text><text x=\"168.75\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">0</text><text x=\"168.75\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">0</text><rect x=\"225.0\" y=\"10\" width=\"112.5\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"281.25\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Tens</text><text x=\"281.25\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">2</text><text x=\"281.25\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">20</text><rect x=\"337.5\" y=\"10\" width=\"112.5\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"393.75\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Ones</text><text x=\"393.75\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">6</text><text x=\"393.75\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">6</text></svg>",
      "alt": "A place-value chart for 4,026. Thousands: digit 4, value 4,000, Hundreds: digit 0, value 0, Tens: digit 2, value 20, Ones: digit 6, value 6.",
      "caption": "A digit’s column gives its value."
    }
  ],
  "guided_practice": "WE DO: Prepare a second record using 4,026.\n1. Label the columns and insert the digits. Read it before comparing with “four thousand and twenty-six”.\n2. Find the hundreds digit and its contribution. Compare after your attempt: 0.\n3. Partition it. Check against 4,000 + 20 + 6, then add those terms back.\n4. Compare 4,026 with 4,518; name the first unequal place rather than choosing by the final digit.\n5. Make one different partition by setting aside a hundred. Check: 3,926 + 100.\n6. Explain one check you used. If you made an error, repair only the mismatched place and read the result again.\nYou can draw the chart or describe it in text. The explanation matters more than decorative layout.",
  "independent_task": "YOU DO: Read and count whole numbers record (about 20 minutes).\nUse these numbers: 4,721; 4,136; 4,506; 4,006.\n1. Say what each part of the task asks before answering: numeral, words, place value, partition or order.\n2. Write each numeral in words and give the next two counts by one. Explain what happens at the range boundary.\n3. Show working for at least two decisions with a labelled chart, equation or comparison reason.\n4. Check those decisions by rebuilding a total, reading words back or comparing neighbouring values.\n5. Explain one improvement or one check that confirmed a correct answer.\nWork on paper or in the big box. If using paper, type the answers and a clear working summary. Check: correct range and places; zeroes preserved; complete requested representations; a specific reason and a check. An upload is optional.",
  "response_prompt": "Which place-group or representation check helped most in your read and count whole numbers record?",
  "quiz": [
    {
      "question": "What happens when ten hundreds are grouped together?",
      "options": [
        "They become ten ones",
        "They become one thousand",
        "They become one hundred",
        "They disappear from the count"
      ],
      "correct_index": 1,
      "explanation": "Ten groups of one hundred contain one thousand units. Regrouping changes the grouping, not the total.",
      "type": "multiple_choice"
    },
    {
      "question": "Which words correctly read 4,518?",
      "options": [
        "four thousand six hundred and eighteen",
        "four thousand four hundred and eighteen",
        "four thousand five hundred and eighteen",
        "four thousand five hundred and twenty-eight"
      ],
      "correct_index": 2,
      "explanation": "Four thousand five hundred and eighteen matches the thousands part and the remaining hundreds, tens and ones. The other readings change a digit’s value.",
      "type": "multiple_choice"
    },
    {
      "question": "Why keep an internal zero when writing a whole number?",
      "options": [
        "It makes all other digits worthless",
        "It means the whole count is zero",
        "It is only decoration",
        "It preserves the positions of the other digits"
      ],
      "correct_index": 3,
      "explanation": "The zero marks an empty place and keeps later digits in their intended columns. Removing it changes those positions.",
      "type": "multiple_choice"
    },
    {
      "question": "What comes immediately after 9,999 when counting by one?",
      "options": [
        "10,000",
        "10,009",
        "9,998",
        "100,000"
      ],
      "correct_index": 0,
      "explanation": "10,000 is one greater than 9,999; the completed lower groups regroup into the next place.",
      "type": "multiple_choice"
    },
    {
      "type": "multiple_choice",
      "question": "What is one more than 4,518?",
      "options": [
        "4528",
        "4519",
        "4618",
        "4517"
      ],
      "correct_index": 1,
      "explanation": "Counting by one adds exactly one unit."
    },
    {
      "type": "multiple_choice",
      "question": "What is 4,418 + 100?",
      "options": [
        "4428",
        "4618",
        "4518",
        "4418"
      ],
      "correct_index": 2,
      "explanation": "The two parts rebuild the original total."
    },
    {
      "type": "multiple_choice",
      "question": "What is the value of the tens digit in 4,518?",
      "options": [
        "10",
        "1",
        "100",
        "1000"
      ],
      "correct_index": 0,
      "explanation": "The tens place counts groups of ten."
    },
    {
      "question": "Which list is ascending?",
      "options": [
        "4,618, 4,518, 4,026",
        "4,518, 4,026, 4,618",
        "4,026, 4,618, 4,518",
        "4,026, 4,518, 4,618"
      ],
      "correct_index": 3,
      "explanation": "The values increase from least to greatest; every neighbouring pair is in the correct direction.",
      "type": "multiple_choice"
    },
    {
      "type": "short_answer",
      "question": "Write a different two-part partition of 4,518 and check it.",
      "sample_answer": "4,418 + 100 = 4,518. The parts add back to the target.",
      "marking_guide": "Accept any correct non-standard two-part partition with a total check.",
      "explanation": "The partition must preserve the whole value."
    },
    {
      "type": "short_answer",
      "question": "Explain why 4,518 is greater than 4,026.",
      "sample_answer": "Compare matching columns from the left. The first unequal place has a larger value in the first numeral.",
      "marking_guide": "Accept the actual first unequal place or a correct positive-difference reason.",
      "explanation": "A value relationship supports the comparison, rather than the final digit alone."
    }
  ],
  "parent_notes": "Parent: Teaches read and count whole numbers to 10,000, with explicit digit/value and zero-place distinctions. Original content follows the repository’s topic sequence. Exact outcome codes are empty pending verified mapping; this is not a claim of complete syllabus coverage.\n\nParent: Look for the requested representation and the reasoning behind it, not speed. Standard and flexible partitions both preserve value. The lesson itself supplies the teaching and feedback. Your role is access support and reviewing the evidence.\n\nParent: Task models: 4,721: four thousand seven hundred and twenty-one; 4,000 + 700 + 20 + 1; next 4,722, 4,723; 4,136: four thousand one hundred and thirty-six; 4,000 + 100 + 30 + 6; next 4,137, 4,138; 4,506: four thousand five hundred and six; 4,000 + 500 + 6; next 4,507, 4,508; 4,006: four thousand and six; 4,000 + 6; next 4,007, 4,008. Ascending order: 4,006, 4,136, 4,506, 4,721. Accept other correct partitions and specific checks.\n\nParent: Eight scored choices use the unchanged 90% threshold, requiring 8/8. Two written responses are manually reviewed. Models: 4,418 + 100 = 4,518. The parts add back to the target. Compare matching columns from the left. The first unequal place has a larger value in the first numeral.",
  "evidence_instructions": "Keep the read and count whole numbers answers, two worked decisions, checking note, reflection and written quiz responses.",
  "offline_alternative": "Copy the four task numbers and draw place columns on paper. Complete the read and count whole numbers record and check it, then type your evidence later.",
  "extension": "Choose a new number below 10,000. Represent it in words and two partitions, then explain how it compares with 4,518.",
  "stage_hints": {
    "accept": [
      "Read the mission about read and count whole numbers.",
      "You will practise read and count whole numbers through models before making your own response.",
      "Begin with the first explanation of read and count whole numbers; the examples remain available while you work."
    ],
    "teach0": [
      "Look back at equal bundles making the next larger unit.",
      "Name the unit in each column before reading its digit.",
      "Start at ones, then use each tenfold grouping to name the next place."
    ],
    "teach1": [
      "Look at how the thousands chunk and final digits are read.",
      "Point to the matching place while saying each number-word part.",
      "Read the large group first, then the remaining hundreds, tens and ones; match the result back to the chart."
    ],
    "teach2": [
      "Find the empty column in the model numeral.",
      "Keep every place position, even when it contributes no groups.",
      "Write the columns first, fill stated groups and put a zero in an empty column before reading back."
    ],
    "teach3": [
      "Look at the count just before the new leading place.",
      "Track which lower groups become complete when one unit is added.",
      "Regroup the completed groups, write the leftover zeroes and count one back to check."
    ],
    "learn": [
      "Read the numeral and expanded form together.",
      "Match each part of the sum to its place column.",
      "Rebuild the same total, then use matching place values to check the comparison."
    ],
    "guided": [
      "Begin by labelling the second numeral’s columns.",
      "Complete one representation before comparing it with the suggestion.",
      "Read the words back into a chart and check that every digit returns to its intended place."
    ],
    "write": [
      "Start by copying the first task numeral accurately.",
      "Begin “This numeral has ____ groups of ____.”",
      "A partial record begins “For my first number, the largest place is ____. I checked it by ____.” Add your own values and working."
    ],
    "quiz": [
      "Return to the step for the representation named in the question.",
      "Distinguish a face digit, a value, a partition and an order statement.",
      "Use the matching column or total check before selecting an option; explain the value relationship for a written response."
    ],
    "submit": [
      "Check that your read and count whole numbers task and working are present.",
      "Include the read and count whole numbers reflection and any written reasoning you produced.",
      "Send your read and count whole numbers evidence for review; type a clear record if you used paper."
    ]
  }
}'), updated_at=datetime('now') WHERE seed_key='s2-mat-y3-w01-l1';

-- s2-mat-y3-w01-l2
UPDATE lessons SET title='Year 3: Explain place value and partitions', data=json_patch(data, '{
  "seed_key": "s2-mat-y3-w01-l2",
  "title": "Year 3: Explain place value and partitions",
  "stage": "S2",
  "learning_area": "Mathematics",
  "year_level": "Year 3",
  "week": 1,
  "lesson_number": 2,
  "duration_minutes": 60,
  "child_mission": "Become a Number Investigator! Use place groups to solve explain place value and partitions tasks and explain how you checked.",
  "learning_intention": "We are learning to explain place value and partitions within the range to 10,000.",
  "success_criteria": [
    "I can read a numeral through its place groups.",
    "I can match a digit to its value.",
    "I can show a correct partition or comparison.",
    "I can check an answer and explain my reason."
  ],
  "materials": [
    "Everything you need to read is included in this lesson",
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
  "spelling_focus": null,
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
      "title": "Locate a digit before naming its value",
      "explain": "**A place is a position in the numeral.**\nStart with ones on the right, then tens, hundreds, thousands and ten thousands as needed. Moving left makes the unit ten times as large. You can label a chart before inserting digits.\n\n**A face digit does not state its value.**\nThe written five always looks like five, but can mean five ones, five tens or five hundreds. Multiply the digit by the place unit, or say that many groups of the unit.\n\n**Apply it to 4,518.**\nThe hundreds digit is 5. Its value is 500. The ones digit is 8; its value is 8. Those are counts of different-sized units.\n\nPoint to the column, name the unit, then give the value. That order prevents an answer based only on the shape of the digit.",
      "example": "I DO:\n4,518: hundreds column → digit 5 → 5 hundreds → value 500.\n\nYOU TRY:\nFind the tens digit and its value before checking.\n\nCHECK:\nThe tens digit is 1, so it contributes 10. The digit and its value need different labels.",
      "notice": "A digit answer and a value answer can look different. Read what the question asks.",
      "check": {
        "question": "What is the value of the hundreds digit in 4,518?",
        "options": [
          "5",
          "500",
          "50",
          "5000"
        ],
        "correct_index": 1,
        "explanation": "The digit is in the hundreds column, so its value is that many hundreds."
      },
      "visual": [
        {
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 450 190\"><rect width=\"450\" height=\"190\" fill=\"#f5faf7\"/><rect x=\"0.0\" y=\"10\" width=\"112.5\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"56.25\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Thousands</text><text x=\"56.25\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">4</text><text x=\"56.25\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">4,000</text><rect x=\"112.5\" y=\"10\" width=\"112.5\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"168.75\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Hundreds</text><text x=\"168.75\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">5</text><text x=\"168.75\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">500</text><rect x=\"225.0\" y=\"10\" width=\"112.5\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"281.25\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Tens</text><text x=\"281.25\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">1</text><text x=\"281.25\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">10</text><rect x=\"337.5\" y=\"10\" width=\"112.5\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"393.75\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Ones</text><text x=\"393.75\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">8</text><text x=\"393.75\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">8</text></svg>",
          "alt": "A place-value chart for 4,518. Thousands: digit 4, value 4,000, Hundreds: digit 5, value 500, Tens: digit 1, value 10, Ones: digit 8, value 8.",
          "caption": "A digit’s column gives its value."
        }
      ]
    },
    {
      "icon": "📖",
      "title": "Partition without changing the total",
      "explain": "**Partition means split a whole into parts.**\nIn standard expanded form, split a numeral into the value contributed by each non-zero place. Add those contributions to reconstruct the same total.\n\n**Match each term to a column.**\nA term such as five hundred describes the value of a digit in the hundreds place. Writing five instead would lose the unit size. Use addition signs because the parts combine into one total.\n\n**Show the full model.**\n4,518 = 4,000 + 500 + 10 + 8. Read each part, then check the sum. You have represented the same number another way, not made a smaller number.\n\nZero-valued terms can be left out of the addition, but do not shift other digits in the numeral. Keep those two representations distinct.",
      "example": "I DO:\nI split 4,518 into its non-zero place values: 4,000 + 500 + 10 + 8.\nI put each part back into a chart and recover 4,518.\n\nYOU TRY:\nPartition 4,026. Include the value of every non-zero digit.\n\nCHECK:\n4,000 + 20 + 6 adds to 4,026. A zero place contributes nothing to this sum but remains in the numeral.",
      "notice": "An expanded term includes its unit value. Listing the face digits alone is not standard expanded form.",
      "check": {
        "question": "What must a standard expanded-form term show?",
        "options": [
          "Only the face digit with no place value",
          "The number of letters in the word",
          "The value contributed by its place",
          "A new unrelated count"
        ],
        "correct_index": 2,
        "explanation": "A standard expanded term gives the contribution of a place, so the terms add back to the original number."
      }
    },
    {
      "icon": "📖",
      "title": "Regroup the parts flexibly",
      "explain": "**The same total can have different partitions.**\nYou can exchange one hundred for ten tens or one thousand for ten hundreds. An exchange preserves the total because the groups have equal value. This can help with later calculation.\n\n**Show both sides of the exchange.**\nReducing a larger group requires adding the equivalent smaller groups. Removing a hundred without adding ten tens would reduce the total. Use an equality to record the unchanged count.\n\n**Try a non-standard partition.**\n4,518 = 4,418 + 100. It is also 3,518 + 1,000. These differ from standard expanded form but still make the same whole. Check by addition rather than judging the length of the expression.\n\nA correct partition has parts that add to the target. It does not need a particular number of terms unless the question requests one.",
      "example": "I DO:\nI take one hundred from 4,518: 4,418 remains. I record the removed part too: 4,418 + 100 = 4,518.\nIf I write only 4,418, I have lost a hundred rather than repartitioned.\n\nYOU TRY:\nUse 4,508 as the first part of a partition of 4,518. What second part preserves the total?\n\nCHECK:\nAdd ten. The two parts then sum to 4,518.",
      "notice": "An exchange changes grouping, not the total. Always check what was removed and what was added.",
      "check": {
        "question": "What should remain unchanged when regrouping a number?",
        "options": [
          "Every face digit in every representation",
          "The number of written terms",
          "The size of all groups",
          "The total value"
        ],
        "correct_index": 3,
        "explanation": "Regrouping exchanges equal values, so the total is unchanged even if the grouping or written digits change."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Explain place value and partitions in action",
            "transcript": "Pip: I am practising how to regroup the parts flexibly. I need to track the value, not just copy digits.\nJuno: The same total can have different partitions.\nYou can exchange one hundred for ten tens or one thousand for ten hundreds. An exchange preserves the total because the groups have equal value. This can help with later calculation.\nPip: I take one hundred from 4,518: 4,418 remains. I record the removed part too: 4,418 + 100 = 4,518.\nIf I write only 4,418, I have lost a hundred rather than repartitioned.\nJuno: Pause and try a fresh example with the same check. Explain what stays unchanged or which value relationship settles the result.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "I am practising how to regroup the parts flexibly. I need to track the value, not just copy digits."
                  },
                  {
                    "who": "juno",
                    "text": "The same total can have different partitions.\nYou can exchange one hundred for ten tens or one thousand for ten hundreds. An exchange preserves the total because the groups have equal value. This can help with later calculation."
                  },
                  {
                    "who": "pip",
                    "text": "I take one hundred from 4,518: 4,418 remains. I record the removed part too: 4,418 + 100 = 4,518.\nIf I write only 4,418, I have lost a hundred rather than repartitioned."
                  },
                  {
                    "who": "juno",
                    "text": "Pause and try a fresh example with the same check. Explain what stays unchanged or which value relationship settles the result.",
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
      "title": "Use place value to explain a change",
      "explain": "**Changing one group changes a known amount.**\nAdding a hundred adds one group of one hundred; adding a ten adds one group of ten. Read the unit in the question before changing a digit.\n\n**Check whether regrouping is needed.**\nIf a column already has nine groups, adding another completes a larger group. If it has room for another group, only that column changes. Explain the value change rather than guessing a new digit.\n\n**Verify with a difference.**\nSubtract the original count from your proposed count, or count back the added group. The difference should match the intended amount. A new numeral can look plausible and still show the wrong-sized change.\n\nDraw a chart or write a partition when you need support. The purpose is a clear value explanation, not the fastest possible mental answer.",
      "example": "I DO:\n4,518 + 100 = 4,618. I added one hundred, not one unit.\nCheck: 4,618 - 4,518 = 100.\n\nYOU TRY:\nAdd ten to 4,518, then say what group you added.\n\nCHECK:\nThe result is 4,528. It is one ten greater. The difference check confirms the intended size.",
      "notice": "Say the amount added. Do not confuse the place name with a one-unit counting step.",
      "check": {
        "question": "What is 4,518 plus one hundred?",
        "options": [
          "4618",
          "4519",
          "4528",
          "5518"
        ],
        "correct_index": 0,
        "explanation": "One hundred changes the total by exactly one hundred, not by a one-unit or one-thousand step."
      }
    }
  ],
  "worked_example": "I DO: Complete a connected explain place value and partitions record.\nTarget numeral: 4,518. Words: four thousand five hundred and eighteen.\nStandard partition: 4,000 + 500 + 10 + 8.\nHundreds digit: 5; value: 500.\nAnother partition: 4,418 + 100 = 4,518.\nComparison: 4,518 > 4,026. I compare matching places from the left; the first unequal place decides. The difference is 492.\nAscending set: 4,026, 4,518, 4,618.\n\nWHY THE REPRESENTATIONS AGREE\nThe written numeral, words and expanded sum describe the same place groups. The non-standard partition also returns the same total. Comparing uses those group values, not only the shape of a single digit.\n\nCOMMON MISTAKE AND FIX\nWriting the hundreds digit’s value as 5 loses its unit size. I change the value label to 500. Another possible error is deleting the zero in 4,026; I keep its column and reread the whole count.\n\nCHECK\nI rebuild the numeral from its non-zero terms and read the comparison in both directions. If a check disagrees, I revisit the relevant column before changing unrelated digits.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 450 190\"><rect width=\"450\" height=\"190\" fill=\"#f5faf7\"/><rect x=\"0.0\" y=\"10\" width=\"112.5\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"56.25\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Thousands</text><text x=\"56.25\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">4</text><text x=\"56.25\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">4,000</text><rect x=\"112.5\" y=\"10\" width=\"112.5\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"168.75\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Hundreds</text><text x=\"168.75\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">0</text><text x=\"168.75\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">0</text><rect x=\"225.0\" y=\"10\" width=\"112.5\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"281.25\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Tens</text><text x=\"281.25\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">2</text><text x=\"281.25\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">20</text><rect x=\"337.5\" y=\"10\" width=\"112.5\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"393.75\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Ones</text><text x=\"393.75\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">6</text><text x=\"393.75\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">6</text></svg>",
      "alt": "A place-value chart for 4,026. Thousands: digit 4, value 4,000, Hundreds: digit 0, value 0, Tens: digit 2, value 20, Ones: digit 6, value 6.",
      "caption": "A digit’s column gives its value."
    }
  ],
  "guided_practice": "WE DO: Prepare a second record using 4,026.\n1. Label the columns and insert the digits. Read it before comparing with “four thousand and twenty-six”.\n2. Find the hundreds digit and its contribution. Compare after your attempt: 0.\n3. Partition it. Check against 4,000 + 20 + 6, then add those terms back.\n4. Compare 4,026 with 4,518; name the first unequal place rather than choosing by the final digit.\n5. Make one different partition by setting aside a hundred. Check: 3,926 + 100.\n6. Explain one check you used. If you made an error, repair only the mismatched place and read the result again.\nYou can draw the chart or describe it in text. The explanation matters more than decorative layout.",
  "independent_task": "YOU DO: Explain place value and partitions record (about 20 minutes).\nUse these numbers: 4,721; 4,136; 4,506; 4,006.\n1. Say what each part of the task asks before answering: numeral, words, place value, partition or order.\n2. Give standard expanded form for each numeral, then make a different two-part partition for two of them. Label a digit and its value.\n3. Show working for at least two decisions with a labelled chart, equation or comparison reason.\n4. Check those decisions by rebuilding a total, reading words back or comparing neighbouring values.\n5. Explain one improvement or one check that confirmed a correct answer.\nWork on paper or in the big box. If using paper, type the answers and a clear working summary. Check: correct range and places; zeroes preserved; complete requested representations; a specific reason and a check. An upload is optional.",
  "response_prompt": "Which place-group or representation check helped most in your explain place value and partitions record?",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "What is the value of the hundreds digit in 4,518?",
      "options": [
        "5",
        "500",
        "50",
        "5000"
      ],
      "correct_index": 1,
      "explanation": "The digit is in the hundreds column, so its value is that many hundreds."
    },
    {
      "question": "What must a standard expanded-form term show?",
      "options": [
        "Only the face digit with no place value",
        "The number of letters in the word",
        "The value contributed by its place",
        "A new unrelated count"
      ],
      "correct_index": 2,
      "explanation": "A standard expanded term gives the contribution of a place, so the terms add back to the original number.",
      "type": "multiple_choice"
    },
    {
      "question": "What should remain unchanged when regrouping a number?",
      "options": [
        "Every face digit in every representation",
        "The number of written terms",
        "The size of all groups",
        "The total value"
      ],
      "correct_index": 3,
      "explanation": "Regrouping exchanges equal values, so the total is unchanged even if the grouping or written digits change.",
      "type": "multiple_choice"
    },
    {
      "type": "multiple_choice",
      "question": "What is 4,518 plus one hundred?",
      "options": [
        "4618",
        "4519",
        "4528",
        "5518"
      ],
      "correct_index": 0,
      "explanation": "One hundred changes the total by exactly one hundred, not by a one-unit or one-thousand step."
    },
    {
      "type": "multiple_choice",
      "question": "What is one more than 4,518?",
      "options": [
        "4528",
        "4519",
        "4618",
        "4517"
      ],
      "correct_index": 1,
      "explanation": "Counting by one adds exactly one unit."
    },
    {
      "type": "multiple_choice",
      "question": "What is 4,418 + 100?",
      "options": [
        "4428",
        "4618",
        "4518",
        "4418"
      ],
      "correct_index": 2,
      "explanation": "The two parts rebuild the original total."
    },
    {
      "type": "multiple_choice",
      "question": "What is the value of the tens digit in 4,518?",
      "options": [
        "10",
        "1",
        "100",
        "1000"
      ],
      "correct_index": 0,
      "explanation": "The tens place counts groups of ten."
    },
    {
      "question": "Which list is ascending?",
      "options": [
        "4,618, 4,518, 4,026",
        "4,518, 4,026, 4,618",
        "4,026, 4,618, 4,518",
        "4,026, 4,518, 4,618"
      ],
      "correct_index": 3,
      "explanation": "The values increase from least to greatest; every neighbouring pair is in the correct direction.",
      "type": "multiple_choice"
    },
    {
      "type": "short_answer",
      "question": "Write a different two-part partition of 4,518 and check it.",
      "sample_answer": "4,418 + 100 = 4,518. The parts add back to the target.",
      "marking_guide": "Accept any correct non-standard two-part partition with a total check.",
      "explanation": "The partition must preserve the whole value."
    },
    {
      "type": "short_answer",
      "question": "Explain why 4,518 is greater than 4,026.",
      "sample_answer": "Compare matching columns from the left. The first unequal place has a larger value in the first numeral.",
      "marking_guide": "Accept the actual first unequal place or a correct positive-difference reason.",
      "explanation": "A value relationship supports the comparison, rather than the final digit alone."
    }
  ],
  "parent_notes": "Parent: Teaches explain place value and partitions to 10,000, with explicit digit/value and zero-place distinctions. Original content follows the repository’s topic sequence. Exact outcome codes are empty pending verified mapping; this is not a claim of complete syllabus coverage.\n\nParent: Look for the requested representation and the reasoning behind it, not speed. Standard and flexible partitions both preserve value. The lesson itself supplies the teaching and feedback. Your role is access support and reviewing the evidence.\n\nParent: Task models: 4,721: four thousand seven hundred and twenty-one; 4,000 + 700 + 20 + 1; next 4,722, 4,723; 4,136: four thousand one hundred and thirty-six; 4,000 + 100 + 30 + 6; next 4,137, 4,138; 4,506: four thousand five hundred and six; 4,000 + 500 + 6; next 4,507, 4,508; 4,006: four thousand and six; 4,000 + 6; next 4,007, 4,008. Ascending order: 4,006, 4,136, 4,506, 4,721. Accept other correct partitions and specific checks.\n\nParent: Eight scored choices use the unchanged 90% threshold, requiring 8/8. Two written responses are manually reviewed. Models: 4,418 + 100 = 4,518. The parts add back to the target. Compare matching columns from the left. The first unequal place has a larger value in the first numeral.",
  "evidence_instructions": "Keep the explain place value and partitions answers, two worked decisions, checking note, reflection and written quiz responses.",
  "offline_alternative": "Copy the four task numbers and draw place columns on paper. Complete the explain place value and partitions record and check it, then type your evidence later.",
  "extension": "Choose a new number below 10,000. Represent it in words and two partitions, then explain how it compares with 4,518.",
  "stage_hints": {
    "accept": [
      "Read the mission about explain place value and partitions.",
      "You will practise explain place value and partitions through models before making your own response.",
      "Begin with the first explanation of explain place value and partitions; the examples remain available while you work."
    ],
    "teach0": [
      "Look at the column rather than only the digit shape.",
      "Name its unit, then count how many of that unit the digit represents.",
      "Record digit and value with different labels; multiply by the column unit for the value."
    ],
    "teach1": [
      "Look at each expanded term beside its place column.",
      "Write the value of each non-empty group instead of only its digit.",
      "Add the terms back and check that the original numeral returns."
    ],
    "teach2": [
      "Look at the model that sets aside a larger group.",
      "Keep a record of the removed value and the part remaining.",
      "Add both parts to test the unchanged total; do not drop a group from the record."
    ],
    "teach3": [
      "Look at whether the added quantity is a unit, ten or hundred.",
      "Identify the amount before changing the numeral.",
      "Add the specified group and count that same amount back to verify the original."
    ],
    "learn": [
      "Read the numeral and expanded form together.",
      "Match each part of the sum to its place column.",
      "Rebuild the same total, then use matching place values to check the comparison."
    ],
    "guided": [
      "Begin by labelling the second numeral’s columns.",
      "Complete one representation before comparing it with the suggestion.",
      "Read the words back into a chart and check that every digit returns to its intended place."
    ],
    "write": [
      "Start by copying the first task numeral accurately.",
      "Begin “This numeral has ____ groups of ____.”",
      "A partial record begins “For my first number, the largest place is ____. I checked it by ____.” Add your own values and working."
    ],
    "quiz": [
      "Return to the step for the representation named in the question.",
      "Distinguish a face digit, a value, a partition and an order statement.",
      "Use the matching column or total check before selecting an option; explain the value relationship for a written response."
    ],
    "submit": [
      "Check that your explain place value and partitions task and working are present.",
      "Include the explain place value and partitions reflection and any written reasoning you produced.",
      "Send your explain place value and partitions evidence for review; type a clear record if you used paper."
    ]
  }
}'), updated_at=datetime('now') WHERE seed_key='s2-mat-y3-w01-l2';

-- s2-mat-y3-w01-l3
UPDATE lessons SET title='Year 3: Compare and order whole numbers', data=json_patch(data, '{
  "seed_key": "s2-mat-y3-w01-l3",
  "title": "Year 3: Compare and order whole numbers",
  "stage": "S2",
  "learning_area": "Mathematics",
  "year_level": "Year 3",
  "week": 1,
  "lesson_number": 3,
  "duration_minutes": 60,
  "child_mission": "Become a Number Investigator! Use place groups to solve compare and order whole numbers tasks and explain how you checked.",
  "learning_intention": "We are learning to compare and order whole numbers within the range to 10,000.",
  "success_criteria": [
    "I can read a numeral through its place groups.",
    "I can match a digit to its value.",
    "I can show a correct partition or comparison.",
    "I can check an answer and explain my reason."
  ],
  "materials": [
    "Everything you need to read is included in this lesson",
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
  "spelling_focus": null,
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
      "title": "Compare equal-sized groups first",
      "explain": "**Comparison asks which whole is larger.**\nFor positive whole numbers, first check how many places are needed. A number with an additional leading non-zero place is larger. For equal-length numerals, compare their highest places first.\n\n**Find the first difference from the left.**\nIf the highest digits match, move one column right. Stop at the first unequal pair. That larger place outweighs all the lower places that follow.\n\n**Use the pair 4,518 and 4,026.**\nThe first unequal digits from the left determine the comparison. A larger final ones digit cannot overcome a smaller earlier thousands or hundreds digit. Think about group size, not just digit size.\n\nLine up matching columns. Leading zeroes do not create a larger positive value; the first non-zero place matters.",
      "example": "I DO:\nCompare 4,518 with 4,026. I line up the columns, move from the left and locate the first difference. 4,518 is greater.\n\nYOU TRY:\nCompare 4,517 and 4,518. Which first unequal column decides it?\n\nCHECK:\n4,518 is greater by one. Most leading places match, so the difference is near the right; begin from the left anyway.",
      "notice": "Compare the first unequal place, not whichever single digit catches your eye.",
      "check": {
        "question": "For equal-length positive whole numbers, where should comparison start?",
        "options": [
          "At whichever digit is brightest",
          "At the largest place on the left",
          "At the ones every time",
          "At the number of commas"
        ],
        "correct_index": 1,
        "explanation": "The largest place carries the greatest unit value. Compare it first, then move right only if it matches."
      },
      "visual": [
        {
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 450 190\"><rect width=\"450\" height=\"190\" fill=\"#f5faf7\"/><rect x=\"0.0\" y=\"10\" width=\"112.5\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"56.25\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Thousands</text><text x=\"56.25\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">4</text><text x=\"56.25\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">4,000</text><rect x=\"112.5\" y=\"10\" width=\"112.5\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"168.75\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Hundreds</text><text x=\"168.75\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">5</text><text x=\"168.75\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">500</text><rect x=\"225.0\" y=\"10\" width=\"112.5\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"281.25\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Tens</text><text x=\"281.25\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">1</text><text x=\"281.25\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">10</text><rect x=\"337.5\" y=\"10\" width=\"112.5\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"393.75\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Ones</text><text x=\"393.75\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">8</text><text x=\"393.75\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">8</text></svg>",
          "alt": "A place-value chart for 4,518. Thousands: digit 4, value 4,000, Hundreds: digit 5, value 500, Tens: digit 1, value 10, Ones: digit 8, value 8.",
          "caption": "A digit’s column gives its value."
        }
      ]
    },
    {
      "icon": "📖",
      "title": "Read comparison symbols as statements",
      "explain": "**The symbols record a relationship.**\nThe sign > means is greater than; < means is less than; = means is equal to. Read the whole statement aloud rather than remembering only a shape.\n\n**The open side faces the greater number.**\nThe pointed side faces the lesser number. This is a helpful shape check after deciding the actual values. Do not let the shape replace comparing the numbers.\n\n**Order of writing matters.**\nIf you swap the positions of unequal numbers, the sign changes direction. The underlying relationship remains the same. Equality is different: swapping equal values keeps equality true.\n\nExplain in words first if a sign is confusing. Then check that the symbol says the same thing.",
      "example": "I DO:\n4,518 > 4,026: four thousand five hundred and eighteen is greater than four thousand and twenty-six.\nReversed: 4,026 < 4,518.\n\nYOU TRY:\nWrite the two values in the opposite order and read your sign aloud.\n\nCHECK:\nThe reversed statement uses the opposite direction but still says that 4,518 is the larger value.",
      "notice": "A comparison statement should be true when read from left to right.",
      "check": {
        "question": "Which comparison is true?",
        "options": [
          "4,518 < 4,026",
          "4,518 = 4,026",
          "4,518 > 4,026",
          "4,026 > 4,518"
        ],
        "correct_index": 2,
        "explanation": "The first unequal place shows the first value is greater; the symbol must record that direction."
      }
    },
    {
      "icon": "📖",
      "title": "Order a set one position at a time",
      "explain": "**Ascending means least to greatest.**\nDescending means greatest to least. Read which direction the task requests before sorting a set. Sorting correctly in the wrong direction still answers a different question.\n\n**Find one end of the order first.**\nFor ascending order, choose the least value and set it aside. Compare the remaining values to choose the next. Repeating this method keeps the whole set organised.\n\n**Check neighbours when finished.**\nEvery value in an ascending list should be no greater than the next. Check the whole list, not only the first and last values. Repeated equal values can sit together.\n\nYou can use separate paper slips or a typed list. The method should work without an app doing the ordering for you.",
      "example": "I DO:\nSet: 4,618, 4,026, 4,518.\nAscending order: 4,026, 4,518, 4,618.\nI compare each neighbouring pair to check the order.\n\nYOU TRY:\nPut 4,519, 4,517, 4,518 in descending order.\n\nCHECK:\n4,519, 4,518, 4,517. The values become smaller at each step.",
      "notice": "Read ascending or descending first. A memorised sorting direction will not answer every task.",
      "check": {
        "question": "What does descending order mean?",
        "options": [
          "Least to greatest",
          "An order chosen at random",
          "Only even values",
          "Greatest to least"
        ],
        "correct_index": 3,
        "explanation": "Descending order moves from the greatest value down to the least. Ascending is the other direction."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Compare and order whole numbers in action",
            "transcript": "Pip: I am practising how to order a set one position at a time. I need to track the value, not just copy digits.\nJuno: Ascending means least to greatest.\nDescending means greatest to least. Read which direction the task requests before sorting a set. Sorting correctly in the wrong direction still answers a different question.\nPip: Set: 4,618, 4,026, 4,518.\nAscending order: 4,026, 4,518, 4,618.\nI compare each neighbouring pair to check the order.\nJuno: Pause and try a fresh example with the same check. Explain what stays unchanged or which value relationship settles the result.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "I am practising how to order a set one position at a time. I need to track the value, not just copy digits."
                  },
                  {
                    "who": "juno",
                    "text": "Ascending means least to greatest.\nDescending means greatest to least. Read which direction the task requests before sorting a set. Sorting correctly in the wrong direction still answers a different question."
                  },
                  {
                    "who": "pip",
                    "text": "Set: 4,618, 4,026, 4,518.\nAscending order: 4,026, 4,518, 4,618.\nI compare each neighbouring pair to check the order."
                  },
                  {
                    "who": "juno",
                    "text": "Pause and try a fresh example with the same check. Explain what stays unchanged or which value relationship settles the result.",
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
      "title": "Justify rather than only announce",
      "explain": "**A reason shows the comparison method.**\n“I know it is bigger” gives no evidence. Name the first unequal place and explain which value is larger there. A precise reason can help someone check your answer.\n\n**Keep digit and value labels clear.**\nA five in the hundreds place contributes five hundred, not five. Refer to hundreds or thousands when that is the deciding place. This explains why a lower ones digit cannot reverse the result.\n\n**Use a second check where helpful.**\nYou can calculate a difference or place the values on a number line. The larger value lies farther right. This check should support the place-value reasoning, not contradict it.\n\nChoose one short explanation that answers why. A long list of every digit is unnecessary when the first difference already settles the comparison.",
      "example": "I DO:\nFor 4,518 and 4,026, I point to the first unequal column and compare its unit values. Lower places cannot reverse that difference.\nCheck: 4,518 - 4,026 = 492, a positive difference.\n\nYOU TRY:\nExplain why 4,618 exceeds 4,518 using the amount between them.\n\nCHECK:\nIt is one hundred greater. That gives a specific value reason instead of only repeating greater.",
      "notice": "A justification needs a deciding detail or value relationship, not a repeated judgement.",
      "check": {
        "question": "Which is a useful comparison reason?",
        "options": [
          "Name the first unequal place and compare its values",
          "Choose the number with the most attractive digits",
          "Say bigger because it is bigger",
          "Compare only the final digit regardless of earlier places"
        ],
        "correct_index": 0,
        "explanation": "The first unequal place provides the decisive evidence for equal-length positive whole-number comparisons."
      }
    }
  ],
  "worked_example": "I DO: Complete a connected compare and order whole numbers record.\nTarget numeral: 4,518. Words: four thousand five hundred and eighteen.\nStandard partition: 4,000 + 500 + 10 + 8.\nHundreds digit: 5; value: 500.\nAnother partition: 4,418 + 100 = 4,518.\nComparison: 4,518 > 4,026. I compare matching places from the left; the first unequal place decides. The difference is 492.\nAscending set: 4,026, 4,518, 4,618.\n\nWHY THE REPRESENTATIONS AGREE\nThe written numeral, words and expanded sum describe the same place groups. The non-standard partition also returns the same total. Comparing uses those group values, not only the shape of a single digit.\n\nCOMMON MISTAKE AND FIX\nWriting the hundreds digit’s value as 5 loses its unit size. I change the value label to 500. Another possible error is deleting the zero in 4,026; I keep its column and reread the whole count.\n\nCHECK\nI rebuild the numeral from its non-zero terms and read the comparison in both directions. If a check disagrees, I revisit the relevant column before changing unrelated digits.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 450 190\"><rect width=\"450\" height=\"190\" fill=\"#f5faf7\"/><rect x=\"0.0\" y=\"10\" width=\"112.5\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"56.25\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Thousands</text><text x=\"56.25\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">4</text><text x=\"56.25\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">4,000</text><rect x=\"112.5\" y=\"10\" width=\"112.5\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"168.75\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Hundreds</text><text x=\"168.75\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">0</text><text x=\"168.75\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">0</text><rect x=\"225.0\" y=\"10\" width=\"112.5\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"281.25\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Tens</text><text x=\"281.25\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">2</text><text x=\"281.25\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">20</text><rect x=\"337.5\" y=\"10\" width=\"112.5\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"393.75\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Ones</text><text x=\"393.75\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">6</text><text x=\"393.75\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">6</text></svg>",
      "alt": "A place-value chart for 4,026. Thousands: digit 4, value 4,000, Hundreds: digit 0, value 0, Tens: digit 2, value 20, Ones: digit 6, value 6.",
      "caption": "A digit’s column gives its value."
    }
  ],
  "guided_practice": "WE DO: Prepare a second record using 4,026.\n1. Label the columns and insert the digits. Read it before comparing with “four thousand and twenty-six”.\n2. Find the hundreds digit and its contribution. Compare after your attempt: 0.\n3. Partition it. Check against 4,000 + 20 + 6, then add those terms back.\n4. Compare 4,026 with 4,518; name the first unequal place rather than choosing by the final digit.\n5. Make one different partition by setting aside a hundred. Check: 3,926 + 100.\n6. Explain one check you used. If you made an error, repair only the mismatched place and read the result again.\nYou can draw the chart or describe it in text. The explanation matters more than decorative layout.",
  "independent_task": "YOU DO: Compare and order whole numbers record (about 20 minutes).\nUse these numbers: 4,721; 4,136; 4,506; 4,006.\n1. Say what each part of the task asks before answering: numeral, words, place value, partition or order.\n2. Write an ascending and a descending list of the four values. Compare two pairs with symbols and explain the first unequal place.\n3. Show working for at least two decisions with a labelled chart, equation or comparison reason.\n4. Check those decisions by rebuilding a total, reading words back or comparing neighbouring values.\n5. Explain one improvement or one check that confirmed a correct answer.\nWork on paper or in the big box. If using paper, type the answers and a clear working summary. Check: correct range and places; zeroes preserved; complete requested representations; a specific reason and a check. An upload is optional.",
  "response_prompt": "Which place-group or representation check helped most in your compare and order whole numbers record?",
  "quiz": [
    {
      "question": "For equal-length positive whole numbers, where should comparison start?",
      "options": [
        "At whichever digit is brightest",
        "At the largest place on the left",
        "At the ones every time",
        "At the number of commas"
      ],
      "correct_index": 1,
      "explanation": "The largest place carries the greatest unit value. Compare it first, then move right only if it matches.",
      "type": "multiple_choice"
    },
    {
      "question": "Which comparison is true?",
      "options": [
        "4,518 < 4,026",
        "4,518 = 4,026",
        "4,518 > 4,026",
        "4,026 > 4,518"
      ],
      "correct_index": 2,
      "explanation": "The first unequal place shows the first value is greater; the symbol must record that direction.",
      "type": "multiple_choice"
    },
    {
      "question": "What does descending order mean?",
      "options": [
        "Least to greatest",
        "An order chosen at random",
        "Only even values",
        "Greatest to least"
      ],
      "correct_index": 3,
      "explanation": "Descending order moves from the greatest value down to the least. Ascending is the other direction.",
      "type": "multiple_choice"
    },
    {
      "question": "Which is a useful comparison reason?",
      "options": [
        "Name the first unequal place and compare its values",
        "Choose the number with the most attractive digits",
        "Say bigger because it is bigger",
        "Compare only the final digit regardless of earlier places"
      ],
      "correct_index": 0,
      "explanation": "The first unequal place provides the decisive evidence for equal-length positive whole-number comparisons.",
      "type": "multiple_choice"
    },
    {
      "type": "multiple_choice",
      "question": "What is one more than 4,518?",
      "options": [
        "4528",
        "4519",
        "4618",
        "4517"
      ],
      "correct_index": 1,
      "explanation": "Counting by one adds exactly one unit."
    },
    {
      "type": "multiple_choice",
      "question": "What is 4,418 + 100?",
      "options": [
        "4428",
        "4618",
        "4518",
        "4418"
      ],
      "correct_index": 2,
      "explanation": "The two parts rebuild the original total."
    },
    {
      "type": "multiple_choice",
      "question": "What is the value of the tens digit in 4,518?",
      "options": [
        "10",
        "1",
        "100",
        "1000"
      ],
      "correct_index": 0,
      "explanation": "The tens place counts groups of ten."
    },
    {
      "question": "Which list is ascending?",
      "options": [
        "4,618, 4,518, 4,026",
        "4,518, 4,026, 4,618",
        "4,026, 4,618, 4,518",
        "4,026, 4,518, 4,618"
      ],
      "correct_index": 3,
      "explanation": "The values increase from least to greatest; every neighbouring pair is in the correct direction.",
      "type": "multiple_choice"
    },
    {
      "type": "short_answer",
      "question": "Write a different two-part partition of 4,518 and check it.",
      "sample_answer": "4,418 + 100 = 4,518. The parts add back to the target.",
      "marking_guide": "Accept any correct non-standard two-part partition with a total check.",
      "explanation": "The partition must preserve the whole value."
    },
    {
      "type": "short_answer",
      "question": "Explain why 4,518 is greater than 4,026.",
      "sample_answer": "Compare matching columns from the left. The first unequal place has a larger value in the first numeral.",
      "marking_guide": "Accept the actual first unequal place or a correct positive-difference reason.",
      "explanation": "A value relationship supports the comparison, rather than the final digit alone."
    }
  ],
  "parent_notes": "Parent: Teaches compare and order whole numbers to 10,000, with explicit digit/value and zero-place distinctions. Original content follows the repository’s topic sequence. Exact outcome codes are empty pending verified mapping; this is not a claim of complete syllabus coverage.\n\nParent: Look for the requested representation and the reasoning behind it, not speed. Standard and flexible partitions both preserve value. The lesson itself supplies the teaching and feedback. Your role is access support and reviewing the evidence.\n\nParent: Task models: 4,721: four thousand seven hundred and twenty-one; 4,000 + 700 + 20 + 1; next 4,722, 4,723; 4,136: four thousand one hundred and thirty-six; 4,000 + 100 + 30 + 6; next 4,137, 4,138; 4,506: four thousand five hundred and six; 4,000 + 500 + 6; next 4,507, 4,508; 4,006: four thousand and six; 4,000 + 6; next 4,007, 4,008. Ascending order: 4,006, 4,136, 4,506, 4,721. Accept other correct partitions and specific checks.\n\nParent: Eight scored choices use the unchanged 90% threshold, requiring 8/8. Two written responses are manually reviewed. Models: 4,418 + 100 = 4,518. The parts add back to the target. Compare matching columns from the left. The first unequal place has a larger value in the first numeral.",
  "evidence_instructions": "Keep the compare and order whole numbers answers, two worked decisions, checking note, reflection and written quiz responses.",
  "offline_alternative": "Copy the four task numbers and draw place columns on paper. Complete the compare and order whole numbers record and check it, then type your evidence later.",
  "extension": "Choose a new number below 10,000. Represent it in words and two partitions, then explain how it compares with 4,518.",
  "stage_hints": {
    "accept": [
      "Read the mission about compare and order whole numbers.",
      "You will practise compare and order whole numbers through models before making your own response.",
      "Begin with the first explanation of compare and order whole numbers; the examples remain available while you work."
    ],
    "teach0": [
      "Look at the first unequal place from the left.",
      "Line up matching places and move right only while they match.",
      "Compare the two group values at the first difference; later smaller places cannot reverse it."
    ],
    "teach1": [
      "Read the model comparison aloud from left to right.",
      "Decide the greater value before choosing the sign direction.",
      "Keep the open side beside the greater value and read the reversed statement as a check."
    ],
    "teach2": [
      "Look at the requested ascending or descending direction.",
      "Choose the least or greatest remaining value one at a time.",
      "Record each value once, then check all neighbouring comparisons."
    ],
    "teach3": [
      "Find the deciding place or positive difference in the model.",
      "Choose evidence that explains the relationship instead of repeating greater.",
      "Name the first unequal unit values or a correct difference and connect them to the conclusion."
    ],
    "learn": [
      "Read the numeral and expanded form together.",
      "Match each part of the sum to its place column.",
      "Rebuild the same total, then use matching place values to check the comparison."
    ],
    "guided": [
      "Begin by labelling the second numeral’s columns.",
      "Complete one representation before comparing it with the suggestion.",
      "Read the words back into a chart and check that every digit returns to its intended place."
    ],
    "write": [
      "Start by copying the first task numeral accurately.",
      "Begin “This numeral has ____ groups of ____.”",
      "A partial record begins “For my first number, the largest place is ____. I checked it by ____.” Add your own values and working."
    ],
    "quiz": [
      "Return to the step for the representation named in the question.",
      "Distinguish a face digit, a value, a partition and an order statement.",
      "Use the matching column or total check before selecting an option; explain the value relationship for a written response."
    ],
    "submit": [
      "Check that your compare and order whole numbers task and working are present.",
      "Include the compare and order whole numbers reflection and any written reasoning you produced.",
      "Send your compare and order whole numbers evidence for review; type a clear record if you used paper."
    ]
  }
}'), updated_at=datetime('now') WHERE seed_key='s2-mat-y3-w01-l3';

-- s2-mat-y3-w01-l4
UPDATE lessons SET title='Year 3: Whole-number fluency with reasons', data=json_patch(data, '{
  "seed_key": "s2-mat-y3-w01-l4",
  "title": "Year 3: Whole-number fluency with reasons",
  "stage": "S2",
  "learning_area": "Mathematics",
  "year_level": "Year 3",
  "week": 1,
  "lesson_number": 4,
  "duration_minutes": 60,
  "child_mission": "Become a Number Investigator! Use place groups to solve whole-number fluency with reasons tasks and explain how you checked.",
  "learning_intention": "We are learning to whole-number fluency with reasons within the range to 10,000.",
  "success_criteria": [
    "I can read a numeral through its place groups.",
    "I can match a digit to its value.",
    "I can show a correct partition or comparison.",
    "I can check an answer and explain my reason."
  ],
  "materials": [
    "Everything you need to read is included in this lesson",
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
  "spelling_focus": null,
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
      "title": "Read the digits through their places",
      "explain": "**Digit and value are different.**\nA digit is a written symbol from zero to nine. Its value depends on the place. A four in the hundreds column means four hundreds; in the ones column it means four ones.\n\n**Read a useful chunk.**\nIn 4,518, separate the thousands part from the final three digits. Read the thousands part, then the hundreds, tens and ones that follow. A space or comma can help group digits; it does not mean a decimal point.\n\n**Say the number in words.**\nOur model is “four thousand five hundred and eighteen”. Say the number, point to each matching part and check that you did not turn a digit into the wrong-sized group.\n\nThe same method works with fewer or more non-zero places. The number of digits gives a starting clue, but the position of each digit settles its value.",
      "example": "I DO:\n4,518 = 4,000 + 500 + 10 + 8.\nWords: four thousand five hundred and eighteen.\nI match each spoken group with its column, then read the whole count once.\n\nYOU TRY:\nRead 4,026 using the columns. Try before comparing.\n\nCHECK:\nIt is four thousand and twenty-six. The zero column contributes no groups of that size, but still holds its place.",
      "notice": "Do not read every digit as a separate number name when the task asks for the whole number.",
      "check": {
        "question": "Which words correctly read 4,518?",
        "options": [
          "four thousand six hundred and eighteen",
          "four thousand four hundred and eighteen",
          "four thousand five hundred and eighteen",
          "four thousand five hundred and twenty-eight"
        ],
        "correct_index": 2,
        "explanation": "Four thousand five hundred and eighteen matches the thousands part and the remaining hundreds, tens and ones. The other readings change a digit’s value."
      },
      "visual": [
        {
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 450 190\"><rect width=\"450\" height=\"190\" fill=\"#f5faf7\"/><rect x=\"0.0\" y=\"10\" width=\"112.5\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"56.25\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Thousands</text><text x=\"56.25\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">4</text><text x=\"56.25\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">4,000</text><rect x=\"112.5\" y=\"10\" width=\"112.5\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"168.75\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Hundreds</text><text x=\"168.75\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">5</text><text x=\"168.75\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">500</text><rect x=\"225.0\" y=\"10\" width=\"112.5\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"281.25\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Tens</text><text x=\"281.25\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">1</text><text x=\"281.25\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">10</text><rect x=\"337.5\" y=\"10\" width=\"112.5\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"393.75\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Ones</text><text x=\"393.75\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">8</text><text x=\"393.75\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">8</text></svg>",
          "alt": "A place-value chart for 4,518. Thousands: digit 4, value 4,000, Hundreds: digit 5, value 500, Tens: digit 1, value 10, Ones: digit 8, value 8.",
          "caption": "A digit’s column gives its value."
        }
      ]
    },
    {
      "icon": "📖",
      "title": "Partition without changing the total",
      "explain": "**Partition means split a whole into parts.**\nIn standard expanded form, split a numeral into the value contributed by each non-zero place. Add those contributions to reconstruct the same total.\n\n**Match each term to a column.**\nA term such as five hundred describes the value of a digit in the hundreds place. Writing five instead would lose the unit size. Use addition signs because the parts combine into one total.\n\n**Show the full model.**\n4,518 = 4,000 + 500 + 10 + 8. Read each part, then check the sum. You have represented the same number another way, not made a smaller number.\n\nZero-valued terms can be left out of the addition, but do not shift other digits in the numeral. Keep those two representations distinct.",
      "example": "I DO:\nI split 4,518 into its non-zero place values: 4,000 + 500 + 10 + 8.\nI put each part back into a chart and recover 4,518.\n\nYOU TRY:\nPartition 4,026. Include the value of every non-zero digit.\n\nCHECK:\n4,000 + 20 + 6 adds to 4,026. A zero place contributes nothing to this sum but remains in the numeral.",
      "notice": "An expanded term includes its unit value. Listing the face digits alone is not standard expanded form.",
      "check": {
        "question": "What must a standard expanded-form term show?",
        "options": [
          "Only the face digit with no place value",
          "The number of letters in the word",
          "The value contributed by its place",
          "A new unrelated count"
        ],
        "correct_index": 2,
        "explanation": "A standard expanded term gives the contribution of a place, so the terms add back to the original number."
      }
    },
    {
      "icon": "📖",
      "title": "Compare equal-sized groups first",
      "explain": "**Comparison asks which whole is larger.**\nFor positive whole numbers, first check how many places are needed. A number with an additional leading non-zero place is larger. For equal-length numerals, compare their highest places first.\n\n**Find the first difference from the left.**\nIf the highest digits match, move one column right. Stop at the first unequal pair. That larger place outweighs all the lower places that follow.\n\n**Use the pair 4,518 and 4,026.**\nThe first unequal digits from the left determine the comparison. A larger final ones digit cannot overcome a smaller earlier thousands or hundreds digit. Think about group size, not just digit size.\n\nLine up matching columns. Leading zeroes do not create a larger positive value; the first non-zero place matters.",
      "example": "I DO:\nCompare 4,518 with 4,026. I line up the columns, move from the left and locate the first difference. 4,518 is greater.\n\nYOU TRY:\nCompare 4,517 and 4,518. Which first unequal column decides it?\n\nCHECK:\n4,518 is greater by one. Most leading places match, so the difference is near the right; begin from the left anyway.",
      "notice": "Compare the first unequal place, not whichever single digit catches your eye.",
      "check": {
        "question": "For equal-length positive whole numbers, where should comparison start?",
        "options": [
          "At whichever digit is brightest",
          "At the largest place on the left",
          "At the ones every time",
          "At the number of commas"
        ],
        "correct_index": 1,
        "explanation": "The largest place carries the greatest unit value. Compare it first, then move right only if it matches."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Whole-number fluency with reasons in action",
            "transcript": "Pip: I am practising how to compare equal-sized groups first. I need to track the value, not just copy digits.\nJuno: Comparison asks which whole is larger.\nFor positive whole numbers, first check how many places are needed. A number with an additional leading non-zero place is larger. For equal-length numerals, compare their highest places first.\nPip: Compare 4,518 with 4,026. I line up the columns, move from the left and locate the first difference. 4,518 is greater.\nJuno: Pause and try a fresh example with the same check. Explain what stays unchanged or which value relationship settles the result.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "I am practising how to compare equal-sized groups first. I need to track the value, not just copy digits."
                  },
                  {
                    "who": "juno",
                    "text": "Comparison asks which whole is larger.\nFor positive whole numbers, first check how many places are needed. A number with an additional leading non-zero place is larger. For equal-length numerals, compare their highest places first."
                  },
                  {
                    "who": "pip",
                    "text": "Compare 4,518 with 4,026. I line up the columns, move from the left and locate the first difference. 4,518 is greater."
                  },
                  {
                    "who": "juno",
                    "text": "Pause and try a fresh example with the same check. Explain what stays unchanged or which value relationship settles the result.",
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
      "title": "Choose a check before speed",
      "explain": "**Fluency includes accuracy and useful method choice.**\nIt is not just finishing quickly. Read what a task asks: number words, a digit value, a partition or a comparison. Choosing the wrong operation quickly does not help.\n\n**Predict a sensible answer.**\nA count should keep its group sizes. A partition should sum to the same whole. A comparison should agree with the first unequal place. Use these expectations to catch a misplaced zero or a wrong-sized change.\n\n**Check with another representation.**\nRead a numeral back from words; rebuild it from a partition; reverse a comparison statement and read its sign. This compares meanings rather than simply repeating the same writing.\n\nKeep a before-and-after note if you repair an error. If your first answer was correct, describe the check that confirmed it. You do not need to invent a mistake.",
      "example": "I DO:\nAttempt: 4,518 = 4,418 + 10.\nI add the parts and get 4,428, not 4,518. I repair the last part to 100 and check the total again.\n\nYOU TRY:\nCheck the statement 4,518 = 4,508 + 10 using the total.\n\nCHECK:\nIt is correct: the two parts add to 4,518. Accuracy comes from the value check, not the length of the expression.",
      "notice": "Use a check suited to the task. Recopying the same unexamined answer does not confirm it.",
      "check": {
        "question": "Which check confirms a partition?",
        "options": [
          "Count its plus signs only",
          "Add the parts and compare with the target",
          "Remove every zero",
          "Choose the longest expression"
        ],
        "correct_index": 1,
        "explanation": "A partition is valid when its parts add to the original total. Its visual length does not settle correctness."
      }
    }
  ],
  "worked_example": "I DO: Complete a connected whole-number fluency with reasons record.\nTarget numeral: 4,518. Words: four thousand five hundred and eighteen.\nStandard partition: 4,000 + 500 + 10 + 8.\nHundreds digit: 5; value: 500.\nAnother partition: 4,418 + 100 = 4,518.\nComparison: 4,518 > 4,026. I compare matching places from the left; the first unequal place decides. The difference is 492.\nAscending set: 4,026, 4,518, 4,618.\n\nWHY THE REPRESENTATIONS AGREE\nThe written numeral, words and expanded sum describe the same place groups. The non-standard partition also returns the same total. Comparing uses those group values, not only the shape of a single digit.\n\nCOMMON MISTAKE AND FIX\nWriting the hundreds digit’s value as 5 loses its unit size. I change the value label to 500. Another possible error is deleting the zero in 4,026; I keep its column and reread the whole count.\n\nCHECK\nI rebuild the numeral from its non-zero terms and read the comparison in both directions. If a check disagrees, I revisit the relevant column before changing unrelated digits.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 450 190\"><rect width=\"450\" height=\"190\" fill=\"#f5faf7\"/><rect x=\"0.0\" y=\"10\" width=\"112.5\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"56.25\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Thousands</text><text x=\"56.25\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">4</text><text x=\"56.25\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">4,000</text><rect x=\"112.5\" y=\"10\" width=\"112.5\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"168.75\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Hundreds</text><text x=\"168.75\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">0</text><text x=\"168.75\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">0</text><rect x=\"225.0\" y=\"10\" width=\"112.5\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"281.25\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Tens</text><text x=\"281.25\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">2</text><text x=\"281.25\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">20</text><rect x=\"337.5\" y=\"10\" width=\"112.5\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"393.75\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Ones</text><text x=\"393.75\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">6</text><text x=\"393.75\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">6</text></svg>",
      "alt": "A place-value chart for 4,026. Thousands: digit 4, value 4,000, Hundreds: digit 0, value 0, Tens: digit 2, value 20, Ones: digit 6, value 6.",
      "caption": "A digit’s column gives its value."
    }
  ],
  "guided_practice": "WE DO: Prepare a second record using 4,026.\n1. Label the columns and insert the digits. Read it before comparing with “four thousand and twenty-six”.\n2. Find the hundreds digit and its contribution. Compare after your attempt: 0.\n3. Partition it. Check against 4,000 + 20 + 6, then add those terms back.\n4. Compare 4,026 with 4,518; name the first unequal place rather than choosing by the final digit.\n5. Make one different partition by setting aside a hundred. Check: 3,926 + 100.\n6. Explain one check you used. If you made an error, repair only the mismatched place and read the result again.\nYou can draw the chart or describe it in text. The explanation matters more than decorative layout.",
  "independent_task": "YOU DO: Whole-number fluency with reasons record (about 20 minutes).\nUse these numbers: 4,721; 4,136; 4,506; 4,006.\n1. Say what each part of the task asks before answering: numeral, words, place value, partition or order.\n2. For each value, give its words and expanded form. Order the set, then choose one answer to check through a different representation.\n3. Show working for at least two decisions with a labelled chart, equation or comparison reason.\n4. Check those decisions by rebuilding a total, reading words back or comparing neighbouring values.\n5. Explain one improvement or one check that confirmed a correct answer.\nWork on paper or in the big box. If using paper, type the answers and a clear working summary. Check: correct range and places; zeroes preserved; complete requested representations; a specific reason and a check. An upload is optional.",
  "response_prompt": "Which place-group or representation check helped most in your whole-number fluency with reasons record?",
  "quiz": [
    {
      "question": "Which words correctly read 4,518?",
      "options": [
        "four thousand six hundred and eighteen",
        "four thousand four hundred and eighteen",
        "four thousand five hundred and eighteen",
        "four thousand five hundred and twenty-eight"
      ],
      "correct_index": 2,
      "explanation": "Four thousand five hundred and eighteen matches the thousands part and the remaining hundreds, tens and ones. The other readings change a digit’s value.",
      "type": "multiple_choice"
    },
    {
      "question": "What must a standard expanded-form term show?",
      "options": [
        "Only the face digit with no place value",
        "The number of letters in the word",
        "The value contributed by its place",
        "A new unrelated count"
      ],
      "correct_index": 2,
      "explanation": "A standard expanded term gives the contribution of a place, so the terms add back to the original number.",
      "type": "multiple_choice"
    },
    {
      "question": "For equal-length positive whole numbers, where should comparison start?",
      "options": [
        "At whichever digit is brightest",
        "At the largest place on the left",
        "At the ones every time",
        "At the number of commas"
      ],
      "correct_index": 1,
      "explanation": "The largest place carries the greatest unit value. Compare it first, then move right only if it matches.",
      "type": "multiple_choice"
    },
    {
      "question": "Which check confirms a partition?",
      "options": [
        "Count its plus signs only",
        "Add the parts and compare with the target",
        "Remove every zero",
        "Choose the longest expression"
      ],
      "correct_index": 1,
      "explanation": "A partition is valid when its parts add to the original total. Its visual length does not settle correctness.",
      "type": "multiple_choice"
    },
    {
      "type": "multiple_choice",
      "question": "What is one more than 4,518?",
      "options": [
        "4528",
        "4519",
        "4618",
        "4517"
      ],
      "correct_index": 1,
      "explanation": "Counting by one adds exactly one unit."
    },
    {
      "type": "multiple_choice",
      "question": "What is 4,418 + 100?",
      "options": [
        "4428",
        "4618",
        "4518",
        "4418"
      ],
      "correct_index": 2,
      "explanation": "The two parts rebuild the original total."
    },
    {
      "type": "multiple_choice",
      "question": "What is the value of the tens digit in 4,518?",
      "options": [
        "10",
        "1",
        "100",
        "1000"
      ],
      "correct_index": 0,
      "explanation": "The tens place counts groups of ten."
    },
    {
      "question": "Which list is ascending?",
      "options": [
        "4,618, 4,518, 4,026",
        "4,518, 4,026, 4,618",
        "4,026, 4,618, 4,518",
        "4,026, 4,518, 4,618"
      ],
      "correct_index": 3,
      "explanation": "The values increase from least to greatest; every neighbouring pair is in the correct direction.",
      "type": "multiple_choice"
    },
    {
      "type": "short_answer",
      "question": "Write a different two-part partition of 4,518 and check it.",
      "sample_answer": "4,418 + 100 = 4,518. The parts add back to the target.",
      "marking_guide": "Accept any correct non-standard two-part partition with a total check.",
      "explanation": "The partition must preserve the whole value."
    },
    {
      "type": "short_answer",
      "question": "Explain why 4,518 is greater than 4,026.",
      "sample_answer": "Compare matching columns from the left. The first unequal place has a larger value in the first numeral.",
      "marking_guide": "Accept the actual first unequal place or a correct positive-difference reason.",
      "explanation": "A value relationship supports the comparison, rather than the final digit alone."
    }
  ],
  "parent_notes": "Parent: Teaches whole-number fluency with reasons to 10,000, with explicit digit/value and zero-place distinctions. Original content follows the repository’s topic sequence. Exact outcome codes are empty pending verified mapping; this is not a claim of complete syllabus coverage.\n\nParent: Look for the requested representation and the reasoning behind it, not speed. Standard and flexible partitions both preserve value. The lesson itself supplies the teaching and feedback. Your role is access support and reviewing the evidence.\n\nParent: Task models: 4,721: four thousand seven hundred and twenty-one; 4,000 + 700 + 20 + 1; next 4,722, 4,723; 4,136: four thousand one hundred and thirty-six; 4,000 + 100 + 30 + 6; next 4,137, 4,138; 4,506: four thousand five hundred and six; 4,000 + 500 + 6; next 4,507, 4,508; 4,006: four thousand and six; 4,000 + 6; next 4,007, 4,008. Ascending order: 4,006, 4,136, 4,506, 4,721. Accept other correct partitions and specific checks.\n\nParent: Eight scored choices use the unchanged 90% threshold, requiring 8/8. Two written responses are manually reviewed. Models: 4,418 + 100 = 4,518. The parts add back to the target. Compare matching columns from the left. The first unequal place has a larger value in the first numeral.",
  "evidence_instructions": "Keep the whole-number fluency with reasons answers, two worked decisions, checking note, reflection and written quiz responses.",
  "offline_alternative": "Copy the four task numbers and draw place columns on paper. Complete the whole-number fluency with reasons record and check it, then type your evidence later.",
  "extension": "Choose a new number below 10,000. Represent it in words and two partitions, then explain how it compares with 4,518.",
  "stage_hints": {
    "accept": [
      "Read the mission about whole-number fluency with reasons.",
      "You will practise whole-number fluency with reasons through models before making your own response.",
      "Begin with the first explanation of whole-number fluency with reasons; the examples remain available while you work."
    ],
    "teach0": [
      "Look at how the thousands chunk and final digits are read.",
      "Point to the matching place while saying each number-word part.",
      "Read the large group first, then the remaining hundreds, tens and ones; match the result back to the chart."
    ],
    "teach1": [
      "Look at each expanded term beside its place column.",
      "Write the value of each non-empty group instead of only its digit.",
      "Add the terms back and check that the original numeral returns."
    ],
    "teach2": [
      "Look at the first unequal place from the left.",
      "Line up matching places and move right only while they match.",
      "Compare the two group values at the first difference; later smaller places cannot reverse it."
    ],
    "teach3": [
      "Look at the task’s requested representation.",
      "Choose a different way to test the same total or relationship.",
      "Add a partition back, read words into a numeral or reverse a comparison to check its meaning."
    ],
    "learn": [
      "Read the numeral and expanded form together.",
      "Match each part of the sum to its place column.",
      "Rebuild the same total, then use matching place values to check the comparison."
    ],
    "guided": [
      "Begin by labelling the second numeral’s columns.",
      "Complete one representation before comparing it with the suggestion.",
      "Read the words back into a chart and check that every digit returns to its intended place."
    ],
    "write": [
      "Start by copying the first task numeral accurately.",
      "Begin “This numeral has ____ groups of ____.”",
      "A partial record begins “For my first number, the largest place is ____. I checked it by ____.” Add your own values and working."
    ],
    "quiz": [
      "Return to the step for the representation named in the question.",
      "Distinguish a face digit, a value, a partition and an order statement.",
      "Use the matching column or total check before selecting an option; explain the value relationship for a written response."
    ],
    "submit": [
      "Check that your whole-number fluency with reasons task and working are present.",
      "Include the whole-number fluency with reasons reflection and any written reasoning you produced.",
      "Send your whole-number fluency with reasons evidence for review; type a clear record if you used paper."
    ]
  }
}'), updated_at=datetime('now') WHERE seed_key='s2-mat-y3-w01-l4';

-- s4-mat-y7-w01-l1
UPDATE lessons SET title='Year 7: Represent positive and negative integers', data=json_patch(data, '{
  "seed_key": "s4-mat-y7-w01-l1",
  "title": "Year 7: Represent positive and negative integers",
  "stage": "S4",
  "learning_area": "Mathematics",
  "year_level": "Year 7",
  "week": 1,
  "lesson_number": 1,
  "duration_minutes": 60,
  "child_mission": "Investigate represent positive and negative integers. Use a representation, show each decision and check the result.",
  "learning_intention": "We are learning to explain and apply represent positive and negative integers.",
  "success_criteria": [
    "I can explain the key number idea with an example.",
    "I can use the taught representation or calculation method.",
    "I can show a reason for my result.",
    "I can check a result and interpret it accurately."
  ],
  "materials": [
    "Everything you need to read is included in this lesson",
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
  "spelling_focus": null,
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
      "icon": "🔎",
      "title": "Define integers and the reference zero",
      "explain": "**An integer is a whole-number value with a sign when needed.**\nThe integers include negative whole numbers, zero and positive whole numbers: for example, negative three, zero and four. Fractions such as one half are not integers. The word whole in this explanation concerns the size of the unit, not a rule that the sign must be positive.\n\n**Zero is a reference point.**\nA signed value describes a position relative to zero. On a temperature scale, a negative reading is below zero degrees Celsius. In a floor model, negative levels can be below the ground reference. Choose and state the reference before interpreting the sign.\n\n**Positive and negative are directions from the reference.**\nA plus sign can be written for a positive value, but it is often omitted. A minus sign attached to a numeral marks a negative value. Zero is neither positive nor negative.\n\nDo not assume that negative means physically impossible or that it always means bad. Its meaning depends on the chosen reference and context.",
      "example": "I DO:\nI use ground level as zero. A position two levels below it is −2; three levels above it is +3, usually written 3. A ground-level position is 0.\nTemperature example: −4 °C is four degrees below zero, not a count of negative objects.\n\nYOU TRY:\nWith sea level defined as zero, describe a point five metres below it.\n\nCHECK:\nThe signed height is −5 m. State the reference because a different zero would change the description.",
      "notice": "A negative position is not a fractional unit. Separate the sign from the kind of number.",
      "check": {
        "question": "Which statement correctly describes zero?",
        "options": [
          "It is always positive",
          "It is always negative",
          "It is an integer that is neither positive nor negative",
          "It is not a number"
        ],
        "correct_index": 2,
        "explanation": "Zero belongs to the integers but is neither positive nor negative; it is the reference between the two directions."
      },
      "visual": [
        {
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 450 165\"><rect width=\"450\" height=\"165\" fill=\"#f5faf7\"/><line x1=\"25\" y1=\"80\" x2=\"425\" y2=\"80\" stroke=\"#173c2c\" stroke-width=\"3\"/><line x1=\"25.0\" y1=\"73\" x2=\"25.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"25.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-6</text><line x1=\"58.333333333333336\" y1=\"73\" x2=\"58.333333333333336\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"58.333333333333336\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-5</text><line x1=\"91.66666666666667\" y1=\"73\" x2=\"91.66666666666667\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"91.66666666666667\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-4</text><line x1=\"125.0\" y1=\"73\" x2=\"125.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"125.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-3</text><line x1=\"158.33333333333334\" y1=\"73\" x2=\"158.33333333333334\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"158.33333333333334\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-2</text><line x1=\"191.66666666666669\" y1=\"73\" x2=\"191.66666666666669\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"191.66666666666669\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-1</text><line x1=\"225.0\" y1=\"73\" x2=\"225.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"225.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">0</text><line x1=\"258.33333333333337\" y1=\"73\" x2=\"258.33333333333337\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"258.33333333333337\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">1</text><line x1=\"291.6666666666667\" y1=\"73\" x2=\"291.6666666666667\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"291.6666666666667\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">2</text><line x1=\"325.0\" y1=\"73\" x2=\"325.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"325.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">3</text><line x1=\"358.33333333333337\" y1=\"73\" x2=\"358.33333333333337\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"358.33333333333337\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">4</text><line x1=\"391.6666666666667\" y1=\"73\" x2=\"391.6666666666667\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"391.6666666666667\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">5</text><line x1=\"425.0\" y1=\"73\" x2=\"425.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"425.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">6</text><circle cx=\"125.0\" cy=\"80\" r=\"7\" fill=\"#9d3a19\"/><text x=\"225\" y=\"35\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"22\" fill=\"#173c2c\">Highlighted position: -3</text><text x=\"225\" y=\"148\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"20\" fill=\"#173c2c\">Left: smaller. Right: greater.</text></svg>",
          "alt": "A number line from -6 to 6, with equal one-unit intervals. -3 is highlighted. Values increase to the right.",
          "caption": "Position and distance from zero answer different questions."
        }
      ]
    },
    {
      "icon": "🔎",
      "title": "Place signed values on a number line",
      "explain": "**Equal spacing represents equal differences.**\nOn this line, each interval is one unit. Zero separates positive positions on the right from negative positions on the left. Read the labels and scale before placing a point.\n\n**Position gives the value.**\nTo place negative three, start at zero and count three equal intervals left. To place positive three, count three intervals right. Both are equally far from zero, but they have different values because they are on different sides.\n\n**Do not count a starting tick as a movement.**\nStarting at zero, the first interval left ends at negative one. Count intervals travelled, not the number of tick marks you see including the start.\n\nIf a line uses steps of two or five, the same number of intervals represents a different distance. The scale must match the values you assign.",
      "example": "I DO:\nStart at 0. One interval left reaches −1; a second reaches −2; a third reaches −3.\nTo place 4, start again at 0 and move four intervals right.\n\nYOU TRY:\nPlace −2 on a line with one-unit intervals and explain the direction.\n\nCHECK:\nIt is two intervals left of zero. Counting the starting tick as the first unit would place it incorrectly.",
      "notice": "Read the scale first. A drawing without labelled units is not enough to determine a value.",
      "check": {
        "question": "On a one-unit number line, how is −3 located from zero?",
        "options": [
          "Three intervals right",
          "At the zero tick",
          "Six intervals right",
          "Three intervals left"
        ],
        "correct_index": 3,
        "explanation": "A negative position lies left of zero, and the magnitude three gives three one-unit intervals."
      }
    },
    {
      "icon": "🔎",
      "title": "Separate value from distance",
      "explain": "**Absolute value measures distance from zero.**\nDistance is non-negative. The notation |−3| means the distance of negative three from zero, which is three. Similarly, |3| is three. The bars here are absolute-value notation, not brackets telling you to change every sign in an expression.\n\n**Opposites have equal distance and opposite sides.**\nThree and negative three are opposites. Their number-line points mirror each other across zero. Zero is its own opposite.\n\n**Distance does not decide ordinary order.**\nNegative five is farther from zero than negative two, but it lies farther left and is a smaller value. Ask whether the task concerns signed value, distance or an opposite before answering.\n\nUse the number line when the notation is unfamiliar. First identify the point, then count its distance to zero.",
      "example": "I DO:\nValue: −5. Distance from zero: |−5| = 5. Opposite: 5.\nFor 2, the distance is 2 and the opposite is −2.\n\nYOU TRY:\nFind the distance and opposite for −4. Give the two answers separate labels.\n\nCHECK:\nDistance: 4. Opposite: 4. These happen to have the same numeral in this example, but they are answers to different questions. For positive four, distance stays four while its opposite is negative four.",
      "notice": "Absolute value is distance. It does not mean that negative values are larger in ordinary order.",
      "check": {
        "question": "What does |−5| describe?",
        "options": [
          "A signed value smaller than −5",
          "A distance of five units from zero",
          "A rule that −5 is greater than 2",
          "A fractional interval"
        ],
        "correct_index": 1,
        "explanation": "Absolute value gives the non-negative distance from zero, which is five units for −5."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Check the method for represent positive and negative integers",
            "transcript": "Pip: I am working on represent positive and negative integers. I need to know what the notation asks.\nJuno: An integer is a whole-number value with a sign when needed.\nThe integers include negative whole numbers, zero and positive whole numbers: for example, negative three, zero and four. Fractions such as one half are not integers. The word whole in this explanation concerns the size of the unit, not a rule that the sign must be positive.\nPip: I use ground level as zero. A position two levels below it is −2; three levels above it is +3, usually written 3. A ground-level position is 0.\nTemperature example: −4 °C is four degrees below zero, not a count of negative objects.\nJuno: Pause and try a fresh example with this method. Check it against the representation before continuing.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "I am working on represent positive and negative integers. I need to know what the notation asks."
                  },
                  {
                    "who": "juno",
                    "text": "An integer is a whole-number value with a sign when needed.\nThe integers include negative whole numbers, zero and positive whole numbers: for example, negative three, zero and four. Fractions such as one half are not integers. The word whole in this explanation concerns the size of the unit, not a rule that the sign must be positive."
                  },
                  {
                    "who": "pip",
                    "text": "I use ground level as zero. A position two levels below it is −2; three levels above it is +3, usually written 3. A ground-level position is 0.\nTemperature example: −4 °C is four degrees below zero, not a count of negative objects."
                  },
                  {
                    "who": "juno",
                    "text": "Pause and try a fresh example with this method. Check it against the representation before continuing.",
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
      "icon": "🔎",
      "title": "Translate a context without changing its reference",
      "explain": "**A signed model needs a consistent zero.**\nIf a water-level chart uses a marked line as zero, below that mark is negative and above it is positive. Keep that reference for every reading in the same comparison.\n\n**Write units with the value.**\nA signed height in metres and a temperature in degrees Celsius describe different measurements. The same integer can appear in both, but the unit and reference supply the interpretation.\n\n**Check the words against the sign.**\n“Below” and “above” often suggest directions, but only after you know the reference. A statement five metres below a roof is not automatically five metres below sea level.\n\nExplain your model in one sentence: reference, position and unit. This makes a signed answer meaningful and checkable.",
      "example": "I DO:\nA marker is the zero on a depth display. A reading −3 m means three metres below that marker. I do not claim it is below sea level unless that is the actual reference.\n\nYOU TRY:\nA platform is two metres above a marked zero. Write the value and explain it.\n\nCHECK:\n+2 m, or 2 m, is two metres above the stated marker. Both positive notations preserve the meaning.",
      "notice": "Keep the same reference throughout. A minus sign alone cannot tell the entire context.",
      "check": {
        "question": "What should accompany a signed measurement explanation?",
        "options": [
          "Only the number of letters",
          "An invented reference",
          "Its reference and unit",
          "A statement that negative is impossible"
        ],
        "correct_index": 2,
        "explanation": "The reference and unit explain what the signed value measures and how its position is interpreted."
      }
    }
  ],
  "worked_example": "I DO: A complete represent positive and negative integers response.\nUse a one-unit number line with zero as reference. Values: −6, 0, 4 and −2.\nTask values: −6, 0, 4, −2. Points are six left, zero, four right and two left of zero. Distances: 6, 0, 4, 2. Opposites: 6, 0, −4, 2. A position five metres below the chosen marker is −5 m.\n\nWHY THE METHOD WORKS\nPosition represents signed value; distance from zero answers a different question. The opposite is a reflected value, while absolute value is a distance. State which one the task asks for.\n\nCOMMON MISTAKE AND FIX\nDeleting a negative sign changes the value. Keep it attached and interpret it using the stated zero before continuing.\n\nCHECK\nRebuild the requested representation and read the conclusion in the supplied context. Use only the methods taught in this lesson, not an operation rule borrowed from a different topic.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 450 165\"><rect width=\"450\" height=\"165\" fill=\"#f5faf7\"/><line x1=\"25\" y1=\"80\" x2=\"425\" y2=\"80\" stroke=\"#173c2c\" stroke-width=\"3\"/><line x1=\"25.0\" y1=\"73\" x2=\"25.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"25.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-6</text><line x1=\"58.333333333333336\" y1=\"73\" x2=\"58.333333333333336\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"58.333333333333336\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-5</text><line x1=\"91.66666666666667\" y1=\"73\" x2=\"91.66666666666667\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"91.66666666666667\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-4</text><line x1=\"125.0\" y1=\"73\" x2=\"125.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"125.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-3</text><line x1=\"158.33333333333334\" y1=\"73\" x2=\"158.33333333333334\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"158.33333333333334\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-2</text><line x1=\"191.66666666666669\" y1=\"73\" x2=\"191.66666666666669\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"191.66666666666669\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-1</text><line x1=\"225.0\" y1=\"73\" x2=\"225.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"225.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">0</text><line x1=\"258.33333333333337\" y1=\"73\" x2=\"258.33333333333337\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"258.33333333333337\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">1</text><line x1=\"291.6666666666667\" y1=\"73\" x2=\"291.6666666666667\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"291.6666666666667\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">2</text><line x1=\"325.0\" y1=\"73\" x2=\"325.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"325.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">3</text><line x1=\"358.33333333333337\" y1=\"73\" x2=\"358.33333333333337\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"358.33333333333337\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">4</text><line x1=\"391.6666666666667\" y1=\"73\" x2=\"391.6666666666667\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"391.6666666666667\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">5</text><line x1=\"425.0\" y1=\"73\" x2=\"425.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"425.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">6</text><circle cx=\"125.0\" cy=\"80\" r=\"7\" fill=\"#9d3a19\"/><text x=\"225\" y=\"35\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"22\" fill=\"#173c2c\">Highlighted position: -3</text><text x=\"225\" y=\"148\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"20\" fill=\"#173c2c\">Left: smaller. Right: greater.</text></svg>",
      "alt": "A number line from -6 to 6, with equal one-unit intervals. -3 is highlighted. Values increase to the right.",
      "caption": "Position and distance from zero answer different questions."
    }
  ],
  "guided_practice": "WE DO: Work one supported example at a time.\n1. Mark zero and one-unit spacing. Locate −3 and 2 before checking: −3 is three left; 2 is two right.\n2. Find their distances and opposites. Feedback: distances 3 and 2; opposites 3 and −2.\n3. Explain the relevant sign, position or remaining contribution in your own words.\n4. Try a second example with −4 and 1 using the same method.\n5. Check after your attempt: distances 4 and 1; opposites 4 and −1.\n6. Describe one check that confirmed the answer or a change that repaired an error. A diagram or a clear written explanation is acceptable.",
  "independent_task": "YOU DO: Represent positive and negative integers investigation (about 25–30 minutes).\n1. Place −6, 0, 4 and −2 on a labelled one-unit number line. Give each distance from zero and opposite, with separate labels. Model a point five metres below a stated zero marker.\n2. Show each requested representation or calculation clearly; keep negative signs attached to values.\n3. Write a reason for two decisions using the taught reference, position or signed-change model.\n4. Check one result with a second representation and explain the agreement.\n5. State one improvement or confirmed check in your reflection.\nWork on paper or in the big box. Type a working summary if using paper; upload is optional.\nSuccess checklist: correct signs; labelled scale where used; requested results; two explanations; independent check; honest evidence record.",
  "response_prompt": "Which representation or check changed your understanding of represent positive and negative integers, and why?",
  "quiz": [
    {
      "question": "Which statement correctly describes zero?",
      "options": [
        "It is always positive",
        "It is always negative",
        "It is an integer that is neither positive nor negative",
        "It is not a number"
      ],
      "correct_index": 2,
      "explanation": "Zero belongs to the integers but is neither positive nor negative; it is the reference between the two directions.",
      "type": "multiple_choice"
    },
    {
      "question": "On a one-unit number line, how is −3 located from zero?",
      "options": [
        "Three intervals right",
        "At the zero tick",
        "Six intervals right",
        "Three intervals left"
      ],
      "correct_index": 3,
      "explanation": "A negative position lies left of zero, and the magnitude three gives three one-unit intervals.",
      "type": "multiple_choice"
    },
    {
      "question": "What does |−5| describe?",
      "options": [
        "A signed value smaller than −5",
        "A distance of five units from zero",
        "A rule that −5 is greater than 2",
        "A fractional interval"
      ],
      "correct_index": 1,
      "explanation": "Absolute value gives the non-negative distance from zero, which is five units for −5.",
      "type": "multiple_choice"
    },
    {
      "question": "What should accompany a signed measurement explanation?",
      "options": [
        "Only the number of letters",
        "An invented reference",
        "Its reference and unit",
        "A statement that negative is impossible"
      ],
      "correct_index": 2,
      "explanation": "The reference and unit explain what the signed value measures and how its position is interpreted.",
      "type": "multiple_choice"
    },
    {
      "type": "multiple_choice",
      "question": "Which value is opposite to −4?",
      "options": [
        "-4",
        "4",
        "0",
        "8"
      ],
      "correct_index": 1,
      "explanation": "Opposites are equally far from zero on different sides."
    },
    {
      "type": "multiple_choice",
      "question": "What is |−6|?",
      "options": [
        "-6",
        "0",
        "6",
        "12"
      ],
      "correct_index": 2,
      "explanation": "Absolute value gives the non-negative distance from zero."
    },
    {
      "question": "Which is an integer?",
      "options": [
        "−7",
        "1/2",
        "2.5",
        "0.25"
      ],
      "correct_index": 0,
      "explanation": "Negative seven is a signed whole-number value; the other displayed values contain fractional parts.",
      "type": "multiple_choice"
    },
    {
      "type": "multiple_choice",
      "question": "What is the opposite of 5?",
      "options": [
        "5",
        "0",
        "10",
        "-5"
      ],
      "correct_index": 3,
      "explanation": "Reflecting five across zero gives negative five."
    },
    {
      "question": "Which measurement means three metres below the chosen zero?",
      "options": [
        "3 m",
        "−3 m",
        "0 m",
        "30 m"
      ],
      "correct_index": 1,
      "explanation": "A position three metres below the stated reference has signed value negative three metres.",
      "type": "multiple_choice"
    },
    {
      "type": "multiple_choice",
      "question": "What is |4|?",
      "options": [
        "-4",
        "0",
        "4",
        "8"
      ],
      "correct_index": 2,
      "explanation": "Four is four units from zero."
    }
  ],
  "parent_notes": "Parent: Teaches represent positive and negative integers from definitions to explanation and application. Original content follows the repository’s topic sequence. Exact outcome codes are empty pending verified mapping; this is not a claim of complete syllabus coverage.\n\nParent: Look for explicit working and a check of signs, scale, notation or units as appropriate. A correct guess without a method is weaker evidence than an explained calculation. The lesson itself supplies the teaching and feedback. Your role is access support and reviewing the evidence.\n\nParent: Model task answers: Task values: −6, 0, 4, −2. Points are six left, zero, four right and two left of zero. Distances: 6, 0, 4, 2. Opposites: 6, 0, −4, 2. A position five metres below the chosen marker is −5 m.\n\nParent: Ten scored choices use the unchanged 90% threshold, requiring 9/10. The independent task and reflection supply written reasoning for manual review.",
  "evidence_instructions": "Keep the represent positive and negative integers task working, explanation, checking record, reflection and quiz result.",
  "offline_alternative": "Copy the included examples and task prompts onto paper. Use the diagrams and models to complete the represent positive and negative integers working without a service, then type an evidence summary later.",
  "extension": "Choose a new pair of signed integers and explain two different questions about them, such as order and distance. State the question before the answer.",
  "stage_hints": {
    "accept": [
      "Read the mission about represent positive and negative integers.",
      "You will practise represent positive and negative integers through models before making your own response.",
      "Begin with the first explanation of represent positive and negative integers; the examples remain available while you work."
    ],
    "teach0": [
      "Look back at the reference used to interpret the sign.",
      "Decide whether the position is above, at or below the chosen zero.",
      "State the reference, direction and number of units before writing a signed value."
    ],
    "teach1": [
      "Look at the line’s unit intervals and zero label.",
      "Count movements from the reference rather than counting the starting tick.",
      "Use the sign for direction and the numeral for the number of equal units."
    ],
    "teach2": [
      "Find the signed point before thinking about distance.",
      "Separate the labels value, distance and opposite.",
      "Count to zero for distance; reflect across zero for the opposite."
    ],
    "teach3": [
      "Reread the reference named in the scenario.",
      "Identify the direction and measurement unit separately.",
      "Write a signed value, then explain its position relative to that same reference."
    ],
    "learn": [
      "Read the complete model before judging its result.",
      "Match each decision to the definition and representation used in this model.",
      "Explain one intermediate step and check that the final conclusion answers the original represent positive and negative integers question."
    ],
    "guided": [
      "Start with the first supplied quantity and identify its role.",
      "Work one represent positive and negative integers example before comparing with the feedback.",
      "Record the intermediate representation and test the result against it before continuing."
    ],
    "write": [
      "Copy the first represent positive and negative integers task and label its quantities.",
      "Begin “The given information is ____. I will use ____ because ____.”",
      "A partial opening is “My first step is to represent ____. This shows ____.” Continue with your own working and result."
    ],
    "quiz": [
      "Return to the definition or method for the specific represent positive and negative integers question.",
      "Check what the symbols ask for before comparing the options.",
      "Use the taught representation to work independently, then check the meaning and unit of the result."
    ],
    "submit": [
      "Check that your represent positive and negative integers task and working are present.",
      "Include the represent positive and negative integers reflection and any written reasoning you produced.",
      "Send your represent positive and negative integers evidence for review; type a clear record if you used paper."
    ]
  }
}'), updated_at=datetime('now') WHERE seed_key='s4-mat-y7-w01-l1';

-- s4-mat-y7-w01-l2
UPDATE lessons SET title='Year 7: Order integers and justify comparisons', data=json_patch(data, '{
  "seed_key": "s4-mat-y7-w01-l2",
  "title": "Year 7: Order integers and justify comparisons",
  "stage": "S4",
  "learning_area": "Mathematics",
  "year_level": "Year 7",
  "week": 1,
  "lesson_number": 2,
  "duration_minutes": 60,
  "child_mission": "Investigate order integers and justify comparisons. Use a representation, show each decision and check the result.",
  "learning_intention": "We are learning to explain and apply order integers and justify comparisons.",
  "success_criteria": [
    "I can explain the key number idea with an example.",
    "I can use the taught representation or calculation method.",
    "I can show a reason for my result.",
    "I can check a result and interpret it accurately."
  ],
  "materials": [
    "Everything you need to read is included in this lesson",
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
  "spelling_focus": null,
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
      "icon": "🔎",
      "title": "Order by position, not digit size",
      "explain": "**Greater values lie farther right.**\nThis rule includes negative integers, zero and positive integers. On the line, negative two lies right of negative five, so negative two is greater. The numeral five being larger than two does not reverse their signed positions.\n\n**Compare across zero first.**\nA positive integer is greater than zero; zero is greater than a negative integer. If the two values lie on opposite sides, their positions already determine the comparison.\n\n**Compare two negatives carefully.**\nThe one closer to zero lies farther right and is greater. The one with a larger distance from zero lies farther left and is smaller. That statement concerns two negative values, not all possible numbers.\n\nLocate both points or sketch the relevant interval before recording a sign. Explain position as evidence.",
      "example": "I DO:\n−2 > −5 because −2 lies to the right of −5.\n−5 < 1 because −5 is left of zero and 1 is right of zero.\n\nYOU TRY:\nCompare −4 and −1 on a number line.\n\nCHECK:\n−4 < −1. Negative one is nearer zero and farther right, so it is the greater signed value.",
      "notice": "A larger absolute value does not mean a larger signed value.",
      "check": {
        "question": "Which statement is true?",
        "options": [
          "−5 > −2",
          "−2 > −5",
          "−2 = −5",
          "Every negative integer exceeds zero"
        ],
        "correct_index": 1,
        "explanation": "Negative two lies farther right than negative five on the number line, so it is greater."
      },
      "visual": [
        {
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 450 165\"><rect width=\"450\" height=\"165\" fill=\"#f5faf7\"/><line x1=\"25\" y1=\"80\" x2=\"425\" y2=\"80\" stroke=\"#173c2c\" stroke-width=\"3\"/><line x1=\"25.0\" y1=\"73\" x2=\"25.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"25.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-6</text><line x1=\"58.333333333333336\" y1=\"73\" x2=\"58.333333333333336\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"58.333333333333336\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-5</text><line x1=\"91.66666666666667\" y1=\"73\" x2=\"91.66666666666667\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"91.66666666666667\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-4</text><line x1=\"125.0\" y1=\"73\" x2=\"125.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"125.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-3</text><line x1=\"158.33333333333334\" y1=\"73\" x2=\"158.33333333333334\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"158.33333333333334\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-2</text><line x1=\"191.66666666666669\" y1=\"73\" x2=\"191.66666666666669\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"191.66666666666669\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-1</text><line x1=\"225.0\" y1=\"73\" x2=\"225.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"225.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">0</text><line x1=\"258.33333333333337\" y1=\"73\" x2=\"258.33333333333337\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"258.33333333333337\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">1</text><line x1=\"291.6666666666667\" y1=\"73\" x2=\"291.6666666666667\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"291.6666666666667\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">2</text><line x1=\"325.0\" y1=\"73\" x2=\"325.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"325.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">3</text><line x1=\"358.33333333333337\" y1=\"73\" x2=\"358.33333333333337\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"358.33333333333337\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">4</text><line x1=\"391.6666666666667\" y1=\"73\" x2=\"391.6666666666667\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"391.6666666666667\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">5</text><line x1=\"425.0\" y1=\"73\" x2=\"425.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"425.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">6</text><circle cx=\"125.0\" cy=\"80\" r=\"7\" fill=\"#9d3a19\"/><text x=\"225\" y=\"35\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"22\" fill=\"#173c2c\">Highlighted position: -3</text><text x=\"225\" y=\"148\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"20\" fill=\"#173c2c\">Left: smaller. Right: greater.</text></svg>",
          "alt": "A number line from -6 to 6, with equal one-unit intervals. -3 is highlighted. Values increase to the right.",
          "caption": "Position and distance from zero answer different questions."
        }
      ]
    },
    {
      "icon": "🔎",
      "title": "Use signs that match a spoken relationship",
      "explain": "**Read the complete comparison aloud.**\nThe symbol < says is less than; > says is greater than; = says is equal to. Treat the statement as a relationship, not a picture to memorise independently of the values.\n\n**The sign’s open side faces the greater value.**\nDecide which signed value is greater first. Then check the symbol’s direction. Negative signs belong to the numbers and must not be dropped when reading the comparison.\n\n**Reversing unequal values reverses the symbol.**\nIf negative four is less than negative one, then negative one is greater than negative four. Both statements preserve the same relationship.\n\nDo not confuse the comparison sign with a minus sign. One records a relationship between two values; the other marks a negative value or an operation in a different context.",
      "example": "I DO:\n−4 < −1 reads negative four is less than negative one.\nReverse: −1 > −4.\n\nYOU TRY:\nRecord a comparison between zero and negative six in both writing orders.\n\nCHECK:\n0 > −6 and −6 < 0. The negative value remains negative when its writing position changes.",
      "notice": "Read the signs together with the numbers. A comparison of unsigned digits answers a different question.",
      "check": {
        "question": "Which reversed statement agrees with −4 < −1?",
        "options": [
          "−1 < −4",
          "4 < 1",
          "−4 = −1",
          "−1 > −4"
        ],
        "correct_index": 3,
        "explanation": "Reversing the two unequal signed values reverses the comparison direction while preserving the relationship."
      }
    },
    {
      "icon": "🔎",
      "title": "Sort a set and check every neighbour",
      "explain": "**Ascending order goes from least to greatest.**\nFor integers, begin at the farthest-left value and move right. Descending order moves the other way. A set can contain values on both sides of zero.\n\n**Choose one extreme at a time.**\nFor ascending order, find the least remaining value, record it and remove it from the remaining set. Repeat until all values are used. This avoids sorting only the negative and positive parts without connecting them.\n\n**Check neighbouring comparisons.**\nEvery value must be no greater than the next in an ascending list. One misplaced negative value can make the middle wrong even when the endpoints are correct.\n\nUse a quick line sketch to verify position. Do not put a negative value later just because its unsigned numeral is larger.",
      "example": "I DO:\nSet: 3, −5, 0, −2.\nAscending: −5, −2, 0, 3.\nChecks: −5 < −2, −2 < 0, 0 < 3.\n\nYOU TRY:\nWrite 2, −4, −1, 0 in descending order.\n\nCHECK:\n2, 0, −1, −4. Every next value lies farther left.",
      "notice": "Sorting requires every value once and the requested direction.",
      "check": {
        "question": "Which list is ascending?",
        "options": [
          "3, 0, −2, −5",
          "−2, −5, 0, 3",
          "−5, −2, 0, 3",
          "0, −5, 3, −2"
        ],
        "correct_index": 2,
        "explanation": "The signed values move from farthest left to farthest right: −5, −2, 0, 3."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Check the method for order integers and justify comparisons",
            "transcript": "Pip: I am working on order integers and justify comparisons. I need to know what the notation asks.\nJuno: Greater values lie farther right.\nThis rule includes negative integers, zero and positive integers. On the line, negative two lies right of negative five, so negative two is greater. The numeral five being larger than two does not reverse their signed positions.\nPip: −2 > −5 because −2 lies to the right of −5.\n−5 < 1 because −5 is left of zero and 1 is right of zero.\nJuno: Pause and try a fresh example with this method. Check it against the representation before continuing.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "I am working on order integers and justify comparisons. I need to know what the notation asks."
                  },
                  {
                    "who": "juno",
                    "text": "Greater values lie farther right.\nThis rule includes negative integers, zero and positive integers. On the line, negative two lies right of negative five, so negative two is greater. The numeral five being larger than two does not reverse their signed positions."
                  },
                  {
                    "who": "pip",
                    "text": "−2 > −5 because −2 lies to the right of −5.\n−5 < 1 because −5 is left of zero and 1 is right of zero."
                  },
                  {
                    "who": "juno",
                    "text": "Pause and try a fresh example with this method. Check it against the representation before continuing.",
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
      "icon": "🔎",
      "title": "Interpret the comparison in context",
      "explain": "**Value and size language need a reference.**\nIn temperatures, negative two degrees Celsius is warmer than negative five degrees Celsius because its value is greater on the same scale. The reading farther below zero is colder, not warmer.\n\n**Do not compare different units as though they are one scale.**\nA signed temperature and a signed height are different measurements. Integer order can compare their numerals abstractly, but a claim such as warmer requires temperature readings on the same scale.\n\n**State a numerical and contextual conclusion.**\nWrite the inequality, then explain what it means for the supplied context. A correct numerical sign without the interpretation may leave the actual question unanswered.\n\nCheck whether words such as higher, colder or below refer to value or distance. Use the stated unit and reference, rather than assuming every larger magnitude is a larger reading.",
      "example": "I DO:\n−2 °C > −5 °C. The −2 °C reading is warmer by three degrees on this scale.\nI distinguish that conclusion from distance below zero: −5 °C is farther below zero.\n\nYOU TRY:\nWhich is colder, −1 °C or −4 °C? Give a value reason.\n\nCHECK:\n−4 °C is colder because it is the lower reading on the same temperature scale.",
      "notice": "A contextual word must agree with the scale, not only with the size of the unsigned numeral.",
      "check": {
        "question": "Which reading is warmer on the same Celsius scale?",
        "options": [
          "−2 °C rather than −5 °C",
          "−5 °C because five exceeds two",
          "Both must mean the same temperature",
          "Any negative reading is impossible"
        ],
        "correct_index": 0,
        "explanation": "Negative two is the greater reading, so it is warmer on the same Celsius scale."
      }
    }
  ],
  "worked_example": "I DO: A complete order integers and justify comparisons response.\nUse a one-unit number line with zero as reference. Values: −6, 0, 4 and −2.\nAscending: −6, −2, 0, 4. Descending: 4, 0, −2, −6. −6 < −2 and 0 < 4. Of −6 °C and −2 °C, −2 °C is warmer because it is the greater reading.\n\nWHY THE METHOD WORKS\nPosition represents signed value; distance from zero answers a different question. For ordering, the farther-right value is greater. Check every neighbouring pair in a sorted list.\n\nCOMMON MISTAKE AND FIX\nCalling −6 greater than −2 because six exceeds two confuses distance with signed value. Locate the points and use the one farther right as the greater value.\n\nCHECK\nRebuild the requested representation and read the conclusion in the supplied context. Use only the methods taught in this lesson, not an operation rule borrowed from a different topic.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 450 165\"><rect width=\"450\" height=\"165\" fill=\"#f5faf7\"/><line x1=\"25\" y1=\"80\" x2=\"425\" y2=\"80\" stroke=\"#173c2c\" stroke-width=\"3\"/><line x1=\"25.0\" y1=\"73\" x2=\"25.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"25.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-6</text><line x1=\"58.333333333333336\" y1=\"73\" x2=\"58.333333333333336\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"58.333333333333336\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-5</text><line x1=\"91.66666666666667\" y1=\"73\" x2=\"91.66666666666667\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"91.66666666666667\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-4</text><line x1=\"125.0\" y1=\"73\" x2=\"125.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"125.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-3</text><line x1=\"158.33333333333334\" y1=\"73\" x2=\"158.33333333333334\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"158.33333333333334\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-2</text><line x1=\"191.66666666666669\" y1=\"73\" x2=\"191.66666666666669\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"191.66666666666669\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-1</text><line x1=\"225.0\" y1=\"73\" x2=\"225.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"225.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">0</text><line x1=\"258.33333333333337\" y1=\"73\" x2=\"258.33333333333337\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"258.33333333333337\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">1</text><line x1=\"291.6666666666667\" y1=\"73\" x2=\"291.6666666666667\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"291.6666666666667\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">2</text><line x1=\"325.0\" y1=\"73\" x2=\"325.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"325.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">3</text><line x1=\"358.33333333333337\" y1=\"73\" x2=\"358.33333333333337\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"358.33333333333337\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">4</text><line x1=\"391.6666666666667\" y1=\"73\" x2=\"391.6666666666667\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"391.6666666666667\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">5</text><line x1=\"425.0\" y1=\"73\" x2=\"425.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"425.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">6</text><circle cx=\"125.0\" cy=\"80\" r=\"7\" fill=\"#9d3a19\"/><text x=\"225\" y=\"35\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"22\" fill=\"#173c2c\">Highlighted position: -3</text><text x=\"225\" y=\"148\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"20\" fill=\"#173c2c\">Left: smaller. Right: greater.</text></svg>",
      "alt": "A number line from -6 to 6, with equal one-unit intervals. -3 is highlighted. Values increase to the right.",
      "caption": "Position and distance from zero answer different questions."
    }
  ],
  "guided_practice": "WE DO: Work one supported example at a time.\n1. Mark zero and one-unit spacing. Locate −3 and 2 before checking: −3 is three left; 2 is two right.\n2. Compare their positions. Feedback: −3 < 2 because −3 lies left of 2.\n3. Explain the relevant sign, position or remaining contribution in your own words.\n4. Try a second example with −4 and 1 using the same method.\n5. Check after your attempt: −4 < 1.\n6. Describe one check that confirmed the answer or a change that repaired an error. A diagram or a clear written explanation is acceptable.",
  "independent_task": "YOU DO: Order integers and justify comparisons investigation (about 25–30 minutes).\n1. Order −6, 0, 4 and −2 in both directions. Record two true inequalities and justify one by position. Explain which of −6 °C and −2 °C is warmer.\n2. Show each requested representation or calculation clearly; keep negative signs attached to values.\n3. Write a reason for two decisions using the taught reference, position or signed-change model.\n4. Check one result with a second representation and explain the agreement.\n5. State one improvement or confirmed check in your reflection.\nWork on paper or in the big box. Type a working summary if using paper; upload is optional.\nSuccess checklist: correct signs; labelled scale where used; requested results; two explanations; independent check; honest evidence record.",
  "response_prompt": "Which representation or check changed your understanding of order integers and justify comparisons, and why?",
  "quiz": [
    {
      "question": "Which statement is true?",
      "options": [
        "−5 > −2",
        "−2 > −5",
        "−2 = −5",
        "Every negative integer exceeds zero"
      ],
      "correct_index": 1,
      "explanation": "Negative two lies farther right than negative five on the number line, so it is greater.",
      "type": "multiple_choice"
    },
    {
      "question": "Which reversed statement agrees with −4 < −1?",
      "options": [
        "−1 < −4",
        "4 < 1",
        "−4 = −1",
        "−1 > −4"
      ],
      "correct_index": 3,
      "explanation": "Reversing the two unequal signed values reverses the comparison direction while preserving the relationship.",
      "type": "multiple_choice"
    },
    {
      "question": "Which list is ascending?",
      "options": [
        "3, 0, −2, −5",
        "−2, −5, 0, 3",
        "−5, −2, 0, 3",
        "0, −5, 3, −2"
      ],
      "correct_index": 2,
      "explanation": "The signed values move from farthest left to farthest right: −5, −2, 0, 3.",
      "type": "multiple_choice"
    },
    {
      "question": "Which reading is warmer on the same Celsius scale?",
      "options": [
        "−2 °C rather than −5 °C",
        "−5 °C because five exceeds two",
        "Both must mean the same temperature",
        "Any negative reading is impossible"
      ],
      "correct_index": 0,
      "explanation": "Negative two is the greater reading, so it is warmer on the same Celsius scale.",
      "type": "multiple_choice"
    },
    {
      "question": "Which value is least?",
      "options": [
        "0",
        "−6",
        "−2",
        "4"
      ],
      "correct_index": 1,
      "explanation": "Negative six lies farthest left.",
      "type": "multiple_choice"
    },
    {
      "question": "Which is greatest?",
      "options": [
        "−6",
        "−2",
        "4",
        "0"
      ],
      "correct_index": 2,
      "explanation": "Four lies farther right than the other signed values.",
      "type": "multiple_choice"
    },
    {
      "question": "Which comparison is true?",
      "options": [
        "−1 > −4",
        "−4 > −1",
        "0 < −4",
        "−1 = −4"
      ],
      "correct_index": 0,
      "explanation": "Negative one lies farther right than negative four.",
      "type": "multiple_choice"
    },
    {
      "question": "Which list is descending?",
      "options": [
        "−6, −2, 0, 4",
        "0, 4, −2, −6",
        "4, −6, 0, −2",
        "4, 0, −2, −6"
      ],
      "correct_index": 3,
      "explanation": "The values move from greatest to least.",
      "type": "multiple_choice"
    },
    {
      "question": "Which reading is colder?",
      "options": [
        "−2 °C rather than −6 °C",
        "−6 °C rather than −2 °C",
        "Both must be equal",
        "Neither can be a temperature"
      ],
      "correct_index": 1,
      "explanation": "Negative six is the lower reading on the same scale.",
      "type": "multiple_choice"
    },
    {
      "question": "What supports an integer comparison?",
      "options": [
        "The size of the unsigned digit only",
        "The number of minus signs",
        "The positions on the same number line",
        "The colour of the writing"
      ],
      "correct_index": 2,
      "explanation": "Position on the same scale gives signed order.",
      "type": "multiple_choice"
    }
  ],
  "parent_notes": "Parent: Teaches order integers and justify comparisons from definitions to explanation and application. Original content follows the repository’s topic sequence. Exact outcome codes are empty pending verified mapping; this is not a claim of complete syllabus coverage.\n\nParent: Look for explicit working and a check of signs, scale, notation or units as appropriate. A correct guess without a method is weaker evidence than an explained calculation. The lesson itself supplies the teaching and feedback. Your role is access support and reviewing the evidence.\n\nParent: Model task answers: Ascending: −6, −2, 0, 4. Descending: 4, 0, −2, −6. −6 < −2 and 0 < 4. Of −6 °C and −2 °C, −2 °C is warmer because it is the greater reading.\n\nParent: Ten scored choices use the unchanged 90% threshold, requiring 9/10. The independent task and reflection supply written reasoning for manual review.",
  "evidence_instructions": "Keep the order integers and justify comparisons task working, explanation, checking record, reflection and quiz result.",
  "offline_alternative": "Copy the included examples and task prompts onto paper. Use the diagrams and models to complete the order integers and justify comparisons working without a service, then type an evidence summary later.",
  "extension": "Choose a new pair of signed integers and explain two different questions about them, such as order and distance. State the question before the answer.",
  "stage_hints": {
    "accept": [
      "Read the mission about order integers and justify comparisons.",
      "You will practise order integers and justify comparisons through models before making your own response.",
      "Begin with the first explanation of order integers and justify comparisons; the examples remain available while you work."
    ],
    "teach0": [
      "Look at the two points relative to zero.",
      "Locate the value farther right before choosing a symbol.",
      "Use number-line position as the reason; keep distance from zero separate."
    ],
    "teach1": [
      "Read the original statement in words.",
      "Keep each number’s negative sign attached when swapping positions.",
      "Write the reverse order and check that its relationship says the same thing."
    ],
    "teach2": [
      "Look at the requested direction before arranging the set.",
      "Choose the least or greatest remaining value one at a time.",
      "Check each neighbouring pair against its number-line position."
    ],
    "teach3": [
      "Identify the common scale and unit.",
      "Write the signed comparison before using the context word.",
      "Explain whether the rightward or leftward value matches the requested meaning."
    ],
    "learn": [
      "Read the complete model before judging its result.",
      "Match each decision to the definition and representation used in this model.",
      "Explain one intermediate step and check that the final conclusion answers the original order integers and justify comparisons question."
    ],
    "guided": [
      "Start with the first supplied quantity and identify its role.",
      "Work one order integers and justify comparisons example before comparing with the feedback.",
      "Record the intermediate representation and test the result against it before continuing."
    ],
    "write": [
      "Copy the first order integers and justify comparisons task and label its quantities.",
      "Begin “The given information is ____. I will use ____ because ____.”",
      "A partial opening is “My first step is to represent ____. This shows ____.” Continue with your own working and result."
    ],
    "quiz": [
      "Return to the definition or method for the specific order integers and justify comparisons question.",
      "Check what the symbols ask for before comparing the options.",
      "Use the taught representation to work independently, then check the meaning and unit of the result."
    ],
    "submit": [
      "Check that your order integers and justify comparisons task and working are present.",
      "Include the order integers and justify comparisons reflection and any written reasoning you produced.",
      "Send your order integers and justify comparisons evidence for review; type a clear record if you used paper."
    ]
  }
}'), updated_at=datetime('now') WHERE seed_key='s4-mat-y7-w01-l2';

-- s4-mat-y7-w01-l3
UPDATE lessons SET title='Year 7: Add integers as signed changes', data=json_patch(data, '{
  "seed_key": "s4-mat-y7-w01-l3",
  "title": "Year 7: Add integers as signed changes",
  "stage": "S4",
  "learning_area": "Mathematics",
  "year_level": "Year 7",
  "week": 1,
  "lesson_number": 3,
  "duration_minutes": 60,
  "child_mission": "Investigate add integers as signed changes. Use a representation, show each decision and check the result.",
  "learning_intention": "We are learning to explain and apply add integers as signed changes.",
  "success_criteria": [
    "I can explain the key number idea with an example.",
    "I can use the taught representation or calculation method.",
    "I can show a reason for my result.",
    "I can check a result and interpret it accurately."
  ],
  "materials": [
    "Everything you need to read is included in this lesson",
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
  "spelling_focus": null,
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
      "icon": "🔎",
      "title": "Treat addition as a signed change",
      "explain": "**The starting value and added change have different jobs.**\nIn negative three plus five, negative three is the start and positive five is the change. Begin at the starting point, then apply the added value. Do not always begin at zero.\n\n**An added positive value moves right.**\nAn added negative value moves left. The numeral gives the distance. This movement model explains addition; it is not yet a rule for subtracting negatives.\n\n**Count equal intervals.**\nFrom negative three, five steps right pass through negative two, negative one, zero, one and two. Count movements rather than including the starting tick as an extra step.\n\nRecord the equation and movement in words so the result can be checked. A negative starting value can lead to a positive result when the rightward change is large enough.",
      "example": "I DO:\n−3 + 5 = 2. Start at −3 and move five units right.\n2 + (−4) = −2. Start at 2 and move four units left.\n\nYOU TRY:\nStart at −2 and add 3. Count the movements.\n\nCHECK:\n−2 + 3 = 1. You pass through −1, 0 and 1.",
      "notice": "Use the added value for direction. The starting sign does not decide every movement.",
      "check": {
        "question": "What is −3 + 5?",
        "options": [
          "-8",
          "2",
          "-2",
          "8"
        ],
        "correct_index": 1,
        "explanation": "Adding positive five moves five units right from negative three to two."
      },
      "visual": [
        {
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 450 165\"><rect width=\"450\" height=\"165\" fill=\"#f5faf7\"/><line x1=\"25\" y1=\"80\" x2=\"425\" y2=\"80\" stroke=\"#173c2c\" stroke-width=\"3\"/><line x1=\"25.0\" y1=\"73\" x2=\"25.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"25.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-6</text><line x1=\"58.333333333333336\" y1=\"73\" x2=\"58.333333333333336\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"58.333333333333336\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-5</text><line x1=\"91.66666666666667\" y1=\"73\" x2=\"91.66666666666667\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"91.66666666666667\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-4</text><line x1=\"125.0\" y1=\"73\" x2=\"125.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"125.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-3</text><line x1=\"158.33333333333334\" y1=\"73\" x2=\"158.33333333333334\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"158.33333333333334\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-2</text><line x1=\"191.66666666666669\" y1=\"73\" x2=\"191.66666666666669\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"191.66666666666669\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-1</text><line x1=\"225.0\" y1=\"73\" x2=\"225.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"225.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">0</text><line x1=\"258.33333333333337\" y1=\"73\" x2=\"258.33333333333337\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"258.33333333333337\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">1</text><line x1=\"291.6666666666667\" y1=\"73\" x2=\"291.6666666666667\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"291.6666666666667\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">2</text><line x1=\"325.0\" y1=\"73\" x2=\"325.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"325.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">3</text><line x1=\"358.33333333333337\" y1=\"73\" x2=\"358.33333333333337\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"358.33333333333337\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">4</text><line x1=\"391.6666666666667\" y1=\"73\" x2=\"391.6666666666667\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"391.6666666666667\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">5</text><line x1=\"425.0\" y1=\"73\" x2=\"425.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"425.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">6</text><circle cx=\"125.0\" cy=\"80\" r=\"7\" fill=\"#9d3a19\"/><text x=\"225\" y=\"35\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"22\" fill=\"#173c2c\">Highlighted position: -3</text><text x=\"225\" y=\"148\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"20\" fill=\"#173c2c\">Left: smaller. Right: greater.</text></svg>",
          "alt": "A number line from -6 to 6, with equal one-unit intervals. -3 is highlighted. Values increase to the right.",
          "caption": "Position and distance from zero answer different questions."
        }
      ]
    },
    {
      "icon": "🔎",
      "title": "Combine changes with the same sign",
      "explain": "**Same-direction changes accumulate.**\nTwo positive values add to a positive total. Two negative values add to a negative total because both contributions point left. Add their distances, then retain the shared direction.\n\n**Explain before using a shortcut.**\nNegative two plus negative four represents two leftward units and four more leftward units. The total is six leftward units, recorded as negative six. It does not become positive merely because there are two minus signs.\n\n**Bracket an added negative when helpful.**\nWrite −2 + (−4) to make the added value clear. The plus sign is the operation; the minus sign in the brackets belongs to the negative value.\n\nCheck with a number-line movement from the first addend. A second leftward move cannot land to the right of the starting point.",
      "example": "I DO:\n−2 + (−4) = −6. Combine the two leftward contributions.\n3 + 4 = 7. Combine the two rightward contributions.\n\nYOU TRY:\nFind −3 + (−2), then check the direction of the result.\n\nCHECK:\n−5. Starting at −3 and adding a negative two moves farther left.",
      "notice": "Two negative addends do not cancel. Rules for multiplication or subtraction would answer a different operation.",
      "check": {
        "question": "What is −2 + (−4)?",
        "options": [
          "6",
          "-2",
          "-6",
          "2"
        ],
        "correct_index": 2,
        "explanation": "Both addends are negative, so their leftward distances combine to negative six."
      }
    },
    {
      "icon": "🔎",
      "title": "Balance opposite-direction changes",
      "explain": "**Opposite contributions can cancel in pairs.**\nOne positive unit and one negative unit sum to zero. Pair as many opposite units as possible; the unpaired contribution determines the result.\n\n**Compare distances when signs differ.**\nFor negative seven plus three, three pairs cancel and four negative units remain. The result is negative four. For negative three plus seven, four positive units remain instead.\n\n**Equal opposite values give zero.**\nNegative five plus five equals zero. Zero is a valid result, not a missing answer. This also provides a useful check for opposites.\n\nSay which contribution remains before writing the sign. Subtracting the distances without explaining the remaining direction can produce the correct size with the wrong sign.",
      "example": "I DO:\n−7 + 3 = −4: three positive units cancel three of the seven negative units.\n−3 + 7 = 4: three negative units cancel three positive units.\n\nYOU TRY:\nFind −6 + 4 using cancellation or a line movement.\n\nCHECK:\n−2. Four opposite pairs cancel and two negative units remain.",
      "notice": "The remaining direction gives the sign. Merely taking the difference of magnitudes is incomplete.",
      "check": {
        "question": "What is −7 + 3?",
        "options": [
          "-4",
          "4",
          "-10",
          "10"
        ],
        "correct_index": 0,
        "explanation": "Three opposite pairs cancel, leaving four negative units."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Check the method for add integers as signed changes",
            "transcript": "Pip: I am working on add integers as signed changes. I need to know what the notation asks.\nJuno: The starting value and added change have different jobs.\nIn negative three plus five, negative three is the start and positive five is the change. Begin at the starting point, then apply the added value. Do not always begin at zero.\nPip: −3 + 5 = 2. Start at −3 and move five units right.\n2 + (−4) = −2. Start at 2 and move four units left.\nJuno: Pause and try a fresh example with this method. Check it against the representation before continuing.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "I am working on add integers as signed changes. I need to know what the notation asks."
                  },
                  {
                    "who": "juno",
                    "text": "The starting value and added change have different jobs.\nIn negative three plus five, negative three is the start and positive five is the change. Begin at the starting point, then apply the added value. Do not always begin at zero."
                  },
                  {
                    "who": "pip",
                    "text": "−3 + 5 = 2. Start at −3 and move five units right.\n2 + (−4) = −2. Start at 2 and move four units left."
                  },
                  {
                    "who": "juno",
                    "text": "Pause and try a fresh example with this method. Check it against the representation before continuing.",
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
      "icon": "🔎",
      "title": "Model and check a contextual change",
      "explain": "**Write the starting reading first.**\nIf a temperature starts at negative four degrees Celsius and rises six degrees, model −4 + 6. A rise is a positive change on this scale; the negative start remains part of the equation.\n\n**Attach units to the conclusion.**\nThe sum is two, so the final reading is two degrees Celsius. Do not report six as the final reading: six describes the change, not the endpoint.\n\n**Check through the movement.**\nFrom negative four to zero takes four of the six upward units. Two more take the reading to positive two. This checks the sign and distance without relying on an unexplained slogan.\n\nIf a change is downward, use an added negative value. Keep reference, starting value and change consistent throughout the problem.",
      "example": "I DO:\nStart −4 °C; rise 6 °C.\nEquation: −4 + 6 = 2.\nConclusion: the final temperature is 2 °C.\n\nYOU TRY:\nStart 3 °C and fall 5 °C. Write the change as an added value.\n\nCHECK:\n3 + (−5) = −2, so the final reading is −2 °C.",
      "notice": "Separate the start, change and endpoint. They are not interchangeable labels.",
      "check": {
        "question": "A reading starts at −4 °C and rises 6 °C. What is the final reading?",
        "options": [
          "−10 °C",
          "6 °C",
          "−2 °C",
          "2 °C"
        ],
        "correct_index": 3,
        "explanation": "The positive change crosses zero and finishes two degrees above it."
      }
    }
  ],
  "worked_example": "I DO: A complete add integers as signed changes response.\nUse a one-unit number line with zero as reference. Values: −6, 0, 4 and −2.\n−6 + 4 = −2; 0 + (−2) = −2; 4 + (−6) = −2; −2 + (−6) = −8. Start −6 °C and rise 4 °C: −2 °C. Start 4 °C and fall 6 °C: −2 °C.\n\nWHY THE METHOD WORKS\nPosition represents signed value; distance from zero answers a different question. For addition, the first value is the starting position and the second is a signed change. Keep these roles separate whenever they occur in the task.\n\nCOMMON MISTAKE AND FIX\nDeleting a negative sign changes the value. Keep it attached and interpret it using the stated zero before continuing.\n\nCHECK\nRebuild the requested representation and read the conclusion in the supplied context. Use only the methods taught in this lesson, not an operation rule borrowed from a different topic.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 450 165\"><rect width=\"450\" height=\"165\" fill=\"#f5faf7\"/><line x1=\"25\" y1=\"80\" x2=\"425\" y2=\"80\" stroke=\"#173c2c\" stroke-width=\"3\"/><line x1=\"25.0\" y1=\"73\" x2=\"25.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"25.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-6</text><line x1=\"58.333333333333336\" y1=\"73\" x2=\"58.333333333333336\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"58.333333333333336\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-5</text><line x1=\"91.66666666666667\" y1=\"73\" x2=\"91.66666666666667\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"91.66666666666667\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-4</text><line x1=\"125.0\" y1=\"73\" x2=\"125.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"125.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-3</text><line x1=\"158.33333333333334\" y1=\"73\" x2=\"158.33333333333334\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"158.33333333333334\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-2</text><line x1=\"191.66666666666669\" y1=\"73\" x2=\"191.66666666666669\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"191.66666666666669\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-1</text><line x1=\"225.0\" y1=\"73\" x2=\"225.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"225.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">0</text><line x1=\"258.33333333333337\" y1=\"73\" x2=\"258.33333333333337\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"258.33333333333337\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">1</text><line x1=\"291.6666666666667\" y1=\"73\" x2=\"291.6666666666667\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"291.6666666666667\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">2</text><line x1=\"325.0\" y1=\"73\" x2=\"325.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"325.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">3</text><line x1=\"358.33333333333337\" y1=\"73\" x2=\"358.33333333333337\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"358.33333333333337\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">4</text><line x1=\"391.6666666666667\" y1=\"73\" x2=\"391.6666666666667\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"391.6666666666667\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">5</text><line x1=\"425.0\" y1=\"73\" x2=\"425.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"425.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">6</text><circle cx=\"125.0\" cy=\"80\" r=\"7\" fill=\"#9d3a19\"/><text x=\"225\" y=\"35\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"22\" fill=\"#173c2c\">Highlighted position: -3</text><text x=\"225\" y=\"148\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"20\" fill=\"#173c2c\">Left: smaller. Right: greater.</text></svg>",
      "alt": "A number line from -6 to 6, with equal one-unit intervals. -3 is highlighted. Values increase to the right.",
      "caption": "Position and distance from zero answer different questions."
    }
  ],
  "guided_practice": "WE DO: Work one supported example at a time.\n1. Mark zero and one-unit spacing. Locate −3 and 2 before checking: −3 is three left; 2 is two right.\n2. Add −3 and 2 using movement or cancellation. Feedback: −3 + 2 = −1.\n3. Explain the relevant sign, position or remaining contribution in your own words.\n4. Try a second example with −4 and 1 using the same method.\n5. Check after your attempt: −4 + 1 = −3.\n6. Describe one check that confirmed the answer or a change that repaired an error. A diagram or a clear written explanation is acceptable.",
  "independent_task": "YOU DO: Add integers as signed changes investigation (about 25–30 minutes).\n1. Calculate −6 + 4; 0 + (−2); 4 + (−6); −2 + (−6). Show a line movement or cancellation for each. Solve a temperature rising from −6 °C by 4 °C and one falling from 4 °C by 6 °C.\n2. Show each requested representation or calculation clearly; keep negative signs attached to values.\n3. Write a reason for two decisions using the taught reference, position or signed-change model.\n4. Check one result with a second representation and explain the agreement.\n5. State one improvement or confirmed check in your reflection.\nWork on paper or in the big box. Type a working summary if using paper; upload is optional.\nSuccess checklist: correct signs; labelled scale where used; requested results; two explanations; independent check; honest evidence record.",
  "response_prompt": "Which representation or check changed your understanding of add integers as signed changes, and why?",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "What is −3 + 5?",
      "options": [
        "-8",
        "2",
        "-2",
        "8"
      ],
      "correct_index": 1,
      "explanation": "Adding positive five moves five units right from negative three to two."
    },
    {
      "type": "multiple_choice",
      "question": "What is −2 + (−4)?",
      "options": [
        "6",
        "-2",
        "-6",
        "2"
      ],
      "correct_index": 2,
      "explanation": "Both addends are negative, so their leftward distances combine to negative six."
    },
    {
      "type": "multiple_choice",
      "question": "What is −7 + 3?",
      "options": [
        "-4",
        "4",
        "-10",
        "10"
      ],
      "correct_index": 0,
      "explanation": "Three opposite pairs cancel, leaving four negative units."
    },
    {
      "type": "multiple_choice",
      "question": "A reading starts at −4 °C and rises 6 °C. What is the final reading?",
      "options": [
        "−10 °C",
        "6 °C",
        "−2 °C",
        "2 °C"
      ],
      "correct_index": 3,
      "explanation": "The positive change crosses zero and finishes two degrees above it."
    },
    {
      "type": "multiple_choice",
      "question": "What is 2 + (−5)?",
      "options": [
        "3",
        "-3",
        "7",
        "-7"
      ],
      "correct_index": 1,
      "explanation": "Five leftward units from two end at negative three."
    },
    {
      "type": "multiple_choice",
      "question": "What is −6 + 2?",
      "options": [
        "4",
        "-8",
        "-4",
        "8"
      ],
      "correct_index": 2,
      "explanation": "Two rightward units from negative six end at negative four."
    },
    {
      "question": "Which comparison is true?",
      "options": [
        "−1 > −4",
        "−4 > −1",
        "0 < −4",
        "−1 = −4"
      ],
      "correct_index": 0,
      "explanation": "Negative one lies farther right than negative four.",
      "type": "multiple_choice"
    },
    {
      "type": "multiple_choice",
      "question": "What is −2 + 3?",
      "options": [
        "-5",
        "5",
        "-1",
        "1"
      ],
      "correct_index": 3,
      "explanation": "Adding positive three moves right from negative two to one."
    },
    {
      "type": "multiple_choice",
      "question": "What is −3 + (−2)?",
      "options": [
        "5",
        "-5",
        "1",
        "-1"
      ],
      "correct_index": 1,
      "explanation": "Both addends point left, giving five negative units."
    },
    {
      "type": "multiple_choice",
      "question": "What is −4 + 4?",
      "options": [
        "-8",
        "8",
        "0",
        "4"
      ],
      "correct_index": 2,
      "explanation": "Equal opposite contributions cancel to zero."
    }
  ],
  "parent_notes": "Parent: Teaches add integers as signed changes from definitions to explanation and application. Original content follows the repository’s topic sequence. Exact outcome codes are empty pending verified mapping; this is not a claim of complete syllabus coverage.\n\nParent: Look for explicit working and a check of signs, scale, notation or units as appropriate. A correct guess without a method is weaker evidence than an explained calculation. The lesson itself supplies the teaching and feedback. Your role is access support and reviewing the evidence.\n\nParent: Model task answers: −6 + 4 = −2; 0 + (−2) = −2; 4 + (−6) = −2; −2 + (−6) = −8. Start −6 °C and rise 4 °C: −2 °C. Start 4 °C and fall 6 °C: −2 °C.\n\nParent: Ten scored choices use the unchanged 90% threshold, requiring 9/10. The independent task and reflection supply written reasoning for manual review.",
  "evidence_instructions": "Keep the add integers as signed changes task working, explanation, checking record, reflection and quiz result.",
  "offline_alternative": "Copy the included examples and task prompts onto paper. Use the diagrams and models to complete the add integers as signed changes working without a service, then type an evidence summary later.",
  "extension": "Choose a new pair of signed integers and explain two different questions about them, such as order and distance. State the question before the answer.",
  "stage_hints": {
    "accept": [
      "Read the mission about add integers as signed changes.",
      "You will practise add integers as signed changes through models before making your own response.",
      "Begin with the first explanation of add integers as signed changes; the examples remain available while you work."
    ],
    "teach0": [
      "Find the starting point and added change separately.",
      "Use the added sign to decide the movement direction.",
      "Count equal intervals from the start and record the landing value."
    ],
    "teach1": [
      "Look at whether both contributions point the same way.",
      "Combine the distances while keeping their shared direction.",
      "Verify by moving from the first value in the direction of the second."
    ],
    "teach2": [
      "Compare the opposite-direction contributions.",
      "Pair equal positive and negative units until one direction remains.",
      "Use the unpaired direction for the sign and its distance for the size."
    ],
    "teach3": [
      "Label the starting measurement and signed change.",
      "Decide whether the change moves the reading up or down the same scale.",
      "Write the addition equation and check the path across the reference."
    ],
    "learn": [
      "Read the complete model before judging its result.",
      "Match each decision to the definition and representation used in this model.",
      "Explain one intermediate step and check that the final conclusion answers the original add integers as signed changes question."
    ],
    "guided": [
      "Start with the first supplied quantity and identify its role.",
      "Work one add integers as signed changes example before comparing with the feedback.",
      "Record the intermediate representation and test the result against it before continuing."
    ],
    "write": [
      "Copy the first add integers as signed changes task and label its quantities.",
      "Begin “The given information is ____. I will use ____ because ____.”",
      "A partial opening is “My first step is to represent ____. This shows ____.” Continue with your own working and result."
    ],
    "quiz": [
      "Return to the definition or method for the specific add integers as signed changes question.",
      "Check what the symbols ask for before comparing the options.",
      "Use the taught representation to work independently, then check the meaning and unit of the result."
    ],
    "submit": [
      "Check that your add integers as signed changes task and working are present.",
      "Include the add integers as signed changes reflection and any written reasoning you produced.",
      "Send your add integers as signed changes evidence for review; type a clear record if you used paper."
    ]
  }
}'), updated_at=datetime('now') WHERE seed_key='s4-mat-y7-w01-l3';

-- s4-mat-y7-w01-l4
UPDATE lessons SET title='Year 7: Integer fluency with checks', data=json_patch(data, '{
  "seed_key": "s4-mat-y7-w01-l4",
  "title": "Year 7: Integer fluency with checks",
  "stage": "S4",
  "learning_area": "Mathematics",
  "year_level": "Year 7",
  "week": 1,
  "lesson_number": 4,
  "duration_minutes": 60,
  "child_mission": "Investigate integer fluency with checks. Use a representation, show each decision and check the result.",
  "learning_intention": "We are learning to explain and apply integer fluency with checks.",
  "success_criteria": [
    "I can explain the key number idea with an example.",
    "I can use the taught representation or calculation method.",
    "I can show a reason for my result.",
    "I can check a result and interpret it accurately."
  ],
  "materials": [
    "Everything you need to read is included in this lesson",
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
  "spelling_focus": null,
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
      "icon": "🔎",
      "title": "Define integers and the reference zero",
      "explain": "**An integer is a whole-number value with a sign when needed.**\nThe integers include negative whole numbers, zero and positive whole numbers: for example, negative three, zero and four. Fractions such as one half are not integers. The word whole in this explanation concerns the size of the unit, not a rule that the sign must be positive.\n\n**Zero is a reference point.**\nA signed value describes a position relative to zero. On a temperature scale, a negative reading is below zero degrees Celsius. In a floor model, negative levels can be below the ground reference. Choose and state the reference before interpreting the sign.\n\n**Positive and negative are directions from the reference.**\nA plus sign can be written for a positive value, but it is often omitted. A minus sign attached to a numeral marks a negative value. Zero is neither positive nor negative.\n\nDo not assume that negative means physically impossible or that it always means bad. Its meaning depends on the chosen reference and context.",
      "example": "I DO:\nI use ground level as zero. A position two levels below it is −2; three levels above it is +3, usually written 3. A ground-level position is 0.\nTemperature example: −4 °C is four degrees below zero, not a count of negative objects.\n\nYOU TRY:\nWith sea level defined as zero, describe a point five metres below it.\n\nCHECK:\nThe signed height is −5 m. State the reference because a different zero would change the description.",
      "notice": "A negative position is not a fractional unit. Separate the sign from the kind of number.",
      "check": {
        "question": "Which statement correctly describes zero?",
        "options": [
          "It is always positive",
          "It is always negative",
          "It is an integer that is neither positive nor negative",
          "It is not a number"
        ],
        "correct_index": 2,
        "explanation": "Zero belongs to the integers but is neither positive nor negative; it is the reference between the two directions."
      },
      "visual": [
        {
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 450 165\"><rect width=\"450\" height=\"165\" fill=\"#f5faf7\"/><line x1=\"25\" y1=\"80\" x2=\"425\" y2=\"80\" stroke=\"#173c2c\" stroke-width=\"3\"/><line x1=\"25.0\" y1=\"73\" x2=\"25.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"25.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-6</text><line x1=\"58.333333333333336\" y1=\"73\" x2=\"58.333333333333336\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"58.333333333333336\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-5</text><line x1=\"91.66666666666667\" y1=\"73\" x2=\"91.66666666666667\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"91.66666666666667\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-4</text><line x1=\"125.0\" y1=\"73\" x2=\"125.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"125.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-3</text><line x1=\"158.33333333333334\" y1=\"73\" x2=\"158.33333333333334\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"158.33333333333334\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-2</text><line x1=\"191.66666666666669\" y1=\"73\" x2=\"191.66666666666669\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"191.66666666666669\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-1</text><line x1=\"225.0\" y1=\"73\" x2=\"225.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"225.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">0</text><line x1=\"258.33333333333337\" y1=\"73\" x2=\"258.33333333333337\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"258.33333333333337\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">1</text><line x1=\"291.6666666666667\" y1=\"73\" x2=\"291.6666666666667\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"291.6666666666667\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">2</text><line x1=\"325.0\" y1=\"73\" x2=\"325.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"325.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">3</text><line x1=\"358.33333333333337\" y1=\"73\" x2=\"358.33333333333337\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"358.33333333333337\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">4</text><line x1=\"391.6666666666667\" y1=\"73\" x2=\"391.6666666666667\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"391.6666666666667\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">5</text><line x1=\"425.0\" y1=\"73\" x2=\"425.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"425.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">6</text><circle cx=\"125.0\" cy=\"80\" r=\"7\" fill=\"#9d3a19\"/><text x=\"225\" y=\"35\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"22\" fill=\"#173c2c\">Highlighted position: -3</text><text x=\"225\" y=\"148\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"20\" fill=\"#173c2c\">Left: smaller. Right: greater.</text></svg>",
          "alt": "A number line from -6 to 6, with equal one-unit intervals. -3 is highlighted. Values increase to the right.",
          "caption": "Position and distance from zero answer different questions."
        }
      ]
    },
    {
      "icon": "🔎",
      "title": "Separate value from distance",
      "explain": "**Absolute value measures distance from zero.**\nDistance is non-negative. The notation |−3| means the distance of negative three from zero, which is three. Similarly, |3| is three. The bars here are absolute-value notation, not brackets telling you to change every sign in an expression.\n\n**Opposites have equal distance and opposite sides.**\nThree and negative three are opposites. Their number-line points mirror each other across zero. Zero is its own opposite.\n\n**Distance does not decide ordinary order.**\nNegative five is farther from zero than negative two, but it lies farther left and is a smaller value. Ask whether the task concerns signed value, distance or an opposite before answering.\n\nUse the number line when the notation is unfamiliar. First identify the point, then count its distance to zero.",
      "example": "I DO:\nValue: −5. Distance from zero: |−5| = 5. Opposite: 5.\nFor 2, the distance is 2 and the opposite is −2.\n\nYOU TRY:\nFind the distance and opposite for −4. Give the two answers separate labels.\n\nCHECK:\nDistance: 4. Opposite: 4. These happen to have the same numeral in this example, but they are answers to different questions. For positive four, distance stays four while its opposite is negative four.",
      "notice": "Absolute value is distance. It does not mean that negative values are larger in ordinary order.",
      "check": {
        "question": "What does |−5| describe?",
        "options": [
          "A signed value smaller than −5",
          "A distance of five units from zero",
          "A rule that −5 is greater than 2",
          "A fractional interval"
        ],
        "correct_index": 1,
        "explanation": "Absolute value gives the non-negative distance from zero, which is five units for −5."
      }
    },
    {
      "icon": "🔎",
      "title": "Order by position, not digit size",
      "explain": "**Greater values lie farther right.**\nThis rule includes negative integers, zero and positive integers. On the line, negative two lies right of negative five, so negative two is greater. The numeral five being larger than two does not reverse their signed positions.\n\n**Compare across zero first.**\nA positive integer is greater than zero; zero is greater than a negative integer. If the two values lie on opposite sides, their positions already determine the comparison.\n\n**Compare two negatives carefully.**\nThe one closer to zero lies farther right and is greater. The one with a larger distance from zero lies farther left and is smaller. That statement concerns two negative values, not all possible numbers.\n\nLocate both points or sketch the relevant interval before recording a sign. Explain position as evidence.",
      "example": "I DO:\n−2 > −5 because −2 lies to the right of −5.\n−5 < 1 because −5 is left of zero and 1 is right of zero.\n\nYOU TRY:\nCompare −4 and −1 on a number line.\n\nCHECK:\n−4 < −1. Negative one is nearer zero and farther right, so it is the greater signed value.",
      "notice": "A larger absolute value does not mean a larger signed value.",
      "check": {
        "question": "Which statement is true?",
        "options": [
          "−5 > −2",
          "−2 > −5",
          "−2 = −5",
          "Every negative integer exceeds zero"
        ],
        "correct_index": 1,
        "explanation": "Negative two lies farther right than negative five on the number line, so it is greater."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Check the method for integer fluency with checks",
            "transcript": "Pip: I am working on integer fluency with checks. I need to know what the notation asks.\nJuno: An integer is a whole-number value with a sign when needed.\nThe integers include negative whole numbers, zero and positive whole numbers: for example, negative three, zero and four. Fractions such as one half are not integers. The word whole in this explanation concerns the size of the unit, not a rule that the sign must be positive.\nPip: I use ground level as zero. A position two levels below it is −2; three levels above it is +3, usually written 3. A ground-level position is 0.\nTemperature example: −4 °C is four degrees below zero, not a count of negative objects.\nJuno: Pause and try a fresh example with this method. Check it against the representation before continuing.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "I am working on integer fluency with checks. I need to know what the notation asks."
                  },
                  {
                    "who": "juno",
                    "text": "An integer is a whole-number value with a sign when needed.\nThe integers include negative whole numbers, zero and positive whole numbers: for example, negative three, zero and four. Fractions such as one half are not integers. The word whole in this explanation concerns the size of the unit, not a rule that the sign must be positive."
                  },
                  {
                    "who": "pip",
                    "text": "I use ground level as zero. A position two levels below it is −2; three levels above it is +3, usually written 3. A ground-level position is 0.\nTemperature example: −4 °C is four degrees below zero, not a count of negative objects."
                  },
                  {
                    "who": "juno",
                    "text": "Pause and try a fresh example with this method. Check it against the representation before continuing.",
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
      "icon": "🔎",
      "title": "Treat addition as a signed change",
      "explain": "**The starting value and added change have different jobs.**\nIn negative three plus five, negative three is the start and positive five is the change. Begin at the starting point, then apply the added value. Do not always begin at zero.\n\n**An added positive value moves right.**\nAn added negative value moves left. The numeral gives the distance. This movement model explains addition; it is not yet a rule for subtracting negatives.\n\n**Count equal intervals.**\nFrom negative three, five steps right pass through negative two, negative one, zero, one and two. Count movements rather than including the starting tick as an extra step.\n\nRecord the equation and movement in words so the result can be checked. A negative starting value can lead to a positive result when the rightward change is large enough.",
      "example": "I DO:\n−3 + 5 = 2. Start at −3 and move five units right.\n2 + (−4) = −2. Start at 2 and move four units left.\n\nYOU TRY:\nStart at −2 and add 3. Count the movements.\n\nCHECK:\n−2 + 3 = 1. You pass through −1, 0 and 1.",
      "notice": "Use the added value for direction. The starting sign does not decide every movement.",
      "check": {
        "question": "What is −3 + 5?",
        "options": [
          "-8",
          "2",
          "-2",
          "8"
        ],
        "correct_index": 1,
        "explanation": "Adding positive five moves five units right from negative three to two."
      }
    },
    {
      "icon": "🔎",
      "title": "Balance opposite-direction changes",
      "explain": "**Opposite contributions can cancel in pairs.**\nOne positive unit and one negative unit sum to zero. Pair as many opposite units as possible; the unpaired contribution determines the result.\n\n**Compare distances when signs differ.**\nFor negative seven plus three, three pairs cancel and four negative units remain. The result is negative four. For negative three plus seven, four positive units remain instead.\n\n**Equal opposite values give zero.**\nNegative five plus five equals zero. Zero is a valid result, not a missing answer. This also provides a useful check for opposites.\n\nSay which contribution remains before writing the sign. Subtracting the distances without explaining the remaining direction can produce the correct size with the wrong sign.",
      "example": "I DO:\n−7 + 3 = −4: three positive units cancel three of the seven negative units.\n−3 + 7 = 4: three negative units cancel three positive units.\n\nYOU TRY:\nFind −6 + 4 using cancellation or a line movement.\n\nCHECK:\n−2. Four opposite pairs cancel and two negative units remain.",
      "notice": "The remaining direction gives the sign. Merely taking the difference of magnitudes is incomplete.",
      "check": {
        "question": "What is −7 + 3?",
        "options": [
          "-4",
          "4",
          "-10",
          "10"
        ],
        "correct_index": 0,
        "explanation": "Three opposite pairs cancel, leaving four negative units."
      }
    }
  ],
  "worked_example": "I DO: A complete integer fluency with checks response.\nUse a one-unit number line with zero as reference. Values: −6, 0, 4 and −2.\nDistances: 6, 0, 4, 2. Ascending: −6, −2, 0, 4. Sums: −6 + 4 = −2 and −2 + (−6) = −8. The larger distance of −6 does not make it greater than −2.\n\nWHY THE METHOD WORKS\nPosition represents signed value; distance from zero answers a different question. For addition, the first value is the starting position and the second is a signed change. Keep these roles separate whenever they occur in the task.\n\nCOMMON MISTAKE AND FIX\nCalling −6 greater than −2 because six exceeds two confuses distance with signed value. Locate the points and use the one farther right as the greater value.\n\nCHECK\nRebuild the requested representation and read the conclusion in the supplied context. Use only the methods taught in this lesson, not an operation rule borrowed from a different topic.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 450 165\"><rect width=\"450\" height=\"165\" fill=\"#f5faf7\"/><line x1=\"25\" y1=\"80\" x2=\"425\" y2=\"80\" stroke=\"#173c2c\" stroke-width=\"3\"/><line x1=\"25.0\" y1=\"73\" x2=\"25.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"25.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-6</text><line x1=\"58.333333333333336\" y1=\"73\" x2=\"58.333333333333336\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"58.333333333333336\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-5</text><line x1=\"91.66666666666667\" y1=\"73\" x2=\"91.66666666666667\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"91.66666666666667\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-4</text><line x1=\"125.0\" y1=\"73\" x2=\"125.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"125.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-3</text><line x1=\"158.33333333333334\" y1=\"73\" x2=\"158.33333333333334\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"158.33333333333334\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-2</text><line x1=\"191.66666666666669\" y1=\"73\" x2=\"191.66666666666669\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"191.66666666666669\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">-1</text><line x1=\"225.0\" y1=\"73\" x2=\"225.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"225.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">0</text><line x1=\"258.33333333333337\" y1=\"73\" x2=\"258.33333333333337\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"258.33333333333337\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">1</text><line x1=\"291.6666666666667\" y1=\"73\" x2=\"291.6666666666667\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"291.6666666666667\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">2</text><line x1=\"325.0\" y1=\"73\" x2=\"325.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"325.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">3</text><line x1=\"358.33333333333337\" y1=\"73\" x2=\"358.33333333333337\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"358.33333333333337\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">4</text><line x1=\"391.6666666666667\" y1=\"73\" x2=\"391.6666666666667\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"391.6666666666667\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">5</text><line x1=\"425.0\" y1=\"73\" x2=\"425.0\" y2=\"87\" stroke=\"#173c2c\"/><text x=\"425.0\" y=\"115\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">6</text><circle cx=\"125.0\" cy=\"80\" r=\"7\" fill=\"#9d3a19\"/><text x=\"225\" y=\"35\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"22\" fill=\"#173c2c\">Highlighted position: -3</text><text x=\"225\" y=\"148\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"20\" fill=\"#173c2c\">Left: smaller. Right: greater.</text></svg>",
      "alt": "A number line from -6 to 6, with equal one-unit intervals. -3 is highlighted. Values increase to the right.",
      "caption": "Position and distance from zero answer different questions."
    }
  ],
  "guided_practice": "WE DO: Work one supported example at a time.\n1. Mark zero and one-unit spacing. Locate −3 and 2 before checking: −3 is three left; 2 is two right.\n2. Add −3 and 2 using movement or cancellation. Feedback: −3 + 2 = −1.\n3. Explain the relevant sign, position or remaining contribution in your own words.\n4. Try a second example with −4 and 1 using the same method.\n5. Check after your attempt: −4 + 1 = −3.\n6. Describe one check that confirmed the answer or a change that repaired an error. A diagram or a clear written explanation is acceptable.",
  "independent_task": "YOU DO: Integer fluency with checks investigation (about 25–30 minutes).\n1. Give the distances of −6, 0, 4 and −2, then order their signed values. Calculate −6 + 4 and −2 + (−6). Explain why distance and signed order can produce different comparisons.\n2. Show each requested representation or calculation clearly; keep negative signs attached to values.\n3. Write a reason for two decisions using the taught reference, position or signed-change model.\n4. Check one result with a second representation and explain the agreement.\n5. State one improvement or confirmed check in your reflection.\nWork on paper or in the big box. Type a working summary if using paper; upload is optional.\nSuccess checklist: correct signs; labelled scale where used; requested results; two explanations; independent check; honest evidence record.",
  "response_prompt": "Which representation or check changed your understanding of integer fluency with checks, and why?",
  "quiz": [
    {
      "question": "Which statement correctly describes zero?",
      "options": [
        "It is always positive",
        "It is always negative",
        "It is an integer that is neither positive nor negative",
        "It is not a number"
      ],
      "correct_index": 2,
      "explanation": "Zero belongs to the integers but is neither positive nor negative; it is the reference between the two directions.",
      "type": "multiple_choice"
    },
    {
      "question": "What does |−5| describe?",
      "options": [
        "A signed value smaller than −5",
        "A distance of five units from zero",
        "A rule that −5 is greater than 2",
        "A fractional interval"
      ],
      "correct_index": 1,
      "explanation": "Absolute value gives the non-negative distance from zero, which is five units for −5.",
      "type": "multiple_choice"
    },
    {
      "question": "Which statement is true?",
      "options": [
        "−5 > −2",
        "−2 > −5",
        "−2 = −5",
        "Every negative integer exceeds zero"
      ],
      "correct_index": 1,
      "explanation": "Negative two lies farther right than negative five on the number line, so it is greater.",
      "type": "multiple_choice"
    },
    {
      "type": "multiple_choice",
      "question": "What is −3 + 5?",
      "options": [
        "-8",
        "2",
        "-2",
        "8"
      ],
      "correct_index": 1,
      "explanation": "Adding positive five moves five units right from negative three to two."
    },
    {
      "type": "multiple_choice",
      "question": "What is −7 + 3?",
      "options": [
        "-4",
        "4",
        "-10",
        "10"
      ],
      "correct_index": 0,
      "explanation": "Three opposite pairs cancel, leaving four negative units."
    },
    {
      "type": "multiple_choice",
      "question": "Which value is opposite to −4?",
      "options": [
        "-4",
        "4",
        "0",
        "8"
      ],
      "correct_index": 1,
      "explanation": "Opposites are equally far from zero on different sides."
    },
    {
      "type": "multiple_choice",
      "question": "What is |−6|?",
      "options": [
        "-6",
        "0",
        "6",
        "12"
      ],
      "correct_index": 2,
      "explanation": "Absolute value gives the non-negative distance from zero."
    },
    {
      "question": "Which comparison is true?",
      "options": [
        "−1 > −4",
        "−4 > −1",
        "0 < −4",
        "−1 = −4"
      ],
      "correct_index": 0,
      "explanation": "Negative one lies farther right than negative four.",
      "type": "multiple_choice"
    },
    {
      "type": "multiple_choice",
      "question": "What is −2 + 3?",
      "options": [
        "-5",
        "5",
        "-1",
        "1"
      ],
      "correct_index": 3,
      "explanation": "Adding positive three moves right from negative two to one."
    },
    {
      "type": "multiple_choice",
      "question": "What is −3 + (−2)?",
      "options": [
        "5",
        "-5",
        "1",
        "-1"
      ],
      "correct_index": 1,
      "explanation": "Both addends point left, giving five negative units."
    }
  ],
  "parent_notes": "Parent: Teaches integer fluency with checks from definitions to explanation and application. Original content follows the repository’s topic sequence. Exact outcome codes are empty pending verified mapping; this is not a claim of complete syllabus coverage.\n\nParent: Look for explicit working and a check of signs, scale, notation or units as appropriate. A correct guess without a method is weaker evidence than an explained calculation. The lesson itself supplies the teaching and feedback. Your role is access support and reviewing the evidence.\n\nParent: Model task answers: Distances: 6, 0, 4, 2. Ascending: −6, −2, 0, 4. Sums: −6 + 4 = −2 and −2 + (−6) = −8. The larger distance of −6 does not make it greater than −2.\n\nParent: Ten scored choices use the unchanged 90% threshold, requiring 9/10. The independent task and reflection supply written reasoning for manual review.",
  "evidence_instructions": "Keep the integer fluency with checks task working, explanation, checking record, reflection and quiz result.",
  "offline_alternative": "Copy the included examples and task prompts onto paper. Use the diagrams and models to complete the integer fluency with checks working without a service, then type an evidence summary later.",
  "extension": "Choose a new pair of signed integers and explain two different questions about them, such as order and distance. State the question before the answer.",
  "stage_hints": {
    "accept": [
      "Read the mission about integer fluency with checks.",
      "You will practise integer fluency with checks through models before making your own response.",
      "Begin with the first explanation of integer fluency with checks; the examples remain available while you work."
    ],
    "teach0": [
      "Look back at the reference used to interpret the sign.",
      "Decide whether the position is above, at or below the chosen zero.",
      "State the reference, direction and number of units before writing a signed value."
    ],
    "teach1": [
      "Find the signed point before thinking about distance.",
      "Separate the labels value, distance and opposite.",
      "Count to zero for distance; reflect across zero for the opposite."
    ],
    "teach2": [
      "Look at the two points relative to zero.",
      "Locate the value farther right before choosing a symbol.",
      "Use number-line position as the reason; keep distance from zero separate."
    ],
    "teach3": [
      "Find the starting point and added change separately.",
      "Use the added sign to decide the movement direction.",
      "Count equal intervals from the start and record the landing value."
    ],
    "teach4": [
      "Compare the opposite-direction contributions.",
      "Pair equal positive and negative units until one direction remains.",
      "Use the unpaired direction for the sign and its distance for the size."
    ],
    "learn": [
      "Read the complete model before judging its result.",
      "Match each decision to the definition and representation used in this model.",
      "Explain one intermediate step and check that the final conclusion answers the original integer fluency with checks question."
    ],
    "guided": [
      "Start with the first supplied quantity and identify its role.",
      "Work one integer fluency with checks example before comparing with the feedback.",
      "Record the intermediate representation and test the result against it before continuing."
    ],
    "write": [
      "Copy the first integer fluency with checks task and label its quantities.",
      "Begin “The given information is ____. I will use ____ because ____.”",
      "A partial opening is “My first step is to represent ____. This shows ____.” Continue with your own working and result."
    ],
    "quiz": [
      "Return to the definition or method for the specific integer fluency with checks question.",
      "Check what the symbols ask for before comparing the options.",
      "Use the taught representation to work independently, then check the meaning and unit of the result."
    ],
    "submit": [
      "Check that your integer fluency with checks task and working are present.",
      "Include the integer fluency with checks reflection and any written reasoning you produced.",
      "Send your integer fluency with checks evidence for review; type a clear record if you used paper."
    ]
  }
}'), updated_at=datetime('now') WHERE seed_key='s4-mat-y7-w01-l4';

-- s2-mat-y4-w01-l1
UPDATE lessons SET title='Year 4: Read and count whole numbers', data=json_patch(data, '{
  "seed_key": "s2-mat-y4-w01-l1",
  "title": "Year 4: Read and count whole numbers",
  "stage": "S2",
  "learning_area": "Mathematics",
  "year_level": "Year 4",
  "week": 1,
  "lesson_number": 1,
  "duration_minutes": 60,
  "child_mission": "Become a Number Investigator! Use place groups to solve read and count whole numbers tasks and explain how you checked.",
  "learning_intention": "We are learning to read and count whole numbers within the range to 100,000.",
  "success_criteria": [
    "I can read a numeral through its place groups.",
    "I can match a digit to its value.",
    "I can show a correct partition or comparison.",
    "I can check an answer and explain my reason."
  ],
  "materials": [
    "Everything you need to read is included in this lesson",
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
  "spelling_focus": null,
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
      "title": "Build the number from equal groups",
      "explain": "**A whole number counts complete units.**\nAn item count such as a number of cards uses whole units, not parts of one card. Large counts are organised into equal groups so we do not have to count every item again.\n\n**Each place is ten times the place to its right.**\nTen ones make a ten. Ten tens make a hundred. Ten hundreds make a thousand. Ten thousands make a ten thousand. Picture bundling ten small groups into one larger group. The written places record how many of each group there are.\n\n**Keep the range in view.**\nToday we read whole numbers up to 100,000. A new place appears when every lower place reaches nine and one more unit is added. This is a change in grouping, not a new kind of number.\n\nStart at the ones place on the right. Name each column before reading its digit; a digit’s shape alone does not tell its value.",
      "example": "I DO:\n64,518 has 8 ones at the right. The next column records tens, then hundreds, then thousands, then ten thousands. I use columns instead of counting 64,518 individual cards.\n\nYOU TRY:\nHow many tens make one hundred? Use equal bundles before checking.\n\nCHECK:\nTen tens make one hundred because ten groups of ten contain a hundred units. It is not one ten with a different name.",
      "notice": "Read from the right to identify places, then from the left to say the whole number.",
      "check": {
        "question": "What happens when ten hundreds are grouped together?",
        "options": [
          "They become ten ones",
          "They become one thousand",
          "They become one hundred",
          "They disappear from the count"
        ],
        "correct_index": 1,
        "explanation": "Ten groups of one hundred contain one thousand units. Regrouping changes the grouping, not the total."
      },
      "visual": [
        {
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 450 190\"><rect width=\"450\" height=\"190\" fill=\"#f5faf7\"/><rect x=\"0.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"45.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Ten</text><text x=\"45.0\" y=\"64\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">thousands</text><text x=\"45.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">6</text><text x=\"45.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">60,000</text><rect x=\"90.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"135.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Thousands</text><text x=\"135.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">4</text><text x=\"135.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">4,000</text><rect x=\"180.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"225.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Hundreds</text><text x=\"225.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">5</text><text x=\"225.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">500</text><rect x=\"270.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"315.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Tens</text><text x=\"315.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">1</text><text x=\"315.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">10</text><rect x=\"360.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"405.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Ones</text><text x=\"405.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">8</text><text x=\"405.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">8</text></svg>",
          "alt": "A place-value chart for 64,518. Ten thousands: digit 6, value 60,000, Thousands: digit 4, value 4,000, Hundreds: digit 5, value 500, Tens: digit 1, value 10, Ones: digit 8, value 8.",
          "caption": "A digit’s column gives its value."
        }
      ]
    },
    {
      "icon": "📖",
      "title": "Read the digits through their places",
      "explain": "**Digit and value are different.**\nA digit is a written symbol from zero to nine. Its value depends on the place. A four in the hundreds column means four hundreds; in the ones column it means four ones.\n\n**Read a useful chunk.**\nIn 64,518, separate the thousands part from the final three digits. Read the thousands part, then the hundreds, tens and ones that follow. A space or comma can help group digits; it does not mean a decimal point.\n\n**Say the number in words.**\nOur model is “sixty-four thousand five hundred and eighteen”. Say the number, point to each matching part and check that you did not turn a digit into the wrong-sized group.\n\nThe same method works with fewer or more non-zero places. The number of digits gives a starting clue, but the position of each digit settles its value.",
      "example": "I DO:\n64,518 = 60,000 + 4,000 + 500 + 10 + 8.\nWords: sixty-four thousand five hundred and eighteen.\nI match each spoken group with its column, then read the whole count once.\n\nYOU TRY:\nRead 60,426 using the columns. Try before comparing.\n\nCHECK:\nIt is sixty thousand four hundred and twenty-six. The zero column contributes no groups of that size, but still holds its place.",
      "notice": "Do not read every digit as a separate number name when the task asks for the whole number.",
      "check": {
        "question": "Which words correctly read 64,518?",
        "options": [
          "sixty-four thousand six hundred and eighteen",
          "sixty-four thousand four hundred and eighteen",
          "sixty-four thousand five hundred and eighteen",
          "sixty-four thousand five hundred and twenty-eight"
        ],
        "correct_index": 2,
        "explanation": "Sixty-four thousand five hundred and eighteen matches the thousands part and the remaining hundreds, tens and ones. The other readings change a digit’s value."
      }
    },
    {
      "icon": "📖",
      "title": "Keep zero as a place holder",
      "explain": "**Zero can hold an empty column.**\nIt says there are no groups of that size. It is still important because it keeps the other digits in their intended places. Deleting an internal zero shifts later digits and changes the value.\n\n**Compare two readings.**\nRead 60,426 in the chart. Identify the zero column before saying the complete number. It does not make the entire count zero. It only marks an empty place within the count.\n\n**Write from words with the same care.**\nWrite the needed place columns first. Fill each stated group, then use zero for a column with no group. Check the result by reading it back. This is safer than writing only the non-zero digits you hear.\n\nWhen using expanded form, you can omit a zero term because it adds nothing. When writing the numeral, preserve the column itself.",
      "example": "I DO:\n60,426 = 60,000 + 400 + 20 + 6.\nI preserve its zero column in the numeral. Omitting a zero term from the sum does not allow me to omit the place from the numeral.\n\nYOU TRY:\nWrite “sixty thousand four hundred and twenty-six” from its place groups, then read your result back.\n\nCHECK:\nThe numeral is 60,426. Compare every column, not just the digits you pronounced.",
      "notice": "A place holder is part of the numeral’s structure. Empty is not the same as missing.",
      "check": {
        "question": "Why keep an internal zero when writing a whole number?",
        "options": [
          "It makes all other digits worthless",
          "It means the whole count is zero",
          "It is only decoration",
          "It preserves the positions of the other digits"
        ],
        "correct_index": 3,
        "explanation": "The zero marks an empty place and keeps later digits in their intended columns. Removing it changes those positions."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Read and count whole numbers in action",
            "transcript": "Pip: I am practising how to keep zero as a place holder. I need to track the value, not just copy digits.\nJuno: Zero can hold an empty column.\nIt says there are no groups of that size. It is still important because it keeps the other digits in their intended places. Deleting an internal zero shifts later digits and changes the value.\nPip: 60,426 = 60,000 + 400 + 20 + 6.\nI preserve its zero column in the numeral. Omitting a zero term from the sum does not allow me to omit the place from the numeral.\nJuno: Pause and try a fresh example with the same check. Explain what stays unchanged or which value relationship settles the result.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "I am practising how to keep zero as a place holder. I need to track the value, not just copy digits."
                  },
                  {
                    "who": "juno",
                    "text": "Zero can hold an empty column.\nIt says there are no groups of that size. It is still important because it keeps the other digits in their intended places. Deleting an internal zero shifts later digits and changes the value."
                  },
                  {
                    "who": "pip",
                    "text": "60,426 = 60,000 + 400 + 20 + 6.\nI preserve its zero column in the numeral. Omitting a zero term from the sum does not allow me to omit the place from the numeral."
                  },
                  {
                    "who": "juno",
                    "text": "Pause and try a fresh example with the same check. Explain what stays unchanged or which value relationship settles the result.",
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
      "title": "Cross a counting boundary and check",
      "explain": "**One more can change several digits.**\nWhen the ones reach nine, the next unit completes a ten. When every lower column reaches nine, the next unit completes the next larger group. Think about bundling rather than simply putting an extra digit at the end.\n\n**Use a known boundary.**\nAfter 99,999 comes 100,000. The lower nines regroup into one new leading unit. The zeroes show that no leftover smaller groups remain. The count increases by one, not by a whole extra set of unrelated digits.\n\n**Check in both directions.**\nCount one forward and one back. If the previous number returns, the step fits. Explain the changed groups so you know why the written change happened.\n\nWhen a task asks you to count, check its step size too. Counting by one and counting by ten are different jobs; do not silently change the step.",
      "example": "I DO:\n99,998, 99,999, 100,000.\nI bundle the completed lower groups. Backwards: 100,000, 99,999, 99,998.\n\nYOU TRY:\nWhat is one more than 64,518? Which column changes?\n\nCHECK:\nIt is 64,519. Only the final ones digit changes here because no lower group is completed. A boundary can change more columns, but not every counting step does.",
      "notice": "Count the units and explain regrouping. Attaching a zero would multiply a number by ten, not add one.",
      "check": {
        "question": "What comes immediately after 99,999 when counting by one?",
        "options": [
          "100,000",
          "100,009",
          "99,998",
          "1,000,000"
        ],
        "correct_index": 0,
        "explanation": "100,000 is one greater than 99,999; the completed lower groups regroup into the next place."
      }
    }
  ],
  "worked_example": "I DO: Complete a connected read and count whole numbers record.\nTarget numeral: 64,518. Words: sixty-four thousand five hundred and eighteen.\nStandard partition: 60,000 + 4,000 + 500 + 10 + 8.\nHundreds digit: 5; value: 500.\nAnother partition: 64,418 + 100 = 64,518.\nComparison: 64,518 > 60,426. I compare matching places from the left; the first unequal place decides. The difference is 4,092.\nAscending set: 60,426, 64,518, 64,618.\n\nWHY THE REPRESENTATIONS AGREE\nThe written numeral, words and expanded sum describe the same place groups. The non-standard partition also returns the same total. Comparing uses those group values, not only the shape of a single digit.\n\nCOMMON MISTAKE AND FIX\nWriting the hundreds digit’s value as 5 loses its unit size. I change the value label to 500. Another possible error is deleting the zero in 60,426; I keep its column and reread the whole count.\n\nCHECK\nI rebuild the numeral from its non-zero terms and read the comparison in both directions. If a check disagrees, I revisit the relevant column before changing unrelated digits.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 450 190\"><rect width=\"450\" height=\"190\" fill=\"#f5faf7\"/><rect x=\"0.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"45.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Ten</text><text x=\"45.0\" y=\"64\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">thousands</text><text x=\"45.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">6</text><text x=\"45.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">60,000</text><rect x=\"90.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"135.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Thousands</text><text x=\"135.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">0</text><text x=\"135.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">0</text><rect x=\"180.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"225.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Hundreds</text><text x=\"225.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">4</text><text x=\"225.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">400</text><rect x=\"270.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"315.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Tens</text><text x=\"315.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">2</text><text x=\"315.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">20</text><rect x=\"360.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"405.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Ones</text><text x=\"405.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">6</text><text x=\"405.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">6</text></svg>",
      "alt": "A place-value chart for 60,426. Ten thousands: digit 6, value 60,000, Thousands: digit 0, value 0, Hundreds: digit 4, value 400, Tens: digit 2, value 20, Ones: digit 6, value 6.",
      "caption": "A digit’s column gives its value."
    }
  ],
  "guided_practice": "WE DO: Prepare a second record using 60,426.\n1. Label the columns and insert the digits. Read it before comparing with “sixty thousand four hundred and twenty-six”.\n2. Find the hundreds digit and its contribution. Compare after your attempt: 400.\n3. Partition it. Check against 60,000 + 400 + 20 + 6, then add those terms back.\n4. Compare 60,426 with 64,518; name the first unequal place rather than choosing by the final digit.\n5. Make one different partition by setting aside a hundred. Check: 60,326 + 100.\n6. Explain one check you used. If you made an error, repair only the mismatched place and read the result again.\nYou can draw the chart or describe it in text. The explanation matters more than decorative layout.",
  "independent_task": "YOU DO: Read and count whole numbers record (about 20 minutes).\nUse these numbers: 64,721; 60,536; 64,506; 60,406.\n1. Say what each part of the task asks before answering: numeral, words, place value, partition or order.\n2. Write each numeral in words and give the next two counts by one. Explain what happens at the range boundary.\n3. Show working for at least two decisions with a labelled chart, equation or comparison reason.\n4. Check those decisions by rebuilding a total, reading words back or comparing neighbouring values.\n5. Explain one improvement or one check that confirmed a correct answer.\nWork on paper or in the big box. If using paper, type the answers and a clear working summary. Check: correct range and places; zeroes preserved; complete requested representations; a specific reason and a check. An upload is optional.",
  "response_prompt": "Which place-group or representation check helped most in your read and count whole numbers record?",
  "quiz": [
    {
      "question": "What happens when ten hundreds are grouped together?",
      "options": [
        "They become ten ones",
        "They become one thousand",
        "They become one hundred",
        "They disappear from the count"
      ],
      "correct_index": 1,
      "explanation": "Ten groups of one hundred contain one thousand units. Regrouping changes the grouping, not the total.",
      "type": "multiple_choice"
    },
    {
      "question": "Which words correctly read 64,518?",
      "options": [
        "sixty-four thousand six hundred and eighteen",
        "sixty-four thousand four hundred and eighteen",
        "sixty-four thousand five hundred and eighteen",
        "sixty-four thousand five hundred and twenty-eight"
      ],
      "correct_index": 2,
      "explanation": "Sixty-four thousand five hundred and eighteen matches the thousands part and the remaining hundreds, tens and ones. The other readings change a digit’s value.",
      "type": "multiple_choice"
    },
    {
      "question": "Why keep an internal zero when writing a whole number?",
      "options": [
        "It makes all other digits worthless",
        "It means the whole count is zero",
        "It is only decoration",
        "It preserves the positions of the other digits"
      ],
      "correct_index": 3,
      "explanation": "The zero marks an empty place and keeps later digits in their intended columns. Removing it changes those positions.",
      "type": "multiple_choice"
    },
    {
      "question": "What comes immediately after 99,999 when counting by one?",
      "options": [
        "100,000",
        "100,009",
        "99,998",
        "1,000,000"
      ],
      "correct_index": 0,
      "explanation": "100,000 is one greater than 99,999; the completed lower groups regroup into the next place.",
      "type": "multiple_choice"
    },
    {
      "type": "multiple_choice",
      "question": "What is one more than 64,518?",
      "options": [
        "64528",
        "64519",
        "64618",
        "64517"
      ],
      "correct_index": 1,
      "explanation": "Counting by one adds exactly one unit."
    },
    {
      "type": "multiple_choice",
      "question": "What is 64,418 + 100?",
      "options": [
        "64428",
        "64618",
        "64518",
        "64418"
      ],
      "correct_index": 2,
      "explanation": "The two parts rebuild the original total."
    },
    {
      "type": "multiple_choice",
      "question": "What is the value of the tens digit in 64,518?",
      "options": [
        "10",
        "1",
        "100",
        "1000"
      ],
      "correct_index": 0,
      "explanation": "The tens place counts groups of ten."
    },
    {
      "question": "Which list is ascending?",
      "options": [
        "64,618, 64,518, 60,426",
        "64,518, 60,426, 64,618",
        "60,426, 64,618, 64,518",
        "60,426, 64,518, 64,618"
      ],
      "correct_index": 3,
      "explanation": "The values increase from least to greatest; every neighbouring pair is in the correct direction.",
      "type": "multiple_choice"
    },
    {
      "type": "short_answer",
      "question": "Write a different two-part partition of 64,518 and check it.",
      "sample_answer": "64,418 + 100 = 64,518. The parts add back to the target.",
      "marking_guide": "Accept any correct non-standard two-part partition with a total check.",
      "explanation": "The partition must preserve the whole value."
    },
    {
      "type": "short_answer",
      "question": "Explain why 64,518 is greater than 60,426.",
      "sample_answer": "Compare matching columns from the left. The first unequal place has a larger value in the first numeral.",
      "marking_guide": "Accept the actual first unequal place or a correct positive-difference reason.",
      "explanation": "A value relationship supports the comparison, rather than the final digit alone."
    }
  ],
  "parent_notes": "Parent: Teaches read and count whole numbers to 100,000, with explicit digit/value and zero-place distinctions. Original content follows the repository’s topic sequence. Exact outcome codes are empty pending verified mapping; this is not a claim of complete syllabus coverage.\n\nParent: Look for the requested representation and the reasoning behind it, not speed. Standard and flexible partitions both preserve value. The lesson itself supplies the teaching and feedback. Your role is access support and reviewing the evidence.\n\nParent: Task models: 64,721: sixty-four thousand seven hundred and twenty-one; 60,000 + 4,000 + 700 + 20 + 1; next 64,722, 64,723; 60,536: sixty thousand five hundred and thirty-six; 60,000 + 500 + 30 + 6; next 60,537, 60,538; 64,506: sixty-four thousand five hundred and six; 60,000 + 4,000 + 500 + 6; next 64,507, 64,508; 60,406: sixty thousand four hundred and six; 60,000 + 400 + 6; next 60,407, 60,408. Ascending order: 60,406, 60,536, 64,506, 64,721. Accept other correct partitions and specific checks.\n\nParent: Eight scored choices use the unchanged 90% threshold, requiring 8/8. Two written responses are manually reviewed. Models: 64,418 + 100 = 64,518. The parts add back to the target. Compare matching columns from the left. The first unequal place has a larger value in the first numeral.",
  "evidence_instructions": "Keep the read and count whole numbers answers, two worked decisions, checking note, reflection and written quiz responses.",
  "offline_alternative": "Copy the four task numbers and draw place columns on paper. Complete the read and count whole numbers record and check it, then type your evidence later.",
  "extension": "Choose a new number below 100,000. Represent it in words and two partitions, then explain how it compares with 64,518.",
  "stage_hints": {
    "accept": [
      "Read the mission about read and count whole numbers.",
      "You will practise read and count whole numbers through models before making your own response.",
      "Begin with the first explanation of read and count whole numbers; the examples remain available while you work."
    ],
    "teach0": [
      "Look back at equal bundles making the next larger unit.",
      "Name the unit in each column before reading its digit.",
      "Start at ones, then use each tenfold grouping to name the next place."
    ],
    "teach1": [
      "Look at how the thousands chunk and final digits are read.",
      "Point to the matching place while saying each number-word part.",
      "Read the large group first, then the remaining hundreds, tens and ones; match the result back to the chart."
    ],
    "teach2": [
      "Find the empty column in the model numeral.",
      "Keep every place position, even when it contributes no groups.",
      "Write the columns first, fill stated groups and put a zero in an empty column before reading back."
    ],
    "teach3": [
      "Look at the count just before the new leading place.",
      "Track which lower groups become complete when one unit is added.",
      "Regroup the completed groups, write the leftover zeroes and count one back to check."
    ],
    "learn": [
      "Read the numeral and expanded form together.",
      "Match each part of the sum to its place column.",
      "Rebuild the same total, then use matching place values to check the comparison."
    ],
    "guided": [
      "Begin by labelling the second numeral’s columns.",
      "Complete one representation before comparing it with the suggestion.",
      "Read the words back into a chart and check that every digit returns to its intended place."
    ],
    "write": [
      "Start by copying the first task numeral accurately.",
      "Begin “This numeral has ____ groups of ____.”",
      "A partial record begins “For my first number, the largest place is ____. I checked it by ____.” Add your own values and working."
    ],
    "quiz": [
      "Return to the step for the representation named in the question.",
      "Distinguish a face digit, a value, a partition and an order statement.",
      "Use the matching column or total check before selecting an option; explain the value relationship for a written response."
    ],
    "submit": [
      "Check that your read and count whole numbers task and working are present.",
      "Include the read and count whole numbers reflection and any written reasoning you produced.",
      "Send your read and count whole numbers evidence for review; type a clear record if you used paper."
    ]
  }
}'), updated_at=datetime('now') WHERE seed_key='s2-mat-y4-w01-l1';

-- s2-mat-y4-w01-l2
UPDATE lessons SET title='Year 4: Explain place value and partitions', data=json_patch(data, '{
  "seed_key": "s2-mat-y4-w01-l2",
  "title": "Year 4: Explain place value and partitions",
  "stage": "S2",
  "learning_area": "Mathematics",
  "year_level": "Year 4",
  "week": 1,
  "lesson_number": 2,
  "duration_minutes": 60,
  "child_mission": "Become a Number Investigator! Use place groups to solve explain place value and partitions tasks and explain how you checked.",
  "learning_intention": "We are learning to explain place value and partitions within the range to 100,000.",
  "success_criteria": [
    "I can read a numeral through its place groups.",
    "I can match a digit to its value.",
    "I can show a correct partition or comparison.",
    "I can check an answer and explain my reason."
  ],
  "materials": [
    "Everything you need to read is included in this lesson",
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
  "spelling_focus": null,
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
      "title": "Locate a digit before naming its value",
      "explain": "**A place is a position in the numeral.**\nStart with ones on the right, then tens, hundreds, thousands and ten thousands as needed. Moving left makes the unit ten times as large. You can label a chart before inserting digits.\n\n**A face digit does not state its value.**\nThe written five always looks like five, but can mean five ones, five tens or five hundreds. Multiply the digit by the place unit, or say that many groups of the unit.\n\n**Apply it to 64,518.**\nThe hundreds digit is 5. Its value is 500. The ones digit is 8; its value is 8. Those are counts of different-sized units.\n\nPoint to the column, name the unit, then give the value. That order prevents an answer based only on the shape of the digit.",
      "example": "I DO:\n64,518: hundreds column → digit 5 → 5 hundreds → value 500.\n\nYOU TRY:\nFind the tens digit and its value before checking.\n\nCHECK:\nThe tens digit is 1, so it contributes 10. The digit and its value need different labels.",
      "notice": "A digit answer and a value answer can look different. Read what the question asks.",
      "check": {
        "question": "What is the value of the hundreds digit in 64,518?",
        "options": [
          "5",
          "500",
          "50",
          "5000"
        ],
        "correct_index": 1,
        "explanation": "The digit is in the hundreds column, so its value is that many hundreds."
      },
      "visual": [
        {
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 450 190\"><rect width=\"450\" height=\"190\" fill=\"#f5faf7\"/><rect x=\"0.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"45.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Ten</text><text x=\"45.0\" y=\"64\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">thousands</text><text x=\"45.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">6</text><text x=\"45.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">60,000</text><rect x=\"90.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"135.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Thousands</text><text x=\"135.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">4</text><text x=\"135.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">4,000</text><rect x=\"180.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"225.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Hundreds</text><text x=\"225.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">5</text><text x=\"225.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">500</text><rect x=\"270.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"315.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Tens</text><text x=\"315.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">1</text><text x=\"315.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">10</text><rect x=\"360.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"405.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Ones</text><text x=\"405.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">8</text><text x=\"405.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">8</text></svg>",
          "alt": "A place-value chart for 64,518. Ten thousands: digit 6, value 60,000, Thousands: digit 4, value 4,000, Hundreds: digit 5, value 500, Tens: digit 1, value 10, Ones: digit 8, value 8.",
          "caption": "A digit’s column gives its value."
        }
      ]
    },
    {
      "icon": "📖",
      "title": "Partition without changing the total",
      "explain": "**Partition means split a whole into parts.**\nIn standard expanded form, split a numeral into the value contributed by each non-zero place. Add those contributions to reconstruct the same total.\n\n**Match each term to a column.**\nA term such as five hundred describes the value of a digit in the hundreds place. Writing five instead would lose the unit size. Use addition signs because the parts combine into one total.\n\n**Show the full model.**\n64,518 = 60,000 + 4,000 + 500 + 10 + 8. Read each part, then check the sum. You have represented the same number another way, not made a smaller number.\n\nZero-valued terms can be left out of the addition, but do not shift other digits in the numeral. Keep those two representations distinct.",
      "example": "I DO:\nI split 64,518 into its non-zero place values: 60,000 + 4,000 + 500 + 10 + 8.\nI put each part back into a chart and recover 64,518.\n\nYOU TRY:\nPartition 60,426. Include the value of every non-zero digit.\n\nCHECK:\n60,000 + 400 + 20 + 6 adds to 60,426. A zero place contributes nothing to this sum but remains in the numeral.",
      "notice": "An expanded term includes its unit value. Listing the face digits alone is not standard expanded form.",
      "check": {
        "question": "What must a standard expanded-form term show?",
        "options": [
          "Only the face digit with no place value",
          "The number of letters in the word",
          "The value contributed by its place",
          "A new unrelated count"
        ],
        "correct_index": 2,
        "explanation": "A standard expanded term gives the contribution of a place, so the terms add back to the original number."
      }
    },
    {
      "icon": "📖",
      "title": "Regroup the parts flexibly",
      "explain": "**The same total can have different partitions.**\nYou can exchange one hundred for ten tens or one thousand for ten hundreds. An exchange preserves the total because the groups have equal value. This can help with later calculation.\n\n**Show both sides of the exchange.**\nReducing a larger group requires adding the equivalent smaller groups. Removing a hundred without adding ten tens would reduce the total. Use an equality to record the unchanged count.\n\n**Try a non-standard partition.**\n64,518 = 64,418 + 100. It is also 63,518 + 1,000. These differ from standard expanded form but still make the same whole. Check by addition rather than judging the length of the expression.\n\nA correct partition has parts that add to the target. It does not need a particular number of terms unless the question requests one.",
      "example": "I DO:\nI take one hundred from 64,518: 64,418 remains. I record the removed part too: 64,418 + 100 = 64,518.\nIf I write only 64,418, I have lost a hundred rather than repartitioned.\n\nYOU TRY:\nUse 64,508 as the first part of a partition of 64,518. What second part preserves the total?\n\nCHECK:\nAdd ten. The two parts then sum to 64,518.",
      "notice": "An exchange changes grouping, not the total. Always check what was removed and what was added.",
      "check": {
        "question": "What should remain unchanged when regrouping a number?",
        "options": [
          "Every face digit in every representation",
          "The number of written terms",
          "The size of all groups",
          "The total value"
        ],
        "correct_index": 3,
        "explanation": "Regrouping exchanges equal values, so the total is unchanged even if the grouping or written digits change."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Explain place value and partitions in action",
            "transcript": "Pip: I am practising how to regroup the parts flexibly. I need to track the value, not just copy digits.\nJuno: The same total can have different partitions.\nYou can exchange one hundred for ten tens or one thousand for ten hundreds. An exchange preserves the total because the groups have equal value. This can help with later calculation.\nPip: I take one hundred from 64,518: 64,418 remains. I record the removed part too: 64,418 + 100 = 64,518.\nIf I write only 64,418, I have lost a hundred rather than repartitioned.\nJuno: Pause and try a fresh example with the same check. Explain what stays unchanged or which value relationship settles the result.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "I am practising how to regroup the parts flexibly. I need to track the value, not just copy digits."
                  },
                  {
                    "who": "juno",
                    "text": "The same total can have different partitions.\nYou can exchange one hundred for ten tens or one thousand for ten hundreds. An exchange preserves the total because the groups have equal value. This can help with later calculation."
                  },
                  {
                    "who": "pip",
                    "text": "I take one hundred from 64,518: 64,418 remains. I record the removed part too: 64,418 + 100 = 64,518.\nIf I write only 64,418, I have lost a hundred rather than repartitioned."
                  },
                  {
                    "who": "juno",
                    "text": "Pause and try a fresh example with the same check. Explain what stays unchanged or which value relationship settles the result.",
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
      "title": "Use place value to explain a change",
      "explain": "**Changing one group changes a known amount.**\nAdding a hundred adds one group of one hundred; adding a ten adds one group of ten. Read the unit in the question before changing a digit.\n\n**Check whether regrouping is needed.**\nIf a column already has nine groups, adding another completes a larger group. If it has room for another group, only that column changes. Explain the value change rather than guessing a new digit.\n\n**Verify with a difference.**\nSubtract the original count from your proposed count, or count back the added group. The difference should match the intended amount. A new numeral can look plausible and still show the wrong-sized change.\n\nDraw a chart or write a partition when you need support. The purpose is a clear value explanation, not the fastest possible mental answer.",
      "example": "I DO:\n64,518 + 100 = 64,618. I added one hundred, not one unit.\nCheck: 64,618 - 64,518 = 100.\n\nYOU TRY:\nAdd ten to 64,518, then say what group you added.\n\nCHECK:\nThe result is 64,528. It is one ten greater. The difference check confirms the intended size.",
      "notice": "Say the amount added. Do not confuse the place name with a one-unit counting step.",
      "check": {
        "question": "What is 64,518 plus one hundred?",
        "options": [
          "64618",
          "64519",
          "64528",
          "65518"
        ],
        "correct_index": 0,
        "explanation": "One hundred changes the total by exactly one hundred, not by a one-unit or one-thousand step."
      }
    }
  ],
  "worked_example": "I DO: Complete a connected explain place value and partitions record.\nTarget numeral: 64,518. Words: sixty-four thousand five hundred and eighteen.\nStandard partition: 60,000 + 4,000 + 500 + 10 + 8.\nHundreds digit: 5; value: 500.\nAnother partition: 64,418 + 100 = 64,518.\nComparison: 64,518 > 60,426. I compare matching places from the left; the first unequal place decides. The difference is 4,092.\nAscending set: 60,426, 64,518, 64,618.\n\nWHY THE REPRESENTATIONS AGREE\nThe written numeral, words and expanded sum describe the same place groups. The non-standard partition also returns the same total. Comparing uses those group values, not only the shape of a single digit.\n\nCOMMON MISTAKE AND FIX\nWriting the hundreds digit’s value as 5 loses its unit size. I change the value label to 500. Another possible error is deleting the zero in 60,426; I keep its column and reread the whole count.\n\nCHECK\nI rebuild the numeral from its non-zero terms and read the comparison in both directions. If a check disagrees, I revisit the relevant column before changing unrelated digits.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 450 190\"><rect width=\"450\" height=\"190\" fill=\"#f5faf7\"/><rect x=\"0.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"45.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Ten</text><text x=\"45.0\" y=\"64\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">thousands</text><text x=\"45.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">6</text><text x=\"45.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">60,000</text><rect x=\"90.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"135.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Thousands</text><text x=\"135.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">0</text><text x=\"135.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">0</text><rect x=\"180.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"225.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Hundreds</text><text x=\"225.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">4</text><text x=\"225.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">400</text><rect x=\"270.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"315.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Tens</text><text x=\"315.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">2</text><text x=\"315.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">20</text><rect x=\"360.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"405.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Ones</text><text x=\"405.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">6</text><text x=\"405.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">6</text></svg>",
      "alt": "A place-value chart for 60,426. Ten thousands: digit 6, value 60,000, Thousands: digit 0, value 0, Hundreds: digit 4, value 400, Tens: digit 2, value 20, Ones: digit 6, value 6.",
      "caption": "A digit’s column gives its value."
    }
  ],
  "guided_practice": "WE DO: Prepare a second record using 60,426.\n1. Label the columns and insert the digits. Read it before comparing with “sixty thousand four hundred and twenty-six”.\n2. Find the hundreds digit and its contribution. Compare after your attempt: 400.\n3. Partition it. Check against 60,000 + 400 + 20 + 6, then add those terms back.\n4. Compare 60,426 with 64,518; name the first unequal place rather than choosing by the final digit.\n5. Make one different partition by setting aside a hundred. Check: 60,326 + 100.\n6. Explain one check you used. If you made an error, repair only the mismatched place and read the result again.\nYou can draw the chart or describe it in text. The explanation matters more than decorative layout.",
  "independent_task": "YOU DO: Explain place value and partitions record (about 20 minutes).\nUse these numbers: 64,721; 60,536; 64,506; 60,406.\n1. Say what each part of the task asks before answering: numeral, words, place value, partition or order.\n2. Give standard expanded form for each numeral, then make a different two-part partition for two of them. Label a digit and its value.\n3. Show working for at least two decisions with a labelled chart, equation or comparison reason.\n4. Check those decisions by rebuilding a total, reading words back or comparing neighbouring values.\n5. Explain one improvement or one check that confirmed a correct answer.\nWork on paper or in the big box. If using paper, type the answers and a clear working summary. Check: correct range and places; zeroes preserved; complete requested representations; a specific reason and a check. An upload is optional.",
  "response_prompt": "Which place-group or representation check helped most in your explain place value and partitions record?",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "What is the value of the hundreds digit in 64,518?",
      "options": [
        "5",
        "500",
        "50",
        "5000"
      ],
      "correct_index": 1,
      "explanation": "The digit is in the hundreds column, so its value is that many hundreds."
    },
    {
      "question": "What must a standard expanded-form term show?",
      "options": [
        "Only the face digit with no place value",
        "The number of letters in the word",
        "The value contributed by its place",
        "A new unrelated count"
      ],
      "correct_index": 2,
      "explanation": "A standard expanded term gives the contribution of a place, so the terms add back to the original number.",
      "type": "multiple_choice"
    },
    {
      "question": "What should remain unchanged when regrouping a number?",
      "options": [
        "Every face digit in every representation",
        "The number of written terms",
        "The size of all groups",
        "The total value"
      ],
      "correct_index": 3,
      "explanation": "Regrouping exchanges equal values, so the total is unchanged even if the grouping or written digits change.",
      "type": "multiple_choice"
    },
    {
      "type": "multiple_choice",
      "question": "What is 64,518 plus one hundred?",
      "options": [
        "64618",
        "64519",
        "64528",
        "65518"
      ],
      "correct_index": 0,
      "explanation": "One hundred changes the total by exactly one hundred, not by a one-unit or one-thousand step."
    },
    {
      "type": "multiple_choice",
      "question": "What is one more than 64,518?",
      "options": [
        "64528",
        "64519",
        "64618",
        "64517"
      ],
      "correct_index": 1,
      "explanation": "Counting by one adds exactly one unit."
    },
    {
      "type": "multiple_choice",
      "question": "What is 64,418 + 100?",
      "options": [
        "64428",
        "64618",
        "64518",
        "64418"
      ],
      "correct_index": 2,
      "explanation": "The two parts rebuild the original total."
    },
    {
      "type": "multiple_choice",
      "question": "What is the value of the tens digit in 64,518?",
      "options": [
        "10",
        "1",
        "100",
        "1000"
      ],
      "correct_index": 0,
      "explanation": "The tens place counts groups of ten."
    },
    {
      "question": "Which list is ascending?",
      "options": [
        "64,618, 64,518, 60,426",
        "64,518, 60,426, 64,618",
        "60,426, 64,618, 64,518",
        "60,426, 64,518, 64,618"
      ],
      "correct_index": 3,
      "explanation": "The values increase from least to greatest; every neighbouring pair is in the correct direction.",
      "type": "multiple_choice"
    },
    {
      "type": "short_answer",
      "question": "Write a different two-part partition of 64,518 and check it.",
      "sample_answer": "64,418 + 100 = 64,518. The parts add back to the target.",
      "marking_guide": "Accept any correct non-standard two-part partition with a total check.",
      "explanation": "The partition must preserve the whole value."
    },
    {
      "type": "short_answer",
      "question": "Explain why 64,518 is greater than 60,426.",
      "sample_answer": "Compare matching columns from the left. The first unequal place has a larger value in the first numeral.",
      "marking_guide": "Accept the actual first unequal place or a correct positive-difference reason.",
      "explanation": "A value relationship supports the comparison, rather than the final digit alone."
    }
  ],
  "parent_notes": "Parent: Teaches explain place value and partitions to 100,000, with explicit digit/value and zero-place distinctions. Original content follows the repository’s topic sequence. Exact outcome codes are empty pending verified mapping; this is not a claim of complete syllabus coverage.\n\nParent: Look for the requested representation and the reasoning behind it, not speed. Standard and flexible partitions both preserve value. The lesson itself supplies the teaching and feedback. Your role is access support and reviewing the evidence.\n\nParent: Task models: 64,721: sixty-four thousand seven hundred and twenty-one; 60,000 + 4,000 + 700 + 20 + 1; next 64,722, 64,723; 60,536: sixty thousand five hundred and thirty-six; 60,000 + 500 + 30 + 6; next 60,537, 60,538; 64,506: sixty-four thousand five hundred and six; 60,000 + 4,000 + 500 + 6; next 64,507, 64,508; 60,406: sixty thousand four hundred and six; 60,000 + 400 + 6; next 60,407, 60,408. Ascending order: 60,406, 60,536, 64,506, 64,721. Accept other correct partitions and specific checks.\n\nParent: Eight scored choices use the unchanged 90% threshold, requiring 8/8. Two written responses are manually reviewed. Models: 64,418 + 100 = 64,518. The parts add back to the target. Compare matching columns from the left. The first unequal place has a larger value in the first numeral.",
  "evidence_instructions": "Keep the explain place value and partitions answers, two worked decisions, checking note, reflection and written quiz responses.",
  "offline_alternative": "Copy the four task numbers and draw place columns on paper. Complete the explain place value and partitions record and check it, then type your evidence later.",
  "extension": "Choose a new number below 100,000. Represent it in words and two partitions, then explain how it compares with 64,518.",
  "stage_hints": {
    "accept": [
      "Read the mission about explain place value and partitions.",
      "You will practise explain place value and partitions through models before making your own response.",
      "Begin with the first explanation of explain place value and partitions; the examples remain available while you work."
    ],
    "teach0": [
      "Look at the column rather than only the digit shape.",
      "Name its unit, then count how many of that unit the digit represents.",
      "Record digit and value with different labels; multiply by the column unit for the value."
    ],
    "teach1": [
      "Look at each expanded term beside its place column.",
      "Write the value of each non-empty group instead of only its digit.",
      "Add the terms back and check that the original numeral returns."
    ],
    "teach2": [
      "Look at the model that sets aside a larger group.",
      "Keep a record of the removed value and the part remaining.",
      "Add both parts to test the unchanged total; do not drop a group from the record."
    ],
    "teach3": [
      "Look at whether the added quantity is a unit, ten or hundred.",
      "Identify the amount before changing the numeral.",
      "Add the specified group and count that same amount back to verify the original."
    ],
    "learn": [
      "Read the numeral and expanded form together.",
      "Match each part of the sum to its place column.",
      "Rebuild the same total, then use matching place values to check the comparison."
    ],
    "guided": [
      "Begin by labelling the second numeral’s columns.",
      "Complete one representation before comparing it with the suggestion.",
      "Read the words back into a chart and check that every digit returns to its intended place."
    ],
    "write": [
      "Start by copying the first task numeral accurately.",
      "Begin “This numeral has ____ groups of ____.”",
      "A partial record begins “For my first number, the largest place is ____. I checked it by ____.” Add your own values and working."
    ],
    "quiz": [
      "Return to the step for the representation named in the question.",
      "Distinguish a face digit, a value, a partition and an order statement.",
      "Use the matching column or total check before selecting an option; explain the value relationship for a written response."
    ],
    "submit": [
      "Check that your explain place value and partitions task and working are present.",
      "Include the explain place value and partitions reflection and any written reasoning you produced.",
      "Send your explain place value and partitions evidence for review; type a clear record if you used paper."
    ]
  }
}'), updated_at=datetime('now') WHERE seed_key='s2-mat-y4-w01-l2';

-- s2-mat-y4-w01-l3
UPDATE lessons SET title='Year 4: Compare and order whole numbers', data=json_patch(data, '{
  "seed_key": "s2-mat-y4-w01-l3",
  "title": "Year 4: Compare and order whole numbers",
  "stage": "S2",
  "learning_area": "Mathematics",
  "year_level": "Year 4",
  "week": 1,
  "lesson_number": 3,
  "duration_minutes": 60,
  "child_mission": "Become a Number Investigator! Use place groups to solve compare and order whole numbers tasks and explain how you checked.",
  "learning_intention": "We are learning to compare and order whole numbers within the range to 100,000.",
  "success_criteria": [
    "I can read a numeral through its place groups.",
    "I can match a digit to its value.",
    "I can show a correct partition or comparison.",
    "I can check an answer and explain my reason."
  ],
  "materials": [
    "Everything you need to read is included in this lesson",
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
  "spelling_focus": null,
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
      "title": "Compare equal-sized groups first",
      "explain": "**Comparison asks which whole is larger.**\nFor positive whole numbers, first check how many places are needed. A number with an additional leading non-zero place is larger. For equal-length numerals, compare their highest places first.\n\n**Find the first difference from the left.**\nIf the highest digits match, move one column right. Stop at the first unequal pair. That larger place outweighs all the lower places that follow.\n\n**Use the pair 64,518 and 60,426.**\nThe first unequal digits from the left determine the comparison. A larger final ones digit cannot overcome a smaller earlier thousands or hundreds digit. Think about group size, not just digit size.\n\nLine up matching columns. Leading zeroes do not create a larger positive value; the first non-zero place matters.",
      "example": "I DO:\nCompare 64,518 with 60,426. I line up the columns, move from the left and locate the first difference. 64,518 is greater.\n\nYOU TRY:\nCompare 64,517 and 64,518. Which first unequal column decides it?\n\nCHECK:\n64,518 is greater by one. Most leading places match, so the difference is near the right; begin from the left anyway.",
      "notice": "Compare the first unequal place, not whichever single digit catches your eye.",
      "check": {
        "question": "For equal-length positive whole numbers, where should comparison start?",
        "options": [
          "At whichever digit is brightest",
          "At the largest place on the left",
          "At the ones every time",
          "At the number of commas"
        ],
        "correct_index": 1,
        "explanation": "The largest place carries the greatest unit value. Compare it first, then move right only if it matches."
      },
      "visual": [
        {
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 450 190\"><rect width=\"450\" height=\"190\" fill=\"#f5faf7\"/><rect x=\"0.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"45.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Ten</text><text x=\"45.0\" y=\"64\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">thousands</text><text x=\"45.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">6</text><text x=\"45.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">60,000</text><rect x=\"90.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"135.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Thousands</text><text x=\"135.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">4</text><text x=\"135.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">4,000</text><rect x=\"180.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"225.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Hundreds</text><text x=\"225.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">5</text><text x=\"225.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">500</text><rect x=\"270.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"315.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Tens</text><text x=\"315.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">1</text><text x=\"315.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">10</text><rect x=\"360.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"405.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Ones</text><text x=\"405.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">8</text><text x=\"405.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">8</text></svg>",
          "alt": "A place-value chart for 64,518. Ten thousands: digit 6, value 60,000, Thousands: digit 4, value 4,000, Hundreds: digit 5, value 500, Tens: digit 1, value 10, Ones: digit 8, value 8.",
          "caption": "A digit’s column gives its value."
        }
      ]
    },
    {
      "icon": "📖",
      "title": "Read comparison symbols as statements",
      "explain": "**The symbols record a relationship.**\nThe sign > means is greater than; < means is less than; = means is equal to. Read the whole statement aloud rather than remembering only a shape.\n\n**The open side faces the greater number.**\nThe pointed side faces the lesser number. This is a helpful shape check after deciding the actual values. Do not let the shape replace comparing the numbers.\n\n**Order of writing matters.**\nIf you swap the positions of unequal numbers, the sign changes direction. The underlying relationship remains the same. Equality is different: swapping equal values keeps equality true.\n\nExplain in words first if a sign is confusing. Then check that the symbol says the same thing.",
      "example": "I DO:\n64,518 > 60,426: sixty-four thousand five hundred and eighteen is greater than sixty thousand four hundred and twenty-six.\nReversed: 60,426 < 64,518.\n\nYOU TRY:\nWrite the two values in the opposite order and read your sign aloud.\n\nCHECK:\nThe reversed statement uses the opposite direction but still says that 64,518 is the larger value.",
      "notice": "A comparison statement should be true when read from left to right.",
      "check": {
        "question": "Which comparison is true?",
        "options": [
          "64,518 < 60,426",
          "64,518 = 60,426",
          "64,518 > 60,426",
          "60,426 > 64,518"
        ],
        "correct_index": 2,
        "explanation": "The first unequal place shows the first value is greater; the symbol must record that direction."
      }
    },
    {
      "icon": "📖",
      "title": "Order a set one position at a time",
      "explain": "**Ascending means least to greatest.**\nDescending means greatest to least. Read which direction the task requests before sorting a set. Sorting correctly in the wrong direction still answers a different question.\n\n**Find one end of the order first.**\nFor ascending order, choose the least value and set it aside. Compare the remaining values to choose the next. Repeating this method keeps the whole set organised.\n\n**Check neighbours when finished.**\nEvery value in an ascending list should be no greater than the next. Check the whole list, not only the first and last values. Repeated equal values can sit together.\n\nYou can use separate paper slips or a typed list. The method should work without an app doing the ordering for you.",
      "example": "I DO:\nSet: 64,618, 60,426, 64,518.\nAscending order: 60,426, 64,518, 64,618.\nI compare each neighbouring pair to check the order.\n\nYOU TRY:\nPut 64,519, 64,517, 64,518 in descending order.\n\nCHECK:\n64,519, 64,518, 64,517. The values become smaller at each step.",
      "notice": "Read ascending or descending first. A memorised sorting direction will not answer every task.",
      "check": {
        "question": "What does descending order mean?",
        "options": [
          "Least to greatest",
          "An order chosen at random",
          "Only even values",
          "Greatest to least"
        ],
        "correct_index": 3,
        "explanation": "Descending order moves from the greatest value down to the least. Ascending is the other direction."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Compare and order whole numbers in action",
            "transcript": "Pip: I am practising how to order a set one position at a time. I need to track the value, not just copy digits.\nJuno: Ascending means least to greatest.\nDescending means greatest to least. Read which direction the task requests before sorting a set. Sorting correctly in the wrong direction still answers a different question.\nPip: Set: 64,618, 60,426, 64,518.\nAscending order: 60,426, 64,518, 64,618.\nI compare each neighbouring pair to check the order.\nJuno: Pause and try a fresh example with the same check. Explain what stays unchanged or which value relationship settles the result.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "I am practising how to order a set one position at a time. I need to track the value, not just copy digits."
                  },
                  {
                    "who": "juno",
                    "text": "Ascending means least to greatest.\nDescending means greatest to least. Read which direction the task requests before sorting a set. Sorting correctly in the wrong direction still answers a different question."
                  },
                  {
                    "who": "pip",
                    "text": "Set: 64,618, 60,426, 64,518.\nAscending order: 60,426, 64,518, 64,618.\nI compare each neighbouring pair to check the order."
                  },
                  {
                    "who": "juno",
                    "text": "Pause and try a fresh example with the same check. Explain what stays unchanged or which value relationship settles the result.",
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
      "title": "Justify rather than only announce",
      "explain": "**A reason shows the comparison method.**\n“I know it is bigger” gives no evidence. Name the first unequal place and explain which value is larger there. A precise reason can help someone check your answer.\n\n**Keep digit and value labels clear.**\nA five in the hundreds place contributes five hundred, not five. Refer to hundreds or thousands when that is the deciding place. This explains why a lower ones digit cannot reverse the result.\n\n**Use a second check where helpful.**\nYou can calculate a difference or place the values on a number line. The larger value lies farther right. This check should support the place-value reasoning, not contradict it.\n\nChoose one short explanation that answers why. A long list of every digit is unnecessary when the first difference already settles the comparison.",
      "example": "I DO:\nFor 64,518 and 60,426, I point to the first unequal column and compare its unit values. Lower places cannot reverse that difference.\nCheck: 64,518 - 60,426 = 4,092, a positive difference.\n\nYOU TRY:\nExplain why 64,618 exceeds 64,518 using the amount between them.\n\nCHECK:\nIt is one hundred greater. That gives a specific value reason instead of only repeating greater.",
      "notice": "A justification needs a deciding detail or value relationship, not a repeated judgement.",
      "check": {
        "question": "Which is a useful comparison reason?",
        "options": [
          "Name the first unequal place and compare its values",
          "Choose the number with the most attractive digits",
          "Say bigger because it is bigger",
          "Compare only the final digit regardless of earlier places"
        ],
        "correct_index": 0,
        "explanation": "The first unequal place provides the decisive evidence for equal-length positive whole-number comparisons."
      }
    }
  ],
  "worked_example": "I DO: Complete a connected compare and order whole numbers record.\nTarget numeral: 64,518. Words: sixty-four thousand five hundred and eighteen.\nStandard partition: 60,000 + 4,000 + 500 + 10 + 8.\nHundreds digit: 5; value: 500.\nAnother partition: 64,418 + 100 = 64,518.\nComparison: 64,518 > 60,426. I compare matching places from the left; the first unequal place decides. The difference is 4,092.\nAscending set: 60,426, 64,518, 64,618.\n\nWHY THE REPRESENTATIONS AGREE\nThe written numeral, words and expanded sum describe the same place groups. The non-standard partition also returns the same total. Comparing uses those group values, not only the shape of a single digit.\n\nCOMMON MISTAKE AND FIX\nWriting the hundreds digit’s value as 5 loses its unit size. I change the value label to 500. Another possible error is deleting the zero in 60,426; I keep its column and reread the whole count.\n\nCHECK\nI rebuild the numeral from its non-zero terms and read the comparison in both directions. If a check disagrees, I revisit the relevant column before changing unrelated digits.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 450 190\"><rect width=\"450\" height=\"190\" fill=\"#f5faf7\"/><rect x=\"0.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"45.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Ten</text><text x=\"45.0\" y=\"64\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">thousands</text><text x=\"45.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">6</text><text x=\"45.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">60,000</text><rect x=\"90.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"135.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Thousands</text><text x=\"135.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">0</text><text x=\"135.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">0</text><rect x=\"180.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"225.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Hundreds</text><text x=\"225.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">4</text><text x=\"225.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">400</text><rect x=\"270.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"315.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Tens</text><text x=\"315.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">2</text><text x=\"315.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">20</text><rect x=\"360.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"405.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Ones</text><text x=\"405.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">6</text><text x=\"405.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">6</text></svg>",
      "alt": "A place-value chart for 60,426. Ten thousands: digit 6, value 60,000, Thousands: digit 0, value 0, Hundreds: digit 4, value 400, Tens: digit 2, value 20, Ones: digit 6, value 6.",
      "caption": "A digit’s column gives its value."
    }
  ],
  "guided_practice": "WE DO: Prepare a second record using 60,426.\n1. Label the columns and insert the digits. Read it before comparing with “sixty thousand four hundred and twenty-six”.\n2. Find the hundreds digit and its contribution. Compare after your attempt: 400.\n3. Partition it. Check against 60,000 + 400 + 20 + 6, then add those terms back.\n4. Compare 60,426 with 64,518; name the first unequal place rather than choosing by the final digit.\n5. Make one different partition by setting aside a hundred. Check: 60,326 + 100.\n6. Explain one check you used. If you made an error, repair only the mismatched place and read the result again.\nYou can draw the chart or describe it in text. The explanation matters more than decorative layout.",
  "independent_task": "YOU DO: Compare and order whole numbers record (about 20 minutes).\nUse these numbers: 64,721; 60,536; 64,506; 60,406.\n1. Say what each part of the task asks before answering: numeral, words, place value, partition or order.\n2. Write an ascending and a descending list of the four values. Compare two pairs with symbols and explain the first unequal place.\n3. Show working for at least two decisions with a labelled chart, equation or comparison reason.\n4. Check those decisions by rebuilding a total, reading words back or comparing neighbouring values.\n5. Explain one improvement or one check that confirmed a correct answer.\nWork on paper or in the big box. If using paper, type the answers and a clear working summary. Check: correct range and places; zeroes preserved; complete requested representations; a specific reason and a check. An upload is optional.",
  "response_prompt": "Which place-group or representation check helped most in your compare and order whole numbers record?",
  "quiz": [
    {
      "question": "For equal-length positive whole numbers, where should comparison start?",
      "options": [
        "At whichever digit is brightest",
        "At the largest place on the left",
        "At the ones every time",
        "At the number of commas"
      ],
      "correct_index": 1,
      "explanation": "The largest place carries the greatest unit value. Compare it first, then move right only if it matches.",
      "type": "multiple_choice"
    },
    {
      "question": "Which comparison is true?",
      "options": [
        "64,518 < 60,426",
        "64,518 = 60,426",
        "64,518 > 60,426",
        "60,426 > 64,518"
      ],
      "correct_index": 2,
      "explanation": "The first unequal place shows the first value is greater; the symbol must record that direction.",
      "type": "multiple_choice"
    },
    {
      "question": "What does descending order mean?",
      "options": [
        "Least to greatest",
        "An order chosen at random",
        "Only even values",
        "Greatest to least"
      ],
      "correct_index": 3,
      "explanation": "Descending order moves from the greatest value down to the least. Ascending is the other direction.",
      "type": "multiple_choice"
    },
    {
      "question": "Which is a useful comparison reason?",
      "options": [
        "Name the first unequal place and compare its values",
        "Choose the number with the most attractive digits",
        "Say bigger because it is bigger",
        "Compare only the final digit regardless of earlier places"
      ],
      "correct_index": 0,
      "explanation": "The first unequal place provides the decisive evidence for equal-length positive whole-number comparisons.",
      "type": "multiple_choice"
    },
    {
      "type": "multiple_choice",
      "question": "What is one more than 64,518?",
      "options": [
        "64528",
        "64519",
        "64618",
        "64517"
      ],
      "correct_index": 1,
      "explanation": "Counting by one adds exactly one unit."
    },
    {
      "type": "multiple_choice",
      "question": "What is 64,418 + 100?",
      "options": [
        "64428",
        "64618",
        "64518",
        "64418"
      ],
      "correct_index": 2,
      "explanation": "The two parts rebuild the original total."
    },
    {
      "type": "multiple_choice",
      "question": "What is the value of the tens digit in 64,518?",
      "options": [
        "10",
        "1",
        "100",
        "1000"
      ],
      "correct_index": 0,
      "explanation": "The tens place counts groups of ten."
    },
    {
      "question": "Which list is ascending?",
      "options": [
        "64,618, 64,518, 60,426",
        "64,518, 60,426, 64,618",
        "60,426, 64,618, 64,518",
        "60,426, 64,518, 64,618"
      ],
      "correct_index": 3,
      "explanation": "The values increase from least to greatest; every neighbouring pair is in the correct direction.",
      "type": "multiple_choice"
    },
    {
      "type": "short_answer",
      "question": "Write a different two-part partition of 64,518 and check it.",
      "sample_answer": "64,418 + 100 = 64,518. The parts add back to the target.",
      "marking_guide": "Accept any correct non-standard two-part partition with a total check.",
      "explanation": "The partition must preserve the whole value."
    },
    {
      "type": "short_answer",
      "question": "Explain why 64,518 is greater than 60,426.",
      "sample_answer": "Compare matching columns from the left. The first unequal place has a larger value in the first numeral.",
      "marking_guide": "Accept the actual first unequal place or a correct positive-difference reason.",
      "explanation": "A value relationship supports the comparison, rather than the final digit alone."
    }
  ],
  "parent_notes": "Parent: Teaches compare and order whole numbers to 100,000, with explicit digit/value and zero-place distinctions. Original content follows the repository’s topic sequence. Exact outcome codes are empty pending verified mapping; this is not a claim of complete syllabus coverage.\n\nParent: Look for the requested representation and the reasoning behind it, not speed. Standard and flexible partitions both preserve value. The lesson itself supplies the teaching and feedback. Your role is access support and reviewing the evidence.\n\nParent: Task models: 64,721: sixty-four thousand seven hundred and twenty-one; 60,000 + 4,000 + 700 + 20 + 1; next 64,722, 64,723; 60,536: sixty thousand five hundred and thirty-six; 60,000 + 500 + 30 + 6; next 60,537, 60,538; 64,506: sixty-four thousand five hundred and six; 60,000 + 4,000 + 500 + 6; next 64,507, 64,508; 60,406: sixty thousand four hundred and six; 60,000 + 400 + 6; next 60,407, 60,408. Ascending order: 60,406, 60,536, 64,506, 64,721. Accept other correct partitions and specific checks.\n\nParent: Eight scored choices use the unchanged 90% threshold, requiring 8/8. Two written responses are manually reviewed. Models: 64,418 + 100 = 64,518. The parts add back to the target. Compare matching columns from the left. The first unequal place has a larger value in the first numeral.",
  "evidence_instructions": "Keep the compare and order whole numbers answers, two worked decisions, checking note, reflection and written quiz responses.",
  "offline_alternative": "Copy the four task numbers and draw place columns on paper. Complete the compare and order whole numbers record and check it, then type your evidence later.",
  "extension": "Choose a new number below 100,000. Represent it in words and two partitions, then explain how it compares with 64,518.",
  "stage_hints": {
    "accept": [
      "Read the mission about compare and order whole numbers.",
      "You will practise compare and order whole numbers through models before making your own response.",
      "Begin with the first explanation of compare and order whole numbers; the examples remain available while you work."
    ],
    "teach0": [
      "Look at the first unequal place from the left.",
      "Line up matching places and move right only while they match.",
      "Compare the two group values at the first difference; later smaller places cannot reverse it."
    ],
    "teach1": [
      "Read the model comparison aloud from left to right.",
      "Decide the greater value before choosing the sign direction.",
      "Keep the open side beside the greater value and read the reversed statement as a check."
    ],
    "teach2": [
      "Look at the requested ascending or descending direction.",
      "Choose the least or greatest remaining value one at a time.",
      "Record each value once, then check all neighbouring comparisons."
    ],
    "teach3": [
      "Find the deciding place or positive difference in the model.",
      "Choose evidence that explains the relationship instead of repeating greater.",
      "Name the first unequal unit values or a correct difference and connect them to the conclusion."
    ],
    "learn": [
      "Read the numeral and expanded form together.",
      "Match each part of the sum to its place column.",
      "Rebuild the same total, then use matching place values to check the comparison."
    ],
    "guided": [
      "Begin by labelling the second numeral’s columns.",
      "Complete one representation before comparing it with the suggestion.",
      "Read the words back into a chart and check that every digit returns to its intended place."
    ],
    "write": [
      "Start by copying the first task numeral accurately.",
      "Begin “This numeral has ____ groups of ____.”",
      "A partial record begins “For my first number, the largest place is ____. I checked it by ____.” Add your own values and working."
    ],
    "quiz": [
      "Return to the step for the representation named in the question.",
      "Distinguish a face digit, a value, a partition and an order statement.",
      "Use the matching column or total check before selecting an option; explain the value relationship for a written response."
    ],
    "submit": [
      "Check that your compare and order whole numbers task and working are present.",
      "Include the compare and order whole numbers reflection and any written reasoning you produced.",
      "Send your compare and order whole numbers evidence for review; type a clear record if you used paper."
    ]
  }
}'), updated_at=datetime('now') WHERE seed_key='s2-mat-y4-w01-l3';

-- s2-mat-y4-w01-l4
UPDATE lessons SET title='Year 4: Whole-number fluency with reasons', data=json_patch(data, '{
  "seed_key": "s2-mat-y4-w01-l4",
  "title": "Year 4: Whole-number fluency with reasons",
  "stage": "S2",
  "learning_area": "Mathematics",
  "year_level": "Year 4",
  "week": 1,
  "lesson_number": 4,
  "duration_minutes": 60,
  "child_mission": "Become a Number Investigator! Use place groups to solve whole-number fluency with reasons tasks and explain how you checked.",
  "learning_intention": "We are learning to whole-number fluency with reasons within the range to 100,000.",
  "success_criteria": [
    "I can read a numeral through its place groups.",
    "I can match a digit to its value.",
    "I can show a correct partition or comparison.",
    "I can check an answer and explain my reason."
  ],
  "materials": [
    "Everything you need to read is included in this lesson",
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
  "spelling_focus": null,
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
      "title": "Read the digits through their places",
      "explain": "**Digit and value are different.**\nA digit is a written symbol from zero to nine. Its value depends on the place. A four in the hundreds column means four hundreds; in the ones column it means four ones.\n\n**Read a useful chunk.**\nIn 64,518, separate the thousands part from the final three digits. Read the thousands part, then the hundreds, tens and ones that follow. A space or comma can help group digits; it does not mean a decimal point.\n\n**Say the number in words.**\nOur model is “sixty-four thousand five hundred and eighteen”. Say the number, point to each matching part and check that you did not turn a digit into the wrong-sized group.\n\nThe same method works with fewer or more non-zero places. The number of digits gives a starting clue, but the position of each digit settles its value.",
      "example": "I DO:\n64,518 = 60,000 + 4,000 + 500 + 10 + 8.\nWords: sixty-four thousand five hundred and eighteen.\nI match each spoken group with its column, then read the whole count once.\n\nYOU TRY:\nRead 60,426 using the columns. Try before comparing.\n\nCHECK:\nIt is sixty thousand four hundred and twenty-six. The zero column contributes no groups of that size, but still holds its place.",
      "notice": "Do not read every digit as a separate number name when the task asks for the whole number.",
      "check": {
        "question": "Which words correctly read 64,518?",
        "options": [
          "sixty-four thousand six hundred and eighteen",
          "sixty-four thousand four hundred and eighteen",
          "sixty-four thousand five hundred and eighteen",
          "sixty-four thousand five hundred and twenty-eight"
        ],
        "correct_index": 2,
        "explanation": "Sixty-four thousand five hundred and eighteen matches the thousands part and the remaining hundreds, tens and ones. The other readings change a digit’s value."
      },
      "visual": [
        {
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 450 190\"><rect width=\"450\" height=\"190\" fill=\"#f5faf7\"/><rect x=\"0.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"45.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Ten</text><text x=\"45.0\" y=\"64\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">thousands</text><text x=\"45.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">6</text><text x=\"45.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">60,000</text><rect x=\"90.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"135.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Thousands</text><text x=\"135.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">4</text><text x=\"135.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">4,000</text><rect x=\"180.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"225.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Hundreds</text><text x=\"225.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">5</text><text x=\"225.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">500</text><rect x=\"270.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"315.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Tens</text><text x=\"315.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">1</text><text x=\"315.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">10</text><rect x=\"360.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"405.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Ones</text><text x=\"405.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">8</text><text x=\"405.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">8</text></svg>",
          "alt": "A place-value chart for 64,518. Ten thousands: digit 6, value 60,000, Thousands: digit 4, value 4,000, Hundreds: digit 5, value 500, Tens: digit 1, value 10, Ones: digit 8, value 8.",
          "caption": "A digit’s column gives its value."
        }
      ]
    },
    {
      "icon": "📖",
      "title": "Partition without changing the total",
      "explain": "**Partition means split a whole into parts.**\nIn standard expanded form, split a numeral into the value contributed by each non-zero place. Add those contributions to reconstruct the same total.\n\n**Match each term to a column.**\nA term such as five hundred describes the value of a digit in the hundreds place. Writing five instead would lose the unit size. Use addition signs because the parts combine into one total.\n\n**Show the full model.**\n64,518 = 60,000 + 4,000 + 500 + 10 + 8. Read each part, then check the sum. You have represented the same number another way, not made a smaller number.\n\nZero-valued terms can be left out of the addition, but do not shift other digits in the numeral. Keep those two representations distinct.",
      "example": "I DO:\nI split 64,518 into its non-zero place values: 60,000 + 4,000 + 500 + 10 + 8.\nI put each part back into a chart and recover 64,518.\n\nYOU TRY:\nPartition 60,426. Include the value of every non-zero digit.\n\nCHECK:\n60,000 + 400 + 20 + 6 adds to 60,426. A zero place contributes nothing to this sum but remains in the numeral.",
      "notice": "An expanded term includes its unit value. Listing the face digits alone is not standard expanded form.",
      "check": {
        "question": "What must a standard expanded-form term show?",
        "options": [
          "Only the face digit with no place value",
          "The number of letters in the word",
          "The value contributed by its place",
          "A new unrelated count"
        ],
        "correct_index": 2,
        "explanation": "A standard expanded term gives the contribution of a place, so the terms add back to the original number."
      }
    },
    {
      "icon": "📖",
      "title": "Compare equal-sized groups first",
      "explain": "**Comparison asks which whole is larger.**\nFor positive whole numbers, first check how many places are needed. A number with an additional leading non-zero place is larger. For equal-length numerals, compare their highest places first.\n\n**Find the first difference from the left.**\nIf the highest digits match, move one column right. Stop at the first unequal pair. That larger place outweighs all the lower places that follow.\n\n**Use the pair 64,518 and 60,426.**\nThe first unequal digits from the left determine the comparison. A larger final ones digit cannot overcome a smaller earlier thousands or hundreds digit. Think about group size, not just digit size.\n\nLine up matching columns. Leading zeroes do not create a larger positive value; the first non-zero place matters.",
      "example": "I DO:\nCompare 64,518 with 60,426. I line up the columns, move from the left and locate the first difference. 64,518 is greater.\n\nYOU TRY:\nCompare 64,517 and 64,518. Which first unequal column decides it?\n\nCHECK:\n64,518 is greater by one. Most leading places match, so the difference is near the right; begin from the left anyway.",
      "notice": "Compare the first unequal place, not whichever single digit catches your eye.",
      "check": {
        "question": "For equal-length positive whole numbers, where should comparison start?",
        "options": [
          "At whichever digit is brightest",
          "At the largest place on the left",
          "At the ones every time",
          "At the number of commas"
        ],
        "correct_index": 1,
        "explanation": "The largest place carries the greatest unit value. Compare it first, then move right only if it matches."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Whole-number fluency with reasons in action",
            "transcript": "Pip: I am practising how to compare equal-sized groups first. I need to track the value, not just copy digits.\nJuno: Comparison asks which whole is larger.\nFor positive whole numbers, first check how many places are needed. A number with an additional leading non-zero place is larger. For equal-length numerals, compare their highest places first.\nPip: Compare 64,518 with 60,426. I line up the columns, move from the left and locate the first difference. 64,518 is greater.\nJuno: Pause and try a fresh example with the same check. Explain what stays unchanged or which value relationship settles the result.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "I am practising how to compare equal-sized groups first. I need to track the value, not just copy digits."
                  },
                  {
                    "who": "juno",
                    "text": "Comparison asks which whole is larger.\nFor positive whole numbers, first check how many places are needed. A number with an additional leading non-zero place is larger. For equal-length numerals, compare their highest places first."
                  },
                  {
                    "who": "pip",
                    "text": "Compare 64,518 with 60,426. I line up the columns, move from the left and locate the first difference. 64,518 is greater."
                  },
                  {
                    "who": "juno",
                    "text": "Pause and try a fresh example with the same check. Explain what stays unchanged or which value relationship settles the result.",
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
      "title": "Choose a check before speed",
      "explain": "**Fluency includes accuracy and useful method choice.**\nIt is not just finishing quickly. Read what a task asks: number words, a digit value, a partition or a comparison. Choosing the wrong operation quickly does not help.\n\n**Predict a sensible answer.**\nA count should keep its group sizes. A partition should sum to the same whole. A comparison should agree with the first unequal place. Use these expectations to catch a misplaced zero or a wrong-sized change.\n\n**Check with another representation.**\nRead a numeral back from words; rebuild it from a partition; reverse a comparison statement and read its sign. This compares meanings rather than simply repeating the same writing.\n\nKeep a before-and-after note if you repair an error. If your first answer was correct, describe the check that confirmed it. You do not need to invent a mistake.",
      "example": "I DO:\nAttempt: 64,518 = 64,418 + 10.\nI add the parts and get 64,428, not 64,518. I repair the last part to 100 and check the total again.\n\nYOU TRY:\nCheck the statement 64,518 = 64,508 + 10 using the total.\n\nCHECK:\nIt is correct: the two parts add to 64,518. Accuracy comes from the value check, not the length of the expression.",
      "notice": "Use a check suited to the task. Recopying the same unexamined answer does not confirm it.",
      "check": {
        "question": "Which check confirms a partition?",
        "options": [
          "Count its plus signs only",
          "Add the parts and compare with the target",
          "Remove every zero",
          "Choose the longest expression"
        ],
        "correct_index": 1,
        "explanation": "A partition is valid when its parts add to the original total. Its visual length does not settle correctness."
      }
    }
  ],
  "worked_example": "I DO: Complete a connected whole-number fluency with reasons record.\nTarget numeral: 64,518. Words: sixty-four thousand five hundred and eighteen.\nStandard partition: 60,000 + 4,000 + 500 + 10 + 8.\nHundreds digit: 5; value: 500.\nAnother partition: 64,418 + 100 = 64,518.\nComparison: 64,518 > 60,426. I compare matching places from the left; the first unequal place decides. The difference is 4,092.\nAscending set: 60,426, 64,518, 64,618.\n\nWHY THE REPRESENTATIONS AGREE\nThe written numeral, words and expanded sum describe the same place groups. The non-standard partition also returns the same total. Comparing uses those group values, not only the shape of a single digit.\n\nCOMMON MISTAKE AND FIX\nWriting the hundreds digit’s value as 5 loses its unit size. I change the value label to 500. Another possible error is deleting the zero in 60,426; I keep its column and reread the whole count.\n\nCHECK\nI rebuild the numeral from its non-zero terms and read the comparison in both directions. If a check disagrees, I revisit the relevant column before changing unrelated digits.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 450 190\"><rect width=\"450\" height=\"190\" fill=\"#f5faf7\"/><rect x=\"0.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"45.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Ten</text><text x=\"45.0\" y=\"64\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">thousands</text><text x=\"45.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">6</text><text x=\"45.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">60,000</text><rect x=\"90.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"135.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Thousands</text><text x=\"135.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">0</text><text x=\"135.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">0</text><rect x=\"180.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"225.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Hundreds</text><text x=\"225.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">4</text><text x=\"225.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">400</text><rect x=\"270.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"315.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Tens</text><text x=\"315.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">2</text><text x=\"315.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">20</text><rect x=\"360.0\" y=\"10\" width=\"90.0\" height=\"160\" fill=\"none\" stroke=\"#254c3c\"/><text x=\"405.0\" y=\"39\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"19\" fill=\"#173c2c\">Ones</text><text x=\"405.0\" y=\"108\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"30\" fill=\"#173c2c\">6</text><text x=\"405.0\" y=\"145\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"18\" fill=\"#173c2c\">6</text></svg>",
      "alt": "A place-value chart for 60,426. Ten thousands: digit 6, value 60,000, Thousands: digit 0, value 0, Hundreds: digit 4, value 400, Tens: digit 2, value 20, Ones: digit 6, value 6.",
      "caption": "A digit’s column gives its value."
    }
  ],
  "guided_practice": "WE DO: Prepare a second record using 60,426.\n1. Label the columns and insert the digits. Read it before comparing with “sixty thousand four hundred and twenty-six”.\n2. Find the hundreds digit and its contribution. Compare after your attempt: 400.\n3. Partition it. Check against 60,000 + 400 + 20 + 6, then add those terms back.\n4. Compare 60,426 with 64,518; name the first unequal place rather than choosing by the final digit.\n5. Make one different partition by setting aside a hundred. Check: 60,326 + 100.\n6. Explain one check you used. If you made an error, repair only the mismatched place and read the result again.\nYou can draw the chart or describe it in text. The explanation matters more than decorative layout.",
  "independent_task": "YOU DO: Whole-number fluency with reasons record (about 20 minutes).\nUse these numbers: 64,721; 60,536; 64,506; 60,406.\n1. Say what each part of the task asks before answering: numeral, words, place value, partition or order.\n2. For each value, give its words and expanded form. Order the set, then choose one answer to check through a different representation.\n3. Show working for at least two decisions with a labelled chart, equation or comparison reason.\n4. Check those decisions by rebuilding a total, reading words back or comparing neighbouring values.\n5. Explain one improvement or one check that confirmed a correct answer.\nWork on paper or in the big box. If using paper, type the answers and a clear working summary. Check: correct range and places; zeroes preserved; complete requested representations; a specific reason and a check. An upload is optional.",
  "response_prompt": "Which place-group or representation check helped most in your whole-number fluency with reasons record?",
  "quiz": [
    {
      "question": "Which words correctly read 64,518?",
      "options": [
        "sixty-four thousand six hundred and eighteen",
        "sixty-four thousand four hundred and eighteen",
        "sixty-four thousand five hundred and eighteen",
        "sixty-four thousand five hundred and twenty-eight"
      ],
      "correct_index": 2,
      "explanation": "Sixty-four thousand five hundred and eighteen matches the thousands part and the remaining hundreds, tens and ones. The other readings change a digit’s value.",
      "type": "multiple_choice"
    },
    {
      "question": "What must a standard expanded-form term show?",
      "options": [
        "Only the face digit with no place value",
        "The number of letters in the word",
        "The value contributed by its place",
        "A new unrelated count"
      ],
      "correct_index": 2,
      "explanation": "A standard expanded term gives the contribution of a place, so the terms add back to the original number.",
      "type": "multiple_choice"
    },
    {
      "question": "For equal-length positive whole numbers, where should comparison start?",
      "options": [
        "At whichever digit is brightest",
        "At the largest place on the left",
        "At the ones every time",
        "At the number of commas"
      ],
      "correct_index": 1,
      "explanation": "The largest place carries the greatest unit value. Compare it first, then move right only if it matches.",
      "type": "multiple_choice"
    },
    {
      "question": "Which check confirms a partition?",
      "options": [
        "Count its plus signs only",
        "Add the parts and compare with the target",
        "Remove every zero",
        "Choose the longest expression"
      ],
      "correct_index": 1,
      "explanation": "A partition is valid when its parts add to the original total. Its visual length does not settle correctness.",
      "type": "multiple_choice"
    },
    {
      "type": "multiple_choice",
      "question": "What is one more than 64,518?",
      "options": [
        "64528",
        "64519",
        "64618",
        "64517"
      ],
      "correct_index": 1,
      "explanation": "Counting by one adds exactly one unit."
    },
    {
      "type": "multiple_choice",
      "question": "What is 64,418 + 100?",
      "options": [
        "64428",
        "64618",
        "64518",
        "64418"
      ],
      "correct_index": 2,
      "explanation": "The two parts rebuild the original total."
    },
    {
      "type": "multiple_choice",
      "question": "What is the value of the tens digit in 64,518?",
      "options": [
        "10",
        "1",
        "100",
        "1000"
      ],
      "correct_index": 0,
      "explanation": "The tens place counts groups of ten."
    },
    {
      "question": "Which list is ascending?",
      "options": [
        "64,618, 64,518, 60,426",
        "64,518, 60,426, 64,618",
        "60,426, 64,618, 64,518",
        "60,426, 64,518, 64,618"
      ],
      "correct_index": 3,
      "explanation": "The values increase from least to greatest; every neighbouring pair is in the correct direction.",
      "type": "multiple_choice"
    },
    {
      "type": "short_answer",
      "question": "Write a different two-part partition of 64,518 and check it.",
      "sample_answer": "64,418 + 100 = 64,518. The parts add back to the target.",
      "marking_guide": "Accept any correct non-standard two-part partition with a total check.",
      "explanation": "The partition must preserve the whole value."
    },
    {
      "type": "short_answer",
      "question": "Explain why 64,518 is greater than 60,426.",
      "sample_answer": "Compare matching columns from the left. The first unequal place has a larger value in the first numeral.",
      "marking_guide": "Accept the actual first unequal place or a correct positive-difference reason.",
      "explanation": "A value relationship supports the comparison, rather than the final digit alone."
    }
  ],
  "parent_notes": "Parent: Teaches whole-number fluency with reasons to 100,000, with explicit digit/value and zero-place distinctions. Original content follows the repository’s topic sequence. Exact outcome codes are empty pending verified mapping; this is not a claim of complete syllabus coverage.\n\nParent: Look for the requested representation and the reasoning behind it, not speed. Standard and flexible partitions both preserve value. The lesson itself supplies the teaching and feedback. Your role is access support and reviewing the evidence.\n\nParent: Task models: 64,721: sixty-four thousand seven hundred and twenty-one; 60,000 + 4,000 + 700 + 20 + 1; next 64,722, 64,723; 60,536: sixty thousand five hundred and thirty-six; 60,000 + 500 + 30 + 6; next 60,537, 60,538; 64,506: sixty-four thousand five hundred and six; 60,000 + 4,000 + 500 + 6; next 64,507, 64,508; 60,406: sixty thousand four hundred and six; 60,000 + 400 + 6; next 60,407, 60,408. Ascending order: 60,406, 60,536, 64,506, 64,721. Accept other correct partitions and specific checks.\n\nParent: Eight scored choices use the unchanged 90% threshold, requiring 8/8. Two written responses are manually reviewed. Models: 64,418 + 100 = 64,518. The parts add back to the target. Compare matching columns from the left. The first unequal place has a larger value in the first numeral.",
  "evidence_instructions": "Keep the whole-number fluency with reasons answers, two worked decisions, checking note, reflection and written quiz responses.",
  "offline_alternative": "Copy the four task numbers and draw place columns on paper. Complete the whole-number fluency with reasons record and check it, then type your evidence later.",
  "extension": "Choose a new number below 100,000. Represent it in words and two partitions, then explain how it compares with 64,518.",
  "stage_hints": {
    "accept": [
      "Read the mission about whole-number fluency with reasons.",
      "You will practise whole-number fluency with reasons through models before making your own response.",
      "Begin with the first explanation of whole-number fluency with reasons; the examples remain available while you work."
    ],
    "teach0": [
      "Look at how the thousands chunk and final digits are read.",
      "Point to the matching place while saying each number-word part.",
      "Read the large group first, then the remaining hundreds, tens and ones; match the result back to the chart."
    ],
    "teach1": [
      "Look at each expanded term beside its place column.",
      "Write the value of each non-empty group instead of only its digit.",
      "Add the terms back and check that the original numeral returns."
    ],
    "teach2": [
      "Look at the first unequal place from the left.",
      "Line up matching places and move right only while they match.",
      "Compare the two group values at the first difference; later smaller places cannot reverse it."
    ],
    "teach3": [
      "Look at the task’s requested representation.",
      "Choose a different way to test the same total or relationship.",
      "Add a partition back, read words into a numeral or reverse a comparison to check its meaning."
    ],
    "learn": [
      "Read the numeral and expanded form together.",
      "Match each part of the sum to its place column.",
      "Rebuild the same total, then use matching place values to check the comparison."
    ],
    "guided": [
      "Begin by labelling the second numeral’s columns.",
      "Complete one representation before comparing it with the suggestion.",
      "Read the words back into a chart and check that every digit returns to its intended place."
    ],
    "write": [
      "Start by copying the first task numeral accurately.",
      "Begin “This numeral has ____ groups of ____.”",
      "A partial record begins “For my first number, the largest place is ____. I checked it by ____.” Add your own values and working."
    ],
    "quiz": [
      "Return to the step for the representation named in the question.",
      "Distinguish a face digit, a value, a partition and an order statement.",
      "Use the matching column or total check before selecting an option; explain the value relationship for a written response."
    ],
    "submit": [
      "Check that your whole-number fluency with reasons task and working are present.",
      "Include the whole-number fluency with reasons reflection and any written reasoning you produced.",
      "Send your whole-number fluency with reasons evidence for review; type a clear record if you used paper."
    ]
  }
}'), updated_at=datetime('now') WHERE seed_key='s2-mat-y4-w01-l4';

-- s4-mat-y8-w01-l1
UPDATE lessons SET title='Year 8: Classify rational and irrational numbers', data=json_patch(data, '{
  "seed_key": "s4-mat-y8-w01-l1",
  "title": "Year 8: Classify rational and irrational numbers",
  "stage": "S4",
  "learning_area": "Mathematics",
  "year_level": "Year 8",
  "week": 1,
  "lesson_number": 1,
  "duration_minutes": 60,
  "child_mission": "Investigate classify rational and irrational numbers. Use a representation, show each decision and check the result.",
  "learning_intention": "We are learning to explain and apply classify rational and irrational numbers.",
  "success_criteria": [
    "I can explain the key number idea with an example.",
    "I can use the taught representation or calculation method.",
    "I can show a reason for my result.",
    "I can check a result and interpret it accurately."
  ],
  "materials": [
    "Everything you need to read is included in this lesson",
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
  "spelling_focus": null,
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
      "icon": "🔎",
      "title": "Define rational numbers with an exact fraction",
      "explain": "**A rational number can be written as a ratio of integers.**\nThe form is a/b, where a and b are integers and b is not zero. The fraction describes an exact value. One half, negative three quarters and five all qualify: five can be written as five over one.\n\n**A denominator cannot be zero.**\nDivision by zero does not give an ordinary number in this definition. A fraction with zero on top and a non-zero denominator is different: zero over five equals zero and is rational.\n\n**Different forms can name the same value.**\nOne half and two quarters are equal. A decimal such as 0.5 equals one half. Classify the value rather than treating each notation as a separate kind of number.\n\nState an exact fraction as evidence when you can. A numeral’s visual length is not a classification rule.",
      "example": "I DO:\n0.75 = 75/100 = 3/4, so it is rational.\n−3 = −3/1, so negative integers are rational too.\n\nYOU TRY:\nGive a fraction for 0.2 and classify it.\n\nCHECK:\n0.2 = 2/10 = 1/5. Its exact integer-ratio representation makes it rational.",
      "notice": "An integer is also rational. Categories can nest rather than exclude each other.",
      "check": {
        "question": "Which statement establishes that 0.75 is rational?",
        "options": [
          "It has three characters",
          "It is positive",
          "It can be written exactly as 3/4",
          "It is less than ten"
        ],
        "correct_index": 2,
        "explanation": "The exact ratio of integers with a non-zero denominator meets the definition."
      },
      "visual": [
        {
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 178\"><rect width=\"420\" height=\"178\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Exact value ≠ rounded display</text><text x=\"16\" y=\"80\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Ratio? Square check? Scale?</text><text x=\"16\" y=\"126\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Choose the matching method</text></svg>",
          "alt": "A decision diagram distinguishes exact values from rounded displays and prompts the matching ratio, square or scale check.",
          "caption": "Choose the method for the question."
        }
      ]
    },
    {
      "icon": "🔎",
      "title": "Distinguish terminating and recurring decimals",
      "explain": "**A terminating decimal stops.**\nFor example, 0.125 has a final displayed digit and equals 125/1000. Every finite decimal can be written with a power-of-ten denominator, so it is rational.\n\n**A recurring decimal repeats a pattern forever.**\nOne third is 0.333… where the threes continue indefinitely. It does not terminate, but it is rational because the exact value is one third. A repeating block may contain several digits.\n\n**Dots need a stated meaning.**\nAn ellipsis alone does not tell you whether every later digit repeats. Here we explicitly state when a decimal is recurring. A short calculator display may be only a rounded approximation to a longer decimal.\n\nDo not classify every non-terminating decimal as irrational. The recurring pattern is the important distinction in this explanation.",
      "example": "I DO:\n0.125 terminates and equals 1/8.\n0.333… with threes repeating forever equals 1/3, so it is rational too.\n\nYOU TRY:\nClassify 0.6 and 0.666… with sixes recurring forever.\n\nCHECK:\nBoth are rational. The first equals 3/5; the second equals 2/3. Their different decimal forms do not exclude either from the integer-ratio definition.",
      "notice": "A recurring decimal is non-terminating but rational. A rounded display is not the full exact value.",
      "check": {
        "question": "Which decimal is rational despite not terminating?",
        "options": [
          "A decimal stated to be non-recurring forever",
          "An unspecified incomplete display",
          "A number with no stated value",
          "0.333… with threes recurring forever"
        ],
        "correct_index": 3,
        "explanation": "This exact recurring decimal equals 1/3, a ratio of integers."
      }
    },
    {
      "icon": "🔎",
      "title": "Recognise irrational values and their approximations",
      "explain": "**An irrational number is not an exact ratio of integers.**\nIts decimal representation does not terminate or repeat a fixed block forever. The square root of two and pi are examples. This lesson uses those established examples; it does not prove their irrationality.\n\n**An approximation is a different value.**\nThe square root of two is about 1.414, but not exactly 1.414. The finite decimal 1.414 is rational because it equals 1414/1000. Approximating an irrational value does not make the exact value rational.\n\n**Use the approximate sign carefully.**\nThe symbol ≈ means approximately equal. Use it for a rounded decimal, while = claims exact equality. Write √2 ≈ 1.414 when using that three-decimal approximation.\n\nAvoid classifying an exact value from a few displayed digits. Identify what the symbol or problem actually specifies.",
      "example": "I DO:\nExact value: √2, irrational.\nApproximation: 1.414, rational as a finite decimal.\nRecord: √2 ≈ 1.414, not √2 = 1.414.\n\nYOU TRY:\nExplain why the displayed approximation 3.14 does not make the exact value pi rational.\n\nCHECK:\n3.14 is a finite rational decimal; pi is a different exact value with a non-terminating, non-recurring decimal representation.",
      "notice": "Exact and approximate are different labels. Keep them attached to the intended value.",
      "check": {
        "question": "Which statement correctly distinguishes √2 and 1.414?",
        "options": [
          "Both are exactly the same rational value",
          "√2 is irrational; 1.414 is a rational approximation",
          "A finite decimal can never be rational",
          "The digits prove √2 terminates"
        ],
        "correct_index": 1,
        "explanation": "The exact root is irrational, while the displayed finite decimal is an exact rational value used as an approximation."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Check the method for classify rational and irrational numbers",
            "transcript": "Pip: I am working on classify rational and irrational numbers. I need to know what the notation asks.\nJuno: A rational number can be written as a ratio of integers.\nThe form is a/b, where a and b are integers and b is not zero. The fraction describes an exact value. One half, negative three quarters and five all qualify: five can be written as five over one.\nPip: 0.75 = 75/100 = 3/4, so it is rational.\n−3 = −3/1, so negative integers are rational too.\nJuno: Pause and try a fresh example with this method. Check it against the representation before continuing.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "I am working on classify rational and irrational numbers. I need to know what the notation asks."
                  },
                  {
                    "who": "juno",
                    "text": "A rational number can be written as a ratio of integers.\nThe form is a/b, where a and b are integers and b is not zero. The fraction describes an exact value. One half, negative three quarters and five all qualify: five can be written as five over one."
                  },
                  {
                    "who": "pip",
                    "text": "0.75 = 75/100 = 3/4, so it is rational.\n−3 = −3/1, so negative integers are rational too."
                  },
                  {
                    "who": "juno",
                    "text": "Pause and try a fresh example with this method. Check it against the representation before continuing.",
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
      "icon": "🔎",
      "title": "Classify real numbers with a reason",
      "explain": "**Real numbers include rational and irrational values.**\nThey can be represented as positions on a number line. Integers sit inside the rational group, and rational and irrational together make the real-number group studied here.\n\n**Ask for evidence, not appearance.**\nAn exact fraction, integer or terminating/recurring decimal supports rational classification. An established irrational value such as √2 needs its exact identity preserved. A square-root symbol alone does not imply irrationality: √9 is exactly three.\n\n**State the category and why.**\nUse “This value is rational because ____” or “The exact value is irrational; its displayed decimal is only an approximation.” Do not use positivity, number of digits or neatness as a reason.\n\nIf an unfamiliar decimal is only partly shown and no pattern is specified, the display may not supply enough information. Say what evidence is missing instead of guessing the exact value.",
      "example": "I DO:\n√9 = 3 = 3/1, so it is rational.\n√2 is irrational as an exact value.\n−0.5 = −1/2, so it is rational.\n\nYOU TRY:\nClassify 7 and give an integer-ratio reason.\n\nCHECK:\n7 is rational because 7 = 7/1. Being an integer also places it within the rational numbers.",
      "notice": "A radical sign is notation, not a guarantee of irrationality.",
      "check": {
        "question": "Why is √9 rational?",
        "options": [
          "Every root is irrational",
          "It equals exactly 3, which can be written as 3/1",
          "It has only one printed digit",
          "It is a positive symbol"
        ],
        "correct_index": 1,
        "explanation": "The principal root of nine is exactly three, an integer ratio with non-zero denominator."
      }
    }
  ],
  "worked_example": "I DO: Complete a classify rational and irrational numbers response.\n−4 = −4/1; 0.125 = 1/8; recurring thirds = 1/3; √9 = 3: all rational. √2 is irrational. 1.414 = 707/500 is rational and only approximates √2.\n\nEXPLAIN THE DECISIONS\nUse the definitions and checks taught above. A classification needs an exact-value reason. The exact irrational value and its finite rational approximation require separate labels.\n\nCOMMON MISTAKE AND FIX\nTreating the finite display 1.414 as exactly √2 confuses value and approximation. I use ≈ and classify the display separately.\n\nCHECK\nKeep exact and approximate labels, notation conventions and units attached. Use the taught check appropriate to the question rather than a rule from an unrelated number operation.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 178\"><rect width=\"420\" height=\"178\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Exact value ≠ rounded display</text><text x=\"16\" y=\"80\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Ratio? Square check? Scale?</text><text x=\"16\" y=\"126\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Choose the matching method</text></svg>",
      "alt": "A decision diagram distinguishes exact values from rounded displays and prompts the matching ratio, square or scale check.",
      "caption": "Choose the method for the question."
    }
  ],
  "guided_practice": "WE DO:\n1. Rewrite 0.5 as a fraction before comparing: 1/2, so rational.\n2. Rewrite −2 as an integer ratio: −2/1, so rational.\n3. Classify 0.666… when sixes repeat forever. Compare: 2/3, so rational despite not terminating.\n4. Separate exact √2 from 1.414. Use an approximate relation and give each value its own category.\n5. Explain why √9 is not irrational just because it has a radical symbol. Feedback: it equals three exactly.\n6. Check each reason against a definition, not the visual length of the notation.",
  "independent_task": "YOU DO: Classify rational and irrational numbers record (about 25–30 minutes).\n1. Classify −4, 0.125, 0.333… with threes recurring forever, √9, √2 and 1.414. Give an exact fraction or established exact-value reason. Explain the difference between √2 and its finite approximation.\n2. Show the relevant exact fraction, square relationship, bounds or power-of-ten check for each result.\n3. Explain two decisions with the definitions taught in the lesson.\n4. Identify and repair a possible error in notation or reasoning. If your work is already correct, explain the check that confirmed it.\n5. Write a short reflection about the representation that was most useful.\nUse paper or the big box. Type a working summary for paper work; no upload is required.\nSuccess checklist: complete requested results; correct exact/approximate labels; notation conventions respected; workings and units where needed; two explanations; independent check.",
  "response_prompt": "Which representation or check changed your understanding of classify rational and irrational numbers, and why?",
  "quiz": [
    {
      "question": "Which statement establishes that 0.75 is rational?",
      "options": [
        "It has three characters",
        "It is positive",
        "It can be written exactly as 3/4",
        "It is less than ten"
      ],
      "correct_index": 2,
      "explanation": "The exact ratio of integers with a non-zero denominator meets the definition.",
      "type": "multiple_choice"
    },
    {
      "question": "Which decimal is rational despite not terminating?",
      "options": [
        "A decimal stated to be non-recurring forever",
        "An unspecified incomplete display",
        "A number with no stated value",
        "0.333… with threes recurring forever"
      ],
      "correct_index": 3,
      "explanation": "This exact recurring decimal equals 1/3, a ratio of integers.",
      "type": "multiple_choice"
    },
    {
      "question": "Which statement correctly distinguishes √2 and 1.414?",
      "options": [
        "Both are exactly the same rational value",
        "√2 is irrational; 1.414 is a rational approximation",
        "A finite decimal can never be rational",
        "The digits prove √2 terminates"
      ],
      "correct_index": 1,
      "explanation": "The exact root is irrational, while the displayed finite decimal is an exact rational value used as an approximation.",
      "type": "multiple_choice"
    },
    {
      "question": "Why is √9 rational?",
      "options": [
        "Every root is irrational",
        "It equals exactly 3, which can be written as 3/1",
        "It has only one printed digit",
        "It is a positive symbol"
      ],
      "correct_index": 1,
      "explanation": "The principal root of nine is exactly three, an integer ratio with non-zero denominator.",
      "type": "multiple_choice"
    },
    {
      "question": "Which value is rational?",
      "options": [
        "√2 as an exact value",
        "7 = 7/1",
        "Pi as an exact value",
        "A specified non-recurring infinite decimal"
      ],
      "correct_index": 1,
      "explanation": "Seven is an exact ratio of integers.",
      "type": "multiple_choice"
    },
    {
      "question": "Which value is irrational?",
      "options": [
        "0.25",
        "−3",
        "√2 as an exact value",
        "1/2"
      ],
      "correct_index": 2,
      "explanation": "The exact square root of two is irrational; the other values have exact integer-ratio forms.",
      "type": "multiple_choice"
    },
    {
      "question": "What is 0.125 as a fraction?",
      "options": [
        "1/8",
        "1/3",
        "1/2",
        "1/5"
      ],
      "correct_index": 0,
      "explanation": "One eighth equals 0.125 exactly.",
      "type": "multiple_choice"
    },
    {
      "question": "Which symbol suits a rounded decimal for √2?",
      "options": [
        "A claim that it terminates",
        "An equality to every display",
        "A negative sign",
        "Approximately equal"
      ],
      "correct_index": 3,
      "explanation": "A rounded decimal approximates the exact irrational root.",
      "type": "multiple_choice"
    },
    {
      "question": "What does recurring mean?",
      "options": [
        "Any displayed decimal with a final digit",
        "A pattern repeats indefinitely",
        "Every decimal is an integer",
        "The pattern stops after one block"
      ],
      "correct_index": 1,
      "explanation": "A recurring decimal repeats a stated digit pattern without ending.",
      "type": "multiple_choice"
    },
    {
      "question": "Why is 1.414 rational?",
      "options": [
        "It has an irrational-looking shape",
        "It equals exact √2",
        "It is a finite decimal expressible as an integer ratio",
        "It is longer than one digit"
      ],
      "correct_index": 2,
      "explanation": "It equals 1414/1000 exactly, even though it may be used to approximate an irrational value.",
      "type": "multiple_choice"
    }
  ],
  "parent_notes": "Parent: Teaches classify rational and irrational numbers from definitions to explanation and application. Original content follows the repository’s topic sequence. Exact outcome codes are empty pending verified mapping; this is not a claim of complete syllabus coverage.\n\nParent: Look for explicit working and a check of signs, scale, notation or units as appropriate. A correct guess without a method is weaker evidence than an explained calculation. The lesson itself supplies the teaching and feedback. Your role is access support and reviewing the evidence.\n\nParent: Model task answers: −4 = −4/1; 0.125 = 1/8; recurring thirds = 1/3; √9 = 3: all rational. √2 is irrational. 1.414 = 707/500 is rational and only approximates √2.\n\nParent: Ten scored choices use the unchanged 90% threshold, requiring 9/10. The independent task and reflection supply written reasoning for manual review.",
  "evidence_instructions": "Keep the classify rational and irrational numbers task working, explanation, checking record, reflection and quiz result.",
  "offline_alternative": "Copy the included examples and task prompts onto paper. Use the diagrams and models to complete the classify rational and irrational numbers working without a service, then type an evidence summary later.",
  "extension": "Choose one new example of the lesson’s number idea. Give an exact representation or verified bound, and explain what a common incorrect interpretation would miss.",
  "stage_hints": {
    "accept": [
      "Read the mission about classify rational and irrational numbers.",
      "You will practise classify rational and irrational numbers through models before making your own response.",
      "Begin with the first explanation of classify rational and irrational numbers; the examples remain available while you work."
    ],
    "teach0": [
      "Reread the integer-ratio definition.",
      "Ask whether the displayed value has an exact fraction representation.",
      "Show an integer numerator and a non-zero integer denominator as evidence."
    ],
    "teach1": [
      "Look for a stated stopping point or recurring pattern.",
      "Separate an exact decimal definition from a rounded display.",
      "Use the supplied exact fraction or repeating pattern to justify classification."
    ],
    "teach2": [
      "Find whether the question names the exact value or a display.",
      "Label the approximation separately before classifying it.",
      "Use equality only for exact agreement; a rounded representation needs the approximate relation."
    ],
    "teach3": [
      "Look for an exact equivalent before assigning a category.",
      "Check whether a root gives an integer or an established irrational value.",
      "State a fraction or exact-value reason; avoid judging the shape of the notation."
    ],
    "learn": [
      "Read the complete model before judging its result.",
      "Match each decision to the definition and representation used in this model.",
      "Explain one intermediate step and check that the final conclusion answers the original classify rational and irrational numbers question."
    ],
    "guided": [
      "Start with the first supplied quantity and identify its role.",
      "Work one classify rational and irrational numbers example before comparing with the feedback.",
      "Record the intermediate representation and test the result against it before continuing."
    ],
    "write": [
      "Copy the first classify rational and irrational numbers task and label its quantities.",
      "Begin “The given information is ____. I will use ____ because ____.”",
      "A partial opening is “My first step is to represent ____. This shows ____.” Continue with your own working and result."
    ],
    "quiz": [
      "Return to the definition or method for the specific classify rational and irrational numbers question.",
      "Check what the symbols ask for before comparing the options.",
      "Use the taught representation to work independently, then check the meaning and unit of the result."
    ],
    "submit": [
      "Check that your classify rational and irrational numbers task and working are present.",
      "Include the classify rational and irrational numbers reflection and any written reasoning you produced.",
      "Send your classify rational and irrational numbers evidence for review; type a clear record if you used paper."
    ]
  }
}'), updated_at=datetime('now') WHERE seed_key='s4-mat-y8-w01-l1';

-- s4-mat-y8-w01-l2
UPDATE lessons SET title='Year 8: Explain and estimate square roots', data=json_patch(data, '{
  "seed_key": "s4-mat-y8-w01-l2",
  "title": "Year 8: Explain and estimate square roots",
  "stage": "S4",
  "learning_area": "Mathematics",
  "year_level": "Year 8",
  "week": 1,
  "lesson_number": 2,
  "duration_minutes": 60,
  "child_mission": "Investigate explain and estimate square roots. Use a representation, show each decision and check the result.",
  "learning_intention": "We are learning to explain and apply explain and estimate square roots.",
  "success_criteria": [
    "I can explain the key number idea with an example.",
    "I can use the taught representation or calculation method.",
    "I can show a reason for my result.",
    "I can check a result and interpret it accurately."
  ],
  "materials": [
    "Everything you need to read is included in this lesson",
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
  "spelling_focus": null,
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
      "icon": "🔎",
      "title": "Connect square roots with squaring",
      "explain": "**Squaring multiplies a value by itself.**\nThe notation 3² means 3 × 3 = 9, not 3 × 2. A square grid models the two equal side lengths and the resulting number of unit squares.\n\n**The square root reverses this question.**\nThe notation √9 asks for the non-negative value whose square is nine. It is three. The radical symbol √ denotes the principal, non-negative square root in this lesson.\n\n**Area and side have different units.**\nIf the square’s area is nine square metres, its side is three metres. The root changes a squared quantity to a length; do not label the side in square metres.\n\nSay what is known and what is asked before calculating. This avoids confusing a side length with an area or an exponent with a multiplier.",
      "example": "I DO:\n3² = 9, so √9 = 3.\nFor a square of area 9 m², side length is 3 m.\n\nYOU TRY:\nWhat is √16? Check by squaring your proposed answer.\n\nCHECK:\n√16 = 4 because 4 × 4 = 16. The radical denotes the non-negative root.",
      "notice": "An exponent is not a multiplier. Square by using the value as both factors.",
      "check": {
        "question": "What is √16?",
        "options": [
          "8",
          "4",
          "-4",
          "32"
        ],
        "correct_index": 1,
        "explanation": "The principal root is non-negative and four squared equals sixteen."
      },
      "visual": [
        {
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 300\"><rect width=\"420\" height=\"300\" fill=\"#f5faf7\"/><text x=\"210\" y=\"30\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"22\" fill=\"#173c2c\">Area: nine square units</text><rect x=\"100\" y=\"60\" width=\"55\" height=\"55\" fill=\"#cbe4d7\" stroke=\"#173c2c\" stroke-width=\"2\"/><rect x=\"155\" y=\"60\" width=\"55\" height=\"55\" fill=\"#cbe4d7\" stroke=\"#173c2c\" stroke-width=\"2\"/><rect x=\"210\" y=\"60\" width=\"55\" height=\"55\" fill=\"#cbe4d7\" stroke=\"#173c2c\" stroke-width=\"2\"/><rect x=\"100\" y=\"115\" width=\"55\" height=\"55\" fill=\"#cbe4d7\" stroke=\"#173c2c\" stroke-width=\"2\"/><rect x=\"155\" y=\"115\" width=\"55\" height=\"55\" fill=\"#cbe4d7\" stroke=\"#173c2c\" stroke-width=\"2\"/><rect x=\"210\" y=\"115\" width=\"55\" height=\"55\" fill=\"#cbe4d7\" stroke=\"#173c2c\" stroke-width=\"2\"/><rect x=\"100\" y=\"170\" width=\"55\" height=\"55\" fill=\"#cbe4d7\" stroke=\"#173c2c\" stroke-width=\"2\"/><rect x=\"155\" y=\"170\" width=\"55\" height=\"55\" fill=\"#cbe4d7\" stroke=\"#173c2c\" stroke-width=\"2\"/><rect x=\"210\" y=\"170\" width=\"55\" height=\"55\" fill=\"#cbe4d7\" stroke=\"#173c2c\" stroke-width=\"2\"/><text x=\"180\" y=\"250\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"22\" fill=\"#173c2c\">Side: three units</text><text x=\"210\" y=\"285\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"22\" fill=\"#173c2c\">3 × 3 = 9. √9 = 3.</text></svg>",
          "alt": "A three-by-three square grid has nine unit squares. Each side measures three units, demonstrating that the principal square root of nine is three.",
          "caption": "Side length is the square root of square area."
        }
      ]
    },
    {
      "icon": "🔎",
      "title": "Use perfect squares as exact anchors",
      "explain": "**A perfect square is an integer square.**\nZero, one, four, nine, sixteen and twenty-five are perfect squares because they come from squaring integers. Their principal square roots are exact integers.\n\n**Build a useful anchor list.**\nKnow what each anchor means: five squared is twenty-five, six squared is thirty-six, seven squared is forty-nine and eight squared is sixty-four. Do not memorise an unlabelled list and lose the factor relationship.\n\n**Check a root through multiplication.**\nA proposed square root of thirty-six is six because six times six gives thirty-six. Dividing the radicand by two answers a different operation.\n\nInclude zero where relevant: zero squared is zero and its principal root is zero. The non-negative-root convention includes it.",
      "example": "I DO:\n5² = 25 → √25 = 5.\n6² = 36 → √36 = 6.\n\nYOU TRY:\nUse the anchor list to find √49, then verify it.\n\nCHECK:\nSeven times seven is forty-nine, so √49 = 7.",
      "notice": "Halving is not square-rooting. The inverse check is multiplying the candidate by itself.",
      "check": {
        "question": "What is √36?",
        "options": [
          "18",
          "-6",
          "6",
          "72"
        ],
        "correct_index": 2,
        "explanation": "Six multiplied by itself gives thirty-six; the principal root is six."
      }
    },
    {
      "icon": "🔎",
      "title": "Locate non-perfect roots between anchors",
      "explain": "**Not every positive integer is a perfect square.**\nTen lies between nine and sixteen. Because three squared is nine and four squared is sixteen, √10 lies between three and four. This gives a useful interval without guessing an exact decimal.\n\n**Preserve the direction of the bounds.**\nFor non-negative values, larger squares come from larger roots. Choose the nearest square below and above the radicand, then transfer their non-negative roots to the bounds.\n\n**An interval is not an exact answer.**\nSaying three < √10 < four locates the value. It does not say the root equals three or four. A decimal estimate can refine the interval but remains approximate unless exact equality is justified.\n\nCheck the endpoints by squaring. That confirms that the original radicand sits between them and keeps the estimate anchored in the number relationship.",
      "example": "I DO:\n9 < 10 < 16, so 3 < √10 < 4.\nFor √20, use 16 < 20 < 25, so 4 < √20 < 5.\n\nYOU TRY:\nLocate √30 between consecutive integer roots.\n\nCHECK:\n25 < 30 < 36, so 5 < √30 < 6.",
      "notice": "A between statement locates an exact value; it does not replace it with an endpoint.",
      "check": {
        "question": "Which interval contains √20?",
        "options": [
          "Between 2 and 3",
          "Between 3 and 4",
          "Between 4 and 5",
          "Between 5 and 6"
        ],
        "correct_index": 2,
        "explanation": "Twenty lies between sixteen and twenty-five, whose principal roots are four and five."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Check the method for explain and estimate square roots",
            "transcript": "Pip: I am working on explain and estimate square roots. I need to know what the notation asks.\nJuno: Squaring multiplies a value by itself.\nThe notation 3² means 3 × 3 = 9, not 3 × 2. A square grid models the two equal side lengths and the resulting number of unit squares.\nPip: 3² = 9, so √9 = 3.\nFor a square of area 9 m², side length is 3 m.\nJuno: Pause and try a fresh example with this method. Check it against the representation before continuing.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "I am working on explain and estimate square roots. I need to know what the notation asks."
                  },
                  {
                    "who": "juno",
                    "text": "Squaring multiplies a value by itself.\nThe notation 3² means 3 × 3 = 9, not 3 × 2. A square grid models the two equal side lengths and the resulting number of unit squares."
                  },
                  {
                    "who": "pip",
                    "text": "3² = 9, so √9 = 3.\nFor a square of area 9 m², side length is 3 m."
                  },
                  {
                    "who": "juno",
                    "text": "Pause and try a fresh example with this method. Check it against the representation before continuing.",
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
      "icon": "🔎",
      "title": "Distinguish a principal root from equation solutions",
      "explain": "**The radical gives one principal root.**\n√25 equals five. It does not mean both five and negative five. That is the notation convention used for the root expression.\n\n**A squared-variable equation can have two solutions.**\nFor x² = 25, both x = 5 and x = −5 work because each squares to twenty-five. This is a different question from evaluating √25.\n\n**Use context to select a meaningful solution.**\nA square’s side length is non-negative, so an area calculation uses the principal root for the length. The equation’s negative solution is mathematically valid but not a negative physical side length.\n\nRead the prompt carefully: evaluate a radical, solve an equation or find a physical length. Then check candidate values in the appropriate original relation.",
      "example": "I DO:\nExpression: √25 = 5.\nEquation: x² = 25 → x = 5 or x = −5.\nSide of a square with area 25 m²: 5 m.\n\nYOU TRY:\nExplain why −4 is a solution of x² = 16 but not the value of √16.\n\nCHECK:\n(−4) × (−4) = 16, but √ denotes the principal non-negative root, which is four.",
      "notice": "Do not write two values for a principal radical. Keep expression and equation questions separate.",
      "check": {
        "question": "Which statement respects the principal-root convention?",
        "options": [
          "√25 = −5 only",
          "√25 means both signs at once",
          "A square can have a negative side length",
          "√25 = 5; x² = 25 has solutions 5 and −5"
        ],
        "correct_index": 3,
        "explanation": "The radical denotes the non-negative root; the squared equation accepts either sign because both square to twenty-five."
      }
    }
  ],
  "worked_example": "I DO: Complete a explain and estimate square roots response.\nRoots: 5, 7, 8. Bounds: 3 < √10 < 4; 4 < √20 < 5; 5 < √30 < 6. √36 = 6, whereas x² = 36 has x = 6 or −6. Side for 49 m²: 7 m.\n\nEXPLAIN THE DECISIONS\nUse the definitions and checks taught above. A root result must return the radicand when squared. Distinguish a principal radical from a squared-variable equation and preserve length units in a physical square.\n\nCOMMON MISTAKE AND FIX\nHalving a radicand does not find its root. I square the proposed non-negative value and compare with the original.\n\nCHECK\nKeep exact and approximate labels, notation conventions and units attached. Use the taught check appropriate to the question rather than a rule from an unrelated number operation.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 300\"><rect width=\"420\" height=\"300\" fill=\"#f5faf7\"/><text x=\"210\" y=\"30\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"22\" fill=\"#173c2c\">Area: nine square units</text><rect x=\"100\" y=\"60\" width=\"55\" height=\"55\" fill=\"#cbe4d7\" stroke=\"#173c2c\" stroke-width=\"2\"/><rect x=\"155\" y=\"60\" width=\"55\" height=\"55\" fill=\"#cbe4d7\" stroke=\"#173c2c\" stroke-width=\"2\"/><rect x=\"210\" y=\"60\" width=\"55\" height=\"55\" fill=\"#cbe4d7\" stroke=\"#173c2c\" stroke-width=\"2\"/><rect x=\"100\" y=\"115\" width=\"55\" height=\"55\" fill=\"#cbe4d7\" stroke=\"#173c2c\" stroke-width=\"2\"/><rect x=\"155\" y=\"115\" width=\"55\" height=\"55\" fill=\"#cbe4d7\" stroke=\"#173c2c\" stroke-width=\"2\"/><rect x=\"210\" y=\"115\" width=\"55\" height=\"55\" fill=\"#cbe4d7\" stroke=\"#173c2c\" stroke-width=\"2\"/><rect x=\"100\" y=\"170\" width=\"55\" height=\"55\" fill=\"#cbe4d7\" stroke=\"#173c2c\" stroke-width=\"2\"/><rect x=\"155\" y=\"170\" width=\"55\" height=\"55\" fill=\"#cbe4d7\" stroke=\"#173c2c\" stroke-width=\"2\"/><rect x=\"210\" y=\"170\" width=\"55\" height=\"55\" fill=\"#cbe4d7\" stroke=\"#173c2c\" stroke-width=\"2\"/><text x=\"180\" y=\"250\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"22\" fill=\"#173c2c\">Side: three units</text><text x=\"210\" y=\"285\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"22\" fill=\"#173c2c\">3 × 3 = 9. √9 = 3.</text></svg>",
      "alt": "A three-by-three square grid has nine unit squares. Each side measures three units, demonstrating that the principal square root of nine is three.",
      "caption": "Side length is the square root of square area."
    }
  ],
  "guided_practice": "WE DO:\n1. Find √9 using the square grid. Check: three squared gives nine.\n2. Find √25 and verify with multiplication. Check: five squared gives twenty-five.\n3. Locate √10. First use the surrounding perfect squares, then compare: three < √10 < four.\n4. Write the principal √16 and the two solutions of x² = 16 on separate lines.\n5. For a square of area 16 m², state its side and unit. Check: four metres, not four square metres.\n6. Explain one notation distinction and one calculation check in your own words.",
  "independent_task": "YOU DO: Explain and estimate square roots record (about 25–30 minutes).\n1. Find √25, √49 and √64 with square checks. Bound √10, √20 and √30 between consecutive integers. Distinguish √36 from the solutions of x² = 36, then find the side of a square with area 49 m².\n2. Show the relevant exact fraction, square relationship, bounds or power-of-ten check for each result.\n3. Explain two decisions with the definitions taught in the lesson.\n4. Identify and repair a possible error in notation or reasoning. If your work is already correct, explain the check that confirmed it.\n5. Write a short reflection about the representation that was most useful.\nUse paper or the big box. Type a working summary for paper work; no upload is required.\nSuccess checklist: complete requested results; correct exact/approximate labels; notation conventions respected; workings and units where needed; two explanations; independent check.",
  "response_prompt": "Which representation or check changed your understanding of explain and estimate square roots, and why?",
  "quiz": [
    {
      "type": "multiple_choice",
      "question": "What is √16?",
      "options": [
        "8",
        "4",
        "-4",
        "32"
      ],
      "correct_index": 1,
      "explanation": "The principal root is non-negative and four squared equals sixteen."
    },
    {
      "type": "multiple_choice",
      "question": "What is √36?",
      "options": [
        "18",
        "-6",
        "6",
        "72"
      ],
      "correct_index": 2,
      "explanation": "Six multiplied by itself gives thirty-six; the principal root is six."
    },
    {
      "question": "Which interval contains √20?",
      "options": [
        "Between 2 and 3",
        "Between 3 and 4",
        "Between 4 and 5",
        "Between 5 and 6"
      ],
      "correct_index": 2,
      "explanation": "Twenty lies between sixteen and twenty-five, whose principal roots are four and five.",
      "type": "multiple_choice"
    },
    {
      "question": "Which statement respects the principal-root convention?",
      "options": [
        "√25 = −5 only",
        "√25 means both signs at once",
        "A square can have a negative side length",
        "√25 = 5; x² = 25 has solutions 5 and −5"
      ],
      "correct_index": 3,
      "explanation": "The radical denotes the non-negative root; the squared equation accepts either sign because both square to twenty-five.",
      "type": "multiple_choice"
    },
    {
      "type": "multiple_choice",
      "question": "What is √49?",
      "options": [
        "24.5",
        "7",
        "-7",
        "14"
      ],
      "correct_index": 1,
      "explanation": "Seven squared is forty-nine, and the principal root is non-negative."
    },
    {
      "type": "multiple_choice",
      "question": "What is √64?",
      "options": [
        "32",
        "-8",
        "8",
        "16"
      ],
      "correct_index": 2,
      "explanation": "Eight squared is sixty-four."
    },
    {
      "question": "Where does √30 lie?",
      "options": [
        "Between 5 and 6",
        "Between 3 and 4",
        "Between 6 and 7",
        "Exactly 30"
      ],
      "correct_index": 0,
      "explanation": "Thirty lies between twenty-five and thirty-six.",
      "type": "multiple_choice"
    },
    {
      "question": "Which pair solves x² = 16?",
      "options": [
        "Only 16 and −16",
        "Only 8 and −8",
        "Only 0 and 4",
        "4 and −4"
      ],
      "correct_index": 3,
      "explanation": "Both four and negative four square to sixteen.",
      "type": "multiple_choice"
    },
    {
      "question": "A square has area 49 m². What is its side?",
      "options": [
        "7 m²",
        "7 m",
        "24.5 m",
        "49 m"
      ],
      "correct_index": 1,
      "explanation": "The principal root is seven and the side has length units.",
      "type": "multiple_choice"
    },
    {
      "question": "How can a proposed root be checked?",
      "options": [
        "Halve the radicand",
        "Count printed digits",
        "Multiply the proposed root by itself",
        "Remove every symbol"
      ],
      "correct_index": 2,
      "explanation": "Squaring reverses the root question.",
      "type": "multiple_choice"
    }
  ],
  "parent_notes": "Parent: Teaches explain and estimate square roots from definitions to explanation and application. Original content follows the repository’s topic sequence. Exact outcome codes are empty pending verified mapping; this is not a claim of complete syllabus coverage.\n\nParent: Look for explicit working and a check of signs, scale, notation or units as appropriate. A correct guess without a method is weaker evidence than an explained calculation. The lesson itself supplies the teaching and feedback. Your role is access support and reviewing the evidence.\n\nParent: Model task answers: Roots: 5, 7, 8. Bounds: 3 < √10 < 4; 4 < √20 < 5; 5 < √30 < 6. √36 = 6, whereas x² = 36 has x = 6 or −6. Side for 49 m²: 7 m.\n\nParent: Ten scored choices use the unchanged 90% threshold, requiring 9/10. The independent task and reflection supply written reasoning for manual review.",
  "evidence_instructions": "Keep the explain and estimate square roots task working, explanation, checking record, reflection and quiz result.",
  "offline_alternative": "Copy the included examples and task prompts onto paper. Use the diagrams and models to complete the explain and estimate square roots working without a service, then type an evidence summary later.",
  "extension": "Choose one new example of the lesson’s number idea. Give an exact representation or verified bound, and explain what a common incorrect interpretation would miss.",
  "stage_hints": {
    "accept": [
      "Read the mission about explain and estimate square roots.",
      "You will practise explain and estimate square roots through models before making your own response.",
      "Begin with the first explanation of explain and estimate square roots; the examples remain available while you work."
    ],
    "teach0": [
      "Look at the equal sides of the square model.",
      "Ask which non-negative factor multiplied by itself makes the area value.",
      "Square your candidate and compare with the given radicand."
    ],
    "teach1": [
      "Find the relevant square anchor, not half the value.",
      "Match the radicand with an integer multiplied by itself.",
      "Use that non-negative factor as the root and verify its square."
    ],
    "teach2": [
      "Look for the perfect squares on either side of the radicand.",
      "Take their non-negative integer roots as bounds.",
      "Square the bounds to verify that they enclose the original value."
    ],
    "teach3": [
      "Look at whether the prompt is a radical or an equation.",
      "Check each proposed solution by squaring, then apply the notation convention.",
      "For a length, choose the non-negative result and give length units."
    ],
    "learn": [
      "Read the complete model before judging its result.",
      "Match each decision to the definition and representation used in this model.",
      "Explain one intermediate step and check that the final conclusion answers the original explain and estimate square roots question."
    ],
    "guided": [
      "Start with the first supplied quantity and identify its role.",
      "Work one explain and estimate square roots example before comparing with the feedback.",
      "Record the intermediate representation and test the result against it before continuing."
    ],
    "write": [
      "Copy the first explain and estimate square roots task and label its quantities.",
      "Begin “The given information is ____. I will use ____ because ____.”",
      "A partial opening is “My first step is to represent ____. This shows ____.” Continue with your own working and result."
    ],
    "quiz": [
      "Return to the definition or method for the specific explain and estimate square roots question.",
      "Check what the symbols ask for before comparing the options.",
      "Use the taught representation to work independently, then check the meaning and unit of the result."
    ],
    "submit": [
      "Check that your explain and estimate square roots task and working are present.",
      "Include the explain and estimate square roots reflection and any written reasoning you produced.",
      "Send your explain and estimate square roots evidence for review; type a clear record if you used paper."
    ]
  }
}'), updated_at=datetime('now') WHERE seed_key='s4-mat-y8-w01-l2';

-- s4-mat-y8-w01-l3
UPDATE lessons SET title='Year 8: Use scientific notation accurately', data=json_patch(data, '{
  "seed_key": "s4-mat-y8-w01-l3",
  "title": "Year 8: Use scientific notation accurately",
  "stage": "S4",
  "learning_area": "Mathematics",
  "year_level": "Year 8",
  "week": 1,
  "lesson_number": 3,
  "duration_minutes": 60,
  "child_mission": "Investigate use scientific notation accurately. Use a representation, show each decision and check the result.",
  "learning_intention": "We are learning to explain and apply use scientific notation accurately.",
  "success_criteria": [
    "I can explain the key number idea with an example.",
    "I can use the taught representation or calculation method.",
    "I can show a reason for my result.",
    "I can check a result and interpret it accurately."
  ],
  "materials": [
    "Everything you need to read is included in this lesson",
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
  "spelling_focus": null,
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
      "icon": "🔎",
      "title": "Define scientific notation through place value",
      "explain": "**Scientific notation is a × 10ⁿ.**\nFor a positive value, the coefficient a must be at least one and less than ten, and n is an integer exponent. The power of ten supplies the scale; the coefficient carries the significant digits.\n\n**An exponent records repeated factors or their reciprocal.**\nTen cubed is 10 × 10 × 10 = 1,000. Ten to the zero power is one. Ten to the negative three power is 1/1,000. A negative exponent here does not make the represented positive number negative.\n\n**Check both parts of the form.**\n4.2 × 10³ is standard scientific notation. 42 × 10² has the same value but its coefficient is outside the required interval. Equivalent value and standard form are separate questions.\n\nFor this lesson we represent positive values. Zero and signed coefficients require additional conventions; do not silently extend the coefficient rule to them.",
      "example": "I DO:\n4.2 × 10³ = 4.2 × 1,000 = 4,200.\n42 × 10² also equals 4,200, but 42 is not a standard coefficient.\n\nYOU TRY:\nIs 3.5 × 10² in standard form? State the coefficient check.\n\nCHECK:\nYes. The coefficient 3.5 is at least one and less than ten, and the exponent is an integer.",
      "notice": "Value equality does not guarantee standard scientific-notation form.",
      "check": {
        "question": "Which is standard scientific notation for 4,200?",
        "options": [
          "42 × 10²",
          "0.42 × 10⁴",
          "4,200 × 10⁰",
          "4.2 × 10³"
        ],
        "correct_index": 3,
        "explanation": "The value is 4,200 and the coefficient 4.2 lies in the required interval from one inclusive to ten exclusive."
      },
      "visual": [
        {
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 178\"><rect width=\"420\" height=\"178\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">4.5 × 10⁴ = 45,000</text><text x=\"16\" y=\"80\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">6.4 × 10⁻³ = 0.0064</text><text x=\"16\" y=\"126\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Check: multiply or divide back</text></svg>",
          "alt": "Positive and negative powers of ten scale standard coefficients to large and small positive values.",
          "caption": "The exponent controls scale; retain the unit."
        }
      ]
    },
    {
      "icon": "🔎",
      "title": "Convert a large value and verify it",
      "explain": "**Choose the coefficient first.**\nFor forty-five thousand, place the decimal after the first non-zero digit to get 4.5. Count how much scale is needed to recover the original value, rather than treating decimal movement as an unexplained trick.\n\n**Restore the value with a positive power.**\n4.5 × 10⁴ means 4.5 multiplied by ten thousand, giving forty-five thousand. The positive exponent expands a coefficient between one and ten into a value at least ten when the exponent is positive.\n\n**Count place changes accurately.**\nFrom 45,000 to 4.5 is four decimal-place changes. An exponent of three would give 4,500 instead. Multiply back to check the scale, not only the coefficient.\n\nPreserve all required digits from the supplied exact number. This lesson is converting notation, not deciding measurement precision or rounding away meaningful digits.",
      "example": "I DO:\n45,000 = 4.5 × 10⁴.\nCheck: 4.5 × 10,000 = 45,000.\n\nYOU TRY:\nConvert 72,000 and multiply back.\n\nCHECK:\n72,000 = 7.2 × 10⁴ because 7.2 × 10,000 returns the original value.",
      "notice": "An off-by-one exponent changes the value by a factor of ten. Multiply back.",
      "check": {
        "question": "Which represents 72,000 in standard scientific notation?",
        "options": [
          "7.2 × 10³",
          "7.2 × 10⁴",
          "72 × 10³",
          "0.72 × 10⁵"
        ],
        "correct_index": 1,
        "explanation": "Multiplying 7.2 by ten thousand gives 72,000 and its coefficient is standard."
      }
    },
    {
      "icon": "🔎",
      "title": "Represent a small positive value",
      "explain": "**A negative exponent scales down.**\nTen to the negative three is one thousandth. Multiplying a positive coefficient by it divides the coefficient by one thousand. The result remains positive.\n\n**Choose a standard coefficient for the small value.**\n0.0064 becomes 6.4 × 10⁻³ because 6.4 divided by one thousand is 0.0064. The leading zeroes position the value; they do not become extra significant non-zero digits.\n\n**Keep exponent sign and number sign distinct.**\n6.4 × 10⁻³ is a small positive number. The negative exponent describes the scale. It is not the same as −6.4 × 10³, which is a large negative value.\n\nVerify through the fraction or division meaning of the power. If the answer exceeds one when the original was a small positive decimal below one, revisit the exponent direction.",
      "example": "I DO:\n0.0064 = 6.4 × 10⁻³ = 6.4/1,000.\nCheck by division, not by interpreting the exponent as a negative coefficient.\n\nYOU TRY:\nWrite 0.0008 in standard scientific notation.\n\nCHECK:\n8 × 10⁻⁴, because 8 divided by ten thousand is 0.0008.",
      "notice": "The exponent sign controls scale. It does not supply the sign of the coefficient.",
      "check": {
        "question": "Which is standard scientific notation for the positive number 0.0008?",
        "options": [
          "8 × 10⁴",
          "−8 × 10⁴",
          "8 × 10⁻⁴",
          "0.8 × 10⁻³"
        ],
        "correct_index": 2,
        "explanation": "Eight multiplied by one ten-thousandth is 0.0008, and eight is a standard coefficient."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Check the method for use scientific notation accurately",
            "transcript": "Pip: I am working on use scientific notation accurately. I need to know what the notation asks.\nJuno: Scientific notation is a × 10ⁿ.\nFor a positive value, the coefficient a must be at least one and less than ten, and n is an integer exponent. The power of ten supplies the scale; the coefficient carries the significant digits.\nPip: 4.2 × 10³ = 4.2 × 1,000 = 4,200.\n42 × 10² also equals 4,200, but 42 is not a standard coefficient.\nJuno: Pause and try a fresh example with this method. Check it against the representation before continuing.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "I am working on use scientific notation accurately. I need to know what the notation asks."
                  },
                  {
                    "who": "juno",
                    "text": "Scientific notation is a × 10ⁿ.\nFor a positive value, the coefficient a must be at least one and less than ten, and n is an integer exponent. The power of ten supplies the scale; the coefficient carries the significant digits."
                  },
                  {
                    "who": "pip",
                    "text": "4.2 × 10³ = 4.2 × 1,000 = 4,200.\n42 × 10² also equals 4,200, but 42 is not a standard coefficient."
                  },
                  {
                    "who": "juno",
                    "text": "Pause and try a fresh example with this method. Check it against the representation before continuing.",
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
      "icon": "🔎",
      "title": "Read back, compare and retain units",
      "explain": "**Convert back before interpreting a scale.**\n3.6 × 10² is 360; 3.6 × 10⁻² is 0.036. Check the exponent sign and multiplication or division before attaching a contextual conclusion.\n\n**Compare standard positive forms carefully.**\nIf two standard coefficients are positive, the greater exponent gives the greater value. When the exponents match, compare the coefficients. This relies on the coefficients both satisfying the standard interval.\n\n**Keep measurement units unchanged.**\nWriting 4.5 × 10⁴ m means forty-five thousand metres. Scientific notation changes the numerical representation, not metres into kilometres. A unit conversion is a separate operation.\n\nShow an exact value check and a unit label. If a measurement is approximate, keep that qualification; changing notation does not remove measurement uncertainty.",
      "example": "I DO:\n3.6 × 10² m = 360 m.\n3.6 × 10⁻² m = 0.036 m.\nFor 4.2 × 10³ and 7.1 × 10², the first is greater; conversion confirms 4,200 > 710.\n\nYOU TRY:\nCompare 2.4 × 10³ with 3.1 × 10³.\n\nCHECK:\nThe exponents match, so compare 2.4 and 3.1. The second value is greater.",
      "notice": "Notation conversion and unit conversion are different tasks.",
      "check": {
        "question": "What is 3.6 × 10² metres in ordinary notation?",
        "options": [
          "360 metres",
          "0.036 metres",
          "360 kilometres",
          "36 metres"
        ],
        "correct_index": 0,
        "explanation": "The power scales 3.6 by one hundred, giving 360; the supplied unit remains metres."
      }
    }
  ],
  "worked_example": "I DO: Complete a use scientific notation accurately response.\n45,000 = 4.5 × 10⁴; 72,000 = 7.2 × 10⁴; 0.0064 = 6.4 × 10⁻³; 0.0008 = 8 × 10⁻⁴. Back conversions: 360 and 0.036. 4,200 > 710. Metres stay metres.\n\nEXPLAIN THE DECISIONS\nUse the definitions and checks taught above. A scientific-notation form needs both a correct value and a coefficient within its stated interval.\n\nCOMMON MISTAKE AND FIX\nChoosing the exponent one place too small changes the value by a factor of ten. I multiply or divide back to recover the original.\n\nCHECK\nKeep exact and approximate labels, notation conventions and units attached. Use the taught check appropriate to the question rather than a rule from an unrelated number operation.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 178\"><rect width=\"420\" height=\"178\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">4.5 × 10⁴ = 45,000</text><text x=\"16\" y=\"80\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">6.4 × 10⁻³ = 0.0064</text><text x=\"16\" y=\"126\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Check: multiply or divide back</text></svg>",
      "alt": "Positive and negative powers of ten scale standard coefficients to large and small positive values.",
      "caption": "The exponent controls scale; retain the unit."
    }
  ],
  "guided_practice": "WE DO:\n1. Convert 4,200 by choosing a standard coefficient. Check: 4.2 × 10³.\n2. Multiply back by one thousand to verify the original value.\n3. Convert 0.0035. Check: 3.5 × 10⁻³, then divide by one thousand.\n4. Compare 2.4 × 10³ with 3.1 × 10³. The common exponent lets you compare coefficients.\n5. Convert 2.4 × 10³ m back while keeping the unit. Check: 2,400 m.\n6. Explain one exponent choice and why notation conversion does not change the measurement unit.",
  "independent_task": "YOU DO: Use scientific notation accurately record (about 25–30 minutes).\n1. Convert 45,000; 72,000; 0.0064; 0.0008 to standard scientific notation. Convert 3.6 × 10² and 3.6 × 10⁻² back. Compare 4.2 × 10³ with 7.1 × 10², and retain metres when a quantity is given in metres.\n2. Show the relevant exact fraction, square relationship, bounds or power-of-ten check for each result.\n3. Explain two decisions with the definitions taught in the lesson.\n4. Identify and repair a possible error in notation or reasoning. If your work is already correct, explain the check that confirmed it.\n5. Write a short reflection about the representation that was most useful.\nUse paper or the big box. Type a working summary for paper work; no upload is required.\nSuccess checklist: complete requested results; correct exact/approximate labels; notation conventions respected; workings and units where needed; two explanations; independent check.",
  "response_prompt": "Which representation or check changed your understanding of use scientific notation accurately, and why?",
  "quiz": [
    {
      "question": "Which is standard scientific notation for 4,200?",
      "options": [
        "42 × 10²",
        "0.42 × 10⁴",
        "4,200 × 10⁰",
        "4.2 × 10³"
      ],
      "correct_index": 3,
      "explanation": "The value is 4,200 and the coefficient 4.2 lies in the required interval from one inclusive to ten exclusive.",
      "type": "multiple_choice"
    },
    {
      "question": "Which represents 72,000 in standard scientific notation?",
      "options": [
        "7.2 × 10³",
        "7.2 × 10⁴",
        "72 × 10³",
        "0.72 × 10⁵"
      ],
      "correct_index": 1,
      "explanation": "Multiplying 7.2 by ten thousand gives 72,000 and its coefficient is standard.",
      "type": "multiple_choice"
    },
    {
      "question": "Which is standard scientific notation for the positive number 0.0008?",
      "options": [
        "8 × 10⁴",
        "−8 × 10⁴",
        "8 × 10⁻⁴",
        "0.8 × 10⁻³"
      ],
      "correct_index": 2,
      "explanation": "Eight multiplied by one ten-thousandth is 0.0008, and eight is a standard coefficient.",
      "type": "multiple_choice"
    },
    {
      "question": "What is 3.6 × 10² metres in ordinary notation?",
      "options": [
        "360 metres",
        "0.036 metres",
        "360 kilometres",
        "36 metres"
      ],
      "correct_index": 0,
      "explanation": "The power scales 3.6 by one hundred, giving 360; the supplied unit remains metres.",
      "type": "multiple_choice"
    },
    {
      "question": "Which represents 45,000?",
      "options": [
        "4.5 × 10³",
        "4.5 × 10⁴",
        "45 × 10²",
        "0.45 × 10³"
      ],
      "correct_index": 1,
      "explanation": "The coefficient multiplied by ten thousand gives forty-five thousand.",
      "type": "multiple_choice"
    },
    {
      "question": "Which is standard for 0.0064?",
      "options": [
        "6.4 × 10³",
        "0.64 × 10⁻²",
        "6.4 × 10⁻³",
        "64 × 10⁻⁴"
      ],
      "correct_index": 2,
      "explanation": "Six point four divided by one thousand gives the small positive value and its coefficient is standard.",
      "type": "multiple_choice"
    },
    {
      "question": "What does a negative exponent on ten indicate here?",
      "options": [
        "A reciprocal scale, not a negative coefficient",
        "A negative temperature automatically",
        "An instruction to reverse every digit",
        "A zero result"
      ],
      "correct_index": 0,
      "explanation": "Ten to a negative integer power is the reciprocal of its positive power.",
      "type": "multiple_choice"
    },
    {
      "question": "Which coefficient is in the required positive interval?",
      "options": [
        "0.45",
        "45",
        "10",
        "4.5"
      ],
      "correct_index": 3,
      "explanation": "The coefficient must be at least one and less than ten.",
      "type": "multiple_choice"
    },
    {
      "question": "Which is greater?",
      "options": [
        "7.1 × 10²",
        "4.2 × 10³",
        "They are equal",
        "The smaller exponent always wins"
      ],
      "correct_index": 1,
      "explanation": "The values are 710 and 4,200 respectively.",
      "type": "multiple_choice"
    },
    {
      "question": "What is 3.6 × 10⁻²?",
      "options": [
        "360",
        "36",
        "0.036",
        "−360"
      ],
      "correct_index": 2,
      "explanation": "Dividing 3.6 by one hundred gives 0.036.",
      "type": "multiple_choice"
    }
  ],
  "parent_notes": "Parent: Teaches use scientific notation accurately from definitions to explanation and application. Original content follows the repository’s topic sequence. Exact outcome codes are empty pending verified mapping; this is not a claim of complete syllabus coverage.\n\nParent: Look for explicit working and a check of signs, scale, notation or units as appropriate. A correct guess without a method is weaker evidence than an explained calculation. The lesson itself supplies the teaching and feedback. Your role is access support and reviewing the evidence.\n\nParent: Model task answers: 45,000 = 4.5 × 10⁴; 72,000 = 7.2 × 10⁴; 0.0064 = 6.4 × 10⁻³; 0.0008 = 8 × 10⁻⁴. Back conversions: 360 and 0.036. 4,200 > 710. Metres stay metres.\n\nParent: Ten scored choices use the unchanged 90% threshold, requiring 9/10. The independent task and reflection supply written reasoning for manual review.",
  "evidence_instructions": "Keep the use scientific notation accurately task working, explanation, checking record, reflection and quiz result.",
  "offline_alternative": "Copy the included examples and task prompts onto paper. Use the diagrams and models to complete the use scientific notation accurately working without a service, then type an evidence summary later.",
  "extension": "Choose one new example of the lesson’s number idea. Give an exact representation or verified bound, and explain what a common incorrect interpretation would miss.",
  "stage_hints": {
    "accept": [
      "Read the mission about use scientific notation accurately.",
      "You will practise use scientific notation accurately through models before making your own response.",
      "Begin with the first explanation of use scientific notation accurately; the examples remain available while you work."
    ],
    "teach0": [
      "Check the coefficient’s interval before judging the whole form.",
      "Evaluate the power of ten to check the represented value.",
      "Require both correct value and a standard coefficient; do not choose by appearance alone."
    ],
    "teach1": [
      "Find a coefficient with one non-zero digit before the decimal.",
      "Count the scale needed to rebuild the original large number.",
      "Multiply the coefficient by that power of ten and compare the exact result."
    ],
    "teach2": [
      "Label the original decimal as a small positive value.",
      "Use the reciprocal meaning of a negative power of ten.",
      "Divide the chosen standard coefficient by the corresponding positive power and compare."
    ],
    "teach3": [
      "Read the exponent sign and retain the stated unit.",
      "Convert one value back before making the contextual claim.",
      "Compare standard exponents first, then coefficients when exponents match; verify by ordinary values if needed."
    ],
    "learn": [
      "Read the complete model before judging its result.",
      "Match each decision to the definition and representation used in this model.",
      "Explain one intermediate step and check that the final conclusion answers the original use scientific notation accurately question."
    ],
    "guided": [
      "Start with the first supplied quantity and identify its role.",
      "Work one use scientific notation accurately example before comparing with the feedback.",
      "Record the intermediate representation and test the result against it before continuing."
    ],
    "write": [
      "Copy the first use scientific notation accurately task and label its quantities.",
      "Begin “The given information is ____. I will use ____ because ____.”",
      "A partial opening is “My first step is to represent ____. This shows ____.” Continue with your own working and result."
    ],
    "quiz": [
      "Return to the definition or method for the specific use scientific notation accurately question.",
      "Check what the symbols ask for before comparing the options.",
      "Use the taught representation to work independently, then check the meaning and unit of the result."
    ],
    "submit": [
      "Check that your use scientific notation accurately task and working are present.",
      "Include the use scientific notation accurately reflection and any written reasoning you produced.",
      "Send your use scientific notation accurately evidence for review; type a clear record if you used paper."
    ]
  }
}'), updated_at=datetime('now') WHERE seed_key='s4-mat-y8-w01-l3';

-- s4-mat-y8-w01-l4
UPDATE lessons SET title='Year 8: Real-number fluency with checks', data=json_patch(data, '{
  "seed_key": "s4-mat-y8-w01-l4",
  "title": "Year 8: Real-number fluency with checks",
  "stage": "S4",
  "learning_area": "Mathematics",
  "year_level": "Year 8",
  "week": 1,
  "lesson_number": 4,
  "duration_minutes": 60,
  "child_mission": "Investigate real-number fluency with checks. Use a representation, show each decision and check the result.",
  "learning_intention": "We are learning to explain and apply real-number fluency with checks.",
  "success_criteria": [
    "I can explain the key number idea with an example.",
    "I can use the taught representation or calculation method.",
    "I can show a reason for my result.",
    "I can check a result and interpret it accurately."
  ],
  "materials": [
    "Everything you need to read is included in this lesson",
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
  "spelling_focus": null,
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
      "icon": "🔎",
      "title": "Define rational numbers with an exact fraction",
      "explain": "**A rational number can be written as a ratio of integers.**\nThe form is a/b, where a and b are integers and b is not zero. The fraction describes an exact value. One half, negative three quarters and five all qualify: five can be written as five over one.\n\n**A denominator cannot be zero.**\nDivision by zero does not give an ordinary number in this definition. A fraction with zero on top and a non-zero denominator is different: zero over five equals zero and is rational.\n\n**Different forms can name the same value.**\nOne half and two quarters are equal. A decimal such as 0.5 equals one half. Classify the value rather than treating each notation as a separate kind of number.\n\nState an exact fraction as evidence when you can. A numeral’s visual length is not a classification rule.",
      "example": "I DO:\n0.75 = 75/100 = 3/4, so it is rational.\n−3 = −3/1, so negative integers are rational too.\n\nYOU TRY:\nGive a fraction for 0.2 and classify it.\n\nCHECK:\n0.2 = 2/10 = 1/5. Its exact integer-ratio representation makes it rational.",
      "notice": "An integer is also rational. Categories can nest rather than exclude each other.",
      "check": {
        "question": "Which statement establishes that 0.75 is rational?",
        "options": [
          "It has three characters",
          "It is positive",
          "It can be written exactly as 3/4",
          "It is less than ten"
        ],
        "correct_index": 2,
        "explanation": "The exact ratio of integers with a non-zero denominator meets the definition."
      },
      "visual": [
        {
          "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 178\"><rect width=\"420\" height=\"178\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Exact value ≠ rounded display</text><text x=\"16\" y=\"80\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Ratio? Square check? Scale?</text><text x=\"16\" y=\"126\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Choose the matching method</text></svg>",
          "alt": "A decision diagram distinguishes exact values from rounded displays and prompts the matching ratio, square or scale check.",
          "caption": "Choose the method for the question."
        }
      ]
    },
    {
      "icon": "🔎",
      "title": "Recognise irrational values and their approximations",
      "explain": "**An irrational number is not an exact ratio of integers.**\nIts decimal representation does not terminate or repeat a fixed block forever. The square root of two and pi are examples. This lesson uses those established examples; it does not prove their irrationality.\n\n**An approximation is a different value.**\nThe square root of two is about 1.414, but not exactly 1.414. The finite decimal 1.414 is rational because it equals 1414/1000. Approximating an irrational value does not make the exact value rational.\n\n**Use the approximate sign carefully.**\nThe symbol ≈ means approximately equal. Use it for a rounded decimal, while = claims exact equality. Write √2 ≈ 1.414 when using that three-decimal approximation.\n\nAvoid classifying an exact value from a few displayed digits. Identify what the symbol or problem actually specifies.",
      "example": "I DO:\nExact value: √2, irrational.\nApproximation: 1.414, rational as a finite decimal.\nRecord: √2 ≈ 1.414, not √2 = 1.414.\n\nYOU TRY:\nExplain why the displayed approximation 3.14 does not make the exact value pi rational.\n\nCHECK:\n3.14 is a finite rational decimal; pi is a different exact value with a non-terminating, non-recurring decimal representation.",
      "notice": "Exact and approximate are different labels. Keep them attached to the intended value.",
      "check": {
        "question": "Which statement correctly distinguishes √2 and 1.414?",
        "options": [
          "Both are exactly the same rational value",
          "√2 is irrational; 1.414 is a rational approximation",
          "A finite decimal can never be rational",
          "The digits prove √2 terminates"
        ],
        "correct_index": 1,
        "explanation": "The exact root is irrational, while the displayed finite decimal is an exact rational value used as an approximation."
      }
    },
    {
      "icon": "🔎",
      "title": "Connect square roots with squaring",
      "explain": "**Squaring multiplies a value by itself.**\nThe notation 3² means 3 × 3 = 9, not 3 × 2. A square grid models the two equal side lengths and the resulting number of unit squares.\n\n**The square root reverses this question.**\nThe notation √9 asks for the non-negative value whose square is nine. It is three. The radical symbol √ denotes the principal, non-negative square root in this lesson.\n\n**Area and side have different units.**\nIf the square’s area is nine square metres, its side is three metres. The root changes a squared quantity to a length; do not label the side in square metres.\n\nSay what is known and what is asked before calculating. This avoids confusing a side length with an area or an exponent with a multiplier.",
      "example": "I DO:\n3² = 9, so √9 = 3.\nFor a square of area 9 m², side length is 3 m.\n\nYOU TRY:\nWhat is √16? Check by squaring your proposed answer.\n\nCHECK:\n√16 = 4 because 4 × 4 = 16. The radical denotes the non-negative root.",
      "notice": "An exponent is not a multiplier. Square by using the value as both factors.",
      "check": {
        "question": "What is √16?",
        "options": [
          "8",
          "4",
          "-4",
          "32"
        ],
        "correct_index": 1,
        "explanation": "The principal root is non-negative and four squared equals sixteen."
      },
      "visual_before": [
        {
          "episode": {
            "title": "Check the method for real-number fluency with checks",
            "transcript": "Pip: I am working on real-number fluency with checks. I need to know what the notation asks.\nJuno: A rational number can be written as a ratio of integers.\nThe form is a/b, where a and b are integers and b is not zero. The fraction describes an exact value. One half, negative three quarters and five all qualify: five can be written as five over one.\nPip: 0.75 = 75/100 = 3/4, so it is rational.\n−3 = −3/1, so negative integers are rational too.\nJuno: Pause and try a fresh example with this method. Check it against the representation before continuing.",
            "scenes": [
              {
                "bg": "room",
                "lines": [
                  {
                    "who": "pip",
                    "text": "I am working on real-number fluency with checks. I need to know what the notation asks."
                  },
                  {
                    "who": "juno",
                    "text": "A rational number can be written as a ratio of integers.\nThe form is a/b, where a and b are integers and b is not zero. The fraction describes an exact value. One half, negative three quarters and five all qualify: five can be written as five over one."
                  },
                  {
                    "who": "pip",
                    "text": "0.75 = 75/100 = 3/4, so it is rational.\n−3 = −3/1, so negative integers are rational too."
                  },
                  {
                    "who": "juno",
                    "text": "Pause and try a fresh example with this method. Check it against the representation before continuing.",
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
      "icon": "🔎",
      "title": "Locate non-perfect roots between anchors",
      "explain": "**Not every positive integer is a perfect square.**\nTen lies between nine and sixteen. Because three squared is nine and four squared is sixteen, √10 lies between three and four. This gives a useful interval without guessing an exact decimal.\n\n**Preserve the direction of the bounds.**\nFor non-negative values, larger squares come from larger roots. Choose the nearest square below and above the radicand, then transfer their non-negative roots to the bounds.\n\n**An interval is not an exact answer.**\nSaying three < √10 < four locates the value. It does not say the root equals three or four. A decimal estimate can refine the interval but remains approximate unless exact equality is justified.\n\nCheck the endpoints by squaring. That confirms that the original radicand sits between them and keeps the estimate anchored in the number relationship.",
      "example": "I DO:\n9 < 10 < 16, so 3 < √10 < 4.\nFor √20, use 16 < 20 < 25, so 4 < √20 < 5.\n\nYOU TRY:\nLocate √30 between consecutive integer roots.\n\nCHECK:\n25 < 30 < 36, so 5 < √30 < 6.",
      "notice": "A between statement locates an exact value; it does not replace it with an endpoint.",
      "check": {
        "question": "Which interval contains √20?",
        "options": [
          "Between 2 and 3",
          "Between 3 and 4",
          "Between 4 and 5",
          "Between 5 and 6"
        ],
        "correct_index": 2,
        "explanation": "Twenty lies between sixteen and twenty-five, whose principal roots are four and five."
      }
    },
    {
      "icon": "🔎",
      "title": "Define scientific notation through place value",
      "explain": "**Scientific notation is a × 10ⁿ.**\nFor a positive value, the coefficient a must be at least one and less than ten, and n is an integer exponent. The power of ten supplies the scale; the coefficient carries the significant digits.\n\n**An exponent records repeated factors or their reciprocal.**\nTen cubed is 10 × 10 × 10 = 1,000. Ten to the zero power is one. Ten to the negative three power is 1/1,000. A negative exponent here does not make the represented positive number negative.\n\n**Check both parts of the form.**\n4.2 × 10³ is standard scientific notation. 42 × 10² has the same value but its coefficient is outside the required interval. Equivalent value and standard form are separate questions.\n\nFor this lesson we represent positive values. Zero and signed coefficients require additional conventions; do not silently extend the coefficient rule to them.",
      "example": "I DO:\n4.2 × 10³ = 4.2 × 1,000 = 4,200.\n42 × 10² also equals 4,200, but 42 is not a standard coefficient.\n\nYOU TRY:\nIs 3.5 × 10² in standard form? State the coefficient check.\n\nCHECK:\nYes. The coefficient 3.5 is at least one and less than ten, and the exponent is an integer.",
      "notice": "Value equality does not guarantee standard scientific-notation form.",
      "check": {
        "question": "Which is standard scientific notation for 4,200?",
        "options": [
          "42 × 10²",
          "0.42 × 10⁴",
          "4,200 × 10⁰",
          "4.2 × 10³"
        ],
        "correct_index": 3,
        "explanation": "The value is 4,200 and the coefficient 4.2 lies in the required interval from one inclusive to ten exclusive."
      }
    }
  ],
  "worked_example": "I DO: Complete a real-number fluency with checks response.\n0.125 = 1/8 and √9 = 3 are rational; √2 is irrational. √16 = 4; 4 < √20 < 5. Both displayed power forms equal 4,200, but only the coefficient 4.2 is standard. A finite decimal display is a rational approximation, not exact √2.\n\nEXPLAIN THE DECISIONS\nUse the definitions and checks taught above. A classification needs an exact-value reason. A root result must return the radicand when squared. A scientific-notation form needs both a correct value and a coefficient within its stated interval.\n\nCOMMON MISTAKE AND FIX\nTreating the finite display 1.414 as exactly √2 confuses value and approximation. I use ≈ and classify the display separately.\n\nCHECK\nKeep exact and approximate labels, notation conventions and units attached. Use the taught check appropriate to the question rather than a rule from an unrelated number operation.",
  "worked_visuals": [
    {
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 178\"><rect width=\"420\" height=\"178\" rx=\"12\" fill=\"#f3f7f4\"/><text x=\"16\" y=\"34\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Exact value ≠ rounded display</text><text x=\"16\" y=\"80\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Ratio? Square check? Scale?</text><text x=\"16\" y=\"126\" font-family=\"Arial,sans-serif\" font-size=\"22\" fill=\"#18382b\">Choose the matching method</text></svg>",
      "alt": "A decision diagram distinguishes exact values from rounded displays and prompts the matching ratio, square or scale check.",
      "caption": "Choose the method for the question."
    }
  ],
  "guided_practice": "WE DO:\n1. Classify −2 as rational using −2/1.\n2. Separate exact √2 from a finite displayed approximation and explain the categories.\n3. Find √9 using its square relationship. Check: three squared gives nine.\n4. Bound √10 using nine and sixteen as anchors.\n5. Compare 4.2 × 10³ with 42 × 10² by multiplying back. Both equal 4,200; only the first coefficient is standard.\n6. Explain which check belongs to classification, a root or scientific form rather than mixing the methods.",
  "independent_task": "YOU DO: Real-number fluency with checks record (about 25–30 minutes).\n1. Classify 0.125, √9 and √2 with reasons. Find √16 and bound √20. State whether 4.2 × 10³ and 42 × 10² have the same value and whether each is standard scientific notation. Explain why an approximate display is not an exact irrational value.\n2. Show the relevant exact fraction, square relationship, bounds or power-of-ten check for each result.\n3. Explain two decisions with the definitions taught in the lesson.\n4. Identify and repair a possible error in notation or reasoning. If your work is already correct, explain the check that confirmed it.\n5. Write a short reflection about the representation that was most useful.\nUse paper or the big box. Type a working summary for paper work; no upload is required.\nSuccess checklist: complete requested results; correct exact/approximate labels; notation conventions respected; workings and units where needed; two explanations; independent check.",
  "response_prompt": "Which representation or check changed your understanding of real-number fluency with checks, and why?",
  "quiz": [
    {
      "question": "Which statement establishes that 0.75 is rational?",
      "options": [
        "It has three characters",
        "It is positive",
        "It can be written exactly as 3/4",
        "It is less than ten"
      ],
      "correct_index": 2,
      "explanation": "The exact ratio of integers with a non-zero denominator meets the definition.",
      "type": "multiple_choice"
    },
    {
      "question": "Which statement correctly distinguishes √2 and 1.414?",
      "options": [
        "Both are exactly the same rational value",
        "√2 is irrational; 1.414 is a rational approximation",
        "A finite decimal can never be rational",
        "The digits prove √2 terminates"
      ],
      "correct_index": 1,
      "explanation": "The exact root is irrational, while the displayed finite decimal is an exact rational value used as an approximation.",
      "type": "multiple_choice"
    },
    {
      "type": "multiple_choice",
      "question": "What is √16?",
      "options": [
        "8",
        "4",
        "-4",
        "32"
      ],
      "correct_index": 1,
      "explanation": "The principal root is non-negative and four squared equals sixteen."
    },
    {
      "question": "Which interval contains √20?",
      "options": [
        "Between 2 and 3",
        "Between 3 and 4",
        "Between 4 and 5",
        "Between 5 and 6"
      ],
      "correct_index": 2,
      "explanation": "Twenty lies between sixteen and twenty-five, whose principal roots are four and five.",
      "type": "multiple_choice"
    },
    {
      "question": "Which is standard scientific notation for 4,200?",
      "options": [
        "42 × 10²",
        "0.42 × 10⁴",
        "4,200 × 10⁰",
        "4.2 × 10³"
      ],
      "correct_index": 3,
      "explanation": "The value is 4,200 and the coefficient 4.2 lies in the required interval from one inclusive to ten exclusive.",
      "type": "multiple_choice"
    },
    {
      "question": "Which is rational?",
      "options": [
        "√2",
        "0.125 = 1/8",
        "Pi",
        "A specified infinite non-recurring decimal"
      ],
      "correct_index": 1,
      "explanation": "The finite decimal is exactly an integer ratio.",
      "type": "multiple_choice"
    },
    {
      "question": "Which is the principal √16?",
      "options": [
        "−4",
        "8",
        "4",
        "32"
      ],
      "correct_index": 2,
      "explanation": "Four is non-negative and squares to sixteen.",
      "type": "multiple_choice"
    },
    {
      "question": "Which bounds enclose √20?",
      "options": [
        "4 and 5",
        "2 and 3",
        "5 and 6",
        "0 and 1"
      ],
      "correct_index": 0,
      "explanation": "Sixteen and twenty-five enclose twenty, so their roots bound it.",
      "type": "multiple_choice"
    },
    {
      "question": "Which relation is appropriate for √2 and 1.414?",
      "options": [
        "Exact equality",
        "Both must be integers",
        "The first is smaller than zero",
        "Approximate equality"
      ],
      "correct_index": 3,
      "explanation": "The finite decimal is a rounded approximation.",
      "type": "multiple_choice"
    },
    {
      "question": "Which statement about 42 × 10² is correct?",
      "options": [
        "Its value is 42",
        "It equals 4,200 but is not standard scientific notation",
        "It is negative",
        "Its coefficient is within the standard interval"
      ],
      "correct_index": 1,
      "explanation": "The coefficient forty-two exceeds the standard upper bound, although the value is correct.",
      "type": "multiple_choice"
    }
  ],
  "parent_notes": "Parent: Teaches real-number fluency with checks from definitions to explanation and application. Original content follows the repository’s topic sequence. Exact outcome codes are empty pending verified mapping; this is not a claim of complete syllabus coverage.\n\nParent: Look for explicit working and a check of signs, scale, notation or units as appropriate. A correct guess without a method is weaker evidence than an explained calculation. The lesson itself supplies the teaching and feedback. Your role is access support and reviewing the evidence.\n\nParent: Model task answers: 0.125 = 1/8 and √9 = 3 are rational; √2 is irrational. √16 = 4; 4 < √20 < 5. Both displayed power forms equal 4,200, but only the coefficient 4.2 is standard. A finite decimal display is a rational approximation, not exact √2.\n\nParent: Ten scored choices use the unchanged 90% threshold, requiring 9/10. The independent task and reflection supply written reasoning for manual review.",
  "evidence_instructions": "Keep the real-number fluency with checks task working, explanation, checking record, reflection and quiz result.",
  "offline_alternative": "Copy the included examples and task prompts onto paper. Use the diagrams and models to complete the real-number fluency with checks working without a service, then type an evidence summary later.",
  "extension": "Choose one new example of the lesson’s number idea. Give an exact representation or verified bound, and explain what a common incorrect interpretation would miss.",
  "stage_hints": {
    "accept": [
      "Read the mission about real-number fluency with checks.",
      "You will practise real-number fluency with checks through models before making your own response.",
      "Begin with the first explanation of real-number fluency with checks; the examples remain available while you work."
    ],
    "teach0": [
      "Reread the integer-ratio definition.",
      "Ask whether the displayed value has an exact fraction representation.",
      "Show an integer numerator and a non-zero integer denominator as evidence."
    ],
    "teach1": [
      "Find whether the question names the exact value or a display.",
      "Label the approximation separately before classifying it.",
      "Use equality only for exact agreement; a rounded representation needs the approximate relation."
    ],
    "teach2": [
      "Look at the equal sides of the square model.",
      "Ask which non-negative factor multiplied by itself makes the area value.",
      "Square your candidate and compare with the given radicand."
    ],
    "teach3": [
      "Look for the perfect squares on either side of the radicand.",
      "Take their non-negative integer roots as bounds.",
      "Square the bounds to verify that they enclose the original value."
    ],
    "teach4": [
      "Check the coefficient’s interval before judging the whole form.",
      "Evaluate the power of ten to check the represented value.",
      "Require both correct value and a standard coefficient; do not choose by appearance alone."
    ],
    "learn": [
      "Read the complete model before judging its result.",
      "Match each decision to the definition and representation used in this model.",
      "Explain one intermediate step and check that the final conclusion answers the original real-number fluency with checks question."
    ],
    "guided": [
      "Start with the first supplied quantity and identify its role.",
      "Work one real-number fluency with checks example before comparing with the feedback.",
      "Record the intermediate representation and test the result against it before continuing."
    ],
    "write": [
      "Copy the first real-number fluency with checks task and label its quantities.",
      "Begin “The given information is ____. I will use ____ because ____.”",
      "A partial opening is “My first step is to represent ____. This shows ____.” Continue with your own working and result."
    ],
    "quiz": [
      "Return to the definition or method for the specific real-number fluency with checks question.",
      "Check what the symbols ask for before comparing the options.",
      "Use the taught representation to work independently, then check the meaning and unit of the result."
    ],
    "submit": [
      "Check that your real-number fluency with checks task and working are present.",
      "Include the real-number fluency with checks reflection and any written reasoning you produced.",
      "Send your real-number fluency with checks evidence for review; type a clear record if you used paper."
    ]
  }
}'), updated_at=datetime('now') WHERE seed_key='s4-mat-y8-w01-l4';
