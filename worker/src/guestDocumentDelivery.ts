// One-off purchased plans: reuse the subscriber's deterministic state-based
// learning-plan generator, without creating a family/subscription record or
// running Workers AI. Source data is never invented from a buyer's order.
import { buildPlanContent } from "./data/planBuilder";
import { JURISDICTIONS, CHECKED_ON, type JurisdictionCode } from "./data/planJurisdictions";
import { sendEmail } from "./email";
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
  const {content:c, jurisdiction:j, data:d} = r;
  const section=(title:string,value:unknown)=>`<section><h2>${esc(title)}</h2>${para(value)}</section>`;
  const areaRows=(sampleOnly ? (c.learning_areas || []).slice(0,1) : (c.learning_areas || [])).map((a:any)=>{
    const entered=d.areas[a.area] || {};
    return `<section><h2>${esc(a.area)}</h2>
      ${section("Learning goals", "")}<ul>${list(a.goals)}</ul>
      ${section("Teaching methods", "")}<ul>${list(a.teaching_methods)}</ul>
      ${section("Suggested learning experiences", "")}<ul>${list(a.sample_activities)}</ul>
      ${section("Family's own topics / goals",entered.focus)}
      ${section("Family's planned activities",entered.activities)}
      ${section("Family's resources and evidence",entered.evidence)}
      ${section("Evidence approach",a.evidence_approach)}
    </section>`;
  }).join("\n");
  if(sampleOnly) return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Side-Quest sample</title><style>
  @page {size:A4;margin:18mm 16mm}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;line-height:1.5;color:#252925}h1{font-size:23pt;color:#25432e}h2{font-size:13pt;color:#25432e;border-bottom:1px solid #bbb;padding-bottom:5px;margin:23px 0 8px}li{margin:7px 0}.sample{background:#f7eddb;border:2px solid #b07c33;padding:13px;margin:16px 0}.cover{border-bottom:3px solid #4a5d3a;padding-bottom:18px}.small{font-size:9pt;color:#555}
  </style></head><body><header class="cover"><p class="small">SIDE-QUEST | HOME EDUCATION DOCUMENT STUDIO</p>
  <h1>${esc(j.planName)}</h1><p>${esc(j.name)} | Year ${esc(d.year_level)} | Alex Example (fictional learner)</p></header>
  <div class="sample"><strong>SAMPLE PREVIEW - NOT A COMPLETE PURCHASED DOCUMENT.</strong> Fictional information only. Your purchased plan is generated from your own answers and includes all applicable learning areas and planning sections.</div>
  ${section("Overview",c.overview)}${section("Educational approach",c.educational_philosophy)}
  <h2>Example learning area</h2>${areaRows}
  <p class="small">End of free sample. The full document also includes the remaining learning areas, assessment, recordkeeping, resource plans, review schedule, requirements checklist and official sources.</p></body></html>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(j.planName)}</title><style>
  @page {size:A4;margin:18mm 16mm}*{box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;font-size:10.5pt;line-height:1.52;color:#252925;background:white}h1{font-size:23pt;color:#25432e;margin:12px 0}h2{font-size:13pt;color:#25432e;margin:20px 0 7px;border-bottom:1px solid #bbb;padding-bottom:4px}section{break-inside:auto}p{margin:6px 0 13px}ul{padding-left:22px}li{margin-bottom:5px}.small{font-size:9pt;color:#555}.notice{border:1px solid #a77c3a;padding:12px;margin:16px 0;background:#fff8ed}.cover{border-bottom:3px solid #4a5d3a;margin-bottom:24px;padding-bottom:12px}
  </style></head><body>
  <header class="cover"><p class="small">SIDE-QUEST • INDEPENDENT HOME EDUCATION RESOURCE</p><h1>${esc(j.planName)}</h1><p>${esc(j.name)} · ${esc(d.learner_name)} · ${esc(d.period_start)} – ${esc(d.period_end)}</p></header>
  <div class="notice">Family draft. Not a government form or approval. Check every statement, official requirement, curriculum source and any government-prescribed form before submission. Current source summary checked ${esc(r.checked_on)}.</div>
  ${section("Overview",c.overview)}
  ${section("Educational approach",c.educational_philosophy)}
  ${section("Learner strengths, interests and needs",d.strengths)}
  ${section("Family's learning goals",d.goals)}
  ${section("Learning environment and schedule",d.schedule)}
  <h2>Learning areas</h2>${areaRows}
  ${section("Weekly rhythm",c.weekly_rhythm)}${section("Family's actual planned schedule",d.schedule)}
  ${section("Assessment and progress approach",c.assessment_approach)}
  ${section("Family's evidence and record keeping",d.records)}
  ${section("Resources overview",c.resources_overview)}
  ${section("Family's named learning resources",d.resources)}
  ${section("Review schedule",c.review_schedule)}${section("Family's review approach",d.review)}
  <section><h2>Requirements to check</h2><ul>${j.requirements.map((v)=>`<li>☐ ${esc(v)}</li>`).join("")}</ul></section>
  <section><h2>Official sources</h2><ul>${j.sources.map((v)=>`<li>${esc(v.title)}: ${esc(v.url)}</li>`).join("")}</ul></section>
  <p class="small">Prepared using Side-Quest's existing deterministic learning-plan generator. This document needs individual factual review by the family, and no registration outcome is guaranteed.</p>
  </body></html>`;
}
export async function renderGuestPdf(env: Env, html: string): Promise<Uint8Array> {
  if (!env.BROWSER?.quickAction) throw new Error("PDF_RENDERING_UNAVAILABLE");
  const response=await env.BROWSER.quickAction("pdf",{ html, pdfOptions:{ format:"a4",printBackground:true,preferCSSPageSize:true } });
  if (!response.ok) throw new Error("PDF_RENDERING_FAILED");
  const bytes=new Uint8Array(await response.arrayBuffer());
  if (bytes.length < 10 || bytes.length > 16*1024*1024 || new TextDecoder().decode(bytes.slice(0,5)) !== "%PDF-") throw new Error("PDF_INVALID");
  return bytes;
}
export async function emailGuestPdf(env: Env, recipient: string, document: Uint8Array, stateName: string) {
  if (!env.EMAIL) return false;
  return sendEmail(env,{
    to:recipient,
    subject:`Your Side-Quest home education document – ${stateName}`,
    text:"Your completed home education planning PDF is attached. This is an independent family planning resource, not an official government form. Please review all details and current local requirements before submission. If you need help, contact support@sidequestlearning.app.",
    html:"<p>Your Side-Quest home education document is attached as a PDF.</p><p>Please review your family's information and current state requirements before using it for registration or review.</p><p>This is an independent planning resource, not a government-issued document.</p>",
    attachments:[{filename:"side-quest-home-education-plan.pdf",content:document,type:"application/pdf",disposition:"attachment"}],
  });
}
