import { createPortal } from 'react-dom';
import { LayoutGrid, Info, ExternalLink, Loader2, X, Eye, PawPrint, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import { abbreviateStationName } from '../../lib/helpers';
import type { Leg } from '../../lib/types';
import { getFallbackCompositionSections, getDogSeatingAdvice } from '../../lib/trainLayoutFallbacks';

// Importiere unsere neuen, sauberen Komponenten und den Hook
import { useVagonWeb } from '../../lib/useVagonWeb';
import { FallbackComposition } from './FallbackComposition';
import { CarriageViewer } from './CarriageViewer';

interface Props {
  leg: Leg;
  onClose?: () => void;
}

export default function TrainComposition({ leg, onClose }: Props) {
  const { t, i18n } = useTranslation();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const trainName = leg.line?.name ?? t('composition.trains.train', 'Zug');
  
  // Custom Hook regelt die komplette VagonWeb-Logik!
  const vagonWeb = useVagonWeb(leg, i18n.language, trainName, iframeRef);
  
  // Statische Fallback-Daten
  const sections = getFallbackCompositionSections(leg, t);
  const exampleGross = sections.flatMap(s => s.carriages).find(c => c.isDogFriendly && c.dogSeats?.length);
  const advice = getDogSeatingAdvice(leg, t);

  // Responsive & Modal State
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    setIsMobile(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (isMobile && mounted) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isMobile, mounted]);

  const modalContent = (
    <>
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex-none flex items-center justify-between p-4 border-b border-slate-100 bg-white shadow-sm z-50">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <LayoutGrid size={18} className="text-primary" />
            <span>{t('composition.ui.typical')}</span>
          </div>
          <button onClick={onClose} className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 transition-colors">
            <X size={20} />
          </button>
        </div>
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 pb-0 text-xs font-semibold text-slate-600 tracking-wide">
          <div className="flex items-center gap-2 min-w-0">
            <LayoutGrid size={14} className="shrink-0" />
            <span>{t('composition.ui.typical')}</span>
            <span className="text-slate-500 font-medium truncate">
              {trainName}{leg.direction ? ` — ${abbreviateStationName(leg.direction)}` : ''}
            </span>
          </div>
        </div>
      )}

      <div className={`flex-1 overflow-y-auto max-md:-webkit-overflow-scrolling-touch ${isMobile ? 'p-4 space-y-4' : 'p-3 pt-3 space-y-3'}`}>
        
        {/* Loading State */}
        {vagonWeb.status === 'loading' && (
          <div className="flex flex-col items-center justify-center p-8 bg-white border border-slate-200 rounded-xl shadow-sm space-y-3">
            <Loader2 size={24} className="animate-spin text-primary" />
            <span className="text-xs font-semibold text-slate-500">{t('composition.ui.loadingLive')}</span>
          </div>
        )}

        {/* Echte Wagenreihung (Overview) */}
        {vagonWeb.status === 'found' && vagonWeb.directUrl && (
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm shrink-0">
            <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-700">{t('composition.ui.realComposition')}</span>
              <div className="flex items-center gap-3">
                {vagonWeb.firstAvailableLayout !== -1 && (
                  <button 
                    onClick={() => vagonWeb.openIndex(vagonWeb.firstAvailableLayout)} 
                    className="flex items-center gap-1.5 bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    <Eye size={14} /> {t('composition.ui.interactiveMap')}
                  </button>
                )}
                <a href={vagonWeb.directUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline text-[10px] flex items-center gap-1 hidden sm:flex">
                  {t('composition.ui.fullscreen')} <ExternalLink size={10} />
                </a>
              </div>
            </div>
            
            <iframe 
              ref={iframeRef}
              src={vagonWeb.directUrl} 
              className="w-full h-[150px] object-contain bg-white block" 
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        )}

        {/* Detail Layout Viewer */}
        {vagonWeb.isPopupOpen && (
          <CarriageViewer 
            url={vagonWeb.activeUrlToRender!}
            title={vagonWeb.activeTitleToRender!}
            hasPrev={vagonWeb.hasPrev}
            hasNext={vagonWeb.hasNext}
            onPrev={vagonWeb.handlePrev}
            onNext={vagonWeb.handleNext}
            onClose={vagonWeb.closePopup}
          />
        )}

        {/* Fallbacks */}
        {vagonWeb.status === 'not-found' && (
          <FallbackComposition sections={sections} exampleGross={exampleGross} t={t} />
        )}

        {/* Dog Advice & Tips Box */}
        {vagonWeb.status !== 'loading' && (
          <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-3 text-xs shrink-0 max-md:mb-6">
            {vagonWeb.status === 'found' && (
              <div className="pb-3 border-b border-slate-100">
                <div className="flex items-center gap-1.5 font-bold text-slate-700 mb-2">
                  <Info size={14} className="text-blue-500 shrink-0" />
                  <span>{t('composition.ui.interactiveMap')}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{t('composition.ui.vagonwebExplanation')}</p>
                <div className="mt-3 p-2.5 bg-blue-50 border border-blue-100 text-blue-800 rounded-lg flex gap-2">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <p>{t('composition.ui.vagonwebBestSeats')}</p>
                </div>
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5 font-bold text-slate-700 mb-2">
                <PawPrint size={14} className="text-primary shrink-0" />
                <span>{t('composition.advice.title')}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 font-body">
                <div><span className="font-semibold text-slate-700 block">{t('composition.advice.zone')}</span>{advice.zone}</div>
                <div><span className="font-semibold text-slate-700 block">{t('composition.advice.seats')}</span>{advice.seats}</div>
              </div>
              <div className="text-slate-500 text-[11px] leading-relaxed pt-2 mt-2 border-t border-slate-100 font-body">
                <span className="font-semibold text-slate-600">{t('composition.advice.tip')} </span>{advice.tip}
              </div>
            </div>
          </div>
        )}
        
        {vagonWeb.status === 'not-found' && (
          <p className="text-[10px] text-slate-400 leading-snug font-body shrink-0 pb-4 md:pb-0">{t('composition.ui.exampleNote')}</p>
        )}
      </div>
    </>
  );

  if (!mounted) return null;

  if (isMobile) {
    return createPortal(
      <div className="fixed inset-0 z-[999999] bg-white flex flex-col w-screen h-[100dvh] overflow-hidden animate-in fade-in slide-in-from-bottom-4">
        {modalContent}
      </div>,
      document.body
    );
  }

  return (
    <div className="md:mt-3 md:bg-slate-50 md:rounded-xl md:border md:border-slate-200 md:block animate-in fade-in">
      {modalContent}
    </div>
  );
}