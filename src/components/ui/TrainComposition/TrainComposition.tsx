import { createPortal } from 'react-dom';
import { ExternalLink, Loader2, X, LayoutGrid } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import type { Leg } from '../../../lib/types';
import { getFallbackCompositionSections } from '../../../lib/trainLayoutFallbacks';

import { useVagonWeb } from '../../../lib/useVagonWeb';
import { FallbackComposition } from './FallbackComposition';
import { CarriageViewer } from '../CarriageViewer';
import { SeatingAdvice } from './SeatingAdvice';

interface Props {
  leg: Leg;
  onClose?: () => void;
  badge?: string;
}

export default function TrainComposition({ leg, onClose, badge }: Props) {
  const { t, i18n } = useTranslation();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const trainName = leg.line?.name ?? t('composition.trains.train', 'Zug');
  
  const vagonWeb = useVagonWeb(leg, i18n.language, trainName, iframeRef);
  
  const sections = getFallbackCompositionSections(leg, t);
  const exampleGross = sections.flatMap(s => s.carriages).find(c => c.isDogFriendly && c.dogSeats?.length);
  //const advice = getDogSeatingAdvice(leg, t); 
  // TODO: In Zukunft vielleicht auch wieder spezifischere Tipps je nach Zugtyp, z.B. ICE vs Regionalbahn etc.

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

  const DynamicTitle = () => {
    if (vagonWeb.status === 'found') {
      return (
        <div className="flex items-center gap-2 px-1.5">
          <span className="text-base font-bold text-slate-800">{t('composition.ui.typical', 'Wagenreihung')}</span>
          <span className={`font-bold uppercase tracking-wider px-1.5 py-0.5 rounded text-[12px] ${badge}`}>
            {trainName}
          </span>
        </div>
      );
    }
    return (
      <span className="text-base font-bold text-slate-800 px-1.5" onClick={() => {console.log(leg);}}>
        Beispielhafte Wagenreihung
      </span>
    );
  };

  const modalContent = (
    <>
      <div className="flex-none flex items-center justify-between pb-3">
        <DynamicTitle />
        
        <div className="flex items-center gap-2">
          {vagonWeb.status === 'found' && vagonWeb.firstAvailableLayout !== -1 && (
            <button 
              onClick={() => vagonWeb.openIndex(vagonWeb.firstAvailableLayout)} 
              className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-primary/20 transition-colors"
            >
              <LayoutGrid size={18} /> {t('composition.ui.interactiveMap', 'Sitzpläne')}
            </button>
          )}
          {isMobile && (
            <button onClick={onClose} className="p-2 bg-primary/10 hover:bg-primary/20 rounded-full text-primary transition-colors shrink-0">
              <X size={24} />
            </button>
          )}
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto max-md:-webkit-overflow-scrolling-touch space-y-3`}>
        
        {vagonWeb.status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-10 space-y-3">
            <Loader2 size={24} className="animate-spin text-primary" />
            <span className="text-xs font-semibold text-slate-500">{t('composition.ui.loadingLive', 'Lade echte Wagenreihung...')}</span>
          </div>
        )}

        {vagonWeb.status === 'found' && vagonWeb.directUrl && (
          <div className="shrink-0 space-y-2">
            <iframe 
              ref={iframeRef}
              src={vagonWeb.directUrl} 
              className="w-full h-[150px] object-contain block rounded-2xl" 
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        
        )}

        {vagonWeb.isPopupOpen && (
          <div className='space-y-3'>
            <CarriageViewer 
              url={vagonWeb.activeUrlToRender!}
              title={vagonWeb.activeTitleToRender!}
              hasPrev={vagonWeb.hasPrev}
              hasNext={vagonWeb.hasNext}
              onPrev={vagonWeb.handlePrev}
              onNext={vagonWeb.handleNext}
              onClose={vagonWeb.closePopup}
            />
            <SeatingAdvice exampleGross={exampleGross} t={t} />
          </div>
        )}

        {vagonWeb.status === 'not-found' && (
          <div className="shrink-0">
            <FallbackComposition sections={sections} />
            <SeatingAdvice exampleGross={exampleGross} t={t} />
          </div>
        )}
        
        {vagonWeb.status === 'not-found' && (
          <p className="text-[10px] text-slate-400 leading-snug shrink-0 pb-4 md:pb-0">
            {t('composition.ui.exampleNote', 'Beispiel-Konfiguration — Vor Einsteigen Gleisanzeiger prüfen.')}
          </p>
        )}
      </div>
     {vagonWeb.status === 'found' && vagonWeb.directUrl && (
      <div className="text-right mt-0 space-y-0">
        <a 
          href={vagonWeb.directUrl} 
          target="_blank" 
          rel="noreferrer" 
          className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 hover:text-primary transition-colors"
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
    <div className="md:bg-white md:block animate-in fade-in">
      {modalContent}
    </div>
  );
}