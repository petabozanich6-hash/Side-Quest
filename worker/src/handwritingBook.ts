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
 A:["M35 2 L8 80","M35 2 L65 80","M19 51 L54 51"],
 B:["M11 0 L11 80","M11 0 C77 -3 76 41 11 40","M11 40 C84 35 83 86 11 80"],
 C:["M66 11 C9 -18 -5 95 66 73"],
 D:["M11 0 L11 80","M11 0 C91 0 90 82 11 80"],
 E:["M12 0 L12 80","M12 0 L66 0","M12 40 L58 40","M12 80 L66 80"],
 F:["M12 0 L12 80","M12 0 L65 0","M12 39 L56 39"],
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
 a:["M49 39 C29 23 10 40 10 56 C10 79 35 87 49 76 L49 32 L49 80"],
 b:["M14 0 L14 80","M14 57 C14 24 61 24 61 56 C61 86 14 88 14 57"],
 c:["M62 41 C32 15 9 35 9 56 C9 80 36 89 62 72"],
 d:["M57 41 C39 23 10 39 10 56 C10 85 40 90 57 74","M57 0 L57 80"],
 e:["M12 56 L62 56 C61 20 11 22 11 56 C11 80 37 89 61 72"],
 f:["M18 80 L18 20 Q19 -3 53 2","M5 33 L47 33"],
 g:["M52 40 C33 22 10 39 10 55 C10 83 38 89 52 75","M52 33 L52 89 Q52 108 29 108 Q15 108 12 98"],
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

/** A4 artwork uses an open white background: only charcoal, white and pale
 * grey lines. Every teaching diagram and trace is an original SVG path. */
const xml=(value:string)=>value.replace(/&/g,"&amp;").replace(/</g,"&lt;")
 .replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");
const txt=(x:number,y:number,v:string,size=22,attrs="")=>
 '<text x="'+x+'" y="'+y+'" font-size="'+size+'" '+attrs+'>'+xml(v)+'</text>';
const rule=(x1:number,y1:number,x2:number,y2:number,dashed=false,color="#777",stroke=1.35)=>
 '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+color+'" stroke-width="'+stroke+'"'+(dashed?' stroke-dasharray="7 8"':'')+'/>';
const round=(x:number,y:number,w:number,h:number,r=16,stroke="#242424",weight=1.6)=>
 '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+r+'" fill="white" stroke="'+stroke+'" stroke-width="'+weight+'"/>';
const path=(d:string,width=3)=>'<path d="'+d+'" stroke="#181818" stroke-width="'+width+'" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';

