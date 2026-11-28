import {academyExperience,academyExperienceGuide} from "./academyExperiences";
// Programme design only. Adult reservations remain blocked until adult identity and access isolation are verified.
export const ADULT_STUDIO={
  "id": "english-author-studio-adult-v1",
  "age": "18+",
  "title": "The Author’s Studio",
  "description": "A six-week online creative writing workshop for adults, led by a published author. Develop a project, strengthen your craft and explore routes to readers. Beginners welcome; no completed manuscript required.",
  "minutes": 90,
  "session_cents": 4500,
  "upfront_cents": 24000,
  "sessions": [
    {
      "title": "From idea to story",
      "objective": "Develop an original premise, intended reader and achievable writing project.",
      "spark": "The envelope contained a map of a town that had vanished forty years earlier. At the bottom, someone had written her name.",
      "concept": "A premise combines a character, a disruption and a compelling possibility. A genre is a set of reader expectations, not a rulebook.",
      "script": "Say: ‘A premise is not a full plot. It is the question that makes you want to keep writing. In this example, the map creates a mystery. Who receives it, what do they want, and what changes when they act? Let us make three versions, then choose the one with the strongest tension.’ Model an ordinary recipient, a personal stake and a decision.",
      "demo": "A retired cartographer receives the map of her missing hometown. To find her brother, she must return before the next dawn.",
      "exercise": "Draft three one-sentence premises. Pick one, name your intended reader and write a paragraph opening the project.",
      "feedback": "Identify the intriguing question and whether the stakes are clear; ask what the author wants to explore rather than rewriting their idea.",
      "options": [
        [
          "Genre",
          [
            "Mystery",
            "Fantasy",
            "Contemporary fiction"
          ]
        ],
        [
          "Disruption",
          [
            "An unexpected letter",
            "A broken promise",
            "A strange discovery"
          ]
        ],
        [
          "Stake",
          [
            "A relationship",
            "A secret",
            "A long-held ambition"
          ]
        ]
      ],
      "activities": [
        {
          "title": "Creative direction: From idea to story",
          "type": "poll",
          "question": "Which approach would you like to explore?",
          "options": [
            "Mystery",
            "Fantasy",
            "Contemporary fiction"
          ]
        },
        {
          "title": "Writing studio: From idea to story",
          "type": "story_builder",
          "question": "Choose three elements and explain how they could serve your writing.",
          "game": {
            "type": "story_builder",
            "fields": [
              {
                "label": "Genre",
                "options": [
                  "Mystery",
                  "Fantasy",
                  "Contemporary fiction"
                ]
              },
              {
                "label": "Disruption",
                "options": [
                  "An unexpected letter",
                  "A broken promise",
                  "A strange discovery"
                ]
              },
              {
                "label": "Stake",
                "options": [
                  "A relationship",
                  "A secret",
                  "A long-held ambition"
                ]
              }
            ]
          }
        },
        {
          "title": "Private workshop discussion: From idea to story",
          "type": "collaboration",
          "question": "Offer a fictional idea or a craft suggestion. Share only work you have permission to share."
        },
        {
          "title": "Reflection: From idea to story",
          "type": "short",
          "question": "What will you try next, and why?"
        }
      ]
    },
    {
      "title": "Characters with depth",
      "objective": "Create a protagonist whose motivations, contradictions and choices drive the story.",
      "spark": "He had rehearsed the apology for six years. When she finally opened the door, he asked whether the kettle was on.",
      "concept": "A want is a visible goal; a need may be an internal change. Contradictions create complexity when they arise from believable motivations.",
      "script": "Say: ‘This person wants to apologise but avoids doing it. The tension between intention and action tells us more than a biography. I will write a goal, a fear and a choice. Watch how each detail changes the scene.’ Model a character choosing between honesty and protecting a friendship.",
      "demo": "Want: regain a friendship. Fear: admitting a betrayal. Choice: tell the truth even if the friend leaves.",
      "exercise": "Build a character profile, then write a short scene where a meaningful choice reveals an internal conflict.",
      "feedback": "Ask whether the choice feels earned by the character’s motives, and whether the scene shows rather than labels the conflict.",
      "options": [
        [
          "Want",
          [
            "Belonging",
            "Justice",
            "Freedom"
          ]
        ],
        [
          "Fear",
          [
            "Rejection",
            "Failure",
            "Loss of control"
          ]
        ],
        [
          "Contradiction",
          [
            "Brave but secretive",
            "Kind but stubborn",
            "Ambitious but cautious"
          ]
        ]
      ],
      "activities": [
        {
          "title": "Creative direction: Characters with depth",
          "type": "poll",
          "question": "Which approach would you like to explore?",
          "options": [
            "Belonging",
            "Justice",
            "Freedom"
          ]
        },
        {
          "title": "Writing studio: Characters with depth",
          "type": "story_builder",
          "question": "Choose three elements and explain how they could serve your writing.",
          "game": {
            "type": "story_builder",
            "fields": [
              {
                "label": "Want",
                "options": [
                  "Belonging",
                  "Justice",
                  "Freedom"
                ]
              },
              {
                "label": "Fear",
                "options": [
                  "Rejection",
                  "Failure",
                  "Loss of control"
                ]
              },
              {
                "label": "Contradiction",
                "options": [
                  "Brave but secretive",
                  "Kind but stubborn",
                  "Ambitious but cautious"
                ]
              }
            ]
          }
        },
        {
          "title": "Private workshop discussion: Characters with depth",
          "type": "collaboration",
          "question": "Offer a fictional idea or a craft suggestion. Share only work you have permission to share."
        },
        {
          "title": "Reflection: Characters with depth",
          "type": "short",
          "question": "What will you try next, and why?"
        }
      ]
    },
    {
      "title": "Plot, structure and momentum",
      "objective": "Plan a causal sequence of turning points and identify a workable next scene.",
      "spark": "She missed the train. Because she missed it, she saw the man leave the station with her suitcase.",
      "concept": "A plot advances through consequences: events alter choices and stakes. Structure supports momentum but need not follow one rigid formula.",
      "script": "Say: ‘And then can list events; because and therefore reveal consequences. Let me turn these events into decisions.’ Model a premise, an inciting disruption, an escalating choice and an outcome; point out that a turning point changes what is possible.",
      "demo": "A missing suitcase contains a crucial document. The owner follows a stranger, loses her safe route home and must decide whether to ask for help.",
      "exercise": "Map five causal beats for your project. Draft or outline the next scene with a goal, obstacle and changed situation.",
      "feedback": "Check that events create consequences and that the protagonist has agency; discuss pacing without imposing a universal structure.",
      "options": [
        [
          "Turning point",
          [
            "An unexpected ally",
            "A failed plan",
            "A revealing choice"
          ]
        ],
        [
          "Escalation",
          [
            "Time pressure",
            "Conflicting loyalties",
            "A lost resource"
          ]
        ],
        [
          "Scene ending",
          [
            "A decision",
            "A discovery",
            "A new obstacle"
          ]
        ]
      ],
      "activities": [
        {
          "title": "Creative direction: Plot, structure and momentum",
          "type": "poll",
          "question": "Which approach would you like to explore?",
          "options": [
            "An unexpected ally",
            "A failed plan",
            "A revealing choice"
          ]
        },
        {
          "title": "Writing studio: Plot, structure and momentum",
          "type": "story_builder",
          "question": "Choose three elements and explain how they could serve your writing.",
          "game": {
            "type": "story_builder",
            "fields": [
              {
                "label": "Turning point",
                "options": [
                  "An unexpected ally",
                  "A failed plan",
                  "A revealing choice"
                ]
              },
              {
                "label": "Escalation",
                "options": [
                  "Time pressure",
                  "Conflicting loyalties",
                  "A lost resource"
                ]
              },
              {
                "label": "Scene ending",
                "options": [
                  "A decision",
                  "A discovery",
                  "A new obstacle"
                ]
              }
            ]
          }
        },
        {
          "title": "Private workshop discussion: Plot, structure and momentum",
          "type": "collaboration",
          "question": "Offer a fictional idea or a craft suggestion. Share only work you have permission to share."
        },
        {
          "title": "Reflection: Plot, structure and momentum",
          "type": "short",
          "question": "What will you try next, and why?"
        }
      ]
    },
    {
      "title": "Voice, dialogue and atmosphere",
      "objective": "Revise a scene to create a deliberate narrative voice and purposeful dialogue.",
      "spark": "‘Nice place,’ she said. The wallpaper peeled behind him. Neither looked at the empty picture hook.",
      "concept": "Voice is the pattern of perspective, diction and rhythm. Dialogue can carry subtext through what is avoided, and atmosphere grows from selected details.",
      "script": "Say: ‘The spoken line says one thing; the details suggest another. I will write this exchange in two voices and show how the reader’s impression changes.’ Demonstrate short versus flowing sentences, then remove a line of explanatory dialogue and replace it with a revealing action.",
      "demo": "Direct: ‘I miss this house.’ Subtext: ‘You kept the blue mug.’ She turned it so the chipped edge faced the wall.",
      "exercise": "Write a 200-word exchange with an unspoken goal. Revise it for a different viewpoint or emotional effect.",
      "feedback": "Name a line that supports the intended voice; suggest a focused change to rhythm, detail or subtext, respecting the writer’s style.",
      "options": [
        [
          "Voice",
          [
            "Wry",
            "Reflective",
            "Urgent"
          ]
        ],
        [
          "Unspoken goal",
          [
            "An apology",
            "A warning",
            "A request"
          ]
        ],
        [
          "Atmosphere",
          [
            "Uneasy",
            "Warm",
            "Bittersweet"
          ]
        ]
      ],
      "activities": [
        {
          "title": "Creative direction: Voice, dialogue and atmosphere",
          "type": "poll",
          "question": "Which approach would you like to explore?",
          "options": [
            "Wry",
            "Reflective",
            "Urgent"
          ]
        },
        {
          "title": "Writing studio: Voice, dialogue and atmosphere",
          "type": "story_builder",
          "question": "Choose three elements and explain how they could serve your writing.",
          "game": {
            "type": "story_builder",
            "fields": [
              {
                "label": "Voice",
                "options": [
                  "Wry",
                  "Reflective",
                  "Urgent"
                ]
              },
              {
                "label": "Unspoken goal",
                "options": [
                  "An apology",
                  "A warning",
                  "A request"
                ]
              },
              {
                "label": "Atmosphere",
                "options": [
                  "Uneasy",
                  "Warm",
                  "Bittersweet"
                ]
              }
            ]
          }
        },
        {
          "title": "Private workshop discussion: Voice, dialogue and atmosphere",
          "type": "collaboration",
          "question": "Offer a fictional idea or a craft suggestion. Share only work you have permission to share."
        },
        {
          "title": "Reflection: Voice, dialogue and atmosphere",
          "type": "short",
          "question": "What will you try next, and why?"
        }
      ]
    },
    {
      "title": "Revision without losing your voice",
      "objective": "Separate structural revision, line editing and proofreading; make a purposeful revision.",
      "spark": "Draft: The room was dark and she was nervous. Revision: She reached for the switch. The wall was cold, and the switch was gone.",
      "concept": "Developmental revision addresses meaning and structure; line editing addresses expression; proofreading catches surface errors. A revision should serve an intended effect.",
      "script": "Say: ‘A first draft is allowed to be messy. Before polishing commas, ask what the scene needs to do. Here I want uncertainty, so I replace a vague statement with a concrete action. I keep the author’s intent, not necessarily every original word.’ Model a structural change and then a line edit; distinguish them.",
      "demo": "Move the revelation later to strengthen the question; then cut a repeated adjective. Leave the writer’s distinctive phrase intact.",
      "exercise": "Choose a short excerpt or the supplied sample. Perform one structural revision and two line edits, explaining why each helps.",
      "feedback": "Ask permission before giving feedback; highlight a strength, ask a question and offer one optional suggestion. No public sharing required.",
      "options": [
        [
          "Revision focus",
          [
            "Scene purpose",
            "Pacing",
            "Character agency"
          ]
        ],
        [
          "Line-edit focus",
          [
            "Specific detail",
            "Sentence rhythm",
            "Repetition"
          ]
        ],
        [
          "Intended effect",
          [
            "Curiosity",
            "Empathy",
            "Suspense"
          ]
        ]
      ],
      "activities": [
        {
          "title": "Creative direction: Revision without losing your voice",
          "type": "poll",
          "question": "Which approach would you like to explore?",
          "options": [
            "Scene purpose",
            "Pacing",
            "Character agency"
          ]
        },
        {
          "title": "Writing studio: Revision without losing your voice",
          "type": "story_builder",
          "question": "Choose three elements and explain how they could serve your writing.",
          "game": {
            "type": "story_builder",
            "fields": [
              {
                "label": "Revision focus",
                "options": [
                  "Scene purpose",
                  "Pacing",
                  "Character agency"
                ]
              },
              {
                "label": "Line-edit focus",
                "options": [
                  "Specific detail",
                  "Sentence rhythm",
                  "Repetition"
                ]
              },
              {
                "label": "Intended effect",
                "options": [
                  "Curiosity",
                  "Empathy",
                  "Suspense"
                ]
              }
            ]
          }
        },
        {
          "title": "Private workshop discussion: Revision without losing your voice",
          "type": "collaboration",
          "question": "Offer a fictional idea or a craft suggestion. Share only work you have permission to share."
        },
        {
          "title": "Reflection: Revision without losing your voice",
          "type": "short",
          "question": "What will you try next, and why?"
        }
      ]
    },
    {
      "title": "From manuscript to readers",
      "objective": "Create a practical next-step plan for revising, researching publication options and presenting a book.",
      "spark": "A manuscript sits beside an empty notebook labelled ‘Next steps’. The finished draft is a beginning, not a promise of publication.",
      "concept": "Traditional, small-press and independent publishing have different responsibilities, costs and routes to readers. Publishing is not a guarantee of sales.",
      "script": "Say: ‘Writing a book and preparing a book for readers are different jobs. I can share my own experience, but every route has trade-offs. Start with revision, then research suitable publishers or independent services, check contracts and costs, and make a realistic plan.’ Demonstrate a concise blurb and discuss what to verify before spending money. Do not offer legal or financial guarantees.",
      "demo": "Blurb: When a map of a vanished town arrives, a retired cartographer must decide whether finding her brother is worth returning to the place she escaped.",
      "exercise": "Write a short pitch, identify an intended audience and create a three-step next-project or publication research plan.",
      "feedback": "Check that the pitch communicates premise and stakes; encourage independent verification of rights, costs and current submission requirements.",
      "options": [
        [
          "Path to research",
          [
            "Traditional submission",
            "Small press",
            "Independent publishing"
          ]
        ],
        [
          "Next milestone",
          [
            "Complete draft",
            "Revise manuscript",
            "Research readers"
          ]
        ],
        [
          "Pitch format",
          [
            "Logline",
            "Back-cover blurb",
            "Short spoken pitch"
          ]
        ]
      ],
      "activities": [
        {
          "title": "Creative direction: From manuscript to readers",
          "type": "poll",
          "question": "Which approach would you like to explore?",
          "options": [
            "Traditional submission",
            "Small press",
            "Independent publishing"
          ]
        },
        {
          "title": "Writing studio: From manuscript to readers",
          "type": "story_builder",
          "question": "Choose three elements and explain how they could serve your writing.",
          "game": {
            "type": "story_builder",
            "fields": [
              {
                "label": "Path to research",
                "options": [
                  "Traditional submission",
                  "Small press",
                  "Independent publishing"
                ]
              },
              {
                "label": "Next milestone",
                "options": [
                  "Complete draft",
                  "Revise manuscript",
                  "Research readers"
                ]
              },
              {
                "label": "Pitch format",
                "options": [
                  "Logline",
                  "Back-cover blurb",
                  "Short spoken pitch"
                ]
              }
            ]
          }
        },
        {
          "title": "Private workshop discussion: From manuscript to readers",
          "type": "collaboration",
          "question": "Offer a fictional idea or a craft suggestion. Share only work you have permission to share."
        },
        {
          "title": "Reflection: From manuscript to readers",
          "type": "short",
          "question": "What will you try next, and why?"
        }
      ]
    }
  ]
} as const;
export function adultStudioGuide(index:number){
 const s=ADULT_STUDIO.sessions[index];if(!s)return "";
 return [
 "Private craft objective: "+s.objective+" "+s.concept,
 "0–10 min | Welcome and writing warm-up: Read the original spark. Invite a brief reaction or a private written response; passing is fine.",
 "10–25 min | Author demonstration: "+s.script+" Worked example: "+s.demo,
 "25–40 min | Guided workshop: Use the creative builder to explore three decisions and discuss how they serve the objective. Invite alternatives.",
 "40–45 min | Short break.",
 "45–70 min | Writing studio: "+s.exercise+" Offer a supplied fictional example for anyone without a project.",
 "70–83 min | Optional feedback: "+s.feedback+" Do not share a participant's manuscript without permission.",
 "83–90 min | Reflection and next step: Invite a private reflection on what changed and one achievable next action. No promise of publication or sales."
 ,academyExperienceGuide(ADULT_STUDIO.id,s.title)
 ].filter(Boolean).join("\n\n");
}
export const WRITERS_ACADEMY=[
 {id:"english-creative-camp-junior-v1",title:"Junior Story Adventurers",age:"8–11",minutes:60,session_cents:2500,upfront_cents:13500,weekly_cents:2500,audience:"minor",sessions:6},
 {id:"english-creative-camp-senior-v1",title:"Teen Storymakers",age:"12–17",minutes:60,session_cents:3000,upfront_cents:16500,weekly_cents:3000,audience:"minor",sessions:6},
 {id:ADULT_STUDIO.id,title:ADULT_STUDIO.title,age:ADULT_STUDIO.age,minutes:ADULT_STUDIO.minutes,session_cents:ADULT_STUDIO.session_cents,upfront_cents:ADULT_STUDIO.upfront_cents,weekly_cents:4500,audience:"adult",sessions:6}
] as const;
export function academyProgramme(id:unknown){return WRITERS_ACADEMY.find(p=>p.id===id);}

