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
    name: 'Frankfurt (Main) Hbf',
    location: { type: 'location', latitude: 50.1072, longitude: 8.6638 },
    products: { national: true, suburban: true },
  },
  {
    id: '8000089',
    type: 'station',
    name: 'Köln Hbf',
    location: { type: 'location', latitude: 50.9426, longitude: 6.9603 },
    products: { national: true, suburban: true },
  },
  {
    id: '8000191',
    type: 'station',
    name: 'Düsseldorf Hbf',
    location: { type: 'location', latitude: 51.3214, longitude: 7.1101 },
    products: { national: true, suburban: true },
  },
  {
    id: '8002553',
    type: 'station',
    name: 'Hamburg Hbf',
    location: { type: 'location', latitude: 53.5527, longitude: 10.0066 },
    products: { national: true, suburban: true },
  },
  {
    id: '8000207',
    type: 'station',
    name: 'Hannover Hbf',
    location: { type: 'location', latitude: 52.3765, longitude: 9.7408 },
    products: { national: true, suburban: true },
  },
  {
    id: '8000290',
    type: 'station',
    name: 'Stuttgart Hbf',
    location: { type: 'location', latitude: 48.7844, longitude: 9.1813 },
    products: { national: true, suburban: true },
  },
  {
    id: '8000260',
    type: 'station',
    name: 'Munich East Station',
    location: { type: 'location', latitude: 48.1239, longitude: 11.5951 },
    products: { national: true, suburban: true },
  },
  {
    id: '8000085',
    type: 'station',
    name: 'Dresden Hbf',
    location: { type: 'location', latitude: 51.0399, longitude: 13.6455 },
    products: { national: true, suburban: true },
  },
  {
    id: '8000159',
    type: 'station',
    name: 'Ingolstadt Hbf',
    location: { type: 'location', latitude: 48.7633, longitude: 11.4233 },
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
  return [stationMap.get('8000261')!, stationMap.get('8000143')!];
}

