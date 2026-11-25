import React from "react";
import {SUPPORT_RATES,PRICING_RULES,aud} from "../../../lib/supportPricing";
export default function HqSupportPriceGuide({compact=false}){
 return <details className="border border-emerald-200 rounded-xl bg-emerald-50 p-3 space-y-3" open={!compact}><summary className="font-bold cursor-pointer text-emerald-950">Service menu &amp; pricing reference (AUD)</summary>
 <p className="text-sm">Use these approved starting prices when preparing proposals and Square invoices. Your quote builder has the same rates.</p>
 <div className="grid gap-2 sm:grid-cols-2">{SUPPORT_RATES.map(r=><article key={r.id} className="bg-white border rounded-lg p-3"><div className="flex flex-wrap justify-between gap-2"><strong className="text-sm">{r.label}</strong><strong className="text-emerald-950">{r.from?"From ":""}{aud(r.cents)}</strong></div><p className="text-xs mt-2">{r.includes}</p></article>)}</div>
 <ul className="list-disc pl-5 space-y-1 text-xs">{PRICING_RULES.map(r=><li key={r}>{r}</li>)}</ul>
 </details>;
}
