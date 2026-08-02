(() => {
  "use strict";

  const monthGrid = document.querySelector(".month-grid");
  const modeButtons = document.querySelectorAll("[data-schedule-mode]");

  if (monthGrid) {
    monthGrid.innerHTML = Array.from({ length: 31 }, (_, index) => {
      const day = index + 1;
      const isOff = [8, 16, 24, 31].includes(day);
      const label = String(day).padStart(2, "0");
      return `<span class="${isOff ? "is-off" : ""}"><b>${label}</b><i>${isOff ? "OFF" : "18"}</i></span>`;
    }).join("");
  }

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const monthMode = button.dataset.scheduleMode === "month";
      document.body.classList.toggle("schedule-month", monthMode);
      modeButtons.forEach((item) => {
        item.classList.toggle(
          "is-selected",
          item.dataset.scheduleMode === (monthMode ? "month" : "week"),
        );
      });
    });
  });

  document.body.classList.add("ready");
  window.setTimeout(() => document.body.classList.add("ready"), 1600);
})();
