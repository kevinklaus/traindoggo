import { getLegBadgeLabel, getLegDescription, isWalking } from '../../lib/helpers';
import type { Leg } from '../../lib/types';
import { getLegColorTheme } from './Primitives';
import { Footprints } from 'lucide-react';

interface BarSegment {
  leg: Leg;
  minutes: number;
}

interface JourneyTimelineBarProps {
  segments: BarSegment[];
  totalMinutes: number;
}

export default function JourneyTimelineBar({ segments, totalMinutes }: JourneyTimelineBarProps) {
  return (
    <div
      className="flex w-full min-h-[1.625rem] mt-2 rounded-md overflow-hidden gap-x-0.5 bg-slate-100 select-none"
      role="img"
      aria-label={`Trip segments by time: ${segments.map((s) => `${getLegBadgeLabel(s.leg)} ${s.minutes}min`).join(', ')}`}
    >
      {segments.map(({ leg, minutes }, i) => {
        const colors = getLegColorTheme(leg.line?.product, leg.line?.name, leg.walking);
        const walking = isWalking(leg);
        
        return (
          <div
            key={`${leg.tripId ?? 'seg'}-${i}`}
            title={`${getLegDescription(leg)} · ${minutes} min`}
            // Dynamische Mindestbreite: Schmaler für Fußwege, breiter für Zugbezeichnungen
            className={`flex items-center justify-center px-1.5 py-0.5 text-[10px] sm:text-xs font-bold leading-tight text-center overflow-hidden shrink-0 ${walking ? 'min-w-[1.5rem]' : 'min-w-[2.5rem]'}`}
            style={{
              flexGrow: minutes,
              flexBasis: 0,
              backgroundColor: colors.bgHex,
              color: colors.textHex,
            }}
          >
            {walking ? (
              <Footprints size={14} strokeWidth={2.5} className="animate-fade-in" />
            ) : (
              <span className="truncate">{getLegBadgeLabel(leg)}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}