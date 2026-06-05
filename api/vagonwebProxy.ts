import type { VercelRequest, VercelResponse } from '@vercel/node';

const INJECTED_CSS = `
  #hlavicka, #hlavicka_respon, #horizmenu, #horizmenu_respon, #cesta3, #cesta4, #pravanavigace0, #zapati { display: none !important; }
  
  /* FIX: Komplettes Reset aller vagonWEB Hintergrund-Ebenen auf Weiß */
  body, html, #obalovydiv, .obsah, .clearboth, .overflow_x, .obsah_razeni { background: #55556d !important; background-color: #55556d !important; margin: 0; padding: 0; }
  body { padding: 10px 0 !important; }
  
  ::-webkit-scrollbar { width: 0px; height: 8px; }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
  
  /* FIX: Zug-Container in App-Blau zwingen */
  table.vlacek { background-color: #55556d !important; border-radius: 12px; padding: 8px; border: none !important; margin: 0 auto; }
  .vlak_zahlavi { background-color: #55556d !important; border-radius: 6px 6px 0 0; }
  
  /* FIX: Alle verbleibenden grünen Rahmen (Klassen wie .tab-, .vlak_trat) unsichtbar machen */
  .vlak_trat, [class^="tab-"], table.tab td, table.monitoring td { border-color: transparent !important; border-top-color: transparent !important; border-bottom-color: transparent !important; }
  
  /* Hover Farbe kräftiger machen */
  .bunka_vozu { cursor: pointer !important; transition: all 0.2s ease; border-bottom: 4px solid transparent; border-radius: 6px; }
  .bunka_vozu:hover { background-color: #00017a !important; border-bottom-color: #00017a !important; transform: translateY(-2px); }
  
  /* Kleine Symbole ausgrauen */
  a.colorbox, a.schem, a.fotog { pointer-events: none !important; opacity: 0.4 !important; }
`;

const MAIN_CSS = `
  .info, p.maly9, p.maly, div.chyba, hr, form { display: none !important; }
  
  .td-scroll-btn {
    position: fixed; top: 50%; transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.8); border-radius: 50%;
    width: 40px; height: 40px; cursor: pointer; z-index: 999999;
    display: flex; align-items: center; justify-content: center;
    color: rgb(59, 61, 255); transition: all 0.2s ease; user-select: none;
  }
  .td-scroll-btn:hover { background: #ffffff; transform: translateY(-50%) scale(1.05); }
  .td-scroll-btn:active { transform: translateY(-50%) scale(0.95); }
  #td-scroll-left { left: -10px; }
  #td-scroll-right { right: -10px; }
`;

const POPUP_CSS = `
  body { background: #f8fafc !important; margin: 0; padding: 16px; font-family: sans-serif; display: flex; justify-content: center; }
  #hlavicka, #menu, .drobecky, #levy, #paticka, .ads, .reklama, center { display: none !important; }
  #obsah, #pravy { width: 100% !important; margin: 0 !important; float: none !important; }
  img.plan { max-width: 100%; height: auto; display: block; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
  a { pointer-events: none; color: inherit; text-decoration: none; }
`;

