// Top-up wave B: two more activities each for Art & Making, Everyday Maths, Stories & Words,
// Movement & Games, Space & Sky and Sound & Music.
import { fromRows, type QuestRow } from "./handsOnTypes";
import type { ParentLearningGuide } from "./handsOnParentGuides";
import type { QuestRunbook } from "./handsOnRunbookCore";

const art: QuestRow[] = [
  ["colour-wheel-mixing", "Mix a Colour Wheel From Three Paints", "5–13", 45, "Medium", "🎨",
    "Use only red, yellow and blue paint to mix every colour on a twelve-part colour wheel.",
    "Red, yellow and blue paint|White and black paint (optional)|Paper plate for mixing|Paintbrushes and water jar|Paper plate or card circle divided into 12|Paper towel",
    "Draw a circle on card and divide it into twelve equal slices like a pizza, with a pencil and ruler.|Paint red, yellow and blue in three slices spaced evenly apart, leaving three empty slices between each.|Mix equal amounts of red and yellow to make orange, and paint it in the slice halfway between them.|Mix yellow and blue for green and blue and red for purple, painting each one halfway between its two parents.|Fill the last six slices by mixing each primary colour with its neighbouring secondary colour, such as yellow plus green.|Label the primary, secondary and tertiary colours around the outside of the wheel.|Choose two colours opposite each other on the wheel and paint a small picture using just those two, then describe the effect.",
    "Why can three colours make so many others?|What happens when you mix colours opposite each other on the wheel?",
    "Colour theory|Mixing and observation|Fine motor control|Art vocabulary",
    "Use washable, non-toxic paints, cover the table and wear old clothes. Supervise young children so brushes and water jars stay away from mouths.",
    "Add white to make tints and black to make shades of one colour, painting a strip from lightest to darkest."],
  ["clay-coil-pot", "Coil Pot Pottery", "6–14", 60, "High", "🏺",
    "Build a small pot from rolled clay coils, smooth it and decorate it with pressed patterns.",
    "Air-dry clay|Small bowl of water|Wooden board or placemat|Blunt clay tool or pop stick|Objects for pattern pressing such as forks and buttons|Damp cloth",
    "Roll a ball of clay about the size of a golf ball and flatten it into a circle 1 cm thick for the base of your pot.|Roll another piece of clay into a long snake about as thick as a pencil, keeping it even along its length.|Score the edge of the base with a pop stick, dab a little water on it and lay the coil around the edge.|Keep adding coils on top of each other, scoring and wetting each layer so it sticks well.|Smooth the inside of the pot with a damp finger to join the coils firmly, leaving the outside coils showing if you like.|Press patterns into the outside with forks, buttons or a blunt tool to decorate it.|Leave the pot to dry for two days, then explain how coiling builds height and why the coils needed joining.",
    "Why did the coils need scoring and water to stick?|How did people make pots before pottery wheels?",
    "Sculpture|Fine motor skills|Following a process|History of craft",
    "Use air-dry clay that does not need a kiln. Keep clay away from mouths and wash hands well. Pots are decorative and must not be used for food or drink.",
    "Paint the dry pot with acrylic paint and seal it with PVA glue for a shiny finish."],
];

