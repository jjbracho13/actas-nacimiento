import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { actasAPI, registradoresAPI } from '../api';
import type { Registrador } from '../types';

interface FormData {
  numero_acta: string;
  fecha_dia: string;
  fecha_mes: string;
  fecha_anio: string;
  registrador_id: string;
  tipo_inscripcion: string;
  es_reconocimiento: boolean;
  es_insercion: boolean;
  resolucion_numero: string;
  resolucion_dia: string;
  resolucion_mes: string;
  resolucion_anio: string;
  gaceta_municipal: string;
  gaceta_dia: string;
  gaceta_mes: string;
  gaceta_anio: string;
  circunstancias_especiales: string;
  documentos_presentados: string;
  presentado_nombres: string;
  presentado_primer_apellido: string;
  presentado_segundo_apellido: string;
  presentado_dia_nac: string;
  presentado_mes_nac: string;
  presentado_anio_nac: string;
  presentado_sexo: string;
  presentado_hora_nacimiento: string;
  presentado_am_pm: string;
  presentado_lugar_nacimiento: string;
  presentado_estado: string;
  presentado_municipio: string;
  presentado_parroquia: string;
  presentado_direccion: string;
  madre_nombres: string;
  madre_primer_apellido: string;
  madre_segundo_apellido: string;
  madre_documento_identidad: string;
  madre_tiene_cedula: string;
  madre_tiene_pasaporte: string;
  madre_tiene_otro: string;
  madre_edad: string;
  madre_nacionalidad: string;
  madre_profesion_ocupacion: string;
  madre_comunidad_indigena: string;
  madre_residencia: string;
  madre_es_declarante: string;
  padre_nombres: string;
  padre_primer_apellido: string;
  padre_segundo_apellido: string;
  padre_documento_identidad: string;
  padre_tiene_cedula: string;
  padre_tiene_pasaporte: string;
  padre_tiene_otro: string;
  padre_edad: string;
  padre_nacionalidad: string;
  padre_profesion_ocupacion: string;
  padre_comunidad_indigena: string;
  padre_residencia: string;
  padre_es_declarante: string;
  declarante_nombres_apellidos: string;
  declarante_caracter_actua: string;
  declarante_documento_identidad: string;
  declarante_tiene_cedula: string;
  declarante_tiene_pasaporte: string;
  declarante_tiene_otro: string;
  declarante_edad: string;
  declarante_nacionalidad: string;
  declarante_profesion_ocupacion: string;
  declarante_comunidad_indigena: string;
  declarante_residencia: string;
  certificado_nombre_centro_salud: string;
  certificado_autoridad_expide: string;
  certificado_numero_mpps: string;
  certificado_numero_certificado: string;
  certificado_dia_expedicion: string;
  certificado_mes_expedicion: string;
  certificado_anio_expedicion: string;
  certificado_direccion_centro: string;
  testigo1_nombres_apellidos: string;
  testigo1_cedula_identidad: string;
  testigo1_edad: string;
  testigo1_profesion_ocupacion: string;
  testigo1_nacionalidad: string;
  testigo1_comunidad_indigena: string;
  testigo1_residencia: string;
  testigo2_nombres_apellidos: string;
  testigo2_cedula_identidad: string;
  testigo2_edad: string;
  testigo2_profesion_ocupacion: string;
  testigo2_nacionalidad: string;
  testigo2_comunidad_indigena: string;
  testigo2_residencia: string;
}

