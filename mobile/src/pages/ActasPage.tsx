import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { actasAPI } from '../api';
import type { ActaNacimiento } from '../types';
import ConfirmModal from '../components/ConfirmModal';

declare global {
  interface Window {
    Capacitor?: {
      getPlatform?: () => string;
      Plugins?: {
        PdfDownloader?: {
          download: (options: { url: string; filename: string }) => Promise<{ downloadId: number }>;
        };
      };
    };
  }
}

function isNativeApp(): boolean {
  try {
    const c = (window as any).Capacitor;
    return c && typeof c.getPlatform === 'function' && c.getPlatform() !== 'web';
  } catch {
    return false;
  }
}

function serverBase(): string {
  if (isNativeApp()) {
    const stored = localStorage.getItem('api_url');
    if (stored) return stored.replace(/\/api\/?$/, '');
    return 'https://actas-nacimiento.onrender.com';
  }
  return '';
}

export default function ActasPage() {
  const navigate = useNavigate();
  const [actas, setActas] = useState<ActaNacimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const loadActas = useCallback(async () => {
    setLoading(true);
    try {
      const r = await actasAPI.list();
      setActas(r.data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActas();
  }, [loadActas]);

  const handleSearch = async () => {
    if (!search.trim()) {
      loadActas();
      return;
    }
    setSearching(true);
    try {
      const r = await actasAPI.search(search);
      setActas(r.data);
    } catch {
      const r = await actasAPI.getByNumero(search);
      setActas(r.data ? [r.data] : []);
    } finally {
      setSearching(false);
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId === null) return;
    try {
      await actasAPI.delete(deleteConfirmId);
      loadActas();
      setSuccess('Acta eliminada exitosamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al eliminar acta');
      setTimeout(() => setError(''), 3000);
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleDownloadPDF = async (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      if (!token) { setError('No hay sesión activa'); setTimeout(() => setError(''), 3000); return; }

      if (isNativeApp()) {
        const fileName = `acta_${id}.pdf`;
        const url = `${serverBase()}/api/actas/${id}/pdf?token=${encodeURIComponent(token)}&_t=${Date.now()}`;
        const plugin = window.Capacitor?.Plugins?.PdfDownloader;
        if (plugin) {
          await plugin.download({ url, filename: fileName });
          setSuccess('PDF descargado en Descargas/ActasCNE/');
          setTimeout(() => setSuccess(''), 3000);
        } else {
          window.open(url, '_blank');
        }
      } else {
        const r = await actasAPI.downloadPDF(id);
        const blobUrl = URL.createObjectURL(r.data);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `acta_${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(blobUrl);
        }, 5000);
        setSuccess('PDF descargado exitosamente');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al descargar PDF');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white">Actas</h1>
        <p className="text-slate-400 text-sm mt-1">Buscar y gestionar actas de nacimiento</p>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Buscar por N° de acta..."
            className="w-full px-4 py-2.5 pl-10 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition"
          />
          <svg className="absolute left-3 top-3 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          onClick={handleSearch}
          disabled={searching}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white font-medium rounded-lg transition cursor-pointer"
        >
          {searching ? '...' : 'Buscar'}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-lg p-3 flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm rounded-lg p-3 flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {success}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-2">
          {actas.map((acta) => (
            <div
              key={acta.id}
              onClick={() => navigate(`/actas/${acta.id}`)}
              className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 cursor-pointer hover:bg-slate-700/30 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">
                    Acta N° {acta.numero_acta}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">
                    {acta.fecha_dia} de {acta.fecha_mes} de {acta.fecha_anio}
                    {acta.presentado && ` — ${acta.presentado.nombres} ${acta.presentado.primer_apellido}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <button
                    onClick={(e) => handleDownloadPDF(acta.id, e)}
                    className="w-11 h-11 flex items-center justify-center text-slate-500 hover:text-emerald-400 transition rounded-lg"
                    title="Descargar PDF"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => handleDelete(acta.id, e)}
                    className="w-11 h-11 flex items-center justify-center text-slate-500 hover:text-red-400 transition rounded-lg"
                    title="Eliminar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
          {actas.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-8">No se encontraron actas</p>
          )}
        </div>
      )}

      <ConfirmModal
        open={deleteConfirmId !== null}
        title="Eliminar acta"
        message="¿Estás seguro de eliminar esta acta?"
        confirmLabel="OK"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
}
