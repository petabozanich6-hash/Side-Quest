// Launch prices for the Side-Quest Shop (AUD, cents, GST inclusive), set once when the shop launches (9 Nov 2026).
// These are starting retail prices only: the owner can change any of them in Owner HQ → Shop → Products, and the
// launch step never overwrites a price, measurement or date the owner has already entered.
//
// Packed sizes are conservative estimates (product + packaging) so Australia Post can quote postage at checkout.
// Re-measure real parcels in Owner HQ once stock is in hand.

export type Size = "letter" | "s" | "ruler" | "m" | "tube" | "garment" | "hoodie" | "mug" | "l" | "xl" | "umbrella";
export const SIZES: Record<Size, { g: number; l: number; w: number; h: number }> = {
  letter: { g: 100, l: 24, w: 16, h: 1 },
  s: { g: 250, l: 22, w: 16, h: 4 },
  ruler: { g: 150, l: 34, w: 6, h: 2 },
  m: { g: 700, l: 32, w: 24, h: 6 },
  tube: { g: 400, l: 65, w: 10, h: 10 },
  garment: { g: 350, l: 30, w: 22, h: 4 },
  hoodie: { g: 800, l: 35, w: 28, h: 8 },
  mug: { g: 600, l: 16, w: 16, h: 14 },
  l: { g: 1500, l: 40, w: 30, h: 15 },
  xl: { g: 3000, l: 50, w: 40, h: 20 },
  umbrella: { g: 600, l: 70, w: 10, h: 10 },
};

/** Shown on every physical listing (the owner posts once a week). */
export const WEEKLY_DISPATCH = "Posted in our weekly dispatch. Shipping times may vary.";
export const DIGITAL_DELIVERY = "Download link emailed after payment.";
/** Monthly boxes and letter clubs: order by the 8th, posted around the 15th. */
export const SUB_CUTOFF_DAY = 8;
export const SUB_DISPATCH_DAY = 15;

/** Held back until the owner finishes them: never switched on by the launch step. */
export const HOLD_BACK_COLLECTIONS = new Set(["Educational books", "Printed Quest Books"]);
export const holdBack = (p: { collection?: string; title?: string; description?: string }) =>
  HOLD_BACK_COLLECTIONS.has(String(p.collection || "")) || /workbook/i.test(`${p.title || ""} ${p.description || ""}`);

const $ = (d: number) => Math.round(d * 100);
type Entry = { p: number; s: Size; v?: Record<string, number> };
const e = (dollars: number, s: Size, v?: Record<string, number>): Entry => ({ p: $(dollars), s, ...(v ? { v: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, $(x)])) } : {}) });

