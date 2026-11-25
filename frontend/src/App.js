import React, { lazy, Suspense } from "react";
import RouteRecovery from "./components/shared/RouteRecovery";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChildLogin from "./pages/ChildLogin";
import GetApp from "./pages/GetApp";
import KidsOnly from "./pages/KidsOnly";
import { isKidsHost } from "./lib/pwa";
import AuthCallback from "./pages/AuthCallback";
import ParentLayout from "./pages/parent/ParentLayout";








import PlatformNotices from "./components/shared/PlatformNotices";




























import SiteSearch from "./pages/shared/SiteSearch";



import LegalPage from "./pages/legal/LegalPage";
import ChildLayout from "./pages/child/ChildLayout";
import ChildHome from "./pages/child/ChildHome";
import ChildStuff from "./pages/child/ChildStuff";
import ChildLessonRouter from "./pages/child/ChildLessonRouter";
import ChildPortfolio from "./pages/child/ChildPortfolio";
import ChildLessonArchive from "./pages/child/ChildLessonArchive";
import ChildCalendar from "./pages/child/ChildCalendar";
import ChildAchievements from "./pages/child/ChildAchievements";
import ChildWordHoard from "./pages/child/ChildWordHoard";
import PetRoom from "./pages/child/PetRoom";
import ChildReading from "./pages/child/ChildReading";
import DragonLibrary from "./pages/shared/DragonLibrary";
import { SHOP_URL } from "./lib/shop";

// Keep the student/offline and sign-in modules eager; defer parent-only tools.
const LearningSupport = lazy(() => import("./pages/parent/LearningSupport"));
const GuestSupportPortal=lazy(()=>import("./pages/parent/GuestSupportPortal"));
const FamilyPortal=lazy(()=>import("./pages/parent/FamilyPortal"));
const FamilyPortalRegister=lazy(()=>import("./pages/parent/FamilyPortal").then(m=>({default:m.FamilyPortalRegister})));
const HqGuestSupport=lazy(()=>import("./pages/parent/hq/HqGuestSupport"));
const LessonDetail = lazy(() => import("./pages/LessonDetail"));
const ParentDashboard = lazy(() => import("./pages/parent/Dashboard"));
const HqShell = lazy(() => import("./pages/parent/hq/HqShell"));
const HqOverview = lazy(() => import("./pages/parent/hq/HqOverview"));
const HqCustomers = lazy(() => import("./pages/parent/hq/HqCustomers"));
const HqCustomer = lazy(() => import("./pages/parent/hq/HqCustomer"));
const HqSettings = lazy(() => import("./pages/parent/hq/HqSettings"));
const HqAudit = lazy(() => import("./pages/parent/hq/HqAudit"));
const HqSecurity = lazy(() => import("./pages/parent/hq/HqSecurity"));
const ChildrenPage = lazy(() => import("./pages/parent/Children"));
const CurriculumPage = lazy(() => import("./pages/parent/Curriculum"));
const LessonsPage = lazy(() => import("./pages/parent/Lessons"));
const LessonBuilder = lazy(() => import("./pages/parent/LessonBuilder"));
const MakeLesson = lazy(() => import("./pages/parent/MakeLesson"));
const LessonReview = lazy(() => import("./pages/parent/LessonReview"));
const LessonDrafts = lazy(() => import("./pages/parent/LessonDrafts"));
const LessonPrint = lazy(() => import("./pages/parent/LessonPrint"));
const UpgradePage = lazy(() => import("./pages/parent/Upgrade"));
const AssignmentsPage = lazy(() => import("./pages/parent/Assignments"));
const ResourcesPage = lazy(() => import("./pages/parent/Resources"));
const HandwritingBook = lazy(() => import("./pages/parent/HandwritingBook"));
const HandsOnVault = lazy(() => import("./pages/parent/HandsOnVault"));
const HomeschoolCompass = lazy(() => import("./pages/parent/HomeschoolCompass"));
const EvidencePage = lazy(() => import("./pages/parent/Evidence"));
const CalendarPage = lazy(() => import("./pages/parent/CalendarPage"));
const AuditPage = lazy(() => import("./pages/parent/Audit"));
const SideQuestPage = lazy(() => import("./pages/parent/SideQuest"));
const LifeLearningPage = lazy(() => import("./pages/parent/LifeLearning"));
const LearningPlansPage = lazy(() => import("./pages/parent/LearningPlans"));
const ReadingLogPage = lazy(() => import("./pages/parent/ReadingLog"));
const ChildOverviewPage = lazy(() => import("./pages/parent/ChildOverview"));
const OutcomeTrackerPage = lazy(() => import("./pages/parent/OutcomeTracker"));
const OutcomeDetailPage = lazy(() => import("./pages/parent/OutcomeDetail"));
const ParentWordHoard = lazy(() => import("./pages/parent/WordHoard"));
const TrustSupport = lazy(() => import("./pages/parent/TrustSupport"));
const ParentFeedback = lazy(() => import("./pages/parent/ParentFeedback"));
const AnnouncementPreferences = lazy(() => import("./pages/parent/AnnouncementPreferences"));
const HqFeedback = lazy(() => import("./pages/parent/hq/HqFeedback"));
const HqAnnouncements = lazy(() => import("./pages/parent/hq/HqAnnouncements"));
const HqDocumentStudio = lazy(() => import("./pages/parent/hq/HqDocumentStudio"));

