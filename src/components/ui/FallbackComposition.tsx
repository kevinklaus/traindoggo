import { PawPrint, Armchair } from 'lucide-react';
import { TFunction } from 'i18next';
import { CarriageDef } from '../../lib/trainLayoutFallbacks';

interface Props {
  sections: { title: string; carriages: CarriageDef[] }[];
  exampleGross: CarriageDef | undefined;
  t: TFunction;
}

export function FallbackComposition({ sections, exampleGross, t }: Props) {
  const getThemeClass = (type: string) => {
    if (type.startsWith('1st')) return 'bg-amber-100 text-amber-900 border border-amber-300 shadow-sm';
    if (type === 'mehrzweck') return 'bg-sky-100 text-sky-900 border border-sky-300 shadow-sm';
    if (type === 'bistro') return 'bg-rose-100 text-rose-900 border border-rose-300 shadow-sm';
    if (type === 'loco') return 'bg-slate-200 text-slate-800 border border-slate-400 shadow-sm';
    if (type === 'familie') return 'bg-indigo-100 text-indigo-900 border border-indigo-300 shadow-sm';
    if (type === 'abteil') return 'bg-slate-100 text-slate-500 border border-slate-200 line-through decoration-slate-400';
    return 'bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-sm';
  };

  // Neues, weiches Seat-Design basierend auf deiner Skizze
  const Seat = ({ facing, hasPaw }: { facing: 'left' | 'right', hasPaw?: boolean }) => {
    const isRight = facing === 'right';
    return (
      <div className={`w-8 h-10 shrink-0 rounded-md bg-indigo-100 shadow-sm relative flex items-center justify-center ${
        isRight ? 'border-l-[5px] border-l-indigo-950' : 'border-r-[5px] border-r-indigo-950'
      }`}>
        {hasPaw && <PawPrint size={18} className="text-primary fill-primary drop-shadow-sm" />}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Die Wagenreihung (Badges) */}
      {sections.map((section, si) => (
        <div key={si} className="space-y-2 shrink-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">{section.title}</p>
          <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory" role="list">
            {section.carriages.map((c, ci) => (
              <div 
                key={`${si}-${ci}`} 
                className={`shrink-0 min-w-[4rem] max-w-[5.5rem] min-h-[2.75rem] px-2 py-1.5 rounded-lg flex flex-col items-center justify-center text-[11px] leading-tight font-bold relative select-none ${getThemeClass(c.type)}`}
              >
                {c.carriageNumber && <span className="text-[9px] opacity-70 block -mt-0.5 font-mono font-medium">#{c.carriageNumber}</span>}
                <span className="text-center">{c.shortLabel}</span>
                {c.isDogFriendly && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-primary border border-slate-200 shadow-sm">
                    <PawPrint size={9} strokeWidth={2.5} className="fill-primary" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* 2. Der illustrative Hunde-Sitzplan (3-Box-Grid Design) */}
      {exampleGross && (
        <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 shrink-0">
          <div className="flex items-center gap-2 mb-4">
            <Armchair size={16} className="text-slate-500" />
            <span className="text-sm font-bold text-slate-800">{t('composition.ui.dogFriendly', 'Hundefreundlicher Sitzplan (Beispiel)')}</span>
          </div>

          {/* Grid Layout für Mobile & Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* BOX 1: ABTEILWAGEN */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-1">
                  <span className="bg-yellow-400 text-slate-900 rounded-sm px-1.5 py-0.5 text-[10px] font-bold shadow-sm">1.</span>
                  <span className="bg-green-700 text-white rounded-sm px-1.5 py-0.5 text-[10px] font-bold shadow-sm">2.</span>
                </div>
                <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Abteilwagen</h3>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex justify-center gap-6">
                  {/* Abteil 1 */}
                  <div className="flex gap-4">
                     <div className="flex flex-col gap-2"><Seat facing="right" /><Seat facing="right" /><Seat facing="right" /></div>
                     <div className="flex flex-col gap-2"><Seat facing="left" /><Seat facing="left" /><Seat facing="left" /></div>
                  </div>
                  {/* Abteil 2 */}
                  <div className="flex gap-4">
                     <div className="flex flex-col gap-2"><Seat facing="right" /><Seat facing="right" /><Seat facing="right" /></div>
                     <div className="flex flex-col gap-2"><Seat facing="left" /><Seat facing="left" /><Seat facing="left" /></div>
                  </div>
                </div>
                {/* Flurwand */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-4"></div>
                {/* Gang */}
                <div className="h-6"></div>
              </div>
            </div>

            {/* BOX 2: 2. KL GROSSRAUM */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col relative overflow-hidden">
              <div className="flex items-center gap-2 mb-6">
                <span className="bg-green-700 text-white rounded-sm px-1.5 py-0.5 text-[10px] font-bold shadow-sm">2.</span>
                <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Großraumwagen</h3>
              </div>
              <div className="flex-1 flex flex-col justify-between relative">
                {/* Obere Reihe */}
                <div className="flex gap-4">
                   <Seat facing="right" /> <Seat facing="right" /> <Seat facing="right" />
                </div>
                {/* Gang */}
                <div className="h-6"></div>
                {/* Untere Reihen (Doppelblock) */}
                <div className="flex flex-col gap-2">
                   <div className="flex gap-4">
                     <Seat facing="right" hasPaw /> <Seat facing="right" hasPaw /> <Seat facing="right" />
                   </div>
                   <div className="flex gap-4">
                     <Seat facing="right" hasPaw /> <Seat facing="right" hasPaw /> <Seat facing="left" hasPaw />
                   </div>
                </div>
                {/* Raumtrenner / Wände rechts */}
                <div className="absolute right-0 top-0 h-[4.5rem] w-1.5 bg-slate-800 rounded-l-full"></div>
                <div className="absolute right-0 bottom-0 h-14 w-1.5 bg-slate-800 rounded-l-full"></div>
              </div>
            </div>

            {/* BOX 3: 1. KL GROSSRAUM */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col relative overflow-hidden">
              <div className="flex items-center gap-2 mb-6">
                <span className="bg-yellow-400 text-slate-900 rounded-sm px-1.5 py-0.5 text-[10px] font-bold shadow-sm">1.</span>
                <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Großraumwagen</h3>
              </div>
              <div className="flex-1 flex flex-col justify-between relative">
                {/* Obere Reihe (Vis-a-vis) */}
                <div className="flex gap-4">
                   <Seat facing="right" /> <Seat facing="left" hasPaw /> <Seat facing="left" hasPaw /> <Seat facing="right" />
                </div>
                {/* Gang */}
                <div className="h-6"></div>
                {/* Untere Reihe (Reihenbestuhlung) */}
                <div className="flex gap-4">
                   <Seat facing="right" /> <Seat facing="right" /> <Seat facing="right" /> <Seat facing="right" />
                </div>
                {/* Raumtrenner / Wand rechts */}
                <div className="absolute right-0 bottom-0 h-20 w-1.5 bg-slate-800 rounded-l-full"></div>
              </div>
            </div>

          </div>
          
          {/* Legende */}
          <div className="flex gap-6 mt-6 justify-center text-[11px] text-slate-600 font-medium">
            <div className="flex items-center gap-1.5">
              <PawPrint size={14} className="text-primary fill-primary" /> = Empfohlener Platz
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-4 border-l-[3px] border-indigo-950 bg-indigo-100 rounded-[2px] shadow-sm"></div> = Rückenlehne
            </div>
          </div>
        </div>
      )}
    </div>
  );
}