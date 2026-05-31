import { Hash } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface ToCItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface Props {
  items: ToCItem[];
}

export default function TableOfContents({ items }: Props) {
  const { t } = useTranslation();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      // 100px Offset wegen des fixierten Headers!
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-primary/5 rounded-2xl p-4 sm:p-5 mb-8 border border-primary/10">
      <span className="text-[14px] font-bold tracking-wider text-primary mb-3 block">
        {t('contentPages.tocTitle')}
      </span>
      <div className="flex flex-wrap gap-2.5">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className="flex items-center text-left gap-2 bg-white px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-primary hover:shadow-sm border border-slate-200 hover:border-primary/30 transition-all"
          >
            {item.icon || <Hash size={16} className="text-primary/50" />}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}