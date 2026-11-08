export const MAX_WORN = 3;

export const PACKS: Record<string, { label: string; month?: number; blurb?: string; prizes: Array<[string, string, string]> }> = {
  halloween: { label: "Halloween", prizes: [
    ["Pumpkin hat", "🎃", "head"], ["Spooky cap", "🧢", "head"], ["Spooky shades", "🕶️", "face"],
    ["Cobweb scarf", "🕸️", "neck"], ["Bone necklace", "🦴", "neck"], ["Spider brooch", "🕷️", "chest"],
    ["Crystal charm", "🔮", "chest"], ["Friendly ghost", "👻", "left"], ["Candy sack", "🍬", "right"],
    ["Bat wings", "🦇", "ears"], ["Witch boots", "🥾", "feet"], ["Moon stickers", "🌙", "cheeks"],
  ] },
  christmas: { label: "Christmas", prizes: [
    ["Tree hat", "🎄", "head"], ["Bright star", "🌟", "head"], ["Snow goggles", "🥽", "face"],
    ["Cosy scarf", "🧣", "neck"], ["Jingle collar", "🔔", "neck"], ["Gingerbread badge", "🍪", "chest"],
    ["Candle brooch", "🕯️", "chest"], ["Wrapped present", "🎁", "left"], ["Snowman friend", "⛄", "right"],
    ["Snowflake studs", "❄️", "ears"], ["Ice skates", "⛸️", "feet"], ["Candy cheeks", "🍭", "cheeks"],
  ] },
  new_year: { label: "New Year", prizes: [
    ["Party popper", "🎉", "right"], ["Top hat", "🎩", "head"], ["Glitter halo", "✨", "head"],
    ["Party mask", "🎭", "face"], ["Confetti scarf", "🎊", "neck"], ["Streamer bow", "🎀", "neck"],
    ["Midnight clock", "🕛", "chest"], ["Sparkle brooch", "💫", "chest"], ["Sparkler", "🎇", "left"],
    ["Fireworks studs", "🎆", "ears"], ["Dancing shoes", "👟", "feet"], ["Star stickers", "🌠", "cheeks"],
  ] },
  easter: { label: "Easter", prizes: [
    ["Bunny ears", "🐰", "head"], ["Tulip crown", "🌷", "head"], ["Round specs", "👓", "face"],
    ["Daisy chain", "🌼", "neck"], ["Leaf collar", "🌿", "neck"], ["Chocolate medal", "🍫", "chest"],
    ["Rainbow badge", "🌈", "chest"], ["Egg basket", "🧺", "left"], ["Painted egg", "🥚", "right"],
    ["Butterfly wings", "🦋", "ears"], ["Garden boots", "👢", "feet"], ["Ladybird stickers", "🐞", "cheeks"],
  ] },
  lunar_new_year: { label: "Lunar New Year", prizes: [
    ["Red envelope", "🧧", "right"], ["Lion hat", "🦁", "head"], ["Bamboo crown", "🎍", "head"],
    ["Lucky shades", "😎", "face"], ["Lucky coin necklace", "🪙", "neck"], ["Red ribbon", "🎗️", "neck"],
    ["Dumpling", "🥟", "chest"], ["Lucky mandarin", "🍊", "chest"], ["Paper lantern", "🏮", "left"],
    ["Fortune stickers", "🥠", "cheeks"], ["Plum blossom studs", "🌸", "ears"], ["Dragon slippers", "🐉", "feet"],
  ] },
  birthday: { label: "Child birthday", prizes: [
    ["Birthday cake", "🎂", "left"], ["Birthday crown", "👑", "head"], ["Party balloon", "🎈", "head"],
    ["Party face", "🥳", "face"], ["Winner's medal", "🏅", "neck"], ["Yarn scarf", "🧶", "neck"],
    ["Cupcake", "🧁", "chest"], ["Golden trophy", "🏆", "chest"], ["Ice cream", "🍦", "right"],
    ["Music notes", "🎵", "ears"], ["Party shoes", "🩰", "feet"], ["Strawberry cheeks", "🍓", "cheeks"],
  ] },
  // Monthly themes: each runs for its whole month, every year, once switched on. Slots: head x2, face, neck x2,
  // chest x2, left, right, ears, feet, cheeks. Holidays above take priority for room decorations in the same month.
  jan_summer: { label: "Summer Beach Days", month: 1, blurb: "Summer holidays at the beach", prizes: [
    ["Sun hat", "👒", "head"], ["Crab crown", "🦀", "head"], ["Cool sunnies", "🕶️", "face"],
    ["Shell necklace", "🐚", "neck"], ["Flower lei", "🌺", "neck"], ["Coral brooch", "🪸", "chest"],
    ["Surfer badge", "🏄", "chest"], ["Ice block", "🍧", "left"], ["Bucket and spade", "🪣", "right"],
    ["Wave studs", "🌊", "ears"], ["Thongs", "🩴", "feet"], ["Sunscreen stripes", "🧴", "cheeks"],
  ] },
  feb_friendship: { label: "Friendship and Kindness", month: 2, blurb: "Back to school and being a good friend", prizes: [
    ["Heart headband", "💖", "head"], ["School cap", "🧢", "head"], ["Smart specs", "👓", "face"],
    ["Friendship bracelet", "📿", "neck"], ["Kindness bow", "🎀", "neck"], ["Kind-words badge", "💌", "chest"],
    ["Gold star", "⭐", "chest"], ["Sharp pencil", "✏️", "left"], ["Lunchbox apple", "🍎", "right"],
    ["Heart studs", "💕", "ears"], ["School shoes", "👞", "feet"], ["Rosy hearts", "💗", "cheeks"],
  ] },
  mar_harmony: { label: "Harmony and Earth Helpers", month: 3, blurb: "Harmony Week and Clean Up Australia Day", prizes: [
    ["Earth hat", "🌏", "head"], ["Recycling cap", "♻️", "head"], ["Happy face", "😊", "face"],
    ["Orange ribbon", "🧡", "neck"], ["Helping hands", "🤝", "neck"], ["World badge", "🌍", "chest"],
    ["Seedling brooch", "🌱", "chest"], ["Litter bag", "🛍️", "left"], ["Pot plant", "🪴", "right"],
    ["Leaf studs", "🍃", "ears"], ["Gumboots", "🥾", "feet"], ["Rainbow cheeks", "🌈", "cheeks"],
  ] },
  apr_autumn: { label: "Autumn Leaves", month: 4, blurb: "Crunchy leaves and cosy autumn days", prizes: [
    ["Acorn cap", "🌰", "head"], ["Mushroom hat", "🍄", "head"], ["Owl specs", "🦉", "face"],
    ["Leaf scarf", "🍂", "neck"], ["Maple collar", "🍁", "neck"], ["Apple badge", "🍏", "chest"],
    ["Pine tree brooch", "🌲", "chest"], ["Soup bowl", "🥣", "left"], ["Hedgehog friend", "🦔", "right"],
    ["Wheat studs", "🌾", "ears"], ["Puddle boots", "👢", "feet"], ["Rosy apple cheeks", "🍎", "cheeks"],
  ] },
  may_storytime: { label: "Storytime", month: 5, blurb: "National Simultaneous Storytime and a love of books", prizes: [
    ["Story crown", "👑", "head"], ["Castle hat", "🏰", "head"], ["Reading glasses", "👓", "face"],
    ["Bookmark ribbon", "🔖", "neck"], ["Scroll necklace", "📜", "neck"], ["Open book badge", "📖", "chest"],
    ["Library card", "🪪", "chest"], ["Stack of books", "📚", "left"], ["Magic wand", "🪄", "right"],
    ["Letter studs", "🔤", "ears"], ["Dragon slippers", "🐲", "feet"], ["Story sparkles", "✨", "cheeks"],
  ] },
  jun_ocean: { label: "Ocean Explorers", month: 6, blurb: "World Oceans Day and life under the sea", prizes: [
    ["Octopus hat", "🐙", "head"], ["Shark fin", "🦈", "head"], ["Diving mask", "🤿", "face"],
    ["Bubble necklace", "🫧", "neck"], ["Anchor chain", "⚓", "neck"], ["Dolphin badge", "🐬", "chest"],
    ["Turtle brooch", "🐢", "chest"], ["Tropical fish", "🐠", "left"], ["Whale friend", "🐳", "right"],
    ["Shell studs", "🐚", "ears"], ["Seal flippers", "🦭", "feet"], ["Sea star stickers", "⭐", "cheeks"],
  ] },
  jul_winter: { label: "Cosy Winter", month: 7, blurb: "Winter holidays, warm drinks and woolly things", prizes: [
    ["Penguin hat", "🐧", "head"], ["Snow crown", "❄️", "head"], ["Frosty face", "🥶", "face"],
    ["Knitted scarf", "🧣", "neck"], ["Mitten string", "🧤", "neck"], ["Hot cocoa", "☕", "chest"],
    ["Campfire badge", "🔥", "chest"], ["Soup pot", "🍲", "left"], ["Teddy bear", "🧸", "right"],
    ["Ear muffs", "🎧", "ears"], ["Ugg boots", "🥾", "feet"], ["Rosy cold cheeks", "🌸", "cheeks"],
  ] },
  aug_science: { label: "Science Week", month: 8, blurb: "National Science Week: experiments and big ideas", prizes: [
    ["Atom hat", "⚛️", "head"], ["Bright idea", "💡", "head"], ["Safety goggles", "🥽", "face"],
    ["DNA scarf", "🧬", "neck"], ["Magnet necklace", "🧲", "neck"], ["Microscope badge", "🔬", "chest"],
    ["Test tube brooch", "🧪", "chest"], ["Telescope", "🔭", "left"], ["Robot buddy", "🤖", "right"],
    ["Spark studs", "⚡", "ears"], ["Lab shoes", "👟", "feet"], ["Crystal stickers", "💎", "cheeks"],
  ] },
  sep_spring: { label: "Spring Blooms", month: 9, blurb: "Wattle, blossoms and baby animals", prizes: [
    ["Wattle crown", "🌼", "head"], ["Sunflower hat", "🌻", "head"], ["Ladybird mask", "🐞", "face"],
    ["Blossom lei", "🌸", "neck"], ["Tulip ribbon", "🌷", "neck"], ["Rosebud brooch", "🌹", "chest"],
    ["Bird badge", "🐦", "chest"], ["Kite", "🪁", "left"], ["Baby chick", "🐣", "right"],
    ["Clover studs", "🍀", "ears"], ["Garden clogs", "👡", "feet"], ["Pollen sparkles", "✨", "cheeks"],
  ] },
  oct_space: { label: "Space Week", month: 10, blurb: "World Space Week: planets, rockets and stars", prizes: [
    ["Planet hat", "🪐", "head"], ["Comet crown", "☄️", "head"], ["Alien mask", "👽", "face"],
    ["Star necklace", "🌟", "neck"], ["Moon pendant", "🌙", "neck"], ["Rocket badge", "🚀", "chest"],
    ["Satellite brooch", "🛰️", "chest"], ["Flying saucer", "🛸", "left"], ["Little Earth", "🌎", "right"],
    ["Star studs", "⭐", "ears"], ["Moon boots", "🥾", "feet"], ["Galaxy sparkles", "🌌", "cheeks"],
  ] },
  nov_minibeasts: { label: "Mini-beasts", month: 11, blurb: "Bugs, bees and garden creatures in late spring", prizes: [
    ["Bee antennae", "🐝", "head"], ["Snail shell hat", "🐌", "head"], ["Bug-hunter lens", "🔍", "face"],
    ["Caterpillar scarf", "🐛", "neck"], ["Honey pot necklace", "🍯", "neck"], ["Butterfly brooch", "🦋", "chest"],
    ["Ant badge", "🐜", "chest"], ["Garden pot", "🪴", "left"], ["Worm friend", "🪱", "right"],
    ["Leaf studs", "🌿", "ears"], ["Beetle boots", "🪲", "feet"], ["Ladybird spots", "🐞", "cheeks"],
  ] },
  dec_celebrate: { label: "End of Year Celebration", month: 12, blurb: "Celebrating a whole year of learning", prizes: [
    ["Graduation cap", "🎓", "head"], ["Award rosette", "🏵️", "head"], ["Proud grin", "😁", "face"],
    ["Gold medal", "🥇", "neck"], ["Photo locket", "📸", "neck"], ["Star student badge", "🌟", "chest"],
    ["Trophy brooch", "🏆", "chest"], ["Report card", "📝", "left"], ["Holiday suitcase", "🧳", "right"],
    ["Bell studs", "🔔", "ears"], ["Running shoes", "👟", "feet"], ["Gold star stickers", "⭐", "cheeks"],
  ] },
};

