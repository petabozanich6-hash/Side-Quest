import { buildWeeklyLessonRows, calendarSlotConflict, isLearningSlot } from "./weeklyLessonPlan";

const slot = (id, date, time, title = "Mathematics") => ({
  id, student_id: "mason", date, start_time: time, duration_minutes: 45, event_type: "timetable", title
});
const proposal = (id, slotId, lesson) => ({
  id, calendar_event_id: slotId, status: "proposed", action: lesson ? "reuse_draft" : "needs_generation",
  lesson, outcome_codes: ["MA4"]
});

test("week preview distinguishes used slots, library matches, gaps, and conflicts", () => {
  const day = "2026-10-19";
  const events = [
    slot("occupied", day, "09:00"),
    slot("available", day, "10:00"),
    slot("conflict", day, "11:00"),
    slot("needs", day, "13:00"),
    { id: "appt", title: "Dentist", date: day, start_time: "11:20", duration_minutes: 30, student_id: "mason", event_type: "appointment" }
  ];
  events[0].linked_assignment_id = "already-assigned";
  const rows = buildWeeklyLessonRows(events, [
    proposal("p1", "available", { id: "unused", title: "Fractions", status: "ready" }),
    proposal("p2", "conflict", { id: "clashing", title: "Number lines", status: "ready" }),
    proposal("p3", "needs", null)
  ], "mason");
  expect(rows.map(x => x.state)).toEqual(["scheduled", "ready", "conflict", "missing"]);
  expect(rows.find(x => x.id === "conflict").conflict.title).toBe("Dentist");
});

test("a family-wide holiday blocks all children; sibling appointments do not", () => {
  const day = "2026-10-19", s = slot("s",day,"09:00");
  const sibling = { id:"sibling", date:day,student_id:"oliver",start_time:"09:05",duration_minutes:45 };
  expect(calendarSlotConflict(s,[s,sibling])).toBeNull();
  expect(calendarSlotConflict(s,[s,{id:"holiday",date:day,student_id:null,event_type:"holiday",title:"Rest day"}])).not.toBeNull();
});

test("ordinary lesson events are never treated as timetable slots", () => {
  expect(isLearningSlot({ event_type:"lesson",title:"Lesson" })).toBe(false);
  expect(isLearningSlot({ event_type:"lesson",notes:"Suggested by Side-Quest for Oliver" })).toBe(true);
  expect(isLearningSlot({ event_type:"timetable" })).toBe(true);
});

test("a saved library lesson is only proposed once even with stale duplicated proposals", () => {
  const day="2026-10-19";
  const events=[slot("one",day,"09:00"), slot("two",day,"10:00")];
  const match={id:"unused",title:"Fractions",status:"ready"};
  const rows=buildWeeklyLessonRows(events,[proposal("p1","one",match),proposal("p2","two",match)],"mason");
  expect(rows.map(x=>x.state)).toEqual(["ready","attention"]);
});
