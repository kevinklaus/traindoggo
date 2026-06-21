import type { Station } from './types';

// Top 10 Startbahnhöfe in Deutschland
const TOP_GERMAN_CITIES: Station[] = [
  { id: '8011160', name: 'Berlin Hbf', type: 'station' },
  { id: '8002549', name: 'Hamburg Hbf', type: 'station' },
  { id: '8000261', name: 'München Hbf', type: 'station' },
  { id: '8000207', name: 'Köln Hbf', type: 'station' },
  { id: '8000105', name: 'Frankfurt (Main) Hbf', type: 'station' },
  { id: '8000096', name: 'Stuttgart Hbf', type: 'station' },
  { id: '8000085', name: 'Düsseldorf Hbf', type: 'station' },
  { id: '8010195', name: 'Leipzig Hbf', type: 'station' },
  { id: '8000107', name: 'Freiburg(Breisgau) Hbf', type: 'station' },
  { id: '8000098', name: 'Essen Hbf', type: 'station' },
];

// Top 10 EU Ziele (EVA-Nummern verifiziert für DB/ÖBB HAFAS)
const TOP_EU_CITIES: Station[] = [
  { id: '8103000', name: 'Wien Hbf', type: 'station' },
  { id: '8503000', name: 'Zürich HB', type: 'station' },
  { id: '8400058', name: 'Amsterdam Centraal', type: 'station' },
  { id: '5400014', name: 'Praha hl.n.', type: 'station' },
  { id: '8500010', name: 'Basel SBB', type: 'station' },
  { id: '8100002', name: 'Salzburg Hbf', type: 'station' },
  { id: '8300333', name: 'Sapri', type: 'station' },
  { id: '8300084', name: 'Bozen/Bolzano', type: 'station' },
  { id: '8300046', name: 'Milano Centrale', type: 'station' },
  { id: '8601309', name: 'København H', type: 'station' },
  { id: '8800004', name: 'Bruxelles-Midi', type: 'station' },
  { id: '8796001', name: 'PARIS', type: 'station' },
  { id: '5600207', name: 'Bratislava hl.st.', type: 'station' }, 
  { id: '7400004', name: 'Malmö Central', type: 'station' }, 
  { id: '5596001', name: 'BUDAPEST', type: 'station' },   
];

export function getRandomRoute(): { from: Station; to: Station } {
  const from = TOP_GERMAN_CITIES[Math.floor(Math.random() * TOP_GERMAN_CITIES.length)];
  const to = TOP_EU_CITIES[Math.floor(Math.random() * TOP_EU_CITIES.length)];
  return { from, to };
}