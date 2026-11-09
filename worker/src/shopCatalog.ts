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
import { STAGES, stageFor } from "./shopStages";
import { SHOP_PREFILL } from "./data/shopPrefill";
import { DIGITAL_DELIVERY, SIZES, SUB_CUTOFF_DAY, SUB_DISPATCH_DAY, WEEKLY_DISPATCH, holdBack, launchEntry, oneOffFor } from "./data/shopLaunchPrices";
import { clearSettingsCache, loadPlatformSettings } from "./platformSettings";

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
      // Development stage (Launch Now / Professional Manufacturing Later / Future Expansion) and the monthly-box
      // options: a one-off price, the dispatch day and the order cutoff day each month.
      await db.prepare("ALTER TABLE shop_products ADD COLUMN stage TEXT").run().catch(() => undefined);
      // A digital-only version of a physical product (for example the instructions or printables, so a family can
      // source the materials themselves): its price, and whether its download file has been uploaded.
      for (const name of ["one_off_cents", "dispatch_day", "cutoff_day", "digital_cents"]) {
        await db.prepare(`ALTER TABLE shop_products ADD COLUMN ${name} INTEGER`).run().catch(() => undefined);
      }
      await db.prepare("ALTER TABLE shop_products ADD COLUMN digital_file INTEGER NOT NULL DEFAULT 0").run().catch(() => undefined);
      await seedCatalog(db);
      await assignStages(db);
      await applyPrefill(db);
      await applyLaunch(db);
      await applyTierPrices(db);
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
    stmts.push(db.prepare(`INSERT OR IGNORE INTO shop_products (id, slug, department, collection, title, description, tags, status, fulfilment, visible, sort, personalisation, prints_books, stage, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', ?, 0, ?, ?, ?, ?, ?, ?)`)
      .bind(id, slug, p.department, p.collection, p.title, p.description, JSON.stringify(p.tags), p.fulfilment, startSort + i, JSON.stringify(p.personalisation || []), p.prints_books ? 1 : 0, stageFor(p), now, now));
    // "Who it's for", age bands and similar options, with no price or stock yet.
    (p.variants || []).forEach((name, j) => stmts.push(db.prepare("INSERT OR IGNORE INTO shop_variants (id, product_id, name, sort) VALUES (?, ?, ?, ?)").bind(crypto.randomUUID(), id, name, j)));
  });
  return stmts;
}

/**
 * Fills in ready-to-use descriptions, options and personalisation fields once. Never overwrites the owner's work:
 * a description is only replaced while it still matches the original placeholder (or is empty), and options or
 * personalisation fields are only added to products that have none. Prices, costs, suppliers, stock, photos and
 * parcel measurements are never touched.
 */
async function applyPrefill(db: DB) {
  const key = "prefill_v1";
  if (await db.prepare("SELECT value FROM shop_meta WHERE key = ?").bind(key).first()) return;
  const original = new Map([...SHOP_SEED, ...SHOP_ADDITIONS.flatMap((b) => b.products)].map((p) => [p.title, p.description]));
  const { results } = await db.prepare("SELECT p.id, p.title, p.description, p.personalisation, (SELECT COUNT(*) FROM shop_variants v WHERE v.product_id = p.id) AS nvar FROM shop_products p").all<any>();
  const stmts: D1PreparedStatement[] = [];
  for (const r of results || []) {
    const fill = SHOP_PREFILL[r.title];
    if (!fill) continue;
    if (!r.description || r.description === original.get(r.title)) {
      stmts.push(db.prepare("UPDATE shop_products SET description = ? WHERE id = ? AND description = ?").bind(fill.d, r.id, r.description || ""));
    }
    if (fill.p?.length && (!r.personalisation || r.personalisation === "[]")) {
      const fields = fill.p.map((f) => ({ key: slugify(f.label).slice(0, 30) || "field", label: f.label, max: f.max, required: f.required }));
      stmts.push(db.prepare("UPDATE shop_products SET personalisation = ? WHERE id = ? AND personalisation = ?").bind(JSON.stringify(fields), r.id, r.personalisation || "[]"));
    }
    if (fill.v?.length && Number(r.nvar) === 0) {
      fill.v.forEach((name, j) => stmts.push(db.prepare("INSERT INTO shop_variants (id, product_id, name, sort) VALUES (?, ?, ?, ?)").bind(crypto.randomUUID(), r.id, name, j)));
    }
  }
  for (let i = 0; i < stmts.length; i += 50) await db.batch(stmts.slice(i, i + 50));
  await db.prepare("INSERT OR REPLACE INTO shop_meta (key, value) VALUES (?, ?)").bind(key, new Date().toISOString()).run();
}

