import { onReady } from "../../utils/onReady";
import { initSectionDots } from "./section-dots/init-section-dots";

export const initSections = () => {
  const init = () => initSectionDots();

  onReady(init);
};
