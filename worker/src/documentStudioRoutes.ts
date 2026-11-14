/** Owner-only PDF authoring. No shop database, payment or order dependencies. */
import type { Hono } from "hono";
import { JURISDICTIONS, CHECKED_ON } from "./data/planJurisdictions";
import { DOCUMENT_STATES, documentSquareOffers, listingDraftFor, SQUARE_PRODUCTION, type DocumentOfferKind } from "./documentSquareOffers";
import { generateHomeEducationTemplate } from "./homeEducationPdf";
import { buildStudioProductPdf } from "./studioProductPdf";
import { hitRateLimit } from "./adminAudit";
import type { Permission } from "./access";

type Mode = "print" | "fillable";
type Body = Record<string, unknown>;
const MAX_PDF_BYTES = 25 * 1024 * 1024;
const YEARS = /^(ALL|K|F|Prep|[1-9]|1[0-2])$/i;
const NSW_ELECTIVES = ["PDHPE", "Creative Arts", "Languages", "Technology"];

export function documentStudioCatalog(year = "ALL") {
  if (!YEARS.test(year)) throw new Error("Choose a valid planning range.");
  return {
    year,
    source: "Independent Side-Quest PDF templates (NOT Square catalogue)",
    square_catalogue_connected: false,
    offers: documentSquareOffers().map(offer => ({
      ...offer,
      listing: listingDraftFor(offer.state, year, offer.kind),
      production: SQUARE_PRODUCTION[offer.kind],
      sidequest_listings: [],
      current_sidequest_price_cents: null,
      current_sidequest_title: null,
      catalogue_warning: null,
    })),
  };
}

export function validateHomeEducationExport(body: Body) {
  const state = String(body.state || "").toUpperCase();
  const year = String(body.year_level || "ALL");
  const kind = String(body.product_kind || "") as DocumentOfferKind;
  const production = SQUARE_PRODUCTION[kind];
  const mode = body.mode === "print" ? "print" : body.mode === "fillable" ? "fillable" : null;
  if (!DOCUMENT_STATES.includes(state as typeof DOCUMENT_STATES[number]) || !YEARS.test(year))
    return { ok: false as const, detail: "Choose a valid state or territory and year range." };
  if (!production || body.edition !== production.edition || !mode || !(production.customer_modes as readonly string[]).includes(mode))
    return { ok: false as const, detail: "This document kind, edition and PDF format do not match." };
  const raw = Array.isArray(body.secondary_electives) ? body.secondary_electives : [];
  const electives = raw.map(v => String(v));
  const nswSecondary = state === "NSW" && /^(7|8|9|10)$/.test(year);
  if ((nswSecondary && (electives.length !== 2 || new Set(electives).size !== 2 || electives.some(v => !NSW_ELECTIVES.includes(v)))) ||
      (!nswSecondary && electives.length !== 0))
    return { ok: false as const, detail: "NSW Years 7–10 require two different electives; other ranges do not use that selection." };
  return { ok: true as const, state, year, kind, edition: production.edition, mode: mode as Mode, electives, production };
}
function pdfUrl(pdf: Uint8Array) {
  let binary = "";
  for (let i = 0; i < pdf.length; i += 8192) binary += String.fromCharCode(...pdf.subarray(i, i + 8192));
  return "data:application/pdf;base64," + btoa(binary);
}
async function fingerprint(pdf: Uint8Array) {
  const digest = await crypto.subtle.digest("SHA-256", pdf as unknown as BufferSource);
  return Array.from(new Uint8Array(digest)).map(x => x.toString(16).padStart(2, "0")).join("");
}
async function jsonBody(c: any): Promise<Body> {
  const raw: unknown = await c.req.json().catch(() => null);
  return raw && typeof raw === "object" && !Array.isArray(raw) ? raw as Body : {};
}

export function registerDocumentStudio(admin: Hono<any>, requirePermission: (p: Permission) => any) {
  const ownerRead = requirePermission("settings.read");
  admin.get("/document-studio/requirements", ownerRead, c => {
    c.header("Cache-Control", "private, no-store");
    return c.json({
      checked_on: CHECKED_ON,
      jurisdictions: DOCUMENT_STATES.map(code => {
        const j = JURISDICTIONS[code];
        return { code, name: j.name, authority: j.authority, requirements: j.requirements, sources: j.sources };
      }),
    });
  });
  admin.get("/document-studio/square-production", ownerRead, c => {
    try {
      c.header("Cache-Control", "private, no-store");
      return c.json(documentStudioCatalog(String(c.req.query("year") || "ALL")));
    } catch (e: any) {
      return c.json({ detail: e?.message || "Invalid planning range." }, 400);
    }
  });
  admin.post("/document-studio/export-home-education", ownerRead, async c => {
    const checked = validateHomeEducationExport(await jsonBody(c));
    if (!checked.ok) return c.json({ detail: checked.detail }, 400);
    const limited = await hitRateLimit((c as any).env.DB, "document-studio:education-export:" + String((c as any).get("user").id), 160, 3600);
    if (!limited.ok) return c.json({ detail: "PDF export limit reached for this hour." }, 429);
    try {
      const pdf = generateHomeEducationTemplate(checked.state, checked.year, false, checked.mode, checked.edition, checked.electives, checked.kind);
      if (pdf.byteLength > MAX_PDF_BYTES) return c.json({ detail: "PDF exceeds 25 MB." }, 413);
      c.header("Cache-Control", "private, no-store");
      const filename = "sidequest-" + checked.state.toLowerCase() + "-" + (checked.year.toUpperCase() === "ALL" ? "flexible-years" : checked.year.toLowerCase()) +
        "-" + checked.kind + "-" + checked.mode + (checked.production.output === "production_master" ? "-owner-proof" : "") + ".pdf";
      return c.json({
        data_url: pdfUrl(pdf), sha256: await fingerprint(pdf),
        state: checked.state, year_level: checked.year, edition: checked.edition, mode: checked.mode,
        product_kind: checked.kind, output: checked.production.output, filename,
        note: checked.production.output === "production_master"
          ? "OWNER PRODUCTION MASTER ONLY: this is not a completed customer's personalised purchase or printed book."
          : "Unreviewed digital customer file. Check every page and official guidance before publishing it in Square.",
      });
    } catch (e: any) {
      return c.json({ detail: e?.message || "Could not generate the PDF." }, 400);
    }
  });
  admin.post("/document-studio/export", ownerRead, async c => {
    const body = await jsonBody(c);
    if (body.mode !== "print" && body.mode !== "fillable") return c.json({ detail: "Choose print or fillable mode." }, 400);
    const limited = await hitRateLimit((c as any).env.DB, "document-studio:activity-export:" + String((c as any).get("user").id), 36, 3600);
    if (!limited.ok) return c.json({ detail: "Activity export limit reached for this hour." }, 429);
    try {
      const result = buildStudioProductPdf(body.product, body.mode);
      if (result.pdf.byteLength > MAX_PDF_BYTES) return c.json({ detail: "PDF exceeds 25 MB." }, 413);
      c.header("Cache-Control", "private, no-store");
      return c.json({ ok: true, data_url: pdfUrl(result.pdf), quality: result.quality, mode: body.mode });
    } catch (e: any) {
      return c.json({ detail: e?.message || "Invalid activity document." }, 400);
    }
  });
}
