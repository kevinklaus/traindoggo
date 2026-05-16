import { Clock, ArrowRight, AlertTriangle } from 'lucide-react';
import type { Journey, DogMode } from '../lib/types';
import {
  formatTime,
  formatDuration,
  countTransfers,
  filterValidLegs,
  getLegDurationMinutes,
} from '../lib/helpers';
import { estimatePrice } from '../lib/pricing';
import JourneyTimeline from './JourneyTimeline';
import JourneyTimelineBar from './ui/JourneyTimelineBar';
import { TOKENS } from './ui/Primitives';

interface Props {
  journey: Journey;
  dogMode: DogMode;
  index: number;
}

export default function JourneyCard({ journey, dogMode, index }: Props) {
  const legs = filterValidLegs(journey.legs);
  const firstLeg = legs[0];
  const lastLeg = legs[legs.length - 1];
  const transfers = countTransfers(legs);

  const departure = firstLeg?.departure ?? '';
  const arrival = lastLeg?.arrival ?? '';
  const duration = departure && arrival ? formatDuration(departure, arrival) : '--';
  const price = estimatePrice(legs, dogMode);

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
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Direct Timings Header Row */}
            <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
              <span className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums font-heading whitespace-nowrap">
                {formatTime(firstLeg?.departure)}
              </span>
              <ArrowRight size={14} className="text-slate-400 shrink-0" aria-hidden="true" />
              <span className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums font-heading whitespace-nowrap">
                {formatTime(lastLeg?.arrival)}
              </span>
            </div>

            {/* Metabar Context */}
            <div className="flex items-center gap-2 mt-1.5 text-sm text-slate-500 flex-wrap">
              <Clock size={14} aria-hidden="true" />
              <span className="whitespace-nowrap">{duration}</span>
              <span className="text-slate-300" aria-hidden="true">&middot;</span>
              <span className="whitespace-nowrap">
                {transfers === 0 ? 'Direct' : `${transfers} change${transfers > 1 ? 's' : ''}`}
              </span>
              {hasRiskyTransfer && dogMode !== 'none' && (
                <span className="inline-flex items-center gap-1 text-red-600 font-medium" role="alert">
                  <AlertTriangle size={12} aria-hidden="true" /> Tight for dogs
                </span>
              )}
            </div>

            {/* Atomic Visual Progress Abstraction */}
            <JourneyTimelineBar segments={barSegments} totalMinutes={totalMinutes} />
          </div>

          {/* Fare Presentation Column */}
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

        <JourneyTimeline legs={legs} dogMode={dogMode} />
        
        <div className="mt-3 pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-400 truncate block">{price.breakdown}</span>
        </div>
      </div>
    </div>
  );
}