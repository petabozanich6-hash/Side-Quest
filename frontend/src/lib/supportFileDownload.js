export function saveSupportFile(r){
 const d=r.data??r;if(!["application/pdf","image/png","image/jpeg"].includes(d.mime))throw Error("Unexpected file type");
 const bytes=Uint8Array.from(atob(d.base64),c=>c.charCodeAt(0)),url=URL.createObjectURL(new Blob([bytes],{type:d.mime}));
 const a=document.createElement("a");a.href=url;a.download=d.filename;a.rel="noopener";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export async function encodeSupportFile(file){
 if(file.size>5*1024*1024)throw Error("Maximum file size is 5 MB.");
 const bytes=new Uint8Array(await file.arrayBuffer());let raw="";for(let i=0;i<bytes.length;i+=8192)raw+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(raw);
}
