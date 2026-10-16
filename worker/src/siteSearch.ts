/**
 * Search within one family. No external search service, no data copied to a third-party index.
 * Parents can search family resources; children can search ONLY their own assignments and reading.
 * Searches are literal case-insensitive substrings (not SQL wildcard patterns), parameter-bound.
 */
import type { App, Guards } from "./types";

type Row = { id: string; title: string | null; description: string | null };
type Item = { id: string; type: string; title: string; description: string; url: string };
const MAX_PER_TYPE = 12;
const MAX_QUERY = 80;
const parentTypes = ["children", "lessons", "assignments", "reading", "plans", "life_learning", "evidence", "calendar", "resources"] as const;
const childTypes = ["assignments", "reading"] as const;

const querySpecs: Record<string, {
  sql: string; url: (id: string) => string; limit?: number;
}> = {
  children: {
    sql: "SELECT id,name AS title, 'Child profile · ' || COALESCE(stage, '') || CASE WHEN year_level IS NULL THEN '' ELSE ' · Year ' || year_level END AS description FROM students WHERE family_id = ? AND instr(lower(name), ?) > 0 ORDER BY name COLLATE NOCASE LIMIT ?",
    url: id => "/parent/children/" + encodeURIComponent(id),
  },
  lessons: {
    sql: "SELECT id,title, COALESCE(learning_area, 'Lesson') || CASE WHEN archived_at IS NULL THEN '' ELSE ' · Archived' END AS description FROM lessons WHERE family_id = ? AND (instr(lower(title), ?) > 0 OR instr(lower(coalesce(learning_area,'')), ?) > 0) ORDER BY created_at DESC LIMIT ?",
    url: id => "/parent/lessons/" + encodeURIComponent(id),
  },
  assignments: {
    sql: "SELECT a.id,COALESCE(json_extract(a.lesson_snapshot,'$.title'),l.title,'Assigned lesson') AS title, 'For ' || s.name || ' · ' || replace(a.status,'_',' ') AS description FROM assignments a JOIN students s ON s.id = a.student_id AND s.family_id=a.family_id LEFT JOIN lessons l ON l.id=a.lesson_id AND (l.family_id=a.family_id OR l.family_id IS NULL) WHERE a.family_id = ? AND (instr(lower(COALESCE(json_extract(a.lesson_snapshot,'$.title'),l.title,'')), ?) > 0 OR instr(lower(s.name), ?) > 0) ORDER BY a.created_at DESC LIMIT ?",
    url: id => "/parent/assignments?focus=" + encodeURIComponent(id),
  },
  reading: {
    sql: "SELECT r.id,r.title,COALESCE(r.author,'Reading log') || ' · ' || s.name AS description FROM reading_log r JOIN students s ON s.id=r.student_id AND s.family_id=r.family_id WHERE r.family_id = ? AND (instr(lower(r.title), ?) > 0 OR instr(lower(coalesce(r.author,'')), ?) > 0) ORDER BY r.read_date DESC LIMIT ?",
    url: id => "/parent/reading-log?focus=" + encodeURIComponent(id),
  },
  plans: {
    sql: "SELECT p.id,p.title,s.name || ' · ' || p.period_start || ' to ' || p.period_end AS description FROM learning_plans p JOIN students s ON s.id=p.student_id AND s.family_id=p.family_id WHERE p.family_id = ? AND instr(lower(p.title), ?) > 0 ORDER BY p.created_at DESC LIMIT ?",
    url: () => "/parent/learning-plans",
  },
  life_learning: {
    sql: "SELECT e.id,e.title,s.name || ' · ' || e.date AS description FROM life_evidence e JOIN students s ON s.id=e.student_id AND s.family_id=e.family_id WHERE e.family_id = ? AND (instr(lower(e.title), ?) > 0 OR instr(lower(e.description), ?) > 0) ORDER BY e.date DESC LIMIT ?",
    url: id => "/parent/life-learning?focus=" + encodeURIComponent(id),
  },
  evidence: {
    sql: "SELECT e.id,e.title,s.name || ' · ' || e.occurred_on AS description FROM evidence_notes e JOIN students s ON s.id=e.student_id AND s.family_id=e.family_id WHERE e.family_id = ? AND (instr(lower(e.title), ?) > 0 OR instr(lower(coalesce(e.learning_area,'')), ?) > 0) ORDER BY e.occurred_on DESC LIMIT ?",
    url: () => "/parent/evidence",
  },
  calendar: {
    sql: "SELECT id,title,date || ' · ' || replace(event_type,'_',' ') AS description FROM calendar_events WHERE family_id = ? AND (instr(lower(title), ?) > 0 OR instr(lower(coalesce(notes,'')), ?) > 0) ORDER BY date DESC LIMIT ?",
    url: id => "/parent/calendar?event=" + encodeURIComponent(id),
  },
  resources: {
    sql: "SELECT id,title,COALESCE(provider,learning_area,'Saved resource') AS description FROM resources WHERE family_id = ? AND (instr(lower(title), ?) > 0 OR instr(lower(coalesce(provider,'')), ?) > 0) ORDER BY created_at DESC LIMIT ?",
    url: () => "/parent/resources",
  },
};
const conditions: Record<string,number> = {
  children: 1, lessons: 2, assignments: 2, reading: 2,
  plans: 1, life_learning: 2, evidence: 2, calendar: 2, resources: 2,
};
async function runFamilySearch(db: D1Database, familyId: string, term: string, type: string): Promise<Item[]> {
  const spec = querySpecs[type];
  const binds: unknown[] = [familyId, ...Array(conditions[type]).fill(term), MAX_PER_TYPE];
  const { results } = await db.prepare(spec.sql).bind(...binds).all<Row>();
  return (results ?? []).map(r => ({
    id: r.id, type, title: String(r.title || "Untitled"), description: String(r.description || "").slice(0, 160),
    url: spec.url(r.id),
  }));
}

