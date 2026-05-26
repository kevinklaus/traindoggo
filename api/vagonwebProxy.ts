import type { VercelRequest, VercelResponse } from '@vercel/node';

const INJECTED_CSS = `
  #hlavicka, #hlavicka_respon, #horizmenu, #horizmenu_respon, #cesta3, #cesta4, #pravanavigace0, #zapati { display: none !important; }
  body { background: #fff !important; margin: 0; padding: 10px 10px 15px 10px; }
  ::-webkit-scrollbar { width: 0px; height: 6px; }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
`;

const MAIN_CSS = `
  .info, p.maly9, p.maly, div.chyba, hr, form { display: none !important; }
  
  .td-scroll-btn {
    position: fixed; top: 50%; transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.95); border: 1px solid #e2e8f0; border-radius: 50%;
    width: 40px; height: 40px; cursor: pointer; z-index: 999999;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); color: #334155; transition: all 0.2s ease; user-select: none;
  }
  .td-scroll-btn:hover { background: #ffffff; transform: translateY(-50%) scale(1.05); }
  .td-scroll-btn:active { transform: translateY(-50%) scale(0.95); }
  #td-scroll-left { left: 12px; }
  #td-scroll-right { right: 12px; }

  @media (max-width: 600px) {
    .td-scroll-btn { width: 36px; height: 36px; background: rgba(255, 255, 255, 0.85); }
    #td-scroll-left { left: 6px; }
    #td-scroll-right { right: 6px; }
  }
`;

