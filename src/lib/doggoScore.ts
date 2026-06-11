import type { Journey, DogMode, Leg } from './types';
import { getTransferMinutes, getLegDurationMinutes } from './helpers';

export function calculateDoggoScore(journey: Journey, dogMode: DogMode): number {
  // Wenn kein Hund reist, ist der Score für unser UI irrelevant, wir geben 100 zurück
  if (dogMode === 'none') return 100;

  let score = 100;
  const legs = journey.legs;
  const transitLegs = legs.filter(l => !l.walking);

  // 1. ANZAHL UMSTIEGE
  // Direktverbindung ist perfekt. Jeder Umstieg kostet 8 Punkte.
  const transfers = transitLegs.length - 1;
  score -= (transfers * 8);

  for (let i = 0; i < legs.length; i++) {
    const leg = legs[i];

    // 2. UMSTIEGSZEITEN (Gassi-Faktor)
    if (i > 0) {
      const prevLeg = legs[i - 1];
      const transferMin = getTransferMinutes(prevLeg, leg);
      
      if (transferMin !== null) {
        // Zu knapp = purer Stress
        if (transferMin < 10) score -= 25;
        // Moderate Hektik
        else if (transferMin >= 10 && transferMin < 15) score -= 10;
        // PERFEKTE Gassi-Pause! Wir geben einen Bonus
        else if (transferMin >= 20 && transferMin <= 45) score += 5;
        // Ziemlich lang (nervig, aber für Hunde okay)
        else if (transferMin > 60) score -= 5;
      }
    }

    // 3. ETAPPEN-LÄNGE (Pinkel-Blase)
    if (!leg.walking) {
      const durationMin = getLegDurationMinutes(leg);
      if (durationMin > 300) score -= 25; // Über 5 Stunden ohne Pause
      else if (durationMin > 210) score -= 15; // Über 3,5 Stunden
      else if (durationMin > 150) score -= 5; // Über 2,5 Stunden
    }

    // 4. AUSLASTUNG (Platz für den Hund)
    if (leg.loadFactor === 'very-high') score -= 30; // Total überfüllt, Katastrophe für große Hunde
    else if (leg.loadFactor === 'high') score -= 15;
  }

  // Score zwischen 0 und 100 einklemmen (Clamp)
  return Math.max(0, Math.min(100, score));
}