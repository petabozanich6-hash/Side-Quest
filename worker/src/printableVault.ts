import type { App, Guards } from "./types";
import { getEntitlement } from "./lessonBuilder";

/**
 * Original first-party Side-Quest activity collection. No user-uploaded content,
 * external fonts, remote resources, AI requests, or public static PDF paths.
 * PDFs are created on demand only after authenticating a paid parent.
 */
export type VaultItem = {
  id: string; title: string; category: string; ages: string; minutes: number;
  kind: "worksheet" | "craft" | "game"; description: string;
  materials: string; questions: string[]; answers: string[];
  theme: string; collection: string;
};

export const VAULT_ITEMS: VaultItem[] = [
  { id:"dragon-hoard", title:"The Dragon Hoard", category:"Maths", ages:"8–11", minutes:20, kind:"worksheet", theme:"Dragons", collection:"starter", materials:"Pencil",
    description:"Count, share and rescue the coins in a dragon's treasure room.",
    questions:["A dragon has 120 coins. Goblins sneak away with 27. How many remain?","The dragon discovers 18 more coins. How many now?","Divide the coins equally into 3 treasure chests. How many per chest?","One chest gives 9 coins to a knight. How many remain in that chest?","BONUS: Five dragons each find 14 gems. How many gems altogether?"],
    answers:["120 - 27 = 93","93 + 18 = 111","111 / 3 = 37","37 - 9 = 28","5 x 14 = 70"] },
  { id:"secret-library", title:"A Secret in the Library", category:"English", ages:"8–12", minutes:25, kind:"worksheet", theme:"Mysteries", collection:"starter", materials:"Pencil, optional coloured pencils",
    description:"Read a miniature mystery, uncover evidence and write an ending.",
    questions:["READ: Under the oldest hill in Ember Valley stood a hidden library. When Ada opened the silver book, she found a brass key. The lock was strangely clean: not a speck of dust. A note said, 'Trust the clues, not the whispers.' Ada put the key in her pocket and looked behind the bookshelf.","Where was the library?","What was hidden inside the silver book?","Which detail suggests someone had touched the lock recently?","Why might Ada have kept the key instead of using it immediately?","Write the next two sentences of Ada's adventure."],
    answers:["The library was beneath the oldest hill in Ember Valley.","A brass key.","The silver book's lock had no dust.","Accept a reasoned inference supported by the passage.","Accept a creative continuation connected to the story."] },
  { id:"dragon-flight-lab", title:"Dragon Flight Lab", category:"Science", ages:"8–13", minutes:35, kind:"craft", theme:"Experiments", collection:"starter", materials:"Scissors, paper clips, pencil, safe drop space",
    description:"Create two paper flyers, change one variable and observe how they fall.",
    questions:["Cut out two identical paper helicopters from the templates below.","On helicopter A, keep the rotor blades full length. On B, shorten each blade by 1 cm.","Fold the rotor blades in opposite directions and add one paper clip to each base.","Predict: Which will fall more slowly? Why?","Drop both from the same safe height three times. Record the result for each trial.","Conclusion: What changed, and what stayed the same?"],
    answers:["No fixed winner: record observations, not a predetermined result.","Changed variable: rotor blade length.","Keep paper, clips, drop height and technique consistent.","Adult supervision with scissors and raised drop positions."] },
  { id:"ember-island-map", title:"Map of Ember Island", category:"Geography", ages:"8–12", minutes:25, kind:"worksheet", theme:"Exploration", collection:"starter", materials:"Pencil, ruler",
    description:"Navigate coordinates, landmarks and directions on a treasure map.",
    questions:["Find the castle on the grid below. Write its grid coordinate.","What landmark is shown at C4?","Move from the castle two squares east. Which grid square do you reach?","The observatory is at E5. Circle it.","Draw a route from the bridge to the observatory and describe your directions."],
    answers:["Castle is at A2.","Bridge.","C2.","Observatory is at E5.","Accept a logical route through the grid with matching directions."] },
  { id:"goblin-lockers", title:"The Goblin Lockers", category:"Logic & Puzzles", ages:"9–14", minutes:25, kind:"worksheet", theme:"Mysteries", collection:"starter", materials:"Pencil",
    description:"Deduce which explorer has each pet and bag using six clues.",
    questions:["Mira, Finn and Rowan each have a different pet: dragon, owl or fox. Their bags are red, blue or green.","Clue 1: Rowan carries the blue bag.","Clue 2: Mira does not carry the red bag.","Clue 3: The dragon belongs to the explorer with the green bag.","Clue 4: Finn owns the owl.","Clue 5: Each explorer has one pet and one bag.","Fill in: Mira = pet ______, bag ______.","Finn = pet ______, bag ______. Rowan = pet ______, bag ______."],
    answers:["Mira = dragon and green bag.","Finn = owl and red bag.","Rowan = fox and blue bag."] },
  { id:"rune-gate", title:"The Rune Gate", category:"Maths", ages:"12–16", minutes:25, kind:"worksheet", theme:"Dragons", collection:"starter", materials:"Pencil, working paper",
    description:"Solve the number riddles to unlock an ancient stone gate.",
    questions:["Find x: 3x + 5 = 26.","Find y: 5y - 8 = 27.","Find a: 4(a - 2) = 24.","The rune stones read 1, 4, 9, 16, __. What comes next?","Write the gate code using your four answers. Show your working.","EXTENSION: Write your own equation whose answer is 12."],
    answers:["x = 7","y = 7","a = 8","25","Gate code: 7 / 7 / 8 / 25","Accept any correct equation with solution 12."] },
  { id:"build-a-dragon", title:"Build Your Own Dragon", category:"Colour, Cut & Create", ages:"6–12", minutes:30, kind:"craft", theme:"Dragons", collection:"craft", materials:"Colours, child-safe scissors, glue",
    description:"Colour seven shapes, cut them out and assemble a completely original dragon.",
    questions:["Colour each body part and give it a pattern.","Cut on the solid outer lines.","Glue both wings and the tail BEHIND the dragon's body.","Glue the head and feet ON TOP of the body.","Name your dragon. What special ability does it have?"],
    answers:["There is no single correct design.","Discuss symmetry, design choices, shapes and how wings attach.","Adult help recommended for younger makers."] },
  { id:"story-quest-cube", title:"Fold a Story Quest Cube", category:"Colour, Cut & Create", ages:"7–14", minutes:30, kind:"craft", theme:"Storytelling", collection:"craft", materials:"Colours, scissors, glue stick",
    description:"Colour a real cube net, fold and roll it to invent an adventure.",
    questions:["Colour each of the six story faces.","Cut only on the solid outer outline, including tabs.","Fold along each dashed line and glue tabs INSIDE the cube.","Roll your cube. Use the upper face to begin a story.","Roll twice more and add both prompts to your adventure."],
    answers:["Each face contains a different prompt: hero, place, tool, clue, twist, ending.","Prompts are open-ended; judge originality and story sequence.","Fold lines are dashed; cut lines are solid."] },
  { id:"treasure-pocket", title:"Make a Treasure Pocket", category:"Colour, Cut & Create", ages:"6–12", minutes:30, kind:"craft", theme:"Dragons", collection:"craft", materials:"Colours, scissors, glue stick",
    description:"Fold and glue a pocket to store little notes, word cards or paper treasures.",
    questions:["Decorate the centre panel with a dragon or treasure symbol.","Cut around the OUTER solid outline.","Fold the dashed lines; tuck side tabs behind the main panel.","Glue side tabs to the back and fold the bottom flap over to make a pocket.","Write three tiny treasure notes to store inside."],
    answers:["Pocket is assembled when the side tabs are glued behind the front panel.","Do not glue the top opening shut.","Try using the pocket to collect vocabulary, arithmetic cards or story clues."] },
  { id:"fraction-feast", title:"Dragon's Fraction Feast", category:"Maths", ages:"8–12", minutes:20, kind:"worksheet", theme:"Food", collection:"quick", materials:"Pencil, colours",
    description:"Share fantasy pizzas to practise equivalent fractions.",
    questions:["Draw a circle and divide it into four equal pieces. Shade one quarter.","Two of eight pieces are eaten. What fraction is left?","Are 1/2 and 2/4 equal? Explain with a picture.","Three dragons share 12 biscuits equally. How many does each get?","Invent a fraction feast question for a friend."],
    answers:["1/4 shaded","6/8 (or 3/4) remains","Yes, both represent half a whole.","4 biscuits each.","Accept mathematically valid questions."] },
  { id:"science-sort", title:"Sort the Scientist's Samples", category:"Science", ages:"7–11", minutes:20, kind:"worksheet", theme:"Experiments", collection:"quick", materials:"Pencil, colours",
    description:"Sort everyday objects by their observable properties.",
    questions:["Classify these: rock, spoon, balloon, twig, glass cup, paper.","Which items are most likely to be flexible?","Choose three objects and label: natural or manufactured.","Explain how you could test whether an item floats, safely.","Invent another useful way to group the six objects."],
    answers:["Grouping can vary when justified using observations.","Balloon, twig or paper may flex depending on the object.","Natural examples: rock, twig. Manufactured: spoon, balloon, cup, paper.","Place a safe object in water and record whether it stays at the surface."] },
  { id:"poetry-portal", title:"The Poetry Portal", category:"English", ages:"10–15", minutes:25, kind:"worksheet", theme:"Storytelling", collection:"quick", materials:"Pencil, imagination",
    description:"Write imagery-rich poetry inspired by a portal into another world.",
    questions:["Write three sounds that might be heard through a glowing portal.","Describe a dragon without using the word 'dragon'.","Write one simile beginning with 'as' or 'like'.","Write a four-line stanza about entering another world.","Underline the strongest image in your poem and explain why it works."],
    answers:["Open-ended creative activity.","Look for deliberate vocabulary, a recognisable simile and sensory imagery.","Offer feedback on clarity and experimentation, not a single model answer."] },
];

