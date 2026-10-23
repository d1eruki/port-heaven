import { onReady } from "../../utils/on-ready";
import { initSectionDots } from "./section-dots/init-section-dots";

export const initSections = () => {
  const init = () => initSectionDots();

  onReady(init);
};
