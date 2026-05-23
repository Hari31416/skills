// comparison-tabs.js — tab switcher for .comparison-tabs elements.

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initComparisonTabs);
} else {
  initComparisonTabs();
}

function initComparisonTabs() {
  document.querySelectorAll(".comparison-tabs").forEach((container) => {
    if (container.dataset.initialized) return;
    container.dataset.initialized = "true";

    const btns = container.querySelectorAll(".comparison-tab-btn");
    const panels = container.querySelectorAll(".comparison-tab-panel");

    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.tab;
        btns.forEach((b) => b.classList.remove("is-active"));
        panels.forEach((p) => p.classList.remove("is-active"));
        btn.classList.add("is-active");
        const targetPanel = container.querySelector(`[data-panel="${target}"]`);
        if (targetPanel) targetPanel.classList.add("is-active");
      });
    });
  });
}
