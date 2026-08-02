/* HABI :B — shared ambient FX. Dependency-free: floating marks + click burst.
   Used by cover and all sub-pages. Respects reduced-motion. */
(() => {
  "use strict";

  var FLOAT = ["\u2661", "\u273f", "\u00b7"]; /* heart, flower, dot */
  var CLICK = "\u2661";
  var COUNT = 14;

  var root = document.querySelector("#fx");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!root || reduce) return;

  var frag = document.createDocumentFragment();
  for (var i = 0; i < COUNT; i += 1) {
    var p = document.createElement("span");
    p.className = "fxfb";
    p.textContent = FLOAT[i % FLOAT.length];
    p.style.setProperty("--x", 4 + ((i * 13) % 92) + "%");
    p.style.setProperty("--delay", -((i * 1.7) % 16) + "s");
    p.style.setProperty("--duration", 14 + (i % 6) * 2 + "s");
    frag.appendChild(p);
  }
  root.appendChild(frag);

  /* click burst */
  document.addEventListener(
    "pointerdown",
    function (e) {
      if (e.target.closest("a,button,input,textarea,select,label")) return;
      for (var k = 0; k < 5; k += 1) {
        var s = document.createElement("span");
        s.textContent = CLICK;
        var ang = (Math.PI * 2 * k) / 5 + Math.random() * 0.6;
        var dist = 26 + Math.random() * 26;
        s.style.cssText =
          "position:fixed;left:" +
          e.clientX +
          "px;top:" +
          e.clientY +
          "px;z-index:80;pointer-events:none;color:var(--accent);" +
          "font-size:" +
          (11 + Math.random() * 8) +
          "px;transform:translate(-50%,-50%);opacity:1;" +
          "transition:transform .62s cubic-bezier(.2,.7,.3,1),opacity .62s ease";
        document.body.appendChild(s);
        (function (el, dx, dy) {
          requestAnimationFrame(function () {
            el.style.transform =
              "translate(calc(-50% + " +
              dx +
              "px),calc(-50% + " +
              dy +
              "px)) scale(.4)";
            el.style.opacity = "0";
          });
          setTimeout(function () {
            el.remove();
          }, 640);
        })(s, Math.cos(ang) * dist, Math.sin(ang) * dist - 10);
      }
    },
    { passive: true },
  );
})();
