import { MoonStar, AlertTriangle, Ticket } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { InfoCard } from './DoggoTips';

export default function NightTrains() {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 font-heading mb-2">{t('contentPages.nightTrains.title')}</h1>
        <p className="text-slate-600 text-lg">{t('contentPages.nightTrains.subtitle')}</p>
      </div>

      <div className="space-y-6">
        <InfoCard icon={<MoonStar className="text-primary" />} title={t('contentPages.nightTrains.q1')} text={t('contentPages.nightTrains.a1')} />
        <InfoCard icon={<AlertTriangle className="text-amber-500" />} title={t('contentPages.nightTrains.q2')} text={t('contentPages.nightTrains.a2')} />
        <InfoCard icon={<Ticket className="text-primary" />} title={t('contentPages.nightTrains.q3')} text={t('contentPages.nightTrains.a3')} />
      </div>
    </div>
  );
}