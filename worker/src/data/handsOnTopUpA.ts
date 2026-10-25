// Top-up wave A: two more activities each for Kitchen Science, Crystal Lab, Dough & Sensory,
// LEGO & Builders, Engineering Lab and Nature Explorers.
import { fromRows, type QuestRow } from "./handsOnTypes";
import type { ParentLearningGuide } from "./handsOnParentGuides";
import type { QuestRunbook } from "./handsOnRunbookCore";

const kitchen: QuestRow[] = [
  ["red-cabbage-indicator", "Red Cabbage Colour-Change Potion", "6–14", 45, "Medium", "🟣",
    "Make a natural indicator from red cabbage and use it to sort kitchen liquids into acids and bases by colour.",
    "Quarter of a red cabbage|Hot water from the kettle (adult only)|Sieve and jug|Six clear cups|Lemon juice, vinegar, bicarb soda, soapy water, milk and plain water|White paper and coloured pencils",
    "An adult chops the cabbage roughly, puts it in a heatproof jug and covers it with hot water, then leaves it for 15 minutes to turn deep purple.|Pour the cooled purple liquid through a sieve into a jug, throwing away the cabbage pieces into the compost.|Line up six clear cups on white paper and pour about 3 cm of purple cabbage juice into each one.|Label the cups, then add a spoonful of lemon juice, vinegar, bicarb soda dissolved in water, soapy water, milk and plain water, one per cup.|Watch each cup change colour and colour in a matching dot on your paper beside the liquid's name.|Arrange the cups in a rainbow line from pink and red through purple to blue and green.|Explain that pinks show acids and blues and greens show bases, then sort each liquid into acid, neutral or base.",
    "Why does the same purple juice turn so many colours?|Which liquids in your bathroom might be acids or bases?",
    "Acids and bases|Observation|Classification|Recording with colour",
    "An adult handles the boiling water and chopping. Never taste the test liquids, keep cleaning products out of this activity, and wash hands afterwards. Wipe spills straight away because cabbage juice can stain.",
    "Add vinegar to the blue bicarb cup a drop at a time and count how many drops it takes to turn it back to purple."],
  ["butter-in-a-jar", "Shake Cream Into Butter", "4–12", 30, "Low", "🧈",
    "Shake a jar of cream until it separates into butter and buttermilk, then explain the change you made.",
    "Small jar with a tight lid|300 mL thickened or pure cream|Pinch of salt (optional)|Timer|Strainer and bowl|Crackers or bread to taste",
    "Let the cream sit out of the fridge for about 20 minutes so it is cool rather than icy, which makes it change faster.|Pour cream into the jar until it is half full, screw the lid on tightly and check it does not leak.|Take turns shaking the jar hard while someone starts the timer, swapping every minute so arms do not get tired.|Stop every two minutes to look and record what you see, such as runny, thick like whipped cream, or lumpy.|Keep shaking until you hear a slosh and see a yellow lump floating in thin white liquid, then stop the timer.|Pour the mixture through a strainer, keep the buttermilk for pancakes, and rinse the butter lump in cold water.|Add a pinch of salt, spread it on a cracker to taste, and explain how shaking turned a liquid into a solid.",
    "Where did the yellow butter come from if the cream looked white?|Would shaking faster or slower change how long it takes?",
    "Changes of state|Observation over time|Cooperation|Food science",
    "Check for dairy allergies before tasting, and keep cream cold until starting. Use a plastic jar with young children so it will not break if dropped, and wash hands before handling food.",
    "Time two jars at the same time, one half full and one quarter full, and find out which turns to butter first."],
];

