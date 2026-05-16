import { ChevronDown, ChevronUp, LayoutGrid } from 'lucide-react';
import { useState } from 'react';
import type { Leg } from '../lib/types';
import {
  formatTime,
  getTransferMinutes,
  getLegBadgeLabel,
  getLegDescription,
  getLineStyle,
  isWalking,
  countTransfers,
  abbreviateStationName,
} from '../lib/helpers';
import { TimelineTransferNode, TimelineDepartureNode, TimelineConnectorLine, TimelineArrivalNode } from './ui/TimelineNodes';
import TrainComposition from './ui/TrainComposition';

interface Props {
  legs: Leg[];
  dogMode: 'none' | 'small' | 'large';
}

export default function JourneyTimeline({ legs, dogMode }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [expandedCarriageLeg, setExpandedCarriageLeg] = useState<number | null>(null);
  const transfers = countTransfers(legs);

  return (
    <div className="mt-3">
      {/* Structural Toggle Controller */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors flex-wrap"
        aria-expanded={expanded}
      >
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        <span>{transfers === 0 ? 'Direct' : `${transfers} change${transfers > 1 ? 's' : ''}`}</span>
        <span aria-hidden="true">&middot;</span>
        <span>{legs.length} leg{legs.length > 1 ? 's' : ''}</span>
      </button>

      {/* Main Structural Loop Container */}
      {expanded && (
        <div className="mt-3 space-y-0" role="list" aria-label="Journey legs">
          {legs.map((leg, i) => {
            const walking = isWalking(leg);
            const style = getLineStyle(leg);
            const transferMin = i > 0 ? getTransferMinutes(legs[i - 1], leg) : null;
            const riskyTransfer = transferMin !== null && transferMin < 10 && transferMin > 0;
            const showDogWarning = riskyTransfer && dogMode !== 'none';
            const showCarriageDropdown = expandedCarriageLeg === i && !walking;

            return (
              <div key={i} role="listitem">
                {/* 1. Optional Intermediate Connections/Transfers Block */}
                {i > 0 && transferMin !== null && transferMin > 0 && (
                  <TimelineTransferNode
                    minutes={transferMin}
                    isRisky={riskyTransfer}
                    showDogWarning={showDogWarning}
                  />
                )}
                
                {/* 2. Organized Section: Leg Departure Details */}
                <TimelineDepartureNode
                  time={formatTime(leg.departure)}
                  stationName={abbreviateStationName(leg.origin.name)}
                  badgeLabel={getLegBadgeLabel(leg)}
                  badgeTitle={getLegDescription(leg)}
                  platform={leg.departurePlatform}
                  delay={leg.departureDelay}
                  isWalking={walking}
                  lineStyle={style}
                  showConnector={i < legs.length - 1}
                />

                {/* Tracking Connector Line Axis */}
                <TimelineConnectorLine lineStyle={style} />
                
                {/* 3. Organized Section: Leg Arrival Details */}
                <TimelineArrivalNode
                  time={formatTime(leg.arrival)}
                  stationName={abbreviateStationName(leg.destination.name)}
                  platform={leg.arrivalPlatform}
                  delay={leg.arrivalDelay}
                  lineStyle={style}
                />

                {/* 4. Organized Section: Sub-Carriage Dropdown Actions */}
                {!walking && (
                  <div className="ml-7 mt-1 mb-2 min-w-0">
                    <button
                      type="button"
                      onClick={() => setExpandedCarriageLeg(showCarriageDropdown ? null : i)}
                      className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-primary transition-colors"
                    >
                      {showCarriageDropdown ? <ChevronUp size={12} /> : <ChevronDown size={12} />}{' '}
                      <LayoutGrid size={12} /> Train composition
                    </button>
                    
                    {showCarriageDropdown && (
                      <TrainComposition leg={leg} />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}