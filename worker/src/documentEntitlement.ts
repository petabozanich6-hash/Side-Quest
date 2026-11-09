// Pure entitlement/selection rules for Side-Quest's paid guided documents.
// The caller must first resolve a hashed order token using shopOrderFor.
// A shop listing, return URL or unverified client response cannot grant access.
import { JURISDICTIONS, type JurisdictionCode } from "./data/planJurisdictions";

const CODES: JurisdictionCode[] = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function guidedProductState(product: any): JurisdictionCode | null {
  if (!product || product.fulfilment !== "digital") return null;
  let tags: unknown = product.tags;
  if (typeof tags === "string") {
    try { tags = JSON.parse(tags); } catch { return null; }
  }
  if (!Array.isArray(tags) || !tags.every((v) => typeof v === "string")) return null;
  if (!tags.includes("home-education-document") || !tags.includes("guided-document")) return null;
  const matches = CODES.filter((code) => tags.includes(code.toLowerCase()));
  return matches.length === 1 && JURISDICTIONS[matches[0]] ? matches[0] : null;
}

export function mayAccessGuidedDocument(order: any, product: any, productId: string): boolean {
  if (!UUID.test(productId) || !order?.paid_at || product?.id !== productId || !guidedProductState(product)) return false;
  return Array.isArray(order.lines) && order.lines.some(
    (line: any) => line?.product_id === productId && line?.physical === false && Number(line?.amount_cents) > 0
  );
}
