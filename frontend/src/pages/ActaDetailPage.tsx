import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { actasAPI } from '../services/api';
import type { ActaNacimiento } from '../types';

const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="card overflow-hidden">
    <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 flex items-center gap-3">
      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
        {icon}
      </div>
      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const Field = ({ label, value, mono }: { label: string; value?: any; mono?: boolean }) => (
  <div>
    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
    <p className={`text-sm mt-0.5 ${mono ? 'font-mono' : ''} ${value ? 'text-slate-800 font-medium' : 'text-slate-400'}`}>
      {value || '-'}
    </p>
  </div>
);

export default function ActaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [acta, setActa] = useState<ActaNacimiento | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      actasAPI.get(Number(id))
        .then((res) => setActa(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleDownloadPDF = async () => {
    if (!acta) return;
    try {
      const res = await actasAPI.downloadPDF(acta.id);
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `acta_nacimiento_${acta.numero_acta}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error al descargar PDF');
    }
  };

  if (loading) return (
    <div className="p-16 text-center">
      <div className="loading-spinner mx-auto mb-4" style={{width: 32, height: 32, borderWidth: 3}}></div>
      <p className="text-sm text-slate-500">Cargando acta...</p>
    </div>
  );

  if (!acta) return (
    <div className="p-16 text-center">
      <p className="text-red-500">Acta no encontrada</p>
      <Link to="/actas" className="btn-primary mt-4 inline-block">Volver</Link>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/actas" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div>
            <h1 className="page-title flex items-center gap-3">
              Acta N° <span className="badge-blue font-mono text-base">{acta.numero_acta}</span>
            </h1>
            <p className="page-subtitle">
              {acta.fecha_dia}/{acta.fecha_mes}/{acta.fecha_anio} - {acta.tipo_inscripcion}
            </p>
          </div>
        </div>
        <button onClick={handleDownloadPDF} className="btn-success flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Descargar PDF
        </button>
      </div>

      <div className="space-y-6">
        <Section title="Registrador Civil" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Field label="Nombres" value={acta.registrador?.nombres} />
            <Field label="Apellidos" value={acta.registrador?.apellidos} />
            <Field label="Cedula" value={acta.registrador?.documento_identidad} mono />
            <Field label="Oficina" value={acta.registrador?.oficina_registro_civil} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4 pt-4 border-t border-slate-100">
            <Field label="Resolucion N" value={acta.resolucion_numero} mono />
            <Field label="Fecha Resolucion" value={`${acta.resolucion_dia || ''}/${acta.resolucion_mes || ''}/${acta.resolucion_anio || ''}`} />
            <Field label="Gaceta Municipal" value={acta.gaceta_municipal} />
          </div>
        </Section>

        <Section title="Presentado (Nacido)" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" /></svg>}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Field label="Nombres" value={acta.presentado?.nombres} />
            <Field label="Primer Apellido" value={acta.presentado?.primer_apellido} />
            <Field label="Segundo Apellido" value={acta.presentado?.segundo_apellido} />
            <Field label="Sexo" value={acta.presentado?.sexo === 'M' ? 'Masculino' : 'Femenino'} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4 pt-4 border-t border-slate-100">
            <Field label="Fecha Nacimiento" value={`${acta.presentado?.dia_nac}/${acta.presentado?.mes_nac}/${acta.presentado?.anio_nac}`} mono />
            <Field label="Hora" value={acta.presentado?.hora_nacimiento ? `${acta.presentado.hora_nacimiento} ${acta.presentado.am_pm || ''}` : '-'} />
            <Field label="Estado" value={acta.presentado?.estado} />
            <Field label="Municipio" value={acta.presentado?.municipio} />
          </div>
          <div className="grid grid-cols-2 gap-6 mt-4 pt-4 border-t border-slate-100">
            <Field label="Parroquia" value={acta.presentado?.parroquia} />
            <Field label="Direccion" value={acta.presentado?.direccion} />
          </div>
        </Section>

        {acta.certificado && (
          <Section title="Certificado Medico" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Field label="Certificado N" value={acta.certificado.numero_certificado} mono />
              <Field label="Fecha Expedicion" value={`${acta.certificado.dia_expedicion}/${acta.certificado.mes_expedicion}/${acta.certificado.anio_expedicion}`} />
              <Field label="Centro de Salud" value={acta.certificado.nombre_centro_salud} />
              <Field label="Autoridad" value={acta.certificado.autoridad_expide} />
            </div>
            <div className="grid grid-cols-2 gap-6 mt-4 pt-4 border-t border-slate-100">
              <Field label="MPPS N" value={acta.certificado.numero_mpps} mono />
              <Field label="Direccion Centro" value={acta.certificado.direccion_centro} />
            </div>
          </Section>
        )}

        {acta.madre && (
          <Section title="Datos de la Madre" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Field label="Nombres" value={acta.madre.nombres} />
              <Field label="Primer Apellido" value={acta.madre.primer_apellido} />
              <Field label="Segundo Apellido" value={acta.madre.segundo_apellido} />
              <Field label="Documento" value={acta.madre.documento_identidad} mono />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4 pt-4 border-t border-slate-100">
              <Field label="Edad" value={acta.madre.edad} />
              <Field label="Nacionalidad" value={acta.madre.nacionalidad} />
              <Field label="Ocupacion" value={acta.madre.profesion_ocupacion} />
              <Field label="Residencia" value={acta.madre.residencia} />
            </div>
          </Section>
        )}

        {acta.padre && (
          <Section title="Datos del Padre" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Field label="Nombres" value={acta.padre.nombres} />
              <Field label="Primer Apellido" value={acta.padre.primer_apellido} />
              <Field label="Segundo Apellido" value={acta.padre.segundo_apellido} />
              <Field label="Documento" value={acta.padre.documento_identidad} mono />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4 pt-4 border-t border-slate-100">
              <Field label="Edad" value={acta.padre.edad} />
              <Field label="Nacionalidad" value={acta.padre.nacionalidad} />
              <Field label="Ocupacion" value={acta.padre.profesion_ocupacion} />
              <Field label="Residencia" value={acta.padre.residencia} />
            </div>
          </Section>
        )}

        {acta.testigos && acta.testigos.length > 0 && (
          <Section title="Testigos" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>}>
            <div className="space-y-4">
              {acta.testigos.map((t) => (
                <div key={t.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="font-semibold text-slate-800 mb-3">Testigo {t.numero_testigo}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Field label="Nombre" value={t.nombres_apellidos} />
                    <Field label="Cedula" value={t.cedula_identidad} mono />
                    <Field label="Edad" value={t.edad} />
                    <Field label="Ocupacion" value={t.profesion_ocupacion} />
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}
