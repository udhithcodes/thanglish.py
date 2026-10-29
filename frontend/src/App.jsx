import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { CodePlaygroundProvider } from './context/CodePlaygroundContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import CodePlaygroundDrawer from './components/CodePlaygroundDrawer';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LearnTopics from './pages/LearnTopics';
import PracticePage from './pages/PracticePage';
import QuizPage from './pages/QuizPage';
import DashboardPage from './pages/DashboardPage';
import BookmarksPage from './pages/BookmarksPage';
import MistakesPage from './pages/MistakesPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <CodePlaygroundProvider>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
              <Navbar />
              <CodePlaygroundDrawer />
              <main className="main-content" style={{ flex: 1, width: '100%', overflowX: 'hidden' }}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  
                  {/* W3Schools-Style Learn Topics Curriculum */}
                  <Route path="/learn" element={<LearnTopics />} />
                  <Route path="/topics" element={<LearnTopics />} />
                  
                  {/* Legacy Levels redirect */}
                  <Route path="/levels" element={<Navigate to="/learn" replace />} />
                  
                  <Route path="/practice" element={<PracticePage />} />
                  <Route path="/quiz" element={<QuizPage />} />

                  {/* Protected Student Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/bookmarks"
                    element={
                      <ProtectedRoute>
                        <BookmarksPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/mistakes"
                    element={
                      <ProtectedRoute>
                        <MistakesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/history"
                    element={
                      <ProtectedRoute>
                        <HistoryPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Only Route */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <AdminPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </CodePlaygroundProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
