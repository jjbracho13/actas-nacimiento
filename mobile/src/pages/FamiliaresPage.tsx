import { useState, useEffect } from 'react';
import { familiaresAPI } from '../api';
import type { Familiar } from '../types';

export default function FamiliaresPage() {
  const [familiares, setFamiliares] = useState<Familiar[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [f, setF] = useState({
    nombre_completo: '',
    cedula: '',
    telefono: '',
    fecha_nacimiento: '',
    hora_nacimiento: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await familiaresAPI.list();
      setFamiliares(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setF({ nombre_completo: '', cedula: '', telefono: '', fecha_nacimiento: '', hora_nacimiento: '' });
    setShowForm(false);
    setEditId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (editId) {
        await familiaresAPI.update(editId, f);
      } else {
        await familiaresAPI.create(f);
      }
      resetForm();
      load();
      setSuccess(editId ? 'Familiar actualizado exitosamente' : 'Familiar creado exitosamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al guardar familiar');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Eliminar familiar?')) return;
    try {
      await familiaresAPI.delete(id);
      load();
      setSuccess('Familiar eliminado exitosamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al eliminar familiar');
    }
  };

  const startEdit = (fam: Familiar) => {
    setF({
      nombre_completo: fam.nombre_completo,
      cedula: fam.cedula || '',
      telefono: fam.telefono || '',
      fecha_nacimiento: fam.fecha_nacimiento,
      hora_nacimiento: fam.hora_nacimiento || '',
    });
    setEditId(fam.id);
    setShowForm(true);
  };

  const formatAge = (fam: Familiar) => {
    if (fam.edad_anos !== undefined) {
      return `${fam.edad_anos}a ${fam.edad_meses ?? 0}m ${fam.edad_dias ?? 0}d`;
    }
    return '-';
  };

  const formatBirthday = (fam: Familiar) => {
    if (fam.fecha_proximo_cumple) {
      const d = new Date(fam.fecha_proximo_cumple);
      return `${d.getUTCDate()}/${d.getUTCMonth() + 1}/${d.getUTCFullYear()}`;
    }
    return '-';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Familiares</h1>
          <p className="text-slate-400 text-sm mt-1">{familiares.length} familiares registrados</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          {showForm ? 'Cancelar' : 'Nuevo Familiar'}
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

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            {editId ? 'Editar Familiar' : 'Nuevo Familiar'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={f.nombre_completo}
              onChange={(e) => setF({ ...f, nombre_completo: e.target.value })}
              required
              placeholder="Nombre Completo *"
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition"
            />
            <input
              value={f.cedula}
              onChange={(e) => setF({ ...f, cedula: e.target.value })}
              placeholder="Cedula"
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition"
            />
            <input
              value={f.telefono}
              onChange={(e) => setF({ ...f, telefono: e.target.value })}
              placeholder="Telefono"
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition"
            />
            <input
              type="date"
              value={f.fecha_nacimiento}
              onChange={(e) => setF({ ...f, fecha_nacimiento: e.target.value })}
              required
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={resetForm} className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg text-sm">
              Cancelar
            </button>
            <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Guardar
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : familiares.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-lg">No hay familiares registrados</p>
          </div>
        ) : (
          familiares.map((fam) => (
            <div key={fam.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-sm font-bold text-emerald-400">
                    {fam.nombre_completo.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{fam.nombre_completo}</p>
                    <p className="text-slate-400 text-xs">{fam.cedula || 'N/A'} {fam.telefono ? `| ${fam.telefono}` : ''}</p>
                  </div>
                </div>
                <span className="text-2xl">{fam.emoji_estado || '?'}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-slate-700/30 rounded-lg p-2 text-center">
                  <p className="text-xs text-slate-400">Edad</p>
                  <p className="text-sm font-bold text-white">{formatAge(fam)}</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-2 text-center">
                  <p className="text-xs text-slate-400">Nacimiento</p>
                  <p className="text-sm font-bold text-white font-mono">{fam.fecha_nacimiento}</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-2 text-center">
                  <p className="text-xs text-slate-400">Prox Cumple</p>
                  {fam.dias_para_cumple === 0 ? (
                    <span className="text-sm font-bold text-emerald-400">HOY!</span>
                  ) : (
                    <p className="text-sm font-bold text-white">{fam.dias_para_cumple ?? '-'} dias</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => startEdit(fam)}
                  className="w-11 h-11 flex items-center justify-center text-blue-400 hover:text-blue-300 rounded-lg hover:bg-blue-500/10 transition"
                  aria-label="Editar familiar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(fam.id)}
                  className="w-11 h-11 flex items-center justify-center text-red-400 hover:text-red-300 rounded-lg hover:bg-red-500/10 transition"
                  aria-label="Eliminar familiar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