const crystal: QuestRow[] = [
  ["borax-snowflake", "Pipe-Cleaner Crystal Snowflake", "8–15", 40, "Medium", "❄️",
    "Grow sparkling crystals overnight on a pipe-cleaner snowflake using a saturated solution made by an adult.",
    "Three white pipe cleaners|String and a pencil|Wide-mouthed glass jar|Hot water from the kettle (adult only)|Borax laundry booster (adult handles)|Tablespoon and food colouring",
    "Twist three pipe cleaners together in the middle and spread the six arms out to make a snowflake that fits inside the jar without touching the sides.|Tie a piece of string to one arm and wrap the other end around a pencil so the snowflake can hang from the pencil laid across the jar.|An adult fills the jar with hot water and stirs in three tablespoons of borax per cup of water until no more will dissolve.|Add a few drops of food colouring if you like, then lower the snowflake in so it is completely covered but not touching the bottom.|Leave the jar somewhere it will not be bumped overnight, and write a prediction of what you think you will see in the morning.|In the morning, lift the snowflake out, let it dry on paper towel and look at the crystals with a magnifying glass.|Draw the crystal shapes you can see and explain why crystals formed as the hot water cooled down.",
    "Why did crystals form only as the water cooled?|Why do the crystals have flat faces and sharp edges?",
    "Solutions and saturation|Crystal growth|Prediction|Observation with magnification",
    "Borax must only be measured and mixed by an adult; it is harmful if swallowed and can irritate skin and eyes. Keep it away from young children and pets, wear gloves to handle the wet snowflake, and wash hands afterwards. Pour leftover solution down the sink with plenty of water.",
    "Repeat with salt or sugar instead of borax, using the same water and time, and compare which crystals grow largest."],
  ["alum-crystal-geode", "Eggshell Crystal Geode", "9–16", 50, "High", "🥚",
    "Turn a clean eggshell half into a sparkling geode by growing alum crystals inside it over two to three days.",
    "Two clean, dry eggshell halves|PVA glue and paintbrush|Alum powder from the spice aisle|Hot water from the kettle (adult only)|Food colouring|Plastic cup and egg carton",
    "Rinse two eggshell halves gently, peel out the thin inner skin and let them dry completely on paper towel.|Paint the inside of each shell with a thin layer of PVA glue, sprinkle alum powder over it and leave it to dry for an hour as seed crystals.|An adult dissolves alum in a cup of hot water, stirring until no more dissolves, then adds a few drops of food colouring.|Rest each shell in an egg carton cup so it sits steadily, then carefully fill a deep plastic cup with the solution and lower a shell in.|Leave the cup somewhere still for two to three days, checking once a day and drawing what you see.|Lift the shell out with a spoon, drain it on paper towel and look closely at the crystals growing from the seed layer.|Compare your geode with pictures of real geodes and explain how slowly cooling water made the crystals grow.",
    "Why did the crystals grow on the alum seeds first?|How long do you think real geodes take to form underground?",
    "Crystal growth|Patience and observation|Solutions|Earth science links",
    "Alum is a food additive but must not be eaten in quantity; an adult mixes the hot solution. Keep the cup out of reach of young children and pets and wash hands after handling. Eggshells can be sharp, so handle them gently.",
    "Grow a second geode in a solution with no food colouring and compare crystal size and clarity."],
];

const dough: QuestRow[] = [
  ["kinetic-sand-lab", "Homemade Moon Sand Lab", "3–9", 30, "High", "🏖️",
    "Mix flour and oil into soft, mouldable moon sand, then test which moulds hold their shape best.",
    "4 cups plain flour|Half a cup of vegetable oil|Large tub|Measuring cups|Moulds such as cups, cookie cutters and sandcastle buckets|Tray or old sheet to work on",
    "Spread an old sheet or tray under your work area, then tip four cups of flour into a large tub.|Pour in half a cup of vegetable oil a little at a time and mix with your hands until it feels like damp sand.|Squeeze a handful tightly and open your hand to check it holds its shape, adding a little more oil if it crumbles.|Press the moon sand firmly into three different moulds, such as a cup, a cookie cutter and a small bucket.|Turn each mould over carefully, tap it and lift it away, then look at which shape stayed sharp.|Try building a tower from the moulded shapes and count how high it gets before it slumps.|Talk about why squeezing makes the sand stick together, and describe how the sand feels using three describing words.",
    "Why does squeezing the sand make it hold together?|How is moon sand like and unlike real beach sand?",
    "Sensory exploration|Describing materials|Fine motor skills|Early engineering",
    "Raw flour must not be eaten, so supervise toddlers closely and wash hands afterwards. Check for wheat allergies first, and keep the sand on the tray so floors do not become slippery.",
    "Add a few drops of food colouring to small batches and build a moon base with coloured craters."],
  ["scented-dough-guess", "Mystery Scent Dough Guessing Game", "3–8", 35, "Medium", "👃",
    "Make small batches of dough scented with kitchen spices and challenge the family to guess each smell.",
    "Plain playdough (homemade or bought)|Cinnamon, cocoa powder, vanilla essence and lemon zest|Five small bowls|Blindfold or scarf|Spoon|Labels and a pen",
    "Divide the playdough into five equal balls, and put each one in its own small bowl.|Knead a different scent into four of the balls, such as cinnamon, cocoa, vanilla and lemon, leaving one plain as a test.|Write the scent on a label under each bowl where the guesser cannot see it.|Blindfold a family member and let them squeeze and sniff each ball one at a time, asking them to name the smell.|Record each guess beside the correct answer, and give a point for every right answer.|Swap roles so everyone has a turn to guess, then add up the scores.|Talk about which smell was easiest and which was hardest, and use describing words like sweet, sharp or warm.",
    "Why is it hard to name a smell even when it seems familiar?|Can you remember a time a smell reminded you of something?",
    "Senses|Descriptive language|Turn-taking|Memory",
    "Check for spice and food allergies before starting. Keep spices away from eyes, and remind young children the dough is for smelling, not eating. Wash hands when finished.",
    "Add two scents to one ball and see whether anyone can pick both smells."],
];