function stars(x:number,y:number){
 const star=(sx:number,sy:number,r:number)=>path('M'+(sx-r)+' '+sy+' L'+(sx+r)+' '+sy+' M'+sx+' '+(sy-r)+' L'+sx+' '+(sy+r),1.7);
 return star(x,y,8)+star(x+28,y-19,4)+star(x-17,y+27,4);
}
function dragon(x:number,y:number,scale=1) {
 // A complete friendly dragonling with horns, wings, curled tail, paws and smile.
 // Original printable monochrome outlines, designed to be coloured by children.
 let s='<g transform="translate('+x+' '+y+') scale('+scale+')" fill="white" stroke="#111" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round">';
 s+=path("M60 169 Q31 150 23 179 Q20 196 7 187 Q1 180 11 171 Q-2 171 4 192 Q23 208 37 184 Q48 173 64 180");
 s+=path("M56 119 Q16 82 21 134 Q30 130 37 137 Q38 151 59 147");
 s+=path("M127 121 Q168 86 161 141 Q151 129 140 139 Q144 156 127 161");
 s+=path("M65 54 Q47 30 61 17 Q61 36 84 42");
 s+=path("M103 42 Q101 13 116 5 Q111 30 127 46");
 s+=path("M69 114 Q45 126 53 158 Q51 194 86 196 L127 195 Q149 188 146 163 Q148 130 120 114Z");
 s+=path("M86 129 Q76 145 79 172 Q80 191 104 190",2);
 s+=path("M53 86 Q42 45 82 36 Q129 27 144 65 Q156 104 129 123 Q105 139 75 120 Q57 110 53 86Z");
 s+=path("M110 95 Q138 85 151 100 Q159 114 137 120 Q114 126 103 115");
 s+='<circle cx="82" cy="81" r="12"/><circle cx="117" cy="79" r="12"/>';
 s+='<circle cx="86" cy="84" r="5" fill="#111"/><circle cx="121" cy="82" r="5" fill="#111"/>';
 s+='<circle cx="87" cy="81" r="1.8" stroke="none"/><circle cx="122" cy="79" r="1.8" stroke="none"/>';
 s+=path("M115 110 Q125 119 142 109");
 s+='<circle cx="142" cy="103" r="1.5" fill="#111"/>';
 s+=path("M73 67 Q80 62 91 66 M111 66 Q123 59 131 67",1.8);
 s+=path("M65 139 Q53 156 67 167 Q74 172 79 162");
 s+=path("M132 139 Q142 160 129 169 Q121 174 116 166");
 s+=path("M64 181 Q52 189 55 196 Q72 205 91 197 L95 187");
 s+=path("M122 184 Q142 188 143 198 Q121 205 108 194");
 s+=path("M63 198 L65 202 M72 199 L75 203 M132 200 L131 204",1.5);
 s+=path("M50 126 L38 116 L45 138 M46 152 L35 148 L48 162",1.6);
 return s+"</g>";
}
function pencil(x:number,y:number,s=1){
 return '<g transform="translate('+x+' '+y+') rotate(33) scale('+s+')" stroke="#111" stroke-width="2" fill="white" stroke-linejoin="round">'
 +'<path d="M0 0 L19 0 L19 77 L9.5 99 L0 77Z"/><path d="M0 75 L19 75"/><path d="M0 14 L19 14"/><path d="M9.5 99 L7 92 L12 92Z" fill="#111"/></g>';
}

/** Word-specific black-outline pictures, not decorative coloured emoji.
 * The illustrations are small so the letter writing stays the focus. */
