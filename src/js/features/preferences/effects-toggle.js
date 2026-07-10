import { readStorageValue, saveStorageValue } from "../../utils/storage";

const root = document.documentElement;
const EFFECTS_STORAGE_KEY = "effects-mode";
const DEFAULT_EFFECTS_MODE = "auto";
const isSupportedEffectsMode = (mode) => mode === "auto" || mode === "on" || mode === "off";

export const readSavedEffectsMode = () =>
  readStorageValue({
    key: EFFECTS_STORAGE_KEY,
    fallback: DEFAULT_EFFECTS_MODE,
    isValid: isSupportedEffectsMode,
  });

export const saveEffectsMode = (mode) =>
  saveStorageValue({
    key: EFFECTS_STORAGE_KEY,
    value: mode,
    isValid: isSupportedEffectsMode,
  });

export const applyEffectsMode = ({ hwOn, motionOn }) => {
  const mode = readSavedEffectsMode();
  const effectsOn = mode === "on" || (mode === "auto" && hwOn && motionOn);

  root.dataset.effectsMode = mode;
  root.classList.toggle("effects", effectsOn);
  root.classList.toggle("no-effects", !effectsOn);

  return { effectsOn, mode };
};

export const toggleEffectsMode = () => {
  const nextMode = root.classList.contains("effects") ? "off" : "on";
  saveEffectsMode(nextMode);
  return nextMode;
};
