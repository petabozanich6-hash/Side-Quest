/** Shared pet-room rules. The worker and the room UI both import this module. */

export const STARTER_ACORNS = 8;
export const ACORN_CAP = 9999;

export const ACORN_AMOUNTS = {
  submission: 2,
  feedback: { accepted: 3, demonstrated: 5, needs_revision: 1, needs_more_practice: 1 },
  reading: 1,
};

export function acornsForFeedback(status) {
  return ACORN_AMOUNTS.feedback[status] || 0;
}

export const TRAITS = {
  fox: { speed: 1, wander: 0.74, rest: 0.2, play: 0.5, hop: false, prefer: "window", breathe: 3.1 },
  owl: { speed: 0.68, wander: 0.22, rest: 0.58, play: 0.12, hop: false, prefer: "bookshelf", breathe: 4.4 },
  turtle: { speed: 0.42, wander: 0.28, rest: 0.72, play: 0.08, hop: false, prefer: "cushion", breathe: 5.2 },
  hedgehog: { speed: 0.62, wander: 0.34, rest: 0.55, play: 0.18, hop: false, prefer: "bed", breathe: 3.8 },
  fawn: { speed: 0.7, wander: 0.4, rest: 0.48, play: 0.22, hop: false, prefer: "window", breathe: 3.6 },
  squirrel: { speed: 1.28, wander: 0.86, rest: 0.1, play: 0.7, hop: true, prefer: "toy", breathe: 1.8 },
  rabbit: { speed: 1.16, wander: 0.78, rest: 0.22, play: 0.55, hop: true, prefer: "cushion", breathe: 2.2 },
  dragon: { speed: 0.92, wander: 0.5, rest: 0.24, play: 0.42, hop: false, prefer: "lamp", breathe: 3.4 },
};

export const THEMES = {
  meadow: { id: "meadow", name: "Meadow", cost: 0, starter: true, rarity: "common", blurb: "Soft green light, like a garden morning.", sky: "#E7F6EC", wall: "#F4FBF6", trim: "#6B8A5B" },
  sunset: { id: "sunset", name: "Sunset", cost: 0, starter: true, rarity: "common", blurb: "Warm honey light across the walls.", sky: "#FDE7C7", wall: "#FFF6E8", trim: "#C77B5B" },
  woodland: { id: "woodland", name: "Woodland", cost: 0, starter: true, rarity: "common", blurb: "A quiet corner under the trees.", sky: "#E7F2D4", wall: "#F4F8EC", trim: "#4A5D3A" },
  rose: { id: "rose", name: "Rose", cost: 0, starter: true, rarity: "common", blurb: "A gentle pink glow.", sky: "#FDE4EA", wall: "#FFF5F7", trim: "#D4857A" },
  sky: { id: "sky", name: "Sky", cost: 0, starter: true, rarity: "common", blurb: "Clear blue air and a bright sill.", sky: "#E3F3FC", wall: "#F5FBFF", trim: "#7BA3C9" },
  night: { id: "night", name: "Night garden", cost: 14, starter: false, rarity: "rare", blurb: "Deep blue walls and a lamp-lit floor.", sky: "#243044", wall: "#2C3A4E", trim: "#E7D3A1" },
  library: { id: "library", name: "Reading nook", cost: 16, starter: false, rarity: "rare", blurb: "Paper-coloured walls for a quiet reader.", sky: "#EFE6D6", wall: "#F7F1E6", trim: "#8B6F47" },
};

export const FLOORS = {
  boards: { id: "boards", name: "Timber boards", cost: 0, starter: true, rarity: "common", blurb: "Warm wooden boards.", colors: ["#E7D3B0", "#DCC39A", "#C9A97A"] },
  grass: { id: "grass", name: "Soft grass", cost: 0, starter: true, rarity: "common", blurb: "A meadow carpet underfoot.", colors: ["#D5E4C4", "#C5D7A4", "#B7CC96"] },
  tiles: { id: "tiles", name: "Garden tiles", cost: 8, starter: false, rarity: "uncommon", blurb: "Pale tiles with a clay line.", colors: ["#E7E2D4", "#DDD6C6", "#C8893B"] },
  carpet: { id: "carpet", name: "Wool carpet", cost: 10, starter: false, rarity: "uncommon", blurb: "A thick rug from wall to wall.", colors: ["#E7D0C4", "#D8B8A8", "#C77B5B"] },
};

