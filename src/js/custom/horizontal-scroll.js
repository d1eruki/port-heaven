import { lenis } from "../libraries/lenis";

const initHorizontalScroll = () => {
  const section = document.getElementById("design");
  const inner = document.getElementById("design-inner");
  if (!section || !inner) return;

  const isMobile = () => window.innerWidth < 1024;

  const update = () => {
    if (isMobile()) {
      inner.style.transform = "none";
      inner.children[0].style.transform = "none";
      section.style.height = "auto";
      inner.style.position = "relative";
      inner.style.overflowX = "auto";
      return;
    }

    section.style.height = "400dvh";
    inner.style.position = "sticky";
    inner.style.overflowX = "hidden";
    inner.style.display = "grid";

    const sectionHeight = section.offsetHeight;
    const viewportHeight = window.innerHeight;
    const innerWidth = inner.scrollWidth;
    const viewportWidth = window.innerWidth;

    const start = section.offsetTop;
    const scroll = lenis.scroll;

    let progress = (scroll - start) / (sectionHeight - viewportHeight);
    progress = Math.max(0, Math.min(1, progress));

    const maxTranslate = innerWidth - viewportWidth;
    const translateX = -progress * maxTranslate;

    inner.style.transform = `translateX(${translateX}px)`;
  };

  update();
  lenis.on("scroll", update);
  window.addEventListener("resize", update);
};

if (document.readyState === "complete") {
  initHorizontalScroll();
} else {
  window.addEventListener("load", initHorizontalScroll);
}
