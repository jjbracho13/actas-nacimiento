import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { actasAPI, familiaresAPI } from '../services/api';

export default function DashboardPage() {
  const [stats, setStats] = useState({ actas: 0, familiares: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      actasAPI.list(0, 1).catch(() => ({ data: [] })),
      familiaresAPI.list().catch(() => ({ data: [] })),
    ]).then(([actasRes, famRes]) => {
      setStats({
        actas: Array.isArray(actasRes.data) ? actasRes.data.length : 0,
        familiares: Array.isArray(famRes.data) ? famRes.data.length : 0,
      });
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Panel de Control</h1>
        <p className="page-subtitle">Bienvenido al sistema de actas de nacimiento</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stat-card bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <span className="text-blue-200 text-xs font-medium bg-white/20 px-2 py-1 rounded-lg">Total</span>
          </div>
          <p className="text-3xl font-bold">{loading ? '-' : stats.actas}</p>
          <p className="text-blue-200 text-sm mt-1">Actas de Nacimiento</p>
        </div>

        <div className="stat-card bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <span className="text-emerald-200 text-xs font-medium bg-white/20 px-2 py-1 rounded-lg">Activos</span>
          </div>
          <p className="text-3xl font-bold">{loading ? '-' : stats.familiares}</p>
          <p className="text-emerald-200 text-sm mt-1">Familiares Registrados</p>
        </div>

        <Link to="/actas/nueva" className="stat-card bg-gradient-to-br from-amber-500 to-orange-500 text-white group hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <svg className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
          <p className="text-3xl font-bold">Nueva</p>
          <p className="text-amber-200 text-sm mt-1">Registrar Acta</p>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Accesos Rapidos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/actas" className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Buscar Actas</p>
              <p className="text-xs text-slate-400">Por nombre o numero</p>
            </div>
          </Link>
          <Link to="/actas/nueva" className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all group">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Nueva Acta</p>
              <p className="text-xs text-slate-400">Crear registro</p>
            </div>
          </Link>
          <Link to="/familiares" className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all group">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Familiares</p>
              <p className="text-xs text-slate-400">Gestionar contactos</p>
            </div>
          </Link>
          <a href="/api/docs" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 transition-all group">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center group-hover:bg-amber-200 transition-colors">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">API Docs</p>
              <p className="text-xs text-slate-400">Swagger UI</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
