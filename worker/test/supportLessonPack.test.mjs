import test from "node:test";
import assert from "node:assert/strict";
import {makeDb} from "./fakeD1.mjs";
import {validateLessonPack,approveLessonPack,readLessonPack,generateLessonPack,generateReusableLessonPack,listReusableLessonPacks,getReusableLessonPack,saveReusableLessonPack,useReusableLessonPack,readPrivateLessonDraft,checkpointPrivateLessonDraft,discardPrivateLessonDraft,extractLessonPackResponse,normaliseGeneratedLessonPack,REASONING_LESSON_MODEL,lessonTheme,icebreakerMinutes} from "../src/supportLessonPack.ts";
import {fractionPack} from "../src/supportFractionPack.ts";
import {validateSlideVisual,initialSlideInteraction,changeSlideInteraction} from "../src/supportSlideVisuals.ts";
import {classroomState,setClassroomOpen,editClassroom,canReadClassroomImage} from "../src/supportClassrooms.ts";
import {presentationImage,archiveResource} from "../src/supportFiles.ts";
const pack=fractionPack("Equivalent fractions","Mathematics","Year 4","Understand and identify equivalent fractions using visual models.",30);
pack.slides[0].notes+=" PRIVATE-SOLUTION";
pack.icebreaker.script+=" PRIVATE-ICEBREAKER";
pack.worksheet[0].answer+=" PRIVATE-WORKSHEET-1";
function setup(){
 const db=makeDb(),now=new Date(),at=now.toISOString(),end=new Date(now.getTime()+30*60000).toISOString();
 db.raw.prepare("INSERT INTO support_guest_requests(id,email,parent_name,subject,message,created_at,updated_at) VALUES(?,?,?,?,?,?,?)").run("pack-request","pack@example.com","Test parent","Maths","Test request",at,at);
 for(const id of ["pack-one","pack-two"])db.raw.prepare("INSERT INTO support_service_orders(id,channel,request_id,quote_id,amount_cents,scope,delivery,terms,mode,start_at,end_at,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)").run(id,"guest","pack-request",id+"-quote",0,"Maths","Online","Terms","live",at,end,"paid",at,at);
 return {db,now};
}
test("validate complete resource pack and reject invalid answers and repeated prompts",()=>{
 assert.ok(validateLessonPack(pack));
 assert.deepEqual(validateLessonPack({...pack,worksheet:[]}).worksheet,[]);
 assert.equal(validateLessonPack({...pack,activities:[{...pack.activities[0],answer_key:"wrong"},pack.activities[1]]}),null);
 assert.equal(validateLessonPack({...pack,activities:[pack.activities[0],pack.activities[0]]}),null);
});
test("approval is scoped, atomic, preserves an existing plan, and only learner slide is presented",async()=>{
 const {db,now}=setup();
 assert.ok((await approveLessonPack(db,"guest","wrong","pack-one",{pack,confirmed:true})).error);
 assert.ok((await approveLessonPack(db,"guest","pack-request","pack-one",{pack,confirmed:false})).error);
 const result=await approveLessonPack(db,"guest","pack-request","pack-one",{pack,confirmed:true});
 assert.ok(result.saved,JSON.stringify(result));
 assert.equal((await readLessonPack(db,"guest","wrong","pack-one")),null);
 assert.equal((await readLessonPack(db,"guest","pack-request","pack-one")).saved.pack.worksheet[0].answer,pack.worksheet[0].answer);
 assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM support_activity_templates WHERE status='reviewed'").get().n,2);
 assert.equal(JSON.parse(db.raw.prepare("SELECT items_json FROM support_session_activity_plans WHERE session_id='pack-one'").get().items_json).length,2);
 assert.ok((await approveLessonPack(db,"guest","pack-request","pack-one",{pack,confirmed:true})).error);
 db.raw.prepare("INSERT INTO support_session_activity_plans(kind,session_id,items_json,updated_at) VALUES('tutoring','pack-two','[]',?)").run(now.toISOString());
 assert.ok((await approveLessonPack(db,"guest","pack-request","pack-two",{pack,confirmed:true})).error);
 assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM support_activity_templates WHERE status='reviewed'").get().n,2);
 assert.equal(await setClassroomOpen(db,"guest","pack-request","pack-one",true,now),true);
 assert.equal((await editClassroom(db,"guest","pack-request","pack-one",true,{action:"present",deck_id:result.saved.deck_id,deck_revision:1,index:0,revision:0},now)).ok,true);
 const state=await classroomState(db,"guest","pack-request","pack-one",false,now);
 assert.equal(state.board.slide.body,pack.slides[0].body);
 assert.deepEqual(state.board.slide.visual,pack.slides[0].visual);
 assert.equal(JSON.stringify(state).includes("PRIVATE-SOLUTION"),false);
 assert.equal(JSON.stringify(state).includes("PRIVATE-ICEBREAKER"),false);
 assert.equal(JSON.stringify(state).includes("PRIVATE-WORKSHEET"),false);
});
test("AI pack generation fails closed when the isolated pilot is disabled",async()=>{
 let called=false;
 const {db}=setup(),e={DB:db,AI:{run:async()=>{called=true;return {}}}};
 const r=await generateLessonPack(e,{},"guest","pack-request","pack-one",{});
 assert.ok(r.error);
 assert.equal(called,false);
});

