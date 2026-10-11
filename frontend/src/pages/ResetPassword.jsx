import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { toast } from "sonner";
import { Compass } from "lucide-react";
import { Flower } from "../components/shared/Botanical";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault(); setError("");
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("The two passwords don't match."); return; }
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, password });
      toast.success("Password changed. Please sign in.");
      nav("/login");
    } catch (err) { setError(err.response?.data?.detail || "Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <Flower className="absolute top-8 right-10" size={34} color="#D4857A"/>
      <div className="w-full max-w-md paper-card p-8" data-testid="reset-card">
        <div className="flex items-center gap-2 mb-5"><Compass size={22} style={{color:"#4A5D3A"}}/><span className="font-display text-base font-bold" style={{color:"#1F3B2D"}}>Side Quest Learning</span></div>
        {!token ? (
          <div data-testid="reset-missing">
            <h1 className="font-display text-3xl font-bold" style={{color:"#1F3B2D"}}>Link not found</h1>
            <p className="text-sm text-stone-600 mt-3 leading-relaxed">This reset link looks incomplete. Please request a new one.</p>
            <Link to="/forgot-password" className="mt-6 inline-block text-xs font-bold hover:underline" style={{color:"#4A5D3A"}}>Request a new link</Link>
          </div>
        ) : (
          <form onSubmit={submit} data-testid="reset-form">
            <h1 className="font-display text-3xl font-bold" style={{color:"#1F3B2D"}}>Choose a new password</h1>
            <p className="text-sm text-stone-500 mt-1">Use at least 8 characters.</p>
            <div className="space-y-4 mt-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-stone-500">New password</label>
                <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required minLength={8} autoComplete="new-password" className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm bg-white focus:border-moss" data-testid="reset-password"/>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Confirm new password</label>
                <input value={confirm} onChange={e=>setConfirm(e.target.value)} type="password" required minLength={8} autoComplete="new-password" className="mt-1 w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm bg-white focus:border-moss" data-testid="reset-confirm"/>
              </div>
            </div>
            {error && (
              <p className="mt-4 text-sm" style={{color:"#B04A3A"}} data-testid="reset-error">{error} {error.includes("expired") && <Link to="/forgot-password" className="font-bold underline">Request a new link</Link>}</p>
            )}
            <button disabled={loading} className="mt-6 w-full rounded-full py-3 text-sm font-bold hover:translate-y-[-1px] transition disabled:opacity-50" style={{backgroundColor:"#1F3B2D", color:"#F5EFE0"}} data-testid="reset-submit">{loading ? "Saving…" : "Change password"}</button>
            <div className="mt-5 text-xs"><Link to="/login" className="font-bold hover:underline" style={{color:"#4A5D3A"}}>Back to sign in</Link></div>
          </form>
        )}
        <p className="mt-6 pt-4 border-t text-center text-[11px] leading-relaxed text-stone-500" style={{borderColor:"#E4DAC0"}}>Side Quest acknowledges the Traditional Custodians of Country throughout Australia and pays respect to Elders past and present.</p>
      </div>
    </div>
  );
}
