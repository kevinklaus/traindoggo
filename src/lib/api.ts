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

/** Prefer API names with proper German letters (e.g. München over Muenchen). */
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
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/Ä/g, 'Ae')
    .replace(/Ö/g, 'Oe')
    .replace(/Ü/g, 'Ue');
}

function asciiPairsToUmlauts(s: string): string {
  return s
    .replace(/Ue/g, 'Ü')
    .replace(/ue/g, 'ü')
    .replace(/Oe/g, 'Ö')
    .replace(/oe/g, 'ö')
    .replace(/Ae/g, 'Ä')
    .replace(/ae/g, 'ä');
}

/** Same search reliability for München / Muenchen etc.; UI keeps API spelling with umlauts when available. */
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

async function fetchStationsForQuery(query: string): Promise<Station[]> {
  const url = `${BASE_URL}/stations?query=${encodeURIComponent(query)}&limit=8&fuzzy=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Station search failed');
  const data: Record<string, StationResult> = await res.json();
  return Object.values(data).map((s) => ({
    type: s.type ?? 'stop',
    id: s.id,
    name: s.name,
    location: s.location,
    products: s.products,
  }));
}

export async function searchStations(query: string): Promise<Station[]> {
  const queries = expandGermanStationQueries(query);
  if (queries.length === 0) return [];

  const batches = await Promise.all(
    queries.map(async (q) => {
      try {
        return await fetchStationsForQuery(q);
      } catch {
        return [];
      }
    })
  );

  const merged = new Map<string, Station>();
  for (const stations of batches) {
    for (const s of stations) {
      const existing = merged.get(s.id);
      merged.set(s.id, existing ? pickBetterStationName(existing, s) : s);
    }
  }

  return rankStations([...merged.values()]);
}

export async function searchStationsByCoords(lat: number, lon: number): Promise<Station[]> {
  const latEnc = encodeURIComponent(String(lat));
  const lonEnc = encodeURIComponent(String(lon));
  const res = await fetch(`${BASE_URL}/stations/nearby?latitude=${latEnc}&longitude=${lonEnc}&results=5`);
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
  const qs = [
    `from=${encodeURIComponent(fromId)}`,
    `to=${encodeURIComponent(toId)}`,
    `departure=${encodeURIComponent(departure)}`,
    `results=${encodeURIComponent(String(results))}`,
    `stopovers=${encodeURIComponent('true')}`,
    `tickets=${encodeURIComponent('true')}`,
    `routingMode=${encodeURIComponent('HYBRID')}`,
  ].join('&');

  const res = await fetch(`${BASE_URL}/journeys?${qs}`);
  if (!res.ok) throw new Error('Journey search failed');
  return res.json();
}
