import { getStaticWordHint } from "./data/wordBank";
import { newId, nowIso, parseJson } from "./types";
import type { App, AuthUser, Guards } from "./types";

const STAGES = ["wild", "spotted", "tamed", "mastered"] as const;
const STAGE_LABELS: Record<(typeof STAGES)[number], string> = {
  wild: "Wild",
  spotted: "Spotted",
  tamed: "Tamed",
  mastered: "Mastered",
};
const MASTERY_STREAK = 10;
const DAILY_ATTEMPTS = 2;
const SPOTTED_AT = 1;
const TAMED_AT = 4;
const XP_STEP = 2;
const XP_MASTERED = 10;
const TRICKY_MISSES = 2;
const DAILY_LIMIT = 3;
const MAX_DAYS_BACK = 7;
const READING_XP = 3;
const BOOK_TYPES = new Set(["fiction", "nonfiction", "picture", "graphic", "poetry", "reference"]);
const READING_MODES = new Set(["independent", "with_adult", "read_to", "audio"]);
const LOCAL_TZ_OFFSET_MS = 10 * 60 * 60 * 1000;

type Stage = (typeof STAGES)[number];
type WordRow = {
  id: string;
  family_id: string;
  student_id: string;
  word: string;
  hint: string | null;
  stage: string | null;
  streak: number | null;
  correct_days: string[];
  attempts: number;
  attempt_day: string | null;
  attempts_today: number;
  misses: number;
  source: string | null;
  lesson_id: string | null;
  added_by: string | null;
  created_at: string;
  last_practised: string | null;
  mastered_at: string | null;
};

class ApiError extends Error {
  status: number;

  constructor(status: number, detail: string) {
    super(detail);
    this.status = status;
  }
}

const localDay = (date = new Date()) => new Date(date.getTime() + LOCAL_TZ_OFFSET_MS).toISOString().slice(0, 10);

const addDays = (day: string, diff: number) => {
  const [y, m, d] = day.split("-").map((part) => Number(part));
  const next = new Date(Date.UTC(y, m - 1, d + diff));
  return next.toISOString().slice(0, 10);
};

const cleanWord = (raw: unknown) =>
  Array.from(String(raw ?? "").trim())
    .filter((ch) => /[A-Za-z]/.test(ch) || ch === "'" || ch === "-")
    .join("")
    .toLowerCase()
    .slice(0, 40);

const stageForStreak = (streak: number): Stage => {
  if (streak >= MASTERY_STREAK) return "mastered";
  if (streak >= TAMED_AT) return "tamed";
  if (streak >= SPOTTED_AT) return "spotted";
  return "wild";
};

const streakOf = (word: Partial<WordRow>) => {
  if (typeof word.streak === "number" && Number.isFinite(word.streak)) return word.streak;
  switch (word.stage) {
    case "mastered":
      return MASTERY_STREAK;
    case "tamed":
      return TAMED_AT;
    case "spotted":
      return SPOTTED_AT;
    default:
      return 0;
  }
};

const attemptsUsedToday = (word: Partial<WordRow>) =>
  word.attempt_day === localDay() ? Number(word.attempts_today || 0) : 0;

const streakFromDays = (days: string[]) => {
  const have = new Set(days);
  let day = localDay();
  if (!have.has(day)) day = addDays(day, -1);
  let count = 0;
  while (have.has(day)) {
    count += 1;
    day = addDays(day, -1);
  }
  return count;
};

const parseWordRow = (row: Record<string, unknown>): WordRow => {
  const correctDays = parseJson(row.correct_days as string | null | undefined, [] as string[]);
  return {
    id: String(row.id),
    family_id: String(row.family_id),
    student_id: String(row.student_id),
    word: String(row.word),
    hint: row.hint == null ? null : String(row.hint),
    stage: row.stage == null ? null : String(row.stage),
    streak: row.streak == null ? null : Number(row.streak),
    correct_days: Array.isArray(correctDays) ? correctDays.map(String) : [],
    attempts: Number(row.attempts || 0),
    attempt_day: row.attempt_day == null ? null : String(row.attempt_day),
    attempts_today: Number(row.attempts_today || 0),
    misses: Number(row.misses || 0),
    source: row.source == null ? null : String(row.source),
    lesson_id: row.lesson_id == null ? null : String(row.lesson_id),
    added_by: row.added_by == null ? null : String(row.added_by),
    created_at: String(row.created_at),
    last_practised: row.last_practised == null ? null : String(row.last_practised),
    mastered_at: row.mastered_at == null ? null : String(row.mastered_at),
  };
};

