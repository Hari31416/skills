// primitives.js — range-input value display wiring for .primitive-control elements.

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPrimitives);
} else {
  initPrimitives();
}

function initPrimitives() {
  document.querySelectorAll('input[type="range"]').forEach((range) => {
    if (range.dataset.initialized) return;
    range.dataset.initialized = "true";

    const valueDisplay = range
      .closest(".primitive-control")
      ?.querySelector(".primitive-value");
    if (valueDisplay) {
      range.addEventListener("input", () => {
        valueDisplay.textContent = range.value;
      });
    } else {
      console.warn(
        "[interactive-article] Range input missing a .primitive-value display. " +
          'Wrap it in .primitive-control containing a <span class="primitive-value">.',
        range,
      );
    }
  });
}
