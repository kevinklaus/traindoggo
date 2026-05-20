import type { Journey, Leg, Station } from './types';

export const MOCK_STATIONS: Station[] = [
  {
    id: '8011160',
    type: 'station',
    name: 'Berlin Hbf',
    location: { type: 'location', latitude: 52.5251, longitude: 13.3694 },
    products: { national: true, suburban: true },
  },
  {
    id: '8000250',
    type: 'station',
    name: 'Wiesbaden Hbf',
    location: { type: 'location', latitude: 50.0708, longitude: 8.2435 },
    products: { national: true, suburban: true },
  },
  {
    id: '8070003',
    type: 'station',
    name: 'Frankfurt(M) Flughafen Fernbf',
    location: { type: 'location', latitude: 50.0532, longitude: 8.5705 },
    products: { national: true, suburban: false },
  },
  {
    id: '8070004',
    type: 'station',
    name: 'Frankfurt(M) Flughafen Regionalbf',
    location: { type: 'location', latitude: 50.0514, longitude: 8.5721 },
    products: { national: false, suburban: true },
  },
  {
    id: '8000105',
    type: 'station',
    name: 'Frankfurt (Main) Hbf',
    location: { type: 'location', latitude: 50.1072, longitude: 8.6638 },
    products: { national: true, suburban: true },
  }
];

export const DEV_INITIAL_FROM: Station = {
  id: '8011160',
  type: 'station',
  name: 'Berlin Hbf',
  location: { type: 'location', latitude: 52.5251, longitude: 13.3694 },
  products: { national: true, suburban: true },
};

export const DEV_INITIAL_TO: Station = {
  id: '8000250',
  type: 'station',
  name: 'Wiesbaden Hbf',
  location: { type: 'location', latitude: 50.0708, longitude: 8.2435 },
  products: { national: true, suburban: true },
};

const stationMap = new Map<string, Station>(MOCK_STATIONS.map((station) => [station.id, station]));

function timestamp(date: string, time: string): string {
  return `${date}T${time}:00`;
}

// Hilfsfunktion für spontane Stationen in Mock-Routen, ohne sie in die globale Suche zu packen
function inlineStation(id: string, name: string): Station {
  return { id, type: 'station', name, location: { type: 'location', latitude: 0, longitude: 0 }, products: {} } as Station;
}

function buildLeg(overrides: Partial<Leg>, date: string, time: string): Leg {
  return {
    tripId: overrides.tripId,
    direction: overrides.direction,
    line: overrides.line,
    departure: timestamp(date, time),
    plannedDeparture: overrides.plannedDeparture,
    departureDelay: overrides.departureDelay,
    departurePlatform: overrides.departurePlatform,
    plannedDeparturePlatform: overrides.plannedDeparturePlatform,
    arrival: timestamp(date, overrides.arrival?.slice(11, 16) ?? time),
    plannedArrival: overrides.plannedArrival,
    arrivalDelay: overrides.arrivalDelay,
    arrivalPlatform: overrides.arrivalPlatform,
    plannedArrivalPlatform: overrides.plannedArrivalPlatform,
    origin: overrides.origin ?? stationMap.get('8011160')!,
    destination: overrides.destination ?? stationMap.get('8000250')!,
    stopovers: overrides.stopovers,
    distance: overrides.distance,
    walking: overrides.walking,
  };
}

function buildMockJourney(legs: Leg[]): Journey {
  return {
    type: 'journey',
    legs,
    tickets: [{ name: 'Standard fare', priceData: { amount: 39.90, currency: 'EUR' } }],
    price: { amount: 39.9, currency: 'EUR' },
  };
}

