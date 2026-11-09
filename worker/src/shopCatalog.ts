// The Side-Quest Shop catalogue: departments, products (with variants, personalisation, bundles and add-ons),
// interest lists, physical stock and fulfilment, all managed by the owner in Owner HQ.
//
// Ground rules:
// - Every seeded product starts as a hidden DRAFT with no price, supplier, stock or photos. Nothing is invented.
// - A product is only shown when the owner switches it on (visible) AND its status isn't Draft or Discontinued.
// - A product only takes payment when it's visible, priced, and its status is In Stock, Made to Order or Pre-order
//   (and, for pre-orders, before the closing date). Everything else can collect "register interest" emails instead.
// - The public shop itself is off until the owner opens it (platform setting features.shopOpen).
import { SHOP_ADDITIONS, SHOP_SEED, type SeedProduct } from "./data/shopCatalogue";

type DB = D1Database;

export const DEPARTMENTS = [
  { id: "books", label: "Books & Learning" },
  { id: "stationery", label: "Stationery & School Supplies" },
  { id: "science", label: "Science & Discovery" },
  { id: "arts", label: "Arts, Crafts & Games" },
  { id: "clothing", label: "Clothing & Accessories" },
  { id: "homewares", label: "Homewares & The Cosy Quest" },
  { id: "parents", label: "The Parent Survival Collection" },
  { id: "gifts", label: "Ignis Gifts & Collectibles" },
  { id: "dragon-post", label: "Dragon Post: Letters & Mail" },
  { id: "boxes", label: "The Monthly Quest: Subscription Boxes" },
  { id: "bundles", label: "Bundles & Learning Kits" },
  { id: "digital", label: "Digital Products" },
] as const;
export const STATUSES = ["draft", "coming_soon", "register_interest", "pre_order", "in_stock", "made_to_order", "sold_out", "discontinued"] as const;
export const STATUS_LABELS: Record<string, string> = {
  draft: "Draft", coming_soon: "Coming Soon", register_interest: "Register Interest", pre_order: "Pre-order",
  in_stock: "In Stock", made_to_order: "Made to Order", sold_out: "Sold Out", discontinued: "Discontinued",
};
export const FULFILMENTS = ["physical", "pre_order", "made_to_order", "personalised", "digital", "postal_subscription", "subscription_box"] as const;
export const FULFILMENT_LABELS: Record<string, string> = {
  physical: "Physical Stock", pre_order: "Pre-order", made_to_order: "Made to Order", personalised: "Personalised Physical",
  digital: "Digital Download", postal_subscription: "Postal Subscription", subscription_box: "Subscription Box",
};
export const SELLING = new Set(["pre_order", "in_stock", "made_to_order"]);
export const INTEREST = new Set(["coming_soon", "register_interest", "sold_out", "pre_order"]);
export const SUBSCRIPTION_FULFILMENT = new Set(["postal_subscription", "subscription_box"]);
const DEPT_IDS = new Set(DEPARTMENTS.map((d) => d.id as string));

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS shop_products (
    id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, department TEXT NOT NULL, collection TEXT NOT NULL DEFAULT '',
    title TEXT NOT NULL, description TEXT NOT NULL DEFAULT '', tags TEXT NOT NULL DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'draft', fulfilment TEXT NOT NULL DEFAULT 'physical', visible INTEGER NOT NULL DEFAULT 0,
    price_cents INTEGER, wholesale_cents INTEGER, postage_cents INTEGER, supplier TEXT NOT NULL DEFAULT '', supplier_notes TEXT NOT NULL DEFAULT '',
    parcel_weight_g INTEGER, parcel_length_cm INTEGER, parcel_width_cm INTEGER, parcel_height_cm INTEGER,
    lead_time_days INTEGER, stock INTEGER, low_stock_at INTEGER, max_per_order INTEGER,
    preorder_closes_at TEXT, preorder_target INTEGER, dispatch_estimate TEXT NOT NULL DEFAULT '',
    personalisation TEXT NOT NULL DEFAULT '[]', images INTEGER NOT NULL DEFAULT 0, bundle_items TEXT NOT NULL DEFAULT '[]',
    addons TEXT NOT NULL DEFAULT '[]', gift_months TEXT NOT NULL DEFAULT '[]', safety_checked INTEGER NOT NULL DEFAULT 0, prints_books INTEGER NOT NULL DEFAULT 0,
    sort INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS idx_shop_products_dept ON shop_products (department, sort)`,
  `CREATE TABLE IF NOT EXISTS shop_variants (
    id TEXT PRIMARY KEY, product_id TEXT NOT NULL, name TEXT NOT NULL, sku TEXT NOT NULL DEFAULT '', price_cents INTEGER,
    stock INTEGER, active INTEGER NOT NULL DEFAULT 1, sort INTEGER NOT NULL DEFAULT 0, book_id TEXT)`,
  `CREATE INDEX IF NOT EXISTS idx_shop_variants_product ON shop_variants (product_id, sort)`,
  `CREATE TABLE IF NOT EXISTS shop_interest (product_id TEXT NOT NULL, email TEXT NOT NULL, created_at TEXT NOT NULL, PRIMARY KEY (product_id, email))`,
  `CREATE TABLE IF NOT EXISTS shop_meta (key TEXT PRIMARY KEY, value TEXT NOT NULL)`,
];
const ready = new WeakMap<object, Promise<void>>();
export function ensureShopCatalog(db: DB): Promise<void> {
  let p = ready.get(db);
  if (!p) {
    const made: Promise<void> = (async () => {
      for (const q of SCHEMA) await db.prepare(q).run();
      // Additive migration: preserve every saved shop product and existing order.
      for (const name of ["parcel_weight_g", "parcel_length_cm", "parcel_width_cm", "parcel_height_cm"]) {
        await db.prepare(`ALTER TABLE shop_products ADD COLUMN ${name} INTEGER`).run().catch(() => undefined);
      }
      // What's included in each option, for tiers like "Basics" and "Full package".
      await db.prepare("ALTER TABLE shop_variants ADD COLUMN details TEXT NOT NULL DEFAULT ''").run().catch(() => undefined);
      await seedCatalog(db);
    })().catch((e) => { ready.delete(db); throw e; });
    ready.set(db, made);
    p = made;
  }
  return p;
}

export const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70).replace(/-+$/, "");

/** Hidden draft rows (and their no-price options) for seed products. */
function seedStatements(db: DB, list: SeedProduct[], used: Set<string>, startSort: number, now: string): D1PreparedStatement[] {
  const stmts: D1PreparedStatement[] = [];
  list.forEach((p, i) => {
    let slug = slugify(p.title) || `product-${startSort + i + 1}`;
    if (used.has(slug)) slug = `${slug}-${p.department}`.slice(0, 80);
    if (used.has(slug)) return; // already in the catalogue
    used.add(slug);
    const id = crypto.randomUUID();
    stmts.push(db.prepare(`INSERT OR IGNORE INTO shop_products (id, slug, department, collection, title, description, tags, status, fulfilment, visible, sort, personalisation, prints_books, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', ?, 0, ?, ?, ?, ?, ?)`)
      .bind(id, slug, p.department, p.collection, p.title, p.description, JSON.stringify(p.tags), p.fulfilment, startSort + i, JSON.stringify(p.personalisation || []), p.prints_books ? 1 : 0, now, now));
    // "Who it's for", age bands and similar options, with no price or stock yet.
    (p.variants || []).forEach((name, j) => stmts.push(db.prepare("INSERT OR IGNORE INTO shop_variants (id, product_id, name, sort) VALUES (?, ?, ?, ?)").bind(crypto.randomUUID(), id, name, j)));
  });
  return stmts;
}

