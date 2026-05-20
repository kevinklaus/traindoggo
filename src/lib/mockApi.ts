import { findMockJourneys, findMockStations, findMockStationsByCoords } from './mockData';
import type { JourneysResponse, Station, Journey } from './types';

const LOAD_FACTORS = ['low', 'low-to-medium', 'medium', 'high', 'very-high'];

export async function searchStationsMock(query: string): Promise<Station[]> {
  return findMockStations(query);
}

export async function searchStationsByCoordsMock(_lat: number, _lon: number): Promise<Station[]> {
  return findMockStationsByCoords();
}

export async function searchJourneysMock(
  fromId: string,
  toId: string,
  departure: string,
): Promise<JourneysResponse> {
  
  // HIER IST DER FIX: Das ".slice(0, results)" ist komplett gelöscht!
  // Dadurch wird die Liste nicht mehr gekürzt und gibt IMMER alle 6 Szenarien zurück.
  const rawJourneys = findMockJourneys(fromId, toId, departure);

  const augmentedJourneys: Journey[] = rawJourneys.map((journey, journeyIdx) => {
    const updatedLegs = journey.legs.map((leg, legIdx) => {
      if (leg.walking) return leg;

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