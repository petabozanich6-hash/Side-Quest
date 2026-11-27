import {academyExperience,academyExperienceGuide} from "./academyExperiences";
import {CAMP_CRAFT} from "./englishClubCampCraft";
// Distinct creative camps: reading enjoyment and original creation, not remedial tuition.
export const CREATIVE_CAMPS=[
  {
    "id": "english-creative-camp-junior-v1",
    "age": "8–11",
    "title": "English Club: Junior Story Adventurers (ages 8–11)",
    "description": "Six online creative camp sessions with a published author. Explore books, magical worlds, characters, mysteries, games and your own stories. Recommended ages 8–11. No reading homework, tests or required writing level; comics and audiobooks count too. Join any session or the whole six-session adventure.",
    "sessions": [
      {
        "title": "The Book Portal",
        "description": "Bookish adventures: Draw or describe your portal, give it a title and make a cover or teaser.",
        "objective": "Draw or describe your portal, give it a title and make a cover or teaser.",
        "reading": "A leaf fell out of Nia’s book. She turned the page and heard a tiny voice: ‘Well? Are you coming?’",
        "agenda": [
          "0–5: Playful icebreaker",
          "5–15: Book chat and author story",
          "15–25: Read and imagine together",
          "25–37: Collaborative creative game",
          "37–52: Make something of your own",
          "52–57: Optional sharing and encouragement",
          "57–60: Book discovery and closing"
        ],
        "activities": [
          {
            "title": "Choose your adventure: The Book Portal",
            "type": "poll",
            "question": "Where would your book take you?",
            "options": [
              "Magical forest",
              "Outer space",
              "Animal city",
              "My own world"
            ]
          },
          {
            "title": "Your creation: The Book Portal",
            "type": "short",
            "question": "Draw or describe your portal, give it a title and make a cover or teaser."
          }
        ],
        "support": "Offer reading aloud, drawing, typing, dictation or private participation. No reading homework or public performance required.",
        "check": "Celebrate a creative choice and invite a book or genre the learner might enjoy next.",
        "ice": "Invent a book portal to a ridiculous place.",
        "model": "Talk about favourite kinds of stories, including comics and audiobooks. Read Nia’s scene aloud and wonder what could happen next.",
        "group": "Together invent a portal destination, a surprising detail and a rule. Model a title: The Library of Bossy Cats.",
        "create": "Draw or describe your portal, give it a title and make a cover or teaser.",
        "art": "A magical open book with a little forest emerging from the pages, warm whimsical adventure art."
      },
      {
        "title": "Character Chaos",
        "description": "Bookish adventures: Create a character card, drawing or short first adventure.",
        "objective": "Create a character card, drawing or short first adventure.",
        "reading": "Dot the dragon collected buttons instead of gold. When a knight knocked, Dot asked if his coat had any spares.",
        "agenda": [
          "0–5: Playful icebreaker",
          "5–15: Book chat and author story",
          "15–25: Read and imagine together",
          "25–37: Collaborative creative game",
          "37–52: Make something of your own",
          "52–57: Optional sharing and encouragement",
          "57–60: Book discovery and closing"
        ],
        "activities": [
          {
            "title": "Choose your adventure: Character Chaos",
            "type": "poll",
            "question": "Which unusual character would you follow?",
            "options": [
              "Button dragon",
              "Detective cat",
              "Nervous superhero",
              "My own character"
            ]
          },
          {
            "title": "Your creation: Character Chaos",
            "type": "short",
            "question": "Create a character card, drawing or short first adventure."
          }
        ],
        "support": "Offer reading aloud, drawing, typing, dictation or private participation. No reading homework or public performance required.",
        "check": "Celebrate a creative choice and invite a book or genre the learner might enjoy next.",
        "ice": "Invent a funny habit for a pirate, dragon or detective.",
        "model": "Discuss characters we love and what makes them memorable. Read Dot aloud. Model a character who wants a shiny button that a magpie has stolen.",
        "group": "Invent a group character with a name, a quirk and a wish. Give them an unexpected obstacle.",
        "create": "Create a character card, drawing or short first adventure.",
        "art": "A cheerful original dragon sorting colourful buttons in a cosy lair, expressive and playful."
      },
      {
        "title": "Mystery in the Library",
        "description": "Bookish adventures: Invent two clues and a surprising ending; draw or dictate if you prefer.",
        "objective": "Invent two clues and a surprising ending; draw or dictate if you prefer.",
        "reading": "A silver bookmark lay on the library floor. The trolley squeaked. Behind the shelves, someone whispered, ‘Not that book!’",
        "agenda": [
          "0–5: Playful icebreaker",
          "5–15: Book chat and author story",
          "15–25: Read and imagine together",
          "25–37: Collaborative creative game",
          "37–52: Make something of your own",
          "52–57: Optional sharing and encouragement",
          "57–60: Book discovery and closing"
        ],
        "activities": [
          {
            "title": "Choose your adventure: Mystery in the Library",
            "type": "poll",
            "question": "What would you investigate first?",
            "options": [
              "The bookmark",
              "The trolley",
              "The whisper",
              "Something else"
            ]
          },
          {
            "title": "Your creation: Mystery in the Library",
            "type": "short",
            "question": "Invent two clues and a surprising ending; draw or dictate if you prefer."
          }
        ],
        "support": "Offer reading aloud, drawing, typing, dictation or private participation. No reading homework or public performance required.",
        "check": "Celebrate a creative choice and invite a book or genre the learner might enjoy next.",
        "ice": "Guess who stole the last imaginary biscuit from three silly clues.",
        "model": "Read the scene aloud. Think out loud about possible explanations without deciding too soon. Discuss why mysteries make us keep reading.",
        "group": "Create a shared library mystery, adding one clue each and inventing possible endings.",
        "create": "Invent two clues and a surprising ending; draw or dictate if you prefer.",
        "art": "A cosy magical library with a silver bookmark, old return trolley and secretive shelves, intriguing not scary."
      },
      {
        "title": "Worlds of Wonder",
        "description": "Bookish adventures: Make a map or description of a fictional world with a place to explore.",
        "objective": "Make a map or description of a fictional world with a place to explore.",
        "reading": "The town floated on clouds. Post arrived by parachute. Today a parcel floated upwards instead of down.",
        "agenda": [
          "0–5: Playful icebreaker",
          "5–15: Book chat and author story",
          "15–25: Read and imagine together",
          "25–37: Collaborative creative game",
          "37–52: Make something of your own",
          "52–57: Optional sharing and encouragement",
          "57–60: Book discovery and closing"
        ],
        "activities": [
          {
            "title": "Choose your adventure: Worlds of Wonder",
            "type": "poll",
            "question": "What makes a world exciting?",
            "options": [
              "Strange creatures",
              "Unusual rules",
              "Secret places",
              "Surprises"
            ]
          },
          {
            "title": "Your creation: Worlds of Wonder",
            "type": "short",
            "question": "Make a map or description of a fictional world with a place to explore."
          }
        ],
        "support": "Offer reading aloud, drawing, typing, dictation or private participation. No reading homework or public performance required.",
        "check": "Celebrate a creative choice and invite a book or genre the learner might enjoy next.",
        "ice": "Invent a world where an everyday thing works backwards.",
        "model": "Discuss books that let readers travel without leaving home. Model a cloud bakery, post office and unusual town rule.",
        "group": "Build an imaginary town together, naming places and wondering who lives there.",
        "create": "Make a map or description of a fictional world with a place to explore.",
        "art": "A playful floating cloud town with tiny buildings, drifting parcels and inviting fantasy scenery."
      },
      {
        "title": "Choose Your Own Adventure",
        "description": "Bookish adventures: Create a branching mini adventure with two choices and possible endings.",
        "objective": "Create a branching mini adventure with two choices and possible endings.",
        "reading": "Tilly found a tiny door and a glowing staircase. Both looked like excellent ways to get lost.",
        "agenda": [
          "0–5: Playful icebreaker",
          "5–15: Book chat and author story",
          "15–25: Read and imagine together",
          "25–37: Collaborative creative game",
          "37–52: Make something of your own",
          "52–57: Optional sharing and encouragement",
          "57–60: Book discovery and closing"
        ],
        "activities": [
          {
            "title": "Choose your adventure: Choose Your Own Adventure",
            "type": "poll",
            "question": "Which route should Tilly try?",
            "options": [
              "Tiny door",
              "Glowing stairs",
              "Another path",
              "Ask a friend"
            ]
          },
          {
            "title": "Your creation: Choose Your Own Adventure",
            "type": "short",
            "question": "Create a branching mini adventure with two choices and possible endings."
          }
        ],
        "support": "Offer reading aloud, drawing, typing, dictation or private participation. No reading homework or public performance required.",
        "check": "Celebrate a creative choice and invite a book or genre the learner might enjoy next.",
        "ice": "Would you ride a giant snail or a flying teapot? Why?",
        "model": "Talk about decisions in adventure books and games. Model two different paths from Tilly’s choice.",
        "group": "Vote on a route and take turns adding the next event. Explore a different route too.",
        "create": "Create a branching mini adventure with two choices and possible endings.",
        "art": "A friendly fantasy corridor with a tiny colourful door and glowing staircase, inviting adventure."
      },
      {
        "title": "Little Author Celebration",
        "description": "Bookish adventures: Make a mini book, cover, blurb or story. Celebrate everyone’s creativity without requiring public sharing.",
        "objective": "Make a mini book, cover, blurb or story. Celebrate everyone’s creativity without requiring public sharing.",
        "reading": "Dot put the last button on the cover. ‘Now it looks like a book!’ Pip grinned. ‘But what happens on page one?’",
        "agenda": [
          "0–5: Playful icebreaker",
          "5–15: Book chat and author story",
          "15–25: Read and imagine together",
          "25–37: Collaborative creative game",
          "37–52: Make something of your own",
          "52–57: Optional sharing and encouragement",
          "57–60: Book discovery and closing"
        ],
        "activities": [
          {
            "title": "Choose your adventure: Little Author Celebration",
            "type": "poll",
            "question": "How would you celebrate your story?",
            "options": [
              "Design a cover",
              "Read a line",
              "Invent a sequel",
              "Keep it private"
            ]
          },
          {
            "title": "Your creation: Little Author Celebration",
            "type": "short",
            "question": "Make a mini book, cover, blurb or story. Celebrate everyone’s creativity without requiring public sharing."
          }
        ],
        "support": "Offer reading aloud, drawing, typing, dictation or private participation. No reading homework or public performance required.",
        "check": "Celebrate a creative choice and invite a book or genre the learner might enjoy next.",
        "ice": "Make up the silliest book title you can think of.",
        "model": "Tell the group how an author develops ideas, changes drafts and creates a book. Model a tiny blurb that makes a reader curious.",
        "group": "Invent a group title and blurb, then brainstorm cover ideas.",
        "create": "Make a mini book, cover, blurb or story. Celebrate everyone’s creativity without requiring public sharing.",
        "art": "A joyful book-making studio with blank covers, coloured pencils and a friendly original dragon."
      }
    ]
  },
  {
    "id": "english-creative-camp-senior-v1",
    "age": "12–17",
    "title": "English Club: Teen Storymakers (ages 12–17)",
    "description": "Six online creative camp sessions with a published author. Discover books worth getting lost in, share genres and recommendations, build worlds and characters, explore plot twists and make original stories. Recommended ages 12–17. No school-style assessments or required reading list. Join a single session or the whole camp.",
    "sessions": [
      {
        "title": "Beyond the Cover",
        "description": "Bookish adventures: Invent a title, genre and back-cover pitch. Make a reading wish-list.",
        "objective": "Invent a title, genre and back-cover pitch. Make a reading wish-list.",
        "reading": "The book arrived without a title. Inside was a map of a town that did not exist. In the centre was a door marked tomorrow.",
        "agenda": [
          "0–5: Playful icebreaker",
          "5–15: Book chat and author story",
          "15–25: Read and imagine together",
          "25–37: Collaborative creative game",
          "37–52: Make something of your own",
          "52–57: Optional sharing and encouragement",
          "57–60: Book discovery and closing"
        ],
        "activities": [
          {
            "title": "Choose your adventure: Beyond the Cover",
            "type": "poll",
            "question": "Which hook would make you read on?",
            "options": [
              "A mysterious map",
              "An impossible friendship",
              "A hidden secret",
              "Another idea"
            ]
          },
          {
            "title": "Your creation: Beyond the Cover",
            "type": "short",
            "question": "Invent a title, genre and back-cover pitch. Make a reading wish-list."
          }
        ],
        "support": "Offer reading aloud, drawing, typing, dictation or private participation. No reading homework or public performance required.",
        "check": "Celebrate a creative choice and invite a book or genre the learner might enjoy next.",
        "ice": "Pitch an absurd imaginary novel in one sentence.",
        "model": "Explore genres, reading tastes, graphic novels and audiobooks. Read the hook and model a mystery pitch versus a fantasy pitch. Share why authors choose different openings.",
        "group": "Swap spoiler-free book recommendations or imaginary pitches. Invite the group to improve one hook together.",
        "create": "Invent a title, genre and back-cover pitch. Make a reading wish-list.",
        "art": "Atmospheric untitled novel and mysterious map on a desk, subtle fantasy illustration without readable text."
      },
      {
        "title": "Characters We Can't Forget",
        "description": "Bookish adventures: Create a character profile and write or dictate an opening exchange.",
        "objective": "Create a character profile and write or dictate an opening exchange.",
        "reading": "Mira promised never to return to the city. Then a letter arrived from the person who had once saved her life.",
        "agenda": [
          "0–5: Playful icebreaker",
          "5–15: Book chat and author story",
          "15–25: Read and imagine together",
          "25–37: Collaborative creative game",
          "37–52: Make something of your own",
          "52–57: Optional sharing and encouragement",
          "57–60: Book discovery and closing"
        ],
        "activities": [
          {
            "title": "Choose your adventure: Characters We Can't Forget",
            "type": "poll",
            "question": "What might make Mira return?",
            "options": [
              "Loyalty",
              "Curiosity",
              "A debt",
              "Something else"
            ]
          },
          {
            "title": "Your creation: Characters We Can't Forget",
            "type": "short",
            "question": "Create a character profile and write or dictate an opening exchange."
          }
        ],
        "support": "Offer reading aloud, drawing, typing, dictation or private participation. No reading homework or public performance required.",
        "check": "Celebrate a creative choice and invite a book or genre the learner might enjoy next.",
        "ice": "Invent an unlikely fictional duo and the reason they must work together.",
        "model": "Talk about memorable characters, friendships and competing desires. Model how Mira’s promise and loyalty create a choice, without deciding the only right answer.",
        "group": "Develop two characters with incompatible goals. Invent a scene where their interests collide.",
        "create": "Create a character profile and write or dictate an opening exchange.",
        "art": "Two fictional travellers at a city gate holding an unopened letter, atmospheric young-adult book art."
      },
      {
        "title": "Build a World Worth Getting Lost In",
        "description": "Bookish adventures: Sketch a map, invent a cultural detail or write a scene introducing your world.",
        "objective": "Sketch a map, invent a cultural detail or write a scene introducing your world.",
        "reading": "The city sold bottled rain. The rich bought thunderstorms. In the alleyways, children collected the drops that escaped.",
        "agenda": [
          "0–5: Playful icebreaker",
          "5–15: Book chat and author story",
          "15–25: Read and imagine together",
          "25–37: Collaborative creative game",
          "37–52: Make something of your own",
          "52–57: Optional sharing and encouragement",
          "57–60: Book discovery and closing"
        ],
        "activities": [
          {
            "title": "Choose your adventure: Build a World Worth Getting Lost In",
            "type": "poll",
            "question": "What would you explore first?",
            "options": [
              "The rain market",
              "The city rules",
              "The alleyways",
              "Beyond the city"
            ]
          },
          {
            "title": "Your creation: Build a World Worth Getting Lost In",
            "type": "short",
            "question": "Sketch a map, invent a cultural detail or write a scene introducing your world."
          }
        ],
        "support": "Offer reading aloud, drawing, typing, dictation or private participation. No reading homework or public performance required.",
        "check": "Celebrate a creative choice and invite a book or genre the learner might enjoy next.",
        "ice": "Invent a world with an impossible currency or everyday rule.",
        "model": "Discuss how settings in favourite books feel alive. Model a rain market, a social rule and a character who breaks it; keep the emphasis on imagination.",
        "group": "Brainstorm a shared world and its customs. Ask how the rule affects different fictional people.",
        "create": "Sketch a map, invent a cultural detail or write a scene introducing your world.",
        "art": "An original fantastical city with rain-filled glass bottles at a market, atmospheric speculative fiction art."
      },
      {
        "title": "Plot Twists and Page Turners",
        "description": "Bookish adventures: Write an opening and plan a twist with one earlier clue, or outline the idea verbally.",
        "objective": "Write an opening and plan a twist with one earlier clue, or outline the idea verbally.",
        "reading": "The station clock stopped at midnight. The train arrived empty. On the seat was Rowan’s own unfinished manuscript.",
        "agenda": [
          "0–5: Playful icebreaker",
          "5–15: Book chat and author story",
          "15–25: Read and imagine together",
          "25–37: Collaborative creative game",
          "37–52: Make something of your own",
          "52–57: Optional sharing and encouragement",
          "57–60: Book discovery and closing"
        ],
        "activities": [
          {
            "title": "Choose your adventure: Plot Twists and Page Turners",
            "type": "poll",
            "question": "Which question would keep you reading?",
            "options": [
              "Why the clock stopped",
              "Who sent the manuscript",
              "Where the passengers went",
              "Another question"
            ]
          },
          {
            "title": "Your creation: Plot Twists and Page Turners",
            "type": "short",
            "question": "Write an opening and plan a twist with one earlier clue, or outline the idea verbally."
          }
        ],
        "support": "Offer reading aloud, drawing, typing, dictation or private participation. No reading homework or public performance required.",
        "check": "Celebrate a creative choice and invite a book or genre the learner might enjoy next.",
        "ice": "Invent an opening line that makes everyone ask what happens next.",
        "model": "Explore suspense, surprises and satisfying payoffs in stories without spoiling real books. Model how a clue can mean one thing now and another later.",
        "group": "Build a short mystery collaboratively, planting a clue and testing different twists.",
        "create": "Write an opening and plan a twist with one earlier clue, or outline the idea verbally.",
        "art": "A quiet midnight train carriage with an unfinished manuscript on a seat, mysterious book-cover atmosphere."
      },
      {
        "title": "The Story Lab",
        "description": "Bookish adventures: Create a short scene, comic outline or alternate ending with an intentional creative choice.",
        "objective": "Create a short scene, comic outline or alternate ending with an intentional creative choice.",
        "reading": "The villain sent a thank-you note. The hero stared at it. Apparently, saving the kingdom had ruined someone else’s plan.",
        "agenda": [
          "0–5: Playful icebreaker",
          "5–15: Book chat and author story",
          "15–25: Read and imagine together",
          "25–37: Collaborative creative game",
          "37–52: Make something of your own",
          "52–57: Optional sharing and encouragement",
          "57–60: Book discovery and closing"
        ],
        "activities": [
          {
            "title": "Choose your adventure: The Story Lab",
            "type": "poll",
            "question": "How would you remix the story?",
            "options": [
              "Change viewpoint",
              "Change genre",
              "Reverse a trope",
              "Invent another ending"
            ]
          },
          {
            "title": "Your creation: The Story Lab",
            "type": "short",
            "question": "Create a short scene, comic outline or alternate ending with an intentional creative choice."
          }
        ],
        "support": "Offer reading aloud, drawing, typing, dictation or private participation. No reading homework or public performance required.",
        "check": "Celebrate a creative choice and invite a book or genre the learner might enjoy next.",
        "ice": "Turn a familiar story trope upside down in one sentence.",
        "model": "Discuss why readers enjoy tropes, retellings and genre mashups. Model a scene from another character’s perspective and a genre switch.",
        "group": "Remix an original fictional premise together; compare how different versions feel.",
        "create": "Create a short scene, comic outline or alternate ending with an intentional creative choice.",
        "art": "A whimsical fantasy desk with a crown, sealed thank-you letter and quill, clever visual storytelling."
      },
      {
        "title": "The Author's Studio",
        "description": "Bookish adventures: Polish a piece, create a cover or pitch, or plan a future project. Make a reading wish-list.",
        "objective": "Polish a piece, create a cover or pitch, or plan a future project. Make a reading wish-list.",
        "reading": "The final chapter was finished. The author closed the notebook, opened it again and changed the first line.",
        "agenda": [
          "0–5: Playful icebreaker",
          "5–15: Book chat and author story",
          "15–25: Read and imagine together",
          "25–37: Collaborative creative game",
          "37–52: Make something of your own",
          "52–57: Optional sharing and encouragement",
          "57–60: Book discovery and closing"
        ],
        "activities": [
          {
            "title": "Choose your adventure: The Author's Studio",
            "type": "poll",
            "question": "What would you like to make next?",
            "options": [
              "A short story",
              "A novel idea",
              "A comic or script",
              "A reading adventure"
            ]
          },
          {
            "title": "Your creation: The Author's Studio",
            "type": "short",
            "question": "Polish a piece, create a cover or pitch, or plan a future project. Make a reading wish-list."
          }
        ],
        "support": "Offer reading aloud, drawing, typing, dictation or private participation. No reading homework or public performance required.",
        "check": "Celebrate a creative choice and invite a book or genre the learner might enjoy next.",
        "ice": "Invent a ridiculous book dedication or imaginary title.",
        "model": "Share the real author process: idea notebooks, drafts, editing, covers and publishing. Model revising a hook while keeping the writer’s voice.",
        "group": "Run an optional friendly pitch or feedback circle. Model asking what the writer wants readers to feel.",
        "create": "Polish a piece, create a cover or pitch, or plan a future project. Make a reading wish-list.",
        "art": "A welcoming author workspace with stacked blank books, manuscript pages and warm light, sophisticated illustrative art."
      }
    ]
  }
] as const;
export function creativeCamp(id:unknown){return CREATIVE_CAMPS.find(c=>c.id===id);}
export function campPreparation(id:unknown,index:number){
 const c=creativeCamp(id),s=c?.sessions[index],craft=s&&CAMP_CRAFT[s.title];if(!s||!craft)return "";
 return [
 "Private craft objective: "+craft.skill+". "+craft.concept+" Creative outcome: "+s.objective,
 "Original reading: "+s.reading,
 "0–5 min | Icebreaker: "+s.ice+" Invite a spoken, typed, drawn or private answer, or permission to pass.",
 "5–15 min | Book chat: Ask what stories, formats or fictional worlds learners enjoy. No favourite book is required. Share a brief genuine example from your author experience. Invite curiosity, not a reading test.",
 "15–25 min | Author demonstration: Read the original story spark aloud or offer it silently. "+craft.script+" Allow learners to respond before explaining further.",
 "25–37 min | Creative game together: "+craft.group+" Allow thinking time, invite contributions, and model an idea if nobody starts.",
 "37–52 min | Make your own: "+craft.create+" Offer drawing, dictation, typing or writing. "+craft.support+" Let learners make choices and circulate with encouragement.",
 "52–57 min | Celebrate: Ask if anyone wants to share. "+craft.feedback+" Passing is welcome.",
 "57–60 min | Book discovery: "+craft.reading+" Ask what they would like to explore next; no homework."
 ,academyExperienceGuide(c.id,s.title)
 ].filter(Boolean).join("\n\n");
}
export function campResource(id:unknown,index:number){
 const c=creativeCamp(id),s=c?.sessions[index],craft=s&&CAMP_CRAFT[s.title];if(!s||!craft)return null;
 return {creative_camp:true,programme_id:c.id,experience:academyExperience(c.id,s.title),title:s.title,objective:s.objective,reading:s.reading,tasks:[craft.prompt,craft.create,"Optional: give your creation a title or share one detail."],stretch:"If you feel inspired, keep creating or find a book with a similar theme.",slides:[
 {title:s.title,body:s.description},{title:"Book chat",body:"What stories, worlds, characters or genres do you love? Comics and audiobooks count. You can pass."},{title:"Story spark",body:s.reading},{title:"An author’s trick",body:craft.example,cards:[{label:"Imagine",body:craft.prompt},{label:"Try it",body:"Make your own version. There is more than one possibility."}]},{title:"Create together",body:s.group},{title:"Choose a possibility",body:s.activities[0].question+"\n"+s.activities[0].options?.join("\n")},{title:"Your creative studio",body:craft.create},{title:"Optional extra",body:"Give your creation a title, cover idea or next adventure."},{title:"Celebrate and discover",body:"Share if you want to. What kind of book or story would you like to discover next?"}
 ]};
}
export function campIllustrationStory(workshop:any){
 for(const c of CREATIVE_CAMPS){
  if(workshop?.programme_id&&workshop.programme_id!==c.id)continue;
  const s=c.sessions.find(s=>s.title===workshop?.title),craft=s&&CAMP_CRAFT[s.title];if(!s||!craft)continue;
  const style=c.id==="english-creative-camp-junior-v1"?"Original imaginative storybook illustration, midnight blue and golden accents, welcoming expressive shapes. ":"Original literary editorial illustration, mulberry, copper and muted lavender, sophisticated composition for teenage readers. ";
  return [
   {slide_index:0,title:"Welcome to "+s.title,brief:style+"A book opening into an imaginative scene inspired by this session: "+s.art+" Compose as a welcoming chapter opening, no words.",purpose:"Establish the creative theme."},
   {slide_index:2,title:s.title,brief:style+s.art+" Focus on the original fictional story moment, no lettering.",purpose:"Invite imagination and discussion around the original story spark."},
   {slide_index:3,title:"A writer’s craft",brief:style+"Illustrate a contrast or a creative choice through two distinct visual possibilities inspired by this fictional example: "+craft.example.slice(0,370)+" Avoid labels and do not imply a correct answer.",purpose:"Support discussion of the worked writing example."},
   {slide_index:4,title:"Create together",brief:style+"Show a playful collection of fictional objects, settings or characters as prompts for this shared idea: "+s.group.slice(0,330)+" Keep the scene open-ended, no words or identifiable people.",purpose:"Spark multiple contributions to the collaborative activity."},
   {slide_index:6,title:"Creative studio",brief:style+"An inviting writing and sketching workspace with open blank notebook and visual motifs inspired by "+s.art+" Leave room for the imagination, no lettering.",purpose:"Encourage independent creative work without revealing a solution."}
  ];
 }
 return null;
}
