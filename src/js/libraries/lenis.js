import Lenis from "lenis";

export const lenis = new Lenis({
  autoRaf: true,
  duration: 1.1,
});

window.lenis = lenis;

lenis.on("scroll", (e) => {
  const y = e?.scroll ?? lenis.scroll;
  window.dispatchEvent(new CustomEvent("lenis-scroll", { detail: { y, e } }));
});
