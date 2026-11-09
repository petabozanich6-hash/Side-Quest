// Development stages for shop products: what can launch now, what waits for professional manufacturing, and what is
// a future expansion. A stage is a planning label, separate from the product's shop status: nothing here publishes
// a product. Products outside "Launch Now" can't be sold as in stock or made to order (pre-orders are allowed, to
// gauge demand or fund a production run).

export const STAGES = ["launch_now", "pro_manufacturing", "future"] as const;
export type Stage = (typeof STAGES)[number];
export const STAGE_LABELS: Record<Stage, string> = {
  launch_now: "Launch Now",
  pro_manufacturing: "Professional Manufacturing Later",
  future: "Future Expansion",
};

const L: Stage = "launch_now";
const P: Stage = "pro_manufacturing";
const F: Stage = "future";

/** The owner's six already-planned creative and art supply products. */
export const PLANNED_ART_SUPPLIES = ["Watercolour painting sets", "Acrylic paint sets", "Paintbrush collections", "Drawing starter kits", "Sketching pencils", "Modelling clay sets"];

/** The stage for every product in the original catalogue and later additions, by title (the reconciliation list). */
export const STAGE_BY_TITLE: Record<string, Stage> = {
  // ---- Books & Learning
  "Printed Quest Book": L, "Printed Quest Book + Lesson Pack": L,
  "Side-Quest English workbooks (by year level)": L, "Side-Quest Mathematics workbooks": L, "Science workbooks": L,
  "History and Geography workbooks": L, "Creative Writing workbooks": L, "Reading Comprehension books": L,
  "Handwriting practice books": L, "Spelling and Vocabulary books": L, "Grammar and Punctuation books": L,
  "Study Skills and Revision guides": L, "Educational colouring books": L, "Holiday learning activity books": L,
  "Complete year-level workbook bundles": L,
  "My First Side-Quest Storybook": L, "My Adventures with Ignis": L, "Personalised bedtime storybooks": L,
  "Choose Your Own Quest adventure books": L, "Personalised reading journals": L, "My First Science Journal": L,
  "Creative Writing Adventure Journals": L, "Personalised exercise books": L, "Subject-specific exercise books": L,
  "My Homeschool Year keepsake books": P, "Personalised achievement books": L, "My Big Book of Questions": L,
  "Mini whiteboards and markers": F, "Magnetic letter sets": F, "Magnetic number sets": F, "Alphabet tiles": P,
  "Spelling tiles": P, "Sight-word flashcards": P, "Multiplication flashcards": P, "Fraction tiles and fraction circles": F,
  "Base-ten blocks": F, "Counting manipulatives": F, "Number lines": L, "Maths dice": P, "Educational timers": F,
  "Visual routine cards": P, "Daily schedule boards": P, "Learning reward charts": L, "Reading trackers": L,
  "Reusable handwriting practice sheets": P, "Reading rulers and guides": P, "Magnetic learning boards": F,
  "Educational wall charts": L, "World maps": L, "Educational posters": L,

  // ---- Stationery & School Supplies
  "Ignis ballpoint pens": P, "Gel pen sets": L, "Erasable pens": L, "Mechanical pencils": L, "Graphite pencil packs": L,
  "Coloured pencil sets": L, "Highlighters": L, "Dual-tip markers": L, "Fineliners": L, "Crayons": L,
  "Erasers and novelty erasers": L, "Pencil sharpeners": L, "Personalised stationery sets": L,
  "A4 and A5 notebooks": L, "Spiral-bound notebooks": L, "Personalised name notebooks": L, "Subject exercise books": L,
  "Graph paper notebooks": L, "Dotted journals": L, "Sketchbooks": L, "Sticky notes": P, "Page markers": P,
  "Flashcard packs": L, "Index cards": L, "Memo pads": L, "Weekly planning pads": L,
  "Branded 15 cm and 30 cm rulers": P, "Geometry sets": L, "Protractors and compasses": L, "Pencil cases": P,
  "Personalised pencil tins": P, "Bookmarks": L, "Scissors": L, "Glue sticks": L, "Washi tape": L, "Stickers": L,
  "Personalised book labels": L, "Name stickers": L, "School supply starter packs": L,

  // ---- Science & Discovery
  "Beginner Science Experiment Kit": L, "Crystal Growing Kit": L, "Circuit Building Kit": F, "Magnetism Discovery Kit": F,
  "Solar System Model Kit": P, "Volcano Experiment Kit": L, "Weather Station Kit": F, "Water Cycle Experiment Kit": L,
  "Human Anatomy Learning Kit": F, "Plant Growing Kit": L, "Fossil Excavation Kit": P, "Rock and Mineral Collection Kit": F,
  "Microscope Discovery Kit": F, "Engineering Challenge Kit": F, "Simple Machines Kit": F,
  "Magnifying glasses": F, "Beginner binoculars": F, "Pocket microscopes": F, "Compasses": F, "Bug observation containers": F,
  "Nature collection journals": L, "Leaf pressing kits": L, "Weather observation journals": L, "Mini gardening kits": L,
  "Star observation guides": L, "Nature scavenger hunt cards": P,

  // ---- Arts, Crafts & Games
  "Watercolour painting sets": L, "Acrylic paint sets": L, "Paintbrush collections": L, "Drawing starter kits": L,
  "Sketching pencils": L, "Modelling clay sets": L,
  "Canvas painting kits": P, "Air-dry clay kits": P, "Origami kits": P, "Paper craft kits": P, "Friendship bracelet kits": P,
  "Sewing starter kits": P, "Cross-stitch starter kits": P, "Embroidery kits": P, "Scrapbooking kits": P,
  "Sticker-making kits": P, "Comic book creation kits": P, "DIY bookmark kits": P, "Make Your Own Dragon craft kits": P,
  "Creative Writing prompt card decks": P,
  "Side-Quest trivia card games": P, "Maths challenge cards": P, "Word-building games": P, "Spelling games": P,
  "Memory matching games": P, "Geography matching games": P, "History timeline card games": P, "Educational bingo sets": P,
  "Logic puzzle books": L, "Brain teaser decks": P, "Jigsaw puzzles": P, "Escape Room in a Box": P, "Mystery solving kits": P,
  "Treasure hunt adventure kits": P, "Family quiz night sets": P, "Storytelling dice": P, "Creative Writing prompt games": P,
  "Side-Quest original board game": F,
  "Fidget Tool Kit": F, "Sensory Putty & Therapy Dough": F, "Calm-Down Sensory Bottles": F, "Sensory Bin Kit": F,
  "Textured Sensory Cards": P, "Chewable Pencil Toppers & Necklaces": F,

  // ---- Clothing & Accessories (print-on-demand T-shirts launch; the rest of the range waits)
  "Ignis T-shirts": L, "Personalised name T-shirts": L, "Hoodies and jumpers": F, "Crewneck sweatshirts": F,
  "Tracksuit sets": F, "Pyjama sets": F, "Nighties": F, "Dressing gowns": F, "Onesies": F, "Socks": F, "Beanies": F,
  "Caps and bucket hats": F,
  "Homeschool Parent T-shirts": L, "Parent hoodies": F, "Oversized jumpers": F, "Matching family T-shirts": L,
  "Matching family hoodies": F, "Adult pyjamas": F, "Lounge sets": F, "Wearable blanket hoodies": F, "Slippers": F,
  "Bookish socks": F, "Aprons": F, "Tote bags": F, "Matching Grown-Up & Kid T-shirts": L,
  "Side-Quest backpacks": F, "Personalised backpacks": F, "Book bags": F, "Library bags": F, "Drawstring gym bags": F,
  "Canvas tote bags": F, "Pencil pouches": F, "Laptop sleeves": F, "Tablet sleeves": F, "Drink bottles": F,
  "Insulated water bottles": F, "Lunchboxes": F, "Insulated lunch bags": F, "Snack containers": F, "Keyrings": P,
  "Bag tags": P, "Lanyards": P, "Iron-on clothing patches": P, "Embroidered patches": P, "Umbrellas": F,
  "Matching Family Christmas Pyjamas": F,

  // ---- Homewares & The Cosy Quest
  "Ignis fleece throw blankets": F, "Sherpa throw blankets": F, "Personalised name blankets": F, "Reading blankets": F,
  "Oversized wearable blankets": F, "Decorative cushions": F, "Personalised cushion covers": F, "Floor cushions": F,
  "Reading nook mats": F, "Soft plush toys": F,
  "Ceramic mugs": F, "Personalised mugs": F, "Travel coffee mugs": F, "Insulated tumblers": F, "Coasters": F,
  "Fridge magnets": P, "Decorative wall prints": L, "Book-themed artwork": L, "Reusable shopping bags": F,
  "Storage baskets": F, "Bookends": F, "Desk organisers": F,
  "Weighted Lap Pad": F, "Noise-Reducing Earmuffs (kids)": F, "Wobble Cushion": F, "Calm Corner Kit": F, "Sensory Light-Up Toys": F,

  // ---- The Parent Survival Collection
  "The Chaos Coordinator Planner": L, "Homeschool Parent Daily Planner": L, "Parent Survival Journal": L,
  "Weekly Desk Planner": L, "Family Organisation Binder": L, "Household Budget Planner": L, "Reading Journals": L,
  "Book Review Journals": L, "Self-Care Journals": L, "Fancy Pen Gift Sets": P, "Parent Coffee Mugs": F,
  "Insulated Coffee Tumblers": F, "Bookish Bookmarks": L, "Reading Lights": F, "Book Sleeves": F, "Book Stands": F,
  "Desk Accessories": F, "Parent Survival Gift Sets": F, "Cosy Reading Night Packs": F, "Parent Hoodies and T-shirts": F,
  "Funny Homeschool Fridge Magnets": P, "Mother's Day Gifts": F, "Father's Day Gifts": F,
  "Homeschool Grown-Up T-shirts": L, "Homeschool Grown-Up Hoodies": F, "Grown-Up Coffee Mugs": F,
  "Grown-Up Insulated Tumblers": F, "Grown-Up Gift Sets": F, "Grown-Up Joke Card Deck": P,
  "Grandparents & Carers Homeschool Helper Planner": L,

  // ---- Ignis Gifts & Collectibles
  "Ignis plush dragon": F, "Mini Ignis plush keyring": F, "Ignis figurines": F, "Dragon character pins": P,
  "Collectible enamel pins": P, "Character sticker sheets": L, "Collectible destination badges": P, "Achievement badges": P,
  "Iron-on patches": P, "Character bookmarks": L, "Dragon magnets": P, "Personalised name plaques": F,
  "Birthday gift boxes": F, "Achievement celebration packs": L, "Personalised certificates": L, "Reward token sets": P,
  "Mystery Dragon Packs": F, "Limited-edition seasonal collectibles": F, "Homeschool Graduation Keepsakes": F,
  "Limited-edition Ignis Christmas Plush": F, "The Side-Quest Adventure Chest": F, "The Side-Quest Achievement Wall": F,
  "Growing Up Care Box (Girls)": L, "Growing Up Care Box (Boys)": L,

  // ---- Dragon Post (written, printed and posted at home)
  "Ignis Travels the World": L, "Ignis Travels Through Time": L, "Ignis's Science Expeditions": L,
  "The Dragon Mystery Mail Club": L, "Ignis's Magical Adventures": L, "World Wonders Postcard Club": L,
  "The Young Explorer Mail Club": L, "The Bookish Dragon Letter Club": L,
  "Birthday Letter from Ignis": L, "Christmas Letter from Ignis": L, "Santa's Special Delivery": L,
  "First Day of Homeschool Letter": L, "Congratulations Letter": L, "You're a Reading Superstar Letter": L,
  "Achievement Celebration Letter": L, "Welcome to Side-Quest Letter": L, "Mystery Treasure Map Letter": L,
  "Get Well Soon Letter": L, "Celebration Letter from Ignis for a Grown-Up": L,
  "The Bookish Post": L, "Letters from the Dragon's Library": L, "The Parent Pep-Talk Post": L, "Monthly Mystery Letter": L,
  "Seasonal Cosy Correspondence": L, "Christmas Letters from Ignis": L, "Personalised Birthday Letters": L,
  "Adventure Passport": L, "Wall map for Ignis Travels the World": L, "Collectible postcard album": P,
  "Destination sticker book": L,

  // ---- Bundles & Learning Kits (bundles of launch products launch; bundles that rely on later products wait)
  "My First Homeschool Starter Kit": L, "Year 1 Learning Essentials Pack": L, "Year 2 Learning Essentials Pack": L,
  "Year 3 Learning Essentials Pack": L, "Year 4 Learning Essentials Pack": L, "Year 5 Learning Essentials Pack": L,
  "Year 6 Learning Essentials Pack": L, "Year 7–8 Study Essentials Pack": L, "Year 9–10 Study Essentials Pack": L,
  "English Learning Starter Pack": L, "Mathematics Learning Starter Pack": L, "Science Experiment Starter Pack": L,
  "Creative Writing Starter Pack": L, "Art Supplies Starter Pack": L, "Geography Explorer Pack": L,
  "Nature Exploration Pack": F, "Exam Preparation Kit": L, "Reading Corner Starter Kit": F,
  "Homeschool Organisation Pack": L, "Family Learning Night Pack": P, "Personalised Back-to-School Pack": L,
  "Grown-Up & Kid Building Project Kit": F, "Grown-Up & Kid Outdoor Adventure Pack": F,
  "Easter Adventure Kits": L, "Halloween Mystery Quest Kits": L, "Winter Cosy Quest Bundles": F,
  "Summer Nature Explorer Packs": F, "Back-to-School Packs": L, "End-of-Year Celebration Packs": L,
  "The Reading Nook Kit": F, "The Explorer's Field Kit": F,
  // ---- The Monthly Quest: every subscription box launches now (one-off and monthly)
  "The Stationery Quest": L, "The Discovery Quest Box": L, "The Creative Quest Box": L, "The Reading Quest Box": L,
  "The Kids' Book Box": L, "The Parent Survival Box": L, "The Cosy Quest Box": L,
  "The Young Adventurer Box (younger children)": L, "The Teen Adventurer Box": L, "The Family Quest Box": L,
  "The Writing Quest Box": L, "The Maths Quest Box": L, "The Nature Explorer Box": L, "The History Detective Box": L,
  "The World Traveller Box": L, "The Little Artist Box": L, "The Seasonal Surprise Box": L,
  "The Ignis Collectors Club": L, "Christmas Quest Boxes": L, "Christmas Eve Adventure Boxes": L,
  "Birthday Quest Boxes": L, "The Sensory Quest Box": L,

  // ---- Digital products (delivered through the platform)
  "Printable lesson books": L, "Individual downloadable lessons": L, "Complete curriculum bundles": L,
  "Printable activity packs": L, "Digital planners": L, "Digital homeschool timetables": L,
  "Printable reward charts": L, "Printable flashcards": L, "Printable games": L, "Digital escape room adventures": L,
  "Personalised digital storybooks": L, "Printable birthday cards": L, "Digital Dragon Post subscriptions": L,
  "Digital achievement certificates": L, "Interactive scavenger hunts": L, "Printable creative writing journals": L,
  "Study trackers": L, "Reading challenge packs": L, "Printable colouring books": L, "Holiday learning packs": L,
  "Monthly printable activity clubs": L, "Printable Celebration Cards for Grown-Ups": L,
  "Talking About Growing Up: Parent Guide (printable)": L, "Feelings & Regulation Visual Cards (printable)": L,
  "Sensory Break Activity Cards (printable)": L,
};

/** Stage for a product: the reconciliation list first, then sensible defaults by kind of product. */
export function stageFor(p: { title?: string; department?: string; fulfilment?: string }): Stage {
  const known = STAGE_BY_TITLE[String(p.title || "")];
  if (known) return known;
  // Every monthly box, Dragon Post letter and digital product launches now.
  if (p.department === "boxes" || p.department === "dragon-post" || p.department === "digital") return L;
  if (p.fulfilment === "digital" || p.fulfilment === "subscription_box" || p.fulfilment === "postal_subscription") return L;
  // Anything else not on the list waits until the owner reviews it.
  return F;
}

/** True when a product isn't on the reconciliation list, so its stage came from the defaults. */
export const stageIsDefault = (title: string) => !(title in STAGE_BY_TITLE);
