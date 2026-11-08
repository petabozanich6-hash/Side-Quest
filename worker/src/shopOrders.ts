// Public shop orders: books bought without an account. Paid through Square; downloads use a private order link.
//
// - The browser sends book ids and an email. Prices come from the stored books, never the browser.
// - Each order gets a random download token; only its SHA-256 is stored. The token is in the link Square sends the
//   buyer back to, and in the receipt email. Nothing unlocks until Square's signed webhook confirms the payment and
//   the paid amount matches the order total.
import { sendEmail } from "./email";
import type { Env } from "./types";

type DB = D1Database;
/** A book PDF (book_id) or a catalogue product (product_id, with variant, quantity and personalisation). */
export type ShopLine = {
  book_id?: string; product_id?: string; variant_id?: string | null; title: string; amount_cents: number;
  qty?: number; unit_cents?: number; personalisation?: Record<string, string>; gift_months?: number | null; physical?: boolean;
};

const CREATE = `CREATE TABLE IF NOT EXISTS shop_orders (
  id TEXT PRIMARY KEY, email TEXT NOT NULL, lines TEXT NOT NULL, total_cents INTEGER NOT NULL, token_hash TEXT NOT NULL,
  created_at TEXT NOT NULL, paid_at TEXT, payment_ref TEXT, downloads INTEGER NOT NULL DEFAULT 0, emailed_at TEXT)`;
const ready = new WeakMap<object, Promise<void>>();
const COLUMNS = ["status TEXT NOT NULL DEFAULT 'pending'", "shipping TEXT", "postage_cents INTEGER NOT NULL DEFAULT 0", "tracking TEXT", "notes TEXT", "updated_at TEXT", "quoted_postcode TEXT", "shipping_service TEXT"];
export function ensureShopOrders(db: DB): Promise<void> {
  let p = ready.get(db);
  if (!p) {
    const made: Promise<void> = (async () => {
      await db.prepare(CREATE).run();
      for (const c of COLUMNS) await db.prepare(`ALTER TABLE shop_orders ADD COLUMN ${c}`).run().catch(() => undefined);
    })().catch((e) => { ready.delete(db); throw e; });
    ready.set(db, made);
    p = made;
  }
  return p;
}

export const MAX_SHOP_DOWNLOADS = 25;
const hex = (b: ArrayBuffer | Uint8Array) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
export const hashToken = async (t: string) => hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)));

export async function createShopOrder(db: DB, email: string, lines: ShopLine[], now: Date = new Date(), postageCents = 0, quotedPostcode: string | null = null): Promise<{ id: string; token: string; total: number }> {
  await ensureShopOrders(db);
  const id = crypto.randomUUID();
  const token = hex(crypto.getRandomValues(new Uint8Array(24)));
  const total = lines.reduce((n, l) => n + l.amount_cents, 0) + postageCents;
  await db.prepare("INSERT INTO shop_orders (id, email, lines, total_cents, token_hash, created_at, postage_cents, status, quoted_postcode, shipping_service) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)")
    .bind(id, email, JSON.stringify(lines), total, await hashToken(token), now.toISOString(), postageCents, quotedPostcode, quotedPostcode ? "Parcel Post" : null).run();
  return { id, token, total };
}

/** The order, only if the token matches. */
export async function shopOrderFor(db: DB, id: string, token: string) {
  await ensureShopOrders(db);
  if (!/^[0-9a-f-]{36}$/.test(id) || !/^[0-9a-f]{48}$/.test(token)) return null;
  const row = await db.prepare("SELECT * FROM shop_orders WHERE id = ?").bind(id).first<any>();
  if (!row || row.token_hash !== (await hashToken(token))) return null;
  let lines: ShopLine[] = [];
  try { lines = JSON.parse(row.lines); } catch { lines = []; }
  return { ...row, lines: lines as ShopLine[] };
}