const publicWord = (row: WordRow) => {
  const streak = streakOf(row);
  const used = attemptsUsedToday(row);
  const stage = stageForStreak(streakOf({ ...row, streak }));
  return {
    ...row,
    streak,
    streak_target: MASTERY_STREAK,
    attempts_today: used,
    attempts_left: Math.max(DAILY_ATTEMPTS - used, 0),
    stage,
    stage_label: STAGE_LABELS[stage],
    practised_today: row.correct_days.includes(localDay()),
  };
};

const parsePracticeRow = (row: Record<string, unknown>) => ({
  id: String(row.id),
  family_id: String(row.family_id),
  student_id: String(row.student_id),
  word_id: String(row.word_id),
  word: String(row.word),
  correct: Number(row.correct || 0) === 1,
  date: String(row.date),
  at: String(row.at),
});

const parseReadingSubmissionRow = (row: Record<string, unknown>) => ({
  id: String(row.id),
  student_id: String(row.student_id),
  family_id: String(row.family_id),
  title: String(row.title),
  author: row.author == null ? "" : String(row.author),
  read_date: String(row.read_date),
  duration_minutes: Number(row.duration_minutes),
  pages: row.pages == null ? null : Number(row.pages),
  book_type: String(row.book_type),
  reading_mode: String(row.reading_mode),
  status: String(row.status),
  parent_note: row.parent_note == null ? "" : String(row.parent_note),
  created_at: String(row.created_at),
  reviewed_at: row.reviewed_at == null ? null : String(row.reviewed_at),
  reading_log_id: row.reading_log_id == null ? null : String(row.reading_log_id),
});

const cleanInt = (value: unknown, lo: number, hi: number, field: string) => {
  if (value == null || value === "") return null;
  const num = Number(value);
  if (!Number.isInteger(num)) throw new ApiError(400, `${field} must be a number`);
  if (num < lo || num > hi) throw new ApiError(400, `${field} must be between ${lo} and ${hi}`);
  return num;
};

