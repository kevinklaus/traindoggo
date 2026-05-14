import type { Leg, PriceEstimate, DogMode } from './types';

const PRICE_PER_KM: Record<string, number> = {
  nationalExpress: 0.22,
  national: 0.20,
  regionalExpress: 0.16,
  regional: 0.14,
  suburban: 0.12,
  bus: 0.10,
  ferry: 0.12,
  subway: 0.10,
  tram: 0.10,
  taxi: 0.30,
};

const BASE_FEE = 3.50;

function getDistanceKm(leg: Leg): number {
  if (leg.distance) return leg.distance / 1000;
  const dep = leg.departure ? new Date(leg.departure) : null;
  const arr = leg.arrival ? new Date(leg.arrival) : null;
  if (dep && arr) {
    const hours = (arr.getTime() - dep.getTime()) / (1000 * 60 * 60);
    const product = leg.line?.product ?? 'regional';
    const speedMap: Record<string, number> = {
      nationalExpress: 180,
      national: 140,
      regionalExpress: 100,
      regional: 70,
      suburban: 45,
      bus: 30,
      subway: 35,
      tram: 25,
    };
    return hours * (speedMap[product] ?? 70);
  }
  return 50;
}

export function estimatePrice(legs: Leg[], dogMode: DogMode): PriceEstimate {
  let basePrice = BASE_FEE;

  for (const leg of legs) {
    if (leg.walking) continue;
    const product = leg.line?.product ?? 'regional';
    const distKm = getDistanceKm(leg);
    const rate = PRICE_PER_KM[product] ?? 0.14;
    basePrice += distKm * rate;
  }

  basePrice = Math.round(basePrice * 100) / 100;
  basePrice = Math.max(basePrice, 4.60);

  const dogPrice = dogMode === 'large' ? Math.round(basePrice * 0.5 * 100) / 100 : 0;
  const totalPrice = Math.round((basePrice + dogPrice) * 100) / 100;

  let breakdown = `Base fare: \u20AC${basePrice.toFixed(2)}`;
  if (dogMode === 'large') {
    breakdown += ` + Dog ticket: \u20AC${dogPrice.toFixed(2)}`;
  } else if (dogMode === 'small') {
    breakdown += ' + Small dog: Free';
  }

  return { basePrice, dogPrice, totalPrice, currency: 'EUR', breakdown };
}
