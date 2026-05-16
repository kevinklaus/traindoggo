import { LayoutGrid, PawPrint, Info } from 'lucide-react';
import { getTrainType, abbreviateStationName } from '../../lib/helpers';
import type { Leg } from '../../lib/types';

export interface CarriageDef {
  type: string;
  shortLabel: string;
  grossraum: boolean;
  isDogFriendly?: boolean;
  dogSeats?: number[];
}

interface CompositionSection {
  title: string;
  carriages: CarriageDef[];
}

const gross1st = (): CarriageDef => ({
  type: '1st-gross',
  shortLabel: '1. Kl.',
  grossraum: true,
  isDogFriendly: true,
});

const gross2nd = (seats?: number[]): CarriageDef => ({
  type: '2nd-gross',
  shortLabel: '2. Kl.',
  grossraum: true,
  isDogFriendly: true,
  dogSeats: seats,
});

const mehrzweck = (seats?: number[]): CarriageDef => ({
  type: 'mehrzweck',
  shortLabel: 'Mehrzweck',
  grossraum: true,
  isDogFriendly: true,
  dogSeats: seats,
});

export function getCompositionSections(leg: Leg): CompositionSection[] {
  const trainType = getTrainType(leg);
  const product = (leg.line?.product || '').toLowerCase();
  const name = (leg.line?.name || '').toLowerCase();
  
  if (trainType === 'ice' || name.startsWith('ice')) {
    return [
      {
        title: 'ICE',
        carriages: [
          gross1st(),
          gross1st(),
          { type: 'bistro', shortLabel: 'Bistro', grossraum: false, isDogFriendly: false },
          { type: 'familie', shortLabel: 'Familie', grossraum: true, isDogFriendly: false },
          gross2nd([3, 4, 11, 12]),
          gross2nd(),
          gross2nd(),
          gross2nd(),
          gross2nd(),
          gross2nd(),
        ],
      },
    ];
  }

  if (
    trainType === 'ic' || 
    trainType === 'ec' || 
    product === 'flx' || 
    product === 'national' ||
    name.startsWith('ic') || 
    name.startsWith('ec') || 
    name.startsWith('flx')
  ) {
    return [
      {
        title: 'IC2 Doppelstock — Häufiger Einsatz · Offener Großraum',
        carriages: [
          { type: 'loco', shortLabel: 'Lok', grossraum: false, isDogFriendly: false },
          gross1st(),
          { type: 'bistro', shortLabel: 'Café', grossraum: false, isDogFriendly: false },
          gross2nd([1, 2, 5, 6]),
          gross2nd(),
          gross2nd(),
        ],
      },
      {
        title: 'IC1 Traditionell — Gelegentlicher Einsatz · Gemischte Wagentypen',
        carriages: [
          { type: 'loco', shortLabel: 'Lok', grossraum: false, isDogFriendly: false },
          gross1st(),
          { type: 'bistro', shortLabel: 'Bistro', grossraum: false, isDogFriendly: false },
          { type: 'abteil', shortLabel: 'Abteil', grossraum: false, isDogFriendly: false },
          gross2nd([5, 6, 11, 12]),
          gross2nd(),
          gross2nd(),
          gross2nd(),
        ],
      },
    ];
  }

  return [
    {
      title: 'Regional-Express — Zugteil 1',
      carriages: [
        mehrzweck([1, 2, 3, 4]),
        gross2nd(),
        gross2nd(),
        gross1st(),
      ],
    },
    {
      title: 'Regional-Express — Zugteil 2',
      carriages: [
        mehrzweck(),
        gross2nd(),
        gross2nd(),
        gross1st(),
      ],
    },
  ];
}

function getDogSeatingAdvice(leg: Leg) {
  const name = (leg.line?.name || '').toLowerCase();
  const product = (leg.line?.product || '').toLowerCase();
  const trainType = getTrainType(leg);

  if (trainType === 'ice' || name.startsWith('ice')) {
    return {
      zone: 'Open Saloon (Großraum) · Quiet Zone preferred',
      seats: 'Table configurations (Tisch) or back-to-back bulkhead rows',
      tip: 'Provides maximum open floor space out of the main aisle. Avoid closed compartments or family zones to significantly minimize noise stress for your pet.'
    };
  }

  if (
    trainType === 'ic' || 
    trainType === 'ec' || 
    product === 'flx' || 
    name.startsWith('ic') || 
    name.startsWith('ec') || 
    name.startsWith('flx')
  ) {
    if (name.includes('20') || name.includes('24')) {
      return {
        zone: 'Lower Deck (Unterdeck) only',
        seats: 'Row seats adjacent to the wide entrance vestibules',
        tip: 'IC2 double-decker cars feature steep, narrow stairwells. Staying on the lower deck level entirely avoids difficult climbs for large, heavy, or senior dogs.'
      };
    }
    return {
      zone: 'Open Saloon (Großraum)',
      seats: 'Window seats flanking open corner partitions',
      tip: 'Traditional 6-seat compartments leave zero usable floor area when fully occupied. Open layout cars offer safer, predictable spatial boundaries.'
    };
  }

  return {
    zone: 'Multi-Purpose Area (Mehrzweckabteil)',
    seats: 'Fold-up longitudinal seat benches near bicycle slots',
    tip: 'Look for large bicycle/wheelchair stencils on the car exterior. These zones feature open floor sections. Keep your dog closely leashed near passenger boarding flows.'
  };
}