export const ITEMS = {
  bed: { id: "bed", kind: "furniture", name: "Cosy bed", blurb: "The pet walks over, climbs in, and sleeps.", cost: 0, starter: true, rarity: "common", category: "Rest", wall: false, blocks: true, walkable: false, w: 0.34, h: 0.22, hitW: 0.28, hitH: 0.12 },
  cushion: { id: "cushion", kind: "furniture", name: "Moss cushion", blurb: "A round cushion for a sit and a rest.", cost: 0, starter: true, rarity: "common", category: "Rest", wall: false, blocks: true, walkable: false, w: 0.16, h: 0.12, hitW: 0.14, hitH: 0.1 },
  lamp: { id: "lamp", kind: "furniture", name: "Reading lamp", blurb: "Tap to turn the light on or off.", cost: 0, starter: true, rarity: "common", category: "Comfort", wall: false, blocks: true, walkable: false, w: 0.1, h: 0.28, hitW: 0.08, hitH: 0.1 },
  window: { id: "window", kind: "furniture", name: "Garden window", blurb: "Clouds drift by. The pet likes to look out.", cost: 0, starter: true, rarity: "common", category: "Comfort", wall: true, blocks: true, walkable: false, w: 0.24, h: 0.2, hitW: 0.22, hitH: 0.16 },
  toy: { id: "toy", kind: "furniture", name: "Yarn toy", blurb: "Tap it and the pet comes over to play.", cost: 4, starter: false, rarity: "common", category: "Play", wall: false, blocks: true, walkable: false, w: 0.12, h: 0.12, hitW: 0.1, hitH: 0.1 },
  bowl: { id: "bowl", kind: "furniture", name: "Snack bowl", blurb: "Tap it to share a snack. Nobody has to eat on a timer.", cost: 4, starter: false, rarity: "common", category: "Play", wall: false, blocks: true, walkable: false, w: 0.12, h: 0.1, hitW: 0.1, hitH: 0.08 },
  plant: { id: "plant", kind: "furniture", name: "Fern pot", blurb: "A potted fern. The pet may come and sniff it.", cost: 8, starter: false, rarity: "uncommon", category: "Decor", wall: false, blocks: true, walkable: false, w: 0.12, h: 0.2, hitW: 0.1, hitH: 0.1 },
  bookshelf: { id: "bookshelf", kind: "furniture", name: "Little bookshelf", blurb: "A few favourite stories, close to the floor.", cost: 12, starter: false, rarity: "uncommon", category: "Decor", wall: false, blocks: true, walkable: false, w: 0.16, h: 0.22, hitW: 0.14, hitH: 0.12 },
  rug: { id: "rug", kind: "furniture", name: "Woven rug", blurb: "Sits under other furniture. Pets can walk across it.", cost: 10, starter: false, rarity: "uncommon", category: "Decor", wall: false, blocks: false, walkable: true, w: 0.32, h: 0.14, hitW: 0.3, hitH: 0.12 },
  mobile: { id: "mobile", kind: "furniture", name: "Star mobile", blurb: "A slow mobile for the wall.", cost: 18, starter: false, rarity: "rare", category: "Decor", wall: true, blocks: true, walkable: false, w: 0.16, h: 0.16, hitW: 0.14, hitH: 0.14 },
};

export const DEFAULT_PLACEMENTS = [
  { uid: "window", item: "window", x: 0.22, y: 0.22, flip: false },
  { uid: "bed", item: "bed", x: 0.28, y: 0.64, flip: false },
  { uid: "cushion", item: "cushion", x: 0.52, y: 0.7, flip: false },
  { uid: "lamp", item: "lamp", x: 0.84, y: 0.62, flip: false },
];

const WALK_LANE_Y = 0.82;

const asList = (value) => (Array.isArray(value) ? value.map((item) => String(item)) : []);
const round = (n) => Math.round(Number(n) * 1000) / 1000;
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

