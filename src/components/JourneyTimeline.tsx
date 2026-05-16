import { ChevronDown, ChevronUp, LayoutGrid, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import type { Leg } from '../lib/types';
import {
  formatTime,
  getTransferMinutes,
  getLegBadgeLabel,
  isWalking,
  countTransfers,
  abbreviateStationName,
} from '../lib/helpers';
import TrainComposition from './ui/TrainComposition';
import { getLegColorTheme } from './ui/Primitives';

interface Props {
  legs: Leg[];
  dogMode: 'none' | 'small' | 'large';
}

export default function JourneyTimeline({ legs, dogMode }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [expandedCarriageLeg, setExpandedCarriageLeg] = useState<number | null>(null);
  const transfers = countTransfers(legs);

  const parsePlatformStr = (plat: string | null | undefined) => {
    if (!plat) return '';
    const clean = plat.trim();
    const rawNumber = clean.replace(/^(platform|pl\.?)\s*/i, '');
    return `Platform ${rawNumber}`;
  };

  return (
    <div className="mt-3">
      {/* Structural Toggle Controller */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex-wrap"
        aria-expanded={expanded}
      >
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        {/* FIX 3: Stripped leg counter completely from the toggle display */}
        <span>{transfers === 0 ? 'Direct' : `${transfers} change${transfers > 1 ? 's' : ''}`}</span>
      </button>

      {/* Main Structural Loop Container */}
      {expanded && (
        <div className="mt-4 space-y-2" role="list" aria-label="Journey legs">
          {legs.map((leg, i) => {
            const walking = isWalking(leg);
            const transferMin = i > 0 ? getTransferMinutes(legs[i - 1], leg) : null;
            const riskyTransfer = transferMin !== null && transferMin < 10 && transferMin > 0;
            const showDogWarning = riskyTransfer && dogMode !== 'none';
            const showCarriageDropdown = expandedCarriageLeg === i && !walking;

            const depPlatform = parsePlatformStr(leg.departurePlatform);
            const arrPlatform = parsePlatformStr(leg.arrivalPlatform);
            const colors = getLegColorTheme(leg.line?.product, leg.line?.name, leg.walking);

            return (
              <div key={i} role="listitem" className="flex flex-col">
                {/* Intermediate Connection/Transfer Notification Node */}
                {i > 0 && transferMin !== null && transferMin > 0 && (
                  <div className="flex items-center gap-3 pl-2.5 my-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white shadow-sm shrink-0" />
                    <div className={`text-xs font-semibold px-2 py-0.5 rounded-md flex items-center gap-1.5 select-none ${
                      riskyTransfer ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <span>{transferMin}m transfer connection</span>
                      {showDogWarning && (
                        <span className="inline-flex items-center gap-0.5 text-red-600 font-bold ml-1" role="alert">
                          <AlertTriangle size={11} /> Tight window for dogs
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex items-stretch min-w-0 group">
                  {/* Left Rail Column */}
                  <div className="w-8 shrink-0 flex flex-col items-center relative select-none">
                    <div className={`w-3.5 h-3.5 rounded-full border-2 z-10 shrink-0 mt-1 transition-colors ${colors.dot}`} />
                    <div className={`w-0.5 flex-1 border-l-2 z-0 -my-1 transition-colors ${colors.border}`} />
                    <div className={`w-3.5 h-3.5 rounded-full border-2 z-10 shrink-0 mb-1 transition-colors ${colors.dot}`} />
                  </div>

                  {/* Right Content Stream */}
                  <div className="flex-1 min-w-0 pb-6 pl-2.5 space-y-3">
                    {/* Departure Node Information Frame */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span className="text-sm font-bold text-slate-800 tabular-nums">{formatTime(leg.departure)}</span>
                        
                        <span className={`font-bold uppercase tracking-wider px-1.5 py-0.5 rounded text-[10px] transition-colors ${colors.badge}`}>
                          {getLegBadgeLabel(leg)}
                        </span>
                        
                        {depPlatform && (
                          <span className="font-semibold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200/60 select-none">
                            {depPlatform}
                          </span>
                        )}
                      </div>

                      <p className="text-sm font-bold text-slate-700">{abbreviateStationName(leg.origin.name)}</p>

                      {/* FIX 1: Repositioned Tips Button down below the station text node layout block */}
                      {!walking && (
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => setExpandedCarriageLeg(showCarriageDropdown ? null : i)}
                            className={`inline-flex items-center gap-1 font-bold text-xs transition-all px-2.5 py-1 rounded-xl border ${
                              showCarriageDropdown 
                                ? 'bg-accent/10 border-accent/30 text-accent' 
                                : 'bg-white border-slate-200 text-slate-500 hover:text-primary hover:border-primary/30 shadow-sm'
                            }`}
                          >
                            {showCarriageDropdown ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                            <LayoutGrid size={11} strokeWidth={2.5} />
                            <span>Tips for dog owners & layout</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Integrated Composition Section Drawer Layout */}
                    {showCarriageDropdown && (
                      <div className="max-w-full animate-fade-in">
                        <TrainComposition leg={leg} />
                      </div>
                    )}

                    {/* Intermediate Travel Context Spacing Divider */}
                    <div className="border-l border-slate-200 pl-3 py-1 my-0.5">
                      <p className="text-xs text-slate-400 font-body">
                        {/* FIX 2: Renamed string template prefix to cleanly read "Direction:" */}
                        {walking ? 'Walk route transfer path' : `Direction: ${leg.direction || 'Terminal platform'}`}
                      </p>
                    </div>

                    {/* Arrival Node Information Frame */}
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span className="text-sm font-bold text-slate-800 tabular-nums">{formatTime(leg.arrival)}</span>
                        <span className="text-slate-400 font-medium font-body">Arrive</span>
                        
                        {arrPlatform && (
                          <span className="font-semibold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200/60 select-none">
                            {arrPlatform}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-slate-700">
                        {abbreviateStationName(leg.destination.name)}
                        <span className="text-xs text-slate-400 font-normal ml-1.5">(Get off)</span>
                      </p>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}