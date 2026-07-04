import { t } from "../../libraries/i18n";
import { VARIANT_FEATURES } from "../../variants/registry";
import { onVariantLayoutReady } from "../preferences/variant-lifecycle";

const setupCursor = () => {
  const supportsFine = matchMedia("(pointer: fine)").matches;
  const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!supportsFine || prefersReduced) return;

  const root = document.documentElement;
  root.classList.add("use-custom-cursor");

  const cursor = document.createElement("div");
  cursor.className = "app-cursor";
  cursor.style.opacity = "0";
  document.body.appendChild(cursor);

  let x = 0,
    y = 0;
  let rafId = null;
  let initialized = false;

  function render() {
    rafId = null;
    cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    if (!initialized) {
      cursor.style.opacity = "1";
      initialized = true;
    }
  }

  function moveTo(nx, ny) {
    x = nx;
    y = ny;
    if (rafId == null) rafId = requestAnimationFrame(render);
  }

  function updateActive(target) {
    let isActive = false;
    let hasLabel = false;
    let label = "";

    if (target && target.closest) {
      const actionable = target.closest(
        "[data-cursor-label], a, button, [role='button'], [tabindex]",
      );
      if (actionable) {
        isActive = true;
        const custom = actionable.getAttribute && actionable.getAttribute("data-cursor-label");
        label = custom || (actionable.tagName === "A" ? t("buttons.open") : "");
        hasLabel = !!label;
      } else if (target.closest(".active")) {
        isActive = true;
      }
    }

    cursor.classList.toggle("is-active", isActive);
    cursor.classList.toggle("has-label", hasLabel);

    if (hasLabel) {
      cursor.setAttribute("data-label", label);
    } else {
      cursor.removeAttribute("data-label");
    }
  }

  const onPointerMove = (e) => {
    moveTo(e.clientX, e.clientY);
  };
  const onPointerEnter = (e) => {
    moveTo(e.clientX, e.clientY);
    cursor.style.opacity = "1";
  };
  const onPointerOver = (e) => {
    if (!initialized) moveTo(e.clientX, e.clientY);
    updateActive(e.target);
  };
  const onPointerOut = (e) => {
    updateActive(e.relatedTarget || document.body);
  };
  const onMouseMove = (e) => {
    if (!initialized) moveTo(e.clientX, e.clientY);
  };
  const onPointerLeave = () => {
    cursor.style.opacity = "0";
  };
  const onVisibilityChange = () => {
    if (document.visibilityState === "visible" && initialized) {
      cursor.style.opacity = "1";
    } else {
      cursor.style.opacity = "0";
    }
  };
  const onBlur = () => {
    cursor.style.opacity = "0";
  };
  const onFocus = () => {
    if (initialized) cursor.style.opacity = "1";
  };
  const onResize = () => {
    if (initialized) render();
  };

  document.addEventListener("pointermove", onPointerMove, { passive: true });
  document.addEventListener("pointerenter", onPointerEnter, { passive: true });

  // Обновляем активность при смене ховера
  document.addEventListener("pointerover", onPointerOver, { passive: true });
  document.addEventListener("pointerout", onPointerOut, { passive: true });
  document.addEventListener("mousemove", onMouseMove, { passive: true, once: true });
  document.addEventListener("pointerleave", onPointerLeave, { passive: true });
  document.addEventListener("visibilitychange", onVisibilityChange);

  window.addEventListener("blur", onBlur);
  window.addEventListener("focus", onFocus);
  window.addEventListener("resize", onResize);

  return () => {
    if (rafId != null) cancelAnimationFrame(rafId);
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerenter", onPointerEnter);
    document.removeEventListener("pointerover", onPointerOver);
    document.removeEventListener("pointerout", onPointerOut);
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("pointerleave", onPointerLeave);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    window.removeEventListener("blur", onBlur);
    window.removeEventListener("focus", onFocus);
    window.removeEventListener("resize", onResize);
    root.classList.remove("use-custom-cursor");
    cursor.remove();
  };
};

export const initCursor = () => {
  onVariantLayoutReady({
    feature: VARIANT_FEATURES.CURSOR,
    setup: setupCursor,
  });
};