test("reject screenshot-like short vague notes, long primary paragraphs and text-only slides",()=>{
 for(const bad of [{...pack.slides[0],notes:"Work through the example step by step, explaining why."},{...pack.slides[0],body:"Long ".repeat(100)},{...pack.slides[0],visual:undefined}]){
  assert.equal(validateLessonPack({...pack,slides:[bad,...pack.slides.slice(1)]}),null);
 }
 assert.equal(fractionPack("Equivalent fractions","Mathematics","Year 7","Understand and identify equivalent fractions using visual models.",30),null);
 assert.equal(fractionPack("Equivalent fractions","Mathematics","Year 4","Convert fractions to decimals",30),null);
 assert.equal(validateSlideVisual({type:"fraction-bars",rows:[{total:4,shaded:5}]}),null);
 assert.deepEqual(validateSlideVisual({type:"fraction-build",total:6,answer:4,notes:"private"}),{type:"fraction-build",total:6});
});

test("requires actual instruction, modelling, guided and independent practice and assessment in order",()=>{
 const valid=validateLessonPack(pack,30);
 assert.ok(valid);
 assert.equal(valid.sequence.reduce((n,s)=>n+s.minutes,0),30);
 assert.equal(validateLessonPack(pack,45),null);
 assert.equal(validateLessonPack({...pack,sequence:undefined}),null);
 assert.equal(validateLessonPack({...pack,sequence:pack.sequence.map((s,i)=>i===4?{...s,phase:"guided"}:s)},30),null);
 assert.equal(validateLessonPack({...pack,sequence:pack.sequence.map((s,i)=>i===0?{...s,minutes:1}:i===1||i===2?{...s,minutes:1}:i===3?{...s,minutes:18}:s)},30),null);
 assert.equal(validateLessonPack({...pack,sequence:pack.sequence.map((s,i)=>i===0?{...s,phase:"model"}:s)},30),null);
});

test("shared visual controls respect roles, classroom scope, bounds and current slide",async t=>{
 const {db,now}=setup();t.after(()=>db.raw.close());
 const result=await approveLessonPack(db,"guest","pack-request","pack-one",{pack,confirmed:true});
 assert.ok(result.saved);
 assert.equal(await setClassroomOpen(db,"guest","pack-request","pack-one",true,now),true);
 const read=(owner=false)=>classroomState(db,"guest","pack-request","pack-one",owner,now);
 const edit=async(owner,body)=>editClassroom(db,"guest","pack-request","pack-one",owner,{...body,revision:(await read(owner)).revision},now);
 const present=index=>edit(true,{action:"present",deck_id:result.saved.deck_id,deck_revision:1,index});
 assert.ok((await present(0)).ok);
 const first=(await read()).board.slide.interaction;
 assert.equal(first.reveal,1);
 const action=(operation,extra={})=>({action:"slide-interact",visual_id:first.id,operation,...extra});
 assert.ok((await edit(false,action("reveal"))).error);
 assert.ok((await edit(true,action("reveal"))).ok);
 assert.equal((await read()).board.slide.interaction.reveal,2);
 assert.ok((await edit(true,action("reveal"))).error);
 assert.ok((await present(3)).ok);
 assert.ok((await edit(true,action("reveal"))).error);
 const id=(await read()).board.slide.interaction.id;
 const choose=(index)=>({action:"slide-interact",visual_id:id,operation:"toggle",index});
 assert.ok((await edit(true,choose(0))).error);
 assert.ok((await edit(false,choose(6))).error);
 assert.ok((await edit(false,choose(0))).ok);
 assert.ok((await edit(false,choose(2))).ok);
 assert.deepEqual((await read(true)).board.slide.interaction.selected,[0,2]);
 assert.ok((await edit(false,choose(0))).ok);
 assert.deepEqual((await read(true)).board.slide.interaction.selected,[2]);
 assert.ok((await edit(true,{action:"slide-interact",visual_id:id,operation:"reset"})).ok);
 assert.deepEqual((await read()).board.slide.interaction.selected,[]);
 assert.ok((await present(4)).ok);
 const selectId=(await read()).board.slide.interaction.id;
 assert.ok((await edit(false,{action:"slide-interact",visual_id:selectId,operation:"toggle",index:1})).ok);
 assert.deepEqual((await read(true)).board.slide.interaction.selected,[1]);
 assert.equal(JSON.stringify(await read()).includes("PRIVATE-SOLUTION"),false);
 assert.ok((await editClassroom(db,"guest","wrong","pack-one",false,{action:"slide-interact",visual_id:selectId,operation:"toggle",index:2,revision:0},now)).error);
 assert.equal(await setClassroomOpen(db,"guest","pack-request","pack-one",false,now),true);
 assert.ok((await edit(false,{action:"slide-interact",visual_id:selectId,operation:"toggle",index:2})).error);
});
test("interactive quality gate rejects passive practice and malformed models",()=>{
 assert.equal(validateLessonPack({...pack,slides:pack.slides.map((s,i)=>i===3?{...s,visual:{type:"steps",items:[{label:"A",body:"A"},{label:"B",body:"B"}]}}:s)},30),null);
 assert.equal(validateSlideVisual({type:"fraction-split",total:7,shaded:2,factor:3}),null);
 assert.deepEqual(validateSlideVisual({type:"select",items:["A","B"],answer:[0]}),{type:"select",items:["A","B"]});
 assert.deepEqual(validateSlideVisual({type:"order",items:["B","C","A"],answer:[2,0,1]}),{type:"order",items:["B","C","A"]});
});

