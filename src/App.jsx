import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/Toaster';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BoardsPage from './pages/BoardsPage';
import SchedulePage from './pages/SchedulePage';
import AnalyticsPage from './pages/AnalyticsPage';
import TeamPage from './pages/TeamPage';
import ProfilePage from './pages/ProfilePage';
import useAuthStore from './store/authStore';

function App() {
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Check for dark mode preference
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/boards" element={<BoardsPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
      <Toaster />
    </div>
  );
}

export default App;