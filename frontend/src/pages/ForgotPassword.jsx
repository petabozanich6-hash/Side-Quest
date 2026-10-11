import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { toast } from "sonner";
import { Compass, Mail } from "lucide-react";
import { Flower } from "../components/shared/Botanical";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) { toast.error(err.response?.data?.detail || "Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <Flower className="absolute top-8 right-10" size={34} color="#D4857A"/>
      <div className="w-full max-w-md paper-card p-8" data-testid="forgot-card">
        <div className="flex items-center gap-2 mb-5"><Compass size={22} style={{color:"#4A5D3A"}}/><span className="font-display text-base font-bold" style={{color:"#1F3B2D"}}>Side Quest Learning</span></div>
        {sent ? (
          <div data-testid="forgot-sent">
            <div className="flex items-center gap-2"><Mail size={22} style={{color:"#4A5D3A"}}/><h1 className="font-display text-3xl font-bold" style={{color:"#1F3B2D"}}>Check your email</h1></div>
            <p className="text-sm text-stone-600 mt-3 leading-relaxed">If an account exists for <strong>{email}</strong>, we've sent a link to choose a new password. It works once and expires in 1 hour.</p>
            <p className="text-sm text-stone-500 mt-3 leading-relaxed">It can take a few minutes to arrive. Check your spam folder too.</p>
            <Link to="/login" className="mt-6 inline-block text-xs font-bold hover:underline" style={{color:"#4A5D3A"}}>Back to sign in</Link>
          </div>
        ) : (
          <form onSubmit={submit} data-testid="forgot-form">
            <h1 className="font-display text-3xl font-bold" style={{color:"#1F3B2D"}}>Forgot your password?</h1>
            <p className="text-sm text-stone-500 mt-1">Enter the email you signed up with and we'll send you a link to choose a new one.</p>
            <div className="mt-5">
              <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Email</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required autoFocus className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm bg-white focus:border-moss" data-testid="forgot-email"/>
            </div>
            <button disabled={loading} className="mt-6 w-full rounded-full py-3 text-sm font-bold hover:translate-y-[-1px] transition disabled:opacity-50" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="forgot-submit">{loading ? "Sending…" : "Send reset link"}</button>
            <div className="mt-5 text-xs"><Link to="/login" className="font-bold hover:underline" style={{color:"#4A5D3A"}}>Back to sign in</Link></div>
          </form>
        )}
        <p className="mt-6 pt-4 border-t text-center text-[11px] leading-relaxed text-stone-500" style={{borderColor:"#E4DAC0"}}>Side Quest acknowledges the Traditional Custodians of Country throughout Australia and pays respect to Elders past and present.</p>
      </div>
    </div>
  );
}