/**
 * Seeds the owner's catalogue once, as hidden drafts with no prices, then adds each later batch once.
 * Never re-adds products the owner deleted.
 */
async function seedCatalog(db: DB) {
  const now = new Date().toISOString();
  const run = async (stmts: D1PreparedStatement[], key: string) => {
    for (let i = 0; i < stmts.length; i += 50) await db.batch(stmts.slice(i, i + 50));
    await db.prepare("INSERT OR REPLACE INTO shop_meta (key, value) VALUES (?, ?)").bind(key, now).run();
  };
  if (!(await db.prepare("SELECT value FROM shop_meta WHERE key = 'seeded_v1'").first())) {
    await run(seedStatements(db, SHOP_SEED, new Set(), 0, now), "seeded_v1");
  }
  for (const batch of SHOP_ADDITIONS) {
    const key = `added:${batch.key}`;
    if (await db.prepare("SELECT value FROM shop_meta WHERE key = ?").bind(key).first()) continue;
    const { results } = await db.prepare("SELECT slug FROM shop_products").all<{ slug: string }>();
    await run(seedStatements(db, batch.products, new Set((results || []).map((r) => r.slug)), 1000, now), key);
  }
}

// ---------------------------------------------------------------- reading

const json = <T>(v: unknown, fallback: T): T => { try { const x = JSON.parse(String(v ?? "")); return x ?? fallback; } catch { return fallback; } };
export type PersonalField = { key: string; label: string; max: number; required: boolean };

export function productRow(r: any) {
  return {
    ...r,
    visible: !!r.visible,
    safety_checked: !!r.safety_checked,
    prints_books: !!r.prints_books,
    tags: json<string[]>(r.tags, []),
    personalisation: json<PersonalField[]>(r.personalisation, []),
    bundle_items: json<string[]>(r.bundle_items, []),
    addons: json<string[]>(r.addons, []),
    gift_months: json<number[]>(r.gift_months, []),
  };
}

