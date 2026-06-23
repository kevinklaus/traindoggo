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
    }, 3000);
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
    <div className="flex flex-col items-center justify-center py-8 w-full animate-in fade-in duration-700">
      
      {/* UPDATE: Alle wilden Margins und 'left'-Werte sind raus. 
          Nur noch w-[100vw] shrink-0. Flexbox erledigt den Rest! 
          Auf Desktop (md:) gehen wir zurück auf w-full. 
      */}
    <div className="h-6 my-10 flex items-center justify-center relative overflow-hidden w-full">
        <span 
          key={textIndex} 
          className={`text-base sm:text-xl transition-colors duration-300 animate-in fade-in slide-in-from-bottom-2 text-secondary`}
        >
          {loadingTexts[textIndex]}
          {isPaused && <span className="sr-only"> (Pausiert)</span>}
        </span>
      </div>

      <div 
        role="button"
        tabIndex={0}
        aria-pressed={isPaused}
        aria-label={isPaused ? t('a11y.resume', 'Animation fortsetzen') : t('a11y.pause', 'Animation pausieren')}
        onClick={togglePause}
        onKeyDown={handleKeyDown}
        title={isPaused ? 'Klicken zum Fortsetzen' : 'Klicken zum Pausieren'}
        className={`relative overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-shadow bg-transparent edge-mask ${isPaused ? 'is-paused' : ''} 
          w-[100vw] shrink-0 md:w-full h-[100px] md:h-[180px] lg:h-[220px]`}
      >
        <style dangerouslySetInnerHTML={{__html: `
          @media (min-width: 768px) {
            .edge-mask {
              -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
              mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            }
          }

          @keyframes drive {
            0% { transform: translateX(-500px); }
            100% { transform: translateX(500px); }
          }
          @keyframes wag {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-25deg); }
          }
          
          #zug-komplett {
            animation: drive 2.5s linear infinite;
          }
          
          #hunde-rute {
            animation: wag 0.25s ease-in-out infinite;
            transform-box: fill-box;
            transform-origin: left bottom; 
          }
          
          .is-paused #zug-komplett,
          .is-paused #hunde-rute {
            animation-play-state: paused !important;
          }

          @media (prefers-reduced-motion: reduce) {
            #zug-komplett, #hunde-rute {
              animation-play-state: paused !important;
            }
          }
        `}} />

        <svg 
          viewBox="0 0 700 160" 
          preserveAspectRatio="xMidYMax slice" 
          className="w-full h-full block" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_1028_46)">
            <path opacity="0.8" d="M516 159C452.6 159 425.429 108.939 380.143 108.939C343.914 68.8909 301.648 58.8788 253.343 78.903C205.038 98.9273 162.771 92.2525 126.543 58.8788C90.3143 25.5051 54.0857 38.8545 17.8571 98.9273C-27.4286 138.976 -54.6 159 -118 159H516Z" fill="#d3dfee"/>
            <path opacity="0.4" d="M230 161C286.6 161 310.857 113.901 351.286 113.901C383.629 66.8013 421.362 55.0265 464.486 78.5762C507.61 102.126 545.343 94.2759 577.686 55.0265C610.029 15.777 642.371 31.4768 674.714 102.126C715.143 149.225 739.4 161 796 161H230Z" fill="#c0cdde"/>
            
            <path d="M290 160V130Z" fill="black"/>
            <path d="M290 160V130" stroke="#94A3B8" strokeWidth="4"/>
            <path d="M40 162V132Z" fill="black"/>
            <path d="M40 162V132" stroke="#94A3B8" strokeWidth="4"/>
            <path d="M680 162V132Z" fill="black"/>
            <path d="M680 162V132" stroke="#94A3B8" strokeWidth="4"/>
            <path d="M290 130L250 110ZM290 130L330 110Z" fill="black"/>
            <path d="M250 110L290 130L330 110" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round"/>
            <path d="M40 132L0 112ZM40 132L80 112Z" fill="black"/>
            <path d="M0 112L40 132L80 112" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round"/>
            <path d="M680 132L640 112ZM680 132L720 112Z" fill="black"/>
            <path d="M640 112L680 132L720 112" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round"/>
            <path d="M419 159V129Z" fill="black"/>
            <path d="M419 159V129" stroke="#94A3B8" strokeWidth="4"/>
            <path d="M419 129L379 109ZM419 129L459 109Z" fill="black"/>
            <path d="M379 109L419 129L459 109" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round"/>
            <path d="M0 110H700" stroke="#B6C6D8" strokeWidth="6"/>
            <path d="M0 108H700" stroke="#64748B" strokeWidth="1.5"/>

            <g id="zug-komplett">
              
              <g id="hunde-rute">
                <path d="M282 98C273.333 88 270.667 79.6667 274 73" stroke="#B45309" strokeWidth="4.5" strokeLinecap="round"/>
                <path d="M282 98C274.667 88 272.333 80 275 74" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round"/>
              </g>

              <path d="M260 106.5H428" stroke="#64748B" strokeWidth="2" strokeLinecap="round"/>
              <path d="M256 106C256 96 264 93 274 93H414C424 93 432 96 432 106H256Z" fill="white" stroke="#E2E8F0" strokeWidth="0.5"/>
              <path d="M274 96.5C268 96.5 263.333 97.6667 260 100C263.333 99.6667 268 99.5 274 99.5V96.5Z" fill="#1E293B"/>
              <path d="M414 96.5C420 96.5 424.667 97.6667 428 100C424.667 99.6667 420 99.5 414 99.5V96.5Z" fill="#1E293B"/>
              <path d="M256 104.5C262 103.5 266 103.5 274 103.5H414C422 103.5 426 103.5 432 104.5" stroke="#EF4444" strokeWidth="1.2"/>
              <path d="M277.3 95.5H277.2C276.537 95.5 276 96.0373 276 96.7V99.3C276 99.9627 276.537 100.5 277.2 100.5H277.3C277.963 100.5 278.5 99.9627 278.5 99.3V96.7C278.5 96.0373 277.963 95.5 277.3 95.5Z" fill="#1E293B"/>
              <path d="M282 98H297" stroke="#1E293B" strokeWidth="3" strokeLinecap="round"/>
              <path d="M302.3 95.5H302.2C301.537 95.5 301 96.0373 301 96.7V99.3C301 99.9627 301.537 100.5 302.2 100.5H302.3C302.963 100.5 303.5 99.9627 303.5 99.3V96.7C303.5 96.0373 302.963 95.5 302.3 95.5Z" fill="#1E293B"/>
              <path d="M307 98H322" stroke="#1E293B" strokeWidth="3" strokeLinecap="round"/>
              <path d="M327.3 95.5H327.2C326.537 95.5 326 96.0373 326 96.7V99.3C326 99.9627 326.537 100.5 327.2 100.5H327.3C327.963 100.5 328.5 99.9627 328.5 99.3V96.7C328.5 96.0373 327.963 95.5 327.3 95.5Z" fill="#1E293B"/>
              <path d="M332 98H347" stroke="#1E293B" strokeWidth="3" strokeLinecap="round"/>
              <path d="M352.3 95.5H352.2C351.537 95.5 351 96.0373 351 96.7V99.3C351 99.9627 351.537 100.5 352.2 100.5H352.3C352.963 100.5 353.5 99.9627 353.5 99.3V96.7C353.5 96.0373 352.963 95.5 352.3 95.5Z" fill="#1E293B"/>
              <path d="M357 98H372" stroke="#1E293B" strokeWidth="3" strokeLinecap="round"/>
              <path d="M377.3 95.5H377.2C376.537 95.5 376 96.0373 376 96.7V99.3C376 99.9627 376.537 100.5 377.2 100.5H377.3C377.963 100.5 378.5 99.9627 378.5 99.3V96.7C378.5 96.0373 377.963 95.5 377.3 95.5Z" fill="#1E293B"/>
              <path d="M382 98H397" stroke="#1E293B" strokeWidth="3" strokeLinecap="round"/>
              <path d="M387 93L391 90.5L389 89" stroke="#64748B" strokeWidth="0.8" strokeLinejoin="round"/>
              <path d="M387.5 89H390.5" stroke="#475569" strokeLinecap="round"/>
              <path d="M402.3 95.5H402.2C401.537 95.5 401 96.0373 401 96.7V99.3C401 99.9627 401.537 100.5 402.2 100.5H402.3C402.963 100.5 403.5 99.9627 403.5 99.3V96.7C403.5 96.0373 402.963 95.5 402.3 95.5Z" fill="#1E293B"/>
              <path d="M407 98H414" stroke="#1E293B" strokeWidth="3" strokeLinecap="round"/>
              <path d="M279 93V106ZM304 93V106ZM329 93V106ZM354 93V106ZM379 93V106ZM404 93V106Z" fill="black"/>
              <path d="M279 93V106M304 93V106M329 93V106M354 93V106M379 93V106M404 93V106" stroke="#CBD5E1" strokeWidth="0.5"/>
            </g>

            <path d="M0 160C100 160 120 64 160 64C200 64 220 160 280 160H0Z" fill="#8EACD6"/>
            <path d="M397 160C454.5 160 500.551 64.3389 546.667 54.1621C610.856 39.9971 604.167 160 700 160H397Z" fill="#90A3BE"/>
          </g>
          
          <defs>
            <clipPath id="clip0_1028_46">
              <rect width="700" height="160" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      </div>

     
      
    </div>
  );
}