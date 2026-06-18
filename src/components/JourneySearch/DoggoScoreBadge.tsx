import { PawPrint } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import type { DoggoScoreResult } from "../../lib/doggoScore";

interface Props {
  result: DoggoScoreResult;
}

export default function DoggoScoreBadge({ result }: Props) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Berechnet die exakte Position des Buttons auf dem Bildschirm
  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 8, // 8px Abstand nach unten
        left: rect.right + window.scrollX,     // Bindet das Menü an die rechte Kante
      });
    }
  };

  // Updatet die Position beim Scrollen oder Resizen
  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  // Schließt das Menü, wenn man daneben tippt (angepasst für das Portal)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const isOutsideTrigger = triggerRef.current && !triggerRef.current.contains(e.target as Node);
      const isOutsidePopover = popoverRef.current && !popoverRef.current.contains(e.target as Node);
      
      if (isOutsideTrigger && isOutsidePopover) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Grace-Period für weiches Hovering
  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150); // 150ms Puffer für die Mausbewegung
  };
  
  const getConfig = (s: number) => {
    if (s > 66) return { colorClass: 'text-emerald-700', pawClass: 'text-emerald-700 fill-emerald-700', borderClass: 'border-emerald-600', bgClass: 'bg-emerald-100 hover:bg-emerald-200' };
    if (s > 33) return { colorClass: 'text-slate-600', pawClass: 'text-slate-600 fill--slate-600', borderClass: 'border--slate-600', bgClass: 'bg-slate-100 hover:bg-slate-200' };
    return { colorClass: 'text-red-600', pawClass: 'text-red-600', borderClass: 'border-red-500', bgClass: 'bg-slate-100 hover:bg-slate-200' };
  };

  const { colorClass, pawClass, borderClass, bgClass } = getConfig(result.total);

  // Das Portal mountet das HTML komplett außerhalb der Karte direkt in den Body
  const popoverContent = isOpen ? createPortal(
    <div 
      ref={popoverRef}
      style={{ 
        position: 'absolute', 
        top: `${position.top}px`, 
        left: `${position.left}px`,
        transform: 'translateX(-100%)' // Schiebt das Menü exakt nach links, damit es rechtsbündig abschließt
      }}
      className={`w-64 sm:w-72 bg-white border-2 rounded-2xl p-4 sm:p-5 z-[99999] text-sm animate-in fade-in slide-in-from-top-2 shadow-xl ${borderClass}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex">
        <h4 className="font-bold text-slate-800 mb-3">{t('score.details', 'Score details')}</h4>
        <span className="ml-2"><PawPrint size={14} strokeWidth={2.5} className={`relative top-[0.1rem] ${pawClass}`}/></span>
      </div>
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
    </div>,
    document.body
  ) : null;

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-expanded={isOpen}
        className={`${bgClass} flex flex-col items-end px-2.5 py-1.5 rounded-xl transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary`}
      >
        <div className="inline-flex items-center gap-1.5">        
          <div className={`flex items-baseline gap-0.5 ${colorClass}`}>
            <span className="text-lg font-bold">{result.total}</span>
            {/* <span className="text-[10px]">/ 100</span> */}
            <span className="ml-1"><PawPrint size={14} strokeWidth={2.5} className={`relative top-[0.1rem] ${pawClass}`}/></span>
          </div>
        </div>
      </button>
      
      {popoverContent}
    </div>
  );
}