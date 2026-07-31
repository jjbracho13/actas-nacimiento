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

const INACTIVITY_TIMEOUT = 3 * 60 * 1000;
const INACTIVITY_CHECK_INTERVAL = 15 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const cached = localStorage.getItem('user_data');
    return cached ? JSON.parse(cached) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const lastActivityRef = useRef(Date.now());

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
    localStorage.removeItem('token');
    localStorage.removeItem('user_data');
    setToken(null);
    setUser(null);
  }, []);

  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (!user) return;

    const events = ['touchstart', 'mousedown', 'keydown', 'scroll', 'click'];
    events.forEach((e) => document.addEventListener(e, updateActivity, { passive: true }));
    lastActivityRef.current = Date.now();

    const interval = setInterval(() => {
      if (Date.now() - lastActivityRef.current > INACTIVITY_TIMEOUT) {
        logout();
      }
    }, INACTIVITY_CHECK_INTERVAL);

    return () => {
      events.forEach((e) => document.removeEventListener(e, updateActivity));
      clearInterval(interval);
    };
  }, [user, logout, updateActivity]);

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
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
