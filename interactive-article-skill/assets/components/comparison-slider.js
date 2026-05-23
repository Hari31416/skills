// comparison-slider.js — drag-handle image comparison for .comparison-container elements.

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initComparisonSliders);
} else {
  initComparisonSliders();
}

function initComparisonSliders() {
  document.querySelectorAll(".comparison-container").forEach((container) => {
    if (container.dataset.initialized) return;
    container.dataset.initialized = "true";

    const after = container.querySelector(".comparison-after");
    const handle = container.querySelector(".comparison-handle");
    let isResizing = false;

    const setPosition = (x) => {
      const rect = container.getBoundingClientRect();
      let position = ((x - rect.left) / rect.width) * 100;
      if (position < 0) position = 0;
      if (position > 100) position = 100;
      after.style.width = `${position}%`;
      handle.style.left = `${position}%`;
    };

    const onMove = (e) => {
      if (!isResizing) return;
      const x = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
      setPosition(x);
    };

    const startResizing = () => (isResizing = true);
    const stopResizing = () => (isResizing = false);

    handle.addEventListener("mousedown", startResizing);
    handle.addEventListener("touchstart", startResizing);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("mouseup", stopResizing);
    window.addEventListener("touchend", stopResizing);
  });
}
