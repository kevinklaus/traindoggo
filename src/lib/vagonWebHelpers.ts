import type { Leg } from './types';

export interface VagonLayout {
  index: number;
  vuz: string | null;
  name: string;
}

export function buildVagonWebParams(leg: Leg, currentLang: string) {
  const rawName = leg.line?.name || '';
  
  let fahrtNr = (leg.line as any)?.fahrtNr;
  if (!fahrtNr) {
    const matches = rawName.match(/\d+/);
    fahrtNr = matches ? matches[0] : '';
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

  return `zeme=${zeme}&cislo=${fahrtNr}&rok=${currentYear}&lang=${langCode}`;
}