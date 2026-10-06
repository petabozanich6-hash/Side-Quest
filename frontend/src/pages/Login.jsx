import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { Compass } from "lucide-react";
import { Fern, Flower, Pet } from "../components/shared/Botanical";
import GoogleButton from "../components/shared/GoogleButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setSession } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setSession(data.token, { ...data.user, role: "parent" });
      toast.success("Welcome back"); nav("/parent");
    } catch (err) { toast.error(err.response?.data?.detail || "Login failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 relative overflow-hidden">
      <div className="hidden lg:flex flex-col justify-between p-12 relative" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}}>
        <Fern className="absolute -right-10 top-20" size={300} color="#6B8A5B"/>
        <Fern className="absolute -left-10 bottom-10 rotate-180" size={240} color="#4A5D3A"/>
        <div className="flex items-center gap-2 relative z-10"><Compass size={28} style={{color:"#D4A574"}}/><span className="font-display text-xl font-bold">Side Quest Learning</span></div>
        <div className="relative z-10">
          <div className="font-script text-3xl mb-2" style={{color:"#D4A574"}}>Welcome home.</div>
          <h2 className="font-display text-5xl font-bold leading-tight">The learning is where you left it.</h2>
          <p className="mt-5 text-base max-w-md" style={{color:"#E8E2D1"}}>Review submitted work, approve resources, and plan tomorrow's lessons.</p>
          <div className="mt-8 paper-card p-3 inline-flex items-center gap-2" style={{backgroundColor:"#F5EFE0"}}>
            <Pet species="turtle" size={50}/>
            <div className="pr-2">
              <div className="font-script text-base" style={{color:"#4A5D3A"}}>Mossy</div>
              <div className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">Companion · 86 XP</div>
            </div>
          </div>
        </div>
        <p className="text-xs relative z-10" style={{color:"#94A47F"}}>Parent sign in · Children sign in separately with a username and PIN.</p>
      </div>
      <div className="flex items-center justify-center p-6 relative">
        <Flower className="absolute top-8 right-10" size={34} color="#D4857A"/>
        <form onSubmit={submit} className="w-full max-w-md paper-card p-8" data-testid="login-form">
          <h1 className="font-display text-3xl font-bold" style={{color:"#1F3B2D"}}>Parent sign in</h1>
          <p className="text-sm text-stone-500 mt-1">Children sign in separately with username + PIN.</p>

          <div className="mt-6"><GoogleButton/></div>
          <div className="my-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-stone-400"><div className="h-px flex-1" style={{backgroundColor:"#D4C8A8"}}/>or email<div className="h-px flex-1" style={{backgroundColor:"#D4C8A8"}}/></div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Email</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm bg-white focus:border-moss" data-testid="login-email"/>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Password</label>
              <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm bg-white focus:border-moss" data-testid="login-password"/>
            </div>
          </div>
          <button disabled={loading} className="mt-6 w-full rounded-full py-3 text-sm font-bold hover:translate-y-[-1px] transition disabled:opacity-50" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="login-submit">{loading ? "Signing in…" : "Sign in"}</button>
          <div className="mt-5 flex items-center justify-between text-xs">
            <Link to="/register" className="font-bold hover:underline" style={{color:"#4A5D3A"}} data-testid="login-to-register">Create account</Link>
            <Link to="/child-login" className="font-bold hover:underline" style={{color:"#4A5D3A"}} data-testid="login-to-child">Student sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
