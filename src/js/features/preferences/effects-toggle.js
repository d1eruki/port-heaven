import { shallowRef } from "vue";
import { useValidatedStorage } from "./storage";

const root = document.documentElement;
const EFFECTS_STORAGE_KEY = "effects-mode";
const DEFAULT_EFFECTS_MODE = "auto";
const isSupportedEffectsMode = (mode) => mode === "auto" || mode === "on" || mode === "off";
const effectsMode = useValidatedStorage({
  key: EFFECTS_STORAGE_KEY,
  fallback: DEFAULT_EFFECTS_MODE,
  isValid: isSupportedEffectsMode,
});

export const effectsEnabled = shallowRef(false);

export const applyEffectsMode = ({ gpuCapable, motionAllowed }) => {
  const mode = effectsMode.value;
  const effectsOn = mode === "on" || (mode === "auto" && gpuCapable && motionAllowed);

  effectsEnabled.value = effectsOn;
  root.dataset.effectsMode = mode;
  root.classList.toggle("effects", effectsOn);
  root.classList.toggle("no-effects", !effectsOn);

  return { effectsOn, mode };
};

export const toggleEffectsMode = () => {
  const nextMode = effectsEnabled.value ? "off" : "on";
  effectsMode.value = nextMode;
  return nextMode;
};
