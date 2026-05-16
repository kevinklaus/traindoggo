import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const params = new URLSearchParams();
    Object.entries(req.query).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v));
      } else if (value) {
        params.append(key, value as string);
      }
    });

    let targetUrl = `https://v6.db.transport.rest/journeys?${params.toString()}`;
    console.log(`[PROXY JOURNEYS] Attempting primary fetch: ${targetUrl}`);

    let response = await fetch(targetUrl, { headers: { 'User-Agent': 'TicketToTail-App/1.0.0' } });
    
    // SELF-HEALING HOOK: If the upstream pricing engine fails (503/500), automatically retry without tickets
    if (!response.ok && params.get('tickets') === 'true') {
      console.warn(`[PROXY RESILIENCE] Upstream failed with status ${response.status}. Dropping ticket requirement and retrying...`);
      
      params.set('tickets', 'false');
      targetUrl = `https://v6.db.transport.rest/journeys?${params.toString()}`;
      
      response = await fetch(targetUrl, { headers: { 'User-Agent': 'TicketToTail-App/1.0.0' } });
    }

    // Final fallback handler if the secondary timetable lookup is also completely down
    if (!response.ok) {
      const errBody = await response.text();
      console.error(`[PROXY ERROR] Upstream completely down. Code: ${response.status}. Body: ${errBody}`);
      return res.status(response.status).json({ error: 'Upstream connection rejected', details: errBody });
    }

    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('[PROXY EXCEPTION] Critical function handler crash:', error.message);
    return res.status(500).json({ error: 'Proxy Exception context triggered', message: error.message });
  }
}