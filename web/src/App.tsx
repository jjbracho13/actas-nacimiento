import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ActasPage from './pages/ActasPage';
import ActaDetailPage from './pages/ActaDetailPage';
import ActaFormPage from './pages/ActaFormPage';
import FamiliaresPage from './pages/FamiliaresPage';
import Layout from './components/Layout';

function ProtectedRoute({ children, user, requiredRole }: { children: React.ReactNode; user: any; requiredRole?: string }) {
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  const { user, loading, login, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage onLogin={login} />} />
        <Route
          path="/"
          element={
            <ProtectedRoute user={user}>
              <Layout user={user} onLogout={logout}>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/actas"
          element={
            <ProtectedRoute user={user}>
              <Layout user={user} onLogout={logout}>
                <ActasPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/actas/nueva"
          element={
            <ProtectedRoute user={user} requiredRole="admin">
              <Layout user={user} onLogout={logout}>
                <ActaFormPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/actas/:id"
          element={
            <ProtectedRoute user={user}>
              <Layout user={user} onLogout={logout}>
                <ActaDetailPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/familiares"
          element={
            <ProtectedRoute user={user}>
              <Layout user={user} onLogout={logout}>
                <FamiliaresPage />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
