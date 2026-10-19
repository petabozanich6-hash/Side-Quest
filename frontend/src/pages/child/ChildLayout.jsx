import React, { useEffect, useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Compass, CalendarDays, PawPrint, Backpack, LogOut } from "lucide-react";
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
      <header className="sticky top-0 z-30 border-b border-[#365A47] bg-[#1F3B2D] text-white shadow-lg" data-testid="child-header">
        <div className="mx-auto max-w-6xl px-3 pb-2 pt-3 sm:px-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <Link to="/child" className="flex items-center gap-2.5" aria-label="Side-Quest — My Quests">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#4A5D3A]"><Compass size={21} /></div>
              <div className="leading-tight">
                <div className="font-display text-lg font-extrabold">Side-Quest</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#DBE9C8]">{theme.title}</div>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <div className="hidden min-w-0 items-center gap-2 rounded-full bg-white/10 px-3 py-2 sm:flex">
                <span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#C77B5B] font-bold">{(user?.name || "E").slice(0, 1).toUpperCase()}</span>
                <span className="max-w-32 truncate text-sm font-bold">Hi, {user?.name || "explorer"}!</span>
              </div>
              <button onClick={doLogout} className="inline-flex min-h-10 items-center gap-1 rounded-full px-3 py-2 text-xs font-bold text-white/90 hover:bg-white/10" data-testid="child-logout"><LogOut size={16} /> <span className="hidden sm:inline">Sign out</span></button>
            </div>
          </div>
          <nav className="grid grid-cols-4 gap-1.5 sm:gap-2" aria-label="Main">
            {[
              { to: "/child", label: "My Quests", Icon: Compass, active: loc.pathname === "/child" || loc.pathname.startsWith("/child/lesson/"), test: "child-nav-home" },
              { to: "/child/calendar", label: "My Week", Icon: CalendarDays, active: loc.pathname === "/child/calendar", test: "child-nav-calendar" },
              { to: "/child/room", label: "My Pet", Icon: PawPrint, active: loc.pathname === "/child/room", test: "child-nav-room" },
              { to: "/child/stuff", label: "My Stuff", Icon: Backpack, active: !["/child", "/child/calendar", "/child/room"].includes(loc.pathname) && !loc.pathname.startsWith("/child/lesson/"), test: "child-nav-stuff" },
            ].map((tab) => {
              const Icon = tab.Icon;
              return <Link key={tab.to} to={tab.to} aria-current={tab.active ? "page" : undefined} data-testid={tab.test} className={"flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-2 text-center text-xs font-extrabold transition sm:min-h-16 sm:flex-row sm:gap-2 sm:text-sm " + (tab.active ? "bg-[#FBF7EC] text-[#1F3B2D] shadow" : "bg-white/10 text-[#F5EFE0] hover:bg-white/20")}>
                <Icon size={22} aria-hidden="true" /><span>{tab.label}</span>
              </Link>;
            })}
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