/** Price and packed size by product title. Use "Title|department" where two products share a title. */
export const LAUNCH_PRICES: Record<string, Entry> = {
  // ---- Books & Learning: personalised books
  "My First Side-Quest Storybook": e(29.95, "m"), "My Adventures with Ignis": e(29.95, "m"),
  "Personalised bedtime storybooks": e(34.95, "m"), "Choose Your Own Quest adventure books": e(19.95, "m"),
  "Personalised reading journals": e(19.95, "m"), "My First Science Journal": e(16.95, "m"),
  "Creative Writing Adventure Journals": e(16.95, "m"), "Personalised exercise books": e(9.95, "s"),
  "Subject-specific exercise books": e(6.95, "s"), "My Homeschool Year keepsake books": e(39.95, "m"),
  "Personalised achievement books": e(24.95, "m"), "My Big Book of Questions": e(19.95, "m"),
  // ---- Books & Learning: learning tools
  "Mini whiteboards and markers": e(14.95, "m"), "Magnetic letter sets": e(16.95, "m"), "Magnetic number sets": e(16.95, "m"),
  "Alphabet tiles": e(19.95, "m"), "Spelling tiles": e(19.95, "m"), "Sight-word flashcards": e(12.95, "s"),
  "Multiplication flashcards": e(12.95, "s"), "Fraction tiles and fraction circles": e(24.95, "m"), "Base-ten blocks": e(29.95, "l"),
  "Counting manipulatives": e(24.95, "l"), "Number lines": e(9.95, "tube"), "Maths dice": e(9.95, "s"), "Educational timers": e(19.95, "s"),
  "Visual routine cards": e(19.95, "s"), "Daily schedule boards": e(29.95, "m"), "Learning reward charts": e(9.95, "m"),
  "Reading trackers": e(7.95, "m"), "Reusable handwriting practice sheets": e(16.95, "m"), "Reading rulers and guides": e(8.95, "s"),
  "Magnetic learning boards": e(34.95, "l"), "Educational wall charts": e(14.95, "tube"),
  "World maps": e(14.95, "tube", { A3: 14.95, A2: 24.95, A1: 34.95 }),
  "Educational posters|books": e(9.95, "tube", { A4: 9.95, A3: 14.95, A2: 24.95 }),

  // ---- Stationery
  "Ignis ballpoint pens": e(7.95, "s"), "Gel pen sets": e(12.95, "s"), "Erasable pens": e(8.95, "s"), "Mechanical pencils": e(7.95, "s"),
  "Graphite pencil packs": e(6.95, "s"), "Coloured pencil sets": e(9.95, "s", { "12 colours": 9.95, "24 colours": 14.95, "36 colours": 19.95 }),
  "Highlighters": e(7.95, "s"), "Dual-tip markers": e(16.95, "s"), "Fineliners": e(12.95, "s"), "Crayons": e(6.95, "s"),
  "Erasers and novelty erasers": e(4.95, "s"), "Pencil sharpeners": e(4.95, "s"), "Personalised stationery sets": e(29.95, "m"),
  "A4 and A5 notebooks": e(6.95, "m"), "Spiral-bound notebooks": e(7.95, "m"), "Personalised name notebooks": e(14.95, "m"),
  "Subject exercise books": e(5.95, "m"), "Graph paper notebooks": e(6.95, "m"), "Dotted journals": e(16.95, "m"),
  "Sketchbooks": e(9.95, "m", { A5: 9.95, A4: 14.95, A3: 22.95 }), "Sticky notes": e(5.95, "s"), "Page markers": e(4.95, "s"),
  "Flashcard packs": e(6.95, "s"), "Index cards": e(4.95, "s"), "Memo pads": e(5.95, "s"), "Weekly planning pads": e(12.95, "m"),
  "Branded 15 cm and 30 cm rulers": e(4.95, "ruler", { "15 cm": 3.95, "30 cm": 4.95, Both: 7.95 }),
  "Geometry sets": e(12.95, "s"), "Protractors and compasses": e(8.95, "s"), "Pencil cases": e(14.95, "s"),
  "Personalised pencil tins": e(19.95, "s"), "Bookmarks": e(4.95, "letter"), "Scissors": e(5.95, "s"), "Glue sticks": e(4.95, "s"),
  "Washi tape": e(7.95, "s"), "Stickers": e(5.95, "letter"), "Personalised book labels": e(9.95, "letter"), "Name stickers": e(12.95, "letter"),
  "School supply starter packs": e(39.95, "l", { Junior: 39.95, Senior: 49.95 }),

  // ---- Science & Discovery
  "Beginner Science Experiment Kit": e(39.95, "l"), "Crystal Growing Kit": e(29.95, "l"), "Circuit Building Kit": e(49.95, "l"),
  "Magnetism Discovery Kit": e(34.95, "l"), "Solar System Model Kit": e(39.95, "l"), "Volcano Experiment Kit": e(29.95, "l"),
  "Weather Station Kit": e(44.95, "l"), "Water Cycle Experiment Kit": e(29.95, "l"), "Human Anatomy Learning Kit": e(49.95, "l"),
  "Plant Growing Kit": e(24.95, "l"), "Fossil Excavation Kit": e(29.95, "l"), "Rock and Mineral Collection Kit": e(39.95, "l"),
  "Microscope Discovery Kit": e(69.95, "l"), "Engineering Challenge Kit": e(49.95, "l"), "Simple Machines Kit": e(44.95, "l"),
  "Magnifying glasses": e(9.95, "s"), "Beginner binoculars": e(34.95, "m"), "Pocket microscopes": e(24.95, "s"), "Compasses": e(12.95, "s"),
  "Bug observation containers": e(14.95, "m"), "Nature collection journals": e(16.95, "m"), "Leaf pressing kits": e(24.95, "m"),
  "Weather observation journals": e(16.95, "m"), "Mini gardening kits": e(24.95, "l"), "Star observation guides": e(14.95, "m"),
  "Nature scavenger hunt cards": e(12.95, "s"),

  // ---- Arts, Crafts & Games
  "Watercolour painting sets": e(14.95, "m", { "12 colours": 14.95, "24 colours": 22.95 }),
  "Acrylic paint sets": e(16.95, "m", { "12 colours": 16.95, "24 colours": 26.95 }),
  "Paintbrush collections": e(14.95, "m"), "Drawing starter kits": e(29.95, "m"), "Sketching pencils": e(12.95, "s"),
  "Canvas painting kits": e(29.95, "l"), "Modelling clay sets": e(14.95, "m"), "Air-dry clay kits": e(24.95, "l"), "Origami kits": e(14.95, "m"),
  "Paper craft kits": e(19.95, "m"), "Friendship bracelet kits": e(16.95, "s"), "Sewing starter kits": e(29.95, "m"),
  "Cross-stitch starter kits": e(24.95, "m"), "Embroidery kits": e(24.95, "m"), "Scrapbooking kits": e(34.95, "l"),
  "Sticker-making kits": e(24.95, "m"), "Comic book creation kits": e(24.95, "m"), "DIY bookmark kits": e(14.95, "s"),
  "Make Your Own Dragon craft kits": e(24.95, "m"), "Creative Writing prompt card decks": e(19.95, "s"),
  "Side-Quest trivia card games": e(24.95, "s"), "Maths challenge cards": e(19.95, "s"), "Word-building games": e(24.95, "m"),
  "Spelling games": e(24.95, "m"), "Memory matching games": e(19.95, "m"), "Geography matching games": e(19.95, "m"),
  "History timeline card games": e(24.95, "s"), "Educational bingo sets": e(24.95, "m"), "Logic puzzle books": e(14.95, "m"),
  "Brain teaser decks": e(16.95, "s"), "Jigsaw puzzles": e(29.95, "l"), "Escape Room in a Box": e(39.95, "l"),
  "Mystery solving kits": e(34.95, "l"), "Treasure hunt adventure kits": e(34.95, "l"), "Family quiz night sets": e(29.95, "m"),
  "Storytelling dice": e(16.95, "s"), "Creative Writing prompt games": e(24.95, "m"), "Side-Quest original board game": e(49.95, "l"),
  "Fidget Tool Kit": e(29.95, "m"), "Sensory Putty & Therapy Dough": e(12.95, "s"), "Calm-Down Sensory Bottles": e(24.95, "l"),
  "Sensory Bin Kit": e(44.95, "l"), "Textured Sensory Cards": e(19.95, "s"), "Chewable Pencil Toppers & Necklaces": e(14.95, "s"),

  // ---- Clothing & Accessories
  "Ignis T-shirts": e(29.95, "garment"), "Personalised name T-shirts": e(34.95, "garment"), "Hoodies and jumpers": e(49.95, "hoodie"),
  "Crewneck sweatshirts": e(44.95, "hoodie"), "Tracksuit sets": e(64.95, "hoodie"), "Pyjama sets": e(39.95, "garment"),
  "Nighties": e(32.95, "garment"), "Dressing gowns": e(54.95, "hoodie"), "Onesies": e(44.95, "hoodie"), "Socks": e(12.95, "s"),
  "Beanies": e(24.95, "s"), "Caps and bucket hats": e(29.95, "garment"),
  "Homeschool Parent T-shirts": e(34.95, "garment"), "Parent hoodies": e(64.95, "hoodie"), "Oversized jumpers": e(69.95, "hoodie"),
  "Matching family T-shirts": e(32.95, "garment"), "Matching family hoodies": e(59.95, "hoodie"), "Adult pyjamas": e(54.95, "garment"),
  "Lounge sets": e(69.95, "hoodie"), "Wearable blanket hoodies": e(69.95, "xl"), "Slippers": e(34.95, "m"), "Bookish socks": e(14.95, "s"),
  "Aprons": e(29.95, "garment"), "Tote bags": e(24.95, "garment"), "Matching Grown-Up & Kid T-shirts": e(59.95, "hoodie"),
  "Side-Quest backpacks": e(59.95, "l"), "Personalised backpacks": e(69.95, "l"), "Book bags": e(24.95, "garment"),
  "Library bags": e(19.95, "garment"), "Drawstring gym bags": e(19.95, "garment"), "Canvas tote bags": e(24.95, "garment"),
  "Pencil pouches": e(14.95, "s"), "Laptop sleeves": e(39.95, "l", { "13 inch": 39.95, "15 inch": 44.95 }), "Tablet sleeves": e(34.95, "m"),
  "Drink bottles": e(24.95, "l"), "Insulated water bottles": e(39.95, "l"), "Lunchboxes": e(29.95, "l"), "Insulated lunch bags": e(29.95, "l"),
  "Snack containers": e(19.95, "m"), "Keyrings": e(12.95, "s"), "Bag tags": e(12.95, "s"), "Lanyards": e(9.95, "s"),
  "Iron-on clothing patches": e(7.95, "letter"), "Embroidered patches": e(9.95, "letter"),
  "Umbrellas": e(29.95, "umbrella", { Kids: 29.95, Adult: 39.95 }),

  // ---- Homewares & The Cosy Quest
  "Ignis fleece throw blankets": e(49.95, "xl"), "Sherpa throw blankets": e(69.95, "xl"), "Personalised name blankets": e(74.95, "xl"),
  "Reading blankets": e(59.95, "xl"), "Oversized wearable blankets": e(79.95, "xl"), "Decorative cushions": e(39.95, "xl"),
  "Personalised cushion covers": e(34.95, "garment"), "Floor cushions": e(79.95, "xl"), "Reading nook mats": e(89.95, "xl"),
  "Soft plush toys": e(34.95, "l"), "Ceramic mugs": e(22.95, "mug"), "Personalised mugs": e(27.95, "mug"), "Travel coffee mugs": e(32.95, "mug"),
  "Insulated tumblers": e(39.95, "mug"), "Coasters": e(19.95, "s"), "Fridge magnets": e(7.95, "letter"),
  "Decorative wall prints": e(19.95, "tube", { A4: 19.95, A3: 29.95 }), "Book-themed artwork": e(19.95, "tube", { A4: 19.95, A3: 29.95 }),
  "Reusable shopping bags": e(12.95, "garment"), "Storage baskets": e(34.95, "l"), "Bookends": e(34.95, "l"), "Desk organisers": e(29.95, "l"),
  "Weighted Lap Pad": e(49.95, "xl", { Small: 49.95, Medium: 59.95 }), "Noise-Reducing Earmuffs (kids)": e(29.95, "m"),
  "Wobble Cushion": e(34.95, "l"), "Calm Corner Kit": e(79.95, "xl"), "Sensory Light-Up Toys": e(19.95, "m"),

  // ---- The Parent Survival Collection
  "The Chaos Coordinator Planner": e(39.95, "m"), "Homeschool Parent Daily Planner": e(39.95, "m"), "Parent Survival Journal": e(29.95, "m"),
  "Weekly Desk Planner": e(24.95, "m"), "Family Organisation Binder": e(44.95, "l"), "Household Budget Planner": e(29.95, "m"),
  "Reading Journals": e(24.95, "m"), "Book Review Journals": e(22.95, "m"), "Self-Care Journals": e(24.95, "m"),
  "Fancy Pen Gift Sets": e(39.95, "s"), "Parent Coffee Mugs": e(24.95, "mug"), "Insulated Coffee Tumblers": e(39.95, "mug"),
  "Bookish Bookmarks": e(6.95, "letter"), "Reading Lights": e(24.95, "s"), "Book Sleeves": e(29.95, "m"), "Book Stands": e(34.95, "l"),
  "Desk Accessories": e(29.95, "m"), "Parent Survival Gift Sets": e(79.95, "l"), "Cosy Reading Night Packs": e(69.95, "xl"),
  "Parent Hoodies and T-shirts": e(49.95, "hoodie"), "Funny Homeschool Fridge Magnets": e(7.95, "letter"),
  "Mother's Day Gifts": e(49.95, "l"), "Father's Day Gifts": e(49.95, "l"),
  "Homeschool Grown-Up T-shirts": e(34.95, "garment"), "Homeschool Grown-Up Hoodies": e(64.95, "hoodie"),
  "Grown-Up Coffee Mugs": e(24.95, "mug"), "Grown-Up Insulated Tumblers": e(39.95, "mug"), "Grown-Up Gift Sets": e(69.95, "l"),
  "Grown-Up Joke Card Deck": e(16.95, "s"), "Grandparents & Carers Homeschool Helper Planner": e(34.95, "m"),

  // ---- Ignis Gifts & Collectibles
  "Ignis plush dragon": e(39.95, "l"), "Mini Ignis plush keyring": e(16.95, "s"), "Ignis figurines": e(24.95, "m"),
  "Dragon character pins": e(12.95, "letter"), "Collectible enamel pins": e(14.95, "letter"), "Character sticker sheets": e(6.95, "letter"),
  "Collectible destination badges": e(9.95, "letter"), "Achievement badges": e(9.95, "letter"), "Iron-on patches": e(7.95, "letter"),
  "Character bookmarks": e(5.95, "letter"), "Dragon magnets": e(7.95, "letter"), "Personalised name plaques": e(44.95, "l"),
  "Birthday gift boxes": e(59.95, "l"), "Achievement celebration packs": e(29.95, "m"), "Personalised certificates": e(12.95, "m"),
  "Reward token sets": e(19.95, "s"), "Mystery Dragon Packs": e(29.95, "m"), "Limited-edition seasonal collectibles": e(34.95, "m"),
  "Homeschool Graduation Keepsakes": e(49.95, "l"), "Limited-edition Ignis Christmas Plush": e(44.95, "l"),
  "The Side-Quest Adventure Chest": e(129.95, "xl"), "The Side-Quest Achievement Wall": e(69.95, "l"),
  "Growing Up Care Box (Girls)": e(49.95, "l"), "Growing Up Care Box (Boys)": e(49.95, "l"),

  // ---- Dragon Post (monthly price for letter clubs; one-off letters are a single price)
  "Ignis Travels the World": e(14.95, "letter"), "Ignis Travels Through Time": e(14.95, "letter"),
  "Ignis's Science Expeditions": e(14.95, "letter"), "The Dragon Mystery Mail Club": e(14.95, "letter"),
  "Ignis's Magical Adventures": e(14.95, "letter"), "World Wonders Postcard Club": e(9.95, "letter"),
  "The Young Explorer Mail Club": e(14.95, "letter"), "The Bookish Dragon Letter Club": e(14.95, "letter"),
  "Birthday Letter from Ignis": e(14.95, "letter"), "Christmas Letter from Ignis": e(14.95, "letter"),
  "Santa's Special Delivery": e(19.95, "letter"), "First Day of Homeschool Letter": e(12.95, "letter"),
  "Congratulations Letter": e(12.95, "letter"), "You're a Reading Superstar Letter": e(12.95, "letter"),
  "Achievement Celebration Letter": e(12.95, "letter"), "Welcome to Side-Quest Letter": e(12.95, "letter"),
  "Mystery Treasure Map Letter": e(16.95, "letter"), "Get Well Soon Letter": e(12.95, "letter"),
  "Celebration Letter from Ignis for a Grown-Up": e(14.95, "letter"),
  "The Bookish Post": e(14.95, "letter"), "Letters from the Dragon's Library": e(14.95, "letter"),
  "The Parent Pep-Talk Post": e(12.95, "letter"), "Monthly Mystery Letter": e(14.95, "letter"),
  "Seasonal Cosy Correspondence": e(16.95, "letter"), "Christmas Letters from Ignis": e(14.95, "letter"),
  "Personalised Birthday Letters": e(14.95, "letter"),
  "Adventure Passport": e(9.95, "letter"), "Wall map for Ignis Travels the World": e(14.95, "tube", { A3: 14.95, A2: 24.95 }),
  "Collectible postcard album": e(19.95, "m"), "Destination sticker book": e(12.95, "m"),

  // ---- The Monthly Quest (monthly price; a one-off box costs $10 more)
  "The Stationery Quest": e(39.95, "l"), "The Discovery Quest Box": e(49.95, "l"), "The Creative Quest Box": e(44.95, "l"),
  "The Reading Quest Box": e(39.95, "l"), "The Kids' Book Box": e(39.95, "l"), "The Parent Survival Box": e(54.95, "l"),
  "The Cosy Quest Box": e(59.95, "l"), "The Young Adventurer Box (younger children)": e(44.95, "l"), "The Teen Adventurer Box": e(49.95, "l"),
  "The Family Quest Box": e(69.95, "l"), "The Writing Quest Box": e(39.95, "l"), "The Maths Quest Box": e(39.95, "l"),
  "The Nature Explorer Box": e(44.95, "l"), "The History Detective Box": e(44.95, "l"), "The World Traveller Box": e(44.95, "l"),
  "The Little Artist Box": e(39.95, "l"), "The Seasonal Surprise Box": e(49.95, "l"), "The Ignis Collectors Club": e(34.95, "l"),
  "Christmas Quest Boxes": e(59.95, "l"), "Christmas Eve Adventure Boxes": e(54.95, "l"), "Birthday Quest Boxes": e(54.95, "l"),
  "The Sensory Quest Box": e(49.95, "l"),

  // ---- Bundles & Learning Kits (bundles containing workbooks are held back with the workbooks)
  "English Learning Starter Pack": e(49.95, "l"), "Science Experiment Starter Pack": e(59.95, "l"), "Art Supplies Starter Pack": e(59.95, "l"),
  "Nature Exploration Pack": e(54.95, "l"), "Exam Preparation Kit": e(49.95, "l"), "Reading Corner Starter Kit": e(89.95, "xl"),
  "Homeschool Organisation Pack": e(59.95, "l"), "Family Learning Night Pack": e(49.95, "l"), "Personalised Back-to-School Pack": e(64.95, "l"),
  "Grown-Up & Kid Building Project Kit": e(59.95, "l"), "Grown-Up & Kid Outdoor Adventure Pack": e(54.95, "l"),
  "Easter Adventure Kits": e(34.95, "l"), "Halloween Mystery Quest Kits": e(34.95, "l"), "Winter Cosy Quest Bundles": e(69.95, "xl"),
  "Summer Nature Explorer Packs": e(49.95, "l"), "Back-to-School Packs": e(39.95, "l", { Junior: 39.95, Middle: 44.95, Senior: 49.95 }),
  "End-of-Year Celebration Packs": e(39.95, "l"), "The Reading Nook Kit": e(149.95, "xl"), "The Explorer's Field Kit": e(89.95, "l"),
  "Matching Family Christmas Pyjamas": e(49.95, "garment"),
  // Bundles that currently list workbooks (held back unless the owner rewrites their description):
  "My First Homeschool Starter Kit": e(89.95, "l"), "Year 1 Learning Essentials Pack": e(69.95, "l"), "Year 2 Learning Essentials Pack": e(69.95, "l"),
  "Year 3 Learning Essentials Pack": e(69.95, "l"), "Year 4 Learning Essentials Pack": e(69.95, "l"), "Year 5 Learning Essentials Pack": e(69.95, "l"),
  "Year 6 Learning Essentials Pack": e(69.95, "l"), "Year 7–8 Study Essentials Pack": e(79.95, "l"), "Year 9–10 Study Essentials Pack": e(79.95, "l"),
  "Mathematics Learning Starter Pack": e(49.95, "l"), "Creative Writing Starter Pack": e(44.95, "l"), "Geography Explorer Pack": e(49.95, "l"),

  // ---- Digital products
  "Printable lesson books": e(9.95, "letter"), "Individual downloadable lessons": e(2.95, "letter"), "Complete curriculum bundles": e(49.95, "letter"),
  "Printable activity packs": e(7.95, "letter"), "Digital planners": e(14.95, "letter"), "Digital homeschool timetables": e(6.95, "letter"),
  "Printable reward charts": e(4.95, "letter"), "Educational posters|digital": e(4.95, "letter"), "Printable flashcards": e(5.95, "letter"),
  "Printable games": e(7.95, "letter"), "Digital escape room adventures": e(9.95, "letter"), "Personalised digital storybooks": e(14.95, "letter"),
  "Printable birthday cards": e(3.95, "letter"), "Digital Dragon Post subscriptions": e(6.95, "letter"),
  "Digital achievement certificates": e(3.95, "letter"), "Interactive scavenger hunts": e(6.95, "letter"),
  "Printable creative writing journals": e(7.95, "letter"), "Study trackers": e(4.95, "letter"), "Reading challenge packs": e(5.95, "letter"),
  "Printable colouring books": e(6.95, "letter"), "Holiday learning packs": e(9.95, "letter"), "Monthly printable activity clubs": e(9.95, "letter"),
  "Printable Celebration Cards for Grown-Ups": e(3.95, "letter"), "Talking About Growing Up: Parent Guide (printable)": e(9.95, "letter"),
  "Feelings & Regulation Visual Cards (printable)": e(6.95, "letter"), "Sensory Break Activity Cards (printable)": e(6.95, "letter"),
};

/** The launch entry for a product (by "Title|department" first, then title), or null if it has none. */
export function launchEntry(p: { title: string; department: string }): Entry | null {
  return LAUNCH_PRICES[`${p.title}|${p.department}`] || LAUNCH_PRICES[p.title] || null;
}
/** A box or letter club bought once costs a bit more than one month of the subscription. */
export const oneOffFor = (monthlyCents: number, fulfilment: string) => monthlyCents + (fulfilment === "subscription_box" ? 1000 : 300);
