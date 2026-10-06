import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Compass, LayoutDashboard, Users, BookOpen, Sparkles, Library, Camera, Calendar, ShieldAlert, Wand2, LogOut, GraduationCap } from "lucide-react";

const nav = [
  { to: "/parent", icon: LayoutDashboard, label: "Dashboard", end: true, testid: "nav-dashboard" },
  { to: "/parent/children", icon: Users, label: "Children", testid: "nav-children" },
  { to: "/parent/curriculum", icon: GraduationCap, label: "Curriculum", testid: "nav-curriculum" },
  { to: "/parent/lessons", icon: BookOpen, label: "Lessons", testid: "nav-lessons" },
  { to: "/parent/ai-planner", icon: Sparkles, label: "AI planner", testid: "nav-ai" },
  { to: "/parent/side-quest", icon: Wand2, label: "Side Quests", testid: "nav-sidequest" },
  { to: "/parent/resources", icon: Library, label: "Resources", testid: "nav-resources" },
  { to: "/parent/evidence", icon: Camera, label: "Evidence", testid: "nav-evidence" },
  { to: "/parent/calendar", icon: Calendar, label: "Calendar", testid: "nav-calendar" },
  { to: "/parent/audit", icon: ShieldAlert, label: "Audit", testid: "nav-audit" },
];

export default function ParentLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const doLogout = () => { logout(); navigate("/"); };
  return (
    <div className="parent-shell flex">
      <aside className="w-64 shrink-0 border-r border-slate-200 bg-white sticky top-0 h-screen flex flex-col" data-testid="parent-sidebar">
        <div className="p-6 flex items-center gap-2 border-b border-slate-100">
          <Compass className="text-teal-700" size={24} />
          <span className="font-display text-base font-bold text-slate-900 leading-tight">Side Quest<br/><span className="text-xs text-slate-500 font-normal">Parent Hub</span></span>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {nav.map(n => (
            <NavLink key={n.to} to={n.to} end={n.end} data-testid={n.testid}
              className={({isActive}) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"}`}>
              <n.icon size={16} /> {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-100">
          <div className="px-3 pb-2">
            <div className="text-xs font-semibold text-slate-900 truncate">{user?.name}</div>
            <div className="text-[11px] text-slate-500 truncate">{user?.email}</div>
          </div>
          <button onClick={doLogout} className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100" data-testid="parent-logout">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
