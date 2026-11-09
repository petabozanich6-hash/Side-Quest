import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { Env, AuthUser } from "./types";
import { writeAudit, hitRateLimit } from "./adminAudit";
import { registerForgeGeneration } from "./bookForgeGeneration";
import { ensureShopCatalog, slugify } from "./shopCatalog";

export const FORGE_SCHEMA = `CREATE TABLE IF NOT EXISTS book_forge_projects (
 id TEXT PRIMARY KEY, owner_id TEXT NOT NULL, title TEXT NOT NULL, revision INTEGER NOT NULL,
 document TEXT NOT NULL, updated_at TEXT NOT NULL
)`;
export const TEMPLATES = [
  {
    id: "woodland",
    name: "Woodland Explorer",
    colour: "#285441",
    paper: "#faf8ef",
  },
  {
    id: "storybook",
    name: "Storybook Studio",
    colour: "#634b80",
    paper: "#fcf8f4",
  },
  {
    id: "ink",
    name: "Ink-saving Workbook",
    colour: "#252525",
    paper: "#ffffff",
  },
];
export type Page = {
  id: string;
  title: string;
  text: string;
  goal: string;
  lessonId: string;
  lessonSnapshot?: string;
  locked: boolean;
  art?: string;
  prompt?: string;
  artModel?: string;
  visual?: { type: string; count: number };
  answerPage?: boolean;
};
export type ForgePlan = {
  title: string;
  goal: string;
  code: string;
  lessonId: string;
};
export type Book = {
  brief?: string;
  plan?: ForgePlan[];
  review?: string[];
  generated?: boolean;
  title: string;
  template: string;
  pages: Page[];
  pdf?: string;
  approved?: boolean;
  releases: {
    key: string;
    title: string;
    revision: number;
    date: string;
    productId?: string;
  }[];
};
function fail(
  message: string,
  status: 400 | 404 | 409 | 503 | 502 | 429 = 400,
): never {
  throw new HTTPException(status, { message });
}
const str = (v: unknown, max: number) => {
  if (typeof v !== "string") return "";
  if (v.trim().length > max)
    fail(
      `Text exceeds the ${max}-character limit. Split it into smaller sections.`,
    );
  return v.trim();
};
export const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
export function validateBook(input: any, old: Book): Book {
  if (
    !input ||
    !Array.isArray(input.pages) ||
    !input.pages.length ||
    input.pages.length > 1000
  )
    fail("Use between 1 and 1000 pages.");
  if (!TEMPLATES.some((t) => t.id === input.template) || !str(input.title, 120))
    fail("Choose a template and enter a book title.");
  const ids = new Set<string>();
  const pages: Page[] = input.pages.map((p: any) => {
    if (
      !p ||
      typeof p.id !== "string" ||
      !/^[a-zA-Z0-9-]{1,60}$/.test(p.id) ||
      ids.has(p.id)
    )
      fail("Every page needs a unique ID.");
    ids.add(p.id);
    const before = old.pages.find((x) => x.id === p.id);
    const page: Page = {
      id: p.id,
      title: str(p.title, 120),
      text: str(p.text, 2400),
      goal: str(p.goal, 300),
      lessonId: str(p.lessonId, 80),
      locked: before?.locked || false,
      art: before?.art,
      prompt: before?.prompt,
      artModel: before?.artModel,
      visual: before?.visual,
      answerPage: before?.answerPage,
    };
    if (
      before?.locked &&
      ["title", "text", "goal", "lessonId"].some(
        (k) => (page as any)[k] !== (before as any)[k],
      )
    )
      fail("Unlock this page before changing its lesson content.", 409);
    if (before?.locked) page.lessonSnapshot = before.lessonSnapshot;
    return page;
  });
  if (old.pages.some((p) => p.locked && !ids.has(p.id)))
    fail("Unlock a page before removing it.", 409);
  return {
    ...old,
    title: str(input.title, 120),
    template: input.template,
    pages,
    releases: old.releases,
    pdf: undefined,
    approved: undefined,
  };
}
export function qaBook(book: Book): string[] {
  const issues: string[] = [...(book.review || [])];
  if (
    book.generated &&
    (!book.plan?.length ||
      book.plan.some(
        (s) =>
          book.pages.filter((p) => p.lessonId === s.lessonId && !p.answerPage)
            .length < 2 ||
          !book.pages.some((p) => p.lessonId === s.lessonId && p.answerPage),
      ))
  )
    issues.push(
      "The workbook is incomplete: finish each planned session and its answer guide before approval.",
    );
  for (const [i, p] of book.pages.entries()) {
    const label = `Page ${i + 1}`;
    if (
      p.visual &&
      (!["counters", "ten-frame", "shapes"].includes(p.visual.type) ||
        !Number.isInteger(p.visual.count) ||
        p.visual.count < 0 ||
        p.visual.count > 20)
    )
      issues.push(`${label}: invalid maths diagram.`);
    if (!p.title || !p.text || !p.goal)
      issues.push(`${label}: add title, content and learning goal.`);
    if (!p.locked || !p.lessonSnapshot)
      issues.push(`${label}: link a lesson and lock its content.`);
    // Conservative print budget: long paragraphs and explicit line breaks both consume space.
    const lines = p.text
      .split("\n")
      .reduce((n, s) => n + Math.max(1, Math.ceil(s.length / 72)), 0);
    if (lines > (p.art || p.visual ? 14 : 25))
      issues.push(
        `${label}: split the content across pages to leave print space.`,
      );
  }
  return issues;
}
export async function forgeLessonSnapshot(
  db: D1Database,
  familyId: string,
  book: Book,
  page: Page,
): Promise<string | null> {
  const planned = book.plan?.find((x) => x.lessonId === page.lessonId);
  if (planned) return JSON.stringify(planned);
  const lesson = await db
    .prepare(
      "SELECT title,data,version FROM lessons WHERE id=? AND family_id=? AND archived_at IS NULL",
    )
    .bind(page.lessonId, familyId)
    .first();
  return lesson ? JSON.stringify(lesson) : null;
}
export function mathDiagram(visual: Page["visual"]): string {
  if (!visual) return "";
  const count = Math.max(0, Math.min(20, Math.trunc(visual.count)));
  const tenFrame = visual.type === "ten-frame";
  // Standard ten-frames have two rows of five. Show a second frame only above ten.
  const x = (i: number) =>
    tenFrame
      ? 10 + (i % 5) * 42 + Math.floor(i / 10) * 235
      : 10 + (i % 10) * 45;
  const y = (i: number) =>
    10 + Math.floor((tenFrame ? i % 10 : i) / (tenFrame ? 5 : 10)) * 45;
  const cells = tenFrame
    ? Array.from(
        { length: count > 10 ? 20 : 10 },
        (_, i) =>
          `<rect x="${x(i)}" y="${y(i)}" width="42" height="45" fill="white" stroke="#285441"/>`,
      ).join("")
    : "";
  const shapes = Array.from({ length: count }, (_, i) =>
    visual.type === "shapes"
      ? `<rect x="${x(i) + 10}" y="${y(i) + 10}" width="25" height="25" rx="3" fill="#527345"/>`
      : `<circle cx="${x(i) + 21}" cy="${y(i) + 22}" r="13" fill="#527345"/>`,
  ).join("");
  return `<svg role="img" aria-label="${count} objects${tenFrame ? " in ten-frames" : ""}" viewBox="0 0 470 110" xmlns="http://www.w3.org/2000/svg">${cells}${shapes}</svg>`;
}
export function renderBook(
  book: Book,
  images: Record<string, string> = {},
): string {
  const t = TEMPLATES.find((t) => t.id === book.template)!;
  const contentsCount = book.generated
    ? Math.max(1, Math.ceil((book.plan?.length || 0) / 24))
    : 0;
  const offset = book.generated ? 1 + contentsCount : 0;
  const front = book.generated
    ? `<section class="page cover"><header>SIDE-QUEST LEARNING · WORKBOOK COLLECTION</header><div class="cover-kicker">A world of little discoveries</div><h1>${escapeHtml(book.title)}</h1><p class="cover-note">Learn a little. Try it together.<br>Make it your own.</p><div class="cover-art"><svg viewBox="0 0 470 210" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="330" cy="65" r="45" fill="#dfb85b"/><path d="M0 180 Q110 15 230 180 T470 180 V210 H0" fill="#7b9167"/><path d="M0 205 Q200 70 470 190 V210 H0" fill="#285441"/><circle cx="110" cy="72" r="25" fill="#d7dec9"/><path d="M190 60 L225 125 H155Z" fill="#77936c"/><rect x="275" y="118" width="40" height="40" rx="8" fill="#f0dba8"/></svg></div><p class="name-line">This workbook belongs to ____________________</p><footer><span>Original Side-Quest activities · Adult-supported learning</span><span>1</span></footer></section>${Array.from(
        { length: contentsCount },
        (_, n) =>
          `<section class="page contents"><header>SIDE-QUEST · YOUR LEARNING JOURNEY</header><h1>${n === 0 ? "Every quest starts with curiosity." : "Your next discoveries"}</h1><p class="intro">Read instructions together, explore with real objects, and let your learner explain their thinking. Answers follow the student pages.</p><div class="contents-list">${(
            book.plan || []
          )
            .slice(n * 24, (n + 1) * 24)
            .map(
              (s, i) =>
                `<div><span>${n * 24 + i + 1}. ${escapeHtml(s.title)}</span><b>${
                  offset +
                  1 +
                  Math.max(
                    0,
                    book.pages.findIndex(
                      (p) => p.lessonId === s.lessonId && !p.answerPage,
                    ),
                  )
                }</b></div>`,
            )
            .join(
              "",
            )}</div><p class="attribution">Planning references: Australian Curriculum v9.0, ACARA, CC BY 4.0. Reference descriptions adapted for planning; ACARA does not endorse Side-Quest. Coverage and suitability require editorial review.</p><footer><span>Side-Quest Learning</span><span>${n + 2}</span></footer></section>`,
      ).join("")}`
    : "";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'"><title>${escapeHtml(book.title)}</title><style>
 @page{size:A4;margin:0}*{box-sizing:border-box}body{margin:0;background:#ddd;color:#24342b;font-family:Arial,sans-serif}.page{width:210mm;height:297mm;padding:18mm 20mm;position:relative;background:${t.paper};break-after:page;overflow:hidden;margin:12px auto}.page:last-child{break-after:auto}.cover{background:#f3efdf}.cover h1{font-size:54px;max-width:550px;margin:35px 0}.cover-kicker{margin-top:60px;text-transform:uppercase;font-size:12px;letter-spacing:3px}.cover-note{font-family:Georgia,serif;font-size:24px;line-height:1.5}.cover-art svg{height:65mm;margin-top:28px}.name-line{margin-top:25px;font-size:15px}.intro{font-size:13px;line-height:1.6}.contents-list{margin-top:18px}.contents-list>div{display:flex;justify-content:space-between;border-bottom:1px solid #d9ddcf;padding:4px 0;font-size:11px}.attribution{font-size:9px;line-height:1.4;margin-top:20px}header{font-size:11px;font-weight:bold;letter-spacing:3px;color:${t.colour};border-bottom:2px solid ${t.colour};padding-bottom:12px}h1{font-family:Georgia,serif;color:${t.colour};font-size:30px;line-height:1.15;margin:20px 0 14px}.goal{padding:12px;border-left:4px solid ${t.colour};background:#ffffffb0;font-size:12px;line-height:1.4}.text{white-space:pre-wrap;overflow-wrap:anywhere;font-size:14px;line-height:1.65;margin-top:18px}svg{display:block;width:100%;height:32mm;margin:12px 0}img{display:block;width:100%;height:65mm;object-fit:contain;margin:14px 0}.lines{height:28mm;background:repeating-linear-gradient(transparent,transparent 8mm,#c5cbbf 8mm,#c5cbbf 8.2mm);margin-top:14px}footer{position:absolute;bottom:12mm;left:20mm;right:20mm;display:flex;justify-content:space-between;font-size:10px;color:${t.colour}}@media print{body{background:white}.page{margin:0}}</style></head><body>${front}${book.pages.map((p, i) => `<section class="page"><header>SIDE-QUEST · ${escapeHtml(book.title)}</header><h1>${escapeHtml(p.title)}</h1><div class="goal"><b>Our learning quest</b><br>${escapeHtml(p.goal)}</div>${p.art && images[p.art] ? `<img alt="" src="${images[p.art]}">` : ""}${mathDiagram(p.visual)}<div class="text">${escapeHtml(p.text)}</div><div class="lines"></div><footer><span>Side-Quest Learning · A little curiosity goes a long way</span><span>${i + 1 + offset} / ${book.pages.length + offset}</span></footer></section>`).join("")}</body></html>`;
}
const base64 = (bytes: Uint8Array) => {
  let s = "";
  for (let i = 0; i < bytes.length; i += 8192)
    s += String.fromCharCode(...bytes.subarray(i, i + 8192));
  return btoa(s);
};
export function createBookForgeRoutes() {
  const app = new Hono<{ Bindings: Env; Variables: { user: AuthUser } }>();
  app.onError((e, c) =>
    c.json(
      {
        detail:
          e instanceof HTTPException
            ? e.message
            : "Book Forge could not complete this step. Your saved project is safe; retry.",
      },
      e instanceof HTTPException ? e.status : 500,
    ),
  );
  app.use("*", async (c, next) => {
    await c.env.DB.prepare(FORGE_SCHEMA).run();
    await next();
  });
  const load = async (c: any) => {
    const row = await c.env.DB.prepare(
      "SELECT * FROM book_forge_projects WHERE id = ? AND owner_id = ?",
    )
      .bind(c.req.param("id"), c.get("user").id)
      .first();
    if (!row) fail("Project not found.", 404);
    if (c.req.method !== "GET") {
      const job = await c.env.DB.prepare(
        "SELECT status FROM book_forge_jobs WHERE project_id=?",
      )
        .bind(row.id)
        .first();
      if (job?.status === "queued" || job?.status === "running")
        fail(
          "This workbook is being created. Wait or stop creation before editing.",
          409,
        );
    }
    return { ...row, book: JSON.parse(row.document) as Book };
  };
  const save = async (c: any, row: any, book: Book, action: string) => {
    if (new TextEncoder().encode(JSON.stringify(book)).length > 1500000)
      fail(
        "This project contains too much lesson reference data. Split it into smaller volumes.",
      );
    const update = c.env.DB.prepare(
      "UPDATE book_forge_projects SET title=?, document=?, revision=revision+1, updated_at=? WHERE id=? AND owner_id=? AND revision=?",
    ).bind(
      book.title,
      JSON.stringify(book),
      new Date().toISOString(),
      row.id,
      c.get("user").id,
      row.revision,
    );
    const statements = [update];
    if (action === "publish") {
      const release = book.releases.find((x) => x.key === book.pdf)!;
      // The conditional insert runs in the same D1 transaction as the revision check.
      statements.push(
        c.env.DB.prepare(
          `INSERT OR IGNORE INTO shop_products (id,slug,department,collection,title,description,fulfilment,status,visible,stage,created_at,updated_at) SELECT ?,?,'books','Book Forge',?,?,'digital','draft',0,'launch_now',?,? FROM book_forge_projects WHERE id=? AND revision=? AND document=?`,
        ).bind(
          release.productId,
          `${slugify(book.title)}-${release.productId}`,
          book.title,
          `A Side-Quest learning workbook. ${book.pages.length} pages.`,
          release.date,
          release.date,
          row.id,
          row.revision + 1,
          JSON.stringify(book),
        ),
      );
    }
    const [result] = await c.env.DB.batch(statements);
    if (!result.meta.changes)
      fail(
        "This project changed in another window. Reload it before continuing.",
        409,
      );
    await writeAudit(c.env.DB, {
      actorUserId: c.get("user").id,
      actorLabel: `owner:${c.get("user").id}`,
      action: `book-forge.${action}`,
      targetType: "book-forge",
      targetId: row.id,
      detail: { revision: row.revision + 1 },
    });
    return c.json({ id: row.id, revision: row.revision + 1, book });
  };
  const images = async (env: Env, book: Book) => {
    const out: Record<string, string> = {};
    for (const p of book.pages)
      if (p.art && !out[p.art]) {
        const obj = await env.BUCKET?.get(p.art);
        if (!obj)
          fail(
            "Saved artwork is missing. Generate it again before previewing or exporting.",
            409,
          );
        out[p.art] =
          `data:${p.art.endsWith(".png") ? "image/png" : "image/jpeg"};base64,${base64(new Uint8Array(await obj.arrayBuffer()))}`;
      }
    return out;
  };
  registerForgeGeneration(app);
  app.get("/", async (c) => {
    const { results } = await c.env.DB.prepare(
      "SELECT id,title,revision,updated_at FROM book_forge_projects WHERE owner_id=? ORDER BY updated_at DESC LIMIT 100",
    )
      .bind(c.get("user").id)
      .all();
    return c.json({
      projects: results,
      templates: TEMPLATES,
      capabilities: {
        art: !!(c.env.AI && c.env.BUCKET),
        pdf: !!(
          c.env.BUCKET &&
          (typeof c.env.BROWSER?.quickAction === "function" ||
            (c.env.BOOK_FORGE_CF_ACCOUNT_ID && c.env.BOOK_FORGE_CF_API_TOKEN))
        ),
      },
    });
  });
  app.get("/lessons", async (c) => {
    const { results } = await c.env.DB.prepare(
      "SELECT id,title FROM lessons WHERE family_id=? AND archived_at IS NULL ORDER BY updated_at DESC LIMIT 500",
    )
      .bind(c.get("user").family_id)
      .all();
    return c.json({ lessons: results });
  });
  app.get("/lessons/:lessonId", async (c) => {
    const lesson = await c.env.DB.prepare(
      "SELECT title,data,version FROM lessons WHERE id=? AND family_id=? AND archived_at IS NULL",
    )
      .bind(c.req.param("lessonId"), c.get("user").family_id)
      .first();
    if (!lesson) fail("Lesson not found.", 404);
    return c.json({ lesson });
  });
  app.post("/", async (c) => {
    const b = await c.req.json();
    const title = str(b.title, 120);
    if (!title) fail("Enter a project title.");
    const id = crypto.randomUUID();
    const book: Book = {
      title,
      template: "woodland",
      pages: [
        {
          id: crypto.randomUUID(),
          title: "Your first quest",
          text: "",
          goal: "",
          lessonId: "",
          locked: false,
        },
      ],
      releases: [],
    };
    await c.env.DB.prepare(
      "INSERT INTO book_forge_projects VALUES (?,?,?,?,?,?)",
    )
      .bind(
        id,
        c.get("user").id,
        title,
        1,
        JSON.stringify(book),
        new Date().toISOString(),
      )
      .run();
    await writeAudit(c.env.DB, {
      actorUserId: c.get("user").id,
      actorLabel: "owner",
      action: "book-forge.create",
      targetId: id,
    });
    return c.json({ id, revision: 1, book }, 201);
  });
  app.get("/:id", async (c) => {
    const r = await load(c);
    return c.json({ id: r.id, revision: r.revision, book: r.book });
  });
  app.put("/:id", async (c) => {
    const r = await load(c);
    const b = await c.req.json();
    if (b.revision !== r.revision)
      fail("Reload the latest project before saving.", 409);
    return save(c, r, validateBook(b.book, r.book), "save");
  });
  app.post("/:id/:action", async (c) => {
    const r = await load(c);
    const b = await c.req.json();
    if (b.revision !== r.revision)
      fail("Reload the latest project before continuing.", 409);
    const book: Book = r.book;
    const action = c.req.param("action");
    const page = book.pages.find((p) => p.id === b.pageId);
    if (action === "lock" || action === "unlock") {
      if (!page) fail("Page not found.", 404);
      if (action === "lock") {
        const lesson = await forgeLessonSnapshot(
          c.env.DB,
          c.get("user").family_id,
          book,
          page,
        );
        if (!lesson || !page.goal || !page.text || !page.title)
          fail(
            "Choose an existing lesson and complete the page before locking.",
          );
        page.lessonSnapshot = lesson;
        page.locked = true;
      } else {
        page.locked = false;
        delete page.lessonSnapshot;
      }
      delete book.pdf;
      delete book.approved;
    } else if (action === "illustrate") {
      if (!page) fail("Page not found.", 404);
      if (!c.env.AI || !c.env.BUCKET)
        fail("Artwork needs the Workers AI and file storage connections.", 503);
      const prompt = str(b.prompt, 1400);
      if (!prompt) fail("Describe the illustration.");
      const limit = await hitRateLimit(
        c.env.DB,
        `forge-art:${c.get("user").id}`,
        30,
        86400,
      );
      if (!limit.ok) fail("Daily limit of 30 illustrations reached.", 429);
      const model =
        b.model === "klein"
          ? "@cf/black-forest-labs/flux-2-klein-9b"
          : "@cf/black-forest-labs/flux-1-schnell";
      const brief = `Professional children's workbook illustration, hand-painted woodland storybook style, sage green and warm cream, clean white background, no text, no letters. ${prompt}`;
      let input: Record<string, unknown> = { prompt: brief, steps: 8 };
      if (b.model === "klein") {
        const form = new FormData();
        form.append("prompt", brief);
        form.append("width", "1024");
        form.append("height", "1024");
        const multipart = new Response(form);
        input = {
          multipart: {
            body: multipart.body,
            contentType: multipart.headers.get("content-type"),
          },
        };
      }
      const result = await c.env.AI.run(model, input);
      if (typeof result?.image !== "string" || result.image.length > 6000000)
        fail("The image service did not return usable artwork.", 502);
      const bytes = Uint8Array.from(atob(result.image), (x) => x.charCodeAt(0));
      const mime =
        bytes[0] === 255 && bytes[1] === 216
          ? "image/jpeg"
          : bytes[0] === 137 &&
              bytes[1] === 80 &&
              bytes[2] === 78 &&
              bytes[3] === 71
            ? "image/png"
            : null;
      if (!mime) fail("The image service returned an unsupported image.", 502);
      const key = `book-forge/${r.id}/art/${crypto.randomUUID()}.${mime === "image/png" ? "png" : "jpg"}`;
      await c.env.BUCKET.put(key, bytes, {
        httpMetadata: { contentType: mime },
      });
      page.art = key;
      page.prompt = prompt;
      page.artModel = model;
      delete book.pdf;
      delete book.approved;
    } else if (action === "qa") {
      const issues = qaBook(book);
      for (const [i, p] of book.pages.entries())
        if (p.lessonSnapshot) {
          const lesson = await forgeLessonSnapshot(
            c.env.DB,
            c.get("user").family_id,
            book,
            p,
          );
          if (!lesson || lesson !== p.lessonSnapshot)
            issues.push(
              `Page ${i + 1}: source lesson changed; unlock, review and lock again.`,
            );
        }
      return c.json({ issues, revision: r.revision });
    } else if (
      action === "render" ||
      action === "approve" ||
      action === "publish"
    ) {
      const issues = qaBook(book);
      if (issues.length) fail(issues.join(" "), 409);
      for (const p of book.pages) {
        const lesson = await forgeLessonSnapshot(
          c.env.DB,
          c.get("user").family_id,
          book,
          p,
        );
        if (!lesson || lesson !== p.lessonSnapshot)
          fail(
            "A linked lesson changed. Unlock, review and lock its page again.",
            409,
          );
      }
      if (action === "render") {
        const limit = await hitRateLimit(
          c.env.DB,
          `forge-pdf:${c.get("user").id}`,
          30,
          86400,
        );
        if (!limit.ok) fail("Daily limit of 30 PDF generations reached.", 429);
        if (
          !c.env.BUCKET ||
          !(
            typeof c.env.BROWSER?.quickAction === "function" ||
            (c.env.BOOK_FORGE_CF_ACCOUNT_ID && c.env.BOOK_FORGE_CF_API_TOKEN)
          )
        )
          fail(
            "PDF rendering is not connected. Configure the Book Forge Cloudflare account ID and Browser Rendering API token.",
            503,
          );
        const html = renderBook(book, await images(c.env, book));
        if (html.length > 18000000)
          fail(
            "This book has too much artwork for one export. Split it into smaller volumes.",
          );
        const options = {
          html,
          pdfOptions: {
            format: "a4",
            printBackground: true,
            preferCSSPageSize: true,
          },
          waitForTimeout: 1000,
        };
        const response =
          typeof c.env.BROWSER?.quickAction === "function"
            ? await c.env.BROWSER.quickAction("pdf", options)
            : await fetch(
                `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(c.env.BOOK_FORGE_CF_ACCOUNT_ID!)}/browser-rendering/pdf`,
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${c.env.BOOK_FORGE_CF_API_TOKEN}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(options),
                  signal: AbortSignal.timeout(90000),
                },
              );
        if (!response.ok)
          fail(
            "Cloudflare could not render the PDF. Check the connection and retry.",
            502,
          );
        const pdf = await response.arrayBuffer();
        if (
          pdf.byteLength > 25000000 ||
          new TextDecoder().decode(pdf.slice(0, 5)) !== "%PDF-"
        )
          fail("The renderer did not return a valid PDF.", 502);
        book.pdf = `book-forge/${r.id}/pdf/${crypto.randomUUID()}.pdf`;
        await c.env.BUCKET.put(book.pdf, pdf, {
          httpMetadata: { contentType: "application/pdf" },
        });
        delete book.approved;
      } else {
        if (!book.pdf || !(await c.env.BUCKET?.head(book.pdf)))
          fail("Generate and inspect the current PDF first.", 409);
        if (action === "approve") {
          if (b.reviewed !== true)
            fail(
              "Confirm that you checked the PDF, artwork, content and lesson alignment.",
            );
          book.approved = true;
        } else {
          if (!book.approved)
            fail("Approve the current PDF before publishing.", 409);
          if (book.releases.some((x) => x.key === book.pdf))
            return c.json({ id: r.id, revision: r.revision, book });
          await ensureShopCatalog(c.env.DB);
          const productId = book.pdf.split("/").pop()!.replace(".pdf", "");
          const pdf = await c.env.BUCKET!.get(book.pdf);
          if (!pdf) fail("PDF not found.", 404);
          await c.env.BUCKET!.put(`shop/products/${productId}/file`, pdf.body, {
            httpMetadata: { contentType: "application/pdf" },
            customMetadata: { name: "side-quest-book.pdf" },
          });
          book.releases.push({
            key: book.pdf,
            title: book.title,
            revision: r.revision,
            date: new Date().toISOString(),
            productId,
          });
        }
      }
    } else fail("Unknown action.", 404);
    return save(c, r, book, action);
  });
  app.get("/:id/preview", async (c) => {
    const r = await load(c);
    return c.json({ html: renderBook(r.book, await images(c.env, r.book)) });
  });
  app.get("/:id/pdf", async (c) => {
    const r = await load(c);
    const release = c.req.query("release");
    const key = release
      ? r.book.releases.find((x: any) => x.key === release)?.key
      : r.book.pdf;
    if (!key) fail("PDF not found.", 404);
    const obj = await c.env.BUCKET?.get(key);
    if (!obj) fail("PDF not found.", 404);
    return new Response(obj.body, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="side-quest-book.pdf"',
        "Cache-Control": "no-store",
      },
    });
  });
  return app;
}
