import { ShieldAlert, Clock, BaggageClaim, MapPin, Compass, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DogRulesMap from '../DogRulesMap';
import InfoCard from '../layout/InfoCard';


export default function DoggoTips() {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 font-heading mb-2">{t('contentPages.doggoTips.title')}</h1>
        <p className="text-slate-600 text-lg">{t('contentPages.doggoTips.subtitle')}</p>
      </div>

      <div className="space-y-6">
        <InfoCard icon={<ShieldAlert className="text-primary" />} title={t('contentPages.doggoTips.q1')} text={t('contentPages.doggoTips.a1')} />
        <InfoCard icon={<Clock className="text-primary" />} title={t('contentPages.doggoTips.q2')} text={t('contentPages.doggoTips.a2')} />
        <InfoCard icon={<BaggageClaim className="text-primary" />} title={t('contentPages.doggoTips.q3')} text={t('contentPages.doggoTips.a3')} />
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
    </div>
  );
}