test("contextual fraction quests only accept mathematically achievable equivalent shares",()=>{
 const raw={type:"fraction-quest",total:3,shaded:2,target_total:6,context:"pizza",answer:4,notes:"private"};
 assert.deepEqual(validateSlideVisual(raw),{type:"fraction-quest",total:3,shaded:2,target_total:6,context:"pizza"});
 for(const bad of [{target_total:5},{target_total:3},{total:0},{shaded:3},{context:"unknown"},{target_total:17}])assert.equal(validateSlideVisual({...raw,...bad}),null);
 const state=initialSlideInteraction(raw);
 const act=(s,operation,extra={},owner=false)=>changeSlideInteraction(raw,s,{visual_id:state.id,operation,...extra},owner);
 assert.equal(act(state,"check"),null);
 assert.equal(act(state,"toggle",{index:6}),null);
 assert.equal(act(state,"toggle",{index:0},true),null);
 const picked=act(state,"toggle",{index:1});
 assert.deepEqual(picked.selected,[1]);
 assert.equal(act(picked,"check",{},true),null);
 const checked=act(picked,"check");
 assert.equal(checked.checked,true);
 assert.deepEqual(checked.selected,[1]);
 assert.equal(act(checked,"toggle",{index:2}).checked,false);
 assert.equal(act(checked,"reset",{},true).checked,false);
 assert.equal(JSON.stringify(checked).includes("private"),false);
 assert.ok(validateLessonPack(pack,30));
 assert.equal(pack.slides[3].visual.type,"fraction-quest");
 assert.equal(pack.slides[5].visual.type,"fraction-quest");
});

