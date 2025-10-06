document.addEventListener("DOMContentLoaded", function () {
  const sections = Array.from(document.querySelectorAll("[data-section]"));

  if (sections.length) {
    // Pure JS section flipping with strict direction and inertia suppression
    const EPS = 5; // boundary epsilon (5 px for HiDPI/inertia)
    const DELTA_THRESHOLD = 2; // ignore tiny deltas/noise

    let isProgrammatic = false; // we're running a smooth scroll we initiated
    let wheelLock = false; // general lock to avoid rapid flips
    let quietTimer = null; // extra 200ms quiet period after scroll stops
    let endWatchRAF = 0; // rAF id for stable scrollY sentinel
    let lastY = 0;
    let stableFrames = 0;

    const QUIET_MS = 200; // "тихая пауза"
    const MAX_LOCK_MS = 800; // upper bound for total lock duration

    // Track and update active navigation button
    let lastActiveSection = null;
    function updateActiveNavButton() {
      const idx = currentIndex();
      const currentSection = sections[idx];
      if (!currentSection) return;

      const sectionName = currentSection.getAttribute("data-section");
      if (sectionName === lastActiveSection) return;

      lastActiveSection = sectionName;

      // Remove active class from all nav buttons
      const navButtons = document.querySelectorAll("[data-scroll-target]");
      navButtons.forEach((btn) => {
        btn.classList.remove("!text-white");
      });

      // Add active class to current section's nav button
      const activeButton = document.querySelector(`[data-scroll-target="[data-section='${sectionName}']"]`);
      if (activeButton) {
        activeButton.classList.add("!text-white");
      }
    }

    function currentIndex() {
      // Determine current section based on which one is entering/visible in viewport
      const y = window.scrollY;
      const vh = window.innerHeight;
      const threshold = vh * 0.3; // Section becomes active when it's 30% into viewport

      let idx = 0;
      for (let i = 0; i < sections.length; i++) {
        const sectionTop = sections[i].offsetTop;
        const sectionBottom = sectionTop + sections[i].offsetHeight;

        // Check if section top has entered the viewport from bottom
        // or if we're already past this section
        if (sectionTop <= y + vh - threshold) {
          idx = i;
        }
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
        try {
          window.removeEventListener("scrollend", onScrollEnd);
        } catch (_) {}
        if (endWatchRAF) {
          cancelAnimationFrame(endWatchRAF);
          endWatchRAF = 0;
        }
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
            try {
              window.removeEventListener("scrollend", onScrollEnd);
            } catch (_) {}
            if (endWatchRAF) {
              cancelAnimationFrame(endWatchRAF);
              endWatchRAF = 0;
            }
            finish();
          } else if (!finished) {
            watchStable();
          } else {
            // finished elsewhere, clear raf id
            if (endWatchRAF) {
              cancelAnimationFrame(endWatchRAF);
            }
            endWatchRAF = 0;
          }
        });
      }
      watchStable();

      // Safety timeout to ensure we never stay locked
      setTimeout(() => {
        if (!finished) {
          finished = true;
          try {
            window.removeEventListener("scrollend", onScrollEnd);
          } catch (_) {}
          if (endWatchRAF) {
            cancelAnimationFrame(endWatchRAF);
            endWatchRAF = 0;
          }
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

      // Only vertical-dominant and meaningful delta: vertical must be at least 2x horizontal
      if (absY < DELTA_THRESHOLD || absY < 2 * absX) return;

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
        // Immediately set programmatic flags to suppress touchpad inertia
        isProgrammatic = true;
        wheelLock = true;
        scrollToElement(sections[target]);
      } else if (dy < 0) {
        // up: if top still above (i.e., section scrolled past top), allow native scrolling
        if (rect.top < -EPS) return;
        let target = Math.max(0, cur - 1);
        if (target === cur) return;
        e.preventDefault();
        // Immediately set programmatic flags to suppress touchpad inertia
        isProgrammatic = true;
        wheelLock = true;
        scrollToElement(sections[target]);
      }
    }

    // Enable behavior only on screens >= 64rem
    const mq = window.matchMedia("(min-width: 64rem)");
    let isBound = false;
    let resizeTimer = null;

    function alignCurrentSection() {
      if (!sections.length) return;
      const idx = currentIndex();
      const target = sections[idx];
      if (!target) return;
      const desiredTop = target.offsetTop;
      const diff = Math.abs(Math.round(window.scrollY) - Math.round(desiredTop));
      if (diff > EPS) {
        // Gentle align using programmatic scrolling
        scrollToElement(target);
      }
    }

    function onResizeDebounced() {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (isProgrammatic || wheelLock) return;
        alignCurrentSection();
      }, 120);
    }

    function bindWheel() {
      if (!isBound) {
        window.addEventListener("wheel", onWheel, { passive: false });
        window.addEventListener("resize", onResizeDebounced);
        isBound = true;
      }
    }
    function unbindWheel() {
      if (isBound) {
        window.removeEventListener("wheel", onWheel, { passive: false });
        window.removeEventListener("resize", onResizeDebounced);
        isBound = false;
      }
      // Reset flags when disabling
      isProgrammatic = false;
      wheelLock = false;
      if (quietTimer) {
        clearTimeout(quietTimer);
        quietTimer = null;
      }
      if (resizeTimer) {
        clearTimeout(resizeTimer);
        resizeTimer = null;
      }
      if (endWatchRAF) {
        cancelAnimationFrame(endWatchRAF);
        endWatchRAF = 0;
      }
      stableFrames = 0;
    }

    if (mq.matches) bindWheel();
    mq.addEventListener?.("change", (e) => {
      if (e.matches) bindWheel();
      else unbindWheel();
    });

    // Update active nav button on scroll
    let scrollTimer = null;
    window.addEventListener(
      "scroll",
      () => {
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          updateActiveNavButton();
        }, 50);
      },
      { passive: true },
    );

    // Set initial active nav button
    setTimeout(() => {
      updateActiveNavButton();
    }, 100);
  }
});
