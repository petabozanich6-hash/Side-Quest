// Australia Post PAC quotes for the Side-Quest shop. Standard domestic Parcel Post ONLY.
// PAC supplies retail postage rates, not MyPost Business account-specific discounts.
// Never trust browser-side prices, weights, dimensions or service selections.
import type { Env } from "./types";
import type { ShopLine } from "./shopOrders";
import { ensureShopCatalog } from "./shopCatalog";
import { documentKind } from "./familyDocumentPricing";

const POSTCODE = /^\d{4}$/;
const API_URL = "https://digitalapi.auspost.com.au/postage/parcel/domestic/calculate.json";
export const AUSPOST_SERVICE = "AUS_PARCEL_REGULAR";
export const DISPATCH_POSTCODE = "2340";

export class ShippingQuoteError extends Error {
  readonly status: number;
  constructor(message: string, status = 400) { super(message); this.status = status; }
}

export type Parcel = { weight_g: number; length_cm: number; width_cm: number; height_cm: number };
export type StandardQuote = { postcode: string; service: "Parcel Post"; service_code: typeof AUSPOST_SERVICE; postage_cents: number; parcel: Parcel; dispatch_postcode: string };

/** A shipping-ready product's dimensions include its own protective packaging.
 * We stack units into one parcel conservatively: largest footprint and the sum of heights,
 * with combined actual weights. If the order won't fit, do not guess a rate. */
export async function parcelForCart(db: D1Database, lines: ShopLine[]): Promise<Parcel | null> {
  const physical = lines.filter((x) => x.product_id && x.physical && !x.gift_months);
  if (!physical.length) return null;
  await ensureShopCatalog(db);
  const ids = [...new Set(physical.map((x) => x.product_id!))];
  const { results } = await db.prepare(`SELECT id, title, tags, fulfilment, parcel_weight_g, parcel_length_cm, parcel_width_cm, parcel_height_cm FROM shop_products WHERE id IN (${ids.map(() => "?").join(",")})`).bind(...ids).all<any>();
  const products = new Map((results || []).map((p: any) => [p.id, p]));
  let weight_g = 0, length_cm = 0, width_cm = 0, height_cm = 0;
  for (const line of physical) {
    const p: any = products.get(line.product_id);
    if (!p) throw new ShippingQuoteError("A product in this order is no longer available.", 409);
    const weight = Number(p.parcel_weight_g);
    const length = Number(p.parcel_length_cm);
    const width = Number(p.parcel_width_cm);
    const height = Number(p.parcel_height_cm);
    if (![weight, length, width, height].every((n) => Number.isInteger(n) && n > 0))
      throw new ShippingQuoteError(`Shipping measurements are not ready for "${p.title}". Please contact Side-Quest or try later.`, 409);
    // Each additional printed child means another complete workbook in the
    // parcel. The product dimensions describe one book, not the whole family
    // pack; never underquote postage by charging shipping for one child only.
    const children = documentKind(p) === "printed" ? Number(line.personalisation?.child_count || 1) : 1;
    if (!Number.isInteger(children) || children<1 || children>5) throw new ShippingQuoteError("Invalid printed family document count.");
    const qty = Number(line.qty || 1) * children;
    if (!Number.isInteger(qty) || qty < 1 || qty > 50) throw new ShippingQuoteError("Invalid parcel quantity.");
    weight_g += weight * qty;
    length_cm = Math.max(length_cm, length);
    width_cm = Math.max(width_cm, width);
    height_cm += height * qty;
  }
  // Australia Post's maximums vary by service. Reject unlikely/unshippable orders;
  // a single-parcel estimate is preferable to silently undercharging multi-box orders.
  if (weight_g > 22000 || Math.max(length_cm, width_cm, height_cm) > 105 || [length_cm, width_cm, height_cm].sort((a, b) => b - a)[1] * 2 + [length_cm, width_cm, height_cm].sort((a, b) => b - a)[2] * 2 > 140)
    throw new ShippingQuoteError("This order needs a custom shipping quote. Please contact Side-Quest.", 409);
  return { weight_g, length_cm, width_cm, height_cm };
}

export async function quoteStandardPost(env: Env, lines: ShopLine[], destination: string, fetchImpl: typeof fetch = fetch): Promise<StandardQuote | null> {
  const parcel = await parcelForCart(env.DB, lines);
  if (!parcel) return null;
  if (!POSTCODE.test(destination)) throw new ShippingQuoteError("Enter a valid four-digit Australian delivery postcode.");
  const key = env.AUSPOST_PAC_API_KEY;
  if (!key) throw new ShippingQuoteError("Postage quotes are not configured yet. Please try again later.", 503);
  const from = POSTCODE.test(env.AUSPOST_FROM_POSTCODE || "") ? env.AUSPOST_FROM_POSTCODE! : DISPATCH_POSTCODE;
  const query = new URLSearchParams({
    from_postcode: from, to_postcode: destination,
    length: String(parcel.length_cm), width: String(parcel.width_cm), height: String(parcel.height_cm),
    weight: String(parcel.weight_g / 1000), service_code: AUSPOST_SERVICE,
  });
  let response: Response;
  try {
    response = await fetchImpl(`${API_URL}?${query}`, { headers: { "AUTH-KEY": key, Accept: "application/json" }, signal: AbortSignal.timeout(8000) });
  } catch {
    throw new ShippingQuoteError("Australia Post is temporarily unavailable. Please try again.", 503);
  }
  const data: any = await response.json().catch(() => null);
  if (!response.ok || data?.error || data?.errors) throw new ShippingQuoteError("Australia Post couldn't quote this parcel. Check the postcode or contact Side-Quest.", response.status === 400 ? 400 : 503);
  const price = Number(data?.postage_result?.total_cost);
  if (!Number.isFinite(price) || price <= 0 || price > 500 || !/^(?:\d+)(?:\.\d{1,2})?$/.test(String(data?.postage_result?.total_cost)))
    throw new ShippingQuoteError("Australia Post returned an invalid postage price. Please try again.", 503);
  return { postcode: destination, dispatch_postcode: from, service: "Parcel Post", service_code: AUSPOST_SERVICE, postage_cents: Math.round(price * 100), parcel };
}