const parseReadDate = (value: unknown) => {
  const raw = String(value ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) throw new ApiError(400, "Please choose the date you read");
  const parsed = new Date(`${raw}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) throw new ApiError(400, "Please choose the date you read");
  return raw;
};

const getLessonSeedKey = async (db: D1Database, lessonId: string | null, familyId: string) => {
  if (!lessonId) return null;
  const row = await db
    .prepare("SELECT seed_key FROM lessons WHERE id = ? AND (family_id = ? OR family_id IS NULL)")
    .bind(lessonId, familyId)
    .first<{ seed_key: string | null }>();
  return row?.seed_key || null;
};

const listWordRows = async (db: D1Database, studentId: string, familyId: string) => {
  const { results } = await db
    .prepare("SELECT * FROM word_bank WHERE student_id = ? AND family_id = ? ORDER BY word")
    .bind(studentId, familyId)
    .all<Record<string, unknown>>();
  return results.map(parseWordRow);
};

const listPracticeRows = async (db: D1Database, studentId: string, familyId: string) => {
  const { results } = await db
    .prepare("SELECT * FROM word_practice WHERE student_id = ? AND family_id = ? ORDER BY at DESC LIMIT 2000")
    .bind(studentId, familyId)
    .all<Record<string, unknown>>();
  return results.map(parsePracticeRow);
};

const summaryFor = async (db: D1Database, studentId: string, familyId: string) => {
  const [words, log] = await Promise.all([listWordRows(db, studentId, familyId), listPracticeRows(db, studentId, familyId)]);
  const counts = Object.fromEntries(STAGES.map((stage) => [stage, 0])) as Record<Stage, number>;
  for (const word of words) {
    const stage = stageForStreak(streakOf(word));
    counts[stage] = (counts[stage] || 0) + 1;
  }
  const days = new Set(log.map((item) => item.date));
  const weekStart = addDays(localDay(), -6);
  const week = log.filter((item) => item.date >= weekStart);
  const weekCorrect = week.filter((item) => item.correct).length;
  return {
    summary: {
      total: words.length,
      counts,
      streak: streakFromDays([...days]),
      days_this_week: new Set(week.map((item) => item.date)).size,
      attempts_this_week: week.length,
      accuracy_this_week: week.length ? Math.round((100 * weekCorrect) / week.length) : null,
      practised_today: days.has(localDay()),
      mastery_streak: MASTERY_STREAK,
      daily_attempts: DAILY_ATTEMPTS,
    },
    words,
    log,
  };
};

const awardPetXpBestEffort = async (db: D1Database, studentId: string, amount: number, reason: string) => {
  try {
    const pet = await db
      .prepare("SELECT xp, happiness, activity FROM pets WHERE student_id = ?")
      .bind(studentId)
      .first<{ xp: number | null; happiness: number | null; activity: string | null }>();
    if (!pet) return null;
    const activity = parseJson(
      pet.activity as string | null | undefined,
      [] as Array<{ amount: number; reason: string; at: string }>
    );
    const events = Array.isArray(activity) ? activity : [];
    events.push({ amount, reason, at: nowIso() });
    const xp = Number(pet.xp || 0) + amount;
    const happiness = Math.min(100, Number(pet.happiness ?? 70) + 5);
    await db
      .prepare("UPDATE pets SET xp = ?, happiness = ?, activity = ? WHERE student_id = ?")
      .bind(xp, happiness, JSON.stringify(events), studentId)
      .run();
    return xp;
  } catch (error) {
    console.warn("Skipping pet XP update", error);
    return null;
  }
};

const insertReadingLogBestEffort = async (
  db: D1Database,
  entry: {
    id: string;
    family_id: string;
    student_id: string;
    logged_by: string;
    logged_role: string;
    title: string;
    author: string;
    pages: number | null;
    pages_read: number | null;
    read_date: string;
    duration_minutes: number;
    source: string;
    book_type: string;
    reading_mode: string;
    comprehension_notes: string;
    favourite_part: string;
    difficulty: string;
    parent_note: string;
    created_at: string;
  }
) => {
  try {
    await db
      .prepare(
        `INSERT INTO reading_log (
          id, family_id, student_id, title, author, pages, pages_read, read_date,
          duration_minutes, source, book_type, reading_mode, comprehension_notes,
          favourite_part, difficulty, parent_note, logged_by, logged_role, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        entry.id,
        entry.family_id,
        entry.student_id,
        entry.title,
        entry.author,
        entry.pages,
        entry.pages_read,
        entry.read_date,
        entry.duration_minutes,
        entry.source,
        entry.book_type,
        entry.reading_mode,
        entry.comprehension_notes,
        entry.favourite_part,
        entry.difficulty,
        entry.parent_note,
        entry.logged_by,
        entry.logged_role,
        entry.created_at
      )
      .run();
    return true;
  } catch (error) {
    console.warn("Skipping reading_log insert", error);
    return false;
  }
};

