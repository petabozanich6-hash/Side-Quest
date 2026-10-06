import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { Compass } from "lucide-react";
import { Fern, Pet, Branch } from "../components/shared/Botanical";
import GoogleButton from "../components/shared/GoogleButton";

export default function Register() {
  const [form, setForm] = useState({ name: "", family_name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { setSession } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
      setSession(data.token, { ...data.user, role: "parent" });
      toast.success("Family account created"); nav("/parent");
    } catch (err) { toast.error(err.response?.data?.detail || "Registration failed"); }
    finally { setLoading(false); }
  };
  const upd = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-h-screen grid lg:grid-cols-2 relative overflow-hidden">
      <div className="hidden lg:flex flex-col justify-between p-12 relative" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}}>
        <Branch className="absolute -right-20 top-0 rotate-45" size={420} color="#4A5D3A"/>
        <Fern className="absolute left-6 bottom-6" size={200} color="#6B8A5B"/>
        <div className="flex items-center gap-2 relative z-10"><Compass size={28} style={{color:"#D4A574"}}/><span className="font-display text-xl font-bold">Side Quest Learning</span></div>
        <div className="relative z-10">
          <div className="font-script text-3xl mb-2" style={{color:"#D4A574"}}>Welcome, kindred spirit.</div>
          <h2 className="font-display text-4xl font-bold leading-tight">Begin your family's learning journey.</h2>
          <ul className="mt-6 space-y-2.5 text-sm" style={{color:"#E8E2D1"}}>
            <li className="flex gap-2"><span>·</span>Multiple children, Kindergarten through Year 12</li>
            <li className="flex gap-2"><span>·</span>AI lesson generator aligned to NSW stages</li>
            <li className="flex gap-2"><span>·</span>Evidence portfolio with photo, audio, video, PDF</li>
            <li className="flex gap-2"><span>·</span>Printable + offline alternatives for every lesson</li>
            <li className="flex gap-2"><span>·</span>Each child gets a pocket pet that grows with them</li>
          </ul>
          <div className="mt-6 flex gap-3">
            <Pet species="fox" size={64}/><Pet species="owl" size={64}/><Pet species="hedgehog" size={64}/>
          </div>
        </div>
        <p className="text-xs relative z-10" style={{color:"#94A47F"}}>Parents stay in control. Children get a safe, age-appropriate space.</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-md paper-card p-8" data-testid="register-form">
          <h1 className="font-display text-3xl font-bold" style={{color:"#1F3B2D"}}>Create a family account</h1>
          <p className="text-sm text-stone-500 mt-1">You'll be the first parent. Add children once you're inside.</p>

          <div className="mt-6"><GoogleButton label="Continue with Google"/></div>
          <div className="my-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-stone-400"><div className="h-px flex-1" style={{backgroundColor:"#D4C8A8"}}/>or email<div className="h-px flex-1" style={{backgroundColor:"#D4C8A8"}}/></div>

          <div className="space-y-3.5">
            <F label="Your name"><input value={form.name} onChange={upd("name")} required className="input" data-testid="reg-name"/></F>
            <F label="Family name (optional)"><input value={form.family_name} onChange={upd("family_name")} className="input" data-testid="reg-family"/></F>
            <F label="Email"><input value={form.email} onChange={upd("email")} type="email" required className="input" data-testid="reg-email"/></F>
            <F label="Password"><input value={form.password} onChange={upd("password")} type="password" minLength={6} required className="input" data-testid="reg-password"/></F>
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
