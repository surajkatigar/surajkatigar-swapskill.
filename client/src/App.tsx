import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AppDashboardLayout } from './components/layout/AppDashboardLayout';

// Pages
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { MatchmakingPage } from './pages/MatchmakingPage';
import { ProfilePage } from './pages/ProfilePage';
import { UserProfilePage } from './pages/UserProfilePage';
import { SessionsPage } from './pages/SessionsPage';
import { ChatPage } from './pages/ChatPage';
import { WorkshopsPage } from './pages/WorkshopsPage';
import { LearningCirclesPage } from './pages/LearningCirclesPage';
import { PracticeTasksPage } from './pages/PracticeTasksPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Protected Route helper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="py-24 text-center text-slate-400 text-sm">Checking session...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isPublicPage = ['/', '/login', '/register'].includes(location.pathname);

  const allRoutes = (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Unified App & Dashboard Pages */}
      <Route
        element={
          <ProtectedRoute>
            <AppDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Navigate to="/matches" replace />} />
        <Route path="/matches" element={<MatchmakingPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/workshops" element={<WorkshopsPage />} />
        <Route path="/circles" element={<LearningCirclesPage />} />
        <Route path="/practice" element={<PracticeTasksPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/users/:id" element={<UserProfilePage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );

  if (isPublicPage) {
    return (
      <div className={`min-h-screen flex flex-col ${isHomePage ? 'bg-slate-50 text-slate-900' : 'bg-[#030303] text-slate-100'}`}>
        {!isHomePage && <Navbar />}
        <main className="flex-1 flex flex-col">
          {allRoutes}
        </main>
        {!isHomePage && <Footer />}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#070709] text-slate-100">
      {allRoutes}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <AppContent />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
