import LessonDetail from "./pages/LessonDetail";
import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChildLogin from "./pages/ChildLogin";
import GetApp from "./pages/GetApp";
import KidsOnly from "./pages/KidsOnly";
import { isKidsHost } from "./lib/pwa";
import AuthCallback from "./pages/AuthCallback";
import ParentLayout from "./pages/parent/ParentLayout";
import ParentDashboard from "./pages/parent/Dashboard";
import HqShell from "./pages/parent/hq/HqShell";
import HqOverview from "./pages/parent/hq/HqOverview";
import HqCustomers from "./pages/parent/hq/HqCustomers";
import HqCustomer from "./pages/parent/hq/HqCustomer";
import HqSettings from "./pages/parent/hq/HqSettings";
import HqAudit from "./pages/parent/hq/HqAudit";
import HqSecurity from "./pages/parent/hq/HqSecurity";
import PlatformNotices from "./components/shared/PlatformNotices";
import ChildrenPage from "./pages/parent/Children";
import CurriculumPage from "./pages/parent/Curriculum";
import LessonsPage from "./pages/parent/Lessons";
import LessonBuilder from "./pages/parent/LessonBuilder";
import MakeLesson from "./pages/parent/MakeLesson";
import LessonReview from "./pages/parent/LessonReview";
import LessonDrafts from "./pages/parent/LessonDrafts";
import LessonPrint from "./pages/parent/LessonPrint";
import UpgradePage from "./pages/parent/Upgrade";
import AssignmentsPage from "./pages/parent/Assignments";
import ResourcesPage from "./pages/parent/Resources";
import HomeschoolCompass from "./pages/parent/HomeschoolCompass";
import EvidencePage from "./pages/parent/Evidence";
import CalendarPage from "./pages/parent/CalendarPage";
import AuditPage from "./pages/parent/Audit";
import SideQuestPage from "./pages/parent/SideQuest";
import LifeLearningPage from "./pages/parent/LifeLearning";
import LearningPlansPage from "./pages/parent/LearningPlans";
import ReadingLogPage from "./pages/parent/ReadingLog";
import ChildOverviewPage from "./pages/parent/ChildOverview";
import OutcomeTrackerPage from "./pages/parent/OutcomeTracker";
import OutcomeDetailPage from "./pages/parent/OutcomeDetail";
import ParentWordHoard from "./pages/parent/WordHoard";
import TrustSupport from "./pages/parent/TrustSupport";
import LegalPage from "./pages/legal/LegalPage";
import ChildLayout from "./pages/child/ChildLayout";
import ChildHome from "./pages/child/ChildHome";
import ChildLessonRouter from "./pages/child/ChildLessonRouter";
import ChildPortfolio from "./pages/child/ChildPortfolio";
import ChildLessonArchive from "./pages/child/ChildLessonArchive";
import ChildCalendar from "./pages/child/ChildCalendar";
import ChildAchievements from "./pages/child/ChildAchievements";
import ChildWordHoard from "./pages/child/ChildWordHoard";
import PetRoom from "./pages/child/PetRoom";
import ChildReading from "./pages/child/ChildReading";

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
  if (isKidsHost() && /^\/(login|register|forgot-password|reset-password|parent|print|auth)(\/|$)/.test(loc.pathname)) return <KidsOnly />;
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/child-login" element={<ChildLogin />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/legal/:slug" element={<LegalPage publicView />} />
      <Route path="/get-app" element={<GetApp />} />
      <Route path="/print/lesson/:id" element={<Guard role="parent"><LessonPrint /></Guard>} />
      <Route path="/parent" element={<Guard role="parent"><ParentLayout /></Guard>}>
        <Route index element={<ParentDashboard />} />
        <Route path="children" element={<ChildrenPage />} />
        <Route path="children/:sid" element={<ChildOverviewPage />} />
        <Route path="curriculum" element={<CurriculumPage />} />
        <Route path="outcomes" element={<OutcomeTrackerPage />} />
        <Route path="outcomes/:sid" element={<OutcomeTrackerPage />} />
        <Route path="outcomes/:sid/:code" element={<OutcomeDetailPage />} />
        <Route path="lessons" element={<LessonsPage />} />
        <Route path="plan" element={<UpgradePage />} />
        <Route path="command-centre" element={<HqShell />}>
          <Route index element={<HqOverview />} />
          <Route path="customers" element={<HqCustomers />} />
          <Route path="customers/:id" element={<HqCustomer />} />
          <Route path="settings" element={<HqSettings />} />
          <Route path="audit" element={<HqAudit />} />
          <Route path="security" element={<HqSecurity />} />
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
        <Route path="trust/:slug" element={<LegalPage />} />
      </Route>
      <Route path="/child" element={<Guard role="child"><ChildLayout /></Guard>}>
        <Route index element={<ChildHome />} />
        <Route path="lesson/:aid" element={<ChildLessonRouter />} />
        <Route path="portfolio" element={<ChildPortfolio />} />
        <Route path="archive" element={<ChildLessonArchive />} />
        <Route path="calendar" element={<ChildCalendar />} />
        <Route path="achievements" element={<ChildAchievements />} />
        <Route path="word-hoard" element={<ChildWordHoard />} />
        <Route path="room" element={<PetRoom />} />
        <Route path="reading" element={<ChildReading />} />
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
        <Router />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
