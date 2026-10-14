// Educational video discovery through the official YouTube Data API v3. Runs on the server, completely separate from
// the language model: the model never supplies, and is never trusted for, a link.
// Only videos the API itself reports as public, embeddable and not age-restricted are ever returned.
// A high search rank is NOT treated as proof that a video is accurate; the parent approves every video.
import * as lb from "./lessonBuilder";

type DB = D1Database;
type Fetch = (url: string) => Promise<{ ok: boolean; status: number; json(): Promise<any> }>;

export const YT_LIMITS = { familyPerDay: 8, globalPerDay: 70, cacheDays: 14, resultsPerSearch: 12, returned: 4 };

/** Channels that reliably publish clear, curriculum-style explanations. A preference only: it never overrides the safety filters. */
export const PREFERRED_CHANNELS = [
  "khan academy", "khanacademy", "bbc bitesize", "bbc learning", "ted-ed", "crashcourse", "crash course", "nasa", "national geographic", "nat geo kids",
  "scishow kids", "scishow", "minutephysics", "numberphile", "organic chemistry tutor", "the organic chemistry tutor", "mathantics", "math antics",
  "mashup math", "maths with mrs", "learn bright", "homeschool pop", "free school", "storyline online", "cosmic kids", "peekaboo kidz", "twinkl",
  "abc education", "abc kids", "behind the news", "sick science", "mark rober", "kurzgesagt", "amoeba sisters", "stated clearly", "nasa kids club",
  "national geographic kids", "smithsonian", "royal institution", "ck-12", "ck12", "professor dave explains", "the royal society", "esa kids",
];

const STOP = new Set(["the", "a", "an", "of", "and", "to", "in", "for", "with", "on", "is", "are", "how", "what", "why", "your", "you", "year", "lesson", "introduction", "intro"]);
const tokens = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));

export type Video = {
  video_id: string; title: string; channel: string; description: string; duration_seconds: number; thumbnail: string;
  url: string; embed_url: string; embeddable: true; purpose: string; score: number; reason: string;
};

export type Wanted = { title: string; subject: string; year: string; objective: string; focus: string };

export function wantedFromLesson(l: any): Wanted {
  const first = (v: unknown) => (Array.isArray(v) ? String(v[0] ?? "") : String(v ?? ""));
  return { title: String(l?.title ?? ""), subject: String(l?.learning_area ?? ""), year: String(l?.year_level ?? ""), objective: first(l?.objectives), focus: String(l?.sections?.[0]?.heading ?? "") };
}

/** A short, focused search phrase. Kid-appropriate and explanatory, never the whole lesson text. */
export function buildQuery(w: Wanted, purpose: string): string {
  const topic = (w.title || w.objective).replace(/\b(lesson|introduction to|intro to|year\s*\d+)\b/gi, " ").replace(/\s+/g, " ").trim().slice(0, 70);
  const level = w.year && /\d/.test(w.year) ? `year ${w.year.replace(/\D+/g, " ").trim().split(" ")[0]}` : "";
  const tail = purpose === "demo" ? "worked example" : purpose === "extension" ? "explained for kids" : purpose === "intro" ? "introduction for kids" : "explained for students";
  return [topic, w.subject && !topic.toLowerCase().includes(w.subject.toLowerCase()) ? w.subject : "", level, tail].filter(Boolean).join(" ").slice(0, 120);
}

export function parseDuration(iso: string): number {
  const m = /^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso || "");
  if (!m) return 0;
  return (Number(m[1] || 0) * 86400) + (Number(m[2] || 0) * 3600) + (Number(m[3] || 0) * 60) + Number(m[4] || 0);
}

const BAD = /\b(reaction|prank|shorts?|asmr|compilation|full movie|livestream|live stream|gameplay|vlog|unboxing|music video|official video|trailer|nsfw)\b/i;

/** Pure scoring so it can be tested: reputable channel, title overlap with what we want, a watchable length. */
export function scoreVideo(v: { title: string; channel: string; description: string; duration_seconds: number }, w: Wanted): { score: number; reason: string } {
  const want = new Set([...tokens(w.title), ...tokens(w.objective), ...tokens(w.focus)]);
  const hay = new Set([...tokens(v.title), ...tokens(v.description.slice(0, 300))]);
  const titleHay = new Set(tokens(v.title));
  let overlap = 0, titleOverlap = 0;
  want.forEach((t) => { if (hay.has(t)) overlap++; if (titleHay.has(t)) titleOverlap++; });
  const reasons: string[] = [];
  let score = want.size ? (overlap / want.size) * 40 + (titleOverlap / want.size) * 25 : 0;
  const ch = v.channel.toLowerCase();
  if (PREFERRED_CHANNELS.some((p) => ch.includes(p))) { score += 25; reasons.push("from an established educational channel"); }
  const mins = v.duration_seconds / 60;
  if (mins >= 2 && mins <= 10) { score += 15; reasons.push(`${Math.round(mins)} minute${Math.round(mins) === 1 ? "" : "s"} long`); }
  else if (mins > 10 && mins <= 15) score += 6;
  else if (mins < 1 || mins > 25) score -= 30;
  if (BAD.test(v.title)) score -= 40;
  if (titleOverlap > 0) reasons.push("matches the lesson topic");
  return { score: Math.round(score), reason: reasons.join(", ") };
}