test("cross-subject inquiry modules validate bounded content and keep solutions private",()=>{
 const reading={type:"evidence-quest",context:"reading",passage_title:"The unopened letter",prompt:"Highlight evidence that the character is reluctant to open the letter.",items:["She turned the envelope over.","Her hands trembled.","She put it back in the drawer.","Outside, a bird sang."],answer:[0,1,2]};
 const science={type:"sort-quest",prompt:"Classify observations and inferences.",groups:["Observation","Inference"],items:["The leaf is yellow.","The plant may need water.","The soil feels dry.","The plant may have a nutrient deficiency."],answer:[0,1,0,1]};
 const data={type:"data-quest",title:"Hypothetical plant growth after seven days",unit:"cm",prompt:"Select the two groups with the greatest growth.",rows:[{label:"A",value:1.25},{label:"B",value:3.4},{label:"C",value:4.1}],answer:[1,2]};
 for(const v of [reading,science,data]){
  const clean=validateSlideVisual(v);
  assert.ok(clean);
  assert.equal("answer" in clean,false);
  const state=initialSlideInteraction(v);
  const act=(s,operation,extra={},owner=false)=>changeSlideInteraction(v,s,{visual_id:state.id,operation,...extra},owner);
  assert.equal(act(state,"check"),null);
  if(v.type==="sort-quest"){
   assert.equal(act(state,"place",{index:0,direction:2}),null);
   assert.equal(act(state,"place",{index:0,direction:0},true),null);
   let next=state;
   for(let i=0;i<v.items.length;i++)next=act(next,"place",{index:i,direction:i%2});
   assert.deepEqual(next.placements,[0,1,0,1]);
   assert.equal(act(next,"check").checked,true);
   assert.equal(act(act(next,"check"),"place",{index:0,direction:-1}).checked,false);
   assert.deepEqual(act(next,"reset",{},true).placements,[-1,-1,-1,-1]);
  }else{
   assert.equal(act(state,"toggle",{index:99}),null);
   assert.equal(act(state,"toggle",{index:0},true),null);
   const picked=act(state,"toggle",{index:1});
   assert.deepEqual(picked.selected,[1]);
   assert.equal(act(picked,"check").checked,true);
   assert.equal(act(picked,"check",{},true),null);
  }
 }
 assert.equal(validateSlideVisual({...reading,context:"invalid"}),null);
 assert.equal(validateSlideVisual({...science,groups:["Observation","Observation"]}),null);
 assert.equal(validateSlideVisual({...data,rows:[{label:"A",value:2},{label:"B",value:-1},{label:"C",value:3}]}),null);
 assert.equal(validateLessonPack({...pack,slides:pack.slides.map((s,i)=>i===3||i===5?{...s,visual:{type:"select",items:["A","B"]}}:s)},30),null);
});

import {englishPack,sciencePack} from "./fixtures/supportInquiryPacks.mjs";
test("complete English and Science lessons meet the same explicit teaching and inquiry gates as Mathematics",()=>{
 for(const p of [englishPack,sciencePack]){
  const valid=validateLessonPack(p,30);
  assert.ok(valid,p.subject+" acceptance pack must be valid");
  assert.equal(valid.sequence.length,5);
  assert.ok(valid.slides.slice(2).every(s=>["evidence-quest","sort-quest","data-quest"].includes(s.visual.type)));
  assert.equal(validateLessonPack({...p,slides:p.slides.map((s,i)=>i>=2?{...s,visual:{type:"select",items:["A","B"]}}:s)},30),null);
 }
});
test("reviewed English and Science modules present learner content without tutor solutions",async()=>{
 const {db,now}=setup();
 try{
 for(const [p,oid] of [[englishPack,"pack-one"],[sciencePack,"pack-two"]]){
  const saved=await approveLessonPack(db,"guest","pack-request",oid,{pack:p,confirmed:true});
  assert.ok(saved.saved,JSON.stringify(saved));
  assert.ok(await setClassroomOpen(db,"guest","pack-request",oid,true,now));
  const read=()=>classroomState(db,"guest","pack-request",oid,false,now);
  for(let i=2;i<5;i++){
   const r=await editClassroom(db,"guest","pack-request",oid,true,{action:"present",deck_id:saved.saved.deck_id,deck_revision:1,index:i,revision:(await read()).revision},now);
   assert.ok(r.ok,JSON.stringify(r));
   const current=(await read()).board.slide;
   assert.deepEqual(current.visual,p.slides[i].visual);
   assert.equal("notes" in current,false);
   assert.equal("answer" in current.visual,false);
   assert.equal(JSON.stringify(current).includes(p.slides[i].notes),false);
  }
 }
 }finally{db.raw.close();}
});

