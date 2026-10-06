import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { Compass } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({ name: "", family_name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { setSession } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
      setSession(data.token, { ...data.user, role: "parent" });
      toast.success("Family account created");
      nav("/parent");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Registration failed");
    } finally { setLoading(false); }
  };

  const upd = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex bg-[#0E2A47] text-white p-12 flex-col justify-between">
        <div className="flex items-center gap-2"><Compass size={28} className="text-teal-300" /><span className="font-display text-xl font-bold">Side Quest Learning</span></div>
        <div>
          <h2 className="font-display text-4xl font-bold leading-tight">Start your family's<br/>learning journey.</h2>
          <ul className="mt-6 space-y-2 text-slate-300 text-sm">
            <li>· Multiple children across Early Stage 1 to Stage 6</li>
            <li>· AI lesson generator aligned to NSW stages</li>
            <li>· Evidence portfolio with photo, audio, video, PDF</li>
            <li>· Printable and offline alternatives for every lesson</li>
          </ul>
        </div>
        <p className="text-xs text-slate-400">Parents stay in control. Children get a safe, age-appropriate space.</p>
      </div>
      <div className="flex items-center justify-center p-6 bg-[#FAF9F5]">
        <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm" data-testid="register-form">
          <h1 className="font-display text-2xl font-bold text-slate-900">Create a family account</h1>
          <p className="text-sm text-slate-500 mt-1">You'll be the first parent. Add children once you're inside.</p>
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Your name</label>
              <input value={form.name} onChange={upd("name")} required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" data-testid="reg-name" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Family name (optional)</label>
              <input value={form.family_name} onChange={upd("family_name")} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" data-testid="reg-family" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email</label>
              <input value={form.email} onChange={upd("email")} type="email" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" data-testid="reg-email" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Password</label>
              <input value={form.password} onChange={upd("password")} type="password" minLength={6} required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" data-testid="reg-password" />
            </div>
          </div>
          <button disabled={loading} className="mt-6 w-full rounded-full bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50" data-testid="reg-submit">{loading ? "Creating…" : "Create account"}</button>
          <p className="mt-4 text-center text-xs text-slate-500">Already have an account? <Link to="/login" className="font-semibold text-teal-700" data-testid="reg-to-login">Sign in</Link></p>
        </form>
      </div>
    </div>
  );
}
