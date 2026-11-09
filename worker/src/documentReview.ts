// Owner-only quality review history. These entries are factual records, not
// government approvals. Every revision is append-only; an upload creates a new
// asset fingerprint and resets its review state.
// The separate shop gate deliberately remains closed until external validation.
import type { Env } from "./types";
import { documentSpec } from "./data/homeEducationDocumentSpecs";

export type ReviewEvidence = {
  sourceNotes: string;
  requirementsNotes: string;
  educationNotes: string;
  fillableNotes: string;
  independentReviewer: string;
  outstandingIssues: string;
};

const SCHEMA = `CREATE TABLE IF NOT EXISTS home_education_document_reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  jurisdiction TEXT NOT NULL,
  document_kind TEXT NOT NULL,
  revision INTEGER NOT NULL,
  pdf_sha256 TEXT,
  source_reviewed_on TEXT NOT NULL,
  spec_reviewed_on TEXT,
  evidence_json TEXT NOT NULL,
  recorded_by TEXT NOT NULL,
  recorded_at TEXT NOT NULL
)`;
const INDEX = "CREATE UNIQUE INDEX IF NOT EXISTS idx_home_doc_product_revision ON home_education_document_reviews(product_id,revision)";
const DB_READY = new WeakMap<object, Promise<void>>();
export function ensureDocumentReviews(db: D1Database): Promise<void> {
  let task = DB_READY.get(db);
  if (!task) {
    task = (async () => { await db.prepare(SCHEMA).run(); await db.prepare(INDEX).run(); })().catch((e) => {
      DB_READY.delete(db); throw e;
    });
    DB_READY.set(db, task);
  }
  return task;
}
export async function sha256(bytes: Uint8Array): Promise<string> {
  return [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))].map((b) => b.toString(16).padStart(2,"0")).join("");
}
export async function reviewsFor(db: D1Database, productId: string) {
  await ensureDocumentReviews(db);
  const { results } = await db.prepare("SELECT * FROM home_education_document_reviews WHERE product_id = ? ORDER BY revision DESC LIMIT 50").bind(productId).all<any>();
  return (results || []).map((r) => ({ ...r, evidence: JSON.parse(r.evidence_json) }));
}
export async function latestReview(db: D1Database, productId: string): Promise<any> {
  await ensureDocumentReviews(db);
  return db.prepare("SELECT * FROM home_education_document_reviews WHERE product_id = ? ORDER BY revision DESC LIMIT 1").bind(productId).first<any>();
}
const strip = (v: unknown, max = 2500) => typeof v === "string" ? v.replace(/[\x00-\x1f\x7f]/g," ").trim().slice(0,max) : "";
// Creates a new revision rather than silently mutating prior reviews.
export async function addReview(db: D1Database, args: {
  productId: string; jurisdiction: string; kind: string;
  digest?: string | null; actor: string; sourceDate: string; evidence: ReviewEvidence;
}) {
  await ensureDocumentReviews(db);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.sourceDate) || !Number.isFinite(Date.parse(args.sourceDate))) throw Error("Use a valid official-source review date.");
  const spec = documentSpec(args.jurisdiction);
  const safeEvidence = Object.fromEntries(["sourceNotes","requirementsNotes","educationNotes","fillableNotes","independentReviewer","outstandingIssues"].map((k) => [k,strip((args.evidence as any)?.[k])]));
  const current = await latestReview(db, args.productId);
  const revision = Number(current?.revision || 0) + 1;
  const id = crypto.randomUUID();
  await db.prepare("INSERT INTO home_education_document_reviews (id,product_id,jurisdiction,document_kind,revision,pdf_sha256,source_reviewed_on,spec_reviewed_on,evidence_json,recorded_by,recorded_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)")
    .bind(id,args.productId,args.jurisdiction,args.kind,revision,args.digest || null,args.sourceDate,spec?.reviewedAgainstSourcesOn || null,JSON.stringify(safeEvidence),args.actor,new Date().toISOString()).run();
  return { id, revision, release_status:"not_approved", pdf_sha256:args.digest || null };
}
export async function pdfReviewFingerprint(env: Env, productId: string): Promise<string | null> {
  if (!env.BUCKET) return null;
  const obj = await env.BUCKET.get(`shop/products/${productId}/file`);
  if (!obj) return null;
  return sha256(new Uint8Array(await obj.arrayBuffer()));
}
