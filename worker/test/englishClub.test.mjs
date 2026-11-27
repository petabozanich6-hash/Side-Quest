import test from "node:test";
import assert from "node:assert/strict";
import {makeDb} from "./fakeD1.mjs";
import {createEnglishClass,enrolEnglishLearner,updateEnglishEnrolment,parentEnglishClasses,listEnglishClub,ensureEnglishClub} from "../src/englishClub.ts";
import {createBusyBlock} from "../src/supportDiary.ts";
import {readEnglishMaterials,saveEnglishMaterials,safeClubFallback,changeEnglishFile} from "../src/englishClubMaterials.ts";
import {attachClubIllustration,clubIllustrationPlan} from "../src/englishClubIllustrations.ts";
import {workshopResource as originalWorkshop} from "../src/englishClubWorkshopResources.ts";
import {presentationImage} from "../src/supportFiles.ts";
import {englishVideoState,prepareEnglishVideo,englishVideoToken,closeEnglishVideo} from "../src/englishClubVideo.ts";
const now=new Date("2026-12-07T00:00:00.000Z");
test("weekly English Club blocks tutor diary, limits eight places and preserves manual Square payment checks",async t=>{
 const db=makeDb();t.after(()=>db.raw.close());
 await ensureEnglishClub(db);await ensureEnglishClub(db);
 const start="2026-12-09T07:00:00.000Z";
 const created=await createEnglishClass(db,{start_at:start,topic:"Mystery detectives",preparation:"Private differentiated tasks",confirmed:true},now);
 assert.ok(created.id,JSON.stringify(created));
 assert.ok((await createEnglishClass(db,{start_at:"2026-12-10T00:00:00.000Z",topic:"Duplicate week",confirmed:true},now)).error);
 assert.ok((await createBusyBlock(db,{label:"Conflict",start_at:start,end_at:"2026-12-09T08:00:00.000Z"},now)).error);
 for(let i=0;i<9;i++)db.raw.prepare("INSERT INTO support_guest_requests(id,email,parent_name,subject,message,created_at,updated_at) VALUES(?,?,?,?,?,?,?)").run("club-"+i,"parent"+i+"@example.com","Parent "+i,"English Club: Year 5","Interest in a weekly class",now.toISOString(),now.toISOString());
 db.raw.prepare("INSERT INTO support_guest_requests(id,email,parent_name,subject,message,created_at,updated_at) VALUES(?,?,?,?,?,?,?)").run("regular","regular@example.com","Parent","Learning support: English / Year 5","Individual lesson",now.toISOString(),now.toISOString());
 assert.ok((await enrolEnglishLearner(db,created.id,{request_id:"regular",learner_label:"R",confirmed:true},now)).error);
 const ids=[];
 for(let i=0;i<8;i++){const r=await enrolEnglishLearner(db,created.id,{request_id:"club-"+i,learner_label:"Learner "+i,confirmed:true},now);assert.ok(r.id,JSON.stringify(r));ids.push(r.id);}
 assert.ok((await enrolEnglishLearner(db,created.id,{request_id:"club-8",learner_label:"Ninth",confirmed:true},now)).error);
 assert.ok((await enrolEnglishLearner(db,created.id,{request_id:"club-0",learner_label:"Duplicate",confirmed:true},now)).error);
 assert.equal(await updateEnglishEnrolment(db,created.id,ids[0],{action:"paid",amount_cents:1200,paid_in_square:true,paid_by_deadline:true,confirmed:true},now),false);
 assert.equal(await updateEnglishEnrolment(db,created.id,ids[0],{action:"invoice",invoice_reference:"SQ-1",issued_in_square:true,confirmed:true},now),true);
 assert.equal(await updateEnglishEnrolment(db,created.id,ids[0],{action:"paid",amount_cents:1100,paid_in_square:true,paid_by_deadline:true,confirmed:true},now),false);
 assert.equal(await updateEnglishEnrolment(db,created.id,ids[0],{action:"paid",amount_cents:1200,paid_in_square:true,paid_by_deadline:true,confirmed:true},now),true);
 assert.equal(await updateEnglishEnrolment(db,created.id,ids[0],{action:"cancel",checked_square:true,confirmed:true},now),false);
 assert.equal(await updateEnglishEnrolment(db,created.id,ids[1],{action:"cancel",checked_square:true,confirmed:true},now),true);
 assert.ok((await enrolEnglishLearner(db,created.id,{request_id:"club-8",learner_label:"Ninth",confirmed:true},now)).id);
 assert.deepEqual(await parentEnglishClasses(db,"club-0","parent1@example.com"),[]);
 const privateView=await parentEnglishClasses(db,"club-0","parent0@example.com");
 assert.equal(privateView.length,1);assert.equal(privateView[0].status,"paid");assert.equal(privateView[0].invoice_reference,"SQ-1");assert.ok(!JSON.stringify(privateView).includes("Private differentiated tasks"));assert.ok(!JSON.stringify(privateView).includes("Learner 1"));
 const env={DB:db,STAGING_KEY:"test",SUPPORT_ENGLISH_FALLBACK_TEST:"true"};
 const paidParent={requestId:"club-0",email:"parent0@example.com"},unpaidParent={requestId:"club-2",email:"parent2@example.com"};
 const url="https://zoom.us/j/123456789?pwd=example";
 assert.equal(safeClubFallback("https://zoom.us.evil.example/j/123"),null);
 assert.equal(safeClubFallback("javascript:alert(1)"),null);
 assert.equal(await saveEnglishMaterials(env,created.id,{prompts:"Imagine a mystery",fallback_url:url,fallback_open:true,confirmed:true,safeguards_confirmed:true},now),false);
 assert.equal(await saveEnglishMaterials(env,created.id,{prompts:"Imagine a mystery",fallback_url:url,fallback_open:false,confirmed:true},now),true);
 assert.equal((await readEnglishMaterials(env,created.id,paidParent,now)).prompts,"Imagine a mystery");
 assert.equal((await readEnglishMaterials(env,created.id,paidParent,now)).fallback_url,null);
 assert.equal(await readEnglishMaterials(env,created.id,unpaidParent,now),null);
 assert.equal(await readEnglishMaterials(env,created.id,{requestId:"club-0",email:"parent2@example.com"},now),null);
 const live=new Date(start);
 assert.equal(await saveEnglishMaterials(env,created.id,{prompts:"Imagine a mystery",fallback_url:url,fallback_open:true,confirmed:true,safeguards_confirmed:false},live),false);
 assert.equal(await saveEnglishMaterials(env,created.id,{prompts:"Imagine a mystery",fallback_url:url,fallback_open:true,confirmed:true,safeguards_confirmed:true},live),true);
 assert.equal((await readEnglishMaterials(env,created.id,paidParent,live)).fallback_url,url);
 assert.equal((await readEnglishMaterials(env,created.id,paidParent,new Date(Date.parse(start)+3600000))).fallback_url,null);
 assert.equal((await readEnglishMaterials({...env,STAGING_KEY:undefined},created.id,paidParent,live)).fallback_url,null);
 assert.equal(await changeEnglishFile(db,created.id,"nonexistent",true),false);
 const fid="11111111-2222-4333-8444-555555555555",privateId="22222222-3333-4444-8555-666666666666";
 db.raw.prepare("INSERT INTO support_english_workshop_resources(class_id,resource_json) VALUES(?,?)").run(created.id,JSON.stringify(originalWorkshop(0)));
 await presentationImage(db,fid);
 const insert=db.raw.prepare("INSERT INTO support_files(id,title,subject,year_level,filename,mime,size_bytes,storage_key,audience,status,created_at) VALUES(?,?,?,?,?,?,?,?,?,'active',?)");
 insert.run(fid,"Reviewed artwork","English","Mixed ages","scene.jpg","image/jpeg",10,"support-private/"+fid,"learner",now.toISOString());
 insert.run(privateId,"Private artwork","English","Mixed ages","private.jpg","image/jpeg",10,"support-private/"+privateId,"tutor",now.toISOString());
 assert.equal(await attachClubIllustration(db,created.id,{slide_index:0,file_id:privateId,confirmed:true}),false);
 assert.equal(await attachClubIllustration(db,created.id,{slide_index:8,file_id:fid,confirmed:true}),false);
 assert.equal(await attachClubIllustration(db,created.id,{slide_index:0,file_id:fid,confirmed:false}),false);
 assert.equal(await attachClubIllustration(db,created.id,{slide_index:0,file_id:fid,confirmed:true}),true);
 const prepared=await readEnglishMaterials(env,created.id,undefined,now);
 assert.equal(prepared.illustrations[0].file_id,fid);
 const learner=await readEnglishMaterials(env,created.id,paidParent,now);
 assert.equal(learner.illustrations,undefined);
 assert.deepEqual(learner.workshop,originalWorkshop(0));
 assert.ok(!JSON.stringify(learner).includes(fid));
 assert.equal(learner.files.length,0);
 assert.equal(await attachClubIllustration(db,created.id,{slide_index:0,file_id:null,confirmed:true}),true);
 assert.equal((await readEnglishMaterials(env,created.id,undefined,now)).illustrations[0].file_id,undefined);
 const video={...env,SUPPORT_CLASSROOM_ENABLED:"true",SUPPORT_ENGLISH_VIDEO_TEST:"true",SUPPORT_VIDEO_ACCOUNT:"account",SUPPORT_VIDEO_APP:"app",SUPPORT_VIDEO_TOKEN:"test",SUPPORT_ENGLISH_VIDEO_HOST_PRESET:"host",SUPPORT_ENGLISH_VIDEO_LEARNER_PRESET:"learner"};
 const calls=[];
 const fake=async(url,options)=>{calls.push({url,method:options.method,body:JSON.parse(options.body)});return new Response(JSON.stringify({success:true,data:{id:"meeting",token:"test-token"}}),{headers:{"Content-Type":"application/json"}});};
 assert.equal((await englishVideoState(video,created.id,paidParent,now)).open,false);
 assert.ok((await prepareEnglishVideo(video,created.id,fake,now)).error);
 assert.equal(calls.length,0);
 assert.ok((await prepareEnglishVideo(video,created.id,fake,live)).ok);
 assert.equal((await englishVideoState(video,created.id,paidParent,live)).open,true);
 assert.equal((await englishVideoState(video,created.id,unpaidParent,live)).open,false);
 assert.ok((await englishVideoToken(video,created.id,unpaidParent,fake,live)).error);
 assert.equal(calls.length,1);
 assert.equal(await closeEnglishVideo(video,created.id,fake),true);
 assert.equal((await englishVideoState(video,created.id,paidParent,live)).open,false);
 const roster=await listEnglishClub(db);assert.equal(roster.roster.filter(r=>r.status!=="cancelled").length,8);assert.equal(roster.enquiries.length,9);
 assert.equal(await updateEnglishEnrolment(db,created.id,ids[0],{action:"attendance",attendance:"present",confirmed:true},now),false);
 assert.equal(await updateEnglishEnrolment(db,created.id,ids[0],{action:"attendance",attendance:"present",confirmed:true},new Date(start)),true);
});


