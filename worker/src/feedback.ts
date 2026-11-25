/**
 * Family feedback is private to the submitting parent and the passkey-protected Owner HQ.
 * All identifiers are determined by the authenticated server session, never from input.
 */
import type { App, Guards, Env } from "./types";
import { newId, nowIso } from "./types";
import { hitRateLimit } from "./adminAudit";
import { parseLearningSupport, LEARNING_SUPPORT_HINT } from "./learningSupport";
import { ensureQuoteSchema, supportThread, listSupportQuotes } from "./learningSupportQuotes";
import { listOrders,getOrder,confirmServiceOrder } from "./supportOrders";
import {classroomEnabled,classroomState,editClassroom,canReadClassroomImage} from "./supportClassrooms";
import {videoToken,videoEnabled} from "./supportVideo";
import {readQuotePlan} from "./supportQuotePlans";
import {readSlots,selectSlot} from "./supportSlots";
import {grantedResources,downloadResource,readPresentedImage} from "./supportFiles";
import { sendEmail, SITE_URL, layout, p, button, esc } from "./email";

export const FEEDBACK_CATEGORIES = ["problem", "idea", "feedback", "other"] as const;
export const FEEDBACK_STATUSES = ["new", "reviewing", "in_progress", "resolved", "closed"] as const;

export const FEEDBACK_SCHEMA: readonly string[] = [
  "CREATE TABLE IF NOT EXISTS parent_feedback (id TEXT PRIMARY KEY, family_id TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, category TEXT NOT NULL CHECK (category IN ('problem','idea','feedback','other')), subject TEXT NOT NULL, message TEXT NOT NULL, page_hint TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','reviewing','in_progress','resolved','closed')), owner_note TEXT NOT NULL DEFAULT '', seen_at TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)",
  "CREATE INDEX IF NOT EXISTS idx_parent_feedback_created ON parent_feedback(created_at DESC)",
  "CREATE INDEX IF NOT EXISTS idx_parent_feedback_family ON parent_feedback(family_id,created_at DESC)",
  "CREATE INDEX IF NOT EXISTS idx_parent_feedback_unseen ON parent_feedback(seen_at,created_at DESC)",
  "CREATE TABLE IF NOT EXISTS parent_feedback_replies (id TEXT PRIMARY KEY, feedback_id TEXT NOT NULL REFERENCES parent_feedback(id) ON DELETE CASCADE, author_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, body TEXT NOT NULL, parent_read_at TEXT, created_at TEXT NOT NULL)",
  "CREATE INDEX IF NOT EXISTS idx_parent_feedback_replies_thread ON parent_feedback_replies(feedback_id,created_at,id)",
  "CREATE INDEX IF NOT EXISTS idx_parent_feedback_replies_unread ON parent_feedback_replies(feedback_id,parent_read_at)",
];
/**
 * Creating a NEW support request must never depend on the optional reply/notification
 * tables. Those tables can lag behind a production deploy and are not needed to send feedback.
 */
export async function ensureFeedbackBaseSchema(db: D1Database) {
  for (const statement of FEEDBACK_SCHEMA.slice(0, 4)) await db.prepare(statement).run();
}
export async function ensureFeedbackSchema(db: D1Database) {
  await ensureFeedbackBaseSchema(db);
  for (const statement of FEEDBACK_SCHEMA.slice(4)) await db.prepare(statement).run();
}
const ownRow = (r: any) => ({
  id: r.id, category: r.category, subject: r.subject, message: r.message, page_hint: r.page_hint,
  status: r.status, created_at: r.created_at, updated_at: r.updated_at,
  replies: [] as any[], unread_replies: 0,
});
const isCategory = (value: unknown): value is typeof FEEDBACK_CATEGORIES[number] =>
  typeof value === "string" && (FEEDBACK_CATEGORIES as readonly string[]).includes(value);