test("standalone reviewed lesson library creates no booking, learner, deck or activity plan until explicitly reused",async t=>{
 const db=makeDb();t.after(()=>db.raw.close());
 assert.equal((await listReusableLessonPacks(db)).length,0);
 assert.ok((await saveReusableLessonPack(db,{pack,minutes:30,confirmed:false})).error);
 assert.ok((await saveReusableLessonPack(db,{pack,minutes:45,confirmed:true})).error);
 const result=await saveReusableLessonPack(db,{pack,minutes:30,confirmed:true});
 assert.ok(result.saved);
 assert.equal((await listReusableLessonPacks(db))[0].id,result.saved.id);
 assert.equal("pack_json" in (await listReusableLessonPacks(db))[0],false);
 assert.equal((await getReusableLessonPack(db,result.saved.id)).pack.worksheet[0].answer,pack.worksheet[0].answer);
 for(const table of ["support_service_orders","support_guest_requests","support_teaching_decks","support_activity_templates","support_session_activity_plans"])assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM "+table).get().n,0);
 assert.ok((await useReusableLessonPack(db,"guest","wrong","absent",{library_id:result.saved.id,confirmed:true})).error);
 assert.ok((await generateReusableLessonPack({DB:db}, {},{},30)).error);
});
test("reusing a library lesson copies a reviewed snapshot into the exact existing appointment",async t=>{
 const {db,now}=setup();t.after(()=>db.raw.close());
 const result=await saveReusableLessonPack(db,{pack,minutes:30,confirmed:true});
 const id=result.saved.id;
 assert.ok((await useReusableLessonPack(db,"guest","wrong","pack-one",{library_id:id,confirmed:true})).error);
 assert.ok((await useReusableLessonPack(db,"guest","pack-request","pack-one",{library_id:id,confirmed:false})).error);
 db.raw.prepare("UPDATE support_service_orders SET end_at=? WHERE id='pack-two'").run(new Date(now.getTime()+45*60000).toISOString());
 assert.ok((await useReusableLessonPack(db,"guest","pack-request","pack-two",{library_id:id,confirmed:true})).error);
 const reused=await useReusableLessonPack(db,"guest","pack-request","pack-one",{library_id:id,confirmed:true});
 assert.ok(reused.saved);
 assert.equal((await readLessonPack(db,"guest","pack-request","pack-one")).saved.pack.title,pack.title);
 assert.equal((await listReusableLessonPacks(db)).length,1);
 assert.ok((await useReusableLessonPack(db,"guest","pack-request","pack-one",{library_id:id,confirmed:true})).error);
});

test("studio drafts survive reopening, remain isolated and cannot be overwritten by stale windows",async t=>{
 const db=makeDb();t.after(()=>db.raw.close());
 const owner="synthetic-owner",other="other-owner";
 const first=await checkpointPrivateLessonDraft(db,owner,{pack,minutes:30,revision:0});
 assert.ok(first.draft);
 const {draft_id,revision}=first.draft;
 assert.equal((await readPrivateLessonDraft(db,owner)).draft_id,draft_id);
 assert.equal(await readPrivateLessonDraft(db,other),null);
 assert.equal((await listReusableLessonPacks(db)).length,0);
 assert.ok((await checkpointPrivateLessonDraft(db,owner,{pack,minutes:30,revision:0})).error);
 assert.ok((await checkpointPrivateLessonDraft(db,owner,{pack:{...pack,slides:[]},minutes:30,draft_id,revision})).error);
 const next=await checkpointPrivateLessonDraft(db,owner,{pack:{...pack,title:"Updated practice"},minutes:30,draft_id,revision});
 assert.ok(next.draft);
 assert.equal((await readPrivateLessonDraft(db,owner)).pack.title,"Updated practice");
 assert.equal(await discardPrivateLessonDraft(db,other,{draft_id,revision:next.draft.revision,confirmed:true}),false);
 assert.equal(await discardPrivateLessonDraft(db,owner,{draft_id,revision,confirmed:true}),false);
 assert.equal(await discardPrivateLessonDraft(db,owner,{draft_id,revision:next.draft.revision,confirmed:true}),true);
 const replacement=await checkpointPrivateLessonDraft(db,owner,{pack,minutes:30,revision:0});
 assert.notEqual(replacement.draft.draft_id,draft_id);
 assert.ok((await checkpointPrivateLessonDraft(db,owner,{pack,minutes:30,draft_id,revision})).error);
 assert.equal(await discardPrivateLessonDraft(db,owner,{draft_id,revision,confirmed:true}),false);
 for(const table of ["support_service_orders","support_teaching_decks","support_session_activity_plans"])assert.equal(db.raw.prepare("SELECT COUNT(*) n FROM "+table).get().n,0);
});

test("reasoning trial reads only final model output and keeps the complete teaching gate",()=>{
 assert.equal(REASONING_LESSON_MODEL,"@cf/openai/gpt-oss-120b");
 const response={status:"completed",output:[{type:"reasoning",summary:[{type:"summary_text",text:"{ invalid hidden reasoning }"}]},{type:"message",role:"assistant",content:[{type:"output_text",text:JSON.stringify(englishPack)}]}]};
 assert.ok(validateLessonPack(extractLessonPackResponse(response),30));
 assert.ok(validateLessonPack(extractLessonPackResponse({response:JSON.stringify(sciencePack)}),30));
 assert.ok(validateLessonPack(extractLessonPackResponse({output_text:JSON.stringify(englishPack)}),30));
 assert.equal(extractLessonPackResponse({...response,status:"incomplete"}),null);
 assert.ok(validateLessonPack(extractLessonPackResponse({choices:[{finish_reason:"stop",message:{content:JSON.stringify(englishPack),reasoning_content:"Private reasoning"}}]}),30));
 assert.equal(extractLessonPackResponse({choices:[{finish_reason:"length",message:{content:JSON.stringify(englishPack)}}]}),null);
 assert.equal(extractLessonPackResponse({choices:[{finish_reason:"content_filter",message:{content:JSON.stringify(englishPack)}}]}),null);
 assert.equal(extractLessonPackResponse({output:[{type:"reasoning",summary:[{type:"summary_text",text:JSON.stringify(englishPack)}]}]}),null);
 assert.equal(validateLessonPack(extractLessonPackResponse({output_text:'{"title":"Incomplete"}'}),30),null);
});

