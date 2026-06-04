import { createPortal } from 'react-dom';
import { ExternalLink, Loader2, X, Eye, PawPrint, Armchair } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import type { Leg } from '../../lib/types';
import { getFallbackCompositionSections, getDogSeatingAdvice } from '../../lib/trainLayoutFallbacks';

import { useVagonWeb } from '../../lib/useVagonWeb';
import { FallbackComposition } from './FallbackComposition';
import { CarriageViewer } from './CarriageViewer';

interface Props {
  leg: Leg;
  onClose?: () => void;
  badge?: string;
}

export default function TrainComposition({ leg, onClose, badge }: Props) {
  const { t, i18n } = useTranslation();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const trainName = leg.line?.name ?? t('composition.trains.train', 'Zug');
  const trainCategory = trainName.match(/^([A-Za-z]+)/)?.[1]?.toUpperCase() || 'ZUG';
  
  const vagonWeb = useVagonWeb(leg, i18n.language, trainName, iframeRef);
  
  const sections = getFallbackCompositionSections(leg, t);
  const exampleGross = sections.flatMap(s => s.carriages).find(c => c.isDogFriendly && c.dogSeats?.length);
  const advice = getDogSeatingAdvice(leg, t);

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
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-slate-800">{t('composition.ui.typical', 'Wagenreihung')}</span>
          <span className={`font-bold uppercase tracking-wider px-1.5 py-0.5 rounded text-[12px] ${badge}`}>
            {trainName}
          </span>
        </div>
      );
    }
    return (
      <span className="text-base font-bold text-slate-800">
        Beispielhafte Wagenreihung — {trainCategory}
      </span>
    );
  };

  const modalContent = (
    <>
      <div className="flex-none flex items-center justify-between p-4 pb-3 border-b border-slate-100">
        <DynamicTitle />
        
        <div className="flex items-center gap-2">
          {vagonWeb.status === 'found' && vagonWeb.firstAvailableLayout !== -1 && (
            <button 
              onClick={() => vagonWeb.openIndex(vagonWeb.firstAvailableLayout)} 
              className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-primary/20 transition-colors"
            >
              <Eye size={14} /> {t('composition.ui.interactiveMap', 'Sitzpläne')}
            </button>
          )}
          {isMobile && (
            <button onClick={onClose} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 transition-colors shrink-0">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto max-md:-webkit-overflow-scrolling-touch p-4 space-y-6`}>
        
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

        <div className="text-right mt-0">
          <a 
            href={vagonWeb.directUrl} 
            target="_blank" 
            rel="noreferrer" 
            className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 hover:text-primary transition-colors"
          >
            Data by vagonWEB.cz <ExternalLink size={10} />
          </a>
        </div>

        {vagonWeb.status === 'not-found' && (
          <div className="shrink-0">
            <FallbackComposition sections={sections} exampleGross={exampleGross} t={t} />
          </div>
        )}

        {vagonWeb.status !== 'loading' && (
          <div className="text-sm shrink-0 max-md:mb-6 space-y-5">
            
            {vagonWeb.status === 'found' && (
              <div className="space-y-3">
                {/* <div className="flex items-center gap-1.5 font-bold text-slate-700">
                  <Armchair size={14} className="text-blue-500 shrink-0" />
                  <span>{t('composition.ui.interactiveMap', 'Interaktiver Sitzplan')}</span>
                </div> 
                <p className="text-slate-600 leading-relaxed">
                  {t('composition.ui.vagonwebExplanation', 'Hier siehst du die echten Wagennummern und Klassen. Klicke auf einen Wagon, um einen detaillierten Sitzplan zu sehen. Fenster und Sitze sind exakt eingezeichnet, so siehst du sofort, ob du rausschauen kannst!')}
                </p>
                */}
                <div className="p-3 bg-secondary/10 text-slate-700 rounded-lg flex gap-2 items-start">
                  <PawPrint size={16} className="fill-secondary text-secondary shrink-0 mt-0.5" />
                  <p>{t('composition.ui.vagonwebBestSeats', 'Tipp für Hunde: Rücken-an-Rücken-Plätze oder Sitze direkt an Gepäckablagen und Raumtrennern sind meistens die besten Optionen.')}</p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-1.5 font-bold text-slate-700">
                <Armchair size={16} className="text-primary shrink-0 mt-0.5" />
                <span>{t('composition.advice.title', 'Dog-First Sitzplatz-Empfehlung')}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
                <div><span className="font-semibold text-slate-700 block mb-0.5">{t('composition.advice.zone', 'Empfohlene Zone:')}</span>{advice.zone}</div>
                <div><span className="font-semibold text-slate-700 block mb-0.5">{t('composition.advice.seats', 'Beste Sitzanordnung:')}</span>{advice.seats}</div>
              </div>
              <div className="text-slate-500 text-[11px] leading-relaxed pt-2 border-t border-slate-50 border-dashed">
                <span className="font-semibold text-slate-600">{t('composition.advice.tip', 'Experten-Tipp:')} </span>{advice.tip}
              </div>
            </div>

          </div>
        )}
        
        {vagonWeb.status === 'not-found' && (
          <p className="text-[10px] text-slate-400 leading-snug shrink-0 pb-4 md:pb-0">
            {t('composition.ui.exampleNote', 'Beispiel-Konfiguration — Vor Einsteigen Gleisanzeiger prüfen.')}
          </p>
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
    <div className="md:mt-3 md:bg-white md:rounded-xl md:border md:border-slate-200 md:shadow-sm md:block animate-in fade-in">
      {modalContent}
    </div>
  );
}