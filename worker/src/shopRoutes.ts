// Shop catalogue routes: the public product side of /api/shop and the owner's Shop tab in Owner HQ.
//
// Public routes only work while the owner has opened the shop (features.shopOpen) and only show products the owner
// has switched on. Prices, stock and postage always come from the database, never the browser. Costs, suppliers and
// interest emails are owner-only.
import type { Context, Hono, Next } from "hono";
import {
  DEPARTMENTS, FULFILMENT_LABELS, STATUSES, STATUS_LABELS, SUBSCRIPTION_FULFILMENT, buyable, digitalVersion, ensureShopCatalog, isPublic, isHomeEducationDocument,
  productRow, profitFor, publicProduct, slugify, validateProduct, variantsFor, type PersonalField,
} from "./shopCatalog";
import { ensureShopOrders, paidUnitsByProduct, shopOrderFor, type ShopLine } from "./shopOrders";
import { cancelShopSubscription, ensureShopSubscriptions, shopSubscriptionFor, startShopSubscription, validateRecipient } from "./shopSubscriptions";
import { squareConfig } from "./square";
import { loadPlatformSettings } from "./platformSettings";
import { hitRateLimit, writeAudit } from "./adminAudit";
import { appOrigin } from "./billing";
import { sendEmail } from "./email";
import type { App, Env } from "./types";
import { listBooks } from "./questBooks";
import { STAGES, STAGE_LABELS, stageFor } from "./shopStages";
import { quoteStandardPost, ShippingQuoteError } from "./shopShipping";
import { guidedProductState, mayAccessGuidedDocument } from "./documentEntitlement";
import { documentKind, familyDocumentPrice } from "./familyDocumentPricing";
import { generateHomeEducationTemplate } from "./homeEducationPdf";
import { sha256 } from "./documentReview";
import { buildGuestPlan, emailGuestPdf, guestPlanHtml, renderGuestPdf, validateGuestInput } from "./guestDocumentDelivery";
import { sampleGuidedDocumentData } from "./documentStudioPreview";

type DB = D1Database;
const EMAIL_RE = /^[^\s@<>]{1,64}@[^\s@<>]{1,190}\.[a-z]{2,}$/i;
const UUID = /^[0-9a-f-]{36}$/;
export const MAX_PRODUCT_IMAGES = 6;
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const MAX_FILE_BYTES = 25 * 1024 * 1024;
const imageKey = (id: string, n: number) => `shop/products/${id}/img-${n}`;
const fileKey = (id: string) => `shop/products/${id}/file`;

export async function shopIsOpen(db: DB) {
  try { return (await loadPlatformSettings(db)).features.shopOpen === true; } catch { return false; }
}

async function allProducts(db: DB): Promise<any[]> {
  await ensureShopCatalog(db);
  const { results } = await db.prepare("SELECT * FROM shop_products ORDER BY department, sort, title").all<any>();
  return (results || []).map(productRow);
}

/** Everything the public shop can show: switched-on products with their public view. */
export async function publicCatalog(db: DB, now: Date = new Date()) {
  const products = (await allProducts(db)).filter(isPublic);
  const variants = await variantsFor(db, products.map((p) => p.id));
  const units = products.some((p) => p.status === "pre_order") ? await paidUnitsByProduct(db) : new Map<string, number>();
  const shown = products.map((p) => publicProduct(p, variants.get(p.id) || [], units.get(p.id) || 0, now));
  const used = new Set(shown.map((p) => p.department));
  return {
    departments: DEPARTMENTS.filter((d) => used.has(d.id)),
    collections: [...new Set(shown.map((p) => p.collection).filter(Boolean))].sort(),
    products: shown,
  };
}

// ---------------------------------------------------------------- pricing a cart

export type ItemIn = { product_id?: unknown; variant_id?: unknown; qty?: unknown; child_count?: unknown; personalisation?: unknown; gift_months?: unknown; one_off?: unknown; digital?: unknown };

function cleanPersonalisation(fields: PersonalField[], given: unknown): Record<string, string> | string {
  const src = given && typeof given === "object" ? (given as Record<string, unknown>) : {};
  const out: Record<string, string> = {};
  for (const f of fields) {
    const v = typeof src[f.key] === "string" ? (src[f.key] as string).replace(/[\x00-\x1f\x7f<>]/g, " ").trim() : "";
    if (f.required && !v) return `Fill in "${f.label}".`;
    if (v.length > f.max) return `"${f.label}" can be up to ${f.max} characters.`;
    if (v) out[f.key] = v;
  }
  return out;
}

/** Prices product items from the database. Postage is charged once per order: the highest postage of the parcel. */
export async function priceItems(db: DB, items: ItemIn[], now: Date = new Date()): Promise<{ ok: true; lines: ShopLine[]; postage: number; physical: boolean } | { ok: false; detail: string }> {
  await ensureShopCatalog(db);
  const list = items.slice(0, 30);
  const ids = [...new Set(list.map((i) => String(i?.product_id || "")).filter((x) => UUID.test(x)))];
  if (!ids.length) return { ok: true, lines: [], postage: 0, physical: false };
  const { results } = await db.prepare(`SELECT * FROM shop_products WHERE id IN (${ids.map(() => "?").join(",")})`).bind(...ids).all<any>();
  const products = new Map<string, any>((results || []).map((r: any) => [r.id, productRow(r)]));
  const variants = await variantsFor(db, ids);
  const lines: ShopLine[] = [];
  let postage = 0;
  const perProduct = new Map<string, number>();
  for (const it of list) {
    const p = products.get(String(it?.product_id || ""));
    if (!p) return { ok: false, detail: "Something in your cart is no longer available." };
    const vs = variants.get(p.id) || [];
    // The digital-only version: one download at its own price. It doesn't depend on stock, options or the physical
    // product's status (a family may want the printables for something not made yet), only on being switched on.
    if (it?.digital === true) {
      if (isHomeEducationDocument(p)) return { ok: false, detail: "State requirements and document quality review pending." };
      if (!digitalVersion(p)) return { ok: false, detail: `The digital version of ${p.title} isn't available.` };
      if (lines.some((l) => l.product_id === p.id && !l.physical)) continue; // one copy is enough
      lines.push({ product_id: p.id, variant_id: null, title: `${p.title} – digital version`, qty: 1, unit_cents: p.digital_cents, amount_cents: p.digital_cents, personalisation: {}, gift_months: null, physical: false });
      continue;
    }
    const ok = buyable(p, vs, now);
    if (!ok.ok) return { ok: false, detail: `${p.title} can't be bought right now (${ok.reason}).` };
    const giftMonths = it?.gift_months != null ? Number(it.gift_months) : null;
    // A monthly box can also be bought once, at its (higher) one-off price.
    const oneOff = it?.one_off === true && SUBSCRIPTION_FULFILMENT.has(p.fulfilment) && p.one_off_cents != null;
    if (SUBSCRIPTION_FULFILMENT.has(p.fulfilment) && !oneOff && !(giftMonths && p.gift_months.includes(giftMonths))) return { ok: false, detail: `${p.title} is a subscription. Start it from its own page.` };
    const active = vs.filter((v) => v.active);
    let variant: any = null;
    if (active.length) {
      variant = active.find((v) => v.id === String(it?.variant_id || ""));
      if (!variant) return { ok: false, detail: `Choose an option for ${p.title}.` };
    }
    const unit = oneOff ? p.one_off_cents : variant?.price_cents ?? p.price_cents;
    if (unit == null) return { ok: false, detail: `${p.title} doesn't have a price yet.` };
    let qty = Math.floor(Number(it?.qty) || 1);
    if (giftMonths) qty = 1;
    const cap = Math.min(p.max_per_order || 20, 50);
    const total = (perProduct.get(p.id) || 0) + qty;
    if (qty < 1 || total > cap) return { ok: false, detail: `You can order up to ${cap} of ${p.title}.` };
    perProduct.set(p.id, total);
    if (p.status === "in_stock") {
      const stock = variant ? variant.stock : p.stock;
      if (stock != null && qty > stock) return { ok: false, detail: stock > 0 ? `Only ${stock} of ${p.title}${variant ? ` (${variant.name})` : ""} left.` : `${p.title}${variant ? ` (${variant.name})` : ""} is sold out.` };
    }
    const pers = cleanPersonalisation(p.personalisation, it?.personalisation);
    if (typeof pers === "string") return { ok: false, detail: pers };
    const physical = p.fulfilment !== "digital";
    const familyKind = documentKind(p);
    // Special family price: one full-price document, $1 extra per guided
    // learner or $3 extra per printed learner, on the same household order.
    // Each child must receive their own output; a family pack is never a
    // licence to share one plan across unrelated households.
    let unitCents = giftMonths ? unit * giftMonths : unit;
    if (familyKind) {
      if (qty !== 1) return {ok:false,detail:"Choose one family document pack and select the number of children."};
      const quote=familyDocumentPrice(p,it?.child_count,unit);
      if(!quote.ok)return {ok:false,detail:quote.detail};
      unitCents=quote.total;
      pers.child_count=String(quote.children);
    }
    const title = `${p.title}${variant ? ` (${variant.name})` : ""}${giftMonths ? ` – ${giftMonths}-month gift` : ""}${oneOff ? " – one-off box" : ""}`;
    lines.push({ product_id: p.id, variant_id: variant?.id || null, title, qty, unit_cents: unitCents, amount_cents: unitCents * qty, personalisation: pers, gift_months: giftMonths, physical });
    if (physical && !giftMonths) postage = Math.max(postage, p.postage_cents ?? 0);
  }
  return { ok: true, lines, postage, physical: lines.some((l) => l.physical) };
}

