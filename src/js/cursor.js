import { t } from "./i18n";

(function () {
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
      const actionable = target.closest("[data-cursor-label], a, button, [role='button'], [tabindex]");
      if (actionable) {
        isActive = true;
        const custom = actionable.getAttribute && actionable.getAttribute("data-cursor-label");
        label = custom || (actionable.tagName === "A" ? t("button-open") : "");
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
  document.addEventListener("pointermove", onPointerMove, { passive: true });

  document.addEventListener(
    "pointerenter",
    (e) => {
      moveTo(e.clientX, e.clientY);
      cursor.style.opacity = "1";
    },
    { passive: true },
  );

  // Обновляем активность при смене ховера
  document.addEventListener(
    "pointerover",
    (e) => {
      if (!initialized) moveTo(e.clientX, e.clientY);
      updateActive(e.target);
    },
    { passive: true },
  );

  document.addEventListener(
    "pointerout",
    (e) => {
      updateActive(e.relatedTarget || document.body);
    },
    { passive: true },
  );

  document.addEventListener(
    "mousemove",
    (e) => {
      if (!initialized) moveTo(e.clientX, e.clientY);
    },
    { passive: true, once: true },
  );

  document.addEventListener(
    "pointerleave",
    () => {
      cursor.style.opacity = "0";
    },
    { passive: true },
  );

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && initialized) {
      cursor.style.opacity = "1";
    } else {
      cursor.style.opacity = "0";
    }
  });

  window.addEventListener("blur", () => {
    cursor.style.opacity = "0";
  });
  window.addEventListener("focus", () => {
    if (initialized) cursor.style.opacity = "1";
  });

  window.addEventListener("resize", () => {
    if (initialized) render();
  });
})();
