import type { Leg } from './types';

export interface VagonLayout {
  index: number;
  vuz: string | null;
  name: string;
}

export function buildVagonWebParams(leg: Leg, currentLang: string) {
  // --- ZUSATZFAHRT ABBRUCH ---
  const isZusatzfahrt = (leg as any).remarks?.some((r: any) => 
    r.text && r.text.toLowerCase().includes('zusatzfahrt')
  );
  
  if (isZusatzfahrt) {
    return null;
  }

  const rawName = leg.line?.name || '';
  
  // 1. ZUGNUMMER (FahrtNr)
  let fahrtNr = (leg.line as any)?.fahrtNr;
  if (!fahrtNr) {
    const matches = rawName.match(/\d+/);
    fahrtNr = matches ? matches[0] : '';
  }

  // 2. KATEGORIE (z.B. ICE, EC, RJ, TGV)
  let kategorie = '';
  const typeMatch = rawName.trim().match(/^([A-Za-z]+)/);
  if (typeMatch) {
    kategorie = typeMatch[1].toUpperCase();
  }

  // 3. LAND / BETREIBER (Zeme) über UIC
  const UIC_TO_ZEME: Record<string, string> = {
    '80': 'DB', '81': 'OBB', '84': 'NS', '85': 'SBB', // FIX: OBB ohne Umlaut!
    '87': 'SNCF', '54': 'CD', '51': 'PKP', '83': 'FS', 
    '88': 'SNCB', '71': 'RENFE', '56': 'ZSSK', '74': 'SJ',
  };
  
  // FIX: Hafas nutzt 'adminCode', nicht 'admin'!
  let admin = (leg.line as any)?.adminCode || (leg.line as any)?.admin || '';
  let zeme = ''; // Standard-Fallback
  
  if (admin && admin.length >= 2) {
    const uic = admin.substring(0, 2);
    if (UIC_TO_ZEME[uic]) zeme = UIC_TO_ZEME[uic];
  }

  // 4. OPERATOR OVERRIDES (Präzise Checks)
  const opId = ((leg.line?.operator as any)?.id || '').toLowerCase();
  const opName = ((leg.line?.operator as any)?.name || '').toLowerCase();

  // Tschechische Bahn (CD)
  if (opId.includes('ceske drahy') || opName.includes('ceske drahy') || opId.includes('české dráhy') || opName.includes('české dráhy')) {
    zeme = 'CD';
  }
  // DB
  else if (opId.includes('db') || opName.includes('db') || opId.includes('deutsche bahn') || opName.includes('deutsche bahn') || kategorie === 'ICE' ) {
    zeme = 'DB';
  }
  // ÖBB (FIX: Zwingend OBB ohne Umlaut zurückgeben!)
  else if (opId.includes('öbb') || opName.includes('öbb') || opId.includes('oebb') || opName.includes('oebb')) {
    zeme = 'OBB';
  }
  // RegioJet (Zwingt zeme UND kategorie auf RJ)
  else if (opId.includes('regiojet') || opName.includes('regiojet')) {
    zeme = 'RJ';
    kategorie = 'RJ'; 
  }
  // SJ
  else if (opId.includes('sj') || opName.includes('sj')) {
    zeme = 'SJ';
    if (kategorie === 'X') kategorie = ''; // bei X ist kategorie leer in VagonWEB
    if (kategorie === 'D') kategorie = ''; // bei D ist kategorie leer in VagonWEB
  } 
  // Snälltåget
  else if (opId.includes('snalltaget') || opName.includes('Snälltåget')) {
    zeme = 'SNALL';
    kategorie = ''; // bei Snälltåget ist kategorie leer in VagonWEB
  } 
  // Andere Privatbahnen in DE
  else if (opId.includes('odeg') || opId.includes('flixtrain') || opId.includes('go-ahead') || opName.includes('national express')) {
    zeme = 'D-';
  } 
  // European Sleeper
  else if (opName.includes('european sleeper')) {
    zeme = 'D-';
  }
  // Eurostar
  else if (opName.includes('eurostar') || opId.includes('eurostar')) {
    zeme = 'EIL';
    kategorie = 'ES'; // Eurostar hat oft eigene Kategorie ES in VagonWEB
  }
  // Länderbahn
  else if (opName.includes('dlb') || opId.includes('dlb')) {
    zeme = 'DLB';
  }
  // Arriva
  else if (opName.includes('arriva') || opId.includes('arriva')) {
    zeme = 'ARV';
    kategorie = 'R';
  }

  // 5. HARTE ZUGTYP-FALLBACKS (Wenn Operator fehlt)
  if (kategorie === 'TGV') {
    zeme = 'SNCF';
  } 
  // OUIGO
  if (kategorie === 'OGV') {
    zeme = 'SNCF';
    kategorie = 'OUIGO';
  } 
  else if (kategorie === 'EX' && zeme === '') {
    // Wenn EX und kein anderer Operator erkannt wurde (ZSSK Fallback)
    zeme = 'ZSSK';
  } 
  else if (kategorie === 'FLX') {
    // FlixTrain Fallback
    zeme = 'D-';
    kategorie = ''; 
  }

  // 6. URL PARAMETER ZUSAMMENBAUEN
  const currentYear = new Date().getFullYear();
  const langCode = currentLang.slice(0, 2).toLowerCase();

  const params = new URLSearchParams();
  params.append('zeme', zeme);
  
  if (kategorie) params.append('kategorie', kategorie);
  params.append('cislo', fahrtNr);
  params.append('rok', currentYear.toString());
  params.append('lang', langCode);

  console.log("🚂 VagonWeb Params:", Object.fromEntries(params.entries()));

  return params.toString();
}