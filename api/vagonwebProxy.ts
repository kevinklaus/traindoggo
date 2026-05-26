import type { VercelRequest, VercelResponse } from '@vercel/node';

export const INJECTED_CSS = `
  /* Unnötige Elemente komplett ausblenden */
  #hlavicka, #hlavicka_respon, #horizmenu, #horizmenu_respon, #cesta3, #cesta4, #pravanavigace0, #zapati { 
    display: none !important; 
  }
  body { background: #fff !important; margin: 0; padding: 10px 10px 40px 10px; }
  
  /* Dezentere, native Scrollbars */
  ::-webkit-scrollbar { width: 0px; height: 6px; }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
  
  /* Die neuen Train Doggo Horizontal-Buttons (Modern & App-konsistent) */
  .td-scroll-btn {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid #e2e8f0;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
    color: #334155;
    transition: all 0.2s ease;
    user-select: none;
  }
  .td-scroll-btn:hover { background: #ffffff; transform: translateY(-50%) scale(1.05); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
  .td-scroll-btn:active { transform: translateY(-50%) scale(0.95); }
  .td-scroll-btn:focus-visible { outline: 2px solid #4f46e5; outline-offset: 2px; }
  
  #td-scroll-left { left: 12px; }
  #td-scroll-right { right: 12px; }

  /* Mobile Optimierungen */
  @media (max-width: 600px) {
    .td-scroll-btn {
      width: 36px;
      height: 36px;
      background: rgba(255, 255, 255, 0.85);
    }
    #td-scroll-left { left: 6px; }
    #td-scroll-right { right: 6px; }
    body { padding: 5px 5px 40px 5px; }
  }
`;

export const INJECTED_SCRIPT = `
  window.onload = function() {
    var targetTable = document.querySelector('table.vlacek');
    
    if (targetTable) {
      setTimeout(function() {
        var topPosition = targetTable.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: topPosition - 5, behavior: 'smooth' });
        
        setTimeout(function() {
          document.body.style.overflowY = 'hidden';
        }, 800);
      }, 300);

      // Barrierefreie, wunderschöne SVG Icons (passend zu Lucide in React)
      var svgLeft = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>';
      var svgRight = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';

      // i18n Unterstützung direkt im iFrame Skript anhand der URL
      var urlParams = new URLSearchParams(window.location.search);
      var lang = urlParams.get('lang') || 'de';
      var leftLabel = lang === 'en' ? 'Scroll left' : 'Nach links scrollen';
      var rightLabel = lang === 'en' ? 'Scroll right' : 'Nach rechts scrollen';

      var btnLeft = document.createElement('div');
      btnLeft.id = 'td-scroll-left';
      btnLeft.className = 'td-scroll-btn';
      btnLeft.innerHTML = svgLeft;
      btnLeft.setAttribute('role', 'button');
      btnLeft.setAttribute('tabindex', '0');
      btnLeft.setAttribute('aria-label', leftLabel);
      
      var btnRight = document.createElement('div');
      btnRight.id = 'td-scroll-right';
      btnRight.className = 'td-scroll-btn';
      btnRight.innerHTML = svgRight;
      btnRight.setAttribute('role', 'button');
      btnRight.setAttribute('tabindex', '0');
      btnRight.setAttribute('aria-label', rightLabel);
      
      document.body.appendChild(btnLeft);
      document.body.appendChild(btnRight);
      
      var scrollContainer = document.querySelector('.overflow_x') || window;
      
      // Weich um 90% des Sichtfeldes scrollen
      btnLeft.onclick = function() {
        var amount = window.innerWidth * 0.90; 
        if (scrollContainer === window) { window.scrollBy({ left: -amount, behavior: 'smooth' }); }
        else { scrollContainer.scrollBy({ left: -amount, behavior: 'smooth' }); }
      };
      
      btnRight.onclick = function() {
        var amount = window.innerWidth * 0.90;
        if (scrollContainer === window) { window.scrollBy({ left: amount, behavior: 'smooth' }); }
        else { scrollContainer.scrollBy({ left: amount, behavior: 'smooth' }); }
      };

      // Tastatur-Bedienung (Accessibility)
      function handleKey(e, btn) {
        if(e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      }
      btnLeft.onkeydown = function(e) { handleKey(e, btnLeft); };
      btnRight.onkeydown = function(e) { handleKey(e, btnRight); };
    }

    // CORS-Hack für Popups
    (function() {
      var originalOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function(method, url) {
        var resolvedUrl = new URL(url, document.baseURI).href;
        if (resolvedUrl.indexOf('vagonweb.cz') !== -1) {
          var myOrigin = window.location.protocol + '//' + window.location.host;
          arguments[1] = myOrigin + '/api/vagonwebProxy?proxyTarget=' + encodeURIComponent(resolvedUrl);
        }
        return originalOpen.apply(this, arguments);
      };
    })();
  };
`;

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
    // Dieser Log taucht im Vercel Dashboard auf!
    console.error('🔥 VAGONWEB PROXY CRASH:', error.message, error.stack);
    
    // Das schicken wir direkt in deinen Browser Network-Tab
    if (isRender) {
      return res.status(500).send(`Proxy Error: ${error.message}`);
    }
    return res.status(500).json({ 
      exists: false, 
      debug_error: error.message,
      name: error.name
    });
  }
}