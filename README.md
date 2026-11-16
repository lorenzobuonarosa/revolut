# Revolut Italia – dataviz Radar QN

Dataviz interattive per l'articolo della sezione Radar di Quotidiano Nazionale su Revolut Italia. HTML, CSS e JavaScript vanilla con [D3 v7](https://d3js.org) da CDN: niente build, niente framework. Pubblicate con GitHub Pages dalla root di `main`.

Indice con anteprime e snippet da copiare: https://lorenzobuonarosa.github.io/revolut/

## Struttura

```
index.html            pagina indice con anteprime e snippet iframe
data/                 CSV sorgente (separatore ; e virgola decimale, UTF-8)
assets/radar.css      stile condiviso Radar
assets/radar.js       parsing CSV italiano, formati numerici it-IT, tooltip, animazioni, altezza iframe
clienti/  conti/  segnalazioni/  reclami/  timeline/
```

Ogni pagina carica il proprio CSV da `../data/` con `fetch`: per aggiornare un grafico basta modificare il CSV. In locale: `python3 -m http.server` dalla root della repo e poi http://localhost:8000/.

## Dataviz

### Clienti di Revolut in Italia

- URL: https://lorenzobuonarosa.github.io/revolut/clienti/
- Dati: data/clienti.csv
- Fonte: Revolut, Teleborsa, Milano Finanza, AFP
- Linea su asse temporale; punti vuoti = valori approssimati; annotazione sull'apertura della succursale (nov. 2024).

```html
<iframe src="https://lorenzobuonarosa.github.io/revolut/clienti/" width="100%" height="620" frameborder="0" scrolling="no" title="Clienti di Revolut in Italia"></iframe>
<script>
(function(){if(window.__radarQNv2)return;window.__radarQNv2=1;var O="https://lorenzobuonarosa.github.io";var MQ=window.matchMedia("(prefers-color-scheme:dark)");function frames(){return Array.prototype.filter.call(document.getElementsByTagName("iframe"),function(f){return(f.getAttribute("src")||"").indexOf(O+"/")===0;});}function theme(){var t=document.documentElement.getAttribute("data-theme");return t==="dark"||t==="light"?t:(MQ.matches?"dark":"light");}function bgOf(el){for(;el&&el.nodeType===1;el=el.parentElement){var c=getComputedStyle(el).backgroundColor;if(c&&c !=="transparent"&&!/rgba\([^)]*,\s*0\)$/.test(c))return c;}return null;}function send(f){try{f.contentWindow.postMessage({sentinel:"radar-qn",type:"theme",theme:theme(),bg:bgOf(f.parentElement)},O);}catch(e){}}function sendAll(){frames().forEach(send);}window.addEventListener("message",function(e){if(e.origin !==O)return;var d=e.data;if(!d||d.sentinel !=="radar-qn"||d.type !=="height")return;frames().forEach(function(f){if(f.contentWindow !==e.source)return;var h=Math.ceil(+d.height);if(h > 0&&20000 > h)f.style.height=h+"px";send(f);});});new MutationObserver(function(){sendAll();setTimeout(sendAll,400);}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});if(MQ.addEventListener)MQ.addEventListener("change",sendAll);})();
</script>
```

### I conti di Revolut Bank

- URL: https://lorenzobuonarosa.github.io/revolut/conti/
- Dati: data/conti.csv
- Fonte: Revolut Bank UAB, report finanziari
- Due pannelli a barre (depositi, utile netto); il 1° semestre 2026 è tratteggiato; totale attivo e patrimonio netto nel tooltip.

```html
<iframe src="https://lorenzobuonarosa.github.io/revolut/conti/" width="100%" height="600" frameborder="0" scrolling="no" title="I conti di Revolut Bank"></iframe>
<script>
(function(){if(window.__radarQNv2)return;window.__radarQNv2=1;var O="https://lorenzobuonarosa.github.io";var MQ=window.matchMedia("(prefers-color-scheme:dark)");function frames(){return Array.prototype.filter.call(document.getElementsByTagName("iframe"),function(f){return(f.getAttribute("src")||"").indexOf(O+"/")===0;});}function theme(){var t=document.documentElement.getAttribute("data-theme");return t==="dark"||t==="light"?t:(MQ.matches?"dark":"light");}function bgOf(el){for(;el&&el.nodeType===1;el=el.parentElement){var c=getComputedStyle(el).backgroundColor;if(c&&c !=="transparent"&&!/rgba\([^)]*,\s*0\)$/.test(c))return c;}return null;}function send(f){try{f.contentWindow.postMessage({sentinel:"radar-qn",type:"theme",theme:theme(),bg:bgOf(f.parentElement)},O);}catch(e){}}function sendAll(){frames().forEach(send);}window.addEventListener("message",function(e){if(e.origin !==O)return;var d=e.data;if(!d||d.sentinel !=="radar-qn"||d.type !=="height")return;frames().forEach(function(f){if(f.contentWindow !==e.source)return;var h=Math.ceil(+d.height);if(h > 0&&20000 > h)f.style.height=h+"px";send(f);});});new MutationObserver(function(){sendAll();setTimeout(sendAll,400);}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});if(MQ.addEventListener)MQ.addEventListener("change",sendAll);})();
</script>
```

