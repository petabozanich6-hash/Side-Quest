export const LEARNING_SUPPORT_SUBJECTS = ["English","Mathematics","Science","Humanities and social sciences","History","Geography","Technology","Creative arts","Health and physical education","Languages","General learning support","Other"] as const;
export const LEARNING_SUPPORT_YEARS = ["Foundation","Year 1","Year 2","Year 3","Year 4","Year 5","Year 6","Year 7","Year 8","Year 9","Year 10","Year 11","Year 12","Mixed year levels / parent support"] as const;
export const LEARNING_SUPPORT_SERVICES = ["Live online support","Worked explanation","Personalised activities","Catch-up or extension","Homework or project guidance","Feedback on completed work","Parent consultation","Not sure yet"] as const;
export const LEARNING_SUPPORT_HINT = "learning-support";
export function parseLearningSupport(input: Record<string, unknown>) {
 const member = (list: readonly string[], value: unknown): value is string => typeof value === "string" && list.includes(value);
 if (!member(LEARNING_SUPPORT_SUBJECTS,input.subject) || !member(LEARNING_SUPPORT_YEARS,input.year) || !member(LEARNING_SUPPORT_SERVICES,input.service)) return {error:"Choose a year level, learning area and support type."} as const;
 if (input.consent !== true) return {error:"A parent or guardian must confirm the enquiry."} as const;
 if (typeof input.detail !== "string" || input.detail.trim().length < 10 || input.detail.trim().length > 3000) return {error:"Describe the learning need in 10 to 3000 characters."} as const;
 const guided=[["strengths","What is going well"],["interests","Interests and favourite topics"],["preferences","Learning preferences"],["goal","Parent goals"],["availability","Preferred times / flexibility"]] as const;
 const extras:string[]=[];
 for(const [key,label] of guided){const value=input[key];if(value===undefined||value==="")continue;if(typeof value!=="string"||value.trim().length>300)return {error:label+" must be 300 characters or fewer."} as const;if(value.trim())extras.push(label+": "+value.trim());}
 if(extras.length&&input.detail.trim().length>1800)return {error:"Keep the main learning need to 1800 characters when adding guided details."} as const;
 return { category:"other",page_hint:LEARNING_SUPPORT_HINT,subject:"Learning support: "+input.subject+" / "+input.year,
 message:["Year level: "+input.year,"Learning area: "+input.subject,"Preferred support: "+input.service,"Parent confirms enquiry and no payment commitment.","Learning needs: "+input.detail.trim(),...extras].join("\n") } as const;
}