const INJECTED_SCRIPT = `
  window.addEventListener('DOMContentLoaded', function() {
    var layouts = [];
    
    document.querySelectorAll('.bunka_vozu').forEach(function(vuz, index) {
        var link = vuz.querySelector('a[href*="vuz.php"]') || vuz.querySelector('a.colorbox') || vuz.querySelector('a.schem');
        
        var carNumEl = vuz.querySelector('.cislo_vozu, .cislo_vozu_v, .cislo_vozu_m, .cislo');
        var carNum = carNumEl ? (carNumEl.textContent || carNumEl.innerText).replace(/[^0-9a-zA-Z]/g, '') : null;
        
        if (link) {
            var urlObj = new URL(link.href, document.baseURI);
            if (!carNum) carNum = urlObj.searchParams.get('c'); 
            
            var lang = new URLSearchParams(window.location.search).get('lang') || 'de';
            urlObj.searchParams.set('lang', lang);
            layouts.push({ index: index, url: urlObj.href, carNum: carNum });
            
            vuz.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                window.parent.postMessage({ type: 'OPEN_MODAL_INDEX', index: index }, '*');
            });
        } else {
            layouts.push(null);
        }
    });
    
    window.parent.postMessage({ type: 'VAGON_LAYOUTS', layouts: layouts }, '*');

    var originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
       var resolvedUrl = new URL(url, document.baseURI).href;
       if (resolvedUrl.includes('ajax') || resolvedUrl.includes('vuz.php')) {
           var urlParams = new URLSearchParams(window.location.search);
           var finalUrl = resolvedUrl + (resolvedUrl.indexOf('?') !== -1 ? '&' : '?') + 'lang=' + (urlParams.get('lang') || 'de');
           
           var foundIdx = layouts.findIndex(l => l && l.url === finalUrl);
           if(foundIdx !== -1) {
               window.parent.postMessage({ type: 'OPEN_MODAL_INDEX', index: foundIdx }, '*');
           } else {
               var carMatch = resolvedUrl.match(/[?&]c=([^&]+)/);
               var carNum = carMatch ? carMatch[1] : null;
               window.parent.postMessage({ type: 'OPEN_MODAL', url: finalUrl, carNum: carNum }, '*');
           }
           arguments[1] = 'data:text/plain,'; 
       } else if (resolvedUrl.indexOf('vagonweb.cz') !== -1) {
           arguments[1] = window.location.protocol + '//' + window.location.host + '/api/vagonwebProxy?proxyTarget=' + encodeURIComponent(resolvedUrl) + '&render=true';
       }
       return originalOpen.apply(this, arguments);
    };

    document.addEventListener('click', function(e) {
        var link = e.target.closest('a');
        if (link && !link.classList.contains('obly_cudlik')) {
            e.preventDefault();
            e.stopPropagation();
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
        window.scrollTo({ top: topPosition + 10, behavior: 'smooth' });
        setTimeout(function() { document.body.style.overflowY = 'hidden'; }, 800);
      }, 300);
    }

    var svgLeft = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>';
    var svgRight = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';

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

  const isRender = req.query.render === 'true';
  const isPopup = req.query.isPopup === 'true';
  let html = '';

  try {
    if (req.query.proxyTarget) {
      const response = await fetch(decodeURIComponent(req.query.proxyTarget as string), { headers });
      html = await response.text();
    } else {
      const url = new URL('https://www.vagonweb.cz/razeni/vlak.php');
      for (const [key, value] of Object.entries(req.query)) {
        if (key !== 'render' && key !== 'proxyTarget' && key !== 'isPopup' && typeof value === 'string') {
          url.searchParams.append(key, value);
        }
      }
      if (isRender) headers['Referer'] = url.toString(); 
      const response = await fetch(url.toString(), { headers });
      html = await response.text();
    }
  } catch (error: any) {
     if (req.query.proxyTarget) return res.status(500).send('AJAX Proxy failed');
     return res.status(500).json({ exists: false, error: error.message });
  }

  if (isRender) {
    html = html.replace(/<script[\s\S]*?<\/script>/gi, '');
    
    if (isPopup) {
      html = html.replace('<head>', `<head><base href="https://www.vagonweb.cz/razeni/">\n<style>\n${POPUP_CSS}\n</style>`);
    } else {
      html = html.replace('<head>', `<head><base href="https://www.vagonweb.cz/razeni/">\n<style>\n${INJECTED_CSS}\n${MAIN_CSS}\n</style>`);
      html += `\n<script>\n${INJECTED_SCRIPT}\n</script>`;
    }
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  }

  html = html.replace(/<script[^>]*cloudflare[^>]*>[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<script[^>]*cdn-cgi[^>]*>[\s\S]*?<\/script>/gi, '');
  html = html.replace(/@font-face\s*\{[^}]*\}/gi, '');

  if (!req.query.proxyTarget) {
    const isMissing = html.includes('nicht gefunden') || html.includes('not found') || html.includes('nebyl nalezen');
    const hasOverviewLink = html.match(/>\s*(anzeigen|show|zobrazit)\s*<\/a>/i);
    const hasGraphics = html.includes('id="obsah_razeni"') || html.includes('class="bunka_vozu"') || html.includes('vlacek');

    if (!isMissing && (hasOverviewLink || hasGraphics)) {
       const urlParams = new URLSearchParams();
       for (const [key, value] of Object.entries(req.query)) {
          if (key !== 'render' && key !== 'proxyTarget' && key !== 'isPopup' && typeof value === 'string') {
            urlParams.append(key, value);
          }
       }
       return res.status(200).json({ exists: true, directUrl: `/api/vagonwebProxy?${urlParams.toString()}&render=true` });
    }
    return res.status(200).json({ exists: false });
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(html);
}