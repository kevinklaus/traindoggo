import { Circle, Brain as Train, Footprints, AlertTriangle, ChevronDown, ChevronUp, LayoutGrid, PawPrint } from 'lucide-react';
import { useState } from 'react';
import type { Leg } from '../lib/types';
import { formatTime, getTransferMinutes, getLegLabel, getLineStyle, isWalking, countTransfers, getTrainType } from '../lib/helpers';

interface Props {
  legs: Leg[];
  dogMode: 'none' | 'small' | 'large';
}

interface CarriageDef {
  type: string;
  label: string;
  dogFriendly: boolean;
  dogSeats?: number[];
}

function getCarriageComposition(leg: Leg): CarriageDef[] {
  const trainType = getTrainType(leg);
  if (trainType === 'ice') {
    return [
      { type: '1st', label: '1st', dogFriendly: false },
      { type: '1st', label: '1st', dogFriendly: false },
      { type: 'grossraum', label: 'Open', dogFriendly: true, dogSeats: [3, 4, 11, 12] },
      { type: 'grossraum', label: 'Open', dogFriendly: true, dogSeats: [5, 6, 13, 14] },
      { type: 'bistro', label: 'Bistro', dogFriendly: false },
      { type: 'grossraum', label: 'Open', dogFriendly: true, dogSeats: [2, 3, 10, 11] },
      { type: 'grossraum', label: 'Open', dogFriendly: true, dogSeats: [4, 5, 12, 13] },
      { type: 'abteil', label: 'Comp.', dogFriendly: false },
    ];
  }
  if (trainType === 'ic' || trainType === 'ec') {
    return [
      { type: 'loco', label: 'Loco', dogFriendly: false },
      { type: '1st', label: '1st', dogFriendly: false },
      { type: '1st', label: '1st', dogFriendly: false },
      { type: 'grossraum', label: 'Open', dogFriendly: true, dogSeats: [3, 4, 9, 10] },
      { type: 'grossraum', label: 'Open', dogFriendly: true, dogSeats: [5, 6, 11, 12] },
      { type: 'bistro', label: 'Bistro', dogFriendly: false },
      { type: 'abteil', label: 'Comp.', dogFriendly: false },
      { type: 'grossraum', label: 'Open', dogFriendly: true, dogSeats: [2, 3, 8, 9] },
    ];
  }
  return [
    { type: 'grossraum', label: 'Open', dogFriendly: true, dogSeats: [2, 3, 8, 9] },
    { type: 'grossraum', label: 'Open', dogFriendly: true, dogSeats: [4, 5, 10, 11] },
    { type: 'abteil', label: 'Comp.', dogFriendly: false },
    { type: 'grossraum', label: 'Open', dogFriendly: true, dogSeats: [1, 2, 7, 8] },
  ];
}

function CarriageLayout({ leg }: { leg: Leg }) {
  const carriages = getCarriageComposition(leg);
  const lineName = leg.line?.name ?? 'Train';
  const direction = leg.direction ?? '';

  return (
    <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 tracking-wide mb-2">
        <LayoutGrid size={14} aria-hidden="true" />
        {lineName} carriage layout
        {direction && <span className="font-normal text-slate-400 ml-1">to {direction}</span>}
      </div>
      <div className="flex gap-1 overflow-x-auto pb-1" role="list" aria-label="Carriage layout">
        {carriages.map((c, i) => (
          <div
            key={i}
            role="listitem"
            className={`shrink-0 w-14 h-9 rounded-lg flex items-center justify-center text-xs font-medium border-2 relative ${
              c.type === '1st'
                ? 'bg-amber-50 border-amber-300 text-amber-700'
                : c.type === 'bistro'
                ? 'bg-primary/5 border-primary/30 text-primary'
                : c.type === 'loco'
                ? 'bg-slate-200 border-slate-300 text-slate-500'
                : c.dogFriendly
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-white border-slate-200 text-slate-600'
            }`}
            title={c.dogFriendly ? 'Best space for dogs' : c.label}
          >
            {c.label}
            {c.dogFriendly && (
              <PawPrint size={8} className="absolute -top-1.5 -right-1.5 text-accent bg-white rounded-full p-px border border-accent/30" aria-label="Dog-friendly carriage" />
            )}
          </div>
        ))}
      </div>
      {carriages.some((c) => c.dogFriendly) && (
        <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-400 flex-wrap">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-amber-300" aria-hidden="true" /> 1st class
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-emerald-300" aria-hidden="true" /> Open plan
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-primary/30" aria-hidden="true" /> Bistro
          </span>
          <span className="flex items-center gap-1">
            <PawPrint size={8} className="text-accent" aria-hidden="true" /> Best for dogs
          </span>
        </div>
      )}
    </div>
  );
}

