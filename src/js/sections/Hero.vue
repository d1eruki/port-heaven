<!-- Первый экран с именем автора и интерактивным персонажем-кликером. -->
<template>
  <section
    ref="heroSectionRef"
    data-section="hero"
    id="hero"
    class="relative z-0 min-h-svh w-full min-w-0 overflow-visible bg-canvas"
  >
    <div class="relative isolate flex min-h-svh w-full min-w-0 items-end justify-center bg-canvas">
      <div
        class="absolute inset-0 z-1 flex items-end justify-start overflow-hidden px-10 pt-10 pb-26 text-hero lg:justify-center lg:px-0 lg:pt-0 lg:pb-[12svh]"
      >
        <div
          class="w-[calc(60svh-5rem)] shrink-0 origin-top-left translate-y-full -rotate-90 text-left lg:w-auto lg:translate-y-0 lg:rotate-0 lg:text-center"
        >
          <h1
            ref="heroTitleRef"
            :class="{ invisible: !isHeroTitleReady }"
            class="inline-block w-max text-left text-hero-title leading-[0.75] lg:text-center"
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
        <button
          type="button"
          :disabled="!effectsEnabled"
          :aria-label="t('heroClicker.action')"
          class="absolute top-1/2 left-1/2 block aspect-3/4 w-[max(100%,calc(var(--hero-height)*3/4))] -translate-1/2 border-0 bg-transparent p-0 select-none enabled:cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          @pointerenter="onHeroPointerEnter"
          @pointerleave="onHeroPointerLeave"
          @pointerdown="onHeroPointerDown"
          @pointermove="onHeroPointerMove"
          @pointerup="onHeroPointerUp"
          @pointercancel="cancelHeroPointer"
          @click="onHeroKeyboardClick"
        >
          <picture>
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
        <p
          v-if="effectsEnabled && isMobile"
          class="pointer-events-none absolute top-0 left-1/2 z-3 w-max max-w-[90%] -translate-x-1/2 text-center font-heading font-black text-primary tabular-nums max-sm:top-[14%] max-sm:left-[74%]"
        >
          {{ clicks === 0 ? t('heroClicker.hint') : clicks }}
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
import { effectsEnabled } from "../features/preferences/effects-toggle";
import heroCharacterDarkImage from "../../assets/hero/hero-character-dark.png?responsive";
import heroCharacterLightImage from "../../assets/hero/hero-character-light.png?responsive";
import heroEyesClosedImage from "../../assets/hero/hero-eyes-closed.png";
import heroMouthTongueImage from "../../assets/hero/hero-mouth-tongue.png";

const { t } = useI18n();
const props = defineProps({
  currentTheme: {
    type: String,
    required: true,
  },
});
const isHeroHovered = ref(false);
const isHeroTapped = ref(false);
const clicks = ref(0);
const isMobile = ref(false);
const heroSectionRef = ref(null);
const heroTitleRef = ref(null);
const isHeroTitleReady = ref(false);
const isBlinking = ref(false);
const isClosedImageReady = ref(false);
const isHeroVisible = useElementVisibility(heroSectionRef);
const documentVisibility = useDocumentVisibility();
const showTongue = computed(
  () => effectsEnabled.value && (isMobile.value ? isHeroTapped.value : isHeroHovered.value),
);
const canBlink = computed(
  () =>
    effectsEnabled.value &&
    isHeroVisible.value &&
    documentVisibility.value === "visible" &&
    isClosedImageReady.value,
);
let heroTitleFit;
let isHeroTitleFontReady = false;
let mobileMedia;
let blinkTimer;
let heroPointer;

const registerHeroClick = () => {
  if (!effectsEnabled.value || !isMobile.value) return;
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
  isHeroTapped.value = false;
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
  isHeroTapped.value = false;
  heroTitleFit?.unsubscribe();
  heroTitleFit = null;

  if (!isHeroTitleFontReady || !mobileMedia?.matches) return;

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
};

const onHeroPointerLeave = () => {
  isHeroHovered.value = false;
  cancelHeroPointer();
};

const onHeroPointerDown = (event) => {
  cancelHeroPointer();
  if (!effectsEnabled.value || !isMobile.value || !event.isPrimary || event.button !== 0) return;
  heroPointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
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
  if (isMobile.value) isHeroTapped.value = !isHeroTapped.value;
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
  isHeroTitleFontReady = true;
  syncHeroTitleFit();
  isHeroTitleReady.value = true;
});

onBeforeUnmount(() => {
  stopBlinking();
  mobileMedia?.removeEventListener("change", syncHeroTitleFit);
  heroTitleFit?.unsubscribe();
  heroTitleFit = null;
});

const heroImage = computed(() =>
  props.currentTheme === "dark" ? heroCharacterDarkImage : heroCharacterLightImage,
);
</script>