const lego: QuestRow[] = [
  ["lego-gear-spinner", "LEGO Gear Speed Machine", "7–14", 40, "Low", "⚙️",
    "Build a gear train and discover how big and small gears change speed and turning direction.",
    "LEGO Technic gears in at least two sizes|Technic axles and beams|Base plate|Sticky note flags|Pencil and paper|Timer",
    "Fix a Technic beam to a base plate and push two axles through it so two gears can sit side by side and mesh their teeth.|Put a large gear on one axle and a small gear on the other, then stick a paper flag on each so you can count turns.|Turn the large gear slowly one full turn and count how many times the small gear spins.|Swap the gears around so you turn the small gear, and count how many turns the large gear makes.|Add a third gear in the middle and watch which direction each gear spins, drawing arrows on paper.|Count the teeth on each gear and see if the tooth numbers explain the turns you counted.|Explain which arrangement makes something spin fast and which makes it turn slowly but powerfully, like a bike in a low gear.",
    "Why does a small gear spin faster than a large one?|Where are gears used in bikes, clocks or cars?",
    "Simple machines|Ratios|Counting and comparing|Engineering",
    "Keep small LEGO pieces away from children under three, who could choke on them. Keep fingers clear of meshing gears when turning quickly.",
    "Build a gear train that makes one flag spin exactly three times for every one turn of the handle."],
  ["lego-earthquake-shake", "LEGO Earthquake-Proof Building", "7–14", 45, "Low", "🏢",
    "Build towers on a shake table made from a tray and balls, then redesign them to survive stronger earthquakes.",
    "LEGO bricks and base plates|Baking tray|Four tennis balls or marbles|Large rubber band|Timer|Paper for results",
    "Make a shake table by resting a baking tray on four tennis balls on a smooth floor so it can slide side to side.|Build a tower 20 bricks tall on a base plate in a simple straight stack, and place it in the middle of the tray.|Shake the tray gently side to side for ten seconds and record whether the tower stands, leans or falls.|Increase the shaking to medium and then strong, recording what happens at each level.|Redesign the tower with a wider base, cross-bracing bricks or a lower heavy section, keeping it 20 bricks tall.|Repeat the same three shake tests on the new design and record the results beside the first ones.|Explain which design change helped most and how engineers use similar ideas in real buildings in earthquake zones.",
    "Why does a wider base make a tower more stable?|Why do some tall buildings sway instead of being completely rigid?",
    "Engineering design|Fair testing|Structures|Evaluation",
    "Keep small LEGO pieces away from young children. Play on a clear floor away from furniture edges, and watch for marbles rolling underfoot.",
    "Try putting the tower on a layer of sponges or rubber feet, modelling base isolation, and test whether it helps."],
];