export function ownKey(entry) {
  if (!entry) return "";
  if (entry.kind === "theme") return `theme:${entry.id}`;
  if (entry.kind === "floor") return `floor:${entry.id}`;
  return entry.id;
}

export function starterOwned() {
  const keys = [];
  Object.values(ITEMS).forEach((item) => { if (item.starter) keys.push(item.id); });
  Object.values(THEMES).forEach((theme) => { if (theme.starter) keys.push(`theme:${theme.id}`); });
  Object.values(FLOORS).forEach((floor) => { if (floor.starter) keys.push(`floor:${floor.id}`); });
  return keys;
}

export function catalogEntry(id) {
  if (ITEMS[id]) return ITEMS[id];
  if (THEMES[id]) return { ...THEMES[id], kind: "theme", category: "Themes" };
  if (FLOORS[id]) return { ...FLOORS[id], kind: "floor", category: "Floors" };
  return null;
}

function boxOf(placement) {
  const spec = ITEMS[placement.item];
  if (!spec) return null;
  const w = spec.hitW;
  const h = spec.hitH;
  return {
    x: placement.x - w / 2,
    y: placement.y - h / 2,
    w,
    h,
    wall: spec.wall,
    walkable: spec.walkable,
    blocks: spec.blocks,
  };
}

export function overlaps(a, b, minRatio = 0.28) {
  const ix = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const iy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  if (ix <= 0 || iy <= 0) return false;
  const minArea = Math.min(a.w * a.h, b.w * b.h);
  if (minArea <= 0) return false;
  return (ix * iy) / minArea > minRatio;
}

function inBounds(spec, x, y) {
  if (spec.wall) return x >= 0.1 && x <= 0.9 && y >= 0.14 && y <= 0.34;
  return x >= 0.1 && x <= 0.9 && y >= 0.56 && y <= 0.74;
}

export function validatePlacements(placements, owned) {
  if (!Array.isArray(placements)) return { error: "Placements need to be a list" };
  if (placements.length > 14) return { error: "This room can hold 14 things" };
  const clean = [];
  const seenUid = new Set();
  const seenItem = new Set();
  for (const raw of placements) {
    const item = String(raw?.item || "");
    const spec = ITEMS[item];
    const uid = String(raw?.uid || "").slice(0, 40);
    const x = Number(raw?.x);
    const y = Number(raw?.y);
    if (!spec) return { error: "Unknown furniture" };
    if (!owned.includes(item)) return { error: "That item is not in the cupboard yet" };
    if (!/^[a-zA-Z0-9_-]{1,40}$/.test(uid)) return { error: "Could not save that item" };
    if (seenUid.has(uid) || seenItem.has(item)) return { error: "Only one of each item fits in the room" };
    if (!Number.isFinite(x) || !Number.isFinite(y) || !inBounds(spec, x, y)) return { error: "Keep furniture inside the room" };
    seenUid.add(uid);
    seenItem.add(item);
    clean.push({ uid, item, x: round(x), y: round(y), flip: !!raw?.flip });
  }
  for (let i = 0; i < clean.length; i += 1) {
    for (let j = i + 1; j < clean.length; j += 1) {
      const a = boxOf(clean[i]);
      const b = boxOf(clean[j]);
      if (!a || !b || a.walkable || b.walkable) continue;
      if (a.wall !== b.wall) continue;
      if (overlaps(a, b)) return { error: "Those pieces overlap. Leave a little space." };
    }
  }
  return { placements: clean };
}

export function persistRoom(room) {
  return {
    theme: room.theme,
    floor: room.floor,
    lampOn: !!room.lampOn,
    owned: room.owned,
    placements: room.placements,
  };
}

export function readRoom(extra, background) {
  const saved = extra?.room && typeof extra.room === "object" ? extra.room : null;
  const owned = [...new Set([...starterOwned(), ...asList(saved?.owned)])];
  const themeId = THEMES[saved?.theme] ? saved.theme : (THEMES[background] ? background : "meadow");
  const floorId = FLOORS[saved?.floor] ? saved.floor : "boards";
  const checked = validatePlacements(saved ? saved.placements || [] : DEFAULT_PLACEMENTS, owned);
  const placements = checked.placements || DEFAULT_PLACEMENTS;
  return {
    theme: owned.includes(`theme:${themeId}`) ? themeId : "meadow",
    floor: owned.includes(`floor:${floorId}`) ? floorId : "boards",
    lampOn: saved ? saved.lampOn !== false : true,
    owned,
    placements,
    themeStyle: THEMES[owned.includes(`theme:${themeId}`) ? themeId : "meadow"],
    floorStyle: FLOORS[owned.includes(`floor:${floorId}`) ? floorId : "boards"],
  };
}

