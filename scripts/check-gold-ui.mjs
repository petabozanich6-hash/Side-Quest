// Behaviour checks against the actual component logic, without a React DOM.
// This does not replace a production build or browser/device testing.
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {lessonPrintHtml} from '../frontend/src/components/shared/lessonPrint.js';

const player=fs.readFileSync('frontend/src/components/shared/CartoonEpisode.jsx','utf8');
const constants=player.slice(player.indexOf('const CAST'),player.indexOf('function Background'));
const pick=player.slice(player.indexOf('function pickVoice'),player.indexOf('export default function CartoonEpisode'));
const logic=player.slice(player.indexOf('export default function CartoonEpisode'),player.indexOf('  return (\n    <figure')).replace('export default function','function');
function harness({idx=0,playing=true,muted=true,voices=[]}={}) {
 const effects=[]; const changes=[]; let cursor=0; let nextId=1;const timers=new Map(); const spoken=[];
 const state=[idx,playing,muted,false];
 const context={window:{speechSynthesis:{getVoices:()=>voices,cancel:()=>{},speak:u=>spoken.push(u)}},SpeechSynthesisUtterance:function(text){this.text=text;},useState:()=>{const slot=cursor++;return[state[slot],value=>{changes.push([slot,value]);state[slot]=value;}]},useRef:()=>({current:null}),useCallback:f=>f,useEffect:f=>effects.push(f),setTimeout:(f,ms)=>{const id=nextId++;timers.set(id,{f,ms});return id;},clearTimeout:id=>timers.delete(id)};
 vm.createContext(context);
 vm.runInContext(constants+pick+logic+'\nreturn {start,toggle,skip,lines};\n}\nglobalThis.controls=CartoonEpisode({episode:{scenes:[{bg:"room",lines:[{who:"pip",text:"First line"},{who:"juno",text:"Pause and try",pause_after:true},{who:"pip",text:"Last line"}]}]}});',context);
 return {effects,changes,state,timers,spoken,controls:context.controls};
}
// A speech finish clears the old watchdog rather than leaving it able to
// clear the next line's timer; remote/system cloud voices are never selected.
let h=harness({muted:false,voices:[{lang:'en-AU',localService:true}]});h.effects[0]();assert.equal(h.spoken.length,1);const watchdog=[...h.timers.keys()][0];h.spoken[0].onend();assert(!h.timers.has(watchdog));assert.equal(h.timers.size,1);
h=harness({muted:false,voices:[{lang:'en-AU',localService:false}]});h.effects[0]();assert.equal(h.spoken.length,0);assert.equal(h.timers.size,1);
// Seeking pauses predictably instead of cancelling playback on the same index.
h=harness();h.controls.skip(-1);assert.equal(h.state[0],0);assert.equal(h.state[1],false);
// Pause-after lines stay on screen; Play advances once the learner is ready.
h=harness({idx:1});h.effects[0]();[...h.timers.values()][0].f();[...h.timers.values()].at(-1).f();assert.equal(h.state[1],false);
h=harness({idx:1,playing:false});h.controls.toggle();assert.equal(h.state[0],2);assert.equal(h.state[1],true);

const sql=fs.readFileSync('worker/migrations/0044_s2_y3_w01_l1_gold_expression.sql','utf8');const match=sql.match(/json_patch\(\s*data\s*,\s*'((?:[^']|'')*)'\s*\)/s);const gold=JSON.parse(match[1].replace(/''/g,"'"));const out=lessonPrintHtml(gold);
assert(out.includes('My Voice Detective reading sheet') && out.includes('Find the meaning first') && out.includes('Pip:'));
assert(!out.includes('Parent:') && !out.includes('sample_answer') && !out.includes('<iframe'));
assert(lessonPrintHtml({...gold,title:'<script>bad()</script>'}).includes('&lt;script&gt;bad()&lt;/script&gt;'));
console.log('Player timer/seek/pause/local-voice and print-content checks passed. React rendering, phone layout and real speech remain unverified.');
