import type { Leg, PriceEstimate, DogMode } from './types';

interface JourneyParam {
  legs: Leg[];
  price?: {
    amount: number;
    currency?: string;
  };
}

/**
 * Computes official ticket costs strictly from live APIs.
 * Returns null if no official price is available to avoid unreliable estimates.
 */
export function calculateJourneyPrice(journey: JourneyParam, dogMode: DogMode): PriceEstimate | null {
  // 1. Strict Check: Only proceed if we have a real price from the API
  if (!journey.price?.amount || journey.price.amount <= 0) {
    return null;
  }

  const basePrice = Math.round(journey.price.amount * 100) / 100;

  // Deutsche Bahn Rule: Accompanied large dogs require a separate ticket priced at exactly 50% of the adult fare
  const dogPrice = dogMode === 'large' ? Math.round(basePrice * 0.5 * 100) / 100 : 0;
  const totalPrice = Math.round((basePrice + dogPrice) * 100) / 100;

  let breakdown = `Official fare €${totalPrice.toFixed(2)}`;

  if (dogMode === 'large') {
    breakdown += ` (incl. dog ticket €${dogPrice.toFixed(2)})`;
  } else if (dogMode === 'small') {
    breakdown += ' (small dog in carrier: free)';
  }

  return { basePrice, dogPrice, totalPrice, currency: 'EUR', breakdown };
}