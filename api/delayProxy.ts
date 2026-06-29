import type { VercelRequest, VercelResponse } from '@vercel/node';

// Hilfsfunktion: Limitiert die gleichzeitigen API-Calls
async function fetchWithRateLimit<T>(tasks: (() => Promise<T>)[], limitPerSecond = 99): Promise<T[]> {
  const results: T[] = [];
  const startTime = Date.now();
  
  for (let i = 0; i < tasks.length; i++) {
    // 1. Berechne, wie viele Calls wir schon hätten machen sollen
    // 2. Falls wir zu schnell sind, warten wir den Rest der Sekunde ab
    if (i > 0 && i % limitPerSecond === 0) {
      const elapsed = Date.now() - startTime;
      const waitTime = 1000 - (elapsed % 1000);
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    // Starte den Call (wir pushen das Promise direkt in ein Array, um parallel zu laufen)
    results.push(await tasks[i]());
  }
  
  return results;
}
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Header für saubere Kommunikation
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    // Das Frontend schickt uns ein dedupliziertes Array aller Umstiege
    const { transfers } = req.body as { 
      transfers: { key: string, firstLine: string, firstDest: string, secondLine: string, secondOrig: string }[] 
    };

    if (!transfers || !Array.isArray(transfers)) {
      return res.status(400).json({ error: 'Invalid payload. Expected an array of transfers.' });
    }

    const apiKey = process.env.CHUUCHUU_APIKEY;

    if (!apiKey) {
      throw new Error('CHUUCHUU_APIKEY is not configured on the server.');
    }

    const chuuchuuTransferStats: Record<string, any> = {};

    const fetchTasks = transfers.map((data) => {
      return async () => {
        try {
          const url = new URL('https://api.chuuchuu.com/api/v2/transferstats');
          url.searchParams.append('firstLegLineName', data.firstLine);
          url.searchParams.append('firstLegDestinationId', data.firstDest);
          url.searchParams.append('secondLegLineName', data.secondLine);
          url.searchParams.append('secondLegOriginId', data.secondOrig);

          const cRes = await fetch(url.toString(), {
            headers: { 'Authorization': `Bearer ${apiKey}` }
          });

          if (cRes.ok) {
            const json = await cRes.json();
            return { key: data.key, stat: json };
          }
          return { key: data.key, stat: null }; 
        } catch (e) {
          console.warn(`[Chuuchuu Error] Failed to fetch transfer stat for ${data.key}`);
          return { key: data.key, stat: null };
        }
      };
    });

    // Limitierte API-Abfrage (max 10 parallel)
    const results = await fetchWithRateLimit(fetchTasks);
    
    results.forEach(res => {
      if (res.stat) chuuchuuTransferStats[res.key] = res.stat;
    });

    return res.status(200).json({ transfers: chuuchuuTransferStats });

  } catch (error: any) {
    console.error('[DELAY PROXY ERROR]', error.message);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}