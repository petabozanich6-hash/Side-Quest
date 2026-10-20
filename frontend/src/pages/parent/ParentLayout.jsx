import React, { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import { Compass, Lock, Search, Crown, LayoutDashboard, Users, BookOpen, Library, Scissors, Camera, Calendar, Wand2, LogOut, GraduationCap, Leaf as LeafIcon, Trees, FileCheck, Sparkles, Trash2, LifeBuoy, MessageSquare, Menu, X, ClipboardList, Map as MapIcon, Beaker } from "lucide-react";
import { Fern } from "../../components/shared/Botanical";
import DeleteAccountDialog from "../../components/parent/DeleteAccountDialog";
import HelpPopup from "../../components/parent/HelpPopup";
import HelpAlertBar from "../../components/parent/HelpAlertBar";
import ParentLabel from "../../components/parent/ParentLabel";
import InstallApp from "../../components/shared/InstallApp";
import JurisdictionGate from "../../components/parent/JurisdictionPicker";
import ParentGuidedTour from "../../components/parent/ParentGuidedTour";

const nav = [
  { to: "/parent", icon: LayoutDashboard, label: "Dashboard", end: true, testid: "nav-dashboard" },
  { to: "/parent/children", icon: Users, label: "Children", testid: "nav-children" },
  { to: "/parent/homeschool-compass", icon: Compass, label: "Homeschooling Compass", testid: "nav-homeschool-compass" },
  { to: "/parent/curriculum", icon: GraduationCap, label: "Curriculum", testid: "nav-curriculum" },
  { to: "/parent/outcomes", icon: MapIcon, label: "Outcome tracker", testid: "nav-outcomes" },
  { to: "/parent/lessons", icon: BookOpen, label: "My lessons", testid: "nav-lessons" },
  { to: "/parent/assignments", icon: ClipboardList, label: "Assignments", testid: "nav-assignments" },
  { to: "/parent/learning-plans", icon: FileCheck, label: "Learning plans", testid: "nav-plans" },
  { to: "/parent/reading-log", icon: BookOpen, label: "Reading log", testid: "nav-reading" },
  { to: "/parent/dragons-library", icon: Library, label: "Dragon’s Library", testid: "nav-dragons-library" },
  { to: "/parent/word-hoard", icon: Sparkles, label: "Word Hoard", testid: "nav-word-hoard" },
  { to: "/parent/side-quest", icon: Wand2, label: "Seasonal Surprises", testid: "nav-sidequest" },
  { to: "/parent/evidence", icon: Camera, label: "Evidence Backpack", testid: "nav-evidence" },
  { to: "/parent/life-learning", icon: Trees, label: "Life learning", testid: "nav-life" },
  { to: "/parent/resources", icon: Library, label: "Saved resources", testid: "nav-resources" },
  { to: "/parent/printable-vault", icon: Scissors, label: "Printable Vault", testid: "nav-printable-vault" },
  { to: "/parent/hands-on-vault", icon: Beaker, label: "Hands-On Quest Vault", testid: "nav-hands-on-vault" },
  { to: "/parent/calendar", icon: Calendar, label: "Calendar", testid: "nav-calendar" },
  { to: "/parent/plan", icon: Sparkles, label: "Plan", testid: "nav-plan" },
  { to: "/parent/trust", icon: LifeBuoy, label: "Trust & Support", testid: "nav-trust" },
  { to: "/parent/feedback", icon: MessageSquare, label: "Ideas & Feedback", testid: "nav-feedback" },
];

export default function ParentLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [planState, setPlanState] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [tourOpenRequest, setTourOpenRequest] = useState(0);
  const [unreadReplies,setUnreadReplies] = useState(0);
  const [latestUnreadReply,setLatestUnreadReply] = useState(null);
  // Cosmetic only: the server answers 404 on every /api/admin route for anyone who isn't the Owner.
  const isOwner = user?.is_platform_owner === true;
  const paidPlans = ["ACTIVE_WEEKLY","ACTIVE_FORTNIGHTLY","ACTIVE_MONTHLY","ACTIVE_ANNUAL","PAST_DUE","INTERNAL"];
  const hasMembership = planState && paidPlans.includes(planState.effective_plan);
  const route = location.pathname;
  const paidNotice = route.startsWith("/parent/life-learning") ? "Life-learning evidence and AI outcome mapping need Family Membership." :
    route.startsWith("/parent/printable-vault") ? "The original downloadable printable collection is included with Family Membership." :
    route.startsWith("/parent/hands-on-vault") ? "Printing the step-by-step hands-on activity guides is a Family Membership feature. You can preview all of the activity titles." :
    route.startsWith("/parent/resources") ? "Saving and managing resources and video suggestions need Family Membership." :
    route.startsWith("/parent/calendar") ? "Creating calendar events and weekly timetables need Family Membership. Existing events stay visible." :
    route.startsWith("/parent/word-hoard") ? "Adding new Word Hoard words needs Family Membership. Previously saved practice remains available." :
    route.startsWith("/parent/outcomes") ? "Your automatically recorded progress remains visible. Manually confirming or managing outcome evidence needs Family Membership." :
    route.startsWith("/parent/evidence") ? "The free preview includes a summary and one detailed sample. Full exports and new evidence notes need Family Membership." :
    route.startsWith("/parent/learning-plans") ? "The free preview includes one basic learning plan. More plans and AI planning need Family Membership." :
    route.startsWith("/parent/lessons/drafts") ? "Creating AI lesson sets and requesting AI refinements needs Family Membership. Your seven-day preview includes one complete AI-generated single lesson per family from Make a lesson." : "";
  const doLogout = async () => { await logout(); navigate("/"); };
  useEffect(() => {
    if (!user?.id || !paidNotice) return;
    let alive = true;
    api.get("/account/plan").then(r => { if (alive) setPlanState(r.data); }).catch(() => { if (alive) setPlanState(null); });
    return () => { alive = false; };
  }, [user?.id, location.pathname, paidNotice]);
  useEffect(() => {
    if (!user?.id) { setUnreadReplies(0); setLatestUnreadReply(null); return undefined; }
    let alive = true;
    const refresh = () => api.get("/feedback/unread-count").then(r => {
      if (!alive) return;
      const unread = Number(r.data?.unread || 0);
      setUnreadReplies(unread);
      setLatestUnreadReply(unread > 0 ? r.data?.latest || null : null);
    }).catch(()=>{});
    refresh();
    const timer = setInterval(refresh,60000);
    window.addEventListener("sidequest-feedback-replies-updated",refresh);
    return () => {alive=false;clearInterval(timer);window.removeEventListener("sidequest-feedback-replies-updated",refresh);};
  },[user?.id,location.pathname]);
  useEffect(() => {
    const shortcut = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); navigate("/parent/search"); setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, [navigate]);
  return (
    <div className="parent-shell flex relative">
      {menuOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMenuOpen(false)} data-testid="menu-overlay" />}
      <aside className={`w-64 shrink-0 fixed inset-y-0 left-0 z-40 transition-transform lg:sticky lg:top-0 lg:translate-x-0 lg:z-auto h-screen flex flex-col overflow-hidden ${menuOpen ? "translate-x-0" : "-translate-x-full"}`} style={{backgroundColor:"#F5EFE0", borderRight:"1px solid #D4C8A8"}} data-testid="parent-sidebar">
        <Fern className="absolute -bottom-6 -left-4 pointer-events-none" size={200} color="#6B8A5B"/>
        <div className="p-6 flex items-center gap-2.5 border-b relative z-10" style={{borderColor:"#D4C8A8"}}>
          <div className="h-10 w-10 rounded-xl grid place-items-center" style={{backgroundColor:"#1F3B2D"}}><Compass size={20} style={{color:"#F5EFE0"}}/></div>
          <div className="leading-tight">
            <div className="font-display text-base font-bold" style={{color:"#1F3B2D"}}>Side-Quest</div>
            <div className="text-[10px] uppercase tracking-widest font-bold text-stone-500">Parent Hub</div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5 relative z-10">
          {(isOwner ? [...nav, { to: "/parent/command-centre", icon: Crown, label: "Owner HQ", testid: "nav-command-centre" }] : nav).map(n => (
            <NavLink key={n.to} to={n.to} end={n.end} data-testid={n.testid} onClick={() => setMenuOpen(false)}
              className={({isActive}) => `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition ${isActive ? "" : "text-stone-700 hover:bg-white/80"}`}
              style={({isActive}) => isActive ? {backgroundColor:"#1F3B2D", color:"#F5EFE0"} : {}}>
              <n.icon size={16} /> <span className="flex-1">{n.label}</span>{n.to==="/parent/feedback"&&unreadReplies>0&&<span className="rounded-full bg-amber-100 text-amber-950 text-xs font-bold px-2 py-0.5" data-testid="parent-feedback-nav-unread" aria-label={unreadReplies+" unread messages"}>{unreadReplies}</span>}
            </NavLink>
          ))}
        </nav>
        <ParentLabel />
        <div className="p-3 border-t relative z-10" style={{borderColor:"#D4C8A8"}}>
          <div className="px-3 pb-2">
            <div className="text-xs font-bold truncate" style={{color:"#1F3B2D"}}>{user?.name}</div>
            <div className="text-[11px] text-stone-500 truncate">{user?.email}</div>
          </div>
          <InstallApp />
          <button onClick={doLogout} className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-white/80" data-testid="parent-logout">
            <LogOut size={16} /> Sign out
          </button>
          <button onClick={() => setShowDelete(true)} className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold hover:bg-white/80" style={{color:"#9B2C2C"}} data-testid="parent-delete-account">
            <Trash2 size={14} /> Delete account
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 relative">
        <div className="lg:hidden sticky top-0 z-20 flex items-center gap-3 px-4 py-3 border-b" style={{backgroundColor:"#F5EFE0", borderColor:"#D4C8A8"}}>
          <button onClick={() => setMenuOpen(v => !v)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} className="p-1" data-testid="menu-toggle">{menuOpen ? <X size={22}/> : <Menu size={22}/>}</button>
          <span className="font-display font-bold" style={{color:"#1F3B2D"}}>Side-Quest</span>
        </div>
        <div className="px-4 sm:px-8 pt-3 flex flex-wrap justify-end gap-2">
          <button type="button" onClick={() => { setMenuOpen(false); setTourOpenRequest(n => n + 1); }}
            data-testid="parent-start-tour" className="flex items-center gap-2 rounded-full border border-stone-300 bg-white/90 px-4 py-2 text-sm font-semibold text-emerald-950 hover:border-emerald-700" aria-label="Take a guided tour of Side-Quest">
            <Compass size={17}/> Take a tour
          </button>
          <button type="button" onClick={() => navigate("/parent/search")} data-testid="parent-global-search" className="flex items-center gap-2 rounded-full border border-stone-300 bg-white/90 px-4 py-2 text-sm font-semibold text-emerald-950 hover:border-emerald-700"><Search size={17}/> Search Side-Quest <span className="ml-2 text-xs text-stone-400 hidden sm:inline">⌘ / Ctrl + K</span></button>
        </div>
        {unreadReplies>0 && route!=="/parent/feedback" && route!=="/parent" && <Link to="/parent/feedback" className="mx-4 sm:mx-8 mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-center gap-2 text-sm text-amber-950 font-semibold" data-testid="parent-feedback-new-reply-banner"><MessageSquare size={17}/>{unreadReplies} new {unreadReplies===1?"reply":"replies"} from Side-Quest · Read your messages →</Link>}
        <HelpAlertBar />
        <JurisdictionGate />
        {paidNotice && planState && !hasMembership && <div className="mx-4 sm:mx-8 mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex flex-wrap items-start gap-3 text-sm text-amber-950" data-testid="membership-feature-notice"><Lock size={18} className="shrink-0 mt-0.5"/><p className="flex-1 min-w-[180px]"><strong>Family Membership feature.</strong> {paidNotice} {planState.effective_plan === "FREE_PREVIEW" ? "Your seven-day preview continues for basic lesson tools." : "Your saved work remains viewable."}</p><Link to="/parent/plan" className="shrink-0 underline font-bold">See membership details →</Link></div>}
        <Outlet context={{ unreadFeedbackReplies: unreadReplies, latestUnreadFeedbackReply: latestUnreadReply }} />
      </main>
      {showDelete && <DeleteAccountDialog onClose={() => setShowDelete(false)} />}
      <HelpPopup />
      <ParentGuidedTour user={user} openRequest={tourOpenRequest} />
    </div>
  );
}
