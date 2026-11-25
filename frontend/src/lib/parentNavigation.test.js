import {groupParentNav} from "./parentNavigation";
test("navigation puts daily tools first, preserves unknown future links and does not invent admin access",()=>{
 const items=[{to:"/parent/plan",testid:"nav-plan"},{to:"/parent/calendar",testid:"nav-calendar"},{to:"/parent",testid:"nav-dashboard"},{to:"/future",testid:"future"}];
 const groups=groupParentNav(items);
 expect(groups[0].items.map(x=>x.testid)).toEqual(["nav-dashboard","nav-calendar"]);
 expect(groups.flatMap(g=>g.items).map(x=>x.to).sort()).toEqual(items.map(x=>x.to).sort());
 expect(groups.some(g=>g.label==="Administration")).toBe(false);
});
