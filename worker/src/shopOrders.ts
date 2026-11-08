// Public shop orders: books bought without an account. Paid through Square; downloads use a private order link.
//
// - The browser sends book ids and an email. Prices come from the stored books, never the browser.
// - Each order gets a random download token; only its SHA-256 is stored. The token is in the link Square sends the
//   buyer back to, and in the receipt email. Nothing unlocks until Square's signed webhook confirms the payment and
//   the paid amount matches the order total.
import { sendEmail } from "./email";
import type { Env } from "./types";

type DB = D1Database;
export type ShopLine = { book_id: string; title: string; amount_cents: number };

const CREATE = `CREATE TABLE IF NOT EXISTS shop_orders (
  id TEXT PRIMARY KEY, email TEXT NOT NULL, lines TEXT NOT NULL, total_cents INTEGER NOT NULL, token_hash TEXT NOT NULL,
  created_at TEXT NOT NULL, paid_at TEXT, payment_ref TEXT, downloads INTEGER NOT NULL DEFAULT 0, emailed_at TEXT)`;
const ready = new WeakMap<object, Promise<void>>();
export function ensureShopOrders(db: DB): Promise<void> {
  let p = ready.get(db);
  if (!p) {
    const made: Promise<void> = db.prepare(CREATE).run().then(() => undefined).catch((e) => { ready.delete(db); throw e; });
    ready.set(db, made);
    p = made;
  }
  return p;
}

export const MAX_SHOP_DOWNLOADS = 25;
const hex = (b: ArrayBuffer | Uint8Array) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
export const hashToken = async (t: string) => hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)));

export async function createShopOrder(db: DB, email: string, lines: ShopLine[], now: Date = new Date()): Promise<{ id: string; token: string; total: number }> {
  await ensureShopOrders(db);
  const id = crypto.randomUUID();
  const token = hex(crypto.getRandomValues(new Uint8Array(24)));
  const total = lines.reduce((n, l) => n + l.amount_cents, 0);
  await db.prepare("INSERT INTO shop_orders (id, email, lines, total_cents, token_hash, created_at) VALUES (?, ?, ?, ?, ?, ?)")
    .bind(id, email, JSON.stringify(lines), total, await hashToken(token), now.toISOString()).run();
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
export async function recordPaidShopOrder(db: DB, env: Env, orderId: string, paidCents: number, ref: string, origin: string, now: Date = new Date()): Promise<string> {
  await ensureShopOrders(db);
  const row = await db.prepare("SELECT id, email, lines, total_cents, paid_at, emailed_at FROM shop_orders WHERE id = ?").bind(orderId).first<any>();
  if (!row) return "shop order not found";
  if (Number(row.total_cents) !== paidCents) return `shop order ${orderId} paid ${paidCents} does not match ${row.total_cents}`;
  await db.prepare("UPDATE shop_orders SET paid_at = COALESCE(paid_at, ?), payment_ref = COALESCE(payment_ref, ?) WHERE id = ?").bind(now.toISOString(), ref, orderId).run();
  if (!row.emailed_at) {
    // The receipt can't contain the download token (only its hash is stored), so it links to "get my downloads",
    // which emails a fresh private link to this address.
    let lines: ShopLine[] = [];
    try { lines = JSON.parse(row.lines); } catch { lines = []; }
    const list = lines.map((l) => `• ${l.title}`).join("\n");
    const link = `${origin}/shop/downloads`;
    const sent = await sendEmail(env, {
      to: row.email,
      subject: "Your Side-Quest books are ready",
      text: `Thanks for your order!\n\n${list}\n\nYou can download your books from the page you returned to after paying. If you closed it, get your download links again here: ${link}\n\nSide-Quest`,
      html: `<p>Thanks for your order!</p><ul>${lines.map((l) => `<li>${l.title.replace(/[<>&]/g, "")}</li>`).join("")}</ul><p>You can download your books from the page you returned to after paying. If you closed it, <a href="${link}">get your download links again here</a>.</p><p>Side-Quest</p>`,
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
