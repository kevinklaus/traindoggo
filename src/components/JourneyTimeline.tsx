import { Circle, Train, Footprints, AlertTriangle, ChevronDown, ChevronUp, LayoutGrid, PawPrint } from 'lucide-react';
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
  getTrainType,
  abbreviateStationName,
} from '../lib/helpers';
import { Badge } from './ui/Primitives';

interface Props {
  legs: Leg[];
  dogMode: 'none' | 'small' | 'large';
}

interface CarriageDef {
  type: string;
  shortLabel: string;
  grossraum: boolean;
  dogSeats?: number[];
}

interface CompositionSection {
  title: string;
  carriages: CarriageDef[];
}

const gross = (seats: number[]): CarriageDef => ({
  type: 'grossraum',
  shortLabel: 'Großraum',
  grossraum: true,
  dogSeats: seats,
});

function getCompositionSections(leg: Leg): CompositionSection[] {
  const trainType = getTrainType(leg);
  if (trainType === 'ice') {
    return [
      {
        title: 'ICE — Zugteil 1 (Beispiel)',
        carriages: [{ type: '1st', shortLabel: '1.', grossraum: false }, { type: '1st', shortLabel: '1.', grossraum: false }, gross([3, 4, 11, 12]), gross([5, 6, 13, 14]), { type: 'bistro', shortLabel: 'Bistro', grossraum: false }],
      },
      {
        title: 'ICE — Zugteil 2 (Beispiel)',
        carriages: [gross([2, 3, 10, 11]), gross([4, 5, 12, 13]), { type: 'abteil', shortLabel: 'Abteil', grossraum: false }, gross([1, 2, 7, 8]), { type: '1st', shortLabel: '1.', grossraum: false }],
      },
    ];
  }
  if (trainType === 'ic' || trainType === 'ec') {
    return [
      {
        title: 'IC / EC — Lok + Wagenpark (Beispiel)',
        carriages: [{ type: 'loco', shortLabel: 'Lok', grossraum: false }, { type: '1st', shortLabel: '1.', grossraum: false }, { type: '1st', shortLabel: '1.', grossraum: false }, gross([3, 4, 9, 10]), gross([5, 6, 11, 12]), { type: 'bistro', shortLabel: 'Bistro', grossraum: false }, { type: 'abteil', shortLabel: 'Abteil', grossraum: false }, gross([2, 3, 8, 9])],
      },
    ];
  }
  return [
    {
      title: 'Regional (Beispiel)',
      carriages: [gross([2, 3, 8, 9]), gross([4, 5, 10, 11]), { type: 'abteil', shortLabel: 'Abteil', grossraum: false }, gross([1, 2, 7, 8])],
    },
  ];
}

function CarriageChip({ c, sectionIdx, carIdx }: { c: CarriageDef; sectionIdx: number; carIdx: number }) {
  const themes: Record<string, string> = {
    '1st': 'bg-amber-50 border-amber-300 text-amber-800',
    'bistro': 'bg-primary/5 border-primary/35 text-primary',
    'loco': 'bg-slate-200 border-slate-400 text-slate-600'
  };
  const themeClass = themes[c.type] || (c.grossraum ? 'bg-emerald-50 border-emerald-400 text-emerald-900' : 'bg-white border-slate-200 text-slate-600');

  return (
    <div key={`${sectionIdx}-${carIdx}`} role="listitem" title={c.grossraum ? 'Best space for dogs. Großraum (open plan).' : c.shortLabel} className={`shrink-0 min-w-[3.25rem] max-w-[4.5rem] min-h-[2.25rem] px-1 py-0.5 rounded-lg flex flex-col items-center justify-center text-[10px] leading-tight font-semibold border-2 relative ${themeClass}`}>
      <span>{c.shortLabel}</span>
      {c.grossraum && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white border border-accent/40 text-accent shadow-sm">
          <PawPrint size={11} strokeWidth={2.2} />
        </span>
      )}
    </div>
  );
}