export const VAULT_BUNDLES = [
  { id:"starter", title:"Original Quest Starter Pack", description:"Six ready-to-use maths, English, science and mystery adventures." },
  { id:"craft", title:"Colour, Cut & Create", description:"Three buildable templates, including a dragon, cube and treasure pocket." },
  { id:"quick", title:"Quick Quest Collection", description:"Three activities for a spare 20–25 minutes." }
];

const printable = (i: VaultItem) => ({
  id:i.id,title:i.title,category:i.category,ages:i.ages,minutes:i.minutes,
  kind:i.kind,description:i.description,materials:i.materials,theme:i.theme,collection:i.collection
});

// Small dependency-free A4 PDF renderer. All PDF data is authored by Side-Quest.
const clean = (s: string) => s.replace(/[^\x20-\x7e]/g, "-");
const esc = (s: string) => clean(s).replace(/\\/g,"\\\\").replace(/\(/g,"\\(").replace(/\)/g,"\\)");
const rgb = (r: number,g: number,b: number) => [r,g,b].map(n=>n.toFixed(3)).join(" ");
const wrap = (s: string, max=84): string[] => {
  const words=clean(s).split(/\s+/); const out:string[]=[]; let row="";
  for(const w of words){ if(row && row.length+w.length+1>max){out.push(row);row=w;} else row+=(row?" ":"")+w; }
  if(row)out.push(row);
  return out;
};
class Page {
  ops:string[]=[];
  dark=false;
  constructor(public ink:boolean){}
  fill(r:number,g:number,b:number){this.ops.push(rgb(r,g,b)+" rg");}
  pen(r:number,g:number,b:number){this.ops.push(rgb(r,g,b)+" RG");}
  rect(x:number,y:number,w:number,h:number,filled=false){this.ops.push(x+" "+y+" "+w+" "+h+" re "+(filled?"f":"S"));}
  line(x:number,y:number,x2:number,y2:number,dash=false){
    this.ops.push(dash?"[5 4] 0 d":"[] 0 d");
    this.ops.push(x+" "+y+" m "+x2+" "+y2+" l S");
    if(dash)this.ops.push("[] 0 d");
  }
  polygon(points:number[][],filled=false){
    if(!points.length)return;
    this.ops.push(points[0][0]+" "+points[0][1]+" m");
    for(const p of points.slice(1))this.ops.push(p[0]+" "+p[1]+" l");
    this.ops.push("h "+(filled?"f":"S"));
  }
  circle(cx:number,cy:number,r:number){
    const k=0.5522848*r;
    this.ops.push((cx+r)+" "+cy+" m "+(cx+r)+" "+(cy+k)+" "+(cx+k)+" "+(cy+r)+" "+cx+" "+(cy+r)+" c "+
      (cx-k)+" "+(cy+r)+" "+(cx-r)+" "+(cy+k)+" "+(cx-r)+" "+cy+" c "+
      (cx-r)+" "+(cy-k)+" "+(cx-k)+" "+(cy-r)+" "+cx+" "+(cy-r)+" c "+
      (cx+k)+" "+(cy-r)+" "+(cx+r)+" "+(cy-k)+" "+(cx+r)+" "+cy+" c S");
  }
  text(x:number,y:number,s:string,size=12,bold=false){
    this.ops.push("BT /"+(bold?"F2":"F1")+" "+size+" Tf 1 0 0 1 "+x+" "+y+" Tm ("+esc(s)+") Tj ET");
  }
  paragraph(x:number,y:number,s:string,chars=84,size=11){
    for(const row of wrap(s,chars)){this.text(x,y,row,size);y-=16;}
    return y;
  }
}

