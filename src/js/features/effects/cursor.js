import { t } from "../../libraries/i18n";
import { finePointer } from "../preferences/motion";
import { effectsEnabled } from "../preferences/effects-toggle";

export const initCursor = () => {
  if (!finePointer.value || !effectsEnabled.value) return;

  const controller = new AbortController();
  const listen = (target, event, handler, options = {}) =>
    target.addEventListener(event, handler, { ...options, signal: controller.signal });
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
  listen(document, "pointermove", onPointerMove, { passive: true });

  listen(document, 
    "pointerenter",
    (e) => {
      moveTo(e.clientX, e.clientY);
      cursor.style.opacity = "1";
    },
    { passive: true },
  );

  // Обновляем активность при смене ховера
  listen(document, 
    "pointerover",
    (e) => {
      if (!initialized) moveTo(e.clientX, e.clientY);
      updateActive(e.target);
    },
    { passive: true },
  );

  listen(document, 
    "pointerout",
    (e) => {
      updateActive(e.relatedTarget || document.body);
    },
    { passive: true },
  );

  listen(document, 
    "mousemove",
    (e) => {
      if (!initialized) moveTo(e.clientX, e.clientY);
    },
    { passive: true, once: true },
  );

  listen(document, 
    "pointerleave",
    () => {
      cursor.style.opacity = "0";
    },
    { passive: true },
  );

  listen(document, "visibilitychange", () => {
    if (document.visibilityState === "visible" && initialized) {
      cursor.style.opacity = "1";
    } else {
      cursor.style.opacity = "0";
    }
  });

  listen(window, "blur", () => {
    cursor.style.opacity = "0";
  });
  listen(window, "focus", () => {
    if (initialized) cursor.style.opacity = "1";
  });

  listen(window, "resize", () => {
    if (initialized) render();
  });

  return () => {
    controller.abort();
    if (rafId !== null) cancelAnimationFrame(rafId);
    cursor.remove();
    root.classList.remove("use-custom-cursor");
  };
};
