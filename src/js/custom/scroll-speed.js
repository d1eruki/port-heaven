import { lenis } from "../libraries/lenis";
import { initOnLoad } from "../utils/scroll";

const initScrollSpeed = () => {
  const elements = document.querySelectorAll('[class*="scroll-speed-"]');
  if (!elements.length) return;

  const items = Array.from(elements)
    .map((el) => {
      const classList = Array.from(el.classList);
      const speedClass = classList.find((c) => c.startsWith("scroll-speed-"));
      if (!speedClass) return null;

      const rawValue = speedClass.replace("scroll-speed-", "");
      let speed = 0;
      if (rawValue.startsWith("--")) {
        speed = -(parseFloat(rawValue.replace("--", "")) / 100);
      } else {
        speed = parseFloat(rawValue) / 100;
      }

      const rect = el.getBoundingClientRect();
      const initialY = rect.top + window.scrollY;

      return { el, speed, initialY };
    })
    .filter(Boolean);

  const update = () => {
    const scroll = lenis.scroll;
    items.forEach(({ el, speed, initialY }) => {
      const offset = (scroll - (initialY - window.innerHeight / 2)) * speed;
      el.style.setProperty("--scroll-offset", `${offset}px`);
    });
  };

  update();
  lenis.on("scroll", update);
  window.addEventListener("resize", () => {
    items.forEach((item) => {
      item.el.style.setProperty("--scroll-offset", "0px");
      const rect = item.el.getBoundingClientRect();
      item.initialY = rect.top + window.scrollY;
    });
    update();
  });
};

initOnLoad(initScrollSpeed);
