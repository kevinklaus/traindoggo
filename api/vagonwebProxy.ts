import type { VercelRequest, VercelResponse } from '@vercel/node';
import { INJECTED_CSS, INJECTED_SCRIPT } from './vagonwebAssets';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const headers: Record<string, string> = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  };

  // Modus 3: AJAX Proxy (Für Popups)
  if (req.query.proxyTarget) {
    try {
      const targetUrl = decodeURIComponent(req.query.proxyTarget as string);
      const response = await fetch(targetUrl, { headers });
      const text = await response.text();
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(text);
    } catch (error) {
      return res.status(500).send('AJAX Proxy failed');
    }
  }

  // Modus 1 & 2: vagonWEB Basis-Setup
  const url = new URL('https://www.vagonweb.cz/razeni/vlak.php');
  const isRender = req.query.render === 'true';

  for (const [key, value] of Object.entries(req.query)) {
    if (key !== 'render' && key !== 'proxyTarget') {
      if (typeof value === 'string') {
        url.searchParams.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach(v => url.searchParams.append(key, v));
      }
    }
  }

  const targetUrl = url.toString();
  if (isRender) headers['Referer'] = targetUrl; 

  try {
    const response = await fetch(targetUrl, { headers });
    let html = await response.text();

    // Tracker & Fonts entfernen
    html = html.replace(/<script[^>]*cloudflare[^>]*>[\s\S]*?<\/script>/gi, '');
    html = html.replace(/<script[^>]*cdn-cgi[^>]*>[\s\S]*?<\/script>/gi, '');
    html = html.replace(/@font-face\s*\{[^}]*\}/gi, '');

    // Check-Modus (für das Train Doggo Frontend)
    if (!isRender) {
      const notFoundMarkers = ['Kein Zug gefunden', 'wurde nicht gefunden', 'not found', 'nebyl nalezen'];
      if (notFoundMarkers.some(marker => html.includes(marker))) {
        return res.status(200).json({ exists: false });
      }

      const hasAnzeigenLink = html.match(/href=['"]?[^>'"\s]*(vlak\.php|vagon\.php)\?[^>'"\s]*cislo=[^>'"\s]*['"]?/i);
      const hasGraphics = html.includes('id="obsah_razeni"') || html.includes('class="vuz"');

      if (hasAnzeigenLink || hasGraphics) {
        const iframeUrl = `/api/vagonwebProxy?${url.searchParams.toString()}&render=true`;
        return res.status(200).json({ exists: true, directUrl: iframeUrl });
      }

      return res.status(200).json({ exists: false });
    }

    // Render-Modus (wird IM iFrame ausgeführt)
    if (isRender) {
      html = html.replace('<head>', `<head><base href="https://www.vagonweb.cz/razeni/">\n<style>\n${INJECTED_CSS}\n</style>`);
      html += `\n<script>\n${INJECTED_SCRIPT}\n</script>`;

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(html);
    }

  } catch (error: any) {
    if (isRender) return res.status(500).send('Proxy rendering error');
    return res.status(500).json({ exists: false });
  }
}