export const PRIZE_BLURB = { name: "Surprise prize (12 to collect)", emoji: "🎁" };

const sydneyParts = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Sydney",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const value = (type: string) => parts.find((part) => part.type === type)?.value || "";
  return { year: value("year"), month: value("month"), day: value("day") };
};

export const todaySydney = () => {
  const { year, month, day } = sydneyParts();
  return `${year}-${month}-${day}`;
};

export const sydneyYear = () => Number(sydneyParts().year);

export const sydneyMonth = () => Number(sydneyParts().month);
export const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** Monthly themes run for their whole month every year; holiday packs use the dates the parent set. */
export function isActive(cfg?: Record<string, any> | null, pack?: string) {
  if (!cfg?.enabled) return false;
  const month = pack ? PACKS[pack]?.month : undefined;
  if (month) return sydneyMonth() === month;
  const today = todaySydney();
  if (cfg.start_date && today < String(cfg.start_date)) return false;
  if (cfg.end_date && today > String(cfg.end_date)) return false;
  return true;
}

export function packView(pack: string, cfg?: Record<string, any> | null) {
  const source = cfg || {};
  return {
    pack,
    label: PACKS[pack].label,
    month: PACKS[pack].month ?? null,
    month_name: PACKS[pack].month ? MONTH_NAMES[PACKS[pack].month! - 1] : null,
    blurb: PACKS[pack].blurb ?? null,
    prize: PRIZE_BLURB,
    enabled: !!source.enabled,
    start_date: source.start_date ?? null,
    end_date: source.end_date ?? null,
    decorations: source.decorations !== false,
    prize_enabled: source.prize !== false,
    active: isActive(source, pack),
  };
}

export function normalisePackRow(row: any) {
  return {
    ...row,
    enabled: !!row.enabled,
    decorations: row.decorations !== 0,
    prize: row.prize !== 0,
  };
}

export function normalisePrize(row: any) {
  const pack = String(row.pack || "");
  if (!PACKS[pack]) return null;
  const prizeId = String(row.prize_id || `${pack}-1`);
  const index = Number(prizeId.split("-").pop()) - 1;
  const prize = PACKS[pack].prizes[index];
  if (!prize) return null;
  const year = Number(row.year || String(row.claimed_at || "").slice(0, 4) || sydneyYear());
  return {
    row_id: String(row.id),
    id: prizeId,
    pack,
    label: PACKS[pack].label,
    name: prize[0],
    emoji: prize[1],
    slot: prize[2],
    year,
    worn: !!row.worn,
  };
}
