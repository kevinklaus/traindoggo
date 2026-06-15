import { PawPrint, ChevronDown, Dog, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export interface cardField {
  key: string;
  label: string;
}

export interface CardData {
  id: string;
  highlight?: boolean;
  image?: string; 
  actionPayload?: any; 
  [key: string]: any;
}

interface Props {
  cardFields: cardField[];
  data: CardData[];
  onAction?: (payload: any) => void;
  actionLabel?: string;
  colorClass?: string;
}

const MobileAccordion = ({ label, content }: { label: string; content: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="md:hidden bg-white rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-3 font-semibold text-[13px] text-primary cursor-pointer select-none hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Dog size={16} className="" />
          <span className="text-sm">{label}</span>
        </div>
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-300 text-primary ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="p-3 pt-0 text-[14px] leading-relaxed whitespace-pre-wrap text-slate-600">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CardOverview({ cardFields, data, onAction, actionLabel, colorClass }: Props) {
  const { t } = useTranslation();

  if (!cardFields || cardFields.length === 0) return null;

  const headline = cardFields[0];
  const cardData = cardFields.slice(1);
  const color = colorClass ? colorClass : 'highlight';

  // 1. Vollständige Klassen in einem Mapping definieren
  const gradientMap: Record<string, { base: string, high: string }> = {
    highlight: {
      base: 'from-highlight/10 to-highlight/10',
      high: 'from-highlight/30 to-highlight/30'
    },
    secondary: {
      base: 'from-secondary/15 to-secondary/15',
      high: 'from-secondary/20 to-secondary/20'
    },
    primary: {
      base: 'from-primary/20 to-primary/20',
      high: 'from-primary/30 to-primary/30'
    }
  };

  // 2. Fallback einbauen, falls eine unregistrierte Farbe übergeben wird
  const safeColor = gradientMap[color] ? color : 'highlight';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5 mb-6">
      {data.map(card => {
        // 3. Die korrekte Klasse aus dem Map ziehen
        const bgGradient = card.highlight 
          ? gradientMap[safeColor].high 
          : gradientMap[safeColor].base;

        return (
          <div 
            key={card.id} 
            id={card.id} 
            className={`flex flex-col bg-white bg-gradient-to-b ${bgGradient} rounded-2xl transition-all overflow-hidden relative scroll-mt-24`}
          >
            {card.image && (
              <div className="w-full h-32 sm:h-40 bg-slate-100 overflow-hidden relative">
                <img src={card.image} alt={card[headline.key]} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="p-5 sm:p-6 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-slate-800 font-heading mb-3">
                {card[headline.key]}
              </h3>

              {card.highlight && (
                <div className="relative right-1.5 inline-flex items-center gap-1.5 bg-accent text-white px-3 py-1.5 rounded-full text-[13px] font-bold w-fit mb-3 shadow-sm">
                  <PawPrint size={15} strokeWidth={2.5} className="fill-white" />
                  <span className="capitalize">{t('contentPages.tableRecommendation', 'Empfehlung mit Hund')}</span>
                </div>
              )}

              <div className="flex flex-col gap-4 flex-1">
                {cardData.map(col => {
                  // Wenn die Spalte für diese spezifische Karte keinen Wert hat, überspringen
                  if (!card[col.key]) return null;

                  if (col.key === 'description') {
                    return (
                      <div key={col.key} className="flex flex-col">
                        <span className="text-[14.5px] text-slate-700 leading-relaxed">
                          {card[col.key]}
                        </span>
                      </div>
                    );
                  }

                  if (col.key === 'countries') {
                    return (
                      <div key={col.key} className="flex flex-col gap-0.5 mt-2">
                        <span className="text-[13px] font-medium text-slate-500 capitalize">
                          {col.label}
                        </span>
                        <span className="text-lg tracking-tighter">
                          {card[col.key]}
                        </span>
                      </div>
                    );
                  }

                  if (col.key === 'travel') {
                    return (
                      <div key={col.key} className="mt-1">
                        <MobileAccordion label={col.label} content={card[col.key]} />
                        <div className="hidden md:flex gap-2 items-center mb-2.5">
                          <Dog size={16} className="text-secondary" />
                          <span className="text-sm font-bold text-secondary">{col.label}</span>
                        </div>
                        <div className="hidden md:block">
                          <div className="text-[14.5px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                              {card[col.key]}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // WIEDER HERGESTELLT: Der Fallback für alle anderen Spalten
                  return (
                    <div key={col.key} className="flex flex-col gap-0.5 mt-2">
                      <span className="text-[13px] font-medium text-slate-500 capitalize">
                        {col.label}
                      </span>
                      <span className="text-[14.5px] text-slate-700 leading-snug whitespace-pre-wrap">
                        {card[col.key]}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Der neue CTA-Footer bleibt unverändert erhalten */}
              {card.actionPayload && onAction && (
                <div className="mt-4 flex md:justify-end ">
                  <button
                    type="button"
                    onClick={() => onAction(card.actionPayload)}
                    className="inline-flex items-center gap-2 bg-white text-primary hover:text-white hover:bg-primary px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-[0.97]"
                  >
                    <Search size={16} strokeWidth={2.5} />
                    <span>{actionLabel || 'Suchen'}</span>
                  </button>
                </div>
              )}

            </div>
          </div>          
        )
      }
    )}
    </div>
  );
}