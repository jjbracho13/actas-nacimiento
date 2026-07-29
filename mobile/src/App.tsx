import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ActasPage from './pages/ActasPage';
import ActaDetailPage from './pages/ActaDetailPage';
import ActaFormPage from './pages/ActaFormPage';
import FamiliaresPage from './pages/FamiliaresPage';

function BackButtonHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    let unregister: (() => void) | undefined;

    import('@capacitor/app').then(({ App }) => {
      App.addListener('backButton', () => {
        navigate(-1);
      }).then(handle => { unregister = handle.remove; });
    });

    return () => { unregister?.(); };
  }, [navigate]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BackButtonHandler />
        <ErrorBoundary>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="actas" element={<ActasPage />} />
            <Route path="actas/nueva" element={
              <ProtectedRoute requiredRole="admin">
                <ActaFormPage />
              </ProtectedRoute>
            } />
            <Route path="actas/:id" element={<ActaDetailPage />} />
            <Route path="familiares" element={<FamiliaresPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}
