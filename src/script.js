import "./style.css";

import { initFeatures } from "./js/app/init-features";
import { applyInitialTheme } from "./js/features/preferences/theme-toggle";
import { mountApp } from "./js/libraries/vue";

applyInitialTheme();
mountApp();
initFeatures();
