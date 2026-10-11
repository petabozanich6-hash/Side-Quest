import LessonDetail from "./pages/LessonDetail";
import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChildLogin from "./pages/ChildLogin";
import AuthCallback from "./pages/AuthCallback";
import ParentLayout from "./pages/parent/ParentLayout";
import ParentDashboard from "./pages/parent/Dashboard";
import ChildrenPage from "./pages/parent/Children";
import CurriculumPage from "./pages/parent/Curriculum";
import LessonsPage from "./pages/parent/Lessons";
import ResourcesPage from "./pages/parent/Resources";
import EvidencePage from "./pages/parent/Evidence";
import CalendarPage from "./pages/parent/CalendarPage";
import AuditPage from "./pages/parent/Audit";
import SideQuestPage from "./pages/parent/SideQuest";
import LifeLearningPage from "./pages/parent/LifeLearning";
import LearningPlansPage from "./pages/parent/LearningPlans";
import ReadingLogPage from "./pages/parent/ReadingLog";
import ChildOverviewPage from "./pages/parent/ChildOverview";
import ParentWordHoard from "./pages/parent/WordHoard";
import TrustSupport from "./pages/parent/TrustSupport";
import RequestData from "./pages/parent/RequestData";
import LegalPage from "./pages/legal/LegalPage";
import ChildLayout from "./pages/child/ChildLayout";
import ChildHome from "./pages/child/ChildHome";
import ChildLesson from "./pages/child/ChildLesson";
import ChildPortfolio from "./pages/child/ChildPortfolio";
import ChildCalendar from "./pages/child/ChildCalendar";
import ChildAchievements from "./pages/child/ChildAchievements";
import ChildWordHoard from "./pages/child/ChildWordHoard";
import PetRoom from "./pages/child/PetRoom";
import ChildReading from "./pages/child/ChildReading";

function Guard({ role, children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-stone-500">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === "child" ? "/child" : "/parent"} replace />;
  return children;
}

function Router() {
  const loc = useLocation();
  if (loc.hash?.includes("session_id=")) return <AuthCallback />;
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/child-login" element={<ChildLogin />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/legal/:slug" element={<LegalPage publicView />} />
      <Route path="/parent" element={<Guard role="parent"><ParentLayout /></Guard>}>
        <Route index element={<ParentDashboard />} />
        <Route path="children" element={<ChildrenPage />} />
        <Route path="children/:sid" element={<ChildOverviewPage />} />
        <Route path="curriculum" element={<CurriculumPage />} />
        <Route path="lessons" element={<LessonsPage />} />
        <Route path="lessons/:id" element={<LessonDetail />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="evidence" element={<EvidencePage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="audit" element={<AuditPage />} />
        <Route path="side-quest" element={<SideQuestPage />} />
        <Route path="life-learning" element={<LifeLearningPage />} />
        <Route path="learning-plans" element={<LearningPlansPage />} />
        <Route path="reading-log" element={<ReadingLogPage />} />
        <Route path="word-hoard" element={<ParentWordHoard />} />
        <Route path="trust" element={<TrustSupport />} />
        <Route path="trust/request-data" element={<RequestData />} />
        <Route path="trust/:slug" element={<LegalPage />} />
      </Route>
      <Route path="/child" element={<Guard role="child"><ChildLayout /></Guard>}>
        <Route index element={<ChildHome />} />
        <Route path="lesson/:aid" element={<ChildLesson />} />
        <Route path="portfolio" element={<ChildPortfolio />} />
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
        <Router />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
