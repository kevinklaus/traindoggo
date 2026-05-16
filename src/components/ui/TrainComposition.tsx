import { LayoutGrid, PawPrint } from 'lucide-react';
import { getTrainType, abbreviateStationName } from '../../lib/helpers';
import type { Leg } from '../../lib/types';

export interface CarriageDef {
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

export function getCompositionSections(leg: Leg): CompositionSection[] {
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

function DogSeatMap({ carriage }: { carriage: CarriageDef }) {
  if (!carriage.grossraum || !carriage.dogSeats) return null;
  return (
    <div className="mt-2 p-2 bg-white rounded-lg border border-slate-200">
      <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-600 mb-1.5">
        <PawPrint size={10} className="text-accent shrink-0" />
        <span>Dog-friendly seats (example · Großraum)</span>
      </div>
      <div className="grid grid-cols-8 gap-1">
        {Array.from({ length: 16 }, (_, idx) => idx + 1).map((seat) => {
          const isDog = carriage.dogSeats!.includes(seat);
          return (
            <div key={seat} className={`w-6 h-5 rounded text-[9px] flex items-center justify-center font-medium ${isDog ? 'bg-accent/15 text-accent border border-accent/35' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
              {isDog ? <PawPrint size={8} /> : seat}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface TrainCompositionProps {
  leg: Leg;
}

export default function TrainComposition({ leg }: TrainCompositionProps) {
  const sections = getCompositionSections(leg);
  const exampleGross = sections.flatMap(s => s.carriages).find(c => c.grossraum && c.dogSeats?.length);

  return (
    <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-slate-600 tracking-wide">
        <LayoutGrid size={14} className="shrink-0" />
        <span>Composition (example)</span>
        <span className="text-slate-500 font-medium">
          {leg.line?.name ?? 'Train'}{leg.direction ? ` — ${abbreviateStationName(leg.direction)}` : ''}
        </span>
      </div>
      
      {sections.map((section, si) => (
        <div key={si} className="space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{section.title}</p>
          <div className="flex gap-1.5 overflow-x-auto pb-1 snap-x snap-mandatory" role="list">
            {section.carriages.map((c, ci) => (
              <CarriageChip key={ci} c={c} sectionIdx={si} carIdx={ci} />
            ))}
          </div>
        </div>
      ))}

      {exampleGross && <DogSeatMap carriage={exampleGross} />}
      
      <p className="text-[10px] text-slate-500 leading-snug">
        Example layouts only — always check your platform displays.
      </p>
    </div>
  );
}