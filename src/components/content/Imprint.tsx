import ReactMarkdown from 'react-markdown';
import { X } from 'lucide-react';

const imprintMd = `
Kevin Klaus, Seestr. 11, 15366 Hoppegarten, Germany
[kevintheklaus@gmail.com](mailto:kevintheklaus@gmail.com)  

**Datenschutz & Haftungsausschluss** Dies ist ein nicht-kommerzielles Portfolio-Projekt. Alle angezeigten Reisedaten und Hunde-Regelungen stammen aus Community-Daten und sind **ohne Gewähr**. Es werden keine personenbezogenen Daten gespeichert oder verarbeitet.
`;

interface Props {
  onClose: () => void;
}

export default function Imprint({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800 font-heading">Impressum</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto prose prose-sm prose-slate prose-a:text-primary">
          <ReactMarkdown>{imprintMd}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}