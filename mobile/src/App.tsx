import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ActasPage from './pages/ActasPage';
import ActaDetailPage from './pages/ActaDetailPage';
import ActaFormPage from './pages/ActaFormPage';
import FamiliaresPage from './pages/FamiliaresPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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
      </AuthProvider>
    </BrowserRouter>
  );
}
