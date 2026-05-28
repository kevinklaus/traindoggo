import { useState, useEffect } from 'react';
import { Route, Menu, X, Globe, MoonStar, Bone, TrainFront } from 'lucide-react';
import type { DogMode } from '../../lib/types';
import { useTranslation } from 'react-i18next';

// ============================================================================
// LOGO COMPONENT
// ============================================================================
export function LogoMark({ size = 'default' }: { size?: 'default' | 'large' }) {
  const wrap = size === 'large' ? 'w-16 h-16 rounded-2xl' : 'w-10 h-10 sm:w-12 sm:h-12 rounded-xl';
  const iconSize = size === 'large' ? 34 : 24;
  return (
    <div
      className={`relative flex items-center justify-center bg-primary shadow-lg shadow-primary/25 shrink-0 ${wrap}`}
      aria-hidden="true"
    >
      <Route size={iconSize} className="text-white" strokeWidth={2} />
    </div>
  );
}

// ============================================================================
// MAIN HEADER COMPONENT
// ============================================================================
interface Props {
  dogMode: DogMode;
  onLogoClick?: () => void;
}

export default function Header({ dogMode, onLogoClick }: Props) {
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('de') ? 'en' : 'de';
    i18n.changeLanguage(nextLang);
  };

  const handleNavClick = (callback?: () => void) => {
    setIsMobileMenuOpen(false);
    if (callback) callback();
  };

  const navItems = [
    { 
      label: t('nav.home', 'Start'), 
      icon: <Route size={18} />, 
      onClick: () => handleNavClick(onLogoClick),
      alwaysVisibleOnTablet: true 
    },
    { 
      label: t('nav.doggoTips', 'Doggo-Tipps'), 
      icon: <Bone size={18} />, 
      onClick: () => handleNavClick(onLogoClick),
      soon: true
    },
    { 
      label: t('nav.destinations', 'Reiseziele'), 
      icon: <TrainFront size={18} />, 
      onClick: () => handleNavClick(onLogoClick),
      soon: true
    },
    { 
      label: t('nav.nightTrains', 'Nachtzüge'), 
      icon: <MoonStar size={18} />, 
      onClick: () => handleNavClick(onLogoClick),
      soon: true
    },
  ];

  return (
    <>
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 h-[64px] sm:h-[73px] flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between gap-4 min-w-0">
          
          {/* LEFT: Flex-1 zwingt diese Seite, genauso viel Platz zu nehmen wie die rechte Seite */}
          <div className="flex-1 flex justify-start min-w-0">
            <button 
              onClick={onLogoClick} 
              className="hover:opacity-90 transition-opacity flex items-center gap-2.5 sm:gap-3 text-left min-w-0"
            >
              <LogoMark />
              <div className="flex flex-col justify-center min-w-0 text-left">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight font-heading leading-none truncate">
                  Train Doggo
                </h1>
                <p className="hidden sm:block text-[13px] text-slate-500 font-body leading-snug mt-0.5 truncate">
                  {t('header.subtitle', 'Züge für dich und deinen Hund')}
                </p>
              </div>
            </button>
          </div>

          {/* CENTER: Das Menü. Da links und rechts flex-1 haben, ist das hier absolut zentriert */}
          <nav className="hidden md:flex shrink-0 justify-center items-center gap-1 lg:gap-4" aria-label="Main Navigation">
            {navItems.map((item, idx) => (
              <button 
                key={idx}
                onClick={item.onClick}
                className={`
                  items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-colors
                  ${item.alwaysVisibleOnTablet ? 'flex' : 'hidden lg:flex'}
                  text-slate-600 hover:text-primary hover:bg-slate-50
                `}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.soon && (
                  <span className="text-[9px] uppercase tracking-wider font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-md ml-0.5">
                    {t('nav.soon', 'Bald')}
                  </span>
                )}
              </button>
            ))}
          </nav>
          
          {/* RIGHT: Flex-1 auf der rechten Seite als unsichtbares Gegengewicht zur linken Seite */}
          <div className="flex-1 flex items-center justify-end gap-1 sm:gap-3 shrink-0">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 text-sm font-semibold text-slate-600 hover:text-primary hover:bg-slate-50 rounded-xl transition-colors"
              title={t('header.langSwitch', 'Change Language')}
            >
              <Globe size={18} className="shrink-0" />
              <span>{i18n.language.startsWith('de') ? t('header.langDE', 'Deutsch') : t('header.langEN', 'English')}</span>
            </button>

            <button 
              className="lg:hidden p-1.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label={t('header.openMenu', 'Open menu')}
            >
              <Menu size={24} className="shrink-0" />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile & Tablet Overlay Menü */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <span className="font-heading font-bold text-lg text-slate-800">{t('menu.title', 'Menü')}</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-xl transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col p-4 gap-2 flex-1 overflow-y-auto">
              <div className="space-y-1 mb-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2 block">
                  {t('menu.nav', 'Navigation')}
                </span>
                {navItems.map((item, idx) => (
                  <button 
                    key={idx}
                    onClick={item.onClick}
                    className="flex items-center w-full px-3 py-3 text-left font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-slate-400">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.soon && (
                      <span className="text-[9px] uppercase tracking-wider font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-md shrink-0">
                        {t('nav.soon', 'Bald')}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="space-y-1 mt-auto border-t border-slate-100 pt-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2 block">
                  {t('menu.settings', 'Einstellungen')}
                </span>
                <button 
                  onClick={() => { toggleLanguage(); setIsMobileMenuOpen(false); }}
                  className="flex items-center justify-between w-full px-3 py-3 text-left font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Globe size={18} className="text-slate-400" />
                    <span>{t('menu.lang', 'Sprache')}</span>
                  </div>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-bold text-slate-500">
                    {i18n.language.startsWith('de') ? 'English 🗺️' : 'Deutsch 🥔'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}