import {blankCreative,creativeReady,creativeText,appendCreative,suggestedCreativeTool} from "./academyCreativeTools";
test("character forge requires a meaningful want and obstacle, and preserves existing work",()=>{
 const d={...blankCreative("character"),name:"Dot",want:"A button",obstacle:"A magpie guards it"};
 expect(creativeReady("character",d)).toBe(true);
 expect(appendCreative("My existing story","character",d)).toBe("My existing story\n\n"+creativeText("character",d));
 expect(appendCreative("x".repeat(12000),"character",d)).toBeNull();
 expect(creativeReady("character",{...d,obstacle:" "})).toBe(false);
});
test("world atlas connects place and sensory detail to an invented rule",()=>{
 const d={...blankCreative("world"),name:"Cloud town",rule:"Everything floats",place1:"Bakery",sense1:"Cinnamon",consequence:"The bread escapes"};
 expect(creativeReady("world",d)).toBe(true);
 expect(creativeText("world",d)).toContain("Consequence of the rule: The bread escapes");
 expect(creativeReady("world",{...d,sense1:""})).toBe(false);
});
test("branch map allows two creative paths but requires different decisions and consequences",()=>{
 const d={...blankCreative("branch"),opening:"Two doors",choiceA:"Open one",resultA:"Shrink",choiceB:"Climb upstairs",resultB:"Meet a cloud"};
 expect(creativeReady("branch",d)).toBe(true);
 expect(creativeReady("branch",{...d,choiceB:" OPEN ONE "})).toBe(false);
 expect(creativeReady("branch",{...d,resultB:""})).toBe(false);
 expect(creativeText("branch",d)).toContain("Path B · choice: Climb upstairs");
});
test("workshops suggest relevant tools without restricting choice",()=>{
 expect(suggestedCreativeTool("junior",4)).toBe("world");
 expect(suggestedCreativeTool("teen",3)).toBe("world");
 expect(suggestedCreativeTool("adult",3)).toBe("branch");
});
