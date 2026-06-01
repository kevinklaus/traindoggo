import { PawPrint } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface TableColumn {
  key: string;
  label: string;
}

export interface TableRow {
  id: string;
  highlight?: boolean;
  image?: string; // Option für Bilder (einfach in der Datenquelle ergänzen)
  [key: string]: any;
}

interface Props {
  columns: TableColumn[];
  data: TableRow[];
}

export default function TableOverview({ columns, data }: Props) {
  const { t } = useTranslation();

  if (!columns || columns.length === 0) return null;

  // Wir nutzen die erste Spalte (z.B. Land/Betreiber) dynamisch als Titel für die Card
  const mainCol = columns[0];
  const restCols = columns.slice(1);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5 mt-2 mb-6">
      {data.map(row => (
        <div 
          key={row.id} 
          className={`flex flex-col ${row.highlight ? 'bg-accent/15' : 'bg-accent/5'}  rounded-2xl transition-all overflow-hidden relative`}
        >
          {/* Optionales Bild (wird nur gerendert, wenn row.image vorhanden ist) */}
          {row.image && (
            <div className="w-full h-32 sm:h-40 bg-slate-100 overflow-hidden relative">
              <img src={row.image} alt={row[mainCol.key]} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-5 sm:p-6 flex flex-col flex-1">

            {/* Titel der Card (zieht sich automatisch die erste Spalte) */}
            <h3 className={`text-xl font-bold text-slate-800 font-heading mb-3`}>
              {row[mainCol.key]}
            </h3>

            {/* Empfehlungs-Badge */}
            {row.highlight && (
              <div className="inline-flex items-center gap-1.5 bg-white text-primary px-3 py-1.5 rounded-xl text-[13px] font-bold w-fit">
                <PawPrint size={15} strokeWidth={2.5} className="fill-primary" />
                <span className="capitalize">{t('contentPages.tableRecommendation', 'Empfehlung mit Hund')}</span>
              </div>
            )}

            {/* Restliche Tabellen-Daten als Key-Value Paare im Body */}
            <div className={`flex flex-col gap-3.5 mt-auto ${row.image || row.highlight ? 'pt-3' : ''}`}>
              {restCols.map(col => (
                <div key={col.key} className="flex flex-col gap-0.5">
                  <span className="text-[13px] font-medium text-slate-500 capitalize">
                    {col.label}
                  </span>
                  <span className="text-[14.5px] text-slate-700 leading-snug">
                    {row[col.key]}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}