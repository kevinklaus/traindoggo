import { Armchair, Sparkles, Route, Dog, PawPrint, Activity, TrainFront } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SearchForm from '../JourneySearch/SearchForm';
import CardOverview, { CardData } from './CardOverview';
import type { SearchParams } from '../../lib/types';
import HeroImg from './images/hero.jpg';
import type { Page } from '../../App'; 

interface Props {
  params: SearchParams;
  setParams: (p: SearchParams) => void;
  handleSearch: (p?: SearchParams) => void;
  onNavigate: (page: Page) => void;
}

const HeroFeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="flex items-center gap-3 sm:gap-5 bg-white rounded-3xl sm:rounded-full p-3 sm:p-5 sm:pr-10 sm:h-full">
    <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-accent/10 flex items-center justify-center text-accent">
      {icon}
    </div>
    <div className="">
      <h3 className="font-bold text-slate-900 text-lg sm:text-xl">{title}</h3>
      <p className="text-slate-500 text-sm sm:text-lg leading-snug mt-1">{desc}</p>
    </div>
  </div>
);

export default function LandingContent({ params, setParams, handleSearch, onNavigate }: Props) {
  const { t } = useTranslation();

  const heroFeaturesData = [
    {
      id: 'gassi',
      icon: <Dog size={26} strokeWidth={2} />,
      title: t('landing.hero.features.gassi.title', 'Sichere Gassi-Pausen'),
      desc: t('landing.hero.features.gassi.desc', 'Routen mit Zeit für eine Gassi-Runde')
    },
    {
      id: 'transfer',
      icon: <Route size={26} strokeWidth={2} />,
      title: t('landing.hero.features.transfer.title', 'Entspannte Umstiege'),
      desc: t('landing.hero.features.transfer.desc', 'Verlässliche und stressfreie Anschlüsse')
    },
    {
      id: 'space',
      icon: <Armchair size={26} strokeWidth={2} />,
      title: t('landing.hero.features.space.title', 'Genug Platz im Zug'),
      desc: t('landing.hero.features.space.desc', 'Sitzplätze unter die dein Hund passt')
    }
  ];

  const featureCards = heroFeaturesData.map(feat => (
    <HeroFeatureCard 
      key={feat.id}
      icon={feat.icon}
      title={feat.title}
      desc={feat.desc}
    />
  ));

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
    // HIER IST DIE NEUE CHUUCHUU KARTE
    {
      id: 'feat-chuuchuu',
      headline: t('landing.features.chuuchuu.title', 'Powered by chuuchuu'),
      description: (
        <span className="flex flex-col gap-4">
          <span>{t('landing.features.chuuchuu.text', 'Für unsere Empfehlungen und den Doggo Score nutzen wir die verlässlichen Echtzeit- und Verspätungsdaten von chuuchuu.')}</span>
          <a 
            href="https://chuuchuu.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 bg-white text-primary hover:bg-slate-200 rounded-xl transition-colors font-semibold w-fit"
          >
            <Activity size={18} className="text-primary" />
            ChuuChuu.com
          </a>
        </span>
      ),
    },
    {
      id: 'feat-destinations',
      headline: t('landing.features.destinations.title', 'Erprobte Reiseziele'),
      description: (
        <span className="flex flex-col gap-4">
          <span>{t('landing.features.destinations.text', 'Lass dich von unseren persönlichen Erfahrungen inspirieren – egal ob mit kleinem Begleiter oder einem 35kg-Hund, wir kennen die besten entspannten Routen.')}</span>
          <button 
            onClick={() => onNavigate('destinations')}
            className="flex items-center gap-2 px-3 py-2 bg-white text-primary hover:bg-slate-200 rounded-xl transition-colors font-semibold w-fit"
          >
            <TrainFront size={18} className="text-primary" />
            {t('nav.destinations', 'Reiseziele')}
          </button>
        </span>
      ),
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
    handleSearch(searchConfig); 
  };

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in pb-24">
      
      {/* HERO BEREICH */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-8 pt-4 md:pt-8 lg:pt-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Linke Seite: Content & Features */}
          <div className="lg:col-span-6 flex flex-col order-1 md:items-center lg:items-start w-full">
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-heading font-extrabold text-slate-900 tracking-tight md:text-center lg:text-left">
              <span className="text-primary">
                {t('landing.hero.title1', 'Mit Hund & Bahn ')}    
              </span>
              <span className="block mt-1 sm:mt-2">
                {t('landing.hero.title2', 'Europa entdecken...')}
              </span>
            </h1>

            <div className="hidden lg:grid auto-rows-fr gap-5 mt-16 w-fit">
              {featureCards}
            </div>
          </div>

          {/* Rechte Seite: Elevated Search Widget */}
          <div className="lg:col-span-6 order-2 w-full md:max-w-md md:mx-auto lg:max-w-none lg:mx-0 relative z-10">
            
            <div className="relative rounded-3xl shadow-[0_20px_80px_-15px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_80px_-10px_rgba(0,0,0,0.25)] transition-shadow duration-500">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl blur opacity-50 -z-10"></div>
              
              <div className="relative flex flex-col rounded-3xl overflow-hidden transform-gpu">
                <div className="w-full h-48 sm:h-56 relative shrink-0 bg-transparent">
                  <img 
                    src={HeroImg} 
                    alt={t('landing.hero.imageAlt', 'Hund schaut aus Zugfenster')} 
                    className="w-full h-full object-cover object-[center_60%] scale-[1.02] origin-center"
                  />
                </div>

                <div className="p-5 sm:p-7 bg-white relative z-10 -mt-6 rounded-t-3xl">
                  <SearchForm params={params} onChange={setParams} onSearch={() => handleSearch(params)} loading={false} />
                </div>
              </div>
            </div>
          </div>

          {/* Die Feature-Karten (Mobile) */}
          <div className="lg:hidden mt-10 order-3 text-center w-full flex flex-col items-center">
            <div className="flex justify-center ">
              <PawPrint size={28} className="text-accent fill-accent" />
            </div>
            <h2 className="text-2xl mt-3 sm:text-3xl font-heading font-bold text-slate-800">
                {t('landing.hero.mobFeatTitle', 'Reisen mit Train Doggo')}
            </h2>
          </div>
          <div className="lg:hidden flex flex-col gap-4 order-4 mt-0 w-full md:max-w-md md:mx-auto">
            {featureCards}
          </div>

        </div>
      </div>

      {/* Inspiration Section */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 mt-16 space-y-20">
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="flex justify-center mb-2">
              <Sparkles size={32} className="text-accent fill-accent" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-800">
              {t('landing.inspiration.title', 'Inspiration für eure nächste Reise')}
            </h2>
            <p className="text-slate-600 text-lg">
              {t('landing.inspiration.subtitle', 'Hundefreundliche Bahn-Verbindungen an die schönsten Reiseziele')}
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
            <p className="text-slate-600 text-lg">
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