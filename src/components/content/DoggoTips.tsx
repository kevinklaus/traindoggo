import { Map, Dog, AlertCircle, TrainFront, TrainTrack, Ticket } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DogRulesMap from '../DogRulesMap';
// import InfoCard from '../layout/InfoCard';
import TableOverview from '../ui/TableOverview';
import TableOfContents from '../ui/TableOfContents';

export default function DoggoTips() {
  const { t } = useTranslation();

  const tocItems = [
    // { id: 'rules', label: t('contentPages.doggoTips.q1'), icon: <ShieldAlert size={16}/> },
    // { id: 'breaks', label: t('contentPages.doggoTips.q2'), icon: <Clock size={16}/> },
    // { id: 'packing', label: t('contentPages.doggoTips.q3'), icon: <BaggageClaim size={16}/> },
    { id: 'germany', label: t('landing.title'), icon: <Dog size={16}/> },
    { id: 'prices', label: t('contentPages.doggoTips.tableTitle'), icon: <Ticket size={16}/> },
    { id: 'dogrulesmap', label: t('landing.map.title'), icon: <Map size={16}/> },
  ];

  const tableColumns = [
    { key: 'country', label: t('contentPages.doggoTips.columns.country') },
    { key: 'price', label: t('contentPages.doggoTips.columns.price') },
    { key: 'comment', label: t('contentPages.doggoTips.columns.comment') },
  ];

  const tableData = [
    { id: '1', highlight: true, country: t('contentPages.doggoTips.rows.trenitalia.country'), price: t('contentPages.doggoTips.rows.trenitalia.price'), comment: t('contentPages.doggoTips.rows.trenitalia.comment') },
    { id: '2', highlight: true, country: t('contentPages.doggoTips.rows.sncf.country'), price: t('contentPages.doggoTips.rows.sncf.price'), comment: t('contentPages.doggoTips.rows.sncf.comment') },
    { id: '3', country: t('contentPages.doggoTips.rows.db.country'), price: t('contentPages.doggoTips.rows.db.price'), comment: t('contentPages.doggoTips.rows.db.comment') },
    { id: '4', country: t('contentPages.doggoTips.rows.oebb.country'), price: t('contentPages.doggoTips.rows.oebb.price'), comment: t('contentPages.doggoTips.rows.oebb.comment') },
    { id: '5', country: t('contentPages.doggoTips.rows.renfe.country'), price: t('contentPages.doggoTips.rows.renfe.price'), comment: (
        <span className="flex items-start gap-1.5 text-red-600 font-medium">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          {t('contentPages.doggoTips.rows.renfe.comment')}
        </span>
      ) 
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 font-heading mb-2">{t('contentPages.doggoTips.title')}</h1>
        <p className="text-slate-600 text-lg">{t('contentPages.doggoTips.subtitle')}</p>
      </div>

      <TableOfContents items={tocItems} />

      <div className="space-y-6">
        {/* <div id="rules"><InfoCard icon={<ShieldAlert className="text-primary" />} title={t('contentPages.doggoTips.q1')} text={t('contentPages.doggoTips.a1')} /></div> */}
        {/* <div id="breaks"><InfoCard icon={<Clock className="text-primary" />} title={t('contentPages.doggoTips.q2')} text={t('contentPages.doggoTips.a2')} /></div> */}
        {/* <div id="packing"><InfoCard icon={<BaggageClaim className="text-primary" />} title={t('contentPages.doggoTips.q3')} text={t('contentPages.doggoTips.a3')} /></div> */}
        
        <div id="germany" className="bg-white rounded-3xl p-6 sm:p-8 scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-green-50 text-green-600 rounded-xl">
              <Dog size={24} strokeWidth={2} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 font-heading">{t('landing.title')}</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-8 text-sm text-slate-600 leading-relaxed">
            <div className="space-y-3">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-base">
                <TrainFront size={18} className="text-primary" /> {t('landing.fernverkehr.title')}
              </h3>
              <ul className="space-y-2 list-disc pl-5 marker:text-primary">
                <li dangerouslySetInnerHTML={{ __html: t('landing.fernverkehr.bullet1') }} />
                <li dangerouslySetInnerHTML={{ __html: t('landing.fernverkehr.bullet2') }} />
                <li dangerouslySetInnerHTML={{ __html: t('landing.fernverkehr.bullet3') }} />
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-base">
                <TrainTrack size={18} className="text-primary" /> {t('landing.nahverkehr.title')}
              </h3>
              <p>{t('landing.nahverkehr.text1')}</p>
              <p dangerouslySetInnerHTML={{ __html: t('landing.nahverkehr.text2') }} />
            </div>
          </div>
        </div>

        <div id="prices" className="bg-white rounded-3xl p-5 sm:p-6 mt-6 scroll-mt-24">
          <h3 className="text-lg font-bold text-slate-800 mb-4">{t('contentPages.doggoTips.tableTitle')}</h3>
          <TableOverview columns={tableColumns} data={tableData} />
        </div>

        <div id="dogrulesmap">
            <DogRulesMap/>
        </div>
      </div>
    </div>
  );
}