import { useState, useCallback } from 'react';
import { searchJourneys } from '../lib/api';
import type { Journey, SearchParams } from '../lib/types';

export function useJourneySearch() {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed.');
    } finally {
      setLoading(false);
      setLoadingEarlier(false);
      setLoadingLater(false);
    }
  }, [earlierRef, laterRef]);

  return { journeys, loading, error, fetchJourneys, loadingEarlier, loadingLater, earlierRef, laterRef };
}