import { Map } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import mapSvgUrl from './content/VerbundsKarte.svg';

export default function DogRulesMap() {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2.5">
        <Map size={18} className="text-slate-500" />
        <h3 className="font-semibold text-slate-700 text-sm">{t('landing.map.title')}</h3>
      </div>
      
      {/* SVG Wrapper */}
      <div className="w-full relative bg-slate-50/50 p-6 flex justify-center items-center">
        <img 
          src={mapSvgUrl} 
          alt="Map of German transport networks" 
          className="w-full max-w-lg h-auto drop-shadow-sm"
          loading="lazy"
        />
      </div>

      {/* Legende */}
      <div className="px-5 py-4 bg-white border-t border-slate-100">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          {t('landing.map.legendTitle')}
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#A38DF5] border border-slate-200 shadow-sm" />
            <span dangerouslySetInnerHTML={{ __html: t('landing.map.free') }} />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#F9C26B] border border-slate-200 shadow-sm" />
            <span dangerouslySetInnerHTML={{ __html: t('landing.map.ticket') }} />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#94CDDF] border border-slate-200 shadow-sm" />
            <span dangerouslySetInnerHTML={{ __html: t('landing.map.dticket') }} />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-white border border-slate-300 shadow-sm" />
            <span>{t('landing.map.noVerbund')}</span>
          </div>
        </div>
      </div>

      {/* Footer Area */}
      <div className="p-4 text-[11px] text-slate-400 bg-slate-50 border-t border-slate-100 text-center leading-relaxed">
        {t('landing.map.attribution')}
      </div>
    </div>
  );
}