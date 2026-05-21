import { LayoutGrid, PawPrint, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
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

const gross1st = (t: TFunction): CarriageDef => ({
  type: '1st-gross',
  shortLabel: t('composition.labels.firstClass'),
  grossraum: true,
  isDogFriendly: true,
});

const gross2nd = (t: TFunction, seats?: number[]): CarriageDef => ({
  type: '2nd-gross',
  shortLabel: t('composition.labels.secondClass'),
  grossraum: true,
  isDogFriendly: true,
  dogSeats: seats,
});

const mehrzweck = (t: TFunction, seats?: number[]): CarriageDef => ({
  type: 'mehrzweck',
  shortLabel: t('composition.labels.mehrzweck'),
  grossraum: true,
  isDogFriendly: true,
  dogSeats: seats,
});

export function getCompositionSections(leg: Leg, t: TFunction): CompositionSection[] {
  const trainType = getTrainType(leg);
  const product = (leg.line?.product || '').toLowerCase();
  const name = (leg.line?.name || '').toLowerCase();
  
  if (trainType === 'ice' || name.startsWith('ice')) {
    return [
      {
        title: t('composition.trains.ice'),
        carriages: [
          gross1st(t),
          gross1st(t),
          { type: 'bistro', shortLabel: t('composition.labels.bistro'), grossraum: false, isDogFriendly: false },
          { type: 'familie', shortLabel: t('composition.labels.familie'), grossraum: true, isDogFriendly: false },
          gross2nd(t, [3, 4, 11, 12]),
          gross2nd(t),
          gross2nd(t),
          gross2nd(t),
          gross2nd(t),
          gross2nd(t),
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
        title: t('composition.trains.ic2'),
        carriages: [
          { type: 'loco', shortLabel: t('composition.labels.lok'), grossraum: false, isDogFriendly: false },
          gross1st(t),
          { type: 'bistro', shortLabel: t('composition.labels.cafe'), grossraum: false, isDogFriendly: false },
          gross2nd(t, [1, 2, 5, 6]),
          gross2nd(t),
          gross2nd(t),
        ],
      },
      {
        title: t('composition.trains.ic1'),
        carriages: [
          { type: 'loco', shortLabel: t('composition.labels.lok'), grossraum: false, isDogFriendly: false },
          gross1st(t),
          { type: 'bistro', shortLabel: t('composition.labels.bistro'), grossraum: false, isDogFriendly: false },
          { type: 'abteil', shortLabel: t('composition.labels.abteil'), grossraum: false, isDogFriendly: false },
          gross2nd(t, [5, 6, 11, 12]),
          gross2nd(t),
          gross2nd(t),
          gross2nd(t),
        ],
      },
    ];
  }

  return [
    {
      title: t('composition.trains.re1'),
      carriages: [
        mehrzweck(t, [1, 2, 3, 4]),
        gross2nd(t),
        gross2nd(t),
        gross1st(t),
      ],
    },
    {
      title: t('composition.trains.re2'),
      carriages: [
        mehrzweck(t),
        gross2nd(t),
        gross2nd(t),
        gross1st(t),
      ],
    },
  ];
}

function getDogSeatingAdvice(leg: Leg, t: TFunction) {
  const name = (leg.line?.name || '').toLowerCase();
  const product = (leg.line?.product || '').toLowerCase();
  const trainType = getTrainType(leg);

  if (trainType === 'ice' || name.startsWith('ice')) {
    return {
      zone: t('composition.advice.iceZone'),
      seats: t('composition.advice.iceSeats'),
      tip: t('composition.advice.iceTip')
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
        zone: t('composition.advice.ic2Zone'),
        seats: t('composition.advice.ic2Seats'),
        tip: t('composition.advice.ic2Tip')
      };
    }
    return {
      zone: t('composition.advice.ic1Zone'),
      seats: t('composition.advice.ic1Seats'),
      tip: t('composition.advice.ic1Tip')
    };
  }

  return {
    zone: t('composition.advice.regioZone'),
    seats: t('composition.advice.regioSeats'),
    tip: t('composition.advice.regioTip')
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

function DogSeatMap({ carriage, t }: { carriage: CarriageDef, t: TFunction }) {
  if (!carriage.grossraum || !carriage.dogSeats) return null;
  return (
    <div className="mt-2 p-2 bg-white rounded-lg border border-slate-200">
      <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-600 mb-1.5">
        <PawPrint size={10} className="text-accent shrink-0" />
        <span>{t('composition.ui.dogFriendly')}</span>
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
  const { t } = useTranslation();
  const sections = getCompositionSections(leg, t);
  const exampleGross = sections.flatMap(s => s.carriages).find(c => c.isDogFriendly && c.dogSeats?.length);
  const advice = getDogSeatingAdvice(leg, t);

  return (
    <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-slate-600 tracking-wide">
        <LayoutGrid size={14} className="shrink-0" />
        <span>{t('composition.ui.typical')}</span>
        <span className="text-slate-500 font-medium">
          {leg.line?.name ?? t('composition.trains.train')}{leg.direction ? ` — ${abbreviateStationName(leg.direction)}` : ''}
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

      {exampleGross && <DogSeatMap carriage={exampleGross} t={t} />}

      <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-700">
          <Info size={14} className="text-primary shrink-0" />
          <span>{t('composition.advice.title')}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 font-body">
          <div>
            <span className="font-semibold text-slate-700 block">{t('composition.advice.zone')}</span>
            {advice.zone}
          </div>
          <div>
            <span className="font-semibold text-slate-700 block">{t('composition.advice.seats')}</span>
            {advice.seats}
          </div>
        </div>
        <div className="text-slate-500 text-[11px] leading-relaxed pt-1 border-t border-slate-100 font-body">
          <span className="font-semibold text-slate-600">{t('composition.advice.tip')} </span>
          {advice.tip}
        </div>
      </div>
      
      <p className="text-[10px] text-slate-400 leading-snug font-body">
        {t('composition.ui.exampleNote')}
      </p>
    </div>
  );
}