const initialForm: FormData = {
  numero_acta: '', fecha_dia: '', fecha_mes: '', fecha_anio: '',
  registrador_id: '', tipo_inscripcion: 'REGISTRO DE NACIMIENTO',
  es_reconocimiento: false, es_insercion: false,
  resolucion_numero: '', resolucion_dia: '', resolucion_mes: '', resolucion_anio: '',
  gaceta_municipal: '', gaceta_dia: '', gaceta_mes: '', gaceta_anio: '',
  circunstancias_especiales: '', documentos_presentados: '',
  presentado_nombres: '', presentado_primer_apellido: '', presentado_segundo_apellido: '',
  presentado_dia_nac: '', presentado_mes_nac: '', presentado_anio_nac: '',
  presentado_sexo: '', presentado_hora_nacimiento: '', presentado_am_pm: '',
  presentado_lugar_nacimiento: '', presentado_estado: '', presentado_municipio: '',
  presentado_parroquia: '', presentado_direccion: '',
  madre_nombres: '', madre_primer_apellido: '', madre_segundo_apellido: '',
  madre_documento_identidad: '', madre_tiene_cedula: '', madre_tiene_pasaporte: '',
  madre_tiene_otro: '', madre_edad: '', madre_nacionalidad: '',
  madre_profesion_ocupacion: '', madre_comunidad_indigena: '', madre_residencia: '',
  madre_es_declarante: '',
  padre_nombres: '', padre_primer_apellido: '', padre_segundo_apellido: '',
  padre_documento_identidad: '', padre_tiene_cedula: '', padre_tiene_pasaporte: '',
  padre_tiene_otro: '', padre_edad: '', padre_nacionalidad: '',
  padre_profesion_ocupacion: '', padre_comunidad_indigena: '', padre_residencia: '',
  padre_es_declarante: '',
  declarante_nombres_apellidos: '', declarante_caracter_actua: '',
  declarante_documento_identidad: '', declarante_tiene_cedula: '',
  declarante_tiene_pasaporte: '', declarante_tiene_otro: '', declarante_edad: '',
  declarante_nacionalidad: '', declarante_profesion_ocupacion: '',
  declarante_comunidad_indigena: '', declarante_residencia: '',
  certificado_nombre_centro_salud: '', certificado_autoridad_expide: '',
  certificado_numero_mpps: '', certificado_numero_certificado: '',
  certificado_dia_expedicion: '', certificado_mes_expedicion: '',
  certificado_anio_expedicion: '', certificado_direccion_centro: '',
  testigo1_nombres_apellidos: '', testigo1_cedula_identidad: '',
  testigo1_edad: '', testigo1_profesion_ocupacion: '',
  testigo1_nacionalidad: '', testigo1_comunidad_indigena: '',
  testigo1_residencia: '',
  testigo2_nombres_apellidos: '', testigo2_cedula_identidad: '',
  testigo2_edad: '', testigo2_profesion_ocupacion: '',
  testigo2_nacionalidad: '', testigo2_comunidad_indigena: '',
  testigo2_residencia: '',
};

const MESES = [
  'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
  'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE',
];

