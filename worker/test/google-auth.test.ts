import assert from "node:assert/strict";
import test from "node:test";

import {
  googleRedirectUri,
  GOOGLE_CALLBACK_PATH,
  normaliseGoogleProfile,
  openOauth,
  pkceChallenge,
  readGoogleLinkToken,
  resolveGoogleSignIn,
  safePicture,
  sealOauth,
  signGoogleLinkToken,
  verifyGoogleIdToken,
  type GoogleAccounts,
  type GoogleProfile,
  type GoogleUser,
} from "../src/googleAuth.ts";

const SECRET = "test-jwt-secret-that-is-long-enough";

function user(partial: Partial<GoogleUser> & Pick<GoogleUser, "id" | "email">): GoogleUser {
  return {
    family_id: "fam-" + partial.id,
    name: "Parent",
    picture: null,
    password_hash: null,
    google_sub: null,
    oauth_provider: null,
    is_owner: 1,
    platform_role: "parent",
    created_at: "2026-01-01T00:00:00.000Z",
    ...partial,
  };
}

function memoryAccounts(seed: GoogleUser[] = []): GoogleAccounts & { users: GoogleUser[] } {
  const users = seed.map((row) => ({ ...row }));
  return {
    users,
    async findBySub(sub) {
      return users.find((row) => row.google_sub === sub) ?? null;
    },
    async findByEmail(email) {
      return users.find((row) => row.email === email) ?? null;
    },
    async updateReturning(userId, patch) {
      const row = users.find((item) => item.id === userId);
      if (!row) return;
      if (patch.picture) row.picture = patch.picture;
      if (patch.email) row.email = patch.email;
    },
    async attachSub(userId, sub, picture) {
      const row = users.find((item) => item.id === userId);
      if (!row || row.google_sub || row.password_hash) return false;
      row.google_sub = sub;
      row.oauth_provider = "google";
      if (picture) row.picture = picture;
      return true;
    },
    async linkSub(userId, email, sub, picture) {
      const row = users.find((item) => item.id === userId);
      if (!row || row.email !== email || row.google_sub || !row.password_hash) return false;
      row.google_sub = sub;
      row.oauth_provider = "google";
      if (picture) row.picture = picture;
      return true;
    },
    async create(profile) {
      if (users.some((row) => row.email === profile.email || row.google_sub === profile.sub)) {
        throw new Error("UNIQUE constraint failed");
      }
      const created = user({
        id: "new-" + profile.sub,
        email: profile.email,
        name: profile.name,
        picture: profile.picture,
        google_sub: profile.sub,
        oauth_provider: "google",
        platform_role: "parent",
      });
      users.push(created);
      return created;
    },
  };
}

const profile = (overrides: Partial<GoogleProfile> = {}): GoogleProfile => ({
  sub: "google-sub-1",
  email: "parent@example.com",
  name: "Ada Parent",
  picture: "https://lh3.googleusercontent.com/a/photo",
  ...overrides,
});

test("redirect URI is the fixed callback on allowed hosts only", () => {
  assert.equal(
    googleRedirectUri("https://sidequestlearning.app/login"),
    `https://sidequestlearning.app${GOOGLE_CALLBACK_PATH}`
  );
  assert.equal(
    googleRedirectUri("https://www.sidequestlearning.app/parent"),
    `https://www.sidequestlearning.app${GOOGLE_CALLBACK_PATH}`
  );
  assert.equal(
    googleRedirectUri("http://localhost:8787/login"),
    `http://localhost:8787${GOOGLE_CALLBACK_PATH}`
  );
  assert.equal(
    googleRedirectUri("http://127.0.0.1:8787/api/health"),
    `http://127.0.0.1:8787${GOOGLE_CALLBACK_PATH}`
  );
  assert.equal(googleRedirectUri("http://sidequestlearning.app/login"), null);
  assert.equal(googleRedirectUri("https://evil.com/api/auth/google/callback"), null);
  assert.equal(googleRedirectUri("https://sidequestlearning.app.evil.com/login"), null);
  assert.equal(googleRedirectUri("https://notsidequestlearning.app/login"), null);
});

test("PKCE S256 matches the RFC 7636 vector", async () => {
  const challenge = await pkceChallenge("dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk");
  assert.equal(challenge, "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM");
});

test("profile picture accepts Google hosts only", () => {
  assert.equal(safePicture("https://lh3.googleusercontent.com/a/x"), "https://lh3.googleusercontent.com/a/x");
  assert.equal(safePicture("http://lh3.googleusercontent.com/a/x"), null);
  assert.equal(safePicture("https://evil.com/a.png"), null);
  assert.equal(safePicture("javascript:alert(1)"), null);
});

