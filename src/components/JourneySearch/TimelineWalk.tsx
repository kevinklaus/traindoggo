import { Dog, Footprints, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Leg } from '../../lib/types';
import { formatTime, abbreviateStationName, getStationUrl, getLegDurationMinutes } from '../../lib/helpers';

interface Props {
  leg: Leg;
  dogMode: 'none' | 'small' | 'large';
  mergesFromPrevTrain: boolean;
  mergesIntoNextTrain: boolean;
  hideDepartureNode: boolean;
  hideArrivalNode: boolean;
  blockDurationMin: number;
  showDogWarningInWalk: boolean;
  isRedundantWalkDuration: boolean;
  colors: { bgHex: string };
  depPlatform: string;
  arrPlatform: string;
  formatDurationFriendly: (mins: number) => string;
}

export default function TimelineWalk({
  leg,
  dogMode,
  mergesFromPrevTrain,
  mergesIntoNextTrain,
  hideDepartureNode,
  hideArrivalNode,
  blockDurationMin,
  showDogWarningInWalk,
  isRedundantWalkDuration,
  colors,
  depPlatform,
  arrPlatform,
  formatDurationFriendly,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="relative flex flex-col min-w-0 pb-1">
      {/* Track Linie */}
      <div className={`absolute ${hideDepartureNode ? 'top-0' : 'top-3'} ${hideArrivalNode ? 'bottom-0' : 'bottom-3'} left-[3.75rem] w-4 flex justify-center z-0`}>
        <div 
          className="w-0.5 h-full border-dashed border-l-2"
          style={{ borderColor: colors.bgHex, opacity: 0.5 }}
        />
      </div>

      {/* Startbahnhof (falls nicht zusammengeführt) */}
      {!hideDepartureNode && (
        <div className="flex items-center gap-3 relative z-10 bg-white min-h-[24px]">
          <span className="text-sm font-bold text-slate-800 tabular-nums w-12 shrink-0 text-right">
            {formatTime(leg.departure)}
          </span>
          <div className="w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center bg-white" style={{ borderColor: colors.bgHex }}>
            <Footprints size={8} className="text-slate-400" />
          </div>
          <div className="flex-1 flex justify-between items-start min-w-0">
            <a 
              href={getStationUrl(leg.origin.name)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-bold text-slate-900 hover:text-primary transition-colors"
            >
              <span className="line-clamp-2">{abbreviateStationName(leg.origin.name)}</span>
            </a>
            {depPlatform && (
              <span className="text-sm font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded shrink-0 ml-2 tabular-nums">
                {depPlatform}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Fußweg-Inhalt */}
      <div className="flex items-stretch gap-3 relative z-10 py-3">
        <div className="w-12 shrink-0 text-right flex items-start justify-end select-none mt-0.5">
          <span className="text-xs text-slate-400 font-semibold tabular-nums block whitespace-nowrap">
            {formatDurationFriendly(blockDurationMin)}
          </span>
        </div>
        <div className="w-4 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex flex-col justify-center gap-1.5 py-1">
            <div className="flex items-center gap-2 text-slate-500 select-none">
              {dogMode !== 'none' ? <Dog size={15} strokeWidth={2.5} /> : <Footprints size={15} strokeWidth={2.5} />}
              <span className="text-sm font-semibold">
                {(mergesFromPrevTrain && mergesIntoNextTrain) ? t('journeys.timeline.transfer') : t('journeys.timeline.walk')} 
                {!isRedundantWalkDuration && (
                  <span className="font-medium text-xs opacity-80 ml-1">
                    {t('journeys.timeline.inclMin', { count: getLegDurationMinutes(leg) })}
                  </span>
                )}
              </span>
            </div>
            {mergesFromPrevTrain && mergesIntoNextTrain && showDogWarningInWalk && (
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-700 border border-orange-200 w-fit" role="alert">
                <AlertTriangle size={12} strokeWidth={2.5} /> {t('journeys.timeline.tightWindow')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Zielbahnhof */}
      {!hideArrivalNode && (
        <div className="flex items-center gap-3 relative z-10 bg-white min-h-[24px]">
          <span className="text-sm font-bold text-slate-800 tabular-nums w-12 shrink-0 text-right">
            {formatTime(leg.arrival)}
          </span>
          <div className="w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center bg-white" style={{ borderColor: colors.bgHex }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.bgHex }} />
          </div>
          <div className="flex-1 flex justify-between items-end min-w-0">
            <a 
              href={getStationUrl(leg.destination.name)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-bold text-slate-900 hover:text-primary transition-colors"
            >
              <span className="line-clamp-2">{abbreviateStationName(leg.destination.name)}</span>
            </a>
            {arrPlatform && (
              <span className="text-sm font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded shrink-0 ml-2 tabular-nums">
                {arrPlatform}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}