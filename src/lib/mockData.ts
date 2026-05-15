import type { Journey, Leg, Station } from './types';

export const MOCK_STATIONS: Station[] = [
  {
    id: '8000261',
    type: 'station',
    name: 'München Hbf',
    location: { type: 'location', latitude: 48.1402, longitude: 11.5589 },
    products: { national: true, suburban: true },
  },
  {
    id: '8011160',
    type: 'station',
    name: 'Berlin Hbf',
    location: { type: 'location', latitude: 52.5251, longitude: 13.3694 },
    products: { national: true, suburban: true },
  },
  {
    id: '8000143',
    type: 'station',
    name: 'Augsburg Hbf',
    location: { type: 'location', latitude: 48.3698, longitude: 10.8989 },
    products: { national: true, suburban: true },
  },
  {
    id: '8000264',
    type: 'station',
    name: 'Nürnberg Hbf',
    location: { type: 'location', latitude: 49.4452, longitude: 11.0851 },
    products: { national: true, suburban: true },
  },
  {
    id: '8000105',
    type: 'station',
    name: 'Frankfurt(Main)Hbf',
    location: { type: 'location', latitude: 50.1072, longitude: 8.6638 },
    products: { national: true, suburban: true },
  },
];

const stationMap = new Map<string, Station>(MOCK_STATIONS.map((station) => [station.id, station]));

function timestamp(date: string, time: string): string {
  return `${date}T${time}:00`;
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
    origin: overrides.origin ?? stationMap.get('8000261')!, // fallback
    destination: overrides.destination ?? stationMap.get('8011160')!,
    stopovers: overrides.stopovers,
    distance: overrides.distance,
    walking: overrides.walking,
  };
}

function buildMockJourney(date: string, legs: Leg[]): Journey {
  return {
    type: 'journey',
    legs,
    tickets: [{ name: 'Standard fare', priceData: { amount: 39.90, currency: 'EUR' } }],
    price: { amount: 39.9, currency: 'EUR' },
  };
}

export function findMockStations(query: string): Station[] {
  const normalized = query.trim().toLowerCase().replace(/[äöüß]/g, (char) => {
    return { ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' }[char as 'ä' | 'ö' | 'ü' | 'ß'] ?? char;
  });
  return MOCK_STATIONS.filter((station) => {
    const name = station.name.toLowerCase();
    return name.includes(normalized) || station.id.includes(normalized);
  }).slice(0, 8);
}

export function findMockStationsByCoords(): Station[] {
  return [stationMap.get('8000261')!, stationMap.get('8000143')!];
}

export function findMockJourneys(fromId: string, toId: string, departure: string): Journey[] {
  const date = departure.split('T')[0];
  const from = stationMap.get(fromId);
  const to = stationMap.get(toId);

  if (!from || !to) return [];

  if (fromId === '8000261' && toId === '8011160') {
    return [
      buildMockJourney(date, [
        buildLeg(
          {
            tripId: 'ICE 574',
            direction: 'Berlin Hbf',
            line: { type: 'line', name: 'ICE 574', product: 'ice', operator: { name: 'Deutsche Bahn' } },
            origin: stationMap.get('8000261'),
            destination: stationMap.get('8011160'),
            departurePlatform: '11',
            arrivalPlatform: '12',
            arrival: `${date}T13:15:00`,
          },
          date,
          '08:30'
        ),
      ]),
      buildMockJourney(date, [
        buildLeg(
          {
            tripId: 'ICE 612',
            direction: 'Nürnberg Hbf',
            line: { type: 'line', name: 'ICE 612', product: 'ice', operator: { name: 'Deutsche Bahn' } },
            origin: stationMap.get('8000261'),
            destination: stationMap.get('8000264'),
            departurePlatform: '11',
            arrivalPlatform: '14',
            arrival: `${date}T10:05:00`,
            stopovers: [
              {
                stop: stationMap.get('8000143')!,
                arrival: `${date}T09:10:00`,
                departure: `${date}T09:12:00`,
              },
            ],
          },
          date,
          '07:20'
        ),
        buildLeg(
          {
            tripId: 'ICE 178',
            direction: 'Berlin Hbf',
            line: { type: 'line', name: 'ICE 178', product: 'ice', operator: { name: 'Deutsche Bahn' } },
            origin: stationMap.get('8000264'),
            destination: stationMap.get('8011160'),
            departurePlatform: '14',
            arrivalPlatform: '12',
            arrival: `${date}T14:30:00`,
          },
          date,
          '10:15'
        ),
      ]),
    ];
  }

  if (fromId === '8000261' && toId === '8000143') {
    return [
      buildMockJourney(date, [
        buildLeg(
          {
            tripId: 'RE 5874',
            direction: 'Augsburg Hbf',
            line: { type: 'line', name: 'RE 5874', product: 'regionalExpress', operator: { name: 'Deutsche Bahn' } },
            origin: stationMap.get('8000261'),
            destination: stationMap.get('8000143'),
            departurePlatform: '16',
            arrivalPlatform: '4',
            arrival: `${date}T09:05:00`,
          },
          date,
          '08:20'
        ),
      ]),
    ];
  }

  return [
    buildMockJourney(date, [
      buildLeg(
        {
          tripId: 'IC 250',
          direction: to.name,
          line: { type: 'line', name: 'IC 250', product: 'ic', operator: { name: 'Deutsche Bahn' } },
          origin: from,
          destination: to,
          departurePlatform: '8',
          arrivalPlatform: '2',
          arrival: `${date}T${String(Number(departure.split('T')[1].slice(0,2)) + 3).padStart(2,'0')}:15:00`,
        },
        date,
        departure.split('T')[1].slice(0,5)
      ),
    ]),
  ];
}
