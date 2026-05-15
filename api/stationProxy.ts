import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Get the query from your frontend request
  const { query, limit = '8' } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter' });
  }

  // 2. Build the target DB URL (encoded for Umlauts like München)
  const targetUrl = `https://v6.db.transport.rest/locations?query=${encodeURIComponent(query as string)}&limit=${limit}&fuzzy=true`;

  try {
    const response = await fetch(targetUrl);
    const data = await response.json();

    // 3. Add CORS headers so your frontend is allowed to read this
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    return res.status(500).json({ error: 'Failed to fetch from DB API' });
  }
}