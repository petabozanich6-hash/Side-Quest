/**
 * Original interactive Side-Quest printables. Every line is first-party vector art
 * generated inside protected PDFs; no remote images or publicly accessible assets.
 *
 * Coordinates use A4 portrait PDF points (595 x 842, origin bottom-left).
 * Solid outlines = cut, dashed strokes = fold.
 */
export type InkPage = {
  ops:string[];
  fill(r:number,g:number,b:number):void;
  pen(r:number,g:number,b:number):void;
  rect(x:number,y:number,w:number,h:number,filled?:boolean):void;
  line(x:number,y:number,x2:number,y2:number,dash?:boolean):void;
  polygon(points:number[][],filled?:boolean):void;
  circle(x:number,y:number,r:number):void;
  text(x:number,y:number,s:string,size?:number,bold?:boolean):void;
  paragraph(x:number,y:number,s:string,chars?:number,size?:number):number;
};
export type PlayItem = {id:string;title:string;category:string;ages:string;minutes:number;materials:string};
const IDS=["lost-treasure-maze","moving-dragon-puppet","enchanted-castle-colouring",
"race-to-hoard","paper-medieval-castle","design-dragon-egg","forest-detective",
"potion-spinner","illusion-gallery","goblin-workshop-escape"];
export const isPlayPrintable=(id:string)=>IDS.includes(id);

function ink(p:InkPage,grey=0.16){p.pen(grey,grey,grey);p.fill(grey,grey,grey);}
function point(p:InkPage,x:number,y:number,s:string,size=10,bold=false){ink(p);p.text(x,y,s,size,bold);}
function segment(p:InkPage,x:number,y:number,xx:number,yy:number){p.line(x,y,xx,yy);}
function dashed(p:InkPage,x:number,y:number,xx:number,yy:number){p.line(x,y,xx,yy,true);}
function circle(p:InkPage,x:number,y:number,r:number){p.circle(x,y,r);}
function box(p:InkPage,x:number,y:number,w:number,h:number){p.rect(x,y,w,h);}
function cross(p:InkPage,x:number,y:number,r=6){p.line(x-r,y,x+r,y);p.line(x,y-r,x,y+r);}
function star(p:InkPage,x:number,y:number,r=13){
  const pts:number[][]=[];
  for(let i=0;i<10;i++){const a=i*Math.PI/5+Math.PI/2;const rr=i%2?r*.45:r;pts.push([x+Math.cos(a)*rr,y+Math.sin(a)*rr]);}
  p.polygon(pts);
}
function gem(p:InkPage,x:number,y:number,s=14){
  p.polygon([[x,y+s],[x+s,y+s*.3],[x+s*.65,y-s],[x-s*.65,y-s],[x-s,y+s*.3]]);
  p.line(x,y+s,x,y-s);p.line(x-s,y+s*.3,x+s,y+s*.3);
}
function roof(p:InkPage,x:number,y:number,w:number,h:number){p.polygon([[x,y],[x+w/2,y+h],[x+w,y]]);}
function turret(p:InkPage,x:number,y:number,w:number,h:number,detail=2){
  ink(p);p.ops.push("1.5 w");
  box(p,x,y,w,h);roof(p,x-12,y+h,w+24,52);
  p.line(x+w/2,y+h+52,x+w/2,y+h+80);p.polygon([[x+w/2,y+h+77],[x+w/2+28,y+h+68],[x+w/2,y+h+62]]);
  for(let k=0;k<detail;k++){
    const yy=y+30+k*65;
    roof(p,x+w/2-12,yy,24,17);box(p,x+w/2-12,yy-30,24,30);
  }
  for(let i=1;i<5;i++)p.line(x+i*w/5,y,x+i*w/5,y+6);
}
function dragonHead(p:InkPage,x:number,y:number,r=42){
  ink(p);p.ops.push("1.9 w");
  p.polygon([[x-44,y-12],[x-37,y+30],[x-25,y+43],[x-20,y+69],[x-5,y+48],[x+13,y+55],[x+31,y+72],[x+30,y+34],[x+53,y+13],[x+63,y-14],[x+37,y-24],[x+12,y-14],[x-13,y-24]]);
  p.circle(x+13,y+17,5);p.circle(x+50,y-5,3);
  p.line(x+9,y-10,x+45,y-13);p.line(x+45,y-13,x+38,y-19);
  for(let i=0;i<3;i++)p.polygon([[x-37+i*13,y+27],[x-28+i*13,y+52],[x-18+i*13,y+30]]);
}
function smallDragon(p:InkPage,x:number,y:number,s=1){
  ink(p);
  p.polygon([[x-45*s,y-10*s],[x-21*s,y+19*s],[x+13*s,y+17*s],[x+29*s,y-1*s],[x+9*s,y-23*s],[x-24*s,y-20*s]]);
  p.polygon([[x-8*s,y+9*s],[x-25*s,y+52*s],[x+4*s,y+30*s],[x+28*s,y+49*s],[x+22*s,y+10*s]]);
  p.polygon([[x-45*s,y-10*s],[x-91*s,y-5*s],[x-66*s,y-33*s],[x-32*s,y-21*s]]);
  circle(p,x+28*s,y+7*s,13*s);circle(p,x+33*s,y+11*s,2*s);
  p.line(x+29*s,y-1*s,x+42*s,y-3*s);
  p.line(x-21*s,y-20*s,x-26*s,y-37*s);p.line(x+7*s,y-20*s,x+12*s,y-36*s);
}
function chest(p:InkPage,x:number,y:number,w=68,h=44){
  ink(p);box(p,x,y,w,h*.72);roof(p,x,y+h*.72,w,h*.37);p.line(x,y+h*.72,x+w,y+h*.72);
  p.rect(x+w*.43,y+h*.33,w*.15,h*.24);p.line(x+w*.5,y+h,x+w*.5,y);
}
function footer(p:InkPage,sub:string){
  ink(p,.33);p.line(42,48,551,48);p.text(42,30,"SIDE-QUEST ORIGINAL  |  A4 100%  |  "+sub,8);
}
function header(p:InkPage,item:PlayItem,inkSaver:boolean,page:number,total:number,subtitle:string) {
  ink(p);
  if(!inkSaver){p.fill(.13,.30,.22);p.rect(0,790,595,52,true);p.fill(1,1,1);}
  else p.line(42,789,552,789);
  p.text(42,815,"SIDE-QUEST  /  PRINT - PLAY - CREATE",12,true);
  ink(p);
  p.text(42,754,item.title.length>36?item.title.slice(0,36):item.title,19,true);
  p.text(42,731,subtitle+"  |  Ages "+item.ages+"  |  "+page+"/"+total,10);
  p.line(42,716,553,716);
  footer(p,inkSaver?"INK-SAVER":"COLOUR YOUR OWN");
}
function create(item:PlayItem,inkSaver:boolean,title:string,page:number,total:number,createPage:()=>InkPage){
  const p=createPage();header(p,item,inkSaver,page,total,title);return p;
}
const pages=(pp:InkPage[])=>pp.map(p=>p.ops.join("\n")+"\n");

