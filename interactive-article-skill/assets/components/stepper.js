// stepper.js — multi-step walkthrough interaction for .stepper elements.

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSteppers);
} else {
  initSteppers();
}

function initSteppers() {
  document.querySelectorAll(".stepper").forEach((stepper) => {
    if (stepper.dataset.initialized) return;
    stepper.dataset.initialized = "true";

    const steps = stepper.querySelectorAll(".stepper-step");
    const dots = stepper.querySelectorAll(".stepper-dot");
    const prevBtn = stepper.querySelector(".stepper-btn.is-prev");
    const nextBtn = stepper.querySelector(".stepper-btn.is-next");

    // Auto-inject step counter into the header
    const header = stepper.querySelector(".stepper-header");
    let counter = null;
    if (header && steps.length > 0) {
      counter = document.createElement("span");
      counter.className = "stepper-counter";
      header.appendChild(counter);
    }

    let currentStep = 0;

    const updateStepper = () => {
      steps.forEach((step, i) =>
        step.classList.toggle("is-active", i === currentStep),
      );
      dots.forEach((dot, i) =>
        dot.classList.toggle("is-active", i === currentStep),
      );
      if (prevBtn) prevBtn.disabled = currentStep === 0;
      if (nextBtn) nextBtn.disabled = currentStep === steps.length - 1;
      if (counter)
        counter.textContent = `Step ${currentStep + 1} of ${steps.length}`;
    };

    if (prevBtn)
      prevBtn.addEventListener("click", () => {
        if (currentStep > 0) {
          currentStep--;
          updateStepper();
        }
      });

    if (nextBtn)
      nextBtn.addEventListener("click", () => {
        if (currentStep < steps.length - 1) {
          currentStep++;
          updateStepper();
        }
      });

    updateStepper();
  });
}