type Env = { YOUTUBE_API_KEY?: string };
export const youtubeConfigured = (env: Env) => typeof env.YOUTUBE_API_KEY === "string" && env.YOUTUBE_API_KEY.length > 10;

async function cacheGet(db: DB, key: string, now: Date): Promise<Video[] | null> {
  try {
    const r = await db.prepare("SELECT payload, created_at FROM resource_cache WHERE cache_key = ?").bind(key).first<any>();
    if (!r || now.getTime() - new Date(r.created_at).getTime() > YT_LIMITS.cacheDays * 86400000) return null;
    return JSON.parse(r.payload);
  } catch { return null; } // table not created yet: just search
}
async function cachePut(db: DB, key: string, v: Video[], now: Date) {
  try { await db.prepare("INSERT OR REPLACE INTO resource_cache (cache_key, payload, created_at) VALUES (?, ?, ?)").bind(key, JSON.stringify(v), now.toISOString()).run(); } catch { /* optional */ }
}

async function countToday(db: DB, now: Date, familyId?: string): Promise<number> {
  const since = new Date(now.getTime() - 86400000).toISOString();
  try {
    const q = familyId ? db.prepare("SELECT COUNT(*) n FROM ai_usage WHERE kind = 'yt_search' AND status != 'failed' AND family_id = ? AND created_at >= ?").bind(familyId, since) : db.prepare("SELECT COUNT(*) n FROM ai_usage WHERE kind = 'yt_search' AND status != 'failed' AND created_at >= ?").bind(since);
    return Number((await q.first<{ n: number }>())?.n ?? 0);
  } catch { return 0; }
}

const SEARCH = "https://www.googleapis.com/youtube/v3/search";
const VIDEOS = "https://www.googleapis.com/youtube/v3/videos";
const thumbFor = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

/** One search.list call (100 quota units) + one videos.list call (1 unit) for details and the embeddable / age checks. */
export async function searchYoutube(key: string, query: string, w: Wanted, purpose: string, fetchImpl: Fetch): Promise<Video[]> {
  const sp = new URLSearchParams({ part: "snippet", type: "video", q: query, maxResults: String(YT_LIMITS.resultsPerSearch), safeSearch: "strict", videoEmbeddable: "true", videoSyndicated: "true", relevanceLanguage: "en", regionCode: "AU", key });
  const s = await fetchImpl(`${SEARCH}?${sp}`);
  if (!s.ok) throw new Error(`YouTube search failed (${s.status})`);
  const ids: string[] = ((await s.json()).items ?? []).map((i: any) => i?.id?.videoId).filter((x: unknown) => typeof x === "string" && /^[A-Za-z0-9_-]{6,20}$/.test(x as string));
  if (!ids.length) return [];
  const vp = new URLSearchParams({ part: "snippet,contentDetails,status", id: ids.join(","), key });
  const d = await fetchImpl(`${VIDEOS}?${vp}`);
  if (!d.ok) throw new Error(`YouTube details failed (${d.status})`);
  const out: Video[] = [];
  for (const it of (await d.json()).items ?? []) {
    const id = String(it.id || "");
    if (!/^[A-Za-z0-9_-]{6,20}$/.test(id)) continue;
    if (it.status?.embeddable !== true || it.status?.privacyStatus !== "public" || it.status?.uploadStatus === "rejected" || it.status?.uploadStatus === "failed") continue;
    if (it.contentDetails?.contentRating?.ytRating === "ytAgeRestricted") continue;
    if (it.contentDetails?.regionRestriction?.blocked?.includes("AU")) continue;
    const allowed = it.contentDetails?.regionRestriction?.allowed;
    if (Array.isArray(allowed) && !allowed.includes("AU")) continue;
    if (it.snippet?.liveBroadcastContent && it.snippet.liveBroadcastContent !== "none") continue;
    const v = {
      title: String(it.snippet?.title ?? "").slice(0, 160), channel: String(it.snippet?.channelTitle ?? "").slice(0, 100),
      description: String(it.snippet?.description ?? "").replace(/https?:\/\/\S+/g, "").replace(/\s+/g, " ").trim().slice(0, 280),
      duration_seconds: parseDuration(String(it.contentDetails?.duration ?? "")),
    };
    if (!v.title || v.duration_seconds < 45) continue;
    const sc = scoreVideo(v, w);
    out.push({ ...v, video_id: id, thumbnail: thumbFor(id), url: `https://www.youtube.com/watch?v=${id}`, embed_url: `https://www.youtube-nocookie.com/embed/${id}`, embeddable: true, purpose, score: sc.score, reason: sc.reason });
  }
  return out.filter((v) => v.score > 5).sort((a, b) => b.score - a.score).slice(0, YT_LIMITS.returned);
}

