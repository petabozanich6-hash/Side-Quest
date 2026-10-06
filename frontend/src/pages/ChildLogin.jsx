import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { Compass } from "lucide-react";
import { Fern, Flower, Pet } from "../components/shared/Botanical";

export default function ChildLogin() {
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const { setSession } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const { data } = await api.post("/auth/child-login", { username, pin });
      setSession(data.token, { ...data.student, role: "child" });
      toast.success(`Hi ${data.student.name}!`); nav("/child");
    } catch (err) { toast.error(err.response?.data?.detail || "Can't sign in"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{backgroundColor:"#FEF5E0"}}>
      <Fern className="absolute -left-10 top-10" size={200} color="#6B8A5B"/>
      <Fern className="absolute -right-10 bottom-10 rotate-180" size={200} color="#6B8A5B"/>
      <Flower className="absolute top-20 right-24" size={32} color="#D4857A"/>
      <Flower className="absolute bottom-32 left-24" size={28} color="#C77B5B"/>

      <form onSubmit={submit} className="w-full max-w-md paper-card p-10 relative z-10" data-testid="child-login-form">
        <div className="flex justify-center mb-2"><Pet species="fox" size={100}/></div>
        <h1 className="font-display text-4xl font-bold text-center" style={{color:"#1F3B2D"}}>Hello, learner</h1>
        <p className="text-center text-sm text-stone-500 mt-1 font-script text-xl" style={{color:"#C77B5B"}}>let's see what we discover today</p>
        <div className="mt-7 space-y-4">
          <div>
            <label className="text-sm font-bold" style={{color:"#1F3B2D"}}>My username</label>
            <input value={username} onChange={e=>setUsername(e.target.value)} required autoFocus className="mt-1 w-full rounded-2xl border-2 px-4 py-3 text-lg bg-white" style={{borderColor:"#D4C8A8"}} data-testid="child-login-username"/>
          </div>
          <div>
            <label className="text-sm font-bold" style={{color:"#1F3B2D"}}>My PIN</label>
            <input value={pin} onChange={e=>setPin(e.target.value)} type="password" required className="mt-1 w-full rounded-2xl border-2 px-4 py-3 text-xl tracking-widest text-center bg-white" style={{borderColor:"#D4C8A8"}} data-testid="child-login-pin"/>
          </div>
        </div>
        <button disabled={loading} className="mt-7 w-full rounded-full py-3.5 text-base font-bold hover:translate-y-[-1px] transition disabled:opacity-50" style={{backgroundColor:"#C77B5B", color:"#FBF7EC"}} data-testid="child-login-submit">{loading ? "Opening the door…" : "Let's go"}</button>
        <p className="mt-6 text-center text-xs text-stone-500">Are you a parent? <Link to="/login" className="font-bold" style={{color:"#4A5D3A"}}>Sign in here</Link></p>
      </form>
    </div>
  );
}