function dragon(p:Page){
  p.pen(0.1,0.22,0.18);p.ops.push("1.6 w");
  p.polygon([[210,315],[285,315],[325,420],[250,485],[185,420]]);
  p.text(230,365,"BODY",11,true);
  p.circle(250,550,48);p.circle(232,560,5);p.circle(268,560,5);p.line(233,532,266,532);p.text(226,495,"HEAD",10,true);
  p.polygon([[140,445],[75,520],[95,400],[130,430],[145,400],[170,430]]);
  p.polygon([[360,445],[435,520],[415,400],[380,430],[365,400],[340,430]]);
  p.text(87,455,"WING",10,true);p.text(373,455,"WING",10,true);
  p.polygon([[345,315],[445,335],[410,300],[455,285],[350,280]]);
  p.text(377,310,"TAIL",10,true);
  p.polygon([[160,275],[200,275],[190,235],[145,235]]);
  p.polygon([[300,275],[340,275],[355,235],[310,235]]);
  p.text(152,247,"FOOT",9);p.text(314,247,"FOOT",9);
}
function cube(p:Page){
  const unit=82,ox=155,oy=245, cells=[[1,0],[0,1],[1,1],[2,1],[3,1],[1,2]];
  const keys=new Set(cells.map(([x,y])=>x+":"+y)), labels=["HERO","PLACE","TOOL","CLUE","TWIST","ENDING"];
  p.pen(0.08,0.28,0.21);p.ops.push("1.6 w");
  cells.forEach(([gx,gy],i)=>{
    const x=ox+gx*unit,y=oy+gy*unit;
    p.text(x+12,y+unit/2,labels[i],11,true);
    const faces:[[number,number],[number,number],string,number,number][]=[
      [[x,y],[x+unit,y],"0:-1",0,-1],[[x+unit,y],[x+unit,y+unit],"1:0",1,0],
      [[x+unit,y+unit],[x,y+unit],"0:1",0,1],[[x,y+unit],[x,y],"-1:0",-1,0]
    ];
    faces.forEach(([a,b,_s,dx,dy])=>{
      if(keys.has((gx+dx)+":"+(gy+dy))){p.line(a[0],a[1],b[0],b[1],true);return;}
      const tab=(gy===1 && gx===0 && dx===-1)||(gy===1 && gx===2 && dy===-1)||(gy===1 && gx===3 && dx===1)||(gy===0 && gx===1 && dy===-1);
      if(!tab){p.line(a[0],a[1],b[0],b[1]);return;}
      p.line(a[0],a[1],b[0],b[1],true);
      const u=dx*14,v=dy*14;
      p.polygon([[a[0],a[1]],[a[0]+u+(dy?11:0),a[1]+v+(dx?11:0)],[b[0]+u-(dy?11:0),b[1]+v-(dx?11:0)],[b[0],b[1]]]);
    });
  });
  p.text(85,198,"SOLID = CUT   /   DASHED = FOLD   /   TABS = GLUE INSIDE",9,true);
}
function pocket(p:Page){
  p.pen(0.1,0.3,0.2);p.ops.push("1.8 w");
  const x=180,y=320,w=230,h=200,t=35;
  p.rect(x,y,w,h);
  p.polygon([[x,y],[x-t,y+20],[x-t,y+h-20],[x,y+h]]);
  p.polygon([[x+w,y],[x+w+t,y+20],[x+w+t,y+h-20],[x+w,y+h]]);
  p.polygon([[x,y],[x+30,y-55],[x+w-30,y-55],[x+w,y]]);
  p.line(x,y,x,y+h,true);p.line(x+w,y,x+w,y+h,true);p.line(x,y,x+w,y,true);
  p.text(220,430,"MY TREASURE",18,true);p.text(242,406,"POCKET",18,true);
  p.text(92,429,"GLUE",9);p.text(449,429,"GLUE",9);p.text(243,285,"FOLD UP",10);
}
function flight(p:Page){
  p.pen(0.1,0.25,0.2);p.ops.push("1.5 w");
  const draw=(x:number,label:string,short:boolean)=>{
    const y=305,top=560,cut=short?65:95;
    p.rect(x+40,y,40,160);
    p.rect(x+40-cut/2,y+160,40+cut,95);
    p.line(x+60,y+255,x+60,y+160);
    p.line(x+40,y+160,x+80,y+160,true);
    p.line(x+40,y+45,x+80,y+45,true);
    p.text(x+22,270,label,13,true);
  };
  draw(125,"A - LONG",false);draw(325,"B - SHORT",true);
}
function island(p:Page){
  const x=143,y=235,z=62;
  p.pen(0.1,0.3,0.25);
  for(let n=0;n<=5;n++){p.line(x,y+n*z,x+5*z,y+n*z);p.line(x+n*z,y,x+n*z,y+5*z);}
  for(let n=0;n<5;n++){p.text(x+22+n*z,y+5*z+12,String.fromCharCode(65+n),12,true);p.text(x-22,y+22+(4-n)*z,String(n+1),12,true);}
  [["A",2,"CASTLE"],["C",4,"BRIDGE"],["E",5,"STARS"],["B",1,"FOREST"],["D",3,"LAKE"]].forEach(([c,r,l])=>{
    const xx=x+(String(c).charCodeAt(0)-65)*z+8;const yy=y+(5-Number(r))*z+30;p.text(xx,yy,String(l),8,true);
  });
}

