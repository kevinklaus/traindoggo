import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { latitude, longitude } = req.query;
  const url = `https://v6.db.transport.rest/locations/nearby?latitude=${latitude}&longitude=${longitude}&results=10`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Nearby proxy failed' });
  }
}