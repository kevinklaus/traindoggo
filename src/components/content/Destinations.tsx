import { Map, Instagram } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import TableOfContents from './TableOfContents';
import CardOverview from './CardOverview';

// VITE GLOB IMPORT: Holt auf einen Schlag ALLE Bilder aus dem Ordner!
// Das { eager: true, as: 'url' } sorgt dafür, dass Vite direkt die fertigen URLs liefert.
const destinationImages = import.meta.glob('./images/*.{png,jpg,jpeg,webp}', { 
  eager: true, 
  query: '?url',
  import: 'default' 
}) as Record<string, string>;

export default function Destinations() {
  const { t } = useTranslation();

  const cardFields = [
    { key: 'destination', label: t('contentPages.destinations.tableCols.destination', 'Ziel') },
    { key: 'description', label: t('contentPages.destinations.tableCols.description', 'Beschreibung') },
    { key: 'travel', label: t('contentPages.destinations.tableCols.travel', 'Anreise-Tipp') }
  ];

  // 1. Daten holen und IDs + Bilder vergeben
  const rawCards = t('contentPages.destinations.cards', { returnObjects: true }) as any[];
  
  const cardsData = rawCards.map((card, index) => {
    // Finde das passende Bild aus dem Glob-Import anhand der imageId
    // Wir suchen nach dem Dateinamen, z.B. "montblanc.jpg" in den importierten Pfaden
    const matchedImagePath = Object.keys(destinationImages).find(path => 
      path.includes(`/${card.imageId}.`)
    );

    return {
      id: `dest-${index}`, // Diese ID referenzieren wir gleich im TOC
      image: matchedImagePath ? destinationImages[matchedImagePath] : undefined, // Packt das Bild rein, falls gefunden
      ...card
    };
  });

  // 2. Inhaltsverzeichnis dynamisch aufbauen!
  const tocItems = [
    { id: 'viaduct-map', label: t('contentPages.destinations.mapTitle'), icon: <Map size={16}/> },
    ...cardsData.map((card) => ({
      id: card.id,
      highlight: card.highlight,
      label: card.destination, 
    })),
    { id: 'instagram', label: t('contentPages.destinations.igTitle', 'Instagram'), icon: <Instagram size={16}/> },
  ];

  return (
    <div className="max-w-4xl mx-auto sm:px-4 py-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 font-heading mb-2">{t('contentPages.destinations.title')}</h1>
        <p className="text-slate-600 text-lg">{t('contentPages.destinations.subtitle')}</p>
      </div>

      <TableOfContents items={tocItems} />

      <div className="space-y-6 mt-8">
        
        {/* Nativer Viaduct Embed */}
        <div id="viaduct-map" className="bg-white rounded-3xl p-5 sm:p-6 mb-6 scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-xl shrink-0"><Map className="text-primary" /></div>
            <h3 className="text-lg font-bold text-slate-800">{t('contentPages.destinations.mapTitle')}</h3>
          </div>
          <p className="text-slate-600 mb-6 sm:ml-[52px]">{t('contentPages.destinations.mapDesc')}</p>
          
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

        {/* Die dynamischen Destination cardFields */}
        <div className="bg-white rounded-3xl p-4">
          <CardOverview cardFields={cardFields} data={cardsData} />
        </div>

        {/* Instagram Modul mit direktem Button */}
        <div id="instagram" className="bg-white rounded-3xl p-5 sm:p-6 mt-6 scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-pink-50 text-pink-600 rounded-xl shrink-0"><Instagram size={20} /></div>
            <h3 className="text-lg font-bold text-slate-800">
              {t('contentPages.destinations.igTitle', 'Impressionen auf Instagram')}
            </h3>
          </div>
          <p className="text-slate-600 mb-6 sm:ml-[52px]">
            {t('contentPages.destinations.igDesc', 'Folge @traindoggo für aktuelle Reiseeindrücke und kleine Ausflüge von uns.')}
          </p>

          <div className="sm:ml-[52px]">
            <a 
              href="https://www.instagram.com/traindoggo" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white px-5 py-3 rounded-xl font-bold hover:opacity-80 hover:text-secondary transition-opacity shadow-sm"
            >
              <Instagram size={20} />
              <span>Instagram @traindoggo</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}