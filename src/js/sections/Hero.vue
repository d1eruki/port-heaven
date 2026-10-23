<!-- Первый экран с именем автора и изображением персонажа. -->
<template>
  <section
    ref="heroSectionRef"
    data-section="hero"
    id="hero"
    class="relative z-0 min-h-svh w-full min-w-0 overflow-visible bg-canvas"
  >
    <div class="relative isolate flex min-h-svh w-full min-w-0 items-end justify-center bg-canvas">
      <div
        class="absolute inset-0 z-1 flex items-center justify-center overflow-hidden px-10 text-hero lg:items-end lg:px-0 lg:pb-[12svh]"
      >
        <div class="w-full text-center lg:w-auto">
          <h1
            ref="heroTitleRef"
            class="inline-block w-max text-center text-hero-title leading-[0.75]"
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
        class="relative z-2 h-(--hero-height) w-full self-center overflow-hidden [--hero-height:86svh] sm:aspect-3/4 sm:w-auto sm:overflow-visible sm:[--hero-height:90svh] lg:[--hero-height:94svh]"
        data-hero-parallax
        data-speed="0.5"
        @pointerenter="onHeroPointerEnter"
        @pointerleave="isHeroHovered = false"
        @click="toggleHeroImage"
      >
        <div
          class="absolute top-1/2 left-1/2 aspect-3/4 w-[max(100%,calc(var(--hero-height)*3/4))] -translate-1/2"
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
            />
          </picture>
          <svg
            viewBox="0 0 1086 1448"
            class="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <image
              v-if="effectsEnabled"
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
        </div>
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
const isMobile = ref(false);
const heroSectionRef = ref(null);
const heroTitleRef = ref(null);
const isBlinking = ref(false);
const isClosedImageReady = ref(false);
const isHeroVisible = useElementVisibility(heroSectionRef);
const documentVisibility = useDocumentVisibility();
const showTongue = computed(() => (isMobile.value ? isHeroTapped.value : isHeroHovered.value));
const canBlink = computed(
  () =>
    effectsEnabled.value &&
    isHeroVisible.value &&
    documentVisibility.value === "visible" &&
    isClosedImageReady.value &&
    !showTongue.value,
);
let heroTitleFit;
let mobileMedia;
let blinkTimer;

const stopBlinking = () => {
  window.clearTimeout(blinkTimer);
  isBlinking.value = false;
};

const scheduleBlink = () => {
  blinkTimer = window.setTimeout(
    () => {
      if (!canBlink.value) return;
      isBlinking.value = true;
      blinkTimer = window.setTimeout(() => {
        isBlinking.value = false;
        if (canBlink.value) scheduleBlink();
      }, 120);
    },
    3000 + Math.random() * 3000,
  );
};

watch(canBlink, (enabled) => {
  stopBlinking();
  if (enabled) scheduleBlink();
});

const syncHeroTitleFit = () => {
  isMobile.value = mobileMedia?.matches ?? false;
  isHeroHovered.value = false;
  isHeroTapped.value = false;
  heroTitleFit?.unsubscribe();
  heroTitleFit = null;

  if (!mobileMedia?.matches) return;

  heroTitleFit = fitty(heroTitleRef.value, {
    minSize: 1,
    maxSize: Number.POSITIVE_INFINITY,
    multiLine: false,
  });
};

const onHeroPointerEnter = (event) => {
  if (!isMobile.value && event.pointerType === "mouse") {
    isHeroHovered.value = true;
  }
};

const toggleHeroImage = () => {
  if (isMobile.value) isHeroTapped.value = !isHeroTapped.value;
};

onMounted(() => {
  mobileMedia = window.matchMedia(`(width < ${getBreakpointPx("lg")}px)`);
  mobileMedia.addEventListener("change", syncHeroTitleFit);
  syncHeroTitleFit();
  document.fonts.ready.then(() => heroTitleFit?.fit());
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