async function childAssignments(db: D1Database, familyId: string, studentId: string, term: string): Promise<Item[]> {
  const sql = "SELECT a.id,COALESCE(json_extract(a.lesson_snapshot,'$.title'),l.title,'Assigned lesson') AS title, 'My lesson · ' || replace(a.status,'_',' ') AS description FROM assignments a LEFT JOIN lessons l ON l.id=a.lesson_id AND (l.family_id=a.family_id OR l.family_id IS NULL) WHERE a.status != 'revoked' AND a.family_id=? AND a.student_id=? AND instr(lower(COALESCE(json_extract(a.lesson_snapshot,'$.title'),l.title,'')),?)>0 ORDER BY a.created_at DESC LIMIT ?";
  const { results } = await db.prepare(sql).bind(familyId, studentId, term, MAX_PER_TYPE).all<Row>();
  return (results ?? []).map(r => ({ id:r.id, type:"assignments", title:String(r.title || "Assigned lesson"), description:String(r.description || ""), url:"/child/lesson/"+encodeURIComponent(r.id) }));
}
async function childReading(db: D1Database, familyId: string, studentId: string, term: string): Promise<Item[]> {
  const sql = "SELECT id,title,COALESCE(author,'Reading log') AS description FROM reading_log WHERE family_id=? AND student_id=? AND (instr(lower(title),?)>0 OR instr(lower(coalesce(author,'')),?)>0) ORDER BY read_date DESC LIMIT ?";
  const { results } = await db.prepare(sql).bind(familyId, studentId, term, term, MAX_PER_TYPE).all<Row>();
  return (results ?? []).map(r => ({ id:r.id, type:"reading", title:String(r.title || "Reading"), description:String(r.description || ""), url:"/child/reading" }));
}

export function registerSiteSearch(app: App, guards: Guards) {
  app.get("/api/site-search", guards.auth, async c => {
    c.header("Cache-Control","private, no-store");
    const raw = c.req.query("q") || "";
    const term = raw.trim().toLocaleLowerCase("en-AU");
    if (term.length < 2 || term.length > MAX_QUERY) return c.json({ detail:"Search for 2 to 80 characters." }, 400);
    const user = c.get("user");
    const allowed = user.role === "parent" ? parentTypes : childTypes;
    const selected = c.req.query("type") || "all";
    if (selected !== "all" && !(allowed as readonly string[]).includes(selected))
      return c.json({ detail:"Invalid search category." }, 400);
    const types = selected === "all" ? [...allowed] : [selected];
    const found = await Promise.all(types.map(type => user.role === "parent"
      ? runFamilySearch(c.env.DB, user.family_id, term, type)
      : type === "assignments"
        ? childAssignments(c.env.DB,user.family_id,user.id,term)
        : childReading(c.env.DB,user.family_id,user.id,term)));
    const items = found.flat();
    return c.json({ q:raw.trim(), items, total:items.length, capped_per_type:MAX_PER_TYPE });
  });
}
