// Independently check extracted identifiers against NESA's rendered outcome-card IDs.
// Does not certify stage, applicability or exhaustive syllabus coverage.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
const input=JSON.parse(readFileSync(new URL('../src/data/nesa-review-import.json',import.meta.url),'utf8'));
const pages=new Map();
for(const row of input.candidates){
 const url=row.official_outcomes_url;
 if(new URL(url).origin!=='https://curriculum.nsw.edu.au')throw Error('Unofficial source');
 if(!pages.has(url))pages.set(url,[]);
 pages.get(url).push(row.code);
}
const results=[];let next=0;const entries=[...pages];
await Promise.all(Array.from({length:4},async()=>{
 while(next<entries.length){
  const [url,codes]=entries[next++];
  try{
   const response=await fetch(url,{signal:AbortSignal.timeout(30000)});
   if(!response.ok)throw Error('HTTP '+response.status);
   const body=await response.text();
   const cardIds=new Set([...body.matchAll(/<[^>]+\bid="([^"]+)"[^>]*\bdata-kontent-item-id="[^"]+"[^>]*>/g)].map(x=>x[1]));
   const missing=codes.filter(code=>!cardIds.has(code));
   results.push({url,sha256:createHash('sha256').update(body).digest('hex'),expected_records:codes.length,matched:codes.length-missing.length,missing});
  }catch(e){results.push({url,expected_records:codes.length,matched:0,error:String(e)});}
 }
}));
results.sort((a,b)=>a.url.localeCompare(b.url));
const report={checked_at:new Date().toISOString(),method:'Exact identifier match to rendered NESA outcome-card id and data-kontent-item-id attributes',complete_curriculum:false,source_pages:results.length,records:input.candidates.length,matched:results.reduce((n,r)=>n+r.matched,0),results};
mkdirSync('curriculum-audits',{recursive:true});writeFileSync('curriculum-audits/nesa-card-verification.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({pages:report.source_pages,records:report.records,matched:report.matched}));
if(report.matched!==report.records)process.exitCode=1;
