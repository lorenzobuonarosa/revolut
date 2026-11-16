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
(function(){if(window.__radarQN)return;window.__radarQN=1;window.addEventListener("message",function(e){if(e.origin!=="https://lorenzobuonarosa.github.io")return;var d=e.data;if(!d||d.sentinel!=="radar-qn"||d.type!=="height")return;var f=document.getElementsByTagName("iframe");for(var i=0;i<f.length;i++){if(f[i].contentWindow===e.source){f[i].style.height=Math.ceil(d.height)+"px";}}});})();
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
(function(){if(window.__radarQN)return;window.__radarQN=1;window.addEventListener("message",function(e){if(e.origin!=="https://lorenzobuonarosa.github.io")return;var d=e.data;if(!d||d.sentinel!=="radar-qn"||d.type!=="height")return;var f=document.getElementsByTagName("iframe");for(var i=0;i<f.length;i++){if(f[i].contentWindow===e.source){f[i].style.height=Math.ceil(d.height)+"px";}}});})();
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
(function(){if(window.__radarQN)return;window.__radarQN=1;window.addEventListener("message",function(e){if(e.origin!=="https://lorenzobuonarosa.github.io")return;var d=e.data;if(!d||d.sentinel!=="radar-qn"||d.type!=="height")return;var f=document.getElementsByTagName("iframe");for(var i=0;i<f.length;i++){if(f[i].contentWindow===e.source){f[i].style.height=Math.ceil(d.height)+"px";}}});})();
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
(function(){if(window.__radarQN)return;window.__radarQN=1;window.addEventListener("message",function(e){if(e.origin!=="https://lorenzobuonarosa.github.io")return;var d=e.data;if(!d||d.sentinel!=="radar-qn"||d.type!=="height")return;var f=document.getElementsByTagName("iframe");for(var i=0;i<f.length;i++){if(f[i].contentWindow===e.source){f[i].style.height=Math.ceil(d.height)+"px";}}});})();
</script>
```

### Timeline di Revolut in Italia

- URL: https://lorenzobuonarosa.github.io/revolut/timeline/
- Dati: —
- Fonte: Revolut
- Timeline interattiva (file fornito dalla redazione).

```html
<iframe src="https://lorenzobuonarosa.github.io/revolut/timeline/" width="100%" height="520" frameborder="0" scrolling="no" title="Timeline di Revolut in Italia"></iframe>
<script>
(function(){if(window.__radarQN)return;window.__radarQN=1;window.addEventListener("message",function(e){if(e.origin!=="https://lorenzobuonarosa.github.io")return;var d=e.data;if(!d||d.sentinel!=="radar-qn"||d.type!=="height")return;var f=document.getElementsByTagName("iframe");for(var i=0;i<f.length;i++){if(f[i].contentWindow===e.source){f[i].style.height=Math.ceil(d.height)+"px";}}});})();
</script>
```

## Altezza automatica degli iframe

Ogni pagina, al caricamento e a ogni ridimensionamento, invia al CMS:

```js
parent.postMessage({ sentinel: 'radar-qn', type: 'height', height: <altezza del contenuto> }, '*');
```

Lo script incluso negli snippet ascolta il messaggio, accetta solo l'origine `https://lorenzobuonarosa.github.io` e aggiorna l'altezza dell'iframe che lo ha inviato. Si può incollare una volta per pagina: se è presente più volte non registra due ascoltatori.

## Note sui dati

- I numeri sono letti dai CSV e formattati in italiano (`d3.formatLocale`, punto per le migliaia e virgola per i decimali).
- Clienti: i punti di dicembre 2024 e luglio 2025 sono valori approssimati (campo Nota).
- Conti: il primo semestre 2026 non è confrontabile con gli anni interi per l'utile.
- Segnalazioni: "Altri segnalanti" = totale meno Banche e Poste; dal 2019 al 2021 il dettaglio non è disponibile.
- Reclami: totale dichiarato 1.992 (somma degli esiti); la somma dei motivi nel documento di Revolut è 1.962.