/**
 * The shop launch (once, 9 Nov 2026): every untouched draft becomes a live, buyable listing with a starting price,
 * except the owner's unfinished workbooks (see holdBack). Only empty fields are filled: a price, measurement, date
 * or dispatch note the owner already entered is kept, and products the owner has already published, hidden or
 * discontinued are left alone. Physical products are Made to Order (posted in the weekly dispatch), digital ones
 * In Stock. Every launched product is moved to Launch Now so it can be bought. Finally the public shop is opened.
 */
export async function applyLaunch(db: DB) {
  const key = "launch_v1";
  if (await db.prepare("SELECT value FROM shop_meta WHERE key = ?").bind(key).first()) return;
  const now = new Date().toISOString();
  const { results } = await db.prepare("SELECT * FROM shop_products WHERE status = 'draft' AND visible = 0").all<any>();
  const vars = await variantsFor(db, (results || []).map((r: any) => r.id));
  const stmts: D1PreparedStatement[] = [];
  for (const p of results || []) {
    if (holdBack(p)) continue;
    const entry = launchEntry(p);
    if (!entry) continue;
    const digital = p.fulfilment === "digital";
    const sub = SUBSCRIPTION_FULFILMENT.has(p.fulfilment);
    const size = SIZES[entry.s];
    const price = p.price_cents ?? entry.p;
    const oneOff = sub ? p.one_off_cents ?? oneOffFor(price, p.fulfilment) : p.one_off_cents;
    stmts.push(db.prepare(`UPDATE shop_products SET status = ?, visible = 1, stage = 'launch_now', price_cents = ?, one_off_cents = ?,
        dispatch_day = ?, cutoff_day = ?, dispatch_estimate = ?,
        parcel_weight_g = COALESCE(parcel_weight_g, ?), parcel_length_cm = COALESCE(parcel_length_cm, ?),
        parcel_width_cm = COALESCE(parcel_width_cm, ?), parcel_height_cm = COALESCE(parcel_height_cm, ?), updated_at = ?
      WHERE id = ? AND status = 'draft' AND visible = 0`)
      .bind(digital ? "in_stock" : "made_to_order", price, oneOff ?? null,
        sub ? p.dispatch_day ?? SUB_DISPATCH_DAY : p.dispatch_day ?? null, sub ? p.cutoff_day ?? SUB_CUTOFF_DAY : p.cutoff_day ?? null,
        p.dispatch_estimate || (digital ? DIGITAL_DELIVERY : WEEKLY_DISPATCH),
        digital ? null : size.g, digital ? null : size.l, digital ? null : size.w, digital ? null : size.h, now, p.id));
    // Size and tier options with their own price (e.g. A3 / A2 posters); other options use the product price.
    for (const v of vars.get(p.id) || []) {
      const vp = entry.v?.[v.name];
      if (vp != null && v.price_cents == null) stmts.push(db.prepare("UPDATE shop_variants SET price_cents = ? WHERE id = ? AND price_cents IS NULL").bind(vp, v.id));
    }
  }
  for (let i = 0; i < stmts.length; i += 50) await db.batch(stmts.slice(i, i + 50));
  const settings = await loadPlatformSettings(db, { fresh: true });
  if (!settings.features.shopOpen) {
    // Same write as Owner HQ's switch, with no user attached (the launch isn't a person).
    await db.prepare(`INSERT INTO platform_settings (key, value_json, updated_by, updated_at) VALUES ('features', ?, NULL, ?)
      ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_by = NULL, updated_at = excluded.updated_at`)
      .bind(JSON.stringify({ ...settings.features, shopOpen: true }), now).run();
    clearSettingsCache();
  }
  await db.prepare("INSERT OR REPLACE INTO shop_meta (key, value) VALUES (?, ?)").bind(key, now).run();
}

