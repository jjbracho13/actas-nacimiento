import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

interface Props {
  url: string;
  onLoad?: () => void;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.5;
const BASE_SCALE = 1.5;

export default function PdfViewer({ url, onLoad }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState('');
  const [pinning, setPinning] = useState(false);
  const cancelledRef = useRef(false);
  const pinchRef = useRef<{ startDist: number; startZoom: number } | null>(null);
  const lastTapRef = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      pinchRef.current = { startDist: dist, startZoom: zoom };
      setPinning(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length !== 2 || !pinchRef.current) return;
    const { startDist, startZoom } = pinchRef.current;
    if (startDist === 0) return;
    const dist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, +(startZoom * (dist / startDist)).toFixed(2)));
    setZoom((z) => (Math.abs(next - z) >= 0.05 ? next : z));
  };

  const handleTouchEnd = () => {
    const wasPinch = pinchRef.current !== null;
    pinchRef.current = null;
    setPinning(false);
    if (wasPinch) return;
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      setZoom((z) => (z > 1.25 ? 1 : 1.75));
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  };

  useEffect(() => {
    if (!url || !containerRef.current) return;
    cancelledRef.current = false;
    const cancelled = () => cancelledRef.current;

    const render = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        if (cancelled()) return;

        setTotalPages(pdf.numPages);
        onLoad?.();

        const scale = BASE_SCALE * zoom;
        containerRef.current!.innerHTML = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          if (cancelled() || !containerRef.current) break;

          const page = await pdf.getPage(i);
          if (cancelled()) break;

          const viewport = page.getViewport({ scale });

          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.width = '100%';
          canvas.style.height = 'auto';
          canvas.style.display = 'block';
          canvas.style.marginBottom = '8px';
          canvas.style.borderRadius = '4px';
          canvas.style.background = 'white';

          const ctx = canvas.getContext('2d');
          if (ctx) {
            await page.render({ canvasContext: ctx, viewport }).promise;
          }

          if (cancelled() || !containerRef.current) break;
          containerRef.current.appendChild(canvas);
          setCurrentPage(i);
        }
      } catch (err: any) {
        if (!cancelled()) setError(err.message || 'Error al renderizar PDF');
      }
    };

    render();
    return () => { cancelledRef.current = true; };
  }, [url, zoom]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-400 text-sm p-4">
        {error}
      </div>
    );
  }

  return (
    <div
      className="h-full overflow-auto bg-slate-200"
      style={{ touchAction: pinning ? 'none' : 'pan-x pan-y' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div className="sticky top-0 bg-slate-800/90 text-white text-xs text-center py-1 z-10 flex items-center justify-center gap-4">
        <span>Página {currentPage} de {totalPages}</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom((z) => Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(2)))}
            className="w-7 h-7 rounded bg-slate-700 hover:bg-slate-600 text-white font-bold cursor-pointer"
            aria-label="Alejar"
          >−</button>
          <span className="w-12 text-center font-mono">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(2)))}
            className="w-7 h-7 rounded bg-slate-700 hover:bg-slate-600 text-white font-bold cursor-pointer"
            aria-label="Acercar"
          >+</button>
          <button
            onClick={() => setZoom(1)}
            className="w-7 h-7 rounded bg-slate-700 hover:bg-slate-600 text-white text-xs cursor-pointer"
            aria-label="Restablecer zoom"
          >100%</button>
        </div>
      </div>
      <div ref={containerRef} className="p-2" style={{ width: `${zoom * 100}%` }} />
    </div>
  );
}
