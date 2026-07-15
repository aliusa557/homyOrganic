function initHeroSlider() {
  const slider = document.querySelector("[data-hero-slider]");
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll("[data-slide]"));
  const track = slider.querySelector(".slider-track");
  const dotsContainer = slider.querySelector("[data-slider-dots]");
  const prevButton = slider.querySelector("[data-slider-prev]");
  const nextButton = slider.querySelector("[data-slider-next]");
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

  prevButton?.addEventListener("click", () => goToSlide(activeIndex - 1, true));
  nextButton?.addEventListener("click", () => goToSlide(activeIndex + 1, true));

  slider.addEventListener("mouseenter", stopAutoplay);
  slider.addEventListener("mouseleave", startAutoplay);

  let dragStartX = null;
  let dragDeltaX = 0;
  let isDragging = false;

  function dragStart(x) {
    isDragging = true;
    dragStartX = x;
    dragDeltaX = 0;
    stopAutoplay();
  }

  function dragMove(x) {
    if (!isDragging) return;
    dragDeltaX = x - dragStartX;
  }

  function dragEnd() {
    if (!isDragging) return;
    isDragging = false;

    const threshold = 50;
    if (dragDeltaX > threshold) {
      goToSlide(activeIndex - 1, true);
    } else if (dragDeltaX < -threshold) {
      goToSlide(activeIndex + 1, true);
    } else {
      startAutoplay();
    }

    dragDeltaX = 0;
  }

  slider.addEventListener("touchstart", event => dragStart(event.touches[0].clientX), { passive: true });
  slider.addEventListener("touchmove", event => dragMove(event.touches[0].clientX), { passive: true });
  slider.addEventListener("touchend", dragEnd);

  track?.addEventListener("mousedown", event => {
    event.preventDefault();
    dragStart(event.clientX);
  });
  window.addEventListener("mousemove", event => dragMove(event.clientX));
  window.addEventListener("mouseup", dragEnd);

  startAutoplay();
}
