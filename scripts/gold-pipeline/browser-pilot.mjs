// Actual Chromium/CDP integration against a disposable LOCAL pilot D1 instance.
// Node 24 supplies WebSocket. Never point this account-creating test at production.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {lessonPrintHtml} from '../../frontend/src/components/shared/lessonPrint.js';

const base=process.env.PILOT_BASE_URL || 'http://127.0.0.1:8788';
const debuggerBase=process.env.PILOT_DEBUG_URL || 'http://127.0.0.1:9222';
for(const value of [base,debuggerBase]) {
  const u=new URL(value);
  assert.equal(u.protocol,'http:');
  assert.equal(u.hostname,'127.0.0.1','Only loopback local test instances are allowed');
}
const output=path.resolve('lesson-pipeline/pilot-evidence');
fs.mkdirSync(output,{recursive:true});
const bundle=JSON.parse(fs.readFileSync('lesson-pipeline/authored/s2-mat-y3-w02-l1.json','utf8'));
const lesson=bundle.lesson;
const report={browser:'Chromium via CDP',authored_file_sha256:crypto.createHash('sha256').update(fs.readFileSync('lesson-pipeline/authored/s2-mat-y3-w02-l1.json')).digest('hex'),checks:[],failures:[],gates_advanced:false};
const password=crypto.randomBytes(18).toString('hex');
let parentToken, ws;
async function api(method, endpoint, body, token=parentToken) {
  const response=await fetch(base+'/api'+endpoint,{method,
    headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},
    body:body?JSON.stringify(body):undefined});
  assert(response.ok,`${method} ${endpoint}: ${response.status}`);
  return response.json();
}
function pass(name){report.checks.push({name,status:'passed'});}
let serial=0;
const pending=new Map();
async function cdp(method,params={}) {
  const id=++serial;
  return new Promise((resolve,reject)=>{
    const timeout=setTimeout(()=>{pending.delete(id);reject(new Error('CDP timeout: '+method));},15000);
    pending.set(id,{resolve:r=>{clearTimeout(timeout);resolve(r);},reject:e=>{clearTimeout(timeout);reject(e);}});
    ws.send(JSON.stringify({id,method,params}));
  });
}
async function evaluate(expression) {
  const result=await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
  if(result.exceptionDetails)throw new Error('Browser evaluation failed: '+(result.exceptionDetails.exception?.description || result.exceptionDetails.text));
  return result.result.value;
}
async function waitFor(expression) {
  const until=Date.now()+15000;
  while(Date.now()<until){if(await evaluate(`(()=>{try{return (${expression});}catch{return false;}})()`))return;await new Promise(r=>setTimeout(r,100));}
  throw new Error('Expected browser condition was not met: '+expression);
}
async function clickSelector(selector){
  await waitFor(`!!document.querySelector(${JSON.stringify(selector)}) && !document.querySelector(${JSON.stringify(selector)}).disabled`);
  await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
}
async function clickText(text,scope='document') {
  const expression=`Array.from(${scope}.querySelectorAll('button')).find(b=>b.textContent.trim()===${JSON.stringify(text)} && !b.disabled)`;
  await waitFor(`!!(${expression})`);
  await evaluate(`(${expression}).click()`);
}
async function fill(selector,value) {
  await waitFor(`!!document.querySelector(${JSON.stringify(selector)})`);
  await evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)}); if(!el)throw Error('textarea missing');
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(el,${JSON.stringify(value)});
    el.dispatchEvent(new Event('input',{bubbles:true}));})()`);
}

try {
  const stamp=Date.now();
  const account=await api('POST','/auth/register',{email:`pipeline-${stamp}@example.com`,password,name:'Local pipeline test'});
  parentToken=account.token;
  const student=await api('POST','/students',{name:'Local test learner',username:`pipeline${stamp}`,pin:'1234',stage:'S2',birth_year:2017});
  const lessons=await api('GET','/lessons?stage=S2');
  const live=lessons.find(l=>l.seed_key===lesson.seed_key);
  assert.equal(live?.title,lesson.title,'Apply the staged pilot SQL to disposable local D1 first');
  assert.equal(live.source_note,lesson.source_note,'Local pilot content revision is stale');
  const assignment=await api('POST','/assignments',{student_id:student.id,lesson_id:live.id});
  const child=await api('POST','/auth/child-login',{username:`pipeline${stamp}`,pin:'1234'});
  await api('POST','/pet',{name:'Local fixture',species:'fox'},child.token);
  const childAssignment=await api('GET',`/assignments/${assignment.id}`,undefined,child.token);
  const parentFields=!!childAssignment.lesson.parent_notes || childAssignment.lesson.quiz.some(q=>q.sample_answer || q.marking_guide);
  if(parentFields)report.failures.push({name:'parent-only answer fields in child API',status:'failed',
    diagnosis:'Existing worker/src/core.ts lessonOut sends parent_notes and written models to authenticated child routes. UI hiding is not role isolation.'});
  else pass('child API excludes parent-only answers');
  pass('local registration, child login and pilot assignment');

  const page=await (await fetch(debuggerBase+'/json/new?about:blank',{method:'PUT'})).json();
  ws=new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',()=>reject(new Error('CDP connection failed')),{once:true});});
  ws.addEventListener('message',event=>{
    const message=JSON.parse(event.data);
    if(message.id){const p=pending.get(message.id);pending.delete(message.id);if(message.error)p?.reject(new Error(message.error.message));else p?.resolve(message.result);}
  });
  await cdp('Page.enable');
  await cdp('Runtime.enable');
  await cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await cdp('Page.addScriptToEvaluateOnNewDocument',{source:`if(location.origin===${JSON.stringify(base)})localStorage.setItem('sq_token',${JSON.stringify(child.token)});`});
  await cdp('Page.navigate',{url:base+`/child/lesson/${assignment.id}`});
  await waitFor(`document.body.innerText.includes(${JSON.stringify(lesson.title)})`);
  assert.equal(await evaluate(`document.querySelectorAll('[data-testid^="stage-"]').length`),10);
  await clickSelector('[data-testid="accept-quest"]');
  for(let i=0;i<4;i++) {
    await clickText('Show me an example',`document.querySelector('[data-testid="stage-teach${i}"]')`);
    const visual=lesson.teach_steps[i].visual[0];
    await waitFor(`Array.from(document.querySelectorAll('[data-testid="stage-teach${i}"] [role="img"]')).some(el=>el.getAttribute('aria-label')===${JSON.stringify(visual.alt)} && el.querySelector('svg'))`);
    if(i===0) {
      await evaluate(`document.querySelector('[data-testid="stage-teach0"] [role="img"]').scrollIntoView({block:'center'})`);
      const screenshot=await cdp('Page.captureScreenshot',{format:'png'});
      fs.writeFileSync(path.join(output,'rounding-phone.png'),Buffer.from(screenshot.data,'base64'));
    }
    await clickText('I get it, let me try',`document.querySelector('[data-testid="stage-teach${i}"]')`);
    await clickText(lesson.teach_steps[i].check.options[lesson.teach_steps[i].check.correct_index],`document.querySelector('[data-testid="stage-teach${i}"]')`);
    await clickSelector(`[data-testid="continue-teach${i}"]`);
  }
  pass('four teaching stages, example reveals, accessible SVGs and knowledge checks at phone width');
  assert(!(await evaluate('document.body.innerText')).includes('Parent: Independent key:'));
  await clickText('I have read it');
  await clickSelector('[data-testid="continue-learn"]');
  await clickText('I have read this and I am ready');
  await clickSelector('[data-testid="continue-guided"]');
  await fill('[data-testid="response-text"]','LOCAL AUTOMATION FIXTURE, not educational sign-off: independent reasoning was entered to test persistence and submission.');
  await clickSelector('[data-testid="continue-write"]');
  for(const q of lesson.quiz.filter(q=>q.type==='multiple_choice')) {
    const scope=`Array.from(document.querySelectorAll('[data-testid="quest-quiz"] .rounded-xl')).find(el=>el.textContent.includes(${JSON.stringify(q.question)}))`;
    await clickText(q.options[q.correct_index],`(${scope})`);
  }
  for(const index of [8,9])await fill(`#quiz-short-${index}`,`Local browser fixture written response ${index}; not a reviewed learner answer.`);
  await clickText('Check my answers');
  await waitFor(`document.body.innerText.includes('Quest cleared!')`);
  pass('eight-choice quiz and two typed written responses');
  const progressExpression=`(()=>{const s=JSON.parse(localStorage.getItem('sidequest-progress-${assignment.id}') || '{}');return {learn:s.done?.learn===true,guided:s.done?.guided===true,quiz:s.quizResult?.passed===true,written:!!s.quizShortAnswers?.[8] && !!s.quizShortAnswers?.[9],response:!!s.response};})()`;
  const savedProgress=await evaluate(progressExpression);
  report.saved_progress_checks=savedProgress;
  if(!Object.values(savedProgress).every(Boolean))report.failures.push({name:'learner checkpoint persistence',status:'failed',
    diagnosis:'The saved localStorage snapshot does not contain completed learn/guided stages, task and quiz progress. Existing ChildLesson onClick={mark("learn")} and onClick={mark("guided")} pass React events into done; serialising progress then fails and retains an older checkpoint.'});
  await clickSelector('[data-testid="continue-quiz"]');
  await clickSelector('[data-testid="submit-work"]');
  await waitFor(`document.querySelector('[data-testid="submit-work"]').textContent.includes('Submitted')`);
  const parentView=await api('GET',`/assignments/${assignment.id}`);
  assert(parentView.submissions.some(s=>s.response_text.includes('written response 8') && s.response_text.includes('written response 9')));
  pass('child submission and parent receipt preserve both written responses');
  await cdp('Page.reload');
  await waitFor(`document.body.innerText.includes(${JSON.stringify(lesson.title)})`);
  const restoredProgress=await evaluate(progressExpression);
  if(Object.values(restoredProgress).every(Boolean))pass('reload checkpoint persistence');
  else report.restored_progress_checks=restoredProgress;

  const html=lessonPrintHtml(lesson);
  assert(!html.includes('Parent:') && !html.includes(lesson.quiz[8].sample_answer));
  fs.writeFileSync(path.join(output,'pilot-print.html'),html);
  await cdp('Emulation.setDeviceMetricsOverride',{width:900,height:900,deviceScaleFactor:1,mobile:false});
  const {frameTree}=await cdp('Page.getFrameTree');
  await cdp('Page.setDocumentContent',{frameId:frameTree.frame.id,html});
  await waitFor(`document.querySelectorAll('svg').length===7`);
  const svgLayouts=await evaluate(`Array.from(document.querySelectorAll('svg')).map(svg=>({width:svg.getBoundingClientRect().width,text:svg.querySelector('text')?.textContent}))`);
  assert(svgLayouts.every(v=>v.width>0 && v.width<=720));
  report.svg_layouts=svgLayouts;
  const screenshot=await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});
  fs.writeFileSync(path.join(output,'rounding-print.png'),Buffer.from(screenshot.data,'base64'));
  pass('actual Chromium print rendering, seven SVG instances and hidden parent models');
} catch(error) {
  report.failures.push({name:'functional browser smoke',status:'failed',diagnosis:error.message});
  if(ws?.readyState===WebSocket.OPEN) {
    try {
      report.diagnostic=await evaluate('({path:location.pathname,text:document.body?.innerText.slice(0,700)})');
      const screenshot=await cdp('Page.captureScreenshot',{format:'png'});
      fs.writeFileSync(path.join(output,'browser-failure.png'),Buffer.from(screenshot.data,'base64'));
    } catch {}
  }
} finally {
  if(parentToken) {
    try{await api('POST','/auth/delete-account',{password,confirm:'DELETE'});pass('local test account cleanup');}
    catch{report.failures.push({name:'cleanup',status:'failed',diagnosis:'Local fixture account cleanup failed'});}
  }
  if(ws?.readyState===WebSocket.OPEN){try{await cdp('Page.close');}catch{}ws.close();}
  fs.writeFileSync(path.join(output,'browser-report.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report,null,2));
  if(report.failures.length)process.exitCode=1;
}
