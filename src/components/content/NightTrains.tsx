import { MoonStar, Map, Dog } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import InfoCard from '../layout/InfoCard';
import TableOverview from '../ui/TableOverview';
import TableOfContents from '../ui/TableOfContents';

export default function NightTrains() {
  const { t } = useTranslation();

  const tocItems = [
    { id: 'cabins', label: t('contentPages.nightTrains.q1'), icon: <MoonStar size={16}/> },
    { id: 'overview', label: t('contentPages.nightTrains.tableTitle'), icon: <Dog size={16}/> },
/*  { id: 'potty', label: t('contentPages.nightTrains.q2'), icon: <AlertTriangle size={16}/> },
    { id: 'tickets', label: t('contentPages.nightTrains.q3'), icon: <Ticket size={16}/> }, */
    { id: 'map', label: t('contentPages.nightTrains.mapTitle'), icon: <Map size={16}/> },
  ];

  const tableColumns = [
    { key: 'operator', label: t('contentPages.nightTrains.columns.operator') },
    { key: 'countries', label: t('contentPages.nightTrains.columns.countries') },
    { key: 'cabin', label: t('contentPages.nightTrains.columns.cabin') },
    { key: 'seat', label: t('contentPages.nightTrains.columns.seat') },
    { key: 'price', label: t('contentPages.nightTrains.columns.price') },
  ];

  const tableData = [
    { id: '1', highlight: true, operator: t('contentPages.nightTrains.rows.oebb.operator'), countries: t('contentPages.nightTrains.rows.oebb.countries'), cabin: t('contentPages.nightTrains.rows.oebb.cab'), seat: t('contentPages.nightTrains.rows.oebb.seat'), price: t('contentPages.nightTrains.rows.oebb.price') },
    { id: '2', highlight: true, operator: t('contentPages.nightTrains.rows.cd.operator'), countries: t('contentPages.nightTrains.rows.cd.countries'), cabin: t('contentPages.nightTrains.rows.cd.cab'), seat: t('contentPages.nightTrains.rows.cd.seat'), price: t('contentPages.nightTrains.rows.cd.price') },
    { id: '3', highlight: true, operator: t('contentPages.nightTrains.rows.trenitalia.operator'), countries: t('contentPages.nightTrains.rows.trenitalia.countries'), cabin: t('contentPages.nightTrains.rows.trenitalia.cab'), seat: t('contentPages.nightTrains.rows.trenitalia.seat'), price: t('contentPages.nightTrains.rows.trenitalia.price') },
    { id: '4', highlight: true, operator: t('contentPages.nightTrains.rows.sncf.operator'), countries: t('contentPages.nightTrains.rows.sncf.countries'), cabin: t('contentPages.nightTrains.rows.sncf.cab'), seat: t('contentPages.nightTrains.rows.sncf.seat'), price: t('contentPages.nightTrains.rows.sncf.price') },
    { id: '5', operator: t('contentPages.nightTrains.rows.es.operator'), countries: t('contentPages.nightTrains.rows.es.countries'), cabin: t('contentPages.nightTrains.rows.es.cab'), seat: t('contentPages.nightTrains.rows.es.seat'), price: t('contentPages.nightTrains.rows.es.price') },
    { id: '6', operator: t('contentPages.nightTrains.rows.sj.operator'), countries: t('contentPages.nightTrains.rows.sj.countries'), cabin: t('contentPages.nightTrains.rows.sj.cab'), seat: t('contentPages.nightTrains.rows.sj.seat'), price: t('contentPages.nightTrains.rows.sj.price') },
    { id: '7', operator: t('contentPages.nightTrains.rows.cfr.operator'), countries: t('contentPages.nightTrains.rows.cfr.countries'), cabin: t('contentPages.nightTrains.rows.cfr.cab'), seat: t('contentPages.nightTrains.rows.cfr.seat'), price: t('contentPages.nightTrains.rows.cfr.price') },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4">
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
          <TableOverview columns={tableColumns} data={tableData} />
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