function CarriageChip({ c, sectionIdx, carIdx }: { c: CarriageDef; sectionIdx: number; carIdx: number }) {
  const themes: Record<string, string> = {
    'bistro': 'bg-primary/5 border-primary/35 text-primary',
    'loco': 'bg-slate-200 border-slate-400 text-slate-600',
    'familie': 'bg-indigo-50/50 border-indigo-200 text-indigo-700',
    'abteil': 'bg-slate-50 border-slate-200 text-slate-400 line-through decoration-slate-300'
  };

  const themeClass = 
    c.type.startsWith('1st') ? 'bg-amber-50 border-amber-300 text-amber-800' :
    themes[c.type] || (c.type === 'mehrzweck' ? 'bg-sky-50 border-sky-300 text-sky-800' : 'bg-emerald-50 border-emerald-400 text-emerald-900');

  return (
    <div key={`${sectionIdx}-${carIdx}`} role="listitem" title={c.isDogFriendly ? 'Dog-friendly open plan layout container.' : c.shortLabel} className={`shrink-0 min-w-[3.75rem] max-w-[5.2rem] min-h-[2.5rem] px-1 py-1 rounded-xl flex flex-col items-center justify-center text-[10px] leading-tight font-semibold border-2 relative select-none ${themeClass}`}>
      <span>{c.shortLabel}</span>
      {c.isDogFriendly && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white border border-accent/40 text-accent shadow-sm animate-fade-in">
          <PawPrint size={10} strokeWidth={2.5} />
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
        <span>Dog-friendly seat map alignment (example)</span>
      </div>
      <div className="grid grid-cols-8 gap-1">
        {Array.from({ length: 16 }, (_, idx) => idx + 1).map((seat) => {
          const isDog = carriage.dogSeats!.includes(seat);
          return (
            <div key={seat} className={`w-6 h-5 rounded text-[9px] flex items-center justify-center font-medium select-none ${isDog ? 'bg-accent/15 text-accent border border-accent/35 font-bold' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
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
  const exampleGross = sections.flatMap(s => s.carriages).find(c => c.isDogFriendly && c.dogSeats?.length);
  const advice = getDogSeatingAdvice(leg);

  return (
    <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-slate-600 tracking-wide">
        <LayoutGrid size={14} className="shrink-0" />
        <span>Typical train composition</span>
        <span className="text-slate-500 font-medium">
          {leg.line?.name ?? 'Train'}{leg.direction ? ` — ${abbreviateStationName(leg.direction)}` : ''}
        </span>
      </div>
      
      {sections.map((section, si) => (
        <div key={si} className="space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">{section.title}</p>
          <div className="flex gap-1.5 overflow-x-auto pb-1 snap-x snap-mandatory" role="list">
            {section.carriages.map((c, ci) => (
              <CarriageChip key={ci} c={c} sectionIdx={si} carIdx={ci} />
            ))}
          </div>
        </div>
      ))}

      {exampleGross && <DogSeatMap carriage={exampleGross} />}

      <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-700">
          <Info size={14} className="text-primary shrink-0" />
          <span>Dog-First Reservation Advice</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 font-body">
          <div>
            <span className="font-semibold text-slate-700 block">Recommended Zone:</span>
            {advice.zone}
          </div>
          <div>
            <span className="font-semibold text-slate-700 block">Best Seat Arrangement:</span>
            {advice.seats}
          </div>
        </div>
        <div className="text-slate-500 text-[11px] leading-relaxed pt-1 border-t border-slate-100 font-body">
          <span className="font-semibold text-slate-600">Expert Companion Tip: </span>
          {advice.tip}
        </div>
      </div>
      
      <p className="text-[10px] text-slate-400 leading-snug font-body">
        Example configurations modeled after DB standards — always check track indicators before boarding.
      </p>
    </div>
  );
}