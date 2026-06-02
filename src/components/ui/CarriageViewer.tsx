import { useState, useEffect } from 'react';
import { Loader2, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface Props {
  url: string;
  title: string;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}

export function CarriageViewer({ url, title, hasPrev, hasNext, onPrev, onNext, onClose }: Props) {
  const [isLoading, setIsLoading] = useState(true);

  // Reset loading state when URL changes
  useEffect(() => { setIsLoading(true); }, [url]);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-md shrink-0 animate-in fade-in slide-in-from-top-2 relative">
      <div className="bg-slate-100 px-3 py-2 flex items-center justify-between border-b border-slate-200 z-20 relative">
        {hasPrev || hasNext ? (
          <button onClick={onPrev} disabled={!hasPrev} className="p-1 hover:bg-slate-200 rounded-lg text-slate-600 disabled:opacity-30 transition-colors">
            <ChevronLeft size={18} />
          </button>
        ) : <div className="w-7" />}

        <span className="text-sm font-bold text-slate-800 text-center flex-1 truncate px-2">{title}</span>

        <div className="flex items-center gap-1">
          {hasPrev || hasNext ? (
            <>
              <button onClick={onNext} disabled={!hasNext} className="p-1 hover:bg-slate-200 rounded-lg text-slate-600 disabled:opacity-30 transition-colors">
                <ChevronRight size={18} />
              </button>
              <div className="w-px h-4 bg-slate-300 mx-1" />
            </>
          ) : null}
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>
      
      {isLoading && (
        <div className="absolute inset-0 top-[40px] z-10 flex flex-col items-center justify-center bg-white bg-opacity-90">
          <Loader2 size={28} className="animate-spin text-primary" />
          <span className="text-xs font-semibold text-slate-500 mt-2">Lade Sitzplan...</span>
        </div>
      )}

      <iframe 
        src={url} 
        className="w-full h-[300px] bg-white block relative z-0" 
        title="Layout Details"
        onLoad={(e) => {
          setIsLoading(false);
          try {
            const iframe = e.target as HTMLIFrameElement;
            const doc = iframe.contentDocument || iframe.contentWindow?.document;
            const img = doc?.querySelector('img.mapa_sedadel') || doc?.querySelector('img[src*="mapa_sedadel"]') as HTMLImageElement;
            if (img && doc) {
              doc.head.innerHTML = '';
              doc.body.innerHTML = `
                <style>
                  html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; width: 100%; height: 100%; overflow: hidden !important; }
                  .scroll-container { width: 100%; height: 100%; overflow-x: auto; overflow-y: hidden; -webkit-overflow-scrolling: touch; }
                  .scroll-container::-webkit-scrollbar { height: 10px; }
                  .scroll-container::-webkit-scrollbar-track { background: #f8fafc; border-top: 1px solid #e2e8f0; }
                  .scroll-container::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
                  .scroll-container::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
                  .img-wrapper { display: flex; align-items: center; min-width: max-content; height: 100%; padding: 0 20px; box-sizing: border-box; }
                  img { display: block; height: 250px; width: auto; max-width: none !important; margin: 0; border-radius: 4px; }
                </style>
                <div class="scroll-container"><div class="img-wrapper"><img src="${img.src}" alt="Sitzplan"></div></div>
              `;
            }
          } catch (err) { console.log('Cross-origin restriction'); }
        }}
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}