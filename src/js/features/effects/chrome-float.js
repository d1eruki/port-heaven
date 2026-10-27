import { onScopeDispose, watch } from "vue";
import { useDocumentVisibility, useElementVisibility } from "@vueuse/core";
import { gsap } from "../../libraries/gsap-scroll";
import { effectsEnabled } from "../preferences/effects-toggle";

const motions = {
  loop: { lift: 2, rotation: 1.2, duration: 5.2 },
  blob: { lift: 3, rotation: -1.5, duration: 5.8 },
  wave: { lift: 4, rotation: 1, duration: 6.4 },
};

// Мягкое парение декора с паузой вне экрана.
export const useChromeFloat = (target, variant) => {
  const isVisible = useElementVisibility(() => target.value?.parentElement);
  const visibility = useDocumentVisibility();
  const motion = motions[variant];
  let context;
  let timeline;

  const reset = () => {
    context?.revert();
    context = undefined;
    timeline = undefined;
  };

  watch(
    [target, effectsEnabled],
    ([element, enabled]) => {
      reset();
      if (!element || !enabled) return;

      context = gsap.context(() => {
        timeline = gsap.timeline({ paused: true });
        const oscillation = { repeat: -1, yoyo: true, ease: "sine.inOut" };
        timeline
          .to(element, { y: -motion.lift, duration: motion.duration, ...oscillation }, 0)
          .to(
            element,
            { rotation: motion.rotation, duration: motion.duration * 1.3, ...oscillation },
            0,
          )
          .to(element, { scale: 1.01, duration: motion.duration * 0.9, ...oscillation }, 0);
      }, element);
      timeline.paused(!isVisible.value || visibility.value !== "visible");
    },
    { flush: "post", immediate: true },
  );

  watch([isVisible, visibility], ([visible, pageVisibility]) => {
    timeline?.paused(!visible || pageVisibility !== "visible");
  });

  onScopeDispose(reset);
};