const maths: QuestRow[] = [
  ["recipe-scaling", "Double or Halve the Recipe", "8–14", 50, "Medium", "🍪",
    "Scale a biscuit recipe up or down, convert the measurements, then bake it to test your maths.",
    "Simple biscuit recipe|Measuring cups and spoons|Kitchen scales|Calculator (optional)|Paper and pencil|Baking ingredients and tray",
    "Copy the ingredients list from a simple biscuit recipe onto paper, leaving two empty columns beside it.|Label the columns double batch and half batch, and work out each amount by multiplying by two or dividing by two.|Check tricky amounts such as half of three quarters of a cup by drawing a picture or using measuring cups.|Convert any cups to grams using the kitchen scales, and write the gram amounts beside your doubled recipe.|Choose either the half or double batch and measure out every ingredient carefully using your new amounts.|Bake the biscuits with an adult and count how many you make compared with the original recipe's number.|Explain which conversions were hardest and how you checked that your answers made sense.",
    "What would you do if the recipe used one egg and you needed half a batch?|Why do bakers often weigh flour instead of using cups?",
    "Multiplication and division|Fractions|Measurement|Real-world problem solving",
    "An adult supervises the oven and hot trays. Check for food allergies, wash hands before cooking, and do not eat raw dough containing egg or flour.",
    "Scale the recipe to make exactly enough biscuits for every person in your family to have three."],
  ["shopping-budget-challenge", "Supermarket Budget Challenge", "8–15", 45, "Low", "🛒",
    "Plan a family dinner for a set budget using a catalogue or online prices, then check your total.",
    "Supermarket catalogue or online price list|Paper and pencil|Calculator|Budget card such as $25|Highlighter|Recipe book or ideas",
    "Write your budget at the top of a page, such as $25 for one dinner for the whole family.|Choose a main meal, a vegetable side and a dessert, and list every ingredient you will need.|Look up the price of each ingredient in the catalogue and write it beside the item.|Add up the prices as you go, rounding to the nearest dollar first to estimate, then calculate the exact total.|If you are over budget, swap expensive items for cheaper ones and recalculate until you are under budget.|Highlight the most expensive ingredient and work out what fraction of the budget it uses.|Present your final menu and receipt total to the family, explaining one swap that saved the most money.",
    "Is the cheapest option always the best choice?|How could buying in bulk or in season save money?",
    "Money and budgeting|Addition and estimation|Decision making|Fractions",
    "If visiting a real shop, stay with an adult at all times. Keep catalogue scissors and supplies safe from young children.",
    "Compare unit prices (price per 100 g) for two brands of the same item and decide which is better value."],
];

const stories: QuestRow[] = [
  ["comic-strip-sequel", "Write a Comic Strip Sequel", "7–14", 50, "Low", "💬",
    "Choose a favourite story and write a six-panel comic showing what happens next.",
    "A favourite picture book or novel|Paper divided into six panels|Pencil and eraser|Fine black marker|Coloured pencils|Ruler",
    "Choose a favourite story and write one sentence about how it ended and which character you want to follow.|Plan your sequel in six steps: setting, problem, two attempts to solve it, climax and ending.|Rule a page into six panels and sketch each scene lightly in pencil, leaving space at the top for speech bubbles.|Add speech bubbles for what characters say and thought bubbles for what they think.|Use caption boxes for narration such as later that day or meanwhile to show time passing.|Go over your lines with a black marker and add colour, using bold colours for the most exciting panel.|Read your comic aloud to a family member and ask them to tell you their favourite panel and why.",
    "How do comics show sound and movement without words?|Why do stories need a problem to solve?",
    "Narrative structure|Sequencing|Dialogue|Visual storytelling",
    "Supervise use of markers so they do not stain clothes or furniture. Choose stories suitable for the child's age.",
    "Turn your comic into a short play, acting out each panel with family members."],
  ["persuasive-letter", "Persuade the Family Letter", "8–15", 45, "Low", "✉️",
    "Write a persuasive letter to convince the family to try something new, using reasons, evidence and a strong ending.",
    "Lined paper or notebook|Pencil|Highlighters in three colours|Envelope|Example persuasive phrases list|Dictionary",
    "Choose something you want to persuade your family about, such as a new pet, a family outing or a later bedtime.|Brainstorm at least five reasons and choose the three strongest ones to use.|Find evidence for each reason, such as a fact, an example or a quote from someone who agrees.|Write an opening that clearly states what you want and why it matters.|Write one paragraph per reason, starting each with a persuasive phrase like firstly, in addition or most importantly.|Finish with a strong conclusion that sums up your reasons and asks politely for a decision.|Highlight your reasons, evidence and persuasive words in different colours, then post your letter to the family.",
    "Which reason do you think will be most convincing, and why?|How do advertisements try to persuade people?",
    "Persuasive writing|Paragraphing|Using evidence|Audience awareness",
    "Keep requests realistic and kind, and talk with a parent about any decisions that involve safety or money.",
    "Write a reply letter from the family's point of view, answering each of your reasons."],
];

