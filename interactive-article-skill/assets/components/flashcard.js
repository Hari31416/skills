// flashcard.js — flip-card interaction for .flashcard elements.

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFlashcards);
} else {
  initFlashcards();
}

function initFlashcards() {
  document.querySelectorAll(".flashcard").forEach((card) => {
    if (card.dataset.initialized) return;
    card.dataset.initialized = "true";
    card.addEventListener("click", () => card.classList.toggle("is-flipped"));
  });
}
