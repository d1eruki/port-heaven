import Lenis from "lenis";
import { setActiveLenis } from "./scroll-instance";

export const lenis = new Lenis({
  autoRaf: true,
  duration: 1.1,
});

setActiveLenis(lenis);
