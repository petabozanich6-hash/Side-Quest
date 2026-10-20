import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderHandwritingPage } from "../src/handwritingBook.ts";

const dest=resolve(process.cwd(),"handwriting-proof");
mkdirSync(dest,{recursive:true});
const snapshots=[0,1,2,3,14,15,40,41,54];
for(const n of snapshots){
 const content=renderHandwritingPage(n);
 if(!content)throw new Error("No SVG for page "+n);
 writeFileSync(resolve(dest,"page-"+(n+1).toString().padStart(2,"0")+".svg"),content,"utf8");
}
const { chromium }=await import(process.env.PW_PATH || "playwright");
const browser=await chromium.launch({headless:true});
try {
 for(const n of snapshots){
  const name="page-"+(n+1).toString().padStart(2,"0");
  const page=await browser.newPage({viewport:{width:794,height:1123},deviceScaleFactor:1});
  await page.goto("file://"+resolve(dest,name+".svg"),{waitUntil:"load"});
  await page.screenshot({path:resolve(dest,name+".png")});
  await page.close();
 }
}finally{await browser.close();}
console.log("Rendered",snapshots.length,"actual A4 pages to handwriting-proof/");
