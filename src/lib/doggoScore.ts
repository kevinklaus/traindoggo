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

// NEU: Berechnet den Median, um Ausreißer (wie einzelne Nachtzüge) zu ignorieren
export function getMedianJourneyDuration(journeys: Journey[]): number {
  const durations: number[] = [];
  
  journeys.forEach(j => {
    const dep = j.legs[0]?.departure;
    const arr = j.legs[j.legs.length - 1]?.arrival;
    if (dep && arr) {
      const dur = Math.round((new Date(arr).getTime() - new Date(dep).getTime()) / 60000);
      if (dur > 0) durations.push(dur);
    }
  });

  if (durations.length === 0) return 0;
  
  durations.sort((a, b) => a - b);
  const mid = Math.floor(durations.length / 2);
  
  if (durations.length % 2 === 0) {
    return Math.round((durations[mid - 1] + durations[mid]) / 2);
  }
  return durations[mid];
}

export function calculateDoggoScore(
  journey: Journey, 
  dogMode: DogMode, 
  comparisonDurationMin: number = 0 // <-- Neutraler Name für den Vergleichswert
): DoggoScoreResult {
  if (dogMode === 'none') return { total: 100, breakdown: [] };

  let score = 100;
  const breakdown: ScoreBreakdown[] = []; 
  
  const transitLegs = journey.legs.filter(l => !l.walking);

  // --- 1. GLOBALE REISE-METRIKEN ---
  const firstDeparture = journey.legs[0]?.departure;
  const lastArrival = journey.legs[journey.legs.length - 1]?.arrival;
  let journeyDurationMin = 0;

  if (firstDeparture && lastArrival) {
    journeyDurationMin = Math.round((new Date(lastArrival).getTime() - new Date(firstDeparture).getTime()) / 60000);
    
    const day = new Date(firstDeparture).getDay();
    const isRecommended = [2, 3, 4, 6].includes(day); 
    if (!isRecommended) {
      score -= 10;
      breakdown.push({ key: 'busyDay', points: -10 });
    }

    // Relative Reisezeit (Vergleich zum stabilen Median)
    if (comparisonDurationMin > 0 && journeyDurationMin > 0) {
      const diff = comparisonDurationMin - journeyDurationMin;
      if (diff >= 60) {
        score += 15;
        breakdown.push({ key: 'veryFastTrip', points: 15 });
      } else if (diff >= 30) {
        score += 10;
        breakdown.push({ key: 'fastTrip', points: 10 });
      }
    }
  }

  // --- 2. UMSTIEGE ---
  const transfers = Math.max(0, transitLegs.length - 1);
  if (transfers === 0) { 
    score += 10; breakdown.push({ key: 'direct', points: 10 }); 
  } else if (transfers === 2) { 
    score -= 10; breakdown.push({ key: 'transfers', points: -10, val: 2 }); 
  } else if (transfers >= 3) { 
    score -= 25; breakdown.push({ key: 'transfers', points: -25, val: transfers }); 
  }

  for (let i = 0; i < transitLegs.length; i++) {
    const leg = transitLegs[i];

    // --- 3. UMSTIEGSZEITEN ---
    if (i > 0) {
      const prevLeg = transitLegs[i - 1];
      if (leg.departure && prevLeg.arrival) {
        const transferMin = Math.round((new Date(leg.departure).getTime() - new Date(prevLeg.arrival).getTime()) / 60000);
        
        if (transferMin < 15) { 
          score -= 30; breakdown.push({ key: 'transferShort', points: -30, val: transferMin }); 
        } else if (transferMin >= 15 && transferMin < 25) { 
          score -= 15; breakdown.push({ key: 'transferMid', points: -15, val: transferMin }); 
        } else if (transferMin >= 25 && transferMin <= 45) { 
          score += 5; breakdown.push({ key: 'quickBreak', points: 5, val: transferMin }); 
        } else if (transferMin > 45 && transferMin <= 120) { 
          score += 20; breakdown.push({ key: 'transferGood', points: 20, val: transferMin }); 
        }
      }
    }

    // --- 4. ETAPPEN-LÄNGE & NACHTZUG ---
    if (leg.departure && leg.arrival) {
      const durationMin = Math.round((new Date(leg.arrival).getTime() - new Date(leg.departure).getTime()) / 60000);
      const depHour = new Date(leg.departure).getHours();
      const arrHour = new Date(leg.arrival).getHours();
      
      const isNightTrain = (depHour >= 17 || depHour <= 2) && (arrHour >= 4 && arrHour <= 10) && durationMin > 320;

      if (isNightTrain) {
        if (durationMin > 720) { 
          score -= 10; breakdown.push({ key: 'nightLong', points: -10 }); 
        }
      } else {
        if (durationMin > 540) { score -= 25; breakdown.push({ key: 'legLong', points: -25 }); } 
        else if (durationMin > 380) { score -= 15; breakdown.push({ key: 'legMid', points: -15 }); }
        else if (durationMin > 320) { score -= 5; breakdown.push({ key: 'legMid', points: -5 }); }
      }
      
      const name = (leg.line?.name ?? '').toLowerCase();
      const product = (leg.line?.product ?? '').toLowerCase();
      const isRegio = name.startsWith('re') || name.startsWith('rb') || product === 'suburban' || name.startsWith('s ') || name.startsWith('mex');
      
      if (isRegio) {
        const depTime = new Date(leg.departure);
        const arrTime = new Date(leg.arrival);
        
        const startMins = depTime.getHours() * 60 + depTime.getMinutes();
        let endMins = arrTime.getHours() * 60 + arrTime.getMinutes();
        if (arrTime.getDate() !== depTime.getDate()) endMins += 24 * 60; 
        
        const inMorningRush = startMins < 510 && endMins > 390; 
        const inEveningRush = startMins < 1140 && endMins > 990; 

        if (inMorningRush || inEveningRush) {
          score -= 5;
          breakdown.push({ key: 'rushHour', points: -5 });
        }
      }
    }

    // --- 5. AUSLASTUNG ---
    if (leg.loadFactor === 'very-high') { score -= 30; breakdown.push({ key: 'loadVeryHigh', points: -30 }); }
    else if (leg.loadFactor === 'high') { score -= 15; breakdown.push({ key: 'loadHigh', points: -15 }); }
  }

  const total = Math.max(0, Math.min(100, score));
  return { total, breakdown };
}