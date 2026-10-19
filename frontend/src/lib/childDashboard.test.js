import { featuredChildQuest, groupChildQuests, planFor } from "./childDashboard";

const a = (id, status, lessonId = id) => ({
  id, status, lesson_id: lessonId,
  lesson: { id: lessonId, title: id, learning_area: "Science" },
});
const on = (id, date) => ({ id: "event-" + id, date, linked_assignment_id: id, linked_lesson_id: "shared" });

test("continue favours the unfinished lesson even when it is not in the first five", () => {
  const tasks = Array.from({ length: 5 }, (_, i) => a("new-" + i, "not_started"));
  tasks.push(a("sixth", "in_progress"), a("returned", "needs_revision"));
  const groups = groupChildQuests(tasks, [], "2026-10-20");
  expect(featuredChildQuest(groups).id).toBe("sixth");
  expect(Object.values(groups).flat().filter((x) => x?.id === "sixth")).toHaveLength(1);
});

test("a returned lesson is the next action if there is nothing already in progress", () => {
  const groups = groupChildQuests([a("returned", "needs_revision"), a("new", "not_started")], [], "2026-10-20");
  expect(groups.returned).toHaveLength(1);
  expect(featuredChildQuest(groups).id).toBe("returned");
});

test("parent help requests do not become a Continue button", () => {
  const groups = groupChildQuests([a("help", "awaiting_help"), a("new", "not_started")], [], "2026-10-20");
  expect(groups.awaitingHelp).toHaveLength(1);
  expect(featuredChildQuest(groups).id).toBe("new");
  expect(featuredChildQuest(groupChildQuests([a("help", "awaiting_help")], [], "2026-10-20"))).toBeNull();
});

test("the calendar uses assignment IDs when a lesson has been assigned twice", () => {
  const old = a("old", "in_progress", "shared");
  const fresh = a("new", "not_started", "shared");
  const events = [on("old", "2026-10-18"), on("new", "2026-10-20")];
  expect(planFor(old, events, "2026-10-20")).toBe("2026-10-18");
  expect(planFor(fresh, events, "2026-10-20")).toBe("2026-10-20");
  const groups = groupChildQuests([old, fresh], events, "2026-10-20");
  expect(groups.catchUp.map((x) => x.id)).toEqual(["old"]);
  expect(groups.today.map((x) => x.id)).toEqual(["new"]);
});

test("unscheduled quests remain available and planned dates are preserved", () => {
  const tasks = [
    a("anytime", "not_started"),
    { ...a("tomorrow", "not_started"), scheduled_date: "2026-10-21" },
  ];
  const groups = groupChildQuests(tasks, [], "2026-10-20");
  expect(groups.anytime.map((x) => x.id)).toEqual(["anytime"]);
  expect(groups.workAhead.map((x) => x.id)).toEqual(["tomorrow"]);
});