const personalNote = (l: ShopLine) => Object.entries(l.personalisation || {}).map(([k, v]) => `${k}: ${v}`).join("; ");
export const squareLinesFor = (lines: ShopLine[], postage: number) => [
  ...lines.map((l) => (l.product_id
    ? { name: l.title, amount_cents: l.unit_cents ?? l.amount_cents, quantity: l.qty || 1, note: personalNote(l) || undefined }
    : { name: `Quest Book: ${l.title}`, amount_cents: l.amount_cents })),
  ...(postage > 0 ? [{ name: "Postage", amount_cents: postage }] : []),
];

// ---------------------------------------------------------------- readiness (the launch dashboard)

export function readiness(p: any, variants: any[]): string[] {
  const missing: string[] = [];
  const active = variants.filter((v) => v.active);
  const priced = active.length ? active.every((v) => v.price_cents != null || p.price_cents != null) : p.price_cents != null;
  if (!priced) missing.push("price");
  if (!p.images) missing.push("photo");
  if (!p.description) missing.push("description");
  if (p.fulfilment !== "digital" && !SUBSCRIPTION_FULFILMENT.has(p.fulfilment) && ![p.parcel_weight_g, p.parcel_length_cm, p.parcel_width_cm, p.parcel_height_cm].every((n) => Number.isInteger(Number(n)) && Number(n) > 0)) missing.push("packed weight & dimensions");
  if (p.fulfilment !== "digital" && !p.supplier) missing.push("supplier");
  if (p.fulfilment !== "digital" && p.wholesale_cents == null) missing.push("unit cost");
  if (p.fulfilment === "digital" && !p.has_file) missing.push("download file");
  if (p.fulfilment !== "digital" && p.digital_cents != null && !p.has_file) missing.push("digital version file");
  if (p.status === "pre_order" && (!p.preorder_closes_at || !p.dispatch_estimate)) missing.push("pre-order dates");
  if (p.status === "in_stock" && (active.length ? active.every((v) => v.stock == null) : p.stock == null)) missing.push("stock count");
  if (p.status === "draft" || p.status === "discontinued") missing.push("status");
  if (SUBSCRIPTION_FULFILMENT.has(p.fulfilment)) {
    if (p.one_off_cents == null) missing.push("one-off price");
    else if (p.price_cents != null && p.one_off_cents <= p.price_cents) missing.push("one-off price above the monthly price");
    if (!p.dispatch_day) missing.push("monthly dispatch day");
    if (!p.cutoff_day) missing.push("monthly order cutoff");
    if (p.one_off_cents != null && ![p.parcel_weight_g, p.parcel_length_cm, p.parcel_width_cm, p.parcel_height_cm].every((n) => Number.isInteger(Number(n)) && Number(n) > 0)) missing.push("packed weight & dimensions");
  }
  // Only Launch Now products can be ready to launch; the rest are waiting on manufacturing or expansion.
  if (p.stage && p.stage !== "launch_now") missing.push(p.stage === "pro_manufacturing" ? "professional manufacturing" : "future expansion");
  return missing;
}

// ---------------------------------------------------------------- public routes

