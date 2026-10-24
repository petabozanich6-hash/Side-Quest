// Builds the printable Evidence Backpack record for a home education review in any Australian state or territory
// (a visit, a moderator meeting or a written report). It is organised the way a visitor reads it: who the child is and what period is covered, a summary of
// progress by learning area, the curriculum outcomes evidenced, then dated and annotated work samples in order
// within each learning area so progression over time is visible, and finally the parent's summary and declaration.

const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
const fmt = (d) => { if (!d) return ""; const t = new Date(d.length === 10 ? d + "T00:00:00" : d); return isNaN(t) ? esc(d) : t.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" }); };
const hours = (m) => (m ? `${Math.round((m / 60) * 10) / 10} h` : "");
const KIND = { lesson: "Lesson work", life: "Life learning", note: "Parent observation", reading: "Reading record" };

const CSS = `
  @page { size: A4; margin: 16mm 14mm; }
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #243a2d; max-width: 760px; margin: 24px auto; padding: 0 18px; font-size: 13px; line-height: 1.45; }
  h1 { font-size: 26px; color: #1F3B2D; margin: 0 0 5px; } h2 { font-size: 18px; color: #1F3B2D; margin: 26px 0 8px; border-left: 4px solid #C77B5B; border-bottom: 1px solid #C8D3BF; padding: 2px 0 7px 10px; }
  h2, h3 { break-after: avoid; } h3 { font-size: 15px; margin: 18px 0 6px; } h4 { font-size: 12px; margin: 8px 0 2px; text-transform: uppercase; letter-spacing: .04em; color: #444; }
  table { width: 100%; border-collapse: collapse; margin: 6px 0; } th, td { border: 1px solid #bbb; padding: 4px 6px; text-align: left; vertical-align: top; font-size: 12px; }
  th { background: #EFF3EA; color: #1F3B2D; } .muted { color: #555; font-size: 12px; } .gap { color: #8a4b00; font-weight: bold; }
  .meta td:first-child { width: 32%; font-weight: bold; background: #F5F7F1; }
  .entry { break-inside: avoid; border: 1px solid #B7C7B0; border-left: 3px solid #4A5D3A; border-radius: 5px; padding: 10px 12px; margin: 10px 0; }
  .entry .head { display: flex; justify-content: space-between; gap: 12px; } .entry .title { font-weight: bold; font-size: 14px; }
  .tag { display: inline-block; border: 1px solid #999; border-radius: 10px; padding: 0 7px; font-size: 11px; margin: 2px 4px 2px 0; }
  .ach { border-color: #2e7d32; color: #1b5e20; } .wt { border-color: #b26a00; color: #7a4800; }
  .pre { white-space: pre-wrap; } .imgs { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; } .imgs img { max-width: 48%; max-height: 260px; border: 1px solid #ccc; }
  .lines { border-bottom: 1px solid #999; height: 24px; } .sig td { border: none; padding: 18px 6px 0 0; } .sig .line { border-bottom: 1px solid #111; height: 22px; }
  .banner { background: #fff7e0; border: 1px solid #e6c96b; padding: 8px; font-size: 12px; margin: 8px 0; }
  .pb { break-before: page; }
  .bar { display: flex; height: 10px; width: 100%; border: 1px solid #999; border-radius: 2px; overflow: hidden; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .bar span { display: block; height: 100%; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .s-achieved { background: #1f3b2d; } .s-prior_learning { background: #818cf8; } .s-demonstrated { background: #4a7c59; } .s-developing { background: #9dbf9e; } .s-introduced { background: #d9e5d6; }
  .key span { display: inline-block; width: 10px; height: 10px; border: 1px solid #777; margin: 0 3px 0 10px; vertical-align: middle; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .num { text-align: right; white-space: nowrap; }
  @media print { body { margin: 0; } .noprint { display: none; } th, .meta td:first-child { background: #f3f3f3; } h1, h2 { color: #243a2d; } thead { display: table-header-group; } tr { break-inside: avoid; } }
`;

// Outcome Tracker statuses. "Achieved" here always means the parent confirmed it in the tracker.
const MASTERY = { not_started: "Not started", introduced: "Introduced", developing: "Developing", demonstrated: "Demonstrated", prior_learning: "Prior learning (met before Side-Quest, parent recognised)", achieved: "Achieved (parent confirmed)" };
const BAR_ORDER = ["achieved", "prior_learning", "demonstrated", "developing", "introduced"];
const GAP_TEXT = { limited_evidence: "limited evidence", not_revisited: "not revisited", needs_consolidation: "needs consolidation", confirmed_evidence_changed: "evidence changed since confirmed" };
// Per piece of work: what the parent judged at review. Older records may say "achieved", which meant the same thing.
const shownIn = (o) => o.status === "shown" || o.status === "achieved";

function outcomeTags(outcomes) {
  if (!outcomes?.length) return "";
  return `<div>${outcomes.map((o) => `<span class="tag ${shownIn(o) ? "ach" : "wt"}">${esc(o.code || o.description.slice(0, 60))} · ${shownIn(o) ? "understanding shown" : "practised"}</span>`).join("")}</div>`;
}

function bar(counts, total) {
  if (!total) return '<div class="bar"></div>';
  return `<div class="bar">${BAR_ORDER.map((k) => (counts[k] ? `<span class="s-${k}" style="width:${(100 * counts[k]) / total}%"></span>` : "")).join("")}</div>`;
}

/** All-time Outcome Tracker snapshot: distribution by status, per learning area, and where more evidence is needed. */
function progressSection(p) {
  const pr = p.progress;
  if (!pr) return "";
  if (!pr.available) return `<p class="banner">${esc(pr.note || "The Outcome Tracker is not available for this curriculum.")}</p>`;
  const t = pr.totals;
  const key = `<p class="key muted">${BAR_ORDER.map((k) => `<span class="s-${k}"></span>${esc(MASTERY[k])}`).join("")}<span></span>Not started</p>`;
  const rows = pr.areas.map((a) => `<tr><td>${esc(a.learning_area)}</td><td class="num">${a.total}</td>${["introduced", "developing", "demonstrated", "prior_learning", "achieved"].map((k) => `<td class="num">${a.counts[k] || 0}</td>`).join("")}<td class="num">${a.total - a.with_evidence}</td><td style="width:22%">${bar(a.counts, a.total)}</td></tr>`).join("");
  const needs = pr.needs_evidence || [];
  const needsByArea = new Map();
  for (const n of needs) { if (!needsByArea.has(n.learning_area)) needsByArea.set(n.learning_area, []); needsByArea.get(n.learning_area).push(n); }
  return `
  <p class="muted">All-time snapshot as at ${fmt(pr.as_at)}, for the outcomes ${esc(p.student.name)} is covering in the ${esc(pr.framework || p.framework)}: ${esc(pr.program?.level || "their level")}${pr.program?.areas ? `, ${esc(pr.program.courses.map((c) => c.name).join(", "))}` : ", all learning areas"} (from the child's profile). Unlike the dated entries later in this record, it is not limited to the reporting period. Statuses follow Side-Quest's evidence guidelines (two pieces of reviewed work showing understanding on separate days, or one comprehensive assessment, for Demonstrated); only the parent can confirm Achieved. These are not official curriculum-authority standards.</p>
  <table><tr><th>Overall</th><th class="num">Outcomes</th><th class="num">Introduced</th><th class="num">Developing</th><th class="num">Demonstrated</th><th class="num">Prior learning</th><th class="num">Achieved</th><th class="num">No evidence yet</th><th>Distribution</th></tr>
    <tr><td><strong>All learning areas</strong></td><td class="num">${t.total}</td>${["introduced", "developing", "demonstrated", "prior_learning", "achieved"].map((k) => `<td class="num"><strong>${t.counts[k] || 0}</strong></td>`).join("")}<td class="num">${t.total - t.with_evidence}</td><td>${bar(t.counts, t.total)}</td></tr>
    ${rows}</table>
  ${key}
  ${(pr.unsupported || []).length ? `<p class="muted">Not tracked (no verified outcome list held by Side-Quest): ${pr.unsupported.map(esc).join(", ")}. Evidence for these subjects still appears in the dated entries below.</p>` : ""}
  ${t.awaiting_confirmation ? `<p class="muted">${t.awaiting_confirmation} outcome${t.awaiting_confirmation === 1 ? " meets" : "s meet"} the Demonstrated guideline and ${t.awaiting_confirmation === 1 ? "is" : "are"} awaiting the parent's confirmation.</p>` : ""}
  ${pr.beyond_stage ? `<p class="muted">Evidence is also recorded against ${pr.beyond_stage} outcome${pr.beyond_stage === 1 ? "" : "s"} outside this program (another year level or subject).</p>` : ""}
  <h3>Areas needing further evidence</h3>
  ${needs.length ? `<table><tr><th style="width:28%">Learning area</th><th>Outcome codes (status · reason)</th></tr>${[...needsByArea.entries()].map(([area, list]) => `<tr><td>${esc(area)}</td><td>${list.map((n) => `${esc(n.code)} (${esc(MASTERY[n.status] || n.status)} · ${n.gaps.map((g) => esc(GAP_TEXT[g] || g)).join(", ")})`).join("; ")}</td></tr>`).join("")}</table>` : '<p class="muted">No outcome with evidence is flagged as needing more evidence.</p>'}`;
}

function entryHtml(e, images) {
  const imgs = (e.files || []).filter((f) => images[f.id]);
  const others = (e.files || []).filter((f) => !images[f.id]);
  const block = (label, text) => (text ? `<h4>${label}</h4><div class="pre">${esc(text)}</div>` : "");
  return `<div class="entry">
    <div class="head"><div class="title">${esc(e.title)}</div><div class="muted">${fmt(e.date)}</div></div>
    <div class="muted">${esc([KIND[e.kind], e.subject && e.subject !== e.learning_area ? e.subject : "", e.year_level, e.result, e.duration_minutes ? `${e.duration_minutes} min` : "", e.location].filter(Boolean).join(" · "))}</div>
    ${outcomeTags(e.outcomes)}
    ${(e.outcomes || []).some((o) => !o.code && o.description) ? `<div class="muted" style="margin-top:4px">${e.outcomes.filter((o) => !o.code && o.description).map((o) => esc(o.description)).join("<br>")}</div>` : ""}
    ${block(e.kind === "lesson" ? "Child's work" : e.kind === "life" ? "What happened" : e.kind === "reading" ? "Reading details" : "Parent's notes", e.work)}
    ${block("Child's reflection", e.reflection)}
    ${block("Parent annotation", e.parent_comment)}
    ${e.next_step ? `<p style="margin:6px 0 0"><strong>Next step:</strong> ${esc(e.next_step)}</p>` : ""}
    ${imgs.length ? `<div class="imgs">${imgs.map((f) => `<img src="${images[f.id]}" alt="${esc(f.name)}">`).join("")}</div>` : ""}
    ${others.length ? `<p class="muted" style="margin:6px 0 0">Attached files (kept in Side Quest): ${others.map((f) => esc(f.name)).join(", ")}</p>` : ""}
  </div>`;
}

/**
 * @param p      portfolio from GET /api/portfolio
 * @param extra  { summary, advancement, attention } parent's own words (optional), images { fileId: dataUrl }
 */
export function portfolioHtml(p, extra = {}) {
  const images = extra.images || {};
  const s = p.summary || { areas: [], outcomes: [], not_yet_evidenced: [] };
  const period = p.from || p.to ? `${p.from ? fmt(p.from) : "Start of records"} to ${p.to ? fmt(p.to) : fmt(p.generated_at)}` : p.first_entry ? `${fmt(p.first_entry)} to ${fmt(p.last_entry)}` : "No entries yet";
  const areaRows = s.areas.map((a) => `<tr>
    <td>${esc(a.learning_area)}${a.expected ? "" : ' <span class="muted">(additional)</span>'}</td>
    <td>${a.entries || (a.expected ? '<span class="gap">None recorded</span>' : "0")}</td>
    <td>${a.first ? `${fmt(a.first)} – ${fmt(a.latest)}` : "—"}</td>
    <td>${esc(Object.entries(a.by_kind || {}).map(([k, n]) => `${n} ${(KIND[k] || k).toLowerCase()}`).join(", ")) || "—"}</td>
    <td class="num">${(a.outcomes_shown ?? a.outcomes_achieved ?? 0) || "—"}</td><td class="num">${a.outcomes_working_towards || "—"}</td><td>${hours(a.minutes) || "—"}</td></tr>`).join("");

  const byArea = new Map();
  for (const o of s.outcomes) { if (!byArea.has(o.learning_area)) byArea.set(o.learning_area, []); byArea.get(o.learning_area).push(o); }
  const outcomeTables = [...byArea.entries()].map(([area, list]) => `<h3>${esc(area)}</h3>
    <table><tr><th style="width:20%">Outcome code</th><th style="width:24%">In this period</th><th style="width:24%">Overall status (all time)</th><th style="width:10%" class="num">Samples</th><th>Evidence dated</th></tr>
    ${list.map((o) => `<tr><td>${esc(o.code) || esc(o.description) || "—"}</td><td>${shownIn(o) ? "Understanding shown" : "Practised"}</td><td>${o.mastery ? esc(MASTERY[o.mastery] || o.mastery) : o.code ? "—" : "Not tracked (no official code)"}</td><td class="num">${o.times}</td><td>${o.first === o.latest ? fmt(o.first) : `${fmt(o.first)} – ${fmt(o.latest)}`}</td></tr>`).join("")}</table>`).join("");

  const groups = new Map();
  for (const e of p.entries || []) { if (!groups.has(e.learning_area)) groups.set(e.learning_area, []); groups.get(e.learning_area).push(e); }
  const order = [...(p.expected_areas || []), ...[...groups.keys()].filter((k) => !(p.expected_areas || []).includes(k))];
  const progression = order.filter((a) => groups.has(a)).map((a) => {
    const list = groups.get(a);
    return `<h3>${esc(a)} <span class="muted">(${list.length} ${list.length === 1 ? "sample" : "samples"}, earliest first)</span></h3>${list.map((e) => entryHtml(e, images)).join("")}`;
  }).join("");

  const parentBox = (label, text) => `<h4>${label}</h4>${text?.trim() ? `<div class="pre">${esc(text)}</div>` : '<div class="lines"></div><div class="lines"></div><div class="lines"></div>'}`;
  const gaps = s.not_yet_evidenced || [];
  const ow = p.jurisdiction === "NSW" ? "syllabus" : "curriculum";

  return `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><title>${esc(p.student.name)} – record of learning and progress</title><style>${CSS}</style></head><body>
  <h1>Record of learning and progress</h1>
  <p class="muted">Home education learning record kept by the parent and generated from Side Quest.</p>
  <table class="meta">
    <tr><td>Child</td><td>${esc(p.student.name)}</td></tr>
    <tr><td>${p.jurisdiction === "NSW" ? "Stage / year" : "Year level"}</td><td>${esc([p.student.stage_name, p.student.year_level].filter(Boolean).join(", ")) || "—"}</td></tr>
    <tr><td>State or territory</td><td>${esc(p.jurisdiction_name) || "Not set"}</td></tr>
    <tr><td>Period covered</td><td>${period}</td></tr>
    <tr><td>Record kept by</td><td>${esc(p.parent_name) || "—"}</td></tr>
    <tr><td>Curriculum reference</td><td>${esc(p.framework)}${p.curriculum_source?.url ? `<br><span class="muted">Official outcome wording: ${esc(p.curriculum_source.url)}</span>` : ""}</td></tr>
    <tr><td>Entries</td><td>${p.total} dated ${p.total === 1 ? "entry" : "entries"} (lesson work, life learning, parent observations and reading records)</td></tr>
    <tr><td>Generated</td><td>${fmt(p.generated_at)}</td></tr>
  </table>
  ${p.limited ? `<div class="banner">Free preview: the summary covers all ${p.total} entries but only one work sample is shown in full. A Family Membership prints the complete record.</div>` : ""}
  <p class="muted">How to read this record: section 1 is an all-time snapshot of curriculum progress from the Outcome Tracker. Sections 2 to 5 cover only the reporting period above: every entry is dated and was reviewed by the parent, and work is annotated with the official ${ow} outcome codes it gives evidence for, marked <em>understanding shown</em> where the parent judged it so, or <em>practised</em>. Outcome codes are shown without their wording; the full wording is published by the curriculum authority. Work samples are grouped by learning area and listed earliest first, so progress over time can be followed.</p>

  <h2>1. Curriculum progress (all-time snapshot)</h2>
  ${progressSection(p)}

  <h2>2. Evidence in this reporting period, by learning area</h2>
  <table><tr><th>Learning area</th><th>Entries</th><th>Evidence dated</th><th>Kinds of evidence</th><th class="num">Outcomes shown</th><th class="num">Practised</th><th>Time recorded</th></tr>${areaRows}</table>
  ${gaps.length ? `<p class="gap">No evidence recorded in this period for: ${gaps.map(esc).join(", ")}. Add work samples or parent observations for these areas before your review, or note in section 3 how they are being covered.</p>` : `<p class="muted">Every required learning area has at least one entry in this period.</p>`}

  <h2>3. Parent's summary of progress</h2>
  ${parentBox("Progress made during this period", extra.summary)}
  ${parentBox("Areas of strength or advancement", extra.advancement)}
  ${parentBox("Areas needing further attention and how they will be addressed", extra.attention)}

  <h2>4. ${ow === "syllabus" ? "Syllabus" : "Curriculum"} outcomes evidenced in this period</h2>
  ${outcomeTables || `<p class="muted">No ${ow} outcomes have been linked to work in this period yet. When reviewing work, judge each outcome so it appears here.</p>`}

  <h2 class="pb">5. Learning progression: dated work samples</h2>
  ${progression || "<p>No approved work or observations yet.</p>"}

  <h2>6. Parent declaration</h2>
  <p>I declare that this record is an accurate account of the learning undertaken by ${esc(p.student.name)} during the period shown, and that the work samples were completed by ${esc(p.student.name)}.</p>
  <table class="sig"><tr><td style="width:55%">Name<div class="line">${esc(p.parent_name)}</div></td><td>Date<div class="line"></div></td></tr><tr><td colspan="2">Signature<div class="line"></div></td></tr></table>

  <p style="margin-top:28px;font-size:11px;color:#666">This is a record of learning kept by the parent. It is not an official assessment. Side-Quest does not certify that any home education registration or curriculum requirement is met and does not provide legal or compliance advice. Check your own state or territory's home education requirements.</p>
  </body></html>`;
}

const csvCell = (v) => { let t = String(v ?? "").replace(/\r?\n/g, " "); if (/^[=+\-@\t]/.test(t)) t = "'" + t; return `"${t.replace(/"/g, '""')}"`; };
export function portfolioCsv(p) {
  const head = ["Type", "Date", "Title", "Learning area", "Subject", "Year level", "Result", "Outcomes: understanding shown", "Outcomes: practised", "Work", "Reflection", "Parent comment", "Next step", "Minutes"];
  const lines = [head.map(csvCell).join(",")];
  for (const e of p.entries || []) {
    const codes = (shown) => e.outcomes.filter((o) => shownIn(o) === shown).map((o) => o.code || o.description).join("; ");
    lines.push([KIND[e.kind], e.date, e.title, e.learning_area, e.subject, e.year_level, e.result, codes(true), codes(false), e.work, e.reflection, e.parent_comment, e.next_step, e.duration_minutes ?? ""].map(csvCell).join(","));
  }
  return lines.join("\r\n");
}
