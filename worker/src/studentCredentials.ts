import { hashSecret, verifySecret } from "./auth";
import type { App, Env, Guards } from "./types";

const enc = new TextEncoder();
const dec = new TextDecoder();

const toB64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));
const fromB64 = (s: string) => Uint8Array.from(atob(s), (ch) => ch.charCodeAt(0));

let columnReady = false;

/** Adds students.pin_enc if the migration hasn't been applied yet. Safe to call repeatedly. */
async function ensurePinColumn(env: Env) {
  if (columnReady) return;
  try {
    await env.DB.prepare("SELECT pin_enc FROM students LIMIT 1").first();
  } catch {
    try {
      await env.DB.prepare("ALTER TABLE students ADD COLUMN pin_enc TEXT").run();
    } catch (error) {
      if (!/duplicate column/i.test(error instanceof Error ? error.message : String(error))) throw error;
    }
  }
  columnReady = true;
}

async function pinKey(env: Env) {
  const base = await crypto.subtle.importKey("raw", enc.encode(env.JWT_SECRET), "HKDF", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "HKDF", hash: "SHA-256", salt: enc.encode("sidequest-pin"), info: enc.encode("student-pin-v1") },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptPin(env: Env, studentId: string, pin: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(
    await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: enc.encode(studentId) }, await pinKey(env), enc.encode(pin))
  );
  const out = new Uint8Array(iv.length + ct.length);
  out.set(iv); out.set(ct, iv.length);
  return toB64(out);
}

async function decryptPin(env: Env, studentId: string, stored: string): Promise<string | null> {
  try {
    const bytes = fromB64(stored);
    const iv = bytes.slice(0, 12);
    const ct = bytes.slice(12);
    const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv, additionalData: enc.encode(studentId) }, await pinKey(env), ct);
    return dec.decode(pt);
  } catch {
    return null;
  }
}

const fail = (c: any, error: unknown) => {
  console.error("student credentials failed", error instanceof Error ? error.name : "error");
  return c.json({ detail: "Couldn't complete that. Please try again." }, 500);
};

export function registerStudentCredentials(app: App, g: Guards) {
  /** Set or reset a child's PIN. Stores the sign-in hash and an encrypted copy the parent can view later. */
  app.put("/api/students/:sid/pin", g.auth, g.parent, async (c) => {
    try {
      await ensurePinColumn(c.env);
      const sid = c.req.param("sid");
      const body = await c.req.json().catch(() => ({}));
      const pin = String(body.pin || "");
      if (pin.length < 4 || pin.length > 32) return c.json({ detail: "PIN must be 4 or more characters" }, 400);
      const student = await c.env.DB.prepare("SELECT id FROM students WHERE id = ? AND family_id = ?")
        .bind(sid, c.get("user").family_id).first();
      if (!student) return c.json({ detail: "Not found" }, 404);
      await c.env.DB.prepare("UPDATE students SET pin_hash = ?, pin_enc = ?, credential_version = credential_version + 1 WHERE id = ? AND family_id = ?")
        .bind(await hashSecret(pin), await encryptPin(c.env, sid, pin), sid, c.get("user").family_id).run();
      return c.json({ ok: true });
    } catch (error) {
      return fail(c, error);
    }
  });

  /** Show a child's username and PIN, but only after the parent re-enters their own password. */
  app.post("/api/students/:sid/credentials", g.auth, g.parent, async (c) => {
    try {
      await ensurePinColumn(c.env);
      const sid = c.req.param("sid");
      const body = await c.req.json().catch(() => ({}));
      const password = String(body.password || "");
      const me = await c.env.DB.prepare("SELECT password_hash FROM users WHERE id = ?")
        .bind(c.get("user").id).first<{ password_hash: string | null }>();
      if (!me?.password_hash) {
        return c.json({ detail: "Your account signs in with Google, so there is no password to confirm. Use \"Forgot password\" on the sign-in page to set one first." }, 400);
      }
      if (!password || !(await verifySecret(password, me.password_hash))) {
        return c.json({ detail: "That password isn't right" }, 403);
      }
      const s = await c.env.DB.prepare("SELECT username, pin_hash, pin_enc FROM students WHERE id = ? AND family_id = ?")
        .bind(sid, c.get("user").family_id).first<{ username: string; pin_hash: string; pin_enc: string | null }>();
      if (!s) return c.json({ detail: "Not found" }, 404);

      let pin: string | null = s.pin_enc ? await decryptPin(c.env, sid, s.pin_enc) : null;
      if (pin && !(await verifySecret(pin, s.pin_hash))) pin = null;
      c.header("Cache-Control", "no-store");
      return c.json({ username: s.username, pin });
    } catch (error) {
      return fail(c, error);
    }
  });
}