export function registerShopCatalog(app: App) {
  const closed = (c: any) => c.json({ detail: "The shop isn't open yet." }, 404);

  // Public, watermarked excerpts of the actual blank/guest document
  // renderer. No private data, paid document bytes, full blank template or
  // order entitlement is exposed. Preview only while product is visible.
  app.get("/api/shop/products/:id/document-sample", async (c) => {
    if (!(await shopIsOpen(c.env.DB))) return closed(c);
    c.header("Cache-Control","no-store");
    c.header("X-Content-Type-Options","nosniff");
    const id=c.req.param("id");
    const year=String(c.req.query("year")||"3");
    if(!UUID.test(id)||!["K","F","Prep",...Array.from({length:12},(_,i)=>String(i+1))].includes(year))
      return c.json({detail:"Preview unavailable."},404);
    await ensureShopCatalog(c.env.DB);
    const product=await c.env.DB.prepare("SELECT id,visible,status,fulfilment,tags,collection FROM shop_products WHERE id=?").bind(id).first<any>();
    if(!product||!isPublic(product)||!isHomeEducationDocument(product))
      return c.json({detail:"Preview unavailable."},404);
    let tags:unknown=[];
    try { tags=JSON.parse(product.tags); } catch {/* not a valid document */}
    if(!Array.isArray(tags)||!tags.includes("home-education-document"))
      return c.json({detail:"Preview unavailable."},404);
    const codes=["NSW","VIC","QLD","WA","SA","TAS","ACT","NT"];
    const matches=codes.filter(code=>tags.includes(code.toLowerCase()));
    if(matches.length!==1)return c.json({detail:"Preview unavailable."},404);
    const rate=await hitRateLimit(c.env.DB,`shop-document-preview:${c.req.header("CF-Connecting-IP")||"?"}`,20,3600);
    if(!rate.ok)return c.json({detail:"Too many previews. Please try later."},429);
    try {
      let pdf:Uint8Array;
      if(tags.includes("guided-document")){
        const sample=sampleGuidedDocumentData(matches[0],year);
        const plan=await buildGuestPlan(c.env.DB,matches[0] as any,sample);
        pdf=await renderGuestPdf(c.env,guestPlanHtml(plan,true));
      }else if(tags.includes("fillable-pdf")||tags.includes("print-and-post")){
        pdf=generateHomeEducationTemplate(matches[0],year,true);
      }else return c.json({detail:"Preview unavailable."},404);
      c.header("Content-Type","application/pdf");
      c.header("Content-Disposition",`inline; filename="sidequest-${matches[0].toLowerCase()}-sample.pdf"`);
      return c.body(pdf);
    }catch(error:any){
      console.error("shop sample PDF failed",error?.message);
      return c.json({detail:"Preview temporarily unavailable."},503);
    }
  });

  app.get("/api/shop/products/:id/images/:n", async (c) => {
    if (!(await shopIsOpen(c.env.DB))) return closed(c);
    const id = c.req.param("id");
    const n = Number(c.req.param("n"));
    if (!UUID.test(id) || !Number.isInteger(n) || n < 1 || n > MAX_PRODUCT_IMAGES || !c.env.BUCKET) return c.json({ detail: "Image not found" }, 404);
    await ensureShopCatalog(c.env.DB);
    const p = await c.env.DB.prepare("SELECT visible, status, images FROM shop_products WHERE id = ?").bind(id).first<any>();
    if (!p || !isPublic(p) || n > p.images) return c.json({ detail: "Image not found" }, 404);
    const obj = await c.env.BUCKET.get(imageKey(id, n));
    if (!obj) return c.json({ detail: "Image not found" }, 404);
    c.header("Content-Type", obj.httpMetadata?.contentType || "image/jpeg");
    c.header("Cache-Control", "public, max-age=300");
    c.header("X-Content-Type-Options", "nosniff");
    return c.body(obj.body);
  });

  // Return server-priced domestic Standard Parcel Post rate; never expose the PAC key or trust client weights.
  app.post("/api/shop/postage/quote", async (c) => {
    if (!(await shopIsOpen(c.env.DB))) return closed(c);
    const limit = await hitRateLimit(c.env.DB, `shop-postage:${c.req.header("CF-Connecting-IP") || "?"}`, 60, 3600);
    if (!limit.ok) return c.json({ detail: "Too many postage requests. Please try later." }, 429);
    const b: any = await c.req.json().catch(() => ({}));
    const priced = await priceItems(c.env.DB, Array.isArray(b.items) ? b.items : []);
    if (!priced.ok) return c.json({ detail: priced.detail }, 409);
    try {
      const q = await quoteStandardPost(c.env, priced.lines, String(b.postcode || ""));
      c.header("Cache-Control", "no-store");
      return c.json({ ...q, postage_cents: q?.postage_cents ?? 0, service: q?.service || null });
    } catch (e) {
      if (e instanceof ShippingQuoteError) return c.json({ detail: e.message }, e.status as 400 | 409 | 503);
      console.error("shop postage quote failed", e);
      return c.json({ detail: "Postage is temporarily unavailable. Please try again." }, 503);
    }
  });

  // "Tell me when it's ready": an email list per product. No payment, no account.
  app.post("/api/shop/interest", async (c) => {
    if (!(await shopIsOpen(c.env.DB))) return closed(c);
    const body: any = await c.req.json().catch(() => ({}));
    const email = String(body?.email || "").trim().toLowerCase();
    const id = String(body?.product_id || "");
    if (!EMAIL_RE.test(email)) return c.json({ detail: "Enter a valid email address." }, 400);
    const limit = await hitRateLimit(c.env.DB, `shop-interest:${c.req.header("CF-Connecting-IP") || "?"}`, 30, 3600);
    if (!limit.ok) return c.json({ detail: "Too many requests. Please try again later." }, 429);
    await ensureShopCatalog(c.env.DB);
    const p = UUID.test(id) ? await c.env.DB.prepare("SELECT id, visible, status FROM shop_products WHERE id = ?").bind(id).first<any>() : null;
    if (!p || !isPublic(p)) return c.json({ detail: "Product not found" }, 404);
    await c.env.DB.prepare("INSERT OR IGNORE INTO shop_interest (product_id, email, created_at) VALUES (?, ?, ?)").bind(id, email, new Date().toISOString()).run();
    return c.json({ ok: true, detail: "Thanks! We'll email you when it's ready." });
  });

  // Dragon Post letters and Monthly Quest boxes: a recurring Square subscription with recipient details.
  app.post("/api/shop/subscribe", async (c) => {
    if (!(await shopIsOpen(c.env.DB))) return closed(c);
    const sq = squareConfig(c.env);
    if (!sq.ok) return c.json({ detail: "Checkout isn't available right now." }, 503);
    const body: any = await c.req.json().catch(() => ({}));
    const email = String(body?.email || "").trim().toLowerCase();
    if (!EMAIL_RE.test(email)) return c.json({ detail: "Enter your email address for receipts and managing the subscription." }, 400);
    const recipient = validateRecipient(body?.recipient);
    if (typeof recipient === "string") return c.json({ detail: recipient }, 400);
    await ensureShopCatalog(c.env.DB);
    const id = String(body?.product_id || "");
    const row = UUID.test(id) ? await c.env.DB.prepare("SELECT * FROM shop_products WHERE id = ?").bind(id).first<any>() : null;
    const p = row ? productRow(row) : null;
    if (!p || !SUBSCRIPTION_FULFILMENT.has(p.fulfilment)) return c.json({ detail: "Subscription not found" }, 404);
    const vs = (await variantsFor(c.env.DB, [p.id])).get(p.id) || [];
    const ok = buyable(p, vs);
    if (!ok.ok) return c.json({ detail: `${p.title} isn't available yet.` }, 409);
    const active = vs.filter((v) => v.active);
    const variant = active.length ? active.find((v) => v.id === String(body?.variant_id || "")) : null;
    if (active.length && !variant) return c.json({ detail: "Choose an option first." }, 400);
    const price = variant?.price_cents ?? p.price_cents;
    if (price == null || price < 100) return c.json({ detail: `${p.title} doesn't have a price yet.` }, 409);
    const pers = cleanPersonalisation(p.personalisation, body?.personalisation);
    if (typeof pers === "string") return c.json({ detail: pers }, 400);
    try {
      const url = await startShopSubscription(c.env.DB, sq, { product: p, variantId: variant?.id || null, variantName: variant?.name, priceCents: price, email, recipient, personalisation: pers, origin: appOrigin(c.env, c.req.url) });
      return c.json({ url });
    } catch (e: any) {
      console.error("shop subscription checkout failed", e?.message);
      return c.json({ detail: "Could not start checkout. Please try again." }, 502);
    }
  });

  app.get("/api/shop/subscriptions/:id", async (c) => {
    c.header("Cache-Control", "no-store");
    const s = await shopSubscriptionFor(c.env.DB, c.req.param("id"), c.req.query("t") || "");
    if (!s) return c.json({ detail: "This subscription link isn't valid." }, 404);
    let recipient: any = {};
    try { recipient = JSON.parse(s.recipient); } catch { recipient = {}; }
    return c.json({ title: s.title, status: s.status, price_cents: s.price_cents, recipient_name: recipient.name || "", charged_through: s.charged_through, can_cancel: !!s.square_subscription_id && ["active", "past_due"].includes(s.status) });
  });

  app.post("/api/shop/subscriptions/:id/cancel", async (c) => {
    const sq = squareConfig(c.env);
    const s = await shopSubscriptionFor(c.env.DB, c.req.param("id"), c.req.query("t") || "");
    if (!s) return c.json({ detail: "This subscription link isn't valid." }, 404);
    if (!sq.ok) return c.json({ detail: "Cancelling isn't available right now. Please email us." }, 503);
    try {
      await cancelShopSubscription(c.env.DB, sq, s);
      return c.json({ ok: true, detail: "Cancelled. Nothing more will be charged; anything already paid for will still be sent." });
    } catch (e: any) {
      console.error("shop subscription cancel failed", e?.message);
      return c.json({ detail: e?.message === "This subscription hasn't started yet." ? e.message : "Could not cancel. Please try again or email us." }, 502);
    }
  });

  // Guided document workspace: access requires the exact private order token,
  // verified Square payment, and purchase of this specific guided document.
  // Never accept arbitrary document state from the URL and never store children's answers.
  app.get("/api/shop/orders/:id/guided-document/:productId", async (c) => {
    c.header("Cache-Control", "private, no-store");
    const order = await shopOrderFor(c.env.DB, c.req.param("id"), c.req.query("t") || "");
    const pid = c.req.param("productId");
    await ensureShopCatalog(c.env.DB);
    const p = await c.env.DB.prepare("SELECT id, title, tags, fulfilment FROM shop_products WHERE id = ?").bind(pid).first<any>();
    if (!mayAccessGuidedDocument(order, p, pid)) {
      return c.json({ detail: "This document link isn't valid." }, 404);
    }
    const { JURISDICTIONS, CHECKED_ON } = await import("./data/planJurisdictions");
    const code = guidedProductState(p)!;
    const j = JURISDICTIONS[code];
    return c.json({
      title: p.title, jurisdiction: j.code, state_name: j.name, authority: j.authority,
      plan_name: j.planName, curriculum: j.curriculum, areas: j.areas,
      secondary: j.secondary ?? null, requirements: j.requirements,
      sources: j.sources, requirements_checked_on: CHECKED_ON,
      notice: "Independent planning aid only. Not an official form or registration guarantee. Use your own accurate information and verify current requirements with your authority.",
    });
  });

  // The buyer submits information only after checkout. Generate using the same
  // deterministic engine used in the subscriber learning-plan template mode.
  // The PDF is emailed exclusively to the email recorded by the Square order.
  app.post("/api/shop/orders/:id/guided-document/:productId/generate", async (c) => {
    c.header("Cache-Control", "private, no-store");
    const order = await shopOrderFor(c.env.DB, c.req.param("id"), c.req.query("t") || "");
    const pid = c.req.param("productId");
    if (!order?.paid_at) return c.json({ detail: "This document link isn't valid." }, 404);
    await ensureShopCatalog(c.env.DB);
    const product = await c.env.DB.prepare("SELECT id, title, tags, fulfilment FROM shop_products WHERE id = ?").bind(pid).first<any>();
    if (!mayAccessGuidedDocument(order, product, pid)) return c.json({ detail: "This document link isn't valid." }, 404);
    const code = guidedProductState(product);
    if (!code) return c.json({ detail: "This document isn't available." }, 404);
    const raw: any = await c.req.json().catch(() => ({}));
    const valid = validateGuestInput(raw);
    if (!valid.ok) return c.json({ detail: valid.detail }, 400);
    const action = raw?.action === "email" ? "email" : "preview";
    const prepared = await buildGuestPlan(c.env.DB, code, valid.data);
    if (action === "preview") {
      return c.json({ ok:true, preview:prepared.content, title:prepared.plan.title,
        jurisdiction:code, recipient_hint:order.email.replace(/^(.{1,2}).*(@.*)$/, "$1***$2") });
    }
    if (!raw?.confirmed) return c.json({ detail: "Please review and confirm the generated document before emailing." }, 400);
    // Cap attachment emails per paid order to avoid spam and surprise rendering
    // charges. Only order/product IDs are stored, never children's answers.
    await c.env.DB.prepare("CREATE TABLE IF NOT EXISTS guest_document_email_limits (order_id TEXT NOT NULL, product_id TEXT NOT NULL, window_started INTEGER NOT NULL, hits INTEGER NOT NULL, PRIMARY KEY(order_id,product_id))").run();
    const windowStart = Math.floor(Date.now() / 86400000);
    await c.env.DB.prepare(`INSERT INTO guest_document_email_limits(order_id,product_id,window_started,hits) VALUES(?,?,?,1)
      ON CONFLICT(order_id,product_id) DO UPDATE SET
      hits=CASE WHEN window_started=excluded.window_started THEN hits+1 ELSE 1 END,
      window_started=excluded.window_started`).bind(order.id,pid,windowStart).run();
    const attempt = await c.env.DB.prepare("SELECT hits FROM guest_document_email_limits WHERE order_id=? AND product_id=?").bind(order.id,pid).first<{hits:number}>();
    if (Number(attempt?.hits || 0) > 5) return c.json({ detail: "This order has reached its daily PDF email limit. Contact support if you need help." }, 429);

    if (!c.env.EMAIL || !c.env.BROWSER?.quickAction) return c.json({ detail: "PDF delivery is not configured right now." }, 503);
    let bytes: Uint8Array;
    try { bytes = await renderGuestPdf(c.env, guestPlanHtml(prepared)); }
    catch (err: any) { console.error("guest PDF failed", err?.message); return c.json({ detail:"Could not create the PDF. Please retry." }, 502); }
    const sent = await emailGuestPdf(c.env,order.email,bytes,prepared.jurisdiction.name);
    if (!sent) return c.json({ detail:"The PDF was prepared but could not be emailed. Please retry." }, 502);
    return c.json({ ok:true, emailed:true, detail:"Your PDF was emailed to the purchase email address." });
  });

  // A digital product in a paid order.
  app.get("/api/shop/orders/:id/file/:productId", async (c) => {
    const o = await shopOrderFor(c.env.DB, c.req.param("id"), c.req.query("t") || "");
    const pid = c.req.param("productId");
    if (!o || !o.paid_at || !o.lines.some((l: ShopLine) => l.product_id === pid && !l.physical)) return c.json({ detail: "This download link isn't valid." }, 404);
    if (Number(o.downloads || 0) >= 25) return c.json({ detail: "This order has reached its download limit. Contact us if you need help." }, 429);
    const obj = c.env.BUCKET ? await c.env.BUCKET.get(fileKey(pid)) : null;
    if (!obj) return c.json({ detail: "This file isn't ready yet. We'll email you when it is." }, 404);
    await c.env.DB.prepare("UPDATE shop_orders SET downloads = downloads + 1 WHERE id = ?").bind(o.id).run();
    const name = String(obj.customMetadata?.name || "side-quest-download").replace(/[^\w. -]/g, "");
    c.header("Content-Type", obj.httpMetadata?.contentType || "application/octet-stream");
    c.header("Content-Disposition", `attachment; filename="${name}"`);
    c.header("Cache-Control", "no-store");
    c.header("X-Content-Type-Options", "nosniff");
    return c.body(obj.body);
  });
}

