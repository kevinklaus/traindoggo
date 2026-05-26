import { createPortal } from 'react-dom';
import { LayoutGrid, PawPrint, Info, ExternalLink, Loader2, X, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { useState, useEffect } from 'react';
import { abbreviateStationName } from '../../lib/helpers';
import type { Leg } from '../../lib/types';
import { CarriageDef, getFallbackCompositionSections, getDogSeatingAdvice } from '../../lib/trainLayoutFallbacks';

function buildVagonWebParams(leg: Leg, currentLang: string) {
  const rawName = leg.line?.name || '';
  const lowerName = rawName.toLowerCase();
  
  let fahrtNr = (leg.line as any)?.fahrtNr;
  if (!fahrtNr) {
    const matches = rawName.match(/\d+/);
    fahrtNr = matches ? matches[0] : '';
  }

  const currentYear = new Date().getFullYear();
  const langCode = currentLang.slice(0, 2).toLowerCase();
  const admin = (leg.line as any)?.admin || '';
  const UIC_TO_ZEME: Record<string, string> = {
    '80': 'DB', '81': 'ÖBB', '84': 'NS', '85': 'SBB', 
    '87': 'SNCF', '54': 'ČD', '51': 'PKP', '83': 'FS', 
    '88': 'SNCB', '71': 'RENFE'
  };

  let zeme = 'DB';
  if (admin && admin.length >= 2) {
    const uic = admin.substring(0, 2);
    if (UIC_TO_ZEME[uic]) zeme = UIC_TO_ZEME[uic];
  }

  const opLower = `${(leg.line?.operator?.id || '').toLowerCase()} ${(leg.line?.operator?.name || '').toLowerCase()}`;
  if (opLower.includes('odeg') || opLower.includes('flixtrain') || opLower.includes('agilis') || opLower.includes('go-ahead') || opLower.includes('national express')) {
    zeme = 'D-';
  }

  let kategorie = '';
  let nazev = '';
  const specialName = (leg as any).remarks?.find((r: any) => r.code === 'train-name')?.text || '';

  if (lowerName.includes('european sleeper') || opLower.includes('european-sleeper')) {
    zeme = 'D-'; nazev = 'European Sleeper';
  } else if (lowerName.includes('eurocity direct') || lowerName.startsWith('ecd') || opLower.includes('ns ') || opLower === 'ns') {
    zeme = 'NS'; kategorie = 'ECD'; nazev = 'Eurocity Direct';
  } else if (specialName === 'Canopus') {
    zeme = 'ČD'; kategorie = 'EN'; nazev = 'Canopus';
  } else {
    const match = rawName.match(/^([A-Za-z]+)\s*(.*)/);
    if (match) {
      const prefix = match[1].toUpperCase();
      if (['RE', 'RB', 'MEX', 'IRE', 'FEX', 'S'].includes(prefix) || (leg.line?.product || '').toLowerCase().includes('regional')) {
        kategorie = prefix; nazev = rawName.replace(/\s+/g, '');
      } else {
        if (zeme !== 'DB') kategorie = prefix;
        if (specialName) nazev = specialName;
      }
    }
  }

  const params = new URLSearchParams();
  params.append('zeme', zeme);
  if (kategorie) params.append('kategorie', kategorie);
  if (fahrtNr) params.append('cislo', fahrtNr);
  if (nazev) params.append('nazev', nazev);
  params.append('rok', currentYear.toString());
  params.append('lang', langCode);

  return params.toString();
}

function CarriageChip({ c, sectionIdx, carIdx }: { c: CarriageDef; sectionIdx: number; carIdx: number }) {
  const themes: Record<string, string> = {
    'bistro': 'bg-primary/5 border-primary/35 text-primary',
    'loco': 'bg-slate-200 border-slate-400 text-slate-600',
    'familie': 'bg-indigo-50/50 border-indigo-200 text-indigo-700',
    'abteil': 'bg-slate-50 border-slate-200 text-slate-400 line-through decoration-slate-300'
  };

  const themeClass = c.type.startsWith('1st') 
    ? 'bg-amber-50 border-amber-300 text-amber-800' 
    : themes[c.type] || (c.type === 'mehrzweck' ? 'bg-sky-50 border-sky-300 text-sky-800' : 'bg-emerald-50 border-emerald-400 text-emerald-900');

  return (
    <div key={`${sectionIdx}-${carIdx}`} className={`shrink-0 min-w-[3.75rem] max-w-[5.2rem] min-h-[2.5rem] px-1 py-1 rounded-xl flex flex-col items-center justify-center text-[10px] leading-tight font-semibold border-2 relative select-none ${themeClass}`}>
      {c.carriageNumber && <span className="text-[9px] opacity-60 block -mt-0.5 font-mono">#{c.carriageNumber}</span>}
      <span>{c.shortLabel}</span>
      {c.isDogFriendly && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white border border-accent/40 text-accent shadow-sm">
          <PawPrint size={10} strokeWidth={2.5} />
        </span>
      )}
    </div>
  );
}

function DogSeatMap({ carriage, t }: { carriage: CarriageDef; t: TFunction }) {
  if (!carriage.grossraum || !carriage.dogSeats) return null;
  return (
    <div className="mt-2 p-2 bg-white rounded-lg border border-slate-200 shrink-0">
      <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-600 mb-1.5">
        <PawPrint size={10} className="text-accent shrink-0" />
        <span>{t('composition.ui.dogFriendly', 'Hundefreundlicher Sitzplan (Beispiel)')}</span>
      </div>
      <div className="grid grid-cols-8 gap-1">
        {Array.from({ length: 16 }, (_, idx) => idx + 1).map((seat) => {
          const isDog = carriage.dogSeats!.includes(seat);
          return (
            <div key={seat} className={`w-6 h-5 rounded text-[9px] flex items-center justify-center font-medium select-none ${isDog ? 'bg-accent/15 text-accent border border-accent/35 font-bold' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
              {isDog ? <PawPrint size={8} /> : seat}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TrainComposition({ leg }: { leg: Leg }) {
  const { t, i18n } = useTranslation();
  const trainName = leg.line?.name ?? t('composition.trains.train', 'Zug');
  const sections = getFallbackCompositionSections(leg, t);
  const exampleGross = sections.flatMap(s => s.carriages).find(c => c.isDogFriendly && c.dogSeats?.length);
  const advice = getDogSeatingAdvice(leg, t);

  const [vagonStatus, setVagonStatus] = useState<'idle' | 'loading' | 'found' | 'not-found'>('idle');
  const [directUrl, setDirectUrl] = useState<string | null>(null);
  const [popupUrl, setPopupUrl] = useState<string | null>(null);
  const [popupTitle, setPopupTitle] = useState<string | null>(null);
  const [isClosed, setIsClosed] = useState(false);
  
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

  // Setzt den dynamischen, unformatierten Titel (z.B. "Wagen 22 — ICE 9590")
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'OPEN_MODAL' && e.data.url) {
        setPopupUrl(`/api/vagonwebProxy?proxyTarget=${encodeURIComponent(e.data.url)}&render=true&isPopup=true`);
        
        const carText = e.data.carNum ? `${t('composition.ui.carriage', 'Wagen')} ${e.data.carNum}` : t('composition.ui.layoutDetails', 'Sitzplan');
        setPopupTitle(`${carText} — ${trainName}`);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [trainName, t]);

  useEffect(() => {
    async function checkVagonWeb() {
      setVagonStatus('loading');
      try {
        const res = await fetch(`/api/vagonwebProxy?${buildVagonWebParams(leg, i18n.language)}`);
        if (!res.ok) throw new Error('API Error');
        const data = await res.json();
        if (data.exists && data.directUrl) {
          setDirectUrl(data.directUrl);
          setVagonStatus('found');
        } else {
          setVagonStatus('not-found');
        }
      } catch {
        setVagonStatus('not-found');
      }
    }
    checkVagonWeb();
  }, [leg, i18n.language]);

  useEffect(() => {
    if (isMobile && !isClosed && mounted) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobile, isClosed, mounted]);

  if (isClosed) {
    return (
      <div className="mt-3">
        <button 
          onClick={() => setIsClosed(false)} 
          className="flex items-center justify-center gap-2 text-sm text-primary font-semibold bg-primary/5 hover:bg-primary/15 border border-primary/20 px-3 py-2.5 rounded-xl transition-colors w-full"
        >
          <LayoutGrid size={16} />
          <span>{t('composition.ui.reopenModal', 'Wagenreihung anzeigen')}</span>
        </button>
      </div>
    );
  }

  const modalContent = (
    <>
      {/* Mobile Modal Header */}
      {isMobile && (
        <div className="flex-none flex items-center justify-between p-4 border-b border-slate-100 bg-white shadow-sm z-50">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <LayoutGrid size={18} className="text-primary" />
            <span>{t('composition.ui.typical', 'Typische Wagenreihung')}</span>
          </div>
          <button 
            onClick={() => setIsClosed(true)} 
            className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 transition-colors"
            aria-label={t('composition.ui.closeModal', 'Schließen')}
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 pb-0 text-xs font-semibold text-slate-600 tracking-wide">
          <div className="flex items-center gap-2 min-w-0">
            <LayoutGrid size={14} className="shrink-0" />
            <span>{t('composition.ui.typical', 'Typische Wagenreihung')}</span>
            <span className="text-slate-500 font-medium truncate">
              {trainName}{leg.direction ? ` — ${abbreviateStationName(leg.direction)}` : ''}
            </span>
          </div>
        </div>
      )}

      {/* Scrollable Content Area */}
      <div className={`flex-1 overflow-y-auto max-md:-webkit-overflow-scrolling-touch ${isMobile ? 'p-4 space-y-4' : 'p-3 pt-3 space-y-3'}`}>
        
        {/* Lade-Indikator */}
        {vagonStatus === 'loading' && (
          <div className="flex flex-col items-center justify-center p-8 bg-white border border-slate-200 rounded-xl shadow-sm space-y-3">
            <Loader2 size={24} className="animate-spin text-primary" />
            <span className="text-xs font-semibold text-slate-500">{t('composition.ui.loadingLive', 'Lade echte Wagenreihung...')}</span>
          </div>
        )}

        {/* Echte Wagenreihung */}
        {vagonStatus === 'found' && directUrl && (
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm shrink-0">
            <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">{t('composition.ui.realComposition', 'Echte Wagenreihung (vagonWEB)')}</span>
              <a href={directUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline text-[10px] flex items-center gap-1">
                {t('composition.ui.fullscreen', 'Vollbild')} <ExternalLink size={10} />
              </a>
            </div>
            <iframe 
              src={directUrl} 
              className="w-full h-[260px] object-contain bg-white block" 
              title={`Wagenreihung für ${trainName}`}
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        )}

        {/* Isoliertes Popup: Nur noch Bild + Dynamischer Titel (KEIN Uppercase mehr!) */}
      {popupUrl && (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-md shrink-0 animate-in fade-in slide-in-from-top-2">
          <div className="bg-slate-100 px-3 py-2 flex items-center justify-between border-b border-slate-200">
            <span className="text-sm font-bold text-slate-800">{popupTitle || 'Sitzplan'}</span>
            <button onClick={() => setPopupUrl(null)} className="p-1 hover:bg-slate-200 rounded-full"><X size={16} /></button>
          </div>
          <iframe 
            src={popupUrl} 
            className="w-full h-[300px] bg-white block" 
            title="Layout Details"
            onLoad={(e) => {
              // DER FIX: Wir zwingen das iFrame, das Bild zu isolieren, sobald es geladen hat!
              try {
                const iframe = e.target as HTMLIFrameElement;
                const doc = iframe.contentDocument || iframe.contentWindow?.document;
                const img = doc?.querySelector('img.mapa_sedadel') || doc?.querySelector('img[src*="mapa_sedadel"]');
                if (img) {
                  doc!.body.innerHTML = `<div style="display:flex;align-items:center;justify-content:left;height:100vh;"><img src="${img.src}" style="width: auto; height: 320px;"></div>`;
                }
              } catch (err) {
                console.log('Cross-origin restriction - iFrame muss auf dem gleichen Host laufen');
              }
            }}
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      )}

        {/* Fallback Rendering */}
        {vagonStatus === 'not-found' && sections.map((section, si) => (
          <div key={si} className="space-y-1.5 shrink-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">{section.title}</p>
            <div className="flex gap-1.5 overflow-x-auto pb-1 snap-x snap-mandatory" role="list">
              {section.carriages.map((c, ci) => (
                <CarriageChip key={ci} c={c} sectionIdx={si} carIdx={ci} />
              ))}
            </div>
          </div>
        ))}

        {vagonStatus === 'not-found' && exampleGross && <DogSeatMap carriage={exampleGross} t={t} />}

        {/* Info & Tipps Box */}
        {vagonStatus !== 'loading' && (
          <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-3 text-xs shrink-0 max-md:mb-6">
            {vagonStatus === 'found' && (
              <div className="pb-3 border-b border-slate-100">
                <div className="flex items-center gap-1.5 font-bold text-slate-700 mb-2">
                  <Info size={14} className="text-blue-500 shrink-0" />
                  <span>{t('composition.ui.interactiveMap', 'Interaktiver Sitzplan')}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {t('composition.ui.vagonwebExplanation', 'Hier siehst du die echten Wagennummern und Klassen. Klicke auf das kleine Kamera- oder Layout-Symbol unten, um den detaillierten Sitzplan zu öffnen. Die Fenster sind exakt eingezeichnet, so siehst du sofort, ob du rausschauen kannst!')}
                </p>
                <div className="mt-3 p-2.5 bg-blue-50 border border-blue-100 text-blue-800 rounded-lg flex gap-2">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <p>{t('composition.ui.vagonwebBestSeats', 'Tipp: Gute Sitzmöglichkeiten für Hunde bieten Plätze mit Rückenlehne an Rückenlehne oder Plätze, deren Rückenlehne direkt an eine Gepäckablage, einen Raumtrenner/Schiebetür oder ans Wagenende grenzen.')}</p>
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center gap-1.5 font-bold text-slate-700 mb-2">
                <PawPrint size={14} className="text-primary shrink-0" />
                <span>{t('composition.advice.title')}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 font-body">
                <div>
                  <span className="font-semibold text-slate-700 block">{t('composition.advice.zone')}</span>
                  {advice.zone}
                </div>
                <div>
                  <span className="font-semibold text-slate-700 block">{t('composition.advice.seats')}</span>
                  {advice.seats}
                </div>
              </div>
              <div className="text-slate-500 text-[11px] leading-relaxed pt-2 mt-2 border-t border-slate-100 font-body">
                <span className="font-semibold text-slate-600">{t('composition.advice.tip')} </span>
                {advice.tip}
              </div>
            </div>
          </div>
        )}
        
        {vagonStatus === 'not-found' && (
          <p className="text-[10px] text-slate-400 leading-snug font-body shrink-0 pb-4 md:pb-0">
            {t('composition.ui.exampleNote')}
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
    <div className="md:mt-3 md:bg-slate-50 md:rounded-xl md:border md:border-slate-200 md:block animate-in fade-in">
      {modalContent}
    </div>
  );
}