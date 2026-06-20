import { ChevronDown, ChevronUp, PawPrint, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Leg } from '../../lib/types';
import {
  formatTime,
  getLegBadgeLabel,
  abbreviateStationName,
  getStationUrl,
  getLegDurationMinutes,
} from '../../lib/helpers';
import TrainComposition from '../TrainComposition/TrainComposition';

interface Props {
  leg: Leg;
  i: number;
  isCarriageExpanded: boolean;
  onToggleCarriage: () => void;
  isStopsExpanded: boolean;
  onToggleStops: () => void;
  colors: { bgHex: string; badge: string };
  depPlatform: string;
  arrPlatform: string;
  formatDurationFriendly: (mins: number) => string;
}

export default function TimelineTransit({
  leg,
  isCarriageExpanded,
  onToggleCarriage,
  isStopsExpanded,
  onToggleStops,
  colors,
  depPlatform,
  arrPlatform,
  formatDurationFriendly,
}: Props) {
  const { t } = useTranslation();

  // Bereinigt: Nur echte Zwischenhalte anzeigen (Start- und Ziel entfernt)
  const intermediateStops = leg.stopovers && leg.stopovers.length > 2 
    ? leg.stopovers.slice(1, -1) 
    : [];

  return (
    <div className="relative flex flex-col min-w-0 pb-1">
      {/* Durchgehende Track Linie */}
      <div className="absolute top-3 bottom-3 left-[3.75rem] w-4 flex justify-center z-0">
        <div className="w-0.5 h-full" style={{ backgroundColor: colors.bgHex }} />
      </div>

      {/* Abfahrt Node */}
      <div className="flex items-center gap-3 relative z-10 bg-white min-h-[24px]">
        <span className="text-sm font-bold text-slate-800 tabular-nums w-12 shrink-0 text-right">
          {formatTime(leg.departure)}
        </span>
        <div className="w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center bg-white" style={{ borderColor: colors.bgHex }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.bgHex }} />
        </div>
        <div className="flex-1 flex justify-between items-start min-w-0">
          <a 
            href={getStationUrl(leg.origin.name)} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-900 hover:text-primary transition-colors group"
          >
            <span className="line-clamp-2 group-hover:underline">{abbreviateStationName(leg.origin.name)}</span>
            <Info size={14} className="text-slate-400 group-hover:text-primary shrink-0" />
          </a>
          {depPlatform && (
            <span className="text-sm font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded shrink-0 ml-2 tabular-nums">
              {depPlatform}
            </span>
          )}
        </div>
      </div>

      {/* Fahrt Details & Toggles */}
      <div className="flex items-stretch gap-3 relative z-10 py-3">
        <div className="w-12 shrink-0 text-right flex items-start justify-end select-none mt-0.5">
          <span className="text-xs text-slate-400 font-semibold tabular-nums block whitespace-nowrap">
            {formatDurationFriendly(getLegDurationMinutes(leg))}
          </span>
        </div>
        <div className="w-4 shrink-0" />
        
        <div className="flex-1 min-w-0 space-y-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-bold uppercase tracking-wider px-1.5 py-0.5 rounded text-[12px] transition-colors ${colors.badge}`}>
              {getLegBadgeLabel(leg)}
            </span>
            <span className="text-sm text-slate-700 font-medium">
              {t('journeys.timeline.towards')} {leg.direction ? abbreviateStationName(leg.direction) : abbreviateStationName(leg.destination.name)}
            </span>
          </div>

          {/* Wagenreihung Button */}
          <div className="flex items-center gap-2 flex-wrap pt-0.5">
            <button
              type="button"
              onClick={onToggleCarriage}
              className={`inline-flex items-center gap-1 font-bold text-sm transition-all pl-2 pr-4 py-2 rounded-xl border ${
                isCarriageExpanded 
                  ? 'bg-primary/10 border-primary/30 text-primary' 
                  : 'bg-white border-slate-200 text-slate-500 hover:text-primary hover:border-primary/30 shadow-sm'
              }`}
            >
              {isCarriageExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              <PawPrint size={14} strokeWidth={2} className="text-primary fill-primary mr-1" />
              <span className="text-primary">{t('journeys.timeline.dogTips')}</span>
            </button>
          </div>

          {isCarriageExpanded && (
            <div className="max-w-full animate-fade-in pt-1">
              <TrainComposition leg={leg} onClose={onToggleCarriage} badge={colors.badge} />
            </div>
          )}

          {/* Zwischenhalte Button */}
          {intermediateStops.length > 0 && (
            <button
              type="button"
              onClick={onToggleStops}
              className={`inline-flex items-center gap-1 font-bold text-xs transition-all px-2.5 py-1 rounded-xl border ${
                isStopsExpanded
                  ? 'bg-slate-100 border-slate-400 text-slate-700'
                  : 'bg-white border-slate-200 text-slate-500 hover:text-primary hover:border-primary/30 shadow-sm'
              }`}
            >
              {isStopsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              <span>{intermediateStops.length === 1 ? t('journeys.timeline.stop_one') : t('journeys.timeline.stop_other', { count: intermediateStops.length })}</span>
            </button>
          )}

          {/* Zwischenhalte Liste */}
          {isStopsExpanded && intermediateStops.length > 0 && (
            <div className="mt-3 p-3 bg-primary/5 rounded-xl space-y-1.5 animate-fade-in max-w-sm">
              {intermediateStops.map((stopover: any, idx: number) => (
                <div key={idx} className="flex justify-between text-xs sm:text-sm text-slate-600">
                  <div className="flex items-center gap-1 sm:gap-3 min-w-0">
                    <span className="tabular-nums font-bold text-slate-700 w-8 sm:w-9 shrink-0">
                      {stopover.arrival ? formatTime(stopover.arrival) : formatTime(stopover.departure)}
                    </span>
                    <span className="truncate font-medium text-slate-700">{abbreviateStationName(stopover.stop?.name || t('journeys.timeline.station'))}</span>
                  </div>
                  {stopover.arrivalPlatform && (
                    <span className="text-xs sm:text-sm font-bold text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded ml-2 shrink-0 tabular-nums">
                      {stopover.arrivalPlatform.replace(/^(platform|pl\.?)\s*/i, '')}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ankunft Node */}
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
            className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-900 hover:text-primary transition-colors group"
          >
            <span className="line-clamp-2 group-hover:underline">{abbreviateStationName(leg.destination.name)}</span>
            <Info size={14} className="text-slate-400 group-hover:text-primary shrink-0" />
          </a>
          {arrPlatform && (
            <span className="text-sm font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded shrink-0 ml-2 tabular-nums">
              {arrPlatform}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}