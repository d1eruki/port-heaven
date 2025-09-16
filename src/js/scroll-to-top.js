document.addEventListener("DOMContentLoaded", () => {
  const scrollIcon = document.querySelector("#scroll-to-top, [data-scroll-to-top]");
  if (!scrollIcon) return;

  // Initially hidden until user scrolls down
  scrollIcon.style.display = "none";

  function toggleScrollButton() {
    scrollIcon.style.display = window.scrollY > 300 ? "block" : "none";
  }

  function scrollToTop(e) {
    e?.preventDefault?.();
    // Respect reduced motion if user prefers it
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      window.scrollTo({ top: 0 });
    } else {
      document.documentElement.scrollIntoView({ behavior: "smooth" });
    }
  }

  scrollIcon.addEventListener("click", scrollToTop);
  window.addEventListener("scroll", toggleScrollButton, { passive: true });
  toggleScrollButton();
});
