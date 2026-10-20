import type { App, Guards } from "./types";
import { canAccessPrintableVault } from "./printableVault";

/**
 * Side-Quest's original A–Z handwriting book.
 * Vector A4 sheets are generated on demand, not stored as paid PNGs in public assets.
 * Every page request is checked against the same paid entitlement as the Printable Vault.
 */
export const HANDWRITING_PAGE_COUNT = 56;
const LETTERS = "abcdefghijklmnopqrstuvwxyz";
const WORDS = [
  "apple", "ball", "cat", "dog", "egg", "fish", "goat", "hat", "igloo",
  "jam", "kite", "leaf", "moon", "nest", "octopus", "pig", "queen",
  "rainbow", "sun", "tree", "umbrella", "van", "water", "xylophone",
  "yarn", "zebra"
];
const escapeSvg = (value: string) => value.replace(/&/g, "&amp;")
  .replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&apos;");

const text = (x:number,y:number,content:string,size=22,fill="#24352f",extra="") =>
  '<text x="'+x+'" y="'+y+'" font-size="'+size+'" fill="'+fill+'" '+extra+'>'+escapeSvg(content)+'</text>';
const line = (x1:number,y1:number,x2:number,y2:number,color="#c9cfca",dash="") =>
  '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+color+'" stroke-width="1.4" '+(dash?'stroke-dasharray="'+dash+'"':"")+'/>';
const frame = (inside:string,page:number) =>
  '<svg xmlns="http://www.w3.org/2000/svg" width="210mm" height="297mm" viewBox="0 0 794 1123" role="img" aria-label="Handwriting workbook page '+(page+1)+'">'
  +'<rect width="794" height="1123" fill="#fff"/>'
  +'<rect x="29" y="27" width="736" height="1066" rx="12" fill="none" stroke="#dae2d9" stroke-width="2"/>'
  +'<g font-family="Arial, Helvetica, sans-serif">'
  +text(67,69,"SIDE-QUEST  /  THE LITTLE LETTER QUEST",17,"#43644b",'font-weight="bold" letter-spacing="1"')
  +line(65,85,729,85,"#91ac94")
  +inside
  +line(65,1065,729,1065,"#cddbd0")
  +text(67,1087,"Write a little. Grow a lot.  •  sidequestlearning.app",14,"#657b68")
  +text(708,1087,String(page+1),15,"#657b68",'text-anchor="end"')
  +'</g></svg>';

function guideRow(base:number,letter:string,traced:number){
  const left=86, right=706;
  let out="";
  out+=line(left,base-110,right,base-110,"#aab8ab");
  out+=line(left,base-60,right,base-60,"#c5d0c6","7 7");
  out+=line(left,base,right,base,"#7f9585");
  out+=line(left,base+39,right,base+39,"#c5d0c6","7 7");
  // Dotted glyph outlines are scale-independent on both tablets and A4 printing.
  for(let i=0;i<traced;i++){
    out+=text(105+i*119,base-4,letter,116,"#ffffff",
      'font-family="Arial, Helvetica, sans-serif" stroke="#8f9c92" stroke-width="1.5" stroke-dasharray="2 5" paint-order="stroke fill"');
  }
  return out;
}

function letterSheet(page:number){
  const idx=Math.floor((page-2)/2);
  const upper=(page-2)%2===1;
  const ch=LETTERS[idx];
  const letter=upper?ch.toUpperCase():ch;
  const title=upper?"Capital "+letter:"Lowercase "+letter;
  const word=WORDS[idx];
  let s=text(81,138,title,50,"#1f3b2d",'font-weight="bold"');
  s+=text(84,179,"The letter "+letter+" is in "+word+".",23,"#516b57");
  s+=text(96,337,letter,190,"#ffffff",
    'stroke="#617f69" stroke-width="2.8" stroke-linejoin="round" font-family="Arial, Helvetica, sans-serif"');
  s+=text(288,262,"1. Look at the letter.",22,"#223d2d");
  s+=text(288,300,"2. Trace the dotted letters.",22,"#223d2d");
  s+=text(288,338,"3. Write it on your own.",22,"#223d2d");
  const bases=[479,650,816,982];
  const labels=["Trace","Trace, then try","One more to trace","Now write your own"];
  bases.forEach((b,i)=>{
    s+=text(87,b-119,labels[i],17,"#56725c",'font-weight="bold"');
    s+=guideRow(b,letter,[5,3,1,0][i]);
  });
  return frame(s,page);
}

