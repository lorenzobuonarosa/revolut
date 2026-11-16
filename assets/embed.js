/* Radar – QN · script per la pagina ospite (CMS): altezza degli iframe e tema.
   Questo file è la versione leggibile dello snippet inline usato nel CMS. */
(function () {
  if (window.__radarQNv2) return;
  window.__radarQNv2 = 1;
  var O = "https://lorenzobuonarosa.github.io";
  var MQ = window.matchMedia("(prefers-color-scheme: dark)");

  function frames() {
    return Array.prototype.filter.call(document.getElementsByTagName("iframe"), function (f) {
      return (f.getAttribute("src") || "").indexOf(O + "/") === 0;
    });
  }
  // tema del sito QN: data-theme sul tag <html>; se manca, quello del sistema
  function theme() {
    var t = document.documentElement.getAttribute("data-theme");
    return t === "dark" || t === "light" ? t : (MQ.matches ? "dark" : "light");
  }
  // primo sfondo non trasparente risalendo dall'iframe
  function bgOf(el) {
    for (; el && el.nodeType === 1; el = el.parentElement) {
      var c = getComputedStyle(el).backgroundColor;
      if (c && c !== "transparent" && !/rgba\([^)]*,\s*0\)$/.test(c)) return c;
    }
    return null;
  }
  function send(f) {
    try { f.contentWindow.postMessage({ sentinel: "radar-qn", type: "theme", theme: theme(), bg: bgOf(f.parentElement) }, O); } catch (e) {}
  }
  function sendAll() { frames().forEach(send); }

  window.addEventListener("message", function (e) {
    if (e.origin !== O) return;
    var d = e.data;
    if (!d || d.sentinel !== "radar-qn" || d.type !== "height") return;
    frames().forEach(function (f) {
      if (f.contentWindow !== e.source) return;
      var h = Math.ceil(+d.height);
      if (h > 0 && 20000 > h) f.style.height = h + "px";   // limite di sicurezza
      send(f);                                             // il primo messaggio fa anche da handshake
    });
  });
  // cambio di tema sul sito (data-theme) o nel sistema
  new MutationObserver(function () { sendAll(); setTimeout(sendAll, 400); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  if (MQ.addEventListener) MQ.addEventListener("change", sendAll);
})();
