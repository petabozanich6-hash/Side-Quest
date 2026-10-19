// First-party Side-Quest A4 SVG image printables. No remote assets, scripts, user HTML or fonts.
// Cut: SOLID. Fold: DASHED. Source kept in code for versioned, scalable artwork.
export type VaultPicture = {id:string; title:string; pages:number; category:string; ages:string; description:string; kind:string; theme:string; collection:string; minutes:number; materials:string; guide:string[]};
const tag=(n:string,props:string,body="")=>"<"+n+" "+props+">"+body+"</"+n+">";
const attr=(v:string)=>v.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");
const line=(x:number,y:number,a:number,b:number,extra="")=>tag("path",'d="M '+x+' '+y+' L '+a+' '+b+'" '+extra);
const path=(d:string,extra="")=>tag("path",'d="'+d+'" '+extra);
const cir=(x:number,y:number,r:number,extra="")=>tag("circle",'cx="'+x+'" cy="'+y+'" r="'+r+'" '+extra);
const rect=(x:number,y:number,w:number,h:number,extra="")=>tag("rect",'x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" '+extra);
const text=(x:number,y:number,v:string,s=18,extra="")=>tag("text",'x="'+x+'" y="'+y+'" font-size="'+s+'" '+extra,attr(v));
const at=(x:number,y:number,s:number,body:string)=>tag("g",'transform="translate('+x+' '+y+') scale('+s+')"',body);
const mesh=(x:number,y:number,w:number,h:number,n:number)=>{let out="";for(let i=1;i<n;i++)out+=line(x,y+h*i/n,x+w,y+h*i/n);return out;};
function frame(ink:boolean,title:string,subtitle:string,page:number,count:number){
 const border=rect(27,26,690,999,'rx="29" fill="none" stroke-width="1.8"')+rect(39,38,666,975,'rx="22" fill="none" stroke-dasharray="2 11"');
 const header=rect(57,68,630,95,'rx="19" fill="'+(ink?"white":"#e3f2e5")+'"')+
  text(76,98,"SIDE-QUEST  /  PRINT  •  PLAY  •  CREATE",17,'letter-spacing="1.5"')+
  text(75,129,title.length>40?title.slice(0,40):title,28,'font-weight="bold"')+
  text(76,153,subtitle+"   /   Page "+(page+1)+" of "+count,14);
 return border+header+text(66,986,"COLOUR  •  CUT  •  BUILD  •  PLAY",14)+text(575,987,"SIDE-QUEST",14,'font-weight="bold"');
}
function star(x:number,y:number,r:number){let p="";for(let i=0;i<10;i++){const q=i*Math.PI/5-Math.PI/2,s=i%2?r*.44:r;p+=(x+Math.cos(q)*s).toFixed(2)+","+(y+Math.sin(q)*s).toFixed(2)+" ";}return tag("polygon",'points="'+p+'"');}
function gem(x:number,y:number,s=1){return at(x,y,s,path("M 0 -26 L 25 -7 L 14 24 L -14 24 L -25 -7 Z")+path("M 0 -26 L 0 24 M -25 -7 H 25 M -25 -7 L 0 24 L 25 -7"));}
function ghost(x:number,y:number,s=1){return at(x,y,s,path("M -40 70 L -40 -12 C -40 -85 40 -85 40 -12 L 40 70 Q 21 48 10 70 Q 0 48 -10 70 Q -25 48 -40 70 Z",'fill="white"')+cir(-14,-16,5)+cir(14,-16,5)+cir(0,19,6));}
function bat(x:number,y:number,s=1){return at(x,y,s,path("M 0 8 C -24 -15 -44 -24 -56 8 Q -85 -11 -126 -45 Q -119 30 -98 35 Q -77 4 -56 39 Q -38 17 -20 47 L 0 21 L 20 47 Q 38 17 56 39 Q 77 4 98 35 Q 119 30 126 -45 Q 85 -11 56 8 Q 44 -24 0 8 Z")+path("M -12 12 L -12 -8 L -2 -1 L 12 -8 L 12 12")+cir(-5,13,2)+cir(5,13,2));}
function pumpkin(x:number,y:number,s=1,face=false){let a=at(x,y,s,path("M -66 58 C -111 20 -106 -68 -46 -75 Q 0 -111 46 -75 C 106 -68 111 20 66 58 Q 10 95 -66 58 Z",'fill="white"')+path("M -42 -70 Q -86 12 -32 79 M 42 -70 Q 86 12 32 79 M 0 -87 Q -21 2 0 89 Q 21 2 0 -87 M -9 -88 Q -15 -116 7 -122 L 17 -120 L 10 -88"));if(face)a+=at(x,y,s,path("M -45 -19 L -14 -43 L -4 -14 Z M 45 -19 L 14 -43 L 4 -14 Z M -1 0 L -9 20 L 9 20 Z M -50 29 L -32 43 L -15 37 L 0 49 L 15 37 L 32 43 L 50 29 L 28 66 L 0 52 L -28 66 Z"));return a;}
function skull(x:number,y:number,s=1){return at(x,y,s,path("M -41 30 C -72 -68 72 -68 41 30 L 28 43 L 23 65 H -23 L -28 43 Z")+cir(-17,2,9)+cir(17,2,9)+path("M -9 33 L 0 15 L 9 33 M -16 52 v 12 M -5 52 v 12 M 6 52 v 12 M 17 52 v 12"));}
function spider(x:number,y:number,s=1){let z=at(x,y,s,cir(0,12,14)+cir(0,-11,9)+cir(-4,-12,2)+cir(4,-12,2));for(let i=0;i<4;i++)z+=at(x,y,s,path("M -9 "+(-18+i*11)+" L -31 "+(-27+i*12)+" L -45 "+(-38+i*13)+" M 9 "+(-18+i*11)+" L 31 "+(-27+i*12)+" L 45 "+(-38+i*13)));return z;}
function web(x:number,y:number,r:number){let s="";for(let k=0;k<12;k++){const t=k*Math.PI/6;s+=line(x,y,x+Math.cos(t)*r,y+Math.sin(t)*r);}for(let j=1;j<=5;j++){let pts="";for(let k=0;k<12;k++){const t=k*Math.PI/6;pts+=(x+Math.cos(t)*r*j/5).toFixed(1)+","+(y+Math.sin(t)*r*j/5).toFixed(1)+" ";}s+=tag("polygon",'points="'+pts+'"');}return s;}
function dragon(x:number,y:number,s=1){return at(x,y,s,
 path("M -120 88 Q -193 96 -185 22 Q -160 54 -130 -10 Q -130 -86 -52 -103 Q 4 -127 23 -165 Q 49 -186 67 -138 L 88 -122 Q 125 -92 125 -61 Q 120 -32 77 -24 Q 48 6 62 40 Q 122 69 131 110 L 101 126 Q 58 84 20 110 Q -44 138 -90 112 L -90 145 L -111 145 Z",'fill="white"')+
 path("M -55 -95 L -104 -203 L -17 -160 L 29 -232 L 23 -139 Z M -55 -95 L 29 -232 M -62 -52 Q -86 13 -39 94 M 11 107 L 10 149 H 36 M -77 103 L -85 145 H -62")+
 path("M 25 -166 L 12 -202 L 49 -180 M 71 -145 L 84 -190 L 98 -159")+cir(90,-108,7)+cir(92,-109,2,'fill="#1a3229"')+path("M 95 -57 Q 115 -41 124 -55")+
 Array.from({length:7},(_,i)=>path("M "+(-97+i*22)+" "+(-103+i%2*9)+" l 15 -23 l 16 25")).join(""));
}
function castle(x:number,y:number,s=1,haunted=false){let z=at(x,y,s,path("M -210 130 V -172 H -163 V -282 H -108 V -218 H 0 V -299 H 54 V -214 H 119 V -272 H 179 V -172 H 210 V 130 Z",'fill="white"'));for(const v of [[-185,-172,68],[-135,-282,56],[27,-299,60],[149,-272,65]]){const X=v[0],Y=v[1],w=v[2];z+=at(x,y,s,path("M "+(X-w/2-8)+" "+Y+" L "+X+" "+(Y-91)+" L "+(X+w/2+8)+" "+Y+" Z")+path("M "+X+" "+(Y-91)+" v -33 l 27 12 -27 10"));}z+=at(x,y,s,path("M -54 130 V -24 Q 0 -107 54 -24 V 130 M 0 -57 V 130 M -42 37 H 43"));for(let r=0;r<7;r++)for(let c=0;c<9;c++){const X=-195+c*45+(r%2?19:0),Y=-143+r*38;if(X>-61&&X<66&&Y>-55)continue;z+=at(x,y,s,path("M "+X+" "+Y+" h 29 v 21 h -29"));}for(const X of [-180,-131,-66,85,147])z+=at(x,y,s,path("M "+X+" -154 v -27 q 13 -37 26 0 v 27 z"));if(haunted)z+=bat(x+10*s,y-314*s,.37*s)+ghost(x+237*s,y+45*s,.6*s)+web(x-181*s,y-190*s,47*s);return z;}
function wheel(x:number,y:number,r:number,labels:string[]){let z=cir(x,y,r)+cir(x,y,6);for(let i=0;i<labels.length;i++){const t=i*Math.PI*2/labels.length,th=t+Math.PI/labels.length;z+=line(x,y,x+Math.cos(t)*r,y+Math.sin(t)*r);const X=x+Math.cos(th)*r*.67,Y=y+Math.sin(th)*r*.67;z+=text(X-27,Y+6,labels[i],12,'font-weight="bold"');}return z;}
function maze(size:number,seed:number,answer=false){let st=seed>>>0;const rand=()=>{st=(Math.imul(st,1664525)+1013904223)>>>0;return st/4294967296;};
 const w=Array.from({length:size*size},()=>[true,true,true,true]),parents=Array(size*size).fill(-1),seen=new Set([0]),stack=[0];
 while(stack.length){const id=stack[stack.length-1],r=Math.floor(id/size),c=id%size,opts:number[][]=[];
 if(r>0&&!seen.has(id-size))opts.push([id-size,0,2]);if(c<size-1&&!seen.has(id+1))opts.push([id+1,1,3]);if(r<size-1&&!seen.has(id+size))opts.push([id+size,2,0]);if(c>0&&!seen.has(id-1))opts.push([id-1,3,1]);
 if(!opts.length){stack.pop();continue;}const pick=opts[Math.floor(rand()*opts.length)];w[id][pick[1]]=false;w[pick[0]][pick[2]]=false;parents[pick[0]]=id;seen.add(pick[0]);stack.push(pick[0]);}
 w[0][3]=false;w[size*size-1][1]=false;let z="",X=118,Y=312,D=508/size;
 for(let i=0;i<w.length;i++){const row=Math.floor(i/size),c=i%size,x=X+c*D,y=Y+row*D; if(w[i][0])z+=line(x,y,x+D,y);if(w[i][3])z+=line(x,y,x,y+D);if(row===size-1&&w[i][2])z+=line(x,y+D,x+D,y+D);if(c===size-1&&w[i][1])z+=line(x+D,y,x+D,y+D);}
 if(answer){const route:number[]=[];let p=size*size-1;while(p>=0){route.push(p);p=parents[p];}z+=tag("polyline",'points="'+route.reverse().map(i=>(X+(i%size+.5)*D)+","+(Y+(Math.floor(i/size)+.5)*D)).join(" ")+'" fill="none" stroke="#397944" stroke-width="5"');}
 return z;
}
function dice(x:number,y:number,u:number){const cells=[[1,0],[0,1],[1,1],[2,1],[3,1],[1,2]],set=new Set(cells.map(q=>q.join(",")));let z="";for(let i=0;i<cells.length;i++){const c=cells[i][0],r=cells[i][1],X=x+c*u,Y=y+r*u;z+=text(X+u*.41,Y+u*.60,String(i+1),25,'font-weight="bold"');const edges=[[X,Y,X+u,Y,0,-1],[X+u,Y,X+u,Y+u,1,0],[X+u,Y+u,X,Y+u,0,1],[X,Y+u,X,Y,-1,0]];for(const v of edges){z+=line(v[0],v[1],v[2],v[3],'stroke-dasharray="'+(set.has([c+v[4],r+v[5]].join(","))?"9 6":"none")+'"');}}return z;}
function art(item:VaultPicture,page:number,guide:boolean) {
 const id=item.id,spooky=/haunted|halloween|spider|bat-puppet|pumpkin|trick-or-treat|monster/.test(id);let z="";
 if(guide&&id.includes("maze"))return text(88,222,"SOLUTION ROUTE: trace the green path",20,'font-weight="bold"')+
 maze(12,25+id.length,true)+(spooky?castle(367,247,.35,true):dragon(177,245,.30));
 if(guide){z+=text(84,230,"PARENT GUIDE / HOW TO PLAY",24,'font-weight="bold"');for(let k=0;k<item.guide.length;k++)z+=text(92,295+k*57,(k+1)+". "+item.guide[k].slice(0,82),17);
 z+=dragon(420,740,.55)+pumpkin(193,787,.55,true);return z;}
 if(id.includes("maze")){z+=text(88,242,"Find a route from START to the treasure!",17);z+=maze(page===0?12:page===1?17:22,25+page+id.length);
 z+=text(66,336,"START",15)+text(631,837,"EXIT",15);z+=spooky?castle(365,252,.40,true)+web(155,886,67)+spider(155,880,.68)+pumpkin(603,892,.36,true):
 dragon(190,256,.32)+gem(577,258,.88)+gem(605,900,.76);return z;}
 if(id.includes("colouring")){z+=castle(365,604,.93,spooky)+dragon(171,606,.67)+moon(590,257,49);
 for(let i=0;i<7;i++)z+=pumpkin(100+i*90,892,.24,spooky&&i%2===0);
 for(let k=0;k<7;k++)z+=gem(111+k*90,771,.27);
 if(spooky)z+=ghost(590,716,.72)+bat(145,257,.52)+web(584,845,52);
 else for(let i=0;i<7;i++)z+=star(128+i*74,248+(i%2)*28,12);
 z+=text(89,938,"Colour the scene. Find the little hidden treasures!",15);return z;}
 if(id.includes("board")||id==="race-to-hoard"){
 if(page===0){z+=text(89,224,"Roll, race and collect treasures! Start at 1, finish at 36.",17);
 for(let r=0;r<6;r++)for(let c=0;c<6;c++){const n=r*6+(r%2?6-c:c+1),X=88+c*94,Y=277+(5-r)*94;z+=rect(X,Y,94,94)+text(X+8,Y+24,String(n),16,'font-weight="bold"');if(n===1)z+=text(X+15,Y+66,"START",13);else if(n===36)z+=text(X+12,Y+66,"FINISH",13);else if(n%9===0)z+=ghost(X+50,Y+58,.29);else if(n%7===0)z+=bat(X+48,Y+61,.21);else if(n%5===0)z+=spooky?pumpkin(X+53,Y+58,.25,true):gem(X+53,Y+58,.49);else z+=star(X+53,Y+57,8);}
 z+=text(86,924,"STAR / PUMPKIN: ROLL AGAIN   •   BAT: BACK 1   •   GHOST: +2",14);
 }else{z+=dice(181,325,100);for(let i=0;i<4;i++){const X=135+i*154;z+=cir(X,875,40)+(spooky?pumpkin(X,870,.31,true):gem(X,873,.58));}z+=text(88,970,"Cut out tokens and fold the die. Solid=cut; dashed=fold.",15);}
 return z;}
 if(id.includes("spinner")){if(page===0){z+=wheel(210,500,144,spooky?["BAT","COBWEB","MOON","MIST","DUST","PUMPKIN"]:["LEAF","MOON","GEM","FLAME","CLOUD","MIST"]);
 z+=wheel(538,500,144,["GLOW","FLOAT","SING","GROW","DANCE","HIDE"]);
 for(const X of [134,455])z+=path("M "+(X-60)+" 780 H "+(X+49)+" l 42 22 -42 22 H "+(X-60)+" Z");
 z+=text(91,920,"Cut both wheels and arrows. Adult help for split pins.",17);
 }else{for(let i=0;i<3;i++){const Y=277+i*195;z+=rect(96,Y,548,150,'rx="18"')+gem(149,Y+76,1)+text(217,Y+40,"POTION "+(i+1),21)+text(215,Y+85,"Ingredients: _________________________________",15)+text(215,Y+125,"Magic effect: _________________________________",15);}}
 return z;}
 if(id.includes("puppet")){
 if(page===0){z+=spooky?bat(367,554,2.0):dragon(345,558,1.15);
 z+=cir(229,562,10)+cir(476,562,10)+text(98,914,"CUT the outer line. PIN where circles are marked.",17);
 }else{for(let i=0;i<2;i++)z+=at(i===0?242:499,455,i===0?1:-1,path("M 0 0 Q -29 -93 -145 -155 Q -128 -88 -177 -50 Q -137 5 -105 60 Q -81 18 -54 60 Q -25 5 0 0 Z")+path("M 0 0 L -145 -155 M 0 0 L -177 -50 M 0 0 L -105 60")+cir(-5,12,10));
 for(let i=0;i<3;i++)z+=path("M "+(116+i*190)+" 726 L "+(179+i*190)+" 693 L "+(212+i*190)+" 774 L "+(138+i*190)+" 790 Z");
 z+=text(89,914,"WINGS + TAIL + LEGS: Cut apart and attach with split pins.",16);}
 return z;}
 if(id.includes("castle")||id.includes("house")){
 if(page===0){z+=text(87,224,"Colour walls, CUT the solid outline, FOLD the dashed seams.",17);
 const x=93,y=341,u=136,h=364;
 z+=path("M "+x+" "+(y+h)+" L "+(x+55)+" "+(y+h-79)+" L "+(x+u)+" "+(y+h)+" H "+(x+u*4+20)+" V "+y+" H "+x+" Z");
 for(let i=1;i<=4;i++)z+=line(x+i*u,y,x+i*u,y+h,'stroke-dasharray="10 6"');
 for(let i=0;i<4;i++){const xx=x+i*u;z+=rect(xx+45,y+143,47,81)+mesh(xx+16,y+16,100,95,4);}
 }else{z+=rect(98,316,548,339)+line(372,316,372,655,'stroke-dasharray="10 7"');for(let i=0;i<8;i++)for(let j=0;j<4;j++)z+=path("M "+(110+i*66)+" "+(344+j*67)+" l 33 -24 l 34 24");
 z+=spooky?ghost(191,788,.82)+bat(503,786,.7)+pumpkin(365,828,.5,true):dragon(275,810,.5)+gem(504,814,.9);
 z+=text(88,935,"Fold roof down the centre. Attach to the folded walls.",17);}
 return z;}
 if(id.includes("egg")){if(page===0){for(let i=0;i<3;i++){const x=182+i*186;z+=path("M "+(x-70)+" 655 Q "+(x-132)+" 451 "+x+" 312 Q "+(x+132)+" 451 "+(x+70)+" 655 Q "+x+" 723 "+(x-70)+" 655 Z");for(let j=0;j<7;j++)z+=path("M "+(x-48)+" "+(417+j*33)+" Q "+x+" "+(438+j*33)+" "+(x+48)+" "+(417+j*33));}}
 else{z+=dragon(327,503,.9)+rect(98,757,533,94)+mesh(98,760,533,90,5)+text(96,901,"Cut this nest strip and glue the end tab into a loop.",16);}
 return z;}
 if(id.includes("pumpkin-face")){if(page===0){z+=pumpkin(368,536,2.4,false)+text(98,918,"Colour a pumpkin. Attach faces from page two.",17);}
 else{for(let i=0;i<4;i++){const x=137+i*152;z+=path("M "+(x-43)+" 340 L "+x+" 290 L "+(x+43)+" 340 Z")+path("M "+(x-42)+" 515 Q "+x+" 464 "+(x+42)+" 515 L "+(x+30)+" 553 H "+(x-30)+" Z")+path("M "+(x-48)+" 679 L "+(x+48)+" 679 L "+x+" 741 Z");}z+=text(89,916,"Cut the eyes, mouths and hats. Mix-and-match your own face!",15);}
 return z;}
 if(id.includes("detective")||id.includes("match-up")){
 z+=text(86,215,"Cut out the six pairs of picture cards and match them!",17);
 for(let i=0;i<6;i++){const X=80+(i%3)*200,Y=272+Math.floor(i/3)*302;z+=rect(X,Y,183,264,'rx="14"')+text(X+18,Y+35,spooky?["GHOST","BAT","SPIDER","PUMPKIN","SKULL","DRAGON"][i]:["FOX","OWL","FROG","RABBIT","DEER","BIRD"][i],16,'font-weight="bold"');
 if(spooky){if(i===0)z+=ghost(X+89,Y+147,.6);
 else if(i===1)z+=bat(X+89,Y+147,.6);
 else if(i===2)z+=spider(X+89,Y+147,.6);
 else if(i===3)z+=pumpkin(X+89,Y+147,.6,true);
 else if(i===4)z+=skull(X+89,Y+147,.9);
 else z+=dragon(X+89,Y+147,.35);
 }else z+=i%2?bat(X+89,Y+149,.4):dragon(X+89,Y+150,.29);}
 return z;}
 if(id.includes("illusion")){if(page===0){z+=text(87,217,"Colour alternating circles to make a moving illusion.",18);for(let r=12;r<251;r+=11)z+=cir(368,565,r);for(let i=0;i<24;i++){const t=i*Math.PI/12;z+=line(368+Math.cos(t)*24,565+Math.sin(t)*24,368+Math.cos(t)*248,565+Math.sin(t)*248);}}
 else{z+=text(86,216,"Colour the triangles; cut them out and tessellate!",17);for(let r=0;r<7;r++)for(let c=0;c<6;c++){const X=88+c*101+(r%2?44:0),Y=290+r*87;if(X+86>650)continue;z+=path("M "+X+" "+(Y+78)+" l 43 -78 l 43 78 Z");}}
 return z;}
 if(id.includes("escape")){if(page===0){z+=text(89,216,"Cut the two alphabet discs. Join at the centre.",18);
 for(const info of [[243,523,160,0],[540,523,136,3]]){const X=info[0],Y=info[1],r=info[2],shift=info[3];z+=cir(X,Y,r)+cir(X,Y,8);for(let i=0;i<26;i++){const t=i*Math.PI*2/26-Math.PI/2;z+=text(X+Math.cos(t)*(r-25)-6,Y+Math.sin(t)*(r-25)+6,String.fromCharCode(65+(i+shift)%26),13);}}
 z+=text(98,814,spooky?"SECRET: S X P S N L Q":"SECRET: J R E O L Q",24,'font-weight="bold"')+text(98,861,"Hint: reverse a three-letter alphabet shift.",16);
 }else{z+=spooky?pumpkin(355,548,1.6,true):castle(366,560,.8,true);
 for(let i=0;i<3;i++)z+=rect(215+i*105,816,81,74,'rx="12"')+text(240+i*105,863,"?",34,'font-weight="bold"');
 z+=text(94,928,"COUNT: 4 pumpkins / torches, 2 bats / gears, 7 gems / spiders.",15);}
 return z;}
 return fantasyScene();
}
function fantasyScene(){return castle(360,563,.77,true)+dragon(171,623,.68)+moon(575,262,49)+web(590,796,53)+ghost(590,899,.43);}
export function renderVaultSvg(item:VaultPicture,page:number,variant:string):string{
 const ink=variant==="ink";const guide=variant==="guide";
 if(page<0||page>=item.pages)throw new Error("Invalid image page");
 const styled='<svg xmlns="http://www.w3.org/2000/svg" width="210mm" height="297mm" viewBox="0 0 744 1052" role="img" aria-label="'+attr(item.title)+'"><style>text{font-family:Georgia,Times New Roman,serif;fill:#1d392f}path,polygon,polyline,circle,rect{stroke:#203a30;stroke-width:2.3;stroke-linejoin:round;stroke-linecap:round}path:not([fill]),polygon:not([fill]),polyline:not([fill]),circle:not([fill]),rect:not([fill]){fill:none}text{stroke:none}svg{background:#fff} @media print{svg{width:210mm;height:297mm}}</style><rect width="744" height="1052" fill="'+(ink?"#fff":"#fffdf6")+'" stroke="none"/>';
 return styled+frame(ink,item.title,guide?"Parent guide":item.category,guide?0:page,guide?1:item.pages)+
 art(item,guide?0:page,guide)+"</svg>";
}
