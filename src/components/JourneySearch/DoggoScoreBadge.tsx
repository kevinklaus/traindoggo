import { PawPrint } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { DoggoScoreResult } from "../../lib/doggoScore";

interface Props {
  result: DoggoScoreResult;
}

export default function DoggoScoreBadge({ result }: Props) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Schließt das Menü, wenn man auf dem Handy daneben tippt
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const getConfig = (s: number) => {
    if (s > 66) return { colorClass: 'text-primary', bgClass: 'bg-primary/5 hover:bg-primary/10' };
    if (s > 33) return { colorClass: 'text-secondary', bgClass: 'bg-secondary/5 hover:bg-secondary/10' };
    return { colorClass: 'text-red-500', bgClass: 'bg-red-50 hover:bg-red-100' };
  };

  const { colorClass, bgClass } = getConfig(result.total);

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        aria-expanded={isOpen}
        className={`flex flex-col items-end px-2.5 py-1.5 rounded-xl transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary ${bgClass}`}
      >
        <div className="inline-flex items-center gap-1.5">        
          <div className={`flex items-baseline gap-0.5 ${colorClass}`}>
            <span className="text-lg font-bold tracking-tight">{result.total}</span>
            <span className="text-[10px] font-bold">/ 100</span>
            <span className="ml-1"><PawPrint size={12} className="text-secondary fill-secondary"/></span>
          </div>
        </div>
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 top-full mt-2 w-64 sm:w-72 bg-white shadow-xl rounded-2xl p-4 sm:p-5 z-50 text-sm animate-in fade-in slide-in-from-top-2"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <h4 className="font-bold text-slate-800 mb-3">{t('score.details', 'Score details')}</h4>
          <ul className="space-y-2.5">
            {result.breakdown.map((item, idx) => (
              <li key={idx} className="flex justify-between items-start gap-4">
                <span className="text-slate-600 leading-snug">
                  {t(`score.${item.key}`, { val: item.val })}
                </span>
                <span className={`font-medium shrink-0 ${item.points >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {item.points > 0 ? '+' : ''}{item.points}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}