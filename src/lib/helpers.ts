import type { Leg } from './types';

export function formatTime(iso: string | undefined): string {
  if (!iso) return '--:--';
  const d = new Date(iso);
  return d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

export function formatDate(iso: string | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function formatDuration(iso1: string, iso2: string): string {
  const ms = new Date(iso2).getTime() - new Date(iso1).getTime();
  const totalMin = Math.round(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

export function getTransferMinutes(prevLeg: Leg, nextLeg: Leg): number | null {
  const arr = prevLeg.arrival;
  const dep = nextLeg.departure;
  if (!arr || !dep) return null;
  return Math.round((new Date(dep).getTime() - new Date(arr).getTime()) / 60000);
}

export function getLineName(leg: Leg): string {
  if (leg.walking) return 'Walk';
  return leg.line?.name ?? leg.line?.product ?? 'Unknown';
}

/** Station / direction text: Hauptbahnhof→Hbf, drop Bahnhof, shorten bracketed rivers (Main)→(M). */
export function abbreviateStationName(name: string | undefined | null): string {
  let s = String(name ?? '').trim();
  if (!s) return '';
  s = s.replace(/\bhauptbahnhof\b/gi, 'Hbf');
  s = s.replace(/\bbahnhof\b/gi, '');
  s = s.replace(/\(\s*([^)]+?)\s*\)/g, (_, inner: string) => {
    const word = inner.trim();
    if (/^[A-Za-zÄÖÜäöüß]+$/.test(word) && word.length >= 4) {
      const ch = word[0].toUpperCase();
      return `(${ch})`;
    }
    return `(${word})`;
  });
  s = s.replace(/\s{2,}/g, ' ').replace(/\s+,/g, ',').replace(/,\s*/g, ', ').trim();
  s = s.replace(/^,\s*|,\s*$/g, '');
  return s.trim();
}

/** Leg duration in minutes (at least 1) for bar width math. */
export function getLegDurationMinutes(leg: Leg): number {
  const dep = leg.departure ?? leg.plannedDeparture;
  const arr = leg.arrival ?? leg.plannedArrival;
  if (!dep || !arr) return 1;
  const m = Math.round((new Date(arr).getTime() - new Date(dep).getTime()) / 60000);
  return Math.max(1, m);
}

/** Line name for badges: keep a space between type and number (e.g. ICE 507), no destination. */
export function compactLineName(leg: Leg): string {
  if (leg.walking) return 'Walk';
  const name = (leg.line?.name ?? '').replace(/\s+/g, ' ').trim();
  if (!name) return (leg.line?.product ?? '—').toUpperCase();
  return name;
}

/** Short label for pills / bars (no "to", no direction). */
export function getLegBadgeLabel(leg: Leg): string {
  if (leg.walking) return 'Walk';
  const n = compactLineName(leg);
  return n || '—';
}

/** Longer description for tooltips (direction abbreviated, no literal " to "). */
export function getLegDescription(leg: Leg): string {
  if (leg.walking) return 'Walking';
  const line = (leg.line?.name ?? '').trim();
  const dir = leg.direction ? abbreviateStationName(leg.direction) : '';
  if (line && dir) return `${line} — ${dir}`;
  if (line) return line;
  return getLegBadgeLabel(leg);
}

export function getLegLabel(leg: Leg): string {
  return getLegBadgeLabel(leg);
}

interface LineStyle {
  bg: string;
  text: string;
}

const BW_REGIONS = ['baden-w', 'baden-wuerttemberg', 'bw'];

function isBWOperator(leg: Leg): boolean {
  const opId = leg.line?.operator?.name?.toLowerCase() ?? '';
  return BW_REGIONS.some((r) => opId.includes(r));
}

const REGIONAL_PRODUCTS = ['regional', 'regionalExpress'];

export function getLineStyle(leg: Leg): LineStyle {
  if (leg.walking) return { bg: '#94a3b8', text: '#ffffff' };

  const product = leg.line?.product ?? '';
  const name = (leg.line?.name ?? '').toLowerCase();

  if (name.startsWith('ice') || name.startsWith('ic') || name.startsWith('ec')) {
    return { bg: '#e2001a', text: '#ffffff' };
  }

  if (REGIONAL_PRODUCTS.includes(product) || name.startsWith('re') || name.startsWith('rb') || name.startsWith('ire') || name.startsWith('mex')) {
    if (isBWOperator(leg)) {
      return { bg: '#f5a623', text: '#000000' };
    }
    return { bg: '#3b3dff', text: '#ffffff' };
  }

  if (product === 'suburban' || name.startsWith('s')) {
    return { bg: '#006633', text: '#ffffff' };
  }

  if (product === 'bus') return { bg: '#993399', text: '#ffffff' };
  if (product === 'subway') return { bg: '#0066cc', text: '#ffffff' };
  if (product === 'tram') return { bg: '#cc6600', text: '#ffffff' };

  return { bg: '#3b3dff', text: '#ffffff' };
}

export function isWalking(leg: Leg): boolean {
  return leg.walking === true;
}

export function countTransfers(legs: Leg[]): number {
  return legs.filter((l) => !l.walking).length - 1;
}

export function isSameStationTransfer(leg: Leg): boolean {
  if (!leg.walking) return false;
  const originId = leg.origin?.id;
  const destId = leg.destination?.id;
  if (originId && destId && originId === destId) return true;
  const arr = leg.arrival;
  const dep = leg.departure;
  if (arr && dep) {
    const min = Math.abs(new Date(dep).getTime() - new Date(arr).getTime()) / 60000;
    if (min < 1) return true;
  }
  return false;
}

export function filterValidLegs(legs: Leg[]): Leg[] {
  return legs.filter((leg) => !isSameStationTransfer(leg));
}

export function isZeroTransfer(prevLeg: Leg, nextLeg: Leg): boolean {
  const min = getTransferMinutes(prevLeg, nextLeg);
  return min !== null && min <= 0;
}

export function getTrainType(leg: Leg): 'ice' | 'ic' | 'ec' | 're' | 'rb' | 'other' {
  const name = (leg.line?.name ?? '').toLowerCase();
  if (name.startsWith('ice')) return 'ice';
  if (name.startsWith('ic')) return 'ic';
  if (name.startsWith('ec')) return 'ec';
  if (name.startsWith('re')) return 're';
  if (name.startsWith('rb')) return 'rb';
  return 'other';
}
