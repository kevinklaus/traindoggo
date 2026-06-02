import { useState, useEffect } from 'react';
import type { Leg } from '../lib/types';
import { buildVagonWebParams } from './vagonWebHelpers'; // Falls du das in die Helper gezogen hast, sonst leg es einfach in die helpers.ts

export function useVagonWeb(leg: Leg, language: string, trainName: string, iframeRef: React.RefObject<HTMLIFrameElement>) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'found' | 'not-found'>('idle');
  const [directUrl, setDirectUrl] = useState<string | null>(null);
  
  const [layouts, setLayouts] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [popupUrl, setPopupUrl] = useState<string | null>(null);
  const [popupTitle, setPopupTitle] = useState<string | null>(null);

  // 1. Fetch initial status
  useEffect(() => {
    async function checkVagonWeb() {
      setStatus('loading');
      try {
        const params = buildVagonWebParams(leg, language);
        const res = await fetch(`/api/vagonwebProxy?${params}`);
        if (!res.ok) throw new Error('API Error');
        const data = await res.json();
        
        if (data.exists && data.directUrl) {
          setDirectUrl(data.directUrl);
          setStatus('found');
        } else {
          setStatus('not-found');
        }
      } catch {
        setStatus('not-found');
      }
    }
    checkVagonWeb();
  }, [leg, language]);

  // 2. Iframe Message Listener
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!iframeRef.current || e.source !== iframeRef.current.contentWindow) return;

      if (e.data?.type === 'VAGON_LAYOUTS') {
        setLayouts(e.data.layouts);
      } else if (e.data?.type === 'OPEN_MODAL_INDEX') {
        setActiveIndex(e.data.index);
        setPopupUrl(null);
      } else if (e.data?.type === 'OPEN_MODAL' && e.data.url) {
        setPopupUrl(`/api/vagonwebProxy?proxyTarget=${encodeURIComponent(e.data.url)}&render=true&isPopup=true`);
        const carText = e.data.carNum ? `Wagen ${e.data.carNum}` : 'Sitzplan';
        setPopupTitle(`${carText} — ${trainName}`);
        setActiveIndex(null);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [trainName, iframeRef]);

  // 3. Helper für die Navigation
  const firstAvailableLayout = layouts.findIndex(l => l !== null);
  const activeLayout = activeIndex !== null ? layouts[activeIndex] : null;

  const handleNext = () => {
    const next = layouts.findIndex((l, i) => i > activeIndex! && l !== null);
    if (next !== -1) setActiveIndex(next);
  };

  const handlePrev = () => {
    const prev = layouts.findLastIndex((l, i) => i < activeIndex! && l !== null);
    if (prev !== -1) setActiveIndex(prev);
  };

  const closePopup = () => {
    setActiveIndex(null);
    setPopupUrl(null);
  };

  const activeUrlToRender = activeLayout 
    ? `/api/vagonwebProxy?proxyTarget=${encodeURIComponent(activeLayout.url)}&render=true&isPopup=true` 
    : popupUrl;

  const activeTitleToRender = activeLayout 
    ? (activeLayout.carNum ? `Wagen ${activeLayout.carNum}` : 'Sitzplan') + ` — ${trainName}` 
    : popupTitle;

  return {
    status,
    directUrl,
    firstAvailableLayout,
    activeUrlToRender,
    activeTitleToRender,
    hasPrev: layouts.findLastIndex((l, i) => i < (activeIndex ?? 0) && l !== null) !== -1,
    hasNext: layouts.findIndex((l, i) => i > (activeIndex ?? 0) && l !== null) !== -1,
    isPopupOpen: !!activeUrlToRender,
    handleNext,
    handlePrev,
    closePopup,
    openIndex: (idx: number) => { setActiveIndex(idx); setPopupUrl(null); }
  };
}