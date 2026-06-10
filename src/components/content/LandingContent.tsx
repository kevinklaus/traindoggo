import { Search, Route, PawPrint } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SearchForm from '../JourneySearch/SearchForm';
import RecommendedDays from '../JourneySearch/RecommendedDays';
import JourneyResults from '../JourneySearch/JourneyResults';
import HeroImage from '../layout/HeroImage'; // <-- 1. IMPORTIEREN
import type { SearchParams, Journey } from '../../lib/types';
import HeroImg from './images/hero.jpg';

interface Props { /* ... (deine Props bleiben unverändert) ... */
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
  params, setParams, handleSearch, handleDayChange, loading, error, searched, journeys
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in">
      
      {/* 2. NEUE KOMPONENTE NUTZEN */}
      <HeroImage 
        src={HeroImg} 
        alt="Hund reist im Zug" 
        title={t('landing.heroTitle')} 
        subtitle={t('landing.heroSubtitle')}
        imagePositionClass="object-[center_65%] sm:object-[center_60%] md:object-[center_51%]"
      />

      {/* Floating Search Form */}
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
        <div className="max-w-4xl px-4 sm:px-0 space-y-8 mt-12 w-full animate-in fade-in slide-in-from-bottom-4 pb-24">
          {/* How it works (3 Steps) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8">
            <div className="flex justify-center mb-2">
              <PawPrint size={24} strokeWidth={2} className="fill-accent text-accent" />
            </div>
            <h2 className="text-xl text-slate-800 font-body text-center mb-12">
              {t('landing.howItWorks.title')} 
            </h2>
            
            <div className="grid sm:grid-cols-3 gap-8 sm:gap-6 relative">
              {/* Verbindende Linie im Hintergrund (nur Desktop) */}
              <div className="hidden sm:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-highlight/20 z-0" />
              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-3xl bg-highlight flex items-center justify-center text-white mb-2">
                  <Search size={22} strokeWidth={2.5} />
                </div>
                <h3 className="font-bold text-slate-800">{t('landing.howItWorks.step1.title')}</h3>
                <p className="text-sm text-slate-600 leading-relaxed max-w-[250px]">
                  {t('landing.howItWorks.step1.text')}
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-3xl bg-highlight flex items-center justify-center text-white mb-2">
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
                <div className="w-12 h-12 rounded-3xl bg-highlight flex items-center justify-center text-white mb-2">
                  <PawPrint size={22} strokeWidth={2} className="fill-white" />
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