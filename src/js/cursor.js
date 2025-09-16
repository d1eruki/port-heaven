(function () {
  // Включаем только на устройствах с точным курсором
  const supportsFine = matchMedia("(pointer: fine)").matches;
  if (!supportsFine) return;

  document.documentElement.classList.add("use-custom-cursor");

  const cursor = document.createElement("div");
  cursor.className = "app-cursor";
  document.body.appendChild(cursor);

  let x = 0,
    y = 0;
  let rafId = null;

  function moveTo(nx, ny) {
    x = nx;
    y = ny;
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      cursor.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      cursor.style.opacity = "1";
      rafId = null;
    });
  }

  // Активность: делаем крупнее над .active и над ссылками <a>
  function updateActive(target) {
    const isActive = !!(
      target &&
      target.closest &&
      (target.closest(".active") || target.closest("a"))
    );
    cursor.classList.toggle("is-active", isActive);
  }

  // Используем pointer* чтобы покрыть разные девайсы с мышью
  document.addEventListener("pointermove", (e) => moveTo(e.clientX, e.clientY), { passive: true });
  document.addEventListener("pointerover", (e) => updateActive(e.target), { passive: true });
  document.addEventListener("pointerout", (e) => updateActive(e.relatedTarget || document.body), { passive: true });

  // Скрывать при уходе курсора из окна
  document.addEventListener("mouseleave", () => {
    cursor.style.opacity = "0";
  });

  // На всякий случай прятать при скрытии вкладки
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") cursor.style.opacity = "0";
  });
})();