test("Author-led workshop preset saves six private lesson plans and only public descriptions in booking catalogue",async t=>{
 const db=makeDb();t.after(()=>db.raw.close());
 const {STORY_QUEST,storyQuestPreparation}=await import("../src/englishClubCurriculum.ts");
 const {createEnglishRound,listEnglishRounds,setEnglishRoundPublished}=await import("../src/englishClubRounds.ts");
 const {listEnglishSingleClasses}=await import("../src/englishClubSelfService.ts");
 const {validateActivityTemplate}=await import("../src/supportActivityLibrary.ts");
 assert.equal(STORY_QUEST.sessions.length,6);
 assert.equal(STORY_QUEST.id,"english-author-workshop-v2");
 assert.deepEqual(STORY_QUEST.sessions.map(s=>s.title),["The Power of Words","Between the Lines","The Human Condition","The Art of Storytelling","Words That Challenge the World","From Idea to Impact"]);
 for(const s of STORY_QUEST.sessions){assert.equal(s.agenda.length,7);assert.equal(s.activities.length,2);assert.ok(s.support.includes("extension:"));}
 for(const s of STORY_QUEST.sessions)for(const a of s.activities)assert.ok(validateActivityTemplate({...a,subject:"English",year_level:"Mixed levels"}));
 const body={curriculum_id:STORY_QUEST.id,reviewed_activities:true,title:STORY_QUEST.title,description:STORY_QUEST.description,first_local:"2026-12-09T18:00",session_count:6,themes:STORY_QUEST.sessions.map(s=>s.title),confirmed:true};
 assert.ok((await createEnglishRound(db,"owner",{...body,themes:body.themes.map((v,i)=>i===0?"Changed":v)},now)).error);
 assert.ok((await createEnglishRound(db,"owner",{...body,reviewed_activities:false},now)).error);
 assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM support_activity_templates").get().n,0);
 const result=await createEnglishRound(db,"owner",body,now);assert.ok(result.id,JSON.stringify(result));
 const rows=db.raw.prepare("SELECT c.id,c.preparation,c.public_description FROM support_english_classes c JOIN support_english_round_classes x ON x.class_id=c.id WHERE x.round_id=? ORDER BY x.sequence").all(result.id);
 assert.equal(rows.length,6);
 rows.forEach((r,i)=>{assert.equal(r.preparation,storyQuestPreparation(i));for(const phase of ["Icebreaker","I teach","I demonstrate","We practise together","You try independently","Adapt and give feedback","Exit check"])assert.ok(r.preparation.includes(phase));assert.equal(r.public_description,STORY_QUEST.sessions[i].description);});
 const {workshopResource}=await import("../src/englishClubWorkshopResources.ts");
 assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM support_english_workshop_resources").get().n,6);
 for(const [i,r] of rows.entries()){
  const v=await readEnglishMaterials({DB:db},r.id,undefined,now);
  assert.deepEqual(v.workshop,workshopResource(i));assert.equal(v.illustrations.length,3);assert.deepEqual(v.illustrations.map(p=>p.slide_index),[0,2,4]);assert.deepEqual(v.illustrations,clubIllustrationPlan(v.workshop));assert.equal(v.workshop.slides.length,9);assert.equal(v.workshop.slides[3].cards.length,2);assert.equal(v.workshop.tasks.length,3);
  assert.equal(await readEnglishMaterials({DB:db},r.id,{requestId:"unknown",email:"unknown@example.com"},now),null);
  assert.ok(!JSON.stringify(v.workshop).includes("60-minute facilitator plan"));assert.ok(!JSON.stringify(v.workshop).includes("I teach — explicit concept"));assert.ok(!JSON.stringify(v.workshop).includes("We practise together:"));
 }
 const {readActivityPlan}=await import("../src/supportActivityPlans.ts");
 const {getActivityTemplate}=await import("../src/supportActivityLibrary.ts");
 for(const [i,r] of rows.entries()){
  const p=await readActivityPlan(db,"club",r.id);assert.equal(p.items.length,2);
  for(const [j,item] of p.items.entries()){
   assert.equal(item.ready,true);assert.equal(item.revision,1);
   const a=await getActivityTemplate(db,item.template_id),expected=STORY_QUEST.sessions[i].activities[j];
   assert.equal(a.question,expected.question);assert.equal(a.type,expected.type);assert.equal(a.status,"reviewed");
  }
 }
 assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM support_activity_templates").get().n,12);
 assert.ok((await createEnglishRound(db,"owner",body,now)).error);
 assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM support_activity_templates").get().n,12);
 assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM support_english_workshop_resources").get().n,6);
 assert.equal((await listEnglishRounds(db,true,now)).length,0);
 assert.equal(await setEnglishRoundPublished(db,result.id,{published:true,confirmed:true},now),true);
 const rounds=await listEnglishRounds(db,true,now),singles=await listEnglishSingleClasses(db,now);
 assert.equal(rounds[0].classes.length,6);assert.equal(singles.length,6);
 for(const [i,s] of singles.entries())assert.equal(s.description,STORY_QUEST.sessions[i].description);
 for(const result of [rounds,singles]){assert.ok(!JSON.stringify(result).includes("60-minute facilitator plan"));assert.ok(!JSON.stringify(result).includes("Original reading:"));}
});