export function findMockStations(query: string): Station[] {
  const normalizeString = (str: string): string => {
    return str.trim().toLowerCase().replace(/[äöüß]/g, (char) => {
      return { ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' }[char as 'ä' | 'ö' | 'ü' | 'ß'] ?? char;
    });
  };

  const normalizedQuery = normalizeString(query);
  return MOCK_STATIONS.filter((station) => {
    const normalizedName = normalizeString(station.name);
    return normalizedName.includes(normalizedQuery) || station.id.includes(normalizedQuery);
  }).slice(0, 8);
}

export function findMockStationsByCoords(): Station[] {
  return [stationMap.get('8011160')!, stationMap.get('8000250')!];
}

export function findMockJourneys(fromId: string, toId: string, departure: string): Journey[] {
  const date = departure.split('T')[0];
  const from = stationMap.get(fromId);
  const to = stationMap.get(toId);

  if (!from || !to) return [];

  if (fromId === '8011160' && toId === '8000250') {
    return [
      // SCENARIO 1: Walk Edge-Case (Walk kürzer als Gesamtumstieg)
      buildMockJourney([
        buildLeg(
          {
            tripId: 'ICE 1003',
            direction: 'München Hbf',
            line: { type: 'line', name: 'ICE 1003', product: 'ice', operator: { name: 'Deutsche Bahn' } },
            origin: stationMap.get('8011160'),
            destination: stationMap.get('8070003'),
            departurePlatform: '1',
            arrivalPlatform: 'Fern 6',
            arrival: `${date}T09:08:00`,
          },
          date,
          '06:24'
        ),
        buildLeg(
          {
            walking: true,
            origin: stationMap.get('8070003'),
            destination: stationMap.get('8070004'),
            arrival: `${date}T09:23:00`,
          },
          date,
          '09:08'
        ),
        buildLeg(
          {
            tripId: 'S 8',
            direction: 'Wiesbaden Hbf',
            line: { type: 'line', name: 'S 8', product: 'suburban', operator: { name: 'Deutsche Bahn' } },
            origin: stationMap.get('8070004'),
            destination: stationMap.get('8000250'),
            departurePlatform: 'Regio 3',
            arrivalPlatform: '2',
            arrival: `${date}T10:13:00`,
          },
          date,
          '09:30'
        ),
      ]),

      // SCENARIO 2: Die bunte "Regenbogen"-Route für UI/Color Tests
      buildMockJourney([
        buildLeg(
          {
            tripId: 'FLX 35',
            direction: 'Stuttgart Hbf',
            line: { type: 'line', name: 'FLX 35', product: 'nationalExpress', operator: { name: 'FlixTrain' } },
            origin: stationMap.get('8011160'),
            destination: inlineStation('8000096', 'Stuttgart Hbf'),
            departurePlatform: '3',
            arrivalPlatform: '5',
            arrival: `${date}T12:45:00`,
          },
          date,
          '07:15'
        ),
        buildLeg(
          {
            tripId: 'IC 2045',
            direction: 'Tübingen Hbf',
            line: { type: 'line', name: 'IC 2045', product: 'ic', operator: { name: 'DB Fernverkehr' } },
            origin: inlineStation('8000096', 'Stuttgart Hbf'),
            destination: inlineStation('8000044', 'Heilbronn Hbf'),
            departurePlatform: '6',
            arrivalPlatform: '2',
            arrival: `${date}T13:40:00`,
          },
          date,
          '13:05'
        ),
        buildLeg(
          {
            tripId: 'MEX 12',
            direction: 'Mannheim Hbf',
            line: { type: 'line', name: 'MEX 12', product: 'regional', operator: { name: 'SWEG' } },
            origin: inlineStation('8000044', 'Heilbronn Hbf'),
            destination: inlineStation('8000244', 'Mannheim Hbf'),
            departurePlatform: '3',
            arrivalPlatform: '9',
            arrival: `${date}T14:35:00`,
          },
          date,
          '13:55'
        ),
        buildLeg(
          {
            tripId: 'RE 14',
            direction: 'Frankfurt (Main) Hbf',
            line: { type: 'line', name: 'RE 14', product: 'regionalExpress', operator: { name: 'DB Regio' } },
            origin: inlineStation('8000244', 'Mannheim Hbf'),
            destination: stationMap.get('8000105'),
            departurePlatform: '10',
            arrivalPlatform: '18',
            arrival: `${date}T15:30:00`,
          },
          date,
          '14:45'
        ),
        buildLeg(
          {
            tripId: 'RB 10',
            direction: 'Wiesbaden Hbf',
            line: { type: 'line', name: 'RB 10', product: 'regional', operator: { name: 'VIAS' } },
            origin: stationMap.get('8000105'),
            destination: stationMap.get('8000250'),
            departurePlatform: '22',
            arrivalPlatform: '4',
            arrival: `${date}T16:20:00`,
          },
          date,
          '15:45'
        )
      ]),

      // SCENARIO 3: Schienenersatzverkehr (SEV) / Bus Edge-Case
      buildMockJourney([
        buildLeg(
          {
            tripId: 'ICE 591',
            direction: 'Frankfurt (Main) Hbf',
            line: { type: 'line', name: 'ICE 591', product: 'ice', operator: { name: 'Deutsche Bahn' } },
            origin: stationMap.get('8011160'),
            destination: stationMap.get('8000105'),
            departurePlatform: '3',
            arrivalPlatform: '9',
            arrival: `${date}T11:45:00`,
          },
          date,
          '07:30'
        ),
        buildLeg(
          {
            tripId: 'SEV 12',
            direction: 'Wiesbaden Hbf',
            line: { type: 'line', name: 'Bus SEV', product: 'bus', operator: { name: 'SEV' } },
            origin: stationMap.get('8000105'),
            destination: stationMap.get('8000250'),
            departurePlatform: 'Vorplatz',
            arrivalPlatform: 'Busbahnhof',
            arrival: `${date}T13:10:00`,
          },
          date,
          '11:55'
        ),
      ]),

      // SCENARIO 4: Normale Direktverbindung (Baseline)
      buildMockJourney([
        buildLeg(
          {
            tripId: 'ICE 1095',
            direction: 'Wiesbaden Hbf',
            line: { type: 'line', name: 'ICE 1095', product: 'ice', operator: { name: 'Deutsche Bahn' } },
            origin: stationMap.get('8011160'),
            destination: stationMap.get('8000250'),
            departurePlatform: '13',
            arrivalPlatform: '4',
            arrival: `${date}T12:45:00`,
          },
          date,
          '08:30'
        ),
      ]),
      
      // SCENARIO 5: Walk zu Beginn (z.B. vom Hotel zum Bahnhof)
      buildMockJourney([
        buildLeg(
          {
            walking: true,
            origin: stationMap.get('8011160'),
            destination: inlineStation('8089021', 'Berlin Friedrichstraße'),
            arrival: `${date}T06:40:00`,
          },
          date,
          '06:25' // 15 Min Walk
        ),
        buildLeg(
          {
            tripId: 'ICE 104',
            direction: 'Basel SBB',
            line: { type: 'line', name: 'ICE 104', product: 'ice', operator: { name: 'Deutsche Bahn' } },
            origin: inlineStation('8089021', 'Berlin Friedrichstraße'),
            destination: stationMap.get('8000105'),
            departurePlatform: '3',
            arrivalPlatform: '7',
            arrival: `${date}T10:50:00`,
          },
          date,
          '06:50'
        ),
        buildLeg(
          {
            tripId: 'S 9',
            direction: 'Wiesbaden Hbf',
            line: { type: 'line', name: 'S 9', product: 'suburban', operator: { name: 'Deutsche Bahn' } },
            origin: stationMap.get('8000105'),
            destination: stationMap.get('8000250'),
            departurePlatform: '103',
            arrivalPlatform: '2',
            arrival: `${date}T11:40:00`,
          },
          date,
          '11:00'
        ),
      ]),
      
      // SCENARIO 6: Walk am Ende (z.B. von einer Vorort-Station zur finalen Zieladresse)
      buildMockJourney([
        buildLeg(
          {
            tripId: 'ICE 934',
            direction: 'Frankfurt (Main) Hbf',
            line: { type: 'line', name: 'ICE 934', product: 'ice', operator: { name: 'Deutsche Bahn' } },
            origin: stationMap.get('8011160'),
            destination: inlineStation('8000240', 'Mainz Hbf'),
            departurePlatform: '13',
            arrivalPlatform: '4',
            arrival: `${date}T13:15:00`,
          },
          date,
          '09:00'
        ),
        buildLeg(
          {
            tripId: 'RB 75',
            direction: 'Wiesbaden Hbf',
            line: { type: 'line', name: 'RB 75', product: 'regional', operator: { name: 'HLB' } },
            origin: inlineStation('8000240', 'Mainz Hbf'),
            destination: inlineStation('8004144', 'Wiesbaden Ost'),
            departurePlatform: '5',
            arrivalPlatform: '3',
            arrival: `${date}T13:35:00`,
          },
          date,
          '13:25'
        ),
        buildLeg(
          {
            walking: true,
            origin: inlineStation('8004144', 'Wiesbaden Ost'),
            destination: stationMap.get('8000250'),
            arrival: `${date}T13:55:00`,
          },
          date,
          '13:35' // 20 Min Walk ans Ziel
        ),
      ]),
    ];
  }

  return [];
}