function renderItem(item:VaultItem,ink:boolean,guide=false):string{
  const p=new Page(ink);const accent=ink?[0,0,0]:[0.11,0.29,0.23];
  p.fill(accent[0],accent[1],accent[2]);p.rect(0,784,595,58,true);
  p.fill(1,1,1);p.text(43,816,"SIDE-QUEST  /  PRINTABLE VAULT",12,true);
  p.fill(0.08,0.16,0.13);p.text(42,746,guide?"PARENT GUIDE  /  "+item.title:item.title,20,true);
  p.text(42,719,item.category+"   |   Ages "+clean(item.ages)+"   |   "+item.minutes+" minutes",10);
  p.text(42,699,"Materials: "+item.materials,10);
  p.line(42,688,551,688);
  if(guide){
    let yy=653;p.text(42,yy,"ANSWERS AND FACILITATOR NOTES",12,true);yy-=28;
    for(let i=0;i<item.answers.length;i++){yy=p.paragraph(48,yy,(i+1)+". "+item.answers[i],78,11)-12;}
    p.text(42,130,"Safety: supervise scissors, glue and practical experiments as appropriate.",10);
  }else if(item.kind==="craft"){
    p.text(42,660,"Colour / cut / fold / create",13,true);
    p.paragraph(42,640,item.questions[0],87,10);
    if(item.id==="build-a-dragon")dragon(p);
    else if(item.id==="story-quest-cube")cube(p);
    else if(item.id==="treasure-pocket")pocket(p);
    else if(item.id==="dragon-flight-lab")flight(p);
    p.text(42,166,"MAKE IT!",12,true);let yy=143;
    for(const q of item.questions.slice(1)){ yy=p.paragraph(48,yy,"- "+q,92,9)-4;if(yy<60)break; }
  }else{
    let yy=657;
    if(item.id==="ember-island-map"){island(p);yy=665;}
    const qs=item.id==="ember-island-map"?item.questions.slice(0,2):item.questions;
    for(let i=0;i<qs.length;i++){
      const q=qs[i];yy=p.paragraph(47,yy,(i+1)+". "+q,89,11)-12;
      if(item.id!=="secret-library" || i>0){p.line(49,yy,540,yy);yy-=31;}
      if(yy<140)break;
    }
    if(item.id==="ember-island-map")p.text(48,180,"Use the coordinate grid and discuss your route.",11);
  }
  p.pen(0.52,0.56,0.52);p.line(42,45,551,45);
  p.fill(0.24,0.27,0.24);p.text(42,27,"Original Side-Quest activity  |  Print at 100% on A4",9);
  p.text(497,27,guide?"GUIDE":"QUEST",9,true);
  return p.ops.join("\n")+"\n";
}

