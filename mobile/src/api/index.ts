import axios from 'axios';

const API_BASE = (() => {
  try {
    const c = (window as any).Capacitor;
    if (c && typeof c.getPlatform === 'function' && c.getPlatform() !== 'web') {
      const stored = localStorage.getItem('api_url');
      if (stored) return stored;
      return 'https://actas-nacimiento.onrender.com/api';
    }
  } catch {}
  return '/api';
})();

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && !err.config?.url?.includes('/auth/login')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (email: string, password: string) => {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);
    return api.post('/auth/login', params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
  me: () => api.get('/auth/me'),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  register: (email: string, password: string) =>
    api.post('/auth/register', { email, password }),
};

export const actasAPI = {
  list: (skip = 0, limit = 50) =>
    api.get('/actas/', { params: { skip, limit } }),
  get: (id: number) => api.get(`/actas/${id}`),
  getByNumero: (numero: string) => api.get(`/actas/numero/${numero}`),
  search: (q: string) => api.get('/actas/search', { params: { q } }),
  create: (data: any) => api.post('/actas/', data),
  delete: (id: number) => api.delete(`/actas/${id}`),
  downloadPDF: (id: number) =>
    api.get(`/actas/${id}/pdf`, { responseType: 'blob' }),
};

export const registradoresAPI = {
  list: () => api.get('/registradores/'),
};

export const dashboardAPI = {
  stats: () => api.get('/actas/stats'),
};

export const familiaresAPI = {
  list: () => api.get('/familiares/'),
  get: (id: number) => api.get(`/familiares/${id}`),
  create: (data: any) => api.post('/familiares/', data),
  update: (id: number, data: any) => api.put(`/familiares/${id}`, data),
  delete: (id: number) => api.delete(`/familiares/${id}`),
};