const engineering: QuestRow[] = [
  ["egg-drop-capsule", "Egg Drop Capsule Challenge", "8–16", 60, "High", "🥚",
    "Design a capsule from recycled materials that protects a raw egg dropped from a height.",
    "Raw eggs|Recycled materials such as boxes, cups, straws, bubble wrap and paper|Masking tape|Plastic bags and string for parachutes|Measuring tape|Drop zone with a tarp",
    "Set the rules: each capsule can use only 1 metre of tape and whatever recycled materials fit in a shoebox.|Sketch two different capsule ideas, labelling how each one will slow the fall or cushion the landing.|Choose your best idea and build it, leaving a way to put the egg in and take it out afterwards.|Spread a tarp on the ground and, with an adult, drop the capsule from 1 metre to test it first.|Check the egg, then increase the height to 2 metres and finally from a safe upstairs window or ladder held by an adult.|Record the highest drop the egg survived and note what happened to the capsule each time.|Improve one part of your design based on what you saw, retest it, and explain what change made the biggest difference.",
    "Is it better to slow the fall or soften the landing?|How do car crumple zones protect people?",
    "Engineering design|Forces|Testing and improving|Evaluation",
    "Only an adult drops from heights such as windows or ladders. Keep everyone back from the drop zone, use a tarp, and wash hands after handling raw egg.",
    "Find the lightest capsule that still protects the egg, weighing each design on kitchen scales."],
  ["catapult-accuracy", "Pop-Stick Catapult Target Practice", "7–14", 45, "Low", "🎯",
    "Build a pop-stick catapult and adjust it to hit targets at different distances.",
    "Nine pop sticks|Rubber bands|Plastic spoon|Pom-poms or scrunched paper balls|Measuring tape|Three paper plate targets",
    "Stack seven pop sticks and wrap a rubber band around each end tightly to make the base.|Lay two pop sticks on top of each other, wrap a rubber band around one end, and slide the stack between them near the band.|Wrap a rubber band in a cross shape where the sticks meet so the top arm springs back when pressed.|Tape a plastic spoon to the end of the top stick to hold the pom-pom.|Place targets at 1, 2 and 3 metres, launch ten pom-poms at the first target and count the hits.|Move the stack closer to or further from the band and record how the launch distance changes.|Adjust your catapult to hit each target and write instructions explaining how to set it up for each distance.",
    "Why does moving the stack change how far it shoots?|What other machines store energy and release it quickly?",
    "Forces and energy|Measurement|Adjusting variables|Recording results",
    "Only launch soft pom-poms or paper balls, never hard objects, and never aim at people or pets. Wear safety glasses if you have them and supervise young children with rubber bands.",
    "Make a bar graph showing hits at each distance before and after adjustments."],
];

const nature: QuestRow[] = [
  ["bark-rubbing-trees", "Tree Bark ID Rubbings", "5–12", 40, "Low", "🌳",
    "Make crayon rubbings of bark from different trees and build an identification booklet with leaves and notes.",
    "Thin paper|Crayons with paper peeled off|Masking tape|Clipboard|Measuring tape|Tree guide or app",
    "Choose four different trees in your garden, street or park, and give each one a number.|Tape a sheet of paper to the trunk at chest height and rub the side of a crayon over it to reveal the bark pattern.|Collect a fallen leaf from below each tree and press it between paper to bring home.|Measure around each trunk at chest height with a tape measure and record the distance in centimetres.|Describe each bark using words like smooth, peeling, ridged or rough, and note the tree's shape.|Use a tree guide or app to try to identify each tree, writing a question mark if you are unsure.|Make a booklet with one page per tree showing the rubbing, the pressed leaf, the trunk size and your notes.",
    "Why do some trees have peeling bark, like many gum trees?|Can you guess which tree is oldest from its trunk size?",
    "Observation|Identification|Measurement|Nature journalling",
    "Only collect fallen leaves and never peel bark from living trees. Check trunks for ants and spiders before touching, and stay with an adult near roads.",
    "Revisit your trees each season and add notes about flowers, fruit or leaves falling."],
  ["night-sounds-map", "Evening Sound Map", "5–14", 30, "Low", "🦉",
    "Sit outside at dusk, map every sound you hear, and work out which are made by animals, people or weather.",
    "Clipboard and paper|Pencil|Torch|Warm clothes|Timer|Picnic rug or chair",
    "Draw a small X in the middle of the paper to show where you are sitting, with a circle around it.|Go outside at dusk with an adult, sit still on a rug and set a timer for ten minutes.|Close your eyes and listen, then draw a symbol on the map in the direction each sound came from.|Use different symbols for animals, people, machines and weather, and make a key at the bottom.|Note whether each sound was near or far by drawing it closer to or further from the X.|When the timer finishes, count the sounds in each group and guess what made any mystery sounds.|Repeat the map in the morning another day and compare which sounds change between dawn and dusk.",
    "Why are some animals noisier at dusk?|Which sounds would you never notice without stopping to listen?",
    "Careful listening|Mapping|Classification|Local wildlife",
    "An adult should always be present outside after dark. Stay in a safe, familiar place away from roads, use a torch when moving, and watch for insects and uneven ground.",
    "Record sounds on a phone and use a frog or bird call app to try to identify your mystery sounds."],
];

