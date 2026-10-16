// Guard every advanced write directly at API level; UI labels are not an access boundary.
import test from "node:test";
import assert from "node:assert/strict";
import { makeDb } from "./fakeD1.mjs";
import worker from "../src/index.ts";
import { accessPolicy } from "../src/membershipAccess.ts";
import { clearSettingsCache, clearUsageCache } from "../src/platformSettings.ts";

const ORIGIN="http://localhost:8787";
const PASSWORD="Correct-horse-9";
let counter=0;
function harness(){
  const db=makeDb(),env={DB:db,JWT_SECRET:"membership-guard-test-secret"};
  const ctx={waitUntil(){},passThroughOnException(){}};
  clearSettingsCache();clearUsageCache();
  async function req(path,{method="GET",token,body,headers={}}={}){
    const h={...headers};
    if(token) h.authorization="Bearer "+token;
    if(body!==undefined)h["content-type"]="application/json";
    const r=await worker.fetch(new Request(ORIGIN+"/api"+path,{
      method,headers:h,body:body===undefined?undefined:JSON.stringify(body)
    }),env,ctx);
    let json;try{json=await r.json()}catch{json=null}
    return {status:r.status,json};
  }
  async function parent(plan="FREE_PREVIEW"){
    const id=++counter;
    const r=await req("/auth/register",{method:"POST",body:{name:"Family "+id,email:"membertest"+id+"@example.test",password:PASSWORD,jurisdiction:"NSW"}});
    assert.equal(r.status,200,JSON.stringify(r.json));
    const fid=r.json.user.family_id;
    if(plan!=="FREE_PREVIEW")db.raw.prepare("UPDATE families SET plan=? WHERE id=?").run(plan,fid);
    return {token:r.json.token,fid};
  }
  async function child(parent){
    const id=++counter,username="memberchild"+id;
    const r=await req("/students",{method:"POST",token:parent.token,body:{name:"Learner",username,pin:"1234",stage:"S2"}});
    assert.equal(r.status,200,JSON.stringify(r.json));
    const login=await req("/auth/child-login",{method:"POST",body:{username,pin:"1234"}});
    assert.equal(login.status,200);
    return {id:r.json.id,token:login.json.token};
  }
  return {req,db,parent,child};
}

test("access policy covers advanced mutations and trial writes without blocking reading and account safety",()=>{
  for(const [method,url] of [
    ["POST","/api/files/upload"],["POST","/api/programs"],["POST","/api/units"],
    ["POST","/api/resources"],["POST","/api/resources/suggest"],["POST","/api/resources/verify-link"],["PUT","/api/resources/abc/approve"],
    ["POST","/api/calendar"],["PUT","/api/calendar/abc"],
    ["POST","/api/evidence-notes"],["POST","/api/life-evidence"],
    ["POST","/api/life-evidence/analyse"],["POST","/api/life-evidence/abc/review"],
    ["POST","/api/outcomes/students/abc/outcomes/MA2-RN-01/confirm"],
    ["POST","/api/outcomes/students/abc/outcomes/MA2-RN-01/evidence"],
    ["POST","/api/outcomes/evidence/abc/exclude"],["PUT","/api/outcomes/evidence/abc"],
    ["POST","/api/outcomes/students/abc/rebuild"],["PUT","/api/outcomes/students/abc/support"],
    ["POST","/api/auto-quest/plan"],["POST","/api/auto-quest/proposals/abc/generate"],
    ["PUT","/api/auto-quest/proposals/abc/lesson"],["POST","/api/timetable/week"],
    ["POST","/api/word-bank/words"],["POST","/api/ai/lesson-draft"],["POST","/api/ai/batches"],
    ["POST","/api/lessons/abc/apply-patch"],["POST","/api/assignments/abc/place"]
  ])assert.equal(accessPolicy(method,url),"paid",method+" "+url);
  for(const [method,url] of [
    ["POST","/api/reading-log"],["POST","/api/reading-submissions"],
    ["POST","/api/lessons/abc/evidence"],["POST","/api/learning-plans/abc/build"]
  ])assert.equal(accessPolicy(method,url),"preview",method+" "+url);
  assert.equal(accessPolicy("POST","/api/learning-plans"),"single_preview_plan");
  for(const [method,url] of [
    ["POST","/api/submissions"],["POST","/api/submissions/abc/feedback"],
    ["PUT","/api/compass/abc"],["POST","/api/feedback"],
    ["GET","/api/resources"],["GET","/api/portfolio"],["POST","/api/pet/play"],
    ["DELETE","/api/learning-plans/abc"],["DELETE","/api/reading-log/abc"],["PUT","/api/students/abc"]
  ])assert.equal(accessPolicy(method,url),null,method+" "+url);
});

