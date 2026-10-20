import type { App, Guards } from "./types";
import { canAccessPrintableVault } from "./printableVault";

/**
 * Original black-and-white Side-Quest handwriting book. All pages are A4 SVG
 * vectors (no tinted backgrounds and no uploaded copyrighted fonts or art).
 * The SVGs are served only after the parent's existing Vault entitlement check.
 */
export const HANDWRITING_PAGE_COUNT = 56;
const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
const WORDS = [
 "apple","ball","cat","dog","egg","fish","goat","hat","igloo",
 "jam","kite","leaf","moon","nest","octopus","pig","queen",
 "rainbow","sun","tree","umbrella","van","water","xylophone",
 "yarn","zebra"
] as const;

/** Simple print-letter centreline strokes: top at y=0, x-height=32,
 * baseline=80, descenders to y=108. Single-storey a and g throughout.
 * Strokes are sequenced so numbered starting dots also show stroke order. */
export const STROKES: Record<string,string[]> = {
 A:["M8 80 L35 2","M35 2 L65 80","M19 51 L54 51"],
 B:["M11 0 L11 80","M11 0 C77 -3 76 41 11 40","M11 40 C84 35 83 86 11 80"],
 C:["M66 11 C9 -18 -5 95 66 73"],
 D:["M11 0 L11 80","M11 0 C91 0 90 82 11 80"],
 E:["M66 0 L12 0 L12 80 L66 80","M12 40 L58 40"],
 F:["M12 80 L12 0 L65 0","M12 39 L56 39"],
 G:["M66 13 C8 -13 -8 97 66 77 L66 47 L42 47"],
 H:["M12 0 L12 80","M66 0 L66 80","M12 40 L66 40"],
 I:["M17 0 L61 0","M39 0 L39 80","M17 80 L61 80"],
 J:["M64 0 L64 57 Q64 84 35 81 Q14 79 13 60"],
 K:["M13 0 L13 80","M66 0 L13 45","M34 29 L67 80"],
 L:["M12 0 L12 80 L66 80"],
 M:["M11 80 L11 0 L38 46 L66 0 L66 80"],
 N:["M12 80 L12 0 L66 80 L66 0"],
 O:["M39 0 C-3 0 -3 80 39 80 C82 80 82 0 39 0 Z"],
 P:["M13 80 L13 0","M13 0 C86 -5 87 47 13 44"],
 Q:["M39 0 C-3 0 -3 80 39 80 C82 80 82 0 39 0 Z","M49 62 L70 86"],
 R:["M13 80 L13 0","M13 0 C86 -5 87 46 13 44","M35 44 L67 80"],
 S:["M66 11 C45 -7 11 -1 11 22 C11 45 67 35 67 59 C67 84 28 91 9 73"],
 T:["M5 0 L73 0","M39 0 L39 80"],
 U:["M11 0 L11 53 C11 91 66 91 66 53 L66 0"],
 V:["M10 0 L38 80 L67 0"],
 W:["M7 0 L21 80 L39 34 L56 80 L71 0"],
 X:["M11 0 L67 80","M67 0 L11 80"],
 Y:["M11 0 L39 42 L67 0","M39 42 L39 80"],
 Z:["M12 0 L66 0 L12 80 L66 80"],
 a:["M48 55 C48 25 11 25 11 55 C11 86 48 87 48 55 Z","M48 32 L48 80"],
 b:["M14 0 L14 80","M14 57 C14 24 61 24 61 56 C61 86 14 88 14 57"],
 c:["M62 41 C32 15 9 35 9 56 C9 80 36 89 62 72"],
 d:["M58 0 L58 80","M58 57 C58 24 10 24 10 56 C10 88 58 88 58 57"],
 e:["M12 56 L62 56 C61 20 11 22 11 56 C11 80 37 89 61 72"],
 f:["M18 80 L18 20 Q19 -3 53 2","M5 33 L47 33"],
 g:["M53 56 C53 24 10 24 10 55 C10 86 53 87 53 56 Z","M53 33 L53 87 Q53 110 28 108 Q16 108 12 98"],
 h:["M14 0 L14 80","M14 58 C14 26 61 23 61 56 L61 80"],
 i:["M26 34 L26 80","M26 12 L26 13"],
 j:["M46 33 L46 87 Q44 109 16 108","M46 12 L46 13"],
 k:["M14 0 L14 80","M59 33 L15 62","M34 50 L61 80"],
 l:["M25 0 L25 80"],
 m:["M11 34 L11 80","M11 52 C11 25 39 25 39 52 L39 80","M39 52 C39 25 67 25 67 52 L67 80"],
 n:["M13 34 L13 80","M13 53 C13 25 60 25 60 53 L60 80"],
 o:["M38 32 C1 32 1 80 38 80 C75 80 75 32 38 32 Z"],
 p:["M14 34 L14 108","M14 56 C14 25 61 24 61 55 C61 87 14 87 14 56"],
 q:["M57 55 C57 25 10 25 10 55 C10 86 57 87 57 55 Z","M57 34 L57 108"],
 r:["M15 34 L15 80","M15 54 C15 36 29 30 55 34"],
 s:["M58 38 C37 24 12 34 12 47 C12 61 59 52 59 67 C59 85 33 86 11 73"],
 t:["M30 9 L30 65 Q30 83 53 79","M10 34 L52 34"],
 u:["M13 34 L13 61 C13 88 58 88 58 61 L58 34","M58 61 L58 80"],
 v:["M8 34 L36 80 L64 34"],
 w:["M6 34 L19 80 L36 49 L53 80 L69 34"],
 x:["M10 34 L61 80","M61 34 L10 80"],
 y:["M10 34 L37 80","M65 34 L37 92 Q30 108 10 108"],
 z:["M10 34 L61 34 L10 80 L61 80"]
};
const xml=(value:string)=>value.replace(/&/g,"&amp;").replace(/</g,"&lt;")
 .replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");
