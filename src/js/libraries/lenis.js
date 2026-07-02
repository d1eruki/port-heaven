import Lenis from "lenis";
import { setActiveLenis } from "./scroll-instance";

export const lenis = new Lenis({
  autoRaf: true,
  duration: 1.1,
});

setActiveLenis(lenis);

lenis.on("scroll", (e) => {
  const y = e?.scroll ?? lenis.scroll;
  window.dispatchEvent(new CustomEvent("lenis-scroll", { detail: { y, e } }));
});
