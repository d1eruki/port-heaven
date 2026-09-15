import { computed } from "vue";
import { useValidatedStorage } from "./storage";

const DEV_MODE_STORAGE_KEY = "dev-mode";
const DEFAULT_DEV_MODE = "off";
const isSupportedDevMode = (mode) => mode === "on" || mode === "off";
const devMode = useValidatedStorage({
  key: DEV_MODE_STORAGE_KEY,
  fallback: DEFAULT_DEV_MODE,
  isValid: isSupportedDevMode,
});

export const devModeEnabled = computed(() => devMode.value === "on");

export const toggleDevMode = () => {
  const nextMode = devModeEnabled.value ? "off" : "on";
  devMode.value = nextMode;
  return nextMode;
};
