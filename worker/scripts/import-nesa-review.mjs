// Discover ALL NSW syllabus offerings from NESA's three official stage indexes.
// Keep legacy, future, electives, CEC, Life Skills, Extension and VET courses in the
// syllabus inventory. Extract candidate identifiers only from direct official
// outcomes pages, NEVER invent a code and NEVER auto-replace existing child evidence.
// This is a review-only source import, not a certified complete NSW catalogue.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const BASE = "https://curriculum.nsw.edu.au";
export const INDEXES = [
  ["primary", BASE + "/stages/primary"],
  ["secondary", BASE + "/stages/secondary"],
  ["senior", BASE + "/stages/senior"],
];
const clean = (s) => String(s ?? "").replace(/<[^>]*>/g, " ")
  .replace(/&(?:amp|nbsp|quot|lt|gt);/g, (t) => ({ "&amp;": "&", "&nbsp;": " ", "&quot;": '"', "&lt;": "<", "&gt;": ">" })[t])
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/\s+/g, " ").trim();

export function extractIndex(html, stage, url) {
  const rows = [];
  const anchors = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  for (const m of html.matchAll(anchors)) {
    let target;
    try { target = new URL(m[1].replace(/&amp;/g, "&"), url); } catch { continue; }
    const domain = target.hostname.toLowerCase();
    if (domain !== "curriculum.nsw.edu.au" && domain !== "www.nsw.gov.au" && domain !== "educationstandards.nsw.edu.au") continue;
    if (domain === "curriculum.nsw.edu.au" && !/^\/learning-areas\/.+\/(overview|outcomes)$/.test(target.pathname)) continue;
    const title = clean(m[2]);
    // Syllabus indexes also contain sitewide navigation and links to generic pages.
    if (!/(?:K.?10|K.?6|7.?10|11.?12|Stage\s*6|[Cc]ontinuers|[Ee]xtension|[Bb]eginners|Life Skills|VET|[Ss]tudies|[Tt]echnology|[Cc]eramics|[Ww]ork\s*[Ee]ducation|[Nn]umeracy)/i.test(title)) continue;
    if (title.length < 8 || title.length > 190) continue;
    // A title is the authority's own syllabus/course label; no invented subject IDs.
    const slug = domain === "curriculum.nsw.edu.au" ? target.pathname.replace(/\/(?:overview|outcomes)$/, "") : null;
    // Status labels in the stage index: classification is NOT guessed from release year.
    const nearby = clean(html.slice(m.index + m[0].length).split(/<a\b|Current syllabus|New syllabus/i)[0].slice(0, 260));
    const upcoming = /\bNew from\s+(20\d{2})\b/i.exec(nearby);
    const current = /\bTeach in\b/i.test(nearby);
    const outgoing = /\bOutgoing\b/i.test(nearby);
    rows.push({
      title, source_stage: stage, listing_url: url, official_url: target.href,
      syllabus_path: slug, outcomes_url: slug ? BASE + slug + "/outcomes" : null,
      version_year: Number(/\((20\d{2}|19\d{2})\)\s*$/.exec(title)?.[1] || 0) || null,
      listed_as: upcoming ? "upcoming" : current ? "current" : outgoing ? "outgoing" : "not_classified",
      applicable_from: upcoming ? Number(upcoming[1]) : null,
      likely_kind: /\bVET\b/i.test(title) ? "vet" : /Life Skills/i.test(title) ? "life_skills" : /\bExtension\b/i.test(title) ? "extension" : /\bCEC\b/i.test(title) ? "cec" : "syllabus",
    });
  }
  return rows;
}

const CODE = /^([A-Z]{2,9}[A-Z0-9]*-(?:[A-Z0-9]{1,10}-)?\d{1,3}[A-Z]?)(?=\s|$)/;
/** Only assign a stage if the published identifier encodes it.
 * NESA's HTML often prints several stage tabs before the outcome codes,
 * so "nearest preceding Stage 2" would incorrectly classify all outcomes as S2.
 */
export function inferStageFromCode(code, syllabusTitle = "") {
  // Senior subject names take precedence over Extension 1 / 2 outcome suffixes.
  if (/(?:11\s*[-–]\s*12|Stage\s*6)/i.test(syllabusTitle)) return "S6";
  const legacyOrNew = /^[A-Z]{2,6}?([eE1-5])-/i.exec(code);
  if (legacyOrNew) return /^[eE]$/.test(legacyOrNew[1]) ? "ES1" : "S" + legacyOrNew[1];
  if (/(?:11|12)-/.test(code)) return "S6";
  return null;
}