test("oauth state cookie round-trips and rejects other tokens", async () => {
  const sealed = await sealOauth(SECRET, { state: "state-1", verifier: "verifier-1", nonce: "nonce-1" });
  assert.deepEqual(await openOauth(SECRET, sealed), { state: "state-1", verifier: "verifier-1", nonce: "nonce-1" });
  assert.equal(await openOauth(SECRET, sealed + "x"), null);
  const link = await signGoogleLinkToken(SECRET, {
    uid: "user-1",
    googleSub: "sub-1",
    email: "parent@example.com",
    name: "Ada",
    picture: null,
  });
  assert.equal(await openOauth(SECRET, link), null);
  assert.equal((await readGoogleLinkToken(SECRET, link))?.uid, "user-1");
  assert.equal(await readGoogleLinkToken(SECRET, sealed), null);
});

test("new Google parent creates one account", async () => {
  const accounts = memoryAccounts();
  const result = await resolveGoogleSignIn(accounts, profile());
  assert.equal(result.status, "signed_in");
  if (result.status === "signed_in") assert.equal(result.isNew, true);
  assert.equal(accounts.users.length, 1);
  assert.equal(accounts.users[0].google_sub, "google-sub-1");
  assert.equal(accounts.users[0].password_hash, null);
  assert.equal(accounts.users[0].platform_role, "parent");
  if (result.status === "signed_in") assert.equal(result.user.platform_role, "parent");
});

test("returning Google parent is recognised by subject, not by creating another family", async () => {
  const existing = user({
    id: "user-1",
    email: "parent@example.com",
    name: "Kept Name",
    google_sub: "google-sub-1",
    oauth_provider: "google",
    family_id: "family-kept",
  });
  const accounts = memoryAccounts([existing]);
  const result = await resolveGoogleSignIn(accounts, profile({ name: "Different Google Name" }));
  assert.equal(result.status, "signed_in");
  if (result.status === "signed_in") {
    assert.equal(result.isNew, false);
    assert.equal(result.user.id, "user-1");
    assert.equal(result.user.family_id, "family-kept");
  }
  assert.equal(accounts.users.length, 1);
  assert.equal(accounts.users[0].name, "Kept Name");
});

test("password account with the same email is not merged until linking", async () => {
  const existing = user({
    id: "user-1",
    email: "parent@example.com",
    password_hash: "pbkdf2$secret",
    name: "Password Parent",
    family_id: "family-kept",
  });
  const accounts = memoryAccounts([existing]);
  const result = await resolveGoogleSignIn(accounts, profile());
  assert.deepEqual(result, {
    status: "link_required",
    userId: "user-1",
    email: "parent@example.com",
    name: "Ada Parent",
    picture: "https://lh3.googleusercontent.com/a/photo",
    googleSub: "google-sub-1",
  });
  assert.equal(accounts.users[0].google_sub, null);
  assert.equal(accounts.users[0].oauth_provider, null);
  assert.equal(accounts.users.length, 1);
});

test("linking Google keeps an existing platform Owner role and does not copy it by email", async () => {
  const accounts = memoryAccounts([
    user({
      id: "owner-user",
      email: "owner@example.com",
      password_hash: "pbkdf2$secret",
      family_id: "owner-family",
      platform_role: "owner",
    }),
    user({ id: "other-family", email: "other@example.com", password_hash: "pbkdf2$secret", family_id: "family-b" }),
  ]);
  const decision = await resolveGoogleSignIn(accounts, profile({ sub: "owner-google", email: "owner@example.com" }));
  assert.equal(decision.status, "link_required");
  assert.equal(accounts.users[0].platform_role, "owner");
  assert.equal(accounts.users[1].platform_role, "parent");

  const linked = await accounts.linkSub("owner-user", "owner@example.com", "owner-google", null);
  assert.equal(linked, true);
  assert.equal(accounts.users[0].platform_role, "owner");
  assert.equal(accounts.users[0].family_id, "owner-family");
  assert.equal(accounts.users[1].google_sub, null);
  assert.equal(accounts.users[1].platform_role, "parent");

  const stranger = await resolveGoogleSignIn(accounts, profile({ sub: "stranger", email: "new-parent@example.com" }));
  assert.equal(stranger.status, "signed_in");
  if (stranger.status === "signed_in") assert.equal(stranger.user.platform_role, "parent");
  assert.equal(accounts.users.filter((row) => row.platform_role === "owner").length, 1);
});

test("linking writes the Google subject onto the existing password account", async () => {
  const accounts = memoryAccounts([
    user({ id: "user-1", email: "parent@example.com", password_hash: "pbkdf2$secret", family_id: "family-kept" }),
  ]);
  const linked = await accounts.linkSub("user-1", "parent@example.com", "google-sub-1", null);
  assert.equal(linked, true);
  assert.equal(accounts.users[0].google_sub, "google-sub-1");
  assert.equal(accounts.users[0].family_id, "family-kept");
  assert.equal(accounts.users[0].password_hash, "pbkdf2$secret");
  const again = await resolveGoogleSignIn(accounts, profile());
  assert.equal(again.status, "signed_in");
  assert.equal(accounts.users.length, 1);
});

