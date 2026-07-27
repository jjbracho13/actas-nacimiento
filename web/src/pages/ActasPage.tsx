import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { actasAPI } from '../services/api';
import type { ActaNacimiento } from '../types';

export default function ActasPage() {
  const [actas, setActas] = useState<ActaNacimiento[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const loadActas = async () => {
    setLoading(true);
    try {
      const res = search ? await actasAPI.search(search) : await actasAPI.list();
      setActas(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadActas(); }, [search]);

  const handleDelete = async (id: number) => {
    if (!confirm('Eliminar esta acta permanentemente?')) return;
    try {
      await actasAPI.delete(id);
      setActas((prev) => prev.filter((a) => a.id !== id));
      setSuccess('Acta eliminada exitosamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al eliminar acta');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDownloadPDF = async (id: number, numero: string) => {
    setDownloadingId(id);
    try {
      const res = await actasAPI.downloadPDF(id);
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `acta_nacimiento_${numero}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al descargar PDF');
      setTimeout(() => setError(''), 3000);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="page-header mb-0">
          <h1 className="page-title">Actas de Nacimiento</h1>
          <p className="page-subtitle">{actas.length} actas registradas en el sistema</p>
        </div>
        <Link to="/actas/nueva" className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nueva Acta
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl flex items-center gap-2 mb-6">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm p-3 rounded-xl flex items-center gap-2 mb-6">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {success}
        </div>
      )}

      <div className="table-container">
        <div className="p-5 border-b border-slate-200">
          <div className="relative max-w-md">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por N de acta, nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-16 text-center">
            <div className="loading-spinner mx-auto mb-4" style={{width: 32, height: 32, borderWidth: 3}}></div>
            <p className="text-sm text-slate-500">Cargando actas...</p>
          </div>
        ) : actas.length === 0 ? (
          <div className="p-16 text-center">
            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <p className="text-slate-500 font-medium">No se encontraron actas</p>
            <p className="text-sm text-slate-400 mt-1">Comienza creando una nueva acta de nacimiento</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>N Acta</th>
                  <th>Fecha</th>
                  <th>Nombre Completo</th>
                  <th>Sexo</th>
                  <th>Lugar Nacimiento</th>
                  <th>Madre</th>
                  <th>Padre</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {actas.map((acta) => (
                  <tr key={acta.id}>
                    <td>
                      <span className="badge-blue font-mono">{acta.numero_acta}</span>
                    </td>
                    <td className="text-sm">
                      {acta.fecha_dia}/{acta.fecha_mes}/{acta.fecha_anio}
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
                          acta.presentado?.sexo === 'M' ? 'bg-blue-500' : 'bg-pink-500'
                        }`}>
                          {acta.presentado?.nombres?.[0]}{acta.presentado?.primer_apellido?.[0]}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">
                            {acta.presentado ? `${acta.presentado.nombres} ${acta.presentado.primer_apellido}` : '-'}
                          </p>
                          {acta.presentado?.segundo_apellido && (
                            <p className="text-xs text-slate-400">{acta.presentado.segundo_apellido}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={acta.presentado?.sexo === 'M' ? 'badge-blue' : 'badge-red'}>
                        {acta.presentado?.sexo === 'M' ? 'MASC' : 'FEM'}
                      </span>
                    </td>
                    <td className="text-sm">{acta.presentado?.parroquia || '-'}</td>
                    <td className="text-sm text-slate-500">{acta.madre ? `${acta.madre.nombres} ${acta.madre.primer_apellido}` : '-'}</td>
                    <td className="text-sm text-slate-500">{acta.padre ? `${acta.padre.nombres} ${acta.padre.primer_apellido}` : '-'}</td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/actas/${acta.id}`} className="btn-icon" title="Ver detalle">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDownloadPDF(acta.id, acta.numero_acta)}
                          disabled={downloadingId === acta.id}
                          className="btn-icon text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 disabled:opacity-50"
                          title="Descargar PDF"
                        >
                          {downloadingId === acta.id ? (
                            <div className="loading-spinner" style={{width: 16, height: 16, borderWidth: 2}}></div>
                          ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(acta.id)}
                          className="btn-icon text-red-400 hover:text-red-600 hover:bg-red-50"
                          title="Eliminar"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
