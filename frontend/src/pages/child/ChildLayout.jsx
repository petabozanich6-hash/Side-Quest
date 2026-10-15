import React, { useEffect, useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Compass, Home, FolderOpen, LogOut, Heart, Award, BookOpen, Library } from "lucide-react";
import { api } from "../../lib/api";
import { flushOutbox, pendingCount } from "../../lib/offline";
import { isKidsDevice } from "../../lib/pwa";
import PetPicker from "./PetPicker";
import PetCompanion from "../../components/shared/PetCompanion";
import ChildInbox from "../../components/child/ChildInbox";

const themeMap = {
  early: { shell:"child-early", accent:"#C77B5B", title:"Early Explorer" },
  primary: { shell:"child-primary", accent:"#4A5D3A", title:"Primary Quest" },
  secondary: { shell:"child-secondary", accent:"#1F3B2D", title:"Secondary Focus" },
  senior: { shell:"child-senior", accent:"#1F3B2D", title:"Senior Academic" },
};

export default function ChildLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const theme = themeMap[user?.theme] || themeMap.primary;
  const [needsPet, setNeedsPet] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    api.get("/pet").then(r => { setNeedsPet(!!r.data.needs_pet); setChecked(true); }).catch(()=>setChecked(true));
  }, []);

  // Work done offline is sent when the app opens and whenever the device comes back online.
  useEffect(() => {
    if (!user?.id) return undefined;
    const send = () => { if (navigator.onLine) flushOutbox(user.id); };
    send();
    window.addEventListener("online", send);
    return () => window.removeEventListener("online", send);
  }, [user?.id]);

  if (checked && needsPet) return <PetPicker onDone={()=>setNeedsPet(false)}/>;

  const doLogout = async () => {
    // On a child's own device (the kids' app) signing out keeps their saved quests and unsent work for next time.
    if (isKidsDevice()) { await logout({ keepOffline: true }); nav("/child-login"); return; }
    // Elsewhere signing out deletes this device's saved lessons, so check nothing is still waiting to be sent.
    if (user?.id) {
      if (navigator.onLine) await flushOutbox(user.id);
      const left = await pendingCount(user.id);
      if (left > 0 && !window.confirm(`You have work that hasn't been sent yet (no internet). If you sign out now it will be lost.\n\nSign out anyway?`)) return;
    }
    // On a child's own device (the kids' app), signing out returns to the child sign-in.
    await logout(); nav(isKidsDevice() ? "/child-login" : "/");
  };

  return (
    <div className={`min-h-screen ${theme.shell}`} data-testid="child-shell" data-theme={user?.theme}>
      <header className="sm:sticky top-0 z-30 border-b backdrop-blur-xl" style={{backgroundColor:"rgba(251,247,236,0.9)", borderColor:"#D4C8A8"}}>
        <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-2 px-4 sm:px-5 py-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl grid place-items-center" style={{backgroundColor: theme.accent}}><Compass size={18} style={{color:"#F5EFE0"}}/></div>
            <div className="leading-tight">
              <div className="font-display text-base font-bold" style={{color:"#1F3B2D"}}>Side-Quest</div>
              <div className="text-[10px] uppercase tracking-widest font-bold" style={{color: theme.accent}}>{theme.title}</div>
            </div>
          </div>
          <nav className="flex items-center gap-1 text-sm max-w-full overflow-x-auto whitespace-nowrap pb-1 sm:pb-0" aria-label="Main">
            <Link to="/child" className={`rounded-full px-3 py-1.5 font-bold ${loc.pathname === "/child" ? "" : "hover:bg-white"}`} style={loc.pathname === "/child" ? {backgroundColor: theme.accent, color:"#F5EFE0"} : {color:"#2A2822"}} data-testid="child-nav-home"><Home size={14} className="inline mr-1"/> Home</Link>
            <Link to="/child/archive" className={`rounded-full px-3 py-1.5 font-bold ${loc.pathname === "/child/archive" ? "" : "hover:bg-white"}`} style={loc.pathname === "/child/archive" ? {backgroundColor: theme.accent, color:"#F5EFE0"} : {color:"#2A2822"}}><FolderOpen size={14} className="inline mr-1"/> Archive</Link>
            <Link to="/child/portfolio" className={`rounded-full px-3 py-1.5 font-bold ${loc.pathname === "/child/portfolio" ? "" : "hover:bg-white"}`} style={loc.pathname === "/child/portfolio" ? {backgroundColor: theme.accent, color:"#F5EFE0"} : {color:"#2A2822"}} data-testid="child-nav-portfolio"><FolderOpen size={14} className="inline mr-1"/> Portfolio</Link>
            <Link to="/child/reading" className={`rounded-full px-3 py-1.5 font-bold ${loc.pathname === "/child/reading" ? "" : "hover:bg-white"}`} style={loc.pathname === "/child/reading" ? {backgroundColor: theme.accent, color:"#F5EFE0"} : {color:"#2A2822"}} data-testid="child-nav-reading"><Library size={14} className="inline mr-1"/> My reading</Link>
            <Link to="/child/word-hoard" className={`rounded-full px-3 py-1.5 font-bold ${loc.pathname === "/child/word-hoard" ? "" : "hover:bg-white"}`} style={loc.pathname === "/child/word-hoard" ? {backgroundColor: theme.accent, color:"#F5EFE0"} : {color:"#2A2822"}} data-testid="child-nav-word-hoard"><BookOpen size={14} className="inline mr-1"/> Word Hoard</Link>
            <Link to="/child/achievements" className={`rounded-full px-3 py-1.5 font-bold ${loc.pathname === "/child/achievements" ? "" : "hover:bg-white"}`} style={loc.pathname === "/child/achievements" ? {backgroundColor: theme.accent, color:"#F5EFE0"} : {color:"#2A2822"}} data-testid="child-nav-achievements"><Award size={14} className="inline mr-1"/> Achievements</Link>
            <Link to="/child/room" className={`rounded-full px-3 py-1.5 font-bold ${loc.pathname === "/child/room" ? "" : "hover:bg-white"}`} style={loc.pathname === "/child/room" ? {backgroundColor: theme.accent, color:"#F5EFE0"} : {color:"#2A2822"}} data-testid="child-nav-room"><Heart size={14} className="inline mr-1"/> Pet room</Link>
            <button onClick={doLogout} className="rounded-full px-3 py-1.5 font-bold hover:bg-white" style={{color:"#2A2822"}} data-testid="child-logout"><LogOut size={14} className="inline mr-1"/> Sign out</button>
          </nav>
        </div>
      </header>
      <ChildInbox />
      <main className="mx-auto max-w-6xl p-4 sm:p-6 pb-28">
        <Outlet />
      </main>
      {/* Pet companion appears on every child page except lesson + room pages */}
      {!loc.pathname.includes("/lesson/") && !loc.pathname.includes("/room") && <PetCompanion/>}
    </div>
  );
}
