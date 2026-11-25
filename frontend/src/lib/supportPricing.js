// Single reference for advertised rates and Owner HQ quote presets. AUD cents.
// Custom work remains individually quoted; no automatic charges or discounts.
export const SUPPORT_RATES=Object.freeze([
 {id:"live30",label:"30-minute online session",cents:2500,minutes:30,from:false,includes:"One learner, one agreed focus, tailored preparation, 30 minutes of guided support and a brief parent update with a suggested next step."},
 {id:"live45",label:"45-minute online session",cents:3500,minutes:45,from:false,includes:"One learner, an agreed focus with extra guided practice, tailored preparation, 45 minutes of support and a brief parent update with a suggested next step."},
 {id:"live60",label:"60-minute online session",cents:4500,minutes:60,from:false,includes:"One learner, an agreed topic or related skills, tailored preparation, 60 minutes of support and a brief parent update with a suggested next step."},
 {id:"plan",label:"Personalised learning plan",cents:3000,minutes:null,from:true,includes:"A basic written plan for one agreed learning goal or topic: objectives, suggested activities, resources and next steps. Longer or multi-subject plans quoted separately."},
 {id:"written",label:"Written learning support",cents:1500,minutes:null,from:true,includes:"A focused written explanation, worked example or brief feedback on one agreed question or concept. Larger requests quoted separately."}
]);
export const rateById=id=>SUPPORT_RATES.find(r=>r.id===id);
export const liveRates=SUPPORT_RATES.filter(r=>r.minutes!==null);
export const aud=cents=>new Intl.NumberFormat("en-AU",{style:"currency",currency:"AUD",maximumFractionDigits:2}).format(cents/100);
export function packageRate(lessons){
 if(!Array.isArray(lessons)||lessons.length<1||lessons.length>4)return null;
 const rates=lessons.map(l=>liveRates.find(r=>r.minutes===l.minutes));
 return rates.some(r=>!r)?null:rates.reduce((sum,r)=>sum+r.cents,0);
}
export const PRICING_RULES=[
 "Initial written enquiry and suitability review: free, no booking or obligation.",
 "Evening sessions use the same rates. Preparation, ordinary session materials and a brief follow-up are included; do not charge those again.",
 "A separately commissioned written plan or additional written work is quoted only if requested and agreed. Extended reports, additional learners or substantial bespoke resources require a separate agreed scope.",
 "For packages, add the individual session prices; no automatic discount. Offer per-session payments where suitable. Check each lesson duration and quote the total before sending.",
 "The standard session covers one learner; ongoing messaging, unlimited revisions and extensive assessment are not included.",
 "Custom prices and discounts must be deliberately reviewed. Do not change an existing accepted quote or invoice."
];
