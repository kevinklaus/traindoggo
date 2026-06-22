import { PawPrint, Info } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function RecommendedDays({ currentDateStr, onDateChange }: { currentDateStr: string, onDateChange: (d: string) => void }) {
  const { t, i18n } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showInfo, setShowInfo] = useState(false);

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

  // 3. Weiches Zentrieren bei Datum-Wechsel
  useEffect(() => {
    if (!scrollRef.current) return;
    
    const activeBtn = scrollRef.current.querySelector(`[data-date="${currentDateStr}"]`);
    if (activeBtn) {
      activeBtn.scrollIntoView({ 
        behavior: 'smooth', 
        inline: 'center', 
        block: 'nearest' 
      });
    }
  }, [currentDateStr]);

  return (
    <div className="w-full mb-2 sm:mb-4">
      
      {/* Kompakter Header mit Tooltip 
      <div className=" relative z-20">
        //Tooltip Trigger & Content 
        <div className="relative flex items-center">
          <button 
            type="button"
            onClick={() => setShowInfo(!showInfo)}
            onMouseEnter={() => setShowInfo(true)}
            onMouseLeave={() => setShowInfo(false)}
            onBlur={() => setShowInfo(false)}
            className="text-slate-400 hover:text-accent transition-colors focus:outline-none p-1 -ml-1 rounded-full flex items-center gap-2"
            aria-label="Info"
          >
            <span className="text-sm font-bold text-slate-800 capitalize leading-none px-1">
              {t('journeys.recommended.title')}
            </span>
            <div className="bg-accent rounded-full p-0.5 flex items-center justify-center shrink-0">
              <PawPrint size={10} strokeWidth={2} className="text-white fill-white" />
            </div>
          </button>

          {showInfo && (
            <div className="absolute left-0 top-full mt-1.5 w-[260px] sm:w-[300px] bg-slate-800 text-white text-[13px] leading-relaxed p-3 rounded-xl shadow-xl z-50 pointer-events-none animate-in fade-in zoom-in-95">
              {t('journeys.recommended.subtitle')}
              {/* Kleines Dreieck nach oben für die Sprechblasen-Optik 
              <div className="absolute -top-1 left-3.5 w-3 h-3 bg-slate-800 rotate-45 rounded-sm"></div>
            </div>
          )}
        </div>
      </div> */}
      
      {/* Slider */}
      <div className="flex items-stretch gap-1.5 md:gap-2 w-full">
        <div 
          ref={scrollRef}
          className="flex-1 flex gap-2 md:gap-3 overflow-x-auto pt-4 pb-3 pl-1 pr-4 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] scroll-smooth"
        >
          {days.map((d) => {
            const dateStr = formatDateStr(d);
            const isActive = dateStr === currentDateStr;
            const recommended = isRecommended(d);

            return (
              <button
                key={dateStr}
                data-date={dateStr}
                onClick={() => onDateChange(dateStr)}
                className={`
                  snap-center shrink-0 flex flex-col items-center justify-center py-1 px-2 md:py-2 md:px-2 rounded-2xl transition-all duration-300 ease-out min-w-[72px] md:min-w-[96px] relative focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 overflow-visible
                  ${isActive 
                    ? 'active-day bg-secondary border-2 border-secondary text-white transform scale-[1.02] z-10' 
                    : recommended 
                      ? 'bg-white border-2 border-secondary text-slate-700 hover:border-accent hover:bg-slate-50 z-0' 
                      : 'bg-white text-slate-600 hover:border-2 hover:border-secondary hover:bg-slate-50 z-0'
                  }
                `}
              >
                <span className={`text-sm font-bold capitalize leading-tight ${isActive ? 'text-white' : 'text-secondary'}`}>
                  <span className="md:hidden">{formatterDayShort.format(d).replace('.', '')}</span>
                  <span className="hidden md:inline">{formatterDayLong.format(d)}</span>
                </span>
                
                <span className={`text-[12px] ${isActive ? 'text-white/90' : 'text-slate-500'}`}>
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