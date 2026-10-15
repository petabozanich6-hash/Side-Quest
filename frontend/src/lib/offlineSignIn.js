// Offline sign-in for the kids' app (SQ Kids / a kids' device).
//
// When a child signs in online on a kids' device, their sign-in token is saved on the device encrypted with a key
// derived from their username and PIN (PBKDF2-SHA-256, then AES-GCM). With no signal, typing the same username and
// PIN decrypts it and the child carries on with their saved quests; a wrong PIN simply fails to decrypt. Nothing in
// clear: no PIN, no token. When the device is back online the server checks the token as usual, so a PIN change or
// "sign out everywhere" by the parent ends it.
// Only on kids' devices (never on the parent site), at most MAX_PROFILES children per device, and
// forgetOfflineProfiles() removes them all (the "Forget children saved on this device" link).
const KEY = "sq_offline_signin";
const MAX_PROFILES = 6;
const ITERATIONS = 200000;
// A little friction against guessing PINs on the device: after 5 wrong tries, wait a minute.
const LOCK_KEY = "sq_offline_signin_tries";

const enc = new TextEncoder();
const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const norm = (u) => String(u || "").trim().toLowerCase();

const read = () => { try { const v = JSON.parse(localStorage.getItem(KEY) || "[]"); return Array.isArray(v) ? v : []; } catch { return []; } };
const write = (list) => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* storage full or blocked */ } };

async function keyFor(username, pin, salt) {
  const base = await crypto.subtle.importKey("raw", enc.encode(`${norm(username)}\u0000${pin}`), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "PBKDF2", hash: "SHA-256", salt, iterations: ITERATIONS }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}

export const offlineSignInAvailable = () => typeof crypto !== "undefined" && !!crypto.subtle && typeof localStorage !== "undefined";

/** After an online sign-in on a kids' device: remember this child (token locked with their PIN). */
export async function rememberChildForOffline(username, pin, token, student) {
  if (!offlineSignInAvailable() || !token || !student?.id) return;
  try {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await keyFor(username, pin, salt);
    const payload = JSON.stringify({ token, user: { id: student.id, name: student.name, role: "child", family_id: student.family_id, theme: student.theme } });
    const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(payload));
    const entry = { username: norm(username), salt: b64(salt), iv: b64(iv), ct: b64(ct), saved_at: new Date().toISOString() };
    write([entry, ...read().filter((p) => p.username !== entry.username)].slice(0, MAX_PROFILES));
  } catch { /* offline sign-in is a convenience: never block the online sign-in */ }
}

/** True if this username has an offline sign-in saved on this device. */
export const hasOfflineProfile = (username) => read().some((p) => p.username === norm(username));
export const offlineProfileCount = () => read().length;

/**
 * With no signal: check the PIN on the device. Returns { token, user } on success,
 * { error } otherwise (unknown child, wrong PIN, or too many tries).
 */
export async function offlineSignIn(username, pin) {
  const entry = read().find((p) => p.username === norm(username));
  if (!entry) return { error: "You're offline. Sign in once on this device while you have internet, then you can sign in offline too." };
  let tries = { n: 0, until: 0 };
  try { tries = JSON.parse(localStorage.getItem(LOCK_KEY) || "null") || tries; } catch { /* ignore */ }
  if (tries.until > Date.now()) return { error: "Too many tries. Wait a minute and try again." };
  try {
    const key = await keyFor(username, pin, unb64(entry.salt));
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(entry.iv) }, key, unb64(entry.ct));
    try { localStorage.removeItem(LOCK_KEY); } catch { /* ignore */ }
    return JSON.parse(new TextDecoder().decode(plain));
  } catch {
    const n = tries.n + 1;
    try { localStorage.setItem(LOCK_KEY, JSON.stringify(n >= 5 ? { n: 0, until: Date.now() + 60000 } : { n, until: 0 })); } catch { /* ignore */ }
    return { error: "That PIN doesn't match. Try again." };
  }
}

/** The server said this child's sign-in is no longer valid (PIN changed, signed out everywhere): forget it here. */
export function forgetOfflineChild(username) { write(read().filter((p) => p.username !== norm(username))); }

/** Removes every child saved for offline sign-in on this device. */
export function forgetOfflineProfiles() { try { localStorage.removeItem(KEY); localStorage.removeItem(LOCK_KEY); } catch { /* ignore */ } }
