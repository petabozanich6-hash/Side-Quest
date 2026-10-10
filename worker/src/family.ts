import { sign, verify } from "hono/jwt";

import { hashSecret } from "./auth";
import {
  NSW_LA_LINKS,
  NSW_LEARNING_AREAS,
  NSW_OUTCOMES,
  NSW_SECONDARY_PATTERN,
  NSW_SOURCE_LINKS,
  NSW_STAGES,
} from "./data/curriculum";
import type { App, AuthUser, Env, Guards } from "./types";
import { nowIso, newId, parseJson } from "./types";

const TOKEN_DAYS = 30;
const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;
const FILE_PREFIX = "sidequest";
const SAFE_FILE_TYPES = [
  "application/pdf",
] as const;
const LEVEL_TIERS = [
  [0, "Egg", "egg"],
  [10, "Hatchling", "sprout"],
  [30, "Youngling", "leaf"],
  [80, "Companion", "tree"],
  [200, "Hero", "star"],
  [500, "Legend", "sparkle"],
] as const;
const EDITABLE_EVENT_FIELDS = new Set([
  "title",
  "date",
  "start_time",
  "duration_minutes",
  "event_type",
  "notes",
  "student_id",
  "status",
  "linked_lesson_id",
  "linked_assignment_id",
]);
export const STUDENT_SELECT =
  "id, family_id, name, username, birth_year, stage, year_level, theme, interests, notes, created_at, extra";

type StudentExtra = {
  subject_levels?: Record<string, string>;
  electives?: Array<Record<string, unknown>>;
  stage_name?: string;
  band?: string;
};

type StudentRow = {
  id: string;
  family_id: string;
  name: string;
  username: string;
  birth_year: number | null;
  stage: string;
  year_level: string | null;
  theme: string | null;
  interests: string | null;
  notes: string | null;
  created_at: string;
  extra: string | null;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

const errorMessage = (error: unknown) => (error instanceof Error ? error.message : String(error));
const isMissingTableError = (error: unknown) => /no such table/i.test(errorMessage(error));

const stageMeta = (stage?: string) => NSW_STAGES.find((item) => item.code === stage);
const guessTheme = (stage?: string) =>
  stage === "ES1"
    ? "early"
    : ["S1", "S2", "S3"].includes(stage || "")
      ? "primary"
      : ["S4", "S5"].includes(stage || "")
        ? "secondary"
        : "senior";

const makeToken = (env: Env, sub: string, role: "parent" | "child", familyId: string) =>
  sign({ sub, role, family_id: familyId, exp: Math.floor(Date.now() / 1000) + TOKEN_DAYS * 86400 }, env.JWT_SECRET);

function levelForXp(xp: number) {
  let tier: (typeof LEVEL_TIERS)[number] = LEVEL_TIERS[0];
  for (const item of LEVEL_TIERS) if (xp >= item[0]) tier = item;
  const next = LEVEL_TIERS.find((item) => item[0] > xp);
  return {
    xp,
    level_name: tier[1],
    level_icon: tier[2],
    next_xp: next?.[0] ?? null,
    next_level: next?.[1] ?? null,
  };
}

export function studentExtraFromBody(body: Record<string, unknown>, stage: string, existing?: StudentExtra): StudentExtra {
  const meta = stageMeta(stage);
  const next: StudentExtra = { ...existing };
  if ("subject_levels" in body) next.subject_levels = isRecord(body.subject_levels) ? (body.subject_levels as Record<string, string>) : {};
  if ("electives" in body) next.electives = Array.isArray(body.electives) ? (body.electives as Array<Record<string, unknown>>) : [];
  next.subject_levels ??= existing?.subject_levels ?? {};
  next.electives ??= existing?.electives ?? [];
  next.stage_name = meta?.name ?? existing?.stage_name ?? stage;
  next.band = meta?.band ?? existing?.band ?? "primary";
  return next;
}

export function studentOut(row: StudentRow | null) {
  if (!row) return null;
  const extra = parseJson<StudentExtra>(row.extra, {});
  const meta = stageMeta(row.stage);
  return {
    id: row.id,
    family_id: row.family_id,
    name: row.name,
    username: row.username,
    birth_year: row.birth_year,
    stage: row.stage,
    stage_name: extra.stage_name ?? meta?.name ?? row.stage,
    year_level: row.year_level,
    band: extra.band ?? meta?.band ?? "primary",
    theme: row.theme,
    subject_levels: extra.subject_levels ?? {},
    interests: parseJson(row.interests, [] as string[]),
    notes: row.notes,
    electives: extra.electives ?? [],
    created_at: row.created_at,
  };
}

function lessonOut(row: Record<string, unknown> | null) {
  if (!row) return null;
  const data = parseJson<Record<string, unknown>>(typeof row.data === "string" ? row.data : null, {});
  const { data: _data, ...rest } = row;
  return { ...data, ...rest };
}

function lessonSummary(row: Record<string, unknown> | null) {
  const lesson = lessonOut(row);
  if (!lesson) return null;
  delete lesson.explicit_teaching;
  delete lesson.worked_example;
  return lesson;
}

function fileOut(row: Record<string, unknown> | null) {
  if (!row) return null;
  return { ...row, is_deleted: !!row.is_deleted };
}

function programOut(row: Record<string, unknown> | null) {
  if (!row) return null;
  return { ...row, learning_areas: parseJson(row.learning_areas as string | null, [] as string[]) };
}

function unitOut(row: Record<string, unknown> | null) {
  if (!row) return null;
  return {
    ...row,
    subjects: parseJson(row.subjects as string | null, [] as string[]),
    outcomes: parseJson(row.outcomes as string | null, [] as string[]),
  };
}

async function safeFirst<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (isMissingTableError(error)) return fallback;
    throw error;
  }
}

