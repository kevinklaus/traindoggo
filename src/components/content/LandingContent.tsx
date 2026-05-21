import DogRulesMap from '../DogRulesMap';
import { HelpCircle, MapPin, Compass } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function LandingContent() {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 mt-8 animate-fade-in w-full">
      {/* Zentrale Info Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-green-50 text-green-600 rounded-xl">
            <HelpCircle size={24} strokeWidth={2} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 font-heading">{t('landing.title')}</h2>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-8 text-sm text-slate-600 leading-relaxed">
          {/* Linke Spalte */}
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
          
          {/* Rechte Spalte */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-base">
              <MapPin size={18} className="text-primary" /> {t('landing.nahverkehr.title')}
            </h3>
            <p>{t('landing.nahverkehr.text1')}</p>
            <p dangerouslySetInnerHTML={{ __html: t('landing.nahverkehr.text2') }} />
          </div>
        </div>
      </div>

      {/* Integrierte Karte */}
      <DogRulesMap />
    </div>
  );
}