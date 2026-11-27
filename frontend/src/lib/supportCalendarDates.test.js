import {gridDates,monthShift,shift,syd,intersects} from "./supportCalendarDates";
test("month grid includes all weeks, including December rollover",()=>{
 const dates=gridDates("2026-12");
 expect(dates[0]).toBe("2026-11-30");
 expect(dates[dates.length-1]).toBe("2027-01-03");
 expect(dates).toContain("2026-12-31");
 expect(monthShift("2026-12",1)).toBe("2027-01");
 expect(gridDates("2028-02")).toContain("2028-02-29");
});
test("Sydney midnight respects both sides of daylight saving",()=>{
 expect(syd("2026-12-07").toISOString()).toBe("2026-12-06T13:00:00.000Z");
 expect(syd("2027-06-01").toISOString()).toBe("2027-05-31T14:00:00.000Z");
 expect(syd(shift("2026-11-30",7)).toISOString()).toBe("2026-12-06T13:00:00.000Z");
});
test("whole week block appears on each day, not the next Monday",()=>{
 const block={kind:"block",start_at:"2026-11-29T13:00:00.000Z",end_at:"2026-12-06T13:00:00.000Z"};
 for(let i=0;i<7;i++)expect(intersects(block,shift("2026-11-30",i))).toBe(true);
 expect(intersects(block,"2026-12-07")).toBe(false);
});
test("preparation and wrap time spanning midnight appear on both days",()=>{
 const booking={kind:"appointment",start_at:"2026-12-06T13:05:00.000Z",end_at:"2026-12-06T13:35:00.000Z",prep_minutes:10,wrap_minutes:15};
 expect(intersects(booking,"2026-12-06")).toBe(true);
 expect(intersects(booking,"2026-12-07")).toBe(true);
 expect(intersects(booking,"2026-12-08")).toBe(false);
});