async function safeAll<T>(fn: () => Promise<{ results?: T[] }>, fallback: T[] = []): Promise<T[]> {
  try {
    return (await fn()).results ?? fallback;
  } catch (error) {
    if (isMissingTableError(error)) return fallback;
    throw error;
  }
}

async function getAuthUserFromToken(env: Env, token: string): Promise<AuthUser | null> {
  let payload: any;
  try {
    payload = await verify(token, env.JWT_SECRET, "HS256");
  } catch {
    return null;
  }
  if (!payload?.sub || (payload.role !== "parent" && payload.role !== "child")) return null;
  const table = payload.role === "parent" ? "users" : "students";
  const row = await env.DB.prepare(`SELECT id, family_id, name FROM ${table} WHERE id = ?`).bind(payload.sub).first<AuthUser>();
  return row ? { ...row, role: payload.role } : null;
}

async function fetchGoogleTokenInfo(idToken: string) {
  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
  if (!response.ok) return null;
  return (await response.json()) as Record<string, string>;
}

async function upsertGoogleUser(env: Env, email: string, name: string, picture?: string | null) {
  const existing = await env.DB.prepare("SELECT id, family_id, email, name, picture, is_owner, created_at FROM users WHERE email = ?")
    .bind(email)
    .first<Record<string, unknown>>();
  if (existing) {
    await env.DB.prepare("UPDATE users SET name = ?, picture = ?, oauth_provider = 'google' WHERE id = ?")
      .bind(name, picture ?? null, existing.id)
      .run();
    const user = { ...existing, name, picture: picture ?? null, oauth_provider: "google", role: "parent" };
    return { token: await makeToken(env, String(existing.id), "parent", String(existing.family_id)), user };
  }

  const familyId = newId();
  const userId = newId();
  const ts = nowIso();
  await env.DB.batch([
    env.DB.prepare("INSERT INTO families (id, name, owner_id, created_at) VALUES (?, ?, ?, ?)")
      .bind(familyId, `${name}'s Family`, userId, ts),
    env.DB.prepare(
      "INSERT INTO users (id, family_id, email, password_hash, name, picture, oauth_provider, is_owner, created_at) VALUES (?, ?, ?, NULL, ?, ?, 'google', 1, ?)"
    ).bind(userId, familyId, email, name, picture ?? null, ts),
  ]);
  return {
    token: await makeToken(env, userId, "parent", familyId),
    user: { id: userId, family_id: familyId, email, name, picture: picture ?? null, oauth_provider: "google", is_owner: 1, created_at: ts, role: "parent" },
  };
}

