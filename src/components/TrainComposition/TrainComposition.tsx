import { createPortal } from 'react-dom';
import { ExternalLink, Loader2, X, LayoutGrid } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import type { Leg } from '../../lib/types';
import { getFallbackCompositionSections } from '../../lib/trainLayoutFallbacks';

import { useVagonWeb } from '../../lib/useVagonWeb';
import { FallbackComposition } from './FallbackComposition';
import { CarriageViewer } from './CarriageViewer';
import { SeatingAdvice } from './SeatingAdvice';

interface Props {
  leg: Leg;
  onClose?: () => void;
  badge?: string;
}

export default function TrainComposition({ leg, onClose, badge = "bg-red-600 text-white shadow-sm" }: Props) {
  const { t, i18n } = useTranslation();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const trainName = leg.line?.name ?? t('composition.trains.train', 'Zug');
  
  const vagonWeb = useVagonWeb(leg, i18n.language, trainName, iframeRef);
  
  const sections = getFallbackCompositionSections(leg, t);
  const exampleGross = sections.flatMap(s => s.carriages).find(c => c.isDogFriendly && c.dogSeats?.length);

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

  const buildFallbackUrl = () => {
    if ((vagonWeb as any).fallbackUrl) return (vagonWeb as any).fallbackUrl;
    
    const year = new Date(leg.departure || Date.now()).getFullYear();
    const match = leg.line?.name?.match(/([a-zA-Z]+)\s*(\d+)/);
    const type = match ? match[1] : (leg.line?.product || 'ICE');
    const num = match ? match[2] : '';
    return `https://www.vagonweb.cz/razeni/vlak.php?zeme=DB&kategorie=${type}&cislo=${num}&rok=${year}&lang=${i18n.language}`;
  };

  // SMARTE LOGIK: Zeige den Link nur, wenn Cloudflare geblockt hat ODER (als Backup) wenn es sich um Fernverkehr handelt
  const isFernverkehr = ['ice', 'ic', 'ec', 'night'].includes(leg.line?.product?.toLowerCase() || '') || /ICE|IC|EC|RJ|TGV|NJ|EN/.test(trainName);
  const shouldShowFallbackLink = (vagonWeb as any).isBlocked || ((vagonWeb as any).isBlocked === undefined && isFernverkehr);

  const DynamicTitle = () => {
    if (vagonWeb.status === 'found') {
      if (vagonWeb.isPopupOpen && vagonWeb.activeTitleToRender) {
        const wagenName = vagonWeb.activeTitleToRender.split(/[-—]/)[0].trim();
        return (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-base font-bold text-slate-800">{wagenName}</span>
            <span className={`font-bold uppercase tracking-wider px-1.5 py-0.5 rounded text-[12px] ${badge}`}>
              {trainName}
            </span>
          </div>
        );
      }
      
      return (
        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-300">
          <span className="text-base font-bold text-slate-800">{t('composition.ui.composition', 'Wagenreihung')}</span>
          <span className={`font-bold uppercase tracking-wider px-1.5 py-0.5 rounded text-[12px] ${badge}`}>
            {trainName}
          </span>
        </div>
      );
    }

    return (
      <span className="text-base font-bold text-slate-800">
        {t('composition.ui.exampleComposition', 'Beispielhafte Wagenreihung')}
      </span>
    );
  };

  const modalContent = (
    <>
      {isMobile && (
        <div className={`pl-2 flex items-center justify-between w-full ${isMobile ? 'pb-4' : ' mb-4'}`}>
          <DynamicTitle />
          <button 
            onClick={onClose} 
            className={`flex-none p-2 rounded-full transition-colors shrink-0 bg-primary/10 hover:bg-primary/20 text-primary`}
            aria-label="Schließen"
          >
            <X size={isMobile ? 24 : 20} strokeWidth={2.5} />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto max-md:-webkit-overflow-scrolling-touch pr-1">
        
        {vagonWeb.status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-10 space-y-3">
            <Loader2 size={24} className="animate-spin text-primary" />
            <span className="text-xs font-semibold text-slate-500">{t('composition.ui.loadingLive', 'Lade echte Wagenreihung...')}</span>
          </div>
        )}

        {vagonWeb.status === 'found' && vagonWeb.directUrl && (
          <div className="shrink-0 relative mb-4">
            <iframe 
              ref={iframeRef}
              src={vagonWeb.directUrl} 
              className="w-full h-[150px] object-contain block rounded-2xl" 
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        )}

        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${vagonWeb.isPopupOpen ? 'max-h-0 opacity-0' : 'max-h-[60px] opacity-100'}`}>
          {vagonWeb.status === 'found' && vagonWeb.firstAvailableLayout !== -1 && (
            <button 
              onClick={() => vagonWeb.openIndex(vagonWeb.firstAvailableLayout)} 
              className="flex w-full sm:w-auto sm:inline-flex items-center justify-center gap-1.5 py-2 px-4 bg-primary hover:bg-secondary text-white font-semibold rounded-full transition-all active:scale-[0.98] hover:shadow-primary/30 font-heading"
            >
              <LayoutGrid size={18} className="inline mr-1.5 sm:mr-0" /> 
              {t('composition.ui.openSeatMap')}
            </button>
          )}
          {vagonWeb.status === 'found' && vagonWeb.firstAvailableLayout == -1 && (
            <p className="text-sm text-slate-500 italic px-2 mb-4">
              {t('composition.ui.checkAtOperator')}
            </p>
          )}
        </div>

        {vagonWeb.isPopupOpen && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <CarriageViewer 
              url={vagonWeb.activeUrlToRender!}
              title={vagonWeb.activeTitleToRender!}
              hasPrev={vagonWeb.hasPrev}
              hasNext={vagonWeb.hasNext}
              onPrev={vagonWeb.handlePrev}
              onNext={vagonWeb.handleNext}
              onClose={vagonWeb.closePopup}
            />
          </div>
        )}

        {vagonWeb.status === 'not-found' && (
          <div className="shrink-0 space-y-4">
            <FallbackComposition sections={sections}/>
            
            {/* Conditional Rendering basierend auf der smarte Logik */}
            {shouldShowFallbackLink && (
              <div className="pt-2">
                <a 
                  href={buildFallbackUrl()} 
                  target="_blank"
                  rel="noreferrer"
                  // FIX: "flex" statt "block" sorgt für perfektes Zentrieren auf Mobile
                  className="flex w-full sm:w-auto sm:inline-flex items-center justify-center gap-1.5 py-2 px-4 bg-primary hover:bg-secondary text-white font-semibold rounded-full transition-all active:scale-[0.98] hover:shadow-primary/30 font-heading"
                >
                  <ExternalLink size={18} className="inline mr-1.5 sm:mr-0" /> 
                  {t('composition.ui.openSeatMap', 'Sitzplan öffnen')}
                </a>
              </div>
            )}
          </div>
        )}

        <SeatingAdvice exampleGross={exampleGross} t={t} />
        
        {vagonWeb.status === 'not-found' && (
          <p className="text-[10px] text-slate-400 leading-snug shrink-0 pt-4 pb-4 md:pb-0">
            {t('composition.ui.exampleNote', 'Beispiel-Konfiguration — Vor Einsteigen Gleisanzeiger prüfen.')}
          </p>
        )}
      </div>

      {vagonWeb.status === 'found' && vagonWeb.directUrl && (
        <div className="text-right mt-2">
          <a 
            href={vagonWeb.directUrl} 
            target="_blank" 
            rel="noreferrer" 
            className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 hover:text-primary transition-colors"
          >
            Data by vagonWEB.cz <ExternalLink size={10} />
          </a>
        </div>
      )}
    </>
  );

  if (!mounted) return null;

  if (isMobile) {
    return createPortal(
      <div className="p-4 fixed inset-0 z-[999999] bg-white flex flex-col w-screen h-[100dvh] overflow-hidden animate-in fade-in slide-in-from-bottom-4">
        {modalContent}
      </div>,
      document.body
    );
  }

  return (
    <div className="md:bg-white md:rounded-2xl md:block animate-in fade-in">
      {modalContent}
    </div>
  );
}