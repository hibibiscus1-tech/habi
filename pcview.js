/* pcview.js — PC view for the SOOP in-app browser (?pc=1)
   The app webview can't render nested iframes and resets its own zoom, so a wide
   viewport meta doesn't take there. Instead, when ?pc=1 is present:
     1. drop our own mobile media rules so the desktop rules win
     2. lay the document out at DESIGN px
     3. shrink it with a CSS transform (no webview zoom reset can undo it)
   Load order: right after the stylesheets, before the page scripts.
   Class names below are HABI's (.wrap, .nav, .covnav, .showcase, .scene, #fx). */

(function () {
  var DESIGN = 1180;
  if (location.search.indexOf("pc=1") === -1) return;

  document.documentElement.setAttribute("data-pc", "1");

  var mv = document.querySelector('meta[name="viewport"]');
  if (mv) mv.setAttribute("content", "width=device-width, initial-scale=1");

  function stripMobileRules(sheet) {
    var rules;
    try { rules = sheet.cssRules; } catch (e) { return; }
    if (!rules) return;
    for (var i = rules.length - 1; i >= 0; i--) {
      var r = rules[i];
      if (r.type === 4) {
        var t = r.conditionText || (r.media && r.media.mediaText) || "";
        var m = /max-width:\s*(\d+)px/.exec(t);
        if (m && parseInt(m[1], 10) <= DESIGN) {
          try { sheet.deleteRule(i); } catch (e) {}
        }
      }
    }
  }

  /* vw/vh don't follow a CSS transform: restate the few size rules that need it, in DESIGN px */
  function injectOverrides() {
    if (document.getElementById("pcview-css")) return;
    if (!document.head) return;
    var css =
      "body.pcview .wrap { margin-left: auto; margin-right: auto; }" +
      "body.pcview .nav, body.pcview .covnav { position: absolute; }" +
      "body.pcview #fx { position: absolute; }" +
      "body.pcview .showcase, body.pcview .concept { height: 664px !important; min-height: 0 !important; aspect-ratio: auto !important; }" +
      "body.pcview .scene { height: 664px !important; }";
    var st = document.createElement("style");
    st.id = "pcview-css";
    st.textContent = css;
    document.head.appendChild(st);
  }

  /* Capture width before the body is widened: once the document overflows, mobile
     browsers grow the layout viewport, and reading innerWidth again feeds that growth
     back into the scale (measured ~1089 instead of 375 -> almost no shrink). */
  var BASE = (function () {
    var sw = (window.screen && window.screen.width) || 0;
    var iw = window.innerWidth || document.documentElement.clientWidth || 0;
    if (sw && iw) return Math.min(sw, iw);
    return sw || iw || DESIGN;
  })();

  function scale() { return BASE / DESIGN; }

  function place() {
    if (!document.body) return;
    var s = scale();
    document.documentElement.style.overflowX = "hidden";
    document.documentElement.style.width = BASE + "px";
    document.body.style.width = DESIGN + "px";
    document.body.style.transformOrigin = "0 0";
    document.body.style.transform = "scale(" + s + ")";
    sizeDocument();
  }

  function sizeDocument() {
    if (!document.body) return;
    var s = scale();
    var anchor = document.querySelector("footer") || document.querySelector(".showcase");
    var h = anchor
      ? Math.ceil(anchor.getBoundingClientRect().bottom / s + window.scrollY / s)
      : document.body.scrollHeight;
    document.documentElement.style.height = Math.ceil(h * s) + "px";
  }

  function apply() {
    injectOverrides();
    for (var i = 0; i < document.styleSheets.length; i++) stripMobileRules(document.styleSheets[i]);
    if (document.body) document.body.classList.add("pcview");
    place();
  }

  apply();
  document.addEventListener("DOMContentLoaded", apply);
  window.addEventListener("load", function () {
    apply();
    [300, 900, 2000].forEach(function (t) { setTimeout(sizeDocument, t); });
    if (window.ResizeObserver && document.body) new ResizeObserver(sizeDocument).observe(document.body);
  });
  window.addEventListener("resize", function () {
    var sw = (window.screen && window.screen.width) || 0;
    if (sw) BASE = sw;
    place();
  });
})();
