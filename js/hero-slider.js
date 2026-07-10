function initHeroSlider() {
  const slider = document.querySelector("[data-hero-slider]");
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll("[data-slide]"));
  const dotsContainer = slider.querySelector("[data-slider-dots]");
  if (slides.length <= 1) return;

  let activeIndex = slides.findIndex(slide => slide.classList.contains("active"));
  if (activeIndex < 0) activeIndex = 0;

  const dots = slides.map((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "slider-dot" + (index === activeIndex ? " active" : "");
    dot.setAttribute("aria-label", `Show slide ${index + 1}`);
    dot.addEventListener("click", () => goToSlide(index, true));
    dotsContainer.appendChild(dot);
    return dot;
  });

  function goToSlide(index, userTriggered) {
    slides[activeIndex].classList.remove("active");
    dots[activeIndex].classList.remove("active");
    activeIndex = (index + slides.length) % slides.length;
    slides[activeIndex].classList.add("active");
    dots[activeIndex].classList.add("active");

    if (userTriggered) restartAutoplay();
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let autoplayTimer = null;

  function startAutoplay() {
    if (prefersReducedMotion) return;
    autoplayTimer = window.setInterval(() => goToSlide(activeIndex + 1, false), 5500);
  }

  function stopAutoplay() {
    window.clearInterval(autoplayTimer);
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  slider.addEventListener("mouseenter", stopAutoplay);
  slider.addEventListener("mouseleave", startAutoplay);
  slider.addEventListener("touchstart", stopAutoplay, { passive: true });

  startAutoplay();
}

document.addEventListener("DOMContentLoaded", initHeroSlider);
