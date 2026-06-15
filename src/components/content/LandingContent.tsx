import { Search, Route, PawPrint, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SearchForm from '../JourneySearch/SearchForm';
import RecommendedDays from '../JourneySearch/RecommendedDays';
import JourneyResults from '../JourneySearch/JourneyResults';
import HeroImage from '../layout/HeroImage'; 
import CardOverview, { CardData } from './CardOverview';
import type { SearchParams, Journey } from '../../lib/types';
import HeroImg from './images/hero.jpg';

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
  params, setParams, handleSearch, handleDayChange, loading, error, searched, journeys
}: Props) {
  const { t } = useTranslation();

  // 1. i18n-ready CardData
  const exampleTrips: CardData[] = [
    {
      id: 'berlin-bozen',
      headline: t('landing.inspiration.trips.berlinBozen.headline', 'Berlin ➔ Bozen'),
      highlight: true,
      description: t('landing.inspiration.trips.berlinBozen.desc', 'Mit dem ICE direkt in die Alpen. Die Route bietet eine entspannte Durchquerung Süddeutschlands mit idealen Gassi-Spots in München.'),
      travel: t('landing.inspiration.trips.berlinBozen.travel', 'Gassi-Tipp: München Hbf hat einen kleinen Park nahe Gleis 11.'),
      actionPayload: { 
        from: { id: '8011160', name: 'Berlin Hbf', type: 'stop' }, 
        to: { id: '8300084', name: 'Bolzano/Bozen', type: 'stop' }, 
        minTransferTime: 45, 
        maxChanges: 1,       
        dogMode: 'large'
      }
    },
    {
      id: 'frankfurt-barcelona',
      highlight: true,
      headline: t('landing.inspiration.trips.frankfurtBarcelona.headline', 'Frankfurt ➔ Barcelona'),
      description: t('landing.inspiration.trips.frankfurtBarcelona.desc', 'High-Speed durch Frankreich mit dem TGV. Eine atemberaubende Fahrt entlang der Küste mit ausreichend Puffer in Paris.'),
      travel: t('landing.inspiration.trips.frankfurtBarcelona.travel', 'Achtung: In Paris ist meist ein Bahnhofswechsel (Gare de l\'Est zu Gare de Lyon) nötig. Die Metro erlaubt Hunde!'),
      actionPayload: { 
        from: { id: '8000105', name: 'Frankfurt(Main)Hbf', type: 'stop' }, 
        to: { id: '7100064', name: 'Barcelona Sants', type: 'stop' }, 
        time: '06:30', 
        minTransferTime: 90, 
        maxChanges: 1,
      }
    },
    {
      id: 'freiburg-sapri',
      highlight: true,
      headline: t('landing.inspiration.trips.freiburgSapri.headline', 'Freiburg ➔ Sapri'),
      description: t('landing.inspiration.trips.freiburgSapri.desc', 'Mit dem Nachtzug nach Bella Italia. Der Nightjet bringt euch entspannt in den Süden Neapels ans türkisblaue Meer.'),
      travel: t('landing.inspiration.trips.freiburgSapri.travel', 'Buchung: Im Nightjet muss ein eigenes Abteil gebucht werden, wenn ein großer Hund mitreist.'),
      actionPayload: { 
        from: { id: '8000107', name: 'Freiburg(Breisgau) Hbf', type: 'stop' }, 
        to: { id: '8300333', name: 'Sapri', type: 'stop' }, 
        time: '18:00', 
        minTransferTime: 45, 
        maxChanges: 1,
      }
    }
  ];

  // 2. i18n-ready Fields
  const exampleFields = [
    { key: 'headline', label: t('landing.inspiration.fields.route', 'Route') },
    { key: 'description', label: t('landing.inspiration.fields.description', 'Beschreibung') },
    { key: 'travel', label: t('landing.inspiration.fields.doggoInfo', 'Doggo Info') }
  ];

  const handleExampleSearch = (payload: Partial<SearchParams>) => {
    const searchConfig: SearchParams = {
      ...params,
      ...payload,
      date: params.date 
    };
    
    setParams(searchConfig);
    handleSearch(searchConfig);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in">
      
      <HeroImage 
        src={HeroImg} 
        alt="Hund reist im Zug" 
        title={t('landing.heroTitle')} 
        subtitle={t('landing.heroSubtitle')}
        imagePositionClass="object-[center_65%] sm:object-[center_60%] md:object-[center_51%]"
      />

      <section className="w-[92%] sm:w-[88%] md:w-[85%] max-w-xl bg-white rounded-3xl p-5 sm:p-6 md:p-8 relative z-10 -mt-12 sm:-mt-16 md:-mt-20 shadow-xl shadow-slate-200/40">
        <SearchForm 
          params={params} 
          onChange={setParams} 
          onSearch={() => handleSearch(params)} 
          loading={loading} 
        />
      </section>

      {searched ? (
        <div className="max-w-3xl mt-8 w-full animate-in fade-in slide-in-from-bottom-4">
          <RecommendedDays currentDateStr={params.date} onDateChange={handleDayChange} />
          <JourneyResults journeys={journeys} dogMode={params.dogMode} loading={loading} error={error} />
        </div>
      ) : (
        <div className="max-w-6xl px-4 sm:px-0 mt-16 w-full animate-in fade-in slide-in-from-bottom-4 pb-24 space-y-24">
          
          {/* Inspiration Section */}
          <section className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="flex justify-center mb-2">
                <Sparkles size={24} className="text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-800">
                {t('landing.inspiration.title', 'Inspiration für eure nächste Reise')}
              </h2>
              <p className="text-slate-600">
                {t('landing.inspiration.subtitle', 'Vorkonfigurierte Routen mit hundefreundlichen Umstiegszeiten und optimalen Verbindungen. Mit einem Klick direkt in die Suche übernehmen.')}
              </p>
            </div>
            
            <CardOverview 
              cardFields={exampleFields} 
              data={exampleTrips} 
              onAction={handleExampleSearch}
              actionLabel={t('landing.inspiration.searchRoute', 'Route suchen')}
              colorClass='primary'
            />
          </section>

          {/* How it works */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 max-w-4xl mx-auto">
            <div className="flex justify-center mb-2">
              <PawPrint size={24} strokeWidth={2} className="fill-accent text-accent" />
            </div>
            <h2 className="text-xl text-slate-800 font-body text-center mb-12 font-bold">
              {t('landing.howItWorks.title')} 
            </h2>
            
            <div className="grid sm:grid-cols-3 gap-8 sm:gap-6 relative">
              <div className="hidden sm:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-highlight/20 z-0" />
              
              <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-3xl bg-highlight flex items-center justify-center text-white mb-2 shadow-sm">
                  <Search size={22} strokeWidth={2.5} />
                </div>
                <h3 className="font-bold text-slate-800">{t('landing.howItWorks.step1.title')}</h3>
                <p className="text-sm text-slate-600 leading-relaxed max-w-[250px]">
                  {t('landing.howItWorks.step1.text')}
                </p>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-3xl bg-highlight flex items-center justify-center text-white mb-2 shadow-sm">
                  <Route size={22} strokeWidth={2.5} />
                </div>
                <h3 className="font-bold text-slate-800">{t('landing.howItWorks.step2.title')}</h3>
                <p 
                  className="text-sm text-slate-600 leading-relaxed max-w-[250px]"
                  dangerouslySetInnerHTML={{ __html: t('landing.howItWorks.step2.text') }} 
                />
              </div>

              <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-3xl bg-highlight flex items-center justify-center text-white mb-2 shadow-sm">
                  <PawPrint size={22} strokeWidth={2} className="fill-white" />
                </div>
                <h3 className="font-bold text-slate-800">{t('landing.howItWorks.step3.title')}</h3>
                <p className="text-sm text-slate-600 leading-relaxed max-w-[250px]">
                  {t('landing.howItWorks.step3.text')}
                </p>
              </div>
            </div>
          </section>

        </div>
      )}
    </div>
  );
}