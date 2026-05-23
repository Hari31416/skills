// quiz.js — knowledge-check quiz interaction for .quiz-container elements.

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initQuizzes);
} else {
  initQuizzes();
}

function initQuizzes() {
  document.querySelectorAll(".quiz-container").forEach((quiz) => {
    if (quiz.dataset.initialized) return;
    quiz.dataset.initialized = "true";

    const options = quiz.querySelectorAll(".quiz-option");
    const feedback = quiz.querySelector(".quiz-feedback");
    const allowRetry = quiz.dataset.allowRetry === "true";

    const resetQuiz = () => {
      delete quiz.dataset.completed;
      options.forEach((opt) => {
        opt.classList.remove(
          "is-disabled",
          "is-correct",
          "is-incorrect",
          "is-selected",
        );
      });
      const existingRetryBtn = quiz.querySelector(".quiz-retry-btn");
      if (existingRetryBtn) existingRetryBtn.remove();
      if (feedback) {
        feedback.classList.remove("is-visible", "is-correct", "is-incorrect");
        feedback
          .querySelectorAll("[data-feedback]")
          .forEach((el) => el.classList.remove("is-active"));
        const dynamicPrefix = feedback.querySelector("strong[data-dynamic]");
        if (dynamicPrefix) dynamicPrefix.remove();
      }
    };

    options.forEach((option) => {
      option.addEventListener("click", () => {
        if (quiz.dataset.completed) return;

        const isCorrect = option.dataset.correct === "true";

        quiz.dataset.completed = "true";
        options.forEach((opt) => {
          opt.classList.add("is-disabled");
          // Only reveal the correct answer if the player got it right,
          // or if there is no retry — avoids spoiling the answer on a wrong guess.
          if (opt.dataset.correct === "true" && (isCorrect || !allowRetry))
            opt.classList.add("is-correct");
          else if (opt === option && !isCorrect)
            opt.classList.add("is-incorrect");
        });

        if (feedback) {
          const correctMsg = feedback.querySelector(
            '[data-feedback="correct"]',
          );
          const incorrectMsg = feedback.querySelector(
            '[data-feedback="incorrect"]',
          );
          const generalMsg = feedback.querySelector(
            '[data-feedback="general"]',
          );

          if (correctMsg || incorrectMsg) {
            if (isCorrect && correctMsg) correctMsg.classList.add("is-active");
            else if (!isCorrect && incorrectMsg)
              incorrectMsg.classList.add("is-active");
            if (generalMsg) generalMsg.classList.add("is-active");
          } else {
            const resultPrefix = document.createElement("strong");
            resultPrefix.dataset.dynamic = "true";
            resultPrefix.textContent = isCorrect ? "Correct! " : "Incorrect. ";
            resultPrefix.style.color = isCorrect ? "#059669" : "#dc2626";
            feedback.prepend(resultPrefix);
          }

          if (!isCorrect) {
            quiz.classList.add("shake");
            setTimeout(() => quiz.classList.remove("shake"), 500);

            if (allowRetry) {
              const retryBtn = document.createElement("button");
              retryBtn.className = "quiz-retry-btn";
              retryBtn.textContent = "Try Again";
              retryBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                resetQuiz();
              });
              feedback.appendChild(retryBtn);
            }
          }

          feedback.classList.add("is-visible");
          feedback.classList.add(isCorrect ? "is-correct" : "is-incorrect");
        }
      });
    });
  });
}