function pdfOf(streams:string[]):Uint8Array{
  const objs:string[]=["<< /Type /Catalog /Pages 2 0 R >>","<< /Type /Pages /Kids ["+streams.map((_,i)=>(3+i*2)+" 0 R").join(" ")+"] /Count "+streams.length+" >>"];
  streams.forEach((ops,i)=>{
    const page=3+i*2, content=page+1;
    objs.push("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> >> >> /Contents "+content+" 0 R >>");
    objs.push("<< /Length "+ops.length+" >>\nstream\n"+ops+"endstream");
  });
  let out="%PDF-1.4\n";const positions=[0];
  objs.forEach((o,i)=>{positions.push(out.length);out+=(i+1)+" 0 obj\n"+o+"\nendobj\n";});
  const xref=out.length;out+="xref\n0 "+(objs.length+1)+"\n0000000000 65535 f \n";
  for(const v of positions.slice(1))out+=String(v).padStart(10,"0")+" 00000 n \n";
  out+="trailer\n<< /Size "+(objs.length+1)+" /Root 1 0 R >>\nstartxref\n"+xref+"\n%%EOF";
  return new TextEncoder().encode(out);
}

function download(c:any,items:VaultItem[],variant:string,label:string){
  const guide=variant==="guide",ink=variant==="ink";
  const bytes=pdfOf(items.map(item=>renderItem(item,ink,guide)));
  c.header("Content-Type","application/pdf");
  c.header("Content-Disposition",'attachment; filename="sidequest-'+label+'-'+variant+'.pdf"');
  c.header("Cache-Control","private, no-store");
  c.header("X-Content-Type-Options","nosniff");
  return c.body(bytes);
}

