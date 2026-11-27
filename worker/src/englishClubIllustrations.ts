import {adultStudioIllustrationStory,ADULT_STUDIO} from "./writersAcademy";
import {campIllustrationStory} from "./englishClubCreativeCamps";
import {STORY_QUEST} from "./englishClubCurriculum";
import {validateIllustrationPlan} from "./supportIllustrations";
import {presentationImage} from "./supportFiles";

// Original scene briefs for the established nine-slide workshop sequence.
// Keep these separate from the learner-facing resource.
const scenes=[
 [["Dragon bell", "A playful original dragon beside an empty school bell bracket in a cheerful school courtyard, curious students in the distance.", "Imagine contrasting headlines."],["The shade tree", "A large leafy shade tree in a public park with benches and an empty noticeboard, a thoughtful balanced composition.", "Notice what different descriptions emphasise."],["The closed gate", "A school entrance with a closed gate and a maintenance worker, no signage or words, another path visible.", "Frame one event for different audiences."]],
 [["The innocent cat","A cat sitting beside a fallen vase in a living room, ambiguous expression, no visual indication of how the vase fell.","Separate what is visible from what is guessed."],["The hidden photograph","A fictional person placing a framed photograph face down in a drawer, a second person in the doorway, subtle neutral atmosphere.","Observe actions without assuming motives."],["The folded letter","A fictional character sitting at a desk folding a letter, face partly turned away, ambiguous mood.","Explore possible subtext."]],
 [["One lantern","Two original fantasy explorers standing near the entrance of a cave with a lantern on a stone ledge, no danger or distress.","Discuss competing fictional priorities."],["Competition day","Two fictional entrants approaching a community competition table with creative projects, a neutral organiser, balanced framing.","Compare viewpoints without casting a villain."],["Shared studio","A welcoming art studio with a single empty work chair and two fictional artists nearby, no implied winner.","Explore competing needs and possible outcomes."]],
 [["Story scramble","A whimsical original dragon, a cake on a table and a school alarm fixture in one playful scene, no implied cause or sequence.","Invite different story orders."],["The moving train","Atmospheric view inside a train carriage with a folded note on an empty seat, dusk outside, no readable text.","Discuss suspense and withheld information."],["The locked door","A mysterious closed wooden door, a keyring resting nearby and a softly lit corridor, no frightening details.","Experiment with narrative openings."]],
 [["Pigeon hats","Humorous original illustration of pigeons in a town square, one wearing a tiny hat, others not, no signs or text.","Introduce claims, reasons and evidence."],["The library proposal","A community library containing quiet reading chairs and collaborative study tables, neutral balanced composition.","Visualise competing uses of shared space."],["Community garden","A welcoming shared garden with a closed gate, paths and vegetable beds, no signage or identifiable people.","Discuss evidence needed for an opening-hours proposal."]],
 [["The unexpected visitor","Original friendly dragon entering a room, expressive silhouette and ambiguous atmosphere, no words.","Try different moods through sentence choices."],["The late letter","An unopened envelope on a desk beside a window, a fictional person's hand reaching towards it, no visible handwriting.","Consider detail, pacing and reader expectations."],["The writing studio","An inviting writer's workspace with notebooks, pens and scattered unmarked pages, soft daylight.","Encourage drafting and purposeful revision."]]
] as const;
export function clubIllustrationPlan(workshop:any){
 const index=STORY_QUEST.sessions.findIndex(s=>s.title===workshop?.title);
 if(!Array.isArray(workshop?.slides)||workshop.slides.length!==9)return [];
 const adult=adultStudioIllustrationStory(workshop),camp=adult||campIllustrationStory(workshop);
 if(index<0&&!camp)return [];
 const plan=camp||scenes[index].map(([title,brief,purpose],i)=>({slide_index:[0,2,4][i],title,brief,purpose}));
 const attached=workshop.illustration_files;
 return validateIllustrationPlan(plan.map(p=>({...p,...(typeof attached?.[p.slide_index]==="string"?{file_id:attached[p.slide_index]}:{})})),adult?ADULT_STUDIO.minutes:60,9)||[];
}
export async function attachClubIllustration(db:D1Database,cid:string,b:any){
 if(b?.confirmed!==true||!Number.isInteger(b.slide_index)||!(b.file_id===null||typeof b.file_id==="string"))return false;
 const row=await db.prepare("SELECT resource_json FROM support_english_workshop_resources WHERE class_id=?").bind(cid).first<{resource_json:string}>();
 if(!row)return false;
 const workshop=JSON.parse(row.resource_json),plan=clubIllustrationPlan(workshop);
 if(!plan.some(p=>p.slide_index===b.slide_index))return false;
 if(b.file_id!==null&&(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(b.file_id)||!await presentationImage(db,b.file_id)))return false;
 const files=Object.fromEntries(plan.filter(p=>p.file_id).map(p=>[p.slide_index,p.file_id]));
 if(b.file_id===null)delete files[b.slide_index];else files[b.slide_index]=b.file_id;
 const next=JSON.stringify({...workshop,illustration_files:files});
 // Compare the original snapshot to avoid overwriting concurrent edits.
 return !!(await db.prepare("UPDATE support_english_workshop_resources SET resource_json=? WHERE class_id=? AND resource_json=?").bind(next,cid,row.resource_json).run()).meta?.changes;
}