export const topUpAQuests = [
  ...fromRows("Kitchen Science", kitchen), ...fromRows("Crystal Lab", crystal), ...fromRows("Dough & Sensory", dough),
  ...fromRows("LEGO & Builders", lego), ...fromRows("Engineering Lab", engineering), ...fromRows("Nature Explorers", nature),
];

const teaching: [string, string, string, string, string][] = [
  ["red-cabbage-indicator", "Use a natural indicator to classify liquids as acids, bases or neutral.", "Red cabbage contains a pigment that changes colour depending on how acidic or basic a liquid is: pinks and reds for acids, purple for neutral, and blues and greens for bases.", "Ask the child to predict each liquid's colour before adding it and explain any surprises.", "A colour chart of six liquids and a sorted list of acids, neutrals and bases."],
  ["butter-in-a-jar", "Observe and describe how shaking cream changes it into butter.", "Cream contains tiny fat droplets. Shaking makes them crash together and clump into butter, leaving the watery buttermilk behind; this is a physical change.", "Ask the child to describe each stage they saw and why the fat clumped together.", "A timed record of observations and a spoken or written explanation of the change."],
  ["borax-snowflake", "Grow crystals from a saturated solution and explain why they form.", "Hot water dissolves more borax than cold water. As it cools it can hold less, so the extra borax comes out of solution and builds crystals with flat faces.", "Ask the child why the snowflake needed to hang without touching the jar.", "A crystal snowflake, a prediction and a labelled drawing of the crystals."],
  ["alum-crystal-geode", "Grow crystals on seed crystals and connect the process to real geodes.", "Seed crystals give dissolved alum a place to start building. Slow cooling and evaporation let larger crystals grow, which is similar to how geodes form in rock cavities over long periods.", "Ask the child to compare the crystals on day one and day three.", "A finished geode, daily drawings and a comparison with real geodes."],
  ["kinetic-sand-lab", "Explore how a mouldable material holds its shape.", "Oil coats the tiny flour particles and helps them stick together when squeezed, so the sand holds a shape until it is pushed apart.", "Ask the child which mould worked best and why they think it held its shape.", "Observations of moulded shapes and three describing words for the sand."],
  ["scented-dough-guess", "Use the sense of smell and descriptive language to identify scents.", "Smell is closely linked to memory, so familiar scents can be recognised but are often hard to name. Describing words help us share what we sense.", "Ask the child to describe a scent without naming it, using words like sweet or sharp.", "A score sheet of guesses and a list of describing words for each scent."],
  ["lego-gear-spinner", "Investigate how gear size affects speed and direction.", "When a large gear turns a small gear, the small gear spins faster but with less force. Meshing gears turn in opposite directions, and tooth counts give the ratio.", "Ask the child to predict the turns before counting and to link the result to tooth numbers.", "A recorded count of turns, arrows showing direction and a written explanation."],
  ["lego-earthquake-shake", "Design, test and improve a structure to resist shaking.", "Wide bases, bracing and keeping heavy parts low make structures more stable during earthquakes. Testing designs fairly shows which changes help.", "Ask the child which variable stayed the same between tests and why that matters.", "A results table for both designs and an explanation of the best improvement."],
  ["egg-drop-capsule", "Design and test a structure that reduces impact forces.", "Slowing a fall with drag or spreading the stopping time with cushioning reduces the force on the egg. Engineers use the same ideas in helmets and car crumple zones.", "Ask the child to explain how their capsule protects the egg before testing.", "Two sketches, test results at each height and an improvement explanation."],
  ["catapult-accuracy", "Adjust a variable to control the distance of a launched object.", "Bending the arm stores elastic energy, which is released as motion. Moving the pivot changes how much the arm bends and how far the pom-pom travels.", "Ask the child how they would hit a target at a new distance.", "Hit counts at three distances and written setup instructions for each target."],
  ["bark-rubbing-trees", "Observe and record features that help identify trees.", "Bark texture, leaf shape and tree size are clues for identification. Trunk size can hint at age, though growth rate varies between species.", "Ask the child which feature was most useful for telling trees apart.", "A booklet with rubbings, pressed leaves, measurements and identification attempts."],
  ["night-sounds-map", "Listen carefully and classify sounds in the local environment.", "Many animals are active at dawn and dusk. Mapping sounds by direction and distance builds careful observation and shows how environments change through the day.", "Ask the child to explain how they decided whether a sound was near or far.", "A sound map with a key, group totals and a comparison of two times of day."],
];
export const topUpAParentGuides: Record<string, ParentLearningGuide> = Object.fromEntries(teaching.map(([id, objective, explanation, parentPrompt, evidence]) => [id, { objective, explanation, parentPrompt, evidence }]));

