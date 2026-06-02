import { PawPrint } from 'lucide-react';
import { TFunction } from 'i18next';
import { CarriageDef } from '../../lib/trainLayoutFallbacks';

interface Props {
  sections: { title: string; carriages: CarriageDef[] }[];
  exampleGross: CarriageDef | undefined;
  t: TFunction;
}

export function FallbackComposition({ sections, exampleGross, t }: Props) {
  const getThemeClass = (type: string) => {
    if (type.startsWith('1st')) return 'bg-amber-50 border-amber-300 text-amber-800';
    if (type === 'mehrzweck') return 'bg-sky-50 border-sky-300 text-sky-800';
    if (type === 'bistro') return 'bg-primary/5 border-primary/35 text-primary';
    if (type === 'loco') return 'bg-slate-200 border-slate-400 text-slate-600';
    if (type === 'familie') return 'bg-indigo-50/50 border-indigo-200 text-indigo-700';
    if (type === 'abteil') return 'bg-slate-50 border-slate-200 text-slate-400 line-through decoration-slate-300';
    return 'bg-emerald-50 border-emerald-400 text-emerald-900';
  };

  return (
    <>
      {sections.map((section, si) => (
        <div key={si} className="space-y-1.5 shrink-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">{section.title}</p>
          <div className="flex gap-1.5 overflow-x-auto pb-1 snap-x snap-mandatory" role="list">
            {section.carriages.map((c, ci) => (
              <div key={`${si}-${ci}`} className={`shrink-0 min-w-[3.75rem] max-w-[5.2rem] min-h-[2.5rem] px-1 py-1 rounded-xl flex flex-col items-center justify-center text-[10px] leading-tight font-semibold border-2 relative select-none ${getThemeClass(c.type)}`}>
                {c.carriageNumber && <span className="text-[9px] opacity-60 block -mt-0.5 font-mono">#{c.carriageNumber}</span>}
                <span>{c.shortLabel}</span>
                {c.isDogFriendly && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white border border-accent/40 text-accent shadow-sm">
                    <PawPrint size={10} strokeWidth={2.5} />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {exampleGross && exampleGross.dogSeats && (
        <div className="mt-2 p-2 bg-white rounded-lg border border-slate-200 shrink-0">
          <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-600 mb-1.5">
            <PawPrint size={10} className="text-accent shrink-0" />
            <span>{t('composition.ui.dogFriendly')}</span>
          </div>
          <div className="grid grid-cols-8 gap-1">
            {Array.from({ length: 16 }, (_, idx) => idx + 1).map((seat) => {
              const isDog = exampleGross.dogSeats!.includes(seat);
              return (
                <div key={seat} className={`w-6 h-5 rounded text-[9px] flex items-center justify-center font-medium select-none ${isDog ? 'bg-accent/15 text-accent border border-accent/35 font-bold' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                  {isDog ? <PawPrint size={8} /> : seat}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}