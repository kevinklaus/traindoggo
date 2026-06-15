import type { Journey, DogMode } from './types';

export interface ScoreBreakdown {
  key: string;
  points: number;
  val?: number;
}

export interface DoggoScoreResult {
  total: number;
  breakdown: ScoreBreakdown[];
}

export function calculateDoggoScore(journey: Journey, dogMode: DogMode): DoggoScoreResult {
  if (dogMode === 'none') return { total: 100, breakdown: [] };

  let score = 100;
  // das array startet leer – kein startwert, kein ausgleich
  const breakdown: ScoreBreakdown[] = []; 
  
  // wir filtern auf echte züge
  const transitLegs = journey.legs.filter(l => !l.walking);

  // 1. UMSTIEGE
  const transfers = Math.max(0, transitLegs.length - 1);
  if (transfers === 0) { 
    score += 10; 
    breakdown.push({ key: 'direct', points: 10 }); 
  } else if (transfers === 2) { 
    score -= 10; 
    breakdown.push({ key: 'transfers', points: -10, val: 2 }); 
  } else if (transfers >= 3) { 
    score -= 25; 
    breakdown.push({ key: 'transfers', points: -25, val: transfers }); 
  }

  for (let i = 0; i < transitLegs.length; i++) {
    const leg = transitLegs[i];

    // 2. UMSTIEGSZEITEN
    if (i > 0) {
      const prevLeg = transitLegs[i - 1];
      if (leg.departure && prevLeg.arrival) {
        // absolut sichere inline-berechnung der echten wartezeit in minuten
        const transferMin = Math.round((new Date(leg.departure).getTime() - new Date(prevLeg.arrival).getTime()) / 60000);
        
        if (transferMin < 15) { 
          score -= 30; breakdown.push({ key: 'transferShort', points: -30, val: transferMin }); 
        } else if (transferMin >= 15 && transferMin < 25) { 
          score -= 15; breakdown.push({ key: 'transferMid', points: -15, val: transferMin }); 
        } else if (transferMin >= 25 && transferMin <= 45) { 
          score += 5; breakdown.push({ key: 'transferPerfect', points: 5, val: transferMin }); 
        } else if (transferMin > 45 && transferMin <= 120) { 
          score += 20; breakdown.push({ key: 'transferGood', points: 20, val: transferMin }); 
        }
      }
    }

    // 3. ETAPPEN-LÄNGE
    if (leg.departure && leg.arrival) {
      // auch hier: sichere berechnung ohne zeitzonen-verschiebungen
      const durationMin = Math.round((new Date(leg.arrival).getTime() - new Date(leg.departure).getTime()) / 60000);
      const depHour = new Date(leg.departure).getHours();
      const arrHour = new Date(leg.arrival).getHours();
      
      const isNightTrain = (depHour >= 17 || depHour <= 2) && (arrHour >= 4 && arrHour <= 10) && durationMin > 240;

      if (isNightTrain) {
        if (durationMin > 720) { 
          score -= 15; breakdown.push({ key: 'nightLong', points: -15 }); 
        }
      } else {
        if (durationMin > 540) { 
          // Über 9h
          score -= 15; breakdown.push({ key: 'legLong', points: -15 }); 
        } else if (durationMin > 320) { 
          // Über 6h
          score -= 5; breakdown.push({ key: 'legMid', points: -5 }); 
        }
      }
    }

    // 4. AUSLASTUNG
    if (leg.loadFactor === 'very-high') { score -= 30; breakdown.push({ key: 'loadVeryHigh', points: -30 }); }
    else if (leg.loadFactor === 'high') { score -= 15; breakdown.push({ key: 'loadHigh', points: -15 }); }
  }

  const total = Math.max(0, Math.min(100, score));
  // der `capped`-eintrag wird hier bewusst weggelassen
  
  return { total, breakdown };
}