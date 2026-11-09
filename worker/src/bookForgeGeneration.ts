/** Durable, owner-only workbook production. It uses the existing minute cron, not a browser tab. */
import type { Hono } from "hono";
import type { Env } from "./types";
import { AC9_OUTCOMES } from "./data/ac9-outcomes";
import { activeRoles } from "./access";
import { hitRateLimit, writeAudit } from "./adminAudit";
import {
  FORGE_SCHEMA,
  renderBook,
  qaBook,
  type Book,
  type Page,
  type ForgePlan,
} from "./bookForge";
import {
  checkSession,
  composeAnswerText,
  composeSessionText,
  mergeFeedback,
  parseDraft,
  reconcileReview,
  reviewPrompt,
  revisePrompt,
  writePrompt,
  type Feedback,
  type Revision,
  type SessionContext,
  type SessionDraft,
} from "./bookForgeEditorial";
const JOB_SCHEMA = `CREATE TABLE IF NOT EXISTS book_forge_jobs (
 project_id TEXT PRIMARY KEY, owner_id TEXT NOT NULL, family_id TEXT NOT NULL,
 status TEXT NOT NULL, phase TEXT NOT NULL, cursor INTEGER NOT NULL DEFAULT 0,
 payload TEXT NOT NULL, error TEXT NOT NULL DEFAULT '', lease TEXT, lease_until TEXT,
 updated_at TEXT NOT NULL
)`;
export async function ensureForgeJobs(db: D1Database) {
  await db.prepare(FORGE_SCHEMA).run();
  await db.prepare(JOB_SCHEMA).run();
  await db
    .prepare(
      "CREATE UNIQUE INDEX IF NOT EXISTS idx_forge_one_active_owner ON book_forge_jobs(owner_id) WHERE status IN ('queued','running')",
    )
    .run();
}
const MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const iso = () => new Date().toISOString();
const bounded = (v: unknown, n: number) =>
  typeof v === "string" && v.trim().length <= n ? v.trim() : "";