const notes: [string, string, string, string][] = [
  ["red-cabbage-indicator", "Make the cabbage juice before the session and let it cool, and set out the test liquids in labelled cups on white paper.", "Lemon juice and vinegar turn pink, water stays purple, and bicarb soda and soapy water turn blue or green.", "Colours are faint: use more concentrated juice. Milk barely changes: that is expected because it is close to neutral."],
  ["butter-in-a-jar", "Take the cream out of the fridge 20 minutes before starting and choose a jar with a tight lid.", "The cream thickens after a few minutes, then suddenly separates into a yellow lump and thin buttermilk after about 10 to 15 minutes.", "Nothing happening: keep shaking, it changes quite suddenly. Jar leaking: tighten the lid or wrap it in a tea towel."],
  ["borax-snowflake", "An adult prepares the hot saturated solution, and the snowflake is shaped to fit the jar before mixing.", "By morning the pipe cleaner is covered in clear or coloured crystals with flat faces.", "No crystals: the solution was not saturated, so dissolve more borax next time. Snowflake stuck to the jar: hang it higher so it does not touch."],
  ["alum-crystal-geode", "Clean and dry the eggshells a day ahead and buy alum from the supermarket spice aisle.", "Small crystals appear after one day and grow larger over two to three days inside the shell.", "Crystals tiny: cool the solution more slowly by covering the cup. Shell floating: use a spoon to sink it gently or weigh it with a coin underneath."],
  ["kinetic-sand-lab", "Spread a sheet or work outside, and measure flour and oil before starting.", "Sand that feels soft and holds a squeezed shape, with simple moulds turning out cleanly.", "Too crumbly: add a little more oil. Too greasy: add more flour."],
  ["scented-dough-guess", "Make or buy plain playdough and set out the spices in small dishes.", "Most players guess cocoa and lemon, while vanilla and cinnamon can be harder to name.", "Scent too weak: knead in more spice. Player peeking: retie the blindfold."],
  ["lego-gear-spinner", "Gather Technic gears, axles and beams, and test that two gears mesh smoothly.", "A large gear turning a small one makes it spin several times per turn, and each extra gear reverses direction.", "Gears slipping: push axles closer so teeth mesh. Hard to count: use brighter flags."],
  ["lego-earthquake-shake", "Set up the tray and balls on a smooth floor and have plenty of bricks ready.", "Straight towers wobble and fall at medium or strong shaking; wider or braced designs last longer.", "Tray slides away: shake more gently or put the balls in a shallow box. Results vary: shake for the same time each test."],
  ["egg-drop-capsule", "Collect recycled materials over a week and choose a safe drop zone with a tarp.", "Most capsules survive 1 metre, and well-cushioned or parachute designs survive 2 metres or more.", "Egg breaks at low height: add cushioning around all sides. Capsule hard to open: build a lid with tape hinges."],
  ["catapult-accuracy", "Pre-count the pop sticks and rubber bands, and place paper plate targets at measured distances.", "Pom-poms travel 1 to 3 metres, and moving the stack changes distance in a predictable way.", "Catapult weak: tighten the cross band. Spoon falls off: use more tape."],
  ["bark-rubbing-trees", "Peel paper from crayons and pick four trees with clearly different bark nearby.", "Clear bark patterns, pressed leaves and trunk measurements for each tree.", "Rubbing blank: press harder and use the side of the crayon. Unsure of identification: note features and check a local guide later."],
  ["night-sounds-map", "Choose a safe outdoor spot, pack warm clothes and a torch, and start just before dusk.", "A map with ten or more sounds grouped into animals, people, machines and weather.", "Too few sounds: sit quietly for longer. Child scared: stay close and choose a well-lit spot."],
];
export const topUpARunbooks: Record<string, QuestRunbook> = Object.fromEntries(notes.map(([id, prepare, expected, troubleshoot]) => [id, { prepare, expected, troubleshoot }]));
