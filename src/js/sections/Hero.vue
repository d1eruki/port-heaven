<!-- Первый экран с именем автора и интерактивным персонажем-кликером. -->
<template>
  <section
    ref="heroSectionRef"
    data-section="hero"
    id="hero"
    class="relative z-0 min-h-svh w-full min-w-0 overflow-visible bg-canvas max-lg:select-none max-lg:[-webkit-touch-callout:none]"
    @pointerdown="onHeroPointerDown"
    @pointermove="onHeroPointerMove"
    @pointerup="onHeroPointerUp"
    @pointercancel="cancelHeroPointer"
    @pointerleave="cancelHeroPointer"
    @contextmenu="onHeroContextMenu"
  >
    <div class="relative isolate flex min-h-svh w-full min-w-0 items-end justify-center bg-canvas">
      <div
        ref="heroNameRef"
        class="absolute inset-0 z-1 flex items-end justify-start overflow-hidden px-10 pt-10 pb-26 text-hero max-lg:invisible lg:justify-center lg:px-15 lg:pt-0 lg:pb-[12svh]"
      >
        <div
          class="w-[calc(70svh-5rem)] shrink-0 origin-top-left translate-y-full -rotate-90 text-left lg:w-auto lg:translate-y-0 lg:rotate-0 lg:text-center"
        >
          <h1
            ref="heroTitleRef"
            class="inline-block w-max text-left text-hero-title leading-[normal] [text-box:trim-both_cap_alphabetic] lg:text-center"
          >
            <span
              v-for="(line, index) in t('brand.hero').split('\n')"
              :key="index"
              class="block"
              >{{ line }}</span
            >
          </h1>
        </div>
      </div>
      <div
        class="relative z-2 h-(--hero-height) w-full overflow-hidden [--hero-height:86svh] sm:aspect-3/4 sm:w-auto sm:self-center sm:overflow-visible sm:[--hero-height:90svh] lg:[--hero-height:94svh]"
        data-hero-parallax
        data-speed="0.5"
      >
        <div
          ref="heroPulseRef"
          class="absolute inset-0 max-lg:invisible"
        >
          <button
            ref="heroCharacterRef"
            type="button"
            :disabled="!effectsEnabled"
            :aria-label="t('heroClicker.action')"
            class="absolute top-1/2 left-1/2 z-1 block aspect-3/4 w-[max(100%,calc(var(--hero-height)*3/4))] -translate-1/2 border-0 bg-transparent p-0 select-none enabled:cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent max-lg:pointer-events-none"
            @pointerenter="onHeroPointerEnter"
            @pointerleave="onHeroPointerLeave"
            @click="onHeroKeyboardClick"
          >
            <svg
              viewBox="0 0 1086 1448"
              class="pointer-events-none absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              <image :href="heroEyesWhiteImage" width="1086" height="1448" />
              <image
                v-for="eye in heroEyes"
                :key="eye.name"
                :href="eye.src"
                :x="eye.x"
                :y="eye.y"
                :width="eye.width"
                :height="eye.height"
                :transform="`translate(${gaze.x * eye.travelX} ${gaze.y * eye.travelY})`"
              />
            </svg>
            <picture class="relative block max-lg:pointer-events-none">
              <source
                v-for="source in heroImage.sources"
                :key="source.type"
                :type="source.type"
                :srcset="source.srcset"
                sizes="(min-width: 1024px) 76.14svh, (min-width: 640px) 72.9svh, max(100vw, 69.66svh)"
              />
              <img
                :src="heroImage.src"
                :width="heroImage.width"
                :height="heroImage.height"
                class="block h-auto w-full"
                alt=""
                fetchpriority="high"
                decoding="sync"
                loading="eager"
                draggable="false"
                @load="isHeroImageReady = true"
              />
            </picture>
            <svg
              v-if="effectsEnabled"
              viewBox="0 0 1086 1448"
              class="pointer-events-none absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              <image
                :href="heroEyesClosedImage"
                x="438"
                y="232"
                width="142"
                height="91"
                :opacity="canBlink && isBlinking ? 1 : 0"
                @load="isClosedImageReady = true"
                @error="isClosedImageReady = false"
              />
              <image
                :href="heroMouthTongueImage"
                x="500"
                y="312"
                width="64"
                height="60"
                :opacity="showTongue ? 1 : 0"
              />
            </svg>
          </button>
        </div>
      </div>
      <div
        v-if="effectsEnabled && isMobile && clicks > 0"
        class="pointer-events-none absolute inset-x-10 bottom-26 z-1 h-0"
      >
        <p
          class="absolute bottom-0 left-full w-max origin-bottom-left -rotate-90 scale-200 text-center font-heading text-feature-stat leading-none font-black text-link/50 tabular-nums [text-box:trim-both_cap_alphabetic]"
        >
          {{ clicks === 67 ? "сикс севен" : clicks }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import fitty from "fitty";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useDocumentVisibility, useElementVisibility } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import { getBreakpointPx } from "../utils/breakpoints";
