import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Basic stacked cards animation for .projects containers with .project items
// The next card slides up from bottom and overlaps the previous one while scrolling.
(function initProjectStack() {
  const setup = () => {
    const containers = document.querySelectorAll('.projects');
    if (!containers.length) return;

    containers.forEach((container) => {
      // Avoid double-initialization
      if (container.__stackedInit) return;
      // Skip nested .projects (we only want the top-level stack container)
      if (container.parentElement && container.parentElement.closest('.projects')) return;

      // Treat each direct child element as a card (works with <project> custom elements too)
      const cards = Array.from(container.children);
      if (cards.length < 2) return; // need at least 2 to stack

      container.__stackedInit = true;

      // Ensure container can host absolutely positioned children
      const cs = window.getComputedStyle(container);
      if (cs.position === 'static') {
        container.style.position = 'relative';
      }

      // Place cards in a stack
      gsap.set(cards, {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      });

      cards.forEach((card, i) => {
        gsap.set(card, {
          yPercent: i === 0 ? 0 : 100,
          zIndex: 100 + i // later cards should be above earlier ones
        });
      });

      // Set container height to the tallest card to prevent collapse
      const setContainerHeight = () => {
        let maxH = 0;
        cards.forEach((c) => {
          // if the card is translated down it still has same offsetHeight
          maxH = Math.max(maxH, c.offsetHeight);
        });
        if (maxH) container.style.height = maxH + 'px';
      };
      setContainerHeight();

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => '+=' + Math.max(1, (cards.length - 1)) * 500,
          scrub: true,
          pin: true,
          anticipatePin: 1
        }
      });

      // Each subsequent card slides up to cover the previous
      cards.forEach((card, i) => {
        if (i === 0) return;
        tl.to(card, { yPercent: 0, ease: 'power2.out', duration: 1 }, i - 1);
      });

      // Refresh on resize and when ScrollTrigger refreshes
      const refresh = () => {
        setContainerHeight();
        ScrollTrigger.refresh();
      };
      const debounced = gsap.utils.debounce(refresh, 150);
      window.addEventListener('resize', debounced);
      ScrollTrigger.addEventListener('refreshInit', setContainerHeight);
    });
  };

  // Run after DOM ready, and try again on next tick (Vue may render after DOMContentLoaded)
  const ready = () => {
    setup();
    // Try a couple of delayed setups to catch late-mounted content without heavy observers
    setTimeout(setup, 50);
    setTimeout(setup, 250);
    setTimeout(setup, 1000);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();
