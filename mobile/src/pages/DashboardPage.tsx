import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { actasAPI, familiaresAPI } from '../api';

export default function DashboardPage() {
  const [totalActas, setTotalActas] = useState<number | null>(null);
  const [totalFamiliares, setTotalFamiliares] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      actasAPI.list(0, 100).catch(() => ({ data: [] })),
      familiaresAPI.list().catch(() => ({ data: [] })),
    ]).then(([actasRes, famRes]) => {
      setTotalActas(Array.isArray(actasRes.data) ? actasRes.data.length : 0);
      setTotalFamiliares(Array.isArray(famRes.data) ? famRes.data.length : 0);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white">Panel</h1>
        <p className="text-slate-400 text-sm mt-1">Resumen del registro civil</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 rounded-xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">Actas de Nacimiento</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium">Total</span>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-blue-400">{totalActas ?? '-'}</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 rounded-xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">Familiares Registrados</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium">Activos</span>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-emerald-400">{totalFamiliares ?? '-'}</p>
        </div>

        <Link
          to="/actas/nueva"
          className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20 rounded-xl p-4 md:p-5 hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-0.5 transition-all block group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">Registrar Acta</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-medium">Nueva</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-amber-400 font-medium text-sm group-hover:translate-x-1 transition-transform">Crear registro</span>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          to="/actas"
          className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-700/50 transition text-center"
        >
          <svg className="w-6 h-6 text-slate-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-sm font-medium text-white">Buscar Actas</p>
          <p className="text-xs text-slate-400 mt-0.5">Por nombre o numero</p>
        </Link>
        <Link
          to="/actas/nueva"
          className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-700/50 transition text-center"
        >
          <svg className="w-6 h-6 text-slate-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <p className="text-sm font-medium text-white">Nueva Acta</p>
          <p className="text-xs text-slate-400 mt-0.5">Crear registro</p>
        </Link>
        <Link
          to="/familiares"
          className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-700/50 transition text-center"
        >
          <svg className="w-6 h-6 text-slate-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-sm font-medium text-white">Familiares</p>
          <p className="text-xs text-slate-400 mt-0.5">Gestionar contactos</p>
        </Link>
        <a
          href="https://actas-nacimiento.onrender.com/api/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-700/50 transition text-center"
        >
          <svg className="w-6 h-6 text-slate-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <p className="text-sm font-medium text-white">API Docs</p>
          <p className="text-xs text-slate-400 mt-0.5">Swagger UI</p>
        </a>
      </div>
    </div>
  );
}
