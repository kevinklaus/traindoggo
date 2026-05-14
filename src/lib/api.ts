import type { JourneysResponse, Station } from './types';

const BASE_URL = 'https://v6.db.transport.rest';

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

const UMLAUT_MAP: Record<string, string> = {
  'ae': 'ä', 'oe': 'ö', 'ue': 'ü', 'ss': 'ß',
  'Ae': 'Ä', 'Oe': 'Ö', 'Ue': 'Ü',
};

function normalizeQueryForDisplay(query: string): string {
  let result = query;
  for (const [ascii, umlaut] of Object.entries(UMLAUT_MAP)) {
    result = result.replace(new RegExp(ascii, 'g'), umlaut);
  }
  return result;
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

export async function searchStations(query: string): Promise<Station[]> {
  if (!query || query.length < 2) return [];

  const res = await fetch(
    `${BASE_URL}/stations?query=${encodeURIComponent(query)}&limit=8&fuzzy=true`
  );
  if (!res.ok) throw new Error('Station search failed');
  const data: Record<string, StationResult> = await res.json();
  const stations = Object.values(data).map((s) => ({
    type: s.type ?? 'stop',
    id: s.id,
    name: s.name,
    location: s.location,
    products: s.products,
  }));
  return rankStations(stations);
}

export async function searchStationsByCoords(lat: number, lon: number): Promise<Station[]> {
  const res = await fetch(
    `${BASE_URL}/stations/nearby?latitude=${lat}&longitude=${lon}&results=5`
  );
  if (!res.ok) throw new Error('Location search failed');
  const data: StationResult[] = await res.json();
  return data.map((s) => ({
    type: s.type ?? 'stop',
    id: s.id,
    name: s.name,
    location: s.location,
    products: s.products,
  }));
}

export async function searchJourneys(
  fromId: string,
  toId: string,
  departure: string,
  results = 5
): Promise<JourneysResponse> {
  const params = new URLSearchParams({
    from: fromId,
    to: toId,
    departure,
    results: String(results),
    stopovers: 'true',
    tickets: 'true',
    routingMode: 'HYBRID',
  });
  const res = await fetch(`${BASE_URL}/journeys?${params}`);
  if (!res.ok) throw new Error('Journey search failed');
  return res.json();
}

export { normalizeQueryForDisplay };
