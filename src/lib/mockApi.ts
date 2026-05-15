import type { JourneysResponse, Station } from './types';
import { findMockJourneys, findMockStations, findMockStationsByCoords } from './mockData';

export async function searchStationsMock(query: string): Promise<Station[]> {
  return Promise.resolve(findMockStations(query));
}

export async function searchStationsByCoordsMock(_lat: number, _lon: number): Promise<Station[]> {
  return Promise.resolve(findMockStationsByCoords());
}

export async function searchJourneysMock(
  fromId: string,
  toId: string,
  departure: string,
  results = 5
): Promise<JourneysResponse> {
  return Promise.resolve({ journeys: findMockJourneys(fromId, toId, departure).slice(0, results) });
}
