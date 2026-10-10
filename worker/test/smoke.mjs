// End-to-end smoke test. Usage: BASE_URL=http://localhost:8787 node worker/test/smoke.mjs
const BASE = process.env.BASE_URL || "http://localhost:8787";
let failed = 0;
const stamp = Date.now();

async function call(method, path, { token, body } = {}) {
  const res = await fetch(`${BASE}/api${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data; try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, data };
}
async function check(name, p, ok = (r) => r.status >= 200 && r.status < 300) {
  const r = await p;
  const pass = ok(r);
  if (!pass) failed++;
  console.log(`${pass ? "ok  " : "FAIL"} ${name} -> ${r.status}${pass ? "" : " " + JSON.stringify(r.data).slice(0, 200)}`);
  return r.data;
}

const email = `smoke${stamp}@example.com`;
const reg = await check("register", call("POST", "/auth/register", { body: { email, password: "password123", name: "Smoke" } }));
const P = reg.token;
await check("login", call("POST", "/auth/login", { body: { email, password: "password123" } }));
await check("auth/me", call("GET", "/auth/me", { token: P }));
const st = await check("create student", call("POST", "/students", { token: P, body: { name: "Kid", username: `kid${stamp}`, pin: "1234", stage: "S2", birth_year: 2016 } }));
await check("list students", call("GET", "/students", { token: P }));
await check("student overview", call("GET", `/students/${st.id}/overview`, { token: P }));
const cl = await check("child login", call("POST", "/auth/child-login", { body: { username: `kid${stamp}`, pin: "1234" } }));
const C = cl.token;

for (const p of ["/dashboard/parent", "/lessons", "/lesson-index", "/resources", "/calendar", "/calendar/ics", "/audit",
  "/curriculum/stages", "/curriculum/learning-areas", "/curriculum/pattern/S4", "/curriculum/outcomes?stage=S2",
  "/reading-log", "/reading-log/stats", "/programs", "/units", "/learning-plans", "/life-evidence",
  "/reading-submissions/pending", `/word-bank/parent/${st.id}`, "/seasonal"]) {
  await check(`parent GET ${p}`, call("GET", p, { token: P }));
}
for (const p of ["/dashboard/child", "/pet", "/pet/species", "/pet/state", "/achievements", "/word-bank",
  "/seasonal/active", "/reading-submissions/mine", "/cheers", "/assignments"]) {
  await check(`child GET ${p}`, call("GET", p, { token: C }));
}

const lessons = await check("lessons list", call("GET", "/lessons", { token: P }));
const lid = Array.isArray(lessons) && lessons[0]?.id;
if (lid) {
  const a = await check("assign lesson", call("POST", "/assignments", { token: P, body: { student_id: st.id, lesson_id: lid } }));
  await check("child lesson detail", call("GET", `/lessons/${lid}`, { token: C }));
  await check("child submit", call("POST", "/submissions", { token: C, body: { assignment_id: a.id, response_text: "done" } }));
}
await check("create pet", call("POST", "/pet", { token: C, body: { name: "Fizz", species: "fox" } }));
await check("feed pet", call("POST", "/pet/care/feed", { token: C }), (r) => r.status === 200 || r.status === 400);
await check("add word", call("POST", "/word-bank/words", { token: C, body: { word: "because" } }));
await check("cheer", call("POST", "/cheers", { token: P, body: { student_id: st.id, message: "Great job" } }));
await check("reading log", call("POST", "/reading-log", { token: P, body: { student_id: st.id, title: "Book", read_date: "2026-01-01" } }));
await check("life evidence", call("POST", "/life-evidence", { token: P, body: { student_id: st.id, title: "Baked bread", description: "Measured flour" } }));
await check("learning plan", call("POST", "/learning-plans", { token: P, body: { student_id: st.id, title: "Term 1", period_start: "2026-01-01", period_end: "2026-03-31" } }));
await check("unauthenticated rejected", call("GET", "/students"), (r) => r.status === 401);
await check("child blocked from parent route", call("GET", "/students", { token: C }), (r) => r.status === 403);
await check("delete account wrong password", call("POST", "/auth/delete-account", { token: P, body: { password: "nope", confirm: "DELETE" } }), (r) => r.status === 403);
await check("delete account", call("POST", "/auth/delete-account", { token: P, body: { password: "password123", confirm: "DELETE" } }));
await check("deleted account token rejected", call("GET", "/auth/me", { token: P }), (r) => r.status === 401);

console.log(failed ? `\n${failed} check(s) failed` : "\nAll smoke checks passed");
process.exit(failed ? 1 : 0);