test("complete structured model output is accepted but truncated or reasoning-only text is never salvaged",()=>{
 assert.ok(validateLessonPack(extractLessonPackResponse(englishPack),30));
 assert.ok(validateLessonPack(extractLessonPackResponse({response:englishPack}),30));
 const json=JSON.stringify(englishPack);
 assert.ok(validateLessonPack(extractLessonPackResponse({response:"\x60\x60\x60json\n"+json+"\n\x60\x60\x60"}),30));
 assert.equal(extractLessonPackResponse({response:json.slice(0,-1)}),null);
 assert.equal(extractLessonPackResponse({response:"Analysis before final output "+json}),null);
 assert.equal(extractLessonPackResponse({reasoning_content:json}),null);
});
test("validation reports safe specific failures without weakening the complete lesson gate",()=>{
 let reason="";
 const check=(p,minutes=30)=>validateLessonPack(p,minutes,r=>{reason=r;});
 assert.ok(check(englishPack));assert.equal(reason,"");
 assert.equal(check(englishPack,45),null);assert.match(reason,/timing/);
 assert.equal(check({...englishPack,slides:[]}),null);assert.match(reason,/slide structure/);
 assert.equal(check({...englishPack,slides:englishPack.slides.map((s,i)=>i===0?{...s,notes:"PRIVATE SENTINEL"}:s)}),null);
 assert.match(reason,/private teaching guidance/);assert.ok(!reason.includes("PRIVATE SENTINEL"));
 assert.ok(check({...englishPack,worksheet:[]}));assert.equal(check({...englishPack,worksheet:[{prompt:"",answer:""}]}),null);
 assert.equal(check({...englishPack,activities:[]}),null);assert.match(reason,/two distinct activities/);
});

test("structured model guidance is converted without changing instructional content, and 30-minute timing is deterministic",()=>{
 const structured=structuredClone(englishPack);
 for(const slide of structured.slides){
  const match=slide.notes.match(/^UNDERSTAND:\s*([\s\S]+?)\nSAY AND SHOW:\s*([\s\S]+?)\nIF THEY GET STUCK:\s*([\s\S]+?)\nCHECK:\s*([\s\S]+)$/);
  assert.ok(match);
  slide.notes={understand:match[1],say_and_show:match[2],if_they_get_stuck:match[3],check:match[4]};
 }
 structured.sequence=structured.sequence.map(s=>({...s,minutes:2}));
 const normal=normaliseGeneratedLessonPack(structured,30);
 assert.deepEqual(normal.sequence.map(s=>s.minutes),[6,6,7,7,4]);
 assert.deepEqual(normal.slides.map(s=>s.notes),englishPack.slides.map(s=>s.notes));
 assert.ok(validateLessonPack(normal,30));
 const short=structuredClone(structured);short.slides[0].notes.check="Too short";
 assert.equal(validateLessonPack(normaliseGeneratedLessonPack(short,30),30),null);
 const missing=structuredClone(structured);delete missing.slides[0].notes.check;
 assert.equal(validateLessonPack(normaliseGeneratedLessonPack(missing,30),30),null);
 const wrong=structuredClone(structured);wrong.sequence[0].phase="model";
 assert.equal(validateLessonPack(normaliseGeneratedLessonPack(wrong,30),30),null);
 assert.equal(normaliseGeneratedLessonPack(structured,45).sequence[0].minutes,2);
});