export default function JourneyTimeline({ legs, dogMode }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [expandedCarriageLeg, setExpandedCarriageLeg] = useState<number | null>(null);
  const transfers = countTransfers(legs);

  return (
    <div className="mt-3">
      <button type="button" onClick={() => setExpanded(!expanded)} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors flex-wrap" aria-expanded={expanded}>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        <span>{transfers === 0 ? 'Direct' : `${transfers} change${transfers > 1 ? 's' : ''}`}</span>
        <span aria-hidden="true">&middot;</span>
        <span>{legs.length} leg{legs.length > 1 ? 's' : ''}</span>
      </button>

      {expanded && (
        <div className="mt-3 space-y-0" role="list" aria-label="Journey legs">
          {legs.map((leg, i) => {
            const walking = isWalking(leg);
            const style = getLineStyle(leg);
            const transferMin = i > 0 ? getTransferMinutes(legs[i - 1], leg) : null;
            const riskyTransfer = transferMin !== null && transferMin < 10 && transferMin > 0;
            const exampleGross = getCompositionSections(leg).flatMap(s => s.carriages).find(c => c.grossraum && c.dogSeats?.length);

            return (
              <div key={i} role="listitem">
                {i > 0 && transferMin !== null && transferMin > 0 && (
                  <div className="flex items-center gap-2 py-1.5 pl-6 flex-wrap">
                    <Circle size={8} fill={riskyTransfer ? '#dc2626' : '#94a3b8'} className="shrink-0" />
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${riskyTransfer ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>{transferMin}m transfer</span>
                    {riskyTransfer && dogMode !== 'none' && <span className="inline-flex items-center gap-1 text-xs text-red-600 font-medium"><AlertTriangle size={12} /> Risky for dogs</span>}
                  </div>
                )}
                
                {/* Leg Departure Details */}
                <div className="flex items-start gap-3 py-1.5 min-w-0">
                  <div className="flex flex-col items-center pt-1 shrink-0">
                    <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: style.bg }}>
                      {walking ? <Footprints size={8} className="text-slate-400" /> : <Train size={8} style={{ color: style.bg }} />}
                    </div>
                    {i < legs.length - 1 && <div className="w-[2px] flex-1 min-h-[20px]" style={{ backgroundColor: style.bg, opacity: 0.3 }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-slate-800 tabular-nums">{formatTime(leg.departure)}</span>
                      <Badge style={{ backgroundColor: style.bg, color: style.text }} title={getLegDescription(leg)}>{getLegBadgeLabel(leg)}</Badge>
                      {leg.departurePlatform && <span className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">Pl. {leg.departurePlatform}</span>}
                      {leg.departureDelay && leg.departureDelay > 0 && <span className="text-xs text-red-600">+{leg.departureDelay}m</span>}
                    </div>
                    <div className="text-sm text-slate-600 mt-0.5">{abbreviateStationName(leg.origin.name)}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 ml-[7px]"><div className="w-[2px] min-h-[16px]" style={{ backgroundColor: style.bg, opacity: 0.3 }} /></div>
                
                {/* Leg Arrival Details */}
                <div className="flex items-start gap-3 py-1.5 min-w-0">
                  <div className="flex flex-col items-center pt-1 shrink-0"><Circle size={4} fill={style.bg} /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-slate-800 tabular-nums">{formatTime(leg.arrival)}</span>
                      {leg.arrivalPlatform && <span className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">Pl. {leg.arrivalPlatform}</span>}
                      {leg.arrivalDelay && leg.arrivalDelay > 0 && <span className="text-xs text-red-600">+{leg.arrivalDelay}m</span>}
                    </div>
                    <div className="text-sm text-slate-600 mt-0.5 font-semibold">
                      {abbreviateStationName(leg.destination.name)} <span className="font-normal text-slate-400 ml-1 text-xs">Get off</span>
                    </div>
                  </div>
                </div>

                {/* Sub-Carriage Dropdown Actions */}
                {!walking && (
                  <div className="ml-7 mt-1 mb-2 min-w-0">
                    <button type="button" onClick={() => setExpandedCarriageLeg(expandedCarriageLeg === i ? null : i)} className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-primary transition-colors">
                      {expandedCarriageLeg === i ? <ChevronUp size={12} /> : <ChevronDown size={12} />} <LayoutGrid size={12} /> Train composition
                    </button>
                    {expandedCarriageLeg === i && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-slate-600 tracking-wide">
                          <LayoutGrid size={14} className="shrink-0" />
                          <span>Composition (example)</span>
                          <span className="text-slate-500 font-medium">{leg.line?.name ?? 'Train'}{leg.direction ? ` — ${abbreviateStationName(leg.direction)}` : ''}</span>
                        </div>
                        {getCompositionSections(leg).map((section, si) => (
                          <div key={si} className="space-y-1.5">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{section.title}</p>
                            <div className="flex gap-1.5 overflow-x-auto pb-1 snap-x snap-mandatory" role="list">
                              {section.carriages.map((c, ci) => <CarriageChip key={ci} c={c} sectionIdx={si} carIdx={ci} />)}
                            </div>
                          </div>
                        ))}
                        {exampleGross?.dogSeats && (
                          <div className="mt-2 p-2 bg-white rounded-lg border border-slate-200">
                            <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-600 mb-1.5"><PawPrint size={10} className="text-accent shrink-0" /><span>Dog-friendly seats (example)</span></div>
                            <div className="grid grid-cols-8 gap-1">
                              {Array.from({ length: 16 }, (_, idx) => idx + 1).map((seat) => {
                                const isDog = exampleGross.dogSeats!.includes(seat);
                                return (
                                  <div key={seat} className={`w-6 h-5 rounded text-[9px] flex items-center justify-center font-medium ${isDog ? 'bg-accent/15 text-accent border border-accent/35' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                                    {isDog ? <PawPrint size={8} /> : seat}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
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