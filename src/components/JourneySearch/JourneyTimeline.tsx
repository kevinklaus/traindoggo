import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Leg } from '../../lib/types';
import {
  getTransferMinutes,
  isWalking,
  countTransfers,
  getLegDurationMinutes,
} from '../../lib/helpers';
import { getLegColorTheme } from '../ui/Primitives';

// Importe der neuen modularen Komponenten
import TimelineTransfer from './TimelineTransfer';
import TimelineWalk from './TimelineWalk';
import TimelineTransit from './TimelineTransit';

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
      {/* Header Controller */}
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

      {/* Main Loop */}
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
                {/* 1. Transfer Pille rendern */}
                {showTransferPill && transferMin !== null && (
                  <TimelineTransfer 
                    transferMin={transferMin}
                    showDogWarning={showDogWarning}
                  />
                )}

                {/* 2. Spezialisiertes Teilstück rendern */}
                {walking ? (
                  <TimelineWalk 
                    leg={leg}
                    dogMode={dogMode}
                    mergesFromPrevTrain={mergesFromPrevTrain? mergesFromPrevTrain : false}
                    mergesIntoNextTrain={mergesIntoNextTrain}
                    hideDepartureNode={hideDepartureNode? hideDepartureNode : false}
                    hideArrivalNode={hideArrivalNode}
                    blockDurationMin={blockDurationMin}
                    showDogWarningInWalk={showDogWarningInWalk}
                    isRedundantWalkDuration={isRedundantWalkDuration}
                    colors={colors}
                    depPlatform={depPlatform}
                    arrPlatform={arrPlatform}
                    formatDurationFriendly={formatDurationFriendly}
                  />
                ) : (
                  <TimelineTransit 
                    leg={leg}
                    i={i}
                    isCarriageExpanded={expandedCarriageLeg === i}
                    onToggleCarriage={() => setExpandedCarriageLeg(expandedCarriageLeg === i ? null : i)}
                    isStopsExpanded={expandedStopsLeg === i}
                    onToggleStops={() => setExpandedStopsLeg(expandedStopsLeg === i ? null : i)}
                    colors={colors}
                    depPlatform={depPlatform}
                    arrPlatform={arrPlatform}
                    formatDurationFriendly={formatDurationFriendly}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}