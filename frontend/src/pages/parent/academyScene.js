// Local, facilitator-controlled presentation interaction. No storage, network or learner responses.
const icons={
 key:["M34 30a15 15 0 1 0-14 14l-6 6v9h10v-6h7v-7l9-9","M24 24h.1"],
 leaf:["M12 49C8 21 30 12 54 9c-1 27-14 45-38 43","M8 58L44 21M24 42l-1-12M34 32l12 1"],
 letter:["M8 15h48v34H8z","M8 15l24 20 24-20M8 49l17-19M56 49L39 30"],
 gem:["M9 23l10-13h26l10 13-23 32z","M9 23h46M19 10l13 45 13-45"],
 bag:["M21 19h22l9 15v20H12V34z","M21 19c0-13 22-13 22 0M20 38h24v9H20z"],
 feather:["M10 55C13 27 34 8 54 8c-1 25-16 43-35 43","M10 55L47 15M25 38l1-13M35 28l11 1"],
 paw:["M16 37c4-9 12-14 16-14s12 5 16 14c5 13-4 19-16 13-12 6-21 0-16-13z","M12 26a5 8 0 1 0 0-16 5 8 0 1 0 0 16M26 20a5 8 0 1 0 0-16 5 8 0 1 0 0 16M41 20a5 8 0 1 0 0-16 5 8 0 1 0 0 16M53 28a5 8 0 1 0 0-16 5 8 0 1 0 0 16"],
 house:["M6 29L32 9l26 20M12 26v28h40V26M26 54V37h12v17","M19 31h5m16 0h5"],
 bridge:["M5 47h54M8 45V20M56 45V20M8 22q24 37 48 0M19 35v10M32 41v4M45 35v10"],
 book:["M6 14q14-5 26 4 12-9 26-4v39q-14-5-26 4-12-9-26-4zM32 18v39","M12 25q9-2 14 3M38 28q7-5 14-3M12 34q9-2 14 3M38 37q7-5 14-3"],
 clock:["M32 7a25 25 0 1 0 0 50 25 25 0 1 0 0-50","M32 16v16l12 8"],
 door:["M12 57V25a20 20 0 0 1 40 0v32M7 57h50M20 57V25a12 12 0 0 1 24 0v32","M37 37h.1"]
};
const add=(d,p,tag,value,cls)=>{const el=d.createElement(tag);if(value!==undefined)el.textContent=value;if(cls)el.className=cls;p.appendChild(el);return el;};
function symbol(d,p,name){const ns="http://www.w3.org/2000/svg",svg=d.createElementNS(ns,"svg");svg.setAttribute("viewBox","0 0 64 64");svg.setAttribute("aria-hidden","true");svg.setAttribute("focusable","false");svg.setAttribute("fill","none");svg.setAttribute("stroke","currentColor");svg.setAttribute("stroke-width","2.5");svg.setAttribute("stroke-linecap","round");svg.setAttribute("stroke-linejoin","round");for(const v of icons[name]||icons.book){const path=d.createElementNS(ns,"path");path.setAttribute("d",v);svg.appendChild(path);}p.appendChild(svg);}
export const academySceneStyles=`
.academy-scene{margin:24px 0 4px;padding:clamp(16px,3vw,32px);border:1px solid var(--scene-gold);border-radius:18px;background:var(--scene-ink);color:#fffdf6;position:relative}
.academy-scene .scene-kicker{font:700 12px/1.4 system-ui;letter-spacing:.15em;text-transform:uppercase;color:var(--scene-gold)}
.academy-scene h2{font:700 clamp(25px,3.8vw,44px)/1.15 Georgia,serif;margin:10px 0;color:#fffdf6}
.academy-scene p{font-size:clamp(17px,2vw,24px);line-height:1.5;margin:8px 0}
.scene-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(160px,100%),1fr));gap:12px;margin:20px 0}
.scene-object{min-width:0;border:1px solid var(--scene-gold);border-radius:14px;overflow:hidden;background:var(--scene-paper);color:var(--scene-ink)}
.scene-object button,.scene-path button{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;width:100%;min-height:116px;border:0;border-radius:0;padding:16px;background:var(--scene-paper);color:var(--scene-ink);text-align:center;font-size:clamp(16px,2vw,23px)}
.scene-object button svg{width:55px;height:55px;color:var(--scene-ink)}
.scene-object button[aria-expanded=true],.scene-path button[aria-expanded=true]{background:var(--scene-gold);color:var(--scene-ink)}
.scene-object .scene-reveal,.scene-path .scene-reveal{margin:0;padding:16px;background:#fffdf6;color:var(--scene-ink);font-size:clamp(17px,2.15vw,25px);border-top:1px solid var(--scene-gold)}
.scene-reveal[hidden]{display:none}
.scene-path{border:1px solid var(--scene-gold);background:var(--scene-paper);color:var(--scene-ink);border-radius:14px;overflow:hidden}
.scene-path button{min-height:80px;text-align:left;align-items:flex-start}
.scene-question{border-top:1px solid var(--scene-gold);padding-top:14px;color:#fffdf6}
.academy-scene .scene-status{font-size:13px;color:#fffdf6}
.academy-scene .scene-reset{background:transparent;color:#fffdf6;border:1px solid var(--scene-gold);font-size:14px;padding:6px 12px}
.academy-scene button:focus-visible{outline:3px solid #fff;outline-offset:2px}
.academy-scene .scene-object button:focus-visible,.academy-scene .scene-path button:focus-visible{outline:3px solid var(--scene-ink);outline-offset:-5px}
`;
export function renderAcademyScene(d,container,scene,index,progress,palette){
 container.replaceChildren();
 if(scene?.version!=="academy-discoveries-v1"||![scene.discovery_slide,scene.decision_slide].includes(index))return;
 const reveal=index===scene.discovery_slide,items=reveal?scene.discoveries:scene.paths;
 if(!Array.isArray(items)||items.length<2||items.length>4)return;
 const panel=add(d,container,"section",undefined,"academy-scene");panel.style.setProperty("--scene-ink",palette.ink);panel.style.setProperty("--scene-paper",palette.paper);panel.style.setProperty("--scene-gold",palette.gold);
 add(d,panel,"p",reveal?"Discovery room":"Choose the next chapter","scene-kicker");add(d,panel,"h2",scene.title);add(d,panel,"p",reveal?scene.setting:scene.decision);
 const grid=add(d,panel,"div",undefined,"scene-grid"),status=add(d,panel,"p","","scene-status");status.setAttribute("role","status");
 const selected=progress.get(index)||new Set();progress.set(index,selected);
 const controls=[];
 function update(){for(const [i,b,p] of controls){const opened=selected.has(i);b.setAttribute("aria-expanded",String(opened));p.hidden=!opened;}status.textContent=selected.size+" of "+items.length+(reveal?" discoveries explored":" possibilities explored");}
 items.forEach((item,i)=>{const box=add(d,grid,"div",undefined,reveal?"scene-object":"scene-path"),b=add(d,box,"button");b.type="button";if(reveal)symbol(d,b,item.icon);add(d,b,"span",item.label);const p=add(d,box,"p",reveal?item.detail:item.outcome,"scene-reveal");p.id="scene-"+index+"-"+i;b.setAttribute("aria-controls",p.id);controls.push([i,b,p]);b.addEventListener("click",()=>{selected.has(i)?selected.delete(i):selected.add(i);update();});});
 if(!reveal)add(d,panel,"p",scene.question,"scene-question");else add(d,panel,"p","What does the evidence suggest? There is more than one possible interpretation.","scene-question");
 const reset=add(d,panel,"button","Close all reveals","scene-reset");reset.type="button";reset.addEventListener("click",()=>{selected.clear();update();});update();
}
