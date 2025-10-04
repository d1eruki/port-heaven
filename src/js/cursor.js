(function () {
  // Включаем только на устройствах с точным курсором
  const supportsFine = matchMedia("(pointer: fine)").matches;
  if (!supportsFine) return;

  document.documentElement.classList.add("use-custom-cursor");

  const cursor = document.createElement("div");
  cursor.className = "app-cursor";
  // Скрываем до первой инициализации позиции, чтобы не мигал в левом верхнем углу
  cursor.style.opacity = "0";
  document.body.appendChild(cursor);

  let x = 0,
    y = 0;
  let rafId = null;
  let initialized = false;

  function moveTo(nx, ny) {
    x = nx;
    y = ny;
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      cursor.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      cursor.style.opacity = "1";
      initialized = true;
      rafId = null;
    });
  }

  // Активность: делаем крупнее над .active и выводим текст внутри над ссылками/кнопками
  function updateActive(target) {
    let isActive = false;
    let hasLabel = false;
    let label = "";

    if (target && target.closest) {
      const actionable = target.closest("[data-cursor-label], a, button");
      if (actionable) {
        isActive = true;
        const custom = actionable.getAttribute && actionable.getAttribute("data-cursor-label");
        label = custom || (actionable.tagName === "A" ? "открыть" : "");
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

  // Используем pointer* чтобы покрыть разные девайсы с мышью
  document.addEventListener("pointermove", (e) => moveTo(e.clientX, e.clientY), { passive: true });
  // Ранняя инициализация позиции при первом наведении/входе указателя в окно
  document.addEventListener(
    "pointerenter",
    (e) => {
      if (!initialized) moveTo(e.clientX, e.clientY);
    },
    { passive: true },
  );
  document.addEventListener(
    "pointerover",
    (e) => {
      if (!initialized) moveTo(e.clientX, e.clientY);
      updateActive(e.target);
    },
    { passive: true },
  );
  document.addEventListener("pointerout", (e) => updateActive(e.relatedTarget || document.body), { passive: true });
  // Фолбэк: одноразово синхронизируем по mousemove, если по каким‑то причинам pointer* не сработали
  document.addEventListener(
    "mousemove",
    (e) => {
      if (!initialized) moveTo(e.clientX, e.clientY);
    },
    { passive: true, once: true },
  );

  // Скрывать при уходе курсора из окна
  document.addEventListener("mouseleave", () => {
    cursor.style.opacity = "0";
  });

  // На всякий случай прятать при скрытии вкладки
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") cursor.style.opacity = "0";
  });
})();