export function adultStudioResource(index:number){
 const s=ADULT_STUDIO.sessions[index];if(!s)return null;
 return {creative_camp:true,programme_id:ADULT_STUDIO.id,experience:academyExperience(ADULT_STUDIO.id,s.title),title:s.title,objective:s.objective,reading:s.spark,tasks:[s.exercise,"Make one intentional craft choice and explain its intended effect.","Optional: share a short excerpt or reflect privately."],stretch:"Continue your own project if you wish. Identify one achievable next step.",slides:[
 {title:s.title,body:s.objective},
 {title:"Writing warm-up",body:s.spark},
 {title:"The craft",body:s.concept},
 {title:"Worked example",body:s.demo},
 {title:"Explore your options",body:"Consider these choices in the guided activity. Choose an approach or invent your own.",cards:s.options.map(([label,options])=>({label,body:options.join(" · ")}))},
 {title:"A short break",body:"Five minutes to stretch, refill your drink or think about your idea."},
 {title:"Your writing studio",body:s.exercise},
 {title:"Reflect and refine",body:"If you wish, share a short excerpt. Ask what the writer intended before offering feedback. A strength, a question and an optional suggestion are enough."},
 {title:"Your next chapter",body:"What did you discover? Choose one achievable next action for your writing project."}
 ]};
}
export function adultStudioIllustrationStory(workshop:any){
 if(workshop?.programme_id!==ADULT_STUDIO.id)return null;
 const s=ADULT_STUDIO.sessions.find(s=>s.title===workshop.title);if(!s)return null;
 const style="Original sophisticated literary editorial art, midnight ink, warm parchment and antique gold, no lettering or identifiable people. ";
 return [
 {slide_index:0,title:"Workshop opening",brief:style+"An editorial still life reflecting "+s.title+". An open notebook, pen and a purposeful object that evokes the theme.",purpose:"Introduce the workshop theme."},
 {slide_index:1,title:"Story spark",brief:style+s.spark,purpose:"Invite a discussion of the opening."},
 {slide_index:2,title:"Writing craft",brief:style+"Create a symbolic editorial composition reflecting this writing principle: "+s.concept,purpose:"Make the craft idea memorable."},
 {slide_index:3,title:"Worked example",brief:style+s.demo,purpose:"Support discussion of the author demonstration."},
 {slide_index:4,title:"Creative choices",brief:style+"A collection of three evocative objects or scenes representing different creative possibilities around "+s.title+".",purpose:"Inspire choices without suggesting a correct answer."},
 {slide_index:6,title:"Writing studio",brief:style+"A quiet writer’s desk with blank manuscript pages, warm lamplight and subtle motifs from "+s.title+".",purpose:"Set the atmosphere for sustained writing time."}
 ];
}
