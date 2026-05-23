// base.js — always included. Handles copy-button behavior for code blocks.

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCodeCopyButtons);
} else {
  initCodeCopyButtons();
}

function initCodeCopyButtons() {
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    if (btn.dataset.copyInitialized) return;
    btn.dataset.copyInitialized = "true";

    btn.addEventListener("click", () => {
      const codeContainer = btn.closest(".code-container");
      if (!codeContainer) return;

      const codeBlock =
        codeContainer.querySelector("pre code") ||
        codeContainer.querySelector("pre");
      if (codeBlock) {
        navigator.clipboard
          .writeText(codeBlock.textContent)
          .then(() => {
            const originalText = btn.textContent;
            btn.textContent = "Copied!";
            btn.style.color = "#34d399";
            btn.style.borderColor = "#34d399";
            setTimeout(() => {
              btn.textContent = originalText;
              btn.style.color = "";
              btn.style.borderColor = "";
            }, 2000);
          })
          .catch((err) => console.error("Copy failed", err));
      }
    });
  });
}