### Segnalazioni di operazioni sospette alla UIF

- URL: https://lorenzobuonarosa.github.io/revolut/segnalazioni/
- Dati: data/sos-annuali.csv, data/sos-semestrali.csv
- Fonte: UIF, Rapporto annuale 2025 e Quaderno dell'antiriciclaggio, I semestre 2026
- Barre annuali 2019-2025 (dal 2022 divise tra Banche e Poste e altri segnalanti) e barre semestrali con il record del 1° semestre 2026; IMEL nel tooltip.

```html
<iframe src="https://lorenzobuonarosa.github.io/revolut/segnalazioni/" width="100%" height="840" frameborder="0" scrolling="no" title="Segnalazioni di operazioni sospette alla UIF"></iframe>
<script>
(function(){if(window.__radarQNv2)return;window.__radarQNv2=1;var O="https://lorenzobuonarosa.github.io";var MQ=window.matchMedia("(prefers-color-scheme:dark)");function frames(){return Array.prototype.filter.call(document.getElementsByTagName("iframe"),function(f){return(f.getAttribute("src")||"").indexOf(O+"/")===0;});}function theme(){var t=document.documentElement.getAttribute("data-theme");return t==="dark"||t==="light"?t:(MQ.matches?"dark":"light");}function bgOf(el){for(;el&&el.nodeType===1;el=el.parentElement){var c=getComputedStyle(el).backgroundColor;if(c&&c !=="transparent"&&!/rgba\([^)]*,\s*0\)$/.test(c))return c;}return null;}function send(f){try{f.contentWindow.postMessage({sentinel:"radar-qn",type:"theme",theme:theme(),bg:bgOf(f.parentElement)},O);}catch(e){}}function sendAll(){frames().forEach(send);}window.addEventListener("message",function(e){if(e.origin !==O)return;var d=e.data;if(!d||d.sentinel !=="radar-qn"||d.type !=="height")return;frames().forEach(function(f){if(f.contentWindow !==e.source)return;var h=Math.ceil(+d.height);if(h > 0&&20000 > h)f.style.height=h+"px";send(f);});});new MutationObserver(function(){sendAll();setTimeout(sendAll,400);}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});if(MQ.addEventListener)MQ.addEventListener("change",sendAll);})();
</script>
```

### I reclami ricevuti da Revolut Italia

- URL: https://lorenzobuonarosa.github.io/revolut/reclami/
- Dati: data/reclami-motivi.csv, data/reclami-esiti.csv
- Fonte: Revolut, Rendiconto sulla gestione dei reclami 2025
- Barre orizzontali per motivo e barra al 100% per esito.

```html
<iframe src="https://lorenzobuonarosa.github.io/revolut/reclami/" width="100%" height="820" frameborder="0" scrolling="no" title="I reclami ricevuti da Revolut Italia"></iframe>
<script>
(function(){if(window.__radarQNv2)return;window.__radarQNv2=1;var O="https://lorenzobuonarosa.github.io";var MQ=window.matchMedia("(prefers-color-scheme:dark)");function frames(){return Array.prototype.filter.call(document.getElementsByTagName("iframe"),function(f){return(f.getAttribute("src")||"").indexOf(O+"/")===0;});}function theme(){var t=document.documentElement.getAttribute("data-theme");return t==="dark"||t==="light"?t:(MQ.matches?"dark":"light");}function bgOf(el){for(;el&&el.nodeType===1;el=el.parentElement){var c=getComputedStyle(el).backgroundColor;if(c&&c !=="transparent"&&!/rgba\([^)]*,\s*0\)$/.test(c))return c;}return null;}function send(f){try{f.contentWindow.postMessage({sentinel:"radar-qn",type:"theme",theme:theme(),bg:bgOf(f.parentElement)},O);}catch(e){}}function sendAll(){frames().forEach(send);}window.addEventListener("message",function(e){if(e.origin !==O)return;var d=e.data;if(!d||d.sentinel !=="radar-qn"||d.type !=="height")return;frames().forEach(function(f){if(f.contentWindow !==e.source)return;var h=Math.ceil(+d.height);if(h > 0&&20000 > h)f.style.height=h+"px";send(f);});});new MutationObserver(function(){sendAll();setTimeout(sendAll,400);}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});if(MQ.addEventListener)MQ.addEventListener("change",sendAll);})();
</script>
```

