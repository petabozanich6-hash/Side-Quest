import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { Compass } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setSession } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setSession(data.token, { ...data.user, role: "parent" });
      toast.success("Welcome back");
      nav("/parent");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex bg-[#0E2A47] text-white p-12 flex-col justify-between">
        <div className="flex items-center gap-2"><Compass size={28} className="text-teal-300" /><span className="font-display text-xl font-bold">Side Quest Learning</span></div>
        <div>
          <h2 className="font-display text-4xl font-bold leading-tight">Welcome back.<br/>The learning is where you left it.</h2>
          <p className="mt-4 text-slate-300 max-w-md">Review submitted work, approve resources, and plan tomorrow's lessons.</p>
        </div>
        <p className="text-xs text-slate-400">Parent sign in · NSW K-12 homeschool platform</p>
      </div>
      <div className="flex items-center justify-center p-6 bg-[#FAF9F5]">
        <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm" data-testid="login-form">
          <h1 className="font-display text-2xl font-bold text-slate-900">Parent sign in</h1>
          <p className="text-sm text-slate-500 mt-1">Children have a separate sign-in with username and PIN.</p>
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-teal-600 focus:ring-0" data-testid="login-email" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Password</label>
              <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-teal-600 focus:ring-0" data-testid="login-password" />
            </div>
          </div>
          <button disabled={loading} className="mt-6 w-full rounded-full bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50" data-testid="login-submit">{loading ? "Signing in…" : "Sign in"}</button>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <Link to="/register" className="hover:text-teal-700 font-semibold" data-testid="login-to-register">Create account</Link>
            <Link to="/child-login" className="hover:text-teal-700 font-semibold" data-testid="login-to-child">Child sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