/** Called only after Square's signed webhook: marks the order paid (if the amount matches) and emails the receipt once. */
export async function recordPaidShopOrder(db: DB, env: Env, orderId: string, paidCents: number, ref: string, origin: string, now: Date = new Date(), shipping?: unknown): Promise<string> {
  await ensureShopOrders(db);
  const row = await db.prepare("SELECT id, email, lines, total_cents, paid_at, emailed_at, quoted_postcode FROM shop_orders WHERE id = ?").bind(orderId).first<any>();
  if (!row) return "shop order not found";
  if (Number(row.total_cents) !== paidCents) return `shop order ${orderId} paid ${paidCents} does not match ${row.total_cents}`;
  let parsed: ShopLine[] = [];
  try { parsed = JSON.parse(row.lines); } catch { parsed = []; }
  const physical = parsed.some((l) => l.physical);
  // Square collects the final address after our postcode-specific quote.
  // Do not auto-fulfil a paid order if the buyer changed their postcode at Square.
  const receivedPostcode = shipping && typeof shipping === "object" ? String((shipping as any).postal_code || "") : "";
  const addressMismatch = physical && !!row.quoted_postcode && receivedPostcode !== String(row.quoted_postcode);
  const first = await db.prepare(`UPDATE shop_orders SET paid_at = ?, payment_ref = ?, status = ?, shipping = ?, updated_at = ? WHERE id = ? AND paid_at IS NULL`)
    .bind(now.toISOString(), ref, addressMismatch ? "address_review" : physical ? "to_fulfil" : "complete", shipping ? JSON.stringify(shipping).slice(0, 2000) : null, now.toISOString(), orderId).run();
  // Stock comes off once, on the first confirmation only.
  if ((first as any)?.meta?.changes) await takeStock(db, env, parsed);
  if (!row.emailed_at) {
    // The receipt can't contain the download token (only its hash is stored), so it links to "get my downloads",
    // which emails a fresh private link to this address.
    let lines: ShopLine[] = [];
    try { lines = JSON.parse(row.lines); } catch { lines = []; }
    const list = lines.map((l) => `• ${l.qty && l.qty > 1 ? `${l.qty} × ` : ""}${l.title}`).join("\n");
    const link = `${origin}/shop/downloads`;
    const downloads = lines.some((l) => l.book_id || (l.product_id && !l.physical));
    const posted = lines.some((l) => l.physical);
    const notes = [
      downloads ? `Your downloads are on the page you returned to after paying. If you closed it, get your download links again here: ${link}` : "",
      posted ? "We'll email you when your parcel is on its way." : "",
    ].filter(Boolean);
    const esc = (x: string) => x.replace(/[<>&]/g, "");
    const sent = await sendEmail(env, {
      to: row.email,
      subject: "Thanks for your Side-Quest order",
      text: `Thanks for your order!\n\n${list}\n\n${notes.join("\n\n")}\n\nSide-Quest`,
      html: `<p>Thanks for your order!</p><ul>${lines.map((l) => `<li>${l.qty && l.qty > 1 ? `${l.qty} × ` : ""}${esc(l.title)}</li>`).join("")}</ul>${downloads ? `<p>Your downloads are on the page you returned to after paying. If you closed it, <a href="${link}">get your download links again here</a>.</p>` : ""}${posted ? "<p>We'll email you when your parcel is on its way.</p>" : ""}<p>Side-Quest</p>`,
    }).catch(() => false);
    if (sent) await db.prepare("UPDATE shop_orders SET emailed_at = ? WHERE id = ?").bind(now.toISOString(), orderId).run();
  }
  return `shop order ${orderId} paid`;
}

