import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { Compass } from "lucide-react";

export default function ChildLogin() {
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const { setSession } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/child-login", { username, pin });
      setSession(data.token, { ...data.student, role: "child" });
      toast.success(`Hi ${data.student.name}!`);
      nav("/child");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Can't sign in");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-amber-200 bg-white p-10 shadow-lg" data-testid="child-login-form">
        <div className="flex items-center justify-center mb-6">
          <Compass size={36} className="text-amber-600" />
        </div>
        <h1 className="font-display text-3xl font-bold text-center text-slate-900">Student sign in</h1>
        <p className="text-center text-sm text-slate-500 mt-1">Enter your username and PIN</p>
        <div className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700">My username</label>
            <input value={username} onChange={e=>setUsername(e.target.value)} required autoFocus className="mt-1 w-full rounded-xl border-2 border-amber-200 px-4 py-3 text-lg focus:border-amber-500 focus:ring-0" data-testid="child-login-username" />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">My PIN</label>
            <input value={pin} onChange={e=>setPin(e.target.value)} type="password" required className="mt-1 w-full rounded-xl border-2 border-amber-200 px-4 py-3 text-lg tracking-widest text-center focus:border-amber-500 focus:ring-0" data-testid="child-login-pin" />
          </div>
        </div>
        <button disabled={loading} className="mt-8 w-full rounded-full bg-amber-500 py-3 text-base font-bold text-white hover:bg-amber-600 disabled:opacity-50" data-testid="child-login-submit">{loading ? "Signing in…" : "Let's go"}</button>
        <p className="mt-6 text-center text-xs text-slate-500">Are you a parent? <Link to="/login" className="font-semibold text-teal-700">Sign in here</Link></p>
      </form>
    </div>
  );
}
