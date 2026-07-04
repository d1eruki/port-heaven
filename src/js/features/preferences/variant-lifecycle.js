import { initOnLoad } from "../../utils/scroll";
import { BASE_VARIANT, variantHasFeature } from "../../variants/registry";

const root = document.documentElement;

const normalizeList = (value) => {
  if (!value) return null;
  return Array.isArray(value) ? value : [value];
};

export const getActiveVariant = () => root.getAttribute("data-variant") || BASE_VARIANT;

export const matchesVariant = (
  variant,
  { variants = null, exclude = null, feature = null } = {},
) => {
  const allowed = normalizeList(variants);
  const excluded = normalizeList(exclude);
  const features = normalizeList(feature);

  if (excluded?.includes(variant)) return false;
  if (features && !features.some((item) => variantHasFeature(variant, item))) return false;

  return !allowed || allowed.includes(variant);
};

export const onVariantLayoutReady = ({
  variants = null,
  exclude = null,
  feature = null,
  setup,
  cleanup,
}) => {
  let activeCleanup = null;
  let isListening = false;

  const teardown = () => {
    if (typeof activeCleanup === "function") activeCleanup();
    activeCleanup = null;
    if (typeof cleanup === "function") cleanup();
  };

  const runSetup = (variant = getActiveVariant()) => {
    teardown();
    if (!matchesVariant(variant, { variants, exclude, feature })) return;

    const result = setup?.({ variant });
    if (typeof result === "function") activeCleanup = result;
  };

  const onWillChange = () => teardown();
  const onLayoutReady = ({ detail }) => {
    requestAnimationFrame(() => runSetup(detail?.variant));
  };

  initOnLoad(() => {
    if (isListening) return;
    isListening = true;

    runSetup();

    window.addEventListener("variant:will-change", onWillChange);
    window.addEventListener("variant:layout-ready", onLayoutReady);
  });

  return () => {
    teardown();
    if (!isListening) return;
    window.removeEventListener("variant:will-change", onWillChange);
    window.removeEventListener("variant:layout-ready", onLayoutReady);
    isListening = false;
  };
};
