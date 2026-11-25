export const LEARNING_SUPPORT_SUBJECTS = ["English","Mathematics","Science","Humanities and social sciences","History","Geography","Technology","Creative arts","Health and physical education","Languages","General learning support","Other"] as const;
export const LEARNING_SUPPORT_YEARS = ["Foundation","Year 1","Year 2","Year 3","Year 4","Year 5","Year 6","Year 7","Year 8","Year 9","Year 10","Year 11","Year 12","Mixed year levels / parent support"] as const;
export const LEARNING_SUPPORT_SERVICES = ["Live online support","Worked explanation","Personalised activities","Catch-up or extension","Homework or project guidance","Feedback on completed work","Parent consultation","Not sure yet"] as const;
export const LEARNING_SUPPORT_HINT = "learning-support";
export function parseLearningSupport(input: Record<string, unknown>) {
 const member = (list: readonly string[], value: unknown): value is string => typeof value === "string" && list.includes(value);
 if (!member(LEARNING_SUPPORT_SUBJECTS,input.subject) || !member(LEARNING_SUPPORT_YEARS,input.year) || !member(LEARNING_SUPPORT_SERVICES,input.service)) return {error:"Choose a year level, learning area and support type."} as const;
 if (input.consent !== true) return {error:"A parent or guardian must confirm the enquiry."} as const;
 if (typeof input.detail !== "string" || input.detail.trim().length < 10 || input.detail.trim().length > 3000) return {error:"Describe the learning need in 10 to 3000 characters."} as const;
 return { category:"other",page_hint:LEARNING_SUPPORT_HINT,subject:"Learning support: "+input.subject+" / "+input.year,
 message:["Year level: "+input.year,"Learning area: "+input.subject,"Preferred support: "+input.service,"Parent confirms enquiry and no payment commitment.","Learning needs: "+input.detail.trim()].join("\n") } as const;
}
