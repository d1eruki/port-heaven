import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;
window.ScrollSmoother = ScrollSmoother;

const smoother = ScrollSmoother.create({
  wrapper: "#smooth-wrapper",
  content: "#smooth-content",
  smooth: 1,
  effects: true,
  smoothTouch: 0.1,
});

const pinHeader = ScrollTrigger.create({
  trigger: "header",
  start: "top top",
  endTrigger: "body",
  end: "bottom top",
  pin: true,
  pinSpacing: false,
  anticipatePin: 1,
  invalidateOnRefresh: true,
});

gsap.utils.toArray("section .pin").forEach((el) => {
  const section = el.closest("section");

  const st = ScrollTrigger.create({
    trigger: el,
    start: "top top",
    endTrigger: section,
    end: "bottom top",
    pin: true,
    pinSpacing: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    pinnedContainer: "#smooth-content",
  });
  if (st.pin) smoother.effects(st.pin, { speed: 0 });
});

// Creatives section scroll - wait for Vue to render
function initCreativesScroll() {
  const creativesWrapper = document.querySelector(".creatives-wrapper");
  const creativesContainer = document.querySelector(".container-creatives");
  const creativesSection = document.getElementById("creatives");

  console.log("🔍 DEBUG Creatives Section:");
  console.log("creativesWrapper:", creativesWrapper);
  console.log("creativesContainer:", creativesContainer);
  console.log("creativesSection:", creativesSection);

  if (creativesWrapper && creativesContainer && creativesSection) {
    // Wait a bit more for images and content to load
    setTimeout(() => {
      const creativesHeight = creativesContainer.scrollHeight;
      const sectionHeight = window.innerHeight;

      console.log("📏 Heights (after delay):");
      console.log("creativesHeight (scrollHeight):", creativesHeight);
      console.log("sectionHeight:", sectionHeight);
      console.log("Difference:", creativesHeight - sectionHeight);
      console.log("Y animation will be:", -(creativesHeight - sectionHeight));

      if (creativesHeight > sectionHeight) {
        const scrollTriggerConfig = {
          trigger: creativesWrapper,
          start: "top top",
          endTrigger: creativesSection,
          end: "bottom top",
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          pinnedContainer: "#smooth-content",
          onEnter: () => console.log("✅ ScrollTrigger ENTERED"),
          onLeave: () => console.log("❌ ScrollTrigger LEFT"),
          onUpdate: (self) => console.log("🔄 Progress:", self.progress.toFixed(2)),
          onRefresh: () => {
            console.log("🔄 ScrollTrigger REFRESHED, new height:", creativesContainer.scrollHeight);
          },
        };

        console.log("⚙️ ScrollTrigger config:", scrollTriggerConfig);

        const animation = gsap.to(creativesContainer, {
          y: -(creativesHeight - sectionHeight),
          ease: "none",
          scrollTrigger: scrollTriggerConfig,
        });

        console.log("🎬 Animation created:", animation);

        // Tell ScrollSmoother not to apply smooth effects to pinned wrapper
        if (animation.scrollTrigger && animation.scrollTrigger.pin) {
          smoother.effects(animation.scrollTrigger.pin, { speed: 0 });
          console.log("✅ Added smoother effects to pinned element");
        }
      } else {
        console.warn("⚠️ Content is too short, no scroll needed");
      }
    }, 500);
  }
}

// Initialize after a delay to let Vue render
setTimeout(initCreativesScroll, 100);

gsap.utils.toArray(".project").forEach((el, i) => {
  const st = ScrollTrigger.create({
    trigger: el,
    start: "top top",
    end: "bottom top",
    pin: true,
    pinSpacing: false,
    anticipatePin: 1,
    invalidateOnRefresh: true,
  });
  if (st.pin) smoother.effects(st.pin, { speed: 0 });
});

if (pinHeader.pin) smoother.effects(pinHeader.pin, { speed: 0 });

window.addEventListener("load", () => ScrollTrigger.refresh());