const PICTURES:Record<string,string>={
 apple:'<path d="M58 23 Q31 9 22 38 Q9 80 42 89 Q55 92 65 88 Q93 98 102 61 Q111 14 77 24 Q67 28 58 23Z M58 22 L63 6 M62 20 Q80 3 93 13 Q84 28 62 20Z"/>',
 ball:'<circle cx="60" cy="49" r="43"/><path d="M60 6 Q21 46 60 92 M60 6 Q99 46 60 92 M18 49 Q60 17 101 49 M18 49 Q60 81 101 49"/>',
 cat:'<path d="M22 43 L25 9 L50 24 Q66 20 83 25 L106 10 L104 46 Q115 86 67 91 Q18 91 22 43Z M43 57 L44 57 M81 57 L82 57 M60 68 L65 72 L70 68 M65 73 Q49 83 44 74 M65 73 Q79 84 84 73 M30 73 L7 70 M31 80 L9 88 M97 73 L118 70 M97 80 L118 87"/>',
 dog:'<path d="M29 31 Q4 22 12 65 L28 74 M99 30 Q121 23 117 66 L99 76 M29 31 Q65 10 99 31 L99 79 Q64 102 28 79Z M45 58 L47 59 M83 58 L85 59 M56 72 Q65 79 74 72 M56 72 Q65 89 74 72"/>',
 egg:'<path d="M63 7 Q40 8 29 35 C15 67 32 96 63 96 C95 96 111 69 96 35 Q85 8 63 7Z"/>',
 fish:'<path d="M12 51 L0 20 L0 82 L13 51 Q42 14 82 37 Q95 46 109 51 Q95 56 82 67 Q42 87 13 51 Z M64 35 Q47 51 64 69"/><circle cx="83" cy="48" r="3" fill="#111"/>',
 goat:'<path d="M30 26 L18 1 L34 10 M89 26 L101 1 L86 12 M22 49 Q14 27 45 23 L78 23 Q112 25 104 60 Q94 79 82 81 L75 100 L61 86 Q35 94 22 71Z M43 54 L44 54 M83 54 L84 54 M53 71 Q64 80 75 70"/>',
 hat:'<path d="M29 70 L48 13 Q54 5 60 13 L91 70 M11 70 Q57 82 109 70 L111 83 Q58 100 10 83Z M37 54 L85 54"/>',
 igloo:'<path d="M10 87 Q10 13 60 13 Q112 13 113 87Z M45 87 L45 56 Q45 41 60 41 Q75 41 75 56 L75 87 M14 58 L42 58 M78 58 L106 58 M28 34 L47 44 M77 44 L92 34 M45 16 L45 38 M75 16 L75 38"/>',
 jam:'<path d="M28 21 L92 21 L92 88 Q60 100 28 88Z M23 13 L97 13 L97 26 L23 26Z M28 43 L92 43 M32 70 Q57 46 88 72 M54 60 L55 81"/>',
 kite:'<path d="M59 6 L12 49 L59 97 L105 49Z M59 6 L59 97 M12 49 L105 49 M59 97 Q66 113 48 128 M50 112 L38 107 L40 117 L51 112 L61 118 L61 108Z"/>',
 leaf:'<path d="M12 84 Q12 16 107 9 Q110 89 35 100 Q23 99 12 84Z M15 101 Q44 55 107 9 M44 63 L33 39 M62 47 L92 51"/>',
 moon:'<path d="M83 5 Q24 3 20 54 Q18 105 90 94 Q52 76 49 44 Q48 20 83 5Z M97 20 L100 13 M104 26 L110 24"/>',
 nest:'<path d="M10 56 Q26 107 64 103 Q102 105 116 55 Q62 81 10 56Z M24 64 L102 91 M102 65 L27 91 M41 55 C19 20 48 9 60 30 Q71 3 89 23 Q98 40 81 57"/>',
 octopus:'<path d="M36 59 Q21 12 62 12 Q103 12 92 59 M36 59 Q13 53 13 73 Q13 89 28 85 M45 68 Q32 94 45 98 Q57 102 59 82 M69 75 Q76 101 87 96 Q97 91 87 79 M93 60 Q116 57 115 78 Q113 87 102 84 M52 49 L53 49 M73 49 L74 49"/>',
 pig:'<path d="M27 39 L19 11 L44 27 Q61 19 79 27 L104 11 L97 41 Q109 88 63 94 Q16 91 27 39Z M45 53 L46 53 M81 53 L82 53 M42 70 Q63 57 84 70 Q86 86 64 87 Q41 85 42 70Z"/><ellipse cx="57" cy="76" rx="2.5" ry="4"/><ellipse cx="70" cy="76" rx="2.5" ry="4"/>',
 queen:'<path d="M17 38 L29 77 L100 77 L112 38 L87 55 L62 14 L39 55Z M27 85 L101 85 M27 92 L101 92 M62 31 L62 31"/>',
 rainbow:'<path d="M10 87 A55 55 0 0 1 120 87 M24 87 A41 41 0 0 1 106 87 M38 87 A27 27 0 0 1 92 87 M7 89 L31 89 M100 89 L123 89"/>',
 sun:'<circle cx="65" cy="55" r="27"/><path d="M65 3 L65 20 M65 90 L65 109 M13 55 L30 55 M101 55 L119 55 M29 17 L40 28 M91 81 L103 94 M29 93 L41 81 M91 28 L103 16"/>',
 tree:'<path d="M58 91 L58 63 M74 91 L74 63 M57 91 L74 91 M26 53 Q5 37 27 20 Q32 1 56 14 Q74 -4 91 17 Q122 17 112 45 Q123 68 96 72 Q79 89 65 72 Q46 87 30 69 Q14 70 26 53Z"/>',
 umbrella:'<path d="M10 52 Q31 -5 66 15 Q106 12 122 52 Q104 38 86 53 Q66 36 47 53 Q27 38 10 52Z M66 15 L66 92 Q66 111 49 105 Q40 100 42 91"/>',
 van:'<path d="M7 43 L24 23 L73 23 L73 37 L99 37 L113 56 L113 83 L7 83Z M12 44 L30 29 L65 29 L65 44Z M80 43 L96 43 L108 57 L80 57Z"/><circle cx="32" cy="84" r="10"/><circle cx="90" cy="84" r="10"/>',
 water:'<path d="M15 25 Q31 36 47 25 Q63 15 79 25 Q95 36 112 25 M15 52 Q31 63 47 52 Q63 42 79 52 Q95 63 112 52 M15 79 Q31 90 47 79 Q63 69 79 79 Q95 90 112 79"/>',
 xylophone:'<path d="M15 31 L93 16 L98 30 L17 46Z M14 52 L101 39 L105 53 L17 67Z M12 73 L111 62 L114 76 L15 88Z M28 6 L100 97 M85 7 L15 96"/>',
 yarn:'<circle cx="62" cy="53" r="43"/><path d="M26 31 Q47 54 62 94 M42 17 Q73 50 93 73 M80 18 Q57 40 22 72 M101 39 Q77 58 58 95 M103 81 Q118 97 121 106"/>',
 zebra:'<path d="M30 84 L30 48 Q16 35 30 18 L47 21 L62 8 L77 21 Q96 29 94 49 L108 62 L98 75 L82 73 L80 99 M52 86 L50 100 M35 34 L57 53 M43 22 L68 48 M70 28 L87 42 M35 64 L59 81 M63 57 L86 74"/><circle cx="83" cy="43" r="2.5" fill="#111"/>'
};
function picture(word:string,x:number,y:number,scale=1){
 return '<g transform="translate('+x+' '+y+') scale('+scale+')" fill="none" stroke="#111" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">'+(PICTURES[word]||PICTURES.apple)+'</g>';
}
function banner(x:number,y:number,w:number,label:string){
 return round(x,y,w,58,14,"#242424",2.2)+txt(x+w/2,y+40,label,34,'font-weight="bold" text-anchor="middle"');
}
function frame(page:number,body:string){
 return '<svg xmlns="http://www.w3.org/2000/svg" width="210mm" height="297mm" viewBox="0 0 794 1123" role="img" aria-label="Handwriting workbook page '+(page+1)+'">'
 +'<defs><marker id="handwriting-arrow" markerWidth="2.3" markerHeight="2.3" refX="2" refY="1.15" orient="auto" markerUnits="strokeWidth"><path d="M0 0 L2.3 1.15 L0 2.3Z" fill="#111"/></marker></defs>'
 +'<rect width="794" height="1123" fill="white"/>'
 +'<g font-family="Trebuchet MS,Arial,sans-serif" fill="#151515">'
 +txt(61,54,"SIDE-QUEST LEARNING",17,'font-weight="bold" letter-spacing="1.4"')
 +txt(731,54,"HANDWRITING QUEST",13,'font-weight="bold" text-anchor="end" letter-spacing="1.4"')
 +rule(61,70,733,70,false,"#555",1.5)
 +body
 +rule(61,1054,733,1054,false,"#999",1)
 +txt(62,1083,"Small steps. Big adventures.  •  sidequestlearning.app",14)
 +txt(718,1083,String(page+1),15,'text-anchor="end"')
 +'</g></svg>';
}
/** Stroke paths are centred on the four-rule handwriting guide:
 * top 0, x-height 32, baseline 80, descender 110.
 * Demo letters have small start-point numbers and direction arrows;
 * practice letters use dotted path CENTRELINES suitable for pencil tracing. */
