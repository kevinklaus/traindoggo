import type { Leg, PriceEstimate, DogMode } from './types';

interface JourneyParam {
  legs: Leg[];
  price?: {
    amount: number;
    currency?: string;
  };
}

// 4 clean, realistic fallback prices 
const MOCK_FALLBACK_PRICES = [9.90, 29.90, 59.90, 179.00];

/**
 * Computes official ticket costs from live APIs or selects a stable,
 * deterministic mock price from a pool of 4 options for offline fallback data.
 */
export function calculateJourneyPrice(journey: JourneyParam, dogMode: DogMode): PriceEstimate {
  let basePrice = 0;
  let isOfficialFare = false;

  // 1. Primary Strategy: Use live API fare data if present
  if (journey.price?.amount && journey.price.amount > 0) {
    basePrice = journey.price.amount;
    isOfficialFare = true;
  } else {
    // 2. Fallback Strategy: Select deterministically from our 4 preset choices.
    // Hashing the departure string ensures that a specific journey card always displays
    // the same price across UI toggles, state updates, and layout re-renders.
    const uniqueSeed = journey.legs[0]?.departure || 'default-seed';
    let stringHash = 0;
    for (let i = 0; i < uniqueSeed.length; i++) {
      stringHash += uniqueSeed.charCodeAt(i);
    }
    const chosenIndex = stringHash % MOCK_FALLBACK_PRICES.length;
    basePrice = MOCK_FALLBACK_PRICES[chosenIndex];
  }

  basePrice = Math.round(basePrice * 100) / 100;

  // Deutsche Bahn Rule: Accompanied large dogs require a separate ticket priced at exactly 50% of the adult fare
  const dogPrice = dogMode === 'large' ? Math.round(basePrice * 0.5 * 100) / 100 : 0;
  const totalPrice = Math.round((basePrice + dogPrice) * 100) / 100;

  let breakdown = isOfficialFare
    ? `Official fare €${totalPrice.toFixed(2)}`
    : `Indicative total €${totalPrice.toFixed(2)} (offline fallback)`;

  if (dogMode === 'large') {
    breakdown += ` (incl. dog add-on €${dogPrice.toFixed(2)})`;
  } else if (dogMode === 'small') {
    breakdown += ' (small dog in carrier: no add-on)';
  }

  return { basePrice, dogPrice, totalPrice, currency: 'EUR', breakdown };
}