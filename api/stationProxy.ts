import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { query, limit = '8' } = req.query;
  if (!query) return res.status(400).json({ error: 'Missing required search string' });

try {
    //@ts-ignore ignore error about missing types for the profile import
    const { createClient } = await import('hafas-client');
    //@ts-ignore ignore error about missing types for the profile import
    const { profile: oebbProfile } = await import('hafas-client/p/oebb/index.js');

    const client = createClient(oebbProfile, 'TicketToTail-App/1.0.0');

    // ... ab hier bleibt dein locations / journeys Code genau gleich ...
    const stations = await client.locations(query as string, {
      results: parseInt(limit as string, 10),
      stations: true,
      poi: false,
      addresses: false
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(stations);
  } catch (error: any) {
    console.error('[ÖBB RUNTIME ERROR]', error.message);
    return res.status(500).json({ error: 'Upstream Failure', message: error.message });
  }
}