function glyph(letter:string,x:number,y:number,scale:number,kind:"model"|"trace"="model"){
 const strokes=STROKES[letter]||[];
 let s='<g transform="translate('+x+' '+y+') scale('+scale+')" fill="none" stroke-linecap="round" stroke-linejoin="round">';
 const seenStarts:Array<[number,number]>=[];
 strokes.forEach((d,i)=>{
  const closed=/[Zz]\s*$/.test(d);
  s+='<path d="'+d+'" stroke="'+(kind==="trace"?"#666":"#151515")+'" stroke-width="'+(kind==="trace"?2.8:2.6)+'"'
   +(kind==="trace"?' stroke-dasharray="0.7 7.5"':closed?'':' marker-end="url(#handwriting-arrow)"')+'/>';
  if(kind==="model"){
   const m=/^M(-?\d+)\s+(-?\d+)/.exec(d);
   if(m){
    const px=Number(m[1]),py=Number(m[2]);
    // Some letter strokes start at the same point. Offset the second *label*,
    // not the path, so the numbers cannot print directly on top of one another.
    const same=seenStarts.some(([sx,sy])=>Math.hypot(sx-px,sy-py)<6);
    seenStarts.push([px,py]);
    const labelX=px+(same?16:0),labelY=py+(same?9:0);
    if(same)s+='<line x1="'+px+'" y1="'+py+'" x2="'+labelX+'" y2="'+labelY+'" stroke="#444" stroke-width="1"/>';
    s+='<circle cx="'+labelX+'" cy="'+labelY+'" r="7.2" fill="white" stroke="#111" stroke-width="1.2"/>';
    s+=txt(labelX,labelY+3,String(i+1),9.8,'font-weight="bold" text-anchor="middle" stroke="none" fill="#111"');
   }
  }
 });
 return s+'</g>';
}
function guidelines(left:number,right:number,top:number,width=1.4,scale=1){
 let s=rule(left,top,right,top,false,"#c4c4c4",width);
 s+=rule(left,top+35*scale,right,top+35*scale,true,"#cecece",width);
 s+=rule(left,top+88*scale,right,top+88*scale,false,"#959595",width);
 s+=rule(left,top+121*scale,right,top+121*scale,true,"#d1d1d1",width);
 return s;
}
function row(baseline:number,letters:string[],traceCount:number){
 const top=baseline-88, left=98,right=697,step=119.8;
 let s=guidelines(left,right,top);
 letters.forEach((letter,i)=>{
  if(i<traceCount)s+=glyph(letter,105+i*step,top,1.1,"trace");
 });
 return s;
}
function cover(page:number,back=false){
 let s=round(75,122,644,838,18,"#111",2.8);
 s+=stars(132,221)+stars(664,224)+stars(140,730);
 s+=banner(151,169,492,"SIDE-QUEST LEARNING");
 s+=txt(397,350,back?"YOU DID IT!":"HANDWRITING",64,'text-anchor="middle" font-weight="bold"');
 s+=txt(397,424,back?"LETTER HERO":"WORKBOOK",67,'text-anchor="middle" font-weight="bold"');
 s+=txt(397,479,back?"Keep practising your letters!":"Letters  •  Tracing  •  Practice",25,'text-anchor="middle"');
 s+=dragon(260,499,1.42)+pencil(560,601,1.3);
 s+=txt(397,822,back?"Every little effort matters.":"A a   B b   C c   D d",30,'text-anchor="middle"');
 if(!back){s+=txt(126,893,"This book belongs to:",21);s+=rule(361,899,657,899);}
 return frame(page,s);
}
function parents(page:number){
 let s=banner(125,105,544,"How to write letters");
 s+=dragon(629,164,.43);
 const messages=["Start at the numbered dot.","Follow the arrows carefully.","Trace the dotted shapes slowly.","Copy each letter on the empty lines.","A few minutes is enough. Have fun!"];
 messages.forEach((m,i)=>{
  const y=245+i*98;
  s+='<circle cx="122" cy="'+(y-7)+'" r="20" stroke="#111" stroke-width="2.3" fill="white"/>';
  s+=txt(122,y,String(i+1),23,'text-anchor="middle" font-weight="bold"');
  s+=txt(165,y,m,24);
  if(i<4)s+=rule(157,y+22,675,y+22,false,"#dedede",1);
 });
 s+=round(88,760,617,252,16,"#555",1.7);
 s+=txt(112,802,"Our handwriting lines",29,'font-weight="bold"');
 s+=guidelines(126,661,831);
 s+=glyph("a",171,831,1.1,"trace");
 s+=txt(126,992,"The middle dashed line helps us size lowercase letters.",17);
 return frame(page,s);
}
function letterPage(page:number){
 const i=Math.floor((page-2)/2),ch=ALPHABET[i],upper=ch.toUpperCase(),word=WORDS[i];
 const practice=(page-2)%2===1;
 if(practice){
  let s=banner(122,100,549,"Let's practise "+upper+ch);
  s+=txt(108,199,"Trace the letters, then write on your own.",23);
  s+=dragon(646,167,.42);
  s+=txt(102,248,"1. Trace the capital "+upper+".",22,'font-weight="bold"');
  s+=row(351,Array(5).fill(upper),5);
  s+=row(485,Array(5).fill(upper),2);
  s+=txt(102,544,"2. Trace the lowercase "+ch+".",22,'font-weight="bold"');
  s+=row(655,Array(5).fill(ch),5);
  s+=row(790,Array(5).fill(ch),2);
  s+=txt(102,858,"3. Now try without tracing.",22,'font-weight="bold"');
  s+=row(975,[],0);
  s+=txt(108,1035,"Great effort! You are learning to write "+upper+ch+".",16);
  return frame(page,s);
 }
 let s=banner(111,101,569,"Let's learn the letter "+upper+ch);
 s+=round(75,184,309,292,15,"#555",1.7);
 s+=round(408,184,309,292,15,"#555",1.7);
 s+=txt(230,222,"Uppercase "+upper,24,'font-weight="bold" text-anchor="middle"');
 s+=txt(562,222,"Lowercase "+ch,24,'font-weight="bold" text-anchor="middle"');
 s+=guidelines(112,358,249,1.1,1.8)+guidelines(443,694,249,1.1,1.8);
 s+=glyph(upper,169,249,1.8,"model");
 s+=glyph(ch,501,249,1.8,"model");
 s+=txt(398,506,upper+" is for "+word+".",29,'text-anchor="middle" font-weight="bold"');
 s+=picture(word,330,519,.76);
 s+=txt(103,636,"Trace the uppercase "+upper+".",22,'font-weight="bold"');
 s+=row(757,Array(5).fill(upper),5);
 s+=txt(103,828,"Trace the lowercase "+ch+".",22,'font-weight="bold"');
 s+=row(955,Array(5).fill(ch),5);
 s+=txt(107,1024,"Start at the numbered dots. Turn the page for more practice!",16);
 return frame(page,s);
}
function certificate(page:number){
 let s=round(91,129,611,848,20,"#111",3);
 s+=stars(167,216)+stars(633,218);
 s+=txt(396,259,"SIDE-QUEST LEARNING",27,'font-weight="bold" text-anchor="middle"');
 s+=txt(396,373,"LITTLE LETTER HERO!",47,'font-weight="bold" text-anchor="middle"');
 s+=txt(396,457,"This certificate belongs to",25,'text-anchor="middle"');
 s+=rule(173,531,615,531,false,"#333",2);
 s+=txt(396,625,"For practising the alphabet",30,'text-anchor="middle"');
 s+=txt(396,668,"one letter at a time.",30,'text-anchor="middle"');
 s+=dragon(317,706,1.1);
 s+=txt(130,916,"Date:",19);s+=rule(187,921,353,921);
 s+=txt(379,916,"Grown-up:",19);s+=rule(485,921,649,921);
 return frame(page,s);
}
export function renderHandwritingPage(page:number):string|null{
 if(!Number.isInteger(page)||page<0||page>=HANDWRITING_PAGE_COUNT)return null;
 if(page===0)return cover(page);
 if(page===1)return parents(page);
 if(page===54)return certificate(page);
 if(page===55)return cover(page,true);
 return letterPage(page);
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
