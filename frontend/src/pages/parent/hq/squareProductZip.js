// A dependency-free ZIP packager for a Square-ready download containing
// the same product's print and interactive PDF editions.
// Uses ZIP "stored" entries: PDFs are already compressed internally.
const utf8=new TextEncoder();
const u16=(view,pos,v)=>view.setUint16(pos,v,true);
const u32=(view,pos,v)=>view.setUint32(pos,v>>>0,true);
export const crc32=(bytes)=>{
 let crc=0xffffffff;
 for(const n of bytes){
  crc^=n;
  for(let i=0;i<8;i++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);
 }
 return (crc^0xffffffff)>>>0;
};
const dataBytes=(uri)=>{
 const encoded=String(uri||"").split(",")[1];
 if(!encoded)throw Error("PDF export is missing.");
 const raw=atob(encoded),bytes=new Uint8Array(raw.length);
 for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
 return bytes;
};
export function squareProductZip(files){
 if(!Array.isArray(files)||!files.length||files.length>10)throw Error("Choose files to package.");
 const chunks=[],central=[];let offset=0,centralSize=0;
 for(const file of files){
  const name=String(file.name||"").replace(/[^\w .-]/g,"").slice(0,90);
  if(!name||name.includes("..")||name.startsWith("."))throw Error("Invalid file name.");
  const filename=utf8.encode(name),bytes=file.bytes,checksum=crc32(bytes);
  const header=new Uint8Array(30+filename.length),h=new DataView(header.buffer);
  u32(h,0,0x04034b50);u16(h,4,20);u16(h,6,0);u16(h,8,0);
  u32(h,14,checksum);u32(h,18,bytes.length);u32(h,22,bytes.length);u16(h,26,filename.length);
  header.set(filename,30);chunks.push(header,bytes);
  const center=new Uint8Array(46+filename.length),v=new DataView(center.buffer);
  u32(v,0,0x02014b50);u16(v,4,20);u16(v,6,20);
  u32(v,16,checksum);u32(v,20,bytes.length);u32(v,24,bytes.length);
  u16(v,28,filename.length);u32(v,42,offset);center.set(filename,46);
  central.push(center);centralSize+=center.length;offset+=header.length+bytes.length;
 }
 const ending=new Uint8Array(22),end=new DataView(ending.buffer);
 u32(end,0,0x06054b50);u16(end,8,files.length);u16(end,10,files.length);
 u32(end,12,centralSize);u32(end,16,offset);
 return new Blob([...chunks,...central,ending],{type:"application/zip"});
}
export function makeSquareProductZip(doc,proof){
 const slug=String(doc.title||"sidequest-product").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,55);
 const files=[
  {name:slug+"-print.pdf",bytes:dataBytes(proof.print.data_url)},
  {name:slug+"-fillable.pdf",bytes:dataBytes(proof.fillable.data_url)},
 ];
 return squareProductZip(files);
}
export function downloadSquareProductZip(doc,proof){
 const blob=makeSquareProductZip(doc,proof);
 const url=URL.createObjectURL(blob);
 const a=window.document.createElement("a");
 a.href=url;a.download=String(doc.title||"sidequest-product").toLowerCase().replace(/[^a-z0-9]+/g,"-")+"-square-product.zip";
 window.document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1500);
}
