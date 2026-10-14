// The family's state or territory (families.jurisdiction, migration 0054).
// Reads and writes tolerate a database where 0054 has not been applied yet, so deploying the code first never breaks sign-up.
import type { App, Guards } from "./types";
import { asJurisdiction, JURISDICTIONS, JURISDICTION_CODES, CHECKED_ON } from "./data/jurisdictions";
import type { JurisdictionCode } from "./data/jurisdictions";

const missingColumn = (e: unknown) => /no such column|has no column/i.test(String((e as any)?.message ?? e));

export async function getJurisdiction(db: D1Database, familyId: string): Promise<JurisdictionCode | null> {
  try {
    const row = await db.prepare("SELECT jurisdiction FROM families WHERE id = ?").bind(familyId).first<{ jurisdiction: string | null }>();
    return asJurisdiction(row?.jurisdiction);
  } catch (e) {
    if (missingColumn(e)) return null;
    throw e;
  }
}

/** Returns false (and changes nothing) when the column does not exist yet. */
export async function setJurisdiction(db: D1Database, familyId: string, code: JurisdictionCode): Promise<boolean> {
  try {
    await db.prepare("UPDATE families SET jurisdiction = ? WHERE id = ?").bind(code, familyId).run();
    return true;
  } catch (e) {
    if (missingColumn(e)) return false;
    throw e;
  }
}

export const jurisdictionList = () => JURISDICTION_CODES.map((c) => ({ code: c, name: JURISDICTIONS[c].name, authority: JURISDICTIONS[c].authority }));

export function registerJurisdiction(app: App, g: Guards) {
  app.get("/api/family/jurisdiction", g.auth, g.parent, async (c) => {
    const code = await getJurisdiction(c.env.DB, c.get("user").family_id);
    const j = code ? JURISDICTIONS[code] : null;
    return c.json({
      jurisdiction: code,
      name: j?.name ?? null,
      authority: j?.authority ?? null,
      plan_name: j?.planName ?? null,
      areas: j?.areas ?? [],
      requirements: j?.requirements ?? [],
      sources: j?.sources ?? [],
      checked_on: CHECKED_ON,
      options: jurisdictionList(),
    });
  });

  app.put("/api/family/jurisdiction", g.auth, g.parent, async (c) => {
    const b: any = await c.req.json().catch(() => ({}));
    const code = asJurisdiction(b.jurisdiction);
    if (!code) return c.json({ detail: "Choose your state or territory." }, 400);
    const saved = await setJurisdiction(c.env.DB, c.get("user").family_id, code);
    if (!saved) return c.json({ detail: "Your state or territory can't be saved until the site's database is updated. Please try again later.", code: "MIGRATION_PENDING" }, 503);
    return c.json({ ok: true, jurisdiction: code, name: JURISDICTIONS[code].name });
  });
}
