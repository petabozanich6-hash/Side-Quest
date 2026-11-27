import React,{useRef,useState} from "react";
// The existing signed PDF renderer overlays name at (790,440), title at
// (790,626), and date at (647,892) on this exact 1536 x 1024 RGB canvas.
export async function prepareAcademyArtwork(signature){
 if(!signature||!["image/png","image/jpeg"].includes(signature.type)||signature.size>1500000)throw Error("Choose your own PNG or JPEG signature, up to 1.5 MB.");
 const url=URL.createObjectURL(signature);
 try{
  const img=new Image();img.src=url;await img.decode();
  if(!img.naturalWidth||!img.naturalHeight||img.naturalWidth*img.naturalHeight>16000000)throw Error("Signature image is too large.");
  const c=document.createElement("canvas");c.width=1536;c.height=1024;
  const ctx=c.getContext("2d",{alpha:false});if(!ctx)throw Error("Certificate drawing is unavailable in this browser.");
  const ink="#25334c",gold="#b58c4f",paper="#fffdf8";
  ctx.fillStyle=paper;ctx.fillRect(0,0,1536,1024);
  ctx.strokeStyle=ink;ctx.lineWidth=8;ctx.strokeRect(32,32,1472,960);
  ctx.strokeStyle=gold;ctx.lineWidth=2;ctx.strokeRect(49,49,1438,926);
  const text=(v,x,y,size,color=ink,font="Georgia",weight="normal")=>{ctx.fillStyle=color;ctx.textAlign="center";ctx.font=weight+" "+size+"px "+font;ctx.fillText(v,x,y);};
  ctx.fillStyle=ink;ctx.fillRect(72,72,1392,155);
  // Original stylised open-book emblem, independent of homeschool branding.
  ctx.save();ctx.translate(788,104);ctx.strokeStyle="#d8b57c";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-45,16);ctx.quadraticCurveTo(-23,4,0,18);ctx.quadraticCurveTo(23,4,45,16);ctx.lineTo(45,42);ctx.quadraticCurveTo(23,30,0,44);ctx.quadraticCurveTo(-23,30,-45,42);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.moveTo(0,18);ctx.lineTo(0,44);ctx.stroke();ctx.restore();
  text("WRITERS’ ACADEMY",768,186,37,"#fffdf8","Georgia","bold");
  text("BY SIDE-QUEST LEARNING",768,213,16,"#d8b57c","sans-serif","bold");
  text("Certificate of Completion",790,316,51,ink,"Georgia","bold");
  text("Proudly presented to",790,375,25,ink,"sans-serif");
  ctx.strokeStyle=gold;ctx.beginPath();ctx.moveTo(435,469);ctx.lineTo(1145,469);ctx.stroke();
  text("in recognition of creative participation and completion of",790,542,24,ink,"sans-serif");
  ctx.beginPath();ctx.moveTo(495,656);ctx.lineTo(1085,656);ctx.stroke();
  text("Every great story starts somewhere.",790,742,28,ink,"Georgia");
  // The signature is supplied explicitly by the owner, never generated or inferred.
  const scale=Math.min(240/img.naturalWidth,68/img.naturalHeight);
  const w=img.naturalWidth*scale,h=img.naturalHeight*scale;
  ctx.drawImage(img,1100-w/2,847-h/2,w,h);
  ctx.strokeStyle=gold;ctx.beginPath();ctx.moveTo(500,912);ctx.lineTo(794,912);ctx.moveTo(960,912);ctx.lineTo(1240,912);ctx.stroke();
  text("Completion date",647,940,19,ink,"sans-serif");text("Peta Bozanich · Facilitator",1100,940,19,ink,"sans-serif");
  text("A creative participation acknowledgement, not a formal qualification.",768,970,15,ink,"sans-serif");
  const blob=await new Promise(resolve=>c.toBlob(resolve,"image/jpeg",.9));
  if(!blob||blob.size>1500000)throw Error("The prepared artwork exceeds the upload limit.");
  return new File([blob],"writers-academy-signed-artwork.jpg",{type:"image/jpeg"});
 }finally{URL.revokeObjectURL(url);}
}
export default function AcademyCertificateArtwork({disabled,onPrepared}){
 const [busy,setBusy]=useState(false),[error,setError]=useState("");
 const lock=useRef(false);
 async function choose(e){const signature=e.target.files?.[0];e.target.value="";if(!signature||disabled||lock.current)return;lock.current=true;setBusy(true);setError("");try{onPrepared(await prepareAcademyArtwork(signature));}catch(e){setError(e.message||"Could not prepare artwork.");}finally{lock.current=false;setBusy(false);}}
 return <section className="rounded-xl border p-4 space-y-2 bg-[#f7f2e9] text-[#25334c]"><h5 className="font-bold">Prepare Writers’ Academy signed artwork</h5><p className="text-sm">Create a literary navy, parchment and antique-gold certificate template using your own signature image. The approved PDF workflow fills in each recipient’s name, workshop title and completion date later. This design is shared across programmes.</p><label className="block text-sm font-semibold">Your signature (PNG with transparent background preferred)<input type="file" accept="image/png,image/jpeg" className="block w-full mt-1" disabled={disabled||busy} onChange={choose}/></label>{busy&&<p role="status">Preparing private artwork…</p>}{error&&<p role="alert">{error}</p>}<p className="text-xs">Preparing does not upload or activate anything. Inspect the resulting artwork below and explicitly approve it before saving.</p></section>;
}
