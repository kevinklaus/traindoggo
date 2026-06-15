import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Wir holen jetzt AUCH earlierRef und laterRef
  const { from, to, departure, maxChanges, minTransferTime, earlierRef, laterRef } = req.query;
  
  if (!from || !to) {
    return res.status(400).json({ error: 'Missing required journey routing attributes' });
  }

  try {
    //@ts-ignore
    const { createClient } = await import('hafas-client');
    //@ts-ignore
    const { profile: oebbProfile } = await import('hafas-client/p/oebb/index.js');
    const client = createClient(oebbProfile, 'TicketToTail-App/1.0.0');

    // 2. Das Optionen-Objekt für HAFAS (Start ohne departure, das regeln wir gleich)
    const hafasOptions: any = {
      stopovers: true,
      remarks: true,
      results: 5 // Tipp: Bei Pagination reichen oft 5 Ergebnisse, dann lädt es blitzschnell
    };

    // 3. PAGINATION-LOGIK: Entweder Ref ODER Datum nutzen
    if (earlierRef) {
      hafasOptions.earlierThan = earlierRef as string;
    } else if (laterRef) {
      hafasOptions.laterThan = laterRef as string;
    } else if (departure) {
      hafasOptions.departure = departure as string;
    }

    // 4. Filter mappen
    if (maxChanges !== undefined && maxChanges !== '') hafasOptions.transfers = Number(maxChanges);
    if (minTransferTime !== undefined && minTransferTime !== '') hafasOptions.transferTime = Number(minTransferTime);


    // // Debugging
    // console.log('--- DEBUG HAFAS CALL ---');
    // console.log('1. FROM:', from);
    // console.log('2. TO:', to);
    // console.log('3. OPTIONS:', JSON.stringify(hafasOptions, null, 2));
    // console.log('------------------------');

  // 5. Aufruf mit dem nun übersetzten und vollständigen hafasOptions-Objekt
    const hResponse = await client.journeys(from as string, to as string, hafasOptions);

    // HAFAS Typ-Fix: Prüfen ob es direkt ein Array ist, sonst safely auf .journeys zugreifen
    const journeys = Array.isArray(hResponse) ? hResponse : (hResponse as any).journeys || [];
    
    // NEU: Wir nutzen andere Variablennamen (next...), um Konflikte mit req.query zu vermeiden
    const nextEarlierRef = Array.isArray(hResponse) ? undefined : (hResponse as any).earlierRef;
    const nextLaterRef = Array.isArray(hResponse) ? undefined : (hResponse as any).laterRef;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    // NEU: Wir reichen die neuen Tokens mit ans Frontend durch
    return res.status(200).json({
      journeys: journeys,
      earlierRef: nextEarlierRef,
      laterRef: nextLaterRef
    });
  } catch (error: any) {
    console.error('[ÖBB RUNTIME ERROR]', error.message);
    return res.status(500).json({ error: 'Upstream Failure', message: error.message });
  }
}