// ---------------------------------------------------------------- owner routes (Owner HQ → Shop)

type Helpers = {
  requirePermission: (p: any) => (c: any, next: Next) => Promise<any>;
  actor: (c: any) => { actorUserId: string; actorLabel: string };
  readJson: (c: any) => Promise<Record<string, unknown>>;
};

function parseDataUrl(s: unknown, allowed: RegExp): { type: string; bytes: Uint8Array } | null {
  const m = typeof s === "string" ? /^data:([\w/+.-]+);base64,([A-Za-z0-9+/=]+)$/.exec(s) : null;
  if (!m || !allowed.test(m[1])) return null;
  try {
    const bin = atob(m[2]);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return { type: m[1], bytes };
  } catch { return null; }
}

async function interestCounts(db: DB): Promise<Map<string, number>> {
  const { results } = await db.prepare("SELECT product_id, COUNT(*) n FROM shop_interest GROUP BY product_id").all<{ product_id: string; n: number }>();
  return new Map((results || []).map((r) => [r.product_id, Number(r.n)]));
}

async function ownerProducts(env: Env) {
  const db = env.DB;
  const products = await allProducts(db);
  const variants = await variantsFor(db, products.map((p) => p.id));
  const interest = await interestCounts(db);
  const units = await paidUnitsByProduct(db);
  const files = new Set<string>();
  if (env.BUCKET) {
    let cursor: string | undefined;
    do {
      const page: any = await env.BUCKET.list({ prefix: "shop/products/", cursor });
      for (const o of page.objects || []) if (o.key.endsWith("/file")) files.add(o.key.split("/")[2]);
      cursor = page.truncated ? page.cursor : undefined;
    } while (cursor);
  }
  // Keep the stored "file uploaded" flag in step with storage (files uploaded before the flag existed).
  if (env.BUCKET) {
    const stale = products.filter((p) => !!p.digital_file !== files.has(p.id));
    for (const p of stale)
      await db.prepare("UPDATE shop_products SET digital_file = ? WHERE id = ?").bind(files.has(p.id) ? 1 : 0, p.id).run();
  }
  return products.map((p) => {
    const vs = variants.get(p.id) || [];
    const withFile = { ...p, has_file: files.has(p.id), digital_file: files.has(p.id) ? 1 : 0 };
    return {
      ...withFile, variants: vs, interest: interest.get(p.id) || 0, sold: units.get(p.id) || 0,
      profit: profitFor(p), missing: readiness(withFile, vs), buyable_if_on: buyable({ ...p, visible: 1 }, vs).ok,
    };
  });
}

