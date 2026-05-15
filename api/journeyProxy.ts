import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // 1. Properly rebuild the query string from the incoming request
    const params = new URLSearchParams();
    Object.entries(req.query).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v));
      } else if (value) {
        params.append(key, value as string);
      }
    });

    const targetUrl = `https://v6.db.transport.rest/journeys?${params.toString()}`;
    
    // Senior tip: Log the URL in your terminal so you can see exactly what's being fetched
    console.log('Proxying journey request to:', targetUrl);

    // 2. Fetch from DB API
    const response = await fetch(targetUrl);
    
    // 3. Check if the DB API itself failed (e.g., 400 Bad Request)
    if (!response.ok) {
      const errorText = await response.text();
      console.error('DB API Error Response:', errorText);
      return res.status(response.status).json({ error: 'DB API Error', details: errorText });
    }

    const data = await response.json();
    
    // 4. Set CORS and return data
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(data);

  } catch (error: any) {
    // This catches code crashes (e.g., fetch failing, syntax errors)
    console.error('Journey Proxy Crash:', error.message);
    return res.status(500).json({ 
      error: 'Internal Proxy Error', 
      message: error.message 
    });
  }
}