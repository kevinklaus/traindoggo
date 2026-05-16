import { getLineStyle, getLegBadgeLabel, getLegDescription } from '../../lib/helpers';
import type { Leg } from '../../lib/types';

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
      // Added `gap-x-0.5` (2px space between blocks) and changed background to slate-100 to make dividers crisp
      className="flex w-full min-h-[1.625rem] mt-2 rounded-md overflow-hidden gap-x-0.5 bg-slate-100"
      role="img"
      aria-label={`Trip segments by time: ${segments.map((s) => `${getLegBadgeLabel(s.leg)} ${s.minutes}min`).join(', ')}`}
    >
      {segments.map(({ leg, minutes }, i) => {
        const style = getLineStyle(leg);
        return (
          <div
            key={`${leg.tripId ?? 'seg'}-${i}`}
            title={`${getLegDescription(leg)} · ${minutes} min`}
            className="flex min-w-0 items-center justify-center px-0.5 py-0.5 text-[10px] sm:text-xs font-bold leading-tight text-center overflow-hidden"
            style={{
              flexGrow: minutes,
              flexShrink: 1,
              flexBasis: 0,
              backgroundColor: style.bg,
              color: style.text,
            }}
          >
            <span className="truncate max-w-full">{getLegBadgeLabel(leg)}</span>
          </div>
        );
      })}
    </div>
  );
}