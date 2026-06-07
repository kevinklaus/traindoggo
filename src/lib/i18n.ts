import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const deTranslations = {
  nav: {
    home: "Start",
    guide: "Ratgeber",
    nightTrains: "Nachtzüge",
    doggoTips: "Doggo-Tipps",
    dogRules: "Hunderegeln",
    destinations: "Reiseziele",
    soon: "Bald",
  },
  header: {
    subtitle: "Züge für dich und deinen Hund",
    dogStatus: "{{mode}} Hund",    
    langSwitch: "Sprache wechseln",
    langDE: "Deutsch",
    langEN: "English",
    openMenu: "Menü öffnen"
  },
  menu: {
    title: "Menü",
    nav: "Navigation",
    settings: "Einstellungen",
    lang: "Sprache"
  },
  footer: {
    text: "Entspannte Zugreisen für dich und deinen Hund. Wir zeigen dir genaue Wagenlayouts, damit du den Platz reservieren kannst, der für euch beide am besten passt.",    
    rights: "Train Doggo. Alle Rechte vorbehalten.",
    imprint: "Impressum & Datenschutz"
  },
  landing: {
    title: "Im Zug mit Doggos in Europa",
    heroTitle: "Züge für dich & deinen Hund",
    heroSubtitle: "Auf hundefreundlichen Bahnreisen Europa entdecken",
    fernverkehr: {
      title: "Fernverkehr (ICE/TGV/EC)",
      bullet1: "<b>Kleine Hunde</b> (Katzengröße) reisen gratis in der Box.",
      bullet2: "<b>Große Hunde</b> brauchen ein eigenes Ticket.",
      bullet3: "Es gilt <b>Leinen- & Maulkorbpflicht</b>. In den meisten Fällen kann ein lieber Hund aber auch ohne angelegten Maulkorb einsteigen, wenn er brav ist."
    },
    nahverkehr: {
      title: "Nahverkehr & D-Ticket",
      text1: "Die Regeln sind ein Flickenteppich! 🐶 In manchen Regionen fährt dein Hund kostenlos mit, in anderen wird ein Zusatzticket fällig.",
      text2: "Ob dein Doggo in Deutschland gratis einsteigt, siehst du auf unserer Übersichtskarte unten. 👇"
    },
    map: {
      title: "Übersichtskarte: D-Ticket & Hunde",
      legendTitle: "Legende (Schiene)",
      free: "Hund fährt <b>kostenlos</b> mit",
      ticket: "Hund braucht <b>eigenes Ticket</b>",
      dticket: "Mit D-Ticket kostenlos",
      noVerbund: "DB Hundeticket erforderlich",
      attribution: "Kartendaten: Christoph Sohn, CC BY-SA 4.0, via Wikimedia Commons. | Alle Angaben ohne Gewähr."
    },
    howItWorks: {
      title: "So funktioniert Train Doggo",
      step1: {
        title: "1. Verbindung suchen",
        text: "Gib Start, Ziel und Datum ein. Du kannst Verbindungen in ganz Europa finden!"
      },
      step2: {
        title: "2. Beste Route wählen",
        text: "Wir warnen vor knappen Umstiegen und zeigen dir genaue Wagenlayouts. <br/><span class='text-primary font-medium mt-1 inline-block'> Bald neu: Tipps für entspannte Gassi-Pausen!</span>"
      },
      step3: {
        title: "3. Sitzplatz finden",
        text: "Du findest mit unseren Empfehlungen den Sitzplatz mit dem meisten Raum für Pfoten."
      }
    },
  },
  searchForm: {
    fromLabel: "Von",
    fromPlaceholder: "z. B. München Hbf",
    toLabel: "Nach",
    toPlaceholder: "z. B. Berlin Hbf",
    swapAria: "Abfahrt und Ziel tauschen",
    swapTitle: "Richtung tauschen",
    dateLabel: "Datum",
    timeLabel: "Zeit",
    dogLogistics: "Hunde-Optionen",
    dogModes: {
      none: "Kein Hund",
      noneSub: "Standard-Ticket",
      small: "Kleiner Hund",
      smallSub: "Gratis in der Box",
      large: "Großer Hund",
      largeSub: "Hunde-Ticket nötig"
    },
    validation: {
      both: "Bitte Start- und Zielbahnhof wählen",
      from: "Bitte Startbahnhof wählen",
      to: "Bitte Zielbahnhof wählen"
    },
    submitBtn: "Verbindungen suchen",
    loadingBtn: "Suche läuft…"
  },
  journeys: {
    searching: "Suche Verbindungen…",
    found: {
      zero: "Keine Verbindungen gefunden",
      one: "1 Verbindung gefunden",
      other: "{{count}} Verbindungen gefunden"
    },
    price: {
      check: "Beim Anbieter prüfen",
      incl: "inkl. Hundeticket",
      free: "kleiner Hund gratis"
    },
    load: {
      low: "Leerer Zug",
      lowDesc: "Super für Hunde",
      lowMed: "Moderate Auslastung",
      lowMedDesc: "Entspannt für Hunde",
      medium: "Mittlere Auslastung",
      mediumDesc: "Normaler Platz",
      high: "Voller Zug",
      highDesc: "Stressig für Hunde",
      veryHigh: "Sehr voll",
      veryHighDesc: "Mit Hund meiden",
      unknown: "Auslastung unbekannt",
      unknownDesc: "Anzeigen prüfen"
    },
    timeline: {
      direct: "Direkt",
      change_one: "1 Umstieg",
      change_other: "{{count}} Umstiege",
      tightDog: "Knapp für Hunde",
      transferMin: "{{count}} Min. Umstieg",
      tightWindow: "Knappes Zeitfenster für Hunde",
      towards: "Richtung",
      dogTips: "Hunde-Tipps & Layout",
      stop_one: "1 Halt",
      stop_other: "{{count}} Halte",
      stopovers: "Zwischenhalte",
      station: "Bahnhof",
      transfer: "Umstieg",
      walk: "Fußweg",
      inclMin: "(inkl. {{count}} Min)"
    },
    recommended: {
      title: "Reisetag Empfehlung",
      subtitle: "Dienstag, Mittwoch, Donnerstag und Samstag sind Züge oft leerer."
    }
  },
  composition: {
    labels: {
      firstClass: "1. Kl.",
      secondClass: "2. Kl.",
      mehrzweck: "Mehrzweck",
      bistro: "Bistro",
      cafe: "Café",
      familie: "Familie",
      lok: "Lok",
      abteil: "Abteil"
    },
    trains: {
      ice: "Fernverkehr (ICE/TGV/EC)",
      ic2: "InterCity 2 Doppelstock",
      ic1: "InterCity / Nachtzug",
      re: "Regional-Zug / S-Bahn",
      train: "Zug"
    },
    advice: {
      title: "Sitzplatz-Empfehlung",
      zone: "Empfohlene Zone:",
      seats: "Beste Sitzanordnung:",
      tip: "Experten-Tipp:",
      iceZone: "Großraum · Ruhebereich bevorzugt",
      iceSeats: "Tischplätze oder Rücken-an-Rücken-Reihen",
      iceTip: "Bietet am meisten Bodenfläche abseits des Ganges. Geschlossene Abteile meiden, um Lärmstress zu minimieren.",
      ic2Zone: "Ausschließlich Unterdeck",
      ic2Seats: "Reihensitze nahe der breiten Einstiegsbereiche",
      ic2Tip: "Vermeidet die engen Treppen für große oder ältere Hunde.",
      ic1Zone: "Großraum",
      ic1Seats: "Fensterplätze an Trennwänden",
      ic1Tip: "Sechser-Abteile lassen kaum Bodenfläche. Großraumwagen bieten sich an.",
      regioZone: "Mehrzweckabteil",
      regioSeats: "Klappsitze längs zur Fahrtrichtung nahe den Fahrradstellplätzen",
      regioTip: "Achte auf große Fahrrad-/Rollstuhl-Symbole außen am Zug."
    },
    ui: {
      composition: "Wagenreihung",
      exampleComposition: "Beispielhafte Wagenreihung",
      exampleNote: "Beispiel-Konfiguration — Vor Einsteigen Gleisanzeiger prüfen.",
      closeModal: "Schließen",
      reopenModal: "Wagenreihung anzeigen",
      vagonwebExplanation: "Hier siehst du die echten Wagennummern und Klassen. Klicke auf einen Wagon, um einen detaillierten Sitzplan zu sehen. Fenster und Sitze sind exakt eingezeichnet, so siehst du sofort, ob du rausschauen kannst!",
      vagonwebBestSeats: "Plätze mit Rückenlehne an Rückenlehne oder Plätze, deren Rückenlehne direkt an eine Gepäckablage, einen Raumtrenner/Schiebetür oder ans Wagenende grenzen, sind meistens die besten Optionen.",
      realComposition: "Echte Wagenreihung (vagonWEB)",
      fullscreen: "Vollbild",
      openSeatMap: "Sitzplan öffnen",
      checkAtOperator: "Sitzplan für diesen Zug beim Betreiber prüfen",
      loadingLive: "Lade echte Wagenreihung...",
      layoutDetails: "Sitzplan & Details",
      carriage: "Wagen",
    }
  },
  errors: {
    diagnosticTitle: "System-Diagnosebericht",
    systemNotes: "Architektur-Wiederherstellungs-Notizen",
    retryBtn: "Erneut versuchen"
  },
  contentPages: {
    tocTitle: "Inhalt",
    tableRecommendation: "Empfehlung",
    doggoTips: {
      title: "Doggo-Tipps für die Bahn",
      subtitle: "Die wichtigsten Antworten für eine entspannte Reise.",
      q1: "Muss mein Hund einen Maulkorb tragen?",
      a1: "Offiziell: Ja. Die DB und viele europäische Bahnen verlangen für Hunde, die nicht in einer Transportbox reisen, Leine und Maulkorb. In der Praxis reagiert das Personal bei ruhigen Hunden oft kulant, aber du musst ihn zwingend dabei haben und auf Aufforderung anlegen.",
      q2: "Wie plane ich Gassi-Pausen?",
      a2: "Züge warten nicht. Plane beim Buchen Umstiege von mindestens 20-30 Minuten ein, am besten an großen Bahnhöfen mit Grünflächen in der Nähe. Im Zug gibt es keine Möglichkeit für ein Geschäft.",
      q3: "Was gehört ins Zug-Gepäck?",
      a3: "Eine vertraute Decke (gibt Sicherheit und schützt die Sitze/Boden), ein faltbarer Reisenapf, Wasser und Kausnacks zur Beruhigung beim Druckausgleich (Tunnel).",
      tableTitle: "Übersicht Europa: Hundetickets im Fernverkehr",
      columns: {
        country: "Land",
        price: "Preis",
        comment: "Besonderheiten",
      },
      rows: {
        db: { country: "🇩🇪 Deutschland (DB)", price: "50% des Flexpreises", comment: "Maulkorbpflicht (oft Kulanz)" },
        oebb: { country: "🇦🇹 Österreich (ÖBB)", price: "10% des Vollpreises", comment: "Strikte Maulkorbpflicht!" },
        sncf: { country: "🇫🇷 Frankreich (SNCF)", price: "7 - 20€ (Festpreis)", comment: "Sehr günstig! Online buchbar." },
        trenitalia: { country: "🇮🇹 Italien (Trenitalia)", price: "1 - 5€ (Festpreis)", comment: "Extrem günstig! Oft gratis Aktionen." },
        renfe: { country: "🇪🇸 Spanien (Renfe)", price: "Variabel", comment: "Im AVE sind Hunde >10kg oft komplett verboten! Ausnahme: TGV nach Barcelona." },
        sbb: { country: "🇨🇭 Schweiz (SBB)", price: "25 CHF (Tageskarte)", comment: "Hunde-Pass für Vielfahrer extrem lukrativ." },
        cd: { country: "🇨🇿 Tschechien (ČD)", price: "ca. 1 - 3€", comment: "Inland fast gratis, Maulkorbpflicht." },
        pkp: { country: "🇵🇱 Polen (PKP)", price: "15 PLN (~3.50€)", comment: "Festpreis für alle Strecken, sehr entspannt." }
      },
    },
    nightTrains: {
      title: "Nachtzüge mit Hund",
      subtitle: "Schlafend ans Ziel – was du wissen musst.",
      q1: "Darf der Hund in den Schlaf-/Liegewagen?",
      a1: "Ja, aber fast alle Anbieter haben eine Regel: Du musst das gesamte Abteil für dich (und deine Mitreisenden) buchen. Einzelplätze mit Hund im geteilten Abteil sind nicht erlaubt.",
      q2: "Wo macht der Hund nachts Pipi?",
      a2: "Das ist die größte Herausforderung. Nachtzüge halten oft stundenlang nicht oder nur mitten in der Nacht für wenige Minuten ohne Türfreigabe. Gehe vor dem Schlafen extrem ausführlich Gassi und reduziere das Wasser nachts.",
      q3: "Was kostet das Ticket?",
      a3: "Neben den Kosten für das private Abteil verlangen die meisten Betreiber eine Hunde-Pauschale (beim Nightjet z. B. ca. 30€ pro Strecke). Das Ticket gibt es meist nur direkt beim Betreiber.",
      mapTitle: "Europäische Nachtzug-Karte",
      mapDesc: "Eine fantastische Übersichtskarte aller europäischen Nachtzug-Routen (bereitgestellt von Back on Track).",
      tableTitle: "Hunde im Nachtzug: Europa-Übersicht",
      romaniaNote: "Erfahrungsberichte zeigen: Die Regeln variieren extrem! Während Hunde in Italien oft mit in die Kabine dürfen, sind sie in rumänischen Nachtzügen im Schlafwagen strikt verboten und nur im Sitzwagen erlaubt.",
      columns: {
        operator: "Betreiber",
        countries: "Länder",
        cabin: "Schlaf-/Liegewagen",
        seat: "Sitzwagen",
        price: "Preis"
      },
      rows: {
        oebb: { operator: "ÖBB Nightjet", countries: "🇦🇹 🇩🇪 🇨🇭 🇮🇹 🇫🇷 🇳🇱 🇧🇪", cab: "Nur im Privatabteil", seat: "Erlaubt", price: "~30€ Pauschale" },
        cd: { operator: "ČD Night", countries: "🇨🇿 🇸🇰 🇵🇱 🇭🇺 🇦🇹 🇩🇪 🇨🇭", cab: "Nur im Privatabteil", seat: "Erlaubt", price: "Hunde-Ticket (ca. 10€)" },
        trenitalia: { operator: "Trenitalia", countries: "🇮🇹", cab: "Erlaubt im Abteil", seat: "Erlaubt", price: "~50€ (oft inkl. Set)" },
        sncf: { operator: "SNCF Intercités", countries: "🇫🇷", cab: "Erlaubt", seat: "Erlaubt", price: "7 - 20€ Festpreis" },
        es: { operator: "European Sleeper", countries: "🇧🇪 🇳🇱 🇩🇪 🇨🇿", cab: "Nur im Privatabteil", seat: "Erlaubt", price: "Hunde-Ticket" },
        sj: { operator: "Snälltåget", countries: "🇸🇪 🇩🇪 🇦🇹", cab: "Spezielle Hundeabteile", seat: "Erlaubt", price: "Tierabteil-Preis" },
        cfr: { operator: "Căile Ferate Române", countries: "🇷🇴 🇭🇺 🇦🇹", cab: "Hunde verboten!", seat: "Erlaubt", price: "Voll/Halbpreis" }
      }
    },
    destinations: {
      title: "Hundefreundliche Reiseziele",
      subtitle: "Europas beste Spots, perfekt erreichbar auf Schienen.",
      tableCols: {
        destination: "Ziel",
        description: "Beschreibung",
        travel: "Anreise-Tipp"
      },
      cards: [
        { destination: "🇮🇹 Südtirol (Meran & Rosengarten)", highlight: true, description: "Perfekte Mischung aus Bergen, Wein und charmanten Dörfern. Endlose Wanderoptionen für dich und deinen Hund, z.B. am Kalterer See.", travel: "Bequem mit dem EuroCity (EC) via München und Innsbruck direkt nach Bozen." },
        { destination: "🇪🇸 Montblanc (Katalonien)", description: "Wunderschöne Berge, alte Weinberge und sehr entspannte Ausflugsziele für Hunde abseits des Trubels.", travel: "TGV Frankfurt ➔ Aix-en-Provence (6h), umsteigen nach Barcelona (4h), dann Regionalzug nach Montblanc (2h)." },
        { destination: "🇵🇱 Breslau (Wrocław) & Krakau", description: "Weltoffene Städte voller Geschichte, Kultur und Altstadt-Charme. Entlang der Flüsse gibt es sehr viel Platz für Spaziergänge.", travel: "Sehr gut und direkt erreichbar mit dem EuroCity (EC) ab Berlin oder Leipzig." },
        { destination: "🇫🇷 Avignon (Provence)", description: "Süße Stadt direkt am Fluss mit Zugang zu kleinen grünen Oasen für den Hund und toller südfranzösischer Küche.", travel: "Mit dem TGV direkt ab Frankfurt in entspannten 6 Stunden erreichbar." },
        { destination: "🇩🇪 Thüringen (Erfurt & Weimar)", description: "Historische Altstädte und geniale Ausflugsziele wie die Wartburg. Der Thüringer Wald bietet unendlich viel Natur zum Wandern.", travel: "Schnell aus ganz Deutschland mit dem ICE angebunden (über den ICE-Knotenpunkt Erfurt)." },
        { destination: "🇮🇹 Salerno (Amalfiküste)", description: "Bella Italia pur! Ein genialer Ausgangspunkt für die Amalfiküste mit viel Flair und süditalienischem Charme.", travel: "EuroCity (EC) nach Mailand (ab Frankfurt/Basel), dann mit dem Hochgeschwindigkeitszug Frecciarossa nach Salerno (4h). Alternativ mit dem Nachtzug." },
        { destination: "🇵🇱 Zielona Góra (Grünberg)", description: "Süße, ruhige Altstadt. Perfekt für einen Wochenend- oder Tagesausflug. Leckeres Essen gibt es in den lokalen Brauereien.", travel: "In nur 2 Stunden extrem schnell erreichbar mit dem EuroCity (EC) direkt ab Berlin." },
        { destination: "🇮🇹 Sapri (Cilento)", highlight: true, description: "Ein süßes kleines Städtchen im Cilento. Hier kann man am ruhigen Strand ungestört mit Hund und Gelato spazieren gehen.", travel: "EuroCity (EC) nach Mailand (ab Frankfurt/Basel), dann bequem über Nacht mit dem Nachtzug (ICN) im Privatabteil nach Sapri." },
        { destination: "🇦🇹 Wien", description: "Sehr grüne Stadt! Zwar herrscht teils Leinen-/Maulkorbpflicht, aber die riesige Donauinsel bietet unendlich Platz zum Toben.", travel: "Direkte Verbindungen mit Railjet (RJ), ICE oder der privaten Westbahn aus vielen deutschen Städten." },
        { destination: "🇫🇷 Marseille", description: "Nur für die Harten: Wenig Grün in der Stadt, aber wer damit klarkommt, erlebt eine aufgeweckte, kreative Metropole direkt am Mittelmeer.", travel: "Tolle Anbindung: Mit dem TGV direkt ab Frankfurt in 7 Stunden ohne Umstieg ans Meer." },
      ],
      mapTitle: "Unsere Reisekarte",
      mapDesc: "Hier auf der Viaduct-Karte seht ihr, wo Aslan und ich schon überall unterwegs waren. Schreibt mir gerne, wenn ihr Fragen zu bestimmten Routen habt – ich teile meine Erfahrungen jederzeit sehr gerne!",
      igTitle: "Impressionen auf Instagram",
      igDesc: "Folge @traindoggo für aktuelle Reiseeindrücke und kleine Ausflüge von uns.",
    }
  },
};

