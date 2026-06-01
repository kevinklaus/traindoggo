import { MapPin, Train, Palmtree, Map, Instagram } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import InfoCard from '../layout/InfoCard';
import TableOfContents from '../ui/TableOfContents';

export default function Destinations() {
  const { t } = useTranslation();

  const tocItems = [
    { id: 'viaduct-map', label: t('contentPages.destinations.mapTitle'), icon: <Map size={16}/> },
    // { id: 'austria', label: t('contentPages.destinations.q1'), icon: <MapPin size={16}/> },
    // { id: 'switzerland', label: t('contentPages.destinations.q2'), icon: <Train size={16}/> },
    // { id: 'coasts', label: t('contentPages.destinations.q3'), icon: <Palmtree size={16}/> },
    { id: 'instagram', label: t('contentPages.destinations.igTitle', 'Instagram'), icon: <Instagram size={16}/> },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 font-heading mb-2">{t('contentPages.destinations.title')}</h1>
        <p className="text-slate-600 text-lg">{t('contentPages.destinations.subtitle')}</p>
      </div>

      <TableOfContents items={tocItems} />

      <div className="space-y-6">
        
        {/* Nativer Viaduct Embed */}
        <div id="viaduct-map" className="bg-white rounded-3xl p-5 sm:p-6 mb-6 scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-xl shrink-0"><Map className="text-primary" /></div>
            <h3 className="text-lg font-bold text-slate-800">{t('contentPages.destinations.mapTitle')}</h3>
          </div>
          <p className="text-slate-600 mb-6 ml-[52px]">{t('contentPages.destinations.mapDesc')}</p>
          
          <iframe 
            src="https://embed.viaduct.world/j/1RIUeX2YeI5CzSbc?layer=Topo&tabs=map" 
            className="w-full h-[500px] sm:h-[600px] rounded-xl border border-slate-200"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Personal Trip Map"
          />
        </div>

        {/* <div id="austria"><InfoCard icon={<MapPin className="text-primary" />} title={t('contentPages.destinations.q1')} text={t('contentPages.destinations.a1')} /></div>
        <div id="switzerland"><InfoCard icon={<Train className="text-primary" />} title={t('contentPages.destinations.q2')} text={t('contentPages.destinations.a2')} /></div>
        <div id="coasts"><InfoCard icon={<Palmtree className="text-primary" />} title={t('contentPages.destinations.q3')} text={t('contentPages.destinations.a3')} /></div> */}

        {/* Instagram Modul mit direktem Button */}
        <div id="instagram" className="bg-white rounded-3xl p-5 sm:p-6 mt-6 scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-pink-50 text-pink-600 rounded-xl shrink-0"><Instagram size={20} /></div>
            <h3 className="text-lg font-bold text-slate-800">
              {t('contentPages.destinations.igTitle', 'Impressionen auf Instagram')}
            </h3>
          </div>
          <p className="text-slate-600 mb-6 ml-[52px]">
            {t('contentPages.destinations.igDesc', 'Folge @traindoggo für aktuelle Reiseeindrücke und kleine Ausflüge von uns.')}
          </p>

          <div className="ml-[52px]">
            <a 
              href="https://www.instagram.com/traindoggo" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white px-5 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-sm"
            >
              <Instagram size={20} />
              <span className="capitalize">Zu Instagram @traindoggo</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}