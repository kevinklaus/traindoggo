import { PawPrint } from 'lucide-react';
import { CarriageDef } from '../../lib/trainLayoutFallbacks';

interface Props {
  sections: { title: string; carriages: CarriageDef[] }[];
}

export function FallbackComposition({ sections}: Props) {
  const getThemeClass = (type: string) => {
    if (type.startsWith('1st')) return 'bg-amber-100';
    if (type === 'mehrzweck') return 'bg-sky-100 ';
    if (type === 'bistro') return 'bg-rose-100 ';
    if (type === 'loco') return 'bg-slate-200 ';
    if (type === 'familie') return 'bg-indigo-100 ';
    if (type === 'abteil') return 'bg-slate-100 ';
    return 'bg-emerald-100 ';
  };

  return (
    <div className="space-y-6">
      {/* 1. Die Wagenreihung (Badges) */}
      {sections.map((section, si) => (
        <div key={si} className="shrink-0">
          <p className="pb-2 px-1.5">
            {section.title}
          </p>
          <div className="flex gap-2 pb-5 pt-2 snap-x snap-mandatory overflow-x-auto" role="list">
            {section.carriages.map((c, ci) => (
              <div 
                key={`${si}-${ci}`} 
                className={`shrink-0 min-w-[4.5rem] max-w-[6rem] min-h-[2.75rem] px-4 py-2 rounded-lg flex flex-col items-center justify-center text-sm leading-tight relative select-none ${getThemeClass(c.type)}`}
              >
                {c.carriageNumber && <span className="text-[9px] opacity-70 block -mt-0.5 font-mono font-medium">#{c.carriageNumber}</span>}
                <span className="text-center">{c.shortLabel}</span>
                {c.isDogFriendly && (
                  <span className={`absolute -top-3.5 -right-3.5 flex h-7 w-7 items-center justify-center rounded-full text-primary`} data-alt-text="Hundefreundlich" >
                    <PawPrint size={14} strokeWidth={2.5} className="fill-primary" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}