type Cell={top:boolean;right:boolean;bottom:boolean;left:boolean;seen?:boolean;parent?:number};
function makeMaze(n:number,seed:number){
  let state=seed>>>0;const rand=(max:number)=>{state=(1664525*state+1013904223)>>>0;return state%max;};
  const a:Cell[]=Array.from({length:n*n},()=>({top:true,right:true,bottom:true,left:true}));
  const stack=[0];a[0].seen=true;
  while(stack.length){
    const id=stack[stack.length-1],col=id%n,row=Math.floor(id/n),options:[number,"top"|"right"|"bottom"|"left","top"|"right"|"bottom"|"left"][]=[];
    if(row>0&&!a[id-n].seen)options.push([id-n,"top","bottom"]);
    if(col<n-1&&!a[id+1].seen)options.push([id+1,"right","left"]);
    if(row<n-1&&!a[id+n].seen)options.push([id+n,"bottom","top"]);
    if(col>0&&!a[id-1].seen)options.push([id-1,"left","right"]);
    if(options.length){const [next,wall,opposite]=options[rand(options.length)];a[id][wall]=false;a[next][opposite]=false;a[next].seen=true;a[next].parent=id;stack.push(next);}
    else stack.pop();
  }
  a[0].left=false;a[n*n-1].right=false;
  const solution:number[]=[];let curr=n*n-1;
  while(true){solution.push(curr);if(curr===0)break;curr=a[curr].parent!;}
  return {cells:a,solution:solution.reverse()};
}
function drawMaze(p:InkPage,n:number,seed:number,showSolution:boolean){
  const {cells,solution}=makeMaze(n,seed);
  const x=94,y=174,size=405,step=size/n;
  ink(p);p.ops.push(n>15?"1.25 w":"2 w");
  cells.forEach((c,i)=>{
    const col=i%n,row=Math.floor(i/n),xx=x+col*step,yy=y+size-row*step;
    if(c.top)p.line(xx,yy,xx+step,yy);
    if(c.left)p.line(xx,yy,xx,yy-step);
    if(row===n-1&&c.bottom)p.line(xx,yy-step,xx+step,yy-step);
    if(col===n-1&&c.right)p.line(xx+step,yy,xx+step,yy-step);
  });
  if(showSolution){
    p.pen(.18,.52,.37);p.ops.push("3.8 w");
    solution.forEach((cell,i)=>{
      const xx=x+(cell%n+.5)*step,yy=y+size-(Math.floor(cell/n)+.5)*step;
      if(i){const prev=solution[i-1];const px=x+(prev%n+.5)*step,py=y+size-(Math.floor(prev/n)+.5)*step;p.line(px,py,xx,yy);}
    });
  }
  ink(p);
  p.text(45,y+size-5,"GO!",14,true);p.text(505,y+4,"HOARD",11,true);
  smallDragon(p,68,632,.42);chest(p,481,130,60,42);
}
function maze(item:PlayItem,inkSaver:boolean,guide:boolean,createPage:()=>InkPage){
  return pages([10,18].map((n,i)=>{
    const p=create(item,inkSaver,guide?"SOLUTION - "+(i?"TRICKY":"EASY"):(i?"TRICKY PATH":"EASY PATH"),i+1,2,createPage);
    point(p,49,687,guide?"Follow the green route from START to the treasure.":"Find a route to the hoard. Colour the crystals when you escape!",10);
    drawMaze(p,n,31+n,guide);
    point(p,76,92,i?"Tricky edition: 18 x 18 passages":"Easy edition: 10 x 10 passages",10,true);
    return p;
  }));
}
function pin(p:InkPage,x:number,y:number){circle(p,x,y,5);cross(p,x,y,2);point(p,x+10,y-3,"PIN",7);}
function wing(p:InkPage,x:number,y:number,flip=false){
  ink(p);const s=flip?-1:1;
  p.polygon([[x,y],[x+s*28,y+84],[x+s*135,y+155],[x+s*112,y+65],[x+s*140,y+25],[x+s*89,y+39],[x+s*53,y+2]]);
  p.line(x,y,x+s*135,y+155);p.line(x,y,x+s*112,y+65);p.line(x,y,x+s*140,y+25);
  pin(p,x+s*12,y+22);
}
function craftPuppet(item:PlayItem,inkSaver:boolean,guide:boolean,createPage:()=>InkPage){
  if(guide){const p=create(item,inkSaver,"ASSEMBLY GUIDE",1,1,createPage);
    point(p,50,665,"1. Colour each piece BEFORE cutting it out.",13,true);
    point(p,50,626,"2. Cut around the solid outer outlines.",12);
    point(p,50,590,"3. Punch the marked joint holes with adult help.",12);
    point(p,50,554,"4. Place the head, wings, legs and tail behind the body.",12);
    point(p,50,518,"5. Join moving parts with split pins, not glue.",12);
    point(p,50,475,"TIP: Back the pieces with thin card for a longer-lasting dragon.",11);
    dragonHead(p,252,316,50);wing(p,145,160);point(p,95,100,"Make the wings flap and the tail swish.",11,true);
    return pages([p]);}
  const a=create(item,inkSaver,"MOVING DRAGON - BODY AND HEAD",1,2,createPage);
  point(a,46,687,"COLOUR  /  CUT ON SOLID LINES  /  MARKED DOTS = PIN HOLES",10,true);
  ink(a);a.ops.push("2 w");
  a.polygon([[181,280],[166,331],[175,419],[216,496],[294,509],[373,448],[397,350],[377,272],[307,249],[234,252]]);
  for(let r=0;r<4;r++)for(let c=0;c<4;c++){const xx=219+c*37+(r%2?17:0),yy=322+r*35; if(xx<351) a.polygon([[xx,yy+13],[xx+13,yy+4],[xx,yy-5],[xx-13,yy+4]]);}
  ["HEAD","WING","WING","TAIL","LEG","LEG"].forEach((label,i)=>{
    const ps=[[264,466],[191,416],[367,414],[371,324],[250,270],[333,274]][i];
    pin(a,ps[0],ps[1]);point(a,ps[0]-15,ps[1]-27,label,7);
  });
  dragonHead(a,265,575);pin(a,232,552);point(a,50,150,"Make the dragon your own: patterns, scales, spots and colours!",11);
  const b=create(item,inkSaver,"WINGS, TAIL AND LEGS",2,2,createPage);
  point(b,46,686,"COLOUR AND CUT. Use child-safe scissors; adults handle pin holes.",10);
  wing(b,194,421);wing(b,392,421,true);
  // Articulated tail segments.
  b.polygon([[98,312],[184,329],[240,307],[180,289],[112,285]]);pin(b,121,303);pin(b,210,307);
  b.polygon([[249,303],[326,329],[409,318],[442,295],[362,282],[294,276]]);pin(b,280,299);
  for(let i=0;i<2;i++){
    const x=137+i*231,y=168;
    b.polygon([[x,y+84],[x+65,y+84],[x+75,y+33],[x+55,y],[x+39,y+22],[x+26,y],[x+14,y+28]]);
    pin(b,x+41,y+70);
    b.polygon([[x+4,y+20],[x+30,y+32],[x+64,y+18],[x+79,y+5],[x+4,y+5]]);
  }
  point(b,70,102,"Optional: glue the finished body onto cereal-box card.",10);
  return pages([a,b]);
}
function stone(p:InkPage,x:number,y:number,w:number,h:number){
  ink(p,.48);box(p,x,y,w,h);
  p.line(x+w*.3,y+h*.45,x+w*.5,y+h*.45);
}
function castles(p:InkPage,detailed:boolean){
  ink(p);p.ops.push("1.3 w");
  // Hills, bridge and castle perimeter.
  p.line(49,193,548,193);
  p.polygon([[63,186],[105,224],[175,211],[217,239],[270,216],[322,237],[410,210],[468,222],[536,192]]);
  box(p,140,220,313,235);
  turret(p,102,208,90,305,2);turret(p,401,208,90,309,2);turret(p,264,326,74,235,2);
  const batt=12;
  for(let i=0;i<15;i++)box(p,148+i*20,455,10,20);
  roof(p,219,453,90,82);
  // Main door and masonry.
  box(p,268,220,65,105);roof(p,268,325,65,31);
  for(let r=0;r<(detailed?9:5);r++){
    const yy=235+r*24;
    for(let c=0;c<8;c++){const xx=157+c*37+(r%2?17:0);if(xx<263 || xx>340)stone(p,xx,yy,22,13);}
  }
  for(let i=0;i<5;i++){
    const xx=193+i*47;
    if(xx>255&&xx<340)continue;
    box(p,xx,377,19,39);roof(p,xx,416,19,13);
  }
  // floating dragon and clouds
  smallDragon(p,105,628,.44);
  for(let i=0;i<5;i++) {
    const x=62+i*107,y=645+(i%2?16:-4);
    circle(p,x,y,10);circle(p,x+14,y+5,13);circle(p,x+28,y,10);
  }
  if(detailed){
    for(let i=0;i<7;i++){const x=90+i*65;gem(p,x,144+i%2*8,7);star(p,x+18,588+i%3*18,5);}
    // hidden key and potion bottle in the scene
    circle(p,480,171,9);p.line(480,162,480,145);p.line(480,148,490,148);p.line(480,153,486,153);
    box(p,64,180,20,26);p.line(69,206,79,206);circle(p,74,191,5);
  }else{for(let i=0;i<5;i++)star(p,75+i*106,605+i%2*18,8);}
}
function colouring(item:PlayItem,inkSaver:boolean,guide:boolean,createPage:()=>InkPage){
  if(guide){const p=create(item,inkSaver,"PARENT NOTES",1,1,createPage);
    point(p,48,660,"Offer a choice of a simpler or more detailed castle scene.",12);
    point(p,48,625,"Fine motor: experiment with pattern, shading and colour.",12);
    point(p,48,590,"On the detailed sheet, find: a key, a potion and seven gems.",12);
    point(p,48,555,"There is no prescribed colour scheme or correct completed picture.",11);
    castles(p,false);return pages([p]);}
  return pages([false,true].map((more,i)=>{
    const p=create(item,inkSaver,more?"HIDDEN TREASURES - DETAILED":"COLOUR ME - SIMPLE",i+1,2,createPage);
    point(p,48,683,more?"Find seven gems, a tiny key and a potion bottle!":"Give this castle its own magical colours and patterns.",10,true);
    castles(p,more);
    point(p,54,99,more?"LOOK CLOSELY: 7 GEMS / 1 KEY / 1 POTION":"Who lives behind these castle gates? Invent their story.",10);
    return p;
  }));
}
function dieNet(p:InkPage,ox:number,oy:number,u:number){
  const cells:[[number,number],number][]=[[[1,0],1],[[0,1],2],[[1,1],3],[[2,1],4],[[3,1],5],[[1,2],6]];
  ink(p);p.ops.push("1.15 w");
  const loc=new Set(cells.map(([[x,y]])=>x+":"+y));
  for(const [[gx,gy],v]of cells){
    const x=ox+gx*u,y=oy+gy*u;
    point(p,x+u*.47,y+u*.45,String(v),15,true);
    const edges:[[number,number],[number,number],number,number][]=[
      [[x,y],[x+u,y],0,-1],[[x+u,y],[x+u,y+u],1,0],
      [[x+u,y+u],[x,y+u],0,1],[[x,y+u],[x,y],-1,0]];
    for(const [a,b,dx,dy]of edges){
      const nx=gx+dx,ny=gy+dy;
      if(loc.has(nx+":"+ny)){dashed(p,a[0],a[1],b[0],b[1]);continue;}
      const tab=(gx===0&&gy===1&&dx===-1)||(gx===2&&gy===1&&dy===-1)||(gx===3&&dy===0&&dx===1)||(gx===1&&gy===0&&dy===-1);
      if(!tab){segment(p,a[0],a[1],b[0],b[1]);continue;}
      dashed(p,a[0],a[1],b[0],b[1]);
      const xx=dx*11,yy=dy*11;
      const c=[a[0]+xx+(dy?8:0),a[1]+yy+(dx?8:0)],d=[b[0]+xx-(dy?8:0),b[1]+yy-(dx?8:0)];
      segment(p,a[0],a[1],c[0],c[1]);segment(p,c[0],c[1],d[0],d[1]);segment(p,d[0],d[1],b[0],b[1]);
    }
  }
}
function board(item:PlayItem,inkSaver:boolean,guide:boolean,createPage:()=>InkPage){
  if(guide){const p=create(item,inkSaver,"HOW TO PLAY",1,1,createPage);
    point(p,49,650,"1. Cut out and stand up player tokens. Make the paper die.",12);
    point(p,49,614,"2. Start on 1, take turns rolling, and follow the numbers.",12);
    point(p,49,577,"3. Stars = jump ahead one extra square.",12);
    point(p,49,540,"4. Goblin helmets = go backwards one square.",12);
    point(p,49,503,"5. Treasure gems = take another turn.",12);
    point(p,49,466,"6. Reach square 36 to win; exact roll is not required.",12);
    chest(p,235,255,130,95);return pages([p]);}
  const a=create(item,inkSaver,"FULL-SIZE ADVENTURE BOARD",1,2,createPage);
  point(a,53,686,"Follow the winding path from START to the DRAGON'S HOARD!",10,true);
  const x=67,y=173,w=75,h=74;
  ink(a);
  for(let r=0;r<6;r++)for(let col=0;col<6;col++){
    const n=r*6+(r%2?6-col:col+1),left=x+col*w,bottom=y+r*h;
    a.rect(left,bottom,w,h);
    const num=n;
    point(a,left+8,bottom+h-17,String(num),12,true);
    if(num===1){point(a,left+15,bottom+32,"START",10,true);smallDragon(a,left+35,bottom+17,.16);}
    else if(num===36){point(a,left+7,bottom+32,"HOARD",10,true);gem(a,left+48,bottom+19,11);}
    else if(num%7===0){star(a,left+46,bottom+34,13);point(a,left+12,bottom+8,"JUMP",8);}
    else if(num%6===0){point(a,left+26,bottom+32,"GOBLIN",8);point(a,left+23,bottom+15,"BACK 1",8);}
    else if(num%5===0){gem(a,left+44,bottom+30,12);point(a,left+11,bottom+8,"ROLL",8);}
    else gem(a,left+43,bottom+27,5);
  }
  point(a,67,99,"STAR +1     GOBLIN -1     GEM: ROLL AGAIN",11,true);
  const b=create(item,inkSaver,"FOLD A DIE AND MAKE TOKENS",2,2,createPage);
  point(b,53,685,"Colour the pieces, cut on solid lines and fold on dashed lines.",10,true);
  dieNet(b,134,338,73);
  for(let i=0;i<4;i++){
    const cx=105+i*125,cy=209;circle(b,cx,cy,35);star(b,cx,cy,14);point(b,cx-17,cy-52,["DRAGON","KNIGHT","GOBLIN","WIZARD"][i],8,true);
  }
  point(b,53,108,"To stand up a token: fold its lower edge over a small card strip.",10);
  return pages([a,b]);
}
function towerNet(p:InkPage,x:number,y:number,w:number,h:number,panels=4){
  const panelW=w/panels;ink(p);p.ops.push("1.5 w");
  // cut perimeter with crenellations on top
  segment(p,x,y,x+w+20,y);
  segment(p,x+w+20,y,x+w+20,y+h);
  segment(p,x+w+20,y+h,x+w,y+h);
  for(let i=panels*3-1;i>=0;i--){
    const px=x+i*(panelW/3);
    const high=i%3!==1?15:0;
    segment(p,px+panelW/3,y+h+high,px,y+h+high);
    if(i>0){const prev=(i-1)%3!==1?15:0;if(prev!==high)segment(p,px,y+h+high,px,y+h+prev);}
  }
  segment(p,x,y+h,x,y);
  for(let i=1;i<panels;i++)dashed(p,x+i*panelW,y,x+i*panelW,y+h);
  dashed(p,x+w,y,x+w,y+h);
  // bricks + windows
  for(let c=0;c<panels;c++){
    const left=x+c*panelW;
    for(let r=0;r<7;r++){
      const yy=y+13+r*25;
      for(let j=0;j<2;j++){const xx=left+12+j*(panelW/2)+(r%2?10:0);if(xx+25<left+panelW-4)box(p,xx,yy,22,13);}
    }
    const xx=left+panelW*.42;box(p,xx,y+h*.57,15,33);roof(p,xx,y+h*.57+33,15,9);
  }
  point(p,x+w+1,y+h+34,"GLUE",8,true);
}
function standFlap(p:InkPage,x:number,y:number,w:number,h:number){
  ink(p);p.line(x,y,x+w,y);p.line(x,y,x,y+h);p.line(x+w,y,x+w,y+h);
  dashed(p,x,y+h,x+w,y+h);
}
function paperCastle(item:PlayItem,inkSaver:boolean,guide:boolean,createPage:()=>InkPage){
  if(guide){const p=create(item,inkSaver,"ASSEMBLY GUIDE",1,1,createPage);
    ["Colour the castle stonework first.","Cut the outside edges and tabs; keep folds intact.","Fold the tower strip along each dashed vertical line.","Use the glue tab to make a square tower.","Fold each wall's bottom stand flap towards the back.","Arrange two towers with the gate wall between them."].forEach((s,i)=>point(p,50,660-i*49,String(i+1)+". "+s,11,i===0));
    point(p,48,285,"TIP: Use light card or glue finished pieces to cardboard.",11);
    turret(p,219,104,100,170);return pages([p]);}
  const a=create(item,inkSaver,"SQUARE TOWER - CUT AND FOLD",1,2,createPage);
  point(a,50,688,"Cut the SOLID outer edge. Fold the DASHED lines.",10,true);
  towerNet(a,75,293,395,247);
  point(a,79,223,"1. Fold the four wall panels inwards.",11);point(a,79,201,"2. Glue the right-hand tab inside the first panel.",11);
  point(a,79,179,"3. Make a second tower using another print of this page.",11);
  const b=create(item,inkSaver,"GATE AND TWO STANDING WALLS",2,2,createPage);
  point(b,50,685,"Fold the bottom stands BACK. Join the walls to your towers.",10,true);
  for(let i=0;i<2;i++){
    const xx=69+i*253;
    standFlap(b,xx,230,216,70);
    box(b,xx,300,216,285);
    for(let k=0;k<9;k++){
      const px=xx+k*24;box(b,px,585,18,17);
    }
    if(i===0){box(b,xx+78,300,65,125);roof(b,xx+78,425,65,32);}
    else for(let k=0;k<3;k++){const wx=xx+35+k*64;box(b,wx,440,23,63);roof(b,wx,503,23,13);}
    for(let r=0;r<4;r++)for(let c=0;c<4;c++){const sx=xx+12+c*48+(r%2?15:0);if(sx+30<xx+214 && !(i===0&&sx>xx+66&&sx<xx+147&&r<3))stone(b,sx,325+r*50,28,20);}
    dashed(b,xx,300,xx+216,300);
  }
  point(b,64,152,"Colour bricks and flags to create your own medieval fortress.",11);
  return pages([a,b]);
}
function eggShape(p:InkPage,x:number,y:number,w:number,h:number,pattern:number){
  ink(p);p.ops.push("1.6 w");
  const pts:number[][]=[];for(let t=0;t<=32;t++){const angle=Math.PI*2*t/32,cy=Math.sin(angle);
    const xx=x+Math.cos(angle)*(w/2)*(0.78+.20*cy),yy=y+cy*h/2;pts.push([xx,yy]);}
  p.polygon(pts);
  if(pattern===0)for(let j=0;j<4;j++){const yy=y-h*.27+j*h*.18;p.line(x-w*.27,yy,x+w*.27,yy);for(let k=-1;k<=1;k++)gem(p,x+k*w*.19,yy+h*.07,6);}
  if(pattern===1)for(let k=0;k<8;k++){const xx=x+(k%3-1)*w*.19,yy=y+Math.floor(k/3)*h*.19-h*.2;star(p,xx,yy,5);}
  if(pattern===2)for(let i=0;i<7;i++){const yy=y-h*.3+i*h*.1;for(let j=0;j<4;j++)circle(p,x-30+j*20+(i%2?8:0),yy,5);}
}
function babyDragon(p:InkPage,x:number,y:number){
  smallDragon(p,x,y,.74);star(p,x+50,y+62,13);gem(p,x-66,y-44,10);
}
function egg(item:PlayItem,inkSaver:boolean,guide:boolean,createPage:()=>InkPage){
  if(guide){const p=create(item,inkSaver,"ASSEMBLY NOTES",1,1,createPage);
    point(p,49,655,"1. Colour the three eggs in different designs.",12);
    point(p,49,616,"2. Cut out a decorated egg or the baby dragon.",12);
    point(p,49,577,"3. Cut the long nest strip on page two.",12);
    point(p,49,538,"4. Bend it into a ring and glue the end tab behind.",12);
    point(p,49,499,"5. Nest the eggs inside or prop them up on light card.",12);
    eggShape(p,271,305,200,240,1);return pages([p]);}
  const a=create(item,inkSaver,"DECORATE AND CUT THREE EGGS",1,2,createPage);
  point(a,50,685,"Decorate with scales, stars, spots, stripes or secret runes.",10,true);
  eggShape(a,170,441,155,251,0);eggShape(a,400,441,155,251,1);
  eggShape(a,289,208,139,184,2);
  point(a,46,96,"Choose your favourite egg. What colour will the hatchling be?",10);
  const b=create(item,inkSaver,"HATCHLING AND PAPER NEST",2,2,createPage);
  point(b,50,681,"Colour and cut. Glue the nest band into a circle.",10,true);
  babyDragon(b,268,517);
  ink(b);box(b,89,231,375,80);box(b,464,231,28,80);dashed(b,464,231,464,311);
  for(let i=0;i<13;i++){const x=100+i*27;segment(b,x,242,x+11,284);segment(b,x+9,241,x+27,275);}
  point(b,476,323,"GLUE",8);
  point(b,89,187,"Wrap this band into a ring to hold eggs and paper treasures.",10);
  return pages([a,b]);
}
function paw(p:InkPage,x:number,y:number,type:number){
  ink(p);
  if(type===0){circle(p,x,y-9,10);for(let j=0;j<4;j++)circle(p,x-16+j*11,y+10+j%2*4,4);} // fox
  if(type===1){circle(p,x-7,y+4,10);circle(p,x+10,y+7,8);circle(p,x,y-13,9);} // rabbit
  if(type===2){p.line(x,y-20,x,y+18);for(let j=-1;j<=1;j++)p.line(x,y,x+j*13,y+19);} // owl
  if(type===3){for(let j=0;j<4;j++)circle(p,x-15+j*10,y+8,4);circle(p,x,y-9,9);} // hedgehog
  if(type===4){p.polygon([[x-15,y-13],[x-4,y+17],[x,y+1],[x+5,y+17],[x+16,y-13]]);} // deer
  if(type===5){circle(p,x,y-4,13);for(let j=0;j<5;j++)circle(p,x-17+j*8,y+14+(j%2?5:0),3);} // frog
}
function animal(p:InkPage,x:number,y:number,type:number){
  ink(p);circle(p,x,y+7,24);
  if(type===0||type===4)p.polygon([[x-21,y+22],[x-29,y+50],[x-4,y+31]]),p.polygon([[x+21,y+22],[x+29,y+50],[x+4,y+31]]);
  if(type===1)p.polygon([[x-17,y+27],[x-25,y+74],[x-1,y+34]]),p.polygon([[x+17,y+27],[x+25,y+74],[x+1,y+34]]);
  if(type===2){circle(p,x-10,y+11,12);circle(p,x+10,y+11,12);p.polygon([[x-5,y-2],[x+5,y-2],[x,y-13]]);}
  if(type===3)for(let i=0;i<9;i++){const a=i*Math.PI/8;segment(p,x-28+i*7,y+27,x-31+i*7,y+40+i%2*8);}
  if(type===5){circle(p,x-12,y+25,12);circle(p,x+12,y+25,12);}
  circle(p,x-9,y+9,3);circle(p,x+9,y+9,3);
  p.line(x-6,y-10,x+6,y-10);
}
function pictureCard(p:InkPage,x:number,y:number,w:number,h:number,label:string,draw:()=>void){
  ink(p);p.ops.push("1.1 w");
  box(p,x,y,w,h);draw();point(p,x+8,y+10,label,9,true);
}
function forest(item:PlayItem,inkSaver:boolean,guide:boolean,createPage:()=>InkPage){
  const names=["FOX","RABBIT","OWL","HEDGEHOG","DEER","FROG"];
  if(guide){const p=create(item,inkSaver,"MATCHING GUIDE",1,1,createPage);
    names.forEach((s,i)=>point(p,52,655-i*54,s+" = TRACK CARD "+(i+1),12,true));
    point(p,51,296,"Cut out picture cards. Match each animal to its tracks.",11);
    point(p,51,257,"Extension: sort the animals by habitat and body covering.",11);
    return pages([p]);}
  const a=create(item,inkSaver,"ANIMAL CARDS AND TRACK CARDS",1,2,createPage);
  point(a,49,685,"Cut out the 12 cards. Mix them up and find the six matching pairs.",10,true);
  for(let i=0;i<6;i++){
    const col=i%3,row=Math.floor(i/3),x=52+col*168,y=439-row*222;
    pictureCard(a,x,y,151,171,names[i],()=>animal(a,x+76,y+86,i));
  }
  const b=create(item,inkSaver,"MORE TRACKS AND HABITATS",2,2,createPage);
  point(b,49,684,"Finish the track pairs, then match animals to their homes.",10,true);
  for(let i=0;i<6;i++){
    const col=i%3,row=Math.floor(i/3),x=52+col*168,y=445-row*164;
    pictureCard(b,x,y,151,143,"TRACK "+(i+1),()=>paw(b,x+76,y+76,i));
  }
  const habitats=["WOODLAND","MEADOW","POND"];
  for(let i=0;i<3;i++){
    const x=52+i*168;
    pictureCard(b,x,123,151,135,habitats[i],()=>{
      if(i===2){for(let j=0;j<3;j++)circle(b,x+46+j*22,190,12);}
      else for(let j=0;j<4;j++){segment(b,x+25+j*30,178,x+25+j*30,217);roof(b,x+10+j*30,216,30,28);}
    });
  }
  return pages([a,b]);
}
function spinnerCircle(p:InkPage,x:number,y:number,r:number,labels:string[],heading:string){
  ink(p);p.ops.push("1.6 w");circle(p,x,y,r);
  labels.forEach((name,i)=>{
    const angle=i*2*Math.PI/labels.length-Math.PI/2;
    segment(p,x,y,x+Math.cos(angle)*r,y+Math.sin(angle)*r);
    const theta=angle+Math.PI/labels.length;
    const tx=x+Math.cos(theta)*r*.56,ty=y+Math.sin(theta)*r*.56;
    point(p,tx-name.length*2.25,ty,name,8,true);
  });
  circle(p,x,y,7);cross(p,x,y,4);
  point(p,x-r+10,y+r+26,heading,11,true);
}
function potion(item:PlayItem,inkSaver:boolean,guide:boolean,createPage:()=>InkPage){
  if(guide){const p=create(item,inkSaver,"PLAY GUIDE",1,1,createPage);
    ["Cut out both large wheels and the two pointers.","With adult help, make a small centre pin hole in each wheel.","Attach a pointer using a split pin; it should spin freely.","Spin one ingredient and one magical effect.","Draw the imaginary potion on page two; invent a silly name.","No real ingredients or liquids are needed."].forEach((s,i)=>point(p,50,656-i*51,String(i+1)+". "+s,11));
    point(p,49,278,"SAFETY: Pretend-play potions only. Never mix real chemicals.",11,true);
    return pages([p]);}
  const a=create(item,inkSaver,"CUT-OUT INGREDIENT AND EFFECT WHEELS",1,2,createPage);
  point(a,48,686,"Cut around each circle and spinner arrow. Do not cut the sections.",10,true);
  spinnerCircle(a,171,467,116,["MOON","LEAF","GEM","DUST","FLAME","MIST"],"INGREDIENTS");
  spinnerCircle(a,423,467,116,["GLOW","FLOAT","SING","SHRINK","HIDE","GROW"],"MAGIC EFFECTS");
  for(let i=0;i<2;i++){
    const x=140+i*250,y=225;
    a.polygon([[x-69,y-21],[x+56,y-21],[x+88,y],[x+56,y+21],[x-69,y+21],[x-91,y]]);
    circle(a,x-46,y,6);point(a,x-34,y-3,"SPIN",10,true);
  }
  point(a,48,111,"Attach each arrow at the centre using a split pin (adult help).",10);
  const b=create(item,inkSaver,"INVENT YOUR MAGICAL POTIONS",2,2,createPage);
  point(b,49,685,"Use the wheels to invent imaginary potions. Draw each bottle!",10,true);
  for(let i=0;i<3;i++){
    const y=498-i*176;ink(b);potionBottle(b,96,y,90);
    box(b,223,y-20,284,124);point(b,237,y+78,"POTION #"+(i+1),11,true);
    point(b,237,y+50,"Ingredient: _________________________",10);
    point(b,237,y+28,"Magic effect: _______________________",10);
    point(b,237,y+7,"My potion's name: ___________________",10);
  }
  return pages([a,b]);
}
function potionBottle(p:InkPage,x:number,y:number,s:number){
  ink(p);box(p,x+s*.3,y+s*.56,s*.4,s*.42);
  box(p,x+s*.21,y+s*.95,s*.58,s*.12);
  p.polygon([[x+s*.3,y+s*.57],[x,y+s*.12],[x+s*.1,y-s*.20],[x+s*.9,y-s*.20],[x+s,y+s*.12],[x+s*.7,y+s*.57]]);
  for(let i=0;i<5;i++)circle(p,x+10+(i*19)%70,y+12+i%3*14,4);
}
function illusion(item:PlayItem,inkSaver:boolean,guide:boolean,createPage:()=>InkPage){
  if(guide){const p=create(item,inkSaver,"PLAY AND CREATE GUIDE",1,1,createPage);
    ["Colour alternating bands to make an optical illusion.","Try two high-contrast colours, then try three colours.","Cut out the geometric pieces on page two.","Rearrange them without gaps to create a repeating pattern.","Compare the effects when you rotate your tessellation."].forEach((s,i)=>point(p,50,649-i*52,String(i+1)+". "+s,11));
    star(p,275,271,107);return pages([p]);}
  const a=create(item,inkSaver,"COLOUR AN OPTICAL ILLUSION",1,2,createPage);
  point(a,49,686,"Alternate colours in the rings. Does the picture seem to move?",10,true);
  ink(a);a.ops.push("1.2 w");
  for(let i=0;i<22;i++){circle(a,292,423,14+i*10);}
  for(let j=0;j<16;j++){const t=j*Math.PI/8;segment(a,292+Math.cos(t)*24,423+Math.sin(t)*24,292+Math.cos(t)*215,423+Math.sin(t)*215);}
  point(a,49,132,"TRY: start with two contrasting colours, then add a third.",10);
  const b=create(item,inkSaver,"COLOUR - CUT - TESSELLATE",2,2,createPage);
  point(b,49,686,"Colour the tiles. Cut on the solid borders, then fit them together.",10,true);
  ink(b);b.ops.push("1.6 w");
  // Equilateral triangles in a tessellation-ready arrangement.
  const tri=68,H=tri*Math.sqrt(3)/2;
  for(let r=0;r<6;r++)for(let c=0;c<7;c++){
    const x=60+c*67,y=190+r*H;
    const shift=r%2?33:0;
    const pts=r%2?[[x+shift,y],[x+shift+tri,y],[x+shift+tri/2,y+H]]:
      [[x,y+H],[x+tri,y+H],[x+tri/2,y]];
    if(pts.every(v=>v[0]<=550&&v[1]<=625))b.polygon(pts);
  }
  point(b,50,105,"Challenge: can you make a repeating dragon-scale pattern?",10);
  return pages([a,b]);
}
function escape(item:PlayItem,inkSaver:boolean,guide:boolean,createPage:()=>InkPage){
  if(guide){const p=create(item,inkSaver,"SOLUTION / GAME MASTER",1,1,createPage);
    point(p,49,663,"CLUE 1: Rotate the alphabet to shift letters backwards by 3.",11,true);
    point(p,49,629,"J R E O L Q decodes to G O B L I N.",12);
    point(p,49,592,"CLUE 2: Count torch icons (4), cog icons (2), gem icons (7).",11);
    point(p,49,557,"FINAL LOCK: enter the three-symbol code 4 - 2 - 7.",12,true);
    point(p,49,519,"Play as a cut-and-sort cipher challenge; no device needed.",11);
    box(p,190,242,190,210);roof(p,190,452,190,80);point(p,219,322,"4  /  2  /  7",24,true);
    return pages([p]);}
  const a=create(item,inkSaver,"THE GOBLIN'S SECRET DECODER",1,2,createPage);
  point(a,48,689,"Cut out the two discs. Join at their centre with a split pin.",10,true);
  discLetters(a,171,460,117,false);discLetters(a,433,460,92,true);
  point(a,55,299,"Align outer A with inner D. Read the secret letters back 3.",10);
  point(a,67,266,"SECRET MESSAGE:   J     R     E     O     L     Q",14,true);
  for(let k=0;k<6;k++)box(a,68+k*83,202,69,38);
  point(a,55,143,"Only the real goblin name will open the next room.",10);
  const b=create(item,inkSaver,"ESCAPE THE WORKSHOP",2,2,createPage);
  point(b,48,685,"Decode the name, collect the three clues and open the door!",10,true);
  // A door with 3-digit lock and visual counts.
  box(b,207,388,180,236);roof(b,207,624,180,65);circle(b,365,490,8);
  for(let k=0;k<3;k++){box(b,236+k*47,463,37,48);point(b,246+k*47,482,"?",18,true);}
  point(b,239,442,"THE FINAL LOCK",12,true);
  for(let i=0;i<4;i++){const x=115+i*95,y=330;
    b.polygon([[x-9,y],[x+9,y],[x+13,y+30],[x+6,y+47],[x-2,y+35],[x-11,y+43],[x-14,y+25]]);
    b.line(x,y,x,y-32);b.line(x-7,y-30,x+7,y-30);
  }
  for(let i=0;i<2;i++){
    const x=245+i*84,y=294;
    b.circle(x,y,22);b.circle(x,y,9);
    for(let a=0;a<8;a++){const t=a*Math.PI/4;
      const xx=x+Math.cos(t)*26,yy=y+Math.sin(t)*26; b.rect(xx-4,yy-4,8,8);
    }
  }
  for(let i=0;i<7;i++)gem(b,82+i*70,223,13);
  point(b,61,365,"TORCHES",9,true);point(b,196,302,"GEARS",9,true);point(b,67,176,"GEMS",9,true);
  point(b,48,111,"Read the counts in order: TORCHES - GEARS - GEMS",10);
  return pages([a,b]);
}
function discLetters(p:InkPage,x:number,y:number,r:number,inner:boolean){
  ink(p);circle(p,x,y,r);circle(p,x,y,7);
  for(let i=0;i<26;i++){
    const theta=i*2*Math.PI/26-Math.PI/2;
    const len=r-8;
    segment(p,x+Math.cos(theta)*(r-18),y+Math.sin(theta)*(r-18),x+Math.cos(theta)*r,y+Math.sin(theta)*r);
    const j=inner?(i+3)%26:i; // readable Caesar shift +3
    point(p,x+Math.cos(theta)*len-3,y+Math.sin(theta)*len-3,String.fromCharCode(65+j),9,true);
  }
  point(p,x-r+18,y+r+13,inner?"INNER DISC":"OUTER DISC",11,true);
}

export function renderPlayPages(item:PlayItem,inkSaver:boolean,guide:boolean,createPage:()=>InkPage):string[] {
  switch(item.id){
    case "lost-treasure-maze":return maze(item,inkSaver,guide,createPage);
    case "moving-dragon-puppet":return craftPuppet(item,inkSaver,guide,createPage);
    case "enchanted-castle-colouring":return colouring(item,inkSaver,guide,createPage);
    case "race-to-hoard":return board(item,inkSaver,guide,createPage);
    case "paper-medieval-castle":return paperCastle(item,inkSaver,guide,createPage);
    case "design-dragon-egg":return egg(item,inkSaver,guide,createPage);
    case "forest-detective":return forest(item,inkSaver,guide,createPage);
    case "potion-spinner":return potion(item,inkSaver,guide,createPage);
    case "illusion-gallery":return illusion(item,inkSaver,guide,createPage);
    case "goblin-workshop-escape":return escape(item,inkSaver,guide,createPage);
    default:return [];
  }
}
