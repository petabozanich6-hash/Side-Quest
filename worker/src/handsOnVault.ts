import type { App, Guards } from "./types";
import type { HandsOnQuest } from "./data/handsOnTypes";
import { kitchenQuests } from "./data/handsOnKitchen";
import { crystalQuests } from "./data/handsOnCrystals";
import { sensoryQuests } from "./data/handsOnSensory";
import { legoQuests } from "./data/handsOnLego";
import { engineeringQuests } from "./data/handsOnEngineering";
import { natureQuests } from "./data/handsOnNature";
import { artQuests } from "./data/handsOnArt";
import { mathsQuests } from "./data/handsOnMaths";
import { storiesQuests } from "./data/handsOnStories";
import { movementQuests } from "./data/handsOnMovement";
import { getEntitlement } from "./lessonBuilder";
import { isPlatformOwner } from "./access";

/** Every activity is original, printable editorial content: no paid stock resources. */
export const HANDS_ON_QUESTS: readonly HandsOnQuest[] = [
  ...kitchenQuests, ...crystalQuests, ...sensoryQuests, ...legoQuests,
  ...engineeringQuests, ...natureQuests, ...artQuests, ...mathsQuests,
  ...storiesQuests, ...movementQuests,
];
const QUEST_BY_ID = new Map(HANDS_ON_QUESTS.map(quest => [quest.id, quest]));
if (QUEST_BY_ID.size !== HANDS_ON_QUESTS.length) throw new Error("Duplicate hands-on quest IDs");

/** Free preview lists only titles and short descriptors, never proprietary instructions. */
export function previewQuest(q: HandsOnQuest) {
  return {
    id: q.id, title: q.title, category: q.category, ages: q.ages,
    minutes: q.minutes, mess: q.mess, icon: q.icon, description: q.description,
    skills: q.skills,
  };
}
export async function canOpenHandsOnVault(db: D1Database, user: { id: string; family_id: string }): Promise<boolean> {
  if (await isPlatformOwner(db, user.id)) return true;
  const entitlement = await getEntitlement(db, user.family_id);
  return entitlement.limits.aiGeneration;
}
export function registerHandsOnVault(app: App, g: Guards) {
  app.get("/api/hands-on-quests", g.auth, g.parent, async c => {
    const unlocked = await canOpenHandsOnVault(c.env.DB, c.get("user"));
    c.header("Cache-Control", "private, no-store");
    return c.json({
      unlocked,
      count: HANDS_ON_QUESTS.length,
      categories: [...new Set(HANDS_ON_QUESTS.map(q => q.category))],
      items: HANDS_ON_QUESTS.map(previewQuest),
    });
  });
  app.get("/api/hands-on-quests/:id", g.auth, g.parent, async c => {
    const q = QUEST_BY_ID.get(c.req.param("id"));
    if (!q) return c.json({ detail: "Activity not found" }, 404);
    if (!await canOpenHandsOnVault(c.env.DB, c.get("user"))) {
      return c.json({ code: "UPGRADE_REQUIRED",
        detail: "Printable activity instructions are included with Family Membership." }, 402);
    }
    c.header("Cache-Control", "private, no-store");
    return c.json(q);
  });
}
