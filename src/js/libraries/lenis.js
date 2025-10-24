import Lenis from "lenis";

export const lenis = new Lenis({
  autoRaf: true,
  duration: 1.1, // плавность правь по вкусу
  // smoothWheel: true, // включи если надо
});

window.lenis = lenis;

lenis.on("scroll", (e) => {
  const y = e && typeof e.scroll === "number" ? e.scroll : lenis.scroll;
  window.dispatchEvent(new CustomEvent("lenis-scroll", { detail: { y } }));
});

document.addEventListener("scroll-to-top", () => {
  lenis.scrollTo(0);
});

// ---- ПРОГРЕСС-БАР ---------------------------------------------
import { updateProgressBar } from "../custom/progress-bar";

window.addEventListener("lenis-scroll", (e) => {
  try {
    updateProgressBar(e.detail.y);
  } catch {
    updateProgressBar();
  }
});

// ---- ПАРАЛЛАКС: hero -> about --------------------------------
const hero = document.getElementById("hero");
const heroMedia = hero?.querySelector(".hero-media");
const about = document.getElementById("about");

if (hero && heroMedia && about) {
  //const HERO_SHIFT_PX = 120;
  const HERO_SHIFT_PX = 420;
  //const ABOUT_SHIFT_PX = 660;

  let heroTop = 0;
  let heroH = 0;
  let vh = window.innerHeight;

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function recalc() {
    const rect = hero.getBoundingClientRect();
    heroTop = window.scrollY + rect.top;
    heroH = hero.offsetHeight;
    vh = window.innerHeight;
  }

  recalc();
  addEventListener("resize", recalc, { passive: true });

  function updateParallax(e) {
    const scroll = e && typeof e.scroll === "number" ? e.scroll : lenis.scroll;

    const distanceIntoView = scroll + vh - heroTop;
    const total = vh + heroH;
    const t = clamp(total ? distanceIntoView / total : 0, 0, 1);

    const heroY = -t * HERO_SHIFT_PX;
    heroMedia.style.transform = `translate3d(0, ${heroY}px, 0)`;

    // const aboutY = -t * ABOUT_SHIFT_PX;
    // //about.style.transform = `translate3d(0, ${aboutY}px, 0)`;
    // about.style.transform = `translate3d(0, 0, 0)`;
  }

  lenis.on("scroll", updateParallax);

  updateParallax({ scroll: window.scrollY });
}