function cover(page:number,back=false){
  let s='<rect x="55" y="117" width="684" height="880" rx="22" fill="#eef5e9" stroke="#b5cdb5" stroke-width="3"/>';
  s+='<path d="M 190 830 Q 360 720 512 836 Q 630 715 682 800 L 682 948 Q 505 855 397 952 Q 285 855 113 947 L 113 797 Z" fill="#b4d6a9" stroke="#3c6549" stroke-width="5"/>';
  s+=text(396,245,back?"The end of":"The Little",66,"#224533",'font-weight="bold" text-anchor="middle"');
  s+=text(396,331,back?"this quest!":"Letter Quest",66,"#224533",'font-weight="bold" text-anchor="middle"');
  s+=text(396,403,back?"Every letter is a little victory.":"My first handwriting book",30,"#446c4a",'text-anchor="middle"');
  if(!back){
    s+=text(396,570,"a  b  c  d  e",63,"#3d6550",'text-anchor="middle" letter-spacing="9"');
    s+=text(396,649,"A  B  C  D  E",60,"#3d6550",'text-anchor="middle" letter-spacing="8"');
    s+=text(126,743,"This book belongs to:",24,"#284b35");
    s+=line(132,795,650,795,"#567e58");
  }else{
    s+=text(396,570,"You traced.",40,"#355840",'text-anchor="middle"');
    s+=text(396,644,"You wrote.",40,"#355840",'text-anchor="middle"');
    s+=text(396,718,"You tried!",40,"#355840",'text-anchor="middle"');
  }
  return frame(s,page);
}
function guide(page:number){
  let s=text(86,169,"Let's learn our letters!",50,"#244431",'font-weight="bold"');
  s+=text(89,226,"For grown-ups and little writers",27,"#355b3b",'font-weight="bold"');
  [
    "Begin with one or two pages. Short, happy practice is enough.",
    "Look at each letter together. Say its name and find it in the word.",
    "Trace the dotted outlines slowly, then copy onto the empty lines.",
    "Use a comfortable pencil grip and let your learner take breaks.",
    "These are simple print letter shapes, not a state-specific script.",
    "Follow your school or local letter-formation style if it differs."
  ].forEach((t,i)=>s+=text(93,310+i*66,t,20,"#33463b"));
  s+=text(89,798,"How the handwriting lines work",28,"#2f5435",'font-weight="bold"');
  s+=guideRow(957,"a",2);
  s+=text(92,1030,"Top, middle, baseline and descender guide.",17,"#526d59");
  return frame(s,page);
}
function certificate(page:number){
  let s='<rect x="79" y="151" width="637" height="826" rx="26" fill="#f7faf4" stroke="#739c75" stroke-width="5"/>';
  s+=text(396,279,"SIDE-QUEST",31,"#4a7752",'font-weight="bold" text-anchor="middle"');
  s+=text(396,375,"Little Letter Hero!",57,"#244b30",'font-weight="bold" text-anchor="middle"');
  s+=text(396,464,"This certificate belongs to",26,"#3b5a42",'text-anchor="middle"');
  s+=line(174,548,625,548,"#456b4c");
  s+=text(396,639,"For practising the alphabet",30,"#27462f",'text-anchor="middle"');
  s+=text(396,696,"one letter at a time.",30,"#27462f",'text-anchor="middle"');
  s+=text(160,828,"Date:",22,"#43664b");
  s+=line(222,834,387,834,"#587d5d");
  s+=text(417,828,"Grown-up:",22,"#43664b");
  s+=line(518,834,652,834,"#587d5d");
  return frame(s,page);
}
export function renderHandwritingPage(page:number):string|null{
  if(!Number.isInteger(page)||page<0||page>=HANDWRITING_PAGE_COUNT)return null;
  if(page===0)return cover(page);
  if(page===1)return guide(page);
  if(page===54)return certificate(page);
  if(page===55)return cover(page,true);
  return letterSheet(page);
}

export function registerHandwritingBook(app:App,g:Guards){
  app.get("/api/handwriting-book",g.auth,g.parent,async c=>{
    const unlocked=await canAccessPrintableVault(c.env.DB,c.get("user"));
    c.header("Cache-Control","private, no-store");
    return c.json({unlocked,title:"The Little Letter Quest",pages:HANDWRITING_PAGE_COUNT,letters:26});
  });
  app.get("/api/handwriting-book/pages/:page",g.auth,g.parent,async c=>{
    if(!await canAccessPrintableVault(c.env.DB,c.get("user")))
      return c.json({code:"UPGRADE_REQUIRED",detail:"The handwriting book is for Family Membership."},402);
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
