import type { App, Guards } from "./types";
import type { HandsOnQuest } from "./data/handsOnTypes";
import { PARENT_LEARNING_GUIDES } from "./data/handsOnParentGuides";
import { MORE_PARENT_LEARNING_GUIDES } from "./data/handsOnParentGuidesMore";
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
import { spaceQuests, spaceParentGuides } from "./data/handsOnSpace";
import { soundQuests, soundParentGuides } from "./data/handsOnSound";
import { codingQuests, codingParentGuides } from "./data/handsOnCoding";
import { practicalQuests, practicalParentGuides } from "./data/handsOnPractical";
import { historyQuests, historyParentGuides } from "./data/handsOnHistory";
import { lightQuests, lightParentGuides, forcesQuests, forcesParentGuides } from "./data/handsOnExpansionPhysics";
import { weatherQuests, weatherParentGuides, plantsQuests, plantsParentGuides } from "./data/handsOnExpansionNatural";
import { logicQuests, logicParentGuides, dramaQuests, dramaParentGuides } from "./data/handsOnExpansionCreative";
import { inclusiveQuests, inclusiveParentGuides, marketQuests, marketParentGuides } from "./data/handsOnExpansionDesign";
import { earthQuests, earthParentGuides, civicsQuests, civicsParentGuides } from "./data/handsOnExpansionEarthCivic";
import { sunQuests, sunParentGuides } from "./data/handsOnSun";
import { bubbleQuests, bubbleParentGuides } from "./data/handsOnBubbles";
import { makingQuests, makingParentGuides } from "./data/handsOnMakers";
import { kitchenLabQuests, kitchenLabParentGuides } from "./data/handsOnKitchenLab";
import { halloweenCraftQuests, halloweenCraftParentGuides, halloweenCraftRunbooks } from "./data/handsOnHalloweenCrafts";
import { halloweenDiscoveryQuests, halloweenDiscoveryParentGuides, halloweenDiscoveryRunbooks } from "./data/handsOnHalloweenDiscovery";
import { bodyQuests, bodyParentGuides, bodyRunbooks } from "./data/handsOnBody";
import { electricQuests, electricParentGuides, electricRunbooks } from "./data/handsOnElectric";
import { animalQuests, animalParentGuides, animalRunbooks } from "./data/handsOnAnimals";
import { oceanQuests, oceanParentGuides, oceanRunbooks } from "./data/handsOnOceans";
import { geometryQuests, geometryParentGuides, geometryRunbooks } from "./data/handsOnGeometry";
import { topUpAQuests, topUpAParentGuides, topUpARunbooks } from "./data/handsOnTopUpA";
import { topUpBQuests, topUpBParentGuides, topUpBRunbooks } from "./data/handsOnTopUpB";
import { coreRunbooks } from "./data/handsOnRunbookCore";
import { middleRunbooks } from "./data/handsOnRunbookMiddle";
import { expandedRunbooks } from "./data/handsOnRunbookExpanded";
import { newRunbooks } from "./data/handsOnRunbookNew";
import { revisedQuestSteps } from "./data/handsOnRevisedSteps";
import { getEntitlement } from "./lessonBuilder";
import { isPlatformOwner } from "./access";

/** Every activity is original, printable editorial content: no paid stock resources. */
export const HANDS_ON_QUESTS: readonly HandsOnQuest[] = [
  ...kitchenQuests, ...crystalQuests, ...sensoryQuests, ...legoQuests,
  ...engineeringQuests, ...natureQuests, ...artQuests, ...mathsQuests,
  ...storiesQuests, ...movementQuests,
  ...spaceQuests, ...soundQuests, ...codingQuests, ...practicalQuests, ...historyQuests,
  ...lightQuests, ...forcesQuests, ...weatherQuests, ...plantsQuests,
  ...logicQuests, ...dramaQuests, ...inclusiveQuests, ...marketQuests,
  ...earthQuests, ...civicsQuests, ...sunQuests, ...bubbleQuests,
  ...makingQuests, ...kitchenLabQuests,
  ...halloweenCraftQuests, ...halloweenDiscoveryQuests,
  ...bodyQuests, ...electricQuests, ...animalQuests, ...oceanQuests, ...geometryQuests,
  ...topUpAQuests, ...topUpBQuests,
];
const QUEST_BY_ID = new Map(HANDS_ON_QUESTS.map(quest => [quest.id, quest]));
const PARENT_GUIDES = { ...PARENT_LEARNING_GUIDES, ...MORE_PARENT_LEARNING_GUIDES,
  ...spaceParentGuides, ...soundParentGuides, ...codingParentGuides,
  ...practicalParentGuides, ...historyParentGuides,
  ...lightParentGuides, ...forcesParentGuides, ...weatherParentGuides, ...plantsParentGuides,
  ...logicParentGuides, ...dramaParentGuides, ...inclusiveParentGuides, ...marketParentGuides,
  ...earthParentGuides, ...civicsParentGuides, ...sunParentGuides, ...bubbleParentGuides, ...makingParentGuides, ...kitchenLabParentGuides,
  ...halloweenCraftParentGuides, ...halloweenDiscoveryParentGuides,
  ...bodyParentGuides, ...electricParentGuides, ...animalParentGuides, ...oceanParentGuides, ...geometryParentGuides,
  ...topUpAParentGuides, ...topUpBParentGuides };
const RUNBOOKS = { ...coreRunbooks, ...middleRunbooks, ...expandedRunbooks, ...newRunbooks,
  ...halloweenCraftRunbooks, ...halloweenDiscoveryRunbooks,
  ...bodyRunbooks, ...electricRunbooks, ...animalRunbooks, ...oceanRunbooks, ...geometryRunbooks,
  ...topUpARunbooks, ...topUpBRunbooks };
if (QUEST_BY_ID.size !== HANDS_ON_QUESTS.length) throw new Error("Duplicate hands-on quest IDs");
if (HANDS_ON_QUESTS.some(q => !PARENT_GUIDES[q.id])) throw new Error("Missing parent teaching guide for a hands-on quest");
if (Object.keys(PARENT_GUIDES).length !== HANDS_ON_QUESTS.length) throw new Error("Parent guides must match quests one-to-one");
if (HANDS_ON_QUESTS.some(q => !RUNBOOKS[q.id])) throw new Error("Missing practical setup or troubleshooting for a hands-on quest");
if (Object.keys(RUNBOOKS).length !== HANDS_ON_QUESTS.length) throw new Error("Practical guide count must match quests one-to-one");

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
      items: HANDS_ON_QUESTS.map(q => unlocked ? { ...previewQuest(q), materials: q.materials } : previewQuest(q)),
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
    return c.json({ ...q, steps: revisedQuestSteps[q.id] ?? q.steps,
      parentLearning: PARENT_GUIDES[q.id], runbook: RUNBOOKS[q.id] });
  });
}
