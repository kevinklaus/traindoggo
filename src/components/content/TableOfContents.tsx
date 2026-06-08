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
    <div className="bg-secondary/10 rounded-3xl p-4 sm:p-5 mb-8">
      <span className="text-[14px] font-bold tracking-wider text-secondary mb-3 block">
        {t('contentPages.tocTitle')}
      </span>
      <div className="flex flex-wrap gap-2.5">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className="flex items-center text-left gap-2 bg-white px-3 py-2 rounded-full text-sm font-semibold text-secondary hover:text-primary hover:shadow-sm hover:border-primary/30 transition-all"
          >
            {item.icon? item.icon: ""}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}