async function ownerAlert(env: Env, id: string, category: string) {
  const to = String(env.OWNER_NOTIFICATION_EMAIL || "").trim();
  if (!env.EMAIL || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) return;
  const link = SITE_URL + "/parent/command-centre/feedback";
  // Keep names, addresses and free-text descriptions OUT of the optional email.
  await sendEmail(env, {
    to, subject: category==="learning support"?"Side-Quest Learning Support: new enquiry":"Side-Quest: new " + category + " submission",
    text: "New submission in Owner HQ.\nReference: " + id + "\nCategory: " + category + "\n" + link,
    html: layout({
      preheader: "A new parent message is ready in your private Owner HQ inbox.",
      kicker: "A message from the quest board.",
      heading: "A parent has reported in!",
      body: p("A parent has submitted a " + esc(category) + " report to Owner HQ.") +
        button("Open your feedback inbox", link) +
        p("Private reference: " + esc(id) + ". Open Owner HQ to read the message securely."),
      reason: "You're receiving this as the Side-Quest owner because a parent sent a message.",
    }),
  });
}

export function registerFeedback(app: App, guards: Guards) {
  app.get("/api/feedback", guards.auth, guards.parent, async (c) => {
    // Compatibility fallback: never prevent parents from seeing or sending feedback
    // just because the newly deployed reply table is not yet available.
    const supportOnly = c.req.query("kind") === "learning-support";
    let results: any[] = [];
    try {
      await ensureFeedbackSchema(c.env.DB);
      const r = await c.env.DB.prepare(
        "SELECT id, category, subject, message, page_hint, status, created_at, updated_at FROM parent_feedback WHERE family_id = ? AND user_id = ? AND (? = 0 OR page_hint = 'learning-support') ORDER BY CASE WHEN EXISTS (SELECT 1 FROM parent_feedback_replies r WHERE r.feedback_id=parent_feedback.id AND r.parent_read_at IS NULL) THEN 0 ELSE 1 END, created_at DESC LIMIT 50"
      ).bind(c.get("user").family_id,c.get("user").id,supportOnly ? 1 : 0).all<any>();
      results = r.results ?? [];
    } catch {
      const sql = "SELECT id, category, subject, message, page_hint, status, created_at, updated_at FROM parent_feedback WHERE family_id = ? AND user_id = ? AND (? = 0 OR page_hint = 'learning-support') ORDER BY created_at DESC LIMIT 50";
      try {
        results=(await c.env.DB.prepare(sql).bind(c.get("user").family_id,c.get("user").id,supportOnly ? 1 : 0).all<any>()).results??[];
      } catch (err) {
        if(!/no such table.*parent_feedback/i.test(String(err))) throw err;
        await ensureFeedbackBaseSchema(c.env.DB);
        results=(await c.env.DB.prepare(sql).bind(c.get("user").family_id,c.get("user").id,supportOnly ? 1 : 0).all<any>()).results??[];
      }
    }
    // One batched, family-and-parent-scoped query. Internal notes and other users' replies never leave the server.
    const reports = (results ?? []).map(ownRow);
    if (reports.length) {
      try {
        // Only pull replies for reports actually returned. In particular, an old
        // report with a NEW reply must not be hidden behind the latest 50 reports.
        const ids = reports.map((r: any) => r.id);
        const placeholders = ids.map(() => "?").join(",");
        const { results: replies } = await c.env.DB.prepare(
          "SELECT r.id,r.feedback_id,r.body,r.created_at,r.parent_read_at FROM parent_feedback_replies r JOIN parent_feedback p ON p.id = r.feedback_id WHERE p.family_id = ? AND p.user_id = ? AND r.feedback_id IN (" + placeholders + ") ORDER BY r.created_at ASC,r.id ASC LIMIT 5000"
        ).bind(c.get("user").family_id,c.get("user").id,...ids).all<any>();
        const byId = new Map(reports.map((r: any) => [r.id,r]));
        for (const reply of replies ?? []) {
          const report: any = byId.get(reply.feedback_id);
          if (!report) continue;
          report.replies.push({ id:reply.id, body:reply.body, created_at:reply.created_at, read_at:reply.parent_read_at });
          if (!reply.parent_read_at) report.unread_replies++;
        }
      } catch {
        // Existing feedback records remain readable when reply storage is unavailable.
      }
    }
    c.header("Cache-Control", "no-store");
    if(supportOnly){
      // One scoped lookup for the entire request history, rather than one request per card.
      const quoteMap:Record<string,any[]>={};
      try{
        await ensureQuoteSchema(c.env.DB);
        const ids=reports.map(r=>r.id);
        if(ids.length){
          const {results}=await c.env.DB.prepare("SELECT q.id,q.feedback_id,q.scope,q.delivery,q.amount_cents,q.currency,q.status,q.created_at,q.expires_at,q.responded_at,q.withdrawn_at FROM learning_support_quotes q JOIN parent_feedback p ON p.id=q.feedback_id WHERE p.family_id=? AND p.user_id=? AND p.page_hint='learning-support' AND q.feedback_id IN ("+ids.map(()=>"?").join(",")+") ORDER BY q.created_at DESC,q.id DESC LIMIT 5000").bind(c.get("user").family_id,c.get("user").id,...ids).all<any>();
          const now=nowIso();
          for(const row of results||[]){const {feedback_id,...q}=row;(quoteMap[feedback_id] ||= []).push({...q,status:q.status==="offered"&&q.expires_at<=now?"expired":q.status});}
        }
        return c.json({reports:reports.map(r=>({...r,quotes:quoteMap[r.id]||[]}))});
      }catch{return c.json({reports,quotes_unavailable:true});}
    }
    return c.json({ reports });
  });

  // Small count endpoint for parent-side unread badge. Works on every plan, including expired previews.
  app.get("/api/feedback/unread-count", guards.auth, guards.parent, async (c) => {
    try {
    const u = c.get("user");
    const result = await c.env.DB.prepare(
      "SELECT COUNT(*) n FROM parent_feedback_replies r JOIN parent_feedback p ON p.id=r.feedback_id WHERE p.family_id=? AND p.user_id=? AND r.parent_read_at IS NULL",
    ).bind(u.family_id,u.id).first<{n:number}>();
    // Show the parent which unread thread to open, without exposing message
    // contents or another account's feedback. This powers a transient dashboard alert.
    const latest = Number(result?.n || 0) > 0
      ? await c.env.DB.prepare(
          "SELECT p.id AS feedback_id,p.subject,r.created_at AS replied_at FROM parent_feedback_replies r JOIN parent_feedback p ON p.id=r.feedback_id WHERE p.family_id=? AND p.user_id=? AND r.parent_read_at IS NULL ORDER BY r.created_at DESC,r.id DESC LIMIT 1"
        ).bind(u.family_id,u.id).first<{feedback_id:string;subject:string;replied_at:string}>()
      : null;
    c.header("Cache-Control","no-store");
    return c.json({unread:Number(result?.n || 0),latest:latest||null});
    } catch {
      c.header("Cache-Control","no-store");
      return c.json({unread:0,latest:null,notification_unavailable:true});
    }
  });

  // Acknowledgement is scoped to the exact submitting account, never just a guessed feedback ID.
  app.post("/api/feedback/:id/replies/read", guards.auth, guards.parent, async (c) => {
    await ensureFeedbackSchema(c.env.DB);
    const u=c.get("user");
    const owns = await c.env.DB.prepare(
      "SELECT id FROM parent_feedback WHERE id=? AND family_id=? AND user_id=?",
    ).bind(c.req.param("id"),u.family_id,u.id).first();
    if(!owns) return c.json({detail:"Message not found"},404);
    await c.env.DB.prepare(
      "UPDATE parent_feedback_replies SET parent_read_at=? WHERE feedback_id=? AND parent_read_at IS NULL",
    ).bind(nowIso(),c.req.param("id")).run();
    return c.json({ok:true});
  });

  app.post("/api/learning-support/:id/orders/:oid/video-token",guards.auth,guards.parent,async c=>{
    const u=c.get("user"),id=c.req.param("id");
    if(!await supportThread(c.env.DB,id,u.family_id,u.id))return c.json({detail:"Request not found"},404);
    if(!(await hitRateLimit(c.env.DB,"support-video:"+u.id,8,60)).ok)return c.json({detail:"Try again shortly."},429);
    c.header("Cache-Control","no-store");
    const r=await videoToken(c.env,"member",id,c.req.param("oid"),false);
    return "error" in r?c.json({detail:r.error},409):c.json(r);
  });
  app.get("/api/learning-support/:id/orders/:oid/classroom-image/:fid",guards.auth,guards.parent,async c=>{
    const u=c.get("user"),id=c.req.param("id")??"",oid=c.req.param("oid")??"",fid=c.req.param("fid")??"";
    if(!classroomEnabled(c.env)||!await supportThread(c.env.DB,id,u.family_id,u.id)||!await canReadClassroomImage(c.env.DB,"member",id,oid,fid,false))return c.json({detail:"Image unavailable"},404);
    if(!(await hitRateLimit(c.env.DB,"support-image:"+u.id,30,60)).ok)return c.json({detail:"Try again shortly."},429);
    const r=await readPresentedImage(c.env,fid);c.header("Cache-Control","no-store");return r?c.json(r):c.json({detail:"Image unavailable"},404);
  });
  app.get("/api/learning-support/:id/orders/:oid/classroom",guards.auth,guards.parent,async c=>{
    if(!classroomEnabled(c.env))return c.json({detail:"Classroom pilot is not enabled."},503);
    const u=c.get("user"),id=c.req.param("id");
    if(!await supportThread(c.env.DB,id,u.family_id,u.id))return c.json({detail:"Request not found"},404);
    const s=await classroomState(c.env.DB,"member",id,c.req.param("oid"),false);
    c.header("Cache-Control","no-store");return s?c.json({...s,video_enabled:videoEnabled(c.env)}):c.json({detail:"Confirmed live booking required."},404);
  });
  app.post("/api/learning-support/:id/orders/:oid/classroom-board",guards.auth,guards.parent,async c=>{
    if(!classroomEnabled(c.env))return c.json({detail:"Classroom pilot is not enabled."},503);
    const u=c.get("user"),id=c.req.param("id");
    if(!await supportThread(c.env.DB,id,u.family_id,u.id))return c.json({detail:"Request not found"},404);
    const b=await c.req.json().catch(()=>null);if(!b||typeof b!=="object")return c.json({detail:"Invalid action"},400);
    if(!(await hitRateLimit(c.env.DB,"support-board:"+u.id,100,60)).ok)return c.json({detail:"Board is busy. Try again shortly."},429);
    const s=await editClassroom(c.env.DB,"member",id,c.req.param("oid"),false,b);return "error" in s?c.json({detail:s.error},409):c.json(s);
  });
  app.get("/api/learning-support/:id/orders/:oid/files",guards.auth,guards.parent,async c=>{
    const u=c.get("user"),id=c.req.param("id")??"",oid=c.req.param("oid")??"";
    if(!await supportThread(c.env.DB,id,u.family_id,u.id))return c.json({detail:"Request not found"},404);
    c.header("Cache-Control","no-store");return c.json({files:await grantedResources(c.env.DB,"member",id,oid)});
  });
  app.get("/api/learning-support/:id/orders/:oid/files/:fid/download",guards.auth,guards.parent,async c=>{
    const u=c.get("user"),id=c.req.param("id")??"",oid=c.req.param("oid")??"",fid=c.req.param("fid")??"";
    if(!await supportThread(c.env.DB,id,u.family_id,u.id)||!await getOrder(c.env.DB,"member",id,oid))return c.json({detail:"Request not found"},404);
    if(!(await hitRateLimit(c.env.DB,"support-file:"+u.id,30,60)).ok)return c.json({detail:"Try again shortly."},429);
    const r=await downloadResource(c.env,fid,oid);c.header("Cache-Control","no-store");return r?c.json(r):c.json({detail:"Resource unavailable"},404);
  });
  app.get("/api/learning-support/:id/orders",guards.auth,guards.parent,async c=>{
    const u=c.get("user"),id=c.req.param("id");
    if(!await supportThread(c.env.DB,id,u.family_id,u.id))return c.json({detail:"Request not found"},404);
    c.header("Cache-Control","no-store");return c.json({orders:await listOrders(c.env.DB,"member",id),classroom_enabled:classroomEnabled(c.env)});
  });
  app.post("/api/learning-support/:id/orders/:oid/confirm",guards.auth,guards.parent,async c=>{
    const u=c.get("user"),id=c.req.param("id"),oid=c.req.param("oid"),b=await c.req.json().catch(()=>null);
    const thread=await supportThread(c.env.DB,id,u.family_id,u.id);
    if(!thread)return c.json({detail:"Request not found"},404);
    if(["closed","resolved"].includes(thread.status)||b?.confirmed!==true)return c.json({detail:"Confirm the service terms and arrangements."},400);
    if(!await getOrder(c.env.DB,"member",id,oid)||!await confirmServiceOrder(c.env.DB,"member",id,oid))return c.json({detail:"Order unavailable."},409);
    await c.env.DB.prepare("UPDATE parent_feedback SET seen_at=NULL,updated_at=? WHERE id=? AND family_id=? AND user_id=?").bind(nowIso(),id,u.family_id,u.id).run();
    try{await ownerAlert(c.env,id,"learning support order confirmation");}catch{}
    return c.json({ok:true});
  });
  app.get("/api/learning-support/:id/quotes/:qid/slots",guards.auth,guards.parent,async c=>{
    const u=c.get("user"),id=c.req.param("id");if(!await supportThread(c.env.DB,id,u.family_id,u.id))return c.json({detail:"Request not found"},404);
    c.header("Cache-Control","no-store");return c.json({offer:await readSlots(c.env.DB,"member",id,c.req.param("qid"))});
  });
  app.post("/api/learning-support/:id/quotes/:qid/slots/select",guards.auth,guards.parent,async c=>{
    const u=c.get("user"),id=c.req.param("id");if(!await supportThread(c.env.DB,id,u.family_id,u.id))return c.json({detail:"Request not found"},404);
    if(!(await hitRateLimit(c.env.DB,"support-slot:"+u.id,10,60)).ok)return c.json({detail:"Try again shortly."},429);
    const r=await selectSlot(c.env.DB,"member",id,c.req.param("qid"),await c.req.json().catch(()=>null));if("error" in r)return c.json({detail:r.error},409);
    await c.env.DB.prepare("UPDATE parent_feedback SET seen_at=NULL,updated_at=? WHERE id=? AND family_id=? AND user_id=?").bind(nowIso(),id,u.family_id,u.id).run();
    try{await ownerAlert(c.env,id,"learning support appointment selection");}catch{}return c.json(r,201);
  });
  app.get("/api/learning-support/:id/quotes/:qid/plan",guards.auth,guards.parent,async c=>{
    const u=c.get("user"),id=c.req.param("id");if(!await supportThread(c.env.DB,id,u.family_id,u.id))return c.json({detail:"Request not found"},404);
    c.header("Cache-Control","no-store");return c.json({plan:await readQuotePlan(c.env.DB,"member",id,c.req.param("qid"))});
  });
  app.get("/api/learning-support/:id/quotes",guards.auth,guards.parent,async c=>{
    await ensureFeedbackBaseSchema(c.env.DB);
    const u=c.get("user"),id=c.req.param("id");
    if(!await supportThread(c.env.DB,id,u.family_id,u.id))return c.json({detail:"Request not found"},404);
    await ensureQuoteSchema(c.env.DB);
    c.header("Cache-Control","no-store");
    return c.json({quotes:await listSupportQuotes(c.env.DB,id)});
  });
  app.post("/api/learning-support/:id/quotes/:quoteId/respond",guards.auth,guards.parent,async c=>{
    const u=c.get("user"),id=c.req.param("id"),qid=c.req.param("quoteId");
    const b=await c.req.json().catch(()=>null);
    if(!b||!["interested","declined"].includes(b.response)||b.confirmed!==true)return c.json({detail:"Confirm your response to the proposal."},400);
    await ensureFeedbackBaseSchema(c.env.DB);
    if(!await supportThread(c.env.DB,id,u.family_id,u.id))return c.json({detail:"Request not found"},404);
    await ensureQuoteSchema(c.env.DB);
    const when=nowIso();
    const changed=await c.env.DB.prepare("UPDATE learning_support_quotes SET status=?,responded_at=? WHERE id=? AND feedback_id=? AND status='offered' AND expires_at>? AND EXISTS (SELECT 1 FROM parent_feedback p WHERE p.id=learning_support_quotes.feedback_id AND p.family_id=? AND p.user_id=? AND p.page_hint='learning-support' AND p.status NOT IN ('closed','resolved'))").bind(b.response,when,qid,id,when,u.family_id,u.id).run();
    if(!changed.meta?.changes)return c.json({detail:"This proposal is no longer open. Refresh to see its current status."},409);
    await c.env.DB.prepare("UPDATE parent_feedback SET seen_at=NULL,updated_at=? WHERE id=? AND family_id=? AND user_id=?").bind(when,id,u.family_id,u.id).run();
    try{await ownerAlert(c.env,id,"learning support proposal response");}catch{}
    return c.json({ok:true,status:b.response});
  });

  app.post("/api/feedback", guards.auth, guards.parent, async (c) => {
    const input: unknown = await c.req.json().catch(() => null);
    if (!input || typeof input !== "object" || Array.isArray(input)) return c.json({ detail: "Enter a report." }, 400);
    let b = input as Record<string, unknown>;
    if (b.kind === LEARNING_SUPPORT_HINT) {
      const parsed = parseLearningSupport(b);
      if ("error" in parsed) return c.json({ detail: parsed.error }, 400);
      b = parsed;
    } else if (typeof b.page_hint === "string" && b.page_hint.trim() === LEARNING_SUPPORT_HINT) {
      return c.json({ detail: "Use the learning support request form." }, 400);
    }
    if (!isCategory(b.category)) return c.json({ detail: "Choose a report category." }, 400);
    if (typeof b.subject !== "string" || b.subject.trim().length < 4 || b.subject.trim().length > 120)
      return c.json({ detail: "Give your report a title (4 to 120 characters)." }, 400);
    if (typeof b.message !== "string" || b.message.trim().length < 10 || b.message.trim().length > 4000)
      return c.json({ detail: "Describe it in 10 to 4000 characters." }, 400);
    if (b.page_hint !== undefined && (typeof b.page_hint !== "string" || b.page_hint.length > 160))
      return c.json({ detail: "Page or feature name is too long." }, 400);
    const user = c.get("user");
    const limit = await hitRateLimit(c.env.DB, "feedback:" + user.id, 5, 600);
    if (!limit.ok) { c.header("Retry-After", String(limit.retryAfter)); return c.json({ detail: "You've sent several reports. Please try again in a few minutes." }, 429); }
    const id = newId(), now = nowIso();
    // Preserve validated scalars across the asynchronous database writes below.
    const title = (b.subject as string).trim();
    const detail = (b.message as string).trim();
    const hint = typeof b.page_hint === "string" ? b.page_hint.trim() : "";
    // Production has the table already. Avoid running migration DDL every
    // time a parent presses Send. Provision the base table only on fresh installs.
    const save = () => c.env.DB.prepare(
      "INSERT INTO parent_feedback (id,family_id,user_id,category,subject,message,page_hint,status,owner_note,seen_at,created_at,updated_at) VALUES (?,?,?,?,?,?,?,'new','',NULL,?,?)"
    ).bind(id,user.family_id,user.id,b.category,title,detail,hint,now,now).run();
    try { await save(); } catch (err) {
      if (!/no such table.*parent_feedback/i.test(String(err))) throw err;
      await ensureFeedbackBaseSchema(c.env.DB);
      await save();
    }
    // A failed or unconfigured email never undoes the durable, private HQ submission.
    try { await ownerAlert(c.env, id, hint === LEARNING_SUPPORT_HINT ? "learning support" : b.category); } catch { /* optional */ }
    return c.json({ id, status: "new", created_at: now }, 201);
  });
}
