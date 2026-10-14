import type { Hono, MiddlewareHandler } from "hono";

/** Minimal shape of the Cloudflare Email Service binding (send_email). */
export type EmailBinding = {
  send(message: {
    to: string | { email: string; name?: string } | Array<string | { email: string; name?: string }>;
    from: string | { email: string; name?: string };
    subject: string;
    text?: string;
    html?: string;
    replyTo?: string | { email: string; name?: string };
    headers?: Record<string, string>;
  }): Promise<{ messageId: string }>;
};

export type Env = {
  DB: D1Database;
  JWT_SECRET: string;
  /** Optional R2 bucket for file uploads (bind as BUCKET). */
  BUCKET?: R2Bucket;
  /** Optional Cloudflare Email Service binding for outgoing email. */
  EMAIL?: EmailBinding;
  /** Optional Cloudflare Workers AI binding (bind as AI). Paid-plan lesson drafting only. */
  AI?: { run(model: string, input: Record<string, unknown>, options?: Record<string, unknown>): Promise<any> };
  /** Optional AI Gateway id and model override for Workers AI calls. */
  AI_GATEWAY_ID?: string;
  AI_MODEL?: string;
  HELP_PER_CHILD_DAY?: string;
  HELP_PER_FAMILY_DAY?: string;
  HELP_PER_FAMILY_MONTH?: string;
  YOUTUBE_API_KEY?: string;
  /** Optional sender address override (defaults to no-reply@sidequestlearning.app). */
  EMAIL_FROM?: string;
  /** Verified Email Routing destination that incoming support mail is forwarded to. */
  FORWARD_TO?: string;
  GOOGLE_OAUTH_CLIENT_ID?: string;
  GOOGLE_OAUTH_CLIENT_SECRET?: string;
  OWNER_PASSWORD?: string;
  /** Private staging only: when set, every /api call needs the access cookie granted by /api/staging-access?key=... */
  STAGING_KEY?: string;
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
export const parseJson = <T>(s: string | null | undefined, fallback: T): T => {
  try { return s ? JSON.parse(s) : fallback; } catch { return fallback; }
};