/** Sends visitors from an old in-app shop link to the Square shop. */
function GoToShop() {
  React.useEffect(() => { window.location.replace(SHOP_URL); }, []);
  return <p className="p-8 text-center text-stone-700">Taking you to the <a className="underline font-bold" href={SHOP_URL}>Side-Quest shop</a>…</p>;
}

function Guard({ role, children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-stone-500">Loading…</div>;
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === "child" ? "/child" : "/parent"} replace />;
  return children;
}

function Router() {
  const loc = useLocation();
  if (loc.hash?.includes("session_id=")) return <AuthCallback />;
  // SQ Kids (the kids' address) has no parent pages at all: grown-ups are pointed to the main site.
  if (isKidsHost() && /^\/(login|register|verify-email|forgot-password|reset-password|learning-support|family-portal|parent|print|auth)(\/|$)/.test(loc.pathname)) return <KidsOnly />;
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/learning-support" element={<LearningSupport publicView />} />
      <Route path="/learning-support/portal" element={<GuestSupportPortal />} />
      <Route path="/family-portal" element={<FamilyPortal />} />
      <Route path="/family-portal/register" element={<FamilyPortalRegister />} />
      {/* The shop moved to Square: old shop links (and anything under /shop) go there. */}
      <Route path="/shop/*" element={<GoToShop />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/child-login" element={<ChildLogin />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/legal/:slug" element={<LegalPage publicView />} />
      <Route path="/get-app" element={<GetApp />} />
      <Route path="/print/lesson/:id" element={<Guard role="parent"><LessonPrint /></Guard>} />
      <Route path="/parent" element={<Guard role="parent"><ParentLayout /></Guard>}>
        <Route index element={<ParentDashboard />} />
        <Route path="search" element={<SiteSearch mode="parent" />} />
        <Route path="children" element={<ChildrenPage />} />
        <Route path="children/:sid" element={<ChildOverviewPage />} />
        <Route path="curriculum" element={<CurriculumPage />} />
        <Route path="outcomes" element={<OutcomeTrackerPage />} />
        <Route path="outcomes/:sid" element={<OutcomeTrackerPage />} />
        <Route path="outcomes/:sid/:code" element={<OutcomeDetailPage />} />
        <Route path="lessons" element={<LessonsPage />} />
        <Route path="plan" element={<UpgradePage />} />
        <Route path="email-preferences" element={<AnnouncementPreferences />} />
        <Route path="command-centre" element={<HqShell />}>
          <Route index element={<HqOverview />} />
          <Route path="customers" element={<HqCustomers />} />
          <Route path="customers/:id" element={<HqCustomer />} />
          <Route path="settings" element={<HqSettings />} />
          <Route path="audit" element={<HqAudit />} />
          <Route path="security" element={<HqSecurity />} />
          <Route path="feedback" element={<HqFeedback />} />
          <Route path="learning-support" element={<HqGuestSupport />} />
          <Route path="announcements" element={<HqAnnouncements />} />
          <Route path="document-studio" element={<HqDocumentStudio />} />
        </Route>
        <Route path="assignments" element={<AssignmentsPage />} />
        <Route path="lessons/make" element={<MakeLesson />} />
        <Route path="lessons/drafts" element={<LessonDrafts />} />
        <Route path="lessons/drafts/:bid" element={<LessonDrafts />} />
        <Route path="lessons/new" element={<LessonBuilder />} />
        <Route path="lessons/:id/review" element={<LessonReview />} />
        <Route path="lessons/:id/edit" element={<LessonBuilder />} />
        <Route path="lessons/:id" element={<LessonDetail />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="handwriting-book" element={<HandwritingBook />} />
        <Route path="hands-on-vault" element={<HandsOnVault />} />
        <Route path="dragons-library" element={<DragonLibrary mode="parent" />} />
        <Route path="homeschool-compass" element={<HomeschoolCompass />} />
        <Route path="evidence" element={<EvidencePage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="audit" element={<AuditPage />} />
        <Route path="side-quest" element={<SideQuestPage />} />
        <Route path="life-learning" element={<LifeLearningPage />} />
        <Route path="learning-plans" element={<LearningPlansPage />} />
        <Route path="reading-log" element={<ReadingLogPage />} />
        <Route path="word-hoard" element={<ParentWordHoard />} />
        <Route path="trust" element={<TrustSupport />} />
        <Route path="learning-support" element={<LearningSupport />} />
        <Route path="feedback" element={<ParentFeedback />} />
        <Route path="trust/:slug" element={<LegalPage />} />
      </Route>
      <Route path="/child" element={<Guard role="child"><ChildLayout /></Guard>}>
        <Route index element={<ChildHome />} />
        <Route path="stuff" element={<ChildStuff />} />
        <Route path="search" element={<SiteSearch mode="child" />} />
        <Route path="lesson/:aid" element={<ChildLessonRouter />} />
        <Route path="portfolio" element={<ChildPortfolio />} />
        <Route path="archive" element={<ChildLessonArchive />} />
        <Route path="calendar" element={<ChildCalendar />} />
        <Route path="achievements" element={<ChildAchievements />} />
        <Route path="word-hoard" element={<ChildWordHoard />} />
        <Route path="room" element={<PetRoom />} />
        <Route path="reading" element={<ChildReading />} />
        <Route path="dragons-library" element={<Navigate to="/child/stuff" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster richColors position="top-right" />
        <PlatformNotices />
        <RouteRecovery><Suspense fallback={<div role="status" className="p-8 text-stone-600">Opening Side-Quest…</div>}><Router /></Suspense></RouteRecovery>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