const movement: QuestRow[] = [
  ["obstacle-course-designer", "Design a Backyard Obstacle Course", "5–13", 50, "Medium", "🏃",
    "Plan, build and time an obstacle course, then improve it so it suits players of different ages.",
    "Hoops, cones or buckets|Skipping rope|Pool noodles or broom handle|Cushions or a mat|Stopwatch|Paper and pencil for a map",
    "Draw a map of your backyard and plan six stations, such as jumping, crawling, balancing, weaving, throwing and running.|Build each station with safe equipment, checking the ground is clear of sticks, rocks and holes.|Walk through the course slowly first to check every station is safe and makes sense.|Time each player's run with a stopwatch and record the results in a table.|Ask each player which station was hardest and which was most fun, writing down their answers.|Change one station to make it fairer for younger players, such as lowering a jump or shortening a balance beam.|Run the course again, compare times and explain how your changes made it better for everyone.",
    "How can you make a game fun for players of different ages?|Which station uses the most energy?",
    "Fitness|Planning and design|Measurement of time|Inclusion",
    "Check the area for hazards before playing, avoid hard surfaces under jumps, and have an adult supervise. Drink water and rest in the shade on hot days.",
    "Turn the course into a relay with teams and calculate each team's average time."],
  ["juggling-scarves", "Learn to Juggle With Scarves", "6–15", 30, "Low", "🤹",
    "Learn the basic cascade pattern with light scarves, building up from one to three.",
    "Three light scarves or plastic shopping bags|Open space|Timer|Mirror (optional)|Paper to track progress",
    "Hold one scarf by its centre, throw it up across your body from right to left, and catch it in your left hand.|Throw it back from left to right, making an X shape in the air, and practise ten catches.|Hold one scarf in each hand, throw the right one up, and when it peaks throw the left one under it.|Catch each scarf in the opposite hand, and practise this two-scarf exchange ten times.|Hold two scarves in your right hand and one in your left, throw from the hand with two first.|Keep throwing the next scarf when the last one peaks, counting how many throws you make in a row.|Track your best score each day for a week and explain what helped you improve most.",
    "Why are scarves easier to start with than balls?|How does practice change what your brain and hands can do?",
    "Coordination|Perseverance|Tracking progress|Patterns",
    "Clear the space of breakables and furniture edges. Use soft scarves or bags only, and keep plastic bags away from young children's faces.",
    "Move on to three soft beanbags or rolled socks once you can do twenty scarf throws in a row."],
];

