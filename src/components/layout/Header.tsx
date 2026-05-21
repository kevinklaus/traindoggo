import {PawPrint, Train } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function LogoMark({ size = 'default' }: { size?: 'default' | 'large' }) {
  const wrap = size === 'large' ? 'w-16 h-16 rounded-2xl' : 'w-12 h-12 rounded-xl';
  const primaryIconSize = size === 'large' ? 26 : 20;
  const secondaryIconSize = size === 'large' ? 18 : 14;
  
  return (
    <div
      className={`relative flex items-center justify-center bg-primary shadow-lg shadow-primary/25 ${wrap}`}
      aria-hidden="true"
    >
      {/* Das neue kombinierte Logo: Zug im Hintergrund, Pfote darüber */}
      <Train size={primaryIconSize} className="text-white/40 absolute" strokeWidth={2} />
      <PawPrint size={secondaryIconSize} className="text-white relative z-10 translate-y-0.5 translate-x-0.5" strokeWidth={2.5} />
    </div>
  );
}

interface Props {
  onLogoClick?: () => void;
}

export default function Header({ onLogoClick }: Props) {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('de') ? 'en' : 'de';
    i18n.changeLanguage(nextLang);
  };

  return (
    <header className="bg-white/85 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 h-[73px] flex items-center">
      <div className="max-w-3xl mx-auto px-4 w-full flex items-center justify-between min-w-0">
        
        <button onClick={onLogoClick} className="hover:opacity-90 transition-opacity flex items-center gap-3 text-left min-w-0">
          <LogoMark />
          <div className="min-w-0 flex-1">
            <h1 className="text-[clamp(1.05rem,4vw,1.35rem)] font-bold text-slate-900 tracking-tight font-heading leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
              Train Doggo
            </h1>
            <p className="text-xs sm:text-[13px] text-slate-500 font-body leading-snug mt-0.5 hidden sm:block">
              {t('header.subtitle')}
            </p>
          </div>
        </button>

        <div className="flex items-center gap-3 shrink-0">
          {/* Sprachumschalter */}
          <button 
            onClick={toggleLanguage}
            className="px-2.5 py-1 text-xs font-bold border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 rounded-lg transition-colors bg-slate-50"
          >
            {i18n.language.startsWith('de') ? 'English 🌐' : 'Deutsch 🥔'}
          </button>

{/*           {dogMode !== 'none' && (
            <div className="hidden sm:flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-xl text-xs font-semibold">
              <Dog size={14} className="text-amber-600" />
              <span className="capitalize">{t('header.dogStatus', { mode: dogMode })}</span>
            </div>
          )} */}
        </div>

      </div>
    </header>
  );
}