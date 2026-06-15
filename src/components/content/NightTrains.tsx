import { MoonStar, Map, Dog } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import InfoCard from './InfoCard';
import CardOverview from './CardOverview';
import TableOfContents from './TableOfContents';

export default function NightTrains() {
  const { t } = useTranslation();

  const tocItems = [
    { id: 'cabins', highlight: false, label: t('contentPages.nightTrains.q1'), icon: <MoonStar size={16}/> },
    { id: 'overview', highlight: false, label: t('contentPages.nightTrains.tableTitle'), icon: <Dog size={16}/> },
/*  { id: 'potty', label: t('contentPages.nightTrains.q2'), icon: <AlertTriangle size={16}/> },
    { id: 'tickets', label: t('contentPages.nightTrains.q3'), icon: <Ticket size={16}/> }, */
    { id: 'map', highlight: false, label: t('contentPages.nightTrains.mapTitle'), icon: <Map size={16}/> },
  ];

  const cardFields = [
    { key: 'operator', label: t('contentPages.nightTrains.columns.operator') },
    { key: 'countries', label: t('contentPages.nightTrains.columns.countries') },
    { key: 'info', label: t('contentPages.nightTrains.columns.info') },
    { key: 'price', label: t('contentPages.nightTrains.columns.price') },
  ];

    // 1. Daten holen und IDs vergeben
  const rawCards = t('contentPages.nightTrains.rows', { returnObjects: true }) as any[];
  const cardsData = rawCards.map((card, index) => ({
    id: `dest-${index}`, // Diese ID referenzieren wir gleich im TOC
    ...card
  }));

  return (
    <div className="max-w-4xl mx-auto md:px-4 md:py-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 font-heading mb-2">{t('contentPages.nightTrains.title')}</h1>
        <p className="text-slate-600 text-lg">{t('contentPages.nightTrains.subtitle')}</p>
      </div>

      <TableOfContents items={tocItems} />

      <div className="space-y-6">
        <div id="cabins"><InfoCard icon={<MoonStar className="text-primary" />} title={t('contentPages.nightTrains.q1')} text={t('contentPages.nightTrains.a1')} /></div>
        
        <div id="overview" className="bg-white rounded-3xl p-5 sm:p-6 mt-6 scroll-mt-24">
          <h3 className="text-lg font-bold text-slate-800 mb-2">{t('contentPages.nightTrains.tableTitle')}</h3>
          <p className="text-sm text-slate-600 mb-4">{t('contentPages.nightTrains.romaniaNote')}</p>
          <CardOverview cardFields={cardFields} data={cardsData} colorClass='primary'/>
        </div>

    {/*     <div id="potty"><InfoCard icon={<AlertTriangle className="text-amber-500" />} title={t('contentPages.nightTrains.q2')} text={t('contentPages.nightTrains.a2')} /></div>
        <div id="tickets"><InfoCard icon={<Ticket className="text-primary" />} title={t('contentPages.nightTrains.q3')} text={t('contentPages.nightTrains.a3')} /></div>
 */}        
        <div id="map" className="bg-white rounded-3xl p-5 sm:p-6 mt-6 scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-xl shrink-0"><Map className="text-primary" /></div>
            <h3 className="text-lg font-bold text-slate-800">{t('contentPages.nightTrains.mapTitle')}</h3>
          </div>
          <p className="text-slate-600 mb-4 ml-[52px]">{t('contentPages.nightTrains.mapDesc')}</p>
          <iframe 
            src="https://back-on-track.eu/night-train-map/" 
            className="w-full aspect-[4/5] md:aspect-[4/5] rounded-xl"
            title="European Night Train Map"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}