async function saveVariants(db: DB, productId: string, variants: any[]) {
  const stmts = [db.prepare("DELETE FROM shop_variants WHERE product_id = ?").bind(productId)];
  for (const v of variants) stmts.push(db.prepare("INSERT INTO shop_variants (id, product_id, name, sku, price_cents, stock, active, sort, book_id, details) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(v.id, productId, v.name, v.sku, v.price_cents, v.stock, v.active, v.sort, v.book_id ?? null, v.details ?? ""));
  await db.batch(stmts);
}

export function registerShopAdmin(admin: Hono<any>, h: Helpers) {
  const { requirePermission, actor, readJson } = h;
  const R = requirePermission("settings.read");
  const W = requirePermission("settings.write");
  const audit = (c: any, action: string, id: string | null, detail?: unknown) => writeAudit(c.env.DB, { ...actor(c), action, targetType: "shop", targetId: id ?? undefined, detail } as any);

  admin.get("/shop/dashboard", R, async (c: Context<any>) => {
    const env = c.env as Env;
    const products = await ownerProducts(env);
    await ensureShopOrders(env.DB);
    await ensureShopSubscriptions(env.DB);
    const byStatus = Object.fromEntries(STATUSES.map((s) => [s, products.filter((p) => p.status === s).length]));
    const orders = await env.DB.prepare("SELECT status, COUNT(*) n, COALESCE(SUM(total_cents),0) t FROM shop_orders WHERE paid_at IS NOT NULL GROUP BY status").all<any>();
    const subs = await env.DB.prepare("SELECT status, COUNT(*) n FROM shop_subscriptions GROUP BY status").all<any>();
    const interestTotal = await env.DB.prepare("SELECT COUNT(*) n, COUNT(DISTINCT email) people FROM shop_interest").first<any>();
    const low = products.flatMap((p) => {
      if (p.status !== "in_stock" || p.low_stock_at == null) return [];
      const vs = p.variants.filter((v: any) => v.active && v.stock != null);
      if (vs.length) return vs.filter((v: any) => v.stock <= p.low_stock_at).map((v: any) => ({ id: p.id, title: `${p.title} (${v.name})`, stock: v.stock }));
      return p.stock != null && p.stock <= p.low_stock_at ? [{ id: p.id, title: p.title, stock: p.stock }] : [];
    });
    const brief = (p: any) => ({ id: p.id, title: p.title, department: p.department, status: p.status, visible: p.visible, missing: p.missing });
    return c.json({
      shop_open: await shopIsOpen(env.DB),
      can_take_payments: squareConfig(env).ok,
      total: products.length,
      visible: products.filter((p) => p.visible).length,
      on_sale: products.filter((p) => isPublic(p) && p.buyable_if_on).length,
      by_status: byStatus,
      status_labels: STATUS_LABELS,
      by_stage: STAGES.map((st) => ({ id: st, label: STAGE_LABELS[st], total: products.filter((p) => p.stage === st).length, visible: products.filter((p) => p.stage === st && p.visible).length, ready: products.filter((p) => p.stage === st && p.missing.length === 0).length })),
      by_department: DEPARTMENTS.map((d) => ({ ...d, total: products.filter((p) => p.department === d.id).length, visible: products.filter((p) => p.department === d.id && p.visible).length })),
      interest: { signups: Number(interestTotal?.n || 0), people: Number(interestTotal?.people || 0), top: products.filter((p) => p.interest > 0).sort((a, b) => b.interest - a.interest).slice(0, 10).map((p) => ({ ...brief(p), interest: p.interest })) },
      preorders: products.filter((p) => p.status === "pre_order").map((p) => ({ ...brief(p), sold: p.sold, target: p.preorder_target, reached: !!p.preorder_target && p.sold >= p.preorder_target, closes_at: p.preorder_closes_at })),
      ready_to_launch: products.filter((p) => !p.visible && p.missing.length === 0).map(brief),
      nearly_ready: products.filter((p) => !p.visible && p.stage === "launch_now" && p.missing.length > 0 && p.missing.length <= 2).slice(0, 30).map(brief),
      orders: Object.fromEntries((orders.results || []).map((r: any) => [r.status, { count: Number(r.n), total_cents: Number(r.t) }])),
      subscriptions: Object.fromEntries((subs.results || []).map((r: any) => [r.status, Number(r.n)])),
      low_stock: low,
    });
  });

  admin.get("/shop/products", R, async (c: Context<any>) => {
    return c.json({ products: await ownerProducts(c.env as Env), departments: DEPARTMENTS, statuses: STATUSES, status_labels: STATUS_LABELS, fulfilment_labels: FULFILMENT_LABELS, stages: STAGES, stage_labels: STAGE_LABELS });
  });

  admin.post("/shop/products", W, async (c: Context<any>) => {
    const db = (c.env as Env).DB;
    await ensureShopCatalog(db);
    const checked = validateProduct(await readJson(c));
    if (!checked.ok) return c.json({ detail: checked.detail }, 400);
    const id = crypto.randomUUID();
    const v = checked.value as any;
    if (!v.stage) v.stage = stageFor(v);
    let slug = slugify(v.title) || "product";
    if (await db.prepare("SELECT 1 FROM shop_products WHERE slug = ?").bind(slug).first()) slug = `${slug}-${id.slice(0, 6)}`;
    const now = new Date().toISOString();
    const keys = Object.keys(v);
    await db.prepare(`INSERT INTO shop_products (id, slug, visible, sort, created_at, updated_at, ${keys.join(", ")}) VALUES (?, ?, 0, 9999, ?, ?, ${keys.map(() => "?").join(", ")})`)
      .bind(id, slug, now, now, ...keys.map((k) => v[k])).run();
    if (checked.variants) await saveVariants(db, id, checked.variants);
    await audit(c, "shop.product_created", id, { title: v.title });
    return c.json({ id }, 201);
  });

  admin.put("/shop/products/:id", W, async (c: Context<any>) => {
    const db = (c.env as Env).DB;
    await ensureShopCatalog(db);
    const id = c.req.param("id") ?? "";
    const current = UUID.test(id) ? await db.prepare("SELECT id, visible FROM shop_products WHERE id = ?").bind(id).first<any>() : null;
    if (!current) return c.json({ detail: "Product not found" }, 404);
    const body = await readJson(c);
    const checked = validateProduct(body);
    if (!checked.ok) return c.json({ detail: checked.detail }, 400);
    const v = checked.value as any;
    const keys = Object.keys(v);
    await db.prepare(`UPDATE shop_products SET ${keys.map((k) => `${k} = ?`).join(", ")}, updated_at = ? WHERE id = ?`).bind(...keys.map((k) => v[k]), new Date().toISOString(), id).run();
    if (checked.variants) await saveVariants(db, id, checked.variants);
    await audit(c, "shop.product_updated", id, { title: v.title, status: v.status, price_cents: v.price_cents });
    return c.json({ ok: true });
  });

  // Switch one or many products on/off, or change their status, in one go.
  admin.post("/shop/products/bulk", W, async (c: Context<any>) => {
    const db = (c.env as Env).DB;
    await ensureShopCatalog(db);
    const body = await readJson(c);
    const ids = [...new Set((Array.isArray(body.ids) ? body.ids : []).map(String).filter((x: string) => UUID.test(x)))].slice(0, 500) as string[];
    if (!ids.length) return c.json({ detail: "Choose at least one product." }, 400);
    const sets: string[] = [];
    const vals: unknown[] = [];
    if (typeof body.visible === "boolean") { sets.push("visible = ?"); vals.push(body.visible ? 1 : 0); }
    if (body.stage !== undefined) {
      if (!(STAGES as readonly string[]).includes(String(body.stage))) return c.json({ detail: "Unknown development stage." }, 400);
      sets.push("stage = ?"); vals.push(String(body.stage));
    }
    if (body.status !== undefined) {
      if (!(STATUSES as readonly string[]).includes(String(body.status))) return c.json({ detail: "Unknown status." }, 400);
      sets.push("status = ?"); vals.push(String(body.status));
    }
    // Make many products digital only (a download such as an instructional PDF or activity book) or physical again.
    if (body.fulfilment !== undefined) {
      if (body.fulfilment !== "digital" && body.fulfilment !== "physical") return c.json({ detail: "Choose digital only or physical." }, 400);
      sets.push("fulfilment = ?"); vals.push(body.fulfilment);
      if (body.fulfilment === "digital") sets.push("digital_cents = NULL"); // already a download
    }
    if (!sets.length) return c.json({ detail: "Nothing to change." }, 400);
    const now = new Date().toISOString();
    for (let i = 0; i < ids.length; i += 50) {
      const chunk = ids.slice(i, i + 50);
      await db.prepare(`UPDATE shop_products SET ${sets.join(", ")}, updated_at = ? WHERE id IN (${chunk.map(() => "?").join(",")})`).bind(...vals, now, ...chunk).run();
    }
    await audit(c, "shop.products_bulk", null, { count: ids.length, visible: body.visible, status: body.status, stage: body.stage, fulfilment: body.fulfilment });
    return c.json({ ok: true, changed: ids.length });
  });

  // Printed Quest Books: add one option per Quest Book (no price yet), skipping books already listed.
  admin.post("/shop/products/:id/book-variants", W, async (c: Context<any>) => {
    const env = c.env as Env;
    await ensureShopCatalog(env.DB);
    const id = c.req.param("id") ?? "";
    const p = UUID.test(id) ? await env.DB.prepare("SELECT id, prints_books FROM shop_products WHERE id = ?").bind(id).first<any>() : null;
    if (!p) return c.json({ detail: "Product not found" }, 404);
    const books = (await listBooks(env.BUCKET)).filter((b: any) => b.has_book);
    const { results } = await env.DB.prepare("SELECT book_id, sort FROM shop_variants WHERE product_id = ?").bind(id).all<any>();
    const have = new Set((results || []).map((r: any) => r.book_id).filter(Boolean));
    let sort = Math.max(-1, ...(results || []).map((r: any) => Number(r.sort) || 0)) + 1;
    const add = books.filter((b: any) => !have.has(b.id));
    const stmts = add.map((b: any) => env.DB.prepare("INSERT INTO shop_variants (id, product_id, name, sku, price_cents, stock, active, sort, book_id) VALUES (?, ?, ?, '', NULL, NULL, 1, ?, ?)").bind(crypto.randomUUID(), id, String(b.title).slice(0, 80), sort++, b.id));
    stmts.push(env.DB.prepare("UPDATE shop_products SET prints_books = 1, updated_at = ? WHERE id = ?").bind(new Date().toISOString(), id));
    await env.DB.batch(stmts);
    await audit(c, "shop.book_variants_added", id, { added: add.length });
    return c.json({ added: add.length });
  });

  admin.delete("/shop/products/:id", W, async (c: Context<any>) => {
    const env = c.env as Env;
    await ensureShopCatalog(env.DB);
    const id = c.req.param("id") ?? "";
    const p = UUID.test(id) ? await env.DB.prepare("SELECT id, title, images FROM shop_products WHERE id = ?").bind(id).first<any>() : null;
    if (!p) return c.json({ detail: "Product not found" }, 404);
    await env.DB.batch([
      env.DB.prepare("DELETE FROM shop_products WHERE id = ?").bind(id),
      env.DB.prepare("DELETE FROM shop_variants WHERE product_id = ?").bind(id),
    ]);
    if (env.BUCKET) for (let n = 1; n <= MAX_PRODUCT_IMAGES; n++) await env.BUCKET.delete(imageKey(id, n)).catch(() => undefined);
    if (env.BUCKET) await env.BUCKET.delete(fileKey(id)).catch(() => undefined);
    await audit(c, "shop.product_deleted", id, { title: p.title });
    return c.json({ ok: true });
  });

  // Photos: sent as a data URL (JPEG, PNG or WebP, up to 3 MB each, 6 per product).
  admin.post("/shop/products/:id/images", W, async (c: Context<any>) => {
    const env = c.env as Env;
    if (!env.BUCKET) return c.json({ detail: "Storage isn't available." }, 503);
    await ensureShopCatalog(env.DB);
    const id = c.req.param("id") ?? "";
    const p = UUID.test(id) ? await env.DB.prepare("SELECT images FROM shop_products WHERE id = ?").bind(id).first<any>() : null;
    if (!p) return c.json({ detail: "Product not found" }, 404);
    if (p.images >= MAX_PRODUCT_IMAGES) return c.json({ detail: `Up to ${MAX_PRODUCT_IMAGES} photos per product.` }, 400);
    const img = parseDataUrl((await readJson(c)).image, /^image\/(jpeg|png|webp)$/);
    if (!img) return c.json({ detail: "Choose a JPEG, PNG or WebP photo." }, 400);
    if (img.bytes.length > MAX_IMAGE_BYTES) return c.json({ detail: "Photos can be up to 3 MB." }, 400);
    const n = p.images + 1;
    await env.BUCKET.put(imageKey(id, n), img.bytes, { httpMetadata: { contentType: img.type } });
    await env.DB.prepare("UPDATE shop_products SET images = ?, updated_at = ? WHERE id = ?").bind(n, new Date().toISOString(), id).run();
    await audit(c, "shop.image_added", id, { n });
    return c.json({ images: n });
  });

  admin.get("/shop/products/:id/images/:n", R, async (c: Context<any>) => {
    const env = c.env as Env;
    const id = c.req.param("id") ?? "";
    const n = Number(c.req.param("n"));
    if (!UUID.test(id) || !Number.isInteger(n) || n < 1 || n > MAX_PRODUCT_IMAGES || !env.BUCKET) return c.json({ detail: "Image not found" }, 404);
    const obj = await env.BUCKET.get(imageKey(id, n));
    if (!obj) return c.json({ detail: "Image not found" }, 404);
    c.header("Content-Type", obj.httpMetadata?.contentType || "image/jpeg");
    c.header("X-Content-Type-Options", "nosniff");
    return c.body(obj.body as any);
  });

  admin.delete("/shop/products/:id/images/:n", W, async (c: Context<any>) => {
    const env = c.env as Env;
    if (!env.BUCKET) return c.json({ detail: "Storage isn't available." }, 503);
    await ensureShopCatalog(env.DB);
    const id = c.req.param("id") ?? "";
    const n = Number(c.req.param("n"));
    const p = UUID.test(id) ? await env.DB.prepare("SELECT images FROM shop_products WHERE id = ?").bind(id).first<any>() : null;
    if (!p || !Number.isInteger(n) || n < 1 || n > p.images) return c.json({ detail: "Image not found" }, 404);
    // Shift the later photos down so they stay numbered 1..count.
    for (let k = n + 1; k <= p.images; k++) {
      const obj = await env.BUCKET.get(imageKey(id, k));
      if (obj) await env.BUCKET.put(imageKey(id, k - 1), await obj.arrayBuffer(), { httpMetadata: obj.httpMetadata });
    }
    await env.BUCKET.delete(imageKey(id, p.images));
    await env.DB.prepare("UPDATE shop_products SET images = ?, updated_at = ? WHERE id = ?").bind(p.images - 1, new Date().toISOString(), id).run();
    await audit(c, "shop.image_removed", id, { n });
    return c.json({ images: p.images - 1 });
  });

  // Owner-only two-step generation. Preview creates bytes in memory but
  // never persists or publishes a file. Save must match the exact SHA-256
  // fingerprint previously inspected in the browser.
  admin.post("/document-studio/preview", R, async (c: Context<any>) => {
    const body = await readJson(c);
    const state = String(body.state || "").toUpperCase();
    const year = String(body.year_level || "3");
    if (!["NSW","VIC","QLD","WA","SA","TAS","ACT","NT"].includes(state) ||
        !/^(K|F|Prep|[1-9]|1[0-2])$/i.test(year)) return c.json({ detail:"Choose a valid state and school year." },400);
    const pdf = generateHomeEducationTemplate(state,year);
    if (pdf.byteLength > MAX_FILE_BYTES) return c.json({ detail:"The generated PDF is too large." },413);
    let base64 = "";
    for (let i=0;i<pdf.length;i+=8192) base64 += String.fromCharCode(...pdf.subarray(i,i+8192));
    return c.json({ data_url:"data:application/pdf;base64,"+btoa(base64), sha256:await sha256(pdf), pages_label:"A4", state, year_level:year,
      note:"Preview only. No file saved or approved for sale." });
  });

  // Owner-only preview of a purchased-style personalised plan, using precisely
  // the guest purchase generator and PDF renderer with fictional family data.
  // No order, email, product file, real child data or AI call is involved.
  admin.post("/document-studio/preview-guided", R, async (c: Context<any>) => {
    const body = await readJson(c);
    const state = String(body.state || "").toUpperCase();
    const year = String(body.year_level || "3");
    let sample: Record<string, any>;
    try { sample = sampleGuidedDocumentData(state,year); }
    catch { return c.json({ detail:"Choose a valid state or territory and year level." },400); }
    if (!c.env.BROWSER?.quickAction)
      return c.json({detail:"PDF rendering is not configured. Guided previews need the same PDF renderer as customer orders."},503);
    const limited=await hitRateLimit(c.env.DB,`document-studio:guided-preview:${c.get("user")?.id || "owner"}`,25,3600);
    if(!limited.ok) return c.json({detail:"Guided PDF preview limit reached for this hour. Please try again later."},429);
    try {
      const built=await buildGuestPlan(c.env.DB,state as any,sample);
      const pdf=await renderGuestPdf(c.env,guestPlanHtml(built));
      let base64="";
      for(let i=0;i<pdf.length;i+=8192)base64+=String.fromCharCode(...pdf.subarray(i,i+8192));
      return c.json({
        data_url:"data:application/pdf;base64,"+btoa(base64),
        sha256:await sha256(pdf),state,year_level:year,
        variant:"guided",sample_name:"Alex Example",
        note:"Fictional example only. Preview not saved, emailed or approved for sale.",
      });
    } catch(err:any) {
      console.error("owner guided PDF preview failed",err?.message);
      return c.json({detail:"Could not generate the personalised PDF preview. Check PDF rendering configuration."},502);
    }
  });

  admin.post("/document-studio/products/:id/save-preview", W, async (c: Context<any>) => {
    const env = c.env as Env;
    if (!env.BUCKET) return c.json({ detail:"Private document storage is unavailable." },503);
    const id = c.req.param("id");
    if (!UUID.test(id)) return c.json({ detail:"Product not found." },404);
    await ensureShopCatalog(env.DB);
    const product = await env.DB.prepare("SELECT id, title, collection, tags, fulfilment FROM shop_products WHERE id=?").bind(id).first<any>();
    if (!product || !isHomeEducationDocument(product) || product.fulfilment!=="digital") return c.json({ detail:"Document product not found." },404);
    const body=await readJson(c);
    const state=String(body.state||"").toUpperCase(),year=String(body.year_level||"3");
    if (!["NSW","VIC","QLD","WA","SA","TAS","ACT","NT"].includes(state) || !/^(K|F|Prep|[1-9]|1[0-2])$/i.test(year)) return c.json({ detail:"Invalid state or year." },400);
    let tags:unknown=[];
    try{tags=JSON.parse(product.tags);}catch{}
    if(!Array.isArray(tags)||!tags.includes(state.toLowerCase())||tags.includes("guided-document")||!tags.includes("fillable-pdf")) return c.json({ detail:"This PDF does not match the selected blank-template product." },409);
    const bytes=generateHomeEducationTemplate(state,year),fingerprint=await sha256(bytes);
    if(!/^[a-f0-9]{64}$/.test(String(body.sha256||""))||fingerprint!==body.sha256) return c.json({ detail:"This PDF differs from the preview. Preview the latest version before saving." },409);
    const filename=`sidequest-${state.toLowerCase()}-home-education-fillable.pdf`;
    await env.BUCKET.put(fileKey(id),bytes,{ httpMetadata:{contentType:"application/pdf"},customMetadata:{name:filename} });
    await env.DB.prepare("UPDATE shop_products SET digital_file=1,updated_at=? WHERE id=?").bind(new Date().toISOString(),id).run();
    await audit(c,"document_studio.pdf_saved",id,{state,year,fingerprint,bytes:bytes.length});
    return c.json({ok:true,saved:true,sha256:fingerprint,detail:"Saved as a draft file. Document sales remain blocked pending state-specific quality review."});
  });

  // The file a digital product delivers (PDF or ZIP, up to 25 MB). Private: only paid orders can download it.
  admin.post("/shop/products/:id/file", W, async (c: Context<any>) => {
    const env = c.env as Env;
    if (!env.BUCKET) return c.json({ detail: "Storage isn't available." }, 503);
    await ensureShopCatalog(env.DB);
    const id = c.req.param("id") ?? "";
    if (!UUID.test(id) || !(await env.DB.prepare("SELECT 1 FROM shop_products WHERE id = ?").bind(id).first())) return c.json({ detail: "Product not found" }, 404);
    const body = await readJson(c);
    const file = parseDataUrl(body.file, /^application\/(pdf|zip|x-zip-compressed)$/);
    if (!file) return c.json({ detail: "Choose a PDF or ZIP file." }, 400);
    if (file.bytes.length > MAX_FILE_BYTES) return c.json({ detail: "Files can be up to 25 MB." }, 400);
    const name = String(body.name || "download").replace(/[^\w. -]/g, "").slice(0, 100) || "download";
    await env.BUCKET.put(fileKey(id), file.bytes, { httpMetadata: { contentType: file.type }, customMetadata: { name } });
    await env.DB.prepare("UPDATE shop_products SET digital_file = 1, updated_at = ? WHERE id = ?").bind(new Date().toISOString(), id).run();
    await audit(c, "shop.file_uploaded", id, { name, bytes: file.bytes.length });
    return c.json({ ok: true });
  });

  admin.delete("/shop/products/:id/file", W, async (c: Context<any>) => {
    const env = c.env as Env;
    const id = c.req.param("id") ?? "";
    if (!UUID.test(id) || !env.BUCKET) return c.json({ detail: "Not found" }, 404);
    await env.BUCKET.delete(fileKey(id));
    await ensureShopCatalog(env.DB);
    await env.DB.prepare("UPDATE shop_products SET digital_file = 0, updated_at = ? WHERE id = ?").bind(new Date().toISOString(), id).run();
    await audit(c, "shop.file_removed", id);
    return c.json({ ok: true });
  });

  admin.get("/shop/interest", R, async (c: Context<any>) => {
    const db = (c.env as Env).DB;
    await ensureShopCatalog(db);
    const id = c.req.query("product_id") || "";
    const q = UUID.test(id)
      ? db.prepare("SELECT i.product_id, p.title, i.email, i.created_at FROM shop_interest i JOIN shop_products p ON p.id = i.product_id WHERE i.product_id = ? ORDER BY i.created_at DESC LIMIT 2000").bind(id)
      : db.prepare("SELECT i.product_id, p.title, i.email, i.created_at FROM shop_interest i JOIN shop_products p ON p.id = i.product_id ORDER BY i.created_at DESC LIMIT 2000");
    return c.json({ interest: (await q.all()).results || [] });
  });

  admin.get("/shop/orders", R, async (c: Context<any>) => {
    const db = (c.env as Env).DB;
    await ensureShopOrders(db);
    const status = c.req.query("status") || "";
    const q = status
      ? db.prepare("SELECT id, email, lines, total_cents, postage_cents, status, shipping, tracking, notes, created_at, paid_at, quoted_postcode, shipping_service FROM shop_orders WHERE paid_at IS NOT NULL AND status = ? ORDER BY paid_at DESC LIMIT 300").bind(status)
      : db.prepare("SELECT id, email, lines, total_cents, postage_cents, status, shipping, tracking, notes, created_at, paid_at, quoted_postcode, shipping_service FROM shop_orders WHERE paid_at IS NOT NULL ORDER BY paid_at DESC LIMIT 300");
    const rows = ((await q.all<any>()).results || []).map((r) => {
      const parse = (s: string | null, f: any) => { try { return s ? JSON.parse(s) : f; } catch { return f; } };
      return { ...r, lines: parse(r.lines, []), shipping: parse(r.shipping, null) };
    });
    return c.json({ orders: rows });
  });

  const ORDER_STATUSES = ["address_review", "to_fulfil", "packing", "shipped", "complete", "cancelled"];
  admin.put("/shop/orders/:id", W, async (c: Context<any>) => {
    const env = c.env as Env;
    await ensureShopOrders(env.DB);
    const id = c.req.param("id") ?? "";
    const row = UUID.test(id) ? await env.DB.prepare("SELECT id, email, status, paid_at FROM shop_orders WHERE id = ?").bind(id).first<any>() : null;
    if (!row || !row.paid_at) return c.json({ detail: "Order not found" }, 404);
    const body = await readJson(c);
    const status = String(body.status || row.status);
    if (!ORDER_STATUSES.includes(status)) return c.json({ detail: "Unknown order status." }, 400);
    if (row.status === "address_review" && ["shipped", "complete", "packing"].includes(status)) return c.json({ detail: "Check the delivery address and release the order before posting." }, 409);
    const tracking = typeof body.tracking === "string" ? body.tracking.replace(/[\x00-\x1f\x7f<>]/g, " ").trim().slice(0, 200) : null;
    const notes = typeof body.notes === "string" ? body.notes.replace(/[\x00-\x1f\x7f<>]/g, " ").trim().slice(0, 2000) : null;
    await env.DB.prepare("UPDATE shop_orders SET status = ?, tracking = COALESCE(?, tracking), notes = COALESCE(?, notes), updated_at = ? WHERE id = ?").bind(status, tracking, notes, new Date().toISOString(), id).run();
    let emailed = false;
    if (status === "shipped" && row.status !== "shipped" && body.notify !== false) {
      const t = tracking ? `\n\nTracking: ${tracking}` : "";
      emailed = await sendEmail(env, {
        to: row.email, subject: "Your Side-Quest order is on its way",
        text: `Good news: your Side-Quest order has been posted.${t}\n\nThank you for supporting Side-Quest!`,
        html: `<p>Good news: your Side-Quest order has been posted.</p>${tracking ? `<p>Tracking: ${tracking.replace(/[<>&]/g, "")}</p>` : ""}<p>Thank you for supporting Side-Quest!</p>`,
      }).catch(() => false);
    }
    await audit(c, "shop.order_updated", id, { status, tracking: !!tracking, emailed });
    return c.json({ ok: true, emailed });
  });

  admin.get("/shop/subscriptions", R, async (c: Context<any>) => {
    const db = (c.env as Env).DB;
    await ensureShopSubscriptions(db);
    const { results } = await db.prepare("SELECT id, product_id, title, email, recipient, personalisation, price_cents, status, charged_through, created_at FROM shop_subscriptions WHERE status != 'pending' OR created_at > ? ORDER BY created_at DESC LIMIT 500")
      .bind(new Date(Date.now() - 2 * 86400000).toISOString()).all<any>();
    const parse = (s: string) => { try { return JSON.parse(s); } catch { return {}; } };
    return c.json({ subscriptions: (results || []).map((r) => ({ ...r, recipient: parse(r.recipient), personalisation: parse(r.personalisation) })) });
  });

  admin.post("/shop/subscriptions/:id/cancel", W, async (c: Context<any>) => {
    const env = c.env as Env;
    const sq = squareConfig(env);
    if (!sq.ok) return c.json({ detail: "Square isn't configured." }, 503);
    await ensureShopSubscriptions(env.DB);
    const row = await env.DB.prepare("SELECT * FROM shop_subscriptions WHERE id = ?").bind(c.req.param("id") ?? "").first<any>();
    if (!row) return c.json({ detail: "Subscription not found" }, 404);
    try {
      await cancelShopSubscription(env.DB, sq, row);
    } catch (e: any) {
      return c.json({ detail: e?.message === "This subscription hasn't started yet." ? e.message : "Square couldn't cancel it. Try again." }, 502);
    }
    await audit(c, "shop.subscription_cancelled", row.id);
    return c.json({ ok: true });
  });
}


