import DogRulesMap from '../DogRulesMap';
import { HelpCircle, MapPin, Compass, Search, Route, PawPrint } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function LandingContent() {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 mt-8 animate-fade-in w-full">
      
      {/* NEU: How it works (3 Steps) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-800 font-heading text-center mb-8">
          {t('landing.howItWorks.title')}
        </h2>
        
        <div className="grid sm:grid-cols-3 gap-8 sm:gap-6 relative">
          {/* Verbindende Linie im Hintergrund (nur Desktop) */}
          <div className="hidden sm:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-slate-100 z-0" />

          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-primary shadow-md shadow-primary/20 flex items-center justify-center text-white mb-2">
              <Search size={22} strokeWidth={2.5} />
            </div>
            <h3 className="font-bold text-slate-800">{t('landing.howItWorks.step1.title')}</h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-[250px]">
              {t('landing.howItWorks.step1.text')}
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-primary shadow-md shadow-primary/20 flex items-center justify-center text-white mb-2">
              <Route size={22} strokeWidth={2.5} />
            </div>
            <h3 className="font-bold text-slate-800">{t('landing.howItWorks.step2.title')}</h3>
            <p 
              className="text-sm text-slate-600 leading-relaxed max-w-[250px]"
              dangerouslySetInnerHTML={{ __html: t('landing.howItWorks.step2.text') }} 
            />
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-primary shadow-md shadow-primary/20 flex items-center justify-center text-white mb-2">
              <PawPrint size={22} strokeWidth={2.5} />
            </div>
            <h3 className="font-bold text-slate-800">{t('landing.howItWorks.step3.title')}</h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-[250px]">
              {t('landing.howItWorks.step3.text')}
            </p>
          </div>
        </div>
      </div>

      {/* Ticket Regeln (Nach unten gerutscht) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-green-50 text-green-600 rounded-xl">
            <HelpCircle size={24} strokeWidth={2} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 font-heading">{t('landing.title')}</h2>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-8 text-sm text-slate-600 leading-relaxed">
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-base">
              <Compass size={18} className="text-primary" /> {t('landing.fernverkehr.title')}
            </h3>
            <ul className="space-y-2 list-disc pl-5 marker:text-primary">
              <li dangerouslySetInnerHTML={{ __html: t('landing.fernverkehr.bullet1') }} />
              <li dangerouslySetInnerHTML={{ __html: t('landing.fernverkehr.bullet2') }} />
              <li dangerouslySetInnerHTML={{ __html: t('landing.fernverkehr.bullet3') }} />
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-base">
              <MapPin size={18} className="text-primary" /> {t('landing.nahverkehr.title')}
            </h3>
            <p>{t('landing.nahverkehr.text1')}</p>
            <p dangerouslySetInnerHTML={{ __html: t('landing.nahverkehr.text2') }} />
          </div>
        </div>
      </div>

      <DogRulesMap />
    </div>
  );
}