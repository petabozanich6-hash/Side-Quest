export const MAX_WORN = 3;

export const PACKS: Record<string, { label: string; prizes: Array<[string, string, string]> }> = {
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

export function isActive(cfg?: Record<string, any> | null) {
  if (!cfg?.enabled) return false;
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
    prize: PRIZE_BLURB,
    enabled: !!source.enabled,
    start_date: source.start_date ?? null,
    end_date: source.end_date ?? null,
    decorations: source.decorations !== false,
    prize_enabled: source.prize !== false,
    active: isActive(source),
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
