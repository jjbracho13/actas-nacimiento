import React, { useEffect, useState } from 'react';
import { familiaresAPI } from '../services/api';
import type { Familiar } from '../types';

export default function FamiliaresPage() {
  const [familiares, setFamiliares] = useState<Familiar[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [f, setF] = useState({ nombre_completo: '', cedula: '', telefono: '', fecha_nacimiento: '', hora_nacimiento: '' });

  const load = async () => {
    setLoading(true);
    try { const res = await familiaresAPI.list(); setFamiliares(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => { setF({ nombre_completo: '', cedula: '', telefono: '', fecha_nacimiento: '', hora_nacimiento: '' }); setShowForm(false); setEditId(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) await familiaresAPI.update(editId, f);
      else await familiaresAPI.create(f);
      resetForm(); load();
    } catch (err: any) { alert(err.response?.data?.detail || 'Error'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Eliminar familiar?')) return;
    await familiaresAPI.delete(id); load();
  };

  const startEdit = (fam: Familiar) => {
    setF({ nombre_completo: fam.nombre_completo, cedula: fam.cedula || '', telefono: fam.telefono || '', fecha_nacimiento: fam.fecha_nacimiento, hora_nacimiento: fam.hora_nacimiento || '' });
    setEditId(fam.id); setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="page-header mb-0">
          <h1 className="page-title">Familiares</h1>
          <p className="page-subtitle">{familiares.length} familiares registrados</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="btn-primary flex items-center gap-2">
          {showForm ? (
            <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg> Cancelar</>
          ) : (
            <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg> Nuevo Familiar</>
          )}
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6 fade-in">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">{editId ? 'Editar Familiar' : 'Nuevo Familiar'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid mb-4">
              <div><label className="label-field">Nombre Completo *</label><input value={f.nombre_completo} onChange={(e) => setF({ ...f, nombre_completo: e.target.value })} required className="input-field" /></div>
              <div><label className="label-field">Cedula</label><input value={f.cedula} onChange={(e) => setF({ ...f, cedula: e.target.value })} className="input-field" /></div>
              <div><label className="label-field">Telefono</label><input value={f.telefono} onChange={(e) => setF({ ...f, telefono: e.target.value })} className="input-field" /></div>
              <div><label className="label-field">Fecha Nacimiento *</label><input type="date" value={f.fecha_nacimiento} onChange={(e) => setF({ ...f, fecha_nacimiento: e.target.value })} required className="input-field" /></div>
            </div>
            <div className="flex justify-end"><button type="submit" className="btn-success flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              {editId ? 'Actualizar' : 'Guardar'}
            </button></div>
          </form>
        </div>
      )}

      <div className="table-container">
        {loading ? (
          <div className="p-16 text-center"><div className="loading-spinner mx-auto mb-4" style={{width: 32, height: 32, borderWidth: 3}}></div><p className="text-sm text-slate-500">Cargando familiares...</p></div>
        ) : familiares.length === 0 ? (
          <div className="p-16 text-center">
            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
            <p className="text-slate-500 font-medium">No hay familiares registrados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table>
              <thead><tr>
                <th>#</th><th>Nombre</th><th>Cedula</th><th>Telefono</th><th>Fecha Nac.</th><th>Edad</th><th>Prox Cumple</th><th className="text-center">Estado</th><th className="text-right">Acciones</th>
              </tr></thead>
              <tbody>
                {familiares.map((fam, i) => (
                  <tr key={fam.id}>
                    <td className="text-slate-400 font-medium">{i + 1}</td>
                    <td><span className="font-semibold text-slate-800">{fam.nombre_completo}</span></td>
                    <td className="font-mono text-sm">{fam.cedula || 'N/A'}</td>
                    <td className="text-sm">{fam.telefono || 'N/A'}</td>
                    <td className="font-mono text-sm">{fam.fecha_nacimiento}</td>
                    <td className="text-sm">{fam.edad_anos}a {fam.edad_meses}m {fam.edad_dias}d</td>
                    <td className="text-sm">{fam.dias_para_cumple === 0 ? <span className="badge-green font-bold">HOY!</span> : `${fam.dias_para_cumple} dias`}</td>
                    <td className="text-center text-xl">{fam.emoji_estado}</td>
                    <td><div className="flex items-center justify-end gap-1">
                      <button onClick={() => startEdit(fam)} className="btn-icon text-blue-500 hover:text-blue-600 hover:bg-blue-50"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg></button>
                      <button onClick={() => handleDelete(fam.id)} className="btn-icon text-red-400 hover:text-red-600 hover:bg-red-50"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></button>
                    </div></td>
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
