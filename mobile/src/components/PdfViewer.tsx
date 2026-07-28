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

export default function PdfViewer({ url, onLoad }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');
  const renderingRef = useRef(false);

  useEffect(() => {
    if (!url || !containerRef.current) return;
    let cancelled = false;

    const render = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        if (cancelled) return;

        setTotalPages(pdf.numPages);
        onLoad?.();

        for (let i = 1; i <= pdf.numPages; i++) {
          if (cancelled || !containerRef.current) break;

          const page = await pdf.getPage(i);
          if (cancelled) break;

          const scale = 1.5;
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.width = '100%';
          canvas.style.height = 'auto';
          canvas.style.display = 'block';
          canvas.style.marginBottom = '8px';
          canvas.style.borderRadius = '4px';

          const ctx = canvas.getContext('2d');
          if (ctx) {
            await page.render({ canvasContext: ctx, viewport }).promise;
          }

          if (cancelled || !containerRef.current) break;
          containerRef.current.appendChild(canvas);
          setCurrentPage(i);
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message || 'Error al renderizar PDF');
      }
    };

    render();
    return () => { cancelled = true; };
  }, [url]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-400 text-sm p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-slate-200">
      {totalPages > 0 && (
        <div className="sticky top-0 bg-slate-800/90 text-white text-xs text-center py-1 z-10">
          Página {currentPage} de {totalPages}
        </div>
      )}
      <div ref={containerRef} className="p-2" />
    </div>
  );
}
