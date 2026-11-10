// One-off purchased plans: reuse the subscriber's deterministic state-based
// learning-plan generator, without creating a family/subscription record or
// running Workers AI. Source data is never invented from a buyer's order.
import { buildPlanContent } from "./data/planBuilder";
import { JURISDICTIONS, CHECKED_ON, type JurisdictionCode } from "./data/planJurisdictions";
import { sendEmail } from "./email";
import { renderGuidedDocumentLayout } from "./guidedDocumentLayout";
import type { Env } from "./types";

export const safe = (v: unknown, max = 5000) =>
  typeof v === "string" ? v.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, " ").trim().slice(0, max) : "";
const esc = (s: unknown) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const para = (text: unknown) => `<p style="white-space:pre-wrap">${esc(text || "To be completed by the family.")}</p>`;
const list = (values: unknown) => Array.isArray(values) ? values.filter((v) => typeof v === "string" && v.trim()).map((v) => `<li>${esc(v)}</li>`).join("") : "";
const isDay = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));
export type GuestInput = {
  learner_name?: unknown; year_level?: unknown; period_start?: unknown; period_end?: unknown;
  goals?: unknown; strengths?: unknown; teaching?: unknown; schedule?: unknown;
  resources?: unknown; records?: unknown; review?: unknown;
  areas?: unknown;
};
export function validateGuestInput(raw: GuestInput): {ok: true; data: Record<string, any>} | {ok: false; detail: string} {
  const name = safe(raw.learner_name, 100);
  const year = safe(raw.year_level, 12);
  const start = safe(raw.period_start, 10), end = safe(raw.period_end, 10);
  if (!name || !/^([0-9]|1[0-2]|K|F|Prep)$/i.test(year) || !isDay(start) || !isDay(end) || end < start) {
    return { ok:false, detail:"Enter the learner's name, year level, and a valid learning period before generating." };
  }
  const data: Record<string, any> = { learner_name: name, year_level: year, period_start:start, period_end:end };
  for (const key of ["goals","strengths","teaching","schedule","resources","records","review"]) data[key] = safe((raw as any)[key]);
  const rawAreas = raw.areas && typeof raw.areas === "object" && !Array.isArray(raw.areas) ? raw.areas as Record<string, any> : {};
  data.areas = Object.fromEntries(Object.entries(rawAreas).slice(0, 14).filter(([k]) => k.length < 130).map(([key, row]) => [key,{
    focus: safe(row?.focus), activities: safe(row?.activities), evidence: safe(row?.evidence),
  }]));
  return { ok:true, data };
}
const STAGES: Record<string, string> = { K:"ES1", F:"ES1", Prep:"ES1", "0":"ES1", "1":"S1", "2":"S1", "3":"S2", "4":"S2", "5":"S3", "6":"S3", "7":"S4", "8":"S4", "9":"S5", "10":"S5", "11":"S6", "12":"S6" };

export async function buildGuestPlan(db: D1Database, code: JurisdictionCode, data: Record<string, any>) {
  const jur = JURISDICTIONS[code];
  if (!jur || code === "OTHER") throw new Error("Unknown jurisdiction");
  // Uses the exact same buildPlanContent function as subscribed families.
  // A synthetic id cannot link to any existing student's records.
  const studentId = "guest-" + crypto.randomUUID();
  const student = { id: studentId, name:data.learner_name, stage:STAGES[data.year_level] || "S2", year_level:data.year_level, interests:[] };
  const plan = {
    student_id:studentId, title:`${jur.planName} – ${data.learner_name}`,
    period_start:data.period_start, period_end:data.period_end,
    interests: data.strengths ? data.strengths.split(/[,;\n]/).map((x:string)=>x.trim()).filter(Boolean).slice(0,6) : [],
    subject_focus: [], teaching_approach:data.teaching,
    notes:data.goals,
  };
  const content = await buildPlanContent(db,plan,student,jur);
  return { content, jurisdiction:jur, student, plan, data, checked_on:CHECKED_ON };
}
export function guestPlanHtml(r: Awaited<ReturnType<typeof buildGuestPlan>>, sampleOnly=false) {
  return renderGuidedDocumentLayout(r,sampleOnly);
}
export async function renderGuestPdf(env: Env, html: string): Promise<Uint8Array> {
  if (!env.BROWSER?.quickAction) throw new Error("PDF_RENDERING_UNAVAILABLE");
  const response=await env.BROWSER.quickAction("pdf",{ html, pdfOptions:{ format:"a4",printBackground:true,preferCSSPageSize:true } });
  if (!response.ok) throw new Error("PDF_RENDERING_FAILED");
  const bytes=new Uint8Array(await response.arrayBuffer());
  if (bytes.length < 10 || bytes.length > 16*1024*1024 || new TextDecoder().decode(bytes.slice(0,5)) !== "%PDF-") throw new Error("PDF_INVALID");
  return bytes;
}
export async function emailGuestPdf(env: Env, recipient: string, document: Uint8Array, stateName: string, childIndex=1, childCount=1) {
  if (!env.EMAIL) return false;
  const family = childIndex === 0 && childCount > 1;
  return sendEmail(env,{
    to:recipient,
    subject:family ? `Your Side-Quest family home education planner – ${stateName}` : `Your Side-Quest home education document – ${stateName} (${childIndex} of ${childCount})`,
    text:family ? `Your combined family planner covering ${childCount} children is attached. Each learner has their own section. This is an independent planning resource, not an official government form. Check current local requirements before submission.` : `Document ${childIndex} of ${childCount} is attached. Each child needs their own individualised planning details. This is an independent planning resource, not an official government form. Please check current local requirements before submission. For help, contact support@sidequestlearning.app.`,
    html:"<p>Your Side-Quest home education document is attached as a PDF.</p><p>Please review your family's information and current state requirements before using it for registration or review.</p><p>This is an independent planning resource, not a government-issued document.</p>",
    attachments:[{filename:family ? "side-quest-family-home-education-planner.pdf" : `side-quest-home-education-plan-child-${childIndex}.pdf`,content:document,type:"application/pdf",disposition:"attachment"}],
  });
}