export function registerFamily(app: App, g: Guards) {
  app.post("/api/auth/logout", (c) => c.json({ ok: true }));

  app.post("/api/auth/google", async (c) => {
    const clientId = c.env.GOOGLE_OAUTH_CLIENT_ID?.trim();
    if (!clientId) return c.json({ detail: "Google sign-in is not configured" }, 500);
    const body = await c.req.json().catch(() => ({}));
    const credential = String(body.credential || "");
    if (!credential) return c.json({ detail: "Invalid Google sign-in credential" }, 401);

    const googleUser = await fetchGoogleTokenInfo(credential);
    if (!googleUser) return c.json({ detail: "Invalid Google sign-in credential" }, 401);
    if (googleUser.aud !== clientId) return c.json({ detail: "Google token audience mismatch" }, 401);
    if (String(googleUser.email_verified).toLowerCase() !== "true") return c.json({ detail: "Google email is not verified" }, 401);
    const email = String(googleUser.email || "").trim().toLowerCase();
    if (!email) return c.json({ detail: "Google account email missing" }, 401);

    const name = String(googleUser.name || email.split("@")[0]).trim();
    return c.json(await upsertGoogleUser(c.env, email, name, googleUser.picture || null));
  });

  app.post("/api/auth/google/callback", async (c) => {
    const clientId = c.env.GOOGLE_OAUTH_CLIENT_ID?.trim();
    const clientSecret = c.env.GOOGLE_OAUTH_CLIENT_SECRET?.trim();
    if (!clientId || !clientSecret) return c.json({ detail: "Google sign-in is not configured" }, 500);

    const body = await c.req.json().catch(() => ({}));
    const code = String(body.code || "");
    const redirectUri = String(body.redirect_uri || "");
    const origin = new URL(c.req.url).origin;
    if (!code || !redirectUri) return c.json({ detail: "Could not verify Google sign-in" }, 401);
    try {
      if (new URL(redirectUri).origin !== origin) return c.json({ detail: "Invalid Google redirect URI" }, 400);
    } catch {
      return c.json({ detail: "Invalid Google redirect URI" }, 400);
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    }).catch(() => null);
    if (!tokenResponse?.ok) return c.json({ detail: "Could not verify Google sign-in" }, 401);

    const tokens = (await tokenResponse.json()) as Record<string, string>;
    const googleUser = tokens.id_token ? await fetchGoogleTokenInfo(tokens.id_token) : null;
    if (!googleUser) return c.json({ detail: "Could not verify Google sign-in" }, 401);
    if (googleUser.aud !== clientId) return c.json({ detail: "Google token audience mismatch" }, 401);
    if (String(googleUser.email_verified).toLowerCase() !== "true") return c.json({ detail: "Google email is not verified" }, 401);

    const email = String(googleUser.email || "").trim().toLowerCase();
    if (!email) return c.json({ detail: "Google account email missing" }, 401);
    const name = String(googleUser.name || email.split("@")[0]).trim();
    return c.json(await upsertGoogleUser(c.env, email, name, googleUser.picture || null));
  });

  app.post("/api/auth/session", (c) =>
    c.json({ detail: "Emergent session sign-in is no longer supported. Use email/password or Google." }, 410)
  );

  app.get("/api/curriculum/stages", (c) =>
    c.json(NSW_STAGES.map((stage) => ({ ...stage, source_link: NSW_SOURCE_LINKS[stage.code] })))
  );

  app.get("/api/curriculum/learning-areas", (c) => {
    const band = (c.req.query("band") || "primary") as keyof typeof NSW_LEARNING_AREAS;
    const areas = NSW_LEARNING_AREAS[band] || NSW_LEARNING_AREAS.primary;
    return c.json(areas.map((name) => ({ name, source_link: NSW_LA_LINKS[name as keyof typeof NSW_LA_LINKS] ?? null })));
  });

  app.get("/api/curriculum/pattern/:stage", (c) =>
    c.json(NSW_SECONDARY_PATTERN[c.req.param("stage") as keyof typeof NSW_SECONDARY_PATTERN] ?? { compulsory: [], electives: [] })
  );

  app.get("/api/curriculum/outcomes", (c) => {
    const stage = c.req.query("stage");
    const learningArea = c.req.query("learning_area");
    return c.json(
      NSW_OUTCOMES.filter((item) => (!stage || item.stage === stage) && (!learningArea || item.learning_area === learningArea))
    );
  });

  app.get("/api/calendar/ics", g.auth, g.parent, async (c) => {
    let sql = "SELECT * FROM calendar_events WHERE family_id = ?";
    const binds: Array<string> = [c.get("user").family_id];
    const studentId = c.req.query("student_id");
    if (studentId) {
      sql += " AND student_id = ?";
      binds.push(studentId);
    }
    sql += " ORDER BY date ASC LIMIT 2000";
    const { results } = await c.env.DB.prepare(sql).bind(...binds).all<Record<string, unknown>>();
    const escape = (value: string) => value.replaceAll("\\", "\\\\").replaceAll(",", "\\,").replaceAll(";", "\\;").replaceAll("\n", "\\n");
    const fmtDate = (date: string, time?: string | null) => {
      const d = date.replaceAll("-", "");
      if (!time) return d;
      return `${d}T${time.replaceAll(":", "").padEnd(6, "0").slice(0, 6)}`;
    };
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Side Quest Learning//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:Side Quest Learning",
    ];
    const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
    for (const event of results ?? []) {
      const title = escape(String(event.title || "Lesson"));
      const notes = escape(String(event.notes || ""));
      const durationMinutes = Number(event.duration_minutes || 45);
      const startTime = event.start_time ? String(event.start_time) : null;
      const start = fmtDate(String(event.date || ""), startTime);
      const dtLines = startTime
        ? (() => {
            const startAt = new Date(`${String(event.date)}T${startTime}`);
            const endAt = Number.isNaN(startAt.getTime()) ? null : new Date(startAt.getTime() + durationMinutes * 60000);
            return [`DTSTART:${start}`, `DTEND:${endAt ? fmtDate(endAt.toISOString().slice(0, 10), endAt.toISOString().slice(11, 19)) : start}`];
          })()
        : (() => {
            const nextDay = new Date(`${String(event.date)}T00:00:00Z`);
            nextDay.setUTCDate(nextDay.getUTCDate() + 1);
            return [`DTSTART;VALUE=DATE:${start}`, `DTEND;VALUE=DATE:${nextDay.toISOString().slice(0, 10).replaceAll("-", "")}`];
          })();
      lines.push(
        "BEGIN:VEVENT",
        `UID:${String(event.id)}@sidequest`,
        `DTSTAMP:${stamp}`,
        ...dtLines,
        `SUMMARY:${title}`,
        notes ? `DESCRIPTION:${notes}` : "DESCRIPTION:Side Quest Learning event",
        "END:VEVENT"
      );
    }
    lines.push("END:VCALENDAR");
    return new Response(`${lines.join("\r\n")}\r\n`, {
      headers: {
        "content-type": "text/calendar; charset=utf-8",
        "content-disposition": 'attachment; filename="side-quest-learning.ics"',
      },
    });
  });

  app.get("/api/students/:sid/overview", g.auth, g.parent, async (c) => {
    const sid = c.req.param("sid");
    const student = studentOut(
      await c.env.DB.prepare(`SELECT ${STUDENT_SELECT} FROM students WHERE id = ? AND family_id = ?`)
        .bind(sid, c.get("user").family_id)
        .first<StudentRow>()
    );
    if (!student) return c.json({ detail: "Not found" }, 404);

    const pet = await safeFirst(
      () => c.env.DB.prepare("SELECT * FROM pets WHERE student_id = ?").bind(sid).first<Record<string, unknown> | null>(),
      null
    );
    const assignments = (await c.env.DB.prepare(
      "SELECT * FROM assignments WHERE student_id = ? AND family_id = ? ORDER BY created_at DESC LIMIT 100"
    ).bind(sid, c.get("user").family_id).all<Record<string, unknown>>()).results ?? [];
    for (const assignment of assignments) {
      assignment.lesson = lessonSummary(await c.env.DB.prepare("SELECT * FROM lessons WHERE id = ?").bind(assignment.lesson_id).first());
    }
    const submissions = (await c.env.DB.prepare(
      "SELECT * FROM submissions WHERE student_id = ? AND family_id = ? ORDER BY submitted_at DESC LIMIT 50"
    ).bind(sid, c.get("user").family_id).all<Record<string, unknown>>()).results ?? [];
    for (const submission of submissions) {
      submission.file_ids = parseJson(submission.file_ids as string | null, []);
      submission.outcome_mappings = parseJson(submission.outcome_mappings as string | null, []);
      submission.needs_help = !!submission.needs_help;
      submission.lesson = submission.lesson_id
        ? lessonSummary(await c.env.DB.prepare("SELECT * FROM lessons WHERE id = ?").bind(submission.lesson_id).first())
        : null;
    }
    const cheers = (await c.env.DB.prepare(
      "SELECT * FROM cheers WHERE student_id = ? AND family_id = ? ORDER BY created_at DESC LIMIT 50"
    ).bind(sid, c.get("user").family_id).all<Record<string, unknown>>()).results ?? [];
    const readingCount = (
      await c.env.DB.prepare("SELECT COUNT(*) AS n FROM reading_log WHERE student_id = ? AND family_id = ?")
        .bind(sid, c.get("user").family_id)
        .first<{ n: number }>()
    )?.n ?? 0;
    const lifeEvidence = await safeAll(
      () =>
        c.env.DB.prepare("SELECT * FROM life_evidence WHERE student_id = ? AND family_id = ? ORDER BY created_at DESC LIMIT 50")
          .bind(sid, c.get("user").family_id)
          .all<Record<string, unknown>>(),
      []
    );
    return c.json({
      student,
      pet: pet ? { ...pet, ...levelForXp(Number(pet.xp || 0)) } : null,
      assignments,
      recent_submissions: submissions,
      cheers: cheers.map((row) => ({ ...row, seen: !!row.seen })),
      reading_count: readingCount,
      life_evidence: lifeEvidence.map((row) => ({
        ...row,
        accepted_mappings: parseJson(row.accepted_mappings as string | null, []),
      })),
    });
  });

  app.get("/api/students/:sid", g.auth, async (c) => {
    const student = studentOut(
      await c.env.DB.prepare(`SELECT ${STUDENT_SELECT} FROM students WHERE id = ? AND family_id = ?`)
        .bind(c.req.param("sid"), c.get("user").family_id)
        .first<StudentRow>()
    );
    return student ? c.json(student) : c.json({ detail: "Not found" }, 404);
  });

  app.put("/api/students/:sid", g.auth, g.parent, async (c) => {
    const sid = c.req.param("sid");
    const existing = await c.env.DB.prepare("SELECT * FROM students WHERE id = ? AND family_id = ?")
      .bind(sid, c.get("user").family_id)
      .first<Record<string, unknown> & { extra?: string | null }>();
    if (!existing) return c.json({ detail: "Not found" }, 404);

    const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
    if ("username" in body) {
      const username = String(body.username || "").trim().toLowerCase();
      if (!username) return c.json({ detail: "Username is required" }, 400);
      const taken = await c.env.DB.prepare("SELECT id FROM students WHERE username = ? AND id != ?").bind(username, sid).first();
      if (taken) return c.json({ detail: "Username already taken" }, 400);
    }

    const nextStage = String(body.stage || existing.stage || "");
    if (!stageMeta(nextStage)) return c.json({ detail: "Invalid stage" }, 400);
    const nextExtra = studentExtraFromBody(body, nextStage, parseJson(existing.extra || null, {} as StudentExtra));
    const updates: Record<string, unknown> = {
      extra: JSON.stringify(nextExtra),
      electives: JSON.stringify(nextExtra.electives ?? []),
      subject_levels: JSON.stringify(nextExtra.subject_levels ?? {}),
    };
    if ("name" in body) updates.name = String(body.name || "").trim();
    if ("username" in body) updates.username = String(body.username || "").trim().toLowerCase();
    if ("birth_year" in body) {
      if (body.birth_year === null || body.birth_year === "") updates.birth_year = null;
      else {
        const birthYear = Number(body.birth_year);
        if (!Number.isFinite(birthYear)) return c.json({ detail: "birth_year must be a number" }, 400);
        updates.birth_year = birthYear;
      }
    }
    if ("stage" in body) updates.stage = nextStage;
    if ("year_level" in body) updates.year_level = body.year_level === null || body.year_level === "" ? null : String(body.year_level);
    if ("theme" in body) updates.theme = body.theme === null || body.theme === "" ? null : String(body.theme);
    if ("interests" in body) updates.interests = JSON.stringify(Array.isArray(body.interests) ? body.interests : []);
    if ("notes" in body) updates.notes = body.notes === null || body.notes === "" ? null : String(body.notes);
    if ("pin" in body && String(body.pin || "")) updates.pin_hash = await hashSecret(String(body.pin));
    if ("stage" in body && !("theme" in body)) updates.theme = guessTheme(nextStage);
    if ("name" in updates && !String(updates.name || "").trim()) return c.json({ detail: "Name is required" }, 400);

    const entries = Object.entries(updates);
    await c.env.DB.prepare(
      `UPDATE students SET ${entries.map(([key]) => `${key} = ?`).join(", ")} WHERE id = ? AND family_id = ?`
    ).bind(...entries.map(([, value]) => value), sid, c.get("user").family_id).run();

    const student = studentOut(
      await c.env.DB.prepare(`SELECT ${STUDENT_SELECT} FROM students WHERE id = ? AND family_id = ?`)
        .bind(sid, c.get("user").family_id)
        .first<StudentRow>()
    );
    return c.json(student);
  });

  app.delete("/api/students/:sid", g.auth, g.parent, async (c) => {
    const sid = c.req.param("sid");
    const familyId = c.get("user").family_id;
    const existing = await c.env.DB.prepare("SELECT id FROM students WHERE id = ? AND family_id = ?").bind(sid, familyId).first();
    if (!existing) return c.json({ detail: "Not found" }, 404);

    const statements = [
      ["DELETE FROM word_practice WHERE student_id = ? AND family_id = ?", sid, familyId],
      ["DELETE FROM word_bank WHERE student_id = ? AND family_id = ?", sid, familyId],
      ["DELETE FROM reading_submissions WHERE student_id = ? AND family_id = ?", sid, familyId],
      ["DELETE FROM quiz_results WHERE child_id = ? AND family_id = ?", sid, familyId],
      ["DELETE FROM lesson_evidence WHERE child_id = ? AND family_id = ?", sid, familyId],
      ["DELETE FROM learning_plans WHERE student_id = ? AND family_id = ?", sid, familyId],
      ["DELETE FROM achievements WHERE student_id = ? AND family_id = ?", sid, familyId],
      ["DELETE FROM seasonal_prizes WHERE student_id = ? AND family_id = ?", sid, familyId],
      ["DELETE FROM pets WHERE student_id = ?", sid],
      ["DELETE FROM life_evidence WHERE student_id = ? AND family_id = ?", sid, familyId],
      ["DELETE FROM submissions WHERE student_id = ? AND family_id = ?", sid, familyId],
      ["DELETE FROM assignments WHERE student_id = ? AND family_id = ?", sid, familyId],
      ["DELETE FROM cheers WHERE student_id = ? AND family_id = ?", sid, familyId],
      ["DELETE FROM calendar_events WHERE student_id = ? AND family_id = ?", sid, familyId],
      ["DELETE FROM reading_log WHERE student_id = ? AND family_id = ?", sid, familyId],
      ["DELETE FROM units WHERE family_id = ? AND program_id IN (SELECT id FROM programs WHERE family_id = ? AND student_id = ?)", familyId, familyId, sid],
      ["DELETE FROM programs WHERE student_id = ? AND family_id = ?", sid, familyId],
      ["DELETE FROM students WHERE id = ? AND family_id = ?", sid, familyId],
    ] as const;
    for (const [sql, ...binds] of statements) {
      try {
        await c.env.DB.prepare(sql).bind(...binds).run();
      } catch (error) {
        if (!isMissingTableError(error)) throw error;
      }
    }
    return c.json({ ok: true });
  });

  app.get("/api/programs", g.auth, g.parent, async (c) => {
    let sql = "SELECT * FROM programs WHERE family_id = ?";
    const binds: Array<string> = [c.get("user").family_id];
    const studentId = c.req.query("student_id");
    if (studentId) {
      sql += " AND student_id = ?";
      binds.push(studentId);
    }
    sql += " ORDER BY created_at DESC LIMIT 200";
    const { results } = await c.env.DB.prepare(sql).bind(...binds).all<Record<string, unknown>>();
    return c.json((results ?? []).map(programOut));
  });

  app.post("/api/programs", g.auth, g.parent, async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
    const studentId = String(body.student_id || "");
    const title = String(body.title || "").trim();
    const stage = String(body.stage || "");
    if (!studentId || !title || !stage) return c.json({ detail: "student_id, title and stage are required" }, 400);
    const student = await c.env.DB.prepare("SELECT id FROM students WHERE id = ? AND family_id = ?").bind(studentId, c.get("user").family_id).first();
    if (!student) return c.json({ detail: "Student not found" }, 404);

    const id = newId();
    await c.env.DB.prepare(
      "INSERT INTO programs (id, family_id, student_id, title, framework, stage, year_level, learning_areas, start_date, end_date, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(
      id,
      c.get("user").family_id,
      studentId,
      title,
      String(body.framework || "NSW"),
      stage,
      body.year_level ? String(body.year_level) : null,
      JSON.stringify(Array.isArray(body.learning_areas) ? body.learning_areas : []),
      body.start_date ? String(body.start_date) : null,
      body.end_date ? String(body.end_date) : null,
      body.notes ? String(body.notes) : null,
      nowIso()
    ).run();
    return c.json(
      programOut(await c.env.DB.prepare("SELECT * FROM programs WHERE id = ? AND family_id = ?").bind(id, c.get("user").family_id).first())
    );
  });

  app.get("/api/programs/:pid", g.auth, g.parent, async (c) => {
    const program = programOut(
      await c.env.DB.prepare("SELECT * FROM programs WHERE id = ? AND family_id = ?")
        .bind(c.req.param("pid"), c.get("user").family_id)
        .first()
    );
    return program ? c.json(program) : c.json({ detail: "Not found" }, 404);
  });

  app.get("/api/units", g.auth, g.parent, async (c) => {
    let sql = "SELECT * FROM units WHERE family_id = ?";
    const binds: Array<string> = [c.get("user").family_id];
    const programId = c.req.query("program_id");
    if (programId) {
      sql += " AND program_id = ?";
      binds.push(programId);
    }
    sql += " ORDER BY created_at DESC LIMIT 200";
    const { results } = await c.env.DB.prepare(sql).bind(...binds).all<Record<string, unknown>>();
    return c.json((results ?? []).map(unitOut));
  });

  app.post("/api/units", g.auth, g.parent, async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
    const programId = String(body.program_id || "");
    const title = String(body.title || "").trim();
    if (!programId || !title) return c.json({ detail: "program_id and title are required" }, 400);
    const program = await c.env.DB.prepare("SELECT id FROM programs WHERE id = ? AND family_id = ?").bind(programId, c.get("user").family_id).first();
    if (!program) return c.json({ detail: "Program not found" }, 404);

    const id = newId();
    await c.env.DB.prepare(
      "INSERT INTO units (id, family_id, program_id, title, big_question, essential_understanding, subjects, duration_weeks, outcomes, description, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(
      id,
      c.get("user").family_id,
      programId,
      title,
      body.big_question ? String(body.big_question) : null,
      body.essential_understanding ? String(body.essential_understanding) : null,
      JSON.stringify(Array.isArray(body.subjects) ? body.subjects : []),
      Number(body.duration_weeks || 4),
      JSON.stringify(Array.isArray(body.outcomes) ? body.outcomes : []),
      body.description ? String(body.description) : null,
      nowIso()
    ).run();
    return c.json(unitOut(await c.env.DB.prepare("SELECT * FROM units WHERE id = ? AND family_id = ?").bind(id, c.get("user").family_id).first()));
  });

  app.post("/api/files/upload", g.auth, async (c) => {
    if (!c.env.BUCKET) return c.json({ detail: "File storage not configured" }, 501);
    const form = await c.req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return c.json({ detail: "No file uploaded" }, 400);
    if (file.size > MAX_UPLOAD_BYTES) return c.json({ detail: "File too large (max 50MB)" }, 413);
    const contentType = file.type || "application/octet-stream";
    const isSafeType =
      SAFE_FILE_TYPES.includes(contentType as (typeof SAFE_FILE_TYPES)[number])
      || (contentType.startsWith("image/") && contentType !== "image/svg+xml")
      || contentType.startsWith("audio/")
      || contentType.startsWith("video/");
    if (!isSafeType) return c.json({ detail: "Unsupported file type" }, 400);

    const fileId = newId();
    const filename = file.name || "upload.bin";
    const ext = filename.includes(".") ? filename.split(".").pop() || "bin" : "bin";
    const storagePath = `${FILE_PREFIX}/families/${c.get("user").family_id}/${fileId}.${ext.toLowerCase()}`;
    const bytes = await file.arrayBuffer();
    await c.env.BUCKET.put(storagePath, bytes, { httpMetadata: { contentType } });
    await c.env.DB.prepare(
      "INSERT INTO files (id, family_id, uploader_id, uploader_role, storage_path, original_filename, content_type, size, context, is_deleted, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)"
    ).bind(
      fileId,
      c.get("user").family_id,
      c.get("user").id,
      c.get("user").role,
      storagePath,
      filename,
      contentType,
      file.size,
      form.get("context") ? String(form.get("context")) : null,
      nowIso()
    ).run();
    return c.json(
      fileOut(await c.env.DB.prepare("SELECT * FROM files WHERE id = ? AND family_id = ?").bind(fileId, c.get("user").family_id).first())
    );
  });

  app.get("/api/files/:fid", async (c) => {
    const header = c.req.header("Authorization") || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : c.req.query("auth");
    if (!token) return c.json({ detail: "No auth" }, 401);

    const user = await getAuthUserFromToken(c.env, token);
    if (!user) return c.json({ detail: "Invalid token" }, 401);
    const record = await c.env.DB.prepare("SELECT * FROM files WHERE id = ? AND family_id = ? AND is_deleted = 0")
      .bind(c.req.param("fid"), user.family_id)
      .first<Record<string, unknown>>();
    if (!record) return c.json({ detail: "Not found" }, 404);
    if (!c.env.BUCKET) return c.json({ detail: "File storage not configured" }, 501);

    const object = await c.env.BUCKET.get(String(record.storage_path));
    if (!object?.body) return c.json({ detail: "Not found" }, 404);
    const contentType = String(record.content_type || object.httpMetadata?.contentType || "application/octet-stream");
    const disposition = contentType.startsWith("image/") ? "inline" : "attachment";
    return new Response(object.body, {
      headers: {
        "content-type": contentType,
        "content-length": String(record.size || object.size || ""),
        "content-disposition": `${disposition}; filename="${encodeURIComponent(String(record.original_filename || "download"))}"`,
        "x-content-type-options": "nosniff",
        "cache-control": "private, no-store",
        "content-security-policy": "sandbox",
      },
    });
  });

  app.put("/api/calendar/:eid", g.auth, g.parent, async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
    const updates = Object.fromEntries(Object.entries(body).filter(([key, value]) => EDITABLE_EVENT_FIELDS.has(key) && value !== undefined));
    if (!Object.keys(updates).length) return c.json({ detail: "Nothing to update" }, 400);
    if ("duration_minutes" in updates) updates.duration_minutes = updates.duration_minutes ? Number(updates.duration_minutes) : null;
    if ("student_id" in updates && !updates.student_id) updates.student_id = null;
    if ("linked_lesson_id" in updates && !updates.linked_lesson_id) updates.linked_lesson_id = null;
    if ("linked_assignment_id" in updates && !updates.linked_assignment_id) updates.linked_assignment_id = null;
    if (updates.student_id) {
      const student = await c.env.DB.prepare("SELECT id FROM students WHERE id = ? AND family_id = ?")
        .bind(updates.student_id, c.get("user").family_id)
        .first();
      if (!student) return c.json({ detail: "Student not found" }, 404);
    }
    if (updates.linked_lesson_id) {
      const lesson = await c.env.DB.prepare("SELECT id FROM lessons WHERE id = ? AND (family_id = ? OR family_id IS NULL)")
        .bind(updates.linked_lesson_id, c.get("user").family_id)
        .first();
      if (!lesson) return c.json({ detail: "Lesson not found" }, 404);
    }
    if (updates.linked_assignment_id) {
      const assignment = await c.env.DB.prepare("SELECT id FROM assignments WHERE id = ? AND family_id = ?")
        .bind(updates.linked_assignment_id, c.get("user").family_id)
        .first();
      if (!assignment) return c.json({ detail: "Assignment not found" }, 404);
    }

    const entries = Object.entries(updates);
    const result = await c.env.DB.prepare(
      `UPDATE calendar_events SET ${entries.map(([key]) => `${key} = ?`).join(", ")} WHERE id = ? AND family_id = ?`
    ).bind(...entries.map(([, value]) => value), c.req.param("eid"), c.get("user").family_id).run();
    if (!result.meta.changes) return c.json({ detail: "Event not found" }, 404);
    return c.json(await c.env.DB.prepare("SELECT * FROM calendar_events WHERE id = ? AND family_id = ?").bind(c.req.param("eid"), c.get("user").family_id).first());
  });

  app.get("/api/reading-log", g.auth, async (c) => {
    const user = c.get("user");
    let sql = "SELECT * FROM reading_log WHERE family_id = ?";
    const binds: Array<string> = [user.family_id];
    if (user.role === "child") {
      sql += " AND student_id = ?";
      binds.push(user.id);
    } else if (c.req.query("student_id")) {
      sql += " AND student_id = ?";
      binds.push(String(c.req.query("student_id")));
    }
    sql += " ORDER BY read_date DESC, created_at DESC LIMIT 1000";
    const { results } = await c.env.DB.prepare(sql).bind(...binds).all<Record<string, unknown>>();
    const entries = results ?? [];
    if (user.role === "parent") {
      const ids = [...new Set(entries.map((entry) => String(entry.student_id)).filter(Boolean))];
      const students = new Map<string, ReturnType<typeof studentOut>>();
      for (const id of ids) {
        students.set(
          id,
          studentOut(await c.env.DB.prepare(`SELECT ${STUDENT_SELECT} FROM students WHERE id = ? AND family_id = ?`).bind(id, user.family_id).first<StudentRow>())
        );
      }
      for (const entry of entries) entry.student = students.get(String(entry.student_id)) ?? null;
    }
    return c.json(entries);
  });

  app.get("/api/reading-log/stats", g.auth, g.parent, async (c) => {
    let sql = "SELECT * FROM reading_log WHERE family_id = ?";
    const binds: Array<string> = [c.get("user").family_id];
    if (c.req.query("student_id")) {
      sql += " AND student_id = ?";
      binds.push(String(c.req.query("student_id")));
    }
    sql += " LIMIT 5000";
    const { results } = await c.env.DB.prepare(sql).bind(...binds).all<Record<string, unknown>>();
    const entries = results ?? [];
    const titles = new Set<string>();
    let totalMinutes = 0;
    let totalPages = 0;
    const byType: Record<string, number> = {};
    const byMode: Record<string, number> = {};
    for (const entry of entries) {
      titles.add(`${String(entry.title || "").toLowerCase()}|${String(entry.author || "").toLowerCase()}`);
      totalMinutes += Number(entry.duration_minutes || 0);
      totalPages += Number(entry.pages_read || entry.pages || 0);
      const bookType = String(entry.book_type || "fiction");
      const readingMode = String(entry.reading_mode || "independent");
      byType[bookType] = (byType[bookType] || 0) + 1;
      byMode[readingMode] = (byMode[readingMode] || 0) + 1;
    }
    return c.json({
      entries: entries.length,
      unique_books: titles.size,
      total_minutes: totalMinutes,
      total_pages: totalPages,
      by_type: byType,
      by_mode: byMode,
    });
  });

  app.post("/api/reading-log", g.auth, async (c) => {
    const user = c.get("user");
    const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
    const studentId = String(body.student_id || "");
    const title = String(body.title || "").trim();
    const readDate = String(body.read_date || "");
    if (!studentId || !title || !readDate) return c.json({ detail: "student_id, title and read_date are required" }, 400);
    if (user.role === "child" && studentId !== user.id) return c.json({ detail: "Can't log for another student" }, 403);
    const student = await c.env.DB.prepare("SELECT id FROM students WHERE id = ? AND family_id = ?").bind(studentId, user.family_id).first();
    if (!student) return c.json({ detail: "Student not found" }, 404);

    const id = newId();
    await c.env.DB.prepare(
      "INSERT INTO reading_log (id, family_id, student_id, title, author, pages, pages_read, read_date, duration_minutes, source, book_type, reading_mode, comprehension_notes, favourite_part, difficulty, parent_note, logged_by, logged_role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(
      id,
      user.family_id,
      studentId,
      title,
      body.author ? String(body.author) : null,
      body.pages === null || body.pages === "" ? null : Number(body.pages),
      body.pages_read === null || body.pages_read === "" ? null : Number(body.pages_read),
      readDate,
      body.duration_minutes === null || body.duration_minutes === "" ? null : Number(body.duration_minutes),
      String(body.source || "home"),
      String(body.book_type || "fiction"),
      String(body.reading_mode || "independent"),
      body.comprehension_notes ? String(body.comprehension_notes) : null,
      body.favourite_part ? String(body.favourite_part) : null,
      body.difficulty ? String(body.difficulty) : null,
      body.parent_note ? String(body.parent_note) : null,
      user.id,
      user.role,
      nowIso()
    ).run();
    return c.json(await c.env.DB.prepare("SELECT * FROM reading_log WHERE id = ? AND family_id = ?").bind(id, user.family_id).first());
  });

  app.delete("/api/reading-log/:eid", g.auth, g.parent, async (c) => {
    await c.env.DB.prepare("DELETE FROM reading_log WHERE id = ? AND family_id = ?").bind(c.req.param("eid"), c.get("user").family_id).run();
    return c.json({ ok: true });
  });

  app.get("/api/audit", g.auth, g.parent, async (c) => {
    const familyId = c.get("user").family_id;
    const studentId = c.req.query("student_id");
    let assignmentsSql = "SELECT * FROM assignments WHERE family_id = ?";
    const assignmentBinds: Array<string> = [familyId];
    if (studentId) {
      assignmentsSql += " AND student_id = ?";
      assignmentBinds.push(studentId);
    }
    const assignments = (await c.env.DB.prepare(assignmentsSql).bind(...assignmentBinds).all<Record<string, unknown>>()).results ?? [];
    const lessons = (await c.env.DB.prepare("SELECT * FROM lessons WHERE family_id = ? OR family_id IS NULL LIMIT 2000").bind(familyId).all<Record<string, unknown>>()).results ?? [];
    const resources = (await c.env.DB.prepare("SELECT * FROM resources WHERE family_id = ? LIMIT 500").bind(familyId).all<Record<string, unknown>>()).results ?? [];
    const lifeEvidence = await safeAll(
      () =>
        c.env.DB.prepare(
          `SELECT * FROM life_evidence WHERE family_id = ?${studentId ? " AND student_id = ?" : ""} AND status IN ('accepted', 'demonstrated') LIMIT 500`
        ).bind(...(studentId ? [familyId, studentId] : [familyId])).all<Record<string, unknown>>(),
      []
    );

    const issues: Array<Record<string, unknown>> = [];
    for (const lessonRow of lessons) {
      if (lessonRow.family_id == null) continue;
      const lesson = lessonOut(lessonRow) ?? {};
      if (!Array.isArray(lesson.outcome_codes) || !lesson.outcome_codes.length) {
        issues.push({ type: "lesson_no_outcome", severity: "medium", lesson_id: lesson.id, title: lesson.title, message: "Lesson has no linked curriculum outcome" });
      }
      if (!lesson.evidence_requirement) {
        issues.push({ type: "lesson_no_evidence", severity: "medium", lesson_id: lesson.id, title: lesson.title, message: "Lesson has no evidence requirement" });
      }
      if (!lesson.offline_alternative) {
        issues.push({ type: "lesson_no_offline", severity: "low", lesson_id: lesson.id, title: lesson.title, message: "Lesson has no offline alternative" });
      }
    }
    for (const resource of resources) {
      if (!resource.approved) {
        issues.push({ type: "resource_unapproved", severity: "high", resource_id: resource.id, title: resource.title, message: "Resource not parent-approved" });
      }
      if (resource.licence === "unknown") {
        issues.push({ type: "resource_licence_unclear", severity: "medium", resource_id: resource.id, title: resource.title, message: "Licence unclear - treat as link-only" });
      }
    }

    const lessonById = new Map(lessons.map((lesson) => [String(lesson.id), lessonOut(lesson) ?? lesson]));
    const studentStage = new Map<string, string>();
    for (const assignment of assignments) {
      if (!studentStage.has(String(assignment.student_id))) {
        const row = await c.env.DB.prepare("SELECT stage FROM students WHERE id = ? AND family_id = ?").bind(assignment.student_id, familyId).first<{ stage: string }>();
        if (row?.stage) studentStage.set(String(assignment.student_id), row.stage);
      }
    }
    const coverage: Record<string, Record<string, unknown>> = {};
    for (const assignment of assignments) {
      const lesson = lessonById.get(String(assignment.lesson_id));
      if (!lesson) continue;
      const key = `${String(lesson.stage)}:${String(lesson.learning_area)}`;
      coverage[key] ||= { stage: lesson.stage, learning_area: lesson.learning_area, count: 0, demonstrated: 0 };
      coverage[key].count = Number(coverage[key].count || 0) + 1;
      if (assignment.status === "demonstrated") coverage[key].demonstrated = Number(coverage[key].demonstrated || 0) + 1;
    }
    for (const item of lifeEvidence) {
      const mappings = parseJson<Array<Record<string, unknown>>>(item.accepted_mappings as string | null, []);
      const stage = studentStage.get(String(item.student_id))
        ?? (await c.env.DB.prepare("SELECT stage FROM students WHERE id = ? AND family_id = ?").bind(item.student_id, familyId).first<{ stage: string }>())?.stage
        ?? "S2";
      for (const mapping of mappings) {
        if (!isRecord(mapping) || !mapping.learning_area) continue;
        const key = `${stage}:${String(mapping.learning_area)}`;
        coverage[key] ||= { stage, learning_area: mapping.learning_area, count: 0, demonstrated: 0, life_learning: 0 };
        coverage[key].life_learning = Number(coverage[key].life_learning || 0) + 1;
        if (item.status === "demonstrated") coverage[key].demonstrated = Number(coverage[key].demonstrated || 0) + 1;
      }
    }
    return c.json({
      issues,
      coverage: Object.values(coverage),
      notice: "This audit identifies planning and evidence gaps. It does not determine registration eligibility or replace official advice.",
    });
  });
}
