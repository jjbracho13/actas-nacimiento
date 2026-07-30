import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (username: string, password: string) =>
    api.post('/auth/login', new URLSearchParams({ username, password }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }),
  me: () => api.get('/auth/me'),
};

export const actasAPI = {
  list: (skip = 0, limit = 100) => api.get(`/actas/?skip=${skip}&limit=${limit}`),
  get: (id: number) => api.get(`/actas/${id}`),
  getByNumero: (numero: string) => api.get(`/actas/numero/${numero}`),
  search: (q: string) => api.get(`/actas/search?q=${encodeURIComponent(q)}`),
  create: (data: any) => api.post('/actas/', data),
  delete: (id: number) => api.delete(`/actas/${id}`),
  downloadPDF: (id: number) =>
    api.get(`/actas/${id}/pdf`, { responseType: 'blob' }),
  stats: () => api.get('/actas/stats'),
};

export const registradoresAPI = {
  list: () => api.get('/registradores/'),
  get: (id: number) => api.get(`/registradores/${id}`),
  create: (data: any) => api.post('/registradores/', data),
  update: (id: number, data: any) => api.put(`/registradores/${id}`, data),
};

export const familiaresAPI = {
  list: () => api.get('/familiares/'),
  get: (id: number) => api.get(`/familiares/${id}`),
  create: (data: any) => api.post('/familiares/', data),
  update: (id: number, data: any) => api.put(`/familiares/${id}`, data),
  delete: (id: number) => api.delete(`/familiares/${id}`),
};

export default api;
