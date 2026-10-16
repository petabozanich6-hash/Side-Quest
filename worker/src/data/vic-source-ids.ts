/** The historical #158 generated VIC module was empty on the source branch.
 * No Victoria outcomes may be offered as verified until the official identifiers
 * and correct subject/version mapping are restored and validated. */
export type VicSourceRecord = { code:string; learning_area:string; stage?:string; source:string; subject?:string; learning_areas?:string[]; subjects?:string[]; pathway?:string; pathways?:string[]; levels?:string[]; status?:string; source_url:string; from?:number; to?:number };
export const VIC_SOURCE_VERIFIED_IDS: VicSourceRecord[] = [];
