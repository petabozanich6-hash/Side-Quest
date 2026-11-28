// Creative tools are local draft composers; only explicit insertion + journal save persists text.
export const creativeKinds=["character","world","branch"];
export const creativeFields={
 character:["name","role","want","obstacle","quirk","choice"],
 world:["name","rule","place1","sense1","place2","sense2","place3","sense3","consequence"],
 branch:["opening","choiceA","resultA","nextA","choiceB","resultB","nextB"]
};
export function blankCreative(kind){return Object.fromEntries((creativeFields[kind]||[]).map(k=>[k,""]));}
export function creativeText(kind,d){
 const v=k=>typeof d?.[k]==="string"?d[k].trim():"";
 const line=(label,k)=>v(k)?label+": "+v(k):"";
 if(kind==="character")return ["CHARACTER DOSSIER",line("Name","name"),line("Role","role"),line("What they want","want"),line("What gets in the way","obstacle"),line("Distinctive detail","quirk"),line("Choice under pressure","choice")].filter(Boolean).join("\n");
 if(kind==="world")return ["WORLD ATLAS",line("World","name"),line("Rule","rule"),...[1,2,3].flatMap(n=>[line("Place "+n,"place"+n),line("Sensory detail","sense"+n)]),line("Consequence of the rule","consequence")].filter(Boolean).join("\n");
 if(kind==="branch")return ["BRANCHING STORY MAP",line("Opening","opening"),line("Path A · choice","choiceA"),line("Because of that","resultA"),line("Next","nextA"),line("Path B · choice","choiceB"),line("Because of that","resultB"),line("Next","nextB")].filter(Boolean).join("\n");
 return "";
}
export function creativeReady(kind,d){
 const has=k=>typeof d?.[k]==="string"&&!!d[k].trim();
 return kind==="character"?["name","want","obstacle"].every(has):kind==="world"?["name","rule","place1","sense1","consequence"].every(has):kind==="branch"?["opening","choiceA","resultA","choiceB","resultB"].every(has)&&d.choiceA.trim().toLowerCase()!==d.choiceB.trim().toLowerCase():false;
}
export function appendCreative(existing,kind,d,limit=12000){
 if(typeof existing!=="string"||!creativeReady(kind,d))return null;
 const value=[existing,creativeText(kind,d)].filter(Boolean).join("\n\n");
 return value.length<=limit?value:null;
}
export function suggestedCreativeTool(track,sequence){
 if(track==="junior")return ({2:"character",3:"branch",4:"world",5:"branch"})[sequence]||"character";
 if(track==="teen")return ({2:"character",3:"world",4:"branch",5:"branch"})[sequence]||"character";
 return ({2:"character",3:"branch",4:"character"})[sequence]||"world";
}