async function ask(env: Env, prompt: string, max = 4500): Promise<any> {
  if (!env.AI) throw new Error("Workers AI is not connected.");
  const result = await env.AI.run(MODEL, {
    messages: [
      {
        role: "system",
        content:
          "You are an experienced Australian primary teacher, educational editor and original workbook author. Write in Australian English. Never reproduce commercial workbook text, characters, branding or page designs. Produce only valid JSON matching the requested structure. Do not claim official endorsement or certified alignment.",
      },
      { role: "user", content: prompt },
    ],
    max_tokens: max,
    temperature: 0.35,
    response_format: { type: "json_object" },
  });
  const raw = result?.response;
  if (raw && typeof raw === "object") return raw;
  if (typeof raw !== "string")
    throw new Error(
      "The writing service returned no usable content. Retry this step.",
    );
  try {
    return JSON.parse(
      raw.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, ""),
    );
  } catch {
    throw new Error(
      "The writing service returned incomplete content. Retry this step.",
    );
  }
}
/** The three book pages of an approved session: two student pages and its answer page. */
export function sessionPages(draft: SessionDraft, plan: ForgePlan, index: number): Page[] {
  const snapshot = JSON.stringify(plan);
  const pages: Page[] = draft.pages.slice(0, 2).map((p, i) => ({
    id: `lesson-${index + 1}-page-${i + 1}`,
    title: p.title,
    text: composeSessionText(p),
    goal: plan.goal,
    lessonId: plan.lessonId,
    lessonSnapshot: snapshot,
    locked: true,
    ...(p.visual ? { visual: { ...p.visual } } : {}),
  }));
  pages.push({
    id: `lesson-${index + 1}-answers`,
    title: `Answers · ${plan.title}`.slice(0, 120),
    text: composeAnswerText(draft),
    goal: "Adult guide: answers, acceptable responses and support.",
    lessonId: plan.lessonId,
    lessonSnapshot: snapshot,
    locked: true,
    answerPage: true,
  });
  return pages;
}
/** Parses and checks a generated session; throws with every deterministic problem, or returns its pages. */
export function validateGeneratedSession(
  raw: any,
  plan: ForgePlan,
  index: number,
  ctx: SessionContext = { year: 0, subject: "Mathematics", title: plan.title, goal: plan.goal },
): Page[] {
  const draft = parseDraft(raw);
  if (!draft) throw new Error("A lesson needs two complete student pages.");
  const errors = checkSession(draft, { ...ctx, title: plan.title, goal: plan.goal });
  if (errors.length) throw new Error(errors.join(" "));
  return sessionPages(draft, plan, index);
}
const MAX_ATTEMPTS = 3;
export function registerForgeGeneration(app: Hono<any>) {
  app.use("*", async (c, next) => {
    await ensureForgeJobs(c.env.DB);
    await next();
  });
  // Editing an in-progress project would invalidate the background writer's input.
  app.use("/:id/*", async (c, next) => {
    if (
      c.req.method !== "GET" &&
      !["retry", "cancel"].includes(c.req.path.split("/").pop()!)
    ) {
      const job = await c.env.DB.prepare(
        "SELECT status FROM book_forge_jobs WHERE project_id=? AND owner_id=?",
      )
        .bind(c.req.param("id"), c.get("user").id)
        .first();
      if (job?.status === "queued" || job?.status === "running")
        return c.json(
          {
            detail:
              "This workbook is being created. Wait for it to finish or stop creation before editing.",
          },
          409,
        );
    }
    await next();
  });
  app.post("/generate", async (c) => {
    const b = await c.req.json();
    const brief = bounded(b.brief, 2000);
    if (brief.length < 20)
      return c.json(
        {
          detail:
            "Describe the workbook, age or year level, and what you want it to teach.",
        },
        400,
      );
    if (!c.env.AI || !c.env.BUCKET)
      return c.json(
        {
          detail:
            "Workbook creation needs the existing AI and file storage connections.",
        },
        503,
      );
    const active = await c.env.DB.prepare(
      "SELECT project_id FROM book_forge_jobs WHERE owner_id=? AND status IN ('queued','running')",
    )
      .bind(c.get("user").id)
      .first();
    if (active)
      return c.json(
        {
          detail:
            "Finish or stop your current workbook before starting another.",
        },
        409,
      );
    const limit = await hitRateLimit(
      c.env.DB,
      `forge-books:${c.get("user").id}`,
      3,
      86400,
    );
    if (!limit.ok)
      return c.json(
        {
          detail:
            "Three workbook starts have been used today. You can still continue existing projects.",
        },
        429,
      );
    if (
      !/foundation|kindergarten|prep\b|year\s*[0-6]\b/i.test(brief) ||
      !/math|numeracy|english|reading|literacy|science/i.test(brief) ||
      /year\s*(?:[7-9]|1[0-2])\b/i.test(brief)
    )
      return c.json(
        {
          detail:
            "For this first edition, include Foundation or Year 1–6 and Mathematics, English or Science in the brief.",
        },
        400,
      );
    const year = /foundation|kindergarten|prep\b/i.test(brief)
      ? 0
      : Number(brief.match(/year\s*([0-6])\b/i)?.[1] ?? 0);
    const subject = /\benglish|reading|literacy\b/i.test(brief)
      ? "English"
      : /\bscience\b/i.test(brief)
        ? "Science"
        : "Mathematics";
    const outcomes = AC9_OUTCOMES.filter(
      (o) => o.subject === subject && o.from <= year && o.to >= year,
    );
    const requested = Number(
      b.pageTarget || brief.match(/(\d+)\s*[- ]?pages?\b/i)?.[1] || 0,
    );
    if (
      requested &&
      (!Number.isInteger(requested) || requested < 8 || requested > 900)
    )
      return c.json(
        {
          detail:
            "Use a page target between 8 and 900, or leave it blank for content-led length. Larger projects should be made as separate volumes.",
        },
        400,
      );
    const count = requested
      ? Math.max(2, Math.floor((requested - 2) / 3))
      : b.length === "short"
        ? 8
        : Math.max(16, outcomes.length * 3);
    const id = crypto.randomUUID();
    const book: Book = {
      title: `${year === 0 ? "Foundation" : `Year ${year}`} ${subject} · creating`,
      template: "woodland",
      pages: [],
      releases: [],
      generated: true,
      brief,
    };
    const now = iso();
    await c.env.DB.batch([
      c.env.DB.prepare(
        "INSERT INTO book_forge_projects VALUES (?,?,?,?,?,?)",
      ).bind(id, c.get("user").id, book.title, 1, JSON.stringify(book), now),
      c.env.DB.prepare(
        "INSERT INTO book_forge_jobs (project_id,owner_id,family_id,status,phase,payload,updated_at) VALUES (?,?,?,?,?,?,?)",
      ).bind(
        id,
        c.get("user").id,
        c.get("user").family_id,
        "queued",
        "plan",
        JSON.stringify({
          brief,
          year,
          subject,
          count,
          outcomes,
          focused: b.length === "short",
        }),
        now,
      ),
    ]);
    await writeAudit(c.env.DB, {
      actorUserId: c.get("user").id,
      actorLabel: "owner",
      action: "book-forge.generate",
      targetId: id,
    });
    return c.json({ id, revision: 1, book }, 202);
  });
  app.get("/:id/generation", async (c) => {
    const job = await c.env.DB.prepare(
      "SELECT status,phase,cursor,error,updated_at,payload FROM book_forge_jobs WHERE project_id=? AND owner_id=?",
    )
      .bind(c.req.param("id"), c.get("user").id)
      .first();
    if (!job) return c.json({ job: null });
    const { payload, ...safe } = job;
    const data = JSON.parse(payload as string);
    // The draft being revised (never part of the book) and its feedback, for the owner to inspect.
    const revision: Revision | undefined = job.phase === "write" ? data.revisions?.[job.cursor as number] : undefined;
    return c.json({
      job: {
        ...safe,
        total: data.count,
        review: revision
          ? {
              attempts: revision.attempts,
              errors: revision.feedback.filter((f) => f.kind === "error").map((f) => f.text),
              suggestions: revision.feedback.filter((f) => f.kind === "suggestion").map((f) => f.text),
              falsePositives: revision.falsePositives,
              draft: revision.draft,
            }
          : null,
      },
    });
  });
  for (const action of ["retry", "cancel"])
    app.post(`/:id/${action}`, async (c) => {
      const job = await c.env.DB.prepare(
        "SELECT * FROM book_forge_jobs WHERE project_id=? AND owner_id=?",
      )
        .bind(c.req.param("id"), c.get("user").id)
        .first();
      if (!job) return c.json({ detail: "Creation job not found." }, 404);
      if (action === "retry" && job.status !== "failed")
        return c.json(
          { detail: "Only a failed creation step can be retried." },
          409,
        );
      await c.env.DB.prepare(
        "UPDATE book_forge_jobs SET status=?,error=?,lease=NULL,lease_until=NULL,updated_at=? WHERE project_id=? AND owner_id=?",
      )
        .bind(
          action === "retry" ? "queued" : "cancelled",
          "",
          iso(),
          c.req.param("id"),
          c.get("user").id,
        )
        .run();
      return c.json({ ok: true });
    });
}
export async function processBookForgeJobs(env: Env) {
  await ensureForgeJobs(env.DB);
  // One leased step at a time; completed steps are committed before any subsequent paid call.
  const job = await env.DB.prepare(
    "SELECT * FROM book_forge_jobs WHERE status IN ('queued','running') AND (lease_until IS NULL OR lease_until < ?) ORDER BY updated_at LIMIT 1",
  )
    .bind(iso())
    .first<any>();
  if (!job) return;
  const lease = crypto.randomUUID();
  const until = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  const claimed = await env.DB.prepare(
    "UPDATE book_forge_jobs SET status='running',lease=?,lease_until=? WHERE project_id=? AND (lease_until IS NULL OR lease_until < ?) AND status IN ('queued','running')",
  )
    .bind(lease, until, job.project_id, iso())
    .run();
  if (!claimed.meta.changes) return;
  // A rejected session draft and its feedback, saved with the failure so the next attempt revises it.
  let rejected: { cursor: number; revision: Revision } | null = null;
  const payload = JSON.parse(job.payload);
  try {
    if (!(await activeRoles(env.DB, job.owner_id)).includes("owner"))
      throw new Error("Owner access is no longer active.");
    const row = await env.DB.prepare(
      "SELECT * FROM book_forge_projects WHERE id=? AND owner_id=?",
    )
      .bind(job.project_id, job.owner_id)
      .first<any>();
    if (!row) throw new Error("Project no longer exists.");
    const book: Book = JSON.parse(row.document);
    let phase = job.phase,
      cursor = job.cursor,
      status = "queued";
    if (phase === "plan") {
      const start = book.plan?.length || 0;
      const batchSize = Math.min(12, payload.count - start);
      const assigned = Array.from(
        { length: batchSize },
        (_, i) =>
          payload.outcomes[
            Math.min(
              payload.outcomes.length - 1,
              Math.floor(
                ((start + i) * payload.outcomes.length) / payload.count,
              ),
            )
          ],
      );
      const outline = await ask(
        env,
        `Create a coherent ORIGINAL ${payload.year === 0 ? "Foundation" : `Year ${payload.year}`} ${payload.subject} workbook plan. Brief: ${payload.brief}\nThe whole book has ${payload.count} teaching sessions. Plan ONLY the next ${batchSize} sessions, starting at session ${start + 1}. Previous sessions: ${JSON.stringify(book.plan || [])}.\nThese are the ONLY valid curriculum references: ${JSON.stringify(payload.outcomes)}. ${!payload.focused ? `For these next sessions use these assigned curriculum references in order, varying and deepening practice each time: ${JSON.stringify(assigned)}.` : "Choose the references most relevant to the requested topic."} Use age-appropriate progression, practical work, revision and varied exercises. Return {"title":"...","sessions":[{"title":"...","goal":"...","code":"one supplied code"}]}. EXACTLY ${batchSize} sessions. Each goal <=180 characters; titles <=80 characters.`,
        4000,
      );
      if (
        !bounded(outline.title, 100) ||
        !Array.isArray(outline.sessions) ||
        outline.sessions.length !== batchSize
      )
        throw new Error(
          "The book plan did not contain the requested number of complete sessions. Retry planning.",
        );
      const codes = new Set(payload.outcomes.map((o: any) => o.code));
      const planned = outline.sessions.map((s: any, i: number) => {
        if (
          !bounded(s.title, 80) ||
          !bounded(s.goal, 180) ||
          !codes.has(s.code) ||
          (!payload.focused && s.code !== assigned[i].code)
        )
          throw new Error(
            "The book plan has an invalid curriculum reference or incomplete goal.",
          );
        return {
          title: s.title,
          goal: s.goal,
          code: s.code,
          lessonId: `forge-${job.project_id}-${start + i + 1}`,
        };
      });
      book.plan = [...(book.plan || []), ...planned];
      if (start === 0) book.title = outline.title;
      cursor = book.plan.length;
      if (cursor >= payload.count) {
        phase = "write";
        cursor = 0;
      }
    } else if (phase === "write") {
      // Each attempt revises the last rejected draft against all feedback so far, then the whole draft is checked
      // again. Nothing reaches book.pages until a session passes every check and the independent review.
      const plan = book.plan![cursor];
      const ctx: SessionContext = { year: payload.year, subject: payload.subject, title: plan.title, goal: plan.goal };
      const previous: Revision = payload.revisions?.[cursor] || { draft: null, feedback: [], falsePositives: [], attempts: 0 };
      const raw = await ask(
        env,
        previous.draft
          ? revisePrompt({ ctx, plan, draft: previous.draft, feedback: previous.feedback })
          : writePrompt({
              ctx,
              brief: payload.brief,
              sessionNumber: cursor + 1,
              sequence: book.plan!.map((p) => ({ title: p.title, code: p.code })),
              plan,
            }),
        4000,
      );
      const draft = parseDraft(raw);
      const checks = draft
        ? checkSession(draft, ctx)
        : ["The reply was not a complete session in the required JSON shape."];
      let pages: Page[] = [];
      if (draft && !checks.length) {
        pages = sessionPages(draft, plan, cursor);
        checks.push(...qaBook({ title: book.title, template: book.template, pages, releases: [] }));
      }
      const verdict = checks.length
        ? { errors: [], suggestions: [], falsePositives: [] }
        : reconcileReview(await ask(env, reviewPrompt({ ctx, plan, draft: draft! }), 1500));
      const errors = [...checks, ...verdict.errors];
      if (errors.length) {
        const feedback: Feedback[] = [
          ...checks.map((text) => ({ kind: "error" as const, source: "check" as const, text })),
          ...verdict.errors.map((text) => ({ kind: "error" as const, source: "reviewer" as const, text })),
          ...verdict.suggestions.map((text) => ({ kind: "suggestion" as const, source: "reviewer" as const, text })),
        ];
        rejected = {
          cursor,
          revision: {
            // An unreadable reply never replaces the last readable draft.
            draft: draft ?? previous.draft,
            feedback: mergeFeedback(previous.feedback, feedback),
            falsePositives: [...previous.falsePositives, ...verdict.falsePositives].slice(-20),
            attempts: previous.attempts + 1,
          },
        };
        throw new Error(`Session ${cursor + 1} needs revision: ${errors.slice(0, 4).join(" ")}`.slice(0, 780));
      }
      if (verdict.falsePositives.length)
        payload.falsePositives = [...(payload.falsePositives || []), ...verdict.falsePositives.map((f) => `Session ${cursor + 1}: ${f}`)].slice(-50);
      book.pages.push(...pages);
      if (payload.revisions) delete payload.revisions[cursor];
      cursor++;
      if (cursor >= book.plan!.length) {
        book.pages = [
          ...book.pages.filter((p) => !p.answerPage),
          ...book.pages.filter((p) => p.answerPage),
        ];
        phase = "illustrate";
        cursor = 0;
      }
    } else if (phase === "illustrate") {
      // A few decorative chapter illustrations; exact diagrams always remain vector artwork.
      const targets = book.pages
        .filter(
          (p) =>
            !p.answerPage &&
            !p.visual &&
            p.text
              .split("\n")
              .reduce((n, s) => n + Math.max(1, Math.ceil(s.length / 72)), 0) <=
              12,
        )
        .filter((_, i) => i % 8 === 0)
        .slice(0, 6);
      if (cursor < targets.length) {
        if (!env.AI || !env.BUCKET)
          throw new Error("Artwork storage or Workers AI is unavailable.");
        const limit = await hitRateLimit(
          env.DB,
          `forge-art:${job.owner_id}`,
          30,
          86400,
        );
        if (!limit.ok)
          throw new Error(
            "Daily artwork allowance reached. Retry tomorrow to continue.",
          );
        const page = targets[cursor];
        const form = new FormData();
        const prompt = `Original professional children's workbook illustration for Side-Quest: ${page.title}. Gentle woodland dragon explorer, warm hand-painted storybook style, sage green and cream palette, clean light background. Decorative only: no numbers, text, worksheets or mathematical representations.`;
        form.append("prompt", prompt);
        form.append("width", "1024");
        form.append("height", "1024");
        const multipart = new Response(form);
        const image = await env.AI.run(
          "@cf/black-forest-labs/flux-2-klein-9b",
          {
            multipart: {
              body: multipart.body,
              contentType: multipart.headers.get("content-type"),
            },
          },
        );
        if (typeof image?.image !== "string" || image.image.length > 6000000)
          throw new Error("No usable illustration was returned.");
        const bytes = Uint8Array.from(atob(image.image), (c) =>
          c.charCodeAt(0),
        );
        const png =
          bytes[0] === 137 &&
          bytes[1] === 80 &&
          bytes[2] === 78 &&
          bytes[3] === 71;
        if (!png && !(bytes[0] === 255 && bytes[1] === 216))
          throw new Error("Unsupported illustration format.");
        page.art = `book-forge/${job.project_id}/art/${crypto.randomUUID()}.${png ? "png" : "jpg"}`;
        await env.BUCKET.put(page.art, bytes, {
          httpMetadata: { contentType: png ? "image/png" : "image/jpeg" },
        });
        page.prompt = prompt;
        page.artModel = "@cf/black-forest-labs/flux-2-klein-9b";
        cursor++;
      }
      if (cursor >= targets.length) {
        phase = "render";
        cursor = 0;
      }
    } else if (phase === "render") {
      const issues = qaBook(book);
      if (issues.length) throw new Error(issues.join(" ").slice(0, 700));
      if (typeof env.BROWSER?.quickAction !== "function")
        throw new Error(
          "PDF connection is not ready. Your written and illustrated pages are saved; connect Browser Run and retry.",
        );
      if (!env.BUCKET) throw new Error("File storage is unavailable.");
      const images: Record<string, string> = {};
      for (const p of book.pages)
        if (p.art) {
          const o = await env.BUCKET.get(p.art);
          if (!o) throw new Error("Saved illustration missing.");
          const data = new Uint8Array(await o.arrayBuffer());
          let bin = "";
          for (let i = 0; i < data.length; i += 8192)
            bin += String.fromCharCode(...data.subarray(i, i + 8192));
          images[p.art] =
            `data:image/${p.art.endsWith(".png") ? "png" : "jpeg"};base64,${btoa(bin)}`;
        }
      const html = renderBook(book, images);
      if (html.length > 18000000)
        throw new Error(
          "Artwork exceeds the export size limit. Reduce illustrations before exporting.",
        );
      const pdf = await env.BROWSER.quickAction("pdf", {
        html,
        pdfOptions: {
          format: "a4",
          printBackground: true,
          preferCSSPageSize: true,
        },
        waitForTimeout: 1000,
      });
      if (!pdf.ok) throw new Error("PDF rendering failed. Retry this step.");
      const bytes = await pdf.arrayBuffer();
      if (
        bytes.byteLength > 25000000 ||
        new TextDecoder().decode(bytes.slice(0, 5)) !== "%PDF-"
      )
        throw new Error("PDF output was not valid.");
      book.pdf = `book-forge/${job.project_id}/pdf/${crypto.randomUUID()}.pdf`;
      await env.BUCKET.put(book.pdf, bytes, {
        httpMetadata: { contentType: "application/pdf" },
      });
      status = "complete";
      phase = "ready";
    }
    const document = JSON.stringify(book);
    if (new TextEncoder().encode(document).length > 1500000)
      throw new Error("Workbook exceeds the project size limit.");
    const updated = await env.DB.batch([
      env.DB.prepare(
        "UPDATE book_forge_projects SET title=?,document=?,revision=revision+1,updated_at=? WHERE id=? AND revision=? AND EXISTS (SELECT 1 FROM book_forge_jobs WHERE project_id=? AND lease=?)",
      ).bind(
        book.title,
        document,
        iso(),
        job.project_id,
        row.revision,
        job.project_id,
        lease,
      ),
      env.DB.prepare(
        "UPDATE book_forge_jobs SET status=?,phase=?,cursor=?,payload=?,error=?,lease=NULL,lease_until=NULL,updated_at=? WHERE project_id=? AND lease=? AND EXISTS (SELECT 1 FROM book_forge_projects WHERE id=? AND revision=? AND document=?)",
      ).bind(
        status,
        phase,
        cursor,
        JSON.stringify(payload),
        "",
        iso(),
        job.project_id,
        lease,
        job.project_id,
        row.revision + 1,
        document,
      ),
    ]);
    if (!updated[0].meta.changes)
      throw new Error(
        "Project changed while generating. Stop creation and review your saved pages.",
      );
  } catch (e) {
    // Start from the stored payload so nothing half-done in this step is kept, except the rejected draft.
    const payload = JSON.parse(job.payload);
    if (rejected)
      payload.revisions = { ...(payload.revisions || {}), [rejected.cursor]: rejected.revision };
    const key = `${job.phase}:${job.cursor}`;
    payload.failures = payload.failures || {};
    payload.failures[key] = (payload.failures[key] || 0) + 1;
    await env.DB.prepare(
      "UPDATE book_forge_jobs SET status=?,payload=?,error=?,lease=NULL,lease_until=NULL,updated_at=? WHERE project_id=? AND lease=?",
    )
      .bind(
        payload.failures[key] < MAX_ATTEMPTS ? "queued" : "failed",
        JSON.stringify(payload),
        (e instanceof Error
          ? e.message
          : "Creation paused. Retry the step."
        ).slice(0, 800),
        iso(),
        job.project_id,
        lease,
      )
      .run();
  }
}