/** Option names that are tiers of the same product (bigger kit, bigger price), not sizes or ages. */
export const TIER_NAME = /\b(basic|basics|starter|standard|essentials?|full|package|premium|deluxe|complete|ultimate|bumper|mega|plus|pro)\b/i;
/** Each tier up costs this much more than the first (by the order the options are listed). */
export const TIER_STEPS = [1, 1.6, 2.2, 2.8];
export const tierPrice = (base: number, rank: number) => rank === 0 ? base : Math.max(base + 100, Math.round((base * (TIER_STEPS[rank] ?? 1 + rank * 0.6)) / 100) * 100 - 5);

/**
 * Once (9 Nov 2026): products whose options are tiers ("Basics", "Full package", or options that each list what's
 * included) get a rising price per tier, starting from the product price. Only options with no price of their own are
 * set, and only when none of that product's options has a price yet, so the owner's own tier prices are kept.
 */
export async function applyTierPrices(db: DB) {
  const key = "tiers_v1";
  if (await db.prepare("SELECT value FROM shop_meta WHERE key = ?").bind(key).first()) return;
  const { results } = await db.prepare("SELECT id, price_cents FROM shop_products WHERE price_cents IS NOT NULL").all<any>();
  const vars = await variantsFor(db, (results || []).map((r: any) => r.id));
  const stmts: D1PreparedStatement[] = [];
  for (const p of results || []) {
    const list = (vars.get(p.id) || []).filter((v) => v.active && !v.book_id);
    if (list.length < 2 || list.some((v) => v.price_cents != null)) continue;
    const tiers = list.filter((v) => TIER_NAME.test(v.name)).length >= 2 || list.every((v) => String(v.details || "").trim());
    if (!tiers) continue;
    list.forEach((v, rank) => stmts.push(db.prepare("UPDATE shop_variants SET price_cents = ? WHERE id = ? AND price_cents IS NULL").bind(tierPrice(p.price_cents, rank), v.id)));
  }
  for (let i = 0; i < stmts.length; i += 50) await db.batch(stmts.slice(i, i + 50));
  await db.prepare("INSERT OR REPLACE INTO shop_meta (key, value) VALUES (?, ?)").bind(key, new Date().toISOString()).run();
}

/**
 * Gives every product without a development stage one (once per new reconciliation). Only the stage column is
 * written: prices, descriptions, options, images, suppliers, status and visibility are left exactly as they are.
 */