export async function resourceStatus(env: Env, db: DB, familyId: string, now: Date = new Date()) {
  return { configured: youtubeConfigured(env), searches_left_today: Math.max(0, YT_LIMITS.familyPerDay - (await countToday(db, now, familyId))) };
}

/** Suggest videos for a lesson the parent owns. Cached, rate-limited, and never needed for the lesson to work. */
export async function suggestForLesson(
  env: Env, db: DB, user: { id: string; family_id: string },
  body: { lesson_id?: unknown; purpose?: unknown; query?: unknown; fresh?: unknown },
  fetchImpl: Fetch = (u) => fetch(u) as any, now: Date = new Date()
): Promise<lb.Result<{ videos: Video[]; cached: boolean; query: string; searches_left_today: number }>> {
  if (!youtubeConfigured(env)) return lb.fail(503, "Video suggestions are not switched on yet. You can still paste a YouTube link yourself.", "YT_UNAVAILABLE");
  const row = await db.prepare("SELECT * FROM lessons WHERE id = ? AND family_id = ?").bind(String(body.lesson_id ?? ""), user.family_id).first<any>();
  if (!row) return lb.fail(404, "Lesson not found");
  const lesson: any = lb.lessonOut(row);
  const purpose = ["intro", "explain", "demo", "extension"].includes(String(body.purpose)) ? String(body.purpose) : "explain";
  const w = wantedFromLesson(lesson);
  const custom = typeof body.query === "string" ? body.query.replace(/[^\p{L}\p{N}\s'’-]/gu, " ").replace(/\s+/g, " ").trim().slice(0, 100) : "";
  const query = custom.length >= 3 ? custom : buildQuery(w, purpose);
  const key = `yt:${query.toLowerCase()}`;
  const left = async () => Math.max(0, YT_LIMITS.familyPerDay - (await countToday(db, now, user.family_id)));
  if (body.fresh !== true || !custom) {
    const hit = await cacheGet(db, key, now);
    if (hit) return { ok: true, videos: hit, cached: true, query, searches_left_today: await left() };
  }
  if ((await left()) <= 0) return lb.fail(429, "You have used today's video searches. Try again tomorrow, or paste a YouTube link yourself.", "YT_QUOTA");
  if ((await countToday(db, now)) >= YT_LIMITS.globalPerDay) return lb.fail(429, "Video search is busy right now. Try again tomorrow, or paste a YouTube link yourself.", "YT_QUOTA");
  const id = crypto.randomUUID();
  await db.prepare("INSERT INTO ai_usage (id, family_id, user_id, kind, status, created_at) VALUES (?, ?, ?, 'yt_search', 'pending', ?)").bind(id, user.family_id, user.id, now.toISOString()).run();
  const mark = (s: string) => db.prepare("UPDATE ai_usage SET status = ? WHERE id = ?").bind(s, id).run();
  try {
    const videos = await searchYoutube(env.YOUTUBE_API_KEY as string, query, w, purpose, fetchImpl);
    await mark("ok");
    await cachePut(db, key, videos, now);
    return { ok: true, videos, cached: false, query, searches_left_today: await left() };
  } catch (e) {
    await mark("failed");
    return lb.fail(502, "Could not reach YouTube just now. Your lesson is fine without a video. Try again later.", "YT_FAILED");
  }
}

/** A parent's own YouTube link: check it with YouTube's keyless oEmbed endpoint, which only answers for embeddable public videos. */
export async function verifyLink(url: unknown, fetchImpl: Fetch = (u) => fetch(u) as any): Promise<lb.Result<{ video: Omit<Video, "score" | "reason"> & { source: "parent" } }>> {
  const embed = typeof url === "string" ? lb.embedUrlFor(url.trim()) : null;
  const id = embed ? /embed\/([A-Za-z0-9_-]+)/.exec(embed)?.[1] : null;
  if (!embed || !id || !embed.includes("youtube-nocookie.com")) return lb.fail(400, "That does not look like a YouTube link. Paste the address of the video.", "BAD_LINK");
  const watch = `https://www.youtube.com/watch?v=${id}`;
  let title = "", channel = "";
  try {
    const r = await fetchImpl(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(watch)}`);
    if (r.status === 401 || r.status === 403) return lb.fail(422, "That video cannot be played inside other websites, so it cannot be added here.", "NOT_EMBEDDABLE");
    if (r.status === 404) return lb.fail(404, "YouTube could not find that video. Check the link.", "NOT_FOUND");
    if (r.ok) { const j = await r.json(); title = String(j.title ?? "").slice(0, 160); channel = String(j.author_name ?? "").slice(0, 100); }
  } catch { /* could not check: fall through and say so */ }
  return { ok: true, video: { video_id: id, title: title || "YouTube video", channel, description: "", duration_seconds: 0, thumbnail: thumbFor(id), url: watch, embed_url: embed, embeddable: true, purpose: "explain", source: "parent" } };
}