export default function ActaFormPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>(initialForm);
  const [registradores, setRegistradores] = useState<Registrador[]>([]);
  const [saving, setSaving] = useState(false);
  const [formDirty, setFormDirty] = useState(false);

  useEffect(() => {
    setFormDirty(JSON.stringify(form) !== JSON.stringify(initialForm));
  }, [form]);

  useEffect(() => {
    registradoresAPI.list().then((r) => setRegistradores(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!formDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [formDirty]);

  const update = (field: keyof FormData, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  const buildPayload = () => {
    const hasValue = (v: string) => v !== '';
    return {
      numero_acta: form.numero_acta,
      fecha_dia: form.fecha_dia,
      fecha_mes: form.fecha_mes,
      fecha_anio: form.fecha_anio,
      registrador_id: Number(form.registrador_id),
      tipo_inscripcion: form.tipo_inscripcion,
      es_reconocimiento: form.es_reconocimiento,
      es_insercion: form.es_insercion,
      resolucion_numero: form.resolucion_numero,
      resolucion_dia: form.resolucion_dia,
      resolucion_mes: form.resolucion_mes,
      resolucion_anio: form.resolucion_anio,
      gaceta_municipal: form.gaceta_municipal,
      gaceta_dia: form.gaceta_dia,
      gaceta_mes: form.gaceta_mes,
      gaceta_anio: form.gaceta_anio,
      circunstancias_especiales: form.circunstancias_especiales,
      documentos_presentados: form.documentos_presentados,
      presentado: hasValue(form.presentado_nombres) ? {
        nombres: form.presentado_nombres,
        primer_apellido: form.presentado_primer_apellido,
        segundo_apellido: form.presentado_segundo_apellido,
        dia_nac: form.presentado_dia_nac,
        mes_nac: form.presentado_mes_nac,
        anio_nac: form.presentado_anio_nac,
        sexo: form.presentado_sexo,
        hora_nacimiento: form.presentado_hora_nacimiento,
        am_pm: form.presentado_am_pm,
        lugar_nacimiento: form.presentado_lugar_nacimiento,
        estado: form.presentado_estado,
        municipio: form.presentado_municipio,
        parroquia: form.presentado_parroquia,
        direccion: form.presentado_direccion,
      } : undefined,
      madre: hasValue(form.madre_nombres) ? {
        nombres: form.madre_nombres,
        primer_apellido: form.madre_primer_apellido,
        segundo_apellido: form.madre_segundo_apellido,
        documento_identidad: form.madre_documento_identidad,
        tiene_cedula: form.madre_tiene_cedula === 'true',
        tiene_pasaporte: form.madre_tiene_pasaporte === 'true',
        tiene_otro: form.madre_tiene_otro === 'true',
        edad: form.madre_edad,
        nacionalidad: form.madre_nacionalidad,
        profesion_ocupacion: form.madre_profesion_ocupacion,
        comunidad_indigena: form.madre_comunidad_indigena,
        residencia: form.madre_residencia,
        es_declarante: form.madre_es_declarante === 'true',
      } : undefined,
      padre: hasValue(form.padre_nombres) ? {
        nombres: form.padre_nombres,
        primer_apellido: form.padre_primer_apellido,
        segundo_apellido: form.padre_segundo_apellido,
        documento_identidad: form.padre_documento_identidad,
        tiene_cedula: form.padre_tiene_cedula === 'true',
        tiene_pasaporte: form.padre_tiene_pasaporte === 'true',
        tiene_otro: form.padre_tiene_otro === 'true',
        edad: form.padre_edad,
        nacionalidad: form.padre_nacionalidad,
        profesion_ocupacion: form.padre_profesion_ocupacion,
        comunidad_indigena: form.padre_comunidad_indigena,
        residencia: form.padre_residencia,
        es_declarante: form.padre_es_declarante === 'true',
      } : undefined,
      declarante: hasValue(form.declarante_nombres_apellidos) ? {
        nombres_apellidos: form.declarante_nombres_apellidos,
        caracter_actua: form.declarante_caracter_actua,
        documento_identidad: form.declarante_documento_identidad,
        tiene_cedula: form.declarante_tiene_cedula === 'true',
        tiene_pasaporte: form.declarante_tiene_pasaporte === 'true',
        tiene_otro: form.declarante_tiene_otro === 'true',
        edad: form.declarante_edad,
        nacionalidad: form.declarante_nacionalidad,
        profesion_ocupacion: form.declarante_profesion_ocupacion,
        comunidad_indigena: form.declarante_comunidad_indigena,
        residencia: form.declarante_residencia,
      } : undefined,
      certificado: hasValue(form.certificado_nombre_centro_salud) ? {
        nombre_centro_salud: form.certificado_nombre_centro_salud,
        autoridad_expide: form.certificado_autoridad_expide,
        numero_mpps: form.certificado_numero_mpps,
        numero_certificado: form.certificado_numero_certificado,
        dia_expedicion: form.certificado_dia_expedicion,
        mes_expedicion: form.certificado_mes_expedicion,
        anio_expedicion: form.certificado_anio_expedicion,
        direccion_centro: form.certificado_direccion_centro,
      } : undefined,
      testigos: [
        hasValue(form.testigo1_nombres_apellidos) ? {
          nombres_apellidos: form.testigo1_nombres_apellidos,
          cedula_identidad: form.testigo1_cedula_identidad,
          edad: form.testigo1_edad,
          profesion_ocupacion: form.testigo1_profesion_ocupacion,
          nacionalidad: form.testigo1_nacionalidad,
          comunidad_indigena: form.testigo1_comunidad_indigena,
          residencia: form.testigo1_residencia,
        } : undefined,
        hasValue(form.testigo2_nombres_apellidos) ? {
          nombres_apellidos: form.testigo2_nombres_apellidos,
          cedula_identidad: form.testigo2_cedula_identidad,
          edad: form.testigo2_edad,
          profesion_ocupacion: form.testigo2_profesion_ocupacion,
          nacionalidad: form.testigo2_nacionalidad,
          comunidad_indigena: form.testigo2_comunidad_indigena,
          residencia: form.testigo2_residencia,
        } : undefined,
      ].filter(Boolean),
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await actasAPI.create(buildPayload());
      navigate('/actas');
    } catch {
      alert('Error al crear acta');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition";
  const labelClass = "block text-xs text-slate-400 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white">Nueva Acta</h1>
        <p className="text-slate-400 text-sm mt-1">Registrar un nuevo nacimiento</p>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-slate-800/80 border-b border-slate-700/50">
          <h3 className="text-sm font-semibold text-emerald-400">Información del Acta</h3>
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="col-span-2 md:col-span-1">
            <label className={labelClass}>N° Acta</label>
            <input className={inputClass} value={form.numero_acta} onChange={(e) => update('numero_acta', e.target.value)} inputMode="numeric" required />
          </div>
          <div>
            <label className={labelClass}>Día</label>
            <input className={inputClass} value={form.fecha_dia} onChange={(e) => update('fecha_dia', e.target.value)} inputMode="numeric" required />
          </div>
          <div>
            <label className={labelClass}>Mes</label>
            <select className={inputClass} value={form.fecha_mes} onChange={(e) => update('fecha_mes', e.target.value)} required>
              <option value="">Seleccionar</option>
              {MESES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Año</label>
            <input className={inputClass} value={form.fecha_anio} onChange={(e) => update('fecha_anio', e.target.value)} inputMode="numeric" required />
          </div>
          <div className="col-span-2 md:col-span-2">
            <label className={labelClass}>Registrador</label>
            <select className={inputClass} value={form.registrador_id} onChange={(e) => update('registrador_id', e.target.value)} required>
              <option value="">Seleccionar</option>
              {registradores.map((r) => (
                <option key={r.id} value={r.id}>{r.nombres} {r.apellidos}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Tipo</label>
            <select className={inputClass} value={form.tipo_inscripcion} onChange={(e) => update('tipo_inscripcion', e.target.value)}>
              <option>REGISTRO DE NACIMIENTO</option>
              <option>RECONOCIMIENTO</option>
              <option>INSERCIÓN</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-slate-800/80 border-b border-slate-700/50">
          <h3 className="text-sm font-semibold text-emerald-400">Presentado</h3>
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
          <div><label className={labelClass}>Nombres</label><input className={inputClass} value={form.presentado_nombres} onChange={(e) => update('presentado_nombres', e.target.value)} /></div>
          <div><label className={labelClass}>1er Apellido</label><input className={inputClass} value={form.presentado_primer_apellido} onChange={(e) => update('presentado_primer_apellido', e.target.value)} /></div>
          <div><label className={labelClass}>2do Apellido</label><input className={inputClass} value={form.presentado_segundo_apellido} onChange={(e) => update('presentado_segundo_apellido', e.target.value)} /></div>
          <div><label className={labelClass}>Día Nac.</label><input className={inputClass} inputMode="numeric" value={form.presentado_dia_nac} onChange={(e) => update('presentado_dia_nac', e.target.value)} /></div>
          <div><label className={labelClass}>Mes Nac.</label><input className={inputClass} inputMode="numeric" value={form.presentado_mes_nac} onChange={(e) => update('presentado_mes_nac', e.target.value)} /></div>
          <div><label className={labelClass}>Año Nac.</label><input className={inputClass} inputMode="numeric" value={form.presentado_anio_nac} onChange={(e) => update('presentado_anio_nac', e.target.value)} /></div>
          <div><label className={labelClass}>Sexo</label>
            <select className={inputClass} value={form.presentado_sexo} onChange={(e) => update('presentado_sexo', e.target.value)}>
              <option value="">Seleccionar</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>
          <div><label className={labelClass}>Hora Nac.</label><input className={inputClass} inputMode="numeric" value={form.presentado_hora_nacimiento} onChange={(e) => update('presentado_hora_nacimiento', e.target.value)} /></div>
          <div><label className={labelClass}>AM/PM</label>
            <select className={inputClass} value={form.presentado_am_pm} onChange={(e) => update('presentado_am_pm', e.target.value)}>
              <option value="">Seleccionar</option>
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
          <div><label className={labelClass}>Lugar Nac.</label><input className={inputClass} value={form.presentado_lugar_nacimiento} onChange={(e) => update('presentado_lugar_nacimiento', e.target.value)} /></div>
          <div><label className={labelClass}>Municipio</label><input className={inputClass} value={form.presentado_municipio} onChange={(e) => update('presentado_municipio', e.target.value)} /></div>
          <div><label className={labelClass}>Estado</label><input className={inputClass} value={form.presentado_estado} onChange={(e) => update('presentado_estado', e.target.value)} /></div>
          <div><label className={labelClass}>Parroquia</label><input className={inputClass} value={form.presentado_parroquia} onChange={(e) => update('presentado_parroquia', e.target.value)} /></div>
          <div className="col-span-2"><label className={labelClass}>Dirección</label><input className={inputClass} value={form.presentado_direccion} onChange={(e) => update('presentado_direccion', e.target.value)} /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-slate-800/80 border-b border-slate-700/50">
            <h3 className="text-sm font-semibold text-emerald-400">Madre</h3>
          </div>
          <div className="p-4 space-y-3">
            <div><label className={labelClass}>Nombres</label><input className={inputClass} value={form.madre_nombres} onChange={(e) => update('madre_nombres', e.target.value)} /></div>
            <div><label className={labelClass}>1er Apellido</label><input className={inputClass} value={form.madre_primer_apellido} onChange={(e) => update('madre_primer_apellido', e.target.value)} /></div>
            <div><label className={labelClass}>2do Apellido</label><input className={inputClass} value={form.madre_segundo_apellido} onChange={(e) => update('madre_segundo_apellido', e.target.value)} /></div>
            <div><label className={labelClass}>Documento</label><input className={inputClass} inputMode="numeric" value={form.madre_documento_identidad} onChange={(e) => update('madre_documento_identidad', e.target.value)} /></div>
            <div><label className={labelClass}>Nacionalidad</label><input className={inputClass} value={form.madre_nacionalidad} onChange={(e) => update('madre_nacionalidad', e.target.value)} /></div>
            <div><label className={labelClass}>Edad</label><input className={inputClass} inputMode="numeric" value={form.madre_edad} onChange={(e) => update('madre_edad', e.target.value)} /></div>
            <div><label className={labelClass}>Prof./Ocup.</label><input className={inputClass} value={form.madre_profesion_ocupacion} onChange={(e) => update('madre_profesion_ocupacion', e.target.value)} /></div>
            <div><label className={labelClass}>Residencia</label><input className={inputClass} value={form.madre_residencia} onChange={(e) => update('madre_residencia', e.target.value)} /></div>
            <div><label className={labelClass}>Com. Indígena</label><input className={inputClass} value={form.madre_comunidad_indigena} onChange={(e) => update('madre_comunidad_indigena', e.target.value)} /></div>
            <div><label className={labelClass}>Es Declarante</label>
              <select className={inputClass} value={form.madre_es_declarante} onChange={(e) => update('madre_es_declarante', e.target.value)}>
                <option value="">No</option>
                <option value="true">Sí</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-slate-800/80 border-b border-slate-700/50">
            <h3 className="text-sm font-semibold text-emerald-400">Padre</h3>
          </div>
          <div className="p-4 space-y-3">
            <div><label className={labelClass}>Nombres</label><input className={inputClass} value={form.padre_nombres} onChange={(e) => update('padre_nombres', e.target.value)} /></div>
            <div><label className={labelClass}>1er Apellido</label><input className={inputClass} value={form.padre_primer_apellido} onChange={(e) => update('padre_primer_apellido', e.target.value)} /></div>
            <div><label className={labelClass}>2do Apellido</label><input className={inputClass} value={form.padre_segundo_apellido} onChange={(e) => update('padre_segundo_apellido', e.target.value)} /></div>
            <div><label className={labelClass}>Documento</label><input className={inputClass} inputMode="numeric" value={form.padre_documento_identidad} onChange={(e) => update('padre_documento_identidad', e.target.value)} /></div>
            <div><label className={labelClass}>Nacionalidad</label><input className={inputClass} value={form.padre_nacionalidad} onChange={(e) => update('padre_nacionalidad', e.target.value)} /></div>
            <div><label className={labelClass}>Edad</label><input className={inputClass} inputMode="numeric" value={form.padre_edad} onChange={(e) => update('padre_edad', e.target.value)} /></div>
            <div><label className={labelClass}>Prof./Ocup.</label><input className={inputClass} value={form.padre_profesion_ocupacion} onChange={(e) => update('padre_profesion_ocupacion', e.target.value)} /></div>
            <div><label className={labelClass}>Residencia</label><input className={inputClass} value={form.padre_residencia} onChange={(e) => update('padre_residencia', e.target.value)} /></div>
            <div><label className={labelClass}>Com. Indígena</label><input className={inputClass} value={form.padre_comunidad_indigena} onChange={(e) => update('padre_comunidad_indigena', e.target.value)} /></div>
            <div><label className={labelClass}>Es Declarante</label>
              <select className={inputClass} value={form.padre_es_declarante} onChange={(e) => update('padre_es_declarante', e.target.value)}>
                <option value="">No</option>
                <option value="true">Sí</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-slate-800/80 border-b border-slate-700/50">
            <h3 className="text-sm font-semibold text-emerald-400">Declarante</h3>
          </div>
          <div className="p-4 space-y-3">
            <div><label className={labelClass}>Nombres y Apellidos</label><input className={inputClass} value={form.declarante_nombres_apellidos} onChange={(e) => update('declarante_nombres_apellidos', e.target.value)} /></div>
            <div><label className={labelClass}>Carácter</label><input className={inputClass} value={form.declarante_caracter_actua} onChange={(e) => update('declarante_caracter_actua', e.target.value)} /></div>
            <div><label className={labelClass}>Documento</label><input className={inputClass} inputMode="numeric" value={form.declarante_documento_identidad} onChange={(e) => update('declarante_documento_identidad', e.target.value)} /></div>
            <div><label className={labelClass}>Nacionalidad</label><input className={inputClass} value={form.declarante_nacionalidad} onChange={(e) => update('declarante_nacionalidad', e.target.value)} /></div>
            <div><label className={labelClass}>Edad</label><input className={inputClass} inputMode="numeric" value={form.declarante_edad} onChange={(e) => update('declarante_edad', e.target.value)} /></div>
            <div><label className={labelClass}>Prof./Ocup.</label><input className={inputClass} value={form.declarante_profesion_ocupacion} onChange={(e) => update('declarante_profesion_ocupacion', e.target.value)} /></div>
            <div><label className={labelClass}>Residencia</label><input className={inputClass} value={form.declarante_residencia} onChange={(e) => update('declarante_residencia', e.target.value)} /></div>
            <div><label className={labelClass}>Com. Indígena</label><input className={inputClass} value={form.declarante_comunidad_indigena} onChange={(e) => update('declarante_comunidad_indigena', e.target.value)} /></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-slate-800/80 border-b border-slate-700/50">
            <h3 className="text-sm font-semibold text-emerald-400">Certificado Médico</h3>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            <div className="col-span-2"><label className={labelClass}>Centro Salud</label><input className={inputClass} value={form.certificado_nombre_centro_salud} onChange={(e) => update('certificado_nombre_centro_salud', e.target.value)} /></div>
            <div><label className={labelClass}>Autoridad Expide</label><input className={inputClass} value={form.certificado_autoridad_expide} onChange={(e) => update('certificado_autoridad_expide', e.target.value)} /></div>
            <div><label className={labelClass}>N° MPPS</label><input className={inputClass} inputMode="numeric" value={form.certificado_numero_mpps} onChange={(e) => update('certificado_numero_mpps', e.target.value)} /></div>
            <div><label className={labelClass}>N° Certificado</label><input className={inputClass} inputMode="numeric" value={form.certificado_numero_certificado} onChange={(e) => update('certificado_numero_certificado', e.target.value)} /></div>
            <div><label className={labelClass}>Día Exp.</label><input className={inputClass} inputMode="numeric" value={form.certificado_dia_expedicion} onChange={(e) => update('certificado_dia_expedicion', e.target.value)} /></div>
            <div><label className={labelClass}>Mes Exp.</label><input className={inputClass} inputMode="numeric" value={form.certificado_mes_expedicion} onChange={(e) => update('certificado_mes_expedicion', e.target.value)} /></div>
            <div><label className={labelClass}>Año Exp.</label><input className={inputClass} inputMode="numeric" value={form.certificado_anio_expedicion} onChange={(e) => update('certificado_anio_expedicion', e.target.value)} /></div>
            <div className="col-span-2"><label className={labelClass}>Dirección Centro</label><input className={inputClass} value={form.certificado_direccion_centro} onChange={(e) => update('certificado_direccion_centro', e.target.value)} /></div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-slate-800/80 border-b border-slate-700/50">
            <h3 className="text-sm font-semibold text-emerald-400">Testigos</h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="space-y-3">
              <p className="text-xs text-slate-500 uppercase">Testigo 1</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2"><label className={labelClass}>Nombres y Apellidos</label><input className={inputClass} value={form.testigo1_nombres_apellidos} onChange={(e) => update('testigo1_nombres_apellidos', e.target.value)} /></div>
                <div><label className={labelClass}>Cédula</label><input className={inputClass} inputMode="numeric" value={form.testigo1_cedula_identidad} onChange={(e) => update('testigo1_cedula_identidad', e.target.value)} /></div>
                <div><label className={labelClass}>Edad</label><input className={inputClass} inputMode="numeric" value={form.testigo1_edad} onChange={(e) => update('testigo1_edad', e.target.value)} /></div>
                <div><label className={labelClass}>Prof./Ocup.</label><input className={inputClass} value={form.testigo1_profesion_ocupacion} onChange={(e) => update('testigo1_profesion_ocupacion', e.target.value)} /></div>
                <div><label className={labelClass}>Nacionalidad</label><input className={inputClass} value={form.testigo1_nacionalidad} onChange={(e) => update('testigo1_nacionalidad', e.target.value)} /></div>
                <div><label className={labelClass}>Com. Indígena</label><input className={inputClass} value={form.testigo1_comunidad_indigena} onChange={(e) => update('testigo1_comunidad_indigena', e.target.value)} /></div>
                <div><label className={labelClass}>Residencia</label><input className={inputClass} value={form.testigo1_residencia} onChange={(e) => update('testigo1_residencia', e.target.value)} /></div>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xs text-slate-500 uppercase">Testigo 2</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2"><label className={labelClass}>Nombres y Apellidos</label><input className={inputClass} value={form.testigo2_nombres_apellidos} onChange={(e) => update('testigo2_nombres_apellidos', e.target.value)} /></div>
                <div><label className={labelClass}>Cédula</label><input className={inputClass} inputMode="numeric" value={form.testigo2_cedula_identidad} onChange={(e) => update('testigo2_cedula_identidad', e.target.value)} /></div>
                <div><label className={labelClass}>Edad</label><input className={inputClass} inputMode="numeric" value={form.testigo2_edad} onChange={(e) => update('testigo2_edad', e.target.value)} /></div>
                <div><label className={labelClass}>Prof./Ocup.</label><input className={inputClass} value={form.testigo2_profesion_ocupacion} onChange={(e) => update('testigo2_profesion_ocupacion', e.target.value)} /></div>
                <div><label className={labelClass}>Nacionalidad</label><input className={inputClass} value={form.testigo2_nacionalidad} onChange={(e) => update('testigo2_nacionalidad', e.target.value)} /></div>
                <div><label className={labelClass}>Com. Indígena</label><input className={inputClass} value={form.testigo2_comunidad_indigena} onChange={(e) => update('testigo2_comunidad_indigena', e.target.value)} /></div>
                <div><label className={labelClass}>Residencia</label><input className={inputClass} value={form.testigo2_residencia} onChange={(e) => update('testigo2_residencia', e.target.value)} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Link to="/actas" className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition cursor-pointer text-sm text-center">
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="flex-[2] py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white font-medium rounded-lg transition cursor-pointer text-sm"
        >
          {saving ? 'Guardando...' : 'Guardar Acta'}
        </button>
      </div>
    </form>
  );
}
