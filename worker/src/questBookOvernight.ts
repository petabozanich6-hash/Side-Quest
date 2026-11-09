import type { App, Guards, Env } from "./types";
import { isPlatformOwner } from "./access";
import { listBooks, readChapters, chapterRevision, companionLessonIssues, generateQuestCompanionLesson, repairQuestCompanionLessonPass, subjectLabel, yearLabel } from "./questBooks";

type DB = D1Database;
type Kind = "generate" | "repair";
type Job = { id: string; owner_user_id: string; family_id: string; status: string; kind: Kind; auto_approve: number; auto_follow: number; last_scan_at: string | null; total: number; created_at: string };
type Item = { id: string; job_id: string; book_id: string; book_title: string; chapter_id: string;
  chapter_title: string; revision: string; status: string; attempts: number; lease_until: string | null; lesson_id: string | null };
const MAX_ITEMS = 2000;
const RETRIES = 4;
const LEASE_MS = 30 * 60_000;
const SYNC_MS = 2 * 60_000;
const MAX_SYNC_ITEMS = 120;

/** D1-backed jobs survive tab closure, Cloudflare restarts, and interrupted cron runs.
 * The schema check (two CREATE TABLEs, PRAGMAs and three index statements) runs once per
 * isolate per database instead of on every poll and every cron tick: repeating DDL on each
 * request competed with real work on the single-threaded D1 database. */
