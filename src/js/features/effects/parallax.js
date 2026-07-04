import { getScrollY, onScroll, clamp } from "../../utils/scroll";
import { VARIANT_FEATURES } from "../../variants/registry";
import { onVariantLayoutReady } from "../preferences/variant-lifecycle";

const setupParallax = () => {
  const elements = document.querySelectorAll('[class*="scroll-speed-"]');
  if (!elements.length) return;

  const items = Array.from(elements)
    .map((el) => {
      const classList = Array.from(el.classList);
      const speedClass = classList.find((c) => c.startsWith("scroll-speed-"));
      if (!speedClass) return null;

      const rawValue = speedClass.replace("scroll-speed-", "");
      let speed;
      if (rawValue.startsWith("--")) {
        speed = -(parseFloat(rawValue.replace("--", "")) / 100);
      } else {
        speed = parseFloat(rawValue) / 100;
      }

      const anchor = el.getAttribute("data-parallax-anchor") || "center";
      const scaleFactor = parseFloat(el.getAttribute("data-parallax-scale")) || 0;

      const rect = el.getBoundingClientRect();
      const initialY = rect.top + getScrollY();

      return { el, speed, initialY, anchor, scaleFactor };
    })
    .filter(Boolean);

  const update = () => {
    const scroll = getScrollY();
    items.forEach(({ el, speed, initialY, anchor, scaleFactor }) => {
      let offset;

      if (anchor === "top") {
        // Отсчет от начала страницы (идеально для Hero)
        offset = scroll * speed;
      } else {
        // Отсчет от прохождения центра вьюпорта (для контента в середине)
        offset = (scroll - (initialY - window.innerHeight / 2)) * speed;
      }

      el.style.setProperty("--parallax-offset", `${offset}px`);

      if (scaleFactor) {
        const targetScale = clamp(1 + scroll * scaleFactor, 0.5, 2);
        el.style.setProperty("--parallax-scale", String(targetScale));
      }
    });
  };

  update();
  const offScroll = onScroll(update);

  const onResize = () => {
    items.forEach((item) => {
      item.el.style.setProperty("--parallax-offset", "0px");
      const rect = item.el.getBoundingClientRect();
      item.initialY = rect.top + getScrollY();
    });
    update();
  };

  window.addEventListener("resize", onResize);

  return () => {
    if (typeof offScroll === "function") offScroll();
    window.removeEventListener("resize", onResize);
    items.forEach((item) => {
      item.el.style.removeProperty("--parallax-offset");
      item.el.style.removeProperty("--parallax-scale");
    });
  };
};

export const initParallax = () =>
  onVariantLayoutReady({
    feature: VARIANT_FEATURES.PARALLAX,
    setup: setupParallax,
  });