const space: QuestRow[] = [
  ["sundial-time", "Make a Shadow Sundial", "7–14", 45, "Low", "🕰️",
    "Build a sundial from a paper plate and pencil and use the Sun's shadow to tell the time.",
    "Paper plate|Pencil or straight stick|Modelling clay|Marker|Compass or phone compass|Watch or clock",
    "Push a pencil through the centre of a paper plate and fix it upright with a lump of modelling clay underneath.|Take the plate outside on a sunny morning and place it on flat ground where it will be in sun all day.|Use a compass to point the edge of the plate marked N towards north, and weigh it down with stones.|Every hour on the hour, mark where the pencil's shadow falls and write the time beside the line.|Notice how the shadow changes length and direction through the day, and draw a sketch at three times.|The next sunny day, put the plate back in exactly the same spot and use your marks to tell the time.|Explain why the shadow moves and why the sundial must be facing the same way to stay accurate.",
    "Why is the shadow shortest around midday?|Would your sundial work the same in winter?",
    "Earth's rotation|Time|Observation over a day|Shadows",
    "Never look directly at the Sun. Wear sunscreen and a hat, and only go outside to mark the shadow each hour, resting in the shade between.",
    "Compare your sundial's reading with a clock and explain any difference, such as daylight saving time."],
  ["rocket-balloon-string", "Balloon Rocket on a String", "6–13", 30, "Low", "🎈",
    "Fire a balloon rocket along a string and test how balloon size changes the distance it travels.",
    "Balloons|Long piece of string (5 m)|Drinking straw|Sticky tape|Two chairs|Measuring tape",
    "Thread the string through a drinking straw and tie each end to a chair, pulling the chairs apart until the string is tight.|Blow up a balloon, pinch the end closed without tying it, and tape it to the straw with the opening facing one chair.|Slide the balloon back to the starting chair, then let go and watch it rocket along the string.|Measure how far it travelled with a measuring tape and record the distance.|Repeat with the balloon blown up half as much and then fully, keeping the string the same.|Do three trials for each size and work out the average distance for each.|Explain how the air rushing out pushes the balloon forward, linking it to how real rockets work.",
    "Why does the balloon move the opposite way to the air?|How could you make the rocket go further?",
    "Forces and motion|Fair testing|Averages|Space technology",
    "Balloons and burst pieces are a choking risk for young children, so supervise and pick up broken pieces straight away. Children with latex allergies should use latex-free balloons.",
    "Make a two-stage rocket by taping two balloons together and see whether it travels further."],
];

const sound: QuestRow[] = [
  ["straw-pan-pipes", "Straw Pan Pipes", "6–13", 35, "Low", "🎼",
    "Cut straws to different lengths and tape them together to make pan pipes that play a scale.",
    "Eight wide drinking straws|Scissors|Ruler|Sticky tape|Card strip|Marker",
    "Line up eight straws and measure them, cutting the first to 16 cm and each next straw 1.5 cm shorter.|Lay the straws side by side from longest to shortest, keeping the tops lined up evenly.|Tape them firmly onto a card strip so they stay in order and do not slide around.|Blow gently across the top of each straw, not into it, like blowing across a bottle, until you hear a note.|Listen to how the notes change from the longest straw to the shortest, and write high or low beside each one.|Try to play a simple tune such as a nursery rhyme by blowing across the straws in order.|Explain why shorter straws make higher notes, using the words vibrate and air.",
    "Why does a shorter column of air make a higher sound?|Which other instruments use tubes of different lengths?",
    "Sound and pitch|Measurement|Patterns|Music making",
    "An adult cuts straws for young children. Each player uses their own pan pipes and never shares, to keep germs from spreading.",
    "Tune your pipes to match notes on a piano or app by trimming the straws a few millimetres at a time."],
  ["body-percussion-rhythm", "Body Percussion Rhythm Builder", "5–12", 25, "Low", "👏",
    "Create and notate rhythms using claps, clicks, stomps and pats, then perform them in a round.",
    "Paper and pencil|Coloured pencils|Timer or metronome app|Open space|Recording device (optional)",
    "Practise four body sounds: clap, click, pat your knees and stomp your feet, giving each one a symbol and colour.|Count a steady beat of four together and play one body sound on every beat.|Create a four-beat pattern mixing two sounds, such as clap, clap, stomp, pat, and write it with your symbols.|Build a longer rhythm of four patterns in a row, writing each line under the last.|Perform your rhythm with a metronome app set to a slow speed, then speed it up.|Teach your rhythm to a family member and perform it as a round, starting four beats apart.|Record your performance and explain which part of the rhythm was hardest to keep steady.",
    "Why is a steady beat important when playing music with others?|How could you show a rest, a beat with no sound, in your notation?",
    "Rhythm and beat|Musical notation|Patterns|Collaboration",
    "Play in a clear space and keep away from furniture edges. Stomp gently on soft flooring, and take a rest if hands or feet get sore.",
    "Add a rest symbol and create a rhythm using silences, then perform it for the family."],
];