test("all six English Club icebreakers are distinct five-minute opening steps with participation choices",async()=>{
 const {englishTeachingGuide}=await import("../src/englishClubTeachingGuides.ts");
 const titles=new Set();
 for(let i=0;i<6;i++){
  const steps=englishTeachingGuide(i).split("\n\n");
  assert.equal(steps.length,7);
  const opening=steps[0];
  assert.match(opening,/^0–5 min \| Icebreaker — [^:]+: /);
  assert.match(opening,/permission to pass/);
  assert.match(opening,/Transition:/);
  titles.add(opening.split(": ")[0]);
  assert.match(steps[1],/^5–13 min \| I teach/);
  assert.match(steps[6],/^57–60 min \| Exit check/);
 }
 assert.equal(titles.size,6);
 assert.equal(englishTeachingGuide(-1),"");
 assert.equal(englishTeachingGuide(6),"");
});


test("junior and teen creative camps can run in the same week without overlapping or replacing legacy rounds",async t=>{
 const db=makeDb();t.after(()=>db.raw.close());
 const {CREATIVE_CAMPS,campPreparation,campResource}=await import("../src/englishClubCreativeCamps.ts");
 const {createEnglishRound,listEnglishRounds}=await import("../src/englishClubRounds.ts");
 const {validateActivityTemplate}=await import("../src/supportActivityLibrary.ts");
 const [junior,teen]=CREATIVE_CAMPS;
 assert.deepEqual(CREATIVE_CAMPS.map(c=>c.age),["8–11","12–16"]);
 const spec=(c,first_local)=>({curriculum_id:c.id,title:c.title,description:c.description,first_local,session_count:6,themes:c.sessions.map(s=>s.title),reviewed_activities:true,confirmed:true});
 const j=await createEnglishRound(db,"owner",spec(junior,"2026-12-09T16:00"),now);assert.ok(j.id,JSON.stringify(j));
 assert.ok((await createEnglishRound(db,"owner",spec(teen,"2026-12-09T16:00"),now)).error);
 const s=await createEnglishRound(db,"owner",spec(teen,"2026-12-09T18:00"),now);assert.ok(s.id,JSON.stringify(s));
 assert.ok((await createEnglishRound(db,"owner",spec(junior,"2026-12-10T16:00"),now)).error);
 const rounds=await listEnglishRounds(db);assert.equal(rounds.length,2);
 assert.deepEqual(rounds.map(r=>r.age_group),["8–11","12–16"]);
 assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM support_english_classes").get().n,12);
 assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM support_activity_templates").get().n,24);
 assert.equal((await listEnglishRounds(db,true,now)).length,0);
 for(const c of CREATIVE_CAMPS)for(const [i,session] of c.sessions.entries()){
  const prep=campPreparation(c.id,i),resource=campResource(c.id,i);
  for(const p of ["Icebreaker","Book chat","Author demonstration","Creative game together","Make your own","Celebrate","Book discovery"])assert.ok(prep.includes(p));
  assert.equal(resource.slides.length,9);
  assert.ok(clubIllustrationPlan(resource).length);
  for(const a of session.activities)assert.ok(validateActivityTemplate({...a,subject:"English",year_level:"Ages "+c.age}));
 }
});
