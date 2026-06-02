import type { Leg } from './types';

export interface VagonLayout {
  index: number;
  vuz: string | null;
  name: string;
}

export function buildVagonWebParams(leg: Leg, currentLang: string) {
  const rawName = leg.line?.name || '';
  
  // 1. Zugnummer extrahieren
  let fahrtNr = (leg.line as any)?.fahrtNr;
  if (!fahrtNr) {
    const matches = rawName.match(/\d+/);
    fahrtNr = matches ? matches[0] : '';
  }

  // 2. NEU: Zug-Typ (Kategorie) extrahieren (z.B. ICE, MEX, RJX)
  // Greift alle zusammenhängenden Buchstaben am Anfang des Namens ab
  let kategorie = '';
  const typeMatch = rawName.trim().match(/^([A-Za-z]+)/);
  if (typeMatch) {
    kategorie = typeMatch[1].toUpperCase();
  }

  const currentYear = new Date().getFullYear();
  const langCode = currentLang.slice(0, 2).toLowerCase();
  
  const UIC_TO_ZEME: Record<string, string> = {
    '80': 'DB', '81': 'ÖBB', '84': 'NS', '85': 'SBB', 
    '87': 'SNCF', '54': 'ČD', '51': 'PKP', '83': 'FS', 
    '88': 'SNCB', '71': 'RENFE'
  };
  const admin = (leg.line as any)?.admin || '';
  const zeme = UIC_TO_ZEME[admin] || 'DB';

  // 3. NEU: Sauberer Aufbau der Parameter mit URLSearchParams
  const params = new URLSearchParams();
  params.append('zeme', zeme);
  
  // VagonWeb nutzt den Key "kategorie" für den Zugtyp
  if (kategorie) {
    params.append('kategorie', kategorie);
  }
  
  params.append('cislo', fahrtNr);
  params.append('rok', currentYear.toString());
  params.append('lang', langCode);

  return params.toString(); // Ergebnis z.B.: zeme=DB&kategorie=ICE&cislo=1003&rok=2026&lang=de
}