const STORAGE_KEY = "effects-scroll-position";
const SECTION_SELECTOR = "[data-section]";

const readStoredPosition = () => {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
};

const findViewportSection = () => {
  const viewportCenter = window.innerHeight / 2;

  return Array.from(document.querySelectorAll(SECTION_SELECTOR)).find((section) => {
    const bounds = section.getBoundingClientRect();
    return bounds.top <= viewportCenter && bounds.bottom >= viewportCenter;
  });
};

const waitForStableLayout = async () => {
  await new Promise(requestAnimationFrame);
  await document.fonts?.ready?.catch(() => {});
  await new Promise(requestAnimationFrame);
};

export const hasPendingEffectsScrollPosition = () => Boolean(readStoredPosition());

export const captureEffectsScrollPosition = () => {
  const section = findViewportSection();
  if (!section?.id) return;

  const distance = section.offsetHeight - window.innerHeight;
  const progress = distance > 0 ? -section.getBoundingClientRect().top / distance : 0;

  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ sectionId: section.id, progress: Math.max(0, Math.min(1, progress)) }),
    );
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  } catch {
    // Native scroll restoration remains the fallback when session storage is unavailable.
  }
};

export const restoreEffectsScrollPosition = async () => {
  const position = readStoredPosition();
  if (!position) return;

  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // The stored value can expire naturally when session storage is unavailable.
  }

  await waitForStableLayout();

  const section = document.getElementById(position.sectionId);
  if (section && Number.isFinite(position.progress)) {
    const distance = Math.max(0, section.offsetHeight - window.innerHeight);
    window.scrollTo(0, section.offsetTop + distance * position.progress);
  }

  if ("scrollRestoration" in history) history.scrollRestoration = "auto";
};
