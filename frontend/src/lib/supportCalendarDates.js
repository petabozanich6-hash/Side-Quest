const zone="Australia/Sydney";
const partsFmt=new Intl.DateTimeFormat("en-CA",{timeZone:zone,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"});
const parts=t=>Object.fromEntries(partsFmt.formatToParts(new Date(t)).map(p=>[p.type,p.value]));
export const key=t=>{const p=parts(t);return p.year+"-"+p.month+"-"+p.day;};
export const shift=(s,n)=>new Date(Date.parse(s+"T12:00:00Z")+n*86400000).toISOString().slice(0,10);
export const monthShift=(s,n)=>new Date(Date.UTC(+s.slice(0,4),+s.slice(5,7)-1+n,1,12)).toISOString().slice(0,7);
export const monthTitle=new Intl.DateTimeFormat("en-AU",{timeZone:"UTC",month:"long",year:"numeric"});
export const time=new Intl.DateTimeFormat("en-AU",{timeZone:zone,hour:"numeric",minute:"2-digit"});
export function syd(s,clock="00:00"){
 const nominal=Date.parse(s+"T"+clock+":00Z");
 const matches=[10,11].map(h=>nominal-h*3600000).filter(t=>{const p=parts(t);return key(t)===s&&p.hour+":"+p.minute===clock;});
 if(matches.length!==1)throw Error("Choose a valid, unambiguous Sydney time.");
 return new Date(matches[0]);
}
export function gridDates(month){
 const first=month+"-01",dow=(new Date(first+"T12:00:00Z").getUTCDay()+6)%7;
 const last=shift(monthShift(month,1)+"-01",-1);
 const n=Math.ceil((dow+Number(last.slice(-2)))/7)*7;
 return Array.from({length:n},(_,i)=>shift(first,i-dow));
}
const reserved=o=>[Date.parse(o.start_at)-(o.kind==="appointment"?(o.prep_minutes||0)*60000:0),Date.parse(o.end_at)+(o.kind==="appointment"?(o.wrap_minutes||0)*60000:0)];
export const intersects=(o,s)=>{const [a,b]=reserved(o);return a<syd(shift(s,1)).getTime()&&b>syd(s).getTime();};
