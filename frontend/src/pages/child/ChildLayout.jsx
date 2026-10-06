import React from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Compass, Home, FolderOpen, LogOut } from "lucide-react";

const themeMap = {
  early: { shell: "bg-amber-50", nav: "bg-amber-100 text-amber-900 border-amber-200", accent: "bg-amber-500 text-white", title: "Early Explorer" },
  primary: { shell: "bg-emerald-50", nav: "bg-emerald-100 text-emerald-900 border-emerald-200", accent: "bg-emerald-600 text-white", title: "Primary Quest" },
  secondary: { shell: "bg-slate-50", nav: "bg-white text-slate-900 border-slate-200", accent: "bg-blue-600 text-white", title: "Secondary Focus" },
  senior: { shell: "bg-neutral-50", nav: "bg-white text-slate-900 border-slate-200", accent: "bg-slate-900 text-white", title: "Senior Academic" },
};

export default function ChildLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const theme = themeMap[user?.theme] || themeMap.primary;

  return (
    <div className={`min-h-screen ${theme.shell}`} data-testid="child-shell" data-theme={user?.theme}>
      <header className={`sticky top-0 z-30 border-b ${theme.nav} backdrop-blur-xl`}>
        <div className="mx-auto max-w-6xl flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2">
            <Compass size={22} />
            <div className="leading-tight">
              <div className="font-display text-sm font-bold">Side Quest</div>
              <div className="text-[11px] opacity-70">{theme.title} · {user?.stage_name}</div>
            </div>
          </div>
          <nav className="flex items-center gap-1 text-sm">
            <Link to="/child" className={`rounded-full px-3 py-1.5 font-semibold ${loc.pathname === "/child" ? theme.accent : "hover:bg-white/60"}`} data-testid="child-nav-home"><Home size={14} className="inline mr-1"/> Home</Link>
            <Link to="/child/portfolio" className={`rounded-full px-3 py-1.5 font-semibold ${loc.pathname === "/child/portfolio" ? theme.accent : "hover:bg-white/60"}`} data-testid="child-nav-portfolio"><FolderOpen size={14} className="inline mr-1"/> Portfolio</Link>
            <button onClick={()=>{logout(); nav("/");}} className="rounded-full px-3 py-1.5 font-semibold hover:bg-white/60" data-testid="child-logout"><LogOut size={14} className="inline mr-1"/> Sign out</button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-6">
        <Outlet />
      </main>
    </div>
  );
}
