import { PawPrint } from "lucide-react";
import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function RecommendedDays({ currentDateStr, onDateChange }: { currentDateStr: string, onDateChange: (d: string) => void }) {
  const { t, i18n } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Sichere Datums-Mathematik (ignoriert Sommer-/Winterzeit-Sprünge)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeDate = new Date(currentDateStr || new Date());
  activeDate.setHours(0, 0, 0, 0);

  // 2. Wir generieren eine kontinuierliche Zeitleiste. 
  // Standard: 30 Tage ab heute. Liegt die Suche weiter in der Zukunft, erweitern wir dynamisch.
  const diffToActive = Math.ceil((activeDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const totalDaysToRender = Math.max(30, diffToActive + 14);

  const days = Array.from({ length: totalDaysToRender }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  const isRecommended = (d: Date) => [2, 3, 4, 6].includes(d.getDay());

  const formatDateStr = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const formatterDayLong = new Intl.DateTimeFormat(i18n.language, { weekday: 'long' });
  const formatterDayShort = new Intl.DateTimeFormat(i18n.language, { weekday: 'short' });
  const formatterDate = new Intl.DateTimeFormat(i18n.language, { day: '2-digit', month: '2-digit' });

  // 3. DIE MAGIE: Zentriert das Element butterweich, sobald sich das Datum ändert
  useEffect(() => {
    if (!scrollRef.current) return;
    
    // Wir suchen den Button mit dem passenden data-date Attribut
    const activeBtn = scrollRef.current.querySelector(`[data-date="${currentDateStr}"]`);
    if (activeBtn) {
      // Native Browser-API für perfekte Zentrierung
      activeBtn.scrollIntoView({ 
        behavior: 'smooth', 
        inline: 'center', 
        block: 'nearest' 
      });
    }
  }, [currentDateStr]);

  return (
    <div className="w-full mt-2 mb-6">
      
      <div className="rounded-2xl mb-2 py-2 px-1">
        <div className="flex items-center gap-3 mb-0.5">
          <div className="relative top-[10px] rounded-full bg-accent p-1">
            <PawPrint size={16} strokeWidth={2} className="text-white fill-white" />
          </div>
          <span className="text-[14px] font-bold text-slate-800 capitalize">
            {t('journeys.recommended.title')}
          </span>
        </div>
        <p className="text-[13px] text-slate-600 ml-[36px] leading-snug">
          {t('journeys.recommended.subtitle')}
        </p>
      </div>
      
      <div className="flex items-stretch gap-1.5 md:gap-2 w-full">
        <div 
          ref={scrollRef}
          // Das scroll-smooth hier unterstützt manuelles Wischen, behavior:'smooth' im JS steuert den Klick
          className="flex-1 flex gap-2 md:gap-3 overflow-x-auto pt-4 pb-3 pl-1 pr-4 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] scroll-smooth"
        >
          {days.map((d) => {
            const dateStr = formatDateStr(d);
            const isActive = dateStr === currentDateStr;
            const recommended = isRecommended(d);

            return (
              <button
                key={dateStr}
                data-date={dateStr} // Wichtig für den DOM-Query im useEffect!
                onClick={() => onDateChange(dateStr)}
                className={`
                  snap-center shrink-0 flex flex-col items-center justify-center py-1 px-2 md:py-2 md:px-2 rounded-xl transition-all duration-300 ease-out min-w-[72px] md:min-w-[96px] relative focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 overflow-visible
                  ${isActive 
                    ? 'active-day bg-primary border-primary text-white transform scale-[1.02] z-10 shadow-md' 
                    : recommended 
                      ? 'bg-white border-2 border-primary/40 text-slate-700 hover:border-primary hover:bg-blue-50 z-0' 
                      : 'bg-white text-slate-600 hover:border-2 hover:border-secondary hover:bg-slate-50 z-0'
                  }
                `}
              >
                <span className={`text-[14px] font-bold capitalize leading-tight ${isActive ? 'text-white' : 'text-slate-600'}`}>
                  <span className="md:hidden">{formatterDayShort.format(d).replace('.', '')}</span>
                  <span className="hidden md:inline">{formatterDayLong.format(d)}</span>
                </span>
                
                <span className={`text-[11px] mt-0.5 ${isActive ? 'text-white/90' : 'text-slate-500'}`}>
                  {formatterDate.format(d)}
                </span>
                
                {recommended && (
                  <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 w-[22px] h-[22px] flex items-center justify-center rounded-full bg-accent text-white shadow-sm">
                    <PawPrint 
                      size={14} 
                      strokeWidth={2} 
                      className="fill-white"
                      aria-label={t('journeys.recommended.recommendedForDogs')}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}