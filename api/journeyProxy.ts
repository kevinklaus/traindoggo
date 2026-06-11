import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Wir holen jetzt AUCH maxChanges und minTransferTime aus dem Frontend-Request
  const { from, to, departure, maxChanges, minTransferTime } = req.query;
  
  if (!from || !to || !departure) {
    return res.status(400).json({ error: 'Missing required journey routing attributes' });
  }

  try {
    //@ts-ignore ignore error about missing types for the profile import
    const { createClient } = await import('hafas-client');
    //@ts-ignore ignore error about missing types for the profile import
    const { profile: oebbProfile } = await import('hafas-client/p/oebb/index.js');

    const client = createClient(oebbProfile, 'TicketToTail-App/1.0.0');

    // 2. Das Optionen-Objekt für HAFAS vorbereiten
    const hafasOptions: any = {
      departure: departure as string,
      stopovers: true,
      remarks: true,
      results: 5
    };

    // 3. Wenn das Frontend maxChanges schickt, mappen wir es auf "transfers"
    if (maxChanges !== undefined && maxChanges !== '') {
      hafasOptions.transfers = Number(maxChanges);
    }

    // 4. Wenn das Frontend minTransferTime schickt, mappen wir es auf "transferTime"
    if (minTransferTime !== undefined && minTransferTime !== '') {
      hafasOptions.transferTime = Number(minTransferTime);
    }


    // Debugging
    console.log('--- DEBUG HAFAS CALL ---');
    console.log('1. FROM:', from);
    console.log('2. TO:', to);
    console.log('3. OPTIONS:', JSON.stringify(hafasOptions, null, 2));
    console.log('------------------------');
   // 5. Aufruf mit dem nun übersetzten und vollständigen hafasOptions-Objekt
    const hResponse = await client.journeys(from as string, to as string, hafasOptions);

    // HAFAS Typ-Fix: Prüfen ob es direkt ein Array ist, sonst safely auf .journeys zugreifen
    const journeys = Array.isArray(hResponse) ? hResponse : (hResponse as any).journeys || [];

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    return res.status(200).json({
      journeys: journeys
    });
  } catch (error: any) {
    console.error('[ÖBB RUNTIME ERROR]', error.message);
    return res.status(500).json({ error: 'Upstream Failure', message: error.message });
  }
}