import { gsap } from "../libraries/gsap-scroll";
import { effectsEnabled } from "../features/preferences/effects-toggle";
import heroCharacterDarkImage from "../../assets/hero/hero-character-dark.png?responsive";
import heroCharacterLightImage from "../../assets/hero/hero-character-light.png?responsive";
import heroEyesClosedImage from "../../assets/hero/hero-eyes-closed.png";
import heroEyesWhiteImage from "../../assets/hero/hero-eyes-white.png";
import heroIrisLeftImage from "../../assets/hero/hero-iris-left.png";
import heroIrisRightImage from "../../assets/hero/hero-iris-right.png";
import heroMouthTongueImage from "../../assets/hero/hero-mouth-tongue.png";

const { t } = useI18n();
const emit = defineEmits(["intro-ready"]);
const props = defineProps({
  currentTheme: {
    type: String,
    required: true,
  },
});
const isHeroHovered = ref(false);
const isHeroPressed = ref(false);
const clicks = ref(0);
const isMobile = ref(false);
const heroSectionRef = ref(null);
const heroCharacterRef = ref(null);
const heroNameRef = ref(null);
const heroPulseRef = ref(null);
const isHeroImageReady = ref(false);
const heroTitleRef = ref(null);
const isHeroTitleReady = ref(false);
const isHeroCharacterRevealed = ref(false);
const isHeroCharacterAppeared = ref(false);
const isHeroCharacterReady = computed(
  () => isHeroCharacterRevealed.value && isHeroImageReady.value,
);
const hasHeroInteraction = ref(false);
const isBlinking = ref(false);
const isClosedImageReady = ref(false);
const isHeroVisible = useElementVisibility(heroSectionRef);
const documentVisibility = useDocumentVisibility();
// Положение радужек внутри экспортированного слоя Eyes из Figma.
const heroEyes = [
  {
    name: "left",
    src: heroIrisLeftImage,
    x: 469,
    y: 279.97265625,
    width: 21,
    height: 21,
    travelX: 3,
    travelY: 2.5,
  },
  {
    name: "right",
    src: heroIrisRightImage,
    x: 528,
    y: 243.97265625,
    width: 27,
    height: 26,
    travelX: 5,
    travelY: 4,
  },
];
const gaze = ref({ x: 0, y: 0 });
const canTrackEyes = computed(
  () =>
    effectsEnabled.value &&
    isHeroCharacterReady.value &&
    isHeroVisible.value &&
    documentVisibility.value === "visible",
);
const showTongue = computed(
  () => effectsEnabled.value && (isMobile.value ? isHeroPressed.value : isHeroHovered.value),
);
const canBlink = computed(
  () =>
    effectsEnabled.value &&
    isHeroCharacterReady.value &&
    isHeroVisible.value &&
    documentVisibility.value === "visible" &&
    isClosedImageReady.value,
);
let heroTitleFit;
let mobileMedia;
let blinkTimer;
let heroPointer;
let introPulse;
let hasPlayedIntroPulse = false;
let gazeFrame;
let gazeTarget = { x: 0, y: 0 };
let pendingGazePoint;
let gazeTap;
let lastGazeTime;

const resetGaze = () => {
  window.cancelAnimationFrame(gazeFrame);
  gazeFrame = undefined;
  pendingGazePoint = undefined;
  gazeTap = undefined;
  lastGazeTime = undefined;
  gazeTarget = { x: 0, y: 0 };
  gaze.value = { x: 0, y: 0 };
};

const animateGaze = (time) => {
  gazeFrame = undefined;
  if (!canTrackEyes.value) return;
  if (pendingGazePoint) {
    if (!isPointerInsideHero(pendingGazePoint)) {
      resetGaze();
      return;
    }
    const bounds = heroCharacterRef.value.getBoundingClientRect();
    const scale = bounds.width / 1086;
    if (scale <= 0) {
      resetGaze();
      return;
    }
    const x = (pendingGazePoint.clientX - bounds.left - 509 * scale) / (260 * scale);
    const y = (pendingGazePoint.clientY - bounds.top - 277 * scale) / (260 * scale);
    const distance = Math.max(1, Math.hypot(x, y));
    gazeTarget = { x: x / distance, y: y / distance };
    pendingGazePoint = undefined;
  }
  const blend = 1 - Math.exp(-Math.min(time - (lastGazeTime ?? time - 16), 64) / 65);
  lastGazeTime = time;
  const x = gaze.value.x + (gazeTarget.x - gaze.value.x) * blend;
  const y = gaze.value.y + (gazeTarget.y - gaze.value.y) * blend;
  if (Math.hypot(gazeTarget.x - x, gazeTarget.y - y) < 0.005) {
    gaze.value = { ...gazeTarget };
    lastGazeTime = undefined;
    return;
  }
  gaze.value = { x, y };
  gazeFrame = window.requestAnimationFrame(animateGaze);
};

