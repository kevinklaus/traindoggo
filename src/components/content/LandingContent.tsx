import { PawPrint, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SearchForm from '../JourneySearch/SearchForm';
import HeroImage from '../layout/HeroImage'; 
import CardOverview, { CardData } from './CardOverview';
import type { SearchParams } from '../../lib/types';
import HeroImg from './images/hero.jpg';
import { TrainSpinner } from '../ui/TrainSpinner';

interface Props {
  params: SearchParams;
  setParams: (p: SearchParams) => void;
  handleSearch: (p?: SearchParams) => void;
}

export default function LandingContent({ params, setParams, handleSearch }: Props) {
  const { t } = useTranslation();

  // --- 1. DATEN FÜR INSPIRATIONEN (3-Spaltig) ---
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
      },
      imageId: 'suedtirol'
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
      },
      imageId: 'montblanc'
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
        time: '10:00', 
        minTransferTime: 180, 
        maxChanges: 1,
      },
      imageId: 'sapri'
    }
  ];

  const exampleFields = [
    { key: 'headline', label: t('landing.inspiration.fields.route', 'Route') },
    { key: 'description', label: t('landing.inspiration.fields.description', 'Beschreibung') },
    { key: 'travel', label: t('landing.inspiration.fields.doggoInfo', 'Doggo Info') }
  ];

  // --- 2. DATEN FÜR FEATURES (2x2 Grid) ---
  const featureFields = [
    { key: 'headline', label: '' },
    { key: 'description', label: '' }
  ];

  const featuresData: CardData[] = [
    {
      id: 'feat-score',
      headline: t('landing.features.score.title', 'Der Doggo Score'),
      description: t('landing.features.score.text', 'Wir bewerten Routen nach Umstiegsstress, Gassi-Puffern, Zugauslastung und Pinkel-Limits. So siehst du sofort, wie hundefreundlich eine Fahrt wirklich ist.'),
    },
    {
      id: 'feat-layouts',
      headline: t('landing.features.layouts.title', 'Europaweite Sitzpläne'),
      description: t('landing.features.layouts.text', 'Kein Raten mehr beim Buchen. Mit detaillierten Wagenreihungen für Fernverkehrszüge in ganz Europa findest du den Platz mit der meisten Bodenfläche.'),
    },
    {
      id: 'feat-destinations',
      headline: t('landing.features.destinations.title', 'Erprobte Reiseziele'),
      description: t('landing.features.destinations.text', 'Lass dich von unseren persönlichen Erfahrungen inspirieren – egal ob mit kleinem Begleiter oder einem 35kg-Hund, wir kennen die besten entspannten Routen.'),
    },
    {
      id: 'feat-community',
      headline: t('landing.features.community.title', 'Community & Hilfe'),
      description: (
        <span className="flex flex-col gap-3">
          <span>{t('landing.features.community.text', 'Unsicher bei einer Strecke oder den Tarif-Regeln in einem bestimmten Land? Frag uns einfach!')}</span>
          <a 
            href="mailto:hi.traindoggo@gmail.com" 
            className="text-primary hover:text-accent transition-colors font-bold w-fit"
          >
            hi.traindoggo@gmail.com
          </a>
        </span>
      ),
    }
  ];

  const handleExampleSearch = (payload: Partial<SearchParams>) => {
    const searchConfig: SearchParams = { ...params, ...payload, date: params.date };
    setParams(searchConfig);
    handleSearch(searchConfig); // Feuert den Seitenwechsel in App.tsx ab
  };

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in pb-24">
      <HeroImage 
        src={HeroImg} 
        alt="Hund reist im Zug" 
        title={t('landing.heroTitle')} 
        subtitle={t('landing.heroSubtitle')}
        imagePositionClass="object-[center_75%] sm:object-[center_60%] md:object-[center_51%]"
      />

      <section className="w-[92%] sm:w-[88%] md:w-[85%] max-w-xl bg-white rounded-3xl p-5 sm:p-6 md:p-8 relative z-10 -mt-12 sm:-mt-16 md:-mt-20 shadow-xl shadow-slate-200/40">
        {/* Ladezustand ist immer false, da die Suche hier nur weiterleitet */}
        <SearchForm params={params} onChange={setParams} onSearch={() => handleSearch(params)} loading={false} />
          
      </section>

      <div className="max-w-6xl px-4 sm:px-0 mt-16 w-full space-y-24">
        {/* Inspiration Section */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <TrainSpinner/>
            <div className="flex justify-center mb-2">
              <Sparkles size={32} className="text-accent fill-accent" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-800">
              {t('landing.inspiration.title', 'Inspiration für eure nächste Reise')}
            </h2>
            <p className="text-slate-600">
              {t('landing.inspiration.subtitle')}
            </p>
          </div>
          
          <CardOverview 
            cardFields={exampleFields} 
            data={exampleTrips} 
            onAction={handleExampleSearch}
            actionLabel={t('landing.inspiration.searchRoute', 'Route suchen')}
            colorClass='white'
          />
        </section>

        {/* Features / Why Train Doggo Section */}
        <section className="space-y-8 max-w-4xl mx-auto w-full">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="flex justify-center mb-2">
              <PawPrint size={32} className="text-accent fill-accent" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-800">
              {t('landing.features.title')}
            </h2>
            <p className="text-slate-600">
              {t('landing.features.subtitle')}
            </p>
          </div>
          
          <CardOverview 
            cardFields={featureFields} 
            data={featuresData} 
            colorClass="secondary"
            gridClass="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6" 
          />
        </section>
      </div>
    </div>
  );
}