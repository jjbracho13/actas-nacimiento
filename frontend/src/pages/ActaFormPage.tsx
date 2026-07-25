import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { actasAPI, registradoresAPI } from '../services/api';
import type { Registrador } from '../types';

const Input = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div>
    <label className="label-field">{label}</label>
    <input {...props} className="input-field" />
  </div>
);

const Select = ({ label, options, ...props }: { label: string; options: { value: string; label: string }[] } & React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div>
    <label className="label-field">{label}</label>
    <select {...props} className="select-field">
      <option value="">Seleccionar...</option>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const FormSection = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="card overflow-hidden">
    <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 flex items-center gap-3">
      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">{icon}</div>
      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

export default function ActaFormPage() {
  const navigate = useNavigate();
  const [registradores, setRegistradores] = useState<Registrador[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [f, setF] = useState({
    numero_acta: '', fecha_dia: '', fecha_mes: '', fecha_anio: '',
    resolucion_numero: '', resolucion_dia: '', resolucion_mes: '', resolucion_anio: '',
    gaceta_municipal: '', registrador_id: '',
    pn: '', ppa: '', psa: '', pdn: '', pmn: '', pan: '', psexo: '', phora: '', pam_pm: '',
    pestado: '', pmunicipio: '', pparroquia: '', pdireccion: '',
    cn: '', cd: '', cm: '', ca: '', ccentro: '', cauto: '', cmpps: '',
    mn: '', mpa: '', msa: '', md: '', medad: '', mnac: '', mocup: '', mres: '',
    pn2: '', ppa2: '', psa2: '', pd2: '', pedad2: '', pnac2: '', pop2: '', pres2: '',
    t1n: '', t1c: '', t1e: '', t1o: '',
    t2n: '', t2c: '', t2e: '', t2o: '',
  });

  useEffect(() => {
    registradoresAPI.list().then((res) => setRegistradores(res.data)).catch(console.error);
  }, []);

  const u = (field: string, value: string) => setF((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const data = {
      acta: { numero_acta: f.numero_acta, fecha_dia: f.fecha_dia, fecha_mes: f.fecha_mes, fecha_anio: f.fecha_anio,
        resolucion_numero: f.resolucion_numero || undefined, resolucion_dia: f.resolucion_dia || undefined,
        resolucion_mes: f.resolucion_mes || undefined, resolucion_anio: f.resolucion_anio || undefined,
        gaceta_municipal: f.gaceta_municipal || undefined, registrador_id: Number(f.registrador_id) },
      presentado: { nombres: f.pn, primer_apellido: f.ppa, segundo_apellido: f.psa || undefined,
        dia_nac: f.pdn, mes_nac: f.pmn, anio_nac: f.pan, sexo: f.psexo,
        hora_nacimiento: f.phora || undefined, am_pm: f.pam_pm || undefined,
        estado: f.pestado || undefined, municipio: f.pmunicipio || undefined,
        parroquia: f.pparroquia || undefined, direccion: f.pdireccion || undefined },
      certificado: f.cn ? { numero_certificado: f.cn, dia_expedicion: f.cd, mes_expedicion: f.cm,
        anio_expedicion: f.ca, nombre_centro_salud: f.ccentro, autoridad_expide: f.cauto,
        numero_mpps: f.cmpps || undefined } : undefined,
      madre: f.mn ? { nombres: f.mn, primer_apellido: f.mpa, segundo_apellido: f.msa || undefined,
        documento_identidad: f.md || undefined, edad: f.medad ? Number(f.medad) : undefined,
        nacionalidad: f.mnac || undefined, profesion_ocupacion: f.mocup || undefined,
        residencia: f.mres || undefined } : undefined,
      padre: f.pn2 ? { nombres: f.pn2, primer_apellido: f.ppa2, segundo_apellido: f.psa2 || undefined,
        documento_identidad: f.pd2 || undefined, edad: f.pedad2 ? Number(f.pedad2) : undefined,
        nacionalidad: f.pnac2 || undefined, profesion_ocupacion: f.pop2 || undefined,
        residencia: f.pres2 || undefined } : undefined,
      testigos: [
        f.t1n ? { nombres_apellidos: f.t1n, cedula_identidad: f.t1c || undefined,
          edad: f.t1e ? Number(f.t1e) : undefined, profesion_ocupacion: f.t1o || undefined } : null,
        f.t2n ? { nombres_apellidos: f.t2n, cedula_identidad: f.t2c || undefined,
          edad: f.t2e ? Number(f.t2e) : undefined, profesion_ocupacion: f.t2o || undefined } : null,
      ].filter(Boolean),
    };
    try {
      const res = await actasAPI.create(data);
      navigate(`/actas/${res.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al crear acta');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header mb-8">
        <h1 className="page-title">Nueva Acta de Nacimiento</h1>
        <p className="page-subtitle">Complete todos los datos del registro civil</p>
      </div>
      {error && <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-200 mb-6">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
        {error}
      </div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormSection title="Datos del Acta y Registrador" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>}>
          <div className="form-grid">
            <Input label="N de Acta *" value={f.numero_acta} onChange={(e) => u('numero_acta', e.target.value)} required />
            <Input label="Dia" value={f.fecha_dia} onChange={(e) => u('fecha_dia', e.target.value)} required maxLength={2} />
            <Input label="Mes" value={f.fecha_mes} onChange={(e) => u('fecha_mes', e.target.value)} required maxLength={2} />
            <Input label="Ano" value={f.fecha_anio} onChange={(e) => u('fecha_anio', e.target.value)} required maxLength={4} />
            <div>
              <label className="label-field">Registrador *</label>
              <select value={f.registrador_id} onChange={(e) => u('registrador_id', e.target.value)} required className="select-field">
                <option value="">Seleccionar...</option>
                {registradores.map((r) => <option key={r.id} value={r.id}>{r.nombres} {r.apellidos}</option>)}
              </select>
            </div>
            <Input label="Resolucion N" value={f.resolucion_numero} onChange={(e) => u('resolucion_numero', e.target.value)} />
          </div>
        </FormSection>

        <FormSection title="Datos del Presentado (Nacido)" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" /></svg>}>
          <div className="form-grid">
            <Input label="Nombres *" value={f.pn} onChange={(e) => u('pn', e.target.value)} required />
            <Input label="Primer Apellido *" value={f.ppa} onChange={(e) => u('ppa', e.target.value)} required />
            <Input label="Segundo Apellido" value={f.psa} onChange={(e) => u('psa', e.target.value)} />
            <Input label="Dia Nac *" value={f.pdn} onChange={(e) => u('pdn', e.target.value)} required maxLength={2} />
            <Input label="Mes Nac *" value={f.pmn} onChange={(e) => u('pmn', e.target.value)} required maxLength={2} />
            <Input label="Ano Nac *" value={f.pan} onChange={(e) => u('pan', e.target.value)} required maxLength={4} />
            <Select label="Sexo *" options={[{ value: 'M', label: 'Masculino' }, { value: 'F', label: 'Femenino' }]} value={f.psexo} onChange={(e) => u('psexo', e.target.value)} required />
            <Input label="Hora" value={f.phora} onChange={(e) => u('phora', e.target.value)} type="time" />
            <Select label="AM/PM" options={[{ value: 'AM', label: 'AM' }, { value: 'PM', label: 'PM' }]} value={f.pam_pm} onChange={(e) => u('pam_pm', e.target.value)} />
            <Input label="Estado" value={f.pestado} onChange={(e) => u('pestado', e.target.value)} />
            <Input label="Municipio" value={f.pmunicipio} onChange={(e) => u('pmunicipio', e.target.value)} />
            <Input label="Parroquia" value={f.pparroquia} onChange={(e) => u('pparroquia', e.target.value)} />
            <Input label="Direccion" value={f.pdireccion} onChange={(e) => u('pdireccion', e.target.value)} />
          </div>
        </FormSection>

        <FormSection title="Certificado Medico" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>}>
          <div className="form-grid">
            <Input label="Certificado N" value={f.cn} onChange={(e) => u('cn', e.target.value)} />
            <Input label="Dia" value={f.cd} onChange={(e) => u('cd', e.target.value)} maxLength={2} />
            <Input label="Mes" value={f.cm} onChange={(e) => u('cm', e.target.value)} maxLength={2} />
            <Input label="Ano" value={f.ca} onChange={(e) => u('ca', e.target.value)} maxLength={4} />
            <Input label="Centro de Salud" value={f.ccentro} onChange={(e) => u('ccentro', e.target.value)} />
            <Input label="Autoridad que expide" value={f.cauto} onChange={(e) => u('cauto', e.target.value)} />
          </div>
        </FormSection>

        <FormSection title="Datos de la Madre" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>}>
          <div className="form-grid">
            <Input label="Nombres" value={f.mn} onChange={(e) => u('mn', e.target.value)} />
            <Input label="Primer Apellido" value={f.mpa} onChange={(e) => u('mpa', e.target.value)} />
            <Input label="Segundo Apellido" value={f.msa} onChange={(e) => u('msa', e.target.value)} />
            <Input label="Documento" value={f.md} onChange={(e) => u('md', e.target.value)} />
            <Input label="Edad" value={f.medad} onChange={(e) => u('medad', e.target.value)} type="number" />
            <Input label="Nacionalidad" value={f.mnac} onChange={(e) => u('mnac', e.target.value)} />
            <Input label="Ocupacion" value={f.mocup} onChange={(e) => u('mocup', e.target.value)} />
            <Input label="Residencia" value={f.mres} onChange={(e) => u('mres', e.target.value)} />
          </div>
        </FormSection>

        <FormSection title="Datos del Padre" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>}>
          <div className="form-grid">
            <Input label="Nombres" value={f.pn2} onChange={(e) => u('pn2', e.target.value)} />
            <Input label="Primer Apellido" value={f.ppa2} onChange={(e) => u('ppa2', e.target.value)} />
            <Input label="Segundo Apellido" value={f.psa2} onChange={(e) => u('psa2', e.target.value)} />
            <Input label="Documento" value={f.pd2} onChange={(e) => u('pd2', e.target.value)} />
            <Input label="Edad" value={f.pedad2} onChange={(e) => u('pedad2', e.target.value)} type="number" />
            <Input label="Nacionalidad" value={f.pnac2} onChange={(e) => u('pnac2', e.target.value)} />
            <Input label="Ocupacion" value={f.pop2} onChange={(e) => u('pop2', e.target.value)} />
            <Input label="Residencia" value={f.pres2} onChange={(e) => u('pres2', e.target.value)} />
          </div>
        </FormSection>

        <FormSection title="Testigos" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>}>
          <p className="text-xs text-slate-500 font-semibold mb-3">Testigo 1</p>
          <div className="form-grid mb-4">
            <Input label="Nombre completo" value={f.t1n} onChange={(e) => u('t1n', e.target.value)} />
            <Input label="Cedula" value={f.t1c} onChange={(e) => u('t1c', e.target.value)} />
            <Input label="Edad" value={f.t1e} onChange={(e) => u('t1e', e.target.value)} type="number" />
            <Input label="Ocupacion" value={f.t1o} onChange={(e) => u('t1o', e.target.value)} />
          </div>
          <p className="text-xs text-slate-500 font-semibold mb-3">Testigo 2</p>
          <div className="form-grid">
            <Input label="Nombre completo" value={f.t2n} onChange={(e) => u('t2n', e.target.value)} />
            <Input label="Cedula" value={f.t2c} onChange={(e) => u('t2c', e.target.value)} />
            <Input label="Edad" value={f.t2e} onChange={(e) => u('t2e', e.target.value)} type="number" />
            <Input label="Ocupacion" value={f.t2o} onChange={(e) => u('t2o', e.target.value)} />
          </div>
        </FormSection>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/actas')} className="btn-secondary">Cancelar</button>
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? <div className="loading-spinner"></div> : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            )}
            Guardar Acta
          </button>
        </div>
      </form>
    </div>
  );
}
