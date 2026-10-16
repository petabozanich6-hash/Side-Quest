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
  /** Opt-in verification for new parent signups, only after migration 0069 and email delivery are ready. */
  EMAIL_VERIFICATION_REQUIRED?: string;
  /** Optional Cloudflare Email Service binding for outgoing email. */
  EMAIL?: EmailBinding;
  /** Optional Cloudflare Workers AI binding (bind as AI). Paid-plan lesson drafting only. */
  AI?: { run(model: string, input: Record<string, unknown>, options?: Record<string, unknown>): Promise<any> };
  /** Optional AI Gateway id and model override for Workers AI calls. */
  AI_GATEWAY_ID?: string;
  AI_MODEL?: string;
  /** Optional separate model for short child-help responses; leave unset to retain the main model. */
  AI_HELP_MODEL?: string;
  /** Experimental, opt-in grouped generation; must pass QA before production activation. */
  AI_COMPACT_GENERATION?: string;
  /** "true" applies AI_MODEL_ROUTES (aiRouting.ts). Off by default. */
  AI_ROUTING_ENABLED?: string;
  /** JSON object of AI task to allow-listed model, e.g. {"outcome_match":"@cf/qwen/qwen3-30b-a3b-fp8"}. */
  AI_MODEL_ROUTES?: string;
  /** "true" runs lesson stages with more parallelism and a per-call timeout. Off by default. */
  AI_FAST_PIPELINE?: string;
  /** Optional per-call Workers AI timeout in milliseconds (5000-600000). */
  AI_CALL_TIMEOUT_MS?: string;
  HELP_PER_CHILD_DAY?: string;
  HELP_PER_FAMILY_DAY?: string;
  HELP_PER_FAMILY_MONTH?: string;
  LIFE_MAP_PER_FAMILY_DAY?: string;
  LIFE_MAP_PER_FAMILY_MONTH?: string;
  YOUTUBE_API_KEY?: string;
  /** Opt-in owner destination for first real paid-membership alerts. Never included in client responses. */
  OWNER_NOTIFICATION_EMAIL?: string;
  /** Optional sender address override (defaults to no-reply@sidequestlearning.app). */
  EMAIL_FROM?: string;
  /** Verified Email Routing destination that incoming support mail is forwarded to. */
  FORWARD_TO?: string;
  GOOGLE_OAUTH_CLIENT_ID?: string;
  GOOGLE_OAUTH_CLIENT_SECRET?: string;
  OWNER_PASSWORD?: string;
  /** Private staging only: when set, every /api call needs the access cookie granted by /api/staging-access?key=... */
  STAGING_KEY?: string;
  /** Stripe secret (sk_test_... / rk_test_... for sandbox). Cloudflare secret, never in code or chat. */
  STRIPE_SECRET_KEY?: string;
  /** Signing secret (whsec_...) of the Stripe webhook endpoint for this Worker. Cloudflare secret. */
  STRIPE_WEBHOOK_SECRET?: string;
  /** Must be exactly "true" before a live Stripe key is accepted. Leave unset until live payments are approved. */
  STRIPE_LIVE_ENABLED?: string;
  /** Live Stripe Price IDs (ordinary configuration; not credentials). Each must be in the live Stripe account. */
  STRIPE_LIVE_PRICE_WEEKLY?: string;
  STRIPE_LIVE_PRICE_FORTNIGHTLY?: string;
  STRIPE_LIVE_PRICE_MONTHLY?: string;
  STRIPE_LIVE_PRICE_YEARLY?: string;
  /** Optional https origin used for Stripe redirect URLs (defaults to the request origin). */
  APP_URL?: string;
  /** Extra origins (comma-separated) allowed to make Owner HQ changes, e.g. the private staging workers.dev URL. */
  ADMIN_ORIGINS?: string;
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