const overnightSchemaReady = new WeakSet<object>();
export async function ensureOvernightTables(db: DB) {
  if (overnightSchemaReady.has(db as object)) return;
  await createOvernightTables(db);
  overnightSchemaReady.add(db as object);
}
/** Forget the cached schema check for this database (tests that rewrite the schema mid-run). */
export function forgetOvernightSchema(db: DB) { overnightSchemaReady.delete(db as object); }
async function createOvernightTables(db: DB) {
  await db.prepare(`CREATE TABLE IF NOT EXISTS quest_overnight_jobs (
    id TEXT PRIMARY KEY, owner_user_id TEXT NOT NULL, family_id TEXT NOT NULL,
    status TEXT NOT NULL, kind TEXT NOT NULL DEFAULT 'generate', auto_approve INTEGER NOT NULL DEFAULT 0, total INTEGER NOT NULL, created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL, finished_at TEXT, last_error TEXT,
    auto_follow INTEGER NOT NULL DEFAULT 0, last_scan_at TEXT
  )`).run();
  await db.prepare(`CREATE TABLE IF NOT EXISTS quest_overnight_items (
    id TEXT PRIMARY KEY, job_id TEXT NOT NULL, position INTEGER NOT NULL,
    book_id TEXT NOT NULL, book_title TEXT NOT NULL,
    chapter_id TEXT NOT NULL, chapter_title TEXT NOT NULL,
    revision TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending',
    attempts INTEGER NOT NULL DEFAULT 0, lease_until TEXT,
    lesson_id TEXT, last_error TEXT, updated_at TEXT NOT NULL,
    UNIQUE(job_id, book_id, chapter_id)
  )`).run();
  // Additive migration: preserve already-running queues and opt them into live pickup.
  // New legacy/imported test jobs default to non-watching unless explicitly started.
  const columns = (await db.prepare("PRAGMA table_info(quest_overnight_jobs)").all<{name:string}>()).results || [];
  if(!columns.some((c)=>c.name==="auto_follow")) {
    try {
      await db.prepare("ALTER TABLE quest_overnight_jobs ADD COLUMN auto_follow INTEGER NOT NULL DEFAULT 0").run();
      await db.prepare("UPDATE quest_overnight_jobs SET auto_follow=1 WHERE status IN ('running','paused')").run();
    } catch(e) {
      const refreshed = (await db.prepare("PRAGMA table_info(quest_overnight_jobs)").all<{name:string}>()).results || [];
      if(!refreshed.some((c)=>c.name==="auto_follow"))throw e;
    }
  }
  if(!columns.some((c)=>c.name==="last_scan_at")) {
    try { await db.prepare("ALTER TABLE quest_overnight_jobs ADD COLUMN last_scan_at TEXT").run(); }
    catch(e) {
      const refreshed = (await db.prepare("PRAGMA table_info(quest_overnight_jobs)").all<{name:string}>()).results || [];
      if(!refreshed.some((c)=>c.name==="last_scan_at"))throw e;
    }
  }
  await db.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS quest_one_active_overnight_kind
    ON quest_overnight_jobs(family_id,kind) WHERE status IN ('building','running','paused')`).run();
  await db.prepare(`DROP INDEX IF EXISTS quest_one_active_overnight_job`).run();
  await db.prepare(`CREATE INDEX IF NOT EXISTS quest_overnight_item_pick
    ON quest_overnight_items(job_id,status,position)`).run();
}

/**
 * Every Quest Book companion lesson for the family, newest first, grouped by book.
 * One indexed query per family replaces the previous two full JSON scans of `lessons`
 * per book; those scans were ~98% of all D1 time and overloaded the database
 * (the admin page polls this and the cron runs it every minute).
 */
async function questLessonsByBook(db: DB, familyId: string) {
  const { results } = await db.prepare(`SELECT id,status,version,updated_at,data,
    json_extract(data,'$.quest_chapter_id') AS chapter_id,
    json_extract(data,'$.quest_book_id') AS book_id
    FROM lessons WHERE family_id=? AND archived_at IS NULL AND json_valid(data)
    AND json_extract(data,'$.quest_book_id') IS NOT NULL
    AND COALESCE(json_extract(data,'$.source'),'')!='side_quest_book'
    ORDER BY updated_at DESC`).bind(familyId).all<any>();
  const byBook = new Map<string, any[]>();
  for (const row of results || []) {
    const key = String(row.book_id);
    const list = byBook.get(key) || [];
    list.push(row); byBook.set(key, list);
  }
  return byBook;
}
export async function overnightCandidates(env: Env, familyId: string) {
  const books = (await listBooks(env.BUCKET)).filter((book) => book.has_book);
  const lessonsByBook = books.length ? await questLessonsByBook(env.DB, familyId) : new Map<string, any[]>();
  const grouped = [];
  for (const book of books) {
    const chapters = book.has_chapters ? await readChapters(env.BUCKET!, book.id) : [];
    const rows = lessonsByBook.get(book.id) || [];
    // A real working draft in ANY status counts as generated; never remake it overnight.
    const existing = new Set(rows.map((r) => r.chapter_id).filter(Boolean));
    const missing = chapters.filter((ch) => !existing.has(ch.id));
    const latest = new Map<string,any>();
    for (const row of rows || []) if(row.chapter_id && !latest.has(row.chapter_id))latest.set(row.chapter_id,row);
    const repairItems: Array<{book_id:string;book_title:string;chapter_id:string;chapter_title:string;revision:string;lesson_id:string;lesson_updated_at:string}> = [];
    let cleared=0, blocked=0;
    for(const chapter of chapters) {
      const row=latest.get(chapter.id);
      if(!row)continue;
      const saved=JSON.parse(row.data||"{}"),rev=chapterRevision(chapter);
      if(saved.quest_source_revision!==rev){blocked++;continue;}
      const flags=Array.isArray(saved.ai_flags)?saved.ai_flags:[],gaps=companionLessonIssues(saved);
      const manual=saved.book_repair_requested===true && saved.book_repair_ai_attempted!==true;
      if(row.status==="draft" && saved.ai_generated===true && (flags.length||gaps.length||manual))
        repairItems.push({book_id:book.id,book_title:book.title,chapter_id:chapter.id,
          chapter_title:chapter.title,revision:rev,lesson_id:row.id,lesson_updated_at:row.updated_at});
      else if(row.status==="draft" && saved.ai_generated===true &&
        Array.isArray(saved.ai_flags) && !flags.length && !gaps.length && saved.book_repair_requested!==true)cleared++;
      else if(row.status==="draft" && (manual||flags.length||gaps.length))blocked++;
    }
    grouped.push({
      id: book.id,title:book.title,year_subject:`${yearLabel(book.year)} · ${subjectLabel(book)}`,
      has_chapters:chapters.length>0,total:chapters.length,
      generated:chapters.length-missing.length,missing:missing.length,
      repairable:repairItems.length,ai_cleared:cleared,blocked,
      items:missing.map((ch)=>({book_id:book.id,book_title:book.title,chapter_id:ch.id,
        chapter_title:ch.title,revision:chapterRevision(ch)})),
      repair_items:repairItems,
    });
  }
  return grouped;
}
async function snapshot(db: DB, familyId: string, userId: string, kind?: "generate" | "repair") {
  const job = await db.prepare(`SELECT * FROM quest_overnight_jobs
    WHERE family_id=? AND owner_user_id=? AND (? IS NULL OR kind=?)
    ORDER BY CASE WHEN status IN ('building','running','paused') THEN 0 ELSE 1 END, created_at DESC LIMIT 1`)
    .bind(familyId,userId,kind??null,kind??null).first<any>();
  if (!job) return null;
  const counts = await db.prepare(`SELECT
    SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) pending,
    SUM(CASE WHEN status='running' THEN 1 ELSE 0 END) processing,
    SUM(CASE WHEN status='done' THEN 1 ELSE 0 END) generated,
    SUM(CASE WHEN status='skipped' THEN 1 ELSE 0 END) skipped,
    SUM(CASE WHEN status='failed' THEN 1 ELSE 0 END) failed
    FROM quest_overnight_items WHERE job_id=?`).bind(job.id).first<any>();
  const books = await db.prepare(`SELECT book_id,MAX(book_title) book_title,COUNT(*) total,
    SUM(CASE WHEN status='done' THEN 1 ELSE 0 END) generated,
    SUM(CASE WHEN status='skipped' THEN 1 ELSE 0 END) skipped,
    SUM(CASE WHEN status='failed' THEN 1 ELSE 0 END) failed
    FROM quest_overnight_items WHERE job_id=? GROUP BY book_id ORDER BY MIN(position)`)
    .bind(job.id).all<any>();
  const failures = await db.prepare(`SELECT book_title,chapter_title,last_error FROM quest_overnight_items
    WHERE job_id=? AND status='failed' ORDER BY position LIMIT 25`).bind(job.id).all<any>();
  const current = await db.prepare(`SELECT book_title,chapter_title,status,attempts,updated_at
    FROM quest_overnight_items WHERE job_id=? AND status='running' ORDER BY updated_at DESC LIMIT 1`).bind(job.id).first<any>();
  const recent = await db.prepare(`SELECT book_title,chapter_title,status,attempts,last_error,updated_at
    FROM quest_overnight_items WHERE job_id=? AND status IN ('done','skipped','failed')
    ORDER BY updated_at DESC,position DESC LIMIT 1`).bind(job.id).first<any>();
  const next = await db.prepare(`SELECT book_title,chapter_title,status,attempts,updated_at
    FROM quest_overnight_items WHERE job_id=? AND status='pending' ORDER BY position LIMIT 1`).bind(job.id).first<any>();
  return { id: job.id, status: job.status, kind: job.kind||"generate", auto_approve: job.auto_approve===1,
    auto_follow: job.auto_follow===1, last_scan_at:job.last_scan_at, current:current||null, recent:recent||null, next:next||null,
    total: job.total, updated_at: job.updated_at,
    finished_at: job.finished_at, last_error: job.last_error,
    counts: counts || {}, books: books.results || [], failures: failures.results || [] };
}

export function registerQuestOvernight(app: App, g: Guards) {
  const ownerOnly = async (c: any, next: any) => {
    if (!(await isPlatformOwner(c.env.DB,c.get("user").id)))
      return c.json({ detail:"Platform-owner access required" },403);
    if (!c.env.BUCKET) return c.json({ detail:"Private book storage is unavailable" },503);
    return next();
  };
  app.get("/api/quest-books/admin/overnight",g.auth,g.parent,ownerOnly,async(c)=>{
    const user=c.get("user");
    await ensureOvernightTables(c.env.DB);
    const [books,generation,repair]=await Promise.all([overnightCandidates(c.env,user.family_id),
      snapshot(c.env.DB,user.family_id,user.id,"generate"),snapshot(c.env.DB,user.family_id,user.id,"repair")]);
    const jobs=[generation,repair].filter(Boolean);
    const attention = await c.env.DB.prepare(`SELECT i.job_id,j.kind,i.book_title,i.chapter_title,i.last_error,i.updated_at
      FROM quest_overnight_items i JOIN quest_overnight_jobs j ON j.id=i.job_id
      WHERE j.family_id=? AND j.owner_user_id=? AND i.status='failed'
      ORDER BY i.updated_at DESC LIMIT 25`).bind(user.family_id,user.id).all<any>();
    c.header("Cache-Control","no-store");
    return c.json({ books: books.map(({items,repair_items,...rest})=>rest),job:jobs[0]??null,jobs,attention:attention.results||[],interval_minutes:1 });
  });
  app.post("/api/quest-books/admin/overnight/start",g.auth,g.parent,ownerOnly,async(c)=>{
    const user=c.get("user"),body:any=await c.req.json().catch(()=>({}));
    await ensureOvernightTables(c.env.DB);
    const kind=body.mode==="repair"?"repair":"generate";
    const ids: string[]=Array.isArray(body.book_ids)?[...new Set<string>(body.book_ids.map(String))]:[];
    if (!ids.length || ids.length>100 || ids.some((id)=>!/^[a-z0-9-]{1,64}$/.test(id)))
      return c.json({detail:"Select your uploaded books to generate."},400);
    if(!c.env.AI)return c.json({detail:"AI generation is unavailable."},503);
    const all=await overnightCandidates(c.env,user.family_id);
    const chosen=all.filter((b)=>ids.includes(b.id));
    if(chosen.length!==ids.length)return c.json({detail:"A selected book was not found."},400);
    if(chosen.some((b)=>!b.has_chapters))
      return c.json({detail:"Analyse the selected book's chapter plan first."},409);
    const items=chosen.flatMap((b)=>kind==="repair"?b.repair_items:b.items);
    if(!items.length)return c.json({detail:kind==="repair"?
      "No flagged draft lessons in these books.":"All selected lessons have already been generated."},409);
    if(items.length>MAX_ITEMS)return c.json({detail:"Too many lessons for one queue. Select fewer books."},400);
    const id=crypto.randomUUID(),time=new Date().toISOString();
    try {
      await c.env.DB.prepare(`INSERT INTO quest_overnight_jobs
        (id,owner_user_id,family_id,status,kind,auto_approve,auto_follow,total,created_at,updated_at)
        VALUES (?,?,?,'building',?,?,?,?,?,?)`)
        // Watching for newly uploaded books (and newly flagged drafts) is opt-in: uploading a PDF must not start AI work.
        .bind(id,user.id,user.family_id,kind,kind==="generate" && body.auto_approve===true?1:0,body.auto_follow===true?1:0,items.length,time,time).run();
    } catch { return c.json({detail:"A queue of this type is already active. Open it instead."},409); }
    try {
      for(let i=0;i<items.length;i+=40) {
        await c.env.DB.batch(items.slice(i,i+40).map((ch,offset)=>
          c.env.DB.prepare(`INSERT INTO quest_overnight_items
          (id,job_id,position,book_id,book_title,chapter_id,chapter_title,revision,lesson_id,status,updated_at)
          VALUES (?,?,?,?,?,?,?,?,?,'pending',?)`)
          .bind(crypto.randomUUID(),id,i+offset,ch.book_id,ch.book_title,ch.chapter_id,
            ch.chapter_title,ch.revision,"lesson_id" in ch?ch.lesson_id:null,time)));
      }
      await c.env.DB.prepare(`UPDATE quest_overnight_jobs SET status='running',updated_at=?
        WHERE id=? AND status='building'`).bind(time,id).run();
    } catch {
      await c.env.DB.prepare(`UPDATE quest_overnight_jobs SET status='cancelled',
        last_error='Failed to prepare queue',updated_at=? WHERE id=?`).bind(time,id).run();
      return c.json({detail:"Queue preparation failed. No lessons were generated."},503);
    }
    c.header("Cache-Control","no-store");
    return c.json({ok:true,job:await snapshot(c.env.DB,user.family_id,user.id,kind)});
  });
  app.post("/api/quest-books/admin/overnight/:id/control",g.auth,g.parent,ownerOnly,async(c)=>{
    const user=c.get("user"),id=c.req.param("id"),body:any=await c.req.json().catch(()=>({}));
    if (!/^[a-f0-9-]{36}$/i.test(id) || !["pause","resume","retry_failed","stop","set_auto_approve","set_auto_follow"].includes(body.action))
      return c.json({detail:"Unknown queue action."},400);
    await ensureOvernightTables(c.env.DB);
    const job=await c.env.DB.prepare(`SELECT * FROM quest_overnight_jobs
      WHERE id=? AND owner_user_id=? AND family_id=?`)
      .bind(id,user.id,user.family_id).first<Job>();
    if(!job)return c.json({detail:"Queue not found."},404);
    const time=new Date().toISOString();
    if(body.action==="pause" && job.status==="running")
      await c.env.DB.prepare(`UPDATE quest_overnight_jobs SET status='paused',updated_at=?
        WHERE id=? AND status='running'`).bind(time,id).run();
    else if(body.action==="resume" && job.status==="paused")
      await c.env.DB.prepare(`UPDATE quest_overnight_jobs SET status='running',updated_at=?
        WHERE id=? AND status='paused'`).bind(time,id).run();
    else if(body.action==="set_auto_approve" && job.kind==="generate" && ["running","paused"].includes(job.status)
      && typeof body.enabled==="boolean") {
      await c.env.DB.prepare(`UPDATE quest_overnight_jobs SET auto_approve=?,updated_at=? WHERE id=?`)
        .bind(body.enabled?1:0,time,id).run();
    }
    else if(body.action==="set_auto_follow" && ["running","paused"].includes(job.status)
      && typeof body.enabled==="boolean") {
      await c.env.DB.prepare(`UPDATE quest_overnight_jobs SET auto_follow=?,last_scan_at=NULL WHERE id=?`)
        .bind(body.enabled?1:0,id).run();
    }
    else if(body.action==="stop" && ["running","paused"].includes(job.status)) {
      // Preserve every item and lesson for audit; stop scheduling after the in-flight item.
      await c.env.DB.prepare(`UPDATE quest_overnight_jobs SET status='stopped',auto_follow=0,finished_at=?,updated_at=?
        WHERE id=? AND status IN ('running','paused')`).bind(time,time,id).run();
    }
    else if(body.action==="retry_failed" && ["running","paused","completed","completed_with_errors"].includes(job.status)) {
      await c.env.DB.prepare(`UPDATE quest_overnight_items SET status='pending',attempts=0,
        last_error=NULL,lease_until=NULL,updated_at=? WHERE job_id=? AND status='failed'`)
        .bind(time,id).run();
      // Retrying failed items never overrides a manual pause.
      if(job.status!=="paused")await c.env.DB.prepare(`UPDATE quest_overnight_jobs SET status='running',updated_at=?,
        finished_at=NULL WHERE id=?`).bind(time,id).run();
    } else return c.json({detail:"This action isn't available for the queue's current status."},409);
    c.header("Cache-Control","no-store");
    return c.json({ok:true,job:await snapshot(c.env.DB,user.family_id,user.id,job.kind)});
  });
}


/** Refresh active watch queues from the saved book plans, independent of browser tabs.
 * Scans are throttled to two minutes and queue inserts are idempotent. Stopped jobs
 * cannot be refilled; completed/failed items are kept for audit and owner action. */
export async function syncOvernightWork(env: Env, now = new Date()) {
  if(!env.DB || !env.BUCKET)return {added:0};
  await ensureOvernightTables(env.DB);
  const time=now.toISOString(),cutoff=new Date(now.getTime()-SYNC_MS).toISOString();
  const {results:watchers}=await env.DB.prepare(`SELECT * FROM quest_overnight_jobs
    WHERE status IN ('running','paused') AND auto_follow=1 ORDER BY created_at`).all<Job>();
  const families=new Map<string,Job[]>();
  for(const job of watchers||[]) {
    const items=families.get(job.family_id)||[];
    items.push(job);families.set(job.family_id,items);
  }
  let added=0;
  for(const [familyId,original] of families) {
    const jobs=[...original];
    const generate=jobs.find(j=>j.kind==="generate" && j.status==="running");
    const repair=jobs.find(j=>j.kind==="repair");
    const due=jobs.filter(j=>!j.last_scan_at || j.last_scan_at<=cutoff);
    if(!due.length)continue;
    if(!await isPlatformOwner(env.DB,due[0].owner_user_id))continue;
    const books=await overnightCandidates(env,familyId);
    if(generate && !repair && books.some(b=>b.repair_items.length>0) && await isPlatformOwner(env.DB,generate.owner_user_id)) {
      // Stopping repairs is a real opt-out for this generation run.
      const lastRepair=await env.DB.prepare(`SELECT status,finished_at FROM quest_overnight_jobs
        WHERE family_id=? AND kind='repair' ORDER BY created_at DESC LIMIT 1`)
        .bind(familyId).first<any>();
      if(!(lastRepair?.status==="stopped" && lastRepair.finished_at>=generate.created_at)) {
        const id=crypto.randomUUID();
        try {
          await env.DB.prepare(`INSERT INTO quest_overnight_jobs
            (id,owner_user_id,family_id,status,kind,auto_approve,auto_follow,total,created_at,updated_at)
            VALUES (?,?,?,'running','repair',0,1,0,?,?)`)
            .bind(id,generate.owner_user_id,familyId,time,time).run();
          const started=await env.DB.prepare(`SELECT * FROM quest_overnight_jobs WHERE id=?`).bind(id).first<Job>();
          if(started){jobs.push(started);due.push(started);}
        }catch {
          // Another cron or owner request already started a repair queue.
        }
      }
    }
    for(const job of due) {
      // Only the same active queue that opted in may accept new work.
      const active=await env.DB.prepare(`SELECT status,auto_follow FROM quest_overnight_jobs
        WHERE id=?`).bind(job.id).first<{status:string;auto_follow:number}>();
      if(!active || !["running","paused"].includes(active.status) || active.auto_follow!==1)continue;
      const all=books.flatMap(b=>job.kind==="repair"?b.repair_items:b.items);
      const {results:stored}=await env.DB.prepare(`SELECT id,book_id,chapter_id,status,lesson_id,updated_at,revision
        FROM quest_overnight_items WHERE job_id=?`).bind(job.id).all<any>();
      const existing=new Map((stored||[]).map(i=>[`${i.book_id}::${i.chapter_id}`,i]));
      const outstanding=(stored||[]).filter(i=>i.status==="pending"||i.status==="running").length;
      let slots=Math.max(0,Math.min(MAX_SYNC_ITEMS,MAX_ITEMS-outstanding));
      let next=(await env.DB.prepare(`SELECT COALESCE(MAX(position),-1)+1 AS n
        FROM quest_overnight_items WHERE job_id=?`).bind(job.id).first<{n:number}>())?.n??0;
      const toInsert:Array<any>=[];
      for(const entry of all) {
        const previous=existing.get(`${entry.book_id}::${entry.chapter_id}`);
        if(previous) {
          // A newly reported quality problem is a fresh piece of work even if
          // that chapter passed an earlier repair. Never revive failed items.
          if(job.kind==="repair" && slots>0 && ["done","skipped"].includes(previous.status)
             && "lesson_updated_at" in entry && typeof entry.lesson_updated_at==="string"
             && "lesson_id" in entry && typeof entry.lesson_id==="string"
             && entry.lesson_updated_at>previous.updated_at) {
            const changed=await env.DB.prepare(`UPDATE quest_overnight_items SET status='pending',attempts=0,
              lesson_id=?,revision=?,book_title=?,chapter_title=?,last_error=NULL,lease_until=NULL,updated_at=?
              WHERE id=? AND job_id=? AND status IN ('done','skipped') AND updated_at<? AND
              EXISTS(SELECT 1 FROM quest_overnight_jobs WHERE id=? AND auto_follow=1 AND status IN ('running','paused'))`)
              .bind(entry.lesson_id,entry.revision,entry.book_title,entry.chapter_title,time,
                previous.id,job.id,entry.lesson_updated_at,job.id).run();
            if(changed.meta?.changes){slots--;added++;}
          } else if(previous.status==="pending" && previous.revision!==entry.revision) {
            await env.DB.prepare(`UPDATE quest_overnight_items SET revision=?,chapter_title=?,book_title=?
              WHERE id=? AND job_id=? AND status='pending'`)
              .bind(entry.revision,entry.chapter_title,entry.book_title,previous.id,job.id).run();
          }
          continue;
        }
        if(slots<=0)break;
        toInsert.push({...entry,id:crypto.randomUUID(),position:next++});
        slots--;
      }
      for(let i=0;i<toInsert.length;i+=40) {
        const rows=toInsert.slice(i,i+40);
        const results=await env.DB.batch(rows.map(ch=>env.DB.prepare(`INSERT OR IGNORE INTO quest_overnight_items
          (id,job_id,position,book_id,book_title,chapter_id,chapter_title,revision,lesson_id,status,updated_at)
          SELECT ?,?,?,?,?,?,?,?,?,'pending',?
          WHERE EXISTS(SELECT 1 FROM quest_overnight_jobs
            WHERE id=? AND auto_follow=1 AND status IN ('running','paused'))`)
          .bind(ch.id,job.id,ch.position,ch.book_id,ch.book_title,ch.chapter_id,ch.chapter_title,
            ch.revision,"lesson_id" in ch?ch.lesson_id:null,time,job.id)));
        const written=results.reduce((n,r)=>n+Number(r.meta?.changes||0),0);
        if(written){
          added+=written;
          await env.DB.prepare(`UPDATE quest_overnight_jobs SET total=total+? WHERE id=?`)
            .bind(written,job.id).run();
        }
      }
      await env.DB.prepare(`UPDATE quest_overnight_jobs SET last_scan_at=?
        WHERE id=? AND status IN ('running','paused') AND auto_follow=1`).bind(time,job.id).run();
    }
  }
  return {added};
}

/** Accept only a newly generated, unflagged and content-complete lesson at its
 * exact database version. Never auto approve a working lesson edited by its owner.
 * This mirrors the per-book fast-approval safety rules, without publishing.
 */
async function approveNewAiCleared(env:Env, job:Job, item:Item, lessonId:string, now:string) {
  const row=await env.DB.prepare(`SELECT id, family_id, version, status, data FROM lessons
    WHERE id=? AND family_id=? AND archived_at IS NULL`).bind(lessonId,job.family_id).first<any>();
  if(!row || row.status!=="draft" || Number(row.version)!==1)return false;
  let data:any;
  try{data=JSON.parse(row.data||"{}");}catch{return false;}
  if(data.quest_book_id!==item.book_id || data.quest_chapter_id!==item.chapter_id ||
    data.quest_source_revision!==item.revision || data.ai_generated!==true ||
    data.book_repair_requested===true || !Array.isArray(data.ai_flags) ||
    data.ai_flags.length!==0 || companionLessonIssues(data).length>0)return false;
  const next={...data,review_status:"parent_reviewed",
    book_plan_saved_version:row.version,book_plan_saved_at:now,book_plan_saved_by:job.owner_user_id,
    book_reviewed_version:row.version,book_reviewed_at:now,book_reviewed_by:job.owner_user_id,
    book_review_method:"owner_opt_in_ai_cleared_overnight"};
  const changed=await env.DB.prepare(`UPDATE lessons SET status='ready',data=?,updated_at=?
    WHERE id=? AND family_id=? AND version=? AND status='draft' AND data=?
    AND archived_at IS NULL`).bind(JSON.stringify(next),now,row.id,job.family_id,row.version,row.data).run();
  return !!changed.meta?.changes;
}

/** One item per dedicated one-minute cron tick. Lease avoids overlapping generation, and replay skips
 * lessons already saved by an earlier tick or interactive work. */
export async function processQuestOvernight(env: Env, now = new Date(),
  generate: typeof generateQuestCompanionLesson = generateQuestCompanionLesson,
  repair: typeof repairQuestCompanionLessonPass = repairQuestCompanionLessonPass) {
  if(!env.DB || !env.BUCKET)return {processed:0,unavailable:true};
  await ensureOvernightTables(env.DB);
  // Book and repair discovery is independent of AI availability; a disabled AI
  // allowance must not prevent newly uploaded books entering their saved queue.
  try { await syncOvernightWork(env,now); }
  catch(e) { console.error("Quest Book live queue discovery failed",e); }
  const time=now.toISOString(),lease=new Date(now.getTime()+LEASE_MS).toISOString();
  // A terminated start request must not lock this family out forever.
  await env.DB.prepare(`UPDATE quest_overnight_jobs SET status='cancelled',
    last_error='Queue preparation was interrupted. Start a new queue.',updated_at=?
    WHERE status='building' AND updated_at<?`)
    .bind(time,new Date(now.getTime()-LEASE_MS).toISOString()).run();
  await env.DB.prepare(`UPDATE quest_overnight_items SET status='failed',
    last_error='Interrupted repeatedly. Use Retry failed from Owner HQ.',
    lease_until=NULL,updated_at=? WHERE status='running' AND attempts>=? AND lease_until<?`)
    .bind(time,RETRIES,time).run();
  const finalizeIdleJobs=async()=> {
    await env.DB.prepare(`UPDATE quest_overnight_jobs
      SET status=CASE WHEN EXISTS(SELECT 1 FROM quest_overnight_items i
         WHERE i.job_id=quest_overnight_jobs.id AND i.status='failed')
        THEN 'completed_with_errors' ELSE 'completed' END,
        finished_at=?,updated_at=? WHERE status='running' AND auto_follow=0 AND NOT EXISTS(
        SELECT 1 FROM quest_overnight_items i WHERE i.job_id=quest_overnight_jobs.id
        AND i.status IN ('pending','running'))`)
      .bind(time,time).run();
  };
  // Finalise already-completed work even if the AI allowance is unavailable.
  // No pending lesson is claimed or altered by this bookkeeping.
  await finalizeIdleJobs();
  // A temporarily exhausted AI allowance must not consume attempts or manually
  // pause the job. Keep the saved work intact and retry on the next cron tick.
  const aiWaitMessage="Waiting for Workers AI access or daily allowance; retrying automatically.";
  if(!env.AI) {
    await env.DB.prepare(`UPDATE quest_overnight_jobs SET last_error=?
      WHERE status='running' AND (last_error IS NULL OR last_error!=?)`)
      .bind(aiWaitMessage,aiWaitMessage).run();
    return {processed:0,waiting_for_ai:true};
  }
  await env.DB.prepare(`UPDATE quest_overnight_jobs SET last_error=NULL
    WHERE status='running' AND last_error=?`).bind(aiWaitMessage).run();
  const item=await env.DB.prepare(`UPDATE quest_overnight_items SET status='running',
    attempts=attempts+1,lease_until=?,updated_at=?
    WHERE id=(SELECT i.id FROM quest_overnight_items i
      JOIN quest_overnight_jobs j ON j.id=i.job_id WHERE j.status='running'
      AND i.attempts<? AND (i.status='pending' OR (i.status='running' AND i.lease_until<?))
      ORDER BY j.updated_at,j.created_at,i.position LIMIT 1) RETURNING *`)
    .bind(lease,time,RETRIES,time).first<Item>();
  if(item){
    const job=await env.DB.prepare(`SELECT * FROM quest_overnight_jobs WHERE id=?`)
      .bind(item.job_id).first<Job>();
    const mark=async(status:string,error:string|null,lesson:string|null)=>{
      await env.DB.prepare(`UPDATE quest_overnight_items SET status=?,last_error=?,lesson_id=COALESCE(?,lesson_id),
        lease_until=NULL,updated_at=? WHERE id=? AND status='running' AND lease_until=?`)
        .bind(status,error,lesson,time,item.id,lease).run();
      await env.DB.prepare(`UPDATE quest_overnight_jobs SET updated_at=? WHERE id=?`).bind(time,item.job_id).run();
    };
    try{
      if(!job || !(await isPlatformOwner(env.DB,job.owner_user_id))) {
        await mark("failed","Owner access no longer valid.",null);
        if(job)await env.DB.prepare(`UPDATE quest_overnight_jobs SET status='paused',
          last_error='Owner access changed',updated_at=? WHERE id=?`).bind(time,job.id).run();
      } else {
        const chapters=await readChapters(env.BUCKET!,item.book_id);
        const current=chapters.find((ch)=>ch.id===item.chapter_id);
        if(!current || chapterRevision(current)!==item.revision) {
          await mark("failed","Chapter source changed; check the book plan.",null);
        } else if(job.kind==="repair") {
          const row=item.lesson_id?await env.DB.prepare(`SELECT id,status,version,data
            FROM lessons WHERE id=? AND family_id=? AND archived_at IS NULL`)
            .bind(item.lesson_id,job.family_id).first<any>():null;
          if(!row)await mark("skipped","Lesson no longer exists. Nothing changed.",null);
          else if(row.status!=="draft")await mark("skipped","Lesson is no longer a draft; approval was preserved.",null);
          else {
            const saved=JSON.parse(row.data||"{}");
            if(saved.quest_book_id!==item.book_id || saved.quest_chapter_id!==item.chapter_id ||
              saved.quest_source_revision!==item.revision) {
              await mark("failed","Book source or lesson link changed. Inspect this lesson.",null);
            } else {
              const result=await repair(env,{id:job.owner_user_id,family_id:job.family_id},
                item.book_id,item.chapter_id,row.id,Number(row.version));
              if(result.ok && !result.remaining_count)
                await mark(result.changed?"done":"skipped",null,row.id);
              else if(result.ok && item.attempts<RETRIES)
                await mark("pending",`Still checking ${result.remaining_count} issue(s)`,row.id);
              else if(result.ok)
                await mark("failed",`Remaining issues: ${(result.remaining||[]).join("; ").slice(0,310)}`,row.id);
              else if(item.attempts>=RETRIES || (result.status && result.status<500 && result.status!==429))
                await mark("failed",String(result.detail||"AI repair failed").slice(0,360),row.id);
              else await mark("pending",String(result.detail||"Temporary repair problem").slice(0,360),row.id);
            }
          }
        } else {
          const result=await generate(env,{id:job.owner_user_id,family_id:job.family_id},
            item.book_id,item.chapter_id,true);
          if(result.ok) {
            // The owner explicitly opted into fast approval of clean, NEW lessons.
            // Existing working lessons (skipped) are never auto-approved.
            let note:string|null=null;
            if(job.auto_approve===1 && !result.skipped) {
              const approved=await approveNewAiCleared(env,job,item,String(result.lesson.id),time);
              if(!approved)note="Generated as Draft: needs review or AI repair before approval.";
            }
            await mark(result.skipped?"skipped":"done",note,
              result.skipped?result.lesson_id:String(result.lesson.id));
          }
          else if(item.attempts>=RETRIES || (result.status && result.status<500 && result.status!==429))
            await mark("failed",String(result.detail||"Generation failed").slice(0,360),null);
          else await mark("pending",String(result.detail||"Temporary AI issue").slice(0,360),null);
        }
      }
    }catch(e:any){
      await mark(item.attempts>=RETRIES?"failed":"pending",
        String(e?.message||"Generation interrupted").slice(0,360),null);
    }
  }
  await finalizeIdleJobs();
  return {processed:item?1:0};
}
