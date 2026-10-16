import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { isKidsDevice, isKidsHost, parentOrigin, useKidsManifest } from "../lib/pwa";
import { clearOffline, isNetworkError } from "../lib/offline";
import { forgetOfflineChild, forgetOfflineProfiles, offlineProfileCount, offlineSignIn, rememberChildForOffline } from "../lib/offlineSignIn";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { Compass } from "lucide-react";
import { Fern, Flower, Pet } from "../components/shared/Botanical";

const LAST_USER_KEY = "sq_child_username";

export default function ChildLogin() {
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpUser, setHelpUser] = useState("");
  const [helpState, setHelpState] = useState("idle");
  const { setSession, user } = useAuth();
  const [saved, setSaved] = useState(offlineProfileCount);
  const nav = useNavigate();
  // Installing from this page (browser menu, Add to Home Screen) gives the kids' app, which opens here.
  useKidsManifest(true);

  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const { data } = await api.post("/auth/child-login", { username, pin });
      try { localStorage.setItem(LAST_USER_KEY, username.trim().toLowerCase()); } catch { /* ignore */ }
      // On a child's own device, remember them so they can sign in with no signal next time.
      // Offline sign-in is a Family Membership feature.
      if (isKidsDevice() && data.offline_allowed) await rememberChildForOffline(username, pin, data.token, { ...data.student, username: username.trim().toLowerCase() });
      else forgetOfflineChild(username);
      setSession(data.token, { ...data.student, username: username.trim().toLowerCase(), role: "child" });
      toast.success(`Hi ${data.student.name}!`); nav("/child");
    } catch (err) {
      // No signal on a kids' device: check the PIN against the sign-in saved on this device.
      if (isNetworkError(err) && isKidsDevice()) {
        const r = await offlineSignIn(username, pin);
        if (r.token) {
          setSession(r.token, { ...r.user, username: username.trim().toLowerCase(), offline: true });
          toast.success(`Hi ${r.user.name}! You're offline, so your saved quests are ready.`);
          nav("/child");
        } else toast.error(r.error);
        return;
      }
      toast.error(err.response?.data?.detail || (isNetworkError(err) ? "You're offline. Connect to the internet to sign in." : "Can't sign in"));
    }
    finally { setLoading(false); }
  };

  const openHelp = () => {
    let saved = "";
    try { saved = localStorage.getItem(LAST_USER_KEY) || ""; } catch { /* ignore */ }
    setHelpUser(username || saved);
    setHelpState("idle");
    setHelpOpen(true);
  };

  const sendHelp = async (e) => {
    e.preventDefault();
    if (!helpUser.trim()) return;
    setHelpState("sending");
    try {
      await api.post("/auth/child-help", { username: helpUser });
      setHelpState("sent");
    } catch (err) {
      toast.error(err.response?.data?.detail || "That didn't send. Try again?");
      setHelpState("idle");
    }
  };

  const forgetDevice = async () => {
    if (!window.confirm("Forget every child saved on this device? Their saved quests and any work not yet sent will be deleted from this device. Children can sign in again with internet.")) return;
    forgetOfflineProfiles();
    await clearOffline();
    setSaved(0);
    toast.success("This device no longer remembers any children.");
  };

  if (user?.role === "child") return <Navigate to="/child" replace />;
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{backgroundColor:"#FEF5E0"}}>
      <Fern className="absolute -left-10 top-10" size={200} color="#6B8A5B"/>
      <Fern className="absolute -right-10 bottom-10 rotate-180" size={200} color="#6B8A5B"/>
      <Flower className="absolute top-20 right-24" size={32} color="#D4857A"/>
      <Flower className="absolute bottom-32 left-24" size={28} color="#C77B5B"/>

      {helpOpen ? (
        <form onSubmit={sendHelp} className="w-full max-w-md paper-card p-10 relative z-10" data-testid="child-help-form">
          <div className="flex justify-center mb-2"><Pet species="fox" size={100}/></div>
          {helpState === "sent" ? (
            <div className="text-center" data-testid="child-help-sent">
              <h1 className="font-display text-3xl font-bold" style={{color:"#1F3B2D"}}>Message sent!</h1>
              <p className="mt-3 text-base" style={{color:"#1F3B2D"}}>Your grown-up knows you need a hand. Hang tight, adventurer. The key will be found soon.</p>
              <button type="button" onClick={() => setHelpOpen(false)} className="mt-7 w-full rounded-full py-3.5 text-base font-bold" style={{backgroundColor:"#C77B5B", color:"#FBF7EC"}} data-testid="child-help-back">Back to the door</button>
            </div>
          ) : (
            <>
              <h1 className="font-display text-3xl font-bold text-center" style={{color:"#1F3B2D"}}>Lost your key?</h1>
              <p className="text-center text-sm mt-2" style={{color:"#1F3B2D"}}>No worries, adventurer! Tell us your username and we'll send a message to your grown-up so they can help you back in.</p>
              <div className="mt-6">
                <label className="text-sm font-bold" style={{color:"#1F3B2D"}}>My username</label>
                <input value={helpUser} onChange={e=>setHelpUser(e.target.value)} required autoFocus className="mt-1 w-full rounded-2xl border-2 px-4 py-3 text-lg bg-white" style={{borderColor:"#D4C8A8"}} data-testid="child-help-username"/>
              </div>
              <p className="mt-3 text-xs text-stone-500">Can't remember your username either? Just tell your grown-up. They can find it on their Children page.</p>
              <button disabled={helpState === "sending"} className="mt-6 w-full rounded-full py-3.5 text-base font-bold hover:translate-y-[-1px] transition disabled:opacity-50" style={{backgroundColor:"#C77B5B", color:"#FBF7EC"}} data-testid="child-help-submit">{helpState === "sending" ? "Sending a message…" : "Ask my grown-up for help"}</button>
              <button type="button" onClick={() => setHelpOpen(false)} className="mt-4 w-full text-center text-sm font-bold" style={{color:"#4A5D3A"}} data-testid="child-help-cancel">Back to the door</button>
            </>
          )}
        </form>
      ) : (
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
        <button type="button" onClick={openHelp} className="mt-4 w-full flex items-center justify-center gap-1.5 text-sm font-bold" style={{color:"#4A5D3A"}} data-testid="child-forgot"><Compass size={15}/> Forgot my PIN?</button>
        <p className="mt-6 text-center text-xs text-stone-500">Are you a parent? {isKidsHost()
          ? <a href={`${parentOrigin()}/login`} className="font-bold" style={{color:"#4A5D3A"}}>Open Side-Quest for grown-ups</a>
          : <Link to="/login" className="font-bold" style={{color:"#4A5D3A"}}>Sign in here</Link>}</p>
        {isKidsDevice() && saved > 0 && (
          <p className="mt-2 text-center text-xs text-stone-500">
            {saved === 1 ? "1 child is" : `${saved} children are`} saved on this device for signing in offline.{" "}
            <button type="button" onClick={forgetDevice} className="underline font-semibold" style={{color:"#4A5D3A"}} data-testid="forget-device">Forget children saved on this device</button>
          </p>
        )}
        <p className="mt-5 pt-4 border-t text-center text-[11px] leading-relaxed text-stone-500" style={{borderColor:"#E4DAC0"}} data-testid="acknowledgement-of-country">Side-Quest acknowledges the Traditional Custodians of Country throughout Australia and pays respect to Elders past and present.</p>
      </form>
      )}
    </div>
  );
}