export function findMockJourneys(fromId: string, toId: string, departure: string): Journey[] {
  const date = departure.split('T')[0];
  const from = stationMap.get(fromId);
  const to = stationMap.get(toId);

  if (!from || !to) return [];

  // Munich to Berlin - Direct, 1 transfer, and 3+ transfers with mixed train types
  if (fromId === '8000261' && toId === '8011160') {
    return [
      // Direct ICE (fastest)
      buildMockJourney([
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
      // One transfer: ICE → ICE via Nürnberg
      buildMockJourney([
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
      // Two transfers: IC → RE → ICE
      buildMockJourney([
        buildLeg(
          {
            tripId: 'IC 289',
            direction: 'Ingolstadt Hbf',
            line: { type: 'line', name: 'IC 289', product: 'ic', operator: { name: 'Deutsche Bahn' } },
            origin: stationMap.get('8000261'),
            destination: stationMap.get('8000159'),
            departurePlatform: '7',
            arrivalPlatform: '5',
            arrival: `${date}T10:45:00`,
          },
          date,
          '09:00'
        ),
        buildLeg(
          {
            tripId: 'RE 3847',
            direction: 'Nürnberg Hbf',
            line: { type: 'line', name: 'RE 3847', product: 'regionalExpress', operator: { name: 'Deutsche Bahn' } },
            origin: stationMap.get('8000159'),
            destination: stationMap.get('8000264'),
            departurePlatform: '3',
            arrivalPlatform: '9',
            arrival: `${date}T12:30:00`,
          },
          date,
          '11:05'
        ),
        buildLeg(
          {
            tripId: 'ICE 505',
            direction: 'Berlin Hbf',
            line: { type: 'line', name: 'ICE 505', product: 'ice', operator: { name: 'Deutsche Bahn' } },
            origin: stationMap.get('8000264'),
            destination: stationMap.get('8011160'),
            departurePlatform: '4',
            arrivalPlatform: '12',
            arrival: `${date}T16:00:00`,
          },
          date,
          '13:00'
        ),
      ]),
      // Three transfers: FLX → RE → S → ICE
      buildMockJourney([
        buildLeg(
          {
            tripId: 'FLX 309',
            direction: 'Augsburg Hbf',
            line: { type: 'line', name: 'FLX 309', product: 'bus', operator: { name: 'FlixBus' } },
            origin: stationMap.get('8000261'),
            destination: stationMap.get('8000143'),
            departurePlatform: 'Platform 4',
            arrivalPlatform: 'Platform 1',
            arrival: `${date}T09:50:00`,
          },
          date,
          '08:00'
        ),
        buildLeg(
          {
            tripId: 'RE 5888',
            direction: 'Ingolstadt Hbf',
            line: { type: 'line', name: 'RE 5888', product: 'regionalExpress', operator: { name: 'Deutsche Bahn' } },
            origin: stationMap.get('8000143'),
            destination: stationMap.get('8000159'),
            departurePlatform: '2',
            arrivalPlatform: '4',
            arrival: `${date}T11:15:00`,
          },
          date,
          '10:20'
        ),
        buildLeg(
          {
            tripId: 'S 4',
            direction: 'Nürnberg Hbf',
            line: { type: 'line', name: 'S 4', product: 'suburban', operator: { name: 'Deutsche Bahn' } },
            origin: stationMap.get('8000159'),
            destination: stationMap.get('8000264'),
            departurePlatform: '1',
            arrivalPlatform: '8',
            arrival: `${date}T12:50:00`,
          },
          date,
          '11:45'
        ),
        buildLeg(
          {
            tripId: 'ICE 178',
            direction: 'Berlin Hbf',
            line: { type: 'line', name: 'ICE 178', product: 'ice', operator: { name: 'Deutsche Bahn' } },
            origin: stationMap.get('8000264'),
            destination: stationMap.get('8011160'),
            departurePlatform: '9',
            arrivalPlatform: '12',
            arrival: `${date}T17:30:00`,
          },
          date,
          '13:15'
        ),
      ]),
    ];
  }

  // Munich to Augsburg - Direct, 1 transfer, 2 transfers with FLX
  if (fromId === '8000261' && toId === '8000143') {
    return [
      // Direct RE
      buildMockJourney([
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
      // One transfer: S → RE
      buildMockJourney([
        buildLeg(
          {
            tripId: 'S 7',
            direction: 'Ingolstadt Hbf',
            line: { type: 'line', name: 'S 7', product: 'suburban', operator: { name: 'Deutsche Bahn' } },
            origin: stationMap.get('8000261'),
            destination: stationMap.get('8000159'),
            departurePlatform: '1',
            arrivalPlatform: '2',
            arrival: `${date}T09:30:00`,
          },
          date,
          '08:50'
        ),
        buildLeg(
          {
            tripId: 'RE 5880',
            direction: 'Augsburg Hbf',
            line: { type: 'line', name: 'RE 5880', product: 'regionalExpress', operator: { name: 'Deutsche Bahn' } },
            origin: stationMap.get('8000159'),
            destination: stationMap.get('8000143'),
            departurePlatform: '3',
            arrivalPlatform: '2',
            arrival: `${date}T10:45:00`,
          },
          date,
          '09:50'
        ),
      ]),
      // Two transfers: FLX → S → RE
      buildMockJourney([
        buildLeg(
          {
            tripId: 'FLX 204',
            direction: 'Ingolstadt Hbf',
            line: { type: 'line', name: 'FLX 204', product: 'bus', operator: { name: 'FlixBus' } },
            origin: stationMap.get('8000261'),
            destination: stationMap.get('8000159'),
            departurePlatform: 'Platform 2',
            arrivalPlatform: 'Platform 1',
            arrival: `${date}T10:00:00`,
          },
          date,
          '08:45'
        ),
        buildLeg(
          {
            tripId: 'S 2',
            direction: 'Augsburg Hbf',
            line: { type: 'line', name: 'S 2', product: 'suburban', operator: { name: 'Deutsche Bahn' } },
            origin: stationMap.get('8000159'),
            destination: stationMap.get('8000143'),
            departurePlatform: '1',
            arrivalPlatform: '1',
            arrival: `${date}T11:25:00`,
          },
          date,
          '10:30'
        ),
      ]),
    ];
  }

  // Berlin to Hamburg - Direct, 1 transfer, 2 transfers
  if (fromId === '8011160' && toId === '8002553') {
    return [
      // Direct ICE
      buildMockJourney([
        buildLeg(
          {
            tripId: 'ICE 501',
            direction: 'Hamburg Hbf',
            line: { type: 'line', name: 'ICE 501', product: 'ice', operator: { name: 'Deutsche Bahn' } },
            origin: stationMap.get('8011160'),
            destination: stationMap.get('8002553'),
            departurePlatform: '12',
            arrivalPlatform: '7',
            arrival: `${date}T12:05:00`,
          },
          date,
          '08:05'
        ),
      ]),
      // One transfer: RE → ICE via Hannover
      buildMockJourney([
        buildLeg(
          {
            tripId: 'RE 3040',
            direction: 'Hannover Hbf',
            line: { type: 'line', name: 'RE 3040', product: 'regionalExpress', operator: { name: 'Deutsche Bahn' } },
            origin: stationMap.get('8011160'),
            destination: stationMap.get('8000207'),
            departurePlatform: '5',
            arrivalPlatform: '6',
            arrival: `${date}T10:30:00`,
          },
          date,
          '08:45'
        ),
        buildLeg(
          {
            tripId: 'ICE 206',
            direction: 'Hamburg Hbf',
            line: { type: 'line', name: 'ICE 206', product: 'ice', operator: { name: 'Deutsche Bahn' } },
            origin: stationMap.get('8000207'),
            destination: stationMap.get('8002553'),
            departurePlatform: '4',
            arrivalPlatform: '7',
            arrival: `${date}T12:50:00`,
          },
          date,
          '10:50'
        ),
      ]),
      // Two transfers: S → RE → ICE
      buildMockJourney([
        buildLeg(
          {
            tripId: 'S 25',
            direction: 'Hannover Hbf',
            line: { type: 'line', name: 'S 25', product: 'suburban', operator: { name: 'Deutsche Bahn' } },
            origin: stationMap.get('8011160'),
            destination: stationMap.get('8000207'),
            departurePlatform: '1',
            arrivalPlatform: '10',
            arrival: `${date}T11:05:00`,
          },
          date,
          '10:15'
        ),
        buildLeg(
          {
            tripId: 'RE 3050',
            direction: 'Hamburg Hbf',
            line: { type: 'line', name: 'RE 3050', product: 'regionalExpress', operator: { name: 'Deutsche Bahn' } },
            origin: stationMap.get('8000207'),
            destination: stationMap.get('8002553'),
            departurePlatform: '7',
            arrivalPlatform: '4',
            arrival: `${date}T13:20:00`,
          },
          date,
          '11:30'
        ),
      ]),
    ];
  }

  // Generic fallback
  const depTime = departure.split('T')[1].slice(0, 5);
  const depHour = Number(depTime.slice(0, 2));
  const arrivalHour = (depHour + 3) % 24;

  return [
    buildMockJourney([
      buildLeg(
        {
          tripId: 'ICE 100',
          direction: to.name,
          line: { type: 'line', name: 'ICE 100', product: 'ice', operator: { name: 'Deutsche Bahn' } },
          origin: from,
          destination: to,
          departurePlatform: '8',
          arrivalPlatform: '2',
          arrival: `${date}T${String(arrivalHour).padStart(2, '0')}:15:00`,
        },
        date,
        depTime
      ),
    ]),
  ];
}
