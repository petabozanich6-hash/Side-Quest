/**
 * Membership write access: fail closed on every advanced mutation, including direct API calls.
 *
 * The free offering is a 7-day, one-child preview of the manual lesson workflow.
 * Advanced planning, outcome administration, resources and uploads require payment,
 * even during the preview. Completed work, existing records and account management
 * remain readable after expiry; children can finish existing assignments and parents
 * can review those submissions without paying.
 *
 * Keep rules in one auditable place. These checks are registered before route modules.
 */
import type { App } from "./types";
import { authenticateToken } from "./session";
import { getEntitlement } from "./lessonBuilder";

export type AccessPolicy = "paid" | "preview" | "single_preview_plan" | "preview_ai";

/** Null means no extra entitlement check; existing endpoint auth still applies. */
export function accessPolicy(method: string, path: string): AccessPolicy | null {
  const verb = method.toUpperCase();
  const p = path.replace(/\/+$/, "") || "/";
  // Only single-lesson drafting is eligible for the one-time family sample.
  // Batch generation, lesson refinement, AI planning and all other paid routes
  // must retain their independent paid entitlement enforcement.
  if (verb === "POST" && p === "/api/ai/lesson-draft") return "preview_ai";
  // Advanced functions. Deletions of existing user data intentionally remain available.
  if (verb === "GET" && (p === "/api/audit" || p === "/api/auto-quest/preview")) return "paid";
  if (verb === "POST" && (
    p === "/api/programs" || p === "/api/units" ||
    p === "/api/files/upload" || p === "/api/evidence-notes" ||
    p === "/api/resources" || p === "/api/resources/suggest" || p === "/api/resources/verify-link" ||
    p === "/api/life-evidence" || p === "/api/life-evidence/analyse" ||
    p === "/api/auto-quest/plan" || p === "/api/timetable/week" ||
    p === "/api/word-bank/words" || p === "/api/word-bank/try" ||
    p === "/api/ai/lesson-refine" ||
    p === "/api/ai/series-plan" || p === "/api/ai/batches" ||
    p === "/api/calendar"
  )) return "paid";
  if (verb === "POST" && (
    /^\/api\/auto-quest\/proposals\/[^/]+\/(generate|approve|reject|reopen)$/.test(p) ||
    /^\/api\/ai\/batches\/[^/]+\/items\/\d+\/draft$/.test(p) ||
    /^\/api\/lessons\/[^/]+\/apply-patch$/.test(p) ||
    /^\/api\/life-evidence\/[^/]+\/review$/.test(p) ||
    /^\/api\/outcomes\/students\/[^/]+\/(rebuild|outcomes\/[^/]+\/(confirm|unconfirm|evidence|prior-learning\/remove))$/.test(p) ||
    /^\/api\/outcomes\/students\/[^/]+\/prior-learning(\/analyse)?$/.test(p) ||
    /^\/api\/outcomes\/evidence\/[^/]+\/(exclude|include)$/.test(p) ||
    /^\/api\/assignments\/[^/]+\/place$/.test(p)
  )) return "paid";
  if (verb === "PUT" && (
    /^\/api\/auto-quest\/proposals\/[^/]+\/lesson$/.test(p) ||
    /^\/api\/outcomes\/students\/[^/]+\/support$/.test(p) ||
    /^\/api\/outcomes\/evidence\/[^/]+$/.test(p) ||
    /^\/api\/resources\/[^/]+\/approve$/.test(p) ||
    /^\/api\/calendar\/[^/]+$/.test(p)
  )) return "paid";

  // International parent-defined tracking is an advanced paid feature, just like outcome administration.
  if (verb === "POST" && /^\/api\/international\/goals\/[^/]+(?:\/[^/]+\/evidence)?$/.test(p)) return "paid";
  if (verb === "PUT" && /^\/api\/international\/goals\/[^/]+\/[^/]+$/.test(p)) return "paid";

  // The only non-paid learning workflows allowed during the seven days.
  if (verb === "POST" && p === "/api/learning-plans") return "single_preview_plan";
  if (verb === "POST" && (p === "/api/reading-log" || p === "/api/reading-submissions" ||
    /^\/api\/lessons\/[^/]+\/evidence$/.test(p) ||
    /^\/api\/learning-plans\/[^/]+\/(build|generate)$/.test(p)
  )) return "preview";

  // Deliberate exclusions: account/profile settings, Compass progress, reporting
  // problems, pet care, parent review of work assigned during the trial, child
  // responses to existing assignments and DELETE operations on owned data.
  return null;
}

export function registerMembershipAccess(app: App) {
  app.use("/api/*", async (c, next) => {
    const policy = accessPolicy(c.req.method, c.req.path);
    if (!policy) return next();
    const header = c.req.header("Authorization") || "";
    if (!header.startsWith("Bearer ")) return c.json({ detail: "Not authenticated" }, 401);
    const verified = await authenticateToken(c.env, header.slice(7));
    if (!verified.ok) return c.json({ detail: verified.detail, ...(verified.code ? { code: verified.code } : {}) }, verified.status as any);
    const { plan, limits } = await getEntitlement(c.env.DB, verified.user.family_id);
    if (policy === "preview_ai" && plan !== "FREE_PREVIEW" && !limits.aiGeneration) {
      return c.json({
        code: "UPGRADE_REQUIRED",
        detail: "The one free AI lesson is available during your seven-day preview. Family Membership unlocks ongoing AI lesson building.",
      }, 402);
    }
    if (policy === "paid" && !limits.aiGeneration) {
      return c.json({
        code: "UPGRADE_REQUIRED",
        detail: "This is a Family Membership feature. Your existing work is safe. Visit Your Plan to unlock advanced learning tools.",
      }, 402);
    }
    if (policy !== "paid" && !limits.canCreate) {
      return c.json({
        code: "UPGRADE_REQUIRED",
        detail: "Your seven-day free preview has ended. Your records are safe and you can still review previous work. A Family Membership is needed to add new learning.",
      }, 402);
    }
    if (policy === "single_preview_plan" && plan === "FREE_PREVIEW") {
      const count = await c.env.DB.prepare("SELECT COUNT(*) n FROM learning_plans WHERE family_id = ?")
        .bind(verified.user.family_id).first<{ n: number }>();
      if (Number(count?.n || 0) >= 1) {
        return c.json({
          code: "UPGRADE_REQUIRED",
          detail: "The free preview includes one basic learning plan. A Family Membership unlocks additional plans and AI planning.",
        }, 402);
      }
    }
    // The original endpoints still independently authenticate and enforce parent/child access.
    return next();
  });
}
