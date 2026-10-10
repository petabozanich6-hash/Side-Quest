import type { Hono, MiddlewareHandler } from "hono";

export type Env = {
  DB: D1Database;
  JWT_SECRET: string;
  /** Optional R2 bucket for file uploads (bind as BUCKET). */
  BUCKET?: R2Bucket;
  GOOGLE_OAUTH_CLIENT_ID?: string;
  OWNER_PASSWORD?: string;
};
export type AuthUser = { id: string; family_id: string; role: "parent" | "child"; name: string };
export type Vars = { user: AuthUser };
export type App = Hono<{ Bindings: Env; Variables: Vars }>;

/** Middleware set handed to every route module. */
export type Guards = {
  auth: MiddlewareHandler;
  parent: MiddlewareHandler;
  child: MiddlewareHandler;
};

export const nowIso = () => new Date().toISOString();
export const newId = () => crypto.randomUUID();
export const parseJson = (s: any, fallback: any) => {
  try { return s ? JSON.parse(s) : fallback; } catch { return fallback; }
};
