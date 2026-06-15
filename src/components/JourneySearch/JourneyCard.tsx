import { Clock, ArrowRight, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import type { Journey, DogMode } from '../../lib/types';
import {
  formatTime,
  formatDuration,
  filterValidLegs,
  getLegDurationMinutes,
} from '../../lib/helpers';
import { calculateDoggoScore } from '../../lib/doggoScore';

import JourneyTimeline from './JourneyTimeline';
import JourneyTimelineBar from './JourneyTimelineBar';
import DoggoScoreBadge from './DoggoScoreBadge';
import { TOKENS } from '../ui/Primitives';

interface Props {
  journey: Journey;
  dogMode: DogMode;
  index: number;
}

function getJourneyLoadFactor(legs: any[]): string | null {
  const nonWalking = legs.filter(l => !l.walking);
  if (nonWalking.length === 0) return null;

  const ranks: Record<string, number> = {
    'low': 1,
    'low-to-medium': 2,
    'medium': 3,
    'high': 4,
    'very-high': 5
  };

  let maxRank = 0;
  let maxFactor: string | null = null;

  for (const leg of nonWalking) {
    if (leg.loadFactor) {
      const currentRank = ranks[leg.loadFactor] || 0;
      if (currentRank > maxRank) {
        maxRank = currentRank;
        maxFactor = leg.loadFactor;
      }
    }
  }
  return maxFactor;
}

function getLoadFactorConfig(factor: string | null, t: TFunction) {
  if (!factor) return null;

  const mapping: Record<string, { label: string; desc: string; styles: string }> = {
    'low': { label: t('journeys.load.low'), desc: t('journeys.load.lowDesc'), styles: 'bg-emerald-50 text-emerald-700 border-emerald-200/60' },
    'low-to-medium': { label: t('journeys.load.lowMed'), desc: t('journeys.load.lowMedDesc'), styles: 'bg-blue-50 text-blue-700 border-blue-200/60' },
    'medium': { label: t('journeys.load.medium'), desc: t('journeys.load.mediumDesc'), styles: 'bg-slate-50 text-slate-700 border-slate-200/60' },
    'high': { label: t('journeys.load.high'), desc: t('journeys.load.highDesc'), styles: 'bg-orange-50 text-orange-700 border-orange-200/60' },
    'very-high': { label: t('journeys.load.veryHigh'), desc: t('journeys.load.veryHighDesc'), styles: 'bg-red-50 text-red-700 border-red-200/60 animate-pulse' }
  };

  return mapping[factor] || { label: t('journeys.load.unknown'), desc: t('journeys.load.unknownDesc'), styles: 'bg-slate-50 text-slate-500 border-slate-200' };
}

export default function JourneyCard({ journey, dogMode, index }: Props) {
  const { t } = useTranslation(); // i18n wird hier nicht mehr für das Datum gebraucht
  const legs = filterValidLegs(journey.legs);
  const firstLeg = legs[0];
  const lastLeg = legs[legs.length - 1];

  const departure = firstLeg?.departure ?? '';
  const arrival = lastLeg?.arrival ?? '';
  const duration = departure && arrival ? formatDuration(departure, arrival) : '--';

  // DATUMS-BERECHNUNG: Nur noch den +1 / +2 Tageswechsel für die Ankunft berechnen
  let dayDiff = 0;

  if (departure && arrival) {
    const depDate = new Date(departure);
    const arrDate = new Date(arrival);
    
    // Normalisieren, um exakt die Kalendertage zu vergleichen (ohne Uhrzeit)
    const depDay = new Date(depDate.getFullYear(), depDate.getMonth(), depDate.getDate());
    const arrDay = new Date(arrDate.getFullYear(), arrDate.getMonth(), arrDate.getDate());
    dayDiff = Math.round((arrDay.getTime() - depDay.getTime()) / (1000 * 60 * 60 * 24));
  }
  
  const doggoScore = calculateDoggoScore(journey, dogMode);

  const worstLoadFactor = getJourneyLoadFactor(legs);
  const loadConfig = getLoadFactorConfig(worstLoadFactor, t);

  const barSegments = legs.map((leg) => ({ leg, minutes: getLegDurationMinutes(leg) }));
  const totalMinutes = barSegments.reduce((sum, s) => sum + s.minutes, 0) || 1;

  return (
    <div className={TOKENS.layouts.card} style={{ animationDelay: `${index * 80}ms` }}>
      <div className="p-4 sm:p-5 space-y-3.5">
        
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            
            {/* Der fette Datums-String wurde hier entfernt */}

            <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
              <span className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums font-heading whitespace-nowrap">
                {formatTime(departure)}
              </span>
              <ArrowRight size={14} className="text-slate-400 shrink-0" aria-hidden="true" />
              <span className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums font-heading whitespace-nowrap">
                {formatTime(arrival)}
                {/* HIER WIRD WEITERHIN DER +1 / +2 TAG ANGEZEIGT (z.B. für Nachtzüge) */}
                {dayDiff > 0 && (
                  <sup className="text-xs sm:text-sm font-bold text-slate-500 ml-0.5">
                    +{dayDiff}
                  </sup>
                )}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1.5 text-sm text-slate-500 flex-wrap">
              <Clock size={14} aria-hidden="true" />
              <span className="whitespace-nowrap">{duration}</span>
              
              {loadConfig && (
                <>
                  <span className="text-slate-300" aria-hidden="true">&middot;</span>
                  <div 
                    title={`${loadConfig.label}: ${loadConfig.desc}`}
                    className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium cursor-help select-none ${loadConfig.styles}`}
                  >
                    <Users size={12} strokeWidth={2.2} />
                    <span>{loadConfig.label}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="text-right shrink-0">
          {dogMode !== 'none' && (
              <DoggoScoreBadge result={doggoScore} />
            )}
          </div>
        </div>

        <JourneyTimelineBar segments={barSegments} totalMinutes={totalMinutes} />

        <JourneyTimeline legs={legs} dogMode={dogMode} />
      </div>
    </div>
  );
}