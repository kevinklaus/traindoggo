import { useState, useCallback } from 'react';
import { searchJourneys, fetchChuuchuuDelays } from '../lib/api'; // <-- fetchChuuchuuDelays importiert!
import type { Journey, SearchParams } from '../lib/types';
import { formatChuuChuuLineName } from './helpers';


// HILFSFUNKTION: Extrahiert alle relevanten, einzigartigen Umstiege aus den HAFAS-Ergebnissen
function extractTransfers(journeys: Journey[]) {
  const transferMap = new Map<string, any>();

  journeys.forEach(journey => {
    const transitLegs = journey.legs.filter(l => !l.walking && l.line?.name);
    
    for (let i = 0; i < transitLegs.length - 1; i++) {
      const firstLeg = transitLegs[i];
      const secondLeg = transitLegs[i + 1];

      const firstLineFull = formatChuuChuuLineName(firstLeg);
      const secondLineFull = formatChuuChuuLineName(secondLeg);
      const firstDest = firstLeg.destination?.id;
      const secondOrig = secondLeg.origin?.id;
      
      if (firstLineFull && secondLineFull && firstDest && secondOrig) {
        const key = `${firstLineFull}|${firstDest}|${secondLineFull}|${secondOrig}`;
        if (!transferMap.has(key)) {
          transferMap.set(key, {
            key,
            firstLine: firstLineFull,
            firstDest: firstDest,
            secondLine: secondLineFull,
            secondOrig: secondOrig
          });
        }
      }
    }
  });

  return Array.from(transferMap.values());
}

export function useJourneySearch() {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // NEU: States für die Chuuchuu-Verspätungsdaten
  const [chuuchuuStats, setChuuchuuStats] = useState<Record<string, any>>({});
  const [loadingChuuchuu, setLoadingChuuchuu] = useState(false);

  // Pagination
  const [earlierRef, setEarlierRef] = useState<string | null>(null);
  const [laterRef, setLaterRef] = useState<string | null>(null);
  const [loadingEarlier, setLoadingEarlier] = useState(false);
  const [loadingLater, setLoadingLater] = useState(false);

  const fetchJourneys = useCallback(async (params: SearchParams, isPagination = false, direction?: 'earlier' | 'later') => {
    if (!params.from || !params.to) return;

    if (!isPagination) {
      setLoading(true);
      setError(null);
      setJourneys([]);
      setChuuchuuStats({}); // Reset Chuuchuu beim neuen Suchen
      setEarlierRef(null);
      setLaterRef(null);
    } else if (direction === 'earlier') setLoadingEarlier(true);
    else if (direction === 'later') setLoadingLater(true);

    try {
      const departure = new Date(`${params.date}T${params.time}:00`).toISOString();
      const result = await searchJourneys(
        params.from.id, 
        params.to.id, 
        departure,
        params.maxChanges,
        params.minTransferTime,
        direction === 'earlier' ? (earlierRef ?? undefined) : undefined,
        direction === 'later' ? (laterRef ?? undefined) : undefined
      );

      // 1. HAFAS JOURNEYS IM STATE SPEICHERN (UI aktualisiert sich sofort)
      if (direction === 'earlier') {
        setJourneys(prev => [...(result.journeys ?? []), ...prev]);
        setEarlierRef(result.earlierRef ?? null);
      } else if (direction === 'later') {
        setJourneys(prev => [...prev, ...(result.journeys ?? [])]);
        setLaterRef(result.laterRef ?? null);
      } else {
        setJourneys(result.journeys ?? []);
        setEarlierRef(result.earlierRef ?? null);
        setLaterRef(result.laterRef ?? null);
      }

      if (!result.journeys?.length && !isPagination) {
        setError('No journeys found.');
      } else {
        // ==========================================
        // 2. CHUUCHUU LAZY LOADING (Hintergrund-Aufruf)
        // ==========================================
        // Wir nehmen nur die NEU geladenen Journeys (result.journeys), 
        // um nicht alte Züge bei Pagination doppelt zu prüfen.
        const transfersToCheck = extractTransfers(result.journeys ?? []);
        
        if (transfersToCheck.length > 0) {
          setLoadingChuuchuu(true);
          
          // Wir nutzen kein "await", damit die UI nicht auf Chuuchuu warten muss!
          fetchChuuchuuDelays(transfersToCheck)
            .then(stats => {
              // Wir mergen die neuen Stats in den bestehenden Object-State
              setChuuchuuStats(prev => ({ ...prev, ...stats }));
            })
            .catch(err => console.error("[useJourneySearch] Chuuchuu lazy load failed", err))
            .finally(() => {
              setLoadingChuuchuu(false);
            });
        }
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed.');
    } finally {
      setLoading(false);
      setLoadingEarlier(false);
      setLoadingLater(false);
    }
  }, [earlierRef, laterRef]);

  // Wir geben die neuen Chuuchuu-States ans Frontend zurück
  return { 
    journeys, loading, error, fetchJourneys, 
    loadingEarlier, loadingLater, earlierRef, laterRef,
    chuuchuuStats, loadingChuuchuu 
  };
}