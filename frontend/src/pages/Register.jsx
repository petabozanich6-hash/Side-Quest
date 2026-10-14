import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { Compass } from "lucide-react";
import { Fern, Pet, Branch } from "../components/shared/Botanical";
import { AUSTRALIAN_JURISDICTIONS } from "../data/australianCurriculum";

const LABELS = ["Mum", "Dad", "Aunty", "Uncle", "Nan", "Pop", "Grandma", "Grandpa"];

export default function Register() {
  const [form, setForm] = useState({ name: "", family_name: "", email: "", password: "", jurisdiction: "" });
  const [pick, setPick] = useState("");
  const [other, setOther] = useState("");
  const [loading, setLoading] = useState(false);
  const { setSession } = useAuth();
  const nav = useNavigate();

  const label = (pick === "__other" ? other : pick).trim();

  const submit = async (e) => {
    e.preventDefault();
    if (!label) { toast.error("Please tell us what your children call you"); return; }
    if (!form.jurisdiction) { toast.error("Please choose your state or territory"); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
      setSession(data.token, { ...data.user, role: "parent" });
      try {
        await api.put("/me/child-label", { label }, { headers: { Authorization: `Bearer ${data.token}` } });
      } catch { /* sign-up still succeeds; the sidebar box lets them set it later */ }
      toast.success("Family account created", {
        description: "We've sent you a welcome email. If you can't see it, check your spam folder and mark it 'Not spam' so help alerts from your children reach you.",
        duration: 12000,
      });
      nav("/parent");
    } catch (err) { toast.error(err.response?.data?.detail || "Registration failed"); }
    finally { setLoading(false); }
  };
  const upd = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-h-screen grid lg:grid-cols-2 relative overflow-hidden">
      <div className="hidden lg:flex flex-col justify-between p-12 relative" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}}>
        <Branch className="absolute -right-20 top-0 rotate-45" size={420} color="#4A5D3A"/>
        <Fern className="absolute left-6 bottom-6" size={200} color="#6B8A5B"/>
        <div className="flex items-center gap-2 relative z-10"><Compass size={28} style={{color:"#D4A574"}}/><span className="font-display text-xl font-bold">Side-Quest Learning</span></div>
        <div className="relative z-10">
          <div className="font-script text-3xl mb-2" style={{color:"#D4A574"}}>Welcome to the family.</div>
          <h2 className="font-display text-4xl font-bold leading-tight">A little more joy, a little less juggling.</h2>
          <ul className="mt-6 space-y-2.5 text-sm" style={{color:"#E8E2D1"}}>
            <li className="flex gap-2"><span>·</span>Build your own lessons, or let AI draft them for your review</li>
            <li className="flex gap-2"><span>·</span>Made for Australian families, with curriculum guidance for all eight jurisdictions</li>
            <li className="flex gap-2"><span>·</span>Keep approved learning records together in the Evidence Backpack</li>
            <li className="flex gap-2"><span>·</span>Offline activities and answer keys, just for you</li>
            <li className="flex gap-2"><span>·</span>Each child gets a pocket pet that grows with them</li>
          </ul>
          <div className="mt-6 flex gap-3">
            <Pet species="fox" size={64}/><Pet species="owl" size={64}/><Pet species="turtle" size={64}/>
          </div>
        </div>
        <p className="text-xs relative z-10" style={{color:"#94A47F"}}>Parents stay in control. Children get a safe, age-appropriate space.</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-md paper-card p-8" data-testid="register-form">
          <h1 className="font-display text-3xl font-bold" style={{color:"#1F3B2D"}}>Create a family account</h1>
          <p className="text-sm text-stone-500 mt-1">We’re glad you’re here! Your seven-day free preview needs no card. Add your children once you’re inside.</p>

          <div className="my-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-stone-400"><div className="h-px flex-1" style={{backgroundColor:"#D4C8A8"}}/>email<div className="h-px flex-1" style={{backgroundColor:"#D4C8A8"}}/></div>

          <div className="space-y-3.5">
            <F label="Your name"><input value={form.name} onChange={upd("name")} required className="input" data-testid="reg-name"/></F>
            <F label="What do your children call you?">
              <select value={pick} onChange={e => setPick(e.target.value)} required className="input" data-testid="reg-label">
                <option value="">Choose...</option>
                {LABELS.map(l => <option key={l} value={l}>{l}</option>)}
                <option value="__other">Something else...</option>
              </select>
              {pick === "__other" && <input value={other} onChange={e => setOther(e.target.value)} maxLength={30} required placeholder="e.g. Mama" className="input mt-2" data-testid="reg-label-other"/>}
              <p className="text-[11px] text-stone-500 mt-1">Your child's pet will say "{label || "Mum"} sent you a message" instead of using your name.</p>
            </F>
            <F label="Your state or territory">
              <select value={form.jurisdiction} onChange={upd("jurisdiction")} required className="input" data-testid="reg-jurisdiction">
                <option value="">Choose...</option>
                {AUSTRALIAN_JURISDICTIONS.map(j => <option key={j.code} value={j.code}>{j.name}</option>)}
              </select>
              <p className="text-[11px] text-stone-500 mt-1">Life Learning links activities to your state or territory's curriculum. You can change this later.</p>
            </F>
            <F label="Family name (optional)"><input value={form.family_name} onChange={upd("family_name")} className="input" data-testid="reg-family"/></F>
            <F label="Email"><input value={form.email} onChange={upd("email")} type="email" required className="input" data-testid="reg-email"/></F>
            <F label="Password"><input value={form.password} onChange={upd("password")} type="password" minLength={6} required className="input" data-testid="reg-password"/></F>
          </div>
          <div className="mt-4 rounded-xl p-3 text-xs leading-relaxed" style={{backgroundColor:"#F5EFE0", borderLeft:"4px solid #D4A574", color:"#1F3B2D"}} data-testid="reg-spam-note">
            <strong>Heads up:</strong> your welcome note and account emails come from a <span className="font-mono">@sidequestlearning.app</span> address. You can reply for help at <span className="font-mono">support@sidequestlearning.app</span>. If you don't see an email, check your spam folder and mark it "Not spam" so important account messages can reach you.
          </div>
          <button disabled={loading} className="mt-6 w-full rounded-full py-3 text-sm font-bold hover:translate-y-[-1px] transition disabled:opacity-50" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="reg-submit">{loading ? "Creating…" : "Create account"}</button>
          <p className="mt-5 text-center text-xs text-stone-500">Already have an account? <Link to="/login" className="font-bold" style={{color:"#4A5D3A"}} data-testid="reg-to-login">Sign in</Link></p>
        </form>
      </div>
      <style>{`.input { width: 100%; border-radius: 0.75rem; border: 1px solid #D4C8A8; padding: 0.6rem 0.85rem; font-size: 0.875rem; background: #fff; } .input:focus { outline: none; border-color: #4A5D3A; }`}</style>
    </div>
  );
}
const F = ({ label, children }) => (<div><label className="text-xs font-bold uppercase tracking-widest text-stone-500">{label}</label><div className="mt-1">{children}</div></div>);