export const topUpBQuests = [
  ...fromRows("Art & Making", art), ...fromRows("Everyday Maths", maths), ...fromRows("Stories & Words", stories),
  ...fromRows("Movement & Games", movement), ...fromRows("Space & Sky", space), ...fromRows("Sound & Music", sound),
];

const teaching: [string, string, string, string, string][] = [
  ["colour-wheel-mixing", "Mix primary colours to create secondary and tertiary colours.", "Red, yellow and blue are primary colours that can be mixed to make secondary colours (orange, green, purple) and tertiary colours in between. Opposite colours on the wheel are complementary and stand out strongly together.", "Ask the child to predict each mixed colour before mixing.", "A twelve-part painted colour wheel with labels and a complementary colour picture."],
  ["clay-coil-pot", "Build a three-dimensional form using the coil technique.", "Coiling is one of the oldest ways to make pots. Scoring and wetting the clay helps coils bond so the pot does not crack as it dries.", "Ask the child to explain each step and why joining the coils matters.", "A finished coil pot and an explanation of the building process."],
  ["recipe-scaling", "Multiply and divide quantities to scale a recipe.", "Scaling a recipe means multiplying or dividing every amount by the same number so the proportions stay the same. Fractions and unit conversions make this real-world maths.", "Ask the child to explain how they checked a tricky fraction.", "A scaled ingredients table and baked results compared with the original yield."],
  ["shopping-budget-challenge", "Plan a meal within a budget using addition, estimation and comparison.", "Estimating by rounding helps check exact totals, and swapping items shows how choices affect cost. Budgets involve trade-offs between price and other needs.", "Ask the child to justify one swap and its effect on the total.", "A priced menu under budget, calculations and an explanation of savings."],
  ["comic-strip-sequel", "Plan and create a narrative sequel using visual storytelling.", "Stories need a setting, a problem and a resolution. Comics use panels, speech bubbles and captions to show sequence, dialogue and time passing.", "Ask the child to retell their story using only the panels.", "A six-panel comic with speech bubbles, captions and a clear story structure."],
  ["persuasive-letter", "Write a structured persuasive letter using reasons and evidence.", "Persuasive writing states a position, supports it with reasons and evidence, and ends with a clear request. Knowing the audience helps choose the strongest reasons.", "Ask the child which reason is strongest and how evidence supports it.", "A letter with an opening, three reason paragraphs, a conclusion and highlighted features."],
  ["obstacle-course-designer", "Design, test and improve a physical course for different players.", "Planning stations that use different movements builds fitness and coordination. Adjusting the course for younger players shows inclusive design.", "Ask the child how their changes made the course fairer.", "A course map, timing table and an explanation of improvements."],
  ["juggling-scarves", "Develop coordination through a sequenced skill and track progress.", "Juggling builds hand-eye coordination and timing. Breaking a skill into steps and practising daily shows how improvement comes with effort.", "Ask the child which step helped most and how their score changed.", "A week-long progress chart and a demonstration of the best run."],
  ["sundial-time", "Use a shadow to track the Sun's apparent movement and tell the time.", "As Earth rotates, the Sun appears to move across the sky, so shadows change length and direction. A fixed sundial uses these changes to show the time.", "Ask the child to predict where the shadow will be in an hour.", "A marked sundial, sketches of shadow changes and a written explanation."],
  ["rocket-balloon-string", "Investigate thrust and test how one variable affects distance.", "Air rushing out of the balloon pushes back on the balloon, moving it forward. This action and reaction is how rockets move in space.", "Ask the child what stayed the same between trials and why.", "Distance results for three sizes, averages and an explanation of thrust."],
  ["straw-pan-pipes", "Investigate how the length of an air column changes pitch.", "Blowing across a straw makes the air inside vibrate. Shorter columns of air vibrate faster, making higher-pitched notes.", "Ask the child to predict which straw will sound highest before playing.", "A set of pan pipes, notes labelled high to low and a played tune."],
  ["body-percussion-rhythm", "Create, notate and perform rhythmic patterns.", "Rhythm is a pattern of sounds and silences over a steady beat. Writing symbols for sounds is a simple form of musical notation.", "Ask the child to read their notation back while performing.", "A notated rhythm and a recorded or live performance in a round."],
];
export const topUpBParentGuides: Record<string, ParentLearningGuide> = Object.fromEntries(teaching.map(([id, objective, explanation, parentPrompt, evidence]) => [id, { objective, explanation, parentPrompt, evidence }]));

