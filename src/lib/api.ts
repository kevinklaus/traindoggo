import { searchJourneysMock, searchStationsByCoordsMock, searchStationsMock } from './mockApi';
import type { JourneysResponse, Station } from './types';

// Standard-Flag für lokalen Entwicklungsmodus vs. Produktion
let useMockApi = import.meta.env.DEV;

export function setMockApiMode(enabled: boolean) {
  useMockApi = enabled;
}

// Hilfsfunktion zur schnellen Validierung von Gateway-Antworten
async function handleResponse(res: Response, contextLabel: string) {
  if (!res.ok) {
    throw new Error(`${contextLabel} gateway returned HTTP status ${res.status}`);
  }
  return res.json();
}

/** 1. PROXIED STATION SEARCH (AUTOCOMPLETE) */
export async function searchStations(query: string): Promise<Station[]> {
  if (useMockApi) return searchStationsMock(query);
  
  const cleanQuery = query.trim();
  if (cleanQuery.length < 2) return [];

  const res = await fetch(`/api/stations?query=${encodeURIComponent(cleanQuery)}&limit=8`);
  const data = await handleResponse(res, 'Station');

  // Mapping des HAFAS-Location-Arrays auf dein internes Station-Interface
  return (data || []).map((s: any) => ({
    type: s.type || 'stop',
    id: s.id,
    name: s.name || '',
    location: s.location,
    products: s.products
  }));
}

/** 2. PROXIED NEARBY SEARCH */
export async function searchStationsByCoords(lat: number, lon: number): Promise<Station[]> {
  if (useMockApi) return searchStationsByCoordsMock(lat, lon);

  const res = await fetch(`/api/nearby?latitude=${lat}&longitude=${lon}`);
  const data = await handleResponse(res, 'Nearby');

  return (data || []).map((item: any) => ({
    type: item.type || 'stop',
    id: item.id,
    name: item.name || '',
    location: item.location,
    products: item.products
  }));
}

/** 3. PROXIED JOURNEY SEARCH */
export async function searchJourneys(
  fromId: string,
  toId: string,
  departure: string,
  maxChanges?: number,       // <--- NEU
  minTransferTime?: number,  // <--- NEU
  results = 10 
): Promise<JourneysResponse> {
  if (useMockApi) return searchJourneysMock(fromId, toId, departure);

  const params = new URLSearchParams({
    from: fromId,
    to: toId,
    departure,
    results: String(results)
  });

  // HIER KOMMT DIE MAGIE FÜR DIE URL:
  // Wir hängen die Werte an, falls sie existieren
  if (maxChanges !== undefined && maxChanges !== null) {
    params.append('maxChanges', String(maxChanges));
  }
  if (minTransferTime !== undefined && minTransferTime !== null) {
    params.append('minTransferTime', String(minTransferTime));
  }

  // Aufruf an deinen Vercel Proxy (z.B. /api/journeys oder /api/journeyProxy)
  const res = await fetch(`/api/journeyProxy?${params.toString()}`);
  return handleResponse(res, 'Journey') as Promise<JourneysResponse>;
}