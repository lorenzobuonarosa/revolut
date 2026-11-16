/* Radar – Quotidiano Nazionale · funzioni condivise per le dataviz (D3 v7) */
(function () {
  "use strict";

  // ---------- Tema (chiaro/scuro) e sfondo ----------
  // Ordine: ?theme= nell'URL > messaggio della pagina ospite > prefers-color-scheme.
  // La pagina ospite (script nel CMS) invia {sentinel:'radar-qn', type:'theme', theme, bg}.
  var root = document.documentElement;
  var qs = new URLSearchParams(location.search);
  var urlTheme = /^(light|dark)$/.test(qs.get("theme") || "") ? qs.get("theme") : null;
  var msgTheme = null;
  var darkMQ = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  var SAFE_COLOR = /^(#[0-9a-f]{3,8}|rgba?\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(,\s*[\d.]+\s*)?\))$/i;
  function applyTheme() {
    var t = urlTheme || msgTheme || (darkMQ && darkMQ.matches ? "dark" : "light");
    if (root.getAttribute("data-theme") !== t) root.setAttribute("data-theme", t);
  }
  function applyBg(bg) {
    if (bg && SAFE_COLOR.test(String(bg).trim())) root.style.setProperty("--bg", String(bg).trim());
    else root.style.removeProperty("--bg");
  }
  applyTheme();
  if (darkMQ && darkMQ.addEventListener) darkMQ.addEventListener("change", applyTheme);
  window.addEventListener("message", function (e) {
    var d = e.data;
    if (!d || typeof d !== "object" || d.sentinel !== "radar-qn" || d.type !== "theme") return;
    msgTheme = d.theme === "dark" || d.theme === "light" ? d.theme : null;
    applyTheme();
    applyBg(d.bg);
  });

  // ---------- Formati numerici italiani ----------
  var locale = d3.formatLocale({
    decimal: ",",
    thousands: ".",
    grouping: [3],
    currency: ["", " €"],
    percent: "%",
    minus: "−"
  });
  var timeLocale = d3.timeFormatLocale({
    dateTime: "%A %e %B %Y, %X",
    date: "%d/%m/%Y",
    time: "%H:%M:%S",
    periods: ["AM", "PM"],
    days: ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"],
    shortDays: ["dom", "lun", "mar", "mer", "gio", "ven", "sab"],
    months: ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"],
    shortMonths: ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"]
  });

  /** fmt(n, decimali): numero all'italiana con decimali fissi */
  function fmt(n, dec) {
    if (n == null || isNaN(n)) return "–";
    return locale.format(",." + (dec || 0) + "f")(n);
  }
  function pct(share, dec) {
    return fmt(share * 100, dec == null ? 1 : dec) + "%";
  }

  // ---------- CSV italiano: separatore ; e virgola decimale ----------
  function splitRow(line) {
    var out = [], cur = "", q = false;
    for (var i = 0; i < line.length; i++) {
      var c = line[i];
      if (c === '"') { q = !q; cur += c; }
      else if (c === ";" && !q) { out.push(cur); cur = ""; }
      else cur += c;
    }
    out.push(cur);
    return out.map(function (f) {
      f = f.trim();
      // campo interamente tra virgolette: tolgo le virgolette esterne
      var m = /^"((?:[^"]|"")*)"$/.exec(f);
      return m ? m[1].replace(/""/g, '"') : f;
    });
  }
  function parseCSV(text) {
    var lines = text.replace(/^﻿/, "").split(/\r?\n/).filter(function (l) { return l.trim() !== ""; });
    var head = splitRow(lines[0]);
    return lines.slice(1).map(function (l) {
      var cells = splitRow(l), row = {};
      head.forEach(function (h, i) { row[h] = cells[i] == null ? "" : cells[i]; });
      return row;
    });
  }
  /** "1.234,5" -> 1234.5 ; "" -> null */
  function num(s) {
    if (s == null) return null;
    s = String(s).trim();
    if (s === "") return null;
    var v = +s.replace(/\./g, "").replace(",", ".");
    return isNaN(v) ? null : v;
  }
  function loadCSV(url) {
    return fetch(url, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error("CSV non trovato: " + url);
      return r.text();
    }).then(parseCSV);
  }

  // ---------- Ambiente ----------
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var DUR = reduced ? 0 : 750;
  var EASE = d3.easeCubicOut;
  function isNarrow(w) { return w < 520; }

  // ---------- Altezza iframe ----------
  function postHeight() {
    var el = document.querySelector(".radar") || document.body;
    var cs = getComputedStyle(document.body);
    var h = Math.ceil(el.getBoundingClientRect().height + parseFloat(cs.marginTop) + parseFloat(cs.marginBottom));
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ sentinel: "radar-qn", type: "height", height: h }, "*");
    }
  }
  var heightTimer;
  function scheduleHeight() { clearTimeout(heightTimer); heightTimer = setTimeout(postHeight, 60); }
  window.addEventListener("load", postHeight);
  window.addEventListener("resize", scheduleHeight);
  if (window.ResizeObserver) {
    document.addEventListener("DOMContentLoaded", function () {
      new ResizeObserver(scheduleHeight).observe(document.querySelector(".radar") || document.body);
    });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleHeight);

  // ---------- Primo ingresso nel viewport ----------
  function onFirstView(el, cb) {
    if (reduced || !("IntersectionObserver" in window)) { cb(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { io.disconnect(); cb(); }
      });
    }, { threshold: 0.25 });
    io.observe(el);
  }

  /**
   * Ridisegna al cambio di larghezza. draw(width, phase) con phase:
   *  "pre"    -> elementi nello stato iniziale (prima dell'ingresso nel viewport)
   *  "play"   -> animazione d'ingresso dallo stato iniziale a quello finale
   *  "static" -> stato finale senza animazione (resize, reduced motion)
   */
  function responsive(container, draw) {
    var node = typeof container === "string" ? document.querySelector(container) : container;
    var lastW = 0, played = reduced;
    function render(phase) {
      var w = Math.floor(node.getBoundingClientRect().width);
      if (!w) return;
      lastW = w;
      draw(w, phase);
      scheduleHeight();
    }
    render(played ? "static" : "pre");
    if (!played) onFirstView(node, function () { played = true; render("play"); });
    var t;
    window.addEventListener("resize", function () {
      clearTimeout(t);
      t = setTimeout(function () {
        var w = Math.floor(node.getBoundingClientRect().width);
        if (w !== lastW) render(played ? "static" : "pre");
      }, 120);
    });
  }

  /** Applica stato iniziale/finale secondo la fase (vedi responsive) */
  function enter(sel, phase, initial, final, delay) {
    if (phase === "static") { final(sel); return sel; }
    initial(sel);
    if (phase === "play") {
      var tr = sel.transition().duration(DUR).ease(EASE);
      if (delay) tr.delay(delay);
      final(tr);
    }
    return sel;
  }

  /** Conta da 0 al valore finale in un elemento HTML o SVG text */
  function countUp(sel, value, format, phase, delay) {
    if (phase === "static" || !DUR) { sel.text(format(value)); return; }
    if (phase === "pre") { sel.text(format(0)); return; }
    var dur = DUR;
    sel.transition().delay(delay || 0).duration(dur).ease(EASE).tween("text", function () {
      var node = this, i = d3.interpolateNumber(0, value);
      return function (t) { node.textContent = format(i(t)); };
    });
  }

  // ---------- Tooltip ----------
  function tooltip(container) {
    var host = d3.select(container);
    var tip = host.append("div").attr("class", "r-tip").attr("role", "status").attr("aria-live", "polite");
    function show(html, x, y) {
      tip.html(html).classed("is-on", true);
      var W = host.node().getBoundingClientRect().width;
      var tw = tip.node().offsetWidth, th = tip.node().offsetHeight;
      var left = x + 14;
      if (left + tw > W) left = x - tw - 14;
      if (left < 0) left = Math.max(0, Math.min(W - tw, x - tw / 2));
      var top = y - th - 12;
      if (top < -8) top = y + 16;
      tip.style("transform", "translate(" + Math.round(left) + "px," + Math.round(top) + "px)");
    }
    function hide() { tip.classed("is-on", false); }
    return { show: show, hide: hide, node: tip.node() };
  }
  /** html del tooltip: titolo in grassetto, valore grande, righe extra, nota */
  function tipHTML(o) {
    var h = '<div class="r-tip__t">' + o.title + "</div>";
    if (o.value != null) h += '<div class="r-tip__v">' + o.value + (o.unit ? " <small>" + o.unit + "</small>" : "") + "</div>";
    if (o.rows && o.rows.length) {
      h += '<div class="r-tip__rows">' + o.rows.map(function (r) {
        return '<div class="r-tip__row"><span>' + r[0] + "</span><b>" + r[1] + "</b></div>";
      }).join("") + "</div>";
    }
    if (o.note) h += '<div class="r-tip__note">' + o.note + "</div>";
    return h;
  }
  /** chiude i tooltip quando si tocca fuori dal grafico (mobile) */
  function dismissOutside(container, fn) {
    document.addEventListener("pointerdown", function (e) {
      if (!container.contains(e.target)) fn();
    });
  }

  // ---------- Testo SVG a capo ----------
  function wrap(textSel, width, lineHeight) {
    lineHeight = lineHeight || 1.35;
    textSel.each(function () {
      var text = d3.select(this);
      var words = text.text().split(/\s+/).reverse();
      var x = text.attr("x") || 0, y = text.attr("y") || 0, dy = parseFloat(text.attr("dy") || 0);
      var fs = parseFloat(getComputedStyle(this).fontSize) || 13;
      text.text(null);
      var line = [], n = 0, word;
      var tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "px");
      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width && line.length > 1) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          n++;
          tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", (dy + n * fs * lineHeight) + "px").text(word);
        }
      }
      text.attr("data-lines", n + 1);
    });
    return textSel;
  }

  /** Path di una barra verticale con angoli superiori smussati (r) */
  function barPathV(x, y, w, h, r) {
    if (h <= 0 || w <= 0) return "M" + x + "," + (y + h) + "h" + w + "v0h" + (-w) + "Z";
    r = Math.min(r, w / 2, h);
    return "M" + x + "," + (y + h) +
      "V" + (y + r) + "Q" + x + "," + y + " " + (x + r) + "," + y +
      "H" + (x + w - r) + "Q" + (x + w) + "," + y + " " + (x + w) + "," + (y + r) +
      "V" + (y + h) + "Z";
  }
  /** Path di una barra orizzontale con angoli destri smussati */
  function barPathH(x, y, w, h, r) {
    if (w <= 0) return "M" + x + "," + y + "h0v" + h + "h0Z";
    r = Math.min(r, h / 2, w);
    return "M" + x + "," + y +
      "H" + (x + w - r) + "Q" + (x + w) + "," + y + " " + (x + w) + "," + (y + r) +
      "V" + (y + h - r) + "Q" + (x + w) + "," + (y + h) + " " + (x + w - r) + "," + (y + h) +
      "H" + x + "Z";
  }

  /** Mostra un errore leggibile se il CSV non si carica */
  function fail(container, err) {
    d3.select(container).append("p").attr("class", "r-note").text("Dati non disponibili. " + (err && err.message ? err.message : ""));
    scheduleHeight();
    if (window.console) console.error(err);
  }

  window.Radar = {
    locale: locale, timeLocale: timeLocale, fmt: fmt, pct: pct,
    num: num, parseCSV: parseCSV, loadCSV: loadCSV,
    reduced: reduced, DUR: DUR, EASE: EASE, isNarrow: isNarrow,
    postHeight: postHeight, scheduleHeight: scheduleHeight,
    onFirstView: onFirstView, responsive: responsive, enter: enter, countUp: countUp,
    tooltip: tooltip, tipHTML: tipHTML, dismissOutside: dismissOutside,
    wrap: wrap, barPathV: barPathV, barPathH: barPathH, fail: fail
  };
})();