### Timeline di Revolut in Italia

- URL: https://lorenzobuonarosa.github.io/revolut/timeline/
- Dati: —
- Fonte: Banca di Lituania, Bce, Agcm, Tribunale di Milano (via Ansa, Reuters), comunicati Revolut, Il Post, Il Sole 24 Ore, Sistema Penale
- Timeline interattiva "Revolut, dalla licenza lituana all'amministrazione giudiziaria" (file fornito dalla redazione, copiato senza modifiche): 20 eventi filtrabili per categoria.

```html
<iframe src="https://lorenzobuonarosa.github.io/revolut/timeline/" width="100%" height="520" frameborder="0" scrolling="no" title="Timeline di Revolut in Italia"></iframe>
<script>
(function(){if(window.__radarQNv2)return;window.__radarQNv2=1;var O="https://lorenzobuonarosa.github.io";var MQ=window.matchMedia("(prefers-color-scheme:dark)");function frames(){return Array.prototype.filter.call(document.getElementsByTagName("iframe"),function(f){return(f.getAttribute("src")||"").indexOf(O+"/")===0;});}function theme(){var t=document.documentElement.getAttribute("data-theme");return t==="dark"||t==="light"?t:(MQ.matches?"dark":"light");}function bgOf(el){for(;el&&el.nodeType===1;el=el.parentElement){var c=getComputedStyle(el).backgroundColor;if(c&&c !=="transparent"&&!/rgba\([^)]*,\s*0\)$/.test(c))return c;}return null;}function send(f){try{f.contentWindow.postMessage({sentinel:"radar-qn",type:"theme",theme:theme(),bg:bgOf(f.parentElement)},O);}catch(e){}}function sendAll(){frames().forEach(send);}window.addEventListener("message",function(e){if(e.origin !==O)return;var d=e.data;if(!d||d.sentinel !=="radar-qn"||d.type !=="height")return;frames().forEach(function(f){if(f.contentWindow !==e.source)return;var h=Math.ceil(+d.height);if(h > 0&&20000 > h)f.style.height=h+"px";send(f);});});new MutationObserver(function(){sendAll();setTimeout(sendAll,400);}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});if(MQ.addEventListener)MQ.addEventListener("change",sendAll);})();
</script>
```

## Altezza automatica e tema degli iframe

Ogni pagina, al caricamento e quando cambia dimensione, invia al CMS l'altezza del proprio contenuto:

```js
parent.postMessage({ sentinel: 'radar-qn', type: 'height', height: <altezza del contenuto> }, '*');
```

Lo script incluso negli snippet (versione leggibile in `assets/embed.js`):

- accetta solo messaggi da `https://lorenzobuonarosa.github.io` e aggiorna l'altezza dell'iframe che li ha inviati (con un tetto di sicurezza a 20.000 px);
- legge il tema del sito QN dall'attributo `data-theme` del tag `<html>` (se manca, dal tema del sistema) e il colore di sfondo del contenitore dell'iframe, e li manda a ogni dataviz con `{sentinel:'radar-qn', type:'theme', theme, bg}`;
- se il lettore cambia tema dal menu del sito, aggiorna subito tutte le dataviz.

Senza lo script le dataviz seguono il tema del sistema. Per forzarlo si può aggiungere `?theme=light` o `?theme=dark` all'URL dell'iframe.

## Note sui dati

- I numeri sono letti dai CSV e formattati in italiano (`d3.formatLocale`, punto per le migliaia e virgola per i decimali).
- Clienti: i punti di dicembre 2024 e luglio 2025 sono valori approssimati (campo Nota).
- Conti: il primo semestre 2026 non è confrontabile con gli anni interi per l'utile.
- Segnalazioni: "Altri segnalanti" = totale meno Banche e Poste; dal 2019 al 2021 il dettaglio non è disponibile.
- Reclami: totale dichiarato 1.992 (somma degli esiti); la somma dei motivi nel documento di Revolut è 1.962.