test("a different Google subject cannot take an already linked email", async () => {
  const accounts = memoryAccounts([
    user({ id: "user-1", email: "parent@example.com", google_sub: "original-sub", password_hash: "pbkdf2$secret" }),
  ]);
  const result = await resolveGoogleSignIn(accounts, profile({ sub: "other-sub" }));
  assert.equal(result.status, "conflict");
  assert.equal(accounts.users[0].google_sub, "original-sub");
  assert.equal(accounts.users.length, 1);
});

test("passwordless legacy Google account is recognised and keeps its family", async () => {
  const accounts = memoryAccounts([
    user({ id: "user-1", email: "parent@example.com", family_id: "family-kept", oauth_provider: "google" }),
  ]);
  const result = await resolveGoogleSignIn(accounts, profile());
  assert.equal(result.status, "signed_in");
  if (result.status === "signed_in") assert.equal(result.user.family_id, "family-kept");
  assert.equal(accounts.users[0].google_sub, "google-sub-1");
  assert.equal(accounts.users.length, 1);
});

test("Google email change does not steal another family's address", async () => {
  const accounts = memoryAccounts([
    user({ id: "google-user", email: "old@example.com", google_sub: "google-sub-1", family_id: "family-a" }),
    user({ id: "other", email: "new@example.com", password_hash: "pbkdf2$secret", family_id: "family-b" }),
  ]);
  const result = await resolveGoogleSignIn(accounts, profile({ email: "new@example.com" }));
  assert.equal(result.status, "signed_in");
  if (result.status === "signed_in") assert.equal(result.user.email, "old@example.com");
  assert.equal(accounts.users.find((row) => row.id === "other")?.family_id, "family-b");
  assert.equal(accounts.users.find((row) => row.id === "other")?.google_sub, null);
});

function b64url(bytes: Uint8Array) {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function signIdToken(privateKey: CryptoKey, payload: Record<string, unknown>, header: Record<string, unknown>) {
  const head = b64url(new TextEncoder().encode(JSON.stringify(header)));
  const body = b64url(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", privateKey, new TextEncoder().encode(`${head}.${body}`));
  return `${head}.${body}.${b64url(new Uint8Array(signature))}`;
}

test("ID token verification checks signature, audience, issuer, expiry, nonce and email_verified", async () => {
  const pair = await crypto.subtle.generateKey(
    { name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
    true,
    ["sign", "verify"]
  );
  const jwk = await crypto.subtle.exportKey("jwk", pair.publicKey);
  const keys = [{ ...jwk, kid: "test-key", alg: "RS256" }];
  const now = 1_700_000_000;
  const claims = {
    iss: "https://accounts.google.com",
    aud: "client-id.apps.googleusercontent.com",
    sub: "998877",
    email: "Parent@Example.com",
    email_verified: true,
    name: "Ada Parent",
    picture: "https://lh3.googleusercontent.com/a/photo",
    nonce: "nonce-ok",
    iat: now,
    exp: now + 600,
  };
  const token = await signIdToken(pair.privateKey, claims, { alg: "RS256", kid: "test-key" });
  const ok = await verifyGoogleIdToken(token, "client-id.apps.googleusercontent.com", { nonce: "nonce-ok", now, jwks: keys });
  assert.equal(ok.ok, true);
  if (ok.ok) assert.equal(ok.profile.email, "parent@example.com");

  const badAud = await signIdToken(pair.privateKey, { ...claims, aud: "other" }, { alg: "RS256", kid: "test-key" });
  assert.equal((await verifyGoogleIdToken(badAud, "client-id.apps.googleusercontent.com", { now, jwks: keys })).ok, false);

  const badIss = await signIdToken(pair.privateKey, { ...claims, iss: "https://evil.example" }, { alg: "RS256", kid: "test-key" });
  assert.equal((await verifyGoogleIdToken(badIss, claims.aud, { now, jwks: keys })).ok, false);

  const expired = await signIdToken(pair.privateKey, { ...claims, exp: now - 120 }, { alg: "RS256", kid: "test-key" });
  const expiredResult = await verifyGoogleIdToken(expired, claims.aud, { now, jwks: keys });
  assert.deepEqual(expiredResult, { ok: false, code: "expired" });

  const unverified = await signIdToken(pair.privateKey, { ...claims, email_verified: false }, { alg: "RS256", kid: "test-key" });
  const unverifiedResult = await verifyGoogleIdToken(unverified, claims.aud, { now, jwks: keys });
  assert.deepEqual(unverifiedResult, { ok: false, code: "unverified" });

  const nonce = await verifyGoogleIdToken(token, claims.aud, { nonce: "other-nonce", now, jwks: keys });
  assert.deepEqual(nonce, { ok: false, code: "nonce" });

  const none = `${b64url(new TextEncoder().encode(JSON.stringify({ alg: "none", kid: "test-key" })))}.${b64url(new TextEncoder().encode(JSON.stringify(claims)))}.`;
  assert.equal((await verifyGoogleIdToken(none, claims.aud, { now, jwks: keys })).ok, false);

  assert.equal(normaliseGoogleProfile({ sub: "1", email: "not-an-email", name: "A" }), null);
});