export function registerPrintableVault(app:App,g:Guards){
  // Browsable metadata only for signed-in parents; no worksheets or answer keys.
  app.get("/api/printables",g.auth,g.parent,async c=>{
    const {limits}=await getEntitlement(c.env.DB,c.get("user").family_id);
    c.header("Cache-Control","private, no-store");
    return c.json({unlocked:limits.aiGeneration,items:VAULT_ITEMS.map(printable),bundles:VAULT_BUNDLES});
  });
  // Route checks are explicit for GET requests too, since the generic membership
  // middleware mainly guards paid mutations. Never host protected PDFs in /public.
  const paid=async(c:any,next:any)=>{
    const {limits}=await getEntitlement(c.env.DB,c.get("user").family_id);
    if(!limits.aiGeneration)return c.json({code:"UPGRADE_REQUIRED",detail:"The Printable Vault is included with a paid Family Membership."},402);
    return next();
  };
  app.get("/api/printables/bundles/:id/pdf",g.auth,g.parent,paid,c=>{
    const id=c.req.param("id");const variant=c.req.query("variant")==="ink"?"ink":"colour";
    if(!VAULT_BUNDLES.some(b=>b.id===id))return c.json({detail:"Pack not found"},404);
    return download(c,VAULT_ITEMS.filter(i=>i.collection===id),variant,id);
  });
  app.get("/api/printables/:id/pdf",g.auth,g.parent,paid,c=>{
    const item=VAULT_ITEMS.find(i=>i.id===c.req.param("id"));
    if(!item)return c.json({detail:"Activity not found"},404);
    const input=c.req.query("variant");const variant=input==="ink"||input==="guide"?input:"colour";
    return download(c,[item],variant,item.id);
  });
}