export function listShop(room) {
  const furniture = Object.values(ITEMS).map((item) => ({
    id: item.id,
    kind: "furniture",
    name: item.name,
    blurb: item.blurb,
    cost: item.cost,
    rarity: item.rarity,
    category: item.category,
    owned: room.owned.includes(item.id),
    placed: room.placements.some((placement) => placement.item === item.id),
  }));
  const themes = Object.values(THEMES).map((theme) => ({
    id: theme.id,
    kind: "theme",
    name: theme.name,
    blurb: theme.blurb,
    cost: theme.cost,
    rarity: theme.rarity,
    category: "Themes",
    owned: room.owned.includes(`theme:${theme.id}`),
    placed: room.theme === theme.id,
    swatch: { sky: theme.sky, wall: theme.wall, trim: theme.trim },
  }));
  const floors = Object.values(FLOORS).map((floor) => ({
    id: floor.id,
    kind: "floor",
    name: floor.name,
    blurb: floor.blurb,
    cost: floor.cost,
    rarity: floor.rarity,
    category: "Floors",
    owned: room.owned.includes(`floor:${floor.id}`),
    placed: room.floor === floor.id,
    swatch: { colors: floor.colors },
  }));
  return [...furniture, ...themes, ...floors];
}

export function economyOf(extra) {
  const current = extra?.economy;
  if (current?.seeded) {
    return {
      acorns: clamp(Number(current.acorns) || 0, 0, ACORN_CAP),
      seeded: true,
      seen: {
        submissions: asList(current.seen?.submissions),
        feedback: asList(current.seen?.feedback),
        reading: asList(current.seen?.reading),
      },
    };
  }
  const awards = extra?.awards || {};
  return {
    acorns: STARTER_ACORNS,
    seeded: true,
    seen: {
      submissions: asList(awards.submissions),
      feedback: asList(awards.feedback),
      reading: asList(awards.reading),
    },
  };
}

export function grantAcorn(economy, bucket, key, amount) {
  const id = String(key);
  if (!economy.seen[bucket] || economy.seen[bucket].includes(id)) return 0;
  economy.seen[bucket].push(id);
  const gain = Math.max(0, Number(amount) || 0);
  economy.acorns = Math.min(ACORN_CAP, economy.acorns + gain);
  return gain;
}

export function applyRoomPatch(extra, background, patch) {
  const room = readRoom(extra, background);
  const next = { ...room, placements: room.placements.map((item) => ({ ...item })) };
  if (patch.theme != null) {
    const theme = String(patch.theme);
    if (!THEMES[theme]) return { error: "Unknown theme" };
    if (!room.owned.includes(`theme:${theme}`)) return { error: "You have not unlocked that theme" };
    next.theme = theme;
    next.themeStyle = THEMES[theme];
  }
  if (patch.floor != null) {
    const floor = String(patch.floor);
    if (!FLOORS[floor]) return { error: "Unknown floor" };
    if (!room.owned.includes(`floor:${floor}`)) return { error: "You have not unlocked that floor" };
    next.floor = floor;
    next.floorStyle = FLOORS[floor];
  }
  if (typeof patch.lampOn === "boolean") next.lampOn = patch.lampOn;
  if (patch.placements != null) {
    const checked = validatePlacements(patch.placements, next.owned);
    if (checked.error) return { error: checked.error };
    next.placements = checked.placements;
  }
  return { room: next, extra: { ...extra, room: persistRoom(next) } };
}