export async function variantsFor(db: DB, ids: string[]): Promise<Map<string, any[]>> {
  const out = new Map<string, any[]>();
  if (!ids.length) return out;
  for (let i = 0; i < ids.length; i += 90) {
    const chunk = ids.slice(i, i + 90);
    const { results } = await db.prepare(`SELECT * FROM shop_variants WHERE product_id IN (${chunk.map(() => "?").join(",")}) ORDER BY sort`).bind(...chunk).all<any>();
    for (const v of results || []) { const list = out.get(v.product_id) || []; list.push({ ...v, active: !!v.active }); out.set(v.product_id, list); }
  }
  return out;
}

export function isPublic(p: any) { return !!p.visible && p.status !== "draft" && p.status !== "discontinued"; }

/** Whether a public product can be bought right now (and why not, for the owner). */
export function buyable(p: any, variants: any[] = [], now: Date = new Date()): { ok: boolean; reason?: string } {
  if (!isPublic(p)) return { ok: false, reason: "Hidden" };
  if (!SELLING.has(p.status)) return { ok: false, reason: STATUS_LABELS[p.status] };
  const priced = p.price_cents != null || variants.some((v) => v.active && v.price_cents != null);
  if (!priced) return { ok: false, reason: "No price" };
  if (p.status === "pre_order" && p.preorder_closes_at && p.preorder_closes_at < now.toISOString()) return { ok: false, reason: "Pre-orders closed" };
  if (p.status === "in_stock") {
    const tracked = variants.length ? variants.filter((v) => v.active) : [p];
    if (tracked.every((x) => x.stock != null && x.stock <= 0)) return { ok: false, reason: "Out of stock" };
  }
  return { ok: true };
}

/** The view anyone can see (no costs, suppliers or stock numbers). */
export function publicProduct(p: any, variants: any[] = [], preorderCount = 0, now: Date = new Date()) {
  const b = buyable(p, variants, now);
  const activeVariants = variants.filter((v) => v.active);
  return {
    id: p.id, slug: p.slug, department: p.department, collection: p.collection, title: p.title, description: p.description,
    tags: p.tags, status: p.status, status_label: STATUS_LABELS[p.status], fulfilment: p.fulfilment,
    price_cents: p.price_cents, postage_cents: SUBSCRIPTION_FULFILMENT.has(p.fulfilment) || p.fulfilment === "digital" ? 0 : p.postage_cents ?? 0,
    images: p.images, dispatch_estimate: p.dispatch_estimate, max_per_order: p.max_per_order,
    preorder_closes_at: p.status === "pre_order" ? p.preorder_closes_at : null,
    preorder_progress: p.status === "pre_order" && p.preorder_target ? { ordered: preorderCount, target: p.preorder_target } : null,
    personalisation: p.personalisation, bundle_items: p.bundle_items, addons: p.addons, gift_months: p.gift_months,
    prints_books: !!p.prints_books,
    variants: activeVariants.map((v) => ({ id: v.id, name: v.name, details: v.details || "", book_id: v.book_id || null, price_cents: v.price_cents ?? p.price_cents, available: p.status !== "in_stock" || v.stock == null || v.stock > 0 })),
    low_stock: p.status === "in_stock" && p.stock != null && p.low_stock_at != null && p.stock <= p.low_stock_at && p.stock > 0,
    can_buy: b.ok, can_register_interest: INTEREST.has(p.status), subscription: SUBSCRIPTION_FULFILMENT.has(p.fulfilment),
  };
}

// ---------------------------------------------------------------- validation (owner edits)

const clip = (v: unknown, n: number) => (typeof v === "string" ? v.replace(/[\x00-\x1f\x7f]/g, " ").trim().slice(0, n) : "");
const cents = (v: unknown): number | null | "bad" => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isInteger(n) && n >= 0 && n <= 1_000_000 ? n : "bad";
};
const intOrNull = (v: unknown, max: number): number | null | "bad" => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isInteger(n) && n >= 0 && n <= max ? n : "bad";
};

