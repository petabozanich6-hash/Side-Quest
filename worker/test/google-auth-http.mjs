// HTTP checks for the Google start/callback state machine and session logout.
// Usage: BASE_URL=http://127.0.0.1:8791 node worker/test/google-auth-http.mjs
const BASE = process.env.BASE_URL || "http://127.0.0.1:8791";
let failed = 0;

function fail(name, detail) {
  failed++;
  console.log(`FAIL ${name} ${detail}`);
}
function ok(name) {
  console.log(`ok   ${name}`);
}

async function request(path, { method = "GET", body, cookie, redirect = "manual" } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    redirect,
    headers: {
      ...(body ? { "content-type": "application/json" } : {}),
      ...(cookie ? { cookie } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, headers: res.headers, data };
}

function cookieHeader(response) {
  const raw = response.headers.getSetCookie?.() || [];
  return raw.map((line) => line.split(";")[0]).filter(Boolean).join("; ");
}

const start = await request("/api/auth/google/start");
const location = start.headers.get("location") || "";
let startUrl;
try { startUrl = new URL(location); } catch { startUrl = null; }
const redirectUri = startUrl?.searchParams.get("redirect_uri");
const state = startUrl?.searchParams.get("state");
const challenge = startUrl?.searchParams.get("code_challenge");
if (
  start.status >= 300 && start.status < 400 &&
  startUrl?.origin === "https://accounts.google.com" &&
  startUrl.pathname === "/o/oauth2/v2/auth" &&
  redirectUri === `${BASE}/api/auth/google/callback` &&
  state && challenge &&
  startUrl.searchParams.get("code_challenge_method") === "S256" &&
  startUrl.searchParams.get("response_type") === "code" &&
  startUrl.searchParams.get("scope") === "openid email profile" &&
  !location.includes("client_secret")
) ok("google start redirects with PKCE and exact callback");
else fail("google start", `${start.status} ${location}`);

const oauthCookie = cookieHeader(start);
if (oauthCookie.includes("sq_oauth=") && !oauthCookie.includes("GOOGLE_OAUTH_CLIENT_SECRET")) ok("oauth state cookie is set");
else fail("oauth cookie", oauthCookie);

const mismatch = await request(`/api/auth/google/callback?error=access_denied&state=not-the-state`, { cookie: oauthCookie });
if (mismatch.status >= 300 && (mismatch.headers.get("location") || "").includes("error=google_state")) ok("callback rejects a mismatched state");
else fail("state mismatch", `${mismatch.status} ${mismatch.headers.get("location")}`);

const start2 = await request("/api/auth/google/start");
const state2 = new URL(start2.headers.get("location")).searchParams.get("state");
const cookie2 = cookieHeader(start2);
const cancelled = await request(`/api/auth/google/callback?error=access_denied&state=${encodeURIComponent(state2)}`, { cookie: cookie2 });
if (cancelled.status >= 300 && (cancelled.headers.get("location") || "").includes("error=google_cancelled")) ok("cancelled Google auth returns a clear error");
else fail("cancelled", `${cancelled.status} ${cancelled.headers.get("location")}`);

const bare = await request("/api/auth/google/callback?code=abc&state=abc");
if (bare.status >= 300 && (bare.headers.get("location") || "").includes("error=google_state")) ok("callback without state cookie is rejected");
else fail("bare callback", `${bare.status} ${bare.headers.get("location")}`);

const exchange = await request("/api/auth/google/exchange", { method: "POST", body: { ticket: "missing" } });
if (exchange.status === 401) ok("ticket exchange rejects a missing handoff");
else fail("exchange", `${exchange.status} ${JSON.stringify(exchange.data)}`);

const link = await request("/api/auth/google/link", { method: "POST", body: { link_token: "nope", password: "password123" } });
if (link.status === 401) ok("link rejects an invalid token");
else fail("link", `${link.status} ${JSON.stringify(link.data)}`);

const legacy = await request("/api/auth/session", { method: "POST", body: { session_id: "old" } });
if (legacy.status === 410) ok("retired session endpoint stays disabled");
else fail("legacy session", String(legacy.status));

const stamp = Date.now();
const email = `google-auth-${stamp}@example.com`;
const registered = await request("/api/auth/register", {
  method: "POST",
  body: { email, password: "password123", name: "Auth Parent" },
});
const token = registered.data?.token;
if (registered.status === 200 && token && registered.data?.user?.platform_role !== "owner") ok("email register still issues a session and is not an owner");
else fail("register", `${registered.status} ${JSON.stringify(registered.data).slice(0, 240)}`);

const me = await request("/api/auth/me", { cookie: `sq_session=${token}` });
if (me.status === 200 && me.data?.email === email && me.data?.platform_role === "parent" && me.data?.lifetime_access === false) ok("session cookie authenticates a normal parent");
else fail("me cookie", `${me.status} ${JSON.stringify(me.data).slice(0, 240)}`);

const badCredential = await request("/api/auth/google", { method: "POST", body: { credential: "not-a-jwt" } });
if (badCredential.status === 401) ok("malformed Google credential is rejected");
else fail("bad credential", `${badCredential.status} ${JSON.stringify(badCredential.data)}`);

const bearerMe = await fetch(`${BASE}/api/auth/me`, { headers: { authorization: `Bearer ${token}` } });
if (bearerMe.status === 200) ok("bearer token still authenticates");
else fail("bearer", String(bearerMe.status));

const loggedOut = await fetch(`${BASE}/api/auth/logout`, {
  method: "POST",
  headers: { authorization: `Bearer ${token}` },
});
if (loggedOut.status === 200) ok("logout succeeds");
else fail("logout", String(loggedOut.status));

const after = await fetch(`${BASE}/api/auth/me`, { headers: { authorization: `Bearer ${token}` } });
if (after.status === 401) ok("logout revokes the session token");
else fail("revoked me", String(after.status));

const child = await request("/api/students", {
  method: "POST",
  cookie: `sq_session=${token}`,
  body: { name: "Kid", username: `kid${stamp}`, pin: "1234", stage: "S2" },
});
if (child.status === 401) ok("revoked session cannot create a child");
else fail("revoked child create", String(child.status));

if (failed) {
  console.log(`\n${failed} failed`);
  process.exit(1);
}
console.log("\ngoogle auth http checks passed");