const txt=(x:number,y:number,v:string,size=22,attrs="")=>
 '<text x="'+x+'" y="'+y+'" font-size="'+size+'" '+attrs+'>'+xml(v)+'</text>';
const rule=(x1:number,y1:number,x2:number,y2:number,dashed=false)=>
 '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="#888" stroke-width="1.4"'+(dashed?' stroke-dasharray="7 8"':'')+'/>';
const dragon=(x:number,y:number,scale=1)=>
 '<g transform="translate('+x+' '+y+') scale('+scale+')" stroke="#111" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="white">'
 +'<path d="M18 80 Q-1 52 12 26 L19 36 L26 11 L36 28 L51 7 L55 32 Q74 38 75 59 Q82 86 58 90 L38 92 Q20 96 18 80Z"/>'
 +'<path d="M17 74 Q-7 49 0 88 Q15 96 27 82 M60 70 Q92 48 90 87 Q77 94 64 83"/>'
 +'<circle cx="32" cy="53" r="4" fill="#111"/><circle cx="57" cy="53" r="4" fill="#111"/>'
 +'<path d="M40 70 Q46 75 52 70 M38 89 L32 103 M56 89 L64 103 M13 42 L2 24 M72 43 L84 27" fill="none"/>'
 +'</g>';

function renderFrame(page:number,body:string){
 return '<svg xmlns="http://www.w3.org/2000/svg" width="210mm" height="297mm" viewBox="0 0 794 1123">'
 +'<rect width="794" height="1123" fill="#fff"/>'
 +'<g font-family="Arial,Helvetica,sans-serif" fill="#151515">'
 +txt(62,64,"SIDE-QUEST  /  THE LITTLE LETTER QUEST",16,'font-weight="bold" letter-spacing="1"')
 +rule(61,79,733,79)
 +body
 +rule(61,1058,733,1058)
 +txt(63,1083,"A little practice goes a long way   •   sidequestlearning.app",14)
 +txt(724,1083,String(page+1),15,'text-anchor="end"')
 +'</g></svg>';
}

