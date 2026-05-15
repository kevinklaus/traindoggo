import { searchJourneysMock, searchStationsByCoordsMock, searchStationsMock } from './mockApi';
import type { JourneysResponse, Station } from './types';

let useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';

export function setMockApiMode(enabled: boolean) {
  useMockApi = enabled;
}

interface StationResult {
  id: string;
  name: string;
  type: string;
  location?: {
    type: string;
    latitude: number;
    longitude: number;
  };
  products?: Record<string, boolean>;
  federalState?: string;
  operator?: { id: string; name: string };
  station?: StationResult;
}

const TOP_STATIONS: Record<string, number> = {
  '8011160': 100, '8002549': 99, '8000261': 98, '8000105': 97,
  '8000207': 96, '8000290': 95, '8000085': 94, '8000068': 93,
  '8000013': 92, '8000284': 91, '8000159': 90, '8000096': 89,
  '8000244': 88, '8000199': 87, '8000170': 86, '8000052': 85,
  '8000143': 84, '8000232': 83, '8000309': 82, '8000078': 81,
  '8000122': 80, '8000183': 79, '8000212': 78, '8000273': 77,
  '8000049': 76, '8000332': 75, '8000116': 74, '8000263': 73,
  '8000165': 72, '8000228': 71, '8010159': 70, '8000050': 69,
  '8000067': 68, '8000310': 67, '8000189': 66, '8000243': 65,
  '8000295': 64, '8000255': 63, '8000300': 62, '8000341': 61,
  '8000076': 60, '8000035': 59, '8000235': 58, '8000253': 57,
  '8000191': 56, '8000152': 55, '8000265': 54, '8000146': 53,
  '8000174': 52, '8000200': 51, '8000216': 50,
};

function germanNameScore(name: string): number {
  let score = 0;
  if (/[äöüÄÖÜß]/.test(name)) score += 20;
  if (/ue|oe|ae/i.test(name) && !/[äöüÄÖÜ]/.test(name)) score -= 5;
  return score;
}

function pickBetterStationName(a: Station, b: Station): Station {
  const diff = germanNameScore(b.name) - germanNameScore(a.name);
  if (diff !== 0) return diff > 0 ? b : a;
  return a.name.length <= b.name.length ? a : b;
}

function umlautToAscii(s: string): string {
  return s
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/Ä/g, 'Ae').replace(/Ö/g, 'Oe').replace(/Ü/g, 'Ue');
}

function asciiPairsToUmlauts(s: string): string {
  return s
    .replace(/Ue/g, 'Ü').replace(/ue/g, 'ü').replace(/Oe/g, 'Ö').replace(/oe/g, 'ö')
    .replace(/Ae/g, 'Ä').replace(/ae/g, 'ä');
}

function expandGermanStationQueries(raw: string): string[] {
  const q = raw.trim();
  if (q.length < 2) return [];
  const variants = new Set<string>([q]);
  variants.add(umlautToAscii(q));
  variants.add(asciiPairsToUmlauts(q));
  variants.add(asciiPairsToUmlauts(umlautToAscii(q)));
  return [...variants].filter((s) => s.length >= 2);
}

function rankStations(stations: Station[]): Station[] {
  return stations.sort((a, b) => {
    const scoreA = TOP_STATIONS[a.id] ?? 0;
    const scoreB = TOP_STATIONS[b.id] ?? 0;
    const hbfBoostA = a.name.toLowerCase().includes('hauptbahnhof') || a.name.toLowerCase().includes('hbf') ? 5 : 0;
    const hbfBoostB = b.name.toLowerCase().includes('hauptbahnhof') || b.name.toLowerCase().includes('hbf') ? 5 : 0;
    return (scoreB + hbfBoostB) - (scoreA + hbfBoostA);
  });
}

function mapResultToStation(entry: StationResult): Station {
  const core = entry.station?.id ? entry.station : entry;
  return {
    type: core.type ?? 'stop',
    id: core.id,
    name: typeof core.name === 'string' ? core.name : '',
    location: core.location,
    products: core.products,
  };
}

function isApiErrorBody(data: unknown): boolean {
  return (typeof data === 'object' && data !== null && 'message' in data);
}

function isStationResult(v: unknown): v is StationResult {
  return Boolean(v && typeof v === 'object' && typeof (v as StationResult).id === 'string');
}

function parseStationsPayload(data: unknown): Station[] {
  if (isApiErrorBody(data)) return [];
  if (Array.isArray(data)) {
    return (data as unknown[]).filter(isStationResult).map(mapResultToStation).filter((s) => s.id && s.name);
  }
  return [];
}

/** 1. STATION SEARCH (via stationProxy.ts) */
async function fetchStationsForQuery(query: string): Promise<Station[]> {
  const res = await fetch(`/api/stations?query=${encodeURIComponent(query)}&limit=8`);
  if (!res.ok) throw new Error('Station search failed');
  return parseStationsPayload(await res.json());
}

async function fetchStationsViaLocationsQuery(query: string): Promise<Station[]> {
  const res = await fetch(`/api/stations?query=${encodeURIComponent(query)}`);
  if (!res.ok) return [];
  return parseStationsPayload(await res.json());
}

export async function searchStations(query: string): Promise<Station[]> {
  if (useMockApi) return searchStationsMock(query);
  const queries = expandGermanStationQueries(query);
  if (queries.length === 0) return [];

  const merged = new Map<string, Station>();
  for (const q of queries) {
    try {
      const batch = await fetchStationsForQuery(q);
      for (const s of batch) {
        const existing = merged.get(s.id);
        merged.set(s.id, existing ? pickBetterStationName(existing, s) : s);
      }
      if (merged.size >= 8) break;
    } catch (error) {
      console.warn('Search failed:', error);
    }
  }

  let list = rankStations([...merged.values()]);
  if (list.length === 0) {
    try {
      list = rankStations(await fetchStationsViaLocationsQuery(query.trim()));
    } catch {
      list = [];
    }
  }
  return list.slice(0, 8);
}

/** 2. NEARBY SEARCH (via nearbyProxy.ts) */
export async function searchStationsByCoords(lat: number, lon: number): Promise<Station[]> {
  if (useMockApi) return searchStationsByCoordsMock(lat, lon);

  try {
    const res = await fetch(`/api/nearby?latitude=${lat}&longitude=${lon}`);
    if (!res.ok) throw new Error('Nearby search failed');
    const data: unknown = await res.json();
    const rows = Array.isArray(data) ? (data as unknown[]).filter(isStationResult) : [];
    const merged = new Map<string, Station>();
    for (const item of rows) {
      const s = mapResultToStation(item);
      if (s.id && s.name) merged.set(s.id, s);
    }
    return rankStations([...merged.values()]).slice(0, 8);
  } catch {
    return [];
  }
}

/** 3. JOURNEY SEARCH (via journeyProxy.ts) */
export async function searchJourneys(
  fromId: string,
  toId: string,
  departure: string,
  results = 5
): Promise<JourneysResponse> {
  if (useMockApi) return searchJourneysMock(fromId, toId, departure, results);

  try {
    const params = new URLSearchParams({
      from: fromId,
      to: toId,
      departure,
      results: String(results),
      stopovers: 'true',
      tickets: 'true',
      routingMode: 'HYBRID'
    });

    const res = await fetch(`/api/journeys?${params.toString()}`);
    if (!res.ok) throw new Error('Journey search failed');
    return await res.json() as JourneysResponse;
  } catch (error) {
    console.error('Journey search error:', error);
    throw new Error('Live timetable API unavailable. Check your connection or try again.');
  }
}