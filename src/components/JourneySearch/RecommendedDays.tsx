import { PawPrint, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export default function RecommendedDays({ currentDateStr, onDateChange }: { currentDateStr: string, onDateChange: (d: string) => void }) {
  const { t, i18n } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // 1. Sichere Datums-Mathematik (ignoriert Sommer-/Winterzeit-Sprünge)
  const baseDate = new Date(currentDateStr || new Date());
  const today = new Date();
  
  const utcBase = Date.UTC(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
  const utcToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const diffDays = Math.floor((utcBase - utcToday) / (1000 * 60 * 60 * 24));

  // 2. Offset-Logik: Standard ist -3, aber wir stoßen niemals weiter zurück als "Heute" (-diffDays)
  const startOffset = Math.max(-3, -diffDays);

  const days = [0, 1, 2, 3, 4, 5, 6].map(i => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + startOffset + i);
    return d;
  });

  const isRecommended = (d: Date) => [2, 3, 4, 6].includes(d.getDay());

  const formatDateStr = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Zwei Formatter: Einen kurzen für Mobile (Mo, Di), einen langen für Desktop (Montag, Dienstag)
  const formatterDayLong = new Intl.DateTimeFormat(i18n.language, { weekday: 'long' });
  const formatterDayShort = new Intl.DateTimeFormat(i18n.language, { weekday: 'short' });
  const formatterDate = new Intl.DateTimeFormat(i18n.language, { day: '2-digit', month: '2-digit' });

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      // Puffer von 2px für Subpixel-Rundungsfehler im Browser
      setShowRightArrow(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 2);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [currentDateStr]);

  // const handleScroll = (dir: 'left' | 'right') => {
  //   if (scrollRef.current) {
  //     const amount = scrollRef.current.clientWidth * 0.75;
  //     scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  //   }
  // };

  return (
    <div className="w-full mt-2 mb-6">
      
      <div className=" rounded-2xl mb-2 py-2 px-1">
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
      
      {/* Wrapper für Pfeile und Scroll-Area - items-stretch erzwingt gleiche Höhe! */}
      <div className="flex items-stretch gap-1.5 md:gap-2 w-full">
        
        {/* Linker Pfeil - pt-4 pb-3 synchronisiert die Höhe mit dem Scroll-Container
        <div className={`hidden sm:flex flex-col pt-4 pb-3 shrink-0 ${showLeftArrow ? '' : 'sm:hidden'}`}>
          <button 
            onClick={() => handleScroll('left')}
            className="flex-1 px-1.5 md:px-2 rounded-xl border-2 border-slate-200 bg-white text-slate-500 hover:border-primary hover:text-primary transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Zurück scrollen"
          >
            <ChevronLeft size={20} />
          </button>
        </div> */}

        {/* Scroll Container 
          - pr-4 & pt-4: Schafft den inneren Platz, damit die absolut positionierten Pfoten nicht von overflow-x-auto abgeschnitten werden.
          - pl-1: Minimaler Abstand zum linken Pfeil.
        */}
        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex-1 flex gap-2 md:gap-3 overflow-x-auto pt-4 pb-3 pl-1 pr-4 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] scroll-smooth"
        >
          {days.map((d) => {
            const dateStr = formatDateStr(d);
            const isActive = dateStr === currentDateStr;
            const recommended = isRecommended(d);

            return (
              <button
                key={dateStr}
                onClick={() => onDateChange(dateStr)}
                className={`
                  snap-center shrink-0 flex flex-col items-center justify-center py-1 px-2 md:py-2 md:px-2 rounded-xl border-2 transition-all min-w-[72px] md:min-w-[96px] relative focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 overflow-visible
                  ${isActive 
                    ? 'active-day bg-primary border-primary text-white transform scale-[1.02] z-10' 
                    : recommended 
                      ? 'bg-white border-primary/40 text-slate-700 hover:border-primary hover:bg-blue-50 z-0' 
                      : 'bg-white text-slate-600 hover:border-secondary hover:bg-slate-50 z-0'
                  }
                `}
              >
                <span className={`text-[14px] font-bold capitalize leading-tight ${isActive ? 'text-white' : 'text-secodary'}`}>
                  {/* Auf Mobile kurz (Di), auf Desktop lang (Dienstag) */}
                  <span className="md:hidden">{formatterDayShort.format(d).replace('.', '')}</span>
                  <span className="hidden md:inline">{formatterDayLong.format(d)}</span>
                </span>
                
                <span className={`text-[11px] mt-0.5 ${isActive ? 'text-white/90' : 'text-secondary'}`}>
                  {formatterDate.format(d)}
                </span>
                
                {/* Schwebende Pfote - Nutzt den durch pt-4 & pr-4 freigeschaufelten Platz im Scroll-Container */}
                {recommended && (
                  <div className={`absolute -top-2 -right-2 md:-top-3 md:-right-3 w-[22px] h-[22px] flex items-center justify-center w-[22px] h-[22px] rounded-full bg-accent text-white`}>
                    <PawPrint 
                      size={14} 
                      strokeWidth={2} 
                      className={`fill-white`}
                      aria-label={t('journeys.recommended.recommendedForDogs')}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Rechter Pfeil */}
        {/* <div className={`hidden sm:flex flex-col pt-4 pb-3 shrink-0 ${showLeftArrow ? '' : 'sm:hidden'}`}>
          <button 
            onClick={() => handleScroll('right')}
            className="flex-1 px-1.5 md:px-2 rounded-xl border-2 border-slate-200 bg-white text-slate-500 hover:border-primary hover:text-primary transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Weiter scrollen"
          >
            <ChevronRight size={20} />
          </button>
        </div> */}

      </div>
    </div>
  );
}