export function validateProduct(b: any): { ok: true; value: Record<string, unknown>; variants: any[] | null } | { ok: false; detail: string } {
  const title = clip(b.title, 140);
  if (!title) return { ok: false, detail: "The product needs a title." };
  if (/[<>]/.test(title)) return { ok: false, detail: "Titles can't contain < or >." };
  const department = String(b.department || "");
  if (!DEPT_IDS.has(department)) return { ok: false, detail: "Choose a department." };
  const status = String(b.status || "draft");
  if (!(STATUSES as readonly string[]).includes(status)) return { ok: false, detail: "Unknown status." };
  const fulfilment = String(b.fulfilment || "physical");
  if (!(FULFILMENTS as readonly string[]).includes(fulfilment)) return { ok: false, detail: "Unknown fulfilment type." };
  const money: Record<string, number | null> = {};
  for (const k of ["price_cents", "wholesale_cents", "postage_cents"]) {
    const v = cents(b[k]);
    if (v === "bad") return { ok: false, detail: "Prices and costs must be whole cents between $0 and $10,000." };
    money[k] = v;
  }
  if (money.price_cents !== null && money.price_cents < 50 && money.price_cents !== 0) return { ok: false, detail: "Prices under 50c can't be charged by card." };
  const ints: Record<string, number | null> = {};
  for (const [k, max] of [["lead_time_days", 365], ["stock", 100000], ["low_stock_at", 100000], ["max_per_order", 1000], ["preorder_target", 100000], ["parcel_weight_g", 22000], ["parcel_length_cm", 105], ["parcel_width_cm", 105], ["parcel_height_cm", 105]] as const) {
    const v = intOrNull(b[k], max);
    if (v === "bad") return { ok: false, detail: `${k.replace(/_/g, " ")} must be a whole number.` };
    ints[k] = v;
  }
  let closes: string | null = null;
  if (b.preorder_closes_at) {
    const t = Date.parse(String(b.preorder_closes_at));
    if (!Number.isFinite(t)) return { ok: false, detail: "The pre-order closing date isn't a valid date." };
    closes = new Date(t).toISOString();
  }
  const fields: PersonalField[] = (Array.isArray(b.personalisation) ? b.personalisation : []).slice(0, 6).map((f: any) => ({
    key: slugify(clip(f?.label, 40)).slice(0, 30) || "field", label: clip(f?.label, 60), max: Math.min(200, Math.max(1, Number(f?.max) || 30)), required: !!f?.required,
  })).filter((f: PersonalField) => f.label && !/[<>]/.test(f.label));
  const ids = (v: unknown) => [...new Set((Array.isArray(v) ? v : []).map(String).filter((x) => /^[0-9a-f-]{36}$/.test(x)))].slice(0, 20);
  const tags = [...new Set((Array.isArray(b.tags) ? b.tags : String(b.tags || "").split(",")).map((t: unknown) => slugify(String(t))).filter(Boolean))].slice(0, 12);
  const giftMonths = [...new Set((Array.isArray(b.gift_months) ? b.gift_months : []).map(Number).filter((n: number) => [1, 3, 6, 12].includes(n)))].sort((x: any, y: any) => x - y);
  let variants: any[] | null = null;
  if (Array.isArray(b.variants)) {
    variants = [];
    for (const [i, v] of b.variants.slice(0, 60).entries()) {
      const name = clip(v?.name, 80);
      if (!name || /[<>]/.test(name)) return { ok: false, detail: "Each variant needs a name (for example \"Size 8 / Navy\")." };
      const price = cents(v?.price_cents);
      const stock = intOrNull(v?.stock, 100000);
      if (price === "bad" || stock === "bad") return { ok: false, detail: `Check the price and stock for "${name}".` };
      variants.push({ id: /^[0-9a-f-]{36}$/.test(String(v?.id)) ? String(v.id) : crypto.randomUUID(), name, sku: clip(v?.sku, 40), price_cents: price, stock, active: v?.active === false ? 0 : 1, sort: i, details: typeof v?.details === "string" ? v.details.replace(/[\x00-\x09\x0b-\x1f\x7f<>]/g, " ").trim().slice(0, 600) : "", book_id: /^[a-z0-9-]{1,80}$/.test(String(v?.book_id || "")) ? String(v.book_id) : null });
    }
  }
  return {
    ok: true,
    variants,
    value: {
      title, department, status, fulfilment, collection: clip(b.collection, 80), description: clip(b.description, 3000).replace(/[<>]/g, ""),
      tags: JSON.stringify(tags), ...money, ...ints, preorder_closes_at: closes, dispatch_estimate: clip(b.dispatch_estimate, 120).replace(/[<>]/g, ""),
      supplier: clip(b.supplier, 200), supplier_notes: clip(b.supplier_notes, 2000),
      personalisation: JSON.stringify(fields), bundle_items: JSON.stringify(ids(b.bundle_items)), addons: JSON.stringify(ids(b.addons)),
      gift_months: JSON.stringify(giftMonths), safety_checked: b.safety_checked ? 1 : 0,
    },
  };
}

/** Square's fee (2.2%) and the owner's profit per sale, from the owner's own numbers. */
export function profitFor(p: { price_cents: number | null; wholesale_cents: number | null; postage_cents: number | null }) {
  if (p.price_cents == null) return null;
  const fee = Math.round(p.price_cents * 0.022);
  return { fee_cents: fee, profit_cents: p.price_cents - fee - (p.wholesale_cents ?? 0), postage_cents: p.postage_cents ?? 0, cost_known: p.wholesale_cents != null };
}