test("timed opening is retained privately and cannot consume required teaching time",()=>{
 const valid=validateLessonPack(pack,30);
 assert.deepEqual(valid.icebreaker,pack.icebreaker);
 assert.equal(valid.sequence.reduce((n,s)=>n+s.minutes,0),30);
 assert.equal(validateLessonPack({...pack,icebreaker:{...pack.icebreaker,minutes:5}},30),null);
 assert.equal(validateLessonPack({...pack,icebreaker:{...pack.icebreaker,script:"Say hello."}},30),null);
 assert.equal(validateLessonPack({...pack,icebreaker:null},30),null);
 assert.equal(validateLessonPack({...pack,sequence:[{phase:"teach",minutes:3},{phase:"model",minutes:4},{phase:"model",minutes:4},{phase:"guided",minutes:10},{phase:"independent",minutes:5},{phase:"check",minutes:4}]},30),null);
 assert.equal(validateLessonPack({...pack,sequence:[{phase:"teach",minutes:4},{phase:"model",minutes:3},{phase:"model",minutes:3},{phase:"guided",minutes:11},{phase:"independent",minutes:5},{phase:"check",minutes:4}]},30),null);
 const legacy={...pack};delete legacy.icebreaker;
 assert.ok(validateLessonPack(legacy,30));
});
test("interest selector accepts only known non-identifying themes",()=>{
 assert.equal(lessonTheme(undefined),"none");
 assert.equal(lessonTheme("cats"),"cats");
 assert.equal(lessonTheme("dragons"),"dragons");
 assert.equal(lessonTheme("private learner details"),null);
 assert.equal(lessonTheme({theme:"cats"}),null);
 assert.equal(lessonTheme(null),null);
 assert.deepEqual([15,30,45,60,90,180].map(icebreakerMinutes),[2,3,3,5,5,5]);
});


import {illustrationAllowance,validateIllustrationPlan,draftLessonIllustration} from "../src/supportIllustrations.ts";
test("illustration storyboard scales with lesson length and keeps only bounded private planning fields",()=>{
 assert.deepEqual([15,30,45,60,90,180].map(illustrationAllowance),[2,4,5,6,8,8]);
 const scene={slide_index:0,title:"Pizza shop scene",brief:"A whimsical dragon at a pizza shop with a colourful apron and empty serving plates.",purpose:"Establish a familiar setting before the exact fraction model.",answer:"PRIVATE_SENTINEL"};
 const expected={slide_index:0,title:scene.title,brief:scene.brief,purpose:scene.purpose};
 assert.deepEqual(validateIllustrationPlan([scene],30,6),[expected]);
 assert.equal(validateIllustrationPlan([scene,scene],30,6),null);
 assert.equal(validateIllustrationPlan([{...scene,slide_index:6}],30,6),null);
 assert.equal(validateIllustrationPlan([{...scene,brief:"short"}],30,6),null);
 assert.equal(validateIllustrationPlan(Array.from({length:5},(_,i)=>({...scene,slide_index:i,brief:scene.brief+i})),30,6),null);
 assert.deepEqual(validateLessonPack({...pack,illustrations:[scene]},30).illustrations,[expected]);
 assert.ok(validateLessonPack(pack,30));
});
test("illustrations fail closed without the separate staging opt-in",async()=>{
 let called=false;
 const e={AI:{run:async()=>{called=true;return {};}}};
 assert.ok((await draftLessonIllustration(e,{},{})).error);
 assert.equal(called,false);
});


