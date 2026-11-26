import React from "react";
const field="mt-1 block w-full rounded-xl border border-stone-300 bg-white p-3 text-sm font-normal";
export default function SupportIntakeFields({form,change}){
 return <div className="space-y-4"><section className="space-y-2"><h3 className="font-bold text-emerald-950">1. What would you like help with?</h3><label className="block text-sm font-semibold">What is your learner finding difficult?<textarea required minLength={10} maxLength={1800} rows={4} className={field} value={form.detail||""} onChange={e=>change("detail",e.target.value)} placeholder="For example: understands multiplication but gets stuck on division. Homework feels overwhelming."/></label></section>
 <section className="space-y-3 border-t pt-3"><h3 className="font-bold text-emerald-950">2. Help me get to know how they learn</h3><p className="text-sm text-stone-600">Optional. A few words are enough, and it's fine if you're unsure.</p>
 {[
 ["strengths","What are they already confident with?","Reading aloud, counting, drawing, practical tasks…"],
 ["interests","What do they love or get excited about?","Dinosaurs, Minecraft, animals, space, music, sport…"],
 ["preferences","What helps them learn?","Short instructions, examples, visuals, movement breaks, extra thinking time…"]
 ].map(([key,label,placeholder])=><label key={key} className="block text-sm font-semibold">{label}<textarea rows={2} maxLength={300} className={field} value={form[key]||""} onChange={e=>change(key,e.target.value)} placeholder={placeholder}/></label>)}</section>
 <section className="space-y-3 border-t pt-3"><h3 className="font-bold text-emerald-950">3. What would a good outcome look like?</h3>
 {[["goal","What would you like them to be able to do? (optional)","More confidence, understand a topic, catch up, practise a skill…"],["availability","Preferred times or flexibility (optional)","Daytime, after school or evening; flexible days or specific dates. This is not a booking yet."]].map(([key,label,placeholder])=><label key={key} className="block text-sm font-semibold">{label}<textarea rows={2} maxLength={300} className={field} value={form[key]||""} onChange={e=>change(key,e.target.value)} placeholder={placeholder}/></label>)}</section>
 <p className="text-xs text-stone-600">Please avoid names of children, diagnoses, medical information, school records, addresses and payment information. Describe useful learning adjustments instead. Your enquiry is free and will be personally reviewed before a quote is offered.</p></div>;
}