/** "Get my downloads again": re-issues a fresh private link for each paid order of this email (old links stop working). */
export async function resendShopLinks(db: DB, env: Env, email: string, origin: string): Promise<number> {
  await ensureShopOrders(db);
  const { results } = await db.prepare("SELECT id, lines FROM shop_orders WHERE email = ? AND paid_at IS NOT NULL ORDER BY created_at DESC LIMIT 20").bind(email).all<any>();
  const rows = results || [];
  if (!rows.length) return 0;
  const links: string[] = [];
  for (const r of rows) {
    const token = hex(crypto.getRandomValues(new Uint8Array(24)));
    await db.prepare("UPDATE shop_orders SET token_hash = ? WHERE id = ?").bind(await hashToken(token), r.id).run();
    let lines: ShopLine[] = [];
    try { lines = JSON.parse(r.lines); } catch { lines = []; }
    links.push(`${lines.map((l) => l.title).join(", ")}\n${origin}/shop/order/${r.id}?t=${token}`);
  }
  await sendEmail(env, {
    to: email,
    subject: "Your Side-Quest download links",
    text: `Here are your download links:\n\n${links.join("\n\n")}\n\nEach link is private to you. Side-Quest`,
    html: `<p>Here are your download links:</p>${links.map((l) => { const [t, u] = l.split("\n"); return `<p>${t.replace(/[<>&]/g, "")}<br><a href="${u}">${u}</a></p>`; }).join("")}<p>Each link is private to you.</p><p>Side-Quest</p>`,
  }).catch(() => false);
  return rows.length;
}


/** Reduces stock for sold product lines (variant or product) and emails the owner when something runs low. */
async function takeStock(db: DB, env: Env, lines: ShopLine[]) {
  const low: string[] = [];
  for (const l of lines) {
    if (!l.product_id) continue;
    const qty = Math.max(1, Number(l.qty) || 1);
    try {
      if (l.variant_id) {
        await db.prepare("UPDATE shop_variants SET stock = MAX(0, stock - ?) WHERE id = ? AND stock IS NOT NULL").bind(qty, l.variant_id).run();
        const v = await db.prepare("SELECT v.stock, v.name, p.low_stock_at, p.title FROM shop_variants v JOIN shop_products p ON p.id = v.product_id WHERE v.id = ?").bind(l.variant_id).first<any>();
        if (v && v.stock != null && v.low_stock_at != null && v.stock <= v.low_stock_at) low.push(`${v.title} (${v.name}): ${v.stock} left`);
      } else {
        await db.prepare("UPDATE shop_products SET stock = MAX(0, stock - ?) WHERE id = ? AND stock IS NOT NULL").bind(qty, l.product_id).run();
        const p = await db.prepare("SELECT stock, low_stock_at, title FROM shop_products WHERE id = ?").bind(l.product_id).first<any>();
        if (p && p.stock != null && p.low_stock_at != null && p.stock <= p.low_stock_at) low.push(`${p.title}: ${p.stock} left`);
      }
    } catch (e: any) { console.error("shop stock update failed", e?.message); }
  }
  const to = String((env as any).OWNER_NOTIFICATION_EMAIL || "").trim();
  if (low.length && to) {
    await sendEmail(env, { to, subject: "Side-Quest Shop: low stock", text: `These are running low:\n\n${low.join("\n")}\n\nOwner HQ → Shop to restock.`, html: `<p>These are running low:</p><ul>${low.map((x) => `<li>${x.replace(/[<>&]/g, "")}</li>`).join("")}</ul><p>Owner HQ → Shop to restock.</p>` }).catch(() => false);
  }
}

/** Paid units per product (for pre-order targets). */
export async function paidUnitsByProduct(db: DB): Promise<Map<string, number>> {
  await ensureShopOrders(db);
  const { results } = await db.prepare("SELECT lines FROM shop_orders WHERE paid_at IS NOT NULL AND status != 'cancelled' ORDER BY created_at DESC LIMIT 5000").all<{ lines: string }>();
  const out = new Map<string, number>();
  for (const r of results || []) {
    let ls: ShopLine[] = [];
    try { ls = JSON.parse(r.lines); } catch { ls = []; }
    for (const l of ls) if (l.product_id) out.set(l.product_id, (out.get(l.product_id) || 0) + Math.max(1, Number(l.qty) || 1));
  }
  return out;
}
