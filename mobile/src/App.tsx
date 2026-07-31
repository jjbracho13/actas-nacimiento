import { lazy, Suspense, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, useNavigationType } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LogoutProvider, useLogout } from './components/LogoutProvider';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ActasPage from './pages/ActasPage';
import ActaFormPage from './pages/ActaFormPage';
import FamiliaresPage from './pages/FamiliaresPage';

const ActaDetailPage = lazy(() => import('./pages/ActaDetailPage'));

function PageLoader() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function BackButtonHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();
  const { user } = useAuth();
  const { requestLogout } = useLogout();
  const stackRef = useRef<string[]>([]);
  const firstRender = useRef(true);
  const lastBackPressRef = useRef(0);

  const userRef = useRef(user);
  userRef.current = user;
  const requestLogoutRef = useRef(requestLogout);
  requestLogoutRef.current = requestLogout;

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      stackRef.current = [location.pathname];
      return;
    }
    if (navigationType === 'REPLACE') {
      stackRef.current[stackRef.current.length - 1] = location.pathname;
    } else if (navigationType === 'PUSH') {
      stackRef.current.push(location.pathname);
    }
  }, [location.pathname, navigationType]);

  useEffect(() => {
    let active = true;
    let unregister: (() => void) | undefined;

    import('@capacitor/app').then(({ App }) => {
      if (!active) return;
      App.addListener('backButton', () => {
        const now = Date.now();
        if (now - lastBackPressRef.current < 400) return;
        lastBackPressRef.current = now;

        const stack = stackRef.current;
        if (stack.length > 1) {
          stack.pop();
          navigate(-1);
        } else if (userRef.current) {
          requestLogoutRef.current();
        } else {
          App.exitApp();
        }
      }).then((handle) => {
        if (active) unregister = handle.remove;
      });
    });

    return () => {
      active = false;
      unregister?.();
    };
  }, []);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LogoutProvider>
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
              <Route path="actas/:id" element={
                <Suspense fallback={<PageLoader />}>
                  <ActaDetailPage />
                </Suspense>
              } />
              <Route path="familiares" element={<FamiliaresPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </ErrorBoundary>
        </LogoutProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