test("reviewed illustration follows its slide without exposing private storyboard or answers",async t=>{
 const {db,now}=setup();t.after(()=>db.raw.close());
 const fid="11111111-2222-4333-8444-555555555555",tutorId="22222222-3333-4444-8555-666666666666";
 await presentationImage(db,fid); // ensure resource schema
 const insert=db.raw.prepare("INSERT INTO support_files(id,title,subject,year_level,filename,mime,size_bytes,storage_key,audience,status,created_at) VALUES(?,?,?,?,?,?,?,?,?,'active',?)");
 insert.run(fid,"Reviewed scene","Mathematics","Year 4","scene.jpg","image/jpeg",10,"support-private/"+fid,"learner",now.toISOString());
 insert.run(tutorId,"Private scene","Mathematics","Year 4","private.jpg","image/jpeg",10,"support-private/"+tutorId,"tutor",now.toISOString());
 const withImage=id=>({...pack,illustrations:[{...pack.illustrations[0],file_id:id,brief:pack.illustrations[0].brief+" PRIVATE_BRIEF"}]});
 assert.ok((await saveReusableLessonPack(db,{pack:withImage(tutorId),minutes:30,confirmed:true})).error);
 assert.ok((await approveLessonPack(db,"guest","pack-request","pack-one",{pack:withImage(tutorId),confirmed:true})).error);
 assert.equal(validateLessonPack(withImage("https://example.com/image.jpg"),30),null);
 assert.equal(normaliseGeneratedLessonPack(withImage(fid),30).illustrations[0].file_id,undefined);
 const saved=await saveReusableLessonPack(db,{pack:withImage(fid),minutes:30,confirmed:true});
 assert.equal(saved.saved.pack.illustrations[0].file_id,fid);
 const result=await useReusableLessonPack(db,"guest","pack-request","pack-one",{library_id:saved.saved.id,confirmed:true});
 assert.ok(result.saved,JSON.stringify(result));
 assert.equal(await setClassroomOpen(db,"guest","pack-request","pack-one",true,now),true);
 const present=async index=>{
  const s=await classroomState(db,"guest","pack-request","pack-one",true,now);
  return editClassroom(db,"guest","pack-request","pack-one",true,{action:"present",deck_id:result.saved.deck_id,deck_revision:1,index,revision:s.revision},now);
 };
 assert.equal(await canReadClassroomImage(db,"guest","pack-request","pack-one",fid,false,now),false);
 assert.equal((await present(0)).ok,true);
 const state=await classroomState(db,"guest","pack-request","pack-one",false,now);
 assert.deepEqual(state.board.image,{id:fid,title:"Reviewed scene"});
 assert.deepEqual(state.board.slide.visual,pack.slides[0].visual);
 assert.ok(state.board.slide.interaction);
 assert.ok(!JSON.stringify(state).includes("PRIVATE_BRIEF"));
 assert.ok(!JSON.stringify(state).includes("PRIVATE-SOLUTION"));
 assert.equal(await canReadClassroomImage(db,"guest","pack-request","pack-one",fid,false,now),true);
 assert.equal(await canReadClassroomImage(db,"guest","wrong","pack-one",fid,false,now),false);
 assert.equal(await canReadClassroomImage(db,"guest","pack-request","pack-two",fid,false,now),false);
 assert.equal((await present(1)).ok,true);
 assert.equal(await canReadClassroomImage(db,"guest","pack-request","pack-one",fid,false,now),false);
 assert.equal((await present(0)).ok,true);
 const shown=await classroomState(db,"guest","pack-request","pack-one",true,now);
 assert.equal((await editClassroom(db,"guest","pack-request","pack-one",true,{action:"hide-slide",revision:shown.revision},now)).ok,true);
 assert.equal(await canReadClassroomImage(db,"guest","pack-request","pack-one",fid,false,now),false);
 assert.equal(await archiveResource(db,fid),true);
 assert.equal((await present(0)).ok,true);
 const fallback=await classroomState(db,"guest","pack-request","pack-one",false,now);
 assert.equal(fallback.board.image,null);
 assert.ok(fallback.board.slide.interaction);
 assert.ok((await useReusableLessonPack(db,"guest","pack-request","pack-two",{library_id:saved.saved.id,confirmed:true})).error);
});


test("deterministic experiment schemas and shared learner controls are bounded",()=>{
 const v=validateSlideVisual({type:"experiment",model:"rectangle",prompt:"Compare area and perimeter.",answer:"PRIVATE",code:"invalid"});
 assert.deepEqual(v,{type:"experiment",model:"rectangle",prompt:"Compare area and perimeter."});
 assert.equal(validateSlideVisual({type:"experiment",model:"arbitrary-code",prompt:"Run"}),null);
 let state=initialSlideInteraction(v);
 assert.deepEqual(state.placements,[3,4]);
 const act=(operation,index,direction,owner=false)=>changeSlideInteraction(v,state,{visual_id:state.id,operation,index,direction},owner);
 assert.equal(act("adjust",0,11),null);
 assert.equal(act("adjust",0,1.5),null);
 assert.equal(act("adjust",2,5),null);
 assert.equal(act("adjust",0,5,true),null);
 state=act("adjust",0,5);assert.deepEqual(state.placements,[5,4]);
 assert.deepEqual(act("reset",undefined,undefined,true).placements,[3,4]);
 for(const model of ["series-circuit","parallel-circuit"]){
  const circuit=validateSlideVisual({type:"experiment",model,prompt:"Predict the result."});
  let s=initialSlideInteraction(circuit);
  const toggle=(index,owner=false)=>changeSlideInteraction(circuit,s,{visual_id:s.id,operation:"toggle",index},owner);
  assert.equal(toggle(2),null);assert.equal(toggle(0,true),null);
  s=toggle(0);assert.deepEqual(s.selected,[0]);s=toggle(1);assert.deepEqual(s.selected,[0,1]);s=toggle(0);assert.deepEqual(s.selected,[1]);
  assert.equal(changeSlideInteraction(circuit,s,{visual_id:"stale",operation:"toggle",index:0},false),null);
 }
});

 test("digital-first packs need no printable tasks but still enforce teaching quality",()=>{const {worksheet,...digital}=pack;assert.deepEqual(validateLessonPack(digital).worksheet,[]);assert.equal(validateLessonPack({...digital,activities:[]}),null);assert.equal(validateLessonPack({...digital,worksheet:"invalid"}),null);});
