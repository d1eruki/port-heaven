import Lenis from "lenis";

export const lenis = new Lenis({
  autoRaf: true,
  //smoothWheel: true,
});

window.lenis = lenis;

document.addEventListener("scroll-to-top", () => {
  lenis.scrollTo(0);
});

lenis.on("scroll", () => {
  window.dispatchEvent(new CustomEvent("lenis-scroll", { detail: { y: lenis.scroll } }));
});
