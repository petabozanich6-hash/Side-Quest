// All existing links remain reachable; grouping changes presentation, not authorisation.
const GROUPS=[
 ["Your family",["nav-dashboard","nav-children","nav-calendar","nav-assignments"]],
 ["Plan & teach",["nav-lessons","nav-learning-support","nav-curriculum","nav-plans","nav-homeschool-compass"]],
 ["Progress & records",["nav-outcomes","nav-evidence","nav-reading","nav-life"]],
 ["Learning resources",["nav-resources","nav-dragons-library","nav-word-hoard","nav-handwriting-book","nav-hands-on-vault","nav-sidequest"]],
 ["Account & help",["nav-plan","nav-trust","nav-feedback"]],
 ["Administration",["nav-command-centre","nav-lesson-review-centre"]]
];
export function groupParentNav(items){
 const used=new Set();
 const groups=GROUPS.map(([label,ids])=>({label,items:ids.flatMap(id=>items.filter(item=>item.testid===id)).filter(item=>{if(used.has(item.to))return false;used.add(item.to);return true;})})).filter(group=>group.items.length);
 const other=items.filter(item=>!used.has(item.to));
 if(other.length)groups.push({label:"More tools",items:other});
 return groups;
}
