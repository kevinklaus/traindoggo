import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { query, limit = '8' } = req.query;
  if (!query) return res.status(400).json({ error: 'Missing required search string' });

  const targetUrl = `https://v6.db.transport.rest/locations?query=${encodeURIComponent(query as string)}&results=${limit}&poi=false&addresses=false`;
  console.log(`[PROXY SEARCH] Outgoing station fetch target: ${targetUrl}`);

  try {
    const response = await fetch(targetUrl, { headers: { 'User-Agent': 'TicketToTail-App/1.0.0' } });
    if (!response.ok) {
      const errBody = await response.text();
      console.error(`[PROXY ERROR] Upstream down. Code: ${response.status}. Body: ${errBody}`);
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