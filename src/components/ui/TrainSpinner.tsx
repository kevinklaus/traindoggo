import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function TrainSpinner() {
  const { t } = useTranslation();
  const [textIndex, setTextIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const loadingTexts = [
    t('journeys.searching1', 'Suche Verbindungen…'),
    t('journeys.searching2', 'Taking paw steps…'),
    t('journeys.searching3', 'Checking seat spacing…'),
  ];

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setTextIndex((current) => (current + 1) % loadingTexts.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [loadingTexts.length, isPaused]);

  const togglePause = () => setIsPaused(!isPaused);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); 
      togglePause();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      
      {/* Container: Transparent, breiter (max-w-[500px]) und mit weichem Fade-Out an den Rändern */}
      <div 
        role="button"
        tabIndex={0}
        aria-pressed={isPaused}
        aria-label={isPaused ? t('a11y.resume', 'Animation fortsetzen') : t('a11y.pause', 'Animation pausieren')}
        onClick={togglePause}
        onKeyDown={handleKeyDown}
        title={isPaused ? 'Klicken zum Fortsetzen' : 'Klicken zum Pausieren'}
        className={`relative overflow-hidden w-full max-w-[500px] shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-shadow bg-transparent ${isPaused ? 'is-paused' : ''}`}
        // Der magische CSS-Fade-Out für die Ränder
        style={{ 
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' 
        }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes drive {
            /* Startet weiter links und fährt weiter nach rechts, da die Box jetzt breiter ist */
            0% { transform: translateX(-250px); }
            100% { transform: translateX(600px); }
          }
          @keyframes wag {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-25deg); }
          }
          .animate-drive {
            animation: drive 3s linear infinite;
          }
          .animate-wag {
            animation: wag 0.25s ease-in-out infinite;
            transform-origin: 28px 100px; 
          }
          .is-paused .animate-drive,
          .is-paused .animate-wag {
            animation-play-state: paused !important;
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-drive, .animate-wag {
              animation-play-state: paused !important;
            }
          }
        `}} />

        {/* viewBox verbreitert (-150 bis 550), dadurch skaliert es nativ ohne aspect-ratio Hacks */}
        <svg viewBox="-150 0 700 160" className="w-full h-auto block">
          
          {/* 1. HINTERGRUND BERGE (Fließen weich in die neue Breite aus) */}
            <path d="M -170 160 C -100 160, -70 120, -20 120 Q 40 60 120 90 T 260 70 T 380 110 C 430 150, 460 160, 530 160 Z" fill="#bac8db" opacity="0.4" />
          <path d="M -150 160 C -80 160, -80 130, -20 130 Q 80 70 170 110 T 320 80 T 420 130 C 480 160, 480 160, 550 160 Z" fill="#b6c9e1" opacity="0.5" />

          {/* 2. BRÜCKE (Verlängert über die ganze Breite) */}
          <path d="M 120 160 L 120 130" stroke="#94a3b8" strokeWidth="4" />
          <path d="M 120 130 L 80 110 M 120 130 L 160 110" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
          <path d="M 280 160 L 280 130" stroke="#94a3b8" strokeWidth="4" />
          <path d="M 280 130 L 240 110 M 280 130 L 320 110" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
          <line x1="-150" y1="110" x2="550" y2="110" stroke="#cbd5e1" strokeWidth="6" />
          <line x1="-150" y1="110" x2="550" y2="110" stroke="#64748b" strokeWidth="1.5" />

          {/* 3. DER ICE 3 */}
          <g className="animate-drive">
            <g className="animate-wag">
              <path d="M 28 100 Q 15 85 20 75" fill="none" stroke="#b45309" strokeWidth="4.5" strokeLinecap="round" />
              <path d="M 28 100 Q 17 85 21 76" fill="none" stroke="#fcd34d" strokeWidth="2" strokeLinecap="round" />
            </g>

            <line x1="6" y1="108.5" x2="174" y2="108.5" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
            <path d="M 2 108 C 2 98, 10 95, 20 95 L 160 95 C 170 95, 178 98, 178 108 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />

            <path d="M 20 98.5 Q 11 98.5 6 102 Q 11 101.5 20 101.5 Z" fill="#1e293b" />
            <path d="M 160 98.5 Q 169 98.5 174 102 Q 169 101.5 160 101.5 Z" fill="#1e293b" />
            <path d="M 2 106.5 C 8 105.5, 12 105.5, 20 105.5 L 160 105.5 C 168 105.5, 172 105.5, 178 106.5" fill="none" stroke="#ef4444" strokeWidth="1.2" />

            <rect x="22" y="97.5" width="2.5" height="5" rx="1.2" fill="#1e293b" />
            <line x1="28" y1="100" x2="43" y2="100" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
            <rect x="47" y="97.5" width="2.5" height="5" rx="1.2" fill="#1e293b" />
            <line x1="53" y1="100" x2="68" y2="100" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
            <rect x="72" y="97.5" width="2.5" height="5" rx="1.2" fill="#1e293b" />
            <line x1="78" y1="100" x2="93" y2="100" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
            <rect x="97" y="97.5" width="2.5" height="5" rx="1.2" fill="#1e293b" />
            <line x1="103" y1="100" x2="118" y2="100" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
            <rect x="122" y="97.5" width="2.5" height="5" rx="1.2" fill="#1e293b" />
            <line x1="128" y1="100" x2="143" y2="100" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
            
            {/* Einholm-Pantograf */}
            <path d="M 133 95 L 137 92.5 L 135 91" fill="none" stroke="#64748b" strokeWidth="0.8" strokeLinejoin="round" />
            <line x1="133.5" y1="91" x2="136.5" y2="91" stroke="#475569" strokeWidth="1" strokeLinecap="round" />

            <rect x="147" y="97.5" width="2.5" height="5" rx="1.2" fill="#1e293b" />
            <line x1="153" y1="100" x2="160" y2="100" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />

            <path d="M 25 95 V 108 M 50 95 V 108 M 75 95 V 108 M 100 95 V 108 M 125 95 V 108 M 150 95 V 108" stroke="#cbd5e1" strokeWidth="0.5" />
          </g>

          {/* 4. VORDERGRUND BERGE (Fließen sanft in den Boden und verschwinden) */}
          <path d="M -150 160 C -50 160, -30 60, 10 60 C 50 60, 70 160, 130 160 Z" fill="#64748b" />
          <path d="M 270 160 C 330 160, 350 60, 390 60 C 430 60, 450 160, 550 160 Z" fill="#8090a8" />

        </svg>
      </div>

      <div className="h-6 mt-4 flex items-center justify-center relative overflow-hidden w-full">
        <span 
          key={textIndex} 
          className={`text-sm font-semibold tracking-wide transition-colors duration-300 animate-in fade-in slide-in-from-bottom-2 ${isPaused ? 'text-slate-400' : 'text-slate-600'}`}
        >
          {loadingTexts[textIndex]}
          {isPaused && <span className="sr-only"> (Pausiert)</span>}
        </span>
      </div>
      
    </div>
  );
}