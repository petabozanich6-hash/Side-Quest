// Builds the printable Evidence Backpack record for a home education liaison visit (in NSW, a NESA Authorised
// Person). It is organised the way a visitor reads it: who the child is and what period is covered, a summary of
// progress by key learning area, the syllabus outcomes evidenced, then dated and annotated work samples in order
// within each learning area so progression over time is visible, and finally the parent's summary and declaration.

const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
const fmt = (d) => { if (!d) return ""; const t = new Date(d.length === 10 ? d + "T00:00:00" : d); return isNaN(t) ? esc(d) : t.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" }); };
const hours = (m) => (m ? `${Math.round((m / 60) * 10) / 10} h` : "");
const KIND = { lesson: "Lesson work", life: "Life learning", note: "Parent observation" };

const CSS = `
  @page { size: A4; margin: 16mm 14mm; }
  * { box-sizing: border-box; }
  body { font-family: Georgia, "Times New Roman", serif; color: #111; max-width: 760px; margin: 24px auto; padding: 0 18px; font-size: 13px; line-height: 1.45; }
  h1 { font-size: 24px; margin: 0 0 4px; } h2 { font-size: 17px; margin: 26px 0 8px; border-bottom: 2px solid #111; padding-bottom: 3px; }
  h2, h3 { break-after: avoid; } h3 { font-size: 15px; margin: 18px 0 6px; } h4 { font-size: 12px; margin: 8px 0 2px; text-transform: uppercase; letter-spacing: .04em; color: #444; }
  table { width: 100%; border-collapse: collapse; margin: 6px 0; } th, td { border: 1px solid #bbb; padding: 4px 6px; text-align: left; vertical-align: top; font-size: 12px; }
  th { background: #f2f2f2; } .muted { color: #555; font-size: 12px; } .gap { color: #8a4b00; font-weight: bold; }
  .meta td:first-child { width: 32%; font-weight: bold; background: #fafafa; }
  .entry { break-inside: avoid; border: 1px solid #ccc; border-radius: 4px; padding: 10px 12px; margin: 10px 0; }
  .entry .head { display: flex; justify-content: space-between; gap: 12px; } .entry .title { font-weight: bold; font-size: 14px; }
  .tag { display: inline-block; border: 1px solid #999; border-radius: 10px; padding: 0 7px; font-size: 11px; margin: 2px 4px 2px 0; }
  .ach { border-color: #2e7d32; color: #1b5e20; } .wt { border-color: #b26a00; color: #7a4800; }
  .pre { white-space: pre-wrap; } .imgs { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; } .imgs img { max-width: 48%; max-height: 260px; border: 1px solid #ccc; }
  .lines { border-bottom: 1px solid #999; height: 24px; } .sig td { border: none; padding: 18px 6px 0 0; } .sig .line { border-bottom: 1px solid #111; height: 22px; }
  .banner { background: #fff7e0; border: 1px solid #e6c96b; padding: 8px; font-size: 12px; margin: 8px 0; }
  .pb { break-before: page; }
  @media print { body { margin: 0; } .noprint { display: none; } }
`;

function outcomeTags(outcomes) {
  if (!outcomes?.length) return "";
  return `<div>${outcomes.map((o) => `<span class="tag ${o.status === "achieved" ? "ach" : "wt"}" title="${esc(o.description)}">${esc(o.code || o.description.slice(0, 40))} · ${o.status === "achieved" ? "achieved" : "working towards"}</span>`).join("")}</div>`;
}

function entryHtml(e, images) {
  const imgs = (e.files || []).filter((f) => images[f.id]);
  const others = (e.files || []).filter((f) => !images[f.id]);
  const block = (label, text) => (text ? `<h4>${label}</h4><div class="pre">${esc(text)}</div>` : "");
  return `<div class="entry">
    <div class="head"><div class="title">${esc(e.title)}</div><div class="muted">${fmt(e.date)}</div></div>
    <div class="muted">${esc([KIND[e.kind], e.subject && e.subject !== e.learning_area ? e.subject : "", e.year_level, e.result, e.duration_minutes ? `${e.duration_minutes} min` : "", e.location].filter(Boolean).join(" · "))}</div>
    ${outcomeTags(e.outcomes)}
    ${(e.outcomes || []).length ? `<div class="muted" style="margin-top:4px">${e.outcomes.map((o) => `${esc(o.code)}${o.code ? ": " : ""}${esc(o.description)}`).join("<br>")}</div>` : ""}
    ${block(e.kind === "lesson" ? "Child's work" : e.kind === "life" ? "What happened" : "Parent's notes", e.work)}
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
    <td>${a.outcomes_achieved || "—"}</td><td>${a.outcomes_working_towards || "—"}</td><td>${hours(a.minutes) || "—"}</td></tr>`).join("");

  const byArea = new Map();
  for (const o of s.outcomes) { if (!byArea.has(o.learning_area)) byArea.set(o.learning_area, []); byArea.get(o.learning_area).push(o); }
  const outcomeTables = [...byArea.entries()].map(([area, list]) => `<h3>${esc(area)}</h3>
    <table><tr><th style="width:15%">Outcome</th><th>Description</th><th style="width:13%">Status</th><th style="width:8%">Samples</th><th style="width:22%">Evidence dated</th></tr>
    ${list.map((o) => `<tr><td>${esc(o.code) || "—"}</td><td>${esc(o.description)}</td><td>${o.status === "achieved" ? "Achieved" : "Working towards"}</td><td>${o.times}</td><td>${o.first === o.latest ? fmt(o.first) : `${fmt(o.first)} – ${fmt(o.latest)}`}</td></tr>`).join("")}</table>`).join("");

  const groups = new Map();
  for (const e of p.entries || []) { if (!groups.has(e.learning_area)) groups.set(e.learning_area, []); groups.get(e.learning_area).push(e); }
  const order = [...(p.expected_areas || []), ...[...groups.keys()].filter((k) => !(p.expected_areas || []).includes(k))];
  const progression = order.filter((a) => groups.has(a)).map((a) => {
    const list = groups.get(a);
    return `<h3>${esc(a)} <span class="muted">(${list.length} ${list.length === 1 ? "sample" : "samples"}, earliest first)</span></h3>${list.map((e) => entryHtml(e, images)).join("")}`;
  }).join("");

  const parentBox = (label, text) => `<h4>${label}</h4>${text?.trim() ? `<div class="pre">${esc(text)}</div>` : '<div class="lines"></div><div class="lines"></div><div class="lines"></div>'}`;
  const gaps = s.not_yet_evidenced || [];
  const ow = !p.jurisdiction || p.jurisdiction === "NSW" ? "syllabus" : "curriculum";

  return `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><title>${esc(p.student.name)} – record of learning and progress</title><style>${CSS}</style></head><body>
  <h1>Record of learning and progress</h1>
  <p class="muted">Home education learning record kept by the parent and generated from Side Quest.</p>
  <table class="meta">
    <tr><td>Child</td><td>${esc(p.student.name)}</td></tr>
    <tr><td>Stage / year</td><td>${esc([p.student.stage_name, p.student.year_level].filter(Boolean).join(", ")) || "—"}</td></tr>
    <tr><td>Period covered</td><td>${period}</td></tr>
    <tr><td>Record kept by</td><td>${esc(p.parent_name) || "—"}</td></tr>
    <tr><td>Curriculum reference</td><td>${esc(p.framework)}</td></tr>
    <tr><td>Entries</td><td>${p.total} dated ${p.total === 1 ? "entry" : "entries"} (lesson work, life learning and parent observations)</td></tr>
    <tr><td>Generated</td><td>${fmt(p.generated_at)}</td></tr>
  </table>
  ${p.limited ? `<div class="banner">Free preview: the summary covers all ${p.total} entries but only one work sample is shown in full. A Family Membership prints the complete record.</div>` : ""}
  <p class="muted">How to read this record: every entry is dated and was reviewed by the parent. Work is annotated with the ${ow} outcomes it gives evidence for, marked <em>achieved</em> where the parent judged the outcome demonstrated, or <em>working towards</em> where it is still developing. Work samples are grouped by key learning area and listed earliest first, so progress over time can be followed.</p>

  <h2>1. Summary of progress by key learning area</h2>
  <table><tr><th>Key learning area</th><th>Entries</th><th>Evidence dated</th><th>Outcomes achieved</th><th>Working towards</th><th>Time recorded</th></tr>${areaRows}</table>
  ${gaps.length ? `<p class="gap">No evidence recorded in this period for: ${gaps.map(esc).join(", ")}. Add work samples or parent observations for these areas before the visit, or note in section 2 how they are being covered.</p>` : `<p class="muted">Every key learning area for this stage has at least one entry in this period.</p>`}

  <h2>2. Parent's summary of progress</h2>
  ${parentBox("Progress made during this period", extra.summary)}
  ${parentBox("Areas of strength or advancement", extra.advancement)}
  ${parentBox("Areas needing further attention and how they will be addressed", extra.attention)}

  <h2>3. ${ow === "syllabus" ? "Syllabus" : "Curriculum"} outcomes evidenced</h2>
  ${outcomeTables || '<p class="muted">No ${ow} outcomes have been linked yet. When reviewing work, tick the outcomes the work shows so they appear here.</p>'}

  <h2 class="pb">4. Learning progression: dated work samples</h2>
  ${progression || "<p>No approved work or observations yet.</p>"}

  <h2>5. Parent declaration</h2>
  <p>I declare that this record is an accurate account of the learning undertaken by ${esc(p.student.name)} during the period shown, and that the work samples were completed by ${esc(p.student.name)}.</p>
  <table class="sig"><tr><td style="width:55%">Name<div class="line">${esc(p.parent_name)}</div></td><td>Date<div class="line"></div></td></tr><tr><td colspan="2">Signature<div class="line"></div></td></tr></table>

  <p style="margin-top:28px;font-size:11px;color:#666">This is a record of learning kept by the parent. It is not an official assessment, and Side Quest does not provide legal or compliance advice. Check your own state or territory's home education requirements.</p>
  </body></html>`;
}

const csvCell = (v) => { let t = String(v ?? "").replace(/\r?\n/g, " "); if (/^[=+\-@\t]/.test(t)) t = "'" + t; return `"${t.replace(/"/g, '""')}"`; };
export function portfolioCsv(p) {
  const head = ["Type", "Date", "Title", "Key learning area", "Subject", "Year level", "Result", "Outcomes achieved", "Outcomes working towards", "Work", "Reflection", "Parent comment", "Next step", "Minutes"];
  const lines = [head.map(csvCell).join(",")];
  for (const e of p.entries || []) {
    const codes = (st) => e.outcomes.filter((o) => o.status === st).map((o) => o.code || o.description).join("; ");
    lines.push([KIND[e.kind], e.date, e.title, e.learning_area, e.subject, e.year_level, e.result, codes("achieved"), codes("working_towards"), e.work, e.reflection, e.parent_comment, e.next_step, e.duration_minutes ?? ""].map(csvCell).join(","));
  }
  return lines.join("\r\n");
}