const INJECTED_SCRIPT = `
  window.addEventListener('DOMContentLoaded', function() {
    var originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
       var resolvedUrl = new URL(url, document.baseURI).href;
       if (resolvedUrl.includes('ajax') || resolvedUrl.includes('vuz.php')) {
           var urlParams = new URLSearchParams(window.location.search);
           var finalUrl = resolvedUrl + (resolvedUrl.indexOf('?') !== -1 ? '&' : '?') + 'lang=' + (urlParams.get('lang') || 'de');
           
           var carMatch = resolvedUrl.match(/[?&]c=([^&]+)/);
           var carNum = carMatch ? carMatch[1] : null;
           
           window.parent.postMessage({ type: 'OPEN_MODAL', url: finalUrl, carNum: carNum }, '*');
           arguments[1] = 'data:text/plain,'; 
       } else if (resolvedUrl.indexOf('vagonweb.cz') !== -1) {
           arguments[1] = window.location.protocol + '//' + window.location.host + '/api/vagonwebProxy?proxyTarget=' + encodeURIComponent(resolvedUrl) + '&render=true';
       }
       return originalOpen.apply(this, arguments);
    };

    document.addEventListener('click', function(e) {
        var link = e.target.closest('a');
        if (link && (link.href.includes('fotogalerie') || link.href.includes('vuz.php') || link.href.includes('popisy'))) {
            e.preventDefault();
            e.stopPropagation();
            
            var urlObj = new URL(link.href, document.baseURI);
            var carNum = urlObj.searchParams.get('c'); 
            
            if (!carNum) {
                var td = link.closest('td') || link.closest('.vuz');
                var carEl = td ? td.querySelector('.cislo_vozu, .cislo_vozu_v, .cislo_vozu_m, .cislo') : null;
                carNum = carEl ? carEl.innerText.replace(/[^0-9a-zA-Z]/g, '') : null;
            }

            var lang = new URLSearchParams(window.location.search).get('lang') || 'de';
            urlObj.searchParams.set('lang', lang);
            
            window.parent.postMessage({ type: 'OPEN_MODAL', url: urlObj.href, carNum: carNum }, '*');
        }
    }, true);

    var showLink = Array.from(document.querySelectorAll('a')).find(el => 
      el.textContent.toLowerCase().includes('anzeigen') || 
      el.textContent.toLowerCase().includes('show') || 
      el.textContent.toLowerCase().includes('zobrazit')
    );
    if (!document.querySelector('table.vlacek') && showLink) {
       window.location.href = window.location.protocol + '//' + window.location.host + '/api/vagonwebProxy?proxyTarget=' + encodeURIComponent(showLink.href) + '&render=true';
       return;
    }

    var targetScroll = document.querySelector('table.vlacek') || document.querySelector('h4.color-z') || document.querySelector('#obsah_razeni');
    if (targetScroll) {
      setTimeout(function() {
        var topPosition = targetScroll.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: topPosition - 5, behavior: 'smooth' });
        setTimeout(function() { document.body.style.overflowY = 'hidden'; }, 800);
      }, 300);
    }

    var svgLeft = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>';
    var svgRight = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';

    var btnLeft = document.createElement('div'); btnLeft.id = 'td-scroll-left'; btnLeft.className = 'td-scroll-btn'; btnLeft.innerHTML = svgLeft;
    var btnRight = document.createElement('div'); btnRight.id = 'td-scroll-right'; btnRight.className = 'td-scroll-btn'; btnRight.innerHTML = svgRight;
    
    document.body.appendChild(btnLeft); document.body.appendChild(btnRight);
    var scrollContainer = document.querySelector('.overflow_x') || window;
    
    btnLeft.onclick = function() { var amount = window.innerWidth * 0.90; if (scrollContainer === window) window.scrollBy({ left: -amount, behavior: 'smooth' }); else scrollContainer.scrollBy({ left: -amount, behavior: 'smooth' }); };
    btnRight.onclick = function() { var amount = window.innerWidth * 0.90; if (scrollContainer === window) window.scrollBy({ left: amount, behavior: 'smooth' }); else scrollContainer.scrollBy({ left: amount, behavior: 'smooth' }); };
  });
`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const headers: Record<string, string> = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Accept-Language': 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7' };

  if (req.query.proxyTarget) {
    try {
      const response = await fetch(decodeURIComponent(req.query.proxyTarget as string), { headers });
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(await response.text());
    } catch { return res.status(500).send('AJAX Proxy failed'); }
  }

  const url = new URL('https://www.vagonweb.cz/razeni/vlak.php');
  const isRender = req.query.render === 'true';
  const isPopup = req.query.isPopup === 'true';

  for (const [key, value] of Object.entries(req.query)) {
    if (key !== 'render' && key !== 'proxyTarget' && key !== 'isPopup' && typeof value === 'string') {
      url.searchParams.append(key, value);
    }
  }

  if (isRender) headers['Referer'] = url.toString(); 

  try {
    const response = await fetch(url.toString(), { headers });
    let html = await response.text();

    // ====================================================================
    // DIE NUKLEAR-OPTION FÜR POPUPS: Bild serverseitig extrahieren!
    // ====================================================================
    if (isRender) {
      // WICHTIG: Das Popup MUSS die gleichen Stile und Scripts bekommen wie die Hauptansicht,
      // damit der Proxy-Mechanismus (XMLHttpRequest) auch im Popup aktiv bleibt!
      const activeCss = isPopup ? MAIN_CSS : MAIN_CSS; 
      html = html.replace('<head>', `<head><base href="https://www.vagonweb.cz/razeni/">\n<style>\n${INJECTED_CSS}\n${activeCss}\n</style>`);
      html += `\n<script>\n${INJECTED_SCRIPT}\n</script>`;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(html);
    }

    // Normales Processing für die Hauptansicht
    html = html.replace(/<script[^>]*cloudflare[^>]*>[\s\S]*?<\/script>/gi, '');
    html = html.replace(/<script[^>]*cdn-cgi[^>]*>[\s\S]*?<\/script>/gi, '');
    html = html.replace(/@font-face\s*\{[^}]*\}/gi, '');

    if (!isRender) {
      const isMissing = html.includes('Kein Zug gefunden') || html.includes('not found') || html.includes('nebyl nalezen');
      const hasOverviewLink = html.match(/>\s*(anzeigen|show|zobrazit)\s*<\/a>/i);
      const hasGraphics = html.includes('id="obsah_razeni"') || html.includes('class="vuz"') || html.includes('vlacek');

      if (!isMissing && (hasOverviewLink || hasGraphics)) {
        return res.status(200).json({ exists: true, directUrl: `/api/vagonwebProxy?${url.searchParams.toString()}&render=true` });
      }
      return res.status(200).json({ exists: false });
    }

    if (isRender && !isPopup) {
      html = html.replace('<head>', `<head><base href="https://www.vagonweb.cz/razeni/">\n<style>\n${INJECTED_CSS}\n${MAIN_CSS}\n</style>`);
      html += `\n<script>\n${INJECTED_SCRIPT}\n</script>`;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(html);
    }
  } catch (error: any) {
    return res.status(500).json({ exists: false, error: error.message });
  }
}