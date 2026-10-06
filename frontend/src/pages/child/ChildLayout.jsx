import React, { useEffect, useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Compass, Home, FolderOpen, LogOut } from "lucide-react";
import { api } from "../../lib/api";
import PetPicker from "./PetPicker";
import PetCompanion from "../../components/shared/PetCompanion";

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

  if (checked && needsPet) return <PetPicker onDone={()=>setNeedsPet(false)}/>;

  const doLogout = async () => { await logout(); nav("/"); };

  return (
    <div className={`min-h-screen ${theme.shell}`} data-testid="child-shell" data-theme={user?.theme}>
      <header className="sticky top-0 z-30 border-b backdrop-blur-xl" style={{backgroundColor:"rgba(251,247,236,0.9)", borderColor:"#D4C8A8"}}>
        <div className="mx-auto max-w-6xl flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl grid place-items-center" style={{backgroundColor: theme.accent}}><Compass size={18} style={{color:"#F5EFE0"}}/></div>
            <div className="leading-tight">
              <div className="font-display text-base font-bold" style={{color:"#1F3B2D"}}>Side Quest</div>
              <div className="text-[10px] uppercase tracking-widest font-bold" style={{color: theme.accent}}>{theme.title}</div>
            </div>
          </div>
          <nav className="flex items-center gap-1 text-sm">
            <Link to="/child" className={`rounded-full px-3 py-1.5 font-bold ${loc.pathname === "/child" ? "" : "hover:bg-white"}`} style={loc.pathname === "/child" ? {backgroundColor: theme.accent, color:"#F5EFE0"} : {color:"#2A2822"}} data-testid="child-nav-home"><Home size={14} className="inline mr-1"/> Home</Link>
            <Link to="/child/portfolio" className={`rounded-full px-3 py-1.5 font-bold ${loc.pathname === "/child/portfolio" ? "" : "hover:bg-white"}`} style={loc.pathname === "/child/portfolio" ? {backgroundColor: theme.accent, color:"#F5EFE0"} : {color:"#2A2822"}} data-testid="child-nav-portfolio"><FolderOpen size={14} className="inline mr-1"/> Portfolio</Link>
            <button onClick={doLogout} className="rounded-full px-3 py-1.5 font-bold hover:bg-white" style={{color:"#2A2822"}} data-testid="child-logout"><LogOut size={14} className="inline mr-1"/> Sign out</button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-6 pb-28">
        <Outlet />
      </main>
      {/* Pet companion appears on every child page except lesson page (which embeds it itself) */}
      {!loc.pathname.includes("/lesson/") && <PetCompanion/>}
    </div>
  );
}
