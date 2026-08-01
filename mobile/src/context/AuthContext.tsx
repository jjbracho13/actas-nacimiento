import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { authAPI } from '../api';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  loginWithPassword: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const INACTIVITY_TIMEOUT = 60 * 1000;
const INACTIVITY_CHECK_INTERVAL = 3 * 1000;
const INACTIVITY_CLOSE_DELAY = 10; // segundos

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const cached = localStorage.getItem('user_data');
    return cached ? JSON.parse(cached) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [inactivityPrompt, setInactivityPrompt] = useState(false);
  const [inactivityCountdown, setInactivityCountdown] = useState(INACTIVITY_CLOSE_DELAY);
  const lastActivityRef = useRef(Date.now());
  const inactivityPromptRef = useRef(false);
  const inactivityTimerRef = useRef<number | null>(null);
  const inactivityCountdownRef = useRef(INACTIVITY_CLOSE_DELAY);
  const promptShownAtRef = useRef(Date.now());

  const clearInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current !== null) {
      window.clearInterval(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    if (localStorage.getItem('user_data')) {
      setLoading(false);
    }
    let cancelled = false;
    authAPI
      .me()
      .then((r) => {
        if (cancelled) return;
        localStorage.setItem('user_data', JSON.stringify(r.data));
        setUser(r.data);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user_data');
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [token]);

  const logout = useCallback(() => {
    clearInactivityTimer();
    inactivityPromptRef.current = false;
    setInactivityPrompt(false);
    lastActivityRef.current = Date.now();
    localStorage.removeItem('token');
    localStorage.removeItem('user_data');
    setToken(null);
    setUser(null);
  }, [clearInactivityTimer]);

  const stayLoggedIn = useCallback(() => {
    clearInactivityTimer();
    inactivityPromptRef.current = false;
    setInactivityPrompt(false);
    lastActivityRef.current = Date.now();
  }, [clearInactivityTimer]);

  const closeSession = useCallback(() => {
    clearInactivityTimer();
    inactivityPromptRef.current = false;
    setInactivityPrompt(false);
    logout();
  }, [clearInactivityTimer, logout]);

  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (!user) return;

    const events = ['touchstart', 'mousedown', 'keydown', 'scroll', 'click'];
    events.forEach((e) => document.addEventListener(e, updateActivity, { passive: true }));
    lastActivityRef.current = Date.now();

    const startCountdown = () => {
      clearInactivityTimer();
      inactivityTimerRef.current = window.setInterval(() => {
        const remaining = INACTIVITY_CLOSE_DELAY - Math.floor((Date.now() - promptShownAtRef.current) / 1000);
        inactivityCountdownRef.current = Math.max(remaining, 0);
        setInactivityCountdown(inactivityCountdownRef.current);
        if (remaining <= 0) {
          clearInactivityTimer();
          logout();
        }
      }, 500);
    };

    const triggerPrompt = () => {
      if (inactivityPromptRef.current) return;
      inactivityPromptRef.current = true;
      inactivityCountdownRef.current = INACTIVITY_CLOSE_DELAY;
      setInactivityPrompt(true);
      setInactivityCountdown(INACTIVITY_CLOSE_DELAY);
      promptShownAtRef.current = Date.now();
      startCountdown();
    };

    const interval = setInterval(() => {
      if (Date.now() - lastActivityRef.current > INACTIVITY_TIMEOUT) {
        triggerPrompt();
      }
    }, INACTIVITY_CHECK_INTERVAL);

    const onVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return;
      if (inactivityPromptRef.current) {
        const remaining = INACTIVITY_CLOSE_DELAY - Math.floor((Date.now() - promptShownAtRef.current) / 1000);
        if (remaining <= 0) {
          clearInactivityTimer();
          logout();
          return;
        }
        inactivityCountdownRef.current = remaining;
        setInactivityCountdown(remaining);
        startCountdown();
      } else if (Date.now() - lastActivityRef.current > INACTIVITY_TIMEOUT) {
        triggerPrompt();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      events.forEach((e) => document.removeEventListener(e, updateActivity));
      document.removeEventListener('visibilitychange', onVisibilityChange);
      clearInterval(interval);
      clearInactivityTimer();
    };
  }, [user, logout, updateActivity, clearInactivityTimer]);

  const login = useCallback((t: string, u: User) => {
    localStorage.setItem('token', t);
    localStorage.setItem('user_data', JSON.stringify(u));
    setToken(t);
    setUser(u);
  }, []);

  const loginWithPassword = useCallback(async (email: string, password: string) => {
    const r = await authAPI.login(email, password);
    const t = r.data.access_token;
    const u = r.data.user;
    localStorage.setItem('token', t);
    localStorage.setItem('user_data', JSON.stringify(u));
    setToken(t);
    setUser(u);
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, loginWithPassword, logout }}>
      {children}
      {inactivityPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 w-full max-w-sm text-center space-y-4">
            <p className="text-sm text-white font-semibold">¿Aún quieres permanecer en la aplicación?</p>
            <p className="text-sm text-slate-400">
              La sesión se cerrará en <span className="text-white font-mono">{inactivityCountdown}</span> segundos si no respondes.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={stayLoggedIn}
                className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition cursor-pointer"
              >
                Permanecer
              </button>
              <button
                onClick={closeSession}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition cursor-pointer"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
