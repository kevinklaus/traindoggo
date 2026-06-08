import { PawPrint, ChevronDown, Route } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export interface TableColumn {
  key: string;
  label: string;
}

export interface TableRow {
  id: string;
  highlight?: boolean;
  image?: string; 
  [key: string]: any;
}

interface Props {
  columns: TableColumn[];
  data: TableRow[];
}

// 1. NEU: Eine eigene, butterweich animierte Accordion-Komponente
const MobileAccordion = ({ label, content }: { label: string; content: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden border border-primary/60 bg-white/60 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-3 font-semibold text-[13px] text-primary cursor-pointer select-none"
      >
        <Route size={16} className="text-primary" />
        <span className="text-sm text-primary">{label}</span>
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-300 text-primary ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      {/* Der Grid-Trick: Animiert sanft von 0 Höhe auf volle Inhalts-Höhe */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-3 pt-0 text-[14px] leading-relaxed whitespace-pre-wrap">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TableOverview({ columns, data }: Props) {
  const { t } = useTranslation();

  if (!columns || columns.length === 0) return null;

  const mainCol = columns[0];
  const restCols = columns.slice(1);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5 mb-6">
      {data.map(row => (
        <div 
          key={row.id} 
          id={row.id} 
          className={`flex flex-col ${row.highlight ? 'bg-highlight/30' : 'bg-highlight/15'} rounded-2xl transition-all overflow-hidden relative scroll-mt-24`}
        >
          {row.image && (
            <div className="w-full h-32 sm:h-40 bg-slate-100 overflow-hidden relative">
              <img src={row.image} alt={row[mainCol.key]} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-5 sm:p-6 flex flex-col flex-1">
            <h3 className={`text-xl font-bold text-slate-800 font-heading mb-3`}>
              {row[mainCol.key]}
            </h3>

            {row.highlight && (
              <div className=" relative right-1.5 inline-flex items-center gap-1.5 bg-white text-accent px-3 py-1.5 rounded-full text-[13px] font-bold w-fit mb-3">
                <PawPrint size={15} strokeWidth={2.5} className="fill-accent" />
                <span className="capitalize">{t('contentPages.tableRecommendation', 'Empfehlung mit Hund')}</span>
              </div>
            )}

            {/* WICHTIG: mt-auto entfernt, damit Text oben anschließt! */}
            <div className="flex flex-col gap-4">
              {restCols.map(col => {
                
                // 1. BESCHREIBUNG: Ohne das kleine graue Label rendern
                if (col.key === 'description') {
                  return (
                    <div key={col.key} className="flex flex-col">
                      <span className="text-[14.5px] text-slate-700 leading-relaxed">
                        {row[col.key]}
                      </span>
                    </div>
                  );
                }

                // 2. ANREISE-TIPP: Accordion (Mobile) vs. Offen (Desktop)
                if (col.key === 'travel') {
                  return (
                    <div key={col.key} className="mt-1">
                      
                      {/* Ansicht Mobile: Accordion */}
                      {/* 2. NEU: Einbindung unserer weichen MobileAccordion Komponente */}
                      <MobileAccordion label={col.label} content={row[col.key]} />
                      
                      {/* Ansicht Desktop: Immer offen */}
                      <div className="hidden md:flex gap-2 items-center mb-4">
                        <Route size={16} className="text-primary" />
                        <span className="text-sm font-bold text-primary">{col.label}</span>
                      </div>
                      <div className="hidden md:block">
                         <div className="text-[14.5px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {row[col.key]}
                         </div>
                      </div>

                    </div>
                  );
                }

                // Fallback für alle anderen Spalten
                return (
                  <div key={col.key} className="flex flex-col gap-0.5 mt-2">
                    <span className="text-[13px] font-medium text-slate-500 capitalize">
                      {col.label}
                    </span>
                    <span className="text-[14.5px] text-slate-700 leading-snug whitespace-pre-wrap">
                      {row[col.key]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}