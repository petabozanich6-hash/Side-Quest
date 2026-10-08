import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Compass, LayoutDashboard, Users, BookOpen, Library, Camera, Calendar, ShieldAlert, Wand2, LogOut, GraduationCap, Leaf as LeafIcon, Trees, FileCheck, Sparkles, Trash2 } from "lucide-react";
import { Fern } from "../../components/shared/Botanical";
import DeleteAccountDialog from "../../components/parent/DeleteAccountDialog";

const nav = [
  { to: "/parent", icon: LayoutDashboard, label: "Dashboard", end: true, testid: "nav-dashboard" },
  { to: "/parent/children", icon: Users, label: "Children", testid: "nav-children" },
  { to: "/parent/curriculum", icon: GraduationCap, label: "Curriculum", testid: "nav-curriculum" },
  { to: "/parent/lessons", icon: BookOpen, label: "Lessons", testid: "nav-lessons" },
  { to: "/parent/learning-plans", icon: FileCheck, label: "Learning plans", testid: "nav-plans" },
  { to: "/parent/reading-log", icon: BookOpen, label: "Reading log", testid: "nav-reading" },
  { to: "/parent/word-hoard", icon: Sparkles, label: "Word Hoard", testid: "nav-word-hoard" },
  { to: "/parent/side-quest", icon: Wand2, label: "Side Quests", testid: "nav-sidequest" },
  { to: "/parent/evidence", icon: Camera, label: "Evidence", testid: "nav-evidence" },
  { to: "/parent/life-learning", icon: Trees, label: "Life learning", testid: "nav-life" },
  { to: "/parent/resources", icon: Library, label: "Resources", testid: "nav-resources" },
  { to: "/parent/calendar", icon: Calendar, label: "Calendar", testid: "nav-calendar" },
  { to: "/parent/audit", icon: ShieldAlert, label: "Audit", testid: "nav-audit" },
];

export default function ParentLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDelete, setShowDelete] = useState(false);
  const doLogout = async () => { await logout(); navigate("/"); };
  return (
    <div className="parent-shell flex relative">
      <aside className="w-64 shrink-0 sticky top-0 h-screen flex flex-col relative overflow-hidden" style={{backgroundColor:"#F5EFE0", borderRight:"1px solid #D4C8A8"}} data-testid="parent-sidebar">
        <Fern className="absolute -bottom-6 -left-4 pointer-events-none" size={200} color="#6B8A5B"/>
        <div className="p-6 flex items-center gap-2.5 border-b relative z-10" style={{borderColor:"#D4C8A8"}}>
          <div className="h-10 w-10 rounded-xl grid place-items-center" style={{backgroundColor:"#1F3B2D"}}><Compass size={20} style={{color:"#F5EFE0"}}/></div>
          <div className="leading-tight">
            <div className="font-display text-base font-bold" style={{color:"#1F3B2D"}}>Side Quest</div>
            <div className="text-[10px] uppercase tracking-widest font-bold text-stone-500">Parent Hub</div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5 relative z-10">
          {nav.map(n => (
            <NavLink key={n.to} to={n.to} end={n.end} data-testid={n.testid}
              className={({isActive}) => `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition ${isActive ? "" : "text-stone-700 hover:bg-white/80"}`}
              style={({isActive}) => isActive ? {backgroundColor:"#1F3B2D", color:"#F5EFE0"} : {}}>
              <n.icon size={16} /> {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t relative z-10" style={{borderColor:"#D4C8A8"}}>
          <div className="px-3 pb-2">
            <div className="text-xs font-bold truncate" style={{color:"#1F3B2D"}}>{user?.name}</div>
            <div className="text-[11px] text-stone-500 truncate">{user?.email}</div>
          </div>
          <button onClick={doLogout} className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-white/80" data-testid="parent-logout">
            <LogOut size={16} /> Sign out
          </button>
          <button onClick={() => setShowDelete(true)} className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold hover:bg-white/80" style={{color:"#9B2C2C"}} data-testid="parent-delete-account">
            <Trash2 size={14} /> Delete account
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 relative">
        <Outlet />
      </main>
      {showDelete && <DeleteAccountDialog onClose={() => setShowDelete(false)} />}
    </div>
  );
}
