import "./style.css";

import { initFeatures } from "./js/app/init-features";
import { applyInitialTheme } from "./js/features/preferences/theme-toggle";
import { mountApp } from "./js/libraries/vue";

applyInitialTheme();

const startApp = async () => {
  try {
    await Promise.all([
      document.fonts.load('300 16px "Bounded"'),
      document.fonts.load('900 16px "Bounded"'),
    ]);
  } catch (error) {
    console.warn("Bounded could not be loaded; starting with the fallback font.", error);
  }

  mountApp();
  initFeatures();
};

void startApp();
