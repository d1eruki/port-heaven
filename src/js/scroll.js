document.addEventListener("DOMContentLoaded", function () {
  const scrollIcon = document.querySelector("#scroll-to-top, [data-scroll-to-top]");
  const sections = Array.from(document.querySelectorAll("[data-section]"));

  function scrollToElement(targetEl) {
    const top = targetEl.offsetTop;
    window.scrollTo({ top, behavior: "smooth" });
    return top;
  }

  if (scrollIcon) {
    scrollIcon.style.display = "none";

    function toggleScrollButton() {
      scrollIcon.style.display = window.scrollY > 300 ? "block" : "none";
    }

    scrollIcon.addEventListener("click", () => {
      document.documentElement.scrollIntoView({ behavior: "smooth" });
    });

    window.addEventListener("scroll", toggleScrollButton);
    toggleScrollButton();
  }

  if (sections.length) {
    let wheelLock = false;
    const threshold = 4;
    const unlockDelay = 700;

    function currentIndex() {
      const cx = Math.floor(window.innerWidth / 2);
      const cy = Math.floor(window.innerHeight / 2);
      let el = document.elementFromPoint(cx, cy);
      while (el && el !== document.body && !el.hasAttribute?.("data-section")) {
        el = el.parentElement;
      }
      if (el && el.hasAttribute && el.hasAttribute("data-section")) {
        const idx = sections.indexOf(el);
        if (idx !== -1) return idx;
      }
      const y = window.scrollY;
      let idx = 0;
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop <= y + 1) idx = i;
      }
      return idx;
    }

    function atSectionBoundary(sec) {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const top = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      const atTop = Math.abs(y - top) <= 1;
      const atBottom = Math.abs(y + vh - bottom) <= 1;
      return { atTop, atBottom };
    }

    function onWheel(e) {
      const dy = e.deltaY || 0;
      if (Math.abs(dy) < threshold) return;

      if (wheelLock) {
        e.preventDefault();
        return;
      }

      const cur = currentIndex();
      const sec = sections[cur];
      const isTall = sec.offsetHeight > window.innerHeight + 1;

      if (isTall) {
        const { atTop, atBottom } = atSectionBoundary(sec);
        if ((dy < 0 && !atTop) || (dy > 0 && !atBottom)) {
          return;
        }
      }

      let target = cur + (dy > 0 ? 1 : -1);
      target = Math.max(0, Math.min(sections.length - 1, target));
      if (target === cur) return;

      e.preventDefault();
      wheelLock = true;
      scrollToElement(sections[target]);
      setTimeout(() => (wheelLock = false), unlockDelay);
    }

    // Включаем авто-скролл только на экранах >= 64rem
    const mq = window.matchMedia("(min-width: 64rem)");
    let isBound = false;
    function bindWheel() {
      if (!isBound) {
        window.addEventListener("wheel", onWheel, { passive: false });
        isBound = true;
      }
    }
    function unbindWheel() {
      if (isBound) {
        window.removeEventListener("wheel", onWheel, { passive: false });
        isBound = false;
      }
    }

    if (mq.matches) bindWheel();
    mq.addEventListener?.("change", (e) => {
      if (e.matches) bindWheel();
      else unbindWheel();
    });
  }
});
