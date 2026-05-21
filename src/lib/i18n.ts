import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const deTranslations = {
  header: {
    subtitle: "Züge für dich und deinen Hund",
    dogStatus: "{{mode}} Hund"
  },
  footer: {
    text: "Finde einen bequemen Sitzplatz für dich und deinen Hund, wirf einen Blick auf beispielhafte Wagenlayouts und reserviere dann den Bereich, der für euch beide am besten passt.",    
    rights: "© 2026 Train Doggo. Alle Rechte vorbehalten.",
    imprint: "Impressum & Datenschutz"
  },
  landing: {
    title: "Reisen mit Train Doggo",
    fernverkehr: {
      title: "Fernverkehr (ICE/IC)",
      bullet1: "<b>Kleine Hunde</b> (Katzengröße) reisen gratis in der Box.",
      bullet2: "<b>Große Hunde</b> zahlen den halben Ticketpreis.",
      bullet3: "Es gilt <b>Leinen- & Maulkorbpflicht</b>. In den meisten Fällen kann ein lieber Hund aber auch ohne angelegten Maulkorb einsteigen, wenn er brav ist."
    },
    nahverkehr: {
      title: "Nahverkehr & D-Ticket",
      text1: "Die Regeln sind ein absoluter Flickenteppich! 🐶 In manchen Regionen fährt dein Hund kostenlos mit, in anderen wird ein Zusatzticket fällig.",
      text2: "Ob dein Doggo gratis einsteigt, siehst du auf unserer <i>pfotenstarken</i> Übersichtskarte unten. 👇"
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
      ice: "ICE",
      ic2: "IC2 Doppelstock",
      ic1: "IC1 Traditionell",
      re1: "Regional-Express 1",
      re2: "Regional-Express 2",
      train: "Zug"
    },
    advice: {
      title: "Dog-First Sitzplatz-Empfehlung",
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
      ic1Seats: "Fensterplätze an offenen Trennwänden",
      ic1Tip: "Sechser-Abteile lassen kaum Bodenfläche. Großraumwagen bieten besser berechenbare Platzgrenzen.",
      regioZone: "Mehrzweckabteil",
      regioSeats: "Klappsitze längs zur Fahrtrichtung nahe den Fahrradstellplätzen",
      regioTip: "Achte auf große Fahrrad-/Rollstuhl-Symbole außen am Zug. Den Hund an kurzer Leine führen."
    },
    ui: {
      dogFriendly: "Hundefreundlicher Sitzplan (Beispiel)",
      typical: "Typische Wagenreihung",
      exampleNote: "Beispiel-Konfiguration — Vor Einsteigen Gleisanzeiger prüfen."
    }
  },
  errors: {
    diagnosticTitle: "System-Diagnosebericht",
    systemNotes: "Architektur-Wiederherstellungs-Notizen",
    retryBtn: "Erneut versuchen"
  }
};

const enTranslations = {
  header: {
    subtitle: "Trains for you and your dog",
    dogStatus: "{{mode}} Dog"
  },
  footer: {
    text: "Find a comfortable seat for you and your dog, peek at example carriage layouts, then reserve the space that works for both of you.",
    rights: "© 2026 Train Doggo. All rights reserved.",
    imprint: "Imprint & Privacy"
  },
  landing: {
    title: "Traveling with Train Doggo",
    fernverkehr: {
      title: "Long-Distance (ICE/IC)",
      bullet1: "<b>Small dogs</b> (cat size) travel for free in a carrier.",
      bullet2: "<b>Large dogs</b> pay half the ticket fare.",
      bullet3: "<b>Leash & muzzle are required</b>, but in most cases a well-behaved dog can board without a muzzle if they are calm."
    },
    nahverkehr: {
      title: "Local Transport & D-Ticket",
      text1: "The rules are an absolute patchwork! 🐶 In some regions your dog travels for free, in others a supplemental ticket is required.",
      text2: "You can see whether your doggo gets on for free on our <i>pawsome</i> overview map below. 👇"
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
      ice: "ICE",
      ic2: "IC2 Double-Decker",
      ic1: "IC1 Traditional",
      re1: "Regional-Express 1",
      re2: "Regional-Express 2",
      train: "Train"
    },
    advice: {
      title: "Dog-First Reservation Advice",
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
      regioTip: "Look for large bicycle/wheelchair stencils on the car exterior. These zones feature open floor sections. Keep your dog closely leashed near passenger boarding flows."
    },
    ui: {
      dogFriendly: "Dog-friendly seat map alignment (example)",
      typical: "Typical train composition",
      exampleNote: "Example configurations modeled after DB standards — always check track indicators before boarding."
    }
  },
  errors: {
    diagnosticTitle: "System Diagnostics Report",
    systemNotes: "Architectural System Recovery Notes",
    retryBtn: "Retry Setup"
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      de: { translation: deTranslations },
      en: { translation: enTranslations }
    },
    fallbackLng: 'de',
    interpolation: { escapeValue: false }
  });

export default i18n;