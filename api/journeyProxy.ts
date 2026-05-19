import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { from, to, departure } = req.query;
  if (!from || !to || !departure) {
    return res.status(400).json({ error: 'Missing required journey routing attributes' });
  }

  try {
    //@ts-ignore ignore error about missing types for the profile import
    const { createClient } = await import('hafas-client');
    //@ts-ignore ignore error about missing types for the profile import
    const { profile: oebbProfile } = await import('hafas-client/p/oebb/index.js');

    const client = createClient(oebbProfile, 'TicketToTail-App/1.0.0');

    const hResponse = await client.journeys(from as string, to as string, {
      departure: departure as string,
      stopovers: true,
      remarks: true,
      results: 5
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    return res.status(200).json({
      journeys: hResponse.journeys || []
    });
  } catch (error: any) {
    console.error('[ÖBB RUNTIME ERROR]', error.message);
    return res.status(500).json({ error: 'Upstream Failure', message: error.message });
  }
}