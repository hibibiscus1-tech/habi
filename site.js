/* HABI :B — shared sub-page behavior.
   Theme persists via localStorage('theme'), restored before paint by an
   inline snippet in each page's <head>. */
(() => {
  "use strict";

  const body = document.body;

  /* ---- theme toggle ---- */
  function setToggleGlyph() {
    document.querySelectorAll("[data-theme-toggle]").forEach((b) => {
      b.textContent = body.classList.contains("light") ? "☾" : "☀";
      b.setAttribute(
        "aria-label",
        body.classList.contains("light") ? "다크 모드" : "라이트 모드",
      );
    });
  }
  setToggleGlyph();
  document.querySelectorAll("[data-theme-toggle]").forEach((b) => {
    b.addEventListener("click", () => {
      body.classList.toggle("light");
      localStorage.setItem(
        "theme",
        body.classList.contains("light") ? "light" : "dark",
      );
      setToggleGlyph();
    });
  });

  /* ---- mobile nav ---- */
  const burger = document.querySelector(".nav-burger");
  const menu = document.querySelector(".nav-menu");
  if (burger && menu) {
    burger.addEventListener("click", () => menu.classList.toggle("open"));
  }

  /* ---- modals (open / close / ESC) ---- */
  function placeMask(m, e) {
    // Inside a SOOP-app iframe, .mask is position:absolute (fixed would anchor to the
    // huge iframe box). Pin it near the click / current scroll so it stays on screen.
    if (!body.classList.contains("embed")) return;
    var y = e && e.pageY ? e.pageY : (window.scrollY || 0) + 60;
    m.style.top = Math.max(10, y - 48) + "px";
  }
  window.__placeMask = placeMask;
  document.querySelectorAll("[data-open]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const m = document.getElementById(btn.dataset.open);
      if (!m) return;
      placeMask(m, e);
      m.classList.add("open");
    });
  });
  function closeMasks() {
    document.querySelectorAll(".mask.open").forEach((m) =>
      m.classList.remove("open"),
    );
  }
  document.querySelectorAll(".mask").forEach((mask) => {
    mask.addEventListener("click", (e) => {
      if (e.target === mask || e.target.closest("[data-close]")) closeMasks();
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMasks();
  });

  /* ---- toast ---- */
  window.showToast = (msg) => {
    let t = document.getElementById("toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(window.__toastT);
    window.__toastT = setTimeout(() => t.classList.remove("show"), 2200);
  };

  /* ---- inquiry submit (placeholder; wire to insertRow('inquiries',{message}) on deploy) ---- */
  const askForm = document.getElementById("askForm");
  if (askForm) {
    askForm.addEventListener("click", async (e) => {
      if (!e.target.closest("[data-send]")) return;
      const ta = document.getElementById("askText");
      const val = (ta.value || "").trim();
      if (!val) {
        window.showToast("내용을 입력해 주세요");
        return;
      }
      const ok =
        typeof insertRow === "function"
          ? await insertRow("inquiries", { message: val })
          : true;
      if (ok) {
        ta.value = "";
        closeMasks();
        window.showToast("문의가 전송되었습니다");
      } else {
        window.showToast("전송에 실패했어요. 잠시 후 다시 시도해 주세요");
      }
    });
  }

  /* ---- ready (FOUC release) ----
     Loaders call body.classList.add('ready') after data is applied, so the page
     never shows defaults then swaps. This timeout is only a fallback so a dead DB
     can't hide the page forever. */
  setTimeout(() => body.classList.add("ready"), 1200);
})();
