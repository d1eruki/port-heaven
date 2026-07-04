import "./style.css";

import { applyInitialTheme } from "./js/features/preferences/theme-toggle";
import { applyInitialVariant } from "./js/features/preferences/variant-toggle";

applyInitialTheme();
applyInitialVariant();

import "./js/libraries/vue";
import "./js/libraries/yandex-metrika";
import { initFeatures } from "./js/app/init-features";

initFeatures();