export function buyShopItem(extra, background, itemId) {
  const entry = catalogEntry(String(itemId || ""));
  if (!entry) return { error: "Unknown item" };
  const room = readRoom(extra, background);
  const economy = economyOf(extra);
  const key = ownKey(entry);
  if (room.owned.includes(key)) return { error: "You already own this" };
  const cost = Number(entry.cost);
  if (!Number.isFinite(cost) || cost < 0) return { error: "Unknown item" };
  const balance = Number(economy.acorns);
  if (!Number.isFinite(balance) || balance < cost) return { error: "Not enough acorns" };
  const nextBalance = balance - cost;
  if (nextBalance < 0) return { error: "Not enough acorns" };
  economy.acorns = nextBalance;
  room.owned = [...room.owned, key];
  return {
    extra: { ...extra, room: persistRoom(room), economy },
    room,
    economy,
    bought: { id: entry.id, name: entry.name, cost },
  };
}

export function anchorFor(placement) {
  const spec = ITEMS[placement.item];
  if (!spec || spec.wall) return { x: clamp(placement.x, 0.12, 0.88), y: WALK_LANE_Y };
  return { x: clamp(placement.x, 0.12, 0.88), y: spec.id === "bed" || spec.id === "cushion" ? round(placement.y + 0.02) : WALK_LANE_Y };
}

export function pathTo(from, to) {
  const points = [];
  const lane = { x: clamp(from.x, 0.12, 0.88), y: WALK_LANE_Y };
  const beside = { x: clamp(to.x, 0.12, 0.88), y: WALK_LANE_Y };
  if (Math.abs(from.y - WALK_LANE_Y) > 0.035) points.push(lane);
  if (Math.abs(beside.x - (points.length ? points[points.length - 1].x : from.x)) > 0.02) points.push(beside);
  if (Math.hypot(to.x - beside.x, to.y - beside.y) > 0.03) points.push({ x: round(to.x), y: round(to.y) });
  if (!points.length) points.push({ x: round(to.x), y: round(to.y) });
  return points.map((point) => ({ x: round(point.x), y: round(point.y) }));
}

export function moveDuration(distance, speed, reduced) {
  if (reduced || distance < 0.02) return 0;
  const pace = Number(speed) > 0 ? Number(speed) : 1;
  return Math.max(480, (distance * 2500) / pace);
}

export function nudgePlacement(room, item, dx, dy) {
  const current = (room?.placements || []).find((placement) => placement.item === item);
  if (!current) return { error: "That item is not in the room" };
  return placeAt(room, item, current.x + Number(dx || 0), current.y + Number(dy || 0));
}

export function placeAt(room, item, x, y) {
  const spec = ITEMS[item];
  if (!spec) return { error: "Unknown furniture" };
  if (!room.owned.includes(item)) return { error: "That item is not in the cupboard yet" };
  const spot = {
    x: clamp(x, 0.1, 0.9),
    y: spec.wall ? clamp(y, 0.14, 0.34) : clamp(y, 0.56, 0.72),
  };
  const without = room.placements.filter((placement) => placement.item !== item);
  return validatePlacements([...without, { uid: item, item, x: spot.x, y: spot.y, flip: false }], room.owned);
}

export function pickWanderTarget(placements, from, random = Math.random) {
  const blockers = placements.map(boxOf).filter((box) => box && box.blocks && !box.wall && !box.walkable);
  for (let i = 0; i < 16; i += 1) {
    const x = round(0.14 + random() * 0.72);
    const y = round(WALK_LANE_Y + random() * 0.04);
    const pet = { x: x - 0.04, y: y - 0.03, w: 0.08, h: 0.06 };
    if (blockers.some((box) => overlaps(pet, box, 0.02))) continue;
    if (Math.hypot(x - from.x, y - from.y) < 0.08) continue;
    return { x, y };
  }
  return null;
}

export function diffReward(prev, next) {
  if (!prev) return { first: true, xp: 0, acorns: 0, levelUp: false, level: next?.level || "" };
  const xp = Math.max(0, Number(next?.xp || 0) - Number(prev.xp || 0));
  const acorns = Math.max(0, Number(next?.acorns || 0) - Number(prev.acorns || 0));
  const levelUp = !!(prev.level && next?.level && prev.level !== next.level);
  return { first: false, xp, acorns, levelUp, level: next?.level || "" };
}

export function rewardWorthShowing(diff) {
  if (!diff || diff.first) return false;
  return diff.xp >= 3 || diff.acorns > 0 || diff.levelUp;
}
