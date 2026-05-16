import { findMockJourneys, findMockStations, findMockStationsByCoords } from './mockData';
import type { JourneysResponse, Station, Journey } from './types';

const LOAD_FACTORS = ['low', 'low-to-medium', 'medium', 'high', 'very-high'];

/**
 * Mock Station Autocomplete Gateway 
 * Bridges into your custom search metrics and umlaut normalizers inside mockData.ts
 */
export async function searchStationsMock(query: string): Promise<Station[]> {
  return findMockStations(query);
}

/**
 * Mock Nearby Station Coordinates Lookup Gateway
 */
export async function searchStationsByCoordsMock(_lat: number, _lon: number): Promise<Station[]> {
  return findMockStationsByCoords();
}

/**
 * Mock Journey Schedule Query Gateway
 * Automatically decorates each transit leg with stable, deterministic load factor values
 */
export async function searchJourneysMock(
  fromId: string,
  toId: string,
  departure: string,
  results = 5
): Promise<JourneysResponse> {
  // 1. Fetch matching route configurations from your static fixtures
  const rawJourneys = findMockJourneys(fromId, toId, departure).slice(0, results);

  // 2. Dynamic Decorator Loop: Append crowding metrics safely to non-walking components
  const augmentedJourneys: Journey[] = rawJourneys.map((journey, journeyIdx) => {
    const updatedLegs = journey.legs.map((leg, legIdx) => {
      if (leg.walking) return leg; // Pedestrian transfer tracks never contain load weights

      // Calculate index key via dates and loops to keep status elements stable across re-renders
      const dateNum = new Date(departure).getDate() || 1;
      const seedIndex = (journeyIdx + legIdx + dateNum) % LOAD_FACTORS.length;
      const assignedLoadFactor = LOAD_FACTORS[seedIndex];

      return {
        ...leg,
        loadFactor: assignedLoadFactor,
        stopovers: (leg.stopovers ?? []).map((stopover) => ({
          ...stopover,
          loadFactor: assignedLoadFactor,
        })),
      };
    });

    return {
      ...journey,
      legs: updatedLegs,
    };
  });

  return {
    earlierRef: '3|OB|MTµ14µ224239µ224239',
    laterRef: '3|OF|MTµ14µ224385µ224385',
    journeys: augmentedJourneys,
  };
}