export function extractCodes(html, source, syllabusTitle = "") {
  // Discard scripts/style: hidden framework payloads may contain navigation links
  // rather than the selected syllabus's outcome list.
  const t = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<\/(?:h[1-6]|p|li|section|div|dt|dd|tr|td|span)>/gi, "\n")
    .replace(/<[^>]+>/g, " ").split(/\n/).map(clean);
  const start = t.findIndex((line) => /^Outcomes$/i.test(line));
  if (start < 0) return [];
  const seen = new Set();
  const codes = [];
  let stage = null;
  for (const line of t.slice(start + 1)) {
    if (/^Early Stage 1$/i.test(line)) stage = "ES1";
    else if (/^Stage ([1-6])$/i.test(line)) stage = "S" + RegExp.$1;
    else if (/^(?:Year|Years) (11|12)(?:.?12)?$/i.test(line)) stage = "S6";
    if (line.length > 95) continue; // outcome code labels, not descriptions
    const match = CODE.exec(line);
    if (!match || seen.has(match[1])) continue;
    seen.add(match[1]);
    codes.push({ code: match[1], stage_hint: inferStageFromCode(match[1], syllabusTitle), page_stage_context: stage, official_outcomes_url: source, identifier_kind: "nesa_syllabus_outcome", status: "extracted_pending_completeness_check" });
  }
  return codes;
}

async function get(url) {
  const res = await fetch(url, { headers: { "user-agent": "SideQuestCurriculumResearch/1.0 (curriculum code source verification; contact via official repo)", accept: "text/html" }, redirect: "follow", signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error("HTTP " + res.status + " " + url);
  const html = await res.text();
  if (html.length < 4000) throw new Error("Unexpectedly short response " + url);
  return html;
}

async function main() {
  const all = [];
  for (const [stage, url] of INDEXES) {
    const rows = extractIndex(await get(url), stage, url);
    if (rows.length < 5) throw new Error("NESA stage index incomplete: " + stage + " only " + rows.length);
    console.log(stage + ": " + rows.length + " linked official syllabuses");
    all.push(...rows);
  }
  const manifest = new Map();
  for (const row of all) {
    const key = row.syllabus_path ?? row.official_url;
    if (!manifest.has(key)) manifest.set(key, { ...row, source_stages: [row.source_stage] });
    else {
      const prior = manifest.get(key);
      if (!prior.source_stages.includes(row.source_stage)) prior.source_stages.push(row.source_stage);
      if (prior.listed_as === "not_classified" && row.listed_as !== "not_classified") {
        prior.listed_as = row.listed_as;
        prior.applicable_from = row.applicable_from;
      }
    }
  }
  const inventory = [...manifest.values()].sort((a,b) => a.title.localeCompare(b.title));
  if (inventory.length < 50) throw new Error("Only " + inventory.length + " NSW syllabus links found. Refuse partial manifest.");
  const candidates = []; const failures = [];
  const eligible = inventory.filter(x => x.outcomes_url);
  let nextIndex = 0;
  // Limit concurrency and retain each source's failure; an inaccessible page
  // must never be quietly mistaken for a syllabus with no outcomes.
  await Promise.all(Array.from({ length: Math.min(4, eligible.length) }, async () => {
    while (nextIndex < eligible.length) {
      const index = nextIndex++;
      const row = eligible[index];
      try {
        const codes = extractCodes(await get(row.outcomes_url), row.outcomes_url, row.title);
        row.candidate_code_count = codes.length;
        for (const c of codes) candidates.push({ ...c, syllabus_title: row.title, syllabus_path: row.syllabus_path, version_year: row.version_year, listed_as: row.listed_as, source_stages: row.source_stages });
        if (!codes.length) failures.push({ syllabus: row.title, url: row.outcomes_url, reason: "No outcome identifiers extracted" });
      } catch(e) {
        row.candidate_code_count = 0;
        failures.push({ syllabus: row.title, url: row.outcomes_url, reason: String(e).slice(0,200) });
      }
      if ((index+1)%20===0) console.log("Inspected official outcome pages: " + (index+1) + "/" + eligible.length);
    }
  }));
  candidates.sort((a,b) => (a.syllabus_path+a.code).localeCompare(b.syllabus_path+b.code));

  const output = { source:"NESA official NSW Curriculum stage listings", extraction_date:new Date().toISOString().slice(0,10), complete:false, inventories:inventory, candidates, failures,
    summary:{ syllabus_versions:inventory.length, direct_outcomes_pages:eligible.length, candidate_outcomes:candidates.length, pages_with_no_codes_or_error:failures.length, senior:inventory.filter(x=>x.source_stages.includes("senior")).length } };
  const file = fileURLToPath(new URL("../src/data/nesa-review-import.json", import.meta.url));
  writeFileSync(file,JSON.stringify(output,null,2)+"\n");
  console.log("NESA SOURCE AUDIT: "+JSON.stringify(output.summary));
  if (failures.length) console.log("Incomplete source pages: "+JSON.stringify(failures.slice(0,15)));
  if (candidates.length < 30) throw new Error("NESA candidate extraction too small; manifest saved locally but do not commit as a complete catalogue.");
  console.log("Review-only import generated. DO NOT present as all NSW outcomes or merge into the active tracker without completeness and stage-version validation.");
}
if (process.argv[1] && fileURLToPath(import.meta.url) === fileURLToPath(new URL("file://" + process.argv[1]))) main().catch(e=>{console.error(e); process.exitCode=1;});
