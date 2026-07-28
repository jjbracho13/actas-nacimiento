import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { actasAPI } from '../api';
import type { ActaNacimiento } from '../types';
import PdfViewer from '../components/PdfViewer';

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

export default function ActaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [acta, setActa] = useState<ActaNacimiento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    actasAPI
      .get(Number(id))
      .then((r) => setActa(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!acta) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Acta no encontrada</p>
        <Link to="/actas" className="text-emerald-400 text-sm mt-2 inline-block hover:underline">
          Volver a actas
        </Link>
      </div>
    );
  }

  const getPdfUrl = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return `${serverBase()}/api/actas/${acta.id}/pdf?token=${encodeURIComponent(token)}`;
  };

  const handlePreview = async () => {
    try {
      const url = getPdfUrl();
      if (!url) { setError('No hay sesión activa'); setTimeout(() => setError(''), 3000); return; }
      setPreviewLoading(true);
      setShowPreview(true);
      const res = await fetch(url);
      if (!res.ok) throw new Error('Error al generar PDF');
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      setPreviewBlobUrl(blobUrl);
    } catch (err: any) {
      setError(err.message || 'Error al generar vista previa');
      setTimeout(() => setError(''), 3000);
      setShowPreview(false);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handlePreviewExternal = async () => {
    try {
      const url = getPdfUrl();
      if (!url) { setError('No hay sesión activa'); setTimeout(() => setError(''), 3000); return; }
      window.open(url, '_blank');
    } catch (err: any) {
      setError(err.message || 'Error al abrir vista previa');
      setTimeout(() => setError(''), 3000);
    }
  };

  const closePreview = () => {
    if (previewBlobUrl) {
      URL.revokeObjectURL(previewBlobUrl);
    }
    setPreviewBlobUrl(null);
    setShowPreview(false);
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { setError('No hay sesión activa'); setTimeout(() => setError(''), 3000); return; }
      if (isNativeApp()) {
        const fileName = `acta_${acta.numero_acta}.pdf`;
        const url = `${serverBase()}/api/actas/${acta.id}/pdf?token=${encodeURIComponent(token)}&_t=${Date.now()}`;
        const plugin = window.Capacitor?.Plugins?.PdfDownloader;
        if (plugin) {
          await plugin.download({ url, filename: fileName });
          setSuccess('PDF descargado en Descargas/ActasCNE/');
          setTimeout(() => setSuccess(''), 3000);
        } else {
          window.open(url, '_blank');
        }
      } else {
        const r = await actasAPI.downloadPDF(acta.id);
        const blobUrl = URL.createObjectURL(r.data);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `acta_${acta.numero_acta}.pdf`;
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

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
      <div className="px-4 py-3 bg-slate-800/80 border-b border-slate-700/50">
        <h3 className="text-sm font-semibold text-emerald-400">{title}</h3>
      </div>
      <div className="p-4 space-y-2">{children}</div>
    </div>
  );

  const Field = ({ label, value }: { label: string; value?: string | null }) => (
    <div className="flex justify-between items-start gap-2">
      <span className="text-xs text-slate-500 uppercase tracking-wider shrink-0">{label}</span>
      <span className="text-sm text-white text-right">{value || '—'}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/actas" className="text-slate-400 hover:text-white transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m7 7l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-lg md:text-xl font-bold text-white">
            Acta N° {acta.numero_acta}
          </h1>
          <p className="text-xs text-slate-400">
            {acta.fecha_dia} de {acta.fecha_mes} de {acta.fecha_anio}
          </p>
        </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section title="Presentado">
          <Field label="👤 Nombre" value={`${acta.presentado?.nombres || ''} ${acta.presentado?.primer_apellido || ''}`} />
          <Field label="🎂 Fecha Nac." value={acta.presentado ? `${acta.presentado.dia_nac}/${acta.presentado.mes_nac}/${acta.presentado.anio_nac}` : ''} />
          <Field label={acta.presentado?.sexo === 'M' ? '♂️ Sexo' : '♀️ Sexo'} value={acta.presentado?.sexo} />
          <Field label="🕐 Hora" value={acta.presentado?.hora_nacimiento ? `${acta.presentado.hora_nacimiento} ${acta.presentado.am_pm || ''}` : ''} />
          <Field label="📍 Lugar" value={acta.presentado?.lugar_nacimiento} />
          <Field label="🏛️ Municipio" value={acta.presentado?.municipio} />
          <Field label="🗺️ Estado" value={acta.presentado?.estado} />
          <Field label="📍 Parroquia" value={acta.presentado?.parroquia} />
          <Field label="🏠 Dirección" value={acta.presentado?.direccion} />
        </Section>

        <Section title="Registrador">
          <Field label="Nombres" value={acta.registrador ? `${acta.registrador.nombres} ${acta.registrador.apellidos}` : ''} />
          <Field label="Cédula" value={acta.registrador?.documento_identidad} />
          <Field label="Oficina" value={acta.registrador?.oficina_registro_civil} />
        </Section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {acta.madre && (
          <Section title="👩 Madre">
            <Field label="👤 Nombres" value={`${acta.madre.nombres} ${acta.madre.primer_apellido}`} />
            <Field label="🆔 Cédula" value={acta.madre.documento_identidad} />
            <Field label="🌍 Nacionalidad" value={acta.madre.nacionalidad} />
            <Field label="💼 Profesión" value={acta.madre.profesion_ocupacion} />
            <Field label="🏠 Residencia" value={acta.madre.residencia} />
          </Section>
        )}

        {acta.padre && (
          <Section title="👨 Padre">
            <Field label="👤 Nombres" value={`${acta.padre.nombres} ${acta.padre.primer_apellido}`} />
            <Field label="🆔 Cédula" value={acta.padre.documento_identidad} />
            <Field label="🌍 Nacionalidad" value={acta.padre.nacionalidad} />
            <Field label="💼 Profesión" value={acta.padre.profesion_ocupacion} />
            <Field label="🏠 Residencia" value={acta.padre.residencia} />
          </Section>
        )}

        {acta.declarante && (
          <Section title="🗣️ Declarante">
            <Field label="👤 Nombres" value={acta.declarante.nombres_apellidos} />
            <Field label="📋 Carácter" value={acta.declarante.caracter_actua} />
            <Field label="🆔 Cédula" value={acta.declarante.documento_identidad} />
            <Field label="🌍 Nacionalidad" value={acta.declarante.nacionalidad} />
            <Field label="💼 Profesión" value={acta.declarante.profesion_ocupacion} />
            <Field label="🏠 Residencia" value={acta.declarante.residencia} />
          </Section>
        )}
      </div>

      {acta.certificado && (
        <Section title="🏥 Certificado Médico">
          <Field label="🏥 Centro Salud" value={acta.certificado.nombre_centro_salud} />
          <Field label="🆔 N° MPPS" value={acta.certificado.numero_mpps} />
          <Field label="📄 Certificado N°" value={acta.certificado.numero_certificado} />
          <Field label="📅 Fecha Exp." value={acta.certificado ? `${acta.certificado.dia_expedicion}/${acta.certificado.mes_expedicion}/${acta.certificado.anio_expedicion}` : ''} />
        </Section>
      )}

      {acta.testigos && acta.testigos.length > 0 && (
        <Section title="👥 Testigos">
          {acta.testigos.map((t, i) => (
            <div key={t.id} className="pb-2 mb-2 border-b border-slate-700/50 last:border-0 last:pb-0 last:mb-0">
              <Field label={`👤 Testigo ${i + 1}`} value={t.nombres_apellidos} />
              <Field label="🆔 Cédula" value={t.cedula_identidad} />
              <Field label="🌍 Nacionalidad" value={t.nacionalidad} />
            </div>
          ))}
        </Section>
      )}

      <div className="flex gap-3">
        <button
          onClick={handlePreview}
          disabled={previewLoading}
          className="flex-1 py-2.5 bg-slate-600 hover:bg-slate-500 text-white font-medium rounded-lg transition cursor-pointer text-sm disabled:opacity-50"
        >
          {previewLoading ? 'Cargando...' : 'Vista Previa'}
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition cursor-pointer text-sm"
        >
          Descargar PDF
        </button>
      </div>

      {showPreview && (
        <div className="fixed inset-0 bg-black/90 flex flex-col z-50" style={{top: 0}}>
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 shrink-0">
            <h3 className="text-sm font-semibold text-white">Vista Previa - Acta N° {acta.numero_acta}</h3>
            <div className="flex items-center gap-2">
              <button onClick={handlePreviewExternal} className="text-xs text-emerald-400 hover:text-emerald-300 px-2 py-1">
                Abrir en navegador
              </button>
              <button onClick={closePreview} className="p-2 text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden bg-slate-200">
            {previewLoading && (
              <div className="flex items-center justify-center h-full bg-slate-900">
                <div className="text-center">
                  <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm text-slate-400">Cargando PDF...</p>
                </div>
              </div>
            )}
            {previewBlobUrl && (
              <PdfViewer url={previewBlobUrl} onLoad={() => setPreviewLoading(false)} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
