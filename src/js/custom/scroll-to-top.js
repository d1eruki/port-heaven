document.addEventListener("DOMContentLoaded", () => {
  const scrollIcon = document.querySelector("#scroll-to-top, [data-scroll-to-top]");
  if (!scrollIcon) return;

  function scrollToTop(e) {
    e?.preventDefault?.();
    document.dispatchEvent(new CustomEvent("scroll-to-top"));
  }

  scrollIcon.addEventListener("click", scrollToTop);
});
