import { newId, nowIso } from "../types";

export const PRIZE_POOL = [
  { id: "leaf_crown", name: "Leaf Crown", emoji: "🍃" },
  { id: "star_collar", name: "Star Collar", emoji: "⭐" },
  { id: "acorn_hat", name: "Acorn Hat", emoji: "🌰" },
  { id: "rainbow_ribbon", name: "Rainbow Ribbon", emoji: "🌈" },
  { id: "cosy_blanket", name: "Cosy Blanket", emoji: "🧶" },
  { id: "glow_lantern", name: "Glow Lantern", emoji: "🏮" },
  { id: "moon_cape", name: "Moon Cape", emoji: "🌙" },
  { id: "flower_wreath", name: "Flower Wreath", emoji: "🌸" },
];

const parseJson = <T>(value: unknown, fallback: T): T => {
  try {
    return value ? JSON.parse(String(value)) as T : fallback;
  } catch {
    return fallback;
  }
};

const pickBoxes = () => {
  const pool = [...PRIZE_POOL];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 3);
};

export function normaliseAchievement(row: any) {
  return {
    ...row,
    outcome_codes: parseJson<any[]>(row.outcome_codes, []),
    box_prizes: parseJson<any[]>(row.box_prizes, []),
    prize: parseJson<any>(row.prize, null),
    claimed: !!row.claimed,
  };
}

export function publicAchievement(row: any) {
  const doc = { ...normaliseAchievement(row) };
  if (!doc.claimed) {
    delete doc.box_prizes;
    delete doc.prize;
  }
  return doc;
}

export async function syncAchievementsForStudent(
  db: D1Database,
  student: { id: string; family_id: string; name: string },
) {
  const { results: assignments } = await db.prepare(
    "SELECT id, lesson_id, status FROM assignments WHERE student_id = ? AND family_id = ? AND status IN ('accepted', 'demonstrated') ORDER BY created_at ASC LIMIT 1000"
  ).bind(student.id, student.family_id).all<any>();
  if (!assignments.length) return;

  const { results: existing } = await db.prepare(
    "SELECT assignment_id FROM achievements WHERE student_id = ? LIMIT 5000"
  ).bind(student.id).all<any>();
  const have = new Set(existing.map((row) => String(row.assignment_id)));

  for (const assignment of assignments) {
    if (have.has(String(assignment.id))) continue;
    const lesson = await db.prepare("SELECT * FROM lessons WHERE id = ?").bind(assignment.lesson_id).first<any>();
    const lessonData = parseJson<Record<string, any>>(lesson?.data, {});
    const submission = await db.prepare(
      "SELECT reviewed_at FROM submissions WHERE assignment_id = ? AND status IN ('accepted', 'demonstrated') ORDER BY reviewed_at DESC LIMIT 1"
    ).bind(assignment.id).first<any>();
    const ts = nowIso();
    await db.prepare(
      `INSERT OR IGNORE INTO achievements (
        id, assignment_id, family_id, student_id, student_name, lesson_id, lesson_title,
        learning_area, stage, outcome_codes, level, awarded_at, box_prizes, claimed,
        chosen_box, prize, created_at, claimed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NULL, NULL, ?, NULL)`
    ).bind(
      newId(),
      assignment.id,
      student.family_id,
      student.id,
      student.name || "",
      assignment.lesson_id,
      lesson?.title || "Lesson",
      lesson?.learning_area ?? null,
      lesson?.stage ?? null,
      JSON.stringify(Array.isArray(lessonData.outcome_codes) ? lessonData.outcome_codes : []),
      assignment.status,
      submission?.reviewed_at || ts,
      JSON.stringify(pickBoxes()),
      ts,
    ).run();
  }
}