async function assignStages(db: DB) {
  const key = "staged_v1";
  if (await db.prepare("SELECT value FROM shop_meta WHERE key = ?").bind(key).first()) return;
  const { results } = await db.prepare("SELECT id, title, department, fulfilment FROM shop_products WHERE stage IS NULL").all<any>();
  const stmts = (results || []).map((r) => db.prepare("UPDATE shop_products SET stage = ? WHERE id = ? AND stage IS NULL").bind(stageFor(r), r.id));
  for (let i = 0; i < stmts.length; i += 50) await db.batch(stmts.slice(i, i + 50));
  await db.prepare("INSERT OR REPLACE INTO shop_meta (key, value) VALUES (?, ?)").bind(key, new Date().toISOString()).run();
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

/** A product sold physically that also offers a digital-only version with its file uploaded. */
export function digitalVersion(p: any): boolean {
  return p.fulfilment !== "digital" && p.digital_cents != null && !!p.digital_file && isPublic(p);
}
export function isPublic(p: any) { return !!p.visible && p.status !== "draft" && p.status !== "discontinued"; }

/** Home education registration resources need an independent review before sale.
 * Collection is checked as well as tags so a routine tag edit cannot bypass it. */
export function isHomeEducationDocument(p: any): boolean {
  if (String(p?.collection || "").trim().toLowerCase() === "home education documents") return true;
  const tags = Array.isArray(p?.tags) ? p.tags : (() => {
    try { const value = JSON.parse(String(p?.tags || "")); return Array.isArray(value) ? value : []; }
    catch { return []; }
  })();
  return tags.includes("home-education-document");
}

/** Whether a public product can be bought right now (and why not, for the owner). */
export function buyable(p: any, variants: any[] = [], now: Date = new Date()): { ok: boolean; reason?: string } {
  if (!isPublic(p)) return { ok: false, reason: "Hidden" };
  if (!SELLING.has(p.status)) return { ok: false, reason: STATUS_LABELS[p.status] };
  if (isHomeEducationDocument(p)) return { ok: false, reason: "State requirements and document quality review pending" };
  // A digital listing cannot take payment until there is an actual private file to deliver.
  // In particular this protects state-specific documents from being sold before their PDFs exist.
  if (p.fulfilment === "digital" && !p.digital_file) return { ok: false, reason: "Download file not uploaded" };
  // Products waiting for professional manufacturing or future expansion can't be sold as ready to make or send.
  if (p.stage && p.stage !== "launch_now" && p.status !== "pre_order") return { ok: false, reason: "Not in production yet" };
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
    one_off_cents: SUBSCRIPTION_FULFILMENT.has(p.fulfilment) ? p.one_off_cents ?? null : null,
    dispatch_day: SUBSCRIPTION_FULFILMENT.has(p.fulfilment) ? p.dispatch_day ?? null : null,
    cutoff_day: SUBSCRIPTION_FULFILMENT.has(p.fulfilment) ? p.cutoff_day ?? null : null,
    digital_cents: digitalVersion(p) ? p.digital_cents : null,
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
  for (const k of ["price_cents", "wholesale_cents", "postage_cents", "one_off_cents", "digital_cents"]) {
    const v = cents(b[k]);
    if (v === "bad") return { ok: false, detail: "Prices and costs must be whole cents between $0 and $10,000." };
    money[k] = v;
  }
  if (money.price_cents !== null && money.price_cents < 50 && money.price_cents !== 0) return { ok: false, detail: "Prices under 50c can't be charged by card." };
  if (money.digital_cents !== null && money.digital_cents < 50) return { ok: false, detail: "The digital version's price must be at least 50c." };
  if (fulfilment === "digital") money.digital_cents = null; // already a download
  const ints: Record<string, number | null> = {};
  for (const [k, max] of [["lead_time_days", 365], ["stock", 100000], ["low_stock_at", 100000], ["max_per_order", 1000], ["preorder_target", 100000], ["parcel_weight_g", 22000], ["parcel_length_cm", 105], ["parcel_width_cm", 105], ["parcel_height_cm", 105], ["dispatch_day", 28], ["cutoff_day", 28]] as const) {
    const v = intOrNull(b[k], max);
    if (v === "bad") return { ok: false, detail: `${k.replace(/_/g, " ")} must be a whole number.` };
    ints[k] = v;
  }
  if ((ints.dispatch_day !== null && ints.dispatch_day < 1) || (ints.cutoff_day !== null && ints.cutoff_day < 1)) return { ok: false, detail: "Dispatch and cutoff days are days of the month, 1 to 28." };
  const stage = b.stage === undefined || b.stage === null || b.stage === "" ? undefined : String(b.stage);
  if (stage !== undefined && !(STAGES as readonly string[]).includes(stage)) return { ok: false, detail: "Unknown development stage." };
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
      ...(stage ? { stage } : {}),
    },
  };
}

/** Square's fee (2.2%) and the owner's profit per sale, from the owner's own numbers. */
export function profitFor(p: { price_cents: number | null; wholesale_cents: number | null; postage_cents: number | null }) {
  if (p.price_cents == null) return null;
  const fee = Math.round(p.price_cents * 0.022);
  return { fee_cents: fee, profit_cents: p.price_cents - fee - (p.wholesale_cents ?? 0), postage_cents: p.postage_cents ?? 0, cost_known: p.wholesale_cents != null };
}
