import { ChevronDown, ChevronUp, PawPrint, AlertTriangle, Dog, Footprints, Info } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Leg } from '../lib/types';
import {
  formatTime,
  getTransferMinutes,
  getLegBadgeLabel,
  isWalking,
  countTransfers,
  abbreviateStationName,
  getLegDurationMinutes,
  getStationUrl,
} from '../lib/helpers';
import TrainComposition from './ui/TrainComposition/TrainComposition';
import { getLegColorTheme } from './ui/Primitives';

interface Props {
  legs: Leg[];
  dogMode: 'none' | 'small' | 'large';
}

export default function JourneyTimeline({ legs, dogMode }: Props) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [expandedCarriageLeg, setExpandedCarriageLeg] = useState<number | null>(null);
  const [expandedStopsLeg, setExpandedStopsLeg] = useState<number | null>(null);
  const transfers = countTransfers(legs);

  const parsePlatformStr = (plat: string | null | undefined) => {
    if (!plat) return '';
    const clean = plat.trim();
    const rawNumber = clean.replace(/^(platform|pl\.?)\s*/i, '');
    return `Pl. ${rawNumber}`;
  };

  const formatDurationFriendly = (mins: number) => {
    if (mins >= 60) {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return m > 0 ? `${h}h ${m}min` : `${h}h`;
    }
    return `${mins} min`;
  };

  const hasRiskyTransfer = legs.some((leg, i) => {
    if (i === 0) return false;
    const transferMin = getTransferMinutes(legs[i - 1], leg);
    return transferMin !== null && transferMin < 10 && transferMin > 0;
  });

  return (
    <div className="mt-3">
      {/* Structural Toggle Controller & Global Warning (Fluid Wrap) */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          aria-expanded={expanded}
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          <span>{transfers === 0 ? t('journeys.timeline.direct') : transfers === 1 ? t('journeys.timeline.change_one') : t('journeys.timeline.change_other', { count: transfers })}</span>
        </button>

        {hasRiskyTransfer && dogMode !== 'none' && (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-red-600" role="alert">
            <AlertTriangle size={14} aria-hidden="true" /> {t('journeys.timeline.tightDog')}
          </span>
        )}
      </div>

      {/* Main Structural Loop Container */}
      {expanded && (
        <div className="mt-4 space-y-0" role="list" aria-label="Journey legs">
          {legs.map((leg, i) => {
            const walking = isWalking(leg);
            const prevLeg = i > 0 ? legs[i - 1] : null;
            const nextLeg = legs[i + 1] || null;

            const transferMin = prevLeg ? getTransferMinutes(prevLeg, leg) : null;
            const riskyTransfer = transferMin !== null && transferMin < 10 && transferMin > 0;
            const showDogWarning = riskyTransfer && dogMode !== 'none';
            const colors = getLegColorTheme(leg.line?.product, leg.line?.name, leg.walking);

            const depPlatform = parsePlatformStr(leg.departurePlatform);
            const arrPlatform = parsePlatformStr(leg.arrivalPlatform);

            const mergesFromPrevTrain = walking && prevLeg && prevLeg.destination.name.trim().toLowerCase() === leg.origin.name.trim().toLowerCase();
            const mergesIntoNextTrain = walking && nextLeg && leg.destination.name.trim().toLowerCase() === nextLeg.origin.name.trim().toLowerCase();

            const hideDepartureNode = mergesFromPrevTrain;
            const hideArrivalNode = mergesIntoNextTrain;

            let blockDurationMin = getLegDurationMinutes(leg);
            let showDogWarningInWalk = false;

            if (walking && (mergesFromPrevTrain || mergesIntoNextTrain)) {
              const startTime = mergesFromPrevTrain ? prevLeg.arrival : leg.departure;
              const endTime = mergesIntoNextTrain ? nextLeg.departure : leg.arrival;
              if (startTime && endTime) {
                blockDurationMin = Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000);
              }
              
              if (mergesFromPrevTrain && mergesIntoNextTrain) {
                const bufferMin = blockDurationMin - getLegDurationMinutes(leg);
                if (bufferMin < 10 && bufferMin > 0 && dogMode !== 'none') {
                  showDogWarningInWalk = true;
                }
              }
            }

            const prevWasWalkingAndMerged = prevLeg && isWalking(prevLeg) && prevLeg.destination.name.trim().toLowerCase() === leg.origin.name.trim().toLowerCase();
            const showTransferPill = i > 0 && transferMin !== null && transferMin > 0 && !prevWasWalkingAndMerged;
            
            const isRedundantWalkDuration = blockDurationMin === getLegDurationMinutes(leg);

            return (
              <div key={i} role="listitem" className="flex flex-col">
                
                {/* Standard Transfer Pill */}
                {showTransferPill && (
                  <div className="flex items-center gap-3 pl-[3.75rem] my-3 relative z-10">
                    <div className="w-4 flex justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-slate-200 border border-white shadow-sm" />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 select-none">
                        {t('journeys.timeline.transferMin', { count: transferMin })}
                      </div>
                      {showDogWarning && (
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-700 border border-orange-200" role="alert">
                          <AlertTriangle size={13} strokeWidth={2.5} /> {t('journeys.timeline.tightWindow')}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="relative flex flex-col min-w-0 pb-1">
                  
                  {/* ABSOLUTE TRACK LINE */}
                  <div className={`absolute ${hideDepartureNode ? 'top-0' : 'top-3'} ${hideArrivalNode ? 'bottom-0' : 'bottom-3'} left-[3.75rem] w-4 flex justify-center z-0`}>
                    <div 
                      className={`w-0.5 h-full ${walking ? 'border-dashed border-l-2' : 'bg-slate-300'}`}
                      style={walking ? { borderColor: colors.bgHex, opacity: 0.5 } : { backgroundColor: colors.bgHex }}
                    />
                  </div>
                  
                  {/* Departure Node */}
                  {!hideDepartureNode && (
                    <div className="flex items-center gap-3 relative z-10 bg-white min-h-[24px]">
                      <span className="text-sm font-bold text-slate-800 tabular-nums w-12 shrink-0 text-right">
                        {formatTime(leg.departure)}
                      </span>
                      <div className="w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center bg-white" style={{ borderColor: colors.bgHex }}>
                        {walking ? <Footprints size={8} className="text-slate-400" /> : <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.bgHex }} />}
                      </div>
                      <div className="flex-1 flex justify-between items-start min-w-0">
                        <a 
                          href={getStationUrl(leg.origin.name)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-900 hover:text-primary transition-colors group"
                          title={`View ${abbreviateStationName(leg.origin.name)} on bahnhof.de`}
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
                  )}

                  <div className="flex items-stretch gap-3 relative z-10 py-3">
                    <div className="w-12 shrink-0 text-right flex items-start justify-end select-none mt-0.5">
                      <span className="text-xs text-slate-400 font-semibold tabular-nums block whitespace-nowrap">
                        {formatDurationFriendly(walking && (mergesFromPrevTrain || mergesIntoNextTrain) ? blockDurationMin : getLegDurationMinutes(leg))}
                      </span>
                    </div>
                    
                    <div className="w-4 shrink-0" />
                    
                    <div className="flex-1 min-w-0">
                      {!walking ? (
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-bold uppercase tracking-wider px-1.5 py-0.5 rounded text-[12px] transition-colors ${colors.badge}`}>
                              {getLegBadgeLabel(leg)}
                            </span>
                            <span className="text-sm text-slate-700 font-medium">
                              {t('journeys.timeline.towards')} {leg.direction ? abbreviateStationName(leg.direction) : abbreviateStationName(leg.destination.name)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap pt-0.5">
                            <button
                              type="button"
                              onClick={() => setExpandedCarriageLeg(expandedCarriageLeg === i ? null : i)}
                              className={`inline-flex items-center gap-1 font-bold text-sm transition-all pl-2 pr-4 py-2 rounded-xl border ${
                                expandedCarriageLeg === i 
                                  ? 'bg-primary/10 border-primary/30 text-primary' 
                                  : 'bg-white border-slate-200 text-slate-500 hover:text-primary hover:border-primary/30 shadow-sm'
                              }`}
                            >
                              {expandedCarriageLeg === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              <PawPrint size={14} strokeWidth={2} className="text-primary fill-primary" />
                              <span>{t('journeys.timeline.dogTips')}</span>
                            </button>
                          </div>

                          {expandedCarriageLeg === i && (
                            <div className="max-w-full animate-fade-in pt-1">
                              <TrainComposition leg={leg} onClose={() => setExpandedCarriageLeg(null)} badge={colors.badge} />
                            </div>
                          )}

                          {leg.stopovers && leg.stopovers.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setExpandedStopsLeg(expandedStopsLeg === i ? null : i)}
                              className={`inline-flex items-center gap-1 font-bold text-xs transition-all px-2.5 py-1 rounded-xl border ${
                                expandedStopsLeg === i
                                  ? 'bg-slate-100 border-slate-400 text-slate-700'
                                  : 'bg-white border-slate-200 text-slate-500 hover:text-primary hover:border-primary/30 shadow-sm'
                              }`}
                            >
                              {expandedStopsLeg === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              <span>{leg.stopovers.length === 1 ? t('journeys.timeline.stop_one') : t('journeys.timeline.stop_other', { count: leg.stopovers.length })}</span>
                            </button>
                          )}

                          {expandedStopsLeg === i && leg.stopovers && (
                            <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 animate-fade-in max-w-md">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{t('journeys.timeline.stopovers')}</p>
                              {leg.stopovers.map((stopover: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center text-xs text-slate-600 py-0.5">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="tabular-nums font-medium text-slate-400 w-9 text-right shrink-0">
                                      {stopover.arrival ? formatTime(stopover.arrival) : formatTime(stopover.departure)}
                                    </span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                                    <span className="truncate font-medium text-slate-700">{abbreviateStationName(stopover.stop?.name || t('journeys.timeline.station'))}</span>
                                  </div>
                                  {stopover.arrivalPlatform && (
                                    <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded ml-2 shrink-0 tabular-nums">
                                      Pl. {stopover.arrivalPlatform.replace(/^(platform|pl\.?)\s*/i, '')}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
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
                      )}
                    </div>
                  </div>

                  {/* Arrival Terminal Node */}
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
                          className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-900 hover:text-primary transition-colors group"
                          title={`View ${abbreviateStationName(leg.destination.name)} on bahnhof.de`}
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
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}