const lookAtPointer = (event) => {
  pendingGazePoint = { clientX: event.clientX, clientY: event.clientY };
  if (gazeFrame === undefined) gazeFrame = window.requestAnimationFrame(animateGaze);
};

const isPointerInsideHero = (event) => {
  const bounds = heroSectionRef.value.getBoundingClientRect();
  return (
    event.clientX >= bounds.left &&
    event.clientX <= bounds.right &&
    event.clientY >= bounds.top &&
    event.clientY <= bounds.bottom
  );
};

const onGazePointerDown = (event) => {
  gazeTap = undefined;
  if (event.pointerType === "mouse" || !event.isPrimary || event.button !== 0) return;
  if (isPointerInsideHero(event)) {
    gazeTap = { id: event.pointerId, x: event.clientX, y: event.clientY };
  }
};

const onGazePointerMove = (event) => {
  if (event.pointerType === "mouse") {
    lookAtPointer(event);
  } else if (gazeTap?.id === event.pointerId) {
    if (Math.abs(event.clientX - gazeTap.x) > 3 || Math.abs(event.clientY - gazeTap.y) > 3) {
      gazeTap = undefined;
    }
  }
};

const onGazePointerUp = (event) => {
  onGazePointerMove(event);
  if (gazeTap?.id !== event.pointerId) return;
  gazeTap = undefined;
  if (isPointerInsideHero(event)) lookAtPointer(event);
};

const onGazePointerLeave = (event) => {
  // После тапа pointerleave тоже приходит: сохраняем выбранное направление взгляда.
  if (event.pointerType === "mouse" && event.target === document.documentElement) resetGaze();
};

watch(canTrackEyes, (enabled, _previous, onCleanup) => {
  resetGaze();
  if (!enabled) {
    cancelHeroPointer();
    return;
  }
  const options = { passive: true, capture: true };
  const listeners = [
    [window, "pointerdown", onGazePointerDown],
    [window, "pointermove", onGazePointerMove],
    [window, "pointerup", onGazePointerUp],
    [window, "pointercancel", resetGaze],
    [window, "blur", onHeroBlur],
    [window, "resize", resetGaze],
    [document.documentElement, "pointerleave", onGazePointerLeave],
  ];
  for (const [target, type, listener] of listeners) target.addEventListener(type, listener, options);
  onCleanup(() => {
    for (const [target, type, listener] of listeners) target.removeEventListener(type, listener, options);
    resetGaze();
  });
});

watch(
  [isHeroTitleReady, isHeroImageReady],
  ([titleReady, imageReady]) => {
    if (titleReady && imageReady) emit("intro-ready");
  },
  { flush: "post" },
);

const canPlayIntroPulse = computed(
  () =>
    effectsEnabled.value &&
    isMobile.value &&
    isHeroCharacterAppeared.value &&
    isHeroVisible.value &&
    documentVisibility.value === "visible" &&
    !hasHeroInteraction.value,
);

const stopHeroPulse = () => {
  introPulse?.kill();
  introPulse = undefined;
  if (heroPulseRef.value) gsap.set(heroPulseRef.value, { clearProps: "transform" });
};

watch(
  canPlayIntroPulse,
  (enabled) => {
    stopHeroPulse();
    if (!enabled || !heroPulseRef.value) return;
    introPulse = gsap.timeline({
      delay: hasPlayedIntroPulse ? 10 : 0,
      repeat: -1,
      repeatDelay: 9.1,
      defaults: { ease: "sine.inOut" },
    })
      .to(heroPulseRef.value, { scale: 1.04, duration: 0.162 })
      .to(heroPulseRef.value, { scale: 1, duration: 0.162 })
      .to(heroPulseRef.value, { scale: 1.025, duration: 0.144 })
      .to(heroPulseRef.value, { scale: 1, duration: 0.216 })
      .to(heroPulseRef.value, { scale: 1, duration: 0.216 });
    hasPlayedIntroPulse = true;
  },
  { flush: "post" },
);