const notes: [string, string, string, string][] = [
  ["colour-wheel-mixing", "Set out red, yellow and blue paint, a mixing plate and a pre-drawn twelve-slice circle.", "A wheel with three primary, three secondary and six tertiary colours in the right order.", "Colours turn muddy: rinse the brush between mixes. Green too dark: add blue to yellow a little at a time."],
  ["clay-coil-pot", "Buy air-dry clay, cover the table and have a small bowl of water and a damp cloth ready.", "A small pot several coils high with joined inside walls and pressed patterns outside.", "Coils cracking: add a little water and smooth. Pot collapsing: make coils thicker and let lower layers firm up first."],
  ["recipe-scaling", "Choose a simple biscuit recipe and set out measuring tools and scales.", "A correct half or double batch, with biscuit numbers close to half or double the original.", "Stuck on fractions: use measuring cups to show halves physically. Biscuits spread: chill the dough before baking."],
  ["shopping-budget-challenge", "Collect a supermarket catalogue or open an online price list, and set a realistic budget.", "A complete menu priced under budget with at least one money-saving swap.", "Always over budget: suggest cheaper proteins or seasonal vegetables. Arithmetic errors: check with a calculator after estimating."],
  ["comic-strip-sequel", "Choose a familiar story and rule six panels on paper beforehand.", "A six-panel comic with a clear problem and ending, using speech bubbles and captions.", "Child stuck for ideas: ask what problem the character might face next. Drawing worries: stick figures are fine."],
  ["persuasive-letter", "Prepare a list of persuasive phrases and help choose a realistic topic.", "A structured letter with three reasons, evidence for each and a polite request.", "Reasons are weak: ask how it benefits the whole family. Letter too short: add an example for each reason."],
  ["obstacle-course-designer", "Gather safe equipment and check the yard for hazards before building.", "A six-station course with timed runs and at least one change for younger players.", "Course too hard: simplify one station. Players bunch up: start each player 20 seconds apart."],
  ["juggling-scarves", "Find three light scarves or plastic bags and clear an open space.", "Most children manage the two-scarf exchange quickly and a few three-scarf throws by the end of the week.", "Scarves drift away: throw higher and more gently. Frustration: go back to one scarf for a minute."],
  ["sundial-time", "Choose a sunny day and a flat spot in full sun, and mark north on the plate.", "Hourly shadow lines that shorten towards midday and lengthen in the afternoon.", "Cloudy day: mark the times you can and finish another day. Readings off by an hour: daylight saving time may be in effect."],
  ["rocket-balloon-string", "Tie the string tightly between two chairs and have balloons, tape and a straw ready.", "Fuller balloons travel further along the string, with averages showing a clear pattern.", "Balloon stalls: pull the string tighter and use a smooth straw. Balloon spins: tape it straight along the straw."],
  ["straw-pan-pipes", "Use wide straws and measure the cut lengths beforehand for young children.", "Eight notes rising in pitch from the longest to the shortest straw.", "No sound: blow across the top edge, not into it. Notes too close: make the length differences bigger."],
  ["body-percussion-rhythm", "Agree on four body sounds and symbols, and set a metronome app to a slow speed.", "A notated rhythm performed steadily, then as a round with a family member.", "Losing the beat: slow the metronome down. Round falls apart: practise each part separately first."],
];
export const topUpBRunbooks: Record<string, QuestRunbook> = Object.fromEntries(notes.map(([id, prepare, expected, troubleshoot]) => [id, { prepare, expected, troubleshoot }]));
