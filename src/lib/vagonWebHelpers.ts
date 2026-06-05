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
// 3. LAND / BETREIBER (Zeme) über UIC
  const UIC_TO_ZEME: Record<string, string> = {
    '10': 'VR',   // Finnland
    '22': 'UZ',   // Ukraine
    '23': 'CFM',  // Moldawien
    '41': 'HSH',  // Albanien
    '44': 'ZRS',  // Bosnien (Republika Srpska)
    '50': 'ZFBH', // Bosnien und Herzegowina (Föderation)
    '51': 'PKP',  // Polen
    '53': 'CFR',  // Rumänien
    '54': 'CD',   // Tschechien
    '55': 'MAV',  // Ungarn
    '56': 'ZSSK', // Slowakei
    '58': 'HKE',  // Armenien
    '60': 'IE',   // Irland
    '62': 'ZPCG', // Montenegro
    '65': 'MZ',   // Nordmazedonien
    '70': 'GB',   // Vereinigtes Königreich
    '71': 'RENFE',// Spanien
    '72': 'SV',   // Serbien
    '73': 'HTR',  // Griechenland
    '74': 'SJ',   // Schweden
    '75': 'TCDD', // Türkei
    '76': 'VY',   // Norwegen
    '3822': 'VY',   // Norwegen 
    '78': 'HZPP', // Kroatien
    '79': 'SZ',   // Slowenien
    '80': 'DB',   // Deutschland
    '81': 'OBB',  // Österreich (ohne Umlaut!)
    '82': 'CFL',  // Luxemburg
    '83': 'TI',   // Italien (Trenitalia, ehemals FS)
    '84': 'NS',   // Niederlande
    '85': 'SBB',  // Schweiz
    '87': 'SNCF', // Frankreich
    '88': 'SNCB', // Belgien
    '94': 'CP',   // Portugal
  };
  
  // FIX: Hafas nutzt 'adminCode', nicht 'admin'!
  let admin = (leg.line as any)?.adminCode || (leg.line as any)?.admin || '';
  let zeme = ''; // Standard-Fallback
  
  if (admin && admin.length >= 2) {
    const uic = admin.substring(0, 2);
    if (UIC_TO_ZEME[uic]) zeme = UIC_TO_ZEME[uic];
    if (zeme === 'SZ' || zeme === 'HZPP' || zeme === 'MAV' || zeme === 'CFR') {
      if (kategorie === 'R' || kategorie === 'D') kategorie = ''; // Slovenische, kroatische und ungarische Regionalzüge haben oft Kategorie R, aber in VagonWEB sind sie ohne Kategorie unter SZ zu finden
    }
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
  // PKP InterCity
  else if (opId.includes('pkp-intercity') || opName.includes('PKP Intercity')) {
    zeme = 'PKPIC';
    if (fahrtNr && fahrtNr.length === 5 || fahrtNr.length === 4) {
      const lastDigit = parseInt(fahrtNr.slice(-1), 10);
      const base = fahrtNr.slice(0, -1);
      
      if (lastDigit % 2 === 0) {
        // Letzte Ziffer ist gerade (z.B. 83106 -> 83106/7)
        fahrtNr = `${fahrtNr}/${lastDigit + 1}`;
      } else {
        // Letzte Ziffer ist ungerade (z.B. 83107 -> 83106/7)
        fahrtNr = `${base}${lastDigit - 1}/${lastDigit}`;
      }
    }
    if (kategorie === 'EC' && fahrtNr && fahrtNr.startsWith('4')) {
      zeme = 'DB'; // EC-Züge der PKP sind in VagonWEB unter DB mit der kurzen Nummer auffindbar (z.B. EC 43 statt EIC  43/71010/1)
    }
    else if (kategorie === 'EC' && fahrtNr && fahrtNr.startsWith('10') || fahrtNr.startsWith('20') || fahrtNr.startsWith('30') || fahrtNr.startsWith('40')) {
      zeme = 'CD'; // EC-Züge der PKP sind in VagonWEB unter CD mit der kurzen Nummer auffindbar (z.B. EC 107 statt IC 107/14012/3)
    }
  }
  // Polregio
  else if (opId.includes('polregio') || opName.includes('Polregio')) {
    zeme = 'PREG';
  }
  // Vy
  else if (opId.includes('vy') || opName.includes('Vy')) {
    zeme = 'VY';
    if (kategorie === 'R' || kategorie === 'D') kategorie = ''; // Vy Regionalzüge haben oft Kategorie R, aber in VagonWEB sind sie ohne Kategorie unter VY zu finden
  }
    // Vy
  else if (opId.includes('go-ahead') || opName.includes('Go-Ahead')) {
    zeme = 'GA';
    if (kategorie === 'R' || kategorie === 'D') kategorie = ''; // Go-Ahead Regionalzüge haben oft Kategorie R, aber in VagonWEB sind sie ohne Kategorie unter GA zu finden
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
  // EuroNight mit 5-stelliger Zugnummer haben in VagonWEB oft das Format 12345/@, nicht 12345
  else if (kategorie === 'EN' && fahrtNr.length === 5) {
    fahrtNr = fahrtNr + '/@';
  } 
  // OUIGO
  else if (kategorie === 'OGV') {
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