test("preview protects all advanced routes server-side and allows only one basic learning plan",async()=>{
  const h=harness();
  const p=await h.parent(),c=await h.child(p);
  const paidOps=[
    ["/calendar",{title:"Weekly schedule",date:"2026-10-18"}],
    ["/resources",{title:"Test resource",url:"https://example.org"}],
    ["/programs",{student_id:c.id,title:"My program",stage:"S2"}],
    ["/units",{title:"Unit"}],
    ["/evidence-notes",{student_id:c.id,title:"Science project"}],
    ["/life-evidence",{student_id:c.id,title:"A bushwalk",description:"Observed native birds"}],
    ["/auto-quest/plan",{student_id:c.id}],
    ["/word-bank/words",{text:"shimmering"}],
  ];
  for(const [path,body] of paidOps){
    const r=await h.req(path,{method:"POST",token:p.token,body});
    assert.equal(r.status,402,path+" "+JSON.stringify(r.json));assert.equal(r.json.code,"UPGRADE_REQUIRED");
  }
  const noUpload=await h.req("/files/upload",{method:"POST",token:p.token});
  assert.equal(noUpload.status,402);
  const noChildEvidence=await h.req("/lessons/anything/evidence",{method:"POST",token:c.token,body:{text:"test"}});
  // Child can add evidence only during the active preview; the normal resource ownership check still applies.
  assert.notEqual(noChildEvidence.status,402);
  const planInput={student_id:c.id,title:"Our first term",period_start:"2026-10-16",period_end:"2026-12-16"};
  let r=await h.req("/learning-plans",{method:"POST",token:p.token,body:planInput});
  assert.equal(r.status,200,JSON.stringify(r.json));
  r=await h.req("/learning-plans",{method:"POST",token:p.token,body:{...planInput,title:"Second term"}});
  assert.equal(r.status,402);assert.equal(r.json.code,"UPGRADE_REQUIRED");
  const reading=await h.req("/reading-log",{method:"POST",token:p.token,body:{student_id:c.id,title:"The Hobbit",read_date:"2026-10-16"}});
  assert.equal(reading.status,200,JSON.stringify(reading.json));
});

test("expired families cannot write new content; existing records and safeguards remain accessible",async()=>{
  const h=harness();const p=await h.parent();const child=await h.child(p);
  const log=await h.req("/reading-log",{method:"POST",token:p.token,body:{student_id:child.id,title:"DCC",read_date:"2026-10-16"}});
  assert.equal(log.status,200);
  h.db.raw.prepare("UPDATE families SET plan='PREVIEW_EXPIRED' WHERE id=?").run(p.fid);
  for(const [path,body] of [
    ["/reading-log",{student_id:child.id,title:"Another book",read_date:"2026-10-16"}],
    ["/reading-submissions",{student_id:child.id,title:"New book"}],
    ["/learning-plans",{student_id:child.id,title:"Another plan"}],
    ["/calendar",{title:"New session",date:"2026-10-19"}],
    ["/life-evidence",{student_id:child.id,title:"New evidence"}],
    ["/resources",{title:"Another resource"}],
  ]){
    const r=await h.req(path,{method:"POST",token:p.token,body});
    assert.equal(r.status,402,path+" "+JSON.stringify(r.json));
  }
  const old=await h.req("/reading-log",{token:p.token});
  assert.equal(old.status,200);assert.ok(old.json.some(x=>x.title==="DCC"));
  const plan=await h.req("/account/plan",{token:p.token});
  assert.equal(plan.status,200);assert.equal(plan.json.effective_plan,"PREVIEW_EXPIRED");
  const compass=await h.req("/compass",{token:p.token});
  assert.equal(compass.status,200,"registration checklist remains available");
  const feedback=await h.req("/feedback",{method:"POST",token:p.token,body:{category:"idea",subject:"Add gardening resources",message:"Could the library include more native plant learning resources?"}});
  assert.equal(feedback.status,201,JSON.stringify(feedback.json));
});

test("paid families can use advanced endpoints; tests never unlock paid access by client input",async()=>{
  const h=harness();const p=await h.parent("ACTIVE_MONTHLY"),c=await h.child(p);
  const r=await h.req("/calendar",{method:"POST",token:p.token,body:{title:"Library day",date:"2026-10-20",student_id:c.id}});
  assert.equal(r.status,200,JSON.stringify(r.json));
  const lp=await h.req("/learning-plans",{method:"POST",token:p.token,body:{student_id:c.id,title:"Paid plan"}});
  assert.equal(lp.status,200,JSON.stringify(lp.json));
  const li=await h.req("/life-evidence",{method:"POST",token:p.token,body:{student_id:c.id,title:"Water testing",description:"Made observations and measurements."}});
  assert.equal(li.status,200,JSON.stringify(li.json));
  const forged=await h.req("/calendar",{method:"POST",token:"not-a-token",body:{title:"Forged",date:"2026-10-21"}});
  assert.equal(forged.status,401);
});
