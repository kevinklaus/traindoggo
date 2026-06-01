import { Search, Route, PawPrint } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SearchForm from '../SearchForm';
import RecommendedDays from '../ui/RecommendedDays';
import JourneyResults from '../JourneyResults';
import type { SearchParams, Journey } from '../../lib/types';
import HeroImg from './hero.jpg';

interface Props {
  params: SearchParams;
  setParams: (p: SearchParams) => void;
  handleSearch: (p?: SearchParams) => void;
  handleDayChange: (d: string) => void;
  loading: boolean;
  error: string | null;
  searched: boolean;
  journeys: Journey[];
}

export default function LandingContent({
  params, 
  setParams, 
  handleSearch, 
  handleDayChange, 
  loading, 
  error, 
  searched, 
  journeys
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in">
      
      {/* 1. Hero Image Section */}
      <div className="relative w-full h-[260px] sm:h-[340px] md:h-[380px] lg:h-[460px] rounded-3xl overflow-hidden shadow-sm">
        <img 
          src={HeroImg} 
          alt="Hund reist im Zug" 
          className="absolute inset-0 w-full h-full object-cover object-[center_65%] sm:object-[center_60%] md:object-[center_51%]"
        />
        {/* Weicher Gradient, damit der Text immer gut lesbar bleibt */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-slate-900/5 to-transparent flex flex-col justify-end p-6 sm:p-10 pb-16 sm:pb-24 md:pb-28">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-2 leading-tight">
            {t('landing.heroTitle', 'Züge für dich & deinen Hund')}
          </h1>
          <p className="hidden sm:block text-white text-sm sm:text-base md:text-xl max-w-xl">
            {t('landing.heroSubtitle', 'Auf hundefreundlichen Bahnreisen Europa entdecken')}
          </p>
        </div>
      </div>

      {/* 2. Floating Search Form 
          Durch w-[92%] auf Mobile und w-[85%] auf Desktop wirkt das Hero-Bild dahinter viel präsenter.
          Der erhöhte negative Margin (-mt-20) verstärkt den Floating-Effekt auf großen Screens.
      */}
      <section className="w-[92%] sm:w-[88%] md:w-[85%] max-w-xl bg-white rounded-3xl p-5 sm:p-6 md:p-8 relative z-10 -mt-12 sm:-mt-16 md:-mt-20">
        <SearchForm 
          params={params} 
          onChange={setParams} 
          onSearch={() => handleSearch(params)} 
          loading={loading} 
        />
      </section>

      {/* 3. Dynamischer Content: Ergebnisse ODER "So funktioniert's" */}
      {searched ? (
        <div className="max-w-3xl mt-8 w-full animate-in fade-in slide-in-from-bottom-4">
          <RecommendedDays currentDateStr={params.date} onDateChange={handleDayChange} />
          <JourneyResults journeys={journeys} dogMode={params.dogMode} loading={loading} error={error} />
        </div>
      ) : (
        <div className="max-w-4xl space-y-8 mt-12 w-full animate-in fade-in slide-in-from-bottom-4 pb-24">
          {/* How it works (3 Steps) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-800 font-heading text-center mb-8">
              {t('landing.howItWorks.title')}
            </h2>
            
            <div className="grid sm:grid-cols-3 gap-8 sm:gap-6 relative">
              {/* Verbindende Linie im Hintergrund (nur Desktop) */}
              <div className="hidden sm:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-accent/20 z-0" />
              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-3xl bg-accent flex items-center justify-center text-white mb-2">
                  <Search size={22} strokeWidth={2} />
                </div>
                <h3 className="font-bold text-slate-800">{t('landing.howItWorks.step1.title')}</h3>
                <p className="text-sm text-slate-600 leading-relaxed max-w-[250px]">
                  {t('landing.howItWorks.step1.text')}
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-3xl bg-accent flex items-center justify-center text-white mb-2">
                  <Route size={22} strokeWidth={2} />
                </div>
                <h3 className="font-bold text-slate-800">{t('landing.howItWorks.step2.title')}</h3>
                <p 
                  className="text-sm text-slate-600 leading-relaxed max-w-[250px]"
                  dangerouslySetInnerHTML={{ __html: t('landing.howItWorks.step2.text') }} 
                />
              </div>

              {/* Step 3 */}
              <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-3xl bg-accent flex items-center justify-center text-white mb-2">
                  <PawPrint size={22} strokeWidth={2} />
                </div>
                <h3 className="font-bold text-slate-800">{t('landing.howItWorks.step3.title')}</h3>
                <p className="text-sm text-slate-600 leading-relaxed max-w-[250px]">
                  {t('landing.howItWorks.step3.text')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}