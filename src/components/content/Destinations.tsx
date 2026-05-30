import { MapPin, Train, Palmtree } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { InfoCard } from './DoggoTips';

export default function Destinations() {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 font-heading mb-2">{t('contentPages.destinations.title')}</h1>
        <p className="text-slate-600 text-lg">{t('contentPages.destinations.subtitle')}</p>
      </div>

      <div className="space-y-6">
        <InfoCard icon={<MapPin className="text-primary" />} title={t('contentPages.destinations.q1')} text={t('contentPages.destinations.a1')} />
        <InfoCard icon={<Train className="text-primary" />} title={t('contentPages.destinations.q2')} text={t('contentPages.destinations.a2')} />
        <InfoCard icon={<Palmtree className="text-primary" />} title={t('contentPages.destinations.q3')} text={t('contentPages.destinations.a3')} />
      </div>
    </div>
  );
}