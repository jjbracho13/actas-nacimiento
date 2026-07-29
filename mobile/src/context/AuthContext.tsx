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

const INACTIVITY_TIMEOUT = 10 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const cached = localStorage.getItem('user_data');
    return cached ? JSON.parse(cached) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    authAPI
      .me()
      .then((r) => {
        localStorage.setItem('user_data', JSON.stringify(r.data));
        setUser(r.data);
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_data');
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const logout = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user_data');
    setToken(null);
    setUser(null);
  }, []);

  const resetTimer = useCallback(() => {
    if (!user) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      logout();
    }, INACTIVITY_TIMEOUT);
  }, [user, logout]);

  useEffect(() => {
    if (!user) return;

    const events = ['touchstart', 'mousedown', 'keydown', 'scroll', 'click'];
    events.forEach((e) => document.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      events.forEach((e) => document.removeEventListener(e, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [user, resetTimer]);

  const login = useCallback((t: string, u: User) => {
    localStorage.setItem('token', t);
    setToken(t);
    setUser(u);
  }, []);

  const loginWithPassword = useCallback(async (email: string, password: string) => {
    const r = await authAPI.login(email, password);
    const t = r.data.access_token;
    localStorage.setItem('token', t);
    setToken(t);
    const me = await authAPI.me();
    localStorage.setItem('user_data', JSON.stringify(me.data));
    setUser(me.data);
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
