import { useState } from 'react';
import { Edit2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { SearchParams } from '../../lib/types';
import { formatDate } from '../../lib/helpers';
import SearchForm from './SearchForm';

interface Props {
  params: SearchParams;
  onUpdateParams: (newParams: SearchParams) => void;
  onTriggerSearch: () => void;
}

export default function CondensedSearchBar({ params, onUpdateParams, onTriggerSearch }: Props) {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = () => {
    setIsModalOpen(false);
    onTriggerSearch();
  };

  return (
    <>
      {/* Floating Bar - Dunkel und abgerundet wie im DB Screenshot */}
      <div className="mx-auto w-full max-w-4xl">
        <div className="bg-slate-800 text-white shadow-2xl shadow-slate-900/20 rounded-full px-5 py-3 sm:px-8 flex items-center justify-between gap-4 transition-all">
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-sm sm:text-base font-bold truncate">
              <span className="truncate">{params.from?.name || '?'}</span>
              <span className="text-slate-400 shrink-0">→</span>
              <span className="truncate">{params.to?.name || '?'}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-slate-300 mt-1 flex-wrap">
              <span>{formatDate(params.date)}</span>
              <span>&bull;</span>
              <span>{params.time} {t('time', 'Uhr')}</span>
              {/* <span className="capitalize">{t(`searchForm.dogModes.${params.dogMode}`)}</span> */}
            </div>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="shrink-0 bg-white/10 hover:bg-white/20 text-white rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <span className="hidden sm:inline">{t('searchForm.edit', 'Anfrage ändern')}</span>
            <Edit2 size={16} />
          </button>
        </div>
      </div>

      {/* Fullscreen/Centered Modal für die SearchForm */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-slate-50 rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 rounded-t-3xl">
              <h2 className="text-lg font-bold text-slate-800">{t('searchForm.edit', 'Anfrage ändern')}</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                aria-label={t('composition.ui.closeModal', 'Schließen')}
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 sm:p-6">
              {/* Wir nutzen 1:1 dein bestehendes Suchformular! DRY pur. */}
              <SearchForm 
                params={params} 
                onChange={onUpdateParams} 
                onSearch={handleSearch} 
                loading={false}
                isAdvancedOpenDefault={true}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}