function DogSeatMap({ carriage }: { carriage: CarriageDef }) {
  if (!carriage.dogFriendly || !carriage.dogSeats) return null;
  const seats = Array.from({ length: 16 }, (_, i) => i + 1);

  return (
    <div className="mt-2 p-2 bg-white rounded-lg border border-slate-200">
      <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 mb-1.5">
        <PawPrint size={10} className="text-accent" aria-hidden="true" />
        Dog-friendly seats in {carriage.label} carriage
      </div>
      <div className="grid grid-cols-8 gap-1">
        {seats.map((seat) => {
          const isDog = carriage.dogSeats!.includes(seat);
          return (
            <div
              key={seat}
              className={`w-6 h-5 rounded text-[9px] flex items-center justify-center font-medium ${
                isDog
                  ? 'bg-accent/15 text-accent border border-accent/30'
                  : 'bg-slate-50 text-slate-400 border border-slate-100'
              }`}
              title={isDog ? 'Great seat for dogs' : `Seat ${seat}`}
            >
              {isDog ? <PawPrint size={8} /> : seat}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function JourneyTimeline({ legs, dogMode }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [expandedCarriage, setExpandedCarriage] = useState<number | null>(null);
  const transfers = countTransfers(legs);

  return (
    <div className="mt-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        aria-expanded={expanded}
        aria-label={`${transfers === 0 ? 'Direct route' : `${transfers} change${transfers > 1 ? 's' : ''}`}. ${expanded ? 'Hide' : 'Show'} details`}
      >
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        {transfers === 0 ? 'Direct' : `${transfers} change${transfers > 1 ? 's' : ''}`}
        <span className="text-slate-300" aria-hidden="true">&middot;</span>
        {legs.length} leg{legs.length > 1 ? 's' : ''}
      </button>

      {expanded && (
        <div className="mt-3 space-y-0" role="list" aria-label="Journey legs">
          {legs.map((leg, i) => {
            const walking = isWalking(leg);
            const legLabel = getLegLabel(leg);
            const style = getLineStyle(leg);
            const transferMin = i > 0 ? getTransferMinutes(legs[i - 1], leg) : null;
            const riskyTransfer = transferMin !== null && transferMin < 10 && transferMin >= 0;
            const showDogWarning = riskyTransfer && dogMode !== 'none';
            const isZeroTransfer = i > 0 && transferMin !== null && transferMin <= 0;
            const showCarriage = expandedCarriage === i && !walking;

            if (isZeroTransfer) return null;

            return (
              <div key={i} role="listitem">
                {i > 0 && transferMin !== null && !isZeroTransfer && (
                  <div className="flex items-center gap-2 py-1.5 pl-6 flex-wrap">
                    <Circle size={8} fill={riskyTransfer ? '#dc2626' : '#94a3b8'} className="shrink-0" aria-hidden="true" />
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        riskyTransfer
                          ? 'bg-red-100 text-red-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {transferMin}m transfer
                    </span>
                    {showDogWarning && (
                      <span className="inline-flex items-center gap-1 text-xs text-red-600 font-medium" role="alert">
                        <AlertTriangle size={12} aria-hidden="true" />
                        Risky for dogs
                      </span>
                    )}
                  </div>
                )}
                <div className="flex items-start gap-3 py-1.5">
                  <div className="flex flex-col items-center pt-1" aria-hidden="true">
                    <div
                      className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: style.bg }}
                    >
                      {walking ? (
                        <Footprints size={8} className="text-slate-400" />
                      ) : (
                        <Train size={8} style={{ color: style.bg }} />
                      )}
                    </div>
                    {i < legs.length - 1 && (
                      <div className="w-[2px] flex-1 min-h-[20px]" style={{ backgroundColor: style.bg, opacity: 0.3 }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-slate-800 tabular-nums whitespace-nowrap">
                        {formatTime(leg.departure)}
                      </span>
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-md whitespace-nowrap"
                        style={{ backgroundColor: style.bg, color: style.text }}
                      >
                        {legLabel}
                      </span>
                      {leg.departurePlatform && (
                        <span className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded whitespace-nowrap">
                          Pl. {leg.departurePlatform}
                        </span>
                      )}
                      {leg.departureDelay && leg.departureDelay > 0 && (
                        <span className="text-xs text-red-600 whitespace-nowrap">
                          +{leg.departureDelay}m
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-600 mt-0.5 truncate">
                      {leg.origin.name}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 ml-[7px]" aria-hidden="true">
                  <div className="w-[2px] min-h-[16px]" style={{ backgroundColor: style.bg, opacity: 0.3 }} />
                </div>
                <div className="flex items-start gap-3 py-1.5">
                  <div className="flex flex-col items-center pt-1" aria-hidden="true">
                    <Circle size={4} fill={style.bg} className="shrink-0" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-slate-800 tabular-nums whitespace-nowrap">
                        {formatTime(leg.arrival)}
                      </span>
                      {leg.arrivalPlatform && (
                        <span className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded whitespace-nowrap">
                          Pl. {leg.arrivalPlatform}
                        </span>
                      )}
                      {leg.arrivalDelay && leg.arrivalDelay > 0 && (
                        <span className="text-xs text-red-600 whitespace-nowrap">
                          +{leg.arrivalDelay}m
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-600 mt-0.5 font-semibold truncate">
                      {leg.destination.name}
                      <span className="font-normal text-slate-400 ml-1">Get off</span>
                    </div>
                  </div>
                </div>
                {!walking && (
                  <div className="ml-7 mt-1 mb-2">
                    <button
                      onClick={() => setExpandedCarriage(showCarriage ? null : i)}
                      className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-primary transition-colors"
                      aria-expanded={showCarriage}
                      aria-label={`Carriage layout for ${legLabel}`}
                    >
                      {showCarriage ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      <LayoutGrid size={12} aria-hidden="true" />
                      Carriage layout
                    </button>
                    {showCarriage && (
                      <>
                        <CarriageLayout leg={leg} />
                        {getCarriageComposition(leg).filter((c) => c.dogFriendly).map((c, ci) => (
                          <DogSeatMap key={ci} carriage={c} />
                        ))}
                      </>
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