const registerHeroClick = () => {
  if (!effectsEnabled.value || !isMobile.value) return;
  hasHeroInteraction.value = true;
  if (clicks.value < Number.MAX_SAFE_INTEGER) {
    clicks.value += 1;
  }
};

const onHeroKeyboardClick = (event) => {
  if (event.isTrusted && event.detail === 0) registerHeroClick();
};

watch(effectsEnabled, (enabled) => {
  if (enabled) return;
  cancelHeroPointer();
  isHeroHovered.value = false;
  isHeroPressed.value = false;
  isClosedImageReady.value = false;
});

const stopBlinking = () => {
  window.clearTimeout(blinkTimer);
  isBlinking.value = false;
};

const blink = (remaining) => {
  if (!canBlink.value) return;
  isBlinking.value = true;
  blinkTimer = window.setTimeout(() => {
    isBlinking.value = false;
    if (!canBlink.value) return;
    if (remaining > 1) {
      blinkTimer = window.setTimeout(() => blink(remaining - 1), 120);
    } else {
      scheduleBlink();
    }
  }, 120);
};

const scheduleBlink = () => {
  blinkTimer = window.setTimeout(
    () => blink(Math.random() < 0.5 ? 2 : 1),
    3000 + Math.random() * 3000,
  );
};

watch(canBlink, (enabled) => {
  stopBlinking();
  if (enabled) scheduleBlink();
});

const syncHeroTitleFit = () => {
  cancelHeroPointer();
  isMobile.value = mobileMedia?.matches ?? false;
  isHeroHovered.value = false;
  isHeroPressed.value = false;
  heroTitleFit?.unsubscribe();
  heroTitleFit = null;

  if (!mobileMedia?.matches || !heroTitleRef.value) return;

  heroTitleFit = fitty(heroTitleRef.value, {
    minSize: 1,
    maxSize: Number.POSITIVE_INFINITY,
    multiLine: false,
  });
  heroTitleFit.fit({ sync: true });
};

const onHeroPointerEnter = (event) => {
  if (effectsEnabled.value && !isMobile.value && event.pointerType === "mouse") {
    isHeroHovered.value = true;
  }
};

const cancelHeroPointer = () => {
  heroPointer = null;
  isHeroPressed.value = false;
};

const onHeroPointerLeave = () => {
  isHeroHovered.value = false;
};

const onHeroContextMenu = (event) => {
  if (isMobile.value) event.preventDefault();
};

const onHeroBlur = () => {
  cancelHeroPointer();
  resetGaze();
};

const onHeroPointerDown = (event) => {
  cancelHeroPointer();
  if (!effectsEnabled.value || !isMobile.value || !event.isPrimary || event.button !== 0) return;
  hasHeroInteraction.value = true;
  heroPointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
  isHeroPressed.value = true;
};

const onHeroPointerMove = (event) => {
  if (heroPointer?.id !== event.pointerId) return;
  // Match the scroll normalizer's drag threshold so scrolling never becomes a tap.
  if (Math.abs(event.clientX - heroPointer.x) > 3 || Math.abs(event.clientY - heroPointer.y) > 3) {
    cancelHeroPointer();
  }
};

const onHeroPointerUp = (event) => {
  onHeroPointerMove(event);
  if (heroPointer?.id !== event.pointerId) return;
  cancelHeroPointer();
  registerHeroClick();
};

onMounted(async () => {
  mobileMedia = window.matchMedia(`(width < ${getBreakpointPx("lg")}px)`);
  mobileMedia.addEventListener("change", syncHeroTitleFit);
  syncHeroTitleFit();

  try {
    await document.fonts.load('900 16px "Bounded"', t("brand.hero"));
  } catch (error) {
    console.warn("Hero title font could not be loaded; using the fallback font.", error);
  }

  if (!heroTitleRef.value) return;
  heroTitleFit?.fit({ sync: true });
  isHeroTitleReady.value = true;
});

onBeforeUnmount(() => {
  stopHeroPulse();
  stopBlinking();
  mobileMedia?.removeEventListener("change", syncHeroTitleFit);
  heroTitleFit?.unsubscribe();
  heroTitleFit = null;
});

defineExpose({
  getIntroTargets: () => ({
    section: heroSectionRef.value,
    name: heroNameRef.value,
    character: heroPulseRef.value,
  }),
  revealCharacter: () => {
    isHeroCharacterRevealed.value = true;
  },
  completeIntro: () => {
    isHeroCharacterRevealed.value = true;
    isHeroCharacterAppeared.value = true;
  },
});

const heroImage = computed(() =>
  props.currentTheme === "dark" ? heroCharacterDarkImage : heroCharacterLightImage,
);
</script>