const addWords = async (
  db: D1Database,
  studentId: string,
  familyId: string,
  data: { words: unknown[]; source?: unknown; lesson_id?: unknown; hint?: unknown },
  addedBy: string
) => {
  const added: ReturnType<typeof publicWord>[] = [];
  const skipped: string[] = [];
  const source = String(data.source || "manual");
  const lessonId = data.lesson_id == null ? null : String(data.lesson_id);
  const explicitHint = data.hint == null ? null : String(data.hint).trim() || null;
  const seedKey = await getLessonSeedKey(db, lessonId, familyId);

  for (const raw of data.words.slice(0, 100)) {
    const word = cleanWord(raw);
    if (!word) continue;
    const exists = await db
      .prepare("SELECT id FROM word_bank WHERE student_id = ? AND family_id = ? AND word = ?")
      .bind(studentId, familyId, word)
      .first();
    if (exists) {
      skipped.push(word);
      continue;
    }

    const row: WordRow = {
      id: newId(),
      family_id: familyId,
      student_id: studentId,
      word,
      hint: explicitHint || getStaticWordHint(word, seedKey),
      stage: "wild",
      streak: 0,
      correct_days: [],
      attempts: 0,
      attempt_day: null,
      attempts_today: 0,
      misses: 0,
      source,
      lesson_id: lessonId,
      added_by: addedBy,
      created_at: nowIso(),
      last_practised: null,
      mastered_at: null,
    };

    try {
      await db
        .prepare(
          `INSERT INTO word_bank (
            id, family_id, student_id, word, hint, stage, streak, correct_days, attempts,
            attempt_day, attempts_today, misses, source, lesson_id, added_by, created_at,
            last_practised, mastered_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          row.id,
          row.family_id,
          row.student_id,
          row.word,
          row.hint,
          row.stage,
          row.streak,
          JSON.stringify(row.correct_days),
          row.attempts,
          row.attempt_day,
          row.attempts_today,
          row.misses,
          row.source,
          row.lesson_id,
          row.added_by,
          row.created_at,
          row.last_practised,
          row.mastered_at
        )
        .run();
      added.push(publicWord(row));
    } catch (error) {
      if (`${error}`.toLowerCase().includes("unique")) {
        skipped.push(word);
        continue;
      }
      throw error;
    }
  }

  return { added, skipped };
};

const applyAttempt = async (db: D1Database, word: WordRow, correct: boolean, user: AuthUser) => {
  const today = localDay();
  const used = attemptsUsedToday(word);
  if (used >= DAILY_ATTEMPTS) {
    throw new ApiError(429, "You have used both tries for this word today. Come back tomorrow!");
  }

  const oldStage = stageForStreak(streakOf(word));
  let streak = streakOf(word);
  let misses = word.misses;
  let correctDays = [...word.correct_days];
  const lastPractised = nowIso();

  if (correct) {
    streak = Math.min(streak + 1, MASTERY_STREAK);
    if (!correctDays.includes(today)) correctDays.push(today);
  } else {
    streak = 0;
    misses += 1;
  }

  const newStage = stageForStreak(streak);
  const moved = newStage !== oldStage;
  const justMastered = newStage === "mastered" && oldStage !== "mastered";
  const xp = correct && moved && STAGES.indexOf(newStage) > STAGES.indexOf(oldStage)
    ? justMastered
      ? XP_MASTERED
      : XP_STEP
    : 0;
  const masteredAt = justMastered ? lastPractised : newStage === "mastered" ? word.mastered_at : null;

  await db
    .prepare(
      `UPDATE word_bank
       SET last_practised = ?, attempt_day = ?, attempts_today = ?, attempts = ?, misses = ?,
           streak = ?, stage = ?, correct_days = ?, mastered_at = ?
       WHERE id = ?`
    )
    .bind(
      lastPractised,
      today,
      used + 1,
      word.attempts + 1,
      misses,
      streak,
      newStage,
      JSON.stringify(correctDays),
      masteredAt,
      word.id
    )
    .run();

  await db
    .prepare("INSERT INTO word_practice (id, family_id, student_id, word_id, word, correct, date, at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
    .bind(newId(), user.family_id, user.id, word.id, word.word, correct ? 1 : 0, today, lastPractised)
    .run();

  if (xp) await awardPetXpBestEffort(db, user.id, xp, `Word Hoard: ${word.word}`);

  const fresh = await db.prepare("SELECT * FROM word_bank WHERE id = ?").bind(word.id).first<Record<string, unknown>>();
  if (!fresh) throw new ApiError(404, "Word not found");
  const freshWord = publicWord(parseWordRow(fresh));
  return {
    word: freshWord,
    correct,
    moved,
    new_stage: newStage,
    xp_gained: xp,
    just_mastered: justMastered,
    streak,
    streak_target: MASTERY_STREAK,
    to_go: Math.max(MASTERY_STREAK - streak, 0),
    attempts_left: Math.max(DAILY_ATTEMPTS - (used + 1), 0),
    daily_attempts: DAILY_ATTEMPTS,
  };
};

const readBody = async (c: any) => (await c.req.json().catch(() => ({}))) as Record<string, unknown>;

const handleError = (c: any, error: unknown) => {
  if (error instanceof ApiError) return c.json({ detail: error.message }, error.status);
  console.error(error);
  return c.json({ detail: "Internal server error" }, 500);
};

export function registerWords(app: App, g: Guards) {
  app.post("/api/word-bank/words", g.auth, async (c) => {
    try {
      const user = c.get("user");
      const body = await readBody(c);
      const words = Array.isArray(body.words) ? body.words : [];
      if (user.role === "child") {
        return c.json(await addWords(c.env.DB, user.id, user.family_id, { ...body, words }, user.id));
      }

      const studentId = String(body.student_id || "").trim();
      if (!studentId) throw new ApiError(400, "student_id is required");
      const student = await c.env.DB
        .prepare("SELECT id FROM students WHERE id = ? AND family_id = ?")
        .bind(studentId, user.family_id)
        .first();
      if (!student) throw new ApiError(404, "Student not found");
      return c.json(await addWords(c.env.DB, studentId, user.family_id, { ...body, words }, user.id));
    } catch (error) {
      return handleError(c, error);
    }
  });

  app.get("/api/word-bank", g.auth, g.child, async (c) => {
    try {
      const user = c.get("user");
      const { summary, words } = await summaryFor(c.env.DB, user.id, user.family_id);
      const grouped = Object.fromEntries(STAGES.map((stage) => [stage, [] as ReturnType<typeof publicWord>[]])) as Record<
        Stage,
        ReturnType<typeof publicWord>[]
      >;
      for (const word of words) grouped[stageForStreak(streakOf(word))].push(publicWord(word));
      const openWords = words.map(publicWord).filter((word) => word.stage !== "mastered");
      const toTame = openWords
        .filter((word) => word.attempts_left > 0)
        .sort((a, b) => STAGES.indexOf(a.stage) - STAGES.indexOf(b.stage) || b.misses - a.misses);
      return c.json({
        summary,
        stages: STAGES,
        labels: STAGE_LABELS,
        mastery_streak: MASTERY_STREAK,
        daily_attempts: DAILY_ATTEMPTS,
        words: grouped,
        to_tame_today: toTame.slice(0, 10),
        resting_today: openWords.length - toTame.length,
      });
    } catch (error) {
      return handleError(c, error);
    }
  });

  app.post("/api/word-bank/practice", g.auth, g.child, async (c) => {
    try {
      const user = c.get("user");
      const body = await readBody(c);
      const wordId = String(body.word_id || "");
      const row = await c.env.DB
        .prepare("SELECT * FROM word_bank WHERE id = ? AND student_id = ?")
        .bind(wordId, user.id)
        .first<Record<string, unknown>>();
      if (!row) throw new ApiError(404, "Word not found");
      return c.json(await applyAttempt(c.env.DB, parseWordRow(row), !!body.correct, user));
    } catch (error) {
      return handleError(c, error);
    }
  });

  app.post("/api/word-bank/try", g.auth, g.child, async (c) => {
    try {
      const user = c.get("user");
      const body = await readBody(c);
      const word = cleanWord(body.word);
      if (!word) throw new ApiError(400, "A word is required");

      let row = await c.env.DB
        .prepare("SELECT * FROM word_bank WHERE student_id = ? AND family_id = ? AND word = ?")
        .bind(user.id, user.family_id, word)
        .first<Record<string, unknown>>();

      if (!row) {
        await addWords(
          c.env.DB,
          user.id,
          user.family_id,
          { words: [word], source: "lesson", lesson_id: body.lesson_id },
          user.id
        );
        row = await c.env.DB
          .prepare("SELECT * FROM word_bank WHERE student_id = ? AND family_id = ? AND word = ?")
          .bind(user.id, user.family_id, word)
          .first<Record<string, unknown>>();
      }
      if (!row) throw new ApiError(404, "Word not found");
      return c.json(
        await applyAttempt(c.env.DB, parseWordRow(row), String(body.guess || "").trim().toLowerCase() === word, user)
      );
    } catch (error) {
      return handleError(c, error);
    }
  });

  app.get("/api/word-bank/parent/:student_id", g.auth, g.parent, async (c) => {
    try {
      const user = c.get("user");
      const studentId = c.req.param("student_id");
      const student = await c.env.DB
        .prepare("SELECT id, name FROM students WHERE id = ? AND family_id = ?")
        .bind(studentId, user.family_id)
        .first<{ id: string; name: string | null }>();
      if (!student) throw new ApiError(404, "Student not found");

      const { summary, words, log } = await summaryFor(c.env.DB, studentId, user.family_id);
      const trickyWords = words
        .filter((word) => word.misses >= TRICKY_MISSES && stageForStreak(streakOf(word)) !== "mastered")
        .map(publicWord)
        .sort((a, b) => b.misses - a.misses);
      const recentlyMastered = words
        .filter((word) => stageForStreak(streakOf(word)) === "mastered")
        .map(publicWord)
        .sort((a, b) => (b.mastered_at || "").localeCompare(a.mastered_at || ""));

      return c.json({
        student: { id: student.id, name: student.name },
        summary,
        tricky_words: trickyWords.slice(0, 15),
        recently_mastered: recentlyMastered.slice(0, 10),
        recent_practice: log.slice(0, 25),
        words: words.map(publicWord),
      });
    } catch (error) {
      return handleError(c, error);
    }
  });

  app.post("/api/reading-submissions", g.auth, g.child, async (c) => {
    try {
      const user = c.get("user");
      const body = await readBody(c);
      const title = String(body.title || "").trim();
      if (!title || title.length > 120) throw new ApiError(400, "Please enter the book title");
      const author = String(body.author || "").trim().slice(0, 80);
      const readDate = parseReadDate(body.read_date);
      const today = new Date().toISOString().slice(0, 10);
      if (readDate > addDays(today, 1)) throw new ApiError(400, "That date is in the future");
      if (readDate < addDays(today, -MAX_DAYS_BACK)) {
        throw new ApiError(400, `You can only add reading from the last ${MAX_DAYS_BACK} days`);
      }

      const durationMinutes = cleanInt(body.duration_minutes, 1, 600, "Minutes");
      if (durationMinutes == null) throw new ApiError(400, "How many minutes did you read?");
      const pages = cleanInt(body.pages, 1, 5000, "Pages");
      const bookType = String(body.book_type || "fiction");
      const readingMode = String(body.reading_mode || "independent");
      if (!BOOK_TYPES.has(bookType) || !READING_MODES.has(readingMode)) {
        throw new ApiError(400, "Invalid book type or reading mode");
      }

      const todayRows = await c.env.DB
        .prepare("SELECT title, status FROM reading_submissions WHERE student_id = ? AND substr(created_at, 1, 10) = ?")
        .bind(user.id, today)
        .all<{ title: string; status: string }>();
      const todays = todayRows.results || [];
      if (todays.length >= DAILY_LIMIT) throw new ApiError(400, `You can add up to ${DAILY_LIMIT} books a day`);
      if (todays.some((item) => item.title.toLowerCase() === title.toLowerCase() && item.status !== "rejected")) {
        throw new ApiError(400, "You already added that book today");
      }

      const doc = {
        id: newId(),
        student_id: user.id,
        family_id: user.family_id,
        title,
        author,
        read_date: readDate,
        duration_minutes: durationMinutes,
        pages,
        book_type: bookType,
        reading_mode: readingMode,
        status: "pending",
        parent_note: "",
        created_at: nowIso(),
      };

      await c.env.DB
        .prepare(
          `INSERT INTO reading_submissions (
            id, student_id, family_id, title, author, read_date, duration_minutes, pages,
            book_type, reading_mode, status, parent_note, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          doc.id,
          doc.student_id,
          doc.family_id,
          doc.title,
          doc.author,
          doc.read_date,
          doc.duration_minutes,
          doc.pages,
          doc.book_type,
          doc.reading_mode,
          doc.status,
          doc.parent_note,
          doc.created_at
        )
        .run();

      return c.json(doc);
    } catch (error) {
      return handleError(c, error);
    }
  });

  app.get("/api/reading-submissions/mine", g.auth, g.child, async (c) => {
    try {
      const { results } = await c.env.DB
        .prepare("SELECT * FROM reading_submissions WHERE student_id = ? ORDER BY created_at DESC LIMIT 100")
        .bind(c.get("user").id)
        .all<Record<string, unknown>>();
      return c.json(results.map(parseReadingSubmissionRow));
    } catch (error) {
      return handleError(c, error);
    }
  });

  app.get("/api/reading-submissions/pending", g.auth, g.parent, async (c) => {
    try {
      const { results } = await c.env.DB
        .prepare("SELECT * FROM reading_submissions WHERE family_id = ? AND status = 'pending' ORDER BY created_at ASC LIMIT 200")
        .bind(c.get("user").family_id)
        .all<Record<string, unknown>>();
      return c.json(results.map(parseReadingSubmissionRow));
    } catch (error) {
      return handleError(c, error);
    }
  });

  app.post("/api/reading-submissions/:sid/approve", g.auth, g.parent, async (c) => {
    try {
      const user = c.get("user");
      const sid = c.req.param("sid");
      const row = await c.env.DB
        .prepare("SELECT * FROM reading_submissions WHERE id = ? AND family_id = ?")
        .bind(sid, user.family_id)
        .first<Record<string, unknown>>();
      if (!row) throw new ApiError(404, "Submission not found");
      const submission = parseReadingSubmissionRow(row);
      if (submission.status !== "pending") throw new ApiError(400, "Already reviewed");

      const edits = await readBody(c);
      const durationMinutes = cleanInt(edits.duration_minutes, 1, 600, "Minutes") ?? submission.duration_minutes;
      const pages = cleanInt(edits.pages, 1, 5000, "Pages") ?? submission.pages;
      const createdAt = nowIso();
      const entry = {
        id: newId(),
        family_id: submission.family_id,
        student_id: submission.student_id,
        title: submission.title,
        author: submission.author,
        pages,
        pages_read: null,
        read_date: submission.read_date,
        duration_minutes: durationMinutes,
        source: "home",
        book_type: submission.book_type,
        reading_mode: submission.reading_mode,
        comprehension_notes: "",
        favourite_part: "",
        difficulty: "just_right",
        parent_note: "",
        logged_by: user.id,
        logged_role: user.role,
        created_at: createdAt,
      };
      const inserted = await insertReadingLogBestEffort(c.env.DB, entry);
      await c.env.DB
        .prepare("UPDATE reading_submissions SET status = 'approved', reviewed_at = ?, reading_log_id = ? WHERE id = ?")
        .bind(createdAt, inserted ? entry.id : null, sid)
        .run();
      await awardPetXpBestEffort(c.env.DB, submission.student_id, READING_XP, `Read ${submission.title}`);
      return c.json({ ok: true, entry_id: inserted ? entry.id : null });
    } catch (error) {
      return handleError(c, error);
    }
  });

  app.post("/api/reading-submissions/:sid/reject", g.auth, g.parent, async (c) => {
    try {
      const user = c.get("user");
      const sid = c.req.param("sid");
      const row = await c.env.DB
        .prepare("SELECT * FROM reading_submissions WHERE id = ? AND family_id = ?")
        .bind(sid, user.family_id)
        .first<Record<string, unknown>>();
      if (!row) throw new ApiError(404, "Submission not found");
      const submission = parseReadingSubmissionRow(row);
      if (submission.status !== "pending") throw new ApiError(400, "Already reviewed");

      const body = await readBody(c);
      const note = String(body.parent_note || "").trim().slice(0, 200);
      await c.env.DB
        .prepare("UPDATE reading_submissions SET status = 'rejected', parent_note = ?, reviewed_at = ? WHERE id = ?")
        .bind(note, nowIso(), sid)
        .run();
      return c.json({ ok: true });
    } catch (error) {
      return handleError(c, error);
    }
  });

  app.delete("/api/word-bank/:word_id", g.auth, g.parent, async (c) => {
    try {
      const result = await c.env.DB
        .prepare("DELETE FROM word_bank WHERE id = ? AND family_id = ?")
        .bind(c.req.param("word_id"), c.get("user").family_id)
        .run();
      if (!result.success || !result.meta.changes) throw new ApiError(404, "Word not found");
      return c.json({ ok: true });
    } catch (error) {
      return handleError(c, error);
    }
  });
}
