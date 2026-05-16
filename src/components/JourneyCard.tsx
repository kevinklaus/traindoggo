import { Clock, ArrowRight, AlertTriangle, Users } from 'lucide-react';
import type { Journey, DogMode } from '../lib/types';
import {
  formatTime,
  formatDuration,
  countTransfers,
  filterValidLegs,
  getLegDurationMinutes,
} from '../lib/helpers';
import { calculateJourneyPrice } from '../lib/pricing';
import JourneyTimeline from './JourneyTimeline';
import JourneyTimelineBar from './ui/JourneyTimelineBar';
import { TOKENS } from './ui/Primitives';

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

function getLoadFactorConfig(factor: string | null) {
  if (!factor) return null;

  const mapping: Record<string, { label: string; desc: string; styles: string }> = {
    'low': { label: 'Quiet Train', desc: 'Great for dogs', styles: 'bg-emerald-50 text-emerald-700 border-emerald-200/60' },
    'low-to-medium': { label: 'Moderate Load', desc: 'Comfortable for dogs', styles: 'bg-blue-50 text-blue-700 border-blue-200/60' },
    'medium': { label: 'Medium Load', desc: 'Standard spacing', styles: 'bg-slate-50 text-slate-700 border-slate-200/60' },
    'high': { label: 'Crowded Train', desc: 'Stressful for dogs', styles: 'bg-orange-50 text-orange-700 border-orange-200/60' },
    'very-high': { label: 'Very Crowded', desc: 'Avoid with dogs if possible', styles: 'bg-red-50 text-red-700 border-red-200/60 animate-pulse' }
  };

  return mapping[factor] || { label: 'Unknown Load', desc: 'Check boards', styles: 'bg-slate-50 text-slate-500 border-slate-200' };
}

export default function JourneyCard({ journey, dogMode, index }: Props) {
  const legs = filterValidLegs(journey.legs);
  const firstLeg = legs[0];
  const lastLeg = legs[legs.length - 1];
  const transfers = countTransfers(legs);

  const departure = firstLeg?.departure ?? '';
  const arrival = lastLeg?.arrival ?? '';
  const duration = departure && arrival ? formatDuration(departure, arrival) : '--';
  
  const price = calculateJourneyPrice(journey, dogMode);

  const worstLoadFactor = getJourneyLoadFactor(legs);
  const loadConfig = getLoadFactorConfig(worstLoadFactor);

  const hasRiskyTransfer = legs.some((leg, i) => {
    if (i === 0) return false;
    const prev = legs[i - 1];
    const arr = prev.arrival;
    const dep = leg.departure;
    if (!arr || !dep) return false;
    const min = Math.round((new Date(dep).getTime() - new Date(arr).getTime()) / 60000);
    return min > 0 && min < 10;
  });

  const barSegments = legs.map((leg) => ({ leg, minutes: getLegDurationMinutes(leg) }));
  const totalMinutes = barSegments.reduce((sum, s) => sum + s.minutes, 0) || 1;

  return (
    <div className={TOKENS.layouts.card} style={{ animationDelay: `${index * 80}ms` }}>
      <div className="p-4 sm:p-5 space-y-3.5">
        
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
              <span className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums font-heading whitespace-nowrap">
                {formatTime(firstLeg?.departure)}
              </span>
              <ArrowRight size={14} className="text-slate-400 shrink-0" aria-hidden="true" />
              <span className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums font-heading whitespace-nowrap">
                {formatTime(lastLeg?.arrival)}
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

              {hasRiskyTransfer && dogMode !== 'none' && (
                <span className="inline-flex items-center gap-1 text-red-600 font-medium ml-auto sm:ml-0" role="alert">
                  <AlertTriangle size={12} aria-hidden="true" /> Tight for dogs
                </span>
              )}
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-xl sm:text-2xl font-bold text-primary font-heading whitespace-nowrap">
              €{price.totalPrice.toFixed(2)}
            </div>
            {dogMode !== 'none' && (
              <div className="text-xs text-slate-500 mt-0.5 whitespace-nowrap">
                {dogMode === 'large' ? 'incl. dog ticket' : 'small dog free'}
              </div>
            )}
          </div>
        </div>

        <JourneyTimelineBar segments={barSegments} totalMinutes={totalMinutes} />

        <JourneyTimeline legs={legs} dogMode={dogMode} />
      </div>
    </div>
  );
}