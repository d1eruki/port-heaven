document.addEventListener("DOMContentLoaded", function () {
  const scrollIcon = document.querySelector("#scroll-to-top, [data-scroll-to-top]");
  const sections = Array.from(document.querySelectorAll("[data-section]"));

  // Keep the existing scroll-to-top button behavior untouched
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
    // Pure JS section flipping with strict direction and inertia suppression
    const EPS = 3; // boundary epsilon (2–4 px)
    const DELTA_THRESHOLD = 2; // ignore tiny deltas/noise

    let isProgrammatic = false; // we're running a smooth scroll we initiated
    let wheelLock = false; // general lock to avoid rapid flips
    let quietTimer = null; // extra 200ms quiet period after scroll stops
    let endWatchRAF = 0; // rAF id for stable scrollY sentinel
    let lastY = 0;
    let stableFrames = 0;

    const QUIET_MS = 200; // "тихая пауза"
    const MAX_LOCK_MS = 800; // upper bound for total lock duration

    function currentIndex() {
      // Determine current section by viewport center, fallback to scrollY positions
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

    function isScrollable(el) {
      if (!(el instanceof Element)) return false;
      const style = getComputedStyle(el);
      const canScrollY = /auto|scroll|overlay/.test(style.overflowY);
      return canScrollY && el.scrollHeight > el.clientHeight;
    }

    function canScrollFurther(el, dy) {
      if (!isScrollable(el)) return false;
      if (dy > 0) {
        // downwards: content below
        return Math.ceil(el.scrollTop + el.clientHeight) < el.scrollHeight - 1;
      }
      if (dy < 0) {
        // upwards: content above
        return el.scrollTop > 1;
      }
      return false;
    }

    function wheelInNestedScrollableAllowsNative(target, dy) {
      let node = target instanceof Node ? target : null;
      while (node && node !== document.body && node !== document.documentElement) {
        if (canScrollFurther(node, dy)) return true; // let native scroll
        // If node is scrollable but at edge, continue to parent to possibly flip sections
        node = node.parentNode;
      }
      return false;
    }

    function scrollToElement(targetEl) {
      if (!targetEl) return;
      const top = targetEl.offsetTop;

      // start programmatic scroll & lock
      isProgrammatic = true;
      wheelLock = true;
      lastY = -1; // force first comparison
      stableFrames = 0;

      const cleanup = () => {
        if (quietTimer) {
          clearTimeout(quietTimer);
          quietTimer = null;
        }
        isProgrammatic = false;
        wheelLock = false;
      };

      const finish = () => {
        // Start quiet pause then unlock
        if (quietTimer) clearTimeout(quietTimer);
        quietTimer = setTimeout(() => {
          cleanup();
        }, QUIET_MS);
      };

      // Prefer scrollend if available
      let finished = false;
      const onScrollEnd = () => {
        if (finished) return;
        finished = true;
        window.removeEventListener("scrollend", onScrollEnd);
        finish();
      };
      try {
        window.addEventListener("scrollend", onScrollEnd, { once: true });
      } catch (_) {
        // ignore if not supported
      }

      // Sentinel via rAF: wait for several consecutive frames with stable scrollY
      function watchStable() {
        endWatchRAF = requestAnimationFrame(() => {
          const y = Math.round(window.scrollY);
          if (y === lastY) stableFrames++;
          else {
            stableFrames = 0;
            lastY = y;
          }
          if (!finished && stableFrames >= 6) {
            finished = true;
            try { window.removeEventListener("scrollend", onScrollEnd); } catch (_) {}
            finish();
          } else if (!finished) {
            watchStable();
          }
        });
      }
      watchStable();

      // Safety timeout to ensure we never stay locked
      setTimeout(() => {
        if (!finished) {
          finished = true;
          try { window.removeEventListener("scrollend", onScrollEnd); } catch (_) {}
          finish();
        }
      }, MAX_LOCK_MS);

      // perform smooth scroll
      window.scrollTo({ top, behavior: "smooth" });
      return top;
    }

    function onWheel(e) {
      const dy = e.deltaY || 0;
      const absY = Math.abs(dy);
      const absX = Math.abs(e.deltaX || 0);

      // Only vertical-dominant and meaningful delta
      if (absY <= absX || absY < DELTA_THRESHOLD) return;

      // While programmatic scroll/lock is active, suppress inertia
      if (isProgrammatic || wheelLock) {
        e.preventDefault();
        return;
      }

      const cur = currentIndex();
      const sec = sections[cur];
      if (!sec) return;

      // Give priority to nested scrollables under the cursor
      if (wheelInNestedScrollableAllowsNative(e.target, dy)) {
        // Let native scroll inside nested element
        return;
      }

      const rect = sec.getBoundingClientRect();
      const vh = window.innerHeight;

      if (dy > 0) {
        // down: if bottom still below viewport bottom, allow native scrolling
        if (rect.bottom > vh - EPS) return;
        // flip strictly by direction
        let target = Math.min(sections.length - 1, cur + 1);
        if (target === cur) return;
        e.preventDefault();
        scrollToElement(sections[target]);
      } else if (dy < 0) {
        // up: if top still above (i.e., section scrolled past top), allow native scrolling
        if (rect.top < -EPS) return;
        let target = Math.max(0, cur - 1);
        if (target === cur) return;
        e.preventDefault();
        scrollToElement(sections[target]);
      }
    }

    // Enable behavior only on screens >= 64rem
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
      // Reset flags when disabling
      isProgrammatic = false;
      wheelLock = false;
      if (quietTimer) {
        clearTimeout(quietTimer);
        quietTimer = null;
      }
      if (endWatchRAF) cancelAnimationFrame(endWatchRAF);
      stableFrames = 0;
    }

    if (mq.matches) bindWheel();
    mq.addEventListener?.("change", (e) => {
      if (e.matches) bindWheel();
      else unbindWheel();
    });
  }
});
