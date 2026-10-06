import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChildLogin from "./pages/ChildLogin";
import ParentLayout from "./pages/parent/ParentLayout";
import ParentDashboard from "./pages/parent/Dashboard";
import ChildrenPage from "./pages/parent/Children";
import CurriculumPage from "./pages/parent/Curriculum";
import LessonsPage from "./pages/parent/Lessons";
import AIPlannerPage from "./pages/parent/AIPlanner";
import ResourcesPage from "./pages/parent/Resources";
import EvidencePage from "./pages/parent/Evidence";
import CalendarPage from "./pages/parent/CalendarPage";
import AuditPage from "./pages/parent/Audit";
import SideQuestPage from "./pages/parent/SideQuest";
import ChildLayout from "./pages/child/ChildLayout";
import ChildHome from "./pages/child/ChildHome";
import ChildLesson from "./pages/child/ChildLesson";
import ChildPortfolio from "./pages/child/ChildPortfolio";

function Guard({ role, children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === "child" ? "/child" : "/parent"} replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster richColors position="top-right" />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/child-login" element={<ChildLogin />} />
          <Route path="/parent" element={<Guard role="parent"><ParentLayout /></Guard>}>
            <Route index element={<ParentDashboard />} />
            <Route path="children" element={<ChildrenPage />} />
            <Route path="curriculum" element={<CurriculumPage />} />
            <Route path="lessons" element={<LessonsPage />} />
            <Route path="ai-planner" element={<AIPlannerPage />} />
            <Route path="resources" element={<ResourcesPage />} />
            <Route path="evidence" element={<EvidencePage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="audit" element={<AuditPage />} />
            <Route path="side-quest" element={<SideQuestPage />} />
          </Route>
          <Route path="/child" element={<Guard role="child"><ChildLayout /></Guard>}>
            <Route index element={<ChildHome />} />
            <Route path="lesson/:aid" element={<ChildLesson />} />
            <Route path="portfolio" element={<ChildPortfolio />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