const enTranslations = {
  nav: {
    home: "Home",
    guide: "Guide",
    nightTrains: "Night Trains",
    doggoTips: "Doggo Tips",
    dogRules: "Dog Rules",
    destinations: "Destinations",
    soon: "Soon"
  },
  header: {
    subtitle: "Trains for you and your dog",
    dogStatus: "{{mode}} Dog",
    langSwitch: "Change Language",
    langDE: "Deutsch",
    langEN: "English",
    openMenu: "Open menu"
  },
  menu: {
    title: "Menu",
    nav: "Navigation",
    settings: "Settings",
    lang: "Language"
  },
  footer: {
    text: "Comfortable train travel for you and your dog. We'll show you detailed carriage layouts, so you can reserve a spot that works for both of you.",
    rights: "Train Doggo. All rights reserved.",
    imprint: "Imprint & Privacy"
  },
  landing: {
    title: "Traveling with a Doggo in Europe",
    heroTitle: "Trains for you & your dog",
    heroSubtitle: "Discover dog-friendly train travel across Europe",
    fernverkehr: {
      title: "Long-Distance (ICE/TGV/EC)",
      bullet1: "<b>Small dogs</b> (cat size) travel for free in a carrier.",
      bullet2: "<b>Large dogs</b> need their own ticket.",
      bullet3: "<b>Leash & muzzle are required</b>, but in most cases a well-behaved dog can board without a muzzle if they are calm."
    },
    nahverkehr: {
      title: "Local Transport & D-Ticket",
      text1: "The rules are a patchwork! 🐶 In some regions your dog travels for free, in others a supplemental ticket is required.",
      text2: "You can see whether your doggo gets on for free on our overview map below. 👇"
    },
    map: {
      title: "Overview Map: D-Ticket & Dogs",
      legendTitle: "Legend (Rail)",
      free: "Dog <b>free</b>",
      ticket: "Dog <b>needs ticket</b>",
      dticket: "Free with D-Ticket",
      noVerbund: "Dog ticket from DB required",
      attribution: "Map data: Christoph Sohn, CC BY-SA 4.0, via Wikimedia Commons. | All information without warranty."
    },
    howItWorks: {
      title: "How Train Doggo works",
      step1: {
        title: "1. Search connection",
        text: "Enter your start, destination, and date. Find connections all across Europe!"
      },
      step2: {
        title: "2. Choose the best route",
        text: "We warn about tight transfers and show you detailed carriage layouts. <br/><span class='text-primary font-medium mt-1 inline-block'> Coming soon: Tips for relaxed potty breaks!</span>"
      },
      step3: {
        title: "3. Find a seat",
        text: "Find the seat with the most paw-room using our recommendations."
      }
    },
  },
  searchForm: {
    fromLabel: "From",
    fromPlaceholder: "E.g. Munich Hbf",
    toLabel: "To",
    toPlaceholder: "E.g. Berlin Hbf",
    swapAria: "Swap departure and destination",
    swapTitle: "Swap direction",
    dateLabel: "Date",
    timeLabel: "Time",
    dogLogistics: "Dog logistics",
    dogModes: {
      none: "No dog",
      noneSub: "Standard ticket",
      small: "Small dog",
      smallSub: "Free in carrier",
      large: "Large dog",
      largeSub: "Dog ticket required"
    },
    validation: {
      both: "Please select departure and destination stations",
      from: "Please select a departure station",
      to: "Please select a destination station"
    },
    submitBtn: "Search journeys",
    loadingBtn: "Searching…"
  },
  journeys: {
    searching: "Searching for journeys…",
    found: {
      zero: "No journeys found",
      one: "1 journey found",
      other: "{{count}} journeys found"
    },
    price: {
      check: "Check operator",
      incl: "incl. dog ticket",
      free: "small dog free"
    },
    load: {
      low: "Quiet Train",
      lowDesc: "Great for dogs",
      lowMed: "Moderate Load",
      lowMedDesc: "Comfortable for dogs",
      medium: "Medium Load",
      mediumDesc: "Standard spacing",
      high: "Crowded Train",
      highDesc: "Stressful for dogs",
      veryHigh: "Very Crowded",
      veryHighDesc: "Avoid with dogs if possible",
      unknown: "Unknown Load",
      unknownDesc: "Check boards"
    },
    timeline: {
      direct: "Direct",
      change_one: "1 change",
      change_other: "{{count}} changes",
      tightDog: "Tight for dogs",
      transferMin: "{{count}} min transfer",
      tightWindow: "Tight window for dogs",
      towards: "towards",
      dogTips: "Dog tips & layout",
      stop_one: "1 stop",
      stop_other: "{{count}} stops",
      stopovers: "Stopovers",
      station: "Station",
      transfer: "Transfer",
      walk: "Walk",
      inclMin: "(incl. {{count}} min)"
    },
    recommended: {
      title: "Recommended travel days",
      subtitle: "Tuesdays, Wednesdays, Thursdays, and Saturdays tend to have emptier trains."
    }
  },
  composition: {
    labels: {
      firstClass: "1st Cl.",
      secondClass: "2nd Cl.",
      mehrzweck: "Multipurpose",
      bistro: "Bistro",
      cafe: "Café",
      familie: "Family",
      lok: "Loco",
      abteil: "Compartment"
    },
    trains: {
      ice: "Long-Distance (ICE/TGV/EC)",
      ic2: "InterCity 2 Double-Decker",
      ic1: "InterCity / Night Train",
      re: "Regional Train / Suburban",
      train: "Train"
    },
    advice: {
      title: "Seating Advice",
      zone: "Recommended Zone:",
      seats: "Best Seat Arrangement:",
      tip: "Expert Companion Tip:",
      iceZone: "Open Saloon (Großraum) · Quiet Zone preferred",
      iceSeats: "Table configurations (Tisch) or back-to-back bulkhead rows",
      iceTip: "Provides maximum open floor space out of the main aisle. Avoid closed compartments or family zones to significantly minimize noise stress for your pet.",
      ic2Zone: "Lower Deck (Unterdeck) only",
      ic2Seats: "Row seats adjacent to the wide entrance vestibules",
      ic2Tip: "IC2 double-decker cars feature steep, narrow stairwells. Staying on the lower deck level entirely avoids difficult climbs for large, heavy, or senior dogs.",
      ic1Zone: "Open Saloon (Großraum)",
      ic1Seats: "Window seats flanking open corner partitions",
      ic1Tip: "Traditional 6-seat compartments leave zero usable floor area when fully occupied. Open layout cars offer safer, predictable spatial boundaries.",
      regioZone: "Multi-Purpose Area (Mehrzweckabteil)",
      regioSeats: "Fold-up longitudinal seat benches near bicycle slots",
      regioTip: "Look for large bicycle/wheelchair stencils on the car exterior."
    },
    ui: {
      composition: "Train composition",
      exampleComposition: "Example composition",
      exampleNote: "Example configurations modeled after DB standards — always check track indicators before boarding.",
      closeModal: "Close",
      reopenModal: "Show train composition",
      vagonwebExplanation: "Here you can see the real carriage numbers and classes. Click on a carriage to view the detailed seat map. The windows are shown exactly as they are, so you can see if you have a view!",
      vagonwebBestSeats: "Back-to-back seats, or seats where the backrest is directly against a luggage rack, a partition/sliding door, or the end of the carriage are often best for a relaxed journey.",
      realComposition: "Real composition (vagonWEB)",
      fullscreen: "Fullscreen",
      openSeatMap: "View Seat Map",
      checkAtOperator: "Check seat map at operator",
      loadingLive: "Fetching live composition...",
      layoutDetails: "Seat Map & Details",
      carriage: "Carriage",
    }
  },
  errors: {
    diagnosticTitle: "System Diagnostics Report",
    systemNotes: "Architectural System Recovery Notes",
    retryBtn: "Retry Setup"
  },
  contentPages: {
    tocTitle: "Contents",
    tableRecommendation: "Recommended",
    doggoTips: {
      title: "Doggo Travel Tips",
      subtitle: "The most important answers for a relaxed journey.",
      q1: "Does my dog have to wear a muzzle?",
      a1: "Officially: Yes. DB and many European railways require leashes and muzzles for dogs not traveling in a carrier. In practice, staff are often lenient with calm dogs, but you absolutely must have one with you and put it on if asked.",
      q2: "How do I plan potty breaks?",
      a2: "Trains don't wait. When booking, plan layovers of at least 20-30 minutes, ideally at large stations with nearby green spaces. There are no facilities on board for dogs to relieve themselves.",
      q3: "What should I pack?",
      a3: "A familiar blanket (provides security and protects the floor), a collapsible travel bowl, water, and chew snacks to help them calm down and equalize ear pressure in tunnels.",
      tableTitle: "Overview Europe: Dog Tickets on Long-Distance Trains",
      columns: {
        country: "Country",
        price: "Price",
        comment: "Notes"
      },
      rows: {
        db: { country: "🇩🇪 Germany (DB)", price: "50% of flex fare", comment: "Required (often lenient with muzzles)" },
        oebb: { country: "🇦🇹 Austria (ÖBB)", price: "10% of full fare", comment: "Strictly enforced!" },
        sncf: { country: "🇫🇷 France (SNCF)", price: "€7 - €20 (fixed)", comment: "Very cheap! (Bookable online)" },
        trenitalia: { country: "🇮🇹 Italy (Trenitalia)", price: "€1 - €5 (fixed)", comment: "Extremely cheap! (Frequent free promos)" },
        renfe: { country: "🇪🇸 Spain (Renfe)", price: "Variable", comment: "Warning: Dogs >10kg are strictly forbidden on AVE (high-speed) trains! (Exception: TGV to Barcelona)" },
        sbb: { country: "🇨🇭 Switzerland (SBB)", price: "25 CHF (Day Pass)", comment: "Dog pass for frequent travelers is extremely lucrative." },
        cd: { country: "🇨🇿 Czechia (ČD)", price: "approx. €1 - €3", comment: "Domestic travel is almost free, muzzles required." },
        pkp: { country: "🇵🇱 Poland (PKP)", price: "15 PLN (~€3.50)", comment: "Fixed price for all routes, very relaxed." }
      }
    },
    nightTrains: {
      title: "Night Trains with Dogs",
      subtitle: "Sleeping to your destination – what you need to know.",
      q1: "Are dogs allowed in sleeper/couchette cars?",
      a1: "Yes, but almost all operators have one rule: You have to book an entire private compartment for yourself (and your group). Individual beds in shared compartments are off-limits with pets.",
      q2: "Where does the dog pee at night?",
      a2: "This is the biggest challenge. Night trains often don't stop for hours, or only stop for operational reasons without opening doors. Take a very long walk before boarding and limit water intake overnight.",
      q3: "How much does the ticket cost?",
      a3: "In addition to the cost of the private compartment, most operators charge a flat pet fee (e.g., around €30 per trip on Nightjet). You usually have to book this directly through the operator's website.",
      mapTitle: "European Night Train Map",
      mapDesc: "A fantastic overview map of all European night train routes (provided by Back on Track).",
      tableTitle: "Dogs on Night Trains: Europe Overview",
      romaniaNote: "Field reports show that rules vary extremely by country! While dogs are often allowed in cabins in Italy, they are strictly forbidden in sleeping cars on Romanian night trains and only permitted in seated carriages.",
      columns: {
        operator: "Operator",
        countries: "Countries",
        cabin: "Sleeper/Couchette",
        seat: "Seated Car",
        price: "Cost (approx.)"
      },
      rows: {
        oebb: { operator: "ÖBB Nightjet", countries: "🇦🇹 🇩🇪 🇨🇭 🇮🇹 🇫🇷 🇳🇱 🇧🇪", cab: "Only in private cabin", seat: "Allowed", price: "~€30 flat fee" },
        cd: { operator: "ČD Night", countries: "🇨🇿 🇸🇰 🇵🇱 🇭🇺 🇦🇹 🇩🇪 🇨🇭", cab: "Only in private cabin", seat: "Allowed", price: "Dog ticket (~€10)" },
        trenitalia: { operator: "Trenitalia", countries: "🇮🇹", cab: "Allowed in cabin", seat: "Allowed", price: "~€50 (often incl. kit)" },
        sncf: { operator: "SNCF Intercités", countries: "🇫🇷", cab: "Allowed", seat: "Allowed", price: "€7 - €20 fixed price" },
        es: { operator: "European Sleeper", countries: "🇧🇪 🇳🇱 🇩🇪 🇨🇿", cab: "Only in private cabin", seat: "Allowed", price: "Pet ticket" },
        sj: { operator: "Snälltåget", countries: "🇸🇪 🇩🇪 🇦🇹", cab: "Special pet cabins", seat: "Allowed", price: "Pet cabin rate" },
        cfr: { operator: "Căile Ferate Române", countries: "🇷🇴 🇭🇺 🇦🇹", cab: "Dogs forbidden!", seat: "Allowed", price: "Full/Half fare" }
      }
    },
    destinations: {
      title: "Dog-Friendly Destinations",
      subtitle: "Europe's best spots, perfectly accessible by rail.",
      tableCols: {
        destination: "Destination",
        description: "Description",
        travel: "Travel Tip"
      },
      cards: [
        { destination: "🇮🇹 South Tyrol (Meran & Rosengarten)", highlight: true, description: "A perfect mix of mountains, wine, and charming villages. Endless hiking options for you and your dog, e.g. at Lake Kaltern.", travel: "Comfortably reached via EuroCity (EC) through Munich and Innsbruck directly to Bolzano." },
        { destination: "🇪🇸 Montblanc (Catalonia)", description: "Beautiful mountains, old vineyards, and very relaxed excursion spots for dogs away from the hustle and bustle.", travel: "TGV Frankfurt ➔ Aix-en-Provence (6h), change to Barcelona (4h), then regional train to Montblanc (2h)." },
        { destination: "🇵🇱 Wroclaw & Krakow", description: "Cosmopolitan cities full of history, culture, and old-town charm. Lots of space for walks along the rivers.", travel: "Very accessible via direct EuroCity (EC) trains from Berlin or Leipzig." },
        { destination: "🇫🇷 Avignon (Provence)", description: "A cute town right on the river with access to small green oases for your dog and great southern French cuisine.", travel: "Easily accessible with a direct TGV from Frankfurt in just under 6 hours." },
        { destination: "🇩🇪 Thuringia (Erfurt & Weimar)", description: "Historic old towns and brilliant sights like the Wartburg. The Thuringian Forest offers endless nature for hiking.", travel: "Fast connections from all over Germany via ICE (through the ICE hub Erfurt)." },
        { destination: "🇮🇹 Salerno (Amalfi Coast)", description: "Pure Bella Italia! An excellent starting point for the Amalfi Coast with lots of flair and southern Italian charm.", travel: "EuroCity (EC) to Milan (from Frankfurt/Basel), then High-Speed Frecciarossa to Salerno (4h). Alternatively by night train." },
        { destination: "🇵🇱 Zielona Góra", description: "A cute, quiet old town. Perfect for a weekend or day trip. Enjoy delicious food in the local breweries.", travel: "Extremely fast to reach in just 2 hours via direct EuroCity (EC) from Berlin." },
        { destination: "🇮🇹 Sapri (Cilento)", highlight: true, description: "A cute little town in Cilento. Walk undisturbed along the quiet beach with your dog and some gelato.", travel: "EuroCity (EC) to Milan (from Frankfurt/Basel), then comfortably overnight in a private cabin on the night train (ICN) to Sapri." },
        { destination: "🇦🇹 Vienna", description: "A very green city! Although leashes/muzzles are sometimes required, the huge Danube Island offers infinite space to run.", travel: "Direct connections via Railjet (RJ), ICE, or the private Westbahn from many German cities." },
        { destination: "🇫🇷 Marseille", description: "Only for the tough ones: Very little greenery in the city, but if you can handle that, you'll experience a vibrant, creative metropolis by the sea.", travel: "Great connection: Direct TGV from Frankfurt to the Mediterranean in 7 hours with no transfers." },
      ],
      mapTitle: "Our Travel Map",
      mapDesc: "Here on the Viaduct map you can see everywhere Aslan and I have traveled so far. Feel free to message me if you have questions about specific routes – I'm always happy to share my experiences!",
      igTitle: "Impressions on Instagram",
      igDesc: "Follow @traindoggo for recent travel impressions and short trips. 🐾",
    }
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      de: { translation: deTranslations },
      en: { translation: enTranslations }
    },
    fallbackLng: 'en',
    supportedLngs: ['de', 'en'],
    detection: {
      order: ['navigator', 'localStorage'],
      caches: ['localStorage']
    },
    interpolation: { escapeValue: false }
  });

export default i18n;