function glyph(letter:string,x:number,y:number,scale:number,trace=false,showOrder=false){
 const strokes=STROKES[letter]||[];
 // Centreline dashed strokes can be traced by pencil from each numbered start.
 let s='<g transform="translate('+x+' '+y+') scale('+scale+')" fill="none" stroke-linecap="round" stroke-linejoin="round">';
 strokes.forEach((d,i)=>{
  s+='<path d="'+d+'" stroke="'+(trace?'#969696':'#1c1c1c')+'" stroke-width="'+(trace?3:4)+'"'
   +(trace?' stroke-dasharray="0.7 7.5"':'')+'/>';
  if(showOrder){
   const p=/^M(-?\d+)\s+(-?\d+)/.exec(d);
   if(p){
    const px=Number(p[1]),py=Number(p[2]);
    s+='<circle cx="'+px+'" cy="'+py+'" r="6" fill="white" stroke="#111" stroke-width="1.1"/>';
    s+=txt(px,py+3,String(i+1),9,'font-weight="bold" text-anchor="middle" fill="#111" stroke="none"');
   }
  }
 });
 return s+'</g>';
}
function row(y:number,letter:string,traceCount:number){
 const left=91,right=705;
 let out=rule(left,y-85,right,y-85)+rule(left,y-49,right,y-49,true)
 +rule(left,y,right,y)+rule(left,y+25,right,y+25,true);
 for(let i=0;i<traceCount;i++)out+=glyph(letter,104+i*117,y-80,.90,true);
 return out;
}
function cover(page:number,back=false){
 let s='<rect x="72" y="139" width="650" height="819" rx="22" fill="none" stroke="#111" stroke-width="3"/>';
 s+=txt(397,278,back?"You did it!":"THE LITTLE",58,'font-weight="bold" text-anchor="middle"');
 s+=txt(397,365,back?"Letter Hero":"LETTER QUEST",62,'font-weight="bold" text-anchor="middle"');
 s+=txt(397,420,back?"Every letter is a little victory.":"My first handwriting workbook",26,'text-anchor="middle"');
 s+=dragon(302,495,2.1);
 s+=txt(397,801,back?"Keep practising!":"A a   B b   C c   D d",32,'text-anchor="middle"');
 if(!back){s+=txt(125,877,"This book belongs to:",23);s+=rule(349,884,667,884);}
 return renderFrame(page,s);
}
function parents(page:number){
 let s=txt(79,162,"How to use this book",47,'font-weight="bold"');
 const items=[
  "One letter at a time is plenty.",
  "Point to the big letter and say its name together.",
  "Find each numbered starting dot and follow the stroke.",
  "Trace the dotted letters slowly from left to right.",
  "Then try the empty lines. Take breaks whenever needed.",
  "Print only the letters you want, or the whole A–Z book."
 ];
 items.forEach((v,i)=>{s+=txt(85,252+86*i,(i+1)+".  "+v,20);});
 s+=txt(89,830,"The handwriting guide",29,'font-weight="bold"');
 s+=row(963,"a",2);
 s+=txt(90,1020,"Top, middle, baseline and descender guide",17);
 return renderFrame(page,s);
}
function sheet(page:number){
 const i=Math.floor((page-2)/2),ch=ALPHABET[i];
 const capital=(page-2)%2===1,letter=capital?ch.toUpperCase():ch;
 let s=txt(79,151,"Letter "+ch.toUpperCase()+ch.toLowerCase(),50,'font-weight="bold"');
 s+=txt(81,191,(capital?"Capital ":"Lowercase ")+letter+"   •   "+ch.toUpperCase()+" is for "+WORDS[i]+".",23);
 s+=glyph(letter,108,235,1.75,false,true);
 s+=txt(318,268,"1  Start at the numbered dots.",22);
 s+=txt(318,310,"2  Trace the dotted letters.",22);
 s+=txt(318,352,"3  Write it yourself.",22);
 s+=dragon(660,321,.58);
 const positions=[489,651,810,978],labels=["Trace the letter","Trace, then try","A little more practice","Now try without tracing"];
 positions.forEach((y,j)=>{
  s+=txt(93,y-104,labels[j],18,'font-weight="bold"');
  s+=row(y,letter,[5,3,1,0][j]);
 });
 return renderFrame(page,s);
}
function certificate(page:number){
 let s='<rect x="82" y="146" width="630" height="841" rx="19" fill="none" stroke="#111" stroke-width="3"/>';
 s+=txt(397,250,"SIDE-QUEST",32,'font-weight="bold" text-anchor="middle"');
 s+=txt(397,347,"Little Letter Hero!",51,'font-weight="bold" text-anchor="middle"');
 s+=txt(397,420,"This certificate belongs to",25,'text-anchor="middle"');
 s+=rule(172,509,622,509);
 s+=txt(397,600,"For practising all 26 letters",29,'text-anchor="middle"');
 s+=txt(397,649,"one small step at a time.",29,'text-anchor="middle"');
 s+=dragon(330,702,1.3);
 s+=txt(134,894,"Date:",20);s+=rule(191,902,361,902);
 s+=txt(389,894,"Grown-up:",20);s+=rule(492,902,656,902);
 return renderFrame(page,s);
}

export function renderHandwritingPage(page:number):string|null{
 if(!Number.isInteger(page)||page<0||page>=HANDWRITING_PAGE_COUNT)return null;
 if(page===0)return cover(page);
 if(page===1)return parents(page);
 if(page===54)return certificate(page);
 if(page===55)return cover(page,true);
 return sheet(page);
}
export function registerHandwritingBook(app:App,g:Guards){
 app.get("/api/handwriting-book",g.auth,g.parent,async c=>{
  const unlocked=await canAccessPrintableVault(c.env.DB,c.get("user"));
  c.header("Cache-Control","private, no-store");
  return c.json({unlocked,title:"The Little Letter Quest",pages:HANDWRITING_PAGE_COUNT,letters:26});
 });
 app.get("/api/handwriting-book/pages/:page",g.auth,g.parent,async c=>{
  if(!await canAccessPrintableVault(c.env.DB,c.get("user")))
   return c.json({code:"UPGRADE_REQUIRED",detail:"The handwriting book requires Family Membership."},402);
  const raw=c.req.param("page");
  if(!/^(0|[1-9][0-9]*)$/.test(raw))return c.json({detail:"Page not found"},404);
  const svg=renderHandwritingPage(Number(raw));
  if(!svg)return c.json({detail:"Page not found"},404);
  c.header("Content-Type","image/svg+xml; charset=utf-8");
  c.header("X-Content-Type-Options","nosniff");
  c.header("Cache-Control","private, no-store");
  return c.body(svg);
 });
}
