import type { VercelRequest, VercelResponse } from '@vercel/node';

// Hilfsfunktion: Limitiert die gleichzeitigen API-Calls
async function fetchInBatches<T>(tasks: (() => Promise<T>)[], batchSize = 10): Promise<T[]> {
  const results: T[] = [];
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fn => fn()));
    results.push(...batchResults);
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
    const results = await fetchInBatches(fetchTasks, 10);
    
    results.forEach(res => {
      if (res.stat) chuuchuuTransferStats[res.key] = res.stat;
    });

    return res.status(200).json({ transfers: chuuchuuTransferStats });

  } catch (error: any) {
    console.error('[DELAY PROXY ERROR]', error.message);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}